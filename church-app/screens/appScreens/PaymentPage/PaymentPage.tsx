import { AppText } from "@/components/AppText";
import { Colors } from "@/constants/theme";
import { useAppSelector } from "@/hooks/useTypedSelector";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import WebView from "react-native-webview";

const PaymentPage = () => {
  const { paymentUrl, paymentSource } = useAppSelector(
    (state) => state.appstate
  );

  const handleWebNavigation = (navState: any) => {
    const { url } = navState;
    if (
      url.includes("https://godhouse.org/") ||
      url === "https://godhouse.org/"
    ) {
      alert("✅ Giving is Successful.");

      if (paymentSource === "GIVING") {
        router.push("/(tabs)/giving");
      } else if (paymentSource === "BOOKS") {
        router.push("/(tabs)/library");
      }
    }
    if (url.includes("cancel") || url.includes("close")) {
      console.log("❌ Payment cancelled");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }} edges={["top"]}>
      <Pressable style={{ padding: 15 }} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={30} color={Colors.black} />
      </Pressable>

      {paymentUrl ? (
        <WebView
          source={{ uri: paymentUrl }}
          onNavigationStateChange={handleWebNavigation}
          startInLoadingState
          renderLoading={() => (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color={Colors.black} />
            </View>
          )}
          scalesPageToFit
          allowsInlineMediaPlayback
          automaticallyAdjustContentInsets={false}
          setBuiltInZoomControls={true}
          setDisplayZoomControls={false}
        />
      ) : (
        <View style={styles.errorContainer}>
          <AppText style={styles.errorText}>
            Unable to load payment page.
          </AppText>
        </View>
      )}
    </SafeAreaView>
  );
};

export default PaymentPage;

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
  errorContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  errorText: {
    color: Colors.dark,
  },
});
