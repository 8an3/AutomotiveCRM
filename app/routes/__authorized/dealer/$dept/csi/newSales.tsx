import { Form, useFetcher, useFetchers, useLoaderData, useNavigation, useSubmit } from "@remix-run/react";
import { useRef, useState } from "react";
import { Button, Input, Separator } from "~/components";
import invariant from "tiny-invariant";
import { Plus, TrashIcon } from "lucide-react";
import { flushSync } from "react-dom";
import { CancelButton, SaveButton } from "~/components/manager/csi/components";
import { deleteBoard } from "~/components/manager/csi/queries";
import { getSession } from '~/sessions/auth-session.server';
import { GetUser } from "~/utils/loader.server";
import { EditableText } from "~/components/shared/shared";
import { prisma } from "~/libs";
import { INTENTS, type RenderedItem, CONTENT_TYPES, ItemMutation, ItemMutationFields } from "~/components/manager/csi/types";
import { badRequest } from "~/utils/http";
import { parseItemMutation } from "~/components/manager/csi/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"

export async function action({ request }: ActionFunction) {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")
  const user = await GetUser(email)
  /// const formPayload = Object.fromEntries(await request.formData());
  const userId = user.id
  let formData = await request.formData();
  let intent = String(formData.get("intent"));
  let boardId = String(formData.get("boardId"));
  let name = String(formData.get("name"));
  let csiId = String(formData.get("csiId"));
  let mutation = parseItemMutation(formData);

  switch (intent) {
    case 'createCsi': {
      let name = String(formData.get("name") || "");
      if (!name) throw badRequest("Bad request");
      let csi = await prisma.csi.create({
        data: {
          name: name,
          userEmail: email,
        }
      });
      return csi
    }
    case 'deleteCsi': {
      let csiId = formData.get("csiId");
      if (!csiId) throw badRequest("Missing boardId");
      await prisma.csi.delete({ where: { id: csiId, } })
      return { ok: true };
    }
    case 'updateCsiName':
      return prisma.csi.update({
        where: { id: csiId },
        data: { name: name },
      });
    case 'updateQuestion':
      return prisma.question.update({
        where: { id: csiId },
        data: { name: name },
      });
    case 'createQuestion':
      let columnCount = await prisma.question.count({
        where: { id: csiId },
      });
      return prisma.question.create({
        data: {
          // id: id,
          csiId: csiId,
          name: name,
          order: columnCount + 1,
        },
      });
    case 'moveAnswer':
    case 'updateAnswer':
    case 'createAnswer':
      return prisma.answer.upsert({
        where: {
          id: mutation.id,
        },
        create: {
          ...mutation,
          questionId: mutation.questionId,
        },
        update: {
          ...mutation,
          questionId: mutation.questionId,
        },
      });
    case 'moveAnswerData':
    case 'updateAnswerData':
    case 'createAnswerData':
      return prisma.answer.upsert({
        where: {
          id: mutation.id,
        },
        create: {
          ...mutation,
          questionId: mutation.questionId,
        },
        update: {
          ...mutation,
          questionId: mutation.questionId,
        },
      });
    default: {
      throw badRequest(`Unknown intent: ${intent}`);
    }
  }

}
export async function loader({ request }: LoaderFunction) {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")
  let csi = await prisma.csi.findMany({
    where: {
      userEmail: email,
    },
    include: {
      questions: true,
      answers: true,
      answersData: true,
    }
  });
  return { csi };
}

export default function CSI() {
  let navigation = useNavigation();
  let isCreating = navigation.formData?.get("intent") === "createBoard";
  const [showColumn, setShowColumn] = useState(false)
  const [showBoard, setShowBoard] = useState(false)
  let { csi } = useLoaderData();
  const [board, setBoard] = useState(false)
  let scrollContainerRef = useRef<HTMLDivElement>(null);
  function scrollRight() {
    invariant(scrollContainerRef.current, "no scroll container");
    scrollContainerRef.current.scrollLeft =
      scrollContainerRef.current.scrollWidth;
  }
  return (
    <div className="flex m-10">
      <div className=''>
        <p className='text-xl text-foreground'>CSI Questionaires</p>
        <Separator className='bg-border border-border text-border mb-5' />
        <Form method="post" className="">
          <input type="hidden" name="intent" value="createCsi" />
          <div className='flex items-center '>
            <div className="grid gap-3 mx-3 mb-3">
              <div className="relative mt-3">
                <Input
                  required
                  name='name'
                  type="text"
                  className="w-full bg-background border-border "
                />
                <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">New CSI Survey</label>
              </div>
            </div>
            <Button size='sm' type="submit" onClick={() => {
            }}>{isCreating ? "Creating..." : "Create"}</Button>
          </div>
        </Form>
        <div className='mt-10 max-h-[500px] h-auto overflow-y-auto grid' >
          {csi.map((board) => (
            <Button variant='ghost' className=' mt-3 justify-start' onClick={() => {
              setShowBoard(true)
              setBoard(board)
            }}>
              {board.name}
            </Button>
          ))}
        </div>
      </div>
      {showBoard && board && (
        <div className='grid grid-cols-1' >
          <Board
            scrollContainerRef={scrollContainerRef}
            csi={board}
            scrollRight={scrollRight}
          />

        </div>
      )}
    </div>
  )
}
function Board({ csi, scrollContainerRef, scrollRight }) {
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
  return (
    <div
      className="max-h-[900px] h-[900px]  min-h-0 flex flex-col overflow-x-scroll mt-[50px]  bg-background items-start w-[500px"
      ref={scrollContainerRef}
    >
      <h1 className='group items-center'>
        <EditableText
          value={csi.name}
          fieldName="name"
          inputClassName="mx-8 my-4 border border-border rounded-lg  text-foreground bg-background py-1 px-2 "
          buttonClassName="mx-8 my-4   rounded-lg text-left   py-1 px-2 text-foreground"
          buttonLabel={`Edit board "${csi.name}" name`}
          inputLabel="Edit board name"
        >
          <input type="hidden" name="intent" value='updateBoardName' />
          <input type="hidden" name="csiId" value={csi.id} />
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
          boardId={csi.id}
          onAdd={scrollRight}
          editInitially={csi.questions.length === 0}
        />

        <div data-lol className="w-8 h-1 flex-shrink-0" />
      </div>
    </div>
  )
}

