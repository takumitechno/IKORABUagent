"""Vectorise the official Takumi Technologies logos into SVG path data (logo-paths.json).

Shapes are traced as-is (no redesign). Requires: pip install pillow potracer numpy
"""
from PIL import Image
import numpy as np, potrace, json
import pathlib
HERE=pathlib.Path(__file__).resolve().parent
def load(fn):
    im=np.asarray(Image.open(fn).convert('RGB')).astype(float)
    r,g,b=im[...,0],im[...,1],im[...,2]
    lum=(r*.299+g*.587+b*.114)
    return im,r,g,b,lum
def trace(gray, box, scale, thr=128, turd=4):
    x0,y0,x1,y1=box
    crop=Image.fromarray(np.clip(gray[y0:y1,x0:x1],0,255).astype(np.uint8))
    up=crop.resize(((x1-x0)*scale,(y1-y0)*scale),Image.LANCZOS)
    arr=np.asarray(up)>thr
    bm=potrace.Bitmap(~arr)
    pl=bm.trace(turdsize=turd*scale*scale//4, turnpolicy=potrace.POTRACE_TURNPOLICY_MINORITY, alphamax=1.0, opticurve=True, opttolerance=0.2)
    f=lambda p:f"{p.x/scale+x0:.1f} {p.y/scale+y0:.1f}"
    d=[]
    for c in pl:
        d.append('M'+f(c.start_point))
        for s in c.segments:
            if s.is_corner: d.append('L'+f(s.c)+'L'+f(s.end_point))
            else: d.append('C'+f(s.c1)+' '+f(s.c2)+' '+f(s.end_point))
        d.append('Z')
    return ''.join(d), len(pl)
out={}
im,r,g,b,lum=load(HERE/'brand/takumi-logo-square-white.png')
red=np.clip((r-g-40)*3,0,255)
inkg=255-lum; inkg[red>60]=0
k=inkg.copy(); k[:, 885:]=0
out['sq_kanji'],n1=trace(k,(380,250,885,815),4)
out['sq_seal'],n2=trace(red,(895,695,985,792),10)
out['sq_word'],n3=trace(inkg,(200,830,1056,940),4)
redpx=im[red>200]; out['sq_red']='#%02x%02x%02x'%tuple(int(v) for v in np.median(redpx,axis=0))
print('sq',n1,n2,n3,out['sq_red'])
im,r,g,b,lum=load(HERE/'brand/takumi-logo-horizontal-white.png')
red=np.clip((r-g-40)*3,0,255)
inkg=255-lum; inkg[red>60]=0
k=inkg.copy(); k[:,540:]=0
out['h_kanji'],n1=trace(k,(160,160,540,575),4)
out['h_seal'],n2=trace(red,(540,460,622,550),10)
out['h_word'],n3=trace(inkg,(630,320,2040,485),3)
redpx=im[red>200]; out['h_red']='#%02x%02x%02x'%tuple(int(v) for v in np.median(redpx,axis=0))
print('h',n1,n2,n3,out['h_red'])
im,r,g,b,lum=load(HERE/'brand/takumi-logo-square-black.png')
wg=lum.copy()
k=wg.copy(); k[:,890:]=0; k[840:,:]=0
out['dk_kanji'],n1=trace(k,(380,270,890,830),4)
s=wg.copy(); s[:,:895]=0
out['dk_seal'],n2=trace(s,(900,712,996,812),10)
out['dk_word'],n3=trace(wg,(200,855,1068,970),4)
print('dk',n1,n2,n3)
json.dump(out,open(HERE/'logo-paths.json','w'))
for kk,v in out.items(): print(kk,len(v))
