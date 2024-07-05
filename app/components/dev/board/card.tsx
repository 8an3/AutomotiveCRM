import invariant from "tiny-invariant";
import { useFetcher, useSubmit } from "@remix-run/react";
import { useState } from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/components/ui/hover-card"

import { ItemMutation, INTENTS, CONTENT_TYPES } from "./types";
import { Trash } from "lucide-react";
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
        " -mb-[2px] last:mb-0 cursor-grab active:cursor-grabbing px-2 py-1 border-border" +
        (acceptDrop === "top"
          ? "border-t-brand-red border-b-transparent"
          : acceptDrop === "bottom"
            ? "border-b-brand-red border-t-transparent"
            : "border-t-transparent border-b-transparent")
      }
    >
      <HoverCard>
        <HoverCardTrigger asChild>
          <div
            draggable
            className="text-left bg-background text-foreground shadow shadow-muted-background border border-border text-sm rounded-[6px] w-full py-1 px-2 relative"
            onDragStart={(event) => {
              event.dataTransfer.effectAllowed = "move";
              event.dataTransfer.setData(
                CONTENT_TYPES.card,
                JSON.stringify({ id, title }),
              );
            }}
          >
            <div>
              <h3 className='text-left'>{title}</h3>
              <div className="mt-2 text-left">{content || <>&nbsp;</>}</div>
            </div>

          </div>
        </HoverCardTrigger>
        <HoverCardContent className="w-[100px] h-[100px] bg-background border border-border">
          <deleteFetcher.Form method="post">
            <input type="hidden" name="intent" value={INTENTS.deleteCard} />
            <input type="hidden" name="itemId" value={id} />
            <Button
              size='icon'
              variant='ghost'
              aria-label="Delete card"
              className="absolute mx-auto my-auto bg-background hover:text-brand-red"
              type="submit"
              onClick={(event) => {
                event.stopPropagation();
              }}
            >
              <Trash color="#fcfcfc" />
            </Button>
          </deleteFetcher.Form>
        </HoverCardContent>
      </HoverCard>
    </li>
  );
}
