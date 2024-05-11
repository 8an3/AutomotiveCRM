import { Outlet, useLoaderData } from '@remix-run/react';
import { ClientOnly } from "remix-utils";
import ProvideAppContext, { useAppContext } from '~/components/microsoft/AppContext';
//import ProvideAppContext from "~/routes/__auth/auth/AppContext";
import {
  PublicClientApplication,
  EventType,
  type EventMessage,
  type AuthenticationResult,
} from '@azure/msal-browser';
import { MsalProvider, AuthenticatedTemplate, useMsal, UnauthenticatedTemplate } from '@azure/msal-react';
import { config } from '~/components/microsoft/Config';

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
      msalInstance.setActiveAccount(authResult.account);
      //  console.log(authResult, authResult.account)

    }
  });

  return (
    <ClientOnly fallback={<SimplerStaticVersion />} >
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
function SimplerStaticVersion() {
  return (
    <p>Not working contact support...</p>
  )
}

const loginRequest = {
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
  ]
};

const graphConfig = {
  graphMeEndpoint: "https://graph.microsoft.com/v1.0/me",
};

async function callMsGraph(accessToken) {
  const headers = new Headers();
  const bearer = `Bearer ${accessToken}`;
  headers.append("Authorization", bearer);
  const options = {
    method: "GET",
    headers: headers
  };
  return fetch(graphConfig.graphMeEndpoint, options)
    .then(response => response.json())
    .catch(error => console.log(error));
}



/**import { Outlet, useLoaderData } from '@remix-run/react';
import { ClientOnly } from "remix-utils";
import ProvideAppContext from "~/routes/__auth/auth/AppContext";
import {
  PublicClientApplication,
  EventType,
  type EventMessage,
  type AuthenticationResult,
  type PopupRequest,
  LogLevel
} from '@azure/msal-browser';
import { MsalProvider, AuthenticatedTemplate, useMsal, UnauthenticatedTemplate } from '@azure/msal-react';
import { useState, useEffect } from 'react'

const tenantId = "fa812bd2-3d1f-455b-9ce5-4bfd0a4dfba6";
export const msalConfig = {
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
  authority: `https://login.microsoftonline.com/${tenantId}`,
}
const config = {
  auth: {
    clientId: msalConfig.clientId,
    clientSecret: msalConfig.clientSecret,
    redirectUri: msalConfig.redirectUri,
    authority: msalConfig.authority,
    knownAuthorities: [],
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: false,
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
      console.log(authResult, authResult.account)
      msalInstance.setActiveAccount(authResult.account);

    }
  });
  return (
    <ClientOnly fallback={<SimplerStaticVersion />} >
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
function SimplerStaticVersion() {
  return (
    <p>Not working contact support...</p>
  )
}

 */
