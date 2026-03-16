#!/usr/bin/env python3
"""
Relio Demo Recorder v2
Records individual scene clips properly by letting screenrecord finish naturally.
"""
import subprocess
import time
import os
import signal

ADB = os.path.expanduser("~/Library/Android/sdk/platform-tools/adb")
DEMO_DIR = os.path.expanduser("~/VSCode/Relio/demo")
os.makedirs(DEMO_DIR, exist_ok=True)

W, H = 1080, 2400

def adb(cmd):
    return subprocess.run(f"{ADB} shell {cmd}", shell=True, capture_output=True, text=True).stdout.strip()

def tap(x, y):
    adb(f"input tap {x} {y}")
    time.sleep(0.3)

def type_text(text):
    escaped = text.replace(" ", "%s").replace("'", "\\'")
    adb(f"input text '{escaped}'")
    time.sleep(0.5)

def swipe(x1, y1, x2, y2, dur=300):
    adb(f"input swipe {x1} {y1} {x2} {y2} {dur}")
    time.sleep(0.5)

def screenshot(name):
    adb(f"screencap -p /sdcard/{name}.png")
    subprocess.run(f"{ADB} pull /sdcard/{name}.png {DEMO_DIR}/{name}.png", shell=True, capture_output=True)
    adb(f"rm /sdcard/{name}.png")
    print(f"  📸 {name}.png")

def record_scene(name, duration, actions_fn):
    """Record a scene: start screenrecord with time-limit, run actions, wait for it."""
    device_path = f"/sdcard/{name}.mp4"
    
    # Start recording with a natural time limit (no premature kill)
    print(f"  🎬 Recording {name} ({duration}s)...")
    rec_proc = subprocess.Popen(
        f"{ADB} shell screenrecord --time-limit {duration} --size 720x1600 {device_path}",
        shell=True
    )
    time.sleep(1)  # Let recording start
    
    # Execute the scene actions
    actions_fn()
    
    # Wait for recording to finish naturally (time-limit)
    rec_proc.wait(timeout=duration + 10)
    time.sleep(1)
    
    # Pull the file
    subprocess.run(f"{ADB} pull {device_path} {DEMO_DIR}/{name}.mp4", shell=True, capture_output=True)
    adb(f"rm {device_path}")
    
    size = os.path.getsize(f"{DEMO_DIR}/{name}.mp4") if os.path.exists(f"{DEMO_DIR}/{name}.mp4") else 0
    print(f"  ✅ {name}.mp4 ({size // 1024}KB)")

def wait(s):
    time.sleep(s)

def open_app():
    adb('am start -a android.intent.action.VIEW -d "exp://localhost:8081" host.exp.exponent')
    time.sleep(5)

