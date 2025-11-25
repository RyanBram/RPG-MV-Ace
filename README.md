# **RPG Maker MV Ace: The Community CoreScript**

![Banner](https://raw.githubusercontent.com/RyanBram/RPG-MV-Ace/refs/heads/main/Project%20Ace.png)

Welcome to **Project Ace**!

RPG Maker MV was a revolutionary engine, bringing JavaScript and HTML5 to the forefront of indie game development. However, as technology races forward, its core has begun to show its age.

Project Ace is our answer.

This is not just a patch. It's a comprehensive, top-to-bottom modernization effort. We are forging a new path to ensure that the RMMV codebase remains relevant, powerful, and incredibly versatile for years to come. Our mission is to preserve the spirit of RMMV while infusing it with the performance and features of a modern game engine.

## The "Multi" Philosophy: Our Guiding Star

The "MV" in RPG Maker MV is often said to mean "Multi-View." We are taking this philosophy to its absolute extreme. Project Ace is built on a foundation of "Multi" principles, expanding the engine's capabilities in every conceivable direction.

---

## 🌟 Core Features 🌟

### 🚀 Multi-Renderer: Next-Generation Graphics

We are undertaking the massive effort of porting the engine core from Pixi.js v4 to the **Pixi.js v8**. This isn't just an update; it's a quantum leap.

By harnessing the power of **WebGPU**, Project Ace will unlock true native-speed graphics:

-   **DirectX 12** on Windows
-   **Metal** on macOS
-   **Vulkan** on Linux

For platforms that aren't quite there yet, the engine will seamlessly fall back to WebGL (OpenGL ES), ensuring your game runs everywhere. The result is unprecedented rendering performance and visual fidelity.

### 🖥️ Multi-Resolution: Your Game, Any Screen

Forget fixed resolutions and black bars. Project Ace introduces true **fluid scaling**, allowing your game to look sharp and perfectly adapt to a vast array of resolutions and aspect ratios.

Even better, the engine supports **instantaneous layout updates** when the game window is resized, creating a flawless, professional, and responsive experience for your players.

### 📦 Multi-Platform: Build & Deploy Everywhere

We're breaking free from the traditional build pipeline. Project Ace provides unparalleled flexibility by adding first-class support for modern desktop wrappers:

-   **ElectronJS:** The robust, industry-standard solution for feature-rich desktop apps.
-   **Tauri:** The future of lightweight apps. By leveraging the OS's _native webview engine_, Tauri can **dramatically reduce your game's final package size** (often by over 100MB!), making distribution a breeze.

### 🎵 Multi-Format: An Audio Powerhouse

Unleash your creativity with our custom **`rpg_mixer.js`** plugin. This revolutionary audio system dynamically loads backends _only when needed_, keeping your game's initial load light and fast.

Out of the box, we already support:

-   **MIDI (.mid, .rmi):** Beautifully rendered via the **SpessaSynth** backend.
-   **Tracker Music (.mod, .s3m, .xm, .it, .mptm, .mo3):** Flawless playback powered by the legendary **OpenMPT (libopenmpt)**.

The architecture is built for growth. Adding new audio formats is as simple as plugging in a new backend!

### 🌍 Multi-Language: Go Global, Effortlessly

Reach a worldwide audience with our integrated **`rpg_locale.js`** plugin. This isn't just a simple string replacer; it's a complete localization suite, supercharged by the **Translation Helper**.

-   **Auto-Extract:** Intelligently pulls all user-facing text from your game's `.json` database files.
-   **Automate & Edit:** Send text to machine translation services (like Google Translate or DeepL) for a quick first pass, then edit manually for quality.
-   **Built-in Tools:** Includes a local translator tool to assist your team's workflow. Localization has never been this streamlined.

### 🕹️ Multi-Input: Total Player Control

We've completely overhauled RMMV's input handling for a smoother, more intuitive experience on keyboard, mouse, and touch.

But the crown jewel is the **RPG Player**:

-   **A Universal HTML5 Player:** Embed your game on your website or game portal (like Itch.io or Newgrounds) with the same ease as a YouTube video!
-   **Full-Featured UI:** Includes standard controls (Play, Stop, Fullscreen), a volume slider, and on-screen **Virtual Buttons** for mobile web.
-   **Professional Polish:** Display a beautiful **Cover Art** image while the game loads, giving your players a premium experience from the very first click.

### 🧩 Multi-Genre: Expand the "RPG" term (Real Playable Game)

RPG Maker is no longer _just_ for RPGs. Project Ace will actively curate, adapt, and provide high-quality templates to kickstart your project in _any_ genre. Imagine building:

-   Visual Novels
-   Strategy RPGs (SRPGs)
-   Side-scrolling Platformers
-   Intense Bullet Hell (Danmaku)
-   Action RPGs (ARPGs)
-   Collectible Card Games
-   ...And so much more! The only limit is your imagination.

---

## **⚙️ Building the CoreScripts**

To compile the CoreScripts, you will need **Node.js** installed.

### **Build All Corescripts**

Change to the project's working directory and run the following commands:

npm install  
npm run build

The compiled CoreScripts will be available in the **dist** folder.

### **Individual Builds**

You can also build specific parts of the CoreScript individually:

npm run build:core  
npm run build:managers  
npm run build:objects  
npm run build:scenes  
npm run build:sprites  
npm run build:windows

### **Development Tasks**

We provide useful tasks for active development:

-   **npm run watch**: Watches for changes in js/rpg\_\*\*\* files, concatenates them, and copies the output to the ./game/js/ directory for immediate testing.
-   **npm start**: Starts a local development server, allowing you to test the CoreScripts in your browser at http://localhost:8080/.

### **Testing**

To run tests, place an RPG Maker MV project inside the **game/** folder, then execute:

npm test

## **🤝 How to Contribute**

We welcome contributors\! If you'd like to join the effort, please keep these guidelines in mind:

-   **Language:** All discussions, documentation, and code comments use **English** as the primary language.
-   **Code Standard:** To maintain maximum **plugin compatibility**, all CoreScript development is done using **ECMAScript 5 (ES5)**.
-   **Financial Support:** If you believe in our vision and wish to accelerate Project Ace's development, please consider offering financial support.

## **🗺️ Roadmap**

Development progresses according to the following plan. We are currently focusing on **Version 2.0 (MV Ace)**.

### **Version 1.0 (Completed)**

**Goal:** Establish the community development baseline.

-   Split the monolithic core script file.
-   Initial GitHub repository setup.
-   Publication of this roadmap.

### **Version 1.1 (Completed)**

**Goal:** Address Critical Engine and Compatibility Bugs.

-   Resolve persistent memory-related problems.
-   Implement pre-emptive reading/loading of image assets.
-   Resolve known sound issues specific to Google Chrome.
-   Fix previously identified bugs.

### **Version 1.2 (Completed)**

**Goal:** Improve Stability and Continuity.

-   Implement load error retry mechanisms to prevent soft-locks.
-   Develop a standard options plugin.
-   Introduce a robust Volume Change API.

### **Version 1.3 (Completed)**

**Goal:** Enhance Game Development Workflow.

-   Implement an Auto-Save feature.
-   Develop a simple plugin conflict detection system.
-   Create plugin development guidelines and sample code.
-   Refine the bug reporting process.

### **Version 1.4 (Completed)**

**Goal:** Optimize Performance and Loading Speed.

-   Introduce high-speed loading for audio sources.
-   Add a progress bar to the load screen.
-   Implement a lightweight save file format.

### **Version 1.5 (Completed)**

**Goal:** Major UI and Input Improvements.

-   Full multi-touch input support.
-   Ensure battle system compatibility with touch input.
-   Full touch compliance for basic menus (e.g., equipment screen).

### **Version 2.0 (Current Focus)**

**Goal:** Ace version (2.0) — "Ace" is a preservation and modernisation release celebrating 10 years of RPG Maker MV.

This release upgrades the rendering core to Pixi v7 (2025), modernizes rendering and layout, and expands platform and audio format support while keeping backward compatibility as a priority.

Highlights

-   Pixi v7 (2025): The engine now targets Pixi v7, aligning the CoreScript with current rendering standards and performance improvements.
-   Fluid Aspect Ratio: Automatic layout adjustments that adapt game UI and render scaling according to the window aspect ratio for better cross-device presentation.
-   Multi-format audio: Restored support for standard MIDI (via the spessasynth_lib backend) and added tracker module playback (MOD, S3M, XM, IT, MPTM, MO3) using libopenmpt.
-   Multi-language (i18n): Built-in i18n support via the `rpg_locale` plugin and a local translator helper that enables quick, offline rough translations for development and testing.
-   Multi-platform web player: An HTML web player target that brings web-first features (playback controls and telemetry-friendly playback similar to video players) to give authors more control over distribution and playback.

## Future Work

-   Multi-genre templates: Provide templates and building blocks for platformers, bullet-hell, visual novels, SRPG, and ARPG to accelerate genre-specific development.
-   Pixi v8 / WebGPU: Preparatory work and future porting plans to take advantage of WebGPU when Pixi v8 stabilizes.

Compatibility note: Ace is designed to preserve plugin compatibility and minimize breaking changes for existing RPG Maker MV projects. When upgrading, test projects and community plugins in a staging environment.

## **🏛️ CoreScript Architecture**

The CoreScript is compiled and output into six primary files:

-   **rpg_core.js**: Contains wrapper classes for **Pixi.js** and foundational classes for audio, input processing, and other core systems.
-   **rpg_managers.js**: Houses static classes (named XxxManager) responsible for overall game management.
-   **rpg_objects.js**: Defines classes (named Game_Xxx) that deal with game data. Most of these instances are serialized during game saving.
-   **rpg_scenes.js**: Contains classes (named Scene_Xxx) where the game scenes (like title, map, battle) are defined.
-   **rpg_sprites.js**: Includes classes (named Sprite_Xxx) related to image display and graphical processing.
-   **rpg_windows.js**: Defines classes (named Window_Xxx) that handle window display, drawing, and input.

Additionally, **\_plugins.js** defines the plugin list, and **\_main.js** is responsible for launching the game application.

## **🧬 Inheritance Style**

The engine uses a standard JavaScript prototype inheritance pattern for its class structure:

// In JavaScript, this function serves as the constructor  
function Derived() {  
 this.initialize.apply(this, arguments); // Delegate arguments to initialize()  
}

Derived.prototype \= Object.create(Base.prototype); // Derived inherits from Base  
Derived.prototype.constructor \= Derived;

Derived.prototype.initialize \= function () {  
 Base.prototype.initialize.call(this); // Properly calls the superclass's initialize method  
};

## **🌐 Global Game Variables**

The engine uses specific global variables for game data management:

-   **$dataXxx**: These read-only variables are loaded from the JSON files in the **data** folder (e.g., $dataMap, $dataItems). They are generated by the RPG Maker editor and remain **immutable** during gameplay.
-   **$gameXxx**: These are live instances of classes defined in **rpg_objects.js** (e.g., $gamePlayer, $gameState). When a game is saved, these objects (excluding $gameTemp, $gameMessage, and $gameTroop) are serialized to JSON. The engine handles the **prototype chain reconnection** during loading, allowing instance methods to be called immediately upon deserialization.

## **⚙️ Rendering and Execution Flow**

### **Scene Graph**

The engine utilizes the Pixi.js **Scene Graph**—a drawing tree structure—where children inherit positional and visibility attributes from their parents. You register elements using (scene or sprite or window).addChild(child).

-   **Scene:** A Scene_Xxx class is the root element of a scene graph, containing children like Sprites and Windows. The SceneManager manages the life cycle of scenes, running only one at a time.
-   **Scene Life Cycle:** new Scene_Xxx() \-\> create() \-\> start() \-\> update()\* \-\> stop() \-\> terminate()

### **Game Initialization**

1. The application starts by calling **SceneManager.run()** (\_main.js).
2. Core classes (Graphics, WebAudio, Input, TouchInput) are initialized.
3. **Scene_Boot** is set as the initial scene in the SceneManager.
4. SceneManager.update is registered with the browser's **requestAnimationFrame** loop.

### **Game Loop (Update)**

The requestAnimationFrame callback drives the game loop:

1. **SceneManager.update()** is called by the browser at its optimal rendering interval.
2. The current scene is processed at a stable **60 FPS** (or 1/60 second) according to the scene life cycle rules.
3. When a scene's Scene_Xxx.update() method is called:
    - It calls the update() method on all of its children.
    - Children recursively call update() on their own children, propagating the update logic down the graph.
4. The entire scene graph is then rendered to the screen.
5. SceneManager.update is re-registered for the next frame.

## **📝 License**

This project is released under the [**Apache License**](https://www.apache.org/licenses/LICENSE-2.0.txt).

<p align="center">
  <a href="https://www.patreon.com/c/projectmvace" target="_blank" rel="noopener noreferrer">
    <img src="https://raw.githubusercontent.com/RyanBram/RPG-MV-Ace/refs/heads/main/ProjectAce%20Support.png" alt="Support Us">
  </a>
</p>

## Acknowledgments & Special Thanks

Project Ace is a labor of love, built upon the incredible foundation laid by the original creators of RPG Maker MV. This project would not exist without their groundbreaking work.

We extend our deepest gratitude and respect to:

-   **Mr. Yoji Ojima (尾島陽児):** The legendary creator and visionary father of the RPG Maker series.
-   **KADOKAWA CORPORATION:** The publisher and company that stewards the RPG Maker legacy, bringing this powerful tool to creators across the world.

---

**Legal Disclaimer**

_Project Ace is an independent, community-driven project and is not affiliated with, authorized, endorsed by, or in any way officially connected with KADOKAWA CORPORATION._

_RPG Maker™, RPG Maker MV™, and all related names and trademarks are the property of KADOKAWA CORPORATION._
