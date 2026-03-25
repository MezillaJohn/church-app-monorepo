import React, { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  Bell,
  Bug,
  ChevronRight,
  Church,
  Download,
  Edit3,
  Globe,
  Heart,
  LogOut,
  Mail,
  Phone,
  Settings,
  Trash2,
  User,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Avatar, Badge, GlassCard, StatCard, Text } from "@/components/global";
import { Colors, Fonts, Gradients, whiteOpacity } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { useDisplayError } from "@/hooks/displayError";
import ReportBugModal from "@/screens/appScreens/Profile/component/ReportBugModal";
import { useLogoutMutation, useProfileQuery } from "@/services/api/profile";
import { useGetFavouriteSermonsQuery } from "@/services/api/sermon";
import { moderateSize } from "@/utils/useResponsiveStyle";

/* ── Reusable option row ── */
const OptionRow = ({
  icon,
  label,
  onPress,
  danger,
}: {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
  danger?: boolean;
}) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [
      styles.optionRow,
      pressed && { backgroundColor: whiteOpacity("0.04") },
    ]}
  >
    <View style={styles.optionLeft}>
      {icon}
      <Text
        variant="bodyMedium"
        style={danger ? { color: Colors.error } : undefined}
      >
        {label}
      </Text>
    </View>
    <ChevronRight
      size={16}
      color={danger ? Colors.error : Colors.textMuted}
    />
  </Pressable>
);

/* ── Profile info row ── */
const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string | null;
}) => {
  if (!value) return null;
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoLeft}>
        {icon}
        <Text variant="caption" color="muted">
          {label}
        </Text>
      </View>
      <Text variant="caption" numberOfLines={1} style={{ flex: 1, textAlign: "right" }}>
        {value}
      </Text>
    </View>
  );
};

