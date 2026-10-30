"""NEXT04 未経験歓迎の求人。「歓迎」と「必須」を混ぜない → NEXT04_requirements.mp4. CTA: 保存."""
import sys

from PIL import ImageDraw

import nx  # noqa: I001  (puts the shared tools on sys.path)
import mc
from mc import GREY, INK, TEAL, W, YELLOW, label
from nx import RED, at, paste_mid

NAME = "NEXT04_requirements"
AI_NOTE = False
NOTE_XY = None
MUST_X, NICE_X, COL_W, COL_TOP, COL_H = 285, 795, 450, 590, 560
ITEM_Y = (760, 900, 1040)


def listing(w=860, h=380):
    """Schematic listing: 未経験歓迎 chip, then the 必須条件 / 歓迎 rows (placeholder bars only)."""
    img, pad = nx.card(w, h)
    d = ImageDraw.Draw(img)
    img.alpha_composite(mc.pill("求人", 30), (pad + 40, pad + 30))
    t = nx.edu.tag()
    img.alpha_composite(t, (pad + w - 40 - t.width, pad + 32))
    chip = mc.pill("未経験歓迎", 50, bg=YELLOW, fg=INK, weight=900, padx=30, pady=14)
    img.alpha_composite(chip, (pad + 40, pad + 100))
    for k, name in enumerate(("必須条件", "歓迎・あれば尚可")):
        y = pad + 220 + k * 76
        img.alpha_composite(label(name, 38, 900, INK), (pad + 44, y))
        d.rounded_rectangle((pad + 380, y + 16, pad + w - 50, y + 36), 10, fill=(216, 220, 228))
    img.info["must_row"] = (pad + 26, pad + 208, pad + w - 26, pad + 280)
    return img


def column(head, color, w=COL_W, h=COL_H):
    img, pad = nx.card(w, h, fill=(255, 255, 255, 214))
    d = ImageDraw.Draw(img)
    d.rounded_rectangle((pad, pad, pad + w, pad + 92), 32, fill=color)
    d.rectangle((pad, pad + 60, pad + w, pad + 92), fill=color)
    paste_mid(img, label(head, 44 if len(head) < 6 else 38, 900, (255, 255, 255)), pad + w / 2, pad + 48)
    return img


def item(text, color, w=380, h=110, sub=None):
    img, pad = nx.card(w, h, r=24, edge=color)
    if sub:
        paste_mid(img, label(text, 42, 900, INK), pad + w / 2, pad + 40)
        paste_mid(img, label(sub, 28, 700, GREY), pad + w / 2, pad + 84)
    else:
        paste_mid(img, label(text, 44, 900, INK), pad + w / 2, pad + h / 2)
    return img


def board(t_cols):
    col_cy = COL_TOP + COL_H / 2
    return [at(MUST_X, col_cy, column("必須", RED), t_cols, anim="pop"),
            at(NICE_X, col_cy, column("歓迎・あれば尚可", TEAL), t_cols + 0.12, anim="pop")]


