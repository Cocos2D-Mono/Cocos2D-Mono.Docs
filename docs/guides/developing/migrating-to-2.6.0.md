---
sidebar_position: 4
---

# Migrating to 2.6.0

2.6.0 is the **platform-line release**: the engine moves to **.NET 10 and MonoGame 3.8.5**. The runtime API is unchanged — scenes, nodes, actions, and every public type behave exactly as they did on 2.5.12 — so the migration is your project file, not your code.

## The one-step migration

Retarget your game project to .NET 10 and bump the package reference:

```diff
- <TargetFramework>net9.0</TargetFramework>
+ <TargetFramework>net10.0</TargetFramework>

- <PackageReference Include="Cocos2D-Mono" Version="2.5.12" />
+ <PackageReference Include="Cocos2D-Mono" Version="2.6.0" />
```

The target framework per platform:

| Platform | New TFM |
|---|---|
| Desktop (DesktopGL — Windows, Linux, macOS) | `net10.0` |
| WindowsDX | `net10.0-windows` |
| Android | `net10.0-android` |
| iOS | `net10.0-ios` |

The MonoGame 3.8.5 upgrade rides along transparently through the package reference — no code changes.

:::info iOS platform versions jumped

If you pin an explicit iOS platform version in your TFM, note that Apple's version numbering jumped: the .NET 10 iOS workload ships **26.x** bindings, so an explicit pin is `net10.0-ios26.0` (not `ios18.x`). Android's explicit pin is `net10.0-android36.0`. The unversioned TFMs above pick the right defaults automatically.

:::

## Prerequisites

- The **.NET 10 SDK** is required to build.
- Mobile targets need the .NET 10 `android`/`ios` workloads — included with Visual Studio's mobile development workloads, or installed from the CLI with `dotnet workload install android ios`.

## What changed underneath

- **MonoGame 3.8.4.1 → 3.8.5** — MonoGame's major restructuring release (a new native core, ARM64 support, and Vulkan/Direct3D 12 backends in preview). Cocos2D-Mono continues to ship on the proven DesktopGL and WindowsDX backends; the preview backends are not consumed yet.
- **.NET 9 → .NET 10** — .NET 9 is a standard-term-support release past its support window; 2.6.0 puts the engine on the current LTS.
- The engine migrated off APIs MonoGame has marked obsolete, with identical behavior — your code is unaffected.

The full stack was validated end-to-end before release: all targets compile clean, the unit suite passes, and the interactive test app was run scene-by-scene on both desktop backends.

## Coming from earlier than 2.5.12?

Apply the migrations in order: the [2.5.11 guide](./migrating-to-2.5.11.md) covers the move from the per-platform packages to the consolidated ones (that's the big one), then 2.5.12 and this release are drop-in steps from there.
