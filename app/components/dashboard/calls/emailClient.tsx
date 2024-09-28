import {
  Input, Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, TextArea, Card, CardContent, CardHeader, CardFooter, CardTitle, TooltipProvider, Tooltip, TooltipTrigger, TooltipContent, AvatarImage,
  AvatarFallback, Avatar,
} from "~/components";
import { useLoaderData, Form, useFetcher, useLocation, useNavigation } from "@remix-run/react";
import { PhoneOutcome, MenuScale, MessageText, User, ArrowDown, Calendar as CalendarIcon, WebWindowClose, } from "iconoir-react";
import { Undo, Redo, Forward, List, ScanLine, Eraser, Code, ListPlus, Brackets, Pilcrow, Minus, AlignLeft, AlignCenter, AlignRight, AlignJustify, Highlighter, WrapText, Quote, Heading1, Heading2, Heading3, Reply, ReplyAll, Save, Plus, Mail, MessageSquare } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger, } from "~/components/ui/tabs"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { cn } from "~/components/ui/utils"
import { toast } from "sonner"
import { CheckIcon, PaperPlaneIcon, PlusIcon } from "@radix-ui/react-icons"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "~/components/ui/command"


//import OpenAI from "openai";
//const openai = new OpenAI({  apiKey: "sk-proj-7hkkODMuRYEpSasZrZSHT3BlbkFJJPxyAFK2GS5xC2Q6bZVo"//process.env.OPEN_AI_SECRET_KEY,
//});
const apiKey = 'sk-proj-7hkkODMuRYEpSasZrZSHT3BlbkFJJPxyAFK2GS5xC2Q6bZVo';
const url = 'https://api.openai.com/v1/chat/completions';
//  const [customerEmail, setCustomerEmail] = useState('')
//  const [customerName, setCustomerName] = useState('')
//  const [customerfinanceId, setCustomerfinanceId] = useState('')
// const [convos, setConvos] = useState([])

/**
 *
 *     function getNotesByFinanceId(notes, financeId) {
        return notes.filter(note => note.financeId === financeId);
      }
      const filteredNotes = getNotesByFinanceId(financeNotes, data.financeId);
    function GetConversationsByID(conversations, financeId) {
      return conversations.filter(conversation => conversation.conversationSid === financeId);
    }
    const filteredConversations = GetConversationsByID(messagesConvo, user.conversationSid);

 */

