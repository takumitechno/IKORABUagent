"""④ 内定ゼロで退職。貯金60万円で足りる？ → career_edu_3_04_savings.mp4 (timing in ../timing/career_edu_3_04_savings.json).

The chart is the narration's own example (60万円, 月20万円 → 3か月); the extra payments after leaving are drawn
without amounts.
"""
import sys

from PIL import Image, ImageDraw

import edu3
import mc
from edu3 import RED, at, paste_mid
from engine import ease_out_cubic
from mc import GREY, INK, TEAL, W, YELLOW, clamp, font, label

NAME = "career_edu_3_04_savings"
AI_NOTE = True
NOTE_XY = None
CARD_CY = 905
BASE_Y, MAX_H, BAR_W = 1100, 330, 150
BAR_X = (230, 430, 630, 830)
VALUES = (60, 40, 20, 0)
MONTHS = ("退職時", "1か月後", "2か月後", "3か月後")
PAY_H = 64           # schematic height of the extra payments (no amount)


def money_card(w=820, h=300):
    img, pad = mc.white_card(w, h, r=34)
    t = edu3.edu.tag()
    img.alpha_composite(t, (pad + w - 40 - t.width, pad + 36))
    lab = label("貯金", 54, 700, GREY)
    num = label("60万円", 150, 900, INK)
    x = pad + (w - lab.width - 30 - num.width) / 2
    img.alpha_composite(lab, (int(x), pad + 150))
    img.alpha_composite(num, (int(x + lab.width + 30), pad + 80))
    return img


def hatch(w, h):
    im = Image.new("RGBA", (w, h), (250, 226, 226, 255))
    d = ImageDraw.Draw(im)
    for s in range(-w, h + w, 16):
        d.line([(0, s + w), (w, s)], fill=RED, width=4)
    d.rectangle((0, 0, w - 1, h - 1), outline=RED, width=3)
    return im


HATCH = hatch(BAR_W, PAY_H)


class Bars:
    """Savings after each month (bars grow in turn); later the payments after leaving eat into them."""

    def __init__(self, t_bars, t_pay, t_short):
        self.t_bars, self.t_pay, self.t_short = t_bars, t_pay, t_short

    def draw(self, frame, t):
        d = ImageDraw.Draw(frame)
        fv, fm = font(40, 900), font(30, 700)
        for k, (x, v, t0) in enumerate(zip(BAR_X, VALUES, self.t_bars)):
            p = ease_out_cubic(clamp((t - t0) / 0.4))
            if p <= 0:
                continue
            full = MAX_H * v / 60
            top = BASE_Y - full * p
            if full:
                d.rounded_rectangle((x - BAR_W / 2, top, x + BAR_W / 2, BASE_Y), 12, fill=TEAL)
            q = ease_out_cubic(clamp((t - self.t_pay) / 0.5)) if 0 < k < 3 else 0
            if q > 0:      # hatched payments taken off the top of the bar
                hh = max(1, int(min(PAY_H, full - 6) * q))
                frame.alpha_composite(HATCH.crop((0, 0, BAR_W, hh)), (int(x - BAR_W / 2), int(top)))
            text = f"{v}万円" if v else "0円"
            if p > 0.6:
                tw = fv.getlength(text)
                col = GREY if q > 0.5 else INK
                d.text((x - tw / 2, top - 58), text, font=fv, fill=col)
            tw = fm.getlength(MONTHS[k])
            d.text((x - tw / 2, BASE_Y + 16), MONTHS[k], font=fm, fill=INK if k == 3 else GREY)
        d.line([(110, BASE_Y), (970, BASE_Y)], fill=(170, 178, 192), width=4)
        if t >= self.t_short:          # 「3か月」 no longer holds
            fx = font(30, 700)
            tw = fx.getlength(MONTHS[3])
            yy = BASE_Y + 16 + 22
            d.line([(BAR_X[3] - tw / 2 - 6, yy), (BAR_X[3] + tw / 2 + 6, yy)], fill=RED, width=5)




