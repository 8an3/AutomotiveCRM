"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isFirefox = exports.splitTextToSize = exports.calculateDynamicFontSize = exports.getSplittedLines = exports.getFontKitFont = exports.widthOfTextAtSize = exports.heightOfFontAtSize = exports.getFontDescentInPt = exports.getBrowserVerticalFontAdjustments = void 0;
const fontkit = __importStar(require("fontkit"));
const common_1 = require("@pdfme/common");
const buffer_1 = require("buffer");
const constants_js_1 = require("./constants.js");
const getBrowserVerticalFontAdjustments = (fontKitFont, fontSize, lineHeight, verticalAlignment) => {
    const { ascent, descent, unitsPerEm } = fontKitFont;
    // Fonts have a designed line height that the browser renders when using `line-height: normal`
    const fontBaseLineHeight = (ascent - descent) / unitsPerEm;
    // For vertical alignment top
    // To achieve consistent positioning between browser and PDF, we apply the difference between
    // the font's actual height and the font size in pixels.
    // Browsers middle the font within this height, so we only need half of it to apply to the top.
    // This means the font renders a bit lower in the browser, but achieves PDF alignment
    const topAdjustment = (fontBaseLineHeight * fontSize - fontSize) / 2;
    if (verticalAlignment === constants_js_1.VERTICAL_ALIGN_TOP) {
        return { topAdj: (0, common_1.pt2px)(topAdjustment), bottomAdj: 0 };
    }
    // For vertical alignment bottom and middle
    // When browsers render text in a non-form element (such as a <div>), some of the text may be
    // lowered below and outside the containing element if the line height used is less than
    // the base line-height of the font.
    // This behaviour does not happen in a <textarea> though, so we need to adjust the positioning
    // for consistency between editing and viewing to stop text jumping up and down.
    // This portion of text is half of the difference between the base line height and the used
    // line height. If using the same or higher line-height than the base font, then line-height
    // takes over in the browser and this adjustment is not needed.
    // Unlike the top adjustment - this is only driven by browser behaviour, not PDF alignment.
    let bottomAdjustment = 0;
    if (lineHeight < fontBaseLineHeight) {
        bottomAdjustment = ((fontBaseLineHeight - lineHeight) * fontSize) / 2;
    }
    return { topAdj: 0, bottomAdj: (0, common_1.pt2px)(bottomAdjustment) };
};
exports.getBrowserVerticalFontAdjustments = getBrowserVerticalFontAdjustments;
const getFontDescentInPt = (fontKitFont, fontSize) => {
    const { descent, unitsPerEm } = fontKitFont;
    return (descent / unitsPerEm) * fontSize;
};
exports.getFontDescentInPt = getFontDescentInPt;
const heightOfFontAtSize = (fontKitFont, fontSize) => {
    const { ascent, descent, bbox, unitsPerEm } = fontKitFont;
    const scale = 1000 / unitsPerEm;
    const yTop = (ascent || bbox.maxY) * scale;
    const yBottom = (descent || bbox.minY) * scale;
    let height = yTop - yBottom;
    height -= Math.abs(descent * scale) || 0;
    return (height / 1000) * fontSize;
};
exports.heightOfFontAtSize = heightOfFontAtSize;
const calculateCharacterSpacing = (textContent, textCharacterSpacing) => {
    return (textContent.length - 1) * textCharacterSpacing;
};
const widthOfTextAtSize = (text, fontKitFont, fontSize, characterSpacing) => {
    const { glyphs } = fontKitFont.layout(text);
    const scale = 1000 / fontKitFont.unitsPerEm;
    const standardWidth = glyphs.reduce((totalWidth, glyph) => totalWidth + glyph.advanceWidth * scale, 0) *
        (fontSize / 1000);
    return standardWidth + calculateCharacterSpacing(text, characterSpacing);
};
exports.widthOfTextAtSize = widthOfTextAtSize;
const getFallbackFont = (font) => {
    const fallbackFontName = (0, common_1.getFallbackFontName)(font);
    return font[fallbackFontName];
};
const getCacheKey = (fontName) => `getFontKitFont-${fontName}`;
const getFontKitFont = async (fontName, font, _cache) => {
    const fntNm = fontName || (0, common_1.getFallbackFontName)(font);
    const cacheKey = getCacheKey(fntNm);
    if (_cache.has(cacheKey)) {
        return _cache.get(cacheKey);
    }
    const currentFont = font[fntNm] || getFallbackFont(font) || (0, common_1.getDefaultFont)()[common_1.DEFAULT_FONT_NAME];
    let fontData = currentFont.data;
    if (typeof fontData === 'string') {
        fontData = fontData.startsWith('http')
            ? await fetch(fontData).then((res) => res.arrayBuffer())
            : (0, common_1.b64toUint8Array)(fontData);
    }
    const fontKitFont = fontkit.create(fontData instanceof buffer_1.Buffer ? fontData : buffer_1.Buffer.from(fontData));
    _cache.set(cacheKey, fontKitFont);
    return fontKitFont;
};
exports.getFontKitFont = getFontKitFont;
const isTextExceedingBoxWidth = (text, calcValues) => {
    const { font, fontSize, characterSpacing, boxWidthInPt } = calcValues;
    const textWidth = (0, exports.widthOfTextAtSize)(text, font, fontSize, characterSpacing);
    return textWidth > boxWidthInPt;
};
/**
 * Incrementally checks the current line for its real length
 * and returns the position where it exceeds the box width.
 * Returns `null` to indicate if textLine is shorter than the available box.
 */
