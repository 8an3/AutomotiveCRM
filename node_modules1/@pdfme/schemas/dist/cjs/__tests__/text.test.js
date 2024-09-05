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
const fs_1 = require("fs");
const path = __importStar(require("path"));
const common_1 = require("@pdfme/common");
const helper_1 = require("../src/text/helper");
const sansData = (0, fs_1.readFileSync)(path.join(__dirname, `/assets/fonts/SauceHanSansJP.ttf`));
const serifData = (0, fs_1.readFileSync)(path.join(__dirname, `/assets/fonts/SauceHanSerifJP.ttf`));
const getSampleFont = () => ({
    SauceHanSansJP: { fallback: true, data: sansData },
    SauceHanSerifJP: { data: serifData },
});
const getTextSchema = () => {
    const textSchema = {
        type: 'text',
        content: 'test',
        position: { x: 0, y: 0 },
        width: 50,
        height: 20,
        alignment: 'left',
        verticalAlignment: 'top',
        fontColor: '#000000',
        backgroundColor: '#ffffff',
        lineHeight: 1,
        characterSpacing: 1,
        fontSize: 14,
    };
    return textSchema;
};
describe('getSplitPosition test with mocked font width calculations', () => {
    /**
     * To simplify these tests we mock the widthOfTextAtSize function to return
     * the length of the text in number of characters.
     * Therefore, setting the boxWidthInPt to 5 should result in a split after 5 characters.
     */
    let widthOfTextAtSizeSpy;
    beforeAll(() => {
        // @ts-ignore
        widthOfTextAtSizeSpy = jest.spyOn(require('../src/text/helper'), 'widthOfTextAtSize');
        widthOfTextAtSizeSpy.mockImplementation((text) => {
            return text.length;
        });
    });
    afterAll(() => {
        widthOfTextAtSizeSpy.mockRestore();
    });
    const mockedFont = {};
    const mockCalcValues = {
        font: mockedFont,
        fontSize: 12,
        characterSpacing: 1,
        boxWidthInPt: 5,
    };
    it('does not split an empty string', () => {
        expect((0, helper_1.getSplittedLines)('', mockCalcValues)).toEqual(['']);
    });
    it('does not split a short line', () => {
        expect((0, helper_1.getSplittedLines)('a', mockCalcValues)).toEqual(['a']);
        expect((0, helper_1.getSplittedLines)('aaaa', mockCalcValues)).toEqual(['aaaa']);
    });
    it('splits a line to the nearest previous breakable char', () => {
        expect((0, helper_1.getSplittedLines)('aaa bbb', mockCalcValues)).toEqual(['aaa', 'bbb']);
        expect((0, helper_1.getSplittedLines)('top-hat', mockCalcValues)).toEqual(['top-', 'hat']);
        expect((0, helper_1.getSplittedLines)('top—hat', mockCalcValues)).toEqual(['top—', 'hat']); // em dash
        expect((0, helper_1.getSplittedLines)('top–hat', mockCalcValues)).toEqual(['top–', 'hat']); // en dash
    });
    it('splits a line where the split point is on a breakable char', () => {
        expect((0, helper_1.getSplittedLines)('aaaaa bbbbb', mockCalcValues)).toEqual(['aaaaa', 'bbbbb']);
        expect((0, helper_1.getSplittedLines)('left-hand', mockCalcValues)).toEqual(['left-', 'hand']);
    });
    it('splits a long line in the middle of a word if too long', () => {
        expect((0, helper_1.getSplittedLines)('aaaaaa bbb', mockCalcValues)).toEqual(['aaaaa', 'a bbb']);
        expect((0, helper_1.getSplittedLines)('aaaaaa-a b', mockCalcValues)).toEqual(['aaaaa', 'a-a b']);
        expect((0, helper_1.getSplittedLines)('aaaaa-aa b', mockCalcValues)).toEqual(['aaaaa', '-aa b']);
    });
    it('splits a long line without breakable chars at exactly 5 chars', () => {
        expect((0, helper_1.getSplittedLines)('abcdef', mockCalcValues)).toEqual(['abcde', 'f']);
    });
    it('splits a very long line without breakable chars at exactly 5 chars', () => {
        expect((0, helper_1.getSplittedLines)('abcdefghijklmn', mockCalcValues)).toEqual(['abcde', 'fghij', 'klmn']);
    });
    it('splits a line with lots of words', () => {
        expect((0, helper_1.getSplittedLines)('a b c d e', mockCalcValues)).toEqual(['a b c', 'd e']);
    });
});
describe('getSplittedLines test with real font width calculations', () => {
    const font = (0, common_1.getDefaultFont)();
    const baseCalcValues = {
        fontSize: 12,
        characterSpacing: 1,
        boxWidthInPt: 40,
    };
    it('should not split a line when the text is shorter than the width', async () => {
        const _cache = new Map();
        await (0, helper_1.getFontKitFont)(getTextSchema().fontName, font, _cache).then((fontKitFont) => {
            const fontWidthCalcs = Object.assign({}, baseCalcValues, { font: fontKitFont });
            const result = (0, helper_1.getSplittedLines)('short', fontWidthCalcs);
            expect(result).toEqual(['short']);
        });
    });
    it('should split a line when the text is longer than the width', async () => {
        const _cache = new Map();
        await (0, helper_1.getFontKitFont)(getTextSchema().fontName, font, _cache).then((fontKitFont) => {
            const fontWidthCalcs = Object.assign({}, baseCalcValues, { font: fontKitFont });
            const result = (0, helper_1.getSplittedLines)('this will wrap', fontWidthCalcs);
            expect(result).toEqual(['this', 'will', 'wrap']);
        });
    });
    it('should split a line in the middle when unspaced text will not fit on a line', async () => {
        const _cache = new Map();
        await (0, helper_1.getFontKitFont)(getTextSchema().fontName, font, _cache).then((fontKitFont) => {
            const fontWidthCalcs = Object.assign({}, baseCalcValues, { font: fontKitFont });
            const result = (0, helper_1.getSplittedLines)('thiswillbecut', fontWidthCalcs);
            expect(result).toEqual(['thiswi', 'llbecu', 't']);
        });
    });
    it('should not split text when it is impossible due to size constraints', async () => {
        const _cache = new Map();
        await (0, helper_1.getFontKitFont)(getTextSchema().fontName, font, _cache).then((fontKitFont) => {
            const fontWidthCalcs = Object.assign({}, baseCalcValues, { font: fontKitFont });
            fontWidthCalcs.boxWidthInPt = 2;
            const result = (0, helper_1.getSplittedLines)('thiswillnotbecut', fontWidthCalcs);
            expect(result).toEqual(['thiswillnotbecut']);
        });
    });
});
describe('calculateDynamicFontSize with Default font', () => {
    const font = (0, common_1.getDefaultFont)();
    const _cache = new Map();
    it('should return default font size when dynamicFontSizeSetting is not provided', async () => {
        const textSchema = getTextSchema();
        const result = await (0, helper_1.calculateDynamicFontSize)({ textSchema, font, value: 'test', _cache });
        expect(result).toBe(14);
    });
    it('should return default font size when dynamicFontSizeSetting max is less than min', async () => {
        const textSchema = getTextSchema();
        textSchema.dynamicFontSize = { min: 11, max: 10, fit: 'vertical' };
        const result = await (0, helper_1.calculateDynamicFontSize)({ textSchema, font, value: 'test', _cache });
        expect(result).toBe(14);
    });
    it('should calculate a dynamic font size of vertical fit between min and max', async () => {
        const textSchema = getTextSchema();
        textSchema.dynamicFontSize = { min: 10, max: 30, fit: 'vertical' };
        const value = 'test with a length string\n and a new line';
        const result = await (0, helper_1.calculateDynamicFontSize)({ textSchema, font, value, _cache });
        expect(result).toBe(19.25);
    });
    it('should calculate a dynamic font size of horizontal fit between min and max', async () => {
        const textSchema = getTextSchema();
        textSchema.dynamicFontSize = { min: 10, max: 30, fit: 'horizontal' };
        const value = 'test with a length string\n and a new line';
        const result = await (0, helper_1.calculateDynamicFontSize)({ textSchema, font, value, _cache });
        expect(result).toBe(11.25);
    });
    it('should calculate a dynamic font size between min and max regardless of current font size', async () => {
        const textSchema = getTextSchema();
        textSchema.fontSize = 2;
        textSchema.dynamicFontSize = { min: 10, max: 30, fit: 'vertical' };
        const value = 'test with a length string\n and a new line';
        let result = await (0, helper_1.calculateDynamicFontSize)({ textSchema, font, value, _cache });
        expect(result).toBe(19.25);
        textSchema.fontSize = 40;
        result = await (0, helper_1.calculateDynamicFontSize)({ textSchema, font, value, _cache });
        expect(result).toBe(19.25);
    });
    it('should return min font size when content is too big to fit given constraints', async () => {
        const textSchema = getTextSchema();
        textSchema.width = 10;
        textSchema.dynamicFontSize = { min: 10, max: 30, fit: 'vertical' };
        const value = 'test with a length string\n and a new line';
        const result = await (0, helper_1.calculateDynamicFontSize)({ textSchema, font, value, _cache });
        expect(result).toBe(10);
    });
    it('should return max font size when content is too small to fit given constraints', async () => {
        const textSchema = getTextSchema();
        textSchema.width = 1000;
        textSchema.height = 200;
        textSchema.dynamicFontSize = { min: 10, max: 30, fit: 'vertical' };
        const value = 'test with a length string\n and a new line';
        const result = await (0, helper_1.calculateDynamicFontSize)({ textSchema, font, value, _cache });
        expect(result).toBe(30);
    });
    it('should not reduce font size below 0', async () => {
        const textSchema = getTextSchema();
        textSchema.dynamicFontSize = { min: -5, max: 10, fit: 'vertical' };
        textSchema.width = 4;
        textSchema.height = 1;
        const value = 'a very \nlong \nmulti-line \nstring\nto';
        const result = await (0, helper_1.calculateDynamicFontSize)({ textSchema, font, value, _cache });
        expect(result).toBeGreaterThan(0);
    });
    it('should calculate a dynamic font size when a starting font size is passed that is lower than the eventual', async () => {
        const textSchema = getTextSchema();
        textSchema.dynamicFontSize = { min: 10, max: 30, fit: 'vertical' };
        const value = 'test with a length string\n and a new line';
        const startingFontSize = 18;
        const result = await (0, helper_1.calculateDynamicFontSize)({
            textSchema,
            font,
            value,
            startingFontSize,
            _cache,
        });
        expect(result).toBe(19.25);
    });
    it('should calculate a dynamic font size when a starting font size is passed that is higher than the eventual', async () => {
        const textSchema = getTextSchema();
        textSchema.dynamicFontSize = { min: 10, max: 30, fit: 'horizontal' };
        const value = 'test with a length string\n and a new line';
        const startingFontSize = 36;
        const result = await (0, helper_1.calculateDynamicFontSize)({
            textSchema,
            font,
            value,
            startingFontSize,
            _cache,
        });
        expect(result).toBe(11.25);
    });
    it('should calculate a dynamic font size using vertical fit as a default if no fit provided', async () => {
        const textSchema = getTextSchema();
        textSchema.dynamicFontSize = { min: 10, max: 30, fit: 'vertical' };
        const value = 'test with a length string\n and a new line';
        const result = await (0, helper_1.calculateDynamicFontSize)({ textSchema, font, value, _cache });
        expect(result).toBe(19.25);
    });
});
describe('calculateDynamicFontSize with Custom font', () => {
    const font = getSampleFont();
    it('should return smaller font size when dynamicFontSizeSetting is provided with horizontal fit', async () => {
        const textSchema = getTextSchema();
        const _cache = new Map();
        textSchema.dynamicFontSize = { min: 10, max: 30, fit: 'horizontal' };
        const value = 'あいうあいうあい';
        const result = await (0, helper_1.calculateDynamicFontSize)({ textSchema, font, value, _cache });
        expect(result).toBe(16.75);
    });
    it('should return smaller font size when dynamicFontSizeSetting is provided with vertical fit', async () => {
        const textSchema = getTextSchema();
        const _cache = new Map();
        textSchema.dynamicFontSize = { min: 10, max: 30, fit: 'vertical' };
        const value = 'あいうあいうあい';
        const result = await (0, helper_1.calculateDynamicFontSize)({ textSchema, font, value, _cache });
        expect(result).toBe(26);
    });
    it('should return min font size when content is too big to fit given constraints', async () => {
        const textSchema = getTextSchema();
        const _cache = new Map();
        textSchema.dynamicFontSize = { min: 20, max: 30, fit: 'vertical' };
        const value = 'あいうあいうあいうあいうあいうあいうあいうあいうあいう';
        const result = await (0, helper_1.calculateDynamicFontSize)({ textSchema, font, value, _cache });
        expect(result).toBe(20);
    });
    it('should return max font size when content is too small to fit given constraints', async () => {
        const textSchema = getTextSchema();
        const _cache = new Map();
        textSchema.dynamicFontSize = { min: 10, max: 30, fit: 'vertical' };
        const value = 'あ';
        const result = await (0, helper_1.calculateDynamicFontSize)({ textSchema, font, value, _cache });
        expect(result).toBe(30);
    });
    it('should return min font size when content is multi-line with too many lines for the container', async () => {
        const textSchema = getTextSchema();
        const _cache = new Map();
        textSchema.dynamicFontSize = { min: 5, max: 20, fit: 'vertical' };
        const value = 'あ\nいう\nあ\nいう\nあ\nいう\nあ\nいう\nあ\nいう\nあ\nいう';
        const result = await (0, helper_1.calculateDynamicFontSize)({ textSchema, font, value, _cache });
        expect(result).toBe(5);
    });
});
describe('getFontDescentInPt test', () => {
    test('it gets a descent size relative to the font size', () => {
        expect((0, helper_1.getFontDescentInPt)({ descent: -400, unitsPerEm: 1000 }, 12)).toBe(-4.800000000000001);
        expect((0, helper_1.getFontDescentInPt)({ descent: 54, unitsPerEm: 1000 }, 20)).toBe(1.08);
        expect((0, helper_1.getFontDescentInPt)({ descent: -512, unitsPerEm: 2048 }, 54)).toBe(-13.5);
    });
});
describe('getBrowserVerticalFontAdjustments test', () => {
    // Font with a base line-height of 1.349
    const font = { ascent: 1037, descent: -312, unitsPerEm: 1000 };
    test('it gets a top adjustment when vertically aligning top', () => {
        expect((0, helper_1.getBrowserVerticalFontAdjustments)(font, 12, 1.0, 'top')).toEqual({
            topAdj: 2.791301999999999,
            bottomAdj: 0,
        });
        expect((0, helper_1.getBrowserVerticalFontAdjustments)(font, 36, 2.0, 'top')).toEqual({
            topAdj: 8.373906,
            bottomAdj: 0,
        });
    });
    test('it gets a bottom adjustment when vertically aligning middle or bottom', () => {
        expect((0, helper_1.getBrowserVerticalFontAdjustments)(font, 12, 1.0, 'bottom')).toEqual({
            topAdj: 0,
            bottomAdj: 2.791302,
        });
        expect((0, helper_1.getBrowserVerticalFontAdjustments)(font, 12, 1.15, 'middle')).toEqual({
            topAdj: 0,
            bottomAdj: 1.5916020000000004,
        });
    });
    test('it does not get a bottom adjustment if the line height exceeds that of the font', () => {
        expect((0, helper_1.getBrowserVerticalFontAdjustments)(font, 12, 1.35, 'bottom')).toEqual({
            topAdj: 0,
            bottomAdj: 0,
        });
    });
    test('it does not get a bottom adjustment if the font base line-height is 1.0 or less', () => {
        const thisFont = { ascent: 900, descent: -50, unitsPerEm: 1000 };
        expect((0, helper_1.getBrowserVerticalFontAdjustments)(thisFont, 20, 1.0, 'bottom')).toEqual({
            topAdj: 0,
            bottomAdj: 0,
        });
    });
});
//# sourceMappingURL=text.test.js.map