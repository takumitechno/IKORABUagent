"""転職の教育ショート 第二弾（career_edu_2_*）: project paths, scene plans and diagram parts.

Built on the MakeCareer tools (../../makecareer/src): same engine, fonts, colours, subtitles and sound.
The diagrams carry each video over a full-screen photo (people, hands or just the place, reused from
media/IMAGES.md) that changes every scene — and inside long scenes — so the screen never sits still.

    python3 edu.py fit career_edu_2_01_salary        # timing/<name>.json from the narration take
    python3 edu.py preview e01_salary 0.5 3.0 6.0     # contact sheet in out/preview/
    python3 edu.py check career_edu_2_01_salary       # inspect the rendered MP4
    python3 e01_salary.py                             # render out/career_edu_2_01_salary.mp4
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
os.environ.setdefault("MC_PROJECT", ROOT)
sys.path.insert(0, os.path.join(os.path.dirname(ROOT), "makecareer", "src"))

from PIL import Image, ImageDraw  # noqa: E402

import mc  # noqa: E402
from engine import check_icon, ease_out_cubic  # noqa: E402
from mc import GREY, INK, TEAL, YELLOW, Telop, clamp, font, label, pill  # noqa: E402

ORANGE = (240, 160, 60)
LINE = (214, 220, 230)
SOFT = (238, 242, 247)
AI_NOTE = False      # no on-screen AI-image notice (the platforms' AI-content label is set when posting)
NOTE_XY = None       # notice at the usual place (top centre)
TAIL = 1.5           # short hold after the last word (no end card)
SFX_BOOST = 2.0      # card / item sounds at the first series' level
OPENING_PING = 1.2   # attention sound on the first frame, about as loud as the narration


def plan(scenes, telops, marks):
    return dict(scenes=scenes, telops=telops, marks=marks, tail=TAIL)


PLANS = {
    "career_edu_2_01_salary": plan(
        [("s1", "p1", "求人カード「月給25万円」（内訳はまだ見えない）"), ("s2", "p2a", "25万円を基本給20万円＋固定残業代5万円に分解"),
         ("s3", "p3a", "固定残業代で確認する2点"), ("s4", "p4", "今の給与明細と転職先を同じ項目で比較"),
         ("s5", "p5", "締め：合計だけでなく内訳も比較")],
        [("hook", "転職先の月給、\n{残業代込み？}", ("scene", "s1")),
         ("s2", "{月給25万円}の内訳", ("scene", "s2")),
         ("s3", "{固定残業代}で確認すること", ("scene", "s3")),
         ("s4", "{同じ項目}で比較", ("scene", "s4")),
         ("s5", "合計だけでなく、\n{内訳も比較}", ("scene", "s5"))],
        [("s2_base", "p2b", "基本給"), ("s2_fixed", "p2b", "固定"), ("s2_total", "p2c", None),
         ("s3_hours", "p3a", "残業|何時間"), ("s3_over", "p3b", None), ("s4_now", "p4", "給与明細|明細"),
         ("s4_same", "p4", "同じ")]),
    "career_edu_2_02_annual_income": plan(
        [("s1", "p1", "求人カード「年収例400万円」＋小さな「入社3年目」"), ("s2", "p2a", "「入社3年目」を拡大"),
         ("s3", "p3a", "先輩社員の一例と自分のスタートの比較表"), ("s4", "p4a", "条件確認で使える質問カード"),
         ("s5", "p5a", "締め：年収例と最初の1年は別")],
        [("hook", "求人の年収400万円。\n{初年度も？}", ("scene", "s1")),
         ("s2", "小さな{「入社3年目」}", ("scene", "s2")),
         ("s3", "{自分のスタート}は別に確認", ("scene", "s3")),
         ("s4", "{確認するなら}", ("scene", "s4")),
         ("s5", "年収例は、\n{最初の1年の収入}とは限らない", ("scene", "s5"))],
        [("s2_note", "p2a", "入社"), ("s2_senpai", "p2b", "先輩"), ("s3_me", "p3a", None),
         ("s3_pay", "p3b", "月給|月休"), ("s3_bonus", "p3b", "賞与|昭和"), ("s4_line1", "p4b", None),
         ("s4_line2", "p4b", "賞与|昭和"), ("s5_first", "p5a", "最初"), ("s5_sep", "p5b", None)]),
    "career_edu_2_03_training": plan(
        [("s1", "p1", "求人カードの「研修あり」ラベル"), ("s2", "p2", "ラベルを開いて「具体的には？」"),
         ("s3", "p3a", "面接での質問カード"), ("s4", "p4a", "確認する3項目のチェックリスト"),
         ("s5", "p5a", "締め：研修の有無→仕事を覚える環境")],
        [("hook", "未経験転職。\n{仕事についていける？}", ("scene", "s1")),
         ("s2", "「研修あり」の{中身}", ("scene", "s2")),
         ("s3", "面接で{聞くこと}", ("scene", "s3")),
         ("s4", "{3つ}を確認", ("scene", "s4")),
         ("s5", "{見るポイント}はここ", ("scene", "s5"))],
        [("s2_open", "p2", "中身"), ("s3_q2", "p3b", None), ("s4_who", "p4a", "誰|教|襲"), ("s4_ask", "p4b", None),
         ("s5_env", "p5a", "自分")]),
    "career_edu_2_04_office_work": plan(
        [("s1", "p1", "接客→事務、入力だけの仕事？"), ("s2", "p2a", "一般事務・営業事務の仕事内容の一例"),
         ("s3", "p3", "電話対応・担当範囲は会社ごとに違う"), ("s4", "p4a", "減らしたいことの整理"),
         ("s5", "p5", "締め：変えたい働き方→実際の仕事内容")],
        [("hook", "接客 → 事務", ("scene", "s1")),
         ("s2", "事務の{仕事内容}", ("scene", "s2")),
         ("s3", "{会社ごとに}違う", ("scene", "s3")),
         ("s4", "{減らしたいこと}は？", ("scene", "s4")),
         ("s5", "働き方を決めてから{比較}", ("scene", "s5"))],
        [("s1_office", "p1", "事務"), ("s2_sales", "p2b", None), ("s3_note", "p3", "会社"), ("s4_stand", "p4a", "立ち"),
         ("s4_people", "p4b", None),
         ("s5_check", "p5", "実際")]),
    "career_edu_2_05_self_pr": plan(
        [("s1", "p1", "空欄の自己PR欄"), ("s2", "p2", "普段の仕事の工夫を振り返る"),
         ("s3", "p3a", "「接客を担当しました」を3つの行動に"), ("s4", "p4", "書き換え前→書き換え後"),
         ("s5", "p5", "締め：実績を足すより、行動を具体化")],
        [("hook", "転職の自己PR\n{すごい実績がない…}", ("scene", "s1")),
         ("s2", "まず{普段の工夫}を振り返る", ("scene", "s2")),
         ("s3", "同じ経験を{具体的に}", ("scene", "s3")),
         ("s4", "{実際の行動}が見える", ("scene", "s4"))],
        [("s3_budget", "p3b", "予算"), ("s3_explain", "p3c", "説明|違い"), ("s3_propose", "p3c", "提案"),
         ("s5_daily", "p5", "いつも")]),
}


# ---------------------------------------------------------------- shared look
_bg = None


def background():
    """Same navy → teal backdrop as the first series' diagrams and closing screen."""
    global _bg
    if _bg is None:
        _bg = mc.gradient_bg((10, 18, 44), (14, 70, 92))
    return _bg


