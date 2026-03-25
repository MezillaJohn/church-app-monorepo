import { AppText } from "@/components/AppText";
import CustomButton from "@/components/Buttons/CustomButton";
import { Colors, Fonts, whiteOpacity } from "@/constants/theme";
import { moderateSize, Size } from "@/utils/useResponsiveStyle";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Church } from "lucide-react-native";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const LandingPage = () => {
  const router = useRouter();
  const { top, bottom } = useSafeAreaInsets();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        damping: 15,
        stiffness: 80,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        damping: 12,
        stiffness: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <LinearGradient
      colors={["#0A0E1A", "#0D1225", "#111830"]}
      style={styles.container}
    >
      {/* Decorative gradient orbs */}
      <View style={styles.orbContainer}>
        <LinearGradient
          colors={["rgba(0,217,166,0.12)", "transparent"]}
          style={[styles.orb, styles.orbTopRight]}
        />
        <LinearGradient
          colors={["rgba(0,217,166,0.06)", "transparent"]}
          style={[styles.orb, styles.orbBottomLeft]}
        />
      </View>

      <View style={[styles.content, { paddingTop: top + moderateSize(40) }]}>
        {/* Logo & Brand */}
        <Animated.View
          style={[
            styles.logoSection,
            { opacity: fadeAnim, transform: [{ scale: logoScale }] },
          ]}
        >
          <View style={styles.logoCircle}>
            <Church
              size={moderateSize(28)}
              color={Colors.primary}
              strokeWidth={1.8}
            />
          </View>
          <AppText style={styles.brandName}>Church App</AppText>
          <View style={styles.divider} />
        </Animated.View>

        {/* Hero text */}
        <Animated.View
          style={[
            styles.heroSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <AppText style={styles.heroTitle}>
            Welcome to{"\n"}Your{" "}
            <AppText style={[styles.heroTitle, styles.heroAccent]}>
              Community
            </AppText>
          </AppText>
          <AppText style={styles.heroSubtitle}>
            Connect, grow, and stay inspired with your church family
          </AppText>
        </Animated.View>

        {/* Bottom section */}
        <Animated.View
          style={[
            styles.bottomSection,
            {
              paddingBottom: bottom + moderateSize(20),
              opacity: fadeAnim,
            },
          ]}
        >
          {/* Feature pills */}
          <View style={styles.pillRow}>
            {["Sermons", "Events", "Giving", "Community"].map((label) => (
              <View key={label} style={styles.pill}>
                <View style={styles.pillDot} />
                <AppText style={styles.pillText}>{label}</AppText>
              </View>
            ))}
          </View>

          <CustomButton
            onPress={() => router.push("/(auth)/userDetails")}
            title="Get Started"
            style={{ marginBottom: moderateSize(12) }}
          />
          <CustomButton
            onPress={() => router.push("/login")}
            outlined
            title="I already have an account"
          />
        </Animated.View>
      </View>
    </LinearGradient>
  );
};

export default LandingPage;

const styles = StyleSheet.create({
  container: { flex: 1 },
  orbContainer: { ...StyleSheet.absoluteFillObject },
  orb: {
    position: "absolute",
    width: Size.getWidth() * 0.8,
    height: Size.getWidth() * 0.8,
    borderRadius: Size.getWidth() * 0.4,
  },
  orbTopRight: { top: -100, right: -100 },
  orbBottomLeft: { bottom: -50, left: -100 },
  content: {
    flex: 1,
    paddingHorizontal: moderateSize(24),
    justifyContent: "space-between",
  },
  logoSection: { alignItems: "center", marginTop: moderateSize(20) },
  logoCircle: {
    width: moderateSize(60),
    height: moderateSize(60),
    borderRadius: moderateSize(30),
    backgroundColor: whiteOpacity("0.06"),
    borderWidth: 1,
    borderColor: whiteOpacity("0.1"),
    alignItems: "center",
    justifyContent: "center",
  },
  brandName: {
    fontSize: moderateSize(14),
    fontFamily: Fonts.SemiBold,
    color: Colors.white,
    marginTop: moderateSize(12),
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  divider: {
    width: 40,
    height: 2,
    backgroundColor: Colors.primary,
    marginTop: moderateSize(12),
    borderRadius: 1,
  },
  heroSection: { alignItems: "center" },
  heroTitle: {
    fontSize: moderateSize(30),
    fontFamily: Fonts.Bold,
    color: Colors.white,
    textAlign: "center",
    lineHeight: moderateSize(38),
  },
  heroAccent: { color: Colors.primary },
  heroSubtitle: {
    fontSize: moderateSize(14),
    fontFamily: Fonts.Regular,
    color: Colors.muted,
    textAlign: "center",
    marginTop: moderateSize(14),
    lineHeight: moderateSize(22),
    maxWidth: "85%",
  },
  bottomSection: {},
  pillRow: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: moderateSize(8),
    marginBottom: moderateSize(32),
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: moderateSize(14),
    paddingVertical: moderateSize(8),
    borderRadius: 20,
    backgroundColor: whiteOpacity("0.06"),
    borderWidth: 1,
    borderColor: whiteOpacity("0.08"),
  },
  pillDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: Colors.primary,
  },
  pillText: {
    fontSize: moderateSize(11),
    fontFamily: Fonts.Medium,
    color: Colors.muted,
  },
});
