// HyperFireworks - Optimized Mobile-Friendly Version with 1812 Overture
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

// OPTIMIZED: Reduced particle counts for mobile performance
// Sync with 1812 Overture climax at 15:28 (928 seconds) - THE MOST DRAMATIC MOMENT!
const LARGEST_EVENT_DATA_TIME = 164.3; // seconds into the data
const MUSIC_CLIMAX_TIME = 928; // seconds (15:28)
const SYNC_SPEED = LARGEST_EVENT_DATA_TIME / MUSIC_CLIMAX_TIME; // ≈ 0.177x
let playbackSpeed = SYNC_SPEED;

// Mobile detection
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
const PARTICLE_REDUCTION = isMobile ? 0.3 : 0.5; // Reduce particles by 50-70%

// Audio element
const audio = document.getElementById('bgmusic');

// Stats - track which events have been counted
let stats = {
    eventsFired: 0,
    liquidations: 0,
    adls: 0,
    totalVolume: 0,
    liquidationVolume: 0,
    adlVolume: 0
};
let processedEventIndices = new Set(); // Track which events we've already counted

// Resize canvas
function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Particle class - OPTIMIZED
class Particle {
    constructor(x, y, color, size, type) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = size;
        this.type = type;
        
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3 + 1; // Reduced speed
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed - Math.random();
        
        this.gravity = 0.08;
        this.friction = 0.97;
        this.opacity = 1;
        this.decay = Math.random() * 0.03 + 0.02; // Faster decay
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
        ctx.restore();
    }
    
    isDead() {
        return this.opacity <= 0;
    }
}

// Create firework - OPTIMIZED
function createFirework(x, y, event) {
    const amount = event.amount;
    const type = event.type;
    
    // Determine color
    let color;
    if (type === 'adl') {
        color = event.pnl >= 0 ? '#51cf66' : '#ff6b6b';
    } else {
        if (amount > 10000000) color = '#9b59b6';
        else if (amount > 1000000) color = '#ff6b6b';
        else if (amount > 100000) color = '#ffa500';
        else color = '#ffd700';
    }
    
    // OPTIMIZED: Balanced particle counts for smooth animation
    const baseSize = Math.log10(amount + 1) * 0.4;
    let particleCount = Math.min(Math.floor(baseSize * 6 * PARTICLE_REDUCTION), 50);
    
    // Special handling for the LARGEST event (the climax!)
    if (amount > 150000000) { // $150M+ (our largest is $193M)
        particleCount = isMobile ? 80 : 120; // Epic explosion for climax!
        showEventInfo(event, true); // Show longer
    } else {
        showEventInfo(event, false);
    }
    
    const particleSize = Math.min(baseSize * 0.6, 3);
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(x, y, color, particleSize, type));
    }
}

// Show event info - OPTIMIZED
function showEventInfo(event, isClimax = false) {
    const display = document.getElementById('event-display');
    const amount = formatMoney(event.amount);
    const typeLabel = event.type === 'adl' ? 'ADL' : 'LIQUIDATED';
    const pnlLabel = event.pnl >= 0 ? `+$${formatNumber(event.pnl)}` : `-$${formatNumber(Math.abs(event.pnl))}`;
    
    const fontSize = isClimax ? '2.5em' : (isMobile ? '1.2em' : '1.5em');
    const climaxText = isClimax ? '<div style="font-size: 0.8em; color: #ffd700; margin-top: 10px;">🔥 LARGEST EVENT! 🔥</div>' : '';
    
    display.innerHTML = `
        <div style="font-size: ${fontSize}; font-weight: bold; color: ${event.type === 'adl' ? (event.pnl >= 0 ? '#51cf66' : '#ff6b6b') : '#ff6b6b'};">
            ${typeLabel}
        </div>
        <div style="font-size: ${isMobile ? '1em' : '1.2em'}; margin: 10px 0;">
            ${event.ticker}: ${amount}
        </div>
        <div style="font-size: ${isMobile ? '0.8em' : '1em'}; opacity: 0.9;">
            PNL: ${pnlLabel}
        </div>
        ${climaxText}
    `;
    
    display.classList.add('show');
    setTimeout(() => {
        display.classList.remove('show');
    }, isClimax ? 3000 : 1200); // Show climax longer
}

// Format functions
function formatMoney(amount) {
    if (amount >= 1e9) return `$${(amount / 1e9).toFixed(2)}B`;
    else if (amount >= 1e6) return `$${(amount / 1e6).toFixed(2)}M`;
    else if (amount >= 1e3) return `$${(amount / 1e3).toFixed(2)}K`;
    else return `$${amount.toFixed(2)}`;
}

