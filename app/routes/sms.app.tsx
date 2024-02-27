
import React, { useEffect, useRef, useState } from "react";
import { Loader2 } from "../icons";
import { Outlet, useFetcher, useLoaderData, useActionData, Form, useLocation, useSubmit } from '@remix-run/react';
import { Textarea } from '../ui/Textarea';
import { setMessages, setSelectedChannel } from '~/actions/actions';
import axios from "axios";
import { Message, Conversation, Participant, Client, ConnectionState, Paginator, } from "@twilio/conversations";
import { json, type LinksFunction, type LoaderFunction, type ActionFunction, } from '@remix-run/node';
import { prisma } from "../libs";
import { model } from "../models";
import { getSession } from "~/sessions/auth-session.server";
import slider from '~/styles/slider.css'
import secondary from '~/styles/secondary.css'
import ChatChannelw from '~/styles/ChatChannel.css'
import messageBubble from '~/styles/messageBubble.css'
import ChatMessages from '../components/sms/ChatMessage';
import { MessageSquarePlus } from 'lucide-react';
import { Badge, Button, Input, Label, Select, SelectContent, SelectGroup, SelectLabel, SelectItem, SelectTrigger, SelectValue, Tabs, TabsContent, TabsList, TabsTrigger, ButtonLoading } from "~/components/ui";
import financeFormSchema from "./overviewUtils/financeFormSchema";
import { useDispatch, connect, useSelector } from 'react-redux';


export const links: LinksFunction = () => [
  { rel: "stylesheet", href: slider },
  { rel: "stylesheet", href: secondary },
  { rel: "stylesheet", href: ChatChannelw },
  { rel: "stylesheet", href: messageBubble },
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
  const user = await model.user.query.getForSession({ email: email });
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
  const conversation = await prisma.getConversation.findFirst({
    where: { userEmail: user.email }
  });
  let getTexts
  if (conversation) {
    const storeObject = JSON.parse(conversation.jsonData);
    console.log(storeObject);

    // Extract conversationSid from the first object in the array
    const conversationSid = storeObject[0].conversationSid;

    if (conversationSid) {
      console.log(conversationSid, 'channels');
      getTexts = await client.conversations.v1.conversations(conversationSid)
        .messages
        .list({ limit: 200 });
    } else {
      console.log('conversationSid is undefined');
    }
  }

  return json({ convoList, callToken, username, newToken, user, password, getTexts })
}

export async function action({ request, }: ActionFunction) {
  const formPayload = Object.fromEntries(await request.formData())
  const formData = financeFormSchema.parse(formPayload);
  const session2 = await getSession(request.headers.get("Cookie"));
  const email = session2.get("email")
  const accountSid = 'AC9b5b398f427c9c925f18f3f1e204a8e2'
  const authToken = 'd38e2fd884be4196d0f6feb0b970f63f'
  const client = require('twilio')(accountSid, authToken);
  const user = await model.user.query.getForSession({ email: email });
  if (!user) { redirect('/login') }
  const intent = formData.intent
  if (intent === 'getConversation') {
    const sid = formData.conversationSid
    const convoId = sid
    const GetConvo = await client.conversations.v1.conversations(convoId).messages.list({ limit: 20 })


    console.log(GetConvo, email, 'what isa this ')
    const result = await prisma.getConversation.create({
      data: {
        jsonData: JSON.stringify(GetConvo),
        userEmail: email,
      },
    });
    return json({ result });
  }

  return null
}

async function LetsTry(selectedChannelSid) {
  const accountSid = 'AC9b5b398f427c9c925f18f3f1e204a8e2'
  const authToken = 'd38e2fd884be4196d0f6feb0b970f63f'
  const client = require('twilio')(accountSid, authToken);
  const saveMessages = await client.conversations.v1.conversations(selectedChannelSid).messages.list({ limit: 30 });
  // .then(messages => messages.forEach(m => console.log(m.sid)));
  console.log(saveMessages, 'messages')
  return saveMessages
}

