"""③ 未経験転職で聞く、研修の中身 → career_edu_2_03_training.mp4 (timing in ../timing/career_edu_2_03_training.json)."""
import sys

from PIL import Image, ImageDraw

import edu
import mc
from edu import at
from mc import GREY, INK, TEAL, W, YELLOW, label

NAME = "career_edu_2_03_training"
AI_NOTE = True
NOTE_XY = edu.NOTE_XY
CARD_Y = 728
ITEMS = ["最初の仕事", "教えてくれる人", "困ったときの質問先"]


def listing():
    """Schematic job card where only the 「研修あり」 label is readable."""
    w, h = 820, 300
    img, pad = mc.white_card(w, h, r=34)
    d = ImageDraw.Draw(img)
    img.alpha_composite(mc.pill("求人", 30), (pad + 40, pad + 34))
    for k, frac in enumerate((0.9, 0.7)):
        d.rounded_rectangle((pad + 44, pad + 110 + k * 40, pad + 44 + (w - 88) * frac, pad + 130 + k * 40), 10,
                            fill=(216, 220, 228))
    chip = Image.new("RGBA", (300, 88), (0, 0, 0, 0))
    cd = ImageDraw.Draw(chip)
    cd.rounded_rectangle((3, 3, 297, 85), 44, fill=(232, 247, 244), outline=TEAL, width=5)
    edu.paste_mid(chip, label("研修あり", 46, 900, TEAL), 150, 44)
    img.alpha_composite(chip, (pad + 40, pad + h - 40 - 88))
    img.info["chip_xy"] = (pad + 40 + 150, pad + h - 40 - 44)
    return img


def detail_panel(w=820, h=262):
    img, pad = mc.white_card(w, h, r=30)
    d = ImageDraw.Draw(img)
    img.alpha_composite(edu.text_img("{具体的には？}", 50), (pad + 44, pad + 34))
    for k in range(3):
        y = pad + 124 + k * 44
        for x in range(pad + 44, pad + w - 60, 30):
            d.line([(x, y), (x + 16, y)], fill=(190, 196, 208), width=4)
    return img


def question(w=880, h=330):
    img, pad = mc.white_card(w, h, r=36)
    d = ImageDraw.Draw(img)
    d.polygon([(pad + 120, pad + h - 2), (pad + 200, pad + h - 2), (pad + 110, pad + h + 46)], fill=(255, 255, 255, 246))
    return img, pad


def build(tm):
    scenes = []
    card = listing()
    cx, cy = card.info["chip_xy"]
    chip_x, chip_y = W / 2 - card.width / 2 + cx, CARD_Y - card.height / 2 + cy

    # s1: the listing says 「研修あり」
    sid = "s1"
    scenes.append(edu.scene(tm, sid, [edu.telop(tm, sid, "hook"), at(W / 2, CARD_Y, card, 0.0)], head=[(0, "p5_street", (0, 0.265, 1, 0.48))]))

    # s2: open the label — what does it actually involve?
    sid = "s2"
    ring = Image.new("RGBA", (320, 108), (0, 0, 0, 0))
    ImageDraw.Draw(ring).rounded_rectangle((3, 3, 317, 105), 52, outline=YELLOW, width=6)
    ov = [edu.telop(tm, sid, "s2"), at(W / 2, CARD_Y, card, -1.0),
          mc.Highlight(ring, chip_x, chip_y, 0.15),
          edu.Unroll(detail_panel(), W / 2, CARD_Y + card.height / 2 - 10, tm.mark(sid, "s2_open") - 0.2, 0.6)]
    scenes.append(edu.scene(tm, sid, ov, head=[(0, "p5_teach", (0, 0.305, 1, 0.52))]))

    # s3: the interview question (the key part highlighted)
    sid = "s3"
    q, pad = question()
    qy = 860
    top = qy - q.height / 2 + pad
    ov = [edu.telop(tm, sid, "s3"),
          at(W / 2, 606, edu.dark_tag("面接で聞く質問の例"), 0.1),
          at(W / 2, qy, q, 0.2),
          at(W / 2, top + 80, edu.text_img("「未経験で入った方は、", 50), 0.35, anim="fade"),
          at(W / 2, top + 170, edu.text_img("{最初どんな仕事から}", 56), tm.mark(sid, "s3_q2"), anim="fade"),
          at(W / 2, top + 252, edu.text_img("{始めていますか？}」", 56), tm.mark(sid, "s3_q2") + 0.35, anim="fade")]
    scenes.append(edu.scene(tm, sid, ov, head=[(0, "p5_home", (0, 0.315, 1, 0.53))]))

    # s4: three things to confirm — the list fills in as each is said
    sid = "s4"
    ys = [640, 800, 960]
    checks = [0.25, tm.mark(sid, "s4_who"), tm.mark(sid, "s4_ask")]
    ov = [edu.telop(tm, sid, "s4")]
    for k, (text, y) in enumerate(zip(ITEMS, ys)):
        ov.append(at(W / 2, y, edu.check_row(text), 0.1 + 0.1 * k))
        ov.append(at(W / 2, y, edu.check_row(text, checked=True), checks[k], anim="fade", dur_in=0.25))
    scenes.append(edu.scene(tm, sid, ov, head=[(0, "p5_teach", (0, 0.46, 1, 0.66)), (tm.mark(sid, "s4_ask"), "p5_serve", (0, 0.02, 1, 0.22))]))

    # s5: from "is there training?" to "can I learn the job here?"
    sid = "s5"
    small, pad = mc.white_card(560, 110, r=26, alpha=190)
    edu.paste_mid(small, label("研修の有無", 44, 700, GREY), pad + 280, pad + 55)
    big, pad2 = mc.white_card(880, 330, r=32)
    bd = ImageDraw.Draw(big)
    bd.rounded_rectangle((pad2, pad2, pad2 + 16, pad2 + 330), 8, fill=YELLOW)
    edu.paste_mid(big, label("仕事を覚える環境", 60, 900, INK), pad2 + 440, pad2 + 80)
    x = pad2 + 44
    for text in ITEMS:
        p = mc.pill(text, 32, bg=(232, 247, 244), fg=TEAL, weight=900, padx=14, pady=10)
        big.alpha_composite(p, (x, pad2 + 190))
        x += p.width + 14
    ov = [edu.telop(tm, sid, "s5"), at(W / 2, 632, small, 0.15),
          at(W / 2, 740, edu.down_arrow(50), tm.mark(sid, "s5_env") - 0.15),
          at(W / 2, 935, big, tm.mark(sid, "s5_env"))]
    scenes.append(edu.scene(tm, sid, ov, head=[(0, "p5_serve", (0, 0.305, 1, 0.52))]))
    return scenes


def sfx_events(tm):
    m, S = tm.marks, {k: v["start"] for k, v in tm.scenes.items()}
    return [(m["s2_open"] - 0.2, "paper", 0.25), (m["s3_q2"], "tick", 0.14), (S["s4"] + 0.25, "tick", 0.16),
            (m["s4_who"], "tick", 0.16), (m["s4_ask"], "tick", 0.16), (m["s5_env"], "pop", 0.14)]


if __name__ == "__main__":
    tm = mc.Timing(NAME)
    prev = [float(x) for x in sys.argv[1:]] or [0.5, 3.0, 4.2, 5.5, 7.5, 9.6, 11.0, 12.6, 14.5, 16.0, 18.5, 20.8]
    print("done", edu.render(tm, build(tm), prev, sfx_events(tm)), tm.total)
