import { type LoaderFunction, type DataFunctionArgs, type LoaderArgs } from "@remix-run/node"
import { authenticator } from '~/server/auth.server';
import { google } from 'googleapis'
import { getSession } from "~/sessions/session.server";

const oauth2Client = new google.auth.OAuth2(
  "286626015732-f4db11irl7g5iaqb968umrv2f1o2r2rj.apps.googleusercontent.com",
  "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",
  "http://localhost:3000/google/callback"
);

const gmail = google.gmail({
  version: 'v1',
  auth: oauth2Client
});

const scopes = [
  'https://mail.google.com/',
];


export let loader: LoaderFunction = async ({ request }) => {
  console.log('Request URL:', request.url);

  const queryParams = new URL(request.url).searchParams;
  const code = queryParams.get('code');

  console.log('Query Parameters:', queryParams.toString());

  console.log('Code:', code);
  if (!code) {
    console.error('Missing "code" in request query:', request.url.search);
  }
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  const session = await getSession(request.headers.get("Cookie"));
  console.log(tokens)
  session.set("accessToken", tokens.access_token);
  session.set("refreshToken", tokens.refresh_token);
  session.set("scope", tokens.scope);
  session.set("tokenType", tokens.token_type);
  session.set("expiry_date", tokens.expiry_date);
  session.set("code", code);
  const success = 'Authentication successful'
  return {
    success: success,
    result: authenticator.authenticate('google', request, {
      successRedirect: '/leads',
      failureRedirect: '/login',
    }),
  };
};
