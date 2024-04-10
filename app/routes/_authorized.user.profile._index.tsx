import { redirect } from "@remix-run/node";
import { getSession } from "~/sessions/auth-session.server";

import { requireUserSession } from "~/helpers";
import { prisma } from "~/libs";

import type { LoaderArgs } from "@remix-run/node";

export const loader = async ({ request }) => {
  /**  const userSession = await getSession(request.headers.get("Cookie"));
    if (!userSession) { return json({ status: 302, redirect: '/login' }); };
    const email = userSession.get("email");
      const user = await model.user.query.getForSession({ email });

    if (!user) { return json({ status: 302, redirect: '/login' }); };
    return redirect(`/${user.username}`); */
  return null
}
