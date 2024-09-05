import { ChevronDownIcon, ChevronRightIcon, FileDirectoryOpenFillIcon, FileDirectoryFillIcon } from '@primer/octicons-react';
import clsx from 'clsx';
import React, { useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { ConfirmationDialog } from '../ConfirmationDialog/ConfirmationDialog.js';
import StyledSpinner from '../Spinner/Spinner.js';
import Text from '../Text/Text.js';
import VisuallyHidden from '../_VisuallyHidden.js';
import { get } from '../constants.js';
import { useControllableState } from '../hooks/useControllableState.js';
import { useId } from '../hooks/useId.js';
import useSafeTimeout from '../hooks/useSafeTimeout.js';
import { useSlots } from '../hooks/useSlots.js';
import sx from '../sx.js';
import { getAccessibleName } from './shared.js';
import { useRovingTabIndex, getFirstChildElement } from './useRovingTabIndex.js';
import { useTypeahead } from './useTypeahead.js';
import { SkeletonAvatar } from '../drafts/Skeleton/SkeletonAvatar.js';
import { SkeletonText } from '../drafts/Skeleton/SkeletonText.js';

// ----------------------------------------------------------------------------
// Context

const RootContext = /*#__PURE__*/React.createContext({
  announceUpdate: () => {},
  expandedStateCache: {
    current: new Map()
  }
});
const ItemContext = /*#__PURE__*/React.createContext({
  itemId: '',
  level: 1,
  isSubTreeEmpty: false,
  setIsSubTreeEmpty: () => {},
  isExpanded: false,
  setIsExpanded: () => {},
  leadingVisualId: '',
  trailingVisualId: ''
});

// ----------------------------------------------------------------------------
// TreeView

/* Size of toggle icon in pixels. */
const TOGGLE_ICON_SIZE = 12;
const UlBox = styled.ul.withConfig({
  displayName: "TreeView__UlBox",
  componentId: "sc-4ex6b6-0"
})(["list-style:none;padding:0;margin:0;.PRIVATE_TreeView-item{outline:none;&:focus-visible > div,&.focus-visible > div{box-shadow:inset 0 0 0 2px ", ";@media (forced-colors:active){outline:2px solid HighlightText;outline-offset:-2;}}&[data-has-leading-action]{--has-leading-action:1;}}.PRIVATE_TreeView-item-container{--level:1;--toggle-width:1rem;--min-item-height:2rem;position:relative;display:grid;--leading-action-width:calc(var(--has-leading-action,0) * 1.5rem);--spacer-width:calc(calc(var(--level) - 1) * (var(--toggle-width) / 2));grid-template-columns:var(--spacer-width) var(--leading-action-width) var(--toggle-width) 1fr;grid-template-areas:'spacer leadingAction toggle content';width:100%;font-size:", ";color:", ";border-radius:", ";cursor:pointer;&:hover{background-color:", ";@media (forced-colors:active){outline:2px solid transparent;outline-offset:-2px;}}@media (pointer:coarse){--toggle-width:1.5rem;--min-item-height:2.75rem;}&:has(.PRIVATE_TreeView-item-skeleton):hover{background-color:transparent;cursor:default;@media (forced-colors:active){outline:none;}}}&[data-omit-spacer='true'] .PRIVATE_TreeView-item-container{grid-template-columns:0 0 0 1fr;}.PRIVATE_TreeView-item[aria-current='true'] > .PRIVATE_TreeView-item-container{background-color:", ";&::after{content:'';position:absolute;top:calc(50% - 0.75rem);left:-", ";width:0.25rem;height:1.5rem;background-color:", ";border-radius:", ";@media (forced-colors:active){background-color:HighlightText;}}}.PRIVATE_TreeView-item-toggle{grid-area:toggle;display:flex;justify-content:center;align-items:flex-start;padding-top:calc(var(--min-item-height) / 2 - ", "px / 2);height:100%;color:", ";}.PRIVATE_TreeView-item-toggle--hover:hover{background-color:", ";}.PRIVATE_TreeView-item-toggle--end{border-top-left-radius:", ";border-bottom-left-radius:", ";}.PRIVATE_TreeView-item-content{grid-area:content;display:flex;height:100%;padding:0 ", ";gap:", ";line-height:var(--custom-line-height,var(--text-body-lineHeight-medium,1.4285));padding-top:calc((var(--min-item-height) - var(--custom-line-height,1.3rem)) / 2);padding-bottom:calc((var(--min-item-height) - var(--custom-line-height,1.3rem)) / 2);}.PRIVATE_TreeView-item-content-text{flex:1 1 auto;width:0;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;}.PRIVATE_TreeView-item-visual{display:flex;align-items:center;color:", ";height:var(--custom-line-height,1.3rem);}.PRIVATE_TreeView-item-leading-action{display:flex;color:", ";grid-area:leadingAction;}.PRIVATE_TreeView-item-level-line{width:100%;height:100%;border-right:1px solid;border-color:", ";}@media (hover:hover){.PRIVATE_TreeView-item-level-line{border-color:transparent;}&:hover .PRIVATE_TreeView-item-level-line,&:focus-within .PRIVATE_TreeView-item-level-line{border-color:", ";}}.PRIVATE_TreeView-directory-icon{display:grid;color:", ";}.PRIVATE_VisuallyHidden{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border-width:0;}", ""], get(`colors.accent.fg`), get('fontSizes.1'), get('colors.fg.default'), get('radii.2'), get('colors.actionListItem.default.hoverBg'), get('colors.actionListItem.default.selectedBg'), get('space.2'), get('colors.accent.fg'), get('radii.2'), TOGGLE_ICON_SIZE, get('colors.fg.muted'), get('colors.treeViewItem.chevron.hoverBg'), get('radii.2'), get('radii.2'), get('space.2'), get('space.2'), get('colors.fg.muted'), get('colors.fg.muted'), get('colors.border.subtle'), get('colors.border.subtle'), get('colors.treeViewItem.directory.fill'), sx);
const Root = ({
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  children,
  flat,
  className
}) => {
  const containerRef = React.useRef(null);
  const mouseDownRef = React.useRef(false);
  const [ariaLiveMessage, setAriaLiveMessage] = React.useState('');
  const announceUpdate = React.useCallback(message => {
    setAriaLiveMessage(message);
  }, []);
  const onMouseDown = useCallback(() => {
    mouseDownRef.current = true;
  }, []);
  useEffect(() => {
    function onMouseUp() {
      mouseDownRef.current = false;
    }
    document.addEventListener('mouseup', onMouseUp);
    return () => {
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, []);
  useRovingTabIndex({
    containerRef,
    mouseDownRef
  });
  useTypeahead({
    containerRef,
    onFocusChange: element => {
      if (element instanceof HTMLElement) {
        element.focus();
      }
    }
  });
  const expandedStateCache = React.useRef(null);
  if (expandedStateCache.current === null) {
    expandedStateCache.current = new Map();
  }
  return /*#__PURE__*/React.createElement(RootContext.Provider, {
    value: {
      announceUpdate,
      expandedStateCache
    }
  }, /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(VisuallyHidden, {
    role: "status",
    "aria-live": "polite",
    "aria-atomic": "true"
  }, ariaLiveMessage), /*#__PURE__*/React.createElement(UlBox, {
    ref: containerRef,
    role: "tree",
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledby,
    "data-omit-spacer": flat,
    onMouseDown: onMouseDown,
    className: className
  }, children)));
};
Root.displayName = "Root";
Root.displayName = 'TreeView';

// ----------------------------------------------------------------------------
// TreeView.Item

const Item = /*#__PURE__*/React.forwardRef(({
  id: itemId,
  containIntrinsicSize,
  current: isCurrentItem = false,
  defaultExpanded,
  expanded,
  onExpandedChange,
  onSelect,
  children,
  className,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby
}, ref) => {
  const [slots, rest] = useSlots(children, {
    leadingAction: LeadingAction,
    leadingVisual: LeadingVisual,
    trailingVisual: TrailingVisual
  });
  const {
    expandedStateCache
  } = React.useContext(RootContext);
  const labelId = useId();
  const leadingVisualId = useId();
  const trailingVisualId = useId();
  const [isExpanded, setIsExpanded] = useControllableState({
    name: itemId,
    // If the item was previously mounted, it's expanded state might be cached.
    // We check the cache first, and then fall back to the defaultExpanded prop.
    // If defaultExpanded is not provided, we default to false unless the item
    // is the current item, in which case we default to true.
    defaultValue: () => {
      var _ref, _expandedStateCache$c, _expandedStateCache$c2;
      return (_ref = (_expandedStateCache$c = (_expandedStateCache$c2 = expandedStateCache.current) === null || _expandedStateCache$c2 === void 0 ? void 0 : _expandedStateCache$c2.get(itemId)) !== null && _expandedStateCache$c !== void 0 ? _expandedStateCache$c : defaultExpanded) !== null && _ref !== void 0 ? _ref : isCurrentItem;
    },
    value: expanded,
    onChange: onExpandedChange
  });
  const {
    level
  } = React.useContext(ItemContext);
  const {
    hasSubTree,
    subTree,
    childrenWithoutSubTree
  } = useSubTree(rest);
  const [isSubTreeEmpty, setIsSubTreeEmpty] = React.useState(!hasSubTree);
  const [isFocused, setIsFocused] = React.useState(false);

  // Set the expanded state and cache it
  const setIsExpandedWithCache = React.useCallback(newIsExpanded => {
    var _expandedStateCache$c3;
    setIsExpanded(newIsExpanded);
    (_expandedStateCache$c3 = expandedStateCache.current) === null || _expandedStateCache$c3 === void 0 ? void 0 : _expandedStateCache$c3.set(itemId, newIsExpanded);
  }, [itemId, setIsExpanded, expandedStateCache]);

  // Expand or collapse the subtree
  const toggle = React.useCallback(event => {
    setIsExpandedWithCache(!isExpanded);
    event === null || event === void 0 ? void 0 : event.stopPropagation();
  }, [isExpanded, setIsExpandedWithCache]);
  const handleKeyDown = React.useCallback(event => {
    switch (event.key) {
      case 'Enter':
      case ' ':
        if (onSelect) {
          onSelect(event);
        } else {
          toggle(event);
        }
        event.stopPropagation();
        break;
      case 'ArrowRight':
        // Ignore if modifier keys are pressed
        if (event.altKey || event.metaKey) return;
        event.preventDefault();
        event.stopPropagation();
        setIsExpandedWithCache(true);
        break;
      case 'ArrowLeft':
        // Ignore if modifier keys are pressed
        if (event.altKey || event.metaKey) return;
        event.preventDefault();
        event.stopPropagation();
        setIsExpandedWithCache(false);
        break;
    }
  }, [onSelect, setIsExpandedWithCache, toggle]);
  return /*#__PURE__*/React.createElement(ItemContext.Provider, {
    value: {
      itemId,
      level: level + 1,
      isSubTreeEmpty,
      setIsSubTreeEmpty,
      isExpanded,
      setIsExpanded: setIsExpandedWithCache,
      leadingVisualId,
      trailingVisualId
    }
  }, /*#__PURE__*/React.createElement("li", {
    className: clsx('PRIVATE_TreeView-item', className),
    ref: ref,
    tabIndex: 0,
    id: itemId,
    role: "treeitem",
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabel ? undefined : ariaLabelledby || labelId,
    "aria-describedby": `${leadingVisualId} ${trailingVisualId}`,
    "aria-level": level,
    "aria-expanded": isSubTreeEmpty ? undefined : isExpanded,
    "aria-current": isCurrentItem ? 'true' : undefined,
    "aria-selected": isFocused ? 'true' : 'false',
    "data-has-leading-action": slots.leadingAction ? true : undefined,
    onKeyDown: handleKeyDown,
    onFocus: event => {
      var _event$currentTarget$;
      // Scroll the first child into view when the item receives focus
      (_event$currentTarget$ = event.currentTarget.firstElementChild) === null || _event$currentTarget$ === void 0 ? void 0 : _event$currentTarget$.scrollIntoView({
        block: 'nearest',
        inline: 'nearest'
      });

      // Set the focused state
      setIsFocused(true);

      // Prevent focus event from bubbling up to parent items
      event.stopPropagation();
    },
    onBlur: () => setIsFocused(false),
    onClick: event => {
      if (onSelect) {
        onSelect(event);
      } else {
        toggle(event);
      }
      event.stopPropagation();
    },
    onAuxClick: event => {
      if (onSelect && event.button === 1) {
        onSelect(event);
      }
      event.stopPropagation();
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "PRIVATE_TreeView-item-container",
    style: {
      // @ts-ignore CSS custom property
      '--level': level,
      contentVisibility: containIntrinsicSize ? 'auto' : undefined,
      containIntrinsicSize
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      gridArea: 'spacer',
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement(LevelIndicatorLines, {
    level: level
  })), slots.leadingAction, hasSubTree ?
  /*#__PURE__*/
  // This lint rule is disabled due to the guidelines in the `TreeView` api docs.
  // https://github.com/github/primer/blob/main/apis/tree-view-api.md#the-expandcollapse-chevron-toggle
  // This has specific advice that the chevron be available only to pointer event.
  // If they take up a button role, they become unnecessary and numerous tab stops.
  // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
  React.createElement("div", {
    className: clsx('PRIVATE_TreeView-item-toggle', onSelect && 'PRIVATE_TreeView-item-toggle--hover', level === 1 && 'PRIVATE_TreeView-item-toggle--end'),
    onClick: event => {
      if (onSelect) {
        toggle(event);
      }
    }
  }, isExpanded ? /*#__PURE__*/React.createElement(ChevronDownIcon, {
    size: TOGGLE_ICON_SIZE
  }) : /*#__PURE__*/React.createElement(ChevronRightIcon, {
    size: TOGGLE_ICON_SIZE
  })) : null, /*#__PURE__*/React.createElement("div", {
    id: labelId,
    className: "PRIVATE_TreeView-item-content"
  }, slots.leadingVisual, /*#__PURE__*/React.createElement("span", {
    className: "PRIVATE_TreeView-item-content-text"
  }, childrenWithoutSubTree), slots.trailingVisual)), subTree));
});

/** Lines to indicate the depth of an item in a TreeView */
const LevelIndicatorLines = ({
  level
}) => {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      display: 'flex'
    }
  }, Array.from({
    length: level - 1
  }).map((_, index) => /*#__PURE__*/React.createElement("div", {
    key: index,
    className: "PRIVATE_TreeView-item-level-line"
  })));
};
LevelIndicatorLines.displayName = "LevelIndicatorLines";
Item.displayName = 'TreeView.Item';

