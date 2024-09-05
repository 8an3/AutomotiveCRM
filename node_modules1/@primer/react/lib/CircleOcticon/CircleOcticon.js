'use strict';

var React = require('react');
var Box = require('../Box/Box.js');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var React__default = /*#__PURE__*/_interopDefault(React);

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function CircleOcticon(props) {
  const {
    size = 32,
    as,
    icon: IconComponent,
    bg,
    ...rest
  } = props;
  return /*#__PURE__*/React__default.default.createElement(Box, {
    as: as,
    bg: bg,
    overflow: "hidden",
    borderWidth: 0,
    size: size,
    borderRadius: "50%",
    borderStyle: "solid",
    borderColor: "border.default"
  }, /*#__PURE__*/React__default.default.createElement(Box, _extends({
    display: "flex",
    as: as,
    size: size
  }, rest, {
    alignItems: "center",
    justifyContent: "center"
  }), /*#__PURE__*/React__default.default.createElement(IconComponent, {
    size: size
  })));
}
CircleOcticon.displayName = "CircleOcticon";

module.exports = CircleOcticon;
