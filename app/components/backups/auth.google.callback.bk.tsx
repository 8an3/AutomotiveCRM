// routes/auth/google.tsx
import { getSession, commitSession, } from '../../sessions/session.server'
import { redirect, type LoaderFunction, ActionArgs, json } from '@remix-run/node';
import { google } from 'googleapis';
import { badRequest, forbidden } from 'remix-utils';
import { parse } from 'url';
import { prisma } from '~/libs';
import { model } from '~/models';
import { schemaUserLogin } from '~/schemas';
import { authenticator } from '~/services/auth-service.server';

const oauth2Client = new google.auth.OAuth2(
  "286626015732-f4db11irl7g5iaqb968umrv2f1o2r2rj.apps.googleusercontent.com",
  "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",
  "http://localhost:30/auth/google/callback"
);

const gmail = google.gmail({
  version: 'v1',
  auth: oauth2Client
});

const scopes = [
  'https://mail.google.com/',
];


export let loader: LoaderFunction = async ({ request }) => {
  try {
    console.log('Request URL:', request.url);

    const queryParams = new URL(request.url).searchParams;
    const code = queryParams.get('code');

    console.log('Query Parameters:', queryParams.toString());

    console.log('Code:', code);


    if (!code) {
      console.error('Missing "code" in request query:', request.url.search);
      return redirect('/auth/error', 302); // Redirect to an error page
    }
    // https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount?access_type=offline&scope=https%3A%2F%2Fmail.google.com%2F&response_type=code&client_id=286626015732-f4db11irl7g5iaqb968umrv2f1o2r2rj.apps.googleusercontent.com&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fgoogle%2Fcallback&service=lso&o2v=2&theme=glif&flowName=GeneralOAuthFlow
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Call the main function here
    // await main();

    const res = await gmail.users.messages.list({ userId: 'me' });
    console.log(res);

    if (res.data && res.data.messages) {
      res.data.messages.forEach((message, index) => {
        console.log(`Message ${index + 1}: ID is ${message.id}`);
      });
    } else {
      console.error('No messages found in the response:', res.data);
    }
    const session = await getSession(request.headers.get("Cookie"));
    console.log(tokens)
    session.set("accessToken", tokens.access_token);
    session.set("refreshToken", tokens.refresh_token);
    session.set("scope", tokens.scope);
    session.set("tokenType", tokens.token_type);
    session.set("expiry_date", tokens.expiry_date);
    session.set("code", code);
    const waittoken = await commitSession(session)

    return waittoken
  } catch (error) {
    console.error('Error in loader:', error);
  }
};


export let action: LoaderFunction = async ({ request }) => {
  const { code } = request.query;
  const { tokens } = await oauth2Client.getToken(code);
  await oauth2Client.setCredentials(tokens);

  // Call the main function here
  await main();

  return redirect('/auth/success', 302); // Redirect to a success page
};

async function main() {
  const res = await gmail.users.messages.list({ userId: 'me' });
  console.log(res);
  res.data.messages.forEach((message, index) => {
    console.log(`Message ${index + 1}: ID is ${message.id}`);
  });
}

/**
    const response = await gmail.users.getProfile({ userId: 'me' });
    console.log(response)
    console.log(response.data.emailAddress)
    const email = response.data.emailAddress
    const formData = {
      email: email,
      intent: 'submit'
    }
    const submission = parse(formData, { schema: schemaUserLogin });
    if (!submission.value || submission.intent !== "submit") {
      return badRequest(submission);
    }
    const result = await prisma.user.findUnique({
      where: {
        email: email
      }
    });
    // Use custom error for Conform submission
    if (!result) {
      return forbidden({ ...submission, error: 'Could not find user!' });
    }
    await result
    await authenticator.authenticate("google", request, {
      successRedirect: "/checksubscription",
      failureRedirect: "/login",
    }); */
