import {
  Dialog as RootDialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import { Separator, Checkbox, PopoverTrigger, PopoverContent, Popover, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator, Label, Input, TextArea, ButtonLoading, } from "~/components/ui/index";
import { useLoaderData, Form, useFetcher, useLocation, useNavigation } from "@remix-run/react";
import { PhoneOutcome, MenuScale, Mail, MessageText, User, ArrowDown, Calendar as CalendarIcon, WebWindowClose, } from "iconoir-react";
import { dashboardAction, dashboardLoader } from "~/components/actions/dashboardCalls";
import Calendar from 'react-calendar';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { getSession } from "~/sessions/auth-session.server";
import DialogDemo, { DateTimeComponent } from "./DateTime";
import { Flex, Text, Button, TextField, Heading } from '@radix-ui/themes';
import styles from 'react-calendar/dist/Calendar.css';
import { ActionFunction, type LinksFunction, json } from "@remix-run/node";
import { Toaster, toast } from 'sonner'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/components/ui/tabs"
import financeFormSchema from "~/overviewUtils/financeFormSchema";
import { GetUser } from "~/utils/loader.server";
import { prisma } from "~/libs";
import { model } from "../models";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles },];

type ValuePiece = Date | null;
// test
type Value = ValuePiece | [ValuePiece, ValuePiece];

export let loader = dashboardLoader;

export async function action({ request, }: ActionFunction) {
  const formPayload = Object.fromEntries(await request.formData())
  const formData = financeFormSchema.parse(formPayload);
  const session2 = await getSession(request.headers.get("Cookie"));
  const email = session2.get("email")
  const accountSid = 'AC9b5b398f427c9c925f18f3f1e204a8e2'
  const authToken = 'd38e2fd884be4196d0f6feb0b970f63f'
  const client = require('twilio')(accountSid, authToken);

  const user = await GetUser(email)
  if (!user) { redirect('/login') }
  const intent = formData.intent

  if (intent === 'getConversation') {
    const sid = formData.conversationSid
    const convoId = sid
    const GetConvo = await client.conversations.v1.conversations(convoId).messages.list({ limit: 20 })


    // console.log(GetConvo, email, 'what isa this ')
    const result = await prisma.getConversation.create({
      data: {
        jsonData: JSON.stringify(GetConvo),
        userEmail: email,
      },
    });
    return json({ result });
  }
  if (intent === 'sendMessage') {
    const sid = formData.conversationSid
    const message = formData.message
    const convoId = sid
    const phone = formData.phone
    await client.conversations.v1.conversations(convoId)
      .messages
      .create({ author: phone, body: message })
      .then(message => console.log(message.sid));
    return null
  }

  return null
}

