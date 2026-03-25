import { AppText } from "@/components/AppText";
import CustomButton from "@/components/Buttons/CustomButton";
import PaymentWebSheet from "@/components/PaymentWebSheet";
import { Colors, Fonts } from "@/constants/theme";
import { useAppAlert } from "@/context/AlertContext";
import { useDisplayError } from "@/hooks/displayError";
import { useShare } from "@/hooks/useShare";
import { useAppDispatch } from "@/hooks/useTypedSelector";
import PurchaseGuideModal from "@/screens/appScreens/Library/component/PurchaseGuideModal";
import { libraryEndpoints, useBuyBookMutation, useCheckPurchaseQuery } from "@/services/api/library";
import { moderateSize } from "@/utils/useResponsiveStyle";
import { router } from "expo-router";
import { BookOpen, Eye, Share2, Star } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Linking,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

interface BookInfoSectionProps {
  attributes: Record<string, any>;
  category: string;
  bookId: string;
}

const BookInfoSection: React.FC<BookInfoSectionProps> = ({
  attributes,
  category,
  bookId,
}) => {
  const { data: purchaseData } = useCheckPurchaseQuery(
    { id: bookId },
    { skip: !bookId },
  );
  const hasPurchased = purchaseData?.data?.purchased ?? false;
  const isFree = attributes.price === "0" || attributes.price === "0.00";

  const [purchaseGuideVisible, setPurchaseGuideVisible] = useState(false);

  const [expanded, setExpanded] = useState(false);
  const [webVisible, setWebVisible] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);

  const [buyBookMutation, { isLoading, error }] = useBuyBookMutation();

  useDisplayError(error);

  const { share } = useShare();

  const dispatch = useAppDispatch();

  const { alert } = useAppAlert();

  const description = attributes.description || "";
  const truncatedDescription =
    description.length > 120 && !expanded
      ? `${description.slice(0, 120)}...`
      : description;

  const handleBuyBook = () => {
    setPurchaseGuideVisible(true); // Step 1: show guide
  };

  const handleProceed = () => {
    setPurchaseGuideVisible(false); // close guide
    buyBookMutation({ id: bookId })
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
    if (
      url.includes("https://godhouse.org/") ||
      url === "https://godhouse.org/"
    ) {
      setWebVisible(false);
      alert("✅ Payment is Successful.");
      router.push("/(tabs)/library");
      dispatch(
        libraryEndpoints.util.prefetch("myBooks", null, {
          force: true,
        }),
      );
    }
    if (url.includes("cancel") || url.includes("close")) {
      setWebVisible(false);
      console.log("❌ Payment cancelled");
    }
  };

  const handleOpenPdf = () => {
    router.navigate({
      pathname: "/(tabs)/library/readPdf",
      params: { bookUrl: attributes?.file_url },
    });
  };

  const handleShare = () => {
    const bookUrl = `https://wholeword.app/app/book/${bookId}`;
    share({
      message: `${attributes.title}\n\n${bookUrl}`,
      title: "Share Book",
    });
  };

  return (
    <View style={styles.infoContainer}>
      <AppText style={styles.category}>{category}</AppText>
      <AppText style={styles.title}>{attributes.title}</AppText>
      <AppText style={styles.author}>{attributes.author}</AppText>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Star size={moderateSize(14)} color={Colors.primary} />
          <AppText style={styles.statText}>{attributes.average_rating}</AppText>
        </View>
        <View style={styles.statItem}>
          <Eye size={moderateSize(14)} color={Colors.deemedWhite} />
          <AppText style={styles.statText}>
            {attributes.purchases_count} reads
          </AppText>
        </View>
        <View style={styles.statItem}>
          <BookOpen size={moderateSize(14)} color={Colors.deemedWhite} />
          <AppText style={styles.statText}>
            {attributes.preview_pages} pages
          </AppText>
        </View>
      </View>

      {/* Description */}
      <View style={{ marginTop: moderateSize(12) }}>
        <AppText style={styles.sectionTitle}>About this book</AppText>
        <AppText style={styles.description}>{truncatedDescription}</AppText>
        {description.length > 120 && (
          <TouchableOpacity onPress={() => setExpanded(!expanded)}>
            <AppText style={styles.readMore}>
              {expanded ? "Show Less" : "Read More"}
            </AppText>
          </TouchableOpacity>
        )}
      </View>

      {/* Price and Buttons */}
      <View style={styles.actionContainer}>
        {isFree ? null : (
          <AppText style={styles.price}>{attributes.price} NGN</AppText>
        )}
        {isFree || hasPurchased ? (
          <CustomButton
            onPress={handleOpenPdf}
            style={{ marginTop: 30 }}
            title="Read"
          />
        ) : (
          <View style={styles.buttonRow}>
            <TouchableOpacity
              onPress={handleBuyBook}
              style={[styles.button, styles.buyButton]}
            >
              {isLoading ? (
                <ActivityIndicator color={Colors.dark} />
              ) : (
                <AppText style={styles.buyText}>Buy Now</AppText>
              )}
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            alignSelf: "center",
            gap: moderateSize(6),
            marginTop: moderateSize(16),
          }}
          onPress={handleShare}
        >
          <Share2 size={16} color={Colors.primary} />
          <AppText style={{ color: Colors.primary }}>Share</AppText>
        </TouchableOpacity>
      </View>

      {/* Paystack Checkout Sheet */}
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

export default BookInfoSection;

const styles = StyleSheet.create({
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
