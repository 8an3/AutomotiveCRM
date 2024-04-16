import type { LoaderFunction } from '@remix-run/node';
import { useEffect } from 'react';
import { model } from '~/models';
import { getSession } from '~/sessions/auth-session.server';
import { prisma } from "~/libs";

async function SaveToLocal(convoId) {
  useEffect(() => {
    window.localStorage.setItem("convoId", convoId);
  }, []);
}
async function getToken(
  username: string,
  password: string
): Promise<string> {
  const requestAddress = 'https://dsatokenservice-4995.twil.io/token-service'
  if (!requestAddress) {
    throw new Error(
      "REACT_APP_ACCESS_TOKEN_SERVICE_URL is not configured, cannot login"
    );
  }

  try {
    const response = await axios.get(requestAddress, {
      params: { identity: 'skylerzanth', password: 'skylerzanth1234' },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      throw new Error(error.response.data ?? "Authentication error.");
    }

    console.error(`ERROR received from ${requestAddress}: ${error}\n`);
    throw new Error(`ERROR received from ${requestAddress}: ${error}\n`);
  }
}

export async function loader({ request, params }: LoaderFunction) {
  const session2 = await getSession(request.headers.get("Cookie"));
  const email = session2.get("email")

  const user = await GetUser(email)
  if (!user) { redirect('/login') }
  // const { convoId } = params
  const url = new URL(request.url);
  const pathSegments = url.pathname.split('/');
  const convoId = pathSegments[pathSegments.length - 1];
  console.log(convoId)
  const accountSid = 'AC9b5b398f427c9c925f18f3f1e204a8e2'
  const authToken = 'd38e2fd884be4196d0f6feb0b970f63f'
  const client = require('twilio')(accountSid, authToken);
  const username = 'skylerzanth'//localStorage.getItem("username") ?? "";
  const password = 'skylerzanth1234'//localStorage.getItem("password") ?? "";
  let newToken;

  const callToken = await getToken(username, password)
    .then((token) => {
      //  console.log(token)
      newToken = token
    }).catch(() => {

    })
    .finally(() => {
    });
  const token = callToken
  const convoMessages = await client.conversations.v1.conversations(convoId)
    .messages
    .list({ limit: 50 })
    .then(messages => messages.forEach(m => console.log(m.sid)))

  const result = await prisma.getConversation.create({
    data: {
      jsonData: convoMessages,
    },
  });
  return result
}
