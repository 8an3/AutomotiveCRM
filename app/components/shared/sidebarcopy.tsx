/* eslint-disable tailwindcss/no-custom-classname */
/* eslint-disable tailwindcss/classnames-order */
/* eslint-disable jsx-a11y/alt-text */
import { Form, Link, useLoaderData, useLocation, useFetcher } from '@remix-run/react';
import { RemixNavLink, Input, Separator, Button, buttonVariants, Tabs, TabsContent, TabsList, TabsTrigger } from "~/components"
import { TextArea, } from "~/components/ui"
import { rootAction, useUserLoader } from './actions';
import { Sheet, SheetClose, SheetContent, SheetTrigger, } from "~/components/ui/sheet"
import { getUserIsAllowed } from "~/helpers";
import * as Dialog from '@radix-ui/react-dialog';
import * as Tabs from '@radix-ui/react-tabs';
import { Textarea } from '~/components/ui/textarea';
import { toast } from 'sonner';
import { Menu } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { prisma } from "~/libs";
import { cn } from "~/components/ui/utils"
import { type LinksFunction } from '@remix-run/node';
//import burger from '~/styles/sass/sass/burger.css'
import { SubNav } from '@primer/react'


//export const links: LinksFunction = () => [  { rel: "stylesheet", href: burger, },];

interface SidebarNavProps extends HTMLAttributes<HTMLElement> {
  items: {
    to: string
    title: string
  }[]
}



export let action = rootAction

