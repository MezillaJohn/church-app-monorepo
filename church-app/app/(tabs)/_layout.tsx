import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { Tabs } from "expo-router";
import React, { useRef, useEffect } from "react";
import { Animated, Platform, StyleSheet, View } from "react-native";

import { BlurView } from "expo-blur";
import { HapticTab } from "@/components/HapticTab";
import { MiniPlayer } from "@/components/global/navigation/MiniPlayer";
import { Colors, Fonts } from "@/constants/theme";
import { moderateSize } from "@/utils/useResponsiveStyle";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Headphones,
  House,
  UserRound,
  Users,
} from "lucide-react-native";

const add = Platform.OS === "android" ? 70 : 55;

/* ── Modern tab icon with animated highlight pill ── */
const TabIcon = ({
  Icon,
  label,
  focused,
  color,
}: {
  Icon: any;
  label: string;
  focused: boolean;
  color: string;
}) => {
  const bgAnim = useRef(new Animated.Value(focused ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(bgAnim, {
      toValue: focused ? 1 : 0,
      useNativeDriver: false,
      speed: 16,
      bounciness: 4,
    }).start();
  }, [focused]);

  const pillBg = bgAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["rgba(0,217,166,0)", "rgba(0,217,166,0.12)"],
  });

  const pillScale = bgAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.9, 1],
  });

  return (
    <View style={tabStyles.wrapper}>
      <Animated.View
        style={[
          tabStyles.pill,
          {
            backgroundColor: pillBg,
            transform: [{ scale: pillScale }],
            borderColor: focused
              ? "rgba(0,217,166,0.2)"
              : "transparent",
          },
        ]}
      >
        <Icon
          size={moderateSize(20)}
          color={focused ? Colors.primary : color}
          strokeWidth={focused ? 2.2 : 1.5}
          fill={focused ? Colors.primary : "transparent"}
        />
      </Animated.View>
      <Animated.Text
        style={[
          tabStyles.label,
          {
            color: focused ? Colors.primary : color,
            fontFamily: focused ? Fonts.SemiBold : Fonts.Medium,
          },
        ]}
      >
        {label}
      </Animated.Text>
    </View>
  );
};

const tabStyles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    minWidth: moderateSize(56),
  },
  pill: {
    paddingHorizontal: moderateSize(16),
    paddingVertical: moderateSize(6),
    borderRadius: 20,
    borderCurve: "continuous",
    borderWidth: 1,
  },
  label: {
    fontSize: moderateSize(10),
  },
});

/* ── Hidden routes that should hide the tab bar ── */
const HIDDEN_TAB_BAR_ROUTES = new Set([
  "bookDetails",
  "history",
  "readPdf",
  "changePassword",
  "favourite",
  "updateProfile",
  "deleteAccont",
  "downloads",
]);

export default function TabLayout() {
  const { bottom } = useSafeAreaInsets();

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={({ route }) => ({
          tabBarLabelStyle: { display: "none" },
          tabBarShowLabel: false,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: () => (
            <BlurView
              intensity={60}
              tint="dark"
              style={StyleSheet.absoluteFill}
            />
          ),

          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: "rgba(255,255,255,0.5)",
          tabBarStyle: (() => {
            const routeName = getFocusedRouteNameFromRoute(route) ?? "";
            if (HIDDEN_TAB_BAR_ROUTES.has(routeName)) {
              return { display: "none", backgroundColor: "transparent" };
            }
            return Platform.select({
              ios: {
                display: "flex",
                position: "absolute",
                backgroundColor: "transparent",
                borderTopWidth: 0,
                elevation: 0,
                paddingTop: 6,
              },
              default: {
                display: "flex",
                paddingTop: 6,
                height: bottom + add,
                backgroundColor: Colors.backgroundElevated,
                borderTopWidth: 0,
                elevation: 0,
              },
            });
          })(),
        })}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                Icon={House}
                label="Home"
                focused={focused}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="sermons"
          options={{
            title: "Sermons",
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                Icon={Headphones}
                label="Sermons"
                focused={focused}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="community"
          options={{
            title: "Community",
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                Icon={Users}
                label="Community"
                focused={focused}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                Icon={UserRound}
                label="Profile"
                focused={focused}
                color={color}
              />
            ),
          }}
        />

        {/* Hidden legacy tabs — keep routes but hide from tab bar */}
        <Tabs.Screen
          name="giving"
          options={{ href: null }}
        />
        <Tabs.Screen
          name="library"
          options={{ href: null }}
        />
        <Tabs.Screen
          name="tv"
          options={{ href: null }}
        />
      </Tabs>

      {/* Mini Player sits above tab bar */}
      <View style={Platform.select({
        ios: { position: "absolute", bottom: bottom + 49, left: 0, right: 0 },
        default: { position: "absolute", bottom: bottom + add, left: 0, right: 0 },
      })}>
        <MiniPlayer />
      </View>
    </View>
  );
}
