"""Lay narration onto an existing telop-timed video (A/B).

Each cue is placed on a scene at the moment its telop appears. If a voice line does not fit
before the next cue (or the scene end), the whole scene is stretched — its overlays and its
camera move are slowed by the same factor — so nothing gets cut off. Overlays listed in
`sync` are re-timed to the start of a given sentence inside the line.
"""
import re

import tts
from narrated import pause_ends, snap, spread

PAD = 0.22  # breathing room after a line before the next one / the cut


class Cue:
    def __init__(self, scene, t, text, sync=None):
        self.scene, self.t, self.text, self.sync = scene, t, text, sync or {}
        self.wave = None
        self.dur = 0.0


def sentences(text):
    return [p for p in re.split(r"(?<=[。？！?!])", text) if p.strip()]


def apply(scenes, cues):
    """Mutates scenes in place; returns voice events [(global_start, wave)]."""
    for c in cues:
        c.wave = tts.voice_chain(tts.synth(c.text, tts.speed_mul()))
        c.dur = len(c.wave) / tts.SR
    by_scene = {}
    for c in cues:
        by_scene.setdefault(c.scene, []).append(c)
    for si, cs in by_scene.items():
        sc = scenes[si]
        cs.sort(key=lambda c: c.t)
        f = 1.0
        for k, c in enumerate(cs):
            window_end = cs[k + 1].t if k + 1 < len(cs) else sc.dur
            f = max(f, (c.t + c.dur + PAD) / max(window_end, 1e-3))
        if f > 1.0:
            stretch(sc, f)
            for c in cs:
                c.t *= f
        for c in cs:
            if not c.sync:
                continue
            parts = sentences(c.text)
            starts = snap(spread(parts, c.t, c.t + c.dur), c.t, pause_ends(c.wave, tts.SR))
            for oi, sj in c.sync.items():
                o = sc.overlays[oi]
                o.t_in = max(o.t_in, starts[min(sj, len(starts) - 1)] - 0.05)
    t = 0.0
    for sc in scenes:
        sc.start = t
        t += sc.dur
    return [(scenes[c.scene].start + c.t, c.wave) for c in cues]


def stretch(sc, f):
    old_fn, old_dur = sc.render_fn, sc.dur
    sc.render_fn = lambda t, fn=old_fn: fn(t / f)
    sc.dur = old_dur * f
    for o in sc.overlays:
        for attr in ("t_in", "t_out"):
            v = getattr(o, attr, None)
            if v is not None and v < 90:
                setattr(o, attr, v * f)
