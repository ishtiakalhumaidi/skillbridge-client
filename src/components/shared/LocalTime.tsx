"use client";

import { formatInTimeZone } from "date-fns-tz";
import { useEffect, useState } from "react";

export function LocalTime({ dateStr }: { dateStr: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
  
    setMounted(true);
  }, []);

  if (!mounted) {
    return <span className="opacity-0">...</span>; 
  }

  try {
    const date = new Date(dateStr);
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const formatted = formatInTimeZone(date, userTimeZone, "h:mm a");

    return <span>{formatted}</span>;
  } catch (e) {
    return <span>Invalid Time</span>;
  }
}