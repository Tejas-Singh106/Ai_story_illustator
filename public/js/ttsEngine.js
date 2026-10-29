// Text-To-Speech Narration & Procedural Ambient Audio Engine
class TTSEngine {
  constructor() {
    this.synth = window.speechSynthesis;
    this.voices = [];
    this.currentUtterance = null;
    this.isPlaying = false;
    this.isPaused = false;
    this.selectedVoice = null;
    this.rate = 1.0;
    this.pitch = 1.0;
    this.onHighlightCallback = null;
    this.onEndCallback = null;

    // Web Audio API ambient generator
    this.audioCtx = null;
    this.ambientNodes = [];
    this.currentAmbience = 'none';

    this.initVoices();
  }

  initVoices() {
    if (!this.synth) return;
    const populate = () => {
      this.voices = this.synth.getVoices().filter(v => v.lang.startsWith('en'));
      // Prefer natural or neural sounding English voices
      this.selectedVoice = this.voices.find(v => 
        v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel')
      ) || this.voices[0] || null;
    };
    populate();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = populate;
    }
  }

  getVoices() {
    return this.voices;
  }

  setVoice(voiceName) {
    const found = this.voices.find(v => v.name === voiceName);
    if (found) this.selectedVoice = found;
  }

  setRate(val) {
    this.rate = parseFloat(val) || 1.0;
  }

  setPitch(val) {
    this.pitch = parseFloat(val) || 1.0;
  }

  speak(text, onHighlight, onEnd) {
    if (!this.synth) return;
    this.stop();

    if (!text || !text.trim()) return;

    this.onHighlightCallback = onHighlight;
    this.onEndCallback = onEnd;

    this.currentUtterance = new SpeechSynthesisUtterance(text);
    if (this.selectedVoice) {
      this.currentUtterance.voice = this.selectedVoice;
    }
    this.currentUtterance.rate = this.rate;
    this.currentUtterance.pitch = this.pitch;

    // Word boundary highlighting
    this.currentUtterance.onboundary = (event) => {
      if (event.name === 'word' && this.onHighlightCallback) {
        this.onHighlightCallback(event.charIndex, event.charLength || 6);
      }
    };

    this.currentUtterance.onend = () => {
      this.isPlaying = false;
      this.isPaused = false;
      if (this.onEndCallback) this.onEndCallback();
    };

    this.currentUtterance.onerror = (err) => {
      console.warn('SpeechSynthesis error:', err);
      this.isPlaying = false;
      this.isPaused = false;
      if (this.onEndCallback) this.onEndCallback();
    };

    this.synth.speak(this.currentUtterance);
    this.isPlaying = true;
    this.isPaused = false;
  }

  pause() {
    if (this.synth && this.isPlaying && !this.isPaused) {
      this.synth.pause();
      this.isPaused = true;
    }
  }

  resume() {
    if (this.synth && this.isPlaying && this.isPaused) {
      this.synth.resume();
      this.isPaused = false;
    }
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
    }
    this.isPlaying = false;
    this.isPaused = false;
  }

  // --- Procedural Ambient Audio Generator (Web Audio API) ---
  initAudioContext() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  stopAmbience() {
    this.ambientNodes.forEach(node => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch (e) {}
    });
    this.ambientNodes = [];
    this.currentAmbience = 'none';
  }

  setAmbience(type) {
    if (type === this.currentAmbience) return;
    this.stopAmbience();
    if (type === 'none') return;

    this.initAudioContext();
    this.currentAmbience = type;

    try {
      const masterGain = this.audioCtx.createGain();
      masterGain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
      masterGain.connect(this.audioCtx.destination);
      this.ambientNodes.push(masterGain);

      if (type === 'forest') {
        // Soft wind + gentle chime oscillators
        const osc1 = this.audioCtx.createOscillator();
        const osc2 = this.audioCtx.createOscillator();
        osc1.type = 'sine';
        osc2.type = 'triangle';
        osc1.frequency.setValueAtTime(432, this.audioCtx.currentTime);
        osc2.frequency.setValueAtTime(528, this.audioCtx.currentTime);

        const filter = this.audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(600, this.audioCtx.currentTime);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(masterGain);

        osc1.start();
        osc2.start();
        this.ambientNodes.push(osc1, osc2, filter);

      } else if (type === 'rain') {
        // Procedural gentle pink-like noise filter
        const bufferSize = this.audioCtx.sampleRate * 2;
        const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99 * b0 + white * 0.05;
          b1 = 0.95 * b1 + white * 0.1;
          b2 = 0.85 * b2 + white * 0.2;
          output[i] = (b0 + b1 + b2) * 0.15;
        }
        const whiteNoise = this.audioCtx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const rainFilter = this.audioCtx.createBiquadFilter();
        rainFilter.type = 'lowpass';
        rainFilter.frequency.setValueAtTime(800, this.audioCtx.currentTime);

        whiteNoise.connect(rainFilter);
        rainFilter.connect(masterGain);
        whiteNoise.start();
        this.ambientNodes.push(whiteNoise, rainFilter);

      } else if (type === 'space') {
        // Deep cosmic resonant chord
        const freqs = [108, 162, 216];
        freqs.forEach(f => {
          const osc = this.audioCtx.createOscillator();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, this.audioCtx.currentTime);
          osc.connect(masterGain);
          osc.start();
          this.ambientNodes.push(osc);
        });
      }
    } catch (e) {
      console.warn('Ambient audio error:', e);
    }
  }
}

window.ttsEngine = new TTSEngine();
