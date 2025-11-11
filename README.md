# 🎆 HyperFireworks

**Interactive Firework Visualization of the October 10, 2025 Hyperliquid Liquidation Cascade**

A beautiful, real-time visualization of the largest documented DeFi liquidation event, showing 98,620 liquidations and auto-deleveraging (ADL) events as fireworks.

🔗 **Live Demo**: [hyperfireworks.vercel.app](https://hyperfireworks.vercel.app)

---

## 🚀 Latest Updates (v1.4.0)

### 🔥 NEW: Major Research Discovery
- **CASCADE_TIMING_ANALYSIS.md added** - First documentation of ADL activation delay
- **61-second delay discovered** - 710 liquidations before first ADL
- **0.946 correlation proven** - Liquidations directly cause ADL activation
- **Burst pattern identified** - ADL activates in waves, not continuously
- **Visual validation** - The "chunks" you see are REAL cascade mechanics!

### Critical Bug Fixes ✅ (v1.3.0)
- **Fixed Double Counting**: Stats now accurately progress in real-time without re-summing on replay
- **Fixed Animation Freezing**: Enhanced error handling prevents animations from freezing or not showing
- **Fixed Progress Bar Stuck**: Timeline and progress bar never get stuck randomly anymore
- **Improved Data Accuracy**: Events counted exactly once, maintaining data representation accuracy
- **Better Performance**: Particle limits (500 mobile, 1000 desktop) prevent performance degradation
- **Enhanced Stability**: Comprehensive try-catch blocks ensure continuous operation even if errors occur

### Technical Improvements
- `processedEventIndices` Set tracks which events have been counted
- Stats automatically recalculate when jumping backwards on timeline
- Animation loop always requests next frame first (prevents freeze)
- Invalid event and particle validation before processing
- Safety checks for elapsed time calculations
- Proper cleanup on reset and replay

---

## 🔥 NEW: Cascade Timing Discovery

**📄 See: [CASCADE_TIMING_ANALYSIS.md](CASCADE_TIMING_ANALYSIS.md)**

### What You're Seeing: The "Chunks" Pattern is REAL!

The visualization shows **large chunks of red fireworks (liquidations) followed by green/red chunks (ADL)**. This is NOT a rendering artifact - **it's how the cascade actually unfolded!**

| Discovery | Finding |
|-----------|---------|
| **First liquidation** | Second 0 (event starts) |
| **First ADL** | **61 seconds later** |
| **Liquidations before ADL** | **710 events** |
| **Correlation** | 0.946 (liquidations predict ADL) |
| **Biggest burst** | 22,558 events/second (11,279 liqs + 11,279 ADLs) |

### The Pattern

```
🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴 (0-60s: Liquidations only - 710 events)
                        ↓ ADL threshold reached!
💥💥💥💥💥💥💥💥💥💥 (61s: MASSIVE burst - 22,558 events!)
🔴💥🔴💥🔴💥🔴💥🔴 (61-180s: Alternating waves)
```

### Why This Matters

- ✅ **ADL is NOT instantaneous** - 61-second delay before activation
- ✅ **ADL activates in BURSTS** - threshold-based, not continuous
- ✅ **Liquidations CAUSE ADL** - 0.946 correlation proves it
- ✅ **You can watch it unfold** - The chunks you see are the real cascade mechanics!

**This is the first documentation of ADL activation delay and burst patterns from blockchain data!**

---

## 📊 What This Visualizes

**Event**: October 10, 2025, 21:15-21:27 UTC (12 minutes)  
**Platform**: Hyperliquid L1 (Decentralized Perpetuals Exchange)  
**Total Market Impact**: **$7.61 BILLION**

### Event Breakdown

| Type | Events | Volume | Description |
|------|--------|--------|-------------|
| **Liquidations** | 63,637 | $5.51B | Users hit liquidation prices |
| **ADL (Auto-Deleveraging)** | 34,983 | $2.10B | Profitable positions force-closed |
| **TOTAL** | **98,620** | **$7.61B** | Complete cascade impact |

---

## 🎨 Firework Color Legend

### ADL Events
- 🟢 **Green Fireworks**: ADL with positive PNL (profitable position closed)
- 🔴 **Red Fireworks**: ADL with negative PNL (losing position closed)

### Liquidation Events
- 🟣 **Purple**: Mega liquidations (> $10M)
- 🔴 **Red**: Large liquidations ($1M - $10M)
- 🟠 **Orange**: Medium liquidations ($100K - $1M)
- 🟡 **Gold**: Small liquidations (< $100K)

### Firework Size
Size varies logarithmically with the amount liquidated/ADL'd:
- Larger amounts = Bigger, more particles
- Smaller amounts = Smaller, fewer particles

---

## 🎮 Controls

| Control | Function |
|---------|----------|
| **Auto-Start** | Visualization begins automatically when page loads |
| 🚀 **Start** | Begin/replay the visualization |
| ⏸️ **Pause** | Pause/resume playback |
| 🔄 **Reset** | Reset to beginning |
| ⚡ **Speed** | Cycle through playback speeds (1x Synced, 2x, 5x, 10x) |
| **Timeline** | Click/touch anywhere on the timeline to jump to that moment |

### 🎵 Musical Synchronization

The visualization is synced with **Tchaikovsky's 1812 Overture**:
- The music starts automatically with the visualization (click anywhere if blocked by browser)
- The **largest liquidation** ($193M BTC) fires exactly at **15:28** during the MOST dramatic moment 🔥💥
- Music loops automatically when finished
- Perfect dramatic timing for maximum impact!

---

## 📈 Live Statistics

The interface displays real-time stats:
- **Events Fired**: Total fireworks launched
- **Liquidations**: Number of liquidation events
- **ADL Events**: Number of auto-deleveraging events
- **Total Volume**: Cumulative $ amount
- **Timeline**: Current position in the 12-minute event

---

## 🔬 Data Source

**100% Blockchain-Verified Data**:
- Source: Hyperliquid S3 buckets (`node_fills_20251010_21.lz4`)
- All events explicitly labeled by the blockchain
- No heuristics or estimations
- Complete 12-minute dataset

**Related Research**:
- Full analysis: [HyperMultiAssetedADL](https://github.com/ConejoCapital/HyperMultiAssetedADL)
- Position-level data: [HyperAnalyzeADL](https://github.com/ConejoCapital/HyperAnalyzeADL)

---

## 🚀 Running Locally

### Prerequisites
- Python 3.6+ (for data preparation)
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Setup

1. **Clone the repository**:
```bash
git clone https://github.com/ConejoCapital/HyperFireworks.git
cd HyperFireworks
```

2. **Prepare the data** (if rebuilding):
```bash
python3 prepare_data.py
```

3. **Start local server**:
```bash
python3 -m http.server 8000 --directory public
```

4. **Open in browser**:
```
http://localhost:8000
```

---

## 🌐 Deploying to Vercel

This project is pre-configured for Vercel deployment:

### Option 1: GitHub Integration (Recommended)
1. Push to GitHub
2. Import repository in Vercel dashboard
3. Deploy automatically

### Option 2: Vercel CLI
```bash
npm install -g vercel
vercel --prod
```

### Configuration
- `vercel.json`: Pre-configured for static site hosting
- `package.json`: Metadata and scripts

---

## 📁 Project Structure

```
HyperFireworks/
├── public/
│   ├── index.html          # Main HTML file
│   ├── fireworks.js        # Animation logic
│   ├── events.json         # Event data (98,620 events)
│   └── summary.json        # Summary statistics
├── CASCADE_TIMING_ANALYSIS.md  # 🔥 NEW! Liquidation→ADL timing research
├── ADL_MECHANISM_RESEARCH.md   # ADL counterparty analysis
├── prepare_data.py         # Data preparation script
├── package.json            # NPM configuration
├── vercel.json             # Vercel deployment config
└── README.md               # This file
```

---

## 🎯 Key Features

### Visual Design
- ✨ Particle-based firework explosions
- 🌌 Beautiful gradient background
- 💫 Realistic physics (gravity, friction, decay)
- 🎨 Color-coded by event type and PNL
- 📏 Size-coded by amount

### User Experience
- 📊 Real-time statistics dashboard
- ⏱️ Timeline with progress bar
- 🎮 Interactive playback controls
- 🔍 Event details on firework launch
- 🎨 Legend for easy interpretation

### Performance
- ⚡ Efficient canvas rendering
- 🚀 Music-synced playback (1x, 2x, 5x, 10x)
- 🎯 Heavily optimized particle system (50-70% reduction)
- 📱 Fully mobile-optimized with touch support
- 🎵 1812 Overture synchronized to largest event at 15:28
- ⚡ Auto-starts on page load
- 👆 Clickable/touchable timeline navigation

---

## 🔍 Event Details Display

When each firework launches, you'll see:
- **Event Type**: "LIQUIDATED" or "ADL"
- **Ticker**: Asset symbol (BTC, ETH, SOL, etc.)
- **Amount**: Notional value ($)
- **PNL**: Realized profit/loss
- **Address**: Wallet address (truncated)

---

## 📊 Historical Significance

This visualization captures the **largest documented on-chain liquidation cascade in DeFi history**:

### Scale
- $7.6 BILLION in forced closures
- 98,620 events in 12 minutes
- 175 unique assets affected
- 8,218 events per minute sustained

### System Outcome
- Protocol remained solvent ✅
- ADL mechanism worked as designed ✅
- No insurance fund bankruptcy ✅
- Complete blockchain verification ✅

### Comparison
- **1,000x larger** than MakerDAO Black Thursday ($8M bad debt)
- **First complete** multi-asset DeFi cascade analysis
- **100% blockchain-verified** with full transaction trails

---

## 🎓 For Researchers

### Academic Value
This visualization demonstrates:
1. **Liquidation cascade mechanics** in real-time
2. **ADL trigger patterns** and distribution ⚡ **NEW: See CASCADE_TIMING_ANALYSIS.md**
3. **Market concentration** effects (65% in top 3 assets)
4. **System resilience** under extreme stress
5. **Event velocity** and temporal patterns
6. **🔥 ADL activation delay** - First documentation of 61-second threshold
7. **🔥 Burst-pattern behavior** - ADL activates in waves, not continuously
8. **🔥 Liquidation→ADL causation** - 0.946 correlation proves relationship

### Citation Data
```
Event: October 10, 2025 Liquidation Cascade
Platform: Hyperliquid L1
Total Impact: $7.61 billion USD
Duration: 12 minutes (21:15-21:27 UTC)
Events: 98,620 forced closures
Assets: 175 unique tickers
Visualization: HyperFireworks (https://github.com/ConejoCapital/HyperFireworks)
```

---

## 🛠️ Technology Stack

- **Frontend**: Pure HTML5, CSS3, JavaScript (ES6+)
- **Animation**: HTML5 Canvas API
- **Data Format**: JSON (pre-processed from CSV)
- **Hosting**: Vercel (static site)
- **Data Processing**: Python 3 + Pandas

---

## 📜 License

GPL-3.0 License - See [LICENSE](LICENSE) file for details

---

## 👥 Credits

**Created by**: Conejo Capital  
**Data Source**: Hyperliquid S3 Buckets  
**Research**: [HyperMultiAssetedADL](https://github.com/ConejoCapital/HyperMultiAssetedADL)

---

## 🔗 Related Projects

- 📊 [HyperMultiAssetedADL](https://github.com/ConejoCapital/HyperMultiAssetedADL) - Full cascade analysis
- 📈 [HyperAnalyzeADL](https://github.com/ConejoCapital/HyperAnalyzeADL) - Position-level data
- 🎆 [HyperFireworks](https://github.com/ConejoCapital/HyperFireworks) - This visualization

---

## 📧 Contact

For questions, issues, or research collaboration:
- Open an issue on GitHub
- Related repositories: See links above

---

## 🙏 Acknowledgments

Special thanks to:
- Hyperliquid team for open S3 data access
- SonarX for data quality verification
- The DeFi research community

---

**🎆 Watch the cascade unfold in real-time!**

*This visualization brings data to life, showing the largest DeFi liquidation event ever documented.*

**Live Demo**: [hyperfireworks.vercel.app](https://hyperfireworks.vercel.app)

