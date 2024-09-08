import { Outlet, useLoaderData } from "@remix-run/react";
import { getSession } from '~/sessions/auth-session.server';
import { GetUser } from "~/utils/loader.server";
import { prisma } from "~/libs";
import { LinksFunction, json, redirect } from "@remix-run/node";
import slider from '~/styles/slider.css'
import {
  Separator, Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components"
import { SidebarNav } from "~/components/ui/sidebar-nav"
import { getUserIsAllowed } from "~/helpers";
import { adminSidebarNav, devSidebarNav, managerSidebarNav } from "~/components/zRoutes/oldComps/sidebar";
import base from "~/styles/base.css";
import user from '~/images/favicons/user.svg'


export const links: LinksFunction = () => [
  { rel: "stylesheet", href: slider },
  { rel: "icon", type: "image/svg", href: user },
  { rel: "stylesheet", href: base },
]

export const loader = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")
  const user = await GetUser(email)

  const notifications = await prisma.notificationsUser.findMany({
    where: {
      userEmail: email
    }
  })
  if (!user) {
    redirect('/login')
  }
  return json({ user, notifications });
}

export default function Quote() {
  const { notifications, user } = useLoaderData()
  // <Sidebar user = { user } />
  // <NotificationSystem notifications={notifications} />
  //
  const userIsAllowed = getUserIsAllowed(user, ["ADMIN"]);
  const devIsAllowed = getUserIsAllowed(user, ["DEV"]);
  const managerIsAllowed = getUserIsAllowed(user, ["MANAGER"]);

  /**   {
      title: "Docs",
      to: "/dealer/docs/sales",
    }, */
  const sidebarNavItems = [
    {
      title: "Settings",
      to: "/dealer/user/dashboard/settings",
    },
    {
      title: "Roadmap",
      to: "/dealer/user/dashboard/roadmap",
    },
    {
      title: "Board",
      to: "/dealer/user/dashboard/board",
    },
    {
      title: "Scripts",
      to: "/dealer/user/dashboard/scripts",
    },
    {
      title: "Template Builder",
      to: "/dealer/user/dashboard/templates",
    },
    {
      title: "Document Builder",
      to: "/dealer/document/builder/client",
    },
    {
      title: "Finance Products",
      to: "/dealer/user/dashboard/finance/board",
    },
    {
      title: "Contact",
      to: "/dealer/user/dashboard/contact",
    },
    {
      title: "Getting Started",
      to: "/dealer/user/dashboard/gettingStarted",
    },
  ]
  return (
    <>
      <div className=" space-y-6 p-10 pb-16 h-screen w-screen">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">User Settings</h2>
          <Separator className="text-border border-border bg-border w-[95%] mb-5" />

        </div>
        <div className="  my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-64 text-foreground">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex-1  w-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}
