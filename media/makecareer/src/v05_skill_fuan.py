"""⑤ 資格も特別なスキルもない → 05_skill_fuan.mp4 (timing in ../timing/05_skill_fuan.json)."""
import sys

from PIL import ImageDraw

import mc
from mc import GREY, INK, W, YELLOW, Telop

STUDY = "makecareer/img/v5_home_reference_book.jpg"
STUDY_MASKS = [(0.0, 0.51, 0.33, 0.68), (0.0, 0.71, 0.27, 0.79), (0.47, 0.54, 0.58, 0.64, 5),
               (0.43, 0.16, 0.52, 0.35, 4)]          # laptop screen, notebook, book spine, shelf spines (clear of the face)
BLUE_COVER, ORANGE_COVER = (52, 86, 124), (204, 104, 52)


def search_screen():
    """Schematic search + two generic reference books side by side (no titles, publishers or exam names)."""
    img, (x0, y0, x1, y1) = mc.laptop(900, 580)
    d = ImageDraw.Draw(img)
    tag = mc.pill("検索のイメージ", 24, bg=(226, 230, 238), fg=GREY, weight=700, padx=18, pady=8)
    img.alpha_composite(tag, (x0 + 30, y0 + 22))
    bx0, bx1 = x0 + 40, x1 - 40
    d.rounded_rectangle((bx0, y0 + 76, bx1, y0 + 146), 35, fill=(255, 255, 255), outline=(200, 206, 216), width=3)
    img.alpha_composite(mc.search_icon(40, GREY), (bx0 + 24, y0 + 91))
    d.text((bx0 + 84, y0 + 86), "資格　転職", font=mc.font(36, 700), fill=INK)
    for k, cover in enumerate((BLUE_COVER, ORANGE_COVER)):
        cw = (bx1 - bx0 - 30) // 2
        c, pad = mc.white_card(cw, 300, r=20)
        cimg = mc.book_icon(150, cover)
        c.alpha_composite(cimg, (pad + (cw - 150) // 2, pad + 20))
        cd = ImageDraw.Draw(c)
        for j, frac in enumerate((0.8, 0.55)):
            cd.rounded_rectangle((pad + 30, pad + 196 + j * 34, pad + 30 + (cw - 60) * frac, pad + 212 + j * 34), 8,
                                 fill=(216, 220, 228))
        img.alpha_composite(c, (bx0 - pad + k * (cw + 30), y0 + 170 - pad))
    return img


def options_card(w=820, h=210):
    img, pad = mc.white_card(w, h, r=30)
    d = ImageDraw.Draw(img)
    d.rounded_rectangle((pad, pad, pad + 16, pad + h), 8, fill=YELLOW)
    img.alpha_composite(mc.bag_icon(64), (pad + 44, pad + 28))
    img.alpha_composite(mc.label("仕事の選択肢", 50), (pad + 128, pad + 30))
    for k in range(3):   # left blank on purpose: options come out of the consultation, not from the video
        x = pad + 48 + k * 250
        d.rounded_rectangle((x, pad + 118, x + 220, pad + 174), 28, outline=(180, 188, 200), width=4)
    return img


def build(tm):
    study = mc.Window(STUDY, (0.05, 0.33, 0.95, 0.70), look="neutral", masks=STUDY_MASKS)
    study_bg = mc.Window(STUDY, (0, 0, 1, 1), look="neutral", masks=STUDY_MASKS, bg_blur=30, bg_dark=0.45)
    scenes = []

    # s1: searching for qualifications and weighing two reference books, then him with one of them
    sid, d = "s1", tm.dur("s1")
    t_photo = tm.mark(sid, "s1_photo")
    scenes.append(tm.scene(sid, mc.shots([(0.0, study_bg.backdrop(t_photo + 0.4)),
                                         (t_photo, study.shot(d - t_photo, 1.0, 1.04, (0.5, 0.45)))]), [
        tm.telop(sid, "hook", size=78),
        Telop(search_screen(), W / 2, 880, 0.0, t_photo + 0.3, anim="up", dur_in=0.35, dur_out=0.3),
    ], trans="cut"))

    # s2: a note next to the book (the book stays in shot)
    sid, d = "s2", tm.dur("s2")
    t = tm.tel["s2"]
    note = mc.sticky(t["text"], w=420, h=270, size=52, angle=2.5)
    scenes.append(tm.scene(sid, study.shot(d, 1.03, 1.06, (0.5, 0.45)), [
        Telop(note, 280, 650, tm.local(sid, t["start"]), tm.local(sid, t["end"]), anim="pop", dur_in=0.4)]))

    # s3: deciding on a qualification and choosing the next job go together (neither side crossed out)
    sid, d = "s3", tm.dur("s3")
    both = mc.arrow(130, 60, both=True).rotate(90, expand=True)
    ov = [tm.telop(sid, "s3", size=78),
          Telop(mc.flow_card("資格・必要な準備", 820, 140, mc.book_icon(80, BLUE_COVER), 52), W / 2, 640,
                tm.mark(sid, "s3_prep"), 99, anim="up", dur_in=0.35),
          Telop(mc.flow_card("考えたい仕事", 820, 140, mc.bag_icon(80), 52), W / 2, 980,
                tm.mark(sid, "s3_job"), 99, anim="up", dur_in=0.35),
          Telop(both, W / 2, 810, tm.mark(sid, "s3_set"), 99, anim="pop", dur_in=0.35)]
    scenes.append(tm.scene(sid, study_bg.backdrop(d), ov))

    # s4: add current experience and wishes, then think about which jobs are options
    sid, d = "s4", tm.dur("s4")
    pair = mc.pill("考えたい仕事 ⇄ 資格・必要な準備", 30, bg=(255, 255, 255, 46), fg=(255, 255, 255), weight=700)
    ov = [tm.telop(sid, "s4", size=80),
          Telop(pair, W / 2, 540, 0.1, 99, anim="fade"),
          Telop(mc.icon_card(mc.doc_icon(120), "今の経験", 380, 300), 300, 750, tm.mark(sid, "s4_exp"), 99, anim="up"),
          Telop(mc.label("＋", 64, 900, (255, 255, 255)), W / 2, 750, tm.mark(sid, "s4_hope") - 0.1, 99, anim="pop"),
          Telop(mc.icon_card(mc.chat_icon(120), "希望", 380, 300), 780, 750, tm.mark(sid, "s4_hope"), 99, anim="up"),
          Telop(mc.arrow(100, 50).rotate(-90, expand=True), W / 2, 955, tm.mark(sid, "s4_opts") - 0.1, 99, anim="up"),
          Telop(options_card(), W / 2, 1110, tm.mark(sid, "s4_opts"), 99, anim="up", dur_in=0.35)]
    scenes.append(tm.scene(sid, study_bg.backdrop(d), ov))

    # s5: closing screen
    scenes.append(mc.cta_scene(tm, "s5", "今の経験から、\n{仕事の選択肢}を相談", badge="無料相談",
                               chips=("今の経験", "希望"), hl_size=82))
    return scenes


def sfx_events(tm):
    m = tm.marks
    return [(tm.tel["s2"]["start"], "pop", 0.3), (m["s3_prep"], "pop", 0.24), (m["s3_job"], "pop", 0.24),
            (m["s3_set"], "blip", 0.18), (m["s4_exp"], "pop", 0.22), (m["s4_hope"], "pop", 0.22),
            (m["s4_opts"], "pop", 0.26)]


if __name__ == "__main__":
    tm = mc.Timing("05_skill_fuan")
    S = {k: v["start"] for k, v in tm.scenes.items()}
    prev = [float(x) for x in sys.argv[1:]] or [0.8, 2.8, 4.5, 7.5, 9.8, 12.8, 15.0, 18.5, 20.0, 23.0, 26.5]
    out = mc.render(tm, build(tm), prev, sfx_events(tm), lift_at=S["s4"])
    print("done", out, tm.total)
