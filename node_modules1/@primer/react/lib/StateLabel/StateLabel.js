'use strict';

var octiconsReact = require('@primer/octicons-react');
var React = require('react');
var styled = require('styled-components');
var styledSystem = require('styled-system');
var constants = require('../constants.js');
var Octicon = require('../Octicon/Octicon.js');
var sx = require('../sx.js');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var React__default = /*#__PURE__*/_interopDefault(React);
var styled__default = /*#__PURE__*/_interopDefault(styled);

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const octiconMap = {
  issueOpened: octiconsReact.IssueOpenedIcon,
  pullOpened: octiconsReact.GitPullRequestIcon,
  issueClosed: octiconsReact.IssueClosedIcon,
  issueClosedNotPlanned: octiconsReact.SkipIcon,
  pullClosed: octiconsReact.GitPullRequestClosedIcon,
  pullMerged: octiconsReact.GitMergeIcon,
  draft: octiconsReact.GitPullRequestDraftIcon,
  issueDraft: octiconsReact.IssueDraftIcon,
  pullQueued: octiconsReact.GitMergeQueueIcon,
  unavailable: octiconsReact.AlertIcon
};
const labelMap = {
  issueOpened: 'Issue',
  pullOpened: 'Pull request',
  issueClosed: 'Issue',
  issueClosedNotPlanned: 'Issue, not planned',
  pullClosed: 'Pull request',
  pullMerged: 'Pull request',
  draft: 'Pull request',
  issueDraft: 'Issue',
  pullQueued: 'Pull request',
  unavailable: ''
};
const colorVariants = styledSystem.variant({
  prop: 'status',
  variants: {
    issueClosed: {
      backgroundColor: 'done.emphasis',
      color: 'fg.onEmphasis'
    },
    issueClosedNotPlanned: {
      backgroundColor: 'neutral.emphasis',
      color: 'fg.onEmphasis'
    },
    pullClosed: {
      backgroundColor: 'closed.emphasis',
      color: 'fg.onEmphasis'
    },
    pullMerged: {
      backgroundColor: 'done.emphasis',
      color: 'fg.onEmphasis'
    },
    pullQueued: {
      backgroundColor: 'attention.emphasis',
      color: 'fg.onEmphasis'
    },
    issueOpened: {
      backgroundColor: 'open.emphasis',
      color: 'fg.onEmphasis'
    },
    pullOpened: {
      backgroundColor: 'open.emphasis',
      color: 'fg.onEmphasis'
    },
    draft: {
      backgroundColor: 'neutral.emphasis',
      color: 'fg.onEmphasis'
    },
    issueDraft: {
      backgroundColor: 'neutral.emphasis',
      color: 'fg.onEmphasis'
    },
    unavailable: {
      backgroundColor: 'neutral.emphasis',
      color: 'fg.onEmphasis'
    }
  }
});
const sizeVariants = styledSystem.variant({
  prop: 'variant',
  variants: {
    small: {
      paddingX: 2,
      paddingY: 1,
      fontSize: 0
    },
    normal: {
      paddingX: '12px',
      paddingY: 2,
      fontSize: 1
    }
  }
});
const StateLabelBase = styled__default.default.span.withConfig({
  displayName: "StateLabel__StateLabelBase",
  componentId: "sc-qthdln-0"
})(["display:inline-flex;align-items:center;font-weight:", ";line-height:16px;color:", ";text-align:center;border-radius:", ";", ";", ";", ";"], constants.get('fontWeights.bold'), constants.get('colors.canvas.default'), constants.get('radii.3'), colorVariants, sizeVariants, sx.default);
function StateLabel({
  children,
  status,
  variant: variantProp = 'normal',
  ...rest
}) {
  const octiconProps = variantProp === 'small' ? {
    width: '1em'
  } : {};
  return /*#__PURE__*/React__default.default.createElement(StateLabelBase, _extends({}, rest, {
    variant: variantProp,
    status: status
  }), status && /*#__PURE__*/React__default.default.createElement(Octicon, _extends({}, octiconProps, {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    icon: octiconMap[status] || octiconsReact.QuestionIcon,
    "aria-label": labelMap[status],
    sx: {
      mr: 1
    }
  })), children);
}
StateLabel.displayName = "StateLabel";

module.exports = StateLabel;
