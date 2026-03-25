import { Colors } from "@/constants/theme";
import StoreList from "@/screens/appScreens/Library/component/StoreList";
import { useBooksQuery } from "@/services/api/library";
import StoreListSkeleton from "@/skeleton/StoreListSkeleton";
import { moderateSize } from "@/utils/useResponsiveStyle";
import React, { useState } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";

const WholewordList = () => {
  const [page, setpage] = useState(1)

  const { data: store, isLoading } = useBooksQuery({ page });

  const lastPage = store?.meta?.last_page


  if (isLoading) {
    return (
      <View>
        {Array.from({ length: 6 }).map((_, index) => (
          <StoreListSkeleton key={index} />
        ))}
      </View>
    );
  }

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

  console.log(page, 'page')
  console.log(store?.data?.length, 'store')

  return (

    <FlatList
      data={store?.data || []}
      keyExtractor={(item) => item?.id?.toString()}
      renderItem={({ item }) => <StoreList item={item} />}
      contentContainerStyle={{
        paddingBottom: moderateSize(100),
      }}
      showsVerticalScrollIndicator={false}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
    />
  );
};

export default WholewordList;
