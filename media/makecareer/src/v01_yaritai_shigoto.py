"""① 転職したい。でも、やりたい仕事がない → 01_yaritai_shigoto.mp4 (timing in ../timing/01_yaritai_shigoto.json)."""
import sys

from PIL import Image, ImageDraw

import mc
from mc import GREY, INK, TEAL, W, YELLOW, Telop

BAKERY = "makecareer/img/v1_bakery_handing_bag.jpg"
PHONE = "makecareer/img/v1_home_evening_phone.jpg"
DESK = "makecareer/img/v1_home_morning_notebook.jpg"
BAKERY_MASKS = [(0.80, 0.71, 1.0, 0.81), (0.86, 0.92, 1.0, 1.0), (0.57, 0.90, 0.79, 0.95)]   # price cards
PHONE_MASKS = [(0.80, 0.76, 0.90, 0.81)]                                                   # laptop logo
DESK_MASKS = [(0.15, 0.78, 0.30, 0.85)]                                                    # laptop logo


def jobs_phone(saved=()):
    """Phone with three schematic job cards (no company, salary or conditions)."""
    img, (x0, y0, x1, y1) = mc.phone_frame(460, 720, r=60)
    tag = mc.pill("求人を探す（イメージ）", 22, bg=(226, 230, 238), fg=GREY, weight=700, padx=16, pady=8)
    img.alpha_composite(tag, (x0 + 22, y0 + 40))
    for k in range(3):
        c = mc.job_card(w=380, h=130, saved=k in saved)
        img.alpha_composite(c, (x0 - 20, y0 + 96 + k * 172))
    return img


def shift_grid(w=600, h=150):
    """Mini shift chart: rest days fall on different weekdays every week (schematic, no times)."""
    im = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    days = "月火水木金土日"
    cw = w / 7
    f = mc.font(26, 700)
    for i, ch in enumerate(days):
        d.text((i * cw + (cw - f.getlength(ch)) / 2, 0), ch, font=f, fill=GREY)
    rest = [{1, 5}, {3}, {0, 6}]
    for r, off in enumerate(rest):
        for i in range(7):
            y = 40 + r * 38
            fill = (226, 230, 238) if i in off else (TEAL if r != 1 or i % 2 else (46, 196, 182))
            d.rounded_rectangle((i * cw + 6, y, (i + 1) * cw - 6, y + 28), 8, fill=fill)
    return im


def topic_card(word, rest, extra, w=860, h=340, marked=False):
    """「休日を変えたい」 style card; `marked` puts a yellow marker under the key word."""
    img, pad = mc.white_card(w, h, r=32)
    d = ImageDraw.Draw(img)
    f = mc.font(60, 900)
    x, y = pad + 48, pad + 36
    if marked:
        d.rounded_rectangle((x - 8, y + 44, x + f.getlength(word) + 8, y + 82), 10, fill=YELLOW)
    d.text((x, y), word, font=f, fill=INK)
    d.text((x + f.getlength(word), y), rest, font=f, fill=INK)
    img.alpha_composite(extra, (pad + 48, pad + 140))
    return img


