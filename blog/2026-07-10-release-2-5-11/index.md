---
slug: 2.5.11-release
title: Cocos2D-Mono 2.5.11 is now out!
authors: [brandmooffin]
tags: [update, release, 2.5.11]
---

![Release Logo](./logo-full-release.png)

Cocos2D-Mono **2.5.11** is here — and it's a big one for how you *consume* the library. Go check out the [release notes](https://github.com/Cocos2D-Mono/cocos2d-mono/releases/tag/2.5.11) for the full rundown, or read on.

The headline: **twelve per-platform packages just became three.** One reference now covers every platform. There's a small migration to do, so there's a guide below to make it painless.

<!-- truncate -->

## What's Changed

- **New consolidated NuGet packages** — `Cocos2D-Mono`, `Cocos2D-Mono.Core`, and `Cocos2D-Mono.Box2D`, each multi-targeting DesktopGL (Windows/Linux/macOS), WindowsDX, Android, and iOS
- The per-platform packages (`Cocos2D-Mono.DesktopGL`, `.Windows`, `.Linux`, `.macOS`, `.Android`, `.iOS`, and their `.Core.*` variants) are retired — 2.5.10 was their final release
- Assembly renamed `Cocos2D.dll` → `Cocos2DMono.dll` (the namespace is still `Cocos2D`)
- **OpenTK is no longer a dependency** — a leaner dependency graph for everyone
- New `ICCUserDefaultStorage` / `CCUserDefault.Storage` — pluggable settings storage
- Modernized codebase under the hood: file-scoped namespaces, `_camelCase` private fields, and a much simpler build

**Full Changelog**: https://github.com/Cocos2D-Mono/cocos2d-mono/compare/2.5.10...2.5.11

## NuGet Packages

- **Cocos2D-Mono** (Windows, Linux, macOS, Android, iOS): [Cocos2D-Mono](https://www.nuget.org/packages/Cocos2D-Mono/)

- **Cocos2D-Mono.Core** — same engine, no content-pipeline dependency: [Cocos2D-Mono.Core](https://www.nuget.org/packages/Cocos2D-Mono.Core/)

- **Cocos2D-Mono.Box2D** — the Box2D physics port: [Cocos2D-Mono.Box2D](https://www.nuget.org/packages/Cocos2D-Mono.Box2D/)

[Visual Studio Project Template Extension](https://marketplace.visualstudio.com/items?itemName=Cocos2D-MonoTeamBrokenWallsStudios.cocos2dmonoprojecttemplates)

## One Library, Every Platform

For years, picking Cocos2D-Mono meant first picking a *flavor*: `Cocos2D-Mono.DesktopGL`, or `.Windows`, or `.Android`, and so on — twelve packages in all once you count the `.Core` variants. Every release meant building, packing, and publishing all twelve, and every consumer had to know which one they needed.

That's over. **`Cocos2D-Mono` is now a single package that multi-targets every platform.** Reference it once, and the right build for your project's target framework is selected automatically — DesktopGL for a cross-platform desktop game, WindowsDX on `net9.0-windows`, Android, or iOS. Same for `Cocos2D-Mono.Core` (the variant without the MonoGame content-pipeline build task) and the newly standalone `Cocos2D-Mono.Box2D`.

Under the hood this was a big cleanup: roughly thirty per-platform projects collapsed into three, package versions centralized, and the whole thing validated by a real unit-test suite and a CI matrix that builds every target on every commit. Less surface area for us to maintain means faster, safer releases for you.

## Migration Guide

Moving from a `2.5.x` per-platform package to `2.5.11` is quick. In most projects it's a **one-line change**.

### 1. Swap your package reference

Replace your per-platform package with the consolidated one:

```diff
- <PackageReference Include="Cocos2D-Mono.DesktopGL" Version="2.5.10" />
+ <PackageReference Include="Cocos2D-Mono" Version="2.5.11" />
```

The mapping is straightforward:

| If you referenced… | Use now |
|---|---|
| `Cocos2D-Mono.DesktopGL` / `.Windows` / `.Linux` / `.macOS` / `.Android` / `.iOS` | **`Cocos2D-Mono`** |
| any `Cocos2D-Mono.Core.*` | **`Cocos2D-Mono.Core`** |

The correct platform build is chosen from your project's target framework, so a cross-platform game that used to reference `Cocos2D-Mono.DesktopGL` just references `Cocos2D-Mono` and keeps working.

### 2. Your code doesn't change

The namespace is still **`Cocos2D`** — every `using Cocos2D;` and every type stays exactly the same. No source edits.

### 3. Two things to double-check

- **Assembly name.** The DLL is now `Cocos2DMono.dll` (it was `Cocos2D.dll`). This is invisible to normal code and NuGet references, but if you load the assembly by name — a by-name `<Reference>`, `Assembly.Load("Cocos2D")`, or reflection keyed on the assembly name — update it to `Cocos2DMono`.
- **OpenTK.** It's no longer pulled in transitively (it was referenced but unused). If your own code happened to rely on that transitive reference, add an explicit `OpenTK` package reference of your own.

That's it. For the vast majority of projects, step 1 is the whole migration.

## What's Next

The `2.6.0` line continues the move to **.NET 10 and MonoGame 3.8.5**, landing once MonoGame 3.8.5 is stable. And as noted on the [roadmap](https://github.com/Cocos2D-Mono/cocos2d-mono/blob/master/ROADMAP.md), **console support — starting with PlayStation 5 — is in active development**, following the same access model MonoGame uses for its console frameworks.

This release clears the decks: a clean, consolidated, well-tested foundation to build all of that on. Thanks, as always, for being part of it.

Check it out & stay tuned for more to come!
