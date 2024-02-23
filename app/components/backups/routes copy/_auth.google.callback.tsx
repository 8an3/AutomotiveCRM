
import { type LoaderFunction, type DataFunctionArgs, type LoaderArgs, redirect, createCookieSessionStorage, json } from "@remix-run/node"
import { getSession, commitSession, destroySession } from '../sessions/auth-session.server'
import { google } from 'googleapis'
import * as querystring from 'querystring';
import { getRedirectTo } from "~/utils";
import { prisma } from "~/libs";

const oauth2Client = new google.auth.OAuth2(
  "286626015732-f4db11irl7g5iaqb968umrv2f1o2r2rj.apps.googleusercontent.com",
  "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",
  "http://localhost:3000/google/callback",
);

const gmail = google.gmail({
  version: 'v1',
  auth: oauth2Client,
});

export async function loader({ request, params }: LoaderFunction) {
  // works maybe
  const queryParams23 = new URL(request.url).searchParams;
  const code23 = queryParams23.get('code')
  console.log(queryParams23, code23, '23 and 23')
  // works
  const queryParams = querystring.parse(request.url.split('?')[1]);
  const code = queryParams.code as string;
  if (!code23) {
    console.error('Missing "code" in request query:', request.url.search);
  }
  const { tokens } = await oauth2Client.getToken(code23);
  oauth2Client.setCredentials(tokens);
  const userRes = await gmail.users.getProfile({ userId: 'me' });

  // dont know yet
  const session = await getSession(request.headers.get("Cookie"));
  session.set("accessToken", tokens.access_token);
  session.set("refreshToken", tokens.refresh_token);
  session.set("expires_in", tokens.expires_in);
  // session.set("profile", userRes);
  const email = userRes.data.emailAddress
  const name = userRes.data.name
  session.set("name", name);
  session.set("email", email);
  console.log(userRes.data.emailAddress)

  // console.log('queryParams22:', queryParams);
  // console.log('code66:', code);
  // console.log(userRes.data.emailAddress)
  // console.log(tokens)
  await prisma.user.update({ where: { email: email }, data: { expires_in: tokens.expires_in, refreshToken: tokens.refresh_token } })

  const userId = await prisma.user.findUnique({
    where: { email: email },
  })
  session.set("userid", userId?.id);
  return redirect('/google/form', {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}




