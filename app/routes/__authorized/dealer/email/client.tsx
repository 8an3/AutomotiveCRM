import { useCallback, useEffect, useRef, useState } from "react";
import { Tabs, TabsList, TabsTrigger, Input, Button, ContextMenu, ContextMenuCheckboxItem, ContextMenuContent, ContextMenuItem, ContextMenuLabel, ContextMenuRadioGroup, ContextMenuRadioItem, ContextMenuSeparator, ContextMenuShortcut, ContextMenuSub, ContextMenuSubContent, ContextMenuSubTrigger, ContextMenuTrigger, Dialog as Dialog1, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger, Accordion, AccordionContenSendEmailt, AccordionItem, AccordionTrigger, AccordionContent, Label } from "~/components"
import { useAppContext } from "~/components/microsoft/AppContext";
import { getAllFolders, deleteMessage, getDrafts, getDraftsList, getInbox, getInboxList, getJunk, getList, getSent, getTrash, messageRead, messageUnRead, getUser } from "~/components/microsoft/GraphService";
import { prisma } from "~/libs";
import { EditorTiptapHook, Editor, onUpdate } from "~/components/libs/editor-tiptap";
import { MsalProvider, AuthenticatedTemplate, useMsal, UnauthenticatedTemplate } from '@azure/msal-react';
import { MessageAlert, SendMail, Mail, Message, User, BinHalf, Calendar as CalendarIcon, Telegram, Trash, MessageText, } from "iconoir-react";
import { Cross2Icon } from '@radix-ui/react-icons';
import { toast } from "sonner"
import { Form, useNavigation } from "@remix-run/react";
import { Archive, MailWarning, DollarSign, Clock, MailCheck, Twitter, RefreshCw, FormInput, Inbox, Reply, ReplyAll, Forward, MoreVertical, Star, Folder, MailQuestion, ShieldAlert, MessageCircle, Loader2, } from "lucide-react";
import { json } from "@remix-run/node";
import { ButtonLoading } from "~/components/ui/button-loading";


