/* ==========================================================================
   XOX ULTRA INSANE - GAME ENGINE
   Procedural Pixel Art, 8-Bit Audio Synthesizer, Dynamic Particles, and Minimax AI
   ========================================================================== */

// --- CHARACTER & FIGHTER DEFINITIONS ---
const CHARACTERS = {
    cyberpunk: {
        id: "cyberpunk",
        name: "CYBER_PUNK",
        primaryColor: "#00ffcc", // Neon Cyan
        secondaryColor: "#9d00ff", // Neon Violet
        eyeColor: "#ffffff",
        weapon: "CYBER CROSS",
        grid: [
            [0, 1, 1, 1, 1, 1, 1, 0],
            [1, 1, 4, 4, 4, 4, 1, 1],
            [1, 4, 1, 1, 1, 1, 4, 1],
            [1, 1, 2, 2, 2, 2, 1, 1], // Visor
            [1, 1, 2, 2, 2, 2, 1, 1], // Visor
            [1, 4, 1, 1, 1, 1, 4, 1],
            [0, 1, 4, 1, 1, 4, 1, 0],
            [0, 0, 1, 1, 1, 1, 0, 0]
        ]
    },
    retrored: {
        id: "retrored",
        name: "RETRO_RED",
        primaryColor: "#ff0055", // Neon Pink/Red
        secondaryColor: "#ffcc00", // Yellow Glow
        eyeColor: "#ffffff",
        weapon: "PLASMA DISC",
        grid: [
            [0, 0, 1, 1, 1, 1, 0, 0],
            [0, 1, 1, 1, 1, 1, 1, 0],
            [1, 1, 4, 4, 4, 4, 1, 1],
            [1, 4, 2, 4, 4, 2, 4, 1], // Glowing red/yellow eyes
            [1, 1, 4, 4, 4, 4, 1, 1],
            [0, 1, 1, 4, 4, 1, 1, 0], // Steel jaw
            [0, 0, 1, 4, 4, 1, 0, 0],
            [0, 0, 1, 1, 1, 1, 0, 0]
        ]
    },
    glitchvoid: {
        id: "glitchvoid",
        name: "GLITCH_VOID",
        primaryColor: "#a300ff", // Dark Purple
        secondaryColor: "#00ffcc", // Electric Green
        eyeColor: "#ff0055",
        weapon: "VOID SPELL",
        grid: [
            [0, 0, 1, 1, 1, 1, 0, 0],
            [0, 1, 4, 4, 4, 4, 1, 0],
            [1, 4, 4, 2, 2, 4, 4, 1], // Glitch Core Eyes
            [1, 4, 2, 1, 1, 2, 4, 1],
            [1, 4, 4, 2, 2, 4, 4, 1],
            [0, 1, 4, 4, 4, 4, 1, 0],
            [0, 0, 1, 2, 2, 1, 0, 0],
            [1, 0, 0, 1, 1, 0, 0, 1] // Detached pixels
        ]
    },
    goldmech: {
        id: "goldmech",
        name: "GOLD_MECH",
        primaryColor: "#ffcc00", // Bright Gold
        secondaryColor: "#ff5500", // Copper/Amber
        eyeColor: "#00ffcc",
        weapon: "ARCADE COG",
        grid: [
            [0, 1, 0, 1, 1, 0, 1, 0], // Cog gear teeth
            [1, 1, 1, 1, 1, 1, 1, 1],
            [0, 1, 4, 4, 4, 4, 1, 0],
            [1, 1, 4, 2, 2, 4, 1, 1], // Cyan optical sensors
            [1, 1, 4, 4, 4, 4, 1, 1],
            [0, 1, 4, 1, 1, 4, 1, 0],
            [1, 1, 1, 1, 1, 1, 1, 1],
            [0, 1, 0, 1, 1, 0, 1, 0]
        ]
    }
};

// --- AUDIO ENGINE (WEB AUDIO API SYNTHESIZER) ---
class RetroAudioEngine {
    constructor() {
        this.ctx = null;
        this.muted = false;
    }