def build(tm):
    scenes = []

    # s1: headline — 未経験歓迎 catches the eye, but look at 必須条件
    sid = "s1"
    t_must = tm.mark(sid, "s2_must")
    card = listing()
    x0, y0, x1, y1 = card.info["must_row"]
    cy = 900
    ov = [nx.topic("未経験転職｜応募条件の読み方", cy=192), nx.telop(tm, sid, "hook", size=76, cy=412),
          at(W / 2, cy, card, 0.3, anim="pop"),
          mc.Highlight(nx.edu3.ring(x1 - x0, y1 - y0, r=20), W / 2 - card.width / 2 + (x0 + x1) / 2,
                       cy - card.height / 2 + (y0 + y1) / 2, t_must),
          at(W / 2 + 300, cy - card.height / 2 + (y0 + y1) / 2,
             mc.pill("ここを見る", 34, bg=RED, fg=(255, 255, 255), weight=900, padx=20, pady=9), t_must + 0.15, anim="pop")]
    scenes.append(nx.scene(tm, sid, ov, (0, "p3_phone")))

    # s2: sort the conditions into 必須 / 歓迎・あれば尚可
    sid = "s2"
    t_pc, t_lic, t_nice = tm.mark(sid, "s2_pc"), tm.mark(sid, "s2_lic"), tm.mark(sid, "s2_nice")
    ov = [nx.telop(tm, sid, "s2b"), nx.telop(tm, sid, "s2c")] + board(0.05) + [
        at(NICE_X, ITEM_Y[0], item("職種未経験OK", TEAL), 0.25, anim="down", dur_in=0.4),
        at(MUST_X, ITEM_Y[0], item("パソコン操作", RED), t_pc, anim="down", dur_in=0.4),
        at(MUST_X, ITEM_Y[1], item("免許", RED), t_lic, anim="down", dur_in=0.4),
        at(NICE_X, ITEM_Y[1], item("事務経験", TEAL, sub="あれば尚可"), t_nice, anim="down", dur_in=0.4),
        at(NICE_X, ITEM_Y[2] + 30, mc.pill("必須じゃない", 38, bg=(232, 247, 244), fg=TEAL, weight=900, padx=22,
                                           pady=10), t_nice + 0.5, anim="pop"),
        at(W / 2, 1210, nx.ex_tag("説明用の例"), 0.3, anim="fade")]
    scenes.append(nx.scene(tm, sid, ov, (0, "p4_desk"), (t_nice, "p1_pc")))

    # s3: read them separately before giving up
    sid = "s3"
    t_split = tm.mark(sid, "s3_split")
    ov = [nx.telop(tm, sid, "s3")] + board(-1.0) + [
        at(MUST_X, ITEM_Y[0], item("パソコン操作", RED), -1.0), at(MUST_X, ITEM_Y[1], item("免許", RED), -1.0),
        at(NICE_X, ITEM_Y[0], item("職種未経験OK", TEAL), -1.0),
        at(NICE_X, ITEM_Y[1], item("事務経験", TEAL, sub="あれば尚可"), -1.0),
        mc.Highlight(nx.edu3.ring(COL_W + 14, COL_H + 14, r=36, width=8), MUST_X, COL_TOP + COL_H / 2, 0.3),
        at(MUST_X, ITEM_Y[2] + 30, mc.pill("まずここを確認", 36, bg=(250, 226, 226), fg=RED, weight=900, padx=20,
                                           pady=10), 0.45, anim="pop"),
        at(NICE_X, ITEM_Y[2] + 30, mc.pill("必須じゃない", 38, bg=(232, 247, 244), fg=TEAL, weight=900, padx=22,
                                           pady=10), t_split - 0.4, anim="pop")]
    scenes.append(nx.scene(tm, sid, ov, (0, "p5_home")))

    # s4: CTA 保存
    sid = "s4"
    ov = [nx.telop(tm, sid, "s4"), at(W / 2, 880, nx.cta_save(300), 0.15, anim="punch", dur_in=0.3)]
    scenes.append(nx.scene(tm, sid, ov, (0, "p3_desk")))
    return scenes


def sfx_events(tm):
    m, S = tm.marks, {k: v["start"] for k, v in tm.scenes.items()}
    return [(0.3, "pop", 0.8), (m["s2_must"], "accent", 0.95),
            (S["s2"] + 0.05, "pop_lo", 0.7), (S["s2"] + 0.25, "pop_hi", 0.8), (m["s2_pc"], "hit", 0.75),
            (m["s2_lic"], "hit", 0.75), (m["s2_nice"], "pop_hi", 0.85), (m["s2_nice"] + 0.5, "click", 0.8),
            (S["s3"] + 0.3, "click", 0.8), (m["s3_split"] - 0.4, "ding", 0.8),
            (S["s4"] + 0.15, "cta", 1.0)]


if __name__ == "__main__":
    tm = mc.Timing(NAME)
    prev = [float(x) for x in sys.argv[1:]] or [0.2, 1.5, 3.8, 5.2, 7.5, 10.0, 12.0, 13.8, 16.0]
    print("done", nx.render(tm, build(tm), prev, sfx_events(tm)), tm.total)
