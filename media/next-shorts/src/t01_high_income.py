"""TEST01 未経験から高収入？（テスト版） → TEST01_high_income.mp4 (timing in ../timing/TEST01_high_income.json).

Text-led: no narration yet, so the screen carries every line (no full subtitles) over BGM and effects. The angle
is how to read a 「未経験OK・月収50万円も可能」 ad, not a promise of income (docs/HQ_DECISIONS.md line 37).
"""
import sys

from PIL import ImageDraw

import nx  # noqa: I001  (puts the shared tools on sys.path)
import mc
from mc import GREY, INK, TEAL, W, YELLOW, label
from nx import RED, at, paste_mid

NAME = "TEST01_high_income"
AI_NOTE = False
NOTE_XY = None
ORANGE = (240, 160, 60)
BAR_X0, BAR_W, BAR_CY = 100, 880, 720
PARTS = [(40, TEAL, "基本給"), (25, ORANGE, "固定残業代"), (35, YELLOW, "インセンティブ")]
NOTES = [["毎月", "{決まって入る}"], ["残業◯時間分を", "{あらかじめ含む}"], ["成果しだいで", "{変わる}"]]
SMALL_PRINT = "※インセンティブ・固定残業代を含む"


def ad_card(w=880, h=500):
    """Schematic recruiting ad: 未経験OK ribbon, 月収50万円も可能！ and the small print at the bottom."""
    img, pad = nx.card(w, h)
    d = ImageDraw.Draw(img)
    d.rounded_rectangle((pad, pad, pad + w, pad + 96), 32, fill=RED)
    d.rectangle((pad, pad + 60, pad + w, pad + 96), fill=RED)
    paste_mid(img, label("未経験OK！", 54, 900, (255, 255, 255)), pad + w / 2, pad + 50)
    parts = [label("月収", 56, 900, GREY), label("50万円", 150, 900, RED), label("も可能！", 56, 900, INK)]
    x = pad + (w - sum(p.width for p in parts) - 2 * 14) / 2
    base = pad + 330                      # common baseline-ish bottom for the three pieces
    for p, dy in zip(parts, (-22, 0, -22)):
        img.alpha_composite(p, (int(x), int(base - p.height + dy)))
        x += p.width + 14
    sp = label(SMALL_PRINT, 24, 500, GREY)
    sx, sy = pad + w - 40 - sp.width, pad + h - 40 - sp.height
    img.alpha_composite(sp, (sx, sy))
    img.info["small_box"] = (sx - 10, sy - 6, sx + sp.width + 10, sy + sp.height + 6)
    return img


def note_card(lines, color, w=270, h=180):
    img, pad = nx.card(w, h, r=26, edge=color)
    paste_mid(img, nx.edu3.multiline(lines, 32, align="center", gap=1.4), pad + w / 2, pad + h / 2)
    return img