// ----------------------------------------------------------------------------
// TreeView.SubTree

const SubTree = ({
  count,
  state,
  children
}) => {
  const {
    announceUpdate
  } = React.useContext(RootContext);
  const {
    itemId,
    isExpanded,
    isSubTreeEmpty,
    setIsSubTreeEmpty
  } = React.useContext(ItemContext);
  const loadingItemRef = React.useRef(null);
  const ref = React.useRef(null);
  const [loadingFocused, setLoadingFocused] = React.useState(false);
  const previousState = usePreviousValue(state);
  const {
    safeSetTimeout
  } = useSafeTimeout();
  React.useEffect(() => {
    // If `state` is undefined, we're working in a synchronous context and need
    // to detect if the sub-tree has content. If `state === 'done` then we're
    // working in an asynchronous context and need to see if there is content
    // that has been loaded in.
    if (state === undefined || state === 'done') {
      if (!isSubTreeEmpty && !children) {
        setIsSubTreeEmpty(true);
      } else if (isSubTreeEmpty && children) {
        setIsSubTreeEmpty(false);
      }
    }
  }, [state, isSubTreeEmpty, setIsSubTreeEmpty, children]);

  // Handle transition from loading to done state
  React.useEffect(() => {
    if (previousState === 'loading' && state === 'done') {
      var _ref$current;
      const parentElement = document.getElementById(itemId);
      if (!parentElement) return;

      // Announce update to screen readers
      const parentName = getAccessibleName(parentElement);
      if ((_ref$current = ref.current) !== null && _ref$current !== void 0 && _ref$current.childElementCount) {
        announceUpdate(`${parentName} content loaded`);
      } else {
        announceUpdate(`${parentName} is empty`);
      }

      // Move focus to the first child if the loading indicator
      // was focused when the async items finished loading
      if (loadingFocused) {
        const firstChild = getFirstChildElement(parentElement);
        if (firstChild) {
          safeSetTimeout(() => {
            firstChild.focus();
          });
        } else {
          safeSetTimeout(() => {
            parentElement.focus();
          });
        }
        setLoadingFocused(false);
      }
    }
  }, [loadingFocused, previousState, state, itemId, announceUpdate, ref, safeSetTimeout]);

  // Track focus on the loading indicator
  React.useEffect(() => {
    function handleFocus() {
      setLoadingFocused(true);
    }
    function handleBlur(event) {
      // Skip blur events that are caused by the element being removed from the DOM.
      // This can happen when the loading indicator is focused when async items are
      // done loading and the loading indicator is removed from the DOM.
      // If `loadingFocused` is `true` when `state` is `"done"` then the loading indicator
      // was focused when the async items finished loading and we need to move focus to the
      // first child.
      if (!event.relatedTarget) return;
      setLoadingFocused(false);
    }
    const loadingElement = loadingItemRef.current;
    if (!loadingElement) return;
    loadingElement.addEventListener('focus', handleFocus);
    loadingElement.addEventListener('blur', handleBlur);
    return () => {
      loadingElement.removeEventListener('focus', handleFocus);
      loadingElement.removeEventListener('blur', handleBlur);
    };
  }, [loadingItemRef, state]);
  if (!isExpanded) {
    return null;
  }
  return /*#__PURE__*/React.createElement("ul", {
    role: "group",
    style: {
      listStyle: 'none',
      padding: 0,
      margin: 0
    }
    // @ts-ignore Box doesn't have type support for `ref` used in combination with `as`
    ,
    ref: ref
  }, state === 'loading' ? /*#__PURE__*/React.createElement(LoadingItem, {
    ref: loadingItemRef,
    count: count
  }) : children);
};
SubTree.displayName = "SubTree";
SubTree.displayName = 'TreeView.SubTree';
function usePreviousValue(value) {
  const ref = React.useRef(value);
  React.useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}
