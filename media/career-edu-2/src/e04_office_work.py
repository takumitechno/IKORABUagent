"""④ 接客から事務へ、仕事内容を比較 → career_edu_2_04_office_work.mp4 (timing in ../timing/career_edu_2_04_office_work.json)."""
import sys

from PIL import Image, ImageDraw

import edu
import mc
from edu import at
from mc import BLUE, TEAL, W, YELLOW, label

NAME = "career_edu_2_04_office_work"
AI_NOTE = False
TABLE_Y = 800
COLS = [("一般事務", ["書類の管理", "データの管理"], TEAL, 300), ("営業事務", ["見積もり", "注文の処理"], BLUE, 780)]


def table_columns():
    return [(edu.column(h, cells, w=400, header_color=c, row_h=112, header_h=96, cell_size=44), x)
            for h, cells, c, x in COLS]


def table_image():
    """Both columns on one transparent canvas (for the shrunken recap)."""
    cols = table_columns()
    h = max(c.height for c, _ in cols)
    out = Image.new("RGBA", (960, h), (0, 0, 0, 0))
    for c, x in cols:
        out.alpha_composite(c, (int(x - 60 - c.width / 2), 0))
    return out


def build(tm):
    scenes = []

    # s1: from customer service to office work — "just data entry?"
    sid = "s1"
    ov = [tm.telop(sid, "hook", size=88),
          at(330, 700, edu.store_icon(190), 0.0, anim="fade"), at(330, 830, label("接客", 46, 900, (255, 255, 255)), 0.0, anim="fade"),
          at(W / 2, 720, mc.arrow(120, 56), 0.15, anim="left"),
          at(750, 700, edu.desk_icon(190), 0.25, anim="fade"), at(750, 830, label("事務", 46, 900, (255, 255, 255)), 0.25, anim="fade"),
          at(W / 2, 1040, edu.q_card("事務＝{入力だけ}の仕事？", 820, 132, 50), 0.45)]
    scenes.append(edu.scene(tm, sid, ov))

    # s2: examples of what each office role does
    sid = "s2"
    (left, lx), (right, rx) = table_columns()
    ov = [tm.telop(sid, "s2", size=80), at(W / 2, 575, edu.dark_tag("仕事内容の一例"), 0.1),
          at(lx, TABLE_Y, left, 0.15), at(rx, TABLE_Y, right, tm.mark(sid, "s2_sales"))]
    scenes.append(edu.scene(tm, sid, ov))

    # s3: phone work and scope differ by company — one note across both columns (not two separate worlds)
    sid = "s3"
    band, pad = mc.white_card(880, 170, r=28)
    ImageDraw.Draw(band).rounded_rectangle((pad, pad, pad + 16, pad + 170), 8, fill=YELLOW)
    band.alpha_composite(edu.phone_icon(72, TEAL), (pad + 40, pad + 49))
    band.alpha_composite(edu.text_img("電話対応・担当範囲は", 44), (pad + 136, pad + 24))
    band.alpha_composite(edu.text_img("{会社ごとに異なる}", 52), (pad + 136, pad + 86))
    col_top = TABLE_Y - left.height / 2 + 40
    ov = [tm.telop(sid, "s3", size=80), at(W / 2, 575, edu.dark_tag("仕事内容の一例"), -1.0),
          at(lx, TABLE_Y, left, -1.0), at(rx, TABLE_Y, right, -1.0),
          at(lx + 150, col_top + 48, edu.phone_icon(72, YELLOW), 0.15, anim="pop"),
          at(rx + 150, col_top + 48, edu.phone_icon(72, YELLOW), 0.3, anim="pop"),
          at(W / 2, TABLE_Y + left.height / 2 + 50, band, tm.mark(sid, "s3_note"))]
    scenes.append(edu.scene(tm, sid, ov))

    # s4: shrink the table and sort out what you want to reduce (wishes to check, not a quiz)
    sid = "s4"
    small = table_image()
    small = small.resize((int(small.width * 0.56), int(small.height * 0.56)), Image.LANCZOS)
    ov = [tm.telop(sid, "s4", size=80), at(W / 2, 610, small, 0.0, anim="fade"),
          at(W / 2, 800, edu.dark_tag("確認したい希望"), 0.2),
          at(W / 2, 930, edu.check_row("{立ち仕事}を減らしたい", w=820, h=118), tm.mark(sid, "s4_stand")),
          at(W / 2, 1090, edu.check_row("{人とのやり取り}を減らしたい", w=820, h=118), tm.mark(sid, "s4_people"))]
    scenes.append(edu.scene(tm, sid, ov))

    # s5: decide what to change first, then compare the actual duties
    sid = "s5"
    ov = [tm.telop(sid, "s5", size=80),
          at(W / 2, 660, mc.flow_card("変えたい働き方", 820, 140, edu.check_box(70, True), 54), 0.2),
          at(W / 2, 800, edu.down_arrow(50), tm.mark(sid, "s5_check") - 0.15),
          at(W / 2, 950, mc.flow_card("実際の仕事内容を確認", 820, 140, mc.search_icon(70, TEAL), 54, accent=YELLOW),
             tm.mark(sid, "s5_check"))]
    scenes.append(edu.scene(tm, sid, ov))
    return scenes


def sfx_events(tm):
    m, S = tm.marks, {k: v["start"] for k, v in tm.scenes.items()}
    return [(S["s2"] + 0.15, "pop", 0.13), (m["s2_sales"], "pop", 0.13), (S["s3"] + 0.15, "tick", 0.14),
            (m["s3_note"], "pop", 0.13), (m["s4_stand"], "tick", 0.15), (m["s4_people"], "tick", 0.15),
            (m["s5_check"], "pop", 0.14)]


if __name__ == "__main__":
    tm = mc.Timing(NAME)
    prev = [float(x) for x in sys.argv[1:]] or [0.5, 2.5, 5.0, 7.5, 9.8, 11.5, 13.5, 15.0, 17.6, 20.3]
    print("done", edu.render(tm, build(tm), prev, sfx_events(tm)), tm.total)
