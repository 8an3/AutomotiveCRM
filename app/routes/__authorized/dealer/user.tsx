import { Container } from "@radix-ui/themes";
import { Outlet, useLoaderData } from "@remix-run/react";
import React from "react";
import { getSession } from '~/sessions/auth-session.server';
import { GetUser } from "~/utils/loader.server";
import { prisma } from "~/libs";
import { model } from "~/models";
import Sidebar from "~/components/shared/sidebar";
import { LinksFunction, json } from "@remix-run/node";
import NotificationSystem from "~/routes/__authorized/dealer/notifications";
import slider from '~/styles/slider.css'
import secondary from '~/styles/secondary.css'
import { Separator } from "~/components/ui/separator"
import { SidebarNav } from "~/components/ui/sidebar-nav"
import { getUserIsAllowed } from "~/helpers";


export const links: LinksFunction = () => [
  { rel: "stylesheet", href: slider },
  { rel: "stylesheet", href: secondary },
];

export const loader = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")
  const user = await GetUser(email)

  const notifications = await prisma.notificationsUser.findMany({
    where: {
      userId: user.id,
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


  const sidebarNavItems = [
    {
      title: "Change Password",
      to: "/dealer/user/dashboard/password",
    },
    {
      title: "Docs",
      to: "/dealer/user/docs",
    },
    {
      title: "Log out",
      to: "/auth/logout",
    },

  ]
  const adminSidebarNav = [
    {
      title: "Admin",
      to: "/dealer/admin",
    },
    {
      title: "Manager",
      to: "/dealer/manager",
    },
    {
      title: "CSI",
      to: "/dealer/csi",
    },

  ]
  const devSidebarNav = [
    {
      title: "Control Panel",
      to: "/devmode/controlPanel",
    },
    {
      title: "Clients",
      to: "/devmode/clients",
    },
    {
      title: "CSI",
      to: "/dealer/csi",
    },

  ]
  const managerSidebarNav = [
    {
      title: "Control Panel",
      to: "/devmode/controlPanel",
    },
    {
      title: "Clients",
      to: "/devmode/clients",
    },
    {
      title: "CSI",
      to: "/dealer/csi",
    },

  ]
  return (
    <>
      <div className="hidden space-y-6 p-10 pb-16 md:block">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">User Settings</h2>
          <p className="text-muted-foreground">
            Manage your account settings and set e-mail preferences.
          </p>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
            {userIsAllowed ? (
              <>
                <p className="text-muted-foreground mt-3">
                  Admin Menu
                </p>
                <hr className="solid" />
                <SidebarNav items={adminSidebarNav} />
              </>
            ) : (null)}
            {devIsAllowed ? (
              <>
                <p className="text-muted-foreground mt-3">
                  Dev Menu
                </p>
                <hr className="solid" />
                <SidebarNav items={devSidebarNav} />
              </>
            ) : (null)}
            {managerIsAllowed ? (
              <>
                <p className="text-muted-foreground mt-3">
                  Manager Menu
                </p>
                <hr className="solid" />
                <SidebarNav items={managerSidebarNav} />
              </>
            ) : (null)}
          </aside>
          <div className="flex-1 overflow-y-scroll overflow-x-hidden w-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}
