import type { ForwardRefComponent as PolymorphicForwardRefComponent } from '../../utils/polymorphic';
import React from 'react';
import { type SxProp } from '../../sx';
import type { ComponentProps } from '../../utils/types';
declare const TabContainer: import("styled-components").StyledComponent<keyof React.JSX.IntrinsicElements | React.ComponentType<any>, any, any, any>;
type Label = {
    'aria-label': string;
    'aria-labelledby'?: never;
};
type Labelledby = {
    'aria-label'?: never;
    'aria-labelledby': string;
};
type Labelled = Label | Labelledby;
export type TabPanelsProps = ComponentProps<typeof TabContainer> & {
    id?: string;
} & Labelled;
declare function TabPanels({ children, defaultTabIndex, ...props }: TabPanelsProps): React.JSX.Element;
export type TabPanelsTabProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
    selected?: boolean;
} & SxProp;
export type TabPanelsPanelProps = React.HTMLAttributes<HTMLDivElement> & {
    children: React.ReactNode;
} & SxProp;
declare const _default: typeof TabPanels & {
    Panel: import("styled-components").StyledComponent<"div", any, TabPanelsPanelProps, never>;
    Tab: PolymorphicForwardRefComponent<"button", TabPanelsTabProps>;
};
export default _default;
//# sourceMappingURL=TabPanels.d.ts.map