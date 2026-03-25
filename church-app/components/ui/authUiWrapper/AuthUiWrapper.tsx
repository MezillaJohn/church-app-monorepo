import { AppText } from "@/components/AppText";
import CustomButton from "@/components/Buttons/CustomButton";
import { Colors } from "@/constants/theme";
import { moderateSize, Size } from "@/utils/useResponsiveStyle";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet, View } from "react-native";

interface Props {
  imgSource: any;
  primaryText: string;
  secondaryTitle: string;
  btnText: string;
  children: React.ReactNode;
  alternativeActionText?: string;
  alternativeActionQuestion?: string;
  onBtnPress: () => void;
  onAltTextPress?: () => void;
  isLoading?: boolean;
}

const AuthUiWrapper = ({
  imgSource,
  primaryText,
  secondaryTitle,
  btnText,
  children,
  alternativeActionText,
  alternativeActionQuestion,
  onBtnPress,
  onAltTextPress,
  isLoading,
}: Props) => {
  return (
    <View style={{ flex: 1, paddingBottom: 20 }}>
      <Image source={imgSource} style={styles.image} contentFit="cover" />
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <AppText type="title" style={styles.primaryText}>
            {primaryText} <AppText type="title">{secondaryTitle}</AppText>
          </AppText>
        </View>

        {children}

        <CustomButton
          onPress={onBtnPress}
          style={styles.button}
          title={btnText}
          processing={isLoading}
        />
        {alternativeActionText && (
          <AppText onPress={onAltTextPress} style={styles.footerText}>
            {alternativeActionQuestion}{" "}
            <AppText style={styles.signUpText}>{alternativeActionText}</AppText>
          </AppText>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    height: Size.getHeight() * 0.4,
    width: "100%",
    marginBottom: moderateSize(30),
  },
  container: {
    flex: 1,
    padding: moderateSize(15),
  },
  titleContainer: {
    marginBottom: moderateSize(22),
  },
  primaryText: {
    color: Colors.primary,
    fontSize: moderateSize(20),
  },
  button: {
    marginTop: 40,
    marginBottom: moderateSize(10),
  },
  footerText: {
    textAlign: "center",
    fontSize: moderateSize(12),
  },
  signUpText: {
    color: Colors.primary,
    fontSize: moderateSize(12),
  },
});

export default AuthUiWrapper;
