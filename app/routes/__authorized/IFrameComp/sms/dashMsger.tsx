
import { Message, Conversation, Participant, Client, ConnectionState, Paginator, } from "@twilio/conversations";
import { Form, Link, useActionData, useFetcher, useLoaderData, useSubmit, useNavigation, useParams, useNavigate, useLocation, useSearchParams } from "@remix-run/react";
import React, { createContext, useEffect, useRef, useState } from "react";
import { type DataFunctionArgs, type ActionFunction, json, type LinksFunction, redirect } from '@remix-run/node'
import financeFormSchema from "~/overviewUtils/financeFormSchema";
import { prisma } from "~/libs";
import { getSession } from "~/sessions/auth-session.server";
import axios from "axios";
import { GetUser } from "~/utils/loader.server";
import { cn } from "~/components/ui/utils"
import { Tabs, Badge, TabsContent, TabsList, TabsTrigger, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, Card, CardContent, CardDescription, CardFooter, Alert, Debug, InputPassword, Layout, PageHeader, RemixForm, RemixLinkText, CardHeader, CardTitle, Tooltip, TooltipContent, TooltipTrigger, TooltipProvider, Avatar, AvatarFallback, AvatarImage, Select, SelectValue, SelectTrigger, SelectContent, SelectLabel, SelectItem, SelectGroup, RemixNavLink, Input, Separator, Button, Label, PopoverTrigger, PopoverContent, Popover, TextArea } from "~/components"
import { CheckIcon, PaperPlaneIcon, PlusIcon } from "@radix-ui/react-icons"
import { toast } from "sonner"
import twilio from 'twilio';


