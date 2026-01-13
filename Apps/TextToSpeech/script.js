// Text to Speech Application
let synth = window.speechSynthesis;
let utterance = null;
let isPaused = false;

// DOM Elements
const textInput = document.getElementById("textInput");
const voiceSelect = document.getElementById("voiceSelect");
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
const status = document.getElementById("status");

// Load available voices
function loadVoices() {
  const voices = synth.getVoices();

  // Clear existing options
  voiceSelect.innerHTML = "";

  // Add voices to select dropdown
  voices.forEach((voice, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = `${voice.name} (${voice.lang})`;
    voiceSelect.appendChild(option);
  });

  // Set default voice if available
  if (voices.length > 0) {
    const defaultVoice = voices.find((voice) => voice.default) || voices[0];
    const defaultIndex = voices.indexOf(defaultVoice);
    voiceSelect.value = defaultIndex;
  }
}

// Load voices when they become available
if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = loadVoices;
}
loadVoices(); // Fallback for browsers that don't fire the event

// Update slider value displays
rateSlider.addEventListener("input", (e) => {
  rateValue.textContent = e.target.value;
});

pitchSlider.addEventListener("input", (e) => {
  pitchValue.textContent = e.target.value;
});

volumeSlider.addEventListener("input", (e) => {
  volumeValue.textContent = e.target.value;
});

// Speak function
function speak() {
  const text = textInput.value.trim();

  if (!text) {
    status.textContent = "Please enter some text to speak.";
    status.className = "status error";
    return;
  }

  // Cancel any ongoing speech
  synth.cancel();

  // Create new utterance
  utterance = new SpeechSynthesisUtterance(text);

  // Get selected voice
  const voices = synth.getVoices();
  utterance.voice = voices[voiceSelect.value];

  // Set speech parameters
  utterance.rate = parseFloat(rateSlider.value);
  utterance.pitch = parseFloat(pitchSlider.value);
  utterance.volume = parseFloat(volumeSlider.value);

  // Event handlers
  utterance.onstart = () => {
    status.textContent = "Speaking...";
    status.className = "status speaking";
    speakBtn.disabled = true;
    pauseBtn.disabled = false;
    resumeBtn.disabled = true;
    stopBtn.disabled = false;
    isPaused = false;
  };

  utterance.onend = () => {
    status.textContent = "Speech completed.";
    status.className = "status success";
    speakBtn.disabled = false;
    pauseBtn.disabled = true;
    resumeBtn.disabled = true;
    stopBtn.disabled = true;
    isPaused = false;
  };

  utterance.onerror = (event) => {
    status.textContent = `Error: ${event.error}`;
    status.className = "status error";
    speakBtn.disabled = false;
    pauseBtn.disabled = true;
    resumeBtn.disabled = true;
    stopBtn.disabled = true;
  };

  // Speak
  synth.speak(utterance);
}

// Pause function
function pause() {
  if (synth.speaking && !synth.paused) {
    synth.pause();
    status.textContent = "Paused.";
    status.className = "status paused";
    pauseBtn.disabled = true;
    resumeBtn.disabled = false;
    isPaused = true;
  }
}

// Resume function
function resume() {
  if (synth.speaking && synth.paused) {
    synth.resume();
    status.textContent = "Speaking...";
    status.className = "status speaking";
    pauseBtn.disabled = false;
    resumeBtn.disabled = true;
    isPaused = false;
  }
}

// Stop function
function stop() {
  synth.cancel();
  status.textContent = "Stopped.";
  status.className = "status";
  speakBtn.disabled = false;
  pauseBtn.disabled = true;
  resumeBtn.disabled = true;
  stopBtn.disabled = true;
  isPaused = false;
}

// Event listeners
speakBtn.addEventListener("click", speak);
pauseBtn.addEventListener("click", pause);
resumeBtn.addEventListener("click", resume);
stopBtn.addEventListener("click", stop);

// Allow Enter key to trigger speak (Ctrl+Enter or Cmd+Enter)
textInput.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
    e.preventDefault();
    speak();
  }
});
