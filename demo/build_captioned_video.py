#!/usr/bin/env python3
"""
Create captioned Relio demo by generating title card videos
and interleaving them with scene recordings.
Uses PIL for image generation and ffmpeg for video assembly.
"""
import subprocess, os
from PIL import Image, ImageDraw, ImageFont

DEMO_DIR = os.path.expanduser("~/VSCode/Relio/demo")
W, H = 720, 1600  # Match recording resolution

# Color palette matching Relio theme
BG_COLOR = (250, 250, 245)       # Off-white warm
PRIMARY = (107, 112, 92)          # Sage green
SECONDARY = (176, 137, 104)       # Warm terracotta
TEXT_COLOR = (45, 45, 42)         # Dark text
SAFETY_RED = (217, 79, 79)       # Crisis red
WHITE = (255, 255, 255)
LIGHT_BG = (240, 244, 239)       # Mint white (tier 3)

SCENES = [
    {
        "scene": "scene1_onboarding",
        "title": "Relationships Are Hard.\nCommunication Shouldn't Be.",
        "subtitle": "Privacy-first onboarding in 15 seconds",
        "bg": BG_COLOR,
        "title_color": PRIMARY,
    },
    {
        "scene": "scene2_checkin",
        "title": "Say What You Feel.\nSend What Actually Helps.",
        "subtitle": "Watch: raw thought → emotionally safe language",
        "bg": LIGHT_BG,
        "title_color": PRIMARY,
    },
    {
        "scene": "scene3_conflict",
        "title": "Conflict Happens.\nDamage Doesn't Have To.",
        "subtitle": "Partner hears the need — not the blame",
        "bg": BG_COLOR,
        "title_color": PRIMARY,
    },
    {
        "scene": "scene4_hostile",
        "title": "Real Pain.\nReal Help.",
        "subtitle": "Anxious attachment detected. AI adapts.",
        "bg": BG_COLOR,
        "title_color": SECONDARY,
    },
    {
        "scene": "scene5_journal",
        "title": "Your Eyes Only.",
        "subtitle": "Raw vs. transformed — only you can see",
        "bg": (232, 222, 213),  # Tier 1 sand
        "title_color": PRIMARY,
    },
    {
        "scene": "scene6_safety",
        "title": "This Is\nResponsible AI.",
        "subtitle": "Pipeline halted. Message never sent.",
        "bg": WHITE,
        "title_color": SAFETY_RED,
    },
]

