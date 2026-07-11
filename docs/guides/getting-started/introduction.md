---
sidebar_position: 1
---

# Introduction

![Cocos2D-Mono](https://raw.githubusercontent.com/Cocos2D-Mono/cocos2d-mono/master/Logos/logo-full-200.png)

Cocos2D-Mono is the premier 2D game development engine based upon the wildly popular and successful Cocos2D-X engine and picking up where Cocos2D-XNA left off. With Cocos2D-Mono, the game developer can create fantastic games with rich user experiences without the tremendous cost of a proprietary game library. Open source and hosted on GitHub under the AGPL-3.0 license (with a commercial license available for closed-source use), this framework gives developers total power and control over every aspect of their game. Cocos2D-XNA has been used to deploy games to nearly every type of device in use today using XNA from Microsoft or MonoGame, Cocos2D-Mono hopes to continue that journey. Refreshing the Cocos2D-XNA project to support latest MonoGame versions and bringing support to more platforms, the power of XNA and the depth of Cocos2d are at every game developers reach -again-, taking their creative genius to over 95% of the computing devices on the planet.

Cocos2D-Mono focuses more on the MonoGame Framework and removes the limitations from proper XNA which held the original Cocos2D-XNA project back.

# Build Status

[![DesktopGL (Windows/Linux/macOS)](https://github.com/Cocos2D-Mono/cocos2d-mono/actions/workflows/status-desktopgl.yml/badge.svg)](https://github.com/Cocos2D-Mono/cocos2d-mono/actions/workflows/status-desktopgl.yml)
[![Windows](https://github.com/Cocos2D-Mono/cocos2d-mono/actions/workflows/status-windows.yml/badge.svg)](https://github.com/Cocos2D-Mono/cocos2d-mono/actions/workflows/status-windows.yml)
[![macOS](https://github.com/Cocos2D-Mono/cocos2d-mono/actions/workflows/status-macos.yml/badge.svg)](https://github.com/Cocos2D-Mono/cocos2d-mono/actions/workflows/status-macos.yml)
[![Linux](https://github.com/Cocos2D-Mono/cocos2d-mono/actions/workflows/status-linux.yml/badge.svg)](https://github.com/Cocos2D-Mono/cocos2d-mono/actions/workflows/status-linux.yml)
[![Android](https://github.com/Cocos2D-Mono/cocos2d-mono/actions/workflows/status-android.yml/badge.svg)](https://github.com/Cocos2D-Mono/cocos2d-mono/actions/workflows/status-android.yml)
[![iOS](https://github.com/Cocos2D-Mono/cocos2d-mono/actions/workflows/status-ios.yml/badge.svg)](https://github.com/Cocos2D-Mono/cocos2d-mono/actions/workflows/status-ios.yml)

# Supported Platforms

We support a growing list of platforms across the desktop, mobile, and console space. If there is a platform we don't support, please [make a request](https://github.com/Cocos2D-Mono/cocos2d-mono/issues).

- Desktop PCs
  - Windows (OpenGL & DirectX)
  - Linux (OpenGL)
  - macOS (OpenGL)
- Mobile/Tablet Devices
  - Android (OpenGL)
  - iOS (OpenGL)
- Coming Soon
  - iOS (Metal)
  - tvOS (Metal)
  - macOS (Metal)
  - Xbox (XDK)
  - Nintendo Switch
  - PlayStation 4
  - PlayStation 5

# One Package, Every Platform

Cocos2D-Mono is distributed as a **single, multi-targeted NuGet package**. You add one reference — `Cocos2D-Mono` — and the build for your project's target framework is selected automatically: DesktopGL for cross-platform desktop (Windows, Linux, and macOS), WindowsDX for `net9.0-windows`, Android, or iOS.

This replaces the older model, where each platform had its own package (`Cocos2D-Mono.DesktopGL`, `Cocos2D-Mono.Windows`, `Cocos2D-Mono.Android`, and so on). **Picking a platform-specific package is no longer a thing** — one package covers them all, so there's less to choose from, nothing to keep in sync between platforms, and a simpler upgrade path. A content-pipeline-free variant, `Cocos2D-Mono.Core`, is available for projects that don't use the MonoGame content pipeline, and the Box2D physics port ships as `Cocos2D-Mono.Box2D` (included automatically through the packages above).

Coming from the per-platform packages? See the [Migrating to 2.5.11 guide](/docs/guides/developing/migrating-to-2.5.11).

# Support & Contributing

If you think you have found a bug or have a feature request, use the [issue tracker](https://github.com/Cocos2D-Mono/cocos2d-mono/issues). Before opening a new issue, please search to see if your problem has already been reported. Try to be as detailed as possible in your issue reports.

If you are interested in contributing fixes or features to Cocos2D-Mono, please read our [contributors guide](/docs/guides/contributing/getting-involved.md) first.

## Tests

We maintain an interactive test app that serves as our Test Bed across all supported platforms. It's a single multi-targeted project, `Cocos2DMono.IntegrationTests`, that runs on desktop (DesktopGL), Windows, Android, and iOS.

You can find it in the [Tests directory](https://github.com/Cocos2D-Mono/cocos2d-mono/tree/master/Tests "Tests"). To run it on the desktop:

```
dotnet run --project Tests/Cocos2DMono.IntegrationTests/Cocos2DMono.IntegrationTests.csproj -f net9.0
```

**LINUX SETUP NOTE:** There are some fonts used within the Test Bed not natively found on Linux, please run the following command to add the missing fonts:

> sudo apt-get install ttf-mscorefonts-installer

More tests coming soon!

## Linux & macOS (OpenGL)

For Linux & macOS projects use DesktopGL (cross-platform with Windows support).
