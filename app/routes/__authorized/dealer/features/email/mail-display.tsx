import addDays from "date-fns/addDays"
import addHours from "date-fns/addHours"
import format from "date-fns/format"
import nextSaturday from "date-fns/nextSaturday"
import {
  Archive,
  ArchiveX,
  Clock,
  Download,
  Forward,
  MoreVertical,
  Paperclip,
  Reply,
  ReplyAll,
  Trash2,
} from "lucide-react"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "~/components/ui/resizable"
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "~/components/ui/dropdown-menu"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/components/ui/avatar"
import { Button } from "~/components/ui/button"
import { Calendar } from "~/components/ui/calendar"
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { Label } from "~/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover"
import { Separator } from "~/components/ui/separator"
import { Switch } from "~/components/ui/switch"
import { TextArea } from "~/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip"
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ScrollArea } from "~/components"
import { EmailClientTextEditor } from "~/routes/__auth/auth/textEditor"
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
  getAttachment,
} from "~/components/microsoft/GraphService";
//import { Mail } from "@/app/(app)/examples/mail/data"

interface MailDisplayProps {
  mail: Mail | null
  app: any
  handleDeleteClick: any
  handlesetToUnread: any
  setFolder: any
  attachment: any
  user: any
}

export function MailDisplay({ mail, app, handleDeleteClick, handlesetToUnread, setFolder, attachment, user }: MailDisplayProps) {

  const today = new Date()
  const getFirstLetter = (name) => {
    return name ? name.charAt(0).toUpperCase() : '';
  };
  const options2 = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center p-2">
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => {
                  setFolder(mail, 'archive')
                }}
                variant="ghost" size="icon" disabled={!mail}>
                <Archive className="h-4 w-4" />
                <span className="sr-only">Archive</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Archive</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => {
                  setFolder(mail, 'junkemail')
                }}
                variant="ghost" size="icon" disabled={!mail}>
                <ArchiveX className="h-4 w-4" />
                <span className="sr-only">Move to junk</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Move to junk</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => {
                  handleDeleteClick(mail.id)
                }}
                variant="ghost" size="icon" disabled={!mail}>
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Move to trash</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Move to trash</TooltipContent>
          </Tooltip>
          <Separator orientation="vertical" className="mx-1 h-6" />
          <Tooltip>
            <Popover>
              <PopoverTrigger asChild>
                <TooltipTrigger asChild>
                  <Button className='ml-auto'
                    onClick={() => {
                      setFolder(mail, 'scheduled')
                    }}
                    variant="ghost" size="icon" disabled={!mail}>
                    <Clock className="h-4 w-4" />
                    <span className="sr-only">Snooze</span>
                  </Button>
                </TooltipTrigger>
              </PopoverTrigger>
              <PopoverContent className="flex w-[535px] p-0 border-border">
                <div className="flex flex-col gap-2 border-r border-border px-2 py-4">
                  <div className="px-4 text-sm font-medium">Snooze until</div>
                  <div className="grid min-w-[250px] gap-1">
                    <Button
                      variant="ghost"
                      className="justify-start font-normal"
                    >
                      Later today{" "}
                      <span className="ml-auto text-muted-foreground">
                        {format(addHours(today, 4), "E, h:m b")}
                      </span>
                    </Button>
                    <Button
                      variant="ghost"
                      className="justify-start font-normal"
                    >
                      Tomorrow
                      <span className="ml-auto text-muted-foreground">
                        {format(addDays(today, 1), "E, h:m b")}
                      </span>
                    </Button>
                    <Button
                      variant="ghost"
                      className="justify-start font-normal"
                    >
                      This weekend
                      <span className="ml-auto text-muted-foreground">
                        {format(nextSaturday(today), "E, h:m b")}
                      </span>
                    </Button>
                    <Button
                      variant="ghost"
                      className="justify-start font-normal"
                    >
                      Next week
                      <span className="ml-auto text-muted-foreground">
                        {format(addDays(today, 7), "E, h:m b")}
                      </span>
                    </Button>
                  </div>
                </div>
                <div className="p-2">
                  <Calendar />
                </div>
              </PopoverContent>
            </Popover>
            <TooltipContent>Snooze</TooltipContent>
          </Tooltip>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Tooltip>
            <Popover>
              <PopoverTrigger asChild>
                <TooltipTrigger asChild>
                  <Button className='ml-auto'
                    onClick={() => {
                    }}
                    variant="ghost" size="icon" disabled={!mail}>
                    <Paperclip className="h-4 w-4" />
                    <span className="sr-only">Attachments</span>
                  </Button>
                </TooltipTrigger>
              </PopoverTrigger>
              <PopoverContent className="flex w-[535px] p-0 border-border">
                <div className="flex flex-col gap-2 border-r border px-2 py-4">
                  <div className="px-4 text-sm font-medium">Attachments</div>
                  <div className="grid min-w-[250px] gap-1">
                    {attachment && attachment.length > 0 ? (attachment.map((attach, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        className="justify-start font-normal"
                        onClick={() => {
                          getAttachment(app.authProvider!, mail.id, attach.id)
                        }}
                      >
                        <Download className="h-4 w-4" />
                        <span className="ml-auto text-muted-foreground">
                          {attach.name}
                        </span>
                      </Button>
                    ))) : (<><p className='text-center mt-5'>No Attachments in email.</p></>)}

                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <TooltipContent>Attachments</TooltipContent>
          </Tooltip>
        </div>

        <Separator orientation="vertical" className="mx-2 h-6" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" disabled={!mail}>
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">More</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className='border-border'>
            <DropdownMenuItem
              onSelect={() => {
                handlesetToUnread(mail.id)
              }}>
              Mark as unread
            </DropdownMenuItem>
            <DropdownMenuItem disabled>Star thread</DropdownMenuItem>
            <DropdownMenuItem disabled>Add label</DropdownMenuItem>
            <DropdownMenuItem disabled>Mute thread</DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Move</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className='border-border'>
                  <DropdownMenuItem
                    onSelect={() => {
                      setFolder(mail, 'junkemail')
                    }}>
                    Inbox</DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => {
                      setFolder(mail, 'junkemail')
                    }}>
                    Junk Email</DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => {
                      setFolder(mail, 'archive')
                    }}>
                    Archive</DropdownMenuItem>

                  <DropdownMenuItem
                    onSelect={() => {
                      setFolder(mail, 'clutter	')
                    }}>
                    Clutter</DropdownMenuItem>

                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={() => {
                      setFolder(mail, 'deleteditems')
                    }}
                  >Trash</DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Separator />
      {mail ? (
        <div className="flex flex-1 flex-col">
          <div className="flex items-start p-4">
            <div className="flex items-start gap-4 text-sm">
              <Avatar>
                <AvatarImage alt={mail.from?.emailAddress.name} />
                <AvatarFallback>
                  {getFirstLetter(mail.from?.emailAddress.name)}
                </AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <div className="font-semibold">{mail.from?.emailAddress.name}</div>
                <div className="line-clamp-1 text-xs">{mail.subject}</div>
                <div className="line-clamp-1 text-xs">{mail.from?.emailAddress.address}</div>
              </div>
            </div>
            {mail.createdDateTime && (
              <div className="ml-auto text-xs text-muted-foreground">
                {new Date(mail.createdDateTime).toLocaleDateString("en-US", options2)}
              </div>
            )}
          </div>
          <ResizablePanelGroup
            direction="vertical"
            className="min-h-[65vh]  border border-border "
          >
            <ResizablePanel defaultSize={75}>
              <ScrollArea className="h-[95%]">

                <div className="flex-1 swhitespace-pre-wrap p-4 text-sm " dangerouslySetInnerHTML={{ __html: mail.body.content }} />
              </ScrollArea>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={25}>
              <div className="p-4">
                <EmailClientTextEditor
                  to={mail.from?.emailAddress.address}
                  subject={mail.subject}
                  app={app}
                  user={user}
                  mail={mail}
                />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>



        </div>
      ) : (
        <p className=" text-muted-foreground text-center mt-5">
          No e-mail selected
        </p>
      )}
    </div>
  )
}
