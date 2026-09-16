/**
 * LADHA — Ambient Audio Engineering Engine
 * Track: Edwardo Atlas - Wild World (LADHA Ambient Boutique Edit)
 * 
 * Features:
 * - Starts while ON by default (swells in via Web Audio API, unlocks on first interaction)
 * - Web Audio API DSP Filter: Gentle Biquad Lowpass (~3200Hz, Q=0.7) for velvety boutique warmth
 * - Smooth 2.5s Exponential Gain Fade-In
 * - Smooth 1.2s Linear Gain Fade-Out on pause
 * - Seamless End-of-Track Boundary Crossfade Looping
 * - Kinetic Equalizer Animation & State Synchronization across Header and Dock
 */

class LadhaAmbientAudioEngine {
    constructor() {
        this.audioSrc = 'assets/audio/ladha-ambient.mp3';
        this.targetGain = 0.24; // Subtle, elegant ambient level (24% ceiling)
        this.isPlaying = false;
        this.isFading = false;
        this.audio = null;
        this.audioCtx = null;
        this.sourceNode = null;
        this.gainNode = null;
        this.filterNode = null;
        this.fadeTimeout = null;

        this.init();
    }

    init() {
        this.audio = new Audio();
        this.audio.src = this.audioSrc;
        this.audio.preload = 'auto';
        this.audio.loop = false;

        this.audio.addEventListener('timeupdate', () => this.handleLoopCrossfade());
        this.audio.addEventListener('ended', () => this.restartLoop());

        this.bindEvents();

        // Starts while ON
        this.attemptAutoStart();
    }

    setupWebAudioContext() {
        if (this.audioCtx) {
            if (this.audioCtx.state === 'suspended') {
                this.audioCtx.resume();
            }
            return;
        }

        try {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            this.audioCtx = new AudioContextClass();

            this.sourceNode = this.audioCtx.createMediaElementSource(this.audio);

            this.filterNode = this.audioCtx.createBiquadFilter();
            this.filterNode.type = 'lowpass';
            this.filterNode.frequency.setValueAtTime(3200, this.audioCtx.currentTime);
            this.filterNode.Q.setValueAtTime(0.7, this.audioCtx.currentTime);

            this.gainNode = this.audioCtx.createGain();
            this.gainNode.gain.setValueAtTime(0.0001, this.audioCtx.currentTime);

            this.sourceNode.connect(this.filterNode);
            this.filterNode.connect(this.gainNode);
            this.gainNode.connect(this.audioCtx.destination);
        } catch (e) {
            console.warn('[Ladha Audio] Web Audio API fallback:', e);
        }
    }

    attemptAutoStart() {
        const isMuted = localStorage.getItem('ladha_sound_muted') === 'true';
        if (isMuted) {
            this.updateUI(false);
            return;
        }

        // Show ON state in UI immediately
        this.updateUI(true);

        const tryStart = () => {
            this.play();
            ['click', 'scroll', 'pointerdown', 'keydown', 'touchstart'].forEach(evt => {
                window.removeEventListener(evt, tryStart);
            });
        };

        // Try direct playback
        const p = this.audio.play();
        if (p !== undefined) {
            p.then(() => {
                this.setupWebAudioContext();
                this.isPlaying = true;
                this.updateUI(true);
                if (this.gainNode && this.audioCtx) {
                    const now = this.audioCtx.currentTime;
                    this.gainNode.gain.cancelScheduledValues(now);
                    this.gainNode.gain.setValueAtTime(0.001, now);
                    this.gainNode.gain.exponentialRampToValueAtTime(this.targetGain, now + 2.5);
                }
            }).catch(() => {
                // Browser requires user gesture — seamlessly trigger on first interaction
                ['click', 'scroll', 'pointerdown', 'keydown', 'touchstart'].forEach(evt => {
                    window.addEventListener(evt, tryStart, { once: true, passive: true });
                });
            });
        }
    }

