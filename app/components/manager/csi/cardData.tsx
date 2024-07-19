import invariant from "tiny-invariant";
import { useFetcher, useSubmit } from "@remix-run/react";
import { useState, useRef } from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/components/ui/hover-card"
import { flushSync } from "react-dom";
import { Plus, TrashIcon } from "lucide-react";
import { NewCardData } from "./new-cardData";
import { ItemMutation, INTENTS, CONTENT_TYPES } from "./types";
import { Button } from "~/components/ui";

interface CardProps {
  title: string;
  content: string | null;
  id: string;
  answerId: string;
  answerDataId: string;
  order: number;
  nextOrder: number;
  previousOrder: number;
  name: string;
  csi: any;
  answersData: any;
  questionTitle: string;
}

export function CardData({
  title,
  id,
  answersData,
  answerDataId,
  answerId,
  order,
  questionTitle
}: CardProps) {
  let submit = useSubmit();
  let deleteFetcher = useFetcher();

  let [acceptDrop, setAcceptDrop] = useState<"none" | "top" | "bottom">("none");
  let [editData, setEditData] = useState(false);

  let listRef = useRef<HTMLUListElement>(null);

  function scrollList() {
    invariant(listRef.current);
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }
  console.log(questionTitle, 'questiontitle')

  return deleteFetcher.state !== "idle" ? null : (
    <>
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
            answerDataId: answerDataId,
            id: transfer.id,
            title: transfer.title,
          };

          submit(
            { ...mutation, intent: INTENTS.moveAnswerData },
            {
              method: "post",
              navigate: false,
              fetcherKey: `card:${transfer.id}`,
            },
          );

          setAcceptDrop("none");
        }}
        className={
          " -mb-[2px] last:mb-0 cursor-grab active:cursor-grabbing px-2 py-1 border-border w-full " +
          (acceptDrop === "top"
            ? "border-t-brand-red border-b-transparent"
            : acceptDrop === "bottom"
              ? "border-b-brand-red border-t-transparent"
              : "border-t-transparent border-b-transparent")
        }
      >

        <div
          draggable
          className="flex text-left bg-primary text-foreground shadow shadow-muted-background border border-border text-sm rounded-[6px] w-full py-1 px-2 relative group "
          onDragStart={(event) => {
            event.dataTransfer.effectAllowed = "move";
            event.dataTransfer.setData(
              CONTENT_TYPES.cardData,
              JSON.stringify({ id, title }),
            );
          }}
        >
          <div className=''>
            <h3 className='text-left w-full my-1 mx-2'>{title}</h3>
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
      {editData ? (
        <>

          <NewCardData
            answerId={answerId}
            nextOrder={answersData.length === 0 ? 1 : answersData[answersData.length - 1].order + 1}
            onAddCard={() => scrollList()}
            onComplete={() => setEditData(false)}
          />
        </>
      ) : (
        <>
          {questionTitle === 'Custom Dropdown' && (
            <div className="p-2 pt-1">
              <Button
                variant='ghost'
                type="button"
                onClick={() => {
                  flushSync(() => {
                    setEditData(true);
                  });
                  scrollList();
                }}
                className="flex justify-start gap-2 rounded-lg text-left w-full p-2 font-medium text-foreground hover:bg-slate-200 focus:bg-slate-200"
              >
                <Plus color="#fcfcfc" /> Add Custom Downpown Value
              </Button>
            </div>
          )}
        </>
      )}
    </>
  );
}