const StyledSkeletonItemContainer = styled.span.attrs({
  className: 'PRIVATE_TreeView-item-skeleton'
}).withConfig({
  displayName: "TreeView__StyledSkeletonItemContainer",
  componentId: "sc-4ex6b6-1"
})(["display:flex;align-items:center;column-gap:0.5rem;height:2rem;@media (pointer:coarse){height:2.75rem;}&:nth-of-type(5n + 1){--tree-item-loading-width:67%;}&:nth-of-type(5n + 2){--tree-item-loading-width:47%;}&:nth-of-type(5n + 3){--tree-item-loading-width:73%;}&:nth-of-type(5n + 4){--tree-item-loading-width:64%;}&:nth-of-type(5n + 5){--tree-item-loading-width:50%;}"]);
const StyledSkeletonText = styled(SkeletonText).withConfig({
  displayName: "TreeView__StyledSkeletonText",
  componentId: "sc-4ex6b6-2"
})(["width:var(--tree-item-loading-width,67%);"]);
const SkeletonItem = () => {
  return /*#__PURE__*/React.createElement(StyledSkeletonItemContainer, null, /*#__PURE__*/React.createElement(SkeletonAvatar, {
    size: 16,
    square: true
  }), /*#__PURE__*/React.createElement(StyledSkeletonText, null));
};
SkeletonItem.displayName = "SkeletonItem";
const LoadingItem = /*#__PURE__*/React.forwardRef(({
  count
}, ref) => {
  const itemId = useId();
  if (count) {
    return /*#__PURE__*/React.createElement(Item, {
      id: itemId,
      ref: ref
    }, Array.from({
      length: count
    }).map((_, i) => {
      return /*#__PURE__*/React.createElement(SkeletonItem, {
        "aria-hidden": true,
        key: i
      });
    }), /*#__PURE__*/React.createElement("div", {
      className: "PRIVATE_VisuallyHidden"
    }, "Loading ", count, " items"));
  }
  return /*#__PURE__*/React.createElement(Item, {
    id: itemId,
    ref: ref
  }, /*#__PURE__*/React.createElement(LeadingVisual, null, /*#__PURE__*/React.createElement(StyledSpinner, {
    size: "small"
  })), /*#__PURE__*/React.createElement(Text, {
    sx: {
      color: 'fg.muted'
    }
  }, "Loading..."));
});
function useSubTree(children) {
  return React.useMemo(() => {
    const subTree = React.Children.toArray(children).find(child => /*#__PURE__*/React.isValidElement(child) && child.type === SubTree);
    const childrenWithoutSubTree = React.Children.toArray(children).filter(child => !( /*#__PURE__*/React.isValidElement(child) && child.type === SubTree));
    return {
      subTree,
      childrenWithoutSubTree,
      hasSubTree: Boolean(subTree)
    };
  }, [children]);
}