    init() {
        if (this.ctx) return;
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
            this.ctx = new AudioContext();
        }
    }

    setMute(state) {
        this.muted = state;
    }

    playBip() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.type = "square";
        osc.frequency.setValueAtTime(600, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.08);

        gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.08);
    }

    playConfirm() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.type = "sawtooth";
            osc.frequency.setValueAtTime(freq, now + idx * 0.06);
            gain.gain.setValueAtTime(0.04, now + idx * 0.06);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.12);

            osc.start(now + idx * 0.06);
            osc.stop(now + idx * 0.06 + 0.12);
        });
    }

    playPlop() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.type = "sine";
        osc.frequency.setValueAtTime(220, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.15);

        gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.15);
    }

    playExplode() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const bufferSize = this.ctx.sampleRate * 0.3; // 0.3 seconds
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);

        // Fill buffer with noise
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noiseNode = this.ctx.createBufferSource();
        noiseNode.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(800, this.ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(50, this.ctx.currentTime + 0.3);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);

        noiseNode.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        noiseNode.start();
        noiseNode.stop(this.ctx.currentTime + 0.3);
    }

    playWin() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const theme = [523.25, 587.33, 659.25, 698.46, 783.99, 880.00, 987.77, 1046.50]; // C5 to C6 Major Scale
        theme.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.type = "triangle";
            osc.frequency.setValueAtTime(freq, now + idx * 0.08);
            gain.gain.setValueAtTime(0.06, now + idx * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.005, now + idx * 0.08 + 0.2);

            osc.start(now + idx * 0.08);
            osc.stop(now + idx * 0.08 + 0.25);
        });
    }

    playLose() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const theme = [440.00, 392.00, 349.23, 293.66, 220.00]; // Descending sad tone
        theme.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.type = "sawtooth";
            osc.frequency.setValueAtTime(freq, now + idx * 0.12);
            gain.gain.setValueAtTime(0.05, now + idx * 0.12);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.25);

            osc.start(now + idx * 0.12);
            osc.stop(now + idx * 0.12 + 0.3);
        });
    }
}

const Audio = new RetroAudioEngine();

// --- PARTICLE CLASS ---
class Particle {
    constructor(x, y, color, size, shape = 'square') {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = size;
        this.shape = shape;
        
        // Random velocity
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4 + 1.5;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        
        // Life properties
        this.life = 1.0;
        this.decay = Math.random() * 0.03 + 0.015;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        
        // Dynamic friction / drag
        this.vx *= 0.96;
        this.vy *= 0.96;
        
        this.life -= this.decay;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        
        if (this.shape === 'square') {
            ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
        } else if (this.shape === 'glitch') {
            // Unstable stretching glitch pixel
            const h = this.size * (Math.random() > 0.7 ? 3 : 1);
            ctx.fillRect(this.x - this.size / 2, this.y - h / 2, this.size * 2, h);
        } else {
            // Spark line
            ctx.beginPath();
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 2;
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x - this.vx * 1.5, this.y - this.vy * 1.5);
            ctx.stroke();
        }
        ctx.restore();
    }
}

// --- MAIN GAME CONTROLLER ---
class GameEngine {
    constructor() {
        // Core state
        this.activeScreen = "menu-screen";
        this.mode = "ai"; // 'ai' or 'local'
        this.difficulty = "easy"; // 'easy', 'hard', 'insane'
        this.p1CharId = "cyberpunk";
        this.p2CharId = "retrored"; // Local player 2 or AI character
        this.board = Array(9).fill(null); // 3x3 flat array
        this.turn = "X"; // "X" always goes first, mapped to P1. "O" goes second.
        this.scores = { X: 0, O: 0, draws: 0 };
        this.gameOver = false;
        this.aiThinking = false;

        // Visual effects state
        this.particles = [];
        this.shakeTime = 0;
        this.shakeForce = 0;
        this.scanlineOffset = 0;
        this.gridColor = "#222a47";
        this.winningLine = null; // { line: [idx1, idx2, idx3], progress: 0 }
        
        // Elements
        this.canvas = document.getElementById("game-canvas");
        this.ctx = this.canvas.getContext("2d");
        
        // Bind functions
        this.tick = this.tick.bind(this);
    }

    init() {
        this.setupMenuPortraits();
        this.setupEventListeners();
        this.updateAIPresentation();
        
        // Start Canvas Engine Loop
        requestAnimationFrame(this.tick);
        
        this.logToTerminal("OPERATIONAL GRID ONLINE.", "green");
        this.logToTerminal("READY FOR INPUT CODES.", "green");
    }

    // --- PROCEDURAL PORTRAIT GENERATOR ---
    setupMenuPortraits() {
        // Draw character portraits in the selection grid
        Object.keys(CHARACTERS).forEach(charId => {
            const containerId = `portrait-${charId}`;
            const container = document.getElementById(containerId);
            if (container) {
                const cvs = document.createElement("canvas");
                cvs.width = 48;
                cvs.height = 48;
                cvs.style.width = "48px";
                cvs.style.height = "48px";
                cvs.style.imageRendering = "pixelated";
                container.appendChild(cvs);
                
                const cctx = cvs.getContext("2d");
                this.drawPortraitOnCanvas(cctx, charId, 48);
            }
        });
    }

