import { LinearGradient } from "expo-linear-gradient";
import { useFormik } from "formik";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import * as yup from "yup";

import AppBackHeader from "@/components/AppBackHeader";
import { AppText } from "@/components/AppText";
import CustomButton from "@/components/Buttons/CustomButton";
import TextInputField from "@/components/TextInputField/TextInputField";

import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import { Colors, Fonts, whiteOpacity } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { useDisplayError } from "@/hooks/displayError";
import { useDeleteAccMutation } from "@/services/api/profile";
import { moderateSize } from "@/utils/useResponsiveStyle";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

// ⭐ Replace this with your actual delete mutation
// import { useDeleteAccountMutation } from "@/services/api/auth";

const DeleteAccount = () => {
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(true);

  const { logout } = useAuth();

  const [deleteAccount, { isLoading, error }] = useDeleteAccMutation();

  useDisplayError(error);

  const validationSchema = yup.object().shape({
    password: yup.string().required("Password is required"),
  });

  const formikProps = useFormik({
    initialValues: {
      password: "",
    },
    onSubmit: () => {
      setConfirmVisible(true);
    },
    validationSchema,
  });

  // ⭐ Fake delete function — replace this with API call
  const handleDeleteAccount = async () => {
    deleteAccount({ password: formikProps.values.password })
      .unwrap()
      .then((res) => {
        setConfirmVisible(false);
        logout();
      })
      .catch((err) => {
        console.log(err);
        setConfirmVisible(false);
      });
  };

  return (
    <>
      <SafeAreaView
        edges={["top"]}
        style={{ flex: 1, backgroundColor: Colors.black }}
      >
        <LinearGradient colors={Colors.gradientDeep} style={styles.container}>
          <AppBackHeader text="Delete Account" />

          <View style={styles.card}>
            <AppText style={styles.warningTitle}>⚠ Delete Your Account</AppText>
            <AppText style={styles.warningSubtitle}>
              This action is permanent and cannot be undone. Please confirm by
              entering your password.
            </AppText>

            {/* PASSWORD */}
            <TextInputField
              formikProps={formikProps}
              label="Password"
              inputKey="password"
              secureTextEntry={passwordVisible}
              placeholder="Enter your password"
              icon={
                <MaterialCommunityIcons
                  name={passwordVisible ? "eye-off" : "eye"}
                  size={moderateSize(20)}
                  color={whiteOpacity("0.4")}
                />
              }
              handleRightIconPress={() => setPasswordVisible((prev) => !prev)}
            />

            <CustomButton
              processing={isLoading}
              title="Delete Account"
              style={styles.deleteButton}
              onPress={formikProps.handleSubmit}
            />
          </View>
        </LinearGradient>
        <DeleteConfirmModal
          onConfirm={handleDeleteAccount}
          btnLoading={isLoading}
          message="This action cannot be undone"
          title="Are you sure you want to delete your account"
          visible={confirmVisible}
          onCancel={() => setConfirmVisible(false)}
        />
      </SafeAreaView>
    </>
  );
};

export default DeleteAccount;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: moderateSize(16),
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 20,
    padding: moderateSize(20),
    marginTop: moderateSize(20),
  },

  warningTitle: {
    color: Colors.red,
    fontFamily: Fonts.Bold,
    fontSize: moderateSize(14),
    marginBottom: 6,
  },
  warningSubtitle: {
    color: Colors.deemedWhite,
    fontSize: moderateSize(12),
    marginBottom: moderateSize(20),
  },

  deleteButton: {
    marginTop: moderateSize(30),
    borderRadius: 12,
  },

  confirmText: {
    color: Colors.white,
    fontFamily: Fonts.Medium,
    fontSize: moderateSize(14),
    textAlign: "center",
    marginBottom: moderateSize(20),
  },
  confirmDeleteButton: {
    backgroundColor: Colors.red,
    borderRadius: 12,
  },
  cancelText: {
    color: Colors.white,
    textAlign: "center",
    fontSize: moderateSize(13),
    marginTop: 8,
  },
});