const getOverPosition = (textLine, calcValues) => {
    for (let i = 0; i <= textLine.length; i++) {
        if (isTextExceedingBoxWidth(textLine.slice(0, i + 1), calcValues)) {
            return i;
        }
    }
    return null;
};
/**
 * Line breakable chars depend on the language and writing system.
 * Western writing systems typically use spaces and hyphens as line breakable chars.
 * Other writing systems often break on word boundaries so the following
 * does not negatively impact them.
 * However, this might need to be revisited for broader language support.
 */
const isLineBreakableChar = (char) => {
    const lineBreakableChars = [' ', '-', "\u2014", "\u2013"];
    return lineBreakableChars.includes(char);
};
/**
 * Gets the position of the split. Splits the exceeding line at
 * the last breakable char prior to it exceeding the bounding box width.
 */
const getSplitPosition = (textLine, calcValues) => {
    const overPos = getOverPosition(textLine, calcValues);
    if (overPos === null)
        return textLine.length; // input line is shorter than the available space
    if (textLine[overPos] === ' ') {
        // if the character immediately beyond the boundary is a space, split
        return overPos;
    }
    let overPosTmp = overPos - 1;
    while (overPosTmp >= 0) {
        if (isLineBreakableChar(textLine[overPosTmp])) {
            return overPosTmp + 1;
        }
        overPosTmp--;
    }
    // For very long lines with no breakable chars use the original overPos
    return overPos;
};
/**
 * Recursively splits the line at getSplitPosition.
 * If there is some leftover, split the rest again in the same manner.
 */
const getSplittedLines = (textLine, calcValues) => {
    const splitPos = getSplitPosition(textLine, calcValues);
    const splittedLine = textLine.substring(0, splitPos).trimEnd();
    const rest = textLine.substring(splitPos).trimStart();
    if (rest === textLine) {
        // if we went so small that we want to split on the first char
        // then end recursion to avoid infinite loop
        return [textLine];
    }
    if (rest.length === 0) {
        // end recursion if there is no leftover
        return [splittedLine];
    }
    return [splittedLine, ...(0, exports.getSplittedLines)(rest, calcValues)];
};
exports.getSplittedLines = getSplittedLines;
/**
 * If using dynamic font size, iteratively increment or decrement the
 * font size to fit the containing box.
 * Calculating space usage involves splitting lines where they exceed
 * the box width based on the proposed size.
 */
