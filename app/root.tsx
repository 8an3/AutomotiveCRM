import { json, redirect, createCookie } from "@remix-run/node";
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData, useNavigation, isRouteErrorResponse, useRouteError, useParams, Form, useLocation, useFetcher, useSubmit, } from "@remix-run/react";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import { IconoirProvider, } from "iconoir-react";
import React, { useEffect, useState } from "react";
import { Debug, Layout, PageHeader, TailwindIndicator, TooltipProvider, } from "~/components"; // Toaster goes here
import { configDev, configSite } from "~/configs";
import { model } from "~/models";
//import { authenticator } from "~/services";
import { cn, createCacheHeaders, createMetaData, getEnv } from "~/utils";
import type { HeadersFunction, LinksFunction, LoaderArgs, V2_MetaDescriptor, V2_MetaFunction, } from "@remix-run/node";
import { type RootLoaderData } from "~/hooks";
import { Theme } from '@radix-ui/themes';
import FinanceIdContext from '~/other/financeIdContext';
import tailwind from '~/styles/tailwind.css';
import font from '~/styles/font.css'

import slider from '~/styles/slider.css'
import { Toaster, toast } from 'sonner'
import { getUserByEmail } from '~/utils/user/get'
import { getSession, commitSession } from "./sessions/auth-session.server";
import { prisma } from "./libs";
import { Loader2 } from "~/icons";
import { GlobalLoading } from "./components/ui/globalLoading";
import NProgress from "nprogress";
import nProgressStyles from "~/styles/loader.css";
import rbc from '~/styles/rbc.css'
import { Provider } from 'react-redux';
import store from './store'; // Import the Redux store

import { GetUser } from "~/utils/loader.server";
import { Unauthorized } from "./routes/_authorized.email.server";

import { type Configuration, PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from '@azure/msal-react'

const MICRO_APP_ID = '0fa1346a-ab27-4b54-bffd-e76e9882fcfe' || '' //process.env.MICRO_APP_ID || ''

const configuration: Configuration = {
  auth: {
    clientId: MICRO_APP_ID,
    authority: `https://login.microsoftonline.com/fa812bd2-3d1f-455b-9ce5-4bfd0a4dfba6`,
    redirectUri: 'http://localhost:3000/microsoft/callback',
  }
};

export const links: LinksFunction = () => [
  // { rel: "stylesheet", href: styles },
  { rel: "stylesheet", href: tailwind },
  { rel: "stylesheet", href: font },
  { rel: "stylesheet", href: rbc },
  { rel: "stylesheet", href: slider },
  { rel: "icon", type: "image/svg", sizes: "32x32", href: "/money24.svg", },
  { rel: "icon", type: "image/svg", sizes: "16x16", href: "/money16.svg", },
  { rel: "apple-touch-icon", sizes: "180x180", href: "/money180.svg", },
  { rel: "stylesheet", href: nProgressStyles },
];

export const meta: V2_MetaFunction = () => {
  return createMetaData() satisfies V2_MetaDescriptor[];
};

export const headers: HeadersFunction = () => {
  return {
    "Accept-CH": "Sec-CH-Prefers-Color-Scheme",
  };
};

export async function loader({ request }: LoaderArgs) {
  const ENV = getEnv();
  // const userSession = await authenticator.isAuthenticated(request);
  const userSession = await getSession(request.headers.get("Cookie"));
  const email = userSession.get("email")
  if (!email) { return json({ ENV, }); }

  let user = await GetUser(email)
  if (!user) { return redirect(`/logout`); }

  const loaderData = {
    ENV,
    userSession,
    user,
  } satisfies RootLoaderData;
  // console.log(user, userSession, 'user and userSession root loader')
  /* google auth
  const API_KEY = process.env.GOOGLE_API_KEY
  let tokens = userSession.get("accessToken")
  // new
  const refreshToken = userSession.get("refreshToken")
  let cookie = createCookie("session_66", {
    secrets: ['secret'],
    // 30 days
    maxAge: 30 * 24 * 60 * 60,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  const userRes = await fetch(`https://gmail.googleapis.com/gmail/v1/users/${user.email}/profile`, {
    headers: { Authorization: 'Bearer ' + tokens, Accept: 'application/json' }
  });
  console.log(userRes, 'userRes')
  // new
  if (userRes.status === 401) {
    const unauthorizedAccess = await Unauthorized(refreshToken)
    tokens = unauthorizedAccess

    userSession.set("accessToken", tokens);
    await commitSession(userSession);

    const cookies = cookie.serialize({
      email: email,
      refreshToken: refreshToken,
      accessToken: tokens,
    })
    await cookies
    console.log(tokens, 'authorized tokens')

  } else { console.log('Authorized'); }
  */
  return json({ loaderData, user, }, {
    headers: {
      "Set-Cookie": await commitSession(userSession),
    },
  });
}

const pca = new PublicClientApplication(configuration);


export default function App() {
  const location = useLocation()
  const navigation = useNavigation();
  const [financeId, setFinanceId] = useState(null);

  useEffect(() => {
    if (navigation.state === "loading") NProgress.done();
    if (navigation.state === "idle") NProgress.done();
    else NProgress.start();
  }, [navigation.state]);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body id="__remix" >
        <MsalProvider instance={pca}>

          <Provider store={store}>
            <FinanceIdContext.Provider value={financeId}>
              <TooltipProvider>
                <IconoirProvider iconProps={{ strokeWidth: 2, width: "1.5em", height: "1.5em" }}  >
                  <>
                    <Outlet />
                    <Toaster richColors />
                    {configDev.isDevelopment && configDev.features.debugScreens && (
                      <TailwindIndicator />
                    )}
                  </>
                </IconoirProvider>
              </TooltipProvider>
              <VercelAnalytics />
              <ScrollRestoration />
              <Scripts />
              <LiveReload />
              <GlobalLoading />

            </FinanceIdContext.Provider>
          </Provider>
        </MsalProvider>

      </body >
    </html >
  );
}

