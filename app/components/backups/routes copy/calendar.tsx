import React from "react"
import { Outlet } from "@remix-run/react"
import stylesheet from '~/styles/styles.css'
import { UserPlus, CalendarDays, CalendarCheck, Search, ChevronRightIcon, Circle, CalendarPlus } from 'lucide-react'
import Sidebar from "~/components/shared/sidebar";
// <Sidebar />
import { requireAuthCookie } from '~/utils/misc.user.server';
import { model } from '~/models'

const CalendarIcon = () => { <CalendarDays strokeWidth={1.5} /> }

export const links = () => [

  { rel: "icon", type: "image/svg", href: '/calendar.svg' },
]


export const loader = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")


  const user = await prisma.user.findUnique({
    where: { email: email },
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      subscriptionId: true,
      customerId: true,
      returning: true,
      phone: true,
      dealer: true,
      position: true,
      roleId: true,
      profileId: true,
      omvicNumber: true,
      role: { select: { symbol: true, name: true } },
    },
  });
  /// console.log(user, account, 'wquiote loadert')
  if (!user) {
    redirect('/login')
  }
  return user
}

export default function CustMaIN() {
  return (
    <>
      <Sidebar />
      <div className="mt-5 mb-5 bg-slate1" >
        <div className="w-[95%] h-[95%] my-auto mx-auto">
          <Outlet />
        </div>
      </div>
    </>
  )
}
