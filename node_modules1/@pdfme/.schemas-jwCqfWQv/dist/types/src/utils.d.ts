import { Schema, Mode, ColorType } from '@pdfme/common';
export declare const convertForPdfLayoutProps: ({ schema, pageHeight, applyRotateTranslate, }: {
    schema: Schema;
    pageHeight: number;
    applyRotateTranslate?: boolean | undefined;
}) => {
    position: {
        x: number;
        y: number;
    };
    height: number;
    width: number;
    rotate: import("@pdfme/pdf-lib").Degrees;
    opacity: number | undefined;
};
export declare const rotatePoint: (point: {
    x: number;
    y: number;
}, pivot: {
    x: number;
    y: number;
}, angleDegrees: number) => {
    x: number;
    y: number;
};
export declare const addAlphaToHex: (hex: string, alphaPercentage: number) => string;
export declare const isEditable: (mode: Mode, schema: Schema) => boolean;
export declare const hex2RgbColor: (hexString: string | undefined) => import("@pdfme/pdf-lib").RGB | undefined;
export declare const hex2CmykColor: (hexString: string | undefined) => import("@pdfme/pdf-lib").CMYK | undefined;
export declare const hex2PrintingColor: (hexString: string | undefined, colorType?: ColorType) => import("@pdfme/pdf-lib").RGB | import("@pdfme/pdf-lib").CMYK | undefined;
export declare const readFile: (input: File | FileList | null) => Promise<string | ArrayBuffer>;
export declare const createErrorElm: () => HTMLDivElement;
export declare const cloneDeep: <T>(value: T) => T;
