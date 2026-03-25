import AppModal from "@/components/AppModal";
import { AppText } from "@/components/AppText";
import { Colors, Fonts } from "@/constants/theme";
import { moderateSize } from "@/utils/useResponsiveStyle";
import * as Linking from "expo-linking";
import React, { useState } from "react";
import { Alert, StyleSheet, TextInput, TouchableOpacity } from "react-native";

interface ReportBugModalProps {
  visible: boolean;
  onClose: () => void;
}

const ReportBugModal: React.FC<ReportBugModalProps> = ({
  visible,
  onClose,
}) => {
  const [bugText, setBugText] = useState("");

  const handleSendBugReport = () => {
    if (!bugText.trim()) {
      Alert.alert("Error", "Please describe the bug before submitting.");
      return;
    }

    const subject = encodeURIComponent("Bug Report from DigiYo App");
    const body = encodeURIComponent(bugText);

    const emailUrl = `mailto:devmedia@godhouse.org?subject=${subject}&body=${body}`;

    Linking.openURL(emailUrl)
      .then(() => {
        Alert.alert("Thank you!", "Your bug report has been submitted.");
        setBugText("");
        onClose();
      })
      .catch(() => {
        Alert.alert("Error", "Could not open email app.");
      });
  };

  return (
    <AppModal
      isModalVisible={visible}
      handleClose={onClose}
      height={moderateSize(350)}
    >
      <AppText style={styles.title}>Report a Bug</AppText>

      <AppText style={styles.label}>Describe the issue</AppText>

      <TextInput
        placeholder="Tell us what went wrong..."
        placeholderTextColor="#aaa"
        multiline
        value={bugText}
        onChangeText={setBugText}
        style={styles.textArea}
      />

      <TouchableOpacity
        onPress={handleSendBugReport}
        style={styles.submitButton}
      >
        <AppText style={styles.submitText}>Submit Report</AppText>
      </TouchableOpacity>
    </AppModal>
  );
};

export default ReportBugModal;

// ===================== STYLES =====================

const styles = StyleSheet.create({
  title: {
    fontFamily: Fonts.Bold,
    fontSize: moderateSize(16),
    color: Colors.white,
    marginBottom: moderateSize(26),
  },
  label: {
    fontFamily: Fonts.Medium,
    color: Colors.deemedWhite,
    marginBottom: 6,
    fontSize: moderateSize(12),
  },
  textArea: {
    height: moderateSize(120),
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    backgroundColor: Colors.textInputGrey,
    padding: moderateSize(12),
    color: Colors.white,
    textAlignVertical: "top",
    marginBottom: moderateSize(20),
    fontSize: moderateSize(12),
  },
  submitButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  submitText: {
    color: Colors.black,
    fontFamily: Fonts.Bold,
    fontSize: moderateSize(12),
  },
});
