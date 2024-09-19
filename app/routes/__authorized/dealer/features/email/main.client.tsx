import { Mail } from '~/components/email/mail'
import { collapsedCookie, layoutCookie } from '~/components/email/cookies.server';
import { json, type LoaderFunction, type ActionFunctionArgs, redirect, LoaderArgs } from '@remix-run/node';
import type { ClientLoaderFunctionArgs } from "@remix-run/react";

import { Form, useLoaderData, useSubmit, Link, useFetcher, useNavigation } from '@remix-run/react'
import { Button, Tabs, TabsList, TabsTrigger, TabsContent, Card, CardHeader, CardTitle, CardContent, CardDescription, Separator, CardFooter, Label, Input, buttonVariants, } from '~/components';
import { ButtonLoading } from "~/components/ui/button-loading";
import { prisma } from "~/libs";
import { toast } from "sonner"
import financeFormSchema from '~/overviewUtils/financeFormSchema';
import useSWR, { SWRConfig, mutate, useSWRConfig } from 'swr';
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
import { useMsal } from "@azure/msal-react";
import {
  EditorTiptapHook,
  Editor,
  EditorTiptapHookCompose,
} from "~/components/libs/basicEditor";
import {
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
import React, { useCallback, useEffect, useRef, useState } from "react";


async function fetchEmailCookies(request) {
  try {
    // Use the full URL for server-side fetching
    const url = new URL('/dealer/api/emailCookies', request.url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Pass the original request headers (like cookies or auth headers) if needed
        cookie: request.headers.get('cookie') || '',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    console.log(data);

    return data;
  } catch (error) {
    console.error('Error fetching email cookies:', error);
    return null; // Return null or handle this gracefully in your loader
  }
}


export const clientAction = async ({ request, params, serverAction, }: ClientActionFunctionArgs) => {
  //  invalidateClientSideCache();

  return null;
};
export async function loader({ request, }: LoaderFunction) {
  const data = await fetchEmailCookies({ request });

  return json(data);
}


export const clientLoader = async ({ request, params, serverLoader, }: ClientLoaderFunctionArgs) => {
  const data = await fetchEmailCookies({ request });
  return json(data);
};


export default function MainClient() {
  const { serverData } = useLoaderData()
  const { layoutCookie, collapsedCookie } = serverData
  const layout = layoutCookie
  const collapsed = collapsedCookie

  const defaultLayout = layout ? JSON.parse(layout.value) : undefined
  const defaultCollapsed = collapsed ? JSON.parse(collapsed.value) : undefined

  const app = useAppContext();

  const [emails, setEmails] = useState();

  const dataFetcher = testInbox(app.authProvider!); //(url) => fetch(url).then(res => res.json());
  const { data, error, isLoading, isValidating } = useSWR(dataFetcher, { refreshInterval: 15000 })
  useEffect(() => {
    if (data) { setEmails(data.value) }
  }, [data]);

  return (
    <div className='border border-border rounded-md'>
      <Mail
        // accounts={accounts}
        app={app}
        setEmails={setEmails}
        mails={emails}
        defaultLayout={defaultLayout}
        defaultCollapsed={defaultCollapsed}
        navCollapsedSize={4}
      />
    </div>
  )
}
