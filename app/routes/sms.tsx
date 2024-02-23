import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, } from "~/components/ui/accordion"
import { toast } from "sonner"
import { Archive, MailWarning, DollarSign, Clock, MailCheck, Twitter, RefreshCw, FormInput, Inbox, Reply, ReplyAll, Forward, MoreVertical, Star, Folder, MailQuestion, ShieldAlert, MessageCircle, Loader2, } from "lucide-react";
import { Badge, Button, Input, Label, Select, SelectContent, SelectGroup, SelectLabel, SelectItem, SelectTrigger, SelectValue, Tabs, TabsContent, TabsList, TabsTrigger, ButtonLoading } from "~/components/ui";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { DataFunctionArgs, json, type LoaderFunction } from '@remix-run/node';

//import { getSession, commitSession, } from '../services/auth.server'

import { model } from "~/models";
//import { authenticator } from "~/services";
import { useLoaderData, useNavigation } from '@remix-run/react';
import { prisma } from "~/libs";
import { ContextMenu, ContextMenuCheckboxItem, ContextMenuContent, ContextMenuItem, ContextMenuLabel, ContextMenuRadioGroup, ContextMenuRadioItem, ContextMenuSeparator, ContextMenuShortcut, ContextMenuSub, ContextMenuSubContent, ContextMenuSubTrigger, ContextMenuTrigger, } from "~/components/ui/context-menu"
import { Dialog as Dialog1, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from "~/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger, } from "~/components/ui/dropdown-menu"
import { MessageAlert, SendMail, Mail, Message, User, BinHalf, Calendar as CalendarIcon, Telegram, Trash, MessageText } from "iconoir-react";
import OpenAI from "openai";
import { unstable_batchedUpdates } from 'react-dom';
import { Textarea } from "~/other/textarea";
import { getSession, commitSession, destroySession } from '../sessions/auth-session.server'
import { google } from 'googleapis';
import axios from "axios";
import { RefreshToken } from "~/services/google-auth.server";
import Sidebar from "~/components/shared/sidebar";
// <Sidebar />
import { requireAuthCookie } from '~/utils/misc.user.server';


export async function loader({ params, request }: DataFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")

  const user = await model.user.query.getForSession({ email: email });
  /// console.log(user, account, 'wquiote loadert')
  if (!user) {
    redirect('/login')
  }



  return user;
}


//unreadData.messages.map(async (email) => {
// const emailDetails = await fetch(`https://gmail.googleapis.com/gmail/v1/users/${user.email}/messages/${email.id}?format=full&key=${API_KEY}`, { headers: { Authorization: 'Bearer ' + tokens, Accept: 'application/json' } });

// const senderName = emailDetails.payload.headers.find(header => header.name === 'From').value;
//}


export default function EmailClient() {

  const { labelData, unreadEmails, tokens, user, API_KEY, getTemplates, emailDetails } = useLoaderData()

  console.log(labelData)



  const [label, setLabel] = useState('Unread')
  const [unread, setUnread] = useState('')
  const [draft, setDraft] = useState('')
  const [chat, setChat] = useState('')
  const [trash, setTrash] = useState('')
  const [reply, setReply] = useState(false)
  const [templates, setTemplates] = useState(getTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [text, setText] = useState('');
  const [composeEmail, setComposeEmail] = useState(false);
  const [subject, setSubject] = useState('');
  const [mailData, setMailData] = useState('');
  const [which, setWhich] = useState('');
  const [RenameFolderInput, setRenameFolderInput] = useState(false);
  const [folderBeingRenamed, setFolderBeingRenamed] = useState('test');
  const [renameLabel, setRenameLabel] = useState('');
  const [to, setTo] = useState('');
  const [cc, setCC] = useState('');
  const [bcc, setBcc] = useState('');
  const [emailHtml, setEmailHtml] = useState('');
  const [selectedEmail, setSelectedEmail] = useState();
  const [loading, setLoading] = useState(false);
  const [nextPageToken, setNextPageToken] = useState(false);
  const [folderNameState, setFolderNameState] = useState(false);
  const [labelName, setLabelName] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  // const [emails, setEmails] = useState([]);
  const [emails, setEmails] = useState([])
  const [chats, setChats] = useState([])

  const sampleMessages = [
    {
      id: 1,
      user: "Alice",
      message: "Hey, are you free this weekend?",
      timestamp: new Date("2022-01-01T08:00:00"),
    },
    {
      id: 2,
      user: "Bob",
      message: "Yeah, I don't have any plans. What's up?",
      timestamp: new Date("2022-01-01T08:05:00"),
    },
    {
      id: 3,
      user: "Alice",
      message: "I was thinking we could go hiking. The weather is supposed to be nice.",
      timestamp: new Date("2022-01-01T08:10:00"),
    },
    {
      id: 4,
      user: "Bob",
      message: "That sounds great! I'll bring the snacks.",
      timestamp: new Date("2022-01-01T08:15:00"),
    },
    {
      id: 5,
      user: "Alice",
      message: "Perfect, I'll bring the water. Let's meet at the trailhead at 9 AM.",
      timestamp: new Date("2022-01-01T08:20:00"),
    },
    {
      id: 6,
      user: "Bob",
      message: "See you then!",
      timestamp: new Date("2022-01-01T08:25:00"),
    },
  ];
  useEffect(() => {

    setChats([sampleMessages])


  }, [])
  // https://www.twilio.com/en-us/blog/build-a-chat-app-with-twilio-programmable-chat-and-react
  // https://github.com/huzaima/react-twilio-chat
  return (

    <>
      <Sidebar />
      <div className="border-1 mx-auto flex w-[95%] h-[95vh] border border-[#3b3b3b] mt-[50px]">
        <div className="chatList w-[30%] border-r border-[#3b3b3b]">

        </div>
        <div className="chatroom flex h-full w-[70%]  flex-col">
          <div className="h-[75vh] overflow-y-scroll overflow-x-hidden" >
            {
              chats.map((chat, index) => {
                if (chat.user === user) return <ChatSender key={index} message={chats.message} user={chats.user} />
                return <ChatReciever key={index} message={chats.message} user={chats.user} />
              })
            }
          </div>
        </div>
      </div>
    </>
  )
}

function ChatReciever({ user, message }) {
  return (
    <div className='flex justify-start flex-row'>
      <p className='p-10 border-10 border max-w-[60%]'>
        <strong className='text-[13px]'>
          {user}
        </strong> <br></br>
        {message}
      </p>
    </div>
  )
}
function ChatSender({ user, message }) {
  return (
    <div className='flex pr-10 justify-end flex-row'>
      <p className='p-10 border-10 border max-w-[60%]'>
        <strong className='text-[13px]'>
          {user}
        </strong> <br></br>
        {message}
      </p>
    </div>
  )
}
