"""Reusable realistic UI overlays (notifications, cards, CTA)."""
import math

from PIL import Image, ImageDraw

from engine import (H, W, card, check_icon, clamp, ease_out_back, ease_out_cubic, font, frosted,
                    paste_center, rounded_mask, text_block, wrap_jp)


def app_icon(size=84, top=(84, 150, 255), bottom=(42, 98, 230)):
    ss = 3
    s = size * ss
    g = Image.new("RGBA", (s, s))
    d = ImageDraw.Draw(g)
    for y in range(s):
        k = y / (s - 1)
        d.line([(0, y), (s, y)], fill=tuple(int(top[i] + (bottom[i] - top[i]) * k) for i in range(3)) + (255,))
    # generic chat bubble glyph
    d.ellipse((s * 0.2, s * 0.24, s * 0.8, s * 0.7), fill=(255, 255, 255, 255))
    d.polygon([(s * 0.33, s * 0.62), (s * 0.28, s * 0.8), (s * 0.48, s * 0.68)], fill=(255, 255, 255, 255))
    g = g.resize((size, size), Image.LANCZOS)
    g.putalpha(rounded_mask(size, size, int(size * 0.23)))
    return g


class Notification:
    """iOS-like banner that slides down from the top of the screen."""

    W_, H_ = 960, 178

    def __init__(self, t_in, t_out, y, app, title, body, when="今"):
        self.t_in, self.t_out, self.y = t_in, t_out, y
        img, pad = card(self.W_, self.H_, r=40, fill=(250, 250, 252, 200))
        d = ImageDraw.Draw(img)
        img.alpha_composite(app_icon(), (pad + 28, pad + 46))
        x = pad + 136
        d.text((x, pad + 22), app, font=font(27, 500), fill=(90, 90, 100))
        tw = font(27, 500).getlength(when)
        d.text((pad + self.W_ - 34 - tw, pad + 22), when, font=font(27, 500), fill=(110, 110, 120))
        d.text((x, pad + 58), title, font=font(35, 700), fill=(20, 20, 24))
        d.text((x, pad + 106), body, font=font(32, 500), fill=(40, 40, 46))
        self.img, self.pad = img, pad

    def draw(self, frame, t):
        if t < self.t_in or t > self.t_out:
            return
        p = (t - self.t_in) / 0.5
        y = self.y - (1 - ease_out_back(p, 1.2)) * 320
        x0 = (W - self.W_) / 2
        frosted(frame, (x0, y, x0 + self.W_, y + self.H_), r=40)
        frame.alpha_composite(self.img, (int(x0 - self.pad), int(y - self.pad)))


class QuotaCard:
    """Sales dashboard tile with an animated (bad) achievement rate."""

    W_, H_ = 920, 260

    def __init__(self, t_in, t_out, cy, target=62, remain="残り ¥2,000,000"):
        self.t_in, self.t_out, self.cy, self.target, self.remain = t_in, t_out, cy, target, remain
        self.bg, self.pad = card(self.W_, self.H_, r=36, fill=(255, 255, 255, 215))

    def draw(self, frame, t):
        if t < self.t_in or t > self.t_out:
            return
        p = (t - self.t_in)
        a = clamp(p / 0.25)
        prog = ease_out_cubic(clamp((p - 0.25) / 1.3))
        img = self.bg.copy()
        d = ImageDraw.Draw(img)
        pd = self.pad
        d.text((pd + 40, pd + 30), "今月の目標達成率", font=font(34, 700), fill=(70, 70, 80))
        rf = font(32, 700)
        d.text((pd + self.W_ - 40 - rf.getlength(self.remain), pd + 34), self.remain, font=rf, fill=(214, 52, 60))
        val = int(round(self.target * prog))
        d.text((pd + 36, pd + 76), f"{val}", font=font(104, 900), fill=(214, 52, 60))
        nw = font(104, 900).getlength(f"{val}")
        d.text((pd + 44 + nw, pd + 128), "%", font=font(52, 900), fill=(214, 52, 60))
        d.text((pd + self.W_ - 40 - font(30, 500).getlength("締め日まで あと3日"), pd + 150), "締め日まで あと3日",
               font=font(30, 500), fill=(90, 90, 100))
        bx, by, bw, bh = pd + 40, pd + 212, self.W_ - 80, 22
        d.rounded_rectangle((bx, by, bx + bw, by + bh), 11, fill=(228, 228, 232))
        fw = max(bh, int(bw * self.target / 100 * prog))
        d.rounded_rectangle((bx, by, bx + fw, by + bh), 11, fill=(229, 72, 77))
        x0 = (W - self.W_) / 2
        y0 = self.cy - self.H_ / 2 + (1 - ease_out_cubic(clamp(p / 0.35))) * -60
        if a > 0.99:
            frosted(frame, (x0, y0, x0 + self.W_, y0 + self.H_), r=36)
        paste_center(frame, img, W / 2, y0 + self.H_ / 2, a)


