"""Narration-driven timeline: scene lengths follow the synthesized voice."""
import numpy as np

import audio as au
import tts
from engine import W, Scene, Telop, ease_in_out, handheld, lerp, text_block

CAP_Y = 1330


class Line:
    def __init__(self, voice, caption=None, size=78, cy=CAP_Y, speed=1.0, gap=0.16, hl=(255, 225, 77),
                 anim="pop", weight=900, show_from_start=False):
        self.voice, self.caption, self.size, self.cy = voice, caption, size, cy
        self.speed, self.gap, self.hl, self.anim, self.weight = speed, gap, hl, anim, weight
        self.show_from_start = show_from_start
        self.wave = None
        self.t0 = self.t1 = 0.0  # segment-local voice span
        self.g0 = 0.0  # global voice start


class Segment:
    """One scene covering one or more narration lines."""

    def __init__(self, lines, visual, extra=None, lead=0.08, tail=0.12, trans="cut", trans_dur=0.0,
                 min_dur=0.0, fade_out=0.0):
        self.lines, self.visual, self.extra = lines, visual, extra
        self.lead, self.tail, self.trans, self.trans_dur = lead, tail, trans, trans_dur
        self.min_dur, self.fade_out = min_dur, fade_out
        self.start = 0.0
        self.dur = 0.0


def shot(photo, z0, z1, c0, c1, shake=3.0, seed=0.0):
    """Ken Burns visual factory -> fn(dur) -> render(t)."""
    def make(dur):
        def fn(t):
            p = ease_in_out(t / dur) * 0.8 + (t / dur) * 0.2
            dx, dy = handheld(t, shake, seed)
            return photo.render(lerp(z0, z1, p), lerp(c0[0], c1[0], p), lerp(c0[1], c1[1], p), dx, dy)
        return fn
    return make


def caption(line, t_in, t_out):
    img = text_block(line.caption, size=line.size, hl=line.hl, weight=line.weight)
    return Telop(img, W / 2, line.cy, t_in, t_out, anim=line.anim, dur_in=0.16, dur_out=0.1)


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
            lt = ln.t1 + ln.gap
        dur = max(seg.min_dur, lt - seg.lines[-1].gap + seg.tail)
        seg.dur, seg.start = dur, t
        overlays = []
        for k, ln in enumerate(seg.lines):
            if ln.caption:
                end = seg.lines[k + 1].t0 - 0.02 if k + 1 < len(seg.lines) and seg.lines[k + 1].caption else dur + 0.05
                start = -1.0 if (si == 0 and k == 0) or ln.show_from_start else ln.t0 - 0.06
                overlays.append(caption(ln, start, end))
        if seg.extra:
            overlays = seg.extra(seg) + overlays
        sc = Scene(dur, seg.visual(dur), overlays, trans=seg.trans, trans_dur=seg.trans_dur)
        sc.fade_out = seg.fade_out
        sc.start = t
        scenes.append(sc)
        t += dur
    return scenes, voice, t


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
    au.master(music * 0.55 + voice, sfx_bus.buf, path, total=total, fade_out=0.8)
