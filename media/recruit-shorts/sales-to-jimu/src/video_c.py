"""Video C: 診断フック型「これ3つ当てはまったら、営業向いてないかも」(ナレーション付き)."""
import os
import sys

from PIL import Image

import audio as au
import narrated as nr
import tts
from cards2 import ChecklistCard, ReframeCard, hook_shot
from engine import OUT_DIR, H, W, Photo, Telop, render_video, text_block
from ui import QuotaCard, Static, cta_button, note_pill, vertical_gradient

L = nr.Line
RED = (236, 72, 86)


def black(dur):
    base = Image.new("RGBA", (W, H), (8, 8, 12, 255))
    return lambda t: base.copy()


def credit_text():
    if tts.backend_name() == "voicevox":
        return "VOICEVOX:" + os.environ.get("VOICEVOX_CREDIT", "青山龍星")
    return None


def callout(text, bg=RED):
    """Audience call-out tag shown from frame 0 ('who is this for')."""
    from video_b import pill
    return pill(text, 42, bg=bg + (255,), fg=(255, 255, 255), padx=34, pady=16, weight=900)


def segments():
    p1 = Photo("a1_train.jpg", "cold")
    p2 = Photo("a2_phone.jpg", "cold")
    p3 = Photo("a3_street.jpg", "harsh")
    p5 = Photo("a5_home.jpg", "night")
    p6 = Photo("a6_jimu_pc.jpg", "warm")
    p7 = Photo("a7_jimu_support.jpg", "warm", darken=0.25)
    p8 = Photo("a8_sunset.jpg", "warm")

    segs = [
        nr.Segment([L("これ、みっつ当てはまったら、営業、向いてないかも。",
                      "これ{3つ}当てはまったら\n{営業、向いてない}かも", size=102, cy=1180)],
                   hook_shot(p1, 1.2, (0.56, 0.3), (0.56, 0.34), punch=0.2, seed=0.4),
                   extra=lambda s: [Telop(callout("営業職の人へ"), W / 2, 330, -1, 99, anim="pop")],
                   lead=0.02, hits=lambda s: [0.0]),
        nr.Segment([L("ひとつ。断られると、いちにち、ずっと引きずる。")],
                   nr.shot(p2, 1.16, 1.24, (0.6, 0.3), (0.62, 0.28), seed=1.0)),
        nr.Segment([L("ふたつ。数字の話になると、胃が痛い。")],
                   nr.shot(p3, 1.18, 1.1, (0.58, 0.2), (0.55, 0.26), seed=2.0),
                   extra=lambda s: [QuotaCard(0.0, 99, 330)]),
        nr.Segment([L("みっつ。本当は、裏で支える方が好き。")],
                   nr.shot(p5, 1.16, 1.24, (0.6, 0.85), (0.62, 1.0), seed=3.0, shake=2.0)),
        nr.Segment([L("全部当てはまった人。", "全部 当てはまった人…", size=88, cy=960, anim="up")],
                   black, lead=0.18, tail=0.3, jump=False),
        nr.Segment([L("それ、事務職なら、強みです。", "それ、{事務職なら強み}です", size=94, cy=1240)],
                   nr.shot(p6, 1.0, 1.1, (0.3, 0.5), (0.34, 0.45), seed=5.0), trans="flash", trans_dur=0.25,
                   hits=lambda s: [s.lines[0].beats[-1]]),
        nr.Segment([L("引きずるのは、相手の気持ちに敏感だから。"),
                    L("数字が苦手なのは、コツコツ正確に進めたいから。"),
                    L("裏方が好きなのは、人を支える力があるから。")],
                   nr.shot(p7, 1.04, 1.0, (0.45, 0.3), (0.5, 0.36), seed=6.0),
                   extra=lambda s: [ReframeCard([("断られて引きずる", "相手の気持ちに敏感"),
                                                 ("数字が苦手", "コツコツ正確に進められる"),
                                                 ("裏方が好き", "人を支える力")],
                                                [ln.t0 for ln in s.lines], cy=1210)],
                   trans="xfade", trans_dur=0.18),
        nr.Segment([L("未経験から、事務職へ。相談は、プロフィールのリンクから。")],
                   nr.shot(p8, 1.12, 1.22, (0.5, 0.55), (0.5, 0.95), seed=7.0, shake=2.0),
                   extra=lambda s: cta_overlays(s), trans="xfade", trans_dur=0.25, tail=1.4),
    ]
    return segs


