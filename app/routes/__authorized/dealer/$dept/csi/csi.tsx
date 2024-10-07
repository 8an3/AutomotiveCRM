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
import { parseItemMutation } from "~/components/manager/csi/utils";
import { getHomeData, createBoard, deleteBoard } from "~/components/manager/csi/queries";
import { INTENTS } from "~/components/manager/csi/types";
import { Input } from "~/components";
import { prisma } from "~/libs";
import { Trash } from "lucide-react";
import { useState } from "react";

export const meta = () => {
  return [{ title: "CSI" }];
};

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

export async function action({ request }: ActionFunction) {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")
  const user = await GetUser(email)
  let formData = await request.formData();
  let intent = String(formData.get("intent"));
  switch (intent) {
    case INTENTS.createCsi: {
      let name = String(formData.get("name") || "");
      if (!name) throw badRequest("Bad request");
      let csi = await prisma.csi.create({
        data: {
          name: name,
          userEmail: email,
        }
      });
      return redirect(`/dealer/manager/csi/${csi.id}`);
    }
    case INTENTS.deleteCsi: {
      let csiId = formData.get("csiId");
      if (!csiId) throw badRequest("Missing boardId");
      await prisma.csi.delete({ where: { id: csiId, } })
      return { ok: true };
      break;
    }
    default: {
      throw badRequest(`Unknown intent: ${intent}`);
    }
  }
}

export default function Products() {
  return (
    <div className="h-full mt-10">
      <NewBoard />
      <Boards />
    </div>
  );
}

function Boards() {
  let { csi } = useLoaderData<typeof loader>();

  return (
    <div className="p-8">
      <div className='flex items-center'>
        <h3 className="text-xl font-thin uppercase text-foreground mr-3">
          CSI
        </h3>
      </div>
      <nav className="flex flex-wrap gap-8">
        {csi.map((board) => (
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
        to={`/dealer/manager/csi/${id}`}
        className="w-[250px] h-8 shadow border border-border rounded-lg bg-background text-center my-auto  "
      >
        <p className='my-auto'>{name}</p>
      </Link >
      <fetcher.Form method="post" className=''>
        <input type="hidden" name="intent" value={INTENTS.deleteCsi} />
        <input type="hidden" name="csiId" value={id} />
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
        <Button size='sm' type="submit">{isCreating ? "Creating..." : "Create"}</Button>
      </div>
    </Form>
  );
}
