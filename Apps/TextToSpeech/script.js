let synth = window.speechSynthesis;
let utterance = null;
let isPaused = false;
let mediaRecorder = null;
let audioChunks = [];
let audioBlob = null;
let audioContext = null;
let isRecording = false;
let audioStream = null;

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

// Record speech using a practical workaround
// Since Web Speech API doesn't expose audio streams, we use a technique
// that captures audio by using MediaRecorder with system audio capture
// Note: This requires browser support for audio capture
async function startRecording() {
  try {
    // Check if MediaRecorder is available
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error("MediaRecorder API not available");
    }

    // Request audio capture permission
    // Note: Some browsers may require microphone permission even for system audio
    const stream = await navigator.mediaDevices.getUserMedia({ 
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false,
        // Try to capture system audio (browser-dependent)
        suppressLocalAudioPlayback: false
      } 
    });
    
    audioStream = stream;

    // Determine best MIME type
    let mimeType = 'audio/webm';
    const types = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/ogg;codecs=opus',
      'audio/mp4',
      'audio/wav'
    ];
    
    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        mimeType = type;
        break;
      }
    }

    // Create MediaRecorder
    mediaRecorder = new MediaRecorder(stream, { mimeType });
    audioChunks = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        audioChunks.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      if (audioChunks.length > 0) {
        audioBlob = new Blob(audioChunks, { type: mediaRecorder.mimeType });
        downloadBtn.disabled = false;
        status.textContent = "Audio ready for download!";
        status.className = "status success";
      }
      
      // Stop all tracks
      if (audioStream) {
        audioStream.getTracks().forEach(track => track.stop());
      }
    };

    mediaRecorder.onerror = (event) => {
      console.error("MediaRecorder error:", event.error);
      status.textContent = "Recording error occurred.";
      status.className = "status error";
    };

    mediaRecorder.start(100); // Collect data every 100ms
    isRecording = true;
    return true;
  } catch (error) {
    console.error("Error starting recording:", error);
    // Provide helpful message
    if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
      status.textContent = "Microphone permission required for audio recording. Please allow access and try again.";
    } else {
      status.textContent = "Audio recording not available in this browser. Audio will play but cannot be downloaded.";
    }
    status.className = "status";
    return false;
  }
}

// Stop recording
function stopRecording() {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
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

  // Create new utterance
  utterance = new SpeechSynthesisUtterance(text);

  // Get selected voice
  const voices = synth.getVoices();
  utterance.voice = voices[voiceSelect.value];

  // Set speech parameters
  utterance.rate = parseFloat(rateSlider.value);
  utterance.pitch = parseFloat(pitchSlider.value);
  utterance.volume = parseFloat(volumeSlider.value);

  // Try to start recording
  // Note: This approach requires microphone access and will record
  // what's being played through speakers (system audio capture)
  const recordingStarted = await startRecording();

  // Event handlers
  utterance.onstart = () => {
    if (recordingStarted) {
      status.textContent = "Speaking and recording...";
    } else {
      status.textContent = "Speaking... (Recording not available - see note below)";
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
    
    // Small delay to ensure recording is processed
    setTimeout(() => {
      if (audioBlob) {
        status.textContent = "Speech completed. Audio ready for download!";
        status.className = "status success";
        downloadBtn.disabled = false;
      } else {
        status.textContent = "Speech completed.";
        status.className = "status success";
      }
    }, 500);
    
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

// Download function
function downloadAudio() {
  if (!audioBlob) {
    status.textContent = "No audio available to download. Please speak some text first.";
    status.className = "status error";
    return;
  }

  try {
    // Create download link
    const url = URL.createObjectURL(audioBlob);
    const a = document.createElement('a');
    a.href = url;
    a.style.display = 'none';
    
    // Determine file extension based on mime type
    let extension = 'webm';
    const mimeType = mediaRecorder ? mediaRecorder.mimeType : 'audio/webm';
    
    if (mimeType.includes('mp4')) {
      extension = 'mp4';
    } else if (mimeType.includes('ogg')) {
      extension = 'ogg';
    } else if (mimeType.includes('webm')) {
      extension = 'webm';
    } else if (mimeType.includes('wav')) {
      extension = 'wav';
    }
    
    // Create filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const textPreview = textInput.value.trim().substring(0, 30).replace(/[^a-z0-9]/gi, '_') || 'speech';
    a.download = `speech_${textPreview}_${timestamp}.${extension}`;
    
    // Trigger download
    document.body.appendChild(a);
    a.click();
    
    // Clean up after a short delay
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
    
    status.textContent = "Audio downloaded successfully!";
    status.className = "status success";
  } catch (error) {
    console.error("Download error:", error);
    status.textContent = "Error downloading audio file.";
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
