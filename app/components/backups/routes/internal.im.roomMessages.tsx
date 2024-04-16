import type { LoaderArgs } from "@remix-run/node";
import { eventStream } from "remix-utils";
import { GetUser } from "~/utils/loader.server";
import { prisma } from "~/libs";
import { model } from "../models";
import { getSession } from '~/sessions/auth-session.server'
import { emitter } from "~/services/emitter";

export async function loader({ request }: LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")


  const user = await GetUser(email)
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
