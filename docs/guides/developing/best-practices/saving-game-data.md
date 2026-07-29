---
sidebar_position: 6
title: Saving Game Data
---

# Saving Game Data

Three different needs, three different answers: settings go in `CCUserDefault`, game-state saves are yours to format, and one engine API must be avoided entirely.

## Settings: `CCUserDefault`

Key–value storage for options, preferences, and small flags — the engine persists it for you:

```csharp
var prefs = CCUserDefault.SharedUserDefault;

prefs.SetBoolForKey("music-enabled", true);
prefs.SetIntegerForKey("high-score", 12500);
prefs.SetStringForKey("player-name", "Ada");

bool music = prefs.GetBoolForKey("music-enabled", defaultValue: true);
int best   = prefs.GetIntegerForKey("high-score", defaultValue: 0);
```

`Bool`, `Integer`, `Float`, `Double`, and `String` accessors are available, each with a `defaultValue` overload — always use it, so first-run reads are well-defined.

## Swapping the storage backend

Where those values physically live is a **pluggable seam**: `CCUserDefault.Storage` accepts any `ICCUserDefaultStorage`. By default the engine uses a settings file on desktop and isolated storage elsewhere. On platforms without a writable file system — console save-data systems are the motivating case — supply your own implementation:

```csharp
// Set BEFORE the first SharedUserDefault access;
// combine with CCUserDefault.PurgeSharedUserDefault() if swapping mid-run.
CCUserDefault.Storage = new MyPlatformSaveStorage();
```

This seam is the engine's model for platform-specific behavior generally — see [Platform-Specific Code](./platform-specific-code).

## Game state: roll your own format

For actual save games — progress, inventories, world state — serialize your **own** model objects with the .NET serializer of your choice (`System.Text.Json` is the obvious default) and write the result where your platform wants saves. Keep the save model separate from your node graph: scenes are cheap to rebuild *from* state, and save formats outlive scene-graph refactors.

## ⚠️ Do not use `CCNode.Serialize`

The engine's node-graph serialization (`CCNode.Serialize` / `Deserialize`) is **known-broken and unsupported**: the write path never flushes, so it persists nothing. It predates the current maintenance era and is slated for a ground-up rework rather than a patch — until that lands, treat the API as absent. Do not build a save system on it; nothing you "save" through it survives.
