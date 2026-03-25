import React from "react";
import { StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { Handshake } from "lucide-react-native";
import { Button, GlassCard, Text } from "@/components/global";
import { Colors } from "@/constants/theme";
import { moderateSize } from "@/utils/useResponsiveStyle";

export const PartnerSection: React.FC = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <GlassCard elevated>
        <View style={styles.iconRow}>
          <View style={styles.iconCircle}>
            <Handshake
              size={moderateSize(24)}
              color={Colors.accent2}
              strokeWidth={1.8}
            />
          </View>
        </View>
        <Text variant="heading2" style={styles.title}>
          Become a Partner
        </Text>
        <Text variant="body" color="muted" style={styles.subtitle}>
          Join our partners in ministry. Your consistent giving helps us spread
          the gospel to the nations.
        </Text>
        <Button
          title="Start Partnership"
          onPress={() => router.push("/stack/partnership")}
          gradientColors={["#A78BFA", "#8B5CF6", "#7C3AED"]}
        />
      </GlassCard>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: moderateSize(20),
    paddingBottom: moderateSize(100),
  },
  iconRow: {
    alignItems: "center",
    marginBottom: moderateSize(16),
  },
  iconCircle: {
    width: moderateSize(56),
    height: moderateSize(56),
    borderRadius: moderateSize(28),
    backgroundColor: "rgba(167,139,250,0.10)",
    borderWidth: 1,
    borderColor: "rgba(167,139,250,0.20)",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
    marginBottom: 6,
  },
  subtitle: {
    textAlign: "center",
    marginBottom: moderateSize(20),
  },
});
