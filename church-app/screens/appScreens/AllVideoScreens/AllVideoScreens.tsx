import AppBackHeader from "@/components/AppBackHeader";
import AppSearchBar from "@/components/AppBarSearch";
import { Colors } from "@/constants/theme";
import CategoryFilter from "@/screens/appScreens/AllVideoScreens/component/CategoryFilter";
import SortDropdown from "@/screens/appScreens/AllVideoScreens/component/SortDropdown";
import VideoSermonCard from "@/screens/appScreens/Home/component/VideoSermonCard";
import { useSermonsQuery } from "@/services/api/sermon";
import VideoSermonCardSkeleton from "@/skeleton/VideoCardSkeleton";
import { moderateSize } from "@/utils/useResponsiveStyle";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";



const { width } = Dimensions.get("window");
const horizontalPadding = moderateSize(15);
const spacingBetweenCards = moderateSize(10);
const cardWidth = (width - horizontalPadding * 2 - spacingBetweenCards) / 2;

const AllVideoScreens = () => {
  const [page, setpage] = useState(1)

  const router = useRouter();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"asc" | "desc">("desc");
  const [categoryId, setCategoryId] = useState("");

  const { data, isLoading, refetch, isFetching } = useSermonsQuery({
    type: "video",
    search,
    sort,
    category_id: categoryId,
    page
  });

  const sermons = data?.data ?? [];

  const lastPage = data?.meta?.totalPages

  const params = {
    search,
    sort,
    category_id: categoryId,
  };

  const handleLoadMore = () => {
    if (lastPage && page < lastPage) {
      setpage((prev) => prev + 1)
    }
  }

  const renderFooter = () => {
    if (lastPage && page < lastPage) {
      return (
        <View style={{ paddingVertical: moderateSize(20) }}>
          <ActivityIndicator size="small" color={Colors.primary} />
        </View>
      )
    }
  }


  return (
    <SafeAreaView style={styles.container}>
      <AppBackHeader text="Video Sermons" />

      <AppSearchBar
        placeholder="Search messages, devotionals..."
        value={search}
        onChangeText={setSearch}
        style={{ marginBottom: 10 }}
      />

      <View style={styles.filterWrapper}>
        <CategoryFilter
          onSelect={({ id }) => {
            setCategoryId(id ? String(id) : "");
          }}
        />
        <SortDropdown selectedSort={sort} onSelectSort={setSort} />
      </View>

      {isLoading ? (
        <FlatList
          data={Array(6).fill(null)}
          numColumns={2}
          keyExtractor={(_, i) => i.toString()}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          renderItem={() => <VideoSermonCardSkeleton cardWidth={cardWidth} />}
        />
      ) : (
        <FlatList
          data={sermons}
          keyExtractor={(item) => item?._id?.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={isFetching} onRefresh={refetch} />
          }
          renderItem={({ item }) => (
            <VideoSermonCard
              page={page}
              params={params}
              item={item}
              cardWidth={cardWidth}
              onPress={() =>
                router.push({
                  pathname: "/stack/videoDetailsScreen",
                  params: {
                    videoUrl: item?.youtubeVideoUrl,
                    videoId: item?.youtubeVideoId,

                    title: item?.title,
                    preacher: item?.speaker,
                    duration: String(item?.duration ?? ""),
                    description: item?.description,
                  },
                })
              }
            />
          )}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

export default AllVideoScreens;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
    paddingHorizontal: horizontalPadding,
    paddingTop: moderateSize(10),
  },
  row: {
    justifyContent: "space-between",
    marginBottom: spacingBetweenCards,
  },
  listContent: {
    paddingBottom: moderateSize(60),
  },

  filterWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: moderateSize(10),
  },
});
