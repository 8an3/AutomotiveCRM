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

  const sidebarNavItems = [
    {
      title: "Accessories",
      to: "/dealer/docs/accessories",
    },
    {
      title: "Admin",
      to: "/dealer/docs/admin",
    },
    {
      title: "API",
      to: "/dealer/docs/api",
    },
    {
      title: "Finance",
      to: "/dealer/docs/finance",
    },
    {
      title: "Management",
      to: "/dealer/docs/manager",

    },
    {
      title: "Parts",
      to: "/dealer/docs/parts",

    },
    {
      title: "Sales",
      to: "/dealer/docs/sales",

    },
    {
      title: "Service",
      to: "/dealer/docs/service",

    },
    {
      title: "Technician",
      to: "/dealer/docs/technician",

    },

  ]


  return (
    <>
      <div className=" space-y-6 p-10 pb-16 h-screen w-screen">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight text-[#fafafa]">Docs</h2>
          <p className="text-[#fafafa]">
            Where you come to learn anything you don't know.
          </p>
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

export const accDocsSidebarNav = [
  {
    name: "Accessories Dashboard",
    url: "https://youtu.be/dQw4w9WgXcQ?si=15lpKIQVyl2BikPC&t=42",
  },
  {
    name: "Calendar",
    url: "https://youtu.be/dQw4w9WgXcQ?si=15lpKIQVyl2BikPC&t=42",
  },
  {
    name: "Client Profile",
    url: "https://youtu.be/dQw4w9WgXcQ?si=15lpKIQVyl2BikPC&t=42",
  },
]
export const adminDocsSidebarNav = [
  {
    name: "Employee Management",
    url: "https://youtu.be/dQw4w9WgXcQ?si=15lpKIQVyl2BikPC&t=42",
  },
  {
    name: "Export / Import",
    url: "https://youtu.be/dQw4w9WgXcQ?si=15lpKIQVyl2BikPC&t=42",
  },
  {
    name: "Client Profile",
    url: "https://youtu.be/dQw4w9WgXcQ?si=15lpKIQVyl2BikPC&t=42",
  },
]
export const apiDocsSidebarNav = [
  {
    name: "Lead Upload",
    url: "https://youtu.be/dQw4w9WgXcQ?si=15lpKIQVyl2BikPC&t=42",
  },
]
export const financeDocsSidebarNav = [
  {
    name: "Finance Dashboard",
    url: "https://youtu.be/dQw4w9WgXcQ?si=15lpKIQVyl2BikPC&t=42",
  },
  {
    name: "Finance Handover",
    url: "https://youtu.be/dQw4w9WgXcQ?si=15lpKIQVyl2BikPC&t=42",
  },
  {
    name: "Client Profile",
    url: "https://youtu.be/dQw4w9WgXcQ?si=15lpKIQVyl2BikPC&t=42",
  },
  {
    name: "Calendar",
    url: "https://youtu.be/dQw4w9WgXcQ?si=15lpKIQVyl2BikPC&t=42",
  },
]
export const managerDocsSidebarNav = [
  {
    name: "Manager Dashboard",
    url: "https://youtu.be/dQw4w9WgXcQ?si=15lpKIQVyl2BikPC&t=42",
  },
  {
    name: "Export / Import",
    url: "https://youtu.be/dQw4w9WgXcQ?si=15lpKIQVyl2BikPC&t=42",
  },
  {
    name: "CSI Reporting",
    url: "https://youtu.be/dQw4w9WgXcQ?si=15lpKIQVyl2BikPC&t=42",
  },
  {
    name: "Sales Schedule",
    url: "https://youtu.be/dQw4w9WgXcQ?si=15lpKIQVyl2BikPC&t=42",
  },
  {
    name: "Store Hours",
    url: "https://youtu.be/dQw4w9WgXcQ?si=15lpKIQVyl2BikPC&t=42",
  },
  {
    name: "Calendar",
    url: "https://youtu.be/dQw4w9WgXcQ?si=15lpKIQVyl2BikPC&t=42",
  },
  {
    name: "Inventory",
    url: "https://youtu.be/dQw4w9WgXcQ?si=15lpKIQVyl2BikPC&t=42",
  },
  {
    name: "Ad Campaigns",
    url: "https://youtu.be/dQw4w9WgXcQ?si=15lpKIQVyl2BikPC&t=42",
  },
  {
    name: "Ad Manager",
    url: "https://youtu.be/dQw4w9WgXcQ?si=15lpKIQVyl2BikPC&t=42",
  },
  {
    name: "Sales Statistics",
    url: "https://youtu.be/dQw4w9WgXcQ?si=15lpKIQVyl2BikPC&t=42",
  },
  {
    name: "Email Client",
    url: "https://youtu.be/dQw4w9WgXcQ?si=15lpKIQVyl2BikPC&t=42",
  },
  {
    name: "Template Builder",
    url: "https://youtu.be/dQw4w9WgXcQ?si=15lpKIQVyl2BikPC&t=42",
  },
  {
    name: "Doc Builder",
    url: "https://youtu.be/dQw4w9WgXcQ?si=15lpKIQVyl2BikPC&t=42",
  },
  {
    name: "Scripts",
    url: "https://youtu.be/dQw4w9WgXcQ?si=15lpKIQVyl2BikPC&t=42",
  },
  {
    name: "Quotes",
    url: "https://youtu.be/dQw4w9WgXcQ?si=15lpKIQVyl2BikPC&t=42",
  },
  {
    name: "Client Profile",
    url: "https://youtu.be/dQw4w9WgXcQ?si=15lpKIQVyl2BikPC&t=42",
  },
  {
    name: "Sales Tracker / Leaderboard",
    url: "https://youtu.be/dQw4w9WgXcQ?si=15lpKIQVyl2BikPC&t=42",
  },
  {
    name: "Settings",
    url: "https://youtu.be/dQw4w9WgXcQ?si=15lpKIQVyl2BikPC&t=42",
  },
  {
    name: "Automation",
    url: "https://youtu.be/dQw4w9WgXcQ?si=15lpKIQVyl2BikPC&t=42",
  },
]
export const partsDocsSidebarNav = [
  {
    name: "Parts Dashboard",
    url: "https://youtu.be/dQw4w9WgXcQ?si=15lpKIQVyl2BikPC&t=42",
  },
  {
    name: "Client Profile",
    url: "https://youtu.be/dQw4w9WgXcQ?si=15lpKIQVyl2BikPC&t=42",
  },
  {
    name: "Calendar",
    url: "https://youtu.be/dQw4w9WgXcQ?si=15lpKIQVyl2BikPC&t=42",
  },
]
export const salesDocsSidebarNav = [
  {
    name: "Sales Dashboard",
    url: "https://youtu.be/dQw4w9WgXcQ?si=15lpKIQVyl2BikPC&t=42",
  },
  {
    name: "Email Client",
    url: "https://youtu.be/dQw4w9WgXcQ?si=15lpKIQVyl2BikPC&t=42",
  },
  {
    name: "Template Builder",
    url: "https://youtu.be/dQw4w9WgXcQ?si=15lpKIQVyl2BikPC&t=42",
  },
  {
    name: "Doc Builder",
    url: "https://youtu.be/dQw4w9WgXcQ?si=15lpKIQVyl2BikPC&t=42",
  },
  {
    name: "Scripts",
    url: "https://youtu.be/dQw4w9WgXcQ?si=15lpKIQVyl2BikPC&t=42",
  },
  {
    name: "Quotes",
    url: "https://youtu.be/dQw4w9WgXcQ?si=15lpKIQVyl2BikPC&t=42",
  },
  {
    name: "Client Profile",
    url: "https://youtu.be/dQw4w9WgXcQ?si=15lpKIQVyl2BikPC&t=42",
  },
  {
    name: "Sales Tracker / Leaderboard",
    url: "https://youtu.be/dQw4w9WgXcQ?si=15lpKIQVyl2BikPC&t=42",
  },
  {
    name: "Settings",
    url: "https://youtu.be/dQw4w9WgXcQ?si=15lpKIQVyl2BikPC&t=42",
  },
  {
    name: "Automation",
    url: "https://youtu.be/dQw4w9WgXcQ?si=15lpKIQVyl2BikPC&t=42",
  },
  {
    name: "Calendar",
    url: "https://youtu.be/dQw4w9WgXcQ?si=15lpKIQVyl2BikPC&t=42",
  },
  {
    name: "Inventory",
    url: "https://youtu.be/dQw4w9WgXcQ?si=15lpKIQVyl2BikPC&t=42",
  },
]
export const serviceDocsSidebarNav = [
  {
    name: "Service Dashboard",
    url: "https://youtu.be/dQw4w9WgXcQ?si=15lpKIQVyl2BikPC&t=42",
  },
  {
    name: "Calendar",
    url: "https://youtu.be/dQw4w9WgXcQ?si=15lpKIQVyl2BikPC&t=42",
  },
  {
    name: "Client Profile",
    url: "https://youtu.be/dQw4w9WgXcQ?si=15lpKIQVyl2BikPC&t=42",
  },
]
export const techDocsSidebarNav = [
  {
    name: "Technician Dashboard",
    url: "https://youtu.be/dQw4w9WgXcQ?si=15lpKIQVyl2BikPC&t=42",
  },
  {
    name: "Calendar",
    url: "https://youtu.be/dQw4w9WgXcQ?si=15lpKIQVyl2BikPC&t=42",
  },
  {
    name: "Workorders",
    url: "https://youtu.be/dQw4w9WgXcQ?si=15lpKIQVyl2BikPC&t=42",
  },
]
