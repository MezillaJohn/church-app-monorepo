import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Share } from "react-native";

interface ShareOptions {
  message?: string;
  url?: string; // Web URL
  fileUrl?: string; // Remote file URL (image, video, etc.)
  localFile?: string; // Already downloaded local file
  title?: string;
  forceDownload?: boolean; // Always download before sharing
}

export const useShare = () => {
  // --- Download helper ---
  const downloadFile = async (remoteUrl: string): Promise<string | null> => {
    try {
      const fileName =
        remoteUrl.split("/").pop() || `shared-file-${Date.now()}`;
      const fileUri = FileSystem.cacheDirectory + fileName;

      const res = await FileSystem.downloadAsync(remoteUrl, fileUri);
      return res.uri;
    } catch (e) {
      console.warn("File download failed:", e);
      return null;
    }
  };

  // --- Core sharing method ---
  const share = async ({
    message,
    url,
    fileUrl,
    localFile,
    title,
    forceDownload = false,
  }: ShareOptions) => {
    try {
      let fileToShare: string | null = localFile || null;

      // if fileUrl is provided, and Sharing is supported OR forceDownload == true
      if (fileUrl) {
        if (forceDownload || (await Sharing.isAvailableAsync())) {
          fileToShare = await downloadFile(fileUrl);
        }
      }

      // Prioritize sharing a file if exists
      if (fileToShare && (await Sharing.isAvailableAsync())) {
        await Sharing.shareAsync(fileToShare, {
          dialogTitle: title ?? "Share",
        });
        return;
      }

      // Fallback for text / URL shares
      await Share.share({
        title: title ?? "Share",
        message: message || url || "",
      });
    } catch (e) {
      console.warn("Share error:", e);
    }
  };

  return {
    share,
    downloadFile,
  };
};
