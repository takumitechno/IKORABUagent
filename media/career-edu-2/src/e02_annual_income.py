"""② 求人の年収例と、入社時の条件 → career_edu_2_02_annual_income.mp4 (timing in ../timing/career_edu_2_02_annual_income.json)."""
import sys

from PIL import Image, ImageDraw

import edu
import mc
from edu import ORANGE, at
from mc import GREY, INK, TEAL, W, YELLOW, label

NAME = "career_edu_2_02_annual_income"
AI_NOTE = edu.AI_NOTE
NOTE_XY = edu.NOTE_XY
CARD_Y = 760
COL_W, HEAD_H, ROW_H = 400, 92, 112


def cells_column(header, cells, header_color):
    img, pad = mc.white_card(COL_W, HEAD_H + ROW_H * len(cells), r=26)
    d = ImageDraw.Draw(img)
    d.rounded_rectangle((pad, pad, pad + COL_W, pad + HEAD_H), 26, fill=header_color)
    d.rectangle((pad, pad + HEAD_H - 26, pad + COL_W, pad + HEAD_H), fill=header_color)
    edu.paste_mid(img, label(header, 38, 900, (255, 255, 255)), pad + COL_W / 2, pad + HEAD_H / 2)
    for k, cell in enumerate(cells):
        y = pad + HEAD_H + k * ROW_H
        if k:
            d.line([(pad + 20, y), (pad + COL_W - 20, y)], fill=edu.LINE, width=3)
        if not cell:
            edu.paste_mid(img, label("—", 36, 700, (200, 205, 214)), pad + COL_W / 2, y + ROW_H / 2)
            continue
        parts = [label(t, 38, 900, c) for t, c in cell]
        x = pad + (COL_W - sum(p.width for p in parts)) / 2
        for p in parts:
            img.alpha_composite(p, (int(x), int(y + (ROW_H - p.height) / 2)))
            x += p.width
    return img


def bubble(lines, w=880, h=300):
    """Speech bubble holding the question to ask (lines appear one by one)."""
    img, pad = mc.white_card(w, h, r=36)
    d = ImageDraw.Draw(img)
    d.polygon([(pad + 120, pad + h - 2), (pad + 200, pad + h - 2), (pad + 110, pad + h + 46)], fill=(255, 255, 255, 246))
    return img, pad


