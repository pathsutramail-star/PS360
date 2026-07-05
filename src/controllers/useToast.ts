/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * "Controller" for the global toast/notification banner. Views dispatch a
 * plain `app-notify` DOM event via `notify()` in utils.ts; this hook is the
 * single listener that turns those events into visible state.
 */

import { useEffect, useState } from 'react';

export interface Toast {
  message: string;
  type: 'success' | 'info' | 'error';
  id: number;
}

export function useToast(autoDismissMs = 3000) {
  const [toast, setToast] = useState<Toast | null>(null);

  useEffect(() => {
    const handleNotify = (e: Event) => {
      const customEvent = e as CustomEvent;
      setToast({
        message: customEvent.detail.message,
        type: customEvent.detail.type,
        id: Date.now(),
      });
    };

    window.addEventListener('app-notify', handleNotify);
    return () => window.removeEventListener('app-notify', handleNotify);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), autoDismissMs);
    return () => clearTimeout(timer);
  }, [toast, autoDismissMs]);

  return toast;
}
