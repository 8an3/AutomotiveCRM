import { GetUser } from "~/utils/loader.server";
import { prisma } from "~/libs";

export async function GetUser(email) {
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
      lastSubscriptionCheck: true,
      refreshToken: true,
      activixActivated: true,
      activixEmail: true,

      role: { select: { symbol: true, name: true } },
    },
  });
  return user
}
