import slider from '~/styles/slider.css'
import { Container } from "@radix-ui/themes";
import { Outlet, useLoaderData } from "@remix-run/react";
import React from "react";
import { commitSession, getSession } from '~/sessions/auth-session.server';
import { prisma } from "~/libs";
import { model } from "~/models";
import Sidebar from "~/components/shared/sidebar";
import { type LinksFunction, json, createCookie } from "@remix-run/node";
import NotificationSystem from "~/routes/__authorized/dealer/notifications";
import { GetUser } from "~/utils/loader.server";
import secondary from "~/styles/secondary.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: slider },
  { rel: "icon", type: "image/svg", sizes: "32x32", href: "/money24.svg", },
  { rel: "icon", type: "image/svg", sizes: "16x16", href: "/money16.svg", },
  { rel: "stylesheet", href: secondary },
]



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
      <div className="w-screen h-screen     bg-[#09090b] border-gray-300 font-bold uppercase  ">

        <Outlet />
      </div>
    </>
  );
}
