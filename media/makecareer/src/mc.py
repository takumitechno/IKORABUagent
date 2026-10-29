"""Shared pieces for the MakeCareer shorts, built on the sales-to-jimu engine.

Timing lives in ../timing/<video>.json (scene spans, full subtitles, emphasis telops, marks).
Edit that file after the narration arrives and re-run the video script; no audio is muxed.
"""
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
MEDIA = os.path.dirname(os.path.dirname(HERE))    # media
# project folder with narration/, timing/, out/ (default media/makecareer; other series set MC_PROJECT)
ROOT = os.path.abspath(os.environ.get("MC_PROJECT") or os.path.dirname(HERE))
sys.path.insert(0, os.path.join(MEDIA, "recruit-shorts", "sales-to-jimu", "src"))

from PIL import Image, ImageDraw  # noqa: E402

import engine  # noqa: E402
from engine import (H, W, Photo, Scene, Telop, card, clamp, ease_in_out, ease_out_back, font,  # noqa: E402,F401
                    handheld, lerp, paste_center, render_video, rounded_mask, text_block, wrap_jp)
from ui import Static, note_pill  # noqa: E402
from video_b import gradient_bg  # noqa: E402

engine.IMG_DIR = MEDIA        # photos are named relative to media/, as listed in media/IMAGES.md
OUT_DIR = os.path.join(ROOT, "out")

YELLOW = (255, 225, 77)
TEAL = (14, 147, 132)
MINT = (46, 196, 182)
BLUE = (37, 140, 230)
INK = (24, 26, 32)
GREY = (110, 114, 124)
PAPER = (255, 255, 255)
SERVICE = "メイクキャリア"
AI_NOTE = "※画像はAI生成によるイメージです"
SUB_CY = 1350      # full subtitles: above the SNS caption area
TOP_CY = 390       # emphasis telops


# ---------------------------------------------------------------- timing data
class Timing:
    def __init__(self, name):
        self.name = name
        self.path = os.path.join(ROOT, "timing", f"{name}.json")
        with open(self.path, encoding="utf-8") as f:
            self.data = json.load(f)
        self.scenes = {s["id"]: s for s in self.data["scenes"]}
        self.subs = self.data["subtitles"]
        self.tel = {t["id"]: t for t in self.data.get("telops", [])}
        self.marks = self.data.get("marks", {})
        prev = 0.0
        for s in self.data["scenes"]:
            assert abs(s["start"] - prev) < 1e-6, f"scene {s['id']} must start where the previous one ends"
            prev = s["end"]
        self.total = prev

    def dur(self, sid):
        return self.scenes[sid]["end"] - self.scenes[sid]["start"]

    def local(self, sid, t):
        return t - self.scenes[sid]["start"]

    def mark(self, sid, key):
        return self.local(sid, self.marks[key])

    def telop(self, sid, tid, size=80, cy=TOP_CY, anim="up", **kw):
        t = self.tel[tid]
        return Telop(emph(t["text"], size, **kw), W / 2, cy, self.local(sid, t["start"]), self.local(sid, t["end"]),
                     anim=anim, dur_in=0.35, dur_out=0.25)

    def scene(self, sid, render_fn, overlays=(), trans="xfade", trans_dur=0.3):
        return Scene(self.dur(sid), render_fn, overlays, trans=trans if sid != self.data["scenes"][0]["id"] else "cut",
                     trans_dur=trans_dur)


def fmt(t, srt=False):
    m, s = divmod(t, 60)
    if srt:
        return f"00:{int(m):02d}:{int(s):02d},{int(round((s % 1) * 1000)):03d}"
    return f"{int(m)}:{s:05.2f}"


def write_tables(tm):
    """Timing table (Markdown) and SRT next to the video, for laying in the narration."""
    os.makedirs(OUT_DIR, exist_ok=True)
    with open(os.path.join(OUT_DIR, f"{tm.name}.srt"), "w", encoding="utf-8") as f:
        for i, c in enumerate(tm.subs, 1):
            f.write(f"{i}\n{fmt(c['start'], True)} --> {fmt(c['end'], True)}\n{c['text']}\n\n")
    rows = [f"# {tm.data['video']} タイミング表", "", tm.data["status"], "",
            "| 種類 | ID | 開始 | 終了 | 内容 |", "|---|---|---|---|---|"]
    items = [("シーン", s["id"], s["start"], s["end"], s.get("note", "")) for s in tm.data["scenes"]]
    items += [("全文字幕", c["id"], c["start"], c["end"], c["text"]) for c in tm.subs]
    items += [("強調テロップ", t["id"], t["start"], t["end"], t["text"]) for t in tm.data.get("telops", [])]
    items.sort(key=lambda r: (r[2], ["シーン", "全文字幕", "強調テロップ"].index(r[0])))
    for kind, i, a, b, text in items:
        clean = text.replace("\n", " ").replace("{", "").replace("}", "").replace("|", "／")
        rows.append(f"| {kind} | {i} | {fmt(a)} | {fmt(b)} | {clean} |")
    with open(os.path.join(ROOT, "timing", f"{tm.name}.md"), "w", encoding="utf-8") as f:
        f.write("\n".join(rows) + "\n")


