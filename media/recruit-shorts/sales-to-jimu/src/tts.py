"""Narration synthesis with swappable backends and an on-disk cache.

Backend is chosen with TTS_BACKEND:
  fish      Fish Audio API  (needs FISH_API_KEY, FISH_VOICE_ID; host api.fish.audio)
  voicevox  VOICEVOX CORE   (needs VOICEVOX_DIR with onnxruntime/dict/vvm; VOICEVOX_STYLE_ID)
  kokoro    Kokoro-82M ONNX (KOKORO_DIR with kokoro-quantized.onnx, tokenizer.json, voices/*.bin;
            KOKORO_VOICE, default jm_kumo = Japanese male). Japanese G2P via misaki (cutlet).
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
    default = {"openjtalk": 1.3, "voicevox": 1.18, "fish": 1.1, "kokoro": 1.12}.get(backend_name(), 1.0)
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
    import requests
    key = os.environ["FISH_API_KEY"]
    body = {"text": text, "format": "wav", "normalize": True, "latency": "normal",
            "prosody": {"speed": speed, "volume": 0}}
    if os.environ.get("FISH_VOICE_ID"):
        body["reference_id"] = os.environ["FISH_VOICE_ID"]
    r = requests.post("https://api.fish.audio/v1/tts", json=body, timeout=120,
                      headers={"Authorization": f"Bearer {key}",
                               "model": os.environ.get("FISH_MODEL", "s1")})
    r.raise_for_status()
    return _read_wav_bytes(r.content)


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
             "kokoro": os.environ.get("KOKORO_VOICE", "jm_kumo")}.get(be, "")
    key = hashlib.sha1(f"{be}|{voice}|{speed}|{text}".encode()).hexdigest()[:16]
    os.makedirs(CACHE, exist_ok=True)
    path = os.path.join(CACHE, f"{be}_{key}.npy")
    if os.path.exists(path):
        return np.load(path)
    fn = {"openjtalk": _openjtalk, "fish": _fish, "voicevox": _voicevox, "kokoro": _kokoro}[be]
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
