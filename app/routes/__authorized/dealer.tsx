import { json, redirect, type LoaderFunction, type ActionFunction } from '@remix-run/node';
import { Outlet, useFetcher, useLoaderData, useLocation, Link, useSubmit, Form } from '@remix-run/react';
import { getSession, commitSession, authSessionStorage, destroySession } from "~/sessions/auth-session.server";
import { GetUser } from "~/utils/loader.server";
import NotificationSystem from "~/routes/__authorized/dealer/notifications";
import { prisma } from '~/libs';
//import Sidebar, { managerSidebarNav, adminSidebarNav, devSidebarNav, } from '~/components/shared/sidebar'
import { Theme, useTheme } from "remix-themes";

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

import { ButtonIcon } from "~/components";
import { Moon, Sun } from "~/icons";
import SearchFunction2 from './dealer/searchTable';
import useSWR from 'swr';
import SearchByOrderFunction from './dealer/searchByOrder';


export async function loader({ request, params }: LoaderFunction) {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")
  let user = await GetUser(email)
  const interruptionsData = await prisma.interruptions.findMany({ where: { userEmail: email } });
  const notifications = await prisma.notificationsUser.findMany({
    where: { userEmail: email, },
    include: { reads: true, },
    orderBy: { createdAt: 'desc', },
  });
  const host = request.headers.get('host');
  return json({ user, email, interruptionsData, notifications, host });
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
  if (formData.intent === 'newLead') {
    await prisma.notificationRead.create({
      data: {
        userEmail: formData.userEmail,
        notificationId: formData.notificationId,
        read: true
      }
    })
    return redirect(formData.navigate)
  }
  if (formData.intent === 'newInterruption') {
    await prisma.interruptions.update({
      where: { id: formData.notificationId },
      data: {
        read: 'true'
      }
    })
    return redirect(formData.navigate)
  }
  if (formData.intent === 'newMsg') {
    await prisma.notificationRead.create({
      data: {
        userEmail: formData.userEmail,
        notificationId: formData.notificationId,
        read: true
      }
    })
    return redirect(formData.navigate)
  }



  return null
};

