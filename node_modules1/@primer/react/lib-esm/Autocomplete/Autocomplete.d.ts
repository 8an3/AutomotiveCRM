import React from 'react';
import type { ComponentProps } from '../utils/types';
import AutocompleteMenu from './AutocompleteMenu';
import AutocompleteOverlay from './AutocompleteOverlay';
declare const Autocomplete: React.FC<React.PropsWithChildren<{
    id?: string;
}>>;
export type AutocompleteProps = ComponentProps<typeof Autocomplete>;
export type { AutocompleteInputProps } from './AutocompleteInput';
export type { AutocompleteMenuProps } from './AutocompleteMenu';
export type { AutocompleteOverlayProps } from './AutocompleteOverlay';
declare const _default: React.FC<React.PropsWithChildren<{
    id?: string | undefined;
}>> & {
    Context: React.Context<{
        activeDescendantRef: React.MutableRefObject<HTMLElement | null>;
        autocompleteSuggestion: string;
        id: string;
        inputRef: React.MutableRefObject<HTMLInputElement | null>;
        inputValue: string;
        isMenuDirectlyActivated: boolean;
        scrollContainerRef: React.MutableRefObject<HTMLElement | null>;
        selectedItemLength: number;
        setAutocompleteSuggestion: (value: string) => void;
        setInputValue: (value: string) => void;
        setIsMenuDirectlyActivated: (value: boolean) => void;
        setSelectedItemLength: (value: number) => void;
        setShowMenu: (value: boolean) => void;
        showMenu: boolean;
    } | null>;
    Input: import("../utils/polymorphic").ForwardRefComponent<import("../utils/polymorphic").ForwardRefComponent<"input", import("..").TextInputProps> & {
        Action: React.ForwardRefExoticComponent<Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "size" | "aria-label" | "tooltipDirection"> & {
            children?: React.ReactNode;
            "aria-label"?: string | undefined;
            tooltipDirection?: "s" | "nw" | "n" | "ne" | "e" | "se" | "sw" | "w" | undefined;
            icon?: React.FunctionComponent<React.PropsWithChildren<import("@primer/octicons-react").IconProps>> | undefined;
            variant?: import("../Button/types").VariantType | undefined;
        } & import("..").SxProp & React.RefAttributes<HTMLButtonElement>>;
    }, {
        as?: React.ComponentType<any> | undefined;
        openOnFocus?: boolean | undefined;
    }>;
    Menu: typeof AutocompleteMenu;
    Overlay: typeof AutocompleteOverlay;
};
export default _default;
//# sourceMappingURL=Autocomplete.d.ts.map