"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBarCode = exports.mapHexColorForBwipJsLib = exports.barCodeType2Bcid = exports.validateBarcodeInput = void 0;
const common_1 = require("@pdfme/common");
const bwip_js_1 = __importDefault(require("bwip-js"));
const constants_js_1 = require("./constants.js");
// GTIN-13, GTIN-8, GTIN-12, GTIN-14
const validateCheckDigit = (input, checkDigitPos) => {
    let passCheckDigit = true;
    if (input.length === checkDigitPos) {
        const ds = input.slice(0, -1).replace(/[^0-9]/g, '');
        let sum = 0;
        let odd = 1;
        for (let i = ds.length - 1; i > -1; i -= 1) {
            sum += Number(ds[i]) * (odd ? 3 : 1);
            odd ^= 1;
            if (sum > 0xffffffffffff) {
                // ~2^48 at max
                sum %= 10;
            }
        }
        passCheckDigit = String(10 - (sum % 10)).slice(-1) === input.slice(-1);
    }
    return passCheckDigit;
};
const validateBarcodeInput = (type, input) => {
    if (!input)
        return false;
    if (!constants_js_1.BARCODE_TYPES.includes(type))
        return false;
    if (type === 'qrcode') {
        // 500文字以下
        return input.length < 500;
    }
    if (type === 'japanpost') {
        // 郵便番号は数字(0-9)のみ。住所表示番号は英数字(0-9,A-Z)とハイフン(-)が使用可能です。
        const regexp = /^(\d{7})(\d|[A-Z]|-)+$/;
        return regexp.test(input);
    }
    if (type === 'ean13') {
        // 有効文字は数値(0-9)のみ。チェックデジットを含まない12桁orチェックデジットを含む13桁。
        const regexp = /^\d{12}$|^\d{13}$/;
        return regexp.test(input) && validateCheckDigit(input, 13);
    }
    if (type === 'ean8') {
        // 有効文字は数値(0-9)のみ。チェックデジットを含まない7桁orチェックデジットを含む8桁。
        const regexp = /^\d{7}$|^\d{8}$/;
        return regexp.test(input) && validateCheckDigit(input, 8);
    }
    if (type === 'code39') {
        // 有効文字は数字(0-9)。アルファベット大文字(A-Z)、記号(-.$/+%)、半角スペース。
        const regexp = /^(\d|[A-Z]|\-|\.|\$|\/|\+|\%|\s)+$/;
        return regexp.test(input);
    }
    if (type === 'code128') {
        // 有効文字は漢字、ひらがな、カタカナ以外。
        // https://qiita.com/graminume/items/2ac8dd9c32277fa9da64
        return !input.match(/([\u30a0-\u30ff\u3040-\u309f\u3005-\u3006\u30e0-\u9fcf]|[Ａ-Ｚａ-ｚ０-９！＂＃＄％＆＇（）＊＋，－．／：；＜＝＞？＠［＼］＾＿｀｛｜｝〜　])+/);
    }
    if (type === 'nw7') {
        // 有効文字はNW-7は数字(0-9)と記号(-.$:/+)。
        // スタートコード／ストップコードとして、コードの始まりと終わりはアルファベット(A-D)のいずれかを使用してください。
        const regexp = /^[A-Da-d]([0-9\-\.\$\:\/\+])+[A-Da-d]$/;
        return regexp.test(input);
    }
    if (type === 'itf14') {
        // 有効文字は数値(0-9)のみ。 チェックデジットを含まない13桁orチェックデジットを含む14桁。
        const regexp = /^\d{13}$|^\d{14}$/;
        return regexp.test(input) && validateCheckDigit(input, 14);
    }
    if (type === 'upca') {
        // 有効文字は数値(0-9)のみ。 チェックデジットを含まない11桁orチェックデジットを含む12桁。
        const regexp = /^\d{11}$|^\d{12}$/;
        return regexp.test(input) && validateCheckDigit(input, 12);
    }
    if (type === 'upce') {
        // 有効文字は数値(0-9)のみ。 1桁目に指定できる数字(ナンバーシステムキャラクタ)は0のみ。
        // チェックデジットを含まない7桁orチェックデジットを含む8桁。
        const regexp = /^0(\d{6}$|\d{7}$)/;
        return regexp.test(input) && validateCheckDigit(input, 8);
    }
    if (type === 'gs1datamatrix') {
        let ret = false;
        // find the GTIN application identifier, regex for "(01)" and the digits after it until another "("
        const regexp = /\((01)\)(\d*)(\(|$)/;
        let res = input.match(regexp);
        if (res != null &&
            input.length <= 52 && // 52 is the max length of a GS1 DataMatrix barcode before bwip-js throws an error
            res[1] === '01' &&
            (res[2].length === 14 || res[2].length === 8 || res[2].length === 12 || res[2].length === 13)) {
            let gtin = res[2];
            ret = validateCheckDigit(gtin, gtin.length);
        }
        return ret;
    }
    return false;
};
exports.validateBarcodeInput = validateBarcodeInput;
/**
 * The bwip.js lib has a different name for nw7 type barcodes
 */
const barCodeType2Bcid = (type) => type === 'nw7' ? 'rationalizedCodabar' : type;
exports.barCodeType2Bcid = barCodeType2Bcid;
/**
 *  Strip hash from the beginning of HTML hex color codes for the bwip.js lib
 */
const mapHexColorForBwipJsLib = (color, fallback) => color ? color.replace('#', '') : fallback ? fallback.replace('#', '') : '000000';
exports.mapHexColorForBwipJsLib = mapHexColorForBwipJsLib;
const createBarCode = async (arg) => {
    const { type, input, width, height, backgroundColor, barColor, textColor, includetext = constants_js_1.DEFAULT_BARCODE_INCLUDETEXT, } = arg;
    const bcid = (0, exports.barCodeType2Bcid)(type);
    const scale = 5;
    const bwipjsArg = { bcid, text: input, width, height, scale, includetext, textxalign: 'center' };
    if (backgroundColor)
        bwipjsArg.backgroundcolor = (0, exports.mapHexColorForBwipJsLib)(backgroundColor);
    if (barColor)
        bwipjsArg.barcolor = (0, exports.mapHexColorForBwipJsLib)(barColor);
    if (textColor)
        bwipjsArg.textcolor = (0, exports.mapHexColorForBwipJsLib)(textColor);
    let res;
    if (typeof window !== 'undefined') {
        const canvas = document.createElement('canvas');
        // @ts-ignore
        bwip_js_1.default.toCanvas(canvas, bwipjsArg);
        const dataUrl = canvas.toDataURL('image/png');
        res = (0, common_1.b64toUint8Array)(dataUrl).buffer;
    }
    else {
        res = await bwip_js_1.default.toBuffer(bwipjsArg);
    }
    return res;
};
exports.createBarCode = createBarCode;
//# sourceMappingURL=helper.js.map