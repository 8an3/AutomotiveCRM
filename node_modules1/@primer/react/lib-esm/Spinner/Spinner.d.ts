import React from 'react';
import { type SxProp } from '../sx';
import type { HTMLDataAttributes } from '../internal/internal-types';
declare const sizeMap: {
    small: string;
    medium: string;
    large: string;
};
export type SpinnerProps = {
    /** Sets the width and height of the spinner. */
    size?: keyof typeof sizeMap;
    /** Sets the text conveyed by assistive technologies such as screen readers. Set to `null` if the loading state is displayed in a text node somewhere else on the page. */
    srText?: string | null;
    /** @deprecated Use `srText` instead. */
    'aria-label'?: string;
} & HTMLDataAttributes & SxProp;
declare function Spinner({ size: sizeKey, srText, 'aria-label': ariaLabel, ...props }: SpinnerProps): React.JSX.Element;
declare const StyledSpinner: import("styled-components").StyledComponent<typeof Spinner, any, {}, never>;
export default StyledSpinner;
//# sourceMappingURL=Spinner.d.ts.map