import React from "react";
import { StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { Heart, Clock3 } from "lucide-react-native";
import { Button, GlassCard, Text } from "@/components/global";
import { Colors } from "@/constants/theme";
import { moderateSize } from "@/utils/useResponsiveStyle";

export const GivingSection: React.FC = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <GlassCard elevated>
        <View style={styles.iconRow}>
          <View style={styles.iconCircle}>
            <Heart size={moderateSize(24)} color={Colors.primary} fill={Colors.primary} />
          </View>
        </View>
        <Text variant="heading2" style={styles.title}>
          Give to the Kingdom
        </Text>
        <Text variant="body" color="muted" style={styles.subtitle}>
          Your generosity makes a difference. Sow a seed today and watch God
          multiply it.
        </Text>
        <Button
          title="Give Now"
          onPress={() => router.push("/(tabs)/giving")}
          style={styles.button}
        />
        <Button
          title="Giving History"
          variant="ghost"
          icon={<Clock3 size={16} color={Colors.textMuted} />}
          onPress={() => router.push("/(tabs)/giving/history")}
          style={styles.historyButton}
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
    backgroundColor: "rgba(0,217,166,0.10)",
    borderWidth: 1,
    borderColor: "rgba(0,217,166,0.20)",
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
  button: {
    marginBottom: moderateSize(10),
  },
  historyButton: {},
});
