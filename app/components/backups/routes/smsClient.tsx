
import React, { useEffect, useRef, useState } from "react";
import ChatChannel from "~/components/sms/ChatChannel";
import ChannelsList from "~/components/sms/ChannelList";
import { Loader2 } from "../icons";
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
import { json, type LoaderFunction } from '@remix-run/node';
import { GetUser } from "~/utils/loader.server";
import { prisma } from "~/libs";
import { model } from "../models";
import { getSession } from "~/sessions/auth-session.server";


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
        newToken = token
      })
      .catch(() => {
        localStorage.setItem("username", username);
        localStorage.setItem("password", password);
      })
      .finally(() => {
      });
  }

  //const remove2 = await client.conversations.v1.conversations('CHc6c6b5b15b794513b2b5c5d2762de82b').remove();
  const remove1 = await client.conversations.v1.conversations('CH836d9332659e42e9a455e7d556d73458').remove();
  return json({ remove1 })
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



/**

export default function ChatApp() {
  const { convoList, callToken, username, newToken } = useLoaderData()
  const { user } = useLoaderData()
  const [name, setName] = useState(username);
  const [loggedIn, setLoggedIn] = useState(user.email);
  const [token, setToken] = useState(newToken);
  const [statusString, setStatusString] = useState("Fetching credentials…");
  const [chatReady, setChatReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [channels, setChannels] = useState(convoList);
  const [selectedChannelSid, setSelectedChannelSid] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [client, setClient] = useState();
  const [currentConversation, setCurrentConversation] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [message, setMessage] = useState('');

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
  /** async function addConversation(
     name: string,
     updateParticipants: (participants: Participant[], sid: string) => void,
     client?: Client,
   ): Promise<Conversation> {
     if (client === undefined) {
       throw new Error(
         "Client is suddenly undefined, are you sure everything is ok?"
       );
     }

     if (name.length === 0) {
       throw new Error("Conversation name is empty");
     }

     try {
       const conversation = await client.createConversation({
         friendlyName: name,
       });
       await conversation.join();

       const participants = await conversation.getParticipants();
       updateParticipants(participants, conversation.sid);


       return conversation;
     } catch (e) {
       console.log(e.message,);
       throw e;
     }
   }


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
            setChatReady(false,)
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
  if (selectedChannel) {
    channelContent = (
      <ChatChannel channelProxy={selectedChannel} myIdentity={name} />
    );
  } else if (statusString !== "success") {
    channelContent = "Loading your chat!";

  } else {
    channelContent = "";
  }

  if (loggedIn) {
    return (
      <div className="chat-window-wrapper text-white">
        <div className="chat-window-container">
          <div style={{ display: "flex", alignItems: "center", padding: 0 }}>
            <div
              style={{
                maxWidth: "250px",
                width: "100%",
                display: "flex",
                alignItems: "center",
              }}
            >
              <div style={{ paddingRight: "0", display: "flex" }}>


              </div>
              <div>
                <strong style={{ color: "white" }}>Conversations</strong>
              </div>
            </div>
            <div style={{ display: "flex", width: "100%" }}>
              <div>
                <strong style={{ color: "white" }}>
                  {selectedChannel &&
                    (selectedChannel.friendlyName || selectedChannel.sid)}
                </strong>
              </div>
              <div style={{ float: "right", marginLeft: "auto" }}>
                <span style={{ color: "white" }}>{` ${statusString}`}</span>
              </div>
              <div>

              </div>
            </div>
          </div>
          <div style={{ display: "flex" }}>
            <div style={{ width: 250, backgroundColor: "#fff" }}>
              <ChannelsList
                channels={channels}
                selectedChannelSid={selectedChannelSid}
                onChannelClick={(item) => {
                  setSelectedChannelSid(item.sid);
                }}
              />
            </div>
            <div  >
              <div id="SelectedChannel">{channelContent}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <Loader2 className="animate-spin" />;
}<div className="bg-black border border-[#3b3b3b] mt-[60px]">
      <div className="w-[30%] border !border-[#3b3b3b]" >

      </div>
      <div className="w-[70%] border !border-[#3b3b3b]">

      </div>
    </div> */
