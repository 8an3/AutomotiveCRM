import { Container } from "@radix-ui/themes";
import { Outlet, useLoaderData } from "@remix-run/react";
import React from "react";
import { getSession } from '~/sessions/auth-session.server';
import { prisma } from "~/libs";
import { model } from "~/models";
import Sidebar from "~/components/shared/sidebar";
import { json } from "@remix-run/node";
import NotificationSystem from "./_authorized.notifications";

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

export default function Quote() {
  const { notifications, user } = useLoaderData()
  // <Sidebar user = { user } />
  // <NotificationSystem notifications={notifications} />
  //
  return (
    <>
      <div className="w-full h-[100vh]   px-2 sm:px-1 lg:px-3   border-gray-300 font-bold uppercase  ">

        <Outlet />
      </div>
    </>
  );
}