// ----------------------------------------------------------------------------
// TreeView.LeadingVisual and TreeView.TrailingVisual

const LeadingVisual = props => {
  const {
    isExpanded,
    leadingVisualId
  } = React.useContext(ItemContext);
  const children = typeof props.children === 'function' ? props.children({
    isExpanded
  }) : props.children;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "PRIVATE_VisuallyHidden",
    "aria-hidden": true,
    id: leadingVisualId
  }, props.label), /*#__PURE__*/React.createElement("div", {
    className: "PRIVATE_TreeView-item-visual",
    "aria-hidden": true
  }, children));
};
LeadingVisual.displayName = 'TreeView.LeadingVisual';
const TrailingVisual = props => {
  const {
    isExpanded,
    trailingVisualId
  } = React.useContext(ItemContext);
  const children = typeof props.children === 'function' ? props.children({
    isExpanded
  }) : props.children;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "PRIVATE_VisuallyHidden",
    "aria-hidden": true,
    id: trailingVisualId
  }, props.label), /*#__PURE__*/React.createElement("div", {
    className: "PRIVATE_TreeView-item-visual",
    "aria-hidden": true
  }, children));
};
TrailingVisual.displayName = 'TreeView.TrailingVisual';

// ----------------------------------------------------------------------------
// TreeView.LeadingAction

