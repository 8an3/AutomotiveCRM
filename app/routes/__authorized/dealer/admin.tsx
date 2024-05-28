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
  const symbol = user.role.symbol
  if (symbol !== 'ADMIN' && symbol !== 'MANAGER' && symbol !== 'EDITOR') {
    return redirect(`/`);
  } else {
    return json({ user, });
  }
}

export async function action({ request }: ActionArgs) {
  const { userIsAllowed } = await requireUserSession(request, [
    "ADMIN",
    "MANAGER",
    "EDITOR",
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
      <div className="hidden space-y-6 p-10 pb-16 md:block bg-[#09090b] text-[#fafafa]">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Admin</h2>
          <p className="text-muted-foreground">
            Manage your site.
          </p>
          <hr className="my-3 text-[#27272a]" />

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


export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    let message;
    switch (error.status) {
      case 401:
        message = `Sorry, you can't access this page.`;
        break;
      case 404:
        message = `Sorry, this page is not available.`;
        break;
      default:
        throw new Error(error.data || error.statusText);
    }
    return (
      <RootDocumentBoundary title={message}>
        <AdminLayout>
          <PageAdminHeader size="sm">
            <h1 className='text-[#fafafa]'>Error {error.status}</h1>
            {error.statusText && <h2>{error.statusText}</h2>}
            <p className='text-[#fafafa]'>{message}</p>
          </PageAdminHeader>
          <section className="px-layout space-y-2">
            <p className='text-[#fafafa]'>Here's the error information that can be informed to Rewinds.</p>
            <Debug className='text-[#fafafa]' name="error.data" isAlwaysShow isCollapsibleOpen>
              {error.data}
            </Debug>
          </section>
        </AdminLayout>
      </RootDocumentBoundary>
    );
  } else if (error instanceof Error) {
    return (
      <RootDocumentBoundary title="Sorry, unexpected error occured.">
        <AdminLayout>
          <PageAdminHeader size="sm">
            <h1 className='text-[#fafafa]'>Error from {configSite.name}</h1>
          </PageAdminHeader>
          <section className="px-layout space-y-2">
            <p className='text-[#fafafa]'>Here's the error information that can be informed to Rewinds.</p>

            <pre className='text-[#fafafa]'>{error.message}</pre>
            <Debug name="error" isAlwaysShow isCollapsibleOpen>
              {error}
            </Debug>

            <p className='text-[#fafafa]'>The stack trace is:</p>
            <Debug className='text-[#fafafa]' name="error.stack" isAlwaysShow isCollapsibleOpen>
              {error.stack}
            </Debug>
          </section>
        </AdminLayout>
      </RootDocumentBoundary>
    );
  } else {
    return (
      <AdminLayout>
        <h1 className='text-[#fafafa]'>Unknown Error</h1>
      </AdminLayout>
    );
  }
}
