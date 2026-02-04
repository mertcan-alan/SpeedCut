/**
 * SpeedCut Popup Script
 * Handles keyboard customization UI
 */

// Default keybindings
const DEFAULT_KEYBINDINGS = {
    speedUp: { code: 'NumpadAdd', display: 'Numpad +' },
    speedDown: { code: 'NumpadSubtract', display: 'Numpad -' },
    resetSpeed: { code: 'NumpadMultiply', display: 'Numpad *' }
};

// Current keybindings state
let keybindings = { ...DEFAULT_KEYBINDINGS };

// Currently listening input element
let activeInput = null;

// DOM Elements
const elements = {
    speedUp: document.getElementById('speedUp'),
    speedDown: document.getElementById('speedDown'),
    resetSpeed: document.getElementById('resetSpeed'),
    saveBtn: document.getElementById('saveBtn'),
    resetBtn: document.getElementById('resetBtn'),
    toast: document.getElementById('toast')
};

// Get friendly key name
function getKeyDisplayName(code) {
    const keyNames = {
        // Numpad
        'NumpadAdd': 'Numpad +',
        'NumpadSubtract': 'Numpad -',
        'NumpadMultiply': 'Numpad *',
        'NumpadDivide': 'Numpad /',
        'NumpadEnter': 'Numpad Enter',
        'NumpadDecimal': 'Numpad .',
        'Numpad0': 'Numpad 0',
        'Numpad1': 'Numpad 1',
        'Numpad2': 'Numpad 2',
        'Numpad3': 'Numpad 3',
        'Numpad4': 'Numpad 4',
        'Numpad5': 'Numpad 5',
        'Numpad6': 'Numpad 6',
        'Numpad7': 'Numpad 7',
        'Numpad8': 'Numpad 8',
        'Numpad9': 'Numpad 9',
        // Function keys
        'F1': 'F1', 'F2': 'F2', 'F3': 'F3', 'F4': 'F4',
        'F5': 'F5', 'F6': 'F6', 'F7': 'F7', 'F8': 'F8',
        'F9': 'F9', 'F10': 'F10', 'F11': 'F11', 'F12': 'F12',
        // Special
        'Space': 'Space',
        'Enter': 'Enter',
        'Escape': 'Escape',
        'Backspace': 'Backspace',
        'Tab': 'Tab',
        'Delete': 'Delete',
        'Insert': 'Insert',
        'Home': 'Home',
        'End': 'End',
        'PageUp': 'Page Up',
        'PageDown': 'Page Down',
        // Arrows
        'ArrowUp': '↑',
        'ArrowDown': '↓',
        'ArrowLeft': '←',
        'ArrowRight': '→',
        // Modifiers
        'ShiftLeft': 'Left Shift',
        'ShiftRight': 'Right Shift',
        'ControlLeft': 'Left Ctrl',
        'ControlRight': 'Right Ctrl',
        'AltLeft': 'Left Alt',
        'AltRight': 'Right Alt',
        // Brackets
        'BracketLeft': '[',
        'BracketRight': ']',
        'Backslash': '\\',
        'Semicolon': ';',
        'Quote': "'",
        'Comma': ',',
        'Period': '.',
        'Slash': '/',
        'Backquote': '`',
        'Minus': '-',
        'Equal': '='
    };

    // Check if it's a known key
    if (keyNames[code]) {
        return keyNames[code];
    }

    // Handle letter keys (KeyA, KeyB, etc.)
    if (code.startsWith('Key')) {
        return code.slice(3);
    }

    // Handle digit keys (Digit1, Digit2, etc.)
    if (code.startsWith('Digit')) {
        return code.slice(5);
    }

    // Fallback
    return code;
}

// Update UI with current keybindings
function updateUI() {
    for (const [action, binding] of Object.entries(keybindings)) {
        const element = elements[action];
        if (element) {
            const keyDisplay = element.querySelector('.key-display');
            keyDisplay.textContent = binding.display;
        }
    }
}

// Load keybindings from storage
async function loadKeybindings() {
    try {
        const result = await chrome.storage.sync.get('keybindings');
        if (result.keybindings) {
            keybindings = { ...DEFAULT_KEYBINDINGS, ...result.keybindings };
        }
        updateUI();
    } catch (error) {
        console.error('Failed to load keybindings:', error);
    }
}

// Save keybindings to storage
async function saveKeybindings() {
    try {
        await chrome.storage.sync.set({ keybindings });
        showToast('Settings saved!');
    } catch (error) {
        console.error('Failed to save keybindings:', error);
        showToast('Failed to save!');
    }
}

// Reset to default keybindings
function resetToDefault() {
    keybindings = { ...DEFAULT_KEYBINDINGS };
    updateUI();
    showToast('Reset to defaults');
}

// Show toast notification
function showToast(message) {
    elements.toast.textContent = message;
    elements.toast.classList.remove('hidden');
    elements.toast.classList.add('show');

    setTimeout(() => {
        elements.toast.classList.remove('show');
        elements.toast.classList.add('hidden');
    }, 2000);
}

// Start listening for key input
function startListening(inputElement) {
    // Stop any previous listening
    if (activeInput) {
        activeInput.classList.remove('listening');
        const prevDisplay = activeInput.querySelector('.key-display');
        const action = activeInput.dataset.action;
        prevDisplay.textContent = keybindings[action].display;
    }

    activeInput = inputElement;
    activeInput.classList.add('listening');
    const keyDisplay = activeInput.querySelector('.key-display');
    keyDisplay.textContent = 'Press a key...';
}

// Stop listening
function stopListening() {
    if (activeInput) {
        activeInput.classList.remove('listening');
        const action = activeInput.dataset.action;
        const keyDisplay = activeInput.querySelector('.key-display');
        keyDisplay.textContent = keybindings[action].display;
        activeInput = null;
    }
}

// Handle key press while listening
function handleKeyCapture(event) {
    if (!activeInput) return;

    event.preventDefault();
    event.stopPropagation();

    // Ignore Escape - cancel listening
    if (event.code === 'Escape') {
        stopListening();
        return;
    }

    // Get action from active input
    const action = activeInput.dataset.action;

    // Update keybinding
    const displayName = getKeyDisplayName(event.code);
    keybindings[action] = {
        code: event.code,
        display: displayName
    };

    // Update UI
    const keyDisplay = activeInput.querySelector('.key-display');
    keyDisplay.textContent = displayName;

    // Stop listening
    activeInput.classList.remove('listening');
    activeInput = null;
}

// Initialize
function init() {
    // Load saved keybindings
    loadKeybindings();

    // Setup click handlers for keybind inputs
    for (const [action, element] of Object.entries(elements)) {
        if (['speedUp', 'speedDown', 'resetSpeed'].includes(action)) {
            element.addEventListener('click', () => startListening(element));
        }
    }

    // Global keydown handler for key capture
    document.addEventListener('keydown', handleKeyCapture);

    // Click outside to cancel listening
    document.addEventListener('click', (event) => {
        if (activeInput && !event.target.closest('.keybind-input')) {
            stopListening();
        }
    });

    // Save button
    elements.saveBtn.addEventListener('click', saveKeybindings);

    // Reset button
    elements.resetBtn.addEventListener('click', resetToDefault);
}

// Run initialization
init();
