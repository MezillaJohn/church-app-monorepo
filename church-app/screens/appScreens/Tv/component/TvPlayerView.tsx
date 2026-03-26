import { AppText } from "@/components/AppText";
import { Fonts } from "@/constants/theme";
import { EventItem } from "@/services/api/public/types";
import { moderateSize } from "@/utils/useResponsiveStyle";
import { useEvent } from "expo";
import { useKeepAwake } from "expo-keep-awake";
import { useFocusEffect } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import React, { useCallback, useEffect } from "react";
import { ActivityIndicator, Platform, StyleSheet, View } from "react-native";

const videoSource =
  'https://samplelib.com/lib/preview/mp4/sample-5s.mp4';

export default function TvPlayerView({
  liveEvent,
}: {
  liveEvent: EventItem | null;
}) {
  const title = (liveEvent as any)?.title ?? "Wholeword TV Live";
  const subtitle = liveEvent
    ? "Going Live Now"
    : "No Live Service at the Moment";

  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = true;
    player.play();
    player.staysActiveInBackground = true; // 👈 Key: Enable background audio playback
    if (Platform.OS === "ios") {
      player.showNowPlayingNotification = true; // 👈 Optional: Show lock screen controls on iOS
      player.audioMixingMode = "doNotMix"; // 👈 Optional: Don't mix with other audio (adjust as needed)
    }
  });

  useKeepAwake(); // 👈 Add this to keep screen awake while component is mounted

  // Listen for player status changes
  const { status } = useEvent(player, "statusChange", {
    status: player.status,
  });


  useEffect(() => {
    if (!player) return;

    const statusListener = player.addListener("statusChange", (payload) => {
      console.log("[FeedCardVideo] statusChange", { status: payload.status, error: payload.error });
      if (payload.error) {
        console.error("[FeedCardVideo] ERROR", { error: payload.error });
      }
    });

    return () => {
      statusListener.remove();
    };
  }, [player,]);



  useFocusEffect(
    useCallback(() => {
      player.muted = false;

      return () => {
        player.muted = true;
      };
    }, [player])
  );

  return (
    <>
      <View style={styles.contentContainer}>
        <VideoView
          style={styles.video}
          player={player}
          allowsFullscreen
          allowsPictureInPicture
          startsPictureInPictureAutomatically={true}
          contentFit="contain"
        />

        {/* Loading spinner overlay */}
        {status === "loading" && (
          <View style={styles.overlay}>
            <ActivityIndicator size="large" color="white" />
          </View>
        )}

        {/* Error overlay */}
        {status === "error" && (
          <View style={styles.overlay}>
            <AppText
              style={{
                fontSize: moderateSize(12),
                color: "red",
                fontFamily: Fonts.Bold,
              }}
            >
              Failed to load video
            </AppText>
          </View>
        )}
      </View>

      <View style={{ padding: moderateSize(15) }}>
        <AppText style={{ fontFamily: Fonts.Bold, fontSize: moderateSize(14) }}>
          {title}
        </AppText>

        <AppText style={{ fontSize: moderateSize(12) }} type="subtitle">
          {subtitle}
        </AppText>

        {(liveEvent as any)?.description && (
          <AppText style={{ marginTop: 4, fontSize: moderateSize(14) }}>
            {(liveEvent as any).description}
          </AppText>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    height: moderateSize(200),
    position: "relative",
  },
  video: {
    flex: 1,
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
});
