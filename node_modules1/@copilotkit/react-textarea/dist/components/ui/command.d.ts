import * as React from 'react';
import { DialogProps } from '@radix-ui/react-dialog';

declare const Command: React.ForwardRefExoticComponent<Omit<{
    children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement> & {
    label?: string | undefined;
    shouldFilter?: boolean | undefined;
    filter?: ((value: string, search: string) => number) | undefined;
    value?: string | undefined;
    onValueChange?: ((value: string) => void) | undefined;
    loop?: boolean | undefined;
} & React.RefAttributes<HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
interface CommandDialogProps extends DialogProps {
}
declare const CommandDialog: ({ children, ...props }: CommandDialogProps) => JSX.Element;
declare const CommandInput: React.ForwardRefExoticComponent<Omit<Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value" | "type"> & {
    value?: string | undefined;
    onValueChange?: ((search: string) => void) | undefined;
} & React.RefAttributes<HTMLInputElement>, "ref"> & React.RefAttributes<HTMLInputElement>>;
declare const CommandList: React.ForwardRefExoticComponent<Omit<{
    children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
declare const CommandEmpty: React.ForwardRefExoticComponent<Omit<{
    children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
declare const CommandGroup: React.ForwardRefExoticComponent<Omit<{
    children?: React.ReactNode;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "value" | "heading"> & {
    heading?: React.ReactNode;
    value?: string | undefined;
} & React.RefAttributes<HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
declare const CommandSeparator: React.ForwardRefExoticComponent<Omit<React.HTMLAttributes<HTMLDivElement> & {
    alwaysRender?: boolean | undefined;
} & React.RefAttributes<HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
declare const CommandItem: React.ForwardRefExoticComponent<Omit<{
    children?: React.ReactNode;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "disabled" | "value" | "onSelect"> & {
    disabled?: boolean | undefined;
    onSelect?: ((value: string) => void) | undefined;
    value?: string | undefined;
} & React.RefAttributes<HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
declare const CommandShortcut: {
    ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>): JSX.Element;
    displayName: string;
};

export { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut };
