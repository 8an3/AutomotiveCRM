import { json, redirect, createCookie } from "@remix-run/node";
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, isRouteErrorResponse, useLoaderData, useNavigation, useRouteError, } from "@remix-run/react";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import { IconoirProvider } from "iconoir-react";
import React, { useEffect, useState } from "react";
import { Button, Debug, Layout, PageHeader, TailwindIndicator, TooltipProvider, } from "~/components";
import { configDev, configSite } from "~/configs";
import { cn, createCacheHeaders, createMetaData, getEnv } from "~/utils";
import type { HeadersFunction, LinksFunction, LoaderArgs, V2_MetaDescriptor, V2_MetaFunction, } from "@remix-run/node";
import { type RootLoaderData } from "~/hooks";
import { Theme } from "@radix-ui/themes";
//import FinanceIdContext from "~/components/ui/financeIdContext";
import slider from "~/styles/slider.css";
import { Toaster } from "sonner";
import { getSession, commitSession } from "./sessions/auth-session.server";
import { GlobalLoading } from "./components/ui/globalLoading";
import nProgressStyles from "~/styles/loader.css";
import rbc from "~/styles/rbc.css";
import { type IPublicClientApplication } from "@azure/msal-browser";
import { GetUser } from "~/utils/loader.server";
import GetUserFromRequest from "~/utils/auth/getUser";
import { ThemeProvider, BaseStyles } from '@primer/react'
import { model } from "~/models";
import base from "~/styles/base.css";
import tailwind from "~/styles/tailwind.css";
import font from "~/styles/font.css";
import secondary from "~/styles/secondary.css";
import { Copy } from "lucide-react";
import { FaCheck } from "react-icons/fa";
import Spinner from "./components/shared/spinner";
import { themeSessionResolver } from "~/sessions";

import {
  PreventFlashOnWrongTheme,
  Theme as remixTheme,
  ThemeProvider as RemixThemeProvider,
  useTheme as remixUseTheme,
} from "remix-themes";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: tailwind },
  { rel: "stylesheet", href: font },
  { rel: "stylesheet", href: rbc },
  { rel: "stylesheet", href: slider },
  { rel: "icon", type: "image/svg", sizes: "32x32", href: "/money24.svg" },
  { rel: "icon", type: "image/svg", sizes: "16x16", href: "/money16.svg" },
  { rel: "apple-touch-icon", sizes: "180x180", href: "/money180.svg" },
  { rel: "stylesheet", href: nProgressStyles },
  { rel: "stylesheet", href: secondary },
];

type AppProps = {
  pca: IPublicClientApplication;
};

export async function loader({ request }: LoaderArgs) {

  const ENV = getEnv();
  const userSession = await getSession(request.headers.get("Cookie"));
  const email = userSession.get("email");
  if (!email) {
    return json({ ENV });
  }
  const referrer = request.headers.get('referer');
  const user = await model.user.query.getForSession({ email: email });

  // Get theme function and data from cookie via remix-themes
  const { getTheme } = await themeSessionResolver(request);
  const theme = getTheme();

  if (!userSession) {
    return json({
      ENV,
      theme,
    });
  }

  const loaderData = {
    ENV,
    theme,
    userSession,
    user,
  } satisfies RootLoaderData;

  return json({ loaderData });
}

