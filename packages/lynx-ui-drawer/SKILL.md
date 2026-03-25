# lynx-ui-drawer Component Skill

## Overview

A headless, animated drawer component for ReactLynx with native-like swipe-to-close gestures.

## Architecture

The Drawer follows a compound component architecture:

- **`DrawerRoot`**: Manages the open/close state (`show`, `onShowChange`), the edge placement (`placement`), and orchestrates the enter/exit lifecycle events using the `Presence` module.
- **`DrawerOverlay`**: A backdrop element that dims the screen and dismisses the Drawer when tapped.
- **`DrawerContent`**: The sliding panel that contains the Drawer's UI. It inherently handles drag-to-close gestures smoothly via Main Thread Script (MTS) and motion values.

## Key Concepts

- **Presence Managed**: `DrawerRoot` uses `usePresenceGroup` under the hood. **Never** conditionally render `DrawerRoot` using `{show && <DrawerRoot>...}`. Instead, always keep it mounted and control its visibility solely through the `show` prop so animations play correctly.
- **Main Thread Gestures**: `DrawerContent` uses MTS for high-performance touch tracking. This means that drag-to-close logic executes synchronously on the UI thread without blocking the JavaScript runtime.

## Common Pitfalls

- **Nesting scroll views**: If you nest a `<scroll-view>` inside `<DrawerContent>`, be aware of potential gesture conflicts. The user might want to scroll vertically, but if `placement` is `'bottom'`, they might trigger a close gesture. Ensure you specify `dragDisabled={true}` if gestures clash, or rely on proper directional swipe tracking.
- **Missing `DrawerRoot` wrappers**: Always pair `DrawerContent` and `DrawerOverlay` as direct or indirect descendants of `DrawerRoot`. They require the internal Drawer context to function.

## Prompt Formula

```text
I need a sliding drawer for [use case].
- Use `@lynx-js/lynx-ui`'s `DrawerRoot`, `DrawerOverlay`, and `DrawerContent` components.
- The drawer should slide in from the ['left' | 'right' | 'top' | 'bottom'].
- Bind the state using `show` and `onShowChange`.
- Include the following content inside the drawer: [content requirements].
```
