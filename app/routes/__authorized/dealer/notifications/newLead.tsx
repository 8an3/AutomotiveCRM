import { prisma } from "~/libs";
import type { LoaderArgs, LoaderFunction } from "@remix-run/node";


export async function loader({ request, params }: LoaderFunction) {
  const getLeads = await prisma.notificationsUser.findMany({
    where: {
      type: 'New Lead',
    },
    orderBy: {
      createdAt: 'desc', // Optional: Order by creation date
    },
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
  const getloadNewLead = () => {
    return getLeads.map(notification => ({
      ...notification,
      read: notification.reads[0]?.read || false, // Extract read status
    }));
  }
  const loadNewLead = getloadNewLead()

  return loadNewLead
}
