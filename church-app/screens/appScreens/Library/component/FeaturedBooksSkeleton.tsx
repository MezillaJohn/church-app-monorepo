import React from "react";
import { Dimensions, FlatList, StyleSheet, View } from "react-native";
import { moderateSize } from "@/utils/useResponsiveStyle";
import SkeletonPlaceholder from "@/skeleton/SkeletonPlaceholder";

const { width } = Dimensions.get("window");

const FeaturedBooksSkeleton = () => {
  const fakeItems = Array(3).fill(null); // 3 slides

  return (
    <View>
      <FlatList
        data={fakeItems}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => i.toString()}
        renderItem={() => (
          <View style={styles.slide}>
            <SkeletonPlaceholder
              width={"100%"}
              height={"100%"}
              borderRadius={12}
            />
          </View>
        )}
      />

      {/* Pagination dots skeleton */}
      <View style={styles.dotsWrapper}>
        {fakeItems.map((_, i) => (
          <SkeletonPlaceholder
            key={i}
            width={moderateSize(8)}
            height={moderateSize(8)}
            borderRadius={50}
            style={styles.dot}
          />
        ))}
      </View>
    </View>
  );
};

export default FeaturedBooksSkeleton;

const styles = StyleSheet.create({
  slide: {
    width: width,
    height: moderateSize(240),
    paddingHorizontal: 0,
  },
  dotsWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: moderateSize(10),
    marginBottom: moderateSize(5),
  },
  dot: {
    marginHorizontal: moderateSize(4),
  },
});
