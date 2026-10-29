"""② 自分の強みが分からない → 02_jibun_no_tsuyomi.mp4 (timing in ../timing/02_jibun_no_tsuyomi.json)."""
import sys

from PIL import ImageDraw

import mc
from mc import GREY, INK, TEAL, W, Telop

SUGGEST = "makecareer/img/v2r_shop_suggesting_items.jpg"
TEACH = "makecareer/img/v2r_shop_teaching_newcomer.jpg"
SUGGEST_MASKS = [(0.70, 0.70, 1.0, 0.80)]                          # paper tags on the table
TEACH_MASKS = [(0.33, 0.57, 0.70, 0.68, 5), (0.13, 0.83, 0.22, 0.89)]  # clipboard handwriting (soft), box label


def pr_form():
    """Schematic application form on a laptop: 自己PR holds only 「接客していました」 (no real form, no personal data)."""
    img, (x0, y0, x1, y1) = mc.laptop(900, 580)
    d = ImageDraw.Draw(img)
    tag = mc.pill("応募書類のイメージ", 24, bg=(226, 230, 238), fg=GREY, weight=700, padx=18, pady=8)
    img.alpha_composite(tag, (x0 + 30, y0 + 22))
    fx0, fx1 = x0 + 40, x1 - 40
    lf = mc.font(30, 700)
    d.text((fx0, y0 + 84), "志望動機", font=lf, fill=GREY)
    d.rounded_rectangle((fx0, y0 + 128, fx1, y0 + 218), 12, outline=(205, 210, 220), width=3, fill=(255, 255, 255))
    for k, ln in enumerate((560, 420)):
        d.rounded_rectangle((fx0 + 24, y0 + 150 + k * 36, fx0 + 24 + ln, y0 + 166 + k * 36), 8, fill=(214, 218, 226))
    d.text((fx0, y0 + 244), "自己PR", font=mc.font(38, 900), fill=INK)
    d.rounded_rectangle((fx0, y0 + 296, fx1, y0 + 500), 14, outline=TEAL, width=4, fill=(255, 255, 255))
    tf = mc.font(44, 700)
    text = "接客していました"
    d.text((fx0 + 28, y0 + 318), text, font=tf, fill=INK)
    caret = (fx0 + 28 + tf.getlength(text) + 8, y0 + 324, 52)
    return img, caret


