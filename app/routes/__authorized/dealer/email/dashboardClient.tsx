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
} from "~/components";
import ProvideAppContext, {
  useAppContext,
} from "~/components/microsoft/AppContext";
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
  EditorTiptapHookComposeDashboardEmailClient,
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
import { SaveDraft, SendEmail } from "./server";



export default function DashboardClient() {
  const [user, setUser] = useState()
  const [customer, setCust] = useState()
  const [to, setTo] = useState()
  const [subject, setSubject] = useState()
  const [text, setText] = React.useState("");
  const app = useAppContext();

  useEffect(() => {
    const userIs = window.localStorage.getItem("user");
    const parseUser = userIs ? JSON.parse(userIs) : [];
    setUser(parseUser)
    const getCust = window.localStorage.getItem("customer");
    const parseCust = getCust ? JSON.parse(getCust) : [];
    setCust(parseCust)
    setTo(parseCust?.email)
  }, []);

  console.log(to, customer, user, ' inside dashboard client')
  return (
    <>
      <div className="email flex   flex-col  ">
        <div className="flex justify-center  ">
          <Input
            type='hidden'
            defaultValue={to}
            name="to"
            className="m-2 mx-auto mr-2 w-[98%] bg-background text-foreground   border-border"
          />
          <Input
            name="subject"
            placeholder="Subject"
            className="m-2 mx-auto ml-2 w-[98%] bg-background border-border text-foreground"
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>
        <div className=" grid grid-cols-1">
          <div className="w-full mx-auto mb-2 mt-auto    ">
            <EditorTiptapHookComposeDashboardEmailClient
              content={null}
              subject={subject}
              to={to}
              app={app}
              user={user}
              customer={customer}
            // cc={cc}
            //  bcc={bcc}
            />
            <input type="hidden" defaultValue={text} name="body" />
          </div>
        </div>
      </div>

    </>
  )
}
