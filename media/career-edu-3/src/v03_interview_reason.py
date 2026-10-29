"""③ 給料が安いから転職。面接で言うと落ちる？ → career_edu_3_03_interview_reason.mp4
(timing in ../timing/career_edu_3_03_interview_reason.json)."""
import sys

from PIL import Image, ImageDraw

import edu3
import mc
from edu3 import RED, TEAL, at, paste_mid
from mc import GREY, INK, W, YELLOW, label

NAME = "career_edu_3_03_interview_reason"
AI_NOTE = True
NOTE_XY = None
NG_X, OK_X, COL_W, COL_CY = 282, 798, 480, 800
NG_LINES = ["「前職は給料が", "低かったので", "辞めたいです」"]
OK_LINES = ["「{接客経験を}", "{活かしながら}、", "給与条件も", "改善したいです」"]


def column_bubble(lines, head, tone):
    return edu3.bubble(lines, w=COL_W, size=42, tone=tone, head=head, tail="left" if tone == "ng" else "right")


def build(tm):
    scenes = []

    # s1: warning badge — the honest reason, said as is
    sid = "s1"
    t_q = tm.mark(sid, "s1_q")
    ov = [mc.Telop(mc.emph(tm.tel["hook"]["text"], 80), W / 2, mc.TOP_CY, 0.0, tm.local(sid, tm.tel["hook"]["end"]),
                   anim="punch", dur_in=0.3, dur_out=0.25)]
    ov += edu3.badge_overlays("面接の落とし穴", 0.95, big_cy=840, small_cy=612)
    q = edu3.bubble(["「給料が安いから", "転職したい」"], w=760, size=60,
                    head=mc.pill("面接で", 30, bg=(232, 236, 242), fg=GREY, weight=700, padx=18, pady=8))
    ov += [at(W / 2, 1040, q, 0.95),
           at(W / 2 + 330, 900, edu3.edu.qmark(110), t_q, anim="pop")]
    scenes.append(edu3.scene(tm, sid, ov, (0, "c_interview")))

    # s2: wanting a better income is itself a reason to change jobs
    sid = "s2"
    t_ok = tm.mark(sid, "s2_ok")
    ov = [edu3.edu.telop(tm, sid, "s2"),
          at(W / 2, 700, edu3.flow_box("収入を{改善したい}", 820, 140, 58), 0.15),
          at(W / 2, 830, edu3.edu.down_arrow(46), t_ok - 0.2),
          at(W / 2, 960, edu3.edu.check_row("転職理由の{一つ}", checked=True, h=130, size=54), t_ok)]
    scenes.append(edu3.scene(tm, sid, ov, (0, "p4_desk")))

    # s3: NG (complaint only) vs a better way to say it
    sid = "s3"
    t_note, t_good = tm.mark(sid, "s3_ng_note"), tm.mark(sid, "s3_good")
    ng = column_bubble(NG_LINES, edu3.ng_chip("NG例"), "ng")
    ok = column_bubble(OK_LINES, edu3.chip("改善例", 34, bg=TEAL, fg=(255, 255, 255)), "ok")
    ng_y = COL_CY - (ok.height - ng.height) / 2        # tops line up
    ov = [edu3.edu.telop(tm, sid, "s3"),
          at(NG_X, ng_y, ng, 0.2),
          at(OK_X, COL_CY, unknown(ok.width - 80, ok.height - 80), 0.35, t_good),
          at(NG_X, 1100, note_box("不満の説明で{終わる}", RED), t_note, anim="pop"),
          at(OK_X, COL_CY, ok, t_good, anim="pop"),
          at(OK_X, 1100, note_box("経験＋{次の希望}", TEAL), t_good + 0.8, anim="pop")]
    scenes.append(edu3.scene(tm, sid, ov, (0, "c_interview_back"), (t_good, "p5_serve")))

    # s4: the better answer, plus why this company
    sid = "s4"
    t_plus = tm.mark(sid, "s4_plus")
    good = edu3.bubble(["「{接客経験を活かしながら}、", "給与条件も改善したいです」"], w=900, size=46, tone="ok", tail="right")
    ov = [edu3.edu.telop(tm, sid, "s4"),
          at(W / 2, 690, good, 0.1),
          at(W / 2, 860, plus_mark(), t_plus - 0.25, anim="pop"),
          at(W / 2, 1030, reason_card(), t_plus)]
    scenes.append(edu3.scene(tm, sid, ov, (0, "p6_office")))

    # s5: not only the complaint — what you want to achieve next
    sid = "s5"
    t_next = tm.mark(sid, "s5_next")
    tel = tm.tel["s5"]
    small, pad = mc.white_card(560, 104, r=26, alpha=180)
    paste_mid(small, label("今の不満", 44, 700, GREY), pad + 280, pad + 52)
    ov = [mc.Telop(mc.emph(tel["text"], 66), W / 2, 412, tm.local(sid, tel["start"]), tm.local(sid, tel["end"]),
                   anim="up", dur_in=0.35, dur_out=0.25),
          at(W / 2, 690, small, 0.3),
          at(W / 2, 800, edu3.edu.down_arrow(44), t_next - 0.15),
          at(W / 2, 990, next_card(), t_next)]
    scenes.append(edu3.scene(tm, sid, ov, (0, "c_interview"), (t_next, "p3_desk")))
    return scenes


