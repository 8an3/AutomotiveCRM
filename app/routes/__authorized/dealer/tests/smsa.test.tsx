import { LoaderFunction, json } from '@remix-run/node';
import React, { useEffect, useState, useRef } from 'react';
import { Button, Input } from '~/components';
import { getSession } from "~/sessions/auth-session.server";
import { prisma } from "~/libs";
import { Form, useLoaderData, useLocation } from '@remix-run/react';
import { ChevronLeft } from 'lucide-react';
import { toast } from "sonner"
import ChatMessages from '~/components/sms/ChatMessage';
import slider from '~/styles/slider.css'
import ChatChannel from '~/styles/ChatChannel.css'
import { GetUser } from "~/utils/loader.server";

export const links: LinksFunction = () => [
    { rel: "stylesheet", href: slider },
    { rel: "stylesheet", href: ChatChannel },

];
export async function loader({ request, params }: LoaderFunction) {
    const session = await getSession(request.headers.get("Cookie"));
    const email = session.get("email")


    const user = await GetUser(email)
    /// console.log(user, account, 'wquiote loadert')
    const staffMembers = await prisma.user.findMany({})
    if (!user) {
        redirect('/login')
    }
    const getMessages = await prisma.staffChat.findMany()


    const getMessagesLobby = await prisma.staffChat.findMany({
        where: {
            room: 'lobby'
        }
    })
    const getTemplates = await prisma.emailTemplates.findMany({ where: { userEmail: user?.email, }, });

    console.log(getMessages)
    return json({ user, staffMembers, getMessages, getTemplates });
}

