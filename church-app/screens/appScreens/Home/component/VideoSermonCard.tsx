import AppImage from "@/components/AppImage";
import { AppText } from "@/components/AppText";
import { Colors, Fonts, whiteOpacity } from "@/constants/theme";
import { useMarkAsFavouriteMutation } from "@/services/api/sermon";
import type { Sermon, SermonListParams } from "@/services/api/sermon/type";
import { calDuration } from "@/utils/calDuration";
import { moderateSize } from "@/utils/useResponsiveStyle";
import { Clock, Heart, Play } from "lucide-react-native";
import React, { useRef } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

interface VideoSermonCardProps {
  item: Sermon;
  onPress?: () => void;
  cardWidth?: number;
  params: SermonListParams;
  page?: number;
}

const VideoSermonCard: React.FC<VideoSermonCardProps> = ({
  item,
  onPress,
  cardWidth = moderateSize(180),
  params,
  page,
}) => {
  const [markAsFavourite] = useMarkAsFavouriteMutation();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const durationSeconds = item.duration ?? 0;

  const handleFavourite = async () => {
    try {
      await markAsFavourite({
        type: "video",
        id: item._id,
        search: params.search,
        sort: params.sort,
        category_id: params.category_id,
        page,
      }).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  const onPressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
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
    <Pressable onPressIn={onPressIn} onPressOut={onPressOut} onPress={onPress}>
      <Animated.View
        style={[
          styles.card,
          { width: cardWidth, transform: [{ scale: scaleAnim }] },
        ]}
      >
        {/* Image */}
        <View style={styles.imageContainer}>
          <AppImage
            source={
              item.thumbnailUrl || require("@/assets/images/IMG_7715.jpg")
            }
            style={styles.image}
            contentFit="cover"
          />
          <View style={styles.imageOverlay} />

          {/* Play button */}
          <View style={styles.playCircle}>
            <Play
              size={moderateSize(12)}
              color={Colors.white}
              fill={Colors.white}
            />
          </View>

          {/* Favourite */}
          <TouchableOpacity
            style={styles.favButton}
            onPress={handleFavourite}
            activeOpacity={0.7}
          >
            <Heart
              fill={item.isFavorited ? Colors.primary : undefined}
              size={moderateSize(11)}
              color={item.isFavorited ? Colors.primary : Colors.white}
            />
          </TouchableOpacity>

          {/* Duration pill */}
          <View style={styles.durationOverlay}>
            <Clock size={8} color={Colors.white} />
            <AppText style={styles.durationOverlayText}>
              {calDuration(durationSeconds)}
            </AppText>
          </View>
        </View>

        {/* Info */}
        <View style={styles.infoFooter}>
          <AppText style={styles.title} numberOfLines={1}>
            {item.title}
          </AppText>
          {item?.description ? (
            <AppText style={styles.desc} numberOfLines={2}>
              {item?.description}
            </AppText>
          ) : null}
          <AppText style={styles.speaker} numberOfLines={1}>
            {item.speaker}
          </AppText>
        </View>
      </Animated.View>
    </Pressable>
  );
};

export default VideoSermonCard;

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderCurve: "continuous",
    overflow: "hidden",
    marginRight: moderateSize(10),
    backgroundColor: whiteOpacity("0.03"),
    borderWidth: 1,
    borderColor: whiteOpacity("0.06"),
  },
  imageContainer: {
    position: "relative",
    height: moderateSize(105),
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.15)",
  },
  playCircle: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: moderateSize(-15),
    marginLeft: moderateSize(-15),
    width: moderateSize(30),
    height: moderateSize(30),
    borderRadius: moderateSize(15),
    backgroundColor: "rgba(0,217,166,0.85)",
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 1,
  },
  favButton: {
    position: "absolute",
    top: moderateSize(6),
    right: moderateSize(6),
    backgroundColor: "rgba(0,0,0,0.35)",
    width: moderateSize(26),
    height: moderateSize(26),
    borderRadius: moderateSize(13),
    borderWidth: 1,
    borderColor: whiteOpacity("0.1"),
    alignItems: "center",
    justifyContent: "center",
  },
  durationOverlay: {
    position: "absolute",
    bottom: moderateSize(6),
    left: moderateSize(6),
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: moderateSize(6),
    paddingVertical: moderateSize(3),
    borderRadius: 6,
  },
  durationOverlayText: {
    color: Colors.white,
    fontSize: moderateSize(8),
    fontFamily: Fonts.Medium,
  },
  infoFooter: {
    paddingHorizontal: moderateSize(10),
    paddingVertical: moderateSize(8),
    gap: moderateSize(2),
  },
  title: {
    fontFamily: Fonts.SemiBold,
    fontSize: moderateSize(12),
    color: Colors.white,
  },
  desc: {
    fontSize: moderateSize(11),
    lineHeight: moderateSize(16),
    color: Colors.muted,
  },
  speaker: {
    color: Colors.muted,
    fontSize: moderateSize(10),
    fontFamily: Fonts.Regular,
  },
});
