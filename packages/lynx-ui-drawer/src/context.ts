// Copyright 2026 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

import { createContext, useContext } from '@lynx-js/react'

export interface DrawerContextValue {
  show: boolean
  placement: 'left' | 'right' | 'top' | 'bottom'
  onShowChange: (show: boolean) => void
  onOpen?: () => void
  onClose?: () => void
}

export const DrawerContext = createContext<DrawerContextValue | null>(null)

export function useDrawerContext() {
  const context = useContext(DrawerContext)
  if (!context) {
    throw new Error('Drawer components must be used within a Drawer.Root')
  }
  return context
}
