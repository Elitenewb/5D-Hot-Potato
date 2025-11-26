(function() {
  'use strict';

  const audioPlayer = document.getElementById("audioPlayer");
  const playingGif = document.getElementById("playingGif");
  const pausedGif = document.getElementById("pausedGif");
  const placeholder = document.getElementById("placeholder");
  const controlButton = document.getElementById("controlButton");
  
  let isPlaying = false;
  let timeout = null;
  let cycleActive = false;

  // Add error handling for audio
  audioPlayer.addEventListener('error', (e) => {
    console.error('Audio error:', e);
    stopCycle();
    alert('Error loading audio. Please check the file path.');
  });

  // Wait for DOM to be ready
  function init() {
    controlButton.addEventListener('click', toggleCycle);
    
    // Add cleanup on page unload
    window.addEventListener('beforeunload', () => {
      if (cycleActive) {
        clearTimeout(timeout);
        audioPlayer.pause();
      }
    });
  }

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
    placeholder.style.display = "none";
    togglePlayPause();
  }

  function stopCycle() {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    audioPlayer.pause();
    isPlaying = false;
    cycleActive = false;
    
    // Inline the updateGifDisplay logic
    playingGif.style.display = "none";
    pausedGif.style.display = "none";
    placeholder.style.display = "block";
  }

  function togglePlayPause() {
    if (isPlaying) {
      audioPlayer.pause();
      pausedGif.style.display = "block";
      playingGif.style.display = "none";
      isPlaying = false;
      scheduleNextToggle(5000);
    } else {
      // Check if audio is ready before playing
      if (audioPlayer.readyState >= 2) {
        const playPromise = audioPlayer.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              isPlaying = true;
              playingGif.style.display = "block";
              pausedGif.style.display = "none";
              scheduleNextToggle(randomPlayTime());
            })
            .catch((error) => {
              console.error('Playback failed:', error);
              // Autoplay was prevented or other error
              stopCycle();
              controlButton.innerText = "Start";
              alert('Audio playback failed. Please click Start again.');
            });
        } else {
          // Fallback for older browsers
          isPlaying = true;
          playingGif.style.display = "block";
          pausedGif.style.display = "none";
          scheduleNextToggle(randomPlayTime());
        }
      } else {
        // Audio not ready, wait for it
        audioPlayer.addEventListener('canplay', function onCanPlay() {
          audioPlayer.removeEventListener('canplay', onCanPlay);
          togglePlayPause();
        }, { once: true });
        return;
      }
    }
  }

  function scheduleNextToggle(delay) {
    if (cycleActive) {
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(togglePlayPause, delay);
    }
  }

  function randomPlayTime() {
    // Random time between 5 (5000 ms) and 19.999 (19999 ms) seconds
    return Math.floor(Math.random() * 15000) + 5000;
  }

  // Improved audio ended handler
  audioPlayer.addEventListener('ended', () => {
    isPlaying = false;
    cycleActive = false;
    controlButton.innerText = "Start";
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    playingGif.style.display = "none";
    pausedGif.style.display = "none";
    placeholder.style.display = "block";
  });

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
