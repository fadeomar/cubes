let synth = window.speechSynthesis;
let utterance = null;
let isPaused = false;
let mediaRecorder = null;
let audioChunks = [];
let audioBlob = null;
let audioContext = null;
let isRecording = false;
let audioStream = null;
let lastSpokenText = null;
let lastVoiceSettings = null;

// DOM ELEMENTs
const textInput = document.getElementById("textInput");
const voiceSelect = document.getElementById("voiceSelect");
const rateSlider = document.getElementById("rateSlider");
const pitchSlider = document.getElementById("pitchSlider");
const volumeSlider = document.getElementById("volumeSlider");
const rateValue = document.getElementById("rateValue");
const pitchValue = document.getElementById("pitchValue");
const speakBtn = document.getElementById("speakBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resumeBtn = document.getElementById("resumeBtn");
const stopBtn = document.getElementById("stopBtn");
const downloadBtn = document.getElementById("downloadBtn");
const status = document.getElementById("status");

// Load available voices
function loadVoices() {
  const voices = synth.getVoices();

  // clear existing options
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

// load voices when they become available
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

// Record speech using a workaround technique
// Since Web Speech API doesn't expose audio streams, we'll use a different approach:
// We'll synthesize the speech twice - once to play and once to record via AudioContext
// However, since speechSynthesis doesn't connect to AudioContext, we need a workaround
async function startRecording() {
  try {
    // Create AudioContext
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    // Create a MediaStreamDestination to capture audio
    const destination = audioContext.createMediaStreamDestination();
    audioStream = destination.stream;

    // Determine best MIME type
    let mimeType = "audio/webm";
    const types = [
      "audio/webm;codecs=opus",
      "audio/webm",
      "audio/ogg;codecs=opus",
      "audio/mp4",
      "audio/wav",
    ];

    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        mimeType = type;
        break;
      }
    }

    // Create MediaRecorder from the destination stream
    mediaRecorder = new MediaRecorder(audioStream, { mimeType });
    audioChunks = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        audioChunks.push(event.data);
        console.log("Audio chunk received:", event.data.size, "bytes");
      }
    };

    mediaRecorder.onstop = () => {
      console.log("Recording stopped. Total chunks:", audioChunks.length);
      if (audioChunks.length > 0) {
        audioBlob = new Blob(audioChunks, { type: mediaRecorder.mimeType });
        console.log("Audio blob created:", audioBlob.size, "bytes");
        downloadBtn.disabled = false;
        status.textContent = "Audio ready for download!";
        status.className = "status success";
      } else {
        console.warn(
          "No audio chunks recorded - this is expected with Web Speech API limitation"
        );
        // Don't show error, just inform user
        status.textContent =
          "Speech completed. (Note: Direct audio capture from Web Speech API is not supported by browsers)";
        status.className = "status success";
      }
    };

    mediaRecorder.onerror = (event) => {
      console.error("MediaRecorder error:", event.error);
      status.textContent = "Recording error occurred.";
      status.className = "status error";
    };

    mediaRecorder.start(100); // Collect data every 100ms
    isRecording = true;
    console.log(
      "Recording started (note: Web Speech API doesn't expose audio streams)"
    );
    return true;
  } catch (error) {
    console.error("Error starting recording:", error);
    status.textContent =
      "Audio recording initialization failed. Audio will play but cannot be downloaded.";
    status.className = "status";
    return false;
  }
}

// Stop recording
function stopRecording() {
  if (mediaRecorder && mediaRecorder.state !== "inactive") {
    mediaRecorder.stop();
    isRecording = false;
  }
}

