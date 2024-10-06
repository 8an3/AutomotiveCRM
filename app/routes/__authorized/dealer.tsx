import { json, redirect, type LoaderFunction, type ActionFunction } from '@remix-run/node';
import { Outlet, useFetcher, useLoaderData, useLocation, NavLink, useSubmit, Form } from '@remix-run/react';
import { getSession, commitSession, authSessionStorage, destroySession } from "~/sessions/auth-session.server";
import { GetUser } from "~/utils/loader.server";
import NotificationSystem from "~/routes/__authorized/dealer/systems/notifications";
import { prisma } from '~/libs';
//import Sidebar, { managerSidebarNav, adminSidebarNav, devSidebarNav, } from '~/components/shared/sidebar'
import { Theme, useTheme } from "remix-themes";

import UserSideBar from '~/components/zRoutes/oldComps/userSideBar';
import Interruptions from '~/components/shared/interruptions';
import financeFormSchema from '~/overviewUtils/financeFormSchema';
import GetData from '../../components/zRoutes/oldRoutes/notifications.client';
import SearchFunction from './dealer/search';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { Menu, Search } from 'lucide-react';
import { cn } from "~/components/ui/utils"
import {
  RemixNavNavLink, Separator, Button, buttonVariants, Tabs, TabsContent, TabsList, TabsTrigger,
} from "~/components"
import { useEffect, useRef, useState } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip"
import { getUserIsAllowed } from "~/helpers";

import { ButtonIcon } from "~/components";
import { Moon, Sun } from "~/images/icons";
import SearchFunction2 from './dealer/searchTable';
import useSWR from 'swr';
import SearchByOrderFunction from './dealer/searchByOrder';
import { toast } from 'sonner';
import Warning from '~/overviewUtils/images/warning.svg'
import MainDropwdown from '~/components/shared/dropdownNav'

export async function loader({ request, params }: LoaderFunction) {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")
  let user = await GetUser(email)
  const interruptionsData = await prisma.interruptions.findMany({ where: { userEmail: email } });
  const notifications = await prisma.notificationsUser.findMany({
    where: { userEmail: email, },
    select: {
      id: true,
      createdAt: true,
      updatedAt: true,
      title: true,
      content: true,
      dismiss: true,
      type: true,
      subType: true,
      financeId: true,
      clientfileId: true,
      to: true,
      from: true,
      userEmail: true,
      customerName: true,
      read: true,
    },
    orderBy: { createdAt: 'desc', },
  });
  const host = request.headers.get('host');
  return json({ user, email, interruptionsData, notifications, host });
}

export async function action({ request, params }: ActionFunction) {
  const formPayload = Object.fromEntries(await request.formData())
  const formData = financeFormSchema.parse(formPayload);
  const session = await getSession(request.headers.get('Cookie'));
  const email = session.get('email')
  const user = await GetUser(email)
  const location = String(formData.pathname)
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
      const location = formData.pathname
      return redirect(String(location));
    } catch (error) {
      console.error('Error updating interruption:', error);
      throw error;
    }
  }
  if (formData.intent === 'updateNewLead') {
    await prisma.notificationsUser.update({
      where: { id: formData.notificationId },
      data: {
        read: true
      }
    });
    const location = `/dealer/leads/sales/newLeads`
    return redirect(location);
  }
  if (formData.intent === 'newLead') {
    await prisma.notificationsUser.update({
      where: { id: formData.notificationId },
      data: {
        read: true
      }
    })
    return redirect(formData.navigate)
  }
  if (formData.intent === 'newInterruption') {
    await prisma.interruptions.update({
      where: { id: formData.notificationId },
      data: {
        read: 'true'
      }
    })
    return redirect(formData.navigate)
  }
  if (formData.intent === 'newMsg') {
    await prisma.notificationsUser.update({
      where: { id: formData.notificationId },
      data: {
        read: true
      }
    })
    return redirect(formData.navigate)
  }
  if (formData.intent === 'newUpdate') {
    await prisma.notificationsUser.update({
      where: { id: formData.notificationId },
      data: {
        read: true
      }
    })
    return redirect(formData.navigate)
  }
  return null
};

export default function SettingsLayout() {
  const { user, email, interruptionsData, loadNewLead, getEmails, notifications, host } = useLoaderData()
  const location = useLocation();
  const pathname = location.pathname

  return (
    <>
      {pathname !== '/dealer/email/dashboardClient' && (
        <>
          {!pathname.startsWith('/dealer/accessories/') && <SearchByOrderFunction />}
          <SearchFunction />
          <MainDropwdown user={user} email={email} interruptionsData={interruptionsData} loadNewLead={loadNewLead} getEmails={getEmails} notifications={notifications} host={host} />
        </>
      )}
      <Outlet />
    </>

  )
}
