import React from "react"
import { Outlet, useLoaderData } from "@remix-run/react";
import { UserPlus, CalendarDays, CalendarCheck, Search, ChevronRightIcon, Circle, CalendarPlus } from 'lucide-react'
import { getSession } from '~/sessions/auth-session.server';
import { json, redirect } from "@remix-run/node";
import { prisma } from "~/libs";
import { GetUser } from "~/utils/loader.server";
import secondary from "~/styles/secondary.css";

export const links: LinksFunction = () => [
  { rel: "icon", type: "image/svg", href: '/calendar.svg' },
  { rel: "stylesheet", href: secondary },
]



const CalendarIcon = () => { <CalendarDays strokeWidth={1.5} /> }



export const loader = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")


  const user = await GetUser(email)
  /// console.log(user, account, 'wquiote loadert')
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

export default function CustMaIN() {

  const { notifications, user } = useLoaderData()

  return (
    <>
      <div className="h-screen w-screen overflow-hidden">
        <Outlet />
      </div>
    </>
  )
}
