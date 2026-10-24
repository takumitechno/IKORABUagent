"""Video B: 営業がしんどい人ほど事務が合う「3つの理由」リスト型 (33s, 9:16)."""
import math
import os
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

import audio as au
import narrated as nr
import voiceover as vo
from engine import (H, OUT_DIR, W, Photo, Scene, Telop, card, check_icon, clamp, ease_out_back,
                    ease_out_cubic, font, frosted, lerp, paste_center, photo_scene, render_video,
                    rounded_mask, text_block, with_alpha, wrap_jp)
from ui import Static, cta_button, note_pill

MINT = (46, 196, 182)
TEAL = (14, 147, 132)
INK = (24, 26, 32)
GREY = (110, 114, 124)


def T(text, t_in, t_out, size=70, cy=1330, anim="pop", **kw):
    return Telop(text_block(text, size=size, **kw), W / 2, cy, t_in, t_out, anim=anim)


def pill(text, size=38, bg=(0, 0, 0, 150), fg=(255, 255, 255), padx=34, pady=16, weight=700):
    f = font(size, weight)
    tw = int(f.getlength(text))
    asc, desc = f.getmetrics()
    w, h = tw + padx * 2, asc + desc + pady * 2 - 6
    im = Image.new("RGBA", (w, h), bg)
    im.putalpha(rounded_mask(w, h, h // 2).point(lambda v: int(v * bg[3] / 255)))
    ImageDraw.Draw(im).text((padx, pady - 6), text, font=f, fill=fg)
    return im


# ---------------------------------------------------------------- UI cards
class ScheduleCard:
    """Over-packed sales schedule that fills in row by row."""

    W_, H_ = 900, 430
    ROWS = [("09:00", "朝礼・数字の読み上げ", (229, 72, 77)),
            ("10:30", "A社 訪問", (59, 130, 246)),
            ("12:00", "移動（昼食は車内で）", (156, 163, 175)),
            ("14:00", "新規 飛び込み 20件", (229, 72, 77)),
            ("18:30", "帰社・日報・アポ取り", (139, 92, 246))]

    def __init__(self, t_in, cy):
        self.t_in, self.cy = t_in, cy
        bg, pad = card(self.W_, self.H_, r=34, fill=(255, 255, 255, 210))
        d = ImageDraw.Draw(bg)
        d.text((pad + 36, pad + 24), "今日の予定", font=font(36, 900), fill=INK)
        b = pill("アポ 4件", 26, bg=(229, 72, 77, 255), padx=18, pady=10)
        bg.alpha_composite(b, (pad + self.W_ - 36 - b.width, pad + 26))
        d.line((pad + 30, pad + 88, pad + self.W_ - 30, pad + 88), fill=(225, 227, 232), width=2)
        self.bg, self.pad = bg, pad
        self.rows = []
        for tm, label, col in self.ROWS:
            r = Image.new("RGBA", (self.W_ - 60, 62), (0, 0, 0, 0))
            rd = ImageDraw.Draw(r)
            rd.text((6, 8), tm, font=font(30, 700), fill=GREY)
            rd.rounded_rectangle((112, 8, 120, 54), 4, fill=col)
            rd.text((140, 6), label, font=font(33, 700), fill=INK)
            self.rows.append(r)

    def draw(self, frame, t):
        p = t - self.t_in
        if p < 0:
            return
        a = clamp(p / 0.25)
        img = self.bg.copy()
        for k, r in enumerate(self.rows):
            q = (p - 0.35 - k * 0.2) / 0.2
            if q <= 0:
                continue
            img.alpha_composite(with_alpha(r, clamp(q)), (self.pad + 30 + int((1 - ease_out_cubic(q)) * 40), self.pad + 104 + k * 64))
        x0 = (W - self.W_) / 2
        y0 = self.cy - self.H_ / 2 + (1 - ease_out_cubic(clamp(p / 0.35))) * 50
        if a > 0.99:
            frosted(frame, (x0, y0, x0 + self.W_, y0 + self.H_), r=34)
        paste_center(frame, img, W / 2, y0 + self.H_ / 2, a)


class SheetCard:
    """Spreadsheet being filled in and checked, row by row."""

    W_, H_ = 940, 720
    COLS = [("日付", 150), ("取引先", 300), ("金額", 270), ("確認", 220)]
    DATA = [("10/01", "A商事", "¥128,000"), ("10/03", "B物産", "¥56,400"),
            ("10/05", "Cシステム", "¥310,000"), ("10/08", "D工業", "¥89,900"),
            ("10/12", "E企画", "¥42,000"), ("10/15", "Fフーズ", "¥174,500")]
    ROW0, RH, HDR = 136, 78, 64
    STEP, T0 = 0.66, 0.55

    def __init__(self, t_in, cy):
        self.t_in, self.cy = t_in, cy
        bg, pad = card(self.W_, self.H_, r=30, fill=(255, 255, 255, 255))
        d = ImageDraw.Draw(bg)
        x0, y0 = pad, pad
        # window bar
        top = Image.new("RGBA", (self.W_, 72), (243, 244, 246, 255))
        m = Image.new("L", (self.W_, 72), 0)
        m.paste(rounded_mask(self.W_, 72 + 30, 30).crop((0, 0, self.W_, 72)))
        top.putalpha(m)
        bg.alpha_composite(top, (x0, y0))
        for k, c in enumerate([(255, 95, 87), (254, 188, 46), (40, 200, 64)]):
            d.ellipse((x0 + 28 + k * 30, y0 + 27, x0 + 46 + k * 30, y0 + 45), fill=c)
        d.text((x0 + 140, y0 + 16), "請求データ_10月", font=font(30, 700), fill=INK)
        d.text((x0 + self.W_ - 150, y0 + 20), "自動保存", font=font(26, 500), fill=GREY)
        # header row
        hy = y0 + 72
        d.rectangle((x0, hy, x0 + self.W_, hy + self.HDR), fill=(31, 138, 91))
        cx = x0
        self.colx = []
        for name, w in self.COLS:
            self.colx.append(cx)
            d.text((cx + 22, hy + 12), name, font=font(28, 700), fill=(255, 255, 255))
            cx += w
        # grid
        for r in range(len(self.DATA) + 1):
            yy = y0 + self.ROW0 + r * self.RH
            d.line((x0, yy, x0 + self.W_, yy), fill=(229, 231, 235), width=2)
        for cxx in self.colx[1:]:
            d.line((cxx, hy + self.HDR, cxx, y0 + self.ROW0 + len(self.DATA) * self.RH), fill=(229, 231, 235), width=2)
        self.bg, self.pad = bg, pad
        self.chk = check_icon(44, color=(31, 160, 100))
        self.f = font(30, 500)
        self.fb = font(32, 900)

    def check_times(self):
        return [self.t_in + self.T0 + r * self.STEP + 0.5 for r in range(len(self.DATA))]

    def type_window(self):
        return self.t_in + self.T0, self.t_in + self.T0 + len(self.DATA) * self.STEP

    def draw(self, frame, t):
        p = t - self.t_in
        if p < 0:
            return
        a = clamp(p / 0.3)
        img = self.bg.copy()
        d = ImageDraw.Draw(img)
        x0, y0 = self.pad, self.pad
        for r, row in enumerate(self.DATA):
            rs = self.T0 + r * self.STEP
            if p < rs:
                break
            q = (p - rs) / 0.42  # typing progress of this row
            yy = y0 + self.ROW0 + r * self.RH
            active = p < rs + self.STEP
            if active:
                d.rectangle((x0 + 2, yy + 2, x0 + self.W_ - 2, yy + self.RH - 2), fill=(234, 247, 240))
            full = "".join(row)
            n_chars = int(len(full) * clamp(q))
            used = 0
            for c, txt in enumerate(row):
                show = txt[: max(0, min(len(txt), n_chars - used))]
                used += len(txt)
                if not show:
                    continue
                tx = self.colx[c] + 22
                if c == 2:  # right-align amounts
                    tx = self.colx[c] + self.COLS[c][1] - 22 - self.f.getlength(show)
                d.text((tx, yy + 18), show, font=self.f, fill=INK)
                if active and len(show) < len(txt) and int(p * 6) % 2 == 0:
                    cxp = tx + self.f.getlength(show) + 2
                    d.line((cxp, yy + 20, cxp, yy + 58), fill=(31, 138, 91), width=3)
            if active and q < 1.0:
                c = min(2, sum(1 for L in (len(row[0]), len(row[0]) + len(row[1])) if n_chars >= L))
                bx = self.colx[c]
                d.rectangle((bx + 1, yy + 1, bx + self.COLS[c][1] - 1, yy + self.RH - 1), outline=(31, 138, 91), width=4)
            cq = (p - rs - 0.5) / 0.18
            if cq > 0:
                s = ease_out_back(cq)
                ci = self.chk.resize((max(1, int(44 * s)), max(1, int(44 * s))), Image.BILINEAR)
                cx = self.colx[3] + self.COLS[3][1] // 2
                img.alpha_composite(with_alpha(ci, clamp(cq * 2)), (int(cx - ci.width / 2), int(yy + self.RH / 2 - ci.height / 2)))
        tq = (p - (self.T0 + len(self.DATA) * self.STEP)) / 0.3
        if tq > 0:
            yy = y0 + self.ROW0 + len(self.DATA) * self.RH + 12
            d.text((self.colx[1] + 22, yy + 10), "合計", font=self.fb, fill=INK)
            s = "¥800,800"
            d.text((self.colx[2] + self.COLS[2][1] - 22 - self.fb.getlength(s), yy + 10), s, font=self.fb, fill=(31, 138, 91))
            msg = "ミス 0件"
            pw = pill(msg, 26, bg=(31, 160, 100, 255), padx=16, pady=10)
            img.alpha_composite(with_alpha(pw, clamp(tq)), (self.colx[3] + 30, yy + 12))
        y = self.cy - self.H_ / 2 + (1 - ease_out_cubic(clamp(p / 0.4))) * 70
        paste_center(frame, img, W / 2, y + self.H_ / 2, a)


class ChatCard:
    """Team chat where coworkers thank you."""

    W_, H_ = 940, 790
    MSGS = [  # (t, side, avatar char, avatar color, name, text, meta)
        (0.45, "me", None, None, None, "見積書の修正、完了しました！\n共有フォルダに入れてあります。", "既読 4"),
        (1.45, "you", "田", (251, 146, 60), "田中（営業部）", "もう終わったの！？\nありがとう、すごく助かる！", "15:02"),
        (2.55, "you", "山", (167, 139, 250), "山本（経理）", "請求書のチェックもいつも正確で\n本当に助かってます", "15:04"),
        (3.65, "you", "佐", (96, 165, 250), "佐々木 部長", "会議資料、見やすくまとまってたよ。\nありがとう。", "15:10"),
    ]

    def __init__(self, t_in, cy):
        self.t_in, self.cy = t_in, cy
        bg, pad = card(self.W_, self.H_, r=30, fill=(244, 246, 249, 255))
        d = ImageDraw.Draw(bg)
        hdr = Image.new("RGBA", (self.W_, 96), (255, 255, 255, 255))
        m = rounded_mask(self.W_, 96 + 30, 30).crop((0, 0, self.W_, 96))
        hdr.putalpha(m)
        bg.alpha_composite(hdr, (pad, pad))
        d.text((pad + 30, pad + 18), "‹", font=font(48, 500), fill=GREY)
        d.text((pad + 80, pad + 24), "総務チーム（5）", font=font(34, 900), fill=INK)
        d.line((pad, pad + 96, pad + self.W_, pad + 96), fill=(226, 228, 233), width=2)
        self.bg, self.pad = bg, pad
        self.items = []
        y = pad + 120
        for (tt, side, ch, col, name, text, meta) in self.MSGS:
            im = self._msg(side, ch, col, name, text, meta)
            self.items.append((tt, y, im))
            y += im.height + 18

    def blip_times(self):
        return [self.t_in + m[0] for m in self.MSGS]

    def _msg(self, side, ch, col, name, text, meta):
        f = font(30, 500)
        lines = wrap_jp(text, f, 600)
        lh = 44
        bw = int(max(f.getlength(l) for l in lines)) + 44
        bh = lh * len(lines) + 30
        name_h = 36 if side == "you" else 0
        w, h = self.W_ - 40, bh + name_h + 4
        im = Image.new("RGBA", (w, h), (0, 0, 0, 0))
        d = ImageDraw.Draw(im)
        ss = 3
        if side == "me":
            bx = w - 20 - bw
            fill = (190, 238, 226)
        else:
            av = Image.new("RGBA", (68 * ss, 68 * ss), (0, 0, 0, 0))
            ImageDraw.Draw(av).ellipse((0, 0, 68 * ss - 1, 68 * ss - 1), fill=col)
            av = av.resize((68, 68), Image.LANCZOS)
            ImageDraw.Draw(av).text((17, 8), ch, font=font(32, 900), fill=(255, 255, 255))
            im.alpha_composite(av, (10, 0))
            d.text((96, 0), name, font=font(24, 700), fill=GREY)
            bx = 96
            fill = (255, 255, 255)
        by = name_h
        bub = Image.new("RGBA", (bw * ss, bh * ss), (0, 0, 0, 0))
        ImageDraw.Draw(bub).rounded_rectangle((0, 0, bw * ss - 1, bh * ss - 1), 26 * ss, fill=fill + (255,))
        bub = bub.resize((bw, bh), Image.LANCZOS)
        im.alpha_composite(bub, (bx, by))
        for i, l in enumerate(lines):
            d.text((bx + 22, by + 12 + i * lh), l, font=f, fill=INK)
        mf = font(22, 500)
        if side == "me":
            d.text((bx - 12 - mf.getlength(meta), by + bh - 30), meta, font=mf, fill=GREY)
        else:
            d.text((bx + bw + 12, by + bh - 30), meta, font=mf, fill=GREY)
        return im

    def draw(self, frame, t):
        p = t - self.t_in
        if p < 0:
            return
        a = clamp(p / 0.3)
        img = self.bg.copy()
        for tt, y, im in self.items:
            q = (p - tt) / 0.28
            if q <= 0:
                continue
            img.alpha_composite(with_alpha(im, clamp(q)), (self.pad + 20, int(y + (1 - ease_out_cubic(q)) * 30)))
        yy = self.cy - self.H_ / 2 + (1 - ease_out_cubic(clamp(p / 0.4))) * 70
        paste_center(frame, img, W / 2, yy + self.H_ / 2, a)


class SkillCard:
    """Sales experience -> where it pays off in office work."""

    W_, H_ = 940, 660
    ROWS = [("電話・メール対応", "問い合わせ・来客対応"),
            ("スケジュール調整", "会議・日程の管理"),
            ("見積書・資料作成", "書類作成・データ管理"),
            ("社内外との折衝", "部署間の連携・サポート")]

    def __init__(self, t_in, cy):
        self.t_in, self.cy = t_in, cy
        bg, pad = card(self.W_, self.H_, r=30, fill=(255, 255, 255, 255))
        d = ImageDraw.Draw(bg)
        d.text((pad + 40, pad + 34), "営業でやってきたこと", font=font(28, 700), fill=GREY)
        d.text((pad + 500, pad + 34), "事務で活きる場面", font=font(28, 700), fill=TEAL)
        d.line((pad + 30, pad + 92, pad + self.W_ - 30, pad + 92), fill=(226, 228, 233), width=2)
        self.bg, self.pad = bg, pad
        self.rows = []
        chk = check_icon(40, color=MINT)
        for k, (l, r) in enumerate(self.ROWS):
            im = Image.new("RGBA", (self.W_ - 40, 120), (0, 0, 0, 0))
            dd = ImageDraw.Draw(im)
            dd.text((20, 34), l, font=font(33, 900), fill=INK)
            dd.text((402, 30), "→", font=font(38, 900), fill=MINT)
            dd.text((460, 34), r, font=font(33, 900), fill=TEAL)
            im.alpha_composite(chk, (self.W_ - 40 - 56, 40))
            if k < len(self.ROWS) - 1:
                dd.line((10, 118, self.W_ - 50, 118), fill=(238, 240, 243), width=2)
            self.rows.append(im)

    def row_times(self):
        return [self.t_in + 0.5 + k * 0.75 for k in range(len(self.ROWS))]

    def draw(self, frame, t):
        p = t - self.t_in
        if p < 0:
            return
        a = clamp(p / 0.3)
        img = self.bg.copy()
        for k, im in enumerate(self.rows):
            q = (p - 0.5 - k * 0.75) / 0.3
            if q <= 0:
                continue
            img.alpha_composite(with_alpha(im, clamp(q)), (self.pad + 20 - int((1 - ease_out_cubic(q)) * 80), self.pad + 104 + k * 124))
        yy = self.cy - self.H_ / 2 + (1 - ease_out_cubic(clamp(p / 0.4))) * 70
        paste_center(frame, img, W / 2, yy + self.H_ / 2, a)


# ---------------------------------------------------------------- backgrounds
def gradient_bg(top=(12, 22, 52), bottom=(20, 64, 96)):
    g = Image.new("RGB", (1, H))
    for y in range(H):
        k = y / (H - 1)
        g.putpixel((0, y), tuple(int(top[i] + (bottom[i] - top[i]) * k) for i in range(3)))
    base = g.resize((W, H)).convert("RGBA")
    blobs = []
    for col, r in [((46, 196, 182), 360), ((59, 130, 246), 420), ((255, 214, 102), 260)]:
        b = Image.new("RGBA", (r * 3, r * 3), (0, 0, 0, 0))
        ImageDraw.Draw(b).ellipse((r, r, r * 2, r * 2), fill=col + (120,))
        blobs.append(b.filter(ImageFilter.GaussianBlur(r * 0.45)))

    def fn(t):
        fr = base.copy()
        for k, b in enumerate(blobs):
            cx = W * (0.25 + 0.5 * k / 2) + math.sin(t * 0.6 + k * 2.1) * 140
            cy = H * (0.3 + 0.22 * k) + math.cos(t * 0.5 + k) * 120
            paste_center(fr, b, cx, cy, 0.8)
        return fr
    return fn


def blurred_scene(photo, dur, overlays, z0=1.0, z1=1.08, **kw):
    def fn(t):
        z = lerp(z0, z1, t / dur)
        return photo.render(z, 0.5, 0.5)
    return Scene(dur, fn, overlays, **kw)


def reason_header(num, title, t0=0.1):
    return [
        Telop(pill(f"理由 {num}", 40, bg=MINT + (255,), fg=(255, 255, 255), padx=30, pady=14, weight=900),
              W / 2, 250, t0, 99, anim="pop"),
        T(title, t0 + 0.15, 99, size=78, cy=405, anim="up"),
    ]


def build():
    b1 = Photo("b1_train.jpg", "cold", crop_top=0.09)
    b2 = Photo("b2_street.jpg", "harsh", crop_top=0.04)
    bg6 = Photo("a6_jimu_pc.jpg", "warm", blur=26, darken=0.5)
    bg7 = Photo("a7_jimu_support.jpg", "warm", blur=26, darken=0.5)
    bg1 = Photo("b1_train.jpg", "cold", crop_top=0.09, blur=26, darken=0.55)

    head = pill("営業 → 事務｜未経験転職", 36, bg=(0, 0, 0, 150))
    scenes = []
    # S1 hook
    scenes.append(photo_scene(b1, 3.8, 1.06, 1.16, (0.5, 0.25), (0.52, 0.3), seed=0.8, overlays=[
        Telop(head, W / 2, 205, 0.0, 99, anim="pop"),
        T("営業が{“しんどい”}人ほど\n事務が合うかもしれない", 0.12, 3.75, size=80, cy=1260),
    ]))
    # S2 packed sales day
    s2 = photo_scene(b2, 3.8, 1.12, 1.2, (0.5, 0.0), (0.52, 0.05), seed=1.7, overlays=[
        Telop(head, W / 2, 205, 0.0, 99, anim="pop", dur_in=0.01),
        None,
        T("合わないと感じるのは\n{甘えじゃない。}", 0.6, 3.75, size=80, cy=1420),
    ])
    sched = ScheduleCard(0.15, 1010)
    s2.overlays[1] = sched
    scenes.append(s2)
    # S3 title card
    scenes.append(Scene(1.8, gradient_bg(), [
        T("事務が合うかもしれない", 0.05, 1.8, size=68, cy=860, anim="up"),
        T("{3つの理由}", 0.25, 1.8, size=160, cy=1030, anim="punch", hl=(255, 225, 77)),
    ], trans="flash", trans_dur=0.2))
    # S4 reason 1: spreadsheet
    sheet = SheetCard(0.35, 960)
    scenes.append(blurred_scene(bg6, 6.0, reason_header("①", "ミスなく{コツコツ}が\n苦じゃない") + [
        sheet,
        T("データ入力・書類作成で\n{そのまま強みになる}", 4.75, 6.0, size=62, cy=1450),
    ], trans="xfade", trans_dur=0.25))
    # S5 reason 2: team chat
    chat = ChatCard(0.35, 955)
    scenes.append(blurred_scene(bg7, 6.0, reason_header("②", "人を{支える}ほうが\nやりがいを感じる") + [
        chat,
        T("『ありがとう』が\n{すぐ近くで届く}仕事", 4.6, 6.0, size=62, cy=1500),
    ], trans="xfade", trans_dur=0.25))
    # S6 reason 3: skill map
    skills = SkillCard(0.35, 940)
    scenes.append(blurred_scene(bg1, 5.6, reason_header("③", "営業経験が\n{そのまま武器}になる") + [
        skills,
        T("未経験でも{アピールできる}\n立派な経験です", 3.85, 5.6, size=62, cy=1420),
    ], trans="xfade", trans_dur=0.25))
    # S7 CTA
    disclaimer = note_pill("※画像はAI生成によるイメージです　※求人の内容・条件は企業により異なります")
    chips = [pill(f"✓ {c}", 34, bg=(255, 255, 255, 235), fg=TEAL, padx=26, pady=14, weight=900)
             for c in ("コツコツ型", "サポート好き", "営業経験あり")]
    gap = 22
    total_w = sum(c.width for c in chips) + gap * 2
    xs, x = [], (W - total_w) / 2
    for c in chips:
        xs.append(x + c.width / 2)
        x += c.width + gap
    scenes.append(Scene(6.0, gradient_bg((10, 18, 44), (14, 70, 92)), [
        Telop(disclaimer, W / 2, 175, 0.2, 99, anim="up"),
        T("ひとつでも当てはまったら", 0.15, 99, size=52, cy=560, anim="up", weight=700),
        *[Telop(c, xs[i], 680, 0.4 + i * 0.18, 99, anim="pop") for i, c in enumerate(chips)],
        T("『向いてない』で\n{終わらせない。}", 1.0, 99, size=96, cy=925, anim="up", hl=(255, 225, 77)),
        T("未経験から、事務職へ。", 1.5, 99, size=52, cy=1130, anim="up", weight=700),
        Telop(cta_button("まずは転職相談から ▶", c0=(46, 196, 182), c1=(37, 140, 230)), W / 2, 1295, 2.0, 99,
              anim="pop", pulse=True),
        T("プロフィールのリンクから", 2.2, 99, size=38, cy=1410, anim="up", weight=700),
    ], trans="xfade", trans_dur=0.35))
    return scenes, sched, sheet, chat, skills


# Narration cues: (scene, telop time, line). Lines are read in this order in the recorded take.
CUES = [
    vo.Cue(0, 0.12, "営業がしんどい人ほど、事務が合うかもしれない。"),
    vo.Cue(1, 0.3, "ノルマに、外回りに、飛び込み。合わないと感じるのは、甘えじゃない。", sync={2: 1}),
    vo.Cue(2, 0.05, "事務が合うかもしれない、三つの理由。"),
    vo.Cue(3, 0.15, "一つ目。ミスなく、コツコツが苦じゃない。データ入力や書類作成で、そのまま強みになる。", sync={3: 2}),
    vo.Cue(4, 0.15, "二つ目。人を支えるほうが、やりがいを感じる。ありがとうが、すぐ近くで届く仕事です。", sync={3: 2}),
    vo.Cue(5, 0.15, "三つ目。営業経験が、そのまま武器になる。未経験でも、アピールできる立派な経験です。", sync={3: 2}),
    vo.Cue(6, 0.15, "ひとつでも当てはまったら、向いてないで終わらせない。未経験から、事務職へ。相談は、プロフィールのリンクから。",
           sync={6: 1, 7: 2, 8: 2}),
]


# ---------------------------------------------------------------- audio
def build_audio(total, S, sheet, chat, skills, voice=None):
    music = au.Bus(total)
    sfx = au.Bus(total)
    bpm = 92
    beat = 60 / bpm
    bar = beat * 4
    chords = [(["F3", "A3", "C4", "E4"], "F2"), (["E3", "G3", "B3", "D4"], "E2"),
              (["D3", "F3", "A3", "C4"], "D2"), (["C3", "E3", "G3", "B3"], "C2")]
    drop = S[2]
    t0 = drop - bar * 3  # pickup so a bar lands on the drop
    while t0 < 0:
        t0 += bar
    b = 0
    intro_bus = au.Bus(total)
    while t0 < total - 0.5:
        tones, root = chords[b % 4]
        mids = [au.midi(au.n(x)) for x in tones]
        full = t0 >= drop - 0.01
        tgt = music if full else intro_bus
        last = t0 + bar > total - 0.8
        for hit, length in ([(0.0, beat * 1.5), (beat * 1.5, beat * 2.4)] if not last else [(0.0, beat * 3)]):
            for k, f in enumerate(mids):
                tgt.add(au.epiano(f * 2, length, 0.55), t0 + hit + k * 0.014, pan=-0.3 + 0.2 * k)
        if full:
            music.add(au.bass(au.midi(au.n(root)), beat * 1.8, 0.85), t0)
            music.add(au.bass(au.midi(au.n(root) + 7), beat * 0.9, 0.6), t0 + beat * 2.5)
            if not last:
                for q in range(4):
                    tb = t0 + q * beat
                    if q == 0 or (q == 2):
                        music.add(au.kick(0.8), tb)
                    if q == 2:
                        music.add(au.kick(0.5), tb + beat * 0.75)
                    if q in (1, 3):
                        music.add(au.snare(0.5), tb)
                    for e in range(2):
                        sw = 0.58 if e else 0.0
                        music.add(au.hat(0.8 if e else 1.0), tb + sw * beat, pan=0.25)
        else:
            for q in range(4):
                for e in range(2):
                    intro_bus.add(au.hat(0.55), t0 + q * beat + (0.58 * beat if e else 0), pan=0.25)
            if t0 >= S[1] - 0.01:
                intro_bus.add(au.kick(0.45), t0)
                intro_bus.add(au.kick(0.45), t0 + beat * 2)
        t0 += bar
        b += 1
    intro = intro_bus.buf.copy()
    intro[:, 0] = au.filt(intro[:, 0], "lowpass", 1100)
    intro[:, 1] = au.filt(intro[:, 1], "lowpass", 1100)
    mus = au.reverb(music.buf + intro * 0.9, 1.6, 0.22)
    vin = au.vinyl(total)
    mus[: len(vin), 0] += vin[: len(mus)]
    mus[: len(vin), 1] += vin[: len(mus)]

    # sfx
    sfx.add(au.sfx_pop(), 0.12, 0.7)
    for k in range(5):
        sfx.add(au.sfx_tick(), S[1] + 0.15 + 0.35 + k * 0.2, 0.55)
    sfx.add(au.sfx_pop(), S[1] + 0.6, 0.5)
    sfx.add(au.sfx_whoosh(0.5), S[2] - 0.35, 0.6)
    sfx.add(au.sfx_impact(), S[2] + 0.25, 0.8)
    for i, Si in enumerate([S[3], S[4], S[5]]):
        sfx.add(au.sfx_pop(), Si + 0.1, 0.55)
        sfx.add(au.sfx_whoosh(0.4), Si - 0.2, 0.35)
    a, bnd = sheet.type_window()
    base = S[3]
    for r in range(len(sheet.DATA)):
        rs = base + sheet.t_in + sheet.T0 + r * sheet.STEP
        sfx.add(au.sfx_type(0.42, 14), rs, 0.9)
    for ct in sheet.check_times():
        sfx.add(au.sfx_ding(1760), base + ct, 0.7)
    sfx.add(au.sfx_ding(2093), base + sheet.t_in + sheet.T0 + len(sheet.DATA) * sheet.STEP, 0.8)
    for bt in chat.blip_times():
        sfx.add(au.sfx_blip(), S[4] + bt, 0.8)
    for rt in skills.row_times():
        sfx.add(au.sfx_tick(), S[5] + rt, 0.6)
        sfx.add(au.sfx_ding(1568), S[5] + rt + 0.12, 0.4)
    sfx.add(au.sfx_pop(), S[3] + 4.75, 0.5)
    sfx.add(au.sfx_pop(), S[4] + 4.6, 0.5)
    sfx.add(au.sfx_pop(), S[5] + 3.85, 0.5)
    for i in range(3):
        sfx.add(au.sfx_tick(), S[6] + 0.4 + i * 0.18, 0.55)
    sfx.add(au.sfx_pop(), S[6] + 1.0, 0.5)
    sfx.add(au.sfx_chime(), S[6] + 2.0, 0.8)

    path = os.path.join(OUT_DIR, "video_b.wav")
    os.makedirs(OUT_DIR, exist_ok=True)
    if voice:
        nr.master_with_voice(total, voice, mus, sfx.buf, path)
    else:
        au.master(mus * 0.85, sfx.buf, path, total=total, fade_out=1.0)
    return path


if __name__ == "__main__":
    from engine import build_timeline
    scenes, sched, sheet, chat, skills = build()
    voice = vo.apply(scenes, CUES) if os.environ.get("VOICEOVER") else None
    total = build_timeline(scenes)
    S = [s.start for s in scenes]
    wav = build_audio(total, S, sheet, chat, skills, voice)
    prev = [float(x) for x in sys.argv[1:]] or [1.5, 5.5, 8.6, 12.0, 15.2, 20.5, 26.5, 32.5]
    out = os.path.join(OUT_DIR, "video_b_sales_to_jimu_3reasons" + ("_vo" if voice else "") + ".mp4")
    print("total", total, "starts", S)
    render_video(scenes, wav, out, preview_times=prev)
    print("done", out)