export default function Client() {
  const app = useAppContext();
  const { instance } = useMsal();
  const activeAccount = instance.getActiveAccount();
  const email = String(activeAccount?.username)
  const [folders, setFolders] = useState([])
  const user = getUser(app.authProvider!)
  const [label, setLabel] = useState('Unread')
  const [unreadItemCount, setUnreadItemCount] = useState(0);
  const [draftCount, setDraftCount] = useState(0);
  const [unreadJunkCount, setUnreadJunkCount] = useState(0);
  const [emails, setEmails] = useState();
  const [subject, setSubject] = useState('')
  const [labelName, setLabelName] = useState('');
  const [selectedEmail, setSelectedEmail] = useState();
  const [reply, setReply] = useState(false)
  const [to, setTo] = useState('');
  const [cc, setCC] = useState('');
  const [bcc, setBcc] = useState('');
  const [inbox, setInbox] = useState()
  const [openReply, setOpenReply] = useState(false)
  const [loading, setLoading] = useState(false);
  const [composeEmail, setComposeEmail] = useState(false);
  const [renameLabel, setRenameLabel] = useState('');
  const [RenameFolderInput, setRenameFolderInput] = useState(false);
  const [folderBeingRenamed, setFolderBeingRenamed] = useState('test');
  const [which, setWhich] = useState('');
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      const drafts = await getDrafts(app.authProvider!);
      const totalDrafts = drafts
      setDraftCount(totalDrafts)
      const messages = await getInbox(app.authProvider!);
      setInbox(messages)
      const unreadCount = messages
      setUnreadItemCount(unreadCount);
      const junk = await getJunk(app.authProvider!);
      const unreadJunk = junk
      setUnreadJunkCount(unreadJunk);
      const getTemplates = await prisma.emailTemplates.findMany({ where: { userEmail: email, }, });
      setTemplates(getTemplates)
      const folderList = getAllFolders(app.authProvider!);
      setFolders(folderList)
    };
    fetchUnreadCount();
  }, [app.authProvider, email]);

  let content;
  let handleUpdate;
  const editor = Editor(content, handleUpdate)
  const [text, setText] = useState('')
  const someFunction = () => {
    onUpdate({ editor, setText, handleUpdate });
  };

  const handleInputChange = useCallback((e) => {
    setRenameLabel(e.target.value);
  }, []);
  // templates
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const handleChange = (event) => {
    const selectedTemplate = templates.find(template => template.title === event.target.value);
    setSelectedTemplate(selectedTemplate);
  };
  useEffect(() => {
    if (selectedTemplate) {
      setText(selectedTemplate.body);
      setSubject(selectedTemplate.subject);
    }
  }, [selectedTemplate]);

  const handleDeleteClick = (folderName, id) => {
    //  console.log(email)
    deleteMessage(app.authProvider!, id)
    toast.success(`Email moved to trash.`)
    getList(app.authProvider!, folderName);
    //  setEmails(emails);
    setTimeout(() => {
      setSelectedEmail(emails[1]);
      setReply(false)
    }, 5);
  };

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

  useEffect(() => {
    if (selectedEmail) {
      const serializedEmail = JSON.stringify(selectedEmail);
      window.localStorage.setItem("selectedEmail", serializedEmail);
    }
  }, [selectedEmail]);

  async function HandleGewtLabel(label) {
    const labelData = await getList(app.authProvider!, label)
    return labelData
  }
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

  const handleEmailClick = async (email) => {
    if (email && email.id) {
      setSelectedEmail(email)
      console.log('email set to read', email.id)
      setReply(false)
      setOpenReply(true)
      const messageId = email.id
      console.log(messageId, 'messageid')
      //  const setUNREAD = await SetToRead(email)

      return json({ ok: true })
    } else {
      console.error('Email object or its id is undefined:', email,);
    }
  };

  const LabelList = () => {

    return (
      <>
        <div className="!border-b !border-[#3b3b3b]">
          <Button
            onClick={() => {

              setComposeEmail(true)
              setReply(false)
              setSelectedEmail(null)
            }}
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

                {folders.map((item, index) => {
                  // Remove 'CATEGORY_' from the label name
                  const displayLabelName = folders.displayName
                  //  console.log("Item:", item) // Add this line
                  return (
                    <>

                      <div key={index} className="mx-2 mt-2 flex items-center justify-between">
                        {RenameFolderInput === false ? (
                          <div className="flex">
                            <ContextMenu>
                              <ContextMenuTrigger>
                                <button
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
                                          // renameLabel(folderList.id)
                                          toast.success(`Folder updated.`)
                                        }}
                                      >Save changes</Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog1>

                                <ContextMenuItem className='cursor-pointer' inset
                                  onClick={() => {
                                    //  DeleteLabel(email, label)
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
                                          //   CreateLabel(id)
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
          {folders.displayName === folderBeingRenamed ? (
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
        </div>
      </>
    );
  };

  const EmailList = () => {
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";
    return (
      <div className="">

        {Array.isArray(emails) && emails.map((message: any, index: number) => (
          <div key={index} className="m-2 mx-auto w-[95%] cursor-pointer rounded-md border border-[#ffffff4d] hover:border-[#02a9ff]  hover:text-[#02a9ff] active:border-[#02a9ff]" onClick={() => handleEmailClick(email)}>
            <div>
              <div className="m-2 flex items-center justify-between">
                <p className="text-lg font-bold text-[#fff]">
                  {message.from?.emailAddress?.name}
                </p>
                <p className="text-sm text-[#ffffff7c] ">
                  {new Date(message.receivedDateTime).toLocaleString()}
                </p>
              </div>
              <p className="my-2 ml-2 text-sm text-[#ffffffdd]">
                {message.subject}
              </p>
              <p className="my-2 ml-2 text-sm text-[#ffffff7e]">
                {message.subject ? message.subject.split(' ').slice(0, 12).join(' ') + '...' : ''}
              </p>
              <div className="flex justify-between">

                <div className="flex ml-2 space-x-1">
                  <Button
                    onClick={() => {
                      setSelectedEmail(message);
                      setTimeout(() => {
                        handleReply(selectedEmail)
                      }, 5);
                      messageRead(app.authProvider!, message.id)
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
                      messageRead(app.authProvider!, message.id)
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
                      messageRead(app.authProvider!, message.id)
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
                  //HandleGewtLabel('UNREAD')
                  setLabel('Unread')
                }} value="Unread">Unread {unreadItemCount}</TabsTrigger>
                <TabsTrigger
                  onClick={() => {
                    getInboxList(app.authProvider!)
                    setLabel('Inbox')
                  }}
                  value="All Mail">
                  Inbox {inbox}
                </TabsTrigger>
                <TabsTrigger
                  onClick={() => {
                    getDraftsList(app.authProvider!)
                    setLabel('Draft')
                  }}
                  value="Draft">
                  Draft {draftCount}
                </TabsTrigger>
                <TabsTrigger
                  onClick={() => {
                    getSent(app.authProvider!)
                    setLabel('Sent')
                  }}
                  value="Sent">
                  Sent
                </TabsTrigger>
                <TabsTrigger
                  onClick={() => {
                    getJunk(app.authProvider!)
                    setLabel('Spam')
                  }}
                  value="Chat">
                  Spam {unreadJunkCount}
                </TabsTrigger>
                <TabsTrigger
                  onClick={() => {
                    getTrash(app.authProvider!)
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
            <EmailList />
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
                            {labelData.map((item, index) => {
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
                    tTo(to)
                    tSubject(subject)
                    setTimeout(() => {
                      replyMessage(user, to, subject, text, tokens)
                      setReply(false)
                    }, 5);
                  }}
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



