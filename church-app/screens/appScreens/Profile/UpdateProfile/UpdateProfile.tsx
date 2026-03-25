import AppBackHeader from "@/components/AppBackHeader";
import { AppText } from "@/components/AppText";
import BottomSheetPicker from "@/components/BottomSheetPicker";
import CustomButton from "@/components/Buttons/CustomButton";
import { Screen } from "@/components/Screen";
import TextInputField from "@/components/TextInput";
import { countries } from "@/constants/country";
import { Colors } from "@/constants/theme";
import { useDisplayError } from "@/hooks/displayError";
import { ProfileFormData } from "@/screens/appScreens/Home/component/ProfileCompletionModal";
import { useUpdateProfileMutation } from "@/services/api/profile";
import { useChurchCentersQuery } from "@/services/api/public";
import { moderateSize, Size } from "@/utils/useResponsiveStyle";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import { Alert, StyleSheet, Switch, View } from "react-native";

const UpdateProfile = () => {
  const [form, setForm] = useState<ProfileFormData>({
    church_centre: null, // ✅ stores ID
    country: "",
    phone: "",
    gender: "",
    church_member: false,
  });

  const { data } = useChurchCentersQuery(null);

  // ✅ names list for UI
  const centreNames = useMemo(() => {
    return data?.data?.map((item) => item.attributes.name) ?? [];
  }, [data]);

  // ✅ map name -> id
  const centreMap = useMemo(() => {
    const map: Record<string, number> = {};
    data?.data?.forEach((item) => {
      map[item.attributes.name] = item.id;
    });
    return map;
  }, [data]);

  const [updateProfileMutation, { isLoading, error }] =
    useUpdateProfileMutation();

  useDisplayError(error);

  const handleChange = (key: keyof ProfileFormData, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    // Start with an empty payload
    const payload: any = {};

    // Utility: Add to payload ONLY if value is not empty
    const addIfFilled = (key: string, value: any) => {
      if (value !== null && value !== undefined && value !== "") {
        payload[key] = value;
      }
    };

    // Build cleaned payload
    addIfFilled("country", form.country);
    addIfFilled("phone", form.phone);
    addIfFilled("gender", form.gender ? form.gender.toLowerCase() : "");
    addIfFilled("churchMember", form.church_member);

    // Add churchCentreId ONLY if:
    // - church_member is true
    // - centre selected
    if (form.church_member && form.church_centre) {
      payload.churchCentreId = String(form.church_centre);
    }

    console.log("📦 Final Payload Sent:", payload);

    updateProfileMutation(payload)
      .unwrap()
      .then(() => {
        router.back();
        Alert.alert(
          "✅ Profile Saved",
          "Your profile has been updated successfully!"
        );
      })
      .catch((err) => console.log(err));
  };

  return (
    <LinearGradient colors={Colors.gradientDeep} style={styles.container}>
      <Screen
        backgroundColor="transparent"
        preset="fixed"
        safeAreaEdges={["top", "bottom"]}
      >
        <AppBackHeader text="Update Profile" style={{ marginBottom: 30 }} />

        <View style={styles.card}>
          {/* ✅ Church Centre */}

          {/* ✅ Country */}
          <BottomSheetPicker
            label="Country"
            value={form.country}
            options={countries.countries}
            onSelect={(v) => handleChange("country", v)}
          />

          {/* ✅ Phone */}
          <View style={{ marginBottom: moderateSize(4) }}>
            <AppText style={{ marginBottom: 6, color: Colors.white }}>
              Phone Number
            </AppText>
            <TextInputField
              value={form.phone}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              onChangeText={(v) => handleChange("phone", v)}
            />
          </View>

          {/* ✅ Gender */}
          <BottomSheetPicker
            label="Gender"
            value={form.gender}
            options={["Male", "Female"]}
            onSelect={(v) => handleChange("gender", v)}
          />

          {/* ✅ Church Member Switch (same style as your modal) */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginVertical: moderateSize(20),
            }}
          >
            <Switch
              value={form.church_member}
              onValueChange={(v) => handleChange("church_member", v)}
              trackColor={{ false: "#ccc", true: Colors.primary }}
            />
            <AppText style={{ marginLeft: 10 }}>I’m a church member</AppText>
          </View>

          {form.church_member && (
            <BottomSheetPicker
              height={Size.getHeight() * 0.8}
              label="Church Centre"
              value={
                centreNames.find(
                  (name) => centreMap[name] === form.church_centre
                ) || ""
              }
              options={centreNames}
              onSelect={(name) => {
                const id = centreMap[name];
                handleChange("church_centre", id); // ✅ store ID
              }}
            />
          )}
        </View>

        <CustomButton
          processing={isLoading}
          style={{ marginTop: "auto" }}
          title="Update Profile"
          onPress={handleSubmit}
        />
      </Screen>
    </LinearGradient>
  );
};

export default UpdateProfile;

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
});
