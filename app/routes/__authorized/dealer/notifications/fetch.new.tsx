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
import { prisma } from "~/libs";
import { GetUser } from "~/utils/loader.server";


interface CleanupFunction {
  (): void;
}
export async function loader({ request, params }: LoaderFunction) {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")

  const user = await GetUser(email)
  if (!user) { redirect('/login') }

  return eventStream(request.signal, function setup(send) {
    async function run() {
      for await (let _ of interval(1000 * 60 * 3, { signal: request.signal })) {
        const notifications = await prisma.notificationsUser.findMany({
          where: {
            userEmail: email,
            read: false,
            createdAt: {
              gte: new Date(Date.now() - 1000 * 60 * 60),
            },
          },
        });


        for (const notification of notifications) {
          send({ event: 'notification', data: JSON.stringify(notification) });
        }
      }
    }

    run();
  });
}
