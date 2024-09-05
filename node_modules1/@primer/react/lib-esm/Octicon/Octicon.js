import React from 'react';
import styled from 'styled-components';
import sx from '../sx.js';

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const Icon = /*#__PURE__*/React.forwardRef((props, ref) => {
  const {
    icon: IconComponent,
    ...rest
  } = props;
  return /*#__PURE__*/React.createElement(IconComponent, _extends({}, rest, {
    ref: ref
  }));
});
const Octicon = styled(Icon).withConfig({
  displayName: "Octicon",
  componentId: "sc-9kayk9-0"
})(["", ""], ({
  color,
  sx: sxProp
}) => sx({
  sx: {
    color,
    ...sxProp
  }
}));

export { Octicon as default };
