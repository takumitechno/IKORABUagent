"""Narration-driven timeline: scene lengths follow the synthesized voice.

Retention devices built in:
  * beats      — every phrase (split on 、。！？) triggers a jump-cut zoom and a soft SE
  * subs       — optional chunked subtitles that pop in on each beat (TikTok style)
  * hits       — screen shake on impact moments
  * progress   — thin progress bar across the top
"""
import math
import re

import numpy as np
from PIL import Image

import audio as au
import tts
from engine import W, H, Scene, Telop, clamp, ease_in_out, ease_out_cubic, handheld, lerp, text_block

CAP_Y = 1330
SUB_Y = 1400
_PUNCT = "、。！？!?，,"


class Line:
    def __init__(self, voice, caption=None, size=78, cy=CAP_Y, speed=1.0, gap=0.06, hl=(255, 225, 77),
                 anim="pop", weight=900, show_from_start=False, subs=None, sub_size=86, sub_cy=SUB_Y):
        self.voice, self.caption, self.size, self.cy = voice, caption, size, cy
        self.speed, self.gap, self.hl, self.anim, self.weight = speed, gap, hl, anim, weight
        self.show_from_start = show_from_start
        self.subs, self.sub_size, self.sub_cy = subs, sub_size, sub_cy
        self.wave = None
        self.t0 = self.t1 = 0.0  # segment-local voice span
        self.g0 = 0.0  # global voice start
        self.beats = []  # segment-local phrase starts
        self.sub_times = []


class Segment:
    """One scene covering one or more narration lines."""

    def __init__(self, lines, visual, extra=None, lead=0.04, tail=0.08, trans="cut", trans_dur=0.0,
                 min_dur=0.0, fade_out=0.0, jump=True, hits=None):
        self.lines, self.visual, self.extra = lines, visual, extra
        self.lead, self.tail, self.trans, self.trans_dur = lead, tail, trans, trans_dur
        self.min_dur, self.fade_out = min_dur, fade_out
        self.jump = jump
        self.hits = hits  # fn(seg) -> list of local impact times
        self.start = 0.0
        self.dur = 0.0
        self.hit_times = []


def shot(photo, z0, z1, c0, c1, shake=3.0, seed=0.0):
    """Ken Burns visual factory -> fn(dur) -> render(t)."""
    def make(dur):
        def fn(t):
            p = ease_in_out(t / dur) * 0.8 + (t / dur) * 0.2
            dx, dy = handheld(t, shake, seed)
            return photo.render(lerp(z0, z1, p), lerp(c0[0], c1[0], p), lerp(c0[1], c1[1], p), dx, dy)
        return fn
    return make


def _weights(parts):
    return [max(1.0, len(re.sub(r"[{}\s]", "", p))) for p in parts]


def split_phrases(text):
    parts = [p for p in re.split(r"(?<=[、。！？!?])", text) if p.strip(_PUNCT + " ")]
    return parts or [text]


def spread(parts, t0, t1):
    """Estimate when each phrase starts inside [t0, t1] from its length."""
    w = _weights(parts)
    tot = sum(w)
    out, acc = [], 0.0
    for x in w:
        out.append(t0 + (t1 - t0) * acc / tot)
        acc += x
    return out


def pause_ends(wave, sr, thr_db=-38, min_gap=0.1):
    """Times (s) where speech resumes after an internal pause."""
    win = int(0.01 * sr)
    n = len(wave) // win
    if n < 3:
        return []
    rms = np.sqrt(np.mean(wave[: n * win].reshape(n, win) ** 2, axis=1) + 1e-12)
    db = 20 * np.log10(rms / (rms.max() + 1e-12))
    quiet = db < thr_db
    out, k = [], 0
    while k < n:
        if quiet[k]:
            j = k
            while j < n and quiet[j]:
                j += 1
            if k > 0 and j < n and (j - k) * 0.01 >= min_gap:
                out.append(j * 0.01)
            k = j
        else:
            k += 1
    return out


def snap(estimates, t0, candidates):
    """Move each estimated phrase start (after the first) to the nearest real pause end."""
    if not candidates:
        return estimates
    out = [estimates[0]]
    used = set()
    for e in estimates[1:]:
        best = min((c for c in candidates if c not in used), key=lambda c: abs(t0 + c - e), default=None)
        if best is not None and abs(t0 + best - e) < 0.6:
            used.add(best)
            out.append(t0 + best)
        else:
            out.append(e)
    return sorted(out)


