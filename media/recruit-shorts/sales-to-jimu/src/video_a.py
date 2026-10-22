"""Video A: 営業がつらい→事務職 共感ストーリー型 (35.5s, 9:16)."""
import os
import sys

import numpy as np

import audio as au
from engine import OUT_DIR, W, Photo, Telop, photo_scene, render_video, text_block
from ui import Notification, QuotaCard, Static, cta_button, note_pill, speech_bubble, vertical_gradient

TY = 1320  # main telop centre line


def T(text, t_in, t_out, size=70, cy=TY, anim="pop", **kw):
    return Telop(text_block(text, size=size, **kw), W / 2, cy, t_in, t_out, anim=anim)


def build():
    p1 = Photo("a1_train.jpg", "cold")
    p2 = Photo("a2_phone.jpg", "cold")
    p3 = Photo("a3_street.jpg", "harsh")
    p4 = Photo("a4_night_office.jpg", "night")
    p5 = Photo("a5_home.jpg", "home")
    p6 = Photo("a6_jimu_pc.jpg", "warm")
    p7 = Photo("a7_jimu_support.jpg", "warm")
    p8 = Photo("a8_sunset.jpg", "warm")

    scenes = []
    # S1 hook: commuter train + boss notifications
    scenes.append(photo_scene(p1, 4.2, 1.04, 1.14, (0.55, 0.42), (0.55, 0.47), seed=0.3, overlays=[
        T("営業、向いてないかも…\nって思ってる人へ", 0.12, 2.05, size=84, cy=1250),
        Notification(0.75, 99, 250, "チャット", "佐藤課長", "明日の朝イチで、今月の数字を報告して。", "22:47"),
        Notification(1.85, 99, 452, "チャット", "佐藤課長", "未達の理由もまとめておくように。", "22:48"),
        T("帰りの電車でも\n{仕事の通知}が止まらない", 2.15, 4.15, size=74),
    ]))
    # S2 cold calls
    scenes.append(photo_scene(p2, 4.2, 1.08, 1.2, (0.5, 0.42), (0.6, 0.4), seed=1.1, overlays=[
        T("テレアポ100件。\n断られるたびに\n{自分を否定された}気がした", 0.2, 4.1),
    ]))
    # S3 outside sales in summer heat + quota tile
    scenes.append(photo_scene(p3, 3.8, 1.12, 1.04, (0.55, 0.3), (0.5, 0.38), seed=2.0, overlays=[
        QuotaCard(0.25, 99, 330),
        T("炎天下の外回り。\n『{今月あと200万}』が\n頭から離れない", 0.15, 3.7),
    ], trans="xfade", trans_dur=0.2))
    # S4 late night office
    scenes.append(photo_scene(p4, 3.8, 1.0, 1.12, (0.5, 0.62), (0.46, 0.64), shake=2.0, seed=3.0, overlays=[
        T("『数字が取れない自分は\n{ダメなんだ}』って\nずっと思ってた", 0.2, 3.7),
    ], trans="xfade", trans_dur=0.3))
    scenes[-1].fade_out = 0.35
    # S5 turning point at home
    scenes.append(photo_scene(p5, 4.0, 1.12, 1.0, (0.62, 0.45), (0.6, 0.5), shake=1.5, seed=4.0, overlays=[
        T("でも…", 0.55, 1.7, size=120, cy=1180, anim="punch"),
        T("『向いてない』は\n{『ダメ』じゃない。}", 1.75, 3.95, size=86, cy=1260),
    ], trans="black", trans_dur=0.5))
    # S6 office job: calm focus
    scenes.append(photo_scene(p6, 4.4, 1.0, 1.1, (0.3, 0.5), (0.34, 0.45), seed=5.0, overlays=[
        T("コツコツ正確に進める。\n誰かの仕事を支える。\nそれが{得意な人}もいる。", 0.25, 4.3, size=68),
    ], trans="flash", trans_dur=0.35))
    # S7 supporting the team
    scenes.append(photo_scene(p7, 4.4, 1.06, 1.0, (0.4, 0.42), (0.48, 0.45), seed=6.0, overlays=[
        Telop(speech_bubble("いつも助かってます！"), 760, 700, 0.8, 4.35, anim="pop"),
        T("電話対応・調整力・PC作業。\n営業で身につけた力は\n{事務でちゃんと活きる。}", 0.2, 4.3, size=68),
    ], trans="xfade", trans_dur=0.3))
    # S8 CTA
    disclaimer = note_pill("※画像はAI生成によるイメージです　※求人の内容・条件は企業により異なります")
    scenes.append(photo_scene(p8, 6.7, 1.12, 1.22, (0.5, 0.55), (0.5, 0.95), shake=2.0, seed=7.0, overlays=[
        Static(vertical_gradient(0, 225, 0.38)),
        Telop(disclaimer, W / 2, 175, 0.2, 99, anim="up"),
        T("未経験から、\n{事務職へ。}", 0.3, 99, size=100, cy=1075, anim="up"),
        T("まずは話を聞いてみませんか？", 1.0, 99, size=50, cy=1265, anim="up", weight=700),
        Telop(cta_button("まずは転職相談から ▶"), W / 2, 1400, 1.8, 99, anim="pop", pulse=True),
        T("プロフィールのリンクから", 2.0, 99, size=38, cy=1512, anim="up", weight=700),
    ], trans="xfade", trans_dur=0.35))
    return scenes


