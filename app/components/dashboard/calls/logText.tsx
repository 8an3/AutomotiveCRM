import { Input, Button, Dialog as DialogRoot, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, TextArea, Card, CardContent, CardHeader, CardFooter, CardTitle, TooltipProvider, Tooltip, TooltipTrigger, TooltipContent, } from "~/components";
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

export default function SmsClientDash({ data, searchData, openSMS, setOpenSMS, smsDetails, conversationsData, text, setText, messagesConvo }) {
  const { user, conversations, financeNotes, latestNotes, } = useLoaderData();

  console.log(
    'messagesConvo', messagesConvo,
    'smsDetails', smsDetails,
    'conversationsData', conversationsData,
    // 'conversations', conversations,
  )
  const [financeNotesList, setFinanceNoteList] = useState([])
  const [conversationsList, setConversationsList] = useState([])
  const [customer, setCustomer] = useState()
  const [customerMessages, setCustomerMessages] = useState([])
  const [conversationSid, setConversationSid] = useState('')
  const [smsInput, setSmsInput] = useState("")
  let fetcher = useFetcher();
  let formRef = useRef();
  const inputLength = smsInput.trim().length

  useEffect(() => {
    function getNotesByFinanceId(notes, financeId) {
      return notes.filter(note => note.financeId === financeId);
    }
    const filteredNotes = getNotesByFinanceId(financeNotes, data.id);
    setFinanceNoteList(filteredNotes)
    function GetConversationsByID(conversations, financeId) {
      return conversations.filter(conversation => conversation.conversationSid === financeId);
    }
    const filteredConversations = GetConversationsByID(messagesConvo, user.conversationSid);
    setConversationsList(filteredConversations)
  }, [messagesConvo]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [latestNote, setlatestNote] = useState([])
  useEffect(() => {
    setlatestNote(latestNotes[0])
  }, []);

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
                <div className='h-auto '>
                  <>
                    <Card className="overflow-hidden text-foreground w-auto mx-auto" x-chunk="dashboard-05-chunk-4 "  >
                      <CardHeader className="flex flex-row items-start bg-muted-background">
                        <div className="grid gap-0.5">
                          <CardTitle className="group flex items-center gap-2 text-lg">
                            Notes
                          </CardTitle>
                        </div>

                      </CardHeader>
                      <CardContent className="flex-grow !grow overflow-x-clip p-6 text-sm bg-background">
                        <div className="grid gap-3  ">
                          <Card className=" flex flex-col-reverse   max-h-[70vh] h-auto overflow-y-scroll  ">
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
                          </Card >
                        </div>
                      </CardContent>
                      <CardFooter className="flex flex-row items-center bg-muted-background px-6 py-3">
                        <fetcher.Form ref={formRef} method="post" className="flex w-full items-center space-x-2" >
                          <input type='hidden' name='financeId' defaultValue={data.id} />
                          <input type='hidden' name='userEmail' defaultValue={user.email} />
                          <input type='hidden' name='clientfileId' defaultValue={data.clientfileId} />
                          <input type='hidden' name='userName' defaultValue={user.name} />
                          <Input
                            id="message"
                            placeholder="Type your message..."
                            className="flex-1 bg-muted-background border-border"
                            autoComplete="off"
                            value={smsInput}
                            onChange={(event) => setSmsInput(event.target.value)}
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
                          <TooltipProvider delayDuration={0}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button size="icon" variant="outline" className="ml-auto rounded-md" onClick={() => setOpen(true)}  >
                                  <PlusIcon className="h-4 w-4" />
                                  <span className="sr-only">CC Employee</span>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent sideOffset={10} className='bg-primary'>CC Employee</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </fetcher.Form>
                      </CardFooter>
                    </Card>
                  </>
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
            value="saveFinanceNote"
            type="submit"
            name="intent"
            size="icon"
            onClick={() => {
              toast.success(`Note saved`)
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