const LeadingAction = props => {
  const {
    isExpanded
  } = React.useContext(ItemContext);
  const children = typeof props.children === 'function' ? props.children({
    isExpanded
  }) : props.children;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "PRIVATE_VisuallyHidden",
    "aria-hidden": true
  }, props.label), /*#__PURE__*/React.createElement("div", {
    className: "PRIVATE_TreeView-item-leading-action",
    "aria-hidden": true
  }, children));
};
LeadingAction.displayName = 'TreeView.LeadingAction';
// ----------------------------------------------------------------------------
// TreeView.DirectoryIcon

const DirectoryIcon = () => {
  const {
    isExpanded
  } = React.useContext(ItemContext);
  const Icon = isExpanded ? FileDirectoryOpenFillIcon : FileDirectoryFillIcon;
  return /*#__PURE__*/React.createElement("div", {
    className: "PRIVATE_TreeView-directory-icon"
  }, /*#__PURE__*/React.createElement(Icon, null));
};
DirectoryIcon.displayName = "DirectoryIcon"; // ----------------------------------------------------------------------------
// TreeView.ErrorDialog
const ErrorDialog = ({
  title = 'Error',
  children,
  onRetry,
  onDismiss
}) => {
  const {
    itemId,
    setIsExpanded
  } = React.useContext(ItemContext);
  return (
    /*#__PURE__*/
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    React.createElement("div", {
      onKeyDown: event => {
        if (['Backspace', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Enter'].includes(event.key)) {
          // Prevent keyboard events from bubbling up to the TreeView
          // and interfering with keyboard navigation
          event.stopPropagation();
        }
      }
    }, /*#__PURE__*/React.createElement(ConfirmationDialog, {
      title: title,
      onClose: gesture => {
        // Focus parent item after the dialog is closed
        setTimeout(() => {
          const parentElement = document.getElementById(itemId);
          parentElement === null || parentElement === void 0 ? void 0 : parentElement.focus();
        });
        if (gesture === 'confirm') {
          onRetry === null || onRetry === void 0 ? void 0 : onRetry();
        } else {
          setIsExpanded(false);
          onDismiss === null || onDismiss === void 0 ? void 0 : onDismiss();
        }
      },
      confirmButtonContent: "Retry",
      cancelButtonContent: "Dismiss"
    }, children))
  );
};
ErrorDialog.displayName = "ErrorDialog";
ErrorDialog.displayName = 'TreeView.ErrorDialog';

// ----------------------------------------------------------------------------
// Export

const TreeView = Object.assign(Root, {
  Item,
  SubTree,
  LeadingAction,
  LeadingVisual,
  TrailingVisual,
  DirectoryIcon,
  ErrorDialog
});

export { TreeView };
