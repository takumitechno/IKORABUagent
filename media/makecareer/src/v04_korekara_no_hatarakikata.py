"""④ 今の会社での将来が見えない → 04_korekara_no_hatarakikata.mp4 (timing in ../timing/04_korekara_no_hatarakikata.json)."""
import sys

import mc
from mc import TEAL, W, Telop

OFFICE = "makecareer/img/v4_office_desk_laptop.jpg"
TRAIN = "makecareer/img/v4_train_window_evening.jpg"
HOME = "makecareer/img/v4_home_evening_notebook.jpg"
OFFICE_MASKS = [(0.20, 0.36, 0.37, 0.46), (0.77, 0.33, 0.95, 0.42), (0.82, 0.72, 1.0, 0.98), (0.80, 0.67, 0.88, 0.73),
                (0.0, 0.40, 0.12, 0.47), (0.25, 0.93, 0.78, 1.0)]       # screens, logo, calculator, papers
TRAIN_MASKS = [(0.80, 0.42, 0.99, 0.48), (0.79, 0.28, 0.99, 0.34), (0.76, 0.65, 0.87, 0.71)]   # car ads, newspaper
HOME_MASKS = [(0.0, 0.37, 0.36, 0.62, 4)]                                                  # book spines


def build(tm):
    office = mc.Window(OFFICE, (0.05, 0.32, 0.95, 0.75), look="neutral", masks=OFFICE_MASKS)
    train = mc.Window(TRAIN, (0.15, 0.22, 1.0, 0.62), look="night", masks=TRAIN_MASKS)
    home = mc.Window(HOME, (0.10, 0.27, 1.0, 0.72), look="home", masks=HOME_MASKS)
    home_bg = mc.Window(HOME, (0, 0, 1, 1), look="home", masks=HOME_MASKS, bg_blur=30, bg_dark=0.42)
    scenes = []

    # s1: the same desk, the same ride home — day after day (identical framing on purpose)
    sid, d = "s1", tm.dur("s1")
    slot = d / 6
    parts, ov = [], [tm.telop(sid, "hook", size=80)]
    for k, day in enumerate("月火水"):
        parts += [(slot * 2 * k, office.shot(slot + 0.2, 1.0, 1.02, (0.5, 0.5))),
                  (slot * (2 * k + 1), train.shot(slot + 0.2, 1.0, 1.02, (0.5, 0.5)))]
        chip = mc.pill(f"{day}曜日", 30, bg=(10, 14, 28, 170), weight=700, padx=22, pady=10)
        ov.append(Telop(chip, mc.WIN[0] + 30 + chip.width / 2, mc.WIN[1] + 30 + chip.height / 2,
                        slot * 2 * k, slot * 2 * (k + 1) - 0.02, anim="fade", dur_in=0.05, dur_out=0.05))
    scenes.append(tm.scene(sid, mc.shots(parts, fade=0.12), ov, trans="cut"))

    # s2: home in the evening, an ordinary breather (no complaints, no late-night overtime)
    sid, d = "s2", tm.dur("s2")
    scenes.append(tm.scene(sid, home.shot(d, 1.0, 1.04, (0.45, 0.4)), [tm.telop(sid, "s2", size=76)]))

    # s3: a 「これから」 page with two open headings (not a quit-or-stay choice)
    sid, d = "s3", tm.dur("s3")
    page, ppad = mc.notebook(860, 600, title="これから", lines_from=200, gap=100)
    pcy = 880
    py0 = pcy - page.height / 2 + ppad
    px0 = W / 2 - 860 / 2
    ov = [tm.telop(sid, "s3", size=80), Telop(page, W / 2, pcy, 0.15, 99, anim="up", dur_in=0.4)]
    for k, (text, key) in enumerate((("経験したい仕事", "s3_h1"), ("大切にしたい働き方", "s3_h2"))):
        line = mc.bullet_line(text, 52)
        ov.append(Telop(line, px0 + 150 + line.width / 2, py0 + 162 + k * 200, tm.mark(sid, key), 99, anim="left"))
    scenes.append(tm.scene(sid, home_bg.backdrop(d), ov))

    # s4: look at both side by side; no single "success route"
    sid, d = "s4", tm.dur("s4")
    left = mc.icon_card(mc.bag_icon(130), "今の経験", 380, 330)
    right = mc.icon_card(mc.doc_icon(130), "これからの希望", 380, 330)
    both = mc.flow_card("長い目で見たキャリアを考える", 820, 130, size=46, accent=TEAL)
    ov = [tm.telop(sid, "s4", size=80),
          Telop(left, 300, 720, tm.mark(sid, "s4_left"), 99, anim="up", dur_in=0.35),
          Telop(mc.label("＋", 64, 900, (255, 255, 255)), W / 2, 720, tm.mark(sid, "s4_right") - 0.1, 99, anim="pop"),
          Telop(right, 780, 720, tm.mark(sid, "s4_right"), 99, anim="up", dur_in=0.35),
          Telop(both, W / 2, 1050, tm.mark(sid, "s4_long"), 99, anim="up", dur_in=0.35)]
    scenes.append(tm.scene(sid, home_bg.backdrop(d), ov))

    # s5: closing screen
    scenes.append(mc.cta_scene(tm, "s5", "『このままで\n{いいのかな}』を相談に", badge="これからのキャリアを考える無料面談",
                               chips=("今の経験", "これからの希望"), hl_size=84))
    return scenes


def sfx_events(tm):
    m, S = tm.marks, {k: v["start"] for k, v in tm.scenes.items()}
    return [(S["s3"] + 0.15, "paper", 0.4), (m["s3_h1"], "tick", 0.3), (m["s3_h2"], "tick", 0.3),
            (m["s4_left"], "pop", 0.24), (m["s4_right"], "pop", 0.24), (m["s4_long"], "pop", 0.24)]


if __name__ == "__main__":
    tm = mc.Timing("04_korekara_no_hatarakikata")
    S = {k: v["start"] for k, v in tm.scenes.items()}
    prev = [float(x) for x in sys.argv[1:]] or [0.5, 1.3, 2.1, 3.7, 6.0, 9.5, 13.2, 15.0, 17.0, 19.5, 25.5]
    out = mc.render(tm, build(tm), prev, sfx_events(tm), lift_at=S["s4"])
    print("done", out, tm.total)
