import slider from '~/styles/slider.css'
import { Container } from "@radix-ui/themes";
import { Outlet, useLoaderData } from "@remix-run/react";
import React from "react";
import { commitSession, getSession } from '~/sessions/auth-session.server';
import { prisma } from "~/libs";
import { model } from "~/models";
import Sidebar from "~/components/shared/sidebar";
import { type LinksFunction, json, createCookie } from "@remix-run/node";
import NotificationSystem from "./_authorized.notifications";
import secondary from '~/styles/secondary.css'
import { GetUser } from "~/utils/loader.server";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: slider },
  { rel: "stylesheet", href: secondary },
];

export const loader = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")

  const user = await GetUser(email)
  const notifications = await prisma.notificationsUser.findMany({
    where: { userId: user.id, }
  })
  const notificationsNewLead = await prisma.notificationsUser.findMany({
    where: { type: 'New Lead', }
  })
  if (!user) { redirect('/login') }
  return json({ user, notifications, notificationsNewLead, });
}

export default function Quote() {
  const { notifications, user } = useLoaderData()
  return (
    <>
      <div className="w-full h-[100vh]   px-2 sm:px-1 lg:px-3 bg-black border-gray-300 font-bold uppercase  ">
        <Sidebar user={user} />
        <NotificationSystem />
        <Outlet />
      </div>
    </>
  );
}
