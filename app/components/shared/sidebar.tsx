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
import { toast } from 'sonner';
import { Menu } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Chat from "~/components/shared/chat";
import { prisma } from "~/libs";
import { GetUser } from "~/utils/loader.server";
import { SidebarNav } from "~/components/ui/sidebar-nav"

export let action = rootAction

export default function Sidebar(user, email) {
  let fetcher = useFetcher()
  const [activixActivated, setActivixActivated] = useState('');
  const activixActivatedRef = useRef(''); // useRef to store mutable value
  useEffect(() => {
    async function fetchData() {
      const userIntegration = await prisma.userIntergration.findUnique({ where: { userEmail: email } });
      const storedActivixActivated = userIntegration?.activixActivated;
      setActivixActivated(storedActivixActivated);
      activixActivatedRef.current = storedActivixActivated;
    }
    fetchData();
  }, []);

  const userIsFinance = getUserIsAllowed(user, ["FINANCE"]);

  // Check if data is still loading
  if (email === null || user === null) {
    return <div>Loading...</div>;
  }
  //const adminUser = getUserIsAllowed(user, ["ADMIN", "MANAGER",]);
  // const financeUser = getUserIsAllowed(user, ["ADMIN", "MANAGER", "FINANCE"]);
  //const userIsAllowed = getUserIsAllowed(user, ["ADMIN", "MANAGER", "EDITOR", "SALES", "FINANCE"]);

  return (
    <>
      <Sheet >
        <SheetTrigger asChild>
          <div className=' cursor-pointer text-[#fff] right-[25px] top-[25px]  fixed'>
            <Menu size={32} color="#fff" strokeWidth={1.5} />
          </div>
        </SheetTrigger>
        <SheetContent side='right' className='bg-[#121212] w-full md:w-[50%] overflow-y-auto' >
          <Tabs.Root className="flex flex-col w-[97%] " defaultValue='UserNav'          >

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
            <Tabs.List className="shrink-0 flex border-b border-[#02a9ff]" aria-label="Manage your account">
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
            <Tabs.Content className="grow p-5 bg-white2 rounded-b-md outline-none   text-white" value="MY23" >
              <h3 className='text-white '>
                WATERCRAFT
              </h3>
              <hr className="solid" />
              <div className='p-3'>
                <SidebarNav items={my23Watercraft} />
              </div>
              <h3 className='text-white ' >
                OFF-ROAD
              </h3>
              <hr className="solid text-white " />
              <div className='p-3 text-white '>
                <SidebarNav items={my23OffRoad} />
              </div>
              <h3  >
                MOTORCYCLE
              </h3>
              <hr className="solid" />
              <div className='p-3'>
                <SidebarNav items={my23Moto} />
              </div>
              <h3 >
                Used
              </h3>
              <hr className="solid" />
              <div className='p-3'>
                <RemixNavLink to='/dealer/quote/used'>
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
                <SidebarNav items={my24Moto} />
              </div>
              <h3 className='text-white'>
                OFF-ROAD
              </h3>
              <hr className="solid text-white" />
              <div className='p-3'>
                <SidebarNav items={my24OffRoad} />
              </div>
            </Tabs.Content>

            {/* User */}
            <Tabs.Content className="grow p-5  rounded-b-md outline-none border-transparent   " value="UserNav"            >
              <div className="flex flex-col items-start">
                {userIsFinance && (
                  <Dialog.Close asChild>
                    <RemixNavLink to={`/dealer/leads/finance`}>
                      <Button variant="link" className="w-full justify-start hover:text-[#02a9ff] text-white  cursor-pointer" >
                        Finance Dashboard
                      </Button>
                    </RemixNavLink>
                  </Dialog.Close>
                )}
                {activixActivated === 'yes' && (
                  <Dialog.Close asChild>
                    <RemixNavLink to={`/dealer/leads/activix`}>
                      <Button variant="link" className="w-full justify-start hover:text-[#02a9ff] text-white  cursor-pointer" >
                        Activix Dashboard
                      </Button>
                    </RemixNavLink>
                  </Dialog.Close>
                )}
                <SidebarNav items={userNavSidebarNav} />
                {user && user?.email === 'skylerzanth@outlook.com' ? (
                  <>
                    <p className="text-muted-foreground mt-10">
                      Admin Menu
                    </p>
                    <hr className="w-full justify-start cursor-pointer text-white " />
                    <SidebarNav items={adminSidebarNav} />
                  </>
                ) : (null)}
                {user && user?.email === 'skylerzanth@outlook.com' ? (
                  <>
                    <p className="text-muted-foreground mt-10">
                      Dev Menu
                    </p>
                    <hr className="w-full justify-start cursor-pointer text-white " />
                    <SidebarNav items={devSidebarNav} />
                  </>
                ) : (null)}
                {user && user?.email === 'skylerzanth@outlook.com' ? (
                  <>
                    <p className="text-muted-foreground mt-10">
                      Manager Menu
                    </p>
                    <hr className="w-full justify-start cursor-pointer text-white " />
                    <SidebarNav items={managerSidebarNav} />
                  </>
                ) : (null)}
              </div>
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
                  <fetcher.Form method="post" action='/dealer/emails/send/contact'>
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
export const userNavSidebarNav = [
  {
    title: "Email Client",
    to: "/dealer/email/client",
  },
  {
    title: "SMS Client",
    to: "/dealer/sms/app",
  },
  {
    title: "Dashboard",
    to: "/dealer/leads/sales",
  },
  {
    title: "Calendar",
    to: "/dealer/calendar/sales",
  },
  {
    title: "Payment Calculator",
    to: "/dealer/payments/calculator",
  },
  {
    title: "Motorcycle Inventory",
    to: "/dealer/inventory/motorcycle",
  },
  {
    title: "Document Builder",
    to: "/dealer/document/builder",
  },
  {
    title: "Template Builder",
    to: "/dealer/editor/templates",
  },
  {
    title: "Scripts",
    to: "/dealer/user/dashboard/scripts",
  },
  {
    title: "Sales Tracker",
    to: "/dealer/user/dashboard/salestracker",
  },
  {
    title: "Roadmap",
    to: "/roadmap",
  },
  {
    title: "Settings",
    to: "/dealer/user/dashboard/settings",
  },
  {
    title: "Logout",
    to: "/auth/logout",
  },

]
export const adminSidebarNav = [
  {
    title: "Overview",
    to: "/dealer/admin/overview",
  },
  {
    title: "Users",
    to: "/dealer/admin/users",
  },
  {
    title: "Import / Export Motor",
    to: "/dealer/admin/import/motorcycle",
  },
  {
    title: "Import / Export Parts",
    to: "/dealer/admin/import/parts",
  },
  {
    title: "Import / Export Acc",
    to: "/dealer/admin/import/acc",
  },
  {
    title: "Import / Export Service",
    to: "/dealer/admin/import/service",
  },
  {
    title: "Import / Export Leads",
    to: "/dealer/admin/import/leads",
  },
  {
    title: "Search Leads",
    to: "/dealer/admin/leads",
  },
  {
    title: "Go To Site",
    to: "/",
  },
  {
    title: "Search on Admin",
    to: "/dealer/admin/search",
  },
]
export const devSidebarNav = [
  {
    title: "Control Panel",
    to: "/devmode/controlPanel",
  },
  {
    title: "Clients",
    to: "/devmode/clients",
  },
  {
    title: "Automation",
    to: "/devmode/clients",
  },
  {
    title: "Ad Manager",
    to: "/devmode/clients",
  },
  {
    title: "Microsoft notes",
    to: "/devmode/clients",
  },
  {
    title: "Chat gpt",
    to: "/devmode/clients",
  },
]
export const managerSidebarNav = [
  {
    title: "Dashboard",
    to: "/dealer/manager/dashboard",
  },
  {
    title: "Store Hours",
    to: "/dealer/manager/storeHours",
  },
  {
    title: "Sales Schedule",
    to: "/dealer/manager/salesSched",
  },
  {
    title: "CSI",
    to: "/dealer/manager/csi",
  },
  {
    title: "Import Leads",
    to: "/dealer/manager/import/leads",
  },
  {
    title: "Export Leads",
    to: "/dealer/manager/Export/leads",
  },
  {
    title: "Import Motorcycle Inv",
    to: "/dealer/manager/import/motorcycle",
  },
  {
    title: "Export Motorcycle Inv",
    to: "/dealer/manager/export/motorcycle",
  },
  {
    title: "Import Parts",
    to: "/dealer/manager/import/parts",
  },
  {
    title: "Export Parts",
    to: "/dealer/manager/export/parts",
  },
  {
    title: "Import Accessories",
    to: "/dealer/manager/import/accessories",
  },
  {
    title: "Export Accessories",
    to: "/dealer/manager/export/accessories",
  },
  {
    title: "Import Motor Local Test",
    to: "/dealer/manager/import/motorcycle/client",
  },


]
export const my24Watercraft = [
  {
    title: "Dashboard",
    to: "/dealer/manager/dashboard",
  },
]
export const my23Watercraft = [
  {
    title: "Kawasaki",
    to: "/dealer/quote/Kawasaki",
  },
  {
    title: "Manitou",
    to: "/dealer/quote/Manitou",
  },
  {
    title: "Sea-Doo",
    to: "/dealer/quote/Sea-Doo",
  },
  {
    title: "Sea-Doo Switch",
    to: "/dealer/quote/Switch",
  },

]
export const my24Moto = [
  {
    title: "Harley-Davidson",
    to: "/dealer/quote/Harley-DavidsonMY24",
  },
]
export const my23Moto = [
  {
    title: "BMW Motorrad",
    to: "/dealer/quote/BMW-Motorrad",
  },
  {
    title: "Harley-Davidson",
    to: "/dealer/quote/Harley-Davidson",
  },
  {
    title: "Kawasaki",
    to: "/dealer/quote/Kawasaki",
  },
  {
    title: "KTM",
    to: "/dealer/quote/KTM",
  },
  {
    title: "Indian",
    to: "/dealer/quote/Indian",
  },
  {
    title: "Suzuki",
    to: "/dealer/quote/Suzuki",
  },
  {
    title: "Spyder",
    to: "/dealer/quote/Spyder",
  },
  {
    title: "Triumph",
    to: "/dealer/quote/Triumph",
  },
  {
    title: "Yamaha",
    to: "/dealer/quote/Yamaha",
  },

]
export const my24OffRoad = [
  {
    title: "Can-AM SxS",
    to: "/dealer/quote/Can-Am-SXS-MY24",
  },
  {
    title: "Can-AM Ski-Doo",
    to: "/dealer/quote/Ski-Doo-MY24",
  },
]
export const my23OffRoad = [
  {
    title: "Can-AM",
    to: "/dealer/quote/Can-Am",
  },
  {
    title: "Can-AM SXS",
    to: "/dealer/quote/Can-Am-SXS",
  },
  {
    title: "KTM",
    to: "/dealer/quote/KTM",
  },
  {
    title: "Kawasaki",
    to: "/dealer/quote/Kawasaki",
  },
  {
    title: "Ski-Doo",
    to: "/dealer/quote/Ski-Doo",
  },
  {
    title: "Suzuki",
    to: "/dealer/quote/Suzuki",
  },
  {
    title: "Triumph",
    to: "/dealer/quote/Triumph",
  },
]
