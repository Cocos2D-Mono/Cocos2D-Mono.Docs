---
sidebar_position: 7
title: Scene & Node Lifecycle
---

# Scene and Node Lifecycle

The samples all follow the same structural conventions; this page states them outright.

## Scene flow: the director owns it

```csharp
CCDirector.SharedDirector.RunWithScene(new MainMenuScene());   // first scene only
CCDirector.SharedDirector.ReplaceScene(new GameScene());       // normal navigation
CCDirector.SharedDirector.PushScene(new PauseScene());         // overlay, keep the old scene
CCDirector.SharedDirector.PopScene();                          // return to it
```

- `RunWithScene` starts the very first scene; everything after is `ReplaceScene`.
- `PushScene`/`PopScene` is for temporary overlays (pause, settings) where the underlying scene should survive untouched — cheaper than rebuilding, and it keeps gameplay state alive by construction.
- Transitions wrap the *incoming* scene: `ReplaceScene(new CCTransitionFade(0.5f, next))`.

## Node lifecycle: build → enter → exit

A node's life has three phases, and each kind of work belongs in exactly one of them:

```csharp
public class GameLayer : CCLayer
{
    public GameLayer()
    {
        // 1. BUILD - construct the hierarchy: create children, set positions.
        //    The node is NOT in a running scene yet: no scheduling, no input.
        AddChild(new CCSprite("player"));
    }

    public override void OnEnter()
    {
        base.OnEnter();   // ALWAYS first - wires children, scheduler, and touch registration
        // 2. ACTIVATE - the node just joined the running scene:
        //    schedule updates, subscribe to input, start ambient actions/audio.
        ScheduleUpdate();
    }

    public override void OnExit()
    {
        // 3. DEACTIVATE - mirror OnEnter: unschedule, unsubscribe, stop what you started.
        UnscheduleUpdate();
        base.OnExit();    // ALWAYS last
    }
}
```

The rules the engine assumes:

- **Always call `base.OnEnter()` / `base.OnExit()`** — they propagate the lifecycle to children and manage scheduler/touch registration. Skipping them is the classic source of "my child never updates" and "touches leak into dead scenes."
- **`OnEnter` and `OnExit` are symmetric.** Everything you start in one, stop in the other — a node can enter and exit *multiple times* (push/pop flows re-enter the underlying scene).
- `OnEnterTransitionDidFinish` fires after an incoming transition completes — use it to defer gameplay start (input enabling, music) until the scene is fully visible.
- For heavyweight teardown, remove children with `RemoveChild(child, cleanup: true)` so running actions and schedules are stopped, not orphaned.

The test app's scenes (see the [Tests README](https://github.com/Cocos2D-Mono/cocos2d-mono/blob/master/Tests/README.md)) are living examples of these conventions across every engine subsystem.
