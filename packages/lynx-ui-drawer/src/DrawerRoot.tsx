// Copyright 2026 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

import { useEffect, useState } from '@lynx-js/react'

import { useMemoizedFn } from '@lynx-js/lynx-ui-common'
import { OverlayView } from '@lynx-js/lynx-ui-overlay'
import { useMotionValueRef } from '@lynx-js/motion/mini'

import { DrawerContext } from './context'
import type { DrawerRootProps } from './types'

export function DrawerRoot(props: DrawerRootProps) {
  const {
    show,
    defaultShow = false,
    placement = 'left',
    forceMount = false,
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

  // Mount logic: we keep it mounted until close animation finishes
  const [mounted, setMounted] = useState(actualShow)

  useEffect(() => {
    if (actualShow) {
      setMounted(true)
    }
  }, [actualShow])

  // Content will call onClose when its close animation finishes, and we can unmount then.
  const handleClose = useMemoizedFn(() => {
    onClose?.()
    setMounted(false)
  })

  if (!mounted && !forceMount) {
    return null
  }

  return (
    <DrawerContext.Provider
      value={{
        show: actualShow,
        placement,
        onShowChange: handleShowChange,
        onOpen,
        onClose: handleClose,
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
          display: (!mounted && forceMount) ? 'none' : 'flex',
        }}
        overlayViewProps={{
          'native-interaction-enabled': true,
          'flatten': false,
        }}
      >
        {children}
      </OverlayView>
    </DrawerContext.Provider>
  )
}
