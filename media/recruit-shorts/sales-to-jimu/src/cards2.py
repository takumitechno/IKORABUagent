"""UI overlays for the narrated hook videos (C/D)."""
import math

from PIL import Image, ImageDraw, ImageFilter

from engine import (W, card, check_icon, clamp, ease_out_back, ease_out_cubic, font, frosted, handheld,
                    paste_center, with_alpha)

INK = (24, 26, 32)
GREY = (110, 114, 124)
TEAL = (14, 147, 132)
MINT = (46, 196, 182)
CORAL = (236, 72, 86)


def hook_shot(photo, z_end, c0, c1, punch=0.14, seed=0.0, shake=3.0):
    """Fast push-in punch on the first frames, then slow drift (scroll-stopper)."""
    def make(dur):
        def fn(t):
            p = t / dur
            z = z_end + punch * (1 - ease_out_cubic(t / 0.4))
            dx, dy = handheld(t, shake, seed)
            return photo.render(z + 0.04 * p, c0[0] + (c1[0] - c0[0]) * p, c0[1] + (c1[1] - c0[1]) * p, dx, dy)
        return fn
    return make


def checkbox(size, checked, color=CORAL):
    ss = 4
    s = size * ss
    im = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    if checked:
        d.rounded_rectangle((0, 0, s - 1, s - 1), int(s * 0.22), fill=color)
        d.line([(s * 0.24, s * 0.52), (s * 0.43, s * 0.7), (s * 0.77, s * 0.32)], fill=(255, 255, 255), width=int(s * 0.12),
               joint="curve")
    else:
        d.rounded_rectangle((0, 0, s - 1, s - 1), int(s * 0.22), outline=(170, 174, 182), width=int(s * 0.08), fill=(255, 255, 255))
    return im.resize((size, size), Image.LANCZOS)


class ChecklistCard:
    """'営業 向いてない度チェック' — rows appear and get ticked on narration cues (global time)."""

    W_, ROW = 920, 104

    def __init__(self, items, times, t_end, cy=1300, title="営業 向いてない度チェック"):
        self.items, self.times, self.t_end, self.cy = items, times, t_end, cy
        self.H_ = 100 + self.ROW * len(items) + 24
        bg, pad = card(self.W_, self.H_, r=34, fill=(255, 255, 255, 220))
        d = ImageDraw.Draw(bg)
        d.text((pad + 36, pad + 26), title, font=font(38, 900), fill=INK)
        tag = f"{len(items)}項目"
        tf = font(26, 700)
        tw = tf.getlength(tag)
        d.rounded_rectangle((pad + self.W_ - 60 - tw, pad + 30, pad + self.W_ - 32, pad + 72), 21, fill=CORAL)
        d.text((pad + self.W_ - 46 - tw, pad + 33), tag, font=tf, fill=(255, 255, 255))
        d.line((pad + 30, pad + 96, pad + self.W_ - 30, pad + 96), fill=(228, 230, 235), width=2)
        self.bg, self.pad = bg, pad
        self.box_off = checkbox(58, False)
        self.box_on = checkbox(58, True)
        self.rows = []
        for it in items:
            r = Image.new("RGBA", (self.W_ - 60, self.ROW - 8), (0, 0, 0, 0))
            ImageDraw.Draw(r).text((86, 18), it, font=font(40, 900), fill=INK)
            self.rows.append(r)

    def check_times(self):
        return [t + 0.45 for t in self.times]

    def draw(self, frame, t):
        if t < self.times[0] - 0.15 or t > self.t_end:
            return
        a = clamp((t - (self.times[0] - 0.15)) / 0.2)
        img = self.bg.copy()
        d = ImageDraw.Draw(img)
        for k, (r, ts) in enumerate(zip(self.rows, self.times)):
            q = (t - ts) / 0.22
            if q <= 0:
                continue
            y = self.pad + 104 + k * self.ROW
            nxt = self.times[k + 1] if k + 1 < len(self.times) else self.t_end
            if ts <= t < nxt:
                d.rounded_rectangle((self.pad + 18, y - 4, self.pad + self.W_ - 18, y + self.ROW - 12), 18, fill=(255, 244, 214))
            x = self.pad + 30 + int((1 - ease_out_cubic(q)) * 50)
            img.alpha_composite(with_alpha(r, clamp(q)), (x, y))
            cq = (t - ts - 0.45) / 0.18
            box = self.box_on if cq > 0 else self.box_off
            if cq > 0 and cq < 1:
                s = ease_out_back(cq)
                box = box.resize((max(1, int(58 * s)), max(1, int(58 * s))), Image.BILINEAR)
            img.alpha_composite(with_alpha(box, clamp(q)), (int(x + 14 + 29 - box.width / 2), int(y + 18 + 29 - box.height / 2)))
        x0 = (W - self.W_) / 2
        y0 = self.cy - self.H_ / 2
        if a > 0.99:
            frosted(frame, (x0, y0, x0 + self.W_, y0 + self.H_), r=34)
        paste_center(frame, img, W / 2, self.cy, a)