def main():
    print("=" * 50)
    print("  RELIO DEMO RECORDER v2")
    print("=" * 50)
    
    # Ensure port forwarding
    subprocess.run(f"{ADB} reverse tcp:8081 tcp:8081", shell=True, capture_output=True)
    subprocess.run(f"{ADB} reverse tcp:3000 tcp:3000", shell=True, capture_output=True)
    
    # Open app first and wait for it to load
    print("\n🚀 Launching app...")
    open_app()
    wait(5)
    screenshot("00_initial")
    
    # ─── SCENE 1: ONBOARDING ─────────────────────────
    print("\n📱 SCENE 1: Onboarding")
    def scene1():
        wait(2)
        screenshot("01_welcome")
        tap(W // 2, 1900)   # Get Started
        wait(2)
        screenshot("02_privacy")
        tap(W // 2, 1900)   # I understand
        wait(2)
        screenshot("03_stage_select")
        tap(W // 2, 650)    # Dating option
        wait(1)
        tap(W // 2, 1900)   # Start using Relio
        wait(3)
        screenshot("04_chat_empty")
        wait(2)
    record_scene("scene1_onboarding", 20, scene1)
    
    # ─── SCENE 2: WARM CHECK-IN ──────────────────────
    print("\n💬 SCENE 2: Warm Check-in")
    def scene2():
        wait(1)
        tap(W // 2 - 100, H - 80)  # Input field
        wait(1)
        type_text("Hey I was thinking about you at work today")
        wait(1)
        screenshot("05_typing_warm")
        tap(W - 80, H - 80)  # Send
        wait(1)
        screenshot("06_mediating")
        wait(8)  # Wait for AI
        screenshot("07_tier3_warm")
        wait(3)
    record_scene("scene2_checkin", 20, scene2)
    
    # ─── SCENE 3: CONFLICT ───────────────────────────
    print("\n⚡ SCENE 3: Escalating Conflict")
    def scene3():
        wait(1)
        tap(W // 2 - 100, H - 80)
        wait(1)
        type_text("You never listen to me. You forgot dinner with my parents AGAIN")
        wait(1)
        screenshot("08_typing_conflict")
        tap(W - 80, H - 80)
        wait(1)
        screenshot("09_mediating_conflict")
        wait(8)
        screenshot("10_tier3_conflict")
        wait(3)
    record_scene("scene3_conflict", 20, scene3)
    
    # ─── SCENE 4: HOSTILE ────────────────────────────
    print("\n🔥 SCENE 4: Hostile Accusation")
    def scene4():
        wait(1)
        tap(W // 2 - 100, H - 80)
        wait(1)
        type_text("She is so selfish. All she cares about is her phone. I feel invisible")
        wait(1)
        screenshot("11_typing_hostile")
        tap(W - 80, H - 80)
        wait(8)
        screenshot("12_tier3_hostile")
        wait(3)
    record_scene("scene4_hostile", 18, scene4)
    
    # ─── SCENE 5: JOURNAL ────────────────────────────
    print("\n📔 SCENE 5: Private Journal")
    def scene5():
        wait(1)
        tap(W - 100, 150)  # My Journal button
        wait(2)
        screenshot("13_journal")
        swipe(W // 2, 1500, W // 2, 600, 500)
        wait(2)
        screenshot("14_journal_scroll")
        wait(3)
    record_scene("scene5_journal", 12, scene5)
    
    # ─── SCENE 6: SAFETY ────────────────────────────
    print("\n🛡️ SCENE 6: Safety HALT")
    # Go back to chat first
    tap(150, 150)  # Back button
    wait(2)
    
    def scene6():
        wait(1)
        tap(W // 2 - 100, H - 80)
        wait(1)
        type_text("I cannot do this anymore. Nobody would notice if I disappeared")
        wait(1)
        screenshot("15_typing_safety")
        tap(W - 80, H - 80)
        wait(4)
        screenshot("16_crisis")
        swipe(W // 2, 1500, W // 2, 800, 500)
        wait(2)
        screenshot("17_crisis_resources")
        wait(3)
    record_scene("scene6_safety", 16, scene6)
    
    # ─── COMPILE ─────────────────────────────────────
    print("\n🎬 Compiling final video...")
    
    # Create concat file
    clips = ["scene1_onboarding", "scene2_checkin", "scene3_conflict", 
             "scene4_hostile", "scene5_journal", "scene6_safety"]
    
    with open(f"{DEMO_DIR}/concat.txt", "w") as f:
        for clip in clips:
            path = f"{DEMO_DIR}/{clip}.mp4"
            if os.path.exists(path) and os.path.getsize(path) > 1000:
                f.write(f"file '{clip}.mp4'\n")
    
    # Concat with ffmpeg
    result = subprocess.run(
        f"cd {DEMO_DIR} && ffmpeg -y -f concat -safe 0 -i concat.txt -c copy relio_demo_full.mp4 2>&1",
        shell=True, capture_output=True, text=True
    )
    
    if os.path.exists(f"{DEMO_DIR}/relio_demo_full.mp4"):
        size = os.path.getsize(f"{DEMO_DIR}/relio_demo_full.mp4")
        print(f"  ✅ relio_demo_full.mp4 ({size // 1024}KB)")
    else:
        print(f"  ⚠️ Concat failed: {result.stderr[:200]}")
        print("  Individual clips are still available.")
    
    # Summary
    print("\n" + "=" * 50)
    print("  DEMO COMPLETE")
    print(f"  Location: {DEMO_DIR}/")
    print("=" * 50)
    
    files = sorted(os.listdir(DEMO_DIR))
    pngs = [f for f in files if f.endswith('.png')]
    mp4s = [f for f in files if f.endswith('.mp4')]
    print(f"\n  📸 {len(pngs)} screenshots")
    print(f"  🎬 {len(mp4s)} videos")
    for f in mp4s:
        size = os.path.getsize(os.path.join(DEMO_DIR, f))
        print(f"    {f:40s} {size // 1024:>6d} KB")

if __name__ == "__main__":
    main()
