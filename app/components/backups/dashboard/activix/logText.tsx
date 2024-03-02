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
import { Separator, Checkbox, PopoverTrigger, PopoverContent, Popover, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator, Label, Input, } from "~/components/ui/index";
import { useLoaderData, Form, useFetcher, useLocation } from "@remix-run/react";
import { PhoneOutcome, MenuScale, Mail, MessageText, User, ArrowDown, Calendar as CalendarIcon, WebWindowClose, } from "iconoir-react";
import { dashboardAction, dashboardLoader } from "~/components/actions/dashboardCalls";

import React, { useEffect, useRef, useState } from 'react';

import DialogDemo, { DateTimeComponent } from "./DateTime";
import { Flex, Text, Button, TextArea, TextField, Heading } from '@radix-ui/themes';

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

export let loader = dashboardLoader;

export default function LogText({ data }) {
  const { getTemplates, user } = useLoaderData();
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

  const [value, setValue] = React.useState(new Date());
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
  const [followUpDay] = useState(value)
  const [financeId, setfinanceId] = useState(data.id)
  const [descfup, setdescfup] = useState(false)
  const [twodayfup, settwodayfup] = useState(1)
  const [timeOfDay, settimeOfDay] = useState('18:00')
  const [firstName, setfirstName] = useState(data.firstName)
  const [lastName, setlastName] = useState(data.lastName)
  const [phone, setphone] = useState(data.phone)
  const [userEmail, setuserEmail] = useState(data.userEmail)
  const [brand, setbrand] = useState(data.brand)
  const [unit, setunit] = useState(data.unit)
  const [apptStatus, setapptStatus] = useState('future')
  const [completed, setcompleted] = useState('no')
  const [apptType, setapptType] = useState('Sales')
  const [email, setemail] = useState(data.email)
  const [userName, setuserName] = useState(user.name)
  const [userId, setuserId] = useState(user?.id)
  const [id, setid] = useState(data.id)


  const setfollowUpDay = (e) => {
    const daysToAdd = parseInt(e.target.value);
    const currentDate = new Date();
    const tosetdate = currentDate.setDate(currentDate.getDate() + daysToAdd);
    settwodayfup(tosetdate)
    // Now currentDate is the date daysToAdd days from now
    // Do something with currentDate
  };
  // console.log(useState)
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Text className="cursor-pointer text-[#EEEEEE] hover:text-[#02a9ff] target:text-[#02a9ff]" >
          <MessageText />
        </Text>
      </DialogTrigger>
      <DialogContent className="w-full md:w-[50%] bg-slate1 border border-black">
        <DialogHeader>
          <DialogTitle>
            Text Client
          </DialogTitle>
          <DialogDescription>
          </DialogDescription>

        </DialogHeader>
        <div className='flex flex-col'>
          <fetcher.Form method="post" action='/client/sms/send'>


            <label className="mt-2  w-full text-left text-[15px]" htmlFor="name">
              Templates
            </label>
            <select
              className={`border-black w-full text-black placeholder:text-blue-300 broder justifty-start h-8 cursor-pointer rounded border px-2 text-xs uppercase shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]`}
              onChange={handleChange}>
              <option value="">Select a template</option>
              {templates && templates.filter(template => template.type === 'text').map((template, index) => (
                <option key={index} value={template.title}>
                  {template.title}
                </option>
              ))}
            </select>
            {selectedTemplate && (
              <div className="mt-3">
                <Text>{selectedTemplate.dept} - {selectedTemplate.type} - {selectedTemplate.category}</Text>
                {/* Add more Input fields as needed */}
              </div>
            )}

            <label className="mt-3  text-left text-[15px]" htmlFor="username">
              Message
            </label>
            <TextArea
              value={text}
              placeholder="Message body..."
              name="note"
              className="h-[200px]"
              ref={textareaRef}

              onChange={(e) => setText(e.target.value)}
            />

            <Input type="hidden" defaultValue={id} name="financeId" />
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
            <Input type="hidden" defaultValue={followUpDay} name="followUpDay" />

            <div className="flex items-center justify-between mt-2">
              <label htmlFor='completed' className="text-sm text-left">Add Quick F/U: </label>
              <TextField.Root>

                <TextField.Input placeholder="Search the docs…" />
              </TextField.Root>
              <Input
                type="checkbox"
                name="addFU"
                checked={addFU === 'yes'}
                onChange={(e) => { setAddFU(addFU === 'yes' ? 'no' : 'yes') }}
              />

            </div>
            {addFU === 'yes' && (
              <>
                <select name='followUpDay2'
                  onChange={(e) => { setfollowUpDay(e) }}
                  className="mx-auto mt-2  w-1/2 h-10 rounded border-1 border-[#60b9fd] ml-2 mr-2 bg-white  text-sm text-gray-600 placeholder-blue-300 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]">
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
                    className={`w-[75px] cursor-pointer ml-2 mr-2 text-slate1 font-bold uppercase text-xs rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all text-center duration-150 ${isButtonPressed ? ' bg-green-500 ' : 'bg-[#02a9ff]'}`}
                  >
                    Log
                  </Button>
                </DialogClose>
              </>
            )}
            <div className="flex items-center justify-between mt-2">
              <label htmlFor='completed' className="text-sm text-left">Add Detailed F/U: </label>

              <Input
                type="checkbox"
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
                    <Label className='mt-2' htmlFor="area">Title</Label>
                    <Input
                      type="text"
                      name="title"
                      defaultValue={`F/U on the ${data?.unit}`}
                      className="w-[80%] rounded border-1 border-[#60b9fd] h-8 bg-white  text-sm text-gray-600 placeholder-blue-300 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]"
                      onChange={(e) => { settitle(e) }}
                    />
                  </div>

                  <div className="grid gap-2 mx-auto">
                    <Label className='mt-2' htmlFor="area">Note</Label>
                    <Input
                      name="note"
                      className="w-[80%] rounded border-1 border-[#60b9fd] h-8 bg-white  text-sm text-gray-600 placeholder-blue-300 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]"
                      onChange={(e) => { setnote(e) }}
                    />
                  </div>
                  <div className="grid gap-2 mx-auto">
                    <select
                      onChange={(e) => { setcontactMethod(e) }}
                      name='contactMethod'
                      className='w-[80%] text-xs mt-3 h-8 cursor-pointer rounded border-1 border-[#60b9fd] bg-white text-gray-600 placeholder-blue-300 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]'>
                      <option value="">Contact Method</option>
                      <option value="Phone">Phone</option>
                      <option value="InPerson">In-Person</option>
                      <option value="SMS">SMS</option>
                      <option value="Email">Email</option>
                    </select>
                    <DateTimeComponent />
                    <div className="mt-[25px] flex justify-end">
                      <DialogClose asChild>

                        <Button

                          name='intent' value='logCallDesc' type='submit'
                          className={`w-[75px] cursor-pointer ml-2 mr-2 text-slate1 font-bold uppercase text-xs rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all text-center duration-150 ${isButtonPressed ? ' bg-green-500 ' : 'bg-[#02a9ff]'}`}
                        >
                          Log
                        </Button>
                      </DialogClose>
                    </div>
                  </div>
                </div>

              </div>
            )}
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
            <Input type="hidden" defaultValue={followUpDay} name="followUpDay" />


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

          </fetcher.Form >
        </div>


      </DialogContent >
    </Dialog >
  );
}
