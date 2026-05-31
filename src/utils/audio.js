// Traditional Nepali Music & SFX Synthesizer using Web Audio API

class AudioManager {
    constructor() {
        this.ctx = null;
        this.musicEnabled = true;
        this.sfxEnabled = true;
        this.isPlaying = false;
        
        this.schedulerTimerId = null;
        this.nextNoteTime = 0.0;
        this.tempo = 100.0;
        this.lookahead = 25.0;
        this.scheduleAheadTime = 0.1;
        this.beatIndex = 0;

        this.scale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25];
        this.melody = [
            4, 4, 5, 4, 3, 2, 3, 2,
            0, 2, 3, 4, 2, 0, 1, 0,
            4, 5, 6, 5, 4, 3, 4, 3,
            2, 3, 4, 2, 0, 2, 0, 0
        ];
    }

    init() {
        if (this.ctx) return;
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContextClass();
    }

    startMusic() {
        this.init();
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
        if (!this.musicEnabled || this.isPlaying) return;
        this.isPlaying = true;
        this.nextNoteTime = this.ctx.currentTime;
        this.beatIndex = 0;
        this.scheduler();
    }

    stopMusic() {
        this.isPlaying = false;
        if (this.schedulerTimerId) {
            clearTimeout(this.schedulerTimerId);
        }
    }

    scheduler() {
        if (!this.isPlaying) return;
        while (this.nextNoteTime < this.ctx.currentTime + this.scheduleAheadTime) {
            this.scheduleBeat(this.beatIndex, this.nextNoteTime);
            this.advanceBeat();
        }
        this.schedulerTimerId = setTimeout(() => this.scheduler(), this.lookahead);
    }

    advanceBeat() {
        const secondsPerBeat = 60.0 / this.tempo / 2;
        this.nextNoteTime += secondsPerBeat;
        this.beatIndex = (this.beatIndex + 1) % 32;
    }

    scheduleBeat(beat, time) {
        if (beat % 4 === 0) {
            this.playMadalDhin(time);
        } else if (beat % 4 === 2) {
            this.playMadalTa(time);
        } else if (beat % 8 === 7) {
            this.playMadalTa(time);
        }

        if (beat % 2 === 0) {
            const noteIndex = this.melody[beat];
            if (noteIndex !== undefined && noteIndex >= 0) {
                const freq = this.scale[noteIndex % this.scale.length];
                this.playBansuriNote(freq, time, 60.0 / this.tempo * 0.45);
            }
        }
    }

    playMadalDhin(time) {
        if (!this.ctx || !this.musicEnabled) return;
        
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(120, time);
        osc.frequency.exponentialRampToValueAtTime(50, time + 0.15);

        gain.gain.setValueAtTime(0.1, time); // Quieter (was 0.3)
        gain.gain.linearRampToValueAtTime(0.002, time + 0.18);

        osc.start(time);
        osc.stop(time + 0.2);
    }

    playMadalTa(time) {
        if (!this.ctx || !this.musicEnabled) return;

        const bufferSize = this.ctx.sampleRate * 0.04;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 1000;
        filter.Q.value = 4.0;

        const gain = this.ctx.createGain();
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        gain.gain.setValueAtTime(0.06, time); // Quieter (was 0.18)
        gain.gain.linearRampToValueAtTime(0.002, time + 0.04);

        noise.start(time);
        noise.stop(time + 0.05);
    }

    playBansuriNote(freq, time, duration) {
        if (!this.ctx || !this.musicEnabled) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(freq * 1.5, time);
        
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        lfo.frequency.value = 6;
        lfoGain.gain.value = freq * 0.02;
        
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, time);

        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(0.05, time + 0.05); // Quieter (was 0.15)
        gain.gain.setValueAtTime(0.05, time + duration - 0.05);
        gain.gain.linearRampToValueAtTime(0, time + duration);

        lfo.start(time);
        osc.start(time);
        lfo.stop(time + duration);
        osc.stop(time + duration);
    }

    playSFX(type) {
        this.init();
        if (!this.sfxEnabled) return;
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }

        const now = this.ctx.currentTime;

        if (type === 'jump') {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.type = 'sine';
            osc.frequency.setValueAtTime(160, now);
            osc.frequency.exponentialRampToValueAtTime(650, now + 0.14);

            gain.gain.setValueAtTime(0.2, now);
            gain.gain.linearRampToValueAtTime(0.01, now + 0.14);

            osc.start(now);
            osc.stop(now + 0.15);
        } 
        else if (type === 'coin') {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.type = 'sine';
            osc.frequency.setValueAtTime(987.77, now);
            osc.frequency.setValueAtTime(1318.51, now + 0.08);

            gain.gain.setValueAtTime(0.15, now);
            gain.gain.linearRampToValueAtTime(0.01, now + 0.25);

            osc.start(now);
            osc.stop(now + 0.25);
        }
        else if (type === 'hurt') {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(180, now);
            osc.frequency.linearRampToValueAtTime(60, now + 0.2);

            gain.gain.setValueAtTime(0.25, now);
            gain.gain.linearRampToValueAtTime(0.01, now + 0.25);

            osc.start(now);
            osc.stop(now + 0.25);
        }
        else if (type === 'victory') {
            const notes = [261.63, 329.63, 392.00, 523.25];
            notes.forEach((freq, idx) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, now + idx * 0.08);
                gain.gain.setValueAtTime(0.18, now + idx * 0.08);
                gain.gain.linearRampToValueAtTime(0.01, now + idx * 0.08 + 0.25);

                osc.start(now + idx * 0.08);
                osc.stop(now + idx * 0.08 + 0.3);
            });
        }
        else if (type === 'attack') {
            const bufferSize = this.ctx.sampleRate * 0.08;
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }

            const noise = this.ctx.createBufferSource();
            noise.buffer = buffer;

            const filter = this.ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(1500, now);
            filter.frequency.exponentialRampToValueAtTime(400, now + 0.08);

            const gain = this.ctx.createGain();
            noise.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);

            gain.gain.setValueAtTime(0.2, now);
            gain.gain.linearRampToValueAtTime(0.01, now + 0.08);

            noise.start(now);
            noise.stop(now + 0.1);
        }
        else if (type === 'powerup') {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.type = 'sine';
            osc.frequency.setValueAtTime(440, now);
            osc.frequency.exponentialRampToValueAtTime(880, now + 0.3);

            gain.gain.setValueAtTime(0.2, now);
            gain.gain.linearRampToValueAtTime(0.01, now + 0.35);

            osc.start(now);
            osc.stop(now + 0.4);
        }
    }
}

export const audio = new AudioManager();
export default audio;
