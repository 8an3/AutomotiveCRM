'use strict';

var React = require('react');
var FeatureFlagContext = require('./FeatureFlagContext.js');
var FeatureFlagScope = require('./FeatureFlagScope.js');
var DefaultFeatureFlags = require('./DefaultFeatureFlags.js');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var React__default = /*#__PURE__*/_interopDefault(React);

function FeatureFlags({
  children,
  flags
}) {
  const value = React.useMemo(() => {
    const scope = FeatureFlagScope.FeatureFlagScope.merge(DefaultFeatureFlags.DefaultFeatureFlags, FeatureFlagScope.FeatureFlagScope.create(flags));
    return scope;
  }, [flags]);
  return /*#__PURE__*/React__default.default.createElement(FeatureFlagContext.FeatureFlagContext.Provider, {
    value: value
  }, children);
}
FeatureFlags.displayName = "FeatureFlags";

exports.FeatureFlags = FeatureFlags;
