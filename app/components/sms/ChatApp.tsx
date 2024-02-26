
import React, { useEffect, useRef, useState } from "react";
import ChatChannel from "./ChatChannel";
import ChannelsList from "./ChannelList";
import { Loader2 } from "../../icons";
import { Outlet, useLoaderData, useNavigation, Form } from '@remix-run/react';
import axios from "axios";
import {
  Message,
  Conversation,
  Participant,
  Client,
  ConnectionState,
  Paginator,
} from "@twilio/conversations";
import { json, type LinksFunction, type LoaderFunction } from '@remix-run/node';
import { prisma } from "../../libs";
import { model } from "../../models";
import { getSession } from "~/sessions/auth-session.server";
import slider from '~/styles/slider.css'
import secondary from '~/styles/secondary.css'
import ChatChannelw from '~/styles/ChatChannel.css'
import messageBubble from '~/styles/messageBubble.css'

import { MessageSquarePlus } from 'lucide-react';
import { Badge, Button, Input, Label, Select, SelectContent, SelectGroup, SelectLabel, SelectItem, SelectTrigger, SelectValue, Tabs, TabsContent, TabsList, TabsTrigger, ButtonLoading } from "~/components/ui";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: slider },
  { rel: "stylesheet", href: secondary },
  { rel: "stylesheet", href: ChatChannelw },
  { rel: "stylesheet", href: messageBubble },
];



async function LetsTry(selectedChannelSid) {
  const accountSid = 'AC9b5b398f427c9c925f18f3f1e204a8e2'
  const authToken = 'd38e2fd884be4196d0f6feb0b970f63f'
  const client = require('twilio')(accountSid, authToken);
  const saveMessages = await client.conversations.v1.conversations(selectedChannelSid).messages.list({ limit: 30 });
  // .then(messages => messages.forEach(m => console.log(m.sid)));
  console.log(saveMessages, 'messages')
  return saveMessages
}

