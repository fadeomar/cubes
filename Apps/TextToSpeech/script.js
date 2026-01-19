"use strict";

const synth = window.speechSynthesis;
let utterance = null;

// Store last preview settings for download generation
let lastSpokenText = null;
let lastVoiceSettings = null;

// Last generated downloadable blob (mp3)
let downloadBlob = null;

// DOM
const textInput = document.getElementById("textInput");
const voiceSelect = document.getElementById("voiceSelect");
const reloadVoicesBtn = document.getElementById("reloadVoicesBtn");

const rateSlider = document.getElementById("rateSlider");
const pitchSlider = document.getElementById("pitchSlider");
const volumeSlider = document.getElementById("volumeSlider");

const rateValue = document.getElementById("rateValue");
const pitchValue = document.getElementById("pitchValue");
const volumeValue = document.getElementById("volumeValue");

const speakBtn = document.getElementById("speakBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resumeBtn = document.getElementById("resumeBtn");
const stopBtn = document.getElementById("stopBtn");
const downloadBtn = document.getElementById("downloadBtn");

const status = document.getElementById("status");

// -------------------------
// UI helpers
// -------------------------
function setStatus(message, type = "") {
  status.textContent = message;
  status.className = type ? `status ${type}` : "status";
}

function setUiState(state) {
  // "idle" | "speaking" | "paused"
  const isSpeaking = state === "speaking";
  const isPaused = state === "paused";

  speakBtn.disabled = isSpeaking;
  pauseBtn.disabled = !isSpeaking || isPaused;
  resumeBtn.disabled = !isPaused;
  stopBtn.disabled = !(isSpeaking || isPaused);

  // download enabled if we have last spoken text (we can generate on demand)
  downloadBtn.disabled = !lastSpokenText;
}

// -------------------------
// Voices
// -------------------------
function isEnglishVoice(v) {
  return typeof v.lang === "string" && v.lang.toLowerCase().startsWith("en");
}

function loadVoices() {
  const voices = synth.getVoices();

  // Sort: English first, then localService first, then by name
  const sorted = [...voices].sort((a, b) => {
    const aEn = isEnglishVoice(a) ? 1 : 0;
    const bEn = isEnglishVoice(b) ? 1 : 0;
    if (aEn !== bEn) return bEn - aEn;

    if (a.localService !== b.localService)
      return (b.localService ? 1 : 0) - (a.localService ? 1 : 0);
    if (a.lang !== b.lang) return a.lang.localeCompare(b.lang);
    return a.name.localeCompare(b.name);
  });

  voiceSelect.innerHTML = "";

  sorted.forEach((voice) => {
    const option = document.createElement("option");
    option.value = String(voices.indexOf(voice)); // preserve original index
    const tag = voice.default ? " • default" : "";
    const local = voice.localService ? "" : " • cloud";
    option.textContent = `${voice.name} (${voice.lang})${tag}${local}`;
    voiceSelect.appendChild(option);
  });

  // Select default voice, prefer English default if available
  if (voices.length > 0) {
    const defaultVoice =
      voices.find((v) => v.default && isEnglishVoice(v)) ||
      voices.find((v) => v.default) ||
      sorted.find(isEnglishVoice) ||
      sorted[0];

    voiceSelect.value = String(voices.indexOf(defaultVoice));
  }
}

// Most browsers fire this event async
if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = loadVoices;
}
loadVoices();

reloadVoicesBtn.addEventListener("click", () => {
  loadVoices();
  setStatus("Voices reloaded.", "success");
  setTimeout(() => setStatus(""), 1500);
});

// -------------------------
// Slider display
// -------------------------
rateSlider.addEventListener(
  "input",
  (e) => (rateValue.textContent = e.target.value),
);
pitchSlider.addEventListener(
  "input",
  (e) => (pitchValue.textContent = e.target.value),
);
volumeSlider.addEventListener(
  "input",
  (e) => (volumeValue.textContent = e.target.value),
);

