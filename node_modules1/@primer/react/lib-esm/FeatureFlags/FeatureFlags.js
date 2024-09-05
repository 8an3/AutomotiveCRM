import React, { useMemo } from 'react';
import { FeatureFlagContext } from './FeatureFlagContext.js';
import { FeatureFlagScope } from './FeatureFlagScope.js';
import { DefaultFeatureFlags } from './DefaultFeatureFlags.js';

function FeatureFlags({
  children,
  flags
}) {
  const value = useMemo(() => {
    const scope = FeatureFlagScope.merge(DefaultFeatureFlags, FeatureFlagScope.create(flags));
    return scope;
  }, [flags]);
  return /*#__PURE__*/React.createElement(FeatureFlagContext.Provider, {
    value: value
  }, children);
}
FeatureFlags.displayName = "FeatureFlags";

export { FeatureFlags };
