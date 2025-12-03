  // ============================================
  // Format Handlers - Map extensions to backends
  // ============================================

  const formatHandlers = {
    midi: {
      extensions: ["_mid", "_rmi"],
      backend: "spessasynth",
    },
    mod: {
      extensions: ["_mod", "_xm", "_s3m", "_it", "_mptm", "_mo3"],
      backend: "libopenmpt",
    },
  };
