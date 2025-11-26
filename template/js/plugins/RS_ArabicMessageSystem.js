/* eslint-disable prefer-rest-params */
/* eslint-disable-next-line prefer-spread */
//================================================================
// RS_ArabicMessageSystem.js
// ---------------------------------------------------------------
// The MIT License
// Copyright (c) 2016 biud436
// ---------------------------------------------------------------
// Free for commercial and non commercial use.
//================================================================
/*:
 * @target MV
 * @plugindesc right-to-left language support for RMMV <RS_ArabicMessageSystem>
 * @author biud436
 *
 * @param Arabic Font
 * @desc Choose your font that can indicate Arabic text from your system font folder.
 * @default Simplified Arabic, Times New Roman, Segoe UI
 *
 * @param Font Size
 * @type number
 * @desc Specifies up the text size as integer type.
 * (default : 28)
 * @default 28
 *
 * @param Text Reveal Speed
 * @type number
 * @desc Characters revealed per frame for RTL text animation. Higher = faster reveal. (default: 2)
 * @default 2
 *
 * @param Sequential Animation
 * @type boolean
 * @desc If true, lines reveal one by one (sequential). If false, all lines reveal together (parallel).
 * @default true
 *
 * @param Binder
 * @type note[]
 * @desc Can run the scripts
 * @default ["\"  // YEP_MessageCore\\n  if(Imported.YEP_MessageCore) {\\n\\n    Window_Message.prototype.standardFontFace = function () {\\n      return Window_Base.prototype.standardFontFace.call(this);\\n    };\\n\\n    var alias_Window_NameBox_initialize = Window_NameBox.prototype.initialize;\\n    Window_NameBox.prototype.initialize = function(parentWindow) {\\n      alias_Window_NameBox_initialize.call(this, parentWindow);\\n      RS.ArabicMessageSystem.createArabicLayer.call(this);\\n      RS.ArabicMessageSystem.defineProtoype(Window_NameBox);\\n    };\\n\\n    Window_NameBox.prototype.standardFontFace = function() {\\n      return Window_Base.prototype.standardFontFace.call(this);\\n    };\\n\\n    Window_NameBox.prototype.refresh = function(text, position) {\\n      this.show();\\n      this._lastNameText = text;\\n      this._text = Yanfly.Param.MSGNameBoxText + text;\\n      this._position = position;\\n      this.width = this.windowWidth();\\n      this.createContents();\\n      this.contents.clear();\\n      RS.ArabicMessageSystem.createArabicLayer.call(this);\\n      this.resetFontSettings();\\n      this.changeTextColor(this.textColor(Yanfly.Param.MSGNameBoxColor));\\n      var padding = eval(Yanfly.Param.MSGNameBoxPadding) / 2;\\n      this.drawTextEx(this._text, padding, 0);\\n      this._parentWindow.adjustWindowSettings();\\n      this._parentWindow.updatePlacement();\\n      this.adjustPositionX();\\n      this.adjustPositionY();\\n      this.open();\\n      this.activate();\\n      this._closeCounter = 4;\\n      return '';\\n    };\\n  };\"","\"  // YEP_EventMiniLabel\\n  if(Imported.YEP_EventMiniLabel) {\\n    RS.ArabicMessageSystem.defineInitialize(Window_EventMiniLabel);\\n    Window_EventMiniLabel.prototype.textWidthEx = function(text) {\\n      var temp = messageMode.slice(0);\\n      messageMode = 'normal';\\n      var result = Window_Base.prototype.drawTextEx.call(this, text, 0, this.contents.height);\\n      messageMode = temp;\\n      return result;\\n    };\\n  }\\n\"","\"  // YEP_GabWindow\\n  if(Imported.YEP_GabWindow) {\\n    var alias_Window_Gab_initialize = Window_Gab.prototype.initialize;\\n    Window_Gab.prototype.initialize = function(battle) {\\n      alias_Window_Gab_initialize.call(this, battle);\\n      RS.ArabicMessageSystem.createArabicLayer.call(this);\\n      RS.ArabicMessageSystem.defineRefresh(Window_Gab);\\n      RS.ArabicMessageSystem.defineProtoype(Window_Gab);\\n    };\\n\\n    Window_Gab.prototype.standardFontFace = function() {\\n      return Window_Base.prototype.standardFontFace.call(this);\\n    };\\n  }\"","\"  // YEP_ItemCore\\n  if(Imported.YEP_ItemCore) {\\n    var alias_Window_ItemActionCommand_initialize = Window_ItemActionCommand.prototype.initialize;\\n    Window_ItemActionCommand.prototype.initialize = function(x, y) {\\n      alias_Window_ItemActionCommand_initialize.call(this, x, y);\\n      RS.ArabicMessageSystem.createArabicLayer.call(this);\\n    };\\n    Window_ItemActionCommand.prototype.drawAllItems = function() {\\n      RS.ArabicMessageSystem.createArabicLayer.call(this);\\n      var topIndex = this.topIndex();\\n      for (var i = 0; i < this.maxPageItems(); i++) {\\n          var index = topIndex + i;\\n          if (index < this.maxItems()) {\\n              this.drawItem(index);\\n          }\\n      }\\n    };\\n  }\"","\"  // YEP_SaveCore\\n\\n  if(Imported.YEP_SaveCore) {\\n\\n    Window_Base.prototype.drawSvActor = function(actor, x, y) {\\n      var filename = actor.battlerName();\\n      var bitmap = ImageManager.loadSvActor(filename);\\n      var pw = bitmap.width / 9;\\n      var ph = bitmap.height / 6;\\n      var sx = 0;\\n      var sy = 0;\\n      this.contents.RTLblt(bitmap, sx, sy, pw, ph, x - pw / 2, y - ph);\\n    };\\n\\n    Window_Base.prototype.textWidthEx = function(text) {\\n      var temp = messageMode.slice(0);\\n      messageMode = 'normal';\\n      var result = this.drawTextEx.call(this, text, 0, this.contents.height);\\n      messageMode = temp;\\n      return result;\\n    };\\n\\n    var alias_Window_SaveInfo_initialize = Window_SaveInfo.prototype.initialize;\\n    Window_SaveInfo.prototype.initialize = function(x, y, width, height, mode) {\\n      alias_Window_SaveInfo_initialize.call(this, x, y, width, height, mode);\\n      RS.ArabicMessageSystem.createArabicLayer.call(this);\\n    };\\n\\n    Window_SaveInfo.prototype.refresh = function() {\\n      this.contents.clear();\\n      RS.ArabicMessageSystem.createArabicLayer.call(this);\\n      this.resetFontSettings();\\n      var dy = 0;\\n      dy = this.drawGameTitle(dy);\\n      if (!this._valid) return this.drawInvalidText(dy);\\n      this._saveContents = StorageManager.load(this.savefileId());\\n      this.drawContents(dy);\\n    };\\n\\n    RS.ArabicMessageSystem.defineInitialize(Window_SaveConfirm);\\n\\n  }\"","\"// Specify the symbol name\\nrtlWindowButtonSymbol = \\\"Right to Left\\\";\""]
 *
 * @help
 * =============================================================================
 * Please read this stuff before you begin using this plugin
 * -----------------------------------------------------------------------------
 * This plugin will rewrite everything that is required for Arabic so you will
 * have to notice that it may occur the collision issue with another similar
 * plugin when using this plugin. Please notice to me if it is not working
 * due to the collision issue with another plugin. In that case, I'll react for
 * your comment in some way (This plugin exists purely to help Arabic user or
 * someone else)
 *
 * This version uses PIXI v7 masked animation for smooth right-to-left text reveal.
 * Requires WebGL support for animation effects.
 *
 * === AUTO-DETECTION MODE ===
 * This plugin automatically detects language from rpg_locale.js (LanguageSwitcher).
 * When current language is 'ar' (Arabic), RTL mode is activated automatically.
 * No manual switching needed - just change language in rpg_locale.js!
 *
 * =============================================================================
 * Text codes
 * -----------------------------------------------------------------------------
 * This text code is available to implement the left-to-right language.
 * \LTR<Hello, World!>
 * =============================================================================
 * Compatibility List
 * -----------------------------------------------------------------------------
 * These are some compatible plugin list that are showing up properly Arabic so
 * if it does not have in this list, it may not work properly.
 *
 * Window_Help
 * Window_Status
 * Window_BattleLog
 * Window_MapName
 * Window_Message
 * Window_Command
 * Window_ScrollText
 * Window_ChoiceList
 * YEP_ItemCore >=1.26
 * YEP_X_ItemUpgradeSlots >=1.07
 * YEP_X_ItemDurability >=1.02
 * YEP_MessageCore >=1.15
 * YEP_X_ExtMesPack1 >=1.10
 * YEP_EventMiniLabel
 * YEP_GabWindow
 * YEP_StatusMenuCore >=1.01a
 *
 * When used the Arabic texts into the custom window object that other people
 * are made, It does not automatically change a text align direction. If you want
 * to be used in another plugin, it must be bound all of required code for
 * Arabic texts into it.
 *
 * If you have problems with other plugin after enabling this plugin,
 * Point your web browser to http://biud436.tistory.com/62 and you'll be in
 * contact with me.
 *
 * =============================================================================
 * Change Log
 * -----------------------------------------------------------------------------
 * 2016.09.19 (v1.0.0) - First Release.
 * 2016.09.19 (v1.0.1) - Fixed DrawIcon, DrawFace function.
 * 2016.09.20 (v1.1.0) - Fixed Arabic text sturcture.
 * 2016.09.21 (v1.1.1) - Fixed processNormalCharacter function.
 * 2016.09.23 (v1.1.2) - Fixed the window classes that could be displaying
 * the battle log and map name windows, which have used a drawTextEx function in Arabic.
 * 2016.10.02 (v1.1.3) - Fixed the Arabic compatibility issues with the name box for YEP Message Core.
 * 2016.10.23 (v1.1.4) : Fixed the bug that is not working in RMMV 1.3.2 or more.
 * - Fixed the issue that the scrolling text is not working.
 * - Fixed the issue that YEP Message Core is not working.
 * 2016.10.24 (v1.1.5) - Fixed the renderCanvas function in Scroll Text
 * 2016.11.26 (v1.1.6) - Added certain code to remove the texture from memory.
 * 2017.01.06 (v1.1.7) :
 * - Supported YEP_GabWindow plugin
 * - Supported YEP_EventMiniLabel plugin
 * - Fixed the processNormalCharacter method.
 * 2017.05.05 (v1.1.8) - Fixed the issue that does not properly show up Arabic when using a choice window.
 * 2017.06.03 (v1.1.9) - Fixed an issue that is incorrectly displayed a non-character word : !, @, #, $, dot.
 * 2017.06.14 (v1.2.0) :
 * - Added a new feature that can draw the text one by one.
 * 2017.06.14 (v1.2.1) :
 * - Fixed to appear the text slowly at the right to left.
 * - Added plugin commands for animating text.
 * - Fixed an incorrect text padding in command button.
 * 2017.07.13 (v1.2.2) :
 * - When painting the normal text without processing a text code, Fixed an issue that is incorrectly displayed a non-character word : !, @, #, $, dot
 * 2017.08.03 (v1.2.3) :
 * - Fixed the bug that didn't show up a icon when using a text animation option.
 * - Added a feature that can shows up texts fast.
 * 2017.10.29 (v1.2.4) - Added the scripts binder.
 * 2017.12.12 (v1.2.5) :
 * - Fixed the bug of the swap code that changes the message mode as the normal mode when calculating the text width.
 * - Added a feature that changes a text direction in the Game Option.
 * - Added a feature that saves the config of the text direction as file.
 * 2025.01.XX (v1.3.0) :
 * - MAJOR UPDATE: Replaced character-by-character animation with PIXI v7 mask-based animation
 * - Removed "Animated Text" and "Text Wait Time" parameters (animation now automatic via PIXI)
 * - Removed "Message Mode" parameter - now auto-detects from rpg_locale.js (LanguageSwitcher)
 * - Removed RTL toggle from Options menu - language selection in rpg_locale.js handles this
 * - Updated all PIXI v4 syntax to PIXI v7 (RenderTexture, Container, Graphics, etc.)
 * - Improved performance: Show all text at once with smooth right-to-left reveal
 * - Requires WebGL support for animation effects (graceful fallback to instant display)
 * - Removed EnableArabicTextAnimation/DisableArabicTextAnimation plugin commands
 * - Plugin now acts as helper for rpg_locale.js: Arabic mode activates when language is 'ar'
 */

