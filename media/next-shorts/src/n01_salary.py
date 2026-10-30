"""NEXT01 手取り20万→月給25万。それ、5万アップ？ → NEXT01_salary.mp4 (timing in ../timing/NEXT01_salary.json). CTA: 保存."""
import sys

from PIL import Image, ImageDraw

import nx  # noqa: I001  (puts the shared tools on sys.path)
import mc
from engine import check_icon
from mc import GREY, INK, TEAL, W, YELLOW, label
from nx import RED, at, paste_mid

NAME = "NEXT01_salary"
AI_NOTE = False
NOTE_XY = None
LEFT_X, RIGHT_X, BOX_Y = 300, 780, 830


def chip(text, size=46, fg=INK):
    return mc.pill(text, size, bg=(255, 255, 255), fg=fg, weight=900, padx=26, pady=14)


def step_card(num, text, w=880, h=150, sub=None):
    img, pad = nx.card(w, h + (110 if sub is not None else 0))
    d = ImageDraw.Draw(img)
    d.ellipse((pad + 34, pad + 36, pad + 34 + 78, pad + 36 + 78), fill=TEAL)
    paste_mid(img, label(num, 46, 900, (255, 255, 255)), pad + 73, pad + 74)
    img.alpha_composite(nx.text_img(text, 54), (pad + 140, pad + 42))
    if sub is not None:
        img.alpha_composite(sub, (pad + (w - sub.width) // 2, pad + 150))
    return img


def build(tm):
    scenes = []

    # s1: headline — is it really +5万?
    sid = "s1"
    ov = nx.opening(tm, sid, "未経験転職｜給料の比べ方")
    ov += [at(W / 2, 720, mc.emph("{＋5万？}", 130), 0.3, anim="punch", dur_in=0.3),
           at(285, 900, chip("手取り20万"), 0.55, anim="pop"),
           at(W / 2, 900, mc.arrow(90, 54), 0.7, anim="left"),
           at(795, 900, chip("月給25万"), 0.8, anim="pop")]
    scenes.append(nx.scene(tm, sid, ov, (0, "p3_phone")))

    # s2: 今の手取り20万 vs 求人の月給25万 — not the same measure
    sid = "s2"
    t_l, t_r, t_not = tm.mark(sid, "s2_left"), tm.mark(sid, "s2_right"), tm.mark(sid, "s2_not")
    t_gap = tm.local(sid, tm.subs[2]["start"])        # 「その差5万円」
    ov = [nx.telop(tm, sid, "s2a"), nx.telop(tm, sid, "s2b"),
          at(W / 2, 600, nx.ex_tag(), 0.1, anim="fade"),
          at(LEFT_X, BOX_Y, nx.money_box("今", "手取り", "20万", w=410, head_color=(90, 98, 116)), t_l - 0.1, anim="pop"),
          at(RIGHT_X, BOX_Y, nx.money_box("求人", "月給", "25万", w=410), t_r - 0.1, anim="pop"),
          at(W / 2, 1075, chip("差 5万円 ？", 44), t_gap, anim="pop"),
          at(W / 2, BOX_Y - 10, nx.stamp("比較条件が違う", size=54), t_not, anim="punch", dur_in=0.25)]
    scenes.append(nx.scene(tm, sid, ov, (0, "c_budget"), (t_not, "c_budget_hands")))

    # s3: 月給 is before tax and social insurance; the take-home is unknown
    sid = "s3"
    t_tax, t_net = tm.mark(sid, "s3_tax"), tm.mark(sid, "s3_net")
    top, pad = nx.card(880, 170)
    paste_mid(top, nx.text_img("求人の月給 {25万}", 60), pad + 440, pad + 62)
    paste_mid(top, label("額面＝税金などが引かれる前", 34, 700, GREY), pad + 440, pad + 128)
    net, pad2 = nx.card(560, 130, edge=(170, 178, 192))
    paste_mid(net, nx.text_img("手取り　？", 58), pad2 + 280, pad2 + 65)
    minus = lambda t: mc.pill(t, 40, bg=(250, 226, 226), fg=RED, weight=900, padx=24, pady=12)
    ov = [nx.telop(tm, sid, "s3"),
          at(W / 2, 640, top, 0.1),
          at(380, 820, minus("－税金"), t_tax, anim="pop"),
          at(700, 820, minus("－社会保険料"), t_tax + 0.35, anim="pop"),
          at(W / 2, 925, nx.edu.down_arrow(46), t_net - 0.1),
          at(W / 2, 1030, net, t_net, anim="pop"),
          at(W / 2, 1170, label("今の20万は、引かれた後の手取り", 36, 900, (255, 255, 255)), t_net + 0.6, anim="fade")]
    scenes.append(nx.scene(tm, sid, ov, (0, "p6_office")))

    # s4: compare 額面 with 額面, then check the take-home
    sid = "s4"
    t_same, t_net = tm.mark(sid, "s4_same"), tm.mark(sid, "s4_net")
    pair = Image.new("RGBA", (800, 90), (0, 0, 0, 0))
    a = mc.pill("今の額面", 40, bg=(232, 247, 244), fg=TEAL, weight=900, padx=26, pady=12)
    b = mc.pill("求人の月給", 40, bg=(232, 247, 244), fg=TEAL, weight=900, padx=26, pady=12)
    pair.alpha_composite(a, (40, (90 - a.height) // 2))
    paste_mid(pair, label("⇔", 56, 900, INK), 400, 45)
    pair.alpha_composite(b, (800 - 40 - b.width, (90 - b.height) // 2))
    ov = [nx.telop(tm, sid, "s4"),
          at(W / 2, 700, step_card("1", "{額面}同士で比べる", sub=pair), 0.1),
          at(W / 2 + 360, 640, check_icon(84, color=TEAL), t_same + 0.2, anim="pop"),
          at(W / 2, 990, step_card("2", "その後、{手取り}を確認"), t_net, anim="pop")]
    scenes.append(nx.scene(tm, sid, ov, (0, "p1_pc")))

    # s5: CTA 保存
    sid = "s5"
    ov = [nx.telop(tm, sid, "s5"), at(W / 2, 880, nx.cta_save(300), 0.15, anim="punch", dur_in=0.3)]
    scenes.append(nx.scene(tm, sid, ov, (0, "p5_home")))
    return scenes


def sfx_events(tm):
    m, S = tm.marks, {k: v["start"] for k, v in tm.scenes.items()}
    return [(0.3, "hit", 0.9), (0.55, "pop", 0.7), (0.8, "pop_hi", 0.7),
            (m["s2_left"] - 0.1, "pop", 0.8), (m["s2_right"] - 0.1, "pop_hi", 0.8), (tm.subs[2]["start"], "click", 0.9),
            (m["s2_not"], "accent", 1.0),
            (m["s3_tax"], "pop_lo", 0.8), (m["s3_tax"] + 0.35, "pop_lo", 0.8), (m["s3_net"], "wrong", 0.7),
            (m["s4_same"] + 0.2, "ding", 0.8), (m["s4_net"], "pop", 0.8),
            (S["s5"] + 0.15, "cta", 1.0)]


if __name__ == "__main__":
    tm = mc.Timing(NAME)
    prev = [float(x) for x in sys.argv[1:]] or [0.2, 1.2, 4.0, 6.5, 8.0, 10.2, 12.5, 14.5, 17.0, 19.0]
    print("done", nx.render(tm, build(tm), prev, sfx_events(tm)), tm.total)