def caption(line, t_in, t_out):
    img = text_block(line.caption, size=line.size, hl=line.hl, weight=line.weight)
    return Telop(img, W / 2, line.cy, t_in, t_out, anim=line.anim, dur_in=0.14, dur_out=0.08)


def jump_cut(fn, beats, hits, amount=0.075):
    """Alternate punch-in zoom on every beat and shake on hits (post-render crop)."""
    def wrapped(t):
        fr = fn(t)
        k = sum(1 for b in beats if b <= t)
        z = 1.0 + (amount if k % 2 else 0.0)
        if k and t - beats[k - 1] < 0.07:  # quick ease into the new framing
            prev = 1.0 + (amount if (k - 1) % 2 else 0.0)
            z = lerp(prev, z, ease_out_cubic((t - beats[k - 1]) / 0.07))
        ox = oy = 0.0
        for h in hits:
            d = t - h
            if 0 <= d < 0.3:
                a = (1 - d / 0.3) * 18
                ox += a * math.sin(d * 95)
                oy += a * math.cos(d * 77)
        if ox or oy:
            z = max(z, 1.05)  # leave room to shake inside the frame
        if z > 1.001:
            ww, hh = W / z, H / z
            x0 = clamp((W - ww) / 2 + ox, 0, W - ww)
            y0 = clamp((H - hh) / 2 + oy, 0, H - hh)
            fr = fr.resize((W, H), Image.BILINEAR, box=(x0, y0, x0 + ww, y0 + hh))
        return fr
    return wrapped


def build(segments):
    """Synthesize all lines, size every scene to its voice, return (scenes, voice_events, total)."""
    scenes, voice = [], []
    t = 0.0
    for si, seg in enumerate(segments):
        lt = seg.lead
        for ln in seg.lines:
            ln.wave = tts.voice_chain(tts.synth(ln.voice, ln.speed * tts.speed_mul()))
            d = len(ln.wave) / tts.SR
            ln.t0, ln.t1 = lt, lt + d
            ln.g0 = t + lt
            voice.append((ln.g0, ln.wave))
            pauses = pause_ends(ln.wave, tts.SR)
            ln.beats = snap(spread(split_phrases(ln.voice), ln.t0, ln.t1), ln.t0, pauses)
            if ln.subs:
                ln.sub_times = snap(spread(ln.subs, ln.t0, ln.t1), ln.t0, pauses)
            lt = ln.t1 + ln.gap
        dur = max(seg.min_dur, lt - seg.lines[-1].gap + seg.tail)
        seg.dur, seg.start = dur, t
        overlays = []
        for k, ln in enumerate(seg.lines):
            if ln.caption:
                end = seg.lines[k + 1].t0 - 0.02 if k + 1 < len(seg.lines) and seg.lines[k + 1].caption else dur + 0.05
                start = -1.0 if (si == 0 and k == 0) or ln.show_from_start else ln.t0 - 0.05
                overlays.append(caption(ln, start, end))
            if ln.subs:
                for j, (txt, st) in enumerate(zip(ln.subs, ln.sub_times)):
                    nxt = ln.sub_times[j + 1] if j + 1 < len(ln.subs) else (
                        seg.lines[k + 1].t0 if k + 1 < len(seg.lines) else dur + 0.05)
                    img = text_block(txt, size=ln.sub_size, hl=ln.hl)
                    overlays.append(Telop(img, W / 2, ln.sub_cy, st - 0.04, nxt - 0.01, anim="pop",
                                          dur_in=0.1, dur_out=0.05))
        if seg.extra:
            overlays = seg.extra(seg) + overlays
        seg.hit_times = seg.hits(seg) if seg.hits else []
        fn = seg.visual(dur)
        beats = [b for ln in seg.lines for b in ln.beats][1:] if seg.jump else []
        if beats or seg.hit_times:
            fn = jump_cut(fn, beats, seg.hit_times)
        sc = Scene(dur, fn, overlays, trans=seg.trans, trans_dur=seg.trans_dur)
        sc.fade_out = seg.fade_out
        sc.start = t
        scenes.append(sc)
        t += dur
    return scenes, voice, t


