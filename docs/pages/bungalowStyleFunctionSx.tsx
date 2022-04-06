import {
  compose,
  style,
  display,
  flexbox,
  grid,
  positions,
  // sizing,
  spacing,
  border,
  borderTop,
  borderRight,
  borderBottom,
  borderLeft,
  typographyVariant,
} from '@mui/system';
import merge from "@mui/system/merge";
import {
  handleBreakpoints,
  createEmptyBreakpointObject,
  removeUnusedBreakpoints,
  values as breakpointsValues
} from "@mui/system/breakpoints";
import {declarativeStyle} from "./declarativeStyle";

function transform(value) {
  return value <= 1 && value !== 0 ? `${value * 100}%` : value;
}

export const width = declarativeStyle({
  prop: 'width',
  themeKey: 'sizing',
  transform,
});

export const maxWidth = (props) => {
  if (props.maxWidth !== undefined && props.maxWidth !== null) {
    const styleFromPropValue = (propValue) => {
      const breakpoint =
        props.theme?.breakpoints?.values?.[propValue] || breakpointsValues[propValue];
      return {
        maxWidth: breakpoint || transform(propValue),
      };
    };
    return handleBreakpoints(props, props.maxWidth, styleFromPropValue);
  }
  return null;
};
maxWidth.filterProps = ['maxWidth'];

export const minWidth = style({
  prop: 'minWidth',
  transform,
});

export const height = declarativeStyle({
  prop: 'height',
  themeKey: 'sizing',
  transform,
});

export const maxHeight = style({
  prop: 'maxHeight',
  transform,
});

export const minHeight = style({
  prop: 'minHeight',
  transform,
});

export const sizeWidth = style({
  prop: 'size',
  cssProperty: 'width',
  transform,
});

export const sizeHeight = style({
  prop: 'size',
  cssProperty: 'height',
  transform,
});

export const boxSizing = style({
  prop: 'boxSizing',
});

const sizing = compose(width, maxWidth, minWidth, height, maxHeight, minHeight, boxSizing);

const borderColor = style({
  prop: 'borderColor',
  themeKey: 'vars.palette',
});

const borderTopColor = style({
  prop: 'borderTopColor',
  themeKey: 'vars.palette',
});

const borderRightColor = style({
  prop: 'borderRightColor',
  themeKey: 'vars.palette',
});

const borderBottomColor = style({
  prop: 'borderBottomColor',
  themeKey: 'vars.palette',
});

const borderLeftColor = style({
  prop: 'borderLeftColor',
  themeKey: 'vars.palette',
});

const borderRadius = style({
  prop: 'borderRadius',
  themeKey: 'vars.radius',
});

const borders = compose(
  border,
  borderTop,
  borderRight,
  borderBottom,
  borderLeft,
  borderColor,
  borderTopColor,
  borderRightColor,
  borderBottomColor,
  borderLeftColor,
  borderRadius,
);

const color = style({
  prop: 'color',
  themeKey: 'palette',
});

const bgcolor = declarativeStyle({
  prop: 'bgcolor',
  cssProperty: 'backgroundColor',
  themeKey: 'palette',
});

const backgroundColor = declarativeStyle({
  prop: 'backgroundColor',
  themeKey: 'palette',
});

const palette = compose(color, bgcolor, backgroundColor);

const boxShadow = style({
  prop: 'boxShadow',
  themeKey: 'vars.shadow',
});

export const fontFamily = style({
  prop: 'fontFamily',
  themeKey: 'vars.fontFamily',
});

export const fontSize = style({
  prop: 'fontSize',
  themeKey: 'vars.fontSize',
});

export const fontWeight = style({
  prop: 'fontWeight',
  themeKey: 'vars.fontWeight',
});

export const letterSpacing = style({
  prop: 'letterSpacing',
  themeKey: 'vars.letterSpacing',
});

export const lineHeight = style({
  prop: 'lineHeight',
  themeKey: 'vars.lineHeight',
});

const typography = compose(
  typographyVariant,
  fontFamily,
  fontSize,
  fontWeight,
  letterSpacing,
  lineHeight,
);

const defaultStyleFunctionMapping = {
  borders,
  display,
  flexbox,
  grid,
  positions,
  palette,
  boxShadow,
  sizing,
  spacing,
  typography,
};


function callIfFn(maybeFn, arg) {
  return typeof maybeFn === 'function' ? maybeFn(arg) : maybeFn;
}

function objectsHaveSameKeys(...objects) {
  const allKeys = objects.reduce((keys, object) => keys.concat(Object.keys(object)), []);
  const union = new Set(allKeys);
  return objects.every((object) => union.size === Object.keys(object).length);
}

/* @ts-ignore */
function createBungalowStyleFunctionSx(styleFunctionMapping = defaultStyleFunctionMapping) {
  const propToStyleFunction = Object.keys(styleFunctionMapping).reduce((acc, styleFnName) => {
    styleFunctionMapping[styleFnName].filterProps.forEach((propName) => {
      acc[propName] = styleFunctionMapping[styleFnName];
    });

    return acc;
  }, {});

  function getThemeValue(prop, value, theme) {
    const inputProps = {
      [prop]: value,
      theme,
    };

    const styleFunction = propToStyleFunction[prop];
    if (!styleFunction) {
      return { [prop]: value };
    }
    const result = styleFunction(inputProps);
    if (typeof result[prop] === 'object') {
      return ({ ...result[prop] });
    }
    return result;
  }

  function styleFunctionSx(props) {
    const { sx, theme = {} } = props || {};
    if (!sx) {
      return null; // emotion & styled-components will neglect null
    }

    /*
     * Receive `sxInput` as object or callback
     * and then recursively check keys & values to create media query object styles.
     * (the result will be used in `styled`)
     */
    function traverse(sxInput) {
      let sxObject = sxInput;
      if (typeof sxInput === 'function') {
        sxObject = sxInput(theme);
      } else if (typeof sxInput !== 'object') {
        // value
        return sxInput;
      }
      if (!sxObject) {
        return null;
      }
      const emptyBreakpoints = createEmptyBreakpointObject(theme.breakpoints);
      const breakpointsKeys = Object.keys(emptyBreakpoints);

      let css = emptyBreakpoints;

      Object.keys(sxObject).forEach((styleKey) => {
        const value = callIfFn(sxObject[styleKey], theme);
        if (value !== null && value !== undefined) {
          if (typeof value === 'object') {
            if (propToStyleFunction[styleKey]) {
              css = merge(css, getThemeValue(styleKey, value, theme));
            } else {
              const breakpointsValues = handleBreakpoints({ theme }, value, (x) => ({
                [styleKey]: x,
              }));

              if (objectsHaveSameKeys(breakpointsValues, value)) {
                css[styleKey] = styleFunctionSx({ sx: value, theme });
              } else {
                css = merge(css, breakpointsValues);
              }
            }
          } else {
            css = merge(css, getThemeValue(styleKey, value, theme));
          }
        }
      });

      return removeUnusedBreakpoints(breakpointsKeys, css);
    }

    return Array.isArray(sx) ? sx.map(traverse) : traverse(sx);
  }

  return styleFunctionSx;
}

export const bungalowStyleFunctionSx = createBungalowStyleFunctionSx();

// styleFunctionSx.filterProps = ['sx'];

