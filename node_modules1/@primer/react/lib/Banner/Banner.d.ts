import React from 'react';
import { Button } from '../Button';
type BannerVariant = 'critical' | 'info' | 'success' | 'upsell' | 'warning';
export type BannerProps = React.ComponentPropsWithoutRef<'section'> & {
    /**
     * Provide an optional label to override the default name for the Banner
     * landmark region
     */
    'aria-label'?: string;
    /**
     * Provide an optional description for the Banner. This should provide
     * supplemental information about the Banner
     */
    description?: React.ReactNode;
    /**
     * Specify whether the title of the Banner should be visible or not.
     */
    hideTitle?: boolean;
    /**
     * Provide an icon for the banner.
     * Note: Only `variant="info"` banners should use custom icons
     */
    icon?: React.ReactNode;
    /**
     * Optionally provide a handler to be called when the banner is dismissed.
     * Providing this prop will show a dismiss button.
     *
     * Note: This is not available for critical banners.
     */
    onDismiss?: () => void;
    /**
     * Provide an optional primary action for the Banner.
     */
    primaryAction?: React.ReactNode;
    /**
     * Provide an optional secondary action for the Banner
     */
    secondaryAction?: React.ReactNode;
    /**
     * The title for the Banner. This will be used as the accessible name and is
     * required unless `Banner.Title` is used as a child.
     */
    title?: React.ReactNode;
    /**
     * Specify the type of the Banner
     */
    variant?: BannerVariant;
};
export declare const Banner: React.ForwardRefExoticComponent<Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>, "ref"> & {
    /**
     * Provide an optional label to override the default name for the Banner
     * landmark region
     */
    'aria-label'?: string | undefined;
    /**
     * Provide an optional description for the Banner. This should provide
     * supplemental information about the Banner
     */
    description?: React.ReactNode;
    /**
     * Specify whether the title of the Banner should be visible or not.
     */
    hideTitle?: boolean | undefined;
    /**
     * Provide an icon for the banner.
     * Note: Only `variant="info"` banners should use custom icons
     */
    icon?: React.ReactNode;
    /**
     * Optionally provide a handler to be called when the banner is dismissed.
     * Providing this prop will show a dismiss button.
     *
     * Note: This is not available for critical banners.
     */
    onDismiss?: (() => void) | undefined;
    /**
     * Provide an optional primary action for the Banner.
     */
    primaryAction?: React.ReactNode;
    /**
     * Provide an optional secondary action for the Banner
     */
    secondaryAction?: React.ReactNode;
    /**
     * The title for the Banner. This will be used as the accessible name and is
     * required unless `Banner.Title` is used as a child.
     */
    title?: React.ReactNode;
    /**
     * Specify the type of the Banner
     */
    variant?: BannerVariant | undefined;
} & React.RefAttributes<HTMLElement>>;
type HeadingElement = 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
export type BannerTitleProps<As extends HeadingElement> = {
    as?: As;
    className?: string;
} & React.ComponentPropsWithoutRef<As extends 'h2' ? 'h2' : As>;
export declare function BannerTitle<As extends HeadingElement>(props: BannerTitleProps<As>): React.JSX.Element;
export type BannerDescriptionProps = React.ComponentPropsWithoutRef<'div'>;
export declare function BannerDescription({ children, className, ...rest }: BannerDescriptionProps): React.JSX.Element;
export type BannerActionsProps = {
    primaryAction?: React.ReactNode;
    secondaryAction?: React.ReactNode;
};
export declare function BannerActions({ primaryAction, secondaryAction }: BannerActionsProps): React.JSX.Element;
export type BannerPrimaryActionProps = Omit<React.ComponentPropsWithoutRef<typeof Button>, 'variant'>;
export declare function BannerPrimaryAction({ children, className, ...rest }: BannerPrimaryActionProps): React.JSX.Element;
export type BannerSecondaryActionProps = Omit<React.ComponentPropsWithoutRef<typeof Button>, 'variant'>;
export declare function BannerSecondaryAction({ children, className, ...rest }: BannerSecondaryActionProps): React.JSX.Element;
export {};
//# sourceMappingURL=Banner.d.ts.map