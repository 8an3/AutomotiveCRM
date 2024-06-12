import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "~/components/ui/dialog"
import { Separator, Checkbox, PopoverTrigger, PopoverContent, Popover, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator, Label, Input, TextArea, ButtonLoading, } from "~/components/ui/index";
import { useLoaderData, Form, useFetcher, useLocation, useNavigation } from "@remix-run/react";
import { PhoneOutcome, MenuScale, Mail, MessageText, User, ArrowDown, Calendar as CalendarIcon, WebWindowClose, } from "iconoir-react";
import { dashboardAction, dashboardLoader } from "~/components/actions/dashboardCalls";
import Calendar from 'react-calendar';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import DialogDemo, { DateTimeComponent } from "./DateTime";
import { Flex, Text, Button, TextField, Heading } from '@radix-ui/themes';
import styles from 'react-calendar/dist/Calendar.css';
import { type LinksFunction } from "@remix-run/node";
import { Toaster, toast } from 'sonner'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/components/ui/tabs"

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
];

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

export let loader = dashboardLoader;

export default function LogText({ data }) {
  const { getTemplates, user, conversations } = useLoaderData();
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
  const [note, setnote] = useState()
  const [title, settitle] = useState(`F/U on ${data.unit}`)
  const [contactMethod, setcontactMethod] = useState('SMS')
  //const [followUpDay] = useState(value)
  const [descfup, setdescfup] = useState(false)
  const [twodayfup, settwodayfup] = useState(1)
  const [timeOfDay, settimeOfDay] = useState('18:00')
  const [firstName, setfirstName] = useState(data.firstName)
  const [lastName, setlastName] = useState(data.lastName)
  const [phone, setphone] = useState(data.phone)
  const [brand, setbrand] = useState(data.brand)
  const [unit, setunit] = useState(data.unit)
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
  const isSubmitting = navigation.formAction === "/dashboard/calls";
  const [createTemplate, setCreateTemplate] = useState('')
  const [convos, setConvos] = useState([])
  useEffect(() => {
    async function GetPreviousConversations() {

      setConvos(conversations)
      return conversations
    }
    GetPreviousConversations()

  }, [data.id]);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Text className="cursor-pointer text-black hover:text-primary target:text-primary" >
          <MessageText />
        </Text>
      </DialogTrigger>
      <DialogContent className="w-full md:w-3/4 bg-white border border-black overflow-y-scroll">
        <DialogHeader>

          <DialogDescription>
          </DialogDescription>

        </DialogHeader>

        <Tabs defaultValue="account" className="w-auto">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="account">Email</TabsTrigger>
            <TabsTrigger value="password">Prev Interactions</TabsTrigger>
          </TabsList>
          <TabsContent value="account">

            <div className='flex flex-col'>
              <fetcher.Form method="post" action='/client/sms/send'>


                <label className="mt-2 text-black w-full text-left text-[15px]" htmlFor="name">
                  Templates
                </label>
                <select
                  className={`border-black bg-white w-full text-black placeholder:text-blue-300 border justifty-start h-8 cursor-pointer rounded mb-65 px-2 text-xs uppercase shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-primary`}
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

                <Input type="hidden" defaultValue={id} name="financeId" />
                <Input type="hidden" defaultValue={text} name="body" />

                <Input type="hidden" defaultValue={descfup} name="descfup" />
                <Input type="hidden" defaultValue={twodayfup} name="twodayfup" />
                <Input type='hidden' value={timeOfDay} name='timeOfDay' />
                <Input type='hidden' value={firstName} name='firstName' />
                <Input type='hidden' value={lastName} name='lastName' />
                <Input type='hidden' value={phone} name='SMS' />
                <Input type="hidden" defaultValue={userEmail} name="userEmail" />
                <Input type="hidden" defaultValue={brand} name="brand" />
                <Input type="hidden" defaultValue={unit} name="unit" />
                <Input type="hidden" defaultValue='future' name="apptStatus" />
                <Input type="hidden" defaultValue='no' name="completed" />
                <Input type="hidden" defaultValue='Sales' name="apptType" />
                <Input type='hidden' value={email} name='email' />
                <Input type='hidden' value={userName} name='userName' />
                <Input type='hidden' value={data.id} name='userId' />
                <Input type='hidden' value={data.phone} name='phone' />

                <Input type="hidden" defaultValue={resultOfcall} name="resultOfcall" />
                <Input type="hidden" defaultValue={direction} name="direction" />
                <Input type="hidden" defaultValue='Quick F/U' name="title" />
                <Input type="hidden" defaultValue={contactMethod} name="contactMethod" />
                <Input type="hidden" defaultValue={financeId} name="financeId" />
                <Input type="hidden" defaultValue={apptStatus} name="apptStatus" />
                <Input type="hidden" defaultValue={completed} name="completed" />
                <Input type="hidden" defaultValue={apptType} name="apptType" />
                <Input type="hidden" defaultValue={userId} name="userId" />
                <Input type="hidden" defaultValue={value} name="followUpDay" />
                <Input type='hidden' value={value} name='dateModal' />

                <Input type='hidden' value={value} name='followUpDay' />

                <Input type='hidden' value={setDate} name='setDate' />
                <Input type="hidden" defaultValue={id} name="financeId" />
                <Input type="hidden" defaultValue={descfup} name="descfup" />
                <Input type="hidden" defaultValue={dateTime} name="dateTime" />
                <Input type='hidden' value={timeOfDay} name='timeOfDay' />
                <Input type='hidden' value={firstName} name='firstName' />
                <Input type='hidden' value={lastName} name='lastName' />
                <Input type='hidden' value={phone} name='phone' />
                <Input type="hidden" defaultValue={userEmail} name="userEmail" />
                <Input type="hidden" defaultValue={brand} name="brand" />
                <Input type="hidden" defaultValue={unit} name="unit" />
                <Input type="hidden" defaultValue='future' name="apptStatus" />
                <Input type="hidden" defaultValue='no' name="completed" />
                <Input type="hidden" defaultValue='Sales' name="apptType" />
                <Input type='hidden' value={email} name='email' />
                <Input type='hidden' value={userName} name='userName' />
                <Input type='hidden' value={id} name='userId' />
                <Input type="hidden" defaultValue={data.id} name="id" />
                <Input type="hidden" defaultValue={value} name="followUpDay" />


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
                    name='intent' value='textQuickFU' type='submit'
                    className={` cursor-pointer mr-2 p-3 hover:text-primary hover:border-primary text-black border border-black font-bold uppercase text-xs rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all text-center duration-150 `}

                    content="update"
                    variant="outline"
                    onClick={() =>
                      toast.success(`Sent Text to ${data.firstName}.`)
                    }
                  >
                    Send
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
                  className="w-auto cursor-pointer  hover:text-primary hover:border-primary text-black border-black"
                >
                  Save As Template
                </ButtonLoading>
              </fetcher.Form >
            </div>
          </TabsContent>
          <TabsContent value="password">
            <div className='max-h-[900px] overflow-y-scroll' >
              {convos && convos.filter(convo => convo.financeId === data.financeId).map((convo, index) => (
                <div key={index} className="m-2 mx-auto w-[95%] cursor-pointer rounded-md border-1 border-[#ffffff4d] hover:border-primary  hover:text-primary active:border-primary">
                  <p className="my-2 ml-2 text-sm text-black">
                    Sent by: {convo.userName}
                  </p>
                  <div className="m-2 flex items-center justify-between">
                    <p className="text-lg font-bold text-black">
                      {convo.direction} / {convo.type} /  {convo.result}
                    </p>
                    <p className="text-sm text-black text-right ">
                      {new Date(convo.date).toLocaleString()}
                    </p>
                  </div>
                  <p className="my-2 ml-2 text-sm text-black">
                    {convo.subject}
                  </p>

                  <p className="my-2 ml-2 text-sm text-black">
                    {convo.content}...
                  </p>

                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>


      </DialogContent >
    </Dialog >
  );
}
const CalendarContainer = styled.div`
  /* ~~~ container styles ~~~ */
  width: 90%;
  margin: auto;
  margin-top: 20px;
  background-color: #004074;
  padding: px;
  border-radius: 3px;

   /* ~~~ navigation styles ~~~ */
  .react-calendar__navigation {
    display: flex;

    .react-calendar__navigation__label {
      font-weight: bold;
    }

    .react-calendar__navigation__arrow {
      flex-grow: 0.333;
    }
  }
 /* ~~~ label styles ~~~ */
  .react-calendar__month-view__weekdays {
    text-align: center;
  }
  /* ~~~ button styles ~~~ */
  button {
    margin: 3px;
    background-color: #0077FF3A;
    border: 0;
    border-radius: 3px;
    color: #C2E6FF;
    padding: 5px 0;

    &:hover {
      background-color:#2870BD;
    }

    &:active {
      background-color: #3B9EFF;
      color: #1c2024;
    }
  }
   /* ~~~ day grid styles ~~~ */
  .react-calendar__month-view__days {
    display: grid !important;
    grid-template-columns: 14.2% 14.2% 14.2% 14.2% 14.2% 14.2% 14.2%;

    .react-calendar__tile {
      max-width: initial !important;
    }
  }
  /* ~~~ neighboring month & weekend styles ~~~ */
  .react-calendar__month-view__days__day--neighboringMonth {
    opacity: 0.7;
  }
  .react-calendar__month-view__days__day--weekend {
    color: #3B9EFF;
  }#
    /* ~~~ active day styles ~~~ */
  .react-calendar__tile--range {
      box-shadow: 0 0 6px 2px black;
  }
`;


/** follow up code             <div className="flex items-center justify-between mt-2">
              <label htmlFor='completed' className="text-sm text-left text-black">Add Quick F/U: </label>

              <Input
                type="checkbox"
                name="addFU"
                className="h-4 w-4 text-black bg-white border border-[#"

                checked={addFU === 'yes'}
                onChange={(e) => { setAddFU(addFU === 'yes' ? 'no' : 'yes') }}
              />

            </div>
            {addFU === 'yes' && (
              <div className="flex items-center justify-between">
                <select name='followUpDay2'
                  onChange={(e) => { setfollowUpDay(e) }}
                  className="mx-auto mt-2  w-1/2 h-10 rounded border-1 border-slate12 ml-2 mr-2 bg-white  text-sm text-black placeholder-blue-300 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-primary">
                  <option value="1">1 Day</option>
                  <option value="2">2 Days</option>
                  <option value="3">3 Days</option>
                  <option value="4">4 Days</option>
                  <option value="5">5 Days</option>
                  <option value="6">6 Days</option>
                  <option value="7">7 Days</option>
                </select>
                <Input type='hidden' value='textQuickFU' name='intent' />

                <DialogClose asChild>
                  <Button
                    name='intent' value='textQuickFU' type='submit'
                    className='text-black border-[#c2e6ff]'
                    content="update"
                    variant="outline"
                    onClick={() =>
                      toast.success(`Sent Text to ${data.firstName}.`)
                    }
                  >
                    Send
                  </Button>

                </DialogClose>
              </div>
            )}
            <div className="flex items-center justify-between mt-2">
              <label htmlFor='completed' className="text-sm text-left text-black">Add Detailed F/U: </label>

              <Input
                type="checkbox"
                className="h-4 w-4 text-black bg-white"
                defaultValue={addDetailedFU}
                name="addDetailedFU"
                checked={addDetailedFU === 'yes'}
                onChange={(e) => { setAddDetailedFU(addDetailedFU === 'yes' ? 'no' : 'yes') }}
              />
            </div>



          </fetcher.Form >
          <fetcher.Form method="post">
            {addDetailedFU === 'yes' && (
              <div className='mx-auto'>
                <div className="custom-date-picker">

                  <div className="grid gap-2 mx-auto">
                    <Label className='mt-2 text-black text-center ' htmlFor="area">Title</Label>
                    <Input
                      type="text"
                      name="title"
                      defaultValue={`F/U on the ${data?.unit}`}
                      className={`mx-auto w-[80%] mb-2 text-xs mt-3 h-10 cursor-pointer rounded border-1 border-primary bg-white text-black placeholder-blue-300 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-primary `}
                      onChange={(e) => { settitle(e) }}
                    />
                  </div>

                  <div className="grid gap-2 mx-auto">
                    <Label className='mt-2 text-black text-center' htmlFor="area">Note</Label>
                    <Input
                      name="note"
                      className={`mx-auto w-[80%] mb-2 text-xs mt-3 h-10 cursor-pointer rounded border-1 border-primary bg-white text-black placeholder-blue-300 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-primary `}
                      onChange={(e) => { setnote(e) }}
                    />
                  </div>
                  <div className="grid gap-2 mx-auto">
                    <select
                      onChange={(e) => { setcontactMethod(e) }}
                      name='contactMethod'
                      className={`mx-auto w-[80%] mb-2 text-xs mt-3 h-10 cursor-pointer rounded border-1 border-primary bg-white text-black placeholder-blue-300 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-primary `}>
                      <option value="">Contact Method</option>
                      <option value="Phone">Phone</option>
                      <option value="InPerson">In-Person</option>
                      <option value="SMS">SMS</option>
                      <option value="Email">Email</option>
                    </select>
                    <CalendarContainer>

                      <Calendar onChange={onChange} value={value} calendarType="gregory" />
                    </CalendarContainer>

                    <select
                      name="timeOfDayModal"
                      className={`mx-auto w-[80%] mb-2 text-xs mt-3 h-10 cursor-pointer rounded border-1 border-primary bg-white text-black placeholder-blue-300 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-primary `}>
                      <option value="Time of day">Time of day</option>
                      <option value="09:00">9:00</option>
                      <option value="09:30">9:30</option>
                      <option value="10:00">10:00</option>
                      <option value="10:30">10:30</option>
                      <option value="11:00">11:00</option>
                      <option value="11:30">11:30</option>
                      <option value="12:00">12:00</option>
                      <option value="12:30">12:30</option>
                      <option value="01:00">1:00</option>
                      <option value="01:30">1:30</option>
                      <option value="02:00">2:00</option>
                      <option value="02:30">2:30</option>
                      <option value="03:00">3:00</option>
                      <option value="03:30">3:30</option>
                      <option value="04:00">4:00</option>
                      <option value="04:30">4:30</option>
                      <option value="05:00">5:00</option>
                      <option value="05:30">5:30</option>
                      <option value="06:00">6:00</option>
                    </select>                    <div className="mt-[25px] flex justify-end">
                      <DialogClose asChild>
                        <Button
                          name='intent' value='logCallDesc' type='submit'
                          content="update"
                          variant="outline"
                          className='text-black border-[#c2e6ff]'

                          onClick={() =>
                            toast.success(`Sent Text to ${data.firstName}.`)
                          }
                        >
                          Send
                        </Button>
                      </DialogClose>
                    </div>
                  </div>
                </div>

              </div>
            )} */