(() => {
  "use strict";

  const Imported = window.Imported || {};
  const RS = window.RS || {};

  Imported.RS_ArabicMessageSystem = "1.2.5";

  RS.ArabicMessageSystem = RS.ArabicMessageSystem || {};
  RS.ArabicMessageSystem.alias = RS.ArabicMessageSystem.alias || {};

  let parameters = $plugins.filter((i) => {
    return i.description.contains("<RS_ArabicMessageSystem>");
  });

  parameters = parameters.length > 0 && parameters[0].parameters;

  // Auto-detect message mode from LanguageSwitcher (rpg_locale.js)
  // Returns 'arabic' if current language is 'ar', otherwise 'normal'
  function getMessageMode() {
    if (
      window.LanguageSwitcher &&
      typeof LanguageSwitcher.getCurrentLanguage === "function"
    ) {
      const currentLang = LanguageSwitcher.getCurrentLanguage();
      return currentLang === "ar" ? "arabic" : "normal";
    }
    // Fallback: Check browser language
    return navigator.language.match(/^ar/) ? "arabic" : "normal";
  }

  // Dynamic getter for messageMode (always up-to-date with current language)
  let messageMode = getMessageMode();

  const arabicFont = String(
    parameters["Arabic Font"] || "Simplified Arabic, Times New Roman, Segoe UI",
  );

  RS.ArabicMessageSystem.Params = RS.ArabicMessageSystem.Params || {};
  RS.ArabicMessageSystem.Params.fontSize = parseInt(
    parameters["Font Size"] || 28,
    10,
  );
  RS.ArabicMessageSystem.Params.textRevealSpeed = parseInt(
    parameters["Text Reveal Speed"] || 2,
    10,
  );
  RS.ArabicMessageSystem.Params.sequentialAnimation =
    parameters["Sequential Animation"] === "true";
  RS.ArabicMessageSystem.Params.bindScripts = (function () {
    const src = parameters.Binder;
    const jsonParse = function (str) {
      const retData = JSON.parse(str, (k, v) => {
        try {
          return jsonParse(v);
        } catch (e) {
          return v;
        }
      });
      return retData;
    };
    const data = jsonParse(src);
    if (data instanceof Array) {
      return data;
    }
    return [];
  })();

  //============================================================================
  // ArabicUtils
  // http://www.unicode.org/Public/UNIDATA/Scripts.txt
  //============================================================================

  function ArabicUtils() {
    throw new Error("This is a static class");
  }

  ArabicUtils.LEFT_TO_RIGHT_EMBEDDING = "\u202A";
  ArabicUtils.RIGHT_TO_LEFT_EMBEDDING = "\u202B";
  ArabicUtils.POP_DIRECTIONAL_FORMATTING = "\u202C";
  ArabicUtils.LEFT_TO_RIGHT_OVERRIDE = "\u202D";
  ArabicUtils.RIGHT_TO_LEFT_OVERRIDE = "\u202E";
  ArabicUtils.LEFT_TO_RIGHT_ISOLATE = "\u2066";
  ArabicUtils.RIGHT_TO_LEFT_ISOLATE = "\u2067";
  ArabicUtils.FIRST_STRONG_ISOLATE = "\u2068";
  ArabicUtils.POP_DIRECTIONAL_ISOLATE = "\u2069";

  ArabicUtils.isArabic = function (text) {
    const pattern =
      /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFD\uFE70-\uFEFF\u10E600-\u10E7E\u1EE00-\u1EEFF]/;
    return pattern.test(text);
  };

  ArabicUtils.makeText = function (text) {
    return String(ArabicUtils.RIGHT_TO_LEFT_EMBEDDING + text);
  };

  window.ArabicUtils = ArabicUtils;

  //============================================================================
  // RS.ArabicMessageSystem
  //============================================================================

  RS.ArabicMessageSystem.createArabicLayer = function () {
    if (getMessageMode() === "arabic") {
      const canvas = document.querySelector("canvas");
      if (canvas.dir !== "rtl") canvas.dir = "rtl";
      if (this._arabicTexts) {
        this._windowContentsSprite.removeChild(this._arabicTexts);
        this._arabicTexts = null;
      }
      this._arabicTexts = new ArabicFlipSprite();
      this._arabicTexts._isMessageAracbic = true;
      this._arabicTexts.pivot.x = this.contentsWidth() - this.textPadding();
      this._arabicTexts.scale.x = -1;
      this._arabicTexts.visible = true;

      if (!(this instanceof Window_ScrollText)) {
        this._windowContentsSprite.addChild(this._arabicTexts);
      }
    }
  };

  RS.ArabicMessageSystem.defineProtoype = function () {};

  RS.ArabicMessageSystem.defineInitialize = function (className) {
    const aliasName = "alias_%1_initialize".format(className);
    RS.ArabicMessageSystem.alias[aliasName] = className.prototype.initialize;
    className.prototype.initialize = function () {
      RS.ArabicMessageSystem.alias[aliasName].call(this);
      RS.ArabicMessageSystem.createArabicLayer.call(this);
    };
    RS.ArabicMessageSystem.defineRefresh(className);
    RS.ArabicMessageSystem.defineProtoype(className);
  };

  RS.ArabicMessageSystem.defineInitialize2 = function (className, initializer) {
    const aliasName = "alias_%1_initialize".format(className);
    RS.ArabicMessageSystem.alias[aliasName] = className.prototype.initialize;
    className.prototype.initialize = initializer.bind(className.prototype);
    RS.ArabicMessageSystem.defineRefresh(className);
    RS.ArabicMessageSystem.defineProtoype(className);
  };

  RS.ArabicMessageSystem.defineRefresh = function (className) {
    const aliasRefresh = "alias_%1_refresh".format(className);
    RS.ArabicMessageSystem.alias[aliasRefresh] = className.prototype.refresh;
    className.prototype.refresh = function () {
      RS.ArabicMessageSystem.createArabicLayer.call(this);
      RS.ArabicMessageSystem.alias[aliasRefresh].call(this);
    };
  };

  RS.ArabicMessageSystem.defineAlias = function (className) {
    const aliasRefresh = "alias_%1_refresh".format(className);
    RS.ArabicMessageSystem.alias[aliasRefresh] = className.prototype.refresh;
    return RS.ArabicMessageSystem.alias[aliasRefresh];
  };

  //============================================================================
  // Bitmap
  //============================================================================

  const alias_Bitmap_drawText = Bitmap.prototype.drawText;
  Bitmap.prototype.drawText = function (
    text,
    x,
    y,
    maxWidth,
    lineHeight,
    align,
  ) {
    const isArabic = ArabicUtils.isArabic(text);
    if (isArabic) {
      const retText = ArabicUtils.makeText(text);
      alias_Bitmap_drawText.call(
        this,
        retText,
        x,
        y,
        maxWidth,
        lineHeight,
        align,
      );
    } else {
      alias_Bitmap_drawText.call(this, text, x, y, maxWidth, lineHeight, align);
    }
  };

  Bitmap.prototype.RTLblt = function (source, sx, sy, sw, sh, dx, dy, dw, dh) {
    dw = dw || sw;
    dh = dh || sh;
    if (
      sx >= 0 &&
      sy >= 0 &&
      sw > 0 &&
      sh > 0 &&
      dw > 0 &&
      dh > 0 &&
      sx + sw <= source.width &&
      sy + sh <= source.height
    ) {
      this._context.setTransform(-1, 0, 0, 1, sw, 0);
      this._context.globalCompositeOperation = "source-over";
      this._context.drawImage(source._canvas, sx, sy, sw, sh, dx, dy, dw, dh);
      this._context.setTransform(1, 0, 0, 1, 0, 0);
      this._setDirty();
    }
  };

  //============================================================================
  // ArabicFlipSprite
  //============================================================================

  function ArabicFlipSprite(...args) {
    // eslint-disable-next-line prefer-spread
    this.initialize.apply(this, args);
  }

  ArabicFlipSprite.prototype = Object.create(Sprite.prototype);
  ArabicFlipSprite.prototype.constructor = ArabicFlipSprite;

  ArabicFlipSprite.prototype.initialize = function (bitmap) {
    this._offset = new Point();
    Sprite.prototype.initialize.call(this, bitmap);
    this._isMessageAracbic = false;
    // PIXI v7: Filters array can be empty by default
    if (Graphics.isWebGL()) {
      this.filters = [];
    }
  };

  ArabicFlipSprite.prototype._refresh = function () {
    const frameX = Math.floor(this._frame.x);
    const frameY = Math.floor(this._frame.y);
    const frameW = Math.floor(this._frame.width);
    const frameH = Math.floor(this._frame.height);
    const bitmapW = this._bitmap ? this._bitmap.width : 0;
    const bitmapH = this._bitmap ? this._bitmap.height : 0;
    const realX = frameX.clamp(0, bitmapW);
    const realY = frameY.clamp(0, bitmapH);
    const realW = (frameW - realX + frameX).clamp(0, bitmapW - realX);
    const realH = (frameH - realY + frameY).clamp(0, bitmapH - realY);

    this._realFrame.x = realX;
    this._realFrame.y = realY;
    this._realFrame.width = realW;
    this._realFrame.height = realH;
    if (this._isMessageAracbic) {
      this.pivot.x = frameW - frameX - realX;
    } else {
      this.pivot.x = frameX - realX;
    }
    this.pivot.y = frameY - realY;

    if (realW > 0 && realH > 0) {
      if (this._needsTint()) {
        this._createTinter(realW, realH);
        this._executeTint(realX, realY, realW, realH);
        this._tintTexture.update();
        this.texture.baseTexture = this._tintTexture;
        this.texture.frame = new Rectangle(0, 0, realW, realH);
      } else {
        if (this._bitmap) {
          this.texture.baseTexture = this._bitmap.baseTexture;
        }
        this.texture.frame = this._realFrame;
      }
    } else if (this._bitmap) {
      this.texture.frame = Rectangle.emptyRectangle;
    } else {
      // PIXI v7: baseTexture resize is handled internally
      // Just set the frame
      this.texture.frame = this._frame;
    }
    // PIXI v7: Update texture version
    this.texture.update();
  };

  Object.defineProperties(ArabicFlipSprite.prototype, {
    offsetX: {
      get() {
        if (this._arabicFlipFilter) {
          return this._arabicFlipFilter.offsetX;
        }
        return 0;
      },
      set(value) {
        if (this._arabicFlipFilter) {
          this._arabicFlipFilter.offsetX = value;
        }
      },
    },
  });

  //============================================================================
  // ArabicTextAnimator - PIXI v7 Masked Text Animation
  //============================================================================

  /**
   * Animated Arabic text with right-to-left reveal using PIXI mask
   */
  class ArabicTextAnimator {
    constructor(bitmap, text, x, y, maxWidth, lineHeight) {
      this.bitmap = bitmap;
      this.text = text;
      this.x = x;
      this.y = y;
      this.maxWidth = maxWidth;
      this.lineHeight = lineHeight;

      this.progress = 0; // 0 to 1
      this.isFinished = false;
      this.textSprite = null;
      this.maskSprite = null;
      this.container = null;
      this.addedToWindow = false;

      // CRITICAL: Calculate speed based on text length for consistent reveal rate
      // This ensures short and long text reveal at same character-per-frame speed
      this.textLength = ArabicUtils.makeText(text).length;
      this.charactersPerFrame =
        RS.ArabicMessageSystem.Params.textRevealSpeed || 2;
      this.speedPerFrame =
        this.textLength > 0 ? this.charactersPerFrame / this.textLength : 1;
    }

    /**
     * Initialize PIXI sprites for masked animation
     */
    initialize() {
      if (!Graphics.isWebGL()) {
        console.warn("[ArabicTextAnimator] WebGL required for mask animation");
        return false;
      }

      // Render text to temporary bitmap first
      const tempBitmap = new Bitmap(this.maxWidth, this.lineHeight * 1.5);
      tempBitmap.fontFace = this.bitmap.fontFace;
      tempBitmap.fontSize = this.bitmap.fontSize;
      tempBitmap.fontItalic = this.bitmap.fontItalic;
      tempBitmap.textColor = this.bitmap.textColor;
      tempBitmap.outlineColor = this.bitmap.outlineColor;
      tempBitmap.outlineWidth = this.bitmap.outlineWidth;

      // Draw wrapped Arabic text
      const wrappedText = ArabicUtils.makeText(this.text);
      tempBitmap.drawText(
        wrappedText,
        0,
        0,
        this.maxWidth,
        this.lineHeight,
        "left",
      );

      // Create PIXI Sprite from bitmap
      if (!tempBitmap.baseTexture) {
        console.warn("[ArabicTextAnimator] Failed to create texture");
        return false;
      }

      this.textSprite = new PIXI.Sprite(PIXI.Texture.from(tempBitmap._canvas));
      this.textSprite.x = 0; // Position relative to container
      this.textSprite.y = 0;

      // Create mask sprite (white rectangle that will be animated)
      this.maskSprite = new PIXI.Graphics();
      this.maskSprite.x = 0; // Position relative to container
      this.maskSprite.y = 0;

      // Create container and add sprites
      this.container = new PIXI.Container();
      this.container.x = this.x;
      this.container.y = this.y;

      // CRITICAL: Counter-flip because parent (_arabicTexts) is already flipped with scale.x = -1
      // This ensures text appears correctly (not mirrored)
      this.container.scale.x = -1;
      this.container.pivot.x = this.maxWidth / 2;

      this.container.addChild(this.maskSprite);
      this.container.addChild(this.textSprite);

      // Apply mask (PIXI v7 mask property)
      this.textSprite.mask = this.maskSprite;

      return true;
    }

    /**
     * Update animation progress
     * Uses internal speedPerFrame calculated from text length for consistent reveal rate
     */
    update() {
      if (this.isFinished) return;

      // Use calculated speed based on text length
      this.progress = Math.min(1, this.progress + this.speedPerFrame);

      // Update mask position (reveal from right to left in local space)
      // Container is counter-flipped, so we reveal RTL in local = RTL in screen too!
      const revealWidth = this.maxWidth * this.progress;
      const maskX = this.maxWidth - revealWidth; // Start from right side

      this.maskSprite.clear();
      // PIXI v7 syntax
      this.maskSprite.beginFill(0xffffff, 1);
      this.maskSprite.drawRect(maskX, 0, revealWidth, this.lineHeight * 1.5);
      this.maskSprite.endFill();

      if (this.progress >= 1) {
        this.isFinished = true;
      }
    }

    /**
     * Add animated sprite to window contents
     * @param {Window_Message} window - Message window
     */
    addToWindow(window) {
      if (!this.textSprite || !window._arabicTexts) return false;

      // Safety check: prevent adding to wrong window
      if (this.addedToWindow) return false;

      // Add container to Arabic flip layer
      window._arabicTexts.addChild(this.container);
      this.addedToWindow = true;

      return true;
    }

    /**
     * Remove from window and cleanup
     */
    remove() {
      try {
        // Step 1: Remove mask reference to break circular refs
        if (this.textSprite) {
          this.textSprite.mask = null;
          this.textSprite = null;
        }

        // Step 2: Disconnect mask sprite
        if (this.maskSprite) {
          this.maskSprite.clear();
          this.maskSprite = null;
        }

        // Step 3: Remove container from parent's children array
        if (this.container && this.container.parent) {
          this.container.parent.removeChild(this.container);
        }

        // Step 4: Fully destroy PIXI container and its children
        if (this.container) {
          this.container.destroy({
            children: true,
            texture: false,
            baseTexture: false,
          });
          this.container = null;
        }
      } catch (e) {
        console.warn("[ArabicTextAnimator] Error during cleanup:", e);
      }
    }
  }

  window.ArabicTextAnimator = ArabicTextAnimator;

  //============================================================================
  // Window_Base
  //============================================================================

  const alias_Window_Base_standardFontFace =
    Window_Base.prototype.standardFontFace;
  Window_Base.prototype.standardFontFace = function () {
    if (getMessageMode() === "arabic") {
      return arabicFont;
    }

    return alias_Window_Base_standardFontFace.call(this);
  };

  Window_Base.prototype.createArabicText = function (
    text,
    x,
    y,
    maxWidth,
    lineHeight,
    align,
  ) {
    // Initialize
    if (ArabicUtils.isArabic(text)) {
      text = ArabicUtils.makeText(text);
    }

    const maxHeight = lineHeight + Math.floor(lineHeight * 0.5);
    const bitmap = new Bitmap(maxWidth, maxHeight);
    const sprite = new Sprite(bitmap);

    const yPad = Math.round(this.contents.fontSize * 0.09);

    // Set by copying the text properties
    bitmap.fontFace = this.contents.fontFace;
    bitmap.fontSize = this.contents.fontSize;
    bitmap.fontItalic = this.contents.fontItalic;
    bitmap.textColor = this.contents.textColor;
    bitmap.outlineColor = this.contents.outlineColor;
    bitmap.outlineWidth = this.contents.outlineWidth;

    sprite.bitmap.drawText(text, 0, yPad, maxWidth, lineHeight, align);

    // Set Flip Text
    sprite.x = x;
    sprite.y = y;
    sprite.pivot.x = maxWidth / 2;
    sprite.scale.x = -1;

    // Add Child
    if (this._arabicTexts) this._arabicTexts.addChild(sprite);
  };

  const alias_Window_Base_processNormalCharacter =
    Window_Base.prototype.processNormalCharacter;
  Window_Base.prototype.processNormalCharacter = function (textState) {
    // Only use custom processing for Arabic mode
    if (getMessageMode() !== "arabic") {
      return alias_Window_Base_processNormalCharacter.call(this, textState);
    }

    // Arabic-specific processing
    const szCompositionText = textState.text
      .slice(textState.index++)
      .split("\n");
    const szValidText = szCompositionText[0];

    const [szResultText] = szValidText.split("\x1b");
    textState.index += szResultText.length - 1;

    // Draw Text (Arabic mode only)
    const c = szResultText;
    const w = this.textWidth(c);

    this.createArabicText(c, textState.x, textState.y, w * 2, textState.height);

    textState.x += w;
  };

  const alias_Window_Base_processEscapeCharacter =
    Window_Base.prototype.processEscapeCharacter;
  Window_Base.prototype.processEscapeCharacter = function (code, textState) {
    switch (code) {
      case "LTR":
        if (getMessageMode() === "arabic") {
          this.drawLeftToRightText(this.obtainLTRText(textState), textState);
        }
        break;
      default:
        alias_Window_Base_processEscapeCharacter.call(this, code, textState);
    }
  };

  Window_Base.prototype.obtainLTRText = function (textState) {
    const arr = /^<(.+)>/.exec(textState.text.slice(textState.index));
    if (arr) {
      textState.index += arr[0].length;
      return String(arr[1]);
    }

    return "";
  };

  Window_Base.prototype.drawLeftToRightText = function (text, textState) {
    const c = ArabicUtils.LEFT_TO_RIGHT_EMBEDDING + text;
    const w = this.textWidth(c);
    this.createArabicText(c, textState.x, textState.y, w * 2, textState.height);
    textState.x += w;
  };

  const alias_Window_Base_drawIcon = Window_Base.prototype.drawIcon;
  Window_Base.prototype.drawIcon = function (iconIndex, x, y) {
    if (getMessageMode() === "arabic" && this._arabicTexts) {
      const bitmap = ImageManager.loadSystem("IconSet");

      const pw = Window_Base._iconWidth;
      const ph = Window_Base._iconHeight;

      const sx = (iconIndex % 16) * pw;
      const sy = Math.floor(iconIndex / 16) * ph;

      const tempBitmap = new Bitmap(pw, ph);
      const sprite = new Sprite(tempBitmap);

      sprite.x = x;
      sprite.y = y;
      sprite.pivot.x = pw - 2;
      sprite.scale.x = -1;

      sprite.bitmap.blt(bitmap, sx, sy, pw, ph, 0, 0);

      this._arabicTexts.addChild(sprite);
    } else {
      alias_Window_Base_drawIcon.call(this, iconIndex, x, y);
    }
  };

  //============================================================================
  // Window_Message
  //============================================================================

  const alias_Window_Message_initialize = Window_Message.prototype.initialize;
  Window_Message.prototype.initialize = function () {
    alias_Window_Message_initialize.call(this);
  };

  // PIXI v7 compatible: Override _createAllParts to use ArabicFlipSprite for contents
  Window_Message.prototype._createAllParts = function () {
    this._windowSpriteContainer = new PIXI.Container();
    this._windowBackSprite = new Sprite();
    this._windowCursorSprite = new Sprite();
    this._windowFrameSprite = new Sprite();

    // Use ArabicFlipSprite for window contents to support flipping
    this._windowContentsSprite = new ArabicFlipSprite();

    this._downArrowSprite = new Sprite();
    this._upArrowSprite = new Sprite();
    this._windowPauseSignSprite = new Sprite();
    this._windowBackSprite.bitmap = new Bitmap(1, 1);
    this._windowBackSprite.alpha = 192 / 255;

    // Build display hierarchy
    this.addChild(this._windowSpriteContainer);
    this._windowSpriteContainer.addChild(this._windowBackSprite);
    this._windowSpriteContainer.addChild(this._windowFrameSprite);
    this.addChild(this._windowCursorSprite);
    this.addChild(this._windowContentsSprite);
    this.addChild(this._downArrowSprite);
    this.addChild(this._upArrowSprite);
    this.addChild(this._windowPauseSignSprite);
  };

  const alias_Window_Message_standardFontSize =
    Window_Message.prototype.standardFontSize;
  Window_Message.prototype.standardFontSize = function () {
    if (getMessageMode() === "arabic") {
      return RS.ArabicMessageSystem.Params.fontSize;
    }
    return alias_Window_Message_standardFontSize.call(this);
  };

  const alias_Window_Message_newPage = Window_Message.prototype.newPage;
  Window_Message.prototype.newPage = function (textState) {
    if (getMessageMode() === "arabic") {
      // Cleanup old animators
      if (this._arabicAnimators) {
        while (this._arabicAnimators.length > 0) {
          const animator = this._arabicAnimators.pop();
          animator.remove();
        }
      }

      if (this._arabicTexts) {
        this._windowContentsSprite.removeChild(this._arabicTexts);
        this._arabicTexts = null;
      }
      this._windowContentsSprite.pivot.x = this.contentsWidth();
      this._windowContentsSprite.scale.x = -1;
      this._windowContentsSprite._isMessageAracbic = true;
      document.querySelector("canvas").dir = "rtl";

      // Use simple PIXI Container for animators
      this._arabicTexts = new PIXI.Container();
      this._arabicTexts.visible = true;
      this._windowContentsSprite.addChild(this._arabicTexts);

      // Initialize animator array
      this._arabicAnimators = [];
    } else {
      this._windowContentsSprite.pivot.x = 0;
      this._windowContentsSprite.scale.x = 1;
    }
    alias_Window_Message_newPage.call(this, textState);
  };

  Window_Message.prototype.createArabicText = function (
    text,
    x,
    y,
    maxWidth,
    lineHeight,
    align,
  ) {
    // Use PIXI masked animation if WebGL is available and not showing fast
    const useAnimation = Graphics.isWebGL() && !this._showFast;

    if (useAnimation) {
      // Create animator instance
      const animator = new ArabicTextAnimator(
        this.contents,
        text,
        x,
        y,
        maxWidth,
        lineHeight,
      );

      // Initialize PIXI sprites
      if (animator.initialize()) {
        animator.addToWindow(this);
        if (!this._arabicAnimators) this._arabicAnimators = [];
        this._arabicAnimators.push(animator);
      }
    } else {
      // Show text immediately without animation
      text = ArabicUtils.makeText(text);

      const maxHeight = lineHeight + Math.floor(lineHeight * 0.5);
      const bitmap = new Bitmap(maxWidth, maxHeight);
      const sprite = new Sprite(bitmap);

      const thresholdValue = 0.09;
      const yPad = Math.round(this.contents.fontSize * thresholdValue);

      // Set by copying the text properties
      bitmap.fontFace = this.contents.fontFace;
      bitmap.fontSize = this.contents.fontSize;
      bitmap.fontItalic = this.contents.fontItalic;
      bitmap.textColor = this.contents.textColor;
      bitmap.outlineColor = this.contents.outlineColor;
      bitmap.outlineWidth = this.contents.outlineWidth;

      // Set Flip Text
      sprite.x = x;
      sprite.y = y;
      sprite.pivot.x = maxWidth / 2;
      sprite.scale.x = -1;

      sprite.bitmap.drawText(text, 0, yPad, maxWidth, lineHeight, align);

      // Add Child
      if (this._arabicTexts) this._arabicTexts.addChild(sprite);
    }
  };

  const alias_Window_Message_processNormalCharacter =
    Window_Message.prototype.processNormalCharacter;
  Window_Message.prototype.processNormalCharacter = function (textState) {
    alias_Window_Message_processNormalCharacter.call(this, textState);
    // Add small wait for animation pacing (only if using WebGL animation)
    if (
      !this._showFast &&
      Graphics.isWebGL() &&
      getMessageMode() === "arabic"
    ) {
      this.startWait(15); // 15ms wait time for animation
    }
  };

  // Override update to animate Arabic text
  const alias_Window_Message_update = Window_Message.prototype.update;
  Window_Message.prototype.update = function () {
    if (this._arabicAnimators && this._arabicAnimators.length > 0) {
      const isSequential = RS.ArabicMessageSystem.Params.sequentialAnimation;

      if (isSequential) {
        // SEQUENTIAL MODE: Only animate one line at a time (wait for previous to finish)
        // Find the first unfinished animator
        let currentAnimatorIndex = -1;
        for (let i = 0; i < this._arabicAnimators.length; i++) {
          if (!this._arabicAnimators[i].isFinished) {
            currentAnimatorIndex = i;
            break;
          }
        }

        // Update ONLY the current animator (others wait in queue)
        if (currentAnimatorIndex >= 0) {
          const animator = this._arabicAnimators[currentAnimatorIndex];
          animator.update(); // Speed is calculated internally based on text length
        }
      } else {
        // PARALLEL MODE: Animate all lines together (original behavior)
        for (let i = 0; i < this._arabicAnimators.length; i++) {
          const animator = this._arabicAnimators[i];

          // Only update if still animating (not finished)
          if (!animator.isFinished) {
            animator.update(); // Speed is calculated internally based on text length
          }
        }
      }
    }

    alias_Window_Message_update.call(this);
  };

  const alias_Window_Message_drawIcon = Window_Message.prototype.drawIcon;
  Window_Message.prototype.drawIcon = function (iconIndex, x, y) {
    if (getMessageMode() === "arabic") {
      const bitmap = ImageManager.loadSystem("IconSet");

      const pw = Window_Base._iconWidth;
      const ph = Window_Base._iconHeight;

      const sx = (iconIndex % 16) * pw;
      const sy = Math.floor(iconIndex / 16) * ph;

      const tempBitmap = new Bitmap(pw, ph);

      const sprite = new Sprite(tempBitmap);

      sprite.x = x;
      sprite.y = y;
      sprite.pivot.x = pw - 2;
      sprite.scale.x = -1;

      setTimeout(() => {
        sprite.bitmap.blt(bitmap, sx, sy, pw, ph, 0, 0);
      }, 0);

      if (this._arabicTexts) {
        this._arabicTexts.addChild(sprite);
      }
    } else {
      alias_Window_Message_drawIcon.call(this, iconIndex, x, y);
    }
  };

  const alias_Window_Message_drawFace = Window_Message.prototype.drawFace;
  Window_Message.prototype.drawFace = function (
    faceName,
    faceIndex,
    x,
    y,
    width,
    height,
  ) {
    if (getMessageMode() === "arabic") {
      width = width || Window_Base._faceWidth;
      height = height || Window_Base._faceHeight;
      const bitmap = ImageManager.loadFace(faceName);
      const pw = Window_Base._faceWidth;
      const ph = Window_Base._faceHeight;
      const sw = Math.min(width, pw);
      const sh = Math.min(height, ph);
      const dx = Math.floor(x + Math.max(width - pw, 0) / 2);
      const dy = Math.floor(y + Math.max(height - ph, 0) / 2);
      const sx = (faceIndex % 4) * pw + (pw - sw) / 2;
      const sy = Math.floor(faceIndex / 4) * ph + (ph - sh) / 2;
      this.contents.RTLblt(bitmap, sx, sy, sw, sh, dx, dy);
    } else {
      alias_Window_Message_drawFace.call(
        this,
        faceName,
        faceIndex,
        x,
        y,
        width,
        height,
      );
    }
  };

  // Override terminateMessage to cleanup animators
  const alias_Window_Message_terminateMessage =
    Window_Message.prototype.terminateMessage;
  Window_Message.prototype.terminateMessage = function () {
    // Cleanup ALL animators
    if (this._arabicAnimators) {
      while (this._arabicAnimators.length > 0) {
        const animator = this._arabicAnimators.pop();
        animator.remove();
      }
      this._arabicAnimators = [];
    }

    alias_Window_Message_terminateMessage.call(this);
  };

  //============================================================================
  // Window_Command
  //============================================================================

  const alias_Window_Command_drawItem = Window_Command.prototype.drawItem;
  Window_Command.prototype.drawItem = function (index) {
    if (getMessageMode() !== "arabic") {
      alias_Window_Command_drawItem.call(this, index);
      return;
    }
    const rect = this.itemRectForText(index);
    const align = this.itemTextAlign();
    let x = 0;
    if (align !== "center" && align !== "right") {
      x = rect.x + rect.width - this.textWidth(this.commandName(index));
    } else {
      x = rect.x;
    }
    this.resetTextColor();
    this.changePaintOpacity(this.isCommandEnabled(index));
    this.drawText(this.commandName(index), x, rect.y, rect.width, align);
  };

  //============================================================================
  // Define Classes
  //============================================================================

  RS.ArabicMessageSystem.defineInitialize2(Window_Help, function (numLines) {
    const aliasName = "alias_%1_initialize".format(Window_Help);
    RS.ArabicMessageSystem.alias[aliasName].call(this, numLines);
    RS.ArabicMessageSystem.createArabicLayer.call(this);
  });

  RS.ArabicMessageSystem.defineInitialize(Window_Status);
  RS.ArabicMessageSystem.defineInitialize(Window_BattleLog);
  RS.ArabicMessageSystem.defineInitialize(Window_MapName);

  //============================================================================
  // Script Binder
  //============================================================================
  RS.ArabicMessageSystem.Params.bindScripts.forEach((el) => {
    try {
      // eslint-disable-next-line no-eval
      eval(el);
    } catch (e) {
      console.warn(e);
    }
  });

  //============================================================================
  // Window_ScrollText
  //============================================================================

  RS.ArabicMessageSystem.defineInitialize(Window_ScrollText);

  const alias_Window_ScrollText_initialize =
    Window_ScrollText.prototype.initialize;
  Window_ScrollText.prototype.initialize = function () {
    alias_Window_ScrollText_initialize.call(this);

    const self = this;

    // PIXI v7: Create RenderTexture with updated syntax
    // SCALE_MODES is now part of PIXI.SCALE_MODES or use constants
    const scaleMode = PIXI.SCALE_MODES ? PIXI.SCALE_MODES.NEAREST : 0;

    self._renderTexture = PIXI.RenderTexture.create({
      width: self.width,
      height: self.height,
      scaleMode: scaleMode,
    });

    // PIXI v7: RenderTarget is deprecated, renderer handles this internally
    // We'll use RenderTexture directly in render methods
  };

  Window_ScrollText.prototype.standardFontFace = function () {
    if (getMessageMode() === "arabic") {
      return arabicFont;
    }

    return alias_Window_Base_standardFontFace.call(this);
  };

  const alias_Window_ScrollText_update = Window_ScrollText.prototype.update;
  Window_ScrollText.prototype.update = function () {
    alias_Window_ScrollText_update.call(this);
    if (this._arabicTexts && this._arabicTexts.visible) {
      this._arabicTexts.pivot.y = this.origin.y;
    }
  };

  const alias_Window_ScrollText_destroy = Window_ScrollText.prototype.destroy;
  Window_ScrollText.prototype.destroy = function (options) {
    if (alias_Window_ScrollText_destroy)
      alias_Window_ScrollText_destroy.call(this, options);
    // PIXI v7: Properly destroy RenderTexture
    if (this._renderTexture) {
      this._renderTexture.destroy(true); // destroyBase = true
    }
    this._renderTexture = null;
  };

  Window_ScrollText.prototype.renderCanvas = function (renderer) {
    if (!this.visible || !this.renderable) {
      return;
    }

    const layers = this.children;
    for (let i = 0; i < layers.length; i++) layers[i].renderCanvas(renderer);

    if (this._arabicTexts && this._arabicTexts.parent !== this) {
      this._arabicTexts.setParent(this);
    }

    for (let i = 0; i < this._arabicTexts.children.length; i++) {
      const child = this._arabicTexts.children[i];
      if (child) renderer.plugins.sprite.render(child);
    }
  };

  Window_ScrollText.prototype.renderWebGL = function (renderer) {
    if (!this.visible || !this.renderable) {
      return;
    }

    // PIXI v7: Use renderer.render with RenderTexture directly
    // No need for bindRenderTexture/bindRenderTarget
    const len = this._children.length;
    for (let i = 0; i < len; ++i) {
      const child = this.children[i];
      if (child && child.visible) {
        renderer.render(child, {
          renderTexture: this._renderTexture,
          clear: false,
        });
      }
    }

    const isVisible = this._arabicTexts && this._arabicTexts.visible;
    if (isVisible) {
      renderer.render(this._arabicTexts, {
        renderTexture: this._renderTexture,
        clear: false,
      });
    }
  };

  //============================================================================
  // Window_ChoiceList
  //============================================================================

  const alias_Window_ChoiceList_initialize =
    Window_ChoiceList.prototype.initialize;
  Window_ChoiceList.prototype.initialize = function (messageWindow) {
    alias_Window_ChoiceList_initialize.call(this, messageWindow);
    if (getMessageMode() === "arabic") {
      RS.ArabicMessageSystem.createArabicLayer.call(this);
      RS.ArabicMessageSystem.defineProtoype(Window_ChoiceList);
    }
  };

  Window_ChoiceList.prototype.textWidthEx = function (text) {
    // Temporarily switch to normal mode for width calculation
    const originalMode = getMessageMode();
    // We can't directly change getMessageMode() result, but we can use a flag
    // For simplicity, just calculate width assuming LTR
    const ret = Window_Base.prototype.drawTextEx.call(
      this,
      text,
      0,
      this.contents.height,
    );
    return ret;
  };

  Window_ChoiceList.prototype.refresh = function () {
    this.clearCommandList();
    this.makeCommandList();
    this.createContents();
    if (this.contents) {
      this.contents.clear();
      if (getMessageMode() === "arabic") {
        RS.ArabicMessageSystem.createArabicLayer.call(this);
      }
      this.drawAllItems();
    }
  };

  //===========================================================================
  // ConfigManager & Window_Options
  //===========================================================================
  // RTL mode is now auto-detected from LanguageSwitcher (rpg_locale.js)
  // No manual toggle needed - language selection in rpg_locale.js handles this

  //===========================================================================
  // Game_Interpreter
  //===========================================================================
  // Plugin commands removed: Animation is now automatic via PIXI masks
  // No need for EnableArabicTextAnimation/DisableArabicTextAnimation
})();
