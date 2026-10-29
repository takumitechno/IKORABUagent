"""Fit a video's timing file to its narration take.

    python3 fit_audio.py 03_seishain [more names...]

Reads ../narration/<name>_jin.mp3, ../narration/scripts.json (subtitle cues per video) and, when present,
../narration/<name>_words.json (ASR word times, used only to place marks inside a line). Writes
../timing/<name>.json: subtitles follow the voice, scenes switch in the pauses before their first line, and
the take is used at its recorded speed. When scripts.json gives a title for the video, the take is expected to
open by reading it and that part is not used (the subtitles start with paragraph 1); give "" as the title when
the take starts directly with paragraph 1. Re-running overwrites hand edits to that file.
"""
import json
import os
import re
import sys

import mc  # noqa: F401  (puts the shared engine on sys.path)
import align_clips as ac

NARR = os.path.join(mc.ROOT, "narration")
LEAD = 0.3          # video time at which the first line starts
PRE = 0.12          # audio kept before the first line
TAIL = 2.4          # hold after the last word (closing screen stays readable)
SCENE_LEAD = 0.22   # scene cut this much before its first line
SUB_HOLD = 0.45     # subtitle stays up after its line when a long pause follows

PLANS = {
    "03_seishain": dict(
        scenes=[("s1", "p1a", "履歴書の職歴欄で手が止まる"), ("s2", "p2", "メモ「書くことがない？」"),
                ("s3", "p3a", "勤務中のイメージ（接客→新人に教える）"), ("s4", "p4a", "経験の整理メモ"),
                ("s5", "p5a", "履歴書・面接準備の2項目"), ("s6", "p6a", "最終CTA")],
        telops=[("hook", "正社員経験なし。\n職歴、{何を書けばいい？}", ("scene", "s1")),
                ("s2", "書くことがない？", ("cue", "p2")),
                ("s3", "{これまで働いてきた}経験", ("scene", "s3")),
                ("s4", "{実際にやってきたこと}から", ("cue", "p4b")),
                ("s5", "{初めての応募準備}を相談", ("scene", "s5"))],
        marks=[("s1_resume", "p1b", "履歴|歴史"), ("s3_teach", "p3b", None), ("s4_item1", "p4a", "毎日"),
               ("s4_item2", "p4a", "新人"), ("s5_resume", "p5b", "履歴|歴史"), ("s5_interview", "p5b", "面接")],
    ),
    "01_yaritai_shigoto": dict(
        scenes=[("s1", "p1a", "勤務後、自宅で求人を保存するだけ"), ("s2", "p2a", "休日／仕事内容の2枚のカード"),
                ("s3", "p3a", "メモ「今、変えたいこと」"), ("s4", "p4a", "これまでの仕事＋これからの希望→求人選び"),
                ("s5", "p5a", "最終CTA")],
        telops=[("hook", "接客を辞めたい。\nでも、{次が決まらない。}", ("scene", "s1")),
                ("s3", "{今の何を変えたい？}", ("cue", "p3b")),
                ("s4", "{次に探す求人}を相談", ("scene", "s4"))],
        marks=[("s1_home", "p1b", None), ("s1_phone", "p1c", None), ("s1_save", "p1c", "保存"),
               ("s2_rest", "p2a", "不規則|休み"), ("s2_work", "p2b", None), ("s2_work_hl", "p2b", "仕事"),
               ("s3_blank", "p3a", "決まって"), ("s4_prev", "p4b", None), ("s4_hope", "p4b", "希望"),
               ("s4_jobs", "p4b", "求人|急事|選び")],
    ),
    "04_korekara_no_hatarakikata": dict(
        scenes=[("s1", "p1a", "出勤と日常業務の繰り返し"), ("s2", "p2a", "帰宅後に一息つく"),
                ("s3", "p3a", "ノート「これから」"), ("s4", "p4a", "今の経験＋これからの希望"), ("s5", "p5a", "最終CTA")],
        telops=[("hook", "仕事には慣れた。\nでも、{この先は？}", ("scene", "s1")),
                ("s2", "大きな不満はない。\nでも、{迷う。}", ("scene", "s2")),
                ("s3", "この先、{どう働きたい？}", ("scene", "s3")),
                ("s4", "{今後のキャリア}を相談", ("scene", "s4"))],
        marks=[("s1_b", "p1b", None), ("s3_h1", "p3b", "仕事"), ("s3_h2", "p3b", "働き方|働"),
               ("s4_left", "p4a", "経験"), ("s4_right", "p4a", "希望"), ("s4_long", "p4b", None)],
    ),
    "05_skill_fuan": dict(
        scenes=[("s1", "p1a", "資格の検索と参考書"), ("s2", "p2", "メモ「どんな仕事に使いたい？」"),
                ("s3", "p3a", "考えたい仕事⇄資格・必要な準備"), ("s4", "p4a", "今の経験・希望→仕事の選択肢"),
                ("s5", "p5a", "最終CTA")],
        telops=[("hook", "転職したい。\nじゃあ、{とりあえず資格？}", ("scene", "s1")),
                ("s2", "どんな仕事に\n使いたい？", ("cue", "p2")),
                ("s3", "仕事選びと、{準備をセットで}", ("scene", "s3")),
                ("s4", "{仕事の選択肢}を相談", ("scene", "s4"))],
        marks=[("s1_photo", "p1b", None), ("s3_prep", "p3a", None), ("s3_job", "p3b", None),
               ("s3_set", "p3b", "セット"), ("s4_exp", "p4b", "経験"), ("s4_hope", "p4b", "希望"),
               ("s4_opts", "p4b", "選択肢|仕事")],
    ),
    "02_jibun_no_tsuyomi": dict(
        scenes=[("s1", "p1a", "自己PR欄（模式図）で手が止まる"), ("s2", "p2a", "経験の例：提案・新人への説明"),
                ("s3", "p3a", "「接客」から2つの行動へ"), ("s4", "p4a", "実際にしたこと→応募先に伝えること"),
                ("s5", "p5a", "最終CTA")],
        telops=[("hook", "『接客してました』で、\n{終わってない？}", ("scene", "s1")),
                ("s2a", "{希望を聞く} → {提案}", ("cue", "p2a", "p2b")),
                ("s2b", "{手順を説明} → {確認}", ("cue", "p2b")),
                ("s3", "その中で、{どう動いた？}", ("cue", "p3b")),
                ("s4", "{経験の伝え方}を相談", ("scene", "s4"))],
        marks=[("s2_teach", "p2b", None), ("s3_root", "p3a", None), ("s3_card1", "p3b", None),
               ("s3_card2", "p3b", "どう|動"), ("s4_top", "p4a", None), ("s4_bottom", "p4b", None)],
    ),
}


