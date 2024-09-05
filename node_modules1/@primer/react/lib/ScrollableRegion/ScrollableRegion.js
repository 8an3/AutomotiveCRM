'use strict';

var React = require('react');
var Box = require('../Box/Box.js');
var useOverflow = require('../hooks/useOverflow.js');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var React__default = /*#__PURE__*/_interopDefault(React);

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const defaultStyles = {
  // When setting overflow, we also set `position: relative` to avoid
  // `position: absolute` items breaking out of the container and causing
  // scrollbars on the page. This can occur with common classes like `sr-only`
  // and can cause difficult to track down layout issues
  position: 'relative',
  overflow: 'auto'
};
function ScrollableRegion({
  'aria-label': label,
  'aria-labelledby': labelledby,
  children,
  ...rest
}) {
  const ref = React__default.default.useRef(null);
  const hasOverflow = useOverflow.useOverflow(ref);
  const regionProps = hasOverflow ? {
    'aria-label': label,
    'aria-labelledby': labelledby,
    role: 'region',
    tabIndex: 0
  } : {};
  return /*#__PURE__*/React__default.default.createElement(Box, _extends({}, rest, regionProps, {
    ref: ref,
    sx: defaultStyles
  }), children);
}
ScrollableRegion.displayName = "ScrollableRegion";

exports.ScrollableRegion = ScrollableRegion;
