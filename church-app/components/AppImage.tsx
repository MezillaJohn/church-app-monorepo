// AppImage.tsx

import { Image, ImageProps } from "expo-image";
import React from "react";
import { Pressable, StyleProp, View, ViewStyle } from "react-native";

type AppImageProps = ImageProps & {
  containerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  lowResSource?: string | null | undefined;
  fallbackColor?: string;
  blurHash?: string | null;
  onImagePress?: () => void;
};

const AppImage: React.FC<AppImageProps> = ({
  containerStyle,
  source,
  lowResSource,
  fallbackColor = "#1A1A24",
  blurHash,
  onImagePress,
  style,
  ...props
}) => {
  const blurhashDefault =
    "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

  // Determine which placeholder to use
  const placeholder = blurHash
    ? { blurhash: blurHash }
    : lowResSource
      ? { uri: lowResSource }
      : { blurhash: blurhashDefault };

  if (!source) {
    return (
      <View
        style={[{ backgroundColor: fallbackColor, flex: 1 }, containerStyle]}
      />
    );
  }

  const content = (
    <View style={[style, { overflow: "hidden" }]}>
      <Image
        {...props}
        source={source}
        placeholder={placeholder}
        style={[{ width: "100%", height: "100%" }]}
        contentFit={props.contentFit ?? "cover"}
        transition={props.transition ?? 300}
      />
    </View>
  );

  if (onImagePress) {
    return (
      <Pressable onPress={onImagePress} style={[containerStyle]}>
        {content}
      </Pressable>
    );
  }

  return <View style={[containerStyle]}>{content}</View>;
};

export default AppImage;
