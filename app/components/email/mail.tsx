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

import { cn } from "~/components/ui/utils"
import { Input } from "~/components/ui/input"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "~/components/ui/resizable"
import { Separator } from "~/components/ui/separator"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip"
import { MailDisplay } from "./mail-display"
import { MailList } from "./mail-list"
import { Nav } from "./nav"
import { useFetcher, useNavigation } from "@remix-run/react"
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useMsal } from "@azure/msal-react";
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
import { toast } from "sonner"
import { Button } from "../ui"
import { FaForward, FaReply, FaReplyAll, FaTrash } from "react-icons/fa"
import { IoIosMail } from "react-icons/io"

interface MailProps {
  accounts: {
    label: string
    email: string
    icon: React.ReactNode
  }[]
  mails: any
  defaultLayout: number[] | undefined
  defaultCollapsed?: boolean
  navCollapsedSize: number
  app: any
}

export function Mail({
  mails,
  defaultLayout = [20, 32, 48],
  defaultCollapsed = false,
  navCollapsedSize,
  app,
  setEmails
}) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed)
  const [mail, setMail] = useState()
  const fetcher = useFetcher()


  // from old email client
  const { instance, accounts } = useMsal();
  const activeAccount = instance.getActiveAccount();

  const [text, setText] = React.useState("");
  const [templates, setTemplates] = useState();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [composeEmail, setComposeEmail] = useState(false);
  const [openReply, setOpenReply] = useState(false);
  const [label, setLabel] = useState("Unread");
  const [unreadItemCount, setUnreadItemCount] = useState(0);
  const [draftCount, setDraftCount] = useState(0);
  const [unreadJunkCount, setUnreadJunkCount] = useState(0);
  const [selectedEmail, setSelectedEmail] = useState();
  const [subject, setSubject] = useState("");
  const [to, setTo] = useState("");
  const [reply, setReply] = useState(false);
  const [cc, setCC] = useState([]);
  const [bcc, setBcc] = useState([]);
  const email = String(activeAccount?.username);
  const [folders, setFolders] = useState([]);
  const user = getUser(app.authProvider!);


  useEffect(() => {
    // fetch emails
    const fetchEmails = async () => {
      try {
        const folderName = "inbox";
        const response = await testInbox(app.authProvider!);
        //  console.log(emails)
        setEmails(response.value);
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
      //console.log(data, 'data')
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
  const displayNameOrder = [
    "Inbox",
    "Sent Items",
    "Drafts",
    "Trash",
    "Archive",
    "Junk Email",
    "Starred",
    "Important",
    "Unread",
    "Chat",
    "Conversation History",
    "Forums",
    "Updates",
    "Personal",
    "Promotions",
    "Social",
    "Deleted Items",
    "Outbox",
  ];
  const LabelList = () => {
    const displayedFolders = [];

    // Add folders in the order specified in displayNameOrder
    displayNameOrder.forEach((displayName) => {
      const folder = folders.find(
        (folder) => folder.displayName === displayName
      );
      if (folder) {
        displayedFolders.push(folder);
      }
    });

    // Add custom folders that are not in displayNameOrder
    folders.forEach((folder) => {
      if (!displayNameOrder.includes(folder.displayName)) {
        displayedFolders.push(folder);
      }
    });

    return (
      <>
        <div className="">
          <div className="flex-col items-center justify-center ">
            <button
              onClick={() => {
                setLabel("Unread");
                HandleGewtLabel(label);
              }}
              value="Unread"
              className={`ml-2 mt-3 flex cursor-pointer items-start text-left text-foreground outline-none transition-all duration-150 ease-linear hover:bg-transparent hover:text-primary focus:outline-none ${label === "Unread" ? "text-primary  " : ""
                }`}
            >
              {unreadItemCount === 0 && (
                <IoIosMailUnread className="text-2xl hover:text-primary" />
              )}
              {unreadItemCount > 1 && (
                <div className=" h-t relative w-7">
                  <div className="pointer-events-none absolute -right-4 -top-0.5 flex size-full">
                    <span className="relative flex size-3">
                      <span className="absolute inline-flex  size-full animate-ping rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex size-3 rounded-full bg-[#0078b4]"></span>
                    </span>
                  </div>
                  <IoIosMailUnread className="text-2xl hover:text-primary" />
                </div>
              )}
              <p className="mx-2">Unread </p>
              <p className="text-[#868686]">{unreadItemCount}</p>
            </button>
            {displayedFolders.map((folder, index) => (
              <div
                key={index}
                className="mx-2 flex items-center justify-between"
              >
                <div className="flex">
                  <ContextMenu>
                    <ContextMenuTrigger>
                      <button
                        onClick={() => {
                          HandleGewtLabel(folder.displayName);
                          setLabel(folder.displayName);
                        }}
                        className={`mx-autro mt-3 flex cursor-pointer text-left text-foreground outline-none transition-all duration-150 ease-linear hover:bg-transparent hover:text-primary focus:outline-none ${label === folder.displayName ? "text-primary" : ""
                          }`}
                      >
                        {(() => {
                          switch (folder.displayName) {
                            case "Trash":
                              return (
                                <FaTrash className="text-2xl hover:text-primary" />
                              );
                            case "Sent Items":
                              return (
                                <IoSend className="text-2xl hover:text-primary" />
                              );
                            case "Archive":
                              return (
                                <FaArchive className="text-2xl hover:text-primary" />
                              );
                            case "Conversation History":
                              return (
                                <FaHistory className="text-2xl hover:text-primary" />
                              );
                            case "Chat":
                              return (
                                <MdSms className="text-2xl hover:text-primary" />
                              );
                            case "Important":
                              return (
                                <IoMdAlert className="text-2xl hover:text-primary" />
                              );
                            case "Outbox":
                              return (
                                <IoSend className="text-2xl hover:text-primary" />
                              );
                            case "Inbox":
                              return (
                                <IoIosMail className="text-2xl hover:text-primary" />
                              );
                            case "Drafts":
                              return (
                                <MdDrafts className="text-2xl hover:text-primary" />
                              );
                            case "Junk Email":
                              return (
                                <RiSpam3Fill className="text-2xl hover:text-primary" />
                              );
                            case "Starred":
                              return (
                                <FaStar className="text-2xl hover:text-primary" />
                              );
                            case "Unread":
                              return (
                                <IoIosMailUnread className="text-2xl hover:text-primary" />
                              );
                            case "Forums":
                              return (
                                <MdForum className="text-2xl hover:text-primary" />
                              );
                            case "Updates":
                              return (
                                <MdSecurityUpdateGood className="text-2xl hover:text-primary" />
                              );
                            case "Personal":
                              return (
                                <User className="text-2xl hover:text-primary" />
                              );
                            case "Promotions":
                              return (
                                <FaCommentDollar className="text-2xl hover:text-primary" />
                              );
                            case "Social":
                              return (
                                <MdOutlineSocialDistance className="text-2xl hover:text-primary" />
                              );
                            case "Deleted Items":
                              return (
                                <FaTrash
                                  strokeWidth={1.5}
                                  className="text-2xl hover:text-primary"
                                />
                              );
                            default:
                              return (
                                <svg
                                  width="20px"
                                  height="20px"
                                  strokeWidth="1.1"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  color="#000000"
                                >
                                  <path
                                    d="M2 11V4.6C2 4.26863 2.26863 4 2.6 4H8.77805C8.92127 4 9.05977 4.05124 9.16852 4.14445L12.3315 6.85555C12.4402 6.94876 12.5787 7 12.722 7H21.4C21.7314 7 22 7.26863 22 7.6V11M2 11V19.4C2 19.7314 2.26863 20 2.6 20H21.4C21.7314 20 22 19.7314 22 19.4V11M2 11H22"
                                    stroke="#fff"
                                    strokeWidth="1.1"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  ></path>
                                </svg>
                              );
                          }
                        })()}

                        <p className="ml-2 text-foreground">{folder.displayName} </p>
                      </button>
                    </ContextMenuTrigger>
                    {/* ContextMenuContent and other items */}
                  </ContextMenu>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  };
  const ClosedLabelList = () => {
    const displayedFolders = [];
    displayNameOrder.forEach((displayName) => {
      const folder = folders.find(
        (folder) => folder.displayName === displayName
      );
      if (folder) {
        displayedFolders.push(folder);
      }
    });
    folders.forEach((folder) => {
      if (!displayNameOrder.includes(folder.displayName)) {
        displayedFolders.push(folder);
      }
    });
    return (
      <>
        <div className=" mx-auto">
          <div className="mx-auto flex-col items-center justify-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => {
                      setLabel("Unread");
                      HandleGewtLabel(label);
                    }}
                    value="Unread"
                    className={`mx-auto ml-2 mt-3 flex cursor-pointer   text-foreground outline-none transition-all   hover:bg-transparent hover:text-primary focus:outline-none ${label === "Unread" ? "text-primary  " : ""
                      }`}
                  >
                    {unreadItemCount === 0 && (
                      <IoIosMailUnread className="text-2xl hover:text-primary" />
                    )}
                    {unreadItemCount > 1 && (
                      <div className=" h-t relative w-7">
                        <div className="pointer-events-none absolute -right-4 -top-0.5 flex size-full">
                          <span className="relative flex size-3">
                            <span className="absolute inline-flex  size-full animate-ping rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex size-3 rounded-full bg-[#0078b4]"></span>
                          </span>
                        </div>
                        <IoIosMailUnread className="text-2xl hover:text-primary" />
                      </div>
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent className="bg-white text-black">
                  <p>Unread {unreadItemCount}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {displayedFolders.map((folder, index) => (
              <div
                key={index}
                className="mx-2 flex items-center justify-between"
              >
                <div className="flex">
                  <ContextMenu>
                    <ContextMenuTrigger>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => {
                                HandleGewtLabel(folder.displayName);
                                setLabel(folder.displayName);
                              }}
                              className={`mt-3 flex cursor-pointer items-start text-left text-foreground outline-none transition-all duration-150 ease-linear hover:bg-transparent hover:text-primary focus:outline-none ${label === folder.displayName
                                ? "text-primary"
                                : ""
                                }`}
                            >
                              {(() => {
                                switch (folder.displayName) {
                                  case "Trash":
                                    return (
                                      <FaTrash className="text-2xl hover:text-primary" />
                                    );
                                  case "Sent Items":
                                    return (
                                      <IoSend className="text-2xl hover:text-primary" />
                                    );
                                  case "Archive":
                                    return (
                                      <FaArchive className="text-2xl hover:text-primary" />
                                    );
                                  case "Conversation History":
                                    return (
                                      <FaHistory className="text-2xl hover:text-primary" />
                                    );
                                  case "Chat":
                                    return (
                                      <MdSms className="text-2xl hover:text-primary" />
                                    );
                                  case "Important":
                                    return (
                                      <IoMdAlert className="text-2xl hover:text-primary" />
                                    );
                                  case "Outbox":
                                    return (
                                      <IoSend className="text-2xl hover:text-primary" />
                                    );
                                  case "Inbox":
                                    return (
                                      <IoIosMail className="text-2xl hover:text-primary" />
                                    );
                                  case "Drafts":
                                    return (
                                      <MdDrafts className="text-2xl hover:text-primary" />
                                    );
                                  case "Junk Email":
                                    return (
                                      <RiSpam3Fill className="text-2xl hover:text-primary" />
                                    );
                                  case "Starred":
                                    return (
                                      <FaStar className="text-2xl hover:text-primary" />
                                    );
                                  case "Unread":
                                    return (
                                      <IoIosMailUnread className="text-2xl hover:text-primary" />
                                    );
                                  case "Forums":
                                    return (
                                      <MdForum className="text-2xl hover:text-primary" />
                                    );
                                  case "Updates":
                                    return (
                                      <MdSecurityUpdateGood className="text-2xl hover:text-primary" />
                                    );
                                  case "Personal":
                                    return (
                                      <User className="text-2xl hover:text-primary" />
                                    );
                                  case "Promotions":
                                    return (
                                      <FaCommentDollar className="text-2xl hover:text-primary" />
                                    );
                                  case "Social":
                                    return (
                                      <MdOutlineSocialDistance className="text-2xl hover:text-primary" />
                                    );
                                  case "Deleted Items":
                                    return (
                                      <FaTrash
                                        strokeWidth={1.5}
                                        className="text-2xl hover:text-primary"
                                      />
                                    );
                                  default:
                                    return (
                                      <svg
                                        width="20px"
                                        height="20px"
                                        strokeWidth="1.1"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        color="#000000"
                                      >
                                        <path
                                          d="M2 11V4.6C2 4.26863 2.26863 4 2.6 4H8.77805C8.92127 4 9.05977 4.05124 9.16852 4.14445L12.3315 6.85555C12.4402 6.94876 12.5787 7 12.722 7H21.4C21.7314 7 22 7.26863 22 7.6V11M2 11V19.4C2 19.7314 2.26863 20 2.6 20H21.4C21.7314 20 22 19.7314 22 19.4V11M2 11H22"
                                          stroke="#fff"
                                          strokeWidth="1.1"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                        ></path>
                                      </svg>
                                    );
                                }
                              })()}
                            </button>
                          </TooltipTrigger>
                          <TooltipContent className="bg-white text-black">
                            <p>{folder.displayName}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </ContextMenuTrigger>
                  </ContextMenu>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  };
  const EmailList = () => {
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";
    return (
      <div className=" ">
        {mails?.length === 0 ? (
          <div className="m-auto flex">
            <p className="mr-3 text-foreground">No emails available.</p>
            <svg
              width="20px"
              height="20px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              color="#fff"
              strokeWidth="1.1"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 1.25C6.06294 1.25 1.25 6.06294 1.25 12C1.25 17.9371 6.06294 22.75 12 22.75C17.9371 22.75 22.75 17.9371 22.75 12C22.75 6.06294 17.9371 1.25 12 1.25ZM7.53044 11.9697C7.23755 11.6768 6.76268 11.6768 6.46978 11.9697C6.17689 12.2626 6.17689 12.7374 6.46978 13.0303L9.46978 16.0303C9.76268 16.3232 10.2376 16.3232 10.5304 16.0303L17.5304 9.03033C17.8233 8.73744 17.8233 8.26256 17.5304 7.96967C17.2375 7.67678 16.7627 7.67678 16.4698 7.96967L10.0001 14.4393L7.53044 11.9697Z"
                fill="#fff"
              ></path>
            </svg>
          </div>
        ) : (
          <div className="">
            {Array.isArray(mails) &&
              mails.map((message: any, index: number) => (
                <div
                  key={index}
                  className="m-2 mx-auto w-[95%] cursor-pointer rounded-md border border-border hover:border-primary  hover:text-primary active:border-primary"
                  onClick={() => {
                    handleEmailClick(message);
                    handleScriptClick();
                    //  handleLineClick(index);
                  }}
                >
                  <div>
                    <div className="m-2 flex items-center justify-between">
                      <p className="text-lg font-bold text-foreground">
                        {message.from?.emailAddress?.name}
                      </p>
                      <p className="text-sm text-[#ffffff7c] ">
                        {new Date(message.receivedDateTime).toLocaleString()}
                      </p>
                    </div>

                    <p className="my-2 ml-2 text-sm text-[#ffffff7e]">
                      {message.subject
                        ? message.subject.split(" ").slice(0, 12).join(" ") +
                        "..."
                        : ""}
                    </p>
                    <div className="flex justify-between">
                      <div className="ml-auto mr-2 flex space-x-1">
                        <Button
                          variant="ghost"
                          onClick={() => {
                            setSelectedEmail(message);
                            setTimeout(() => {
                              handleReply(selectedEmail);
                            }, 5);
                          }}
                          className={`cursor-pointer rounded  p-2 text-center text-xs font-bold uppercase text-foreground shadow outline-none transition-all duration-150 ease-linear hover:bg-transparent hover:text-primary hover:shadow-md focus:outline-none `}
                        >
                          <FaReply className="text-2xl hover:text-primary" />
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => {
                            setSelectedEmail(message);
                            setTimeout(() => {
                              handleReplyAll(selectedEmail);
                            }, 5);
                          }}
                          className={`cursor-pointer rounded  p-2 text-center text-xs font-bold uppercase text-foreground shadow outline-none transition-all duration-150 ease-linear hover:bg-transparent hover:text-primary hover:shadow-md focus:outline-none `}
                        >
                          <FaReplyAll className="text-2xl hover:text-primary" />
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => {
                            setSelectedEmail(message);
                            setTimeout(() => {
                              handleForward(selectedEmail);
                            }, 5);
                          }}
                          className={`cursor-pointer rounded  p-2 text-center text-xs font-bold uppercase text-foreground shadow outline-none transition-all duration-150 ease-linear hover:bg-transparent hover:text-primary hover:shadow-md focus:outline-none `}
                        >
                          <FaForward className="text-2xl hover:text-primary" />
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => {
                            // handleDeleteClick(selectedEmail)
                            //  console.log(email)
                            SetToTrash(email);
                            toast.success(`Email moved to trash.`);
                            //  setEmails(emails);
                            setTimeout(() => {
                              GetEmailsFromFolder(label);
                            }, 5);
                            setTimeout(() => {
                              setSelectedEmail(emails[1]);
                              setReply(false);
                            }, 10);
                          }}
                          className={`cursor-pointer rounded  p-2 text-center text-xs font-bold uppercase text-foreground shadow outline-none transition-all duration-150 ease-linear hover:bg-transparent hover:text-primary hover:shadow-md focus:outline-none `}
                        >
                          <FaTrash className="text-2xl hover:text-primary" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    );
  };
  const ClosedEmailList = () => {
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";
    return (
      <div className=" w-full">
        {mails?.length === 0 ? (
          <div className="m-auto flex">
            <p className=" mx-auto -rotate-90 text-foreground">
              No emails available.
            </p>
          </div>
        ) : (
          <div className="mt-2">
            {Array.isArray(mails) &&
              mails.map((message: any, index: number) => (
                <div
                  key={index}
                  className="mx-auto  w-[99%] cursor-pointer   hover:border-primary  hover:text-primary active:border-primary"
                  onClick={() => {
                    handleEmailClick(message);
                    handleScriptClick();
                    //  handleLineClick(index);
                  }}
                >
                  <div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button className="mx-auto border-none bg-transparent text-foreground hover:bg-transparent">
                            <IoIosMail className="text-2xl hover:text-primary" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent className="bg-white text-black ">
                          <>
                            <div className="my-2 grid grid-cols-1">
                              <p className="text-lg font-bold ">
                                {message.from?.emailAddress?.name}
                              </p>
                              <p className="text-sm   ">
                                {new Date(
                                  message.receivedDateTime
                                ).toLocaleString()}
                              </p>

                              <p className="my-2 ml-2 text-sm  ">
                                {message.subject
                                  ? message.subject
                                    .split(" ")
                                    .slice(0, 12)
                                    .join(" ") + "..."
                                  : ""}
                              </p>
                            </div>

                            <div className="flex justify-between">
                              <div className="mx-auto mr-2 flex space-x-1">
                                <Button
                                  variant="ghost"
                                  onClick={() => {
                                    setSelectedEmail(message);
                                    setTimeout(() => {
                                      handleReply(selectedEmail);
                                    }, 5);
                                  }}
                                  className={`cursor-pointer rounded  p-2 text-center text-xs font-bold uppercase   shadow outline-none transition-all duration-150 ease-linear hover:bg-transparent hover:text-primary hover:shadow-md focus:outline-none `}
                                >
                                  <FaReply className="text-2xl hover:text-primary" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  onClick={() => {
                                    setSelectedEmail(message);
                                    setTimeout(() => {
                                      handleReplyAll(selectedEmail);
                                    }, 5);
                                  }}
                                  className={`cursor-pointer rounded  p-2 text-center text-xs font-bold uppercase   shadow outline-none transition-all duration-150 ease-linear hover:bg-transparent hover:text-primary hover:shadow-md focus:outline-none `}
                                >
                                  <FaReplyAll className="text-2xl hover:text-primary" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  onClick={() => {
                                    setSelectedEmail(message);
                                    setTimeout(() => {
                                      handleForward(selectedEmail);
                                    }, 5);
                                  }}
                                  className={`cursor-pointer rounded  p-2 text-center text-xs font-bold uppercase  shadow outline-none transition-all duration-150 ease-linear hover:bg-transparent hover:text-primary hover:shadow-md focus:outline-none `}
                                >
                                  <FaForward className="text-2xl hover:text-primary" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  onClick={() => {
                                    // handleDeleteClick(selectedEmail)
                                    //  console.log(email)
                                    SetToTrash(email);
                                    toast.success(`Email moved to trash.`);
                                    //  setEmails(emails);
                                    setTimeout(() => {
                                      GetEmailsFromFolder(label);
                                    }, 5);
                                    setTimeout(() => {
                                      setSelectedEmail(emails[1]);
                                      setReply(false);
                                    }, 10);
                                  }}
                                  className={`cursor-pointer rounded  p-2 text-center text-xs font-bold uppercase  shadow outline-none transition-all duration-150 ease-linear hover:bg-transparent hover:text-primary hover:shadow-md focus:outline-none `}
                                >
                                  <FaTrash className="text-2xl hover:text-primary" />
                                </Button>
                              </div>
                            </div>
                          </>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    );
  };

  const [selectedCategorySize, setSelectedCategorySize] = useState(true);
  const [selectedSubcategory, setSelectedSubcategory] = useState(true);
  const [selectedScript, setSelectedScript] = useState(false);
  const [selectShrink, setSelectShrink] = useState(false);
  const [selectGrow, setSelectGrow] = useState(false);

  const handleCategoryClick = () => {
    setSelectedCategorySize(true);
  };
  const handleCategoryClickClose = () => {
    setSelectedCategorySize(false);
  };
  const handleCategoryClickselectShrink = () => {
    setSelectedCategorySize(false);
    setSelectedSubcategory(false);
    setSelectShrink(true);
    setSelectedScript(true);
  };
  const handleSubcategoryClick = () => {
    setSelectedSubcategory(true);
    setSelectedScript(true);
    setSelectShrink(false);
  };
  const handleScriptClick = () => {
    // setSelectedSubcategory(false);
    setSelectedScript(true);
    // setSelectShrink(false)
  };
  const handleReplyClick = () => {
    setSelectedCategorySize(false);
    setSelectGrow(true);
    setSelectedSubcategory(false);
    setSelectShrink(true);
    setReply(true);
    setSelectedScript(false);
  };
  const handleCloseReplyClick = () => {
    setSelectedCategorySize(false);
    setSelectGrow(false);
    setSelectShrink(false);
    setSelectedSubcategory(true);
    setSelectedScript(true);
  };


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
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          const formData = new FormData();
          formData.append("layout", JSON.stringify(sizes));
          fetcher.submit(formData, { method: "post", });
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
            const formData = new FormData();
            formData.append("collapsed", JSON.stringify(isCollapsed));
            fetcher.submit(formData, { method: "post", });

          }}
          onResize={() => {
            setIsCollapsed(false)
            const formData = new FormData();
            formData.append("collapsed", JSON.stringify(isCollapsed));
            fetcher.submit(formData, { method: "post", });
          }}
          className={cn(
            isCollapsed &&
            "min-w-[50px] transition-all duration-300 ease-in-out"
          )}
        >

          <Separator />
          <Nav isCollapsed={isCollapsed} links={primaryLinks} />
          <Separator />
          <Nav isCollapsed={isCollapsed} links={secondaryLinks} />

        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
          <Tabs defaultValue="all">
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
              <MailList items={mails.filter((item) => !item.read)} setMail={setMail} mail={mail} />
            </TabsContent>
          </Tabs>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[2]} minSize={30}>
          <MailDisplay mail={mail} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  )
}
//mails.find((item) => item.id === mail.selected) || null
