//==============================================================================
// rpg_mixer.js
//------------------------------------------------------------------------------
// Copyright (c) 2025 Ryan Bramantya All rights reserved.
// Licensed under Apache License
// https://www.apache.org/licenses/LICENSE-2.0.txt
// =============================================================================
/*:
 * @plugindesc [2.1.0] A unified dynamic audio mixer for RPG Maker MV with BGM/ME queue handling
 * @author RyanBram
 * @url http://ryanbram.itch.io/
 * @target MV MZ
 *
 * @help
 * --- Introduction ---
 * This plugin acts as a central mixer to play various external audio formats.
 * It features DYNAMIC LOADING, global effects for MIDI, and SMART PRELOADING.
 *
 * Version 2.1.0 adds proper BGM/ME queue handling for non-native formats.
 *
 * --- External Audio Formats ---
 * RPG Maker's editor only recognizes ogg extension for audio assets. To play MIDI
 * or MOD files, you need to add a suffix to the filename and place the actual
 * audio data in BGM, or ME directory. The plugin detects the format based on
 * the suffix and loads the corresponding backend.  The suffix tricks the editor into
 * accepting the file while allowing the plugin to identify and load the correct
 * backend for MIDI/MOD playback.
 *
 * Supported Formats:
 * - MIDI: .mid, .rmi (suffix: _mid, _rmi)
 *   *) Requires a soundfont file named "soundfont.sf2" placed in the ./audio directory
 * - MOD: .mod, .xm, .s3m, .it, .mptm, .mo3 (suffix: _mod, _xm, _s3m, _it, _mptm, _mo3)
 *
 * Examples:
 * - To play "Battle.mid", rename the file to "Battle_mid.ogg"
 * - To play "Song.mod", rename the file to "Song_mod.ogg"
 * - To play "Track.xm", rename the file to "Track_xm.ogg"
 *
 * @param --- MIDI Effects ---
 *
 * @param Enable Reverb
 * @desc Enables the global reverb effect for MIDI playback.
 * @type boolean
 * @default false
 *
 * @param Reverb Mix Level
 * @desc Controls the reverb volume. 0.0 (dry) to 1.0 (wet).
 * Reasonable values: 0.2 - 0.5
 * @type number
 * @decimals 2
 * @default 0.3
 *
 * @param Reverb IR File (Optional)
 * @desc The .wav file for reverb. If left empty, it will use the
 * default reverb sound from the library.
 * @type file
 * @dir audio/
 * @default
 *
 * @param Enable Chorus
 * @desc Enables the global chorus effect for MIDI playback.
 * @type boolean
 * @default false
 *
 * @param Chorus Depth (s)
 * @desc Controls the chorus modulation width in seconds.
 * Reasonable values: 0.001 - 0.004
 * @type number
 * @decimals 3
 * @default 0.002
 *
 * @param Chorus Rate (Hz)
 * @desc Controls the chorus modulation speed in Hertz.
 * Reasonable values: 0.5 - 2.0
 * @type number
 * @decimals 2
 * @default 1.5
 *
 * @param Chorus Delay (s)
 * @desc Base delay time for the chorus in seconds.
 * Reasonable values: 0.020 - 0.035
 * @type number
 * @decimals 3
 * @default 0.025
 */

/*:ja
 * @plugindesc [2.1.0] RPG Maker MV/MZ 用の統合ダイナミックオーディオミキサー、BGM/ME キュー処理付き
 * @author RyanBram
 * @url http://ryanbram.itch.io/
 * @target MV MZ
 *
 * @help
 * --- 導入 ---
 * このプラグインは、さまざまな外部オーディオ形式を再生するための中央ミキサーとして機能します。
 * DYNAMIC LOADING、MIDI のグローバルエフェクト、SMART PRELOADING を特徴とします。
 *
 * バージョン 2.1.0 では、非ネイティブ形式の BGM/ME キュー処理が適切に追加されました。
 *
 * --- 外部オーディオ形式 ---
 * RPG Maker のエディタはオーディオアセットに対して ogg 拡張子のみを認識します。MIDI
 * または MOD ファイルを再生するには、ファイル名にサフィックスを追加し、実際の
 * オーディオデータを BGM または ME ディレクトリに配置します。プラグインはサフィックスに基づいて
 * 形式を検出し、対応するバックエンドをロードします。サフィックスはエディタを騙して
 * ファイルを認識させ、プラグインが正しいバックエンドを識別してロードできるようにします。
 *
 * サポートされる形式:
 * - MIDI: .mid, .rmi (サフィックス: _mid, _rmi)
 *   *) "soundfont.sf2" という名前のサウンドフォントファイルを ./audio ディレクトリに配置する必要があります
 * - MOD: .mod, .xm, .s3m, .it, .mptm, .mo3 (サフィックス: _mod, _xm, _s3m, _it, _mptm, _mo3)
 *
 * 例:
 * - "Battle.mid" を再生するには、ファイルを "Battle_mid.ogg" にリネームします
 * - "Song.mod" を再生するには、ファイルを "Song_mod.ogg" にリネームします
 * - "Track.xm" を再生するには、ファイルを "Track_xm.ogg" にリネームします
 *
 * @param --- MIDI エフェクト ---
 *
 * @param Enable Reverb
 * @desc MIDI 再生のリバーブグローバルエフェクトを有効にします。
 * @type boolean
 * @default false
 *
 * @param Reverb Mix Level
 * @desc リバーブの音量を制御します。0.0 (ドライ) から 1.0 (ウェット)。
 * 合理的な値: 0.2 - 0.5
 * @type number
 * @decimals 2
 * @default 0.3
 *
 * @param Reverb IR File (Optional)
 * @desc リバーブの .wav ファイル。空の場合、デフォルトのリバーブ音が使用されます。
 * @type file
 * @dir audio/
 * @default
 *
 * @param Enable Chorus
 * @desc MIDI 再生のコーラスグローバルエフェクトを有効にします。
 * @type boolean
 * @default false
 *
 * @param Chorus Depth (s)
 * @desc コーラスの変調幅を秒単位で制御します。
 * 合理的な値: 0.001 - 0.004
 * @type number
 * @decimals 3
 * @default 0.002
 *
 * @param Chorus Rate (Hz)
 * @desc コーラスの変調速度をヘルツ単位で制御します。
 * 合理的な値: 0.5 - 2.0
 * @type number
 * @decimals 2
 * @default 1.5
 *
 * @param Chorus Delay (s)
 * @desc コーラスのベース遅延時間を秒単位で制御します。
 * 合理的な値: 0.020 - 0.035
 * @type number
 * @decimals 3
 * @default 0.025
 */

"use strict";

(function () {
  "use strict";

  // ============================================
  // Plugin Parameters
  // ============================================

  var pluginName = "rpg_mixer";
  var parameters = PluginManager.parameters(pluginName);
  var paramEnableReverb = parameters["Enable Reverb"] === "true";
  var paramReverbMix = parseFloat(parameters["Reverb Mix Level"] || 0.3);
  var paramReverbIRFile = parameters["Reverb IR File (Optional)"];
  var paramEnableChorus = parameters["Enable Chorus"] === "true";
  var paramChorusDepth = parseFloat(parameters["Chorus Depth (s)"] || 0.002);
  var paramChorusRate = parseFloat(parameters["Chorus Rate (Hz)"] || 1.5);
  var paramChorusDelay = parseFloat(parameters["Chorus Delay (s)"] || 0.025);
