"""NEXT05 完全週休2日なのに、土日出勤？ → NEXT05_holidays.mp4. CTA: プロフィールのリンクへ.

The calendars come from the third educational series (career-edu-3/src/v01_holidays.py).
"""
import sys

from PIL import ImageDraw

import nx  # noqa: I001  (puts the shared tools on sys.path)
import mc
import v01_holidays as cal
from mc import GREY, INK, TEAL, W, YELLOW, label
from nx import RED, at, paste_mid

NAME = "NEXT05_holidays"
AI_NOTE = False
NOTE_XY = None
WEEKEND = [{5, 6}] * 4
MIDWEEK = [{1, 2}] * 4


def week_strip(w=900, h=200):
    """One week where 土日 are work days (the worry in the headline)."""
    img, pad = nx.card(w, h, r=28)
    d = ImageDraw.Draw(img)
    cw = (w - 40) / 7
    for k, ch in enumerate(cal.DAYS):
        cx = pad + 20 + cw * (k + 0.5)
        paste_mid(img, label(ch, 32, 700, RED if k >= 5 else GREY), cx, pad + 40)
        box = (cx - cw / 2 + 6, pad + 72, cx + cw / 2 - 6, pad + h - 22)
        if k >= 5:
            d.rounded_rectangle(box, 14, fill=(250, 226, 226), outline=RED, width=4)
            paste_mid(img, label("出勤", 34, 900, RED), cx, (box[1] + box[3]) / 2)
        else:
            d.rounded_rectangle(box, 14, fill=nx.edu.SOFT)
    return img


def build(tm):
    scenes = []

    # s1: headline — 完全週休2日 and still working weekends?
    sid = "s1"
    ov = nx.opening(tm, sid, "未経験転職｜休日の見方")
    ov += [at(W / 2, 860, week_strip(), 0.3, anim="pop"),
           at(W / 2 + 330, 740, nx.edu.qmark(96), 0.7, anim="pop")]
    scenes.append(nx.scene(tm, sid, ov, (0, "c_calendar")))

    # s2: 土日休み and 火・水休み — both are two days off every week
    sid = "s2"
    t_mid, t_ok = tm.mark(sid, "s2_mid"), tm.mark(sid, "s2_ok")
    ov = [nx.telop(tm, sid, "s2a"), nx.telop(tm, sid, "s2b"),
          at(W / 2, cal.TOP_CY, cal.calendar("例1：土日休み", WEEKEND, color=TEAL, note="毎週2日"), 0.15, anim="pop"),
          at(W / 2, cal.BOTTOM_CY, cal.calendar("例2：火・水休み", MIDWEEK, color=TEAL, note="毎週2日"), t_mid - 0.1,
             anim="pop"),
          at(W / 2 + 60, (cal.TOP_CY + cal.BOTTOM_CY) / 2, nx.stamp("どちらも完全週休2日", color=TEAL, size=46, angle=-4),
             t_ok, anim="punch", dur_in=0.25)]
    scenes.append(nx.scene(tm, sid, ov, (0, "c_calendar_phone"), (t_mid, "p5_serve")))

    # s3: check 年間休日 and the days off together
    sid = "s3"
    t_days, t_week = tm.mark(sid, "s3_days"), tm.mark(sid, "s3_week")
    rows = [("{年間休日}は何日か", t_days), ("{休む曜日}はいつか", t_week)]
    ov = [nx.telop(tm, sid, "s3")]
    for k, ((text, t), y) in enumerate(zip(rows, (720, 880))):
        ov.append(at(W / 2, y, nx.edu.check_row(text, w=860, h=130, size=52), 0.1 + 0.1 * k))
        ov.append(at(W / 2, y, nx.edu.check_row(text, checked=True, w=860, h=130, size=52), t, anim="fade",
                     dur_in=0.25))
    ov.append(at(W / 2, 1050, mc.pill("セットで確認", 44, bg=YELLOW, fg=INK, weight=900, padx=30, pady=12),
                 t_week + 0.4, anim="pop"))
    scenes.append(nx.scene(tm, sid, ov, (0, "p3_desk")))

    # s4: CTA — プロフィールのリンクへ
    sid = "s4"
    ov = [nx.telop(tm, sid, "s4"), at(W / 2, 880, nx.cta_link(), 0.25, anim="punch", dur_in=0.3)]
    scenes.append(nx.scene(tm, sid, ov, (0, "p5_street")))
    return scenes


def sfx_events(tm):
    m, S = tm.marks, {k: v["start"] for k, v in tm.scenes.items()}
    return [(0.3, "pop", 0.8), (0.7, "wrong", 0.75),
            (S["s2"] + 0.15, "pop", 0.8), (tm.subs[2]["start"], "accent", 0.95), (m["s2_mid"] - 0.1, "pop_hi", 0.85),
            (m["s2_ok"], "hit", 0.85),
            (m["s3_days"], "click", 0.85), (m["s3_week"], "click", 0.85), (m["s3_week"] + 0.4, "ding", 0.8),
            (S["s4"] + 0.25, "cta", 1.0)]


if __name__ == "__main__":
    tm = mc.Timing(NAME)
    prev = [float(x) for x in sys.argv[1:]] or [0.2, 1.2, 3.5, 6.0, 8.0, 9.4, 11.0, 12.8, 15.0]
    print("done", nx.render(tm, build(tm), prev, sfx_events(tm)), tm.total)
