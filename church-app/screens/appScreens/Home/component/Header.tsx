import AppImage from "@/components/AppImage";
import { AppText } from "@/components/AppText";
import { Colors, Fonts, whiteOpacity } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { useGetNotificationsQuery } from "@/services/api/notification";
import { useHeroSlideQuery } from "@/services/api/public";
import SkeletonPlaceholder from "@/skeleton/SkeletonPlaceholder";
import { moderateSize } from "@/utils/useResponsiveStyle";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Bell } from "lucide-react-native";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Linking,
  Pressable,
  StyleSheet,
  View,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CAROUSEL_HEIGHT = moderateSize(155);
const AUTO_SCROLL_INTERVAL = 4000;

const Header = () => {
  const router = useRouter();
  const { authUser } = useAuth();
  const { data, isLoading } = useHeroSlideQuery(null);
  const { data: notificationsData } = useGetNotificationsQuery({ page: 1 });

  const unreadCount = 0;

  const name = authUser?.name;
  const firstName = name?.split(" ")[0] || "there";

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  const imageItems = useMemo(
    () =>
      data?.data?.map((i: any) => ({
        id: (i._id || i.id)?.toString(),
        image: i.image_url || i.imageUrl,
        link: i.link_url || i.linkUrl || undefined,
      })) ?? [],
    [data]
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const autoScrollTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(15)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        damping: 18,
        stiffness: 90,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Auto-scroll carousel
  useEffect(() => {
    if (imageItems.length <= 1) return;

    autoScrollTimer.current = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % imageItems.length;
        flatListRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, AUTO_SCROLL_INTERVAL);

    return () => {
      if (autoScrollTimer.current) clearInterval(autoScrollTimer.current);
    };
  }, [imageItems.length]);

  const handleImagePress = (link?: string) => {
    if (!link) return;
    const WHOLEWORD_APP_BASE = "https://wholeword.app/app";
    if (link.startsWith(WHOLEWORD_APP_BASE)) {
      const path = link.replace(WHOLEWORD_APP_BASE, "");
      router.push(path as any);
    } else if (link.startsWith("http")) {
      Linking.openURL(link);
    } else {
      router.push(link as any);
    }
  };

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: any) => {
      if (viewableItems.length > 0) {
        const idx = viewableItems[0].index ?? 0;
        setActiveIndex(idx);
      }
    }
  ).current;

  const onScrollBeginDrag = useCallback(() => {
    if (autoScrollTimer.current) clearInterval(autoScrollTimer.current);
  }, []);

  const onScrollEndDrag = useCallback(() => {
    if (imageItems.length <= 1) return;
    autoScrollTimer.current = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % imageItems.length;
        flatListRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, AUTO_SCROLL_INTERVAL);
  }, [imageItems.length]);

  return (
    <View style={styles.container}>
      {/* Greeting Row */}
      <Animated.View
        style={[
          styles.topBar,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <View style={styles.greetingSection}>
          <AppText style={styles.greeting}>{greeting},</AppText>
          <AppText style={styles.name}>{firstName}</AppText>
        </View>

        <Pressable
          onPress={() => router.push("/stack/notification")}
          style={styles.notifBtn}
        >
          <Bell
            size={moderateSize(18)}
            color={Colors.white}
            strokeWidth={1.8}
          />
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <AppText style={styles.badgeText}>
                {unreadCount > 9 ? "9+" : unreadCount}
              </AppText>
            </View>
          )}
        </Pressable>
      </Animated.View>

      {/* Hero Carousel — compact */}
      <Animated.View style={{ opacity: fadeAnim }}>
        {isLoading ? (
          <View style={styles.carouselWrapper}>
            <SkeletonPlaceholder
              width={SCREEN_WIDTH - moderateSize(40)}
              height={CAROUSEL_HEIGHT}
              borderRadius={16}
            />
          </View>
        ) : imageItems.length > 0 ? (
          <View>
            <FlatList
              ref={flatListRef}
              data={imageItems}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              snapToInterval={SCREEN_WIDTH}
              decelerationRate="fast"
              onViewableItemsChanged={onViewableItemsChanged}
              viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
              onScrollBeginDrag={onScrollBeginDrag}
              onScrollEndDrag={onScrollEndDrag}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => handleImagePress(item.link)}
                  style={styles.heroCard}
                >
                  <AppImage
                    source={{ uri: item.image }}
                    style={styles.heroImage}
                    contentFit="cover"
                  />
                  <LinearGradient
                    colors={["transparent", "rgba(0,0,0,0.5)"]}
                    style={styles.heroGradient}
                  />
                </Pressable>
              )}
            />

            {imageItems.length > 1 && (
              <View style={styles.dotsRow}>
                {imageItems.map((_: any, i: number) => (
                  <View
                    key={i}
                    style={[
                      styles.dot,
                      i === activeIndex && styles.dotActive,
                    ]}
                  />
                ))}
              </View>
            )}
          </View>
        ) : null}
      </Animated.View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    paddingTop: moderateSize(4),
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: moderateSize(20),
    paddingVertical: moderateSize(10),
  },
  greetingSection: {
    flex: 1,
  },
  greeting: {
    color: Colors.muted,
    fontFamily: Fonts.Medium,
    fontSize: moderateSize(12),
    letterSpacing: 0.2,
  },
  name: {
    color: Colors.white,
    fontFamily: Fonts.Bold,
    fontSize: moderateSize(20),
    marginTop: 1,
    letterSpacing: -0.3,
  },
  notifBtn: {
    width: moderateSize(40),
    height: moderateSize(40),
    borderRadius: moderateSize(20),
    backgroundColor: whiteOpacity("0.06"),
    borderWidth: 1,
    borderColor: whiteOpacity("0.08"),
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -2,
    right: -2,
    minWidth: moderateSize(16),
    height: moderateSize(16),
    borderRadius: moderateSize(8),
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
    borderWidth: 2,
    borderColor: "#0A0E1A",
  },
  badgeText: {
    color: "#0A0E1A",
    fontSize: moderateSize(8),
    fontFamily: Fonts.Bold,
  },
  carouselWrapper: {
    paddingHorizontal: moderateSize(20),
  },
  heroCard: {
    width: SCREEN_WIDTH - moderateSize(40),
    height: CAROUSEL_HEIGHT,
    borderRadius: 20,
    borderCurve: "continuous",
    overflow: "hidden",
    position: "relative",
    marginHorizontal: moderateSize(20),
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
    marginTop: moderateSize(10),
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: whiteOpacity("0.2"),
  },
  dotActive: {
    width: 20,
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
});