def create_title_card(scene_info, filename):
    """Create a title card image."""
    img = Image.new("RGB", (W, H), scene_info["bg"])
    draw = ImageDraw.Draw(img)
    
    # Use system font (macOS has good defaults)
    try:
        title_font = ImageFont.truetype("/System/Library/Fonts/SFCompact-Bold.otf", 48)
        sub_font = ImageFont.truetype("/System/Library/Fonts/SFCompact-Regular.otf", 28)
    except:
        try:
            title_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 48)
            sub_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 28)
        except:
            title_font = ImageFont.load_default()
            sub_font = ImageFont.load_default()
    
    # Draw title centered
    title = scene_info["title"]
    title_bbox = draw.multiline_textbbox((0, 0), title, font=title_font, align="center")
    title_w = title_bbox[2] - title_bbox[0]
    title_h = title_bbox[3] - title_bbox[1]
    title_x = (W - title_w) // 2
    title_y = (H // 2) - title_h - 40
    draw.multiline_text((title_x, title_y), title, fill=scene_info["title_color"], 
                        font=title_font, align="center")
    
    # Draw subtitle
    subtitle = scene_info["subtitle"]
    sub_bbox = draw.textbbox((0, 0), subtitle, font=sub_font)
    sub_w = sub_bbox[2] - sub_bbox[0]
    sub_x = (W - sub_w) // 2
    sub_y = title_y + title_h + 60
    draw.text((sub_x, sub_y), subtitle, fill=(*TEXT_COLOR, 180), font=sub_font)
    
    # Draw a subtle line separator
    line_y = title_y + title_h + 30
    draw.line([(W//2 - 60, line_y), (W//2 + 60, line_y)], fill=(*PRIMARY, 100), width=2)
    
    path = os.path.join(DEMO_DIR, filename)
    img.save(path)
    return path

def create_intro_card():
    """Create the opening card."""
    img = Image.new("RGB", (W, H), PRIMARY)
    draw = ImageDraw.Draw(img)
    
    try:
        logo_font = ImageFont.truetype("/System/Library/Fonts/SFCompact-Bold.otf", 72)
        tag_font = ImageFont.truetype("/System/Library/Fonts/SFCompact-Regular.otf", 24)
    except:
        logo_font = ImageFont.load_default()
        tag_font = ImageFont.load_default()
    
    # Logo
    logo_bbox = draw.textbbox((0, 0), "Relio", font=logo_font)
    logo_w = logo_bbox[2] - logo_bbox[0]
    draw.text(((W - logo_w) // 2, H // 2 - 80), "Relio", fill=WHITE, font=logo_font)
    
    # Tagline
    tag = "AI-Powered Relationship Mediation"
    tag_bbox = draw.textbbox((0, 0), tag, font=tag_font)
    tag_w = tag_bbox[2] - tag_bbox[0]
    draw.text(((W - tag_w) // 2, H // 2 + 20), tag, fill=(255, 255, 255, 200), font=tag_font)
    
    # Version
    ver = "MVP Demo — March 2026"
    ver_bbox = draw.textbbox((0, 0), ver, font=tag_font)
    ver_w = ver_bbox[2] - ver_bbox[0]
    draw.text(((W - ver_w) // 2, H // 2 + 60), ver, fill=(255, 255, 255, 150), font=tag_font)
    
    path = os.path.join(DEMO_DIR, "card_intro.png")
    img.save(path)
    return path

def create_outro_card():
    """Create the closing card."""
    img = Image.new("RGB", (W, H), PRIMARY)
    draw = ImageDraw.Draw(img)
    
    try:
        title_font = ImageFont.truetype("/System/Library/Fonts/SFCompact-Bold.otf", 42)
        body_font = ImageFont.truetype("/System/Library/Fonts/SFCompact-Regular.otf", 24)
    except:
        title_font = ImageFont.load_default()
        body_font = ImageFont.load_default()
    
    text = "5 AI Agents. 3 Privacy Tiers.\n1 Mission: Safer Communication."
    bbox = draw.multiline_textbbox((0, 0), text, font=title_font, align="center")
    tw = bbox[2] - bbox[0]
    draw.multiline_text(((W - tw) // 2, H // 2 - 80), text, fill=WHITE, font=title_font, align="center")
    
    sub = "relio.app"
    sub_bbox = draw.textbbox((0, 0), sub, font=body_font)
    sub_w = sub_bbox[2] - sub_bbox[0]
    draw.text(((W - sub_w) // 2, H // 2 + 60), sub, fill=(255, 255, 255, 200), font=body_font)
    
    path = os.path.join(DEMO_DIR, "card_outro.png")
    img.save(path)
    return path

def image_to_video(image_path, video_path, duration=3):
    """Convert a static image to a video clip."""
    cmd = [
        "ffmpeg", "-y",
        "-loop", "1", "-i", image_path,
        "-c:v", "libx264", "-t", str(duration),
        "-pix_fmt", "yuv420p",
        "-vf", f"scale={W}:{H}",
        "-r", "10",
        video_path
    ]
    subprocess.run(cmd, capture_output=True, text=True)
    return os.path.exists(video_path) and os.path.getsize(video_path) > 100

def main():
    print("=" * 50)
    print("  RELIO DEMO — CAPTIONED VIDEO BUILDER")
    print("=" * 50)
    
    clips = []
    
    # 1. Intro card
    print("\n🎬 Creating intro card...")
    intro_img = create_intro_card()
    intro_vid = os.path.join(DEMO_DIR, "clip_00_intro.mp4")
    if image_to_video(intro_img, intro_vid, 3):
        clips.append("clip_00_intro.mp4")
        print("  ✅ Intro card (3s)")
    
    # 2. For each scene: title card (2.5s) + scene recording
    for i, scene in enumerate(SCENES):
        scene_num = i + 1
        print(f"\n📱 Scene {scene_num}: {scene['scene']}")
        
        # Create title card
        card_img = create_title_card(scene, f"card_scene{scene_num}.png")
        card_vid = os.path.join(DEMO_DIR, f"clip_{scene_num:02d}a_card.mp4")
        
        if image_to_video(card_img, card_vid, 3):
            clips.append(f"clip_{scene_num:02d}a_card.mp4")
            print(f"  ✅ Title card (3s)")
        
        # Re-encode scene to match codec
        scene_file = os.path.join(DEMO_DIR, f"{scene['scene']}.mp4")
        scene_out = os.path.join(DEMO_DIR, f"clip_{scene_num:02d}b_scene.mp4")
        
        if os.path.exists(scene_file):
            cmd = [
                "ffmpeg", "-y", "-i", scene_file,
                "-c:v", "libx264", "-pix_fmt", "yuv420p",
                "-vf", f"scale={W}:{H}:force_original_aspect_ratio=decrease,pad={W}:{H}:(ow-iw)/2:(oh-ih)/2",
                "-r", "10",
                scene_out
            ]
            subprocess.run(cmd, capture_output=True, text=True)
            if os.path.exists(scene_out) and os.path.getsize(scene_out) > 100:
                clips.append(f"clip_{scene_num:02d}b_scene.mp4")
                size = os.path.getsize(scene_out) // 1024
                print(f"  ✅ Scene recording ({size}KB)")
    
    # 3. Outro card
    print("\n🎬 Creating outro card...")
    outro_img = create_outro_card()
    outro_vid = os.path.join(DEMO_DIR, "clip_99_outro.mp4")
    if image_to_video(outro_img, outro_vid, 4):
        clips.append("clip_99_outro.mp4")
        print("  ✅ Outro card (4s)")
    
    # 4. Compile all
    print("\n🎬 Compiling final video...")
    concat_path = os.path.join(DEMO_DIR, "concat_final.txt")
    with open(concat_path, "w") as f:
        for clip in clips:
            f.write(f"file '{clip}'\n")
    
    final_path = os.path.join(DEMO_DIR, "relio_demo_final.mp4")
    result = subprocess.run(
        f"cd {DEMO_DIR} && ffmpeg -y -f concat -safe 0 -i concat_final.txt -c copy {final_path}",
        shell=True, capture_output=True, text=True
    )
    
    if os.path.exists(final_path) and os.path.getsize(final_path) > 1000:
        size = os.path.getsize(final_path) // 1024
        # Get duration
        probe = subprocess.run(
            f"ffprobe -v quiet -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 {final_path}",
            shell=True, capture_output=True, text=True
        )
        dur = float(probe.stdout.strip()) if probe.stdout.strip() else 0
        
        print(f"\n{'=' * 50}")
        print(f"  FINAL VIDEO READY")
        print(f"  📁 {final_path}")
        print(f"  📐 {W}x{H}")
        print(f"  ⏱️  {dur:.1f} seconds ({dur/60:.1f} min)")
        print(f"  💾 {size} KB ({size/1024:.1f} MB)")
        print(f"  🎞️  {len(clips)} clips stitched")
        print(f"{'=' * 50}")
    else:
        print(f"\n  ❌ Final compile failed")
        if result.stderr:
            print(f"  Error: {result.stderr[:300]}")

if __name__ == "__main__":
    main()
