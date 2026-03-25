import { AppText } from "@/components/AppText";
import CustomButton from "@/components/Buttons/CustomButton";
import { Screen } from "@/components/Screen";
import TextInputField from "@/components/TextInputField/TextInputField";
import { Colors, Fonts, whiteOpacity } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { useDisplayError } from "@/hooks/displayError";
import { useLoginMutation } from "@/services/api/unAuth/unAuth";
import { moderateSize } from "@/utils/useResponsiveStyle";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useFormik } from "formik";
import { LogIn } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useMMKVString } from "react-native-mmkv";
import { storage } from "@/storage";
import * as yup from "yup";

const Login = () => {
  const [showPassword, setShowPassword] = useState(true);
  const router = useRouter();
  const { top, bottom } = useSafeAreaInsets();

  const [loginMutation, { isLoading, error }] = useLoginMutation();
  const { setAuthToken, setAuthUser } = useAuth();
  const [redirectAfterLogin, setRedirectAfterLogin] = useMMKVString("redirectAfterLogin");

  useDisplayError(error);

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
    password: yup.string().label("Password").required(),
    email: yup.string().label("Email").email().required(),
  });

  const formikProps = useFormik({
    initialValues: {
      password: "",
      email: "",
    },
    onSubmit: (values) => {
      loginMutation({ password: values.password, email: values.email })
        .unwrap()
        .then((res) => {
          console.log(res, "res");
          if (res?.success) {
            setAuthToken(res?.data?.token);
            setAuthUser(res?.data?.user);
            if (res?.data?.refreshToken) {
              storage.set("AuthProvider.refreshToken", res.data.refreshToken);
            }
            if (redirectAfterLogin) {
              router.replace(redirectAfterLogin as any);
              setRedirectAfterLogin(undefined);
            }
            return;
          }
        })
        .catch((err) => console.log(err));
    },
    validationSchema,
    validateOnMount: true,
  });

  return (
    <LinearGradient
      colors={["#0A0E1A", "#0D1225", "#111830"]}
      style={styles.container}
    >
      {/* Decorative orbs */}
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
              <LogIn
                size={moderateSize(24)}
                color={Colors.primary}
                strokeWidth={1.8}
              />
            </View>
            <AppText style={styles.title}>Welcome Back</AppText>
            <AppText style={styles.subtitle}>
              Sign in to continue with your church community
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
              formikProps={formikProps}
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

            <TextInputField
              formikProps={formikProps}
              label="Password"
              inputKey="password"
              placeholder="Enter your password"
              secureTextEntry={showPassword}
              handleRightIconPress={() => setShowPassword((prev) => !prev)}
              leftIcon={
                <MaterialCommunityIcons
                  name="lock-outline"
                  size={20}
                  color={whiteOpacity("0.4")}
                />
              }
              icon={
                <FontAwesome
                  name={!showPassword ? "eye" : "eye-slash"}
                  size={moderateSize(16)}
                  color={whiteOpacity("0.4")}
                />
              }
            />

            <Pressable
              onPress={() => router.push("/(auth)/enterEmail")}
              style={styles.forgotButton}
            >
              <AppText style={styles.forgotText}>Forgot Password?</AppText>
            </Pressable>
          </Animated.View>

          {/* Bottom */}
          <Animated.View style={[styles.bottomSection, { opacity: fadeAnim }]}>
            <CustomButton
              onPress={formikProps.handleSubmit}
              title="Sign In"
              processing={isLoading}
              style={{ marginBottom: moderateSize(16) }}
            />

            <View style={styles.footerRow}>
              <AppText style={styles.footerText}>Don't have an account? </AppText>
              <Pressable onPress={() => router.push("/(auth)/userDetails")}>
                <AppText style={styles.footerLink}>Sign Up</AppText>
              </Pressable>
            </View>
          </Animated.View>
        </View>
      </Screen>
    </LinearGradient>
  );
};

export default Login;

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
    marginTop: moderateSize(20),
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
    lineHeight: moderateSize(32)
  },
  subtitle: {
    fontSize: moderateSize(13),
    fontFamily: Fonts.Regular,
    color: Colors.muted,
    textAlign: "center",
    marginTop: moderateSize(8),
    lineHeight: moderateSize(20),
  },
  formSection: {
    marginTop: moderateSize(30),
  },
  forgotButton: {
    alignSelf: "flex-end",
    marginTop: -moderateSize(6),
  },
  forgotText: {
    fontSize: moderateSize(12),
    fontFamily: Fonts.Medium,
    color: Colors.primary,
  },
  bottomSection: {
    marginTop: moderateSize(20),
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
