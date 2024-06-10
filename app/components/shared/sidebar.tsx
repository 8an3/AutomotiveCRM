/* eslint-disable tailwindcss/no-custom-classname */
/* eslint-disable tailwindcss/classnames-order */
/* eslint-disable jsx-a11y/alt-text */
import { Form, Link, useLoaderData, useLocation, useFetcher } from '@remix-run/react';
import {
  RemixNavLink, Input, Separator, Button, buttonVariants, Tabs, TabsContent, TabsList, TabsTrigger, Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components"
import { TextArea, } from "~/components/ui"
import { Sheet, SheetClose, SheetContent, SheetTrigger, } from "~/components/ui/sheet"
import { getUserIsAllowed } from "~/helpers";
import * as Dialog from '@radix-ui/react-dialog';
import { Textarea } from '~/components/ui/textarea';
import { toast } from 'sonner';
import { Menu } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { prisma } from "~/libs";
import { cn } from "~/components/ui/utils"

interface SidebarNavProps extends HTMLAttributes<HTMLElement> {
  items: {
    to: string
    title: string
  }[]
}
export default function Sidebar(user, email) {
  let fetcher = useFetcher()
  const [activixActivated, setActivixActivated] = useState('');
  const activixActivatedRef = useRef('');
  const [isActive, setIsActive] = useState(false);
  const location = useLocation()
  const pathname = location.pathname
  let quoteUrl = '/dealer/quote/'


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
      <nav className={cn("flex space-x-2 flex-col lg:space-x-0 lg:space-y-1", className)} {...props} >
        {items.map((item) => (
          <Link
            to={item.to}
            key={item.to}
            className="justify-start" >
            <SheetClose className='w-[90%]'>
              <Button
                variant='ghost'
                className={cn(
                  'justify-start text-left',
                  buttonVariants({ variant: 'ghost' }),
                  pathname === item.to
                    ? "bg-[#232324] hover:bg-muted/50 w-[90%]   "
                    : "hover:bg-muted/50 text-[#a1a1aa]  w-[90%]  ",
                  "justify-start w-[90%]"
                )} >
                {item.title}

              </Button>
            </SheetClose>
          </Link>
        ))}
      </nav>
    )
  }
  const my24Watercraft = [
    {
      title: "Kawasaki",
      to: quoteUrl + "Kawasaki",
    },
  ]
  const my23Watercraft = [
    {
      title: "Kawasaki",
      to: quoteUrl + "Kawasaki",
    },
    {
      title: "Manitou",
      to: quoteUrl + "Manitou",
    },
    {
      title: "Sea-Doo",
      to: quoteUrl + "Sea-Doo",
    },
    {
      title: "Sea-Doo Switch",
      to: quoteUrl + "Switch",
    },

  ]
  const my24Moto = [
    {
      title: "Harley-Davidson",
      to: quoteUrl + "Harley-DavidsonMY24",
    },
  ]
  const my23Moto = [
    {
      title: "BMW Motorrad",
      to: quoteUrl + "BMW-Motorrad",
    },
    {
      title: "Harley-Davidson",
      to: quoteUrl + "Harley-Davidson",
    },
    {
      title: "Kawasaki",
      to: quoteUrl + "Kawasaki",
    },
    {
      title: "KTM",
      to: quoteUrl + "KTM",
    },
    {
      title: "Indian",
      to: quoteUrl + "Indian",
    },
    {
      title: "Suzuki",
      to: quoteUrl + "Suzuki",
    },
    {
      title: "Spyder",
      to: quoteUrl + "Spyder",
    },
    {
      title: "Triumph",
      to: quoteUrl + "Triumph",
    },
    {
      title: "Yamaha",
      to: quoteUrl + "Yamaha",
    },

  ]
  const my24OffRoad = [
    {
      title: "Can-AM SxS",
      to: quoteUrl + "Can-Am-SXS-MY24",
    },
    {
      title: "Can-AM Ski-Doo",
      to: quoteUrl + "Ski-Doo-MY24",
    },
  ]
  const my23OffRoad = [
    {
      title: "Can-AM",
      to: quoteUrl + "Can-Am",
    },
    {
      title: "Can-AM SXS",
      to: quoteUrl + "Can-Am-SXS",
    },
    {
      title: "KTM",
      to: quoteUrl + "KTM",
    },
    {
      title: "Kawasaki",
      to: quoteUrl + "Kawasaki",
    },
    {
      title: "Ski-Doo",
      to: quoteUrl + "Ski-Doo",
    },
    {
      title: "Suzuki",
      to: quoteUrl + "Suzuki",
    },
    {
      title: "Triumph",
      to: quoteUrl + "Triumph",
    },
  ]

  return (
    <>
      <Sheet >
        <SheetTrigger>
          <div className=' cursor-pointer text-[#fff] right-[25px] top-[25px]  fixed'>
            <Menu size={32} color="#fff" strokeWidth={1.5} />
          </div>
        </SheetTrigger>
        <SheetContent side='right' className='bg-background w-full md:w-[50%] overflow-y-auto text-[#f9f9f9]' >
          <Tabs defaultValue="User" className="w-full mx-auto justify-center">
            <TabsList className='mx-auto w-full'>
              <TabsTrigger value="User">User</TabsTrigger>
              <TabsTrigger value="MY23">MY23</TabsTrigger>
              <TabsTrigger value="MY24">MY24</TabsTrigger>
              <TabsTrigger value="Contact">Contact</TabsTrigger>
            </TabsList>
            <TabsContent value="User">
              <div className="flex flex-col items-start">
                <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>
                      Menu
                    </AccordionTrigger>
                    <AccordionContent>
                      <hr className="my-4 text-muted-foreground w-[95%] mx-auto" />
                      <div className="font-semibold">Sales</div>
                      <div className="my-4">
                        <SidebarNav items={salesNavSidebarNav} />
                      </div>
                      <hr className="my-4 text-muted-foreground w-[95%] mx-auto" />
                      <div className="font-semibold">Document</div>
                      <div className="my-4">
                        <SidebarNav items={documentNavSidebarNav} />
                      </div>
                      <hr className="my-4 text-muted-foreground w-[95%] mx-auto" />
                      <div className="font-semibold">User</div>
                      <div className="my-4">
                        <SidebarNav items={userNavSidebarNav} />
                      </div>
                      {userIsFinance && (
                        <Link to='/dealer/leads/finance'>
                          <Button
                            variant='ghost'
                            className={cn(
                              buttonVariants({ variant: "ghost" }),
                              pathname === '/dealer/leads/finance'
                                ? "bg-[#232324] hover:bg-muted/50 w-[90%] border-l-[#0969da]"
                                : "hover:bg-muted/50",
                              "justify-start"
                            )}
                          >
                            <Dialog.Close asChild>
                              Finance Dashboard

                            </Dialog.Close>
                          </Button>
                        </Link>
                      )}
                      {activixActivated === 'yes' && (
                        <Link to='/dealer/leads/activix'>
                          <Button
                            variant='ghost'
                            className={cn(
                              buttonVariants({ variant: "ghost" }),
                              pathname === '/dealer/leads/activix'
                                ? "bg-[#232324] hover:bg-muted/50 w-[90%] border-l-[#0969da]"
                                : "hover:bg-muted/50",
                              "justify-start"
                            )}
                          >
                            <Dialog.Close asChild>
                              Activix Dashboard
                            </Dialog.Close>
                          </Button>
                        </Link>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                  {user && user?.email === 'skylerzanth@outlook.com' ? (
                    <AccordionItem value="item-2">
                      <AccordionTrigger>
                        Admin Menu
                      </AccordionTrigger>
                      <AccordionContent>
                        <hr className="my-4 text-muted-foreground w-[95%] mx-auto" />
                        <div className="font-semibold">Admin</div>
                        <div className="my-4">
                          <SidebarNav items={adminSidebarNav} />
                        </div>
                        <hr className="my-4 text-muted-foreground w-[95%] mx-auto" />
                        <div className="font-semibold">User</div>
                        <div className="my-4">
                          <SidebarNav items={userNavSidebarNav} />
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ) : (null)}
                  {user && user?.email === 'skylerzanth@outlook.com' ? (
                    <AccordionItem value="item-3">
                      <AccordionTrigger>
                        Dev Menu
                      </AccordionTrigger>
                      <AccordionContent>
                        <hr className="my-4 text-muted-foreground w-[95%] mx-auto" />
                        <div className="font-semibold">Dev</div>
                        <div className="my-4">
                          <SidebarNav items={devSidebarNav} />
                        </div>
                        <hr className="my-4 text-muted-foreground w-[95%] mx-auto" />
                        <div className="font-semibold">User</div>
                        <div className="my-4">
                          <SidebarNav items={userNavSidebarNav} />
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ) : (null)}
                  {user && user?.email === 'skylerzanth@outlook.com' ? (
                    <AccordionItem value="item-4">
                      <AccordionTrigger>
                        Manager Menu
                      </AccordionTrigger>
                      <AccordionContent>
                        <hr className="my-4 text-muted-foreground w-[95%] mx-auto" />
                        <div className="font-semibold">Manager</div>
                        <div className="my-4">
                          <SidebarNav items={managerSidebarNav} />
                        </div>
                        <hr className="my-4 text-muted-foreground w-[95%] mx-auto" />
                        <div className="font-semibold">User</div>
                        <div className="my-4">
                          <SidebarNav items={userNavSidebarNav} />
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ) : (null)}
                  {user && user?.email === 'skylerzanth@outlook.com' ? (
                    <AccordionItem value="item-5">
                      <AccordionTrigger>
                        Service Menu
                      </AccordionTrigger>
                      <AccordionContent>
                        <hr className="my-4 text-muted-foreground w-[95%] mx-auto" />
                        <div className="font-semibold">Service</div>
                        <div className="my-4">
                          <SidebarNav items={serviceNavSidebarNav} />
                        </div>
                        <hr className="my-4 text-muted-foreground w-[95%] mx-auto" />
                        <div className="font-semibold">User</div>
                        <div className="my-4">
                          <SidebarNav items={userNavSidebarNav} />
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ) : (null)}
                </Accordion>
              </div>
            </TabsContent>
            <TabsContent value="MY23">
              <>
                <Accordion type="multiple" className="w-full" >
                  <AccordionItem value="item-1">
                    <AccordionTrigger  >
                      WATERCRAFT
                    </AccordionTrigger>
                    <AccordionContent>
                      <SidebarNav items={my23Watercraft} />
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2"  >
                    <AccordionTrigger    >
                      MOTORCYCLE
                    </AccordionTrigger>
                    <AccordionContent>
                      <SidebarNav items={my23Moto} />
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3"  >
                    <AccordionTrigger   >
                      OFF-ROAD
                    </AccordionTrigger>
                    <AccordionContent>
                      <SidebarNav items={my23OffRoad} />
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-4"  >
                    <AccordionTrigger   >
                      ON-ROAD
                    </AccordionTrigger>
                    <AccordionContent >
                      <SidebarNav items={managerSidebarNav} />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                <Link to='/dealer/quote/used'>
                  <Button
                    variant='ghost'
                    className={cn(
                      buttonVariants({ variant: "ghost" }),
                      pathname === '/dealer/quote/used'
                        ? "bg-[#232324] hover:bg-muted/50 w-[90%] border-l-[#0969da]"
                        : "hover:bg-muted/50 w-[90%]",
                      "justify-start"
                    )}
                  >
                    <Dialog.Close>
                      USED
                    </Dialog.Close>
                  </Button>
                </Link>
              </>
            </TabsContent>
            <TabsContent value="MY24">
              <Accordion type="multiple" className="w-full" >
                <AccordionItem value="item-1"  >
                  <AccordionTrigger    >
                    WATERCRAFT
                  </AccordionTrigger>
                  <AccordionContent>

                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2"  >
                  <AccordionTrigger  >
                    MOTORCYCLE
                  </AccordionTrigger>
                  <AccordionContent>
                    <SidebarNav items={my24Moto} />
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3"  >
                  <AccordionTrigger  >
                    OFF-ROAD
                  </AccordionTrigger>
                  <AccordionContent>
                    <SidebarNav items={my24OffRoad} />
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4"  >
                  <AccordionTrigger >
                    ON-ROAD
                  </AccordionTrigger>
                  <AccordionContent>

                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <Link to='/dealer/quote/used'>
                <Button
                  variant='ghost'
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    pathname === '/dealer/quote/used'
                      ? "bg-[#232324] hover:bg-muted/50 w-[90%] border-l-[#0969da]"
                      : "hover:bg-muted/50 w-[90%]",
                    "justify-start"
                  )}
                >
                  <Dialog.Close  >
                    USED
                  </Dialog.Close>
                </Button>
              </Link>

            </TabsContent>
            <TabsContent value="Contact">
              <>
                <div className="border-none p-0 text-foreground">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h2 className="text-2xl font-thin text-foreground">
                        Contact
                      </h2>
                      <p className="text-sm dark:text-black text-foreground">
                        If a feature could help you sell more, but we dont have it? Let us
                        know, we can implement it. Or would like to submit a script or maybe you found a bug, let us know!
                      </p>
                    </div>
                  </div>
                  <hr className="solid mt-4 mb-4" />
                  <fetcher.Form method="post" action='/dealer/emails/send/contact'>
                    <div className="relative mt-5">
                      <TextArea
                        placeholder="Type your message here."
                        name="customContent"
                        className="h-[200px]     w-[95%] border-border bg-background"
                      />
                      <label className=" text-sm absolute left-3 -top-3 px-2 rounded-full bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Message Body</label>
                    </div>
                    <div className="relative mt-5">
                      <Input name="userFname" className="w-[95%] border-border bg-background" />
                      <label className=" text-sm absolute left-3 -top-3 px-2 rounded-full bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Name</label>
                    </div>
                    <div className="relative mt-5">
                      <Input name="userEmail" className="w-[95%] border-border bg-background" />
                      <label className=" text-sm absolute left-3 -top-3 px-2 rounded-full bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Email</label>
                    </div>
                    <Button name='intent' value='contactForm' type='submit' className="bg-[#ff0000] mt-3 w-[75px] ml-2  mr-2 text-foreground    font-bold uppercase   text-xs  rounded shadow hover:shadow-md outline-none focus:outline-none  ease-linear transition-all text-center duration-150"
                      onClick={() => {
                        toast.success('Event has been created')
                      }}
                    >
                      Email
                    </Button>
                  </fetcher.Form>
                </div>

              </>
            </TabsContent>
          </Tabs>

        </SheetContent>
      </Sheet >
    </>
  )
}

export const serviceNavSidebarNav = [
  {
    title: "Service Dashboard",
    to: "/dealer/service/dashboard",
  },
  {
    title: "Technician Clock",
    to: "/dealer/service/techClock",
  },
]
export const userNavSidebarNav = [
  {
    title: "Staff Area",
    to: "/dealer/staff/chat",
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
export const documentNavSidebarNav = [
  {
    title: "Document Builder",
    to: "/dealer/document/builder",
  },
  {
    title: "Template Builder",
    to: "/dealer/user/dashboard/templates",
  },
  {
    title: "Scripts",
    to: "/dealer/user/dashboard/scripts",
  },


]
export const salesNavSidebarNav = [
  {
    title: "Email Client",
    to: "/dealer/email/client",
  },
  {
    title: "Dashboard",
    to: "/dealer/leads/sales/dashboard",
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
    title: "Import / Export",
    to: "/dealer/manager/importExport",
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
