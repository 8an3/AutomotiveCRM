import { UIRenderProps } from '@pdfme/common';
import type { TextSchema } from './types';
export declare const uiRender: (arg: UIRenderProps<TextSchema>) => Promise<void>;
export declare const buildStyledTextContainer: (arg: UIRenderProps<TextSchema>, value: string) => Promise<HTMLDivElement>;
/**
 * Firefox doesn't support 'plaintext-only' contentEditable mode, which we want to avoid mark-up.
 * This function adds a workaround for Firefox to make the contentEditable element behave like 'plaintext-only'.
 */
export declare const makeElementPlainTextContentEditable: (element: HTMLElement) => void;
