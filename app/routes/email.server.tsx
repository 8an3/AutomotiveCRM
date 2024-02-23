import { google } from 'googleapis';
import { getSession, commitSession, destroySession } from '../sessions/auth-session.server'
import { prisma } from "~/libs";
import { model } from "~/models";
import { DataFunctionArgs } from '@remix-run/server-runtime';
import { useLoaderData } from '@remix-run/react';
import type { oauth2_v2 } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
  "286626015732-f4db11irl7g5iaqb968umrv2f1o2r2rj.apps.googleusercontent.com",
  "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",
  "http://localhost:3000/google/callback"
);

const gmail = google.gmail({
  version: 'v1',
  auth: oauth2Client,
});


export async function ensureClient(email: string, tokens: string) {
  let refreshToken = tokens;
  if (!refreshToken) {
    const newUser = await prisma.user.findUnique({
      where: {
        email: email
      }
    })
    refreshToken = newUser.refreshToken
  }
  oauth2Client.setCredentials({
    access_token: tokens,
    refresh_token: refreshToken
  });

  return oauth2Client;
}

export async function getUserEmails(oauth2Client: oauth2_v2.Oauth2) {
  const res = await gmail.users.messages.list({ userId: 'me' });
  console.log(res.data);
  return res;
}

export async function setToUnread(oauth2Client: oauth2_v2.Oauth2, messageId: string) {
  const modifyRequest = {
    userId: 'me',
    id: messageId,
    resource: {
      addLabelIds: ['UNREAD'],
    },
  };
  const res = await gmail.users.messages.modify(modifyRequest);
  console.log(res.data);
  return res;
}
export async function setToRead(oauth2Client: oauth2_v2.Oauth2, messageId: string) {
  const modifyRequest = {
    userId: 'me',
    id: messageId,
    resource: {
      removeLabelIds: ['UNREAD'],
    },
  };
  const res = await gmail.users.messages.modify(modifyRequest);
  console.log(res.data);
  return res;
}
export async function getLabel(oauth2Client: oauth2_v2.Oauth2, label) {
  console.log(label, 'label')
  try {
    const res = await gmail.users.messages.list({
      userId: 'me',
      labelIds: [label]
    });
    console.log(res.data);
    return res;
  } catch (error) {
    console.error('Error listing messages:', error);
  }
}

export async function sendEmail(oauth2Client: oauth2_v2.Oauth2, user, to, subjectLine, body) {
  const subject = subjectLine;
  const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
  const messageParts = [
    `From: ${user.firstName} ${user.lastName} <${user.email}>`,
    `To: <${to}>`,
    `Content-Type: text/html; charset=utf-8`,
    `MIME-Version: 1.0`,
    ` Subject: ${subjectLine}`,
    '',
    `${body}`,
  ];
  const message = messageParts.join('\n');
  const encodedMessage = Buffer.from(message)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
  const res = await gmail.users.messages.send({
    userId: 'me',
    requestBody: {
      raw: encodedMessage,
    },
  });
  console.log(res.data);
  return res.data;
}

/**
 *
 *
 *
export async function loader({ params, request }: DataFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")
  const API_KEY = 'AIzaSyCsE7VwbVNO4Yw6PxvAfx8YPuKSpY9mFGo'

  const user = await model.user.query.getForSession({ email: email });
  const tokens = session.get("accessToken")
  let refreshToken
  refreshToken = session.get("refreshToken")
  if (!refreshToken) {
    const newUser = await prisma.user.findUnique({
      where: {
        email: user.email
      }
    })
    refreshToken = newUser.refreshToken
  }
  oauth2Client.setCredentials({
    access_token: tokens,
    refresh_token: refreshToken
  });

  const gmail = google.gmail({
    version: 'v1',
    auth: oauth2Client,
  });


  const res = await gmail.users.messages.list({ userId: 'me' });
  console.log(res.data);
  return res
}

export async function action({ params, request }: DataFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")
  const formPayload = Object.fromEntries(await request.formData());

  const API_KEY = 'AIzaSyCsE7VwbVNO4Yw6PxvAfx8YPuKSpY9mFGo'

  const user = await model.user.query.getForSession({ email: email });
  const tokens = session.get("accessToken")
  let refreshToken
  refreshToken = session.get("refreshToken")
  if (!refreshToken) {
    const newUser = await prisma.user.findUnique({
      where: {
        email: user.email
      }
    })
    refreshToken = newUser.refreshToken
  }
  oauth2Client.setCredentials({
    access_token: tokens,
    refresh_token: refreshToken
  });

  const gmail = google.gmail({
    version: 'v1',
    auth: oauth2Client,
  });

  const intent = formPayload.intent

  if (intent === 'listMessages') {
    const res = await gmail.users.messages.list({ userId: 'me' });
    console.log(res.data);
    return res
  }

}
 */
