// hooks/useLiveEvents.ts
import { EventItem } from "@/services/api/public/types";
import { useMemo } from "react";

export function useLiveEvents(events: EventItem[]) {
  const liveEvent = useMemo(() => {
    return events.find((e) => e.attributes?.is_live === true) || null;
  }, [events]);

  const nextLiveEvent = useMemo(() => {
    for (const e of events) {
      if (e.relationships?.next_live_event) {
        return e.relationships.next_live_event;
      }
    }
    return null;
  }, [events]);

  return { liveEvent, nextLiveEvent };
}
