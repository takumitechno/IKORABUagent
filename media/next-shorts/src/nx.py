"""NEXT01〜05: 未経験転職SNSメディア（合同会社 匠Technologies）向けの縦型ショート（TikTok／Reels）.

Built on the same tools as the educational series (career-edu-3 → career-edu-2 → makecareer → sales-to-jimu engine):
full-screen photo backgrounds, white diagram cards, emphasis telops at the top, full subtitles at the bottom.
What differs here: a strong headline and impact sound on the first frame, punchier sound effects (ducked a little
under the voice so words stay clear), a light drum groove for the BGM (one style per video), no on-screen
AI-image notice, and a CTA that follows each video's brief (保存 / なし / プロフィールのリンク).

    python3 nx.py fit NEXT01_salary            # timing/<name>.json from the narration take
    python3 nx.py preview n01_salary 0.5 3.0   # contact sheet in out/preview/
    python3 nx.py check NEXT01_salary          # inspect the rendered MP4
    python3 n01_salary.py                      # render out/NEXT01_salary.mp4 (+ .srt)
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
os.environ.setdefault("MC_PROJECT", ROOT)
sys.path.insert(0, os.path.join(os.path.dirname(ROOT), "career-edu-3", "src"))

import numpy as np  # noqa: E402
from PIL import Image, ImageDraw  # noqa: E402

import edu3  # noqa: E402
from edu3 import RED, at, paste_mid, text_img  # noqa: E402,F401
import edu  # noqa: E402
import mc  # noqa: E402
from engine import ease_out_cubic  # noqa: E402
from mc import GREY, INK, TEAL, W, YELLOW, clamp, label  # noqa: E402,F401

AI_NOTE = False
TAIL = 1.1            # hold after the last word (no end card)


def plan(scenes, telops, marks, tail=TAIL):
    return dict(scenes=scenes, telops=telops, marks=marks, tail=tail)


PLANS = {
    "NEXT01_salary": plan(
        [("s1", "h1", "見出し：手取り20万→月給25万、5万アップ？"), ("s2", "p1", "手取り20万と月給25万を並べる→比較条件が違う"),
         ("s3", "p3a", "月給は引かれる前の金額（手取りは？）"), ("s4", "p4", "額面同士で比べる→その後手取り"),
         ("s5", "p6", "CTA：保存")],
        [("hook", "手取り20万→月給25万。\nそれ、{5万アップ？}", ("scene", "s1"), ["h1"]),
         ("s2a", "{手取り}と{月給}を比べると", ("scene", "s2", "p2")),
         ("s2b", "その差5万円、\n{増えるとは限らない}", ("cue", "p2"), ["p2"]),
         ("s3", "月給は{引かれる前}の金額", ("scene", "s3")),
         ("s4", "比べるなら{額面同士}", ("scene", "s4")),
         ("s5", "求人を見る前に{保存}", ("scene", "s5"), ["p6"])],
        [("s2_left", "p1", "手取り"), ("s2_right", "p1", "求人|旧人|月給"), ("s2_not", "p2", "増える|えるお金"),
         ("s3_tax", "p3b", None), ("s3_net", "p3b", "引か|惹か|前の"), ("s4_same", "p4", "額面"), ("s4_net", "p5", None)]),
    "NEXT02_annual_income": plan(
        [("s1", "h1", "見出し：年収例500万円、あなたの1年目？"), ("s2", "p1a", "500万円から下の条件へ"),
         ("s3", "p3a", "年収例と自分の初年度を分ける"), ("s4", "p4a", "面接での聞き方"), ("s5", "p5", "締め（CTAなし）")],
        [("hook", "年収例500万円。\nその数字、{あなたの1年目？}", ("scene", "s1"), ["h1"]),
         ("s2", "見たいのは{その下の条件}", ("scene", "s2"), ["p1b"]),
         ("s3", "年収例 ≠ {あなたの初年度}", ("scene", "s3")),
         ("s4", "面接で{こう聞く}", ("scene", "s4"), ["p4b"]),
         ("s5", "年収例より、\n{自分の初年度}", ("scene", "s5"), ["p5"])],
        [("s2_cond", "p1b", "条件|下の"), ("s2_years", "p2a", None), ("s2_bonus", "p2b", None), ("s2_extra", "p2c", None),
         ("s3_mine", "p3b", None), ("s4_q", "p4b", None)]),
    "NEXT03_customer_service": plan(
        [("s1", "h1", "見出し：接客しか経験がない、で諦める前に"), ("s2", "p2a", "接客の経験→職務経歴書に書ける業務"),
         ("s3", "p4", "接客と営業事務の共通点"), ("s4", "p5", "パソコンスキルは別に確認"), ("s5", "p6", "CTA：プロフィールのリンク")],
        [("hook", "“接客しか経験がない”で、\n{事務転職を諦める前に}", ("scene", "s1"), ["h1"]),
         ("s2a", "接客で{やってきたこと}", ("scene", "s2", "p3")),
         ("s2b", "{職務経歴書}で伝えたい経験", ("cue", "p3"), ["p3"]),
         ("s3", "営業事務との{共通点}", ("scene", "s3")),
         ("s4", "{パソコンスキル}は別に確認", ("scene", "s4"), ["p5"]),
         ("s5", "接客からの転職を\n{相談したい人は}", ("scene", "s5"), ["p6"])],
        [("s1_zero", "p1", "ゼロ"), ("s2_listen", "p2a", None), ("s2_order", "p2b", None), ("s2_conv", "p3", "職務|経歴"),
         ("s3_common", "p4", "顧客|客対応"),
         ("s3_order", "p4", "受発注|発注"), ("s4_check", "p5", "確認"), ("s5_link", "p6", "プロフ|リンク")]),
    "NEXT04_requirements": plan(
        [("s1", "h1", "見出し：未経験歓迎の求人、歓迎と必須を混ぜない"), ("s2", "p2a", "条件を「必須」「歓迎・あれば尚可」の2列に仕分け"),
         ("s3", "p4", "条件を分けて読む"), ("s4", "p5", "CTA：保存")],
        [("hook", "未経験歓迎の求人。\n{「歓迎」と「必須」}を\n混ぜない", ("scene", "s1"), ["h1"]),
         ("s2b", "未経験OKでも、\n{必須の条件}はある", ("scene", "s2", "p3")),
         ("s2c", "「あれば尚可」は\n{必須じゃない}", ("cue", "p3"), ["p3"]),
         ("s3", "諦める前に、\n{条件を分けて読む}", ("scene", "s3")),
         ("s4", "応募前に見返せるよう{保存}", ("scene", "s4"), ["p5"])],
        [("s2_must", "p1", "必須"), ("s2_pc", "p2b", None), ("s2_lic", "p2b", "免許"), ("s2_nice", "p3", "あれば|なおか"),
         ("s3_split", "p4", "条件|分けて")]),
    "NEXT05_holidays": plan(
        [("s1", "h1", "見出し：完全週休2日なのに、土日出勤？"), ("s2", "p1", "土日休みと火・水休みのカレンダー比較"),
         ("s3", "p4a", "年間休日と休む曜日をセットで確認"), ("s4", "p5", "CTA：プロフィールのリンク")],
        [("hook", "完全週休2日なのに、\n{土日出勤？}", ("scene", "s1"), ["h1"]),
         ("s2a", "完全週休2日＝{毎週2日休み}", ("scene", "s2", "p2"), ["p1"]),
         ("s2b", "{土日休み}とは限らない", ("cue", "p2")),
         ("s3", "求人では{セットで確認}", ("scene", "s3")),
         ("s4", "働き方を\n{相談したい人は}", ("scene", "s4"), ["p5"])],
        [("s2_mid", "p3", None), ("s2_ok", "p3", "当て|はま"), ("s3_days", "p4b", "年間"), ("s3_week", "p4b", "曜日"),
         ("s4_link", "p5", "プロフ|リンク")]),
}


# ---------------------------------------------------------------- backgrounds
def backdrop(head, dur):
    """Full-screen photos: a quick settle-in at each cut, then a slow push-in (pull-out on every other shot)."""
    shots = []
    for k, (t0, key, src) in enumerate(head):
        t1 = head[k + 1][0] if k + 1 < len(head) else dur
        shots.append((t0, edu.photo(key), t1 - t0 + 0.4, clamp((src[1] + src[3]) / 2), (-1, 1)[k % 2]))

    def one(i, t):
        t0, ph, d, cy, drift = shots[i]
        p = clamp((t - t0) / max(0.1, d))
        snap = 0.05 * (1 - ease_out_cubic(clamp((t - t0) / 0.5)))
        z = (1.06 + 0.07 * p) if drift > 0 else (1.13 - 0.07 * p)
        return ph.render(z + snap, 0.5 + 0.08 * drift * (p - 0.5), cy).convert("RGBA")

    def fn(t):
        k = max(i for i, s in enumerate(shots) if t >= s[0] or i == 0)
        fr = one(k, t)
        if k and t - shots[k][0] < 0.3:
            fr = Image.blend(one(k - 1, t), fr, (t - shots[k][0]) / 0.3)
        return fr
    return fn


def scene(tm, sid, overlays, *items):
    return tm.scene(sid, backdrop(edu3.heads(*items), tm.dur(sid)), overlays, trans_dur=0.22)


def telop(tm, sid, tid, size=84, cy=mc.TOP_CY):
    t = tm.tel[tid]
    return mc.Telop(mc.emph(t["text"], size), W / 2, cy, tm.local(sid, t["start"]), tm.local(sid, t["end"]),
                    anim="punch" if sid == tm.data["scenes"][0]["id"] else "up", dur_in=0.28, dur_out=0.2)


def topic(text, cy=232):
    """Small pill above the opening headline: who it is for / what it is about."""
    return at(W / 2, cy, mc.pill(text, 34, bg=TEAL, fg=(255, 255, 255), weight=900, padx=26, pady=11), 0.0,
              anim="fade", dur_in=0.15)


# ---------------------------------------------------------------- parts
def ex_tag(text="例"):
    return mc.pill(text, 26, bg=(232, 236, 242), fg=GREY, weight=700, padx=16, pady=7)


def card(w, h, r=32, edge=None, fill=(255, 255, 255, 246)):
    img, pad = mc.card(w, h, r=r, fill=fill)
    if edge:
        ImageDraw.Draw(img).rounded_rectangle((pad, pad, pad + w, pad + h), r, outline=edge, width=6)
    return img, pad


def money_box(head, kind, amount, w=440, h=330, head_color=TEAL, note=None):
    """Header band (今 / 求人), a small label (手取り / 月給) and the amount."""
    img, pad = card(w, h)
    d = ImageDraw.Draw(img)
    d.rounded_rectangle((pad, pad, pad + w, pad + 78), 32, fill=head_color)
    d.rectangle((pad, pad + 46, pad + w, pad + 78), fill=head_color)
    paste_mid(img, label(head, 40, 900, (255, 255, 255)), pad + w / 2, pad + 40)
    paste_mid(img, label(kind, 44, 700, GREY), pad + w / 2, pad + 130)
    paste_mid(img, label(amount, 104, 900, INK), pad + w / 2, pad + 222)
    if note:
        paste_mid(img, label(note, 28, 700, GREY), pad + w / 2, pad + h - 30)
    return img


def dashed_box(w, h, color=(255, 255, 255), r=24, step=26):
    im = Image.new("RGBA", (w + 8, h + 8), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    x0, y0, x1, y1 = 4, 4, w + 3, h + 3
    for x in range(x0 + r, x1 - r, step):
        d.line([(x, y0), (min(x1 - r, x + 14), y0)], fill=color, width=4)
        d.line([(x, y1), (min(x1 - r, x + 14), y1)], fill=color, width=4)
    for y in range(y0 + r, y1 - r, step):
        d.line([(x0, y), (x0, min(y1 - r, y + 14))], fill=color, width=4)
        d.line([(x1, y), (x1, min(y1 - r, y + 14))], fill=color, width=4)
    for (cx, cy, a0) in ((x0 + r, y0 + r, 180), (x1 - r, y0 + r, 270), (x1 - r, y1 - r, 0), (x0 + r, y1 - r, 90)):
        d.arc((cx - r, cy - r, cx + r, cy + r), a0, a0 + 90, fill=color, width=4)
    return im


def stamp(text, color=RED, size=48, angle=-6):
    lab = label(text, size, 900, color)
    w, h = lab.width + 56, lab.height + 30
    im = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.rounded_rectangle((3, 3, w - 4, h - 4), 16, fill=(255, 255, 255, 240), outline=color, width=6)
    im.alpha_composite(lab, (28, 13))
    return im.rotate(angle, expand=True, resample=Image.BICUBIC)


def link_icon(size=120, color=TEAL):
    s = size * 4
    im = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    w = int(s * 0.1)
    for (x0, y0) in ((0.12, 0.38), (0.46, 0.38)):
        d.rounded_rectangle((s * x0, s * y0, s * (x0 + 0.42), s * (y0 + 0.24)), s * 0.12, outline=color, width=w)
    return im.rotate(35, resample=Image.BICUBIC).resize((size, size), Image.LANCZOS)


def cta_save(size=240):
    """Closing 保存 mark: a dark circle with a yellow bookmark, the word underneath."""
    im = Image.new("RGBA", (size + 40, size + 120), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.ellipse((20, 0, 20 + size - 1, size - 1), fill=INK, outline=YELLOW, width=8)
    paste_mid(im, mc.bookmark_icon(int(size * 0.5), YELLOW), 20 + size / 2, size / 2 + 4)
    paste_mid(im, mc.emph("保存", 72), 20 + size / 2, size + 62)
    return im


def cta_link(w=880, h=250):
    """Closing プロフィールのリンク card: link mark and the words (no URL, no fake button)."""
    img, pad = card(w, h, edge=YELLOW)
    ic = Image.new("RGBA", (170, 170), (0, 0, 0, 0))
    ImageDraw.Draw(ic).ellipse((0, 0, 169, 169), fill=TEAL)
    paste_mid(ic, link_icon(120, (255, 255, 255)), 85, 85)
    img.alpha_composite(ic, (pad + 46, pad + (h - 170) // 2))
    body = edu3.multiline(["プロフィールの", "{リンク}へ"], 64, gap=1.36)
    img.alpha_composite(body, (pad + 46 + 170 + 44, pad + (h - body.height) // 2))
    return img


def opening(tm, sid, topic_text, size=84):
    """First frame: topic pill + the headline (punch-in); the impact sound is added by render()."""
    return [topic(topic_text), telop(tm, sid, "hook", size)]


# ---------------------------------------------------------------- sound
# Self-made (procedural) BGM and sound effects only: no third-party audio, so there are no licence terms to check.
SR = 48000


def _sound():
    import audio as au
    return au


def _norm(x, peak=0.5):
    return x / (np.max(np.abs(x)) + 1e-9) * peak


def se_impact():
    """Opening hit: low boom + snap + a short bright ring."""
    au = _sound()
    t = au.tl(1.0)
    boom = np.sin(2 * np.pi * np.cumsum(45 + 110 * np.exp(-t * 14)) / au.SR) * np.exp(-t * 4.5)
    snap = au.filt(au.rng.normal(0, 1, len(t)), "bandpass", [1200, 7000]) * np.exp(-t * 45)
    ring = sum(np.sin(2 * np.pi * f * t) * a for f, a in ((1560, 1.0), (2340, 0.6), (3520, 0.35))) * np.exp(-t * 7)
    return _norm(boom * 1.0 + snap * 0.5 + ring * 0.16, 0.62)


def se_hit():
    """Short punch for a key number or a headline line."""
    au = _sound()
    t = au.tl(0.45)
    body = np.sin(2 * np.pi * np.cumsum(60 + 140 * np.exp(-t * 30)) / au.SR) * np.exp(-t * 11)
    clap = au.filt(au.rng.normal(0, 1, len(t)), "bandpass", [900, 5000]) * np.exp(-t * 32)
    return _norm(body + clap * 0.6, 0.55)


def se_pop(pitch=1.0):
    au = _sound()
    t = au.tl(0.12)
    f = (380 + 900 * np.clip(t / 0.03, 0, 1)) * pitch
    return _norm(np.sin(2 * np.pi * np.cumsum(f) / au.SR) * np.exp(-t * 32), 0.5)


def se_click():
    au = _sound()
    t = au.tl(0.06)
    c = au.filt(au.rng.normal(0, 1, len(t)), "bandpass", [2000, 7500]) * np.exp(-t * 260)
    c += np.sin(2 * np.pi * 2600 * t) * np.exp(-t * 120) * 0.6
    return _norm(c, 0.5)


def se_accent():
    """「実は違う」: a short minor stab over a low thump."""
    au = _sound()
    t = au.tl(0.55)
    stab = np.zeros_like(t)
    for f in (220.0, 261.6, 329.6, 440.0):
        for det in (-0.004, 0.004):
            stab += 2 * ((t * f * (1 + det)) % 1.0) - 1
    stab = au.filt(stab, "lowpass", 2600) * np.exp(-t * 7) * np.minimum(1, t / 0.005)
    thump = np.sin(2 * np.pi * np.cumsum(55 + 80 * np.exp(-t * 25)) / au.SR) * np.exp(-t * 10)
    return _norm(stab * 0.5 + thump, 0.55)


def se_wrong():
    """NG / mismatch: two quick descending blips."""
    au = _sound()
    out = np.zeros(int(0.36 * au.SR))
    for k, f in enumerate((560, 400)):
        t = au.tl(0.12)
        s = np.sign(np.sin(2 * np.pi * f * t)) * 0.5 + np.sin(2 * np.pi * f * t) * 0.5
        s = au.filt(s, "lowpass", 3000) * au.env_adsr(t, 0.12, 0.004, 0.05)
        i = int(k * 0.14 * au.SR)
        out[i:i + len(s)] += s
    return _norm(out, 0.42)


def se_swipe(dur=0.3):
    au = _sound()
    t = au.tl(dur)
    nz = au.rng.normal(0, 1, len(t))
    lo = au.filt(nz, "bandpass", [500, 2500])
    hi = au.filt(nz, "bandpass", [2500, 9000])
    m = np.clip(t / dur, 0, 1)
    e = np.sin(np.pi * m) ** 1.5
    return _norm((lo * (1 - m) + hi * m) * e, 0.42)


def se_ding(f=1568):
    au = _sound()
    t = au.tl(0.6)
    s = (np.sin(2 * np.pi * f * t) + 0.45 * np.sin(2 * np.pi * f * 2.01 * t) * np.exp(-t * 8)) * np.exp(-t * 6)
    return _norm(s, 0.4)


def se_cta():
    """Closing 決め音: quick rising bell arpeggio with a little sparkle."""
    au = _sound()
    out = np.zeros(int(1.2 * au.SR))
    for k, f in enumerate((1046.5, 1318.5, 1568.0, 2093.0)):
        t = au.tl(0.8)
        s = (np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * f * 3 * t) * np.exp(-t * 12)) * np.exp(-t * 5)
        i = int(k * 0.06 * au.SR)
        out[i:i + len(s)] += s[: len(out) - i]
    t = au.tl(1.2)
    out += au.filt(au.rng.normal(0, 1, len(t)), "highpass", 7000) * np.exp(-t * 6) * 0.15
    return _norm(out, 0.5)


SE = {"impact": se_impact, "hit": se_hit, "pop": se_pop, "pop_hi": lambda: se_pop(1.35), "pop_lo": lambda: se_pop(0.8),
      "click": se_click, "accent": se_accent, "wrong": se_wrong, "swipe": se_swipe,
      "swipe_long": lambda: se_swipe(0.42), "ding": se_ding, "ding_hi": lambda: se_ding(2093), "cta": se_cta}

# one groove per video (light drums, piano or e-piano), all quieter than the voice and the effects
STYLES = {
    "NEXT01_salary": dict(bpm=104, keys="piano", chords=[(["F2", "A2", "C3", "E3"], "F1"), (["G2", "B2", "D3", "F3"], "G1"),
                                                         (["E2", "G2", "B2", "D3"], "E1"), (["A2", "C3", "E3", "G3"], "A1")]),
    "NEXT02_annual_income": dict(bpm=100, keys="ep", chords=[(["A2", "C3", "E3", "G3"], "A1"), (["F2", "A2", "C3", "E3"], "F1"),
                                                             (["C3", "E3", "G3", "B3"], "C2"), (["G2", "B2", "D3", "F3"], "G1")]),
    "NEXT03_customer_service": dict(bpm=106, keys="piano", chords=[(["C3", "E3", "G3", "B3"], "C2"), (["G2", "B2", "D3", "E3"], "G1"),
                                                                   (["A2", "C3", "E3", "G3"], "A1"), (["F2", "A2", "C3", "E3"], "F1")]),
    "NEXT04_requirements": dict(bpm=102, keys="ep", chords=[(["D3", "F3", "A3", "C4"], "D2"), (["A#2", "D3", "F3", "A3"], "A#1"),
                                                            (["F2", "A2", "C3", "E3"], "F1"), (["C3", "E3", "G3", "B3"], "C2")]),
    "NEXT05_holidays": dict(bpm=104, keys="piano", chords=[(["E2", "G2", "B2", "D3"], "E1"), (["C3", "E3", "G3", "B3"], "C2"),
                                                           (["G2", "B2", "D3", "F#3"], "G1"), (["D3", "F#3", "A3", "C4"], "D2")]),
}
MUSIC_VEL = 0.5
SFX_GAIN = 1.35           # card / number / accent sounds: clearly audible on a phone speaker
VOICE_DUCK_MUSIC = 10.0   # dB the BGM drops under the voice
VOICE_DUCK_SFX = 4.0      # dB the effects drop under the voice (they stay audible, words stay clear)


def build_audio(tm, sfx_events):
    au = _sound()
    import align_clips as ac
    import narrated as nr
    import tts
    a = tm.data["audio"]
    x = ac.load(os.path.normpath(os.path.join(mc.ROOT, "timing", a["file"])))
    voice = tts.voice_chain(x[int(a["cut"] * au.SR):])
    st = STYLES[tm.name]
    music, sfx = au.Bus(tm.total), au.Bus(tm.total)
    nr.groove(music, 0.0, tm.total, st["bpm"], st["chords"], drums=True, keys=st["keys"], vel=MUSIC_VEL, octave=12,
              hats=True, kick_pattern=(0, 2))
    for t, kind, gain in sfx_events:
        sfx.add(SE[kind](), max(0.0, t), gain)
    vb = np.zeros(len(music.buf))
    i = int(a["at"] * au.SR)
    vb[i:i + len(voice)] += voice[: len(vb) - i]
    env = nr.moving_avg(np.abs(vb), int(0.2 * au.SR))
    env = np.clip(env / (np.max(env) + 1e-9) * 4, 0, 1)
    duck_m = 1 - (1 - 10 ** (-VOICE_DUCK_MUSIC / 20)) * env
    duck_s = 1 - (1 - 10 ** (-VOICE_DUCK_SFX / 20)) * env
    mus = au.reverb(music.buf, 1.4, 0.18) * duck_m[:, None] * 0.5
    eff = sfx.buf * duck_s[:, None]
    mix = mus + eff + np.stack([vb, vb], axis=1) * 0.9
    path = os.path.join(mc.OUT_DIR, f"{tm.name}.wav")
    os.makedirs(mc.OUT_DIR, exist_ok=True)
    au.master(mix, np.zeros_like(mix), path, total=tm.total, fade_out=0.4)
    return path


def render(tm, scenes, preview, sfx):
    """Impact on the first frame, a swipe on every cut, then the video's own effects; MP4 + SRT + timing table."""
    from engine import render_video
    events = ([(0.0, "impact", 1.0)] + [(s["start"] - 0.08, "swipe", 1.3) for s in tm.data["scenes"][1:]]
              + [(t, kind, g if kind == "cta" else g * SFX_GAIN) for t, kind, g in sfx])
    out = os.path.join(mc.OUT_DIR, tm.data["video"])
    mc.write_tables(tm)
    wav = build_audio(tm, events)
    overlays = [mc.Subtitles(tm.subs, telops=tm.data.get("telops", []))]
    total = render_video(scenes, wav, out, preview_times=preview, global_overlays=overlays)
    assert abs(total - tm.total) < 1e-6, (total, tm.total)
    return out


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