def build(tm):
    suggest = mc.Window(SUGGEST, (0.10, 0.24, 1.0, 0.64), look="warm", masks=SUGGEST_MASKS)
    teach = mc.Window(TEACH, (0.03, 0.28, 0.97, 0.70), look="warm", masks=TEACH_MASKS)
    shop_bg = mc.Window(SUGGEST, (0, 0, 1, 1), look="warm", masks=SUGGEST_MASKS, bg_blur=40, bg_dark=0.55)
    shop_soft = mc.Window(TEACH, (0, 0, 1, 1), look="warm", masks=TEACH_MASKS, bg_blur=34, bg_dark=0.42)
    scenes = []

    # s1: the 自己PR box holds one line and the caret just blinks
    sid, d = "s1", tm.dur("s1")
    form, (cx, cy, ch) = pr_form()
    fcy = 880
    ox, oy = W / 2 - form.width / 2, fcy - form.height / 2
    scenes.append(tm.scene(sid, shop_bg.backdrop(d), [
        tm.telop(sid, "hook", size=80),
        Telop(form, W / 2, fcy, 0.0, 99, anim="up", dur_in=0.35),
        mc.Blink(ox + cx, oy + cy, ch, 0.4),
    ], trans="cut"))

    # s2: two examples of what she did at work
    sid, d = "s2", tm.dur("s2")
    t_teach = tm.mark(sid, "s2_teach")
    tag = mc.pill("経験の例", 30, bg=(10, 14, 28, 170), weight=700, padx=22, pady=10)
    scenes.append(tm.scene(sid, mc.shots([(0.0, suggest.shot(t_teach + 0.4, 1.0, 1.05, (0.5, 0.45))),
                                         (t_teach, teach.shot(d - t_teach, 1.0, 1.05, (0.5, 0.5), seed=1.5))]), [
        tm.telop(sid, "s2a", size=78), tm.telop(sid, "s2b", size=78),
        Telop(tag, mc.WIN[0] + 30 + tag.width / 2, mc.WIN[1] + 30 + tag.height / 2, 0.3, 99, anim="up"),
    ]))

    # s3: the single word 「接客」 opens into what she actually did
    sid, d = "s3", tm.dur("s3")
    root = mc.pill("接客", 64, bg=(255, 255, 255), fg=INK, padx=56, pady=20)
    down = mc.arrow(120, 56).rotate(-90, expand=True)
    cards = []
    for text in ("希望を聞き、商品を提案", "新人に仕事の手順を説明"):
        img, pad = mc.white_card(820, 150, r=30)
        line = mc.bullet_line(text, 52)
        img.alpha_composite(line, (pad + 48, pad + (150 - line.height) // 2))
        cards.append(img)
    ov = [tm.telop(sid, "s3", size=78),
          Telop(root, W / 2, 600, tm.mark(sid, "s3_root"), 99, anim="pop", dur_in=0.35),
          Telop(down, W / 2, 712, tm.mark(sid, "s3_card1") - 0.1, 99, anim="up"),
          Telop(cards[0], W / 2, 860, tm.mark(sid, "s3_card1"), 99, anim="up", dur_in=0.35),
          Telop(cards[1], W / 2, 1050, tm.mark(sid, "s3_card2"), 99, anim="up", dur_in=0.35)]
    scenes.append(tm.scene(sid, shop_soft.backdrop(d), ov))

    # s4: what you did → what to tell the employer (left open: worked out together, not auto-filled)
    sid, d = "s4", tm.dur("s4")
    top, pad = mc.white_card(860, 250, r=30)
    top.alpha_composite(mc.pill("実際にしたこと", 34), (pad + 40, pad + 30))
    for k, text in enumerate(("希望を聞き、商品を提案", "新人に仕事の手順を説明")):
        top.alpha_composite(mc.bullet_line(text, 42), (pad + 48, pad + 104 + k * 64))
    bottom, pad = mc.white_card(860, 250, r=30)
    bottom.alpha_composite(mc.pill("応募先に伝えること", 34, bg=mc.BLUE), (pad + 40, pad + 30))
    bd = ImageDraw.Draw(bottom)
    for k in range(2):
        y = pad + 130 + k * 64
        for x in range(pad + 48, pad + 812, 34):
            bd.line([(x, y), (x + 18, y)], fill=(190, 196, 208), width=4)
    ov = [tm.telop(sid, "s4", size=78),
          Telop(top, W / 2, 640, tm.mark(sid, "s4_top"), 99, anim="up", dur_in=0.35),
          Telop(mc.arrow(120, 56).rotate(-90, expand=True), W / 2, 810, tm.mark(sid, "s4_bottom"), 99, anim="up"),
          Telop(bottom, W / 2, 985, tm.mark(sid, "s4_bottom") + 0.15, 99, anim="up", dur_in=0.35)]
    scenes.append(tm.scene(sid, shop_soft.backdrop(d), ov))

    # s5: closing screen
    scenes.append(mc.cta_scene(tm, "s5", "{自分の経験}、\nどう伝える？", badge="無料面談で相談",
                               chips=("実際にしたこと", "応募先に伝えること")))
    return scenes


def sfx_events(tm):
    m = tm.marks
    return [(m["s3_root"], "pop", 0.3), (m["s3_card1"], "pop", 0.24), (m["s3_card2"], "pop", 0.24),
            (m["s4_top"], "paper", 0.4), (m["s4_bottom"] + 0.15, "pop", 0.24)]


if __name__ == "__main__":
    tm = mc.Timing("02_jibun_no_tsuyomi")
    S = {k: v["start"] for k, v in tm.scenes.items()}
    prev = [float(x) for x in sys.argv[1:]] or [0.8, 3.0, 6.0, 9.0, 11.5, 14.0, 16.0, 19.0, 22.0, 26.5]
    out = mc.render(tm, build(tm), prev, sfx_events(tm), lift_at=S["s4"])
    print("done", out, tm.total)
