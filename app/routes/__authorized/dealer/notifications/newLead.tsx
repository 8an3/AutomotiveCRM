import { prisma } from "~/libs";
import type { LoaderArgs, LoaderFunction } from "@remix-run/node";


export async function loader({ request, params }: LoaderFunction) {
  const getLeads = await prisma.notificationsUser.findMany({
    where: {
      type: 'New Lead',
    },
    include: {
      reads: {
        select: {
          read: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc', // Optional: Order by creation date
    },
  });
  const getloadNewLead = () => {
    return getLeads.map(notification => ({
      ...notification,
      read: notification.reads[0]?.read || false, // Extract read status
    }));
  }
  const loadNewLead = getloadNewLead()

  return loadNewLead
}
