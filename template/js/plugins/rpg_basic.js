/*:
 * @plugindesc Basic plugin for manipulating important parameters.
 * @author RM CoreScript team
 *
 * @help
 * Basic plugin for manipulating important parameters.
 * There is no plugin command.
 *
 * Caching images improves performance but increases memory allocation.
 * On mobile devices, a lot of memory allocation causes the browser to crash.
 * Therefore, the upper limit of memory allocation is set with Cache Limit.
 *
 * If you want to regain high performance, just increase  Cache Limit.
 * There is no need to revert to 1.4.
 *
 * @param Rendering Mode
 * @type select
 * @option Auto
 * @option WebGPU
 * @option WebGL
 * @desc The rendering mode (Auto: WebGPU→WebGL fallback, WebGPU: Force WebGPU, WebGL: Force WebGL)
 * @default Auto
 *
 * @param Cache Limit
 * @type number
 * @desc The upper limit of images' cached size (MPixel)
 * @default 10
 *
 * @param Screen Width
 * @type number
 * @desc The resolution of screen width (1280 is recommended)
 * @default 960
 *
 * @param Screen Height
 * @type number
 * @desc The resolution of screen height (720 is recommended)
 * @default 720
 *
 * @param UI Area Width
 * @type number
 * @desc If set, change window width to this value
 * @default 832
 *
 * @param UI Area Height
 * @type number
 * @desc If set, change window height to this value
 * @default 624
 *
 * @param Battle Formation Placement
 * @type select
 * @option Adapt UI
 * @option Adapt Screen
 * @desc Set how actors and enemies are placed in battle formation
 * @default Adapt UI
 *
 * @param Always Dash
 * @type boolean
 * @desc The initial value whether the player always dashes (on/off)
 * @on ON
 * @off OFF
 * @default false
 *
 * @param Text Speed
 * @type number
 * @desc The text speed on "Show Text". The larger this parameter is, the slower text speed. (0: show all texts at once)
 * @default 1
 *
 * @param Auto Save File ID
 * @type number
 * @desc The file number to auto save when "Transfer Player" (0: off)
 * @default 0
 *
 * @param Error Message
 * @type string
 * @desc The message when error occurred
 * @default Error occurred. Please ask to the creator of this game.
 *
 * @param Show Error Detail
 * @type boolean
 * @desc Show where the error is caused and stack trace when error
 * @default true
 *
 * @param Enable Progress Bar
 * @type boolean
 * @desc Show progress bar when it takes a long time to load resources
 * @default true
 *
 * @param Max Rendering FPS
 * @type number
 * @desc The maximum value of rendering frame per seconds (0: unlimited)
 * @default 0
 *
 * @param ---Full Screen & Exit---
 *
 * @param Default Full Screen
 * @type boolean
 * @desc If set to ON, the game will start in full screen mode.
 * @on ON
 * @off OFF
 * @default false
 *
 * @param Full Screen Option Name
 * @type string
 * @desc The text for the full screen option in the Options menu.
 * @default Full Screen
 *
 * @param Add Shutdown to Title
 * @type boolean
 * @desc If set to ON, adds a "Shutdown" command to the title screen.
 * @on ON
 * @off OFF
 * @default true
 *
 * @param Shutdown Command Name
 * @type string
 * @desc The text for the Shutdown command.
 * @default Shutdown
 *
 * @param Add Shutdown to Game End
 * @type boolean
 * @desc If set to ON, adds a "Shutdown" command to the game end screen.
 * @on ON
 * @off OFF
 * @default true
 */

