import { Outlet, useLoaderData } from "@remix-run/react";
import { getSession } from '~/sessions/auth-session.server';
import { prisma } from "~/libs";
import { model } from "~/models";
import Sidebar from "~/components/shared/sidebar";
import { type LinksFunction, json, type LoaderFunction } from "@remix-run/node";
import NotificationSystem from "~/routes/__authorized/dealer/notifications";

import ChatApp from "~/components/sms/bkdonotuse";
import { useEffect } from 'react'
import axios from "axios";
import slider from '~/styles/slider.css'
import secondary from '~/styles/secondary.css'
import ChatChannel from '~/styles/ChatChannel.css'
import messageBubble from '~/styles/messageBubble.css'
import { GetUser } from "~/utils/loader.server";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: slider },
  { rel: "stylesheet", href: ChatChannel },
  { rel: "stylesheet", href: messageBubble },
  { rel: "stylesheet", href: secondary },

];

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
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")

  const user = await GetUser(email)
  const accountSid = 'AC9b5b398f427c9c925f18f3f1e204a8e2'
  const authToken = 'd38e2fd884be4196d0f6feb0b970f63f'
  const client = require('twilio')(accountSid, authToken);
  const username = 'skylerzanth'//localStorage.getItem("username") ?? "";
  const password = 'skylerzanth1234'//localStorage.getItem("password") ?? "";
  const proxyPhone = '+12176347250'
  let callToken;
  let newToken;
  if (username.length > 0 && password.length > 0) {
    callToken = await getToken(username, password)
      .then((token) => {
        //  console.log(token)
        newToken = token
      })
      .catch(() => {

      })
      .finally(() => {
      });
  }
  const firstTime = await prisma.twilioSMSDetails.findUnique({ where: { userEmail: user?.email } })

  let convoList = {}
  let conversationSid;
  let participantSid;
  let userSid;
  let conversationChatServiceSid;

  if (!firstTime) {
    function delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

    async function performOperations() {
      try {
        // Create a conversation
        const conversation = await client.conversations.v1.conversations.create({ friendlyName: 'My test' });
        const conversationSid = conversation.sid;

        // Fetch conversation details
        await delay(50);
        try {
          const fetchedConversation = await client.conversations.v1.conversations(conversationSid).fetch();
          conversationChatServiceSid = fetchedConversation.chatServiceSid;
        } catch (error) { console.error('Error fetching conversation:', error); }

        // Create a participant/customer
        await delay(50);
        try {
          const participant = await client.conversations.v1.conversations(conversationSid).participants.create({
            'messagingBinding.address': `+1${user?.phone}`, // customers number
            'messagingBinding.proxyAddress': proxyPhone,
          });
          participantSid = participant.sid;
        } catch (error) { console.error('Error creating participant:', error); }

        // Create a user // need tog et rid of this when when wqe use this to create convos
        await delay(50);
        try {
          const createdUser = await client.conversations.v1.users.create({ identity: `${username}` });
          userSid = createdUser.sid;
        } catch (error) { console.error('Error creating user:', error); }

        // Create a participant for the user/employee
        await delay(50);
        try {
          const userParticipant = await client.conversations.v1.conversations(conversationSid)
            .participants
            .create({ identity: `${username}` });
          userSid = userParticipant.sid
        } catch (error) { console.error('Error creating user:', error); }

        // List user conversations
        await delay(50);
        try {
          const userConversations = await client.conversations.v1.users(userSid).userConversations.list({ limit: 20 });
          convoList = userConversations; // Update convoList with the fetched conversations
          userConversations.forEach(u => console.log(u.friendlyName));
        } catch (error) { console.error('Error creating user:', error); }


      } catch (error) { console.error('Error performing operations:', error); }
    }

    // Call the function
    performOperations();

    await prisma.twilioSMSDetails.create({
      data: {
        conversationSid: conversationSid,
        participantSid: participantSid,
        userSid: userSid,
        username: username,
        userEmail: email,
        passClient: password,
        proxyPhone: proxyPhone,
      }
    })

  }
  let getConvos;

  if (!Array.isArray(convoList) || convoList.length === 0) {
    getConvos = await client.conversations.v1.users('skylerzanth').userConversations.list({ limit: 20 });
    // .then(userConversations => userConversations.forEach(u => console.log(u.friendlyName)))
    convoList = getConvos;
  }

  console.log(convoList, 'channels');
  const getTexts = await client.conversations.v1.conversations('CH4f08622d81c34b4ea947f8ea233148a5')
    .messages
    .list({ limit: 200 })

  return json({ convoList, callToken, username, newToken, user, password, getTexts })
}


export default function Quote() {
  const { username, password } = useLoaderData()

  // <Sidebar user = { user } />
  // <NotificationSystem notifications={notifications} />
  //
  useEffect(() => {
    localStorage.setItem("username", username);
    localStorage.setItem("password", password);

  }, []);
  return (
    <>
      <div className="socials">
        <Sidebar />
        <NotificationSystem />
        <Outlet />
      </div>
    </>
  );
}
