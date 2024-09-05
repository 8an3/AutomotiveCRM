import type { Plugin } from '@pdfme/common';
import type { Schema } from '@pdfme/common';
export interface ImageSchema extends Schema {
}
declare const imageSchema: Plugin<ImageSchema>;
export default imageSchema;
export declare const readOnlyImage: Plugin<ImageSchema>;
