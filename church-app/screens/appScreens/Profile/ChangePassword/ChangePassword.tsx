import AppBackHeader from "@/components/AppBackHeader";
import { AppText } from "@/components/AppText";
import CustomButton from "@/components/Buttons/CustomButton";
import { Screen } from "@/components/Screen";
import TextInputField from "@/components/TextInputField/TextInputField";
import { Colors, Fonts } from "@/constants/theme";
import { useAppAlert } from "@/context/AlertContext";
import { useDisplayError } from "@/hooks/displayError";
import { useChangePasswordMutation } from "@/services/api/profile";
import { moderateSize } from "@/utils/useResponsiveStyle";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useFormik } from "formik";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import * as yup from "yup";

const ChangePassword = () => {
  const [secureFields, setSecureFields] = useState({
    current: true,
    new: true,
    confirm: true,
  });

  const [changePasswordMutation, { isLoading, error }] =
    useChangePasswordMutation();

  useDisplayError(error);

  const { alert } = useAppAlert();

  const validationSchema = yup.object().shape({
    current_password: yup.string().required("Current password is required"),
    new_password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("New password is required"),
    confirm_password: yup
      .string()
      .oneOf([yup.ref("new_password")], "Passwords do not match")
      .required("Please confirm your new password"),
  });

  const formik = useFormik({
    initialValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
    onSubmit: (values, { resetForm }) => {
      changePasswordMutation({
        current_password: values.current_password,
        new_password: values.new_password,
      })
        .unwrap()
        .then(() => {
          alert("✅ Password changed successfully!");
          router.back();
          resetForm();
        })
        .catch(() => {});
    },
    validationSchema,
    validateOnMount: true,
  });

  return (
    <Screen safeAreaEdges={["top"]} preset="fixed">
      <LinearGradient colors={Colors.gradientDeep} style={styles.container}>
        <AppBackHeader
          text="Change Password"
          style={{ marginBottom: 30, margin: 15 }}
        />

        <View style={styles.formSection}>
          {/* Current Password */}
          <AppText style={styles.label}>Current Password</AppText>
          <TextInputField
            formikProps={formik}
            inputKey="current_password"
            placeholder="Enter your current password"
            secureTextEntry={secureFields.current}
            leftIcon={
              <MaterialCommunityIcons
                name="lock-outline"
                size={20}
                color="rgba(255,255,255,0.3)"
              />
            }
            icon={
              <MaterialCommunityIcons
                name={secureFields.current ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="rgba(255,255,255,0.3)"
                onPress={() =>
                  setSecureFields((prev) => ({
                    ...prev,
                    current: !prev.current,
                  }))
                }
              />
            }
          />

          {/* New Password */}
          <AppText style={[styles.label, { marginTop: moderateSize(20) }]}>
            New Password
          </AppText>
          <TextInputField
            formikProps={formik}
            inputKey="new_password"
            placeholder="Enter new password"
            secureTextEntry={secureFields.new}
            leftIcon={
              <MaterialCommunityIcons
                name="lock-check-outline"
                size={20}
                color="rgba(255,255,255,0.3)"
              />
            }
            icon={
              <MaterialCommunityIcons
                name={secureFields.new ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="rgba(255,255,255,0.3)"
                onPress={() =>
                  setSecureFields((prev) => ({
                    ...prev,
                    new: !prev.new,
                  }))
                }
              />
            }
          />

          {/* Confirm Password */}
          <AppText style={[styles.label, { marginTop: moderateSize(20) }]}>
            Confirm New Password
          </AppText>
          <TextInputField
            formikProps={formik}
            inputKey="confirm_password"
            placeholder="Re-enter new password"
            secureTextEntry={secureFields.confirm}
            leftIcon={
              <MaterialCommunityIcons
                name="lock-check"
                size={20}
                color="rgba(255,255,255,0.3)"
              />
            }
            icon={
              <MaterialCommunityIcons
                name={secureFields.confirm ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="rgba(255,255,255,0.3)"
                onPress={() =>
                  setSecureFields((prev) => ({
                    ...prev,
                    confirm: !prev.confirm,
                  }))
                }
              />
            }
          />

          {/* Submit Button */}
          <CustomButton
            processing={isLoading}
            style={{ marginTop: moderateSize(40) }}
            title="Update Password"
            onPress={formik.handleSubmit}
          />
        </View>
      </LinearGradient>
    </Screen>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  formSection: {
    marginTop: moderateSize(30),
    marginHorizontal: moderateSize(20),
  },
  label: {
    color: Colors.deemedWhite,
    fontFamily: Fonts.SemiBold,
    fontSize: moderateSize(13),
    marginBottom: 8,
  },
  errorText: {
    color: Colors.red,
    fontSize: moderateSize(12),
    marginTop: 5,
  },
});
