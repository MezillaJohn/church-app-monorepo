import { AppText } from "@/components/AppText";
import CustomSheet from "@/components/CustomSheet";
import { Colors } from "@/constants/theme";
import { Size } from "@/utils/useResponsiveStyle";
import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";

interface PaymentWebSheetProps {
  visible: boolean;
  onClose: () => void;
  paymentUrl?: string | null;
  title?: string;
  onNavigationStateChange?: (event: any) => void;
}

const PaymentWebSheet: React.FC<PaymentWebSheetProps> = ({
  visible,
  onClose,
  paymentUrl,
  title = "",
  onNavigationStateChange,
}) => {
  return (
    <CustomSheet
      visible={visible}
      onClose={onClose}
      title={title}
      height={Size.getHeight() * 0.95}
      backgroundColor={Colors.white}
      titleColor={Colors.dark}
      iconColor={Colors.white}
      iconWrapperBackground={Colors.disabled}
    >
      {paymentUrl ? (
        <WebView
          source={{ uri: paymentUrl }}
          onNavigationStateChange={onNavigationStateChange}
          startInLoadingState
          renderLoading={() => (
            <ActivityIndicator
              size="large"
              color={Colors.primary}
              style={styles.loader}
            />
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
    </CustomSheet>
  );
};

export default PaymentWebSheet;

const styles = StyleSheet.create({
  loader: {
    marginTop: 20,
  },
  errorContainer: {
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: Colors.dark,
  },
});
