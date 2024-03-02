import { eventStream } from "remix-utils";
import { interval } from "~/utils/timers";
import { PrismaClient } from '@prisma/client';
import { LoaderArgs } from "@remix-run/node";
//import { authenticator } from "~/services";
import { model } from "~/models";
import { CheckSub } from '~/utils/checksub.server'
import { getSession } from '~/sessions/auth-session.server';
import { redirect, json } from "@remix-run/node";
import { requireAuthCookie } from '~/utils/misc.user.server';


const prisma = new PrismaClient();
interface CleanupFunction {
  (): void;
}
export async function loader({ request, params }: LoaderFunction) {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")
  const user = await model.user.query.getForSession({ email: email });
  if (!user) { redirect('/login') }

  return eventStream(request.signal, function setup(send) {
    async function run() {
      for await (let _ of interval(1000 * 60 * 3, { signal: request.signal })) { // Check every 3 minutes
        // Fetch new notifications from the database
        const notifications = await prisma.notificationsUser.findMany({
          where: {
            userId: user?.id, // Replace this with your actual session handling logic
            read: false,
            createdAt: {
              gte: new Date(Date.now() - 1000 * 60 * 60),
            },
          },
        });


        // Send new notifications to the client
        for (const notification of notifications) {
          send({ event: 'notification', data: JSON.stringify(notification) });
        }
      }
    }

    run();
  });
}
