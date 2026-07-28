---
sidebar_position: 3
title: Content Pipeline or Not
---

# Content Pipeline or Not: `Cocos2D-Mono` vs `Cocos2D-Mono.Core`

Both packages ship the **identical engine runtime** (`Cocos2DMono.dll`). The only difference is build-time: the main package declares a dependency on `MonoGame.Content.Builder.Task` (the MSBuild task that compiles `.mgcb` content projects), and `Cocos2D-Mono.Core` does not.

## Which to reference

| Your project | Reference |
|---|---|
| Uses the MonoGame content pipeline (a `Content.mgcb`, compiled `.xnb` assets) | **`Cocos2D-Mono`** |
| Loads raw assets yourself (files, streams, embedded resources) and never runs MGCB | **`Cocos2D-Mono.Core`** |

## The gotcha worth knowing: MGCB does not flow transitively

The MGCB package ships its MSBuild targets in `build/` only — **not** `buildTransitive/` — which means the content-build task does **not** activate in your game project just because a package you reference depends on it. This is standard MonoGame behavior, not a Cocos2d-Mono quirk.

The practical consequence: **a game project that uses the content pipeline should reference `MonoGame.Content.Builder.Task` directly**, exactly as a plain MonoGame game would:

```xml
<ItemGroup>
  <PackageReference Include="Cocos2D-Mono" />
  <PackageReference Include="MonoGame.Content.Builder.Task" />
</ItemGroup>
<ItemGroup>
  <MonoGameContentReference Include="Content\Content.mgcb" />
</ItemGroup>
```

Because of that, `Cocos2D-Mono` and `Cocos2D-Mono.Core` behave identically for most consumers today — `.Core` exists for migration continuity from the historical per-platform `.Core` packages and as insurance if a future MGCB ships transitive targets. If you're unsure, reference the main package; you can always narrow later.

The [project templates](https://marketplace.visualstudio.com/items?itemName=Cocos2D-MonoTeamBrokenWallsStudios.cocos2dmonoprojecttemplates) wire all of this correctly out of the box.
