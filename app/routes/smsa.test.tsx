import { LoaderFunction, json } from '@remix-run/node';
import React, { useEffect, useState, useRef } from 'react';
import { Button } from '~/components';
import { getSession } from "~/sessions/auth-session.server";
import { prisma } from "~/libs";
import { GetUser } from "~/utils/loader.server";
import { useLoaderData, useLocation } from '@remix-run/react';
import { ChevronLeft } from 'lucide-react';

export async function loader({ request, params }: LoaderFunction) {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")


  const user = await GetUser(email)
  /// console.log(user, account, 'wquiote loadert')
  const staffMembers = await prisma.user.findMany({})
  if (!user) {
    redirect('/login')
  }
  const getMessages = await prisma.staffChat.findMany({
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
  const [conversation, SetConversation] = useState('list');
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



  const sortedConversations = sortConversationsByStaffMember();

  return (
    <>
      {conversation === 'conversation' && (
        <div className='w-full' >
          <p>Conversation</p>
          {/* Render conversation content */}
        </div>
      )}

      {conversation === 'list' && (
        <div className="w-full">
          {filteredStaffMembers.map(member => (
            <div key={member.email}>
              <h3>{member.name}</h3>
              <ul>
                {sortedConversations[member.email] ? (
                  <li key={sortedConversations[member.email].id}>
                    {sortedConversations[member.email].message}
                  </li>
                ) : (
                  <li>No conversations found</li>
                )}
              </ul>
            </div>
          ))}
        </div>
      )}

      {conversation === 'largeScreen' && (
        <div className="flex">
          <div className="md:w-1/3">
            {filteredStaffMembers.map(member => (
              <div key={member.email}>
                <ul>
                  {sortedConversations[member.email] ? (
                    <li key={sortedConversations[member.email].id} className={`m-2 mx-auto mb-auto w-[95%] cursor-pointer rounded-md border  border-[#ffffff4d] hover:border-[#02a9ff] hover:text-[#02a9ff] active:border-[#02a9ff]${activeChannel ? ' channel-item--active' : ''}`} >
                      <div className=' w-[95%] '>
                        <div className="m-2 flex items-center justify-between">
                          <span className="text-lg font-bold text-white">
                            <strong>{member.name || member.name}</strong>
                          </span>
                          <p className={`text-sm text-[#ffffff7c] ${activeChannel ? ' channel-item--active text-white' : ''}`}>
                            {formattedDate}
                          </p>
                        </div>
                        <p className={`m-2 text-sm text-[#ffffff7c] ${activeChannel ? ' channel-item--active text-white' : ''}`}>
                          {conversationsData && conversationsData.length > 0 && conversationsData[0].body
                            ? conversationsData[0].body.split(' ').slice(0, 12).join(' ')
                            : ''}
                        </p>
                      </div>
                    </li>
                  ) : (
                    <li>No conversations found</li>
                  )}
                </ul>
              </div>
            ))}
          </div>
          <div className="md:w-2/3">
            <p>Conversation</p>
            {/* Render conversation content */}
          </div>
        </div>
      )}
    </>
  );
}
