import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  Input,
  Button,
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
  Dialog as Dialog1,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  Label,
  Separator,
  TabsContent,
  Skeleton,
} from "~/components";
import ProvideAppContext, { useAppContext, } from "~/components/microsoft/AppContext";
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
  setFolder,
  listAttachment,
} from "~/components/microsoft/GraphService";
import {
  EditorTiptapHook,
  Editor,
  EditorTiptapHookCompose,
} from "~/components/libs/basicEditor";
import { useMsal } from "@azure/msal-react";
import { Cross2Icon } from "@radix-ui/react-icons";
import { toast } from "sonner";
import { Form, useFetcher, useNavigate, useNavigation } from "@remix-run/react";
import { Forward, User, Reply } from "iconoir-react";
import {
  FaReply,
  FaReplyAll,
  FaForward,
  FaTrash,
  FaArchive,
  FaHistory,
  FaStar,
  FaCommentDollar,
} from "react-icons/fa";
import {
  IoIosMailUnread,
  IoIosMail,
  IoMdAlert,
  IoIosArrowForward,
  IoIosArrowBack,
} from "react-icons/io";
import { IoSend } from "react-icons/io5";
import {
  MdSms,
  MdDrafts,
  MdForum,
  MdSecurityUpdateGood,
  MdOutlineSocialDistance,
  MdOutlineKeyboardDoubleArrowRight,
  MdOutlineKeyboardDoubleArrowLeft,
  MdMarkunreadMailbox,
} from "react-icons/md";
import { RiSpam3Fill, RiContractLeftRightLine } from "react-icons/ri";
import { ImCross } from "react-icons/im";
import { BsThreeDotsVertical, BsArrowsExpandVertical } from "react-icons/bs";
import { FaPencil } from "react-icons/fa6";
import {
  Client,
  type GraphRequestOptions,
  type PageCollection,
  PageIterator,
  type ClientOptions,
} from "@microsoft/microsoft-graph-client";
import { type AuthCodeMSALBrowserAuthenticationProvider } from "@microsoft/microsoft-graph-client/authProviders/authCodeMsalBrowser";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { GoArrowSwitch } from "react-icons/go";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import IndeterminateCheckbox, { fuzzyFilter, fuzzySort, getToken, invariant, Loading, checkForMobileDevice, TableMeta, Filter, DebouncedInput, defaultColumn } from '~/components/shared/shared'
import secondary from "~/styles/secondary.css";
import { type LinksFunction } from "@remix-run/node";
import useSWR, { SWRConfig, mutate, useSWRConfig } from 'swr';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "~/components/ui/resizable";
import { Nav } from "./nav";
import { cn } from "~/utils";
import { AlertCircle, Archive, ArchiveX, File, Inbox, MessagesSquare, Search, Send, Trash2, Users2, X } from "lucide-react";
import { MailList } from "./mail-list";
import { MailDisplay } from "./mail-display";
import { AccountInfo, InteractionRequiredAuthError, InteractionStatus } from "@azure/msal-browser";
import { callMsGraph } from "~/utils/microsoft/MsGraphApiCall";
import { loginRequest } from "~/components/microsoft/Config";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: secondary },
];

