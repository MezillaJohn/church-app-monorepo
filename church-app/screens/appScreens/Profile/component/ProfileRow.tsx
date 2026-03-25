import { AppText } from "@/components/AppText";
import { Colors, Fonts } from "@/constants/theme";
import { moderateSize } from "@/utils/useResponsiveStyle";
import React from "react";
import { StyleSheet, View } from "react-native";

interface ProfileInfoRowProps {
  icon: React.ReactNode;
  label: string;
  value?: string | null;
  maxLength?: number; // default 40
}

const truncateText = (text: string, max: number) => {
  if (!text) return "";
  return text.length > max ? text.substring(0, max) + "..." : text;
};

const ProfileInfoRow: React.FC<ProfileInfoRowProps> = ({
  icon,
  label,
  value,
  maxLength = 30,
}) => {
  return (
    <View style={styles.infoRow}>
      {icon}
      <AppText style={styles.label}>{label}</AppText>

      <AppText style={styles.value}>
        {truncateText(value ?? "", maxLength)}
      </AppText>
    </View>
  );
};

export default ProfileInfoRow;

const styles = StyleSheet.create({
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(255,255,255,0.08)",
    paddingVertical: moderateSize(10),
  },
  label: {
    flex: 1,
    color: Colors.muted,
    fontFamily: Fonts.Medium,
    fontSize: moderateSize(12),
    marginLeft: 8,
    marginRight: 30,
  },
  value: {
    color: Colors.white,
    fontFamily: Fonts.SemiBold,
    fontSize: moderateSize(12),
    maxWidth: "50%",
    textAlign: "right",
  },
});
