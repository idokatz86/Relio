#!/usr/bin/env python3
"""Analyze the Relationship Communication Survey for Relio market validation."""
import csv
import json
from collections import Counter

FILE = '/Users/idokatz/Downloads/Relationship Communication Survey — Help Us Build Something Better.csv'

with open(FILE, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    rows = list(reader)

print(f"=== TOTAL RESPONSES: {len(rows)} ===\n")

# Get column names dynamically
headers = list(rows[0].keys())

# Map to short names by index
col_map = {
    'status': headers[1],
    'disagree': headers[2],
    'held_back': headers[3],
    'what_stops': headers[4],
    'tried': headers[5],
    'why_not': headers[6],
    'interest': headers[7],
    'features': headers[8],
    'price': headers[9],
    'urgency': headers[10],
    'age': headers[11],
    'country': headers[12],
    'notify': headers[13],
    'email': headers[14],
    'try_factors': headers[15],
}


def count_multi(rows, col_key):
    c = Counter()
    for r in rows:
        val = r[col_map[col_key]]
        for item in val.split(';'):
            item = item.strip()
            if item:
                c[item] += 1
    return c


def count_single(rows, col_key):
    return Counter(r[col_map[col_key]] for r in rows)


def print_counts(title, counts, total):
    print(f"\n=== {title} ===")
    for k, v in counts.most_common():
        print(f"  {k}: {v} ({v/total*100:.1f}%)")


n = len(rows)

# 1. Relationship Status
print_counts("1. RELATIONSHIP STATUS", count_single(rows, 'status'), n)

# 2. Disagreement patterns
print_counts("2. DISAGREEMENT PATTERNS (multi-select)", count_multi(rows, 'disagree'), n)

# 3. Held back
print_counts("3. EVER HELD BACK FROM SAYING SOMETHING?", count_single(rows, 'held_back'), n)

# 4. What stops them
print_counts("4. WHAT STOPS YOU FROM SAYING WHAT YOU FEEL? (multi-select)", count_multi(rows, 'what_stops'), n)

# 5. Tried solutions
print_counts("5. SOLUTIONS TRIED (multi-select)", count_multi(rows, 'tried'), n)

# 6. Why didn't it work
print_counts("6. WHY DIDN'T IT WORK? (multi-select)", count_multi(rows, 'why_not'), n)

# 7. Interest level
print("\n=== 7. INTEREST IN AI TOOL (1-5 scale) ===")
interest = count_single(rows, 'interest')
for k, v in sorted(interest.items()):
    print(f"  Level {k}: {v} ({v/n*100:.1f}%)")
total_interest = sum(int(k)*v for k, v in interest.items() if k.isdigit())
avg_interest = total_interest / n
print(f"  >> AVERAGE INTEREST: {avg_interest:.2f}/5")
high_interest = sum(v for k, v in interest.items() if k.isdigit() and int(k) >= 4)
print(f"  >> HIGH INTEREST (4-5): {high_interest} ({high_interest/n*100:.1f}%)")

# 8. Features
print_counts("8. MOST DESIRED FEATURES (multi-select)", count_multi(rows, 'features'), n)

# 9. Willingness to pay
print_counts("9. WILLINGNESS TO PAY", count_single(rows, 'price'), n)
price = count_single(rows, 'price')
paying = sum(v for k, v in price.items() if 'free' not in k.lower() and "wouldn" not in k.lower())
print(f"  >> WILLING TO PAY SOMETHING: {paying} ({paying/n*100:.1f}%)")

# 10. Urgency
print("\n=== 10. URGENCY (1-10 scale) ===")
urgency = count_single(rows, 'urgency')
for k, v in sorted(urgency.items(), key=lambda x: int(x[0]) if x[0].isdigit() else 0):
    print(f"  Level {k}: {v} ({v/n*100:.1f}%)")
total_urgency = sum(int(k)*v for k, v in urgency.items() if k.isdigit())
avg_urgency = total_urgency / n
print(f"  >> AVERAGE URGENCY: {avg_urgency:.2f}/10")
high_urgency = sum(v for k, v in urgency.items() if k.isdigit() and int(k) >= 7)
print(f"  >> HIGH URGENCY (7-10): {high_urgency} ({high_urgency/n*100:.1f}%)")

# 11. Age
print_counts("11. AGE RANGE", count_single(rows, 'age'), n)

# 12. Country
print_counts("12. COUNTRY", count_single(rows, 'country'), n)

# 13. Notify
print_counts("13. WANT TO BE NOTIFIED AT LAUNCH?", count_single(rows, 'notify'), n)

# 14. Emails
emails = [r[col_map['email']] for r in rows if r[col_map['email']].strip()]
print(f"\n=== 14. EMAILS COLLECTED: {len(emails)} ===")

# 15. Try factors
print_counts("15. WHAT WOULD MAKE THEM TRY? (multi-select)", count_multi(rows, 'try_factors'), n)

# === CROSS-TABULATIONS ===
print("\n\n" + "="*60)
print("=== CROSS-TABULATIONS ===")
print("="*60)

# Interest by relationship status
print("\n--- Interest by Relationship Status ---")
for status in count_single(rows, 'status').most_common():
    status_name = status[0]
    status_rows = [r for r in rows if r[col_map['status']] == status_name]
    if not status_rows:
        continue
    vals = [int(r[col_map['interest']]) for r in status_rows if r[col_map['interest']].isdigit()]
    if vals:
        avg = sum(vals)/len(vals)
        hi = sum(1 for v in vals if v >= 4)
        print(f"  {status_name} (n={len(status_rows)}): avg={avg:.2f}, high-interest={hi} ({hi/len(status_rows)*100:.0f}%)")

# Urgency by relationship status
print("\n--- Urgency by Relationship Status ---")
for status in count_single(rows, 'status').most_common():
    status_name = status[0]
    status_rows = [r for r in rows if r[col_map['status']] == status_name]
    if not status_rows:
        continue
    vals = [int(r[col_map['urgency']]) for r in status_rows if r[col_map['urgency']].isdigit()]
    if vals:
        avg = sum(vals)/len(vals)
        hi = sum(1 for v in vals if v >= 7)
        print(f"  {status_name} (n={len(status_rows)}): avg={avg:.2f}, high-urgency={hi} ({hi/len(status_rows)*100:.0f}%)")

# WTP by interest level
print("\n--- Willingness to Pay by Interest Level ---")
for level in ['1', '2', '3', '4', '5']:
    level_rows = [r for r in rows if r[col_map['interest']] == level]
    if not level_rows:
        continue
    wtp = Counter(r[col_map['price']] for r in level_rows)
    paying = sum(v for k, v in wtp.items() if 'free' not in k.lower() and "wouldn" not in k.lower())
    print(f"  Interest={level} (n={len(level_rows)}): willing-to-pay={paying} ({paying/len(level_rows)*100:.0f}%)")

# Features desired by high-interest users (4-5)
print("\n--- Features Desired by HIGH-INTEREST Users (4-5) ---")
hi_rows = [r for r in rows if r[col_map['interest']].isdigit() and int(r[col_map['interest']]) >= 4]
hi_features = Counter()
for r in hi_rows:
    for item in r[col_map['features']].split(';'):
        item = item.strip()
        if item:
            hi_features[item] += 1
for k, v in hi_features.most_common():
    print(f"  {k}: {v} ({v/len(hi_rows)*100:.1f}%)")

# Country by interest
print("\n--- Interest by Country (top countries) ---")
for country_name, cnt in count_single(rows, 'country').most_common(10):
    country_rows = [r for r in rows if r[col_map['country']] == country_name]
    vals = [int(r[col_map['interest']]) for r in country_rows if r[col_map['interest']].isdigit()]
    if vals:
        avg = sum(vals)/len(vals)
        print(f"  {country_name} (n={cnt}): avg interest={avg:.2f}")

print("\n\nDONE.")
