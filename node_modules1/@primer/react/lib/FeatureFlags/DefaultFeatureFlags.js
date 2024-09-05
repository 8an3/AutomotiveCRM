'use strict';

var FeatureFlagScope = require('./FeatureFlagScope.js');

const DefaultFeatureFlags = FeatureFlagScope.FeatureFlagScope.create();

exports.DefaultFeatureFlags = DefaultFeatureFlags;
