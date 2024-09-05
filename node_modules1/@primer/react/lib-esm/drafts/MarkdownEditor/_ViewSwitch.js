import React from 'react';
import Box from '../../Box/Box.js';
import TabNav from '../../TabNav/TabNav.js';

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// no point in memoizing this component because onLoadPreview depends on value, so it would still re-render on every change
const ViewSwitch = ({
  selectedView,
  onViewSelect,
  onLoadPreview,
  disabled
}) => {
  // don't get disabled from context - the switch is not disabled when the editor is disabled

  const sharedProps = selectedView === 'preview' ? {
    onClick: () => onViewSelect === null || onViewSelect === void 0 ? void 0 : onViewSelect('edit')
  } : {
    onClick: () => {
      onLoadPreview();
      onViewSelect === null || onViewSelect === void 0 ? void 0 : onViewSelect('preview');
    },
    onMouseOver: () => onLoadPreview(),
    onFocus: () => onLoadPreview()
  };
  return /*#__PURE__*/React.createElement(Box, {
    sx: {
      display: 'flex',
      flexDirection: 'row'
    }
  }, /*#__PURE__*/React.createElement(TabNav, {
    "aria-label": "View mode"
  }, /*#__PURE__*/React.createElement(TabNav.Link, _extends({}, sharedProps, {
    as: "button",
    selected: selectedView === 'edit',
    disabled: disabled,
    sx: {
      cursor: 'pointer',
      color: selectedView === 'edit' ? 'fg.default' : 'fg.muted',
      borderTopLeftRadius: 1
    }
  }), "Write"), /*#__PURE__*/React.createElement(TabNav.Link, _extends({}, sharedProps, {
    as: "button",
    selected: selectedView === 'preview',
    disabled: disabled,
    sx: {
      cursor: 'pointer',
      color: selectedView === 'preview' ? 'fg.default' : 'fg.muted',
      borderTopLeftRadius: 1
    }
  }), "Preview")));
};
ViewSwitch.displayName = "ViewSwitch";

export { ViewSwitch };
