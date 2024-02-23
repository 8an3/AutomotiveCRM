
import { type LoaderFunction, type DataFunctionArgs, type LoaderArgs, redirect, createCookieSessionStorage, json, createCookie } from "@remix-run/node"
import { getSession, commitSession, destroySession } from '../../sessions/auth-session.server'
import { google } from 'googleapis'
import * as querystring from 'querystring';
import { prisma } from "~/libs";


const oauth2Client = new google.auth.OAuth2(
  "286626015732-f4db11irl7g5iaqb968umrv2f1o2r2rj.apps.googleusercontent.com",
  "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",
  "http://localhost:3000/auth/google/callback"
);

const gmail = google.gmail({
  version: 'v1',
  auth: oauth2Client
});

const scopes = [
  'https://mail.google.com/',
];


export async function loader({ request, params, req }: LoaderFunction) {
  const queryParams23 = new URL(request.url).searchParams;
  const code23 = queryParams23.get('code')
  //console.log(queryParams23, code23, '23 and 23')
  const url = new URL(request.url);
  console.log(url, 'url auth google callback', url.hostname, '7777')

  const { tokens } = await oauth2Client.getToken(code23);
  oauth2Client.setCredentials(tokens);
  const userRes = await gmail.users.getProfile({ userId: 'me' });

  const session = await getSession(request.headers.get("Cookie"));
  session.set("accessToken", tokens.access_token);
  session.set("refreshToken", tokens.refresh_token);
  session.set("expires_in", tokens.expires_in);
  const email = userRes.data.emailAddress
  const name = userRes.data.name
  session.set("name", name);
  session.set("email", email);
  // console.log(userRes.data.emailAddress)
  await prisma.user.update({ where: { email: email }, data: { expires_in: tokens.expires_in, refreshToken: tokens.refresh_token } })

  let secret = process.env.COOKIE_SECRET || "default";
  if (secret === "default") {
    console.warn(
      "🚨 No COOKIE_SECRET environment variable set, using default. The app is insecure in production.",
    );
    secret = "default-secret";
  }
  const remember = true;
  const userId = await prisma.user.findUnique({ where: { email: email }, })
  session.set("userid", userId?.id);
  await commitSession(session);
  // console.log(name, 'name', email, 'email', tokens.access_token, tokens.refresh_token)


  let cookie = createCookie("session_66", {
    secrets: ['secret'],
    // 30 days
    maxAge: 30 * 24 * 60 * 60,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  const cookies = cookie.serialize({
    'name': name,
    email: email,
    refreshToken: tokens.refresh_token,
    accessToken: tokens.access_token,
  })

  // console.log(session, 'auth google')
  return redirect('/checksubscription', {
    headers: {
      "Set-Cookie":
        await commitSession(session) //&&
      // await cookies

    },
  });
}
