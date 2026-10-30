"""NEXT03 「接客しか経験がない」で、事務転職を諦める前に → NEXT03_customer_service.mp4. CTA: プロフィールのリンクへ."""
import sys

from PIL import Image, ImageDraw

import nx  # noqa: I001  (puts the shared tools on sys.path)
import mc
from mc import GREY, INK, TEAL, W, YELLOW, label
from nx import at, paste_mid

NAME = "NEXT03_customer_service"
AI_NOTE = False
NOTE_XY = None
L_X, R_X, ARROW_X = 230, 745, 458
ROWS = [(["要望を聞く"], ["お客様の要望を", "{ヒアリング}"]), (["注文を", "正確に受ける"], ["注文内容の", "{正確な受付・確認}"])]


def text_box(lines, w, h=160, size=44, edge=None, fill=(255, 255, 255, 246)):
    img, pad = nx.card(w, h, r=26, edge=edge, fill=fill)
    paste_mid(img, nx.edu3.multiline(lines, size, align="center", gap=1.32), pad + w / 2, pad + h / 2)
    return img


def head_chip(text, color):
    return mc.pill(text, 34, bg=color, fg=(255, 255, 255), weight=900, padx=22, pady=10)


def icon_box(icon, name, w=380, h=250):
    img, pad = nx.card(w, h, r=28)
    img.alpha_composite(icon, (pad + (w - icon.width) // 2, pad + 26))
    paste_mid(img, label(name, 48, 900, INK), pad + w / 2, pad + h - 52)
    return img


def build(tm):
    scenes = []

    # s1: headline — 接客 → 事務, and the experience is not zero
    sid = "s1"
    t_zero = tm.mark(sid, "s1_zero")
    ov = nx.opening(tm, sid, "未経験転職｜接客→事務")
    ov += [at(285, 860, mc.icon_card(nx.edu.store_icon(130, TEAL), "接客", w=330, h=320), 0.3, anim="pop"),
           at(W / 2, 860, mc.arrow(90, 54), 0.45, anim="left"),
           at(795, 860, mc.icon_card(nx.edu.desk_icon(130, TEAL), "事務", w=330, h=320), 0.55, anim="pop"),
           at(W / 2, 1120, mc.emph("経験は{ゼロじゃない}", 66), t_zero, anim="punch", dur_in=0.25)]
    scenes.append(nx.scene(tm, sid, ov, (0, "p5_serve")))

    # s2: what you did at the counter → how it reads on a 職務経歴書
    sid = "s2"
    t_listen, t_order, t_conv = tm.mark(sid, "s2_listen"), tm.mark(sid, "s2_order"), tm.mark(sid, "s2_conv")
    ov = [nx.telop(tm, sid, "s2a"), nx.telop(tm, sid, "s2b"),
          at(L_X, 610, head_chip("接客での経験", (90, 98, 116)), 0.1, anim="fade"),
          at(R_X, 610, head_chip("職務経歴書では", TEAL), t_conv, anim="fade"),
          at(980 - 40, 610, nx.ex_tag(), t_conv, anim="fade")]
    for k, ((left, right), t) in enumerate(zip(ROWS, (t_listen, t_order))):
        y = 760 + k * 200
        ov += [at(L_X, y, text_box(left, 360), t, anim="pop"),
               at(ARROW_X, y, mc.arrow(70, 44, YELLOW), t_conv + 0.1 * k, anim="left"),
               at(R_X, y, text_box(right, 460, edge=TEAL), t_conv + 0.15 + 0.2 * k, anim="pop")]
    scenes.append(nx.scene(tm, sid, ov, (0, "p7_suggest"), (t_order, "p3_bakery"), (t_conv, "p5_home")))

    # s3: what 接客 and 営業事務 share
    sid = "s3"
    t_c, t_o = tm.mark(sid, "s3_common"), tm.mark(sid, "s3_order")
    lines = Image.new("RGBA", (W, 1920), (0, 0, 0, 0))
    d = ImageDraw.Draw(lines)
    for x in (285, 795):
        d.line([(x, 790), (x, 860), (W / 2, 860), (W / 2, 900)], fill=(255, 255, 255), width=6)
    common, pad = nx.card(760, 230, edge=YELLOW)
    paste_mid(common, label("共通点", 40, 900, GREY), pad + 380, pad + 50)
    ov = [nx.telop(tm, sid, "s3"),
          at(285, 650, icon_box(nx.edu.store_icon(110, TEAL), "接客"), 0.1, anim="pop"),
          at(795, 650, icon_box(nx.edu.desk_icon(110, TEAL), "営業事務"), 0.25, anim="pop"),
          at(W / 2, 960, lines, t_c - 0.2, anim="fade"),
          at(W / 2, 1010, common, t_c - 0.1, anim="pop"),
          at(W / 2 - 150, 1050, nx.edu3.chip("顧客対応", 46, padx=26, pady=12), t_c, anim="pop"),
          at(W / 2 + 160, 1050, nx.edu3.chip("受発注", 46, padx=26, pady=12), t_o, anim="pop")]
    scenes.append(nx.scene(tm, sid, ov, (0, "p1_support")))

    # s4: the PC skills are a separate check
    sid = "s4"
    t_chk = tm.mark(sid, "s4_check")
    box, pad = nx.card(880, 230)
    box.alpha_composite(nx.edu.desk_icon(130, TEAL), (pad + 40, pad + 50))
    box.alpha_composite(nx.text_img("{パソコンスキル}", 60), (pad + 200, pad + 52))
    box.alpha_composite(label("接客経験とは別に確認", 40, 700, GREY), (pad + 204, pad + 138))
    ov = [nx.telop(tm, sid, "s4"),
          at(W / 2, 850, box, 0.1, anim="pop"),
          at(W / 2 + 360, 760, nx.edu.check_box(84, False), 0.3, t_chk, anim="fade"),
          at(W / 2 + 360, 760, nx.edu.check_box(84, True), t_chk, anim="pop")]
    scenes.append(nx.scene(tm, sid, ov, (0, "p1_pc")))

    # s5: CTA — プロフィールのリンクへ
    sid = "s5"
    ov = [nx.telop(tm, sid, "s5"), at(W / 2, 880, nx.cta_link(), 0.25, anim="punch", dur_in=0.3)]
    scenes.append(nx.scene(tm, sid, ov, (0, "p5_teach")))
    return scenes


def sfx_events(tm):
    m, S = tm.marks, {k: v["start"] for k, v in tm.scenes.items()}
    return [(0.3, "hit", 0.8), (0.55, "pop_hi", 0.7), (m["s1_zero"], "accent", 0.9),
            (m["s2_listen"], "pop", 0.8), (m["s2_order"], "pop_hi", 0.8), (m["s2_conv"], "swipe", 0.8),
            (m["s2_conv"] + 0.15, "click", 0.8), (m["s2_conv"] + 0.35, "click", 0.8),
            (S["s3"] + 0.1, "pop_lo", 0.7), (m["s3_common"], "pop", 0.85), (m["s3_order"], "pop_hi", 0.85),
            (S["s4"] + 0.1, "pop_lo", 0.7), (m["s4_check"], "ding", 0.85),
            (S["s5"] + 0.25, "cta", 1.0)]


if __name__ == "__main__":
    tm = mc.Timing(NAME)
    prev = [float(x) for x in sys.argv[1:]] or [0.2, 1.5, 3.6, 5.5, 7.0, 9.5, 12.0, 13.2, 15.2, 18.0]
    print("done", nx.render(tm, build(tm), prev, sfx_events(tm)), tm.total)
