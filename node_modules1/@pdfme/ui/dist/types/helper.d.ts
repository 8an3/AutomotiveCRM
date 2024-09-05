import { Template, BasePdf, SchemaForUI, Size, Plugins } from '@pdfme/common';
export declare const uuid: () => string;
export declare const set: <T extends object>(obj: T, path: string | string[], value: any) => void;
export declare const debounce: <T extends Function>(cb: T, wait?: number) => T;
export declare const round: (number: number, precision: number) => number;
export declare const cloneDeep: <T>(value: T) => T;
export declare const flatten: <T>(arr: T[][]) => T[];
declare const esc = "esc";
export declare const initShortCuts: (arg: {
    move: (command: 'up' | 'down' | 'left' | 'right', isShift: boolean) => void;
    remove: () => void;
    esc: () => void;
    copy: () => void;
    paste: () => void;
    redo: () => void;
    undo: () => void;
    save: () => void;
    selectAll: () => void;
}) => void;
export declare const destroyShortCuts: () => void;
export declare const getPdfPageSizes: (pdfBlob: Blob) => Promise<{
    height: number;
    width: number;
}[]>;
export declare const pdf2Pngs: (pdfBlob: Blob, width: number) => Promise<string[]>;
export declare const b64toBlob: (base64: string) => Blob;
export declare const template2SchemasList: (_template: Template) => Promise<{
    width: number;
    height: number;
    type: string;
    position: {
        x: number;
        y: number;
    };
    id: string;
    key: string;
    opacity?: number | undefined;
    rotate?: number | undefined;
    required?: boolean | undefined;
    content?: string | undefined;
    readOnly?: boolean | undefined;
}[][]>;
export declare const schemasList2template: (schemasList: SchemaForUI[][], basePdf: BasePdf) => Template;
export declare const getUniqSchemaKey: (arg: {
    copiedSchemaKey: string;
    schema: SchemaForUI[];
    stackUniqSchemaKeys: string[];
}) => string;
export declare const moveCommandToChangeSchemasArg: (props: {
    command: 'up' | 'down' | 'left' | 'right';
    activeSchemas: SchemaForUI[];
    isShift: boolean;
    pageSize: Size;
}) => {
    key: string;
    value: number;
    schemaId: string;
}[];
export declare const getPagesScrollTopByIndex: (pageSizes: Size[], index: number, scale: number) => number;
export declare const getSidebarContentHeight: (sidebarHeight: number) => number;
export declare const changeSchemas: (args: {
    objs: {
        key: string;
        value: any;
        schemaId: string;
    }[];
    schemas: SchemaForUI[];
    basePdf: BasePdf;
    pluginsRegistry: Plugins;
    pageSize: {
        width: number;
        height: number;
    };
    commitSchemas: (newSchemas: SchemaForUI[]) => void;
}) => void;
export {};
