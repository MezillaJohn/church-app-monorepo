import AppImage from "@/components/AppImage";
import { AppText } from "@/components/AppText";
import { Colors, Fonts } from "@/constants/theme";
import { useSermonsQuery } from "@/services/api/sermon";
import type { Sermon } from "@/services/api/sermon/type";
import { moderateSize } from "@/utils/useResponsiveStyle";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface SermonSelectParams {
  id: string;
  title: string;
  preacher: string;
  audioUrl: string;
  thumbnail: string;
  series: string;
}

interface AudioSeriesProps {
  series: string;
  onSelect?: (params: SermonSelectParams) => void;
}

const AudioSeries = ({ series, onSelect }: AudioSeriesProps) => {
  const router = useRouter();

  const { data } = useSermonsQuery({
    type: "audio",
    series: series,
    page: 1,
  });

  const sermons = data?.data || [];

  if (sermons.length === 0 || !sermons) return null;

  const getSeriesName = (item: Sermon): string => {
    return typeof item.seriesId === "object" ? item.seriesId?.name ?? "" : "";
  };

  return (
    <View style={styles.container}>
      <AppText style={styles.label}>
        {series ? "Series" : "More Sermons"}
      </AppText>

      <View>
        {sermons.map((item: Sermon) => (
          <TouchableOpacity
            key={item._id}
            style={styles.card}
            onPress={() => {
              const params: SermonSelectParams = {
                id: item._id,
                title: item.title || "",
                preacher: item.speaker || "",
                audioUrl: item.audioFileUrl || "",
                thumbnail: item.thumbnailUrl || "",
                series: getSeriesName(item),
              };
              if (onSelect) {
                onSelect(params);
              } else {
                router.replace({
                  pathname: "/stack/audioPlay",
                  params,
                });
              }
            }}
          >
            <AppImage
              source={{ uri: item.thumbnailUrl }}
              style={styles.thumbnail}
            />

            <View style={styles.info}>
              <AppText style={styles.title} numberOfLines={1}>
                {item.title}
              </AppText>
              <AppText style={styles.speaker}>{item.speaker}</AppText>
              <AppText style={styles.date}>{item.date}</AppText>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default AudioSeries;

const styles = StyleSheet.create({
  container: {
    marginTop: moderateSize(30),
    borderTopColor: "rgba(255,255,255,0.2)",
    borderTopWidth: 1,
    paddingTop: moderateSize(16),
  },
  label: {
    color: Colors.muted,
    fontFamily: Fonts.Medium,
    fontSize: moderateSize(12),
    marginBottom: 10,
  },
  card: {
    flexDirection: "row",
    marginBottom: moderateSize(14),
    gap: 12,
    alignItems: "center",
  },
  thumbnail: {
    width: moderateSize(55),
    height: moderateSize(55),
    borderRadius: 8,
  },
  info: {
    flex: 1,
  },
  title: {
    color: "#fff",
    fontFamily: Fonts.SemiBold,
    fontSize: moderateSize(13),
  },
  speaker: {
    color: Colors.muted,
    fontFamily: Fonts.Regular,
    fontSize: moderateSize(12),
    marginTop: 2,
  },
  date: {
    color: Colors.disabled,
    fontSize: moderateSize(10),
    marginTop: 2,
  },
});
