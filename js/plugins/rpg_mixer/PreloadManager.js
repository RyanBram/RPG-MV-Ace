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

    scanGameAudio: function () {
      const audioFiles = new Set();

      if ($dataSystem) {
        if ($dataSystem.titleBgm && $dataSystem.titleBgm.name) {
          audioFiles.add({ name: $dataSystem.titleBgm.name, type: "bgm" });
        }
        if ($dataSystem.battleBgm && $dataSystem.battleBgm.name) {
          audioFiles.add({ name: $dataSystem.battleBgm.name, type: "bgm" });
        }
        if ($dataSystem.victoryMe && $dataSystem.victoryMe.name) {
          audioFiles.add({ name: $dataSystem.victoryMe.name, type: "me" });
        }
        if ($dataSystem.defeatMe && $dataSystem.defeatMe.name) {
          audioFiles.add({ name: $dataSystem.defeatMe.name, type: "me" });
        }
      }

      if ($dataMapInfos) {
        for (let i = 1; i < $dataMapInfos.length; i++) {
          const mapInfo = $dataMapInfos[i];
          if (mapInfo) {
            this._scanMapData(i, audioFiles);
          }
        }
      }

      console.log("[Rpg_Mixer] Scanned audio files:", Array.from(audioFiles));
      return audioFiles;
    },

    _scanMapData: function (mapId, audioFiles) {
      const xhr = new XMLHttpRequest();
      const url = "data/Map%1.json".format(mapId.padZero(3));
      xhr.open("GET", url, false);
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
        // Ignore errors
      }
    },

    getAudioFormat: function (filename) {
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

    preloadBackends: async function (audioFiles) {
      const needsMidi = Array.from(audioFiles).some((file) => {
        const format = this.getAudioFormat(file.name);
        return format === "midi";
      });

      const needsMod = Array.from(audioFiles).some((file) => {
        const format = this.getAudioFormat(file.name);
        return format === "mod";
      });

      const promises = [];

      if (needsMidi && !this._backendsLoaded.midi) {
        console.log("[Rpg_Mixer] Preloading MIDI backend...");
        promises.push(
          BackendManager.require("spessasynth").then(() => {
            this._backendsLoaded.midi = true;
            console.log("[Rpg_Mixer] MIDI backend preloaded successfully.");
          })
        );
      }

      if (needsMod && !this._backendsLoaded.mod) {
        console.log("[Rpg_Mixer] Preloading MOD backend...");
        promises.push(
          BackendManager.require("libopenmpt").then(() => {
            this._backendsLoaded.mod = true;
            console.log("[Rpg_Mixer] MOD backend preloaded successfully.");
          })
        );
      }

      return Promise.all(promises);
    },

    initialize: async function () {
      console.log("[Rpg_Mixer] Starting preload process...");

      const audioFiles = this.scanGameAudio();
      await this.preloadBackends(audioFiles);

      console.log("[Rpg_Mixer] Preload process completed.");
    },

    isBackendReady: function (format) {
      if (format === "midi") return this._backendsLoaded.midi;
      if (format === "mod") return this._backendsLoaded.mod;
      return true;
    },
  };

  const _Scene_Boot_start = Scene_Boot.prototype.start;
  Scene_Boot.prototype.start = function () {
    _Scene_Boot_start.call(this);
    DebugManager.initialize();
  };

  const _Scene_Boot_isReady = Scene_Boot.prototype.isReady;
  Scene_Boot.prototype.isReady = function () {
    if (!this._preloadInitialized) {
      this._preloadInitialized = true;
      this._preloadComplete = false;

      PreloadManager.initialize()
        .then(() => {
          this._preloadComplete = true;
          console.log("[Rpg_Mixer] All preloading complete, game ready.");
        })
        .catch((err) => {
          console.error("[Rpg_Mixer] Preload error:", err);
          this._preloadComplete = true;
        });
    }

    return _Scene_Boot_isReady.call(this) && this._preloadComplete;
  };
