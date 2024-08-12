/* eslint-disable tailwindcss/no-arbitrary-value */
import { Button, RemixNavLink, } from "~/components";
import { useLoaderData, Outlet } from "@remix-run/react";
import { getSession } from '~/sessions/auth-session.server';
import { prisma } from "~/libs";
import { GetUser } from "~/utils/loader.server";

import { requireUserSession } from "~/helpers";
import { model } from "~/models";
import { createCacheHeaders, formatDateTime, formatRelativeTime, invariant, truncateText } from "~/utils";
import { getLatestFinances5, } from "~/utils/finance/get.server";
import { json, redirect, type ActionFunction, type DataFunctionArgstype, type LoaderArgs, } from '@remix-run/node'

export const loader = async ({ request }) => {
  /**  const userSession = await getSession(request.headers.get("Cookie"));
    if (!userSession) { return json({ status: 302, redirect: 'login' }); };
    const email = userSession.get("email");
      const user = await model.user.query.getForSession({ email });

    if (!user) { return json({ status: 302, redirect: 'login' }); };


    const finance = await getLatestFinances5(email)
    const metrics = await model.user.query.getMetrics({ id: userSession.id });
    invariant(metrics, "User metrics not available");
   */
  return null
}

export default function MusicPlayerDemo() {
  return (
    <div className=" w-full overflow-clip mx-auto ">
      <div className="h-full px-8 py-6 mx-auto mt-10">
        <Outlet />
      </div>
    </div>
  );
}


export const links: LinksFunction = () => [
  { rel: "icon", type: "image/svg", href: "/favicons/settings.svg", },
]
