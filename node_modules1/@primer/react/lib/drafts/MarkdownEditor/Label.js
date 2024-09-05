'use strict';

var React = require('react');
var InputLabel = require('../../internal/components/InputLabel.js');
var _MarkdownEditorContext = require('./_MarkdownEditorContext.js');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var React__default = /*#__PURE__*/_interopDefault(React);

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// ref is not forwarded because InputLabel does not (yet) support it
const Legend = ({
  sx,
  ...props
}) => {
  // using context and definining a Slot in the same component causes an infinite loop, so these must be separate
  const {
    disabled,
    required
  } = React.useContext(_MarkdownEditorContext.MarkdownEditorContext);
  return /*#__PURE__*/React__default.default.createElement(InputLabel, _extends({
    as: "legend",
    disabled: disabled,
    required: required
  }, props, {
    sx: {
      cursor: 'default',
      mb: 1,
      ...sx
    }
  }));
};
Legend.displayName = "Legend";
Legend.displayName = 'MarkdownEditor.Label';
const Label = props => /*#__PURE__*/React__default.default.createElement(Legend, props);
Label.displayName = "Label";

exports.Label = Label;
