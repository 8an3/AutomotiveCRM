import React, { forwardRef, useState } from "react";
import { Button } from "~/components";
import { Eye, EyeOff } from "~/icons";
import { cn } from "~/components/ui/utils"
import { useField } from "remix-validated-form";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
}

const ZodInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ name, label, className, type, ...props }, ref) => {
    const { error, getInputProps } = useField(name);
    return (
      <>
        <input
          type={type}
          className={`flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
          ref={ref}
          {...getInputProps()}
          {...props}
        />
        {error && (
          <span className="my-error-class">{error}</span>
        )}
      </>
    );
  }
);
ZodInput.displayName = "Input";

export { ZodInput };
