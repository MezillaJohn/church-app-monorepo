import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";
const LibraryIconPrimary = (props: SvgProps) => (
  <Svg width={18} height={21} viewBox="0 0 18 21" fill="none" {...props}>
    <Path
      d="M9 6C9.79565 6 10.5587 5.68393 11.1213 5.12132C11.6839 4.55871 12 3.79565 12 3C12 2.20435 11.6839 1.44129 11.1213 0.87868C10.5587 0.316071 9.79565 0 9 0C8.20435 0 7.44129 0.316071 6.87868 0.87868C6.31607 1.44129 6 2.20435 6 3C6 3.79565 6.31607 4.55871 6.87868 5.12132C7.44129 5.68393 8.20435 6 9 6ZM9 9.54C6.64 7.35 3.5 6 0 6V17C3.5 17 6.64 18.35 9 20.54C11.36 18.35 14.5 17 18 17V6C14.5 6 11.36 7.35 9 9.54Z"
      fill="#00D9A6"
    />
  </Svg>
);
export default LibraryIconPrimary;
