import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import { Calendar, Clock, MapPin, Users } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import AppBackHeader from "@/components/AppBackHeader";
import AppImage from "@/components/AppImage";
import { AppText } from "@/components/AppText";
import ImageViewer from "@/components/ImageViewer";
import { Screen } from "@/components/Screen";
import WebBrowserSheet from "@/components/WebBrowserSheet";
import { Colors, Fonts } from "@/constants/theme";
import { useEventByIdQuery } from "@/services/api/public";
import { moderateSize } from "@/utils/useResponsiveStyle";

function formatEventDate(dateStr?: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatEventTime(dateStr?: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export default function EventDetails() {
  const [isVisible, setIsVisible] = useState(false);
  const { id } = useLocalSearchParams<{ id: string }>();
  const eventId = Array.isArray(id) ? id[0] : id;
  const { data, isLoading } = useEventByIdQuery(
    { id: eventId! },
    { skip: !eventId },
  );

  const [previewImage, setPreviewImage] = useState("");
  const [isImageOpen, setIsImageOpen] = useState(false);

  // Normalise both Mongoose flat format and legacy JSON:API format
  const event = useMemo(() => {
    if (!data?.data) return null;
    const raw = data.data as any;
    const src = raw.attributes ?? raw;
    const startRaw = src.eventDate ?? src.event_date;
    const endRaw = src.endDate ?? src.end_date;
    return {
      title: src.title ?? "",
      description: src.description ?? "",
      startDate: formatEventDate(startRaw),
      startTime: formatEventTime(startRaw),
      endDate: formatEventDate(endRaw),
      endTime: formatEventTime(endRaw),
      location: src.location ?? null,
      imageUrl: src.imageUrl ?? src.image_url ?? null,
      requiresRsvp: src.requiresRsvp ?? src.requires_rsvp ?? false,
      broadcastUrl: src.broadcastUrl ?? src.broadcast_url ?? null,
      isLive: src.isLive ?? src.is_live ?? false,
    };
  }, [data]);

  if (isLoading || !event)
    return (
      <Screen style={{}}>
        <ActivityIndicator
          style={{ marginTop: 200 }}
          size="large"
          color={Colors.primary}
        />
      </Screen>
    );

  const openImage = (img: string) => {
    setPreviewImage(img);
    setIsImageOpen(true);
  };

  return (
    <>
      <Screen preset="scroll" safeAreaEdges={["top"]}>
        <LinearGradient colors={Colors.gradientDeep} style={styles.container}>
          <AppBackHeader text="Event Details" style={styles.header} />

          {/* TOP IMAGE */}
          {event.imageUrl ? (
            <View>
              <AppImage
                onImagePress={() => openImage(event.imageUrl!)}
                source={{ uri: event.imageUrl }}
                style={styles.heroImage}
              />
              {event.isLive && (
                <View style={styles.liveBadge}>
                  <View style={styles.liveDot} />
                  <AppText style={styles.liveBadgeText}>LIVE NOW</AppText>
                </View>
              )}
            </View>
          ) : null}

          {/* LIVE BADGE (no image) */}
          {event.isLive && !event.imageUrl && (
            <View style={[styles.liveBadge, { position: "relative", alignSelf: "flex-start", marginBottom: moderateSize(12) }]}>
              <View style={styles.liveDot} />
              <AppText style={styles.liveBadgeText}>LIVE NOW</AppText>
            </View>
          )}

          {/* TITLE */}
          <AppText style={styles.title}>{event.title}</AppText>

          {/* SCHEDULE CARD */}
          <View style={styles.infoCard}>
            {/* Start / End timeline */}
            {event.startDate ? (
              <View style={styles.scheduleRow}>
                <View style={styles.timeline}>
                  <View style={[styles.timelineDot, event.isLive && styles.timelineDotLive]} />
                  <View style={styles.timelineLine} />
                  <View style={styles.timelineDot} />
                </View>
                <View style={styles.scheduleDetails}>
                  <View style={styles.scheduleBlock}>
                    <AppText style={styles.scheduleLabel}>STARTS</AppText>
                    <AppText style={styles.infoText}>{event.startDate}</AppText>
                    {event.startTime ? (
                      <AppText style={styles.scheduleTime}>{event.startTime}</AppText>
                    ) : null}
                  </View>
                  <View style={styles.scheduleDivider} />
                  <View style={styles.scheduleBlock}>
                    <AppText style={styles.scheduleLabel}>ENDS</AppText>
                    <AppText style={styles.infoText}>{event.endDate}</AppText>
                    {event.endTime ? (
                      <AppText style={styles.scheduleTime}>{event.endTime}</AppText>
                    ) : null}
                  </View>
                </View>
              </View>
            ) : null}

            {event.location ? (
              <View style={[styles.row, { marginTop: moderateSize(14), marginBottom: 0 }]}>
                <MapPin size={18} color={Colors.primary} />
                <AppText style={styles.infoText}>{event.location}</AppText>
              </View>
            ) : null}
          </View>

          {/* DESCRIPTION */}
          {event.description ? (
            <>
              <AppText style={styles.sectionHeader}>About This Event</AppText>
              <AppText style={styles.description}>{event.description}</AppText>
            </>
          ) : null}

          {/* RSVP SECTION */}
          {event.requiresRsvp && (
            <>
              <AppText style={styles.sectionHeader}>RSVP Required</AppText>

              <TouchableOpacity
                onPress={() => setIsVisible(true)}
                style={styles.rsvpBtn}
              >
                <Users size={18} color={Colors.black} />
                <AppText style={styles.rsvpText}>Register</AppText>
              </TouchableOpacity>
            </>
          )}
        </LinearGradient>
      </Screen>

      {/* IMAGE VIEWER MODAL */}
      <ImageViewer
        visible={isImageOpen}
        image={previewImage}
        onClose={() => setIsImageOpen(false)}
      />

      <WebBrowserSheet
        visible={isVisible}
        onClose={() => setIsVisible(false)}
        webUrl={event.broadcastUrl}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: moderateSize(16),
  },
  header: {
    marginBottom: moderateSize(16),
  },
  heroImage: {
    width: "100%",
    height: moderateSize(220),
    borderRadius: 16,
    marginBottom: moderateSize(20),
  },
  title: {
    fontSize: moderateSize(16),
    fontFamily: Fonts.Bold,
    color: Colors.white,
    marginBottom: moderateSize(20),
  },
  infoCard: {
    backgroundColor: Colors.surface,
    padding: moderateSize(16),
    borderRadius: 16,
    marginBottom: moderateSize(30),
    borderWidth: 1,
    borderColor: Colors.border,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: moderateSize(10),
    columnGap: 8,
  },
  infoText: {
    color: Colors.deemedWhite,
    fontSize: moderateSize(13),
  },
  scheduleRow: {
    flexDirection: "row",
    gap: moderateSize(14),
  },
  timeline: {
    alignItems: "center",
    paddingTop: 3,
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  timelineDotLive: {
    backgroundColor: "#ef4444",
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  scheduleDetails: {
    flex: 1,
  },
  scheduleBlock: {
    paddingVertical: moderateSize(4),
  },
  scheduleLabel: {
    color: Colors.muted,
    fontSize: moderateSize(9),
    fontFamily: Fonts.Bold,
    letterSpacing: 1.2,
    marginBottom: 3,
  },
  scheduleTime: {
    color: Colors.primary,
    fontSize: moderateSize(13),
    fontFamily: Fonts.SemiBold,
    marginTop: 2,
  },
  scheduleDivider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.06)",
    marginVertical: moderateSize(8),
  },
  liveBadge: {
    position: "absolute",
    top: moderateSize(12),
    left: moderateSize(12),
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(239,68,68,0.9)",
    paddingHorizontal: moderateSize(10),
    paddingVertical: moderateSize(5),
    borderRadius: 6,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: "#fff",
  },
  liveBadgeText: {
    color: "#fff",
    fontSize: moderateSize(10),
    fontFamily: Fonts.Bold,
    letterSpacing: 0.8,
  },
  sectionHeader: {
    color: Colors.white,
    fontFamily: Fonts.SemiBold,
    fontSize: moderateSize(14),
    marginBottom: moderateSize(10),
  },
  description: {
    color: Colors.deemedWhite,
    fontSize: moderateSize(12),
    marginBottom: moderateSize(30),
  },
  rsvpBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    columnGap: 10,
    marginBottom: moderateSize(30),
  },
  rsvpText: {
    color: Colors.black,
    fontFamily: Fonts.Bold,
    fontSize: moderateSize(12),
  },
});
