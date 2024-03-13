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


  const user = await prisma.user.findUnique({
    where: { email: email },
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      subscriptionId: true,
      customerId: true,
      returning: true,
      phone: true,
      dealer: true,
      position: true,
      roleId: true,
      profileId: true,
      omvicNumber: true,
      role: { select: { symbol: true, name: true } },
    },
  });
  /// console.log(user, account, 'wquiote loadert')
  if (!user) {
    redirect('/login')
  }

  const tokens = userSession.get('accessToken');

  const refreshToken = userSession.get('refreshToken');
  console.log(tokens, refreshToken)
  const accessToken = userSession.get('accessToken');

  const API_KEY = 'AIzaSyCsE7VwbVNO4Yw6PxvAfx8YPuKSpY9mFGo'




  // Log user email and tokens
  //console.log(userRes.data.emailAddress);
  console.log(tokens);
  let fetchedEmails;

  async function GetEmailsFromFolder(labelName: any) {
    const getNewListData = await fetch(`https://gmail.googleapis.com/gmail/v1/users/${user.email}/messages?labelIds=${labelName.toUpperCase()}&maxResults=8&key=${API_KEY}`, {
      headers: {
        Authorization: 'Bearer ' + tokens,
        Accept: 'application/json',
      }
    });

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
        date: match[1],
        labels: emailDetails.labelIds,
        email: emailValue.trim(),
        snippet: emailDetails.snippet,
        body: body,
      };
    }));

    return fetchedEmails;
  }

  const unreadEmails = await GetEmailsFromFolder('UNREAD');
  //unreadData.messages.map(async (email) => {
  // const emailDetails = await fetch(`https://gmail.googleapis.com/gmail/v1/users/${user.email}/messages/${email.id}?format=full&key=${API_KEY}`, { headers: { Authorization: 'Bearer ' + tokens, Accept: 'application/json' } });

  // const senderName = emailDetails.payload.headers.find(header => header.name === 'From').value;
  //}
  // )
  const newAccessToken = await prisma.emailTemplates.findMany({ where: { userEmail: user?.email, }, });
  const getLabels212 = await fetch(`https://gmail.googleapis.com/gmail/v1/users/${user.email}/labels?key=${API_KEY}`, {
    headers: { Authorization: 'Bearer ' + tokens, Accept: 'application/json' }
  });

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

  return json({ labelData, API_KEY, user, tokens, getTemplates, request, emailDetails, unreadEmails }, {
    headers: {
      "Set-Cookie": await commitSession(userSession),
    },
  });
}


/** const nameMatch = senderName.match(/"([^"]+)"/);
    const nameWithoutQuotes = nameMatch ? nameMatch[1] : senderName;
    const emailWithoutQuotes = senderName.match(/<([^>]+)>/);
    const emailValue = emailWithoutQuotes ? emailWithoutQuotes[1] : '';
    const emailHeaderValue = emailDetails.payload.headers[1].value;
    const dateRegex = /\b(\d{1,2} [a-zA-Z]+ \d{4} \d{2}:\d{2}:\d{2} [-+]\d{4})\b/;
    const match = emailHeaderValue.match(dateRegex);
    const extractedName = nameWithoutQuotes.replace(/<[^>]+>/, '').trim();

    function getBodyData(emailDetails: any) {
      if (emailDetails.payload.parts) {
        const bodyData1 = emailDetails.payload.parts[1]?.body?.data;
        if (bodyData1) { return bodyData1; }
        const bodyData0 = emailDetails.payload.parts[0]?.body?.data;
        if (bodyData0) { return bodyData0; }
      }
      return emailDetails.payload.body?.data;
    }
    const bodyData = getBodyData(emailDetails);
    const body = atob(bodyData.replace(/-/g, '+').replace(/_/g, '/'))
    console.log('Email Body:', body);

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
    }; */
