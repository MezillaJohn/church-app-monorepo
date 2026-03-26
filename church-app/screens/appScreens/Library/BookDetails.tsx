import AppBackHeader from "@/components/AppBackHeader";
import AppImageBackground from "@/components/AppImageBackground";
import { AppText } from "@/components/AppText";
import { Screen } from "@/components/Screen";
import { Colors, Fonts } from "@/constants/theme";
import BookInfoSection from "@/screens/appScreens/Library/component/BookInfoSection";
import { useViewBooksByIdQuery } from "@/services/api/library";
import { moderateSize } from "@/utils/useResponsiveStyle";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, router } from "expo-router";
import React from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";

const BookDetails = () => {
  const params = useLocalSearchParams<{ id?: string; bookId?: string }>();
  const rawId = params.id ?? params.bookId;
  const bookId = Array.isArray(rawId) ? rawId[0] : rawId;

  const { data, isLoading, isFetching } = useViewBooksByIdQuery({ id: bookId! }, { skip: !bookId, refetchOnMountOrArgChange: true });

  const raw = data?.data as any;
  const attributes = {
    title: raw?.title ?? "",
    author: raw?.author ?? "",
    description: raw?.description ?? "",
    price: String(raw?.price ?? "0"),
    cover_image: raw?.coverImage ?? null,
    file_url: raw?.fileUrl ?? null,
    preview_pages: raw?.previewPages ?? "",
    purchases_count: raw?.purchasesCount ?? 0,
    average_rating: String(raw?.averageRating ?? "0"),
  } as Record<string, any>;
  const category = raw?.categoryId?.name ?? "Unknown";


  const book = raw ? attributes : null;

  if (isLoading || isFetching) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!book) {
    return (
      <View style={styles.loaderContainer}>
        <AppText style={{ color: Colors.deemedWhite }}>
          Book details not available.
        </AppText>
      </View>
    );
  }

  return (
    <LinearGradient colors={Colors.gradientDeep} style={styles.container}>
      <Screen safeAreaEdges={["top"]}>
        <AppBackHeader style={{ margin: 10 }} text="" />
        <ScrollView
          contentContainerStyle={{ paddingBottom: moderateSize(50) }}
          showsVerticalScrollIndicator={false}
        >
          {/* Book Cover Header */}
          <View style={styles.header}>
            <AppImageBackground
              source={{ uri: attributes.cover_image }}
              style={styles.coverImage}
            >
              <LinearGradient
                colors={["rgba(0,0,0,0.4)", "rgba(0,0,0,0.8)"]}
                style={styles.gradient}
              />
            </AppImageBackground>
          </View>

          <BookInfoSection
            bookId={bookId}
            attributes={attributes}
            category={category}
          />
        </ScrollView>
      </Screen>
    </LinearGradient>
  );
};

export default BookDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.dark,
  },
  header: {
    height: moderateSize(250),
    width: "100%",
  },
  coverImage: {
    flex: 1,
    justifyContent: "flex-end",
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  infoContainer: {
    marginTop: -moderateSize(10),
    backgroundColor: Colors.textInputGrey,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: moderateSize(16),
  },
  category: {
    fontFamily: Fonts.Medium,
    color: Colors.deemedWhite,
    fontSize: moderateSize(11),
  },
  title: {
    fontFamily: Fonts.Bold,
    color: Colors.white,
    fontSize: moderateSize(16),
    marginTop: 4,
  },
  author: {
    fontFamily: Fonts.Regular,
    color: Colors.deemedWhite,
    opacity: 0.8,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: "row",
    marginTop: moderateSize(10),
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: moderateSize(12),
  },
  statText: {
    color: Colors.deemedWhite,
    fontFamily: Fonts.Medium,
    fontSize: moderateSize(11),
    marginLeft: 4,
  },
  sectionTitle: {
    fontFamily: Fonts.SemiBold,
    color: Colors.white,
    fontSize: moderateSize(13),
    marginBottom: moderateSize(6),
  },
  description: {
    fontFamily: Fonts.Regular,
    color: Colors.deemedWhite,
    fontSize: moderateSize(12),
    lineHeight: moderateSize(18),
  },
  readMore: {
    fontFamily: Fonts.Medium,
    color: Colors.primary,
    fontSize: moderateSize(11),
    marginTop: moderateSize(6),
  },
  actionContainer: {
    marginTop: moderateSize(20),
  },
  price: {
    fontFamily: Fonts.Bold,
    color: Colors.white,
    fontSize: moderateSize(18),
    marginBottom: moderateSize(10),
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: moderateSize(10),
    alignItems: "center",
  },
  previewButton: {
    borderWidth: 1,
    borderColor: Colors.primary,
    marginRight: moderateSize(10),
  },
  previewText: {
    color: Colors.primary,
    fontFamily: Fonts.Medium,
    fontSize: moderateSize(12),
  },
  buyButton: {
    backgroundColor: Colors.primary,
  },
  buyText: {
    color: Colors.black,
    fontFamily: Fonts.Bold,
    fontSize: moderateSize(12),
  },
});
