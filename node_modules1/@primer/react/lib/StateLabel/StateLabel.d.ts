import React from 'react';
import type { SxProp } from '../sx';
import type { ComponentProps } from '../utils/types';
declare const octiconMap: {
    issueOpened: import("@primer/octicons-react").Icon;
    pullOpened: import("@primer/octicons-react").Icon;
    issueClosed: import("@primer/octicons-react").Icon;
    issueClosedNotPlanned: import("@primer/octicons-react").Icon;
    pullClosed: import("@primer/octicons-react").Icon;
    pullMerged: import("@primer/octicons-react").Icon;
    draft: import("@primer/octicons-react").Icon;
    issueDraft: import("@primer/octicons-react").Icon;
    pullQueued: import("@primer/octicons-react").Icon;
    unavailable: import("@primer/octicons-react").Icon;
};
type StyledStateLabelBaseProps = {
    variant?: 'small' | 'normal';
    status: keyof typeof octiconMap;
} & SxProp;
declare const StateLabelBase: import("styled-components").StyledComponent<"span", any, StyledStateLabelBaseProps, never>;
export type StateLabelProps = ComponentProps<typeof StateLabelBase>;
declare function StateLabel({ children, status, variant: variantProp, ...rest }: StateLabelProps): React.JSX.Element;
export default StateLabel;
//# sourceMappingURL=StateLabel.d.ts.map