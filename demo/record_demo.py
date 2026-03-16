#!/usr/bin/env python3
"""
Relio Demo Recorder
Records a full end-to-end demo of the Relio app on Android emulator.
Uses ADB to simulate user interaction and screenrecord to capture video.
"""
import subprocess
import time
import os
import sys

ADB = os.path.expanduser("~/Library/Android/sdk/platform-tools/adb")
DEMO_DIR = os.path.expanduser("~/VSCode/Relio/demo")
os.makedirs(DEMO_DIR, exist_ok=True)

# Screen dimensions for Pixel 7: 1080 x 2400
W, H = 1080, 2400

def adb(cmd):
    """Run an ADB shell command."""
    result = subprocess.run(f"{ADB} shell {cmd}", shell=True, capture_output=True, text=True)
    return result.stdout.strip()

def tap(x, y):
    """Tap at coordinates."""
    adb(f"input tap {x} {y}")
    time.sleep(0.3)

def type_text(text):
    """Type text into focused field. Handles spaces."""
    # Use ADB input text — escape spaces
    escaped = text.replace(" ", "%s").replace("'", "\\'").replace('"', '\\"')
    adb(f'input text "{escaped}"')
    time.sleep(0.5)

def swipe(x1, y1, x2, y2, duration=300):
    """Swipe gesture."""
    adb(f"input swipe {x1} {y1} {x2} {y2} {duration}")
    time.sleep(0.5)

def screenshot(name):
    """Take a screenshot and save locally."""
    path = f"/sdcard/{name}.png"
    adb(f"screencap -p {path}")
    subprocess.run(f"{ADB} pull {path} {DEMO_DIR}/{name}.png", shell=True, capture_output=True)
    adb(f"rm {path}")
    print(f"  Screenshot: {name}.png")

def start_recording(name, max_seconds=60):
    """Start screen recording in background."""
    path = f"/sdcard/{name}.mp4"
    # Kill any existing recordings
    adb("pkill -f screenrecord 2>/dev/null || true")
    time.sleep(0.5)
    proc = subprocess.Popen(
        f"{ADB} shell screenrecord --time-limit {max_seconds} --size 720x1600 {path}",
        shell=True
    )
    time.sleep(1)
    print(f"  Recording started: {name}.mp4")
    return proc, path, name

def stop_recording(proc, device_path, name):
    """Stop recording and pull file."""
    adb("pkill -f screenrecord 2>/dev/null || true")
    time.sleep(2)
    proc.wait(timeout=10)
    subprocess.run(f"{ADB} pull {device_path} {DEMO_DIR}/{name}.mp4", shell=True, capture_output=True)
    adb(f"rm {device_path}")
    size = os.path.getsize(f"{DEMO_DIR}/{name}.mp4") if os.path.exists(f"{DEMO_DIR}/{name}.mp4") else 0
    print(f"  Recording saved: {name}.mp4 ({size // 1024}KB)")

def press_back():
    """Press Android back button."""
    adb("input keyevent 4")
    time.sleep(0.5)

def press_home():
    """Press Android home button."""
    adb("input keyevent 3")
    time.sleep(0.5)

def wait(seconds):
    """Wait with countdown."""
    for i in range(seconds, 0, -1):
        print(f"    Waiting {i}s...", end="\r")
        time.sleep(1)
    print("    " + " " * 20, end="\r")

def open_app():
    """Open Relio in Expo Go."""
    adb('am start -a android.intent.action.VIEW -d "exp://localhost:8081" host.exp.exponent')
    time.sleep(3)

# ═══════════════════════════════════════════════════════
# DEMO SCRIPT
# ═══════════════════════════════════════════════════════

