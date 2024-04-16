

import { AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react'
import { json, redirect, type LoaderFunction } from '@remix-run/node';
import { Outlet, useLoaderData } from '@remix-run/react';
import { getSession, commitSession, authSessionStorage, destroySession } from "~/sessions/auth-session.server";
import { UseRefreshToken } from '~/routes/_auth/auth';
import { GetUser } from "~/utils/loader.server";
import Sidebar from "~/components/shared/sidebar";
import NotificationSystem from "~/routes/_authorized/internal/notifications";


export default function Home() {
  return (
    <>
      <Outlet />
    </>
  );
}

