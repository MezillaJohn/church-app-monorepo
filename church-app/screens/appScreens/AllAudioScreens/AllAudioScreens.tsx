import AppBackHeader from "@/components/AppBackHeader";
import AppSearchBar from "@/components/AppBarSearch";
import OfflineBanner from "@/components/OfflineBanner";
import { Colors } from "@/constants/theme";
import { useDownloadedSermons } from "@/hooks/useDownloadedSermons";
import AudioSermonCard from "@/screens/appScreens/AllAudioScreens/component/AudioSermonCard";
import CategoryFilter from "@/screens/appScreens/AllVideoScreens/component/CategoryFilter";
import SortDropdown from "@/screens/appScreens/AllVideoScreens/component/SortDropdown";
import { useSermonsQuery } from "@/services/api/sermon";
import AudioSermonSkeletonList from "@/skeleton/AudioSermonSkeletonList";
import { moderateSize } from "@/utils/useResponsiveStyle";
import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo, useState } from "react";
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, View } from "react-native";


const AllAudioScreens = () => {
  const [page, setpage] = useState(1)

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"asc" | "desc">("desc");
  const [categoryId, setCategoryId] = useState("");

  const { data, isLoading, refetch, isFetching } = useSermonsQuery({
    type: "audio",
    search,
    sort,
    category_id: categoryId,
    page
  });

  const lastPage = data?.meta?.last_page


  const { downloadedMap, isLoaded: downloadsLoaded } = useDownloadedSermons();

  const sermons = useMemo(() => {
    const rawSermons = data?.data ?? [];
    return rawSermons.map((s: any) => {
      const id = s._id || s.id;
      const download = downloadedMap[id];
      if (download?.local_audio_uri) {
        return { ...s, audioFileUrl: download.local_audio_uri };
      }
      return s;
    });
  }, [data, downloadedMap]);

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
    <LinearGradient colors={Colors.gradientDeep} style={{ flex: 1 }}>
      <OfflineBanner />
      <View style={styles.container}>
        <AppBackHeader text="Audio Sermon" />
        <AppSearchBar
          placeholder="Search messages, devotionals..."
          value={search}
          onChangeText={setSearch}
          style={{ marginBottom: 10 }}
        />

        <View style={styles.filterWrapper}>
          <CategoryFilter
            onSelect={({ id, name }) => {
              setCategoryId(String(id));
              console.log("Selected category ID:", id);
              console.log("Selected category name:", name);
            }}
          />
          <SortDropdown selectedSort={sort} onSelectSort={setSort} />
        </View>

        {isLoading || !downloadsLoaded ? (
          <AudioSermonSkeletonList count={4} />
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={isFetching} onRefresh={refetch} />
            }
            data={sermons}
            keyExtractor={(item: any) => (item._id || item.id).toString()}
            renderItem={({ item }) => (
              <AudioSermonCard params={params} item={item} />
            )}
            contentContainerStyle={{ marginBottom: moderateSize(100) }}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
          />
        )}
      </View>
    </LinearGradient>
  );
};

export default AllAudioScreens;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: moderateSize(15),
    marginTop: moderateSize(20),
  },
  filterWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: moderateSize(7),
  },
});
