import { eventStream } from "remix-utils";
import { interval } from "~/utils/timers";
import { PrismaClient } from '@prisma/client';
import { type LoaderFunction, type DataFunctionArgs, type LoaderArgs, redirect, createCookieSessionStorage, json, createCookie } from "@remix-run/node"

//import { authenticator } from "~/services";
import { model } from "~/models";
import { CheckSub } from '~/utils/checksub.server'
import { getSession, commitSession, destroySession } from '../sessions/auth-session.server'
import { requireAuthCookie } from '~/utils/misc.user.server';
import { google } from 'googleapis'
import { GetUser } from "~/utils/loader.server";
import { prisma } from "~/libs";
import bcrypt from "bcryptjs";
import axios from "axios";
import { querystring } from 'querystring'


interface CleanupFunction {
  (): void;
}

const oauth2Client = new google.auth.OAuth2(
  "286626015732-f4db11irl7g5iaqb968umrv2f1o2r2rj.apps.googleusercontent.com",
  "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",
  //"http://localhost:3000/google/callback"
  process.env.GOOGLE_PROD_CALLBACK_URL
);

const gmail = google.gmail({
  version: 'v1',
  auth: oauth2Client
});

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

export async function loader({ request, params }: LoaderFunction) {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")

  const user = await GetUser(email)
  if (!user) { redirect('/login') }

  //return eventStream(request.signal, function setup(send) {
  async function run() {
    //  for await (let _ of interval(1000 * 60 * 1, { signal: request.signal })) { // Check

    //
    const session = await getSession(request.headers.get("Cookie"));
    const refreshToken = session.get("refreshToken")
    const newAccessToken = await getAccessToken(refreshToken)

    session.set("accessToken", newAccessToken);
    await commitSession(session);
    console.log(newAccessToken, 'newAccessToken', refreshToken, 'refreshToken')
    let cookie = createCookie("session_66", {
      secrets: ['secret'],
      // 30 days
      maxAge: 30 * 24 * 60 * 60,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    const cookies = cookie.serialize({
      email: email,
      refreshToken: refreshToken,
      accessToken: newAccessToken,
    })
    await cookies

    oauth2Client.setCredentials({
      refresh_token: refreshToken,
      access_token: newAccessToken,
    });
    const userRes = await gmail.users.getProfile({ userId: 'me' });
    console.log(userRes, 'userRes')

    return json({ ok: true }, {
      headers: { "Set-Cookie": await commitSession(session) },
    });
  }
  // }

  run();
  return run
  // });
}
