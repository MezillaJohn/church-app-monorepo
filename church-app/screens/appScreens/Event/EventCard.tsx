import AppImage from "@/components/AppImage";
import { AppText } from "@/components/AppText";
import { Colors, Fonts } from "@/constants/theme";
import { useShare } from "@/hooks/useShare";
import { moderateSize } from "@/utils/useResponsiveStyle";
import { router } from "expo-router";
import { Heart, Share2 } from "lucide-react-native";
import React from "react";
import {
  Pressable,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
} from "react-native";

interface EventCardProps {
  item: {
    id: string;
    title: string;
    description: string;
    date: string;
    month: string;
    year: string;
    time: string;
    image: string;
    reactions: number;
  };
  reminderEnabled: boolean;
  onToggleReminder: () => void;
  onImagePress: (arg: string) => void;
}

const EventCard = ({
  item,
  reminderEnabled,
  onToggleReminder,
  onImagePress,
}: EventCardProps) => {
  const { share } = useShare();

  const handleShare = () => {
    const eventUrl = `https://wholeword.app/app/event/${item.id}`;
    share({
      message: `${item.title}\n\n${eventUrl}`,
      title: "Share Event",
    });
  };

  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/stack/eventDetails",
          params: { id: item.id },
        })
      }
      style={styles.card}
    >
      {/* IMAGE */}
      <View style={styles.imageWrapper}>
        <AppImage
          onImagePress={() => onImagePress(item?.image)}
          source={{ uri: item.image }}
          style={styles.image}
        />

        <View style={styles.dateBadgeRow}>
          <AppText style={styles.dateRowText}>
            {item.date} {item.month} {item.year} • {item.time}
          </AppText>
        </View>
      </View>

      {/* TITLE */}
      <AppText style={styles.title}>{item.title}</AppText>

      {/* TIME */}
      <AppText style={styles.timeText}>{item.time}</AppText>

      {/* DESCRIPTION */}
      <AppText numberOfLines={4} style={styles.description}>
        {item.description}
      </AppText>

      {/* REMINDER TOGGLE */}
      <View style={styles.reminderRow}>
        <AppText style={styles.reminderText}>
          Turn on reminder for event
        </AppText>

        <Switch
          value={reminderEnabled}
          onValueChange={onToggleReminder}
          thumbColor={reminderEnabled ? Colors.primary : Colors.white}
          trackColor={{
            false: "rgba(255,255,255,0.2)",
            true: Colors.deemedWhite,
          }}
        />
      </View>

      {/* FOOTER / ACTIONS */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={handleShare} style={styles.iconRow}>
          <Share2 size={16} color={Colors.deemedWhite} />
          <AppText style={styles.footerText}>Share</AppText>
        </TouchableOpacity>

        <View style={styles.iconRow}>
          <Heart size={16} color={Colors.primary} />
          <AppText style={styles.footerText}>{item.reactions}</AppText>
        </View>
      </View>
    </Pressable>
  );
};

export default EventCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 16,
    marginBottom: moderateSize(20),
    padding: moderateSize(14),
  },
  imageWrapper: {
    position: "relative",
    marginBottom: moderateSize(10),
  },
  image: {
    width: "100%",
    height: moderateSize(160),
    borderRadius: 12,
  },
  dateBadgeRow: {
    position: "absolute",
    left: moderateSize(12),
    bottom: moderateSize(-12),
    backgroundColor: Colors.primary,
    paddingHorizontal: moderateSize(10),
    paddingVertical: moderateSize(5),
    borderRadius: 8,
  },
  dateRowText: {
    color: Colors.black,
    fontFamily: Fonts.Bold,
    fontSize: moderateSize(13),
  },
  title: {
    fontSize: moderateSize(15),
    color: Colors.white,
    fontFamily: Fonts.Bold,
    marginTop: moderateSize(16),
  },
  timeText: {
    fontSize: moderateSize(11),
    color: "rgba(255,255,255,0.6)",
    marginTop: moderateSize(4),
  },
  description: {
    fontSize: moderateSize(12),
    color: "rgba(255,255,255,0.7)",
    marginTop: moderateSize(6),
  },
  reminderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: moderateSize(12),
  },
  reminderText: {
    color: Colors.white,
    fontSize: moderateSize(12),
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: moderateSize(14),
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
    paddingTop: moderateSize(10),
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 6,
  },
  footerText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: moderateSize(12),
  },
});
