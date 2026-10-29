---
slug: 2.9.0-release
title: Cocos2D-Mono 2.9.0 is now out!
authors: [brandmooffin]
tags: [update, release, 2.9.0]
---

![Release Logo](./logo-new-release.png)

Cocos2D-Mono **2.9.0** completes the **nullable reference type annotations** that started in 2.7.0. The director and scheduler, the platform code, the controls, the CCB reader and all of Box2D now tell the compiler which of their members can be null, so every part of the engine is annotated, apart from the deprecated zlib port. Converting them turned up another batch of long-standing bugs, all fixed in this release, including a few in Box2D's world lock. The engine also stops using its bundled zlib code, which is now deprecated. Apart from nullability and that deprecation, no public API changed, so nothing stops compiling unless your build treats the new warnings as errors. The [release notes](https://github.com/Cocos2D-Mono/cocos2d-mono/releases/tag/v2.9.0) have the full rundown.

<!-- truncate -->

## The Whole Engine Is Annotated

2.7.0 and 2.8.0 annotated the parts of the engine a game touches most: nodes, actions, sprites, labels, menus, tile maps and more. 2.9.0 annotates the rest:

- the director, the scheduler and the other root files
- the platform code: plists, content loading, and runtime classes such as `CCApplication` and `CCDrawManager`
- the embeddable view, `CCGameView`
- the extensions: the controls, the scroll and table views, and the CCB reader
- all of Box2D

Only the deprecated zlib port is left out. It keeps nullable checks off until 3.0 removes it.

For example, a body's `UserData` is nullable, because a body has no user data until you give it some:

```csharp
var sprite = (CCSprite)body.UserData;   // warning CS8600: Converting null literal or possible null value to non-nullable type.

if (body.UserData is CCSprite s)
{
    s.Position = new CCPoint(body.Position.x * PtmRatio, body.Position.y * PtmRatio);   // no warning: s can't be null here
}
```

Box2D's lists of bodies, fixtures, contacts and joints end with null, so `BodyList`, `Next` and the like are nullable too. A loop that stops at null, as these loops always had to, raises no warning. And as before, projects that don't enable nullable get no new warnings at all.

## Upgrading

Bump your package reference to 2.9.0. Four things are worth a look:

- **New warnings in projects that enable nullable.** The newly annotated members raise warnings where they're used without a null check. If your build treats warnings as errors, `<WarningsNotAsErrors>nullable</WarningsNotAsErrors>` keeps them as warnings while you fix them, as the [2.7.0 post](/blog/2.7.0-release) explains. A few signatures you implement or override changed as well: an `ICCSAXDelegator.StartElement` implementation should take `string[]? atts`, and a custom CCB node loader's overrides should take `CCNode? parent`.
- **The zlib port is obsolete.** Code that uses `Cocos2D.Compression.Zlib` gets an obsolete warning. Switch to .NET's `ZLibStream` before 3.0 removes the port. More on that below.
- **More specific exceptions.** For example, a sprite frame, animation or particle plist that lacks a value it needs throws an `InvalidDataException` that names the missing key, and `b2World.CreateJoint` throws `ArgumentException` for a definition without both bodies. Most of these used to fail with a `NullReferenceException`. If your code catches `NullReferenceException` from the engine, catch the new type instead.
- **Fixes that change behavior.**
  - Box2D throws `InvalidOperationException` when a body, joint or fixture is created, or `Step` is called, while the world is stepping. More on that below.
  - A particle plist without a `textureFileName` gets its embedded texture instead of the default one.
  - `CCContentManager.Load<string>` no longer returns null for a content file without any text.

Building the engine from source now needs .NET SDK 10.0.303 or later. Games that use the packages aren't affected.