export default function Route() {
  const data = useLoaderData();
  return (
    <RemixThemeProvider specifiedTheme={data.theme} themeAction="/action/set-theme">
      <App />
    </RemixThemeProvider>
  );
}
function App() {
  const data = useLoaderData<typeof loader>();
  const [theme] = remixUseTheme();
  const defaultTheme = theme ? theme : "dark";

  return (
    <html lang="en" data-theme={defaultTheme}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
        <PreventFlashOnWrongTheme ssrTheme={Boolean(data.theme)} />
      </head>
      <body id="__remix" className={cn(defaultTheme)}>
        <TooltipProvider>
          <IconoirProvider
            iconProps={{
              strokeWidth: 2,
              width: "1.5em",
              height: "1.5em",
            }}
          >
            <Outlet />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.ENV = ${JSON.stringify(
                  data.ENV
                )}`,
              }}
            />
            <Toaster richColors />
            {configDev.isDevelopment &&
              configDev.features.debugScreens && (
                <TailwindIndicator />
              )}
          </IconoirProvider>
        </TooltipProvider>
        <VercelAnalytics />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        <Spinner />
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
      <body>
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
    const copyText = (text) => {
      navigator.clipboard.writeText(text)
        .then(() => {
          setCopiedText(text);
          setTimeout(() => setCopiedText(''), 3000); // Reset after 3 seconds
        })
        .catch((error) => {
          console.error('Failed to copy text: ', error);
        });
    };
    const [copiedText, setCopiedText] = useState('');

    return (
      <RootDocumentBoundary className='bg-background'>
        <Layout isSpaced>
          <fieldset className="mx-auto grid max-h-[900px] h-auto w-[90%] lg:w-[60%] cursor-pointer rounded-lg border text-foreground border-border p-4    mt-10 ">
            <legend className="-ml-1 px-1 text-lg font-medium text-foreground">
              <h1>Error {error.status}</h1>
            </legend>
            <br className="my-1" />
            <div className="font-semibold"> {error.statusText && <h2>{error.statusText}</h2>}</div>
            <ul className="grid gap-3">
              <li className="text-left">
                <span className="text-[#8a8a93]">{message}</span>
              </li>
              <hr className="my-4 text-muted-foreground w-[95%] mx-auto" />
              <li className="text-left">
                <span className="text-[#8a8a93]">{error.data}</span>
              </li>
            </ul>
          </fieldset>
        </Layout>
      </RootDocumentBoundary>

    );
  } else if (error instanceof Error) {
    const copyText = (text) => {
      navigator.clipboard.writeText(text)
        .then(() => {
          setCopiedText(text);
          setTimeout(() => setCopiedText(''), 3000); // Reset after 3 seconds
        })
        .catch((error) => {
          console.error('Failed to copy text: ', error);
        });
    };
    const [copiedText, setCopiedText] = useState('');
    return (
      <RootDocumentBoundary  >
        <Layout isSpaced>
          <fieldset className="mx-auto grid max-h-[900px] h-auto w-[90%] lg:w-[60%]   rounded-lg border text-foreground border-border p-4    mt-[50px] ">
            <legend className="-ml-1 px-1 text-lg font-medium ">
              <div className='flex'>
                <h3 className='text-foreground'>  Sorry, unexpected error occured.  </h3>

                <Button size="icon" variant="outline" onClick={() => copyText(error.message + ' || ' + String(error) + ' || ' + error.stack)} className="h-6 w-6     ml-2" >
                  <Copy className="h-3 w-3" />
                  <span className="sr-only">Copy</span>
                </Button>
                {copiedText === error.message + ' || ' + String(error) + ' || ' + error.stack && <FaCheck strokeWidth={1.5} className=" ml-2 text-lg text-[#3eff17] " />}
              </div>
            </legend>
            <span className="text-[#8a8a93]">If the error doesn't go away after reloading the page please send us a copy of the error by clicking the copy button above.</span>

            <hr className="my-4 text-muted-foreground w-[95%] mx-auto" />

            <br className="my-1" />

            <div className='group'>
              <div className="font-semibold flex">
                Error from Dealer Sales Assistant
                <Button size="icon" variant="outline" onClick={() => copyText(error.message)} className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100 ml-2" >
                  <Copy className="h-3 w-3" />
                  <span className="sr-only">Copy</span>
                </Button>
                {copiedText === error.message && <FaCheck strokeWidth={1.5} className=" ml-2 text-lg text-[#3eff17] " />}
              </div>
              <ul className="grid gap-3">
                <li className="text-left">
                  <span className="text-[#8a8a93]">Here's the error information that can be informed to D.S.A.</span>
                </li>
                <li className="text-left">
                  <span className="text-[#8a8a93]">{error.message}</span>
                </li>
              </ul>
            </div>


            <ul>
              <li className="text-left  group">
                <span className="text-[#8a8a93]">
                  <Debug name="error" isAlwaysShow isCollapsibleOpen className='text-foreground bg-background border-border'>
                    {error}
                  </Debug>
                </span>
                <Button size="icon" variant="outline" onClick={() => copyText(String(error))} className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100 ml-2" >
                  <Copy className="h-3 w-3" />
                  <span className="sr-only">Copy</span>
                </Button>
                {copiedText === String(error) && <FaCheck strokeWidth={1.5} className=" ml-2 text-lg text-[#3eff17] " />}
              </li>
            </ul>

            <hr className="my-4 text-muted-foreground w-[95%] mx-auto" />

            <div className='group'>
              <div className="font-semibold flex ">
                The stack trace is:
                <Button size="icon" variant="outline" onClick={() => copyText(error.stack)} className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100 ml-2"  >
                  <Copy className="h-3 w-3" />
                  <span className="sr-only">Copy</span>
                </Button>
                {copiedText === error.stack && <FaCheck strokeWidth={1.5} className=" ml-2 text-lg text-[#3eff17] " />}
              </div>
              <ul>
                <li className="text-left ">
                  <span className="text-[#8a8a93]">{error.stack}</span>
                </li>
              </ul>
            </div>

          </fieldset>
        </Layout>
      </RootDocumentBoundary >
    );
  } else {
    return (
      <Layout>
        <h1>Unknown Error</h1>
      </Layout>
    );
  }
}

export const meta: V2_MetaFunction = () => {
  return createMetaData() satisfies V2_MetaDescriptor[];
};

export const headers: HeadersFunction = () => {
  return {
    "Accept-CH": "Sec-CH-Prefers-Color-Scheme",
  };
};
