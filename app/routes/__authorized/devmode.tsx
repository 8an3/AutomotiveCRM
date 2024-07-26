import { json, redirect, type LoaderFunction } from '@remix-run/node';
import { Outlet, useLoaderData } from '@remix-run/react';
import { getSession, commitSession, authSessionStorage, destroySession } from "~/sessions/auth-session.server";
import { GetUser } from "~/utils/loader.server";
import { useEffect, useState, } from 'react';
import { getUserIsAllowed } from "~/helpers";
import base from "~/styles/base.css";
import { prisma } from '~/libs';
import { MainDropwdown } from './dealer';

export const links: LinksFunction = () => [
  { rel: "icon", type: "image/svg", sizes: "32x32", href: "/money24.svg", },
  { rel: "icon", type: "image/svg", sizes: "16x16", href: "/money16.svg", },
  { rel: "stylesheet", href: base },
]

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
  return json({ user, email, loadNewLead, interruptionsData });
}

interface SettingsLayoutProps {
  children: React.ReactNode
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  const { user, email, interruptionsData, loadNewLead, getEmails } = useLoaderData()
  const userIsFinance = getUserIsAllowed(user, ["FINANCE"]);
  const userIsDEV = getUserIsAllowed(user, ["DEV"]);
  const userIsADMIN = getUserIsAllowed(user, ["ADMIN"]);
  const userIsMANAGER = getUserIsAllowed(user, ["MANAGER"]);
  const [isOpen, setIsOpen] = useState(false);

  const openDialog = () => {
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
  };
  /**      <Sidebar user={user} email={email} />
      <NotificationSystem />
      <UserSideBar
        user={user}
        email={email}
        // isOpen={isOpen}
        setIsOpen={setIsOpen}
      /> */
  return (
    <>
      <MainDropwdown user={user} email={email} interruptionsData={interruptionsData} loadNewLead={loadNewLead} getEmails={getEmails} />
      <Outlet />
    </>
  )
}


/**
/**
 *
 *
 *
 *       {isOpen === false ? (
            <Button
              onClick={closeDialog}
              variant='ghost'
              className=' fixed left-[25px] top-[25px] cursor-pointer bg-none  text-[#fff]'>
              <X size={32} color="#fff" strokeWidth={1.5} />
            </Button>
          ) : (
            <>
              <Button
                onClick={openDialog}
                variant='ghost'
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
              </Button>
            </>
          )}
 *
 *
 *








<Button
          onClick={openDialog}
          className=' cursor-pointer text-[#fff] left-[25px] top-[25px]  fixed'>
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

          {userIsMANAGER && (
            <Banknote size={32} color="#fff" strokeWidth={1.5} />
          )}

        </Button> */

/**
 *
 */