export default function Sidebar(user, email) {
  let fetcher = useFetcher()
  const [activixActivated, setActivixActivated] = useState('');
  const activixActivatedRef = useRef('');
  const [isActive, setIsActive] = useState(false);
  const [userTab, setUserTab] = useState(true);
  const [my23tab, setmy23tab] = useState(false);
  const [my24tab, setmy24tab] = useState(false);
  const [contactTab, setcontactTab] = useState(false);

  const handleButtonClick = (e) => {
    e.preventDefault();
    setIsActive((prevState) => !prevState);
  };
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
  if (email === null || user === null) {
    return <div>Loading...</div>;
  }
  function SidebarNav({ className, items, ...props }: SidebarNavProps) {
    const location = useLocation();
    const pathname = location.pathname
    console.log(pathname)
    return (
      <ul
        className={cn(
          "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
          className
        )}
        {...props}
      >
        {items.map((item) => (
          <li key={item.to}>
            <Link
              to={item.to}
              className={cn(
                'justify-start text-left',
                buttonVariants({ variant: 'ghost' }), // Assuming buttonVariants is a valid function
                {
                  'bg-[#232324] hover:bg-muted/50 w-[90%]': pathname === item.to,
                  'hover:bg-muted/50': pathname !== item.to,
                }
              )}
            >
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    )
  }
  return (
    <>
      <Sheet >
        <SheetTrigger asChild>
          <div className=' cursor-pointer text-[#fff] right-[25px] top-[25px]  fixed'>
            <Menu size={32} color="#fff" strokeWidth={1.5} />
          </div>
        </SheetTrigger>
        <SheetContent side='right' className='bg-background w-full md:w-[50%] overflow-y-auto' >

          <Tabs defaultValue="User" className="w-full">
            <TabsList>
              <TabsTrigger value="User">User</TabsTrigger>
              <TabsTrigger value="MY23">MY23</TabsTrigger>
              <TabsTrigger value="MY24">MY24</TabsTrigger>
              <TabsTrigger value="Contact">Contact</TabsTrigger>
            </TabsList>
            <TabsContent value="User">
              <>
                <div className="flex flex-col items-start">
                  <ul className="menu bg-base-200 w-56 rounded-box">
                    <SidebarNav items={userNavSidebarNav} />
                    {userIsFinance && (
                      <li>
                        <Dialog.Close asChild>
                          <Link to='/dealer/leads/finance'  >
                            Finance Dashboard
                          </Link>
                        </Dialog.Close>
                      </li>
                    )}
                    {activixActivated === 'yes' && (
                      <li>
                        <Dialog.Close asChild>
                          <Link to='/dealer/leads/activix'  >
                            Activix Dashboard
                          </Link>
                        </Dialog.Close>
                      </li>
                    )}
                    {user && user?.email === 'skylerzanth@outlook.com' ? (
                      <li>
                        <details>
                          <summary>Admin Menu</summary>
                          <ul>
                            <SidebarNav items={adminSidebarNav} />
                          </ul>
                        </details>
                      </li>
                    ) : (null)}
                    {user && user?.email === 'skylerzanth@outlook.com' ? (
                      <li>
                        <details  >
                          <summary>
                            Dev Menu
                          </summary>
                          <ul>
                            <SidebarNav items={devSidebarNav} />
                          </ul>
                        </details>
                      </li>
                    ) : (null)}
                    {user && user?.email === 'skylerzanth@outlook.com' ? (
                      <li>
                        <details   >
                          <summary>Manager Menu</summary>
                          <ul>
                            <SidebarNav items={managerSidebarNav} />
                          </ul>
                        </details>
                      </li>
                    ) : (null)}
                  </ul>
                </div>
              </>
            </TabsContent>
            <TabsContent value="MY23">
              <>
                <ul className="menu bg-background w-56 rounded-box">
                  <li>
                    <details open>
                      <summary>WATERCRAFT</summary>
                      <ul>
                        <SidebarNav items={my23Watercraft} />
                      </ul>
                    </details>
                  </li>
                  <li>
                    <details open>
                      <summary>MOTORCYCLE</summary>
                      <ul>
                        <SidebarNav items={my23Moto} />
                      </ul>
                    </details>
                  </li>
                  <li>
                    <details open>
                      <summary>OFF-ROAD</summary>
                      <ul>
                        <SidebarNav items={my23OffRoad} />
                      </ul>
                    </details>
                  </li>
                  <li>
                    <details open>
                      <summary>ON-ROAD</summary>
                      <ul>
                      </ul>
                    </details>
                  </li>
                  <li>
                    <Dialog.Close asChild>
                      <Link to='/dealer/leads/finance'  >
                        USED
                      </Link>
                    </Dialog.Close>
                  </li>
                </ul>
              </>
            </TabsContent>
            <TabsContent value="MY24">
              <ul className="menu bg-background  w-full rounded-box">
                <li>
                  <details open>
                    <summary>WATERCRAFT</summary>
                    <ul>
                    </ul>
                  </details>
                </li>
                <li>
                  <details open>
                    <summary>MOTORCYCLE</summary>
                    <ul>
                      <SidebarNav items={my24Moto} />

                    </ul>
                  </details>
                </li>
                <li>
                  <details open>
                    <summary>OFF-ROAD</summary>
                    <ul>
                      <SidebarNav items={my24OffRoad} />

                    </ul>
                  </details>
                </li>
                <li>
                  <Dialog.Close asChild>
                    <Link to='/dealer/leads/finance'  >
                      USED
                    </Link>
                  </Dialog.Close>
                </li>
              </ul>
            </TabsContent>
            <TabsContent value="Contact">
              <>
                <div className="border-none p-0">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h2 className="text-2xl font-thin text-foreground">
                        Contact
                      </h2>
                      <p className="text-sm dark:text-black text-foreground">
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
                    <Button name='intent' value='contactForm' type='submit' className="bg-primary mt-3 w-[75px] ml-2  mr-2 text-foreground  active:bg-black font-bold uppercase   text-xs  rounded shadow hover:shadow-md outline-none focus:outline-none  ease-linear transition-all text-center duration-150"
                      onClick={() => {
                        toast.success('Event has been created')
                      }}
                    >
                      Email
                    </Button>
                  </fetcher.Form>
                </div>
                <div className="mt-[50px] mx-auto ">
                  <h2 className="text-2xl font-thin text-foreground">
                    Scripts, closes and rebuttals
                  </h2>
                  <p className="text-sm text-foreground">
                    The tool box is there so
                    you and other sales people can refer to it whenever you need it.
                  </p>
                  <Form method="post" action="/emails/send/contact">
                    <Textarea placeholder="Type your message here." name="customContent" className="h-[200px] w-[95%]" />
                    <Input name="userFname" className="w-[95%]" placeholder="John Doe" />
                    <Input name="userEmail" className="w-[95%]" placeholder="johndoe@gmail.com" />
                    <Input type="hidden" name="userFname" value='test' />

                    <Button name='intent' value='scriptForm' type='submit' className="mt-3 bg-primary w-[75px] ml-2  mr-2 text-foreground  active:bg-black font-bold uppercase   text-xs  rounded shadow hover:shadow-md outline-none focus:outline-none  ease-linear transition-all text-center duration-150" onClick={() => {
                      toast.success('Event has been created')

                    }}  >
                      Email
                    </Button>

                  </Form>
                </div>
              </>
            </TabsContent>
          </Tabs>

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


/**
 *
 *
 *  <h3 className='text-foreground'>
                WATERCRAFT
              </h3>
              <hr className="solid text-foreground" />
              <div className='p-3'>
              </div>
              <h3 className='text-foreground'>
                MOTORCYCLE
              </h3>
              <hr className="solid text-foreground" />
              <div className='p-3'>
              </div>
              <h3 className='text-foreground'>
                OFF-ROAD
              </h3>
              <hr className="solid text-foreground" />


              <h3 className='text-foreground '>
                WATERCRAFT
              </h3>
              <hr className="solid" />
              <div className='p-3'>
              </div>
              <h3 className='text-foreground ' >
                OFF-ROAD
              </h3>
              <hr className="solid text-foreground " />
              <div className='p-3 text-foreground '>
              </div>
              <h3  >
                MOTORCYCLE
              </h3>
              <hr className="solid" />
              <div className='p-3'>
              </div>
              <h3 >
                Used
              </h3>
              <hr className="solid" />
              <div className='p-3'>
                <RemixNavLink to='/dealer/quote/used'>
                  <SheetClose asChild>
                    <Button variant="link" className="w-full justify-start hover:text-primary text-foreground  cursor-pointer"  >
                      Used
                    </Button>


                  </SheetClose>
                </RemixNavLink>
              </div> */