def build(tm):
    scenes = []
    m = lambda sid, k: tm.mark(sid, k)

    # s1: the hook — 未経験から月収50万!? … but did you read the breakdown?
    sid = "s1"
    ov = [nx.Flash(0.0), nx.topic("未経験転職｜高収入求人の見方"),
          at(W / 2, 560, mc.emph("未経験から", 96), 0.0, anim="punch", dur_in=0.25),
          at(W / 2, 760, mc.emph("月収{50万!?}", 150), m(sid, "s1_big"), anim="punch", dur_in=0.25),
          at(W / 2, 1080, mc.emph("その求人、\n{内訳}まで見た？", 78), m(sid, "s1_q"), anim="pop")]
    scenes.append(nx.scene(tm, sid, ov, (0, "p3_phone")))

    # s2: the ad, its small print, and what 「可能」 means
    sid = "s2"
    card = ad_card()
    cy = 800
    x0, y0, x1, y1 = card.info["small_box"]
    sx, sy = W / 2 - card.width / 2 + (x0 + x1) / 2, cy - card.height / 2 + (y0 + y1) / 2
    zoom, pad = nx.card(900, 120, edge=YELLOW)
    paste_mid(zoom, label(SMALL_PRINT, 44, 900, INK), pad + 450, pad + 60)
    ov = [at(W / 2, 470, nx.edu.dark_tag("求人広告の例"), 0.1, anim="fade"),
          at(W / 2, cy, card, m(sid, "s2_card"), anim="punch", dur_in=0.3),
          mc.Highlight(nx.edu3.ring(x1 - x0 + 12, y1 - y0 + 12, r=14), sx, sy, m(sid, "s2_small")),
          at(W / 2, 1180, zoom, m(sid, "s2_zoom"), anim="pop"),
          at(W / 2, cy - 30, nx.stamp("“可能”＝保証じゃない", size=60, angle=-5), m(sid, "s2_not"), anim="punch",
             dur_in=0.25),
          nx.Flash(m(sid, "s2_not"), 0.18, 0.45)]
    scenes.append(nx.scene(tm, sid, ov, (0, "c_calendar_phone"), (m(sid, "s2_not"), "p5_home")))

    # s3: what 月収50万円 is made of
    sid = "s3"
    t_parts = [m(sid, "s3_base"), m(sid, "s3_fixed"), m(sid, "s3_inc")]
    t_notes = [m(sid, "s3_n1"), m(sid, "s3_n2"), m(sid, "s3_n3")]
    bar = nx.edu.GrowBar(BAR_X0, BAR_CY, BAR_W, 130, [(v, c, name, t) for (v, c, name), t in zip(PARTS, t_parts)], 100)
    ov = [nx.telop(tm, sid, "s3"), at(W / 2, 600, nx.ex_tag("割合はイメージ"), 0.1, anim="fade"), bar]
    centres = (190, 520, 850)             # evenly spaced, clear of the app buttons at the right edge
    for (v, c, _), lines, t, cx in zip(PARTS, NOTES, t_notes, centres):
        ov.append(at(cx, 920, note_card(lines, c), t, anim="pop"))
    ov += [mc.Highlight(nx.edu3.ring(286, 196, r=30, width=8), centres[0], 920, m(sid, "s3_hl")),
           at(W / 2, 1140, mc.emph("毎月の土台は{基本給}", 64), m(sid, "s3_hl") + 0.15, anim="pop")]
    scenes.append(nx.scene(tm, sid, ov, (0, "p6_office")))

    # s4: three things to check on a 高収入 listing
    sid = "s4"
    rows = ["{基本給}はいくら？", "{固定残業}は何時間分？", "{歩合}の条件は？"]
    checks = [m(sid, "s4_c1"), m(sid, "s4_c2"), m(sid, "s4_c3")]
    ov = [nx.telop(tm, sid, "s4")]
    for k, (text, y) in enumerate(zip(rows, (650, 810, 970))):
        ov.append(at(W / 2, y, nx.edu.check_row(text, w=880, h=130, size=52), 0.1 + 0.1 * k))
        ov.append(at(W / 2, y, nx.edu.check_row(text, checked=True, w=880, h=130, size=52), checks[k], anim="fade",
                     dur_in=0.2))
    scenes.append(nx.scene(tm, sid, ov, (0, "p4_desk")))

    # s5: closing line
    sid = "s5"
    ov = [nx.Flash(m(sid, "s5_big"), 0.2, 0.5),
          at(W / 2, 860, mc.emph("“高収入”は\n{数字の中身}で判断", 96), m(sid, "s5_big"), anim="punch", dur_in=0.3)]
    scenes.append(nx.scene(tm, sid, ov, (0, "p5_street")))
    return scenes


def sfx_events(tm):
    m = tm.marks
    return [(m["s1_big"], "hit", 1.0), (m["s1_q"], "accent", 0.9),
            (m["s2_card"], "pop", 0.9), (m["s2_small"], "click", 1.0), (m["s2_zoom"], "swipe", 0.9),
            (m["s2_not"], "accent", 1.0),
            (m["s3_base"], "pop", 0.8), (m["s3_fixed"], "pop_hi", 0.8), (m["s3_inc"], "pop", 0.8),
            (m["s3_n1"], "click", 0.9), (m["s3_n2"], "click", 0.9), (m["s3_n3"], "click", 0.9), (m["s3_hl"], "ding", 0.9),
            (m["s4_c1"], "pop_hi", 0.85), (m["s4_c2"], "pop_hi", 0.85), (m["s4_c3"], "ding", 0.9),
            (m["s5_big"], "hit", 1.0), (m["s5_big"] + 0.35, "ding_hi", 0.8)]


if __name__ == "__main__":
    tm = mc.Timing(NAME)
    prev = [float(x) for x in sys.argv[1:]] or [0.1, 0.6, 2.2, 3.8, 5.6, 7.2, 9.5, 11.5, 13.3, 15.0, 17.5, 20.0]
    print("done", nx.render(tm, build(tm), prev, sfx_events(tm)), tm.total)
