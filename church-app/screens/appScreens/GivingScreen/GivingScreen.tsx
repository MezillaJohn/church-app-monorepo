import { AppText } from "@/components/AppText";
import CustomButton from "@/components/Buttons/CustomButton";
import { Screen } from "@/components/Screen";
import { Colors, Fonts, whiteOpacity } from "@/constants/theme";
import { useAppAlert } from "@/context/AlertContext";
import { useDisplayError } from "@/hooks/displayError";
import { useAppDispatch } from "@/hooks/useTypedSelector";
import { setAppState } from "@/redux/slice/appState";
import {
  useGiveMutation,
  useGivingCategoryQuery,
  useGivingMethodsQuery,
} from "@/services/api/giving";
import { moderateSize } from "@/utils/useResponsiveStyle";
import * as Clipboard from "expo-clipboard";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useFormik } from "formik";
import { ChevronDown, Clock3, Copy } from "lucide-react-native";
import { ScreenHeader } from "@/components/global";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Linking,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as yup from "yup";

const currencies = [
  { code: "NGN", symbol: "₦" },
  { code: "USD", symbol: "$" },
];

const presetAmounts = ["1000", "5000", "10000", "50000"];

/* ── Currency Toggle ── */
const CurrencyToggle = ({
  active,
  onChange,
}: {
  active: string;
  onChange: (code: string) => void;
}) => {
  const slideAnim = useRef(
    new Animated.Value(active === "NGN" ? 0 : 1)
  ).current;

  const select = (code: string, index: number) => {
    Animated.spring(slideAnim, {
      toValue: index,
      useNativeDriver: true,
      speed: 20,
      bounciness: 6,
    }).start();
    onChange(code);
  };

  const HALF = (moderateSize(160) - 8) / 2;

  return (
    <View style={styles.currencyToggle}>
      <Animated.View
        style={[
          styles.currencySlider,
          {
            transform: [
              {
                translateX: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [4, HALF + 4],
                }),
              },
            ],
            width: HALF,
          },
        ]}
      />
      {currencies.map((c, i) => (
        <TouchableOpacity
          key={c.code}
          onPress={() => select(c.code, i)}
          style={styles.currencyBtn}
          activeOpacity={0.8}
        >
          <AppText
            style={[
              styles.currencyLabel,
              active === c.code && styles.currencyLabelActive,
            ]}
          >
            {c.symbol} {c.code}
          </AppText>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const GivingScreen = () => {
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);
  const [donationTypeId, setDonationTypeId] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const [giveMutation, { isLoading, error }] = useGiveMutation();
  const dispatch = useAppDispatch();
  const { alert } = useAppAlert();

  const { data } = useGivingCategoryQuery(null);
  const { data: acc, isLoading: loading } = useGivingMethodsQuery(null);

  const bankAccounts = acc?.data?.bank_accounts;

  const categories = data?.data?.map((item) => ({
    id: item?._id,
    title: item?.name,
  }));

  useDisplayError(error);

  const validationSchema = yup.object().shape({
    category: yup.string().required("Please select a giving category"),
    amount: yup.number().required("Please enter an amount"),
    currency: yup.string().required("Select a currency"),
    narration: yup.string().optional(),
  });

  const formik = useFormik({
    initialValues: {
      category: "",
      amount: "",
      currency: "NGN",
      narration: "",
    },
    onSubmit: (values) => {
      const payload: any = {
        amount: Number(values.amount),
        donationTypeId: donationTypeId,
        currency: values.currency,
        paymentMethod: "paystack",
        isAnonymous: false,
      };
      if (values.narration.trim() !== "") payload.note = values.narration;

      giveMutation(payload)
        .unwrap()
        .then((res) => {
          const paymentUrl = res?.data?.payment_url;
          if (paymentUrl) {
            if (Platform.OS === "android") {
              dispatch(setAppState({ key: "paymentUrl", value: paymentUrl }));
              dispatch(setAppState({ key: "paymentSource", value: "GIVING" }));
              router.navigate("/stack/paymentPage");
            } else {
              Linking.openURL(paymentUrl);
            }
          }
        })
        .catch((err) => console.log(err));
    },
    validationSchema,
    validateOnMount: true,
  });

  const copyToClipboard = (text: string) => {
    Clipboard.setStringAsync(text);
    alert("✅ Copied to clipboard");
  };

  const currencySymbol =
    currencies.find((c) => c.code === formik.values.currency)?.symbol ?? "₦";

  return (
    <Screen backgroundColor={Colors.dark} preset="scroll" safeAreaEdges={["top"]}>
      <LinearGradient colors={Colors.gradientDeep} style={styles.container}>
        <SafeAreaView style={{ flex: 1 }}>
          {/* ── Header ── */}
          <ScreenHeader
            title="Give Cheerfully"
            showBack
            rightAction={
              <TouchableOpacity
                onPress={() => router.push("/stack/givingHistory")}
                style={styles.historyBtn}
              >
                <Clock3 size={18} color={Colors.white} />
              </TouchableOpacity>
            }
          />


          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* ── Amount Section ── */}
            <View style={styles.amountSection}>
              <AppText style={styles.amountLabel}>Enter Amount</AppText>
              <View style={styles.amountRow}>
                <AppText style={styles.amountSymbol}>{currencySymbol}</AppText>
                <TextInput
                  style={styles.amountInput}
                  placeholder="0"
                  placeholderTextColor="rgba(255,255,255,0.15)"
                  keyboardType="numeric"
                  value={formik.values.amount}
                  onChangeText={(t) => formik.setFieldValue("amount", t)}
                  onBlur={() => formik.setFieldTouched("amount")}
                />
              </View>
              {formik.touched.amount && formik.errors.amount && (
                <AppText style={styles.errorText}>{formik.errors.amount}</AppText>
              )}

              {/* Presets */}
              {formik.values.currency === "NGN" && (
                <View style={styles.presetRow}>
                  {presetAmounts.map((amt) => (
                    <TouchableOpacity
                      key={amt}
                      style={[
                        styles.presetChip,
                        formik.values.amount === amt && styles.presetChipActive,
                      ]}
                      onPress={() => formik.setFieldValue("amount", amt)}
                    >
                      <AppText
                        style={[
                          styles.presetText,
                          formik.values.amount === amt && styles.presetTextActive,
                        ]}
                      >
                        {currencySymbol}
                        {Number(amt).toLocaleString()}
                      </AppText>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* ── Currency ── */}
            <View style={styles.fieldGroup}>
              <CurrencyToggle
                active={formik.values.currency}
                onChange={(code) => formik.setFieldValue("currency", code)}
              />
            </View>

            {/* USD Bank Accounts */}
            {loading ? (
              <ActivityIndicator
                style={{ marginVertical: 30 }}
                color={Colors.primary}
              />
            ) : (
              formik.values.currency === "USD" && (
                <View style={styles.fieldGroup}>
                  {bankAccounts?.map((bank) => {
                    const isOpen = openAccordion === bank.id;
                    return (
                      <View key={bank.id} style={styles.accordion}>
                        <TouchableOpacity
                          style={styles.accordionHeader}
                          onPress={() =>
                            setOpenAccordion(isOpen ? null : bank.id)
                          }
                        >
                          <AppText style={styles.accordionTitle}>
                            {bank.title}
                          </AppText>
                          <ChevronDown
                            size={18}
                            color={Colors.white}
                            style={{
                              transform: [
                                { rotate: isOpen ? "180deg" : "0deg" },
                              ],
                            }}
                          />
                        </TouchableOpacity>
                        {isOpen && (
                          <View style={styles.accordionBody}>
                            <AppText style={styles.bankLine}>
                              Bank: {bank.bank_name}
                            </AppText>
                            <AppText style={styles.bankLine}>
                              Account: {bank.account_name}
                            </AppText>
                            <View style={styles.copyRow}>
                              <AppText style={styles.bankLine}>
                                Number: {bank.account_number}
                              </AppText>
                              <TouchableOpacity
                                onPress={() =>
                                  copyToClipboard(bank.account_number)
                                }
                              >
                                <Copy size={14} color={Colors.primary} />
                              </TouchableOpacity>
                            </View>
                          </View>
                        )}
                      </View>
                    );
                  })}
                </View>
              )
            )}

            {/* ── Category ── */}
            {formik.values.currency === "NGN" && (
              <View style={styles.fieldGroup}>
                <AppText style={styles.fieldLabel}>Category</AppText>
                <TouchableOpacity
                  onPress={() => setShowDropdown(true)}
                  style={styles.selectField}
                  activeOpacity={0.8}
                >
                  <AppText
                    style={[
                      styles.selectText,
                      !formik.values.category && { color: Colors.muted },
                    ]}
                  >
                    {formik.values.category || "Select a category"}
                  </AppText>
                  <ChevronDown size={16} color={Colors.muted} />
                </TouchableOpacity>
                {formik.touched.category && formik.errors.category && (
                  <AppText style={styles.errorText}>
                    {formik.errors.category}
                  </AppText>
                )}
              </View>
            )}

            {/* Narration */}
            {formik.values.currency === "NGN" && (
              <View style={styles.fieldGroup}>
                <AppText style={styles.fieldLabel}>Note (optional)</AppText>
                <View style={styles.textareaWrapper}>
                  <TextInput
                    style={styles.textarea}
                    placeholder="Add a note..."
                    placeholderTextColor={Colors.muted}
                    multiline
                    value={formik.values.narration}
                    onChangeText={(t) => formik.setFieldValue("narration", t)}
                  />
                </View>
              </View>
            )}

            {/* Submit */}
            {formik.values.currency === "NGN" && (
              <CustomButton
                processing={isLoading}
                style={{ marginTop: moderateSize(8) }}
                title="Give Now"
                onPress={() => formik.handleSubmit()}
              />
            )}

            {/* Footer */}
            <View style={styles.footer}>
              <AppText style={styles.footerText}>
                "Honor the Lord with your wealth." — Proverbs 3:9
              </AppText>
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>

      {/* ── Category Modal ── */}
      <Modal visible={showDropdown} transparent animationType="fade">
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowDropdown(false)}
        >
          <View style={styles.modalBox}>
            <ScrollView
              style={{ maxHeight: moderateSize(300) }}
              showsVerticalScrollIndicator
            >
              {categories?.map((item, index) => (
                <TouchableOpacity
                  key={item?.id}
                  style={[
                    styles.modalItem,
                    index < (categories?.length ?? 0) - 1 && {
                      borderBottomWidth: 0.5,
                      borderBottomColor: whiteOpacity("0.08"),
                    },
                  ]}
                  onPress={() => {
                    formik.setFieldValue("category", item?.title);
                    setDonationTypeId(item?.id);
                    setShowDropdown(false);
                  }}
                  activeOpacity={0.7}
                >
                  <AppText style={styles.modalItemText}>
                    {item?.title}
                  </AppText>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </Screen>
  );
};

export default GivingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 100,
  },

  /* ── Top Bar ── */
  subtitleRow: {
    paddingHorizontal: moderateSize(20),
    marginBottom: moderateSize(4),
  },
  pageSubtitle: {
    color: Colors.muted,
    fontFamily: Fonts.Medium,
    fontSize: moderateSize(11),
  },
  historyBtn: {
    width: moderateSize(36),
    height: moderateSize(36),
    borderRadius: moderateSize(18),
    backgroundColor: whiteOpacity("0.06"),
    borderWidth: 1,
    borderColor: whiteOpacity("0.08"),
    alignItems: "center",
    justifyContent: "center",
  },

  scrollContent: {
    paddingHorizontal: moderateSize(20),
    paddingBottom: moderateSize(40),
  },

  /* ── Amount ── */
  amountSection: {
    alignItems: "center",
    paddingVertical: moderateSize(30),
  },
  amountLabel: {
    color: Colors.muted,
    fontFamily: Fonts.Medium,
    fontSize: moderateSize(13),
    marginBottom: moderateSize(10),
  },
  amountRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  amountSymbol: {
    color: "rgba(255,255,255,0.3)",
    fontFamily: Fonts.Bold,
    fontSize: moderateSize(30),
    marginRight: 4,
    lineHeight: 34
  },
  amountInput: {
    color: Colors.white,
    fontFamily: Fonts.Bold,
    fontWeight: "800",
    fontSize: moderateSize(48),
    minWidth: moderateSize(80),
    textAlign: "center",
    paddingVertical: 0,
  },

  /* Presets */
  presetRow: {
    flexDirection: "row",
    gap: moderateSize(8),
    marginTop: moderateSize(20),
  },
  presetChip: {
    paddingHorizontal: moderateSize(14),
    paddingVertical: moderateSize(8),
    borderRadius: 20,
    borderCurve: "continuous",
    backgroundColor: whiteOpacity("0.06"),
    borderWidth: 1,
    borderColor: whiteOpacity("0.08"),
  },
  presetChipActive: {
    backgroundColor: "rgba(0,217,166,0.12)",
    borderColor: "rgba(0,217,166,0.3)",
  },
  presetText: {
    color: Colors.deemedWhite,
    fontFamily: Fonts.Medium,
    fontSize: moderateSize(12),
  },
  presetTextActive: {
    color: Colors.primary,
    fontFamily: Fonts.SemiBold,
  },

  /* ── Fields ── */
  fieldGroup: {
    marginBottom: moderateSize(16),
  },
  fieldLabel: {
    color: Colors.deemedWhite,
    fontFamily: Fonts.SemiBold,
    fontSize: moderateSize(13),
    marginBottom: 8,
  },
  selectField: {
    backgroundColor: whiteOpacity("0.06"),
    borderRadius: 14,
    borderCurve: "continuous",
    paddingVertical: moderateSize(14),
    paddingHorizontal: moderateSize(16),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: whiteOpacity("0.08"),
  },
  selectText: {
    color: Colors.white,
    fontFamily: Fonts.Medium,
    fontSize: moderateSize(13),
  },
  textareaWrapper: {
    backgroundColor: whiteOpacity("0.06"),
    borderRadius: 14,
    borderCurve: "continuous",
    borderWidth: 1,
    borderColor: whiteOpacity("0.08"),
    padding: moderateSize(14),
  },
  textarea: {
    color: Colors.white,
    fontFamily: Fonts.Regular,
    fontSize: moderateSize(13),
    minHeight: moderateSize(70),
    textAlignVertical: "top",
    paddingVertical: 0,
  },

  /* ── Currency Toggle ── */
  currencyToggle: {
    flexDirection: "row",
    width: moderateSize(160),
    alignSelf: "center",
    backgroundColor: whiteOpacity("0.06"),
    borderRadius: 12,
    borderCurve: "continuous",
    padding: 4,
    position: "relative",
    borderWidth: 1,
    borderColor: whiteOpacity("0.08"),
  },
  currencySlider: {
    position: "absolute",
    top: 4,
    bottom: 4,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    borderCurve: "continuous",
  },
  currencyBtn: {
    flex: 1,
    alignItems: "center",
    paddingVertical: moderateSize(8),
    zIndex: 1,
  },
  currencyLabel: {
    color: Colors.deemedWhite,
    fontFamily: Fonts.Medium,
    fontSize: moderateSize(12),
  },
  currencyLabelActive: {
    color: Colors.dark,
    fontFamily: Fonts.Bold,
  },

  /* ── Accordion ── */
  accordion: {
    backgroundColor: whiteOpacity("0.04"),
    borderRadius: 14,
    borderCurve: "continuous",
    overflow: "hidden",
    marginBottom: moderateSize(10),
    borderWidth: 1,
    borderColor: whiteOpacity("0.06"),
  },
  accordionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: moderateSize(14),
  },
  accordionTitle: {
    color: Colors.white,
    fontFamily: Fonts.SemiBold,
    fontSize: moderateSize(13),
  },
  accordionBody: {
    padding: moderateSize(14),
    borderTopWidth: 1,
    borderTopColor: whiteOpacity("0.06"),
    gap: 6,
  },
  bankLine: {
    color: Colors.deemedWhite,
    fontSize: moderateSize(12),
  },
  copyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  /* ── Footer ── */
  footer: {
    alignItems: "center",
    marginTop: moderateSize(24),
  },
  footerText: {
    color: Colors.muted,
    fontSize: moderateSize(12),
    textAlign: "center",
    fontStyle: "italic",
  },

  /* ── Errors ── */
  errorText: {
    color: Colors.red,
    fontSize: moderateSize(11),
    marginTop: 6,
  },

  /* ── Modal ── */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "85%",
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderCurve: "continuous",
    paddingVertical: moderateSize(8),
    borderWidth: 1,
    borderColor: whiteOpacity("0.1"),
  },
  modalItem: {
    paddingVertical: moderateSize(14),
    paddingHorizontal: moderateSize(16),
  },
  modalItemText: {
    color: Colors.white,
    fontFamily: Fonts.Medium,
    fontSize: moderateSize(14),
  },
});
