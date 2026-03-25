import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";
const TvIconPrimary = (props: SvgProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path d="M1 2H23V19H18.246L12 12.76L5.755 19H1V2Z" fill="#00D9A6" />
    <Path
      d="M11.9999 15.587L7.75887 19.83L5.33887 22.244H8.17287L11.9999 18.416L15.8289 22.244H18.6619L11.9999 15.587Z"
      fill="#00D9A6"
    />
  </Svg>
);
export default TvIconPrimary;
