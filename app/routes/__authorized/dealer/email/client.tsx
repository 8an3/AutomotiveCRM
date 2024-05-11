import React, { useCallback, useEffect, useRef, useState } from "react";
import { Tabs, TabsList, TabsTrigger, Input, Button, ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger, Dialog as Dialog1, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger, Accordion, AccordionItem, AccordionTrigger, AccordionContent, Label } from "~/components"
import ProvideAppContext, { useAppContext } from '~/components/microsoft/AppContext';
import { deleteMessage, getDrafts, getDraftsList, getInbox, getInboxList, getJunk, getList, getSent, getTrash, messageRead, messageUnRead, getUser, testInbox, getFolders, getAllFolders, getEmailById, MoveEmail, createReplyDraft } from "~/components/microsoft/GraphService";
import { EditorTiptapHook, Editor } from "~/components/libs/basicEditor";
import { useMsal } from '@azure/msal-react';
import { Cross2Icon } from '@radix-ui/react-icons';
import { toast } from "sonner"
import { Form, useNavigation } from "@remix-run/react";
import { Forward, User, Reply, } from "iconoir-react";
import { FaReply, FaReplyAll, FaForward, FaTrash, FaArchive, FaHistory, FaStar, FaCommentDollar } from "react-icons/fa";
import { IoIosMailUnread, IoIosMail, IoMdAlert } from "react-icons/io";
import { IoSend } from "react-icons/io5";
import { MdSms, MdDrafts, MdForum, MdSecurityUpdateGood, MdOutlineSocialDistance, MdMarkunreadMailbox } from "react-icons/md";
import { RiSpam3Fill } from "react-icons/ri";
import { ImCross } from "react-icons/im";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaPencil } from "react-icons/fa6";


