import { json, redirect, type LoaderFunction, type ActionFunction } from '@remix-run/node';
import { Outlet, useFetcher, useLoaderData, useLocation, NavLink, useSubmit, Form, useNavigate } from '@remix-run/react';
import { getSession, commitSession, authSessionStorage, destroySession } from "~/sessions/auth-session.server";
import { prisma } from '~/libs';
import { Theme, useTheme } from "remix-themes";

import Interruptions from '~/components/shared/interruptions';
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
  RemixNavNavLink, Separator, Button, buttonVariants, Tabs, TabsContent, TabsList, TabsTrigger,
} from "~/components"
import { useEffect, useRef, useState } from 'react';

import { getUserIsAllowed } from "~/helpers";

import { ButtonIcon } from "~/components";
import { Moon, Sun } from "~/images/icons";
import SearchFunction2 from './dealer/searchTable';
import useSWR from 'swr';
import SearchByOrderFunction from './dealer/searchByOrder';
import { toast } from 'sonner';
import Warning from '~/overviewUtils/images/warning.svg'

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


export default function MainDropwdown({ user, email, interruptionsData, loadNewLead, getEmails, notifications, host }) {
  const location = useLocation();
  const pathname = location.pathname
  const orderId = user?.customerSync.orderId
  const financeId = user?.customerSync.financeId
  const clientfileId = user?.customerSync.clientfileId
  let fetcher = useFetcher()
  const submit = useSubmit()

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  /**  <Sidebar user={user} email={email} /> */

  const userIsFinance = user.positions.some(
    (pos) => pos.position === 'Finance Manager' || pos.position === 'Administrator' || pos.position === 'Manager'
  );
  const userIsSales = user.positions.some(
    (pos) => pos.position === 'Sales' || pos.position === 'Administrator' || pos.position === 'Manager'
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
    (pos) => pos.position === 'Service' ||
      pos.position === 'Administrator' ||
      pos.position === 'Delivery Driver' ||
      pos.position === 'Technician' ||
      pos.position === 'Manager'
  );
  const userIsACC = user.positions.some(
    (pos) => pos.position === 'Accessories' ||
      pos.position === 'Administrator' ||
      pos.position === 'Recieving' ||
      pos.position === 'Parts' ||
      pos.position === 'Manager'
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

  const [getDomain, setGetDomain] = useState("http://localhost:3000");

  useEffect(() => {
    const currentHost = typeof window !== "undefined" ? window.location.host : null;
    if (currentHost === "dealersalesassistant.ca") {
      setGetDomain("https://www.dealersalesassistant.ca")
    }
  }, []);


  const dataFetcher = (url) => fetch(url).then(res => res.json());
  const { data, error, isLoading } = useSWR(getDomain + `/dealer/systems/notifications/notifications/${user.email}`, dataFetcher, { refreshInterval: 180000 });
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

  const msgsLength = messages.filter(item => !item.read).length || 0;
  const intLength = interruptions.filter(item => !item.read).length || 0;
  const updatesLength = updates.filter(item => !item.read).length || 0;


  const shouldShowNotification = (
    messages.some(item => !item.reads || Object.keys(item.reads).length === 0) ||
    (lead.length > 0 && lead.every(l => l.reads && Object.keys(l.reads).length === 0)) ||
    updates.some(item => !item.reads || Object.keys(item.reads).length === 0) ||
    interruptions.some(item => item.read === 'false')
  );

  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 25, left: 25 });
  const navigate = useNavigate()

  // Handle keydown events
  const handleKeyDown = (event) => {
    if (event.key === 'F4') {
      event.preventDefault();

      setDropdownOpen(true);
    }
    if (event.key === 'F5') {
      event.preventDefault();
      navigate(-1);
    }
  };


  // Handle mousemove to track cursor position
  const handleMouseMove = (event) => {
    if (isDropdownOpen) return;
    setDropdownPosition({
      top: event.clientY,
      left: event.clientX,
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
    setDropdownOpen(prev => !prev);
  };

  useEffect(() => {
    if (messages) {
      messages.forEach(item => {
        if (item.read === false) {
          if (item.subType === 'email') {
            toast(`Incoming email! `, {
              description: `${item.title}`,
              duration: 10000,
              action: {
                label: 'Client',
                onClick: () => {
                  const formData = new FormData();
                  formData.append("notificationId", item.id);
                  formData.append("userEmail", user.email);
                  formData.append("userName", user.name);
                  formData.append("navigate", `/dealer/customer/${item.clientfileId}/${item.financeId}`);
                  formData.append("intent", 'newMsg');
                  submit(formData, { method: "post" });
                }
              },

            });
          }
          if (item.subType === 'sms') {
            toast(`Incoming text message! `, {
              description: `${item.title} - ${item.content}`,
              duration: 10000,
              action: {
                label: 'Client',
                onClick: () => {
                  const formData = new FormData();
                  formData.append("notificationId", item.id);
                  formData.append("userEmail", user.email);
                  formData.append("userName", user.name);
                  formData.append("navigate", `/dealer/customer/${item.clientfileId}/${item.financeId}`);
                  formData.append("intent", 'newMsg');
                  submit(formData, { method: "post" });
                }
              }
            });
          }

        }
      });
    }
  }, [messages]);

  useEffect(() => {
    if (lead) {
      lead.forEach(item => {
        if (item.read === false) {
          toast(`Incoming new lead! `, {
            description: `${item.title} - ${item.content}`,
            duration: Infinity,
            action: {
              label: 'Leads',
              onClick: () => {
                const formData = new FormData();
                formData.append("notificationId", item.id);
                formData.append("userEmail", user.email);
                formData.append("userName", user.name);
                formData.append("navigate", `/dealer/leads/sales/newLeads`);
                formData.append("intent", 'newLead');
                submit(formData, { method: "post" });
              }
            },
          });
        }
      });
    }
  }, [lead]);

  useEffect(() => {
    if (lead) {
      lead.forEach(item => {
        if (item.read === false) {
          toast(`Incoming new lead! `, {
            description: `${item.title} - ${item.content}`,
            duration: Infinity,
            action: {
              label: 'Leads',
              onClick: () => {
                const formData = new FormData();
                formData.append("notificationId", item.id);
                formData.append("userEmail", user.email);
                formData.append("userName", user.name);
                formData.append("navigate", `/dealer/leads/sales/newLeads`);
                formData.append("intent", 'newLead');
                submit(formData, { method: "post" });
              }
            },
          });
        }
      });
    }
  }, [lead]);

  const [sales, setSales] = useState(true)
  const [service, setService] = useState(false)
  const [dev, setDev] = useState(false)
  const [admin, setAdmin] = useState(false)
  const [acc, setAcc] = useState(false)
  const [doc, setDoc] = useState(false)
  const [finance, setFinance] = useState(false)
  const [manager, setManager] = useState(false)

  const options = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  };
  let docPathname
  switch (pathname) {
    case '/dealer/user/dashboard/settings':
      docPathname = '/'
      break;
    case '/dealer/user/dashboard/scripts':
      docPathname = '/'
      break;
    case '/dealer/user/dashboard/templates':
      docPathname = ''
      break;
    case '/dealer/document/builder/client':
      docPathname = ''
      break;
    case '/dealer/user/dashboard/finance/board':
      docPathname = ''
      break;
    case '/dealer/user/dashboard/contact':
      docPathname = ''
      break;
    default:
      docPathname = ''
      break;
  }
  if (user.email === 'skylerzanth@outlook.com') {
    return (
      <>
        <DropdownMenu open={isDropdownOpen} onOpenChange={setDropdownOpen}>
          <DropdownMenuTrigger >
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
                    {messages && messages.some(item => !item.read) && (
                      <span className="relative flex h-[20px] w-[20px] items-center justify-center">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-[20px] w-[20px] bg-[#3b99fc] flex items-center justify-center">
                          <p className='text-white hover:text-primary text-xs'>{msgsLength}</p>
                        </span>
                      </span>
                    )}
                  </div>
                  Messages
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className="bg-background w-[385px] border border-border max-h-[500px] h-auto overflow-y-auto">
                    {messages ? messages.map((item, index) => {
                      return (
                        <DropdownMenuItem
                          key={index}
                          className={`focus:bg-accent focus:text-accent-foreground  justify-start mx-auto cursor-pointer h-[85px] border-b border-border bg-background hover:bg-[#111111] `}

                          onSelect={() => {
                            const formData = new FormData();
                            formData.append("notificationId", item.id);
                            formData.append("userEmail", user.email);
                            formData.append("userName", user.name);
                            formData.append("navigate", `/dealer/sales/customer/${item.clientfileId}/${item.financeId}`);
                            formData.append("intent", 'newMsg');
                            submit(formData, { method: "post" });
                          }}
                        >
                          <div className='flex items-center gap-3'>
                            {item.read === true ? null :
                              < img
                                alt='warning'
                                src={Warning}
                                className="object-contain"
                              />
                            }
                            <div className='grid grid-cols-1'>
                              <p> {item.title}</p>
                              <p className='text-muted-foreground'> {new Date(item.createdAt).toLocaleDateString("en-US", options)}</p>

                            </div>
                          </div>

                        </DropdownMenuItem>
                      );
                    }) : (
                      <DropdownMenuItem>No messages available</DropdownMenuItem>
                    )}
                    {messages.length === 0 && <DropdownMenuItem>No messages available</DropdownMenuItem>}


                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              {/* leads */}
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className='cursor-pointer'>
                  <div className='mr-2'>
                    {lead && lead.some(item => !item.read) && (
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
                          className={`focus:bg-accent focus:text-accent-foreground  justify-start mx-auto cursor-pointer h-[85px] border-b border-border bg-background hover:bg-[#111111] `}
                          onSelect={() => {
                            const formData = new FormData();
                            formData.append("notificationId", item.id);
                            formData.append("userEmail", user.email);
                            formData.append("userName", user.name);
                            formData.append("navigate", `/dealer/sales/newLeads`);
                            formData.append("intent", 'newLead');
                            submit(formData, { method: "post" });
                          }}
                        >
                          <div className='flex items-center gap-3'>
                            {item.read === true ? null :
                              < img
                                alt='warning'
                                src={Warning}
                                className="object-contain"
                              />
                            }
                            <div className='grid grid-cols-1'>
                              <p> {item.title} - {item.content}</p>
                              <p>{item.cusxtomerName}</p>
                              <p className='text-muted-foreground'> {new Date(item.createdAt).toLocaleDateString("en-US", options)}</p>

                            </div>
                          </div>

                        </DropdownMenuItem>
                      )) : <DropdownMenuItem>No new leads available</DropdownMenuItem>}
                      {lead.length === 0 && <DropdownMenuItem>No leads available</DropdownMenuItem>}

                    </Form>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              {/* updates */}
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className='cursor-pointer'>
                  <div className='mr-2'>
                    {updates && updates.some(item => !item.read) && (
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
                        className={`focus:bg-accent focus:text-accent-foreground  justify-start mx-auto cursor-pointer h-[85px] border-b border-border bg-background hover:bg-[#111111] `}
                        onSelect={() => {
                          const formData = new FormData();
                          formData.append("notificationId", item.id);
                          formData.append("userEmail", user.email);
                          formData.append("userName", user.name);
                          formData.append("navigate", `/dealer/sales/customer/${item.clientfileId}/${item.financeId}`);
                          formData.append("intent", 'newUpdate');
                          submit(formData, { method: "post" });
                        }}
                      >
                        <div className='flex items-center gap-3'>
                          {item.read === true ? null :
                            < img
                              alt='warning'
                              src={Warning}
                              className="object-contain"
                            />
                          }
                          <div className='grid grid-cols-1'>
                            <p> {item.title}</p>
                            <p className='text-muted-foreground'> {new Date(item.createdAt).toLocaleDateString("en-US", options)}</p>

                          </div>
                        </div>

                      </DropdownMenuItem>
                    )) : <DropdownMenuItem>No updates available</DropdownMenuItem>}
                    {updates.length === 0 && <DropdownMenuItem>No updates available</DropdownMenuItem>}

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
                        className={`focus:bg-accent focus:text-accent-foreground  justify-start mx-auto cursor-pointer h-[85px] border-b border-border bg-background hover:bg-[#111111] `}
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
                        <div className='flex items-center gap-3'>
                          {item.read === true ? null :
                            < img
                              alt='warning'
                              src={Warning}
                              className="object-contain"
                            />
                          }
                          <div className='grid grid-cols-1'>
                            <p> {item.title}</p>
                            <p className='text-muted-foreground'>{item.date}</p>
                            <p className='text-muted-foreground'>{item.location}</p>
                            <p className='text-muted-foreground'> {new Date(item.createdAt).toLocaleDateString("en-US", options)}</p>
                          </div>
                        </div>
                      </DropdownMenuItem>
                    ))) : <DropdownMenuItem>No interruptions available</DropdownMenuItem>}
                    {interruptions.length === 0 && <DropdownMenuItem>No interruptions available</DropdownMenuItem>}

                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />

            {/* sales */}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className='text-primary cursor-pointer'>Sales</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="bg-background  w-[300px] border border-border">
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
                                    <NavLink
                                      to={item.to}
                                      className='w-[95%] rounded-[6px] flex justify-between items-center'>
                                      {item.title}
                                    </NavLink>
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
                                    <NavLink
                                      to={item.to}
                                      className='w-[95%] rounded-[6px] flex justify-between items-center'>
                                      {item.title}
                                    </NavLink>
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
                                    <NavLink
                                      to={item.to}
                                      className='w-[95%] rounded-[6px] flex justify-between items-center'>
                                      {item.title}
                                    </NavLink>
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
                        <DropdownMenuSubContent className='bg-background   border border-border'>
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger className='cursor-pointer'>Watercraft</DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent className="bg-background   border border-border">
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
                                    <NavLink
                                      to={item.to}
                                      className='w-[95%] rounded-[6px] flex justify-between items-center'>
                                      {item.title}
                                    </NavLink>
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger className='cursor-pointer'>Motorcycle</DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent className="bg-background   border border-border">
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
                                    <NavLink
                                      to={item.to}
                                      className='w-[95%] rounded-[6px] flex justify-between items-center'>
                                      {item.title}
                                    </NavLink>
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger className='cursor-pointer'>Off-Road</DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent className="bg-background   border border-border">
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
                                    <NavLink
                                      to={item.to}
                                      className='w-[95%] rounded-[6px] flex justify-between items-center'>
                                      {item.title}
                                    </NavLink>
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger disabled className='cursor-pointer'>On-Road</DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent className="bg-background   border border-border">
                                <DropdownMenuItem>Email</DropdownMenuItem>
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
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
                      <NavLink
                        to={item.to}
                        className='w-full rounded-[4px] flex justify-between items-center'>
                        {item.title}
                      </NavLink>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuItem
                    disabled={!financeId && !clientfileId}
                    className={cn(
                      ' ',
                      pathname === `/dealer/customer/customer/sync`
                        ? "bg-accent text-accent-foreground w-[95%] rounded-[4px]    "
                        : "focus:bg-accent focus:text-accent-foreground w-[95%] rounded-[4px]",
                      "justify-start "
                    )}
                  >
                    <NavLink
                      to={`/dealer/sales/customer/${clientfileId}/${financeId}`}
                      className='w-full rounded-[4px] flex justify-between items-center'>
                      Finance File - Synced
                    </NavLink>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            {/* Accessories */}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className='text-primary cursor-pointer'>Accessories</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="bg-background  w-[300px] border border-border">
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
                      <NavLink
                        to={item.to}
                        className='w-full rounded-[4px] flex justify-between items-center'>
                        {item.title}
                      </NavLink>
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
                    <NavLink
                      to='/dealer/accessories/currentOrder'
                      className='w-full rounded-[4px] flex justify-between items-center'>
                      Customer Order - Synced
                    </NavLink>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            {/* Finance */}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className='text-primary cursor-pointer'>Finance</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="bg-background  w-[300px] border border-border">
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
                      <NavLink
                        to={item.to}
                        className='w-full rounded-[4px] flex justify-between items-center'>
                        {item.title}
                      </NavLink>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            {/* Manager */}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className='text-primary cursor-pointer'>Manager</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="bg-background  w-[300px] border border-border">
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
                      <NavLink
                        to={item.to}
                        className='w-full rounded-[4px] flex justify-between items-center'>
                        {item.title}
                      </NavLink>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            {/* Service */}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className='text-primary cursor-pointer'>Service</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="bg-background  w-[300px] border border-border">
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
                      <NavLink
                        to={item.to}
                        className='w-full rounded-[4px] flex justify-between items-center'>
                        {item.title}
                      </NavLink>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            {/* DEV */}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className='text-primary cursor-pointer'>DEV</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="bg-background  w-[300px] border border-border">
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
                      <NavLink
                        to={item.to}
                        className='w-full rounded-[4px] flex justify-between items-center'>
                        {item.title}
                      </NavLink>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            {/* Admin */}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className='text-primary cursor-pointer'>Admin</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="bg-background  w-[300px] border border-border">
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
                      <NavLink
                        to={item.to}
                        className='w-full rounded-[4px] flex justify-between items-center'>
                        {item.title}
                      </NavLink>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            {/* Documents */}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className=' text-primary cursor-pointer'>Documents</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="bg-background  w-[300px] border border-border">
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
                      <NavLink
                        to={item.to}
                        className='w-full rounded-[4px] flex justify-between items-center'>
                        {item.title}
                      </NavLink>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
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
              <NavLink to={docPathname} disabled={docPathname === ''} >
                <DropdownMenuItem disabled className='flex items-center'>
                  Documentation
                </DropdownMenuItem>
              </NavLink>
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
                  onSelect={() => {
                    setDropdownOpen(false)
                  }}
                  key={index}
                  className={cn(
                    ' ',
                    pathname === item.to
                      ? "bg-accent text-accent-foreground w-[95%] rounded-[4px]    "
                      : "focus:bg-accent focus:text-accent-foreground w-[95%] rounded-[4px]",
                    "justify-start "
                  )}
                >
                  <NavLink
                    to={item.to}
                    className='w-full rounded-[4px] flex justify-between items-center'>
                    {item.title}
                  </NavLink>
                </DropdownMenuItem>
              ))}

            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </>
    )
  } else {
    return (
      <>
        <DropdownMenu open={isDropdownOpen} onOpenChange={setDropdownOpen}>
          <DropdownMenuTrigger >
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
                    {messages && messages.some(item => !item.read) && (
                      <span className="relative flex h-[20px] w-[20px] items-center justify-center">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-[20px] w-[20px] bg-[#3b99fc] flex items-center justify-center">
                          <p className='text-white hover:text-primary text-xs'>{msgsLength}</p>
                        </span>
                      </span>
                    )}
                  </div>
                  Messages
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className="bg-background w-[385px] border border-border max-h-[500px] h-auto overflow-y-auto">
                    {messages ? messages.map((item, index) => {
                      return (
                        <DropdownMenuItem
                          key={index}
                          className={`focus:bg-accent focus:text-accent-foreground  justify-start mx-auto cursor-pointer h-[85px] border-b border-border bg-background hover:bg-[#111111] `}

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
                          <div className='flex items-center gap-3'>
                            {item.read === true ? null :
                              < img
                                alt='warning'
                                src={Warning}
                                className="object-contain"
                              />
                            }
                            <div className='grid grid-cols-1'>
                              <p> {item.title}</p>
                              <p className='text-muted-foreground'> {new Date(item.createdAt).toLocaleDateString("en-US", options)}</p>

                            </div>
                          </div>

                        </DropdownMenuItem>
                      );
                    }) : (
                      <DropdownMenuItem>No messages available</DropdownMenuItem>
                    )}

                    {messages.length === 0 && <DropdownMenuItem>No messages available</DropdownMenuItem>}

                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              {/* leads */}
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className='cursor-pointer'>
                  <div className='mr-2'>
                    {lead && lead.some(item => !item.read) && (
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
                          className={`focus:bg-accent focus:text-accent-foreground  justify-start mx-auto cursor-pointer h-[85px] border-b border-border bg-background hover:bg-[#111111] `}
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
                          <div className='flex items-center gap-3'>
                            {item.read === true ? null :
                              < img
                                alt='warning'
                                src={Warning}
                                className="object-contain"
                              />
                            }
                            <div className='grid grid-cols-1'>
                              <p> {item.title} - {item.content}</p>
                              <p>{item.cusxtomerName}</p>
                              <p className='text-muted-foreground'> {new Date(item.createdAt).toLocaleDateString("en-US", options)}</p>

                            </div>
                          </div>

                        </DropdownMenuItem>
                      )) : <DropdownMenuItem>No new leads available</DropdownMenuItem>}
                      {lead.length === 0 && <DropdownMenuItem>No leads available</DropdownMenuItem>}

                    </Form>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              {/* updates */}
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className='cursor-pointer'>
                  <div className='mr-2'>
                    {updates && updates.some(item => !item.read) && (
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
                        className={`focus:bg-accent focus:text-accent-foreground  justify-start mx-auto cursor-pointer h-[85px] border-b border-border bg-background hover:bg-[#111111] `}
                        onSelect={() => {
                          const formData = new FormData();
                          formData.append("notificationId", item.id);
                          formData.append("userEmail", user.email);
                          formData.append("userName", user.name);
                          formData.append("navigate", `/dealer/customer/${item.clientfileId}/${item.financeId}`);
                          formData.append("intent", 'newUpdate');
                          submit(formData, { method: "post" });
                        }}
                      >
                        <div className='flex items-center gap-3'>
                          {item.read === true ? null :
                            < img
                              alt='warning'
                              src={Warning}
                              className="object-contain"
                            />
                          }
                          <div className='grid grid-cols-1'>
                            <p> {item.title}</p>
                            <p className='text-muted-foreground'> {new Date(item.createdAt).toLocaleDateString("en-US", options)}</p>

                          </div>
                        </div>

                      </DropdownMenuItem>
                    )) : <DropdownMenuItem>No updates available</DropdownMenuItem>}
                    {updates.length === 0 && <DropdownMenuItem>No updates available</DropdownMenuItem>}

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
                        className={`focus:bg-accent focus:text-accent-foreground  justify-start mx-auto cursor-pointer h-[85px] border-b border-border bg-background hover:bg-[#111111] `}
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
                        <div className='flex items-center gap-3'>
                          {item.read === true ? null :
                            < img
                              alt='warning'
                              src={Warning}
                              className="object-contain"
                            />
                          }
                          <div className='grid grid-cols-1'>
                            <p> {item.title}</p>
                            <p className='text-muted-foreground'>{item.date}</p>
                            <p className='text-muted-foreground'>{item.location}</p>
                            <p className='text-muted-foreground'> {new Date(item.createdAt).toLocaleDateString("en-US", options)}</p>
                          </div>
                        </div>
                      </DropdownMenuItem>
                    ))) : <DropdownMenuItem>No interruptions available</DropdownMenuItem>}
                    {interruptions.length === 0 && <DropdownMenuItem>No interruptions available</DropdownMenuItem>}

                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />

            {/* sales */}
            {userIsSales && (
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className='text-primary cursor-pointer'>Sales</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className="bg-background  w-[300px] border border-border">
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
                                      <NavLink
                                        to={item.to}
                                        className='w-[95%] rounded-[6px] flex justify-between items-center'>
                                        {item.title}
                                      </NavLink>
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
                                      <NavLink
                                        to={item.to}
                                        className='w-[95%] rounded-[6px] flex justify-between items-center'>
                                        {item.title}
                                      </NavLink>
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
                                      <NavLink
                                        to={item.to}
                                        className='w-[95%] rounded-[6px] flex justify-between items-center'>
                                        {item.title}
                                      </NavLink>
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
                          <DropdownMenuSubContent className='bg-background   border border-border'>
                            <DropdownMenuSub>
                              <DropdownMenuSubTrigger className='cursor-pointer'>Watercraft</DropdownMenuSubTrigger>
                              <DropdownMenuPortal>
                                <DropdownMenuSubContent className="bg-background   border border-border">
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
                                      <NavLink
                                        to={item.to}
                                        className='w-[95%] rounded-[6px] flex justify-between items-center'>
                                        {item.title}
                                      </NavLink>
                                    </DropdownMenuItem>
                                  ))}
                                </DropdownMenuSubContent>
                              </DropdownMenuPortal>
                            </DropdownMenuSub>
                            <DropdownMenuSub>
                              <DropdownMenuSubTrigger className='cursor-pointer'>Motorcycle</DropdownMenuSubTrigger>
                              <DropdownMenuPortal>
                                <DropdownMenuSubContent className="bg-background   border border-border">
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
                                      <NavLink
                                        to={item.to}
                                        className='w-[95%] rounded-[6px] flex justify-between items-center'>
                                        {item.title}
                                      </NavLink>
                                    </DropdownMenuItem>
                                  ))}
                                </DropdownMenuSubContent>
                              </DropdownMenuPortal>
                            </DropdownMenuSub>
                            <DropdownMenuSub>
                              <DropdownMenuSubTrigger className='cursor-pointer'>Off-Road</DropdownMenuSubTrigger>
                              <DropdownMenuPortal>
                                <DropdownMenuSubContent className="bg-background   border border-border">
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
                                      <NavLink
                                        to={item.to}
                                        className='w-[95%] rounded-[6px] flex justify-between items-center'>
                                        {item.title}
                                      </NavLink>
                                    </DropdownMenuItem>
                                  ))}
                                </DropdownMenuSubContent>
                              </DropdownMenuPortal>
                            </DropdownMenuSub>
                            <DropdownMenuSub>
                              <DropdownMenuSubTrigger disabled className='cursor-pointer'>On-Road</DropdownMenuSubTrigger>
                              <DropdownMenuPortal>
                                <DropdownMenuSubContent className="bg-background   border border-border">
                                  <DropdownMenuItem>Email</DropdownMenuItem>
                                </DropdownMenuSubContent>
                              </DropdownMenuPortal>
                            </DropdownMenuSub>
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
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
                        <NavLink
                          to={item.to}
                          className='w-full rounded-[4px] flex justify-between items-center'>
                          {item.title}
                        </NavLink>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuItem
                      disabled={!financeId && !clientfileId}
                      className={cn(
                        ' ',
                        pathname === `/dealer/customer/customer/sync`
                          ? "bg-accent text-accent-foreground w-[95%] rounded-[4px]    "
                          : "focus:bg-accent focus:text-accent-foreground w-[95%] rounded-[4px]",
                        "justify-start "
                      )}
                    >
                      <NavLink
                        to={`/dealer/customer/${clientfileId}/${financeId}`}
                        className='w-full rounded-[4px] flex justify-between items-center'>
                        Finance File - Synced
                      </NavLink>
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            )}
            {/* accessories */}
            {userIsACC && (
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className='text-primary cursor-pointer'>Accessories</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className="bg-background  w-[300px] border border-border">
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
                        <NavLink
                          to={item.to}
                          className='w-full rounded-[4px] flex justify-between items-center'>
                          {item.title}
                        </NavLink>
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
                      <NavLink
                        to='/dealer/accessories/currentOrder'
                        className='w-full rounded-[4px] flex justify-between items-center'>
                        Customer Order - Synced
                      </NavLink>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            )}
            {/* finance */}
            {userIsFinance && (
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className='text-primary cursor-pointer'>Finance</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className="bg-background  w-[300px] border border-border">
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
                        <NavLink
                          to={item.to}
                          className='w-full rounded-[4px] flex justify-between items-center'>
                          {item.title}
                        </NavLink>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            )}
            {/* manager */}
            {userIsManager && (
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className='text-primary cursor-pointer'>Manager</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className="bg-background  w-[300px] border border-border">
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
                        <NavLink
                          to={item.to}
                          className='w-full rounded-[4px] flex justify-between items-center'>
                          {item.title}
                        </NavLink>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            )}
            {/* admin */}
            {userIsADMIN && (
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className='text-primary cursor-pointer'>Admin</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className="bg-background  w-[300px] border border-border">
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
                        <NavLink
                          to={item.to}
                          className='w-full rounded-[4px] flex justify-between items-center'>
                          {item.title}
                        </NavLink>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            )}
            {/* dev */}
            {userIsDEV && (
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className='text-primary cursor-pointer'>DEV</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className="bg-background  w-[300px] border border-border">
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
                        <NavLink
                          to={item.to}
                          className='w-full rounded-[4px] flex justify-between items-center'>
                          {item.title}
                        </NavLink>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            )}
            {/* service */}
            {userIsSERVICE && (
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className='text-primary cursor-pointer'>Service</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className="bg-background  w-[300px] border border-border">
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
                        <NavLink
                          to={item.to}
                          className='w-full rounded-[4px] flex justify-between items-center'>
                          {item.title}
                        </NavLink>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            )}
            {/* documents */}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className=' text-primary cursor-pointer'>Documents</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="bg-background  w-[300px] border border-border">
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
                      <NavLink
                        to={item.to}
                        className='w-full rounded-[4px] flex justify-between items-center'>
                        {item.title}
                      </NavLink>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
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
              <DropdownMenuItem disabled className='flex items-center'>
                Documentation
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
                      Open Global customer search
                      <DropdownMenuShortcut>F3</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem className='w-[98%] mx-auto rounded-lg hover:bg-accent'>
                      Open dropdown menu at mouse
                      <DropdownMenuShortcut>F4</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem className='w-[98%] mx-auto rounded-lg hover:bg-accent'>
                      Navigate to last page
                      <DropdownMenuShortcut>F5</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem className='w-[98%] mx-auto rounded-lg hover:bg-accent'>
                      Activate interruption reminder
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
                  <NavLink
                    to={item.to}
                    className='w-full rounded-[4px] flex justify-between items-center'>
                    {item.title}
                  </NavLink>
                </DropdownMenuItem>
              ))}

            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </>
    )
  }
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
    title: "Inventory Counter",
    to: "/dealer/accessories/inventoryCounter",
  },
  {
    title: "Receiving",
    to: "/dealer/accessories/receiving",
  },
]
export const serviceNavSidebarNav = [
  {
    title: "Dashboard",
    to: "/dealer/service/dashboard",
  },
  {
    title: "Calendar",
    to: "/dealer/service/calendar",
  },

  {
    title: "Waiters",
    to: "/dealer/service/waiters",
  },
  {
    title: "Technician",
    to: "/dealer/service/technician",
  },
  {
    title: "Work Order",
    to: "/dealer/service/workOrder",
  },
]
export const userNavSidebarNav = [
  {
    title: "Staff Lounge",
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
    to: "/dealer/document/builder/client",
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
    title: "Dashboard",
    to: "/dealer/sales/dashboard",
  },
  {
    title: "Email Client",
    to: "/dealer/features/email/emailClient",
  },
  {
    title: "Calendar",
    to: "/dealer/sales/calendar",
  },
  {
    title: "Payment Calculator",
    to: "/dealer/sales/calculator",
  },
  {
    title: "Unit Inventory",
    to: "/dealer/sales/inventory",
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
    title: "Dashboard",
    to: "/dealer/sales/finance",
  },
  {
    title: "Email Client",
    to: "/dealer/features/email/emailClient",
  },

  {
    title: "Calendar",
    to: "/dealer/sales/calendar",
  },
  {
    title: "Payment Calculator",
    to: "/dealer/sales/calculator",
  },
  {
    title: "Unit Inventory",
    to: "/dealer/sales/inventory",

  },
]
export const adminSidebarNav = [
  {
    title: "Settings",
    to: "/dealer/admin/settings/general",
  },
  {
    title: "Users",
    to: "/dealer/admin/users/overview",
  },
  {
    title: "Customers",
    to: "/dealer/admin/customers/client",
  },
  {
    title: "Depts",
    to: "/dealer/admin/depts/sales",
  },
  {
    title: "Reports",
    to: "/dealer/admin/reports/endOfDay",
  },
  {
    title: "Unit Inventory",
    to: "/dealer/sales/inventory",
  },
  {
    title: "Import / Export",
    to: "/dealer/admin/importexport/units",
  },
]
export const devSidebarNav = [
  {
    title: "Dashboard",
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
    title: "Depts",
    to: "/dealer/manager/depts/sales",
  },
  {
    title: "Reports",
    to: "/dealer/manager/reports/endOfDay",
  },
  {
    title: "Unit Inventory",
    to: "/dealer/sales/inventory",
  },
  {
    title: "Scheduling",
    to: "/dealer/manager/scheduling/hours",
  },
  {
    title: "CSI",
    to: "/dealer/manager/csi",
  },
  {
    title: "Import / Export",
    to: "/dealer/manager/importexport/units",
  },

]
let quoteUrl = '/dealer/sales/quote/'
export const my24Watercraft = [
  {
    title: "Kawasaki",
    to: quoteUrl + "Kawasaki",
  },
]
export const my23Watercraft = [
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
export const my24Moto = [
  {
    title: "Harley-Davidson",
    to: quoteUrl + "Harley-DavidsonMY24",
  },
]
export const my23Moto = [
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
export const my24OffRoad = [
  {
    title: "Can-AM SxS",
    to: quoteUrl + "Can-Am-SXS-MY24",
  },
  {
    title: "Can-AM Ski-Doo",
    to: quoteUrl + "Ski-Doo-MY24",
  },
]
export const my23OffRoad = [
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
