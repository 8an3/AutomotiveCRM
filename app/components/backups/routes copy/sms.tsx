import { ScrollArea } from "~/other/scrollarea";
import { Event, Message } from '@microsoft/microsoft-graph-types';
import { add, endOfWeek, format, getDay, parseISO, startOfWeek } from 'date-fns';
//import { composeEmail, createMailFolder, createtestFolder, deleteMessage, forwardEmail, getAllFolders, getDrafts, getDraftsList, getEmailById, getEmailById2, getEmailList, getEmails, getFolders, getInbox, getInboxList, getJunk, getJunkList, getList, getSent, getTrash, getTrashList, getUserWeekCalendar, gettestFolderList, listAttachment, messageDone, messageRead, messageUnRead, replyAllEmail, replyMessage, testInbox, } from './GraphService';
//import { useAppContext } from './AppContext';
import { Controller, useController, useForm } from "react-hook-form";

import axios from "axios";
import { toast } from "sonner"
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

import {
  Archive, Clock, Inbox, Trash,
  Reply, ReplyAll, Forward, MoreVertical, Folder
} from "lucide-react";
import { Badge, Button, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui";
import { Textarea } from "~/other/textarea";
import { useEffect, useState } from "react";
import { useLoaderData } from "@remix-run/react";
//import { authenticator } from "~/services";
import { model } from "~/models";
import { useRootLoaderData } from "~/hooks";

export async function loader({ params, request }) {
  const userSession = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  const user = await model.user.query.getForSession({ id: userSession.id });
  return user
}
// follow this
// https://github.com/Azure-Samples/ms-identity-javascript-nodejs-tutorial/blob/main/2-Authorization/1-call-graph/App/controllers/mainController.js
// https://learn.microsoft.com/en-us/entra/identity-platform/scenario-web-app-call-api-call-api?tabs=aspnetcore
// https://learn.microsoft.com/en-us/entra/identity-platform/quickstart-web-app-nodejs-msal-sign-in

export default function EmailClient() {
  function useAppContext() {
    return null
  }
  function testInbox() {
    return null
  }
  function getDrafts() {
    return null
  }
  function getJunk() {
    return null
  }
  function getInbox() {
    return null
  }
  function getAllFolders() {
    return null
  }
  const app = useAppContext();
  const { user } = useRootLoaderData()
  console.log(user, 'user111122111')
  const [editorState, setEditorState] = useState();
  const [emails, setEmails] = useState([]);
  const [emailItems, setEmailItems] = useState<Message[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Message>();
  const [selectedLine, setSelectedLine] = useState(null);
  const [details, setDetails] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenFolders, setIsOpenFolders] = useState(false);
  const [email, setEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();


  const smsMessages = [
    {
      id: 1,
      sender: '6136136134',
      recipient: '6138980992',
      text: 'Hello Jane, how are you?',
      timestamp: new Date('2024-01-04T10:00:00'),
    },
    {
      id: 2,
      sender: '6136136134',
      recipient: '6138980992',
      text: 'Hi John, I am fine. How about you?',
      timestamp: new Date('2024-01-04T10:05:00'),
    },
    {
      id: 4,
      sender: '6138980992',
      recipient: '6136136134',
      text: 'Hi John, I am fine. How about you?',
      timestamp: new Date('2024-01-04T10:07:00'),
    },
    {
      id: 3,
      sender: 'John Doe',
      recipient: 'Alice',
      text: 'Hello Alice, are you there?',
      timestamp: new Date('2024-01-04T10:00:00'),
    },
    // Add more messages as needed
  ];

  const [text, setText] = useState('')

  const handleTextClick = (text) => {
    setText(text)
    setSelectedGroup(key);

  };
  const groupedMessages = smsMessages.reduce((acc, sms) => {
    if (!acc[sms.sender] || acc[sms.sender].timestamp < sms.timestamp) {
      acc[sms.sender] = sms;
    }
    return acc;
  }, {});

  const latestMessages = Object.values(groupedMessages);

  interface Sms {
    id: number;
    sender: string;
    recipient: string;
    text: string;
    timestamp: Date;
  }
  const groupedMessages2 = smsMessages.reduce((acc, sms) => {
    let key = sms.sender === user.phone ? sms.recipient : sms.sender;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(sms);
    return acc;
  }, {} as Record<string, Sms[]>);
  //const phone = user.phone
  //console.log(user, user.phone)
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);



  return (
    <div className="flex w-[80%] h-[95%] border-1 border mx-auto border-[#3b3b3b]">


      <div className="emailList w-[35%] border-r border-[#3b3b3b]">
        <div className="border-b border-[#3b3b3b] flex justify-between items-center">
          <Button name='intent' value='newLead' type='submit' className={`m-2 cursor-pointer mr-2 p-3 hover:text-[#02a9ff] hover:border-[#02a9ff] text-[#fff] border border-[#fff] font-bold uppercase text-xs rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all text-center duration-150 `}
          >
            Start Chat
          </Button>
        </div>
        <div className=" ">
          <div>
            <Input name="search" placeholder="Search" className='bg-[#000] text-[#fff] border border-[#ffffff4d] m-2 w-[95%] mx-auto focus:border-[#02a9ff]' />
          </div>
          <div className="max-h-[770px] h-auto overflow-y-auto">
            {latestMessages.filter((sms: Sms) => sms.sender !== user.phone).map((sms) => (
              <div key={sms.id} className="border border-[#ffffff4d] rounded-md m-2 w-[95%] mx-auto hover:border-[#02a9ff] hover:text-[#02a9ff]  active:border-[#02a9ff] cursor-pointer"
                onClick={() => handleTextClick(sms)}>
                <div className="flex justify-between m-2 ">
                  <p className="text-[#fff] text-lg text-bold">{sms.sender}</p>
                  <p className="text-[#ffffffb4] text-sm text-bold">{new Date(sms.timestamp).toLocaleString()}</p>
                </div>
                <p className="text-[#ffffff94] text-sm m-2">{sms.text.split(' ').slice(0, 25).join(' ')}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {text && (
        <div>
          {selectedGroup && groupedMessages2[selectedGroup].map((message, index) => (
            <div key={index} className="email w-[60%] flex flex-col max-h-[770px] flex-grow h-auto overflow-y-auto">
              <div className="flex rounded-md m-2 relative  bg-black ">
                <div>
                  <p className="text-[#fff] text-sm m-2 right-2 top-2">
                    {new Date(message.timestamp).toLocaleString()}
                  </p>
                  <p className="text-[#fff] text-sm m-2">
                    {message.text}
                  </p>
                </div>
              </div>
            </div>
          ))}
          <div className="border-1 border-[#3b3b3b] rounded-md border-t justify-end items-end mb-2">
            <Textarea className="m-2 w-[98%] mx-auto" placeholder="Reply to text..." />
            <div className="flex justify-between mx-2">
              <Button
                onClick={() => {
                  toast.success(`Email saved!`)
                }}
                name='intent' value='newLead' type='submit'
                className={` cursor-pointer mr-2 p-3 hover:text-[#02a9ff] hover:border-[#02a9ff] text-[#fff] border border-[#fff] font-bold uppercase text-xs rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all text-center duration-150 `}
              >
                Save Template
              </Button>
              <Button
                onClick={() => {
                  toast.success(`Text sent!`)
                }}
                name='intent' value='newLead' type='submit'
                className={` cursor-pointer mr-2 p-3 hover:text-[#02a9ff] hover:border-[#02a9ff] text-[#fff] border border-[#fff] font-bold uppercase text-xs rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all text-center duration-150 `}
              >
                Send
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
