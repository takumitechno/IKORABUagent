"""Minimal vertical short-video engine (PIL frames -> ffmpeg)."""
import math
import os
import subprocess

import numpy as np
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont

W, H = 1080, 1920
FPS = 30
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONT_DIR = os.path.join(ROOT, "fonts")
IMG_DIR = os.path.join(ROOT, "img")
OUT_DIR = os.path.join(ROOT, "out")

_font_cache = {}


def font(size, weight=900):
    key = (int(size), weight)
    if key not in _font_cache:
        _font_cache[key] = ImageFont.truetype(
            os.path.join(FONT_DIR, f"NotoSansJP-{weight}.ttf"), int(size))
    return _font_cache[key]


# ---------------------------------------------------------------- easing
def clamp(x, a=0.0, b=1.0):
    return a if x < a else b if x > b else x


def ease_out_cubic(x):
    x = clamp(x)
    return 1 - (1 - x) ** 3


def ease_in_out(x):
    x = clamp(x)
    return 3 * x * x - 2 * x * x * x


def ease_out_back(x, s=1.70158):
    x = clamp(x)
    x -= 1
    return x * x * ((s + 1) * x + s) + 1


def lerp(a, b, t):
    return a + (b - a) * t


# ---------------------------------------------------------------- color grading
def grade(im, sat=1.0, con=1.0, bri=1.0, tint=None, tint_amt=0.0):
    im = ImageEnhance.Color(im).enhance(sat)
    im = ImageEnhance.Contrast(im).enhance(con)
    im = ImageEnhance.Brightness(im).enhance(bri)
    if tint is not None and tint_amt > 0:
        im = Image.blend(im, Image.new("RGB", im.size, tint), tint_amt)
    return im


GRADES = {
    "cold": dict(sat=0.78, con=1.06, bri=0.94, tint=(40, 70, 110), tint_amt=0.07),
    "night": dict(sat=0.85, con=1.08, bri=0.92, tint=(20, 40, 90), tint_amt=0.08),
    "harsh": dict(sat=0.82, con=1.05, bri=0.98, tint=(120, 110, 90), tint_amt=0.05),
    "warm": dict(sat=1.04, con=1.03, bri=1.03, tint=(255, 200, 150), tint_amt=0.06),
    "home": dict(sat=0.95, con=1.02, bri=1.0, tint=(255, 190, 130), tint_amt=0.04),
    "neutral": dict(),
}


# ---------------------------------------------------------------- photo layer
class Photo:
    """Pre-scaled, graded still used for Ken Burns moves."""

    OVERSCAN = 1.25

    def __init__(self, name, look="neutral", crop_top=0.0, crop_bottom=0.0, blur=0, darken=0.0):
        im = Image.open(os.path.join(IMG_DIR, name)).convert("RGB")
        if crop_top or crop_bottom:
            t = int(im.height * crop_top)
            b = int(im.height * (1 - crop_bottom))
            im = im.crop((0, t, im.width, b))
        tw, th = int(W * self.OVERSCAN), int(H * self.OVERSCAN)
        s = max(tw / im.width, th / im.height)
        im = im.resize((math.ceil(im.width * s), math.ceil(im.height * s)), Image.LANCZOS)
        x0 = (im.width - tw) // 2
        y0 = (im.height - th) // 2
        im = im.crop((x0, y0, x0 + tw, y0 + th))
        im = im.filter(ImageFilter.UnsharpMask(radius=2.2, percent=60, threshold=2))
        im = grade(im, **GRADES[look])
        if blur:
            im = im.filter(ImageFilter.GaussianBlur(blur))
        if darken:
            im = Image.blend(im, Image.new("RGB", im.size, (8, 12, 28)), darken)
        self.base = im
        self.bw, self.bh = im.size

    def render(self, zoom, cx, cy, dx=0.0, dy=0.0):
        zoom = max(1.0, zoom)
        ww = W * self.OVERSCAN / zoom
        wh = H * self.OVERSCAN / zoom
        x0 = clamp(cx) * (self.bw - ww) + dx
        y0 = clamp(cy) * (self.bh - wh) + dy
        x0 = clamp(x0, 0, self.bw - ww)
        y0 = clamp(y0, 0, self.bh - wh)
        return self.base.resize((W, H), Image.BILINEAR, box=(x0, y0, x0 + ww, y0 + wh))