class ProgressBar:
    """Thin top progress bar — makes the clip feel short and finite."""

    def __init__(self, total, color=(255, 225, 77)):
        self.total, self.color = total, color
        self.track = Image.new("RGBA", (W, 9), (0, 0, 0, 90))

    def draw(self, frame, t):
        frame.alpha_composite(self.track, (0, 0))
        w = int(W * clamp(t / self.total))
        if w > 0:
            frame.alpha_composite(Image.new("RGBA", (w, 9), self.color + (235,)), (0, 0))


def beat_sfx(sfx, segments, skip_first=True, gain=0.28):
    """Soft swish on every jump-cut beat, pop on every subtitle chunk."""
    for seg in segments:
        if not seg.jump:
            continue
        beats = [b for ln in seg.lines for b in ln.beats]
        for b in beats[1:] if skip_first else beats:
            sfx.add(au.sfx_swish(0.16), seg.start + b - 0.03, gain)
        for ln in seg.lines:
            for st in ln.sub_times:
                sfx.add(au.sfx_pop(), seg.start + st, 0.42)


# ---------------------------------------------------------------- audio
def groove(bus, t_from, t_to, bpm, chords, drums=True, keys="piano", vel=1.0, octave=12, bass_on=True,
           hats=True, kick_pattern=(0, 2)):
    beat = 60 / bpm
    bar = beat * 4
    t0, b = t_from, 0
    while t0 < t_to - 0.05:
        tones, root = chords[b % len(chords)]
        mids = [au.n(x) for x in tones]
        span = min(bar, t_to - t0)
        if keys == "piano":
            arp = [mids[0], mids[2], mids[0] + 12, mids[1] + 12, mids[2] + 12, mids[1] + 12, mids[0] + 12, mids[2]]
            for k, m in enumerate(arp):
                tt = t0 + k * beat / 2
                if tt < t_to - 0.05:
                    bus.add(au.piano(au.midi(m + octave), beat * 0.8, (0.45 + 0.2 * (k == 0)) * vel, 1.2),
                            tt, pan=-0.25 + 0.5 * (k % 2))
        elif keys == "ep":
            for hit, ln in ((0.0, beat * 1.5), (beat * 1.5, beat * 2.4)):
                if t0 + hit < t_to - 0.05:
                    for k, m in enumerate(mids):
                        bus.add(au.epiano(au.midi(m + octave), ln, 0.5 * vel), t0 + hit + k * 0.012, pan=-0.3 + 0.2 * k)
        bus.add(au.pad([au.midi(x) for x in mids], span, cutoff=1600, vel=0.9 * vel), t0)
        if bass_on:
            bus.add(au.bass(au.midi(au.n(root)), span * 0.9, 0.75 * vel), t0)
        if drums:
            for q in range(4):
                tb = t0 + q * beat
                if tb >= t_to - 0.02:
                    break
                if q in kick_pattern:
                    bus.add(au.kick(0.8 * vel), tb)
                if q in (1, 3):
                    bus.add(au.snare(0.45 * vel), tb)
                if hats:
                    for e in range(2):
                        bus.add(au.hat(0.8 if e else 1.0), tb + (0.55 * beat if e else 0), pan=0.25)
        t0 += bar
        b += 1


def mix(total, voice_events, music_bus, sfx_bus, path, duck_db=9.0):
    vb = np.zeros(len(music_bus.buf))
    for g0, w in voice_events:
        i = int(g0 * au.SR)
        n = min(len(w), len(vb) - i)
        vb[i:i + n] += w[:n]
    # sidechain-style ducking driven by the narration envelope
    win = int(0.25 * au.SR)
    env = np.convolve(np.abs(vb), np.ones(win) / win, mode="same")
    env = np.clip(env / (np.max(env) + 1e-9) * 4, 0, 1)
    duck = 1 - (1 - 10 ** (-duck_db / 20)) * env
    music = au.reverb(music_bus.buf, 1.8, 0.24) * duck[:, None]
    voice = np.stack([vb, vb], axis=1) * 0.9
    au.master(music * 0.55 + voice, sfx_bus.buf, path, total=total, fade_out=0.6)
