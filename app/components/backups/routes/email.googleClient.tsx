import { Container } from "@radix-ui/themes";

import NotificationSystem from "./notifications";
import slider from '~/styles/slider.css'
import { Accordion, AccordionContenSendEmailt, AccordionItem, AccordionTrigger, } from "~/components/ui/accordion"
import { toast } from "sonner"
import { Archive, MailWarning, DollarSign, Clock, MailCheck, Twitter, RefreshCw, FormInput, Inbox, Reply, ReplyAll, Forward, MoreVertical, Star, Folder, MailQuestion, ShieldAlert, MessageCircle, Loader2, } from "lucide-react";
import { Badge, Button, Input, Label, Select, SelectContent, SelectGroup, SelectLabel, SelectItem, SelectTrigger, SelectValue, Tabs, TabsContent, TabsList, TabsTrigger, ButtonLoading } from "~/components/ui";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { DataFunctionArgs, json, redirect, type LoaderFunction, createCookie, LinksFunction } from '@remix-run/node';
import { model } from "~/models";
import { Outlet, useLoaderData, useNavigation, Form, useLocation } from '@remix-run/react';
import { GetUser } from "~/utils/loader.server";
import { prisma } from "~/libs";
import { ContextMenu, ContextMenuCheckboxItem, ContextMenuContent, ContextMenuItem, ContextMenuLabel, ContextMenuRadioGroup, ContextMenuRadioItem, ContextMenuSeparator, ContextMenuShortcut, ContextMenuSub, ContextMenuSubContent, ContextMenuSubTrigger, ContextMenuTrigger, } from "~/components/ui/context-menu"
import { Dialog as Dialog1, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from "~/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger, } from "~/components/ui/dropdown-menu"
import { MessageAlert, SendMail, Mail, Message, User, BinHalf, Calendar as CalendarIcon, Telegram, Trash, MessageText } from "iconoir-react";
import OpenAI from "openai";
import { Textarea } from "~/other/textarea";
import { getSession, commitSession, destroySession } from '../sessions/auth-session.server'
import { google } from 'googleapis';
import Sidebar from "~/components/shared/sidebar";
import getAccessToken, { ensureClient, GetLabel, SetToUnread, SendEmail, MoveEmail, MoveToInbox, SetToTrash2, SaveDraft, Unauthorized } from "~/routes/email.server";
import { templateServer } from "~/utils/emailTemplates/template.server";
import { Cross2Icon } from '@radix-ui/react-icons';
import financeFormSchema from "./overviewUtils/financeFormSchema";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/components/ui/hover-card"
import axios from "axios";
import { EditorTiptapHook, Editor, onUpdate } from "~/components/libs/editor-tiptap";


export const links: LinksFunction = () => [{ rel: "stylesheet", href: slider },];


export async function loader({ params, request }: DataFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")
  const user = await GetUser(email)

  if (!user) { redirect('/login') }
  const API_KEY = 'AIzaSyCsE7VwbVNO4Yw6PxvAfx8YPuKSpY9mFGo'
  let tokens = session.get("accessToken")
  // new
  const refreshToken = session.get("refreshToken")
  let cookie = createCookie("session_66", {
    secrets: ['secret'],
    // 30 days
    maxAge: 30 * 24 * 60 * 60,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  const userRes = await fetch(`https://gmail.googleapis.com/gmail/v1/users/${user.email}/profile`, {
    headers: { Authorization: 'Bearer ' + tokens, Accept: 'application/json' }
  });
  console.log(userRes, 'userRes')
  // new
  if (userRes.status === 401) {
    const unauthorizedAccess = await Unauthorized(refreshToken)
    tokens = unauthorizedAccess

    session.set("accessToken", tokens);
    await commitSession(session);

    const cookies = cookie.serialize({
      email: email,
      refreshToken: refreshToken,
      accessToken: tokens,
    })
    await cookies
    console.log(tokens, 'authorized tokens')

  } else { console.log('Authorized'); }
  let fetchedEmails;
  async function GetEmailsFromFolder(labelName: any) {
    const getNewListData = await fetch(`https://gmail.googleapis.com/gmail/v1/users/${user.email}/messages?labelIds=${labelName.toUpperCase()}&maxResults=2&key=${API_KEY}`, {
      headers: { Authorization: 'Bearer ' + tokens, Accept: 'application/json', }
    });

    const GetEmailDetails = async (emailId, user, tokens) => {
      const response = await fetch(`https://gmail.googleapis.com/gmail/v1/users/${user.email}/messages/${emailId}?format=full&key=${API_KEY}`, {
        headers: { Authorization: 'Bearer ' + tokens, Accept: 'application/json' }
      });
      if (response.ok) {
        const emailDetails = await response.json();
        return emailDetails;
      } else {
        console.error('Failed to fetch email details:', response.status);
        return null;
      }
    };

    const newListData = await getNewListData.json();
    fetchedEmails = await Promise.all(newListData.messages.map(async (email) => {
      const emailDetails = await GetEmailDetails(email.id, user, tokens);
      const senderName = emailDetails.payload.headers.find(header => header.name === 'From').value;
      const nameMatch = senderName.match(/"([^"]+)"/);
      const nameWithoutQuotes = nameMatch ? nameMatch[1] : senderName;
      const emailWithoutQuotes = senderName.match(/<([^>]+)>/);
      const emailValue = emailWithoutQuotes ? emailWithoutQuotes[1] : '';
      const emailHeaderValue = emailDetails.payload.headers[1].value;
      const dateRegex = /\b(\d{1,2} [a-zA-Z]+ \d{4} \d{2}:\d{2}:\d{2} [-+]\d{4})\b/;
      const match = emailHeaderValue.match(dateRegex);
      const extractedName = nameWithoutQuotes.replace(/<[^>]+>/, '').trim();

      function getBodyData(emailDetails) {
        if (emailDetails.payload.parts) {
          const bodyData1 = emailDetails.payload.parts[1]?.body?.data;
          if (bodyData1) {
            return bodyData1;
          }
          const bodyData0 = emailDetails.payload.parts[0]?.body?.data;
          if (bodyData0) {
            return bodyData0;
          }
        }
        return emailDetails.payload.body?.data || '';
      }

      const bodyData = getBodyData(emailDetails);
      const body = atob(bodyData.replace(/-/g, '+').replace(/_/g, '/'))

      return {
        id: emailDetails.id,
        name: extractedName,
        secondName: senderName,
        subject: emailDetails.payload.headers.find(header => header.name === 'Subject'),
        //   date: match[1],
        labels: emailDetails.labelIds,
        email: emailValue.trim(),
        snippet: emailDetails.snippet,
        body: body,
      };
    }));

    return fetchedEmails;
  }
  const unreadEmails = await GetEmailsFromFolder('UNREAD');
  const getTemplates = await prisma.emailTemplates.findMany({ where: { userEmail: user?.email, }, });
  const getLabels = await fetch(`https://gmail.googleapis.com/gmail/v1/users/${user.email}/labels?key=${API_KEY}`, {
    headers: { Authorization: 'Bearer ' + tokens, Accept: 'application/json' }
  });
  const labelId = 'INBOX'
  const getNewListData = await fetch(`https://gmail.googleapis.com/gmail/v1/users/${user.email}/labels/${labelId}?key=${API_KEY}`, {
    headers: { Authorization: 'Bearer ' + tokens, Accept: 'application/json' },
  });
  const emailDetails = await getNewListData.json();
  const labelData = await getLabels.json();

  /**
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          "role": "system",
          "content": "You will be provided with statements, and your task is to convert them to standard English."
        },
        {
          "role": "user",
          "content": "She no went to the market."
        }
      ],
      temperature: 0,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    console.log(response)*/

  return json({ labelData, API_KEY, user, tokens, getTemplates, request, emailDetails, unreadEmails, refreshToken }, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export async function action({ params, request }: DataFunctionArgs) {
  const formPayload = Object.fromEntries(await request.formData());
  let formData = financeFormSchema.parse(formPayload)
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")

  const user = await GetUser(email)
  if (!user) { redirect('/login') }
  const userEmail = user?.email;
  const userId = user?.id;
  const intent = formData.intent;
  const date = new Date().toISOString()
  const id = formData.id


  if (intent === "createTemplate") {

    const template = await prisma.emailTemplates.create({
      data: {
        name: formData.name,
        body: formData.body,
        date: date,
        title: formData.title,
        category: formData.category,
        userEmail: formData.userEmail,
        review: formData.review,
        attachments: formData.attachments,
        label: formData.label,
        dept: formData.dept,
        type: formData.type,
        subject: formData.subject,
        cc: formData.cc,
        bcc: formData.bcc,
      }
    })
    console.log('create template')

    return json({ template, user });
  }
  return null;
}


export default function EmailClient() {
  const { labelData, unreadEmails, tokens, user, API_KEY, getTemplates, emailDetails, } = useLoaderData()

  const [labelNames, setLabelNames] = useState(labelData.labels)
  function LabelFunction() {
    const labels = labelNames.labels
    return labels
  }
  const nextPage = unreadEmails.nextPageToken
  const [label, setLabel] = useState('Unread')
  const [unread, setUnread] = useState('')
  const [inbox, setInbox] = useState(emailDetails.messagesUnread)
  const [reply, setReply] = useState(false)
  const [composeEmail, setComposeEmail] = useState(false);
  const [which, setWhich] = useState('');
  const [RenameFolderInput, setRenameFolderInput] = useState(false);
  const [folderBeingRenamed, setFolderBeingRenamed] = useState('test');
  const [renameLabel, setRenameLabel] = useState('');
  const [to, setTo] = useState('');
  const [cc, setCC] = useState('');
  const [bcc, setBcc] = useState('');
  const [selectedEmail, setSelectedEmail] = useState();
  const [loading, setLoading] = useState(false);
  const [nextPageToken, setNextPageToken] = useState(false);
  const [folderNameState, setFolderNameState] = useState(false);
  const [labelName, setLabelName] = useState('');
  const [openReply, setOpenReply] = useState(false)
  const [subject, setSubject] = useState('')

  let content;
  let handleUpdate;
  const editor = Editor(content, handleUpdate)
  const [text, setText] = useState('')
  const someFunction = () => {
    onUpdate({ editor, setText, handleUpdate });
  };
  const newEmails = unreadEmails.map(email => ({
    ...email,
    subject: email.subject?.value || null
  }));
  const [emails, setEmails] = useState(newEmails);
  const EmailList = ({ emails, loading }) => {
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";
    return (
      <div className="">

        {emails.map((email, index) => (
          <div key={index} className="m-2 mx-auto w-[95%] cursor-pointer rounded-md border border-[#ffffff4d] hover:border-[#02a9ff]  hover:text-[#02a9ff] active:border-[#02a9ff]" onClick={() => handleEmailClick(email)}>
            {/* All the content inside HoverCardTrigger should be wrapped in a single element */}
            <div>
              <div className="m-2 flex items-center justify-between">
                <p className="text-lg font-bold text-[#fff]">
                  {email.name}
                </p>
                <p className="text-sm text-[#ffffff7c] ">
                  {new Date(email.date).toLocaleString()}
                </p>
              </div>
              <p className="my-2 ml-2 text-sm text-[#ffffffdd]">
                {email.subject}
              </p>
              <p className="my-2 ml-2 text-sm text-[#ffffff7e]">
                {email.snippet ? email.snippet.split(' ').slice(0, 12).join(' ') + '...' : ''}
              </p>
              <div className="flex justify-between">
                <div>
                  {email.labels && email.labels.map((label, labelIndex) => {
                    const displayLabelName = label ? label.replace('CATEGORY_', '') : '';

                    return (
                      <Badge key={labelIndex} className="m-2 border-[#fff] text-[#fff]">
                        {displayLabelName}
                      </Badge>
                    );
                  })}
                </div>
                <div className="flex ml-2 space-x-1">
                  <Button
                    onClick={() => {
                      setSelectedEmail(email);
                      setTimeout(() => {
                        handleReply(selectedEmail)
                      }, 5);
                      SetToRead(email)
                    }}
                    className={`cursor-pointer rounded  p-2 text-center text-xs font-bold uppercase text-[#fff] shadow outline-none transition-all duration-150 ease-linear hover:border-[#02a9ff] hover:text-[#02a9ff] hover:shadow-md focus:outline-none `}>
                    <Reply size={16} color="#f5f4f4" strokeWidth={1.5} className="hover:text-[#02a9ff]" />
                  </Button>
                  <Button
                    onClick={() => {
                      setSelectedEmail(email);
                      setTimeout(() => {
                        handleReplyAll(selectedEmail)
                      }, 5);
                      SetToRead(email)
                    }}
                    className={`cursor-pointer rounded  p-2 text-center text-xs font-bold uppercase text-[#fff] shadow outline-none transition-all duration-150 ease-linear hover:border-[#02a9ff] hover:text-[#02a9ff] hover:shadow-md focus:outline-none `}>
                    <ReplyAll size={16} color="#f5f4f4" strokeWidth={1.5} className="hover:text-[#02a9ff]" />
                  </Button>
                  <Button
                    onClick={() => {
                      setSelectedEmail(email);
                      setTimeout(() => {
                        handleForward(selectedEmail)
                      }, 5);
                      SetToRead(email)
                    }}
                    className={`cursor-pointer rounded  p-2 text-center text-xs font-bold uppercase text-[#fff] shadow outline-none transition-all duration-150 ease-linear hover:border-[#02a9ff] hover:text-[#02a9ff] hover:shadow-md focus:outline-none `}>
                    <Forward size={16} color="#f5f4f4" strokeWidth={1.5} className="hover:text-[#02a9ff]" />
                  </Button>
                  <Button onClick={() => {
                    // handleDeleteClick(selectedEmail)
                    //  console.log(email)
                    SetToTrash(email)
                    toast.success(`Email moved to trash.`)
                    //  setEmails(emails);
                    setTimeout(() => {
                      GetEmailsFromFolder(label);
                    }, 5);
                    setTimeout(() => {
                      setSelectedEmail(emails[1]);
                      setReply(false)
                    }, 10);
                  }}
                    className={`cursor-pointer rounded  p-2 text-center text-xs font-bold uppercase text-[#fff] shadow outline-none transition-all duration-150 ease-linear hover:border-[#02a9ff] hover:text-[#02a9ff] hover:shadow-md focus:outline-none `}>
                    <Trash size={16} color="#ffffff" strokeWidth={1.5} className="hover:text-[#02a9ff]" />
                  </Button>
                </div>
              </div>
            </div>

          </div>
        ))}


        {/*emails.map((mail) => (
          <div key={mail.id} className="m-2 mx-auto w-[95%] cursor-pointer rounded-md border border-[#ffffff4d] hover:border-[#02a9ff]  hover:text-[#02a9ff] active:border-[#02a9ff]" onClick={() => handleEmailClick(mail)}>
            <div className="m-2 flex items-center justify-between">
              <p className="text-lg font-bold text-[#fff]">{mail.name}</p>
              <p className="text-sm text-[#ffffff7c] ">  {new Date(mail.date).toLocaleString()}</p>
            </div>
            <p className="my-2 ml-2 text-sm text-[#ffffffc9]">{mail.subject}</p>
            <div className="flex">

            </div>

          </div>
        ))*/}
        <Form method='post'>
          <ButtonLoading
            size="lg"
            onClick={() => fetchMoreEntries()}
            isSubmitting={isSubmitting}
            loadingText="Fetching more emails..."
            className="w-auto cursor-pointer ml-auto mt-5 hover:text-[#02a9ff] text-white border-white mx-auto mb-2"
          >
            More
          </ButtonLoading>
        </Form>
      </div>
    );
  };
  async function fetchGmailAPI(url, method, body) {
    const response = await fetch(url, {
      method,
      headers: {
        Authorization: 'Bearer ' + tokens,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: body ? JSON.stringify(body) : null
    });
    if (!response.ok) {
      console.error('Failed to fetch:', response.status);
      return null;
    }
    return await response.json();
  }
  const GetEmailDetails = (emailId) => fetchGmailAPI(`https://gmail.googleapis.com/gmail/v1/users/${user.email}/messages/${emailId}?format=full&key=${API_KEY}`, 'GET');
  const SetToTrash = (email) => fetchGmailAPI(`https://gmail.googleapis.com/gmail/v1/users/${user.email}/messages/${email.id}/trash?key=${API_KEY}`, 'POST');
  const CreateLabel = (id) => fetchGmailAPI(`https://gmail.googleapis.com/gmail/v1/users/${user.email}/messages/send?key=${API_KEY}`, 'POST', { "id": id, "payload": { "body": { "data": text } } });
  const DeleteLabel = (label) => fetchGmailAPI(`https://gmail.googleapis.com/gmail/v1/users/${user.email}/messages/send?key=${API_KEY}`, 'DELETE',);
  const handleInputChange = useCallback((e) => {
    setRenameLabel(e.target.value);
  }, []);
  // templates
  const [templates, setTemplates] = useState(getTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const handleChange = (event) => {
    const selectedTemplate = templates.find(template => template.title === event.target.value);
    setSelectedTemplate(selectedTemplate);
  };
  React.useEffect(() => {
    if (selectedTemplate) {
      setText(selectedTemplate.body);
      setSubject(selectedTemplate.subject);
    }
  }, [selectedTemplate]);

  async function HandleGewtLabel(label) {
    const labelData = await GetLabel(label)
    return labelData
  }
  const HandleSendEmail = async (user, to, subject, text) => {
    return sendEmail
  }
  const handleEmailClick = async (email) => {
    if (email && email.id) {
      setSelectedEmail(email);
      console.log('email set to read', email.id)
      setReply(false)
      setOpenReply(true)
      const messageId = email.id
      console.log(messageId, 'messageid')
      const setUNREAD = await SetToRead(email)

      return json({ ok: true, setUNREAD })
    } else {
      console.error('Email object or its id is undefined:', email,);
    }
  };
  async function SetToRead(email) {
    const id = email.id
    console.log(id)
    const modifyId = await fetch(`https://gmail.googleapis.com/gmail/v1/users/${user.email}/messages/${id}/modify?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + tokens,
        Accept: 'application/json',
      },
      body: JSON.stringify({
        removeLabelIds: "UNREAD"
      })
    });
    return json({ modifyId })
  }
  const HandleSetEmails = (fetchedEmails) => {
    setTimeout(() => {
      setEmails(fetchedEmails);
    }, 0);
  }
  const fetchMoreEntries = async () => {
    // Make your API call to get more entries
    // Update the 'emails' state with the new entries
    // setLoading(false) when the data is fetched
    const getNewListData = await fetch(`https://gmail.googleapis.com/gmail/v1/users/${user.email}/messages?labelIds=${label}&maxResults=8&pageToken=${nextPageToken}&key=${API_KEY}`, {
      headers: {
        Authorization: 'Bearer ' + tokens,
        Accept: 'application/json',
      }
    });
    const newListData = await getNewListData.json();
    setNextPageToken(newListData.nextPageToken)
    const fetchedEmails = await Promise.all(newListData.messages.map(async (email) => {
      const emailDetails = await GetEmailDetails(email.id, user, tokens);
      const senderName = emailDetails.payload.headers.find(header => header.name === 'From').value;
      const nameMatch = senderName.match(/"([^"]+)"/);
      const nameWithoutQuotes = nameMatch ? nameMatch[1] : senderName;
      const emailWithoutQuotes = senderName.match(/<([^>]+)>/);
      const emailValue = emailWithoutQuotes ? emailWithoutQuotes[1] : '';
      const emailHeaderValue = emailDetails.payload.headers[1].value;
      const dateRegex = /\b(\d{1,2} [a-zA-Z]+ \d{4} \d{2}:\d{2}:\d{2} [-+]\d{4})\b/;
      const match = emailHeaderValue.match(dateRegex);
      const extractedName = nameWithoutQuotes.replace(/<[^>]+>/, '').trim();
      let html
      let html2
      try {
        const part = emailDetails.payload.parts[1].body.data;
        html = atob(part.replace(/-/g, '+').replace(/_/g, '/'));

        const part2 = emailDetails.payload.body.data
        html2 = atob(part2.replace(/-/g, '+').replace(/_/g, '/'));
        // console.log(html2)
      } catch (error) {
        console.error('Error decoding the data:', error);
      }
      return {
        id: emailDetails.id,
        name: extractedName,
        secondName: senderName,
        subject: emailDetails.payload.headers.find(header => header.name === 'Subject').value,
        date: match[1],
        labels: emailDetails.labelIds,
        email: emailValue.trim(),
        snippet: emailDetails.snippet,
        body: html,
        body2: html2,
      };

    }));

    setEmails(fetchedEmails);
    setLoading(false)
  };
  const handleButtonClick = (item) => {
    setLabel(item.name);
    GetEmailsFromFolder(item.name);
  };
  const LabelList = () => {

    return (
      <>
        <div className="!border-b !border-[#3b3b3b]">
          <Button
            onClick={() => {
              GetEmailsFromFolder('DRAFT')

              setComposeEmail(true)
              setReply(false)
              selectedEmail(null)
            }}
            name='intent' value='newLead' type='submit'
            className={` m-2 w-[90%] cursor-pointer justify-center rounded !border !border-[#fff] p-3 text-center text-xs font-bold uppercase text-[#fff] shadow outline-none transition-all duration-150 ease-linear hover:border-[#02a9ff] hover:text-[#02a9ff] hover:shadow-md focus:outline-none `}
          >
            Compose
          </Button>
        </div>
        <div className="border-b border-[#3b3b3b]">
          <p className="m-2 text-[#fff]"> </p>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className='p-2 text-white'>All Folders</AccordionTrigger>
              <AccordionContent>

                {labelData.labels.map((item, index) => {
                  // Remove 'CATEGORY_' from the label name
                  const displayLabelName = item.name.replace('CATEGORY_', '');
                  //  console.log("Item:", item) // Add this line
                  return (
                    <>

                      <div key={index} className="mx-2 mt-2 flex items-center justify-between">
                        {RenameFolderInput === false ? (
                          <div className="flex">
                            <ContextMenu>
                              <ContextMenuTrigger>
                                <button
                                  name="intent"
                                  value="newLead"
                                  type="submit"
                                  onClick={() => {
                                    //handleButtonClick(item)
                                    HandleGewtLabel(displayLabelName)
                                    setLabel(displayLabelName)
                                    console.log(displayLabelName, 'ddisplayLabelName')


                                  }}
                                  className={`flex cursor-pointer items-center text-center text-[#fff] outline-none transition-all duration-150 ease-linear hover:border-[#02a9ff] hover:text-[#02a9ff] focus:outline-none`}
                                >
                                  {item.name === 'TRASH' && (
                                    <Trash />
                                  )}
                                  {item.name === 'CHAT' && (
                                    <Message strokeWidth={1.5} />
                                  )}
                                  {item.name === 'IMPORTANT' && (
                                    <MessageAlert strokeWidth={1.5} />
                                  )}
                                  {item.name === 'SENT' && (
                                    <SendMail strokeWidth={1.5} />
                                  )}
                                  {item.name === 'INBOX' && (
                                    <Mail strokeWidth={1.5} />
                                  )}
                                  {item.name === 'DRAFT' && (
                                    <MessageText strokeWidth={1.5} />
                                  )}
                                  {item.name === 'SPAM' && (
                                    <BinHalf strokeWidth={1.5} />
                                  )}
                                  {item.name === 'STARRED' && (
                                    <Star strokeWidth={1.5} />
                                  )}
                                  {item.name === 'UNREAD' && (
                                    <Mail strokeWidth={1.5} />
                                  )}
                                  {displayLabelName === 'FORUMS' && (
                                    <FormInput strokeWidth={1.5} />
                                  )}
                                  {displayLabelName === 'UPDATES' && (
                                    <RefreshCw strokeWidth={1.5} />
                                  )}
                                  {displayLabelName === 'PERSONAL' && (
                                    <User strokeWidth={1.5} />
                                  )}
                                  {displayLabelName === 'PROMOTIONS' && (
                                    <DollarSign strokeWidth={1.5} />
                                  )}
                                  {displayLabelName === 'SOCIAL' && (
                                    <Telegram strokeWidth={1.5} />
                                  )}
                                  <p className='ml-2 text-white'>{displayLabelName}</p>
                                </button>
                              </ContextMenuTrigger>
                              <ContextMenuContent className="w-64 bg-white">
                                <ContextMenuItem className='cursor-pointer'
                                  inset
                                  onClick={() => {
                                    setRenameFolderInput(true)
                                    setFolderBeingRenamed(labelName)
                                    setLabelName(labelName)
                                    setRenameLabel(labelName)
                                  }} >
                                  Rename Folder
                                </ContextMenuItem>
                                <Dialog1>
                                  <DialogTrigger asChild>
                                    <ContextMenuItem className='cursor-pointer' inset
                                      onClick={() => {
                                        setComposeEmail(true)
                                        setWhich('replyAll')
                                      }}>
                                      Update Folder
                                    </ContextMenuItem>
                                  </DialogTrigger>
                                  <DialogContent className="z-[2000] bg-white sm:max-w-[425px]">
                                    <DialogHeader>
                                      <DialogTitle>Update Folder</DialogTitle>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                      <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="name" className="text-right">
                                          Name
                                        </Label>
                                        <Input

                                          id="labelName"
                                          defaultValue={labelName}
                                          className="col-span-3"
                                          onChange={(e) => setRenameLabel(e.target.value)}
                                        />
                                      </div>
                                    </div>
                                    <DialogFooter>
                                      <Button
                                        onClick={() => {
                                          RenameLabel(id)
                                          toast.success(`Folder updated.`)
                                        }}
                                      >Save changes</Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog1>

                                <ContextMenuItem className='cursor-pointer' inset
                                  onClick={() => {
                                    DeleteLabel(email, label)
                                    toast.success(`Folder deleted.`)
                                  }} >
                                  Delete Folder
                                </ContextMenuItem>
                                <ContextMenuItem className='cursor-pointer' inset disabled
                                  onClick={() => {
                                    setComposeEmail(true)
                                    setWhich('replyAll')
                                  }}>
                                  Open folder in new tab
                                </ContextMenuItem>
                                <ContextMenuSeparator />

                                <Dialog1>
                                  <DialogTrigger asChild>
                                    <ContextMenuItem className='cursor-pointer' inset
                                      onClick={() => {
                                        setComposeEmail(true)
                                        setWhich('replyAll')
                                      }}>
                                      Create New Folder
                                    </ContextMenuItem>
                                  </DialogTrigger>
                                  <DialogContent className="z-[2000] bg-white sm:max-w-[425px]">
                                    <DialogHeader>
                                      <DialogTitle>Create Folder</DialogTitle>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                      <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="name" className="text-right">
                                          Name
                                        </Label>
                                        <Input
                                          id="labelName"
                                          defaultValue={labelName}
                                          className="col-span-3"
                                          onChange={(e) => setRenameLabel(e.target.value)}
                                        />
                                      </div>
                                    </div>
                                    <DialogFooter>
                                      <Button
                                        onClick={() => {
                                          CreateLabel(id)
                                          toast.success(`Folder created.`)
                                        }}
                                      >Save changes</Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog1>
                              </ContextMenuContent>
                            </ContextMenu>
                          </div>

                        ) : null}
                      </div>
                    </>

                  )
                })}

              </AccordionContent>
            </AccordionItem>
          </Accordion>
          {labelData.labels === folderBeingRenamed ? (
            <div className='grid grid-cols-1 text-white'>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 items-center gap-4">
                  <Label htmlFor="name" className="text-center">
                    Rename Folder
                  </Label>
                  <Input
                    id="labelName"
                    value={renameLabel}
                    className="mx-2 w-auto bg-[#1c2024]"
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className=' mx-2 flex justify-between'>
                <Button
                  className=' mr-2'
                  variant="outline" color="gray" onClick={() => {
                    setRenameFolderInput(false)
                    setLabelName('test')

                  }} >
                  Cancel
                </Button>
                <Button
                  variant='outline'
                  onClick={() => {
                    RenameLabel(id)
                    setRenameFolderInput(false)
                    setLabelName('test')

                    toast.success(`Folder renamed.`)
                  }}
                >
                  Save
                </Button>
              </div>
            </div>

          ) : null}
        </div>
      </>
    );
  };
  const handleReply = (selectedEmail) => {
    setReply(true)
    setWhich('reply')
    console.log(selectedEmail)
    setTo(null)
    //setSubject(null)
    setTimeout(() => {
      setTo(selectedEmail.email)
      setSubject(selectedEmail.subject)
    }, 0);
  };
  const handleDeleteClick = async (email) => {
    //  console.log(email)
    SetToTrash(email)
    toast.success(`Email moved to trash.`)
    await GetEmailsFromFolder(label);
    //  setEmails(emails);
    setTimeout(() => {
      setSelectedEmail(emails[1]);
      setReply(false)
    }, 5);
  };
  const handlesetToUnread = async (email) => {
    //  console.log(email)
    const unreadEmail = await SetToUnread(email.id)
    toast.success(`Email moved to trash.`)
    await GetEmailsFromFolder(label);
    //  setEmails(emails);
    setTimeout(() => {
      setSelectedEmail(emails[1]);
      setReply(false)
    }, 5);
    return unreadEmail
  };

  const handleReplyAll = (selectedEmail) => {
    setWhich('replyAll')
    setReply(true)
    setTo(null)
    setSubject(null)
    setCC(null)
    setBcc(null)
    setTimeout(() => {
      setTo(selectedEmail.email)
      setSubject(selectedEmail.subject)
      setCC(selectedEmail.cc)
      setBcc(selectedEmail.bcc)
    }, 5);
  };
  const handleInboxClick = async (email) => {
    //  console.log(email)
    MoveToInbox(email)
    toast.success(`Email moved to inbox.`)
    await GetEmailsFromFolder('INBOX');
    setEmails(emails);
    setSelectedEmail(email);
    setReply(true)
  };

  const handleForward = (selectedEmail) => {
    setWhich('forward')
    setReply(true)
    setTo(null)
    //  setSubject(null)
    setCC(null)
    setBcc(null)
    setTimeout(() => {
      setTo(selectedEmail.email)
      setText(selectedEmail.body)
      // setSubject(selectedEmail.subject)
      setCC(selectedEmail.cc)
      setBcc(selectedEmail.bcc)
    }, 0);
  };

  let fetchedEmails;
  //console.log(label, 'label1234')
  async function GetEmailsFromFolder(labelName: any) {
    const getNewListData = await fetch(`https://gmail.googleapis.com/gmail/v1/users/${user.email}/messages?labelIds=${labelName.toUpperCase()}&maxResults=8&key=${API_KEY}`, {
      headers: {
        Authorization: 'Bearer ' + tokens,
        Accept: 'application/json',
      }
    });
    console.log(getNewListData, 'getnewlistdata')
    const GetEmailDetails = async (emailId, user, tokens) => {
      const response = await fetch(`https://gmail.googleapis.com/gmail/v1/users/${user.email}/messages/${emailId}?format=full&key=${API_KEY}`, {
        headers: { Authorization: 'Bearer ' + tokens, Accept: 'application/json' }
      });
      if (response.ok) {
        const emailDetails = await response.json();
        return emailDetails;
      } else {
        // Handle error or return a default value
        console.error('Failed to fetch email details:', response.status);
        return null;
      }
    };
    // console.log(GetEmailDetails, 'GetEmailDetails')

    const newListData = await getNewListData.json();
    fetchedEmails = await Promise.all(newListData.messages.map(async (email) => {
      const emailDetails = await GetEmailDetails(email.id, user, tokens);
      const senderName = emailDetails.payload.headers.find(header => header.name === 'From').value;
      const nameMatch = senderName.match(/"([^"]+)"/);
      const nameWithoutQuotes = nameMatch ? nameMatch[1] : senderName;
      const emailWithoutQuotes = senderName.match(/<([^>]+)>/);
      const emailValue = emailWithoutQuotes ? emailWithoutQuotes[1] : '';
      const emailHeaderValue = emailDetails.payload.headers[1].value;
      const dateRegex = /\b(\d{1,2} [a-zA-Z]+ \d{4} \d{2}:\d{2}:\d{2} [-+]\d{4})\b/;
      const match = emailHeaderValue.match(dateRegex);
      const extractedName = nameWithoutQuotes.replace(/<[^>]+>/, '').trim();

      function getBodyData(emailDetails) {
        if (emailDetails.payload.parts) {
          const bodyData1 = emailDetails.payload.parts[1]?.body?.data;
          if (bodyData1) {
            return bodyData1;
          }
          const bodyData0 = emailDetails.payload.parts[0]?.body?.data;
          if (bodyData0) {
            return bodyData0;
          }
        }
        return emailDetails.payload.body?.data || '';
      }

      const bodyData = getBodyData(emailDetails);
      const body = atob(bodyData.replace(/-/g, '+').replace(/_/g, '/'))

      return {
        id: emailDetails.id,
        name: extractedName,
        secondName: senderName,
        subject: emailDetails.payload.headers.find(header => header.name === 'Subject').value,
        date: match[1],
        labels: emailDetails.labelIds,
        email: emailValue.trim(),
        snippet: emailDetails.snippet,
        body: body,
      };
    }));

    //console.log(fetchedEmails)
    setEmails(fetchedEmails)
    return fetchedEmails;
  }
  useEffect(() => {
    // console.log('fetch  and render emails')

    const fetchAndRenderEmails = async () => {
      const emails = await GetEmailsFromFolder(label);
      setEmails(emails);
    };
    fetchAndRenderEmails();
  }, [label]);

  const host = useLocation();




  const iFrameRef: React.LegacyRef<HTMLIFrameElement> = useRef(null);
  const MyIFrameComponent = () => {
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
      const handleHeightMessage = (event: MessageEvent) => {
        if (event.data && event.data.type === 'iframeHeight' && event.data.height) {
          setIsLoading(false);

          if (iFrameRef.current) {
            iFrameRef.current.style.height = `${event.data.height}px`;
          }
        }
      };
      const currentHost = typeof window !== 'undefined' ? window.location.host : null;

      if (iFrameRef.current) {
        if (currentHost === 'localhost:3000') {
          iFrameRef.current.src = 'http://localhost:3000/body';
        }
        if (currentHost === 'dealersalesassistant.ca') {
          iFrameRef.current.src = 'https://www.dealersalesassistant.ca/body';
        }
        window.addEventListener('message', handleHeightMessage);
      }

      return () => {
        if (iFrameRef.current) {
          window.removeEventListener('message', handleHeightMessage);
        }
      };
    }, []);

    return (
      <>
        <div className="h-full w-full ">
          <iframe
            ref={iFrameRef}
            title="my-iframe"
            width="100%"
            className=' border-none'
            style={{ minHeight: reply === false ? '840px' : '550px' }}
          />
        </div>
      </>
    );
  };

  // synchronize on change

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (selectedEmail) {
      const serializedEmail = JSON.stringify(selectedEmail);
      window.localStorage.setItem("selectedEmail", serializedEmail);
    }
  }, [selectedEmail]);
  /** {templates && templates.filter(template => template.type === 'email').map((template, index) => (
                        <option key={index} value={template.title}>
                          {template.title}
                        </option>
                      ))} */





  return (
    <>
      <div className="!border-1 !mx-auto !bg-black flex !w-[95%] !h-[90vh] !border !border-[#3b3b3b] mt-[60px]">
        <div className="sidebar w-[10%] border-r !border-[#3b3b3b]">
          <div className="border-b !border-[#3b3b3b]">
            <LabelList />
          </div>
        </div>
        <div className="emailList !w-[35%] !border-r !border-[#3b3b3b]">
          <div className="flex items-center justify-center border-b border-[#3b3b3b]">
            <Tabs defaultValue="Unread" className="m-2 w-[95%]">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger onClick={() => {
                  HandleGewtLabel('UNREAD')

                  setLabel('Unread')
                }} value="Unread">Unread {unread}</TabsTrigger>
                <TabsTrigger
                  onClick={() => {
                    HandleGewtLabel('INBOX')
                    setLabel('Inbox')
                  }}
                  value="All Mail">
                  Inbox {inbox}
                </TabsTrigger>
                <TabsTrigger
                  onClick={() => {
                    HandleGewtLabel('DRAFT')
                    setLabel('Draft')
                  }}
                  value="Draft">
                  Draft
                </TabsTrigger>
                <TabsTrigger
                  onClick={() => {
                    HandleGewtLabel('SENT')
                    setLabel('Sent')
                  }}
                  value="Sent">
                  Sent
                </TabsTrigger>
                <TabsTrigger
                  onClick={() => {
                    HandleGewtLabel('SPAM')
                    setLabel('Spam')
                  }}
                  value="Chat">
                  Spam
                </TabsTrigger>
                <TabsTrigger
                  onClick={() => {
                    HandleGewtLabel('TRASH')
                    setLabel('Trash')
                  }}
                  value="Trash">
                  Trash
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div className="overflow-y-scroll h-[95%] ">
            <div>
              <Input name="search" placeholder="Search" className='m-2 mx-auto w-[95%] border border-[#ffffff4d] bg-[#000] text-[#fff] focus:border-[#02a9ff]' />
            </div>
            <EmailList emails={emails} loading={loading} />
          </div>
        </div>
        {openReply === true && (
          <div className="email flex h-full w-[60%]  flex-col">
            <div className="flex justify-between !border-b !border-[#3b3b3b]">
              <div className="!my-2 !ml-2 !flex">
                <Button
                  onClick={() => {
                    setReply(false)
                    setOpenReply(false)
                  }}
                  className={`  cursor-pointer rounded  p-3 text-center text-xs font-bold uppercase text-[#fff] shadow outline-none transition-all duration-150 ease-linear hover:border-[#02a9ff] hover:text-[#02a9ff] hover:shadow-md focus:outline-none `}>
                  <Cross2Icon />
                </Button>

                <Button onClick={() => {
                  handleDeleteClick(selectedEmail)
                }}
                  className={`cursor-pointer text-center text-[#fff] outline-none transition-all duration-150 ease-linear hover:border-[#02a9ff] hover:text-[#02a9ff] focus:outline-none `}>
                  <Trash color="#f5f4f4" strokeWidth={1.5} className="hover:text-[#02a9ff]" />
                </Button>
                {label !== 'Trash' && (
                  <Button
                    onClick={() => {
                      handlesetToUnread(selectedEmail)
                    }}
                    variant='outline' className='text-white border-white hover:text-[#02a9ff]'>
                    Unread
                  </Button>
                )}
                {label === 'Trash' && (
                  <Button onClick={() => {
                    handleInboxClick(selectedEmail)
                  }}
                    className={`cursor-pointer text-center text-[#fff] outline-none transition-all duration-150 ease-linear hover:border-[#02a9ff] hover:text-[#02a9ff] focus:outline-none `}>
                    Send To Inbox
                  </Button>
                )}
              </div>
              <div className="!my-2 !flex">
                <Button
                  onClick={() => {
                    handleReply(selectedEmail)
                  }}
                  className={`cursor-pointer rounded  p-3 text-center text-xs font-bold uppercase text-[#fff] shadow outline-none transition-all duration-150 ease-linear hover:border-[#02a9ff] hover:text-[#02a9ff] hover:shadow-md focus:outline-none `}>
                  <Reply color="#f5f4f4" strokeWidth={1.5} className="hover:text-[#02a9ff]" />
                </Button>
                <Button
                  onClick={() => {
                    handleReplyAll(selectedEmail)

                  }}
                  className={`cursor-pointer rounded  p-3 text-center text-xs font-bold uppercase text-[#fff] shadow outline-none transition-all duration-150 ease-linear hover:border-[#02a9ff] hover:text-[#02a9ff] hover:shadow-md focus:outline-none `}>
                  <ReplyAll color="#f5f4f4" strokeWidth={1.5} className="hover:text-[#02a9ff]" />
                </Button>
                <Button
                  onClick={() => {
                    handleForward(selectedEmail)
                  }}
                  className={`cursor-pointer rounded  p-3 text-center text-xs font-bold uppercase text-[#fff] shadow outline-none transition-all duration-150 ease-linear hover:border-[#02a9ff] hover:text-[#02a9ff] hover:shadow-md focus:outline-none `}>
                  <Forward color="#f5f4f4" strokeWidth={1.5} className="hover:text-[#02a9ff]" />
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild className='mx-auto my-auto cursor-pointer mr-4'>
                    <MoreVertical color="#f5f4f4" strokeWidth={1.5} className="hover:text-[#02a9ff]" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-white">
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>

                      <DropdownMenuItem className='cursor-pointer hover:text-[#02a9ff]' onClick={() => {
                        handleReply(selectedEmail)
                      }}  >
                        Reply
                      </DropdownMenuItem>
                      <DropdownMenuItem className='cursor-pointer hover:text-[#02a9ff]'
                        onClick={() => {
                          handleReplyAll(selectedEmail)
                        }}  >
                        Reply All
                      </DropdownMenuItem>
                      <DropdownMenuItem className='cursor-pointer hover:text-[#02a9ff]'
                        onClick={() => {
                          handleReply(selectedEmail)
                        }}
                      >
                        Forward
                      </DropdownMenuItem>
                      <DropdownMenuItem className='cursor-pointer hover:text-[#02a9ff]'
                        onClick={() => {
                          SetToTrash(selectedEmail)
                          toast.success(`Email deleted!`)
                        }}  >
                        Delete
                      </DropdownMenuItem>
                      <DropdownMenuItem className='cursor-pointer hover:text-[#02a9ff]'
                        onClick={() => {
                          SetToUnread(selectedEmail)
                          toast.success(`Set to unread.`)
                        }} >
                        Mark As Unread
                      </DropdownMenuItem>

                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger className='cursor-pointer hover:text-[#02a9ff]' >
                          Move
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent className='bg-white'>
                            {labelData.labels.map((item, index) => {
                              return (
                                <DropdownMenuItem
                                  className='cursor-pointer hover:text-[#02a9ff]'
                                  key={index}
                                  onClick={() => {
                                    MoveEmail(selectedEmail, labelName)
                                  }}>
                                  {item.name}
                                </DropdownMenuItem>
                              )
                            })}
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedEmail(selectedEmail)
                        setComposeEmail(true)
                      }} >
                      Create New Email
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

              </div>
            </div>
            {!reply && (
              <div className="m-2 rounded-md border border-[#3b3b3b]">
                <div className="m-2 flex items-center justify-between">
                  <p className="text-bold  text-lg text-[#fff]">
                    {selectedEmail.name}
                  </p>
                  <p className="text-bold text-sm text-[#fff]">
                    {new Date(selectedEmail.date).toLocaleString()}
                  </p>
                </div>
                <p className="text-bold ml-2 text-sm text-[#fff]">
                  {selectedEmail.email}
                </p>
                <div className="m-2 flex ">
                  {cc && (<p className="mr-2 text-[#fff]">cc</p>)}
                  {bcc && (<p className="text-[#fff]">bcc</p>)}
                </div>
              </div>
            )}
            {reply && (
              <div className=" justify-center border-b border-[#3b3b3b]">
                <Input defaultValue={to} name='to' className='m-2 mx-auto w-[98%] bg-[#1c2024] text-white' />
                <Input defaultValue={subject} name='subject' className='m-2 mx-auto w-[98%] bg-[#1c2024] text-white' />
                <div className='mx-auto mt-2 flex w-[98%]' >
                  <Input defaultValue={cc} name='cc' placeholder='cc' className='mx-auto mb-2 mr-1 bg-[#1c2024]  text-white' />
                  <Input defaultValue={bcc} name='bcc' placeholder='bcc' className='text-right mx-auto ml-1 bg-[#1c2024]  text-white' />
                </div>
              </div>
            )}
            {selectedEmail.body && (
              <div className="!grow  !border-t bg-white border-[#3b3b3b]">
                <p className="  !text-sm  ">
                  <div className="parent-container">
                    <MyIFrameComponent />
                  </div>
                </p>
              </div>
            )}
            {reply && (
              <div className="border-l mb-2 items-end justify-end rounded-md border-t border-[#3b3b3b]">

                {/*<Textarea value={text} ref={textareaRef} onChange={(e) => setText(e.target.value)} className="m-2 mx-auto h-[200px] w-[98%]" placeholder="Reply to email..." />*/}
                <EditorTiptapHook onChange={someFunction} />

                <input type='hidden' defaultValue={text} name='body' />

                <div className="mx-2 flex justify-between">
                  <div className="flex">
                    <select
                      className={`autofill:placeholder:text-text-[#C2E6FF] justifty-start  mr-2 h-9 w-auto cursor-pointer rounded border  border-white bg-[#1c2024] px-2 text-xs uppercase text-white shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]`}
                      onChange={handleChange}>
                      <option value="">Select a Template</option>
                      {templates.map((template, index) => (
                        <option key={index} value={template.title}>
                          {template.title}
                        </option>
                      ))}
                    </select>
                    <Form method="post" >

                      <input type='hidden' name='name' defaultValue="New Template" />
                      <input type='hidden' name='title' defaultValue="New Template" />
                      <input type='hidden' name='category' defaultValue="New Template" />
                      <input type='hidden' name='label' defaultValue="New Template" />
                      <input type='hidden' name='dept' defaultValue="New Template" />
                      <input type='hidden' name='type' defaultValue="New Template" />
                      <input type='hidden' name='body' defaultValue={text} />
                      <input type='hidden' name='subject' defaultValue={subject} />
                      <input type='hidden' name='userEmail' defaultValue={user.email} />
                      <input type='hidden' name='name' defaultValue={user.name} />
                      <Button onClick={() => { toast.success(`Template saved!`) }} name='intent' value='createTemplate' type='submit' className={` ml-2 cursor-pointer rounded border border-[#fff] p-3 text-center text-xs font-bold uppercase text-[#fff] shadow outline-none transition-all duration-150 ease-linear hover:border-[#02a9ff] hover:text-[#02a9ff] hover:shadow-md focus:outline-none `}>
                        Save Template
                      </Button>
                    </Form>

                  </div>
                  <Button
                    onClick={() => {
                      toast.success(`Email sent!`)
                      setTo(to)
                      setSubject(subject)
                      setTimeout(() => {
                        SendEmail(user, to, subject, text, tokens)
                        setReply(false)
                      }, 5);
                    }}

                    className={` mr-2 cursor-pointer rounded border border-[#fff] p-3 text-center text-xs font-bold uppercase text-[#fff] shadow outline-none transition-all duration-150 ease-linear hover:border-[#02a9ff] hover:text-[#02a9ff] hover:shadow-md focus:outline-none `}
                  >
                    Send
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
        {composeEmail === true && (
          <div className="email flex h-full w-[60%]  flex-col">
            <div className="flex justify-between border-b border-[#3b3b3b]">
              <div className="my-2 flex">
                <select
                  className={`autofill:placeholder:text-text-[#C2E6FF] justifty-start ml-2 mr-2 h-9 w-auto cursor-pointer rounded border  border-white bg-[#1c2024] px-2 text-xs uppercase text-white shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]`}
                  onChange={handleChange}>
                  <option value="">Select a Template</option>
                  {templates && templates.filter(template => template.type === 'email').map((template, index) => (
                    <option key={index} value={template.title}>
                      {template.title}
                    </option>
                  ))}
                </select>
                <Form method="post" >
                  <input type='hidden' name='name' defaultValue="New Template" />
                  <input type='hidden' name='title' defaultValue="New Template" />
                  <input type='hidden' name='category' defaultValue="New Template" />
                  <input type='hidden' name='label' defaultValue="New Template" />
                  <input type='hidden' name='dept' defaultValue="New Template" />
                  <input type='hidden' name='type' defaultValue="New Template" />
                  <input type='hidden' name='body' defaultValue={text} />
                  <input type='hidden' name='subject' defaultValue={subject} />
                  <input type='hidden' name='userEmail' defaultValue={user.email} />
                  <input type='hidden' name='name' defaultValue={user.name} />
                  <Button onClick={() => { toast.success(`Template saved!`) }} name='intent' value='createTemplate' type='submit' className={` ml-2 cursor-pointer rounded border border-[#fff] p-3 text-center text-xs font-bold uppercase text-[#fff] shadow outline-none transition-all duration-150 ease-linear hover:border-[#02a9ff] hover:text-[#02a9ff] hover:shadow-md focus:outline-none `}>
                    Save Template
                  </Button>
                </Form>
                <Button onClick={() => {
                  toast.success(`Email saved!`)
                  SaveDraft(selectedEmail)
                }}
                  className={` ml-2 cursor-pointer rounded border border-[#fff] p-3 text-center text-xs font-bold uppercase text-[#fff] shadow outline-none transition-all duration-150 ease-linear hover:border-[#02a9ff] hover:text-[#02a9ff] hover:shadow-md focus:outline-none `}>
                  Save Draft
                </Button>
              </div>
              <div className="my-2 flex">

                <Button
                  onClick={() => {
                    setComposeEmail(false)
                  }}
                  className={` ml-2 cursor-pointer rounded  p-3 text-center text-xs font-bold uppercase text-[#fff] shadow outline-none transition-all duration-150 ease-linear hover:border-[#02a9ff] hover:text-[#02a9ff] hover:shadow-md focus:outline-none `}>

                  <Cross2Icon />
                </Button>
              </div>
            </div>
            <div className=" justify-center border-b border-[#3b3b3b]">
              <Input placeholder='To' name='to' className='m-2 mx-auto w-[98%] bg-[#1c2024] text-white' />
              <Input placeholder='Subject' name='subject' className='m-2 mx-auto w-[98%] bg-[#1c2024] text-white' />
              <div className='mx-auto mt-2 flex w-[98%]' >
                <Input name='cc' placeholder='cc' className='mx-auto mb-2 mr-1 bg-[#1c2024]  text-white' />
                <Input name='bcc' placeholder='bcc' className='text-right mx-auto ml-1 bg-[#1c2024]  text-white' />
              </div>
            </div>
            <div className="border-1 mb-2 grow items-end justify-end overflow-auto rounded-md border-t border-[#3b3b3b]">

              <EditorTiptapHook onChange={someFunction} />

              <input type='hidden' defaultValue={text} name='body' />

              <div className="mx-2 flex justify-between">
                <div className="flex">

                </div>
                <Button
                  onClick={() => {
                    toast.success(`Email sent!`)
                    setTo(to)
                    setSubject(subject)
                    setTimeout(() => {
                      SendEmail(user, to, subject, text, tokens)
                      setReply(false)
                    }, 5);
                  }}
                  name='intent' value='newLead' type='submit'
                  className={` mr-2 cursor-pointer rounded border border-[#fff] p-3 text-center text-xs font-bold uppercase text-[#fff] shadow outline-none transition-all duration-150 ease-linear hover:border-[#02a9ff] hover:text-[#02a9ff] hover:shadow-md focus:outline-none `}
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
        )}
      </div >
    </>
  )
}


/**
 * const UpdateLabel = (email, label) => fetchGmailAPI(`https://gmail.googleapis.com/gmail/v1/users/${user.email}/labels/${email.id}?key=${API_KEY}`, 'POST', { "name": renameLabel, });
  const CreateLabel2 = (email, label) => fetchGmailAPI(`https://gmail.googleapis.com/gmail/v1/users/${user.email}/labels?key=${API_KEY}`, 'POST', { "name": renameLabel, });
  const RenameLabel1 = (email, label) => fetchGmailAPI(`https://gmail.googleapis.com/gmail/v1/users/${user.email}/labels/${email.id}?key=${API_KEY}`, 'POST', { "name": renameLabel, });
  // const SaveDraft = (email, label) => fetchGmailAPI(`https://gmail.googleapis.com/gmail/v1/users/${user.email}/drafts?key=${API_KEY}`, 'POST', { "message": { "raw": text, } });
  const DeleteDraft = (email, label) => fetchGmailAPI(`https://gmail.googleapis.com/gmail/v1/users/${user.email}/drafts/${email.id}?key=${API_KEY}`, 'DELETE', { "message": { "raw": text, } });
  const GetDraft = (email, label) => fetchGmailAPI(`https://gmail.googleapis.com/gmail/v1/users/${user.email}/drafts/${email.id}?key=${API_KEY}`, 'GET', { "message": { "raw": text, } });
  const SendDraft = (email, label) => fetchGmailAPI(`https://gmail.googleapis.com/gmail/v1/users/${user.email}/drafts/send?key=${API_KEY}`, 'POST', { "id": id, "payload": { "body": { "data": text } } });
  const UpdateDraft = (email, label) => fetchGmailAPI(`https://gmail.googleapis.com/gmail/v1/users/${user.email}/drafts/${email.id}?key=${API_KEY}`, 'POST', { "message": { "raw": text, } });
  //const MoveEmail = (email, label) => fetchGmailAPI(`https://gmail.googleapis.com/gmail/v1/users/${user.email}/messages/${email.id}/modify?key=${API_KEY}`, 'PUT', { "addLabelIds": label })
  // const MoveToInbox = (email) => fetchGmailAPI(`https://gmail.googleapis.com/gmail/v1/users/${user.email}/messages/${email.id}/modify?key=${API_KEY}`, 'PUT', { "addLabelIds": 'INBOX' })
  //const SendEmail = () => fetchGmailAPI(`https://gmail.googleapis.com/gmail/v1/users/${user.email}/messages/send?key=${API_KEY}`, 'POST', { "id": selectedEmail?.id, "payload": { "body": { "data": text } } });
 */