def cta_overlays(seg):
    out = [Static(vertical_gradient(0, 225, 0.38)),
           Telop(note_pill("※画像はAI生成によるイメージです　※求人の内容・条件は企業により異なります"), W / 2, 175, 0.2, 99, anim="up"),
           Telop(text_block("未経験から、\n{事務職へ。}", size=100), W / 2, 1075, 0.05, 99, anim="up"),
           Telop(cta_button("まずは転職相談から ▶"), W / 2, 1300, 0.6, 99, anim="pop", pulse=True),
           Telop(text_block("プロフィールのリンクから", size=40, weight=700), W / 2, 1418, 0.8, 99, anim="up")]
    c = credit_text()
    if c:
        out.append(Telop(note_pill(c), W / 2, 1500, 1.0, 99, anim="up"))
    return out


def build():
    segs = segments()
    scenes, voice, total = nr.build(segs)
    items = ["断られると1日ずっと引きずる", "数字の話になると胃が痛い", "本当は裏で支える方が好き"]
    times = [segs[k].lines[0].g0 for k in (1, 2, 3)]
    check = ChecklistCard(items, times, segs[4].start - 0.02, cy=1300)
    return scenes, voice, total, segs, check


def build_audio(total, voice, segs, check):
    music, sfx = au.Bus(total), au.Bus(total)
    S = [s.start for s in segs]
    # tense, driving part (hook + checklist)
    nr.groove(music, 0.0, S[4], 112, [(["A3", "C4", "E4"], "A1"), (["F3", "A3", "C4"], "F1"),
                                       (["D3", "F3", "A3"], "D2"), (["E3", "G#3", "B3"], "E2")],
              drums=True, keys="piano", vel=0.8, octave=0, hats=True, kick_pattern=(0, 2))
    # frame-0 scroll stopper: phone buzz + impact + whoosh
    sfx.add(au.sfx_impact(), 0.0, 0.9)
    sfx.add(au.sfx_buzz(0.6), 0.0, 0.8)
    sfx.add(au.sfx_whoosh(0.35), 0.0, 0.5)
    # black card: music drops out, heartbeat, riser into the pivot
    sfx.add(au.sfx_heartbeat(), S[4] + 0.1, 0.9)
    sfx.add(au.sfx_riser(1.0), S[5] - 1.0, 0.8)
    sfx.add(au.sfx_impact(), S[5], 0.9)
    sfx.add(au.sfx_bass_drop(), S[5], 0.8)
    nr.groove(music, S[5], total, 116, [(["C4", "E4", "G4"], "C2"), (["G3", "B3", "D4"], "G2"),
                                         (["A3", "C4", "E4"], "A2"), (["F3", "A3", "C4"], "F2")],
              drums=True, keys="piano", vel=0.9)
    for k in (1, 2, 3, 6, 7):
        sfx.add(au.sfx_whoosh(0.35), max(0, S[k] - 0.2), 0.4)
    for ct in check.check_times():
        sfx.add(au.sfx_tick(), ct, 0.75)
        sfx.add(au.sfx_ding(1568), ct + 0.05, 0.4)
    for ln in segs[6].lines:
        sfx.add(au.sfx_blip(), segs[6].start + ln.t0, 0.7)
    sfx.add(au.sfx_impact(), S[5] + segs[5].hit_times[0], 0.6)
    sfx.add(au.sfx_chime(), S[7] + 0.6, 0.75)
    nr.beat_sfx(sfx, segs)
    path = os.path.join(OUT_DIR, "video_c.wav")
    nr.mix(total, voice, music, sfx, path)
    return path


if __name__ == "__main__":
    scenes, voice, total, segs, check = build()
    print("backend", tts.backend_name(), "total", round(total, 2), "starts", [round(s.start, 2) for s in segs])
    wav = build_audio(total, voice, segs, check)
    prev = [float(x) for x in sys.argv[1:]]
    if not prev:
        prev = [0.0, 0.5, 1.5] + [s.start + min(1.0, s.dur * 0.6) for s in segs[1:]] + [total - 0.3]
    out = os.path.join(OUT_DIR, f"video_c_hook_check_{tts.backend_name()}.mp4")
    render_video(scenes, wav, out, preview_times=prev, global_overlays=[check, nr.ProgressBar(total)])
    print("done", out)
