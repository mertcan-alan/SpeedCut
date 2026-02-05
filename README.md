<div align="center">

# 🎬 SpeedCut

### YouTube Video Speed Controller

[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white)](https://chromewebstore.google.com/detail/speedcut-youtube-speed-co/boiednpnahaahceggfbfejjpljpmmgpg)
[![Manifest V3](https://img.shields.io/badge/Manifest-V3-00C853?style=for-the-badge)](https://developer.chrome.com/docs/extensions/mv3/)
[![MIT License](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

**Control YouTube video playback speed with customizable keyboard shortcuts. Tap for step changes, hold for smooth adjustments.**

[Installation](#-installation) •
[Features](#-features) •
[Customization](#-customization) •
[Usage](#-usage)

</div>

---

## ✨ Features

| Key | Tap Action | Hold Action |
|:---:|:---|:---|
| **Numpad +** | +0.25x speed | Smooth continuous increase (+0.1x every 100ms) |
| **Numpad -** | -0.25x speed | Smooth continuous decrease (-0.1x every 100ms) |
| **Numpad *** | Reset to 1.0x | - |

### 🎯 Smart Hold Detection

The extension intelligently distinguishes between quick taps and holding:

- **Quick Tap** (`< 200ms`): Changes speed by ±0.25x
- **Hold** (`> 200ms`): Smoothly adjusts speed every 100ms by ±0.1x

### ⌨️ Customizable Keyboard Shortcuts

Click the extension icon to open the settings popup and customize your keyboard shortcuts:

```
┌─────────────────────────────┐
│  ⚡ SpeedCut Settings       │
├─────────────────────────────┤
│  Speed Up      [Numpad +]   │
│  Speed Down    [Numpad -]   │
│  Reset to 1x   [Numpad *]   │
├─────────────────────────────┤
│  [Reset Default]  [Save]    │
└─────────────────────────────┘
```

- **Any key supported** - Use any keyboard key you prefer
- **Click to change** - Simply click on a field and press your desired key
- **Reset to defaults** - One click to restore original keybindings

### 🖥️ Modern HUD Display

A sleek, modern overlay appears at the top of the screen showing the current playback speed with smooth fade animations.

---

## 📦 Installation

### From Chrome Web Store (Recommended)

[![Available in the Chrome Web Store](https://img.shields.io/badge/Chrome%20Web%20Store-Install-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white)](https://chromewebstore.google.com/detail/speedcut-youtube-speed-co/boiednpnahaahceggfbfejjpljpmmgpg)

👉 **[Install SpeedCut from Chrome Web Store](https://chromewebstore.google.com/detail/speedcut-youtube-speed-co/boiednpnahaahceggfbfejjpljpmmgpg)**

---

### From Source (Developer Mode)

1. **Clone or download** this repository
   ```bash
   git clone https://github.com/mertcan-alan/SpeedCut.git
   ```

2. **Open Chrome Extensions**
   - Navigate to `chrome://extensions/`
   - Enable **Developer mode** (toggle in top right corner)

3. **Load the extension**
   - Click **Load unpacked**
   - Select the `SpeedCut` folder

4. **Done!** 🎉 Navigate to any YouTube video and use your keyboard shortcuts

---

## � Customization

### Changing Keyboard Shortcuts

1. Click the **SpeedCut icon** in your browser toolbar
2. Click on any keybind field (Speed Up, Speed Down, or Reset)
3. Press your desired key
4. Click **Save** to apply changes

### Speed Configuration

Edit `content.js` to customize speed parameters:

```javascript
const CONFIG = {
  TAP_STEP: 0.25,        // Speed change on single tap
  HOLD_STEP: 0.1,        // Speed change per hold interval
  HOLD_THRESHOLD: 200,   // ms before considering it a hold
  HOLD_INTERVAL: 100,    // ms between hold increments
  MIN_SPEED: 0.1,        // Minimum playback speed
  MAX_SPEED: 16,         // Maximum playback speed
  HUD_DURATION: 1000,    // ms to show HUD
};
```

---

## 🎮 Usage

1. Go to any YouTube video
2. Use your **configured keys** to control speed (default: Numpad keys)

### Speed Limits

| Minimum | Maximum |
|:-------:|:-------:|
| **0.1x** | **16x** |

---

## 📁 Project Structure

```
SpeedCut/
├── manifest.json    # Extension configuration (Manifest V3)
├── popup.html       # Settings popup UI
├── popup.css        # Popup styling
├── popup.js         # Popup logic & key capture
├── content.js       # Main speed control logic
├── style.css        # HUD styling
├── icons/           # Extension icons
└── README.md
```

---

## 🔒 Permissions

This extension requires minimal permissions:

- **Host permissions**: `*://*.youtube.com/*` - Only runs on YouTube
- **Storage**: Saves your custom keyboard shortcuts

No data is collected or transmitted. Everything runs locally in your browser.

---

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Made with ❤️ for YouTube power users**

⭐ Star this repo if you find it useful!

</div>
