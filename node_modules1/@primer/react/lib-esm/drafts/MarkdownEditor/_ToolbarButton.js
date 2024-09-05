import React, { forwardRef, useContext } from 'react';
import { IconButton } from '../../Button/IconButton.js';
import '../../Button/ButtonBase.js';
import '../../utils/defaultSxProp.js';
import '../../Button/Button.js';
import { MarkdownEditorContext } from './_MarkdownEditorContext.js';

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const ToolbarButton = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    disabled,
    condensed
  } = useContext(MarkdownEditorContext);
  return /*#__PURE__*/React.createElement(IconButton, _extends({
    ref: ref,
    size: condensed ? 'small' : 'medium',
    variant: "invisible",
    disabled: disabled
    // Prevent focus leaving input:
    ,
    onMouseDown: e => e.preventDefault()
  }, props, {
    sx: {
      color: 'fg.muted',
      ...props.sx
    }
    // Keeping the tooltip disable since it is not maintained anymore and its tests were failing.
    ,
    unsafeDisableTooltip: true
  }));
});
ToolbarButton.displayName = 'MarkdownEditor.ToolbarButton';

export { ToolbarButton };
