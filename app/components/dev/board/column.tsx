import { useState, useRef } from "react";
import { useSubmit } from "@remix-run/react";
import invariant from "tiny-invariant";


import {
  ItemMutation,
  INTENTS,
  CONTENT_TYPES,
  type RenderedItem,
} from "./types";
import { NewCard } from "./new-card";
import { flushSync } from "react-dom";
import { Card } from "./card";
import { EditableText } from "./components";
import { Plus, TrashIcon } from "lucide-react";
import { Button } from "~/components/ui";

interface ColumnProps {
  name: string;
  columnId: string;
  items: RenderedItem[];
}

export function Column({ name, columnId, items }: ColumnProps) {
  let submit = useSubmit();

  let [acceptDrop, setAcceptDrop] = useState(false);
  let [edit, setEdit] = useState(false);
  let listRef = useRef<HTMLUListElement>(null);

  function scrollList() {
    invariant(listRef.current);
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }

  return (
    <div
      className={
        "flex-shrink-0 flex flex-col overflow-hidden max-h-full w-[250px] border border-border rounded-[6px] shadow-sm shadow-muted-background bg-background   " +
        (acceptDrop ? `outline outline-2 outline-brand-red` : ``)
      }
      onDragOver={(event) => {
        if (
          items.length === 0 &&
          event.dataTransfer.types.includes(CONTENT_TYPES.card)
        ) {
          event.preventDefault();
          setAcceptDrop(true);
        }
      }}
      onDragLeave={() => {
        setAcceptDrop(false);
      }}
      onDrop={(event) => {
        let transfer = JSON.parse(
          event.dataTransfer.getData(CONTENT_TYPES.card),
        );
        invariant(transfer.id, "missing transfer.id");
        invariant(transfer.title, "missing transfer.title");

        let mutation: ItemMutation = {
          order: 1,
          columnId: columnId,
          id: transfer.id,
          title: transfer.title,
        };

        submit(
          { ...mutation, intent: INTENTS.moveItem },
          {
            method: "post",
            navigate: false,
            // use the same fetcher instance for any mutations on this card so
            // that interruptions cancel the earlier request and revalidation
            fetcherKey: `card:${transfer.id}`,
          },
        );

        setAcceptDrop(false);
      }}
    >
      <div className="flex p-2 group items-center">
        <EditableText
          fieldName="name"
          value={name}
          inputLabel="Edit column name"
          buttonLabel={`Edit column "${name}" name`}
          inputClassName="border border-border w-full rounded-lg py-1 px-2  text-foreground bg-background"
          buttonClassName="block rounded-lg text-left w-auto py-1 px-2 font-medium text-foreground"
        >
          <input type="hidden" name="intent" value={INTENTS.updateColumn} />
          <input type="hidden" name="columnId" value={columnId} />
        </EditableText>
        <Button
          size="icon"
          variant="outline"
          onClick={() => deleteBoard(product.id)}
          className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100 ml-2"
        >
          <TrashIcon className="h-3 w-3" />
          <span className="sr-only">Delete</span>
        </Button>
      </div>

      <ul ref={listRef} className="flex-grow overflow-auto min-h-[2px]">
        {items
          .sort((a, b) => a.order - b.order)
          .map((item, index, items) => (
            <Card
              key={item.id}
              title={item.title}
              content={item.content}
              id={item.id}
              order={item.order}
              columnId={columnId}
              previousOrder={items[index - 1] ? items[index - 1].order : 0}
              nextOrder={
                items[index + 1] ? items[index + 1].order : item.order + 1
              }
            />
          ))}
      </ul>
      {edit ? (
        <NewCard
          columnId={columnId}
          nextOrder={items.length === 0 ? 1 : items[items.length - 1].order + 1}
          onAddCard={() => scrollList()}
          onComplete={() => setEdit(false)}
        />
      ) : (
        <div className="p-2 pt-1">
          <Button
            variant='ghost'
            type="button"
            onClick={() => {
              flushSync(() => {
                setEdit(true);
              });
              scrollList();
            }}
            className="flex justify-start gap-2 rounded-lg text-left w-full p-2 font-medium text-foreground hover:text-primary focus:bg-slate-200"
          >
            <Plus color="#fcfcfc" /> <p>Add a card</p>
          </Button>
        </div>
      )}
    </div>
  );
}
