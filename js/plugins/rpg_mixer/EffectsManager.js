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
            chorusConfig
          );
          lastNode.connect(this._chorus.input);
          lastNode = this._chorus.output;
          console.log(
            "[Rpg_Mixer] Global Chorus effect enabled.",
            chorusConfig
          );
        } catch (e) {
          console.error(
            "[Rpg_Mixer] Failed to create or connect ChorusProcessor.",
            e
          );
        }
      }

      if (this._pluginParameters.enableReverb) {
        const reverbMixLevel = this._pluginParameters.reverbMix;
        console.log(
          "[Rpg_Mixer] Reverb enabled. Mix parameter from plugin:",
          reverbMixLevel
        );

        this._reverbDryGain = this._context.createGain();
        this._reverbWetGain = this._context.createGain();

        this._reverbDryGain.gain.value = 1.0 - reverbMixLevel;
        this._reverbWetGain.gain.value = reverbMixLevel;

        if (this._pluginParameters.reverbIRFile) {
          this._loadImpulseResponse().then((impulseResponse) => {
            if (impulseResponse) {
              try {
                const reverbConfig = { impulseResponse: impulseResponse };
                this._reverb = new SpessaLib.ReverbProcessor(
                  this._context,
                  reverbConfig
                );

                lastNode.connect(this._reverbDryGain);
                this._reverbDryGain.connect(this._outputNode);

                lastNode.connect(this._reverb.input);
                this._reverb.output.connect(this._reverbWetGain);
                this._reverbWetGain.connect(this._outputNode);

                console.log(
                  "[Rpg_Mixer] Global Reverb enabled with custom IR."
                );
              } catch (e) {
                console.error(
                  "[Rpg_Mixer] Failed to create ReverbProcessor with custom IR.",
                  e
                );
                lastNode.connect(this._outputNode);
              }
            } else {
              lastNode.connect(this._outputNode);
            }
          });
        } else {
          try {
            const reverbConfig = {};
            this._reverb = new SpessaLib.ReverbProcessor(
              this._context,
              reverbConfig
            );

            lastNode.connect(this._reverbDryGain);
            this._reverbDryGain.connect(this._outputNode);

            lastNode.connect(this._reverb.input);
            this._reverb.output.connect(this._reverbWetGain);
            this._reverbWetGain.connect(this._outputNode);

            console.log(
              "[Rpg_Mixer] Global Reverb enabled with default sound."
            );
          } catch (e) {
            console.error(
              "[Rpg_Mixer] Failed to create default ReverbProcessor.",
              e
            );
            lastNode.connect(this._outputNode);
          }
        }
      } else {
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
          e
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
