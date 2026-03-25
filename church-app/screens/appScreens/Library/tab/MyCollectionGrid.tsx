import { Colors } from "@/constants/theme";
import MyCollectionEmptyState from "@/screens/appScreens/Library/component/MyCollectionEmptyState";
import MyCollectionList from "@/screens/appScreens/Library/component/MyCollectionList";
import { useMyBooksQuery } from "@/services/api/library";
import MyCollectionSkeletonGrid from "@/skeleton/MyCollectionSkeletonGrid";
import { moderateSize } from "@/utils/useResponsiveStyle";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";

const MyCollectionGrid = () => {
  const [page, setpage] = useState(1)

  const { data, isLoading, refetch } = useMyBooksQuery({ page });
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const lastPage = data?.meta?.last_page

  const books = data?.data || [];

  console.log(books?.length, "books");


  if (isLoading) return <MyCollectionSkeletonGrid />;

  if (books.length === 0) return <MyCollectionEmptyState />;

  const handleLoadMore = () => {
    if (lastPage && page < lastPage) {
      setpage((prev) => prev + 1)
    }
  }

  const renderFooter = () => {
    if (lastPage && page < lastPage) {
      return (
        <View style={{ paddingTop: moderateSize(10), paddingBottom: moderateSize(50) }}>
          <ActivityIndicator size="small" color={Colors.primary} />
        </View>
      )
    }
  }



  return (
    <View style={{}}>
      <FlatList
        scrollEnabled={true}
        data={books}
        keyExtractor={(item) => item.id?.toString()}
        numColumns={2}
        renderItem={({ item }) => <MyCollectionList item={item} />}
        contentContainerStyle={{
          paddingHorizontal: moderateSize(10),
          paddingBottom: moderateSize(30),
        }}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}

      />
    </View>
  );
};

export default MyCollectionGrid;