export default function Client() {
  const app = useAppContext();
  const { instance, accounts } = useMsal();
  const activeAccount = instance.getActiveAccount();
  const email = String(activeAccount?.username)
  const [folders, setFolders] = useState([])
  const user = getUser(app.authProvider!)
  const [label, setLabel] = useState('Unread')
  const [unreadItemCount, setUnreadItemCount] = useState(0);
  const [draftCount, setDraftCount] = useState(0);
  const [unreadJunkCount, setUnreadJunkCount] = useState(0);
  const [emails, setEmails] = useState();
  const [trashCounts, setTrashCount] = useState(0);
  const [subject, setSubject] = useState('')
  const [labelName, setLabelName] = useState('');
  const [selectedEmail, setSelectedEmail] = useState();
  const [reply, setReply] = useState(false)
  const [to, setTo] = useState('');
  const [cc, setCC] = useState([]);
  const [bcc, setBcc] = useState([]);
  const [inbox, setInbox] = useState()
  const [openReply, setOpenReply] = useState(false)
  const [loading, setLoading] = useState(false);
  const [composeEmail, setComposeEmail] = useState(false);
  const [renameLabel, setRenameLabel] = useState('');
  const [RenameFolderInput, setRenameFolderInput] = useState(false);
  const [folderBeingRenamed, setFolderBeingRenamed] = useState('test');
  const [which, setWhich] = useState('');
  const [templates, setTemplates] = useState();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [text, setText] = React.useState('');
  const [contentValue, setContentValue] = useState(text)
  const contentRef = useRef<HTMLInputElement>(null)


  useEffect(() => {
    // fetch emails
    const fetchEmails = async () => {
      try {
        const folderName = 'inbox'
        const response = await testInbox(app.authProvider!);
        //  console.log(emails)
        setEmails(response.value);
      } catch (error) {
        console.error('Error fetching emails:', error);
      }
    }
    fetchEmails();
    // folder list
    const fetchFolders = async () => {
      const fetchedFolders = await getAllFolders(app.authProvider!);
      //console.log(fetchedFolders, 'fetchedfolders'); // Log the fetched folders to the console

      // Check if fetchedFolders.value is an array and it has items
      if (Array.isArray(fetchedFolders.value) && fetchedFolders.value.length > 0) {
        // Extract the folders array from the fetchedFolders object
        const foldersArray = fetchedFolders.value.map((folder: any) => ({ name: folder.displayName, ...folder }));
        // console.log(foldersArray, 'foldersArray')
        setFolders(foldersArray);
      }
    };
    fetchFolders();
    // unread count
    const fetchUnreadCount = async () => {
      const drafts = await getDrafts(app.authProvider!);
      const totalDrafts = drafts.totalItemCount
      setDraftCount(totalDrafts)
      const messages = await getInbox(app.authProvider!);
      const unreadCount = messages.unreadItemCount
      setUnreadItemCount(unreadCount);
      const junk = await getJunk(app.authProvider!);
      const unreadJunk = junk.totalItemCount
      setUnreadJunkCount(unreadJunk);

    };
    fetchUnreadCount();
    const fetchTemplates = async () => {
      const response = await fetch('/dealer/api/templates');
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
    setSelectedLine(null)
    setIsOpen(false)
  };


  async function GetEmailsFromFolder(name: any) {
    let folderName = name.toLowerCase();
    if (folderName === 'deleted items') {
      folderName = 'deleteditems'
    }
    if (folderName === 'junk email') {
      folderName = 'junkemail'
    }
    if (folderName === 'sent items') {
      folderName = 'sentitems'
    }
    if (folderName === 'conversation history') {
      folderName = 'conversationhistory'
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
    const selectedTemplate = templates.find((template) => template.title === selectedTitle);
    setSelectedTemplate(selectedTemplate.body);
    // setText(selectedTemplate.body);
    setSubject(selectedTemplate.subject);
    console.log('tesxt', text, selectedTemplate)
  };
  useEffect(() => {
    if (text) {
      window.localStorage.setItem("templateEmail", selectedTemplate);
    }
  }, [selectedTemplate, text]);
  let content = text
  let handleUpdate;
  const editor = Editor(content, handleUpdate)
  const someFunction = () => {
    onUpdate({ editor, setText, handleUpdate });
  };

  const handleInputChange = useCallback((e) => {
    setRenameLabel(e.target.value);
  }, []);
  // templates
  const textareaRef = useRef<HTMLTextAreaElement>(null);



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
          iFrameRef.current.src = 'http://localhost:3000/dealer/body';
        }
        if (currentHost === 'dealersalesassistant.ca') {
          iFrameRef.current.src = 'https://www.dealersalesassistant.ca/dealer/body';
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
        <div className="size-full ">
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


  async function HandleGewtLabel(label) {
    if (label === 'Drafts') {
      const labelData = await getList(app.authProvider!, label)
      setEmails(labelData)
    } else if (label === 'Unread') {
      const response = await testInbox(app.authProvider!);
      setEmails(response.value);
    } else {
      const labelData = await getList(app.authProvider!, label)
      setEmails(labelData.value)
    }
  }
  // reply
  const handleReply = async (selectedEmail) => {
    setWhich('reply')
    setTo(null)
    setSubject(null)
    await messageRead(app.authProvider!, selectedEmail.id)
    setTimeout(() => {
      setTo(selectedEmail?.sender.emailAddress.address)
      setSubject(selectedEmail.subject)
    }, 0);
    setReply(true)

  };
  const handleForward = async (selectedEmail) => {
    setWhich('reply')
    setTo(null)
    setSubject(null)
    await messageRead(app.authProvider!, selectedEmail.id)
    setTimeout(() => {
      setTo(selectedEmail?.sender.emailAddress.address)
      setSubject(selectedEmail.subject)
    }, 0);
    setReply(true)

  };
  // reply all
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
  // email click
  const handleEmailClick = async (email) => {
    if (email && email.id) {
      messageRead(app.authProvider!, email.id);
      const emailMessage = await getEmailById(app.authProvider!, email.id);
      setSelectedEmail(emailMessage)
      setTo(email.sender.emailAddress.address)
      if (email.ccRecipients) {
        setCC(email.ccRecipients)
      }
      if (email.bccRecipients) {
        setBcc(email.bccRecipients)
      }
      setReply(false)
      setOpenReply(true)
      const messageId = email.id
      //  const setUNREAD = await SetToRead(email)
    } else {
      console.error('Email object or its id is undefined:', email,);
    }
  };
  async function GetNextEmail(emails) {
    const emailMessage = await getEmailById(app.authProvider!, emails[1].id);
    setSelectedEmail(emailMessage)
  }
  // delete click
  const handleDeleteClick = (folderName, id) => {
    deleteMessage(app.authProvider!, id)
    toast.success(`Email moved to trash.`)
    getList(app.authProvider!, folderName);
    //  setEmails(emails);
  };
  async function handlesetToUnread(id) {
    messageUnRead(app.authProvider!, id)

  }
  const displayNameOrder = [
    'Inbox',
    'Sent Items',
    'Drafts',
    'Trash',
    'Archive',
    'Junk Email',
    'Starred',
    'Important',
    'Unread',
    'Chat',
    'Conversation History',
    'Forums',
    'Updates',
    'Personal',
    'Promotions',
    'Social',
    'Deleted Items',
    'Outbox'
  ];
  const LabelList = () => {

    return (
      <>
        <div className="!border-b !border-[#3b3b3b]">
          <Button
            variant='ghost'
            onClick={() => {
              setComposeEmail(true)
              setReply(false)
              setSelectedEmail(null)
              setOpenReply(false)
            }}
            className={` m-2 w-[90%] cursor-pointer justify-center rounded !border !border-[#fff] p-3 text-center text-xs font-bold uppercase text-[#fff] shadow outline-none transition-all duration-150 ease-linear hover:bg-transparent hover:text-[#02a9ff] hover:shadow-md focus:outline-none `}
          >
            <FaPencil className="text-2xl hover:text-[#02a9ff]" />
            <p className='ml-2 mr-2'>Compose </p>
          </Button>
        </div>
        <div className="">

          <div className="flex-col items-center justify-center ">
            <button
              onClick={() => {
                setLabel('Unread')
                HandleGewtLabel(label);

              }}
              value="Unread"
              className={`ml-2 mt-3 flex cursor-pointer items-start text-left text-[#fff] outline-none transition-all duration-150 ease-linear hover:bg-transparent hover:text-[#02a9ff] focus:outline-none ${label === 'Unread' ? 'text-[#02a9ff]  ' : ''}`}
            >
              <IoIosMailUnread className="text-2xl hover:text-[#02a9ff]" />
              <p className='ml-2 mr-2'>Unread </p><p className='text-[#868686]'>{unreadItemCount}</p>
            </button>
            {displayNameOrder.map((displayName, index) => {
              const item = folders.find(folder => folder.displayName === displayName);

              if (!item) {
                return null;
              }

              return (
                <div key={index} className="mx-2  flex items-center justify-between">
                  {RenameFolderInput === false && (
                    <div className="flex">
                      <ContextMenu>
                        <ContextMenuTrigger>
                          <button
                            onClick={() => {
                              HandleGewtLabel(displayName);
                              setLabel(displayName);
                              //   console.log(displayName, 'displayName');
                            }}
                            className={`mt-3 flex cursor-pointer items-start text-left text-[#fff] outline-none transition-all duration-150 ease-linear hover:bg-transparent hover:text-[#02a9ff] focus:outline-none ${item.display === label ? 'text-[#02a9ff]' : ''}`}
                          >
                            {(() => {
                              switch (displayName) {
                                case 'Trash':
                                  return <FaTrash className="text-2xl hover:text-[#02a9ff]" />
                                case 'Sent Items':
                                  return <IoSend className="text-2xl hover:text-[#02a9ff]" />
                                case 'Archive':
                                  return <FaArchive className="text-2xl hover:text-[#02a9ff]" />
                                case 'Conversation History':
                                  return <FaHistory className="text-2xl hover:text-[#02a9ff]" />
                                case 'Chat':
                                  return <MdSms className="text-2xl hover:text-[#02a9ff]" />
                                case 'Important':
                                  return <IoMdAlert className="text-2xl hover:text-[#02a9ff]" />
                                case 'Outbox':
                                  return <IoSend className="text-2xl hover:text-[#02a9ff]" />
                                case 'Inbox':
                                  return <IoIosMail className="text-2xl hover:text-[#02a9ff]" />
                                case 'Drafts':
                                  return <MdDrafts className="text-2xl hover:text-[#02a9ff]" />
                                case 'Junk Email':
                                  return <RiSpam3Fill className="text-2xl hover:text-[#02a9ff]" />
                                case 'Starred':
                                  return <FaStar className="text-2xl hover:text-[#02a9ff]" />
                                case 'Unread':
                                  return <IoIosMailUnread className="text-2xl hover:text-[#02a9ff]" />
                                case 'Forums':
                                  return <MdForum className="text-2xl hover:text-[#02a9ff]" />
                                case 'Updates':
                                  return <MdSecurityUpdateGood className="text-2xl hover:text-[#02a9ff]" />
                                case 'Personal':
                                  return <User className="text-2xl hover:text-[#02a9ff]" />
                                case 'Promotions':
                                  return <FaCommentDollar className="text-2xl hover:text-[#02a9ff]" />
                                case 'Social':
                                  return <MdOutlineSocialDistance className="text-2xl hover:text-[#02a9ff]" />
                                case 'Deleted Items':
                                  return <FaTrash strokeWidth={1.5} className="text-2xl hover:text-[#02a9ff]" />
                                default:
                                  return (
                                    <svg
                                      width="20px"
                                      height="20px"
                                      stroke-width="1.1"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                      color="#000000"
                                    >
                                      <path
                                        d="M2 11V4.6C2 4.26863 2.26863 4 2.6 4H8.77805C8.92127 4 9.05977 4.05124 9.16852 4.14445L12.3315 6.85555C12.4402 6.94876 12.5787 7 12.722 7H21.4C21.7314 7 22 7.26863 22 7.6V11M2 11V19.4C2 19.7314 2.26863 20 2.6 20H21.4C21.7314 20 22 19.7314 22 19.4V11M2 11H22"
                                        stroke="#fff"
                                        stroke-width="1.1"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                      ></path>
                                    </svg>
                                  );
                              }
                            })()}

                            <p className="ml-2 text-white">{displayName} </p>

                          </button>
                        </ContextMenuTrigger>
                        {/* ContextMenuContent and other items */}
                      </ContextMenu>
                    </div>
                  )}
                </div>
              );
            })}


          </div>

        </div>
      </>
    );
  };

  /**<p className='text-[#868686]'> {(() => {
                              switch (label) {
                                case 'Unread':
                                case 'Inbox':
                                  return <p>{unreadItemCount}</p>;
                                case 'Junk Email':
                                  return <p>{unreadJunkCount}</p>;
                                case 'Drafts':
                                  return <p>(0)</p>;
                                case 'Archive':
                                  return <p>(1)</p>;
                                case 'Deleted Items':
                                  return <p>(3)</p>;
                                default:
                                  return null
                              }
                            })()}</p> */
  /**        {folders.displayName === folderBeingRenamed ? (
              <div className='grid grid-cols-1 text-white'>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-1 items-center gap-4">
                    <Label htmlFor="name" className="text-center">
                      Rename Folder
                    </Label>
                    <Input
                      id="labelName"
                      value={renameLabel}
                      className="mx-2 w-auto bg-slate12"
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
                      //  RenameLabel(id)
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
             */
  const EmailList = () => {
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";
    return (
      <div className=" ">
        {emails?.length === 0 ? (
          <div className='m-auto flex' >
            <p className='mr-3 text-white'>No emails available.</p>
            <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000" stroke-width="1.1"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 1.25C6.06294 1.25 1.25 6.06294 1.25 12C1.25 17.9371 6.06294 22.75 12 22.75C17.9371 22.75 22.75 17.9371 22.75 12C22.75 6.06294 17.9371 1.25 12 1.25ZM7.53044 11.9697C7.23755 11.6768 6.76268 11.6768 6.46978 11.9697C6.17689 12.2626 6.17689 12.7374 6.46978 13.0303L9.46978 16.0303C9.76268 16.3232 10.2376 16.3232 10.5304 16.0303L17.5304 9.03033C17.8233 8.73744 17.8233 8.26256 17.5304 7.96967C17.2375 7.67678 16.7627 7.67678 16.4698 7.96967L10.0001 14.4393L7.53044 11.9697Z" fill="#000000"></path></svg>
          </div>

        ) : (
          <div className="">
            {Array.isArray(emails) && emails.map((message: any, index: number) => (
              <div key={index} className="m-2 mx-auto w-[95%] cursor-pointer rounded-md border border-[#ffffff4d] hover:border-[#02a9ff]  hover:text-[#02a9ff] active:border-[#02a9ff]"
                onClick={() => {
                  handleEmailClick(message)
                  //  handleLineClick(index);
                }}>
                <div>
                  <div className="m-2 flex items-center justify-between">
                    <p className="text-lg font-bold text-[#fff]">
                      {message.from?.emailAddress?.name}
                    </p>
                    <p className="text-sm text-[#ffffff7c] ">
                      {new Date(message.receivedDateTime).toLocaleString()}
                    </p>
                  </div>

                  <p className="my-2 ml-2 text-sm text-[#ffffff7e]">
                    {message.subject ? message.subject.split(' ').slice(0, 12).join(' ') + '...' : ''}
                  </p>
                  <div className="flex justify-between">

                    <div className="ml-auto mr-2 flex space-x-1">
                      <Button
                        variant='ghost'
                        onClick={() => {
                          setSelectedEmail(message);
                          setTimeout(() => {
                            handleReply(selectedEmail)
                          }, 5);
                        }}
                        className={`cursor-pointer rounded  p-2 text-center text-xs font-bold uppercase text-[#fff] shadow outline-none transition-all duration-150 ease-linear hover:bg-transparent hover:text-[#02a9ff] hover:shadow-md focus:outline-none `}>
                        <FaReply className="text-2xl hover:text-[#02a9ff]" />
                      </Button>
                      <Button
                        variant='ghost'
                        onClick={() => {
                          setSelectedEmail(message);
                          setTimeout(() => {
                            handleReplyAll(selectedEmail)
                          }, 5);
                        }}
                        className={`cursor-pointer rounded  p-2 text-center text-xs font-bold uppercase text-[#fff] shadow outline-none transition-all duration-150 ease-linear hover:bg-transparent hover:text-[#02a9ff] hover:shadow-md focus:outline-none `}>
                        <FaReplyAll className="text-2xl hover:text-[#02a9ff]" />
                      </Button>
                      <Button
                        variant='ghost'
                        onClick={() => {
                          setSelectedEmail(message);
                          setTimeout(() => {
                            handleForward(selectedEmail)
                          }, 5);
                        }}
                        className={`cursor-pointer rounded  p-2 text-center text-xs font-bold uppercase text-[#fff] shadow outline-none transition-all duration-150 ease-linear hover:bg-transparent hover:text-[#02a9ff] hover:shadow-md focus:outline-none `}>
                        <FaForward className="text-2xl hover:text-[#02a9ff]" />
                      </Button>
                      <Button
                        variant='ghost'
                        onClick={() => {
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
                        className={`cursor-pointer rounded  p-2 text-center text-xs font-bold uppercase text-[#fff] shadow outline-none transition-all duration-150 ease-linear hover:bg-transparent hover:text-[#02a9ff] hover:shadow-md focus:outline-none `}>
                        <FaTrash className="text-2xl hover:text-[#02a9ff]" />
                      </Button>
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

        <Form method='post'>
          <div className="m-2 mx-auto w-[95%] cursor-pointer rounded-md border border-[#ffffff4d] hover:border-[#02a9ff]  hover:text-[#02a9ff] active:border-[#02a9ff]"
            onClick={() => {
              HandleGewtLabel(label)
            }}>
            <p className='text-center mx-auto   text-white my-3' >
              More

            </p>
          </div>
        </Form>
      </div>
    );
  };
  /** <Tabs defaultValue="Unread" className="m-2 w-[95%]">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger onClick={() => {
                  //HandleGewtLabel('UNREAD')
                  setLabel('Unread')
                  HandleGewtLabel('inbox');
                }} value="Unread">
                  Unread ({unreadItemCount})
                </TabsTrigger>
                <TabsTrigger
                  onClick={() => {
                    HandleGewtLabel('drafts');

                  }}
                  value="Draft">
                  Draft {draftCount}
                </TabsTrigger>
                <TabsTrigger
                  onClick={() => {
                    HandleGewtLabel('sent');
                    setLabel('Sent')
                  }}
                  value="Sent">
                  Sent
                </TabsTrigger>
                <TabsTrigger
                  onClick={() => {
                    HandleGewtLabel('junk');

                    setLabel('Spam')
                  }}
                  value="Chat">
                  Spam {unreadJunkCount}
                </TabsTrigger>
                <TabsTrigger
                  onClick={() => {
                    HandleGewtLabel('trash');

                    setLabel('Trash')
                  }}
                  value="Trash">
                  Trash {trashCounts}
                </TabsTrigger>
              </TabsList>
            </Tabs> */
  return (
    <>
      <div className="!border-1 !mx-auto mt-[60px] flex !h-[90vh] !w-[95%] !border !border-[#3b3b3b] !bg-[#121212]">
        <div className="sidebar w-[10%] border-r !border-[#3b3b3b]">
          <div className="border-b !border-[#3b3b3b]">
            <LabelList />
          </div>
        </div>
        <div className="emailList !w-[35%] !border-r !border-[#3b3b3b]">
          <div className="  border-b border-[#3b3b3b]">
            <Button
              variant='ghost'
              className='m-2  cursor-pointer justify-center rounded !border !border-transparent p-3 text-center text-xs font-bold uppercase text-[#fff] shadow outline-none transition-all duration-150 ease-linear hover:bg-transparent hover:text-[#02a9ff] hover:shadow-md focus:outline-none'>
              <p className='my-3 ml-3 text-white'>
                {label}
              </p>
              <p className='my-3 ml-3 text-[#868686]'>
                {(() => {
                  switch (label) {
                    case 'Unread':
                    case 'Inbox':
                      return <p>{unreadItemCount}</p>;
                    case 'Junk Email':
                      return <p>{unreadJunkCount}</p>;
                    case 'Drafts':
                      return <p>(0)</p>;
                    case 'Archive':
                      return <p>(1)</p>;
                    case 'Deleted Items':
                      return <p>(3)</p>;
                    default:
                      return null
                  }
                })()}
              </p>
            </Button>
          </div>
          <div className="h-[94%] overflow-y-scroll ">
            <div>
              <Input name="search" placeholder="Search" className='m-2 mx-auto w-[95%] border border-[#ffffff4d] bg-[#121212] text-[#fff] focus:border-[#02a9ff]' />
            </div>
            <EmailList />
          </div>
        </div>
        {openReply === true && (
          <div className="email flex   h-full  w-3/5 flex-col overflow-y-scroll">
            <div className="flex justify-between !border-b !border-[#3b3b3b]">
              <div className="!my-2 !ml-2 !flex">
                <Button
                  variant='ghost'
                  onClick={() => {
                    //   setReply(false)
                    //  setOpenReply(false)
                    HandleGewtLabel(label)
                    GetNextEmail(emails)
                  }}
                  className={`  cursor-pointer rounded  p-3 text-center text-xs font-bold uppercase text-[#fff] shadow outline-none transition-all duration-150 ease-linear hover:bg-transparent hover:text-[#02a9ff] hover:shadow-md focus:outline-none `}>
                  <ImCross className="text-2xl hover:text-[#02a9ff]" />
                </Button>

                <Button
                  variant='ghost'
                  onClick={() => {
                    handleDeleteClick(label, selectedEmail?.id)
                    HandleGewtLabel(label)
                    GetNextEmail(emails)
                    toast.success(`Email deleted!`)

                  }}
                  className={`cursor-pointer text-center text-[#fff] outline-none transition-all duration-150 ease-linear hover:bg-transparent hover:text-[#02a9ff] focus:outline-none `}>
                  <FaTrash className="text-2xl hover:text-[#02a9ff]" />
                </Button>
                {label !== 'Trash' && (
                  <Button
                    onClick={() => {
                      handlesetToUnread(selectedEmail)
                      GetNextEmail(emails)

                    }}
                    variant='outline' className='border-transparent text-white hover:bg-transparent hover:text-[#02a9ff]'>
                    <MdMarkunreadMailbox className="text-2xl hover:text-[#02a9ff]" />
                  </Button>
                )}
                {label === 'Trash' && (
                  <Button
                    variant='ghost'
                    onClick={() => {
                      handleDeleteClick(label, selectedEmail.id)
                      GetNextEmail(emails)

                    }}
                    className={`cursor-pointer text-center text-[#fff] outline-none transition-all duration-150 ease-linear hover:bg-transparent hover:text-[#02a9ff] focus:outline-none `}>
                    Send To Inbox
                  </Button>
                )}
              </div>
              <div className="!my-2 !flex">
                <Button
                  variant='ghost'
                  onClick={() => {
                    setTimeout(() => {
                      handleReply(selectedEmail)
                    }, 5);
                  }}
                  className={`cursor-pointer rounded  p-3 text-center text-xs font-bold uppercase text-[#fff] shadow outline-none transition-all duration-150 ease-linear hover:bg-transparent hover:text-[#02a9ff] hover:shadow-md focus:outline-none `}>
                  <FaReply className="text-2xl hover:text-[#02a9ff]" />
                </Button>
                <Button
                  variant='ghost'
                  onClick={() => {
                    setTimeout(() => {
                      handleReplyAll(selectedEmail)
                    }, 5);
                  }}
                  className={`cursor-pointer rounded  p-3 text-center text-xs font-bold uppercase text-[#fff] shadow outline-none transition-all duration-150 ease-linear hover:bg-transparent hover:text-[#02a9ff] hover:shadow-md focus:outline-none `}>
                  <FaReplyAll className="text-2xl hover:text-[#02a9ff]" />
                </Button>
                <Button
                  variant='ghost'
                  onClick={() => {
                    setTimeout(() => {
                      handleForward(selectedEmail)
                    }, 5);
                  }}
                  className={`cursor-pointer rounded  p-3 text-center text-xs font-bold uppercase text-[#fff] shadow outline-none transition-all duration-150 ease-linear hover:bg-transparent hover:text-[#02a9ff] hover:shadow-md focus:outline-none `}>
                  <FaForward className="text-2xl hover:text-[#02a9ff]" />
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild className='m-auto mr-4 cursor-pointer'>
                    <BsThreeDotsVertical className="text-2xl text-white hover:text-[#02a9ff]" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-[#121212]">
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
                          handleForward(selectedEmail)
                        }}
                      >
                        Forward
                      </DropdownMenuItem>
                      <DropdownMenuItem className='cursor-pointer hover:text-[#02a9ff]'
                        onClick={() => {
                          handleDeleteClick(label, selectedEmail?.id)
                          HandleGewtLabel(label)
                          GetNextEmail(emails)
                          toast.success(`Email deleted!`)
                        }}  >
                        Delete
                      </DropdownMenuItem>
                      <DropdownMenuItem className='cursor-pointer hover:text-[#02a9ff]'
                        onClick={() => {
                          messageUnRead(app.authProvider!, selectedEmail.id)
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
                            {folders.map((item, index) => {
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
                    {selectedEmail?.sender.emailAddress.name}
                  </p>
                  <p className="text-bold text-sm text-[#fff]">
                    {new Date(selectedEmail?.receivedDateTime).toLocaleString()}
                  </p>
                </div>
                <p className="text-bold ml-2 text-sm text-[#fff]">
                  {selectedEmail?.sender.emailAddress.address}
                </p>
                <div className="m-2 flex ">
                  {cc && cc.length > 0 && (<p className="mr-2 text-[#fff]">cc</p>)}
                  {bcc && bcc.length > 0 && (<p className="text-[#fff]">bcc</p>)}
                </div>
              </div>
            )}
            {reply && (
              <div className=" justify-center border-b border-[#3b3b3b]">
                <Input defaultValue={to} name='to' className='m-2 mx-auto w-[98%] bg-slate12 text-white' />
                <Input defaultValue={subject} name='subject' className='m-2 mx-auto w-[98%] bg-slate12 text-white' />
                <div className='mx-auto mt-2 flex w-[98%]' >
                  {cc & cc.length > 1 && (
                    <Input defaultValue={cc} name='cc' placeholder='cc' className='mx-auto mb-2 mr-1 bg-slate12  text-white' />
                  )}
                  {bcc & bcc.length > 1 && (
                    <Input defaultValue={bcc} name='bcc' placeholder='bcc' className='mx-auto ml-1 bg-slate12 text-right  text-white' />
                  )}
                </div>
              </div>
            )}
            {selectedEmail?.body && (
              <div className="!grow  !border-t border-[#3b3b3b] bg-white">
                <p className="  !text-sm  ">
                  <div className="parent-container">
                    <MyIFrameComponent />
                  </div>
                </p>
              </div>
            )}
            {reply && (
              <div className="mb-2 items-end justify-end rounded-md border-l border-t border-[#3b3b3b]">

                <EditorTiptapHook content={null} user={user} />

                <input type='hidden' defaultValue={text} name='body' />

                <div className="mx-2 flex justify-between">
                  <Button onClick={() => {
                    toast.success(`Email saved!`)
                    SaveDraft()
                  }}
                    className={` ml-2 cursor-pointer rounded border border-[#fff] p-3 text-center text-xs font-bold uppercase text-[#fff] shadow outline-none transition-all duration-150 ease-linear hover:bg-transparent bg-transparent hover:text-[#02a9ff] hover:shadow-md focus:outline-none `}>
                    Save Draft
                  </Button>
                  <Button
                    onClick={() => {
                      toast.success(`Email sent!`)
                      setTo(to)
                      setSubject(subject)
                      setTimeout(() => {
                        SendEmail(user, to, subject, text)
                        setReply(false)
                      }, 5);
                    }}

                    className={` mr-2 cursor-pointer rounded border border-[#fff] p-3 text-center text-xs font-bold uppercase text-[#fff] shadow outline-none transition-all duration-150 ease-linear hover:bg-transparent bg-transparent hover:text-[#02a9ff] hover:shadow-md focus:outline-none `}
                  >
                    Send
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
        {composeEmail === true && (
          <div className="email flex h-full w-3/5  flex-col">
            <div className="flex justify-between border-b border-[#3b3b3b]">

              <div className="ml-auto my-2 flex">

                <Button
                  onClick={() => {
                    setComposeEmail(false)
                  }}
                  className={` ml-2 cursor-pointer rounded  p-3 text-center text-xs font-bold uppercase text-[#fff]  bg-transparent shadow outline-none transition-all duration-150 ease-linear hover:bg-transparent hover:text-[#02a9ff] hover:shadow-md focus:outline-none `}>

                  <Cross2Icon />
                </Button>
              </div>
            </div>
            <div className=" justify-center border-b border-[#3b3b3b]">
              <Input placeholder='To' name='to' className='m-2 mx-auto w-[98%] bg-slate12 text-white' />
              <Input placeholder='Subject' name='subject' className='m-2 mx-auto w-[98%] bg-slate12 text-white' />
              <div className='mx-auto mt-2 flex w-[98%]' >
                <Input name='cc' placeholder='cc' className='mx-auto mb-2 mr-1 bg-slate12  text-white' />
                <Input name='bcc' placeholder='bcc' className='mx-auto ml-1 bg-slate12 text-right  text-white' />
              </div>
            </div>

            <div className="border-1 mb-2 grow items-end justify-end overflow-auto rounded-md border-t border-[#3b3b3b]">

              <EditorTiptapHook content={null} user={user} />

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
                      composeEmail(app.authProvider!, subject, body, toAddresses, toNames)
                      setReply(false)
                    }, 5);
                  }}
                  className={` mr-2 cursor-pointer rounded border border-[#fff] p-3 text-center text-xs font-bold uppercase text-[#fff] shadow outline-none transition-all duration-150 ease-linear hover:bg-transparent bg-transparent hover:text-[#02a9ff] hover:shadow-md focus:outline-none `}
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



/**  // --------------------------------------------------------------------------
  const { instance, accounts } = useMsal();
  const [graphData, setGraphData] = useState(null);

  const graphConfig = {
    graphMeEndpoint: "https://graph.microsoft.com/v1.0/me",
  };

  async function callMsGraph(accessToken) {
    const headers = new Headers();
    const bearer = `Bearer ${accessToken}`;
    headers.append("Authorization", bearer);
    const options = {
      method: "GET",
      headers: headers
    };
    return fetch(graphConfig.graphMeEndpoint, options)
      .then(response => response.json())
      .catch(error => console.log(error));
  }
  function RequestProfileData() {
    // Silently acquires an access token which is then attached to a request for MS Graph data
    instance
      .acquireTokenSilent({
        ...loginRequest,
        account: accounts[0],
      })
      .then((response) => {
        callMsGraph(response.accessToken).then((response) => setGraphData(response));
      });
  }
  if (!accounts[0]) {
    RequestProfileData()
  }
  // - */
