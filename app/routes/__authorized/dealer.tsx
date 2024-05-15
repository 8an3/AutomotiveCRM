import { AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react'
import { json, redirect, type LoaderFunction } from '@remix-run/node';
import { Outlet, useLoaderData } from '@remix-run/react';
import { getSession, commitSession, authSessionStorage, destroySession } from "~/sessions/auth-session.server";
import { GetUser } from "~/utils/loader.server";
import NotificationSystem from "~/routes/__authorized/dealer/notifications";

import Sidebar, { managerSidebarNav, adminSidebarNav, devSidebarNav, } from '~/components/shared/sidebar'
import { Code, Banknote, Laptop, X } from 'lucide-react';
import { getUserIsAllowed } from "~/helpers";
import { useEffect, useState, } from 'react';
import { Sheet, SheetClose, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "~/components/ui/userSideBarSheet"
import { Button } from '~/components';
import UserSideBar from '~/components/shared/userSideBar';

export async function loader({ request }: LoaderFunction) {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")
  let user = await GetUser(email)
  return json({ user, email });
}

export default function SettingsLayout() {
  const { user, email } = useLoaderData()
  const userIsFinance = getUserIsAllowed(user, ["FINANCE"]);
  const userIsDEV = getUserIsAllowed(user, ["DEV"]);
  const userIsADMIN = getUserIsAllowed(user, ["ADMIN"]);
  const userIsMANAGER = getUserIsAllowed(user, ["MANAGER"]);
  const [isOpen, setIsOpen] = useState(false);

  const openDialog = () => {
    setIsOpen(true);
    console.log(isOpen)

  };

  const closeDialog = () => {
    setIsOpen(false);
  };
  return (
    <>
      <UserSideBar
        user={user}
        email={email}
      />
      <Sidebar user={user} email={email} />
      <NotificationSystem />

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
