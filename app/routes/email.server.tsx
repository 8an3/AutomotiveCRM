import { google } from 'googleapis';
import { getSession, commitSession, destroySession } from '../sessions/auth-session.server'
import { prisma } from "~/libs";
import { model } from "~/models";
import { DataFunctionArgs } from '@remix-run/server-runtime';
import { useLoaderData } from '@remix-run/react';
import type { oauth2_v2 } from 'googleapis';
import { DataFunctionArgs, json, redirect, type LoaderFunction } from '@remix-run/node';
import { RefreshToken } from "~/services/google-auth.server";
import axios from 'axios';

const oauth2Client = new google.auth.OAuth2(
  "286626015732-f4db11irl7g5iaqb968umrv2f1o2r2rj.apps.googleusercontent.com",
  "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",
  "http://localhost:3000/google/callback"
);

const gmail = google.gmail({
  version: 'v1',
  auth: oauth2Client,
});
const API_KEY = 'AIzaSyCsE7VwbVNO4Yw6PxvAfx8YPuKSpY9mFGo'


export async function ensureClient(refreshTokens, request) {
  try {
    const refreshToken = await refreshAccessToken(refreshTokens)

    const { tokens } = refreshToken;
    console.log(refreshToken, 'refreshToken');
    console.log(tokens.access_token, 'access_token');


    let session = await getSession(request.headers.get("Cookie"));
    session.set("accessToken", tokens.access_token);
    const userRes = await gmail.users.getProfile({ userId: 'me' });
    console.log(userRes)
    if (!userRes) { console.log('no userRes') }

    oauth2Client.setCredentials({
      access_token: tokens?.access_token,
      refresh_token: refreshTokens
    });

    return { oauth2Client, headers: { "Set-Cookie": await commitSession(session) } };

  } catch (error) {
    console.error(error);
  } finally {
    // Add any cleanup or finalization logic here
  }
}


async function refreshAccessToken(refreshToken) {
  try {
    const response = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: "286626015732-f4db11irl7g5iaqb968umrv2f1o2r2rj.apps.googleusercontent.com",
      client_secret: "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",
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    });

    // Assuming the response contains the new access token
    const accessToken = response.data.access_token;

    // Log or handle the new access token as needed
    console.log('New Access Token:', accessToken);

    return { success: true, tokens: { access_token: accessToken } };
  } catch (error) {
    console.error('Error refreshing access token:', error.message);
    return { success: false, error: 'Error refreshing access token' };
  }
}


export async function GetUserEmails(oauth2Client: oauth2_v2.Oauth2) {
  const res = await gmail.users.messages.list({ userId: 'me' });
  console.log(res.data);
  return res;
}
export async function SetToUnread(messageId: string) {
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
export async function MoveEmail(oauth2Client: oauth2_v2.Oauth2, message, label: string) {
  const modifyRequest = {
    userId: 'me',
    id: message.id,
    resource: {
      addLabelIds: label,
    },
  };
  const res = await gmail.users.messages.modify(modifyRequest);
  console.log(res.data);
  return res;
}
export async function MoveToInbox(oauth2Client: oauth2_v2.Oauth2, message) {
  const modifyRequest = {
    userId: 'me',
    id: message.id,
    resource: {
      addLabelIds: ['INBOX'],
    },
  };
  const res = await gmail.users.messages.modify(modifyRequest);
  console.log(res.data);
  return res;
}
export async function SetToTrash2(oauth2Client: oauth2_v2.Oauth2, message) {
  const modifyRequest = {
    userId: 'me',
    id: message.id,
  };
  const res = await gmail.users.messages.trash(modifyRequest);
  console.log(res.data);
  return res;
}
export async function SaveDraft(oauth2Client: oauth2_v2.Oauth2, message, text) {
  const modifyRequest = {
    userId: 'me',
    id: message.id,
    key: API_KEY,
    message: {
      raw: text
    }
  }
  const res = await gmail.users.messages.modify(modifyRequest);
  console.log(res.data);
  return res;
}

export async function SetToRead(messageId: any) {
  console.log('set to read')
  const res = await gmail.users.messages.modify({
    userId: 'me',
    id: messageId,
    requestBody: {
      "removeLabelIds": [
        "UNREAD"
      ]
    },
  });
  console.log(res.data);
  return res;
}
export async function GetLabel(oauth2Client: any, label: string) {
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

export async function SendEmail(oauth2Client: any, user, to, subjectLine, body) {
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

export async function GetEmailDetails(oauth2Client: any, emailId: string) {
  const messages = await gmail.users.messages.get({
    userId: 'me',
    id: emailId,
    format: 'full',
    key: API_KEY,
  });
  return json({ messages })
}

// do not work
export async function GetEmailsFromFolder2(oauth2Client: any, label: string) {
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
export async function GetEmailsFromFolder(oauth2Client: any, label: string) {
  let fetchedEmails;

  console.log(label, 'label')
  try {
    async function getNewListData(label) {
      const response = await gmail.users.messages.list({
        userId: 'me',
        labelIds: [label],
        maxResults: 8,
        key: API_KEY,
      });
      return json({ response })
    }

    async function GetEmailDetails(emailId) {
      const messages = await gmail.users.messages.get({
        userId: 'me',
        id: emailId,
        format: 'full',
        key: API_KEY,
      });
      return json({ messages })
    }
    const newListData = await getNewListData;
    fetchedEmails = await Promise.all(newListData.messages.map(async (email) => {
      const emailDetails = await GetEmailDetails(email.id);
      const senderName = emailDetails.payload.headers.find(header => header.name === 'From').value;
      const nameMatch = senderName.match(/"([^"]+)"/);
      const nameWithoutQuotes = nameMatch ? nameMatch[1] : senderName;
      const emailWithoutQuotes = senderName.match(/<([^>]+)>/);
      const emailValue = emailWithoutQuotes ? emailWithoutQuotes[1] : '';
      const emailHeaderValue = emailDetails.payload.headers[1].value;
      const dateRegex = /\b(\d{1,2} [a-zA-Z]+ \d{4} \d{2}:\d{2}:\d{2} [-+]\d{4})\b/;
      const match = emailHeaderValue.match(dateRegex);
      const extractedName = nameWithoutQuotes.replace(/<[^>]+>/, '').trim();

      function getBodyData(emailDetails) {
        if (emailDetails.payload.parts) {
          const bodyData1 = emailDetails.payload.parts[1]?.body?.data;
          if (bodyData1) {
            return bodyData1;
          }
          const bodyData0 = emailDetails.payload.parts[0]?.body?.data;
          if (bodyData0) {
            return bodyData0;
          }
        }
        return emailDetails.payload.body?.data || '';
      }

      const bodyData = getBodyData(emailDetails);
      const body = atob(bodyData.replace(/-/g, '+').replace(/_/g, '/'))

      return {
        id: emailDetails.id,
        name: extractedName,
        secondName: senderName,
        subject: emailDetails.payload.headers.find(header => header.name === 'Subject').value,
        date: match[1],
        labels: emailDetails.labelIds,
        email: emailValue.trim(),
        snippet: emailDetails.snippet,
        body: body,
      };
    }));

    //console.log(fetchedEmails)
    setEmails(fetchedEmails)
    return fetchedEmails;


  } catch (error) {
    console.error('Error listing messages:', error);
  }
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
