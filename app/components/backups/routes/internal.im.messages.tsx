import type { LoaderArgs } from "@remix-run/node";
import { eventStream } from "remix-utils";
import { prisma } from "~/libs";

import { emitter } from "~/services/emitter";

export async function loader({ request }: LoaderArgs) {
  const data = await prisma.staffChat.findMany({
    where: {
      room: 'lobby'
    }
  })
  return data
}
