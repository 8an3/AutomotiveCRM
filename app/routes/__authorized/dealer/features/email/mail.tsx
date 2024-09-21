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
import { cn } from "~/components/ui/utils"

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
import { Button } from "../../../../../components/ui"
import { FaForward, FaReply, FaReplyAll, FaTrash } from "react-icons/fa"
import { IoIosMail } from "react-icons/io"
import useSWR, { SWRConfig, mutate, useSWRConfig } from 'swr';
import ProvideAppContext, { useAppContext, } from "~/components/microsoft/AppContext";

export function Mail({ activeAccount, instance, mails, defaultLayout = [20, 32, 48], defaultCollapsed = false, }) {
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
    <p>test</p>
  )
}
//mails.find((item) => item.id === mail.selected) || null
/**
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
 */
