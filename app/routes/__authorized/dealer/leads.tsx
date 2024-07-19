import slider from '~/styles/slider.css'
import { Container } from "@radix-ui/themes";
import { Outlet, useLoaderData } from "@remix-run/react";
import React, { useEffect, useState } from "react";
import { commitSession, getSession } from '~/sessions/auth-session.server';
import { prisma } from "~/libs";
import { model } from "~/models";
import Sidebar from "~/components/shared/sidebar";
import { type LinksFunction, json, createCookie } from "@remix-run/node";
import NotificationSystem from "~/routes/__authorized/dealer/notifications";
import { GetUser } from "~/utils/loader.server";
import secondary from "~/styles/secondary.css";
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
  { rel: "icon", type: "image/svg", sizes: "32x32", href: "/money24.svg", },
  { rel: "icon", type: "image/svg", sizes: "16x16", href: "/money16.svg", },
  { rel: "stylesheet", href: secondary },
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

  /**
  const [open, setOpen] = useState(false);

  const fetcher = async url => await axios.get(url).then(res => res.data)

  const { data: locked, error } = useSWR('/dealer/api/checkLocked', fetcher, {
    refreshInterval: 60000,
    revalidateOnMount: true,
    revalidateOnReconnect: true
  });
  const [lockData, setLockData] = useState();
  const [financeData, setFinanceData] = useState();



  if (error) {
    console.log('SWR error:', error);
  }

  const PubSubProvider = ({ children }) => {
    useEffect(() => {
      if (locked) {
        setLockData(locked.locked)
        setFinanceData(locked.locked)
        setOpen(true);
        console.log(lockData, financeData, 'data')

      }
    }, [locked]);

    return <>{children}</>;
  };
  <PubSubProvider>
  </PubSubProvider>

  {
    lockData && (
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className='border border-border bg-background text-foreground'>
          <AlertDialogHeader>
            <AlertDialogTitle>Client Turnover</AlertDialogTitle>
            <AlertDialogDescription className='grid grid-cols-1'>
              <p>{lockData.customerName}</p>
              <p>{lockData.unit}</p>
              <p>{lockData.note}</p>
              <p>Sales: {lockData.salesEmail} - Finance: {lockData.financeEmail}</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }*/
  return (
    <>
      <div className="w-screen h-screen overflow-x-hidden overflow-y-hidden    bg-background border-gray-300 font-bold uppercase  ">
        <Outlet />
      </div>
    </>
  );
}

