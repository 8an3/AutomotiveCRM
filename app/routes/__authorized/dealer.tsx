import { json, redirect, type LoaderFunction, type ActionFunction } from '@remix-run/node';
import { Outlet, useFetcher, useLoaderData, useLocation, Link, useSubmit } from '@remix-run/react';
import { getSession, commitSession, authSessionStorage, destroySession } from "~/sessions/auth-session.server";
import { GetUser } from "~/utils/loader.server";
import NotificationSystem from "~/routes/__authorized/dealer/notifications";
import { prisma } from '~/libs';
//import Sidebar, { managerSidebarNav, adminSidebarNav, devSidebarNav, } from '~/components/shared/sidebar'
import UserSideBar from '~/components/shared/userSideBar';
import Interruptions from '~/components/shared/interruptions';
import financeFormSchema from '~/overviewUtils/financeFormSchema';
import GetData from './dealer/email/notificationsClient';
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
  RemixNavLink, Separator, Button, buttonVariants, Tabs, TabsContent, TabsList, TabsTrigger,
} from "~/components"
import { useEffect, useRef, useState } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip"
import { getUserIsAllowed } from "~/helpers";

export async function loader({ request, params }: LoaderFunction) {
  let q = new URL(request.url).searchParams.get('q')
  // if (!q) return []
  if (q) {
    q = q.toLowerCase();
    let result;
    console.log(q, 'q')
    const getit = await prisma.clientfile.findMany({})
    console.log(getit, 'getit')
    // const searchResults = await getit//searchCases(q)
    result = getit.filter(result =>
      result.email?.includes(q) ||
      result.phone?.includes(q) ||
      result.firstName?.includes(q) ||
      result.lastName?.includes(q)
    )
    console.log(getit, 'getit', result, 'results',)
    return result
  }
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
  return json({ user, email, interruptionsData, loadNewLead, });
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
      //const finance = await prisma
      const location = formData.pathname //'/dealer/leads/sales'
      return redirect(String(location));
    } catch (error) {
      console.error('Error updating interruption:', error);
      // Handle the error gracefully, such as displaying a message to the user or logging additional information
      throw error; // Rethrow the error to propagate it further if needed
    }
  }
  if (formData.intent === 'updateNewLead') {
    await prisma.notificationsUser.update({
      where: { id: formData.id },
      data: {
        read: 'true'
      }
    });
    const location = `/dealer/leads/sales/newLeads`
    return redirect(location);
  }


  return null
};

