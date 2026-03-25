import React from "react";
import { StyleSheet, View } from "react-native";
import { Clock } from "lucide-react-native";
import { GlassCard, Text } from "@/components/global";
import { Colors } from "@/constants/theme";
import { moderateSize } from "@/utils/useResponsiveStyle";

const SERVICE_TIMES = [
  { day: "Sunday", time: "9:00 AM & 11:00 AM", label: "Main Service" },
  { day: "Wednesday", time: "6:30 PM", label: "Midweek Service" },
];

export const ServiceTimesCard: React.FC = () => {
  return (
    <GlassCard style={styles.card} elevated>
      <View style={styles.header}>
        <Clock size={moderateSize(16)} color={Colors.primary} />
        <Text variant="overline" color="accent">
          SERVICE TIMES
        </Text>
      </View>
      {SERVICE_TIMES.map((service, i) => (
        <View
          key={i}
          style={[
            styles.row,
            i < SERVICE_TIMES.length - 1 && styles.rowBorder,
          ]}
        >
          <View>
            <Text variant="bodyMedium">{service.day}</Text>
            <Text variant="small" color="muted">
              {service.label}
            </Text>
          </View>
          <Text variant="caption" style={{ color: Colors.primary }}>
            {service.time}
          </Text>
        </View>
      ))}
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: moderateSize(20),
    marginBottom: moderateSize(16),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateSize(6),
    marginBottom: moderateSize(12),
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: moderateSize(10),
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },
});
