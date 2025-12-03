  // ============================================
  // Debug Manager - F2 overlay
  // ============================================

  const DebugManager = {
    debugDiv: null,
    debugMode: 0,
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
        if (event.keyCode === 113) {
          event.preventDefault();
          this.cycleMode();
        }
      });
    },

    cycleMode: function () {
      this.debugMode = (this.debugMode + 1) % 3;

      if (this.debugDiv) {
        this.debugDiv.style.display = this.debugMode > 0 ? "block" : "none";
      }

      if (this.debugMode > 0) {
        this.updateInfo(this.lastAudioInfo);
      }
    },

    show: function () {
      if (!this.isInitialized) {
        this.initialize();
      }
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
