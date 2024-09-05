import { Schema, BasePdf, CommonOptions } from '@pdfme/common';
import { Table } from './classes';
interface CreateTableArgs {
    schema: Schema;
    basePdf: BasePdf;
    options: CommonOptions;
    _cache: Map<any, any>;
}
export declare function createSingleTable(body: string[][], args: CreateTableArgs): Promise<Table>;
export declare function createMultiTables(body: string[][], args: CreateTableArgs): Promise<Table[]>;
export {};
