import AppBackHeader from "@/components/AppBackHeader";
import { AppText } from "@/components/AppText";
import { Colors, Fonts } from "@/constants/theme";
import {
  Notification as NotificationType,
  useGetNotificationsQuery,
  useMarkAllNotificationsAsReadMutation,
  useMarkNotificationAsReadMutation,
} from "@/services/api/notification";
import { moderateSize } from "@/utils/useResponsiveStyle";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  Bell,
  BellOff,
  CheckCheck,
  Calendar,
  Video,
  Music,
  BookOpen,
  ChevronRight,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
};

const ICON_MAP: Record<string, { icon: typeof Bell; color: string }> = {
  event: { icon: Calendar, color: Colors.success },
  video: { icon: Video, color: Colors.info },
  audio: { icon: Music, color: Colors.purple },
  book: { icon: BookOpen, color: Colors.primary },
};

const getNotificationIcon = (type: string) => {
  const config = ICON_MAP[type] || { icon: Bell, color: Colors.primary };
  const Icon = config.icon;
  return { Icon, color: config.color };
};

const getNotificationContent = (item: NotificationType) => {
  let title = "New Notification";
  const body = item.data?.message || "You have a new notification";

  if (item.event_type === "audio" || item.event_type === "video") {
    if ("event" in item && item.event) {
      title = item.event.title;
    } else {
      title = "New Sermon";
    }
  } else if (item.event_type === "event") {
    if ("event" in item && item.event) {
      title = item.event.title;
    } else {
      title = "Upcoming Event";
    }
  }

  return { title, body };
};

interface NotificationItemProps {
  item: NotificationType;
  onPress: () => void;
}

const NotificationItem = ({ item, onPress }: NotificationItemProps) => {
  const isUnread = !item.read_status;
  const timeAgo = formatTimeAgo(item.created_at);
  const { Icon, color } = getNotificationIcon(item.event_type);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.notificationCard,
        isUnread && styles.unreadCard,
        pressed && styles.pressedCard,
      ]}
    >
      <View style={[styles.iconContainer, { backgroundColor: color + "18" }]}>
        <Icon size={moderateSize(18)} color={color} />
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.titleRow}>
          <AppText
            style={[styles.notificationTitle, isUnread && styles.unreadTitle]}
            numberOfLines={1}
          >
            {item?.event?.title}
          </AppText>
          {isUnread && <View style={styles.unreadDot} />}
        </View>
        <AppText style={styles.notificationBody} numberOfLines={2}>
          {item?.data?.message}
        </AppText>
        <AppText style={styles.timeText}>{timeAgo}</AppText>
      </View>

      <ChevronRight
        size={moderateSize(20)}
        color="rgba(255,255,255,0.2)"
        style={styles.chevron}
      />
    </Pressable>
  );
};

const EmptyState = () => (
  <View style={styles.emptyContainer}>
    <View style={styles.emptyIconContainer}>
      <BellOff size={40} color="rgba(255,255,255,0.25)" />
    </View>
    <AppText style={styles.emptyTitle}>No Notifications</AppText>
    <AppText style={styles.emptySubtitle}>
      You're all caught up! Check back later for updates.
    </AppText>
  </View>
);

