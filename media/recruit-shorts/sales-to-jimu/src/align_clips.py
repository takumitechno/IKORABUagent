"""Split a narration take into per-line clips by matching pause positions to expected line lengths."""
import json, os, re, subprocess, sys
import numpy as np

SR = 48000
GAP_W = float(os.environ.get("GAP_W", "1.2"))


def load(path):
    raw = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", path, "-ac", "1", "-ar", str(SR), "-f", "s16le", "pipe:1"],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.int16).astype(np.float64) / 32768.0


def speech_chunks(x, thr_db=-40, min_sil=0.18):
    win = int(0.01 * SR)
    n = len(x) // win
    rms = np.sqrt(np.mean(x[: n * win].reshape(n, win) ** 2, axis=1) + 1e-12)
    db = 20 * np.log10(rms)
    voiced = db > thr_db
    chunks, i = [], 0
    while i < n:
        if voiced[i]:
            j = i
            while j < n and voiced[j]:
                j += 1
            chunks.append([i * 0.01, j * 0.01])
            i = j
        else:
            i += 1
    merged = [chunks[0]]
    for a, b in chunks[1:]:
        if a - merged[-1][1] < min_sil:
            merged[-1][1] = b
        else:
            merged.append([a, b])
    return [c for c in merged if c[1] - c[0] > 0.06]


def mora_len(t):
    return max(1, len(re.sub(r"[、。！？!?\s]", "", t)))


def align(chunks, lines):
    """DP: assign consecutive chunks to lines; boundaries prefer long gaps, lengths follow text length."""
    n, m = len(chunks), len(lines)
    exp = np.array([mora_len(t) for t in lines], dtype=float)
    exp /= exp.sum()
    tot = chunks[-1][1] - chunks[0][0]
    gaps = [chunks[k + 1][0] - chunks[k][1] for k in range(n - 1)]
    INF = 1e18
    dp = np.full((m + 1, n + 1), INF)
    bk = np.zeros((m + 1, n + 1), dtype=int)
    dp[0][0] = 0
    for i in range(1, m + 1):
        for j in range(i, n - (m - i) + 1):
            for k in range(i - 1, j):
                if dp[i - 1][k] >= INF:
                    continue
                dur = (chunks[j - 1][1] - chunks[k][0]) / tot
                c = ((dur - exp[i - 1]) / max(exp[i - 1], 0.03)) ** 2
                if j < n:
                    c -= GAP_W * gaps[j - 1]  # reward splitting on a long pause
                v = dp[i - 1][k] + c
                if v < dp[i][j]:
                    dp[i][j], bk[i][j] = v, k
    j, spans = n, []
    for i in range(m, 0, -1):
        k = bk[i][j]
        spans.append((chunks[k][0], chunks[j - 1][1]))
        j = k
    return dp[m][n], spans[::-1]


def morae(text):
    """Approximate spoken length: kana count from OpenJTalk (falls back to characters)."""
    try:
        import pyopenjtalk
        kana = pyopenjtalk.g2p(text, kana=True)
        return max(1, len(re.sub(r"[、。！？!?\s’']", "", kana)))
    except Exception:
        return mora_len(text)


def align_phrases(chunks, lines, max_group=3):
    """Finer DP: map groups of speech chunks to groups of phrases (split on 、。？！) without
    crossing line boundaries, so pauses inside a line no longer shift the line breaks."""
    phrases, line_of = [], []
    for li, t in enumerate(lines):
        for p in [q for q in re.split(r"(?<=[、。！？!?])", t) if q.strip("、。！？!? ")]:
            phrases.append(p)
            line_of.append(li)
    P, n = len(phrases), len(chunks)
    exp = np.array([morae(p) for p in phrases], dtype=float)
    exp /= exp.sum()
    tot = sum(b - a for a, b in chunks)
    INF = 1e18
    dp = np.full((P + 1, n + 1), INF)
    bk = {}
    dp[0][0] = 0.0
    for i in range(P + 1):
        for j in range(n + 1):
            if dp[i][j] >= INF:
                continue
            for gp in range(1, max_group + 1):
                if i + gp > P or line_of[i] != line_of[i + gp - 1]:
                    break
                e = exp[i:i + gp].sum()
                for gc in range(1, max_group + 1):
                    if j + gc > n:
                        break
                    d = sum(chunks[k][1] - chunks[k][0] for k in range(j, j + gc)) / tot
                    c = ((d - e) / max(e, 0.02)) ** 2 + 0.15 * (gp + gc - 2)
                    if dp[i][j] + c < dp[i + gp][j + gc]:
                        dp[i + gp][j + gc] = dp[i][j] + c
                        bk[(i + gp, j + gc)] = (i, j)
    i, j, spans = P, n, {}
    while (i, j) != (0, 0):
        pi, pj = bk[(i, j)]
        li = line_of[pi]
        a, b = chunks[pj][0], chunks[j - 1][1]
        lo, hi = spans.get(li, (a, b))
        spans[li] = (min(lo, a), max(hi, b))
        i, j = pi, pj
    return dp[P][n], [spans[k] for k in range(len(lines))]


if __name__ == "__main__":
    audio_path, lines_json, out_dir = sys.argv[1], sys.argv[2], sys.argv[3] if len(sys.argv) > 3 else None
    lines = json.load(open(lines_json))
    x = load(audio_path)
    ch = speech_chunks(x)
    cost, spans = (align_phrases if os.environ.get("ALIGN", "phrases") == "phrases" else align)(ch, lines)
    print(f"cost={cost:.2f} chunks={len(ch)}")
    for t, (a, b) in zip(lines, spans):
        print(f"  {a:6.2f}-{b:6.2f} ({b - a:4.2f}s)  {t}")
    if out_dir:
        os.makedirs(out_dir, exist_ok=True)
        index = {}
        for k, (t, (a, b)) in enumerate(zip(lines, spans)):
            seg = x[max(0, int((a - 0.03) * SR)): int((b + 0.08) * SR)]
            p = os.path.join(out_dir, f"line_{k:02d}.npy")
            np.save(p, seg)
            index[t] = os.path.basename(p)
        json.dump(index, open(os.path.join(out_dir, "index.json"), "w"), ensure_ascii=False, indent=1)
