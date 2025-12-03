  //=============================================================================
  // AudioManager Integration with BGM/ME Queue
  //=============================================================================
  AudioManager._savedBgm = null;
  AudioManager._savedBgs = null;
  AudioManager._isPlayingMe = false;

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

  // Override playMe to handle BGM pause/resume for ALL formats
  const _AudioManager_playMe = AudioManager.playMe;
  AudioManager.playMe = function (me) {
    console.log("[Rpg_Mixer] playMe called:", me.name);
    this.stopMe();
    if (me.name) {
      // ALWAYS pause BGM when ME starts (regardless of format)
      if (this._bgmBuffer && this._currentBgm) {
        console.log(
          "[Rpg_Mixer] Pausing BGM:",
          this._currentBgm.name,
          "Type:",
          this._bgmBuffer.constructor.name
        );

        // For ExternalAudio (MIDI/MOD), use seek() method
        if (this._bgmBuffer instanceof ExternalAudio) {
          this._currentBgm.pos = this._bgmBuffer.seek();
          console.log(
            "[Rpg_Mixer] BGM ExternalAudio position saved:",
            this._currentBgm.pos
          );
        }
        // For native WebAudio, use seek() method too
        else if (this._bgmBuffer.seek) {
          this._currentBgm.pos = this._bgmBuffer.seek();
          console.log(
            "[Rpg_Mixer] BGM native position saved:",
            this._currentBgm.pos
          );
        }
        // Stop the BGM
        this._bgmBuffer.stop();
        console.log("[Rpg_Mixer] BGM stopped");
      }

      this._isPlayingMe = true;
      this._meBuffer = this.createBuffer("me", me.name);
      console.log(
        "[Rpg_Mixer] ME buffer created, Type:",
        this._meBuffer.constructor.name
      );

      this.updateMeParameters(me);
      this._meBuffer.play(false);

      // Add stop listener to resume BGM after ME ends
      console.log("[Rpg_Mixer] Adding stop listener to ME buffer");
      this._meBuffer.addStopListener(() => {
        console.log("[Rpg_Mixer] ME stop listener triggered");
        this._handleMeEnd();
      });
    }
  };

  // New method to handle ME end and BGM resume
  AudioManager._handleMeEnd = function () {
    console.log("[Rpg_Mixer] _handleMeEnd called");
    if (this._meBuffer) {
      this._meBuffer = null;
      this._isPlayingMe = false;
      console.log("[Rpg_Mixer] ME cleared, _isPlayingMe set to false");

      // Resume BGM if it was playing before ME
      if (this._currentBgm && this._currentBgm.name) {
        console.log(
          "[Rpg_Mixer] Attempting to resume BGM:",
          this._currentBgm.name,
          "from pos:",
          this._currentBgm.pos
        );

        // For ExternalAudio formats
        if (!this._bgmBuffer || !this._bgmBuffer.isPlaying()) {
          this._bgmBuffer = this.createBuffer("bgm", this._currentBgm.name);
          console.log(
            "[Rpg_Mixer] BGM buffer recreated, Type:",
            this._bgmBuffer.constructor.name
          );

          this.updateBgmParameters(this._currentBgm);
          this._bgmBuffer.play(true, this._currentBgm.pos || 0);
          this._bgmBuffer.fadeIn(this._replayFadeTime);
          console.log("[Rpg_Mixer] BGM resumed successfully");
        }
      } else {
        console.log("[Rpg_Mixer] No BGM to resume");
      }
    }
  };

  // Override stopMe to clear ME flag
  const _AudioManager_stopMe = AudioManager.stopMe;
  AudioManager.stopMe = function () {
    if (this._meBuffer) {
      this._meBuffer.stop();
      this._meBuffer = null;
      this._isPlayingMe = false;

      // Resume BGM after manual stop
      if (
        this._currentBgm &&
        this._currentBgm.name &&
        this._bgmBuffer &&
        !this._bgmBuffer.isPlaying()
      ) {
        this._bgmBuffer.play(true, this._currentBgm.pos || 0);
        this._bgmBuffer.fadeIn(this._replayFadeTime);
      }
    }
  };

  // Save BGM with proper position tracking
  const _AudioManager_saveBgm = AudioManager.saveBgm;
  AudioManager.saveBgm = function () {
    const savedBgm = _AudioManager_saveBgm.call(this);
    if (
      savedBgm &&
      this._bgmBuffer &&
      this._bgmBuffer instanceof ExternalAudio
    ) {
      savedBgm.pos = this._bgmBuffer.seek();
    }
    return savedBgm;
  };

  const _AudioManager_saveBgs = AudioManager.saveBgs;
  AudioManager.saveBgs = function () {
    const savedBgs = _AudioManager_saveBgs.call(this);
    if (
      savedBgs &&
      this._bgsBuffer &&
      this._bgsBuffer instanceof ExternalAudio
    ) {
      savedBgs.pos = this._bgsBuffer.seek();
    }
    return savedBgs;
  };

  // Debug info updates
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
