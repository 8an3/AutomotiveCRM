import { Template, Schema, BasePdf, CommonOptions } from '@pdfme/common';
export declare const modifyTemplateForTable: (arg: {
    template: Template;
    input: Record<string, string>;
    _cache: Map<any, any>;
    options: CommonOptions;
}) => Promise<Template>;
export declare const getDynamicHeightForTable: (value: string, args: {
    schema: Schema;
    basePdf: BasePdf;
    options: CommonOptions;
    _cache: Map<any, any>;
}) => Promise<number>;