const Notification = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, refetch, isFetching } = useGetNotificationsQuery({
    page,
  });
  const [markAsRead] = useMarkNotificationAsReadMutation();
  const [markAllAsRead, { isLoading: isMarkingAll }] =
    useMarkAllNotificationsAsReadMutation();

  const notifications = data?.data ?? [];
  const lastPage = data?.meta?.last_page;
  const unreadCount = 0

  const handleLoadMore = () => {
    if (lastPage && page < lastPage) {
      setPage((prev) => prev + 1);
    }
  };

  const renderFooter = () => {
    if (isFetching && !isLoading) {
      return (
        <View style={{ paddingVertical: moderateSize(20) }}>
          <ActivityIndicator size="small" color={Colors.primary} />
        </View>
      );
    }
    return null;
  };

  const router = useRouter();

  const handleNotificationPress = async (item: NotificationType) => {
    if (!item.read_status) {
      try {
        await markAsRead(item.id);
      } catch (error) {
        console.log(error);
      }
    }

    const { title, body } = getNotificationContent(item);

    switch (item.event_type) {
      case "audio":
        if ("event" in item && item.event) {
          router.push({
            pathname: "/stack/audioPlay",
            params: {
              id: item.event.id.toString(),
              title: item.event.title,
              preacher: item.event.speaker,
              audioUrl: item.event.audio_file_url ?? undefined,
              thumbnail: item.event.thumbnail_url,
              series: (item.event as any).series?.attributes?.name ?? "",
            },
          });
        }
        break;
      case "video":
        if ("event" in item && item.event) {
          router.push({
            pathname: "/stack/videoDetailsScreen",
            params: {
              videoId: item.event.id.toString(),
              videoUrl: item.event.youtube_video_url ?? undefined,
              title: item.event.title,
              preacher: item.event.speaker,
              duration: item.event.duration.toString(),
              description: item.event.description,
            },
          });
        }
        break;
      case "book":
        if ("event_id" in item) {
          router.push({
            pathname: "/stack/bookDetails",
            params: { bookId: item.event_id.toString() },
          });
        }
        break;
      case "event":
        if ("event" in item && item.event) {
          router.push({
            pathname: "/stack/eventDetails",
            params: { id: item.event.id.toString() },
          });
        }
        break;
      case "announcement":
      default:
        router.push({
          pathname: "/stack/notificationDetails",
          params: {
            title,
            body,
            date: formatTimeAgo(item.created_at),
          },
        });
        break;
    }
  };

  const handleMarkAllAsRead = async () => {
    if (unreadCount > 0) {
      try {
        await markAllAsRead();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const renderNotification = ({ item }: { item: NotificationType }) => (
    <NotificationItem
      item={item}
      onPress={() => handleNotificationPress(item)}
    />
  );

  return (
    <LinearGradient colors={Colors.gradientDeep} style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View style={styles.header}>
          <AppBackHeader text="Notifications" />

          {unreadCount > 0 && (
            <TouchableOpacity
              style={styles.markAllButton}
              onPress={handleMarkAllAsRead}
              disabled={isMarkingAll}
              activeOpacity={0.7}
            >
              {isMarkingAll ? (
                <ActivityIndicator size="small" color={Colors.primary} />
              ) : (
                <>
                  <CheckCheck size={14} color={Colors.primary} />
                  <AppText style={styles.markAllText}>Read all</AppText>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : notifications?.length === 0 ? (
          <EmptyState />
        ) : (
          <FlatList
            data={notifications}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderNotification}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isFetching && !isLoading}
                onRefresh={refetch}
                tintColor={Colors.primary}
                colors={[Colors.primary]}
              />
            }
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
          />
        )}
      </SafeAreaView>
    </LinearGradient>
  );
};

export default Notification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: moderateSize(16),
    paddingVertical: moderateSize(10),
  },
  markAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateSize(5),
    paddingHorizontal: moderateSize(14),
    paddingVertical: moderateSize(7),
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.primary + "40",
  },
  markAllText: {
    color: Colors.primary,
    fontFamily: Fonts.Medium,
    fontSize: moderateSize(11),
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  listContent: {
    paddingHorizontal: moderateSize(14),
    paddingBottom: moderateSize(30),
    paddingTop: moderateSize(8),
    flexGrow: 1,
  },
  notificationCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: moderateSize(14),
    paddingHorizontal: moderateSize(12),
    borderRadius: 14,
    marginBottom: moderateSize(6),
    backgroundColor: "transparent",
  },
  unreadCard: {
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  pressedCard: {
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  iconContainer: {
    width: moderateSize(42),
    height: moderateSize(42),
    borderRadius: moderateSize(12),
    alignItems: "center",
    justifyContent: "center",
    marginRight: moderateSize(12),
  },
  contentContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateSize(6),
  },
  notificationTitle: {
    color: Colors.deemedWhite,
    fontFamily: Fonts.Medium,
    fontSize: moderateSize(14),
    flexShrink: 1,
  },
  unreadTitle: {
    color: Colors.white,
    fontFamily: Fonts.SemiBold,
  },
  unreadDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  notificationBody: {
    color: Colors.muted,
    fontFamily: Fonts.Regular,
    fontSize: moderateSize(13),
    lineHeight: moderateSize(16),
    marginTop: moderateSize(2),
  },
  timeText: {
    color: Colors.muted,
    fontFamily: Fonts.Regular,
    fontSize: moderateSize(12),
    opacity: 0.6,
    marginTop: moderateSize(4),
  },
  chevron: {
    marginLeft: moderateSize(8),
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: moderateSize(40),
  },
  emptyIconContainer: {
    width: moderateSize(80),
    height: moderateSize(80),
    borderRadius: moderateSize(40),
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: moderateSize(20),
  },
  emptyTitle: {
    color: Colors.white,
    fontFamily: Fonts.SemiBold,
    fontSize: moderateSize(16),
    marginBottom: moderateSize(8),
  },
  emptySubtitle: {
    color: Colors.muted,
    fontFamily: Fonts.Regular,
    fontSize: moderateSize(12),
    textAlign: "center",
    lineHeight: moderateSize(18),
  },
});
