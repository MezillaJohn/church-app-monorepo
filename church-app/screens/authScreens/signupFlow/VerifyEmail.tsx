import { AppText } from "@/components/AppText";
import CustomButton from "@/components/Buttons/CustomButton";
import { Screen } from "@/components/Screen";
import { SuccessModal } from "@/components/SuccessModal";
import { Colors, Fonts, whiteOpacity } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { useDisplayError } from "@/hooks/displayError";
import { useAppSelector } from "@/hooks/useTypedSelector";
import {
  useResendCodeMutation,
  useSetPasswordMutation,
  useVerifyEmailMutation,
} from "@/services/api/unAuth/unAuth";
import { moderateSize } from "@/utils/useResponsiveStyle";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { ShieldCheck } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { useMMKVString } from "react-native-mmkv";
import { storage } from "@/storage";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const VerifyEmail = () => {
  const [isSuccessModal, setIsSuccessModal] = useState(false);
  const router = useRouter();
  const { top, bottom } = useSafeAreaInsets();
  const [code, setCode] = useState(["", "", "", "", "", ""]);

  const [resendCodeMutation, { isLoading, error }] = useResendCodeMutation();
  const [verifyEmailMutation, { isLoading: vLoading, error: vError }] =
    useVerifyEmailMutation();
  const [setPasswordMutation, { isLoading: sLoading, error: sError }] =
    useSetPasswordMutation();

  const { email, password, name } = useAppSelector((state) => state.signupSlice);
  const { setAuthToken, setAuthUser } = useAuth();
  const [redirectAfterLogin, setRedirectAfterLogin] = useMMKVString("redirectAfterLogin");

  useDisplayError(error);
  useDisplayError(vError);
  useDisplayError(sError);

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

  useEffect(() => {
    if (isSuccessModal) {
      const timer = setTimeout(() => {
        if (redirectAfterLogin) {
          router.replace(redirectAfterLogin as any);
          setRedirectAfterLogin(undefined);
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isSuccessModal]);

  const inputs: { [key: string]: TextInput | null } = {};

  const handleChange = (value: string, index: number) => {
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      (inputs[`input-${index + 1}`] as any)?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !code[index] && index > 0) {
      const newCode = [...code];
      newCode[index - 1] = "";
      setCode(newCode);
      (inputs[`input-${index - 1}`] as any)?.focus();
    }
  };

  const handleSubmit = async () => {
    const finalCode = code.join("");
    try {
      // Step 1: Verify OTP
      await verifyEmailMutation({ email, code: finalCode }).unwrap();

      // Step 2: Create account
      const res = await setPasswordMutation({
        email,
        password: password!,
        password_confirmation: password!,
        code: finalCode,
      }).unwrap();

      // Step 3: Log in
      setAuthToken(res?.data?.token);
      setAuthUser(res?.data?.user);
      if (res?.data?.refreshToken) {
        storage.set("AuthProvider.refreshToken", res.data.refreshToken);
      }
      setIsSuccessModal(true);
    } catch (err) {
      console.log("Verification/signup error:", err);
    }
  };

  const handleResend = () => {
    resendCodeMutation({ email })
      .unwrap()
      .then(() => {
        alert("Another code has been sent to your email");
      })
      .catch((err) => console.log(err));
  };

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
            {/* Icon */}
            <View style={styles.iconCircle}>
              <ShieldCheck
                size={moderateSize(28)}
                color={Colors.primary}
                strokeWidth={1.8}
              />
            </View>

            {/* Step indicator */}
            <View style={styles.stepRow}>
              <View style={[styles.stepDot, styles.stepComplete]} />
              <View style={[styles.stepLine, styles.stepLineActive]} />
              <View style={[styles.stepDot, styles.stepActive]} />
            </View>

            <AppText style={styles.title}>Verify Your Email</AppText>
            <AppText style={styles.subtitle}>
              Enter the 6-digit code sent to{"\n"}
              <AppText style={styles.emailHighlight}>{email}</AppText>
            </AppText>

            {/* OTP Inputs */}
            <View style={styles.codeContainer}>
              {code.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => (inputs[`input-${index}`] = ref)}
                  value={digit}
                  onChangeText={(val) => handleChange(val.slice(-1), index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  keyboardType="numeric"
                  maxLength={1}
                  style={[
                    styles.codeInput,
                    digit ? styles.codeInputFilled : null,
                  ]}
                  placeholder="-"
                  placeholderTextColor={whiteOpacity("0.2")}
                />
              ))}
            </View>
          </Animated.View>

          {/* Bottom */}
          <Animated.View style={[styles.bottomSection, { opacity: fadeAnim }]}>
            <CustomButton
              processing={vLoading || sLoading}
              title="Verify & Create Account"
              onPress={handleSubmit}
              style={{ marginBottom: moderateSize(20) }}
            />

            <View style={styles.footerRow}>
              <AppText style={styles.footerText}>Didn't get a code? </AppText>
              {isLoading ? (
                <ActivityIndicator
                  style={{ marginLeft: 6 }}
                  color={Colors.primary}
                  size="small"
                />
              ) : (
                <Pressable onPress={handleResend}>
                  <AppText style={styles.footerLink}>Resend</AppText>
                </Pressable>
              )}
            </View>
          </Animated.View>

          <SuccessModal
            visible={isSuccessModal}
            onClose={() => setIsSuccessModal(false)}
          />
        </View>
      </Screen>
    </LinearGradient>
  );
};

export default VerifyEmail;

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
    marginBottom: moderateSize(16),
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: moderateSize(20),
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
  stepComplete: {
    backgroundColor: Colors.primary,
  },
  stepLine: {
    width: moderateSize(24),
    height: 2,
    backgroundColor: whiteOpacity("0.1"),
    borderRadius: 1,
  },
  stepLineActive: {
    backgroundColor: whiteOpacity("0.3"),
  },
  title: {
    fontSize: moderateSize(24),
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
    marginBottom: moderateSize(30),
  },
  emailHighlight: {
    color: Colors.primary,
    fontFamily: Fonts.Medium,
    fontSize: moderateSize(13),
  },
  codeContainer: {
    flexDirection: "row",
    gap: moderateSize(10),
  },
  codeInput: {
    width: moderateSize(44),
    height: moderateSize(54),
    borderRadius: moderateSize(12),
    borderWidth: 1,
    borderColor: whiteOpacity("0.12"),
    color: Colors.white,
    textAlign: "center",
    fontSize: moderateSize(20),
    fontFamily: Fonts.SemiBold,
    backgroundColor: whiteOpacity("0.04"),
  },
  codeInputFilled: {
    borderColor: Colors.primary,
    backgroundColor: whiteOpacity("0.08"),
  },
  bottomSection: {},
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
