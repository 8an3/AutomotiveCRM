//import { GetUser } from "~/utils/loader.server";
import { prisma } from "~/libs";

export async function GetUser(email) {
  if (!email) {
    return null
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
      dealer: true,
      position: true,
      roleId: true,
      profileId: true,
      omvicNumber: true,
      lastSubscriptionCheck: true,
      refreshToken: true,
      profile: true,


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
