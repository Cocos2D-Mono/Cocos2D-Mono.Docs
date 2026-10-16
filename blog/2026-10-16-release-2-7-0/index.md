---
slug: 2.7.0-release
title: Cocos2D-Mono 2.7.0 is now out!
authors: [brandmooffin]
tags: [update, release, 2.7.0]
---

![Release Logo](./logo-new-release.png)

Cocos2D-Mono **2.7.0** is here, with the engine's first **nullable reference type annotations**. Nodes, actions, sprites, textures, labels and more now tell the compiler which of their members can be null. A game with nullable enabled learns where it needs a null check when it builds, instead of from a `NullReferenceException` while it runs. Nothing stops compiling: apart from nullability, no public API changed. The [release notes](https://github.com/Cocos2D-Mono/cocos2d-mono/releases/tag/v2.7.0) have the full rundown.

Converting the engine also turned up plenty of long-standing bugs, so 2.7.0 is a big bug-fix release too. More on both below.

<!-- truncate -->

## What the Annotations Do

In a project with `<Nullable>enable</Nullable>`, the compiler now knows that `CCNode.GetChildByTag` returns null for an unknown tag, and that a node's `Parent` is null until it's added to one:

```csharp
var player = layer.GetChildByTag(PlayerTag);
player.RunAction(jump);       // warning CS8602: Dereference of a possibly null reference.

if (layer.GetChildByTag(PlayerTag) is CCSprite sprite)
{
    sprite.RunAction(jump);   // no warning: sprite can't be null here
}
```

2.7.0 annotates the parts of the engine a game touches most:

- the base nodes
- input handling
- layers, scenes and transitions
- actions
- particles and grid effects
- sprites and their caches
- textures and labels

The rest, including menus, tile maps, the director and scheduler, the platform code, the extensions and Box2D, follows through the 2.x releases, a directory at a time. By 3.0 the annotations cover the whole public API. A type that hasn't been converted carries no annotations, so it raises no new warnings either way. Projects that don't enable nullable get no new warnings at all.

## Upgrading

Bump your package reference to 2.7.0. Three things are worth a look:

- **Builds that treat warnings as errors.** If your project enables nullable and sets `TreatWarningsAsErrors`, the new warnings fail the build until the code checks for null. To upgrade now and fix them as you go, keep them as warnings for the time being:

  ```xml
  <PropertyGroup>
    <WarningsNotAsErrors>nullable</WarningsNotAsErrors>
  </PropertyGroup>
  ```

- **More specific exceptions.** Some failures that used to surface as a `NullReferenceException` now throw an exception that names the problem. For example, several methods given a texture or font file that can't be loaded throw `ArgumentException`, and reversing an action that has no reverse throws `NotSupportedException`. If your code catches `NullReferenceException` from the engine, catch the new type instead.
- **Fixes that change behavior.** A few actions now do what they always claimed to:
  - `CCShuffleTiles` and `CCTurnOffTiles` follow their seed.
  - `CCMoveFrom` and `CCColorBlendAnimation` change their node.
  - `CCAccelDeccelAmplitude` animates the effect it wraps.

  If your game worked around the old behavior, check it.

The [CHANGELOG](https://github.com/Cocos2D-Mono/cocos2d-mono/blob/master/CHANGELOG.md) covers every change under Upgrading, Changed and Fixed.

## Bugs Found Along the Way

Annotating code means asking, member by member, "can this be null here?" A surprising number of the answers turned out to be bugs. The CHANGELOG lists 44 fixes. Some highlights:

- **Copies that changed the original.** `Copy(zone)` on `CCScaleTo`, `CCScaleBy`, `CCReverseTime` and `CCOrbitCamera` copied the wrong way, overwriting the original action with the new one's values. A copied `CCCardinalSplineBy`, `CCCatmullRomTo` or `CCCatmullRomBy` came back as a `CCCardinalSplineTo`. So a copied spline-by action moved the node to the spline's absolute points instead of relative to where it started.
- **Actions that never set their target.** `CCMoveFrom` and `CCColorBlendAnimation` never changed their node, and `CCRotateAnimation` threw as soon as it ran.
- **Touch priority mid-touch.** `CCTouchDispatcher.SetPriority` failed when called during a touch dispatch. That happens when a menu callback opens a popup menu.
- **`CCLayerMultiplex` bookkeeping.** Its layer order, indexing and `SwitchToAndReleaseMe` all had bugs. It now switches, numbers and releases layers correctly.
- **Sprite sheets.** `CCSpriteSheetCache.AddSpriteSheet` ignored the stream or dictionary it was given. `CCSpriteFrameCache.RemoveSpriteFrameByName` threw for a frame that had no alias.

The fixes come with regression tests: the unit suite grew from 132 tests in 2.6.2 to 300.

**Full Changelog**: https://github.com/Cocos2D-Mono/cocos2d-mono/compare/v2.6.2...v2.7.0

## Also New Since 2.6.0

Two smaller releases shipped since our last post:

- **2.6.2: Mac Catalyst and tvOS from source.** The engine now builds for Mac Catalyst and tvOS against our [MonoGame fork](https://github.com/Cocos2D-Mono/MonoGame). MonoGame publishes no package for either platform, so they aren't in the NuGet packages. The README's [Platform support](https://github.com/Cocos2D-Mono/cocos2d-mono#platform-support) section has the build steps. It also sets out which platforms are in the packages and which build from source. On tvOS, the Siri Remote's select button arrives as gamepad input.
- **2.6.1: label fixes on Linux and macOS.** `CCLabel` now disposes the native Skia canvas and font it creates on each redraw, instead of leaving them for the garbage collector.

## NuGet Packages

- **Cocos2D-Mono** (Windows, Linux, macOS, Android, iOS): [Cocos2D-Mono](https://www.nuget.org/packages/Cocos2D-Mono/)

- **Cocos2D-Mono.Core** — same engine, no content-pipeline dependency: [Cocos2D-Mono.Core](https://www.nuget.org/packages/Cocos2D-Mono.Core/)

- **Cocos2D-Mono.Box2D** — the Box2D physics port: [Cocos2D-Mono.Box2D](https://www.nuget.org/packages/Cocos2D-Mono.Box2D/)

The samples package and the Visual Studio project templates move to 2.7.0 too.

## What's Next

More annotations. The next releases take on menus, tile maps and the rest of the engine. If you find a member annotated wrong, either nullable where it can never be null or the other way round, please [open an issue](https://github.com/Cocos2D-Mono/cocos2d-mono/issues).

Thanks, as always, for being part of it. GO COCOS NUTS!
