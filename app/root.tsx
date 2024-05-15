import { json, redirect, createCookie } from "@remix-run/node";
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, isRouteErrorResponse, useRouteError, } from "@remix-run/react";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import { IconoirProvider } from "iconoir-react";
import React, { useEffect, useState } from "react";
import { Debug, Layout, PageHeader, TailwindIndicator, TooltipProvider, } from "~/components";
import { configDev, configSite } from "~/configs";
import { cn, createCacheHeaders, createMetaData, getEnv } from "~/utils";
import type { HeadersFunction, LinksFunction, LoaderArgs, V2_MetaDescriptor, V2_MetaFunction, } from "@remix-run/node";
import { type RootLoaderData } from "~/hooks";
import { Theme } from "@radix-ui/themes";
//import FinanceIdContext from "~/other/financeIdContext";
import slider from "~/styles/slider.css";
import { Toaster } from "sonner";
import { getSession, commitSession } from "./sessions/auth-session.server";
import { GlobalLoading } from "./components/ui/globalLoading";
import nProgressStyles from "~/styles/loader.css";
import rbc from "~/styles/rbc.css";
import { Provider } from "react-redux";
import store from "./store";
import { type IPublicClientApplication } from "@azure/msal-browser";
import { GetUser } from "~/utils/loader.server";
import GetUserFromRequest from "~/utils/auth/getUser";
import { ThemeProvider, BaseStyles } from '@primer/react'
import base from "~/styles/base.css";
import tailwind from "~/styles/tailwind.css";
import font from "~/styles/font.css";
import secondary from "~/styles/secondary.css";


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
  const user = await GetUserFromRequest(request);
  if (!user) { return redirect('/login'); }

  const ENV = getEnv();
  const userSession = await getSession(request.headers.get("Cookie"));
  const email = userSession.get("email");
  if (!email) {
    return json({ ENV });
  }
  const referrer = request.headers.get('referer');

  const loaderData = {
    ENV,
    userSession,
    user,
  } satisfies RootLoaderData;

  return json(
    { loaderData, user, referrer },
    {
      headers: { "Set-Cookie": await commitSession(userSession) },
    }
  );
}

export default function App({ pca }: AppProps) {
  const [financeId, setFinanceId] = useState(null);

  // <Provider store={store}>
  //         </Provider>
  // </FinanceIdContext.Provider>
  // <FinanceIdContext.Provider value={financeId}>
  //
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body id="__remix">
        <ThemeProvider>
          <BaseStyles>

            <TooltipProvider>
              <IconoirProvider
                iconProps={{
                  strokeWidth: 2,
                  width: "1.5em",
                  height: "1.5em",
                }}
              >
                <Outlet />
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
            <GlobalLoading />
          </BaseStyles>
        </ThemeProvider>
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


export const meta: V2_MetaFunction = () => {
  return createMetaData() satisfies V2_MetaDescriptor[];
};

export const headers: HeadersFunction = () => {
  return {
    "Accept-CH": "Sec-CH-Prefers-Color-Scheme",
  };
};
