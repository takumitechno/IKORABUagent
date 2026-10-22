"""Render selected frames of a video module to a contact sheet (no encoding)."""
import importlib, sys
from PIL import Image
from engine import build_timeline, Finisher, FPS
mod = importlib.import_module(sys.argv[1])
res = mod.build()
scenes = res[0] if isinstance(res, tuple) else res
build_timeline(scenes)
fin = Finisher()
times = [float(x) for x in sys.argv[3:]]
ims = []
for t in times:
    k = max(j for j, s in enumerate(scenes) if s.start <= t)
    s = scenes[k]
    fr = s.render(t - s.start).convert("RGB")
    ims.append(Image.fromarray(fin.apply(fr, int(t * FPS))).resize((360, 640)))
cols = min(5, len(ims)); rows = (len(ims) + cols - 1) // cols
sheet = Image.new("RGB", (cols * 360, rows * 640))
for i, im in enumerate(ims):
    sheet.paste(im, ((i % cols) * 360, (i // cols) * 640))
sheet.save(sys.argv[2], quality=85)
