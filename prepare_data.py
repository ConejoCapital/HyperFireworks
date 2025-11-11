#!/usr/bin/env python3
"""
Prepare liquidation and ADL data for fireworks visualization
"""

import pandas as pd
import json
from datetime import datetime

# Load data
print("Loading liquidation and ADL data...")
df_liq = pd.read_csv("../ADL Net Volume/liquidations_full_12min.csv")
df_adl = pd.read_csv("../ADL Net Volume/adl_fills_full_12min_raw.csv")

print(f"Loaded {len(df_liq):,} liquidations and {len(df_adl):,} ADL events")

# Prepare liquidation events
liquidations = []
for _, row in df_liq.iterrows():
    liquidations.append({
        'type': 'liquidation',
        'timestamp': row['block_time'],
        'user': row['user'],
        'ticker': row['coin'],
        'amount': abs(float(row['notional'])),
        'pnl': float(row['closed_pnl']),
        'direction': row['direction']
    })

# Prepare ADL events
adls = []
for _, row in df_adl.iterrows():
    adls.append({
        'type': 'adl',
        'timestamp': row['block_time'],
        'user': row['user'],
        'ticker': row['coin'],
        'amount': abs(float(row['notional'])),
        'pnl': float(row['closed_pnl']),
        'direction': row['direction']
    })

# Combine and sort by timestamp
all_events = liquidations + adls
all_events.sort(key=lambda x: x['timestamp'])

print(f"\nTotal events: {len(all_events):,}")
print(f"Time range: {all_events[0]['timestamp']} to {all_events[-1]['timestamp']}")

# Save as JSON
with open('public/events.json', 'w') as f:
    json.dump(all_events, f)

print(f"\n✅ Saved {len(all_events):,} events to public/events.json")

# Create summary stats
summary = {
    'total_events': len(all_events),
    'liquidations': len(liquidations),
    'adls': len(adls),
    'total_liquidation_amount': sum(e['amount'] for e in liquidations),
    'total_adl_amount': sum(e['amount'] for e in adls),
    'start_time': all_events[0]['timestamp'],
    'end_time': all_events[-1]['timestamp']
}

with open('public/summary.json', 'w') as f:
    json.dump(summary, f, indent=2)

print(f"✅ Saved summary to public/summary.json")
print(f"\nSummary:")
print(f"  Liquidations: {summary['liquidations']:,} (${summary['total_liquidation_amount']/1e9:.2f}B)")
print(f"  ADL: {summary['adls']:,} (${summary['total_adl_amount']/1e9:.2f}B)")

