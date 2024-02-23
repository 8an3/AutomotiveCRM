import { prisma } from "~/libs/prisma.server";

export async function NewLeadsNot() {
  const notificationsNewLead = await prisma.notificationsUser.findMany({
    where: {
      type: 'New Lead'
    }
  });
  return notificationsNewLead
}
