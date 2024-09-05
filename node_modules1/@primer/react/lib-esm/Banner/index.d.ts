/// <reference types="react" />
import { BannerTitle, BannerDescription, BannerPrimaryAction, BannerSecondaryAction } from './Banner';
import type { BannerProps, BannerTitleProps, BannerDescriptionProps, BannerPrimaryActionProps, BannerSecondaryActionProps } from './Banner';
export declare const Banner: import("react").ForwardRefExoticComponent<Omit<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLElement>, HTMLElement>, "ref"> & {
    'aria-label'?: string | undefined;
    description?: import("react").ReactNode;
    hideTitle?: boolean | undefined;
    icon?: import("react").ReactNode;
    onDismiss?: (() => void) | undefined;
    primaryAction?: import("react").ReactNode;
    secondaryAction?: import("react").ReactNode;
    title?: import("react").ReactNode;
    variant?: ("success" | "warning" | "critical" | "info" | "upsell") | undefined;
} & import("react").RefAttributes<HTMLElement>> & {
    Title: typeof BannerTitle;
    Description: typeof BannerDescription;
    PrimaryAction: typeof BannerPrimaryAction;
    SecondaryAction: typeof BannerSecondaryAction;
};
export type { BannerProps, BannerTitleProps, BannerDescriptionProps, BannerPrimaryActionProps, BannerSecondaryActionProps, };
//# sourceMappingURL=index.d.ts.map