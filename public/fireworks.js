// HyperFireworks - Liquidation & ADL Visualization
// October 10, 2025 Event

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let width, height;
let events = [];
let particles = [];
let currentEventIndex = 0;
let startTime = null;
let eventStartTime = null;
let isPlaying = false;
let isPaused = false;
let playbackSpeed = 100; // 100x speed

// Stats
let stats = {
    eventsFired: 0,
    liquidations: 0,
    adls: 0,
    totalVolume: 0
};

// Resize canvas
function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Particle class for firework effects
class Particle {
    constructor(x, y, color, size, type) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = size;
        this.type = type;
        
        // Explosion properties
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 2;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed - Math.random() * 2;
        
        this.gravity = 0.05;
        this.friction = 0.98;
        this.opacity = 1;
        this.decay = Math.random() * 0.02 + 0.01;
    }
    
    update() {
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.vy += this.gravity;
        
        this.x += this.vx;
        this.y += this.vy;
        this.opacity -= this.decay;
    }
    
    draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Glow effect
        ctx.globalAlpha = this.opacity * 0.5;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
    
    isDead() {
        return this.opacity <= 0;
    }
}

// Create firework explosion
function createFirework(x, y, event) {
    const amount = event.amount;
    const type = event.type;
    
    // Determine color based on event type
    let color;
    if (type === 'adl') {
        color = event.pnl >= 0 ? '#51cf66' : '#ff6b6b'; // Green for positive, red for negative
    } else {
        // Liquidation - vary color based on amount
        if (amount > 10000000) { // > $10M
            color = '#9b59b6'; // Purple for huge
        } else if (amount > 1000000) { // > $1M
            color = '#ff6b6b'; // Red for large
        } else if (amount > 100000) { // > $100k
            color = '#ffa500'; // Orange for medium
        } else {
            color = '#ffd700'; // Gold for small
        }
    }
    
    // Determine size based on amount
    const baseSize = Math.log10(amount + 1) * 0.5;
    const particleCount = Math.min(Math.floor(baseSize * 10), 100);
    const particleSize = Math.min(baseSize * 0.8, 4);
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(x, y, color, particleSize, type));
    }
    
    // Show event info
    showEventInfo(event);
}

// Show event information on screen
function showEventInfo(event) {
    const display = document.getElementById('event-display');
    const amount = formatMoney(event.amount);
    const typeLabel = event.type === 'adl' ? 'ADL' : 'LIQUIDATED';
    const pnlLabel = event.pnl >= 0 ? `+$${formatNumber(event.pnl)}` : `-$${formatNumber(Math.abs(event.pnl))}`;
    
    display.innerHTML = `
        <div style="font-size: 1.5em; font-weight: bold; color: ${event.type === 'adl' ? (event.pnl >= 0 ? '#51cf66' : '#ff6b6b') : '#ff6b6b'};">
            ${typeLabel}
        </div>
        <div style="font-size: 1.2em; margin: 10px 0;">
            ${event.ticker}: ${amount}
        </div>
        <div style="font-size: 1em; opacity: 0.9;">
            PNL: ${pnlLabel}
        </div>
        <div class="address">
            ${event.user.substring(0, 10)}...${event.user.substring(event.user.length - 8)}
        </div>
    `;
    
    display.classList.add('show');
    setTimeout(() => {
        display.classList.remove('show');
    }, 1500);
}

// Format money
function formatMoney(amount) {
    if (amount >= 1e9) {
        return `$${(amount / 1e9).toFixed(2)}B`;
    } else if (amount >= 1e6) {
        return `$${(amount / 1e6).toFixed(2)}M`;
    } else if (amount >= 1e3) {
        return `$${(amount / 1e3).toFixed(2)}K`;
    } else {
        return `$${amount.toFixed(2)}`;
    }
}

// Format number
function formatNumber(num) {
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(num);
}

// Update stats display
function updateStats() {
    document.getElementById('events-fired').textContent = formatNumber(stats.eventsFired);
    document.getElementById('liquidations-count').textContent = formatNumber(stats.liquidations);
    document.getElementById('adl-count').textContent = formatNumber(stats.adls);
    document.getElementById('total-volume').textContent = formatMoney(stats.totalVolume);
}

// Update timeline
function updateTimeline() {
    if (!eventStartTime || events.length === 0) return;
    
    const startTimestamp = new Date(eventStartTime).getTime();
    const endTimestamp = new Date(events[events.length - 1].timestamp).getTime();
    const currentEvent = events[currentEventIndex] || events[events.length - 1];
    const currentTimestamp = new Date(currentEvent.timestamp).getTime();
    
    const progress = ((currentTimestamp - startTimestamp) / (endTimestamp - startTimestamp)) * 100;
    document.getElementById('timeline-progress').style.width = `${progress}%`;
    
    // Update time display
    const currentTime = new Date(currentEvent.timestamp);
    document.getElementById('current-time').textContent = currentTime.toTimeString().substring(0, 8);
}