export default function ChatAppDashboardClient({ cust, customerPhone, searchData, customerfinanceId, customerName, customerEmail, convoId, messages, messagesRef, identity, convoList, getText, getTemplates }) {
  const { newToken, user, conversationsData, username, } = useLoaderData()

  console.log(convoList, conversationsData, getText, convoId, 'isMobileDevice')

  const [templates, setTemplates] = useState(getTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [text, setText] = useState('');
  const [input, setInput] = React.useState("")
  const [conversationSID, setConversationSID] = useState('')

  let multipliedConvoList = [];
  for (let i = 0; i < 30; i++) {
    multipliedConvoList = multipliedConvoList.concat(convoList);
  }

  // const [messages, setMessages] = useState(getText);

  const $form = useRef<HTMLFormElement>(null);


  const [conversation, SetConversation] = useState('list');

  const inputLength = input.trim().length
  const fetcher = useFetcher()
  const handleChange = (event) => {
    const selectedTemplate = templates.find(template => template.title === event.target.value);
    setSelectedTemplate(selectedTemplate);

  };
  useEffect(() => {
    if (selectedTemplate) {
      setText(selectedTemplate.body);
    }
  }, [selectedTemplate]);



  const handleScreenSizeChange = () => {
    const isLargeScreen = window.innerWidth >= 1025;
    SetConversation(isLargeScreen ? 'largeScreen' : 'list');
  };

  useEffect(() => {
    handleScreenSizeChange();
    window.addEventListener('resize', handleScreenSizeChange);
    return () => window.removeEventListener('resize', handleScreenSizeChange);
  }, []);

  const { key } = useLocation();
  useEffect(
    function clearFormOnSubmit() {
      $form.current?.reset();
    },
    [key],
  );

  const chatClientRef = useRef(null);




  // -----------------------------------------------------------

  console.log(messages, 'messages')
  return (
    <Card className=" z-50 text-foreground" x-chunk="dashboard-05-chunk-4" >
      <CardHeader className="flex flex-row items-start bg-muted-background">
        <div className="grid gap-0.5">
          <CardTitle className="group flex items-center gap-2 text-lg">
            Notes
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className=" p-6 text-sm bg-background">
        <div className="grid gap-3 ">
          <Card>
            <CardContent className='flex-grow  overflow-y-scroll overflow-x-clip'>
              <div className="space-y-4 mt-5  max-h-[800px] h-auto">

                {messagesConvo && messagesConvo.map((message, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                      message.author === identity.toLowerCase().replace(/\s/g, '')
                        ? "ml-auto bg-primary text-foreground"
                        : "bg-[#262626]"
                    )}
                  >
                    <div className='grid grid-cols-1'>
                      {message.author !== identity.toLowerCase().replace(/\s/g, '') && (
                        <p className='text-[#8c8c8c]'>
                          {message.author}
                        </p>
                      )}
                      {message.body}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
      <CardFooter className="flex flex-row items-center  bg-muted-background px-6 py-3">
        <div className='grid grid-cols-1 mx-auto' >
          <select
            className={`autofill:placeholder:text-text-[#C2E6FF] justifty-start w-[475px] mb-2 my-2 h-9   cursor-pointer rounded border  bg-background border-border  text-xs uppercase   shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-primary rounded-md`}
            onChange={handleChange}>
            <option value="">Select a Template</option>
            {templates.map((template, index) => (
              <option key={index} value={template.title}>
                {template.title}
              </option>
            ))}
          </select>
          <fetcher.Form ref={$form} method="post" className="flex w-full items-center space-x-2"  >
            <Input
              id="message"
              placeholder="Type your message..."
              className="flex-1 bg-background border-border h-9"
              autoComplete="off"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              name="body"
            />
            <Button
              value="sendMessage"
              type="submit"
              name="intent"
              size="icon"
              onClick={() => {
                toast.success(`Note saved`)
              }}
              disabled={inputLength === 0}
              className='bg-primary '>
              <PaperPlaneIcon className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
            <Input type="hidden" defaultValue={user.email} name="author" />
            <Input type="hidden" defaultValue='customer.clientfileId' name="customerId" />
            <input type="hidden" defaultValue='customer.id' name="financeId" />
            <Input type="hidden" defaultValue='customer.name' name="name" />
            <input className='w-full p-2' type="hidden" name='phone' defaultValue={`+1${user.phone}`} />
            <input className='w-full p-2' type="hidden" name='intent' defaultValue='sendMessage' />
            <input className='w-full p-2' type="hidden" name='conversationSid' defaultValue={conversationSID} />
          </fetcher.Form>
        </div>


      </CardFooter>
    </Card>
  )
}

export const links: LinksFunction = () => [
  { rel: "icon", type: "image/svg", href: '/dashboard.svg' },

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
//const { convoList, callToken, newToken, user, getText, getTemplates, conversationsData, username, isMobileDevice } = useLoaderData()

export async function loader({ request, params }: LoaderFunction) {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")

  const user = await GetUser(email)
  const accountSid = 'AC9b5b398f427c9c925f18f3f1e204a8e2'
  const authToken = 'd38e2fd884be4196d0f6feb0b970f63f'
  const client = require('twilio')(accountSid, authToken);
  const username = user?.username.toLowerCase().replace(/\s/g, '');//'skylerzanth'//localStorage.getItem("username") ?? "";
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
        const conversationSid = convoId;

        // Fetch conversation details
        await delay(50);
        try {
          const fetchedConversation = await client.conversations.v1.conversations(conversationSid).fetch();
          conversationChatServiceSid = fetchedConversation.body;
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
          convoList = await client.conversations.v1.users(userSid).userConversations.list({ limit: 50 });
          //   userConversations.forEach(u => console.log(u.friendlyName));
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
        userEmail: 'skylerzanth@gmail.com', // email,
        passClient: password,
        proxyPhone: proxyPhone,
      }
    })

  }
  let getConvos;

  if (!Array.isArray(convoList) || convoList.length === 0) {
    getConvos = await client.conversations.v1.users(`${username}`).userConversations.list({ limit: 50 });
    // .then(userConversations => userConversations.forEach(u => console.log(u.friendlyName)))
    convoList = getConvos;
  }

  const conversation = await prisma.getConversation.findFirst({
    where: { userEmail: 'skylerzanth@gmail.com'/*user.email*/ },
    orderBy: {
      createdAt: 'desc', // or updatedAt: 'desc'
    },
  });
  let getText
  if (conversation) {
    const storeObject = JSON.parse(conversation.jsonData);
    // console.log(storeObject);

    // Extract conversationSid from the first object in the array
    const conversationSid = storeObject[0].conversationSid;

    if (conversationSid) {
      //  console.log(conversationSid, 'channels');
      getText = await client.conversations.v1.conversations(conversationSid)
        .messages
        .list({ limit: 200 });
    } else {
      console.log('conversationSid is undefined');
    }
  }
  const getTemplates = await prisma.emailTemplates.findMany({ where: { userEmail: user?.email, }, });
  const convosList = await client.conversations.v1.users(username).userConversations.list({ limit: 50 });
  console.log(convosList, 'convosList is convosList');

  const conversationsData = [];
  for (let convo of convosList) {
    const fetchedConversation = await client.conversations.v1.conversations(convo.conversationSid).fetch();
    console.log(fetchedConversation, 'fetchedConversation is fetchedConversation');

    const messages = await client.conversations.v1.conversations(convo.conversationSid).messages.list({ limit: 1, order: 'desc' });
    if (messages.length > 0) {
      const message = messages[0];
      const convoData = {
        body: message.body,
        author: message.author,
        conversationSid: message.conversationSid,
        createdDate: message.dateCreated,
      };
      conversationsData.push(convoData);
    }
  }

  const userAgent = request.headers.get('User-Agent');
  const isMobileDevice = checkForMobileDevice(userAgent);

  console.log(conversationsData);
  return json({ convoList, callToken, username, newToken, user, password, getText, getTemplates, conversationsData, isMobileDevice })
}

