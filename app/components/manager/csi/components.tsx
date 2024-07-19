import { Form, useFetcher, useSubmit } from "@remix-run/react";
import { forwardRef, useEffect, useRef, useState } from "react";
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
      <Input
        required
        ref={inputRef}
        type="text"
        aria-label={inputLabel}
        name={fieldName}
        defaultValue={value}
        className={`w-full bg-background border border-border text-foreground rounded-[6px] ${inputClassName}`}
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
      className={`cursor-pointer ${buttonClassName}`}
    >
      {value || <span className="text-foreground italic ">Edit</span>}
    </button>
  );
}


export function EditableTextManual({
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

  const submit = useSubmit()
  let formRef = useRef<HTMLFormElement>(null);
  let taskInputRef = useRef<HTMLInputElement>(null);

  // optimistic update
  if (fetcher.formData?.has(fieldName)) {
    value = String(fetcher.formData.get("name"));
  }

  const handleBlur = () => {
    if (inputRef.current?.value !== value && inputRef.current?.value.trim() !== "") {
      const formData = new FormData();
      formData.append(fieldName, value);
      submit(formData, { method: 'post', preventScrollReset: true });
    }
    flushSync(() => {
      setEdit(false);
    });
    buttonRef.current?.focus();

  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append(fieldName, event.target.value);
    fetcher.submit(formData, { method: 'post' });
    flushSync(() => {
      setEdit(false);
    });
    buttonRef.current?.focus();
  };

  return edit ? (
    <fetcher.Form method='post' onSubmit={handleSubmit}>
      {children}
      <Input
        required
        ref={inputRef}
        type="text"
        aria-label={inputLabel}
        name={fieldName}
        defaultValue={value}
        className={`w-full bg-background border border-border text-foreground rounded-[6px] ${inputClassName}`}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            flushSync(() => {
              setEdit(false);
            });
            buttonRef.current?.focus();
          }
        }}
        onBlur={handleBlur}

      />
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
      className={`cursor-pointer ${buttonClassName}`}
    >
      {value || <span className="text-foreground italic ">Edit</span>}
    </button>
  );
}
