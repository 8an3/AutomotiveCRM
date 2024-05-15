/* eslint-disable tailwindcss/no-custom-classname */
/* eslint-disable tailwindcss/classnames-order */
/* eslint-disable jsx-a11y/alt-text */
import { Form, Link, useLoaderData, useLocation, useFetcher } from '@remix-run/react';
import {
  RemixNavLink, Input, Separator, Button, buttonVariants, Tabs, TabsContent, TabsList, TabsTrigger, Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  SearchForm,

} from "~/components"
import { Sheet as RootSheet, Sheet, SheetClose, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "~/components/ui/userSideBarSheet"
import { getUserIsAllowed } from "~/helpers";
import { toast } from 'sonner';
import { Code, Banknote, Laptop, X } from 'lucide-react';
import { useEffect, useState, } from 'react';
import { SidebarNav } from "~/components/ui/sidebar-nav"
import { managerSidebarNav, adminSidebarNav, devSidebarNav } from '~/components/shared/sidebar'

export default function UserSideBar(user: any, email: any,) {
  const userIsFinance = getUserIsAllowed(user, ["FINANCE"]);
  const userIsDEV = getUserIsAllowed(user, ["DEV"]);
  const userIsADMIN = getUserIsAllowed(user, ["ADMIN"]);
  const userIsMANAGER = getUserIsAllowed(user, ["MANAGER"]);
  return (
    <>
      <Sheet modal={false}  >
        <SheetTrigger>
          <div
            onClick={() => {
              openDialog()
            }}
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
          </div>
        </SheetTrigger>

        <SheetContent side='left' className='bg-[#09090b] w-full md:w-[50%] overflow-y-auto' >
          <SheetHeader>
            <SheetTitle>
              <h2>
                {user && user?.email === 'skylerzanth@outlook.com' ? 'DEV MODE' :
                  userIsDEV && user?.email !== 'skylerzanth@outlook.com' ? 'DEV MODE' :
                    userIsMANAGER && user?.email !== 'skylerzanth@outlook.com' ? 'Manager Menu' :
                      userIsADMIN && user?.email !== 'skylerzanth@outlook.com' ? 'Admin Menu' :
                        ''}
              </h2>
            </SheetTitle>
            <SheetDescription>
              <h2>
                {user && user?.email === 'skylerzanth@outlook.com' ? 'yeeeet motherfucker!' :
                  userIsDEV && user?.email !== 'skylerzanth@outlook.com' ? 'yeeeet!' :
                    userIsMANAGER && user?.email !== 'skylerzanth@outlook.com' ? 'Manage your dealership.' :
                      userIsADMIN && user?.email !== 'skylerzanth@outlook.com' ? 'Manage your site.' :
                        ''}
              </h2>
              <Separator className="my-6" />
            </SheetDescription>
          </SheetHeader>
          {user && user?.email === 'skylerzanth@outlook.com' ?
            <>
              <SearchForm action="/admin/search" />
              <Accordion type="single" collapsible className="w-full mt-5">
                <AccordionItem value="item-1">
                  <AccordionTrigger>DEV MODE</AccordionTrigger>
                  <AccordionContent>
                    <SidebarNav items={devSidebarNav} />
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>ADMIN</AccordionTrigger>
                  <AccordionContent>
                    <SidebarNav items={adminSidebarNav} />
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>MANAGER</AccordionTrigger>
                  <AccordionContent>
                    <SidebarNav items={managerSidebarNav} />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </>
            :
            userIsDEV && user?.email !== 'skylerzanth@outlook.com' ?
              <>
                <SearchForm action="/admin/search" />
                <SidebarNav items={devSidebarNav} />
              </>
              :
              userIsMANAGER && user?.email !== 'skylerzanth@outlook.com' ?
                <>
                  <SidebarNav items={managerSidebarNav} />
                </>
                :
                userIsADMIN && user?.email !== 'skylerzanth@outlook.com' ?
                  <>
                    <SearchForm action="/admin/search" />
                    <SidebarNav items={adminSidebarNav} />
                  </>
                  : ''}

        </SheetContent>
      </Sheet >
    </>
  )/*
  const location = useLocation()
  const pathname = location.pathname
  const isFalse = pathname.startsWith('/dealer/manager/')
  if (isOpen) {
    console.log(isOpen, isFalse, 'isopen')
  }
  if (email === null || user === null) {
    return <div>Loading...</div>;
  }
  const HandleClose = () => {
    setIsOpen(false)
  }

  if (isOpen) {
    return (
      <>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetContent side='left' className='bg-[#09090b] w-full md:w-[50%] overflow-y-auto' >
            <SheetHeader>
              <SheetTitle>
                <h2>
                  {user && user?.email === 'skylerzanth@outlook.com' ? 'DEV MODE' :
                    userIsDEV && user?.email !== 'skylerzanth@outlook.com' ? 'DEV MODE' :
                      userIsMANAGER && user?.email !== 'skylerzanth@outlook.com' ? 'Manager Menu' :
                        userIsADMIN && user?.email !== 'skylerzanth@outlook.com' ? 'Admin Menu' :
                          ''}
                </h2>
              </SheetTitle>
              <SheetDescription>
                <h2>
                  {user && user?.email === 'skylerzanth@outlook.com' ? 'yeeeet motherfucker!' :
                    userIsDEV && user?.email !== 'skylerzanth@outlook.com' ? 'yeeeet!' :
                      userIsMANAGER && user?.email !== 'skylerzanth@outlook.com' ? 'Manage your dealership.' :
                        userIsADMIN && user?.email !== 'skylerzanth@outlook.com' ? 'Manage your site.' :
                          ''}
                </h2>
                <hr className="my-6 text-[#fafafa] w-[90%]" />
              </SheetDescription>
            </SheetHeader>
            {user && user?.email === 'skylerzanth@outlook.com' ?
              <>
                <SearchForm action="/admin/search" />
                <Accordion type="single" collapsible className="w-full mt-5">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>DEV MODE</AccordionTrigger>
                    <AccordionContent>
                      <SidebarNav items={devSidebarNav} />
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>ADMIN</AccordionTrigger>
                    <AccordionContent>
                      <SidebarNav items={managerSidebarNav} />
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>MANAGER</AccordionTrigger>
                    <AccordionContent>
                      <SidebarNav items={adminSidebarNav} />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </>
              :
              userIsDEV && user?.email !== 'skylerzanth@outlook.com' ?
                <>
                  <SearchForm action="/admin/search" />
                  <SidebarNav items={devSidebarNav} />
                </>
                :
                userIsMANAGER && user?.email !== 'skylerzanth@outlook.com' ?
                  <>
                    <SidebarNav items={managerSidebarNav} />
                  </>
                  :
                  userIsADMIN && user?.email !== 'skylerzanth@outlook.com' ?
                    <>
                      <SearchForm action="/admin/search" />
                      <SidebarNav items={adminSidebarNav} />
                    </>
                    : ''}

            <div
              onClick={HandleClose}
              className="ring-offset-background focus:ring-ring absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary"
            >
              <X size={32} color="#fff" strokeWidth={1.5} />
            </div>
          </SheetContent>
        </Sheet>
      </>
    )
  }

  if (!isFalse && !isOpen) {
    return (
      <>
        <RootSheet >
          <SheetTrigger>
            <Button className=' cursor-pointer text-[#fff] left-[25px] top-[25px]  fixed'>
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
          </SheetTrigger>

          <SheetContent side='left' className='bg-[#09090b] w-full md:w-[50%] overflow-y-auto' >
            <SheetHeader>
              <SheetTitle>
                <h2>
                  {user && user?.email === 'skylerzanth@outlook.com' ? 'DEV MODE' :
                    userIsDEV && user?.email !== 'skylerzanth@outlook.com' ? 'DEV MODE' :
                      userIsMANAGER && user?.email !== 'skylerzanth@outlook.com' ? 'Manager Menu' :
                        userIsADMIN && user?.email !== 'skylerzanth@outlook.com' ? 'Admin Menu' :
                          ''}
                </h2>
              </SheetTitle>
              <SheetDescription>
                <h2>
                  {user && user?.email === 'skylerzanth@outlook.com' ? 'yeeeet motherfucker!' :
                    userIsDEV && user?.email !== 'skylerzanth@outlook.com' ? 'yeeeet!' :
                      userIsMANAGER && user?.email !== 'skylerzanth@outlook.com' ? 'Manage your dealership.' :
                        userIsADMIN && user?.email !== 'skylerzanth@outlook.com' ? 'Manage your site.' :
                          ''}
                </h2>
                <Separator className="my-6" />
              </SheetDescription>
            </SheetHeader>
            {user && user?.email === 'skylerzanth@outlook.com' ?
              <>
                <SearchForm action="/admin/search" />
                <Accordion type="single" collapsible className="w-full mt-5">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>DEV MODE</AccordionTrigger>
                    <AccordionContent>
                      <SidebarNav items={devSidebarNav} />
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>ADMIN</AccordionTrigger>
                    <AccordionContent>
                      <SidebarNav items={managerSidebarNav} />
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>MANAGER</AccordionTrigger>
                    <AccordionContent>
                      <SidebarNav items={adminSidebarNav} />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </>
              :
              userIsDEV && user?.email !== 'skylerzanth@outlook.com' ?
                <>
                  <SearchForm action="/admin/search" />
                  <SidebarNav items={devSidebarNav} />
                </>
                :
                userIsMANAGER && user?.email !== 'skylerzanth@outlook.com' ?
                  <>
                    <SidebarNav items={managerSidebarNav} />
                  </>
                  :
                  userIsADMIN && user?.email !== 'skylerzanth@outlook.com' ?
                    <>
                      <SearchForm action="/admin/search" />
                      <SidebarNav items={adminSidebarNav} />
                    </>
                    : ''}

          </SheetContent>
        </RootSheet >
      </>
    )
  }
  return null
  */
}


/**  <>
      <Sheet >
        <SheetTrigger>
          <Button className=' cursor-pointer text-[#fff] left-[25px] top-[25px]  fixed'>
            {user && user?.email === 'skylerzanth@outlook.com' && (
              <Code size={32} color="#fff" strokeWidth={1.5} />
            )}
            {userIsDEV && (
              <Code size={32} color="#fff" strokeWidth={1.5} />
            )}
            {userIsMANAGER && (
              <Banknote size={32} color="#fff" strokeWidth={1.5} />
            )}
            {userIsADMIN && (
              <Laptop size={32} color="#fff" strokeWidth={1.5} />
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side='left' className='bg-[#09090b] w-full md:w-[50%] overflow-y-auto' >
          <SheetHeader>
            <SheetTitle>
              {user && user?.email === 'skylerzanth@outlook.com' && (
                <h2>
                  DEV MODE
                </h2>
              )}
              {userIsDEV && (
                <h2>
                  DEV MODE
                </h2>
              )}
              {userIsMANAGER && (
                <h2>
                  Manager Menu
                </h2>
              )}
              {userIsADMIN && (
                <h2>
                  Admin Menu
                </h2>
              )}
            </SheetTitle>
            <SheetDescription>
              {user && user?.email === 'skylerzanth@outlook.com' && (
                <h2>
                  yeeeet!
                </h2>
              )}
              {userIsDEV && (
                <h2>
                  DEV MODE
                </h2>
              )}
              {userIsMANAGER && (
                <h2>
                  Manage your dealership.
                </h2>
              )}
              {userIsADMIN && (
                <h2>
                  Manage your site.
                </h2>
              )}
              <Separator className="my-6" />
            </SheetDescription>
          </SheetHeader>
          {user && user?.email === 'skylerzanth@outlook.com' && (
            <>
              <SearchForm action="/admin/search" />
              <SidebarNav items={devSidebarNav} />
            </>
          )}
          {userIsDEV && (
            <>
              <SearchForm action="/admin/search" />
              <SidebarNav items={devSidebarNav} />
            </>
          )}
          {userIsMANAGER && (
            <>
              <SearchForm action="/admin/search" />
              <SidebarNav items={managerSidebarNav} />
            </>
          )}
          {userIsADMIN && (
            <>
              <SearchForm action="/admin/search" />
              <SidebarNav items={adminSidebarNav} />
            </>
          )}
        </SheetContent>
      </Sheet >
    </> */
