import { json, type LoaderArgs } from "@remix-run/node";
import { model } from "~/models";
import { getSession } from '~/sessions/auth-session.server';
import { prisma } from "~/libs";
import { requireAuthCookie } from '~/utils/misc.user.server';

export async function loader({ request }: LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")


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
      role: { select: { symbol: true, name: true } },
    },
  });
  /// console.log(user, account, 'wquiote loadert')
  if (!user) {
    redirect('/login')
  }
  return ({ user })

}