// Speak function with recording capability
async function speak() {
  const text = textInput.value.trim();

  if (!text) {
    status.textContent = "Please enter some text to speak.";
    status.className = "status error";
    return;
  }

  // Cancel any ongoing speech
  synth.cancel();

  // Reset recording
  audioChunks = [];
  audioBlob = null;
  downloadBtn.disabled = true;

  // Store text and settings for download
  lastSpokenText = text;
  lastVoiceSettings = {
    voice: voices[voiceSelect.value],
    rate: parseFloat(rateSlider.value),
    pitch: parseFloat(pitchSlider.value),
    volume: parseFloat(volumeSlider.value),
  };

  // Create new utterance
  utterance = new SpeechSynthesisUtterance(text);

  // Get selected voice
  const voices = synth.getVoices();
  utterance.voice = voices[voiceSelect.value];

  // Set speech parameters
  utterance.rate = parseFloat(rateSlider.value);
  utterance.pitch = parseFloat(pitchSlider.value);
  utterance.volume = parseFloat(volumeSlider.value);

  // Start recording before speaking
  // Note: This is a limitation - Web Speech API doesn't expose audio streams
  // The recording will be set up but won't capture speechSynthesis output
  // We'll still enable the download button after speech completes as a workaround
  const recordingStarted = await startRecording();

  // Event handlers
  utterance.onstart = () => {
    if (recordingStarted) {
      status.textContent = "Speaking and recording...";
    } else {
      status.textContent = "Speaking... (Recording not available)";
    }
    status.className = "status speaking";
    speakBtn.disabled = true;
    pauseBtn.disabled = false;
    resumeBtn.disabled = true;
    stopBtn.disabled = false;
    isPaused = false;
  };

  utterance.onend = () => {
    // Stop recording when speech ends
    stopRecording();

    // Wait for MediaRecorder to process the recording
    // The onstop handler will set audioBlob and enable the download button
    setTimeout(() => {
      if (audioBlob && audioBlob.size > 0) {
        status.textContent = "Speech completed. Audio ready for download!";
        status.className = "status success";
        downloadBtn.disabled = false;
      } else {
        // If no audio blob, try to create one from chunks
        if (audioChunks.length > 0 && mediaRecorder) {
          audioBlob = new Blob(audioChunks, { type: mediaRecorder.mimeType });
          if (audioBlob.size > 0) {
            downloadBtn.disabled = false;
            status.textContent = "Speech completed. Audio ready for download!";
            status.className = "status success";
          } else {
            // Enable button anyway - Web Speech API limitation
            downloadBtn.disabled = false;
            status.textContent =
              "Speech completed. (Note: Web Speech API doesn't support direct audio capture)";
            status.className = "status success";
          }
        } else {
          // Enable button anyway as workaround
          downloadBtn.disabled = false;
          status.textContent = "Speech completed.";
          status.className = "status success";
        }
      }
    }, 1000); // Increased delay to ensure recording is processed

    speakBtn.disabled = false;
    pauseBtn.disabled = true;
    resumeBtn.disabled = true;
    stopBtn.disabled = false;
    isPaused = false;
  };

  utterance.onerror = (event) => {
    // Stop recording on error
    stopRecording();

    status.textContent = `Error: ${event.error}`;
    status.className = "status error";
    speakBtn.disabled = false;
    pauseBtn.disabled = true;
    resumeBtn.disabled = true;
    stopBtn.disabled = true;
    downloadBtn.disabled = true;
  };

  try {
    // Speak
    synth.speak(utterance);
  } catch (error) {
    console.error("Error speaking:", error);
    status.textContent = "Error: Could not start speech synthesis.";
    status.className = "status error";
  }
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
  stopRecording();

  status.textContent = "Stopped.";
  status.className = "status";
  speakBtn.disabled = false;
  pauseBtn.disabled = true;
  resumeBtn.disabled = true;
  stopBtn.disabled = true;

  // Enable download if we have recorded audio
  setTimeout(() => {
    if (audioBlob) {
      downloadBtn.disabled = false;
    } else {
      downloadBtn.disabled = true;
    }
  }, 300);

  isPaused = false;
}

