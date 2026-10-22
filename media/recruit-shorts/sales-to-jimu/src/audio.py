"""Procedural BGM + SFX (numpy/scipy only, no samples)."""
import wave

import numpy as np
from scipy.signal import butter, fftconvolve, sosfilt

SR = 48000
rng = np.random.default_rng(11)


def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)


NOTE = {"C": 0, "C#": 1, "D": 2, "D#": 3, "E": 4, "F": 5, "F#": 6, "G": 7, "G#": 8, "A": 9, "A#": 10, "B": 11}


def n(name):
    """'A3' -> midi number"""
    p, o = name[:-1], int(name[-1])
    return 12 * (o + 1) + NOTE[p]


def tl(dur):
    return np.arange(int(dur * SR)) / SR


def filt(x, kind, f, order=2):
    sos = butter(order, f, btype=kind, fs=SR, output="sos")
    return sosfilt(sos, x)


def env_adsr(t, dur, a=0.005, r=0.08):
    e = np.ones_like(t)
    if a > 0:
        e = np.minimum(e, t / a)
    e = np.minimum(e, np.clip((dur - t) / r, 0, 1))
    return np.clip(e, 0, 1)


class Bus:
    def __init__(self, total):
        self.buf = np.zeros((int(total * SR) + SR, 2))

    def add(self, sig, start, gain=1.0, pan=0.0):
        i = int(start * SR)
        if i >= len(self.buf):
            return
        sig = sig[: len(self.buf) - i]
        l = gain * np.cos((pan + 1) * np.pi / 4)
        r = gain * np.sin((pan + 1) * np.pi / 4)
        if sig.ndim == 1:
            self.buf[i:i + len(sig), 0] += sig * l * 1.414
            self.buf[i:i + len(sig), 1] += sig * r * 1.414
        else:
            self.buf[i:i + len(sig)] += sig * gain


# ---------------------------------------------------------------- instruments
def piano(freq, dur, vel=1.0, bright=1.0):
    t = tl(dur + 1.2)
    out = np.zeros_like(t)
    for h, a in zip(range(1, 7), [1, 0.5, 0.25 * bright, 0.12 * bright, 0.06 * bright, 0.03]):
        f = freq * h * (1 + 0.0004 * h * h)
        out += a * np.sin(2 * np.pi * f * t) * np.exp(-t * (1.6 + 0.9 * h))
    e = np.minimum(1, t / 0.004) * np.clip((dur + 1.2 - t) / 1.2, 0, 1)
    return out * e * vel * 0.25


def epiano(freq, dur, vel=1.0):
    t = tl(dur + 0.8)
    mod = 1.1 * np.exp(-t * 7) * np.sin(2 * np.pi * freq * 2 * t)
    out = np.sin(2 * np.pi * freq * t + mod) + 0.25 * np.sin(2 * np.pi * freq * 2 * t) * np.exp(-t * 3)
    out *= np.exp(-t * 1.3) * (1 + 0.12 * np.sin(2 * np.pi * 4.5 * t))
    e = np.minimum(1, t / 0.006) * np.clip((dur + 0.8 - t) / 0.8, 0, 1)
    return out * e * vel * 0.2


def pad(freqs, dur, cutoff=1400, vel=1.0):
    t = tl(dur + 1.0)
    out = np.zeros_like(t)
    for fr in freqs:
        for det in (-0.006, 0.0, 0.0055):
            f = fr * (1 + det)
            ph = rng.uniform(0, 2 * np.pi)
            for h in range(1, 9):
                out += np.sin(2 * np.pi * f * h * t + ph * h) / h
    out = filt(out, "lowpass", cutoff)
    e = np.minimum(1, t / 0.9) * np.clip((dur + 1.0 - t) / 1.0, 0, 1)
    return out * e * vel * 0.012


def bass(freq, dur, vel=1.0):
    t = tl(dur + 0.1)
    out = np.sin(2 * np.pi * freq * t) + 0.18 * np.sin(2 * np.pi * freq * 2 * t)
    return out * env_adsr(t, dur + 0.1, 0.01, 0.12) * np.exp(-t * 0.8) * vel * 0.32


def kick(vel=1.0):
    t = tl(0.45)
    f = 46 + 95 * np.exp(-t * 32)
    ph = 2 * np.pi * np.cumsum(f) / SR
    out = np.sin(ph) * np.exp(-t * 8.5)
    out[:120] += rng.normal(0, 0.3, 120) * np.linspace(1, 0, 120)
    return out * vel * 0.55


def snare(vel=1.0):
    t = tl(0.3)
    nz = filt(rng.normal(0, 1, len(t)), "bandpass", [900, 7000]) * np.exp(-t * 20)
    tone = np.sin(2 * np.pi * 185 * t) * np.exp(-t * 28)
    return (nz * 0.55 + tone * 0.5) * vel * 0.4


