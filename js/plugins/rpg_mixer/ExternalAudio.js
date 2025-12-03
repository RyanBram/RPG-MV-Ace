  //=============================================================================
  // ExternalAudio - Format-agnostic audio playback class
  //=============================================================================
  function ExternalAudio() {
    this.initialize.apply(this, arguments);
  }

  ExternalAudio.prototype.initialize = function (url, format) {
    this._url = url;
    this._format = format;
    this._buffer = null;
    this._volume = 1;
    this._pitch = 1;
    this._pan = 0;
    this._loop = false;
    this._isLoading = false;
    this._onLoadListeners = [];
    this._context = WebAudio._context;
    this._load();
    this._loadTime = undefined;
    this._stopListeners = [];
    this._isPlaying = false;
    this._player = null; // Will hold SpessasynthPlayer or OpenmptPlayer
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
        // Create appropriate player based on format
        if (this._format === "midi") {
          if (!this._player) {
            this._player = new SpessasynthPlayer();
          }
        } else if (this._format === "mod") {
          if (!this._player) {
            this._player = new OpenmptPlayer();
          }
        }

        if (this._player) {
          this._player.play(
            this._buffer,
            loop,
            offset,
            this._volume,
            this._context,
            () => this._callStopListeners()
          );
          this._isPlaying = true;
          console.log(
            "[Rpg_Mixer] ExternalAudio play started, format:",
            this._format,
            "loop:",
            loop
          );
          this._reportDebugInfo();
        }
      })
      .catch((error) => {
        console.error(
          `[Rpg_Mixer] Backend '${backendName}' failed to load.`,
          error
        );
      });
  };

  ExternalAudio.prototype.isReady = function () {
    return !!this._buffer;
  };

  ExternalAudio.prototype.isPlaying = function () {
    return this._isPlaying;
  };

  ExternalAudio.prototype.addLoadListener = function (listener) {
    this._onLoadListeners.push(listener);
  };

  ExternalAudio.prototype.addStopListener = function (listener) {
    this._stopListeners.push(listener);
  };

  ExternalAudio.prototype._callStopListeners = function () {
    while (this._stopListeners && this._stopListeners.length > 0) {
      var listener = this._stopListeners.shift();
      try {
        listener();
      } catch (e) {
        console.error("[Rpg_Mixer] stop listener error:", e);
      }
    }
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

    const decodeTime = this._player ? this._player.getDecodeTime() : undefined;

    DebugManager.updateInfo({
      fileName: decodeURIComponent(fileName),
      backend: backendName,
      playbackMode: mode,
      loadTime: this._loadTime,
      decodeTime: decodeTime,
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

  ExternalAudio.prototype.fadeOut = function (duration) {
    if (!this._player) return;
    this._player.fadeOut(duration, this._context, () => this.stop());
  };

  ExternalAudio.prototype.fadeIn = function (duration) {
    if (!this._player) return;
    this._player.fadeIn(duration, this._volume, this._context);
  };

  ExternalAudio.prototype.updateParameters = function (config) {
    if (config.volume !== undefined) {
      this.volume = config.volume / 100;
    }
  };

  ExternalAudio.prototype.stop = function () {
    console.log(
      "[Rpg_Mixer] ExternalAudio.stop() called, format:",
      this._format,
      "_isPlaying:",
      this._isPlaying
    );

    const wasPlaying = this._isPlaying;

    if (this._player) {
      this._player.stop();
    }
    this._isPlaying = false;

    // Only trigger stop listeners if we were actually playing before stop
    if (wasPlaying) {
      console.log("[Rpg_Mixer] Calling stop listeners because wasPlaying=true");
      this._callStopListeners();
    } else {
      console.log(
        "[Rpg_Mixer] NOT calling stop listeners because wasPlaying=false"
      );
    }
  };

  ExternalAudio.prototype.clear = function () {
    this.stop();
    this._player = null;
    this._buffer = null;
    this._volume = 1;
    this._pitch = 1;
    this._pan = 0;
    this._onLoadListeners = [];
    this._stopListeners = [];
    this._isPlaying = false;
    this._loadTime = undefined;
  };

  ExternalAudio.prototype.isError = function () {
    return false;
  };

  ExternalAudio.prototype.seek = function () {
    if (this._player) {
      return this._player.seek();
    }
    return 0;
  };

  Object.defineProperty(ExternalAudio.prototype, "url", {
    get: function () {
      return this._url;
    },
    configurable: true,
  });

  Object.defineProperty(ExternalAudio.prototype, "volume", {
    get: function () {
      return this._volume;
    },
    set: function (value) {
      this._volume = value;
      if (this._player) {
        this._player.setVolume(value, this._context);
      }
    },
    configurable: true,
  });

  Object.defineProperty(ExternalAudio.prototype, "pitch", {
    get: function () {
      return this._pitch;
    },
    set: function (value) {
      this._pitch = value;
      if (this._player) {
        this._player.setPitch(value, this._context);
      }
    },
    configurable: true,
  });

  Object.defineProperty(ExternalAudio.prototype, "pan", {
    get: function () {
      return this._pan;
    },
    set: function (value) {
      this._pan = value;
      if (this._player) {
        this._player.setPan(value, this._context);
      }
    },
    configurable: true,
  });