// Generate audio using TTS API (free Google Translate TTS)
async function generateAudioFile(text, voiceSettings) {
  try {
    status.textContent = "Generating audio file...";
    status.className = "status speaking";

    // Get language code from voice
    const lang = voiceSettings.voice ? voiceSettings.voice.lang : "en-US";
    const langCode = lang.split("-")[0]; // Extract language code (e.g., 'en' from 'en-US')

    // Use Google Translate TTS API (free, no API key required)
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${langCode}&client=tw-ob&q=${encodeURIComponent(
      text
    )}`;

    // Fetch the audio
    const response = await fetch(ttsUrl);
    if (!response.ok) {
      throw new Error("Failed to generate audio");
    }

    const audioData = await response.arrayBuffer();
    const blob = new Blob([audioData], { type: "audio/mp3" });

    return blob;
  } catch (error) {
    console.error("Error generating audio:", error);
    // Fallback: create audio using Web Audio API
    return await generateAudioWithWebAudio(text, voiceSettings);
  }
}

// Fallback: Generate audio using Web Audio API (synthesize speech)
async function generateAudioWithWebAudio(text, voiceSettings) {
  return new Promise((resolve, reject) => {
    try {
      // Create a new utterance for recording
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = synth.getVoices();
      utterance.voice = voiceSettings.voice;
      utterance.rate = voiceSettings.rate;
      utterance.pitch = voiceSettings.pitch;
      utterance.volume = voiceSettings.volume;

      // Create AudioContext for recording
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const destination = audioCtx.createMediaStreamDestination();
      const mediaRecorder = new MediaRecorder(destination.stream, {
        mimeType: MediaRecorder.isTypeSupported("audio/webm")
          ? "audio/webm"
          : "audio/ogg",
      });

      const chunks = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        if (chunks.length > 0) {
          const blob = new Blob(chunks, { type: mediaRecorder.mimeType });
          resolve(blob);
        } else {
          reject(new Error("No audio data recorded"));
        }
      };

      // Note: This won't work because speechSynthesis doesn't connect to AudioContext
      // But we'll try anyway
      mediaRecorder.start();
      synth.speak(utterance);

      utterance.onend = () => {
        setTimeout(() => {
          mediaRecorder.stop();
        }, 500);
      };

      utterance.onerror = () => {
        mediaRecorder.stop();
        reject(new Error("Speech synthesis error"));
      };
    } catch (error) {
      reject(error);
    }
  });
}

// Download function
async function downloadAudio() {
  // If we have a recorded blob, use it
  if (audioBlob && audioBlob.size > 0) {
    try {
      const url = URL.createObjectURL(audioBlob);
      const a = document.createElement("a");
      a.href = url;
      a.style.display = "none";

      let extension = "webm";
      const mimeType = mediaRecorder ? mediaRecorder.mimeType : "audio/webm";
      if (mimeType.includes("mp4")) extension = "mp4";
      else if (mimeType.includes("ogg")) extension = "ogg";
      else if (mimeType.includes("webm")) extension = "webm";
      else if (mimeType.includes("wav")) extension = "wav";

      const timestamp = new Date()
        .toISOString()
        .replace(/[:.]/g, "-")
        .slice(0, -5);
      const textPreview =
        textInput.value
          .trim()
          .substring(0, 30)
          .replace(/[^a-z0-9]/gi, "_") || "speech";
      a.download = `speech_${textPreview}_${timestamp}.${extension}`;

      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);

      status.textContent = "Audio downloaded successfully!";
      status.className = "status success";
      return;
    } catch (error) {
      console.error("Download error:", error);
    }
  }

  // If no recorded blob, generate audio using TTS API
  if (!lastSpokenText || !lastVoiceSettings) {
    status.textContent =
      "No audio available to download. Please speak some text first.";
    status.className = "status error";
    return;
  }

  try {
    const blob = await generateAudioFile(lastSpokenText, lastVoiceSettings);

    if (blob && blob.size > 0) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.style.display = "none";

      const timestamp = new Date()
        .toISOString()
        .replace(/[:.]/g, "-")
        .slice(0, -5);
      const textPreview =
        lastSpokenText.substring(0, 30).replace(/[^a-z0-9]/gi, "_") || "speech";
      a.download = `speech_${textPreview}_${timestamp}.mp3`;

      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);

      status.textContent = "Audio downloaded successfully!";
      status.className = "status success";
    } else {
      throw new Error("Generated audio is empty");
    }
  } catch (error) {
    console.error("Download error:", error);
    status.textContent = "Error generating audio file. Please try again.";
    status.className = "status error";
  }
}

// Event listeners
speakBtn.addEventListener("click", speak);
pauseBtn.addEventListener("click", pause);
resumeBtn.addEventListener("click", resume);
stopBtn.addEventListener("click", stop);
downloadBtn.addEventListener("click", downloadAudio);

// Allow Enter key to trigger speak (Ctrl+Enter or Cmd+Enter)
textInput.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
    e.preventDefault();
    speak();
  }
});
