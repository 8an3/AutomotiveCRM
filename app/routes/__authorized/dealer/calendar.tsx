import React from "react"
import { Outlet, useLoaderData } from "@remix-run/react";
import { UserPlus, CalendarDays, CalendarCheck, Search, ChevronRightIcon, Circle, CalendarPlus } from 'lucide-react'
import { getSession } from '~/sessions/auth-session.server';
import { json, redirect } from "@remix-run/node";
import { prisma } from "~/libs";
import { GetUser } from "~/utils/loader.server";


const CalendarIcon = () => { <CalendarDays strokeWidth={1.5} /> }

export const links = () => [

  { rel: "icon", type: "image/svg", href: '/calendar.svg' },
]


export const loader = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")


  const user = await GetUser(email)
  /// console.log(user, account, 'wquiote loadert')
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
