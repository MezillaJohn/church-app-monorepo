import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Clock } from "lucide-react-native";
import { GlassCard, Text } from "@/components/global";
import { Colors } from "@/constants/theme";
import { moderateSize } from "@/utils/useResponsiveStyle";
import { useServiceTimesQuery } from "@/services/api/public";

export const ServiceTimesCard: React.FC = () => {
  const { data, isLoading } = useServiceTimesQuery(null);
  const serviceTimes = data?.data ?? [];

  if (isLoading) {
    return (
      <GlassCard style={styles.card} elevated>
        <ActivityIndicator color={Colors.primary} />
      </GlassCard>
    );
  }

  if (serviceTimes.length === 0) return null;

  return (
    <GlassCard style={styles.card} elevated>
      <View style={styles.header}>
        <Clock size={moderateSize(16)} color={Colors.primary} />
        <Text variant="overline" color="accent">
          SERVICE TIMES
        </Text>
      </View>
      {serviceTimes.map((service, i) => (
        <View
          key={service._id}
          style={[
            styles.row,
            i < serviceTimes.length - 1 && styles.rowBorder,
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