export default function EmailClient({
  data,
  open,
  setOpen,
  customerEmail,
  customerName,
  customerfinanceId,
  userList,
  user,
}) {
  const { conversations, financeNotes, latestNotes, } = useLoaderData();
  const [financeNotesList, setFinanceNoteList] = useState([])
  const [conversationsList, setConversationsList] = useState([])
  const [emailData, setEmailData] = useState([])
  const [selectedUsers, setSelectedUsers] = useState([])
  const [emails, setEmails] = useState();
  const [aiMessages, setAiMessages] = useState([
    { role: "system", content: "You are an AI sales assistant. Your goal is to assist in selling a product or service. Great! Our product is selling automotive vehicles/products. You will help with writing sales copy for emails and text messages and coming up with new ideas in order to have a reason to reach out to clients again without making it seem like your bothering the client with needless contact. You will receive incomplete text messages, emails and templates or a set of ideas to base the correspondence around. You are to give email, text and sales copy suggestions to improve closing ratios, appointment booking and customer relations." },
    { author: 'assistant', content: "Welcome, what do you need help with today?" }
  ])
  const [userMessage, setUserMessage] = useState("")
  const userMessageLength = userMessage.trim().length
  let fetcher = useFetcher();
  let formRef = useRef();
  const [input, setInput] = React.useState("")
  const inputLength = input.trim().length
  const [appData, setAppData] = useState()

  useEffect(() => {
    if (data) {
      setFinanceNoteList(data.FinanceNote)
      setConversationsList(data.Comm)
    }
  }, [data]);


  useEffect(() => {
    if (data && open === true) {
      const serializedUser = JSON.stringify(user);
      const cust = {
        email: customerEmail,
        name: customerName,
        financeId: data.id,
      }
      const serializedCust = JSON.stringify(cust);
      window.localStorage.setItem("user", serializedUser);
      window.localStorage.setItem("customer", serializedCust);

      const getemailData = window.localStorage.getItem("emailData");
      const parseemailData = getemailData ? JSON.parse(getemailData) : [];
      setEmailData(parseemailData)

      const getApp = window.localStorage.getItem("remix-stutter-66-3145");
      const parseApp = getApp ? JSON.parse(getApp) : [];
      console.log(parseApp.accessToken, 'parseApp')
      setAppData(parseApp.accessToken)

      if (parseApp.accessToken) {
        const accessToken = parseApp.accessToken;
        const emailAddress = 'skylerzanth@gmail.com';
        const url = `https://graph.microsoft.com/v1.0/me/messages?$filter=(sender/emailAddress/address eq '${emailAddress}' or toRecipients/any(r: r/emailAddress/address eq '${emailAddress}'))&$select=sender,subject,toRecipients`;

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
  }, []);

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
      console.log(currentHost, 'currentHost')
      if (iFrameRef.current) {
        if (currentHost === "localhost:3000") {
          iFrameRef.current.src = "http://localhost:3000/dealer/features/email/composeClient";
        }
        if (currentHost === "dealersalesassistant.ca") {
          iFrameRef.current.src =
            "https://www.dealersalesassistant.ca/dealer/features/email/composeClient";
        }
        window.addEventListener("message", handleHeightMessage);

        const cust = {
          email: data.email,
          name: data.name,
          financeId: data.financeId,
        };
        const sendData = { cust, user };

        // Add load event listener to ensure iframe is loaded
        const onLoad = () => {
          iFrameRef.current.contentWindow.postMessage(sendData, '*');
        };
        iFrameRef.current.addEventListener('load', onLoad);

        return () => {
          window.removeEventListener("message", handleHeightMessage);
          iFrameRef.current?.removeEventListener('load', onLoad);
        };
      }
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
              minHeight: "250px"
            }}
          />
        </div>
      </>
    );
  };

  async function SubmitAi() {
    setAiMessages([...aiMessages, { author: 'user', content: userMessage }]);
    const data = {
      model: "gpt-3.5-turbo-0125",
      messages: aiMessages,
      temperature: 1,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    };
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(result => {
        console.log(result);
        setAiMessages([...aiMessages, { author: 'assistant', content: String(result.choices[0].message.content) }]);
      })
      .catch(error => {
        console.error('Error:', error);
      });
    setUserMessage("")
    console.log(aiMessages, 'aiMessages')

  }
  const options2 = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  };

  /**  const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-0125",
      messages: [
        { role: "system", content: "You are an AI sales assistant. Your goal is to assist in selling a product or service. Great! Our product is selling automotive vehicles/products. You will help with writing sales copy for emails and text messages and coming up with new ideas in order to have a reason to reach out to clients again without making it seem like your bothering the client with needless contact. You will receive incomplete text messages, emails and templates or a set of ideas to base the correspondence around. You are to give email, text and sales copy suggestions to improve closing ratios, appointment booking and customer relations." },
        { "role": "user", "content": userMessage }
      ],
      temperature: 1,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    }); */
  return (
    <>
      {data && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className='w-full max-w-[95%]  m-8  md:max-w-[75%] '>
            <Tabs defaultValue="account" className=" ">
              <TabsList className="">
                <TabsTrigger value="account">Email</TabsTrigger>
                <TabsTrigger value="password">Prev Interactions</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
                <TabsTrigger value="scripter">Script Assistant</TabsTrigger>
              </TabsList>
              <TabsContent value="account">
                <div className="parent-container h-auto" >
                  <MyIFrameComponent />
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
                        <CardContent>{/**do a verical tabs with icons for email and sms only get the last 2 oe 3 messages  */}
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
                            {conversationsList && conversationsList.length > 0 && conversationsList.map((message, index) => (
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
                        <Dialog open={open} onOpenChange={setOpen}>
                          <DialogContent className="gap-0 p-0 outline-none border-border text-foreground">
                            <DialogHeader className="px-4 pb-4 pt-5">
                              <DialogTitle>CC Employee</DialogTitle>
                              <DialogDescription>
                                Invite a user to this thread.
                              </DialogDescription>
                            </DialogHeader>
                            <Command className="overflow-hidden rounded-t-none border-t border-border bg-transparent">
                              <CommandInput placeholder="Search user..." className=' bg-muted/50  text-foreground' />
                              <CommandList>
                                <CommandEmpty>No users found.</CommandEmpty>
                                <CommandGroup className="p-2">
                                  {userList.map((user) => (
                                    <CommandItem
                                      key={user.email}
                                      className="flex items-center px-2"
                                      onSelect={() => {
                                        if (selectedUsers.includes(user)) {
                                          return setSelectedUsers(
                                            selectedUsers.filter(
                                              (selectedUser) => selectedUser !== user
                                            )
                                          )
                                        }

                                        return setSelectedUsers(
                                          [...userList].filter((u) =>
                                            [...selectedUsers, user].includes(u)
                                          )
                                        )
                                      }}
                                    >
                                      <Avatar>
                                        <AvatarImage src='/avatars/02.png' alt="Image" />
                                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                                      </Avatar>
                                      <div className="ml-2">
                                        <p className="text-sm font-medium leading-none">
                                          {user.name}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                          {user.email}
                                        </p>
                                      </div>
                                      {selectedUsers.includes(user) ? (
                                        <CheckIcon className="ml-auto flex h-5 w-5 text-primary" />
                                      ) : null}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                            <DialogFooter className="flex items-center border-t border-border p-4 sm:justify-between">
                              {selectedUsers.length > 0 ? (
                                <div className="flex -space-x-2 overflow-hidden">
                                  {selectedUsers.map((user) => (
                                    <Avatar
                                      key={user.email}
                                      className="inline-block  border border-border"
                                    >
                                      <AvatarImage src={user.avatar} />
                                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                                    </Avatar>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-sm text-muted-foreground">
                                  Select users to add to this thread.
                                </p>
                              )}

                              <Button
                                disabled={selectedUsers.length < 1}
                                onClick={() => {
                                  setOpen(false)
                                }}
                              >
                                Continue
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
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
    </>
  );
}

/**   <Dialog open={open} onOpenChange={setOpen}>
                        <DialogContent className="gap-0 p-0 outline-none border-border text-foreground">
                          <DialogHeader className="px-4 pb-4 pt-5">
                            <DialogTitle>CC Employee</DialogTitle>
                            <DialogDescription>
                              Invite a user to this thread.
                            </DialogDescription>
                          </DialogHeader>
                          <Command className="overflow-hidden rounded-t-none border-t border-border bg-transparent">
                            <CommandInput placeholder="Search user..." className='bg-muted-background text-foreground' />
                            <CommandList>
                              <CommandEmpty>No users found.</CommandEmpty>
                              <CommandGroup className="p-2">
                                {users.map((user) => (
                                  <CommandItem
                                    key={user.email}
                                    className="flex items-center px-2"
                                    onSelect={() => {
                                      if (selectedUsers.includes(user)) {
                                        return setSelectedUsers(
                                          selectedUsers.filter(
                                            (selectedUser) => selectedUser !== user
                                          )
                                        )
                                      }

                                      return setSelectedUsers(
                                        [...users].filter((u) =>
                                          [...selectedUsers, user].includes(u)
                                        )
                                      )
                                    }}
                                  >
                                    <Avatar>
                                      <AvatarImage src={user.avatar} alt="Image" />
                                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="ml-2">
                                      <p className="text-sm font-medium leading-none">
                                        {user.name}
                                      </p>
                                      <p className="text-sm text-muted-foreground">
                                        {user.email}
                                      </p>
                                    </div>
                                    {selectedUsers.includes(user) ? (
                                      <CheckIcon className="ml-auto flex h-5 w-5 text-primary" />
                                    ) : null}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                          <DialogFooter className="flex items-center border-t border-border p-4 sm:justify-between">
                            {selectedUsers.length > 0 ? (
                              <div className="flex -space-x-2 overflow-hidden">
                                {selectedUsers.map((user) => (
                                  <Avatar
                                    key={user.email}
                                    className="inline-block border-2 border-background border-border"
                                  >
                                    <AvatarImage src={user.avatar} />
                                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                                  </Avatar>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground">
                                Select users to add to this thread.
                              </p>
                            )}
                            <Button
                              disabled={selectedUsers.length < 2}
                              onClick={() => {
                                setOpen(false)
                              }}
                            >
                              Continue
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog> */

/** <TabsContent value="password">
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
  <CardContent>
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

<Button
value="saveFinanceNote"
type="submit"
name="intent"
size="sm"
onClick={() => {
  toast.success(`Note saved`)
}}
disabled={inputLength === 0}
className='bg-primary '>
<PlusIcon className="h-4 w-4" />

<span className="sr-only">Add</span>
</Button>

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
          {latestNote ? (
            <div
              className={cn(
                "flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                latestNote.userEmail === user.email
                  ? "ml-auto bg-primary text-foreground"
                  : "bg-[#262626]"
              )}
            >
              <div className='grid grid-cols-1'>
                {latestNote.userEmail !== user.email && (
                  <p className='text-[#8c8c8c]'>
                    {latestNote.userName}
                  </p>
                )}
                {latestNote.body}
              </div>
            </div>
          ) : (
            <p>No notes on file.</p>
          )}
        </div>
      </CardContent>
    </Card>
  </div>
</CardContent>
<CardFooter className="flex flex-row items-center border-t border-border bg-muted-background px-6 py-3">
  <fetcher.Form ref={formRef} method="post" className="flex w-full items-center space-x-2" >
    <Input type="hidden" defaultValue={user.email} name="author" />
    <Input type="hidden" defaultValue={data.clientFileId} name="customerId" />
    <input type="hidden" defaultValue={data.id} name="financeId" />
    <Input type="hidden" defaultValue={data.name} name="name" />
    <Input
      id="message"
      placeholder="Type your message..."
      className="flex-1 bg-muted-background border-border"
      autoComplete="off"
      value={input}
      onChange={(event) => setInput(event.target.value)}
      name="customContent"
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
</TabsContent> */
