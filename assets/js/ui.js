// Audio Synthesizer (pure JS Web Audio API, no external files)
const SoundEffects = {
    ctx: null,
    muted: localStorage.getItem("memrush_muted") === "true",

    init() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) this.ctx = new AudioCtx();
        }
        if (this.ctx && this.ctx.state === "suspended") {
            this.ctx.resume();
        }
    },

    toggleMute() {
        this.muted = !this.muted;
        localStorage.setItem("memrush_muted", this.muted);
        this.updateIcons();
        return this.muted;
    },

    updateIcons() {
        const soundIcon = document.querySelector("#sound-icon");
        if (soundIcon) {
            soundIcon.className = this.muted ? "fa-solid fa-volume-xmark" : "fa-solid fa-volume-high";
        }
        const menuSoundIcon = document.querySelector("#menu-sound-icon");
        const menuSoundText = document.querySelector("#menu-sound-text");
        if (menuSoundIcon) {
            menuSoundIcon.className = this.muted ? "fa-solid fa-volume-xmark" : "fa-solid fa-volume-high";
        }
        if (menuSoundText) {
            menuSoundText.textContent = this.muted ? "Sound: OFF" : "Sound: ON";
        }
    },

    playFlip() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = "sine";
            osc.frequency.setValueAtTime(360, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(740, this.ctx.currentTime + 0.07);
            gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.07);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + 0.07);
        } catch (e) {
            // Audio policy fallback
        }
    },

    playMatch() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            [523.25, 659.25, 783.99].forEach((freq, idx) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = "triangle";
                osc.frequency.setValueAtTime(freq, now + idx * 0.07);
                gain.gain.setValueAtTime(0.12, now + idx * 0.07);
                gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.22);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(now + idx * 0.07);
                osc.stop(now + idx * 0.07 + 0.22);
            });
        } catch (e) {}
    },

    playMismatch() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            [260, 210].forEach((freq, idx) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = "sine";
                osc.frequency.setValueAtTime(freq, now + idx * 0.09);
                gain.gain.setValueAtTime(0.07, now + idx * 0.09);
                gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.15);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(now + idx * 0.09);
                osc.stop(now + idx * 0.09 + 0.15);
            });
        } catch (e) {}
    },

    playWin() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = "triangle";
                osc.frequency.setValueAtTime(freq, now + idx * 0.12);
                gain.gain.setValueAtTime(0.15, now + idx * 0.12);
                gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.4);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(now + idx * 0.12);
                osc.stop(now + idx * 0.12 + 0.4);
            });
        } catch (e) {}
    }
};

// Confetti Celebration
const Confetti = {
    canvas: null,
    ctx: null,
    particles: [],
    animationId: null,

    init() {
        this.canvas = document.querySelector("#confetti-canvas");
        if (this.canvas) {
            this.ctx = this.canvas.getContext("2d");
            this.resize();
            window.addEventListener("resize", () => this.resize());
        }
    },

    resize() {
        if (!this.canvas) return;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    },

    launch() {
        this.init();
        if (!this.canvas || !this.ctx) return;
        this.canvas.style.display = "block";
        this.particles = [];
        const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6", "#06b6d4"];

        for (let i = 0; i < 90; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height - this.canvas.height * 0.5,
                w: Math.random() * 8 + 4,
                h: Math.random() * 6 + 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                vx: (Math.random() - 0.5) * 4,
                vy: Math.random() * 3 + 3,
                rotation: Math.random() * 360,
                vRot: (Math.random() - 0.5) * 8,
                opacity: 1
            });
        }

        const animate = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            let active = false;

            this.particles.forEach((p) => {
                p.x += p.vx;
                p.y += p.vy;
                p.rotation += p.vRot;
                if (p.y > this.canvas.height * 0.75) {
                    p.opacity -= 0.015;
                }

                if (p.opacity > 0 && p.y < this.canvas.height) {
                    active = true;
                    this.ctx.save();
                    this.ctx.translate(p.x, p.y);
                    this.ctx.rotate((p.rotation * Math.PI) / 180);
                    this.ctx.globalAlpha = Math.max(0, p.opacity);
                    this.ctx.fillStyle = p.color;
                    this.ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
                    this.ctx.restore();
                }
            });

            if (active) {
                this.animationId = requestAnimationFrame(animate);
            } else {
                this.canvas.style.display = "none";
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            }
        };

        if (this.animationId) cancelAnimationFrame(this.animationId);
        animate();
    }
};

function CREATE_DIALOG(content) {
    MODALBG.style.display = "flex";
    MODALBG.animate({
        opacity: ["0", "1"]
    }, {
        duration: 240,
        fill: "forwards"
    });
    MODAL.innerHTML = content;
    SoundEffects.updateIcons();

    // Backdrop click listener to close menu or about
    MODALBG.onclick = function(e) {
        if (e.target === MODALBG) {
            const hasPauseMenu = MODAL.querySelector(".pause-menu-modal");
            const hasAbout = MODAL.querySelector(".about-modal");
            if (hasPauseMenu || hasAbout) {
                REMOVE_DIALOG();
            }
        }
    };
}

function REMOVE_DIALOG() {
    const animation = MODALBG.animate({
        opacity: ["1", "0"]
    }, {
        duration: 200,
        fill: "forwards"
    });
    animation.onfinish = function() {
        MODALBG.style.display = "none";
    };
}

function TOGGLE_SOUND() {
    SoundEffects.toggleMute();
}

function TOGGLE_SOUND_AND_REFRESH_MENU() {
    SoundEffects.toggleMute();
    SoundEffects.updateIcons();
}

// Global exposure
window.CREATE_DIALOG = CREATE_DIALOG;
window.REMOVE_DIALOG = REMOVE_DIALOG;
window.TOGGLE_SOUND = TOGGLE_SOUND;
window.TOGGLE_SOUND_AND_REFRESH_MENU = TOGGLE_SOUND_AND_REFRESH_MENU;
window.SoundEffects = SoundEffects;
window.Confetti = Confetti;

document.addEventListener("DOMContentLoaded", () => {
    SoundEffects.updateIcons();
});
