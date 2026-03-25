// components/AppImageBackground.tsx
import React from "react";
import { StyleProp, ViewStyle, View } from "react-native";
import { ImageBackground, ImageBackgroundProps } from "expo-image";

type AppImageBackgroundProps = ImageBackgroundProps & {
  containerStyle?: StyleProp<ViewStyle>;
  lowResSource?: string | null | undefined; // tiny low-res image URL
  fallbackColor?: string; // color to show if image URL is missing
  onImageLoaded?: () => void;
};

const AppImageBackground: React.FC<AppImageBackgroundProps> = ({
  containerStyle,
  source,
  lowResSource,
  fallbackColor = "#1A1A24",
  onImageLoaded,
  children,
  ...props
}) => {
  const blurhash =
    "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

  // No image URL → fallback color
  if (!source) {
    return (
      <View
        style={[{ backgroundColor: fallbackColor, flex: 1 }, containerStyle]}
      >
        {children}
      </View>
    );
  }

  return (
    <ImageBackground
      onLoadEnd={() => {
        onImageLoaded && onImageLoaded();
      }}
      {...props}
      style={props.style}
      source={source}
      placeholder={lowResSource ? { uri: lowResSource } : { blurhash }}
      transition={props.transition ?? 800}
    >
      {children}
    </ImageBackground>
  );
};

export default AppImageBackground;
