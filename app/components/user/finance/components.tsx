import { useFetcher } from "@remix-run/react";
import { forwardRef, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { Button, Input } from "~/components/ui";

export let SaveButton = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>((props, ref) => {
  return (
    <button
      ref={ref}
      // this makes it so the button takes focus on clicks in safari I can't
      // remember if this is the proper workaround or not, it's been a while!
      // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#clicking_and_focus
      // https://bugs.webkit.org/show_bug.cgi?id=22261
      tabIndex={0}
      {...props}
      className="text-sm rounded-lg text-left p-2 font-medium text-white bg-brand-blue"
    />
  );
});

export let CancelButton = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>((props, ref) => {
  return (
    <Button
      ref={ref}
      type="button"
      tabIndex={0}
      {...props}
      className="text-sm rounded-[6px] text-left p-2 font-medium hover:bg-slate-200 focus:bg-slate-200"
    />
  );
});

export function EditableText({
  children,
  fieldName,
  value,
  inputClassName,
  inputLabel,
  buttonClassName,
  buttonLabel,
}: {
  children: React.ReactNode;
  fieldName: string;
  value: string;
  inputClassName: string;
  inputLabel: string;
  buttonClassName: string;
  buttonLabel: string;
}) {
  let fetcher = useFetcher();
  let [edit, setEdit] = useState(false);
  let inputRef = useRef<HTMLInputElement>(null);
  let buttonRef = useRef<HTMLButtonElement>(null);

  // optimistic update
  if (fetcher.formData?.has(fieldName)) {
    value = String(fetcher.formData.get("name"));
  }

  return edit ? (
    <fetcher.Form
      method="post"
      onSubmit={() => {
        flushSync(() => {
          setEdit(false);
        });
        buttonRef.current?.focus();
      }}
    >
      {children}
      <div className="grid gap-3 mx-3 mb-3">
        <div className="relative mt-3">
          <Input
            required
            ref={inputRef}
            type="text"
            aria-label={inputLabel}
            name={fieldName}
            defaultValue={value}
            className={`${inputClassName} w-full bg-background border-border`}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                flushSync(() => {
                  setEdit(false);
                });
                buttonRef.current?.focus();
              }
            }}
            onBlur={(event) => {
              if (
                inputRef.current?.value !== value &&
                inputRef.current?.value.trim() !== ""
              ) {
                fetcher.submit(event.currentTarget);
              }
              setEdit(false);
            }}
          />
          <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">{inputLabel}</label>
        </div>
      </div>

    </fetcher.Form>
  ) : (
    <button
      aria-label={buttonLabel}
      type="button"
      ref={buttonRef}
      onClick={() => {
        flushSync(() => {
          setEdit(true);
        });
        inputRef.current?.select();
      }}
      className={buttonClassName}
    >
      {value || <span className="text-slate-400 italic">Edit</span>}
    </button>
  );
}
