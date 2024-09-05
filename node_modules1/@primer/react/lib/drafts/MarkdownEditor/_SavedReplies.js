'use strict';

var octiconsReact = require('@primer/octicons-react');
var React = require('react');
var SelectPanel = require('../../SelectPanel/SelectPanel.js');
var _ToolbarButton = require('./_ToolbarButton.js');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var React__default = /*#__PURE__*/_interopDefault(React);

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// SavedRepliesContext is separate from MarkdownEditorContext because the saved replies array is practically guarunteed to change
// on every render. If it was provided in the MarkdownEditorContext, it would cause the whole editor to rerender on every render.
const SavedRepliesContext = /*#__PURE__*/React.createContext(null);
const SavedRepliesButton = () => {
  const context = React.useContext(SavedRepliesContext);
  React.useImperativeHandle(context === null || context === void 0 ? void 0 : context.ref, () => ({
    openMenu: () => {
      setOpen(true);
    }
  }));
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => setFilter(''), [open]);
  const [filter, setFilter] = React.useState('');

  // there's not much point in memoizing this since the savedReplies array is likely to change on every render
  const items = context === null || context === void 0 ? void 0 : context.savedReplies.filter(({
    name
  }) => name.toLowerCase().includes(filter.toLowerCase())).map((reply, i) => ({
    text: reply.name,
    description: reply.content,
    descriptionVariant: 'block',
    trailingVisual: i < 9 ? `Ctrl + ${i + 1}` : undefined,
    sx: {
      // hide the leading visual container since we don't use the checkboxes
      '& [class*=BaseVisualContainer]:first-child': {
        display: 'none'
      },
      '& [class*=DescriptionContainer]': {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        maxWidth: '100%'
      }
    }
  }));
  const onSelectItem = item => {
    setOpen(false);
    const reply = context === null || context === void 0 ? void 0 : context.savedReplies.find(({
      name
    }) => name === (item === null || item === void 0 ? void 0 : item.text));
    if (reply) context === null || context === void 0 ? void 0 : context.onSelect(reply);
  };
  const onKeyDown = event => {
    const keyInt = parseInt(event.key, 10);
    if (items && event.ctrlKey && !Number.isNaN(keyInt) && keyInt >= 1 && keyInt <= 9) {
      event.stopPropagation();
      event.preventDefault();
      onSelectItem(items[keyInt - 1]);
    }
  };
  return items ? /*#__PURE__*/React__default.default.createElement(SelectPanel.SelectPanel, {
    renderAnchor: props => /*#__PURE__*/React__default.default.createElement(_ToolbarButton.ToolbarButton, _extends({}, props, {
      icon: octiconsReact.ReplyIcon,
      "aria-label": "Add saved reply (Ctrl + .)",
      "aria-labelledby": undefined
    })),
    open: open,
    onOpenChange: setOpen,
    items: items,
    filterValue: filter,
    onFilterChange: setFilter,
    placeholderText: "Search saved replies",
    selected: undefined,
    onSelectedChange: selection => {
      onSelectItem(Array.isArray(selection) ? selection[0] : selection);
    },
    overlayProps: {
      width: 'small',
      maxHeight: 'small',
      anchorSide: 'outside-right',
      onKeyDown
    }
  }) : /*#__PURE__*/React__default.default.createElement(React__default.default.Fragment, null);
};

exports.SavedRepliesButton = SavedRepliesButton;
exports.SavedRepliesContext = SavedRepliesContext;
