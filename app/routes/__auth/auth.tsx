import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  MsalProvider,
} from "@azure/msal-react";
import { json, redirect, type LoaderFunction } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import {
  getSession,
  commitSession,
  authSessionStorage,
  destroySession,
} from "~/sessions/auth-session.server";
import { GetUser } from "~/utils/loader.server";
import { ClientOnly } from "remix-utils";
import ProvideAppContext, {
  useAppContext,
} from "~/components/microsoft/AppContext";

//import ProvideAppContext from './auth/AppContext';
import {
  PublicClientApplication,
  EventType,
  type EventMessage,
  type AuthenticationResult,
  type Configuration,
  LogLevel,
} from "@azure/msal-browser";
import { config } from "~/components/microsoft/Config";
import { useEffect, useState } from "react";


export default function Root() {
  const [host, setHost] = useState("http://localhost:3000")

  useEffect(() => {
    const domainName = window.location.hostname;
    if (domainName !== host) {
      setHost(`https://www.dealersalesassistant.ca`)
    }
    console.log(domainName, 'authlogin domoainname')
  }, []);


  const config = {
    auth: {
      clientId: "0fa1346a-ab27-4b54-bffd-e76e9882fcfe",
      clientSecret: '4hN8Q~RtcN.b9c.1LTCnHtY0UurShP1PIIFQGakw',
      tenantId: 'fa812bd2-3d1f-455b-9ce5-4bfd0a4dfba6',
      redirectUri: host === "http://localhost:3000" ? `http://localhost:3000/auth/login` : `https://www.dealersalesassistant.ca/auth/login`,
      authority: `https://login.microsoftonline.com/common`,
      postLogoutRedirectUri: "/",
      prompt: "login",
    },
    cache: {
      cacheLocation: 'localStorage',
      temporaryCacheLocation: "localStorage",
    },
    system: {
      loggerOptions: {
        loggerCallback: (level, message, containsPii) => {
          if (containsPii) {
            return;
          }
          switch (level) {
            case LogLevel.Error:
              console.error(message);
              return;
            case LogLevel.Info:
              console.info(message);
              return;
            case LogLevel.Verbose:
              console.debug(message);
              return;
            case LogLevel.Warning:
              console.warn(message);
              return;
            default:
              return;
          }
        },
      },
    },

  }
  const msalInstance = new PublicClientApplication(config);

  const accounts = msalInstance.getAllAccounts();
  if (accounts && accounts.length > 0) {
    msalInstance.setActiveAccount(accounts[0]);
  }

  msalInstance.addEventCallback((event: EventMessage) => {
    if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
      // Set the active account - this simplifies token acquisition
      const authResult = event.payload as AuthenticationResult;
      console.log(authResult, authResult.account);
      msalInstance.setActiveAccount(authResult.account);
    }
  });
  return (
    <ClientOnly fallback={<Loading />}>
      {() => (
        <MsalProvider instance={msalInstance}>
          <ProvideAppContext>
            <Outlet />
          </ProvideAppContext>
        </MsalProvider>
      )}
    </ClientOnly>
  );
}

function Loading() {
  return (
    <ul>
      {Array.from({ length: 12 }).map((_, i) => (
        <li key={i}>
          <RandomLengthDashes /> <RandomLengthDashes /> <RandomLengthDashes />
        </li>
      ))}
    </ul>
  );
}

function RandomLengthDashes() {
  return <span>{"-".repeat(Math.floor(Math.random() * 20))}</span>;
}
