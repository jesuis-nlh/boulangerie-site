import sys
from PIL import Image
src, prefix = sys.argv[1], sys.argv[2]
chunk = int(sys.argv[3]) if len(sys.argv) > 3 else 2400
scale = int(sys.argv[4]) if len(sys.argv) > 4 else 2
im = Image.open(src); w, h = im.size
n = (h + chunk - 1) // chunk
for i in range(n):
    c = im.crop((0, i * chunk, w, min(h, (i + 1) * chunk)))
    c.resize((max(1, c.width // scale), max(1, c.height // scale))).save(f"{prefix}-{i}.png")
print(n, "chunks", w, h)
