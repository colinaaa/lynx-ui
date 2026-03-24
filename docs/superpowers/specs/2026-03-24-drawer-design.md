<!-- cspell:disable -->

# Drawer Component Design Specification

## Overview

A Drawer component for `lynx-ui` that pops out from an edge (defaulting to the left side), accompanied by a backdrop overlay. The user can close the drawer by tapping the overlay or swiping left on the drawer content. The swipe-to-close gesture will smoothly follow the user's finger (using spring physics).

## Architecture & Components

We will use Compound Components to align with existing `lynx-ui` headless paradigms (like `Dialog` and `Sheet`).

- **`Drawer.Root`**: A context provider that manages the `show` (open/closed) state, placement logic, and animation states.
- **`Drawer.Overlay`**: The semi-transparent backdrop covering the screen. It captures tap events to close the drawer.
- **`Drawer.Content`**: The actual sliding panel containing the content. It binds touch events via Main Thread Script (MTS) for the swipe-to-close behavior.

## Data Flow & Gestures (MTS)

1. **State Management**: `Drawer.Root` will be controlled (`show` prop) or uncontrolled (`defaultShow`).
2. **Mounting/Unmounting**: We'll use `@lynx-js/lynx-ui-presence` (or the internal `Presence` component structure used in `Sheet`) so animations can finish before unmounting the DOM elements.
3. **Gesture (MTS)**:
   - `Drawer.Content` will have MTS touch event listeners: `main-thread:bindtouchstart`, `touchmove`, and `touchend`.
   - On `touchstart`, we record the initial X coordinate.
   - On `touchmove`, if the swipe is in the direction of closing (e.g., swiping left for a left-placed drawer), we dynamically translate the `Drawer.Content` node via MTS to follow the finger.
   - On `touchend`, we evaluate the distance and velocity. If the user swiped past a certain threshold (e.g., >30% of drawer width) or swiped quickly, we trigger the close animation and call `onShowChange(false)`. Otherwise, it springs back to fully open.
4. **Animations**: Default animations will use spring physics for a native feel. The user can override them if needed.

## API Usage

```tsx
import { Drawer } from '@lynx-js/lynx-ui-drawer'

export default function App() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button bindtap={() => setIsOpen(true)}>Open Drawer</button>

      <Drawer.Root show={isOpen} onShowChange={setIsOpen} placement='left'>
        <Drawer.Overlay className='bg-black/50' />
        <Drawer.Content className='w-[80vw] bg-white'>
          <text>Drawer Content</text>
        </Drawer.Content>
      </Drawer.Root>
    </>
  )
}
```

## Testing & Quality Assurance

- Must pass `pnpm check:exports`.
- Unit tests to verify the context state changes.
- Gesture physics will be manually tested in an example app.
- Must ensure that the `lynx-ui-drawer` package integrates cleanly in the monorepo structure.
