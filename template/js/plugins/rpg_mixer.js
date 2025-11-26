//==============================================================================
// rpg_mixer.js
//------------------------------------------------------------------------------
// Copyright (c) 2025 Ryan Bramantya All rights reserved.
// Licensed under Apache License
// https://www.apache.org/licenses/LICENSE-2.0.txt
// =============================================================================
/*:
 * @plugindesc [2.0.0] A unified dynamic audio mixer for RPG Maker MV
 * @author RyanBram
 * @url http://ryanbram.itch.io/
 * @target MV MZ
 *
 * @help
 * --- Introduction ---
 * This plugin acts as a central mixer to play various external audio formats.
 * It features DYNAMIC LOADING, global effects for MIDI, and SMART PRELOADING.
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
 * The plugin automatically scans all audio used in the game and
 * preloads the backend (MIDI/MOD) at boot. This ensures:
 * - Title screen BGM will play immediately without delay
 * - Battle BGM and Victory ME are ready when the battle starts
 * - No bottleneck when playing MIDI/MOD for the first time
 * - The backend is only loaded once, ensuring smooth audio transitions
 *
 * Preloading includes:
 * 1. System Audio: Title BGM, Battle BGM, Victory/Defeat ME
 * 2. Map Events: Scan playBGM/playME commands in all events
 * 3. Backend Libraries: SpessaSynth + Soundfont, libopenmpt
 *
 * --- MIDI Effects (Chorus & Reverb) ---
 * You can now enable global Chorus and Reverb effects for all MIDI files.
 *
 * - Chorus Parameters: (See previous version for details)
 *
 * - Reverb:
 * - Reverb IR File (Optional): You can use a custom Impulse
 * Response (.wav) file for unique reverb sounds (e.g., church reverb,
 * cave, etc.). Place the file in the /audio/ folder.
 * - IF LEFT EMPTY: The reverb will still function using
 * the default reverb sound already included in the library.
 *
 * - Reverb:
 * - Reverb IR File (Optional): You can use a custom Impulse
 * Response (.wav) file for unique reverb sounds (e.g., church reverb,
 * cave, etc.). Place the file in the /audio/ folder.
 * - IF LEFT EMPTY: The reverb will still function using
 * the default reverb sound already included in the library.
 *
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
 * Readonable values: 0.2 - 0.5
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

  // ============================================
  // Global Effects Manager
  // ============================================

  const EffectsManager = {
    _isInitialized: false,
    _pluginParameters: {
      enableChorus: paramEnableChorus,
      chorusDepth: paramChorusDepth,
      chorusRate: paramChorusRate,
      chorusDelay: paramChorusDelay,
      enableReverb: paramEnableReverb,
      reverbMix: paramReverbMix,
      reverbIRFile: paramReverbIRFile,
    },
    _context: null,
    _chorus: null,
    _reverb: null,
    _reverbDryGain: null,
    _reverbWetGain: null,
    _inputNode: null,
    _outputNode: null,

    initialize: function (SpessaLib, audioContext) {
      if (this._isInitialized || !audioContext) return;
      this._isInitialized = true;
      this._context = audioContext;

      // Call the built-in reverb decoder only once during initialization
      if (SpessaLib.decodeReverb) {
        SpessaLib.decodeReverb(this._context);
      }

      console.log("[Rpg_Mixer] Initializing global effects...");

      this._inputNode = this._context.createGain();
      this._outputNode = this._context.createGain();
      let lastNode = this._inputNode;

      if (this._pluginParameters.enableChorus) {
        try {
          const chorusConfig = {
            depth: this._pluginParameters.chorusDepth,
            rate: this._pluginParameters.chorusRate,
            delay: this._pluginParameters.chorusDelay * 1000,
          };
          this._chorus = new SpessaLib.ChorusProcessor(
            this._context,
            chorusConfig,
          );
          lastNode.connect(this._chorus.input);
          lastNode = this._chorus.output;
          console.log(
            "[Rpg_Mixer] Global Chorus effect enabled.",
            chorusConfig,
          );
        } catch (e) {
          console.error(
            "[Rpg_Mixer] Failed to create or connect ChorusProcessor.",
            e,
          );
        }
      }

      // --- Reverb logic updated ---
      if (this._pluginParameters.enableReverb) {
        const reverbMixLevel = this._pluginParameters.reverbMix;
        console.log(
          "[Rpg_Mixer] Reverb enabled. Mix parameter from plugin:",
          reverbMixLevel,
        );

        // Create gain nodes for wet/dry mixing
        this._reverbDryGain = this._context.createGain();
        this._reverbWetGain = this._context.createGain();

        // Set gain values based on the reverbMixLevel
        // dry = 1 - mix, wet = mix
        this._reverbDryGain.gain.value = 1.0 - reverbMixLevel;
        this._reverbWetGain.gain.value = reverbMixLevel;

        console.log(
          "[Rpg_Mixer] Reverb Mix - Dry:",
          this._reverbDryGain.gain.value,
          "Wet:",
          this._reverbWetGain.gain.value,
        );

        // If an IR file is specified, load that file
        if (this._pluginParameters.reverbIRFile) {
          this._loadImpulseResponse().then((impulseResponse) => {
            if (impulseResponse) {
              try {
                const reverbConfig = { impulseResponse: impulseResponse };
                this._reverb = new SpessaLib.ReverbProcessor(
                  this._context,
                  reverbConfig,
                );

                // Setup routing: input -> [dry path, wet path] -> output
                // Dry path: lastNode -> dryGain -> output
                lastNode.connect(this._reverbDryGain);
                this._reverbDryGain.connect(this._outputNode);

                // Wet path: lastNode -> reverb -> wetGain -> output
                lastNode.connect(this._reverb.input);
                this._reverb.output.connect(this._reverbWetGain);
                this._reverbWetGain.connect(this._outputNode);

                console.log(
                  "[Rpg_Mixer] Global Reverb enabled with custom IR. Mix:",
                  reverbMixLevel,
                );
              } catch (e) {
                console.error(
                  "[Rpg_Mixer] Failed to create ReverbProcessor with custom IR.",
                  e,
                );
                lastNode.connect(this._outputNode);
              }
            } else {
              console.error(
                "[Rpg_Mixer] Failed to load impulse response, connecting directly.",
              );
              lastNode.connect(this._outputNode);
            }
          });
        }
        // If no IR file is provided, use the default reverb
        else {
          try {
            const reverbConfig = {};
            this._reverb = new SpessaLib.ReverbProcessor(
              this._context,
              reverbConfig,
            );

            // Setup routing: input -> [dry path, wet path] -> output
            // Dry path: lastNode -> dryGain -> output
            lastNode.connect(this._reverbDryGain);
            this._reverbDryGain.connect(this._outputNode);

            // Wet path: lastNode -> reverb -> wetGain -> output
            lastNode.connect(this._reverb.input);
            this._reverb.output.connect(this._reverbWetGain);
            this._reverbWetGain.connect(this._outputNode);

            console.log(
              "[Rpg_Mixer] Global Reverb enabled with default sound. Mix:",
              reverbMixLevel,
            );
          } catch (e) {
            console.error(
              "[Rpg_Mixer] Failed to create default ReverbProcessor.",
              e,
            );
            lastNode.connect(this._outputNode);
          }
        }
      } else {
        // If reverb is not enabled, connect directly to the output
        lastNode.connect(this._outputNode);
      }
    },

    _loadImpulseResponse: async function () {
      const path = `audio/${this._pluginParameters.reverbIRFile}`;
      console.log(`[Rpg_Mixer] Loading Reverb Impulse Response from: ${path}`);
      try {
        const response = await fetch(path);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await this._context.decodeAudioData(arrayBuffer);
        return audioBuffer;
      } catch (e) {
        console.error(
          `[Rpg_Mixer] Failed to load or decode Impulse Response file '${path}'.`,
          e,
        );
        return null;
      }
    },

    getInputNode: function () {
      return this._inputNode;
    },

    getOutputNode: function () {
      return this._outputNode;
    },
  };

  const DebugManager = {
    debugDiv: null,
    debugMode: 0, // 0: Off, 1: Audio Profile, 2: Visualizer (WIP)
    lastAudioInfo: {},
    isInitialized: false,

    initialize: function () {
      if (this.isInitialized) return;
      this.isInitialized = true;

      const div = document.createElement("div");
      div.id = "rpgMixerDebugInfo";
      div.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
      div.style.color = "white";
      div.style.fontFamily = "monospace";
      div.style.fontSize = "16px";
      div.style.padding = "8px";
      div.style.position = "fixed";
      div.style.left = "0";
      div.style.bottom = "0";
      div.style.zIndex = "101";
      div.style.display = "none";
      document.body.appendChild(div);
      this.debugDiv = div;

      document.addEventListener("keydown", (event) => {
        // Checking F2 input (keyCode 113)
        if (event.keyCode === 113) {
          event.preventDefault();
          this.cycleMode();
        }
      });
    },

    cycleMode: function () {
      // Cycle through: Off -> Mode 1 -> Mode 2 -> Off
      this.debugMode = (this.debugMode + 1) % 3;

      if (this.debugDiv) {
        this.debugDiv.style.display = this.debugMode > 0 ? "block" : "none";
      }

      if (this.debugMode > 0) {
        this.updateInfo(this.lastAudioInfo);
      }
    },

    show: function () {
      // Initialize if not yet initialized
      if (!this.isInitialized) {
        this.initialize();
      }
      // Set to mode 1 if currently off
      if (this.debugMode === 0) {
        this.debugMode = 1;
      }
      if (this.debugDiv) {
        this.debugDiv.style.display = "block";
        if (this.lastAudioInfo) {
          this.updateInfo(this.lastAudioInfo);
        }
      }
    },

    hide: function () {
      // Don't change debugMode, just hide
      if (this.debugDiv) {
        this.debugDiv.style.display = "none";
      }
    },

    updateInfo: function (info) {
      if (info && Object.keys(info).length > 0) {
        this.lastAudioInfo = info;
      }

      if (!this.debugDiv || this.debugMode === 0) return;

      const fileName = this.lastAudioInfo.fileName || "N/A";
      const backend = this.lastAudioInfo.backend || "N/A";
      let playbackMode = this.lastAudioInfo.playbackMode || "N/A";
      const loadTime =
        this.lastAudioInfo.loadTime !== undefined
          ? `${Math.round(this.lastAudioInfo.loadTime)}ms`
          : "Streaming";
      const decodeTime =
        this.lastAudioInfo.decodeTime !== undefined
          ? `${Math.round(this.lastAudioInfo.decodeTime)}ms`
          : "N/A";

      if (playbackMode.length > 0) {
        playbackMode =
          playbackMode.charAt(0).toUpperCase() + playbackMode.slice(1);
      }
      const effects = [];
      if (EffectsManager._chorus) effects.push("Chorus");
      if (EffectsManager._reverb) effects.push("Reverb");
      const effectsText = effects.length > 0 ? effects.join(" & ") : "None";

      const content = `
    <b style="color: #80ff80;">MODE: ${playbackMode}</b><br>
    <hr style="border-color: #555; margin: 4px 0;">
    <b>File:</b> ${fileName}<br>
    <b>Backend:</b> ${backend}<br>
    <b>Effects:</b> ${effectsText}<br>
    <b>Load Time:</b> ${loadTime}<br>
    <b>Parse Time:</b> ${decodeTime}
    `;

      this.debugDiv.innerHTML = content.trim().replace(/^\s+/gm, "");
    },
  };

  // --- Dynamic Backend Loader & Manager ---
  const BackendManager = {
    _state: {
      libopenmpt: "unloaded",
      spessasynth: "unloaded",
    },
    _promises: {},
    _spessa: {
      lib: null,
      audioContext: null,
      synthesizer: null,
      sequencer: null,
      gainNode: null,
    },

    require: function (backendName) {
      if (this._promises[backendName]) {
        return this._promises[backendName];
      }

      if (backendName === "libopenmpt") {
        this._promises.libopenmpt = this._requireLibOpenMPT();
      } else if (backendName === "spessasynth") {
        this._promises.spessasynth = this._requireSpessaSynth();
      } else {
        return Promise.reject(
          `[Rpg_Mixer] Backend '${backendName}' is not defined.`,
        );
      }
      return this._promises[backendName];
    },
    _requireSpessaSynth: function () {
      return new Promise(async (resolve, reject) => {
        if (this._state.spessasynth === "ready")
          return resolve(this._spessa.lib);
        if (this._state.spessasynth === "failed")
          return reject(
            "[Rpg_Mixer] SpessaSynth engine previously failed to load.",
          );

        console.log("[Rpg_Mixer] SpessaSynth engine loading started...");
        this._state.spessasynth = "loading";

        try {
          if (!this._spessa.lib) {
            await this._loadScript("js/libs/libspessasynth.worklet.js");
            await this._waitForSpessaLibrary();
            if (!this._spessa.lib)
              throw new Error("SpessaSynthLib not found on window.");
          }
          const audioContext = WebAudio._context || new AudioContext();
          // Create AudioContext with optimized settings for Chrome
          /*
                    const audioContext =
                        WebAudio._context ||
                        new AudioContext({
                            latencyHint: "playback", // Optimize for playback quality over latency
                            sampleRate: 44100, // Standard sample rate for better compatibility
                        });
                        */
          if (audioContext.state === "suspended") await audioContext.resume();

          EffectsManager.initialize(this._spessa.lib, audioContext);

          if (!this._spessa.workletLoaded) {
            // Use the built-in function from SpessaSynthLib to create a Blob URL from inline code
            const workletUrl = this._spessa.lib.createWorkletBlobURL();
            await audioContext.audioWorklet.addModule(workletUrl);
            URL.revokeObjectURL(workletUrl);
            this._spessa.workletLoaded = true;
          }

          let soundfontBuffer = null;
          const primarySfUrl = "audio/soundfont.sf2";

          try {
            console.log(
              `[Rpg_Mixer] Attempting to load primary soundfont: ${primarySfUrl}`,
            );
            const primarySfResponse = await fetch(primarySfUrl);
            if (!primarySfResponse.ok) {
              throw new Error(`HTTP status ${primarySfResponse.status}`);
            }
            soundfontBuffer = await primarySfResponse.arrayBuffer();
            console.log("[Rpg_Mixer] Primary soundfont loaded successfully.");
          } catch (primaryError) {
            console.warn(
              `[Rpg_Mixer] Primary soundfont failed to load (${primaryError.message}). Checking for Windows fallback...`,
            );
            const isWindows =
              typeof process !== "undefined" && process.platform === "win32";
            if (isWindows) {
              const fallbackPath = "C:/Windows/System32/drivers/gm.dls";
              console.log(
                `[Rpg_Mixer] Windows detected. Attempting to load fallback: ${fallbackPath}`,
              );
              try {
                const fs = require("fs").promises;
                const fileBuffer = await fs.readFile(fallbackPath);
                soundfontBuffer = fileBuffer.buffer.slice(
                  fileBuffer.byteOffset,
                  fileBuffer.byteOffset + fileBuffer.byteLength,
                );
                console.log(
                  "[Rpg_Mixer] Fallback DLS soundfont loaded successfully.",
                );
              } catch (fallbackError) {
                throw new Error(
                  `Primary SoundFont failed AND Windows fallback DLS could not be loaded from ${fallbackPath}. Reason: ${fallbackError.message}`,
                );
              }
            } else {
              throw new Error(
                `Primary SoundFont not found. No fallback available for non-Windows OS.`,
              );
            }
          }

          if (!soundfontBuffer) {
            throw new Error("Fatal: Could not load any valid soundfont.");
          }
          this._spessa.soundfontBuffer = soundfontBuffer;

          this._state.spessasynth = "ready";
          console.log("[Rpg_Mixer] SpessaSynth engine is ready.");
          resolve(this._spessa.lib);
        } catch (error) {
          this._state.spessasynth = "failed";
          console.error(
            "[Rpg_Mixer] FAILED to initialize SpessaSynth engine.",
            error,
          );
          reject(error);
        }
      });
    },

    _loadScript: function (path) {
      return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = path;
        script.async = true;
        script.onload = resolve;
        script.onerror = () => reject(`Failed to load script: ${path}`);
        document.body.appendChild(script);
      });
    },
    _fetchScriptAsBlob: async function (path) {
      const response = await fetch(path);
      if (!response.ok) throw new Error(`Could not fetch script: ${path}`);
      return new Blob([await response.text()], {
        type: "application/javascript",
      });
    },
    _waitForSpessaLibrary: function () {
      return new Promise((resolve) => {
        const interval = setInterval(() => {
          if (window.SpessaSynthLib) {
            clearInterval(interval);
            this._spessa.lib = window.SpessaSynthLib;
            resolve();
          }
        }, 50);
      });
    },

    _requireLibOpenMPT: function () {
      return new Promise((resolve, reject) => {
        if (this._state.libopenmpt === "ready") return resolve();
        if (this._state.libopenmpt === "failed")
          return reject("[Rpg_Mixer] libopenmpt backend failed to load.");

        this._state.libopenmpt = "loading";
        const workletPath = "js/libs/libopenmpt.worklet.js";

        if (!WebAudio._context) {
          return reject(
            "[Rpg_Mixer] WebAudio context not available for worklet loading.",
          );
        }

        WebAudio._context.audioWorklet
          .addModule(workletPath)
          .then(() => {
            console.log(
              `[Rpg_Mixer] Backend 'libopenmpt' is ready. Using: Worklet`,
            );
            this._state.libopenmpt = "ready";
            resolve();
          })
          .catch((error) => {
            console.error(
              `[Rpg_Mixer] FAILED to load worklet from ${workletPath}.`,
              error,
            );
            this._state.libopenmpt = "failed";
            reject(
              "[Rpg_Mixer] FAILED to load backend script for 'libopenmpt'.",
            );
          });
      });
    },
  };

  // --- Format Handler Configuration ---
  const formatHandlers = {
    midi: {
      extensions: ["_mid", "_rmi"],
      backend: "spessasynth",
    },
    mod: {
      extensions: ["_mod", "_xm", "_s3m", "_it", "_mptm", "_mo3"],
      backend: "libopenmpt",
    },
  };

  //=============================================================================
  // ExternalAudio
  //=============================================================================
  function ExternalAudio() {
    this.initialize.apply(this, arguments);
  }

  ExternalAudio.prototype.initialize = function (url, format) {
    this._url = url;
    this._format = format;
    this._buffer = null;
    this._volume = 1;
    this._loop = false;
    this._isLoading = false;
    this._onLoadListeners = [];
    this._context = WebAudio._context;
    this._load();
    this._loadTime = undefined;
    this._decodeTime = undefined;
    this._gainNode = null;
    this._workletNode = null; // MOD
    this._synthesizer = null; // MIDI
    this._sequencer = null; //MIDI
  };

  ExternalAudio.prototype.play = function (loop, offset) {
    if (!this.isReady()) {
      this.addLoadListener(() => this.play(loop, offset));
      return;
    }

    const isSameSong =
      this._format === "midi" &&
      BackendManager._spessa.sequencer &&
      BackendManager._spessa.sequencer.activeSong &&
      BackendManager._spessa.sequencer.activeSong.arrayBuffer === this._buffer;

    if (!isSameSong) {
      this.stop();
    }

    this._loop = loop;
    const backendName = formatHandlers[this._format].backend;

    BackendManager.require(backendName)
      .then(() => {
        if (this._format === "midi") {
          this._playMidi(offset, isSameSong);
        } else if (this._format === "mod") {
          this._playMod(offset);
        }
      })
      .catch((error) => {
        console.error(
          `[Rpg_Mixer] Backend '${backendName}' failed to load.`,
          error,
        );
      });
  };

  ExternalAudio.prototype.isReady = function () {
    return !!this._buffer;
  };

  ExternalAudio.prototype.isPlaying = function () {
    if (this._format === "midi") {
      return (
        BackendManager._spessa.sequencer &&
        BackendManager._spessa.sequencer.isPlaying
      );
    }
    if (this._format === "mod") {
      return !!this._workletNode;
    }
    return false;
  };

  ExternalAudio.prototype.addLoadListener = function (listener) {
    this._onLoadListeners.push(listener);
  };

  ExternalAudio.prototype._callLoadListeners = function () {
    while (this._onLoadListeners.length > 0) {
      this._onLoadListeners.shift()();
    }
  };

  ExternalAudio.prototype._reportDebugInfo = function () {
    let fileName = this._url.substring(this._url.lastIndexOf("/") + 1);
    fileName = decodeURIComponent(fileName).replace(/\.ogg$/, "");
    let backendName = "N/A";
    let mode = "Unknown";

    if (this._format === "mod") {
      backendName = "libopenmpt";
      mode = "Worklet";
    } else if (this._format === "midi") {
      backendName = "spessasynth";
      mode = "Worklet";
    }

    DebugManager.updateInfo({
      fileName: decodeURIComponent(fileName),
      backend: backendName,
      playbackMode: mode,
      loadTime: this._loadTime,
      decodeTime: this._decodeTime,
    });
  };

  ExternalAudio.prototype._load = function () {
    if (this._isLoading || this.isReady()) return;
    this._isLoading = true;
    const startTime = performance.now();
    const xhr = new XMLHttpRequest();
    xhr.open("GET", this._url);
    xhr.responseType = "arraybuffer";
    xhr.onload = () => {
      this._isLoading = false;
      if (xhr.status < 400) {
        this._loadTime = performance.now() - startTime;
        this._buffer = xhr.response;
        this._callLoadListeners();
      } else {
        console.error(`[Rpg_Mixer] Failed to load ${this._url}`);
      }
    };
    xhr.onerror = () => {
      this._isLoading = false;
      console.error(`[Rpg_Mixer] Network error on loading ${this._url}`);
    };
    xhr.send();
  };

  ExternalAudio.prototype._getActiveGainNode = function () {
    return this._gainNode;
  };

  ExternalAudio.prototype.fadeOut = function (duration) {
    const gainNode = this._getActiveGainNode();
    if (!gainNode) return;

    const currentTime = this._context.currentTime;
    const gain = gainNode.gain;

    gain.cancelScheduledValues(currentTime);
    gain.setValueAtTime(gain.value, currentTime);
    gain.linearRampToValueAtTime(0.0001, currentTime + duration);

    setTimeout(() => this.stop(), duration * 1000);
  };

  ExternalAudio.prototype.fadeIn = function (duration) {
    const gainNode = this._getActiveGainNode();
    if (!gainNode) return;

    const currentTime = this._context.currentTime;
    const gain = gainNode.gain;

    gain.cancelScheduledValues(currentTime);
    gain.setValueAtTime(0, currentTime);
    gain.linearRampToValueAtTime(this._volume, currentTime + duration);
  };

  ExternalAudio.prototype.updateParameters = function (config) {
    if (config.volume !== undefined) {
      this.volume = config.volume / 100;
    }
  };

  ExternalAudio.prototype.stop = function () {
    if (this._format === "midi") {
      this._stopMidi();
    } else if (this._format === "mod") {
      this._stopMod();
    }
  };

  ExternalAudio.prototype.destroy = function () {
    this.stop();
    if (this._gainNode) {
      this._gainNode.disconnect();
      this._gainNode = null;
    }
    this._buffer = null;
    this._onLoadListeners = [];
  };

  ExternalAudio.prototype.isError = function () {
    return false;
  };

  ExternalAudio.prototype.seek = function () {
    if (this._format === "midi") {
      if (this._sequencer) {
        return this._sequencer.currentTime || 0;
      }
    }
    if (this._format === "mod") {
      return this._currentPosition || 0;
    }
    return 0;
  };

  Object.defineProperty(ExternalAudio.prototype, "volume", {
    get: function () {
      return this._volume;
    },
    set: function (value) {
      this._volume = value;
      if (this._gainNode) {
        this._gainNode.gain.setValueAtTime(
          this._volume,
          this._context.currentTime,
        );
      }
    },
    configurable: true,
  });

  ExternalAudio.prototype._playMidi = function (offset) {
    this.stop();

    const SpessaLib = BackendManager._spessa.lib;
    const soundfont = BackendManager._spessa.soundfontBuffer;

    if (!SpessaLib || !soundfont) {
      console.error("[Rpg_Mixer] SpessaSynth library or soundfont not ready.");
      return;
    }

    this._synthesizer = new SpessaLib.WorkletSynthesizer(this._context);
    this._synthesizer.setMasterParameter("masterGain", 2);
    this._gainNode = this._context.createGain();
    this._gainNode.gain.value = this._volume;

    const effectsInput = EffectsManager.getInputNode();
    const effectsOutput = EffectsManager.getOutputNode();
    if (effectsInput && effectsOutput) {
      this._synthesizer.connect(effectsInput);
      effectsOutput.connect(this._gainNode);
    } else {
      this._synthesizer.connect(this._gainNode);
    }
    this._gainNode.connect(
      WebAudio._masterGainNode || this._context.destination,
    );

    this._sequencer = new SpessaLib.Sequencer(this._synthesizer);

    this._synthesizer.soundBankManager
      .addSoundBank(soundfont.slice(0), "default")
      .then(() => {
        const startTime = performance.now();
        this._sequencer.loadNewSongList([{ binary: this._buffer }]);
        this._decodeTime = performance.now() - startTime;
        this._sequencer.loopCount = this._loop ? Infinity : 0;
        this._sequencer.currentTime = offset || 0;
        this._sequencer.play();
        this._reportDebugInfo();
      });
  };

  ExternalAudio.prototype._stopMidi = function () {
    if (this._sequencer) {
      this._sequencer.pause();
      this._sequencer = null;
    }
    if (this._synthesizer) {
      this._synthesizer.disconnect();
      this._synthesizer = null;
    }
    if (this._gainNode) {
      this._gainNode.disconnect();
      this._gainNode = null;
    }
  };

  ExternalAudio.prototype._playMod = function (offset) {
    this.stop();

    const pos = offset || 0;
    this._currentPosition = pos;

    const startTime = performance.now();
    this._workletNode = new AudioWorkletNode(
      this._context,
      "libopenmpt-processor",
      {
        numberOfInputs: 0,
        numberOfOutputs: 1,
        outputChannelCount: [2],
      },
    );
    this._workletNode.port.onmessage = (msg) => {
      const data = msg.data;
      if (data.cmd === "pos") {
        this._currentPosition = data.pos;
      } else if (data.cmd === "meta" && pos > 0) {
        this._workletNode.port.postMessage({ cmd: "setPos", val: pos });
      } else if (data.cmd === "end") {
        if (this._loop) {
          this.play(this._loop, 0);
        } else {
          this.stop();
        }
      }
    };

    const config = {
      repeatCount: this._loop ? -1 : 0,
      stereoSeparation: 100,
      interpolationFilter: 0,
    };
    this._workletNode.port.postMessage({ cmd: "config", val: config });
    this._workletNode.port.postMessage({ cmd: "play", val: this._buffer });
    this._decodeTime = performance.now() - startTime;
    this._setupModWebAudioNodes();
    this._workletNode.connect(this._gainNode);
    this._reportDebugInfo();
  };

  ExternalAudio.prototype._stopMod = function () {
    if (this._workletNode) {
      this._workletNode.port.postMessage({ cmd: "stop" });
      this._workletNode.disconnect();
      this._workletNode = null;
    }
  };

  ExternalAudio.prototype._setupModWebAudioNodes = function () {
    if (!this._gainNode) {
      this._gainNode = this._context.createGain();
      this._gainNode.connect(WebAudio._masterGainNode);
    }
    this._gainNode.gain.value = this._volume;
  };

  //=============================================================================
  // AudioManager Integration
  //=============================================================================
  AudioManager._savedBgm = null;
  AudioManager._savedBgs = null;

  const _AudioManager_createBuffer = AudioManager.createBuffer;
  AudioManager.createBuffer = function (folder, name) {
    const nameWithoutExt = name.replace(/\.ogg$/, "");
    for (const format in formatHandlers) {
      const handler = formatHandlers[format];
      for (const ext of handler.extensions) {
        if (nameWithoutExt.endsWith(ext)) {
          const url =
            this._path + folder + "/" + encodeURIComponent(name) + ".ogg";
          return new ExternalAudio(url, format);
        }
      }
    }
    return _AudioManager_createBuffer.call(this, folder, name);
  };

  console.log(
    "[Rpg_Mixer] Unified dynamic audio player loaded (v2.3.1 with effects fix).",
  );

  //=============================================================================
  // [Modification] Hook for detecting native RPG Maker Audio system
  //=============================================================================
  const _alias_AudioManager_playBgm = AudioManager.playBgm;
  AudioManager.playBgm = function (bgm, pos) {
    _alias_AudioManager_playBgm.call(this, bgm, pos);
    if (this._bgmBuffer && !(this._bgmBuffer instanceof ExternalAudio)) {
      DebugManager.updateInfo({
        fileName: bgm.name + ".ogg",
        backend: "stbvorbis",
        playbackMode: "Legacy",
        loadTime: undefined,
        decodeTime: undefined,
      });
    }
  };

  const _alias_AudioManager_playBgs = AudioManager.playBgs;
  AudioManager.playBgs = function (bgs, pos) {
    _alias_AudioManager_playBgs.call(this, bgs, pos);
    if (this._bgsBuffer && !(this._bgsBuffer instanceof ExternalAudio)) {
      DebugManager.updateInfo({
        fileName: bgs.name + ".ogg",
        backend: "stbvorbis",
        playbackMode: "Legacy",
        loadTime: undefined,
        decodeTime: undefined,
      });
    }
  };

  const _alias_AudioManager_playMe = AudioManager.playMe;
  AudioManager.playMe = function (me) {
    _alias_AudioManager_playMe.call(this, me);
    if (this._meBuffer && !(this._meBuffer instanceof ExternalAudio)) {
      DebugManager.updateInfo({
        fileName: me.name + ".ogg",
        backend: "stbvorbis",
        playbackMode: "Legacy",
        loadTime: undefined,
        decodeTime: undefined,
      });
    }
  };

  const _alias_AudioManager_stopBgm = AudioManager.stopBgm;
  AudioManager.stopBgm = function () {
    DebugManager.updateInfo({});
    _alias_AudioManager_stopBgm.call(this);
  };

  const _alias_AudioManager_stopBgs = AudioManager.stopBgs;
  AudioManager.stopBgs = function () {
    DebugManager.updateInfo({});
    _alias_AudioManager_stopBgs.call(this);
  };

  const _alias_AudioManager_stopMe = AudioManager.stopMe;
  AudioManager.stopMe = function () {
    DebugManager.updateInfo({});
    _alias_AudioManager_stopMe.call(this);
  };

  const _alias_AudioManager_saveBgm = AudioManager.saveBgm;
  AudioManager.saveBgm = function () {
    const savedBgm = _alias_AudioManager_saveBgm.call(this);
    if (
      savedBgm &&
      this._bgmBuffer &&
      this._bgmBuffer instanceof ExternalAudio
    ) {
      savedBgm.pos = this._bgmBuffer.seek();
    }
    return savedBgm;
  };

  const _alias_AudioManager_saveBgs = AudioManager.saveBgs;
  AudioManager.saveBgs = function () {
    const savedBgs = _alias_AudioManager_saveBgs.call(this);
    if (
      savedBgs &&
      this._bgsBuffer &&
      this._bgsBuffer instanceof ExternalAudio
    ) {
      savedBgs.pos = this._bgsBuffer.seek();
    }
    return savedBgs;
  };

  //=============================================================================
  // PreloadManager - Smart preloading for MIDI/MOD backends
  //=============================================================================
  const PreloadManager = {
    _backendsLoaded: {
      midi: false,
      mod: false,
    },
    _preloadedAudio: new Set(),
    _preloadPromises: [],

    /**
     * Scan semua audio yang digunakan di game
     */
    scanGameAudio: function () {
      const audioFiles = new Set();

      // 1. Scan System Audio (Title, Battle, Victory, Defeat, etc.)
      if ($dataSystem) {
        // Title BGM
        if ($dataSystem.titleBgm && $dataSystem.titleBgm.name) {
          audioFiles.add({ name: $dataSystem.titleBgm.name, type: "bgm" });
        }
        // Battle BGM
        if ($dataSystem.battleBgm && $dataSystem.battleBgm.name) {
          audioFiles.add({ name: $dataSystem.battleBgm.name, type: "bgm" });
        }
        // Victory ME
        if ($dataSystem.victoryMe && $dataSystem.victoryMe.name) {
          audioFiles.add({ name: $dataSystem.victoryMe.name, type: "me" });
        }
        // Defeat ME
        if ($dataSystem.defeatMe && $dataSystem.defeatMe.name) {
          audioFiles.add({ name: $dataSystem.defeatMe.name, type: "me" });
        }
      }

      // 2. Scan Map Audio
      if ($dataMapInfos) {
        for (let i = 1; i < $dataMapInfos.length; i++) {
          const mapInfo = $dataMapInfos[i];
          if (mapInfo) {
            // Load map data untuk scan event audio
            this._scanMapData(i, audioFiles);
          }
        }
      }

      console.log("[Rpg_Mixer] Scanned audio files:", Array.from(audioFiles));
      return audioFiles;
    },

    /**
     * Scan audio dari map data tertentu
     */
    _scanMapData: function (mapId, audioFiles) {
      // This will be called asynchronously; scan event commands for playBGM/playME
      const xhr = new XMLHttpRequest();
      const url = "data/Map%1.json".format(mapId.padZero(3));
      xhr.open("GET", url, false); // Synchronous untuk simplicity saat scan
      xhr.overrideMimeType("application/json");
      try {
        xhr.send(null);
        if (xhr.status === 200) {
          const mapData = JSON.parse(xhr.responseText);
          if (mapData && mapData.events) {
            for (const event of mapData.events) {
              if (!event) continue;
              for (const page of event.pages) {
                for (const command of page.list) {
                  // 241: Play BGM, 249: Play ME
                  if (command.code === 241 && command.parameters[0]) {
                    audioFiles.add({
                      name: command.parameters[0].name,
                      type: "bgm",
                    });
                  } else if (command.code === 249 && command.parameters[0]) {
                    audioFiles.add({
                      name: command.parameters[0].name,
                      type: "me",
                    });
                  }
                }
              }
            }
          }
        }
      } catch (e) {
        // Ignore error, map mungkin belum ada
      }
    },

    /**
     * Detect audio format from the filename
     */
    getAudioFormat: function (filename) {
      const formatHandlers = ExternalAudio.formatHandlers;
      for (const format in formatHandlers) {
        const handler = formatHandlers[format];
        for (const ext of handler.extensions) {
          if (filename.endsWith(ext)) {
            return format;
          }
        }
      }
      return null;
    },

    /**
     * Preload the required backends
     */
    preloadBackends: async function (audioFiles) {
      const needsMidi = Array.from(audioFiles).some((file) => {
        const format = this.getAudioFormat(file.name);
        return format === "mid";
      });

      const needsMod = Array.from(audioFiles).some((file) => {
        const format = this.getAudioFormat(file.name);
        return format === "mod";
      });

      const promises = [];

      if (needsMidi && !this._backendsLoaded.midi) {
        console.log("[Rpg_Mixer] Preloading MIDI backend...");
        promises.push(
          this._preloadMidiBackend().then(() => {
            this._backendsLoaded.midi = true;
            console.log("[Rpg_Mixer] MIDI backend preloaded successfully.");
          }),
        );
      }

      if (needsMod && !this._backendsLoaded.mod) {
        console.log("[Rpg_Mixer] Preloading MOD backend...");
        promises.push(
          this._preloadModBackend().then(() => {
            this._backendsLoaded.mod = true;
            console.log("[Rpg_Mixer] MOD backend preloaded successfully.");
          }),
        );
      }

      return Promise.all(promises);
    },

    /**
     * Preload MIDI backend (SpessaSynth + Soundfont)
     */
    _preloadMidiBackend: async function () {
      // Trigger lazy loading for MIDI
      const dummyUrl = "audio/dummy.mid";
      const dummyAudio = new ExternalAudio(dummyUrl, "mid");
      // Wait sampai engine ready
      if (dummyAudio._engine && dummyAudio._engine.isReady) {
        await dummyAudio._engine.isReady;
      }
    },

    /**
     * Preload MOD backend (libopenmpt)
     */
    _preloadModBackend: async function () {
      // Trigger lazy loading for MOD
      const dummyUrl = "audio/dummy.mod";
      const dummyAudio = new ExternalAudio(dummyUrl, "mod");
      // Wait sampai engine ready
      if (dummyAudio._engine && dummyAudio._engine.isReady) {
        await dummyAudio._engine.isReady;
      }
    },

    /**
     * Preload audio files (download but do not decode yet)
     */
    preloadAudioFiles: async function (audioFiles) {
      const promises = [];

      for (const file of audioFiles) {
        const format = this.getAudioFormat(file.name);
        // Only preload MIDI and MOD because they cannot be streamed
        if (
          (format === "mid" || format === "mod") &&
          !this._preloadedAudio.has(file.name)
        ) {
          console.log(`[Rpg_Mixer] Preloading ${file.name}...`);
          const promise = this._preloadSingleFile(
            file.name,
            file.type,
            format,
          ).then(() => {
            this._preloadedAudio.add(file.name);
          });
          promises.push(promise);
        }
      }

      return Promise.all(promises);
    },

    /**
     * Preload single file
     */
    _preloadSingleFile: async function (filename, type, format) {
      const folder = type === "bgm" ? "bgm" : type === "me" ? "me" : "bgs";
      const url = `audio/${folder}/${filename}.ogg`;

      try {
        const response = await fetch(url);
        if (response.ok) {
          // Cache the response for later
          await response.arrayBuffer();
          console.log(`[Rpg_Mixer] Preloaded: ${filename}`);
        }
      } catch (e) {
        console.warn(`[Rpg_Mixer] Failed to preload ${filename}:`, e);
      }
    },

    /**
     * Initialize preloading at boot
     */
    initialize: async function () {
      console.log("[Rpg_Mixer] Starting preload process...");

      // Scan the audio used by the game
      const audioFiles = this.scanGameAudio();

      // Preload the required backends
      await this.preloadBackends(audioFiles);

      // Preload audio files (optional — can be commented out if too heavy)
      // await this.preloadAudioFiles(audioFiles);

      console.log("[Rpg_Mixer] Preload process completed.");
    },

    /**
     * Check if the backend is ready
     */
    isBackendReady: function (format) {
      if (format === "mid") return this._backendsLoaded.midi;
      if (format === "mod") return this._backendsLoaded.mod;
      return true; // Format lain selalu ready
    },
  };

  const _Scene_Boot_start = Scene_Boot.prototype.start;
  Scene_Boot.prototype.start = function () {
    _Scene_Boot_start.call(this);
    DebugManager.initialize();
  };

  // Hook Scene_Boot to preload before entering the Title
  const _Scene_Boot_isReady = Scene_Boot.prototype.isReady;
  Scene_Boot.prototype.isReady = function () {
    if (!this._preloadInitialized) {
      this._preloadInitialized = true;
      this._preloadComplete = false;

      // Start preloading async
      PreloadManager.initialize()
        .then(() => {
          this._preloadComplete = true;
          console.log("[Rpg_Mixer] All preloading complete, game ready.");
        })
        .catch((err) => {
          console.error("[Rpg_Mixer] Preload error:", err);
          this._preloadComplete = true; // Continue anyway
        });
    }

    // Wait until preload done
    return _Scene_Boot_isReady.call(this) && this._preloadComplete;
  };
})();