def unknown(w, h):
    img = Image.new("RGBA", (w + 80, h + 80), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    x0, y0, x1, y1 = 40, 40, 40 + w, 40 + h
    for x in range(x0, x1, 26):
        d.line([(x, y0), (min(x1, x + 14), y0)], fill=(255, 255, 255), width=4)
        d.line([(x, y1), (min(x1, x + 14), y1)], fill=(255, 255, 255), width=4)
    for y in range(y0, y1, 26):
        d.line([(x0, y), (x0, min(y1, y + 14))], fill=(255, 255, 255), width=4)
        d.line([(x1, y), (x1, min(y1, y + 14))], fill=(255, 255, 255), width=4)
    q = edu3.edu.qmark(96)
    img.alpha_composite(q, (40 + (w - 96) // 2, 40 + (h - 96) // 2))
    return img


def note_box(text, color, w=470, h=104):
    img, pad = mc.white_card(w, h, r=26)
    d = ImageDraw.Draw(img)
    d.rounded_rectangle((pad, pad, pad + w, pad + h), 26, outline=color, width=5)
    t = edu3.text_img(text, 40) if color != RED else label(text.replace("{", "").replace("}", ""), 40, 900, RED)
    paste_mid(img, t, pad + w / 2, pad + h / 2)
    return img


def plus_mark(size=96):
    im = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.ellipse((0, 0, size - 1, size - 1), fill=YELLOW)
    w = size // 7
    d.rectangle((size / 2 - w / 2, size * 0.22, size / 2 + w / 2, size * 0.78), fill=INK)
    d.rectangle((size * 0.22, size / 2 - w / 2, size * 0.78, size / 2 + w / 2), fill=INK)
    return im


def reason_card(w=900, h=230):
    img, pad = mc.white_card(w, h, r=30)
    d = ImageDraw.Draw(img)
    d.rounded_rectangle((pad, pad, pad + 16, pad + h), 8, fill=YELLOW)
    paste_mid(img, edu3.text_img("{応募先を選んだ理由}", 58), pad + w / 2, pad + 70)
    paste_mid(img, label("なぜこの会社・この仕事か", 36, 700, GREY), pad + w / 2, pad + 150)
    for x in range(pad + 150, pad + w - 150, 30):
        d.line([(x, pad + 196), (x + 16, pad + 196)], fill=(190, 196, 208), width=4)
    return img


def next_card(w=900, h=300):
    img, pad = mc.white_card(w, h, r=32)
    ImageDraw.Draw(img).rounded_rectangle((pad, pad, pad + 16, pad + h), 8, fill=YELLOW)
    paste_mid(img, edu3.text_img("次に{実現したいこと}", 62), pad + w / 2, pad + 84)
    chips = [edu3.chip(t, 32) for t in ("経験の活かし方", "改善したい条件", "応募先を選んだ理由")]
    rows = [chips[:2], chips[2:]]
    for r, row in enumerate(rows):
        x = pad + (w - sum(c.width for c in row) - 16 * (len(row) - 1)) / 2
        for c in row:
            img.alpha_composite(c, (int(x), pad + 156 + r * 70))
            x += c.width + 16
    return img


def sfx_events(tm):
    m, S = tm.marks, {k: v["start"] for k, v in tm.scenes.items()}
    return [(0.95, "pop", 0.14), (m["s1_q"], "blip", 0.16), (S["s2"] + 0.15, "pop", 0.12), (m["s2_ok"], "tick", 0.18),
            (S["s3"] + 0.2, "pop", 0.12), (m["s3_ng_note"], "blip", 0.16), (m["s3_good"], "pop", 0.16),
            (S["s4"] + 0.1, "pop", 0.1), (m["s4_plus"] - 0.25, "pop", 0.14), (m["s5_next"], "pop", 0.16)]


if __name__ == "__main__":
    tm = mc.Timing(NAME)
    prev = [float(x) for x in sys.argv[1:]] or [0.5, 2.0, 3.5, 6.5, 9.0, 11.0, 13.5, 15.5, 18.0, 20.0, 22.5]
    print("done", edu3.render(tm, build(tm), prev, sfx_events(tm)), tm.total)
