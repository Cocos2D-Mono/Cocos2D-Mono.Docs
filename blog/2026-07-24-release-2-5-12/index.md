---
slug: 2.5.12-release
title: Cocos2D-Mono 2.5.12 is now out!
authors: [brandmooffin]
tags: [update, release, 2.5.12]
---

![Release Logo](./logo-full-release.png)

Cocos2D-Mono **2.5.12** is here — a drop-in bug-fix release that closes out the 2.5 line. No new APIs, no breaking changes, no migration: bump your package reference and you're done. The [release notes](https://github.com/Cocos2D-Mono/cocos2d-mono/releases/tag/2.5.12) have the full rundown.

And yes — with MonoGame 3.8.5 now out, work on the **2.6.0** line has officially started. More on that below.

<!-- truncate -->

## What's Fixed

- **Instant action copies** — `CCFlipX`, `CCFlipY`, and `CCPlace` now preserve their state when copied via `Copy()` (copies previously lost their flip/position values).
- **`CCCallFuncN.InitWithTarget`** now returns `true` on success, matching `CCCallFuncO`.
- **`CCMenuItemSprite`** — setting `NormalImage` / `SelectedImage` / `DisabledImage` to `null` now clears the image instead of throwing a `NullReferenceException`.
- **`CCTextFieldTTF`** — auto-edit touch input re-registers correctly after toggling `ReadOnly` / `AutoEdit`, so a field returned to editable is touch-interactive again.
- **`CCRawList<T>.RemoveRange`** — removing a middle range near the end of the list no longer corrupts it (previously the element shift was skipped and surviving elements zeroed — visible as vertex corruption when removing draw-node segments). Pooled-buffer rent/return handling was also reworked, fixing a tail-clear buffer leak.

## Under the Hood

The internal modernization that started in 2.5.11 is now complete: every private field in the library uses modern C# naming, landed across a dozen small, individually-reviewed changes with no public API impact. Just as importantly, **every fix above ships with regression tests** — the unit suite now stands at 132 tests, with builds verified across DesktopGL, WindowsDX, Android, and iOS.

**Full Changelog**: https://github.com/Cocos2D-Mono/cocos2d-mono/compare/2.5.11...2.5.12

## NuGet Packages

- **Cocos2D-Mono** (Windows, Linux, macOS, Android, iOS): [Cocos2D-Mono](https://www.nuget.org/packages/Cocos2D-Mono/)

- **Cocos2D-Mono.Core** — same engine, no content-pipeline dependency: [Cocos2D-Mono.Core](https://www.nuget.org/packages/Cocos2D-Mono.Core/)

- **Cocos2D-Mono.Box2D** — the Box2D physics port: [Cocos2D-Mono.Box2D](https://www.nuget.org/packages/Cocos2D-Mono.Box2D/)

The samples and Visual Studio project templates stay on 2.5.11 for this one — they'll move directly to 2.6.0.

## What's Next: 2.6.0

When 2.5.11 shipped, we said the 2.6.0 line would land *"once MonoGame 3.8.5 is stable."* **MonoGame 3.8.5 is out** — a huge release on their side, with a new native core, Vulkan and Direct3D 12 backends in preview, and ARM64 support — and the 2.6.0 bring-up (MonoGame 3.8.5 + .NET 10) is now underway. Early compatibility testing is already looking clean, and thanks to the 2.5.11 build consolidation, the retarget is a fraction of the work it would have been a year ago.

Alongside that, the [roadmap](https://github.com/Cocos2D-Mono/cocos2d-mono/blob/master/ROADMAP.md) work continues — including **console support, starting with PlayStation 5**, still in active development.

2.5.12 is the clean checkpoint: every known bug fixed, fully tested, ready to build on. Thanks, as always, for being part of it — and stay tuned, because 2.6.0 is going to be a fun one!
