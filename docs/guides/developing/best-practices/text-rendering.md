---
sidebar_position: 2
title: Text Rendering
---

# Text Rendering: Pick the Right Label

Cocos2d-Mono has two fundamentally different ways to put text on screen, and choosing the wrong one is the single biggest "works today, bites you at porting time" decision in the engine — because the difference only becomes visible when you target a new platform.

## The two families

**Bitmap fonts — `CCLabelBMFont`.** Glyphs are pre-rendered into a texture atlas at build time (a `.fnt` + texture pair produced by tools like BMFont or Hiero, loaded through the content pipeline). At runtime, drawing text is just drawing sprites.

```csharp
var title = new CCLabelBMFont("Score: 0", "fonts/arial-32.fnt");
```

**Dynamic system-font labels — `CCLabel` / `CCLabelTTF`.** Text is rasterized *at runtime* using the operating system's font stack. Each desktop and mobile platform has its own backend (GDI+/Skia on desktop, CoreGraphics on iOS, the canvas APIs on Android).

```csharp
var chat = new CCLabel(message, "Arial", 22);
```

## The opinion: default to `CCLabelBMFont`

Dynamic labels depend on a platform having a system font store to rasterize from. Desktop and mobile do. **Consoles do not** — there is no OS font service to call, so dynamic labels simply have nothing to render with there. If your game ships text through `CCLabel`/`CCLabelTTF` and you later target a console, every one of those call sites becomes porting work.

Bitmap fonts work identically everywhere the engine runs, because the glyphs are just texture data you shipped.

**Use dynamic labels when** the text is genuinely unpredictable — arbitrary user input, wide Unicode coverage you can't pre-atlas, editor/tooling UI — and you know the shipping platforms have system fonts.

**Use `CCLabelBMFont` for** everything you author yourself: HUDs, menus, dialogue, scores. If the strings are known (or the alphabet is), a bitmap font covers them.

## Practical notes

- One `.fnt` per size looks crisper than scaling one atlas across many sizes; generate the sizes you actually use.
- `CCLabelBMFont` supports width-constrained layout and alignment via its constructor overloads (`width`, `CCTextAlignment`).
- The label scenes in the test app exercise every backend side by side — run it on your target platform when in doubt.
