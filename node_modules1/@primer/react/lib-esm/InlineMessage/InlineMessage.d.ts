import React from 'react';
type MessageVariant = 'critical' | 'success' | 'unavailable' | 'warning';
export type InlineMessageProps = React.ComponentPropsWithoutRef<'div'> & {
    /**
     * Specify the size of the InlineMessage
     */
    size?: 'small' | 'medium';
    /**
     * Specify the type of the InlineMessage
     */
    variant: MessageVariant;
};
export declare function InlineMessage({ children, size, variant, ...rest }: InlineMessageProps): React.JSX.Element;
export {};
//# sourceMappingURL=InlineMessage.d.ts.map