export default function EmailClient() {

  const { labelData, unreadEmails, tokens, user, API_KEY, getTemplates, emailDetails } = useLoaderData()
  const [labelNames, setLabelNames] = useState(labelData)
  console.log(labelData)


  const [label, setLabel] = useState('Unread')
  const [unread, setUnread] = useState('')
  const [draft, setDraft] = useState('')
  const [chat, setChat] = useState('')
  const [trash, setTrash] = useState('')
  const [inbox, setInbox] = useState(emailDetails.messagesUnread)
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
  useEffect(() => {
    setEmails(unreadEmails)
  })

  const EmailList = ({ emails, loading }) => {
    const navigation = useNavigation();

    const isSubmitting = navigation.state === "submitting";
    //
    //
    //
    /** <ContextMenu>
                  <ContextMenuTrigger>
                  </ContextMenuTrigger>
                  <ContextMenuContent className="z-[2000] w-64 bg-white">

                    <ContextMenuItem
                      onClick={() => {
                        handleReply(selectedEmail)
                      }}
                      inset>
                      Reply
                    </ContextMenuItem>
                    <ContextMenuItem className='cursor-pointer' disabled
                      onClick={() => {
                        handleReplyAll(selectedEmail)
                      }}
                      inset>
                      Reply All
                    </ContextMenuItem>
                    <ContextMenuItem
                      onClick={() => {
                        handleReply(selectedEmail)
                      }}
                      inset>
                      Forward
                    </ContextMenuItem>
                    <ContextMenuSeparator />
                    <ContextMenuItem
                      onClick={() => {
                        SetToTrash(mail)
                        toast.success(`Email deleted!`)
                      }}
                      inset>
                      Delete
                    </ContextMenuItem>
                    <ContextMenuSub>
                      <ContextMenuSubTrigger inset>
                        Move
                      </ContextMenuSubTrigger>
                      <ContextMenuSubContent className="w-48 bg-white">
                        {labelNames.map((labelName, index) => (
                          <ContextMenuItem className='cursor-pointer' key={index}
                            onClick={() => {
                              MoveEmail(mail, labelName)
                            }}>
                            {labelName}
                          </ContextMenuItem>
                        ))}
                      </ContextMenuSubContent>
                    </ContextMenuSub>
                    <ContextMenuItem
                      onClick={() => {
                        SetToUnread(mail)
                        toast.success(`Set to unread.`)
                      }}
                      inset>
                      Mark As Unread
                    </ContextMenuItem>
                    <ContextMenuItem
                      onClick={() => {
                        SetToRead(mail)
                        toast.success(`Email deleted!`)
                      }}
                      inset>
                      Ignore
                    </ContextMenuItem>
                    <ContextMenuSeparator />
                    <ContextMenuItem
                      onClick={() => {
                        setSelectedEmail(mail)
                        setComposeEmail(true)
                      }}
                      inset>
                      Create New Email
                    </ContextMenuItem>
                  </ContextMenuContent>

                </ContextMenu> */
    return (
      <div className="">
        {emails.map((mail) => (
          <div key={mail.id} className="m-2 mx-auto w-[95%] cursor-pointer rounded-md border border-[#ffffff4d] hover:border-[#02a9ff]  hover:text-[#02a9ff] active:border-[#02a9ff]" onClick={() => handleEmailClick(mail)}>
            <div className="m-2 flex items-center justify-between">
              <p className="text-lg font-bold text-[#fff]">{mail.name}</p>
              <p className="text-sm text-[#ffffff7c] ">  {new Date(mail.date).toLocaleString()}</p>
            </div>
            <p className="my-2 ml-2 text-sm text-[#ffffffc9]">{mail.subject}</p>
            <div className="flex">
              {mail.labels.map((label, index) => (
                <Badge key={index} className="m-2 border-[#fff] text-[#fff]">{label}</Badge>
              ))}
            </div>

          </div>
        ))}
        <ButtonLoading
          size="lg"
          name='intent'
          value='returnToQuote'
          type='submit'
          isSubmitting={isSubmitting}
          loadingText="Fetching more emails.."
          className="w-auto cursor-pointer ml-auto mt-5 hover:text-[#02a9ff]"
        >
          More
        </ButtonLoading>
      </div>
    );
  };
  const handleScroll = () => {
    const container = window;
    const scrollY = container.scrollY || container.pageYOffset;

    if (container.innerHeight + scrollY >= container.document.documentElement.scrollHeight) {
      // User has reached the bottom of the page
      if (!loading) {
        setLoading(true);
        fetchMoreEntries();
      }
    }
  };

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
  async function SetToUnread(email) {
    const id = email.id
    console.log(id)
    const modifyId = await fetch(`https://gmail.googleapis.com/gmail/v1/users/${user.email}/messages/${id}/modify?key=${API_KEY}`, {
      method: 'PUT',
      headers: {
        Authorization: 'Bearer ' + tokens,
        Accept: 'application/json',
      },
      body: JSON.stringify({
        addLabelIds: "UNREAD"
      })
    });
    return json({ modifyId })
  }
  async function MoveEmail(email, label) {
    const id = email.id
    console.log(id)
    const modifyId = await fetch(`https://gmail.googleapis.com/gmail/v1/users/${user.email}/messages/${id}/modify?key=${API_KEY}`, {
      method: 'PUT',
      headers: {
        Authorization: 'Bearer ' + tokens,
        Accept: 'application/json',
      },
      body: JSON.stringify({
        addLabelIds: label
      })
    });
    return json({ modifyId })
  }
  async function SetToTrash(email) {
    const id = email.id
    console.log(id)
    const modifyId = await fetch(`https://gmail.googleapis.com/gmail/v1/users/${user.email}/messages/${id}/trash?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + tokens,
        Accept: 'application/json'
      }
    });
    return json({ modifyId })
  }
  async function SaveDraft(id) {
    console.log(id)
    const modifyId = await fetch(`https://gmail.googleapis.com/gmail/v1/users/${user.email}/drafts?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + tokens,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "message": {
          "raw": text,
        }
      })
    });
    const data = await modifyId.json();
    return data;
  }
  async function DeleteDraft(id) {
    console.log(id)
    const modifyId = await fetch(`https://gmail.googleapis.com/gmail/v1/users/${user.email}/drafts/${id}?key=${API_KEY}`, {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + tokens,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },

    });
    const data = await modifyId.json();
    return data;
  }
  async function GetDraft(id) {
    console.log(id)
    const modifyId = await fetch(`https://gmail.googleapis.com/gmail/v1/users/${user.email}/drafts/${id}?key=${API_KEY}`, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + tokens,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },

    });
    const data = await modifyId.json();
    return data;
  }
  async function SendDraft(id) {
    console.log(id)
    const modifyId = await fetch(`https://gmail.googleapis.com/gmail/v1/users/${user.email}/drafts/send?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + tokens,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "id": id,
        "payload": {
          "body": {
            "data": text
          }
        }
      })
    });
    const data = await modifyId.json();
    return data;
  }
  async function UpdateDraft(id) {
    console.log(id)
    const modifyId = await fetch(`https://gmail.googleapis.com/gmail/v1/users/${user.email}/drafts/${id}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + tokens,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "id": id,
        "payload": {
          "body": {
            "data": text
          }
        }
      })
    });
    const data = await modifyId.json();
    return data;
  }
  async function SendEmail(id) {
    console.log(id)
    const modifyId = await fetch(`https://gmail.googleapis.com/gmail/v1/users/${user.email}/messages/send?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + tokens,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "id": id,
        "payload": {
          "body": {
            "data": text
          }
        }
      })
    });
    const data = await modifyId.json();
    return data;
  }
  async function CreateLabel() {
    const modifyId = await fetch(`https://gmail.googleapis.com/gmail/v1/users/${user.email}/labels?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + tokens,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "name": renameLabel,
      })
    });
    const data = await modifyId.json();
    return data;
  }
  async function DeleteLabel(id) {
    const modifyId = await fetch(`https://gmail.googleapis.com/gmail/v1/users/${user.email}/labels/${id}?key=${API_KEY}`, {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + tokens,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
    });
    const data = await modifyId.json();
    return data;
  }
  async function UpdateLabel(id) {
    const modifyId = await fetch(`https://gmail.googleapis.com/gmail/v1/users/${user.email}/labels/${id}?key=${API_KEY}`, {
      method: 'PUT',
      headers: {
        Authorization: 'Bearer ' + tokens,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "name": renameLabel,
      })
    });
    const data = await modifyId.json();
    return data;
  }
  async function RenameLabel(id) {
    const modifyId = await fetch(`https://gmail.googleapis.com/gmail/v1/users/${user.email}/labels/${id}?key=${API_KEY}`, {
      method: 'PUT',
      headers: {
        Authorization: 'Bearer ' + tokens,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "name": renameLabel,
      })
    });
    const data = await modifyId.json();
    return data;
  }
  const handleInputChange = useCallback((e) => {
    setRenameLabel(e.target.value);
  }, []);
  const handleChange = (event) => {
    const selectedTemplate = templates.find(template => template.title === event.target.value);
    setSelectedTemplate(selectedTemplate);
  };
  const handleReply = (selectedEmail) => {
    setReply(true)
    setWhich('reply')

    setTo(null)
    setSubject(null)
    setTimeout(() => {
      setTo(selectedEmail.email)
      setSubject(selectedEmail.subject)
    }, 0);
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
    }, 0);
  };
  const handleForward = (selectedEmail) => {
    setWhich('forward')
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
    }, 0);
  };
  const handleEmailClick = (email) => {
    setSelectedEmail(email);
    console.log(email)
    SetToRead(email)
    setReply(false)
  };
  const HandleSetEmails = (fetchedEmails) => {
    setTimeout(() => {
      setEmails(fetchedEmails);
    }, 0);
  }
  const handleDeleteClick = async (email) => {
    setSelectedEmail(null);
    console.log(email)
    SetToTrash(email)
    const emails = await GetEmailsFromFolder(label);
    setEmails(emails);
    setReply(false)
  };
  const fetchMoreEntries = async () => {
    // Make your API call to get more entries
    // Update the 'emails' state with the new entries
    // setLoading(false) when the data is fetched
    const getNewListData = await fetch(`https://gmail.googleapis.com/gmail/v1/users/${user.email}/messages?labelIds=${folderNameState}&maxResults=8&pageToken=${nextPageToken}&key=${API_KEY}`, {
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
        console.log(html2)
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
  const LabelList = () => {
    return (
      <>
        <div className="border-b border-[#3b3b3b]">
          <Button
            onClick={() => {
              GetEmailsFromFolder('DRAFT')
              setLabel('Draft')
            }}
            name='intent' value='newLead' type='submit'
            className={` m-2 w-[90%] cursor-pointer justify-center rounded border border-[#fff] p-3 text-center text-xs font-bold uppercase text-[#fff] shadow outline-none transition-all duration-150 ease-linear hover:border-[#02a9ff] hover:text-[#02a9ff] hover:shadow-md focus:outline-none `}
          >
            Compose
          </Button>
        </div>
        <div className="border-b border-[#3b3b3b]">
          <p className="m-2 text-[#fff]"> label  just need the breackets top rendfer</p>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className='p-2 text-white'>All Folders</AccordionTrigger>
              <AccordionContent>
                {labelNames.labels.map((labelName, index) => {
                  // Remove 'CATEGORY_' from the label name
                  const displayLabelName = labelName.replace('CATEGORY_', '');

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
                                    setLabel(labelName)
                                    GetEmailsFromFolder(labelName)
                                  }}
                                  className={`flex cursor-pointer items-center text-center text-[#fff] outline-none transition-all duration-150 ease-linear hover:border-[#02a9ff] hover:text-[#02a9ff] focus:outline-none`}
                                >
                                  {labelName === 'TRASH' && (
                                    <Trash />
                                  )}
                                  {labelName === 'CHAT' && (
                                    <Message strokeWidth={1.5} />
                                  )}
                                  {labelName === 'IMPORTANT' && (
                                    <MessageAlert strokeWidth={1.5} />
                                  )}
                                  {labelName === 'SENT' && (
                                    <SendMail strokeWidth={1.5} />
                                  )}
                                  {labelName === 'INBOX' && (
                                    <Mail strokeWidth={1.5} />
                                  )}
                                  {labelName === 'DRAFT' && (
                                    <MessageText strokeWidth={1.5} />
                                  )}
                                  {labelName === 'SPAM' && (
                                    <BinHalf strokeWidth={1.5} />
                                  )}
                                  {labelName === 'STARRED' && (
                                    <Star strokeWidth={1.5} />
                                  )}
                                  {labelName === 'UNREAD' && (
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
                                  <p className='ml-2'>
                                    bracket displayLabelName bracket
                                  </p>
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
                                    DeleteLabel(id)
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
                  );
                })}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          {labelName === folderBeingRenamed ? (
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


  let fetchedEmails;

  async function GetEmailsFromFolder(labelName: any) {
    const getNewListData = await fetch(`https://gmail.googleapis.com/gmail/v1/users/${user.email}/messages?labelIds=${labelName.toUpperCase()}&maxResults=8&key=${API_KEY}`, {
      headers: {
        Authorization: 'Bearer ' + tokens,
        Accept: 'application/json',
      }
    });

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

    console.log(fetchedEmails)
    setEmails(fetchedEmails)
    return fetchedEmails;
  }
  useEffect(() => {
    console.log('fetch  and render emails')

    const fetchAndRenderEmails = async () => {
      const emails = await GetEmailsFromFolder(label);
      setEmails(emails);
    };
    fetchAndRenderEmails();
  }, [label]);

  /* something to do with templates
  useEffect(() => {
    const fetchData = async () => {
      console.log('Fetching emails...');
      try {
        const fetchedEmails = await Promise.all(unreadData.messages.map(async (email) => {
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

          function getBodyData(emailDetails: any) {
            if (emailDetails.payload.parts) {
              const bodyData1 = emailDetails.payload.parts[1]?.body?.data;
              if (bodyData1) {   return bodyData1;  }
              const bodyData0 = emailDetails.payload.parts[0]?.body?.data;
              if (bodyData0) { return bodyData0;  }
            }
            return emailDetails.payload.body?.data;
          }
          const bodyData = getBodyData(emailDetails);
          const body = atob(bodyData.replace(/-/g, '+').replace(/_/g, '/'))
          console.log('Email Body:', body);

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

        console.log('Fetched emails before batched updates', fetchedEmails);
        unstable_batchedUpdates(() => {
          setEmails((prevEmails) => [...prevEmails, ...fetchedEmails.filter(Boolean)]);
          if (selectedTemplate) {
            setText(selectedTemplate.body);
            setSubject(selectedTemplate.subject);
          }
        });
      } catch (error) {
        console.error('Error in fetchData:', error);
      }
    };

    if (unreadData?.messages.length > 0) {
      fetchData();
    }
  }, [unreadData, user, tokens, selectedTemplate]);

*/

  return (
    <>
      <Sidebar />
      <div className="border-1 mx-auto flex w-[95%] h-[95vh] border border-[#3b3b3b]">
        <div className="sidebar w-[10%] border-r border-[#3b3b3b]">
          <div className="border-b border-[#3b3b3b]">
            <LabelList />
          </div>
        </div>
        <div className="emailList w-[35%] border-r border-[#3b3b3b]">
          <div className="flex items-center justify-center border-b border-[#3b3b3b]">

            <Tabs defaultValue="Unread" className="m-2 w-[95%]">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger onClick={() => {
                  setLabel('Unread')
                  GetEmailsFromFolder('UNREAD')
                  GetEmailsFromFolder('UNREAD')
                }} value="Unread">Unread {unread}</TabsTrigger>
                <TabsTrigger
                  onClick={() => {
                    setLabel('Inbox')
                    GetEmailsFromFolder('INBOX')
                    GetEmailsFromFolder('INBOX')
                  }}
                  value="All Mail">
                  Inbox {inbox}
                </TabsTrigger>
                <TabsTrigger
                  onClick={() => {
                    GetEmailsFromFolder('DRAFT')
                    setLabel('Draft')
                  }}
                  value="Draft">
                  Draft
                </TabsTrigger>
                <TabsTrigger
                  onClick={() => {
                    GetEmailsFromFolder('SENT')
                    setLabel('Sent')
                  }}
                  value="Sent">
                  Sent
                </TabsTrigger>
                <TabsTrigger
                  onClick={() => {
                    GetEmailsFromFolder('CHAT')
                    setLabel('Chat')
                  }}
                  value="Chat">
                  Chat
                </TabsTrigger>
                <TabsTrigger
                  onClick={() => {
                    GetEmailsFromFolder('TRASH')
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
        {selectedEmail && (
          <div className="email flex h-full w-[60%]  flex-col">
            <div className="flex justify-between border-b border-[#3b3b3b]">
              <div className="my-2 flex">
                <Button
                  onClick={() => {
                    toast.success(`Email unread!`)
                    SetToUnread(selectedEmail)
                  }}
                  name='intent' value='newLead' type='submit'
                  className={` mx-2 cursor-pointer rounded border border-[#fff] p-3 text-center text-xs font-bold uppercase text-[#fff] shadow outline-none transition-all duration-150 ease-linear hover:border-[#02a9ff] hover:text-[#02a9ff] hover:shadow-md focus:outline-none `}
                >
                  Set To Unread
                </Button>

                <Select value={labelName}>
                  <SelectTrigger className="mx-auto  mr-2 w-[98%] border-[#fff] uppercase text-[#fff] hover:border-[#02a9ff] hover:text-[#02a9ff] focus:border-[#02a9ff] ">
                    <SelectValue>
                      <Folder color="#f5f4f4" strokeWidth={1.5} className="hover:text-[#02a9ff]" /></SelectValue>
                  </SelectTrigger>
                  <SelectContent className='bg-[#fff] text-[#000]'>
                    {labelNames.map((labelName, index) => (
                      <SelectItem value={labelName}
                        key={index}
                        onClick={() => {
                          MoveEmail(selectedEmail, labelName)
                        }}>
                        {labelName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button onClick={() => {
                  handleDeleteClick(selectedEmail)
                  toast.success(`Email deleted!`)
                }}
                  className={`cursor-pointer text-center text-[#fff] outline-none transition-all duration-150 ease-linear hover:border-[#02a9ff] hover:text-[#02a9ff] focus:outline-none `}>
                  <Trash color="#f5f4f4" strokeWidth={1.5} className="hover:text-[#02a9ff]" />
                </Button>

              </div>
              <div className="my-2 flex">
                <Button
                  onClick={() => {
                    handleReply(selectedEmail)
                  }}
                  className={`cursor-pointer text-center text-[#fff] outline-none transition-all duration-150 ease-linear hover:border-[#02a9ff] hover:text-[#02a9ff] focus:outline-none `}>
                  <Reply color="#f5f4f4" strokeWidth={1.5} />
                </Button>
                <Button
                  onClick={() => {
                    handleReplyAll(selectedEmail)

                  }}
                  name='intent' value='newLead' type='submit' className={`cursor-pointer text-center text-[#fff] outline-none transition-all duration-150 ease-linear hover:border-[#02a9ff] hover:text-[#02a9ff] focus:outline-none `}>
                  <ReplyAll color="#f5f4f4" strokeWidth={1.5} />
                </Button>
                <Button
                  onClick={() => {
                    handleReply(selectedEmail)
                  }}
                  name='intent' value='newLead' type='submit' className={`cursor-pointer text-center text-[#fff] outline-none transition-all duration-150 ease-linear hover:border-[#02a9ff] hover:text-[#02a9ff] focus:outline-none `}>
                  <Forward color="#f5f4f4" strokeWidth={1.5} />
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild className='mx-auto my-auto cursor-pointer mr-4'>
                    <MoreVertical color="#f5f4f4" strokeWidth={1.5} />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-white">
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>

                      <DropdownMenuItem onClick={() => {
                        handleReply(selectedEmail)
                      }}  >
                        Reply
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {
                        handleReplyAll(selectedEmail)
                      }}  >
                        Reply All
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {
                        handleReply(selectedEmail)
                      }}
                      >
                        Forward
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {
                        SetToTrash(selectedEmail)
                        toast.success(`Email deleted!`)
                      }}  >
                        Delete
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {
                        SetToUnread(selectedEmail)
                        toast.success(`Set to unread.`)
                      }} >
                        Mark As Unread
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {
                        SetToRead(selectedEmail)
                        toast.success(`Email deleted!`)
                      }} >
                        Ignore
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger>Move</DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent className='bg-white'>
                            {labelNames.map((labelName, index) => (
                              <DropdownMenuItem key={index}
                                onClick={() => {
                                  MoveEmail(mail, labelName)
                                }}>
                                {labelName}
                              </DropdownMenuItem>
                            ))}
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
                <p className="my-2  ml-2 text-sm text-[#fff]">
                  {selectedEmail.subject}
                </p>
                <div className="m-2 flex ">
                  <p className="mr-2 text-[#fff]">cc</p>
                  <p className="text-[#fff]">bcc</p>
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
              <div className="grow overflow-auto border-t bg-white border-[#3b3b3b]">
                <p className="m-2  text-sm  rounded-md">
                  {/*<div className='p-2' dangerouslySetInnerHTML={{ __html: selectedEmail.body }} />*/}
                </p>
              </div>
            )}

            {reply && (
              <div className="border-l mb-2 items-end justify-end rounded-md border-t border-[#3b3b3b]">
                <Textarea value={text} ref={textareaRef} onChange={(e) => setText(e.target.value)} className="m-2 mx-auto h-[200px] w-[98%]" placeholder="Reply to email..." />
                <div className="mx-2 flex justify-between">
                  <div className="flex">
                    <select
                      className={`autofill:placeholder:text-text-[#C2E6FF] justifty-start  mr-2 h-9 w-auto cursor-pointer rounded border  border-white bg-[#1c2024] px-2 text-xs uppercase text-white shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]`}
                      onChange={handleChange}>
                      <option value="">Select a Template</option>
                      {/*{templates && templates.filter(template => template.type === 'email').map((template, index) => ( */}
                      {templates && templates.map((template, index) => (
                        <option key={index} value={template.title}>
                          {template.title}
                        </option>
                      ))}
                    </select>

                    <Button onClick={() => { toast.success(`Template saved!`) }} name='intent' value='newLead' type='submit' className={` ml-2 cursor-pointer rounded border border-[#fff] p-3 text-center text-xs font-bold uppercase text-[#fff] shadow outline-none transition-all duration-150 ease-linear hover:border-[#02a9ff] hover:text-[#02a9ff] hover:shadow-md focus:outline-none `}>
                      Save Template
                    </Button>
                    <Button onClick={() => {
                      toast.success(`Email saved!`)
                      SaveDraft(selectedEmail.id)
                    }} name='intent' value='newLead' type='submit' className={` ml-2 cursor-pointer rounded border border-[#fff] p-3 text-center text-xs font-bold uppercase text-[#fff] shadow outline-none transition-all duration-150 ease-linear hover:border-[#02a9ff] hover:text-[#02a9ff] hover:shadow-md focus:outline-none `}>
                      Save Draft
                    </Button>
                  </div>
                  <Button
                    onClick={() => {
                      toast.success(`Email sent!`)
                      SaveDraft(selectedEmail.id)
                    }}
                    name='intent' value='newLead' type='submit'
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
                <Button
                  onClick={() => {
                    toast.success(`Email set to unread.`)
                    SetToUnread(selectedEmail)
                  }}
                  name='intent' value='newLead' type='submit'
                  className={` mx-2 cursor-pointer rounded border border-[#fff] p-3 text-center text-xs font-bold uppercase text-[#fff] shadow outline-none transition-all duration-150 ease-linear hover:border-[#02a9ff] hover:text-[#02a9ff] hover:shadow-md focus:outline-none `}
                >
                  Set To Unread
                </Button>
                <Select>
                  <SelectTrigger className="mx-auto  mr-2 w-[98%] border-[#fff] uppercase text-[#fff] hover:border-[#02a9ff] hover:text-[#02a9ff] focus:border-[#02a9ff] ">
                    <SelectValue>
                      <Folder color="#f5f4f4" strokeWidth={1.5} className="hover:text-[#02a9ff]" />
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className='bg-[#fff] text-[#000]'>
                    {labelNames.map((labelName, index) => (
                      <SelectItem
                        key={index}
                        onClick={() => {
                          MoveEmail(selectedEmail, labelName)
                        }}
                        value={labelName}>
                        {labelName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button onClick={() => {
                  SetToTrash(selectedEmail)
                  toast.success(`Email deleted!`)
                }} className={`cursor-pointer text-center text-[#fff] outline-none transition-all duration-150 ease-linear hover:border-[#02a9ff] hover:text-[#02a9ff] focus:outline-none `}>
                  <Trash color="#f5f4f4" strokeWidth={1.5} className="hover:text-[#02a9ff]" />
                </Button>

              </div>
              <div className="my-2 flex">
                <Button name='intent' value='newLead' type='submit' className={`cursor-pointer text-center text-[#fff] outline-none transition-all duration-150 ease-linear hover:border-[#02a9ff] hover:text-[#02a9ff] focus:outline-none `}>
                  <Reply color="#f5f4f4" strokeWidth={1.5} />
                </Button>
                <Button name='intent' value='newLead' type='submit' className={`cursor-pointer text-center text-[#fff] outline-none transition-all duration-150 ease-linear hover:border-[#02a9ff] hover:text-[#02a9ff] focus:outline-none `}>
                  <ReplyAll color="#f5f4f4" strokeWidth={1.5} />
                </Button>
                <Button name='intent' value='newLead' type='submit' className={`cursor-pointer text-center text-[#fff] outline-none transition-all duration-150 ease-linear hover:border-[#02a9ff] hover:text-[#02a9ff] focus:outline-none `}>
                  <Forward color="#f5f4f4" strokeWidth={1.5} />
                </Button>
                <Button name='intent' value='newLead' type='submit' className={`cursor-pointer text-center text-[#fff] outline-none transition-all duration-150 ease-linear hover:border-[#02a9ff] hover:text-[#02a9ff] focus:outline-none `}>
                  <MoreVertical color="#f5f4f4" strokeWidth={1.5} />
                </Button>
              </div>
            </div>
            <div className="m-2 rounded-md border border-[#3b3b3b]">
              <div className="flex justify-between">
                <p className="text-bold  text-lg text-[#fff]">
                  {selectedEmail.name}
                </p>
                <p className="text-bold text-sm text-[#fff]">
                  {new Date(selectedEmail.date).toLocaleString()}
                </p>
              </div>
              <p className="text-bold text-sm  text-[#fff]">
                {selectedEmail.email}
              </p>
              <p className="my-2  text-sm text-[#fff]">
                {selectedEmail.subject}
              </p>
              <div className="m-2 flex justify-between">
                <p className="text-[#fff]">cc</p>
                <p className="text-[#fff]">bcc</p>
              </div>
            </div>

            <div className="border-1 mb-2 grow items-end justify-end overflow-auto rounded-md border-t border-[#3b3b3b]">
              <Textarea value={text} ref={textareaRef} onChange={(e) => setText(e.target.value)} className="m-2 mx-auto h-[250px] w-[98%]" placeholder="Reply to email..." />
              <div className="mx-2 flex justify-between">
                <div className="flex">
                  <select
                    className={`autofill:placeholder:text-text-[#C2E6FF] justifty-start  h-8 cursor-pointer rounded border border-black bg-[#0d2847] px-2 text-xs uppercase text-[#C2E6FF] shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]`}
                    onChange={handleChange}>
                    <option value="">Select a template</option>
                    {templates && templates.filter(template => template.type === 'email').map((template, index) => (
                      <option key={index} value={template.title}>
                        {template.title}
                      </option>
                    ))}
                  </select>
                  <Select>
                    <SelectTrigger className="mx-auto  mr-2 w-[98%] border-[#fff] uppercase text-[#fff] hover:border-[#02a9ff] hover:text-[#02a9ff] focus:border-[#02a9ff] ">
                      <SelectValue>Templates</SelectValue>
                    </SelectTrigger>
                    <SelectContent className='bg-[#fff] text-[#000]'>
                      {templates && templates.filter(template => template.type === 'email').map((template, index) => (
                        <SelectItem key={index} value={template.title}>
                          {template.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={() => { toast.success(`Template saved!`) }} name='intent' value='newLead' type='submit' className={` ml-2 cursor-pointer rounded border border-[#fff] p-3 text-center text-xs font-bold uppercase text-[#fff] shadow outline-none transition-all duration-150 ease-linear hover:border-[#02a9ff] hover:text-[#02a9ff] hover:shadow-md focus:outline-none `}>
                    Save Template
                  </Button>
                  <Button onClick={() => {
                    toast.success(`Email saved!`)
                    SaveDraft(selectedEmail.id)
                  }} name='intent' value='newLead' type='submit' className={` ml-2 cursor-pointer rounded border border-[#fff] p-3 text-center text-xs font-bold uppercase text-[#fff] shadow outline-none transition-all duration-150 ease-linear hover:border-[#02a9ff] hover:text-[#02a9ff] hover:shadow-md focus:outline-none `}>
                    Save Draft
                  </Button>
                </div>
                <Button
                  onClick={() => {
                    toast.success(`Email sent!`)
                    SaveDraft(selectedEmail.id)
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
      </div>
    </>
  )
}


/**  useEffect(() => {
    console.log('fetch  and render emails')

    const fetchAndRenderEmails = async () => {
      const emails = await GetEmailsFromFolder(label);
      setEmails(emails);
    };
    fetchAndRenderEmails();
  }, [GetEmailsFromFolder, label]);
 */
// const id = '1'
// fake data
//const unreadData = {   messages: [    {   id: '123',   },   {  id: '456',  },  ],  };
// const tokens = 'fake_token';
//const GetEmailDetails = async (id, user, tokens) => {   return {    id: id,   payload: {  headers: [  {   name: 'From',    value: '"John Doe" <john.doe@example.com>',   },    {   name: 'Subject',  value: 'Test Subject', },   {  name: 'Date',  value: '1 January 2022 00:00:00 -0000',  },   ],   body: {    data: 'Test body data',   },  },  labelIds: ['INBOX'],  snippet: 'Test snippet',  }; };
//const labelData = {  labels: [   {  id: '1',  name: 'INBOX',  },  {  id: '2',  name: 'STARRED',   },  {   id: '3',   name: 'SENT',  },   ],  };
//const labelNames = labelData.labels.map((label) => label.name);
// fake data
