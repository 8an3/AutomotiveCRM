"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.substituteVariables = void 0;
const substituteVariables = (text, variablesIn) => {
    if (!text) {
        return "";
    }
    let substitutedText = text;
    if (variablesIn) {
        const variables = (typeof variablesIn === "string") ? JSON.parse(variablesIn) || {} : variablesIn;
        Object.keys(variables).forEach((variableName) => {
            // handle special characters in variable name
            const variableForRegex = variableName.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&');
            const regex = new RegExp('{' + variableForRegex + '}', 'g');
            substitutedText = substitutedText.replace(regex, variables[variableName]);
        });
    }
    // Remove any variables that were not substituted from inputs
    substitutedText = substitutedText.replace(/{[^{}]+}/g, '');
    return substitutedText;
};
exports.substituteVariables = substituteVariables;
//# sourceMappingURL=helper.js.map