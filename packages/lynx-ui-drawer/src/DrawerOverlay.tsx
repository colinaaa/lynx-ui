// Copyright 2026 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

import { runOnBackground, useMainThreadRef } from '@lynx-js/react'

import { useMemoizedFn } from '@lynx-js/lynx-ui-common'
import { useMotionValueRefEvent } from '@lynx-js/motion/mini'
import type { MainThread } from '@lynx-js/types'
import { clsx } from 'clsx'

import { useDrawerContext } from './context'
import type { DrawerOverlayProps } from './types'

export function DrawerOverlay(props: DrawerOverlayProps) {
  const { className, style, onTap } = props
  const { drawerProgress, onShowChange } = useDrawerContext()
  const overlayMTRef = useMainThreadRef<MainThread.Element>(null)

  useMotionValueRefEvent(drawerProgress, 'change', (v) => {
    'main thread'
    overlayMTRef.current?.setStyleProperties({
      opacity: String(v),
    })
  })

  const handleClick = useMemoizedFn(() => {
    onTap?.()
    onShowChange(false)
  })

  function handleClickMT() {
    'main thread'
    runOnBackground(handleClick)()
  }

  return (
    <view
      main-thread:ref={overlayMTRef}
      className={clsx('lynx-ui-drawer-overlay', className)}
      main-thread:bindtap={handleClickMT}
      event-through={false}
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        opacity: 0,
        ...style,
      }}
    />
  )
}