def build(tm):
    bakery = mc.Window(BAKERY, (0.08, 0.27, 1.0, 0.70), look="warm", masks=BAKERY_MASKS)
    phone = mc.Window(PHONE, (0.0, 0.31, 1.0, 0.75), look="home", masks=PHONE_MASKS)
    phone_bg = mc.Window(PHONE, (0, 0, 1, 1), look="home", masks=PHONE_MASKS, bg_blur=30, bg_dark=0.5)
    desk_bg = mc.Window(DESK, (0, 0, 1, 1), look="warm", masks=DESK_MASKS, bg_blur=30, bg_dark=0.38)
    scenes = []

    # s1: after a shift → at home looking at jobs → saved, but no further step
    sid, d = "s1", tm.dur("s1")
    t_home, t_phone, t_save = tm.mark(sid, "s1_home"), tm.mark(sid, "s1_phone"), tm.mark(sid, "s1_save")
    ph = jobs_phone()
    ov = [tm.telop(sid, "hook", size=80), Telop(ph, W / 2, 880, t_phone + 0.05, 99, anim="up", dur_in=0.35)]
    for k in range(2):  # two listings get saved, nothing gets applied for
        ov.append(Telop(jobs_phone(saved=set(range(k + 1))), W / 2, 880, t_save + 0.45 * k, 99, anim="fade", dur_in=0.2))
    scenes.append(tm.scene(sid, mc.shots([(0.0, bakery.shot(t_home + 0.4, 1.0, 1.04, (0.5, 0.45))),
                                         (t_home, phone.shot(t_phone - t_home + 0.4, 1.0, 1.05, (0.5, 0.5), seed=1.0)),
                                         (t_phone, phone_bg.backdrop(d - t_phone))]), ov, trans="cut"))

    # s2: what to change — rest days, or the work itself (no right answer marked)
    sid, d = "s2", tm.dur("s2")
    thumb = mc.Window(BAKERY, (0.12, 0.27, 0.92, 0.70), box=(0, 0, 300, 150), look="warm", masks=BAKERY_MASKS)
    tb = thumb.crop.resize((300, 150), Image.LANCZOS).convert("RGBA")
    tb.putalpha(mc.rounded_mask(300, 150, 18))
    work = Image.new("RGBA", (760, 160), (0, 0, 0, 0))
    work.alpha_composite(tb, (0, 0))
    work.alpha_composite(mc.label("接客中のイメージ", 34, 700, GREY), (330, 54))
    grid = shift_grid()
    cards = [(topic_card("休日", "を変えたい", grid), topic_card("休日", "を変えたい", grid, marked=True), 650,
              0.15, tm.mark(sid, "s2_rest")),
             (topic_card("仕事内容", "を変えたい", work), topic_card("仕事内容", "を変えたい", work, marked=True), 1035,
              tm.mark(sid, "s2_work"), tm.mark(sid, "s2_work_hl"))]
    ov = []
    for plain, marked, cy, t_in, t_hl in cards:
        ov.append(Telop(plain, W / 2, cy, t_in, 99, anim="up", dur_in=0.35))
        ov.append(Telop(marked, W / 2, cy, t_hl, 99, anim="fade", dur_in=0.25))
    scenes.append(tm.scene(sid, phone_bg.backdrop(d), ov))

    # s3: the note starts from what to change; the "希望職種" line can stay empty
    sid, d = "s3", tm.dur("s3")
    page, ppad = mc.notebook(860, 600, title="今、変えたいこと", lines_from=230, gap=104)
    pcy = 880
    py0 = pcy - page.height / 2 + ppad
    px0 = W / 2 - 860 / 2
    ov = [tm.telop(sid, "s3", size=80), Telop(page, W / 2, pcy, 0.1, 99, anim="up", dur_in=0.4)]
    for k, text in enumerate(("休日", "仕事内容")):
        line = mc.bullet_line(text, 54)
        ov.append(Telop(line, px0 + 150 + line.width / 2, py0 + 190 + k * 104, 0.45 + 0.25 * k, 99, anim="left"))
    blank = Image.new("RGBA", (620, 90), (0, 0, 0, 0))
    bd = ImageDraw.Draw(blank)
    bd.text((0, 18), "希望職種", font=mc.font(44, 700), fill=GREY)
    bd.rounded_rectangle((200, 6, 610, 84), 14, outline=(170, 178, 192), width=4)
    for x in range(220, 590, 30):
        bd.line([(x, 45), (x + 14, 45)], fill=(200, 205, 214), width=3)
    ov.append(Telop(blank, px0 + 150 + 310, py0 + 420, tm.mark(sid, "s3_blank"), 99, anim="up"))
    ov.append(Telop(mc.pill("未記入でOK", 30, bg=(232, 236, 242), fg=GREY, weight=700, padx=18, pady=8),
                    px0 + 150 + 470, py0 + 500, tm.mark(sid, "s3_blank") + 0.3, 99, anim="up"))
    scenes.append(tm.scene(sid, desk_bg.backdrop(d), ov))

    # s4: past work + what you want next → choosing which jobs to look at
    sid, d = "s4", tm.dur("s4")
    plus = mc.label("＋", 64, 900, (255, 255, 255))
    down = mc.arrow(110, 54).rotate(-90, expand=True)
    ov = [tm.telop(sid, "s4", size=80),
          Telop(mc.flow_card("これまでの仕事", 760, 120, mc.bag_icon(70), 50), W / 2, 590, 0.35, 99, anim="up"),
          Telop(plus, W / 2, 705, 0.6, 99, anim="pop"),
          Telop(mc.flow_card("これからの希望", 760, 120, mc.doc_icon(70), 50), W / 2, 820, 0.65, 99, anim="up"),
          Telop(down, W / 2, 945, tm.mark(sid, "s4_jobs") - 0.1, 99, anim="up"),
          Telop(mc.flow_card("求人選び", 760, 140, mc.search_icon(70, TEAL), 58, accent=YELLOW), W / 2, 1085,
                tm.mark(sid, "s4_jobs"), 99, anim="up", dur_in=0.35)]
    ov += [mc.Highlight(mc.accent_frame(760, 120), W / 2, 590, tm.mark(sid, "s4_prev")),
           mc.Highlight(mc.accent_frame(760, 120), W / 2, 820, tm.mark(sid, "s4_hope"))]
    scenes.append(tm.scene(sid, desk_bg.backdrop(d), ov))

    # s5: closing screen
    scenes.append(mc.cta_scene(tm, "s5", "{次の仕事}を、\n一緒に考える", badge="無料相談",
                               chips=("これまでの仕事", "これからの希望")))
    return scenes


def sfx_events(tm):
    m, S = tm.marks, {k: v["start"] for k, v in tm.scenes.items()}
    return [(m["s1_phone"], "pop", 0.28), (m["s1_save"], "tick", 0.3), (m["s1_save"] + 0.45, "tick", 0.3),
            (S["s2"] + 0.15, "pop", 0.24), (m["s2_work"], "pop", 0.24), (m["s2_rest"], "blip", 0.16),
            (m["s2_work_hl"], "blip", 0.16), (S["s3"] + 0.1, "paper", 0.4), (S["s3"] + 0.45, "tick", 0.28),
            (S["s3"] + 0.7, "tick", 0.28), (m["s3_blank"], "tick", 0.28), (S["s4"] + 0.35, "pop", 0.22),
            (S["s4"] + 0.65, "pop", 0.22), (m["s4_jobs"], "pop", 0.26)]


if __name__ == "__main__":
    tm = mc.Timing("01_yaritai_shigoto")
    S = {k: v["start"] for k, v in tm.scenes.items()}
    prev = [float(x) for x in sys.argv[1:]] or [0.8, 2.6, 5.8, 8.2, 10.9, 13.5, 16.0, 19.0, 22.5, 26.5]
    out = mc.render(tm, build(tm), prev, sfx_events(tm), lift_at=S["s4"])
    print("done", out, tm.total)
