import { AppText } from "@/components/AppText";
import ArrowRightIcon from "@/components/ArrowRightIcon";
import FacebookIcon from "@/components/FacebookIcon";
import InstagramIcon from "@/components/InstagramIcon";
import WebBrowserSheet from "@/components/WebBrowserSheet";
import YoutubeIcon from "@/components/YoutubeIcon";

import { Colors, Fonts } from "@/constants/theme";
import { useGetSocialLinksQuery } from "@/services/api/public";
import { moderateSize } from "@/utils/useResponsiveStyle";
import { Image } from "expo-image";
import React, { useState } from "react";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";

const FollowUs = () => {
  const [isVisible, setisVisible] = useState(false);
  const [webUrl, setwebUrl] = useState<string | undefined>("");

  const { data, isLoading } = useGetSocialLinksQuery(null);

  const Facebook = data?.data?.attributes?.social_links?.facebook;
  const X = data?.data?.attributes?.social_links?.twitter; // renamed
  const Instagram = data?.data?.attributes?.social_links?.instagram;
  const Youtube = data?.data?.attributes?.social_links?.youtube;

  const XImage = require("@/assets/images/x.jpg");

  const socialLinks = [
    { title: "Facebook", icon: FacebookIcon, color: "#1877F2", link: Facebook },
    {
      title: "Instagram",
      icon: InstagramIcon,
      color: "#E4405F",
      link: Instagram,
    },
    {
      title: "X",
      icon: XImage,
      isImage: true, // important
      color: "#000",
      link: X,
    },
    { title: "Youtube", icon: YoutubeIcon, color: "#FF0000", link: Youtube },
  ];

  return (
    <>
      <View
        style={{ marginTop: moderateSize(10), marginBottom: moderateSize(60) }}
      >
        <AppText
          style={{
            fontFamily: Fonts.Bold,
            marginBottom: moderateSize(14),
            fontSize: moderateSize(15),
            color: Colors.white,
          }}
        >
          Follow Us
        </AppText>

        {isLoading ? (
          <ActivityIndicator style={{ marginTop: 20 }} color={Colors.primary} />
        ) : (
          <View style={{ rowGap: moderateSize(14) }}>
            {socialLinks.map((item) => {
              const Icon = item.icon;

              return (
                <TouchableOpacity
                  onPress={() => {
                    setwebUrl(item?.link);
                    setisVisible(true);
                  }}
                  key={item.title}
                  activeOpacity={0.85}
                  style={{
                    backgroundColor: Colors.textInputGrey,
                    borderRadius: moderateSize(14),
                    paddingVertical: moderateSize(14),
                    paddingHorizontal: moderateSize(16),
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderColor: "rgba(255,255,255,0.05)",
                    borderWidth: 1,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      columnGap: 10,
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: `${item.color}33`,
                        padding: moderateSize(8),
                        borderRadius: 50,
                      }}
                    >
                      {item.isImage ? (
                        <Image
                          source={Icon}
                          style={{
                            width: moderateSize(18),
                            height: moderateSize(18),
                            borderRadius: 3,
                          }}
                          contentFit="contain"
                        />
                      ) : (
                        <Icon color={item.color} size={18} />
                      )}
                    </View>

                    <AppText
                      style={{
                        fontFamily: Fonts.Medium,
                        color: Colors.deemedWhite,
                        fontSize: moderateSize(13),
                      }}
                    >
                      {item.title}
                    </AppText>
                  </View>

                  <ArrowRightIcon />
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>

      <WebBrowserSheet
        visible={isVisible}
        webUrl={webUrl}
        onClose={() => setisVisible(false)}
      />
    </>
  );
};

export default FollowUs;
