import { type LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
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