export default function SMSConv() {
    const { user, staffMembers, getMessages, getTemplates } = useLoaderData()
    const [templates, setTemplates] = useState(getTemplates);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const messagesRef = useRef(null);

    const [text, setText] = useState('');

    const handleChange = (event) => {
        const selectedTemplate = templates.find(template => template.title === event.target.value);
        setSelectedTemplate(selectedTemplate);

    };
    React.useEffect(() => {
        if (selectedTemplate) {
            setText(selectedTemplate.body);
        }
    }, [selectedTemplate]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [conversation, setConversation] = useState('list');
    const $form = useRef<HTMLFormElement>(null);
    const { key } = useLocation();
    useEffect(
        function clearFormOnSubmit() {
            $form.current?.reset();
        },
        [key],
    );
    const handleConversationClick = (conversationId) => {
        setSelectedConversation(conversationId);
        if (conversation !== 'list') {
            setConversation('list')
        }
        if (conversation === 'list') {
            setConversation('conversation')
        }
    };



    // Function to handle resizing and change conversation layout
    const handleScreenSizeChange = () => {
        const isLargeScreen = window.innerWidth >= 1025;
        setConversation(isLargeScreen ? 'largeScreen' : 'list');
    };

    useEffect(() => {
        handleScreenSizeChange();
        window.addEventListener('resize', handleScreenSizeChange);
        return () => window.removeEventListener('resize', handleScreenSizeChange);
    }, []);
    const conversations = [
        {
            id: 1,
            createdAt: '2024-03-30T11:21:07.429Z',

            to: 'thecodedbeard@gmail.com',
            toName: 'codedBeard',
            sender: 'skylerzanth@gmail.com',
            senderName: 'skyler',
            message: 'Hey',
            room: '',
            token: '',
        },
        {
            createdAt: '2024-03-30T11:26:07.429Z',

            id: 2,
            to: 'thecodedbeard@gmail.com',
            toName: 'codedBeard',
            sender: 'skylerzanth@gmail.com',
            senderName: 'skyler',
            message: 'sup',
            room: '',
            token: '',
        }
    ];
    const filteredStaffMembers = staffMembers.filter(member => member.email !== user.email);

    const sortConversationsByStaffMember = () => {
        const sortedConversations = {};

        filteredStaffMembers.forEach(member => {
            const memberConversations = conversations.filter(conversation => conversation.to === member.email);
            const latestConversation = memberConversations.reduce((latest, current) => {
                return new Date(current.createdAt) > new Date(latest.createdAt) ? current : latest;
            }, memberConversations[0]);

            sortedConversations[member.email] = latestConversation || null;
        });

        return sortedConversations;
    };

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const [selectedStaffChatSid, setSelectedStaffChatSid] = useState([])
    const [staffConvo, setStaffConvo] = useState([])
    const [staffRoom, setStaffRoom] = useState([])
    const [staffChat_sid, setStaffChat_sid] = useState();
    const [channelName, setChannelName] = useState(); setChannelName
    const [messagesConvo, setMessagesConvo] = useState([]);

    const sortedConversations = sortConversationsByStaffMember();
    let staffChatContent;
    if (selectedStaffChatSid) {

        staffChatContent = (
            <div onClick={() => { }} id="OpenChannel" className='text-foreground'>
                <div className="flex justify-between border-b border-border">
                    <div className='flex align-middle'>

                        {conversation === 'list' || conversation === 'conversation' && (
                            <Button variant='outline' onClick={() => setConversation('list')}>
                                <ChevronLeft color="#ffffff" strokeWidth={1.5} />
                            </Button>
                        )}


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
                    <ChatMessages identity={user.email} messages={messagesConvo} messagesRef={messagesRef} />
                </div>
                <div className="mt-auto   rounded-md  border-border">

                    <Form ref={$form} method="post"  >
                        <input className='w-full p-2' type="hidden" name='sender' defaultValue={user.email} />
                        <input className='w-full p-2' type="hidden" name='intent' defaultValue='sendMessage' />
                        <input className='w-full p-2' type="hidden" name='conversationSid' defaultValue={staffChat_sid} />

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
                                if (selectedStaffChatSid) {
                                    setStaffChat_sid(selectedStaffChatSid)
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
    } else {
        staffChatContent = "No messages.";
    }
    return (
        <>
            {conversation === 'conversation' && (
                <div className='w-full'>
                    {staffChatContent}


                </div>
            )}

            {conversation === 'list' && (
                <div className="w-full">
                    {filteredStaffMembers.map(member => (
                        <div key={member.email}>
                            <h3>{member.name}</h3>
                            <ul>
                                {sortedConversations[member.email] ? (
                                    <li key={sortedConversations[member.email].id} onClick={() => {
                                        setConversation('conversation');
                                        setChannelName(member.toName || member.email);

                                        const url = `/sms/staffMessage/${member.email}`;
                                        fetch(url, { method: 'GET' })
                                            .then(response => response.json())
                                            .then(data => {
                                                setMessagesConvo(data.messages);
                                            })
                                            .catch(error => console.error('Error:', error));
                                    }}>
                                        {sortedConversations[member.email].message}
                                    </li>
                                ) : (
                                    <li> </li>
                                )}
                            </ul>
                        </div>
                    ))}
                </div>
            )}

            {conversation === 'largeScreen' && (
                <div className="flex">
                    <div className="md:w-1/3">
                        {filteredStaffMembers.map(member => {
                            const activeChannel = member.email === selectedStaffChatSid;
                            return (
                                <div key={member.email}>
                                    <ul>
                                        {sortedConversations[member.email] ? (
                                            <li
                                                key={sortedConversations[member.email].id}
                                                onClick={async () => {
                                                    setSelectedStaffChatSid(member.email);
                                                    setChannelName(member.toName || member.email);
                                                }}
                                                className={`m-2 mx-auto mb-auto w-[95%] cursor-pointer rounded-md border border-[#ffffff4d] hover:border-primary hover:text-primary active:border-primary${activeChannel ? ' channel-item--active' : ''}`}
                                            >
                                                <div className='w-[95%]'>
                                                    <div className="m-2 flex items-center justify-between">
                                                        <span className="text-lg font-bold text-foreground">
                                                            <strong>{member.name || member.name}</strong>
                                                        </span>
                                                        <p className={`text-sm text-[#ffffff7c] ${activeChannel ? ' channel-item--active text-foreground' : ''}`}>
                                                            {sortedConversations[member.email].createdAt}
                                                        </p>
                                                    </div>
                                                    <p className={`m-2 text-sm text-[#ffffff7c] ${activeChannel ? ' channel-item--active text-foreground' : ''}`}>
                                                        {sortedConversations[member.email].message ? (
                                                            sortedConversations[member.email].message//.body.split(' ').slice(0, 12).join(' ')
                                                        ) : (
                                                            ' '
                                                        )}
                                                    </p>
                                                </div>
                                            </li>
                                        ) : (
                                            <li> </li>
                                        )}
                                    </ul>
                                </div>
                            );
                        })}
                    </div>
                    <div className="md:w-2/3">
                        {staffChatContent}
                    </div>
                </div>
            )}
        </>
    );

}
