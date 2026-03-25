import { AppText } from "@/components/AppText";
import CustomButton from "@/components/Buttons/CustomButton";
import { Screen } from "@/components/Screen";
import TextInputField from "@/components/TextInputField/TextInputField";
import { Colors, Fonts, whiteOpacity } from "@/constants/theme";
import { useDisplayError } from "@/hooks/displayError";
import { useAppDispatch } from "@/hooks/useTypedSelector";
import { saveSignupDetails } from "@/redux/slice/signupSlice";
import {
  useRequestCodeMutation,
  useValidateEmailMutation,
} from "@/services/api/unAuth/unAuth";
import { moderateSize } from "@/utils/useResponsiveStyle";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useFormik } from "formik";
import { UserPlus } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as yup from "yup";

const UserDetails = () => {
  const router = useRouter();
  const { top, bottom } = useSafeAreaInsets();
  const [showPassword, setShowPassword] = useState({
    password: true,
    confirmPassword: true,
  });

  const [validateEmailMutation, { isLoading, error }] =
    useValidateEmailMutation();
  const [requestCodeMutation, { isLoading: rLoading, error: rError }] =
    useRequestCodeMutation();

  useDisplayError(error);
  useDisplayError(rError);

  const dispatch = useAppDispatch();

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
    fullname: yup.string().label("Full Name").required(),
    email: yup.string().label("Email").email().required(),
    password: yup.string().label("Password").min(8).required(),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const formikProps = useFormik({
    initialValues: {
      email: "",
      fullname: "",
      password: "",
      confirmPassword: "",
    },
    onSubmit: async (values) => {
      const email = values.email.trim().toLowerCase();
      try {
        await validateEmailMutation({ email }).unwrap();
        await requestCodeMutation({
          email,
          name: values.fullname.trim(),
        }).unwrap();

        dispatch(
          saveSignupDetails({
            name: values.fullname.trim(),
            email,
            password: values.password,
          })
        );

        router.push("/verifyEmail");
      } catch (err) {
        console.log("Signup error:", err);
      }
    },
    validationSchema,
    validateOnMount: true,
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
        <LinearGradient
          colors={["rgba(0,217,166,0.04)", "transparent"]}
          style={styles.orbBottomLeft}
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
              <UserPlus
                size={moderateSize(24)}
                color={Colors.primary}
                strokeWidth={1.8}
              />
            </View>
            <AppText style={styles.title}>Create Account</AppText>
            <AppText style={styles.subtitle}>
              Join your church community today
            </AppText>

            {/* Step indicator */}
            <View style={styles.stepRow}>
              <View style={[styles.stepDot, styles.stepActive]} />
              <View style={styles.stepLine} />
              <View style={styles.stepDot} />
            </View>
          </Animated.View>

          {/* Form */}
          <Animated.View
            style={[
              styles.formSection,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
            ]}
          >
            <TextInputField
              formikProps={formikProps}
              label="Full Name"
              inputKey="fullname"
              placeholder="Enter your full name"
              leftIcon={
                <MaterialCommunityIcons
                  name="account-outline"
                  size={20}
                  color={whiteOpacity("0.4")}
                />
              }
            />
            <TextInputField
              formikProps={formikProps}
              label="Email"
              inputKey="email"
              placeholder="Enter your email address"
              leftIcon={
                <MaterialCommunityIcons
                  name="email-outline"
                  size={20}
                  color={whiteOpacity("0.4")}
                />
              }
            />
            <TextInputField
              formikProps={formikProps}
              label="Password"
              inputKey="password"
              placeholder="Create a password"
              secureTextEntry={showPassword.password}
              handleRightIconPress={() =>
                setShowPassword((prev) => ({
                  ...prev,
                  password: !prev.password,
                }))
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
                  name={!showPassword.password ? "eye" : "eye-slash"}
                  size={moderateSize(16)}
                  color={whiteOpacity("0.4")}
                />
              }
            />
            <TextInputField
              formikProps={formikProps}
              label="Confirm Password"
              inputKey="confirmPassword"
              placeholder="Re-enter your password"
              secureTextEntry={showPassword.confirmPassword}
              handleRightIconPress={() =>
                setShowPassword((prev) => ({
                  ...prev,
                  confirmPassword: !prev.confirmPassword,
                }))
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
                  name={!showPassword.confirmPassword ? "eye" : "eye-slash"}
                  size={moderateSize(16)}
                  color={whiteOpacity("0.4")}
                />
              }
            />
          </Animated.View>

          {/* Bottom */}
          <Animated.View style={[styles.bottomSection, { opacity: fadeAnim }]}>
            <CustomButton
              onPress={formikProps.handleSubmit}
              title="Continue"
              processing={isLoading || rLoading}
              style={{ marginBottom: moderateSize(16) }}
            />

            <View style={styles.footerRow}>
              <AppText style={styles.footerText}>Have an account? </AppText>
              <Pressable onPress={() => router.push("/(auth)/login")}>
                <AppText style={styles.footerLink}>Log In</AppText>
              </Pressable>
            </View>
          </Animated.View>
        </View>
      </Screen>
    </LinearGradient>
  );
};

export default UserDetails;

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
  orbBottomLeft: {
    position: "absolute",
    bottom: -40,
    left: -80,
    width: 220,
    height: 220,
    borderRadius: 110,
  },
  content: {
    flex: 1,
    paddingHorizontal: moderateSize(24),
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
    marginTop: moderateSize(16),
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
    marginBottom: moderateSize(12),
  },
  title: {
    fontSize: moderateSize(26),
    fontFamily: Fonts.Bold,
    color: Colors.white,
    textAlign: "center",
    lineHeight: moderateSize(32),
  },
  subtitle: {
    fontSize: moderateSize(13),
    fontFamily: Fonts.Regular,
    color: Colors.muted,
    textAlign: "center",
    marginTop: moderateSize(6),
    lineHeight: moderateSize(20),
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: moderateSize(16),
    gap: moderateSize(4),
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: whiteOpacity("0.15"),
  },
  stepActive: {
    backgroundColor: Colors.primary,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  stepLine: {
    width: moderateSize(24),
    height: 2,
    backgroundColor: whiteOpacity("0.1"),
    borderRadius: 1,
  },
  formSection: {
    marginTop: moderateSize(10),
  },
  bottomSection: {
    marginTop: moderateSize(16),
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    fontSize: moderateSize(13),
    fontFamily: Fonts.Regular,
    color: Colors.muted,
  },
  footerLink: {
    fontSize: moderateSize(13),
    fontFamily: Fonts.SemiBold,
    color: Colors.primary,
  },
});