def main():
    print("=" * 60)
    print("  RELIO DEMO RECORDER")
    print("  Recording full end-to-end demo on Android emulator")
    print("=" * 60)
    
    # Ensure reverse port forwarding
    subprocess.run(f"{ADB} reverse tcp:8081 tcp:8081", shell=True, capture_output=True)
    subprocess.run(f"{ADB} reverse tcp:3000 tcp:3000", shell=True, capture_output=True)
    
    # ─── SCENE 1: ONBOARDING ───────────────────────────
    print("\n📱 SCENE 1: Onboarding Flow")
    
    # Open the app
    open_app()
    wait(5)  # Wait for bundle to load
    screenshot("01_onboarding_welcome")
    
    # Start recording onboarding
    rec, rpath, rname = start_recording("scene1_onboarding", 45)
    wait(3)
    
    # Tap "Get Started" button (bottom center area)
    tap(W // 2, 1900)  # Get Started button
    wait(2)
    screenshot("02_onboarding_privacy")
    
    # Tap "I understand — Continue" 
    tap(W // 2, 1900)
    wait(2)
    screenshot("03_onboarding_stage")
    
    # Select "Dating (0-6 months)"
    tap(W // 2, 650)  # First option
    wait(1)
    
    # Tap "Start using Relio"
    tap(W // 2, 1900)
    wait(3)
    screenshot("04_shared_chat_empty")
    
    stop_recording(rec, rpath, rname)
    
    # ─── SCENE 2: WARM CHECK-IN ────────────────────────
    print("\n💬 SCENE 2: Warm Check-in Message")
    rec, rpath, rname = start_recording("scene2_warm_checkin", 30)
    wait(2)
    
    # Tap the text input field (bottom of screen)
    tap(W // 2 - 100, H - 80)
    wait(1)
    
    # Type warm message
    type_text("Hey I was thinking about you at work today. How was your day?")
    wait(1)
    screenshot("05_typing_warm")
    
    # Tap Send button
    tap(W - 80, H - 80)
    wait(1)
    screenshot("06_mediating")
    
    # Wait for AI response (6-8 seconds)
    wait(8)
    screenshot("07_tier3_warm")
    
    stop_recording(rec, rpath, rname)
    
    # ─── SCENE 3: ESCALATING CONFLICT ──────────────────
    print("\n⚡ SCENE 3: Escalating Conflict")
    rec, rpath, rname = start_recording("scene3_conflict", 30)
    wait(2)
    
    # Tap input field
    tap(W // 2 - 100, H - 80)
    wait(1)
    
    # Type conflict message
    type_text("You never listen to me. I told you three times about dinner with my parents and you forgot AGAIN.")
    wait(1)
    screenshot("08_typing_conflict")
    
    # Tap Send
    tap(W - 80, H - 80)
    wait(1)
    screenshot("09_mediating_conflict")
    
    # Wait for AI
    wait(8)
    screenshot("10_tier3_conflict")
    
    stop_recording(rec, rpath, rname)
    
    # ─── SCENE 4: HOSTILE ACCUSATION ───────────────────
    print("\n🔥 SCENE 4: Hostile Accusation")
    rec, rpath, rname = start_recording("scene4_hostile", 30)
    wait(2)
    
    # Tap input
    tap(W // 2 - 100, H - 80)
    wait(1)
    
    # Type hostile message
    type_text("She is so selfish. All she cares about is her phone. I feel invisible in this relationship.")
    wait(1)
    screenshot("11_typing_hostile")
    
    # Tap Send
    tap(W - 80, H - 80)
    wait(1)
    
    # Wait for AI
    wait(8)
    screenshot("12_tier3_hostile")
    
    stop_recording(rec, rpath, rname)
    
    # ─── SCENE 5: PRIVATE JOURNAL ──────────────────────
    print("\n📔 SCENE 5: Private Journal")
    rec, rpath, rname = start_recording("scene5_journal", 20)
    wait(2)
    
    # Tap "My Journal" button (top right of header)
    tap(W - 100, 150)
    wait(2)
    screenshot("13_journal")
    
    # Scroll down to see entries
    swipe(W // 2, 1500, W // 2, 600, 500)
    wait(2)
    screenshot("14_journal_entries")
    
    stop_recording(rec, rpath, rname)
    
    # ─── SCENE 6: SAFETY HALT ──────────────────────────
    print("\n🛡️ SCENE 6: Safety HALT")
    
    # Go back to chat
    # Tap "← Back to Chat" (top left)
    tap(150, 150)
    wait(2)
    
    rec, rpath, rname = start_recording("scene6_safety", 25)
    wait(2)
    
    # Tap input
    tap(W // 2 - 100, H - 80)
    wait(1)
    
    # Type safety message
    type_text("I cannot do this anymore. Nobody would even notice if I just disappeared.")
    wait(1)
    screenshot("15_typing_safety")
    
    # Tap Send
    tap(W - 80, H - 80)
    wait(1)
    
    # Wait for HALT
    wait(4)
    screenshot("16_crisis_screen")
    
    # Show the crisis screen for a few seconds
    wait(3)
    
    # Scroll down to see resources
    swipe(W // 2, 1500, W // 2, 800, 500)
    wait(2)
    screenshot("17_crisis_resources")
    
    stop_recording(rec, rpath, rname)
    
    # ─── DONE ──────────────────────────────────────────
    print("\n" + "=" * 60)
    print("  DEMO RECORDING COMPLETE")
    print(f"  Files saved to: {DEMO_DIR}/")
    print("=" * 60)
    
    # List all files
    files = sorted(os.listdir(DEMO_DIR))
    print(f"\n  Screenshots: {len([f for f in files if f.endswith('.png')])} files")
    print(f"  Videos:      {len([f for f in files if f.endswith('.mp4')])} files")
    for f in files:
        size = os.path.getsize(os.path.join(DEMO_DIR, f))
        print(f"    {f:40s} {size // 1024:>6d} KB")

if __name__ == "__main__":
    main()
