// hooks/useLiveEvents.ts
import { EventItem } from "@/services/api/public/types";
import { useMemo } from "react";

export function useLiveEvents(events: any[]) {
  const liveEvent = useMemo(() => {
    return events.find((e: any) => e.isLive === true) || null;
  }, [events]);

  const nextLiveEvent = useMemo(() => {
    // Node backend doesn't nest next_live_event in relationships
    // Future: fetch next upcoming event separately if needed
    return null;
  }, [events]);

  return { liveEvent, nextLiveEvent };
}
