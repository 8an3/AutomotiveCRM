import { AuthenticatedTemplate, UnauthenticatedTemplate, MsalProvider } from '@azure/msal-react'
import { json, redirect, type LoaderFunction } from '@remix-run/node';
import { Outlet, useLoaderData } from '@remix-run/react';
import { getSession, commitSession, authSessionStorage, destroySession } from "~/sessions/auth-session.server";
import { GetUser } from "~/utils/loader.server";
import Sidebar from "~/components/zRoutes/oldComps/sidebar";


export default function Root() {
  return (
    <>
      <Outlet />
    </>
  );
}

