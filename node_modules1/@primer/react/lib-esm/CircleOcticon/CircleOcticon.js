import React from 'react';
import Box from '../Box/Box.js';

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function CircleOcticon(props) {
  const {
    size = 32,
    as,
    icon: IconComponent,
    bg,
    ...rest
  } = props;
  return /*#__PURE__*/React.createElement(Box, {
    as: as,
    bg: bg,
    overflow: "hidden",
    borderWidth: 0,
    size: size,
    borderRadius: "50%",
    borderStyle: "solid",
    borderColor: "border.default"
  }, /*#__PURE__*/React.createElement(Box, _extends({
    display: "flex",
    as: as,
    size: size
  }, rest, {
    alignItems: "center",
    justifyContent: "center"
  }), /*#__PURE__*/React.createElement(IconComponent, {
    size: size
  })));
}
CircleOcticon.displayName = "CircleOcticon";

export { CircleOcticon as default };
