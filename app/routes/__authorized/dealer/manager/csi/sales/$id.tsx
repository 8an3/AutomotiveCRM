import { type MetaFunction } from "@remix-run/node";
import invariant from "tiny-invariant";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { badRequest, notFound } from "~/utils/http";
import { getSession } from '~/sessions/auth-session.server';
import { GetUser } from "~/utils/loader.server";
import { parseItemMutation } from "~/components/manager/csi/utils";
import { INTENTS } from "~/components/manager/csi/types";
import {
  createColumn,
  updateColumnName,
  getBoardData,
  upsertItem,
  updateBoardName,
  deleteCard,
} from "~/components/manager/csi/queries";
import { Board } from "~/components/manager/csi/sales/board";
import { prisma } from "~/libs";

export async function loader({ request, params }: LoaderFunction) {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")
  const user = await GetUser(email)

  invariant(params.id, "Missing board ID");
  let id = String(params.id);

  let csi = await prisma.csi.findUnique({
    where: { id: id },
    include: {
      questions: true,
      answers: { orderBy: { order: "asc" } },
      answersData: { orderBy: { order: "asc" } },
    },
  });
  if (!csi) throw notFound();
  console.log(csi, 'board')
  return { csi, user };
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: `${data ? data.csi.name : "CSI Survey"}` }];
};

export { Board as default };

export async function action({ request, params }: ActionFunction) {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")
  const user = await GetUser(email)
  let csiId = String(params.id);
  invariant(csiId, "Missing boardId");

  let formData = await request.formData();
  let intent = formData.get("intent");

  if (!intent) throw badRequest("Missing intent");

  switch (intent) {
    case INTENTS.deleteAnswer: {
      let id = String(formData.get("itemId") || "");
      await prisma.answer.delete({ where: { id } });
      break;
    }
    case INTENTS.updateCsiName: {
      let name = String(formData.get("name") || "");
      invariant(name, "Missing name");
      await prisma.csi.update({
        where: { id: csiId },
        data: { name },
      });
      break;
    }
    case INTENTS.moveAnswer:
    case INTENTS.updateAnswer:
    case INTENTS.createAnswer: {
      let mutation = parseItemMutation(formData);
      await prisma.answer.upsert({
        where: {
          id: mutation.id,
        },
        create: {
          ...mutation,
          csiId: mutation.csiId,
        },
        update: {
          ...mutation,
          csiId: mutation.csiId,
        },
      });
      break;
    }
    case INTENTS.moveAnswerData:
    case INTENTS.updateAnswerData:
    case INTENTS.createAnswerData: {
      let mutation = parseItemMutation(formData);
      await prisma.answerData.upsert({
        where: {
          id: mutation.id,
        },
        create: {
          ...mutation,
          csiId: mutation.csiId,
        },
        update: {
          ...mutation,
          csiId: mutation.csiId,
        },
      });
      break;
    }
    case INTENTS.createQuestion: {
      let { name, csiId } = Object.fromEntries(formData);
      invariant(name, "Missing name");
      let columnCount = await prisma.column.count({
        where: { id: csiId },
      });
      return prisma.question.create({
        data: {
          csiId,
          name,
          order: columnCount + 1,
        },
      });
      break;
    }
    case INTENTS.updateQuestion: {
      let { name, quesationId } = Object.fromEntries(formData);
      if (!name || !quesationId) throw badRequest("Missing name or columnId");
      await prisma.question.update({
        where: { id: quesationId },
        data: { name: name },
      });
      break;
    }
    case INTENTS.deleteQuestion: {
      let { name, quesationId } = Object.fromEntries(formData);
      if (!quesationId) throw badRequest("Missing name or columnId");
      await prisma.question.delete({
        where: { id: quesationId },
      });
      break;
    }
    default: {
      throw badRequest(`Unknown intent: ${intent}`);
    }
  }

  return { ok: true };
}