// -------------------------
// Speech controls
// -------------------------
function speak() {
  const text = textInput.value.trim();
  if (!text) {
    setStatus("Please enter some text to speak.", "error");
    return;
  }

  // Cancel any ongoing speech
  synth.cancel();

  const voices = synth.getVoices();
  const selectedVoice = voices[Number(voiceSelect.value)] || voices[0];

  // Store for download
  lastSpokenText = text;
  lastVoiceSettings = {
    voice: selectedVoice,
    rate: parseFloat(rateSlider.value),
    pitch: parseFloat(pitchSlider.value),
    volume: parseFloat(volumeSlider.value),
  };

  // Clear old blob (we’ll regenerate on demand)
  downloadBlob = null;

  utterance = new SpeechSynthesisUtterance(text);
  utterance.voice = selectedVoice;
  utterance.rate = lastVoiceSettings.rate;
  utterance.pitch = lastVoiceSettings.pitch;
  utterance.volume = lastVoiceSettings.volume;

  utterance.onstart = () => {
    setUiState("speaking");
    setStatus("Speaking...", "speaking");
  };

  utterance.onend = () => {
    setUiState("idle");
    setStatus("Completed. You can download MP3 now.", "success");
  };

  utterance.onerror = (e) => {
    setUiState("idle");
    setStatus(`Error: ${e.error}`, "error");
  };

  synth.speak(utterance);
}

function pause() {
  if (synth.speaking && !synth.paused) {
    synth.pause();
    setUiState("paused");
    setStatus("Paused.", "paused");
  }
}

function resume() {
  if (synth.speaking && synth.paused) {
    synth.resume();
    setUiState("speaking");
    setStatus("Speaking...", "speaking");
  }
}

function stop() {
  synth.cancel();
  setUiState("idle");
  setStatus("Stopped.", "");
}

// -------------------------
// Download (Generate MP3 using online TTS endpoint)
// NOTE: This audio is NOT the same voice as speechSynthesis.
// -------------------------
async function generateMp3ViaOnlineTTS(text, voiceSettings) {
  // Use language code; prefer English for your case
  const lang = voiceSettings?.voice?.lang || "en-US";
  const langCode = lang.split("-")[0] || "en";

  // Chunk text to avoid limits
  const maxLength = 200;
  const parts = [];
  for (let i = 0; i < text.length; i += maxLength) {
    parts.push(text.substring(i, i + maxLength));
  }

  const buffers = [];

  for (let i = 0; i < parts.length; i++) {
    const chunk = parts[i].trim();
    if (!chunk) continue;

    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${langCode}&client=tw-ob&q=${encodeURIComponent(
      chunk,
    )}`;

    // PUBLIC CORS PROXY (may break). Best practice: self-host proxy or use official API.
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(ttsUrl)}`;

    const res = await fetch(proxyUrl);
    if (!res.ok)
      throw new Error(`Failed to fetch audio chunk ${i + 1}/${parts.length}`);

    const arr = await res.arrayBuffer();
    if (!arr || arr.byteLength === 0)
      throw new Error(`Empty audio data for chunk ${i + 1}`);

    buffers.push(arr);
  }

  if (buffers.length === 0) throw new Error("No audio data received.");

  // Combine buffers
  const total = buffers.reduce((acc, b) => acc + b.byteLength, 0);
  const merged = new Uint8Array(total);

  let offset = 0;
  for (const b of buffers) {
    merged.set(new Uint8Array(b), offset);
    offset += b.byteLength;
  }

  return new Blob([merged], { type: "audio/mp3" });
}

function downloadBlobAsFile(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.style.display = "none";

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
}

async function downloadAudio() {
  if (!lastSpokenText) {
    setStatus("Nothing to download yet. Click Speak first.", "error");
    return;
  }

  try {
    setStatus("Generating MP3 for download...", "speaking");

    // Reuse previously generated blob if available
    if (!downloadBlob) {
      downloadBlob = await generateMp3ViaOnlineTTS(
        lastSpokenText,
        lastVoiceSettings,
      );
    }

    const timestamp = new Date()
      .toISOString()
      .replace(/[:.]/g, "-")
      .slice(0, -5);
    const preview =
      lastSpokenText.substring(0, 30).replace(/[^a-z0-9]/gi, "_") || "speech";
    const filename = `speech_${preview}_${timestamp}.mp3`;

    downloadBlobAsFile(downloadBlob, filename);

    setStatus("Downloaded successfully!", "success");
  } catch (err) {
    console.error(err);
    setStatus(
      "Download failed. This may be blocked by browser/network restrictions (CORS/proxy).",
      "error",
    );
  }
}

// -------------------------
// Events
// -------------------------
speakBtn.addEventListener("click", speak);
pauseBtn.addEventListener("click", pause);
resumeBtn.addEventListener("click", resume);
stopBtn.addEventListener("click", stop);
downloadBtn.addEventListener("click", downloadAudio);

textInput.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
    e.preventDefault();
    speak();
  }
});

// Init
setUiState("idle");
setStatus("");
