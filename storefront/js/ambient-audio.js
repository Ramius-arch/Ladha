/**
 * LADHA — Boutique Ambient Playlist Engine
 * 
 * Tracks:
 * 01. Edwardo Atlas - Wild World (LADHA Boutique Ambient Edit)
 * 02. TWOPILOTS, Natty Rico - Where Is My Mind (LADHA Boutique Ambient Edit)
 * 
 * Features:
 * - Starts WITH music playing when the site is opened
 * - Archival Preloader & Sound Entry Gate (ciangoon.dev inspired) guaranteeing browser audio authorization
 * - Multi-Track Curated Playlist (Sequentially auto-advances with smooth crossfades)
 * - Silk-Smooth Volume Ramping (2.0s ease fade-in, 0.85s fade-out, 24% volume ceiling)
 * - Real-Time Header Track Controller ([01/02 : EDWARDO ATLAS ⏭] — click to skip anytime)
 * - Synchronized Dual UI: Header navigation controller + floating bottom dock
 */

class LadhaAmbientPlaylistEngine {
    constructor() {
        this.targetGain = 0.24; // Velvet ambient ceiling (24%)
        this.isPlaying = false;
        this.isFading = false;
        this.fadeInterval = null;
        this._unlockHandler = null;
        this._onPlaySuccess = null;

        // Multi-Track Curated Playlist
        this.currentTrackIndex = 0;
        this.playlist = [
            {
                id: 'track-1',
                title: 'Edwardo Atlas - Wild World',
                shortTitle: 'Edwardo Atlas',
                artist: 'LADHA Boutique Ambient Edit',
                src: 'assets/audio/ladha-ambient.mp3'
            },
            {
                id: 'track-2',
                title: 'TWOPILOTS, Natty Rico - Where Is My Mind',
                shortTitle: 'TWOPILOTS - Where Is My Mind',
                artist: 'LADHA Boutique Ambient Edit',
                src: 'assets/audio/ladha-ambient-02.mp3'
            }
        ];

        // Clear any old mute state so site always opens in sound-ready mode
        try {
            localStorage.removeItem('ladha_sound_muted');
        } catch (e) {}

        this.init();
    }

    init() {
        this.audio = new Audio();
        this.audio.preload = 'auto';
        this.audio.loop = false;
        this.audio.volume = 0.001;

        this.loadTrack(this.currentTrackIndex);

        this.audio.addEventListener('timeupdate', () => this.handleTrackCrossfade());
        this.audio.addEventListener('ended', () => this.nextTrack(true));

        this.audio.addEventListener('error', (e) => {
            console.warn('[Ladha Audio] Track error, cycling to next track:', e);
            this.nextTrack(true);
        });

        this.bindEvents();
        this.setupArchivalCurtain();

        // Attempt direct autoplay immediately on open
        this.attemptAutoStart();
    }

    setupArchivalCurtain() {
        const curtain = document.getElementById('archival-curtain');
        if (!curtain) return;

        // Fast kinetic preloader counter (0% -> 100%) like ciangoon.dev
        const numEl = document.getElementById('curtain-progress-num');
        let count = 0;
        const progressTimer = setInterval(() => {
            count += Math.floor(Math.random() * 22) + 15;
            if (count >= 100) {
                count = 100;
                clearInterval(progressTimer);
            }
            if (numEl) numEl.textContent = count + '%';
        }, 30);

        // Nairobi EAT live clock on curtain
        const clockEl = curtain.querySelector('.curtain-clock');
        const updateClock = () => {
            if (!clockEl) return;
            const now = new Date();
            const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
            const eat = new Date(utc + (3600000 * 3));
            const pad = (n) => String(n).padStart(2, '0');
            clockEl.textContent = `NAIROBI ${pad(eat.getHours())}:${pad(eat.getMinutes())}:${pad(eat.getSeconds())} EAT`;
        };
        updateClock();
        setInterval(updateClock, 1000);

        const dismiss = () => {
            if (curtain.classList.contains('dismissed')) return;
            curtain.classList.add('dismissed');
            setTimeout(() => {
                try { curtain.remove(); } catch (e) {}
            }, 750);
        };

        const enterAndPlay = (e) => {
            e.preventDefault();
            this.play();
            dismiss();
        };

        curtain.addEventListener('click', enterAndPlay);
        const enterBtn = document.getElementById('curtain-enter-btn');
        if (enterBtn) {
            enterBtn.addEventListener('click', enterAndPlay);
        }

        // If direct autoplay succeeded without user interaction, dismiss automatically
        this._onPlaySuccess = () => {
            setTimeout(dismiss, 450);
        };
    }

