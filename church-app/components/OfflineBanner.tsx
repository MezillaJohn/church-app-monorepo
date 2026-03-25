import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { AppText } from "@/components/AppText";
import { Colors, Fonts } from "@/constants/theme";
import { WifiOff } from "lucide-react-native";
import { useRouter } from "expo-router";
import { moderateSize } from "@/utils/useResponsiveStyle";
import { useIsOffline } from "@/context/NetworkContext";

interface OfflineBannerProps {
  showGoToDownloads?: boolean;
}

export default function OfflineBanner({
  showGoToDownloads = true,
}: OfflineBannerProps) {
  const isOffline = useIsOffline();
  const router = useRouter();

  if (!isOffline) return null;

  const handleGoToDownloads = () => {
    router.push("/(tabs)/profile/downloads");
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <WifiOff size={18} color={Colors.white} />
        <AppText style={styles.text}>No internet connection</AppText>
      </View>
      {showGoToDownloads && (
        <TouchableOpacity
          style={styles.button}
          onPress={handleGoToDownloads}
          activeOpacity={0.8}
        >
          <AppText style={styles.buttonText}>Go to Downloads</AppText>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.red,
    paddingVertical: moderateSize(10),
    paddingHorizontal: moderateSize(16),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 8,
  },
  text: {
    color: Colors.white,
    fontFamily: Fonts.Medium,
    fontSize: moderateSize(12),
  },
  button: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: moderateSize(12),
    paddingVertical: moderateSize(6),
    borderRadius: 6,
  },
  buttonText: {
    color: Colors.white,
    fontFamily: Fonts.SemiBold,
    fontSize: moderateSize(11),
  },
});
