/*
 By default, Remix will handle hydrating your app on the client for you.
  You are free to delete this file if you'd like to, but if you ever want it revealed again, you can run `npx remix reveal` ✨
 For more information, see https://remix.run/docs/en/main/file-conventions/entry.client
 */

import { RemixBrowser } from "@remix-run/react";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import {
  PublicClientApplication,
 EventType,
 type EventMessage,
 type AuthenticationResult
} from '@azure/msal-browser';

import config from './routes/_auth.config';

// <MsalInstanceSnippet>
const msalInstance = new PublicClientApplication({
  auth: {
    clientId: config.appId,
    redirectUri: config.redirectUri
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: true
  }
});

// Check if there are already accounts in the browser session
// If so, set the first account as the active account
const accounts = msalInstance.getAllAccounts();
if (accounts && accounts.length > 0) {
  msalInstance.setActiveAccount(accounts[0]);
}

msalInstance.addEventCallback((event: EventMessage) => {
  if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
    // Set the active account - this simplifies token acquisition
    const authResult = event.payload as AuthenticationResult;
    msalInstance.setActiveAccount(authResult.account);
  }
});
// </MsalInstanceSnippet>

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <RemixBrowser pca={msalInstance} />
    </StrictMode>
  );
});


/**
import { RemixBrowser } from "@remix-run/react";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";

startTransition(() => {
 hydrateRoot(
   document,
   <StrictMode>
     <RemixBrowser />
   </StrictMode>
 );
});
*/