export default function NewCLient() {
  const app = useAppContext();
  const { instance, accounts, inProgress } = useMsal();
  let search = useFetcher();
  let ref = useRef();

  const [emails, setEmails] = useState();
  const [getCountOf, setGetCountOf] = useState('');
  const [mail, setMail] = useState();
  const [unread, setUnread] = useState();
  const [label, setLabel] = useState('Inbox');
  const [unreadItemCount, setUnreadItemCount] = useState(0);
  const [draftCount, setDraftCount] = useState(0);
  const [unreadJunkCount, setUnreadJunkCount] = useState(0);
  const [folders, setFolders] = useState([]);
  const [attachment, setAttachment] = useState()
  const navigate = useNavigate()

  /**  const dataFetcher = testInbox(app.authProvider!)
    const { data, error, isLoading, isValidating } = useSWR(dataFetcher, { refreshInterval: 15000 })

    useEffect(() => {
      if (data) {
        setEmails(data.value);
      }
    }, [data]); */

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
  const primaryLinks = [
    {
      title: "Inbox",
      label: unread,
      icon: Inbox,
      variant: "default",
    },
    {
      title: "Drafts",
      label: draftCount,
      icon: File,
      variant: "ghost",
    },
    {
      title: "Sent Items",
      label: "",
      icon: Send,
      variant: "ghost",
    },
    {
      title: "Junk Email",
      label: unreadJunkCount,
      icon: ArchiveX,
      variant: "ghost",
    },
    {
      title: "Deleted Items",
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
  const secondaryLinks2 = [
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
  const defaultIcon = MessagesSquare;
  const defaultVariant = "ghost";

  const primaryTitles = primaryLinks.map(link => link.title);

  const secondaryLinks = folders.value.filter(folder => !primaryTitles.includes(folder.displayName));

  const transformedSecondaryLinks = secondaryLinks.map(folder => ({
    title: folder.displayName,               // Use the displayName as the title
    label: folder.unreadItemCount || "",     // Use unreadItemCount or default to empty string
    icon: defaultIcon,                       // Provide a default icon (or set based on folder name)
    variant: defaultVariant                  // Provide a default variant
  }));

  console.log(transformedSecondaryLinks);

  useEffect(() => {
    // fetch emails
    const fetchEmails = async () => {
      try {
        const response = await testInbox(app.authProvider!);
        setEmails(response.value);
        console.log('emails succesfull fetched,', response.value)

      } catch (error) {
        console.error("Error fetching emails:", error);
        /** const getToken = await instance.acquireTokenSilent({
           scopes: [
             'User.Read',
             'Mail.ReadWrite',
             'Mail.send',
             'email',
             'openid',
             'profile',
             "Calendars.ReadWrite",
             "Notes.ReadWrite.All",
             "Calendars.ReadWrite.Shared",
             "Contacts.ReadWrite",
             "Contacts.ReadWrite.Shared",
             "Files.ReadWrite.All",
             "Files.ReadWrite.AppFolder",
             "Files.ReadWrite.Selected",
             "Mail.ReadWrite.Shared",
             "Mail.Send.Shared",
             "Mail.Send",
             "Mail.ReadWrite",
             "MailboxSettings.ReadWrite",
             "Notes.Create",
             "Notes.ReadWrite.All",
             "Schedule.ReadWrite.All",
             "Tasks.ReadWrite.Shared",
             "User.Read",
             "User.ReadWrite.All",
             "User.ReadWrite",
           ],
         });
         const jsontoken = JSON.stringify(getToken)
         window.localStorage.setItem("remix-stutter-66-3145", jsontoken); */
        //   console.log(getToken, 'getToken')
        try {
          const response = await testInbox(app.authProvider!);
          setEmails(response.value);
          //      console.log('2nd try to get meails succesfull,', response.value)
        } catch (error) {
          console.error("Error fetching emails 222:", error);
        }
      }
    };
    fetchEmails()
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
  }, []);

  useEffect(() => {
    async function SetNewEmails() {
      let labelList
      let folderId
      console.log(folders, 'folders',)

      const findFolderByDisplayName = (displayName) =>
        folders.value.find((folder) => folder.displayName.toLowerCase() === displayName.toLowerCase());


      switch (label) {
        case "Drafts":
          const draftsFolder = findFolderByDisplayName('Drafts');
          if (draftsFolder) {
            labelList = await getList(app.authProvider!, draftsFolder.id);
            setEmails(labelList.value);
            console.log('Drafts folder emails:', labelList);
          }
          break;

        case "Unread":
          labelList = await testInbox(app.authProvider!);
          setEmails(labelList.value);
          console.log('Unread emails:', labelList);
          break;

        default:
          const folderNameMap = {
            'deleted items': 'Deleted Items',
            'junk email': 'Junk Email',
            'sent items': 'Sent Items',
            'conversation history': 'Conversation History',
            'archive': 'Archive',
            'outbox': 'Outbox',
            'inbox': 'Inbox',
            'scheduled': 'Scheduled',
            'clutter': 'Clutter',
          };

          const matchedFolder = findFolderByDisplayName(folderNameMap[label.toLowerCase()]);

          if (matchedFolder) {
            folderId = matchedFolder.id;
            labelList = await getList(app.authProvider!, folderId);
            setEmails(labelList.value);
            console.log(`${label} folder emails:`, labelList);
          } else {
            console.log('No matching folder found for:', label);
          }
          break;
      }
    }

    SetNewEmails();
  }, [label]);

  useEffect(() => {
    async function GetAttachments() {
      const getAttach = await listAttachment(app.authProvider!, mail.id)
      setAttachment(getAttach.value)
    }
    if (mail && mail.hasAttachments && mail.hasAttachments === true) {
      GetAttachments()
    }
  }, [mail]);



  const navCollapsedSize = 4
  const layout = 30//layoutCookie2
  const collapsed = false// collapsedCookie2

  const defaultLayout = [20, 32, 48]
  const defaultCollapsed = collapsed

  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed)

  // console.log('clientclienttwo before return', emails)
  const emailsSafe = Array.isArray(emails) ? emails : [];
  const [filter, setFilter] = useState('');
  const [globalFilter, setGlobalFilter] = useState('');

  useEffect(() => {
    let s

    if (globalFilter) {
      s = globalFilter;
    }
    if (filter) {
      s = filter;
    }
    if (!filter) {
      setEmails(emails);
      return;
    }
    // let s = filter;

    s = s.toLowerCase();
    const result = emails.filter(
      (email) =>
        email.from?.emailAddress.name?.toLowerCase().includes(s) ||
        email.subject?.toLowerCase().includes(s) ||
        email.from?.emailAddress.address?.toLowerCase().includes(s)
    );

    setEmails(result);
  }, [filter, globalFilter]);

  const ReadMessage = (email) => {
    messageRead(app.authProvider!, email.id);
  }
  async function handlesetToUnread(email) {
    messageUnRead(app.authProvider!, email.id);
  }
  async function handlesetFolder(email, folder) {
    setFolder(app.authProvider!, email.id, folder);
  }
  async function GetNextEmail() {
    const emailMessage = emails[1]
    setMail(emailMessage);
  }

  const handleDeleteClick = async (id) => {
    const emailMessage = emails[1]
    setMail(emailMessage);
    await deleteMessage(app.authProvider!, id);
    toast.success(`Email moved to trash.`);
    setLabel(label)
  };
  return (
    <>

      <div className='mt-10 m-5 border border-border rounded-md'>
        <TooltipProvider delayDuration={0}>
          <ResizablePanelGroup
            direction="horizontal"
            onLayout={(sizes: number[]) => { }}
            className="h-full max-h-[800px] items-stretch"
          >
            <ResizablePanel
              defaultSize={defaultLayout[0]}
              collapsedSize={navCollapsedSize}
              collapsible={true}
              minSize={15}
              maxSize={20}
              onCollapse={() => setIsCollapsed(true)}
              onResize={() => setIsCollapsed(false)}
              className={cn(isCollapsed && "min-w-[50px] transition-all duration-300 ease-in-out")}
            >
              <Separator className='mt-[39px]' />
              <Nav
                isCollapsed={isCollapsed}
                links={primaryLinks}
                label={label}
                setGetCountOf={setGetCountOf}
                setLabel={setLabel} />
              <Separator />
              <Nav
                isCollapsed={isCollapsed}
                links={transformedSecondaryLinks}
                label={label}
                setLabel={setLabel} />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
              <Tabs defaultValue="unread">
                <div className="flex items-center px-4 py-2">
                  <h1 className="text-xl font-bold">{label}</h1>
                  <TabsList className="ml-auto">
                    <TabsTrigger value="all" className="text-zinc-600 dark:text-zinc-200">All mail</TabsTrigger>
                    <TabsTrigger value="unread" className="text-zinc-600 dark:text-zinc-200">Unread</TabsTrigger>
                  </TabsList>
                </div>
                <Separator />
                <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">

                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search"
                      className="pl-8"
                      onChange={(e) => {
                        setFilter(e.target.value)
                      }}
                    />
                    <Button
                      onClick={() => {
                        navigate(0)
                      }}
                      size="icon"
                      className='bg-background mr-2 absolute right-2.5 top-2.5 h-4 w-4 text-foreground '>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <TabsContent value="all" className="m-0">
                  {emailsSafe.length === 0 ? (
                    <div className="flex items-center space-x-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                      </div>
                    </div>
                  ) : (
                    <MailList
                      emails={emailsSafe}
                      ReadMessage={ReadMessage}
                      setMail={setMail}
                      mail={mail} />
                  )}
                </TabsContent>
                <TabsContent value="unread" className="m-0">
                  {emailsSafe.length === 0 ? (
                    <p className='text-center mt-5 text-muted-foreground'>No emails to currently display. If there are no e-mails listed you may need to re-log in to your microsoft account to update the login session.</p>
                  ) : (
                    <MailList
                      emails={emailsSafe.filter(item => !item.isRead)}
                      setMail={setMail}
                      ReadMessage={ReadMessage}
                      mail={mail} />
                  )}
                </TabsContent>
              </Tabs>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={defaultLayout[2]} minSize={30}>
              <MailDisplay
                mail={mail}
                app={app}
                handleDeleteClick={handleDeleteClick}
                handlesetToUnread={handlesetToUnread}
                setFolder={setFolder}
                attachment={attachment}
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        </TooltipProvider>
      </div>
    </>
  )
}
