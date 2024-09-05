'use strict';

var React = require('react');
var Box = require('../Box/Box.js');
var IconButton = require('../Button/IconButton.js');
require('../Button/ButtonBase.js');
require('../utils/defaultSxProp.js');
var Button = require('../Button/Button.js');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var React__default = /*#__PURE__*/_interopDefault(React);

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const TrailingAction = /*#__PURE__*/React.forwardRef(({
  as = 'button',
  icon,
  label,
  href = null,
  ...props
}, forwardedRef) => {
  if (!icon) {
    return /*#__PURE__*/React__default.default.createElement(Box, {
      "data-component": "ActionList.TrailingAction",
      as: "span",
      sx: {
        flexShrink: 0
      }
    }, /*#__PURE__*/React__default.default.createElement(Button.ButtonComponent, _extends({
      variant: "invisible",
      as: as,
      href: href,
      ref: forwardedRef
    }, props), label));
  } else {
    return /*#__PURE__*/React__default.default.createElement(Box, {
      as: "span",
      "data-component": "ActionList.TrailingAction",
      sx: {
        flexShrink: 0
      }
    }, /*#__PURE__*/React__default.default.createElement(IconButton.IconButton, _extends({
      as: as,
      "aria-label": label,
      icon: icon,
      variant: "invisible",
      tooltipDirection: "w",
      href: href
      // @ts-expect-error StyledButton wants both Anchor and Button refs
      ,
      ref: forwardedRef
    }, props)));
  }
});
TrailingAction.displayName = 'ActionList.TrailingAction';

exports.TrailingAction = TrailingAction;
