import { Container } from "@radix-ui/themes";
import { Outlet, useLoaderData } from "@remix-run/react";
import React from "react";
import { getSession } from '~/sessions/auth-session.server';
import { prisma } from "~/libs";
import { model } from "~/models";
import Sidebar from "~/components/shared/sidebar";
import { type LinksFunction, json, redirect } from "@remix-run/node";
import NotificationSystem from "~/routes/__authorized/dealer/notifications";
import slider from '~/styles/slider.css'
import secondary from '~/styles/secondary.css'
import { GetUser } from "~/utils/loader.server";
import { useMsal } from '@azure/msal-react';
//MSAL configuration

const CLIENT_ID = process.env.MICRO_APP_ID
const TENANT_ID = process.env.MICRO_TENANT_ID

const msalConfig = {
  auth: {
    clientId: CLIENT_ID,
    authority: `https://login.microsoftonline.com/${TENANT_ID}`,
    redirectUri: 'http://localhost:8080'
  }
};
const msalRequest = { scopes: [] };
function ensureScope(scope) {
  if (!msalRequest.scopes.some((s) => s.toLowerCase() === scope.toLowerCase())) {
    msalRequest.scopes.push(scope);
  }
}
async function MSAL() {
  //Initialize MSAL client
  const msal = useMsal();
  const msalClient = new msal.PublicClientApplication(msalConfig);
  return msalClient
}

// Log the user in
async function signIn() {
  const msalClient = MSAL()
  const authResult = await msalClient.loginPopup(msalRequest);
  sessionStorage.setItem('msalAccount', authResult.account.username);
}



//Get token from Graph
async function getToken() {
  const msalClient = MSAL()

  let account = sessionStorage.getItem('msalAccount');
  if (!account) {
    throw new Error(
      'User info cleared from session. Please sign out and sign in again.');
  }
  try {
    // First, attempt to get the token silently
    const silentRequest = {
      scopes: msalRequest.scopes,
      account: msalClient.getAccountByUsername(account)
    };

    const silentResult = await msalClient.acquireTokenSilent(silentRequest);
    return silentResult.accessToken;
  } catch (silentError) {
    // If silent requests fails with InteractionRequiredAuthError,
    // attempt to get the token interactively
    if (silentError instanceof msal.InteractionRequiredAuthError) {
      const interactiveResult = await msalClient.acquireTokenPopup(msalRequest);
      return interactiveResult.accessToken;
    } else {
      throw silentError;
    }
  }
}
export const links: LinksFunction = () => [
  { rel: "stylesheet", href: slider },
  { rel: "stylesheet", href: secondary },
];

export const loader = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")


  const user = await GetUser(email)
  /// console.log(user, account, 'wquiote loadert')
  const notifications = await prisma.notificationsUser.findMany({
    where: {
      userId: user.id,
    }
  })
  const notificationsNewLead = await prisma.notificationsUser.findMany({
    where: {
      type: 'New Lead',
    }
  })
  if (!user) {
    redirect('/login')
  }
  return json({ user, notifications, notificationsNewLead });
}

export default function Quote() {
  const { notifications, user } = useLoaderData()
  // <Sidebar user = { user } />
  // <NotificationSystem notifications={notifications} />
  //
  return (
    <html lang="en" className="bg-black" >
      <head className="bg-black">
      </head>
      <body id="__remix" className="m-0 p-0 h-[100vh] bg-black" style={{ background: '#000', margin: 0, padding: 0 }}>
        <Sidebar />
        <NotificationSystem />
        <Outlet />
      </body >
    </html >
  );
}
