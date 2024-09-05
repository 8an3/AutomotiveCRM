import React, { forwardRef, useContext } from 'react';
import '../../Button/ButtonBase.js';
import '../../utils/defaultSxProp.js';
import { ButtonComponent } from '../../Button/Button.js';
import '../../TooltipV2/Tooltip.js';
import '../../Tooltip/Tooltip.js';
import { MarkdownEditorContext } from './_MarkdownEditorContext.js';

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const Actions = ({
  children
}) => /*#__PURE__*/React.createElement(React.Fragment, null, children);
Actions.displayName = 'MarkdownEditor.Actions';
const ActionButton = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    disabled
  } = useContext(MarkdownEditorContext);
  return /*#__PURE__*/React.createElement(ButtonComponent, _extends({
    ref: ref,
    disabled: disabled
  }, props));
});
ActionButton.displayName = 'MarkdownEditor.ActionButton';

export { ActionButton, Actions };
