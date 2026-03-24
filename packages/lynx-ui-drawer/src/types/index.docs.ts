// Copyright 2026 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

import type { ReactNode } from '@lynx-js/react'

import type { CSSProperties } from '@lynx-js/types'

export interface DrawerRootProps {
  /**
   * The controlled open state of the drawer.
   */
  show?: boolean

  /**
   * The default open state of the drawer.
   */
  defaultShow?: boolean

  /**
   * Called when the drawer open state changes.
   */
  onShowChange?: (show: boolean) => void

  /**
   * Placement of the drawer.
   * @default 'left'
   */
  placement?: 'left' | 'right' | 'top' | 'bottom'

  /**
   * Called when the drawer finishes entering.
   */
  onOpen?: () => void

  /**
   * Called when the drawer finishes exiting.
   */
  onClose?: () => void

  /**
   * The content of the drawer.
   */
  children?: ReactNode
}

export interface DrawerOverlayProps {
  /**
   * Additional CSS class name.
   */
  className?: string
  /**
   * Additional styles.
   */
  style?: CSSProperties
  /**
   * Callback when the overlay is clicked.
   */
  onTap?: () => void
}

export interface DrawerContentProps {
  /**
   * The children of the drawer content.
   */
  children?: ReactNode
  /**
   * Additional CSS class name.
   */
  className?: string
  /**
   * Additional styles.
   */
  style?: CSSProperties
  /**
   * Disable the swipe-to-close gesture.
   */
  dragDisabled?: boolean
}
