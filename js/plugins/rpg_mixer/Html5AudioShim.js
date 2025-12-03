  //=============================================================================
  // Html5Audio Compatibility Shim - Add stopListener support
  //=============================================================================
  
  // Add stopListener support to Html5Audio
  if (typeof Html5Audio !== "undefined") {
    Html5Audio._stopListeners = [];

    const _Html5Audio_addStopListener = Html5Audio.addStopListener;
    Html5Audio.addStopListener = function (listner) {
      if (_Html5Audio_addStopListener) {
        _Html5Audio_addStopListener.call(this, listner);
      } else {
        if (!this._stopListeners) {
          this._stopListeners = [];
        }
        this._stopListeners.push(listner);
      }
    };
  }