def phrase_time(words, a, b, pattern, text, frac_fallback):
    """Start of `pattern` inside the line spoken between a and b (ASR words, else by text position)."""
    inside = [w for w in words if a - 0.15 <= w[0] <= b + 0.05]
    joined, starts = "", []
    for w in inside:
        for _ in w[2]:
            starts.append(w[0])
        joined += w[2]
    for p in pattern.split("|"):
        k = joined.find(p)
        if k >= 0:
            return max(a, starts[k])
    k = max(0, min(text.find(p) for p in pattern.split("|") if text.find(p) >= 0) if any(p in text for p in pattern.split("|")) else 0)
    return a + (b - a) * frac_fallback(k)


def fit(name):
    title, cues = json.load(open(os.path.join(NARR, "scripts.json"), encoding="utf-8"))[name]
    plan = PLANS[name]
    take = os.path.join(NARR, f"{name}_jin.mp3")
    x = ac.load(take)
    chunks = ac.speech_chunks(x)
    lines = ([title] if title else []) + [t.replace("\n", "") for _, t in cues]
    _, spans = ac.align_phrases(chunks, lines)
    title_span, spans = (spans[0], spans[1:]) if title else (None, spans)
    cut = spans[0][0] - PRE
    shift = LEAD - cut
    wpath = os.path.join(NARR, f"{name}_words.json")
    words = json.load(open(wpath, encoding="utf-8"))["words"] if os.path.exists(wpath) else []
    voice = {cid: (a + shift, b + shift) for (cid, _), (a, b) in zip(cues, spans)}
    total = round(spans[-1][1] + shift + TAIL, 2)

    starts = [0.0] + [round(voice[cid][0] - SCENE_LEAD, 2) for sid, cid, _ in plan["scenes"][1:]]
    scenes = [{"id": sid, "start": s, "end": e, "note": note}
              for (sid, _, note), s, e in zip(plan["scenes"], starts, starts[1:] + [total])]
    scene_of = {}
    for sc in scenes:
        for cid, _ in cues:
            if sc["start"] <= voice[cid][0] < sc["end"]:
                scene_of[cid] = sc
    subs = []
    for k, (cid, text) in enumerate(cues):
        a, b = voice[cid]
        sc = scene_of[cid]
        if k + 1 < len(cues):
            na = voice[cues[k + 1][0]][0] - 0.06   # next subtitle's start
            end = na - 0.02 if (na - b < 1.2 and scene_of[cues[k + 1][0]] is sc) else min(b + SUB_HOLD, sc["end"] - 0.05, na - 0.02)
        else:
            end = total - 0.15
        subs.append({"id": cid, "start": round(max(0.0, a - 0.06), 2), "end": round(end, 2), "text": text})
    span_of = {s["id"]: s for s in scenes}
    telops = []
    for tid, text, (kind, ref, *until) in plan["telops"]:
        if kind == "scene":
            sc = span_of[ref]
            a = 0.0 if sc["start"] == 0 else sc["start"] + 0.1
        else:
            sc = scene_of[ref]
            a = voice[ref][0] - 0.05
        end = voice[until[0]][0] - 0.12 if until else sc["end"] - 0.1   # until: hand over to the next telop
        telops.append({"id": tid, "start": round(a, 2), "end": round(end, 2), "text": text})
    marks = {}
    cue_text = dict(cues)
    for key, cid, pattern in plan["marks"]:
        a, b = voice[cid]
        if pattern is None:
            marks[key] = round(a, 2)
            continue
        t = cue_text[cid].replace("\n", "")
        frac = lambda k, t=t: len(re.sub(r"[、。！？「」]", "", t[:k])) / max(1, len(re.sub(r"[、。！？「」]", "", t)))
        marks[key] = round(phrase_time(words, a - shift, b - shift, pattern, t, frac) + shift, 2)

    dropped = f"音声冒頭のタイトル読み上げ（{title_span[0]:.2f}〜{title_span[1]:.2f}秒）は使わず、" if title_span else ""
    data = {
        "video": f"{name}.mp4",
        "status": (f"ナレーション（{os.path.basename(take)}）に合わせた時刻。速度は変えていない。"
                   f"{dropped}{cut:.2f}秒以降を動画の{LEAD:.2f}秒から置いている。"),
        "audio": {"file": f"../narration/{os.path.basename(take)}", "cut": round(cut, 3), "at": LEAD},
        "scenes": scenes, "subtitles": subs, "telops": telops, "marks": marks,
    }
    with open(os.path.join(mc.ROOT, "timing", f"{name}.json"), "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    note = f"title {title_span[0]:.2f}-{title_span[1]:.2f}s dropped, " if title_span else ""
    print(f"{name}: total {total:.2f}s, {note}cut at {cut:.2f}s")
    for s in subs:
        print(f"  {s['id']:5s} {s['start']:6.2f}-{s['end']:6.2f}  {s['text'].replace(chr(10), ' ')}")
    print("  marks", marks)


if __name__ == "__main__":
    for n in sys.argv[1:]:
        fit(n)
