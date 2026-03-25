# @lynx-js/lynx-ui-drawer

A headless, accessible, and animated drawer component for ReactLynx with native-like swipe-to-close gestures powered by Main Thread Script (MTS) and spring physics.

## Installation

Usually, this package is used via the aggregate `@lynx-js/lynx-ui` package:

```bash
pnpm add @lynx-js/lynx-ui
```

## Usage

The Drawer uses a compound component architecture. `DrawerRoot` manages the state and presence, while `DrawerOverlay` handles the background dimming and click-to-close, and `DrawerContent` represents the sliding panel itself.

```tsx
import { useState } from '@lynx-js/react'
import { DrawerRoot, DrawerOverlay, DrawerContent } from '@lynx-js/lynx-ui'

export function App() {
  const [show, setShow] = useState(false)

  return (
    <view>
      <text bindtap={() => setShow(true)}>Open Drawer</text>

      <DrawerRoot show={show} onShowChange={setShow} placement='left'>
        <DrawerOverlay
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        />
        <DrawerContent
          style={{
            width: '80%',
            backgroundColor: 'white',
            padding: '20px',
          }}
        >
          <text>Drawer Content</text>
          <text>Swipe left to close!</text>
        </DrawerContent>
      </DrawerRoot>
    </view>
  )
}
```

## API

### `DrawerRoot`

Manages the Drawer's open state, handles mount/unmount animations via Presence, and provides context to its children.

| Prop           | Type                                     | Default  | Description                                        |
| :------------- | :--------------------------------------- | :------- | :------------------------------------------------- |
| `show`         | `boolean`                                | `false`  | The controlled open state of the drawer.           |
| `defaultShow`  | `boolean`                                | `false`  | The default open state (uncontrolled).             |
| `onShowChange` | `(show: boolean) => void`                | -        | Callback fired when the drawer open state changes. |
| `placement`    | `'left' \| 'right' \| 'top' \| 'bottom'` | `'left'` | The edge of the screen the drawer slides in from.  |
| `onOpen`       | `() => void`                             | -        | Callback fired when the enter animation finishes.  |
| `onClose`      | `() => void`                             | -        | Callback fired when the exit animation finishes.   |

### `DrawerOverlay`

The dimmed background behind the drawer. Automatically handles closing the drawer when tapped.

| Prop        | Type            | Default | Description                                 |
| :---------- | :-------------- | :------ | :------------------------------------------ |
| `className` | `string`        | -       | Additional CSS class name.                  |
| `style`     | `CSSProperties` | -       | Additional inline styles.                   |
| `onTap`     | `() => void`    | -       | Callback fired when the overlay is clicked. |

### `DrawerContent`

The sliding panel containing the drawer's content. Automatically handles drag-to-close gestures.

| Prop           | Type            | Default | Description                                     |
| :------------- | :-------------- | :------ | :---------------------------------------------- |
| `className`    | `string`        | -       | Additional CSS class name.                      |
| `style`        | `CSSProperties` | -       | Additional inline styles.                       |
| `dragDisabled` | `boolean`       | `false` | If `true`, disables the swipe-to-close gesture. |
