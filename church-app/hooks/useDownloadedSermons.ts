import { useCallback, useEffect, useState } from "react";
import {
  getAllDownloads,
  DownloadedSermon,
} from "@/services/database/downloadDatabase";
import type { Sermon } from "@/services/api/sermon/type";

interface DownloadedSermonsMap {
  [sermonId: string]: DownloadedSermon;
}

export function useDownloadedSermons() {
  const [downloadedMap, setDownloadedMap] = useState<DownloadedSermonsMap>({});
  const [isLoaded, setIsLoaded] = useState(false);

  const loadDownloads = useCallback(async () => {
    try {
      const downloads = await getAllDownloads();
      const map: DownloadedSermonsMap = {};
      downloads.forEach((download) => {
        map[download.sermon_id] = download;
      });
      setDownloadedMap(map);
    } catch (error) {
      console.error("Error loading downloaded sermons:", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    loadDownloads();
  }, [loadDownloads]);

  const isDownloaded = useCallback(
    (sermonId: string): boolean => {
      return !!downloadedMap[sermonId];
    },
    [downloadedMap]
  );

  const getLocalUri = useCallback(
    (sermonId: string): string | null => {
      return downloadedMap[sermonId]?.local_audio_uri ?? null;
    },
    [downloadedMap]
  );

  const enrichSermonWithLocalUri = useCallback(
    (sermon: Sermon): Sermon => {
      const download = downloadedMap[sermon._id];
      if (download?.local_audio_uri) {
        return { ...sermon, audioFileUrl: download.local_audio_uri };
      }
      return sermon;
    },
    [downloadedMap]
  );

  const enrichSermonsWithLocalUri = useCallback(
    (sermons: Sermon[]): Sermon[] => {
      return sermons.map(enrichSermonWithLocalUri);
    },
    [enrichSermonWithLocalUri]
  );

  return {
    downloadedMap,
    isLoaded,
    isDownloaded,
    getLocalUri,
    enrichSermonWithLocalUri,
    enrichSermonsWithLocalUri,
    refresh: loadDownloads,
  };
}
