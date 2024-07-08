import { type MetaFunction } from "@remix-run/node";
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

export async function loader({ request, params }: LoaderFunction) {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")
  const user = await GetUser(email)

  invariant(params.id, "Missing board ID");
  let id = String(params.id);

  let board = await prisma.board.findUnique({
    where: { id: id },
    include: {
      items: true,
      columns: { orderBy: { order: "asc" } },
    },
  });
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
