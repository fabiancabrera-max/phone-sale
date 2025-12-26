'use client';

import { useEffect } from 'react';

interface DebugLoggerProps {
  data: any;
  label?: string;
}

/**
 * Utility component to log server-side data to the client-side console.
 * Use this when you need to inspect data in Server Components.
 */
export default function DebugLogger({
  data,
  label = 'Server Data',
}: DebugLoggerProps) {
  useEffect(() => {
    console.group(`🔍 Debug: ${label}`);
    console.log(data);
    console.groupEnd();
  }, [data, label]);

  return null; // Renders nothing visibly
}
