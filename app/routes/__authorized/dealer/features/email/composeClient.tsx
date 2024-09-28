import React, { Component, useCallback, useEffect, useRef, useState } from "react"
import { Undo, Redo, Forward, List, ScanLine, Eraser, Code, ListPlus, Brackets, Pilcrow, Minus, AlignLeft, AlignCenter, AlignRight, AlignJustify, Highlighter, WrapText, Quote, Heading1, Heading2, Heading3, Reply, ReplyAll, Save, Plus, Mail, MessageSquare } from 'lucide-react';
import { FaBold, FaStrikethrough, FaItalic, FaUnlink, FaLink, FaList, FaListOl, FaFileCode, FaQuoteLeft, FaUndo, FaAlignJustify, FaAlignLeft, FaRedo, FaAlignRight, FaAlignCenter, FaHighlighter, FaEraser, FaUnderline } from "react-icons/fa";
import { BiCodeBlock } from "react-icons/bi";
import { MdHorizontalRule } from "react-icons/md";
import { IoMdReturnLeft } from "react-icons/io";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

import {
  SelectContent, SelectLabel, SelectGroup,
  SelectValue, Select, SelectTrigger, SelectItem, Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Input,
  Separator,
  Avatar,
  AvatarImage,
  AvatarFallback,
  TooltipProvider,
} from "~/components"
import { toast } from "sonner"
import { cn } from "~/components/ui/utils"
import { Button, buttonVariants } from "~/components/ui/button"
import { Editor } from "~/components/libs/basicEditor"
import { clientAtr, dealerInfo, FandIAttr, financeInfo, salesPersonAttr, tradeVehAttr, wantedVehAttr } from "~/routes/__authorized/dealer/user/dashboard.templates"
import { fixUrl } from "~/utils/url"
import { prisma } from "~/libs/prisma.server"
import { ComposeEmail, ComposeEmailTwo, forwardEmail, replyAllEmail, replyMessage, searchEmail, SendNewEmail } from "~/components/microsoft/GraphService"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "~/components/ui/resizable";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip"
import { ComposeClientTextEditor } from "./textEditor";
import { useFetcher, useLoaderData } from "@remix-run/react";
import ProvideAppContext, { useAppContext, } from "~/components/microsoft/AppContext";
import { CheckIcon, PaperPlaneIcon, PlusIcon } from "@radix-ui/react-icons"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion"
import { useMsal } from "@azure/msal-react";

export default function ComposeClient() {
  const app = useAppContext();
  const { instance, accounts, inProgress } = useMsal();
  const [data, setData] = useState()
  const [financeId, setFinanceId] = useState()
  const [user, setUser] = useState()
  const [cust, setCust] = useState()
  const [emails, setEmails] = useState();
  const [input, setInput] = useState("")
  const [userMessage, setUserMessage] = useState("")
  const [aiMessages, setAiMessages] = useState([
    { role: "system", content: "You are an AI sales assistant. Your goal is to assist in selling a product or service. Great! Our product is selling automotive vehicles/products. You will help with writing sales copy for emails and text messages and coming up with new ideas in order to have a reason to reach out to clients again without making it seem like your bothering the client with needless contact. You will receive incomplete text messages, emails and templates or a set of ideas to base the correspondence around. You are to give email, text and sales copy suggestions to improve closing ratios, appointment booking and customer relations." },
    { author: 'assistant', content: "Welcome, what do you need help with today?" }
  ])
  console.log(app, instance, 'incompose')

  useEffect(() => {
    const userIs = window.localStorage.getItem("user");
    const parseUser = userIs ? JSON.parse(userIs) : [];
    setUser(parseUser)
    const getCust = window.localStorage.getItem("customer");
    const parseCust = getCust ? JSON.parse(getCust) : [];
    setCust(parseCust)
    setFinanceId(parseCust.financeId)
    console.log(parseCust, parseUser, 'parseuser and custe')
    if (parseCust.financeId) {
      async function loadFinanceData() {
        try {
          const data = await fetchFinanceData(parseCust.financeId);
          setData(data);
          console.log(data, 'finance data in compsoen client')
        } catch (error) {
          console.error("Error loading finance data:", error);
        } finally {
          setLoading(false);
        }
      }
      loadFinanceData()
    }

  }, []);

  async function fetchFinanceData(financeId: string) {
    try {
      const response = await fetch(`/dealer/api/sales/finance/${financeId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response, 'finance data f4rofm api')
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Failed to fetch finance data:", error);
      throw error;
    }
  }


  useEffect(() => {
    const getuser = window.localStorage.getItem("user");
    const parseuser = getuser ? JSON.parse(getuser) : [];
    setUser(parseuser)

    const getcust = window.localStorage.getItem("customer");
    const parsecusta = getcust ? JSON.parse(getcust) : [];
    setCust(parsecusta)

    async function GetToken() {
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
      const jsontoken = JSON.stringify(getToken)
      window.localStorage.setItem("remix-stutter-66-3145", jsontoken);
      if (getToken.accessToken) {
        const accessToken = getToken.accessToken;
        const emailAddress = parsecusta.email
        const url = `https://graph.microsoft.com/v1.0/me/messages?$top=2&$select=sender,subject,toRecipients,receivedDateTime?$filter=(from/emailAddress/address) eq '{skylerzanth@gmail.com}'?$filter=(toRecipients/emailAddress/address) eq '{skylerzanth@gmail.com}'`;

        fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        })
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
          })
          .then(data => {
            setEmails(data)
            console.log('Messages:', data);
          })
          .catch(error => {
            console.error('Error fetching messages:', error);
          });
      }
    }
    if (parsecusta.email) {
      GetToken()

    }
    const fetchEmails = async () => {
      try {
        const response = await searchEmail(app.authProvider!, data.email ? data.email : cust.email);
        setEmails(response.value);
        console.log('emails succesfull fetched,', response.value)

      } catch (error) {
        console.error("Error fetching emails:", error);

        try {
          const response = await searchEmail(app.authProvider!, data.email ? data.email : cust.email);
          setEmails(response.value);
          //      console.log('2nd try to get meails succesfull,', response.value)
        } catch (error) {
          console.error("Error fetching emails 222:", error);
        }
      };
      fetchEmails()
    }
  }, []);

  if (data || cust) {
    if (cust.email && cust.email.length > 5 || data.email && data.email.length > 5) {
      return (
        <>
          <div className="p-4">
            <>
              <ComposeClientTextEditor
                to={cust.email ? cust.email : data.email}
                app={app}
                user={user}
                customer={cust}
                content=''
              />
            </>
          </div>
        </>
      )
    }
  } else {
    return (
      <p className='text-center mt-10 '>No email currently set</p>
    )
  }

}

