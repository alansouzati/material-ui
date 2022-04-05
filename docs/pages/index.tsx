import * as React from 'react';
import {
  BoxTypeMap,
  createBox,
  createBreakpoints,
  StandardCSSProperties,
} from "@mui/system";
import {ThemeProvider, createTheme} from "@mui/material";
import { unstable_ClassNameGenerator as ClassNameGenerator } from "@mui/base/className";
import { OverridableComponent } from "@mui/types";
import {CSSProperties} from "@mui/styles";
import {bungalowStyleFunctionSx} from "./bungalowStyleFunctionSx";

type SizingType = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';

declare module '@mui/material/styles' {
  interface Theme {
    sizing: Partial<Record<SizingType, (prop: string) => CSSProperties | CSSProperties | string>>;
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    sizing?: Partial<Record<SizingType, (prop: string) => CSSProperties | CSSProperties | string>>;
  }
}

const breakpoints = createBreakpoints({
  values: {
    xs: 0,
    sm: 600,
    md: 960,
    lg: 1280,
    xl: 1560,
  }
});

const bungalowTheme = createTheme({
  sizing: {
    small: (sizingProp: string) => ({
      [sizingProp]: '44px',
      [breakpoints.down('sm')]: {
        [sizingProp]: '33px',
      },
    }),
    medium: (sizingProp: string) => ({
      [sizingProp]: '88px',
      [breakpoints.down('sm')]: {
        [sizingProp]: '66px',
      },
    }),
  }
});

interface CustomBoxProps {
  height?: SizingType | StandardCSSProperties['height'];
  width?: SizingType | StandardCSSProperties['width'];
  sx?: {
    height?: SizingType | StandardCSSProperties['height'];
    width?: SizingType | StandardCSSProperties['width'];
  };
}
const BungalowBox = createBox({
  defaultTheme: bungalowTheme,
  defaultClassName: 'BungalowBox-root',
  generateClassName: ClassNameGenerator.generate,
  styleFunctionSx: bungalowStyleFunctionSx,
}) as OverridableComponent<BoxTypeMap<CustomBoxProps>>;

export default function Home() {
  return (
    <ThemeProvider theme={bungalowTheme}>
      <BungalowBox border={1} width="medium" height='small'>I'm a declarative box</BungalowBox>
    </ThemeProvider>
  );
}
