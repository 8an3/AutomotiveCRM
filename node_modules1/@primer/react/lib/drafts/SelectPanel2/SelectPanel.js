'use strict';

var React = require('react');
var octiconsReact = require('@primer/octicons-react');
require('../../theme.js');
require('../../constants.js');
require('../../BaseStyles.js');
require('../../ThemeProvider.js');
var Box = require('../../Box/Box.js');
var IconButton = require('../../Button/IconButton.js');
require('../../Button/ButtonBase.js');
require('../../utils/defaultSxProp.js');
var Button = require('../../Button/Button.js');
require('../../PageLayout/PageLayout.js');
require('../../SplitPageLayout/SplitPageLayout.js');
require('@primer/behaviors/utils');
var useProvidedRefOrCreate = require('../../hooks/useProvidedRefOrCreate.js');
require('../../ConfirmationDialog/ConfirmationDialog.js');
require('@primer/behaviors');
var useResponsiveValue = require('../../hooks/useResponsiveValue.js');
require('styled-components');
require('@styled-system/css');
require('deepmerge');
require('../../Radio/Radio.js');
require('../../ActionList/index.js');
require('../../ActionMenu/ActionMenu.js');
require('../../AnchoredOverlay/AnchoredOverlay.js');
require('../../Autocomplete/Autocomplete.js');
require('../../Avatar/Avatar.js');
require('../../AvatarPair/AvatarPair.js');
require('../../AvatarStack/AvatarStack.js');
require('../../BranchName/BranchName.js');
require('../../Breadcrumbs/Breadcrumbs.js');
require('../../ButtonGroup/ButtonGroup.js');
require('../../Caret.js');
require('../../CircleOcticon/CircleOcticon.js');
require('../../CheckboxGroup/CheckboxGroup.js');
require('../../CircleBadge/CircleBadge.js');
require('../../CounterLabel/CounterLabel.js');
require('../../Details/Details.js');
require('../../Dialog.js');
require('../../Flash/Flash.js');
var _FormControlContext = require('../../FormControl/_FormControlContext.js');
require('../../FormControl/FormControl.js');
require('../../Header/Header.js');
var Heading = require('../../Heading/Heading.js');
require('../../Label/Label.js');
require('../../LabelGroup/LabelGroup.js');
var Link = require('../../Link/Link.js');
require('../../NavList/NavList.js');
var Octicon = require('../../Octicon/Octicon.js');
var Overlay = require('../../Overlay/Overlay.js');
require('../../Pagehead/Pagehead.js');
require('../../Pagination/Pagination.js');
require('../../PointerBox/PointerBox.js');
require('../../Popover/Popover.js');
require('react-dom');
require('../../ProgressBar/index.js');
require('../../RadioGroup/RadioGroup.js');
require('../../RelativeTime/RelativeTime.js');
require('../../SegmentedControl/SegmentedControl.js');
require('../../Select.js');
require('../../SelectPanel/SelectPanel.js');
require('../../SideNav.js');
var Spinner = require('../../Spinner/Spinner.js');
require('../../StateLabel/StateLabel.js');
require('../../SubNav/SubNav.js');
require('../../ToggleSwitch/ToggleSwitch.js');
require('../../TabNav/TabNav.js');
var TextInput = require('../../TextInput/TextInput.js');
require('../../TextInputWithTokens/TextInputWithTokens.js');
var Text = require('../../Text/Text.js');
require('../../Timeline/Timeline.js');
require('../../Token/Token.js');
require('../../Token/IssueLabelToken.js');
require('../../Token/AvatarToken.js');
require('../../Tooltip/Tooltip.js');
require('../../Truncate/Truncate.js');
var Checkbox = require('../../Checkbox/Checkbox.js');
require('../../Textarea/Textarea.js');
require('../../TreeView/TreeView.js');
require('../../UnderlineNav/index.js');
require('../../ActionBar/index.js');
require('../../Stack/index.js');
require('../../PageHeader/PageHeader.js');
var useId = require('../../hooks/useId.js');
var ActionListContainerContext = require('../../ActionList/ActionListContainerContext.js');
var useSlots = require('../../hooks/useSlots.js');
var useAnchoredPosition = require('../../hooks/useAnchoredPosition.js');
var InputLabel = require('../../internal/components/InputLabel.js');
var invariant = require('../../utils/invariant.js');
require('../../live-region/Announce.js');
require('../../live-region/AriaAlert.js');
var AriaStatus = require('../../live-region/AriaStatus.js');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var React__default = /*#__PURE__*/_interopDefault(React);

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const SelectPanelContext = /*#__PURE__*/React__default.default.createContext({
  title: '',
  description: undefined,
  panelId: '',
  onCancel: () => {},
  onClearSelection: undefined,
  searchQuery: '',
  setSearchQuery: () => {},
  selectionVariant: 'multiple',
  moveFocusToList: () => {}
});
const responsiveButtonSizes = {
  narrow: 'medium',
  regular: 'small'
};
const Panel = ({
  title,
  description,
  variant: propsVariant,
  selectionVariant = 'multiple',
  id,
  defaultOpen = false,
  open: propsOpen,
  anchorRef: providedAnchorRef,
  onCancel: propsOnCancel,
  onClearSelection: propsOnClearSelection,
  onSubmit: propsOnSubmit,
  width = 'medium',
  maxHeight = 'large',
  ...props
}) => {
  var _slots$header;
  const [internalOpen, setInternalOpen] = React__default.default.useState(defaultOpen);
  const responsiveVariants = Object.assign({
    regular: 'anchored',
    narrow: 'full-screen'
  },
  // defaults
  typeof propsVariant === 'string' ? {
    regular: propsVariant
  } : propsVariant);
  const currentVariant = useResponsiveValue.useResponsiveValue(responsiveVariants, 'anchored');

  // sync open state with props
  if (propsOpen !== undefined && internalOpen !== propsOpen) setInternalOpen(propsOpen);

  // TODO: replace this hack with clone element?

  // 🚨 Hack for good API!
  // we strip out Anchor from children and wire it up to Dialog
  // with additional props for accessibility
  let Anchor;
  const anchorRef = useProvidedRefOrCreate.useProvidedRefOrCreate(providedAnchorRef);
  const onAnchorClick = () => {
    if (!internalOpen) setInternalOpen(true);else onInternalCancel();
  };
  const contents = React__default.default.Children.map(props.children, child => {
    if ( /*#__PURE__*/React__default.default.isValidElement(child) && child.type === SelectPanelButton) {
      Anchor = /*#__PURE__*/React__default.default.cloneElement(child, {
        // @ts-ignore TODO
        ref: anchorRef,
        onClick: child.props.onClick || onAnchorClick,
        'aria-haspopup': true,
        'aria-expanded': internalOpen
      });
      return null;
    }
    return child;
  });
  const onInternalClose = React__default.default.useCallback(() => {
    if (internalOpen === false) return; // nothing to do here
    if (propsOpen === undefined) setInternalOpen(false);
  }, [internalOpen, propsOpen]);
  const onInternalCancel = React__default.default.useCallback(() => {
    onInternalClose();
    if (typeof propsOnCancel === 'function') propsOnCancel();
  }, [onInternalClose, propsOnCancel]);
  const onInternalSubmit = event => {
    event === null || event === void 0 ? void 0 : event.preventDefault(); // there is no event with selectionVariant=instant
    onInternalClose();
    if (typeof propsOnSubmit === 'function') propsOnSubmit(event);
  };
  const onInternalClearSelection = () => {
    if (typeof propsOnClearSelection === 'function') propsOnClearSelection();
  };
  const internalAfterSelect = event => {
    if (selectionVariant === 'instant') onInternalSubmit();
    if (event.type === 'keypress') {
      if (event.key === 'Enter') onInternalSubmit();
    }
  };

  /* Search/Filter */
  const [searchQuery, setSearchQuery] = React__default.default.useState('');

  /* Panel plumbing */
  const panelId = useId.useId(id);
  const [slots, childrenInBody] = useSlots.useSlots(contents, {
    header: SelectPanelHeader,
    footer: SelectPanelFooter
  });

  // used in SelectPanel.SearchInput
  const moveFocusToList = () => {
    var _dialogRef$current;
    const selector = 'ul[role=listbox] li:not([role=none])';
    // being specific about roles because there can be another ul (tabs in header) and an ActionList.Group (li[role=none])
    const firstListElement = (_dialogRef$current = dialogRef.current) === null || _dialogRef$current === void 0 ? void 0 : _dialogRef$current.querySelector(selector);
    firstListElement === null || firstListElement === void 0 ? void 0 : firstListElement.focus();
  };

  /* Dialog */
  const dialogRef = React__default.default.useRef(null);

  // sync dialog open state (imperative) with internal component state
  React__default.default.useEffect(() => {
    var _dialogRef$current2, _dialogRef$current3;
    if (internalOpen) (_dialogRef$current2 = dialogRef.current) === null || _dialogRef$current2 === void 0 ? void 0 : _dialogRef$current2.showModal();else if ((_dialogRef$current3 = dialogRef.current) !== null && _dialogRef$current3 !== void 0 && _dialogRef$current3.open) dialogRef.current.close();
  }, [internalOpen]);

  // dialog handles Esc automatically, so we have to sync internal state
  // but it doesn't call onCancel, so have another effect for that!
  React__default.default.useEffect(() => {
    const dialogEl = dialogRef.current;
    dialogEl === null || dialogEl === void 0 ? void 0 : dialogEl.addEventListener('close', onInternalClose);
    return () => dialogEl === null || dialogEl === void 0 ? void 0 : dialogEl.removeEventListener('close', onInternalClose);
  }, [onInternalClose]);

  // Esc handler
  React__default.default.useEffect(() => {
    const dialogEl = dialogRef.current;
    const handler = event => {
      if (event.key === 'Escape') onInternalCancel();
    };
    dialogEl === null || dialogEl === void 0 ? void 0 : dialogEl.addEventListener('keydown', handler);
    return () => dialogEl === null || dialogEl === void 0 ? void 0 : dialogEl.removeEventListener('keydown', handler);
  }, [onInternalCancel]);

  // Autofocus hack: React doesn't support autoFocus for dialog: https://github.com/facebook/react/issues/23301
  // tl;dr: react takes over autofocus instead of letting the browser handle it,
  // but not for dialogs, so we have to do it
  React__default.default.useEffect(function intialFocus() {
    if (internalOpen) {
      const searchInput = document.querySelector('dialog[open] input');
      if (searchInput) searchInput.focus();else moveFocusToList();
    }
  }, [internalOpen]);

  /* Anchored */
  const {
    position
  } = useAnchoredPosition.useAnchoredPosition({
    anchorElementRef: anchorRef,
    floatingElementRef: dialogRef,
    side: 'outside-bottom',
    align: 'start'
  }, [internalOpen, anchorRef.current, dialogRef.current]);

  /* 
    We want to cancel and close the panel when user clicks outside.
    See decision log: https://github.com/github/primer/discussions/2614#discussioncomment-8544561
  */
  const onClickOutside = onInternalCancel;
  return /*#__PURE__*/React__default.default.createElement(React__default.default.Fragment, null, Anchor, /*#__PURE__*/React__default.default.createElement(Overlay.StyledOverlay, _extends({
    as: "dialog",
    ref: dialogRef,
    "aria-labelledby": `${panelId}--title`,
    "aria-describedby": description ? `${panelId}--description` : undefined,
    width: width,
    height: "fit-content",
    maxHeight: maxHeight,
    "data-variant": currentVariant,
    sx: {
      '--max-height': Overlay.heightMap[maxHeight],
      // reset dialog default styles
      border: 'none',
      padding: 0,
      color: 'fg.default',
      '&[open]': {
        display: 'flex'
      },
      // to fit children

      '&[data-variant="anchored"], &[data-variant="full-screen"]': {
        margin: 0,
        top: position === null || position === void 0 ? void 0 : position.top,
        left: position === null || position === void 0 ? void 0 : position.left,
        '::backdrop': {
          backgroundColor: 'transparent'
        }
      },
      '&[data-variant="modal"]': {
        '::backdrop': {
          backgroundColor: 'primer.canvas.backdrop'
        }
      },
      '&[data-variant="full-screen"]': {
        margin: 0,
        top: 0,
        left: 0,
        width: '100%',
        maxWidth: '100vw',
        height: '100%',
        maxHeight: '100vh',
        '--max-height': '100vh',
        borderRadius: 'unset'
      },
      '&[data-variant="bottom-sheet"]': {
        margin: 0,
        top: 'auto',
        bottom: 0,
        left: 0,
        width: '100%',
        maxWidth: '100vw',
        maxHeight: 'calc(100vh - 64px)',
        '--max-height': 'calc(100vh - 64px)',
        borderBottomRightRadius: 0,
        borderBottomLeftRadius: 0
      }
    }
  }, props, {
    onClick: event => {
      if (event.target === event.currentTarget) onClickOutside();
    }
  }), internalOpen && /*#__PURE__*/React__default.default.createElement(React__default.default.Fragment, null, /*#__PURE__*/React__default.default.createElement(SelectPanelContext.Provider, {
    value: {
      panelId,
      title,
      description,
      onCancel: onInternalCancel,
      onClearSelection: propsOnClearSelection ? onInternalClearSelection : undefined,
      searchQuery,
      setSearchQuery,
      selectionVariant,
      moveFocusToList
    }
  }, /*#__PURE__*/React__default.default.createElement(Box, {
    as: "form",
    method: "dialog",
    onSubmit: onInternalSubmit,
    sx: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%'
    }
  }, (_slots$header = slots.header) !== null && _slots$header !== void 0 ? _slots$header :
  /*#__PURE__*/
  /* render default header as fallback */
  React__default.default.createElement(SelectPanelHeader, null), /*#__PURE__*/React__default.default.createElement(Box, {
    as: "div",
    sx: {
      flexShrink: 1,
      flexGrow: 1,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      ul: {
        overflowY: 'auto',
        flexGrow: 1
      }
    }
  }, /*#__PURE__*/React__default.default.createElement(ActionListContainerContext.ActionListContainerContext.Provider, {
    value: {
      container: 'SelectPanel',
      listRole: 'listbox',
      selectionAttribute: 'aria-selected',
      selectionVariant: selectionVariant === 'instant' ? 'single' : selectionVariant,
      afterSelect: internalAfterSelect,
      listLabelledBy: `${panelId}--title`,
      enableFocusZone: true // Arrow keys navigation for list items
    }
  }, childrenInBody)), slots.footer)))));
};
const SelectPanelButton = /*#__PURE__*/React__default.default.forwardRef((props, anchorRef) => {
  const inputProps = _FormControlContext.useFormControlForwardedProps(props);
  const [labelText, setLabelText] = React.useState('');
  React.useEffect(() => {
    const label = document.querySelector(`[for='${inputProps.id}']`);
    if (label !== null && label !== void 0 && label.textContent) {
      setLabelText(label.textContent);
    }
  }, [inputProps.id]);
  if (labelText) {
    return /*#__PURE__*/React__default.default.createElement(Button.ButtonComponent, _extends({
      ref: anchorRef,
      "aria-label": `${anchorRef.current.textContent}, ${labelText}`
    }, inputProps));
  } else {
    return /*#__PURE__*/React__default.default.createElement(Button.ButtonComponent, _extends({
      ref: anchorRef
    }, props));
  }
});
const SelectPanelHeader = ({
  children,
  onBack,
  ...props
}) => {
  const [slots, childrenWithoutSlots] = useSlots.useSlots(children, {
    searchInput: SelectPanelSearchInput
  });
  const {
    title,
    description,
    panelId,
    onCancel,
    onClearSelection
  } = React__default.default.useContext(SelectPanelContext);
  return /*#__PURE__*/React__default.default.createElement(Box, _extends({
    sx: {
      display: 'flex',
      flexDirection: 'column',
      // gap: 2,
      padding: 2,
      borderBottom: '1px solid',
      borderColor: 'border.default'
    }
  }, props), /*#__PURE__*/React__default.default.createElement(Box, {
    sx: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: description ? 'start' : 'center',
      marginBottom: slots.searchInput ? 2 : 0
    }
  }, /*#__PURE__*/React__default.default.createElement(Box, {
    sx: {
      display: 'flex'
    }
  }, onBack ? /*#__PURE__*/React__default.default.createElement(IconButton.IconButton, {
    type: "button",
    variant: "invisible",
    icon: octiconsReact.ArrowLeftIcon,
    "aria-label": "Back",
    onClick: () => onBack()
  }) : null, /*#__PURE__*/React__default.default.createElement(Box, {
    sx: {
      marginLeft: onBack ? 1 : 2,
      marginTop: description ? '2px' : 0
    }
  }, /*#__PURE__*/React__default.default.createElement(Heading, {
    as: "h1",
    id: `${panelId}--title`,
    sx: {
      fontSize: 14,
      fontWeight: 600
    }
  }, title), description ? /*#__PURE__*/React__default.default.createElement(Text, {
    id: `${panelId}--description`,
    sx: {
      fontSize: 0,
      color: 'fg.muted',
      display: 'block'
    }
  }, description) : null)), /*#__PURE__*/React__default.default.createElement(Box, null, onClearSelection ? /*#__PURE__*/React__default.default.createElement(IconButton.IconButton, {
    type: "button",
    variant: "invisible",
    icon: octiconsReact.FilterRemoveIcon,
    "aria-label": "Clear selection",
    onClick: onClearSelection
  }) : null, /*#__PURE__*/React__default.default.createElement(IconButton.IconButton, {
    type: "button",
    variant: "invisible",
    icon: octiconsReact.XIcon,
    "aria-label": "Close",
    onClick: () => onCancel()
  }))), slots.searchInput, childrenWithoutSlots);
};
SelectPanelHeader.displayName = "SelectPanelHeader";
const SelectPanelSearchInput = ({
  onChange: propsOnChange,
  onKeyDown: propsOnKeyDown,
  ...props
}) => {
  // TODO: use forwardedRef
  const inputRef = /*#__PURE__*/React__default.default.createRef();
  const {
    setSearchQuery,
    moveFocusToList
  } = React__default.default.useContext(SelectPanelContext);
  const internalOnChange = event => {
    // If props.onChange is given, the application controls search,
    // otherwise the component does
    if (typeof propsOnChange === 'function') propsOnChange(event);else setSearchQuery(event.target.value);
  };
  const internalKeyDown = event => {
    if (event.key === 'ArrowDown') {
      event.preventDefault(); // prevent scroll
      moveFocusToList();
    }
    if (typeof propsOnKeyDown === 'function') propsOnKeyDown(event);
  };
  return /*#__PURE__*/React__default.default.createElement(TextInput, _extends({
    ref: inputRef,
    block: true,
    leadingVisual: octiconsReact.SearchIcon,
    placeholder: "Search",
    trailingAction: /*#__PURE__*/React__default.default.createElement(TextInput.Action, {
      icon: octiconsReact.XCircleFillIcon,
      "aria-label": "Clear",
      tooltipDirection: "w",
      sx: {
        color: 'fg.subtle',
        bg: 'none'
      },
      onClick: () => {
        if (inputRef.current) inputRef.current.value = '';
        if (typeof propsOnChange === 'function') {
          // @ts-ignore TODO this is a hacky solution to clear
          propsOnChange({
            target: inputRef.current,
            currentTarget: inputRef.current
          });
        }
      }
    }),
    sx: {
      paddingLeft: 2,
      // align with list checkboxes
      '&:has(input:placeholder-shown) .TextInput-action': {
        display: 'none'
      }
    },
    onChange: internalOnChange,
    onKeyDown: internalKeyDown
  }, props));
};
SelectPanelSearchInput.displayName = "SelectPanelSearchInput";
const FooterContext = /*#__PURE__*/React__default.default.createContext(false);
const SelectPanelFooter = ({
  ...props
}) => {
  const {
    onCancel,
    selectionVariant
  } = React__default.default.useContext(SelectPanelContext);
  const hidePrimaryActions = selectionVariant === 'instant';
  const buttonSize = useResponsiveValue.useResponsiveValue(responsiveButtonSizes, 'small');
  if (hidePrimaryActions && !props.children) {
    // nothing to render
    // todo: we can inform them the developer footer will render nothing
    return null;
  }
  return /*#__PURE__*/React__default.default.createElement(FooterContext.Provider, {
    value: true
  }, /*#__PURE__*/React__default.default.createElement(Box, {
    sx: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexShrink: 0,
      padding: hidePrimaryActions ? 2 : 3,
      minHeight: '44px',
      borderTop: '1px solid',
      borderColor: 'border.default'
    }
  }, /*#__PURE__*/React__default.default.createElement(Box, {
    sx: {
      flexGrow: hidePrimaryActions ? 1 : 0
    }
  }, props.children), hidePrimaryActions ? null : /*#__PURE__*/React__default.default.createElement(Box, {
    sx: {
      display: 'flex',
      gap: 2
    }
  }, /*#__PURE__*/React__default.default.createElement(Button.ButtonComponent, {
    type: "button",
    size: buttonSize,
    onClick: () => onCancel()
  }, "Cancel"), /*#__PURE__*/React__default.default.createElement(Button.ButtonComponent, {
    type: "submit",
    size: buttonSize,
    variant: "primary"
  }, "Save"))));
};
SelectPanelFooter.displayName = "SelectPanelFooter";
const SecondaryButton = props => {
  const size = useResponsiveValue.useResponsiveValue(responsiveButtonSizes, 'small');
  return /*#__PURE__*/React__default.default.createElement(Button.ButtonComponent, _extends({
    type: "button",
    size: size,
    block: true
  }, props));
};
SecondaryButton.displayName = "SecondaryButton";
const SecondaryLink = props => {
  const size = useResponsiveValue.useResponsiveValue(responsiveButtonSizes, 'small');
  return (
    /*#__PURE__*/
    // @ts-ignore TODO: is as prop is not recognised by button?
    React__default.default.createElement(Button.ButtonComponent, _extends({
      as: Link,
      size: size,
      variant: "invisible",
      block: true
    }, props, {
      sx: {
        fontSize: 0
      }
    }), props.children)
  );
};
SecondaryLink.displayName = "SecondaryLink";
const SecondaryCheckbox = ({
  id,
  children,
  ...props
}) => {
  const checkboxId = useId.useId(id);
  const {
    selectionVariant
  } = React__default.default.useContext(SelectPanelContext);

  // Checkbox should not be used with instant selection
  !(selectionVariant !== 'instant') ? process.env.NODE_ENV !== "production" ? invariant.invariant(false, 'Sorry! SelectPanel.SecondaryAction with variant="checkbox" is not allowed inside selectionVariant="instant"') : invariant.invariant(false) : void 0;
  return /*#__PURE__*/React__default.default.createElement(Box, {
    sx: {
      display: 'flex',
      alignItems: 'center',
      gap: 2
    }
  }, /*#__PURE__*/React__default.default.createElement(Checkbox, _extends({
    id: checkboxId,
    sx: {
      marginTop: 0
    }
  }, props)), /*#__PURE__*/React__default.default.createElement(InputLabel, {
    htmlFor: checkboxId,
    sx: {
      fontSize: 0
    }
  }, children));
};
SecondaryCheckbox.displayName = "SecondaryCheckbox";
const SelectPanelSecondaryAction = ({
  variant,
  ...props
}) => {
  const insideFooter = React__default.default.useContext(FooterContext);
  !insideFooter ? process.env.NODE_ENV !== "production" ? invariant.invariant(false, 'SelectPanel.SecondaryAction is only allowed inside SelectPanel.Footer') : invariant.invariant(false) : void 0;

  // @ts-ignore TODO
  if (variant === 'button') return /*#__PURE__*/React__default.default.createElement(SecondaryButton, props);
  // @ts-ignore TODO
  else if (variant === 'link') return /*#__PURE__*/React__default.default.createElement(SecondaryLink, props);
  // @ts-ignore TODO
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  else if (variant === 'checkbox') return /*#__PURE__*/React__default.default.createElement(SecondaryCheckbox, props);
};
const SelectPanelLoading = ({
  children = 'Fetching items...'
}) => {
  return /*#__PURE__*/React__default.default.createElement(AriaStatus.AriaStatus, {
    announceOnShow: true,
    sx: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      gap: 3,
      minHeight: 'min(calc(var(--max-height) - 150px), 324px)'
      //                 maxHeight of dialog - (header & footer)
    }
  }, /*#__PURE__*/React__default.default.createElement(Spinner, {
    size: "medium",
    srText: null
  }), /*#__PURE__*/React__default.default.createElement(Text, {
    sx: {
      fontSize: 1,
      color: 'fg.muted'
    }
  }, children));
};
SelectPanelLoading.displayName = "SelectPanelLoading";
const SelectPanelMessage = ({
  variant = 'warning',
  size = variant === 'empty' ? 'full' : 'inline',
  title,
  children
}) => {
  if (size === 'full') {
    return /*#__PURE__*/React__default.default.createElement(Box, {
      "aria-live": variant === 'empty' ? undefined : 'polite',
      sx: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        flexGrow: 1,
        height: '100%',
        gap: 1,
        paddingX: 4,
        textAlign: 'center',
        a: {
          color: 'inherit',
          textDecoration: 'underline'
        },
        minHeight: 'min(calc(var(--max-height) - 150px), 324px)'
        //                 maxHeight of dialog - (header & footer)
      }
    }, variant !== 'empty' ? /*#__PURE__*/React__default.default.createElement(Octicon, {
      icon: octiconsReact.AlertIcon,
      sx: {
        color: variant === 'error' ? 'danger.fg' : 'attention.fg',
        marginBottom: 2
      }
    }) : null, /*#__PURE__*/React__default.default.createElement(Text, {
      sx: {
        fontSize: 1,
        fontWeight: 'semibold'
      }
    }, title), /*#__PURE__*/React__default.default.createElement(Text, {
      sx: {
        fontSize: 1,
        color: 'fg.muted',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        alignItems: 'center'
      }
    }, children));
  } else {
    const inlineVariantStyles = {
      empty: {},
      warning: {
        backgroundColor: 'attention.subtle',
        color: 'attention.fg',
        borderBottomColor: 'attention.muted'
      },
      error: {
        backgroundColor: 'danger.subtle',
        color: 'danger.fg',
        borderColor: 'danger.muted'
      }
    };
    return /*#__PURE__*/React__default.default.createElement(Box, {
      "aria-live": variant === 'empty' ? undefined : 'polite',
      sx: {
        display: 'flex',
        gap: 2,
        paddingX: 3,
        paddingY: '12px',
        fontSize: 0,
        borderBottom: '1px solid',
        a: {
          color: 'inherit',
          textDecoration: 'underline'
        },
        ...inlineVariantStyles[variant]
      }
    }, /*#__PURE__*/React__default.default.createElement(octiconsReact.AlertIcon, {
      size: 16
    }), /*#__PURE__*/React__default.default.createElement(Box, null, children));
  }
};
const SelectPanel = Object.assign(Panel, {
  Button: SelectPanelButton,
  Header: SelectPanelHeader,
  SearchInput: SelectPanelSearchInput,
  Footer: SelectPanelFooter,
  Loading: SelectPanelLoading,
  Message: SelectPanelMessage,
  SecondaryAction: SelectPanelSecondaryAction
});

exports.SelectPanel = SelectPanel;
