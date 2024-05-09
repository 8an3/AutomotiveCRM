import { AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react'
import { json, redirect, type LoaderFunction } from '@remix-run/node';
import { Outlet, useLoaderData } from '@remix-run/react';
import { getSession, commitSession, authSessionStorage, destroySession } from "~/sessions/auth-session.server";
import { GetUser } from "~/utils/loader.server";
import Sidebar, { devSidebarNav } from "~/components/shared/sidebar";
import NotificationSystem from "~/routes/__authorized/dealer/notifications";
import UserSideBar from '~/components/shared/userSideBar';
import { useEffect, useState, useLocation, } from 'react';
import {
  RemixNavLink, Input, Separator, Button, buttonVariants, Tabs, TabsContent, TabsList, TabsTrigger, Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  SearchForm,
} from "~/components"
import { Sheet, SheetClose, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "~/components/ui/userSideBarSheet"
import { getUserIsAllowed } from "~/helpers";
import { Code, Banknote, Laptop, X } from 'lucide-react';


export async function loader({ request }: LoaderFunction) {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")
  let user = await GetUser(email)
  return json({ user, email });
}

interface SettingsLayoutProps {
  children: React.ReactNode
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  const { user, email } = useLoaderData()
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
  return (
    <>

      <Sidebar user={user} email={email} />
      <NotificationSystem />
      <UserSideBar
        user={user}
        email={email}
        // isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
      <div className={`w-[95vw]  flex-1 ${isOpen === true ? 'ml-64' : 'ml-0'}`}>

        <Outlet />
      </div>

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
