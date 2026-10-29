#!/usr/bin/env python3
"""Generate the dotted world map used in the offices section.

The land is drawn as a grid of dots, in a Miller projection. To keep the page
light, each horizontal run of land dots is a single dashed line segment, so the
whole world fits in one small <path> (stroke-dasharray "0 10" + round caps
turn every segment into a row of dots). The result is written to
src/_world-dots.html and inserted by tools/build.py into the {{WORLD_MAP}}
block. Run it only to change the map; the output is committed:

    curl -LO https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_land.geojson
    python3 tools/world_map.py ne_50m_land.geojson

It also prints the position of each office in the map coordinates, for the
pins of src/<lang>/_world-map.html.
"""
import json
import math
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'src', '_world-dots.html')

STEP = 1.5                 # degrees between two dots, at the equator
LON_MIN, LON_MAX = -180, 180
LAT_MIN, LAT_MAX = -56, 78  # no Antarctica, less Arctic
S = 10                     # map units between two dots

OFFICES = {
    'rockville': (-77.15, 39.08),
    'paris': (2.35, 48.86),
    'lome': (1.37, 6.18),
    'ndjamena': (15.06, 12.13),
    'malabo': (8.78, 3.75),
    'conakry': (-13.68, 9.54),
    'cotonou': (2.39, 6.37),
}


def miller(lat):
    return 1.25 * math.log(math.tan(math.pi / 4 + 0.4 * math.radians(lat)))


def miller_inverse(y):
    return math.degrees(2.5 * (math.atan(math.exp(y / 1.25)) - math.pi / 4))


UNIT = math.radians(STEP)            # projected distance between two rows
Y_TOP = miller(LAT_MAX)
COLS = int(round((LON_MAX - LON_MIN) / STEP))
ROWS = int((Y_TOP - miller(LAT_MIN)) / UNIT) + 1


def to_map(lon, lat):
    """Longitude/latitude to map units (0,0 = top left dot)."""
    x = (lon - LON_MIN - STEP / 2) / STEP * S
    y = (Y_TOP - miller(lat)) / UNIT * S
    return round(x, 1), round(y, 1)


def load_land(path):
    polygons = []
    for feature in json.load(open(path, encoding='utf-8'))['features']:
        geometry = feature['geometry']
        parts = geometry['coordinates'] if geometry['type'] == 'MultiPolygon' else [geometry['coordinates']]
        for part in parts:
            rings = []
            for ring in part:
                xs = [p[0] for p in ring]
                ys = [p[1] for p in ring]
                rings.append((min(xs), max(xs), min(ys), max(ys), ring))
            polygons.append(rings)
    return polygons


def in_ring(x, y, ring):
    inside = False
    j = len(ring) - 1
    for i in range(len(ring)):
        xi, yi = ring[i]
        xj, yj = ring[j]
        if (yi > y) != (yj > y) and x < (xj - xi) * (y - yi) / (yj - yi) + xi:
            inside = not inside
        j = i
    return inside


def is_land(polygons, lon, lat):
    for rings in polygons:
        x0, x1, y0, y1, outer = rings[0]
        if x0 <= lon <= x1 and y0 <= lat <= y1 and in_ring(lon, lat, outer):
            holes = rings[1:]
            if not any(h[0] <= lon <= h[1] and h[2] <= lat <= h[3] and in_ring(lon, lat, h[4]) for h in holes):
                return True
    return False


def main(geojson):
    polygons = load_land(geojson)
    segments = []
    for row in range(ROWS):
        lat = miller_inverse(Y_TOP - row * UNIT)
        start = None
        for col in range(COLS + 1):
            land = col < COLS and is_land(polygons, LON_MIN + STEP / 2 + col * STEP, lat)
            if land and start is None:
                start = col
            elif not land and start is not None:
                segments.append('M%d %dh%d' % (start * S, row * S, (col - 1 - start) * S))
                start = None

    width, height = (COLS - 1) * S, (ROWS - 1) * S
    with open(OUT, 'w', encoding='utf-8') as f:
        f.write('<path class="world-map__land" d="%s"/>\n' % ''.join(segments))
    print('wrote %s: %d segments, viewBox 0 0 %d %d' % (os.path.relpath(OUT, ROOT), len(segments), width, height))
    for name, (lon, lat) in OFFICES.items():
        print('  %-10s x=%s y=%s' % ((name,) + to_map(lon, lat)))


if __name__ == '__main__':
    if len(sys.argv) != 2:
        raise SystemExit(__doc__)
    main(sys.argv[1])