// Animation loop
function animate() {
    // Clear canvas with fade effect
    ctx.fillStyle = 'rgba(0, 4, 40, 0.1)';
    ctx.fillRect(0, 0, width, height);
    
    // Update and draw particles
    for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        particle.update();
        particle.draw();
        
        if (particle.isDead()) {
            particles.splice(i, 1);
        }
    }
    
    // Fire new events
    if (isPlaying && !isPaused) {
        const now = Date.now();
        const elapsed = (now - startTime) * playbackSpeed; // Apply speed multiplier
        
        while (currentEventIndex < events.length) {
            const event = events[currentEventIndex];
            const eventTimestamp = new Date(event.timestamp).getTime();
            const eventStartTimestamp = new Date(eventStartTime).getTime();
            const eventOffset = eventTimestamp - eventStartTimestamp;
            
            if (elapsed >= eventOffset) {
                // Fire firework at random position
                const x = Math.random() * width;
                const y = Math.random() * (height * 0.6) + (height * 0.1); // Keep in upper 60% of screen
                
                createFirework(x, y, event);
                
                // Update stats
                stats.eventsFired++;
                stats.totalVolume += event.amount;
                if (event.type === 'adl') {
                    stats.adls++;
                } else {
                    stats.liquidations++;
                }
                
                updateStats();
                currentEventIndex++;
            } else {
                break;
            }
        }
        
        updateTimeline();
        
        // Check if animation is complete
        if (currentEventIndex >= events.length) {
            isPlaying = false;
            document.getElementById('start-btn').textContent = '🔄 Replay';
        }
    }
    
    requestAnimationFrame(animate);
}

// Load events data
async function loadEvents() {
    try {
        const response = await fetch('events.json');
        events = await response.json();
        eventStartTime = events[0].timestamp;
        console.log(`Loaded ${events.length} events`);
        
        // Set end time
        const endTime = new Date(events[events.length - 1].timestamp);
        document.getElementById('end-time').textContent = endTime.toTimeString().substring(0, 8);
    } catch (error) {
        console.error('Error loading events:', error);
        alert('Error loading event data. Please check the console.');
    }
}

// Control buttons
document.getElementById('start-btn').addEventListener('click', () => {
    if (!isPlaying) {
        if (currentEventIndex >= events.length) {
            // Replay
            currentEventIndex = 0;
            stats = { eventsFired: 0, liquidations: 0, adls: 0, totalVolume: 0 };
            particles = [];
            updateStats();
        }
        
        isPlaying = true;
        isPaused = false;
        startTime = Date.now();
        document.getElementById('start-btn').textContent = '▶️ Playing...';
    }
});

document.getElementById('pause-btn').addEventListener('click', () => {
    if (isPlaying) {
        isPaused = !isPaused;
        if (isPaused) {
            document.getElementById('pause-btn').textContent = '▶️ Resume';
        } else {
            document.getElementById('pause-btn').textContent = '⏸️ Pause';
            // Adjust start time to account for pause
            startTime = Date.now() - ((Date.now() - startTime) * playbackSpeed) / playbackSpeed;
        }
    }
});

document.getElementById('reset-btn').addEventListener('click', () => {
    isPlaying = false;
    isPaused = false;
    currentEventIndex = 0;
    particles = [];
    stats = { eventsFired: 0, liquidations: 0, adls: 0, totalVolume: 0 };
    updateStats();
    updateTimeline();
    document.getElementById('start-btn').textContent = '🚀 Start';
    document.getElementById('pause-btn').textContent = '⏸️ Pause';
});

document.getElementById('speed-btn').addEventListener('click', () => {
    const speeds = [10, 50, 100, 200, 500, 1000];
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextIndex = (currentIndex + 1) % speeds.length;
    playbackSpeed = speeds[nextIndex];
    
    document.getElementById('speed-btn').textContent = `⚡ Speed: ${playbackSpeed}x`;
    document.getElementById('speed-display').textContent = `${playbackSpeed}x`;
    
    // Adjust start time to maintain correct position
    if (isPlaying && !isPaused) {
        const elapsed = (Date.now() - startTime) * playbackSpeed;
        startTime = Date.now();
    }
});

// Initialize
loadEvents().then(() => {
    animate();
    updateStats();
});

