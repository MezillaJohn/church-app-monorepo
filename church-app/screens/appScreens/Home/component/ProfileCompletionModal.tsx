import AppModal from "@/components/AppModal";
import { AppText } from "@/components/AppText";
import BottomSheetPicker from "@/components/BottomSheetPicker";
import CustomButton from "@/components/Buttons/CustomButton";
import TextInputField from "@/components/TextInput";
import { countries } from "@/constants/country";
import { Colors, Fonts } from "@/constants/theme";
import { useDisplayError } from "@/hooks/displayError";
import { useUpdateProfileMutation } from "@/services/api/profile";
import { useChurchCentersQuery } from "@/services/api/public";
import { moderateSize, Size } from "@/utils/useResponsiveStyle";
import React, { useMemo, useState } from "react";
import { Alert, ScrollView, Switch, View } from "react-native";

export interface ProfileFormData {
  church_centre: number | null;
  country: string;
  phone: string;
  gender: "male" | "female" | "";
  church_member: boolean;
}

interface ProfileCompletionModalProps {
  visible: boolean;
  onClose: () => void;
}

const ProfileCompletionModal: React.FC<ProfileCompletionModalProps> = ({
  visible,
  onClose,
}) => {
  const [form, setForm] = useState<ProfileFormData>({
    church_centre: null,
    country: "",
    phone: "",
    gender: "",
    church_member: false,
  });

  const { data } = useChurchCentersQuery(null);

  const centreNames = useMemo(() => {
    return data?.data?.map((item: any) => item.name) ?? [];
  }, [data]);

  const centreMap = useMemo(() => {
    const map: Record<string, string> = {};
    data?.data?.forEach((item: any) => {
      map[item.name] = item._id || item.id;
    });
    return map;
  }, [data]);

  const [updateProfileMutation, { isLoading, error }] =
    useUpdateProfileMutation();
  useDisplayError(error);

  const [errors, setErrors] = useState<
    Partial<Record<keyof ProfileFormData, string>>
  >({});

  const handleChange = (key: keyof ProfileFormData, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  // ✅ Updated validation (church centre only required if member)
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ProfileFormData, string>> = {};

    if (!form.country.trim()) newErrors.country = "Select a country";
    if (!form.gender.trim()) newErrors.gender = "Select your gender";

    if (form.church_member && !form.church_centre) {
      newErrors.church_centre = "Select a church centre";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    // ✅ Construct clean payload
    const payload: any = {
      country: form.country,
      phone: form.phone,
      gender: form.gender.toLowerCase(),
      church_member: form.church_member,
    };

    // Include only when needed
    if (form.church_member && form.church_centre) {
      payload.church_centre = form.church_centre;
    }

    updateProfileMutation(payload)
      .unwrap()
      .then(() => {
        onClose();
        Alert.alert(
          "✅ Profile Saved",
          "Your profile has been updated successfully!"
        );
      })
      .catch((err) => console.log(err));
  };

  return (
    <AppModal
      height={Size.getHeight() * 0.8} // ⬅ modal fills 80% of screen
      isModalVisible={visible}
      handleClose={onClose}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: moderateSize(20),
          paddingBottom: 40,
        }}
      >
        <AppText
          style={{
            fontSize: moderateSize(16),
            marginBottom: moderateSize(4),
            textAlign: "center",
            fontFamily: Fonts.Bold,
          }}
        >
          Complete Your Profile
        </AppText>
        <AppText
          style={{
            fontSize: moderateSize(11),
            marginBottom: moderateSize(16),
            textAlign: "center",
            color: Colors.deemedWhite,
          }}
        >
          You can skip this and complete it later
        </AppText>

        {/* Country */}
        <BottomSheetPicker
          label="Country"
          value={form.country}
          options={countries.countries}
          onSelect={(v) => handleChange("country", v)}
          error={errors.country}
        />

        {/* Phone */}
        <View style={{ marginBottom: moderateSize(4) }}>
          <AppText
            style={{
              fontSize: moderateSize(12),
              marginBottom: 6,
              color: Colors.white,
            }}
          >
            Phone Number
          </AppText>
          <TextInputField
            value={form.phone}
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
            onChangeText={(v) => handleChange("phone", v)}
          />
        </View>

        {/* Gender */}
        <BottomSheetPicker
          label="Gender"
          height={moderateSize(200)}
          value={form.gender}
          options={["Male", "Female"]}
          onSelect={(v) => handleChange("gender", v)}
          error={errors.gender}
        />

        {/* Church Member Toggle */}
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
          <AppText style={{ marginLeft: 10, fontSize: moderateSize(12) }}>
            I’m a church member
          </AppText>
        </View>

        {/* Optional church centre */}
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
              handleChange("church_centre", id);
            }}
            error={errors.church_centre}
          />
        )}

        <CustomButton
          processing={isLoading}
          style={{ marginTop: 20 }}
          title="Save Profile"
          onPress={handleSubmit}
        />

        <CustomButton
          style={{
            marginTop: 10,
            marginBottom: 20,
            backgroundColor: "transparent",
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.2)",
          }}
          title="Skip for now"
          onPress={onClose}
        />
      </ScrollView>
    </AppModal>
  );
};

export default ProfileCompletionModal;
