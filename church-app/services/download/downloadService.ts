import * as FileSystem from "expo-file-system";
import {
  insertDownload,
  updateDownloadStatus,
  getDownloadBySermonId,
  deleteDownload as deleteFromDb,
} from "@/services/database/downloadDatabase";
import type { Sermon } from "@/services/api/sermon/type";

export type DownloadProgress = {
  sermonId: string;
  progress: number;
  status: "downloading" | "completed" | "failed";
};

type ProgressCallback = (progress: DownloadProgress) => void;

const activeDownloads: Map<
  string,
  FileSystem.DownloadResumable
> = new Map();

const progressListeners: Map<string, Set<ProgressCallback>> = new Map();

export function subscribeToProgress(
  sermonId: string,
  callback: ProgressCallback
): () => void {
  if (!progressListeners.has(sermonId)) {
    progressListeners.set(sermonId, new Set());
  }
  progressListeners.get(sermonId)!.add(callback);

  return () => {
    progressListeners.get(sermonId)?.delete(callback);
  };
}

function notifyProgress(progress: DownloadProgress) {
  const listeners = progressListeners.get(progress.sermonId);
  if (listeners) {
    listeners.forEach((callback) => callback(progress));
  }
}

export async function downloadSermon(
  sermon: Sermon,
  onProgress?: ProgressCallback
): Promise<string | null> {
  const sermonId = sermon._id;
  const { title, speaker, duration, thumbnailUrl, audioFileUrl } = sermon;

  if (!audioFileUrl) {
    console.error("No audio URL for sermon:", sermonId);
    return null;
  }

  const existingDownload = await getDownloadBySermonId(sermonId);
  if (existingDownload?.download_status === "completed") {
    return existingDownload.local_audio_uri;
  }

  if (activeDownloads.has(sermonId)) {
    return null;
  }

  const fileName = `sermon_${sermonId}_${Date.now()}.mp3`;
  const localUri = `${FileSystem.documentDirectory}sermons/${fileName}`;

  const dirInfo = await FileSystem.getInfoAsync(
    `${FileSystem.documentDirectory}sermons`
  );
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(
      `${FileSystem.documentDirectory}sermons`,
      { intermediates: true }
    );
  }

  await insertDownload({
    sermon_id: sermonId,
    title,
    speaker,
    duration,
    thumbnail_url: thumbnailUrl,
    remote_audio_url: audioFileUrl,
    local_audio_uri: localUri,
    download_status: "downloading",
    downloaded_at: new Date().toISOString(),
    file_size: null,
    sermon_json: JSON.stringify(sermon),
  });

  const progressCallback: FileSystem.DownloadProgressCallback = (
    downloadProgress
  ) => {
    const progress =
      downloadProgress.totalBytesWritten /
      downloadProgress.totalBytesExpectedToWrite;
    const progressData: DownloadProgress = {
      sermonId,
      progress,
      status: "downloading",
    };
    notifyProgress(progressData);
    onProgress?.(progressData);
  };

  const downloadResumable = FileSystem.createDownloadResumable(
    audioFileUrl,
    localUri,
    {},
    progressCallback
  );

  activeDownloads.set(sermonId, downloadResumable);

  try {
    const result = await downloadResumable.downloadAsync();

    if (result?.uri) {
      const fileInfo = await FileSystem.getInfoAsync(result.uri);
      const fileSize = fileInfo.exists ? (fileInfo as any).size : null;

      await updateDownloadStatus(sermonId, "completed", result.uri, fileSize);

      const completedProgress: DownloadProgress = {
        sermonId,
        progress: 1,
        status: "completed",
      };
      notifyProgress(completedProgress);
      onProgress?.(completedProgress);

      activeDownloads.delete(sermonId);
      return result.uri;
    }

    throw new Error("Download failed");
  } catch (error) {
    console.error("Download error:", error);
    await updateDownloadStatus(sermonId, "failed");

    const failedProgress: DownloadProgress = {
      sermonId,
      progress: 0,
      status: "failed",
    };
    notifyProgress(failedProgress);
    onProgress?.(failedProgress);

    activeDownloads.delete(sermonId);
    return null;
  }
}

export async function cancelDownload(sermonId: string): Promise<void> {
  const downloadResumable = activeDownloads.get(sermonId);
  if (downloadResumable) {
    await downloadResumable.pauseAsync();
    activeDownloads.delete(sermonId);
  }
  await updateDownloadStatus(sermonId, "failed");
}

export async function deleteDownloadedSermon(sermonId: string): Promise<void> {
  const download = await getDownloadBySermonId(sermonId);
  if (download?.local_audio_uri) {
    try {
      await FileSystem.deleteAsync(download.local_audio_uri, {
        idempotent: true,
      });
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  }
  await deleteFromDb(sermonId);
}

export function isDownloading(sermonId: string): boolean {
  return activeDownloads.has(sermonId);
}
