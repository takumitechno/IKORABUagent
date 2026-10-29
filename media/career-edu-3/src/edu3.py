"""転職の教育ショート 第三弾（career_edu_3_*）: project paths, scene plans and the parts this series adds.

Same look and tools as the second series (../../career-edu-2/src/edu.py: full-screen photos that change every
scene, white diagram cards, telops at the top, subtitles at the bottom). This series opens on a warning badge
with a clear alert sound, and its BGM is a quiet minor loop with a soft hat pulse (a little tension, not drama).

    python3 edu3.py fit career_edu_3_01_holidays      # timing/<name>.json from the narration take
    python3 edu3.py preview v01_holidays 0.5 3.0 6.0  # contact sheet in out/preview/
    python3 edu3.py check career_edu_3_01_holidays    # inspect the rendered MP4
    python3 v01_holidays.py                           # render out/career_edu_3_01_holidays.mp4
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
os.environ.setdefault("MC_PROJECT", ROOT)
sys.path.insert(0, os.path.join(os.path.dirname(ROOT), "career-edu-2", "src"))

from PIL import Image, ImageDraw  # noqa: E402

import edu  # noqa: E402
import mc  # noqa: E402
from edu import LINE, ORANGE, SOFT, at, paste_mid, text_img  # noqa: E402,F401
from mc import GREY, INK, TEAL, W, YELLOW, clamp, font, label, pill  # noqa: E402,F401

RED = (226, 78, 78)
NG_BG = (250, 236, 236)
OK_BG = (232, 247, 244)
TAIL = 1.5
AI_NOTE = False       # no on-screen AI-image notice (the platforms' AI-content label is set when posting instead)
OPENING_ALERT = 1.0   # warning sound on the first frame, about as loud as the narration
# quiet minor loop: Am(add9) - Fmaj7 - Dm7 - E7 (a little unresolved, for "watch out" topics)
TENSE = [(["A2", "C3", "E3", "B3"], "A1"), (["F2", "A2", "C3", "E3"], "F1"),
         (["D2", "F2", "A2", "C3"], "D1"), (["E2", "G#2", "B2", "D3"], "E1")]
PULSE = 0.55          # soft eighth-note hats under the keys


def plan(scenes, telops, marks, tail=TAIL):
    return dict(scenes=scenes, telops=telops, marks=marks, tail=tail)


PLANS = {
    "career_edu_3_01_holidays": plan(
        [("s1", "h1", "警告バッジ→「週休2日＝毎週2日休み？」"), ("s2", "p1a", "希望は土日休み／求人は「週休2日」"),
         ("s3", "p2a", "週休2日制のカレンダー例（週2日休みは月1回）"),
         ("s4", "p3a", "完全週休2日制との比較→土日とは限らない"), ("s5", "p5a", "確認する3項目→締め")],
        [("warn", "転職の落とし穴", ("scene", "s1", "h2")),   # drawn as the warning badge
         ("hook", "週休2日＝毎週2日休み、\n{じゃない？}", ("scene", "s1")),
         ("s2a", "土日休み{目当て}の転職", ("cue", "p1a", "p1b")),
         ("s2b", "“週休2日”だけで\n{選ぶと危ない}", ("cue", "p1b")),
         ("s3a", "{週休2日制}の場合", ("scene", "s3", "p2b")),
         ("s3b", "月1回でも{週2日休み}なら\n“週休2日制”", ("cue", "p2b")),
         ("s4a", "毎週2日休み＝\n{完全週休2日制}", ("scene", "s4", "p4"), ["p3a", "p3b"]),
         ("s4b", "完全でも、\n{土日休みとは限らない}", ("cue", "p4"), ["p4"]),
         ("s5a", "求人で{確認すること}", ("scene", "s5", "p6")),
         ("s5b", "“週休2日”の文字だけで\n{決めない}", ("cue", "p6"))],
        [("s1_week", "h2", None), ("s2_warn", "p1b", None), ("s3_week1", "p2b", None), ("s3_ok", "p2b", "該当"),
         ("s4_name", "p3b", None), ("s4_shift", "p4", "土日"), ("s5_c1", "p5a", "完全"), ("s5_c2", "p5b", "曜日"),
         ("s5_c3", "p5b", "年間")]),
    "career_edu_3_02_job_types": plan(
        [("s1", "h1", "警告バッジ→接客から事務だけ？"), ("s2", "p2", "接客経験から3つの職種へ"),
         ("s3", "p4", "仕事内容はそれぞれ違う"), ("s4", "p5a", "変えたい条件→探す職種／締め")],
        [("hook", "接客辞めたい＝\n{事務一択？}", ("scene", "s1"), ["h1"]),
         ("s2", "接客経験を{活かせる仕事}", ("scene", "s2")),
         ("s3", "仕事内容は{それぞれ違う}", ("scene", "s3")),
         ("s4a", "{変えたい条件}は？", ("scene", "s4", "p6")),
         ("s4b", "職種名ではなく、\n{“変えたい条件”から考える}", ("cue", "p6"))],
        [("s1_jimu", "h1", "事務"), ("s1_q", "p1b", None), ("s2_more", "p2", "ほか|他"), ("s2_cs", "p3a", None),
         ("s2_sales", "p3b", None), ("s3_phone", "p4", "電話"), ("s3_goal", "p4", "営業目標|目標"),
         ("s4_c2", "p5b", None), ("s4_result", "p6", None)]),
    "career_edu_3_03_interview_reason": plan(
        [("s1", "p1", "警告バッジ→「給料が安いから」は落ちる？"), ("s2", "p3", "収入の改善も転職理由の一つ"),
         ("s3", "p4a", "NG例と改善例"), ("s4", "p6", "改善例＋応募先を選んだ理由"), ("s5", "p7a", "締め：次に実現したいこと")],
        [("hook", "“給料が安い”って\n面接で言うと{落ちる？}", ("scene", "s1"), ["p1", "p2"]),
         ("s2", "収入の改善も\n{転職理由の一つ}", ("scene", "s2"), ["p3"]),
         ("s3", "NG例と{改善例}", ("scene", "s3")),
         ("s4", "{＋応募先を選んだ理由}", ("scene", "s4")),
         ("s5", "不満だけで終わらせず、\n{“次に何を実現したいか”}\nまで伝える", ("scene", "s5"))],
        [("s1_q", "p2", None), ("s2_ok", "p3", "転職理由"), ("s3_ng_note", "p4b", None), ("s3_good", "p5", None),
         ("s4_plus", "p6", "応募先|選んだ"), ("s5_next", "p7b", None)]),
    "career_edu_3_04_savings": plan(
        [("s1", "p1", "警告バッジ→貯金60万円で何か月？"), ("s2", "p3", "残高の棒グラフ（生活費 月20万円）"),
         ("s3", "p5", "転職活動が長引く可能性"), ("s4", "p6a", "締め：退職後の支払いまで確認")],
        [("hook", "貯金60万円で辞めたら、\n{何か月もつ？}", ("scene", "s1"), ["p2"]),
         ("s2a", "生活費だけなら\n{単純計算で3か月}", ("scene", "s2", "p4a")),
         ("s2b", "退職後の支払いで\n{もっと短く}", ("cue", "p4a")),
         ("s3", "転職活動が{長引く}ことも", ("scene", "s3")),
         ("s4", "生活費だけで計算しない\n{退職後の支払いまで確認}", ("scene", "s4"))],
        [("s1_money", "p2", "貯金|60"), ("s2_cost", "p3", "月20|20万"), ("s2_calc", "p3", "単純"),
         ("s2_tax", "p4a", "住民税"), ("s2_ins", "p4a", "保険料"), ("s2_short", "p4b", None),
         ("s3_long", "p5", "終わる|保証"), ("s4_c1", "p6b", "生活費"), ("s4_c2", "p6b", "退職後")], tail=2.0),
    "career_edu_3_05_agent": plan(
        [("s1", "p1", "警告バッジ→紹介された求人を断ったら？"), ("s2", "p3", "合わない求人は無理に応募しない"),
         ("s3", "p4", "断り方のNG例と改善例（チャット）"), ("s4", "p6", "理由→希望条件が共有される"),
         ("s5", "p7", "締め：希望を正確に伝える")],
        [("hook", "求人を断ったら、\n{もう紹介されない？}", ("scene", "s1"), ["p2"]),
         ("s2", "合わない求人に\n{無理に応募しなくていい}", ("scene", "s2")),
         ("s3", "断るときの{伝え方}", ("scene", "s3")),
         ("s4", "理由を伝えると\n{希望条件が共有される}", ("scene", "s4")),
         ("s5", "全部受けるより、\n{希望を正確に伝える}", ("scene", "s5"))],
        [("s1_card", "p1", "求人|旧人"), ("s1_q", "p2", None), ("s2_ok", "p3", "無理"),
         ("s3_ng_note", "p4", "もったいない"), ("s3_good", "p5", None), ("s4_share", "p6", "希望"),
         ("s5_big", "p7", "自分|希望")]),
}


# ---------------------------------------------------------------- background stills (media/IMAGES.md)
edu.IMG.update({
    "c_headset": ("career-edu-3/img/e3_cs_headset.jpg", [(0.0, 0.28, 0.24, 0.41), (0.0, 0.53, 0.17, 0.96),
                                                          (0.31, 0.29, 0.43, 0.40), (0.50, 0.82, 0.72, 0.93)]),
    "c_interview": ("career-edu-3/img/e3_interview.jpg", [(0.62, 0.18, 0.76, 0.31)]),
    "c_budget": ("career-edu-3/img/e3_home_budget.jpg", [(0.79, 0.65, 1.0, 0.71), (0.62, 0.685, 0.90, 0.725)]),
    "c_calendar": ("career-edu-3/img/e3_home_calendar.jpg", [(0.70, 0.555, 0.85, 0.615)]),
})
FACE = {   # crops whose vertical centre keeps the face (or the hands) in view
    "c_headset": (0, 0.32, 1, 0.52), "c_headset_hands": (0, 0.66, 1, 0.86),
    "c_interview": (0, 0.31, 1, 0.51), "c_interview_back": (0, 0.55, 1, 0.75),
    "c_budget": (0, 0.24, 1, 0.44), "c_budget_hands": (0, 0.62, 1, 0.82),
    "c_calendar": (0, 0.24, 1, 0.44), "c_calendar_phone": (0, 0.48, 1, 0.68),
    "p3_phone": (0, 0.395, 1, 0.61), "p3_desk": (0, 0.355, 1, 0.57), "p4_desk": (0, 0.315, 1, 0.53),
    "p4_explain": (0, 0.235, 1, 0.45), "p4_meeting": (0, 0.335, 1, 0.55), "p1_pc": (0, 0.415, 1, 0.63),
    "p1_support": (0, 0.26, 1, 0.475), "p5_street": (0, 0.265, 1, 0.48), "p5_home": (0, 0.315, 1, 0.53),
    "p5_serve": (0, 0.305, 1, 0.52), "p5_teach": (0, 0.305, 1, 0.52), "p6_office": (0, 0.335, 1, 0.55),
    "p7_suggest": (0, 0.28, 1, 0.495), "p3_bakery": (0, 0.295, 1, 0.51),
}


def heads(*items):
    """[(local start, key), ...] → edu.scene head list; '_hands'/'_back' style keys pick another crop of a still."""
    out = []
    for t, key in items:
        base = key if key in edu.IMG else key.rsplit("_", 1)[0]
        out.append((t, base, FACE[key]))
    return out


def scene(tm, sid, overlays, *items):
    return edu.scene(tm, sid, overlays, head=heads(*items))


# ---------------------------------------------------------------- parts
def warn_icon(size=120, color=YELLOW):
    s = size * 4
    im = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.rounded_rectangle((0, 0, s - 1, s - 1), 0, fill=None)
    d.polygon([(s * 0.5, s * 0.06), (s * 0.97, s * 0.9), (s * 0.03, s * 0.9)], fill=color)
    d.rounded_rectangle((s * 0.455, s * 0.33, s * 0.545, s * 0.64), s * 0.04, fill=INK)
    d.ellipse((s * 0.45, s * 0.7, s * 0.55, s * 0.8), fill=INK)
    return im.resize((size, size), Image.LANCZOS)


def warn_badge(text, size=60):
    """Dark rounded badge: yellow warning triangle + short label (「転職の落とし穴」 etc.)."""
    t = label(text, size, 900, (255, 255, 255))
    ic = warn_icon(int(size * 1.5))
    w, h = ic.width + t.width + int(size * 1.4), int(size * 2.1)
    im = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.rounded_rectangle((0, 0, w - 1, h - 1), h // 2, fill=(16, 20, 34, 236), outline=YELLOW, width=5)
    im.alpha_composite(ic, (int(size * 0.5), (h - ic.height) // 2 - 3))
    im.alpha_composite(t, (int(size * 0.5) + ic.width + int(size * 0.3), (h - t.height) // 2))
    return im


def badge_overlays(text, until, big_cy=820, small_cy=600):
    """Warning badge: large in the middle on the first frame, then small above the diagram from `until`."""
    big, small = warn_badge(text, 76), warn_badge(text, 40)
    return [at(W / 2, big_cy, big, 0.0, until, anim="punch", dur_in=0.3),
            at(W / 2, small_cy, small, until, 99, anim="fade", dur_in=0.25)]


def chip(text, size=36, bg=OK_BG, fg=TEAL, padx=20, pady=10):
    return pill(text, size, bg=bg, fg=fg, weight=900, padx=padx, pady=pady)


def ng_chip(text="NG", size=34):
    return pill(text, size, bg=RED, fg=(255, 255, 255), weight=900, padx=22, pady=9)


def multiline(lines, size=46, weight=900, gap=1.38, align="left"):
    """Several text_img lines stacked (`{}` parts in teal)."""
    parts = [text_img(ln, size, weight) for ln in lines]
    lh = int(size * gap)
    w = max(p.width for p in parts)
    im = Image.new("RGBA", (w, lh * len(parts)), (0, 0, 0, 0))
    for k, p in enumerate(parts):
        x = 0 if align == "left" else (w - p.width) // 2
        im.alpha_composite(p, (x, k * lh + (lh - p.height) // 2))
    return im


def bubble(lines, w=880, size=46, tone="plain", tail="left", head=None, pad_y=34):
    """Speech bubble (white; tone 'ng' = pale red edge, 'ok' = teal edge) with a small tail at the bottom."""
    body = multiline(lines, size)
    top = (head.height + 18) if head is not None else 0
    h = top + body.height + pad_y * 2
    img, pad = mc.white_card(w, h, r=32)
    d = ImageDraw.Draw(img)
    edge = {"ng": (232, 150, 150), "ok": TEAL}.get(tone)
    if edge:
        d.rounded_rectangle((pad, pad, pad + w, pad + h), 32, outline=edge, width=6)
    tx = pad + (90 if tail == "left" else w - 150)
    d.polygon([(tx, pad + h - 3), (tx + 60, pad + h - 3), (tx + (8 if tail == "left" else 52), pad + h + 40)],
              fill=(255, 255, 255, 246))
    if head is not None:
        img.alpha_composite(head, (pad + 40, pad + pad_y - 6))
    img.alpha_composite(body, (pad + 44, pad + pad_y + top))
    return img


def headset_icon(size=150, color=(255, 255, 255)):
    s = size * 4
    im = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    w = int(s * 0.06)
    d.arc((s * 0.16, s * 0.12, s * 0.84, s * 0.8), 180, 360, fill=color, width=w)
    d.rounded_rectangle((s * 0.1, s * 0.42, s * 0.28, s * 0.68), s * 0.06, fill=color)
    d.rounded_rectangle((s * 0.72, s * 0.42, s * 0.9, s * 0.68), s * 0.06, fill=color)
    d.arc((s * 0.18, s * 0.42, s * 0.82, s * 0.9), 40, 120, fill=color, width=int(w * 0.8))
    d.ellipse((s * 0.36, s * 0.8, s * 0.48, s * 0.9), fill=color)
    return im.resize((size, size), Image.LANCZOS)


def deal_icon(size=150, color=(255, 255, 255)):
    """Document with a small bar chart (proposal materials for a client)."""
    s = size * 4
    im = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    w = int(s * 0.055)
    d.rounded_rectangle((s * 0.14, s * 0.1, s * 0.86, s * 0.9), s * 0.05, outline=color, width=w)
    d.rectangle((s * 0.26, s * 0.2, s * 0.62, s * 0.26), fill=color)
    for k, hh in enumerate((0.18, 0.3, 0.42)):
        x = s * (0.28 + k * 0.16)
        d.rectangle((x, s * 0.76 - s * hh, x + s * 0.1, s * 0.76), fill=color)
    d.line([(s * 0.24, s * 0.78), (s * 0.78, s * 0.78)], fill=color, width=int(w * 0.7))
    return im.resize((size, size), Image.LANCZOS)


def job_card(lines=("休日", "週休2日"), w=820, h=300, hl=None):
    """Schematic listing: 求人 pill, two grey placeholder bars and one readable row (label + value)."""
    img, pad = mc.white_card(w, h, r=34)
    d = ImageDraw.Draw(img)
    img.alpha_composite(pill("求人", 30), (pad + 40, pad + 34))
    t = edu.tag()
    img.alpha_composite(t, (pad + w - 40 - t.width, pad + 36))
    for k, frac in enumerate((0.86, 0.62)):
        d.rounded_rectangle((pad + 44, pad + 112 + k * 38, pad + 44 + (w - 88) * frac, pad + 130 + k * 38), 9,
                            fill=(216, 220, 228))
    key, value = lines
    kl = label(key, 44, 700, GREY)
    vl = label(value, 76, 900, INK)
    y = pad + h - 40 - vl.height
    img.alpha_composite(kl, (pad + 48, y + (vl.height - kl.height) // 2 + 6))
    vx = pad + 48 + kl.width + 30
    img.alpha_composite(vl, (vx, y))
    img.info["value_box"] = (vx - 18, y - 8, vx + vl.width + 18, y + vl.height + 8)
    return img


def ring(w, h, color=YELLOW, width=7, r=None):
    im = Image.new("RGBA", (int(w) + 8, int(h) + 8), (0, 0, 0, 0))
    ImageDraw.Draw(im).rounded_rectangle((4, 4, w + 3, h + 3), r if r is not None else int(h / 2), outline=color,
                                         width=width)
    return im


def flow_box(text, w=820, h=128, size=48, fill=(255, 255, 255, 246), fg=INK, edge=None):
    img, pad = mc.card(w, h, r=30, fill=fill)
    if edge:
        ImageDraw.Draw(img).rounded_rectangle((pad, pad, pad + w, pad + h), 30, outline=edge, width=6)
    paste_mid(img, text_img(text, size, 900, fg), pad + w / 2, pad + h / 2)
    return img


def render(tm, scenes, preview, sfx):
    """Alert on the first frame, card/item sounds at the second series' level, soft swish on scene changes."""
    events = [(0.0, "alert", OPENING_ALERT)] + [(t, kind, min(0.4, g * edu.SFX_BOOST)) for t, kind, g in sfx]
    events += [(s["start"] - 0.06, "swish", 0.2) for s in tm.data["scenes"][1:]]
    return mc.render(tm, scenes, preview, events, lift_at=None, ai_note=AI_NOTE, music_vel=0.42,
                     note_xy=edu.NOTE_XY, chords=TENSE, pulse=PULSE)


# ---------------------------------------------------------------- command line
if __name__ == "__main__":
    cmd, args = sys.argv[1], sys.argv[2:]
    if cmd == "fit":
        import fit_audio
        fit_audio.PLANS.update(PLANS)
        for n in args:
            fit_audio.fit(n)
    elif cmd == "preview":
        import importlib.util   # by path: the sales-to-jimu folder on sys.path has its own preview.py
        spec = importlib.util.spec_from_file_location("mc_preview", os.path.join(mc.HERE, "preview.py"))
        preview = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(preview)
        print(preview.sheet(args[0], [float(x) for x in args[1:]]))
    elif cmd == "check":
        import check
        sys.exit(0 if all([check.check(n) for n in args]) else 1)
    else:
        sys.exit(f"unknown command {cmd!r} (fit / preview / check)")
