let audioPlayer = document.getElementById("audioPlayer");
let playingGif = document.getElementById("playingGif");
let pausedGif = document.getElementById("pausedGif");
let placeholder = document.getElementById("placeholder");
let controlButton = document.getElementById("controlButton");
let isPlaying = false;
let timeout;
let cycleActive = false;

function toggleCycle() {
  if (cycleActive) {
    stopCycle();
    controlButton.innerText = "Start";
  } else {
    startCycle();
    controlButton.innerText = "Stop";
  }
}

function startCycle() {
  cycleActive = true;
  placeholder.style.display = "none"; // Hide the placeholder when cycle starts
  togglePlayPause();
}

function stopCycle() {
  clearTimeout(timeout);
  audioPlayer.pause();
  isPlaying = false;
  cycleActive = false;
  updateGifDisplay();
  placeholder.style.display = "block"; // Show the placeholder when cycle stops
}

function togglePlayPause() {
  if (isPlaying) {
    audioPlayer.pause();
    pausedGif.style.display = "block";
    playingGif.style.display = "none";
    scheduleNextToggle(5000); // Pauses for a constant 5 seconds before playing again
  } else {
    audioPlayer.play();
    playingGif.style.display = "block";
    pausedGif.style.display = "none";
    scheduleNextToggle(randomPlayTime());
  }
  isPlaying = !isPlaying;
}

function scheduleNextToggle(delay) {
  if (cycleActive) {
    timeout = setTimeout(togglePlayPause, delay);
  }
}

function randomPlayTime() {
  return Math.floor(Math.random() * 15000) + 5000; // Random time between 5 (5000 ms) and 20 (20000 ms) seconds
}

function updateGifDisplay() {
  if (!isPlaying && !cycleActive) {
    playingGif.style.display = "none";
    pausedGif.style.display = "none";
    placeholder.style.display = "block"; // Ensure placeholder is shown when not active
  }
}

audioPlayer.onended = () => {
  isPlaying = false;
  cycleActive = false;
  controlButton.innerText = "Start";
  clearTimeout(timeout);
  updateGifDisplay();
};
