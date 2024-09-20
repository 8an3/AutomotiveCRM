import { Mail } from '~/components/email/mail'
import { Link, useSubmit, useNavigate, useLocation } from '@remix-run/react';

import React, { useCallback, useEffect, useRef, useState } from "react";
import { json, type LoaderFunction, type ActionFunction, redirect, LoaderArgs } from '@remix-run/node';
import financeFormSchema from '~/overviewUtils/financeFormSchema';
import { collapsedCookie, layoutCookie } from '~/components/dev/mail/cookies.server';
import { useLoaderData } from "@remix-run/react";
import { MsalProvider, AuthenticatedTemplate, useMsal, UnauthenticatedTemplate } from '@azure/msal-react';
import { useAppContext } from '~/components/microsoft/AppContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import { Button, Separator } from '~/components';
import { TfiMicrosoft } from 'react-icons/tfi';
import {
  deleteMessage,
  getDrafts,
  getDraftsList,
  getInbox,
  getInboxList,
  getJunk,
  getList,
  getSent,
  getTrash,
  messageRead,
  messageUnRead,
  getUser,
  testInbox,
  getFolders,
  getAllFolders,
  getEmailById,
  MoveEmail,
  createReplyDraft,
  ComposeEmail,
  SendNewEmail,
} from "~/components/microsoft/GraphService";
import useSWR, { SWRConfig, mutate, useSWRConfig } from 'swr';
import { toast } from 'sonner';

export const loader = async ({ request }: LoaderArgs) => {
  const cookieHeader = request.headers.get("Cookie");
  const layoutCookie2 = (await layoutCookie.parse(cookieHeader)) || [33, 67];
  const collapsedCookie2 = (await collapsedCookie.parse(cookieHeader)) || false;
  return json({ layoutCookie2, collapsedCookie2 });
}



