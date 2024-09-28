import {
  type ActionFunction,
  type LoaderFunction,
  redirect,
  broadcastDevReady,
  json,
} from "@remix-run/node";
import {
  Form,
  Link,
  useFetcher,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";

import { getSession } from '~/sessions/auth-session.server';
import { GetUser } from "~/utils/loader.server";
import { Button } from "~/components/ui/button";
import { Label, } from "~/components/ui/label";
import { badRequest } from "~/utils/http";

import { getHomeData, createBoard, deleteBoard } from "~/components/dev/board/queries";
import { INTENTS } from "~/components/dev/board/types";
import { Input } from "~/components";
import { prisma } from "~/libs";
import { Trash } from "lucide-react";
import { useState } from "react";

export const links: LinksFunction = () => [
  { rel: "icon", type: "image/svg", href: "/favicons/settings.svg", },
]

export const meta = () => {
  return [{ title: "Boards" }];
};

export async function loader({ request }: LoaderFunction) {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")
  const user = await GetUser(email)
  let boards = await prisma.board.findMany();
  boards = boards.filter((board) =>
    board.name === 'Finance Product Board'
  );
  //let boards = await getHomeData(email);
  return { boards };
}

export async function action({ request }: ActionFunction) {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")
  const user = await GetUser(email)
  let formData = await request.formData();
  let intent = String(formData.get("intent"));
  switch (intent) {
    case INTENTS.createBoard: {
      let name = String(formData.get("name") || "");
      let color = String(formData.get("color") || "");
      if (!name) throw badRequest("Bad request");
      let board = await createBoard(user.email, name, color);
      return redirect(`/user/dashboard/finance/${board.id}`);
    }
    case INTENTS.deleteBoard: {
      let boardId = formData.get("boardId");
      if (!boardId) throw badRequest("Missing boardId");
      await deleteBoard(Number(boardId), user.userEmail);
      return { ok: true };
    }
    default: {
      throw badRequest(`Unknown intent: ${intent}`);
    }
  }
}

export default function Products() {
  return (
    <div className="h-full">
      <NewBoard />
      <Boards />
    </div>
  );
}

function Boards() {
  let { boards } = useLoaderData<typeof loader>();

  return (
    <div className="p-8">
      <div className='flex items-center'>
        <h3 className="text-xl font-thin uppercase text-foreground mr-3">
          Boards
        </h3>
      </div>
      <nav className="flex flex-wrap gap-8">
        {boards.map((board) => (
          <Board
            key={board.id}
            name={board.name}
            id={board.id}
          />
        ))}
      </nav>
    </div>
  );
}

function Board({
  name,
  id,
}: {
  name: string;
  id: number;
}) {
  let fetcher = useFetcher();
  let isDeleting = fetcher.state !== "idle";
  return isDeleting ? null : (
    <div className="group flex">
      <Link
        to={`/dealer/user/dashboard/board/${id}`}
        className="w-[250px] h-8 shadow border border-border rounded-lg bg-background text-center my-auto  "
      >
        <p className='my-auto'>{name}</p>
      </Link >
      <fetcher.Form method="post" className=''>
        <input type="hidden" name="intent" value={INTENTS.deleteBoard} />
        <input type="hidden" name="boardId" value={id} />
        <Button
          size="icon"
          variant="outline"
          type='submit' className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100 ml-2"
          onClick={(event) => {
            event.stopPropagation();
          }}
        >
          <Trash className="h-3 w-3" />
          <span className="sr-only">Copy</span>
        </Button>
      </fetcher.Form>
    </div>

  );
}

function NewBoard() {
  let navigation = useNavigation();
  let isCreating = navigation.formData?.get("intent") === "createBoard";

  return (
    <Form method="post" className="p-8 max-w-md">
      <input type="hidden" name="intent" value="createBoard" />
      <div className='flex items-center '>
        <div className="grid gap-3 mx-3 mb-3">
          <div className="relative mt-3">
            <Input
              required
              name='name'
              type="text"
              className="w-full bg-background border-border "
            />
            <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">New Board</label>
          </div>
        </div>
        <Button size='sm' type="submit">{isCreating ? "Creating..." : "Create"}</Button>
      </div>
    </Form>
  );
}



/**import { type MetaFunction } from "@remix-run/node";
import invariant from "tiny-invariant";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { badRequest, notFound } from "~/utils/http";
import { getSession } from '~/sessions/auth-session.server';
import { GetUser } from "~/utils/loader.server";
import { parseItemMutation } from "~/components/dev/board/utils";
import { INTENTS } from "~/components/dev/board/types";
import {
  createColumn,
  updateColumnName,
  getBoardData,
  upsertItem,
  updateBoardName,
  deleteCard,
} from "~/components/dev/board/queries";
import { Board } from "~/components/dev/board/board";
import { prisma } from "~/libs";

export const links: LinksFunction = () => [
  { rel: "icon", type: "image/svg", href: "/favicons/settings.svg", },
]

export async function loader({ request, params }: LoaderFunction) {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")
  const user = await GetUser(email)

  //  invariant(params.id, "Missing board ID");
  // let id = String(params.id);

  let board = await prisma.board.findMany({
    where: { name: 'Finance Product Board' },
    include: {
      items: true,
      columns: { orderBy: { order: "asc" } },
    }
  });
  board = board[0]
  if (!board) throw notFound();
  console.log(board, 'board')
  return { board, user };
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: `${data ? data.board.name : "Board"} | Trellix` }];
};

export { Board as default };


export async function action({ request, params }: ActionFunction) {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")
  const user = await GetUser(email)
  let boardId = String(params.id);
  invariant(boardId, "Missing boardId");

  let formData = await request.formData();
  let intent = formData.get("intent");

  if (!intent) throw badRequest("Missing intent");

  switch (intent) {
    case INTENTS.deleteCard: {
      let id = String(formData.get("itemId") || "");
      await deleteCard(id, user.id);
      break;
    }
    case INTENTS.updateBoardName: {
      let name = String(formData.get("name") || "");
      invariant(name, "Missing name");
      await updateBoardName(boardId, name, user.id);
      break;
    }
    case INTENTS.moveItem:
    case INTENTS.createItem: {
      let mutation = parseItemMutation(formData);
      await upsertItem({ ...mutation, boardId }, user.id);
      break;
    }
    case INTENTS.createColumn: {
      let { name, id } = Object.fromEntries(formData);
      invariant(name, "Missing name");
      invariant(id, "Missing id");
      await createColumn(boardId, String(name), String(id), user.id);
      break;
    }
    case INTENTS.updateColumn: {
      let { name, columnId } = Object.fromEntries(formData);
      if (!name || !columnId) throw badRequest("Missing name or columnId");
      await updateColumnName(String(columnId), String(name), user.id);
      break;
    }
    default: {
      throw badRequest(`Unknown intent: ${intent}`);
    }
  }

  return { ok: true };
}

*/
