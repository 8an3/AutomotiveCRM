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

  return json({ user, email, interruptionsData });
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
      const location = formData.pathname
      return redirect(String(location));
    } catch (error) {
      console.error('Error updating interruption:', error);
      // Handle the error gracefully, such as displaying a message to the user or logging additional information
      throw error; // Rethrow the error to propagate it further if needed
    }
  }

  return json({ user });
};


export default function SettingsLayout() {
  const { user, email, interruptionsData } = useLoaderData()
  const userIsFinance = getUserIsAllowed(user, ["FINANCE"]);
  const userIsDEV = getUserIsAllowed(user, ["DEV"]);
  const userIsADMIN = getUserIsAllowed(user, ["ADMIN"]);
  const userIsMANAGER = getUserIsAllowed(user, ["MANAGER"]);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const pathname = location.pathname
  const openDialog = () => {
    setIsOpen(true);
    console.log(isOpen)

  };

  const closeDialog = () => {
    setIsOpen(false);
  };


  return (
    <>

      {(pathname !== '/dealer/email/dashboardClient' && pathname !== '/dealer/sms/dashMsger') && (
        <>
          <Interruptions
            user={user}
            email={email}
          //  pathname={pathname}
          />
          <UserSideBar
            user={user}
            email={email}
          />
          <Sidebar user={user} email={email} />
          <NotificationSystem interruptionsData={interruptionsData} />
        </>
      )}
      <Outlet />
    </>
  )
}




/***
 *      {isOpen === false && (
          <div
            onClick={() => {
              openDialog();
              setIsOpen(true);
            }}
            className=' fixed left-[25px] top-[25px] cursor-pointer bg-none  text-[#fff]'>
            {user && user?.email === 'skylerzanth@outlook.com' ?
              <Code size={32} color="#fff" strokeWidth={1.5} />
              :
              userIsDEV && user?.email !== 'skylerzanth@outlook.com' ?
                <Code size={32} color="#fff" strokeWidth={1.5} />
                :
                userIsMANAGER && user?.email !== 'skylerzanth@outlook.com' ?
                  <Banknote size={32} color="#fff" strokeWidth={1.5} />
                  :
                  userIsADMIN && user?.email !== 'skylerzanth@outlook.com' ?
                    <Laptop size={32} color="#fff" strokeWidth={1.5} />
                    : ''}
          </div>
        )}
        {isOpen === true && (
          <div
            onClick={closeDialog}
            className=' fixed left-[25px] top-[25px] cursor-pointer bg-none  text-[#fff]'>
            <X size={32} color="#fff" strokeWidth={1.5} />
          </div>
        )}
 *     {isOpen && (
        <UserSideBar
          user={user}
          email={email}
          closeDialog={closeDialog}
          setIsOpen={setIsOpen}
          isOpen={isOpen}
        />
      )}
 *
 *
 *
 *
 *
 *
 *
 *

import { AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react'
import { json, redirect, type LoaderFunction } from '@remix-run/node';
import { Outlet, useLoaderData } from '@remix-run/react';
import { getSession, commitSession, authSessionStorage, destroySession } from "~/sessions/auth-session.server";
import { GetUser } from "~/utils/loader.server";
import Sidebar from "~/components/shared/sidebar";
import NotificationSystem from "~/routes/__authorized/dealer/notifications";
import UserSideBar from '~/components/shared/userSideBar';


export async function loader({ request, params, req }: LoaderFunction) {
  let session = await getSession(request.headers.get("Cookie"));
  let email = session.get("email")
  let expiry = session.get("expiry")
  const currentTime = Date.now();

  const expirationTimeSeconds = expiry

  const expirationTimeMillis = expirationTimeSeconds * 1000;

  if (currentTime > expirationTimeMillis) {
    console.log('Token has expired');
  }
  let user = await GetUser(email)
  if (!user.email) {
    await destroySession(session)
    return redirect('/auth/login')
  }
  if (session.data.length < 5000) { await destroySession(session); session = await getSession(request.headers.get("Cookie")); }
  session.set("email", email);

  if (user) {
    return json({
      user, email,
    },
      {
        headers: {
          'Set-Cookie': await commitSession(session),
        },
      },
    )
  }
  console.log('doesnt have user but has user?')
  return null
}
 * export default function Home() {
  const { user, email } = useLoaderData()
  return (
    <>
      <UserSideBar user={user} email={email} />
      <Sidebar user={user} email={email} />
      <NotificationSystem />
      <Outlet />
    </>
  );
}
 */
