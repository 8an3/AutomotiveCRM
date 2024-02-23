import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, } from "~/components/ui/accordion"
import { toast } from "sonner"
import { Archive, MailWarning, DollarSign, Clock, MailCheck, Twitter, RefreshCw, FormInput, Inbox, Reply, ReplyAll, Forward, MoreVertical, Star, Folder, MailQuestion, ShieldAlert, MessageCircle, Loader2, } from "lucide-react";
import { Badge, Button, Input, Label, Select, SelectContent, SelectGroup, SelectLabel, SelectItem, SelectTrigger, SelectValue, Tabs, TabsContent, TabsList, TabsTrigger, ButtonLoading } from "~/components/ui";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { DataFunctionArgs, json, redirect, type LoaderFunction } from '@remix-run/node';
import { model } from "~/models";
import { useLoaderData, useNavigation, Form } from '@remix-run/react';
import { prisma } from "~/libs";
import { ContextMenu, ContextMenuCheckboxItem, ContextMenuContent, ContextMenuItem, ContextMenuLabel, ContextMenuRadioGroup, ContextMenuRadioItem, ContextMenuSeparator, ContextMenuShortcut, ContextMenuSub, ContextMenuSubContent, ContextMenuSubTrigger, ContextMenuTrigger, } from "~/components/ui/context-menu"
import { Dialog as Dialog1, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from "~/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger, } from "~/components/ui/dropdown-menu"
import { MessageAlert, SendMail, Mail, Message, User, BinHalf, Calendar as CalendarIcon, Telegram, Trash, MessageText } from "iconoir-react";
import OpenAI from "openai";
import { Textarea } from "~/other/textarea";
import { getSession, commitSession, destroySession } from '../sessions/auth-session.server'
import { google } from 'googleapis';
import axios from "axios";
import { RefreshToken } from "~/services/google-auth.server";
import Sidebar from "~/components/shared/sidebar";
import { ensureClient, getLabel, sendEmail, setToUnread, setToRead } from "./email.server";

export async function loader({ params, request }: DataFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")

  const user = await model.user.query.getForSession({ email: email });
  if (!user) {
    redirect('/login')
  }

  const API_KEY = 'AIzaSyCsE7VwbVNO4Yw6PxvAfx8YPuKSpY9mFGo'
  const tokens = session.get("accessToken")
  let refreshToken
  refreshToken = session.get("refreshToken")
  if (!refreshToken) {
    const newUser = await prisma.user.findUnique({
      where: {
        email: user.email
      }
    })
    refreshToken = newUser.refreshToken
  }


  const oauth2Client = await ensureClient(email, tokens);
  // const res2 = await getUserEmails(oauth2Client);
  //const res = await sendEmail(oauth2Client);
  //console.log('test', res, 'test')



  const userRes = await fetch(`https://gmail.googleapis.com/gmail/v1/users/${user.email}/profile`, {
    headers: { Authorization: 'Bearer ' + tokens, Accept: 'application/json' }
  });
  if (userRes.status === 401) {
    console.log('Unauthorized');

    const data = {
      client_id: "286626015732-f4db11irl7g5iaqb968umrv2f1o2r2rj.apps.googleusercontent.com",
      client_secret: "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",
      refresh_token: refreshToken,
      grant_type: 'refresh_token'
    };
    const NewToken = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(data)
    })
    console.log(NewToken)
  } else {
    console.log('Authorized');
  }
  // Log user email and tokens
  //console.log(userRes.data.emailAddress);
  // console.log(tokens);
  let fetchedEmails;
  async function GetEmailsFromFolder(labelName: any) {
    const getNewListData = await fetch(`https://gmail.googleapis.com/gmail/v1/users/${user.email}/messages?labelIds=${labelName.toUpperCase()}&maxResults=2&key=${API_KEY}`, {
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

  return json({ labelData, API_KEY, user, tokens, getTemplates, request, emailDetails, unreadEmails, refreshToken, oauth2Client }, {
  });
}
export async function action({ params, request }: DataFunctionArgs) {

}
async function refreshAccessTokenIfNeeded(user, tokens, refreshToken) {
  // Check if the access token is valid
  const userRes = await fetch(`https://gmail.googleapis.com/gmail/v1/users/${user.email}/profile`, {
    headers: { Authorization: 'Bearer ' + tokens, Accept: 'application/json' }
  });

  // If the access token is not valid, refresh it
  if (userRes.status === 401) {
    console.log('Unauthorized');

    const data = {
      client_id: "286626015732-f4db11irl7g5iaqb968umrv2f1o2r2rj.apps.googleusercontent.com",
      client_secret: "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",
      refresh_token: refreshToken,
      grant_type: 'refresh_token'
    };

    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(data)
    });

    if (response.ok) {
      const responseData = await response.json();
      return responseData.access_token;
    } else {
      console.error('Failed to refresh access token:', response.status);
      return null;
    }
  } else {
    console.log('Authorized');
    return tokens;
  }
}

