/**
 * Generates game sound effects as WAV files using pure Node.js
 * No external dependencies needed
 */
const fs = require("fs");
const path = require("path");

const SAMPLE_RATE = 44100;
const outDir = path.resolve(__dirname, "..", "assets", "sounds");

// ─── WAV Writer ──────────────────────────────────────────────────────────────

function writeWav(filename, samples, sampleRate = SAMPLE_RATE) {
  const numSamples = samples.length;
  const byteRate = sampleRate * 2; // 16-bit mono
  const blockAlign = 2;
  const dataSize = numSamples * 2;
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF header
  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write("WAVE", 8);

  // fmt chunk
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16); // chunk size
  buffer.writeUInt16LE(1, 20); // PCM
  buffer.writeUInt16LE(1, 22); // mono
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 30);
  buffer.writeUInt16LE(16, 32); // bits per sample

  // data chunk
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataSize, 40);

  for (let i = 0; i < numSamples; i++) {
    const val = Math.max(-1, Math.min(1, samples[i]));
    buffer.writeInt16LE(Math.round(val * 32767), 44 + i * 2);
  }

  const filePath = path.join(outDir, filename);
  fs.writeFileSync(filePath, buffer);
  console.log(`  ✓ ${filename} (${(buffer.length / 1024).toFixed(1)} KB)`);
}

// ─── Synth Helpers ───────────────────────────────────────────────────────────

function sine(freq, t) {
  return Math.sin(2 * Math.PI * freq * t);
}

function envelope(t, attack, decay, sustain, release, duration) {
  if (t < attack) return t / attack;
  if (t < attack + decay) return 1 - (1 - sustain) * ((t - attack) / decay);
  if (t < duration - release) return sustain;
  if (t < duration) return sustain * (1 - (t - (duration - release)) / release);
  return 0;
}

function fadeIn(t, dur) {
  return Math.min(1, t / dur);
}

function fadeOut(t, total, dur) {
  return Math.min(1, (total - t) / dur);
}

// ─── Sound Generators ────────────────────────────────────────────────────────

function generateCorrectDing() {
  // Pleasant two-tone ascending ding
  const duration = 0.35;
  const numSamples = Math.floor(SAMPLE_RATE * duration);
  const samples = new Float64Array(numSamples);

  for (let i = 0; i < numSamples; i++) {
    const t = i / SAMPLE_RATE;
    const env = envelope(t, 0.005, 0.08, 0.3, 0.15, duration);

    // Two harmonious tones (C6 + E6)
    const s = sine(1047, t) * 0.5 + sine(1319, t) * 0.35 + sine(2094, t) * 0.15;
    samples[i] = s * env * 0.7;
  }

  writeWav("correct.wav", samples);
}

function generateStreakSound() {
  // Exciting ascending arpeggio - celebration feel
  const duration = 0.6;
  const numSamples = Math.floor(SAMPLE_RATE * duration);
  const samples = new Float64Array(numSamples);

  const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
  const noteLen = duration / notes.length;

  for (let i = 0; i < numSamples; i++) {
    const t = i / SAMPLE_RATE;
    const noteIdx = Math.min(Math.floor(t / noteLen), notes.length - 1);
    const noteT = t - noteIdx * noteLen;
    const freq = notes[noteIdx];

    const env = envelope(noteT, 0.01, 0.05, 0.6, 0.08, noteLen);
    const globalFade = fadeOut(t, duration, 0.1);

    const s = sine(freq, t) * 0.4 + sine(freq * 2, t) * 0.2 + sine(freq * 0.5, t) * 0.15;
    samples[i] = s * env * globalFade * 0.75;
  }

  writeWav("streak.wav", samples);
}

function generateGameOver() {
  // Descending sad tone with reverb-like decay
  const duration = 1.2;
  const numSamples = Math.floor(SAMPLE_RATE * duration);
  const samples = new Float64Array(numSamples);

  for (let i = 0; i < numSamples; i++) {
    const t = i / SAMPLE_RATE;

    // Descending pitch from E4 to C4
    const freq = 330 - (330 - 262) * Math.min(t / 0.4, 1);
    const env = envelope(t, 0.01, 0.3, 0.25, 0.6, duration);

    // Slightly dissonant for "sad" feel
    const s =
      sine(freq, t) * 0.4 +
      sine(freq * 1.5, t) * 0.15 +
      sine(freq * 0.5, t) * 0.3 +
      sine(freq * 0.99, t) * 0.1; // slight detune for thickness

    samples[i] = s * env * 0.65;
  }

  writeWav("gameover.wav", samples);
}

function generateBgmLoop() {
  // Minimal ambient loop - gentle pulsing pad (4 seconds, designed to loop)
  const duration = 4.0;
  const numSamples = Math.floor(SAMPLE_RATE * duration);
  const samples = new Float64Array(numSamples);

  // Chord: Cmaj7 (C4, E4, G4, B4) as soft pad
  const freqs = [262, 330, 392, 494];

  for (let i = 0; i < numSamples; i++) {
    const t = i / SAMPLE_RATE;

    // Gentle volume pulse (breathing effect)
    const pulse = 0.5 + 0.5 * sine(0.5, t); // 0.5 Hz breathing
    const fIn = fadeIn(t, 0.3);
    const fOut = fadeOut(t, duration, 0.3);

    let s = 0;
    for (const freq of freqs) {
      // Soft sine with slight detuning for warmth
      s += sine(freq, t) * 0.15;
      s += sine(freq * 1.002, t) * 0.08; // detune for chorus
    }

    // Add a subtle sub bass
    s += sine(131, t) * 0.1;

    samples[i] = s * pulse * fIn * fOut * 0.5;
  }

  writeWav("bgm-loop.wav", samples);
}

function generateTick() {
  // Very short subtle tick for timer/waiting
  const duration = 0.08;
  const numSamples = Math.floor(SAMPLE_RATE * duration);
  const samples = new Float64Array(numSamples);

  for (let i = 0; i < numSamples; i++) {
    const t = i / SAMPLE_RATE;
    const env = Math.exp(-t * 60); // fast decay
    samples[i] = sine(1800, t) * env * 0.3;
  }

  writeWav("tick.wav", samples);
}

// ─── Main ────────────────────────────────────────────────────────────────────

console.log("Generating game sounds...\n");
generateCorrectDing();
generateStreakSound();
generateGameOver();
generateBgmLoop();
generateTick();
console.log("\nDone! Files saved to assets/sounds/");
