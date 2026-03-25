import { AppText } from "@/components/AppText";
import CustomButton from "@/components/Buttons/CustomButton";
import { Screen } from "@/components/Screen";
import TextInputField from "@/components/TextInputField/TextInputField";
import { Colors, Fonts, whiteOpacity } from "@/constants/theme";
import { useAppAlert } from "@/context/AlertContext";
import { useDisplayError } from "@/hooks/displayError";
import { useForgetPasswordMutation } from "@/services/api/unAuth/unAuth";
import { moderateSize } from "@/utils/useResponsiveStyle";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useFormik } from "formik";
import { Mail } from "lucide-react-native";
import React, { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as yup from "yup";

const EnterEmail = () => {
  const [forgetPassword, { isLoading, error }] = useForgetPasswordMutation();
  const { top, bottom } = useSafeAreaInsets();

  useDisplayError(error);

  const { alert } = useAppAlert();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        damping: 15,
        stiffness: 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const validationSchema = yup.object().shape({
    email: yup.string().email().label("Email").required("Email is required"),
  });

  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema,
    onSubmit: (values) => {
      try {
        forgetPassword({ email: values.email })
          .unwrap()
          .then(() => {
            alert(
              "If the email exists, a password reset code has been sent"
            );
            router.push({
              pathname: "/(auth)/resetPassword",
              params: { email: values.email },
            });
          })
          .catch((err) => console.log(err));
      } catch (error) {
        console.log(error, "error");
      }
    },
  });

  return (
    <LinearGradient
      colors={["#0A0E1A", "#0D1225", "#111830"]}
      style={styles.container}
    >
      <View style={StyleSheet.absoluteFill}>
        <LinearGradient
          colors={["rgba(0,217,166,0.08)", "transparent"]}
          style={styles.orbTopRight}
        />
      </View>

      <Screen backgroundColor="transparent" preset="fixed">
        <View
          style={[
            styles.content,
            { paddingTop: top + moderateSize(20), paddingBottom: bottom + moderateSize(20) },
          ]}
        >
          {/* Back button */}
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <MaterialCommunityIcons
              name="chevron-left"
              size={moderateSize(24)}
              color={Colors.white}
            />
          </Pressable>

          {/* Center content */}
          <Animated.View
            style={[
              styles.centerSection,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
            ]}
          >
            <View style={styles.iconCircle}>
              <Mail
                size={moderateSize(26)}
                color={Colors.primary}
                strokeWidth={1.8}
              />
            </View>

            <AppText style={styles.title}>Reset Password</AppText>
            <AppText style={styles.subtitle}>
              Enter the email address linked to your account and we'll send you
              a recovery code
            </AppText>

            <View style={styles.formSection}>
              <TextInputField
                formikProps={formik}
                label="Email"
                inputKey="email"
                placeholder="Enter your email"
                leftIcon={
                  <MaterialCommunityIcons
                    name="email-outline"
                    size={20}
                    color={whiteOpacity("0.4")}
                  />
                }
              />
            </View>
          </Animated.View>

          {/* Bottom */}
          <Animated.View style={[styles.bottomSection, { opacity: fadeAnim }]}>
            <CustomButton
              processing={isLoading}
              onPress={formik.handleSubmit}
              title="Send Recovery Code"
            />
          </Animated.View>
        </View>
      </Screen>
    </LinearGradient>
  );
};

export default EnterEmail;

const styles = StyleSheet.create({
  container: { flex: 1 },
  orbTopRight: {
    position: "absolute",
    top: -80,
    right: -80,
    width: 280,
    height: 280,
    borderRadius: 140,
  },
  content: {
    flex: 1,
    paddingHorizontal: moderateSize(24),
    justifyContent: "space-between",
  },
  backButton: {
    width: moderateSize(40),
    height: moderateSize(40),
    borderRadius: moderateSize(20),
    backgroundColor: whiteOpacity("0.06"),
    borderWidth: 1,
    borderColor: whiteOpacity("0.1"),
    alignItems: "center",
    justifyContent: "center",
  },
  centerSection: {
    alignItems: "center",
  },
  iconCircle: {
    width: moderateSize(64),
    height: moderateSize(64),
    borderRadius: moderateSize(32),
    backgroundColor: whiteOpacity("0.06"),
    borderWidth: 1,
    borderColor: whiteOpacity("0.1"),
    alignItems: "center",
    justifyContent: "center",
    marginBottom: moderateSize(20),
  },
  title: {
    fontSize: moderateSize(26),
    fontFamily: Fonts.Bold,
    color: Colors.white,
    textAlign: "center",
    lineHeight: moderateSize(32),
    marginBottom: moderateSize(10),
  },
  subtitle: {
    fontSize: moderateSize(13),
    fontFamily: Fonts.Regular,
    color: Colors.muted,
    textAlign: "center",
    lineHeight: moderateSize(20),
    maxWidth: "90%",
    marginBottom: moderateSize(24),
  },
  formSection: {
    alignSelf: "stretch",
  },
  bottomSection: {},
});
