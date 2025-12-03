  // ============================================
  // Backend Manager - Dynamic loading of audio backends
  // ============================================

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
          `[Rpg_Mixer] Backend '${backendName}' is not defined.`
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
            "[Rpg_Mixer] SpessaSynth engine previously failed to load."
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
          if (audioContext.state === "suspended") await audioContext.resume();

          EffectsManager.initialize(this._spessa.lib, audioContext);

          if (!this._spessa.workletLoaded) {
            const workletUrl = this._spessa.lib.createWorkletBlobURL();
            await audioContext.audioWorklet.addModule(workletUrl);
            URL.revokeObjectURL(workletUrl);
            this._spessa.workletLoaded = true;
          }

          let soundfontBuffer = null;
          const primarySfUrl = "audio/soundfont.sf2";

          try {
            console.log(
              `[Rpg_Mixer] Attempting to load primary soundfont: ${primarySfUrl}`
            );
            const primarySfResponse = await fetch(primarySfUrl);
            if (!primarySfResponse.ok) {
              throw new Error(`HTTP status ${primarySfResponse.status}`);
            }
            soundfontBuffer = await primarySfResponse.arrayBuffer();
            console.log("[Rpg_Mixer] Primary soundfont loaded successfully.");
          } catch (primaryError) {
            console.warn(
              `[Rpg_Mixer] Primary soundfont failed to load (${primaryError.message}). Checking for Windows fallback...`
            );
            const isWindows =
              typeof process !== "undefined" && process.platform === "win32";
            if (isWindows) {
              const fallbackPath = "C:/Windows/System32/drivers/gm.dls";
              console.log(
                `[Rpg_Mixer] Windows detected. Attempting to load fallback: ${fallbackPath}`
              );
              try {
                const fs = require("fs").promises;
                const fileBuffer = await fs.readFile(fallbackPath);
                soundfontBuffer = fileBuffer.buffer.slice(
                  fileBuffer.byteOffset,
                  fileBuffer.byteOffset + fileBuffer.byteLength
                );
                console.log(
                  "[Rpg_Mixer] Fallback DLS soundfont loaded successfully."
                );
              } catch (fallbackError) {
                throw new Error(
                  `Primary SoundFont failed AND Windows fallback DLS could not be loaded from ${fallbackPath}. Reason: ${fallbackError.message}`
                );
              }
            } else {
              throw new Error(
                `Primary SoundFont not found. No fallback available for non-Windows OS.`
              );
            }
          }

          if (!soundfontBuffer) {
            throw new Error("Fatal: Could not load any valid soundfont.");
          }
          this._spessa.soundfontBuffer = soundfontBuffer;

          // Create global synthesizer and add soundfont once
          this._spessa.synthesizer = new this._spessa.lib.WorkletSynthesizer(
            audioContext
          );
          this._spessa.synthesizer.setMasterParameter("masterGain", 1.5);

          const effectsInput = EffectsManager.getInputNode();
          if (effectsInput) {
            this._spessa.synthesizer.connect(effectsInput);
          }

          await this._spessa.synthesizer.soundBankManager.addSoundBank(
            soundfontBuffer,
            "default"
          );
          console.log(
            "[Rpg_Mixer] Global synthesizer created and soundfont added."
          );

          this._state.spessasynth = "ready";
          console.log("[Rpg_Mixer] SpessaSynth engine is ready.");
          resolve(this._spessa.lib);
        } catch (error) {
          this._state.spessasynth = "failed";
          console.error(
            "[Rpg_Mixer] FAILED to initialize SpessaSynth engine.",
            error
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
            "[Rpg_Mixer] WebAudio context not available for worklet loading."
          );
        }

        WebAudio._context.audioWorklet
          .addModule(workletPath)
          .then(() => {
            console.log(
              `[Rpg_Mixer] Backend 'libopenmpt' is ready. Using: Worklet`
            );
            this._state.libopenmpt = "ready";
            resolve();
          })
          .catch((error) => {
            console.error(
              `[Rpg_Mixer] FAILED to load worklet from ${workletPath}.`,
              error
            );
            this._state.libopenmpt = "failed";
            reject(
              "[Rpg_Mixer] FAILED to load backend script for 'libopenmpt'."
            );
          });
      });
    },
  };
