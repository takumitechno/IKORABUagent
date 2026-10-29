"""① 週休2日なのに土曜出勤？ → career_edu_3_01_holidays.mp4 (timing in ../timing/career_edu_3_01_holidays.json)."""
import sys

from PIL import Image, ImageDraw

import edu3
import mc
from edu3 import ORANGE, SOFT, at, paste_mid
from mc import GREY, INK, TEAL, W, YELLOW, label

NAME = "career_edu_3_01_holidays"
AI_NOTE = True
NOTE_XY = None
DAYS = "月火水木金土日"
WEEKEND = {5, 6}
ONE_DAY = [WEEKEND, {6}, {6}, {6}]          # 週休2日制の一例: 週2日休めるのは月1回
FULL = [WEEKEND] * 4                         # 完全週休2日制（土日）
FULL_MIDWEEK = [{1, 2}] * 4                  # 完全週休2日制（火・水の例）
CAL_W, HEAD_H, DOW_H, ROW_H = 900, 66, 44, 54
CAL_H = HEAD_H + DOW_H + ROW_H * 4 + 18
TOP_CY, BOTTOM_CY = 700, 1058


def calendar(title, rest, color=ORANGE, note=None):
    """One month as four week rows (an example); rest days filled, the count of days off at the right."""
    img, pad = mc.white_card(CAL_W, CAL_H, r=28)
    d = ImageDraw.Draw(img)
    d.rounded_rectangle((pad, pad, pad + CAL_W, pad + HEAD_H), 28, fill=color)
    d.rectangle((pad, pad + HEAD_H - 28, pad + CAL_W, pad + HEAD_H), fill=color)
    paste_mid(img, label(title, 42, 900, (255, 255, 255)), pad + CAL_W / 2 - (70 if note else 0), pad + HEAD_H / 2)
    if note:
        n = mc.pill(note, 32, bg=(255, 255, 255), fg=color, weight=900, padx=16, pady=7)
        img.alpha_composite(n, (pad + CAL_W - 24 - n.width, pad + (HEAD_H - n.height) // 2))
    x0, cw = pad + 26, (CAL_W - 26 - 150) / 7
    y = pad + HEAD_H
    for k, ch in enumerate(DAYS):
        paste_mid(img, label(ch, 30, 700, GREY), x0 + cw * (k + 0.5), y + DOW_H / 2)
    paste_mid(img, label("休み", 28, 700, GREY), pad + CAL_W - 75, y + DOW_H / 2)
    for r, days in enumerate(rest):
        yy = y + DOW_H + r * ROW_H
        for k in range(7):
            box = (x0 + cw * k + 5, yy + 5, x0 + cw * (k + 1) - 5, yy + ROW_H - 5)
            if k in days:
                d.rounded_rectangle(box, 10, fill=TEAL)
                paste_mid(img, label("休", 28, 900, (255, 255, 255)), (box[0] + box[2]) / 2, (box[1] + box[3]) / 2)
            else:
                d.rounded_rectangle(box, 10, fill=SOFT)
        two = len(days) >= 2
        paste_mid(img, label(f"{len(days)}日", 38, 900, TEAL if two else GREY), pad + CAL_W - 75, yy + ROW_H / 2)
    img.info["row0"] = (pad + 10, y + DOW_H, pad + CAL_W - 10, y + DOW_H + ROW_H)
    return img


def week_strip():
    """One week, 土日 off: what 「週休2日」 is usually taken to mean."""
    w, h = 900, 190
    img, pad = mc.white_card(w, h, r=28)
    d = ImageDraw.Draw(img)
    cw = (w - 40) / 7
    for k, ch in enumerate(DAYS):
        cx = pad + 20 + cw * (k + 0.5)
        paste_mid(img, label(ch, 32, 700, GREY), cx, pad + 40)
        box = (cx - cw / 2 + 6, pad + 70, cx + cw / 2 - 6, pad + h - 22)
        if k in WEEKEND:
            d.rounded_rectangle(box, 14, fill=TEAL)
            paste_mid(img, label("休", 40, 900, (255, 255, 255)), cx, (box[1] + box[3]) / 2)
        else:
            d.rounded_rectangle(box, 14, fill=SOFT)
    return img


def stamp(text):
    f_lab = label(text, 46, 900, (210, 60, 60))
    w, h = f_lab.width + 60, f_lab.height + 34
    im = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.rounded_rectangle((3, 3, w - 4, h - 4), 18, fill=(255, 255, 255, 235), outline=(210, 60, 60), width=6)
    im.alpha_composite(f_lab, (30, 15))
    return im.rotate(8, expand=True, resample=Image.BICUBIC)


def build(tm):
    scenes = []

    # s1: warning badge, then the week everyone pictures — every week?
    sid = "s1"
    t_week = tm.mark(sid, "s1_week")
    ov = [mc.Telop(mc.emph(tm.tel["hook"]["text"], 80), W / 2, mc.TOP_CY, 0.0, tm.local(sid, tm.tel["hook"]["end"]),
                   anim="punch", dur_in=0.3, dur_out=0.25)]
    ov += edu3.badge_overlays("転職の落とし穴", t_week - 0.1, big_cy=840, small_cy=612)
    ov += [at(W / 2, 880, week_strip(), t_week),
           at(W / 2 - 40, 1100, mc.emph("これが{毎週}？", 64), t_week + 0.45, anim="pop"),
           at(W / 2 + 190, 1100, edu3.edu.qmark(80), t_week + 0.6, anim="pop")]
    scenes.append(edu3.scene(tm, sid, ov, (0, "c_calendar")))

    # s2: the wish (土日休み) and the listing (週休2日) — choosing by that word alone is risky
    sid = "s2"
    card = edu3.job_card(("休日", "週休2日"))
    cy = 960
    x0, y0, x1, y1 = card.info["value_box"]
    vx, vy = W / 2 - card.width / 2 + (x0 + x1) / 2, cy - card.height / 2 + (y0 + y1) / 2
    t_warn = tm.mark(sid, "s2_warn")
    ov = [edu3.edu.telop(tm, sid, "s2a"), edu3.edu.telop(tm, sid, "s2b"),
          at(W / 2, 640, edu3.bubble(["希望は{土日休み}"], w=560, size=50, tail="left"), 0.15),
          at(W / 2, cy, card, 0.45),
          mc.Highlight(edu3.ring(x1 - x0 + 16, y1 - y0 + 12), vx, vy, t_warn),
          at(vx + (x1 - x0) / 2 + 30, vy - 70, edu3.warn_icon(110), t_warn + 0.15, anim="pop")]
    scenes.append(edu3.scene(tm, sid, ov, (0, "p3_phone")))

    # s3: 週休2日制 — one week a month with two days off is enough
    sid = "s3"
    cal = calendar("週休2日制の例", ONE_DAY)
    rx0, ry0, rx1, ry1 = cal.info["row0"]
    top = TOP_CY - cal.height / 2
    t1 = tm.mark(sid, "s3_week1")
    ov = [edu3.edu.telop(tm, sid, "s3a"), edu3.edu.telop(tm, sid, "s3b"),
          at(W / 2, TOP_CY, cal, 0.15),
          mc.Highlight(edu3.ring(rx1 - rx0, ry1 - ry0 + 6, r=14), W / 2 - cal.width / 2 + (rx0 + rx1) / 2,
                       top + (ry0 + ry1) / 2, t1),
          at(W / 2, 1010, edu3.flow_box("週2日休めるのは{月1回}だけ", 820, 120, 50), t1 + 0.3),
          at(W / 2 + 230, TOP_CY + 60, stamp("これも週休2日制"), tm.mark(sid, "s3_ok"), anim="punch", dur_in=0.25)]
    scenes.append(edu3.scene(tm, sid, ov, (0, "c_calendar_phone")))

    # s4: 完全週休2日制 is every week — but not necessarily 土日
    sid = "s4"
    t_shift = tm.mark(sid, "s4_shift")
    full = calendar("完全週休2日制の例", FULL, color=TEAL)
    mid = calendar("完全週休2日制の例", FULL_MIDWEEK, color=TEAL, note="火・水休み")
    ov = [edu3.edu.telop(tm, sid, "s4a"), edu3.edu.telop(tm, sid, "s4b"),
          at(W / 2, TOP_CY, calendar("週休2日制の例", ONE_DAY), -1.0),
          at(W / 2, BOTTOM_CY, full, 0.15, t_shift + 0.3),
          mc.Highlight(edu3.ring(CAL_W + 14, CAL_H + 14, r=32, width=8), W / 2, BOTTOM_CY,
                       tm.mark(sid, "s4_name"), t_shift),
          at(W / 2, BOTTOM_CY, mid, t_shift, anim="fade", dur_in=0.35)]
    scenes.append(edu3.scene(tm, sid, ov, (0, "p5_street"), (t_shift, "p5_serve")))

    # s5: three things to check on the listing, then the closing line
    sid = "s5"
    t_close = tm.local(sid, tm.tel["s5b"]["start"])
    rows = ["{完全}週休2日制か", "休日は{土日}か（曜日）", "{年間休日数}は何日か"]
    checks = [tm.mark(sid, "s5_c1"), tm.mark(sid, "s5_c2"), tm.mark(sid, "s5_c3")]
    ov = [edu3.edu.telop(tm, sid, "s5a"), edu3.edu.telop(tm, sid, "s5b")]
    for k, (text, y) in enumerate(zip(rows, (650, 810, 970))):
        ov.append(at(W / 2, y, edu3.edu.check_row(text), 0.1 + 0.1 * k))
        ov.append(at(W / 2, y, edu3.edu.check_row(text, checked=True), checks[k], anim="fade", dur_in=0.25))
    scenes.append(edu3.scene(tm, sid, ov, (0, "p3_desk"), (t_close, "c_calendar")))
    return scenes


def sfx_events(tm):
    m, S = tm.marks, {k: v["start"] for k, v in tm.scenes.items()}
    return [(m["s1_week"], "pop", 0.14), (S["s2"] + 0.45, "pop", 0.12), (m["s2_warn"], "blip", 0.16),
            (S["s3"] + 0.15, "pop", 0.12), (m["s3_week1"], "tick", 0.16), (m["s3_ok"], "pop", 0.18),
            (S["s4"] + 0.15, "pop", 0.12), (m["s4_shift"], "blip", 0.16),
            (m["s5_c1"], "tick", 0.16), (m["s5_c2"], "tick", 0.16), (m["s5_c3"], "tick", 0.16)]


if __name__ == "__main__":
    tm = mc.Timing(NAME)
    prev = [float(x) for x in sys.argv[1:]] or [0.5, 2.5, 5.0, 7.5, 9.5, 12.8, 14.5, 18.5, 21.0, 23.5, 26.0]
    print("done", edu3.render(tm, build(tm), prev, sfx_events(tm)), tm.total)