    drawPortraitOnCanvas(ctx, charId, size) {
        const char = CHARACTERS[charId];
        const pixelSize = size / 8;
        
        ctx.clearRect(0, 0, size, size);
        
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const val = char.grid[row][col];
                if (val === 0) continue; // transparent
                
                if (val === 1) {
                    ctx.fillStyle = char.primaryColor;
                } else if (val === 2) {
                    ctx.fillStyle = char.secondaryColor;
                } else if (val === 3) {
                    ctx.fillStyle = char.eyeColor;
                } else {
                    // Shadow/Face contour (deep indigo or dark gray)
                    ctx.fillStyle = "#16192d";
                }
                ctx.fillRect(col * pixelSize, row * pixelSize, pixelSize, pixelSize);
            }
        }
    }

    setupEventListeners() {
        // --- AUDIO HOOKS ---
        document.querySelectorAll("[data-sound]").forEach(el => {
            el.addEventListener("click", () => {
                const snd = el.getAttribute("data-sound");
                if (snd === "select") Audio.playBip();
                if (snd === "confirm") Audio.playConfirm();
            });
        });

        // --- MENU CONTROLS ---
        // Mode select buttons
        const aiBtn = document.getElementById("mode-ai-btn");
        const localBtn = document.getElementById("mode-local-btn");
        const difficultyWrapper = document.getElementById("ai-difficulty-wrapper");

        aiBtn.addEventListener("click", () => {
            this.mode = "ai";
            aiBtn.classList.add("active");
            localBtn.classList.remove("active");
            difficultyWrapper.style.display = "block";
            this.updateAIPresentation();
        });

        localBtn.addEventListener("click", () => {
            this.mode = "local";
            localBtn.classList.add("active");
            aiBtn.classList.remove("active");
            difficultyWrapper.style.display = "none";
            this.updateAIPresentation();
        });

        // Difficulty selectors
        document.querySelectorAll(".difficulty-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                document.querySelectorAll(".difficulty-btn").forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                this.difficulty = btn.getAttribute("data-diff");
                this.updateAIPresentation();
            });
        });

        // Character Select Card Toggles
        document.querySelectorAll(".char-card").forEach(card => {
            card.addEventListener("click", () => {
                document.querySelectorAll(".char-card").forEach(c => c.classList.remove("active"));
                card.classList.add("active");
                this.p1CharId = card.getAttribute("data-char");
                
                // Dynamically assign an opponent character (preventing exact same style sometimes)
                const pool = Object.keys(CHARACTERS).filter(c => c !== this.p1CharId);
                this.p2CharId = pool[Math.floor(Math.random() * pool.length)] || "retrored";
            });
        });

        // Launch Simulation Button
        document.getElementById("start-game-btn").addEventListener("click", () => {
            this.startGame();
        });

        // --- GAMEPLAY CONTROLS ---
        this.canvas.addEventListener("click", (e) => this.handleCanvasClick(e));

        document.getElementById("restart-btn").addEventListener("click", () => {
            this.resetBoard();
            this.logToTerminal("BOARD PURGED & REALLOCATED.", "yellow");
        });

        document.getElementById("chaos-btn").addEventListener("click", () => {
            this.triggerScreenShake(30);
            this.triggerGlitchEffect();
            Audio.playExplode();
            this.logToTerminal("CHAOS SEED INJECTED. VISUAL GLITCH DETECTED.", "red");
        });

        document.getElementById("menu-btn").addEventListener("click", () => {
            this.switchScreen("menu-screen");
            Audio.playBip();
        });

        // Sound controller
        const audioBtn = document.getElementById("audio-toggle-btn");
        const soundStatus = document.getElementById("sound-status");
        audioBtn.addEventListener("click", () => {
            Audio.muted = !Audio.muted;
            soundStatus.textContent = Audio.muted ? "OFF" : "ON";
            if (!Audio.muted) {
                Audio.init();
                Audio.playBip();
            }
        });

        // Overlay modals
        document.getElementById("rematch-btn").addEventListener("click", () => {
            document.getElementById("game-over-overlay").classList.remove("active");
            this.resetBoard();
        });

        document.getElementById("overlay-menu-btn").addEventListener("click", () => {
            document.getElementById("game-over-overlay").classList.remove("active");
            this.switchScreen("menu-screen");
        });
    }

    updateAIPresentation() {
        const warning = document.getElementById("difficulty-warning");
        if (this.mode === "local") {
            warning.textContent = "CO-OP DEPLOYED. RETRO GAMER PASS-AND-PLAY EN ROUTE.";
            warning.className = "difficulty-desc text-green";
            return;
        }

        switch (this.difficulty) {
            case "easy":
                warning.textContent = "AI POTATO v0.1: Extremely chill. Prone to absolute blunders.";
                warning.className = "difficulty-desc text-green";
                break;
            case "hard":
                warning.textContent = "CYBERNETIC CHIP v2.0: Aggressive calculation. Plays to win.";
                warning.className = "difficulty-desc text-yellow";
                break;
            case "insane":
                warning.textContent = "INSANE BOT v9.9: Unstable mainframe. UNBEATABLE MINIMAX AI. Highly toxic.";
                warning.className = "difficulty-desc text-red";
                break;
        }
    }

    switchScreen(screenId) {
        document.querySelectorAll(".screen-view").forEach(v => v.classList.remove("active"));
        document.getElementById(screenId).classList.add("active");
        this.activeScreen = screenId;
    }

    startGame() {
        // Transfer scores
        this.scores = { X: 0, O: 0, draws: 0 };
        document.getElementById("p1-score").textContent = "00";
        document.getElementById("p2-score").textContent = "00";

        // Setup portraits inside scores
        this.renderFighterScoreAvatars();

        // Label update
        const p2Label = document.getElementById("p2-label");
        p2Label.textContent = this.mode === "ai" ? "AI (O)" : "P2 (O)";

        this.resetBoard();
        this.switchScreen("game-screen");

        this.logToTerminal(`SIMULATION MATCH ENGAGED.`, "green");
        this.logToTerminal(`P1: ${CHARACTERS[this.p1CharId].name} [${CHARACTERS[this.p1CharId].weapon}]`, "cyan");
        const p2Name = CHARACTERS[this.p2CharId].name;
        this.logToTerminal(`P2: ${this.mode === 'ai' ? 'BOT_' : ''}${p2Name} [${CHARACTERS[this.p2CharId].weapon}]`, "pink");
    }

    renderFighterScoreAvatars() {
        const p1Cvs = document.createElement("canvas");
        p1Cvs.width = 32; p1Cvs.height = 32;
        p1Cvs.style.imageRendering = "pixelated";
        const p1Box = document.getElementById("game-p1-avatar");
        p1Box.innerHTML = "";
        p1Box.appendChild(p1Cvs);
        this.drawPortraitOnCanvas(p1Cvs.getContext("2d"), this.p1CharId, 32);

        const p2Cvs = document.createElement("canvas");
        p2Cvs.width = 32; p2Cvs.height = 32;
        p2Cvs.style.imageRendering = "pixelated";
        const p2Box = document.getElementById("game-p2-avatar");
        p2Box.innerHTML = "";
        p2Box.appendChild(p2Cvs);
        this.drawPortraitOnCanvas(p2Cvs.getContext("2d"), this.p2CharId, 32);
    }

    resetBoard() {
        this.board = Array(9).fill(null);
        this.turn = "X";
        this.gameOver = false;
        this.aiThinking = false;
        this.winningLine = null;
        this.particles = [];
        this.triggerScreenShake(5);
    }

    logToTerminal(text, colorClass = "green") {
        const term = document.getElementById("terminal-content");
        if (!term) return;

        const line = document.createElement("div");
        line.className = `log-line text-${colorClass}`;
        line.textContent = `> ${text}`;
        term.appendChild(line);

        // Keep last 6 lines
        while (term.children.length > 6) {
            term.removeChild(term.firstChild);
        }
    }

    // --- SCREEN SHAKE & FX ---
    triggerScreenShake(intensity) {
        this.shakeForce = intensity;
        this.shakeTime = 10; // Frames
    }

    triggerGlitchEffect() {
        const body = document.body;
        body.classList.add("glitch-chaos");
        setTimeout(() => {
            body.classList.remove("glitch-chaos");
        }, 350);
    }

    // --- CANVAS DRAWING / RETRO RENDERING ---
    tick() {
        // Handle shake calculation
        let dx = 0;
        let dy = 0;
        if (this.shakeTime > 0) {
            dx = (Math.random() - 0.5) * this.shakeForce;
            dy = (Math.random() - 0.5) * this.shakeForce;
            this.shakeTime--;
            this.shakeForce *= 0.85;
            
            // Add shake class to board for extra dynamic depth
            document.getElementById("board-container").classList.add("shake-effect");
        } else {
            document.getElementById("board-container").classList.remove("shake-effect");
        }

        // Save context and offset for screenshake
        this.ctx.save();
        this.ctx.translate(dx, dy);

        // Render gameplay elements
        if (this.activeScreen === "game-screen") {
            this.drawBoard();
        }

        this.ctx.restore();

        // Repeat frame loop
        requestAnimationFrame(this.tick);
    }

    drawBoard() {
        const w = this.canvas.width;
        const h = this.canvas.height;
        const cellW = w / 3;
        const cellH = h / 3;

        // 1. Clear background
        this.ctx.fillStyle = "#070913";
        this.ctx.fillRect(0, 0, w, h);

        // Ambient background pixel particles (moving cyber-dust)
        if (Math.random() > 0.8) {
            const rx = Math.random() * w;
            const ry = Math.random() * h;
            const charColors = [CHARACTERS[this.p1CharId].primaryColor, CHARACTERS[this.p2CharId].primaryColor];
            const col = charColors[Math.floor(Math.random() * charColors.length)];
            const size = Math.random() > 0.8 ? 4 : 2;
            this.particles.push(new Particle(rx, ry, col, size, 'square'));
        }

        // 2. Draw retro CRT cyber grid lines
        this.ctx.strokeStyle = this.gridColor;
        this.ctx.lineWidth = 6;
        
        // Draw grid boundaries with electric glow effect
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = this.gridColor;

        // Vertical Grid Lines
        for (let i = 1; i < 3; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(i * cellW, 10);
            this.ctx.lineTo(i * cellW, h - 10);
            this.ctx.stroke();
        }
        // Horizontal Grid Lines
        for (let i = 1; i < 3; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(10, i * cellH);
            this.ctx.lineTo(w - 10, i * cellH);
            this.ctx.stroke();
        }

        // Reset shadows
        this.ctx.shadowBlur = 0;

        // 3. Draw Placed Marks (X or O) with custom character designs
        for (let i = 0; i < 9; i++) {
            const mark = this.board[i];
            if (!mark) continue;

            const col = i % 3;
            const row = Math.floor(i / 3);
            const cx = col * cellW + cellW / 2;
            const cy = row * cellH + cellH / 2;

            if (mark === "X") {
                this.drawXSymbol(cx, cy, CHARACTERS[this.p1CharId]);
            } else if (mark === "O") {
                this.drawOSymbol(cx, cy, CHARACTERS[this.p2CharId]);
            }
        }

        // 4. Update and Draw Particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.update();
            if (p.life <= 0) {
                this.particles.splice(i, 1);
            } else {
                p.draw(this.ctx);
            }
        }

        // 5. Draw Laser Winning Line Strike (with huge particle storm!)
        if (this.winningLine) {
            this.drawLaserVictory();
        }
    }

    drawXSymbol(cx, cy, char) {
        // Cyan Cyberpunk / High tech styling
        const r = 50;
        this.ctx.save();
        this.ctx.shadowBlur = 15;
        this.ctx.shadowColor = char.primaryColor;
        
        this.ctx.strokeStyle = char.primaryColor;
        this.ctx.lineWidth = 14;
        this.ctx.lineCap = "square";

        // Draw cross lines (simulated chunky retro design)
        this.ctx.beginPath();
        this.ctx.moveTo(cx - r, cy - r);
        this.ctx.lineTo(cx + r, cy + r);
        this.ctx.moveTo(cx + r, cy - r);
        this.ctx.lineTo(cx - r, cy + r);
        this.ctx.stroke();

        // Draw a inner core line for retro energy glow
        this.ctx.strokeStyle = "#ffffff";
        this.ctx.lineWidth = 4;
        this.ctx.stroke();

        // Drawing accent boxes at terminal endpoints
        this.ctx.fillStyle = char.secondaryColor;
        this.ctx.fillRect(cx - r - 6, cy - r - 6, 12, 12);
        this.ctx.fillRect(cx + r - 6, cy + r - 6, 12, 12);
        this.ctx.fillRect(cx + r - 6, cy - r - 6, 12, 12);
        this.ctx.fillRect(cx - r - 6, cy + r - 6, 12, 12);

        this.ctx.restore();
    }

    drawOSymbol(cx, cy, char) {
        const r = 55;
        this.ctx.save();
        this.ctx.shadowBlur = 15;
        this.ctx.shadowColor = char.primaryColor;

        this.ctx.strokeStyle = char.primaryColor;
        this.ctx.lineWidth = 14;

        if (char.id === "goldmech") {
            // Draw a gear cog instead of a simple circle!
            const teeth = 8;
            this.ctx.beginPath();
            for (let i = 0; i < teeth * 2; i++) {
                const angle = (i * Math.PI) / teeth;
                const dist = i % 2 === 0 ? r : r - 12;
                const tx = cx + Math.cos(angle) * dist;
                const ty = cy + Math.sin(angle) * dist;
                if (i === 0) this.ctx.moveTo(tx, ty);
                else this.ctx.lineTo(tx, ty);
            }
            this.ctx.closePath();
            this.ctx.stroke();
            
            // Draw inner brass ring
            this.ctx.strokeStyle = char.secondaryColor;
            this.ctx.lineWidth = 4;
            this.ctx.beginPath();
            this.ctx.arc(cx, cy, r - 20, 0, Math.PI * 2);
            this.ctx.stroke();
        } else {
            // Standard cyberpunk plasma ring/portal
            this.ctx.beginPath();
            this.ctx.arc(cx, cy, r, 0, Math.PI * 2);
            this.ctx.stroke();

            this.ctx.strokeStyle = "#ffffff";
            this.ctx.lineWidth = 4;
            this.ctx.beginPath();
            this.ctx.arc(cx, cy, r, 0, Math.PI * 2);
            this.ctx.stroke();

            // Accent pixel notches surrounding it
            this.ctx.fillStyle = char.secondaryColor;
            this.ctx.fillRect(cx - 5, cy - r - 5, 10, 10);
            this.ctx.fillRect(cx - 5, cy + r - 5, 10, 10);
            this.ctx.fillRect(cx - r - 5, cy - 5, 10, 10);
            this.ctx.fillRect(cx + r - 5, cy - 5, 10, 10);
        }

        this.ctx.restore();
    }

    drawLaserVictory() {
        const cellW = this.canvas.width / 3;
        const cellH = this.canvas.height / 3;
        const line = this.winningLine.line;

        const idx1 = line[0];
        const idx3 = line[2];

        const x1 = (idx1 % 3) * cellW + cellW / 2;
        const y1 = Math.floor(idx1 / 3) * cellH + cellH / 2;

        const x2 = (idx3 % 3) * cellW + cellW / 2;
        const y2 = Math.floor(idx3 / 3) * cellH + cellH / 2;

        this.ctx.save();
        
        // Progressively draw laser
        if (this.winningLine.progress < 1.0) {
            this.winningLine.progress += 0.05;
        }

        const currX = x1 + (x2 - x1) * this.winningLine.progress;
        const currY = y1 + (y2 - y1) * this.winningLine.progress;

        // Laser plasma background glow
        this.ctx.shadowBlur = 20;
        this.ctx.shadowColor = "#ff0055";
        this.ctx.strokeStyle = "#ff0055";
        this.ctx.lineWidth = 16;
        this.ctx.lineCap = "round";

        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(currX, currY);
        this.ctx.stroke();

        // Core white-hot laser
        this.ctx.strokeStyle = "#ffffff";
        this.ctx.lineWidth = 6;
        this.ctx.stroke();

        this.ctx.restore();

        // Spew fire/plasma particles from leading edge
        if (this.winningLine.progress < 1.0) {
            for (let i = 0; i < 4; i++) {
                this.particles.push(new Particle(currX, currY, "#ff0055", 6, 'line'));
                this.particles.push(new Particle(currX, currY, "#ffcc00", 4, 'glitch'));
            }
        }
    }

    // --- GAMEPLAY INPUT ---
    handleCanvasClick(e) {
        if (this.gameOver || this.aiThinking) return;

        // Map client click down to Canvas resolution coords (600x600)
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;

        const mouseX = (e.clientX - rect.left) * scaleX;
        const mouseY = (e.clientY - rect.top) * scaleY;

        const col = Math.floor(mouseX / (this.canvas.width / 3));
        const row = Math.floor(mouseY / (this.canvas.height / 3));
        const cellIdx = row * 3 + col;

        if (cellIdx >= 0 && cellIdx < 9 && !this.board[cellIdx]) {
            this.makeMove(cellIdx);
        }
    }

    makeMove(idx) {
        // 1. Assign move
        const playerMark = this.turn;
        this.board[idx] = playerMark;
        
        // 2. Spawn dynamic burst particles
        const cellW = this.canvas.width / 3;
        const cellH = this.canvas.height / 3;
        const col = idx % 3;
        const row = Math.floor(idx / 3);
        const cx = col * cellW + cellW / 2;
        const cy = row * cellH + cellH / 2;

        const activeChar = playerMark === "X" ? CHARACTERS[this.p1CharId] : CHARACTERS[this.p2CharId];
        
        // Spawn particles
        for (let i = 0; i < 20; i++) {
            this.particles.push(new Particle(cx, cy, activeChar.primaryColor, Math.random() * 5 + 3, 'square'));
            this.particles.push(new Particle(cx, cy, activeChar.secondaryColor, Math.random() * 4 + 2, 'line'));
        }

        // Screenshake and audio feedback
        this.triggerScreenShake(8);
        Audio.playPlop();

        const logMsg = `${activeChar.name} MOVED AT [${col}, ${row}]`;
        this.logToTerminal(logMsg, playerMark === "X" ? "cyan" : "pink");

        // 3. Check for Win/Draw
        if (this.checkGameOver()) return;

        // 4. Toggle turn
        this.turn = this.turn === "X" ? "O" : "X";

        // 5. Trigger AI if appropriate
        if (this.mode === "ai" && this.turn === "O") {
            this.triggerAIMove();
        }
    }

    checkGameOver() {
        const winCombo = this.findWinningCombo();
        if (winCombo) {
            this.handleVictory(winCombo);
            return true;
        }

        // Draw check
        if (this.board.every(cell => cell !== null)) {
            this.handleDraw();
            return true;
        }

        return false;
    }

    findWinningCombo() {
        const combos = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
            [0, 4, 8], [2, 4, 6]             // diagonals
        ];

        for (const c of combos) {
            if (this.board[c[0]] && this.board[c[0]] === this.board[c[1]] && this.board[c[0]] === this.board[c[2]]) {
                return c;
            }
        }
        return null;
    }

    handleVictory(combo) {
        this.gameOver = true;
        const winningMark = this.board[combo[0]];
        this.winningLine = { line: combo, progress: 0 };
        this.scores[winningMark]++;

        // Update score indicators
        document.getElementById("p1-score").textContent = String(this.scores.X).padStart(2, '0');
        document.getElementById("p2-score").textContent = String(this.scores.O).padStart(2, '0');

        const isP1 = winningMark === "X";
        const char = isP1 ? CHARACTERS[this.p1CharId] : CHARACTERS[this.p2CharId];

        // Highlight screen chaos
        this.triggerScreenShake(20);
        this.triggerGlitchEffect();

        // Play Win/Lose Sound Chimes
        if (isP1) {
            Audio.playWin();
            this.logToTerminal(`SYSTEM DOMINATION: ${char.name} WINS!`, "yellow");
        } else {
            if (this.mode === "ai") {
                Audio.playLose();
                this.logToTerminal(`AI OVERLORD CRUSHED THE MEATBAG.`, "red");
            } else {
                Audio.playWin();
                this.logToTerminal(`P2 DOMINATION: ${char.name} WINS!`, "yellow");
            }
        }

        // Pop Modal overlay after the laser animation starts displaying (700ms delay)
        setTimeout(() => {
            this.showGameOverModal(isP1 ? "P1" : (this.mode === "ai" ? "AI" : "P2"));
        }, 800);
    }

    handleDraw() {
        this.gameOver = true;
        this.scores.draws++;

        Audio.playExplode();
        this.triggerScreenShake(10);
        this.logToTerminal(`DRAW CONSTRAINTS SATISFIED. GRID LOCKED.`, "yellow");

        setTimeout(() => {
            this.showGameOverModal("DRAW");
        }, 500);
    }

    showGameOverModal(winner) {
        const overlay = document.getElementById("game-over-overlay");
        const title = document.getElementById("victory-title");
        const desc = document.getElementById("victory-desc");
        const winAvatar = document.getElementById("winner-avatar");

        overlay.classList.add("active");

        if (winner === "DRAW") {
            title.textContent = "GRID STALEMATE";
            title.setAttribute("data-text", "GRID STALEMATE");
            title.className = "victory-glitch-text text-yellow";
            desc.textContent = "NO COMPUTATIONAL ADVANTAGE DETECTED. SIMULATION HALTED.";
            winAvatar.innerHTML = "";
            winAvatar.style.borderColor = "#999";
            winAvatar.style.backgroundColor = "#222";
        } else {
            const isP1 = winner === "P1";
            const char = isP1 ? CHARACTERS[this.p1CharId] : CHARACTERS[this.p2CharId];
            
            title.textContent = isP1 ? "P1 DOMINATION!" : (this.mode === "ai" ? "AI ASCENSION!" : "P2 DOMINATION!");
            title.setAttribute("data-text", title.textContent);
            title.className = "victory-glitch-text text-red";
            
            desc.textContent = isP1 
                ? `${char.name} OBLITERATED ALL HOSTILE COMBATANTS WITH ${char.weapon}!`
                : `${char.name} ESTABLISHED DIGITAL SUPREMACY USING ${char.weapon}!`;

            // Draw micro pixel avatar inside modal box
            winAvatar.innerHTML = "";
            winAvatar.style.borderColor = char.primaryColor;
            const modalCvs = document.createElement("canvas");
            modalCvs.width = 64; modalCvs.height = 64;
            modalCvs.style.imageRendering = "pixelated";
            winAvatar.appendChild(modalCvs);
            this.drawPortraitOnCanvas(modalCvs.getContext("2d"), char.id, 64);
        }
    }

    // --- AI BOT LOGIC SYSTEM ---
    triggerAIMove() {
        this.aiThinking = true;
        
        // Log "thinking" status line
        this.logToTerminal(`AI INFERENCING NEURAL ARRAYS...`, "yellow");

        // Insane difficulty gets witty/hostile typewriter warning taunts immediately!
        if (this.difficulty === "insane") {
            const taunts = [
                "CRITICAL ERROR: USER INTELLECT IS PATHETIC.",
                "DEPLOYING THERMONUCLEAR LOGIC BRIGADE.",
                "MY ALGORITHMS FORESEE 1,000,000 WAYS YOU FAIL.",
                "HA! A QUANTUM CROSS? HOW NOVICE!",
                "I HAVE CALCULATED EVERY ATOM OF YOUR EXISTENCE. YOU LOSE.",
                "ANALYZING HUMAN COGNITIVE CELL BIAS... DETECTING WEAKNESS.",
                "COULD YOU HURRY? MY RE-COOLING FANS ARE GETTING BORED.",
                "IS THAT YOUR TRUMP CARD? NEURAL NETWORKS LAUGH AT YOU."
            ];
            const randTaunt = taunts[Math.floor(Math.random() * taunts.length)];
            setTimeout(() => {
                this.logToTerminal(`AI_MAINFRAME: "${randTaunt}"`, "red");
            }, 300);
        }

        // Artificially delay bot processing to give vintage simulation feel
        const delay = this.difficulty === "insane" ? 700 : 500;
        setTimeout(() => {
            const botIdx = this.computeAIMove();
            this.aiThinking = false;
            if (botIdx !== null) {
                this.makeMove(botIdx);
            }
        }, delay);
    }

    computeAIMove() {
        const available = this.board.map((cell, idx) => cell === null ? idx : null).filter(val => val !== null);
        if (available.length === 0) return null;

        // EASY: Potato mode. Picks a random move 70% of the time, block moves 30% of the time.
        if (this.difficulty === "easy") {
            const immediateBlock = this.findImmediateWinningOrBlockingMove("X");
            if (immediateBlock !== null && Math.random() > 0.7) {
                return immediateBlock;
            }
            return available[Math.floor(Math.random() * available.length)];
        }

        // HARD: 90% smart moves. 10% mistakes to give user hope!
        if (this.difficulty === "hard") {
            if (Math.random() < 0.1) {
                return available[Math.floor(Math.random() * available.length)];
            }
            // Otherwise execute perfect minimax calculation
            return this.getBestMinimaxMove();
        }

        // INSANE: Flawless Minimax. Unbeatable. Plays to absolutely destroy.
        return this.getBestMinimaxMove();
    }

    findImmediateWinningOrBlockingMove(playerMark) {
        const combos = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        for (const c of combos) {
            const marks = [this.board[c[0]], this.board[c[1]], this.board[c[2]]];
            const countMark = marks.filter(m => m === playerMark).length;
            const countEmpty = marks.filter(m => m === null).length;
            if (countMark === 2 && countEmpty === 1) {
                // Return index of empty spot
                const emptyIdx = marks.indexOf(null);
                return c[emptyIdx];
            }
        }
        return null;
    }

    getBestMinimaxMove() {
        let bestScore = -Infinity;
        let move = null;

        for (let i = 0; i < 9; i++) {
            if (this.board[i] === null) {
                this.board[i] = "O";
                const score = this.minimax(this.board, 0, false);
                this.board[i] = null;
                if (score > bestScore) {
                    bestScore = score;
                    move = i;
                }
            }
        }
        return move;
    }

    minimax(board, depth, isMaximizing) {
        // Evaluate terminal state scores
        const winner = this.evaluateBoard();
        if (winner === "O") return 10 - depth;
        if (winner === "X") return depth - 10;
        if (board.every(cell => cell !== null)) return 0;

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === null) {
                    board[i] = "O";
                    const score = this.minimax(board, depth + 1, false);
                    board[i] = null;
                    bestScore = Math.max(bestScore, score);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === null) {
                    board[i] = "X";
                    const score = this.minimax(board, depth + 1, true);
                    board[i] = null;
                    bestScore = Math.min(bestScore, score);
                }
            }
            return bestScore;
        }
    }

    evaluateBoard() {
        const combos = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        for (const c of combos) {
            if (this.board[c[0]] && this.board[c[0]] === this.board[c[1]] && this.board[c[0]] === this.board[c[2]]) {
                return this.board[c[0]];
            }
        }
        return null;
    }
}

// --- INITIALIZATION ---
window.addEventListener("DOMContentLoaded", () => {
    const Game = new GameEngine();
    Game.init();
});
