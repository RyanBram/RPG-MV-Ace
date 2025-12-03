  //=============================================================================
  // SpessasynthPlayer - MIDI playback via spessasynth
  //=============================================================================
  function SpessasynthPlayer() {
    this._gainNode = null;
    this._pannerNode = null;
    this._sequencer = null;
    this._isPlaying = false;
    this._loop = false;
    this._volume = 1;
    this._pitch = 1;
    this._pan = 0;
    this._onStopCallback = null;
    this._decodeTime = undefined;
  }

  SpessasynthPlayer.prototype.play = function (buffer, loop, offset, volume, context, onStop) {
    this._loop = loop;
    this._volume = volume;
    this._onStopCallback = onStop;

    const SpessaLib = BackendManager._spessa.lib;
    const synthesizer = BackendManager._spessa.synthesizer;

    if (!SpessaLib || !synthesizer) {
      console.error("[Rpg_Mixer] SpessaSynth synthesizer not ready.");
      return;
    }

    this._gainNode = context.createGain();
    this._gainNode.gain.value = this._volume;

    const effectsOutput = EffectsManager.getOutputNode();
    if (effectsOutput) {
      effectsOutput.disconnect();
      effectsOutput.connect(this._gainNode);
    } else {
      synthesizer.disconnect();
      synthesizer.connect(this._gainNode);
    }
    this._gainNode.connect(WebAudio._masterGainNode || context.destination);

    this._sequencer = new SpessaLib.Sequencer(synthesizer);

    const startTime = performance.now();
    this._sequencer.loadNewSongList([{ binary: buffer }]);
    this._decodeTime = performance.now() - startTime;
    this._sequencer.loopCount = this._loop ? Infinity : 0;
    this._sequencer.currentTime = offset || 0;
    this._sequencer.play();

    // Add end listener for ME handling
    this._sequencer.eventHandler.addEvent(
      "songEnded",
      "midi-end-listener",
      () => {
        console.log("[Rpg_Mixer] MIDI song ended, loop:", this._loop);
        if (!this._loop) {
          this._isPlaying = false;
          if (this._onStopCallback) {
            this._onStopCallback();
          }
        }
      }
    );

    this._isPlaying = true;
  };

  SpessasynthPlayer.prototype.stop = function () {
    if (this._sequencer) {
      this._sequencer.eventHandler.removeEvent(
        "songEnded",
        "midi-end-listener"
      );
      this._sequencer.pause();
      this._sequencer = null;
    }
    if (this._gainNode) {
      const effectsOutput = EffectsManager.getOutputNode();
      if (effectsOutput) {
        effectsOutput.disconnect();
      }
      this._gainNode.disconnect();
      this._gainNode = null;
    }
    this._isPlaying = false;
  };

  SpessasynthPlayer.prototype.seek = function () {
    if (this._sequencer) {
      return this._sequencer.currentTime || 0;
    }
    return 0;
  };

  SpessasynthPlayer.prototype.isPlaying = function () {
    return this._isPlaying;
  };

  SpessasynthPlayer.prototype.setVolume = function (value, context) {
    this._volume = value;
    if (this._gainNode && context) {
      this._gainNode.gain.setValueAtTime(this._volume, context.currentTime);
    }
  };

  SpessasynthPlayer.prototype.fadeIn = function (duration, volume, context) {
    if (!this._gainNode || !context) return;

    const currentTime = context.currentTime;
    const gain = this._gainNode.gain;

    gain.cancelScheduledValues(currentTime);
    gain.setValueAtTime(0, currentTime);
    gain.linearRampToValueAtTime(volume, currentTime + duration);
  };

  SpessasynthPlayer.prototype.fadeOut = function (duration, context, onComplete) {
    if (!this._gainNode || !context) return;

    const currentTime = context.currentTime;
    const gain = this._gainNode.gain;

    gain.cancelScheduledValues(currentTime);
    gain.setValueAtTime(gain.value, currentTime);
    gain.linearRampToValueAtTime(0.0001, currentTime + duration);

    if (onComplete) {
      setTimeout(onComplete, duration * 1000);
    }
  };

  SpessasynthPlayer.prototype.getDecodeTime = function () {
    return this._decodeTime;
  };

  SpessasynthPlayer.prototype.getGainNode = function () {
    return this._gainNode;
  };

  SpessasynthPlayer.prototype.setPitch = function (value, context) {
    this._pitch = value;
    // MIDI pitch change requires restarting the sequencer
    // This is complex and may cause audio glitches
    // For now, we'll just store the value
    // Full implementation would need to restart playback
    console.log("[Rpg_Mixer] SpessasynthPlayer: pitch change not yet fully supported for MIDI");
  };

  SpessasynthPlayer.prototype.setPan = function (value, context) {
    this._pan = value;
    if (!this._pannerNode && context) {
      // Create panner node if it doesn't exist
      this._pannerNode = context.createPanner();
      this._pannerNode.panningModel = "equalpower";
      
      // Reconnect audio graph
      if (this._gainNode) {
        this._gainNode.disconnect();
        this._gainNode.connect(this._pannerNode);
        this._pannerNode.connect(WebAudio._masterGainNode || context.destination);
      }
    }
    
    if (this._pannerNode) {
      var x = this._pan;
      var z = 1 - Math.abs(x);
      this._pannerNode.setPosition(x, 0, z);
    }
  };
