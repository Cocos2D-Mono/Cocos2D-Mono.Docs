---
sidebar_position: 5
title: Platform-Specific Code
---

# Platform-Specific Code: Seams First, Honest Guards Second

Cocos2d-Mono multi-targets DesktopGL (Windows/Linux/macOS), WindowsDX, Android, and iOS from one codebase, and the engine's platform story keeps growing. Two rules keep platform-specific code from rotting.

## Rule 1: Prefer a runtime seam over `#if`

Where the engine offers a pluggable seam, use it instead of conditional compilation — a seam is testable, works per-instance, and doesn't multiply build flavors. The model example is storage: rather than `#if`-ing file APIs per platform, [`CCUserDefault.Storage`](./saving-game-data#swapping-the-storage-backend) accepts any `ICCUserDefaultStorage` implementation.

The same shape applies to your own game code: put the platform difference behind an interface, select the implementation once at startup.

## Rule 2: When you do `#if`, guard on what you *mean*

State the platforms a branch is **for** — never the platforms it isn't:

```csharp
// ✅ Says what it means: this is the mobile-sensor path.
#if ANDROID || IOS
    ReadAccelerometer();
#endif

// ❌ "Everything that isn't desktop" - silently captures every FUTURE platform too.
#if !WINDOWSGL && !WINDOWS && !MACOS && !LINUX
    ReadAccelerometer();
#endif
```

The exclusion style is not hypothetical: an accelerometer guard written as "not desktop" silently mis-slotted a new platform during the engine's console bring-up — the code compiled, the intent was wrong. Every new platform an exclusion list has never heard of lands in its `else` bucket by default; an inclusion list fails safe (the new platform gets *nothing* until someone decides).

## The constants

The build defines these per target (see the per-TFM blocks in the engine csproj):

| Constant | Where |
|---|---|
| `DESKTOPGL`, `MONOGAME`, `OPENGL` | the DesktopGL build (all three desktop OSes) |
| `WINDOWSGL` / `MACOS` / `LINUX` | additionally, per desktop host OS |
| `WINDOWS`, `XNA` | the WindowsDX build |
| `ANDROID`, `GLES` | Android |
| `IOS`, `__IOS__`, `GLES` | iOS |

Guard on the smallest set that expresses your intent — usually one platform constant or one capability pair (`ANDROID || IOS`).
