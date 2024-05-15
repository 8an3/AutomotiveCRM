import { isRouteErrorResponse, Outlet, useRouteError } from "@remix-run/react";

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
import { requireUserSession } from "~/helpers";
import { RootDocumentBoundary } from "~/root";
import { cn, createSitemap } from "~/utils";
import { redirect, json } from "@remix-run/node";
import { prisma } from "~/libs";
import Sidebar from "~/components/shared/sidebar";
// <Sidebar />
import type { ActionArgs, LinksFunction, LoaderArgs } from "@remix-run/node";
import { HeaderUserMenu } from "~/components/shared/userNav";
import { getSession, commitSession, destroySession } from '~/sessions/auth-session.server'

import { model } from "~/models";
import secondary from '~/styles/secondary.css'

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: secondary },

];

export const handle = createSitemap();

export const loader = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")

  let user = await prisma.user.findUnique({
    where: {
      email: email
    }
  });
  /// console.log(user, account, 'wquiote loadert')
  if (!user) {
    redirect('/login')
  }
  if (email) {
    try {
      user = await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          name: true,
          username: true,
          email: true,
          subscriptionId: true,
          customerId: true,
          returning: true,
          phone: true,
          role: { select: { symbol: true, name: true } },
          profile: {
            select: {
              id: true,
              headline: true,
              bio: true,
            },
          },
        },
      });
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  }
  const notifications = await prisma.notificationsUser.findMany({ where: { userId: user.id, } })
  if (!user) { return json({ status: 302, redirect: '/login' }); };
  const symbol = user.role.symbol
  if (symbol !== 'ADMIN' && symbol !== 'MANAGER' && symbol !== 'EDITOR') {
    return redirect(`/`);
  } else {
    return json({ user, notifications });
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

// Admin doesn't need separated Layout component
// Becaus this is already the Layout route for all admin routes
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
  return (
    <div className="flex">
      <AdminSidebar />
      <main className="grow pb-10">{children}</main>
    </div>
  );
}

export function AdminSidebar() {
  return (
    <aside
      className={cn(
        "hidden sm:block",
        "sticky top-0 h-screen ", // sticky sidebar
        "w-[200px] space-y-4 p-2 sm:flex sm:flex-col sm:p-4",
        "border-r-2 border-surface-200 bg-[#151518] dark:border-surface-700 dark:bg-surface-900"
      )}
    >
      <div className="queue-center justify-between">
        <RemixNavLink
          prefetch="intent"
          to="/admin"
          className="block min-w-fit transition-opacity hover:opacity-80 text-[#fafafa]"
        >
          <Logo className='text-[#fafafa]' text="Admin" />
        </RemixNavLink>

      </div>

      <div className="grow space-y-2 mx-auto">
        <SearchForm action="/admin/search" />
        <RemixNavLink to='/admin' >
          <Button variant="link" className="w-full justify-start hover:text-[#02a9ff] text-[#c2e6ff]  cursor-pointer"  >
            Overview
          </Button>
        </RemixNavLink>
        <RemixNavLink to='users' >
          <Button variant="link" className="w-full justify-start hover:text-[#02a9ff] text-[#c2e6ff]  cursor-pointer"  >
            Users
          </Button>
        </RemixNavLink>
        <RemixNavLink to='images' >
          <Button variant="link" className="w-full justify-start hover:text-[#02a9ff] text-[#c2e6ff]  cursor-pointer"  >
            Images
          </Button>
        </RemixNavLink>
        <RemixNavLink to='import/motorcycle' >
          <Button variant="link" className="w-full justify-start hover:text-[#02a9ff] text-[#c2e6ff]  cursor-pointer"  >
            Import / Export Motor
          </Button>
        </RemixNavLink>
        <RemixNavLink to='import/parts' >
          <Button variant="link" className="w-full justify-start hover:text-[#02a9ff] text-[#c2e6ff]  cursor-pointer"  >
            Import / Export Parts
          </Button>
        </RemixNavLink>
        <RemixNavLink to='import/accs' >
          <Button variant="link" className="w-full justify-start hover:text-[#02a9ff] text-[#c2e6ff]  cursor-pointer"  >
            Import / Export Accs
          </Button>
        </RemixNavLink>
        <RemixNavLink to='import/leads' >
          <Button variant="link" className="w-full justify-start hover:text-[#02a9ff] text-[#c2e6ff]  cursor-pointer"  >
            Import / Export Leads
          </Button>
        </RemixNavLink>
        <RemixNavLink to='notes' >
          <Button variant="link" className="w-full justify-start hover:text-[#02a9ff] text-[#c2e6ff]  cursor-pointer"  >
            Notes
          </Button>
        </RemixNavLink>
        <RemixNavLink to='/leads' >
          <Button variant="link" className="w-full justify-start hover:text-[#02a9ff] text-[#c2e6ff]  cursor-pointer"  >
            Search Leads
          </Button>
        </RemixNavLink>
        <RemixNavLink to='/admin/search' >
          <Button variant="link" className="w-full justify-start hover:text-[#02a9ff] text-[#c2e6ff]  cursor-pointer"  >
            Search on Admin
          </Button>
        </RemixNavLink>
        <RemixNavLink to='/' >
          <Button variant="link" className="w-full justify-start hover:text-[#02a9ff] text-[#c2e6ff]  cursor-pointer"  >
            Go to site
          </Button>
        </RemixNavLink>

      </div>
    </aside>
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
