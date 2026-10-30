"""NEXT02 年収例500万円。その数字、あなたの1年目？ → NEXT02_annual_income.mp4. CTA: なし（保存・フォロー・相談の誘導を入れない）."""
import sys

from PIL import ImageDraw

import nx  # noqa: I001  (puts the shared tools on sys.path)
import mc
from mc import GREY, INK, TEAL, W, YELLOW, label
from nx import at, paste_mid

NAME = "NEXT02_annual_income"
AI_NOTE = False
NOTE_XY = None
CONDS = [("勤続年数", "入社何年目？"), ("賞与", "いくら？"), ("歩合", "含まれる？"), ("残業代", "含まれる？")]


def cond_card(title, sub, w=420, h=150):
    img, pad = nx.card(w, h, r=28)
    paste_mid(img, label(title, 50, 900, INK), pad + w / 2, pad + 56)
    paste_mid(img, label(sub, 34, 700, TEAL), pad + w / 2, pad + 112)
    return img


def first_year_card(w=410, h=330):
    img, pad = nx.card(w, h, edge=YELLOW)
    d = ImageDraw.Draw(img)
    d.rounded_rectangle((pad, pad, pad + w, pad + 78), 32, fill=TEAL)
    d.rectangle((pad, pad + 46, pad + w, pad + 78), fill=TEAL)
    paste_mid(img, label("あなたの初年度", 38, 900, (255, 255, 255)), pad + w / 2, pad + 40)
    paste_mid(img, label("？", 120, 900, INK), pad + w / 2, pad + 205)
    return img


def build(tm):
    scenes = []

    # s1: headline — whose 500万?
    sid = "s1"
    ov = nx.opening(tm, sid, "未経験転職｜年収例の見方")
    ov += [at(W / 2, 880, nx.edu.money_card("年収例", "500万円"), 0.3, anim="punch", dur_in=0.3)]
    scenes.append(nx.scene(tm, sid, ov, (0, "p4_desk")))

    # s2: from the big number down to the conditions under it
    sid = "s2"
    t_cond = tm.mark(sid, "s2_cond")
    times = [tm.mark(sid, "s2_years"), tm.mark(sid, "s2_bonus"), tm.mark(sid, "s2_extra"), tm.mark(sid, "s2_extra") + 0.3]
    ov = [nx.telop(tm, sid, "s2"),
          at(W / 2, 680, nx.edu.money_card("年収例", "500万円", w=820, h=300), 0.1),
          at(W / 2, 865, nx.edu.down_arrow(44, YELLOW), t_cond, anim="pop")]
    for k, ((title, sub), t) in enumerate(zip(CONDS, times)):
        ov.append(at(300 if k % 2 == 0 else 780, 1000 + (k // 2) * 170, cond_card(title, sub), t, anim="pop"))
    scenes.append(nx.scene(tm, sid, ov, (0, "c_budget_hands"), (times[0], "p6_office")))

    # s3: 年収例 is not your first year
    sid = "s3"
    t_mine = tm.mark(sid, "s3_mine")
    ov = [nx.telop(tm, sid, "s3"),
          at(290, 830, nx.money_box("年収例", "求人の例", "500万", w=380, head_color=(90, 98, 116)), 0.1, anim="pop"),
          at(W / 2, 830, label("≠", 96, 900, YELLOW), t_mine - 0.1, anim="punch"),
          at(790, 830, first_year_card(w=380), t_mine, anim="pop")]
    scenes.append(nx.scene(tm, sid, ov, (0, "c_budget")))

    # s4: how to ask in the interview
    sid = "s4"
    t_q = tm.mark(sid, "s4_q")
    q = nx.edu3.bubble(["「私の初年度の", "{年収見込み}と", "{内訳}は？」"], w=760, size=60,
                       head=mc.pill("面接で", 30, bg=(232, 236, 242), fg=GREY, weight=700, padx=18, pady=8))
    ov = [nx.telop(tm, sid, "s4"), at(W / 2, 900, q, t_q - 0.15, anim="pop")]
    scenes.append(nx.scene(tm, sid, ov, (0, "c_interview")))

    # s5: closing line (no CTA)
    sid = "s5"
    small, pad = nx.card(460, 110, fill=(255, 255, 255, 190))
    paste_mid(small, label("年収例", 46, 700, GREY), pad + 230, pad + 55)
    big, pad2 = nx.card(760, 170, edge=YELLOW)
    paste_mid(big, nx.text_img("{自分の初年度}を確認", 62), pad2 + 380, pad2 + 85)
    ov = [nx.telop(tm, sid, "s5"),
          at(W / 2, 720, small, 0.15),
          at(W / 2, 840, nx.edu.down_arrow(44), 0.45),
          at(W / 2, 990, big, 0.6, anim="pop")]
    scenes.append(nx.scene(tm, sid, ov, (0, "p4_meeting")))
    return scenes


def sfx_events(tm):
    m, S = tm.marks, {k: v["start"] for k, v in tm.scenes.items()}
    return [(0.3, "hit", 0.9),
            (m["s2_cond"], "swipe_long", 0.8), (m["s2_years"], "pop", 0.8), (m["s2_bonus"], "pop_hi", 0.8),
            (m["s2_extra"], "pop", 0.8), (m["s2_extra"] + 0.3, "pop_hi", 0.8),
            (S["s3"] + 0.1, "pop_lo", 0.7), (m["s3_mine"] - 0.1, "accent", 1.0),
            (m["s4_q"] - 0.15, "click", 0.9),
            (S["s5"] + 0.6, "ding", 0.8)]


if __name__ == "__main__":
    tm = mc.Timing(NAME)
    prev = [float(x) for x in sys.argv[1:]] or [0.2, 1.2, 3.0, 5.2, 8.6, 10.0, 11.8, 14.6, 16.5, 19.0]
    print("done", nx.render(tm, build(tm), prev, sfx_events(tm)), tm.total)
