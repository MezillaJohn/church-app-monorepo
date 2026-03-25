import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";
const TvIconWhite = (props: SvgProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M1 2H23V19H17V17H21V4H3L3.001 17H7.001V19H1V2ZM12 15.587L16.242 19.829L18.662 22.244H15.829L14.829 21.244L12 18.417L9.173 21.245L8.173 22.245H5.34L7.759 19.831L12 15.587Z"
      fill="#DBDBDB"
    />
  </Svg>
);
export default TvIconWhite;
