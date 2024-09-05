import React from 'react';
import type { SxProp } from '../sx';
export type UnderlineNavProps = {
    children: React.ReactNode;
    'aria-label'?: React.AriaAttributes['aria-label'];
    as?: React.ElementType;
    sx?: SxProp['sx'];
    /**
     * loading state for all counters. It displays loading animation for individual counters (UnderlineNav.Item) until all are resolved. It is needed to prevent multiple layout shift.
     */
    loadingCounters?: boolean;
};
export declare const MORE_BTN_WIDTH = 86;
export declare const NavigationList: import("styled-components").StyledComponent<"ul", any, SxProp, never>;
export declare const MoreMenuListItem: import("styled-components").StyledComponent<"li", any, {}, never>;
export declare const getValidChildren: (children: React.ReactNode) => React.ReactElement<any, string | React.JSXElementConstructor<any>>[];
export declare const UnderlineNav: React.ForwardRefExoticComponent<UnderlineNavProps & React.RefAttributes<unknown>>;
//# sourceMappingURL=UnderlineNav.d.ts.map