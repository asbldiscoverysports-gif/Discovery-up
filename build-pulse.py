"""Build self-contained SVG animations from the twelve existing Pulse portraits.

Original artwork is embedded unchanged. The body breathes within its viewBox;
only genuinely open eyes receive a brief lid overlay. Closed/winking poses keep
their expression. No arm drawing or external asset request is introduced.
"""
from pathlib import Path
import base64
from xml.sax.saxutils import escape

ROOT = Path(__file__).parent
ASSETS = ROOT/'assets/pulse'
OUT = ASSETS/'animated-levels'
OUT.mkdir(exist_ok=True)

# Coordinates were checked against each 420 × 420 source illustration.
# (center x, center y, horizontal radius, vertical radius, lid color)
EYES = {
    1: [(159,193,16,19,'#47cfc5'),(223,199,17,19,'#3ec8c2')],
    2: [(150,209,15,19,'#43cfc5'),(216,218,17,19,'#3bc8c2')],
    3: [(136,197,15,18,'#48d0c5'),(205,200,17,19,'#41c9c2')],
    4: [],
    5: [(160,152,16,20,'#44d0c6'),(229,157,17,20,'#3bc8c0')],
    6: [(159,145,16,20,'#46cfc5'),(229,154,17,20,'#38c7c0')],
    7: [(141,151,15,20,'#4bd2c7')],
    8: [(145,149,16,20,'#45cfc3'),(215,140,17,20,'#3cc6bf')],
    9: [],
    10: [(154,127,16,19,'#48d0c6'),(223,118,17,20,'#3ec8c1')],
    11: [],
    12: [],
}

for level in range(1,13):
    source=ASSETS/f'level-{level:02}.webp'
    embedded=base64.b64encode(source.read_bytes()).decode('ascii')
    lids=[]
    for x,y,rx,ry,color in EYES[level]:
        lids.append(f'<g class="lid" opacity="0"><ellipse cx="{x}" cy="{y}" rx="{rx}" ry="{ry}" fill="{color}"/>'
                    f'<path d="M{x-rx+3} {y+1} Q{x} {y+9} {x+rx-3} {y+1}" fill="none" stroke="#153b59" stroke-width="3" stroke-linecap="round"/></g>')
    # The outer <img> remains fixed: only Pulse inside the SVG moves.
    svg=f'''<svg xmlns="http://www.w3.org/2000/svg" width="420" height="420" viewBox="0 0 420 420" role="img" aria-label="Pulse niveau {level} animé">
<style>
#character{{transform-origin:210px 250px;animation:breath 3.5s ease-in-out infinite}}
.lid{{animation:blink 5.8s steps(1,end) infinite}}
@keyframes breath{{0%,100%{{transform:scale(1)}}50%{{transform:scale(1.014,.986)}}}}
@keyframes blink{{0%,39%,42%,100%{{opacity:0}}40%,41%{{opacity:1}}}}
@media(prefers-reduced-motion:reduce){{#character,.lid{{animation:none!important}}}}
</style>
<g id="character"><image href="data:image/webp;base64,{embedded}" width="420" height="420"/>{''.join(lids)}</g>
</svg>'''
    (OUT/f'level-{level:02}.svg').write_text(svg,encoding='utf-8')
print('Twelve distinct Pulse levels wrapped with gentle animation.')