const calculateDynamicFontSize = async ({ textSchema, font, value, startingFontSize, _cache, }) => {
    const { fontSize: schemaFontSize, dynamicFontSize: dynamicFontSizeSetting, characterSpacing: schemaCharacterSpacing, width: boxWidth, height: boxHeight, lineHeight = constants_js_1.DEFAULT_LINE_HEIGHT, } = textSchema;
    const fontSize = startingFontSize || schemaFontSize || constants_js_1.DEFAULT_FONT_SIZE;
    if (!dynamicFontSizeSetting)
        return fontSize;
    if (dynamicFontSizeSetting.max < dynamicFontSizeSetting.min)
        return fontSize;
    const characterSpacing = schemaCharacterSpacing ?? constants_js_1.DEFAULT_CHARACTER_SPACING;
    const fontKitFont = await (0, exports.getFontKitFont)(textSchema.fontName, font, _cache);
    const paragraphs = value.split('\n');
    let dynamicFontSize = fontSize;
    if (dynamicFontSize < dynamicFontSizeSetting.min) {
        dynamicFontSize = dynamicFontSizeSetting.min;
    }
    else if (dynamicFontSize > dynamicFontSizeSetting.max) {
        dynamicFontSize = dynamicFontSizeSetting.max;
    }
    const dynamicFontFit = dynamicFontSizeSetting.fit ?? constants_js_1.DEFAULT_DYNAMIC_FIT;
    const calculateConstraints = (size) => {
        let totalWidthInMm = 0;
        let totalHeightInMm = 0;
        const boxWidthInPt = (0, common_1.mm2pt)(boxWidth);
        const firstLineTextHeight = (0, exports.heightOfFontAtSize)(fontKitFont, size);
        const firstLineHeightInMm = (0, common_1.pt2mm)(firstLineTextHeight * lineHeight);
        const otherRowHeightInMm = (0, common_1.pt2mm)(size * lineHeight);
        paragraphs.forEach((paragraph, paraIndex) => {
            const lines = (0, exports.getSplittedLines)(paragraph, {
                font: fontKitFont,
                fontSize: size,
                characterSpacing,
                boxWidthInPt,
            });
            lines.forEach((line, lineIndex) => {
                if (dynamicFontFit === constants_js_1.DYNAMIC_FIT_VERTICAL) {
                    // For vertical fit we want to consider the width of text lines where we detect a split
                    const textWidth = (0, exports.widthOfTextAtSize)(line, fontKitFont, size, characterSpacing);
                    const textWidthInMm = (0, common_1.pt2mm)(textWidth);
                    totalWidthInMm = Math.max(totalWidthInMm, textWidthInMm);
                }
                if (paraIndex + lineIndex === 0) {
                    totalHeightInMm += firstLineHeightInMm;
                }
                else {
                    totalHeightInMm += otherRowHeightInMm;
                }
            });
            if (dynamicFontFit === constants_js_1.DYNAMIC_FIT_HORIZONTAL) {
                // For horizontal fit we want to consider the line's width 'unsplit'
                const textWidth = (0, exports.widthOfTextAtSize)(paragraph, fontKitFont, size, characterSpacing);
                const textWidthInMm = (0, common_1.pt2mm)(textWidth);
                totalWidthInMm = Math.max(totalWidthInMm, textWidthInMm);
            }
        });
        return { totalWidthInMm, totalHeightInMm };
    };
    const shouldFontGrowToFit = (totalWidthInMm, totalHeightInMm) => {
        if (dynamicFontSize >= dynamicFontSizeSetting.max) {
            return false;
        }
        if (dynamicFontFit === constants_js_1.DYNAMIC_FIT_HORIZONTAL) {
            return totalWidthInMm < boxWidth;
        }
        return totalHeightInMm < boxHeight;
    };
    const shouldFontShrinkToFit = (totalWidthInMm, totalHeightInMm) => {
        if (dynamicFontSize <= dynamicFontSizeSetting.min || dynamicFontSize <= 0) {
            return false;
        }
        return totalWidthInMm > boxWidth || totalHeightInMm > boxHeight;
    };
    let { totalWidthInMm, totalHeightInMm } = calculateConstraints(dynamicFontSize);
    // Attempt to increase the font size up to desired fit
    while (shouldFontGrowToFit(totalWidthInMm, totalHeightInMm)) {
        dynamicFontSize += constants_js_1.FONT_SIZE_ADJUSTMENT;
        const { totalWidthInMm: newWidth, totalHeightInMm: newHeight } = calculateConstraints(dynamicFontSize);
        if (newHeight < boxHeight) {
            totalWidthInMm = newWidth;
            totalHeightInMm = newHeight;
        }
        else {
            dynamicFontSize -= constants_js_1.FONT_SIZE_ADJUSTMENT;
            break;
        }
    }
    // Attempt to decrease the font size down to desired fit
    while (shouldFontShrinkToFit(totalWidthInMm, totalHeightInMm)) {
        dynamicFontSize -= constants_js_1.FONT_SIZE_ADJUSTMENT;
        ({ totalWidthInMm, totalHeightInMm } = calculateConstraints(dynamicFontSize));
    }
    return dynamicFontSize;
};
exports.calculateDynamicFontSize = calculateDynamicFontSize;
const splitTextToSize = (arg) => {
    const { value, characterSpacing, fontSize, fontKitFont, boxWidthInPt } = arg;
    const fontWidthCalcValues = {
        font: fontKitFont,
        fontSize,
        characterSpacing,
        boxWidthInPt,
    };
    let lines = [];
    value.split(/\r\n|\r|\n|\f|\u000B/g).forEach((line) => {
        lines = lines.concat((0, exports.getSplittedLines)(line, fontWidthCalcValues));
    });
    return lines;
};
exports.splitTextToSize = splitTextToSize;
const isFirefox = () => navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
exports.isFirefox = isFirefox;
//# sourceMappingURL=helper.js.map