class Timeline:
    """Months 0–6: what the savings last vs a job search that may run past 3 months."""

    def __init__(self, cy, t_in, t_long):
        self.cy, self.t_in, self.t_long = cy, t_in, t_long

    def draw(self, frame, t):
        if t < self.t_in:
            return
        d = ImageDraw.Draw(frame)
        x0, x1 = 356, 960
        mx = lambda m: x0 + (x1 - x0) * m / 6
        top = self.cy - 150
        f, fs = font(32, 900), font(28, 700)
        for m in range(7):
            x = mx(m)
            d.line([(x, top + 30), (x, top + 300)], fill=(226, 230, 238), width=2)
            if m:
                lab = f"{m}か月"
                d.text((x - fs.getlength(lab) / 2, top + 310), lab, font=fs, fill=INK if m == 3 else GREY)
        for y in range(top + 20, top + 300, 22):      # the 3-month mark
            d.line([(mx(3), y), (mx(3), y + 12)], fill=(150, 158, 172), width=4)
        orange = (240, 160, 60)
        rows = [("貯金でもつ期間", TEAL, 2.4, top + 85), ("転職活動", orange, 3.0, top + 215)]
        for k, (name, col, months, y) in enumerate(rows):
            d.text((92, y - 21), name, font=f, fill=INK)
            p = ease_out_cubic(clamp((t - self.t_in - 0.25 * k) / 0.6))
            if p > 0:
                d.rounded_rectangle((x0, y - 36, x0 + (mx(months) - x0) * p, y + 36), 16, fill=col)
        q = clamp((t - self.t_long) / 0.6)
        if q > 0:          # the search may run longer
            y = rows[1][3]
            end = mx(3.0) + 6 + (mx(5.4) - mx(3.0)) * ease_out_cubic(q)
            d.rounded_rectangle((mx(3.0) + 6, y - 36, end, y + 36), 16, fill=(253, 236, 214), outline=orange, width=5)
            if q > 0.9:
                fq = font(40, 900)
                d.text(((mx(3.0) + end) / 2 - fq.getlength("?") / 2, y - 28), "?", font=fq, fill=orange)


