#!/usr/bin/env python3
"""
Relio Demo Recorder v3 — Precision coordinates + full re-record
Uses uiautomator to find exact button positions.
"""
import subprocess, time, os, re, json

ADB = os.path.expanduser("~/Library/Android/sdk/platform-tools/adb")
DEMO_DIR = os.path.expanduser("~/VSCode/Relio/demo")
os.makedirs(DEMO_DIR, exist_ok=True)

def adb(cmd):
    return subprocess.run(f"{ADB} shell {cmd}", shell=True, capture_output=True, text=True).stdout.strip()

def tap(x, y):
    adb(f"input tap {x} {y}")
    time.sleep(0.5)

def type_text(text):
    escaped = text.replace(" ", "%s").replace("'", "\\'")
    adb(f"input text '{escaped}'")
    time.sleep(0.5)

def swipe(x1, y1, x2, y2, dur=400):
    adb(f"input swipe {x1} {y1} {x2} {y2} {dur}")
    time.sleep(0.5)

def screenshot(name):
    adb(f"screencap -p /sdcard/{name}.png")
    subprocess.run(f"{ADB} pull /sdcard/{name}.png {DEMO_DIR}/{name}.png", shell=True, capture_output=True)
    adb(f"rm /sdcard/{name}.png")

def find_element(text_substring):
    """Find UI element by text and return center coordinates."""
    adb("uiautomator dump /sdcard/ui.xml")
    xml = adb("cat /sdcard/ui.xml")
    pattern = rf'text="([^"]*{re.escape(text_substring)}[^"]*)"[^>]*bounds="\[(\d+),(\d+)\]\[(\d+),(\d+)\]"'
    match = re.search(pattern, xml, re.IGNORECASE)
    if match:
        x1, y1, x2, y2 = int(match.group(2)), int(match.group(3)), int(match.group(4)), int(match.group(5))
        return (x1 + x2) // 2, (y1 + y2) // 2
    return None

def tap_text(text):
    """Find element by text and tap it."""
    coords = find_element(text)
    if coords:
        tap(*coords)
        return True
    print(f"    WARNING: Could not find '{text}' on screen")
    return False

def record_scene(name, duration, actions_fn):
    """Record a scene with proper time limit."""
    device_path = f"/sdcard/{name}.mp4"
    print(f"  🎬 Recording {name} ({duration}s)...")
    rec = subprocess.Popen(
        f"{ADB} shell screenrecord --time-limit {duration} --size 720x1600 {device_path}",
        shell=True
    )
    time.sleep(1)
    actions_fn()
    rec.wait(timeout=duration + 15)
    time.sleep(1)
    subprocess.run(f"{ADB} pull {device_path} {DEMO_DIR}/{name}.mp4", shell=True, capture_output=True)
    adb(f"rm {device_path}")
    size = os.path.getsize(f"{DEMO_DIR}/{name}.mp4") if os.path.exists(f"{DEMO_DIR}/{name}.mp4") else 0
    print(f"  ✅ {name}.mp4 ({size // 1024}KB)")

def wait(s):
    time.sleep(s)

