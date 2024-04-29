//import { GetUser } from "~/utils/loader.server";
import { redirect } from "@remix-run/node";
import { prisma } from "~/libs";

export async function GetUser(email) {
  if (!email) {
    return redirect('/login')
  }
  let oldUser = await prisma.user.findUnique({
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
      position: true,
      roleId: true,
      profileId: true,
      omvicNumber: true,
      lastSubscriptionCheck: true,
      profile: true,
      activisUserId: true,
      activixEmail: true,
      activixActivated: true,
      role: { select: { symbol: true, name: true } },
    },
  });
  const integrationSec = await prisma.userIntergration.findUnique({ where: { userEmail: oldUser?.email } });

  const user = {
    ...oldUser,
    ...integrationSec
  }
  return user
}
