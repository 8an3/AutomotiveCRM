'use strict';

var React = require('react');
require('@styled-system/css');
var merge = require('deepmerge');
var defaultSxProp = require('../utils/defaultSxProp.js');
require('@primer/behaviors/utils');
require('@primer/behaviors');
var useRefObjectAsForwardedRef = require('../hooks/useRefObjectAsForwardedRef.js');
var Heading$1 = require('../Heading/Heading.js');
var shared = require('./shared.js');
var _VisuallyHidden = require('../_VisuallyHidden.js');
var ActionListContainerContext = require('./ActionListContainerContext.js');
var invariant = require('../utils/invariant.js');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var React__default = /*#__PURE__*/_interopDefault(React);
var merge__default = /*#__PURE__*/_interopDefault(merge);

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const Heading = /*#__PURE__*/React.forwardRef(({
  as,
  children,
  sx = defaultSxProp.defaultSxProp,
  visuallyHidden = false,
  ...props
}, forwardedRef) => {
  var _props$id;
  const innerRef = React__default.default.useRef(null);
  useRefObjectAsForwardedRef.useRefObjectAsForwardedRef(forwardedRef, innerRef);
  const {
    headingId: headingId,
    variant: listVariant
  } = React__default.default.useContext(shared.ListContext);
  const {
    container
  } = React__default.default.useContext(ActionListContainerContext.ActionListContainerContext);

  // Semantic <menu>s don't have a place for headers within them, they should be aria-labelledby the menu button's name.
  !(container !== 'ActionMenu') ? process.env.NODE_ENV !== "production" ? invariant.invariant(false, `ActionList.Heading shouldn't be used within an ActionMenu container. Menus are labelled by the menu button's name.`) : invariant.invariant(false) : void 0;
  const styles = {
    marginBottom: 2,
    marginX: listVariant === 'full' ? 2 : 3
  };
  return /*#__PURE__*/React__default.default.createElement(_VisuallyHidden, {
    isVisible: !visuallyHidden
  }, /*#__PURE__*/React__default.default.createElement(Heading$1, _extends({
    as: as,
    ref: innerRef
    // use custom id if it is provided. Otherwise, use the id from the context
    ,
    id: (_props$id = props.id) !== null && _props$id !== void 0 ? _props$id : headingId,
    sx: merge__default.default(styles, sx)
  }, props), children));
});
Heading.displayName = 'ActionList.Heading';

exports.Heading = Heading;