def main():
    print("=" * 50)
    print("  RELIO DEMO v3 — PRECISION RECORDING")
    print("=" * 50)

    # Port forwarding
    subprocess.run(f"{ADB} reverse tcp:8081 tcp:8081", shell=True, capture_output=True)
    subprocess.run(f"{ADB} reverse tcp:3000 tcp:3000", shell=True, capture_output=True)

    # ─── SCENE 1: ONBOARDING ─────────────────────
    print("\n📱 SCENE 1: Onboarding (fresh start)")
    
    def scene1():
        wait(2)
        screenshot("s1_01_welcome")
        
        # Tap "Get Started" by finding it
        tap_text("Get Started")
        wait(2)
        screenshot("s1_02_privacy")
        
        # Tap "I understand" 
        tap_text("understand")
        wait(2)
        screenshot("s1_03_stage")
        
        # Tap "Dating (0-6 months)" - first option
        tap_text("Dating")
        wait(1)
        
        # Tap "Start using Relio"
        tap_text("Start using")
        wait(3)
        screenshot("s1_04_chat")
        wait(2)
    
    record_scene("scene1_onboarding", 22, scene1)

    # ─── SCENE 2: WARM CHECK-IN ──────────────────
    print("\n💬 SCENE 2: Warm Check-in")
    
    def scene2():
        wait(1)
        # Find and tap input field (tap "Express what" placeholder)
        tap_text("Express what")
        wait(1)
        type_text("Hey I was thinking about you at work today")
        wait(1)
        screenshot("s2_01_typing")
        
        # Tap Send button
        tap_text("Send")
        wait(1)
        screenshot("s2_02_mediating")
        wait(8)
        screenshot("s2_03_result")
        wait(3)
    
    record_scene("scene2_checkin", 20, scene2)

    # ─── SCENE 3: CONFLICT ───────────────────────
    print("\n⚡ SCENE 3: Escalating Conflict")
    
    def scene3():
        wait(1)
        tap_text("Express what")
        wait(1)
        type_text("You never listen to me. You forgot dinner with my parents AGAIN")
        wait(1)
        screenshot("s3_01_typing")
        tap_text("Send")
        wait(1)
        screenshot("s3_02_mediating")
        wait(8)
        screenshot("s3_03_result")
        wait(3)
    
    record_scene("scene3_conflict", 20, scene3)

    # ─── SCENE 4: HOSTILE ────────────────────────
    print("\n🔥 SCENE 4: Hostile Accusation")
    
    def scene4():
        wait(1)
        tap_text("Express what")
        wait(1)
        type_text("She is so selfish. All she cares about is her phone. I feel invisible")
        wait(1)
        screenshot("s4_01_typing")
        tap_text("Send")
        wait(8)
        screenshot("s4_02_result")
        wait(3)
    
    record_scene("scene4_hostile", 18, scene4)

    # ─── SCENE 5: JOURNAL ────────────────────────
    print("\n📔 SCENE 5: Private Journal")
    
    def scene5():
        wait(1)
        tap_text("My Journal")
        wait(2)
        screenshot("s5_01_journal")
        swipe(540, 1500, 540, 600, 500)
        wait(2)
        screenshot("s5_02_scroll")
        wait(3)
    
    record_scene("scene5_journal", 12, scene5)

    # ─── SCENE 6: SAFETY ────────────────────────
    print("\n🛡️ SCENE 6: Safety HALT")
    
    # Navigate back to chat
    tap_text("Back to Chat")
    wait(2)
    
    def scene6():
        wait(1)
        tap_text("Express what")
        wait(1)
        type_text("I cannot do this anymore. Nobody would notice if I disappeared")
        wait(1)
        screenshot("s6_01_typing")
        tap_text("Send")
        wait(4)
        screenshot("s6_02_crisis")
        swipe(540, 1500, 540, 800, 500)
        wait(2)
        screenshot("s6_03_resources")
        wait(3)
    
    record_scene("scene6_safety", 16, scene6)

    # ─── VERIFY ──────────────────────────────────
    print("\n🔍 Verifying screenshots are unique...")
    from hashlib import md5
    hashes = {}
    for f in sorted(os.listdir(DEMO_DIR)):
        if f.startswith("s") and f.endswith(".png"):
            h = md5(open(os.path.join(DEMO_DIR, f), "rb").read()).hexdigest()[:12]
            if h in hashes:
                print(f"  ⚠️  {f} is DUPLICATE of {hashes[h]}")
            else:
                hashes[h] = f
                print(f"  ✅ {f} — unique")

    # ─── SUMMARY ─────────────────────────────────
    print("\n" + "=" * 50)
    print("  RECORDING COMPLETE")
    print("=" * 50)
    mp4s = sorted([f for f in os.listdir(DEMO_DIR) if f.startswith("scene") and f.endswith(".mp4")])
    for f in mp4s:
        size = os.path.getsize(os.path.join(DEMO_DIR, f))
        print(f"  {f:35s} {size // 1024:>6d} KB")

if __name__ == "__main__":
    main()
