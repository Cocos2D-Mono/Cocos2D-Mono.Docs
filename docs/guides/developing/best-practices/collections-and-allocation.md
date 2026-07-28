---
sidebar_position: 4
title: Collections & Allocation
---

# Collections and Allocation in Hot Paths

The engine's per-frame code (vertex assembly, particle updates, child traversal) runs hundreds of times per second — allocation there becomes garbage-collector pressure, and GC pauses become dropped frames. `CCRawList<T>` is the engine's answer, and it's public API you can use in your own hot paths.

## What `CCRawList<T>` is

A list that **exposes its backing array by design**:

```csharp
public T[] Elements;   // the backing array - Length is capacity, not count
public int count;      // the number of live elements - this is authoritative
```

That layout enables enumerator-free, bounds-check-friendly iteration:

```csharp
var list = new CCRawList<CCParticle>(256);
for (int i = 0; i < list.count; i++)
{
    ref var p = ref list.Elements[i];
    // update p in place - no copies, no enumerator allocation
}
```

## The direct-access contract

The exposed internals come with rules:

1. **`count` is the truth.** `Elements.Length` is capacity; slots at `count` and beyond are garbage. Never iterate by `Elements.Length`.
2. **Don't cache `Elements` across mutations.** `Add` grows by swapping in a new backing array — a stale reference to the old one silently stops observing the list.
3. Mutating methods (`Add`, `RemoveAt`, `Clear`, …) keep `count` and the tail consistent for you; the contract only binds *your* direct array access.

## Array pooling: `UseArrayPool`

Construct with `new CCRawList<T>(capacity, useArrayPool: true)` and grow/clear cycles rent from `ArrayPool<T>.Shared` instead of allocating fresh arrays. In the engine's benchmarks this made the pooled path **~21% faster with near-zero allocation** — it's why the engine's own vertex and particle buffers use it.

- Use it for **long-lived, frequently-resized** collections (per-frame vertex lists, particle pools).
- Call `Clear(true)` when you're done with a pooled list so the buffer returns to the pool.
- Skip it for short-lived or rarely-touched lists — the plain path is simpler and fine.

## When to just use `List<T>`

Everywhere else. Game logic, scene setup, UI state — anything that isn't per-frame — should use the BCL collections. `CCRawList<T>` trades safety rails for speed; only take that trade where the profiler says it matters.
