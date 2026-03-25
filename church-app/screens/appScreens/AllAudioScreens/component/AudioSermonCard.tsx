import AppImage from "@/components/AppImage";
import { AppText } from "@/components/AppText";
import { Colors, Fonts, whiteOpacity } from "@/constants/theme";
import { useDisplayError } from "@/hooks/displayError";
import { useDownload } from "@/hooks/useDownload";
import { useShare } from "@/hooks/useShare";
import { useMarkAsFavouriteMutation } from "@/services/api/sermon";
import type { Sermon, SermonListParams } from "@/services/api/sermon/type";
import { calDuration } from "@/utils/calDuration";
import { moderateSize } from "@/utils/useResponsiveStyle";
import { useRouter } from "expo-router";
import {
  Check,
  Download,
  Heart,
  MoreVertical,
  Play,
} from "lucide-react-native";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

interface AudioSermonCardProps {
  item: Sermon;
  params: SermonListParams;
  isDownloaded?: boolean;
  localUri?: string;
}

const AudioSermonCard: React.FC<AudioSermonCardProps> = ({
  params,
  item,
  isDownloaded: propIsDownloaded,
  localUri,
}) => {
  const router = useRouter();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [showActions, setShowActions] = useState(false);

  const [markAsFavourite, { error }] = useMarkAsFavouriteMutation();
  const { isDownloaded, isDownloading, progress, startDownload } =
    useDownload(item);

  useDisplayError(error);

  const { share } = useShare();

  const seriesName =
    typeof item.seriesId === "object" ? item.seriesId?.name : "";
  const categoryName =
    typeof item.categoryId === "object" ? item.categoryId?.name : "";

  const handleNav = () => {
    router.push({
      pathname: "/stack/audioPlay",
      params: {
        id: item._id,
        title: item.title || "Untitled Sermon",
        preacher: item.speaker || "Unknown Speaker",
        audioUrl: localUri || item.audioFileUrl || "",
        thumbnail:
          item.thumbnailUrl ||
          "https://via.placeholder.com/150x150?text=Audio+Sermon",
        description: item.description || "",
        duration: String(item.duration ?? "0"),
        date: item.createdAt || "",
        category: categoryName,
        series: seriesName,
      },
    });
  };

  const handleFavourite = async () => {
    try {
      await markAsFavourite({
        type: "audio",
        id: item._id,
        search: params.search,
        sort: params.sort,
        category_id: params.category_id,
        page: 1,
      }).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDownload = async () => {
    if (isDownloaded || isDownloading || propIsDownloaded) return;
    await startDownload();
  };

  const handleShare = () => {
    const audioUrl = `https://wholeword.app/app/audio/${item._id}`;
    share({
      message: `${item.title}\n\n${audioUrl}`,
      title: "Share Audio",
    });
  };

  const actuallyDownloaded = propIsDownloaded || isDownloaded;

  const onPressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 30,
      bounciness: 8,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 6,
    }).start();
  };

  return (
    <Pressable onPress={handleNav} onPressIn={onPressIn} onPressOut={onPressOut}>
      <Animated.View
        style={[styles.card, { transform: [{ scale: scaleAnim }] }]}
      >
        {/* ── Thumbnail ── */}
        <View style={styles.imageWrapper}>
          <AppImage
            onImagePress={handleNav}
            source={{
              uri:
                item.thumbnailUrl ||
                "https://via.placeholder.com/150x150?text=Audio",
            }}
            style={styles.image}
            contentFit="cover"
          />
        </View>

        {/* ── Middle: title + meta ── */}
        <View style={styles.center}>
          <AppText style={styles.title} numberOfLines={1}>
            {item.title || "Untitled Sermon"}
          </AppText>
          <AppText style={styles.meta} numberOfLines={1}>
            {item.speaker || "Unknown"} · {calDuration(Number(item.duration ?? 0))}
          </AppText>
        </View>

        {/* ── Right side actions ── */}
        <View style={styles.right}>
          {/* Heart */}
          <TouchableOpacity
            onPress={handleFavourite}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Heart
              size={18}
              color={item.isFavorited ? Colors.primary : "rgba(255,255,255,0.4)"}
              fill={item.isFavorited ? Colors.primary : "transparent"}
            />
          </TouchableOpacity>

          {/* Download indicator */}
          {actuallyDownloaded ? (
            <Check size={16} color={Colors.success} />
          ) : isDownloading ? (
            <ActivityIndicator size="small" color={Colors.primary} />
          ) : (
            <TouchableOpacity
              onPress={handleDownload}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Download size={16} color="rgba(255,255,255,0.4)" />
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
    </Pressable>
  );
};

export default AudioSermonCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: moderateSize(8),
    paddingHorizontal: moderateSize(4),
    gap: moderateSize(12),
  },

  /* ── Thumbnail ── */
  imageWrapper: {
    borderRadius: 4,
    overflow: "hidden",
  },
  image: {
    width: moderateSize(56),
    height: moderateSize(56),
    borderRadius: 4,
  },

  /* ── Center ── */
  center: {
    flex: 1,
    gap: 3,
  },
  title: {
    fontFamily: Fonts.SemiBold,
    fontSize: moderateSize(14),
    color: Colors.white,
    textTransform: "capitalize",
  },
  meta: {
    color: "rgba(255,255,255,0.45)",
    fontFamily: Fonts.Regular,
    fontSize: moderateSize(12),
  },

  /* ── Right ── */
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateSize(14),
  },
});
