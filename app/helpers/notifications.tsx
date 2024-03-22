import { GetUser } from "~/utils/loader.server";
import { prisma } from "~/libs";

export async function NewLeadsNot() {
  const notificationsNewLead = await prisma.notificationsUser.findMany({
    where: {
      type: 'New Lead'
    }
  });
  return notificationsNewLead
}
