import AppImageBackground from "@/components/AppImageBackground";
import { AppText } from "@/components/AppText";
import PaymentWebSheet from "@/components/PaymentWebSheet";
import { Colors, Fonts } from "@/constants/theme";
import { useDisplayError } from "@/hooks/displayError";
import { useAppDispatch } from "@/hooks/useTypedSelector";
import FeaturedBooksSkeleton from "@/screens/appScreens/Library/component/FeaturedBooksSkeleton";
import PurchaseGuideModal from "@/screens/appScreens/Library/component/PurchaseGuideModal";
import {
  libraryEndpoints,
  useBuyBookMutation,
  useFeaturedBooksQuery,
} from "@/services/api/library";
import { MyBookItem } from "@/services/api/library/types";
import { moderateSize } from "@/utils/useResponsiveStyle";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { ArrowRight } from "lucide-react-native";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Linking,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

const LibraryHeader = () => {
  const [purchaseGuideVisible, setPurchaseGuideVisible] = useState(false);

  const [selectedBook, setselectedBook] = useState<MyBookItem | null>(null);

  const [webVisible, setWebVisible] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);

  const { data, isLoading } = useFeaturedBooksQuery(null);
  const featuredBooks = data?.data ?? [];

  const [buyBookMutation, { isLoading: buyLoading, error }] =
    useBuyBookMutation();

  useDisplayError(error);
  const dispatch = useAppDispatch();

  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleBuyBook = (book: MyBookItem) => {
    setselectedBook(book);
    setPurchaseGuideVisible(true);
  };

  const handleProceed = () => {
    setPurchaseGuideVisible(false); // close guide
    buyBookMutation({ id: selectedBook?.id })
      .unwrap()
      .then((res) => {
        if (res?.data?.authorization_url) {
          if (Platform.OS === "android") {
            setPaymentUrl(res.data.authorization_url);
            setWebVisible(true);
          } else {
            Linking.openURL(res.data.authorization_url);
          }
        }
      })
      .catch((err) => console.log(err));
  };

  const handleWebNavigation = (navState: any) => {
    const { url } = navState;

    if (url.startsWith("https://godhouse.org/")) {
      setWebVisible(false);
      alert("✅ Payment is Successful.");
      router.push("/(tabs)/library");

      dispatch(
        libraryEndpoints.util.prefetch("myBooks", { page: 1 }, {
          force: true,
        })
      );
    }
    if (url.includes("cancel") || url.includes("close")) {
      setWebVisible(false);
    }
  };

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(index);
  };

  const handleOpenPdf = (url: string) => {
    router.navigate({
      pathname: "/(tabs)/library/readPdf",
      params: { bookUrl: url },
    });
  };

  const handleNavToBookDetails = (id: number | string) => {
    router.navigate({
      pathname: "/(tabs)/library/bookDetails",
      params: { id: id.toString() },
    });
  };

  return (
    <View>
      {isLoading ? (
        <FeaturedBooksSkeleton />
      ) : (
        <FlatList
          ref={flatListRef}
          data={featuredBooks}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            const attrs = item.attributes;

            return (
              <Pressable
                onPress={() => handleNavToBookDetails(item?.id)}
                style={styles.slide}
              >
                <AppImageBackground
                  source={{ uri: attrs.cover_image }}
                  style={styles.image}
                  imageStyle={styles.imageStyle}
                >
                  <LinearGradient
                    colors={["rgba(0,0,0,0.1)", "rgba(0,0,0,0.85)"]}
                    style={styles.gradient}
                  />

                  <View style={styles.textOverlay}>
                    <AppText style={styles.title}>{attrs.title}</AppText>

                    <AppText numberOfLines={1} style={styles.subtitle}>
                      {attrs.description}
                    </AppText>

                    <TouchableOpacity
                      onPress={() =>
                        attrs?.file_url
                          ? handleOpenPdf(attrs?.file_url)
                          : handleBuyBook(item)
                      }
                      style={styles.ctaButton}
                    >
                      {buyLoading ? (
                        <ActivityIndicator color={Colors.white} />
                      ) : (
                        <>
                          <AppText style={styles.ctaText}>
                            {attrs?.file_url ? "Read Now" : "Buy Now"}
                          </AppText>
                          <ArrowRight
                            size={16}
                            color={Colors.white}
                            style={{ marginLeft: 6 }}
                          />
                        </>
                      )}
                    </TouchableOpacity>
                  </View>
                </AppImageBackground>
              </Pressable>
            );
          }}
        />
      )}

      {/* 🔵 Pagination Dots */}
      <View style={styles.dotsWrapper}>
        {featuredBooks?.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, i === activeIndex && styles.activeDot]}
          />
        ))}
      </View>

      {/* Payment Sheet */}
      <PaymentWebSheet
        title="Book Purchase"
        visible={webVisible}
        onClose={() => setWebVisible(false)}
        paymentUrl={paymentUrl}
        onNavigationStateChange={handleWebNavigation}
      />

      <PurchaseGuideModal
        visible={purchaseGuideVisible}
        onClose={() => setPurchaseGuideVisible(false)}
        onProceed={handleProceed}
      />
    </View>
  );
};

export default LibraryHeader;

const styles = StyleSheet.create({
  slide: {
    width: width,
    height: moderateSize(200),
  },
  image: {
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
  },
  imageStyle: {
    resizeMode: "cover",
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  textOverlay: {
    padding: moderateSize(20),
  },
  title: {
    color: Colors.white,
    fontFamily: Fonts.Bold,
    fontSize: moderateSize(18),
    marginBottom: 4,
  },
  subtitle: {
    color: Colors.deemedWhite,
    fontFamily: Fonts.Medium,
    fontSize: moderateSize(12),
    marginBottom: 10,
  },
  ctaButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingVertical: moderateSize(6),
    paddingHorizontal: moderateSize(12),
    borderRadius: moderateSize(30),
    alignSelf: "flex-start",
  },
  ctaText: {
    color: Colors.white,
    fontFamily: Fonts.SemiBold,
    fontSize: moderateSize(12),
  },
  dotsWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: moderateSize(10),
    marginBottom: moderateSize(5),
  },
  dot: {
    width: moderateSize(6),
    height: moderateSize(6),
    borderRadius: moderateSize(20),
    backgroundColor: "rgba(255,255,255,0.3)",
    marginHorizontal: moderateSize(4),
  },
  activeDot: {
    backgroundColor: Colors.white,
    width: moderateSize(7),
    height: moderateSize(7),
  },
});