(function () {
  "use strict";
  var pluginName = "rpg_basic";

  //=============================================================================
  // Local Function
  //  This function formats and checks plugin parameters and plugin command parameters.
  //=============================================================================

  // This function convert string to number
  function isNumber(str) {
    return !!str && !isNaN(str);
  }

  function toNumber(str, def) {
    return isNumber(str) ? +str : def;
  }

  // This function use plugin name as parameters
  var getFileName = function (scriptElement) {
    var path = scriptElement.src;
    var filename = path.split("/").pop();
    return filename.split(".").shift();
  };

  // Use document.currentScript for getting recent script
  var currentScript =
    document.currentScript ||
    (function () {
      var scripts = document.getElementsByTagName("script");
      return scripts[scripts.length - 1];
    })();

  var currentFileName = getFileName(currentScript);

  //-----------------------------------------------------------------------------

  //=============================================================================
  // Getting and Formatting Parameters
  //=============================================================================

  // Inserting plugin file name as parameters
  // var parameters = PluginManager.parameters(currentFileName);
  var parameters = PluginManager.parameters(pluginName);

  // var paramCacheLimit = toNumber(parameters["Cache Limit"], 10);
  var paramScreenWidth = toNumber(parameters["Screen Width"], 1280);
  var paramScreenHeight = toNumber(parameters["Screen Height"], 720);
  var paramRenderingMode = parameters["Rendering Mode"].toLowerCase();
  var paramBattleFormationPlacement =
    parameters["Battle Formation Placement"].toLowerCase();
  var paramAlwaysDash =
    parameters["Always Dash"] === "true" || parameters["Always Dash"] === "on";
  var paramTextSpeed = toNumber(parameters["Text Speed"], 1);
  var paramWindowWidth = toNumber(parameters["UI Area Width"], 832);
  var paramWindowHeight = toNumber(parameters["UI Area Height"], 624);
  var paramMaxRenderingFps = toNumber(parameters["Max Rendering FPS"], 0);
  var paramAutoSaveFileId = toNumber(parameters["Auto Save File ID"], 0);
  var paramErrorMessage = parameters["Error Message"];
  var paramShowErrorDetail = parameters["Show Error Detail"] === "true";
  var paramEnableProgressBar = parameters["Enable Progress Bar"] === "true";
  var paramDefaultFullScreen = parameters["Default Full Screen"] === "true";
  var paramFullScreenOptionName =
    parameters["Full Screen Option Name"] || "Full Screen";
  var paramAddShutdownToTitle = parameters["Add Shutdown to Title"] === "true";
  var paramShutdownCommandName =
    parameters["Shutdown Command Name"] || "Shutdown";
  var paramAddShutdownToGameEnd =
    parameters["Add Shutdown to Game End"] === "true";

  //-----------------------------------------------------------------------------

  //=============================================================================
  // Plugin Content
  //   rpg_core.js
  //   rpg_managers.js
  //   rpg_objects.js
  //   rpg_scenes.js
  //   rpg_sprites.js
  //   rpg_windows.js
  //=============================================================================

  function adjustRatio() {
    const aspectRatio = window.innerWidth / window.innerHeight;
    let screenWidth;
    const screenHeight = paramScreenHeight;

    // The logic is now dynamic for both mobile and desktop
    screenWidth = Math.round(screenHeight * aspectRatio);

    // Ensure minimum width is not smaller than the default screen width from parameters
    if (screenWidth < paramScreenWidth) {
      screenWidth = paramScreenWidth;
    }

    let windowWidth = paramWindowWidth;
    let windowHeight = paramWindowHeight;

    // Set the new dimensions for SceneManager and Graphics
    //SceneManager._screenWidth = screenWidth;
    //SceneManager._screenHeight = screenHeight;
    SceneManager._boxWidth = windowWidth;
    SceneManager._boxHeight = windowHeight;

    Graphics.width = screenWidth;
    Graphics.height = screenHeight;

    // [FIX] Use the MV-compatible method to resize the renderer
    if (Graphics._renderer) {
      Graphics._renderer.resize(screenWidth, screenHeight);
    }

    Graphics._updateAllElements();

    // [MODIFIKASI] Ganti refresh Scene_Title dengan
    // pemanggilan Layout Update yang universal
    if (SceneManager._scene) {
      SceneManager._scene.requestLayoutUpdate();
    }
  }

  // Add resize event listener
  window.addEventListener("resize", adjustRatio);

  //=============================================================================
  // Original Plugin Content (with necessary initial setup)
  //=============================================================================

  // ImageCache.limit = paramCacheLimit * 1000 * 1000;

  // The initial setup is now handled by adjustRatio, but we set a default
  SceneManager._screenWidth = paramScreenWidth;
  SceneManager._screenHeight = paramScreenHeight;
  SceneManager._boxWidth = paramWindowWidth;
  SceneManager._boxHeight = paramWindowHeight;

  //.Graphics.setErrorMessage(paramErrorMessage);
  //.Graphics.setShowErrorDetail(paramShowErrorDetail);
  //.Graphics.setProgressEnabled(paramEnableProgressBar);

  // [NEW from StartUpFullScreen] - Graphics FullScreen Request
  Graphics.requestFullScreen = function () {
    if (this._isFullScreen()) return;
    this._requestFullScreen();
  };

  // 2633 - Make game screen always start in fit mode, can be toggled by F3 (1/1)
  Graphics._defaultStretchMode = function () {
    return true;
  };

  // 3036 - Change Gamepad default button to more common layout
  Input.gamepadMapper = {
    0: "ok", // A
    1: "shift", // B
    2: "tab", // X
    3: "escape", // Y
    4: "pageup", // LB
    5: "pagedown", // RB
    12: "up", // D-pad up
    13: "down", // D-pad down
    14: "left", // D-pad left
    15: "right", // D-pad right
  };

  //-----------------------------------------------------------------------------

  //===========================[ rpg_managers.js ]===============================

  // 464
  //.DataManager.setAutoSaveFileId(paramAutoSaveFileId);

  // 562
  var _ConfigManager_applyData = ConfigManager.applyData;
  ConfigManager.applyData = function (config) {
    _ConfigManager_applyData.apply(this, arguments);
    if (config["paramAlwaysDash"] === undefined) {
      this.paramAlwaysDash = paramAlwaysDash;
    }
  };

  ConfigManager.startUpFullScreen = paramDefaultFullScreen;

  var _ConfigManager_makeData = ConfigManager.makeData;
  ConfigManager.makeData = function () {
    var config = _ConfigManager_makeData.apply(this, arguments);
    config.startUpFullScreen = this.startUpFullScreen;
    return config;
  };

  var _ConfigManager_applyData_FullScreen = ConfigManager.applyData;
  ConfigManager.applyData = function (config) {
    _ConfigManager_applyData_FullScreen.apply(this, arguments);
    this.startUpFullScreen = this.readFlag(
      config,
      "startUpFullScreen",
      paramDefaultFullScreen,
    );
  };

  // 1908
  SceneManager.preferableRendererType = function () {
    // URL parameter overrides plugin settings
    if (Utils.isOptionValid("webgl")) {
      return "webgl";
    } else if (Utils.isOptionValid("webgpu")) {
      return "webgpu";
    } else if (paramRenderingMode === "webgl") {
      return "webgl";
    } else if (paramRenderingMode === "webgpu") {
      return "webgpu";
    } else {
      // Auto mode - let PIXI decide (prioritizes WebGPU, then WebGL)
      return "auto";
    }
  };

  // 1946 - Adjust application screen to match game screen resolution (1/1)
  var _SceneManager_initNwjs = SceneManager.initNwjs;
  SceneManager.initNwjs = function () {
    _SceneManager_initNwjs.apply(this, arguments);
    // [FIX] Use parameter variables instead of dynamic ones
    if (Utils.isDesktop() && paramScreenWidth && paramScreenHeight) {
      var dw = paramScreenWidth - window.innerWidth;
      var dh = paramScreenHeight - window.innerHeight;
      window.moveBy(-dw / 2, -dh / 2);
      window.resizeBy(dw, dh);
    }
  };
  // 2120
  if (paramMaxRenderingFps) {
    var currentTime = Date.now();
    var deltaTime = 1000 / paramMaxRenderingFps;
    var accumulator = 0;
    var _SceneManager_renderScene = SceneManager.renderScene;
    SceneManager.renderScene = function () {
      var newTime = Date.now();
      accumulator += newTime - currentTime;
      currentTime = newTime;
      if (accumulator >= deltaTime) {
        accumulator -= deltaTime;
        _SceneManager_renderScene.apply(this, arguments);
      }
    };
  }
  //-----------------------------------------------------------------------------

  //===========================[ rpg_objects.js ]================================

  // 5250 - Adjust Enemies Home placement automatically (1/1)
  //* New formula (toggleable between not centered/centered)
  var _Game_Troop_setup = Game_Troop.prototype.setup;
  Game_Troop.prototype.setup = function (troopId) {
    if ($gameSystem.isSideView()) {
      this.clear();
      this._troopId = troopId;
      this._enemies = [];
      var members = this.troop().members;
      var offsetX = (Graphics.width - Graphics.boxWidth) / 2;
      var spaceX = 32; // adjust this value to change the horizontal space between actors
      var spaceY = 48; // adjust this value to change the vertical space between actors
      if (paramBattleFormationPlacement === "adapt ui") {
        var screenWidth = (Graphics.boxWidth * 1) / 4 + offsetX; // follow UI Width
      } else {
        var screenWidth = (Graphics.width * 1) / 4; // follow Screen Width
      }
      var screenHeight = Graphics.height;
      var maxMembers = members.length;
      var startY =
        ((screenHeight - (maxMembers - 1) * spaceY) * 2) / 4 + spaceY * 1.5; // centered
      //.var startY =screenHeight * 2/4;                                           // not centered
      members.forEach(function (member, index) {
        if ($dataEnemies[member.enemyId]) {
          var enemyId = member.enemyId;
          var enemyHomeX = screenWidth /*+ maxMembers * 32*/ - index * spaceX;
          var enemyHomeY = startY + index * spaceY;
          var enemy = new Game_Enemy(enemyId, enemyHomeX, enemyHomeY);
          if (member.hidden) {
            enemy.hide();
          }
          this._enemies.push(enemy);
        }
      }, this);
      this.makeUniqueNames();
    } else {
      _Game_Troop_setup.call(this, troopId);
    }
  };
  //-----------------------------------------------------------------------------

  //===========================[ rpg_scenes.js ]=================================
  // Call adjustRatio on game start
  const _Scene_Boot_start = Scene_Boot.prototype.start;
  Scene_Boot.prototype.start = function () {
    _Scene_Boot_start.apply(this, arguments);
    adjustRatio(); // Panggil ini *setelah* scene boot selesai
    // Only run on Desktop and if not in event test mode
    if (
      Utils.isDesktop() &&
      ConfigManager.startUpFullScreen &&
      !DataManager.isEventTest()
    ) {
      Graphics.requestFullScreen();
    }
  };

  // [BARU] Fungsi untuk memposisikan ulang WindowLayer (lapisan UI)
  Scene_Base.prototype.updateWindowLayerPosition = function () {
    if (this._windowLayer) {
      var x = (Graphics.width - Graphics.boxWidth) / 2;
      var y = (Graphics.height - Graphics.boxHeight) / 2;
      this._windowLayer.move(x, y);
    }
  };

  // [BARU] Fungsi dasar untuk memperbarui tata letak
  Scene_Base.prototype.requestLayoutUpdate = function () {
    this.updateWindowLayerPosition();

    // Teruskan permintaan ke spriteset jika ada
    if (this._spriteset) {
      this._spriteset.requestLayoutUpdate();
    }
  };

  // [MODIFIKASI] Pastikan posisi WindowLayer juga diatur saat dibuat
  var _Scene_Base_createWindowLayer = Scene_Base.prototype.createWindowLayer;
  Scene_Base.prototype.createWindowLayer = function () {
    _Scene_Base_createWindowLayer.call(this);
    // Panggil fungsi baru kita untuk mengatur posisi awal
    this.updateWindowLayerPosition();
  };

  // [NEW from StartUpFullScreen] - Add Shutdown command to Title Screen
  if (paramAddShutdownToTitle && Utils.isDesktop()) {
    var _Scene_Title_createCommandWindow =
      Scene_Title.prototype.createCommandWindow;
    Scene_Title.prototype.createCommandWindow = function () {
      _Scene_Title_createCommandWindow.apply(this, arguments);
      this._commandWindow.setHandler(
        "shutdown",
        this.commandShutdown.bind(this),
      );
    };

    Scene_Title.prototype.commandShutdown = function () {
      this._commandWindow.close();
      this.fadeOutAll();
      SceneManager.goto(Scene_Terminate);
    };
  }

  // [NEW from StartUpFullScreen] - Add Shutdown command to Game End Screen
  if (paramAddShutdownToGameEnd && Utils.isDesktop()) {
    var _Scene_GameEnd_createCommandWindow =
      Scene_GameEnd.prototype.createCommandWindow;
    Scene_GameEnd.prototype.createCommandWindow = function () {
      _Scene_GameEnd_createCommandWindow.apply(this, arguments);
      this._commandWindow.setHandler(
        "shutdown",
        this.commandShutdown.bind(this),
      );
    };

    Scene_GameEnd.prototype.commandShutdown = function () {
      this._commandWindow.close();
      this.fadeOutAll();
      SceneManager.goto(Scene_Terminate);
    };
  }

  // [NEW from StartUpFullScreen] - Scene_Terminate for exiting the game
  function Scene_Terminate() {
    this.initialize.apply(this, arguments);
  }

  Scene_Terminate.prototype = Object.create(Scene_Base.prototype);
  Scene_Terminate.prototype.constructor = Scene_Terminate;

  Scene_Terminate.prototype.start = function () {
    // For Tauri, call the exit_app command to properly terminate
    if (Utils.isTauri()) {
      window.__TAURI__.core.invoke("exit_app").catch(function (err) {
        console.error("Failed to exit:", err);
        // Fallback to SceneManager terminate
        SceneManager.terminate();
      });
    } else {
      // For NW.js/Electron/Browser
      SceneManager.terminate();
    }
  };

  // 443 - Adjusting Title Background size based on screen resolution (1/2)
  Scene_Title.prototype.start = function () {
    Scene_Base.prototype.start.call(this);
    SceneManager.clearStack();
    this.centerSprite(this._backSprite1, true); // pass true to crop the image
    this.centerSprite(this._backSprite2, false); // pass false to stretch the image
    this.playTitleMusic();
    this.startFadeIn(this.fadeSpeed(), false);
  };

  // 494 - Adjusting Title Background size based on screen resolution (2/2)
  Scene_Title.prototype.centerSprite = function (sprite, keepRatio = true) {
    sprite.x = Graphics.width / 2;
    sprite.y = Graphics.height / 2;
    sprite.anchor.x = 0.5;
    sprite.anchor.y = 0.5;
    var scaleX = Graphics.width / sprite.bitmap.width;
    var scaleY = Graphics.height / sprite.bitmap.height;
    if (keepRatio) {
      sprite.scale.x = Math.max(scaleX, scaleY);
      sprite.scale.y = Math.max(scaleX, scaleY);
    } else {
      sprite.scale.x = scaleX;
      sprite.scale.y = scaleY;
    }
  };

  // [BARU] Scene_Title perlu melakukan update tambahan untuk background
  var _Scene_Title_requestLayoutUpdate =
    Scene_Base.prototype.requestLayoutUpdate;
  Scene_Title.prototype.requestLayoutUpdate = function () {
    _Scene_Title_requestLayoutUpdate.call(this); // Jalankan update dasar (WindowLayer)

    // Panggil kembali fungsi centering sprite dari plugin Anda
    if (this._backSprite1) {
      this.centerSprite(this._backSprite1, true);
    }
    if (this._backSprite2) {
      this.centerSprite(this._backSprite2, false);
    }

    // [FIX] Tambahan untuk menggambar ulang judul game
    if (this._gameTitleSprite && $dataSystem.optDrawTitle) {
      // 1. Buat bitmap baru dengan ukuran yang sudah diupdate
      //    (Bitmap lama akan otomatis di-garbage collect)
      this._gameTitleSprite.bitmap = new Bitmap(
        Graphics.width,
        Graphics.height,
      );

      // 2. Panggil fungsi drawGameTitle (dari rpg_scenes.js)
      //    untuk menggambar di bitmap baru. Fungsi ini akan
      //    otomatis menggunakan Graphics.width/height yang baru.
      this.drawGameTitle();
    }
  };

  // ============================================================================
  // [PERBAIKAN] Tambahkan fungsi requestLayoutUpdate ke Scene_Map
  // ============================================================================
  // Fungsi ini akan dipanggil oleh plugin Community_Basic.js saat
  // mendeteksi perubahan ukuran layar (resize).
  Scene_Map.prototype.requestLayoutUpdate = function () {
    // 1. Panggil fungsi update layout dasar dari Scene_Base.
    //    (Plugin Community_Basic.js Anda telah mendefinisikan fungsi ini
    //    di Scene_Base untuk meng-update posisi window/UI).
    if (Scene_Base.prototype.requestLayoutUpdate) {
      Scene_Base.prototype.requestLayoutUpdate.call(this);
    }

    // 2. [FIX] Hancurkan dan buat ulang spriteset.
    //    Ini adalah inti perbaikan, meniru perilaku "buka/tutup menu"
    //    yang Anda identifikasi.
    if (this._spriteset) {
      this.removeChild(this._spriteset);
    }

    // 3. Panggil fungsi createSpriteset (dari baris 601 di atas)
    //    untuk membuat spriteset baru dengan ukuran yang sudah benar.
    this.createSpriteset();
  };
  // ============================================================================
  // [AKHIR PERBAIKAN]
  // ============================================================================

  // Scene_MenuBase perlu update scaling background snapshot-nya
  var _Scene_MenuBase_requestLayoutUpdate =
    Scene_MenuBase.prototype.requestLayoutUpdate ||
    Scene_Base.prototype.requestLayoutUpdate;
  Scene_MenuBase.prototype.requestLayoutUpdate = function () {
    _Scene_MenuBase_requestLayoutUpdate.call(this); // Jalankan update dasar (WindowLayer)

    if (this._backgroundSprite) {
      // Center and scale the snapshot sprite
      this._backgroundSprite.x = Graphics.width / 2;
      this._backgroundSprite.y = Graphics.height / 2;
      this._backgroundSprite.anchor.x = 0.5;
      this._backgroundSprite.anchor.y = 0.5;

      var scaleX = Graphics.width / this._backgroundSprite.bitmap.width;
      var scaleY = Graphics.height / this._backgroundSprite.bitmap.height;
      // Gunakan "cover" scaling (Math.max) agar menutupi seluruh layar
      this._backgroundSprite.scale.x = Math.max(scaleX, scaleY);
      this._backgroundSprite.scale.y = Math.max(scaleX, scaleY);
    }
  };

  // [FIX] Panggil layout update saat Scene_Battle dimulai
  var _Scene_Battle_start = Scene_Battle.prototype.start;
  Scene_Battle.prototype.start = function () {
    _Scene_Battle_start.apply(this, arguments);
    // Panggil fungsi update layout kita secara manual
    // untuk memastikan posisi awal sudah benar
    this.requestLayoutUpdate();
  };

  //-----------------------------------------------------------------------------

  //===========================[ rpg_sprites.js ]================================

  // Ganti ini di rpg_sprites.js atau plugin Anda
  Spriteset_Battle.prototype.createBattleField = function () {
    var width = Graphics.width; // Ubah ke Graphics.width
    var height = Graphics.height; // Ubah ke Graphics.height
    var x = 0; // Ubah ke 0
    var y = 0; // Ubah ke 0
    this._battleField = new Sprite();
    this._battleField.setFrame(x, y, width, height);
    this._battleField.x = x;
    this._battleField.y = y;
    this._baseSprite.addChild(this._battleField);
  };

  // 731 - Adjust Actor Home to match screen resolution (1/1)
  //* New formula (toggleable between not centered/centered)
  Sprite_Actor.prototype.setActorHome = function (index) {
    var offsetX = (Graphics.width - Graphics.boxWidth) / 2;
    var spaceX = 32; // adjust this value to change the horizontal space between actors
    var spaceY = 48; // adjust this value to change the vertical space between actors
    if (paramBattleFormationPlacement === "adapt ui") {
      var screenWidth = (Graphics.boxWidth * 3) / 4 + offsetX;
    } else {
      var screenWidth = (Graphics.width * 3) / 4;
    }
    var screenHeight = Graphics.height;
    var actorsCount = $gameParty.battleMembers().length; // get the number of actors
    // Calculate the starting y-coordinate based on the number of actors
    var startY =
      ((screenHeight - (actorsCount - 1) * spaceY) * 2) / 4 + spaceY * 1.5; // centered
    //.var startY =screenHeight * 2/4;                                             // not centered
    var homeX = screenWidth + index * spaceX;
    var homeY = startY + index * spaceY;
    this.setHome(homeX, homeY);
    //this.moveToStartPosition();
  };

  //Sprite_Actor.prototype.moveToStartPosition = function() {
  //};
  /**/

  //* [BARU] Fungsi untuk set/mengupdate posisi home musuh
  Sprite_Enemy.prototype.setEnemyHome = function (index) {
    // Logika ini diambil dari Game_Troop.prototype.setup
    // untuk memastikan perhitungan konsisten

    var offsetX = (Graphics.width - Graphics.boxWidth) / 2;
    var spaceX = 32; // sesuaikan nilai ini
    var spaceY = 48; // sesuaikan nilai ini

    // paramBattleFormationPlacement adalah variabel global dari plugin ini
    if (paramBattleFormationPlacement === "adapt ui") {
      var screenWidth = (Graphics.boxWidth * 1) / 4 + offsetX; // follow UI Width
    } else {
      var screenWidth = (Graphics.width * 1) / 4; // follow Screen Width
    }

    var screenHeight = Graphics.height;
    var maxMembers = $gameTroop.members().length;
    var startY =
      ((screenHeight - (maxMembers - 1) * spaceY) * 2) / 4 + spaceY * 1.5; // centered

    var enemyHomeX = screenWidth - index * spaceX;
    var enemyHomeY = startY + index * spaceY;

    // Panggil fungsi setHome dari Sprite_Battler (rpg_sprites.js)
    this.setHome(enemyHomeX, enemyHomeY);

    // [PENTING] Update juga data di Game_Enemy agar konsisten
    if (this._enemy) {
      this._enemy._screenX = enemyHomeX;
      this._enemy._screenY = enemyHomeY;
    }
  };

  //* 2182 - [BUG] Ensuring Picture is always centered even if screen resolution changes (1/1)
  Spriteset_Base.prototype.createPictures = function () {
    var width = Graphics.width;
    var height = Graphics.height;
    var x = 0;
    var y = 0;
    this._pictureContainer = new Sprite();
    this._pictureContainer.setFrame(x, y, width, height);
    for (var i = 1; i <= $gameScreen.maxPictures(); i++) {
      this._pictureContainer.addChild(new Sprite_Picture(i));
    }
    this.addChild(this._pictureContainer);
  };
  /**/

  // [BARU] Fungsi dasar untuk memperbarui tata letak spriteset
  Spriteset_Base.prototype.requestLayoutUpdate = function () {
    if (this._pictureContainer) {
      // Perbarui frame container gambar sesuai plugin Anda
      this._pictureContainer.setFrame(0, 0, Graphics.width, Graphics.height);
    }
  };

  // [BARU] Spriteset_Map perlu update tilemap
  // (Kita asumsikan Spriteset_Map mewarisi dari Spriteset_Base)
  var _Spriteset_Map_requestLayoutUpdate =
    Spriteset_Map.prototype.requestLayoutUpdate ||
    Spriteset_Base.prototype.requestLayoutUpdate;
  Spriteset_Map.prototype.requestLayoutUpdate = function () {
    _Spriteset_Map_requestLayoutUpdate.call(this); // Jalankan update dasar (Pictures)

    // Perbarui ukuran tilemap
    if (this._tilemap) {
      this._tilemap.width = Graphics.width;
      this._tilemap.height = Graphics.height;
    }
  };

  // [NEW] - Making batteback scaled and centered based on screen resolution (1/6)
  // Sprite_Battleback -
  function Sprite_Battleback() {
    this.initialize.apply(this, arguments);
  }

  Sprite_Battleback.prototype = Object.create(Sprite.prototype);
  Sprite_Battleback.prototype.constructor = Sprite_Battleback;

  // [NEW] - Making batteback scaled and centered based on screen resolution (2/6)
  Sprite_Battleback.prototype.initialize = function (bitmapName, type) {
    Sprite.prototype.initialize.call(this);
    this._bitmapName = bitmapName;
    this._battlebackType = type;
    this.createBitmap();
  };

  // [NEW] - Making batteback scaled and centered based on screen resolution (3/6)
  Sprite_Battleback.prototype.createBitmap = function () {
    if (this._bitmapName === "") {
      this.bitmap = new Bitmap(Graphics.width, Graphics.height);
    } else {
      if (this._battlebackType === 1) {
        this.bitmap = ImageManager.loadBattleback1(this._bitmapName);
      } else {
        this.bitmap = ImageManager.loadBattleback2(this._bitmapName);
      }
      // [MODIFIKASI] Panggil scaleSprite setelah bitmap dimuat
      this.bitmap.addLoadListener(this.scaleSprite.bind(this));
    }
  };

  // [NEW] - Making batteback scaled and centered based on screen resolution (4/6)
  Sprite_Battleback.prototype.scaleSprite = function () {
    // [MODIFIKASI] Hapus pengecekan 'width <= 0' dan logika timeout,
    // karena ini sekarang dipanggil oleh load listener.
    var width = Graphics.width;
    var height = Graphics.height;

    // Reset scale dulu untuk perhitungan yang benar
    this.scale.x = 1.0;
    this.scale.y = 1.0;

    if (this.bitmap.width < width) {
      this.scale.x = width / this.bitmap.width;
    }
    if (this.bitmap.height < height) {
      this.scale.y = height / this.bitmap.height;
    }

    // [MODIFIKASI] Terapkan skala "cover" (seperti di Scene_Title)
    this.scale.x = Math.max(this.scale.x, this.scale.y);
    this.scale.y = Math.max(this.scale.x, this.scale.y);

    this.anchor.x = 0.5;
    this.x = Graphics.width / 2;
    if ($gameSystem.isSideView()) {
      this.anchor.y = 1;
      this.y = Graphics.height;
    } else {
      this.anchor.y = 0.5;
      this.y = Graphics.height / 2;
    }
  };

  // 2469 - Making batteback scaled and centered based on screen resolution (5/6)
  Spriteset_Battle.prototype.createBattleback = function () {
    this._back1Sprite = new Sprite_Battleback(this.battleback1Name(), 1);
    this._back2Sprite = new Sprite_Battleback(this.battleback2Name(), 2);
    this._battleField.addChild(this._back1Sprite);
    this._battleField.addChild(this._back2Sprite);
  };

  // 2485 - Making batteback scaled and centered based on screen resolution (6/6)
  Spriteset_Battle.prototype.updateBattleback = function () {};

  // [BARU] Spriteset_Battle perlu update battleback dan aktor
  var _Spriteset_Battle_requestLayoutUpdate =
    Spriteset_Battle.prototype.requestLayoutUpdate ||
    Spriteset_Base.prototype.requestLayoutUpdate;
  Spriteset_Battle.prototype.requestLayoutUpdate = function () {
    _Spriteset_Battle_requestLayoutUpdate.call(this); // Jalankan update dasar (Pictures)

    // [FIX] Update ukuran battleField agar sesuai layar
    if (this._battleField) {
      this._battleField.setFrame(0, 0, Graphics.width, Graphics.height);
    }

    // 1. Skalakan ulang battlebacks
    if (this._back1Sprite) {
      this._back1Sprite.scaleSprite();
    }
    if (this._back2Sprite) {
      this._back2Sprite.scaleSprite();
    }

    // Hitung offset UI
    var x_offset = (Graphics.width - Graphics.boxWidth) / 2;
    var y_offset = (Graphics.height - Graphics.boxHeight) / 2;

    if ($gameSystem.isSideView()) {
      // --- LOGIKA SIDE-VIEW ---
      // Kalkulasi dari plugin Anda sudah menggunakan Graphics.width,
      // jadi kita panggil saja.

      // 2. Posisikan ulang Aktor (Side-View)
      if (this._actorSprites) {
        this._actorSprites.forEach(function (sprite, index) {
          sprite.setActorHome(index);
        });
      }

      // 3. Posisikan ulang Musuh (Side-View)
      if (this._enemySprites) {
        this._enemySprites.forEach(function (sprite) {
          if (sprite._enemy) {
            var enemyIndex = sprite._enemy.index();
            if (enemyIndex >= 0) {
              sprite.setEnemyHome(enemyIndex);
            }
          }
        });
      }
    } else {
      // --- LOGIKA FRONT-VIEW ---

      // 2. Posisikan ulang Aktor (Front-View)
      if (this._actorSprites) {
        this._actorSprites.forEach(function (sprite, index) {
          // Posisi asli (relatif 816x624) + offset UI
          sprite.setHome(
            600 + index * 32 + x_offset,
            280 + index * 48 + y_offset,
          );
        });
      }

      // 3. Posisikan ulang Musuh (Front-View)
      if (this._enemySprites) {
        this._enemySprites.forEach(function (sprite) {
          // Posisi editor (relatif 816x624) + offset UI
          if (sprite._enemy) {
            sprite.setHome(
              sprite._enemy.screenX() + x_offset,
              sprite._enemy.screenY() + y_offset,
            );
          }
        });
      }
    }
  };

  //-----------------------------------------------------------------------------

  //===========================[ rpg_windows.js ]================================

  // 2836
  /*
    Window_SavefileList.prototype.drawFileId = function(id, x, y) {
        if (id === 1) {
            this.drawText('Autosave', x, y, 180);
        } else {
            this.drawText(TextManager.file + ' ' + (id - 1), x, y, 180);
        }
    };
*/

  // [NEW from StartUpFullScreen] - Add Shutdown to Title Command Window
  if (paramAddShutdownToTitle && Utils.isDesktop()) {
    var _Window_TitleCommand_makeCommandList =
      Window_TitleCommand.prototype.makeCommandList;
    Window_TitleCommand.prototype.makeCommandList = function () {
      _Window_TitleCommand_makeCommandList.apply(this, arguments);
      this.addCommand(paramShutdownCommandName, "shutdown");
    };
  }

  // [NEW from StartUpFullScreen] - Add Shutdown to Game End Command Window
  if (paramAddShutdownToGameEnd && Utils.isDesktop()) {
    var _Window_GameEnd_makeCommandList =
      Window_GameEnd.prototype.makeCommandList;
    Window_GameEnd.prototype.makeCommandList = function () {
      _Window_GameEnd_makeCommandList.apply(this, arguments);
      this.addCommand(paramShutdownCommandName, "shutdown");
      // This line reorders the commands to place Shutdown correctly
      this._list.splice(this._list.length - 2, 0, this._list.pop());
    };
  }

  // [NEW from StartUpFullScreen] - Add FullScreen option to Options Window
  if (Utils.isDesktop()) {
    var _Window_Options_addGeneralOptions =
      Window_Options.prototype.addGeneralOptions;
    Window_Options.prototype.addGeneralOptions = function () {
      _Window_Options_addGeneralOptions.apply(this, arguments);
      this.addCommand(paramFullScreenOptionName, "startUpFullScreen");
    };

    var _Window_Options_processOk = Window_Options.prototype.processOk;
    Window_Options.prototype.processOk = function () {
      var index = this.index();
      var symbol = this.commandSymbol(index);
      if (symbol === "startUpFullScreen") {
        var value = this.getConfigValue(symbol);
        this.changeValue(symbol, !value);
        if (!value) {
          Graphics.requestFullScreen();
        } else {
          Graphics._cancelFullScreen();
        }
      } else {
        _Window_Options_processOk.apply(this, arguments);
      }
    };

    // --- F4 Key Synchronization Fix ---
    function syncFullScreenStatus() {
      var isFullScreen = Graphics._isFullScreen();
      if (ConfigManager.startUpFullScreen !== isFullScreen) {
        ConfigManager.startUpFullScreen = isFullScreen;
      }
    }
    document.addEventListener("fullscreenchange", syncFullScreenStatus);
    document.addEventListener("webkitfullscreenchange", syncFullScreenStatus);
    document.addEventListener("mozfullscreenchange", syncFullScreenStatus);
    document.addEventListener("MSFullscreenChange", syncFullScreenStatus);

    var _Window_Options_update = Window_Options.prototype.update;
    Window_Options.prototype.update = function () {
      _Window_Options_update.call(this);
      var symbol = "startUpFullScreen";
      var index = this.findSymbol(symbol);
      if (index > -1) {
        var text = this.statusText(index);
        // Simple check if text representation has changed
        if (this._lastStatusText[index] !== text) {
          this._lastStatusText[index] = text;
          this.redrawItem(index);
        }
      }
    };

    var _Window_Options_drawItem = Window_Options.prototype.drawItem;
    Window_Options.prototype.drawItem = function (index) {
      _Window_Options_drawItem.apply(this, arguments);
      if (!this._lastStatusText) this._lastStatusText = {};
      this._lastStatusText[index] = this.statusText(index);
    };
  }

  // 4295 - Adjusting message text speed (1/1)
  var _Window_Message_clearFlags = Window_Message.prototype.clearFlags;
  Window_Message.prototype.clearFlags = function (textState) {
    _Window_Message_clearFlags.apply(this, arguments);
    this._TextSpeed = paramTextSpeed - 1;
  };

  // 4873 - Simplifying sidevew BattleLog (1/4)
  var _Window_BattleLog_addText = Window_BattleLog.prototype.addText;
  Window_BattleLog.prototype.addText = function (text) {
    if ($gameSystem.isSideView()) {
      this.refresh();
      this.wait();
      return; // not display battle log
    }
    _Window_BattleLog_addText.call(this, text);
  };

  // [NEW] - Simplifying sidevew BattleLog (2/4)
  Window_BattleLog.prototype.addItemNameText = function (itemName) {
    this._lines.push(itemName);
    this.refresh();
    this.wait();
  };

  // 5031 - Simplifying sidevew BattleLog (3/4)
  var _Window_BattleLog_drawLineText = Window_BattleLog.prototype.drawLineText;
  Window_BattleLog.prototype.drawLineText = function (index) {
    if ($gameSystem.isSideView()) {
      var rect = this.itemRectForText(index);
      this.contents.clearRect(rect.x, rect.y, rect.width, rect.height);
      this.drawText(this._lines[index], rect.x, rect.y, rect.width, "center");
      return;
    }
    _Window_BattleLog_drawLineText.call(this, index);
  };

  // 5069 - Simplifying sidevew BattleLog (4/4)
  var _Window_BattleLog_displayAction =
    Window_BattleLog.prototype.displayAction;
  Window_BattleLog.prototype.displayAction = function (subject, item) {
    if ($gameSystem.isSideView()) {
      //.            if(!(DataManager.isSkill(item) && item.id == subject.attackSkillId())) {
      this.push("addItemNameText", item.name); // display item/skill name
      //.            } else {
      //.                this.push('wait');
      //.            }
      return;
    }
    _Window_BattleLog_displayAction.call(this, subject, item);
  };

  //-----------------------------------------------------------------------------
})();

/*
CREDITS

*/
