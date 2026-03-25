// src/screens/appScreens/Library/component/StoreListSkeleton.tsx
import { Colors } from "@/constants/theme";
import SkeletonPlaceholder from "@/skeleton/SkeletonPlaceholder";
import { moderateSize } from "@/utils/useResponsiveStyle";
import React from "react";
import { StyleSheet, View } from "react-native";

const StoreListSkeleton = () => {
  return (
    <View style={styles.itemContainer}>
      {/* Book Cover */}
      <SkeletonPlaceholder
        width={moderateSize(80)}
        height={moderateSize(100)}
        borderRadius={12}
        style={styles.image}
      />

      {/* Text Content */}
      <View style={styles.textContent}>
        <SkeletonPlaceholder
          width="70%"
          height={moderateSize(14)}
          borderRadius={6}
          style={{ marginBottom: moderateSize(6) }}
        />
        <SkeletonPlaceholder
          width="50%"
          height={moderateSize(12)}
          borderRadius={6}
          style={{ marginBottom: moderateSize(4) }}
        />
        <SkeletonPlaceholder
          width="40%"
          height={moderateSize(10)}
          borderRadius={6}
        />
      </View>
    </View>
  );
};

export default StoreListSkeleton;

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    backgroundColor: Colors.textInputGrey,
    borderRadius: 16,
    padding: moderateSize(10),
    marginBottom: moderateSize(12),
  },
  image: {
    marginRight: moderateSize(10),
  },
  textContent: {
    flex: 1,
    justifyContent: "center",
  },
});
