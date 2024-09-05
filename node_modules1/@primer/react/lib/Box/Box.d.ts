import type { BackgroundProps, BorderProps, ColorProps, FlexboxProps, GridProps, LayoutProps, PositionProps, ShadowProps, SpaceProps, TypographyProps } from 'styled-system';
import type { SxProp } from '../sx';
import type { ComponentProps } from '../utils/types';
type StyledBoxProps = SpaceProps & ColorProps & TypographyProps & LayoutProps & FlexboxProps & GridProps & BackgroundProps & BorderProps & PositionProps & ShadowProps & SxProp;
declare const Box: import("styled-components").StyledComponent<"div", any, StyledBoxProps, never>;
export type BoxProps = ComponentProps<typeof Box>;
export default Box;
//# sourceMappingURL=Box.d.ts.map