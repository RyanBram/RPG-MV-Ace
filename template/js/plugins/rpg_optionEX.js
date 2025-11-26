//==============================================================================
// rpg_optionX.js
//------------------------------------------------------------------------------
// Copyright (c) 2025 Ryan Bramantya All rights reserved.
// Licensed under Apache License
// https://www.apache.org/licenses/LICENSE-2.0.txt
// =============================================================================
/*:
 * @plugindesc [2.0.0] A comprehensive plugin to enhance the options screen.
 * @author RyanBram based on works by Tsutumi Kawahara http://www.akunou.com/
 * @url http://ryanbram.itch.io/
 * @target MV Ace
 *
 * @help
 * This plugin that allows you to customize the options window with more settings,
 * including volume offsets, window opacity, window color tint, and a
 * command to reset all settings to default.
 *
 * Simply turn this plugin ON in the Plugin Manager and configure the
 * parameters below.
 *
 * Plugin Command:
 * None. This plugin works by being turned ON.
 *
 * @param ---[Base Settings]---
 * @default
 *
 * @param Window Options Width
 * @parent ---[Base Settings]---
 * @desc Sets the width of the options window. Adjust if text overlaps.
 * @type number
 * @default 832
 *
 * @param Window Options Number
 * @parent ---[Base Settings]---
 * @desc The number of commands visible in the options window at one time.
 * @type number
 * @default 13
 *
 * @param ---[Volume Settings]---
 * @default
 *
 * @param Volume Offset
 * @parent ---[Volume Settings]---
 * @desc The amount to change the volume by with each step. Default RPG Maker MV value is 20.
 * @type number
 * @default 5
 *
 * @param Bgm Volume Default
 * @parent ---[Volume Settings]---
 * @desc The default value for BGM Volume.
 * @type number
 * @min 0
 * @max 100
 * @default 100
 *
 * @param Bgs Volume Default
 * @parent ---[Volume Settings]---
 * @desc The default value for BGS Volume.
 * @type number
 * @min 0
 * @max 100
 * @default 100
 *
 * @param Me Volume Default
 * @parent ---[Volume Settings]---
 * @desc The default value for ME Volume.
 * @type number
 * @min 0
 * @max 100
 * @default 100
 *
 * @param Se Volume Default
 * @parent ---[Volume Settings]---
 * @desc The default value for SE Volume.
 * @type number
 * @min 0
 * @max 100
 * @default 100
 *
 * @param ---[Window Opacity]---
 * @default
 *
 * @param Window Opacity Term
 * @parent ---[Window Opacity]---
 * @desc The display name for the window opacity option.
 * @type string
 * @default Window Opacity
 *
 * @param Window Opacity Offset
 * @parent ---[Window Opacity]---
 * @desc The amount to change the window opacity by with each step.
 * @type number
 * @default 15
 *
 * @param Window Opacity Default
 * @parent ---[Window Opacity]---
 * @desc The default value for window opacity (0-255).
 * @type number
 * @min 0
 * @max 255
 * @default 192
 *
 * @param ---[Window Color]---
 * @default
 *
 * @param Window Color R Term
 * @parent ---[Window Color]---
 * @desc The display name for the window Red tone option.
 * @type string
 * @default Window Red
 *
 * @param Window Color G Term
 * @parent ---[Window Color]---
 * @desc The display name for the window Green tone option.
 * @type string
 * @default Window Green
 *
 * @param Window Color B Term
 * @parent ---[Window Color]---
 * @desc The display name for the window Blue tone option.
 * @type string
 * @default Window Blue
 *
 * @param Window Color Offset
 * @parent ---[Window Color]---
 * @desc The amount to change the window color tone by with each step.
 * @type number
 * @default 15
 *
 * @param Window Color R Default
 * @parent ---[Window Color]---
 * @desc The default value for the window Red tone (-255 to 255).
 * @type number
 * @min -255
 * @max 255
 * @default 0
 *
 * @param Window Color G Default
 * @parent ---[Window Color]---
 * @desc The default value for the window Green tone (-255 to 255).
 * @type number
 * @min -255
 * @max 255
 * @default 0
 *
 * @param Window Color B Default
 * @parent ---[Window Color]---
 * @desc The default value for the window Blue tone (-255 to 255).
 * @type number
 * @min -255
 * @max 255
 * @default 110
 *
 * @param ---[Default Settings]---
 * @default
 *
 * @param Default Term
 * @parent ---[Default Settings]---
 * @desc The display name for the command that restores all defaults.
 * @type string
 * @default Restore Defaults
 *
 * @param Always Dash Default
 * @parent ---[Default Settings]---
 * @desc The default value for Always Dash. 0 for OFF, 1 for ON.
 * @type select
 * @option OFF
 * @value 0
 * @option ON
 * @value 1
 * @default 0
 *
 * @param Command Remember Default
 * @parent ---[Default Settings]---
 * @desc The default value for Command Remember. 0 for OFF, 1 for ON.
 * @type select
 * @option OFF
 * @value 0
 * @option ON
 * @value 1
 * @default 0
 *
 * @param ---[Gauge Display]---
 * @default
 *
 * @param Gauge Color 1
 * @parent ---[Gauge Display]---
 * @desc The first color for the volume/opacity gauge gradient. (R, G, B, A)
 * @default 255, 204, 32, 255
 *
 * @param Gauge Color 2
 * @parent ---[Gauge Display]---
 * @desc The second color for the volume/opacity gauge gradient. (R, G, B, A)
 * @default 255, 255, 160, 255
 *
 * @param Gauge Color R 1
 * @parent ---[Gauge Display]---
 * @desc First color for the Red tone gauge gradient.
 * @default 255, 96, 96, 255
 *
 * @param Gauge Color R 2
 * @parent ---[Gauge Display]---
 * @desc Second color for the Red tone gauge gradient.
 * @default 255, 192, 192, 255
 *
 * @param Gauge Color G 1
 * @parent ---[Gauge Display]---
 * @desc First color for the Green tone gauge gradient.
 * @default 96, 255, 96, 255
 *
 * @param Gauge Color G 2
 * @parent ---[Gauge Display]---
 * @desc Second color for the Green tone gauge gradient.
 * @default 192, 255, 192, 255
 *
 * @param Gauge Color B 1
 * @parent ---[Gauge Display]---
 * @desc First color for the Blue tone gauge gradient.
 * @default 96, 96, 255, 255
 *
 * @param Gauge Color B 2
 * @parent ---[Gauge Display]---
 * @desc Second color for the Blue tone gauge gradient.
 * @default 192, 192, 255, 255
 *
 */

