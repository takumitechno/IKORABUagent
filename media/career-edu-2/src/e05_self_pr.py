"""⑤ 転職の自己PR、接客経験の書き方 → career_edu_2_05_self_pr.mp4 (timing in ../timing/career_edu_2_05_self_pr.json)."""
import sys

from PIL import ImageDraw

import edu
import mc
from edu import at
from mc import GREY, INK, TEAL, W, YELLOW, label

NAME = "career_edu_2_05_self_pr"
AI_NOTE = False
ACTIONS = [("予算を聞いた", "s3_budget"), ("商品の違いを説明した", "s3_explain"), ("提案した", "s3_propose")]


def empty_form():
    """Schematic application form on a laptop with an empty 自己PR box (no real form, no personal data)."""
    img, (x0, y0, x1, y1) = mc.laptop(900, 560)
    d = ImageDraw.Draw(img)
    img.alpha_composite(mc.pill("応募書類のイメージ", 24, bg=(226, 230, 238), fg=GREY, weight=700, padx=18, pady=8),
                       (x0 + 30, y0 + 22))
    d.text((x0 + 40, y0 + 96), "自己PR", font=mc.font(42, 900), fill=INK)
    d.rounded_rectangle((x0 + 40, y0 + 160, x1 - 40, y1 - 40), 14, outline=TEAL, width=4, fill=(255, 255, 255))
    return img, (x0 + 70, y0 + 186, 54)


def action_row(n, text, w=820, h=112):
    img, pad = mc.white_card(w, h, r=26)
    d = ImageDraw.Draw(img)
    d.ellipse((pad + 34, pad + 28, pad + 90, pad + 84), fill=TEAL)
    edu.paste_mid(img, label(str(n), 36, 900, (255, 255, 255)), pad + 62, pad + 56)
    img.alpha_composite(label(text, 48, 900, INK), (pad + 116, pad + (h - 60) // 2))
    return img


def build(tm):
    scenes = []

    # s1: in front of an empty 自己PR box, the typing has stopped
    sid = "s1"
    form, (cx, cy, ch) = empty_form()
    fy = 820
    ox, oy = W / 2 - form.width / 2, fy - form.height / 2
    scenes.append(edu.scene(tm, sid, [tm.telop(sid, "hook", size=80), at(W / 2, fy, form, 0.0),
                                      mc.Blink(ox + cx, oy + cy, ch, 0.3)]))

    # s2: look back at what you did on ordinary days
    sid = "s2"
    page, ppad = mc.notebook(860, 520, title="いつもの仕事を振り返る", lines_from=232, gap=100)
    pd = ImageDraw.Draw(page)
    pd.text((ppad + 150, ppad + 136), "工夫していたことは？", font=mc.font(44, 900), fill=TEAL)
    scenes.append(edu.scene(tm, sid, [tm.telop(sid, "s2", size=80), at(W / 2, 830, page, 0.15)]))

    # s3: the same experience, split into what was actually done
    sid = "s3"
    before, pad = mc.white_card(820, 120, r=26, alpha=220)
    edu.paste_mid(before, label("「接客を担当しました」", 50, 900, GREY), pad + 410, pad + 60)
    ov = [tm.telop(sid, "s3", size=80), at(W / 2, 600, before, 0.1),
          at(W / 2, 712, edu.down_arrow(44), 0.6)]
    for k, ((text, key), y) in enumerate(zip(ACTIONS, (830, 960, 1090))):
        ov.append(at(W / 2, y, action_row(k + 1, text), tm.mark(sid, key)))
    scenes.append(edu.scene(tm, sid, ov))

    # s4: before → after (the after text in short lines; an example to rewrite with your own experience)
    sid = "s4"
    b, pad = mc.white_card(820, 104, r=24, alpha=210)
    b.alpha_composite(mc.pill("前", 28, bg=(150, 158, 172), padx=16, pady=8), (pad + 28, pad + 30))
    b.alpha_composite(label("接客を担当しました", 42, 700, GREY), (pad + 110, pad + 26))
    a, pad2 = mc.white_card(820, 330, r=30)
    ImageDraw.Draw(a).rounded_rectangle((pad2, pad2, pad2 + 16, pad2 + 330), 8, fill=YELLOW)
    a.alpha_composite(mc.pill("後", 28, bg=TEAL, padx=16, pady=8), (pad2 + 40, pad2 + 30))
    for k, ln in enumerate(("お客さまの{予算を聞き}、", "{商品の違いを説明して}", "{提案しました}")):
        a.alpha_composite(edu.text_img(ln, 50), (pad2 + 120, pad2 + 30 + k * 96))
    ov = [tm.telop(sid, "s4", size=80), at(W / 2, 590, b, 0.1), at(W / 2, 690, edu.down_arrow(44), 0.3),
          at(W / 2, 880, a, 0.45),
          at(W / 2, 1110, edu.tag("例文：自分が実際にしたことに置き換えて使う"), 0.8, anim="fade")]
    scenes.append(edu.scene(tm, sid, ov))

    # s5: not adding big achievements — making the usual work concrete
    sid = "s5"
    big, pad = mc.white_card(820, 110, r=26, alpha=190)
    edu.paste_mid(big, label("大きな実績を足す", 46, 700, GREY), pad + 410, pad + 55)
    ov = [at(W / 2, 600, big, 0.15), at(W / 2, 720, label("ではなく", 40, 700, (255, 255, 255)), 0.4, anim="fade"),
          at(W / 2, 860, mc.flow_card("実際の行動を具体化する", 820, 150, None, 58, accent=YELLOW), tm.mark(sid, "s5_daily") - 0.3)]
    scenes.append(edu.scene(tm, sid, ov))
    return scenes


def sfx_events(tm):
    m, S = tm.marks, {k: v["start"] for k, v in tm.scenes.items()}
    return [(S["s2"] + 0.15, "paper", 0.22), (m["s3_budget"], "tick", 0.16), (m["s3_explain"], "tick", 0.16),
            (m["s3_propose"], "tick", 0.16), (S["s4"] + 0.45, "pop", 0.13), (m["s5_daily"] - 0.3, "pop", 0.14)]


if __name__ == "__main__":
    tm = mc.Timing(NAME)
    prev = [float(x) for x in sys.argv[1:]] or [0.5, 2.5, 4.5, 7.3, 9.3, 10.8, 11.8, 13.5, 14.9, 16.5, 18.5, 20.5]
    print("done", edu.render(tm, build(tm), prev, sfx_events(tm)), tm.total)
