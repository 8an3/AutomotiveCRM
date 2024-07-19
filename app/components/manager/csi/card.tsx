import invariant from "tiny-invariant";
import { useFetcher, useSubmit, useFetchers } from "@remix-run/react";
import { useState, useRef } from "react";
import { Plus, TrashIcon } from "lucide-react";
import { ItemMutation, INTENTS, CONTENT_TYPES } from "./types";
import { Button } from "~/components/ui";
import { flushSync } from "react-dom";
import { NewCardData } from "./new-cardData";
import { CardData } from "./cardData";


interface CardProps {
  title: string;
  content: string | null;
  id: string;
  questionId: string;
  order: number;
  nextOrder: number;
  previousOrder: number;
  csi: any;
}

export function Card({
  title,
  content,
  id,
  questionId,
  order,
  nextOrder,
  previousOrder,
  csi
}: CardProps) {
  let submit = useSubmit();
  let deleteFetcher = useFetcher();

  let itemsById = new Map(csi.answersData.map((item) => [item.id, item]));

  let pendingItems = usePendingItems();

  let optAddingColumns = usePendingColumns();
  console.log("Fetched csi.answers:", csi.answers);
  console.log("Fetched csi.answersData:", csi.answersData);
  console.log("Initial itemsById:", itemsById);
  console.log("Pending items:", pendingItems);
  console.log("Fetched optAddingColumns:", optAddingColumns);

  type Column =
    | (typeof csi.answer)[number]
    | (typeof optAddingColumns)[number];
  type ColumnWithItems = Column & { items: typeof csi.items };
  let answers = new Map<string, ColumnWithItems>();
  for (let answer of [...csi.answers, ...optAddingColumns]) {
    answers.set(answer.id, { ...answer, answersData: [] });
  }


  for (let pendingItem of pendingItems) {
    let item = itemsById.get(pendingItem.id);
    let merged = item
      ? { ...item, ...pendingItem }
      : { ...pendingItem, csiId: csi.id };
    itemsById.set(pendingItem.id, merged);
  }

  let [acceptDrop, setAcceptDrop] = useState<"none" | "top" | "bottom">("none");

  console.log(title, 'title')
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
            questionId: questionId,
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
              CONTENT_TYPES.card,
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

      {[...csi.answersData].map((col) => (
        <CardData
          key={col.id}
          title={col.title}
          answerDataId={col.id}
          answersData={col.answersData}
          answerId={col.answerId}
          order={col.order}
          questionTitle={title}
        />
      ))}

    </>
  );
}

// These are the inflight columns that are being created, instead of managing
// state ourselves, we just ask Remix for the state
function usePendingColumns() {
  type CreateColumnFetcher = ReturnType<typeof useFetchers>[number] & {
    formData: FormData;
  };

  return useFetchers()
    .filter((fetcher): fetcher is CreateColumnFetcher => {
      return fetcher.formData?.get("intent") === INTENTS.createColumn;
    })
    .map((fetcher) => {
      let name = String(fetcher.formData.get("name"));
      let id = String(fetcher.formData.get("id"));
      return { name, id };
    });
}

// These are the inflight items that are being created or moved, instead of
// managing state ourselves, we just ask Remix for the state
function usePendingItems() {
  type PendingItem = ReturnType<typeof useFetchers>[number] & {
    formData: FormData;
  };
  return useFetchers()
    .filter((fetcher): fetcher is PendingItem => {
      if (!fetcher.formData) return false;
      let intent = fetcher.formData.get("intent");
      return intent === INTENTS.createItem || intent === INTENTS.moveItem;
    })
    .map((fetcher) => {
      let columnId = String(fetcher.formData.get("columnId"));
      let title = String(fetcher.formData.get("title"));
      let id = String(fetcher.formData.get("id"));
      let order = Number(fetcher.formData.get("order"));
      let item: RenderedItem = { title, id, order, columnId, content: null };
      return item;
    });
}
