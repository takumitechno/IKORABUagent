"""Word timestamps for narration takes, saved as ../narration/<name>_words.json.

    python3 transcribe.py MODEL_DIR 03_seishain [more names...]

MODEL_DIR is a faster-whisper (CTranslate2) Whisper model; we used "small" in int8. fit_audio.py only uses
these times to place marks inside a line (e.g. when 「新人」 is said); without the file it falls back to the
character position within the line. The text itself can contain recognition errors.
"""
import json
import os
import subprocess
import sys

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
NARR = os.path.join(os.path.dirname(HERE), "narration")


def transcribe(model, name):
    take = os.path.join(NARR, f"{name}_jin.mp3")
    raw = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", take, "-ac", "1", "-ar", "16000", "-f", "s16le", "pipe:1"],
                         capture_output=True, check=True).stdout
    audio = np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768.0   # avoids PyAV version issues
    segs, _ = model.transcribe(audio, language="ja", word_timestamps=True, vad_filter=False, beam_size=5,
                               condition_on_previous_text=False)
    words = [[round(w.start, 2), round(w.end, 2), w.word] for s in segs for w in s.words]
    with open(os.path.join(NARR, f"{name}_words.json"), "w", encoding="utf-8") as f:
        json.dump({"source": os.path.basename(take),
                   "asr": "faster-whisper small (int8), word timestamps; text may contain recognition errors",
                   "words": words}, f, ensure_ascii=False, indent=0)
    print(name, "".join(w[2] for w in words))


if __name__ == "__main__":
    from faster_whisper import WhisperModel
    m = WhisperModel(sys.argv[1], device="cpu", compute_type="int8")
    for n in sys.argv[2:]:
        transcribe(m, n)
