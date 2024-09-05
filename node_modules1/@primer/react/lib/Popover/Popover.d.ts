/// <reference types="hoist-non-react-statics" />
import type { SxProp } from '../sx';
import type { ComponentProps } from '../utils/types';
type CaretPosition = 'top' | 'bottom' | 'left' | 'right' | 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right' | 'left-bottom' | 'left-top' | 'right-bottom' | 'right-top';
type StyledPopoverProps = {
    caret?: CaretPosition;
    relative?: boolean;
    open?: boolean;
} & SxProp;
declare const Popover: import("styled-components").StyledComponent<"div", any, StyledPopoverProps, never>;
declare const PopoverContent: import("styled-components").StyledComponent<"div", any, SxProp, never>;
export type PopoverProps = ComponentProps<typeof Popover>;
export type PopoverContentProps = ComponentProps<typeof PopoverContent>;
declare const _default: string & import("styled-components").StyledComponentBase<"div", any, StyledPopoverProps, never> & import("hoist-non-react-statics").NonReactStatics<never, {}> & {
    Content: import("styled-components").StyledComponent<"div", any, SxProp, never>;
};
export default _default;
//# sourceMappingURL=Popover.d.ts.map