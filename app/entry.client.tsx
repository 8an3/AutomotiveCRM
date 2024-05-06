
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
/**
/*
 By default, Remix will handle hydrating your app on the client for you.
  You are free to delete this file if you'd like to, but if you ever want it revealed again, you can run `npx remix reveal` ✨
 For more information, see https://remix.run/docs/en/main/file-conventions/entry.client


 import { RemixBrowser } from "@remix-run/react";
 import { startTransition, StrictMode } from "react";
 import { hydrateRoot } from "react-dom/client";
 import {
   PublicClientApplication,
  EventType,
  type EventMessage,
  type AuthenticationResult
 } from '@azure/msal-browser';
 // MSAL imports

 import { msalConfig } from "./authConfig";

 export const msalInstance = new PublicClientApplication(msalConfig);

 msalInstance.initialize().then(() => {
   // Account selection logic is app dependent. Adjust as needed for different use cases.
   const accounts = msalInstance.getAllAccounts();
   if (accounts.length > 0) {
       msalInstance.setActiveAccount(accounts[0]);
   }

   msalInstance.addEventCallback((event: EventMessage) => {
       if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
           const payload = event.payload as AuthenticationResult;
           const account = payload.account;
           msalInstance.setActiveAccount(account);
       }
   });


   startTransition(() => {
     hydrateRoot(
       document,
       <StrictMode>
         <RemixBrowser  pca={msalInstance} />
       </StrictMode>
     );
    });
 });
*/