def hat(vel=1.0, open_=False):
    t = tl(0.25 if open_ else 0.06)
    out = filt(rng.normal(0, 1, len(t)), "highpass", 7000) * np.exp(-t * (14 if open_ else 70))
    return out * vel * 0.12


def shaker(vel=1.0):
    t = tl(0.09)
    out = filt(rng.normal(0, 1, len(t)), "bandpass", [4000, 10000])
    out *= np.sin(np.pi * np.clip(t / 0.09, 0, 1)) ** 2
    return out * vel * 0.07


def reverb(x, secs=1.8, mix=0.25, seed=3):
    r = np.random.default_rng(seed)
    t = tl(secs)
    ir_l = r.normal(0, 1, len(t)) * np.exp(-t * 3.2)
    ir_r = r.normal(0, 1, len(t)) * np.exp(-t * 3.2)
    ir_l = filt(ir_l, "lowpass", 5000)
    ir_r = filt(ir_r, "lowpass", 5000)
    ir_l /= np.sqrt(np.sum(ir_l ** 2))
    ir_r /= np.sqrt(np.sum(ir_r ** 2))
    wl = fftconvolve(x[:, 0], ir_l)[: len(x)]
    wr = fftconvolve(x[:, 1], ir_r)[: len(x)]
    out = x.copy()
    out[:, 0] = x[:, 0] * (1 - mix) + wl * mix
    out[:, 1] = x[:, 1] * (1 - mix) + wr * mix
    return out


def vinyl(total, level=0.012):
    m = int(total * SR) + SR
    hiss = filt(rng.normal(0, 1, m), "bandpass", [500, 6000]) * level * 0.4
    pops = np.zeros(m)
    idx = rng.integers(0, m, int(total * 7))
    pops[idx] = rng.normal(0, 1, len(idx)) * level * 6
    pops = filt(pops, "highpass", 1500)
    return hiss + pops


# ---------------------------------------------------------------- sfx
def sfx_pop():
    t = tl(0.09)
    f = 520 + 600 * np.exp(-t * 45)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 38) * 0.35


def sfx_whoosh(dur=0.55, rise=0.65):
    t = tl(dur)
    nz = rng.normal(0, 1, len(t))
    e = np.where(t < dur * rise, (t / (dur * rise)) ** 2, np.exp(-(t - dur * rise) * 14))
    # sweep cutoff by blending two filtered versions
    lo = filt(nz, "bandpass", [250, 1400])
    hi = filt(nz, "bandpass", [1200, 6000])
    mixr = np.clip(t / dur, 0, 1)
    return (lo * (1 - mixr) + hi * mixr) * e * 0.35


def sfx_ping():
    out = np.zeros(int(0.6 * SR))
    for k, (f, st) in enumerate([(1568, 0.0), (2093, 0.09)]):
        t = tl(0.5)
        s = (np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t * 20)) * np.exp(-t * 9)
        i = int(st * SR)
        out[i:i + len(s)] += s[: len(out) - i]
    return out * 0.22


def sfx_busy(beeps=3):
    """Hang-up click followed by a Japanese-style busy tone (telephone band)."""
    out = np.zeros(int((0.25 + beeps * 1.0) * SR))
    t = tl(0.06)
    click = filt(rng.normal(0, 1, len(t)), "lowpass", 1800) * np.exp(-t * 80)
    out[: len(click)] += click * 0.6
    for b in range(beeps):
        t = tl(0.5)
        tone = np.sin(2 * np.pi * 400 * t) * env_adsr(t, 0.5, 0.01, 0.02)
        i = int((0.25 + b * 1.0) * SR)
        out[i:i + len(tone)] += tone * 0.5
    out = filt(np.tanh(out * 1.8), "bandpass", [300, 3400])
    return out * 0.45


def sfx_type(dur, rate=11.0):
    m = int(dur * SR)
    out = np.zeros(m)
    tt = 0.0
    while tt < dur - 0.02:
        t = tl(0.018)
        c = filt(rng.normal(0, 1, len(t)), "bandpass", [1500, 8000]) * np.exp(-t * 300)
        c += np.sin(2 * np.pi * rng.uniform(900, 1400) * t) * np.exp(-t * 400) * 0.4
        i = int(tt * SR)
        out[i:i + len(c)] += c[: m - i] * rng.uniform(0.5, 1.0)
        tt += rng.uniform(0.6, 1.4) / rate
    return out * 0.22


def sfx_ding(f=1760):
    t = tl(0.45)
    return (np.sin(2 * np.pi * f * t) + 0.4 * np.sin(2 * np.pi * f * 1.5 * t)) * np.exp(-t * 11) * 0.16


