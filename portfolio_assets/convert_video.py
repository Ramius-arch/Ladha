import cv2
import os
import sys
from PIL import Image

def convert_media():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    webm_path = os.path.join(base_dir, 'ladha_ledger_portfolio_walkthrough.webm')
    mp4_path = os.path.join(base_dir, 'ladha_ledger_portfolio_walkthrough.mp4')
    gif_path = os.path.join(base_dir, 'ladha_ledger_portfolio_preview.gif')
    artifact_dir = r"C:\Users\ADMIN\.gemini\antigravity\brain\c2ca5ef3-e3fc-41e8-8246-844780913ec4"

    if not os.path.exists(webm_path):
        print(f"Error: {webm_path} does not exist!")
        return

    cap = cv2.VideoCapture(webm_path)
    if not cap.isOpened():
        print(f"Error opening {webm_path}")
        return

    fps = cap.get(cv2.CAP_PROP_FPS) or 25.0
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

    print(f"WebM info: {width}x{height} @ {fps:.1f} FPS, total frames: {total_frames}")

    # Re-export clean MP4 starting at frame 64 (fully painted dashboard)
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(mp4_path, fourcc, fps, (width, height))

    raw_frames = []
    frame_idx = 0

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        # Only process frames once dashboard is loaded
        if frame_idx >= 64:
            out.write(frame)
            raw_frames.append(frame)

        frame_idx += 1

    cap.release()
    out.release()
    print(f"MP4 exported cleanly: {mp4_path} ({len(raw_frames)} frames, {os.path.getsize(mp4_path)} bytes)")

    # 2. Export Animated GIF - Sample 120 frames evenly across the entire walkthrough
    # to create a comprehensive, fast-paced portfolio showcase GIF
    if raw_frames:
        num_gif_frames = 120
        step = max(1, len(raw_frames) // num_gif_frames)
        sampled_indices = range(0, len(raw_frames), step)[:num_gif_frames]

        gif_frames = []
        for idx in sampled_indices:
            rgb = cv2.cvtColor(raw_frames[idx], cv2.COLOR_BGR2RGB)
            img = Image.fromarray(rgb)
            img_resized = img.resize((720, 450), Image.Resampling.LANCZOS)
            gif_frames.append(img_resized)

        quantized_frames = [f.convert('P', palette=Image.Palette.ADAPTIVE, colors=128) for f in gif_frames]
        quantized_frames[0].save(
            gif_path,
            save_all=True,
            append_images=quantized_frames[1:],
            duration=130,  # ~7.7 fps smooth loop
            loop=0,
            optimize=True
        )
        print(f"GIF preview exported successfully: {gif_path} ({len(gif_frames)} frames, {os.path.getsize(gif_path)} bytes)")

    # 3. Copy to Artifacts directory
    import shutil
    for name in ['ladha_ledger_portfolio_walkthrough.webm', 'ladha_ledger_portfolio_walkthrough.mp4', 'ladha_ledger_portfolio_preview.gif']:
        src = os.path.join(base_dir, name)
        if os.path.exists(src):
            dst = os.path.join(artifact_dir, name)
            shutil.copy2(src, dst)
            print(f"Copied {name} to artifacts directory.")

if __name__ == '__main__':
    convert_media()
