/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * "Controller" for in-panel navigation: owns the current View and keeps it
 * valid whenever the role changes (e.g. right after login).
 */

import { useEffect, useState } from 'react';
import { Role, View } from '../models/types';
import { DEFAULT_VIEW, VIEWS_BY_ROLE } from '../models/navigation';

export function useNavigation(role: Role) {
  const [currentView, setCurrentView] = useState<View>(DEFAULT_VIEW[role]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!VIEWS_BY_ROLE[role].includes(currentView)) {
      setCurrentView(DEFAULT_VIEW[role]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  return { currentView, setCurrentView, sidebarOpen, setSidebarOpen };
}