function NewColumn({ editInitially, boardId, onAdd }) {
  let submit = useSubmit();
  let inputRef = useRef<HTMLInputElement>(null);
  let [editing, setEditing] = useState(editInitially);

  return (
    <>
      {editing ? (

        <Form
          method="post"
          className="p-2 flex-shrink-0 flex flex-col gap-5 overflow-hidden max-h-full w-[250px] border border-border rounded-[6px] shadow bg-background"
          onSubmit={(event) => {
            event.preventDefault();
            let formData = new FormData(event.currentTarget);
            formData.set("id", crypto.randomUUID());
            submit(formData, {
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
          <input type="hidden" name="intent" value='createQuestion' />
          <input type="hidden" name="csiId" value={boardId} />

          <div className="grid gap-3 mx-3 mb-3">
            <div className="relative mt-3">
              <Input
                autoFocus
                required
                ref={inputRef}
                type="text"
                name="name"
                className="w-full bg-background border-border "
              />
              <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Question</label>
            </div>
          </div>
          <div className="flex justify-between">
            <CancelButton onClick={() => setEditing(false)}>Cancel</CancelButton>
            <SaveButton>Save</SaveButton>

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
        </Button>)}
    </>
  )
}

export function Column({ name, questionId, answers, csi }: ColumnProps) {
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
        "flex-shrink-0 flex flex-col overflow-hidden max-h-full w-[300px] border border-white rounded-[6px] shadow-sm shadow-muted-background bg-background   " +
        (acceptDrop ? `outline outline-2 outline-brand-red` : ``)
      }
      onDragOver={(event) => {
        if (
          answers.length === 0 &&
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
          questionId: questionId,
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
          <input type="hidden" name="columnId" value={questionId} />
        </EditableText>
        <Button
          size="icon"
          variant="outline"
          onClick={() => deleteBoard(questionId)}
          className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100 ml-2"
        >
          <TrashIcon className="h-3 w-3" />
          <span className="sr-only">Delete</span>
        </Button>
      </div>

      <ul ref={listRef} className="flex-grow overflow-auto min-h-[2px]">
        {answers
          .sort((a, b) => a.order - b.order)
          .map((item, index, items) => (
            <Card
              key={item.id}
              csi={csi}
              title={item.title}
              content={item.content}
              id={item.id}
              order={item.order}
              questionId={questionId}
              previousOrder={answers[index - 1] ? answers[index - 1].order : 0}
              nextOrder={
                answers[index + 1] ? answers[index + 1].order : answers.order + 1
              }
            />
          ))}
      </ul>
      {edit ? (
        <NewCard
          questionId={questionId}
          nextOrder={answers.length === 0 ? 1 : answers[answers.length - 1].order + 1}
          onAddCard={() => scrollList()}
          onComplete={() => setEdit(false)}
        />
      ) : (
        <>
          {answers.length === 0 && (
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
                className="flex justify-start gap-2 rounded-lg text-left w-full p-2 font-medium text-foreground hover:bg-slate-200 focus:bg-slate-200"
              >
                <Plus color="#fcfcfc" /> Add Input Type
              </Button>
            </div>
          )}
        </>
      )}

    </div>
  );
}

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
          <input type="hidden" name="intent" value='deleteCard' />
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

export function NewCard({
  questionId,
  nextOrder,
  onComplete,
  onAddCard,
}: {
  questionId: string;
  nextOrder: number;
  onComplete: () => void;
  onAddCard: () => void;
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
        onAddCard();
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          onComplete();
        }
      }}
    >
      <input type="hidden" name="intent" value='createAnswerData' />
      <input
        type="hidden"
        name={ItemMutationFields.questionId.name}
        value={questionId}
      />
      <input
        type="hidden"
        name={ItemMutationFields.order.name}
        value={nextOrder}
      />
      <div className="grid gap-3 mx-3 mb-3">
        <div className="relative mt-3">
          <Select
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
          >
            <SelectTrigger className="w-full bg-background border border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="w-full bg-background border border-border">
              <SelectGroup>
                <SelectLabel>Input Types</SelectLabel>
                <SelectItem value="Input">Input</SelectItem>
                <SelectItem value="Scale">Scale</SelectItem>
                <SelectItem value="Custom Dropdown">Custom Dropdown</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Input Type</label>
        </div>
      </div>
      <div className="flex justify-between">
        <CancelButton onClick={onComplete}>Cancel</CancelButton>
        <SaveButton ref={buttonRef}>Save</SaveButton>
      </div>
    </Form>
  );
}
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
      <input type="hidden" name="intent" value='createItem' />
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

          <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Custom Value</label>
        </div>
      </div>
      <div className="flex justify-between">
        <CancelButton onClick={onComplete}>Cancel</CancelButton>
        <SaveButton ref={buttonRef}>Save</SaveButton>
      </div>
    </Form>
  );
}
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
          <input type="hidden" name="intent" value='deleteCard' />
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
      return intent === 'createItem' || intent === 'moveItem';
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