def speech_bubble(text, size=40, fill=(255, 255, 255), fg=(30, 30, 36), tail="bottom-right"):
    f = font(size, 700)
    tw = int(f.getlength(text))
    w, h = tw + 64, size + 52
    ss = 3
    pad = 30
    im = Image.new("RGBA", ((w + pad * 2) * ss, (h + pad * 2 + 30) * ss), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    x0, y0 = pad * ss, pad * ss
    d.rounded_rectangle((x0, y0, x0 + w * ss, y0 + h * ss), h * ss // 2, fill=fill + (255,))
    if tail == "bottom-right":
        tx = x0 + int(w * 0.72) * ss
    else:
        tx = x0 + int(w * 0.28) * ss
    ty = y0 + h * ss - 4
    d.polygon([(tx - 18 * ss, ty), (tx + 14 * ss, ty), (tx + 22 * ss, ty + 30 * ss)], fill=fill + (255,))
    im = im.resize((w + pad * 2, h + pad * 2 + 30), Image.LANCZOS)
    # shadow
    from PIL import ImageFilter
    sh = Image.new("RGBA", im.size, (0, 0, 0, 0))
    sh.putalpha(im.getchannel("A").filter(ImageFilter.GaussianBlur(10)).point(lambda v: int(v * 0.35)))
    out = Image.new("RGBA", im.size, (0, 0, 0, 0))
    out.alpha_composite(sh, (0, 6))
    out.alpha_composite(im)
    ImageDraw.Draw(out).text((pad + 32, pad + 18), text, font=f, fill=fg)
    return out


def cta_button(text, size=52, c0=(255, 138, 61), c1=(255, 94, 98), fg=(255, 255, 255), w=860, h=132):
    ss = 2
    g = Image.new("RGBA", (w * ss, h * ss))
    d = ImageDraw.Draw(g)
    for x in range(w * ss):
        k = x / (w * ss - 1)
        d.line([(x, 0), (x, h * ss)], fill=tuple(int(c0[i] + (c1[i] - c0[i]) * k) for i in range(3)) + (255,))
    g = g.resize((w, h), Image.LANCZOS)
    g.putalpha(rounded_mask(w, h, h // 2))
    pad = 40
    from PIL import ImageFilter
    out = Image.new("RGBA", (w + pad * 2, h + pad * 2), (0, 0, 0, 0))
    sh = Image.new("RGBA", out.size, (0, 0, 0, 0))
    m = Image.new("L", out.size, 0)
    m.paste(g.getchannel("A"), (pad, pad + 10))
    sh.putalpha(m.filter(ImageFilter.GaussianBlur(16)).point(lambda v: int(v * 0.45)))
    out.alpha_composite(sh)
    out.alpha_composite(g, (pad, pad))
    f = font(size, 900)
    d = ImageDraw.Draw(out)
    tw = f.getlength(text)
    asc, desc = f.getmetrics()
    d.text((pad + (w - tw) / 2, pad + (h - asc - desc) / 2 - 2), text, font=f, fill=fg)
    return out


def vertical_gradient(top_alpha=0, bottom_alpha=200, start=0.45, color=(10, 10, 18)):
    g = Image.new("RGBA", (W, H), color + (0,))
    a = Image.new("L", (1, H))
    for y in range(H):
        k = clamp((y / H - start) / (1 - start))
        a.putpixel((0, y), int(top_alpha + (bottom_alpha - top_alpha) * (k ** 1.3)))
    g.putalpha(a.resize((W, H)))
    return g


class Static:
    def __init__(self, img, t_in=0.0, t_out=1e9, xy=(0, 0)):
        self.img, self.t_in, self.t_out, self.xy = img, t_in, t_out, xy

    def draw(self, frame, t):
        if self.t_in <= t <= self.t_out:
            a = clamp((t - self.t_in) / 0.3)
            if a < 1:
                from engine import with_alpha
                frame.alpha_composite(with_alpha(self.img, a), self.xy)
            else:
                frame.alpha_composite(self.img, self.xy)


def small_text(text, size=26, fill=(255, 255, 255, 220), weight=500):
    return text_block(text, size=size, weight=weight, fill=fill, stroke=(0, 0, 0), stroke_w=0,
                      line_gap=0.3, shadow=True, max_w=980)


def note_pill(text, size=24, bg=(0, 0, 0, 130), fg=(255, 255, 255)):
    """Small disclaimer on a translucent pill so it stays legible on bright footage."""
    f = font(size, 500)
    tw = int(f.getlength(text))
    asc, desc = f.getmetrics()
    w, h = tw + 44, asc + desc + 16
    im = Image.new("RGBA", (w, h), bg)
    im.putalpha(rounded_mask(w, h, h // 2).point(lambda v: int(v * bg[3] / 255)))
    ImageDraw.Draw(im).text((22, 6), text, font=f, fill=fg)
    return im
