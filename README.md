# RPG Maker MV Ace: Community CoreScript

![Banner](https://raw.githubusercontent.com/RyanBram/RPG-MV-Ace/refs/heads/main/docs/img/Project%20Ace.png)

<p align="center">
 <a href="https://github.com/RyanBram/RPG-MV-Ace/wiki">Wiki</a> | <a href="https://ryanbram.github.io/RPGMV-Ace/">Demo</a> | <a href="https://en.plugin-mv.fungamemake.com/">Plugins</a> | <a href="https://github.com/RyanBram/RPG-MV-Ace/blob/main/README-JA.md">日本語</a>
</p>

Project Ace is a comprehensive modernization of the RPG Maker MV engine core. This project aims to update the aging RMMV codebase with modern technologies while maintaining backward compatibility with existing plugins and projects.

## 🔧 Technical Overview

### 🎨 Renderer Upgrade: Pixi.js v4 → v8

![WebGPU](https://raw.githubusercontent.com/RyanBram/RPG-MV-Ace/refs/heads/main/docs/img/WebGPU.png)

The core rendering system is being migrated from Pixi.js v4 to v8, enabling:

- **WebGPU support** for improved rendering performance on compatible platforms
- Automatic fallback to WebGL (OpenGL ES) for broader compatibility
- Significant performance improvements in rendering operations

### 📐 Resolution Handling

- Dynamic scaling system for multiple resolutions and aspect ratios
- Real-time layout updates on window resize
- Eliminates hardcoded resolution constraints

### 💻 Desktop Deployment - [Tauri-MV](https://github.com/RyanBram/Tauri-MV)

![Desktop](https://raw.githubusercontent.com/RyanBram/RPG-MV-Ace/2560fd38e57e15ffde2f4799754b8376ad8f9a9f/docs/img/Desktop_Logo.svg)

Support for modern desktop application frameworks:

- **Electron**: Standard cross-platform desktop wrapper
- **Tauri**: Lightweight alternative using native OS webview (~1MB overhead vs Electron's larger footprint)

### 🎵 Audio System - [RPG Mixer](https://ryanbram.itch.io/rpg-mixer)

Custom `rpg_mixer.js` plugin with modular backend architecture:

- Lazy-loading audio backends to reduce initial load time
- **MIDI** (.mid, .rmi) via [SpessaSynth](https://spessasus.github.io/)
- **Tracker formats** (.mod, .s3m, .xm, .it, .mptm, .mo3) via [libopenmpt](https://lib.openmpt.org/libopenmpt/)
- Extensible design for additional format support

### 🌍 Localization System - [RPG Locale](https://ryanbram.itch.io/rpg-locale)

![RPG Locale](https://img.itch.zone/aW1hZ2UvNDAwODA0MC8yMzkwMjExOS5wbmc=/original/I9wSyF.png)

`rpg_locale.js` plugin with integrated translation workflow:

- Automatic text extraction from JSON database files
- Machine translation integration (Google Translate, DeepL)
- Built-in translation editor and helper tools

### 🎮 Input System - [RPG Player](https://ryanbram.itch.io/rpg-player)

![RPG Player](https://img.itch.zone/aW1hZ2UvNDAwODA5OC8yMzkwMjMwMC5wbmc=/250x600/qKRy19.png) ![RPG Player](https://img.itch.zone/aW1hZ2UvNDAwODA5OC8yMzkwMjMwMS5wbmc=/250x600/wBb8u9.png)

Improved input handling and HTML5 embeddable player:

- Enhanced keyboard, mouse, and touch input processing
- Embeddable player with standard controls (play, stop, fullscreen, volume)
- Virtual button support for mobile web deployment
- Custom cover art during game loading

### 🎯 Genre Templates

![Danmaku_core](https://img.itch.zone/aW1nLzI0Mjk0Mzc4LmpwZw==/315x250%23c/hKYvEe.jpg) ![SRP_core](https://img.itch.zone/aW1nLzEwOTM2NjYxLnBuZw==/315x250%23c/iIG17t.png)

Curated templates for various game genres:

- Visual Novels
- [Strategy RPGs (SRPGs)](https://ohisamacraft.nyanta.jp/srpg_gear_mv.html)
- Platformers
- [Bullet Hell (Danmaku)](https://github.com/HashakGik/BulletHell-RMMV)
- Action RPGs (ARPGs)
- Card Games

---

## 🛠️ Building

### Requirements

- Node.js

### Build Commands

```bash
# Install dependencies
npm install

# Build all CoreScripts
npm run build
```

Output will be in the `dist/` folder.

### Individual Module Builds

```bash
npm run build:core      # rpg_core.js
npm run build:managers  # rpg_managers.js
npm run build:objects   # rpg_objects.js
npm run build:scenes    # rpg_scenes.js
npm run build:sprites   # rpg_sprites.js
npm run build:windows   # rpg_windows.js
```

### Development

```bash
# Watch for changes and auto-build to ./game/js/
npm run watch

# Start local development server (http://localhost:8080/)
npm start

# Run tests (requires RPG Maker MV project in game/ folder)
npm test
```

---

## 🏗️ CoreScript Architecture

The CoreScript is compiled into six main files:

| File | Contents |
|------|----------|
| `rpg_core.js` | Pixi.js wrappers, audio, input, and core systems |
| `rpg_managers.js` | Static manager classes (XxxManager) |
| `rpg_objects.js` | Game data classes (Game_Xxx), serialized during save |
| `rpg_scenes.js` | Scene classes (Scene_Xxx) |
| `rpg_sprites.js` | Sprite classes (Sprite_Xxx) for graphics |
| `rpg_windows.js` | Window classes (Window_Xxx) for UI |

Additional files:
- `plugins.js`: Plugin list definition
- `main.js`: Application entry point

### Inheritance Pattern

The codebase uses ES5 prototype-based inheritance:

```javascript
function Derived() {
  this.initialize.apply(this, arguments);
}

Derived.prototype = Object.create(Base.prototype);
Derived.prototype.constructor = Derived;

Derived.prototype.initialize = function() {
  Base.prototype.initialize.call(this);
};
```

### Global Variables

**$dataXxx**: Read-only data loaded from JSON files (e.g., `$dataMap`, `$dataItems`)
- Generated by RPG Maker editor
- Immutable during gameplay

**$gameXxx**: Live game state instances (e.g., `$gamePlayer`, `$gameState`)
- Defined in `rpg_objects.js`
- Serialized on save (except `$gameTemp`, `$gameMessage`, `$gameTroop`)
- Prototype chain automatically restored on load

### Rendering & Execution

**Scene Graph**: Pixi.js tree structure where children inherit parent transforms

**Scene Lifecycle**:
```
new Scene_Xxx() → create() → start() → update()* → stop() → terminate()
```

**Game Loop**:
1. `SceneManager.run()` initializes core systems (`Graphics`, `WebAudio`, `Input`, etc.)
2. `Scene_Boot` starts as initial scene
3. `requestAnimationFrame` drives the main loop:
   - `SceneManager.update()` runs at 60 FPS
   - Current scene's `update()` propagates to all children
   - Scene graph renders to screen
   - Loop repeats

---

## 🤝 Contributing

Contributions are welcome. Please note:

- **Language**: English for all code, comments, and documentation
- **Code Standard**: ES5 for maximum plugin compatibility
- Test changes in a staging environment before submitting

---

## 🗺️ Roadmap

- Complete Pixi v8 / WebGPU migration
- Expand genre template library
- Improve plugin compatibility layer
- Performance optimization for large projects

---

## 📜 License

[MIT License](https://github.com/RyanBram/RPG-MV-Ace/blob/main/LICENSE)

<p align="center">
  <a href="https://www.patreon.com/c/projectmvace" target="_blank" rel="noopener noreferrer">
    <img src="https://raw.githubusercontent.com/RyanBram/RPG-MV-Ace/refs/heads/main/docs/img/ProjectAce%20Support.png" alt="Support Project Ace">
  </a>
</p>

## 🙏 Acknowledgments

This project builds upon the original RPG Maker MV engine created by:

- **Yoji Ojima (尾島陽児)**: Creator of the RPG Maker series
- **KADOKAWA CORPORATION**: Publisher and rights holder

Project Ace is an independent community project and is not affiliated with KADOKAWA CORPORATION. RPG Maker™ and RPG Maker MV™ are trademarks of KADOKAWA CORPORATION.