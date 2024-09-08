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
import base from "~/styles/base.css";
import chair from '~/images/favicons/chair.svg'

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: slider },
  { rel: "icon", type: "image/svg", href: chair },
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


  const sidebarNavItems = [
    {
      title: "Staff Messenger",
      to: "/dealer/staff/chat",
    },
    {
      title: "Leaderboard",
      to: "/dealer/staff/leaderboard",
    },
  ]
  return (
    <>
      <div className=" space-y-6 p-10 pb-16 h-screen w-screen">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Staff Lounge</h2>
          <hr className="text-border border-border bg-border w-[90%] mb-5" />

        </div>
        <div className="  my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-[200px] text-foreground">
            <p className='text-foreground'>Menu</p>
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
