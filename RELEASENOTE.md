# RPGMakerMV corescript "Community-1.5 (Pixi v5)" Release Notes

## Summary

This release upgrades the rendering core to Pixi v5 and brings a set of touch-focused improvements and UI fixes. The Pixi v5 migration delivers meaningful rendering and performance gains (especially when running with WebGL), reduces render-related CPU/GPU overhead, and improves stability across modern desktop and mobile browsers. Additionally, touch input now supports scroll gestures and the menu system has been optimized for touch devices and different display resolutions.

## Features

-   Upgraded rendering engine from Pixi v4 to Pixi v5 — improved rendering performance, better WebGL stability, and reduced overhead on supported platforms.
-   Touch Input: added touch-scroll support for scrolling windows and lists using swipe gestures.
-   Touch-optimized menus: menu layouts, hit targets, and input handling were adjusted for a smoother touch experience on phones and tablets.
-   Image preload & memory helpers: improved background image preloading and basic memory usage controls to help reduce stalls and keep memory usage within configurable limits.

## Changes

-   Migrated Pixi integration to v5 and updated rendering pipelines where required to take advantage of new Pixi APIs.
-   WebGL rendering is used more broadly when available, which results in higher frame rates and better visual fidelity on modern devices.
-   Improved touch gesture handling: drag-to-scroll is now supported, and accidental taps are reduced by refined gesture thresholds.
-   Menus and UI scale more reliably across different resolutions and aspect ratios; layout calculations were hardened to avoid misaligned elements on non-standard displays.

## Fixes

-   Window masking now works correctly.
-   Title background and battleback now scale correctly with resolution.
-   Battler positions adapt properly to aspect ratio and resolution.

--

Notes: Upgrading to Pixi v5 is the primary performance improvement in this release — if you test on mobile or low-end hardware you should notice smoother rendering and less UI jitter when WebGL is available. Please test menus and touch scrolling on multiple screen sizes and report any layout or input regressions.

## Committers

木星ペンギン, Ru たん, Ryan Bram

## How to test
