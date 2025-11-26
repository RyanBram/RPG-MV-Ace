//=============================================================================
//  Keke_KageMaster - 影マスターMV
// バージョン: 3.4
//=============================================================================
// Copyright (c) 2020 ケケー
// Released under the MIT license
// http://opensource.org/licenses/mit-license.php
//=============================================================================

/*:
 * @plugindesc Easily attach realistic shadows freely
 * @author ケケー
 * 
 * 
 * 
 * @param Player Shadow Type
 * @desc - The shape of the player's shadow. Three types: 'real' which conforms to the body shape, 'circle' for simple circle, 'none' to display no shadow. Default: real
 * @type select
 * @option real
 * @option circle
 * @option none
 * @default real
 * 
 * @param Character Shadow Type
 * @desc - The shape of the character's shadow. Three types: 'real' which conforms to the body shape, 'circle' for simple circle, 'none' to display no shadow. Default: real
 * @type select
 * @option real
 * @option circle
 * @option none
 * @default real
 * 
 * @param Object Shadow Type
 * @desc - The shape of the object's shadow. Objects are events with image files starting with '!'. Default: real
 * @type select
 * @option real
 * @option circle
 * @option none
 * @default real
 * 
 * @param Vehicle Shadow Type
 * @desc - The shape of the vehicle's shadow. Default: real
 * @type select
 * @option real
 * @option circle
 * @option none
 * @default real
 * 
 * @param Actor Shadow Type
 * @desc - The shape of the actor's shadow. Three types: 'real' which conforms to the body shape, 'circle' for simple circle, 'none' to display no shadow. Default: real
 * @type select
 * @option real
 * @option circle
 * @option none
 * @default real
 * 
 * @param Enemy Shadow Type
 * @desc - The shape of the enemy's shadow. Three types: 'real' which conforms to the body shape, 'circle' for simple circle, 'none' to display no shadow. Default: real
 * @type select
 * @option real
 * @option circle
 * @option none
 * @default real
 * 
 * @param Map/Shadow Position (Real)
 * @desc Position of the shadow in real shape. The first number is X-axis, the second is Y-axis. Higher numbers move it to the bottom right - Default: [20, -25]
 * @default [20, -25]
 * 
 * @param Map/Shadow Position (Circle)
 * @desc Position of the shadow in circle shape. The first number is X-axis, the second is Y-axis. Higher numbers move it to the bottom right - Default: [0, -5]
 * @default [0, -5]
 * 
 * @param Map/Shadow Size (Real)
 * @desc Size of the shadow in real shape. The first number is X-axis, the second is Y-axis - Default: [110, 50]
 * @default [110, 50]
 * 
 * @param Map/Shadow Size (Circle)
 * @desc Size of the shadow in circle shape. The first number is X-axis, the second is Y-axis - Default: [85, 30]
 * @default [85, 30]
 * 
 * @param Map/Shadow Angle
 * @desc The tilt angle of the shadow. Increasing the number rotates it clockwise - Default: 0
 * @default 0
 * 
 * @param Battle/Shadow Position (Real)
 * @desc Position of the shadow in real shape. The first number is X-axis, the second is Y-axis. Higher numbers move it to the bottom right - Default: [20, -25]
 * @default [20, -25]
 * 
 * @param Battle/Shadow Position (Circle)
 * @desc Position of the shadow in circle shape. The first number is X-axis, the second is Y-axis. Higher numbers move it to the bottom right - Default: [0, -5]
 * @default [0, -5]
 * 
 * @param Battle/Shadow Size (Real)
 * @desc Size of the shadow in real shape. The first number is X-axis, the second is Y-axis - Default: [110, 50]
 * @default [110, 50]
 * 
 * @param Battle/Shadow Size (Circle)
 * @desc Size of the shadow in circle shape. The first number is X-axis, the second is Y-axis - Default: [85, 30]
 * @default [85, 30]
 * 
 * @param Battle/Shadow Angle
 * @desc The tilt angle of the shadow. Increasing the number rotates it clockwise - Default: 0
 * @default 0
 * 
 * @param Shadow Opacity
 * @desc The density of the shadow. Higher is denser - Default: 128
 * @default 128
 * 
 * @param Shadow Blur Degree (Real)
 * @desc The strength of shadow blur in real shape. Note: In browser play, shadows won't appear if set above 1 - Default: 0
 * @default 0
 * 
 * @param Shadow Blur Degree (Circle)
 * @desc The strength of shadow blur in circle shape. - Default: 15
 * @default 15
 * 
 * @param Shadow Jump Shrink Degree
 * @desc How much the shadow shrinks when jumping. Higher numbers make it smaller - Default: 7
 * @default 7
 * 
 * @param Shadow Direction Reversal
 * @desc Whether to reverse the shadow based on direction - Default: false
 * @type boolean
 * @default false
 * 
 * @param Hide Actor Shadow on Death
 * @desc Whether to hide the shadow when the actor becomes incapacitated - Default: false
 * @type boolean
 * @default false
 * 
 * @param Hide Enemy Shadow on Death
 * @desc Whether to hide the shadow when the enemy becomes incapacitated - Default: false
 * @type boolean
 * @default false
 * 
 * 
 * 
 * @help
 * 【ver.3.3】
 * Easily attach realistic shadows freely
 * Compatible with both maps and battles
 * From luxurious real shapes to simple circles, we have everything
 * Beautifully upgrade the visual depth of your game
 * Also, it's hassle-free and easy to use
 * 
 * Main features are as follows
 * 
 * 
 * ・No need for special instructions, automatically displays shadows
 * 
 * ・Does not display when the body is transparent
 * 
 * ・Shadow size automatically adjusts according to the body's size
 *
 * ・Also, the shadow moves with the body. If the body falls, the shadow falls too
 *
 * ・Basically, you can upgrade the game's visuals by displaying realistic shadows without much effort
 *
 * ・Automatic display follows global settings
 * You can customize it to your liking by adjusting the global settings
 * Settings are done via plugin parameters
 * 
 * ・You can choose whether to display shadows or not for each category
 * Categories are 6 types: player, character, object, vehicle, actor, enemy
 *
 * ・You can choose the shape of the shadow for each category
 * ・Two types: 'Real shape' that matches the body, and 'Circle'
 *
 * ・You can freely adjust shadow position, size, angle, opacity, blur degree
 *
 * ・When the body jumps, the shadow becomes smaller the higher it jumps
 * You can adjust how much it shrinks to your liking
 *
 * ・Basically, the shadow position is fixed, but you can make it reverse based on direction
 * For example, when facing left, display on the right; when facing right, display on the left,
 * So that the shadow is always behind the body
 *
 * ・You can hide or show all shadows on the map with plugin commands
 * For scenes where having shadows would look unnatural
 *
 * ・You can reverse all shadows on the map with plugin commands
 * For expressions like the sun's position has changed, so shadow direction has changed
 *
 * ・Basically, it's designed to display everything in bulk automatically, but
 * You can also finely set shadows for each target
 * How to set it is as follows
 * 
 * 
 * 
 * ▼ Shadow settings in note fields ▼
 *
 * For the target you want to set shadow for
 * If it's an event → Paste in the event's note field
 * If it's an actor → Paste in the actor's note field
 * If it's an enemy → Paste in the enemy's note field
 * If it's for all map characters → Paste in the map's note field
 * Copy and paste this, and adjust the parameters
 * <kage:real|0:0|*0:0|&0>
 *
  The meaning of each parameter is explained below
 *
 * Also, for actor holograms
 * <kageH:real|0:0|*0:0|&0>
 *
 * kageH 's H stands for hologram
 * 
 * 
 * ◉ Parameter explanation
 *
 * type|px:py|*sx:sy|&angle
 *
 * 【type - Shadow shape】
 * Set to 'real' for body-conforming real shape, 'circle' for circle
 * 0 or blank follows global settings
 * Set to 'none' to erase shadow
 *
 * 【px:py - Shadow x position:y position】
 * The amount the shadow position shifts by this number. Unit is percentage of body size
 * px100 shifts by body width amount to the right
 * 0 or blank follows global settings
 *
 * 【sx:sy - Shadow x size:y size】
 * The amount the shadow stretches by this number. Unit is percentage of body size
 * sx200 stretches 2 times horizontally
 * 0 or blank follows global settings
 *
 * 【angle - Shadow angle】
 * Unit is 360-degree angle. 90 rotates 90 degrees to the right
 * 
 * 
 * 
 * ▼ Shadow settings via plugin commands ▼
 *
 * Copy and paste this into plugin command, adjust parameters
 * kage self real|0:0|*0:0|&0
 *
 * Parameter meanings are the same as note fields
 * Specify the target with the part before 'self'. How to specify is as follows
 * 
 * ◉ How to specify targets
 *
 * There are 2 ways to specify
 *
 * 【Specifying by event ID】
 * Enter a number to make that ID's event the target
 * Entering -1 makes the player the target,
 * Entering 0 makes the command-executing event itself the target
 *
 * 【Specifying by name】
 * Entering a non-numeric character makes all events containing that character in their name the target
 * Entering 'play' makes the player the target,
 * Entering 'self' makes the command-executing event itself the target
 * Entering 'all' makes all events on the map the target
 * For 'all', events with shadow type 'none' are excluded
 * 
 * 
 * ◉ Shadow visibility toggle
 *
 * To toggle the visibility of all shadows on the map
 * kage visible
 *
 * Visible shadows become hidden, hidden shadows appear
 *
 * To make all shadows visible
 * kage visible 1
 *
 * To make all shadows invisible
 * kage visible 0
 * 
 * 
 * ◉ X-axis total reversal of shadows on map
 *
 * To reverse all shadows on the map horizontally
 * kage xReverse
 *
 * To set all shadows to horizontal reversal state
 * kage xReverse 1
 *
 * To release horizontal reversal of all shadows
 * kage xReverse 0
 * 
 * 
 * ◉ Y-axis total reversal of shadows on map
 *
 * To reverse all shadows on the map vertically
 * kage yReverse
 *
 * To set all shadows to vertical reversal state
 * kage yReverse 1
 *
 * To release vertical reversal of all shadows
 * kage yReverse 0
 * 
 * 
 * 
 * ▼ Various supplements ▼
 *
 * ・Shadow setting parameters follow global settings when 0 or blank
 *
 * ・Each item of shadow setting parameters can be omitted
 * For example, just 'none' is fine. That alone will make the shadow disappear
 *
 * ・In side view, enemy shadow positions are automatically reversed
 *
 * ・For things like actors and airships that have default shadows,
 * The default shadow is displayed when shadow type is set to 'none'
 *
 * ・Real shadow blur is not supported in browser play
 * Note that shadows won't appear if blur degree is set above 1
 *
 *
 * ※ If shadows don't appear, try setting blur degree to 0
 * In some cases, older MV versions don't support blur
 * 
 * 
 * 
 * ◉ Terms of Use ◉
 * Under MIT license, you can use it freely
 */

