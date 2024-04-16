import { prisma } from "~/libs";
import type { LoaderArgs, LoaderFunction } from "@remix-run/node";


export async function loader({ request, params }: LoaderFunction) {
  const notificationsNewLead = await prisma.notificationsUser.findMany({
    where: {
      type: 'New Lead',
    }
  })

  return notificationsNewLead
}
