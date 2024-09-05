/// <reference types="hoist-non-react-statics" />
/// <reference types="react" />
import type { SxProp } from '../sx';
import type { ComponentProps } from '../utils/types';
declare const variantSizes: {
    small: number;
    medium: number;
    large: number;
};
type StyledCircleBadgeProps = {
    inline?: boolean;
    variant?: keyof typeof variantSizes;
    size?: number;
} & SxProp;
declare const CircleBadge: import("styled-components").StyledComponent<"div", any, StyledCircleBadgeProps, never>;
declare const CircleBadgeIcon: import("styled-components").StyledComponent<import("react").ForwardRefExoticComponent<{
    icon: import("react").ElementType<any, keyof import("react").JSX.IntrinsicElements>;
    color?: string | undefined;
} & import("@primer/octicons-react").IconProps & import("react").RefAttributes<SVGSVGElement>>, any, SxProp, never>;
export type CircleBadgeProps = ComponentProps<typeof CircleBadge>;
export type CircleBadgeIconProps = ComponentProps<typeof CircleBadgeIcon>;
declare const _default: string & import("styled-components").StyledComponentBase<"div", any, StyledCircleBadgeProps, never> & import("hoist-non-react-statics").NonReactStatics<never, {}> & {
    Icon: import("styled-components").StyledComponent<import("react").ForwardRefExoticComponent<{
        icon: import("react").ElementType<any, keyof import("react").JSX.IntrinsicElements>;
        color?: string | undefined;
    } & import("@primer/octicons-react").IconProps & import("react").RefAttributes<SVGSVGElement>>, any, SxProp, never>;
};
export default _default;
//# sourceMappingURL=CircleBadge.d.ts.map