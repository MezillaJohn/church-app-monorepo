import AppModal from "@/components/AppModal";
import React from "react";
import { StyleSheet, View } from "react-native";

import { AppText } from "@/components/AppText";
import CustomButton from "@/components/Buttons/CustomButton";
import { Fonts } from "@/constants/theme";
import { moderateSize } from "@/utils/useResponsiveStyle";
import { MaterialIcons } from "@expo/vector-icons";

interface DeleteConfirmModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  icon?: any;
  onCancel: () => void;
  onConfirm: () => void;
  btnLoading: boolean;
}

export default function DeleteConfirmModal({
  visible,
  title,
  message,
  confirmText = "Delete",
  icon,
  onCancel,
  onConfirm,
  btnLoading,
}: DeleteConfirmModalProps) {
  return (
    <AppModal
      isModalVisible={visible}
      handleClose={onCancel}
      height={moderateSize(300)}
    >
      <View style={styles.container}>
        {/* Icon */}
        <View style={styles.iconWrapper}>
          <MaterialIcons
            name="delete-forever"
            size={moderateSize(40)}
            color="#C53030"
          />
        </View>

        {/* Title */}
        <AppText style={styles.title}>{title}</AppText>

        {/* Message */}
        <AppText style={styles.message}>{message}</AppText>

        {/* Buttons Row */}
        <View style={styles.rowButtons}>
          <CustomButton
            title="Cancel"
            style={styles.cancelBtn}
            onPress={onCancel}
            outlined
          />

          <CustomButton
            processing={btnLoading}
            title={confirmText}
            style={styles.deleteBtn}
            onPress={onConfirm}
          />
        </View>
      </View>
    </AppModal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: moderateSize(10),
  },

  iconWrapper: {
    width: moderateSize(65),
    height: moderateSize(65),
    borderRadius: 80,
    backgroundColor: "#E9B4B433",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: moderateSize(20),
  },

  icon: {
    width: 40,
    height: 40,
    tintColor: "#C53030",
  },

  title: {
    fontSize: moderateSize(14),
    fontFamily: Fonts.SemiBold,
    marginHorizontal: 5,
    textAlign: "center",
  },

  message: {
    fontSize: moderateSize(12),
    textAlign: "center",
    marginTop: moderateSize(10),
    paddingHorizontal: 10,
  },

  rowButtons: {
    flexDirection: "row",
    width: "100%",
    marginTop: moderateSize(30),
    gap: 20,
  },

  cancelBtn: {
    height: moderateSize(45),
    borderRadius: 10,
    flex: 1,
  },

  deleteBtn: {
    height: moderateSize(45),
    borderRadius: 10,
    flex: 1,
  },
});
