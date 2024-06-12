
import { Message, Conversation, Participant, Client, ConnectionState, Paginator, } from "@twilio/conversations";
import { Form, Link, useActionData, useFetcher, useLoaderData, useSubmit, useNavigation, useParams, useNavigate, useLocation } from "@remix-run/react";
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

const accountSid = 'AC9b5b398f427c9c925f18f3f1e204a8e2';
const authToken = 'd38e2fd884be4196d0f6feb0b970f63f';
const password = 'skylerzanth1234'//localStorage.getItem("password") ?? "";
const proxyPhone = '+12176347250'

export default function ChatAppDashboardClient() {
  const { user, client: newClient, getTemplates, twilioSmsDetails, newToken, callToken } = useLoaderData();
  const [customer, setCust] = useState()
  const [templates, setTemplates] = useState(getTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const $form = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const getCust = window.localStorage.getItem("customer");
    const parseCust = getCust ? JSON.parse(getCust) : [];
    setCust(parseCust)
  }, []);


  const [input, setInput] = React.useState("")
  const inputLength = input.trim().length
  const fetcher = useFetcher();
  const [messages, setMessages] = React.useState([
    {
      userEmail: 'customer',
      body: "Hi, I was looking at the model, do you have that in stock?",
    },
    {
      userEmail: "skylerzanth@outlook.com",
      body: "Hey, yes we do, what color did you like most?.",
    },
    {
      userEmail: 'customer',
      body: "red, is that available?",
    },
    {
      userEmail: "skylerzanth@outlook.com",
      body: "Let me check for you, one sec.",
    },
  ])
  const handleChange = (event) => {
    const selectedTitle = event.target.value;
    const selectedTemplate = templates.find(
      (template) => template.title === selectedTitle
    );

    setSelectedTemplate(selectedTemplate.body);
    setInput(selectedTemplate.body);
    console.log(selectedTemplate)
  };

  const { key } = useLocation();
  useEffect(
    function clearFormOnSubmit() {
      $form.current?.reset();
    },
    [key],
  );
  const chatClientRef = useRef(null);

  // ---------------------------sms---------------------------//
  const [conversation, setConversation] = useState([])
  const [conversationSID, setConversationSID] = useState('')
  const [chatServiceSid, setChatServiceSid] = useState('')
  const [loggedIn, setLoggedIn] = useState(user.email);
  const [statusString, setStatusString] = useState("Fetching credentials…");
  const username = user.username// +myPhone
  const [name, setName] = useState(username);
  const [token, setToken] = useState(newToken);
  const [chatReady, setChatReady] = useState(false);
  const [channels, setChannels] = useState(conversation);
  const [newMessage, setNewMessage] = useState("");
  const [client, setClient] = useState(newClient);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentConversation, setCurrentConversation] = useState(conversationSID);
  const [isTyping, setIsTyping] = useState(false);
  const messagesRef = useRef(null);

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
          const username = 'skylerzanth'//twilioSmsDetails.username ;
          const password = 'skylerzanth1234'//twilioSmsDetails.password ;
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
          if (user.conversation.sid === currentConversation) setIsTyping(true);
        });
        client.on('typingEnded', (user) => {
          console.log('typing end..', user);
          if (user.conversation.sid === currentConversation) setIsTyping(false);
        });
      }, 10);

    }
    initConversations()
    setChatReady(true);
  }, []);

  const haveconvoquestion = async () => {
    const hasConvo = await prisma.clientfile.findUnique({
      where: {
        id: customer?.clientfileId
      }
    })
    if (hasConvo.conversationId.length > 15) {
      const getConvo = await client.conversations.v1.Services(hasConvo.conversationId)
      console.log(getConvo, 'getconvo')
      setConversation(getConvo)
    } else {
      const createConvo = await client.conversations.v1.conversations
        .create({ friendlyName: user.name + customer.phone })
        .then(conversation => setConversationSID(conversation.sid)
        )
      const getConvo = await client.conversations.v1.conversations(conversationSID)
        .fetch()
        .then(conversation => setChatServiceSid(conversation.chatServiceSid));

      const addCustomer = await client.conversations.v1.conversations(conversationSID)
        .participants
        .create({
          'messagingBinding.address': `+1${user?.phone}`, // customers number
          'messagingBinding.proxyAddress': proxyPhone,
        })
        .then(participant => console.log(participant.sid));
      await prisma.clientfile.update({
        where: {
          id: customer.clientfileId
        },
        data: {
          conversationId: conversationSID
        }
      })

      const getConversation = await client.conversations.v1.Services(conversationSID)
      console.log(getConvo, 'getconvo')
      setConversation(getConvo)
    }
  }

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

                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                      message.userEmail === user.email
                        ? "ml-auto bg-[#dc2626] text-foreground"
                        : "bg-[#262626]"
                    )}
                  >
                    <div className='grid grid-cols-1'>
                      {message.userEmail !== user.email && (
                        <p className='text-[#8c8c8c]'>
                          {message.userEmail}
                        </p>
                      )}
                      {message.body}
                    </div>
                  </div>
                ))}
                {conversation.map((message, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                      message.userEmail === user.email
                        ? "ml-auto bg-[#dc2626] text-foreground"
                        : "bg-[#262626]"
                    )}
                  >
                    <div className='grid grid-cols-1'>
                      {message.userEmail !== user.email && (
                        <p className='text-[#8c8c8c]'>
                          {message.userEmail}
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
      <CardFooter className="flex flex-row items-center border-t border-border bg-muted-background px-6 py-3">
        <div className='grid grid-cols-1' >
          <select
            className={`autofill:placeholder:text-text-[#C2E6FF] justifty-start w-[475px] mb-2 my-2 h-9   cursor-pointer rounded border  bg-muted-background border-border  text-xs uppercase   shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-primary`}
            onChange={handleChange}>
            <option value="">Select a Template</option>
            {templates.map((template, index) => (
              <option key={index} value={template.title}>
                {template.title}
              </option>
            ))}
          </select>
          <fetcher.Form ref={$form} method="post" className="flex w-full items-center space-x-2"  >
            <TextArea
              id="message"
              placeholder="Type your message..."
              className="flex-1 bg-muted-background border-border h-9"
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
              className='bg-[#dc2626] '>
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
function checkForMobileDevice(userAgent) {
  // Example patterns to check for mobile devices
  const mobileDevicePatterns = ['iPhone', 'Android', 'Mobile'];

  // Check if the User-Agent contains any of the mobile device patterns
  return mobileDevicePatterns.some(pattern => userAgent.includes(pattern));
}
export async function loader({ request, params }) {
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
  const twilioSmsDetails = firstTime
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



  const getTemplates = await prisma.emailTemplates.findMany({ where: { userEmail: user?.email, }, });

  const userAgent = request.headers.get('User-Agent');
  const isMobileDevice = checkForMobileDevice(userAgent);

  return json({ convoList, callToken, username, newToken, user, password, getTemplates, twilioSmsDetails, isMobileDevice, client })
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

function SendMessage(item, user, text) {
  const conversationSid = item.conversationSid

  const url = `https://conversations.twilio.com/v1/Conversations/${conversationSid}/Messages`;
  const credentials = `${accountSid}:${authToken}`;
  const base64Credentials = btoa(credentials);

  fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${base64Credentials}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      author: `+1${user.phone}`,
      body: text,
    }),
  })
    .then(response => response.json())
    .then(message => console.log(message.sid))
    .catch(error => console.error('Error:', error));

}

