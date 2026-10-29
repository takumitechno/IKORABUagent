"""⑤ 転職エージェント、求人を断ると嫌われる？ → career_edu_3_05_agent.mp4 (timing in ../timing/career_edu_3_05_agent.json)."""
import sys

from PIL import ImageDraw

import edu3
import mc
from edu3 import RED, at, paste_mid
from mc import GREY, INK, TEAL, W, YELLOW, label

NAME = "career_edu_3_05_agent"
AI_NOTE = True
NOTE_XY = None
AGENT_BG, ME_BG = (236, 240, 246), (222, 245, 240)
NG_LINES = ["今回は結構です"]
OK_LINES = ["{土日休みを優先したい}ので、", "今回は見送ります"]


def chat_panel(title, w=900, h=560, head=None):
    """White chat window (schematic): title bar, then bubbles are added as separate overlays."""
    img, pad = mc.white_card(w, h, r=34)
    d = ImageDraw.Draw(img)
    d.line([(pad + 30, pad + 92), (pad + w - 30, pad + 92)], fill=(226, 230, 238), width=3)
    x = pad + 40
    if head is not None:
        img.alpha_composite(head, (x, pad + (92 - head.height) // 2))
        x += head.width + 18
    img.alpha_composite(label(title, 34, 900, INK), (x, pad + 24))
    t = edu3.edu.tag()
    img.alpha_composite(t, (pad + w - 36 - t.width, pad + (92 - t.height) // 2))
    return img


def msg(lines, side="agent", size=42, w=None, edge=None):
    body = edu3.multiline(lines, size, gap=1.34)
    bw = w or body.width + 64
    bh = body.height + 40
    im = mc.Image.new("RGBA", (bw + 8, bh + 8), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.rounded_rectangle((4, 4, bw + 3, bh + 3), 28, fill=AGENT_BG if side == "agent" else ME_BG,
                        outline=edge, width=5 if edge else 0)
    im.alpha_composite(body, (36, 24))
    return im


def mini_job():
    """Tiny schematic listing inside the chat (no readable details)."""
    w, h = 400, 150
    im = mc.Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.rounded_rectangle((2, 2, w - 3, h - 3), 22, fill=(255, 255, 255), outline=(210, 216, 226), width=3)
    im.alpha_composite(mc.pill("求人", 26), (22, 20))
    for k, frac in enumerate((0.85, 0.6)):
        d.rounded_rectangle((24, 78 + k * 30, 24 + (w - 48) * frac, 92 + k * 30), 7, fill=(216, 220, 228))
    return im


def agent_icon(size=56):
    im = mc.Image.new("RGBA", (size * 4, size * 4), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    s = size * 4
    d.ellipse((0, 0, s - 1, s - 1), fill=TEAL)
    d.ellipse((s * 0.34, s * 0.18, s * 0.66, s * 0.5), fill=(255, 255, 255))
    d.pieslice((s * 0.2, s * 0.52, s * 0.8, s * 1.1), 180, 360, fill=(255, 255, 255))
    return im.resize((size, size), mc.Image.LANCZOS)


def mismatch_card(w=900, h=260):
    img, pad = mc.white_card(w, h, r=32)
    left = edu3.multiline(["希望", "{土日休み}"], 52, align="center")
    right = edu3.multiline(["この求人", "シフト制"], 52, align="center")
    paste_mid(img, left, pad + w * 0.25, pad + h / 2)
    paste_mid(img, right, pad + w * 0.75, pad + h / 2)
    ne = label("≠", 96, 900, RED)
    paste_mid(img, ne, pad + w / 2, pad + h / 2)
    return img


def build(tm):
    scenes = []
    panel_cy = 1000

    # s1: warning badge — the agent sends a listing; turn it down and that's it?
    sid = "s1"
    t_card, t_q = tm.mark(sid, "s1_card"), tm.mark(sid, "s1_q")
    panel = chat_panel("担当エージェント", h=500, head=agent_icon())
    top = panel_cy - panel.height / 2 + 40
    ov = [mc.Telop(mc.emph(tm.tel["hook"]["text"], 80), W / 2, mc.TOP_CY, 0.0, tm.local(sid, tm.tel["hook"]["end"]),
                   anim="punch", dur_in=0.3, dur_out=0.25)]
    ov += edu3.badge_overlays("転職の思い込み", 1.1, big_cy=840, small_cy=612)
    a = msg(["こちらの求人はいかがですか？"])
    ov += [at(W / 2, panel_cy, panel, 1.1),
           at(90 + a.width / 2 + 40, top + 150, a, t_card - 0.2),
           at(90 + 200 + 40, top + 300, mini_job(), t_card + 0.1),
           at(890, top + 320, edu3.edu.qmark(96), t_q, anim="pop")]
    scenes.append(edu3.scene(tm, sid, ov, (0, "p3_phone")))

    # s2: a listing that doesn't match — no need to apply anyway
    sid = "s2"
    t_ok = tm.mark(sid, "s2_ok")
    ov = [edu3.edu.telop(tm, sid, "s2"),
          at(W / 2, 720, mismatch_card(), 0.15),
          at(W / 2, 900, edu3.edu.down_arrow(46), t_ok - 0.2),
          at(W / 2, 1030, edu3.edu.check_row("無理に応募{しなくていい}", checked=True, w=860, h=130, size=52), t_ok)]
    scenes.append(edu3.scene(tm, sid, ov, (0, "c_calendar")))

    # s3: how to say no — NG (no reason) vs with the reason
    sid = "s3"
    t_note, t_good = tm.mark(sid, "s3_ng_note"), tm.mark(sid, "s3_good")
    ng_panel = chat_panel("理由なし", h=240, head=edu3.ng_chip("NG例"))
    ok_panel = chat_panel("理由つき", h=300, head=edu3.chip("改善例", 34, bg=TEAL, fg=(255, 255, 255)))
    ng_cy, ok_cy = 680, 1020
    ng_msg = msg(NG_LINES, "me", 46)
    ok_msg = msg(OK_LINES, "me", 46, edge=TEAL)
    ov = [edu3.edu.telop(tm, sid, "s3"),
          at(W / 2, ng_cy, ng_panel, 0.15),
          at(990 - ng_msg.width / 2 - 40, ng_cy + 50, ng_msg, 0.35),
          at(300, ng_cy + 50, mc.pill("もったいない", 34, bg=(250, 226, 226), fg=RED, weight=900, padx=20, pady=9),
             t_note, anim="pop"),
          at(W / 2, ok_cy, ok_panel, t_good - 0.2),
          at(990 - ok_msg.width / 2 - 40, ok_cy + 50, ok_msg, t_good, anim="pop")]
    scenes.append(edu3.scene(tm, sid, ov, (0, "c_calendar_phone"), (t_good, "p5_home")))

    # s4: give the reason → the agent knows your conditions
    sid = "s4"
    t_share = tm.mark(sid, "s4_share")
    share, pad = mc.white_card(900, 210, r=30)
    ImageDraw.Draw(share).rounded_rectangle((pad, pad, pad + 16, pad + 210), 8, fill=YELLOW)
    paste_mid(share, label("共有される希望条件", 40, 700, GREY), pad + 450, pad + 58)
    paste_mid(share, edu3.chip("土日休みを優先", 44, padx=26, pady=12), pad + 450, pad + 140)
    ov = [edu3.edu.telop(tm, sid, "s4"),
          at(W / 2, 660, edu3.flow_box("見送る{理由}を伝える", 820, 124, 50), 0.15),
          at(W / 2, 790, edu3.edu.down_arrow(46), t_share - 0.3),
          at(W / 2, 960, share, t_share)]
    scenes.append(edu3.scene(tm, sid, ov, (0, "p4_meeting"), (t_share, "c_headset")))

    # s5: rather than taking every listing, say exactly what you want
    sid = "s5"
    t_big = tm.mark(sid, "s5_big")
    small, pad = mc.white_card(720, 110, r=26, alpha=180)
    paste_mid(small, label("紹介された求人を全部受ける", 42, 700, GREY), pad + 360, pad + 55)
    big, pad2 = mc.white_card(900, 300, r=32)
    ImageDraw.Draw(big).rounded_rectangle((pad2, pad2, pad2 + 16, pad2 + 300), 8, fill=YELLOW)
    paste_mid(big, edu3.text_img("自分の希望を{正確に伝える}", 58), pad2 + 450, pad2 + 90)
    chips = [edu3.chip(t, 34) for t in ("優先したい条件", "見送る理由")]
    x = pad2 + (900 - sum(c.width for c in chips) - 20) / 2
    for c in chips:
        big.alpha_composite(c, (int(x), pad2 + 180))
        x += c.width + 20
    ov = [edu3.edu.telop(tm, sid, "s5"),
          at(W / 2, 660, small, 0.2),
          at(W / 2, 770, mc.emph("より", 50), t_big - 0.4, anim="fade"),
          at(W / 2, 950, big, t_big)]
    scenes.append(edu3.scene(tm, sid, ov, (0, "c_calendar"), (t_big, "p3_desk")))
    return scenes


def sfx_events(tm):
    m, S = tm.marks, {k: v["start"] for k, v in tm.scenes.items()}
    return [(1.1, "pop", 0.12), (m["s1_card"] - 0.2, "blip", 0.16), (m["s1_q"], "pop", 0.14),
            (S["s2"] + 0.15, "pop", 0.12), (m["s2_ok"], "tick", 0.18), (S["s3"] + 0.35, "blip", 0.14),
            (m["s3_ng_note"], "tick", 0.16), (m["s3_good"], "blip", 0.16), (S["s4"] + 0.15, "pop", 0.12),
            (m["s4_share"], "pop", 0.16), (m["s5_big"], "pop", 0.16)]


if __name__ == "__main__":
    tm = mc.Timing(NAME)
    prev = [float(x) for x in sys.argv[1:]] or [0.5, 1.8, 3.5, 6.8, 10.0, 13.5, 16.0, 17.8, 20.0, 22.5]
    print("done", edu3.render(tm, build(tm), prev, sfx_events(tm)), tm.total)