def handheld(t, amp=3.0, seed=0.0):
    """Subtle hand-held drift in base pixels."""
    dx = amp * (math.sin(t * 1.3 + seed) * 0.6 + math.sin(t * 2.9 + seed * 2) * 0.4)
    dy = amp * (math.sin(t * 1.1 + seed * 3) * 0.6 + math.sin(t * 2.3 + seed) * 0.4)
    return dx, dy


# ---------------------------------------------------------------- text
def parse_markup(line):
    """'abc{def}ghi' -> [('abc',False),('def',True),('ghi',False)]"""
    segs, buf, hl = [], "", False
    for ch in line:
        if ch == "{":
            if buf:
                segs.append((buf, hl))
            buf, hl = "", True
        elif ch == "}":
            if buf:
                segs.append((buf, hl))
            buf, hl = "", False
        else:
            buf += ch
    if buf:
        segs.append((buf, hl))
    return segs


def text_block(text, size=68, weight=900, fill=(255, 255, 255), hl=(255, 225, 77),
               stroke=(18, 18, 24), stroke_w=None, line_gap=0.42, max_w=940,
               shadow=True, align="center"):
    """Render multi-line telop with {highlight} markup to RGBA."""
    lines = text.split("\n")
    while True:
        f = font(size, weight)
        sw = stroke_w if stroke_w is not None else max(2, round(size * 0.13))
        widths = [sum(f.getlength(s) for s, _ in parse_markup(l)) for l in lines]
        if max(widths) + sw * 2 <= max_w or size <= 30:
            break
        size -= 2
    asc, desc = f.getmetrics()
    lh = int((asc + desc) * (1 + line_gap) * 0.82)
    pad = sw + 24
    bw = int(max(widths)) + pad * 2
    bh = lh * len(lines) + pad * 2
    layer = Image.new("RGBA", (bw, bh), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    for i, line in enumerate(lines):
        segs = parse_markup(line)
        lw = widths[i]
        if align == "center":
            x = (bw - lw) / 2
        else:
            x = pad
        y = pad + i * lh
        for s, is_hl in segs:
            d.text((x, y), s, font=f, fill=hl if is_hl else fill,
                   stroke_width=sw, stroke_fill=stroke)
            x += f.getlength(s)
    if shadow:
        a = layer.getchannel("A").filter(ImageFilter.GaussianBlur(10))
        sh = Image.new("RGBA", layer.size, (0, 0, 0, 0))
        sh.putalpha(a.point(lambda v: int(v * 0.55)))
        out = Image.new("RGBA", layer.size, (0, 0, 0, 0))
        out.alpha_composite(sh, (0, 8))
        out.alpha_composite(layer)
        layer = out
    return layer


def with_alpha(img, a):
    if a >= 0.999:
        return img
    out = img.copy()
    out.putalpha(img.getchannel("A").point(lambda v: int(v * a)))
    return out


def paste_center(frame, img, cx, cy, alpha=1.0, scale=1.0):
    if alpha <= 0.003:
        return
    if abs(scale - 1.0) > 0.002:
        nw = max(1, int(img.width * scale))
        nh = max(1, int(img.height * scale))
        img = img.resize((nw, nh), Image.BILINEAR)
    img = with_alpha(img, alpha)
    x = int(cx - img.width / 2)
    y = int(cy - img.height / 2)
    # alpha_composite needs in-bounds source box
    sx, sy = max(0, -x), max(0, -y)
    ex = min(img.width, W - x)
    ey = min(img.height, H - y)
    if ex <= sx or ey <= sy:
        return
    frame.alpha_composite(img, (x + sx, y + sy), (sx, sy, ex, ey))


class Telop:
    """Timed overlay image with pop/slide/fade in-out (times are scene-local)."""

    def __init__(self, img, cx, cy, t_in, t_out, anim="pop", dur_in=0.28, dur_out=0.18, pulse=False):
        self.img, self.cx, self.cy = img, cx, cy
        self.t_in, self.t_out = t_in, t_out
        self.anim, self.dur_in, self.dur_out, self.pulse = anim, dur_in, dur_out, pulse

    def draw(self, frame, t):
        if t < self.t_in or t > self.t_out:
            return
        p = (t - self.t_in) / self.dur_in
        q = (self.t_out - t) / self.dur_out
        a = clamp(min(p * 1.6, q))
        cx, cy, s = self.cx, self.cy, 1.0
        if self.anim == "pop":
            s = lerp(0.86, 1.0, ease_out_back(p)) if p < 1 else 1.0
        elif self.anim == "up":
            cy += (1 - ease_out_cubic(p)) * 60
        elif self.anim == "down":
            cy -= (1 - ease_out_back(p)) * 260
            a = clamp(min(p * 3, q))
        elif self.anim == "left":
            cx -= (1 - ease_out_cubic(p)) * 120
        elif self.anim == "punch":
            s = lerp(1.35, 1.0, ease_out_cubic(p)) if p < 1 else 1.0
        if self.pulse and p >= 1:
            s *= 1.0 + 0.035 * (0.5 + 0.5 * math.sin((t - self.t_in) * 5.5))
        paste_center(frame, self.img, cx, cy, a, s)


# ---------------------------------------------------------------- UI helpers
def rounded_mask(w, h, r, ss=3):
    m = Image.new("L", (w * ss, h * ss), 0)
    ImageDraw.Draw(m).rounded_rectangle((0, 0, w * ss - 1, h * ss - 1), r * ss, fill=255)
    return m.resize((w, h), Image.LANCZOS)


def card(w, h, r=36, fill=(255, 255, 255, 235), shadow=True):
    """RGBA rounded card with soft shadow; returns (img, inner_offset)."""
    pad = 40 if shadow else 0
    out = Image.new("RGBA", (w + pad * 2, h + pad * 2), (0, 0, 0, 0))
    if shadow:
        sh = Image.new("L", out.size, 0)
        sh.paste(rounded_mask(w, h, r), (pad, pad + 10))
        sh = sh.filter(ImageFilter.GaussianBlur(18)).point(lambda v: int(v * 0.45))
        shl = Image.new("RGBA", out.size, (0, 0, 0, 0))
        shl.putalpha(sh)
        out.alpha_composite(shl)
    body = Image.new("RGBA", (w, h), fill)
    body.putalpha(rounded_mask(w, h, r).point(lambda v: int(v * fill[3] / 255)))
    out.alpha_composite(body, (pad, pad))
    return out, pad


def frosted(frame, box, r=36, blur=22, lighten=0.35):
    """Blur the frame region under a card for a glassy iOS-like look."""
    x0, y0, x1, y1 = [int(v) for v in box]
    x0, y0 = max(0, x0), max(0, y0)
    x1, y1 = min(W, x1), min(H, y1)
    if x1 - x0 < 4 or y1 - y0 < 4:
        return
    reg = frame.crop((x0, y0, x1, y1)).convert("RGB").filter(ImageFilter.GaussianBlur(blur))
    reg = Image.blend(reg, Image.new("RGB", reg.size, (255, 255, 255)), lighten).convert("RGBA")
    reg.putalpha(rounded_mask(x1 - x0, y1 - y0, r))
    frame.alpha_composite(reg, (x0, y0))


def wrap_jp(text, f, max_w):
    """Greedy char wrap with basic kinsoku (no line-start punctuation)."""
    no_start = set("、。，．！？」』）〉】ー…・ぁぃぅぇぉっゃゅょ")
    if "\n" in text:
        return [l for part in text.split("\n") for l in wrap_jp(part, f, max_w)]
    lines, cur = [], ""
    for ch in text:
        if f.getlength(cur + ch) > max_w and cur:
            if ch in no_start:
                cur += ch
                continue
            lines.append(cur)
            cur = ch
        else:
            cur += ch
    if cur:
        lines.append(cur)
    return lines


def check_icon(size, color=(46, 196, 140), bg=(255, 255, 255)):
    ss = 4
    s = size * ss
    im = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.ellipse((0, 0, s - 1, s - 1), fill=color)
    w = int(s * 0.1)
    d.line([(s * 0.27, s * 0.52), (s * 0.44, s * 0.68), (s * 0.74, s * 0.35)], fill=bg, width=w, joint="curve")
    return im.resize((size, size), Image.LANCZOS)


# ---------------------------------------------------------------- finishing
class Finisher:
    """Vignette + film grain, applied on the final RGB frame."""

    def __init__(self, vignette=0.32, grain=3.0, seed=7):
        yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
        nx = (xx - W / 2) / (W / 2)
        ny = (yy - H / 2) / (H / 2)
        r = np.sqrt(nx * nx * 0.9 + ny * ny * 0.6)
        self.vig = (1 - vignette * np.clip(r - 0.35, 0, None) ** 1.6)[..., None].astype(np.float32)
        rng = np.random.default_rng(seed)
        self.grain = [rng.normal(0, grain, (H, W, 1)).astype(np.float32) for _ in range(6)]

    def apply(self, rgb_img, i):
        a = np.asarray(rgb_img, dtype=np.float32)
        a = a * self.vig + self.grain[(i // 2) % len(self.grain)]
        return np.clip(a, 0, 255).astype(np.uint8)


# ---------------------------------------------------------------- timeline
class Scene:
    """A scene renders an RGBA frame for local time t."""

    def __init__(self, dur, render_fn, overlays=(), trans="cut", trans_dur=0.0):
        self.dur, self.render_fn = dur, render_fn
        self.overlays = list(overlays)
        self.trans, self.trans_dur = trans, trans_dur
        self.start = 0.0

    def render(self, t):
        fr = self.render_fn(t).convert("RGBA")
        for o in self.overlays:
            o.draw(fr, t)
        return fr


def build_timeline(scenes):
    t = 0.0
    for s in scenes:
        s.start = t
        t += s.dur
    return t


def photo_scene(photo, dur, z0, z1, c0, c1, shake=3.0, seed=0.0, overlays=(), **kw):
    def fn(t):
        p = ease_in_out(t / dur) * 0.85 + (t / dur) * 0.15
        dx, dy = handheld(t, shake, seed)
        return photo.render(lerp(z0, z1, p), lerp(c0[0], c1[0], p), lerp(c0[1], c1[1], p), dx, dy)
    return Scene(dur, fn, overlays, **kw)


def render_video(scenes, audio_path, out_path, finisher=None, preview_times=()):
    total = build_timeline(scenes)
    n = int(round(total * FPS))
    finisher = finisher or Finisher()
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    cmd = ["ffmpeg", "-y", "-loglevel", "error",
           "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
           "-i", audio_path,
           "-c:v", "libx264", "-preset", "medium", "-crf", "21", "-maxrate", "6M", "-bufsize", "12M",
           "-pix_fmt", "yuv420p", "-profile:v", "high",
           "-af", "loudnorm=I=-14:TP=-1.5:LRA=11", "-c:a", "aac", "-b:a", "192k", "-ar", "48000",
           "-movflags", "+faststart", "-shortest", out_path]
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    prev_dir = os.path.join(os.path.dirname(out_path), "preview")
    os.makedirs(prev_dir, exist_ok=True)
    want = {int(round(pt * FPS)) for pt in preview_times}
    for i in range(n):
        t = i / FPS
        k = 0
        for j, s in enumerate(scenes):
            if s.start <= t:
                k = j
        s = scenes[k]
        lt = t - s.start
        fr = s.render(lt)
        if k > 0 and s.trans_dur > 0 and lt < s.trans_dur:
            p = ease_in_out(lt / s.trans_dur)
            prev = scenes[k - 1]
            if s.trans == "xfade":
                pf = prev.render(t - prev.start)
                fr = Image.blend(pf, fr, p)
            elif s.trans == "black":
                fr = Image.blend(Image.new("RGBA", (W, H), (0, 0, 0, 255)), fr, p)
            elif s.trans == "flash":
                fr = Image.blend(Image.new("RGBA", (W, H), (255, 255, 255, 255)), fr, p)
        # fade-to-black tail for scenes that ask for it
        tail = getattr(s, "fade_out", 0.0)
        if tail and lt > s.dur - tail:
            p = (lt - (s.dur - tail)) / tail
            fr = Image.blend(fr, Image.new("RGBA", (W, H), (0, 0, 0, 255)), ease_in_out(p))
        out = finisher.apply(fr.convert("RGB"), i)
        if i in want:
            Image.fromarray(out).save(os.path.join(prev_dir, f"{os.path.basename(out_path)[:-4]}_{t:05.2f}.jpg"), quality=88)
        proc.stdin.write(out.tobytes())
    proc.stdin.close()
    proc.wait()
    return total
