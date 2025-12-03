  //=============================================================================
  // OpenmptPlayer - MOD playback via libopenmpt
  //=============================================================================
  function OpenmptPlayer() {
    this._gainNode = null;
    this._pannerNode = null;
    this._workletNode = null;
    this._currentPosition = 0;
    this._isPlaying = false;
    this._loop = false;
    this._volume = 1;
    this._pitch = 1;
    this._pan = 0;
    this._onStopCallback = null;
    this._decodeTime = undefined;
    this._context = null;
  }

  OpenmptPlayer.prototype.play = function (buffer, loop, offset, volume, context, onStop) {
    this._loop = loop;
    this._volume = volume;
    this._onStopCallback = onStop;
    this._context = context;

    const pos = offset || 0;
    this._currentPosition = pos;

    const startTime = performance.now();
    this._workletNode = new AudioWorkletNode(
      context,
      "libopenmpt-processor",
      {
        numberOfInputs: 0,
        numberOfOutputs: 1,
        outputChannelCount: [2],
      }
    );

    this._workletNode.port.onmessage = (msg) => {
      if (!this._workletNode || !this._workletNode.port) return;
      const data = msg.data;
      if (data.cmd === "pos") {
        this._currentPosition = data.pos;
      } else if (data.cmd === "meta" && pos > 0) {
        this._workletNode.port.postMessage({ cmd: "setPos", val: pos });
      } else if (data.cmd === "end") {
        console.log("[Rpg_Mixer] MOD song ended, loop:", this._loop);
        this._isPlaying = false;
        if (this._onStopCallback) {
          this._onStopCallback();
        }
        if (this._loop) {
          // For looping, restart playback
          this.stop();
          this.play(buffer, loop, 0, volume, context, onStop);
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
    this._workletNode.port.postMessage({ cmd: "play", val: buffer });
    this._decodeTime = performance.now() - startTime;

    this._setupAudioNodes(context);
    this._workletNode.disconnect();
    this._workletNode.connect(this._gainNode);

    this._isPlaying = true;
  };

  OpenmptPlayer.prototype.stop = function () {
    if (this._workletNode) {
      this._workletNode.port.postMessage({ cmd: "stop" });
      this._workletNode.disconnect();
      this._workletNode = null;
    }
    if (this._gainNode) {
      this._gainNode.disconnect();
      this._gainNode = null;
    }
    this._isPlaying = false;
  };

  OpenmptPlayer.prototype.seek = function () {
    return this._currentPosition || 0;
  };

  OpenmptPlayer.prototype.isPlaying = function () {
    return this._isPlaying;
  };

  OpenmptPlayer.prototype.setVolume = function (value, context) {
    this._volume = value;
    if (this._gainNode && context) {
      this._gainNode.gain.setValueAtTime(this._volume, context.currentTime);
    }
  };

  OpenmptPlayer.prototype.fadeIn = function (duration, volume, context) {
    if (!this._gainNode || !context) return;

    const currentTime = context.currentTime;
    const gain = this._gainNode.gain;

    gain.cancelScheduledValues(currentTime);
    gain.setValueAtTime(0, currentTime);
    gain.linearRampToValueAtTime(volume, currentTime + duration);
  };

  OpenmptPlayer.prototype.fadeOut = function (duration, context, onComplete) {
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

  OpenmptPlayer.prototype.getDecodeTime = function () {
    return this._decodeTime;
  };

  OpenmptPlayer.prototype.getGainNode = function () {
    return this._gainNode;
  };

  OpenmptPlayer.prototype._setupAudioNodes = function (context) {
    if (!this._gainNode) {
      this._gainNode = context.createGain();
      this._gainNode.disconnect();
      
      if (this._pannerNode) {
        this._gainNode.connect(this._pannerNode);
        this._pannerNode.connect(WebAudio._masterGainNode);
      } else {
        this._gainNode.connect(WebAudio._masterGainNode);
      }
    }
    this._gainNode.gain.value = this._volume;
  };

  OpenmptPlayer.prototype.setPitch = function (value, context) {
    this._pitch = value;
    // MOD pitch change requires restarting the playback
    // This is complex and may cause audio glitches
    // For now, we'll just store the value
    console.log("[Rpg_Mixer] OpenmptPlayer: pitch change not yet fully supported for MOD");
  };

  OpenmptPlayer.prototype.setPan = function (value, context) {
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