/**
    */
/** <>
      {data && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="w-full max-w-[95%]  m-8  md:max-w-[75%] max-h-[500px] h-full overflow-y-auto">
            <Tabs defaultValue="account" className=" ">
              <TabsList className="">
                <TabsTrigger value="account">Email</TabsTrigger>
                <TabsTrigger value="password">Prev Interactions</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
                <TabsTrigger value="scripter" disabled>Script Assistant</TabsTrigger>
              </TabsList>
              <TabsContent value="account">
                <div className="p-4">
                  <ComposeClientTextEditor
                    to={data.email}
                    app={app}
                    user={user}
                    customer={data}
                  />
                </div>
              </TabsContent>
              <TabsContent value="password">
                <Card className="overflow-hidden  text-foreground w-[600px] mx-auto" x-chunk="dashboard-05-chunk-4 "  >
                  <CardHeader className="flex flex-row items-start bg-muted-background">
                    <div className="grid gap-0.5">
                      <CardTitle className="group flex items-center gap-2 text-lg">
                        Customer Interactions
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow !grow overflow-y-auto overflow-x-clip p-6 text-sm bg-background">
                    <div className="grid gap-3 max-h-[70vh] h-auto">
                      <Card>
                        <CardContent>{/**do a verical tabs with icons for email and sms only get the last 2 oe 3 messages
                        <Tabs defaultValue="account" className=" " orientation='vertical'>
                        <TabsList className="">
                          <TabsTrigger value="Email"><Mail /></TabsTrigger>
                          <TabsTrigger value="text"><MessageSquare /></TabsTrigger>
                        </TabsList>
                        <TabsContent value="Email">
                          <Accordion type="single" collapsible className="w-full">
                            {emails && Array.isArray(emails) && emails.map((email: any, index: any) => (
                              <AccordionItem key={index} value={email.id}>
                                <AccordionTrigger>
                                  {new Date(email.createdDateTime).toLocaleDateString("en-US", options2)}
                                </AccordionTrigger>
                                <AccordionContent>
                                  <div className="flex-1 swhitespace-pre-wrap p-4 text-sm " dangerouslySetInnerHTML={{ __html: email.body.content }} />
                                </AccordionContent>
                              </AccordionItem>
                            ))}
                          </Accordion>
                        </TabsContent>
                        <TabsContent value="text">
                        </TabsContent>
                      </Tabs>
                      <div className="space-y-4 mt-5">
                        {conversationsList.map((message, index) => (
                          <div
                            key={index}
                            className={cn(
                              "flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                              message.userEmail === user.email
                                ? "ml-auto bg-primary text-foreground"
                                : "bg-[#262626]"
                            )}
                          >
                            <div className='grid grid-cols-1'>
                              {message.userEmail !== user.email && (
                                <p className='text-[#8c8c8c]'>
                                  {message.userEmail}
                                </p>
                              )}
                              {message.body}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
              <CardFooter className="flex flex-row items-center border-t border-border bg-muted-background px-6 py-3">
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="notes" className="">
            <div className='max-h-[900px] '>
              <>
                <Card className="overflow-hidden text-foreground w-[600px] mx-auto " x-chunk="dashboard-05-chunk-4 "  >
                  <CardHeader className="flex flex-row items-start bg-muted-background">
                    <div className="grid gap-0.5">
                      <CardTitle className="group flex items-center gap-2 text-lg">
                        Notes
                      </CardTitle>
                    </div>
                    <div className="ml-auto flex items-center gap-1">
                      <TooltipProvider delayDuration={0}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button size="icon" variant="outline" className="ml-auto rounded-full" onClick={() => setOpen(true)}  >
                              <PlusIcon className="h-4 w-4" />
                              <span className="sr-only">CC Employee</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent sideOffset={10} className='bg-primary'>CC Employee</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow !grow overflow-y-auto overflow-x-clip p-6 text-sm bg-background">
                    <div className="grid gap-3 max-h-[70vh] h-auto">
                      <Card>
                        <CardContent>
                          <div className="space-y-4 mt-5">
                            {financeNotesList && financeNotesList.map((message, index) => (
                              <div
                                key={index}
                                className={cn(
                                  "flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                                  message.userEmail === user.email
                                    ? "ml-auto bg-primary text-foreground"
                                    : "bg-[#262626]"
                                )}
                              >
                                <div className='grid grid-cols-1'>
                                  {message.userEmail !== user.email && (
                                    <p className='text-muted-foreground'>
                                      {message.userName}
                                    </p>
                                  )}
                                  {message.body}
                                  {message.selectedUsers.length > 0 && (
                                    <div className="flex -space-x-2 overflow-hidden">
                                      {message.selectedUsers.map((user) => (
                                        <Tooltip key={user.email}>
                                          <TooltipTrigger asChild>
                                            <Avatar className="inline-block  border border-border"                                >
                                              <AvatarImage src={user.avatar} />
                                              <AvatarFallback>{user.selectedName[0]}</AvatarFallback>
                                            </Avatar>
                                          </TooltipTrigger>
                                          <TooltipContent side="right" className='text-center grid grid-cols-1 border border-border'>
                                            <p>{user.selectedName}</p>
                                            <p>{user.selectedEmail}</p>
                                          </TooltipContent>
                                        </Tooltip>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                            {!financeNotesList || financeNotesList.length === 0 && <p className='mt-10 text-center'>No notes left at this time.</p>}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-row items-center border-t border-border bg-muted-background px-6 py-3">

                    <fetcher.Form ref={formRef} method="post" className="flex w-full items-center space-x-2" >
                      <input type='hidden' name='financeId' defaultValue={data.id} />
                      <input type='hidden' name='selectedUsers' defaultValue={JSON.stringify(selectedUsers)} />
                      <input type='hidden' name='userEmail' defaultValue={user.email} />
                      <input type='hidden' name='clientfileId' defaultValue={data.clientfileId} />
                      <input type='hidden' name='userName' defaultValue={user.name} />
                      <input type='hidden' name='name' defaultValue={data.name} />
                      <Input
                        id="message"
                        placeholder="Type your message..."
                        className="flex-1  bg-muted/50  border-border"
                        autoComplete="off"
                        value={input}
                        onChange={(event) => setInput(event.target.value)}
                        name="body"
                      />
                      <Button
                        value="saveFinanceNote"
                        type="submit"
                        name="intent"
                        size="icon"
                        onClick={() => {
                          toast.success(`Note saved`)
                        }}
                        disabled={inputLength === 0}
                        className='bg-primary '>
                        <PaperPlaneIcon className="h-4 w-4" />
                        <span className="sr-only">Send</span>
                      </Button>

                    </fetcher.Form>
                  </CardFooter>
                </Card>
              </>
            </div>
          </TabsContent>
          <TabsContent value="scripter" className="">
            <div className="parent-container h-auto bg-background" >
              <Card className="">
                <CardContent>
                  <div className=' flex flex-col-reverse  space-y-4   max-h-[450px] h-auto overflow-y-auto'>

                    {aiMessages && aiMessages.slice(1).reverse().map((message, index) => (
                      <div
                        key={index}
                        className={cn(
                          "flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm my-2",
                          message.author === 'user'
                            ? "ml-auto bg-primary text-foreground"
                            : "bg-[#262626]"
                        )}
                      >
                        <div className='grid grid-cols-1 '>
                          {message.author !== 'user' && (
                            <p className='text-[#8c8c8c]'>
                              Scripty
                            </p>
                          )}
                          {message.content}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <div className="flex w-full items-center   mt-5" >
                <Input
                  id="message"
                  placeholder="Start writing your email or give the assistant a short desc. or a set of parameters to work with..."
                  className="flex-1 bg-muted-background border-border mr-2"
                  autoComplete="off"
                  value={userMessage}
                  // ref={textareaRef}
                  onChange={(e) => setUserMessage(e.target.value)}
                  name="message"
                />
                <Button
                  size="icon"
                  onClick={() => {
                    toast.success(`Asking AI sales assistant!`)
                    SubmitAi()
                  }}
                  disabled={userMessageLength === 0}
                  className='bg-primary mr-2'>
                  <PaperPlaneIcon className="h-4 w-4" />
                  <span className="sr-only">Send</span>
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )}
</> */
