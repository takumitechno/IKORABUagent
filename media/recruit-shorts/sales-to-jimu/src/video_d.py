"""Video D: 逆説フック型「営業→事務は『逃げ』？ 結論、逃げじゃない」(ナレーション付き)."""
import os
import sys

import audio as au
import narrated as nr
import tts
from cards2 import Punch, SkillList, hook_shot, stamp
from engine import OUT_DIR, W, Photo, Telop, render_video, text_block
from ui import cta_button, note_pill
from video_b import gradient_bg
from video_c import callout, credit_text

L = nr.Line


def stamp_time(line):
    """'結論、|逃げじゃないです' — the stamp lands on the second phrase."""
    return line.beats[1] if len(line.beats) > 1 else line.t0 + 0.4 * (line.t1 - line.t0)


def segments():
    b1 = Photo("b1_train.jpg", "cold", crop_top=0.09)
    b2 = Photo("b2_street.jpg", "harsh", crop_top=0.04)
    p6 = Photo("a6_jimu_pc.jpg", "warm")
    bg7 = Photo("a7_jimu_support.jpg", "warm", blur=26, darken=0.5)
    p4 = Photo("a4_night_office.jpg", "night")
    p8 = Photo("a8_sunset.jpg", "warm")

    seg_stamp = nr.Segment(
        [L("結論、逃げじゃないです。", "結論：", size=86, cy=880, anim="up")],
        nr.shot(b2, 1.14, 1.2, (0.5, 0.0), (0.52, 0.05), seed=1.7),
        extra=lambda s: [Punch(stamp("逃げじゃない"), W / 2, 1120, stamp_time(s.lines[0]))],
        hits=lambda s: [stamp_time(s.lines[0])], tail=0.25, jump=False)
    skills_seg = nr.Segment(
        [L("ひとつ、電話やメールの対応。"), L("ふたつ、取引先との日程調整。"), L("みっつ、見積書や資料づくり。"),
         L("これ全部、事務の仕事の、ど真ん中です。", "全部、{事務のど真ん中}", size=84, cy=1500)],
        lambda dur: (lambda t: bg7.render(1.0 + 0.06 * t / dur, 0.5, 0.5)),
        extra=lambda s: [SkillList(["電話・メール対応", "日程・スケジュール調整", "見積書・資料づくり"],
                                   [ln.t0 for ln in s.lines[:3]], finale_t=s.lines[3].t0, cy=930)],
        trans="xfade", trans_dur=0.15)
    segs = [
        nr.Segment([L("営業から事務への転職って、逃げだと思いますか？",
                      "営業→事務は\n{『逃げ』？}", size=126, cy=1160, hl=(255, 92, 92))],
                   hook_shot(b1, 1.16, (0.5, 0.25), (0.52, 0.3), punch=0.2, seed=0.8),
                   extra=lambda s: [Telop(callout("転職を迷ってる人へ", bg=(30, 30, 36)), W / 2, 330, -1, 99,
                                          anim="pop")],
                   lead=0.02, hits=lambda s: [0.0]),
        seg_stamp,
        nr.Segment([L("むしろ、営業経験がある人ほど、事務で重宝されることがあります。理由は、みっつ。",
                      subs=["むしろ", "{営業経験がある人}ほど", "事務で{重宝される}ことも", "理由は{3つ}"])],
                   nr.shot(p6, 1.0, 1.1, (0.3, 0.5), (0.34, 0.45), seed=5.0), trans="flash", trans_dur=0.2),
        skills_seg,
        nr.Segment([L("合わない場所で、すり減り続ける必要はありません。",
                      subs=["合わない場所で", "{すり減り続ける}", "必要はない"])],
                   nr.shot(p4, 1.0, 1.1, (0.5, 0.6), (0.46, 0.63), seed=3.0, shake=2.0), trans="xfade", trans_dur=0.18),
        nr.Segment([L("力を発揮できる場所を選ぶのも、立派なキャリアです。",
                      subs=["力を発揮できる場所を", "{選び直す}のも", "{立派なキャリア}"], sub_cy=1250)],
                   nr.shot(p8, 1.2, 1.25, (0.5, 0.6), (0.5, 0.85), seed=7.0, shake=2.0), trans="xfade", trans_dur=0.2),
        nr.Segment([L("未経験から、事務職へ。相談は、プロフィールのリンクからどうぞ。")],
                   lambda dur, g=gradient_bg((10, 18, 44), (14, 70, 92)): g, extra=lambda s: cta_overlays(),
                   trans="xfade", trans_dur=0.25, tail=1.4),
    ]
    return segs