export default function DashMsger() {
  const [data, setData] = useState()

  const { getTemplates, user, conversations, latestNotes } = useLoaderData();
  const [templates, setTemplates] = useState(getTemplates);
  // console.log(templates, 'data')
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const today = new Date();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [text, setText] = React.useState('');
  const [cc, setCc] = useState(false)
  const [bcc, setBcc] = useState(false)
  const handleChange = (event) => {
    const selectedTemplate = templates.find(template => template.title === event.target.value);
    setSelectedTemplate(selectedTemplate);
  };
  React.useEffect(() => {
    if (selectedTemplate) {
      setText(selectedTemplate.body);
    }
  }, [selectedTemplate]);

  let fetcher = useFetcher();
  const [isButtonPressed, setIsButtonPressed] = useState(false);
  const [addFU, setAddFU] = useState('no');
  const [addDetailedFU, setAddDetailedFU] = useState('no');

  const [date, setDate] = useState<Value>(new Date());
  const [time, setTime] = useState('');
  const handleDateChange = (value) => {
    setDate(value);
  };

  const handleTimeChange = (e) => {
    setTime(e.target.value);
  };

  // When you need to use the date and time:
  const dateTime = new Date(date);
  const [hours, minutes] = time.split(':').map(Number);
  dateTime.setHours(hours, minutes);

  const [resultOfcall, setresultOfcall] = useState('Left Message')
  const [direction, setdirection] = useState('Outgoing')
  const [title, settitle] = useState(`F/U on ${data.unit}`)
  const [contactMethod, setcontactMethod] = useState('SMS')
  const [descfup, setdescfup] = useState(false)
  const [firstName, setfirstName] = useState(data.firstName)
  const [lastName, setlastName] = useState(data.lastName)
  const [phone, setphone] = useState(data.phone)
  const [apptStatus, setapptStatus] = useState('future')
  const [completed, setcompleted] = useState('no')
  const [apptType, setapptType] = useState('Sales')
  const [email, setemail] = useState(data.email)
  const [userName, setuserName] = useState(user.name)
  const financeId = data.id
  const userEmail = user.email
  const id = data.id
  const userId = user.id
  const [value, onChange] = useState<Value>()//data.pickUpDate);
  // console.log(financeId, 'financeId logtezxt')

  const navigation = useNavigation();
  const isSubmitting = navigation.formAction === "/leads/sales";
  const [createTemplate, setCreateTemplate] = useState('')
  const [convos, setConvos] = useState([])
  useEffect(() => {
    async function GetPreviousConversations() {

      setConvos(conversations)
      return conversations
    }
    GetPreviousConversations()

  }, [data.id]);


  const findNoteByCustomerId = (customerId) => {
    return latestNotes.find((note) => note && note.customerId === customerId);
  };
  const [note, setNote] = useState()

  // This useEffect ensures that setNote is called only once during the component mount
  useEffect(() => {
    const foundNote = findNoteByCustomerId(data.financeId);
    //console.log(foundNote, 'foundNote');
    setNote(foundNote);
  }, [data.financeId]);
  const [buttonText, setButtonText] = useState('Send Text');

  // Inside the content of http://localhost:3000/sms/dashMsger

  // Add an event listener to listen for messages from the parent window
  useEffect(() => {

    window.addEventListener('message', (event) => {
      // Check if the message is coming from an expected source (optional)
      // In production, you might want to check the origin of the message for security reasons.

      // Assuming the expected message format is an object with a 'type' property
      if (event.data && event.data.type === 'data') {
        // Handle the received data
        const payload = event.data.payload;
        setData(payload)
        // Do something with the payload
        console.log('Received data from parent window:', payload);
      }
    });
  }, []);

  return (
    <>

      <div className='flex flex-col'>
        <fetcher.Form method="post" action='/client/sms/send'>


          <label className="mt-2 text-black w-full text-left text-[15px]" htmlFor="name">
            Templates
          </label>
          <select
            className={`border-black bg-white w-full text-black placeholder:text-blue-300 border justifty-start h-8 cursor-pointer rounded mb-65 px-2 text-xs uppercase shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]`}
            onChange={handleChange}>
            <option value="">Select a template</option>
            {templates && templates.filter(template => template.type === 'text').map((template, index) => (
              <option key={index} value={template.title}>
                {template.title}
              </option>
            ))}
          </select>


          <label className="mt-5 text-black text-left text-[15px]" htmlFor="username">
            Message
          </label>
          <TextArea
            value={text}
            placeholder="Message body..."
            name="note"
            className=" bg-white h-[300px] border-black text-black placeholder:text-black"
            ref={textareaRef}
            onChange={(e) => setText(e.target.value)}
          />
          <Input type="hidden" defaultValue={text} name="body" />
          <Input type="hidden" defaultValue={resultOfcall} name="resultOfcall" />
          <Input type="hidden" defaultValue={direction} name="direction" />
          <Input type="hidden" defaultValue='Quick F/U' name="title" />
          <Input type="hidden" defaultValue={contactMethod} name="contactMethod" />
          <Input type="hidden" defaultValue={id} name="financeId" />
          <Input type="hidden" defaultValue={descfup} name="descfup" />
          <Input type='hidden' value={firstName} name='firstName' />
          <Input type='hidden' value={lastName} name='lastName' />
          <Input type='hidden' value={phone} name='phone' />
          <Input type="hidden" defaultValue={userEmail} name="userEmail" />
          <Input type='hidden' value={email} name='email' />
          <Input type='hidden' value={userName} name='userName' />
          <Input type='hidden' value={id} name='userId' />
          <Input type="hidden" defaultValue={data.id} name="id" />
          <Input type="hidden" defaultValue={resultOfcall} name="resultOfcall" />
          <Input type="hidden" defaultValue={direction} name="direction" />
          <Input type="hidden" defaultValue={note} name="note" />
          <Input type="hidden" defaultValue={title} name="title" />
          <Input type="hidden" defaultValue={contactMethod} name="contactMethod" />
          <Input type="hidden" defaultValue={financeId} name="financeId" />
          <Input type="hidden" defaultValue={apptStatus} name="apptStatus" />
          <Input type="hidden" defaultValue={completed} name="completed" />
          <Input type="hidden" defaultValue={apptType} name="apptType" />
          <Input type="hidden" defaultValue={userId} name="userId" />
          <div className="mt-[25px] flex justify-between items-center">

            <Button
              onClick={() => {
                // setIsButtonPressed(true);
                // Change the button text
                setButtonText('Email Sent');
                toast.success(`Sent text to ${data.firstName}.`)
              }}
              name='intent'
              value='textQuickFU'
              type='submit'
              className={` cursor-pointer mr-2 p-3 hover:text-primary hover:border-primary text-black border border-black font-bold uppercase text-xs rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all text-center duration-150 ${isButtonPressed ? ' bg-green-500 ' : 'bg-primary'} `}
            >
              {buttonText}
            </Button>

            {createTemplate === 'createEmailTemplate' && (<input type='hidden' name='intent' value={createTemplate} />)}
          </div>

        </fetcher.Form >
        <fetcher.Form method='post'>
          <Input type="hidden" defaultValue={id} name="financeId" />
          <Input type="hidden" defaultValue={userId} name="userId" />
          <Input type="hidden" defaultValue={userEmail} name="userEmail" />

          <input type='hidden' name='name' value='Update new template' />
          <input type='hidden' name='body' value={text} />
          <input type='hidden' name='category' value='To opdate' />
          <input type='hidden' name='userEmail' value={user.email} />
          <input type='hidden' name='subject' value='Copied from text client' />
          <input type='hidden' name='title' value='Copied from text client' />
          <ButtonLoading
            size="lg"
            name='intent'
            value='createEmailTemplate'
            type='submit'
            isSubmitting={isSubmitting}
            onClick={() => {
              setIsButtonPressed(true);
              setCreateTemplate("createEmailTemplate")
              toast.message('Helping you become the hulk of sales...')
            }}
            loadingText="Loading..."
            className="w-auto cursor-pointer  mt-3 hover:text-primary hover:border-primary text-black border-black"
          >
            Save As Template
          </ButtonLoading>
        </fetcher.Form >
      </div>


    </>
  )
}
