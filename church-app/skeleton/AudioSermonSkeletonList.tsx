import { Colors } from "@/constants/theme";
import SkeletonPlaceholder from "@/skeleton/SkeletonPlaceholder";
import { moderateSize } from "@/utils/useResponsiveStyle";
import React from "react";
import { StyleSheet, View } from "react-native";

const AudioSermonSkeletonList = ({ count = 4 }: { count?: number }) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} style={styles.row}>
          {/* 🎵 Thumbnail */}
          <SkeletonPlaceholder
            width={70}
            height={70}
            borderRadius={8}
            style={{ marginRight: moderateSize(12) }}
          />

          {/* 📄 Text + Buttons */}
          <View style={{ flex: 1 }}>
            <SkeletonPlaceholder width="70%" height={14} />

            <View style={styles.metaRow}>
              <SkeletonPlaceholder width="40%" height={10} />
              <SkeletonPlaceholder width="20%" height={10} />
            </View>

            <View style={styles.actionRow}>
              <SkeletonPlaceholder width={60} height={26} borderRadius={6} />
              <View style={styles.iconRow}>
                <SkeletonPlaceholder width={16} height={16} borderRadius={4} />
                <SkeletonPlaceholder width={16} height={16} borderRadius={4} />
              </View>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

export default AudioSermonSkeletonList;

const styles = StyleSheet.create({
  container: {
    marginTop: moderateSize(5),
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    paddingVertical: moderateSize(16),
    borderBottomColor: Colors.border,
    borderBottomWidth: 1,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: moderateSize(10),
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: moderateSize(14),
  },
  iconRow: {
    flexDirection: "row",
    columnGap: 16,
  },
});
