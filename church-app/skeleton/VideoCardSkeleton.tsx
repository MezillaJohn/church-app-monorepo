import SkeletonPlaceholder from "@/skeleton/SkeletonPlaceholder";
import { moderateSize } from "@/utils/useResponsiveStyle";
import React from "react";
import { StyleSheet, View } from "react-native";

const VideoSermonCardSkeleton = ({ cardWidth = moderateSize(170) }) => {
  return (
    <View style={[styles.card, { width: cardWidth }]}>
      <SkeletonPlaceholder height={120} borderRadius={12} />
      <View style={styles.textContainer}>
        <SkeletonPlaceholder width="80%" height={12} borderRadius={6} />
        <SkeletonPlaceholder
          width="90%"
          height={10}
          borderRadius={6}
          style={{ marginTop: 6 }}
        />
        <SkeletonPlaceholder
          width="60%"
          height={10}
          borderRadius={6}
          style={{ marginTop: 6 }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1c1c1e",
    borderRadius: 14,
    marginBottom: moderateSize(10),
    marginRight: 15,
  },
  textContainer: {
    padding: moderateSize(10),
  },
});

export default VideoSermonCardSkeleton;