    loadTrack(index) {
        if (index < 0 || index >= this.playlist.length) {
            index = 0;
        }
        this.currentTrackIndex = index;
        const track = this.playlist[this.currentTrackIndex];
        this.audio.src = track.src;
        this.updateUI(this.isPlaying);
    }

    getCurrentTrack() {
        return this.playlist[this.currentTrackIndex] || this.playlist[0];
    }

    fadeVolume(fromVol, toVol, durationMs, onComplete) {
        if (this.fadeInterval) {
            clearInterval(this.fadeInterval);
            this.fadeInterval = null;
        }

        const startTime = performance.now();
        this.audio.volume = Math.min(Math.max(fromVol, 0), 1);
        this.isFading = true;

        this.fadeInterval = setInterval(() => {
            const elapsed = performance.now() - startTime;
            const progress = Math.min(elapsed / durationMs, 1);
            // Smooth ease-in-out curve
            const eased = progress < 0.5 
                ? 2 * progress * progress 
                : -1 + (4 - 2 * progress) * progress;

            const current = fromVol + (toVol - fromVol) * eased;
            this.audio.volume = Math.min(Math.max(current, 0), 1);

            if (progress >= 1) {
                clearInterval(this.fadeInterval);
                this.fadeInterval = null;
                this.isFading = false;
                if (onComplete) onComplete();
            }
        }, 30);
    }

    attemptAutoStart() {
        // Try direct playback immediately on page open
        this.play();

        // In case browser autoplay policy requires user gesture, arm persistent activation listeners
        this.attachUnlockListeners();
    }

    attachUnlockListeners() {
        if (this._unlockHandler) return;

        this._unlockHandler = () => {
            if (!this.isPlaying) {
                this.play();
            }
        };

        const events = ['pointerdown', 'mousedown', 'keydown', 'touchstart', 'click'];
        events.forEach(evt => {
            window.addEventListener(evt, this._unlockHandler, { passive: true });
        });
    }

    removeUnlockListeners() {
        if (!this._unlockHandler) return;
        const events = ['pointerdown', 'mousedown', 'keydown', 'touchstart', 'click'];
        events.forEach(evt => {
            window.removeEventListener(evt, this._unlockHandler);
        });
        this._unlockHandler = null;
    }

    play() {
        if (this.isPlaying && !this.isFading) return;

        this.audio.volume = Math.max(this.audio.volume, 0.001);
        const playPromise = this.audio.play();

        if (playPromise !== undefined) {
            playPromise.then(() => {
                this.isPlaying = true;
                this.isFading = false;
                this.fadeVolume(this.audio.volume, this.targetGain, 2000);
                this.updateUI(true);

                // Successfully playing — remove unlock listeners & trigger curtain dismissal
                this.removeUnlockListeners();
                if (this._onPlaySuccess) this._onPlaySuccess();
            }).catch((err) => {
                // Browser prevented unmuted autoplay without prior gesture; curtain will catch user's click
                console.log('[Ladha Audio] Autoplay awaiting user interaction:', err);
                this.updateUI(false);
            });
        }
    }

    pause() {
        if (!this.isPlaying) return;

        this.fadeVolume(this.audio.volume, 0.0, 850, () => {
            this.audio.pause();
            this.isPlaying = false;
            this.updateUI(false);
        });
    }