class ReframeCard:
    """weakness -> strength rows, each revealed on its narration line (scene-local)."""

    W_, ROW = 920, 140

    def __init__(self, rows, times, cy=1230, title="事務職だと、こう活きる"):
        self.data, self.times, self.cy = rows, times, cy
        self.H_ = 96 + self.ROW * len(rows) + 20
        bg, pad = card(self.W_, self.H_, r=34, fill=(255, 255, 255, 235))
        ImageDraw.Draw(bg).text((pad + 36, pad + 26), title, font=font(38, 900), fill=TEAL)
        ImageDraw.Draw(bg).line((pad + 30, pad + 92, pad + self.W_ - 30, pad + 92), fill=(228, 230, 235), width=2)
        self.bg, self.pad = bg, pad
        chk = check_icon(48, color=MINT)
        self.rows = []
        for k, (weak, strong) in enumerate(rows):
            r = Image.new("RGBA", (self.W_ - 60, self.ROW), (0, 0, 0, 0))
            d = ImageDraw.Draw(r)
            f1 = font(31, 700)
            d.text((14, 14), weak, font=f1, fill=GREY)
            # strike-through on the "weakness"
            d.line((12, 36, 18 + f1.getlength(weak), 36), fill=(160, 164, 172), width=3)
            d.text((14, 60), "→ " + strong, font=font(42, 900), fill=TEAL)
            r.alpha_composite(chk, (self.W_ - 60 - 64, 62))
            self.rows.append(r)

    def draw(self, frame, t):
        if t < self.times[0] - 0.2:
            return
        a = clamp((t - (self.times[0] - 0.2)) / 0.25)
        img = self.bg.copy()
        for k, (r, ts) in enumerate(zip(self.rows, self.times)):
            q = (t - ts) / 0.25
            if q <= 0:
                continue
            img.alpha_composite(with_alpha(r, clamp(q)), (self.pad + 30 - int((1 - ease_out_cubic(q)) * 70),
                                                           self.pad + 100 + k * self.ROW))
        y = self.cy + (1 - ease_out_cubic(a)) * 50
        paste_center(frame, img, W / 2, y, a)


