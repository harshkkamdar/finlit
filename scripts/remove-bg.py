"""
Remove white backgrounds from generated illustrations.
Converts near-white pixels to transparent, with edge feathering.

Usage:
  python3 scripts/remove-bg.py                    # Process all
  python3 scripts/remove-bg.py --chapter 0        # Process ch0 only
"""

import os
import sys
from PIL import Image
import numpy as np

ILLUSTRATIONS_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "illustrations")
WHITE_THRESHOLD = 240  # pixels with R,G,B all above this → transparent
FEATHER_THRESHOLD = 220  # pixels in this range get partial transparency


def remove_white_bg(img_path: str) -> bool:
    """Remove white background from a single image. Returns True if modified."""
    img = Image.open(img_path)

    if img.mode == "RGBA":
        # Already has alpha, check if it's already transparent
        arr = np.array(img)
        if arr[:, :, 3].min() < 250:
            return False  # Already has transparency

    img = img.convert("RGBA")
    arr = np.array(img, dtype=np.float32)

    # Calculate how "white" each pixel is (min of R,G,B channels)
    min_rgb = np.minimum(np.minimum(arr[:, :, 0], arr[:, :, 1]), arr[:, :, 2])

    # Full transparent for very white pixels
    full_mask = min_rgb >= WHITE_THRESHOLD
    arr[full_mask, 3] = 0

    # Feathered transparency for near-white pixels
    feather_mask = (min_rgb >= FEATHER_THRESHOLD) & (min_rgb < WHITE_THRESHOLD)
    if feather_mask.any():
        # Linear interpolation: closer to WHITE_THRESHOLD → more transparent
        alpha_factor = (WHITE_THRESHOLD - min_rgb[feather_mask]) / (WHITE_THRESHOLD - FEATHER_THRESHOLD)
        arr[feather_mask, 3] = (alpha_factor * 255).astype(np.float32)

    result = Image.fromarray(arr.astype(np.uint8), "RGBA")
    result.save(img_path, "PNG", optimize=True)
    return True


def main():
    args = sys.argv[1:]
    only_chapter = None

    if "--chapter" in args:
        idx = args.index("--chapter")
        only_chapter = int(args[idx + 1])

    processed = 0
    skipped = 0

    for ch_dir in sorted(os.listdir(ILLUSTRATIONS_DIR)):
        ch_path = os.path.join(ILLUSTRATIONS_DIR, ch_dir)
        if not os.path.isdir(ch_path) or not ch_dir.startswith("ch"):
            continue

        ch_num = int(ch_dir[2:])
        if only_chapter is not None and ch_num != only_chapter:
            continue

        for fname in sorted(os.listdir(ch_path)):
            if not fname.endswith(".png"):
                continue

            fpath = os.path.join(ch_path, fname)
            if remove_white_bg(fpath):
                processed += 1
                print(f"  {ch_dir}/{fname}")
            else:
                skipped += 1

    print(f"\nDone: {processed} processed, {skipped} skipped (already transparent)")


if __name__ == "__main__":
    main()
