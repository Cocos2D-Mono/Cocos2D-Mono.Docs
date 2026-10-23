---
slug: 2.8.0-release
title: Cocos2D-Mono 2.8.0 is now out!
authors: [brandmooffin]
tags: [update, release, 2.8.0]
---

![Release Logo](./logo-new-release.png)

Cocos2D-Mono **2.8.0** is here, with the next round of **nullable reference type annotations**. Menus, tile maps and more now tell the compiler which of their members can be null. Converting them turned up another batch of long-standing bugs, all fixed in this release. The engine also stops bundling its own gzip code and uses .NET's instead. Apart from nullability, no public API changed, so nothing stops compiling unless your build treats the new nullable warnings as errors. The [release notes](https://github.com/Cocos2D-Mono/cocos2d-mono/releases/tag/v2.8.0) have the full rundown.

<!-- truncate -->

## More of the Engine Is Annotated

2.7.0 annotated the parts of the engine a game touches most. 2.8.0 adds:

- the menus: `CCMenu` and the menu items
- the misc nodes: clipping, draw, lightning, motion streak, parallax scroll, progress timer and render texture nodes
- the tile maps: TMX maps with their layers, object groups and tilesets, tile map atlases and parallax nodes
- the support helpers: `CCUserDefault`, `CCObjectPool`, the `CCPoint`, `CCSize` and `CCRect` type converters, and `CCUtils`

For example, the compiler now knows that a tile map's `LayerNamed` returns null for a layer the map doesn't have:

```csharp
var ground = map.LayerNamed("Ground");
ground.TileGIDAt(new CCPoint(2, 3));      // warning CS8602: Dereference of a possibly null reference.

if (map.LayerNamed("Ground") is CCTMXLayer layer)
{
    layer.TileGIDAt(new CCPoint(2, 3));   // no warning: layer can't be null here
}
```

The director and scheduler, the platform code, the extensions and Box2D are next. As before, a type that hasn't been converted raises no new warnings, and projects that don't enable nullable get none at all.

## Upgrading

Bump your package reference to 2.8.0. Three things are worth a look:

- **New warnings in projects that enable nullable.** The newly annotated members raise warnings where they're used without a null check. If your build treats warnings as errors, `<WarningsNotAsErrors>nullable</WarningsNotAsErrors>` keeps them as warnings while you fix them, as the [2.7.0 post](/blog/2.7.0-release) explains.
- **More specific exceptions.** For example, `CCMenu.AddChild` throws `ArgumentException` for a child that isn't a menu item, `CCProgressTimer` throws `ArgumentNullException` for a null sprite, and a malformed TMX file throws `InvalidDataException`, naming the misplaced element. Each used to fail with a `NullReferenceException`, often much later, or not at all. If your code catches `NullReferenceException` from the engine, catch the new type instead.
- **Fixes that change behavior.**
  - Gzip data with a bad checksum is rejected. More on that below.
  - A particle system whose embedded texture can't be loaded gets the engine's default texture instead of none.
  - `CCImageTGA.imageData` and `CCTMXLayerInfo.Tiles` start out as empty arrays instead of null.

The [CHANGELOG](https://github.com/Cocos2D-Mono/cocos2d-mono/blob/master/CHANGELOG.md) covers every change under Upgrading, Changed and Fixed.

## Bugs Found Along the Way

The CHANGELOG lists 19 fixes. Some highlights:

- **Tile maps that wouldn't load.** A map with a layer whose tiles were all empty threw when it loaded. Such a layer is now skipped, as in cocos2d-x 3. A map read from a stream threw at its first tileset image, because there was no map file to find the image path from. And a malformed map threw a bare `NullReferenceException`.
- **Menus that crashed later.** In release builds, `CCMenu.AddChild` quietly accepted a child that wasn't a menu item, and the menu then crashed when it entered a scene. Giving the focus to an empty menu threw too, and so did pressing a gamepad button when no item had the focus.
- **Nodes made with the parameterless constructor.** A `CCMenuItemToggle`, `CCMenuItemLabel` or `CCLightningStreak` created that way could throw as soon as it was used.
- **Type converters.** Converting a null `CCPoint`, `CCSize` or `CCRect` value to a string threw, where it should return an empty string.

The fixes come with regression tests, which bring the unit suite to 338.

**Full Changelog**: https://github.com/Cocos2D-Mono/cocos2d-mono/compare/v2.7.0...v2.8.0

## Gzip Without the Bundled Code

TMX maps with gzip-compressed layers, particle systems with an embedded texture, and `ZipUtils.InflateMemory` all decompress gzip data. Until now they used a copy of an old zlib library that the engine carried from its Windows Phone days, when the phone had no `System.IO.Compression`. 2.8.0 drops that copy, about 5,000 lines of it, and uses .NET's own `GZipStream`, which every platform the engine targets has.

Nothing in the public API changes. One thing behaves differently: the old code never checked a gzip stream's checksum, so corrupt data decompressed into wrong tiles or pixels. Now it's rejected, and handled the same way as any data that can't be decompressed: the TMX layer stays empty, `InflateMemory` returns 0, and a particle system falls back to the default texture.

We checked the new code on an Android device as well, with a new GzipTest scene in the test app. It loads a gzip-compressed map and particle systems with embedded textures, and checks what they decode against known values.

## Also in This Release

- **The API reference on this site is rebuilt at each release again.** The rebuild had failed since 2.6.0.
- **Building Mac Catalyst and tvOS from source** now uses the `cocos2d-mono` branch of our [MonoGame fork](https://github.com/Cocos2D-Mono/MonoGame), the branch that support will live on.

## NuGet Packages

- **Cocos2D-Mono** (Windows, Linux, macOS, Android, iOS): [Cocos2D-Mono](https://www.nuget.org/packages/Cocos2D-Mono/)

- **Cocos2D-Mono.Core** — same engine, no content-pipeline dependency: [Cocos2D-Mono.Core](https://www.nuget.org/packages/Cocos2D-Mono.Core/)

- **Cocos2D-Mono.Box2D** — the Box2D physics port: [Cocos2D-Mono.Box2D](https://www.nuget.org/packages/Cocos2D-Mono.Box2D/)

The samples package and the Visual Studio project templates move to 2.8.0 too.

## What's Next

More annotations: the director and scheduler, the platform code, the extensions and Box2D. If you find a member annotated wrong, either nullable where it can never be null or the other way round, please [open an issue](https://github.com/Cocos2D-Mono/cocos2d-mono/issues).

Thanks, as always, for being part of it. GO COCOS NUTS!
