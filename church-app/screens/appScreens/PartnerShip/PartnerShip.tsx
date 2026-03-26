import { LinearGradient } from "expo-linear-gradient";
import { useFormik } from "formik";
import React, { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import * as yup from "yup";

import AppBackHeader from "@/components/AppBackHeader";
import { AppText } from "@/components/AppText";
import CustomButton from "@/components/Buttons/CustomButton";
import CustomSheet from "@/components/CustomSheet";
import { Screen } from "@/components/Screen";
import TextInputField from "@/components/TextInputField/TextInputField";
import { Colors, Fonts } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { useDisplayError } from "@/hooks/displayError";
import SuccessModal from "@/screens/appScreens/PartnerShip/SuccessModal";
import {
  usePartnershipTypeQuery,
  useSubmitPartnershipMutation,
} from "@/services/api/giving";
import { moderateSize } from "@/utils/useResponsiveStyle";
import { router } from "expo-router";
import { ChevronDown } from "lucide-react-native";

const PartnerShip = () => {
  const [isTypeVisible, setIsTypeVisible] = useState(false);
  const [isIntervalVisible, setIsIntervalVisible] = useState(false);

  // NEW FOR CURRENCY
  const [isCurrencyVisible, setIsCurrencyVisible] = useState(false);

  const [isSuccessVisible, setIsSuccessVisible] = useState(false);

  const { authUser } = useAuth();

  const { data } = usePartnershipTypeQuery(null);

  const [submitePartnership, { isLoading, error }] =
    useSubmitPartnershipMutation();

  useDisplayError(error);

  const validationSchema = yup.object().shape({
    fullName: yup.string().required("Full Name is required"),
    phone: yup.string().required("Phone Number is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    type: yup.string().required("Partnership type is required"),
    typeId: yup.string().required("Partnership type is required"),

    // NEW
    currency: yup.string().required("Currency is required"),

    amount: yup.string().required("Amount is required"),
    time: yup.string().required("Time Interval is required"),
  });

  const formikProps = useFormik({
    enableReinitialize: false,
    validateOnChange: false,
    validateOnBlur: true,
    initialValues: {
      fullName: authUser?.name ?? "",
      phone: authUser?.phone ?? "",
      email: authUser?.email ?? "",
      type: "",
      typeId: "",
      currency: "NGN",
      amount: "",
      time: "",
    },
    onSubmit: async (values) => {
      const payload = {
        fullname: values.fullName,
        phoneNo: values.phone,
        email: values.email,
        partnershipTypeId: values.typeId,
        interval: values.time.toLowerCase(),
        currency: values.currency,
        amount: Number(values.amount),
      };

      try {
        await submitePartnership(payload).unwrap();
        setIsSuccessVisible(true);
      } catch (error) {
        console.log(error);
      }
    },
    validationSchema,
  });

  const timeIntervals = ["Daily", "Weekly", "Monthly", "Yearly"];
  const currencies = ["NGN", "USD"];

  return (
    <>
      <Screen preset="fixed" safeAreaEdges={["top", "bottom"]}>
        <LinearGradient colors={Colors.gradientDeep} style={styles.container}>
          <AppBackHeader text="Partner With Us" style={{ marginBottom: 30 }} />

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.card}>
              <TextInputField
                formikProps={formikProps}
                label="Full Name"
                inputKey="fullName"
                placeholder="Enter your full name"
              />

              <TextInputField
                formikProps={formikProps}
                label="Phone Number"
                inputKey="phone"
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
              />

              <TextInputField
                formikProps={formikProps}
                label="Email Address"
                inputKey="email"
                placeholder="Enter your email"
              />

              {/* Partnership Type */}
              <TextInputField
                editable={false}
                formikProps={formikProps}
                label="Partnership Type"
                inputKey="type"
                placeholder="Select partnership type"
                icon={<ChevronDown color={Colors.deemedWhite} />}
                onPress={() => setIsTypeVisible(true)}
              />

              {/* Time Interval */}
              <TextInputField
                onPress={() => setIsIntervalVisible(true)}
                editable={false}
                formikProps={formikProps}
                label="Time Interval"
                inputKey="time"
                placeholder="Select interval"
                icon={<ChevronDown color={Colors.deemedWhite} />}
              />

              {/* ================= CURRENCY ================= */}
              <TextInputField
                editable={false}
                formikProps={formikProps}
                label="Currency"
                inputKey="currency"
                placeholder="Select currency"
                icon={<ChevronDown color={Colors.deemedWhite} />}
                onPress={() => setIsCurrencyVisible(true)}
              />

              {/* Amount */}
              <TextInputField
                formikProps={formikProps}
                label="Amount"
                inputKey="amount"
                placeholder="Enter amount"
                keyboardType="numeric"
              />

              <CustomButton
                processing={isLoading}
                title="Submit"
                style={styles.submitButton}
                onPress={formikProps.handleSubmit}
              />
            </View>
          </ScrollView>
        </LinearGradient>
      </Screen>

      {/* ============== Partnership Type Sheet ============== */}
      <CustomSheet
        titleColor="white"
        title="Select Partnership Type"
        visible={isTypeVisible}
        onClose={() => setIsTypeVisible(false)}
      >
        <ScrollView
          contentContainerStyle={{ paddingBottom: 30 }}
          style={{ padding: 18 }}
        >
          {(data?.data ?? []).map((item: any) => (
            <TouchableOpacity
              key={item._id}
              onPress={() => {
                formikProps.setFieldValue("type", item.name);
                formikProps.setFieldValue("typeId", item._id);
                setIsTypeVisible(false);
              }}
              style={styles.sheetItem}
            >
              <AppText style={styles.sheetText}>{item.name}</AppText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </CustomSheet>

      {/* ============== Time Interval Sheet ============== */}
      <CustomSheet
        titleColor="white"
        title="Select Time Interval"
        visible={isIntervalVisible}
        onClose={() => setIsIntervalVisible(false)}
      >
        <View style={{ padding: 18 }}>
          {timeIntervals.map((item) => (
            <TouchableOpacity
              key={item}
              onPress={() => {
                formikProps.setFieldValue("time", item);
                setIsIntervalVisible(false);
              }}
              style={styles.sheetItem}
            >
              <AppText style={styles.sheetText}>{item}</AppText>
            </TouchableOpacity>
          ))}
        </View>
      </CustomSheet>

      {/* ============== Currency Sheet ============== */}
      <CustomSheet
        titleColor="white"
        title="Select Currency"
        visible={isCurrencyVisible}
        onClose={() => setIsCurrencyVisible(false)}
      >
        <View style={{ padding: 18 }}>
          {currencies.map((item) => (
            <TouchableOpacity
              key={item}
              onPress={() => {
                formikProps.setFieldValue("currency", item);
                setIsCurrencyVisible(false);
              }}
              style={styles.sheetItem}
            >
              <AppText style={styles.sheetText}>{item}</AppText>
            </TouchableOpacity>
          ))}
        </View>
      </CustomSheet>

      <SuccessModal
        visible={isSuccessVisible}
        onClose={() => {
          setIsSuccessVisible(false);
          router.back();
        }}
      />
    </>
  );
};

export default PartnerShip;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: moderateSize(16),
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 20,
    padding: moderateSize(20),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  submitButton: {
    marginTop: moderateSize(30),
    borderRadius: 12,
  },
  sheetItem: {
    paddingVertical: moderateSize(14),
    borderBottomWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  sheetText: {
    color: Colors.white,
    fontFamily: Fonts.Medium,
    fontSize: moderateSize(15),
  },
});
