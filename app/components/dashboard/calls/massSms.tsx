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
import {
  SelectContent, SelectLabel, SelectGroup,
  SelectValue, Select, SelectTrigger, SelectItem,
} from "~/components"

const accountSid = 'AC9b5b398f427c9c925f18f3f1e204a8e2';
const authToken = 'd38e2fd884be4196d0f6feb0b970f63f';
//const client = twilio(accountSid, authToken);



export default function MassSMS({ data, searchData, openSMS, setOpenSMS, smsDetails, conversationsData, text, setText, messagesConvo }) {
  const { user, conversations, financeNotes, latestNotes, } = useLoaderData();

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

  }, []);
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
    <Dialog.Root   >
      <Dialog.Trigger>
        <p >Mass SMS</p>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-blackA6 data-[state=open]:animate-overlayShow fixed inset-0" />
        <Dialog.Content className=" w-[95%] md:w-[600px] h-[650px]  fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-background border border-border text-foreground p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none ">
          <TextFunction
            customerMessages={customerMessages}
            customer={customer}
            data={data}
            user={user}
            smsDetails={smsDetails}
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function TextFunction({ data, user, }) {
  const [smsInput, setSmsInput] = useState("")
  let fetcher = useFetcher();
  let formRef = useRef();
  const inputLength = smsInput.trim().length

  const [templates, setTemplates] = useState('')

  useEffect(() => {
    async function GetTemps() {
      const response = await fetch('/dealer/api/templates');
      const data = await response.json();
      setTemplates(data)
    }
    GetTemps()

  }, []);

  async function handleChange(template) {
    setSmsInput(template)
  }

  return (
    <>
      <div className="parent-container h-auto bg-background" >
        <Card className="">
          <CardContent>
            <fetcher.Form ref={formRef} method="post" className="grid grid-cols-1 w-full items-center   mt-5" >
              <input className='w-full p-2' type="hidden" name='phone' defaultValue={`+1${user.phone}`} />
              <input className='w-full p-2' type="hidden" name='intent' defaultValue='sendMessage' />
              <input className='w-full p-2' type="hidden" name='conversationSid' defaultValue={data.conversationId} />

              <input type='hidden' name='financeId' defaultValue={data.id} />
              <input type='hidden' name='userEmail' defaultValue={user.email} />
              <input type='hidden' name='clientfileId' defaultValue={data.clientfileId} />
              <input type='hidden' name='userName' defaultValue={user.name} />
              <Select name='userRole'
                onValueChange={(value) => {
                  handleChange(value); // Pass the input value directly to handleChange
                }}   >
                <SelectTrigger className="w-[400px]  bg-background text-foreground border border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className='bg-background text-foreground border border-border '>
                  <SelectGroup>
                    <SelectLabel>Templates</SelectLabel>
                    {templates && templates.map((template, index) => (
                      <SelectItem key={index} value={template.body} className="cursor-pointer bg-background capitalize text-foreground  hover:text-primary hover:underline">
                        {template.subject}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <div className="flex w-full items-center   mt-5">
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
              </div>

            </fetcher.Form>
          </CardContent>
        </Card>
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
