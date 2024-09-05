import React from 'react';
import styled from 'styled-components';
import { variant } from 'styled-system';
import { get } from '../constants.js';
import sx from '../sx.js';

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const variants = variant({
  variants: {
    default: {
      color: 'fg.default',
      backgroundColor: 'accent.subtle',
      borderColor: 'accent.muted',
      svg: {
        color: 'accent.fg'
      }
    },
    success: {
      color: 'fg.default',
      backgroundColor: 'success.subtle',
      borderColor: 'success.muted',
      svg: {
        color: 'success.fg'
      }
    },
    danger: {
      color: 'fg.default',
      backgroundColor: 'danger.subtle',
      borderColor: 'danger.muted',
      svg: {
        color: 'danger.fg'
      }
    },
    warning: {
      color: 'fg.default',
      backgroundColor: 'attention.subtle',
      borderColor: 'attention.muted',
      svg: {
        color: 'attention.fg'
      }
    }
  }
});
const StyledFlash = styled.div.withConfig({
  displayName: "Flash__StyledFlash",
  componentId: "sc-hzrzfc-0"
})(["position:relative;color:", ";padding:", ";border-style:solid;border-width:", ";border-radius:", ";margin-top:", ";p:last-child{margin-bottom:0;}svg{margin-right:", ";}", ";", ";"], get('colors.fg.default'), get('space.3'), props => props.full ? '1px 0px' : '1px', props => props.full ? '0' : get('radii.2'), props => props.full ? '-1px' : '0', get('space.2'), variants, sx);
const Flash = /*#__PURE__*/React.forwardRef(function Flash({
  as,
  variant = 'default',
  ...rest
}, ref) {
  return /*#__PURE__*/React.createElement(StyledFlash, _extends({
    ref: ref,
    as: as,
    variant: variant
  }, rest));
});
if (process.env.NODE_ENV !== "production") {
  Flash.displayName = 'Flash';
}

export { Flash as default };
