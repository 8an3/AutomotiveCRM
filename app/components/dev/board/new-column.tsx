import { useState, useRef } from "react";
import { flushSync } from "react-dom";
import invariant from "tiny-invariant";
import { Form, useSubmit } from "@remix-run/react";

import { INTENTS } from "./types";
import { CancelButton, SaveButton } from "./components";
import { Button } from "~/components/ui";
import { Plus } from "lucide-react";

export function NewColumn({
  boardId,
  onAdd,
  editInitially,
}: {
  boardId: number;
  onAdd: () => void;
  editInitially: boolean;
}) {
  let [editing, setEditing] = useState(editInitially);
  let inputRef = useRef<HTMLInputElement>(null);
  let submit = useSubmit();

  return editing ? (
    <Form
      method="post"
      navigate={false}
      className="p-2 flex-shrink-0 flex flex-col gap-5 overflow-hidden max-h-full w-[250px] border rounded-[6px] shadow bg-background"
      onSubmit={(event) => {
        event.preventDefault();
        let formData = new FormData(event.currentTarget);
        formData.set("id", crypto.randomUUID());
        submit(formData, {
          navigate: false,
          method: "post",
          unstable_flushSync: true,
        });
        onAdd();
        invariant(inputRef.current, "missing input ref");
        inputRef.current.value = "";
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setEditing(false);
        }
      }}
    >
      <input type="hidden" name="intent" value={INTENTS.createColumn} />
      <input type="hidden" name="boardId" value={boardId} />
      <input
        autoFocus
        required
        ref={inputRef}
        type="text"
        name="name"
        className="border border-slate-400 w-full rounded-lg py-1 px-2 font-medium text-white"
      />
      <div className="flex justify-between">
        <SaveButton>Save Column</SaveButton>
        <CancelButton onClick={() => setEditing(false)}>Cancel</CancelButton>
      </div>
    </Form>
  ) : (
    <Button
      onClick={() => {
        flushSync(() => {
          setEditing(true);
        });
        onAdd();
      }}
      size='icon'
      variant='outline'
      aria-label="Add new column"
      className="flex-shrink-0 flex justify-center  bg-primary hover:bg-white bg-opacity-10 hover:bg-opacity-5 rounded-[6px]"
    >
      <Plus color="#fcfcfc" />
    </Button>
  );
}
