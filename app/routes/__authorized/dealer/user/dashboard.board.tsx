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

export const meta = () => {
  return [{ title: "Boards" }];
};

export async function loader({ request }: LoaderFunction) {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")
  const user = await GetUser(email)
  let boards = await getHomeData(email);
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
      let board = await createBoard(user.id, name, color);
      return redirect(`/user/dashboard/finance/${board.id}`);
    }
    case INTENTS.deleteBoard: {
      let boardId = formData.get("boardId");
      if (!boardId) throw badRequest("Missing boardId");
      await deleteBoard(Number(boardId), user.id);
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
