import { isRouteErrorResponse, Outlet, useLoaderData, useRouteError } from "@remix-run/react";

import {
  buttonVariants,
  Debug,

  Icon,
  Logo,
  PageAdminHeader,
  RemixNavLink,
  SearchForm,
  Button
} from "~/components";
import { configAdmin, configSite } from "~/configs";
import { requireUserSession, getUserIsAllowed } from "~/helpers";
import { RootDocumentBoundary } from "~/root";
import { cn, createSitemap } from "~/utils";
import { redirect, json } from "@remix-run/node";
import { prisma } from "~/libs";
import Sidebar, { adminSidebarNav } from "~/components/shared/sidebar";
// <Sidebar />
import type { ActionArgs, LinksFunction, LoaderArgs } from "@remix-run/node";
import { HeaderUserMenu } from "~/components/shared/userNav";
import { getSession, commitSession, destroySession } from '~/sessions/auth-session.server'
import { Separator } from "~/components/ui/separator"
import { SidebarNav } from "~/components/ui/sidebar-nav"
import { model } from "~/models";
import { GetUser } from "~/utils/loader.server";
import base from "~/styles/base.css";

export const links: LinksFunction = () => [
  { rel: "icon", type: "image/svg", sizes: "32x32", href: "/money24.svg", },
  { rel: "icon", type: "image/svg", sizes: "16x16", href: "/money16.svg", },
  { rel: "stylesheet", href: base },
]


export const handle = createSitemap();

export const loader = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")
  let user = await GetUser(email)
  if (!user) { return json({ status: 302, redirect: '/login' }); };
  const symbol = user.positions[0].position
  console.log(symbol, 'useradmin')

  if (symbol !== 'Administrator' && symbol !== 'Manager' && symbol !== 'Editor') {
    return redirect(`/`);
  } else {
    return json({ user, });
  }
}

export async function action({ request }: ActionArgs) {
  const { userIsAllowed } = await requireUserSession(request, [
    "Administrator",
    "Manager",
    "Editor",
  ]);
  if (!userIsAllowed) {
    return redirect(`/`);
  }
}

export default function Route() {
  return (
    <>
      <Sidebar />
      <AdminLayout>
        <Outlet />
      </AdminLayout>
    </>
  );
}

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { notifications, user } = useLoaderData()

  const userIsAllowed = getUserIsAllowed(user, ["ADMIN"]);


  return (
    <>
      <div className="hidden space-y-6 p-10 pb-16 md:block bg-background text-foreground">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Admin</h2>
          <p className="text-muted-foreground">
            Manage your site.
          </p>
          <hr className="my-3 text-muted-foreground" />

        </div>
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/6">
            <SearchForm action="/dealer/admin/search" />
            <hr className="my-3 text-[#09090b]" />

            <SidebarNav items={adminSidebarNav} />
          </aside>
          <div className="flex-1 grow pb-10">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}

