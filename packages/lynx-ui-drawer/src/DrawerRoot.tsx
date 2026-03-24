// Copyright 2026 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

import { useState } from '@lynx-js/react'

import { useMemoizedFn } from '@lynx-js/lynx-ui-common'
import { OverlayView } from '@lynx-js/lynx-ui-overlay'
import { usePresenceGroup } from '@lynx-js/lynx-ui-presence'
import { useMotionValueRef } from '@lynx-js/motion/mini'

import { DrawerContext } from './context'
import type { DrawerRootProps } from './types'

export function DrawerRoot(props: DrawerRootProps) {
  const {
    show,
    defaultShow = false,
    placement = 'left',
    onShowChange,
    onOpen,
    onClose,
    children,
  } = props

  const isControlled = show !== undefined
  const [uncontrolledShow, setUncontrolledShow] = useState(defaultShow)
  const actualShow = isControlled ? show : uncontrolledShow

  const handleShowChange = useMemoizedFn((newShow: boolean) => {
    if (newShow === actualShow) return
    onShowChange?.(newShow)
    if (!isControlled) {
      setUncontrolledShow(newShow)
    }
  })

  const drawerProgress = useMotionValueRef(0)

  const { mountView, renderChildren } = usePresenceGroup({
    show: actualShow,
    forceMount: false,
    children,
    onOpen,
    onClose,
  })

  if (!mountView) {
    return null
  }

  return (
    <DrawerContext.Provider
      value={{
        show: actualShow,
        placement,
        onShowChange: handleShowChange,
        onOpen,
        onClose,
        drawerProgress,
      }}
    >
      <OverlayView
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
        }}
        overlayViewProps={{
          'native-interaction-enabled': true,
          'flatten': false,
        }}
      >
        {renderChildren}
      </OverlayView>
    </DrawerContext.Provider>
  )
}
