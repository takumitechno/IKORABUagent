"""Narration synthesis with swappable backends and an on-disk cache.

Backend is chosen with TTS_BACKEND:
  fish      Fish Audio API  (needs FISH_API_KEY, FISH_VOICE_ID; host api.fish.audio; optional FISH_MODEL list)
  voicevox  VOICEVOX CORE   (needs VOICEVOX_DIR with onnxruntime/dict/vvm; VOICEVOX_STYLE_ID)
  kokoro    Kokoro-82M ONNX (KOKORO_DIR with kokoro-quantized.onnx, tokenizer.json, voices/*.bin;
            KOKORO_VOICE, default jm_kumo = Japanese male). Japanese G2P via misaki (cutlet).
  clips     pre-recorded takes split per line (CLIPS_DIRS=dir1:dir2, each with index.json text -> .npy at 48 kHz),
            e.g. narration generated on the Fish Audio website; tempo applied with ffmpeg (pitch preserved)
  openjtalk local OpenJTalk (bundled female voice only; timing drafts)
"""
import hashlib
import io
import os
import wave

import numpy as np
from scipy.signal import resample_poly

SR = 48000
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CACHE = os.path.join(ROOT, "tts_cache")


def backend_name():
    return os.environ.get("TTS_BACKEND", "openjtalk")


def speed_mul():
    """Per-backend pacing so every engine lands near the same short-form tempo."""
    default = {"openjtalk": 1.3, "voicevox": 1.18, "fish": 1.2, "kokoro": 1.4, "clips": 1.2}.get(backend_name(), 1.0)
    return float(os.environ.get("TTS_SPEED_MUL", default))


def _to_48k(x, sr):
    if sr == SR:
        return x
    g = np.gcd(SR, sr)
    return resample_poly(x, SR // g, sr // g)


def _read_wav_bytes(b):
    with wave.open(io.BytesIO(b)) as w:
        sr, ch, sw = w.getframerate(), w.getnchannels(), w.getsampwidth()
        raw = w.readframes(w.getnframes())
    x = np.frombuffer(raw, dtype={2: np.int16, 4: np.int32}[sw]).astype(np.float64)
    x /= 32768.0 if sw == 2 else 2147483648.0
    if ch > 1:
        x = x.reshape(-1, ch).mean(axis=1)
    return x, sr


def _openjtalk(text, speed):
    import pyopenjtalk
    x, sr = pyopenjtalk.tts(text, speed=speed)
    return x / 32768.0, sr


def _fish(text, speed):
    """Fish Audio TTS -> mp3 -> ffmpeg (pitch-preserving tempo) -> 48 kHz mono."""
    import json
    import subprocess
    import urllib.error
    import urllib.request
    key = os.environ.get("FISH_API_KEY", "")  # empty when the key is injected as a network secret
    body = {"text": text, "format": "mp3", "mp3_bitrate": 192, "normalize": True, "latency": "normal"}
    if os.environ.get("FISH_VOICE_ID"):
        body["reference_id"] = os.environ["FISH_VOICE_ID"]
    models = [m for m in os.environ.get("FISH_MODEL", "s2-pro,s1").split(",") if m]
    last = None
    for model in models:  # the accepted model names have changed over time; try in order
        req = urllib.request.Request("https://api.fish.audio/v1/tts", data=json.dumps(body).encode(), method="POST",
                                     headers={**({"Authorization": f"Bearer {key}"} if key else {}),
                                              "Content-Type": "application/json", "model": model})
        try:
            with urllib.request.urlopen(req, timeout=180) as r:
                mp3 = r.read()
            break
        except urllib.error.HTTPError as e:
            last = f"{model}: HTTP {e.code} {e.read()[:300]!r}"
            if e.code in (401, 402, 403):
                raise RuntimeError(f"Fish Audio refused the request ({last})") from e
    else:
        raise RuntimeError(f"Fish Audio TTS failed for all models: {last}")
    af = f"atempo={speed:.3f}" if abs(speed - 1.0) > 1e-3 else "anull"
    out = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", "pipe:0", "-af", af, "-ac", "1", "-ar", str(SR),
                          "-f", "s16le", "pipe:1"], input=mp3, capture_output=True, check=True).stdout
    return np.frombuffer(out, dtype=np.int16).astype(np.float64) / 32768.0, SR


def _atempo(x, speed):
    import subprocess
    if abs(speed - 1.0) < 1e-3:
        return x
    pcm = (np.clip(x, -1, 1) * 32767).astype(np.int16).tobytes()
    out = subprocess.run(["ffmpeg", "-loglevel", "error", "-f", "s16le", "-ar", str(SR), "-ac", "1", "-i", "pipe:0",
                          "-af", f"atempo={speed:.3f}", "-f", "s16le", "pipe:1"], input=pcm, capture_output=True,
                         check=True).stdout
    return np.frombuffer(out, dtype=np.int16).astype(np.float64) / 32768.0


_clip_index = None


