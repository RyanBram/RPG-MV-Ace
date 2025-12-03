  //=============================================================================
  // WebAudio Compatibility Shim - Add stopListener support to native WebAudio
  //=============================================================================
  const _WebAudio_initialize = WebAudio.prototype.initialize;
  WebAudio.prototype.initialize = function (url) {
    _WebAudio_initialize.call(this, url);
    if (!this._stopListeners) {
      this._stopListeners = [];
    }
  };

  // Add addStopListener to native WebAudio if not exists
  if (!WebAudio.prototype.addStopListener) {
    WebAudio.prototype.addStopListener = function (listner) {
      if (!this._stopListeners) {
        this._stopListeners = [];
      }
      this._stopListeners.push(listner);
    };
  }

  // Hook into WebAudio.stop to call stop listeners
  const _WebAudio_stop = WebAudio.prototype.stop;
  WebAudio.prototype.stop = function () {
    _WebAudio_stop.call(this);
    if (this._stopListeners) {
      while (this._stopListeners.length > 0) {
        var listner = this._stopListeners.shift();
        try {
          listner();
        } catch (e) {
          console.error("[Rpg_Mixer] WebAudio stop listener error:", e);
        }
      }
    }
  };

  // Hook into WebAudio._onEnded to call stop listeners when audio ends naturally
  const _WebAudio_onEnded = WebAudio.prototype._onEnded;
  WebAudio.prototype._onEnded = function () {
    _WebAudio_onEnded.call(this);
    // Call stop listeners when audio ends naturally (for ME)
    if (this._stopListeners && !this._loop) {
      while (this._stopListeners.length > 0) {
        var listner = this._stopListeners.shift();
        try {
          listner();
        } catch (e) {
          console.error("[Rpg_Mixer] WebAudio onEnded listener error:", e);
        }
      }
    }
  };