# ---------------------------------------------------------------- text
def emph(text, size=80, **kw):
    """Emphasis telop: short, bold, key words in yellow."""
    return text_block(text, size=size, hl=YELLOW, max_w=880, **kw)


def subtitle_lines(text, size=52, max_w=860):
    """(font size, lines) for a subtitle: explicit breaks first; a long line shrinks a little before it wraps."""
    parts = text.split("\n")
    while size > 44 and max(font(size, 700).getlength(p) for p in parts) > max_w - 64:
        size -= 2
    return size, [ln for part in parts for ln in wrap_jp(part, font(size, 700), max_w - 64)]


def subtitle_img(text, size=52, max_w=860):
    size, lines = subtitle_lines(text, size, max_w)
    f = font(size, 700)
    asc, desc = f.getmetrics()
    lh = int(size * 1.42)
    w = int(max(f.getlength(ln) for ln in lines)) + 64
    h = lh * len(lines) + 30
    im = Image.new("RGBA", (w, h), (10, 14, 28, 255))
    im.putalpha(rounded_mask(w, h, 22).point(lambda v: int(v * 0.64)))
    d = ImageDraw.Draw(im)
    for i, ln in enumerate(lines):
        d.text(((w - f.getlength(ln)) / 2, 15 + i * lh + (lh - asc - desc) / 2), ln, font=f, fill=(255, 255, 255))
    return im


def _bare(text):
    return "".join(ch for ch in text if ch not in "、。，．！？!?「」『』{}（）()…・ \n　")


class Subtitles:
    """Full narration subtitles (global time), one cue at a time, quick fades.

    A cue whose words are already on screen in an emphasis telop (e.g. the opening line repeated in the hook)
    is not drawn while that telop is up, so the same sentence is never shown twice at once.
    """

    def __init__(self, cues, cy=SUB_CY, telops=()):
        self.cues = []
        for c in cues:
            covered = [(t["start"], t["end"]) for t in telops if _bare(c["text"]) in _bare(t["text"])]
            self.cues.append((c["start"], c["end"], subtitle_img(c["text"]), covered))
        self.cy = cy

    def draw(self, frame, t):
        for a, b, img, covered in self.cues:
            if a <= t <= b and not any(x <= t <= y for x, y in covered):
                paste_center(frame, img, W / 2, self.cy, clamp(min((t - a) / 0.12, (b - t) / 0.12)))


