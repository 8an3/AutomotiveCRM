import { useRef } from "react";
import invariant from "tiny-invariant";
import { Form, useSubmit } from "@remix-run/react";

import { INTENTS, ItemMutationFields } from "./types";
import { SaveButton, CancelButton } from "./components";
import { Input } from "~/components/ui";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"

export function NewCardData({
  answerId,
  nextOrder,
  onComplete,
  onAddCardData,
}: {
  answerId: string;
  nextOrder: number;
  onComplete: () => void;
  onAddCardData: () => void;
}) {
  let textAreaRef = useRef<HTMLTextAreaElement>(null);
  let buttonRef = useRef<HTMLButtonElement>(null);
  let submit = useSubmit();

  return (
    <Form
      method="post"
      className="flex flex-col gap-2.5 p-2 pt-1"
      onSubmit={(event) => {
        event.preventDefault();

        let formData = new FormData(event.currentTarget);
        let id = crypto.randomUUID();
        formData.set(ItemMutationFields.id.name, id);

        submit(formData, {
          method: "post",
          fetcherKey: `card:${id}`,
          navigate: false,
          unstable_flushSync: true,
        });

        invariant(textAreaRef.current);
        textAreaRef.current.value = "";
        onAddCardData();
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          onComplete();
        }
      }}
    >
      <input type="hidden" name="intent" value={INTENTS.createItem} />
      <input
        type="hidden"
        name={ItemMutationFields.answerId.name}
        value={answerId}
      />
      <input
        type="hidden"
        name={ItemMutationFields.order.name}
        value={nextOrder}
      />
      <div className="grid gap-3 mx-3 mb-3">
        <div className="relative mt-3">
          <Input
            ref={textAreaRef}
            required
            name={ItemMutationFields.title.name}
            className="w-full bg-background border-border "
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                invariant(buttonRef.current, "expected button ref");
                buttonRef.current.click();
              }
              if (event.key === "Escape") {
                onComplete();
              }
            }}
          />

          <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Custom Valuew</label>
        </div>
      </div>
      <div className="flex justify-between">
        <CancelButton onClick={onComplete}>Cancel</CancelButton>
        <SaveButton ref={buttonRef}>Save</SaveButton>
      </div>
    </Form>
  );
}