const ChatApp = () => {
  const { convoList, callToken, username, newToken, user, getTexts, } = useLoaderData()
  const { getTemplates, conversations, latestNotes } = useLoaderData();
  const [templates, setTemplates] = useState(getTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const dispatch = useDispatch();
  const data = useActionData<typeof action>();
  const messages2 = useSelector((state) => state.messages);
  const selectedChannelSid2 = useSelector((state) => state.selectedChannelSid);
  const fetcher = useFetcher()
  const submit = useSubmit();
  const TextareaRef = React.useRef<HTMLTextareaElement>(null);
  const handleChange = (event) => {
    const selectedTemplate = templates.find(template => template.title === event.target.value);
    setSelectedTemplate(selectedTemplate);
  };

  useEffect(() => {
    if (selectedTemplate) {
      // Assuming you want to update the newMessage state
      setState((prev) => ({ ...prev, newMessage: selectedTemplate.body }));
    }
  }, [selectedTemplate]);
  const [name, setName] = useState(username);
  const [loggedIn, setLoggedIn] = useState(user.email);
  const [token, setToken] = useState(newToken);
  const [statusString, setStatusString] = useState("Fetching credentials…");
  const [chatReady, setChatReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [channels, setChannels] = useState(Array.from({ length: 20 }, (_, index) => convoList[index % convoList.length]));
  const [selectedChannelSid, setSelectedChannelSid] = useState(selectedChannelSid2 || null);
  const [newMessage, setNewMessage] = useState("");
  const [client, setClient] = useState();
  const [currentConversation, setCurrentConversation] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState(getTexts);
  const [message, setMessage] = useState(messages2 || null);
  const [messagedB, setMessagedB] = useState(getTexts);



  const $form = useRef<HTMLFormElement>(null);
  const { key } = useLocation();
  useEffect(
    function clearFormOnSubmit() {
      $form.current?.reset();
    },
    [key],
  );
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


  useEffect(() => {
    if (selectedChannel) {
      const handleMessagesUpdate = (newMessages) => {
        dispatch(setMessages(newMessages));
      };

      const handleSelectedChannelUpdate = (channelSid) => {
        dispatch(setSelectedChannel(channelSid));
      };
      handleSelectedChannelUpdate()
      handleMessagesUpdate()
    }
  }, []);

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
  const [state, setState] = useState({
    newMessage: '',
    channelProxy: selectedChannel,
    messages: [],
    loadingState: 'initializing',
    boundChannels: new Set(),
  });

  const sendMessage = event => {
    event.preventDefault();
    const message = state.newMessage;
    setState(prevState => ({ ...prevState, newMessage: '' }));
    state.channelProxy.sendMessage(message);
  };

  const onMessageChanged = event => {
    setState(prevState => ({ ...prevState, newMessage: event.target.value }));
  };
  if (selectedChannelSid) {
    channelContent = (
      <div onClick={() => { }} id="OpenChannel" style={{ position: "relative", top: 0 }} className='text-white'>
        <div >
          <div style={{ flexBasis: "100%", flexGrow: 2, flexShrink: 1, overflowY: "scroll" }}>
            <ChatMessages identity={user.username} messages={messages} />
          </div>
          <div>
            <Form ref={$form} method="post" onSubmit={sendMessage}>

              <div style={{ width: "100%", display: "flex", flexDirection: "row" }}>
                <Textarea
                  style={{ flexBasis: "100%" }}
                  placeholder="Message..."
                  name="message"
                  autoComplete="off"
                  className='bg-myColor-900 text-white rounded-d p-3 m-2 align-bottom content-end'
                  onChange={onMessageChanged}
                  value={state.newMessage}
                  ref={TextareaRef}
                />

              </div>
            </Form>
          </div>
        </div>
      </div>
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
  if (!Array.isArray(channels) || channels.length === 0) {
    // If channels is not an array or doesn't exist, handle it accordingly
    return <p>No channels available.</p>;
  }
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
            <div>

              <ul>
                {channels.map((item, index) => {
                  const activeChannel = item.conversationSid === selectedChannelSid;
                  const channelItemClassName = `channel-item${activeChannel ? ' channel-item--active' : ''}`;
                  console.log(item)
                  const currentDate = new Date();
                  const itemDate = new Date(item.dateUpdated);
                  let formattedDate;
                  if (
                    itemDate.getDate() === currentDate.getDate() &&
                    itemDate.getMonth() === currentDate.getMonth() &&
                    itemDate.getFullYear() === currentDate.getFullYear()
                  ) {
                    formattedDate = itemDate.toLocaleTimeString();
                  } else { formattedDate = itemDate.toLocaleDateString(); }
                  return (
                    <li
                      key={index}
                      onClick={async (event) => {
                        event.preventDefault(); // Prevent the default form submission behavior
                        console.log(item, 'before everything');
                        setSelectedChannelSid(item.conversationSid);

                        // Optionally, you can submit the form data here
                        const formData = new FormData();
                        formData.append("intent", "getConversation");
                        formData.append("conversationSid", item.conversationSid);
                        // Submit the form data or handle it as needed
                        submit(formData, { method: "post" });
                        // If you want to log the form data
                        console.log("Form Data:", formData);
                      }}
                      className={`channel-item m-2 mx-auto w-[95%] cursor-pointer rounded-md border  border-[#ffffff4d] hover:border-[#02a9ff] hover:text-[#02a9ff] active:border-[#02a9ff]${activeChannel ? ' channel-item--active' : ''}`}
                    >
                      <fetcher.Form method='post' >
                        <div type='button'>
                          <input type='hidden' name='conversationSid' defaultValue={item} />
                          <input type='hidden' name='intent' defaultValue='getConversation' />
                          <div className="m-2 flex items-center justify-between">
                            <span className="text-lg font-bold text-white">
                              <strong>{item.friendlyName || item.sid}</strong>
                            </span>
                            <p className={`text-sm text-[#ffffff7c] ${activeChannel ? ' channel-item--active text-white' : ''}`}>
                              {formattedDate}
                            </p>
                          </div>
                          <p className={`text-sm m-2 text-[#ffffff7c] ${activeChannel ? ' channel-item--active text-white' : ''}`}>
                            {messages && messages.length > 0 && messages[0].body
                              ? messages[0].body.split(' ').slice(0, 12).join(' ') + '...'
                              : ''}
                          </p>
                        </div>
                      </fetcher.Form>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
        <div className="grid h-[100%] w-[75%] max-w-[75%] grid-cols-1 space-y-2 border border-[#ffffff4d]">
          <div >{channelContent}</div>

        </div>
      </div>
    );
  }

  return <Loader2 className="animate-spin" />;
}


const mapStateToProps = (state) => ({
  messages: state.myReducer.messages,
  selectedChannelSid: state.myReducer.selectedChannelSid,
});

const mapDispatchToProps = (dispatch) => ({
  setMessages: (messages) => dispatch({ type: 'SET_MESSAGES', payload: messages }),
  setSelectedChannel: (channelSid) => dispatch({ type: 'SET_SELECTED_CHANNEL', payload: channelSid }),
});


export default connect(mapStateToProps, mapDispatchToProps)(ChatApp);


/** <div className="bg-black border border-[#3b3b3b] mt-[60px]">
      <div className="w-[30%] border !border-[#3b3b3b]" >

      </div>
      <div className="w-[70%] border !border-[#3b3b3b]">

      </div>
    </div> */