def _clips(text, speed):
    import json
    global _clip_index
    if _clip_index is None:
        _clip_index = {}
        for d in os.environ.get("CLIPS_DIRS", os.path.join(ROOT, "clips", "c") + ":" + os.path.join(ROOT, "clips", "d")).split(":"):
            idx = os.path.join(d, "index.json")
            if os.path.exists(idx):
                for t, f in json.load(open(idx)).items():
                    _clip_index[t] = os.path.join(d, f)
    if text not in _clip_index:
        raise KeyError(f"no recorded clip for line: {text}")
    return _atempo(np.load(_clip_index[text]), speed), SR


_vv = None


def _voicevox(text, speed):
    global _vv
    from voicevox_core.blocking import Onnxruntime, OpenJtalk, Synthesizer, VoiceModelFile
    d = os.environ["VOICEVOX_DIR"]
    style = int(os.environ.get("VOICEVOX_STYLE_ID", "13"))  # 13 = 青山龍星 ノーマル
    if _vv is None:
        ort = Onnxruntime.load_once(filename=os.path.join(d, "onnxruntime", "lib",
                                                           Onnxruntime.LIB_VERSIONED_FILENAME))
        syn = Synthesizer(ort, OpenJtalk(os.path.join(d, "dict", "open_jtalk_dic_utf_8-1.11")))
        for f in sorted(os.listdir(os.path.join(d, "models", "vvms"))):
            if f.endswith(".vvm"):
                with VoiceModelFile.open(os.path.join(d, "models", "vvms", f)) as m:
                    syn.load_voice_model(m)
        _vv = syn
    q = _vv.create_audio_query(text, style)
    q.speed_scale = speed
    q.pre_phoneme_length = 0.05
    q.post_phoneme_length = 0.08
    return _read_wav_bytes(_vv.synthesis(q, style))


_kk = None


def _kokoro(text, speed):
    global _kk
    import json
    import onnxruntime as ort
    from misaki import ja
    d = os.environ.get("KOKORO_DIR", os.path.join(ROOT, "kokoro"))
    name = os.environ.get("KOKORO_VOICE", "jm_kumo")
    if _kk is None:
        vocab = json.load(open(os.path.join(d, "tokenizer.json")))["model"]["vocab"]
        _kk = (ort.InferenceSession(os.path.join(d, "kokoro-quantized.onnx")), vocab, ja.JAG2P())
    sess, vocab, g2p = _kk
    voice = np.fromfile(os.path.join(d, "voices", f"{name}.bin"), dtype=np.float32).reshape(-1, 1, 256)
    ps = g2p(text)
    ps = ps[0] if isinstance(ps, tuple) else ps
    ids = [vocab[c] for c in ps if c in vocab][:508]
    wav = sess.run(None, {"input_ids": np.array([[0] + ids + [0]], dtype=np.int64),
                          "style": voice[min(len(ids), len(voice) - 1)],
                          "speed": np.array([speed], dtype=np.float32)})[0][0]
    return wav.astype(np.float64), 24000


def synth(text, speed=1.0):
    """Return mono float waveform at 48 kHz (cached)."""
    be = backend_name()
    voice = {"fish": os.environ.get("FISH_VOICE_ID", ""), "voicevox": os.environ.get("VOICEVOX_STYLE_ID", ""),
             "kokoro": os.environ.get("KOKORO_VOICE", "jm_kumo"), "clips": os.environ.get("CLIPS_DIRS", "")}.get(be, "")
    key = hashlib.sha1(f"{be}|{voice}|{speed}|{text}".encode()).hexdigest()[:16]
    os.makedirs(CACHE, exist_ok=True)
    path = os.path.join(CACHE, f"{be}_{key}.npy")
    if os.path.exists(path):
        return np.load(path)
    fn = {"openjtalk": _openjtalk, "fish": _fish, "voicevox": _voicevox, "kokoro": _kokoro, "clips": _clips}[be]
    x, sr = fn(text, speed)
    x = _to_48k(np.asarray(x, dtype=np.float64), sr)
    # trim leading/trailing silence
    thr = 0.01 * np.max(np.abs(x))
    nz = np.where(np.abs(x) > thr)[0]
    if len(nz):
        x = x[max(0, nz[0] - 480): nz[-1] + 2400]
    np.save(path, x)
    return x


def voice_chain(x):
    """Broadcast-ish voice polish: HPF, presence lift, gentle compression."""
    from scipy.signal import butter, sosfilt
    x = sosfilt(butter(2, 85, "highpass", fs=SR, output="sos"), x)
    pres = sosfilt(butter(2, [2500, 6000], "bandpass", fs=SR, output="sos"), x)
    x = x + 0.25 * pres
    # simple RMS compressor
    win = int(0.02 * SR)
    env = np.sqrt(np.convolve(x * x, np.ones(win) / win, mode="same") + 1e-9)
    thr = 0.12
    gain = np.where(env > thr, (thr / env) ** 0.55, 1.0)
    x = x * gain
    return x / (np.max(np.abs(x)) + 1e-9) * 0.9