export default function SettingsLayout() {
  const { user, email, interruptionsData, loadNewLead, getEmails } = useLoaderData()
  const location = useLocation();
  const pathname = location.pathname
  let fetcher = useFetcher()
  const submit = useSubmit()


  // ------------------------ search -----------------------//
  let [show, setShow] = useState(false)
  let ref = useRef()
  let search = useFetcher()

  useEffect(() => {
    if (show) {
      ref.current.select()
    }
  }, [show])

  useEffect(() => {
    setShow(false)
  }, [location])

  // bind command + k
  useEffect(() => {
    let listener = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault()
        setShow(true)
      }
    }
    window.addEventListener('keydown', listener)
    return () => window.removeEventListener('keydown', listener)
  }, [])

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  // ------------------------ search -----------------------//

  // ------------------------ navigation ------------------//
  /**  <Sidebar user={user} email={email} /> */
  let quoteUrl = '/dealer/quote/new/'
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
  const userIsFinance = user.positions.some(
    (pos) => pos.position === 'Finance Manager' || pos.position === 'Administrator'
  );
  console.log(userIsFinance, user, 'user userisfinance');
  const userIsSales = user.positions.some(
    (pos) => pos.position === 'Sales' || pos.position === 'Administrator'
  );
  const userIsManager = user.positions.some(
    (pos) => pos.position === 'Manager' || pos.position === 'Administrator'
  );
  const userIsADMIN = user.positions.some(
    (pos) => pos.position === 'Administrator'
  );
  const userIsDEV = user.positions.some(
    (pos) => pos.position === 'DEV' || pos.position === 'Administrator'
  );
  const userIsSERVICE = user.positions.some(
    (pos) => pos.position === 'Service' || pos.position === 'Administrator'
  );

  const userIsACCESSORIES = getUserIsAllowed(user, ["ACCESSORIES"]);
  const userIsPARTS = getUserIsAllowed(user, ["PARTS"]);
  const userIsTECHNICIAN = getUserIsAllowed(user, ["TECHNICIAN"]);
  const userIsRECIEVING = getUserIsAllowed(user, ["RECIEVING"]);
  const userIsNORMAL = getUserIsAllowed(user, ["NORMAL"]);
  const userIsEDITOR = getUserIsAllowed(user, ["EDITOR"]);
  /**
   *
          {/* activix *
   *
           {/* accessories *
  {userIsACCESSORIES && (
    <>
    </>
  )}
     {/* PARTS *
  {userIsPARTS && (
    <>
    </>
  )}
     {/*  TECHNICIAN *
  {userIsTECHNICIAN && (
    <>
    </>
  )}
   {/*  RECIEVING *
  {userIsRECIEVING && (
    <>
    </>
  )}
   {/*  NORMAL  *
  {userIsNORMAL && (
    <>
    </>
  )}
   {/*  EDITOR *
  {userIsEDITOR && (
    <>
    </>
  )} */
  // ------------------------ navigation ------------------//

  // ------------------------ interuptions ------------------//
  // bind command + i
  useEffect(() => {
    let listener = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'i') {
        event.preventDefault()
        const formData = new FormData();
        formData.append("userEmail", email);
        formData.append("intent", 'createInterruption');
        formData.append("pathname", pathname);
        submit(formData, { method: "post" });
      }
    }
    window.addEventListener('keydown', listener)
    return () => window.removeEventListener('keydown', listener)
  }, [])
  // ------------------------ interuptions ------------------//
  // <UserSideBar user={user} email={email} />
  //<NotificationSystem interruptionsData={interruptionsData} loadNewLead={loadNewLead} getEmails={getEmails} />
  return (
    <>
      <SearchFunction />
      <div className=''>
        <DropdownMenu>
          <DropdownMenuTrigger >
            <Button variant='ghost' size='icon' className='cursor-pointer text-[#fff] right-[25px] top-[25px]  fixed'>
              <Menu size={32} color="#fff" strokeWidth={1.5} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className=" absolute right-0 top-full mt-2  w-56  bg-background border border-border max-h-[500px] overflow-y-auto">
            {/* Interruptions */}
            <Interruptions user={user} email={email} />
            <DropdownMenuSeparator />
            {/* Quotes */}
            <DropdownMenuLabel className='text-primary'>Quotes</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {/* my24 */}
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className='cursor-pointer'>MY24</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className="bg-background">
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger className='cursor-pointer'>Watercraft</DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent className="bg-background w-[200px]">
                          {my24Watercraft.map((item, index) => (
                            <DropdownMenuItem
                              key={index}
                              className={cn(
                                '',
                                pathname === item.to
                                  ? "bg-accent text-accent-foreground w-[95%] rounded-[4px]"
                                  : "focus:bg-accent focus:text-accent-foreground w-[95%] rounded-[4px]",
                                "justify-start "
                              )}
                            >
                              <Link
                                to={item.to}
                                className='w-[95%] rounded-[6px] flex justify-between items-center'>
                                {item.title}
                              </Link>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger className='cursor-pointer'>Motorcycle</DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent className="bg-background">
                          {my24Moto.map((item, index) => (
                            <DropdownMenuItem
                              key={index}
                              className={cn(
                                '',
                                pathname === item.to
                                  ? "bg-accent text-accent-foreground w-[95%] rounded-[4px]"
                                  : "focus:bg-accent focus:text-accent-foreground w-[95%] rounded-[4px]",
                                "justify-start "
                              )}
                            >
                              <Link
                                to={item.to}
                                className='w-[95%] rounded-[6px] flex justify-between items-center'>
                                {item.title}
                              </Link>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger className='cursor-pointer'>Off-Road</DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent className="bg-background">
                          {my24OffRoad.map((item, index) => (
                            <DropdownMenuItem
                              key={index}
                              className={cn(
                                '',
                                pathname === item.to
                                  ? "bg-accent text-accent-foreground w-[95%] rounded-[4px]"
                                  : "focus:bg-accent focus:text-accent-foreground w-[95%] rounded-[4px]",
                                "justify-start "
                              )}
                            >
                              <Link
                                to={item.to}
                                className='w-[95%] rounded-[6px] flex justify-between items-center'>
                                {item.title}
                              </Link>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger disabled className='cursor-pointer'>On-Road</DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent className="bg-background">
                          <DropdownMenuItem>Email</DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              {/* my23 */}
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className='cursor-pointer'>MY23</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className='bg-background'>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger className='cursor-pointer'>Watercraft</DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent className="bg-background">
                          {my23Watercraft.map((item, index) => (
                            <DropdownMenuItem
                              key={index}
                              className={cn(
                                '',
                                pathname === item.to
                                  ? "bg-accent text-accent-foreground w-[95%] rounded-[4px]"
                                  : "focus:bg-accent focus:text-accent-foreground w-[95%] rounded-[4px]",
                                "justify-start "
                              )}
                            >
                              <Link
                                to={item.to}
                                className='w-[95%] rounded-[6px] flex justify-between items-center'>
                                {item.title}
                              </Link>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger className='cursor-pointer'>Motorcycle</DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent className="bg-background">
                          {my23Moto.map((item, index) => (
                            <DropdownMenuItem
                              key={index}
                              className={cn(
                                '',
                                pathname === item.to
                                  ? "bg-accent text-accent-foreground w-[95%] rounded-[4px]"
                                  : "focus:bg-accent focus:text-accent-foreground w-[95%] rounded-[4px]",
                                "justify-start "
                              )}
                            >
                              <Link
                                to={item.to}
                                className='w-[95%] rounded-[6px] flex justify-between items-center'>
                                {item.title}
                              </Link>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger className='cursor-pointer'>Off-Road</DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent className="bg-background">
                          {my23OffRoad.map((item, index) => (
                            <DropdownMenuItem
                              key={index}
                              className={cn(
                                '',
                                pathname === item.to
                                  ? "bg-accent text-accent-foreground w-[95%] rounded-[4px]"
                                  : "focus:bg-accent focus:text-accent-foreground w-[95%] rounded-[4px]",
                                "justify-start "
                              )}
                            >
                              <Link
                                to={item.to}
                                className='w-[95%] rounded-[6px] flex justify-between items-center'>
                                {item.title}
                              </Link>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger disabled className='cursor-pointer'>On-Road</DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent className="bg-background">
                          <DropdownMenuItem>Email</DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            {/* sales */}
            {userIsSales && (
              <>
                <DropdownMenuLabel className='text-primary'>Sales</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {salesNavSidebarNav.map((item, index) => (
                  <DropdownMenuItem
                    key={index}
                    className={cn(
                      ' ',
                      pathname === item.to
                        ? "bg-accent text-accent-foreground w-[95%] rounded-[4px]    "
                        : "focus:bg-accent focus:text-accent-foreground w-[95%] rounded-[4px]",
                      "justify-start "
                    )}
                  >
                    <Link
                      to={item.to}
                      className='w-full rounded-[4px] flex justify-between items-center'>
                      {item.title}
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
              </>
            )}
            {/* finance */}
            {userIsFinance && (
              <>
                <DropdownMenuLabel className='text-primary'>Finance</DropdownMenuLabel>
                <DropdownMenuSeparator />

                {financeNavSidebarNav.map((item, index) => (
                  <DropdownMenuItem
                    key={index}
                    className={cn(
                      ' ',
                      pathname === item.to
                        ? "bg-accent text-accent-foreground w-[95%] rounded-[4px]    "
                        : "focus:bg-accent focus:text-accent-foreground w-[95%] rounded-[4px]",
                      "justify-start "
                    )}
                  >
                    <Link
                      to={item.to}
                      className='w-full rounded-[4px] flex justify-between items-center'>
                      {item.title}
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
              </>
            )}
            {/* manager */}
            {userIsManager && (
              <>
                <DropdownMenuLabel className='text-primary'>Manager</DropdownMenuLabel>
                <DropdownMenuSeparator />

                {managerSidebarNav.map((item, index) => (
                  <DropdownMenuItem
                    key={index}
                    className={cn(
                      ' ',
                      pathname === item.to
                        ? "bg-accent text-accent-foreground w-[95%] rounded-[4px]    "
                        : "focus:bg-accent focus:text-accent-foreground w-[95%] rounded-[4px]",
                      "justify-start "
                    )}
                  >
                    <Link
                      to={item.to}
                      className='w-full rounded-[4px] flex justify-between items-center'>
                      {item.title}
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
              </>
            )}
            {/* admin */}
            {userIsADMIN && (
              <>
                <DropdownMenuLabel className='text-primary'>Administrator</DropdownMenuLabel>
                <DropdownMenuSeparator />

                {adminSidebarNav.map((item, index) => (
                  <DropdownMenuItem
                    key={index}
                    className={cn(
                      ' ',
                      pathname === item.to
                        ? "bg-accent text-accent-foreground w-[95%] rounded-[4px]    "
                        : "focus:bg-accent focus:text-accent-foreground w-[95%] rounded-[4px]",
                      "justify-start "
                    )}
                  >
                    <Link
                      to={item.to}
                      className='w-full rounded-[4px] flex justify-between items-center'>
                      {item.title}
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
              </>
            )}
            {/* dev */}
            {userIsDEV && (
              <>
                <DropdownMenuLabel className='text-primary'>DEV</DropdownMenuLabel>
                <DropdownMenuSeparator />

                {devSidebarNav.map((item, index) => (
                  <DropdownMenuItem
                    key={index}
                    className={cn(
                      ' ',
                      pathname === item.to
                        ? "bg-accent text-accent-foreground w-[95%] rounded-[4px]    "
                        : "focus:bg-accent focus:text-accent-foreground w-[95%] rounded-[4px]",
                      "justify-start "
                    )}
                  >
                    <Link
                      to={item.to}
                      className='w-full rounded-[4px] flex justify-between items-center'>
                      {item.title}
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
              </>
            )}
            {/* service */}
            {userIsSERVICE && (
              <>
                <DropdownMenuLabel className='text-primary'>Service</DropdownMenuLabel>
                <DropdownMenuSeparator />

                {serviceNavSidebarNav.map((item, index) => (
                  <DropdownMenuItem
                    key={index}
                    className={cn(
                      ' ',
                      pathname === item.to
                        ? "bg-accent text-accent-foreground w-[95%] rounded-[4px]    "
                        : "focus:bg-accent focus:text-accent-foreground w-[95%] rounded-[4px]",
                      "justify-start "
                    )}
                  >
                    <Link
                      to={item.to}
                      className='w-full rounded-[4px] flex justify-between items-center'>
                      {item.title}
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
              </>
            )}
            {/* documents */}
            <DropdownMenuLabel className='text-primary'>Documents</DropdownMenuLabel>
            <DropdownMenuSeparator />

            {documentNavSidebarNav.map((item, index) => (
              <DropdownMenuItem
                key={index}
                className={cn(
                  ' ',
                  pathname === item.to
                    ? "bg-accent text-accent-foreground w-[95%] rounded-[4px]    "
                    : "focus:bg-accent focus:text-accent-foreground w-[95%] rounded-[4px]",
                  "justify-start "
                )}
              >
                <Link
                  to={item.to}
                  className='w-full rounded-[4px] flex justify-between items-center'>
                  {item.title}
                </Link>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            {/* User */}
            <DropdownMenuLabel className='text-primary'>User</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {userNavSidebarNav.map((item, index) => (
                <DropdownMenuItem
                  key={index}
                  className={cn(
                    ' ',
                    pathname === item.to
                      ? "bg-accent text-accent-foreground w-[95%] rounded-[4px]    "
                      : "focus:bg-accent focus:text-accent-foreground w-[95%] rounded-[4px]",
                    "justify-start "
                  )}
                >
                  <Link
                    to={item.to}
                    className='w-full rounded-[4px] flex justify-between items-center'>
                    {item.title}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Outlet />
    </>
  )
}

/**     */
/**   <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className='flex justify-between items-center'>
                  <Search size={18} color="#ffffff" />
                  <DropdownMenuShortcut className='justify-end'> ctrl + k</DropdownMenuShortcut>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Customer Search</p>
                  <p>ctrl + k will also open this feature.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <div
              onClick={() => {
                setShow(false)
              }}
              hidden={!show}
              className='bg-black/80'
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vw',
                margin: 'auto',
                //   background: 'hsla(0, 100%, 100%, 0.9)',
                zIndex: 100,
                overflow: 'hidden',
              }}
            >
              <div
                className='border border-border bg-background text-foreground overflow-y-auto'
                style={{
                  //   background: 'white',
                  width: 600,
                  maxHeight: '700px',
                  height: '700px',
                  overflow: 'auto',
                  margin: '20px auto',
                  // border: 'solid 1px #ccc',
                  borderRadius: 10,
                  // boxShadow: '0 0 10px #ccc',
                }}
                onClick={(event) => {
                  event.stopPropagation()
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Escape') {
                    setShow(false)
                  }
                }}
              >
                <search.Form method="get" action="/dealer/search">
                  <input type='hidden' name='intent' value='searchForm' />
                  <input
                    ref={ref}
                    placeholder="Search"
                    type="search"
                    name="q"
                    onKeyDown={(event) => {
                      if (
                        event.key === 'Escape' &&
                        event.currentTarget.value === ''
                      ) {
                        setShow(false)
                      } else {
                        event.stopPropagation()
                      }
                    }}
                    onChange={(event) => { search.submit(event.currentTarget.form) }}
                    className="bg-background border-border border text-foreground"
                    style={{
                      width: '100%',
                      padding: '0.5rem 1rem',
                      // fontSize: '1.5em',
                      position: 'sticky',
                      top: 0,
                      //    border: 'none',
                      borderBottom: 'solid 1px #262626',
                      outline: 'none',
                    }}
                  />
                  <ul style={{ padding: '0 20px', minHeight: '1rem' }}>
                    {search.data &&
                      search.data.map((result, index) => (
                        <Link
                          to={`/dealer/customer/${result.id}/check`}
                          className='mb-5 justify-start'
                          key={index}
                        >
                          <Button
                            variant='ghost'
                            className='w-[99%] hover:bg-background/40 rounded-[6px] my-2 h-[75px] hover:text-black'
                          >
                            <div>
                              <p className="text-2xl text-left text-foreground"> {capitalizeFirstLetter(result.firstName)} {capitalizeFirstLetter(result.lastName)}</p>
                              <p className='text-muted-foreground text-left '>{result.phone}</p>
                              <p className='text-muted-foreground text-left '>{result.email}</p>
                            </div>
                          </Button>
                        </Link>
                      ))}
                  </ul>
                </search.Form>
              </div>
            </div > */
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
export const activixNavSidebarNav = [
  {
    title: "Email Client",
    to: "/dealer/email/client",
  },
  {
    title: "Dashboard",
    to: "/dealer/leads/activix/dashboard",
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
export const financeNavSidebarNav = [
  {
    title: "Email Client",
    to: "/dealer/email/client",
  },
  {
    title: "Finance Dashboard",
    to: "/dealer/leads/finance",
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
    title: "Board",
    to: "/devmode/board",
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
