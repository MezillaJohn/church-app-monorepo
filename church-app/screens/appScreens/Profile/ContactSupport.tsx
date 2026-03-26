import { LinearGradient } from "expo-linear-gradient";
import { useFormik } from "formik";
import React from "react";
import { Alert, StyleSheet, View } from "react-native";
import * as yup from "yup";
import { SafeAreaView } from "react-native-safe-area-context";

import AppBackHeader from "@/components/AppBackHeader";
import { AppText } from "@/components/AppText";
import CustomButton from "@/components/Buttons/CustomButton";
import TextInputField from "@/components/TextInputField/TextInputField";
import { Colors, Fonts } from "@/constants/theme";
import { useDisplayError } from "@/hooks/displayError";
import { useSubmitSupportTicketMutation } from "@/services/api/profile";
import { moderateSize } from "@/utils/useResponsiveStyle";

const validationSchema = yup.object().shape({
  subject: yup.string().required("Subject is required"),
  message: yup
    .string()
    .required("Please describe your issue")
    .min(10, "Please provide more detail"),
});

const ContactSupport = () => {
  const [submitTicket, { isLoading, error }] = useSubmitSupportTicketMutation();
  useDisplayError(error);

  const formikProps = useFormik({
    initialValues: { subject: "", message: "" },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      submitTicket(values)
        .unwrap()
        .then(() => {
          Alert.alert(
            "Submitted",
            "Your support request has been sent. We'll get back to you via email.",
          );
          resetForm();
        })
        .catch(() => {});
    },
  });

  return (
    <SafeAreaView
      edges={["top"]}
      style={{ flex: 1, backgroundColor: Colors.black }}
    >
      <LinearGradient colors={Colors.gradientDeep} style={styles.container}>
        <AppBackHeader text="Contact Support" />

        <View style={styles.card}>
          <AppText style={styles.title}>How can we help?</AppText>
          <AppText style={styles.subtitle}>
            Submit a support request and our team will respond to you via email.
          </AppText>

          <TextInputField
            formikProps={formikProps}
            label="Subject"
            inputKey="subject"
            placeholder="e.g. Payment issue, App bug..."
          />

          <TextInputField
            formikProps={formikProps}
            label="Message"
            inputKey="message"
            placeholder="Describe your issue in detail..."
            multiline
            numberOfLines={6}
            style={{ height: moderateSize(120), textAlignVertical: "top" }}
          />

          <CustomButton
            processing={isLoading}
            title="Submit Request"
            style={styles.submitButton}
            onPress={formikProps.handleSubmit}
          />
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default ContactSupport;

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
  title: {
    color: Colors.white,
    fontFamily: Fonts.Bold,
    fontSize: moderateSize(16),
    marginBottom: 4,
  },
  subtitle: {
    color: Colors.deemedWhite,
    fontSize: moderateSize(12),
    marginBottom: moderateSize(20),
  },
  submitButton: {
    marginTop: moderateSize(20),
    borderRadius: 12,
  },
});
