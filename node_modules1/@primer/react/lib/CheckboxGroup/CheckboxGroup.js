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
require('../FormControl/_FormControlContext.js');
var FormControl = require('../FormControl/FormControl.js');
var Checkbox = require('../Checkbox/Checkbox.js');
var CheckboxGroupContext = require('./CheckboxGroupContext.js');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var React__default = /*#__PURE__*/_interopDefault(React);

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CheckboxGroup = ({
  children,
  disabled,
  onChange,
  ...rest
}) => {
  const formControlComponentChildren = React__default.default.Children.toArray(children).filter(child => /*#__PURE__*/React__default.default.isValidElement(child) && child.type === FormControl).map(formControlComponent => /*#__PURE__*/React__default.default.isValidElement(formControlComponent) ? formControlComponent.props.children : []).flat();
  const checkedCheckboxes = React__default.default.Children.toArray(formControlComponentChildren).filter(child => /*#__PURE__*/React__default.default.isValidElement(child) && child.type === Checkbox).map(checkbox => /*#__PURE__*/React__default.default.isValidElement(checkbox) && (checkbox.props.checked || checkbox.props.defaultChecked) && checkbox.props.value).filter(Boolean);
  const [selectedCheckboxValues, setSelectedCheckboxValues] = useRenderForcingRef.useRenderForcingRef(checkedCheckboxes);
  const updateSelectedCheckboxes = e => {
    const {
      value,
      checked
    } = e.currentTarget;
    if (checked) {
      setSelectedCheckboxValues([...(selectedCheckboxValues.current || []), value]);
      return;
    }
    setSelectedCheckboxValues((selectedCheckboxValues.current || []).filter(selectedValue => selectedValue !== value));
  };
  return /*#__PURE__*/React__default.default.createElement(CheckboxGroupContext.CheckboxGroupContext.Provider, {
    value: {
      disabled,
      onChange: e => {
        if (onChange) {
          updateSelectedCheckboxes(e);
          onChange(selectedCheckboxValues.current || [], e);
        }
      }
    }
  }, /*#__PURE__*/React__default.default.createElement(CheckboxOrRadioGroup, _extends({
    disabled: disabled
  }, rest), children));
};
CheckboxGroup.displayName = "CheckboxGroup";
var CheckboxGroup$1 = Object.assign(CheckboxGroup, {
  Caption: CheckboxOrRadioGroupCaption,
  Label: CheckboxOrRadioGroupLabel,
  Validation: CheckboxOrRadioGroupValidation
});

exports.CheckboxGroupContext = CheckboxGroupContext.CheckboxGroupContext;
exports.default = CheckboxGroup$1;
