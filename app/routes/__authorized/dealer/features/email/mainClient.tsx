import { Mail } from '~/routes/__authorized/dealer/features/email/mail'
import { Link, useSubmit, useNavigate, useLocation, useFetcher } from '@remix-run/react';

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
import { Button, Input, Separator } from '~/components';
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip"
import { MailDisplay } from "./mail-display"
import { MailList } from "./mail-list"
import { Nav } from "./nav"
import { cn } from "~/components/ui/utils"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "~/components/ui/resizable"
import {
  AlertCircle,
  Archive,
  ArchiveX,
  File,
  Inbox,
  MessagesSquare,
  Search,
  Send,
  ShoppingCart,
  Trash2,
  Users2,
} from "lucide-react"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/components/ui/tabs"

export default function MainClient() {
  const app = useAppContext();
  const { instance } = useMsal();
  const activeAccount = instance.getActiveAccount();
  const email = activeAccount?.username || '';
  const name = activeAccount?.name || '';
  const idToken = activeAccount?.idToken || '';
  console.log(email, 'email', name, 'name', idToken, 'idToken', activeAccount)

  const layout = 30//layoutCookie2
  const collapsed = false// collapsedCookie2

  const defaultLayout = [20, 32, 48]
  const defaultCollapsed = collapsed

  const [user, setUser] = useState();

  const [emails, setEmails] = useState();
  const [mails, setMails] = useState();
  // const [data, setData] = useState();



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

  const dataFetcher = testInbox(app.authProvider!); //(url) => fetch(url).then(res => res.json());
  const { data, error, isLoading, isValidating } = useSWR(dataFetcher, { refreshInterval: 15000 })
  useEffect(() => {
    if (error) {
      console.log(error, 'error')
    }
    if (data) {
      console.log(data, 'data,swre')
      setEmails(data.value);
      setMails(data.value);
    }
  }, [data, error]);

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const response = await testInbox(app.authProvider!);
        console.log(response, 'response')
        setEmails(response.value);
        setMails(response.value);

      } catch (error) {
        console.error("Error fetching emails:", error);
      }
    };
    fetchEmails();
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
  console.log(emails, 'emails emailclient')



  // --------------------- mail component
  const navCollapsedSize = 4
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed)
  //const [collapsedSize, setCollapsedSize] = React.useState()

  useEffect(() => {
    console.log(mails, 'mails')
    if (mails && mails.length > 0) {
      setMail(mails[0])
    }
  }, []);

  const [mail, setMail] = useState()
  const fetcher = useFetcher()

  // from old email client

  console.log(mails, activeAccount, 'mails maillist')

  const primaryLinks = [
    {
      title: "Inbox",
      label: "128", // Dynamic count
      icon: Inbox,
      variant: "default",
    },
    {
      title: "Drafts",
      label: "9",
      icon: File,
      variant: "ghost",
    },
    {
      title: "Sent Items",
      label: "", // Sent items may not have a count
      icon: Send,
      variant: "ghost",
    },
    {
      title: "Junk Email",
      label: "23",
      icon: ArchiveX,
      variant: "ghost",
    },
    {
      title: "Trash",
      label: "",
      icon: Trash2,
      variant: "ghost",
    },
    {
      title: "Archive",
      label: "",
      icon: Archive,
      variant: "ghost",
    },
  ];
  const secondaryLinks = [
    {
      title: "Social",
      label: "972",
      icon: Users2,
      variant: "ghost",
    },
    {
      title: "Updates",
      label: "342",
      icon: AlertCircle,
      variant: "ghost",
    },
    {
      title: "Forums",
      label: "128",
      icon: MessagesSquare,
      variant: "ghost",
    },
    {
      title: "Promotions",
      label: "21",
      icon: Archive,
      variant: "ghost",
    },
  ];

  return (
    <>
      <div className=' mt-10 m-b border border-border border-md' >
        <TooltipProvider delayDuration={0}>
          <ResizablePanelGroup
            direction="horizontal"
            onLayout={(sizes: number[]) => {

            }}
            className="h-full max-h-[800px] items-stretch"
          >
            <ResizablePanel
              defaultSize={defaultLayout[0]}
              collapsedSize={navCollapsedSize}
              collapsible={true}
              minSize={15}
              maxSize={20}
              onCollapse={() => {
                setIsCollapsed(true)
              }}
              onResize={() => {
                setIsCollapsed(false)
              }}
              className={cn(
                isCollapsed &&
                "min-w-[50px] transition-all duration-300 ease-in-out"
              )}
            >

              <Separator className='mt-[39px]' />
              <Nav isCollapsed={isCollapsed} links={primaryLinks} />
              <Separator />
              <Nav isCollapsed={isCollapsed} links={secondaryLinks} />

            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
              <Tabs defaultValue="unread">
                <div className="flex items-center px-4 py-2">
                  <h1 className="text-xl font-bold">Inbox</h1>
                  <TabsList className="ml-auto">
                    <TabsTrigger
                      value="all"
                      className="text-zinc-600 dark:text-zinc-200"
                    >
                      All mail
                    </TabsTrigger>
                    <TabsTrigger
                      value="unread"
                      className="text-zinc-600 dark:text-zinc-200"
                    >
                      Unread
                    </TabsTrigger>
                  </TabsList>
                </div>
                <Separator />
                <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                  <form>
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Search" className="pl-8" />
                    </div>
                  </form>
                </div>
                <TabsContent value="all" className="m-0">
                  <MailList items={mails} setMail={setMail} mail={mail} />
                </TabsContent>
                <TabsContent value="unread" className="m-0">
                  {!mails || mails.length === 0 ? <p className='text-center mt-5 text-muted-foreground'>No emails to currently display.</p> :
                    <MailList items={mails.filter((item) => item.isRead === false)} setMail={setMail} mail={mail} />}
                </TabsContent>
              </Tabs>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={defaultLayout[2]} minSize={30}>
              <MailDisplay mail={mail} />
            </ResizablePanel>
          </ResizablePanelGroup>
        </TooltipProvider>
      </div>
    </>
  )
}