// Use the function
//const newAccessToken = await refreshAccessTokenIfNeeded(user, tokens, refreshToken);
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
  const { labelData, unreadEmails, tokens, user, API_KEY, getTemplates, emailDetails, oauth2Client } = useLoaderData()

  const [labelNames, setLabelNames] = useState(labelData.labels)
  function LabelFunction() {
    const labels = labelNames.labels
    return labels
  }
  const nextPage = unreadEmails.nextPageToken
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
  // const [subject, setSubject] = useState('');
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

  const [openReply, setOpenReply] = useState(false)
  const [subject, setSubject] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const newEmails = unreadEmails.map(email => ({
    ...email,
    subject: email.subject?.value || null
  }));
  const [emails, setEmails] = useState(newEmails);
  //  useEffect(() => {  setEmails()  })
  // console.log(emails[0], 'emails')
  const EmailList = ({ emails, loading }) => {
    const navigation = useNavigation();

    const isSubmitting = navigation.state === "submitting";

    return (
      <div className="">
        {emails.map((email, index) => (
          <div key={index} className="m-2 mx-auto w-[95%] cursor-pointer rounded-md border border-[#ffffff4d] hover:border-[#02a9ff]  hover:text-[#02a9ff] active:border-[#02a9ff]" onClick={() => handleEmailClick(email)}>
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
            {email.labels ? email.labels.map((label, index) => (
              <Badge key={index} className="m-2 border-[#fff] text-[#fff]">{label}</Badge>
            )) : null}
            {/* Add more fields as needed */}
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

  async function fetchGmailAPI(url, method, body = null) {
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
  const MoveEmail = (email, label) => fetchGmailAPI(`https://gmail.googleapis.com/gmail/v1/users/${user.email}/messages/${email.id}/modify?key=${API_KEY}`, 'PUT', { "addLabelIds": label })
  const MoveToInbox = (email) => fetchGmailAPI(`https://gmail.googleapis.com/gmail/v1/users/${user.email}/messages/${email.id}/modify?key=${API_KEY}`, 'PUT', { "addLabelIds": 'INBOX' })
  const SetToTrash = (email) => fetchGmailAPI(`https://gmail.googleapis.com/gmail/v1/users/${user.email}/messages/${email.id}/trash?key=${API_KEY}`, 'POST');
  const SaveDraft = (email, label) => fetchGmailAPI(`https://gmail.googleapis.com/gmail/v1/users/${user.email}/drafts?key=${API_KEY}`, 'POST', { "message": { "raw": text, } });
  const DeleteDraft = (email, label) => fetchGmailAPI(`https://gmail.googleapis.com/gmail/v1/users/${user.email}/drafts/${email.id}?key=${API_KEY}`, 'DELETE', { "message": { "raw": text, } });
  const GetDraft = (email, label) => fetchGmailAPI(`https://gmail.googleapis.com/gmail/v1/users/${user.email}/drafts/${email.id}?key=${API_KEY}`, 'GET', { "message": { "raw": text, } });
  const SendDraft = (email, label) => fetchGmailAPI(`https://gmail.googleapis.com/gmail/v1/users/${user.email}/drafts/send?key=${API_KEY}`, 'POST', { "id": id, "payload": { "body": { "data": text } } });
  const UpdateDraft = (email, label) => fetchGmailAPI(`https://gmail.googleapis.com/gmail/v1/users/${user.email}/drafts/${email.id}?key=${API_KEY}`, 'POST', { "message": { "raw": text, } });


  const CreateLabel = (email, label) => fetchGmailAPI(`https://gmail.googleapis.com/gmail/v1/users/${user.email}/messages/send?key=${API_KEY}`, 'POST', { "id": id, "payload": { "body": { "data": text } } });
  const DeleteLabel = (email, label) => fetchGmailAPI(`https://gmail.googleapis.com/gmail/v1/users/${user.email}/messages/send?key=${API_KEY}`, 'DELETE',);
  const UpdateLabel = (email, label) => fetchGmailAPI(`https://gmail.googleapis.com/gmail/v1/users/${user.email}/labels/${email.id}?key=${API_KEY}`, 'POST', { "name": renameLabel, });
  const CreateLabel2 = (email, label) => fetchGmailAPI(`https://gmail.googleapis.com/gmail/v1/users/${user.email}/labels?key=${API_KEY}`, 'POST', { "name": renameLabel, });
  const RenameLabel1 = (email, label) => fetchGmailAPI(`https://gmail.googleapis.com/gmail/v1/users/${user.email}/labels/${email.id}?key=${API_KEY}`, 'POST', { "name": renameLabel, });

  const SendEmail = () => fetchGmailAPI(`https://gmail.googleapis.com/gmail/v1/users/${user.email}/messages/send?key=${API_KEY}`, 'POST', { "id": id, "payload": { "body": { "data": text } } });


  const handleInputChange = useCallback((e) => {
    setRenameLabel(e.target.value);
  }, []);
  const handleChange = (event) => {
    const selectedTemplate = templates.find(template => template.title === event.target.value);
    setSelectedTemplate(selectedTemplate);
  };
  const HandleGewtLabel = async (label) => {
    // const res2 = await getUserEmails(oauth2Client);
    //const res = await sendEmail(oauth2Client);
    //console.log('test', res, 'test')

    const labelData = await getLabel(oauth2Client, label)
    return labelData

  }
  const HandleSendEmail = async (oauth2Client: oauth2_v2.Oauth2, user, to, subjectLine, body) => {
    // const res2 = await getUserEmails(oauth2Client);
    //const res = await sendEmail(oauth2Client);
    //console.log('test', res, 'test')

    const labelData = await getLabel(oauth2Client, user, to, subjectLine, body)
    return labelData

  }
  const handleEmailClick = async (email) => {
    setSelectedEmail(email);
    // console.log(email)
    setReply(false)
    setOpenReply(true)
    const emailRead = await setToRead(oauth2Client, email.id)

    return emailRead
    console.log(selectedEmail)
  };
  const HandleSetEmails = (fetchedEmails) => {
    setTimeout(() => {
      setEmails(fetchedEmails);
    }, 0);
  }

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
    /**
                 */
    return (
      <>
        <div className="border-b border-[#3b3b3b]">
          <Button
            onClick={() => {
              GetEmailsFromFolder('DRAFT')
              setLabel('Draft')
              setComposeEmail(true)
            }}
            name='intent' value='newLead' type='submit'
            className={` m-2 w-[90%] cursor-pointer justify-center rounded border border-[#fff] p-3 text-center text-xs font-bold uppercase text-[#fff] shadow outline-none transition-all duration-150 ease-linear hover:border-[#02a9ff] hover:text-[#02a9ff] hover:shadow-md focus:outline-none `}
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
                  //  const displayLabelName = labelData.labels.replace('CATEGORY_', '');
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
                                    handleButtonClick(item)
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
                                  {item.name === 'FORUMS' && (
                                    <FormInput strokeWidth={1.5} />
                                  )}
                                  {item.name === 'UPDATES' && (
                                    <RefreshCw strokeWidth={1.5} />
                                  )}
                                  {item.name === 'PERSONAL' && (
                                    <User strokeWidth={1.5} />
                                  )}
                                  {item.name === 'PROMOTIONS' && (
                                    <DollarSign strokeWidth={1.5} />
                                  )}
                                  {item.name === 'SOCIAL' && (
                                    <Telegram strokeWidth={1.5} />
                                  )}
                                  <p className='ml-2 text-white'>{item.name}</p>
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
    const unreadEmail = await setToUnread(oauth2Client, email.id)
    toast.success(`Email moved to trash.`)
    await GetEmailsFromFolder(label);
    //  setEmails(emails);
    setTimeout(() => {
      setSelectedEmail(emails[1]);
      setReply(false)
    }, 5);
    return unreadEmail
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
  /**
    const handleReplyAll = (selectedEmail) => {
      setWhich('replyAll')
      setReply(true)
      setTo(null)
      // setSubject(null)
      setCC(null)
      setBcc(null)
      setTimeout(() => {
        setTo(selectedEmail.email)
        //  setSubject(selectedEmail.subject)
        setCC(selectedEmail.cc)
        setBcc(selectedEmail.bcc)
      }, 0);
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
        // setSubject(selectedEmail.subject)
        setCC(selectedEmail.cc)
        setBcc(selectedEmail.bcc)
      }, 0);
    }; */
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
      <div className="border-1 mx-auto flex w-[95%] h-[95vh] border border-[#3b3b3b] mt-[50px]">
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
                    HandleGewtLabel('CHAT')
                    setLabel('Chat')
                  }}
                  value="Chat">
                  Chat
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
            <div className="flex justify-between border-b border-[#3b3b3b]">
              <div className="my-2 ml-2 flex">
                <Button
                  onClick={() => {
                    handlesetToUnread(selectedEmail)
                  }}
                  variant='outline' className='text-white border-white hover:text-[#02a9ff]'>
                  Unread
                </Button>
                <Button onClick={() => {
                  handleDeleteClick(selectedEmail)
                }}
                  className={`cursor-pointer text-center text-[#fff] outline-none transition-all duration-150 ease-linear hover:border-[#02a9ff] hover:text-[#02a9ff] focus:outline-none `}>
                  <Trash color="#f5f4f4" strokeWidth={1.5} className="hover:text-[#02a9ff]" />
                </Button>
                {label === 'Trash' && (
                  <Button onClick={() => {
                    handleInboxClick(selectedEmail)
                  }}
                    className={`cursor-pointer text-center text-[#fff] outline-none transition-all duration-150 ease-linear hover:border-[#02a9ff] hover:text-[#02a9ff] focus:outline-none `}>
                    Send To Inbox
                  </Button>
                )}
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
                            {labelData.labels.map((labelName, index) => (
                              <DropdownMenuItem key={index}
                                onClick={() => {
                                  MoveEmail(selectedEmail, labelName)
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
                  <div className='p-2' dangerouslySetInnerHTML={{ __html: selectedEmail.body }} />
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
                      {templates && templates.filter(template => template.type === 'email').map((template, index) => (
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
                      setTo(to)
                      setSubject(subject)
                      setTimeout(() => {
                        HandleSendEmail(oauth2Client, user, to, subject, text);
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
                    {labelData.labels.map((labelName, index) => (
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
                    setTo(to)
                    setFrom(user.email)
                    setSubject(subject)
                    SendEmail(selectedEmail)
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
 *
 *
 *    {selectedEmail && (
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
                    {labelData.labels.map((labelName, index) => (
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
                            {labelData.labels.map((labelName, index) => (
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
                  <div className='p-2' dangerouslySetInnerHTML={{ __html: selectedEmail.body }} />
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
                      {templates && templates.filter(template => template.type === 'email').map((template, index) => (
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
 */

/**
 *
 */