export async function action({ request, }: ActionFunction) {
  const formPayload = Object.fromEntries(await request.formData())
  const formData = financeFormSchema.parse(formPayload);
  const session2 = await getSession(request.headers.get("Cookie"));
  const email = session2.get("email")
  const accountSid = 'AC9b5b398f427c9c925f18f3f1e204a8e2'
  const authToken = 'd38e2fd884be4196d0f6feb0b970f63f'
  const client = require('twilio')(accountSid, authToken);

  const user = await GetUser(email)
  if (!user) { redirect('/login') }
  const intent = formData.intent

  if (intent === 'getConversation') {
    const sid = formData.conversationSid
    const convoId = sid
    const GetConvo = await client.conversations.v1.conversations(convoId).messages.list({ limit: 20 })


    // console.log(GetConvo, email, 'what isa this ')
    const result = await prisma.getConversation.create({
      data: {
        jsonData: JSON.stringify(GetConvo),
        userEmail: email,
      },
    });
    return json({ result });
  }
  if (intent === 'sendMessage') {
    const sid = formData.conversationSid
    const message = formData.message
    const convoId = sid
    const phone = formData.phone
    await client.conversations.v1.conversations(convoId)
      .messages
      .create({ author: phone, body: message })
      .then(message => console.log(message.sid));
    return null
  }

  return null
}

