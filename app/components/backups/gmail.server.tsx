const redirect = require("@remix-run/node")
const { google } = require('googleapis');
const express = require('express');

const app = express();
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
const oauth2Client = new google.auth.OAuth2(
  "286626015732-f4db11irl7g5iaqb968umrv2f1o2r2rj.apps.googleusercontent.com",
  "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",
  "http://localhost:3000/auth/google/callback"
)
const gmail = google.gmail({
  version: 'v1',
  auth: oauth2Client // specify your API key here
});
const scopes = [
  'https://mail.google.com/',
];

app.get('/auth/google', (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes
  });

  // Redirect the user to the Google sign-in page
  res.redirect(url);
});
app.get('/auth/google/callback', async (req, res) => {
  const { code } = req.query;
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);

  // Call the main function here
  await main();

  res.send('Authentication successful');
});

async function main() {
  const res = await gmail.users.messages.list({ userId: 'me' });
  console.log(res)
  res.data.messages.forEach((message, index) => {
    console.log(`Message ${index + 1}: ID is ${message.id}`);
  });

};

/**
 * /auth/google/callback
 * // routes/auth/google.tsx

import { redirect, LoaderFunction } from '@remix-run/node';
import { google } from 'googleapis';
import { parse } from 'url';
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

    return redirect('/auth/success', 302);
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

/auth/google // routes/auth/google.tsx
import { LoaderFunction } from '@remix-run/node';
import { google } from 'googleapis';

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

export let loader: LoaderFunction = async ({ request }) => {
  try {
    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes
    });

    return {
      props: {
        url,
      },
    };
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

export default function AuthGoogle({ url }: { url: string }) {
  return (
    <div>
      <p>Click the button to initiate Google authentication:</p>
      <a href={url} target="_blank" rel="noopener noreferrer">
        Authenticate with Google
      </a>
    </div>
  );
}

 */
