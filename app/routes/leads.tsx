import { Container } from "@radix-ui/themes";
import { Outlet, useLoaderData } from "@remix-run/react";
import React from "react";
import { commitSession, getSession } from '~/sessions/auth-session.server';
import { prisma } from "~/libs";
import { model } from "~/models";
import Sidebar from "~/components/shared/sidebar";
import { type LinksFunction, json, createCookie } from "@remix-run/node";
import NotificationSystem from "./notifications";
import secondary from '~/styles/secondary.css'
import slider from '~/styles/slider.css'

import axios from "axios";
import { google } from 'googleapis';


const oauth2Client = new google.auth.OAuth2(
  "286626015732-f4db11irl7g5iaqb968umrv2f1o2r2rj.apps.googleusercontent.com",
  "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",
  "http://localhost:3000/google/callback"
);

const gmail = google.gmail({
  version: 'v1',
  auth: oauth2Client,
});
const API_KEY = 'AIzaSyCsE7VwbVNO4Yw6PxvAfx8YPuKSpY9mFGo'


const getAccessToken = async (refreshToken) => {
  try {
    const accessTokenObj = await axios.post(
      'https://www.googleapis.com/oauth2/v4/token',
      {
        refresh_token: refreshToken,
        client_id: "286626015732-f4db11irl7g5iaqb968umrv2f1o2r2rj.apps.googleusercontent.com",
        client_secret: "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",
        grant_type: 'refresh_token'
      }
    );

    return accessTokenObj.data.access_token;
  } catch (err) {
    console.log(err);
  }
};

export function Unauthorized(refreshToken) {
  console.log('Unauthorized');
  const newAccessToken = getAccessToken(refreshToken)

  console.log(newAccessToken, 'newAccessToken', refreshToken, 'refreshToken')

  oauth2Client.setCredentials({
    //  refresh_token: refreshToken,
    access_token: newAccessToken,
  });
  google.options({ auth: oauth2Client });
  //  const userRes = await gmail.users.getProfile({ userId: 'me' });
  //console.log(userRes, 'userRes')

  const tokens = newAccessToken
  return tokens
}
export const links: LinksFunction = () => [
  { rel: "stylesheet", href: slider },
  { rel: "stylesheet", href: secondary },

];

export const loader = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")

  const user = await model.user.query.getForSession({ email: email });
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

  // tokens
  let tokens = session.get("accessToken")
  // new
  const refreshToken = session.get("refreshToken")
  let cookie = createCookie("session_66", {
    secrets: ['secret'],
    // 30 days
    maxAge: 30 * 24 * 60 * 60,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  const userRes = await fetch(`https://gmail.googleapis.com/gmail/v1/users/${user.email}/profile`, {
    headers: { Authorization: 'Bearer ' + tokens, Accept: 'application/json' }
  });
  console.log(userRes, 'userRes')
  // new
  if (userRes.status === 401) {
    const unauthorizedAccess = await Unauthorized(refreshToken)
    tokens = unauthorizedAccess

    session.set("accessToken", tokens);
    await commitSession(session);

    const cookies = cookie.serialize({
      email: email,
      refreshToken: refreshToken,
      accessToken: tokens,
    })
    await cookies
    console.log(tokens, 'authorized tokens')

  } else { console.log('Authorized'); }
  // tokens
  return json({ user, notifications, notificationsNewLead, tokens, refreshToken });
}

export default function Quote() {
  const { notifications, user } = useLoaderData()
  // <Sidebar user = { user } />
  // <NotificationSystem notifications={notifications} />
  //
  return (
    <>
      <div className="w-full h-[100vh]   px-2 sm:px-1 lg:px-3 bg-black border-gray-300 font-bold uppercase  ">
        <Sidebar user={user} />
        <NotificationSystem />
        <Outlet />
      </div>
    </>
  );
}
