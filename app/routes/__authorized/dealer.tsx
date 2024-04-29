import { AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react'
import { json, redirect, type LoaderFunction } from '@remix-run/node';
import { Outlet, useLoaderData } from '@remix-run/react';
import { getSession, commitSession, authSessionStorage, destroySession } from "~/sessions/auth-session.server";
import { GetUser } from "~/utils/loader.server";
import Sidebar from "~/components/shared/sidebar";
import NotificationSystem from "~/routes/__authorized/dealer/notifications";

export async function loader({ request, params, req }: LoaderFunction) {
  let session = await getSession(request.headers.get("Cookie"));
  let email = session.get("email")
  let expiry = session.get("expiry")
  const currentTime = Date.now();
  console.log(email, expiry)
  const expirationTimeSeconds = expiry

  const expirationTimeMillis = expirationTimeSeconds * 1000;

  if (currentTime > expirationTimeMillis) {
    console.log('Token has expired');
  }
  let user = await GetUser(email)
  if (!user.email) {
    await destroySession(session)
    return redirect('/auth/login')
  }
  if (session.data.length < 5000) { await destroySession(session); session = await getSession(request.headers.get("Cookie")); }
  session.set("email", email);

  if (user) {
    return json({
      user, email,
    },
      {
        headers: {
          'Set-Cookie': await commitSession(session),
        },
      },
    )
  }
  console.log('doesnt have user but has user?')
  return null
}

export default function Home() {
  const { user, email } = useLoaderData()
  return (
    <>
      <Sidebar user={user} email={email} />
      <NotificationSystem />
      <Outlet />
    </>
  );
}

