import { AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react'
import { json, redirect, type LoaderFunction } from '@remix-run/node';
import { Outlet, useLoaderData } from '@remix-run/react';
import { getSession, commitSession, authSessionStorage, destroySession } from "~/sessions/auth-session.server";
import { UseRefreshToken } from '~/routes/__auth/auth';
import { GetUser } from "~/utils/loader.server";
import Sidebar from "~/components/shared/sidebar";
import NotificationSystem from "~/routes/__authorized/dealer/notifications";

export async function loader({ request, params, req }: LoaderFunction) {
  let session = await getSession(request.headers.get("Cookie"));
  let email = session.get("email")
  let user = await GetUser(email)
  if (!user) {
    await destroySession(session)
    return redirect('/login')
  }
  const name = session.get("name")
  const accessToken = session.get("accessToken")
  if (session.data.length < 5000) { await destroySession(session); session = await getSession(request.headers.get("Cookie")); }
  session.set("accessToken", accessToken);
  session.set("email", email);
  const refreshToken = user?.refreshToken
  if (!user) {
    const getNewToken = await UseRefreshToken(refreshToken)
    console.log(getNewToken.data, getNewToken.response, ' resposne loader authoirized')
    session.set("accessToken", getNewToken.access_token);
    session.set("name", getNewToken.name);
    session.set("email", getNewToken.email);
    return json({
      user, email, name
    },
      {
        headers: {
          'Set-Cookie': await commitSession(session),
        },
      },
    )
  }
  if (user) {
    return json({
      user, email, name
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

