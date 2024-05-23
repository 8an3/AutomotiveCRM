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

/*export async function loader({ request, params, req }: LoaderFunction) {
  let session = await getSession(request.headers.get("Cookie"));
  if (session) {
    let email = session.get("email");
    if (email) {
      let user = await GetUser(email);
      if (user) {
        return json({ user, email });
      } else {
        return redirect("/usercheck");
      }
    }
  } else {
    return redirect("/auth/logout");
  }
}
*/

export default function Root() {
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
/*import { AuthenticatedTemplate, UnauthenticatedTemplate, MsalProvider } from '@azure/msal-react'
import { json, redirect, type LoaderFunction } from '@remix-run/node';
import { Outlet, useLoaderData } from '@remix-run/react';
import { getSession, commitSession, authSessionStorage, destroySession } from "~/sessions/auth-session.server";
import { GetUser } from "~/utils/loader.server";
import Sidebar from "~/components/shared/sidebar";
import { ClientOnly } from "remix-utils";
import ProvideAppContext from './auth/AppContext';
import {
    PublicClientApplication,
    EventType,
    type EventMessage,
    type AuthenticationResult,
} from '@azure/msal-browser';

const tenantId = "fa812bd2-3d1f-455b-9ce5-4bfd0a4dfba6";

const msalConfig = {
    auth: {
        clientId: "0fa1346a-ab27-4b54-bffd-e76e9882fcfe",
        clientSecret: "rut8Q~s5LpXMnEjujrxkcJs9H3KpUzxO~LfAOc-D",
        redirectUri: "http://localhost:3000/auth/login",
        authorizationUrl: `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize`,
        tokenUrl: `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token?`,
        userInfoUrl: "https://graph.microsoft.com/oidc/userinfo",
        scopes: [
            "User.ReadWrite",
            "mailboxsettings.read",
            "calendars.readwrite",
            "mail.readwrite",
            "Mail.Send",
            "Notes.ReadWrite.All",
            "Mail.ReadBasic.All",
            "openid",
            "Mail.ReadWrite",
            "offline_access",
        ],
        // scopes: ["openid", "User.ReadWrite", "Mail.ReadWrite", "offline_access"],
        prompt: "login",
        resource: "https://graph.microsoft.com",
        authority: "https://login.microsoftonline.com",
    },
    cache: {
        cacheLocation: 'sessionStorage',
        storeAuthStateInCookie: true
    }
};

export async function loader({ request, params, req }: LoaderFunction) {
    let session = await getSession(request.headers.get("Cookie"));
    let email = session.get("email")
    let user = await GetUser(email)
    return json({ user, email });
}

export default function Root() {
    const { user, email } = useLoaderData()

    const msalInstance = new PublicClientApplication(msalConfig);

    const accounts = msalInstance.getAllAccounts();
    if (accounts && accounts.length > 0) {
        msalInstance.setActiveAccount(accounts[0]);
    }

    msalInstance.addEventCallback((event: EventMessage) => {
        if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
            // Set the active account - this simplifies token acquisition
            const authResult = event.payload as AuthenticationResult;
            console.log(authResult, authResult.account)
            msalInstance.setActiveAccount(authResult.account);
        }
    });

    return (
        <ClientOnly fallback={<Loading />} >
            {() => (
                <MsalProvider instance={msalInstance}>
                    <ProvideAppContext>
                        <Outlet context={msalInstance} />
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
    )
}

function RandomLengthDashes() {
    return <span>{'-'.repeat(Math.floor(Math.random() * 20))}</span>
}
*/