class SkillList:
    """Checklist of sales skills that light up one by one; optional 'all → office core' finale."""

    W_, ROW = 900, 118

    def __init__(self, items, times, finale_t=None, cy=1000, title="営業でやってきたこと"):
        self.items, self.times, self.finale_t, self.cy = items, times, finale_t, cy
        self.H_ = 96 + self.ROW * len(items) + 20
        bg, pad = card(self.W_, self.H_, r=34, fill=(255, 255, 255, 240))
        ImageDraw.Draw(bg).text((pad + 36, pad + 26), title, font=font(36, 900), fill=GREY)
        ImageDraw.Draw(bg).line((pad + 30, pad + 92, pad + self.W_ - 30, pad + 92), fill=(228, 230, 235), width=2)
        self.bg, self.pad = bg, pad
        self.chk = check_icon(56, color=MINT)
        self.rows = []
        for k, it in enumerate(items):
            r = Image.new("RGBA", (self.W_ - 60, self.ROW - 10), (0, 0, 0, 0))
            d = ImageDraw.Draw(r)
            d.text((10, 22), f"{'①②③④'[k]}", font=font(44, 900), fill=MINT)
            d.text((80, 24), it, font=font(44, 900), fill=INK)
            self.rows.append(r)
        self.badge = None

    def draw(self, frame, t):
        if t < self.times[0] - 0.2:
            return
        a = clamp((t - (self.times[0] - 0.2)) / 0.25)
        img = self.bg.copy()
        d = ImageDraw.Draw(img)
        fin = self.finale_t is not None and t >= self.finale_t
        for k, (r, ts) in enumerate(zip(self.rows, self.times)):
            q = (t - ts) / 0.22
            if q <= 0:
                continue
            y = self.pad + 102 + k * self.ROW
            if fin:
                fq = clamp((t - self.finale_t - k * 0.08) / 0.2)
                d.rounded_rectangle((self.pad + 18, y - 2, self.pad + self.W_ - 18, y + self.ROW - 14), 18,
                                    fill=(int(255 - 31 * fq), int(255 - 8 * fq), int(255 - 14 * fq)))
            img.alpha_composite(with_alpha(r, clamp(q)), (self.pad + 30 + int((1 - ease_out_cubic(q)) * 60), y))
            cq = (t - ts - 0.3) / 0.18
            if cq > 0:
                s = ease_out_back(min(cq, 1))
                c = self.chk.resize((max(1, int(56 * s)), max(1, int(56 * s))), Image.BILINEAR)
                img.alpha_composite(c, (int(self.pad + self.W_ - 90 - c.width / 2), int(y + 26 + 28 - c.height / 2)))
        y = self.cy + (1 - ease_out_cubic(a)) * 50
        paste_center(frame, img, W / 2, y, a)


def stamp(text, size=128, color=CORAL, angle=-7):
    f = font(size, 900)
    tw = int(f.getlength(text))
    asc, desc = f.getmetrics()
    w, h = tw + 90, asc + desc + 50
    ss = 2
    im = Image.new("RGBA", (w * ss, h * ss), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.rounded_rectangle((8 * ss, 8 * ss, (w - 8) * ss, (h - 8) * ss), 26 * ss, fill=(255, 255, 255, 235),
                        outline=color + (255,), width=10 * ss)
    d.text((45 * ss, 14 * ss), text, font=font(size * ss, 900), fill=color + (255,))
    im = im.resize((w, h), Image.LANCZOS).rotate(angle, resample=Image.BICUBIC, expand=True)
    sh = Image.new("RGBA", im.size, (0, 0, 0, 0))
    sh.putalpha(im.getchannel("A").filter(ImageFilter.GaussianBlur(14)).point(lambda v: int(v * 0.5)))
    out = Image.new("RGBA", (im.width, im.height + 12), (0, 0, 0, 0))
    out.alpha_composite(sh, (0, 12))
    out.alpha_composite(im)
    return out


class Punch:
    """Image that slams in (big -> normal) at t_in."""

    def __init__(self, img, cx, cy, t_in, t_out=99):
        self.img, self.cx, self.cy, self.t_in, self.t_out = img, cx, cy, t_in, t_out

    def draw(self, frame, t):
        if t < self.t_in or t > self.t_out:
            return
        p = (t - self.t_in) / 0.22
        s = 1.0 + 0.9 * (1 - ease_out_back(clamp(p), 2.2)) if p < 1 else 1.0
        paste_center(frame, self.img, self.cx, self.cy, clamp(p * 3), s)


class Shake:
    """Short screen shake used on impact beats (applied by offsetting the scene render)."""

    @staticmethod
    def offset(t, t_hit, amp=14, dur=0.25):
        d = t - t_hit
        if d < 0 or d > dur:
            return 0, 0
        k = (1 - d / dur) * amp
        return k * math.sin(d * 90), k * math.cos(d * 70)
