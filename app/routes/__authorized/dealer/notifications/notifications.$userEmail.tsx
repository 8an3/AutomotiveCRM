import { prisma } from "~/libs";
import { json, type LoaderArgs, type LoaderFunction } from "@remix-run/node";
import { getSession } from "~/sessions/auth-session.server";
import { model } from "~/models";
import { GetUser } from "~/utils/loader.server";

export async function loader({ request, params }: LoaderFunction) {
  const { userEmail } = params;
  const notifications = await prisma.notificationsUser.findMany({
    where: { userEmail: userEmail },
    select: {
      id: true,
      title: true,
      content: true,
      dismiss: true,
      type: true,
      subType: true,
      financeId: true,
      clientfileId: true,
      to: true,
      from: true,
      userEmail: true,
      read: true,
    },
  });
  return notifications;
}
