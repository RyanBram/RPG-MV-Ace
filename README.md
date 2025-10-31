# **RPG Maker MV Ace: The Community CoreScript**

![Banner](https://raw.githubusercontent.com/RyanBram/RPG-Maker-MV-Ace/refs/heads/master/docs/RPGMVAce.png)

## **🚀 Introduction**

**RPG Maker MV Ace** is a community-driven continuation and enhancement of the original **RPG Maker MV** core engine. It functions as a powerful HTML5 game engine specifically designed for 2D games, ensuring seamless deployment across **desktop, mobile, and browser** platforms.

RPG Maker is a legendary series with over 20 years of history, powering thousands of games. Ace is committed to improving the foundation of the modern, HTML5-based MV version.

## **💡 Project Mission**

This project is dedicated to collaboratively improving the **RPG Maker MV CoreScript** with the goal of providing a more robust, efficient, and well-maintained foundation for all game creators.

Recognizing that the RPG Maker MV ecosystem is heavily reliant on **community plugins**, the development of the Ace version prioritizes **minimizing breaking changes** to ensure backward compatibility and a smooth transition for existing projects.

## **💾 Releases & Usage**

We maintain three primary release branches for different user needs:

-   **Stable:** The official, well-tested version recommended for production use.
-   **RC (Release Candidate):** A version nearing stability, available for final testing before merging into Stable.
-   **Develop:** The latest, most active development version, suitable for testing new features and contributions.

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
-   **Governance:** This is a newly forming project. Development standards and major decisions are determined collaboratively through community discussion.

## **🗺️ Roadmap**

Development progresses according to the following plan. We are currently focusing on **Version 1.5**.

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

### **Version 1.5 (Current Focus)**

**Goal:** Major UI and Input Improvements.

-   Implement multilingual support.
-   Full multi-touch input support.
-   Ensure battle system compatibility with touch input.
-   Full touch compliance for basic menus (e.g., equipment screen).

### **Version 2.0**

**Goal:** Ace version.

-   Port to latest Pixi.
-   Supporting more platform (Electron, Tauri,etc)

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

This project is released under the [**MIT License**](http://opensource.org/licenses/MIT).