The [CHANGELOG](https://github.com/Cocos2D-Mono/cocos2d-mono/blob/v2.9.0/CHANGELOG.md) covers every change under Upgrading, Changed and Fixed.

## Box2D's World Lock

Box2D locks the world while it steps, because adding or removing bodies partway through a step would break it. That's why a contact listener shouldn't create a body itself: it records what to do, and the game does it after `Step` returns. Converting Box2D showed that the lock didn't always hold:

- **Creating a body, joint or fixture during a step returned null.** That usually surfaced later as a `NullReferenceException`, far from the cause. Now `CreateBody`, `CreateJoint` and `CreateFixture` throw `InvalidOperationException` right away.
- **A callback that threw left the world locked.** Until a later `Step` finished, creating or destroying a body failed or did nothing. Now `Step` unlocks the world when a callback throws.
- **Part of the step ran unlocked.** A contact filter called while `Step` looked for new contacts could change the world, or step it again. Now the whole step is locked, and calling `Step` during a step throws `InvalidOperationException` instead of running a second step inside the first.

## Bugs Found Along the Way

The CHANGELOG lists 50 fixes. Some highlights:

- **`b2Body.DestroyFixture` could hang.** It looped forever for any fixture but the body's two newest.
- **The CCB reader.** `CCNodeLoaderLibrary.SharedInstance` threw the first time it was used, because it registered the default loaders twice. JavaScript-controlled files with owner outlets or callbacks threw as they loaded, and so did a file that used a missing texture.
- **`CCGameView`.** Several things threw in an embedded view: a node with the game pad enabled entering or leaving a scene, `CCBox2dDraw` loading its font, and on iOS, a `CCLabel` with a TTF font. The first two assumed a `CCApplication`, which an embedded view doesn't have.
- **Plists.** A sprite frame without an `aliases` array, animation properties without sprite sheets, and a plist with a `<data>` value all threw a `NullReferenceException`. A particle plist without a `textureFileName` lost its embedded texture.

The fixes come with regression tests, which bring the unit suite to 398.

**Full Changelog**: https://github.com/Cocos2D-Mono/cocos2d-mono/compare/v2.8.0...v2.9.0

## Zlib Without the Bundled Code

2.8.0 moved gzip to .NET's `GZipStream`. 2.9.0 does the same for zlib: TMX layers with `compression="zlib"` now decompress with .NET's `ZLibStream`. That leaves nothing in the engine using its old zlib port. The port is public, as `Cocos2D.Compression.Zlib`, so rather than removing it in a minor release, 2.9.0 marks it obsolete, and 3.0 removes it. If your game uses it directly, switch to `System.IO.Compression.ZLibStream`.

One thing behaves differently: a corrupt zlib layer throws `InvalidDataException` instead of the port's `ZStreamException`.

## Also in This Release

- **A vulnerable build dependency is gone.** The packages are now built with the .NET SDK's own Source Link instead of the `Microsoft.SourceLink.GitHub` package, whose `Microsoft.Build.Tasks.Git` dependency had an information disclosure vulnerability (CVE-2026-62900). It was only ever used to build the engine and never shipped in the packages, and the Source Link information in them is unchanged.

## NuGet Packages

- **Cocos2D-Mono** (Windows, Linux, macOS, Android, iOS): [Cocos2D-Mono](https://www.nuget.org/packages/Cocos2D-Mono/)

- **Cocos2D-Mono.Core** — same engine, no content-pipeline dependency: [Cocos2D-Mono.Core](https://www.nuget.org/packages/Cocos2D-Mono.Core/)

- **Cocos2D-Mono.Box2D** — the Box2D physics port: [Cocos2D-Mono.Box2D](https://www.nuget.org/packages/Cocos2D-Mono.Box2D/)

The samples package and the Visual Studio project templates move to 2.9.0 too.

## What's Next

With the annotations done, the next releases clear the compiler warnings that are left, and CI now fails on new ones, so the engine stays clean as it changes. Some of the remaining warnings point at code worth a second look, so expect a few more fixes along the way. Further out is [3.0](https://github.com/Cocos2D-Mono/cocos2d-mono/blob/master/ROADMAP.md#30), an API cleanup that has no date yet. If you find a member annotated wrong, either nullable where it can never be null or the other way round, please [open an issue](https://github.com/Cocos2D-Mono/cocos2d-mono/issues).

Thanks, as always, for being part of it. GO COCOS NUTS!
