"""③ そろそろ正社員になりたい → 03_seishain.mp4 (video only; timing in ../timing/03_seishain.json)."""
import sys

import mc
from mc import W, Telop

HOME = "makecareer/img/v3_home_notebook_resume.jpg"
SERVE = "makecareer/img/v3_cafe_serving_customer.jpg"
TEACH = "makecareer/img/v3_cafe_teaching_coworker.jpg"
HOME_MASKS = [(0.0, 0.75, 0.47, 0.94)]          # readable text on the resume form
SERVE_MASKS = [(0.05, 0.56, 0.22, 0.67)]        # coffee bag labels
TEACH_MASKS = [(0.85, 0.69, 1.0, 0.77)]         # red lettering on the espresso machine


def build(tm):
    home = mc.Window(HOME, (0.0, 0.27, 1.0, 0.73), look="warm", masks=HOME_MASKS)
    home_close = mc.Window(HOME, (0.15, 0.30, 0.95, 0.66), look="warm", masks=HOME_MASKS)
    hands = mc.Window(HOME, (0.0, 0.58, 0.75, 0.74), box=(60, 490, 1020, 790), look="warm", masks=HOME_MASKS)
    home_bg = mc.Window(HOME, (0, 0, 1, 1), look="warm", masks=HOME_MASKS, bg_dark=0.32, bg_blur=30)
    serve = mc.Window(SERVE, (0.0, 0.27, 1.0, 0.72), look="warm", masks=SERVE_MASKS)
    teach = mc.Window(TEACH, (0.0, 0.26, 1.0, 0.71), look="warm", masks=TEACH_MASKS)
    scenes = []

    # s1: at the desk, then the 職歴 row of the (schematic) résumé with the pen resting on it
    sid, d = "s1", tm.dur("s1")
    t_res = tm.mark(sid, "s1_resume")
    sheet, pad, (x0, top, x1, rh) = mc.resume_sheet(860, 700)
    cy = 880
    sx, sy = W / 2 - sheet.width / 2, cy - sheet.height / 2
    pen = mc.pen_icon(170)
    scenes.append(tm.scene(sid, mc.shots([(0.0, home.shot(t_res + 0.4, 1.0, 1.04, (0.5, 0.45))),
                                         (t_res, home.backdrop(d - t_res))]), [
        tm.telop(sid, "hook", size=82),
        Telop(sheet, W / 2, cy, t_res + 0.05, 99, anim="up", dur_in=0.4),
        Telop(pen, sx + x0 + 300, sy + top + rh * 5.5 - pen.height / 2 + 30, t_res + 0.5, 99, anim="up", dur_in=0.5),
    ], trans="cut"))

    # s2: inner voice on a sticky note, short look at her (not a long sad close-up)
    sid, d = "s2", tm.dur("s2")
    t = tm.tel["s2"]
    note = mc.sticky(t["text"], w=470, h=270, size=60, angle=-3)
    scenes.append(tm.scene(sid, home_close.shot(d, 1.0, 1.04, (0.4, 0.5)), [
        Telop(note, 735, 1105, tm.local(sid, t["start"]), tm.local(sid, t["end"]), anim="pop", dur_in=0.4),
    ]))

    # s3: examples of work she has done (serving, teaching a newcomer)
    sid, d = "s3", tm.dur("s3")
    t_teach = tm.mark(sid, "s3_teach")
    tag = mc.pill("経験の例", 30, bg=(10, 14, 28, 170), weight=700, padx=22, pady=10)
    scenes.append(tm.scene(sid, mc.shots([(0.0, serve.shot(t_teach + 0.4, 1.0, 1.05, (0.5, 0.4))),
                                         (t_teach, teach.shot(d - t_teach, 1.0, 1.05, (0.45, 0.45), seed=2.0))]), [
        tm.telop(sid, "s3", size=78),
        Telop(tag, mc.WIN[0] + 30 + tag.width / 2, mc.WIN[1] + 30 + tag.height / 2, 0.3, 99, anim="up"),
    ]))

    # s4: writing it down — hands on top, what gets written below
    sid, d = "s4", tm.dur("s4")
    page, ppad = mc.notebook(900, 400, title="経験の整理", tag="経験の例", lines_from=212, gap=96)
    pcy = 1035
    py0 = pcy - page.height / 2 + ppad
    items = [("担当していた仕事", "s4_item1"), ("新人に教えたこと", "s4_item2")]
    ov = [tm.telop(sid, "s4", size=74), Telop(page, W / 2, pcy, 0.25, 99, anim="up", dur_in=0.4)]
    for k, (text, key) in enumerate(items):
        line = mc.bullet_line(text, 54)
        ov.append(Telop(line, mc.W / 2 - 900 / 2 + 150 + line.width / 2, py0 + 176 + k * 96,
                        tm.mark(sid, key), 99, anim="left", dur_in=0.35))
    scenes.append(tm.scene(sid, hands.shot(d, 1.0, 1.04, (0.3, 0.5)), ov))

    # s5: two things to prepare for a first application
    sid, d = "s5", tm.dur("s5")
    cards = [(mc.icon_card(mc.doc_icon(150), "履歴書", 400, 430), 315, "s5_resume"),
             (mc.icon_card(mc.chat_icon(150), "面接準備", 400, 430), 765, "s5_interview")]
    ov = [tm.telop(sid, "s5", size=78)]
    for k, (img, x, key) in enumerate(cards):
        ov.append(Telop(img, x, 880, 0.45 + 0.12 * k, 99, anim="up", dur_in=0.4))
    for img, x, key in cards:
        ov.append(mc.Highlight(mc.accent_frame(400, 430), x, 880, tm.mark(sid, key)))
    scenes.append(tm.scene(sid, home_bg.backdrop(d), ov))

    # s6: closing screen
    scenes.append(mc.cta_scene(tm, "s6", "{履歴書・面接}の\n準備から相談", sub="初めての正社員応募に",
                               band="無料相談はプロフィールのリンクから", chips=("履歴書", "面接準備")))
    return scenes


def sfx_events(tm):
    m = tm.marks
    return [(m["s1_resume"], "paper", 0.5), (m["s1_resume"] + 0.45, "tick", 0.3),
            (tm.tel["s2"]["start"], "pop", 0.32),
            (tm.scenes["s4"]["start"] + 0.25, "paper", 0.4), (m["s4_item1"], "tick", 0.32), (m["s4_item2"], "tick", 0.32),
            (tm.scenes["s5"]["start"] + 0.45, "pop", 0.25), (tm.scenes["s5"]["start"] + 0.57, "pop", 0.2),
            (m["s5_resume"], "blip", 0.18), (m["s5_interview"], "blip", 0.18)]


if __name__ == "__main__":
    tm = mc.Timing("03_seishain")
    S = {k: v["start"] for k, v in tm.scenes.items()}
    prev = [float(x) for x in sys.argv[1:]] or [0.8, 3.2, 5.8, 8.0, 10.5, 12.0, 15.5, 18.5, 22.5, 25.0, 29.0]
    out = mc.render(tm, build(tm), prev, sfx_events(tm), lift_at=S["s5"])
    print("done", out, tm.total)