/**
 *


    // ---------------------sms client -----------------------------

     const [convoId, setConvoId] = useState('')
    const getObjectById = (id) => {
        return searchData.find(item => item.id === id);
    };
    const { convoList, getText, getTemplates, conversationsData, callToken, newToken } = useLoaderData()
    const username = user?.username.toLowerCase().replace(/\s/g, '');//'skylerzanth'//localStorage.getItem("username") ?? "";
    const password = 'skylerzanth1234'//localStorage.getItem("password") ?? "";
    const proxyPhone = '+12176347250'


    const [messagesConvo, setMessagesConvo] = useState([]);
    const [selectedChannelSid, setSelectedChannelSid] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState([]);
    const [templates, setTemplates] = useState(getTemplates);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [text, setText] = useState('');
    const [input, setInput] = React.useState("")
    const [conversationSID, setConversationSID] = useState('')
    const [loggedIn, setLoggedIn] = useState(user.email);
    const [statusString, setStatusString] = useState("Fetching credentials…");
    let multipliedConvoList = [];
    for (let i = 0; i < 30; i++) {
        multipliedConvoList = multipliedConvoList.concat(convoList);
    }
    const [channels, setChannels] = useState(multipliedConvoList);
    const [selectedChannel, setSelectedChannel] = useState([]);
    const [currentConversation, setCurrentConversation] = useState(null);
    const [messages, setMessages] = useState(getText);
    const [message, setMessage] = useState(messages || null);
    const [chatReady, setChatReady] = useState(false);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');
    const $form = useRef<HTMLFormElement>(null);
    const [isTyping, setIsTyping] = useState(false);
    const [newClient, setClient] = useState();
    const [newMessage, setNewMessage] = useState("");
    const [token, setToken] = useState(newToken);
    const client = new Client(token);
    const [name, setName] = useState(username);
    const [to, setTo] = useState('');
    const [channelName, setChannelName] = useState('');
    const [from, setFrom] = useState('');
    const [conversation_sid, setConversation_sid] = useState('');
    const [smsMenu, setSmsMenu] = useState('true');
    const [sms, setSms] = useState(true);
    const [size, setSize] = useState(751);
    const [isLargeScreen, setIsLargeScreen] = useState(false);
    const [conversation, SetConversation] = useState('list');

    const inputLength = input.trim().length
    const submit = useSubmit();
    const fetcher = useFetcher()
    // const dispatch = useDispatch();
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const chatClientRef = useRef(null);

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
                    //if (user.conversation.sid === currentConversation.sid) setIsTyping(true);
                });
                client.on('typingEnded', (user) => {
                    console.log('typing end..', user);
                    // if (user.conversation.sid === currentConversation.sid) setIsTyping(false);
                });
            }, 10);

        }
        initConversations()
        setChatReady(true);
    }, []);

    const handleConversationClick = (conversationId) => {
        setSelectedConversation(conversationId);
        if (conversation !== 'list') {
            SetConversation('list')
        }
        if (conversation === 'list') {
            SetConversation('conversation')
        }
    };
    const { key } = useLocation();
    const squared = require('twilio')(accountSid, authToken);

    // ---------------------sms client -----------------------------
 *
 *  const handleButtonClickSMS = async (rowData) => {
        const theFileId = await getObjectById(rowData.clientfileId)
        setConvoId(theFileId.conversationId)
        setCustomerEmail(rowData.email);
        setCustomerName(rowData.name);
        setCustomerfinanceId(rowData.id);
        setCustomerPhone(rowData.phone);
        setClientfileId(rowData.clientfileId);
        setOpenSMS(true);
        console.log(customerPhone, customerfinanceId, customerName, customerEmail, convoId, searchData)
        // ---------------------sms client -----------------------------
        const getConversation = await squared.conversations.v1.conversations(convoId)
            .fetch()
            .then(conversation => {
                console.log(conversation)
                setMessagesConvo(conversation.messages);


                setSelectedChannelSid(conversation.conversationSid);
                setChannelName(conversation.author || convoId)

            });
        console.log(getConversation, 'getConversation')
        const accountSid = 'AC9b5b398f427c9c925f18f3f1e204a8e2';
        const authToken = 'd38e2fd884be4196d0f6feb0b970f63f';

        const url = `https://conversations.twilio.com/v1/Conversations/${convoId}/Messages`;
        const credentials = `${accountSid}:${authToken}`;
        const base64Credentials = btoa(credentials);
        fetch(url, { method: 'GET', headers: { 'Authorization': `Basic ${base64Credentials}` } })
            .then(response => response.json())
            .then(data => {
                setMessagesConvo(data.messages);
                setSelectedChannelSid(data.conversationSid);
                setChannelName(rowData.name || rowData.convsationId)
            })
            .catch(error => console.error('Error:', error));
        console.log(messagesConvo, selectedChannelSid, 'smsMenu')

    }
    const messagesRef = useRef(null);

    // ---------------------sms client -----------------------------

    <Logtext
                            data={data}
                            searchData={searchData}
                            iFrameRef={iFrameRef}
                            convoId={convoId}
                            openSMS={openSMS}
                            setOpenSMS={setOpenSMS}
                            customerPhone={customerPhone}
                            customerfinanceId={customerfinanceId}
                            customerName={customerName}
                            customerEmail={customerEmail}
                            messages={messagesConvo}
                            messagesRef={messagesRef}
                            identity={`+1${user.phone}`}
                            convoList={convoList}
                            getText={getText}
                            getTemplates={getTemplates}
                        />





                        */
