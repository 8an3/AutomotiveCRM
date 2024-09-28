import { Input, Button, Dialog as DialogRoot, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, TextArea, Card, CardContent, CardHeader, CardFooter, CardTitle, TooltipProvider, Tooltip, TooltipTrigger, TooltipContent, Avatar, AvatarFallback, AvatarImage, } from "~/components";
import { useLoaderData, Form, useFetcher, useLocation, useNavigation, useSearchParams, useSubmit } from "@remix-run/react";
import { Tabs, TabsContent, TabsList, TabsTrigger, } from "~/components/ui/tabs"
import React, { useCallback, useEffect, useRef, useState } from "react"
import * as Dialog from '@radix-ui/react-dialog';
import { cn } from "~/components/ui/utils"
import { toast } from "sonner"
import { CheckIcon, PaperPlaneIcon, PlusIcon } from "@radix-ui/react-icons"
import { prisma } from "~/libs";
import { Message, Conversation, Participant, Client, ConnectionState, Paginator, } from "@twilio/conversations";
import axios from "axios";
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

const accountSid = 'AC9b5b398f427c9c925f18f3f1e204a8e2';
const authToken = 'd38e2fd884be4196d0f6feb0b970f63f';
//const client = twilio(accountSid, authToken);

async function getToken(username, password) {
  const requestAddress = 'https://dsatokenservice-4995.twil.io/token-service'
  if (!requestAddress) {
    throw new Error(
      "REACT_APP_ACCESS_TOKEN_SERVICE_URL is not configured, cannot login"
    );
  }

  try {
    const response = await axios.get(requestAddress, {
      params: { identity: 'skylerzanth', password: 'skylerzanth1234' },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      throw new Error(error.response.data ?? "Authentication error.");
    }

    console.error(`ERROR received from ${requestAddress}: ${error}\n`);
    throw new Error(`ERROR received from ${requestAddress}: ${error}\n`);
  }
}

async function login(username, password, setToken,) {
  try {
    const token = await getToken(username, password);
    if (token === "") {
      return "Received an empty token from backend.";
    }
    // localStorage.setItem("username", username);
    // localStorage.setItem("password", password);
    setToken(token);
    return null;
  } catch (error) {
    let message = "Unknown Error";
    if (error instanceof Error) {
      message = error.message;
    } else {
      message = String(error);
    }
    return message;
  }
}

export default function SmsClientDash({ data, openSMS, setOpenSMS, smsDetails, userList, user, }) {
  const [selectedUsers, setSelectedUsers] = useState([])

  const [financeNotesList, setFinanceNoteList] = useState([])
  const [conversationsList, setConversationsList] = useState([])
  const [customer, setCustomer] = useState()
  const [customerMessages, setCustomerMessages] = useState([])
  const [conversationSid, setConversationSid] = useState('')
  const [smsInput, setSmsInput] = useState("")
  let fetcher = useFetcher();
  let formRef = useRef();
  const inputLength = smsInput.trim().length
  const [openNote, setOpenNote] = useState(false)
  const [input, setInput] = useState("")
  const inputLengthwtwo = input.trim().length

  useEffect(() => {
    setFinanceNoteList(data.FinanceNote)
    setConversationsList(data.Comm)
  }, [data]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [latestNote, setlatestNote] = useState(data.FinanceNote[0])

  useEffect(() => {
    const accountSid = 'AC9b5b398f427c9c925f18f3f1e204a8e2';
    const authToken = 'd38e2fd884be4196d0f6feb0b970f63f';
    setCustomer(smsDetails);

    if (smsDetails) {
      const newConversationSid = smsDetails.conversationId;
      setConversationSid(newConversationSid);

      if (newConversationSid) {
        const url = `https://conversations.twilio.com/v1/Conversations/${newConversationSid}/Messages`;
        const credentials = `${accountSid}:${authToken}`;
        const base64Credentials = btoa(credentials);

        async function fetchMessages() {
          try {
            const response = await fetch(url, {
              method: 'GET',
              headers: { 'Authorization': `Basic ${base64Credentials}` },
            });
            console.log(response, 'response')
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (data.length !== 0) {
              setCustomerMessages(data.messages);

            }
            else {
              setCustomerMessages([])
            }
            console.log(data, 'fetched messages');
            return data;
          } catch (error) {
            console.error('Failed to fetch messages:', error);
          }
        }

        fetchMessages();
      }
    }
    /* else {

      async function GetNumber() {
        const areaCode = user.phone.slice(0, 3);
        const locals = await client.availablePhoneNumbers("CA").local.list({
          areaCode: areaCode,
          limit: 1,
        });
        const incomingPhoneNumber = await client.incomingPhoneNumbers.create({
          phoneNumber: locals.available_phone_numbers[0].phone_number,
        });
        // create new conversation sid

        // save invo in twilioSMSDetails
        const saved = await prisma.twilioSMSDetails.create({
          data: {
            conversationSid: '',
            participantSid: '',
            userSid: '',
            username: 'skylerzanth',
            password: 'skylerzanth1234',
            userEmail: user.email,
            passClient: '',
            myPhone: locals.available_phone_numbers[0].phone_number,
            proxyPhone: '',
          }
        })
           const newConversationSid = saved.conversationId;
      setConversationSid(newConversationSid);
         if (newConversationSid) {
        const url = `https://conversations.twilio.com/v1/Conversations/${newConversationSid}/Messages`;
        const credentials = `${accountSid}:${authToken}`;
        const base64Credentials = btoa(credentials);

        async function fetchMessages() {
          try {
            const response = await fetch(url, {
              method: 'GET',
              headers: { 'Authorization': `Basic ${base64Credentials}` },
            });
            console.log(response, 'response')
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (data.length !== 0) {
              setCustomerMessages(data.messages);

            }
            else {
              setCustomerMessages([])
            }
            console.log(data, 'fetched messages');
            return data;
          } catch (error) {
            console.error('Failed to fetch messages:', error);
          }
        }

        fetchMessages();
      }
      }

GetNumber()
    }*/
  }, [smsDetails]);

  const [aiMessages, setAiMessages] = useState([
    { role: "system", content: "You are an AI sales assistant. Your goal is to assist in selling a product or service. Great! Our product is selling automotive vehicles/products. You will help with writing sales copy for emails and text messages and coming up with new ideas in order to have a reason to reach out to clients again without making it seem like your bothering the client with needless contact. You will receive incomplete text messages, emails and templates or a set of ideas to base the correspondence around. You are to give email, text and sales copy suggestions to improve closing ratios, appointment booking and customer relations." },
    { author: 'assistant', content: "Welcome, what do you need help with today?" }
  ])
  const [userMessage, setUserMessage] = useState("")
  const userMessageLength = userMessage.trim().length
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
  return (
    <Dialog.Root open={openSMS} onOpenChange={setOpenSMS} >

      <Dialog.Portal>
        <Dialog.Overlay className="bg-blackA6 data-[state=open]:animate-overlayShow fixed inset-0" />
        <Dialog.Content className=" w-[95%] md:w-[600px] h-[650px]  fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-background border border-border text-foreground p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none ">
          <DialogDescription>
            <Tabs defaultValue="account" className="w-full">
              <TabsList className="grid  w-[360px] grid-cols-3">
                <TabsTrigger value="account">SMS</TabsTrigger>
                <TabsTrigger value="password">Prev Interactions</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>
              <TabsContent value="account">
                <TextFunction
                  customerMessages={customerMessages}
                  customer={customer}
                  data={data}
                  user={user}
                  smsDetails={smsDetails}
                />
              </TabsContent>
              <TabsContent value="password">
                <Card className="  text-foreground w-auto mx-auto" x-chunk="dashboard-05-chunk-4 "  >
                  <CardHeader className="flex flex-row items-start bg-muted-background">
                    <div className="grid gap-0.5">
                      <CardTitle className="group flex items-center gap-2 text-lg">
                        Customer Interactions
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="  p-6 text-sm bg-background">
                    <div className="grid gap-3  ">
                      <Card>
                        <CardContent>
                          <div className="space-y-4 mt-5">
                            {conversationsList && conversationsList.length >= 1 ? (
                              conversationsList.map((message, index) => (
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
                              ))) : (
                              <p>No conversations found.</p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-row items-center border-t border-border bg-muted-background px-6 py-3">
                    <fetcher.Form method='post' >

                      <Button
                        value="savePrevInteraction"
                        type="submit"
                        name="intent"
                        size="sm"
                        onClick={() => {
                          toast.success(`Note saved`)
                        }}
                        //   disabled={inputLength === 0}
                        className='bg-primary '>
                        <PlusIcon className="h-4 w-4" />

                        <span className="sr-only">Add</span>
                      </Button>
                    </fetcher.Form >
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
                        <DialogRoot open={openNote} onOpenChange={setOpenNote}>
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
                                  setOpenNote(false)
                                }}
                              >
                                Continue
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </DialogRoot>
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
          </DialogDescription>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function TextFunction({ customerMessages, customer, data, user, smsDetails, }) {
  const [smsInput, setSmsInput] = useState("")
  let fetcher = useFetcher();
  let formRef = useRef();
  const inputLength = smsInput.trim().length

  return (
    <>
      <div className="parent-container h-auto bg-background" >
        <Card className="">
          <CardContent>
            <div className=' flex flex-col-reverse  space-y-4   max-h-[450px] h-auto overflow-y-scroll'>

              {customerMessages && customerMessages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                    message.author === customer.identity.toLowerCase().replace(/\s/g, '')
                      ? "ml-auto bg-primary text-foreground"
                      : "bg-[#262626]"
                  )}
                >
                  <div className='grid grid-cols-1'>
                    {message.author !== customer.identity.toLowerCase().replace(/\s/g, '') && (
                      <p className='text-[#8c8c8c]'>
                        {data.name}
                      </p>
                    )}
                    {message.body}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <fetcher.Form ref={formRef} method="post" className="flex w-full items-center   mt-5" >
          <input className='w-full p-2' type="hidden" name='phone' defaultValue={`+1${user.phone}`} />
          <input className='w-full p-2' type="hidden" name='intent' defaultValue='sendMessage' />
          <input className='w-full p-2' type="hidden" name='conversationSid' defaultValue={smsDetails.conversationId} />

          <input type='hidden' name='financeId' defaultValue={data.id} />
          <input type='hidden' name='SMS' defaultValue={data.SMS} />
          <input type='hidden' name='userEmail' defaultValue={user.email} />
          <input type='hidden' name='clientfileId' defaultValue={data.clientfileId} />
          <input type='hidden' name='userName' defaultValue={user.name} />
          <Input
            id="message"
            placeholder="Message..."
            className="flex-1 bg-muted-background border-border mr-2"
            autoComplete="off"
            value={smsInput}
            // ref={textareaRef}
            onChange={(event) => setSmsInput(event.target.value)}
            name="message"
          />
          <Button
            type="submit"
            size="icon"
            onClick={() => {
              toast.success(`Text sent!`)
            }}
            disabled={inputLength === 0}
            className='bg-primary mr-2'>
            <PaperPlaneIcon className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </fetcher.Form>
      </div>
    </>
  )
}
/**  <Input


                            autoComplete="off"
                            className='rounded-d m-2 w-[99%] bg-myColor-900 p-3 text-[#fafafa]  mb-2 mt-5'

                            onChange={(e) => setText(e.target.value)}
                            onClick={() => {
                              toast.success(`Email sent!`)
                              if (selectedChannelSid) {
                                setConversation_sid(selectedChannelSid)
                              }
                              setTimeout(() => {
                                SendMessage(item, user)
                              }, 5);
                            }}
                          /> */
