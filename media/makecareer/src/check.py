"""Check rendered videos against their timing files.

    python3 check.py 03_seishain [more names...]

Reports: streams (1080x1920 / 30 fps / audio), length vs the timing file, where the narration actually sits
compared with the plan, integrated loudness, and subtitles that would need a third line. It cannot tell
whether the result sounds right; listen to it.
"""
import json
import os
import subprocess
import sys

import numpy as np

import mc
import align_clips as ac


def probe(path):
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries",
                          "stream=codec_type,width,height,r_frame_rate:format=duration", "-of", "json", path],
                         capture_output=True, check=True, text=True).stdout
    return json.loads(out)


def loudness(path):
    err = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", path, "-af", "ebur128", "-f", "null", "-"],
                         capture_output=True, text=True).stderr
    lines = [ln for ln in err.splitlines() if ln.strip().startswith("I:")]
    return lines[-1].split()[1] if lines else "?"


def check(name):
    tm = mc.Timing(name)
    path = os.path.join(mc.OUT_DIR, tm.data["video"])
    info = probe(path)
    streams = {s["codec_type"]: s for s in info["streams"]}
    v = streams["video"]
    dur = float(info["format"]["duration"])
    print(f"{name}: {v['width']}x{v['height']} {v['r_frame_rate']} fps, {dur:.2f}s (timing file {tm.total:.2f}s), "
          f"audio {'yes' if 'audio' in streams else 'NO'}")
    problems = []
    if (v["width"], v["height"], v["r_frame_rate"]) != (1080, 1920, "30/1"):
        problems.append("video is not 1080x1920 at 30 fps")
    if abs(dur - tm.total) > 0.1:
        problems.append("length differs from the timing file")
    if "audio" in streams:
        a = tm.data["audio"]
        mix = ac.load(path)
        take = ac.load(os.path.normpath(os.path.join(mc.ROOT, "timing", a["file"])))
        seg = take[int(a["cut"] * ac.SR):int((a["cut"] + 8) * ac.SR)]
        at = int(a["at"] * ac.SR)
        best = max(range(-2400, 2400, 48), key=lambda k: float(np.dot(seg, mix[at + k:at + k + len(seg)])))
        print(f"  narration offset vs plan: {best / ac.SR:+.3f}s, loudness {loudness(path)} LUFS")
        if abs(best) > 480:
            problems.append("narration is not where the timing file says")
    for c in tm.subs:
        size, lines = mc.subtitle_lines(c["text"])
        if len(lines) > 2:
            problems.append(f"subtitle {c['id']} needs {len(lines)} lines")
    print("  OK" if not problems else "  PROBLEMS: " + "; ".join(problems))
    return not problems


if __name__ == "__main__":
    ok = all([check(n) for n in sys.argv[1:]])
    sys.exit(0 if ok else 1)