function formatNumber(num) {
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(num);
}

// Update stats
function updateStats() {
    document.getElementById('events-fired').textContent = formatNumber(stats.eventsFired);
    document.getElementById('liquidations-count').textContent = formatNumber(stats.liquidations);
    document.getElementById('adl-count').textContent = formatNumber(stats.adls);
    document.getElementById('total-volume').textContent = formatMoney(stats.totalVolume);
    document.getElementById('liquidation-volume').textContent = formatMoney(stats.liquidationVolume);
    document.getElementById('adl-volume').textContent = formatMoney(stats.adlVolume);
}

// Update timeline - CLICKABLE with music sync and stat recalculation
function updateTimeline(clickProgress = null) {
    if (!eventStartTime || events.length === 0) return;
    
    const startTimestamp = new Date(eventStartTime).getTime();
    const endTimestamp = new Date(events[events.length - 1].timestamp).getTime();
    
    let progress;
    if (clickProgress !== null) {
        progress = clickProgress;
        // Jump to this position
        const targetTimestamp = startTimestamp + (endTimestamp - startTimestamp) * (clickProgress / 100);
        
        // Find the corresponding event index
        for (let i = 0; i < events.length; i++) {
            const eventTimestamp = new Date(events[i].timestamp).getTime();
            if (eventTimestamp >= targetTimestamp) {
                currentEventIndex = i;
                
                // Recalculate stats up to this point
                processedEventIndices.clear();
                stats = { eventsFired: 0, liquidations: 0, adls: 0, totalVolume: 0, liquidationVolume: 0, adlVolume: 0 };
                
                for (let j = 0; j < currentEventIndex; j++) {
                    if (!processedEventIndices.has(j)) {
                        const evt = events[j];
                        stats.eventsFired++;
                        stats.totalVolume += evt.amount;
                        if (evt.type === 'adl') {
                            stats.adls++;
                            stats.adlVolume += evt.amount;
                        } else {
                            stats.liquidations++;
                            stats.liquidationVolume += evt.amount;
                        }
                        processedEventIndices.add(j);
                    }
                }
                updateStats();
                
                // Calculate elapsed data time (seconds)
                const elapsedDataTime = (eventTimestamp - startTimestamp) / 1000;
                
                // Calculate corresponding audio time
                // Data time / playback speed = audio time
                const targetAudioTime = elapsedDataTime / playbackSpeed;
                
                // Sync audio to this position
                if (audio && !isNaN(audio.duration) && audio.duration > 0) {
                    audio.currentTime = Math.min(targetAudioTime, audio.duration);
                }
                
                // Update startTime to maintain sync
                startTime = Date.now() - (elapsedDataTime * 1000 / playbackSpeed);
                
                break;
            }
        }
    } else {
        // Calculate progress based on ELAPSED TIME, not current event index
        // This ensures smooth progression even when there are gaps between events
        if (isPlaying && !isPaused) {
            const now = Date.now();
            const elapsedTime = (now - startTime) * playbackSpeed;
            const totalDuration = endTimestamp - startTimestamp;
            progress = Math.min(100, (elapsedTime / totalDuration) * 100);
        } else {
            // When paused, use current event position
            const currentEvent = events[currentEventIndex] || events[events.length - 1];
            const currentTimestamp = new Date(currentEvent.timestamp).getTime();
            progress = ((currentTimestamp - startTimestamp) / (endTimestamp - startTimestamp)) * 100;
        }
    }
    
    document.getElementById('timeline-progress').style.width = `${progress}%`;
    
    // Update time display in UTC based on ELAPSED TIME, not just current event
    let displayTime;
    if (isPlaying && !isPaused && clickProgress === null) {
        // Calculate current time based on elapsed playback time
        const now = Date.now();
        const elapsedTime = (now - startTime) * playbackSpeed;
        const currentTimestamp = startTimestamp + elapsedTime;
        displayTime = new Date(currentTimestamp);
    } else {
        // When paused or clicked, use current event time
        const currentEvent = events[currentEventIndex] || events[0];
        displayTime = new Date(currentEvent.timestamp);
    }
    
    // Format as UTC time (HH:MM:SS)
    const hours = String(displayTime.getUTCHours()).padStart(2, '0');
    const minutes = String(displayTime.getUTCMinutes()).padStart(2, '0');
    const seconds = String(displayTime.getUTCSeconds()).padStart(2, '0');
    const utcTimeString = `${hours}:${minutes}:${seconds}`;
    
    document.getElementById('current-time').textContent = utcTimeString;
}

