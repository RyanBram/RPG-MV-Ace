//=============================================================================
// SAN_AnalogStick.js
//=============================================================================
// Copyright (c) 2017 Sanshiro
// Released under the MIT license
// http://opensource.org/licenses/mit-license.php
//=============================================================================

/*:
 * @plugindesc アナログスティック 1.0.0
 * アナログスティックの入力を取得します。
 * @author サンシロ https://twitter.com/rev2nym
 * @target MV MZ
 * @version 1.0.0 2017/03/01 作成
 *
 * @help
 * ■概要
 * ゲームパッドのアナログスティックの入力値を利用可能にします。
 * 接続されたゲームパッドのうち最も傾きの大きいゲームパッドの
 * アナログスティック値を採用します。
 *
 * ■入力値の取得
 * 次のスクリプトで入力値を取得します。
 *
 * ・左スティックの方向値
 *   Input.leftStick.dir
 *
 * ・左スティックの傾き値
 *   Input.leftStick.tilt
 *
 * ・右スティックの方向値
 *   Input.rightStick.dir
 *
 * ・右スティックの傾き値
 *   Input.rightStick.tilt
 *
 * 方向値は右方向を0.0とし時計回りを正とするラジアン系です。
 * スティックの傾き値は0.0～1.0の間で正規化されます。
 * 0.2以下は遊びとして切り捨てられ0.0とされます。
 *
 * 例えば次の入力値のときスティックの状態は
 *   {dir:   0.0, tilt: 1.0}  // 右方向に一杯
 *   {dir:  3.14, tilt: 0.5}  // 左方向に半分
 *   {dir:  1.57, tilt: 1.0}  // 下方向に一杯
 *   {dir: -1.57, tilt: 0.5}  // 上方向に半分
 *
 * ■利用規約
 * MITライセンスのもと、商用利用、改変、再配布が可能です。
 * ただし冒頭のコメントは削除や改変をしないでください。
 *
 * これを利用したことによるいかなる損害にも作者は責任を負いません。
 * サポートは期待しないでください＞＜。
 */

var Imported = Imported || {};
Imported.SAN_AnalogStick = true;

var Sanshiro = Sanshiro || {};
Sanshiro.AnalogStick = Sanshiro.AnalogStick || {};
Sanshiro.AnalogStick.version = "1.0.0";

(function () {
  "use strict";

  //-----------------------------------------------------------------------------
  // Input
  //
  // インプットクラス

  // ゲームパッドアナログスティック
  Input.leftStick = { dir: 0.0, tilt: 0.0 }; // 左スティック
  Input.rightStick = { dir: 0.0, tilt: 0.0 }; // 右スティック

  Input._stickThreshold = 0.2; // 入力検知閾値（遊び）

  // フレーム更新
  var _Input_update = Input.update;
  Input.update = function () {
    _Input_update.call(this);
    this._updateSticks();
  };

  // ゲームパッドアナログスティックの更新
  Input._updateSticks = function () {
    var axes = [0.0, 0.0, 0.0, 0.0];
    if (!!navigator.getGamepads && !!navigator.getGamepads()) {
      // 接続されたゲームパッドのうち最も傾きの大きいアナログスティック値を採用
      var gamepads = navigator.getGamepads();
      for (var i = 0; i < gamepads.length; i++) {
        var gamepad = gamepads[i];
        if (!gamepad || !gamepad.connected) {
          continue;
        }
        if (
          Math.pow(axes[0], 2) +
            Math.pow(axes[1], 2) +
            Math.pow(axes[2], 2) +
            Math.pow(axes[3], 2) <
          Math.pow(gamepad.axes[0], 2) +
            Math.pow(gamepad.axes[1], 2) +
            Math.pow(gamepad.axes[2], 2) +
            Math.pow(gamepad.axes[3], 2)
        ) {
          axes = gamepad.axes;
        }
      }
    }
    // 左スティック
    this.leftStick.dir = this._stickDir(axes[0], axes[1]);
    this.leftStick.tilt = this._stickTilt(axes[0], axes[1]);
    // 右スティック
    this.rightStick.dir = this._stickDir(axes[2], axes[3]);
    this.rightStick.tilt = this._stickTilt(axes[2], axes[3]);
  };

  // アナログスティックの傾き
  Input._stickTilt = function (x, y) {
    var tilt = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    var tTh = this._stickThreshold; // 入力検知閾値
    return tilt < tTh ? 0.0 : tilt > 1.0 ? 1.0 : tilt;
  };

  // アナログスティックの方向
  Input._stickDir = function (x, y) {
    return Math.atan2(y, x);
  };
})();