def cta_overlays():
    out = [Telop(note_pill("※画像はAI生成によるイメージです　※求人の内容・条件は企業により異なります"), W / 2, 175, 0.2, 99, anim="up"),
           Telop(text_block("逃げじゃない。", size=72, hl=(255, 225, 77), weight=900), W / 2, 760, 0.0, 99, anim="up"),
           Telop(text_block("未経験から、\n{事務職へ。}", size=104), W / 2, 960, 0.1, 99, anim="up"),
           Telop(cta_button("まずは転職相談から ▶", c0=(46, 196, 182), c1=(37, 140, 230)), W / 2, 1200, 0.6, 99,
                 anim="pop", pulse=True),
           Telop(text_block("プロフィールのリンクから", size=40, weight=700), W / 2, 1318, 0.8, 99, anim="up")]
    c = credit_text()
    if c:
        out.append(Telop(note_pill(c), W / 2, 1400, 1.0, 99, anim="up"))
    return out


def build():
    segs = segments()
    scenes, voice, total = nr.build(segs)
    return scenes, voice, total, segs


def build_audio(total, voice, segs):
    music, sfx = au.Bus(total), au.Bus(total)
    S = [s.start for s in segs]
    stamp_t = S[1] + stamp_time(segs[1].lines[0])
    # tense pulse under the question, hard stop before the answer
    nr.groove(music, 0.0, S[1], 116, [(["D3", "F3", "A3"], "D1"), (["A#2", "D3", "F3"], "A#1")],
              drums=True, keys="ep", vel=0.75, octave=12, hats=True, kick_pattern=(0, 1, 2, 3))
    # frame-0 scroll stopper
    sfx.add(au.sfx_glitch(), 0.0, 0.8)
    sfx.add(au.sfx_impact(), 0.0, 0.85)
    sfx.add(au.sfx_whoosh(0.3), 0.0, 0.5)
    # answer: silence -> slam
    sfx.add(au.sfx_impact(), stamp_t, 1.0)
    sfx.add(au.sfx_bass_drop(), stamp_t, 0.9)
    sfx.add(au.sfx_pop(), stamp_t, 0.6)
    nr.groove(music, S[2], total, 112, [(["F3", "A3", "C4", "E4"], "F2"), (["E3", "G3", "B3", "D4"], "E2"),
                                         (["D3", "F3", "A3", "C4"], "D2"), (["C3", "E3", "G3", "B3"], "C2")],
              drums=True, keys="ep", vel=0.9, octave=12)
    for k in (2, 3, 4, 5, 6):
        sfx.add(au.sfx_whoosh(0.35), max(0, S[k] - 0.2), 0.4)
    for ln in segs[3].lines[:3]:
        sfx.add(au.sfx_tick(), S[3] + ln.t0, 0.7)
        sfx.add(au.sfx_ding(1568), S[3] + ln.t0 + 0.3, 0.45)
    sfx.add(au.sfx_ding(2093), S[3] + segs[3].lines[3].t0, 0.6)
    sfx.add(au.sfx_impact(), S[3] + segs[3].lines[3].t0, 0.5)
    sfx.add(au.sfx_chime(), S[6] + 0.6, 0.75)
    nr.beat_sfx(sfx, segs)
    path = os.path.join(OUT_DIR, "video_d.wav")
    nr.mix(total, voice, music, sfx, path)
    return path


if __name__ == "__main__":
    scenes, voice, total, segs = build()
    print("backend", tts.backend_name(), "total", round(total, 2), "starts", [round(s.start, 2) for s in segs])
    wav = build_audio(total, voice, segs)
    prev = [float(x) for x in sys.argv[1:]]
    if not prev:
        prev = [0.0, 0.5, 1.5] + [s.start + min(1.0, s.dur * 0.6) for s in segs[1:]] + [total - 0.3]
    out = os.path.join(OUT_DIR, f"video_d_hook_nige_{tts.backend_name()}.mp4")
    render_video(scenes, wav, out, preview_times=prev, global_overlays=[nr.ProgressBar(total)])
    print("done", out)
