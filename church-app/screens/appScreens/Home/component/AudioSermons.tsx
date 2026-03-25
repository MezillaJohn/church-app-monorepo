import SectionHeader from "@/components/SectionHeader";
import { useDownloadedSermons } from "@/hooks/useDownloadedSermons";
import AudioSermonCard from "@/screens/appScreens/AllAudioScreens/component/AudioSermonCard";
import { useGetFeaturedSermonQuery } from "@/services/api/sermon";
import AudioSermonSkeletonList from "@/skeleton/AudioSermonSkeletonList";
import { moderateSize } from "@/utils/useResponsiveStyle";
import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";

const AudioSermons = () => {
  const { data: featuredSermon, isLoading } = useGetFeaturedSermonQuery({
    type: "audio",
  });

  const sermon = featuredSermon?.data;

  const { downloadedMap, isLoaded: downloadsLoaded } = useDownloadedSermons();

  const sermons = useMemo(() => {
    return sermon?.map((s: any) => {
      const id = s._id || s.id;
      const download = downloadedMap[id];
      if (download?.local_audio_uri) {
        if (s.attributes) {
          return {
            ...s,
            attributes: {
              ...s.attributes,
              audio_file_url: download.local_audio_uri,
            },
          };
        }
        return {
          ...s,
          audio_file_url: download.local_audio_uri,
          audioFileUrl: download.local_audio_uri,
        };
      }
      return s;
    });
  }, [sermon, downloadedMap]);

  const params: any = {
    search: "",
    sort: "desc",
    category_id: "",
  };

  return (
    <View style={styles.container}>
      <SectionHeader
        text="Audio Sermons"
        rightText="View all"
        route="/stack/allAudioSermons"
      />
      {isLoading || !downloadsLoaded ? (
        <AudioSermonSkeletonList count={4} />
      ) : (
        <View>
          {sermons?.map((item: any) => (
            <AudioSermonCard
              key={(item._id || item.id).toString()}
              params={params}
              item={item}
            />
          ))}
        </View>
      )}
    </View>
  );
};

export default AudioSermons;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: moderateSize(20),
    marginBottom: moderateSize(80),
  },
});