export function RootDocumentBoundary({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  // Cannot use useLoaderData in catch/error boundary
  return (
    <html lang="en" data-theme={Theme.DARK}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        {title && <title>{title}</title>}
        <Links />
      </head>
      <body >
        {children}
        <VercelAnalytics />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    let message;
    switch (error.status) {
      case 401:
        message = `Sorry, you can't access this page.`;
        break;
      case 404:
        message = `Sorry, this page is not available.`;
        break;
      default:
        throw new Error(error.data || error.statusText);
    }
    return (
      <RootDocumentBoundary title={message}>
        <Layout
          isSpaced
          layoutHeader={
            <PageHeader size="sm">
              <h1>Error {error.status}</h1>
              {error.statusText && <h2>{error.statusText}</h2>}
              <p>{message}</p>
            </PageHeader>
          }
        >
          <div>
            <p>Here's the error information that can be informed to Rewinds.</p>
            <Debug name="error.data" isAlwaysShow isCollapsibleOpen>
              {error.data}
            </Debug>
          </div>
        </Layout>
      </RootDocumentBoundary>
    );
  } else if (error instanceof Error) {
    return (
      <RootDocumentBoundary title="Sorry, unexpected error occured.">
        <Layout
          isSpaced
          layoutHeader={
            <PageHeader size="sm">
              <h1>Error from {configSite.name}</h1>
            </PageHeader>
          }
        >
          <div>
            <p>Here's the error information that can be informed to Rewinds.</p>

            <p>{error.message}</p>
            <Debug name="error" isAlwaysShow isCollapsibleOpen>
              {error}
            </Debug>

            <p>The stack trace is:</p>
            <Debug name="error.stack" isAlwaysShow isCollapsibleOpen>
              {error.stack}
            </Debug>
          </div>
        </Layout>
      </RootDocumentBoundary>
    );
  } else {
    return (
      <Layout>
        <h1>Unknown Error</h1>
      </Layout>
    );
  }
}


/***
 *              <Dialog.Description className="text-mauve11 mt-[10px] mb-5 text-[15px] leading-normal">
// https://remix.run/docs/en/main/file-conventions/route-files-v2#md-root-route
import { json, redirect } from "@remix-run/node";
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData, useNavigation, isRouteErrorResponse, useRouteError, useParams, Form, useLocation, useFetcher, useSubmit, Link, useNavigate } from "@remix-run/react";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import { DashboardSpeed, IconoirProvider, LogOut, Settings, User } from "iconoir-react";
import React, { useEffect, useState } from "react";
import { Debug, DropdownMenu, DropdownMenuSeparator, DropdownMenuTrigger, Layout, PageHeader, TailwindIndicator, TooltipProvider, } from "~/components"; // Toaster goes here
import financeFormSchema from '~/routes/overviewUtils/financeFormSchema';
import { configDev, configDocumentLinks, configSite } from "~/configs";
import { model } from "~/models";
//import { authenticator } from "~/services";
import { cn, createCacheHeaders, createMetaData, formatRelativeTime, getEnv } from "~/utils";
import type { ActionArgs, ActionFunction, HeadersFunction, LinksFunction, LoaderArgs, V2_MetaDescriptor, V2_MetaFunction, } from "@remix-run/node";
import { useRootLoaderData, type RootLoaderData } from "~/hooks";
import GlobalSearch from "./routes/_authorized.globalSearch";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/components/ui/tabs"
import { Flex, Text, Button, TextArea, TextField, Heading, Select, Theme, ThemePanel, Inset } from '@radix-ui/themes';
import FinanceIdContext from '~/other/financeIdContext';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover"
import tailwind from '~/styles/tailwind.css';
import font from '~/styles/font.css'
import rbc from '~/styles/rbc.css'
import slider from '~/styles/slider.css'
import { Toaster, toast } from 'sonner'
import { prisma } from "./libs";
import Sidebar from "./components/shared/sidebar";
import { Bell, BellRing, BookOpenCheck, MessageSquare, Milestone, X, } from 'lucide-react';


export const links: LinksFunction = () => [
  // { rel: "stylesheet", href: styles },
  { rel: "stylesheet", href: tailwind },
  { rel: "stylesheet", href: font },
  { rel: "stylesheet", href: rbc },
  { rel: "stylesheet", href: slider },

  {
    rel: "icon",
    type: "image/svg",
    sizes: "32x32",
    href: "/money24.svg",
  },
  {
    rel: "icon",
    type: "image/svg",
    sizes: "16x16",
    href: "/money16.svg",
  },
  {
    rel: "apple-touch-icon",
    sizes: "180x180",
    href: "/money180.svg",
  },
];

export const meta: V2_MetaFunction = () => {
  return createMetaData() satisfies V2_MetaDescriptor[];
};

export const headers: HeadersFunction = () => {
  return {
    "Accept-CH": "Sec-CH-Prefers-Color-Scheme",
  };
};



export async function loader({ request, params }: LoaderFunctionArgs) {
  const ENV = getEnv();
  const userSession = await authenticator.isAuthenticated(request);
  const user = await model.user.query.getForSession({ id: userSession?.id });
  const readNot = await prisma.notificationsUser.findMany({
    where: {
      userId: user?.id,
      read: false,
      type: 'Note'
      //dimiss: true,
    },
    take: 20,
    orderBy: {
      createdAt: 'desc'
    }
  });
  const newLeads = await prisma.notificationsUser.findMany({
    where: {
      userId: user?.id,
      read: false,
      type: 'New Lead'
      //dimiss: true,
    },
    take: 20,
    orderBy: {
      createdAt: 'desc'
    }
  });
  console.log(readNot)
  // Don't do anything extra when not logged in
  if (!userSession) {
    return json({
      ENV,
    });
  }

  // Put user and its profile data

  // But if the user session is no longer valid, log it out
  if (!user) {
    return redirect(`/logout`);
  }

  // Finally, put the active user data to the root loader data
  const loaderData = {
    ENV,
    userSession,
    user,
  } satisfies RootLoaderData;
  return json({ loaderData, readNot, newLeads }, { headers: createCacheHeaders(request, 15) });
}


export async function action({ request, params }: ActionArgs) {
  const formPayload = Object.fromEntries(await request.formData());
      let account = await requireAuthCookie(request);
    const user = await model.user.query.getForSession({ email: account.email });
  const formData = financeFormSchema.parse(formPayload)
  const intent = formData.intent

  console.log(formData.pathname, 'inaction')
  if (intent === 'read') {
    await prisma.notificationsUser.update({
      where: {
        id: formData.id,
      },
      data: {
        userId: formData.userId,
        read: true
      }
    })
    return redirect(`${formData.pathname}`);

  }
  if (intent === 'dimiss') {
    await prisma.notificationsUser.update({
      where: {
        id: formData.id,
      },
      data: {
        userId: formData.userId,

      }
    })
    return redirect(`${formData.pathname}`);

  }


}

export default function App() {
  const { user, finance, readNot, newLeads, newMsgs } = useLoaderData()
  const location = useLocation()
  const pathname = location.pathname
  const submit = useSubmit();
  const [financeId, setFinanceId] = useState(null);
  const navigate = useNavigate();

  const askPermission = async () => {
    const permission = await window.Notification.requestPermission();

    if (permission !== 'granted') {
      throw new Error('Permission not granted for Notification');
    }
  };

  const showNotification = () => {
    readNot.forEach(notification => {
      new Notification('New message', {
        body: `${notification.title} left a note: ${notification.content}`,
        // Include any other notification options you want
      });
    });
  };

  const handleVisibilityChange = () => {
    if (!document.hidden) {
      showNotification();
    }
  };

  useEffect(() => {
    askPermission().then(() => {
      document.addEventListener('visibilitychange', handleVisibilityChange);
    });

    // Clean up the effect
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);


  useEffect(() => {
    newLeads
      .filter(notification => notification.read === false)
      .forEach(notification => {
        toast.message(`${notification.title}`, {
          description: `${new Date(notification.createdAt).toLocaleString()}`,
          duration: Infinity,
          cancel: {
            label: 'Read',
            onClick: () => {
              const formData = new FormData();
              formData.append("financeId", notification.financeId);
              formData.append("clientfileId", notification.clientfileId);
              formData.append("id", notification.id);
              formData.append("userId", notification.userId);
              formData.append("pathname", pathname);
              formData.append("intent", 'read');
              submit(formData, { method: "post" })

            },
          },
          action: {
            label: 'Client File',
            onClick: () => {
              navigate(`/customer/${notification.clientfileId}/${notification.financeId}`);
            }
          },
        });
      });
  }, [newLeads]);

  useEffect(() => {
    readNot
      .filter(notification => notification.read === false)
      .forEach(notification => {
        toast.message(`${notification.title}`, { //: ${notification.content}
          description: `${new Date(notification.createdAt).toLocaleString()}`,
          duration: Infinity,
          cancel: {
            label: 'Read',
            onClick: () => {
              const formData = new FormData();
              formData.append("financeId", notification.financeId);
              formData.append("clientfileId", notification.clientfileId);
              formData.append("id", notification.id);
              formData.append("userId", notification.userId);
              formData.append("pathname", pathname);
              formData.append("intent", 'read');
              submit(formData, { method: "post" });
            },
          },
          action: {
            label: 'Client File',
            onClick: () => {
              navigate(`/customer/${notification.clientfileId}/${notification.financeId}`);
            }
          },
        });
      });
  }, [readNot, pathname, submit]);


  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body id="__remix" className="bg-slate12" >
        <FinanceIdContext.Provider value={financeId}>
          {user?.subscriptionId === 'active' || user?.subscriptionId === 'trialing' && (
            pathname !== '/dealer/api/fileUpload' && <>  <Sidebar />  </>)}

          <TooltipProvider>
            <IconoirProvider iconProps={{ strokeWidth: 2, width: "1.5em", height: "1.5em" }}  >
              <>

                <Outlet />
                <Toaster richColors />
                {configDev.isDevelopment && configDev.features.debugScreens && (
                  <TailwindIndicator />
                )}
              </>
            </IconoirProvider>
          </TooltipProvider>
          <VercelAnalytics />
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </FinanceIdContext.Provider>
      </body>
    </html>
  );
}

export function RootDocumentBoundary({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  // Cannot use useLoaderData in catch/error boundary
  return (
    <html lang="en" data-theme={Theme.DARK}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        {title && <title>{title}</title>}
        <Links />
      </head>
      <body >
        {children}
        <VercelAnalytics />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    let message;
    switch (error.status) {
      case 401:
        message = `Sorry, you can't access this page.`;
        break;
      case 404:
        message = `Sorry, this page is not available.`;
        break;
      default:


        throw new Error(error.data || error.statusText);
    }
    return (
      <RootDocumentBoundary title={message}>
        <Layout

          isSpaced
          layoutHeader={
            <PageHeader size="sm">
              <h1>Error {error.status}</h1>
              {error.statusText && <h2>{error.statusText}</h2>}
              <p>{message}</p>
            </PageHeader>
          }
        >
          <div>
            <p>Here's the error information that can be informed to Rewinds.</p>
            <Debug name="error.data" isAlwaysShow isCollapsibleOpen>
              {error.data}
            </Debug>
          </div>
        </Layout>
      </RootDocumentBoundary>
    );
  } else if (error instanceof Error) {
    return (
      <RootDocumentBoundary title="Sorry, unexpected error occured.">
        <Layout
          isSpaced
          layoutHeader={
            <PageHeader size="sm">
              <h1>Error from {configSite.name}</h1>
            </PageHeader>
          }
        >
          <div>
            <p>Here's the error information that can be informed to Rewinds.</p>

            <p>{error.message}</p>
            <Debug name="error" isAlwaysShow isCollapsibleOpen>
              {error}
            </Debug>

            <p>The stack trace is:</p>
            <Debug name="error.stack" isAlwaysShow isCollapsibleOpen>
              {error.stack}
            </Debug>
          </div>
        </Layout>
      </RootDocumentBoundary>
    );
  } else {
    return (
      <Layout>
        <h1>Unknown Error</h1>
      </Layout>
    );
  }
}


/***
 *
 *  function PopoverMenu() {
    const location = useLocation()
    const pathname = location.pathname
    console.log()
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="mr-10 border-none">
            {readNot.some(notification => notification.read === false) ? (
              <BellRing color="#02a9ff" strokeWidth={1.5} />
            ) : (
              <Bell color="#02a9ff" strokeWidth={1.5} />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[450px] bg-[#17181c]">
          <Tabs defaultValue="Msgs" className="w-[420px] mx-auto">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="Msgs" className="text-sm">Msgs</TabsTrigger>
              <TabsTrigger value="Updates" className="text-sm">Updates</TabsTrigger>
              <TabsTrigger value="NewLeads" className="text-sm">New Leads</TabsTrigger>
            </TabsList>
            <TabsContent value="Msgs">
              <ul>
                {newMsgs && newMsgs.length > 0 ? (
                  newMsgs.map((notification) => (
                    <li key={notification.id} className="rounded-md shadow bg-[#454954] mt-2">
                      <div className="grid grid-cols-10 p-2">
                        <div className="grid-span-9 ">
                          <h2 className='text-[#fff]'>{notification.title}</h2>
                          <p className='text-[#fff]'>{notification.content}</p>
                          <p className='text-[#fff] text-sm mt-auto'>{new Date(notification.createdAt).toLocaleString()}</p>
                        </div>
                        <div className="grid-span-1">
                          <fetcher.Form method='post' className=" justify-end items-end">
                            <input type='hidden' name='financeId' value={notification.financeId} />
                            <input type='hidden' name='clientfileId' value={notification.clientfileId} />
                            <input type='hidden' name='id' value={notification.id} />
                            <input type='hidden' name='path' value={pathname} />
                            <input type='hidden' name='intent' value='dimiss' />

                            <input type='hidden' name='userId' value={notification.userId} />
                            <Button className='text-[#fff] '>
                              <X color="#02a9ff" size={20} strokeWidth={1.5} />
                            </Button>
                          </fetcher.Form>
                          <fetcher.Form method='post'>
                            <input type='hidden' name='financeId' value={notification.financeId} />
                            <input type='hidden' name='clientfileId' value={notification.clientfileId} />
                            <input type='hidden' name='id' value={notification.id} />
                            <input type='hidden' name='userId' value={notification.userId} />
                            <input type='hidden' name='path' value={pathname} />
                            <input type='hidden' name='intent' value='read' />
                            <Button className='text-[#fff] justify-center  items-center'>
                              <BookOpenCheck size={20} color="#02a9ff" strokeWidth={1.5} />
                            </Button>
                          </fetcher.Form>
                          <Link to={`/customer/${notification.clientfileId}/${notification.financeId}`} >
                            <Button className='text-[#fff] justify-center  items-center'>
                              <Milestone size={20} color="#02a9ff" strokeWidth={1.5} />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  <p className='tezxt-[#fff]'>No notifications</p>
                )}
              </ul>
            </TabsContent>
            <TabsContent value="Updates">
              <ul>
                {readNot && readNot.length > 0 ? (
                  readNot.map((notification) => (
                    <li key={notification.id} className="rounded-md shadow bg-[#454954] mt-2">
                      <div className="grid grid-cols-10 p-2">
                        <div className="grid-span-9 ">
                          <h2 className='text-[#fff]'>{notification.title}</h2>
                          <p className='text-[#fff]'>{notification.content}</p>
                          <p className='text-[#fff] text-sm mt-auto'>{new Date(notification.createdAt).toLocaleString()}</p>
                        </div>
                        <div className="grid-span-1">
                          <fetcher.Form method='post' className=" justify-end items-end">
                            <input type='hidden' name='financeId' value={notification.financeId} />
                            <input type='hidden' name='clientfileId' value={notification.clientfileId} />
                            <input type='hidden' name='id' value={notification.id} />
                            <input type='hidden' name='path' value={pathname} />
                            <input type='hidden' name='intent' value='dimiss' />

                            <input type='hidden' name='userId' value={notification.userId} />
                            <Button className='text-[#fff] '>
                              <X color="#02a9ff" size={20} strokeWidth={1.5} />
                            </Button>
                          </fetcher.Form>
                          <fetcher.Form method='post'>
                            <input type='hidden' name='financeId' value={notification.financeId} />
                            <input type='hidden' name='clientfileId' value={notification.clientfileId} />
                            <input type='hidden' name='id' value={notification.id} />
                            <input type='hidden' name='userId' value={notification.userId} />
                            <input type='hidden' name='path' value={pathname} />
                            <input type='hidden' name='intent' value='read' />
                            <Button className='text-[#fff] justify-center  items-center'>
                              <BookOpenCheck size={20} color="#02a9ff" strokeWidth={1.5} />
                            </Button>
                          </fetcher.Form>
                          <Link to={`/customer/${notification.clientfileId}/${notification.financeId}`} >
                            <Button className='text-[#fff] justify-center  items-center'>
                              <Milestone size={20} color="#02a9ff" strokeWidth={1.5} />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  <p className='tezxt-[#fff]'>No notifications</p>
                )}
              </ul>
            </TabsContent>
            <TabsContent value="NewLeads">
              <ul>
                {newLeads && newLeads.length > 0 ? (
                  newLeads.map((notification) => (
                    <li key={notification.id} className="rounded-md shadow bg-[#454954] mt-2">
                      <div className="grid grid-cols-10 p-2">
                        <div className="col-span-9 ">
                          <h2 className='text-[#fff]'>{notification.title}</h2>
                          <p className='text-[#fff]'>{notification.content}</p>
                          <p className='text-[#fff] text-sm mt-auto'>{new Date(notification.createdAt).toLocaleString()}</p>
                        </div>
                        <div className="col-span-1">
                          <fetcher.Form method='post' className=" justify-end items-end">
                            <input type='hidden' name='financeId' value={notification.financeId} />
                            <input type='hidden' name='clientfileId' value={notification.clientfileId} />
                            <input type='hidden' name='id' value={notification.id} />
                            <input type='hidden' name='path' value={pathname} />
                            <input type='hidden' name='intent' value='dimiss' />

                            <input type='hidden' name='userId' value={notification.userId} />
                            <Button className='text-[#fff] '>
                              <X color="#02a9ff" size={20} strokeWidth={1.5} />
                            </Button>
                          </fetcher.Form>
                          <fetcher.Form method='post'>
                            <input type='hidden' name='financeId' value={notification.financeId} />
                            <input type='hidden' name='clientfileId' value={notification.clientfileId} />
                            <input type='hidden' name='id' value={notification.id} />
                            <input type='hidden' name='userId' value={notification.userId} />
                            <input type='hidden' name='path' value={pathname} />
                            <input type='hidden' name='intent' value='read' />
                            <Button className='text-[#fff] justify-center  items-center'>
                              <BookOpenCheck size={20} color="#02a9ff" strokeWidth={1.5} />
                            </Button>
                          </fetcher.Form>
                          <Link to={`/customer/${notification.clientfileId}/${notification.financeId}`} >
                            <Button className='text-[#fff] justify-center  items-center'>
                              <Milestone size={20} color="#02a9ff" strokeWidth={1.5} />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  <p className='tezxt-[#fff]'>No notifications</p>
                )}
              </ul>
            </TabsContent>
          </Tabs>
        </PopoverContent>
      </Popover>
    )
  }


 * function App({ noThemeToggle }: Props) {
  const data = useLoaderData();
  const [theme] = useTheme();
  const defaultTheme = theme ? theme : "dark";
  const { user } = useLoaderData()
  /**
   * NProgress loading bar
   * Alternative: https://sergiodxa.com/articles/use-nprogress-in-a-remix-app

  noThemeToggle = false

  return (
    <html lang="en" data-theme={defaultTheme}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <PreventFlashOnWrongTheme ssrTheme={Boolean(data.theme)} />
        <Links />
      </head>
      <body id="__remix" className={cn(defaultTheme)}>
        <Sidebar />
        <HeaderUserMenu />
        <HeaderMainLogo noThemeToggle={noThemeToggle} />
        <TooltipProvider>
          <IconoirProvider
            iconProps={{ strokeWidth: 2, width: "1.5em", height: "1.5em" }}
          >
            <>
              <Outlet />
              <Toaster />
              {configDev.isDevelopment && configDev.features.debugScreens && (
                <TailwindIndicator />
              )}
            </>
          </IconoirProvider>
        </TooltipProvider>
        <VercelAnalytics />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
interface Props {
  noThemeToggle?: boolean;
}

*/
