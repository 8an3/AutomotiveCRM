import React, { useContext } from 'react';
import InputLabel from '../../internal/components/InputLabel.js';
import { MarkdownEditorContext } from './_MarkdownEditorContext.js';

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
  } = useContext(MarkdownEditorContext);
  return /*#__PURE__*/React.createElement(InputLabel, _extends({
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
const Label = props => /*#__PURE__*/React.createElement(Legend, props);
Label.displayName = "Label";

export { Label };