# ---------------------------------------------------------------- audio
def build_audio(total, starts):
    music = au.Bus(total)
    sfx = au.Bus(total)
    S = starts

    # --- part 1: melancholic piano, 72 bpm
    beat = 60 / 72
    bar = beat * 4
    prog1 = [("A", ["A3", "C4", "E4"], "A2"), ("F", ["F3", "A3", "C4"], "F2"),
             ("C", ["C4", "E4", "G4"], "C3"), ("G", ["G3", "B3", "D4"], "G2"),
             ("A", ["A3", "C4", "E4"], "A2")]
    for b, (_, tones, root) in enumerate(prog1):
        t0 = 0.0 + b * bar
        if t0 > 15.6:
            break
        mids = [au.n(x) for x in tones]
        arp = [mids[0] - 12, mids[2] - 12, mids[0], mids[1], mids[2], mids[1], mids[0], mids[2] - 12]
        for k, m in enumerate(arp):
            tt = t0 + k * beat / 2
            if tt > 15.7:
                break
            vel = 0.55 + 0.25 * (k == 0) - (0.15 if b == 4 else 0)
            music.add(au.piano(au.midi(m + 12), beat * 0.9, vel), tt, pan=-0.2 + 0.4 * (k % 2))
        music.add(au.pad([au.midi(x) for x in mids], min(bar, 16.0 - t0), cutoff=900, vel=0.8), t0)
        music.add(au.bass(au.midi(au.n(root)), min(bar, 16.0 - t0) * 0.95, 0.6), t0)

    # --- turning point
    t_but = S[4] + 0.55
    sfx.add(au.sfx_riser(1.3), S[4] - 1.35, 0.8)
    sfx.add(au.sfx_impact(), t_but, 0.9)

    # --- part 2: hopeful, 84 bpm
    beat = 60 / 84
    bar = beat * 4
    prog2 = [(["C4", "E4", "G4"], "C2"), (["G3", "B3", "D4"], "G2"), (["A3", "C4", "E4"], "A2"),
             (["F3", "A3", "C4"], "F2"), (["C4", "E4", "G4"], "C2"), (["G3", "B3", "D4"], "G2"),
             (["F3", "A3", "C4"], "F2"), (["C4", "E4", "G4"], "C2")]
    t_p2 = t_but
    for b, (tones, root) in enumerate(prog2):
        t0 = t_p2 + b * bar
        if t0 > total:
            break
        mids = [au.n(x) for x in tones]
        last = b == len(prog2) - 1 or t0 + bar > total - 1.0
        if last:
            for m in mids:
                music.add(au.piano(au.midi(m + 12), 2.5, 0.7, bright=1.2), t0)
            music.add(au.pad([au.midi(x) for x in mids], 3.0, cutoff=1800), t0)
            music.add(au.bass(au.midi(au.n(root)), 2.5, 0.7), t0)
            break
        arp = [mids[0], mids[2], mids[0] + 12, mids[1] + 12, mids[2] + 12, mids[1] + 12, mids[0] + 12, mids[2]]
        for k, m in enumerate(arp):
            music.add(au.piano(au.midi(m + 12), beat * 0.8, 0.5 + 0.25 * (k == 0), bright=1.2),
                      t0 + k * beat / 2, pan=-0.25 + 0.5 * (k % 2))
        music.add(au.pad([au.midi(x) for x in mids], bar, cutoff=1800, vel=1.0), t0)
        music.add(au.bass(au.midi(au.n(root)), bar * 0.95, 0.75), t0)
        if b >= 1:  # light groove after the turn
            for q in range(4):
                tb = t0 + q * beat
                if q in (0, 2):
                    music.add(au.kick(0.7), tb)
                if q in (1, 3):
                    music.add(au.snare(0.45), tb)
                for e in range(2):
                    music.add(au.shaker(0.9 if e else 0.6), tb + e * beat / 2, pan=0.3)

    mus = au.reverb(music.buf, 2.2, 0.28)

    # --- ambience beds
    def amb(sig, start, gain):
        sfx.add(sig, start, gain)
    rng = np.random.default_rng(5)
    # train rumble + rail joints
    tdur = S[1] - S[0]
    rum = au.filt(rng.normal(0, 1, int(tdur * au.SR)), "bandpass", [50, 320]) * 0.5
    for k in range(int(tdur / 0.9)):
        i = int((0.3 + k * 0.9) * au.SR)
        cl = au.filt(rng.normal(0, 1, 2400), "lowpass", 600) * np.exp(-np.arange(2400) / 300)
        rum[i:i + 2400] += cl[: len(rum) - i] * 1.6
    amb(rum, S[0], 0.12)
    # office murmur for cold-call scene
    od = S[2] - S[1]
    amb(au.filt(rng.normal(0, 1, int(od * au.SR)), "bandpass", [200, 1200]) * 0.4, S[1], 0.06)
    # cicadas (Japanese summer) for the outside-sales scene
    cd = S[3] - S[2] + 0.2
    tt = au.tl(cd)
    cic = au.filt(rng.normal(0, 1, len(tt)), "bandpass", [3800, 6500])
    cic *= (0.6 + 0.4 * np.sin(2 * np.pi * 42 * tt)) * (0.7 + 0.3 * np.sin(2 * np.pi * 0.7 * tt))
    amb(cic * np.minimum(1, tt / 0.3), S[2], 0.07)
    # night office HVAC hum
    nd = S[4] - S[3]
    amb(au.filt(rng.normal(0, 1, int(nd * au.SR)), "lowpass", 220) * 0.6, S[3], 0.08)

    # --- sfx
    sfx.add(au.sfx_pop(), 0.12, 0.7)
    sfx.add(au.sfx_ping(), S[0] + 0.75, 0.9)
    sfx.add(au.sfx_ping(), S[0] + 1.85, 0.9)
    sfx.add(au.sfx_pop(), S[0] + 2.15, 0.6)
    sfx.add(au.sfx_busy(3), S[1] + 0.05, 0.55, pan=0.15)
    sfx.add(au.sfx_pop(), S[1] + 0.2, 0.5)
    sfx.add(au.sfx_whoosh(0.45), S[2] - 0.15, 0.5)
    sfx.add(au.sfx_pop(), S[3] + 0.2, 0.45)
    sfx.add(au.sfx_pop(), S[4] + 1.75, 0.5)
    sfx.add(au.sfx_whoosh(0.5), S[5] - 0.3, 0.5)
    sfx.add(au.sfx_pop(), S[5] + 0.25, 0.5)
    sfx.add(au.sfx_blip(), S[6] + 0.8, 0.8)
    sfx.add(au.sfx_pop(), S[6] + 0.2, 0.5)
    sfx.add(au.sfx_whoosh(0.5), S[7] - 0.2, 0.45)
    sfx.add(au.sfx_chime(), S[7] + 1.8, 0.8)

    path = os.path.join(OUT_DIR, "video_a.wav")
    os.makedirs(OUT_DIR, exist_ok=True)
    au.master(mus * 0.9, sfx.buf, path, total=total, fade_out=1.0)
    return path


if __name__ == "__main__":
    from engine import build_timeline
    scenes = build()
    total = build_timeline(scenes)
    starts = [s.start for s in scenes]
    wav = build_audio(total, starts)
    prev = [float(x) for x in sys.argv[1:]] or [1.0, 3.5, 6.0, 10.0, 14.0, 18.5, 22.0, 26.5, 34.5]
    out = os.path.join(OUT_DIR, "video_a_sales_to_jimu_story.mp4")
    print("total", total)
    render_video(scenes, wav, out, preview_times=prev)
    print("done", out)