const Profile = () => {
  const [bugModalVisible, setBugModalVisible] = useState(false);
  const { data } = useProfileQuery(null);
  const { data: favouritesData } = useGetFavouriteSermonsQuery(null);
  const [logoutMutation, { isLoading: loading, error: err }] =
    useLogoutMutation();
  useDisplayError(err);
  const { logout } = useAuth();

  const user = data?.data;
  const churchCenter = user?.churchCentreId;
  const favCount = favouritesData?.data?.length ?? 0;

  const handleLogout = () => {
    logoutMutation({})
      .unwrap()
      .then(() => logout())
      .catch((err: any) => console.log(err, "error"));
  };

  return (
    <LinearGradient
      colors={Gradients.screen as unknown as string[]}
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* ── Banner + Avatar ── */}
          <View style={styles.bannerSection}>
            <LinearGradient
              colors={[Colors.primary, "#00B894", Colors.backgroundElevated]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.banner}
            />
            <View style={styles.avatarContainer}>
              <Avatar name={user?.name} size={moderateSize(80)} showRing />
            </View>
            <Text variant="heading2" style={styles.userName}>
              {user?.name}
            </Text>
            <Text variant="caption" color="muted" style={{ marginTop: 2 }}>
              {user?.email}
            </Text>
            <View style={{ marginTop: moderateSize(10) }}>
              <Badge
                label={user?.churchMember ? "Church Member" : "Visitor"}
                variant="primary"
              />
            </View>
          </View>

          {/* ── Stats ── */}
          <View style={styles.statsRow}>
            <StatCard
              label="Favourites"
              value={favCount}
              icon={<Heart size={14} color={Colors.primary} />}
            />
            <StatCard
              label="Downloads"
              value="—"
              icon={<Download size={14} color={Colors.accent3} />}
              color={Colors.accent3}
            />
            <StatCard
              label="Donations"
              value="—"
              icon={<Heart size={14} color={Colors.accent2} />}
              color={Colors.accent2}
            />
          </View>

          {/* ── Profile Details ── */}
          <GlassCard style={styles.card}>
            <Text variant="overline" color="muted" style={styles.sectionLabel}>
              PROFILE DETAILS
            </Text>
            <InfoRow
              icon={<User size={14} color={Colors.primary} />}
              label="Gender"
              value={user?.gender}
            />
            <InfoRow
              icon={<Mail size={14} color={Colors.primary} />}
              label="Email"
              value={user?.email}
            />
            <InfoRow
              icon={<Phone size={14} color={Colors.primary} />}
              label="Phone"
              value={user?.phone}
            />
            {churchCenter && (
              <InfoRow
                icon={<Church size={14} color={Colors.primary} />}
                label="Church Centre"
                value={churchCenter}
              />
            )}
            <InfoRow
              icon={<Globe size={14} color={Colors.primary} />}
              label="Country"
              value={user?.country}
            />
          </GlassCard>

          {/* ── My Content ── */}
          <GlassCard style={styles.card}>
            <Text variant="overline" color="muted" style={styles.sectionLabel}>
              MY CONTENT
            </Text>
            <OptionRow
              icon={<Heart size={18} color={Colors.primary} />}
              label="My Favourites"
              onPress={() => router.navigate("/(tabs)/profile/favourite")}
            />
            <OptionRow
              icon={<Download size={18} color={Colors.accent3} />}
              label="My Downloads"
              onPress={() => router.navigate("/(tabs)/profile/downloads")}
            />
            <OptionRow
              icon={<Bell size={18} color={Colors.accent2} />}
              label="Notifications"
              onPress={() => router.push("/stack/notification")}
            />
          </GlassCard>

          {/* ── Account ── */}
          <GlassCard style={styles.card}>
            <Text variant="overline" color="muted" style={styles.sectionLabel}>
              ACCOUNT
            </Text>
            <OptionRow
              icon={<Edit3 size={18} color={Colors.primary} />}
              label="Update Profile"
              onPress={() => router.navigate("/(tabs)/profile/updateProfile")}
            />
            <OptionRow
              icon={<Settings size={18} color={Colors.primary} />}
              label="Change Password"
              onPress={() =>
                router.navigate("/(tabs)/profile/changePassword")
              }
            />
            <OptionRow
              icon={<Bug size={18} color={Colors.warning} />}
              label="Report a Bug"
              onPress={() => setBugModalVisible(true)}
            />
          </GlassCard>

          {/* ── Danger Zone ── */}
          <GlassCard style={styles.card}>
            <Text variant="overline" color="muted" style={styles.sectionLabel}>
              DANGER ZONE
            </Text>
            <OptionRow
              icon={<Trash2 size={18} color={Colors.error} />}
              label="Delete Account"
              onPress={() => router.push("/profile/deleteAccont")}
              danger
            />
          </GlassCard>

          {/* ── Log Out ── */}
          <Pressable
            onPress={handleLogout}
            style={({ pressed }) => [
              styles.logoutButton,
              pressed && { opacity: 0.7 },
            ]}
          >
            {loading ? (
              <ActivityIndicator color={Colors.text} />
            ) : (
              <View style={styles.logoutInner}>
                <LogOut size={16} color={Colors.textMuted} />
                <Text variant="bodyMedium" color="muted">
                  Log Out
                </Text>
              </View>
            )}
          </Pressable>

          {/* ── Footer ── */}
          <View style={styles.footer}>
            <Text variant="small" color="muted" style={{ textAlign: "center" }}>
              "Excellence is not a skill; it's an attitude."
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>

      <ReportBugModal
        visible={bugModalVisible}
        onClose={() => setBugModalVisible(false)}
      />
    </LinearGradient>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: { flex: 1 },

  /* Banner */
  bannerSection: {
    alignItems: "center",
    paddingBottom: moderateSize(20),
  },
  banner: {
    width: "100%",
    height: moderateSize(100),
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  avatarContainer: {
    marginTop: moderateSize(-40),
    marginBottom: moderateSize(10),
  },
  userName: {
    textAlign: "center",
  },

  /* Stats */
  statsRow: {
    flexDirection: "row",
    gap: moderateSize(10),
    marginHorizontal: moderateSize(20),
    marginBottom: moderateSize(8),
  },

  /* Cards */
  card: {
    marginHorizontal: moderateSize(15),
    marginTop: moderateSize(12),
  },
  sectionLabel: {
    marginBottom: moderateSize(8),
  },

  /* Info rows */
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: moderateSize(10),
    borderBottomWidth: 1,
    borderBottomColor: whiteOpacity("0.04"),
  },
  infoLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateSize(8),
  },

  /* Option rows */
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: moderateSize(13),
    borderRadius: 10,
    borderCurve: "continuous",
    paddingHorizontal: 4,
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateSize(12),
  },

  /* Logout */
  logoutButton: {
    marginHorizontal: moderateSize(15),
    marginTop: moderateSize(20),
    borderRadius: 14,
    borderCurve: "continuous",
    height: moderateSize(48),
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: whiteOpacity("0.1"),
    backgroundColor: whiteOpacity("0.04"),
  },
  logoutInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  /* Footer */
  footer: {
    alignItems: "center",
    marginVertical: moderateSize(30),
    paddingHorizontal: moderateSize(20),
  },
});
