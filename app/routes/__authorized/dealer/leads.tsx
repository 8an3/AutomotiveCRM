import slider from '~/styles/slider.css'
import { Container } from "@radix-ui/themes";
import { Outlet, useLoaderData } from "@remix-run/react";
import React, { useEffect, useState } from "react";
import { commitSession, getSession } from '~/sessions/auth-session.server';
import { prisma } from "~/libs";
import { model } from "~/models";
import Sidebar from "~/components/shared/sidebar";
import { type LinksFunction, json, createCookie, redirect } from "@remix-run/node";
import NotificationSystem from "~/routes/__authorized/dealer/notifications";
import { GetUser } from "~/utils/loader.server";
import secondary from "~/styles/secondary.css";
import global from "~/globals.css";
import useSWR from 'swr';
import axios from 'axios'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog"

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: slider },
  { rel: "icon", type: "image/svg", href: "/favicons/money.svg", },
  { rel: "stylesheet", href: secondary },
  { rel: "stylesheet", href: global },
]



export const loader = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")

  const user = await GetUser(email)
  const notifications = await prisma.notificationsUser.findMany({
    where: { userEmail: email }
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
      <div className="w-[100%] h-[100%] overflow-clip    bg-background border-gray-300 font-bold uppercase  ">
        <Outlet />
      </div>
    </>
  );
}

