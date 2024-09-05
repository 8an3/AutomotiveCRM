"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloneDeep = exports.createErrorElm = exports.readFile = exports.hex2PrintingColor = exports.hex2CmykColor = exports.hex2RgbColor = exports.isEditable = exports.addAlphaToHex = exports.rotatePoint = exports.convertForPdfLayoutProps = void 0;
const pdf_lib_1 = require("@pdfme/pdf-lib");
const common_1 = require("@pdfme/common");
const convertForPdfLayoutProps = ({ schema, pageHeight, applyRotateTranslate = true, }) => {
    const { width: mmWidth, height: mmHeight, position, rotate, opacity } = schema;
    const { x: mmX, y: mmY } = position;
    const rotateDegrees = rotate ? -rotate : 0;
    const width = (0, common_1.mm2pt)(mmWidth);
    const height = (0, common_1.mm2pt)(mmHeight);
    let x = (0, common_1.mm2pt)(mmX);
    // PDF coordinate system is from bottom left, UI is top left, so we need to flip the y axis
    let y = pageHeight - (0, common_1.mm2pt)(mmY) - height;
    if (rotateDegrees && applyRotateTranslate) {
        // If rotating we must pivot around the same point as the UI performs its rotation.
        // The UI performs rotation around the objects center point (the pivot point below),
        // pdflib rotates around the bottom left corner of the object.
        // We must therefore adjust the X and Y by rotating the bottom left corner by this pivot point.
        const pivotPoint = { x: x + width / 2, y: pageHeight - (0, common_1.mm2pt)(mmY) - height / 2 };
        const rotatedPoint = (0, exports.rotatePoint)({ x, y }, pivotPoint, rotateDegrees);
        x = rotatedPoint.x;
        y = rotatedPoint.y;
    }
    return {
        position: { x, y },
        height: height,
        width: width,
        rotate: (0, pdf_lib_1.degrees)(rotateDegrees),
        opacity,
    };
};
exports.convertForPdfLayoutProps = convertForPdfLayoutProps;
const rotatePoint = (point, pivot, angleDegrees) => {
    const angleRadians = (0, pdf_lib_1.degreesToRadians)(angleDegrees);
    const x = Math.cos(angleRadians) * (point.x - pivot.x) -
        Math.sin(angleRadians) * (point.y - pivot.y) +
        pivot.x;
    const y = Math.sin(angleRadians) * (point.x - pivot.x) +
        Math.cos(angleRadians) * (point.y - pivot.y) +
        pivot.y;
    return { x, y };
};
exports.rotatePoint = rotatePoint;
const addAlphaToHex = (hex, alphaPercentage) => {
    if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/i.test(hex)) {
        throw new Error('Invalid HEX color code');
    }
    const alphaValue = Math.round((alphaPercentage / 100) * 255);
    let alphaHex = alphaValue.toString(16);
    if (alphaHex.length === 1)
        alphaHex = '0' + alphaHex;
    return hex + alphaHex;
};
exports.addAlphaToHex = addAlphaToHex;
const isEditable = (mode, schema) => mode === 'designer' || (mode === 'form' && schema.readOnly !== true);
exports.isEditable = isEditable;
const hex2rgb = (hex) => {
    if (hex.slice(0, 1) === '#')
        hex = hex.slice(1);
    if (hex.length === 3)
        hex =
            hex.slice(0, 1) +
                hex.slice(0, 1) +
                hex.slice(1, 2) +
                hex.slice(1, 2) +
                hex.slice(2, 3) +
                hex.slice(2, 3);
    return [hex.slice(0, 2), hex.slice(2, 4), hex.slice(4, 6)].map((str) => parseInt(str, 16));
};
const hex2RgbColor = (hexString) => {
    if (hexString) {
        const isValid = (0, common_1.isHexValid)(hexString);
        if (!isValid) {
            throw new Error(`Invalid hex color value ${hexString}`);
        }
        const [r, g, b] = hex2rgb(hexString);
        return (0, pdf_lib_1.rgb)(r / 255, g / 255, b / 255);
    }
    return undefined;
};
exports.hex2RgbColor = hex2RgbColor;
const hex2CmykColor = (hexString) => {
    if (hexString) {
        const isValid = (0, common_1.isHexValid)(hexString);
        if (!isValid) {
            throw new Error(`Invalid hex color value ${hexString}`);
        }
        // Remove the # if it's present
        hexString = hexString.replace('#', '');
        // Extract the hexadecimal color code and the opacity
        const hexColor = hexString.substring(0, 6);
        const opacityColor = hexString.substring(6, 8);
        const opacity = opacityColor ? parseInt(opacityColor, 16) / 255 : 1;
        // Convert the hex values to decimal
        let r = parseInt(hexColor.substring(0, 2), 16) / 255;
        let g = parseInt(hexColor.substring(2, 4), 16) / 255;
        let b = parseInt(hexColor.substring(4, 6), 16) / 255;
        // Apply the opacity
        r = r * opacity + (1 - opacity);
        g = g * opacity + (1 - opacity);
        b = b * opacity + (1 - opacity);
        // Calculate the CMYK values
        const k = 1 - Math.max(r, g, b);
        const c = r === 0 ? 0 : (1 - r - k) / (1 - k);
        const m = g === 0 ? 0 : (1 - g - k) / (1 - k);
        const y = b === 0 ? 0 : (1 - b - k) / (1 - k);
        return (0, pdf_lib_1.cmyk)(c, m, y, k);
    }
    return undefined;
};
exports.hex2CmykColor = hex2CmykColor;
const hex2PrintingColor = (hexString, colorType) => {
    return colorType?.toLocaleLowerCase() == 'cmyk'
        ? (0, exports.hex2CmykColor)(hexString)
        : (0, exports.hex2RgbColor)(hexString);
};
exports.hex2PrintingColor = hex2PrintingColor;
const readFile = (input) => new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
        if (e.target?.result) {
            resolve(e.target.result);
        }
    };
    fileReader.onerror = (e) => {
        reject(new Error('[@pdfme/schemas] File reading failed'));
    };
    let file = null;
    if (input instanceof FileList && input.length > 0) {
        file = input[0];
    }
    else if (input instanceof File) {
        file = input;
    }
    if (file) {
        fileReader.readAsDataURL(file);
    }
    else {
        reject(new Error('[@pdfme/schemas] No files provided'));
    }
});
exports.readFile = readFile;
const createErrorElm = () => {
    const container = document.createElement('div');
    const containerStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
    };
    Object.assign(container.style, containerStyle);
    const span = document.createElement('span');
    const spanStyle = {
        color: 'white',
        background: 'red',
        padding: '0.25rem',
        fontSize: '12pt',
        fontWeight: 'bold',
        borderRadius: '2px',
        fontFamily: "'Open Sans', sans-serif",
    };
    Object.assign(span.style, spanStyle);
    span.textContent = 'ERROR';
    container.appendChild(span);
    return container;
};
exports.createErrorElm = createErrorElm;
const cloneDeep = (value) => JSON.parse(JSON.stringify(value));
exports.cloneDeep = cloneDeep;
//# sourceMappingURL=utils.js.map