(function () {
  //--  定数  --//

  KEKE_KAGE_NAME = "kage";
  KEKE_KAGE_REG =
    /(\w*)\|?\+?(-?\d*\.?\d*):?(-?\d*\.?\d*)\|?\*?(-?\d*\.?\d*):?(-?\d*\.?\d*)\|?&?(-?\d*)/;

  //--  パラメータ受け取り  --//

  var parameters = PluginManager.parameters("Keke_KageMasterMV");
  var keke_PlayerKageType = parameters["Player Shadow Type"];
  var keke_CharaKageType = parameters["Character Shadow Type"];
  var keke_ObjectKageType = parameters["Object Shadow Type"];
  var keke_VehicleKageType = parameters["Vehicle Shadow Type"];
  var keke_ActorKageType = parameters["Actor Shadow Type"];
  var keke_EnemyKageType = parameters["Enemy Shadow Type"];
  var keke_MapKagePosReal = eval(parameters["Map/Shadow Position (Real)"]);
  var keke_MapKagePosCircle = eval(parameters["Map/Shadow Position (Circle)"]);
  var keke_MapKageSizeReal = eval(parameters["Map/Shadow Size (Real)"]);
  var keke_MapKageSizeCircle = eval(parameters["Map/Shadow Size (Circle)"]);
  var keke_MapKageAngle = Number(parameters["Map/Shadow Angle"]);
  var keke_BattleKagePosReal = eval(
    parameters["Battle/Shadow Position (Real)"],
  );
  var keke_BattleKagePosCircle = eval(
    parameters["Battle/Shadow Position (Circle)"],
  );
  var keke_BattleKageSizeReal = eval(parameters["Battle/Shadow Size (Real)"]);
  var keke_BattleKageSizeCircle = eval(
    parameters["Battle/Shadow Size (Circle)"],
  );
  var keke_BattleKageAngle = Number(parameters["Battle/Shadow Angle"]);
  var keke_KageOpacity = Number(parameters["Shadow Opacity"]);
  var keke_KageBlurReal = Number(parameters["Shadow Blur Degree (Real)"]);
  var keke_KageBlurCircle = Number(parameters["Shadow Blur Degree (Circle)"]);
  var keke_KageJumpSmall = Number(parameters["Shadow Jump Shrink Degree"]);
  var keke_KageReverseByMuki = eval(parameters["Shadow Direction Reversal"]);
  var keke_ActorDeadNoKageM = eval(parameters["Hide Actor Shadow on Death"]);
  var keke_EnemyDeadNoKageM = eval(parameters["Hide Enemy Shadow on Death"]);
  var keke_TilesetKageType = "none";

  //--  プラグインコマンド  --//

  var _Game_Interpreter_pluginCommand =
    Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function (command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);
    if (command === KEKE_KAGE_NAME) {
      if (args[0] == "xReverse") {
        if (args[1] == null) {
          $gameSystem._kageXReverse *= -1;
        } else if (Number(args[1])) {
          $gameSystem._kageXReverse = 1;
        } else {
          $gameSystem._kageXReverse = 0;
        }
      } else if (args[0] == "yReverse") {
        if (args[1] == null) {
          $gameSystem._kageYReverse *= -1;
        } else if (Number(args[1])) {
          $gameSystem._kageYReverse = 1;
        } else {
          $gameSystem._kageYReverse = 0;
        }
      } else if (args[0] == "visible") {
        if (args[1] == null) {
          $gameSystem._kageVisible = Math.abs($gameSystem._kageVisible - 1);
        } else if (Number(args[1])) {
          $gameSystem._kageVisible = 0;
        } else {
          $gameSystem._kageVisible = 1;
        }
      } else {
        var targets = this.eventNameToIdKe(args[0]);
        var note = args[1];
        var all = args[0] == "all" ? true : false;
        targets.forEach(function (target) {
          target = target == -1 ? $gamePlayer : $gameMap.event(target);
          target._kageMKe.changeParam(note, true, all);
        }, this);
      }
    }
  };

  //--  共通開始  --//

  var _Game_CharacterBase_initMembers =
    Game_CharacterBase.prototype.initMembers;
  Game_CharacterBase.prototype.initMembers = function () {
    _Game_CharacterBase_initMembers.call(this);
    this._kageMKe = null;
  };

  var _Game_Battler_initialize = Game_Battler.prototype.initialize;
  Game_Battler.prototype.initialize = function () {
    _Game_Battler_initialize.call(this);
    this._kageMKe = null;
  };

  var _Game_Player_initMembers = Game_Player.prototype.initMembers;
  Game_Player.prototype.initMembers = function () {
    _Game_Player_initMembers.call(this);
    this._eventId = 0; // ベーシック
  };

  var _Sprite_Character_initialize = Sprite_Character.prototype.initialize;
  Sprite_Character.prototype.initialize = function (character) {
    _Sprite_Character_initialize.call(this, character);
    this._kageSpriteKe = null;
    this.orderKageKe();
  };

  var _Sprite_Battler_initialize = Sprite_Battler.prototype.initialize;
  Sprite_Battler.prototype.initialize = function (battler) {
    _Sprite_Battler_initialize.call(this, battler);
    this._kageSpriteKe = null;
    this.orderKageKe();
  };

  var _Game_Map_setup = Game_Map.prototype.setup;
  Game_Map.prototype.setup = function (mapId) {
    _Game_Map_setup.call(this, mapId);
    // Map shadow param acquisition
    var kageMKe = new Game_KageMasterKe();
    if ($dataMap.meta) {
      var meta = $dataMap.meta[KEKE_KAGE_NAME];
      this._kageParamKe = kageMKe.getParam(meta);
    }
  };

  //--  共通更新  --//

  var _SpriteCharacter_updateBitmap = Sprite_Character.prototype.updateBitmap;
  Sprite_Character.prototype.updateBitmap = function () {
    _SpriteCharacter_updateBitmap.call(this);
    this.getBitmapSizeKe();
    this.createKageKe();
    this.deleteKageKe();
    this.updateKageKe();
  };

  var _Sprite_Character_updateOther = Sprite_Character.prototype.updateOther;
  Sprite_Character.prototype.updateOther = function () {
    _Sprite_Character_updateOther.call(this);
    this._getedBitmapSizeKe = false;
  };
  var _Sprite_Battler_update = Sprite_Battler.prototype.update;
  Sprite_Battler.prototype.update = function () {
    _Sprite_Battler_update.call(this);
    if (this._battler) {
      this.createKageKe();
      this.deleteKageKe();
      this.updateKageKe();
    }
  };

  var _Sprite_Actor_updateBitmap = Sprite_Actor.prototype.updateBitmap;
  Sprite_Actor.prototype.updateBitmap = function () {
    _Sprite_Actor_updateBitmap.call(this);
    this.getBitmapSizeKe();
  };

  var _Sprite_Enemy_updateBitmap = Sprite_Enemy.prototype.updateBitmap;
  Sprite_Enemy.prototype.updateBitmap = function () {
    _Sprite_Enemy_updateBitmap.call(this);
    this.getBitmapSizeKe();
  };

  var _Sprite_Battler_updatePosition = Sprite_Battler.prototype.updatePosition;
  Sprite_Battler.prototype.updatePosition = function () {
    _Sprite_Battler_updatePosition.call(this);
    this._getedBitmapSizeKe = false;
  };

  //--  ベーシックパック  --//

  // スクリーン座標への変換
  if (!Game_CharacterBase.prototype.convertScreenXKe) {
    Game_CharacterBase.prototype.convertScreenXKe = function (x) {
      var tw = $gameMap.tileWidth();
      var scrolledX = $gameMap.adjustX(x);
      return Math.round(scrolledX * tw + tw / 2);
    };
  }

  if (!Game_CharacterBase.prototype.convertScreenYKe) {
    Game_CharacterBase.prototype.convertScreenYKe = function (y) {
      var th = $gameMap.tileHeight();
      var scrolledY = $gameMap.adjustY(y);
      return Math.round(
        scrolledY * th + th - this.shiftY() - this.jumpHeight(),
      );
    };
  }

  // 角度を度数に変更
  if (!Game_Temp.prototype.angleToDegreeKe) {
    Game_Temp.prototype.angleToDegreeKe = function (angle) {
      angle *= 180 / Math.PI;
      if (angle < 0) {
        angle += 360;
      }
      return angle;
    };
  }

  // 角度をπに変更
  if (!Game_Temp.prototype.angleToRadianKe) {
    Game_Temp.prototype.angleToRadianKe = function (angle) {
      angle *= Math.PI / 180;
      return angle;
    };
  }

  // イベント名をイベントIDに変換する
  if (!Game_Interpreter.prototype.eventNameToIdKe) {
    Game_Interpreter.prototype.eventNameToIdKe = function (name) {
      if (!name) {
        return [];
      }
      if (name == "play" || name == "-1") {
        return [-1];
      } else if (name == "self" || name == "0") {
        return [this._eventId];
      } else if (name.match(/^\d+$/)) {
        return [name];
      } else if (name == "all") {
        var result = [];
        $gameMap.events().forEach(function (event) {
          if (!event) {
            return;
          }
          result.push(event._eventId);
        }, this);
        return result.length ? result : [];
      } else {
        result = [];
        var eventName = "";
        $gameMap.events().forEach(function (event) {
          if (!event) {
            return;
          }
          eventName = event._name;
          if (eventName.includes(name)) {
            result.push(event._eventId);
          }
        }, this);
        return result.length ? result : [];
      }
    };
  }

  // ビットマップサイズの取得(キャラクター)
  if (!Sprite_Character.prototype.getBitmapSizeKe) {
    Sprite_Character.prototype.getBitmapSizeKe = function () {
      if (this._getedBitmapSizeKe) {
        return;
      }
      if (!this.bitmap) {
        return;
      }
      var chara = this._character;
      if (!chara._bitmapKe) {
        chara._bitmapKe = {};
      }
      var bitmapKe = chara._bitmapKe;
      bitmapKe.width = this.bitmap.width;
      bitmapKe.height = this.bitmap.height;
      if (!this._characterName.match(/^!?k1_/)) {
        if (this._characterName.match(/^!?\$/)) {
          bitmapKe.width /= 3;
          bitmapKe.height /= 4;
        } else {
          bitmapKe.width /= 12;
          bitmapKe.height /= 8;
        }
      }
      bitmapKe.widthOri = bitmapKe.width;
      bitmapKe.heightOri = bitmapKe.height;
      bitmapKe.width *= this.scale.x;
      bitmapKe.height *= this.scale.y;
      this._getedBitmapSizeKe = true;
    };
  }

  // ビットマップサイズの取得(アクター)
  if (!Sprite_Actor.prototype.getBitmapSizeKe) {
    Sprite_Actor.prototype.getBitmapSizeKe = function () {
      if (this._getedBitmapSizeKe) {
        return;
      }
      var bitmap = this._mainSprite.bitmap;
      if (!bitmap) {
        return;
      }
      var actor = this._actor;
      if (!actor._bitmapKe) {
        actor._bitmapKe = {};
      }
      var bitmapKe = actor._bitmapKe;
      bitmapKe.width = bitmap.width;
      bitmapKe.height = bitmap.height;
      if (!actor._battlerName.match(/^k1_/)) {
        bitmapKe.width /= 9;
        bitmapKe.height /= 6;
      }
      bitmapKe.widthOri = bitmapKe.width;
      bitmapKe.heightOri = bitmapKe.height;
      bitmapKe.width *= this.scale.x;
      bitmapKe.height *= this.scale.y;
      this._getedBitmapSizeKe = true;
    };
  }

  // ビットマップサイズの取得(エネミー)
  if (!Sprite_Enemy.prototype.getBitmapSizeKe) {
    Sprite_Enemy.prototype.getBitmapSizeKe = function () {
      if (this._getedBitmapSizeKe) {
        return;
      }
      if (!this.bitmap) {
        return;
      }
      var enemy = this._enemy;
      if (!enemy._bitmapKe) {
        enemy._bitmapKe = {};
      }
      var bitmapKe = enemy._bitmapKe;
      bitmapKe.width = this.bitmap.width;
      bitmapKe.height = this.bitmap.height;
      bitmapKe.widthOri = bitmapKe.width;
      bitmapKe.heightOri = bitmapKe.height;
      bitmapKe.width *= this.scale.x;
      bitmapKe.height *= this.scale.y;
      this._getedBitmapSizeKe = true;
    };
  }

  // バラスプライトの取得
  if (!Game_Temp.prototype.getBaraSpriteKe) {
    Game_Temp.prototype.getBaraSpriteKe = function (subject) {
      var baras = [];
      if (subject._isCharacter) {
        var eventId = subject._eventId;
        var baras = $gameTemp._baraSprites
          ? $gameTemp._baraSprites[eventId] || []
          : [];
        baras = baras[0] || [];
      } else if (subject._isBattler) {
        var battlerId = subject._actorId ? subject._actorId : subject.index();
        var baraBank = subject._actorId
          ? $gameTemp._baraSpritesActor || []
          : $gameTemp._baraSpritesEnemy || [];
        var baras = baraBank[battlerId] || [];
      }
      return baras;
    };
  }

  //-- 影マスタークラス  --//

  function Game_KageMasterKe() {
    this.initialize.apply(this, arguments);
  }

  window[Game_KageMasterKe.name] = Game_KageMasterKe;

  // 開始処理
  Game_KageMasterKe.prototype.initialize = function (subje) {
    if (!subje) {
      return;
    }
    this._subje = subje;
    this._isCharacter = subje._direction;
    this._isBattler = subje._status;
    this._type = "none";
    this._posX = 0;
    this._posY = 0;
    this._sizeX = 0;
    this._sizeY = 0;
    this._angle = 0;
    this._command = "";

    // グローバル値の読み込み
    var mapParam = $gameMap._kageParamKe;
    if (mapParam) {
      this._mapType = mapParam["type"];
    }

    // 位置(リアル)
    if (
      mapParam &&
      (mapParam["posX"] || mapParam["posY"]) &&
      mapParam["type"] == "real"
    ) {
      this._posRealG = [
        mapParam["posX"] || keke_MapKagePosReal[0] / 100,
        mapParam["posY"] || keke_MapKagePosReal[1] / 100,
      ];
    } else {
      this._posRealG = this._isBattler
        ? keke_BattleKagePosReal
        : keke_MapKagePosReal;
      this._posRealG = [this._posRealG[0] / 100, this._posRealG[1] / 100];
    }
    // 位置(円形)
    if (
      mapParam &&
      (mapParam["posX"] || mapParam["posY"]) &&
      mapParam["type"] == "circle"
    ) {
      this._posCircleG = [
        mapParam["posX"] || keke_MapKagePosCircle[0] / 100,
        mapParam["posY"] || keke_MapKagePosCircle[1] / 100,
      ];
    } else {
      this._posCircleG = this._isBattler
        ? keke_BattleKagePosCircle
        : keke_MapKagePosCircle;
      this._posCircleG = [this._posCircleG[0] / 100, this._posCircleG[1] / 100];
    }

    // サイズ(リアル)
    if (
      mapParam &&
      (mapParam["sizeX"] || mapParam["sizeY"]) &&
      mapParam["type"] == "real"
    ) {
      this._sizeRealG = [
        mapParam["sizeX"] || keke_MapKageSizeReal[0] / 100,
        mapParam["sizeY"] || keke_MapKageSizeReal[1] / 100,
      ];
    } else {
      this._sizeRealG = this._isBattler
        ? keke_BattleKageSizeReal
        : keke_MapKageSizeReal;
      this._sizeRealG = [this._sizeRealG[0] / 100, this._sizeRealG[1] / 100];
    }
    // サイズ(円形)
    if (
      mapParam &&
      (mapParam["sizeX"] || mapParam["sizeY"]) &&
      mapParam["type"] == "circle"
    ) {
      this._sizeCircleG = [
        mapParam["sizeX"] || keke_MapKageSizeCircle[0] / 100,
        mapParam["sizeY"] || keke_MapKageSizeCircle[1] / 100,
      ];
    } else {
      this._sizeCircleG = this._isBattler
        ? keke_BattleKageSizeCircle
        : keke_MapKageSizeCircle;
      this._sizeCircleG = [
        this._sizeCircleG[0] / 100,
        this._sizeCircleG[1] / 100,
      ];
    }

    // 角度
    if (mapParam && mapParam["angle"]) {
      this._angleG = mapParam["angle"];
    } else {
      this._angleG = $gameParty.inBattle
        ? keke_BattleKageAngle
        : keke_MapKageAngle;
    }
    this.refresh();
  };

  // リフレッシュ
  Game_KageMasterKe.prototype.refresh = function () {
    var subje = this._subje;

    // タイプ判定
    if (subje._followers || subje._memberIndex) {
      this._type = keke_PlayerKageType;
    } else if (subje._characterName && subje._characterName.match(/^!/)) {
      this._type = keke_ObjectKageType;
    } else if (subje._isObjectCharacter) {
      this._type = keke_TilesetKageType;
    } else if (subje._type) {
      this._type = keke_VehicleKageType;
    } else if (subje._isBattler) {
      this._type = subje._enemyId ? keke_EnemyKageType : keke_ActorKageType;
    } else {
      this._type = keke_CharaKageType;
    }
    if (this._type != "none" && this._mapType) {
      this._type = this._mapType;
    }
    this.setParam();

    // リーダー
    if (subje._followers) {
      if ($gameParty.leader()) {
        var meta = $gameParty.leader().actor().meta[KEKE_KAGE_NAME + "H"];
      }
      if (meta) {
        this.changeParam(meta);
      }
    }

    // フォロワー
    if (subje._memberIndex) {
      var index = subje._memberIndex;
      if ($gameParty.members() && $gameParty.members()[index]) {
        var meta = $gameParty.members()[index].actor().meta["kageH"];
      }
      if (meta) {
        this.changeParam(meta);
      }
    }

    // イベント
    if (subje._eventId) {
      var id = subje._eventId;
      var meta = $dataMap.events[id].meta[KEKE_KAGE_NAME];
      if (meta) {
        this.changeParam(meta);
      }
    }

    // バトラー
    if (subje._isBattler) {
      var battler = subje._enemyId ? subje.enemy() : subje.actor();
      var meta = battler.meta[KEKE_KAGE_NAME];
      if (meta) {
        this.changeParam(meta);
      }
    }

    if (this._type != "none") {
      this.arise();
    }
  };

  // 影パラムの取得
  Game_KageMasterKe.prototype.getParam = function (note) {
    var param = {};
    if (!note) {
      return {};
    }
    var match = note.match(KEKE_KAGE_REG);
    if (match) {
      if (match[1]) {
        param["type"] = match[1];
      }
      if (match[2]) {
        param["posX"] = Number(match[2]) / 100;
      }
      if (match[3]) {
        param["posY"] = Number(match[3]) / 100;
      }
      if (match[4]) {
        param["sizeX"] = Number(match[4]) / 100;
      }
      if (match[5]) {
        param["sizeY"] = Number(match[5]) / 100;
      }
      if (match[6]) {
        param["angle"] = Number(match[6]);
      }
    }
    return param;
  };

  // 影パラムのセット
  Game_KageMasterKe.prototype.setParam = function () {
    if (!this._posX) {
      this._posX =
        this._type == "circle" ? this._posCircleG[0] : this._posRealG[0];
    }
    if (!this._posY) {
      this._posY =
        this._type == "circle" ? this._posCircleG[1] : this._posRealG[1];
    }
    if (!this._sizeX) {
      this._sizeX =
        this._type == "circle" ? this._sizeCircleG[0] : this._sizeRealG[0];
    }
    if (!this._sizeY) {
      this._sizeY =
        this._type == "circle" ? this._sizeCircleG[1] : this._sizeRealG[1];
    }
    if (!this._angle) {
      this._angle = this._angleG;
    }

    // ぼかしなし判定
    this._solid =
      (this._type == "real" && keke_KageBlurReal == 0) ||
      (this._type == "circle" && keke_KageBlurCircle == 0);
  };

  // 影パラムの変更
  Game_KageMasterKe.prototype.changeParam = function (note, force, all) {
    if (all && this._type == "none") {
      return;
    }
    var param = this.getParam(note);
    if (param["type"]) {
      this._type = param["type"];
    }
    if (param["posX"] || force) {
      this._posX = param["posX"];
    } else {
      this._posX =
        this._type == "circle" ? this._posCircleG[0] : this._posRealG[0];
    }
    if (param["posY"] || force) {
      this._posY = param["posY"];
    } else {
      this._posY =
        this._type == "circle" ? this._posCircleG[1] : this._posRealG[1];
    }
    if (param["sizeX"] || force) {
      this._sizeX = param["sizeX"];
    } else {
      this._sizeX =
        this._type == "circle" ? this._sizeCircleG[0] : this._sizeRealG[0];
    }
    if (param["sizeY"] || force) {
      this._sizeY = param["sizeY"];
    } else {
      this._sizeY =
        this._type == "circle" ? this._sizeCircleG[1] : this._sizeRealG[1];
    }
    if (param["angle"] || force) {
      this._angle = param["angle"];
    } else {
      this._angle = this._angleG;
    }

    // ぼかしなし判定
    this.setParam();

    // 影出現
    if (force && this._type != "none") {
      this.arise();
    }
  };

  // 影の発生
  Game_KageMasterKe.prototype.arise = function () {
    if (this._kageType == "none") {
      return;
    }
    this._command = "create";
  };

  // 影の消去
  Game_KageMasterKe.prototype.clear = function () {
    this._command = "delete";
    if (this._followers) {
      this._followers.forEach(function (follower) {
        if (!follower) {
          return;
        }
        follower._kageMKe.clear();
      }, this);
    }
  };

  Game_KageMasterKe.prototype.saveFrame = function (frame) {
    this._frameWidth = frame.width;
    this._frameHeight = frame.height;
  };

  //-- 影・キャラクター  --//

  // 影の開始(キャラクター)
  Game_CharacterBase.prototype.initKageKe = function () {
    this._kageMKe = new Game_KageMasterKe(this);
  };

  // 影スプライトのオーダー(キャラクター)
  Sprite_Character.prototype.orderKageKe = function () {
    if (!this._character || !this._character._kageMKe) {
      return;
    }
    var kage = this._character._kageMKe;
    if (kage._command == "comp") {
      kage._command = "create";
    }
  };

  // 影スプライトの作成(キャラクター)
  Sprite_Character.prototype.createKageKe = function () {
    if (!this._character._kageMKe) {
      this._character.initKageKe();
    }
    if (this._character._kageMKe._command != "create") {
      return;
    }
    if (!SceneManager._scene._spriteset) {
      return;
    }
    if (!this._character._bitmapKe || !this._character._bitmapKe.width) {
      return;
    }
    var kage = this._character._kageMKe;
    kage._command = "delete";
    this.deleteKageKe();
    var tilemap = SceneManager._scene._spriteset._tilemap;
    var sprite = new Sprite_KageMasterKe(this, this._character);
    this._kageSpriteKe = sprite;
    tilemap.addChildAt(sprite, 2);
    kage._command = "comp";
  };

  // 影スプライトの消去(キャラクター)
  Sprite_Character.prototype.deleteKageKe = function () {
    if (this._character._kageMKe._command != "delete") {
      return;
    }
    if (!this._kageSpriteKe) {
      return;
    }
    var tilemap = SceneManager._scene._spriteset._tilemap;
    tilemap.removeChild(this._kageSpriteKe);
    this._kageSpriteKe = null;
    this._character._kageMKe._command = 0;
  };

  // 影スプライトの更新(キャラクター)
  Sprite_Character.prototype.updateKageKe = function () {
    if (!SceneManager._scene._spriteset) {
      return;
    }
    if (this._kageSpriteKe) {
      this._kageSpriteKe.update();
    }
  };

  // 影スプライトの再描画(キャラクター)
  Sprite_Character.prototype.redrawKageKe = function (realOnly) {
    if (!this._character._kageMKe) {
      this._character.initKageKe();
    }
    if (realOnly && this._character._kageMKe._type != "real") {
      return;
    }
    if (!this._kageSpriteKe) {
      return;
    }
    var kage = this._character._kageMKe;
    kage.arise();
  };

  // ビットマップ変更時、再描画
  var _Sprite_Character_updateBitmap = Sprite_Character.prototype.updateBitmap;
  Sprite_Character.prototype.updateBitmap = function () {
    if (this.isImageChanged()) {
      this.redrawKageKe();
    }
    _Sprite_Character_updateBitmap.call(this);
  };

  // フレーム変更時、再描画
  var _Sprite_Character_updateCharacterFrame =
    Sprite_Character.prototype.updateCharacterFrame;
  Sprite_Character.prototype.updateCharacterFrame = function () {
    var preFrameX = this._frame.x;
    var preFrameY = this._frame.y;
    var preFrameWidth = this._frame.width;
    var preFrameHeight = this._frame.height;
    _Sprite_Character_updateCharacterFrame.call(this);
    if (
      this._frame.x != preFrameX ||
      this._frame.y != preFrameY ||
      this._frame.width != preFrameWidth ||
      this._frame.height != preFrameHeight
    ) {
      this.redrawKageKe(true);
    }
  };

  // 飛行機影の不透明度
  var _Game_Vehicle_shadowOpacity = Game_Vehicle.prototype.shadowOpacity;
  Game_Vehicle.prototype.shadowOpacity = function () {
    var result = _Game_Vehicle_shadowOpacity.call(this);
    if (this._kageType != "none") {
      result = 0;
    }
    return result;
  };

  //-- 影・バトラー  --//

  // 影の開始(バトラー)
  Game_BattlerBase.prototype.initKageKe = function () {
    this._kageMKe = new Game_KageMasterKe(this);
  };

  // 影スプライトのオーダー(バトラー)
  Sprite_Battler.prototype.orderKageKe = function () {
    if (!this._battler || !this._battler._kageMKe) {
      return;
    }
    var kage = this._battler._kageMKe;
    if (kage._command == "comp") {
      kage._command = "create";
    }
  };

  // 影スプライトの作成(バトラー)
  Sprite_Battler.prototype.createKageKe = function () {
    if (!this._battler._kageMKe) {
      this._battler.initKageKe();
    }
    if (this._battler._kageMKe._command != "create") {
      return;
    }
    if (!SceneManager._scene._spriteset) {
      return;
    }
    if (!this._battler._bitmapKe || !this._battler._bitmapKe.width) {
      return;
    }
    var kage = this._battler._kageMKe;
    kage._command = "delete";
    this.deleteKageKe();
    var battleField = SceneManager._scene._spriteset._battleField;
    var sprite = new Sprite_KageMasterKe(this, this._battler);
    this._kageSpriteKe = sprite;
    battleField.addChildAt(sprite, 2);
    kage._command = "comp";
  };

  // 影スプライトの消去(バトラー)
  Sprite_Battler.prototype.deleteKageKe = function () {
    if (this._battler._kageMKe._command != "delete") {
      return;
    }
    if (!this._kageSpriteKe) {
      return;
    }
    var battleField = SceneManager._scene._spriteset._battleField;
    battleField.removeChild(this._kageSpriteKe);
    this._kageSpriteKe = null;
    this._battler._kageMKe._command = 0;
  };

  // 影スプライトの更新(バトラー)
  Sprite_Battler.prototype.updateKageKe = function () {
    if (!SceneManager._scene._BattleFIeld) {
      return;
    }
    if (this._kageSpriteKe) {
      this._kageSpriteKe.update();
    }
  };

  // 影スプライトの再描画(バトラー)
  Sprite_Battler.prototype.redrawKageKe = function (realOnly) {
    if (!this._battler._kageMKe) {
      this._battler.initKageKe();
    }
    if (realOnly && this._battler._kageMKe._type != "real") {
      return;
    }
    if (!this._kageSpriteKe) {
      return;
    }
    var kage = this._battler._kageMKe;
    kage.arise();
  };

  // ビットマップ変更時、再描画
  var _Sprite_Battler_updateBitmap = Sprite_Battler.prototype.updateBitmap;
  Sprite_Battler.prototype.updateBitmap = function () {
    var preBattlerName = this._battlerName;
    _Sprite_Battler_updateBitmap.call(this);
    if (this._battlerName != preBattlerName) {
      this.redrawKageKe();
    }
  };

  // フレーム変更時、再描画
  var _Sprite_Actor_updateFrame = Sprite_Actor.prototype.updateFrame;
  Sprite_Actor.prototype.updateFrame = function () {
    var main = this._mainSprite;
    var preFrameX = main._frame.x;
    var preFrameY = main._frame.y;
    var preFrameWidth = main._frame.width;
    var preFrameHeight = main._frame.height;
    _Sprite_Actor_updateFrame.call(this);
    if (
      main._frame.x != preFrameX ||
      main._frame.y != preFrameY ||
      main._frame.width != preFrameWidth ||
      main._frame.height != preFrameHeight
    ) {
      this.redrawKageKe(true);
    }
  };

  // 従来のアクター影を消去(再定義)
  var _Sprite_Actor_updateShadow = Sprite_Actor.prototype.updateShadow;
  Sprite_Actor.prototype.updateShadow = function () {
    _Sprite_Actor_updateShadow.call(this);
    if (this._kageSpriteKe) {
      this._shadowSprite.visible = false;
    }
  };

  // 戦闘終了時に影マスタークラスを消去
  var _Scene_Battle_terminate = Scene_Battle.prototype.terminate;
  Scene_Battle.prototype.terminate = function () {
    _Scene_Battle_terminate.call(this);
    $gameParty.members().forEach(function (actor) {
      actor._kageMKe = null;
    }, this);
  };

  //--  影マスタースプライト  --//

  function Sprite_KageMasterKe() {
    this.initialize.apply(this, arguments);
  }

  Sprite_KageMasterKe.prototype = Object.create(Sprite.prototype);
  Sprite_KageMasterKe.prototype.constructor = Sprite_KageMasterKe;

  // 影スプライトの初期化
  Sprite_KageMasterKe.prototype.initialize = function (oriSprite, subje) {
    Sprite.prototype.initialize.call(this);
    this._oriSprite = oriSprite;
    this._subje = subje;
    this._kage = subje._kageMKe;
    if (this._kage._isCharacter) {
      this._isCharacter = true;
    } else {
      this._isBattler = true;
    }
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
    this.z = 1;
    this.createBitmap();
    this.update();
  };

  // 影スプライトの描画
  Sprite_KageMasterKe.prototype.createBitmap = function () {
    var subje = this._subje;
    var kage = this._kage;
    name = this._isCharacter ? subje._characterName : subje._battlerName;
    if (!name) {
      return;
    }

    // ▼ マップ ▼//
    // 共通　　　─影スプライトの描画
    // リアル形　　　─影スプライトの描画
    // 円形　　　─影スプライトの描画

    // 共通　　　─影スプライトの描画
    var width = Math.abs(this._subje._bitmapKe.widthOri);
    var height = Math.abs(this._subje._bitmapKe.heightOri);
    var aWidth = width * 3.0;
    var aHeight = height * 3.0;
    var radius = width / 2;
    this.bitmap = new Bitmap(aWidth, aHeight);
    var context = this.bitmap._context;
    context.shadowColor = `rgba(0, 0, 0)`;
    var gWidth = 0;
    var realSolid = kage._type == "real" && keke_KageBlurReal == 0;
    var circleSolid = kage._type == "circle" && keke_KageBlurCircle == 0;
    if (!kage._solid) {
      gWidth = Graphics.width * 2;
      context.shadowOffsetX = gWidth;
      context.shadowOffsetY = 0;
      context.shadowBlur =
        kage._type == "real" ? keke_KageBlurReal : keke_KageBlurCircle;
    }

    // リアル形　　　─影スプライトの描画
    if (kage._type == "real") {
      var ori = subje._actorId ? this._oriSprite._mainSprite : this._oriSprite;
      var x = (aWidth - width) / 2 - gWidth;
      var y = (aHeight - height) / 2;
      var frameWidth = ori._frame.width;
      var frameHeight = ori._frame.height;
      if (this._isCharacter && ori._bushDepth > 0) {
        frameWidth = ori.patternWidth();
        frameHeight = ori.patternHeight();
        frameHeight -= ori._bushDepth;
        height -= ori._bushDepth;
      }
      this.bitmap.bltImage(
        ori.bitmap,
        ori._frame.x,
        ori._frame.y,
        frameWidth,
        frameHeight,
        x,
        y,
        width,
        height,
      );
      if (kage._solid) {
        this.setColorTone([-255, -255, -255, 0]);
      }

      // 円形　　　─影スプライトの描画
    } else if (kage._type == "circle") {
      var color1 = "rgba(0, 0, 0, 0.5)";
      var color2 = "rgba(0, 0, 0, 1.0)";
      var grad = context.createLinearGradient(width / 2, 0, width / 2, height);
      grad.addColorStop(0, color1);
      grad.addColorStop(1, color2);
      context.save();
      context.strokeStyle = color1;
      context.fillStyle = grad;
      context.beginPath();

      context.arc(
        aWidth * 0.5 - gWidth,
        aHeight * 0.5,
        radius,
        0,
        Math.PI * 2,
        false,
      );
      context.fill();

      context.restore();
      this.bitmap._setDirty();
    }
  };

  // 影スプライトの更新
  Sprite_KageMasterKe.prototype.update = function () {
    var subje = this._subje;
    var kage = this._kage;
    var oriSprite = this._oriSprite;
    var baras = $gameTemp.getBaraSpriteKe(subje);

    // ▼ マップ ▼//
    // 位置　　　─影スプライトの更新
    // 不透明度　　　─影スプライトの更新
    // 見えるか　　　─影スプライトの更新
    // スケール　　　─影スプライトの更新
    // 角度　　　─影スプライトの更新

    // 位置　　　─影スプライトの更新
    var xReverse = 1;
    xReverse *=
      keke_KageReverseByMuki && (subje._direction == 6 || subje._direction == 8)
        ? -1
        : 1;
    xReverse *= subje._bitmapKe.width < 0 ? -1 : 1;
    xReverse *=
      $gameParty.inBattle() && $gameSystem.isSideView() && subje._enemyId
        ? -1
        : 1;
    xReverse *= $gameSystem._kageXReverse || 1;
    var kagePosX = kage._posX * xReverse;
    var kagePosY = kage._posY * ($gameSystem._kageYReverse || 1);
    // 位置(マップ)　　　─影スプライトの更新
    if (this._isCharacter) {
      var x = subje._realX;
      var y = subje._realY;
      if (baras[0]) {
        x += baras[0]._gMoverX / $gameMap.tileWidth();
        y += baras[0]._gMoverY / $gameMap.tileHeight();
      }
      if (subje.jumpHeight()) {
        y += subje.jumpHeight() / $gameMap.tileHeight();
      }
      this.x = subje.convertScreenXKe(x) + kagePosX * subje._bitmapKe.width;
      this.y = subje.convertScreenYKe(y) + kagePosY * subje._bitmapKe.height;
      if (!this._isCharacter) {
        this.y += subje.shiftY();
      }
      // 位置(バトル)　　　─影スプライトの更新
    } else {
      this.x = oriSprite.x + kagePosX * subje._bitmapKe.width;
      this.y = oriSprite.y + kagePosY * subje._bitmapKe.height;
      if (oriSprite._kekeActAir) {
        this.y -= oriSprite._kekeActAir;
      }
      // DynamicMotion対応
      if (oriSprite._airY || oriSprite._rollAdjustY) {
        this.y -= oriSprite.rollAirY() * 1.0;
      }
    }

    // 不透明度　　　─影スプライトの更新
    if (baras[0]) {
      var maxOpa = 0;
      baras.forEach(function (bara) {
        if (bara && bara.opacity > maxOpa) {
          maxOpa = bara.opacity;
        }
      }, this);
      this.opacity = Math.min(
        maxOpa * (keke_KageOpacity / 255),
        keke_KageOpacity,
      );
      // MOG_CollapseEffects 対応
    } else if (this._oriSprite._spriteCol) {
      this.opacity = Math.min(
        oriSprite._spriteCol[0].opacity,
        keke_KageOpacity,
      );
    } else {
      var opacity = this._oriSprite._mainSprite
        ? this._oriSprite._mainSprite.opacity
        : this._oriSprite.opacity;
      this.opacity = opacity * (keke_KageOpacity / 255);
    }
    if (
      (subje._actorId && keke_ActorDeadNoKageM && subje.isDead()) ||
      (subje._enemyId && keke_EnemyDeadNoKageM && subje.isDead())
    ) {
      this.opacity = 0;
    }

    // 見えるか　　　─影スプライトの更新
    this.visible = oriSprite.visible && !$gameSystem._kageVisible;

    // スケール　　　─影スプライトの更新
    var scaleX = baras[0] ? baras[0].scale.x : oriSprite.scale.x;
    var scaleY = baras[0] ? baras[0].scale.y : oriSprite.scale.y;
    if (this._isCharacter) {
      if (subje._memberIndex) {
        var subje = $gamePlayer;
      } else {
        subje = subje;
      }
      var another = subje._freeM ? subje._freeM.anotherY[0] : 0;
      var jumpY = another - subje.jumpHeight() / $gameMap.tileHeight();
      var scaleRate = jumpY < 0 ? 1 - -jumpY / 10 : 1;
    } else {
      var jumpY = 0;
      jumpY += oriSprite._jumpHeight || 0;
      if (baras[0]) {
        jumpY += baras[0].gMoverY < 0 ? baras[0]._gMoverY : 0;
      }
      // BattlerGraphicExtend 対応
      if (subje._altitude) {
        jumpY += subje.getAltitude() * 2;
      }
      jumpY /= $gameMap.tileHeight();

      scaleRate = jumpY < 0 ? 1 - -jumpY / 10 : 1;
    }
    this.scale.x = scaleX * scaleRate * kage._sizeX;
    this.scale.y =
      scaleY * scaleRate * kage._sizeY * ($gameSystem._kageYReverse || 1);

    // 角度　　　─影スプライトの更新
    this.rotation = $gameTemp.angleToRadianKe(
      $gameTemp.angleToDegreeKe(oriSprite.rotation) + kage._angle,
    );
  };

  // 影スプライトのクリア
  Sprite_KageMasterKe.prototype.clear = function () {
    if (this._isCharacter) {
      var tilemap = SceneManager._scene._spriteset._tilemap;
      tilemap.removeChild(this);
    } else {
      var battleField = SceneManager._scene._spriteset._battleField;
      battleField.removeChild(this);
    }
  };
})();
