import * as React from 'react';
import {
  BoxTypeMap,
  createBreakpoints,
  StandardCSSProperties,
} from "@mui/system";
import {ThemeProvider, createTheme} from "@mui/material";
import { OverridableComponent } from "@mui/types";
import {CSSProperties} from "@mui/styles";
import {deepmerge} from "@mui/utils";
import {bungalowStyleFunctionSx} from "./bungalowStyleFunctionSx";
import {createBox} from "./createBox";

type SizingType = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';

declare module '@mui/material/styles' {
  interface Theme {
    sizing: Partial<Record<SizingType, (prop: string) => CSSProperties | CSSProperties | string>>;
  }
  interface ThemeOptions {
    sizing?: Partial<Record<SizingType, (prop: string) => CSSProperties | CSSProperties | string>>;
  }
  interface Palette {
    appBackground: Palette['primary'];
    textPrimary: Palette['primary'];
  }
  interface PaletteOptions {
    appBackground: PaletteOptions['primary'];
    textPrimary: PaletteOptions['primary'];
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

export const bungalowTheme = createTheme({
  palette: {
    appBackground: {
      light: '#e2e2e2',
      dark: '#373737',
      main: '#e2e2e2'
    },
    textPrimary: {
      dark: '#f8f8f8',
      light: '#444444',
      main: '#f8f8f8'
    },
  },
  sizing: {
    large: (sizingProp: string) => ({
      [sizingProp]: '40rem',
      [breakpoints.down('sm')]: {
        [sizingProp]: '20rem',
      },
    }),
  },
});

interface CustomBoxProps {
  height?: SizingType | StandardCSSProperties['height'];
  width?: SizingType | StandardCSSProperties['width'];
  bgcolor?:
    'appBackground' |
    'appBackground.light' |
    'appBackground.dark' |
    'textPrimary' |
    'textPrimary.light' |
    'textPrimary.dark' |
    StandardCSSProperties['color'] |
    string;
  sx?: {
    height?: SizingType | StandardCSSProperties['height'];
    width?: SizingType | StandardCSSProperties['width'];
    bgcolor?:
      'appBackground' |
      'appBackground.light' |
      'appBackground.dark' |
      'textPrimary' |
      'textPrimary.light' |
      'textPrimary.dark' |
      StandardCSSProperties['color'] |
      string;
  };
}
const BungalowBox = createBox({
  defaultTheme: bungalowTheme,
  styleFunctionSx: bungalowStyleFunctionSx,
}) as OverridableComponent<BoxTypeMap<CustomBoxProps>>;

export default function Home() {
  const body = (
    <BungalowBox width="large" bgcolor='appBackground'>
      I'm a declarative box
    </BungalowBox>
  );
  return (
    <React.Fragment>
      <ThemeProvider theme={bungalowTheme}>
        {body}
      </ThemeProvider>
      <ThemeProvider theme={deepmerge(bungalowTheme, { palette: { mode: 'dark' } })}>
        {body}
      </ThemeProvider>
    </React.Fragment>
  );
}
