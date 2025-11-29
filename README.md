# **RPG Maker MV Ace: The Community CoreScript**

![Banner](https://raw.githubusercontent.com/RyanBram/RPG-MV-Ace/refs/heads/main/docs/img/Project%20Ace.png)

[Wiki](https://github.com/RyanBram/RPG-MV-Ace/wiki)

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
![WebGPU](https://raw.githubusercontent.com/RyanBram/RPG-MV-Ace/refs/heads/main/docs/img/WebGPU.png)

For platforms that aren't quite there yet, the engine will seamlessly fall back to WebGL (OpenGL ES), ensuring your game runs everywhere. The result is unprecedented rendering performance and visual fidelity.

### 🖥️ Multi-Resolution: Your Game, Any Screen

Forget fixed resolutions and black bars. Project Ace introduces true **fluid scaling**, allowing your game to look sharp and perfectly adapt to a vast array of resolutions and aspect ratios.

Even better, the engine supports **instantaneous layout updates** when the game window is resized, creating a flawless, professional, and responsive experience for your players.

### 📦 Multi-Platform: Build & Deploy Everywhere
![Desktop](https://raw.githubusercontent.com/RyanBram/RPG-MV-Ace/2560fd38e57e15ffde2f4799754b8376ad8f9a9f/docs/img/Desktop_Logo.svg)

We're breaking free from the traditional build pipeline. Project Ace provides unparalleled flexibility by adding first-class support for modern desktop wrappers:

-   **ElectronJS:** The robust, industry-standard solution for feature-rich desktop apps.
-   **Tauri:** The future of lightweight apps. By leveraging the OS's _native webview engine_, Tauri can **dramatically reduce your game's final package size** (**Tauri is only 1 MB in size!**), making distribution a breeze.

### 🎵 Multi-Format: An Audio Powerhouse - [RPG Mixer](https://ryanbram.itch.io/rpg-mixer)

Unleash your creativity with our custom **`rpg_mixer.js`** plugin. This revolutionary audio system dynamically loads backends _only when needed_, keeping your game's initial load light and fast.

Out of the box, we already support:

-   **MIDI (.mid, .rmi):** Beautifully rendered via the **SpessaSynth** backend.
-   **Tracker Music (.mod, .s3m, .xm, .it, .mptm, .mo3):** Flawless playback powered by the legendary **OpenMPT (libopenmpt)**.

The architecture is built for growth. Adding new audio formats is as simple as plugging in a new backend!

### 🌍 Multi-Language: Go Global, Effortlessly - [RPG Locale](https://ryanbram.itch.io/rpg-locale)
![RPG Locale](https://img.itch.zone/aW1hZ2UvNDAwODA0MC8yMzkwMjExOS5wbmc=/original/I9wSyF.png)

Reach a worldwide audience with our integrated **`rpg_locale.js`** plugin. This isn't just a simple string replacer; it's a complete localization suite, supercharged by the **Translation Helper**.

-   **Auto-Extract:** Intelligently pulls all user-facing text from your game's `.json` database files.
-   **Automate & Edit:** Send text to machine translation services (like Google Translate or DeepL) for a quick first pass, then edit manually for quality.
-   **Built-in Tools:** Includes a local translator tool to assist your team's workflow. Localization has never been this streamlined.

### 🕹️ Multi-Input: Total Player Control - [RPG player](https://ryanbram.itch.io/rpg-player)
![RPG Player](https://img.itch.zone/aW1hZ2UvNDAwODA5OC8yMzkwMjMwMC5wbmc=/250x600/qKRy19.png) ![RPG Player](https://img.itch.zone/aW1hZ2UvNDAwODA5OC8yMzkwMjMwMS5wbmc=/250x600/wBb8u9.png)

We've completely overhauled RMMV's input handling for a smoother, more intuitive experience on keyboard, mouse, and touch.

But the crown jewel is the **RPG Player**:

-   **A Universal HTML5 Player:** Embed your game on your website or game portal (like Itch.io or Newgrounds) with the same ease as a YouTube video!
-   **Full-Featured UI:** Includes standard controls (Play, Stop, Fullscreen), a volume slider, and on-screen **Virtual Buttons** for mobile web.
-   **Professional Polish:** Display a beautiful **Cover Art** image while the game loads, giving your players a premium experience from the very first click.

### 🧩 Multi-Genre: Expand the "RPG" term (Real Playable Game)
![Danmaku_core](https://img.itch.zone/aW1nLzI0Mjk0Mzc4LmpwZw==/315x250%23c/hKYvEe.jpg) ![SRP_core](https://img.itch.zone/aW1nLzEwOTM2NjYxLnBuZw==/315x250%23c/iIG17t.png)

RPG Maker is no longer _just_ for RPGs. Project Ace will actively curate, adapt, and provide high-quality templates to kickstart your project in _any_ genre. Imagine building:

-   Visual Novels
-   [Strategy RPGs (SRPGs)](https://ryanbram.itch.io/srpg-engine-demo-v132q)
-   Side-scrolling Platformers
-   [Intense Bullet Hell (Danmaku)](https://ryanbram.itch.io/rpg-maker-mv-ace)
-   Action RPGs (ARPGs)
-   Collectible Card Games
-   ...And so much more! The only limit is your imagination.

---

## **⚙️ Building the CoreScripts**

To compile the CoreScripts, you will need **Node.js** installed.

### **Build All Corescripts**

Change to the project's working directory and run the following commands:
```
npm install  
npm run build
```
The compiled CoreScripts will be available in the **dist** folder.

### **Individual Builds**

You can also build specific parts of the CoreScript individually:
```
npm run build:core  
npm run build:managers  
npm run build:objects  
npm run build:scenes  
npm run build:sprites  
npm run build:windows
```
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
    <img src="https://raw.githubusercontent.com/RyanBram/RPG-MV-Ace/refs/heads/main/docs/img/ProjectAce%20Support.png" alt="Support Us">
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
