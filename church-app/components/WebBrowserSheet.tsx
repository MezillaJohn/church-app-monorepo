import { AppText } from "@/components/AppText";
import CustomSheet from "@/components/CustomSheet";
import { Colors } from "@/constants/theme";
import { Size } from "@/utils/useResponsiveStyle";
import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";

interface WebBrowserSheetProps {
  visible: boolean;
  onClose: () => void;
  webUrl?: string | null;
  title?: string;
  onNavigationStateChange?: (event: any) => void;
}

const WebBrowserSheet: React.FC<WebBrowserSheetProps> = ({
  visible,
  onClose,
  webUrl,
  title = "",
  onNavigationStateChange,
}) => {
  return (
    <CustomSheet
      visible={visible}
      onClose={onClose}
      title={title}
      height={Size.getHeight() * 0.9}
      backgroundColor={Colors.white}
      titleColor={Colors.dark}
      iconColor={Colors.white}
      iconWrapperBackground={Colors.disabled}
    >
      {webUrl ? (
        <WebView
          source={{ uri: webUrl }}
          onNavigationStateChange={onNavigationStateChange}
          startInLoadingState
          renderLoading={() => (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.dark} />
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
            Unable to load webpage page.
          </AppText>
        </View>
      )}
    </CustomSheet>
  );
};

export default WebBrowserSheet;

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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