// Animation loop - OPTIMIZED with proper event tracking and error handling
function animate() {
    // Always request next frame first to prevent freezing
    requestAnimationFrame(animate);
    
    try {
        // Clear with stronger fade for mobile
        ctx.fillStyle = isMobile ? 'rgba(0, 4, 40, 0.15)' : 'rgba(0, 4, 40, 0.1)';
        ctx.fillRect(0, 0, width, height);
        
        // Update and draw particles (limit to prevent performance issues)
        const maxParticles = isMobile ? 500 : 1000;
        if (particles.length > maxParticles) {
            particles.splice(0, particles.length - maxParticles);
        }
        
        for (let i = particles.length - 1; i >= 0; i--) {
            const particle = particles[i];
            if (particle && typeof particle.update === 'function') {
                particle.update();
                particle.draw();
                
                if (particle.isDead()) {
                    particles.splice(i, 1);
                }
            }
        }
        
        // Fire new events
        if (isPlaying && !isPaused && events.length > 0) {
            const now = Date.now();
            const elapsed = (now - startTime) * playbackSpeed;
            
            // Safety check
            if (!isFinite(elapsed) || elapsed < 0) {
                console.warn('Invalid elapsed time, resetting startTime');
                startTime = Date.now();
                return;
            }
            
            // OPTIMIZED: Process events in batches to reduce lag
            let eventsProcessed = 0;
            const MAX_EVENTS_PER_FRAME = isMobile ? 10 : 20;
            
            while (currentEventIndex < events.length && eventsProcessed < MAX_EVENTS_PER_FRAME) {
                const event = events[currentEventIndex];
                if (!event || !event.timestamp) {
                    console.warn(`Invalid event at index ${currentEventIndex}`);
                    currentEventIndex++;
                    continue;
                }
                
                const eventTimestamp = new Date(event.timestamp).getTime();
                const eventStartTimestamp = new Date(eventStartTime).getTime();
                const eventOffset = eventTimestamp - eventStartTimestamp;
                
                if (elapsed >= eventOffset) {
                    // Fire firework at random position
                    const x = Math.random() * width;
                    const y = Math.random() * (height * 0.6) + (height * 0.1);
                    
                    createFirework(x, y, event);
                    
                    // Update stats ONLY if this event hasn't been counted yet
                    if (!processedEventIndices.has(currentEventIndex)) {
                        stats.eventsFired++;
                        stats.totalVolume += event.amount;
                        if (event.type === 'adl') {
                            stats.adls++;
                            stats.adlVolume += event.amount;
                        } else {
                            stats.liquidations++;
                            stats.liquidationVolume += event.amount;
                        }
                        processedEventIndices.add(currentEventIndex);
                    }
                    
                    currentEventIndex++;
                    eventsProcessed++;
                } else {
                    break;
                }
            }
            
            if (eventsProcessed > 0) {
                updateStats();
            }
            
            updateTimeline();
            
            // Check if animation is complete
            if (currentEventIndex >= events.length) {
                isPlaying = false;
                document.getElementById('start-btn').textContent = '🔄 Replay';
            }
        }
    } catch (error) {
        console.error('Animation error:', error);
        // Continue animating even if there's an error
    }
}

// Load events
async function loadEvents() {
    try {
        const response = await fetch('events.json');
        events = await response.json();
        eventStartTime = events[0].timestamp;
        console.log(`Loaded ${events.length} events`);
        
        const endTime = new Date(events[events.length - 1].timestamp);
        // Format end time as UTC (HH:MM:SS)
        const endHours = String(endTime.getUTCHours()).padStart(2, '0');
        const endMinutes = String(endTime.getUTCMinutes()).padStart(2, '0');
        const endSeconds = String(endTime.getUTCSeconds()).padStart(2, '0');
        document.getElementById('end-time').textContent = `${endHours}:${endMinutes}:${endSeconds}`;
        
        // AUTO-START
        autoStart();
    } catch (error) {
        console.error('Error loading events:', error);
        alert('Error loading event data. Please refresh.');
    }
}