    toggle() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    nextTrack(forcePlay = true) {
        const nextIndex = (this.currentTrackIndex + 1) % this.playlist.length;
        const shouldPlay = forcePlay || this.isPlaying;

        if (this.isPlaying) {
            this.fadeVolume(this.audio.volume, 0.01, 400, () => {
                this.loadTrack(nextIndex);
                if (shouldPlay) this.play();
            });
        } else {
            this.loadTrack(nextIndex);
            if (shouldPlay) this.play();
        }
    }

    handleTrackCrossfade() {
        if (!this.isPlaying || !this.audio.duration) return;
        const timeLeft = this.audio.duration - this.audio.currentTime;

        // When 3s remain on current track, gently crossfade into next track
        if (timeLeft <= 3.0 && timeLeft > 0.4 && !this.isFading) {
            this.fadeVolume(this.audio.volume, 0.02, timeLeft * 1000);
        }
    }

    updateUI(active) {
        const track = this.getCurrentTrack();
        const trackNumber = String(this.currentTrackIndex + 1).padStart(2, '0');
        const totalTracks = String(this.playlist.length).padStart(2, '0');
        const shortName = track.shortTitle || track.title;

        // Update Header Sound Button
        const btns = document.querySelectorAll('.ambient-sound-btn');
        btns.forEach(btn => {
            btn.classList.toggle('playing', active);
            btn.setAttribute('aria-pressed', active ? 'true' : 'false');
            const label = btn.querySelector('.sound-btn-label');
            if (label) {
                label.textContent = active ? 'SOUND [ON]' : 'SOUND [OFF]';
            }
            btn.title = active 
                ? `Ambient Sound: Playing "${track.title}" [Click to Pause]` 
                : `Ambient Sound: Off [Click to Play Boutique Ambient Playlist]`;
        });

        // Update Header Track Indicator Pill
        const pill = document.getElementById('ambient-track-pill');
        if (pill) {
            pill.title = `Current: [${trackNumber}/${totalTracks}] "${track.title}" — Click to Skip to Next Track`;
            const badge = pill.querySelector('.track-number-badge');
            if (badge) badge.textContent = `${trackNumber}/${totalTracks}`;
            const ticker = pill.querySelector('.track-name-ticker');
            if (ticker) ticker.textContent = shortName;
        }

        // Update Floating Dock Sound Button
        const dockSound = document.getElementById('dock-sound-btn');
        if (dockSound) {
            dockSound.classList.toggle('playing', active);
            dockSound.setAttribute('aria-pressed', active ? 'true' : 'false');
            const dockSoundLabel = document.getElementById('dock-sound-label');
            if (dockSoundLabel) {
                dockSoundLabel.textContent = active ? 'SOUND ON' : 'SOUND OFF';
            }
            dockSound.title = active 
                ? `Ambient [${trackNumber}/${totalTracks}]: "${track.title}"` 
                : 'Ambient Sound: Off';
        }
    }

    bindEvents() {
        let clickTimeout = null;

        document.addEventListener('click', (e) => {
            // Ignore clicks on entry curtain (handled by setupArchivalCurtain)
            if (e.target.closest('#archival-curtain')) return;

            // Click on track indicator pill or skip button -> immediately switch and play next track
            const skipBtn = e.target.closest('#ambient-track-pill') || e.target.closest('.ambient-skip-btn');
            if (skipBtn) {
                e.preventDefault();
                this.nextTrack(true);
                return;
            }

            // Click on sound toggle button
            const btn = e.target.closest('.ambient-sound-btn') || e.target.closest('#dock-sound-btn');
            if (!btn) return;
            e.preventDefault();

            if (clickTimeout) {
                // Double-click skips to next track
                clearTimeout(clickTimeout);
                clickTimeout = null;
                this.nextTrack(true);
            } else {
                // Single-click toggles play/pause
                clickTimeout = setTimeout(() => {
                    clickTimeout = null;
                    this.toggle();
                }, 250);
            }
        });
    }
}

// Instantiate engine as soon as script runs or DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.ladhaAudio = new LadhaAmbientPlaylistEngine();
    });
} else {
    window.ladhaAudio = new LadhaAmbientPlaylistEngine();
}
