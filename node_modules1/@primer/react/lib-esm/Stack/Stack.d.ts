import React, { type ElementType } from 'react';
import type { ResponsiveValue } from '../hooks/useResponsiveValue';
type GapScale = 'none' | 'condensed' | 'normal' | 'spacious';
type Gap = GapScale | ResponsiveValue<GapScale>;
type DirectionScale = 'horizontal' | 'vertical';
type Direction = DirectionScale | ResponsiveValue<DirectionScale>;
type AlignScale = 'stretch' | 'start' | 'center' | 'end' | 'baseline';
type Align = AlignScale | ResponsiveValue<AlignScale>;
type WrapScale = 'wrap' | 'nowrap';
type Wrap = WrapScale | ResponsiveValue<WrapScale>;
type JustifyScale = 'start' | 'center' | 'end' | 'space-between' | 'space-evenly';
type Justify = JustifyScale | ResponsiveValue<JustifyScale>;
type PaddingScale = 'none' | 'condensed' | 'normal' | 'spacious';
type Padding = PaddingScale | ResponsiveValue<PaddingScale>;
type StackProps<As> = React.PropsWithChildren<{
    /**
     * Customize the element type of the rendered container
     */
    as?: As;
    /**
     * Specify the gap between children elements in the stack
     */
    gap?: Gap;
    /**
     * Specify the direction for the stack container
     * @default vertical
     */
    direction?: Direction;
    /**
     * Specify the alignment between items in the cross-axis of the direction
     * @default stretch
     */
    align?: Align;
    /**
     * Specify whether items are forced onto one line or can wrap onto multiple lines
     * @default nowrap
     */
    wrap?: Wrap;
    /**
     * Specify how items will be distributed in the stacking direction
     * @default start
     */
    justify?: Justify;
    /**
     * Specify the padding of the stack container
     * @default none
     */
    padding?: Padding;
}>;
declare function Stack<As extends ElementType>({ as, children, align, direction, gap, justify, padding, wrap, ...rest }: StackProps<As> & React.ComponentPropsWithoutRef<ElementType extends As ? As : 'div'>): React.JSX.Element;
type StackItemProps<As> = React.PropsWithChildren<{
    /**
     * Customize the element type of the rendered container
     */
    as?: As;
    /**
     * Allow item to keep size or expand to fill the available space
     * @default false
     */
    grow?: boolean | ResponsiveValue<boolean>;
}>;
declare function StackItem<As extends ElementType>({ as, children, grow, ...rest }: StackItemProps<As> & React.ComponentPropsWithoutRef<ElementType extends As ? As : 'div'>): React.JSX.Element;
export { Stack, StackItem };
export type { StackProps, StackItemProps };
//# sourceMappingURL=Stack.d.ts.map