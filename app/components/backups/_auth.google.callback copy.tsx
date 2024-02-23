import { type LoaderFunction, type DataFunctionArgs, type LoaderArgs, redirect, createCookieSessionStorage, json } from "@remix-run/node"
//import { authenticator } from "~/services";

import { google } from 'googleapis'
import * as querystring from 'querystring';

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


export let loader: LoaderFunction = async ({ request, params }) => {
  /// console.log('Request URL:', request.url);

  // Access query parameters using request.url.searchParams
  const queryParams23 = new URL(request.url).searchParams;

  // Ensure that 'code' parameter is present
  const code23 = queryParams23.get('code')

  const queryParams = querystring.parse(request.url.split('?')[1]);
  const code = queryParams.code as string; // Type assertion here

  // console.log('Query Parameters:', queryParams.toString());

  // console.log('Code:', code);
  console.log('queryParams22:', queryParams);
  console.log('code66:', code);
  if (!code) {
    console.error('Missing "code" in request query:', request.url.search);
  }

  const { tokens } = await oauth2Client.getToken(code);
  await oauth2Client.setCredentials(tokens);

  const res = await gmail.users.messages.list({ userId: 'me' });
  console.log(res, '666');

  const session = await getSession(request.headers.get("Cookie"));
  console.log(tokens)
  session.set("accessToken", tokens.access_token);
  session.set("refreshToken", tokens.refresh_token);
  session.set("scope", tokens.scope);
  session.set("tokenType", tokens.token_type);
  session.set("expiry_date", tokens.expiry_date);
  session.set("code", code);
  const success = 'Authentication successful'
  try {
    // Commit the session and wait for it to complete
    const commitResult = await commitSession(session);

    // Return the JSON response with the success message and set-cookie header
    return json({ success }, {
      headers: {
        'Set-Cookie': commitResult,
      },
    });
  } catch (commitError) {
    console.error('Error committing session:', commitError);
    // Handle the error and return an appropriate response
    return json({ error: 'Failed to authenticate' }, { status: 500 });
  }
};

export let action: LoaderFunction = async ({ request }) => {
  const queryParams = querystring.parse(request.url.split('?')[1]);
  const code = queryParams.code as string; // Type assertion here
  console.log(code, 'code21')
  const { tokens } = await oauth2Client.getToken(code);
  await oauth2Client.setCredentials(tokens);
  const res = await gmail.users.messages.list({ userId: 'me' });
  console.log(res);

  // Call the main function here

  return redirect('/auth/success', 302); // Redirect to a success page
};






export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '_google_session', // use any name you want here
    sameSite: 'lax', // this helps with CSRF
    path: '/', // remember to add this so the cookie will work in all routes
    httpOnly: true, // for security reasons, make this cookie http only
    secrets: ['s3cr3t'], // replace this with an actual secret
    secure: process.env.NODE_ENV === 'production', // enable this in prod only
  },
})

const { getSession, commitSession, destroySession } = sessionStorage
