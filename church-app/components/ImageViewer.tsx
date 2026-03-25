import AppImage from "@/components/AppImage";
import { AppText } from "@/components/AppText";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";
import { Download, Share2, X } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

interface Props {
  visible: boolean;
  image: string; // remote url
  onClose: () => void;
}

export default function ImageViewer({ visible, image, onClose }: Props) {
  const [loading, setLoading] = useState(false);

  // Download image to a local temp file
  const downloadImage = async () => {
    const fileUri = FileSystem.cacheDirectory + "temp_image.jpg";
    const downloaded = await FileSystem.downloadAsync(image, fileUri);
    return downloaded.uri; // local file uri
  };

  // SHARE
  const shareImage = async () => {
    try {
      setLoading(true);

      if (!(await Sharing.isAvailableAsync())) {
        alert("Sharing not supported on this device.");
        return;
      }

      const localUri = await downloadImage();
      await Sharing.shareAsync(localUri);
    } catch (e) {
      alert("Failed to share image");
    } finally {
      setLoading(false);
    }
  };

  // SAVE TO GALLERY
  const saveImage = async () => {
    try {
      setLoading(true);

      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        alert("Permission required to save image.");
        return;
      }

      const localUri = await downloadImage();
      await MediaLibrary.saveToLibraryAsync(localUri);

      alert("Image saved successfully.");
    } catch (err) {
      alert("Failed to save image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        {/* Close */}
        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <X size={26} color="white" />
        </TouchableOpacity>

        {/* Image */}
        <AppImage
          source={{ uri: image }}
          style={styles.image}
          contentFit="contain"
        />

        {/* Buttons */}
        <View style={styles.buttonsRow}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={shareImage}
            disabled={loading}
          >
            <Share2 size={20} color="white" />
            <AppText style={styles.actionText}>Share</AppText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={saveImage}
            disabled={loading}
          >
            <Download size={20} color="white" />
            <AppText style={styles.actionText}>Save</AppText>
          </TouchableOpacity>
        </View>

        {/* Loading */}
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="white" />
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.95)",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: width,
    height: height * 0.65,
  },
  closeBtn: {
    position: "absolute",
    top: 40,
    right: 20,
    padding: 10,
  },
  buttonsRow: {
    position: "absolute",
    bottom: 50,
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },
  actionBtn: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginHorizontal: 10,
    alignItems: "center",
  },
  actionText: {
    color: "white",
    marginLeft: 8,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
});
