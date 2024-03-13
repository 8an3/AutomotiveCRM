import type { LoaderArgs } from "@remix-run/node";
import { eventStream } from "remix-utils";
import { prisma } from "../libs";
import { model } from "../models";
import { getSession } from '../sessions/auth-session.server'
import { emitter } from "~/services/emitter";

export async function loader({ request }: LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")


  const user = await prisma.user.findUnique({
    where: { email: email },
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      subscriptionId: true,
      customerId: true,
      returning: true,
      phone: true,
      dealer: true,
      position: true,
      roleId: true,
      profileId: true,
      omvicNumber: true,
      role: { select: { symbol: true, name: true } },
    },
  });
  const sender = user.email

  const data = await prisma.staffChat.findMany({
    where: {
      OR: [
        {
          sender: sender,
        },
        {
          to: sender,
        }
      ]
    }
  });
  return data
}
