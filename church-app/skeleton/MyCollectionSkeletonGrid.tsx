import MyCollectionSkeletonList from "@/skeleton/MyCollectionSkeletonList";
import { moderateSize } from "@/utils/useResponsiveStyle";
import React from "react";
import { FlatList } from "react-native";

const MyCollectionSkeletonGrid = () => {
  const skeletonArray = Array.from({ length: 6 }).map((_, i) => i.toString());

  return (
    <FlatList
      scrollEnabled={false}
      data={skeletonArray}
      keyExtractor={(item) => item}
      numColumns={2}
      renderItem={() => <MyCollectionSkeletonList />}
      contentContainerStyle={{
        paddingHorizontal: moderateSize(10),
        paddingBottom: moderateSize(30),
      }}
      columnWrapperStyle={{ justifyContent: "space-between" }}
    />
  );
};

export default MyCollectionSkeletonGrid;
