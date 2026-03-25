import { AppText } from "@/components/AppText";
import { Colors, Fonts, whiteOpacity } from "@/constants/theme";
import { moderateSize } from "@/utils/useResponsiveStyle";
import { ChevronRight } from "lucide-react-native";
import { Href, Link } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

interface SectionHeaderProps {
  text: string;
  rightText?: string;
  route?: Href;
}

const SectionHeader = ({ text, rightText, route }: SectionHeaderProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftRow}>
        <View style={styles.accentBar} />
        <AppText style={styles.leftText}>{text}</AppText>
      </View>

      {rightText && (
        <Link href={route ?? "/"}>
          <View style={styles.rightRow}>
            <AppText style={styles.rightText}>{rightText}</AppText>
            <ChevronRight size={14} color={Colors.primary} />
          </View>
        </Link>
      )}
    </View>
  );
};

export default SectionHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: moderateSize(16),
  },
  leftRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateSize(8),
  },
  accentBar: {
    width: 3,
    height: 16,
    borderRadius: 2,
    backgroundColor: Colors.primary,
  },
  leftText: {
    fontFamily: Fonts.Bold,
    fontSize: moderateSize(15),
    color: Colors.white,
    letterSpacing: -0.2,
  },
  rightRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  rightText: {
    fontFamily: Fonts.Medium,
    fontSize: moderateSize(12),
    color: Colors.primary,
  },
});
