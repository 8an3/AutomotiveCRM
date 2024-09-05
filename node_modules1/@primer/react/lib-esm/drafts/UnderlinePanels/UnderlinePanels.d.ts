import React, { type FC, type PropsWithChildren } from 'react';
import { type BoxProps } from '../../Box';
import type { IconProps } from '@primer/octicons-react';
import { type SxProp } from '../../sx';
export type UnderlinePanelsProps = {
    /**
     * Tabs (UnderlinePanels.Tab) and panels (UnderlinePanels.Panel) to render
     */
    children: React.ReactNode;
    /**
     * Accessible name for the tab list
     */
    'aria-label'?: React.AriaAttributes['aria-label'];
    /**
     * ID of the element containing the name for the tab list
     */
    'aria-labelledby'?: React.AriaAttributes['aria-labelledby'];
    /**
     * Custom string to use when generating the IDs of tabs and `aria-labelledby` for the panels
     */
    id?: string;
    /**
     * Loading state for all counters. It displays loading animation for individual counters until all are resolved. It is needed to prevent multiple layout shift.
     */
    loadingCounters?: boolean;
} & SxProp;
export type TabProps = PropsWithChildren<{
    /**
     * Whether this is the selected tab
     */
    'aria-selected'?: boolean;
    /**
     * Content of CounterLabel rendered after tab text label
     */
    counter?: number | string;
    /**
     *  Icon rendered before the tab text label
     */
    icon?: FC<IconProps>;
}> & SxProp;
export type PanelProps = Omit<BoxProps, 'as'>;
declare const _default: React.FC<UnderlinePanelsProps> & {
    Panel: React.FC<PanelProps>;
    Tab: React.FC<TabProps>;
};
export default _default;
//# sourceMappingURL=UnderlinePanels.d.ts.map