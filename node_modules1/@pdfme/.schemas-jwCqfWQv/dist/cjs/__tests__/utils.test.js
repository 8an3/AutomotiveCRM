"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@pdfme/common");
const utils_1 = require("../src/utils");
describe('hex2RgbColor', () => {
    it('should convert hex to rgb', () => {
        const hex = '#000000';
        const rgbValue = (0, utils_1.hex2RgbColor)(hex);
        expect(rgbValue).toEqual({ red: 0, green: 0, blue: 0, type: 'RGB' });
    });
    it('should convert hex to rgb with a short hex', () => {
        const hex = '#fff';
        const rgbValue = (0, utils_1.hex2RgbColor)(hex);
        expect(rgbValue).toEqual({ red: 1, green: 1, blue: 1, type: 'RGB' });
    });
    it('should convert hex to rgb for non-trivial color', () => {
        const hex = '#33af5a';
        const rgbValue = (0, utils_1.hex2RgbColor)(hex);
        expect(rgbValue).toEqual({
            red: 0.2,
            green: 0.6862745098039216,
            blue: 0.35294117647058826,
            type: 'RGB',
        });
    });
    it('should throw an error if hex is invalid', () => {
        const hex = '#fffee';
        expect(() => (0, utils_1.hex2RgbColor)(hex)).toThrowError('Invalid hex color value #ff');
    });
});
describe('rotatePoint', () => {
    it('should rotate one point round another by 90 degrees', () => {
        const point = { x: 5, y: 5 };
        const pivot = { x: 0, y: 0 };
        const angle = 90;
        const { x, y } = (0, utils_1.rotatePoint)(point, pivot, angle);
        expect(x).toEqual(-5);
        expect(y).toEqual(5);
    });
    it('should rotate one point round another by 180 degrees', () => {
        const point = { x: 5, y: 5 };
        const pivot = { x: 0, y: 0 };
        const angle = 180;
        const { x, y } = (0, utils_1.rotatePoint)(point, pivot, angle);
        expect(x).toBeCloseTo(-5);
        expect(y).toBeCloseTo(-5);
    });
    it('should not rotate if pivot and point are the same', () => {
        const point = { x: 10, y: 10 };
        const pivot = { x: 10, y: 10 };
        const angle = 221;
        const { x, y } = (0, utils_1.rotatePoint)(point, pivot, angle);
        expect(x).toEqual(10);
        expect(y).toEqual(10);
    });
    it('should rotate one point round another by 45 degrees', () => {
        const point = { x: 10, y: 10 };
        const pivot = { x: 5, y: 5 };
        const angle = 45;
        const { x, y } = (0, utils_1.rotatePoint)(point, pivot, angle);
        expect(x).toBeCloseTo(5);
        expect(y).toBeCloseTo(12.07);
    });
});
describe('convertForPdfLayoutProps', () => {
    it('should return correct value without rotation', () => {
        const schema = {
            type: 'image',
            content: '',
            width: 100,
            height: 100,
            position: { x: 100, y: 100 },
            rotate: 0,
            opacity: 1,
        };
        const pageHeight = 1000;
        const { position: { x, y }, height, width, rotate, opacity, } = (0, utils_1.convertForPdfLayoutProps)({ schema, pageHeight });
        expect(opacity).toEqual(schema.opacity);
        expect(height).toEqual((0, common_1.mm2pt)(schema.height));
        expect(width).toEqual((0, common_1.mm2pt)(schema.width));
        expect(x).toEqual((0, common_1.mm2pt)(schema.position.x));
        expect(y).toEqual(pageHeight - (0, common_1.mm2pt)(schema.position.y) - (0, common_1.mm2pt)(schema.height));
        expect(rotate).toEqual({ angle: 0, type: 'degrees' });
    });
    it('should return correct value with rotation', () => {
        const schema = {
            type: 'image',
            content: '',
            width: 50,
            height: 120,
            position: { x: 100, y: 100 },
            rotate: 90,
            opacity: 1,
        };
        const pageHeight = 1000;
        const { position: { x, y }, height, width, rotate, opacity, } = (0, utils_1.convertForPdfLayoutProps)({ schema, pageHeight });
        expect(opacity).toBeCloseTo(1);
        expect((0, common_1.pt2mm)(width)).toBeCloseTo(50);
        expect((0, common_1.pt2mm)(height)).toBeCloseTo(120.005);
        expect((0, common_1.pt2mm)(x)).toBeCloseTo(65.003);
        expect((0, common_1.pt2mm)(y)).toBeCloseTo(217.793);
        expect(rotate).toEqual({ angle: -90, type: 'degrees' });
    });
    it('should not rotate if asked not to', () => {
        const schema = {
            type: 'text',
            content: '',
            width: 50,
            height: 120,
            position: { x: 100, y: 100 },
            rotate: 90,
            opacity: 1,
        };
        const pageHeight = 1000;
        const { position: { x, y }, height, width, rotate, opacity, } = (0, utils_1.convertForPdfLayoutProps)({ schema, pageHeight, applyRotateTranslate: false });
        expect(opacity).toBeCloseTo(1);
        expect((0, common_1.pt2mm)(width)).toBeCloseTo(50);
        expect((0, common_1.pt2mm)(height)).toBeCloseTo(120.005);
        expect((0, common_1.pt2mm)(x)).toBeCloseTo(100);
        expect(Math.round((0, common_1.pt2mm)(y))).toEqual(Math.round((0, common_1.pt2mm)(1000) - 100 - 120));
        expect(rotate).toEqual({ angle: -90, type: 'degrees' });
    });
});
//# sourceMappingURL=utils.test.js.map