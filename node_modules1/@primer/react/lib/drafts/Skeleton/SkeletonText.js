'use strict';

var React = require('react');
var Box = require('../../Box/Box.js');
var SkeletonBox = require('./SkeletonBox.js');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var React__default = /*#__PURE__*/_interopDefault(React);

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const skeletonTextStyles = {
  '&[data-component="SkeletonText"]': {
    '--font-size': 'var(--text-body-size-medium, 0.875rem)',
    '--line-height': 'var(--text-body-lineHeight-medium, 1.4285)',
    '--leading': 'calc(var(--font-size) * var(--line-height) - var(--font-size))',
    borderRadius: 'var(--borderRadius-small, 0.1875rem)',
    height: 'var(--font-size)',
    marginBlock: 'calc(var(--leading) / 2)'
  },
  '&[data-in-multiline="true"]': {
    marginBlockEnd: 'calc(var(--leading) * 2)'
  },
  '&[data-in-multiline="true"]:last-child': {
    maxWidth: '65%',
    minWidth: '50px',
    marginBottom: 0
  },
  '@supports (margin-block: mod(1px, 1px))': {
    '&[data-component="SkeletonText"]': {
      '--leading': 'mod(var(--font-size) * var(--line-height), var(--font-size))'
    }
  },
  '&[data-text-skeleton-size="display"], &[data-text-skeleton-size="titleLarge"]': {
    borderRadius: 'var(--borderRadius-medium, 0.375rem)'
  },
  '&[data-text-skeleton-size="display"]': {
    '--font-size': 'var(--text-display-size, 2.5rem)',
    '--line-height': 'var(--text-display-lineHeight, 1.4)'
  },
  '&[data-text-skeleton-size="titleLarge"]': {
    '--font-size': 'var(--text-title-size-large, 2.5rem)',
    '--line-height': 'var(--text-title-lineHeight-large, 1.5)'
  },
  '&[data-text-skeleton-size="titleMedium"]': {
    '--font-size': 'var(--text-title-size-medium, 1.25rem)',
    '--line-height': 'var(--text-title-lineHeight-medium, 1.6)'
  },
  '&[data-text-skeleton-size="titleSmall"]': {
    '--font-size': 'var(--text-title-size-small, 1rem)',
    '--line-height': 'var(--text-title-lineHeight-small, 1.5)'
  },
  '&[data-text-skeleton-size="subtitle"]': {
    '--font-size': 'var(--text-subtitle-size, 1.25rem)',
    '--line-height': 'var(--text-subtitle-lineHeight, 1.6)'
  },
  '&[data-text-skeleton-size="bodyLarge"]': {
    '--font-size': 'var(--text-body-size-large, 1rem)',
    '--line-height': 'var(--text-body-lineHeight-large, 1.5)'
  },
  '&[data-text-skeleton-size="bodySmall"]': {
    '--font-size': 'var(--text-body-size-small, 0.75rem)',
    '--line-height': 'var(--text-body-lineHeight-small, 1.6666)'
  }
};
const SkeletonText = ({
  lines = 1,
  maxWidth,
  size = 'bodyMedium',
  ...rest
}) => {
  return lines < 2 ? /*#__PURE__*/React__default.default.createElement(SkeletonBox.SkeletonBox, _extends({
    "data-component": "SkeletonText",
    "data-text-skeleton-size": size,
    width: "100%",
    sx: {
      maxWidth,
      ...skeletonTextStyles
    }
  }, rest)) : /*#__PURE__*/React__default.default.createElement(Box, {
    "data-component": "multilineContainer",
    sx: {
      maxWidth,
      /* The tiny `paddingBlock` prevents margin collapse between the first skeleton line
       * and a bottom margin above it.
       */
      paddingBlock: '0.1px'
    }
  }, Array.from({
    length: lines
  }, (_, index) => /*#__PURE__*/React__default.default.createElement(SkeletonBox.SkeletonBox, _extends({
    key: index,
    "data-component": "SkeletonText",
    "data-in-multiline": "true",
    "data-text-skeleton-size": size,
    sx: skeletonTextStyles
  }, rest))));
};

exports.SkeletonText = SkeletonText;
