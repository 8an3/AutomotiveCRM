/// <reference types="hoist-non-react-statics" />
import type { Location, Pathname } from 'history';
import type { SxProp } from '../sx';
import type { ComponentProps } from '../utils/types';
type StyledHeaderItemProps = {
    full?: boolean;
} & SxProp;
type StyledHeaderLinkProps = {
    to?: Location | Pathname;
} & SxProp;
declare const Header: import("styled-components").StyledComponent<"header", any, SxProp, never>;
declare const HeaderItem: import("styled-components").StyledComponent<"div", any, StyledHeaderItemProps, never>;
declare const HeaderLink: import("styled-components").StyledComponent<"a", any, StyledHeaderLinkProps, never>;
export type HeaderProps = ComponentProps<typeof Header>;
export type HeaderLinkProps = ComponentProps<typeof HeaderLink>;
export type HeaderItemProps = ComponentProps<typeof HeaderItem>;
declare const _default: string & import("styled-components").StyledComponentBase<"header", any, SxProp, never> & import("hoist-non-react-statics").NonReactStatics<never, {}> & {
    Link: import("styled-components").StyledComponent<"a", any, StyledHeaderLinkProps, never>;
    Item: import("styled-components").StyledComponent<"div", any, StyledHeaderItemProps, never>;
};
export default _default;
//# sourceMappingURL=Header.d.ts.map