    play() {
        if (this.isPlaying && !this.isFading) return;

        this.setupWebAudioContext();
        clearTimeout(this.fadeTimeout);

        const startPlayback = () => {
            const playPromise = this.audio.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    this.isPlaying = true;
                    this.isFading = false;
                    localStorage.setItem('ladha_sound_muted', 'false');
                    this.updateUI(true);

                    if (this.gainNode && this.audioCtx) {
                        const now = this.audioCtx.currentTime;
                        this.gainNode.gain.cancelScheduledValues(now);
                        this.gainNode.gain.setValueAtTime(Math.max(this.gainNode.gain.value, 0.001), now);
                        this.gainNode.gain.exponentialRampToValueAtTime(this.targetGain, now + 2.5);
                    } else {
                        this.fallbackFade(0, this.targetGain, 2500);
                    }
                }).catch(() => {
                    this.isPlaying = false;
                    this.updateUI(false);
                });
            }
        };

        if (this.audioCtx && this.audioCtx.state === 'suspended') {
            this.audioCtx.resume().then(startPlayback);
        } else {
            startPlayback();
        }
    }

    pause() {
        if (!this.isPlaying) return;

        this.isFading = true;
        localStorage.setItem('ladha_sound_muted', 'true');
        this.updateUI(false);

        if (this.gainNode && this.audioCtx) {
            const now = this.audioCtx.currentTime;
            this.gainNode.gain.cancelScheduledValues(now);
            this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, now);
            this.gainNode.gain.linearRampToValueAtTime(0.0001, now + 1.2);

            this.fadeTimeout = setTimeout(() => {
                this.audio.pause();
                this.isPlaying = false;
                this.isFading = false;
            }, 1250);
        } else {
            this.fallbackFade(this.audio.volume, 0.0, 1200, () => {
                this.audio.pause();
                this.isPlaying = false;
                this.isFading = false;
            });
        }
    }

    toggle() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    handleLoopCrossfade() {
        if (!this.isPlaying || !this.audio.duration) return;
        const timeLeft = this.audio.duration - this.audio.currentTime;
        if (timeLeft <= 3.0 && timeLeft > 0.5 && !this.isFading) {
            if (this.gainNode && this.audioCtx) {
                const now = this.audioCtx.currentTime;
                this.gainNode.gain.cancelScheduledValues(now);
                this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, now);
                this.gainNode.gain.linearRampToValueAtTime(0.02, now + timeLeft);
            }
        }
    }

    restartLoop() {
        if (!this.isPlaying) return;
        this.audio.currentTime = 0;
        this.audio.play().then(() => {
            if (this.gainNode && this.audioCtx) {
                const now = this.audioCtx.currentTime;
                this.gainNode.gain.cancelScheduledValues(now);
                this.gainNode.gain.setValueAtTime(0.02, now);
                this.gainNode.gain.exponentialRampToValueAtTime(this.targetGain, now + 2.0);
            }
        }).catch(() => {});
    }

    fallbackFade(fromVol, toVol, durationMs, onComplete) {
        const steps = 30;
        const stepTime = durationMs / steps;
        let step = 0;
        const timer = setInterval(() => {
            step++;
            const cur = fromVol + (toVol - fromVol) * (step / steps);
            this.audio.volume = Math.min(Math.max(cur, 0), 1);
            if (step >= steps) {
                clearInterval(timer);
                if (onComplete) onComplete();
            }
        }, stepTime);
    }

    updateUI(active) {
        const btns = document.querySelectorAll('.ambient-sound-btn');
        btns.forEach(btn => {
            btn.classList.toggle('playing', active);
            btn.setAttribute('aria-pressed', active ? 'true' : 'false');
            const label = btn.querySelector('.sound-btn-label');
            if (label) {
                label.textContent = active ? 'SOUND [ON]' : 'SOUND [OFF]';
            }
            btn.title = active 
                ? 'Ambient Sound: Playing Edwardo Atlas - Wild World [Click to Pause]' 
                : 'Ambient Sound: Off [Click to Play Boutique Ambient Track]';
        });

        const dockSound = document.getElementById('dock-sound-btn');
        if (dockSound) {
            dockSound.classList.toggle('playing', active);
            dockSound.setAttribute('aria-pressed', active ? 'true' : 'false');
            const dockSoundLabel = document.getElementById('dock-sound-label');
            if (dockSoundLabel) {
                dockSoundLabel.textContent = active ? 'SOUND ON' : 'SOUND OFF';
            }
        }
    }

    bindEvents() {
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.ambient-sound-btn') || e.target.closest('#dock-sound-btn');
            if (btn) {
                e.preventDefault();
                this.toggle();
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.ladhaAudio = new LadhaAmbientAudioEngine();
});