def check_item(text, sub, checked, w=860, h=150):
    img, pad = mc.white_card(w, h, r=28)
    img.alpha_composite(edu3.edu.check_box(60, checked), (pad + 36, pad + (h - 60) // 2))
    main = edu3.text_img(text, 50)
    if sub:
        img.alpha_composite(main, (pad + 124, pad + 26))
        img.alpha_composite(label(sub, 32, 700, GREY), (pad + 128, pad + 92))
    else:
        img.alpha_composite(main, (pad + 124, pad + (h - main.height) // 2))
    return img


def build(tm):
    scenes = []

    # s1: warning badge — leaving with 60万円 saved and no offer yet
    sid = "s1"
    t_money = tm.mark(sid, "s1_money")
    ov = [mc.Telop(mc.emph(tm.tel["hook"]["text"], 80), W / 2, mc.TOP_CY, 0.0, tm.local(sid, tm.tel["hook"]["end"]),
                   anim="punch", dur_in=0.3, dur_out=0.25)]
    ov += edu3.badge_overlays("退職前に要注意", 1.0, big_cy=840, small_cy=612)
    ov += [at(W / 2, 760, edu3.flow_box("次の転職先が{決まる前}に退職", 820, 116, 46), 1.0),
           at(W / 2, 1000, money_card(), t_money, anim="punch", dur_in=0.3),
           at(985, 870, edu3.edu.qmark(100), t_money + 0.6, anim="pop")]
    scenes.append(edu3.scene(tm, sid, ov, (0, "c_budget")))

    # s2: 60 → 40 → 20 → 0 at 月20万円 — then the payments after leaving make it shorter
    sid = "s2"
    t_cost, t_calc = tm.mark(sid, "s2_cost"), tm.mark(sid, "s2_calc")
    t_tax, t_ins, t_short = tm.mark(sid, "s2_tax"), tm.mark(sid, "s2_ins"), tm.mark(sid, "s2_short")
    t_bars = [t_cost - 0.2 + 0.3 * k for k in range(4)]
    ov = [edu3.edu.telop(tm, sid, "s2a"), edu3.edu.telop(tm, sid, "s2b"),
          at(W / 2, CARD_CY, mc.white_card(920, 640, r=32)[0], 0.05, anim="fade"),
          at(260, 640, edu3.chip("生活費 月20万円", 36), t_cost - 0.2, anim="pop"),
          at(885, 640, edu3.edu.tag(), 0.1, anim="fade"),
          Bars(t_bars, t_ins + 0.2, t_short),
          mc.Highlight(edu3.ring(170, 56, r=18), BAR_X[3], BASE_Y + 40, t_calc, t_short),
          at(560, 640, edu3.chip("住民税", 34, bg=(250, 226, 226), fg=RED), t_tax, anim="pop"),
          at(720, 640, edu3.chip("保険料", 34, bg=(250, 226, 226), fg=RED), t_ins, anim="pop"),
          at(W / 2, 1180, label("※支払いの額は人によって違います", 26, 700, GREY), t_ins + 0.3, anim="fade"),
          at(BAR_X[3] - 10, 850, mc.emph("もっと{短く}", 58), t_short, anim="pop"),
          at(BAR_X[3] + 10, 1040, mc.arrow(110, 50, YELLOW).rotate(180), t_short + 0.15, anim="fade")]
    scenes.append(edu3.scene(tm, sid, ov, (0, "c_budget_hands"), (t_tax, "p3_desk")))

    # s3: the search itself may take longer than 3 months
    sid = "s3"
    t_long = tm.mark(sid, "s3_long")
    ov = [edu3.edu.telop(tm, sid, "s3"),
          at(W / 2, 860, mc.white_card(920, 470, r=32)[0], 0.05, anim="fade"),
          Timeline(860, 0.2, t_long),
          at(W / 2, 1180, mc.emph("3か月で終わる{とは限らない}", 54), t_long + 0.3, anim="pop")]
    scenes.append(edu3.scene(tm, sid, ov, (0, "p5_home")))

    # s4: closing checklist — living costs, and the payments after leaving
    sid = "s4"
    items = [("{生活費}", "毎月の家賃・食費など", tm.mark(sid, "s4_c1")),
             ("{退職後の支払い}", "住民税・保険料など", tm.mark(sid, "s4_c2"))]
    ov = [edu3.edu.telop(tm, sid, "s4"), at(W / 2, 640, edu3.edu.dark_tag("辞める前に計算すること"), 0.1)]
    for k, ((text, sub, t_chk), y) in enumerate(zip(items, (790, 980))):
        ov.append(at(W / 2, y, check_item(text, sub, False), 0.2 + 0.12 * k))
        ov.append(at(W / 2, y, check_item(text, sub, True), t_chk, anim="fade", dur_in=0.25))
    scenes.append(edu3.scene(tm, sid, ov, (0, "c_budget"), (items[1][2], "p3_phone")))
    return scenes


def sfx_events(tm):
    m, S = tm.marks, {k: v["start"] for k, v in tm.scenes.items()}
    bars = [m["s2_cost"] - 0.2 + 0.3 * k for k in range(4)]
    return ([(1.0, "pop", 0.12), (m["s1_money"], "pop", 0.18)] + [(t, "tick", 0.12) for t in bars]
            + [(m["s2_calc"], "ding", 0.14), (m["s2_tax"], "blip", 0.16), (m["s2_ins"], "blip", 0.16),
               (m["s2_short"], "pop", 0.16), (S["s3"] + 0.2, "tick", 0.12), (m["s3_long"], "blip", 0.16),
               (m["s4_c1"], "tick", 0.16), (m["s4_c2"], "tick", 0.16)])


if __name__ == "__main__":
    tm = mc.Timing(NAME)
    prev = [float(x) for x in sys.argv[1:]] or [0.5, 1.6, 3.6, 7.0, 8.6, 11.5, 13.2, 14.5, 16.2, 18.0, 21.0]
    print("done", edu3.render(tm, build(tm), prev, sfx_events(tm)), tm.total)
