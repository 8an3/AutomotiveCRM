import React, { forwardRef, useState } from "react";
import { Button } from "~/components";
import { Eye, EyeOff } from "~/icons";
import { cn } from "~/components/ui/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> { }


const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"
export { Input }

export function InputPassword({
  type = "password",
  placeholder = "Enter password",
  className,
  ...props
}: InputProps) {
  const [isShown, setIsShown] = useState<boolean>(false);

  function handleClick() {
    setIsShown(!isShown);
  }

  return (
    <div className="relative">
      <Input
        data-component="input-password"
        type={isShown ? "text" : "password"}
        placeholder={placeholder}
        {...props}
      />
      <Button
        type="button"
        size="xs"
        variant="subtle"
        onClick={handleClick}
        className={cn(
          "height-[inherit] absolute inset-y-0 right-0 my-2 me-2 font-mono"
        )}
      >
        {isShown ? <EyeOff className="size-xs" /> : <Eye className="size-xs" />}
        <span>{isShown ? "Hide" : "Show"}</span>
      </Button>
    </div>
  );
}
