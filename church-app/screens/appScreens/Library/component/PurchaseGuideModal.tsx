import AppModal from "@/components/AppModal";
import CustomButton from "@/components/Buttons/CustomButton";
import { Colors, Fonts } from "@/constants/theme";
import { moderateSize } from "@/utils/useResponsiveStyle";
import { Check } from "lucide-react-native";
import React, { useState } from "react";
import { FlatList, Platform, Pressable, StyleSheet, Text, View } from "react-native";

interface PurchaseGuideModalProps {
  visible: boolean;
  onClose: () => void;
  onProceed: () => void;
}

const PurchaseGuideModal: React.FC<PurchaseGuideModalProps> = ({
  visible,
  onClose,
  onProceed,
}) => {
  const [isChecked, setIsChecked] = useState(false);
  const steps = Platform.select({
    android: [
      "Click 'Proceed' to open the Paystack payment page.",
      "Choose your preferred payment method (Zap, Card, Bank Transfer, Bank Account, USSD, or OPay), then follow the instructions to complete the payment.",
      "Return to the Paystack payment page and wait for Paystack to confirm your payment.",
      "Once payment is confirmed, your book will be available in your collection.",
    ],
    ios: [
      "Click 'Proceed' to open the Paystack payment page in your default browser.",
      "Choose your preferred payment method (Zap, Card, Bank Transfer, Bank Account, USSD, or OPay), then follow the instructions to complete the payment.",
      "Return to your browser on the Paystack payment page and wait for Paystack to confirm your payment.",
      "Once payment is confirmed, go back to the WholeWord app. Your book will be available in your collection.",
    ],
  })!;

  return (
    <AppModal
      height={moderateSize(450)}
      isModalVisible={visible}
      handleClose={onClose}
    >
      <Text style={styles.title}>How to Buy this Book</Text>

      <FlatList
        data={steps}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={{ paddingVertical: moderateSize(10) }}
        renderItem={({ item, index }) => {
          const isHighlighted = index === 2;
          return (
            <View style={styles.stepRow}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{index + 1}</Text>
              </View>
              <Text
                style={[
                  styles.stepText,
                  isHighlighted && {
                    color: Colors.primary,
                    fontFamily: Fonts.Bold,
                  },
                ]}
              >
                {item}
              </Text>
            </View>
          );
        }}
      />

      <View style={styles.checkboxContainer}>
        <Pressable
          style={[styles.checkbox, isChecked && styles.checkboxChecked]}
          onPress={() => setIsChecked(!isChecked)}
        >
          {isChecked && <Check size={moderateSize(14)} color={Colors.black} />}
        </Pressable>
        <Text style={styles.checkboxText} onPress={() => setIsChecked(!isChecked)}>
          I have read the instructions
        </Text>
      </View>

      <CustomButton
        title="Proceed"
        style={StyleSheet.flatten([
          styles.proceedButton,
          !isChecked && { opacity: 0.5 },
        ])}
        onPress={onProceed}
        disabled={!isChecked}
      />
    </AppModal>
  );
};

const styles = StyleSheet.create({
  title: {
    fontFamily: Fonts.Bold,
    fontSize: moderateSize(16),
    color: Colors.white,
    marginBottom: moderateSize(16),
    textAlign: "center",
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: moderateSize(12),
  },
  stepNumber: {
    width: moderateSize(28),
    height: moderateSize(28),
    borderRadius: moderateSize(14),
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: moderateSize(12),
  },
  stepNumberText: {
    color: Colors.black,
    fontFamily: Fonts.Bold,
    fontSize: moderateSize(14),
  },
  stepText: {
    flex: 1,
    color: Colors.deemedWhite,
    fontFamily: Fonts.Regular,
    fontSize: moderateSize(13),
    lineHeight: moderateSize(18),
  },
  proceedButton: {
    marginTop: moderateSize(20),
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: moderateSize(20),
  },
  checkbox: {
    width: moderateSize(20),
    height: moderateSize(20),
    borderRadius: moderateSize(4),
    borderWidth: 1.5,
    borderColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: moderateSize(10),
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
  },
  checkboxText: {
    color: Colors.white,
    fontFamily: Fonts.Regular,
    fontSize: moderateSize(13),
  },
});

export default PurchaseGuideModal;
