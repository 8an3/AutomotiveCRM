import { Plugin, Schema } from '@pdfme/common';
interface SVGSchema extends Schema {
}
declare const svgSchema: Plugin<SVGSchema>;
export default svgSchema;
export declare const readOnlySvg: Plugin<SVGSchema>;