// Auto-start function
function autoStart() {
    console.log('Auto-starting visualization...');
    setTimeout(() => {
        startVisualization();
        // Attempt to play music immediately
        audio.play().then(() => {
            console.log('Music started successfully!');
        }).catch(e => {
            console.log('Music autoplay blocked by browser. Adding click listener...');
            // If autoplay fails, play on any user interaction
            const playOnClick = () => {
                audio.play().then(() => {
                    console.log('Music started after user interaction!');
                    document.removeEventListener('click', playOnClick);
                    document.removeEventListener('touchstart', playOnClick);
                }).catch(err => console.log('Audio play failed:', err));
            };
            document.addEventListener('click', playOnClick);
            document.addEventListener('touchstart', playOnClick);
        });
    }, 500); // Reduced delay for faster start
}

// Start visualization
function startVisualization() {
    if (!isPlaying) {
        if (currentEventIndex >= events.length) {
            // Replay - PROPERLY RESET EVERYTHING
            currentEventIndex = 0;
            stats = { eventsFired: 0, liquidations: 0, adls: 0, totalVolume: 0, liquidationVolume: 0, adlVolume: 0 };
            processedEventIndices.clear(); // Clear the set of processed events
            particles = [];
            updateStats();
            audio.currentTime = 0;
        }
        
        isPlaying = true;
        isPaused = false;
        startTime = Date.now();
        
        // Start music
        audio.play().catch(e => {
            console.log('Audio autoplay blocked. User interaction needed.');
        });
        
        document.getElementById('start-btn').textContent = '▶️ Playing...';
    }
}

// Click timeline to seek
document.getElementById('timeline-bar').addEventListener('click', (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = (x / rect.width) * 100;
    updateTimeline(percent);
});

// Touch support for timeline (mobile)
document.getElementById('timeline-bar').addEventListener('touchstart', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = e.target.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const percent = (x / rect.width) * 100;
    updateTimeline(percent);
});

// Control buttons
document.getElementById('start-btn').addEventListener('click', startVisualization);

document.getElementById('pause-btn').addEventListener('click', () => {
    if (isPlaying) {
        isPaused = !isPaused;
        if (isPaused) {
            document.getElementById('pause-btn').textContent = '▶️ Resume';
            audio.pause();
        } else {
            document.getElementById('pause-btn').textContent = '⏸️ Pause';
            audio.play();
            startTime = Date.now() - ((Date.now() - startTime) * playbackSpeed) / playbackSpeed;
        }
    }
});

document.getElementById('reset-btn').addEventListener('click', () => {
    isPlaying = false;
    isPaused = false;
    currentEventIndex = 0;
    particles = [];
    stats = { eventsFired: 0, liquidations: 0, adls: 0, totalVolume: 0, liquidationVolume: 0, adlVolume: 0 };
    processedEventIndices.clear(); // Clear processed events tracking
    updateStats();
    updateTimeline();
    audio.pause();
    audio.currentTime = 0;
    document.getElementById('start-btn').textContent = '🚀 Start';
    document.getElementById('pause-btn').textContent = '⏸️ Pause';
});

document.getElementById('speed-btn').addEventListener('click', () => {
    const speeds = [SYNC_SPEED, SYNC_SPEED * 2, SYNC_SPEED * 5, SYNC_SPEED * 10];
    const labels = ['1x (Synced)', '2x', '5x', '10x'];
    
    // Find closest speed to current playback speed
    let currentIndex = 0;
    let minDiff = Math.abs(playbackSpeed - speeds[0]);
    for (let i = 1; i < speeds.length; i++) {
        const diff = Math.abs(playbackSpeed - speeds[i]);
        if (diff < minDiff) {
            minDiff = diff;
            currentIndex = i;
        }
    }
    
    const nextIndex = (currentIndex + 1) % speeds.length;
    playbackSpeed = speeds[nextIndex];
    
    document.getElementById('speed-btn').textContent = `⚡ ${labels[nextIndex]}`;
    document.getElementById('speed-display').textContent = labels[nextIndex];
    
    if (isPlaying && !isPaused) {
        // Recalculate startTime to maintain position when changing speed
        const now = Date.now();
        const elapsedRealTime = now - startTime;
        startTime = now - (elapsedRealTime * playbackSpeed / speeds[currentIndex]);
    }
});

// Initialize
loadEvents().then(() => {
    animate();
    updateStats();
    // Set initial speed display
    document.getElementById('speed-btn').textContent = '⚡ 1x (Synced)';
    document.getElementById('speed-display').textContent = '1x (Synced)';
}).catch(error => {
    console.error('Failed to load events:', error);
    alert('Failed to load event data. Please refresh the page.');
});

// Audio loop
audio.addEventListener('ended', () => {
    audio.currentTime = 0;
    audio.play();
});

