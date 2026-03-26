import AppBackHeader from "@/components/AppBackHeader";
import { AppText } from "@/components/AppText";
import { Screen } from "@/components/Screen";
import { Colors, Fonts } from "@/constants/theme";
import { useHistoryQuery } from "@/services/api/giving";
import { DonationHistoryItem } from "@/services/api/giving/type";
import { moderateSize } from "@/utils/useResponsiveStyle";
import { LinearGradient } from "expo-linear-gradient";
import { Cross, Gift, HandCoins, Heart } from "lucide-react-native";
import moment from "moment";
import React from "react";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";

// icons map
const typeIcons = {
  tithe: HandCoins,
  offering: Gift,
  missions: Cross,
  thanksgiving: Heart,
};

const HistoryScreen = () => {
  const { data, isLoading } = useHistoryQuery(null);
  const donationHistory = data?.data || [];

  const renderItem = ({ item }: { item: any }) => {
    const amount = item.amount;
    const status = item.status;
    const name = item.donationTypeId?.name ?? "Donation";
    const date = moment(item.createdAt).format("MMM D, YYYY • h:mm A");

    const Icon = Gift;

    const statusColor =
      status === "completed"
        ? Colors.success
        : status === "pending"
          ? Colors.primary
          : Colors.red;

    return (
      <LinearGradient
        colors={[Colors.surface, Colors.dark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View style={styles.rowBetween}>
          <View style={styles.leftSection}>
            <View style={styles.iconWrapper}>
              <Icon size={moderateSize(16)} color={Colors.primary} />
            </View>
            <View>
              <AppText style={styles.type}>
                {name?.charAt(0).toUpperCase() + name?.slice(1)}
              </AppText>
              <AppText style={styles.date}>{date}</AppText>
            </View>
          </View>

          <View style={{ alignItems: "flex-end" }}>
            <AppText style={styles.amount}>₦{amount}</AppText>
            <AppText style={[styles.status, { color: statusColor }]}>
              {status.toLowerCase()}
            </AppText>
          </View>
        </View>
      </LinearGradient>
    );
  };

  if (isLoading) {
    return (
      <Screen style={styles.container} safeAreaEdges={["top"]}>
        <AppBackHeader text="History" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen
      safeAreaEdges={["top"]}
      preset={donationHistory.length > 0 ? "fixed" : undefined}
      style={styles.container}
    >
      <AppBackHeader text="History" />

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : donationHistory.length > 0 ? (
        <FlatList
          data={donationHistory}
          renderItem={renderItem}
          keyExtractor={(item: any) => (item._id ?? item.id).toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 60, paddingTop: 30 }}
        />
      ) : (
        <View style={styles.emptyState}>
          <AppText style={styles.emptyText}>
            You have no donation history yet.
          </AppText>
        </View>
      )}
    </Screen>
  );
};

export default HistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: moderateSize(15),
    backgroundColor: Colors.black,
  },
  title: {
    fontSize: moderateSize(20),
    color: Colors.white,
    fontFamily: Fonts.SemiBold,
    marginBottom: moderateSize(15),
  },
  card: {
    borderRadius: 16,
    padding: moderateSize(14),
    marginBottom: moderateSize(10),
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 10,
  },
  iconWrapper: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 10,
    padding: moderateSize(8),
  },
  type: {
    fontSize: moderateSize(12),
    color: Colors.white,
    fontFamily: Fonts.Medium,
  },
  date: {
    fontSize: moderateSize(10),
    color: Colors.deemedWhite,
    marginTop: 2,
  },
  amount: {
    fontSize: moderateSize(12),
    fontFamily: Fonts.SemiBold,
    color: Colors.white,
  },
  status: {
    fontSize: moderateSize(10),
    marginTop: 2,
    fontFamily: Fonts.Medium,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: Colors.deemedWhite,
    fontSize: moderateSize(14),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
