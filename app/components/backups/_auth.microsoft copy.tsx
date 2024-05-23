// app/routes/auth/microsoft.tsx
import type { ActionArgs } from "@remix-run/node";
import { authenticator } from "~/services/auth";
import { json, redirect } from "@remix-run/node";
import { getSession, commitSession, authSessionStorage } from '../~/sessions/auth-session.server'
// https//learn.microsoft.com/en-us/entra/identity-platform/app-sign-in-flow
// https://learn.microsoft.com/en-us/entra/identity-platform/v2-oauth2-on-behalf-of-flow
export const loader = () => redirect("/login");


export const action = async ({ request }: ActionArgs) => {
  const sessionData = await getSession(request.headers.get("Cookie"));

  //const session = await authenticator.authenticate("microsoft", request, {
  //  successRedirect: "/dealer/checksubscription",
  //  failureRedirect: "/login",
  //  headers: session
  // })
  const client_id = "0fa1346a-ab27-4b54-bffd-e76e9882fcfe",
  const clientSecret = "rut8Q~s5LpXMnEjujrxkcJs9H3KpUzxO~LfAOc-D",
  const redirect_uri = "http://localhost:3000/microsoft/callback",
  const tenantId = "fa812bd2-3d1f-455b-9ce5-4bfd0a4dfba6",
  const scope = ['openid', 'profile', 'email', 'offline_access'],
  const response_type = "login_prompt"
  const state = '123445'
  let url = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize?client_id=${client_id}&response_type=${response_type}&redirect_uri=${redirect_uri}&clientSecret=${clientSecret}&scope=${scope}&state=${state}`;

  return url
};


/*
export const action = async ({ request }: ActionArgs) => {
  const sessionData = await getSession(request.headers.get("Cookie"));

  const session = await authenticator.authenticate("microsoft", request, {
    successRedirect: "/dealer/checksubscription",
    failureRedirect: "/login",
    //  headers: session

  })
  return json({ session }, {
    headers: {
      'X-Frame-Options': 'SAMEORIGIN',
      'Referrer-Policy': 'same-origin'
    }
  });
};

/*
const MICRO_APP_ID = process.env.MICRO_APP_ID;
const MICRO_TENANT_ID = process.env.MICRO_TENANT_ID; //'fa812bd2-3d1f-455b-9ce5-4bfd0a4dfba6' //


export let action: LoaderFunction = async ({ request, response, }) => {
  try {
    const url = await FirstSignIn(MSAL)
    console.log(url)
    return redirect('/microsoft/callback')

  } catch (error) {
    console.error('Error in loader:', error);
    return {
      status: 500,
      props: {
        error: 'Internal Server Error',
      },
    };
  }
};


/**old sign in \
 *
 *
 *
 *  const msal = MSAL
  const session = await getSession(request.headers.get("Cookie"));

  const email = session.get("email")

  let user = await GetUser(email)
  user = await SignIn()

  if (user) {
    console.log('1')

    const check = await CheckUser(user)
    console.log('2')

    if (!check) {
      console.log('3')
      return redirect('/microsoft/callback')
    }
    console.log('4')
    return redirect('/microsoft/callback')
  }
  else {
    console.log('5')
    return null
  }
 */

/**
 *
 *
 *
 *
 *
 *
let url = `https://login.microsoftonline.com/${MICRO_TENANT_ID}/oauth2/v2.0/authorize?client_id=${params.client_id}&response_type=${params.response_type}&redirect_uri=${params.redirect_uri}&response_mode=${params.response_mode}&scope=${params.scope}&state=${params.state}`;

  try {
    const response = await fetch(`https://login.microsoftonline.com/${MICRO_TENANT_ID}/oauth2/v2.0/authorize?client_id=${params.client_id}&response_type=${params.response_type}&redirect_uri=${params.redirect_uri}&response_mode=${params.response_mode}&scope=${params.scope}&state=${params.state}`, {
      method: 'GET',
    })


 if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    console.log(response.status, response)
    const responseUrl = response.url;
    const urlObject = new URL(responseUrl);
    const code = urlObject.searchParams.get('code');

    if (code) {
      const session = await getSession(request.headers.get("Cookie"));
      session.set("accessCode", code);
      await commitSession(session);

      console.log('Authorization code:', code);

      // Construct a successful response with appropriate headers
      const headers = { "Set-Cookie": await commitSession(session) };
      return new Response('Authorization code saved', { status: 200, headers });
    } else {
      console.log('Authorization code not found in URL');
      // Return a response indicating that the authorization code was not found
      return new Response('Authorization code not found', { status: 404 });
    }
  } catch (error) {
    console.error('Error:', error);
    // Return a response indicating an internal server error
    return new Response('Internal server error', { status: 500 });
  }










import { type LoaderFunction, redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { google } from 'googleapis';
import EmailClient from './email';

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

const scopes = [
  'https://mail.google.com/',
];

export let action: LoaderFunction = async ({ request }) => {
  try {
    const url = oauth2Client.generateAuthUrl({
      scope: scopes,
      email: EmailClient,
    });
    console.log(url)
    return redirect(url)

  } catch (error) {
    console.error('Error in loader:', error);
    return {
      status: 500,
      props: {
        error: 'Internal Server Error',
      },
    };
  }
};





var microRequest = {
  scopes: [
    "User.Read",
    "User.ReadWrite",
    "mailboxsettings.read",
    "calendars.readwrite",
    "mail.readwrite",
    "Mail.Send",
    "Notes.ReadWrite.All",
  ],
};

export const loader = () => redirect("/login");

export const action = async ({ request }: ActionArgs) => {

  const msalInstance = await MSALInstance();
  let session = await getSession(request.headers.get("Cookie"));

  await msalInstance.acquireTokenSilent(microRequest).then(async tokenResponse => {
    session.set("accessToken", tokenResponse.accessToken);
    var headers = new Headers();
    var bearer = "Bearer " + tokenResponse.accessToken;
    headers.append("Authorization", bearer);
    var options = {
      method: "GET",
      headers: headers
    };
    var graphEndpoint = "https://graph.microsoft.com/v1.0/me";

    fetch(graphEndpoint, options)
      .then(async resp => {
        const userData = await resp.json();
        //do something with response
        const email = userData.email
        const name = userData.name
        session.set("name", name);
        session.set("email", email);
        console.log(resp, email, name, '_auth.microsoft')

        let user = await GetUser(email)
        if (user) {
          await prisma.user.update({ where: { email: email }, data: { refreshToken: tokenResponse.accessToken } })
        }


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


      }).catch(async (error) => {
        if (error instanceof InteractionRequiredAuthError) {
          // fallback to interaction when silent call fails
          return msalInstance.acquireTokenPopup(microRequest);
        }

        // handle other errors
      })
    return redirect('/checksubscription', {
      headers: {
        "Set-Cookie":
          await commitSession(session) //&&
        // await cookies

      },
    });
  })
  // return authenticator.authenticate("microsoft", request);
};
*/
