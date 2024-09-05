import type React from 'react';
import { type SxProp } from '../../sx';
type SkeletonBoxProps = {
    /** Height of the skeleton "box". Accepts any valid CSS `height` value. */
    height?: React.CSSProperties['height'];
    /** Width of the skeleton "box". Accepts any valid CSS `width` value. */
    width?: React.CSSProperties['width'];
} & SxProp;
export declare const SkeletonBox: import("styled-components").StyledComponent<"div", any, SkeletonBoxProps, never>;
export {};
//# sourceMappingURL=SkeletonBox.d.ts.map