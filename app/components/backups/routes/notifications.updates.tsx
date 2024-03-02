import { prisma } from "~/libs";
import { json, type LoaderArgs, type LoaderFunction } from "@remix-run/node";
import { getSession } from '../sessions/auth-session.server'
import { model } from "../models";


export async function loader({ request, params }: LoaderFunction) {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")
  const user = await model.user.query.getForSession({ email: email });
  const upcoming = await prisma.notificationsUser.findMany({ where: { userId: user.id, } })

  const notifications = await prisma.notificationsUser.findMany({ where: { userId: user.id, } })
  let newUpdates = notifications.filter(notification => notification.userId === user.id && notification.type === 'updates');
  return json({ user, newUpdates })
}
