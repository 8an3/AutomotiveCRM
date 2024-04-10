/* eslint-disable tailwindcss/classnames-order */
/* eslint-disable jsx-a11y/alt-text */
import { Form, Link, useLoaderData, useLocation, useFetcher } from '@remix-run/react';
import { RemixNavLink, Input, Separator, Button, } from "~/components"
import { TextArea, } from "~/components/ui"
import { rootAction, useUserLoader } from './actions';
import { Sheet, SheetClose, SheetContent, SheetTrigger, } from "~/other/sheet"
import { getUserIsAllowed } from "~/helpers";
import * as Dialog from '@radix-ui/react-dialog';
import * as Tabs from '@radix-ui/react-tabs';
import { Textarea } from '~/other/textarea';
import { ActionFunction, type DataFunctionArgs, json, redirect, type LoaderFunction } from "@remix-run/node";
import { getSession } from "~/sessions/auth-session.server";
import { model } from "~/models";
import { toast } from 'sonner';
import { Menu } from 'lucide-react';
import { useRootLoaderData } from '~/hooks/use-root-loader-data';
import { useEffect, useRef, useState } from 'react';
import Chat from "~/components/shared/chat";
import { prisma } from "~/libs";

export let action = rootAction


export default function Sidebar() {
  // const { integrationSec } = useLoaderData();

  const location = useLocation();
  let fetcher = useFetcher()
  // const userIsAllowed = getUserIsAllowed(user, ["ADMIN", "MANAGER", "EDITOR", "SALES", "FINANCE"]);
  const isUserDashboard = location.pathname.includes('/user/dashboard')
  const { user } = useRootLoaderData();
  const userIsFinance = getUserIsAllowed(user, ["FINANCE"]);


  //const adminUser = getUserIsAllowed(user, ["ADMIN", "MANAGER",]);
  // const financeUser = getUserIsAllowed(user, ["ADMIN", "MANAGER", "FINANCE"]);
  //const userIsAllowed = getUserIsAllowed(user, ["ADMIN", "MANAGER", "EDITOR", "SALES", "FINANCE"]);
  const iFrameRef: React.LegacyRef<HTMLIFrameElement> = useRef(null);

  useEffect(() => {
    if (iFrameRef?.current) {
      iFrameRef.current.src = 'http://localhost:3000/internal/im/lobby';
      //  iFrameRef.current.src = 'http://localhost:3002/customer-forms';
      //  const userId = user.id
      //  let merged = { finance }
      //  let merged = { finance }
      // Function to convert values to strings

      const handleLoad = () => {
        //   const data = { merged, user, userId };
        const data = 'hey'
        iFrameRef.current?.contentWindow?.postMessage(data, '*');
      };

      iFrameRef.current.addEventListener('load', handleLoad);

      // Clean up the event listener when the component is unmounted
      return () => {
        iFrameRef.current?.removeEventListener('load', handleLoad);
      };
    }
  }, [iFrameRef,]);
  return (
    <>
      <Sheet >
        <SheetTrigger asChild>
          <div className=' cursor-pointer text-[#02a9ff] right-[25px] top-[25px]  fixed'>
            <Menu size={32} color="#02a9ff" strokeWidth={1.5} />
          </div>
        </SheetTrigger>
        <SheetContent side='right' className='bg-myColor-950 w-full md:w-[50%] overflow-y-auto' >
          <Tabs.Root
            className="flex flex-col w-[97%] "
            defaultValue='UserNav'
          >

            <Tabs.List className="shrink-0 flex border-b border-[#02a9ff]" aria-label="Manage your account">
              <Tabs.Trigger
                className="bg-white2 text-white cursor-pointer px-5 h-[45px] flex-1 flex items-center justify-center text-[15px] leading-none  select-none first:rounded-tl-md last:rounded-tr-md hover:text-[#02a9ff] data-[state=active]:text-[#02a9ff] data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current data-[state=active]:focus:relative data-[state=active]:focus:shadow-[0_0_0_2px] data-[state=active]:focus:shadow-black outline-none "
                value="MY23"
              >
                MY23
              </Tabs.Trigger>
              <Tabs.Trigger
                className="bg-white2 text-white px-5 cursor-pointer h-[45px] flex-1 flex items-center justify-center text-[15px] leading-none  select-none first:rounded-tl-md last:rounded-tr-md hover:text-[#02a9ff] data-[state=active]:text-[#02a9ff] data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current data-[state=active]:focus:relative data-[state=active]:focus:shadow-[0_0_0_2px] data-[state=active]:focus:shadow-black outline-none "
                value="MY24"
              >
                MY24
              </Tabs.Trigger>
            </Tabs.List>
            <Tabs.List className="shrink-0 flex border-b border-mauve6" aria-label="Manage your account">
              <Tabs.Trigger
                className="bg-white2 text-white px-5 cursor-pointer h-[45px] flex-1flex items-center justify-center text-[15px] leading-none select-none  hover:text-[#02a9ff] data-[state=active]:text-[#02a9ff] data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current data-[state=active]:focus:relative data-[state=active]:focus:shadow-[0_0_0_2px] data-[state=active]:focus:shadow-black outline-none "
                value="UserNav"
              >
                User Nav
              </Tabs.Trigger>

              <Tabs.Trigger
                className="bg-white2 text-white px-5 h-[45px]  cursor-pointer flex-1 flex items-center justify-center text-[15px] leading-none  select-none  hover:text-[#02a9ff] data-[state=active]:text-[#02a9ff] data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current data-[state=active]:focus:relative data-[state=active]:focus:shadow-[0_0_0_2px] data-[state=active]:focus:shadow-black outline-none "
                value="Contact"
              >
                Contact
              </Tabs.Trigger>
            </Tabs.List>

            {/* MY23 */}
            <Tabs.Content
              className="grow p-5 bg-white2 rounded-b-md outline-none   text-white"
              value="MY23"
            >
              <h3 className='text-white '>
                WATERCRAFT
              </h3>
              <hr className="solid" />
              <div className='p-3'>
                <RemixNavLink to='/quote/Kawasaki' >
                  <SheetClose asChild>
                    <Button variant="link" className="w-full justify-start hover:text-[#02a9ff] text-white  cursor-pointer"  >
                      Kawasaki
                    </Button>
                  </SheetClose>
                </RemixNavLink>

                <RemixNavLink to='/quote/Manitou'>
                  <SheetClose asChild>
                    <Button variant="link" className="w-full justify-start hover:text-[#02a9ff] text-white  cursor-pointer"  >
                      Manitou
                    </Button>
                  </SheetClose>
                </RemixNavLink>
                <RemixNavLink to='/quote/Sea-Doo'>
                  <SheetClose asChild>
                    <Button variant="link" className="w-full justify-start hover:text-[#02a9ff] text-white  cursor-pointer"  >
                      Sea-Doo
                    </Button>
                  </SheetClose>
                </RemixNavLink>
                <RemixNavLink to='/quote/Switch'>
                  <SheetClose asChild>
                    <Button variant="link" className="w-full justify-start hover:text-[#02a9ff] text-white  cursor-pointer"  >
                      Sea-Doo Switch
                    </Button>
                  </SheetClose>
                </RemixNavLink>
              </div>
              <h3 className='text-white ' >
                OFF-ROAD
              </h3>
              <hr className="solid text-white " />
              <div className='p-3 text-white '>

                <RemixNavLink to='/quote/Can-Am'>
                  <SheetClose asChild>
                    <Button variant="link" className="w-full justify-start hover:text-[#02a9ff] text-white  cursor-pointer"  >
                      Can-Am
                    </Button>
                  </SheetClose>
                </RemixNavLink>
                <RemixNavLink to='/quote/Can-Am-SXS'>
                  <SheetClose asChild>
                    <Button variant="link" className="w-full justify-start hover:text-[#02a9ff] text-white  cursor-pointer"  >
                      Can-Am SXS
                    </Button>
                  </SheetClose>
                </RemixNavLink>
                <RemixNavLink to='/quote/KTM'>
                  <SheetClose asChild>
                    <Button variant="link" className="w-full justify-start hover:text-[#02a9ff] text-white  cursor-pointer"  >
                      KTM
                    </Button>
                  </SheetClose>
                </RemixNavLink>
                <RemixNavLink to='/quote/Kawasaki'>
                  <SheetClose asChild>
                    <Button variant="link" className="w-full justify-start hover:text-[#02a9ff] text-white  cursor-pointer"  >
                      Kawasaki
                    </Button>
                  </SheetClose>
                </RemixNavLink>
                <RemixNavLink to='/quote/Ski-Doo'>
                  <SheetClose asChild>
                    <Button variant="link" className="w-full justify-start hover:text-[#02a9ff] text-white  cursor-pointer"  >
                      Ski-Doo
                    </Button>
                  </SheetClose>
                </RemixNavLink>
                <RemixNavLink to='/quote/Suzuki'>
                  <SheetClose asChild>
                    <Button variant="link" className="w-full justify-start hover:text-[#02a9ff] text-white  cursor-pointer"  >
                      Suzuki
                    </Button>
                  </SheetClose>
                </RemixNavLink>
                <RemixNavLink to='/quote/Triumph'>
                  <SheetClose asChild>
                    <Button variant="link" className="w-full justify-start hover:text-[#02a9ff] text-white  cursor-pointer"  >
                      Triumph
                    </Button>
                  </SheetClose>
                </RemixNavLink>
              </div>
              <h3  >
                MOTORCYCLE
              </h3>
              <hr className="solid" />
              <div className='p-3'>

                <RemixNavLink to='/quote/BMW-Motorrad'>
                  <SheetClose asChild>
                    <Button variant="link" className="w-full justify-start hover:text-[#02a9ff] text-white  cursor-pointer"  >
                      BMW Motorrad
                    </Button>
                  </SheetClose>
                </RemixNavLink>
                <RemixNavLink to='/quote/Harley-Davidson'>
                  <SheetClose asChild>
                    <Button variant="link" className="w-full justify-start hover:text-[#02a9ff] text-white  cursor-pointer"  >
                      Harley-Davidson
                    </Button>
                  </SheetClose>
                </RemixNavLink>
                <RemixNavLink to='/quote/Kawasaki'>
                  <SheetClose asChild>
                    <Button variant="link" className="w-full justify-start hover:text-[#02a9ff] text-white  cursor-pointer"  >
                      Kawasaki
                    </Button>
                  </SheetClose>
                </RemixNavLink>
                <RemixNavLink to='/quote/KTM'>
                  <SheetClose asChild>
                    <Button variant="link" className="w-full justify-start hover:text-[#02a9ff] text-white  cursor-pointer"  >
                      KTM
                    </Button>
                  </SheetClose>
                </RemixNavLink>
                <RemixNavLink to='/quote/Indian'>
                  <SheetClose asChild>
                    <Button variant="link" className="w-full justify-start hover:text-[#02a9ff] text-white  cursor-pointer"  >
                      Indian
                    </Button>
                  </SheetClose>
                </RemixNavLink>
                <RemixNavLink to='/quote/Yamaha'>
                  <SheetClose asChild>
                    <Button variant="link" className="w-full justify-start hover:text-[#02a9ff] text-white  cursor-pointer"  >
                      Yamaha
                    </Button>
                  </SheetClose>
                </RemixNavLink>
                <RemixNavLink to='/quote/Suzuki'>
                  <SheetClose asChild>
                    <Button variant="link" className="w-full justify-start hover:text-[#02a9ff] text-white  cursor-pointer"  >
                      Suzuki
                    </Button>
                  </SheetClose>
                </RemixNavLink>
                <RemixNavLink to='/quote/Spyder'>
                  <SheetClose asChild>
                    <Button variant="link" className="w-full justify-start hover:text-[#02a9ff] text-white  cursor-pointer"  >
                      Spyder
                    </Button>
                  </SheetClose>
                </RemixNavLink>
                <RemixNavLink to='/quote/Triumph'>
                  <SheetClose asChild>
                    <Button variant="link" className="w-full justify-start hover:text-[#02a9ff] text-white  cursor-pointer"  >
                      Triumph
                    </Button>
                  </SheetClose>
                </RemixNavLink>

              </div>
              <h3 >
                Used
              </h3>
              <hr className="solid" />
              <div className='p-3'>
                <RemixNavLink to='/quote/used'>
                  <SheetClose asChild>
                    <Button variant="link" className="w-full justify-start hover:text-[#02a9ff] text-white  cursor-pointer"  >
                      Used
                    </Button>
                  </SheetClose>
                </RemixNavLink>
              </div>
            </Tabs.Content>

            {/* MY24 */}
            <Tabs.Content
              className="grow p-5 bg-white2 rounded-b-md outline-none   "
              value="MY24"
            >
              <h3 className='text-white'>
                WATERCRAFT
              </h3>
              <hr className="solid text-white" />
              <div className='p-3'>
              </div>
              <h3 className='text-white'>
                MOTORCYCLE
              </h3>
              <hr className="solid text-white" />
              <div className='p-3'>
                <RemixNavLink to='/quote/Harley-DavidsonMY24'>
                  <SheetClose asChild>
                    <Button variant="link" className="w-full justify-start hover:text-[#02a9ff] text-white  cursor-pointer"  >
                      Harley-Davidson
                    </Button>
                  </SheetClose>
                </RemixNavLink>
              </div>
              <h3 className='text-white'>
                OFF-ROAD
              </h3>
              <hr className="solid text-white" />
              <div className='p-3'>
                <RemixNavLink to='/quote/Can-Am-SXS-MY24'>
                  <SheetClose asChild>
                    <Button variant="link" className="w-full justify-start hover:text-[#02a9ff] text-white  cursor-pointer"  >
                      Can-Am sXs
                    </Button>
                  </SheetClose>
                </RemixNavLink>
                <RemixNavLink to='/quote/Ski-Doo-MY24'>
                  <SheetClose asChild>
                    <Button variant="link" className="w-full justify-start hover:text-[#02a9ff] text-white  cursor-pointer"  >
                      Ski-Doo
                    </Button>
                  </SheetClose>
                </RemixNavLink>
              </div>
            </Tabs.Content>

            {/* User */}
            <Tabs.Content
              className="grow p-5  rounded-b-md outline-none border-transparent   "
              value="UserNav"
            >
              <div className="flex flex-col items-start">
                <Dialog.Close asChild>
                  <RemixNavLink to={`/email/googleClient`}>
                    <Button
                      variant="link"
                      className="w-full justify-start hover:text-[#02a9ff] text-white  cursor-pointer"
                    >
                      Email Client
                    </Button>
                  </RemixNavLink>
                </Dialog.Close>
                <Dialog.Close asChild>
                  <RemixNavLink to={`/sms/app`}>
                    <Button
                      variant="link"
                      className="w-full justify-start hover:text-[#02a9ff] text-white  cursor-pointer"
                    >
                      SMS Client
                    </Button>
                  </RemixNavLink>
                </Dialog.Close>
                {user.activixActivated !== 'yes' && (
                  <Dialog.Close asChild>
                    <RemixNavLink to={`/leads/sales`}>
                      <Button variant="link" className="w-full justify-start hover:text-[#02a9ff] text-white  cursor-pointer" >
                        Dashboard
                      </Button>
                    </RemixNavLink>
                  </Dialog.Close>
                )}

                {userIsFinance && (
                  <Dialog.Close asChild>
                    <RemixNavLink to={`/leads/finance`}>
                      <Button variant="link" className="w-full justify-start hover:text-[#02a9ff] text-white  cursor-pointer" >
                        Finance Dashboard
                      </Button>
                    </RemixNavLink>
                  </Dialog.Close>
                )}
                {user.activixActivated === 'yes' && (
                  <Dialog.Close asChild>
                    <RemixNavLink to={`/leads/activix`}>
                      <Button variant="link" className="w-full justify-start hover:text-[#02a9ff] text-white  cursor-pointer" >
                        Activix Dashboard
                      </Button>
                    </RemixNavLink>
                  </Dialog.Close>
                )}
                <Dialog.Close asChild>
                  <RemixNavLink to={`/calendar/sales`}>
                    <Button variant="link" className="w-full justify-start hover:text-[#02a9ff] text-white  cursor-pointer" >
                      Calendar
                    </Button>
                  </RemixNavLink>
                </Dialog.Close>
                <Dialog.Close asChild>
                  <RemixNavLink to={`/payments/calculator`}>
                    <Button
                      variant="link"
                      className="w-full justify-start hover:text-[#02a9ff] text-white  cursor-pointer mt-5"
                    >
                      Payment Calculator
                    </Button>
                  </RemixNavLink>
                </Dialog.Close>

                <Dialog.Close asChild>
                  <RemixNavLink to={`/inventory/motorcycle`}>
                    <Button
                      variant="link"
                      className="w-full justify-start cursor-pointer mt-5 text-white "
                    >
                      Motorcycle Inventory
                    </Button>
                  </RemixNavLink>
                </Dialog.Close>
                <Dialog.Close asChild>
                  <RemixNavLink to={`/document/second`}>
                    <Button
                      variant="link"
                      className="w-full justify-start cursor-pointer mt-5 text-white "
                    >
                      Document Builder
                    </Button>
                  </RemixNavLink>
                </Dialog.Close>
                <Dialog.Close asChild>
                  <RemixNavLink to={`/editor/templates`}>
                    <Button
                      variant="link"
                      className="w-full justify-start hover:text-[#02a9ff] text-white  cursor-pointer "
                    >
                      Template Builder
                    </Button>
                  </RemixNavLink>
                </Dialog.Close>
                <Dialog.Close asChild>
                  <RemixNavLink to={`/user/dashboard/scripts`}>
                    <Button variant="link" className="w-full mt-5 justify-start hover:text-[#02a9ff] text-white  cursor-pointer"  >
                      Scripts
                    </Button>
                  </RemixNavLink>
                </Dialog.Close>

                <Dialog.Close asChild>
                  <RemixNavLink to={`/user/dashboard/salestracker`}>
                    <Button
                      variant="link"
                      className="w-full justify-start hover:text-[#02a9ff] text-white  cursor-pointer"
                    >
                      Sales Tracker
                    </Button>
                  </RemixNavLink>
                </Dialog.Close>
                <Dialog.Close asChild>
                  <RemixNavLink to={`/roadmap`}>
                    <Button
                      variant="link"
                      className="w-full justify-start hover:text-[#02a9ff] text-white  cursor-pointer"
                    >
                      Roadmap
                    </Button>
                  </RemixNavLink>
                </Dialog.Close>
                <Dialog.Close asChild>
                  <RemixNavLink to={`/user/dashboard/settings`}>
                    <Button
                      variant="link"
                      className="w-full justify-start hover:text-[#02a9ff] text-white  cursor-pointer"
                    >
                      Settings
                    </Button>
                  </RemixNavLink>
                </Dialog.Close>
                <Dialog.Close asChild>
                  <RemixNavLink to={`/logout`}>
                    <Button variant="link" className="w-full justify-start cursor-pointer text-white" >
                      Log out
                    </Button>
                  </RemixNavLink>
                </Dialog.Close>



                {user && user?.email === 'skylerzanth@gmail.com' && (
                  <>
                    <h1 className="w-full mt-10 justify-start cursor-pointer text-white " >Dev Links</h1>
                    <hr className="w-full justify-start cursor-pointer text-white " />
                    <hr className="solid" />
                    <>
                      <Dialog.Close asChild>
                        <RemixNavLink to={`/automation`}>
                          <Button
                            variant="link"
                            className="w-full justify-start hover:text-[#02a9ff] text-white  cursor-pointer"
                          >
                            Automation
                          </Button>
                        </RemixNavLink>
                      </Dialog.Close>
                      <Dialog.Close asChild>
                        <RemixNavLink to={`/admanager`}>
                          <Button
                            variant="link"
                            className="w-full justify-start hover:text-[#02a9ff] text-white  cursor-pointer"
                          >
                            Ad Manager
                          </Button>
                        </RemixNavLink>
                      </Dialog.Close>
                      <Dialog.Close asChild>
                        <RemixNavLink to={`/user/dashboard/notes`}>
                          <Button
                            variant="link"
                            className="w-full justify-start hover:text-[#02a9ff] text-white  cursor-pointer"
                          >
                            Keep Notes
                          </Button>
                        </RemixNavLink>
                      </Dialog.Close>
                      <Dialog.Close asChild>
                        <RemixNavLink to={`/user/dashboard/notes`}>
                          <Button
                            variant="link"
                            className="w-full justify-start hover:text-[#02a9ff] text-white  cursor-pointer"
                          >
                            Chatgpt
                          </Button>
                        </RemixNavLink>
                      </Dialog.Close>
                    </>
                  </>

                )}






              </div>
            </Tabs.Content>
            {/* notes */}
            <Tabs.Content
              className="grow p-5 text-white   rounded-b-md outline-none   "
              value="Notes"
            >
              <Chat />


            </Tabs.Content>
            {/* contaact */}
            <Tabs.Content
              className="grow p-5 bg-white2 rounded-b-md outline-none focus:shadow-[0_0_0_2px] focus:shadow-black"
              value="Contact"
            >
              <>
                <div className="border-none p-0">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h2 className="text-2xl font-thin text-white">
                        Contact
                      </h2>
                      <p className="text-sm dark:text-black text-white">
                        If a feature could help you sell more, but we dont have it? Let us
                        know, we can implement it.
                      </p>
                    </div>
                  </div>
                  <hr className="solid mt-4 mb-4" />
                  <fetcher.Form method="post" action='/emails/send/contact'>
                    <TextArea
                      placeholder="Type your message here."
                      name="customContent"
                      className="h-[200px]     w-[95%]"
                    />
                    <Input name="userFname" className="w-[95%]" placeholder="John Doe" />
                    <Input name="userEmail" className="w-[95%]" placeholder="johndoe@gmail.com" />
                    <Button name='intent' value='contactForm' type='submit' className="bg-[#02a9ff] mt-3 w-[75px] ml-2  mr-2 text-white  active:bg-black font-bold uppercase   text-xs  rounded shadow hover:shadow-md outline-none focus:outline-none  ease-linear transition-all text-center duration-150"
                      onClick={() => {
                        toast.success('Event has been created')
                      }}
                    >
                      Email
                    </Button>
                  </fetcher.Form>
                </div>
                <div className="mt-[50px] mx-auto ">
                  <h2 className="text-2xl font-thin text-white">
                    Scripts, closes and rebuttals
                  </h2>
                  <p className="text-sm text-white">
                    The tool box is there so
                    you and other sales people can refer to it whenever you need it.
                  </p>
                  <Form method="post" action="/emails/send/contact">
                    <Textarea placeholder="Type your message here." name="customContent" className="h-[200px] w-[95%]" />
                    <Input name="userFname" className="w-[95%]" placeholder="John Doe" />
                    <Input name="userEmail" className="w-[95%]" placeholder="johndoe@gmail.com" />
                    <Input type="hidden" name="userFname" value='test' />

                    <Button name='intent' value='scriptForm' type='submit' className="mt-3 bg-[#02a9ff] w-[75px] ml-2  mr-2 text-white  active:bg-black font-bold uppercase   text-xs  rounded shadow hover:shadow-md outline-none focus:outline-none  ease-linear transition-all text-center duration-150" onClick={() => {
                      toast.success('Event has been created')

                    }}  >
                      Email
                    </Button>

                  </Form>
                </div>
              </>
            </Tabs.Content>


          </Tabs.Root>
        </SheetContent>
      </Sheet >
    </>
  )
}



