import { prisma } from "~/libs";
import { json, type LoaderArgs, type LoaderFunction } from "@remix-run/node";
import { getSession } from '../sessions/auth-session.server'
import { model } from "../models";


export async function loader({ request, params }: LoaderFunction) {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")
  const user = await model.user.query.getForSession({ email: email });
  const notifications = await prisma.notificationsUser.findMany({
    where: {
      userId: user.id,
    }
  })
  const messages = notifications.filter(notification =>
    notification.to === user.email && notification.type === 'messages'
  );

  console.log(user, messages)

  return json({ user, messages, })
}
