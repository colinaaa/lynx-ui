// Copyright 2026 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

import {
  runOnBackground,
  runOnMainThread,
  useEffect,
  useMainThreadRef,
} from '@lynx-js/react'

import { animate, useMotionValueRefEvent } from '@lynx-js/motion/mini'
import type { MainThread } from '@lynx-js/types'
import { clsx } from 'clsx'

import { useDrawerContext } from './context'
import type { DrawerContentProps } from './types'

export function DrawerContent(props: DrawerContentProps) {
  const { className, style, children, dragDisabled = false } = props
  const { show, placement, onShowChange, onOpen, onClose, drawerProgress } =
    useDrawerContext()

  const contentMTRef = useMainThreadRef<MainThread.Element>(null)
  const widthMTRef = useMainThreadRef<number>(0)
  const heightMTRef = useMainThreadRef<number>(0)

  // Track if we are dragging
  const isDraggingMTRef = useMainThreadRef(false)
  const startPosMTRef = useMainThreadRef(0)
  const startProgressMTRef = useMainThreadRef(0)

  // Watch for `show` prop change to trigger open/close animations
  useEffect(() => {
    if (show) {
      runOnMainThread(animateOpen)()
    } else {
      runOnMainThread(animateClose)()
    }
  }, [show])

  function animateOpen() {
    'main thread'
    animate(drawerProgress.current, 1, {
      type: 'spring',
      stiffness: 300,
      damping: 30,
      mass: 1,
    }).then(() => {
      runOnBackground(handleOpenDone)()
    })
  }

  function animateClose() {
    'main thread'
    animate(drawerProgress.current, 0, {
      type: 'spring',
      stiffness: 300,
      damping: 30,
      mass: 1,
    }).then(() => {
      runOnBackground(handleCloseDone)()
    })
  }

  function handleOpenDone() {
    onOpen?.()
  }

  function handleCloseDone() {
    onClose?.()
  }

  useMotionValueRefEvent(drawerProgress, 'change', (v) => {
    'main thread'
    const el = contentMTRef.current
    if (!el) return

    const w = widthMTRef.current
    const h = heightMTRef.current

    let tx = 0
    let ty = 0

    // If size is not ready yet, we can't translate accurately by pixels.
    // But Lynx allows us to apply transform later when layout is ready.
    if (placement === 'left') {
      tx = -w * (1 - v)
    } else if (placement === 'right') {
      tx = w * (1 - v)
    } else if (placement === 'top') {
      ty = -h * (1 - v)
    } else if (placement === 'bottom') {
      ty = h * (1 - v)
    }

    el.setStyleProperties({
      transform: `translate(${tx}px, ${ty}px)`,
    })
  })

  function handleLayoutChange(
    e: { detail: { width: number, height: number } },
  ) {
    'main thread'
    widthMTRef.current = e.detail.width ?? 0
    heightMTRef.current = e.detail.height ?? 0
    // Trigger an update so it snaps to the correct position after layout
    const v = drawerProgress.current.get()
    const el = contentMTRef.current
    if (!el) return

    let tx = 0
    let ty = 0
    if (placement === 'left') tx = -widthMTRef.current * (1 - v)
    else if (placement === 'right') tx = widthMTRef.current * (1 - v)
    else if (placement === 'top') ty = -heightMTRef.current * (1 - v)
    else if (placement === 'bottom') ty = heightMTRef.current * (1 - v)

    el.setStyleProperties({
      transform: `translate(${tx}px, ${ty}px)`,
    })
  }

  function handleTouchStart(e: MainThread.TouchEvent) {
    'main thread'
    if (dragDisabled) return
    if (e.touches.length === 0) return
    isDraggingMTRef.current = true
    startProgressMTRef.current = drawerProgress.current.get()

    if (placement === 'left' || placement === 'right') {
      startPosMTRef.current = e.touches[0].clientX
    } else {
      startPosMTRef.current = e.touches[0].clientY
    }
  }

  function handleTouchMove(e: MainThread.TouchEvent) {
    'main thread'
    if (!isDraggingMTRef.current) return
    if (e.touches.length === 0) return

    let currentPos = 0
    if (placement === 'left' || placement === 'right') {
      currentPos = e.touches[0].clientX
    } else {
      currentPos = e.touches[0].clientY
    }

    const delta = currentPos - startPosMTRef.current

    let progressDelta = 0
    if (placement === 'left') {
      progressDelta = delta / (widthMTRef.current || 1)
    } else if (placement === 'right') {
      progressDelta = -delta / (widthMTRef.current || 1)
    } else if (placement === 'top') {
      progressDelta = delta / (heightMTRef.current || 1)
    } else if (placement === 'bottom') {
      progressDelta = -delta / (heightMTRef.current || 1)
    }

    let newProgress = startProgressMTRef.current + progressDelta
    newProgress = Math.max(0, Math.min(1, newProgress))

    drawerProgress.current.set(newProgress)
  }

  function handleTouchEnd() {
    'main thread'
    if (!isDraggingMTRef.current) return
    isDraggingMTRef.current = false

    const progress = drawerProgress.current.get()
    // Snap threshold: 0.7
    if (progress < 0.7) {
      animate(drawerProgress.current, 0, {
        type: 'spring',
        stiffness: 300,
        damping: 30,
        mass: 1,
      }).then(() => {
        runOnBackground(onShowChange)(false)
        runOnBackground(handleCloseDone)()
      })
    } else {
      animate(drawerProgress.current, 1, {
        type: 'spring',
        stiffness: 300,
        damping: 30,
        mass: 1,
      })
    }
  }

  // Base absolute positioning depending on placement
  let placementStyles: Record<string, string | number> = {}
  if (placement === 'left') {
    placementStyles = { top: 0, left: 0, bottom: 0 }
  } else if (placement === 'right') {
    placementStyles = { top: 0, right: 0, bottom: 0 }
  } else if (placement === 'top') {
    placementStyles = { top: 0, left: 0, right: 0 }
  } else if (placement === 'bottom') {
    placementStyles = { bottom: 0, left: 0, right: 0 }
  }

  return (
    <view
      main-thread:ref={contentMTRef}
      className={clsx('lynx-ui-drawer-content', className)}
      style={{
        position: 'absolute',
        ...placementStyles,
        ...style,
      }}
      event-through={false}
      main-thread:bindlayoutchange={handleLayoutChange}
      main-thread:bindtouchstart={handleTouchStart}
      main-thread:bindtouchmove={handleTouchMove}
      main-thread:bindtouchend={handleTouchEnd}
      main-thread:bindtouchcancel={handleTouchEnd}
    >
      {children}
    </view>
  )
}
