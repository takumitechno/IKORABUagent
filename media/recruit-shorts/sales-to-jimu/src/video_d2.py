"""Video D (rev.2): keep 0–14.4s of video D, replace the ending with a consultation-focused close.

Scenes after 「全部、事務のど真ん中」:
  A  その経験、事務職でも活かせるかも。        (office photo, gentle zoom only)
  B  あなたの経験に合う仕事を一緒に整理。       (blurred office + white card)
  C  ［相談先サービス名］ / 営業経験を活かせる / 事務職を相談する / プロフィールのリンクへ

SERVICE_NAME is a placeholder until the real consultation service name is confirmed;
renders that still contain it are review-only.
"""
import os
import sys

from PIL import Image, ImageDraw, ImageFilter

import audio as au
import narrated as nr
import tts
import video_d
from engine import H, OUT_DIR, W, Photo, Telop, card, font, render_video, rounded_mask, text_block
from ui import Static
from video_b import gradient_bg

L = nr.Line
SERVICE_NAME = os.environ.get("SERVICE_NAME", "［相談先サービス名］")
INK = (24, 26, 32)
TEAL = (14, 147, 132)
YELLOW = (255, 225, 77)
LINES = ["その経験、事務職でも活かせるかも。",
         "あなたの経験に合う仕事を、一緒に整理。",
         "転職相談は、プロフィールのリンクから。"]
KEEP = 4  # segments of video D kept unchanged (hook … 「全部、事務のど真ん中」)


def band(y0, y1, alpha=150):
    """Soft dark band behind on-photo text (fades out at both edges)."""
    g = Image.new("L", (1, H), 0)
    for y in range(H):
        if y0 <= y <= y1:
            k = min(y - y0, y1 - y) / max(1, (y1 - y0) * 0.35)
            g.putpixel((0, y), int(alpha * min(1.0, k)))
    img = Image.new("RGBA", (W, H), (8, 12, 28, 255))
    img.putalpha(g.resize((W, H)))
    return img


def memo_icon(size=60, color=TEAL):
    ss = 4
    s = size * ss
    im = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    w = int(s * 0.07)
    d.rounded_rectangle((s * 0.18, s * 0.1, s * 0.82, s * 0.9), int(s * 0.1), outline=color, width=w)
    for k, y in enumerate((0.34, 0.5, 0.66)):
        d.line((s * 0.32, s * y, s * (0.68 if k < 2 else 0.54), s * y), fill=color, width=w)
    return im.resize((size, size), Image.LANCZOS)


def consult_card():
    """White rounded card (same style as the mid-video cards) with the two lines, readable at once."""
    cw, ch = 880, 430
    img, pad = card(cw, ch, r=36, fill=(255, 255, 255, 246))
    img.alpha_composite(memo_icon(), (pad + 44, pad + 40))
    d = ImageDraw.Draw(img)
    f1, f2 = font(58, 900), font(108, 900)
    t1, t2 = "あなたの経験に合う仕事を", "一緒に整理。"
    d.text((pad + (cw - f1.getlength(t1)) / 2, pad + 120), t1, font=f1, fill=INK)
    d.text((pad + (cw - f2.getlength(t2)) / 2, pad + 222), t2, font=f2, fill=TEAL)
    return img


def guide_band(text="プロフィールのリンクへ", w=860, h=128):
    """Wide teal→blue band used as a directional cue (no button pulse, no cursor)."""
    ss = 2
    g = Image.new("RGBA", (w * ss, h * ss))
    d = ImageDraw.Draw(g)
    c0, c1 = (46, 196, 182), (37, 140, 230)
    for x in range(w * ss):
        k = x / (w * ss - 1)
        d.line([(x, 0), (x, h * ss)], fill=tuple(int(c0[i] + (c1[i] - c0[i]) * k) for i in range(3)) + (255,))
    g = g.resize((w, h), Image.LANCZOS)
    g.putalpha(rounded_mask(w, h, 22))
    f = font(60, 900)
    asc, desc = f.getmetrics()
    ImageDraw.Draw(g).text(((w - f.getlength(text)) / 2, (h - asc - desc) / 2 - 2), text, font=f, fill=(255, 255, 255))
    return g


def notes_block(lines, size=26):
    """Two-line disclaimer on a translucent plate."""
    f = font(size, 500)
    asc, desc = f.getmetrics()
    lh = asc + desc + 6
    w = int(max(f.getlength(t) for t in lines)) + 56
    h = lh * len(lines) + 28
    im = Image.new("RGBA", (w, h), (0, 0, 0, 120))
    im.putalpha(rounded_mask(w, h, 22).point(lambda v: int(v * 120 / 255)))
    d = ImageDraw.Draw(im)
    for i, t in enumerate(lines):
        d.text(((w - f.getlength(t)) / 2, 12 + i * lh), t, font=f, fill=(255, 255, 255, 230))
    return im


