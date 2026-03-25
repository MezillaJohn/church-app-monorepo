import { AppText } from "@/components/AppText";
import CustomButton from "@/components/Buttons/CustomButton";
import { Screen } from "@/components/Screen";
import TextInputField from "@/components/TextInputField/TextInputField";
import { Colors, Fonts, whiteOpacity } from "@/constants/theme";
import { useAppAlert } from "@/context/AlertContext";
import { useDisplayError } from "@/hooks/displayError";
import { useResetPasswordMutation } from "@/services/api/unAuth/unAuth";
import { moderateSize } from "@/utils/useResponsiveStyle";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { useFormik } from "formik";
import { KeyRound } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as yup from "yup";

const ResetPassword = () => {
  const [secure, setSecure] = useState({ pass: true, confirm: true });
  const { email } = useLocalSearchParams();
  const { top, bottom } = useSafeAreaInsets();

  const [resetPassword, { isLoading, error }] = useResetPasswordMutation();

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
    code: yup
      .string()
      .required("Reset code is required")
      .matches(/^\d{6}$/, "Code must be 6 digits"),
    password: yup
      .string()
      .required("Password is required")
      .min(6, "Must be at least 6 characters"),
    password_confirmation: yup
      .string()
      .required("Confirm your password")
      .oneOf([yup.ref("password")], "Passwords do not match"),
  });

  const formik = useFormik({
    initialValues: {
      code: "",
      password: "",
      password_confirmation: "",
    },
    validationSchema,
    onSubmit: (values) => {
      try {
        resetPassword({
          email: email as string,
          code: values.code,
          password: values.password,
          password_confirmation: values.password_confirmation,
        })
          .unwrap()
          .then(() => {
            alert("Password reset successfully");
            router.dismissTo("/(auth)/login");
          })
          .catch((err) => console.log(err));
      } catch (error) {}
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

      <Screen backgroundColor="transparent" preset="scroll">
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

          {/* Header */}
          <Animated.View
            style={[
              styles.header,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
            ]}
          >
            <View style={styles.iconCircle}>
              <KeyRound
                size={moderateSize(24)}
                color={Colors.primary}
                strokeWidth={1.8}
              />
            </View>
            <AppText style={styles.title}>New Password</AppText>
            <AppText style={styles.subtitle}>
              Enter the code sent to your email and set a new password
            </AppText>
          </Animated.View>

          {/* Form */}
          <Animated.View
            style={[
              styles.formSection,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
            ]}
          >
            <TextInputField
              formikProps={formik}
              label="Reset Code"
              inputKey="code"
              keyboardType="number-pad"
              placeholder="6-digit recovery code"
              leftIcon={
                <MaterialCommunityIcons
                  name="shield-check-outline"
                  size={20}
                  color={whiteOpacity("0.4")}
                />
              }
            />

            <TextInputField
              formikProps={formik}
              label="New Password"
              inputKey="password"
              placeholder="Enter new password"
              secureTextEntry={secure.pass}
              handleRightIconPress={() =>
                setSecure((prev) => ({ ...prev, pass: !prev.pass }))
              }
              leftIcon={
                <MaterialCommunityIcons
                  name="lock-outline"
                  size={20}
                  color={whiteOpacity("0.4")}
                />
              }
              icon={
                <FontAwesome
                  name={secure.pass ? "eye-slash" : "eye"}
                  size={moderateSize(16)}
                  color={whiteOpacity("0.4")}
                />
              }
            />

            <TextInputField
              formikProps={formik}
              label="Confirm Password"
              inputKey="password_confirmation"
              placeholder="Re-enter password"
              secureTextEntry={secure.confirm}
              handleRightIconPress={() =>
                setSecure((prev) => ({ ...prev, confirm: !prev.confirm }))
              }
              leftIcon={
                <MaterialCommunityIcons
                  name="lock-check-outline"
                  size={20}
                  color={whiteOpacity("0.4")}
                />
              }
              icon={
                <FontAwesome
                  name={secure.confirm ? "eye-slash" : "eye"}
                  size={moderateSize(16)}
                  color={whiteOpacity("0.4")}
                />
              }
            />
          </Animated.View>

          {/* Bottom */}
          <Animated.View style={[styles.bottomSection, { opacity: fadeAnim }]}>
            <CustomButton
              processing={isLoading}
              onPress={formik.handleSubmit}
              title="Reset Password"
            />
          </Animated.View>
        </View>
      </Screen>
    </LinearGradient>
  );
};

export default ResetPassword;

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
  header: {
    alignItems: "center",
    marginTop: moderateSize(10),
  },
  iconCircle: {
    width: moderateSize(56),
    height: moderateSize(56),
    borderRadius: moderateSize(28),
    backgroundColor: whiteOpacity("0.06"),
    borderWidth: 1,
    borderColor: whiteOpacity("0.1"),
    alignItems: "center",
    justifyContent: "center",
    marginBottom: moderateSize(16),
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
  },
  formSection: {
    marginTop: moderateSize(10),
  },
  bottomSection: {
    marginTop: moderateSize(20),
  },
});
