"""Check that the first N seconds of two renders match (video frames + audio waveform)."""
import subprocess
import sys

import numpy as np

W, H = 1080, 1920


def frame(path, t):
    raw = subprocess.run(["ffmpeg", "-loglevel", "error", "-ss", f"{t}", "-i", path, "-frames:v", "1",
                          "-f", "rawvideo", "-pix_fmt", "rgb24", "pipe:1"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.uint8).reshape(H, W, 3).astype(np.int16)


def audio(path, t0, t1, sr=16000):
    raw = subprocess.run(["ffmpeg", "-loglevel", "error", "-ss", f"{t0}", "-t", f"{t1 - t0}", "-i", path,
                          "-ac", "1", "-ar", str(sr), "-f", "s16le", "pipe:1"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.int16).astype(np.float64)


if __name__ == "__main__":
    a, b, until = sys.argv[1], sys.argv[2], float(sys.argv[3])
    for t in np.linspace(0.3, until - 0.2, 8):
        fa, fb = frame(a, t)[16:], frame(b, t)[16:]  # skip the progress bar
        print(f"t={t:5.2f}s  mean|diff|={np.abs(fa - fb).mean():5.2f}  (0-255 scale)")
    xa, xb = audio(a, 0, until), audio(b, 0, until)
    n = min(len(xa), len(xb))
    c = np.corrcoef(xa[:n], xb[:n])[0, 1]
    ra, rb = np.sqrt(np.mean(xa[:n] ** 2)), np.sqrt(np.mean(xb[:n] ** 2))
    print(f"audio 0-{until}s: correlation={c:.4f}  level ratio={20 * np.log10(rb / ra):+.2f} dB")
