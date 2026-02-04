/**
 * SpeedCut - YouTube Video Speed Controller
 * Controls video playback speed using customizable keyboard keys
 * 
 * Default keys:
 * Numpad +: Tap = +0.25, Hold = continuous increase
 * Numpad -: Tap = -0.25, Hold = continuous decrease
 * Numpad *: Reset to 1.0x
 */

(function () {
  'use strict';

  // Configuration
  const CONFIG = {
    TAP_STEP: 0.25,           // Speed change on single tap
    HOLD_STEP: 0.1,           // Speed change per hold interval
    HOLD_THRESHOLD: 200,      // ms before considering it a hold
    HOLD_INTERVAL: 100,       // ms between hold increments
    MIN_SPEED: 0.1,
    MAX_SPEED: 16,
    HUD_DURATION: 1000,       // ms to show HUD
    HUD_FADE_DURATION: 300    // ms for fade animation
  };

  // Default keybindings
  const DEFAULT_KEYBINDINGS = {
    speedUp: { code: 'NumpadAdd', display: 'Numpad +' },
    speedDown: { code: 'NumpadSubtract', display: 'Numpad -' },
    resetSpeed: { code: 'NumpadMultiply', display: 'Numpad *' }
  };

  // Current keybindings (will be loaded from storage)
  let keybindings = { ...DEFAULT_KEYBINDINGS };

  // State management
  const state = {
    isHolding: false,
    holdTimer: null,
    holdInterval: null,
    activeKey: null,
    hudTimeout: null
  };

  // Load keybindings from storage
  async function loadKeybindings() {
    try {
      const result = await chrome.storage.sync.get('keybindings');
      if (result.keybindings) {
        keybindings = { ...DEFAULT_KEYBINDINGS, ...result.keybindings };
      }
      console.log('🎬 SpeedCut: Keybindings loaded', keybindings);
    } catch (error) {
      console.log('🎬 SpeedCut: Using default keybindings');
    }
  }

  // Listen for storage changes
  function listenForStorageChanges() {
    chrome.storage.onChanged.addListener((changes, namespace) => {
      if (namespace === 'sync' && changes.keybindings) {
        keybindings = { ...DEFAULT_KEYBINDINGS, ...changes.keybindings.newValue };
        console.log('🎬 SpeedCut: Keybindings updated', keybindings);
      }
    });
  }

  // Get video element
  function getVideo() {
    return document.querySelector('video');
  }

  // Clamp speed within bounds
  function clampSpeed(speed) {
    return Math.max(CONFIG.MIN_SPEED, Math.min(CONFIG.MAX_SPEED, speed));
  }

  // Round to 2 decimal places
  function roundSpeed(speed) {
    return Math.round(speed * 100) / 100;
  }

  // Create or get HUD element
  function getOrCreateHUD() {
    let hud = document.getElementById('speedcut-hud');

    if (!hud) {
      hud = document.createElement('div');
      hud.id = 'speedcut-hud';
      hud.className = 'speedcut-hud';
      document.body.appendChild(hud);
    }

    return hud;
  }

  // Show speed in HUD
  function showHUD(speed) {
    const hud = getOrCreateHUD();

    // Clear any existing timeout
    if (state.hudTimeout) {
      clearTimeout(state.hudTimeout);
    }

    // Update content and show
    hud.textContent = `${speed.toFixed(2)}x`;
    hud.classList.remove('speedcut-hud-hidden');
    hud.classList.add('speedcut-hud-visible');

    // Set timeout to hide
    state.hudTimeout = setTimeout(() => {
      hud.classList.remove('speedcut-hud-visible');
      hud.classList.add('speedcut-hud-hidden');
    }, CONFIG.HUD_DURATION);
  }

  // Change video speed
  function changeSpeed(delta) {
    const video = getVideo();
    if (!video) return;

    const newSpeed = clampSpeed(roundSpeed(video.playbackRate + delta));
    video.playbackRate = newSpeed;
    showHUD(newSpeed);
  }

  // Set video speed to specific value
  function setSpeed(speed) {
    const video = getVideo();
    if (!video) return;

    const newSpeed = clampSpeed(roundSpeed(speed));
    video.playbackRate = newSpeed;
    showHUD(newSpeed);
  }

  // Start hold mode
  function startHold(direction) {
    state.isHolding = true;

    // Apply hold changes at regular intervals
    state.holdInterval = setInterval(() => {
      const delta = direction === 'increase' ? CONFIG.HOLD_STEP : -CONFIG.HOLD_STEP;
      changeSpeed(delta);
    }, CONFIG.HOLD_INTERVAL);
  }

  // Stop all timers and intervals
  function stopHold() {
    state.isHolding = false;

    if (state.holdTimer) {
      clearTimeout(state.holdTimer);
      state.holdTimer = null;
    }

    if (state.holdInterval) {
      clearInterval(state.holdInterval);
      state.holdInterval = null;
    }

    state.activeKey = null;
  }

  // Get action from key code
  function getActionFromKey(code) {
    if (code === keybindings.speedUp.code) return 'speedUp';
    if (code === keybindings.speedDown.code) return 'speedDown';
    if (code === keybindings.resetSpeed.code) return 'resetSpeed';
    return null;
  }

  // Handle keydown event
  function handleKeyDown(e) {
    const action = getActionFromKey(e.code);
    if (!action) return;

    // Prevent default browser behavior
    e.preventDefault();
    e.stopPropagation();

    // Ignore if already processing this key (prevents key repeat)
    if (state.activeKey === e.code) {
      return;
    }

    // Handle reset immediately on keydown
    if (action === 'resetSpeed') {
      setSpeed(1.0);
      return;
    }

    // Store active key
    state.activeKey = e.code;

    // Determine direction
    const direction = action === 'speedUp' ? 'increase' : 'decrease';

    // Start hold timer
    state.holdTimer = setTimeout(() => {
      // This is a hold - start continuous change
      startHold(direction);
    }, CONFIG.HOLD_THRESHOLD);
  }

  // Handle keyup event
  function handleKeyUp(e) {
    const action = getActionFromKey(e.code);
    if (!action || action === 'resetSpeed') return;

    // Check if this was the active key
    if (state.activeKey !== e.code) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    // If timer still exists, this was a tap (not a hold)
    if (state.holdTimer && !state.isHolding) {
      clearTimeout(state.holdTimer);
      state.holdTimer = null;

      // Apply single tap change
      const delta = action === 'speedUp' ? CONFIG.TAP_STEP : -CONFIG.TAP_STEP;
      changeSpeed(delta);
    }

    // Clean up hold state
    stopHold();
  }

  // Initialize the extension
  async function init() {
    // Load keybindings from storage
    await loadKeybindings();

    // Listen for changes to keybindings
    listenForStorageChanges();

    // Add event listeners with capture to catch events before YouTube
    document.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('keyup', handleKeyUp, true);

    console.log('🎬 SpeedCut: YouTube Speed Controller initialized');
  }

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
