import React, { type FC } from 'react';
import type { IconProps } from '@primer/octicons-react';
import { type SxProp } from '../../sx';
import type { ForwardRefComponent as PolymorphicForwardRefComponent } from '../../utils/polymorphic';
export declare const GAP = 8;
export declare const StyledUnderlineWrapper: import("styled-components").StyledComponent<"div", any, SxProp, never>;
export declare const StyledUnderlineItemList: import("styled-components").StyledComponent<"ul", any, {}, never>;
export declare const StyledUnderlineItem: import("styled-components").StyledComponent<"div", any, SxProp, never>;
export declare const LoadingCounter: import("styled-components").StyledComponent<"span", any, {}, never>;
export type UnderlineItemProps = {
    as?: React.ElementType | 'a' | 'button';
    iconsVisible?: boolean;
    loadingCounters?: boolean;
    counter?: number | string;
    icon?: FC<IconProps> | React.ReactElement;
    id?: string;
} & SxProp;
export declare const UnderlineItem: PolymorphicForwardRefComponent<"a", UnderlineItemProps>;
//# sourceMappingURL=UnderlineTabbedInterface.d.ts.map