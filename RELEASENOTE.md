# RPGMakerMV corescript "Community-2.0 (Pixi v7)" Release Notes

This release marks the "Ace" (v2.0) milestone — a modernisation and preservation release celebrating the 10-year legacy of RPG Maker MV. The primary achievement for this release is a successful migration from earlier Pixi versions to Pixi v7 (2025), together with several platform, audio, and internationalisation improvements.

Highlights

-   Pixi v7 (2025): Upgraded rendering core to Pixi v7 to align with modern web rendering APIs and performance improvements.
-   Fluid Aspect Ratio: New layout system that adapts UI and rendering to the current window aspect ratio to produce consistent layouts across devices and resolutions.
-   Multi-format audio: Reintroduced MIDI support (standard RPG Maker audio format) using the spessasynth_lib backend. Added tracker music playback (MOD, S3M, XM, IT, MPTM, MO3) via libopenmpt for richer legacy music support.
-   Multi-language (i18n): Added `rpg_locale` plugin plus a local translator helper for fast, offline rough translations — ideal for development and testing without internet access.
-   Web HTML Player: Added a web player build target that provides player-like playback controls and distribution options, giving creators a web-first way to publish and control game playback.

Planned next steps

-   Multi-genre templates and building blocks for platformers, bullet-hell, visual novels, SRPG and ARPG.
-   Porting to Pixi v8 with WebGPU support once the ecosystem stabilizes.

This document includes earlier release notes below for historical context.

## Overview (v2.0 / Ace)

Version 2.0 (Ace) modernises the CoreScript with a migration to Pixi v7 (2025) and introduces a set of platform, audio, layout, and internationalisation improvements while preserving backwards compatibility for existing projects.

This section summarises the practical changes, features, and recommended testing notes for the Ace release.

## What's new

-   Pixi v7 (2025): The rendering core is upgraded to Pixi v7 to benefit from current web-rendering APIs, improved renderer performance and better long-term compatibility with modern browsers.
-   Fluid Aspect Ratio: A new layout approach that adapts UI and render scaling to the window aspect ratio so games display consistently across window sizes and device screens.
-   Multi-format audio: Restored MIDI support (standard RPG Maker format) via the spessasynth_lib backend and added tracker module playback (MOD, S3M, XM, IT, MPTM, MO3) through libopenmpt for legacy tracker formats.
-   Internationalisation (i18n): Built-in support via the `rpg_locale` plugin and a local translator helper that enables quick, offline rough translations for development and QA.
-   Web HTML Player: A new web player build target that exposes player-like controls and distribution-friendly features to make web publishing and playback control easier.

## Features & improvements

-   Rendering: updated rendering pipelines and asset handling to make use of Pixi v7 improvements.
-   Layout: fluid aspect ratio handling and hardened layout calculations to reduce misalignment on non-standard displays.
-   Audio: pluggable audio backends with MIDI and tracker format support plus improved fallback handling for browsers without native support.
-   Input: improved touch gesture handling (drag-to-scroll, refined tap thresholds) and better touch-optimized UI hit targets.
-   Memory & loading: improved image preloading and memory helpers to reduce stalls and load-time regressions on constrained devices.

## Technical changes

-   Migrated Pixi integration and adjusted rendering codepaths to match Pixi v7 APIs and lifecycle.
-   Added audio backends: spessasynth_lib for MIDI and libopenmpt for tracker formats, with configuration hooks for developers.
-   Implemented fluid aspect ratio utilities and new layout helpers used by core UI classes.
-   Introduced `rpg_locale` plugin and a translator helper script for offline development translations.
-   Added a web player build target and wiring for optional web-only controls.

## Fixes and compatibility notes

-   Fixed: window masking, title/background scaling, and battler positioning to better respect varying aspect ratios.
-   Fixed: several touch and input edge-cases introduced by arbitrary window resizing.
-   Compatibility: Ace aims to minimise breaking changes; however plugin authors should test plugin behaviour in a staging environment. See the upgrade checklist (TODO) for common plugin compatibility checks.

---

Notes: This release focuses on modernising the rendering and platform experience (Pixi v7) while expanding audio and i18n support. When testing, verify rendering, input, audio playback (MIDI and tracker samples), and layout on multiple devices and aspect ratios.
