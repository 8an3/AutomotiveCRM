import { useRef } from "react";
import invariant from "tiny-invariant";
import { useFetchers, useLoaderData } from "@remix-run/react";

import { INTENTS, type RenderedItem } from "./types";
import { Column } from "./column";
import { NewColumn } from "./new-column";
import { EditableText } from "./components";
import { prisma } from "~/libs";
import { todoRoadmap } from "~/routes/__authorized/dealer/user/dashboard.roadmap";
import { Button } from "~/components/ui";
import { TrashIcon } from "lucide-react";
import { deleteBoard } from "./queries";

export function Board() {
  let { csi, id } = useLoaderData();
  let itemsById = new Map(csi.answers.map((item) => [item.id, item]));

  let pendingItems = usePendingItems();

  // merge pending items and existing items
  for (let pendingItem of pendingItems) {
    let item = itemsById.get(pendingItem.id);
    let merged = item
      ? { ...item, ...pendingItem }
      : { ...pendingItem, csiId: csi.id };
    itemsById.set(pendingItem.id, merged);
  }

  // merge pending and existing columns
  let optAddingColumns = usePendingColumns();
  type Column =
    | (typeof csi.questions)[number]
    | (typeof optAddingColumns)[number];
  type ColumnWithItems = Column & { items: typeof csi.items };
  let questions = new Map<string, ColumnWithItems>();
  for (let question of [...csi.questions, ...optAddingColumns]) {
    questions.set(question.id, { ...question, answers: [] });
  }

  // add items to their columns
  for (let answer of itemsById.values()) {
    let questionId = answer.questionId;
    let question = questions.get(questionId);
    invariant(question, "missing column");
    question.answers.push(answer);
  }

  // scroll right when new columns are added
  let scrollContainerRef = useRef<HTMLDivElement>(null);
  function scrollRight() {
    invariant(scrollContainerRef.current, "no scroll container");
    scrollContainerRef.current.scrollLeft =
      scrollContainerRef.current.scrollWidth;
  }
  return (
    <div
      className="max-h-[900px] h-[900px]  min-h-0 flex flex-col overflow-x-scroll mt-[50px]  bg-background items-start"
      ref={scrollContainerRef}
    >
      <h1 className='group items-center'>
        <EditableText
          value={csi.name}
          fieldName="name"
          inputClassName="mx-8 my-4 border border-border rounded-lg  text-foreground bg-background py-1 px-2 "
          buttonClassName="mx-8 my-4   rounded-lg text-left   py-1 px-2 text-slate-800"
          buttonLabel={`Edit board "${csi.name}" name`}
          inputLabel="Edit board name"
        >
          <input type="hidden" name="intent" value={INTENTS.updateBoardName} />
          <input type="hidden" name="id" value={csi.id} />
        </EditableText>
        <Button
          size="icon"
          variant="outline"
          onClick={() => deleteBoard(csi.id)}
          className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100 ml-2"
        >
          <TrashIcon className="h-3 w-3" />
          <span className="sr-only">Delete</span>
        </Button>
      </h1>

      <div className="flex flex-grow min-h-0 h-full items-start gap-4 px-8 pb-4">
        {[...questions.values()].map((col) => {
          return (
            <Column
              key={col.id}
              name={col.name}
              questionId={col.id}
              answers={col.answers}
              csi={csi}
            />
          );
        })}

        <NewColumn
          boardId={id}
          onAdd={scrollRight}
          editInitially={csi.questions.length === 0}
        />

        {/* trolling you to add some extra margin to the right of the container with a whole dang div */}
        <div data-lol className="w-8 h-1 flex-shrink-0" />
      </div>
    </div>
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
