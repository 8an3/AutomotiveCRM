import { Outlet, useLoaderData } from "@remix-run/react";
import { getSession } from '~/sessions/auth-session.server';
import { GetUser } from "~/utils/loader.server";
import { prisma } from "~/libs";
import { LinksFunction, json, redirect } from "@remix-run/node";
import slider from '~/styles/slider.css'
import secondary from '~/styles/secondary.css'
import {
  Separator, Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components"
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

            <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  Menu
                </AccordionTrigger>
                <AccordionContent>
                  <SidebarNav items={sidebarNavItems} />
                </AccordionContent>
              </AccordionItem>
              {userIsAllowed ? (
                <AccordionItem value="item-2">
                  <AccordionTrigger>
                    Admin Menu
                  </AccordionTrigger>
                  <AccordionContent>
                    <SidebarNav items={adminSidebarNav} />
                  </AccordionContent>
                </AccordionItem>
              ) : (null)}
              {devIsAllowed ? (
                <AccordionItem value="item-3">
                  <AccordionTrigger>
                    Dev Menu
                  </AccordionTrigger>
                  <AccordionContent>
                    <SidebarNav items={devSidebarNav} />
                  </AccordionContent>
                </AccordionItem>
              ) : (null)}
              {managerIsAllowed ? (
                <AccordionItem value="item-4">
                  <AccordionTrigger>
                    Manager Menu
                  </AccordionTrigger>
                  <AccordionContent>
                    <SidebarNav items={managerSidebarNav} />
                  </AccordionContent>
                </AccordionItem>
              ) : (null)}
            </Accordion>
          </aside>
          <div className="flex-1 overflow-y-scroll overflow-x-hidden w-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}
