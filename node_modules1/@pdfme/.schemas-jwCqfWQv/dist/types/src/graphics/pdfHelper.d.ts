import { UIRenderProps } from '@pdfme/common';
import { ImageSchema } from './image';
export declare function isPdf(content: string): boolean;
/**
 * convert pdf to blob image url
 * @param content
 */
export declare const pdfToImage: ({ schema, value, _cache, pdfJs, }: UIRenderProps<ImageSchema>) => Promise<string>;
