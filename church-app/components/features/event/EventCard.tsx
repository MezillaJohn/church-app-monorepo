import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Calendar, Clock, MapPin } from "lucide-react-native";
import moment from "moment";
import AppImage from "@/components/AppImage";
import { GlassCard, Text } from "@/components/global";
import { Colors, Fonts } from "@/constants/theme";
import { moderateSize } from "@/utils/useResponsiveStyle";

interface EventCardProps {
  title: string;
  date?: string;
  endDate?: string;
  location?: string;
  imageUrl?: string;
  isLive?: boolean;
  onPress?: () => void;
}

export const EventCard: React.FC<EventCardProps> = ({
  title,
  date,
  endDate,
  location,
  imageUrl,
  isLive,
  onPress,
}) => {
  const startFormatted = date ? moment(date).format("ddd, MMM D") : "";
  const startTime = date ? moment(date).format("h:mm A") : "";
  const endTime = endDate ? moment(endDate).format("h:mm A") : "";

  return (
    <Pressable onPress={onPress}>
      <GlassCard style={styles.card} contentStyle={styles.content}>
        {/* Thumbnail or date box fallback */}
        {imageUrl ? (
          <View style={styles.thumbWrap}>
            <AppImage
              source={{ uri: imageUrl }}
              style={styles.thumb}
              contentFit="cover"
            />
            {isLive && (
              <View style={styles.liveBadgeOverlay}>
                <View style={styles.liveDot} />
                <Text variant="overline" style={styles.liveBadgeText}>LIVE</Text>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.dateBox}>
            <Text variant="heading2" color="accent">
              {date ? moment(date).format("DD") : "--"}
            </Text>
            <Text variant="overline" color="muted">
              {date ? moment(date).format("MMM") : ""}
            </Text>
            {isLive && (
              <View style={styles.liveBadgeSmall}>
                <View style={styles.liveDot} />
                <Text variant="overline" style={styles.liveBadgeText}>LIVE</Text>
              </View>
            )}
          </View>
        )}

        <View style={styles.info}>
          <View style={styles.titleRow}>
            <Text variant="heading3" numberOfLines={1} style={{ flex: 1 }}>
              {title}
            </Text>
            {isLive && !imageUrl && (
              <View style={styles.liveInlineBadge}>
                <View style={styles.liveDot} />
                <Text variant="overline" style={styles.liveBadgeText}>LIVE</Text>
              </View>
            )}
          </View>

          {date ? (
            <View style={styles.metaRow}>
              <Calendar size={12} color={Colors.textMuted} />
              <Text variant="small" color="muted">
                {startFormatted}
              </Text>
            </View>
          ) : null}

          {startTime ? (
            <View style={styles.metaRow}>
              <Clock size={12} color={Colors.textMuted} />
              <Text variant="small" color="muted">
                {startTime}{endTime ? ` — ${endTime}` : ""}
              </Text>
            </View>
          ) : null}

          {location ? (
            <View style={styles.metaRow}>
              <MapPin size={12} color={Colors.textMuted} />
              <Text variant="small" color="muted" numberOfLines={1}>
                {location}
              </Text>
            </View>
          ) : null}
        </View>
      </GlassCard>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: moderateSize(10),
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateSize(14),
    padding: moderateSize(14),
  },
  thumbWrap: {
    width: moderateSize(60),
    height: moderateSize(60),
    borderRadius: 12,
    borderCurve: "continuous",
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  thumb: {
    width: "100%",
    height: "100%",
  },
  dateBox: {
    width: moderateSize(60),
    height: moderateSize(60),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,217,166,0.08)",
    borderRadius: 12,
    borderCurve: "continuous",
  },
  info: {
    flex: 1,
    gap: 3,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  // Live badge styles
  liveBadgeOverlay: {
    position: "absolute",
    top: 4,
    left: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "rgba(239,68,68,0.9)",
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  liveBadgeSmall: {
    position: "absolute",
    top: 3,
    right: 3,
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    backgroundColor: "rgba(239,68,68,0.9)",
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
  },
  liveInlineBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "rgba(239,68,68,0.15)",
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.3)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  liveDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#fff",
  },
  liveBadgeText: {
    color: "#fff",
    fontSize: 8,
    fontFamily: Fonts.Bold,
    letterSpacing: 0.5,
  },
});