# background stills (media/IMAGES.md); masks blur stray text and logos
IMG = {
    "p3_phone": ("makecareer/img/v1_home_evening_phone.jpg", [(0.80, 0.76, 0.90, 0.81)]),
    "p3_bakery": ("makecareer/img/v1_bakery_handing_bag.jpg", [(0.80, 0.71, 1.0, 0.81), (0.86, 0.92, 1.0, 1.0)]),
    "p3_desk": ("makecareer/img/v1_home_morning_notebook.jpg", [(0.15, 0.78, 0.30, 0.85)]),
    "p4_desk": ("makecareer/img/v2_office_desk_thinking.jpg", [(0.40, 0.82, 0.60, 0.95), (0.0, 0.68, 0.14, 0.96)]),
    "p4_meeting": ("makecareer/img/v2_meeting_taking_notes.jpg", [(0.0, 0.76, 0.62, 0.88, 4)]),
    "p4_explain": ("makecareer/img/v2_explaining_document.jpg", [(0.04, 0.44, 0.38, 0.62, 5), (0.04, 0.62, 0.60, 0.86),
                                                                (0.08, 0.88, 0.70, 1.0)]),
    "p1_pc": ("recruit-shorts/sales-to-jimu/img/a6_jimu_pc.jpg", [(0.66, 0.46, 0.92, 0.68, 6)]),
    "p1_support": ("recruit-shorts/sales-to-jimu/img/a7_jimu_support.jpg", [(0.22, 0.75, 0.33, 0.84), (0.12, 0.80, 0.68, 1.0)]),
    "p5_street": ("makecareer/img/v3_after_shift_street_dusk.jpg", []),
    "p5_home": ("makecareer/img/v3_home_notebook_resume.jpg", [(0.0, 0.75, 0.47, 0.94)]),
    "p5_serve": ("makecareer/img/v3_cafe_serving_customer.jpg", [(0.05, 0.56, 0.22, 0.67)]),
    "p5_teach": ("makecareer/img/v3_cafe_teaching_coworker.jpg", [(0.85, 0.69, 1.0, 0.77)]),
    "p6_office": ("makecareer/img/v4_office_desk_laptop.jpg", [(0.20, 0.36, 0.37, 0.46), (0.77, 0.33, 0.95, 0.42),
                                                               (0.82, 0.72, 1.0, 0.98), (0.80, 0.67, 0.88, 0.73)]),
    "p7_suggest": ("makecareer/img/v2r_shop_suggesting_items.jpg", [(0.70, 0.70, 1.0, 0.80)]),
    "p7_teach": ("makecareer/img/v2r_shop_teaching_newcomer.jpg", [(0.33, 0.57, 0.70, 0.68, 5), (0.13, 0.83, 0.22, 0.89)]),
}
BG_BLUR, BG_DARK = 7, 0.5    # full-screen photo behind the diagrams; people and places still read as such
_photos = {}