export default function ChatApp() {
  const { convoList, callToken, username, newToken, user, getTexts } = useLoaderData()

  const [name, setName] = useState(username);
  const [loggedIn, setLoggedIn] = useState(user.email);
  const [token, setToken] = useState(newToken);
  const [statusString, setStatusString] = useState("Fetching credentials…");
  const [chatReady, setChatReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [channels, setChannels] = useState(Array.from({ length: 20 }, (_, index) => convoList[index % convoList.length]));
  const [selectedChannelSid, setSelectedChannelSid] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [client, setClient] = useState();
  const [currentConversation, setCurrentConversation] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([]);

  const chatClientRef = useRef(null);
  const logOut = (event) => {
    if (event) {
      event.preventDefault();
    }
    setName("");
    setLoggedIn(false);
    setToken("");
    setChatReady(false);
    setChannels([]);
    setNewMessage("");
    chatClientRef.current && chatClientRef.current.shutdown();
  };

  const selectedChannel = Array.isArray(channels) ? channels.find((it) => it.sid === selectedChannelSid) : null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Assuming LetsTry returns a Promise
        const result = await LetsTry(selectedChannelSid);
        // Assuming the result is an array, otherwise adjust accordingly
        const filteredResults = result.filter(message => message.conversationSid === selectedChannelSid);
        setMessages(filteredResults);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (selectedChannelSid) {
      fetchData();
    }
  }, [selectedChannelSid]);


  console.log(token, 'tokenteokejkoer')
  useEffect(() => {

    const initConversations = async () => {
      const token = callToken

      setTimeout(() => {
        const client = new Client(token);
        setClient(client);
        setStatusString("Connecting to Twilio…")

        client.on("connectionStateChanged", (state) => {
          if (state === "connecting") {
            setStatusString("Connecting to Twilio…")
            setStatus("default")
          }
          if (state === "connected") {
            setStatusString("You are connected.")
            setStatus("success")
            setLoading(false)
            setLoggedIn(user.email)
          }
          if (state === "disconnecting") {
            setStatusString("Disconnecting from Twilio…")
            setChatReady(false)
            setStatus("default")
          }
          if (state === "disconnected") {
            setStatusString("Disconnected.",)
            setChatReady(false)
            setStatus("warning")
          }
          if (state === "denied") {
            setStatusString("Failed to connect.",)
            setChatReady(false)
            setStatus("error")
          }
        });

        client.on('tokenAboutToExpire', () => {
          console.log('About to expire');
          const username = 'skylerzanth'//localStorage.getItem("username") ?? "";
          const password = 'skylerzanth1234'//localStorage.getItem("password") ?? "";
          setName(username)
          if (username.length > 0 && password.length > 0) {
            getToken(username, password)
              .then((token) => {
                // login(token);
                setToken(token)
              })
              .catch(() => {
                localStorage.setItem("username", username);
                localStorage.setItem("password", password);
              })
              .finally(() => {
                setLoading(false);
                setStatusString("Fetching credentials…");
              });
          }
        });
        client.on('tokenExpired', () => {
          console.log('Token expired');
          client.removeAllListeners();
          const client2 = new Client(token);
          setClient(client2);
          setStatusString("Connecting to Twilio…")
        });
        client.on("conversationJoined", (conversation) => {
          setChannels((prevChannels) => [...prevChannels, conversation]);
        });
        client.on("conversationLeft", (thisConversation) => {
          setChannels((prevChannels) =>
            prevChannels.filter((it) => it !== thisConversation)
          );
        });
        client.on('typingStarted', (user) => {
          console.log('typing..', user);
          if (user.conversation.sid === currentConversation.sid) setIsTyping(true);
        });
        client.on('typingEnded', (user) => {
          console.log('typing end..', user);
          if (user.conversation.sid === currentConversation.sid) setIsTyping(false);
        });
      }, 10);

    }
    initConversations()
    setChatReady(true);
  }, []);

  let channelContent;
  if (selectedChannelSid) {
    channelContent = (
      <ChatChannel channelProxy={selectedChannel} myIdentity={name} messages={messages} />
    );
  } else if (statusString !== "success") {
    channelContent = "Loading your chat!";

  } else {
    channelContent = "";
  }

  const filterdMessages = [
    {
      accountSid: 'AC9b5b398f427c9c925f18f3f1e204a8e2',
      conversationSid: 'CH4f08622d81c34b4ea947f8ea233148a5',
      sid: 'IM9eea9b7285c14f008bbb6f84cf84026c',
      index: 0,
      author: '+16138980992',
      body: 'Yo',
      media: null,
      attributes: '{}',
      participantSid: 'MB36eb650fefb04c1d806c4d31c3396a02',
      dateCreated: '2024-02 - 26T00:00: 23.000Z',
      dateUpdated: '2024-02 - 26T00:00: 23.000Z',
      url: 'https://conversations.twilio.com/v1/Conversations/CH4f08622d81c34b4ea947f8ea233148a5/Messages/IM9eea9b7285c14f008bbb6f84cf84026c',
      delivery: null,
      links: {
        delivery_receipts: 'https://conversations.twilio.com/v1/Conversations/CH4f08622d81c34b4ea947f8ea233148a5/Messages/IM9eea9b7285c14f008bbb6f84cf84026c/Receipts',
        channel_metadata: 'https://conversations.twilio.com/v1/Conversations/CH4f08622d81c34b4ea947f8ea233148a5/Messages/IM9eea9b7285c14f008bbb6f84cf84026c/ChannelMetadata'
      },
      contentSid: null
    }
  ]
  if (loggedIn) {
    return (
      <div className="mx-auto mt-[65px] flex h-[93%] w-[95%] border border-[#3b3b3b] bg-black">
        <div className="grid h-[100%] w-1/4 max-w-[25%] grid-cols-1 space-y-2 border border-[#ffffff4d]">
          <div className="flex justify-center border-b border-r border-[#3b3b3b] ">

            <div className="flex items-center justify-center border-b border-[#3b3b3b]">
              <Tabs defaultValue="New Chat" className="m-2 w-[95%]">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger onClick={() => {

                  }} value="New Chat">
                    <p className=" text-[#fff]">
                      New Chat
                    </p>
                  </TabsTrigger>
                  <TabsTrigger
                    onClick={() => {

                    }}
                    value="SMS">
                    SMS
                  </TabsTrigger>
                  <TabsTrigger
                    onClick={() => {

                    }}
                    value="Staff Chat">
                    Staff Chat
                  </TabsTrigger>
                  <TabsTrigger
                    onClick={() => {

                    }}
                    value="Facebook">
                    Facebook
                  </TabsTrigger>

                </TabsList>
              </Tabs>
            </div>
          </div>
          <div className="overflow-y-scroll h-[95%] " >
            <ChannelsList
              channels={channels}
              selectedChannelSid={selectedChannelSid}
              onChannelClick={(item) => {
                setSelectedChannelSid(item);
              }}
              messages={filterdMessages}
            />
          </div>

        </div>
        <div className="grid h-[100%] w-[75%] max-w-[75%] grid-cols-1 space-y-2 border border-[#ffffff4d]">
          <div >{channelContent}</div>
          <strong >
            {selectedChannel &&
              (selectedChannel.friendlyName || selectedChannel.sid)}
          </strong>
          <span>{` ${statusString}`}</span>
        </div>
      </div>
    );
  }

  return <Loader2 className="animate-spin" />;
}

/** <div className="bg-black border border-[#3b3b3b] mt-[60px]">
      <div className="w-[30%] border !border-[#3b3b3b]" >

      </div>
      <div className="w-[70%] border !border-[#3b3b3b]">

      </div>
    </div> */
