# RPG Maker MV CoreScript Archive

## Overview

This archive contains a collection of RPG Maker MV CoreScripts that have been progressively ported across multiple versions of the Pixi.js rendering library. The archive tracks the evolution and compatibility of the CoreScript as it has been updated to leverage newer Pixi versions.

## Pixi Version Coverage

The archive includes pre-built CoreScript versions ported to the following Pixi versions:

-   **Pixi v4** — Original RPG Maker MV release
-   **Pixi v5** — Performance and stability improvements
-   **Pixi v7** — Modern web rendering standards (Ace / v2.0)
-   **Pixi v8** — WebGPU and next-generation rendering

_Note: Pixi v6 is not included in this archive._

## Architecture & Plugin Compatibility

A key strength of the RPG Maker MV CoreScript is its robust abstraction layer, designed by **Yoji Ojima**. This elegant abstraction ensures that:

1. **Isolated Changes**: Pixi version upgrades are isolated to the `rpg_core.js` module, which serves as an abstraction layer between the game engine and the rendering library.
2. **Plugin Compatibility**: The plugin ecosystem remains protected from major breaking changes. Plugins written for RPG Maker MV can continue to function across different Pixi versions without modification, as long as they do not directly depend on Pixi internals.
3. **Forward Compatibility**: New versions of the CoreScript can adopt modern Pixi features while maintaining the same public API for game logic, managers, scenes, and sprites.

This design philosophy has enabled a smooth transition from Pixi v4 through v5 to v7, while preserving the integrity of thousands of community plugins.

## Performance Expectations

**Important note**: Upgrading to a newer Pixi version does **not** automatically result in improved game performance. Instead:

-   Pixi version upgrades provide **foundational improvements** to rendering efficiency, WebGL stability, and browser compatibility.
-   To realize actual performance gains, the CoreScript architecture must be adjusted to fully leverage Pixi's capabilities — for example, optimizing texture batching, render state management, or utilizing new rendering features.
-   A well-tuned RPG Maker MV game running on Pixi v7 will outperform one on Pixi v5, but this requires intentional optimization work beyond a simple library swap.

Developers are encouraged to:

-   Profile their games to identify bottlenecks.
-   Test across multiple devices and Pixi versions.
-   Apply targeted optimizations to leverage the strengths of each Pixi version.

## Using This Archive

Each CoreScript version in this archive is **pre-built and ready to use**. No compilation is required. To integrate a specific version:

1. Extract the CoreScript files from the desired Pixi version folder.
2. Copy them directly to your RPG Maker MV project's `js/` directory.
3. Test the CoreScript in a staging environment with your project and plugins.
4. Monitor performance metrics to assess the impact of the Pixi version.

---

**Last updated:** December 2025