def sfx_blip():
    t = tl(0.12)
    f = 700 + 500 * np.clip(t / 0.05, 0, 1)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 30) * 0.22


def sfx_tick():
    t = tl(0.08)
    return (np.sin(2 * np.pi * 1250 * t) + 0.5 * np.sin(2 * np.pi * 2500 * t)) * np.exp(-t * 70) * 0.25


def sfx_chime():
    out = np.zeros(int(2.2 * SR))
    for k, nm in enumerate(["C6", "E6", "G6", "C7"]):
        s = piano(midi(n(nm)), 0.6, 0.9, bright=1.4)
        i = int(k * 0.09 * SR)
        out[i:i + len(s)] += s[: len(out) - i]
    return out * 0.7


def sfx_riser(dur=1.2):
    t = tl(dur)
    nz = rng.normal(0, 1, len(t))
    parts = []
    seg = len(t) // 8
    for k in range(8):
        c = 400 + k * 900
        parts.append(filt(nz[k * seg:(k + 1) * seg], "bandpass", [c, c * 2.2]))
    s = np.concatenate(parts)
    s = np.pad(s, (0, len(t) - len(s)))
    return s * (t / dur) ** 2.2 * 0.25


def sfx_impact():
    t = tl(1.2)
    low = np.sin(2 * np.pi * (40 + 30 * np.exp(-t * 6)) * t) * np.exp(-t * 3.5)
    nz = filt(rng.normal(0, 1, len(t)), "lowpass", 900) * np.exp(-t * 12)
    return (low * 0.6 + nz * 0.25) * 0.6


# ---------------------------------------------------------------- master
def master(music, sfx, path, fade_in=0.05, fade_out=1.2, total=None):
    mix = music + sfx
    if total:
        mix = mix[: int(total * SR)]
    m = len(mix)
    e = np.ones(m)
    fi, fo = int(fade_in * SR), int(fade_out * SR)
    e[:fi] = np.linspace(0, 1, fi)
    e[m - fo:] *= np.linspace(1, 0, fo) ** 1.5
    mix = mix * e[:, None]
    mix = np.tanh(mix * 1.1) / np.tanh(1.1)
    peak = np.max(np.abs(mix)) or 1.0
    mix = mix / peak * 0.89
    data = (mix * 32767).astype(np.int16)
    with wave.open(path, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(data.tobytes())


def sfx_swish(dur=0.2):
    """Short airy swish for jump-cuts."""
    t = tl(dur)
    nz = filt(rng.normal(0, 1, len(t)), "bandpass", [2500, 9000])
    e = np.sin(np.pi * np.clip(t / dur, 0, 1)) ** 2
    return nz * e * 0.22


def sfx_buzz(dur=0.55):
    """Phone vibration on a desk."""
    t = tl(dur)
    s = np.sign(np.sin(2 * np.pi * 175 * t)) * 0.5 + np.sin(2 * np.pi * 350 * t) * 0.3
    am = (np.sin(2 * np.pi * 9 * t) > -0.2).astype(float)
    return filt(s * am, "lowpass", 1800) * env_adsr(t, dur, 0.01, 0.05) * 0.3


def sfx_heartbeat():
    out = np.zeros(int(1.0 * SR))
    for st, g in ((0.0, 1.0), (0.22, 0.7)):
        t = tl(0.25)
        s = np.sin(2 * np.pi * (55 + 25 * np.exp(-t * 30)) * t) * np.exp(-t * 18)
        i = int(st * SR)
        out[i:i + len(s)] += s * g
    return out * 0.7


def sfx_bass_drop(dur=0.9):
    t = tl(dur)
    f = 35 + 110 * np.exp(-t * 5)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 2.8) * 0.6


def sfx_glitch(dur=0.28):
    """Digital stutter for the opening frame."""
    out = np.zeros(int(dur * SR))
    k, step = 0, int(0.035 * SR)
    while k * step < len(out):
        t = tl(0.025)
        f = rng.choice([880, 1320, 1760, 660])
        s = np.sign(np.sin(2 * np.pi * f * t)) * 0.4 + rng.normal(0, 0.25, len(t))
        i = k * step
        out[i:i + len(s)] += s[: len(out) - i] * (1 - k * step / len(out))
        k += 1
    return filt(out, "bandpass", [400, 7000]) * 0.3


def sfx_chime2():
    """Two-tone door/notice chime (generic)."""
    out = np.zeros(int(1.2 * SR))
    for st, nm in ((0.0, "E6"), (0.28, "C6")):
        s = piano(midi(n(nm)), 0.5, 0.9, bright=1.5)
        i = int(st * SR)
        out[i:i + len(s)] += s[: len(out) - i]
    return out * 0.8
