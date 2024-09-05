import React from 'react';
import type { ForwardRefComponent as PolymorphicForwardRefComponent } from '../utils/polymorphic';
import type { ComponentProps } from '../utils/types';
type InternalAutocompleteInputProps = {
    as?: React.ComponentType<React.PropsWithChildren<any>>;
    openOnFocus?: boolean;
};
declare const AutocompleteInput: PolymorphicForwardRefComponent<PolymorphicForwardRefComponent<"input", import("../TextInput").TextInputProps> & {
    Action: React.ForwardRefExoticComponent<Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "size" | "aria-label" | "tooltipDirection"> & {
        children?: React.ReactNode;
        "aria-label"?: string | undefined;
        tooltipDirection?: "s" | "nw" | "n" | "ne" | "e" | "se" | "sw" | "w" | undefined;
        icon?: React.FunctionComponent<React.PropsWithChildren<import("@primer/octicons-react").IconProps>> | undefined;
        variant?: import("../Button/types").VariantType | undefined;
    } & import("..").SxProp & React.RefAttributes<HTMLButtonElement>>;
}, InternalAutocompleteInputProps>;
export type AutocompleteInputProps = ComponentProps<typeof AutocompleteInput>;
export default AutocompleteInput;
//# sourceMappingURL=AutocompleteInput.d.ts.map