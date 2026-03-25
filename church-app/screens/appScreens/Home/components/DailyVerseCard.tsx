import React from "react";
import { Pressable, Share, StyleSheet, View } from "react-native";
import { Share2 } from "lucide-react-native";
import { GlassCard, Text } from "@/components/global";
import { Colors } from "@/constants/theme";
import { moderateSize } from "@/utils/useResponsiveStyle";

// Will be populated with the full 365 verses JSON
let dailyVerses: { day: number; verse: string; reference: string }[] = [];
try {
  dailyVerses = require("@/assets/data/daily-verses.json");
} catch {
  dailyVerses = [
    {
      day: 1,
      verse:
        "For I know the plans I have for you, declares the LORD, plans to prosper you and not to harm you, plans to give you hope and a future.",
      reference: "Jeremiah 29:11",
    },
  ];
}

const getDayOfYear = (): number => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};

export const DailyVerseCard: React.FC = () => {
  const dayOfYear = getDayOfYear();
  const index = (dayOfYear - 1) % dailyVerses.length;
  const todayVerse = dailyVerses[index] || dailyVerses[0];

  const handleShare = () => {
    Share.share({
      message: `"${todayVerse.verse}" — ${todayVerse.reference}`,
    });
  };

  return (
    <GlassCard elevated style={styles.card}>
      <View style={styles.header}>
        <Text variant="overline" color="accent">
          VERSE OF THE DAY
        </Text>
        <Pressable onPress={handleShare} hitSlop={8}>
          <Share2 size={moderateSize(16)} color={Colors.textMuted} strokeWidth={1.8} />
        </Pressable>
      </View>
      <Text variant="body" style={styles.verse}>
        "{todayVerse.verse}"
      </Text>
      <Text variant="caption" style={{ color: Colors.primary, marginTop: 8 }}>
        — {todayVerse.reference}
      </Text>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: moderateSize(20),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: moderateSize(10),
  },
  verse: {
    fontStyle: "italic",
    lineHeight: 24,
    color: Colors.textSecondary,
  },
});
