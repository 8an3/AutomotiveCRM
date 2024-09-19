
import React, { useEffect, useRef, useState, RefObject } from "react";
import { Loader2 } from "~/images/icons";
import { Outlet, useFetcher, useLoaderData, useActionData, Form, useLocation, useSubmit, useMatch } from '@remix-run/react';
import { Textarea } from '~/components/zRoutes/oldComps/ui/textarea';
import { setMessages, setSelectedChannel } from '~/components/actions/actions';
import axios from "axios";
import { Message, Conversation, Participant, Client, ConnectionState, Paginator, } from "@twilio/conversations";
import { json, type LinksFunction, type LoaderFunction, type ActionFunction, } from '@remix-run/node';
import { GetUser } from "~/utils/loader.server";
import { prisma } from "~/libs";
import { model } from "~/models";
import { getSession } from "~/sessions/auth-session.server";

import ChatMessages from '~/components/sms/ChatMessage';
import { ChevronLeft, MessageSquarePlus } from 'lucide-react';
import { Badge, Button, Input, Label, Select, SelectContent, SelectGroup, SelectLabel, SelectItem, SelectTrigger, SelectValue, Tabs, TabsContent, TabsList, TabsTrigger, ButtonLoading } from "~/components/ui";
import financeFormSchema from "~/overviewUtils/financeFormSchema";
import { useDispatch, connect, useSelector } from 'react-redux';
import { toast } from "sonner"

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

    const conversationsData = [];
    for (let convo of convosList) {
        const fetchedConversation = await client.conversations.v1.conversations(convo.conversationSid).fetch();

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


const ChatApp = (item) => {
    const { convoList, callToken, newToken, user, getText, getTemplates, conversationsData, username, isMobileDevice } = useLoaderData()
    console.log(isMobileDevice, 'isMobileDevice')
    const [templates, setTemplates] = useState(getTemplates);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    // const dispatch = useDispatch();
    const data = useActionData<typeof action>();
    const [text, setText] = useState('');

    const fetcher = useFetcher()
    const submit = useSubmit();

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const handleChange = (event) => {
        const selectedTemplate = templates.find(template => template.title === event.target.value);
        setSelectedTemplate(selectedTemplate);

    };
    React.useEffect(() => {
        if (selectedTemplate) {
            setText(selectedTemplate.body);
        }
    }, [selectedTemplate]);
    const [loggedIn, setLoggedIn] = useState(user.email);
    const [statusString, setStatusString] = useState("Fetching credentials…");
    let multipliedConvoList = [];
    for (let i = 0; i < 30; i++) {
        multipliedConvoList = multipliedConvoList.concat(convoList);
    }
    const [channels, setChannels] = useState(multipliedConvoList);
    const [selectedChannelSid, setSelectedChannelSid] = useState([]);
    const [currentConversation, setCurrentConversation] = useState(null);
    const [messages, setMessages] = useState(getText);
    const [messagesConvo, setMessagesConvo] = useState([]);
    const [message, setMessage] = useState(messages || null);
    const [chatReady, setChatReady] = useState(false);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');
    const $form = useRef<HTMLFormElement>(null);
    const [isTyping, setIsTyping] = useState(false);
    const [client, setClient] = useState();
    const [newMessage, setNewMessage] = useState("");
    const [token, setToken] = useState(newToken);
    const [name, setName] = useState(username);
    const [to, setTo] = useState('');
    const [channelName, setChannelName] = useState('');
    const [from, setFrom] = useState('');
    const [conversation_sid, setConversation_sid] = useState('');

    const [smsMenu, setSmsMenu] = useState('true');
    const [sms, setSms] = useState(true);
    const [size, setSize] = useState(751);
    const [isLargeScreen, setIsLargeScreen] = useState(false);

    const [selectedConversation, setSelectedConversation] = useState(null);
    const [conversation, SetConversation] = useState('list');

    const handleConversationClick = (conversationId) => {
        setSelectedConversation(conversationId);
        if (conversation !== 'list') {
            SetConversation('list')
        }
        if (conversation === 'list') {
            SetConversation('conversation')
        }
    };



    // Function to handle resizing and change conversation layout
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

    const messagesRef = useRef(null);

    if (selectedChannelSid) {

        channelContent = (
            <div onClick={() => { }} id="OpenChannel" className='text-foreground'>
                <div className="flex justify-between border-b border-border">
                    <div className='flex align-middle'>

                        <Button variant='outline' onClick={() => SetConversation('list')}>
                            <ChevronLeft color="#ffffff" strokeWidth={1.5} />
                        </Button>

                        <span className="text-lg font-bold text-foreground m-2">
                            <strong>{channelName}</strong>
                        </span>
                    </div>

                    <select
                        className={`autofill:placeholder:text-text-[#C2E6FF] justifty-start  m-2 h-9 w-auto cursor-pointer rounded border  border-white bg-[#1c2024] px-2 text-xs uppercase text-foreground shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-primary`}
                        onChange={handleChange}>
                        <option value="">Select a Template</option>
                        {templates.map((template, index) => (
                            <option key={index} value={template.title}>
                                {template.title}
                            </option>
                        ))}
                    </select>

                </div>

                <div className='relative w-[100%] max-h-[950px] h-auto overflow-y-scroll' >
                    <ChatMessages identity={`+1${user.phone}`} messages={messagesConvo} messagesRef={messagesRef} />
                </div>
                <div className="mt-auto   rounded-md  border-border">

                    <Form ref={$form} method="post"  >
                        <input className='w-full p-2' type="hidden" name='phone' defaultValue={`+1${user.phone}`} />
                        <input className='w-full p-2' type="hidden" name='intent' defaultValue='sendMessage' />
                        <input className='w-full p-2' type="hidden" name='conversationSid' defaultValue={conversation_sid} />

                        <Input
                            placeholder="Message..."
                            name="message"
                            autoComplete="off"
                            className='rounded-d m-2 w-[99%] bg-myColor-900 p-3 text-foreground  mb-2 mt-5'
                            value={text}
                            ref={textareaRef}
                            onChange={(e) => setText(e.target.value)}
                            onClick={() => {
                                toast.success(`Email sent!`)
                                if (selectedChannelSid) {
                                    setConversation_sid(selectedChannelSid)
                                }
                                setTimeout(() => {
                                    SendMessage(item, user)
                                }, 5);
                            }}
                        />
                    </Form>
                </div>
            </div>
        );
    } else if (statusString !== "success") {
        channelContent = "Loading your chat!";
    } else {
        channelContent = "";
    }

    if (!Array.isArray(channels) || channels.length === 0) {
        return <p>No channels available.</p>;
    }

    if (loggedIn) {
        return (
            <>
                {conversation === 'largeScreen' && (

                    <div className="mx-auto mt-[65px] h-[93%] w-[95%] border border-border bg-black flex">

                        <div className={`leftPanel flex flex-col space-y-2 border border-[#ffffff4d]  w-[25%] `}>

                            <div className="tabListSZ mx-auto flex w-full border-b border-border">
                                <Tabs defaultValue="SMS" className="m-2 mx-auto w-[95%] justify-start">
                                    <TabsList className="grid w-auto grid-cols-2">
                                        <TabsTrigger
                                            onClick={() => {
                                                setSms(true)
                                            }}
                                            value="SMS">
                                            SMS
                                        </TabsTrigger>
                                        <TabsTrigger
                                            onClick={() => {
                                                setSms(false)

                                            }}
                                            value="Staff Chat">
                                            Staff Chat {size} {smsMenu} {isLargeScreen}
                                        </TabsTrigger>
                                        {/*   <TabsTrigger
          onClick={() => {

          }}
          value="Facebook">
         Facebook
        </TabsTrigger>*/}

                                    </TabsList>
                                </Tabs>
                            </div>
                            {sms === true && (
                                <ul className="top-0 overflow-y-scroll grow" >
                                    {conversationsData.map((item, index) => {
                                        const activeChannel = item.conversationSid === selectedChannelSid;
                                        const channelItemClassName = `channel-item${activeChannel ? ' channel-item--active' : ''}`;
                                        const currentDate = new Date().setHours(0, 0, 0, 0);
                                        const itemDate = new Date(item.createdDate).setHours(0, 0, 0, 0);
                                        let formattedDate;
                                        if (itemDate === currentDate) {
                                            formattedDate = new Date(item.createdDate).toLocaleTimeString();
                                        } else {
                                            formattedDate = new Date(item.createdDate).toLocaleDateString();
                                        }
                                        const lastMessageList = messagesConvo[messagesConvo.length - 1];
                                        return (
                                            <>
                                                <li
                                                    key={index}
                                                    onClick={async (event) => {
                                                        const accountSid = 'AC9b5b398f427c9c925f18f3f1e204a8e2';
                                                        const authToken = 'd38e2fd884be4196d0f6feb0b970f63f';
                                                        const conversationSid = item.conversationSid; // Replace with the actual conversationSid
                                                        const url = `https://conversations.twilio.com/v1/Conversations/${conversationSid}/Messages`;
                                                        const credentials = `${accountSid}:${authToken}`;
                                                        const base64Credentials = btoa(credentials);
                                                        fetch(url, { method: 'GET', headers: { 'Authorization': `Basic ${base64Credentials}` } })
                                                            .then(response => response.json())
                                                            .then(data => {
                                                                setMessagesConvo(data.messages);
                                                            })
                                                            .catch(error => console.error('Error:', error));
                                                        setSelectedChannelSid(item.conversationSid);
                                                        setChannelName(item.author || item.sid)
                                                        console.log(smsMenu, 'smsMenu')

                                                        console.log(selectedChannelSid)
                                                    }}
                                                    className={`m-2 mx-auto mb-auto w-[95%] cursor-pointer rounded-md border  border-[#ffffff4d] hover:border-primary hover:text-primary active:border-primary${activeChannel ? ' channel-item--active' : ''}`}                    >
                                                    <div className=' w-[95%] '>
                                                        <input type='hidden' name='conversationSid' defaultValue={item} />
                                                        <input type='hidden' name='intent' defaultValue='getConversation' />
                                                        <div className="m-2 flex items-center justify-between">
                                                            <span className="text-lg font-bold text-foreground">
                                                                <strong>{item.author || item.author}</strong>
                                                            </span>
                                                            <p className={`text-sm text-[#ffffff7c] ${activeChannel ? ' channel-item--active text-foreground' : ''}`}>
                                                                {formattedDate}
                                                            </p>
                                                        </div>
                                                        <p className={`m-2 text-sm text-[#ffffff7c] ${activeChannel ? ' channel-item--active text-foreground' : ''}`}>
                                                            {conversationsData && conversationsData.length > 0 && conversationsData[0].body
                                                                ? conversationsData[0].body.split(' ').slice(0, 12).join(' ')
                                                                : ''}
                                                        </p>
                                                    </div>
                                                </li>
                                            </>
                                        );
                                    })}
                                </ul>
                            )}
                            {sms === false && (
                                <ul className="top-0 overflow-y-scroll grow" >
                                    {conversationsData.map((item, index) => {
                                        const activeChannel = item.conversationSid === selectedChannelSid;
                                        const channelItemClassName = `channel-item${activeChannel ? ' channel-item--active' : ''}`;
                                        const currentDate = new Date().setHours(0, 0, 0, 0);
                                        const itemDate = new Date(item.createdDate).setHours(0, 0, 0, 0);
                                        let formattedDate;
                                        if (itemDate === currentDate) {
                                            formattedDate = new Date(item.createdDate).toLocaleTimeString();
                                        } else {
                                            formattedDate = new Date(item.createdDate).toLocaleDateString();
                                        }
                                        const lastMessageList = messagesConvo[messagesConvo.length - 1];
                                        return (
                                            <>
                                                <li
                                                    key={index}
                                                    onClick={async (event) => {
                                                        const accountSid = 'AC9b5b398f427c9c925f18f3f1e204a8e2';
                                                        const authToken = 'd38e2fd884be4196d0f6feb0b970f63f';
                                                        const conversationSid = item.conversationSid; // Replace with the actual conversationSid
                                                        const url = `https://conversations.twilio.com/v1/Conversations/${conversationSid}/Messages`;
                                                        const credentials = `${accountSid}:${authToken}`;
                                                        const base64Credentials = btoa(credentials);
                                                        fetch(url, { method: 'GET', headers: { 'Authorization': `Basic ${base64Credentials}` } })
                                                            .then(response => response.json())
                                                            .then(data => {
                                                                setMessagesConvo(data.messages);
                                                            })
                                                            .catch(error => console.error('Error:', error));
                                                        setSelectedChannelSid(item.conversationSid);
                                                        setChannelName(item.author || item.sid)
                                                        console.log(smsMenu, 'smsMenu')

                                                        //  console.log(selectedChannelSid)
                                                    }}
                                                    className={`m-2 mx-auto mb-auto w-[95%] cursor-pointer rounded-md border  border-[#ffffff4d] hover:border-primary hover:text-primary active:border-primary${activeChannel ? ' channel-item--active' : ''}`}                    >
                                                    <div className=' w-[95%] '>
                                                        <input type='hidden' name='conversationSid' defaultValue={item} />
                                                        <input type='hidden' name='intent' defaultValue='getConversation' />
                                                        <div className="m-2 flex items-center justify-between">
                                                            <span className="text-lg font-bold text-foreground">
                                                                <strong>{item.author || item.author}</strong>
                                                            </span>
                                                            <p className={`text-sm text-[#ffffff7c] ${activeChannel ? ' channel-item--active text-foreground' : ''}`}>
                                                                {formattedDate}
                                                            </p>
                                                        </div>
                                                        <p className={`m-2 text-sm text-[#ffffff7c] ${activeChannel ? ' channel-item--active text-foreground' : ''}`}>
                                                            {conversationsData && conversationsData.length > 0 && conversationsData[0].body
                                                                ? conversationsData[0].body.split(' ').slice(0, 12).join(' ')
                                                                : ''}
                                                        </p>
                                                    </div>
                                                </li>
                                            </>
                                        );
                                    })}
                                </ul>
                            )}
                        </div>
                        <div className={`rightPanel flex flex-col space-y-2 border border-[#ffffff4d]   w-[75%] `}>
                            {sms === true && (
                                <>
                                    {channelContent}
                                </>
                            )}
                            {sms === false && (
                                <>
                                    {channelContent}
                                </>
                            )}
                        </div>
                    </div>
                )}
                {conversation === 'conversation' && (
                    <div className="w-full mt-[100px]">
                        {channelContent}
                    </div>
                )}

                {conversation === 'list' && (
                    <div className="">
                        <div className={`leftPanel flex flex-col space-y-2 border border-[#ffffff4d]  w-full `}>

                            <div className="tabListSZ mx-auto flex w-full border-b border-border">
                                <Tabs defaultValue="SMS" className="m-2 mx-auto w-[95%] justify-start">
                                    <TabsList className="grid w-auto grid-cols-2">
                                        <TabsTrigger
                                            onClick={() => {
                                                setSms(true)
                                            }}
                                            value="SMS">
                                            SMS
                                        </TabsTrigger>
                                        <TabsTrigger
                                            onClick={() => {
                                                setSms(false)

                                            }}
                                            value="Staff Chat">
                                            Staff Chat {size} {smsMenu} {isLargeScreen}
                                        </TabsTrigger>
                                        {/*   <TabsTrigger
onClick={() => {

}}
value="Facebook">
Facebook
</TabsTrigger>*/}

                                    </TabsList>
                                </Tabs>
                            </div>
                            {sms === true && (
                                <ul className="top-0 overflow-y-scroll grow" >
                                    {conversationsData.map((item, index) => {
                                        const activeChannel = item.conversationSid === selectedChannelSid;
                                        const channelItemClassName = `channel-item${activeChannel ? ' channel-item--active' : ''}`;
                                        const currentDate = new Date().setHours(0, 0, 0, 0);
                                        const itemDate = new Date(item.createdDate).setHours(0, 0, 0, 0);
                                        let formattedDate;
                                        if (itemDate === currentDate) {
                                            formattedDate = new Date(item.createdDate).toLocaleTimeString();
                                        } else {
                                            formattedDate = new Date(item.createdDate).toLocaleDateString();
                                        }
                                        const lastMessageList = messagesConvo[messagesConvo.length - 1];
                                        return (
                                            <>
                                                <li
                                                    key={index}
                                                    onClick={async (event) => {
                                                        const accountSid = 'AC9b5b398f427c9c925f18f3f1e204a8e2';
                                                        const authToken = 'd38e2fd884be4196d0f6feb0b970f63f';
                                                        const conversationSid = item.conversationSid; // Replace with the actual conversationSid
                                                        const url = `https://conversations.twilio.com/v1/Conversations/${conversationSid}/Messages`;
                                                        const credentials = `${accountSid}:${authToken}`;
                                                        const base64Credentials = btoa(credentials);
                                                        fetch(url, { method: 'GET', headers: { 'Authorization': `Basic ${base64Credentials}` } })
                                                            .then(response => response.json())
                                                            .then(data => {
                                                                setMessagesConvo(data.messages);
                                                            })
                                                            .catch(error => console.error('Error:', error));
                                                        setSelectedChannelSid(item.conversationSid);
                                                        setChannelName(item.author || item.sid)
                                                        console.log(smsMenu, 'smsMenu')
                                                        handleConversationClick(item.conversationSid)
                                                        // console.log(selectedChannelSid)
                                                    }}
                                                    className={`m-2 mx-auto mb-auto w-[95%] cursor-pointer rounded-md border  border-[#ffffff4d] hover:border-primary hover:text-primary active:border-primary${activeChannel ? ' channel-item--active' : ''}`}                    >
                                                    <div className=' w-[95%] '>
                                                        <input type='hidden' name='conversationSid' defaultValue={item} />
                                                        <input type='hidden' name='intent' defaultValue='getConversation' />
                                                        <div className="m-2 flex items-center justify-between">
                                                            <span className="text-lg font-bold text-foreground">
                                                                <strong>{item.author || item.author}</strong>
                                                            </span>
                                                            <p className={`text-sm text-[#ffffff7c] ${activeChannel ? ' channel-item--active text-foreground' : ''}`}>
                                                                {formattedDate}
                                                            </p>
                                                        </div>
                                                        <p className={`m-2 text-sm text-[#ffffff7c] ${activeChannel ? ' channel-item--active text-foreground' : ''}`}>
                                                            {conversationsData && conversationsData.length > 0 && conversationsData[0].body
                                                                ? conversationsData[0].body.split(' ').slice(0, 12).join(' ')
                                                                : ''}
                                                        </p>
                                                    </div>
                                                </li>
                                            </>
                                        );
                                    })}
                                </ul>
                            )}
                            {sms === false && (
                                <ul className="top-0 overflow-y-scroll grow" >
                                    {conversationsData.map((item, index) => {
                                        const activeChannel = item.conversationSid === selectedChannelSid;
                                        const channelItemClassName = `channel-item${activeChannel ? ' channel-item--active' : ''}`;
                                        const currentDate = new Date().setHours(0, 0, 0, 0);
                                        const itemDate = new Date(item.createdDate).setHours(0, 0, 0, 0);
                                        let formattedDate;
                                        if (itemDate === currentDate) {
                                            formattedDate = new Date(item.createdDate).toLocaleTimeString();
                                        } else {
                                            formattedDate = new Date(item.createdDate).toLocaleDateString();
                                        }
                                        const lastMessageList = messagesConvo[messagesConvo.length - 1];
                                        return (
                                            <>
                                                <li
                                                    key={index}
                                                    onClick={async (event) => {
                                                        const accountSid = 'AC9b5b398f427c9c925f18f3f1e204a8e2';
                                                        const authToken = 'd38e2fd884be4196d0f6feb0b970f63f';
                                                        const conversationSid = item.conversationSid; // Replace with the actual conversationSid
                                                        const url = `https://conversations.twilio.com/v1/Conversations/${conversationSid}/Messages`;
                                                        const credentials = `${accountSid}:${authToken}`;
                                                        const base64Credentials = btoa(credentials);
                                                        fetch(url, { method: 'GET', headers: { 'Authorization': `Basic ${base64Credentials}` } })
                                                            .then(response => response.json())
                                                            .then(data => {
                                                                setMessagesConvo(data.messages);
                                                            })
                                                            .catch(error => console.error('Error:', error));
                                                        setSelectedChannelSid(item.conversationSid);
                                                        setChannelName(item.author || item.sid)
                                                        console.log(smsMenu, 'smsMenu')

                                                        //  console.log(selectedChannelSid)
                                                    }}
                                                    className={`m-2 mx-auto mb-auto w-[95%] cursor-pointer rounded-md border  border-[#ffffff4d] hover:border-primary hover:text-primary active:border-primary${activeChannel ? ' channel-item--active' : ''}`}                    >
                                                    <div className=' w-[95%] '>
                                                        <input type='hidden' name='conversationSid' defaultValue={item} />
                                                        <input type='hidden' name='intent' defaultValue='getConversation' />
                                                        <div className="m-2 flex items-center justify-between">
                                                            <span className="text-lg font-bold text-foreground">
                                                                <strong>{item.author || item.author}</strong>
                                                            </span>
                                                            <p className={`text-sm text-[#ffffff7c] ${activeChannel ? ' channel-item--active text-foreground' : ''}`}>
                                                                {formattedDate}
                                                            </p>
                                                        </div>
                                                        <p className={`m-2 text-sm text-[#ffffff7c] ${activeChannel ? ' channel-item--active text-foreground' : ''}`}>
                                                            {conversationsData && conversationsData.length > 0 && conversationsData[0].body
                                                                ? conversationsData[0].body.split(' ').slice(0, 12).join(' ')
                                                                : ''}
                                                        </p>
                                                    </div>
                                                </li>
                                            </>
                                        );
                                    })}
                                </ul>
                            )}
                        </div>
                    </div >
                )}
            </>


        );

    }
    if (isMobileDevice === true) {
        <>
            <p>
                mobile device</p></>
    }
    return <Loader2 className="animate-spin" />;
}


function SendMessage(item, user) {
    const accountSid = 'AC9b5b398f427c9c925f18f3f1e204a8e2';
    const authToken = 'd38e2fd884be4196d0f6feb0b970f63f';
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
