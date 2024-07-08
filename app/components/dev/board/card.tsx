import invariant from "tiny-invariant";
import { useFetcher, useSubmit } from "@remix-run/react";
import { useState } from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/components/ui/hover-card"

import { ItemMutation, INTENTS, CONTENT_TYPES } from "./types";
import { Trash, TrashIcon } from "lucide-react";
import { Button } from "~/components/ui";

interface CardProps {
  title: string;
  content: string | null;
  id: string;
  columnId: string;
  order: number;
  nextOrder: number;
  previousOrder: number;
}

export function Card({
  title,
  content,
  id,
  columnId,
  order,
  nextOrder,
  previousOrder,
}: CardProps) {
  let submit = useSubmit();
  let deleteFetcher = useFetcher();

  let [acceptDrop, setAcceptDrop] = useState<"none" | "top" | "bottom">("none");

  return deleteFetcher.state !== "idle" ? null : (
    <li
      onDragOver={(event) => {
        if (event.dataTransfer.types.includes(CONTENT_TYPES.card)) {
          event.preventDefault();
          event.stopPropagation();
          let rect = event.currentTarget.getBoundingClientRect();
          let midpoint = (rect.top + rect.bottom) / 2;
          setAcceptDrop(event.clientY <= midpoint ? "top" : "bottom");
        }
      }}
      onDragLeave={() => {
        setAcceptDrop("none");
      }}
      onDrop={(event) => {
        event.stopPropagation();

        let transfer = JSON.parse(
          event.dataTransfer.getData(CONTENT_TYPES.card),
        );
        invariant(transfer.id, "missing cardId");
        invariant(transfer.title, "missing title");

        let droppedOrder = acceptDrop === "top" ? previousOrder : nextOrder;
        let moveOrder = (droppedOrder + order) / 2;

        let mutation: ItemMutation = {
          order: moveOrder,
          columnId: columnId,
          id: transfer.id,
          title: transfer.title,
        };

        submit(
          { ...mutation, intent: INTENTS.moveItem },
          {
            method: "post",
            navigate: false,
            fetcherKey: `card:${transfer.id}`,
          },
        );

        setAcceptDrop("none");
      }}
      className={
        " -mb-[2px] last:mb-0 cursor-grab active:cursor-grabbing px-2 py-1 border-border w-[225px] " +
        (acceptDrop === "top"
          ? "border-t-brand-red border-b-transparent"
          : acceptDrop === "bottom"
            ? "border-b-brand-red border-t-transparent"
            : "border-t-transparent border-b-transparent")
      }
    >

      <div
        draggable
        className="flex text-left bg-primary text-foreground shadow shadow-muted-background border border-border text-sm rounded-[6px] w-[225px] py-1 px-2 relative group "
        onDragStart={(event) => {
          event.dataTransfer.effectAllowed = "move";
          event.dataTransfer.setData(
            CONTENT_TYPES.card,
            JSON.stringify({ id, title }),
          );
        }}
      >
        <div className=''>
          <h3 className='text-left w-full my-1 mx-2'>{title}</h3>
          <p className="mt-2 text-left  my-1 mx-2">{content || <>&nbsp;</>}</p>
        </div>

        <Button
          size="icon"
          variant="outline"
          onClick={() => deleteCard(id)}
          className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100 ml-2"
        >
          <TrashIcon className="h-3 w-3" />
          <span className="sr-only">Delete</span>
        </Button>
      </div>


      <deleteFetcher.Form method="post">
        <input type="hidden" name="intent" value={INTENTS.deleteCard} />
        <input type="hidden" name="itemId" value={id} />
        <Button
          size="icon"
          variant="outline"
          type="submit"

          onClick={(event) => {
            event.stopPropagation();
          }}
          className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100 ml-2"
        >
          <TrashIcon className="h-3 w-3" />
          <span className="sr-only">Delete</span>
        </Button>

      </deleteFetcher.Form>

    </li>
  );
}
