"""① 転職先の月給、内訳を見よう → career_edu_2_01_salary.mp4 (timing in ../timing/career_edu_2_01_salary.json)."""
import sys

from PIL import Image, ImageDraw

import edu
import mc
from edu import ORANGE, at
from mc import GREY, INK, MINT, TEAL, W, YELLOW, label

NAME = "career_edu_2_01_salary"
AI_NOTE = edu.AI_NOTE
NOTE_XY = edu.NOTE_XY
BAR_X, BAR_W, BAR_H = 130, 820, 96
CARD_Y = 760
ROWS = [TEAL, YELLOW, (250, 214, 140), (250, 214, 140)]


def hidden_breakdown():
    """「内訳 ？」: the split is not visible yet."""
    im = Image.new("RGBA", (520, 96), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.rounded_rectangle((3, 3, 517, 93), 46, outline=(255, 255, 255, 170), width=4)
    t = label("内訳　？", 44, 900, (255, 255, 255))
    edu.paste_mid(im, t, 260, 48)
    return im


def equation():
    parts = [("20万円", MINT), (" ＋ ", (255, 255, 255)), ("5万円", YELLOW), (" ＝ ", (255, 255, 255)), ("25万円", (255, 255, 255))]
    imgs = [label(t, 50, 900, c) for t, c in parts]
    out = Image.new("RGBA", (sum(i.width for i in imgs), max(i.height for i in imgs)), (0, 0, 0, 0))
    x = 0
    for i in imgs:
        out.alpha_composite(i, (x, 0))
        x += i.width
    return out


ITEMS = ["基本給", "固定残業代", "何時間分", "超えた分の支払い"]
COL_W, HEAD_H, ROW_H = 400, 92, 112


def pay_column(header, values, header_color):
    """One side of the comparison: every row names the item and holds its value (or an empty box)."""
    img, pad = mc.white_card(COL_W, HEAD_H + ROW_H * len(ITEMS), r=26)
    d = ImageDraw.Draw(img)
    d.rounded_rectangle((pad, pad, pad + COL_W, pad + HEAD_H), 26, fill=header_color)
    d.rectangle((pad, pad + HEAD_H - 26, pad + COL_W, pad + HEAD_H), fill=header_color)
    edu.paste_mid(img, label(header, 38, 900, (255, 255, 255)), pad + COL_W / 2, pad + HEAD_H / 2)
    for k, (item, value) in enumerate(zip(ITEMS, values)):
        y = pad + HEAD_H + k * ROW_H
        if k:
            d.line([(pad + 20, y), (pad + COL_W - 20, y)], fill=edu.LINE, width=3)
        d.rounded_rectangle((pad + 16, y + 18, pad + 28, y + ROW_H - 18), 6, fill=ROWS[k])
        img.alpha_composite(label(item, 28, 700, GREY), (pad + 44, y + 12))
        if value is None:
            img.alpha_composite(edu.blank_box(200, 46), (pad + 44, y + 54))
        else:
            text, colour = value if isinstance(value, tuple) else (value, INK)
            img.alpha_composite(label(text, 44, 900, colour), (pad + 44, y + 46))
    return img


class Links:
    """Coloured lines joining the same row of both columns."""

    def __init__(self, top, t_in):
        self.top, self.t_in = top, t_in

    def draw(self, frame, t):
        a = int(255 * max(0.0, min(1.0, (t - self.t_in) / 0.3)))
        if a <= 0:
            return
        d = ImageDraw.Draw(frame)
        x0, x1 = 300 + COL_W / 2, 780 - COL_W / 2
        for k in range(len(ITEMS)):
            y = self.top + k * ROW_H + ROW_H / 2
            d.line([(x0 - 4, y), (x1 + 4, y)], fill=ROWS[k][:3] + (a,), width=6)


def bar(cy, t_base, t_fixed):
    return edu.GrowBar(BAR_X, cy, BAR_W, BAR_H, [(20, TEAL, "基本給 20万円", t_base), (5, YELLOW, "5万円", t_fixed)], 25)


def build(tm):
    scenes = []
    card = edu.money_card("月給", "25万円")
    fixed_cx = BAR_X + BAR_W * 22.5 / 25          # centre of the 5万円 part

    # s1: the listing shows only the total
    sid = "s1"
    scenes.append(edu.scene(tm, sid, [edu.telop(tm, sid, "hook"), at(W / 2, CARD_Y, card, 0.0),
                                      at(W / 2, 1060, hidden_breakdown(), 0.3, anim="fade")], head=[(0, "p3_phone", (0, 0.395, 1, 0.61))]))

    # s2: 25万円 = 基本給20万円 + 固定残業代5万円 (bar widths 20:5; nothing added on top of 25)
    sid = "s2"
    ov = [edu.telop(tm, sid, "s2"), at(W / 2, CARD_Y, card, -1.0),
          bar(1050, tm.mark(sid, "s2_base"), tm.mark(sid, "s2_fixed")),
          at(fixed_cx, 1130, label("固定残業代", 32, 700, (255, 255, 255)), tm.mark(sid, "s2_fixed") + 0.3, anim="fade"),
          at(W / 2, 1205, equation(), tm.mark(sid, "s2_total"), anim="up")]
    scenes.append(edu.scene(tm, sid, ov, head=[(0, "p3_phone", (0.2, 0.47, 1.0, 0.67)), (tm.mark(sid, "s2_total"), "p3_bakery", (0.0, 0.22, 0.6, 0.36))]))

    # s3: what to check about the fixed overtime part
    sid = "s3"
    ov = [edu.telop(tm, sid, "s3"), bar(640, -1.0, -1.0),
          at(fixed_cx, 722, label("固定残業代", 32, 700, (255, 255, 255)), -1.0, anim="fade"),
          mc.Highlight(mc.accent_frame(int(BAR_W * 5 / 25), BAR_H, YELLOW, r=14), fixed_cx, 640, 0.1),
          at(W / 2, 870, edu.q_card("{何時間分}？"), tm.mark(sid, "s3_hours")),
          at(W / 2, 1050, edu.q_card("{超えた分}の支払いは？"), tm.mark(sid, "s3_over"))]
    scenes.append(edu.scene(tm, sid, ov, head=[(0, "p3_bakery", (0, 0.295, 1, 0.51))]))

    # s4: compare the same items side by side (no amount is invented for the current payslip)
    sid = "s4"
    now = pay_column("今の給与明細", [None] * 4, (90, 100, 118))
    new = pay_column("転職先の給与条件", ["20万円", "5万円", ("要確認", ORANGE), ("要確認", ORANGE)], TEAL)
    ty = 852
    ov = [edu.telop(tm, sid, "s4"),
          at(300, ty, now, tm.mark(sid, "s4_now")),
          Links(ty - now.height / 2 + 40 + HEAD_H, tm.mark(sid, "s4_same") - 0.05),
          at(780, ty, new, tm.mark(sid, "s4_same")),
          at(780, ty + new.height / 2 + 6, edu.tag(), tm.mark(sid, "s4_same") + 0.2, anim="fade")]
    scenes.append(edu.scene(tm, sid, ov, head=[(0, "p3_desk", (0, 0.62, 1, 0.82))]))

    # s5: not just the total — the breakdown too
    sid = "s5"
    total, pad = mc.white_card(820, 150, r=30, alpha=200)
    total.alpha_composite(label("合計", 40, 700, GREY), (pad + 48, pad + 50))
    total.alpha_composite(label("25万円", 72, 900, GREY), (pad + 170, pad + 26))
    parts, pad2 = mc.white_card(820, 230, r=30)
    d = ImageDraw.Draw(parts)
    parts.alpha_composite(label("内訳", 40, 900, INK), (pad2 + 48, pad2 + 30))
    bx, by, bw = pad2 + 48, pad2 + 104, 724
    d.rectangle((bx, by, bx + bw * 20 / 25, by + 76), fill=TEAL)
    d.rectangle((bx + bw * 20 / 25, by, bx + bw, by + 76), fill=YELLOW)
    edu.paste_mid(parts, label("基本給 20万円", 36, 900, (255, 255, 255)), bx + bw * 10 / 25, by + 38)
    edu.paste_mid(parts, label("5万円", 34, 900, INK), bx + bw * 22.5 / 25, by + 38)
    ov = [edu.telop(tm, sid, "s5"), at(W / 2, 650, total, 0.2), at(W / 2, 770, edu.down_arrow(48), 0.45),
          at(W / 2, 935, parts, 0.6)]
    scenes.append(edu.scene(tm, sid, ov, head=[(0, "p3_desk", (0, 0.355, 1, 0.57))]))
    return scenes


def sfx_events(tm):
    m = tm.marks
    return [(m["s2_base"], "tick", 0.16), (m["s2_fixed"], "tick", 0.16), (m["s2_total"], "pop", 0.14),
            (m["s3_hours"], "tick", 0.16), (m["s3_over"], "tick", 0.16), (m["s4_now"], "pop", 0.13),
            (m["s4_same"], "pop", 0.13)]


if __name__ == "__main__":
    tm = mc.Timing(NAME)
    prev = [float(x) for x in sys.argv[1:]] or [0.5, 3.5, 6.5, 8.0, 10.0, 13.2, 15.5, 17.8, 21.0, 23.5]
    print("done", edu.render(tm, build(tm), prev, sfx_events(tm)), tm.total)