def segments():
    segs = video_d.segments()[:KEEP]
    office = Photo("a6_jimu_pc.jpg", "warm")
    office_bg = Photo("a6_jimu_pc.jpg", "warm", blur=24, darken=0.55)

    scene_a = nr.Segment(
        [L(LINES[0])],
        nr.shot(office, 1.0, 1.035, (0.3, 0.42), (0.3, 0.42), shake=0.0),
        extra=lambda s: [Static(band(470, 880, 165)),
                         Telop(text_block("その経験、\n事務職でも{活かせるかも。}", size=76, hl=YELLOW, max_w=900),
                               W / 2, 660, -1, 99, anim="pop")],
        lead=0.15, tail=0.35, min_dur=3.0, trans="xfade", trans_dur=0.15, jump=False)
    scene_b = nr.Segment(
        [L(LINES[1])],
        lambda dur: (lambda t: office_bg.render(1.0 + 0.03 * t / dur, 0.3, 0.42)),
        extra=lambda s: [Telop(consult_card(), W / 2, 900, -1, 99, anim="pop")],
        lead=0.15, tail=0.35, min_dur=3.0, trans="xfade", trans_dur=0.15, jump=False)
    scene_c = nr.Segment(
        [L(LINES[2])],
        lambda dur, g=gradient_bg((10, 18, 44), (14, 70, 92)): g,
        extra=lambda s: [
            Telop(notes_block(["※画像はAI生成によるイメージです", "※求人の内容・条件は企業により異なります"]),
                  W / 2, 330, -1, 99, anim="up"),
            Telop(text_block(SERVICE_NAME, size=46, weight=700, fill=(235, 240, 245)), W / 2, 600, -1, 99, anim="up"),
            Telop(text_block("営業経験を活かせる", size=66, weight=900), W / 2, 760, -1, 99, anim="up"),
            Telop(text_block("{事務職を相談する}", size=104, hl=YELLOW), W / 2, 880, -1, 99, anim="up"),
            Telop(guide_band(), W / 2, 1090, -1, 99, anim="up"),
        ],
        lead=0.2, tail=0.4, min_dur=3.4, trans="xfade", trans_dur=0.15, jump=False)
    return segs + [scene_a, scene_b, scene_c]


def build():
    segs = segments()
    scenes, voice, total = nr.build(segs)
    return scenes, voice, total, segs


def build_audio(total, voice, segs):
    music, sfx = au.Bus(total), au.Bus(total)
    S = [s.start for s in segs]
    stamp_t = S[1] + video_d.stamp_time(segs[1].lines[0])
    # identical to video D up to 「全部、事務のど真ん中」
    nr.groove(music, 0.0, S[1], 116, [(["D3", "F3", "A3"], "D1"), (["A#2", "D3", "F3"], "A#1")],
              drums=True, keys="ep", vel=0.75, octave=12, hats=True, kick_pattern=(0, 1, 2, 3))
    sfx.add(au.sfx_glitch(), 0.0, 0.8)
    sfx.add(au.sfx_impact(), 0.0, 0.85)
    sfx.add(au.sfx_whoosh(0.3), 0.0, 0.5)
    sfx.add(au.sfx_impact(), stamp_t, 1.0)
    sfx.add(au.sfx_bass_drop(), stamp_t, 0.9)
    sfx.add(au.sfx_pop(), stamp_t, 0.6)
    # the same groove simply continues under the new ending (no seam)
    nr.groove(music, S[2], total, 112, [(["F3", "A3", "C4", "E4"], "F2"), (["E3", "G3", "B3", "D4"], "E2"),
                                         (["D3", "F3", "A3", "C4"], "D2"), (["C3", "E3", "G3", "B3"], "C2")],
              drums=True, keys="ep", vel=0.9, octave=12)
    for k in (2, 3):
        sfx.add(au.sfx_whoosh(0.35), max(0, S[k] - 0.2), 0.4)
    for ln in segs[3].lines[:3]:
        sfx.add(au.sfx_tick(), S[3] + ln.t0, 0.7)
        sfx.add(au.sfx_ding(1568), S[3] + ln.t0 + 0.3, 0.45)
    sfx.add(au.sfx_ding(2093), S[3] + segs[3].lines[3].t0, 0.6)
    sfx.add(au.sfx_impact(), S[3] + segs[3].lines[3].t0, 0.5)
    # new ending: only soft transitions, nothing loud on the call to action
    sfx.add(au.sfx_swish(0.25), max(0, S[4] - 0.08), 0.25)
    sfx.add(au.sfx_swish(0.25), max(0, S[5] - 0.08), 0.18)
    nr.beat_sfx(sfx, segs)  # new scenes have jump=False, so this only covers the kept part
    path = os.path.join(OUT_DIR, "video_d2.wav")
    nr.mix(total, voice, music, sfx, path)
    return path


if __name__ == "__main__":
    scenes, voice, total, segs = build()
    S = [round(s.start, 2) for s in segs]
    review = bool(tts.MISSING) or SERVICE_NAME.startswith("［")
    print("total", round(total, 2), "starts", S, "missing", tts.MISSING, "review", review)
    prev = [float(x) for x in sys.argv[1:]] or [0.5, 3.0, 9.0, 13.8, S[4] + 0.1, S[4] + 1.5, S[5] + 0.1, S[5] + 1.5,
                                                 S[6] + 0.1, S[6] + 0.3, total - 0.1]
    wav = build_audio(total, voice, segs)
    out = os.path.join(OUT_DIR, "video_d2_consult" + ("_REVIEW" if review else "") + ".mp4")
    render_video(scenes, wav, out, preview_times=prev, global_overlays=[nr.ProgressBar(total)])
    print("done", out)
