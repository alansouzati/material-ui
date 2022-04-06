import { unstable_capitalize as capitalize } from '@mui/utils';
import {
  handleBreakpoints,
} from "@mui/system/breakpoints";
import PropTypes from "prop-types";

const responsivePropType =
  process.env.NODE_ENV !== 'production'
    ? PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.object, PropTypes.array])
    : {};

export function getPath(obj, path) {
  if (!path || typeof path !== 'string') {
    return null;
  }

  return path.split('.').reduce((acc, item) => (acc && acc[item] ? acc[item] : null), obj);
}

function getValue(themeMapping, transform, propValueFinal, userValue = propValueFinal, prop) {
  let value;

  if (typeof themeMapping === 'function') {
    value = themeMapping(propValueFinal);
  } else if (Array.isArray(themeMapping)) {
    value = themeMapping[propValueFinal] || userValue;
  } else if (typeof themeMapping[propValueFinal] === 'function') {
    value = themeMapping[propValueFinal](prop);
  } else {
    value = getPath(themeMapping, propValueFinal) || userValue;
  }

  if (transform) {
    value = transform(value);
  }

  return value;
}

// TODO: add more colors here...
const colorPropNames = ['bgcolor', 'backgroundColor', 'color'];

export const declarativeStyle = (options) => {
  const { prop, cssProperty = options.prop, themeKey, transform } = options;

  const fn = (props) => {
    if (props[prop] == null) {
      return null;
    }

    const propValue = colorPropNames.includes(prop) && !props[prop].includes('.') ? (
      `${props[prop]}.${props.theme.palette.mode}`
    ) : (
      props[prop]
    );
    const theme = props.theme;
    const themeMapping = getPath(theme, themeKey) || {};
    const styleFromPropValue = (propValueFinal) => {
      let value = getValue(themeMapping, transform, propValueFinal, undefined, prop);

      if (propValueFinal === value && typeof propValueFinal === 'string') {
        // Haven't found value
        value = getValue(
          themeMapping,
          transform,
          `${prop}${propValueFinal === 'default' ? '' : capitalize(propValueFinal)}`,
          propValueFinal,
          prop
        );
      }

      if (cssProperty === false) {
        return value;
      }

      return {
        [cssProperty]: value,
      };
    };

    return handleBreakpoints(props, propValue, styleFromPropValue);
  };

  fn.propTypes =
    process.env.NODE_ENV !== 'production'
      ? {
          [prop]: responsivePropType,
        }
      : {};

  fn.filterProps = [prop];

  return fn;
}
