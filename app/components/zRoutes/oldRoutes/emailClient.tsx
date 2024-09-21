import React, { useCallback, useEffect, useRef, useState } from "react";
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
import {
  EditorTiptapHook,
  Editor,
  EditorTiptapHookCompose,
} from "~/components/libs/basicEditor";
import { toast } from "sonner";



import secondary from "~/styles/secondary.css";
import { type LinksFunction } from "@remix-run/node";
import useSWR, { SWRConfig, mutate, useSWRConfig } from 'swr';
import { Mail } from '~/routes/__authorized/dealer/features/email/mail'

import { useMsal } from "@azure/msal-react";
import { type AuthCodeMSALBrowserAuthenticationProvider } from "@microsoft/microsoft-graph-client/authProviders/authCodeMsalBrowser";
import ProvideAppContext, { useAppContext, } from "~/components/microsoft/AppContext";


export const links: LinksFunction = () => [
  { rel: "stylesheet", href: secondary },
];
// note for faster load times, load emails once and filter instead of calling each one... might be faster

export default function ClientEmail() {
  const app = useAppContext();
  const { instance, accounts } = useMsal();
  const activeAccount = instance.getActiveAccount();
  const email = String(activeAccount?.username);
  const user = getUser(app.authProvider!);


  const layout = 30//layoutCookie2
  const collapsed = false// collapsedCookie2

  const defaultLayout = [20, 32, 48]
  const defaultCollapsed = collapsed


  const [folders, setFolders] = useState([]);
  const [label, setLabel] = useState("Unread");
  const [unreadItemCount, setUnreadItemCount] = useState(0);
  const [draftCount, setDraftCount] = useState(0);
  const [unreadJunkCount, setUnreadJunkCount] = useState(0);
  const [emails, setEmails] = useState();
  const [trashCounts, setTrashCount] = useState(0);
  const [subject, setSubject] = useState("");
  const [labelName, setLabelName] = useState("");
  const [selectedEmail, setSelectedEmail] = useState();
  const [reply, setReply] = useState(false);
  const [to, setTo] = useState("");
  const [cc, setCC] = useState([]);
  const [bcc, setBcc] = useState([]);
  const [inbox, setInbox] = useState();
  const [openReply, setOpenReply] = useState(false);
  const [loading, setLoading] = useState(false);
  const [composeEmail, setComposeEmail] = useState(false);
  const [renameLabel, setRenameLabel] = useState("");
  const [RenameFolderInput, setRenameFolderInput] = useState(false);
  const [folderBeingRenamed, setFolderBeingRenamed] = useState("test");
  const [which, setWhich] = useState("");
  const [templates, setTemplates] = useState();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [text, setText] = React.useState("");
  const [contentValue, setContentValue] = useState(text);
  const contentRef = useRef<HTMLInputElement>(null);

  //const dataFetcher =; //(url) => fetch(url).then(res => res.json());
  //const { data, isLoading, isValidating } = useSWR(dataFetcher, { refreshInterval: 15000 })

  const dataFetcher = testInbox(app.authProvider!); //(url) => fetch(url).then(res => res.json());
  const { data, error, isLoading, isValidating } = useSWR(dataFetcher, { refreshInterval: 15000 })
  useEffect(() => {
    if (data) {
      setEmails(data.value);
    }
  }, [data]);



  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const response = await testInbox(app.authProvider!);
        console.log(response, 'response')
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

    if (emails?.length === 0) {
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

  const iFrameRef: React.LegacyRef<HTMLIFrameElement> = useRef(null);

  const MyIFrameComponent = () => {
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
      const handleHeightMessage = (event: MessageEvent) => {
        if (
          event.data &&
          event.data.type === "iframeHeight" &&
          event.data.height
        ) {
          setIsLoading(false);
          if (iFrameRef.current) {
            iFrameRef.current.style.height = `${event.data.height}px`;
          }
        }
      };
      const currentHost =
        typeof window !== "undefined" ? window.location.host : null;
      if (iFrameRef.current) {
        if (currentHost === "localhost:3000") {
          iFrameRef.current.src = "http://localhost:3000/dealer/features/body";
        }
        if (currentHost === "dealersalesassistant.ca") {
          iFrameRef.current.src =
            "https://www.dealersalesassistant.ca/dealer/features/body";
        }
        window.addEventListener("message", handleHeightMessage);
      }
      return () => {
        if (iFrameRef.current) {
          window.removeEventListener("message", handleHeightMessage);
        }
      };
    }, []);

    return (
      <>
        <div className="size-full ">
          <iframe
            ref={iFrameRef}
            title="my-iframe"
            width="100%"
            className=" border-none"
            style={{
              minHeight:
                reply === false
                  ? "70vh"
                  : "60vh" || selectGrow === true
                    ? "80vh"
                    : "60vh",
            }}
          />
        </div>
      </>
    );
  };

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
    setWhich("reply");
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
    setWhich("reply");
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
    setWhich("replyAll");
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

  const [selectedScript, setSelectedScript] = useState(false);

  const [selectGrow, setSelectGrow] = useState(false);




  console.log(emails, 'emails emailclient')
  return (
    <>
      <div className='border border-border rounded-md mt-[45px] m-5'>
        <Mail mails={emails} defaultLayout={defaultLayout} defaultCollapsed={defaultCollapsed} instance={instance} activeAccount={activeAccount} />
      </div>

    </>
  );
}

