import React from 'react';
import type { IconButtonProps } from '../Button';
type Size = 'small' | 'medium' | 'large';
type A11yProps = {
    'aria-label': React.AriaAttributes['aria-label'];
    'aria-labelledby'?: undefined;
} | {
    'aria-label'?: undefined;
    'aria-labelledby': React.AriaAttributes['aria-labelledby'];
};
export type ActionBarProps = {
    size?: Size;
    children: React.ReactNode;
} & A11yProps;
export type ActionBarIconButtonProps = IconButtonProps;
export declare const ActionBar: React.FC<React.PropsWithChildren<ActionBarProps>>;
export declare const ActionBarIconButton: React.ForwardRefExoticComponent<IconButtonProps & React.RefAttributes<unknown>>;
export declare const VerticalDivider: () => React.JSX.Element;
export {};
//# sourceMappingURL=ActionBar.d.ts.map