def photo(key):
    if key not in _photos:
        name, masks = IMG[key]
        _photos[key] = mc.Photo(name, "neutral", blur=BG_BLUR, darken=BG_DARK, masks=masks)
    return _photos[key]


def backdrop(head, dur):
    """Full-screen photos for one scene: slow push-in with a gentle drift; a later photo crossfades in at its time."""
    shots = []
    for k, (t0, key, src) in enumerate(head):
        t1 = head[k + 1][0] if k + 1 < len(head) else dur
        shots.append((t0, photo(key), t1 - t0 + 0.4, clamp((src[1] + src[3]) / 2), (-1, 1)[k % 2]))

    def one(i, t):
        t0, ph, d, cy, drift = shots[i]
        p = clamp((t - t0) / max(0.1, d))
        return ph.render(1.06 + 0.06 * p, 0.5 + 0.08 * drift * (p - 0.5), cy).convert("RGBA")

    def fn(t):
        k = 0
        for i, s in enumerate(shots):
            if t >= s[0]:
                k = i
        fr = one(k, t)
        if k and t - shots[k][0] < 0.4:
            fr = Image.blend(one(k - 1, t), fr, (t - shots[k][0]) / 0.4)
        return fr
    return fn


def scene(tm, sid, overlays, head=()):
    """head: [(local start, IMG key, crop), ...] — the full-screen photo changes at those times
    (the crop's vertical centre keeps roughly that part of the photo in view)."""
    return tm.scene(sid, backdrop(head, tm.dur(sid)) if head else background(), overlays)


def telop(tm, sid, tid):
    """Emphasis telop at the top, as in the first series."""
    return tm.telop(sid, tid, size=80)


def tag(text="説明用の例"):
    return pill(text, 28, bg=(232, 236, 242), fg=GREY, weight=700, padx=20, pady=9)


def dark_tag(text):
    return pill(text, 30, bg=(255, 255, 255, 46), fg=(255, 255, 255), weight=700, padx=22, pady=10)