export default function MainClient() {
  const { layoutCookie2, collapsedCookie2 } = useLoaderData()

  const layout = layoutCookie2
  const collapsed = collapsedCookie2

  const defaultLayout = layout
  const defaultCollapsed = collapsed
  const app = useAppContext();
  const { instance } = useMsal();
  const activeAccount = instance.getActiveAccount();
  const email = activeAccount?.username || '';
  const name = activeAccount?.name || '';
  const idToken = activeAccount?.idToken || '';
  console.log(email, 'email', name, 'name', idToken, 'idToken', activeAccount)
  const [user, setUser] = useState();

  const [emails, setEmails] = useState();
  const [data, setData] = useState();
  const mails = emails


  useEffect(() => {
    async function Testy() {
      const data = await testInbox(app.authProvider!)
      setData(data)
    }
    Testy()
    console.log(data, 'data')

    if (data) {
      setEmails(data.value)
      console.log(data, 'data')
    }
  }, []);

  const [subject, setSubject] = useState("");
  const [to, setTo] = useState("");
  const [reply, setReply] = useState(false);
  const [cc, setCC] = useState([]);
  const [bcc, setBcc] = useState([]);
  const [folders, setFolders] = useState([]);
  const [draftCount, setDraftCount] = useState(0);
  const [unreadJunkCount, setUnreadJunkCount] = useState(0);
  const [composeEmail, setComposeEmail] = useState(false);
  const [openReply, setOpenReply] = useState(false);
  const [templates, setTemplates] = useState();
  const [unreadItemCount, setUnreadItemCount] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [text, setText] = useState("");
  const [selectedEmail, setSelectedEmail] = useState();

  useEffect(() => {
    // folder list
    const fetchFolders = async () => {
      const fetchedFolders = await getAllFolders(app.authProvider!);
      if (
        Array.isArray(fetchedFolders.value) &&
        fetchedFolders.value.length > 0
      ) {
        const foldersArray = fetchedFolders.value.map((folder: any) => ({
          name: folder.displayName,
          ...folder,
        }));
        setFolders(foldersArray);
      }
    };
    fetchFolders();
    // unread count
    const fetchUnreadCount = async () => {
      const drafts = await getDrafts(app.authProvider!);
      const totalDrafts = drafts.totalItemCount;
      setDraftCount(totalDrafts);
      const messages = await getInbox(app.authProvider!);
      const unreadCount = messages.unreadItemCount;
      setUnreadItemCount(unreadCount);
      const junk = await getJunk(app.authProvider!);
      const unreadJunk = junk.totalItemCount;
      setUnreadJunkCount(unreadJunk);
    };
    fetchUnreadCount();
    const fetchTemplates = async () => {
      const response = await fetch("/dealer/api/templates");
      const data = await response.json();
      setTemplates(data);
      console.log(data, 'data')
    };
    fetchTemplates();

    if (mails?.length === 0) {
      handleClicktestInbox();
    }
  }, []);
  const handleClicktestInbox = async () => {
    const response = await testInbox(app.authProvider!);
    setEmails(response.value);
    setSelectedLine(null);
    setIsOpen(false);
  };
  async function GetEmailsFromFolder(name: any) {
    let folderName = name.toLowerCase();
    if (folderName === "deleted items") {
      folderName = "deleteditems";
    }
    if (folderName === "junk email") {
      folderName = "junkemail";
    }
    if (folderName === "sent items") {
      folderName = "sentitems";
    }
    if (folderName === "conversation history") {
      folderName = "conversationhistory";
    }

    const drafts = await getFolders(app.authProvider!, folderName);
    const response = await getList(app.authProvider!, folderName);

    // console.log('Folder name:', folderName);
    // console.log('Drafts:', drafts);
    // console.log('Response:', response);
    setEmails(response.value);
  }
  useEffect(() => {
    if (selectedEmail) {
      const serializedEmail = JSON.stringify(selectedEmail);
      window.localStorage.setItem("selectedEmail", serializedEmail);
      setText(selectedTemplate);
    }
  }, [selectedEmail, selectedTemplate]);
  const handleChange = (event) => {
    const selectedTitle = event.target.value;
    const selectedTemplate = templates.find(
      (template) => template.title === selectedTitle
    );
    setSelectedTemplate(selectedTemplate.body);
    // setText(selectedTemplate.body);
    setSubject(selectedTemplate.subject);
    console.log("tesxt", text, selectedTemplate);
  };
  useEffect(() => {
    if (text) {
      window.localStorage.setItem("templateEmail", selectedTemplate);
    }
  }, [selectedTemplate, text]);
  let content = text;
  let handleUpdate;
  async function HandleGewtLabel(label) {
    if (label === "Drafts") {
      const labelData = await getList(app.authProvider!, label);
      setEmails(labelData);
    } else if (label === "Unread") {
      const response = await testInbox(app.authProvider!);
      setEmails(response.value);
    } else {
      const labelData = await getList(app.authProvider!, label);
      setEmails(labelData.value);
    }
  }
  // reply
  const handleReply = async (selectedEmail) => {
    //  setWhich("reply");
    setTo(null);
    setSubject(null);
    await messageRead(app.authProvider!, selectedEmail.id);
    setTimeout(() => {
      setTo(selectedEmail?.sender.emailAddress.address);
      setSubject(selectedEmail.subject);
    }, 0);
    setReply(true);
  };
  const handleForward = async (selectedEmail) => {
    // setWhich("reply");
    setTo(null);
    setSubject(null);
    await messageRead(app.authProvider!, selectedEmail.id);
    setTimeout(() => {
      setTo(selectedEmail?.sender.emailAddress.address);
      setSubject(selectedEmail.subject);
    }, 0);
    setReply(true);
  };
  // reply all
  const handleReplyAll = (selectedEmail) => {
    //  setWhich("replyAll");
    setReply(true);
    setTo(null);
    setSubject(null);
    setCC(null);
    setBcc(null);
    setTimeout(() => {
      setTo(selectedEmail.email);
      setSubject(selectedEmail.subject);
      setCC(selectedEmail.cc);
      setBcc(selectedEmail.bcc);
    }, 5);
  };
  // email click
  const handleEmailClick = async (email) => {
    if (email && email.id) {
      messageRead(app.authProvider!, email.id);
      const emailMessage = await getEmailById(app.authProvider!, email.id);
      setSelectedEmail(emailMessage);
      setTo(email.sender.emailAddress.address);
      if (email.ccRecipients) {
        setCC(email.ccRecipients);
      }
      if (email.bccRecipients) {
        setBcc(email.bccRecipients);
      }
      setReply(false);
      setOpenReply(true);
      const messageId = email.id;
      //  const setUNREAD = await SetToRead(email)
    } else {
      console.error("Email object or its id is undefined:", email);
    }
  };
  async function GetNextEmail(emails) {
    const emailMessage = await getEmailById(app.authProvider!, emails[1].id);
    setSelectedEmail(emailMessage);
  }
  // delete click
  const handleDeleteClick = (folderName, id) => {
    deleteMessage(app.authProvider!, id);
    toast.success(`Email moved to trash.`);
    getList(app.authProvider!, folderName);
    //  setEmails(emails);
  };
  async function handlesetToUnread(id) {
    messageUnRead(app.authProvider!, id);
  }
  return (
    <>
      <div className='border border-border rounded-md'>
        <Mail mails={mails} defaultLayout={defaultLayout} defaultCollapsed={defaultCollapsed} instance={instance} activeAccount={activeAccount} />
      </div>
    </>
  )
}
