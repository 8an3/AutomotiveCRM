import { AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react'
import { json, redirect, type LoaderFunction, type ActionFunction } from '@remix-run/node';
import { Outlet, useLoaderData, useLocation } from '@remix-run/react';
import { getSession, commitSession, authSessionStorage, destroySession } from "~/sessions/auth-session.server";
import { GetUser } from "~/utils/loader.server";
import NotificationSystem from "~/routes/__authorized/dealer/notifications";
import { prisma } from '~/libs';

import Sidebar, { managerSidebarNav, adminSidebarNav, devSidebarNav, } from '~/components/shared/sidebar'
import { Code, Banknote, Laptop, X } from 'lucide-react';
import { getUserIsAllowed } from "~/helpers";
import { useEffect, useState, } from 'react';
import { Sheet, SheetClose, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "~/components/ui/userSideBarSheet"
import { Button } from '~/components';
import UserSideBar from '~/components/shared/userSideBar';
import Interruptions from '~/components/shared/interruptions';
import financeFormSchema from '~/overviewUtils/financeFormSchema';

export async function loader({ request }: LoaderFunction) {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")
  let user = await GetUser(email)
  const interruptionsData = await prisma.interruptions.findMany({ where: { userEmail: email, read: 'false' } });
  const getLeads = await prisma.notificationsUser.findMany({
    where: {
      reads: {
        some: {
          userEmail: email,
        },
      },
      type: 'New Lead',
    },
    include: {
      reads: {
        where: {
          userEmail: email,
        },
        select: {
          read: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc', // Optional: Order by creation date
    },
  });
  const getloadNewLead = () => {
    return getLeads.map(notification => ({
      ...notification,
      read: notification.reads[0]?.read || false, // Extract read status
    }));
  }
  const loadNewLead = getloadNewLead()
  return json({ user, email, interruptionsData, loadNewLead });
}

export async function action({ request, params }: ActionFunction) {
  const formPayload = Object.fromEntries(await request.formData())
  const formData = financeFormSchema.parse(formPayload);
  const session = await getSession(request.headers.get('Cookie'));
  const email = session.get('email')
  const user = await GetUser(email)
  const location = String(formData.pathname)
  const title = ''
  const date = new Date()
  const options = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  };
  if (formData.intent === 'createInterruption') {
    console.log('dealerdealer')
    const url = '/dealer/quote/new/Harley-Davidson';
    const segments = url.split('/');
    const firstTwoParams = `/${segments[1]}/${segments[2]}`;
    const threeParams = `/${segments[1]}/${segments[2]}/${segments[3]}`;
    let title;
    switch (firstTwoParams) {
      case '/dealer/customer':
        const customer = await prisma.finance.findUnique({
          where: { id: segments[2] }
        })
        title = `${customer.firstName} ${customer.lastName}`
        break;
      case '/dealer/email':
        title = `Was in the email client.`
        break;
      case '/dealer/admin':
        title = `Was in the admin section.`
        break;
      case '/dealer/calendar':
        title = `Was on the calendar.`
        break;
      case '/dealer/docs':
        title = `Was going over the docs.`
        break;
      case '/dealer/document':
        title = `Was building a document.`
        break;
      case '/dealer/editor':
        title = `Was creating a template.`
        break;
      case '/dealer/inventory':
        title = `Was going over inventory.`
        break;
      case '/dealer/leads':
        title = `Was working on the dashboard.`
        break;
      case '/dealer/manager':
        title = `Was in the manager section.`
        break;
      default:
        title = location
    }

    const saveInt = await prisma.interruptions.create({
      data: {
        userEmail: user?.email,
        location: location,
        date: date.toLocaleDateString('en-US', options),
        title: title,
        read: 'false'
      }
    })
    return saveInt
  }
  if (formData.intent === 'updateInterruption') {
    try {
      console.log('dealerdealer');
      await prisma.interruptions.update({
        where: { id: formData.id },
        data: {
          read: 'true'
        }
      });
      //const finance = await prisma
      const location = formData.pathname //'/dealer/leads/sales'
      return redirect(String(location));
    } catch (error) {
      console.error('Error updating interruption:', error);
      // Handle the error gracefully, such as displaying a message to the user or logging additional information
      throw error; // Rethrow the error to propagate it further if needed
    }
  }
  if (formData.intent === 'updateNewLead') {
    await prisma.notificationsUser.update({
      where: { id: formData.id },
      data: {
        read: 'true'
      }
    });
    const location = `/dealer/leads/sales/newLeads`
    return redirect(location);
  }


  return null
};

export default function SettingsLayout() {
  const { user, email, interruptionsData, loadNewLead } = useLoaderData()
  const location = useLocation();
  const pathname = location.pathname

  return (
    <>
      {(pathname !== '/dealer/email/dashboardClient' && pathname !== '/dealer/sms/dashMsger') && (
        <>
          <Interruptions user={user} email={email} />
          <UserSideBar user={user} email={email} />
          <Sidebar user={user} email={email} />
          <NotificationSystem interruptionsData={interruptionsData} loadNewLead={loadNewLead} />
        </>
      )}
      <Outlet />
    </>
  )
}

