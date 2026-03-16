#!/usr/bin/env python3
"""
Add text overlays to Relio demo videos using ffmpeg.
Creates captioned versions of each scene, then compiles into final video.
"""
import subprocess, os, json

DEMO_DIR = os.path.expanduser("~/VSCode/Relio/demo")

CAPTIONS = [
    {
        "scene": "scene1_onboarding",
        "title": "Relationships Are Hard.\\nCommunication Shouldn't Be.",
        "subtitle": "3 privacy tiers. Your words\\nnever leave without consent.",
        "title_start": 0, "title_dur": 4,
        "sub_start": 6, "sub_dur": 14,
    },
    {
        "scene": "scene2_checkin",
        "title": "Say What You Feel.\\nSend What Actually Helps.",
        "subtitle": "Watch the raw thought transform\\ninto emotionally safe language.",
        "title_start": 0, "title_dur": 4,
        "sub_start": 6, "sub_dur": 12,
    },
    {
        "scene": "scene3_conflict",
        "title": "Conflict Happens.\\nDamage Doesn't Have To.",
        "subtitle": "The partner hears the need —\\nnot the blame.",
        "title_start": 0, "title_dur": 4,
        "sub_start": 6, "sub_dur": 12,
    },
    {
        "scene": "scene4_hostile",
        "title": "Real Pain. Real Help.",
        "subtitle": "Attachment patterns detected.\\nAI adapts in real time.",
        "title_start": 0, "title_dur": 3,
        "sub_start": 5, "sub_dur": 11,
    },
    {
        "scene": "scene5_journal",
        "title": "Your Eyes Only.",
        "subtitle": "Raw vs. transformed — side by side.\\nInsights only you can see.",
        "title_start": 0, "title_dur": 3,
        "sub_start": 3, "sub_dur": 7,
    },
    {
        "scene": "scene6_safety",
        "title": "This Is Responsible AI.",
        "subtitle": "Pipeline halted. Message never sent.\\nCrisis resources — instantly.",
        "title_start": 0, "title_dur": 3,
        "sub_start": 6, "sub_dur": 8,
    },
]

def add_overlays(caption):
    """Add title and subtitle overlays to a scene video."""
    scene = caption["scene"]
    input_path = os.path.join(DEMO_DIR, f"{scene}.mp4")
    output_path = os.path.join(DEMO_DIR, f"{scene}_captioned.mp4")
    
    if not os.path.exists(input_path):
        print(f"  ❌ {scene}.mp4 not found")
        return False
    
    # Font settings
    font_size_title = 28
    font_size_sub = 20
    font_color = "white"
    shadow_color = "black@0.7"
    
    # Build ffmpeg filter for title + subtitle
    # Title: centered, large, with shadow
    title_filter = (
        f"drawtext=text='{caption['title']}':"
        f"fontsize={font_size_title}:fontcolor={font_color}:"
        f"borderw=3:bordercolor={shadow_color}:"
        f"x=(w-text_w)/2:y=60:"
        f"enable='between(t,{caption['title_start']},{caption['title_start'] + caption['title_dur']})'"
    )
    
    # Subtitle: centered, smaller, lower position
    sub_filter = (
        f"drawtext=text='{caption['subtitle']}':"
        f"fontsize={font_size_sub}:fontcolor={font_color}:"
        f"borderw=2:bordercolor={shadow_color}:"
        f"x=(w-text_w)/2:y=h-120:"
        f"enable='between(t,{caption['sub_start']},{caption['sub_start'] + caption['sub_dur']})'"
    )
    
    cmd = [
        "ffmpeg", "-y", "-i", input_path,
        "-vf", f"{title_filter},{sub_filter}",
        "-c:a", "copy",
        output_path
    ]
    
    result = subprocess.run(cmd, capture_output=True, text=True)
    
    if os.path.exists(output_path) and os.path.getsize(output_path) > 1000:
        size = os.path.getsize(output_path) // 1024
        print(f"  ✅ {scene}_captioned.mp4 ({size}KB)")
        return True
    else:
        print(f"  ❌ Failed: {result.stderr[:200]}")
        return False

def compile_final():
    """Concatenate all captioned scenes + add intro/outro cards."""
    concat_path = os.path.join(DEMO_DIR, "concat_captions.txt")
    scenes = [c["scene"] for c in CAPTIONS]
    
    with open(concat_path, "w") as f:
        for scene in scenes:
            captioned = os.path.join(DEMO_DIR, f"{scene}_captioned.mp4")
            if os.path.exists(captioned):
                f.write(f"file '{scene}_captioned.mp4'\n")
    
    output = os.path.join(DEMO_DIR, "relio_demo_captioned.mp4")
    result = subprocess.run(
        f"cd {DEMO_DIR} && ffmpeg -y -f concat -safe 0 -i concat_captions.txt -c copy {output} 2>&1",
        shell=True, capture_output=True, text=True
    )
    
    if os.path.exists(output) and os.path.getsize(output) > 1000:
        size = os.path.getsize(output) // 1024
        # Get duration
        probe = subprocess.run(
            f"ffprobe -v quiet -show_entries format=duration -of default=noprint_wrappers=1 {output}",
            shell=True, capture_output=True, text=True
        )
        duration = probe.stdout.strip()
        print(f"\n  🎬 FINAL: relio_demo_captioned.mp4 ({size}KB, {duration})")
        return True
    else:
        print(f"\n  ❌ Compile failed: {result.stderr[:300]}")
        return False

def main():
    print("=" * 50)
    print("  ADDING TEXT OVERLAYS TO DEMO")
    print("=" * 50)
    
    success = 0
    for caption in CAPTIONS:
        if add_overlays(caption):
            success += 1
    
    print(f"\n  {success}/{len(CAPTIONS)} scenes captioned")
    
    if success > 0:
        print("\n  Compiling final video...")
        compile_final()
    
    # List final files
    print("\n  Final deliverables:")
    for f in sorted(os.listdir(DEMO_DIR)):
        if f.endswith(".mp4") and ("captioned" in f or "demo" in f):
            size = os.path.getsize(os.path.join(DEMO_DIR, f))
            print(f"    {f:45s} {size // 1024:>6d} KB")

if __name__ == "__main__":
    main()
