"""Render chosen frames of a video into one contact sheet, without encoding, to check the layout quickly.

    python3 preview.py v03_seishain 0.8 3.2 5.8 12.0      → ../out/preview/03_seishain_sheet.jpg
"""
import importlib
import os
import sys

from PIL import Image, ImageDraw

import mc
from engine import Finisher, build_timeline


def sheet(module, times, cols=6, tile=(360, 640)):
    sys.path.insert(0, os.path.join(mc.ROOT, "src"))   # the video scripts of the current project
    mod = importlib.import_module(module)
    name = getattr(mod, "NAME", module[1:])            # v03_seishain -> timing/03_seishain.json
    tm = mc.Timing(name)
    scenes = mod.build(tm)
    build_timeline(scenes)
    overlays = (([mc.disclaimer(tm.total)] if getattr(mod, "AI_NOTE", True) else [])
                + [mc.Subtitles(tm.subs, telops=tm.data.get("telops", []))])
    fin = Finisher()
    tiles = []
    for t in times:
        k = max(i for i, s in enumerate(scenes) if s.start <= t)
        fr = scenes[k].render(t - scenes[k].start)
        for o in overlays:
            o.draw(fr, t)
        im = Image.fromarray(fin.apply(fr.convert("RGB"), 0)).resize(tile)
        ImageDraw.Draw(im).text((8, 8), f"{t:.1f}s", fill=(255, 0, 0))
        tiles.append(im)
    cols = min(cols, len(tiles))
    rows = (len(tiles) + cols - 1) // cols
    out = Image.new("RGB", (cols * tile[0], rows * tile[1]), "white")
    for i, im in enumerate(tiles):
        out.paste(im, ((i % cols) * tile[0], (i // cols) * tile[1]))
    path = os.path.join(mc.OUT_DIR, "preview", f"{name}_sheet.jpg")
    os.makedirs(os.path.dirname(path), exist_ok=True)
    out.save(path, quality=88)
    return path


if __name__ == "__main__":
    print(sheet(sys.argv[1], [float(x) for x in sys.argv[2:]]))