def build(tm):
    scenes = []
    card = edu.money_card("年収例", "400万円", note="入社3年目")
    nx, ny = card.info["note_xy"]
    note_x, note_y = W / 2 - card.width / 2 + nx, CARD_Y - card.height / 2 + ny

    # s1: the listing's annual-income example, with a small 「入社3年目」
    sid = "s1"
    scenes.append(edu.scene(tm, sid, [edu.telop(tm, sid, "hook"), at(W / 2, CARD_Y, card, 0.0)], head=[(0, "p4_desk", (0, 0.315, 1, 0.53))]))

    # s2: zoom in on the small note — it is one senior employee's example
    sid = "s2"
    ring = Image.new("RGBA", (190, 62), (0, 0, 0, 0))
    ImageDraw.Draw(ring).rounded_rectangle((2, 2, 187, 59), 16, outline=YELLOW, width=6)
    big = mc.pill("入社3年目", 66, bg=YELLOW, fg=INK, padx=44, pady=18)
    link = Image.new("RGBA", (8, 110), YELLOW + (255,))
    ov = [edu.telop(tm, sid, "s2"), at(W / 2, CARD_Y, card, -1.0),
          mc.Highlight(ring, note_x, note_y, tm.mark(sid, "s2_note")),
          at(note_x, note_y + 86, link, tm.mark(sid, "s2_note") + 0.1, anim="fade"),
          at(note_x - 60, 1080, big, tm.mark(sid, "s2_note") + 0.15, anim="pop"),
          at(note_x - 60, 1195, label("＝ 先輩社員の一例", 48, 900, (255, 255, 255)), tm.mark(sid, "s2_senpai"))]
    scenes.append(edu.scene(tm, sid, ov, head=[(0, "p4_explain", (0, 0.235, 1, 0.45))]))

    # s3: a senior's example vs. your own start (amounts only from the script; the rest is 要確認)
    sid = "s3"
    senpai = cells_column("先輩社員の一例", [[("入社3年目", INK)], [("年収例 ", GREY), ("400万円", INK)], None], (90, 100, 118))
    me = cells_column("自分のスタート", [[("入社1年目", INK)], [("月給：", INK), ("要確認", ORANGE)],
                                     [("賞与の条件：", INK), ("要確認", ORANGE)]], TEAL)
    ty = 820
    row = lambda k: ty - me.height / 2 + 40 + HEAD_H + ROW_H * (k + 0.5)   # noqa: E731
    ov = [edu.telop(tm, sid, "s3"), at(300, ty, senpai, 0.15),
          at(300, ty + senpai.height / 2 + 6, edu.tag(), 0.35, anim="fade"),
          at(780, ty, me, tm.mark(sid, "s3_me")),
          mc.Highlight(mc.accent_frame(COL_W - 24, ROW_H - 18, YELLOW, r=18, width=6), 780, row(1), tm.mark(sid, "s3_pay")),
          mc.Highlight(mc.accent_frame(COL_W - 24, ROW_H - 18, YELLOW, r=18, width=6), 780, row(2), tm.mark(sid, "s3_bonus"))]
    scenes.append(edu.scene(tm, sid, ov, head=[(0, "p4_desk", (0, 0.68, 1, 0.88)), (tm.mark(sid, "s3_pay"), "p6_office", (0, 0.03, 1, 0.23))]))

    # s4: the question to ask when checking conditions (two lines, timed with the voice)
    sid = "s4"
    bub, pad = bubble(2)
    by = 860
    top = by - bub.height / 2 + pad
    ov = [edu.telop(tm, sid, "s4"), at(W / 2, 600, edu.dark_tag("条件の確認で使える質問"), 0.1),
          at(W / 2, by, bub, 0.25),
          at(W / 2, top + 100, edu.text_img("「{入社1年目の月給}と、", 52), tm.mark(sid, "s4_line1"), anim="fade"),
          at(W / 2, top + 196, edu.text_img("{賞与の条件}を教えてください」", 52), tm.mark(sid, "s4_line2"), anim="fade")]
    scenes.append(edu.scene(tm, sid, ov, head=[(0, "p4_meeting", (0, 0.335, 1, 0.55))]))

    # s5: a future annual-income example ≠ your first year's income
    sid = "s5"
    def box(title, sub, accent):
        img, pad = mc.white_card(380, 250, r=30)
        d = ImageDraw.Draw(img)
        d.rounded_rectangle((pad, pad, pad + 380, pad + 16), 8, fill=accent)
        for k, ln in enumerate(title.split("\n")):
            edu.paste_mid(img, label(ln, 46, 900, INK), pad + 190, pad + 80 + k * 58)
        edu.paste_mid(img, label(sub, 28, 700, GREY), pad + 190, pad + 210)
        return img
    ov = [edu.telop(tm, sid, "s5"),
          at(300, 760, box("将来の\n年収例", "先輩社員の一例", (90, 100, 118)), 0.2),
          at(W / 2, 760, label("≠", 96, 900, YELLOW), tm.mark(sid, "s5_first") + 0.15, anim="pop"),
          at(780, 760, box("最初の1年の\n収入", "入社1年目の条件", TEAL), tm.mark(sid, "s5_first")),
          at(W / 2, 1010, mc.guide_band("分けて考える", w=620, h=110, size=50), tm.mark(sid, "s5_sep"))]
    scenes.append(edu.scene(tm, sid, ov, head=[(0, "p4_desk", (0, 0.02, 1, 0.22))]))
    return scenes


def sfx_events(tm):
    m = tm.marks
    return [(m["s2_note"] + 0.15, "pop", 0.15), (m["s3_me"], "pop", 0.13), (m["s3_pay"], "tick", 0.15),
            (m["s3_bonus"], "tick", 0.15), (m["s4_line1"], "tick", 0.14), (m["s4_line2"], "tick", 0.14),
            (m["s5_first"], "pop", 0.13), (m["s5_sep"], "pop", 0.14)]


if __name__ == "__main__":
    tm = mc.Timing(NAME)
    prev = [float(x) for x in sys.argv[1:]] or [0.5, 3.0, 4.9, 6.5, 8.3, 10.0, 12.3, 15.0, 17.2, 18.6, 21.3]
    print("done", edu.render(tm, build(tm), prev, sfx_events(tm)), tm.total)