def disclaimer(total):
    img = note_pill(AI_NOTE, size=27)
    return Static(img, 0.0, total, xy=(int((W - img.width) / 2), 200 - img.height // 2))


def pill(text, size=34, bg=TEAL, fg=(255, 255, 255), weight=900, padx=28, pady=12):
    f = font(size, weight)
    asc, desc = f.getmetrics()
    w, h = int(f.getlength(text)) + padx * 2, asc + desc + pady * 2 - 4
    im = Image.new("RGBA", (w, h), bg + (255,) if len(bg) == 3 else bg)
    im.putalpha(rounded_mask(w, h, h // 2).point(lambda v: int(v * (bg[3] if len(bg) == 4 else 255) / 255)))
    ImageDraw.Draw(im).text((padx, pady - 4), text, font=f, fill=fg)
    return im


def label(text, size=56, weight=900, fill=INK):
    f = font(size, weight)
    asc, desc = f.getmetrics()
    im = Image.new("RGBA", (int(f.getlength(text)) + 4, asc + desc + 4), (0, 0, 0, 0))
    ImageDraw.Draw(im).text((2, 0), text, font=f, fill=fill)
    return im


# ---------------------------------------------------------------- shots
def still(photo, dur, z0=1.0, z1=1.05, c0=(0.5, 0.5), c1=None, shake=1.2, seed=0.0):
    """Slow zoom on a still (no fast push-ins or big pans)."""
    c1 = c1 or c0

    def fn(t):
        p = ease_in_out(clamp(t / dur))
        dx, dy = handheld(t, shake, seed)
        return photo.render(lerp(z0, z1, p), lerp(c0[0], c1[0], p), lerp(c0[1], c1[1], p), dx, dy)
    return fn


WIN = (60, 500, 1020, 1270)   # photo window between the emphasis telop and the full subtitles


class Window:
    """A crop of the photo shown as a rounded card over a blurred, dimmed copy of the same photo.

    Keeps faces and hands clear of the subtitle and telop zones. `src` is the crop in source fractions
    (x0, y0, x1, y1); it is widened or heightened to the window's aspect around its centre.
    """

    def __init__(self, name, src, box=WIN, look="neutral", masks=(), bg_blur=26, bg_dark=0.5, overscan=1.12):
        im = Image.open(os.path.join(engine.IMG_DIR, name)).convert("RGB")
        for m in masks:
            im = engine.blur_region(im, m[:4], *m[4:])
        im = engine.grade(im, **engine.GRADES[look])
        bw, bh = box[2] - box[0], box[3] - box[1]
        x0, y0, x1, y1 = src[0] * im.width, src[1] * im.height, src[2] * im.width, src[3] * im.height
        cx, cy, w, h = (x0 + x1) / 2, (y0 + y1) / 2, x1 - x0, y1 - y0
        if w / h < bw / bh:
            w = h * bw / bh
        else:
            h = w * bh / bw
        k = min(1.0, im.width / w, im.height / h)   # never ask for more than the source has
        w, h = w * k, h * k
        x0, y0 =clamp(cx - w / 2, 0, im.width - w), clamp(cy - h / 2, 0, im.height - h)
        self.crop = im.resize((int(bw * overscan), int(bh * overscan)), Image.LANCZOS, box=(x0, y0, x0 + w, y0 + h))
        self.box, self.size = box, (bw, bh)
        self.mask = rounded_mask(bw, bh, 30)
        self.shadow, self.pad = card(bw, bh, r=30, fill=(0, 0, 0, 0))  # shadow only
        self.bg = Photo(name, look, blur=bg_blur, darken=bg_dark, masks=masks)

    def shot(self, dur, z0=1.0, z1=1.05, c0=(0.5, 0.5), c1=None, seed=0.0):
        c1 = c1 or c0
        cw, ch = self.crop.size
        bw, bh = self.size

        def fn(t):
            p = ease_in_out(clamp(t / dur))
            fr = self.bg.render(1.0 + 0.03 * p, 0.5, 0.5).convert("RGBA")
            z = lerp(z0, z1, p)            # 1.0 = the whole requested crop
            vw, vh = cw / z, ch / z
            dx, dy = handheld(t, 1.0, seed)
            x = clamp(lerp(c0[0], c1[0], p)) * (cw - vw) + dx
            y = clamp(lerp(c0[1], c1[1], p)) * (ch - vh) + dy
            x, y = clamp(x, 0, cw - vw), clamp(y, 0, ch - vh)
            win = self.crop.resize((bw, bh), Image.BILINEAR, box=(x, y, x + vw, y + vh)).convert("RGBA")
            win.putalpha(self.mask)
            fr.alpha_composite(self.shadow, (self.box[0] - self.pad, self.box[1] - self.pad))
            fr.alpha_composite(win, (self.box[0], self.box[1]))
            return fr
        return fn

    def backdrop(self, dur, z0=1.0, z1=1.03):
        """Only the blurred, dimmed copy (behind cards and notes)."""
        return lambda t: self.bg.render(lerp(z0, z1, clamp(t / dur)), 0.5, 0.5)


def shots(parts, fade=0.35):
    """[(local_start, fn(t_since_part_start)), ...] with a short crossfade at each cut."""
    def fn(t):
        k = 0
        for i, (t0, _) in enumerate(parts):
            if t >= t0:
                k = i
        t0, f = parts[k]
        fr = f(t - t0).convert("RGBA")
        if k > 0 and t - t0 < fade:
            pt0, pf = parts[k - 1]
            fr = Image.blend(pf(t - pt0).convert("RGBA"), fr, ease_in_out((t - t0) / fade))
        return fr
    return fn


def dim(fn, alpha=0.35, color=(8, 12, 28)):
    def g(t):
        fr = fn(t).convert("RGBA")
        return Image.blend(fr, Image.new("RGBA", (W, H), color + (255,)), alpha)
    return g


class Highlight:
    """Draws `img` (e.g. an accent frame) between t_in and t_out with a soft pop."""

    def __init__(self, img, cx, cy, t_in, t_out=1e9):
        self.img, self.cx, self.cy, self.t_in, self.t_out = img, cx, cy, t_in, t_out

    def draw(self, frame, t):
        if self.t_in <= t <= self.t_out:
            p = clamp((t - self.t_in) / 0.3)
            paste_center(frame, self.img, self.cx, self.cy, p, lerp(0.94, 1.0, ease_out_back(p)))


# ---------------------------------------------------------------- icons (drawn, no text)
def _canvas(size, ss=4):
    s = size * ss
    return Image.new("RGBA", (s, s), (0, 0, 0, 0)), s


def _done(im, size):
    return im.resize((size, size), Image.LANCZOS)


def doc_icon(size=140, color=TEAL):
    im, s = _canvas(size)
    d = ImageDraw.Draw(im)
    w = int(s * 0.06)
    x0, y0, x1, y1, fold = s * 0.2, s * 0.08, s * 0.8, s * 0.92, s * 0.2
    d.polygon([(x0, y0), (x1 - fold, y0), (x1, y0 + fold), (x1, y1), (x0, y1)], outline=color, width=w)
    d.line([(x1 - fold, y0), (x1 - fold, y0 + fold), (x1, y0 + fold)], fill=color, width=w)
    for k, y in enumerate((0.42, 0.56, 0.7)):
        d.line([(s * 0.32, s * y), (s * (0.68 if k < 2 else 0.54), s * y)], fill=color, width=w)
    return _done(im, size)


def chat_icon(size=140, color=TEAL):
    im, s = _canvas(size)
    d = ImageDraw.Draw(im)
    w = int(s * 0.06)
    d.rounded_rectangle((s * 0.06, s * 0.14, s * 0.62, s * 0.52), int(s * 0.12), outline=color, width=w)
    d.polygon([(s * 0.18, s * 0.5), (s * 0.14, s * 0.66), (s * 0.32, s * 0.52)], fill=color)
    d.rounded_rectangle((s * 0.38, s * 0.44, s * 0.94, s * 0.82), int(s * 0.12), fill=color)
    d.polygon([(s * 0.8, s * 0.8), (s * 0.86, s * 0.94), (s * 0.68, s * 0.82)], fill=color)
    for k in range(3):
        cx = s * (0.53 + k * 0.13)
        d.ellipse((cx - s * 0.035, s * 0.6, cx + s * 0.035, s * 0.67), fill=(255, 255, 255))
    return _done(im, size)


def pen_icon(size=150, color=INK, angle=-35):
    im, s = _canvas(size)
    d = ImageDraw.Draw(im)
    body = [(s * 0.44, s * 0.06), (s * 0.56, s * 0.06), (s * 0.56, s * 0.74), (s * 0.5, s * 0.9), (s * 0.44, s * 0.74)]
    d.polygon(body, fill=color)
    d.rectangle((s * 0.44, s * 0.06, s * 0.56, s * 0.18), fill=(90, 96, 110))
    d.polygon([(s * 0.47, s * 0.8), (s * 0.53, s * 0.8), (s * 0.5, s * 0.9)], fill=(230, 230, 235))
    return _done(im.rotate(angle, resample=Image.BICUBIC, center=(s * 0.5, s * 0.9)), size)


def bookmark_icon(size=60, color=YELLOW, filled=True):
    im, s = _canvas(size)
    d = ImageDraw.Draw(im)
    pts = [(s * 0.24, s * 0.08), (s * 0.76, s * 0.08), (s * 0.76, s * 0.92), (s * 0.5, s * 0.7), (s * 0.24, s * 0.92)]
    if filled:
        d.polygon(pts, fill=color)
    else:
        d.polygon(pts, outline=color, width=int(s * 0.08))
    return _done(im, size)


def book_icon(size=120, cover=TEAL):
    """Closed book with a plain cover (no title)."""
    im, s = _canvas(size)
    d = ImageDraw.Draw(im)
    d.rounded_rectangle((s * 0.2, s * 0.08, s * 0.8, s * 0.86), int(s * 0.05), fill=cover)
    d.rectangle((s * 0.2, s * 0.08, s * 0.3, s * 0.86), fill=tuple(int(c * 0.75) for c in cover))
    d.rounded_rectangle((s * 0.24, s * 0.82, s * 0.8, s * 0.94), int(s * 0.03), fill=(240, 240, 236))
    d.line([(s * 0.42, s * 0.3), (s * 0.7, s * 0.3)], fill=(255, 255, 255), width=int(s * 0.04))
    return _done(im, size)


def bag_icon(size=120, color=TEAL):
    """Briefcase (= a job)."""
    im, s = _canvas(size)
    d = ImageDraw.Draw(im)
    w = int(s * 0.07)
    d.rounded_rectangle((s * 0.36, s * 0.14, s * 0.64, s * 0.32), int(s * 0.05), outline=color, width=w)
    d.rounded_rectangle((s * 0.08, s * 0.28, s * 0.92, s * 0.86), int(s * 0.08), fill=color)
    d.line([(s * 0.08, s * 0.5), (s * 0.92, s * 0.5)], fill=(255, 255, 255), width=int(s * 0.04))
    return _done(im, size)


def search_icon(size=48, color=GREY):
    im, s = _canvas(size)
    d = ImageDraw.Draw(im)
    w = int(s * 0.12)
    d.ellipse((s * 0.1, s * 0.1, s * 0.66, s * 0.66), outline=color, width=w)
    d.line([(s * 0.58, s * 0.58), (s * 0.9, s * 0.9)], fill=color, width=w)
    return _done(im, size)


def flow_card(text, w=820, h=130, icon=None, size=52, accent=None):
    """White card with an optional icon and one short label; accent draws a coloured edge."""
    img, pad = white_card(w, h, r=28)
    d = ImageDraw.Draw(img)
    if accent:
        d.rounded_rectangle((pad, pad, pad + 16, pad + h), 8, fill=accent)
    x = pad + 44
    if icon is not None:
        img.alpha_composite(icon, (x, pad + (h - icon.height) // 2))
        x += icon.width + 26
    t = label(text, size)
    img.alpha_composite(t, (x, pad + (h - t.height) // 2))
    return img


def arrow(w=120, h=60, color=(255, 255, 255), both=False):
    ss = 4
    im = Image.new("RGBA", (w * ss, h * ss), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    t, hd = h * ss * 0.16, h * ss * 0.5
    y = h * ss / 2
    x0 = hd if both else 0
    d.rectangle((x0, y - t, w * ss - hd, y + t), fill=color)
    d.polygon([(w * ss - hd - 2, 0), (w * ss, y), (w * ss - hd - 2, h * ss)], fill=color)
    if both:
        d.polygon([(hd + 2, 0), (0, y), (hd + 2, h * ss)], fill=color)
    return im.resize((w, h), Image.LANCZOS)


# ---------------------------------------------------------------- cards
def white_card(w, h, r=34, alpha=246):
    return card(w, h, r=r, fill=(255, 255, 255, alpha))


def icon_card(icon, text, w=400, h=420, sub=None, accent=TEAL):
    img, pad = white_card(w, h)
    img.alpha_composite(icon, (pad + (w - icon.width) // 2, pad + 60))
    t = label(text, 60 if len(text) <= 4 else 50)
    img.alpha_composite(t, (pad + (w - t.width) // 2, pad + 60 + icon.height + 34))
    if sub:
        s = label(sub, 32, 500, GREY)
        img.alpha_composite(s, (pad + (w - s.width) // 2, pad + 60 + icon.height + 34 + t.height + 8))
    return img


def accent_frame(w, h, color=YELLOW, r=40, width=8):
    """Outline used to show 'this one is being talked about now'."""
    pad = 40
    im = Image.new("RGBA", (w + pad * 2, h + pad * 2), (0, 0, 0, 0))
    ImageDraw.Draw(im).rounded_rectangle((pad - 6, pad - 6, pad + w + 6, pad + h + 6), r, outline=color, width=width)
    return im


def sticky(text, w=600, h=380, angle=-2.5, size=72):
    """Sticky note on the desk with a short line of text."""
    img, pad = card(w, h, r=10, fill=(255, 241, 168, 255))
    d = ImageDraw.Draw(img)
    f = font(size, 700)
    lines = text.split("\n")
    asc, desc = f.getmetrics()
    lh = int(size * 1.35)
    y0 = pad + (h - lh * len(lines)) / 2
    for i, ln in enumerate(lines):
        d.text((pad + (w - f.getlength(ln)) / 2, y0 + i * lh + (lh - asc - desc) / 2), ln, font=f, fill=INK)
    tape = Image.new("RGBA", (180, 46), (255, 255, 255, 150))
    img.alpha_composite(tape, (pad + (w - 180) // 2, pad - 22))
    return img.rotate(angle, resample=Image.BICUBIC, expand=True)


def notebook(w, h, title=None, tag=None, lines_from=150, gap=92):
    """Ruled notebook page; returns (img, pad)."""
    img, pad = white_card(w, h, r=28, alpha=250)
    d = ImageDraw.Draw(img)
    for y in range(pad + lines_from, pad + h - 40, gap):
        d.line([(pad + 50, y), (pad + w - 50, y)], fill=(196, 214, 232), width=3)
    d.line([(pad + 110, pad + 30), (pad + 110, pad + h - 30)], fill=(244, 170, 170), width=3)
    x = pad + 140
    if title:
        p = pill(title, 38)
        img.alpha_composite(p, (x, pad + 46))
        x += p.width + 20
    if tag:
        t = pill(tag, 28, bg=(232, 236, 242), fg=GREY, weight=700, padx=20, pady=10)
        img.alpha_composite(t, (x, pad + 46 + 6))
    return img, pad


def bullet_line(text, size=54, color=INK, dot=TEAL):
    f = font(size, 700)
    asc, desc = f.getmetrics()
    tw = int(f.getlength(text))
    im = Image.new("RGBA", (tw + 70, asc + desc + 8), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    r = size * 0.22
    cy = (asc + desc) / 2 + 4
    d.ellipse((8, cy - r, 8 + 2 * r, cy + r), fill=dot)
    d.text((60, 0), text, font=f, fill=color)
    return im


def resume_sheet(w=860, h=760, hl_row=4):
    """Schematic 学歴・職歴 table: no name, address or readable history (bars stand in for entries)."""
    img, pad = white_card(w, h, r=18, alpha=255)
    d = ImageDraw.Draw(img)
    x0, x1 = pad + 40, pad + w - 40
    tag = pill("履歴書のイメージ", 26, bg=(232, 236, 242), fg=GREY, weight=700, padx=18, pady=8)
    img.alpha_composite(tag, (x0, pad + 26))
    top, rh = pad + 100, 82
    rows = 7
    c1, c2 = x0 + 120, x0 + 200
    if hl_row is not None:
        d.rectangle((x0, top + rh * hl_row, x1, top + rh * (hl_row + 1)), fill=(255, 241, 168))
    for r in range(rows + 1):
        d.line([(x0, top + r * rh), (x1, top + r * rh)], fill=(150, 156, 168), width=3 if r in (0, rows) else 2)
    for x in (x0, c1, c2, x1):
        d.line([(x, top), (x, top + rows * rh)], fill=(150, 156, 168), width=2)
    hf = font(30, 700)
    for txt, cx in (("年", (x0 + c1) / 2), ("月", (c1 + c2) / 2), ("学歴・職歴", (c2 + x1) / 2)):
        d.text((cx - hf.getlength(txt) / 2, top + 22), txt, font=hf, fill=GREY)
    lf = font(36, 900)
    for row, txt in ((1, "学歴"), (hl_row, "職歴")):
        d.text(((c2 + x1) / 2 - lf.getlength(txt) / 2, top + row * rh + 18), txt, font=lf, fill=INK)
    for row in (2, 3):  # school entries as grey bars (not readable)
        y = top + row * rh + rh / 2
        for (a, b) in ((x0 + 30, c1 - 30), (c1 + 18, c2 - 18), (c2 + 30, c2 + 30 + (330 if row == 2 else 280))):
            d.rounded_rectangle((a, y - 9, b, y + 9), 9, fill=(214, 218, 226))
    return img, pad, (x0, top, x1, rh)


# ---------------------------------------------------------------- schematic UI (jobs / search / PC)
def phone_frame(w=620, h=1080, r=70):
    """Generic phone outline with an empty white screen; returns (img, screen_box)."""
    pad = 40
    im = Image.new("RGBA", (w + pad * 2, h + pad * 2), (0, 0, 0, 0))
    sh, _ = card(w, h, r=r, fill=(20, 22, 28, 255))
    im.alpha_composite(sh, (0, 0))
    bez = 22
    scr = Image.new("RGBA", (w - bez * 2, h - bez * 2), (246, 247, 250, 255))
    scr.putalpha(rounded_mask(w - bez * 2, h - bez * 2, r - bez))
    im.alpha_composite(scr, (pad + bez, pad + bez))
    return im, (pad + bez, pad + bez, pad + w - bez, pad + h - bez)


def laptop(w=900, h=580, bezel=24):
    """Generic laptop (no logo): returns (img, screen_box) with an empty light screen to draw on."""
    pad = 40
    base_h = 40
    im = Image.new("RGBA", (w + 160 + pad * 2, h + base_h + pad * 2), (0, 0, 0, 0))
    lid, _ = card(w, h, r=26, fill=(34, 36, 42, 255))
    im.alpha_composite(lid, (80, 0))
    x0, y0 = 80 + pad, pad
    scr = Image.new("RGBA", (w - bezel * 2, h - bezel * 2), (247, 248, 250, 255))
    scr.putalpha(rounded_mask(w - bezel * 2, h - bezel * 2, 10))
    im.alpha_composite(scr, (x0 + bezel, y0 + bezel))
    d = ImageDraw.Draw(im)
    by = y0 + h
    d.polygon([(x0 - 70, by + base_h), (x0 + w + 70, by + base_h), (x0 + w + 14, by), (x0 - 14, by)], fill=(196, 200, 208))
    d.rectangle((x0 - 70, by + base_h - 8, x0 + w + 70, by + base_h), fill=(160, 165, 175))
    d.rounded_rectangle((x0 + w / 2 - 70, by, x0 + w / 2 + 70, by + 10), 5, fill=(170, 175, 185))
    return im, (x0 + bezel, y0 + bezel, x0 + w - bezel, y0 + h - bezel)


class Blink:
    """Text caret that blinks in place (the typing has stopped)."""

    def __init__(self, x, y, h, t_in, t_out=1e9, color=INK, period=1.0):
        self.x, self.y, self.h, self.t_in, self.t_out, self.color, self.period = x, y, h, t_in, t_out, color, period
        self.img = Image.new("RGBA", (5, int(h)), color + (255,))

    def draw(self, frame, t):
        if self.t_in <= t <= self.t_out and ((t - self.t_in) % self.period) < self.period * 0.55:
            frame.alpha_composite(self.img, (int(self.x), int(self.y)))


def job_card(w=520, h=170, title="求人イメージ", saved=False):
    """Schematic job listing: no company, salary or conditions (grey bars stand in)."""
    img, pad = card(w, h, r=22, fill=(255, 255, 255, 255))
    d = ImageDraw.Draw(img)
    th = h - 52
    d.rounded_rectangle((pad + 22, pad + 26, pad + 22 + th, pad + h - 26), 16, fill=(222, 232, 240))
    x = pad + 22 + th + 20
    bm = 50 if w < 450 else 54
    tf = font(28 if w < 450 else 32, 700)
    d.text((x, pad + 26), title, font=tf, fill=INK)
    avail = pad + w - 30 - bm - 12 - x
    for k, frac in enumerate((0.95, 0.7)):
        y = pad + int(h * 0.56) + k * 30
        d.rounded_rectangle((x, y, x + avail * frac, y + 14), 7, fill=(216, 220, 228))
    img.alpha_composite(bookmark_icon(bm, YELLOW if saved else (170, 176, 188), filled=saved), (pad + w - 30 - bm, pad + 22))
    return img


# ---------------------------------------------------------------- final CTA (shared layout)
def guide_band(text, w=880, h=124, size=48):
    """Teal→blue band (directional cue only; no button pulse or cursor)."""
    ss = 2
    g = Image.new("RGBA", (w * ss, h * ss))
    d = ImageDraw.Draw(g)
    for x in range(w * ss):
        k = x / (w * ss - 1)
        d.line([(x, 0), (x, h * ss)], fill=tuple(int(MINT[i] + (BLUE[i] - MINT[i]) * k) for i in range(3)) + (255,))
    g = g.resize((w, h), Image.LANCZOS)
    g.putalpha(rounded_mask(w, h, 22))
    f = font(size, 900)
    asc, desc = f.getmetrics()
    ImageDraw.Draw(g).text(((w - f.getlength(text)) / 2, (h - asc - desc) / 2 - 2), text, font=f, fill=(255, 255, 255))
    return g


def cta_scene(tm, sid, headline, sub=None, badge=None, band="プロフィールのリンクから", chips=(), hl_size=88):
    """Shared closing screen: service name, the topic to consult about, free consultation, profile link."""
    t0 = 0.15
    items = [(label(SERVICE, 60, 900, (240, 244, 248)), 0.0)]
    if chips:
        row = [pill(c, 34, bg=(255, 255, 255, 46), fg=(255, 255, 255), weight=700) for c in chips]
        rw = sum(r.width for r in row) + 20 * (len(row) - 1)
        strip = Image.new("RGBA", (rw, max(r.height for r in row)), (0, 0, 0, 0))
        x = 0
        for r in row:
            strip.alpha_composite(r, (x, 0))
            x += r.width + 20
        items.append((strip, 0.05))
    items.append((emph(headline, hl_size), 0.1))
    if sub:
        items.append((text_block(sub, size=52, weight=700, fill=(235, 240, 245), max_w=880), 0.2))
    if badge:
        items.append((pill(badge, 46, bg=YELLOW, fg=INK, padx=36, pady=14), 0.25))
    items.append((guide_band(band, size=48 if len(band) <= 16 else 42), 0.3))
    gaps = 22
    total_h = sum(im.height for im, _ in items) + gaps * (len(items) - 1)
    y = 800 - total_h / 2       # whole block stays above the subtitle band
    ov = []
    for im, dt in items:
        ov.append(Telop(im, W / 2, y + im.height / 2, t0 + dt, 1e9, anim="up", dur_in=0.35))
        y += im.height + gaps
    return tm.scene(sid, gradient_bg((10, 18, 44), (14, 70, 92)), ov)


# ---------------------------------------------------------------- sound
# Narration is the supplied take at its recorded speed. BGM is soft (e-piano + pad, light drums only once the
# service is introduced) and ducked under the voice. SFX only mark on-screen actions (a card or note appearing,
# an item being written); nothing on scene cuts and nothing on the closing screen.
CALM = [(["A2", "C3", "E3", "G3"], "A1"), (["F2", "A2", "C3", "E3"], "F1"),
        (["C3", "E3", "G3", "B3"], "C2"), (["G2", "B2", "D3", "E3"], "G1")]
LIFT = [(["F2", "A2", "C3", "E3"], "F1"), (["G2", "B2", "D3", "E3"], "G1"),
        (["E2", "G2", "B2", "D3"], "E1"), (["A2", "C3", "E3", "G3"], "A1")]


def sfx_sound(kind):
    import audio as au
    return {"pop": au.sfx_pop, "tick": au.sfx_tick, "paper": lambda: au.sfx_swish(0.28), "blip": au.sfx_blip}[kind]()


def build_audio(tm, sfx_events, lift_at, vel=0.55):
    import audio as au
    import align_clips as ac
    import narrated as nr
    import tts
    a = tm.data["audio"]
    x = ac.load(os.path.normpath(os.path.join(ROOT, "timing", a["file"])))
    voice = tts.voice_chain(x[int(a["cut"] * au.SR):])
    music, sfx = au.Bus(tm.total), au.Bus(tm.total)
    nr.groove(music, 0.0, lift_at, 88, CALM, drums=False, keys="ep", vel=vel, octave=12)
    if lift_at < tm.total:
        nr.groove(music, lift_at, tm.total, 88, LIFT, drums=True, keys="ep", vel=vel, octave=12,
                  hats=True, kick_pattern=(0, 2))
    for t, kind, gain in sfx_events:
        sfx.add(sfx_sound(kind), max(0.0, t), gain)
    path = os.path.join(OUT_DIR, f"{tm.name}.wav")
    os.makedirs(OUT_DIR, exist_ok=True)
    nr.mix(tm.total, [(a["at"], voice)], music, sfx, path, duck_db=11.0)
    return path


# ---------------------------------------------------------------- output
def render(tm, scenes, preview=(), sfx_events=(), lift_at=None, with_audio=True, ai_note=True, music_vel=0.55):
    """Write the MP4 (narration + BGM + SFX unless with_audio=False) plus the timing table and SRT.

    lift_at=None keeps the BGM without drums to the end; ai_note=False drops the AI-image notice
    (for videos that use no generated images).
    """
    out = os.path.join(OUT_DIR, tm.data["video"])
    write_tables(tm)
    wav = (build_audio(tm, sfx_events, lift_at if lift_at is not None else tm.total, music_vel)
           if with_audio else None)
    overlays = ([disclaimer(tm.total)] if ai_note else []) + [Subtitles(tm.subs, telops=tm.data.get("telops", []))]
    total = render_video(scenes, wav, out, preview_times=preview, global_overlays=overlays)
    assert abs(total - tm.total) < 1e-6, (total, tm.total)
    return out