/**
 *
 *   const handleScriptClick = () => {
    // setSelectedSubcategory(false);
    setSelectedScript(true);
    // setSelectShrink(false)
  };
 *   const LabelList = () => {
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
            {emails?.length === 0 ? (
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
                {Array.isArray(emails) &&
                  emails.map((message: any, index: number) => (
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
            {emails?.length === 0 ? (
              <div className="m-auto flex">
                <p className=" mx-auto -rotate-90 text-foreground">
                  No emails available.
                </p>
              </div>
            ) : (
              <div className="mt-2">
                {Array.isArray(emails) &&
                  emails.map((message: any, index: number) => (
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


 *   const [selectShrink, setSelectShrink] = useState(false);
  const [selectedCategorySize, setSelectedCategorySize] = useState(true);
  const [selectedSubcategory, setSelectedSubcategory] = useState(true);
 *
 *   const handleCategoryClick = () => {
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

 *   const handleReplyClick = () => {
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
  };  <div className=" !mx-auto mt-[60px] flex !h-[90vh] !w-[95%]  !bg-background">
        <Card
          className={`mx-2 justify-between border-border transition delay-300 duration-1000 ease-in-out ${selectedCategorySize ? "w-[15%]" : "w-[7%]"
            }`}
        >
          <CardHeader className="flex justify-center ">
            <CardTitle>
              {selectedCategorySize && (
                <Button
                  size='sm'
                  variant="ghost"
                  onClick={() => {
                    setComposeEmail(true);
                    setReply(false);
                    setSelectedEmail(null);
                    setOpenReply(false);
                    setSelectedCategorySize(false);
                    setSelectedSubcategory(false);
                    setSelectShrink(true);
                    setSelectedScript(true);
                  }}
                  className={` m-2 mx-auto w-[90%] cursor-pointer justify-center rounded !border border-border p-3 text-center text-xs font-bold uppercase text-foreground shadow outline-none transition-all duration-150 ease-linear hover:bg-transparent hover:text-primary hover:shadow-md focus:outline-none `}
                >

                  <p className="mx-2">Compose</p>
                </Button>
              )}
              {!selectedCategorySize && (
                <button
                  onClick={() => {
                    setComposeEmail(true);
                    setReply(false);
                    setSelectedEmail(null);
                    setOpenReply(false);
                  }}
                  className={` mx-auto w-[98%] cursor-pointer    text-foreground shadow outline-none   hover:bg-transparent hover:text-primary hover:shadow-md focus:outline-none `}
                >
                  <FaPencil className="text-2xl hover:text-primary" />
                </button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="my-auto">
            {selectedCategorySize && <LabelList />}
            {!selectedCategorySize && <ClosedLabelList />}
          </CardContent>
          <CardFooter className=" flex  justify-center">
            {selectedCategorySize && (
              <Button
                className="mx-auto  bg-transparent text-foreground duration-200  hover:bg-transparent    "
                onClick={handleCategoryClickClose}
              >
                <MdOutlineKeyboardDoubleArrowLeft className="   text-xl hover:text-primary" />
              </Button>
            )}
            {!selectedCategorySize && (
              <Button
                variant="ghost"
                className="  mx-auto bg-transparent text-foreground  hover:bg-transparent  "
                onClick={handleCategoryClick}
              >
                <MdOutlineKeyboardDoubleArrowRight className=" text-2xl hover:text-primary" />
              </Button>
            )}
          </CardFooter>
        </Card>

        <Card
          className={`mx-2 border-border transition delay-300 duration-1000 ease-in-out
            ${selectedSubcategory ? "grow" : "w-[30%]"}
            ${selectShrink ? "w-[7%]" : ""}  `}
        >
          <CardHeader className="grid grid-cols-[1fr_50px]  justify-between gap-4 space-y-0">
            <CardTitle>
              {selectedSubcategory && (
                <div className="flex w-[90&] justify-between">
                  <Button
                    size='sm'
                    variant="ghost"
                    onClick={handleSubcategoryClick}
                    className="m-2 border-border cursor-pointer justify-center rounded !border !border-transparent p-3 text-center text-xs font-bold uppercase text-foreground shadow outline-none transition-all duration-150 ease-linear hover:bg-transparent hover:text-primary hover:shadow-md focus:outline-none"
                  >
                    <p className="my-3 ml-3 text-foreground">{label}</p>
                    <p className="my-3 ml-3 text-[#868686]">
                      {(() => {
                        switch (label) {
                          case "Unread":
                          case "Inbox":
                            return <p>{unreadItemCount}</p>;
                          case "Junk Email":
                            return <p>{unreadJunkCount}</p>;
                          case "Drafts":
                            return <p>(0)</p>;
                          case "Archive":
                            return <p>(1)</p>;
                          case "Deleted Items":
                            return <p>(3)</p>;
                          default:
                            return null;
                        }
                      })()}
                    </p>
                  </Button>
                </div>
              )}
              {selectShrink && (
                <div className="mx-auto mt-3 grid grid-cols-1">
                  <Button
                    size='sm'
                    variant="ghost"
                    className="mx-auto mt-auto -rotate-90 bg-transparent text-foreground hover:bg-transparent border-border"
                    onClick={handleSubcategoryClick}
                  >
                    {label}
                  </Button>
                </div>
              )}
            </CardTitle>
            <CardDescription>
              <div>
                {selectedSubcategory && (
                  <Button
                    className=" relative bg-transparent  text-foreground duration-200 hover:bg-transparent    "
                    onClick={() => {
                      handleCategoryClickselectShrink();
                    }}
                  >
                    <MdOutlineKeyboardDoubleArrowLeft className="   text-2xl hover:text-primary" />
                  </Button>
                )}
              </div>
            </CardDescription>
            {selectedSubcategory && (
              <Input
                name="search"
                placeholder="Search"
                className="m-2 mx-auto w-[95%] border border-border bg-background text-foreground focus:border-primary"
              />
            )}
          </CardHeader>
          <CardContent className="space-y-2 ">
            <div className="h-auto max-h-[80vh]  overflow-y-scroll">
              {selectedSubcategory && <EmailList />}
              {selectShrink && (
                <div className="mx-auto grid grid-cols-1">
                  <ClosedEmailList />
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter></CardFooter>
        </Card>

        <Card
          className={`mx-2 border-border transition delay-300 duration-1000 ease-in-out
            ${selectedScript ? "w-[50%]" : "w-[15%]"}  ${selectGrow ? "w-full" : " "
            }  ${composeEmail ? "w-full" : " "
            } `}
        >
          <CardContent className=" mx-auto my-3 w-auto ">
            {selectedScript && (
              <div className=" h-auto max-h-[80vh]  ">
                {openReply === true && (
                  <div className="email flex   flex-col  ">
                    <div className="flex justify-between !border-b !border-border">
                      <div className="!my-2 !flex">
                        <Button
                          variant="ghost"
                          onClick={() => {
                            //max-h-[60vh]
                            //   setReply(false)
                            //  setOpenReply(false)
                            HandleGewtLabel(label);
                            GetNextEmail(emails);
                          }}
                          className={`  cursor-pointer rounded  p-3 text-center text-xs font-bold uppercase text-foreground shadow outline-none transition-all duration-150 ease-linear hover:bg-transparent hover:text-primary hover:shadow-md focus:outline-none `}
                        >
                          <ImCross className="text-2xl hover:text-primary" />
                        </Button>

                        <Button
                          variant="ghost"
                          onClick={() => {
                            handleDeleteClick(label, selectedEmail?.id);
                            HandleGewtLabel(label);
                            GetNextEmail(emails);
                            toast.success(`Email deleted!`);
                          }}
                          className={`cursor-pointer text-center text-foreground outline-none transition-all duration-150 ease-linear hover:bg-transparent hover:text-primary focus:outline-none `}
                        >
                          <FaTrash className="text-2xl hover:text-primary" />
                        </Button>
                        {label !== "Trash" && (
                          <Button
                            onClick={() => {
                              handlesetToUnread(selectedEmail);
                              GetNextEmail(emails);
                            }}
                            variant="outline"
                            className="border-transparent text-foreground hover:bg-transparent hover:text-primary"
                          >
                            <MdMarkunreadMailbox className="text-2xl hover:text-primary" />
                          </Button>
                        )}
                        {label === "Trash" && (
                          <Button
                            variant="ghost"
                            onClick={() => {
                              handleDeleteClick(label, selectedEmail.id);
                              GetNextEmail(emails);
                            }}
                            className={`cursor-pointer text-center text-foreground outline-none transition-all duration-150 ease-linear hover:bg-transparent hover:text-primary focus:outline-none `}
                          >
                            Send To Inbox
                          </Button>
                        )}
                        {selectGrow && (
                          <Button
                            variant="ghost"
                            onClick={() => {
                              handleCloseReplyClick();
                            }}
                            className={`cursor-pointer text-center text-foreground outline-none transition-all duration-150 ease-linear hover:bg-transparent hover:text-primary focus:outline-none `}
                          >
                            <RiContractLeftRightLine className="text-2xl hover:text-primary" />
                          </Button>
                        )}
                        {!selectGrow && (
                          <Button
                            variant="ghost"
                            onClick={() => {
                              handleReplyClick();
                            }}
                            className={`cursor-pointer text-center text-foreground outline-none transition-all duration-150 ease-linear hover:bg-transparent hover:text-primary focus:outline-none `}
                          >
                            <BsArrowsExpandVertical className="text-2xl hover:text-primary" />
                          </Button>
                        )}
                      </div>
                      <div className="!my-2 !flex">
                        <Button
                          variant="ghost"
                          onClick={() => {
                            setTimeout(() => {
                              handleReply(selectedEmail);
                            }, 5);
                          }}
                          className={`cursor-pointer rounded  p-3 text-center text-xs font-bold uppercase text-foreground shadow outline-none transition-all duration-150 ease-linear hover:bg-transparent hover:text-primary hover:shadow-md focus:outline-none `}
                        >
                          <FaReply className="text-2xl hover:text-primary" />
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => {
                            setTimeout(() => {
                              handleReplyAll(selectedEmail);
                            }, 5);
                          }}
                          className={`cursor-pointer rounded  p-3 text-center text-xs font-bold uppercase text-foreground shadow outline-none transition-all duration-150 ease-linear hover:bg-transparent hover:text-primary hover:shadow-md focus:outline-none `}
                        >
                          <FaReplyAll className="text-2xl hover:text-primary" />
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => {
                            setTimeout(() => {
                              handleForward(selectedEmail);
                            }, 5);
                          }}
                          className={`cursor-pointer rounded  p-3 text-center text-xs font-bold uppercase text-foreground shadow outline-none transition-all duration-150 ease-linear hover:bg-transparent hover:text-primary hover:shadow-md focus:outline-none `}
                        >
                          <FaForward className="text-2xl hover:text-primary" />
                        </Button>

                        <DropdownMenu>
                          <DropdownMenuTrigger
                            asChild
                            className="m-auto mr-4 cursor-pointer"
                          >
                            <BsThreeDotsVertical className="text-2xl text-foreground hover:text-primary" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-56 bg-background">
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                              <DropdownMenuItem
                                className="cursor-pointer hover:text-primary"
                                onClick={() => {
                                  handleReply(selectedEmail);
                                }}
                              >
                                Reply
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="cursor-pointer hover:text-primary"
                                onClick={() => {
                                  handleReplyAll(selectedEmail);
                                }}
                              >
                                Reply All
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="cursor-pointer hover:text-primary"
                                onClick={() => {
                                  handleForward(selectedEmail);
                                }}
                              >
                                Forward
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="cursor-pointer hover:text-primary"
                                onClick={() => {
                                  handleDeleteClick(label, selectedEmail?.id);
                                  HandleGewtLabel(label);
                                  GetNextEmail(emails);
                                  toast.success(`Email deleted!`);
                                }}
                              >
                                Delete
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="cursor-pointer hover:text-primary"
                                onClick={() => {
                                  messageUnRead(
                                    app.authProvider!,
                                    selectedEmail.id
                                  );
                                  toast.success(`Set to unread.`);
                                }}
                              >
                                Mark As Unread
                              </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                              <DropdownMenuSub>
                                <DropdownMenuSubTrigger className="cursor-pointer hover:text-primary">
                                  Move
                                </DropdownMenuSubTrigger>
                                <DropdownMenuPortal>
                                  <DropdownMenuSubContent className="bg-white">
                                    {folders.map((item, index) => {
                                      return (
                                        <DropdownMenuItem
                                          className="cursor-pointer hover:text-primary"
                                          key={index}
                                          onClick={() => {
                                            MoveEmail(selectedEmail, labelName);
                                          }}
                                        >
                                          {item.name}
                                        </DropdownMenuItem>
                                      );
                                    })}
                                  </DropdownMenuSubContent>
                                </DropdownMenuPortal>
                              </DropdownMenuSub>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedEmail(selectedEmail);
                                setComposeEmail(true);
                              }}
                            >
                              Create New Email
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    {!reply && (
                      <div className="my-2 rounded-md border border-border">
                        <div className="m-2 flex items-center justify-between">
                          <p className="text-bold  text-lg text-foreground">
                            {selectedEmail?.sender.emailAddress.name}
                          </p>
                          <p className="text-bold text-sm text-foreground">
                            {new Date(
                              selectedEmail?.receivedDateTime
                            ).toLocaleString()}
                          </p>
                        </div>
                        <p className="text-bold ml-2 text-sm text-foreground">
                          {selectedEmail?.sender.emailAddress.address}
                        </p>
                      </div>
                    )}
                    {reply && (
                      <div className=" justify-center border-b border-border">
                        <Input
                          defaultValue={to}
                          name="to"
                          className="m-2 mx-auto w-[98%] bg-background text-foreground"
                        />
                        <Input
                          defaultValue={subject}
                          name="subject"
                          className="m-2 mx-auto w-[98%] bg-background text-foreground"
                        />
                      </div>
                    )}
                    {selectedEmail?.body && (
                      <div className="!grow  !border-t border-border bg-white">
                        <p className="  !text-sm  ">
                          <div className="parent-container">
                            <MyIFrameComponent />
                          </div>
                        </p>
                      </div>
                    )}
                    {reply && (
                      <div className="mb-2 items-end justify-end rounded-md border-l border-t border-border">
                        <EditorTiptapHook content={null} user={user} />

                        <input type="hidden" defaultValue={text} name="body" />

                        <div className="mx-2 flex justify-between">
                          <Button
                            onClick={() => {
                              toast.success(`Email saved!`);
                              SaveDraft();
                            }}
                            className={` ml-2 cursor-pointer rounded border border-[#fff] bg-transparent p-3 text-center text-xs font-bold uppercase text-foreground shadow outline-none transition-all duration-150 ease-linear hover:bg-transparent hover:text-primary hover:shadow-md focus:outline-none `}
                          >
                            Save Draft
                          </Button>
                          <Button
                            onClick={() => {
                              toast.success(`Email sent!`);
                              setTo(to);
                              setSubject(subject);
                              setTimeout(() => {
                                SendEmail(user, to, subject, text);
                                setReply(false);
                              }, 5);
                            }}
                            className={` mr-2 cursor-pointer rounded border border-[#fff] bg-transparent p-3 text-center text-xs font-bold uppercase text-foreground shadow outline-none transition-all duration-150 ease-linear hover:bg-transparent hover:text-primary hover:shadow-md focus:outline-none `}
                          >
                            Send
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            <div className=" h-auto  max-h-[90vh]  ">
              {composeEmail === true && (
                <div className="email flex h-full w-auto  flex-col">
                  <div className="flex justify-between border-b border-border">
                    <div className="my-2 ml-auto flex">
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setComposeEmail(false);
                          HandleGewtLabel(label);
                        }}
                        className={`  cursor-pointer rounded  p-3 text-center text-xs font-bold uppercase text-foreground shadow outline-none transition-all duration-150 ease-linear hover:bg-transparent hover:text-primary hover:shadow-md focus:outline-none `}
                      >
                        <ImCross className="text-2xl hover:text-primary" />
                      </Button>
                    </div>
                  </div>
                  <div className=" justify-center border-b border-border">
                    <Input
                      type="text"
                      onChange={(e) => {
                        setTo(e.target.value);
                      }}
                      placeholder="To"
                      name="to"
                      className="m-2 mx-auto w-[98%] bg-background text-foreground"
                    />
                    <Input
                      onChange={(e) => {
                        setSubject(e.target.value);
                      }}
                      placeholder="Subject"
                      name="subject"
                      className="m-2 mx-auto w-[98%] bg-background text-foreground"
                    />
                    <div className="mx-auto mt-2 flex w-[98%]">
                      <Input
                        onChange={(e) => {
                          setCC(e.target.value);
                        }}
                        name="cc"
                        placeholder="cc"
                        className="mx-auto mb-2 mr-1 bg-background  text-foreground"
                      />
                      <Input
                        onChange={(e) => {
                          setBcc(e.target.value);
                        }}
                        name="bcc"
                        placeholder="bcc"
                        className="mx-auto ml-1 bg-background text-right  text-foreground"
                      />
                    </div>
                  </div>

                  <div className="border-1 mb-2 grow items-end justify-end overflow-auto rounded-md border-t border-border">
                    <EditorTiptapHookCompose
                      content={null}
                      user={user}
                      subject={subject}
                      to={to}
                      app={app}
                      cc={cc}
                      bcc={bcc}
                    />

                    <input type="hidden" defaultValue={text} name="body" />

                    <div className="mx-2 flex justify-between">
                      <div className="flex"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className=" h-auto max-h-[80vh] ">
              {selectGrow === true && (
                <div className="email flex   flex-col  ">
                  <div className="flex justify-between !border-b !border-border">
                    <div className="!my-2 !flex">
                      <Button
                        variant="ghost"
                        onClick={() => {
                          //max-h-[60vh]
                          setReply(false);
                          setOpenReply(false);
                          HandleGewtLabel(label);
                          GetNextEmail(emails);
                        }}
                        className={`  cursor-pointer rounded  p-3 text-center text-xs font-bold uppercase text-foreground shadow outline-none transition-all duration-150 ease-linear hover:bg-transparent hover:text-primary hover:shadow-md focus:outline-none `}
                      >
                        <ImCross className="text-2xl hover:text-primary" />
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          handleDeleteClick(label, selectedEmail?.id);
                          HandleGewtLabel(label);
                          GetNextEmail(emails);
                          toast.success(`Email deleted!`);
                        }}
                        className={`cursor-pointer text-center text-foreground outline-none transition-all duration-150 ease-linear hover:bg-transparent hover:text-primary focus:outline-none `}
                      >
                        <FaTrash className="text-2xl hover:text-primary" />
                      </Button>
                      {label !== "Trash" && (
                        <Button
                          onClick={() => {
                            handlesetToUnread(selectedEmail);
                            GetNextEmail(emails);
                          }}
                          variant="outline"
                          className="border-transparent text-foreground hover:bg-transparent hover:text-primary"
                        >
                          <MdMarkunreadMailbox className="text-2xl hover:text-primary" />
                        </Button>
                      )}
                      {label === "Trash" && (
                        <Button
                          variant="ghost"
                          onClick={() => {
                            handleDeleteClick(label, selectedEmail.id);
                            GetNextEmail(emails);
                          }}
                          className={`cursor-pointer text-center text-foreground outline-none transition-all duration-150 ease-linear hover:bg-transparent hover:text-primary focus:outline-none `}
                        >
                          Send To Inbox
                        </Button>
                      )}
                      {selectGrow && (
                        <Button
                          variant="ghost"
                          onClick={() => {
                            handleCloseReplyClick();
                          }}
                          className={`cursor-pointer text-center text-foreground outline-none transition-all duration-150 ease-linear hover:bg-transparent hover:text-primary focus:outline-none `}
                        >
                          <RiContractLeftRightLine className="text-2xl hover:text-primary" />
                        </Button>
                      )}
                      {!selectGrow && (
                        <Button
                          variant="ghost"
                          onClick={() => {
                            handleReplyClick();
                          }}
                          className={`cursor-pointer text-center text-foreground outline-none transition-all duration-150 ease-linear hover:bg-transparent hover:text-primary focus:outline-none `}
                        >
                          <BsArrowsExpandVertical className="text-2xl hover:text-primary" />
                        </Button>
                      )}
                    </div>
                    <div className="!my-2 !flex">
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setTimeout(() => {
                            handleReply(selectedEmail);
                          }, 5);
                        }}
                        className={`cursor-pointer rounded  p-3 text-center text-xs font-bold uppercase text-foreground shadow outline-none transition-all duration-150 ease-linear hover:bg-transparent hover:text-primary hover:shadow-md focus:outline-none `}
                      >
                        <FaReply className="text-2xl hover:text-primary" />
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setTimeout(() => {
                            handleReplyAll(selectedEmail);
                          }, 5);
                        }}
                        className={`cursor-pointer rounded  p-3 text-center text-xs font-bold uppercase text-foreground shadow outline-none transition-all duration-150 ease-linear hover:bg-transparent hover:text-primary hover:shadow-md focus:outline-none `}
                      >
                        <FaReplyAll className="text-2xl hover:text-primary" />
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setTimeout(() => {
                            handleForward(selectedEmail);
                          }, 5);
                        }}
                        className={`cursor-pointer rounded  p-3 text-center text-xs font-bold uppercase text-foreground shadow outline-none transition-all duration-150 ease-linear hover:bg-transparent hover:text-primary hover:shadow-md focus:outline-none `}
                      >
                        <FaForward className="text-2xl hover:text-primary" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          asChild
                          className="m-auto mr-4 cursor-pointer"
                        >
                          <BsThreeDotsVertical className="text-2xl text-foreground hover:text-primary" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56 bg-background">
                          <DropdownMenuSeparator />
                          <DropdownMenuGroup>
                            <DropdownMenuItem
                              className="cursor-pointer hover:text-primary"
                              onClick={() => {
                                handleReply(selectedEmail);
                              }}
                            >
                              Reply
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="cursor-pointer hover:text-primary"
                              onClick={() => {
                                handleReplyAll(selectedEmail);
                              }}
                            >
                              Reply All
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="cursor-pointer hover:text-primary"
                              onClick={() => {
                                handleForward(selectedEmail);
                              }}
                            >
                              Forward
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="cursor-pointer hover:text-primary"
                              onClick={() => {
                                handleDeleteClick(label, selectedEmail?.id);
                                HandleGewtLabel(label);
                                GetNextEmail(emails);
                                toast.success(`Email deleted!`);
                              }}
                            >
                              Delete
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="cursor-pointer hover:text-primary"
                              onClick={() => {
                                messageUnRead(
                                  app.authProvider!,
                                  selectedEmail.id
                                );
                                toast.success(`Set to unread.`);
                              }}
                            >
                              Mark As Unread
                            </DropdownMenuItem>
                          </DropdownMenuGroup>
                          <DropdownMenuSeparator />
                          <DropdownMenuGroup>
                            <DropdownMenuSub>
                              <DropdownMenuSubTrigger className="cursor-pointer hover:text-primary">
                                Move
                              </DropdownMenuSubTrigger>
                              <DropdownMenuPortal>
                                <DropdownMenuSubContent className="bg-white">
                                  {folders.map((item, index) => {
                                    return (
                                      <DropdownMenuItem
                                        className="cursor-pointer hover:text-primary"
                                        key={index}
                                        onClick={() => {
                                          MoveEmail(selectedEmail, labelName);
                                        }}
                                      >
                                        {item.name}
                                      </DropdownMenuItem>
                                    );
                                  })}
                                </DropdownMenuSubContent>
                              </DropdownMenuPortal>
                            </DropdownMenuSub>
                          </DropdownMenuGroup>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedEmail(selectedEmail);
                              setComposeEmail(true);
                            }}
                          >
                            Create New Email
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <div className="flex justify-center border-b border-border">
                    <Input
                      defaultValue={to}
                      name="to"
                      className="m-2 mx-auto mr-2 w-[98%] bg-background text-foreground"
                    />
                    <Input
                      defaultValue={subject}
                      name="subject"
                      className="m-2 mx-auto ml-2 w-[98%] bg-background text-foreground"
                    />
                  </div>

                  <div className=" grid grid-cols-2">
                    <div className="!grow  !border-t border-border bg-white">
                      <p className="  !text-sm  ">
                        <div className="parent-container  ">
                          <MyIFrameComponent />
                        </div>
                      </p>
                    </div>

                    <div className="w-full mx-auto mb-2 mt-auto rounded-md border-l border-t border-border">
                      <EditorTiptapHook content={null} user={user} />

                      <input type="hidden" defaultValue={text} name="body" />

                      <div className="mx-2 flex justify-between">
                        <Button
                          onClick={() => {
                            toast.success(`Email saved!`);
                            SaveDraft();
                          }}
                          className={` ml-2 cursor-pointer rounded border border-[#fff] bg-transparent p-3 text-center text-xs font-bold uppercase text-foreground shadow outline-none transition-all duration-150 ease-linear hover:bg-transparent hover:text-primary hover:shadow-md focus:outline-none `}
                        >
                          Save Draft
                        </Button>
                        <Button
                          onClick={() => {
                            toast.success(`Email sent!`);
                            setTo(to);
                            setSubject(subject);
                            setTimeout(() => {
                              SendEmail(user, to, subject, text);
                              setReply(false);
                            }, 5);
                          }}
                          className={` mr-2 cursor-pointer rounded border border-[#fff] bg-transparent p-3 text-center text-xs font-bold uppercase text-foreground shadow outline-none transition-all duration-150 ease-linear hover:bg-transparent hover:text-primary hover:shadow-md focus:outline-none `}
                        >
                          Send
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
      </div>
       */