(function () {
  var parameters = PluginManager.parameters("rpg_optionEX");

  // Base Parameters
  var windowOptionsWidth = Number(parameters["Window Options Width"] || 832);
  var windowOptionsNumber = Number(parameters["Window Options Number"] || 13);

  // Volume Offset Parameters
  var volumeOffset = Number(parameters["Volume Offset"] || 1);

  // Window Opacity Parameters
  var windowOpacityText = String(
    parameters["Window Opacity Term"] || "Window Opacity",
  );
  var windowOpacityOffset = Number(parameters["Window Opacity Offset"] || 1);
  var windowOpacityDefault = Number(
    parameters["Window Opacity Default"] || 192,
  );

  // Window Color Parameters
  var windowColorRText = String(
    parameters["Window Color R Term"] || "Window Red",
  );
  var windowColorGText = String(
    parameters["Window Color G Term"] || "Window Green",
  );
  var windowColorBText = String(
    parameters["Window Color B Term"] || "Window Blue",
  );
  var windowColorOffset = Number(parameters["Window Color Offset"] || 17);
  var windowColorRDefault = Number(parameters["Window Color R Default"] || 0);
  var windowColorGDefault = Number(parameters["Window Color G Default"] || 0);
  var windowColorBDefault = Number(parameters["Window Color B Default"] || 0);

  // Default Parameters
  var defaultText = String(parameters["Default Term"] || "Restore Defaults");
  var alwaysDashDefault = Boolean(Number(parameters["Always Dash Default"]));
  var commandRememberDefault = Boolean(
    Number(parameters["Command Remember Default"]),
  );
  var bgmVolumeDefault = Number(parameters["Bgm Volume Default"] || 100);
  var bgsVolumeDefault = Number(parameters["Bgs Volume Default"] || 100);
  var meVolumeDefault = Number(parameters["Me Volume Default"] || 100);
  var seVolumeDefault = Number(parameters["Se Volume Default"] || 100);

  // Gauge Parameters
  var gaugeColor1 = "rgba(" + parameters["Gauge Color 1"] + ")";
  var gaugeColor2 = "rgba(" + parameters["Gauge Color 2"] + ")";
  var gaugeColorR1 = "rgba(" + parameters["Gauge Color R 1"] + ")";
  var gaugeColorR2 = "rgba(" + parameters["Gauge Color R 2"] + ")";
  var gaugeColorG1 = "rgba(" + parameters["Gauge Color G 1"] + ")";
  var gaugeColorG2 = "rgba(" + parameters["Gauge Color G 2"] + ")";
  var gaugeColorB1 = "rgba(" + parameters["Gauge Color B 1"] + ")";
  var gaugeColorB2 = "rgba(" + parameters["Gauge Color B 2"] + ")";

  //=========================================================================
  // ConfigManager
  // Manages the configuration data.
  //=========================================================================

  ConfigManager.windowOpacityHex = windowOpacityDefault;
  ConfigManager.windowColorRHex = windowColorRDefault;
  ConfigManager.windowColorGHex = windowColorGDefault;
  ConfigManager.windowColorBHex = windowColorBDefault;

  var _AKUNOU_ConfigManager_makeData = ConfigManager.makeData;
  ConfigManager.makeData = function () {
    var config = _AKUNOU_ConfigManager_makeData.call(this);
    this.makeExtraData(config);
    return config;
  };

  ConfigManager.makeExtraData = function (config) {
    config.windowOpacityHex = this.windowOpacityHex;
    config.windowColorRHex = this.windowColorRHex;
    config.windowColorGHex = this.windowColorGHex;
    config.windowColorBHex = this.windowColorBHex;
    return config;
  };

  var _AKUNOU_ConfigManager_applyData = ConfigManager.applyData;
  ConfigManager.applyData = function (config) {
    _AKUNOU_ConfigManager_applyData.call(this, config);
    this.windowOpacityHex = this.readConfigValue(
      config,
      "windowOpacityHex",
      windowOpacityDefault,
      0,
      255,
    );
    this.windowColorRHex = this.readConfigValue(
      config,
      "windowColorRHex",
      windowColorRDefault,
      -255,
      255,
    );
    this.windowColorGHex = this.readConfigValue(
      config,
      "windowColorGHex",
      windowColorGDefault,
      -255,
      255,
    );
    this.windowColorBHex = this.readConfigValue(
      config,
      "windowColorBHex",
      windowColorBDefault,
      -255,
      255,
    );
  };

  ConfigManager.readConfigValue = function (
    config,
    name,
    defaultValue,
    min,
    max,
  ) {
    var value = config[name];
    if (value !== undefined) {
      return Number(value).clamp(min, max);
    } else {
      return defaultValue;
    }
  };

  ConfigManager.readFlag = function (config, name) {
    var value = config[name];
    if (value !== undefined) {
      return !!config[name];
    } else {
      if (name === "alwaysDash") {
        return alwaysDashDefault;
      } else if (name === "commandRemember") {
        return commandRememberDefault;
      } else {
        return false;
      }
    }
  };

  ConfigManager.readVolume = function (config, name) {
    var value = config[name];
    if (value !== undefined) {
      return Number(value).clamp(0, 100);
    } else {
      if (name === "bgmVolume") {
        return bgmVolumeDefault;
      } else if (name === "bgsVolume") {
        return bgsVolumeDefault;
      } else if (name === "meVolume") {
        return meVolumeDefault;
      } else if (name === "seVolume") {
        return seVolumeDefault;
      } else {
        return 100;
      }
    }
  };

  //=========================================================================
  // Window_Base
  // The superclass of all windows in the game.
  //=========================================================================

  Window_Base.prototype.standardBackOpacity = function () {
    return ConfigManager["windowOpacityHex"];
  };

  Window_Base.prototype.updateTone = function () {
    this.setTone(
      ConfigManager["windowColorRHex"],
      ConfigManager["windowColorGHex"],
      ConfigManager["windowColorBHex"],
    );
  };

  //=========================================================================
  // Window_Options
  // The window for changing various settings on the options screen.
  //=========================================================================

  // Use Graphics.boxWidth for full screen width
  Window_Options.prototype.windowWidth = function () {
    return Graphics.boxWidth;
  };

  // Use Graphics.boxHeight for full screen height
  Window_Options.prototype.windowHeight = function () {
    return Graphics.boxHeight;
  };

  // [FIX] Override statusWidth to accommodate 5-digit numbers
  // statusWidth = gaugeWidth + VALUE_WIDTH + GAUGE_PADDING
  // statusWidth = 186 + 60 + 12 = 258
  Window_Options.prototype.statusWidth = function () {
    return 258;
  };

  var _AKUNOU_Window_Options_makeCommandList =
    Window_Options.prototype.makeCommandList;
  Window_Options.prototype.makeCommandList = function () {
    // Gameplay category
    this.addCategoryLabel("Gameplay");
    this.addSpacer();
    this.addGeneralOptions(); // Always Dash, Command Remember, etc

    // Display category
    this.addCategoryLabel("Display");
    this.addSpacer();
    this.addDisplayOptions();

    // Audio category
    this.addCategoryLabel("Audio");
    this.addSpacer();
    this.addVolumeOptions(); // Use default addVolumeOptions

    // Restore Defaults button
    this.addCategoryLabel(""); // Empty category for spacing before Default
    this.addSpacer();
    this.addDefaultOptions();
  };

  Window_Options.prototype.addCategoryLabel = function (labelText) {
    this.addCommand(labelText, "category");
  };

  Window_Options.prototype.addSpacer = function () {
    this.addCommand("", "spacer");
  };

  Window_Options.prototype.addDisplayOptions = function () {
    this.addCommand(windowOpacityText, "windowOpacityHex");
    this.addCommand(windowColorRText, "windowColorRHex");
    this.addCommand(windowColorGText, "windowColorGHex");
    this.addCommand(windowColorBText, "windowColorBHex");
  };

  Window_Options.prototype.addAudioOptions = function () {
    // Deprecated - now using default addVolumeOptions
  };
  Window_Options.prototype.addExtraOptions = function () {
    // Deprecated - moved to addDisplayOptions and addAudioOptions
  };

  Window_Options.prototype.addDefaultOptions = function () {
    this.addCommand(defaultText, "default");
  };

  Window_Options.prototype.isCategorySymbol = function (symbol) {
    return symbol === "category";
  };

  Window_Options.prototype.isSpacerSymbol = function (symbol) {
    return symbol === "spacer";
  };

  // Override isCommandEnabled to disable category labels and spacers
  var _AKUNOU_Window_Options_isCommandEnabled =
    Window_Options.prototype.isCommandEnabled;
  Window_Options.prototype.isCommandEnabled = function (index) {
    var symbol = this.commandSymbol(index);
    if (this.isCategorySymbol(symbol) || this.isSpacerSymbol(symbol)) {
      return false;
    }
    return _AKUNOU_Window_Options_isCommandEnabled.call(this, index);
  };

  // Override activate to set initial cursor position after category label and spacer
  var _AKUNOU_Window_Options_activate = Window_Options.prototype.activate;
  Window_Options.prototype.activate = function () {
    _AKUNOU_Window_Options_activate.call(this);
    // Set cursor to index 2 (skip category label at 0 and spacer at 1)
    if (
      this.index() === 0 ||
      this.isCategorySymbol(this.commandSymbol(this.index())) ||
      this.isSpacerSymbol(this.commandSymbol(this.index()))
    ) {
      this.select(2);
    }
  };

  // Override cursorDown to skip category labels
  var _AKUNOU_Window_Options_cursorDown = Window_Options.prototype.cursorDown;
  // Override cursorDown to skip category labels and spacers (no wrapping)
  Window_Options.prototype.cursorDown = function (wrap) {
    var index = this.index();
    var maxItems = this.maxItems();
    var maxCols = this.maxCols();
    if (index < maxItems - maxCols) {
      this.select((index + maxCols) % maxItems);
      // Skip category labels and spacers
      while (
        this.isCategorySymbol(this.commandSymbol(this.index())) ||
        this.isSpacerSymbol(this.commandSymbol(this.index()))
      ) {
        var nextIndex = (this.index() + maxCols) % maxItems;
        if (nextIndex >= maxItems || nextIndex <= index) break; // Stop at bottom
        this.select(nextIndex);
      }
    }
  };

  // Override cursorUp to skip category labels and spacers (no wrapping)
  Window_Options.prototype.cursorUp = function (wrap) {
    var index = this.index();
    var maxItems = this.maxItems();
    var maxCols = this.maxCols();
    if (index >= maxCols) {
      this.select((index - maxCols + maxItems) % maxItems);
      // Skip category labels and spacers
      while (
        this.isCategorySymbol(this.commandSymbol(this.index())) ||
        this.isSpacerSymbol(this.commandSymbol(this.index()))
      ) {
        var prevIndex = (this.index() - maxCols + maxItems) % maxItems;
        if (prevIndex >= index || this.index() === 0) break; // Stop at top (prevent wrap or hitting index 0)
        this.select(prevIndex);
      }
      // If we ended up at a category label or spacer (index 0), move back down
      if (
        this.isCategorySymbol(this.commandSymbol(this.index())) ||
        this.isSpacerSymbol(this.commandSymbol(this.index()))
      ) {
        this.select(index); // Stay at previous position
      }
    }
  };

  Window_Options.prototype.drawItem = function (index) {
    const rect = this.itemRectForText(index);
    const symbol = this.commandSymbol(index);
    const enabled = this.isCommandEnabled(index);

    // Skip drawing spacers completely - they are just empty space
    if (this.isSpacerSymbol(symbol)) {
      return;
    }

    // Untuk category label
    if (this.isCategorySymbol(symbol)) {
      this.resetTextColor();
      // Draw category label in white (normal color)
      // Move text down by 0.5 row to center it vertically with spacer below
      const textY = rect.y + Math.floor(this.lineHeight() / 2);
      this.drawText(
        this.commandName(index),
        rect.x,
        textY,
        rect.width,
        "center",
      );
      // Draw underline for category (moved down 0.25 row from text)
      const lineY =
        textY + Math.floor(this.lineHeight() / 4) + this.lineHeight() - 4;
      this.contents.fillRect(rect.x, lineY, rect.width, 2, this.normalColor());
      return;
    }

    // Untuk command "Restore Defaults"
    if (this.isDefaultSymbol(symbol)) {
      this.changePaintOpacity(enabled);
      this.drawText(
        this.commandName(index),
        rect.x,
        rect.y,
        rect.width,
        "center",
      );
      return;
    }

    const isGaugeItem = this.isVolumeSymbol(symbol) || this.isHexSymbol(symbol);

    // Untuk Opsi dengan Gauge (Volume, Opacity, Warna)
    if (isGaugeItem) {
      const GAUGE_HEIGHT = 6; // Tinggi gauge
      const GAUGE_PADDING = 12; // Jarak antara gauge dan teks nilai
      const VALUE_WIDTH = 60; // Ruang untuk teks nilai (5 digit: "-255" to "100")

      const statusWidth = this.statusWidth();
      const gaugeAreaX = rect.x + rect.width - statusWidth;
      const gaugeWidth = statusWidth - VALUE_WIDTH - GAUGE_PADDING;
      const gaugeY = rect.y + Math.floor((rect.height - GAUGE_HEIGHT) / 2); // Posisi Y di tengah

      // 1. Gambar Nama Opsi (rata kiri)
      this.changePaintOpacity(enabled);
      this.drawText(
        this.commandName(index),
        rect.x,
        rect.y,
        rect.width - statusWidth,
        "left",
      );

      // 2. Gambar Gauge
      const value = this.getConfigValue(symbol);
      let rate = 0;
      let color1 = gaugeColor1;
      let color2 = gaugeColor2;

      if (this.isVolumeSymbol(symbol)) {
        rate = value / 100;
      } else if (this.isOpacitySymbol(symbol)) {
        rate = value / 255;
      } else if (this.isColorSymbol(symbol)) {
        rate = (value + 255) / 510;
        if (symbol === "windowColorRHex") {
          color1 = gaugeColorR1;
          color2 = gaugeColorR2;
        } else if (symbol === "windowColorGHex") {
          color1 = gaugeColorG1;
          color2 = gaugeColorG2;
        } else if (symbol === "windowColorBHex") {
          color1 = gaugeColorB1;
          color2 = gaugeColorB2;
        }
      }

      // Gambar outline putih untuk gauge (untuk visibility di window gelap)
      this.contents.fillRect(
        gaugeAreaX - 1,
        gaugeY - 1,
        gaugeWidth + 2,
        GAUGE_HEIGHT + 2,
        "rgba(255, 255, 255, 0.5)",
      );
      // Gambar latar belakang gauge
      this.contents.fillRect(
        gaugeAreaX,
        gaugeY,
        gaugeWidth,
        GAUGE_HEIGHT,
        this.gaugeBackColor(),
      );
      // Gambar isi gauge
      this.contents.gradientFillRect(
        gaugeAreaX,
        gaugeY,
        gaugeWidth * rate,
        GAUGE_HEIGHT,
        color1,
        color2,
      );

      // Draw handle at gauge position (like icon, directly to contents)
      const handleX =
        gaugeAreaX +
        Math.floor(gaugeWidth * rate) -
        Math.floor(HANDLE_WIDTH / 2);
      const handleY = rect.y + Math.floor((rect.height - HANDLE_HEIGHT) / 2);
      this.drawHandle(handleX, handleY);

      // 3. Gambar Teks Nilai (rata kanan)
      this.resetTextColor();
      const valueX = gaugeAreaX + gaugeWidth + GAUGE_PADDING;
      this.drawText(
        this.statusText(index),
        valueX,
        rect.y,
        VALUE_WIDTH,
        "right",
      );
    } else {
      // Untuk Opsi Boolean (ON/OFF)
      const statusWidth = this.statusWidth();
      this.resetTextColor();
      this.changePaintOpacity(enabled);
      this.drawText(
        this.commandName(index),
        rect.x,
        rect.y,
        rect.width - statusWidth,
        "left",
      );
      this.drawText(
        this.statusText(index),
        rect.x + rect.width - statusWidth,
        rect.y,
        statusWidth,
        "right",
      );
    }
  };

  // TAMBAHKAN FUNGSI BARU INI di mana saja di dalam (function() { ... })();
  // Fungsi ini untuk mendapatkan warna latar belakang gauge
  Window_Options.prototype.gaugeBackColor = function () {
    return this.textColor(19); // Mengambil warna abu-abu gelap dari windowskin
  };

  Window_Options.prototype.statusText = function (index) {
    var symbol = this.commandSymbol(index);
    var value = this.getConfigValue(symbol);
    if (this.isVolumeSymbol(symbol)) {
      return this.volumeStatusText(value);
    } else if (this.isHexSymbol(symbol)) {
      return value;
    } else {
      return this.booleanStatusText(value);
    }
  };

  var _AKUNOU_Window_Options_setConfigValue =
    Window_Options.prototype.setConfigValue;
  Window_Options.prototype.setConfigValue = function (symbol, value) {
    _AKUNOU_Window_Options_setConfigValue.call(this, symbol, value);
    if (this.isOpacitySymbol(symbol)) {
      this.updateBackOpacity();
    }
    if (this.isColorSymbol(symbol)) {
      this.updateTone();
    }
  };

  Window_Options.prototype.isHexSymbol = function (symbol) {
    return symbol.contains("Hex");
  };

  Window_Options.prototype.isOpacitySymbol = function (symbol) {
    return symbol.contains("Opacity");
  };

  Window_Options.prototype.isColorSymbol = function (symbol) {
    return symbol.contains("Color");
  };

  Window_Options.prototype.isDefaultSymbol = function (symbol) {
    return symbol.contains("default");
  };

  Window_Options.prototype.volumeOffset = function () {
    return volumeOffset > 0 ? volumeOffset : 1;
  };

  Window_Options.prototype.opacityOffset = function () {
    return windowOpacityOffset > 0 ? windowOpacityOffset : 1;
  };

  Window_Options.prototype.colorOffset = function () {
    return windowColorOffset > 0 ? windowColorOffset : 1;
  };

  Window_Options.prototype.processOk = function () {
    var index = this.index();
    var symbol = this.commandSymbol(index);
    var value = this.getConfigValue(symbol);

    if (this.isDefaultSymbol(symbol)) {
      // Untuk command "Restore Defaults"
      SoundManager.playOk();
      this.defaultAll();
      this.refresh(); // Menggambar ulang semua item
    } else if (this.isVolumeSymbol(symbol) || this.isHexSymbol(symbol)) {
      // Tidak melakukan apa-apa. Respons hening untuk item gauge.
      // Baris SoundManager.playBuzzer() telah dihapus.
    } else {
      // Untuk item boolean (ON/OFF), ganti nilainya.
      this.changeValue(symbol, !value);
    }
  };

  Window_Options.prototype.cursorRight = function (wrap) {
    var index = this.index();
    var symbol = this.commandSymbol(index);
    var value = this.getConfigValue(symbol);

    if (this.isVolumeSymbol(symbol)) {
      value += this.volumeOffset();
      if (wrap && value > 100) value = 0;
      value = value.clamp(0, 100);
      this.changeValue(symbol, value);
    } else if (this.isOpacitySymbol(symbol)) {
      value += this.opacityOffset();
      if (wrap && value > 255) value = 0;
      value = value.clamp(0, 255);
      this.changeValue(symbol, value);
    } else if (this.isColorSymbol(symbol)) {
      value += this.colorOffset();
      if (wrap && value > 255) value = -255;
      value = value.clamp(-255, 255);
      this.changeValue(symbol, value);
    } else if (!this.isDefaultSymbol(symbol)) {
      this.changeValue(symbol, true);
    }
  };

  Window_Options.prototype.cursorLeft = function (wrap) {
    var index = this.index();
    var symbol = this.commandSymbol(index);
    var value = this.getConfigValue(symbol);

    if (this.isVolumeSymbol(symbol)) {
      value -= this.volumeOffset();
      if (wrap && value < 0) value = 100;
      value = value.clamp(0, 100);
      this.changeValue(symbol, value);
    } else if (this.isOpacitySymbol(symbol)) {
      value -= this.opacityOffset();
      if (wrap && value < 0) value = 255;
      value = value.clamp(0, 255);
      this.changeValue(symbol, value);
    } else if (this.isColorSymbol(symbol)) {
      value -= this.colorOffset();
      if (wrap && value < -255) value = 255;
      value = value.clamp(-255, 255);
      this.changeValue(symbol, value);
    } else if (!this.isDefaultSymbol(symbol)) {
      this.changeValue(symbol, false);
    }
  };

  Window_Options.prototype.defaultAll = function () {
    this.changeValue("alwaysDash", alwaysDashDefault);
    this.changeValue("commandRemember", commandRememberDefault);
    this.changeValue("bgmVolume", bgmVolumeDefault);
    this.changeValue("bgsVolume", bgsVolumeDefault);
    this.changeValue("meVolume", meVolumeDefault);
    this.changeValue("seVolume", seVolumeDefault);
    this.changeValue("windowOpacityHex", windowOpacityDefault);
    this.changeValue("windowColorRHex", windowColorRDefault);
    this.changeValue("windowColorGHex", windowColorGDefault);
    this.changeValue("windowColorBHex", windowColorBDefault);
  };

  // GANTI FUNGSI changeValue YANG LAMA (JIKA ADA) ATAU TAMBAHKAN INI
  Window_Options.prototype.changeValue = function (symbol, value) {
    var lastValue = this.getConfigValue(symbol);
    if (lastValue !== value) {
      this.setConfigValue(symbol, value);
      this.redrawItem(this.findSymbol(symbol));
      if (!this._isDragging) {
        // Hanya mainkan suara jika TIDAK sedang dragging
        SoundManager.playCursor();
      }
    }
  };

  // ============================================================================
  // Penambahan Fitur Handle untuk Gauge
  // ============================================================================

  const HANDLE_WIDTH = 12;
  const HANDLE_HEIGHT = 24;

  // --- Modifikasi Window_Options ---

  // Alias (simpan) fungsi initialize yang lama
  var _AKUNOU_Handle_Window_Options_initialize =
    Window_Options.prototype.initialize;
  Window_Options.prototype.initialize = function (x, y) {
    _AKUNOU_Handle_Window_Options_initialize.call(this, x, y);
    this._isDragging = false;
    this._draggedHandleIndex = -1;
    // Create handle bitmap once for reuse
    this._handleBitmap = this.createHandleBitmap();
  };

  Window_Options.prototype.createHandleBitmap = function () {
    // Create handle bitmap (like an icon)
    const bitmap = new Bitmap(HANDLE_WIDTH, HANDLE_HEIGHT);
    bitmap.fillAll("rgba(255, 255, 255, 0.8)");
    bitmap.fillRect(
      1,
      1,
      HANDLE_WIDTH - 2,
      HANDLE_HEIGHT - 2,
      "rgba(0, 0, 0, 0.5)",
    );
    bitmap.fillRect(
      2,
      2,
      HANDLE_WIDTH - 4,
      HANDLE_HEIGHT - 4,
      "rgba(192, 192, 255, 1)",
    );
    return bitmap;
  };

  Window_Options.prototype.drawHandle = function (x, y) {
    // Draw handle to contents bitmap (like drawIcon)
    // Ensure handle bitmap is created
    if (!this._handleBitmap) {
      this._handleBitmap = this.createHandleBitmap();
    }
    this.contents.blt(
      this._handleBitmap,
      0,
      0,
      HANDLE_WIDTH,
      HANDLE_HEIGHT,
      x,
      y,
    );
  };

  // Tambahkan fungsi baru untuk menangani touch
  Window_Options.prototype.processTouch = function () {
    if (!this.isOpenAndActive()) return;

    if (TouchInput.isTriggered()) {
      const x = this.canvasToLocalX(TouchInput.x);
      const y = this.canvasToLocalY(TouchInput.y);
      const hitIndex = this.hitTest(x, y);

      if (hitIndex >= 0) {
        const symbol = this.commandSymbol(hitIndex);
        const isGaugeItem =
          this.isVolumeSymbol(symbol) || this.isHexSymbol(symbol);

        if (isGaugeItem) {
          // Check if touch is on handle area (expanded hit area)
          const rect = this.itemRectForText(hitIndex);
          const GAUGE_PADDING = 12;
          const VALUE_WIDTH = 60;
          const statusWidth = this.statusWidth();
          const gaugeWidth = statusWidth - VALUE_WIDTH - GAUGE_PADDING;
          const gaugeAreaX = rect.x + rect.width - statusWidth;

          const value = this.getConfigValue(symbol);
          let rate = 0;
          if (this.isVolumeSymbol(symbol)) rate = value / 100;
          else if (this.isOpacitySymbol(symbol)) rate = value / 255;
          else if (this.isColorSymbol(symbol)) rate = (value + 255) / 510;

          const handleX =
            gaugeAreaX +
            Math.floor(gaugeWidth * rate) -
            Math.floor(HANDLE_WIDTH / 2);
          const handleY =
            rect.y + Math.floor((rect.height - HANDLE_HEIGHT) / 2);

          // Expanded hit area for easier touch
          if (
            x >= handleX - HANDLE_WIDTH &&
            x <= handleX + HANDLE_WIDTH * 2 &&
            y >= handleY - HANDLE_HEIGHT &&
            y <= handleY + HANDLE_HEIGHT * 2
          ) {
            this._isDragging = true;
            this._draggedHandleIndex = hitIndex;
            this.select(hitIndex);
            return;
          }
        }
      }
    }

    if (this._isDragging) {
      if (TouchInput.isMoved()) {
        const symbol = this.commandSymbol(this._draggedHandleIndex);
        const rect = this.itemRectForText(this._draggedHandleIndex);

        const GAUGE_PADDING = 12;
        const VALUE_WIDTH = 60;
        const statusWidth = this.statusWidth();
        const gaugeWidth = statusWidth - VALUE_WIDTH - GAUGE_PADDING;
        const gaugeAreaX = rect.x + rect.width - statusWidth;

        const touchX = this.canvasToLocalX(TouchInput.x);
        const relativeX = (touchX - gaugeAreaX).clamp(0, gaugeWidth);

        const rate = relativeX / gaugeWidth;
        let newValue;

        if (this.isVolumeSymbol(symbol)) {
          newValue = Math.round(rate * 100);
        } else if (this.isOpacitySymbol(symbol)) {
          newValue = Math.round(rate * 255);
        } else if (this.isColorSymbol(symbol)) {
          newValue = Math.round(rate * 510 - 255);
        }

        if (this.getConfigValue(symbol) !== newValue) {
          this.changeValue(symbol, newValue);
        }
      } else if (TouchInput.isReleased()) {
        this._isDragging = false;
        this._draggedHandleIndex = -1;
      }
      return;
    }

    // Panggil proses touch dari parent jika tidak ada interaksi dengan handle
    Window_Selectable.prototype.processTouch.call(this);
  };

  // GANTI FUNGSI onTouch YANG LAMA DENGAN INI, ATAU TAMBAHKAN JIKA BELUM ADA
  var _AKUNOU_Handle_Window_Options_onTouch = Window_Options.prototype.onTouch;
  Window_Options.prototype.onTouch = function (triggered) {
    // [FIX] Convert coordinates using canvasToLocalX before hitTest
    var x = this.canvasToLocalX(TouchInput.x);
    var y = this.canvasToLocalY(TouchInput.y);
    var index = this.hitTest(x, y);

    if (index >= 0) {
      var symbol = this.commandSymbol(index);

      // Prevent selection of category labels and spacers
      if (this.isCategorySymbol(symbol) || this.isSpacerSymbol(symbol)) {
        return; // Ignore clicks on category labels and spacers
      }

      var isGaugeItem = this.isVolumeSymbol(symbol) || this.isHexSymbol(symbol);

      // Jika item yang diklik (triggered) adalah sebuah gauge
      if (triggered && isGaugeItem) {
        // Cukup pilih item tersebut (jika belum terpilih) dan hentikan proses.
        // Ini akan mencegah pemanggilan processOk() dari logika induk.
        if (this.index() !== index) {
          this.select(index);
          SoundManager.playCursor();
        }
        return; // Hentikan eksekusi di sini!
      }
    }

    // Untuk item non-gauge, atau event hover (bukan klik), jalankan logika aslinya.
    _AKUNOU_Handle_Window_Options_onTouch.call(this, triggered);
  };
})();
