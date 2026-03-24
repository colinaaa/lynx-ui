// Copyright 2026 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

import { root, useState } from '@lynx-js/react'

import { DrawerContent, DrawerOverlay, DrawerRoot } from '@lynx-js/lynx-ui'

export function App() {
  const [show, setShow] = useState(false)

  return (
    <view
      style={{
        flex: 1,
        padding: '20px',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <text
        bindtap={() => setShow(true)}
        style={{
          padding: '10px',
          backgroundColor: '#e0e0e0',
          borderRadius: '4px',
        }}
      >
        Open Drawer
      </text>

      <DrawerRoot show={show} onShowChange={setShow} placement='left'>
        <DrawerOverlay
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        />
        <DrawerContent
          style={{
            width: '80%',
            backgroundColor: 'white',
            boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
            padding: '20px',
          }}
        >
          <text style={{ fontSize: '20px', fontWeight: 'bold' }}>
            Drawer Content
          </text>
          <text style={{ marginTop: '20px' }}>Swipe left to close!</text>
        </DrawerContent>
      </DrawerRoot>
    </view>
  )
}

root.render(<App />)
