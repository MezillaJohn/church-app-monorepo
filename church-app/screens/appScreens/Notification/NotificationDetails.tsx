import AppBackHeader from "@/components/AppBackHeader";
import { AppText } from "@/components/AppText";
import { Colors, Fonts } from "@/constants/theme";
import { moderateSize } from "@/utils/useResponsiveStyle";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Calendar } from "lucide-react-native";

export default function NotificationDetails() {
    const params = useLocalSearchParams<{
        title: string;
        body: string;
        date: string;
    }>();

    const { title, body, date } = params;

    return (
        <LinearGradient colors={Colors.gradientDeep} style={styles.container}>
            <SafeAreaView style={styles.safeArea} edges={["top"]}>
                <AppBackHeader text="Notification Details" />
                <ScrollView contentContainerStyle={styles.content}>
                    <View style={styles.card}>
                        <AppText style={styles.title}>{title}</AppText>

                        <View style={styles.metaRow}>
                            <Calendar size={14} color={Colors.deemedWhite} />
                            <AppText style={styles.date}>{date}</AppText>
                        </View>

                        <View style={styles.divider} />

                        <AppText style={styles.body}>{body}</AppText>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    content: {
        padding: moderateSize(16),
    },
    card: {
        backgroundColor: "rgba(255,255,255,0.05)",
        borderRadius: 16,
        padding: moderateSize(20),
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.1)",
    },
    title: {
        color: Colors.white,
        fontFamily: Fonts.Bold,
        fontSize: moderateSize(18),
        marginBottom: moderateSize(10),
    },
    metaRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginBottom: moderateSize(20),
    },
    date: {
        color: Colors.deemedWhite,
        fontFamily: Fonts.Regular,
        fontSize: moderateSize(12),
        opacity: 0.8,
    },
    divider: {
        height: 1,
        backgroundColor: "rgba(255,255,255,0.1)",
        marginBottom: moderateSize(20),
    },
    body: {
        color: Colors.deemedWhite,
        fontFamily: Fonts.Regular,
        fontSize: moderateSize(14),
        lineHeight: moderateSize(24),
    },
});