/*
/**
 *      {/* trade *
<Tabs.Content className="grow p-5 bg-white2 rounded-b-md outline-none focus:shadow-[0_0_0_2px] focus:shadow-black" value="features"  >
  {location.pathname.startsWith(`/overview/`) && (
    <>
      <div className="grid">
        <div className="space-y-2">
          <h4 className="font-medium leading-none">Features</h4>

        </div>
        <div className="flex ">
          <div className='grid grid-cols-1 gap-2'>

            <p className="text-muted-foreground text-sm text-left">
              Print Docs
            </Button>
            <hr className="solid" />

            <div className="mx-auto justify-center">
              <PrintSpec />
            </div>
            <div className="">
              <Button disabled className="" type="submit" content="update">
                Test Drive Docs - Unavailable
              </Button>
            </div>
            <div className="mx-auto w-auto ">
              <PrintDealer />
            </div>
            <div className="">
              <Button disabled className="" type="submit" content="update">
                Customer W/S - Unavailable
              </Button>
            </div>
            <div className="items-center mx-auto">
              <PrintContract />
            </div>

            <div className="">
              <Button disabled className="" type="submit" content="update">
                Trade in Docs -  Unavailable
              </Button>
            </div>
            <p className="text-muted-foreground text-sm text-left">
              Email
            </Button>
            <hr className="solid" />

            <div className="">
              <Button disabled className="" type="submit" content="update">
                Docsign Contract - Unavailable
              </Button>
            </div>
            <p className="text-muted-foreground text-sm text-left">
              Other
            </Button>
            <hr className="solid" />

            <div className="mx-auto ">
              <ModelPage />
            </div>

            <div className="">
              <Button disabled className="" type="submit" content="update">
                Sync Deal to CRM - Unavailable
              </Button>
            </div>
            <Button>
              <a href="/dashboard/calls"
                target="_blank"
              >
                Dashboard
              </a>
            </Button>
            <Button>
              <a href={`/customer/${currentEvent?.financeId}{finance.id}`}
                target="_blank"
              >
                Client File
              </a>
            </Button>
          </div>
        </div>
        <div className="flex justify-between mb-[10px] mt-3">

        </div>
      </div>
    </>
  )}
</Tabs.Content>
{
  location.pathname.startsWith(`/overview/`) && (
    <Tabs.List className="shrink-0 flex border-b mt-auto border-mauve6" aria-label="Manage your account">
      <Tabs.Trigger
        className="bg-white2 px-5 h-[45px] flex-1 rounded-bl-md  flex items-center justify-center text-[15px] leading-none text-black select-none  hover:text-[#02a9ff] data-[state=active]:text-[#02a9ff] data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current data-[state=active]:focus:relative data-[state=active]:focus:shadow-[0_0_0_2px] data-[state=active]:focus:shadow-black outline-none "
        value="features"
      >
        Features
      </Tabs.Trigger>

      <Tabs.Trigger
        className="bg-white2 px-5 h-[45px] flex-1 flex rounded-br-md items-center justify-center text-[15px] leading-none text-black select-none  hover:text-[#02a9ff] data-[state=active]:text-[#02a9ff] data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current data-[state=active]:focus:relative data-[state=active]:focus:shadow-[0_0_0_2px] data-[state=active]:focus:shadow-black outline-none "
        value="emails"
      >
        Email
      </Tabs.Trigger>
    </Tabs.List>
  )
}
 * email sheet
  < Tabs.Content
className = "grow p-5 bg-white2 rounded-b-md outline-none focus:shadow-[0_0_0_2px] focus:shadow-black"
value = "emails"
  >
  <>
    <div className="grid gap-2">
      <div className="space-y-2">
        <h4 className="font-medium leading-none">
          Email Templates
        </h4>
        <p className="text-muted-foreground text-sm">
          Be sure to update before selecting an email to send.
        </Button>
        <p className="text-muted-foreground text-sm mt-2">
          Options - would include gap, warranties, etc
        </Button>
        <p className="text-muted-foreground text-sm mt-2">
          These are templated emails, send one to yourself first to ensure you like the content.
        </Button>
        <hr className="solid" />
      </div>
      <div className="w-[95%]">
        <Form method="post" action="/emails/send/payments">
          <Select name="emailType">
            <SelectTrigger className=" mt-2 rounded-[0px] border">
              <SelectValue placeholder="Select an email..." />
            </SelectTrigger>
            <SelectContent className="bg-white2 dark:bg-black dark:text-white ">
              <ScrollArea className="h-[300px] w-[350px] rounded-md  p-4">
                <SelectGroup>
                  <SelectLabel>Payments </SelectLabel>
                  <SelectItem value="">Select None</SelectItem>
                  <SelectItem value="paymentsTemp">Payments</SelectItem>{/* 1*
                  <SelectItem value="wBreakdownTemp">W/ Full Breakdown</SelectItem>{/*2
                  <SelectItem value="wSpecTemp">W/ Full Breakdown & Spec</SelectItem>{/* 3
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Options</SelectLabel>
                  <SelectItem value="wOptionsTemp">W/ Options</SelectItem>{/* 4
                  <SelectItem value="optionsWBreakdownTemp">Options W/ Full Breakdown</SelectItem>{/* 5
                  <SelectItem value="optionsWSpecTemp"> Options W/ Full Breakdown & Spec</SelectItem>{/*6
                </SelectGroup>
                <hr className="solid" />
                <SelectGroup>
                  <SelectLabel>No Tax</SelectLabel>
                  <SelectItem value="paymentsNoTaxTemp">Payments</SelectItem>{/* 7
                  <SelectItem value="wBreakdownNoTaxTemp">W/ Full Breakdown</SelectItem>{/* 8
                  <SelectItem value="wSpecNoTaxTemp">W/ Full Breakdown & Spec</SelectItem>{/*9
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Options</SelectLabel>
                  <SelectItem value="wOptionsNoTaxTemp">W/ Options</SelectItem>{/* 10
                  <SelectItem value="optionsWBreakdownNoTaxTemp">Options W/ Full Breakdown</SelectItem>{/*11
                  <SelectItem value="optionsWSpecNoTaxTemp"> Options W/ Full Breakdown & Spec</SelectItem>{/*12
                </SelectGroup>
                <hr className="solid" />
                <SelectGroup>
                  <SelectLabel>Custom Tax</SelectLabel>
                  <SelectItem value="paymentsCustomTemp">Payments</SelectItem>{/*13
                  <SelectItem value="wBreakdownCustomTemp">W/ Full Breakdown</SelectItem>{/*14
                  <SelectItem value="wSpecCustomTemp">W/ Full Breakdown & Spec</SelectItem>{/* 15
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Options</SelectLabel>
                  <SelectItem value="wOptionsCustomTemp">W/ Options</SelectItem>{/*16
                  <SelectItem value="optionsWBreakdownCustomTemp">Options W/ Full Breakdown</SelectItem>{/*17
                  <SelectItem value="optionsWSpecCustomTemp"> Options W/ Full Breakdown & Spec</SelectItem>{/*18
                </SelectGroup>
              </ScrollArea>
            </SelectContent>
          </Select>
          <Button className="mt-2" type="submit" name="intent" value="justpaymentsCustom">
            Email
          </Button>
        </Form>
        <div className="space-y-2 mt-4">
          <h4 className="font-medium leading-none">
            Custom Email Templates
          </h4>
          <p className="text-muted-foreground text-sm">
            Instead of a complete template, with these you can insert your own body but still get all the payments and breakdowns already done.
          </Button>
          <hr className="solid" />
        </div>
        <Form method="post" action="/emails/send/payments">
          <TextArea
            placeholder="Type your message here."
            name="customContent"
            className="h-[250px] mt-2"
          />
          <Select name="emailType" >
            <SelectTrigger className="w-full mt-2">
              <SelectValue placeholder="Payments (by default)" />
            </SelectTrigger>
            <SelectContent className="bg-white2 dark:bg-black dark:text-white ">
              <ScrollArea className="h-[400px] w-[350px] rounded-md  p-4">
                <SelectGroup>
                  <SelectLabel>Payments </SelectLabel>
                  <SelectItem value="payments">Payments</SelectItem>{/*19
                  <SelectItem value="wBreakdown">W/ Full Breakdown</SelectItem>{/* 20
                  <SelectItem value="wSpec">W/ Full Breakdown & Spec</SelectItem>{/*21
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Options</SelectLabel>
                  <SelectItem value="wOptions">W/ Options</SelectItem>{/* 22
                  <SelectItem value="optionsWBreakdown">Options W/ Full Breakdown</SelectItem>{/* 23
                  <SelectItem value="optionsWSpec"> Options W/ Full Breakdown & Spec</SelectItem>{/*24
                </SelectGroup>
                <hr className="solid" />
                <SelectGroup>
                  <SelectLabel>No Tax</SelectLabel>
                  <SelectItem value="paymentsNoTax">Payments</SelectItem>{/*25
                  <SelectItem value="wBreakdownNoTax">W/ Full Breakdown</SelectItem>{/* 26
                  <SelectItem value="wSpecNoTax">W/ Full Breakdown & Spec</SelectItem>{/*27
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Options</SelectLabel>
                  <SelectItem value="wOptionsNoTax">W/ Options</SelectItem>{/*28
                  <SelectItem value="optionsWBreakdownNoTax">Options W/ Full Breakdown</SelectItem>{/* 29
                  <SelectItem value="optionsWSpecNoTax"> Options W/ Full Breakdown & Spec</SelectItem>{/* 30
                </SelectGroup>
                <hr className="solid" />
                <SelectGroup>
                  <SelectLabel>Custom Tax</SelectLabel>
                  <SelectItem value="paymentsCustom">Payments</SelectItem>{/*31
                  <SelectItem value="wBreakdownCustom">W/ Full Breakdown</SelectItem>{/*32
                  <SelectItem value="wSpecCustom">W/ Full Breakdown & Spec</SelectItem>{/* 33
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Options</SelectLabel>
                  <SelectItem value="wOptionsCustom">W/ Options</SelectItem>{/*34
                  <SelectItem value="optionsWBreakdownCustom">Options W/ Full Breakdown</SelectItem>{/*35
                  <SelectItem value="optionsWSpecCustom">W/ Full Breakdown & Spec</SelectItem>{/*36
                </SelectGroup>
              </ScrollArea>
            </SelectContent>
          </Select>
          <Button className="w-auto mt-2" type="submit" name="intent" value="justpaymentsCustom">
            Email
          </Button>
        </Form>


      </div>
    </div>
  </>
</Tabs.Content>
  */
