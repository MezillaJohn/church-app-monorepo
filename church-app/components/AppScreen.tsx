import { Colors } from "@/constants/theme";
import { Size } from "@/utils/useResponsiveStyle";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StatusBarStyle,
  StyleSheet,
  View,
  ViewProps,
  ViewStyle,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

interface ScreenProps extends ViewProps {
  containerStyle?: ViewStyle;
  scrollview?: boolean;
  showBackHeader?: boolean;
  scrollEnabled?: boolean;
  keyboardAvoiding?: boolean;
  barStyle?: StatusBarStyle;
  statusBackground?: string;
  refreshControl?: any;
  noPadding?: boolean;
  noSafeView?: boolean;
}

const AppScreen = (props: ScreenProps): JSX.Element => {
  const {
    children,
    style,
    containerStyle,
    scrollview,
    showBackHeader,
    scrollEnabled = true,
    keyboardAvoiding,
    barStyle,
    statusBackground,
    refreshControl,
    noPadding,
    noSafeView,
  } = props;

  return (
    <Wrapper
      noSafeView={noSafeView}
      style={[
        styles.screen,
        containerStyle,
        {
          backgroundColor: Colors.black,
          paddingHorizontal: noPadding ? 0 : Size.calcWidth(20),
        },
      ]}
    >
      <StatusBar
        backgroundColor={statusBackground ? statusBackground : Colors.black}
        barStyle={barStyle ? barStyle : "light-content"}
      />
      {scrollview ? (
        <ScrollView
          refreshControl={refreshControl}
          scrollEnabled={scrollEnabled}
          showsVerticalScrollIndicator={false}
          style={[styles.view, style]}
        >
          {children}
        </ScrollView>
      ) : keyboardAvoiding ? (
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.view, style]}
        >
          {children}
        </KeyboardAwareScrollView>
      ) : (
        <View style={[styles.view, style]}>{children}</View>
      )}
    </Wrapper>
  );
};

const Wrapper = ({
  style,
  children,
  noSafeView,
}: {
  style: ViewStyle;
  children: React.ReactNode;
  noSafeView?: boolean;
}) => {
  return noSafeView ? (
    <View style={style}>{children}</View>
  ) : (
    <SafeAreaView style={style}>{children}</SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  view: {
    flex: 1,

    paddingBottom: Size.calcHeight(20),
  },
});

export default AppScreen;