def text_img(text, size=48, weight=900, fill=INK):
    """Single line; `{...}` parts in teal (for use on white cards)."""
    from engine import parse_markup
    f = font(size, weight)
    segs = parse_markup(text)
    asc, desc = f.getmetrics()
    w = int(sum(f.getlength(s) for s, _ in segs)) + 4
    im = Image.new("RGBA", (w, asc + desc + 4), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    x = 2
    for s, hl in segs:
        d.text((x, 0), s, font=f, fill=TEAL if hl else fill)
        x += f.getlength(s)
    return im


def paste_mid(img, part, cx, cy):
    img.alpha_composite(part, (int(cx - part.width / 2), int(cy - part.height / 2)))


def at(cx, cy, img, t_in, t_out=99, anim="up", dur_in=0.35):
    return Telop(img, cx, cy, t_in, t_out, anim=anim, dur_in=dur_in)


def money_card(kind, amount, note=None, w=820, h=330):
    """Schematic job card with one headline amount (an example, not a real listing).

    A note (e.g. 「入社3年目」) goes small on its own line under the amount; its centre, relative to the
    card image, is kept in img.info["note_xy"] so it can be pointed at later.
    """
    h = h + (56 if note else 0)
    img, pad = mc.white_card(w, h, r=34)
    img.alpha_composite(pill("求人", 30), (pad + 40, pad + 34))
    t = tag()
    img.alpha_composite(t, (pad + w - 40 - t.width, pad + 36))
    lab = label(kind, 46, 700, GREY)
    num = label(amount, 132, 900, INK)
    y = pad + 120
    img.alpha_composite(lab, (pad + 56, y + 70))
    img.alpha_composite(num, (pad + 56 + lab.width + 24, y))
    if note:
        n = label(note, 30, 500, GREY)
        nx, ny = pad + w - 56 - n.width, pad + h - 34 - n.height
        img.alpha_composite(n, (nx, ny))
        img.info["note_xy"] = (nx + n.width / 2, ny + n.height / 2)
    return img


class GrowBar:
    """Stacked bar: each part grows from the left at its own time; widths follow the values exactly."""

    def __init__(self, x0, cy, width, height, parts, total):
        self.x0, self.cy, self.w, self.h, self.total = x0, cy, width, height, total
        self.parts = parts            # [(value, colour, inner_label, t_in)]

    def draw(self, frame, t):
        d = ImageDraw.Draw(frame)
        x = self.x0
        y0, y1 = self.cy - self.h / 2, self.cy + self.h / 2
        for value, colour, text, t_in in self.parts:
            full = self.w * value / self.total
            p = ease_out_cubic(clamp((t - t_in) / 0.5))
            if p > 0:
                d.rectangle((x, y0, x + full * p, y1), fill=colour)
                if p > 0.95 and text:
                    f = font(40, 900)
                    tw = f.getlength(text)
                    asc, desc = f.getmetrics()
                    d.text((x + (full - tw) / 2, self.cy - (asc + desc) / 2), text, font=f,
                           fill=INK if colour == YELLOW else (255, 255, 255))
            x += full
        d.rectangle((self.x0, y0, self.x0 + self.w, y1), outline=(255, 255, 255), width=3)


def bracket(width, text, size=40, color=(255, 255, 255)):
    """「⏞」-style bracket with a label above it (the whole of something)."""
    f = font(size, 900)
    asc, desc = f.getmetrics()
    h = asc + desc + 40
    im = Image.new("RGBA", (int(width) + 8, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.text(((width - f.getlength(text)) / 2 + 4, 0), text, font=f, fill=color)
    y = h - 16
    d.line([(4, h - 2), (4, y), (width + 4, y), (width + 4, h - 2)], fill=color, width=4)
    d.line([(width / 2 + 4, y), (width / 2 + 4, y - 12)], fill=color, width=4)
    return im


def qmark(size=64, color=YELLOW):
    im = Image.new("RGBA", (size * 4, size * 4), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.ellipse((0, 0, size * 4 - 1, size * 4 - 1), fill=color)
    f = font(size * 2.6, 900)
    asc, desc = f.getmetrics()
    d.text(((size * 4 - f.getlength("?")) / 2, (size * 4 - asc - desc) / 2 - size * 0.1), "?", font=f, fill=INK)
    return im.resize((size, size), Image.LANCZOS)


def q_card(text, w=820, h=128, size=48):
    img, pad = mc.white_card(w, h, r=28)
    q = qmark(64)
    img.alpha_composite(q, (pad + 34, pad + (h - 64) // 2))
    t = text_img(text, size)
    img.alpha_composite(t, (pad + 124, pad + (h - t.height) // 2))
    return img


def check_box(size=56, checked=False):
    if checked:
        return check_icon(size, color=TEAL)
    im = Image.new("RGBA", (size * 4, size * 4), (0, 0, 0, 0))
    ImageDraw.Draw(im).ellipse((6, 6, size * 4 - 7, size * 4 - 7), outline=(180, 188, 200), width=14)
    return im.resize((size, size), Image.LANCZOS)


def check_row(text, checked=False, w=820, h=120, size=48):
    img, pad = mc.white_card(w, h, r=26)
    img.alpha_composite(check_box(58, checked), (pad + 36, pad + (h - 58) // 2))
    t = text_img(text, size)
    img.alpha_composite(t, (pad + 124, pad + (h - t.height) // 2))
    return img


def column(header, cells, w=400, header_color=TEAL, row_h=104, header_h=96, cell_size=40, note=None, row_colors=None):
    """One column of a comparison table (columns are revealed one by one, rows line up across them).

    A cell is text, (text, colour), or None for an empty dashed box. row_colors puts the same small colour
    bar at the start of each row in every column, so matching rows read across.
    """
    h = header_h + row_h * len(cells) + (56 if note else 0)
    img, pad = mc.white_card(w, h, r=26)
    d = ImageDraw.Draw(img)
    d.rounded_rectangle((pad, pad, pad + w, pad + header_h), 26, fill=header_color)
    d.rectangle((pad, pad + header_h - 26, pad + w, pad + header_h), fill=header_color)
    hl = label(header, 40 if len(header) <= 8 else 34, 900, (255, 255, 255))
    paste_mid(img, hl, pad + w / 2, pad + header_h / 2)
    for k, cell in enumerate(cells):
        y = pad + header_h + k * row_h
        if k:
            d.line([(pad + 24, y), (pad + w - 24, y)], fill=LINE, width=3)
        if row_colors:
            d.rounded_rectangle((pad + 14, y + 22, pad + 24, y + row_h - 22), 5, fill=row_colors[k])
        if cell is None:
            paste_mid(img, blank_box(min(200, w - 90), 56), pad + w / 2 + 6, y + row_h / 2)
            continue
        text, colour = cell if isinstance(cell, tuple) else (cell, INK)
        paste_mid(img, label(text, cell_size, 900 if colour != GREY else 700, colour), pad + w / 2, y + row_h / 2)
    if note:
        paste_mid(img, label(note, 26, 500, GREY), pad + w / 2, pad + h - 30)
    return img


def blank_box(w=220, h=58):
    im = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    for x in range(0, w, 22):
        d.line([(x, 2), (min(w, x + 12), 2)], fill=(170, 178, 192), width=3)
        d.line([(x, h - 3), (min(w, x + 12), h - 3)], fill=(170, 178, 192), width=3)
    for y in range(0, h, 22):
        d.line([(2, y), (2, min(h, y + 12))], fill=(170, 178, 192), width=3)
        d.line([(w - 3, y), (w - 3, min(h, y + 12))], fill=(170, 178, 192), width=3)
    return im


class Unroll:
    """Reveals an image from the top down (a label opening into a panel)."""

    def __init__(self, img, cx, top, t_in, dur=0.6):
        self.img, self.cx, self.top, self.t_in, self.dur = img, cx, top, t_in, dur

    def draw(self, frame, t):
        p = ease_out_cubic(clamp((t - self.t_in) / self.dur))
        if p <= 0:
            return
        h = max(1, int(self.img.height * p))
        part = self.img.crop((0, 0, self.img.width, h))
        frame.alpha_composite(part, (int(self.cx - self.img.width / 2), int(self.top)))


def down_arrow(size=56, color=(255, 255, 255)):
    return mc.arrow(int(size * 2), size, color).rotate(-90, expand=True)


# ---------------------------------------------------------------- icons (no text)
def _cv(size):
    return Image.new("RGBA", (size * 4, size * 4), (0, 0, 0, 0)), size * 4


def _fin(im, size):
    return im.resize((size, size), Image.LANCZOS)


def store_icon(size=150, color=(255, 255, 255)):
    im, s = _cv(size)
    d = ImageDraw.Draw(im)
    w = int(s * 0.05)
    d.rectangle((s * 0.16, s * 0.42, s * 0.84, s * 0.88), outline=color, width=w)
    for k in range(4):        # striped awning
        x0 = s * (0.1 + k * 0.2)
        d.pieslice((x0, s * 0.26, x0 + s * 0.2, s * 0.5), 0, 180, fill=color if k % 2 == 0 else (0, 0, 0, 0),
                   outline=color, width=w)
    d.rectangle((s * 0.1, s * 0.16, s * 0.9, s * 0.38), outline=color, width=w)
    d.rectangle((s * 0.42, s * 0.6, s * 0.58, s * 0.88), fill=color)
    return _fin(im, size)


def desk_icon(size=150, color=(255, 255, 255)):
    im, s = _cv(size)
    d = ImageDraw.Draw(im)
    w = int(s * 0.05)
    d.rounded_rectangle((s * 0.16, s * 0.14, s * 0.84, s * 0.6), int(s * 0.04), outline=color, width=w)
    d.rectangle((s * 0.45, s * 0.6, s * 0.55, s * 0.72), fill=color)
    d.rounded_rectangle((s * 0.3, s * 0.72, s * 0.7, s * 0.77), int(s * 0.02), fill=color)
    d.rounded_rectangle((s * 0.12, s * 0.84, s * 0.88, s * 0.92), int(s * 0.03), fill=color)
    return _fin(im, size)


def phone_icon(size=70, color=TEAL):
    """Telephone handset."""
    im, s = _cv(size)
    d = ImageDraw.Draw(im)
    d.ellipse((0, 0, s - 1, s - 1), fill=color)
    w = int(s * 0.14)
    d.arc((s * 0.22, s * 0.22, s * 0.78, s * 0.78), 100, 260, fill=(255, 255, 255), width=w)
    d.ellipse((s * 0.3, s * 0.16, s * 0.48, s * 0.34), fill=(255, 255, 255))
    d.ellipse((s * 0.3, s * 0.66, s * 0.48, s * 0.84), fill=(255, 255, 255))
    return _fin(im.rotate(-35, resample=Image.BICUBIC), size)


def render(tm, scenes, preview, sfx):
    """Attention sound on the first frame, card/item sounds at the first series' level, soft swish on scene changes."""
    events = [(0.0, "ping", OPENING_PING)] + [(t, kind, min(0.4, g * SFX_BOOST)) for t, kind, g in sfx]
    events += [(s["start"] - 0.06, "swish", 0.2) for s in tm.data["scenes"][1:]]
    return mc.render(tm, scenes, preview, events, lift_at=None, ai_note=AI_NOTE, music_vel=0.42, note_xy=NOTE_XY)


# ---------------------------------------------------------------- command line
if __name__ == "__main__":
    cmd, args = sys.argv[1], sys.argv[2:]
    if cmd == "fit":
        import fit_audio
        fit_audio.PLANS.update(PLANS)
        for n in args:
            fit_audio.fit(n)
    elif cmd == "preview":
        import importlib.util   # by path: the sales-to-jimu folder on sys.path has its own preview.py
        spec = importlib.util.spec_from_file_location("mc_preview", os.path.join(mc.HERE, "preview.py"))
        preview = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(preview)
        print(preview.sheet(args[0], [float(x) for x in args[1:]]))
    elif cmd == "check":
        import check
        sys.exit(0 if all([check.check(n) for n in args]) else 1)
    else:
        sys.exit(f"unknown command {cmd!r} (fit / preview / check)")
