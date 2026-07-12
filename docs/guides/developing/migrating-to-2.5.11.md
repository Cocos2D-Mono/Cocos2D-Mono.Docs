---
sidebar_position: 5
---

# Migrating to 2.5.11

2.5.11 changes how Cocos2D-Mono is **packaged**, not how it's used. The runtime API and the
`Cocos2D` namespace are unchanged — for most projects this is a one-line migration.

## What changed

The twelve per-platform NuGet packages have been replaced by **three multi-targeted
packages**. Instead of choosing a package per platform, you reference one package and the
correct build is selected automatically from your project's target framework.

| If you referenced… | Use now |
|---|---|
| `Cocos2D-Mono.DesktopGL` | **`Cocos2D-Mono`** |
| `Cocos2D-Mono.Windows` | **`Cocos2D-Mono`** |
| `Cocos2D-Mono.Linux` | **`Cocos2D-Mono`** |
| `Cocos2D-Mono.macOS` | **`Cocos2D-Mono`** |
| `Cocos2D-Mono.Android` | **`Cocos2D-Mono`** |
| `Cocos2D-Mono.iOS` | **`Cocos2D-Mono`** |
| any `Cocos2D-Mono.Core.*` | **`Cocos2D-Mono.Core`** |

`Cocos2D-Mono` includes the MonoGame content-pipeline build task; `Cocos2D-Mono.Core` is the
same engine without it. The Box2D physics port is available on its own as
`Cocos2D-Mono.Box2D` (and also flows in transitively through the packages above).

:::note
The 2.5.10 releases of the per-platform packages are the **last** under those IDs. They
remain installable, so existing projects keep working — but new releases ship only under
the consolidated IDs.
:::

## Step 1 — Swap the package reference

Replace your per-platform package with the consolidated one and bump the version:

```diff
- <PackageReference Include="Cocos2D-Mono.DesktopGL" Version="2.5.10" />
+ <PackageReference Include="Cocos2D-Mono" Version="2.5.11" />
```

:::warning Remove the old package — don't reference both
The old packages shipped `Cocos2D.dll`; the new package ships `Cocos2DMono.dll`. Both use
the `Cocos2D` namespace, so if a project references an old **and** a new package at the same
time you'll get duplicate-type errors (`CS0433`). Remove the old `Cocos2D-Mono.{Platform}`
reference in the same edit that adds `Cocos2D-Mono`.
:::

Your MonoGame references don't need to change. If you use the content pipeline, keep your
`MonoGame.Content.Builder.Task` reference — it is still required. `MonoGame.Framework.*`
now flows in transitively, but an explicit reference is harmless and can stay.

## Step 2 — Your code stays the same

The namespace is still **`Cocos2D`**. Every `using Cocos2D;` and every type is unchanged, so
there are no source edits for the package move.

## Step 3 — Two things to double-check

**Assembly name.** The library assembly is now `Cocos2DMono.dll` (previously `Cocos2D.dll`).
This is transparent to normal code and to NuGet-resolved references. It only matters if you
reference the assembly *by name* — a hand-written `<Reference Include="Cocos2D" />`, an
`Assembly.Load("Cocos2D")`, or reflection keyed on the assembly name — in which case update
the name to `Cocos2DMono`.

**OpenTK.** It is no longer a dependency (it was referenced but unused). If your own code
relied on getting OpenTK transitively through Cocos2D-Mono, add an explicit `OpenTK` package
reference of your own.

## Platform notes

The **package's** target frameworks are unchanged from the 2.5.x line:

- **DesktopGL** (Windows / Linux / macOS): `net9.0`
- **WindowsDX**: `net9.0-windows7.0`
- **Android**: `net9.0-android35.0`
- **iOS**: `net9.0-ios18.0`

**Your project doesn't need to match these exactly.** A project targeting the shorter form —
`net9.0-windows`, `net9.0-android`, or `net9.0-ios` — resolves the matching build automatically,
which is what the samples and project templates do.

The [Visual Studio Project Template Extension](https://marketplace.visualstudio.com/items?itemName=Cocos2D-MonoTeamBrokenWallsStudios.cocos2dmonoprojecttemplates)
is updated for the consolidated packages; new projects created from it reference
`Cocos2D-Mono` out of the box.

## Still on an older version?

If you're coming from before 2.4.0, work through [Migrating to 2.4.0](./migrating-to-2.4.0.md)
first to get onto the modern .NET / project structure, then apply the package swap above.
