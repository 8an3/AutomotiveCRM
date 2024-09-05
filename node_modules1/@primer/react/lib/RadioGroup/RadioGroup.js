'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var CheckboxOrRadioGroup = require('../internal/components/CheckboxOrRadioGroup/CheckboxOrRadioGroup.js');
var CheckboxOrRadioGroupCaption = require('../internal/components/CheckboxOrRadioGroup/CheckboxOrRadioGroupCaption.js');
var CheckboxOrRadioGroupLabel = require('../internal/components/CheckboxOrRadioGroup/CheckboxOrRadioGroupLabel.js');
var CheckboxOrRadioGroupValidation = require('../internal/components/CheckboxOrRadioGroup/CheckboxOrRadioGroupValidation.js');
require('@primer/behaviors/utils');
require('@primer/behaviors');
var useRenderForcingRef = require('../hooks/useRenderForcingRef.js');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var React__default = /*#__PURE__*/_interopDefault(React);

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const RadioGroupContext = /*#__PURE__*/React.createContext(null);
const RadioGroup = ({
  children,
  disabled,
  onChange,
  name,
  ...rest
}) => {
  const [selectedRadioValue, setSelectedRadioValue] = useRenderForcingRef.useRenderForcingRef(null);
  const updateSelectedCheckboxes = e => {
    const {
      value,
      checked
    } = e.currentTarget;
    if (checked) {
      setSelectedRadioValue(value);
      return;
    }
  };
  return /*#__PURE__*/React__default.default.createElement(RadioGroupContext.Provider, {
    value: {
      disabled,
      name,
      onChange: e => {
        if (onChange) {
          updateSelectedCheckboxes(e);
          onChange(selectedRadioValue.current, e);
        }
      }
    }
  }, /*#__PURE__*/React__default.default.createElement(CheckboxOrRadioGroup, _extends({
    disabled: disabled
  }, rest), children));
};
RadioGroup.displayName = "RadioGroup";
var RadioGroup$1 = Object.assign(RadioGroup, {
  Caption: CheckboxOrRadioGroupCaption,
  Label: CheckboxOrRadioGroupLabel,
  Validation: CheckboxOrRadioGroupValidation
});

exports.RadioGroupContext = RadioGroupContext;
exports.default = RadioGroup$1;
