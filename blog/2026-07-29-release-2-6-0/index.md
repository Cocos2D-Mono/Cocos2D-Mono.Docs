---
slug: 2.6.0-release
title: Cocos2D-Mono 2.6.0 is now out!
authors: [brandmooffin]
tags: [update, release, 2.6.0]
---

![Release Logo](./logo-new-release.png)

Cocos2D-Mono **2.6.0** is here — the platform-line release. The engine now runs on **.NET 10 and MonoGame 3.8.5**, and the migration is one step: retarget your game to .NET 10 and bump the package. No API changes, no code changes. The [release notes](https://github.com/Cocos2D-Mono/cocos2d-mono/releases/tag/2.6.0) have the full rundown, and the [migration guide](/docs/guides/developing/migrating-to-2.6.0) walks through the retarget.

When 2.5.12 shipped we said the 2.6.0 line was underway — here it is, two weeks later.

<!-- truncate -->

## The One-Step Migration

```diff
- <TargetFramework>net9.0</TargetFramework>
+ <TargetFramework>net10.0</TargetFramework>

- <PackageReference Include="Cocos2D-Mono" Version="2.5.12" />
+ <PackageReference Include="Cocos2D-Mono" Version="2.6.0" />
```

That's it. Desktop targets `net10.0` (or `net10.0-windows` for WindowsDX), mobile targets `net10.0-android` / `net10.0-ios`. One thing worth knowing: Apple's version numbering jumped, so explicit iOS platform pins are now `ios26.0` — details in the [migration guide](/docs/guides/developing/migrating-to-2.6.0).

## What's Underneath

- **MonoGame 3.8.5** — MonoGame's biggest release in years: a new native core, ARM64 support, and Vulkan/Direct3D 12 backends in preview. Cocos2D-Mono ships on the proven DesktopGL and WindowsDX backends today, and the new preview backends are firmly on our radar as they stabilize.
- **.NET 10** — the current LTS, replacing the now out-of-support .NET 9. Modern C#, current tooling, long support runway.
- **Future-proofing** — the engine migrated off every API MonoGame has marked for removal, with identical behavior.

Before release, the full stack was validated end-to-end: every target compiles clean, the unit suite passes on .NET 10, and the interactive test app was run scene-by-scene on both desktop backends — sprites, particles, every label backend, tilemaps, transitions, input, audio, and the Box2D testbed.

## Also New: Best Practices Guides

Shipping alongside this release is a new **[Best Practices](/docs/guides/developing/best-practices/)** documentation section — six opinionated guides covering the gap between getting started and the API reference: which label type to pick (and why it matters for porting), content pipeline or not, hot-path collections, platform-specific code, saving game data, and scene lifecycle conventions. These are the opinions the engine's own development settled on — written down so you don't have to learn them the hard way.

## NuGet Packages

- **Cocos2D-Mono** (Windows, Linux, macOS, Android, iOS): [Cocos2D-Mono](https://www.nuget.org/packages/Cocos2D-Mono/)

- **Cocos2D-Mono.Core** — same engine, no content-pipeline dependency: [Cocos2D-Mono.Core](https://www.nuget.org/packages/Cocos2D-Mono.Core/)

- **Cocos2D-Mono.Box2D** — the Box2D physics port: [Cocos2D-Mono.Box2D](https://www.nuget.org/packages/Cocos2D-Mono.Box2D/)

The samples and Visual Studio project templates are moving to 2.6.0 as well — they're next in the release train.

## What's Next

With the platform line current, the roadmap continues: as noted before, **console support — starting with PlayStation 5 — remains in active development**, and MonoGame 3.8.5's new backends (Vulkan on desktop, Direct3D 12) open doors we intend to walk through as they mature.

Thanks, as always, for being part of it. GO COCOS NUTS!
