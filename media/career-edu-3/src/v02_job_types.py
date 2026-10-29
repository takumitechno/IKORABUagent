"""② 接客からの転職、事務だけで探すな？ → career_edu_3_02_job_types.mp4 (timing in ../timing/career_edu_3_02_job_types.json)."""
import sys

from PIL import Image, ImageDraw

import edu3
import mc
from edu3 import at, paste_mid
from mc import GREY, INK, TEAL, W, YELLOW, label

NAME = "career_edu_3_02_job_types"
AI_NOTE = True
NOTE_XY = None
ROOT_CY, JOB_CY, TAG_CY = 640, 945, 1160
JOB_X = (190, 540, 890)
JOBS = [("一般事務", "PC・書類", edu3.edu.desk_icon), ("カスタマー\nサポート", "問い合わせ対応", edu3.headset_icon),
        ("法人営業", "企業に提案", edu3.deal_icon)]
TAGS = ["書類・PC作業", "電話対応", "営業目標"]


def job_box(name, sub, icon, w=310, h=330):
    img, pad = mc.white_card(w, h, r=28)
    img.alpha_composite(icon(110, TEAL), (pad + (w - 110) // 2, pad + 26))
    lines = name.split("\n")
    for k, ln in enumerate(lines):
        paste_mid(img, label(ln, 44, 900, INK), pad + w / 2, pad + 172 + k * 50 - (len(lines) - 1) * 10)
    paste_mid(img, label(sub, 28, 700, GREY), pad + w / 2, pad + h - 36)
    return img


def unknown_box(w=310, h=330):
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


def root_card(w=560, h=130):
    img, pad = mc.white_card(w, h, r=30)
    img.alpha_composite(edu3.edu.store_icon(86, TEAL), (pad + 40, pad + (h - 86) // 2))
    paste_mid(img, label("接客経験", 56, 900, INK), pad + 330, pad + h / 2)
    return img


def tree():
    """White connector lines from the root card down to the three job cards."""
    im = Image.new("RGBA", (W, 1920), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    mid = (ROOT_CY + 65 + JOB_CY - 165) / 2
    d.line([(540, ROOT_CY + 65), (540, mid)], fill=(255, 255, 255), width=6)
    d.line([(JOB_X[0], mid), (JOB_X[2], mid)], fill=(255, 255, 255), width=6)
    for x in JOB_X:
        d.line([(x, mid), (x, JOB_CY - 165)], fill=(255, 255, 255), width=6)
    return im


def tag_chip(text):
    return mc.pill(text, 34, bg=YELLOW, fg=INK, weight=900, padx=20, pady=10)


def build(tm):
    scenes = []

    # s1: warning badge — 接客 → 事務 only?
    sid = "s1"
    t_jimu = tm.mark(sid, "s1_jimu")
    t_q = tm.mark(sid, "s1_q")
    ov = [mc.Telop(mc.emph(tm.tel["hook"]["text"], 80), W / 2, mc.TOP_CY, 0.0, tm.local(sid, tm.tel["hook"]["end"]),
                   anim="punch", dur_in=0.3, dur_out=0.25)]
    ov += edu3.badge_overlays("転職の思い込み", t_jimu - 0.35, big_cy=840, small_cy=612)
    ov += [at(270, 900, mc.icon_card(edu3.edu.store_icon(140, TEAL), "接客", w=340, h=340), t_jimu - 0.3),
           at(540, 900, mc.arrow(110, 64), t_jimu - 0.1, anim="left"),
           at(810, 900, mc.icon_card(edu3.edu.desk_icon(140, TEAL), "事務", w=340, h=340), t_jimu),
           at(810, 690, mc.emph("一択？", 60), t_jimu + 0.35, anim="pop"),
           at(W / 2, 1150, mc.emph("ほかの道は{ない}？", 60), t_q, anim="pop")]
    scenes.append(edu3.scene(tm, sid, ov, (0, "p5_serve"), (t_q, "p7_suggest")))

    # s2: 接客経験 branches out — 一般事務, then カスタマーサポート and 法人営業
    sid = "s2"
    t_more, t_cs, t_sales = tm.mark(sid, "s2_more"), tm.mark(sid, "s2_cs"), tm.mark(sid, "s2_sales")
    reveal = [0.45, t_cs, t_sales]
    ov = [edu3.edu.telop(tm, sid, "s2"), at(W / 2, ROOT_CY, root_card(), 0.15),
          at(W / 2, 960, tree(), 0.3, anim="fade")]
    for k, ((name, sub, icon), x) in enumerate(zip(JOBS, JOB_X)):
        if k:
            ov.append(at(x, JOB_CY, unknown_box(), t_more, reveal[k] - 0.05, anim="pop"))
        ov.append(at(x, JOB_CY, job_box(name, sub, icon), reveal[k], anim="pop"))
    ov += [mc.Highlight(edu3.ring(326, 346, r=32), JOB_X[1], JOB_CY, t_cs, t_sales - 0.05),
           mc.Highlight(edu3.ring(326, 346, r=32), JOB_X[2], JOB_CY, t_sales)]
    scenes.append(edu3.scene(tm, sid, ov, (0, "p1_pc"), (t_cs, "c_headset"), (t_sales, "p4_explain")))

    # s3: the work differs — a tag under each job
    sid = "s3"
    tags_at = [0.35, tm.mark(sid, "s3_phone"), tm.mark(sid, "s3_goal")]
    ov = [edu3.edu.telop(tm, sid, "s3"), at(W / 2, ROOT_CY, root_card(), -1.0), at(W / 2, 960, tree(), -1.0)]
    for (name, sub, icon), x, tag, t in zip(JOBS, JOB_X, TAGS, tags_at):
        ov.append(at(x, JOB_CY, job_box(name, sub, icon), -1.0))
        ov.append(at(x, TAG_CY, tag_chip(tag), t, anim="pop"))
    scenes.append(edu3.scene(tm, sid, ov, (0, "p6_office"), (tags_at[2], "p4_meeting")))

    # s4: start from what you want to change, not from a job title
    sid = "s4"
    t_c2, t_res = tm.mark(sid, "s4_c2"), tm.mark(sid, "s4_result")
    ov = [edu3.edu.telop(tm, sid, "s4a"), edu3.edu.telop(tm, sid, "s4b"),
          at(W / 2, 590, edu3.edu.dark_tag("変えたい条件の例"), 0.1),
          at(290, 760, cond_card(["立ち仕事を", "{減らしたい}"]), 0.2),
          at(790, 760, cond_card(["収入を", "{上げたい}"]), t_c2),
          at(W / 2, 930, edu3.edu.down_arrow(46), t_res - 0.1),
          at(W / 2, 1100, result_card(), t_res)]
    scenes.append(edu3.scene(tm, sid, ov, (0, "p3_bakery"), (t_res, "p4_desk")))
    return scenes


def cond_card(lines, w=440, h=210):
    img, pad = mc.white_card(w, h, r=30)
    paste_mid(img, edu3.multiline(lines, 52, align="center"), pad + w / 2, pad + h / 2)
    return img


def result_card(w=900, h=230):
    img, pad = mc.white_card(w, h, r=30)
    ImageDraw.Draw(img).rounded_rectangle((pad, pad, pad + 16, pad + h), 8, fill=YELLOW)
    paste_mid(img, edu3.text_img("{探す職種}も変わる", 56), pad + w / 2, pad + 66)
    chips = [edu3.chip(t, 32) for t in ("一般事務", "カスタマーサポート", "法人営業")]
    x = pad + (w - sum(c.width for c in chips) - 28) / 2
    for c in chips:
        img.alpha_composite(c, (int(x), pad + 140))
        x += c.width + 14
    return img


def sfx_events(tm):
    m, S = tm.marks, {k: v["start"] for k, v in tm.scenes.items()}
    return [(m["s1_jimu"] - 0.3, "pop", 0.12), (m["s1_jimu"], "pop", 0.14), (m["s1_q"], "blip", 0.16),
            (S["s2"] + 0.45, "pop", 0.12), (m["s2_more"], "tick", 0.14), (m["s2_cs"], "pop", 0.14),
            (m["s2_sales"], "pop", 0.14), (S["s3"] + 0.35, "tick", 0.14), (m["s3_phone"], "tick", 0.16),
            (m["s3_goal"], "tick", 0.16), (S["s4"] + 0.2, "pop", 0.12), (m["s4_c2"], "pop", 0.12),
            (m["s4_result"], "pop", 0.16)]


if __name__ == "__main__":
    tm = mc.Timing(NAME)
    prev = [float(x) for x in sys.argv[1:]] or [0.5, 2.2, 5.0, 7.5, 10.5, 13.5, 15.8, 17.5, 20.0, 21.5, 24.0]
    print("done", edu3.render(tm, build(tm), prev, sfx_events(tm)), tm.total)