export default function SettingsLayout() {
  const { user, email, interruptionsData, loadNewLead, getEmails, notifications, host } = useLoaderData()
  const location = useLocation();
  const pathname = location.pathname
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
  return (
    <>
      {pathname !== '/dealer/email/dashboardClient' && (
        <>
          {!pathname.startsWith('/dealer/accessories/') && <SearchByOrderFunction />}
          <SearchFunction />
          <MainDropwdown user={user} email={email} interruptionsData={interruptionsData} loadNewLead={loadNewLead} getEmails={getEmails} notifications={notifications} host={host} />
        </>
      )}
      <Outlet />
    </>

  )
}
export function MainDropwdown({ user, email, interruptionsData, loadNewLead, getEmails, notifications, host }) {
  const location = useLocation();
  const pathname = location.pathname
  const orderId = user?.customerSync.orderId

  let fetcher = useFetcher()
  const submit = useSubmit()

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
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
  const userIsACC = user.positions.some(
    (pos) => pos.position === 'Accessories' || pos.position === 'Administrator'
  );

  const userIsACCESSORIES = getUserIsAllowed(user, ["ACCESSORIES"]);
  const userIsPARTS = getUserIsAllowed(user, ["PARTS"]);
  const userIsTECHNICIAN = getUserIsAllowed(user, ["TECHNICIAN"]);
  const userIsRECIEVING = getUserIsAllowed(user, ["RECIEVING"]);
  const userIsNORMAL = getUserIsAllowed(user, ["NORMAL"]);
  const userIsEDITOR = getUserIsAllowed(user, ["EDITOR"]);


  // ------------- theme -------------- //
  const [theme, setTheme] = useTheme();
  const nameTo = theme === Theme.DARK ? Theme.LIGHT : Theme.DARK;
  const handleChangeTheme = () => {
    setTheme(nameTo);
  };
  // ----------- notifications ------ //
  // notifications
  const [updates, setUpdates] = useState([])
  const [lead, setLead] = useState([]);
  const [messages, setMessages] = useState([])
  const [interruptions, setInterruptions] = useState([])


  useEffect(() => {
    if (notifications && Array.isArray(notifications)) {
      const newLeads = notifications.filter(notification => notification.userEmail === user.email && notification.type === 'New Lead');
      setLead(newLeads);
    }
  }, [notifications, user.email]);

  const leadLength = lead.length;

  const [swrURL, setSwrURL] = useState(`http://localhost:3000/dealer/notifications/notifications/${user.email}`)
  if (host !== 'localhost:3000') {
    setSwrURL(`https://www.dealersalesassistant.ca/dealer/notifications/notifications/${user.email}`)
  }

  const dataFetcher = (url) => fetch(url).then(res => res.json());
  const { data, error, isLoading } = useSWR(swrURL, dataFetcher, { refreshInterval: 180000 });
  //if (error) return <div>Loading...</div>;
  ///  if (isLoading) return <div>Error loading data</div>;
  const notificationsList = data//.notifications

  let newMessages;
  let newLeads;
  let newUpdates;

  useEffect(() => {
    if (interruptionsData) {
      setInterruptions(interruptionsData)
    }
  }, [])

  useEffect(() => {
    newUpdates = notifications && notifications.filter(notification => notification.userEmail === user.email && notification.type === 'updates');
    if (newUpdates) {
      setUpdates(newUpdates)
    }
  }, [notifications])

  useEffect(() => {
    if (notificationsList) {
      console.log(notificationsList, 'data')
      newUpdates = notificationsList.filter(notification => notification.userEmail === user.email && notification.type === 'updates');
      setUpdates(newUpdates)
      newLeads = notificationsList.filter(notification => notification.userEmail === user.email && notification.type === 'New Lead');
      setLead(newLeads)
      newMessages = notificationsList.filter(notification => notification.userEmail === user.email && notification.type === 'messages');
      setMessages(newMessages)
    }

  }, [notificationsList])

  const msgsength = Object.keys(messages).length || 0;
  const intLength = Object.keys(interruptions).length || 0;
  const updatesLength = Object.keys(updates).length || 0;

  const shouldShowNotification = (
    messages.some(item => !item.reads || Object.keys(item.reads).length === 0) ||
    (lead.length > 0 && lead.every(l => l.reads && Object.keys(l.reads).length === 0)) ||
    updates.some(item => !item.reads || Object.keys(item.reads).length === 0) ||
    interruptions.some(item => item.read === 'false')
  );


  /**  const [menuOpen, setMenuOpen] = useState(false)
    useEffect(() => {
      let listener = (event) => {
       // if ((event.metaKey || event.ctrlKey) && event.key === 'm') {
        if (event.key === 'F4') {
       setMenuOpen(true)
        }
      }
      window.addEventListener('keydown', listener)
      return () => window.removeEventListener('keydown', listener)
    }, []) */


  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 25, left: 25 });


  // Handle keydown events
  const handleKeyDown = (event) => {
    if (event.key === 'F4') {
      event.preventDefault(); // Prevent default action

      // Open the dropdown at the stored cursor position
      setDropdownOpen(true);
    }
  };

  // Handle mousemove to track cursor position
  const handleMouseMove = (event) => {
    if (isDropdownOpen) return; // Stop tracking if dropdown is open
    setDropdownPosition({
      top: event.clientY,  // Cursor vertical position
      left: event.clientX, // Cursor horizontal position
    });
  };

  // Add and remove event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isDropdownOpen]);

  // Handle button click
  const handleButtonClick = () => {
    setDropdownOpen(prev => !prev); // Toggle dropdown visibility
  };

  return (
    <>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger >
          {shouldShowNotification && (
            <span className="animate-ping fixed left-[15px] top-[18px] inline-flex h-[20px] w-[20px] rounded-full bg-sky-400 opacity-75"></span>
          )}
          <Button
            onClick={handleButtonClick}
            variant='ghost' size='icon' className=' left-[12px] top-[15px] z-50 fixed  inline-flex cursor-pointer text-foreground items-center justify-center'>
            <Menu size={32} strokeWidth={1.5} />
          </Button>

        </DropdownMenuTrigger>


        <DropdownMenuContent
          className="w-56 bg-background border border-border max-h-[500px] overflow-y-auto"
          style={{
            position: 'absolute',
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
          }}
        >
          {/* Interruptions */}
          <Interruptions user={user} email={email} />
          <DropdownMenuSeparator />
          <DropdownMenuLabel className='text-primary'>Notifications</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {/* messages */}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className='cursor-pointer'>
                <div className='mr-2'>
                  {messages && messages.some(item => !item.reads || Object.keys(item.reads).length === 0) && (
                    <span className="relative flex h-[20px] w-[20px] items-center justify-center">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-[20px] w-[20px] bg-[#3b99fc] flex items-center justify-center">
                        <p className='text-white hover:text-primary text-xs'>{msgsength}</p>
                      </span>
                    </span>
                  )}
                </div>
                Messages
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="bg-background w-[300px] border border-border">
                  {messages ? messages.map((item, index) => (
                    <DropdownMenuItem
                      key={index}
                      className={`focus:bg-accent focus:text-accent-foreground w-[95%] rounded-[4px] justify-start mt-1 mx-auto cursor-pointer ${item.reads.read === true ? 'bg-background ' : 'bg-[#181818]'}`}
                      onSelect={() => {
                        const formData = new FormData();
                        formData.append("notificationId", item.id);
                        formData.append("userEmail", user.email);
                        formData.append("userName", user.name);
                        formData.append("navigate", `/dealer/customer/${item.clientfileId}/${item.financeId}`);
                        formData.append("intent", 'newMsg');
                        submit(formData, { method: "post" });
                      }}
                    >
                      {item.title}
                    </DropdownMenuItem>
                  )) : <DropdownMenuItem>No messages available</DropdownMenuItem>}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            {/* leads */}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className='cursor-pointer'>
                <div className='mr-2'>
                  {lead.length > 0 && lead.every(l => l.reads && Object.keys(l.reads).length === 0) && (
                    <span className="relative flex h-[20px] w-[20px] items-center justify-center">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-[20px] w-[20px] bg-[#3b99fc] flex items-center justify-center">
                        <p className='text-white hover:text-primary text-xs'>{leadLength}</p>
                      </span>
                    </span>
                  )}
                </div>
                Leads
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="bg-background border border-border w-[300px]">
                  <Form method='post'>
                    {lead ? lead.map((item, index) => (
                      <DropdownMenuItem
                        key={index}
                        className={`focus:bg-accent focus:text-accent-foreground w-[95%] rounded-[4px] justify-start mt-1 mx-auto cursor-pointer ${item.reads.read === true ? 'bg-background ' : 'bg-[#181818]'}`}
                        onSelect={() => {
                          const formData = new FormData();
                          formData.append("notificationId", item.id);
                          formData.append("userEmail", user.email);
                          formData.append("userName", user.name);
                          formData.append("navigate", `/dealer/leads/sales/newLeads`);
                          formData.append("intent", 'newLead');
                          submit(formData, { method: "post" });
                        }}
                      >
                        <div>
                          <p> {item.title} - {item.content}</p>
                          <p className='text-muted-foreground'>billy bobby</p>
                        </div>

                      </DropdownMenuItem>
                    )) : <DropdownMenuItem>No new leads available</DropdownMenuItem>}
                  </Form>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            {/* updates */}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className='cursor-pointer'>
                <div className='mr-2'>
                  {updates && updates.some(item => !item.reads || Object.keys(item.reads).length === 0) && (
                    <span className="relative flex h-[20px] w-[20px] items-center justify-center">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-[20px] w-[20px] bg-[#3b99fc] flex items-center justify-center">
                        <p className='text-white hover:text-primary text-xs'>{updatesLength}</p>
                      </span>
                    </span>
                  )}
                </div>
                Updates
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="bg-background w-[300px] border border-border">
                  {updates ? updates.map((item, index) => (
                    <DropdownMenuItem
                      key={index}
                      className={`focus:bg-accent focus:text-accent-foreground w-[95%] rounded-[4px] justify-start mt-1 mx-auto cursor-pointer ${item.reads.read === true ? 'bg-background ' : 'bg-[#181818]'}`}
                    >
                      <p className='w-[95%] rounded-[6px] flex justify-between items-center'>
                        {item.title}
                      </p>
                    </DropdownMenuItem>
                  )) : <DropdownMenuItem>No updates available</DropdownMenuItem>}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            {/* Inter */}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className='cursor-pointer'>
                <div className='mr-2'>
                  {interruptions && interruptions.some(item => item.read === 'false') && (
                    <span className="relative flex h-[20px] w-[20px] items-center justify-center">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-[20px] w-[20px] bg-[#3b99fc] flex items-center justify-center">
                        <p className='text-white hover:text-primary text-xs'>{intLength}</p>
                      </span>
                    </span>
                  )}


                </div>
                Interruptions
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="bg-background w-[300px] border border-border">
                  {interruptions ? (interruptions.map((item, index) => (
                    <DropdownMenuItem
                      key={index}
                      className={`focus:bg-accent focus:text-accent-foreground w-[95%] rounded-[4px] justify-start mt-1 mx-auto cursor-pointer ${item.read === 'true' ? 'bg-background ' : 'bg-[#181818]'}`}
                      onSelect={() => {
                        const formData = new FormData();
                        formData.append("notificationId", item.id);
                        formData.append("userEmail", user.email);
                        formData.append("userName", user.name);
                        formData.append("navigate", item.location);
                        formData.append("intent", 'newInterruption');
                        submit(formData, { method: "post" });
                      }}
                    >
                      <div>
                        <p> {item.title} </p>
                        <p className='text-muted-foreground'>{item.date}</p>
                        <p className='text-muted-foreground'>{item.location}</p>
                      </div>

                    </DropdownMenuItem>
                  ))) : <DropdownMenuItem>No interruptions available</DropdownMenuItem>}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          {/* Quotes */}
          <DropdownMenuLabel className='text-primary'>Quotes</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {/* my24 */}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className='cursor-pointer'>MY24</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="bg-background    border border-border">
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger className='cursor-pointer'>Watercraft</DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent className="bg-background  w-[300px] border border-border">
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
                      <DropdownMenuSubContent className="bg-background  w-[300px] border border-border">
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
                      <DropdownMenuSubContent className="bg-background  w-[300px] border border-border">
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
                      <DropdownMenuSubContent className="bg-background  w-[300px] border border-border">
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
          {/* accessories */}
          {userIsACC && (
            <>
              <DropdownMenuLabel className='text-primary'> PAC</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {accNavSidebarNav.map((item, index) => (
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
              <DropdownMenuItem
                disabled={!orderId}
                className={cn(
                  ' ',
                  pathname === `/dealer/accessories/currentOrder`
                    ? "bg-accent text-accent-foreground w-[95%] rounded-[4px]    "
                    : "focus:bg-accent focus:text-accent-foreground w-[95%] rounded-[4px]",
                  "justify-start "
                )}
              >
                <Link
                  to='/dealer/accessories/currentOrder'
                  className='w-full rounded-[4px] flex justify-between items-center'>
                  Customer Order - Synced
                </Link>
              </DropdownMenuItem>
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
            <DropdownMenuItem onSelect={handleChangeTheme} className='flex items-center'>
              Toggle Theme
              <DropdownMenuShortcut>
                {theme === Theme.DARK ? <Sun size={16} /> : <Moon size={16} />}
              </DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className='cursor-pointer'>Shortcut Reference</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className='bg-background border-border border w-[200px]'>
                  <DropdownMenuItem className='w-[98%] mx-auto rounded-lg hover:bg-accent'>
                    Start scanner (if present)
                    <DropdownMenuShortcut>F1</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem className='w-[98%] mx-auto rounded-lg hover:bg-accent'>
                    Reset scanner (if present)
                    <DropdownMenuShortcut>F2</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem className='w-[98%] mx-auto rounded-lg hover:bg-accent'>
                    Global customer search
                    <DropdownMenuShortcut>F3</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem className='w-[98%] mx-auto rounded-lg hover:bg-accent'>
                    Open dropdown menu
                    <DropdownMenuShortcut>F4</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem className='w-[98%] mx-auto rounded-lg hover:bg-accent'>
                    Interruption reminder
                    <DropdownMenuShortcut>ctrl + i</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
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
    </>
  )
}
export const accNavSidebarNav = [
  {
    title: "Dashboard",
    to: "/dealer/accessories/order",
  },
  {
    title: "Search Customers",
    to: "/dealer/accessories/search",
  },
  {
    title: "Products",
    to: "/dealer/accessories/products",
  },
  {
    title: "Label Maker",
    to: "/dealer/accessories/labelPrinter",
  },
  {
    title: "Receiving",
    to: "/dealer/accessories/receiving",
  },
]

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
