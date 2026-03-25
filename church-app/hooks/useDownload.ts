import { useCallback, useEffect, useState } from "react";
import {
  downloadSermon,
  subscribeToProgress,
  DownloadProgress,
  isDownloading as checkIsDownloading,
} from "@/services/download/downloadService";
import {
  getDownloadBySermonId,
  DownloadedSermon,
} from "@/services/database/downloadDatabase";
import type { Sermon } from "@/services/api/sermon/type";

interface UseDownloadResult {
  isDownloaded: boolean;
  isDownloading: boolean;
  progress: number;
  startDownload: () => Promise<void>;
  downloadedInfo: DownloadedSermon | null;
}

export function useDownload(sermon: Sermon): UseDownloadResult {
  const sermonId = sermon._id;

  const [isDownloaded, setIsDownloaded] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadedInfo, setDownloadedInfo] = useState<DownloadedSermon | null>(
    null
  );

  useEffect(() => {
    if (!sermonId) return;
    let mounted = true;

    // Reset state for the new sermon
    setIsDownloaded(false);
    setIsDownloading(false);
    setProgress(0);
    setDownloadedInfo(null);

    const checkDownloadStatus = async () => {
      const download = await getDownloadBySermonId(sermonId);
      if (!mounted) return;

      if (download) {
        setDownloadedInfo(download);
        if (download.download_status === "completed") {
          setIsDownloaded(true);
          setProgress(1);
        } else if (download.download_status === "downloading") {
          setIsDownloading(checkIsDownloading(sermonId));
        }
      }
    };

    checkDownloadStatus();

    const unsubscribe = subscribeToProgress(
      sermonId,
      (progressData: DownloadProgress) => {
        if (!mounted) return;
        setProgress(progressData.progress);
        setIsDownloading(progressData.status === "downloading");
        setIsDownloaded(progressData.status === "completed");

        if (progressData.status === "completed") {
          getDownloadBySermonId(sermonId).then((download) => {
            if (mounted && download) {
              setDownloadedInfo(download);
            }
          });
        }
      }
    );

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [sermonId]);

  const startDownload = useCallback(async () => {
    if (isDownloaded || isDownloading || !sermon) return;

    setIsDownloading(true);
    setProgress(0);

    await downloadSermon(sermon, (progressData) => {
      setProgress(progressData.progress);
      if (progressData.status === "completed") {
        setIsDownloaded(true);
        setIsDownloading(false);
      } else if (progressData.status === "failed") {
        setIsDownloading(false);
      }
    });
  }, [sermon, isDownloaded, isDownloading]);

  return {
    isDownloaded,
    isDownloading,
    progress,
    startDownload,
    downloadedInfo,
  };
}
