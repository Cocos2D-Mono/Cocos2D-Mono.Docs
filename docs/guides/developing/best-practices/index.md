---
sidebar_position: 1
title: Overview
---

# Best Practices

The getting-started guides cover *how* to do things; the API reference covers *what* exists. This section covers the part in between: **which of several available approaches to reach for, and why**. These are the opinions the engine's own development settled on — several of them learned the hard way during the modernization and platform-porting work, and written down here so you don't have to rediscover them.

| Guide | The one-line opinion |
|---|---|
| [Text Rendering](./text-rendering) | Default to bitmap fonts (`CCLabelBMFont`); dynamic system-font labels don't exist on every platform. |
| [Content Pipeline or Not](./content-pipeline) | Pick `Cocos2D-Mono` vs `Cocos2D-Mono.Core` by whether you use MGCB — and if you do, reference the MGCB task directly. |
| [Collections & Allocation](./collections-and-allocation) | Use `CCRawList<T>` (and its array pooling) in per-frame hot paths; use `List<T>` everywhere else. |
| [Platform-Specific Code](./platform-specific-code) | Prefer runtime seams; when you must `#if`, guard on what you *mean*, never on what you exclude. |
| [Saving Game Data](./saving-game-data) | `CCUserDefault` for settings; your own format for game state; **never** `CCNode.Serialize`. |
| [Scene & Node Lifecycle](./scene-lifecycle) | Build in the constructor, activate in `OnEnter`, undo everything in `OnExit`. |

Where a topic has a working demonstration in the [samples repository](https://github.com/Cocos2D-Mono/cocos2d-mono-samples) or the in-repo test app, the guide links to it rather than restating the code.
