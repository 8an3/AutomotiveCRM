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
} from "~/components/microsoft/GraphService";
import {
  EditorTiptapHook,
  Editor,
  EditorTiptapHookCompose,
} from "~/components/libs/basicEditor";
import { useMsal } from "@azure/msal-react";
import { Cross2Icon } from "@radix-ui/react-icons";
import { toast } from "sonner";
import { Form, useNavigation } from "@remix-run/react";
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

import secondary from "~/styles/secondary.css";
import { type LinksFunction } from "@remix-run/node";
import useSWR, { SWRConfig, mutate, useSWRConfig } from 'swr';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "~/components/ui/resizable";
import { Nav } from "./nav";
import { cn } from "~/utils";
import { AlertCircle, Archive, ArchiveX, File, Inbox, MessagesSquare, Search, Send, Trash2, Users2 } from "lucide-react";
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
  //const activeAccount = instance.getActiveAccount();
  const [emails, setEmails] = useState();
  const [mail, setMail] = useState();
  const [graphData, setGraphData] = useState(null);

  useEffect(() => {
    // fetch emails
    const fetchEmails = async () => {
      try {
        const response = await testInbox(app.authProvider!);
        setEmails(response.value);
        console.log('emails succesfull fetched,', response.value)

      } catch (error) {
        console.error("Error fetching emails:", error);
        const getToken = await instance.acquireTokenSilent({
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
        console.log(getToken, 'getToken')
        try {
          const response = await testInbox(app.authProvider!);
          setEmails(response.value);
          console.log('2nd try to get meails succesfull,', response.value)
        } catch (error) {
          console.error("Error fetching emails 222:", error);
        }
      }
    };
    fetchEmails()
  }, []);


  /**  useEffect(() => {
      if (!emails && inProgress === InteractionStatus.None) {
        callMsGraph().then(response => setGraphData(response)).catch((e) => {
          if (e instanceof InteractionRequiredAuthError) {
            instance.acquireTokenRedirect({
              ...loginRequest,
              account: instance.getActiveAccount() as AccountInfo
            });
          }
        });
      }
    }, [inProgress, emails, instance]);
   */

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
  const navCollapsedSize = 4
  const layout = 30//layoutCookie2
  const collapsed = false// collapsedCookie2

  const defaultLayout = [20, 32, 48]
  const defaultCollapsed = collapsed

  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed)

  console.log('clientclienttwo before return', emails)
  return (
    <>
      <div className=' mt-10 m-5 border border-border border-md' >
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
                  {emails && Array.isArray(emails) && !emails || emails.length === 0 ?
                    <div className="flex items-center space-x-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                      </div>
                    </div>
                    :
                    <MailList emails={emails} setMail={setMail} mail={mail} />
                  }
                </TabsContent>
                <TabsContent value="unread" className="m-0">
                  {emails && Array.isArray(emails) && !emails || emails.length === 0 ? <p className='text-center mt-5 text-muted-foreground'>No emails to currently display.</p> :
                    <MailList emails={emails.filter((item) => item.isRead === false)} setMail={setMail} mail={mail} />}
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
