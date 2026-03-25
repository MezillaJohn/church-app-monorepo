import SkeletonPlaceholder from "@/skeleton/SkeletonPlaceholder";
import { moderateSize } from "@/utils/useResponsiveStyle";
import React from "react";
import { StyleSheet, View } from "react-native";

const MyCollectionSkeletonList = () => {
  return (
    <View style={styles.card}>
      <SkeletonPlaceholder width="100%" height="100%" borderRadius={16} />
      <View style={styles.textOverlay}>
        <SkeletonPlaceholder
          width={moderateSize(80)}
          height={moderateSize(10)}
          borderRadius={4}
        />
        <View style={{ marginTop: moderateSize(6) }}>
          <SkeletonPlaceholder
            width={moderateSize(50)}
            height={moderateSize(8)}
            borderRadius={4}
          />
        </View>
      </View>
    </View>
  );
};

export default MyCollectionSkeletonList;

const styles = StyleSheet.create({
  card: {
    width: "48%",
    height: moderateSize(180),
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: moderateSize(12),
    backgroundColor: "#3a3a3a",
  },
  textOverlay: {
    position: "absolute",
    bottom: 10,
    left: 10,
  },
});
