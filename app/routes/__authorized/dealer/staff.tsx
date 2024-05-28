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
import { adminSidebarNav, devSidebarNav, managerSidebarNav } from "~/components/shared/sidebar";
import base from "~/styles/base.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: slider },
  { rel: "icon", type: "image/svg", sizes: "32x32", href: "/money24.svg", },
  { rel: "icon", type: "image/svg", sizes: "16x16", href: "/money16.svg", },
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
      title: "Staff Chat",
      to: "/dealer/staff/chat",
    },
    {
      title: "Sales Leaderboard",
      to: "/dealer/staff/leaderboard/sales",
    },
    {
      title: "Accesories Leaderboard",
      to: "/dealer/staff/leaderboard/sales",
    },
    {
      title: "Parts Leaderboard",
      to: "/dealer/staff/leaderboard/sales",
    },
    {
      title: "Service Leaderboard",
      to: "/dealer/staff/leaderboard/sales",
    },
    {
      title: "tech Leaderboard",
      to: "/dealer/staff/leaderboard/sales",
    },

  ]
  return (
    <>
      <div className=" space-y-6 p-10 pb-16 h-screen w-screen">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight text-[#fafafa]">Staff Area</h2>
        </div>
        <div className="  my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/8 text-[#fafafa]">
            <p className='text-[#fafafa]'>Menu</p>
            <hr className="text-[#fafafa] w-[90%] mb-5" />
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
