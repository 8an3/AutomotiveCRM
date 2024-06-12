import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "~/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import { Link, Form, useSubmit, useFetcher } from '@remix-run/react'
import { Flex, Text, Heading, Container, Box, Grid, TextField } from '@radix-ui/themes';
import { Input, Separator, Checkbox, PopoverTrigger, PopoverContent, Popover, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator, TextArea, Label } from '~/components/ui/index'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue, SelectLabel } from "~/components/ui/select"
import { Button } from "~/components/ui/button"
import React, { type SetStateAction, type MouseEvent, type Dispatch, useState, useRef, useEffect } from "react"
import MesasageContent from "../calls/messageContent";
import { Calendar } from '~/components/ui/calendar';
import { format } from "date-fns"
import { Cross2Icon, CaretSortIcon, CalendarIcon, ClockIcon, ChevronDownIcon, DotsHorizontalIcon, } from "@radix-ui/react-icons";
import styled from 'styled-components';
import { type IEventInfo } from "~/routes/calendar.sales"
import { type LinksFunction } from '@remix-run/node';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, } from "~/components/ui/accordion"
import LogCall from "../calls/logCall";
import Logtext from "../calls/logText";
import EmailClient from '../calls/emailClient';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/components/ui/tabs"
import { cn } from "~/utils";

export const links: LinksFunction = () => [{ rel: "icon", type: "image/svg", href: '/calendar.svg' },]

interface IProps {
  open: boolean
  handleClose: Dispatch<SetStateAction<void>>
  onDeleteEvent: (e: MouseEvent<HTMLButtonElement>) => void
  onCompleteEvent: (e: MouseEvent<HTMLButtonElement>) => void
  currentEvent: IEventInfo
  user: IUser

}

interface IUser {
  id: number;
  name: string;
  phone: string;
  address: string;
  email: string;
  contactMethod: string;
  start: string;
  completed: string;
  model: string;
  userEmail: string;
  unit: string;
  year: string;
  apptType: string;
  brand: string;
  note: string;
  userId: string;
  apptStatus: string;
  userName: string;
  customerState: string;
  resourceId: string;
  financeId: string;
  end: string;
  description: string;
  title: string;
  direction: string;
  resultOfcall: string;
  // Add other properties as needed
}

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

function GetIds({ request }) {

}

export default function EventInfoModal({ user, open, handleClose, onClose, currentEvent, }: IProps) {
  React.useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);
  let followUpDay;
  const [isButtonPressed, setIsButtonPressed] = useState(false);
  const timerRef = React.useRef(0);
  const userName = user.name
  const [fUpDays, setFUpDays] = React.useState(followUpDay);

  const [buttonText, setButtonText] = useState('F/U ' + fUpDays + ' days');
  const [followUpDay1, setAppointmentDate] = useState(new Date());
  function handleDropdownChange(event) {
    const followUpDay1 = Number(event.target.value);
    setButtonText('F/U ' + followUpDay1 + ' days')
    setAppointmentDate(getFutureDate(followUpDay1));
  }

  function getFutureDate(followUpDay1: number): Date {
    const date = new Date();
    date.setDate(date.getDate() + followUpDay1);
    return date;
  }
  console.log(currentEvent, 'in modal')
  const data = currentEvent
  // <CallClient />
  //<SmsClient data={data} />

  const firstName = currentEvent?.firstName;
  const lastName = currentEvent?.lastName;
  const userEmail = user.email;
  const brand = currentEvent?.brand;
  const email = currentEvent?.email;
  const address = currentEvent?.address;
  const appStatus = currentEvent?.apptStatus;
  const unit = currentEvent?.unit;
  const financeId = currentEvent?.financeId;

  const phone = currentEvent?.phone;
  const resourceId = currentEvent?.resourceId
  const aptId = currentEvent?.id
  const title = currentEvent?.title
  const vin = currentEvent?.vin
  const stockNum = currentEvent?.stockNum
  console.log(aptId, 'apitdi')
  /**  <div className='w-[150px] mx-auto justify-between flex'>
                        <LogCall data={data} />
                        <EmailClient data={data} setIsButtonPressed={setIsButtonPressed} isButtonPressed={isButtonPressed} />
                        <Logtext data={data} />
                      </div> */

  const [value, onChange] = useState<Value>(new Date());
  const [date, setDate] = useState<Date>()
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentSecond = now.getSeconds();
  const [hour, setHour] = useState('09')
  const [min, setMin] = useState('00')
  const [sec, setSec] = useState('00');
  const time = `${hour}:${min}:${sec}`
  const newDate = new Date()
  const currentTime = `${hour}:${min}:${currentSecond}`
  const [valueSelected, setValueSelected] = useState(false)
  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="w-[95%] md:w-[475px]">
          <DialogHeader>
            <DialogTitle>
              <div className='flex items-center cursor-pointer'>
                <Link to={`/customer/${currentEvent?.getClientFileById}/${currentEvent?.financeId}`} className='cursor-pointer hover:underline text-foreground'>
                  {currentEvent?.completed === 'yes' && (
                    <img
                      loading="lazy"
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/a988022497f5e1f4da2fb8abae215748e34227097d0680432329fa00986efb7c?apiKey=fdb7b9e08a6a45868cbaa43480e243cd&"
                      className="w-4"
                      alt="Logo"
                    />)}  {firstName} {lastName}
                </Link>
              </div>
            </DialogTitle>
            <DialogDescription>
              {currentEvent?.title}
            </DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="Appointment" className="w-[400px] mx-auto">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="Appointment">Appointment</TabsTrigger>
              <TabsTrigger value="Set New follow up">Set New Follow-up</TabsTrigger>
            </TabsList>
            <TabsContent value="Appointment">

              <Card className="overflow-hidden text-foreground rounded-lg" x-chunk="dashboard-05-chunk-4">
                <CardHeader className="items-start  bg-muted/50 ">
                  <CardTitle>Appointment</CardTitle>
                  <CardDescription>
                    Make changes to your appointment here. Click save when you're done.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 flex-grow !grow overflow-y-scroll overflow-x-clip p-6 text-sm bg-background max-h-[550px] h-[550px]">
                  <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>
                        <Heading>Update Appointment</Heading>
                      </AccordionTrigger>
                      <AccordionContent>
                        <Form method="post" >
                          <input type="hidden" defaultValue={financeId} name="financeId" />
                          <input type="hidden" defaultValue={unit} name="unit" />
                          <input type="hidden" defaultValue={phone} name="phone" />
                          <input type="hidden" defaultValue={unit} name="unit" />
                          <input type="hidden" defaultValue={lastName} name="lastName" />
                          <input type="hidden" defaultValue={firstName} name="firstName" />
                          <input type="hidden" defaultValue={userEmail} name="userEmail" />
                          <input type="hidden" defaultValue={vin} name="vin" />
                          <input type="hidden" defaultValue={stockNum} name="stockNum" />

                          <input type="hidden" defaultValue={aptId} name="aptId" />
                          <input type="hidden" defaultValue='yes' name="completed" />
                          <input type="hidden" defaultValue={title} name="title" />
                          <input type="hidden" defaultValue={address} name="address" />
                          <input type="hidden" defaultValue='Completed' name="apptStatus" />
                          <div className='grid grid-cols-1 mx-auto w-[90%] mt-3'>

                            <div className="relative mt-5">
                              <Input name="title" defaultValue={currentEvent?.title} className='  focus:border-primary w-[310px] bg-background' />
                              <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">Title</label>
                            </div>

                            <div className="relative mt-5">
                              <Input name="note" defaultValue={currentEvent?.note} className='  focus:border-primary  bg-background w-[310px] ' />
                              <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">Appointment Note</label>
                            </div>

                            <div className="relative mt-5">
                              <Select name="resourceId" defaultValue="1">
                                <SelectTrigger className="w-[310px] focus:border-primary  ">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className='bg-background'>
                                  <SelectItem value="1">Sales Calls</SelectItem>
                                  <SelectItem value="2">Sales Appointments</SelectItem>
                                  <SelectItem value="3">Deliveries</SelectItem>
                                  <SelectItem value="4">F & I Appointments</SelectItem>
                                </SelectContent>
                              </Select>
                              <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">Appointment Type: {resourceId}</label>
                            </div>

                            <div className="relative mt-5">
                              <Select name="apptStatus"
                                defaultValue={currentEvent?.apptStatus}>
                                <SelectTrigger className="w-[310px] focus:border-primary text-right">
                                  <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent className='bg-background'>
                                  <SelectItem value="Upcoming apt">Upcoming Apt</SelectItem>
                                  <SelectItem value="cancelled">Cancelled</SelectItem>
                                  <SelectItem value="future">Showed</SelectItem>
                                  <SelectItem value="noShow">No Show</SelectItem>
                                  <SelectItem value="rescheduled">Rescheduled</SelectItem>
                                </SelectContent>
                              </Select>
                              <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">Appointment Status</label>
                            </div>
                            <div className='grid grid-cols-2 mt-5 items-center justify-between'>
                              <p className='text-left'>Brand</p>
                              <p className='text-right'>{brand}</p>
                            </div>

                            <div className='grid grid-cols-2 mt-5 items-center justify-between'>
                              <p className='text-left'>Model</p>
                              <p className='text-right'>{unit}</p>
                            </div>
                          </div>
                          <div className="mt-[25px] flex justify-end">
                            <Button size='sm' name='intent' value='updateFinanceAppt' type='submit' className='bg-primary text-foreground hover:text-foreground' >
                              Update
                            </Button>
                          </div>
                        </Form>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                      <AccordionTrigger>
                        <Heading>Complete Appointment</Heading>
                      </AccordionTrigger>
                      <AccordionContent>
                        <Form method='post'>
                          <input type='hidden' name='intent' value='updateFinanceAppt' />
                          <input type="hidden" defaultValue={financeId} name="financeId" />
                          <input type="hidden" defaultValue={unit} name="unit" />
                          <input type="hidden" defaultValue={phone} name="phone" />
                          <input type="hidden" defaultValue={unit} name="unit" />
                          <input type="hidden" defaultValue={lastName} name="lastName" />
                          <input type="hidden" defaultValue={firstName} name="firstName" />
                          <input type="hidden" defaultValue={aptId} name="aptId" />
                          <input type="hidden" defaultValue={userEmail} name="userEmail" />
                          <input type="hidden" defaultValue={vin} name="vin" />
                          <input type="hidden" defaultValue={stockNum} name="stockNum" />
                          <hr className="solid dark:text-foreground" />
                          <div className='grid grid-cols-1 mx-auto w-[90%] mt-3'>

                            <input type='hidden' name='intent' value='compeleteApptOnly' />

                            <div className="relative mt-5">
                              <Select name='resultOfcall'>
                                <SelectTrigger className="w-[310px]  focus:border-primary text-right">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className='bg-background'>
                                  <SelectGroup>
                                    <SelectLabel>Result of call</SelectLabel>
                                    <SelectItem value="Reached">Reached</SelectItem>
                                    <SelectItem value="Attempted">N/A</SelectItem>
                                    <SelectItem value="Left Message">Left Message</SelectItem>
                                    <SelectItem value="Completed">Completed</SelectItem>
                                    <SelectItem value="Rescheduled">Rescheduled</SelectItem>
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                              <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">Result of call</label>
                            </div>

                            <div className="relative mt-5">
                              <Select name='note' defaultValue="No Answer / Left Message">
                                <SelectTrigger className="w-[310px] focus:border-primary">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className='bg-background'>
                                  <SelectItem value="">-- Moving Forward --</SelectItem>
                                  <SelectItem value="Wants to move forward, got deposit">Wants to move forward, got deposit</SelectItem>
                                  <SelectItem value="Wants to move forward, did not have credit card on him">Wants to move forward, did not have credit card on him</SelectItem>
                                  <SelectItem value="Wants to get fiannce approval before moving forward">Wants to get approval before moving forward</SelectItem>
                                  <SelectItem value="Sent BOS to sign off on">Sent BOS to sign off on deal</SelectItem>
                                  <SelectItem value="Wants to come back in to view and negotiate">Wants to come back in to view and negotiate</SelectItem>

                                  <SelectItem value="">-- Stand Still --</SelectItem>
                                  <SelectItem value="Talked to spouse, client was not home">Talked to wife, husband was not home</SelectItem>
                                  <SelectItem value="Got ahold of the client, was busy, need to call back">Got ahold of the client, was busy need to call back</SelectItem>
                                  <SelectItem value="Gave pricing, need to follow up">Gave pricing, need to follow up</SelectItem>
                                  <SelectItem value="Needs to discuss with spouse">Needs to discuss with spouse</SelectItem>
                                  <SelectItem value="No Answer / Left Message">No Answer / Left Message</SelectItem>

                                  <SelectItem value="">-- Not Moving Forward --</SelectItem>
                                  <SelectItem value="Does not want to move forward right now wants me to call in the future">Does not want to move forward right now wants me to call in the future</SelectItem>
                                  <SelectItem value="Bought else where, set to lost">Bought else where</SelectItem>
                                  <SelectItem value="Does not want to move forward, set to lost">Does not want to move forward, set to lost</SelectItem>
                                  <SelectItem value=""></SelectItem>
                                </SelectContent>
                              </Select>
                              <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">Notes from call</label>
                            </div>

                            <div className="relative mt-5">
                              <Input
                                name="note"
                                className='text-right focus:border-primary bg-background w-[310px]'
                              />
                              <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">Custom Notes from call</label>
                            </div>
                          </div>


                          <div className="mt-[25px] flex justify-end">
                            <Button name='intent' size='sm' value='compeleteApptOnly' type='submit' className='bg-primary text-foreground hover:text-foreground' >
                              Complete
                            </Button>
                          </div>
                        </Form>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                      <AccordionTrigger>
                        <Heading>Quick Complete</Heading>
                      </AccordionTrigger>
                      <AccordionContent>
                        {/* 2 days */}
                        <Form method='post'>

                          <hr className="solid dark:text-foreground" />
                          <input type='hidden' value='2DaysFromNow' name='intent' />
                          <input type="hidden" defaultValue='No' name="completed" />
                          <input type="hidden" defaultValue='Sales' name="apptType" />
                          <input type="hidden" defaultValue='Attempted' name="resultOfcall" />
                          <input type="hidden" defaultValue='Other' name="contactMethod" />
                          <input type="hidden" name="title" defaultValue={`F/U on the ${unit}`} />
                          <input type='hidden' value={firstName} name='firstName' />
                          <input type="hidden" defaultValue={resourceId} name="resourceId" />
                          <input type='hidden' value={lastName} name='lastName' />
                          <input type="hidden" defaultValue={aptId} name="aptId" />
                          <input type="hidden" defaultValue={address} name="address" />
                          <input type="hidden" defaultValue={unit} name="unit" />
                          <input type="hidden" defaultValue={vin} name="vin" />
                          <input type="hidden" defaultValue={stockNum} name="stockNum" />
                          <input type="hidden" defaultValue={email} name="userEmail" />
                          <input type="hidden" defaultValue={brand} name="brand" />
                          <input type='hidden' name='email' value={email} />
                          <Input type="hidden" defaultValue={brand} name="brand" />
                          <input type="hidden" defaultValue={appStatus} name="apptStatus" />
                          <input type="hidden" defaultValue={financeId} name="financeId" />
                          <div className='grid grid-cols-1 mx-auto w-[90%] mt-3'>

                            <div className="relative mt-3">
                              <Select name='followUpDay1' onValueChange={() => setValueSelected(true)}>
                                <SelectTrigger className="w-[310px] focus:border-primary" name='followUpDay1'>
                                  <SelectValue placeholder="" />
                                </SelectTrigger>
                                <SelectContent className='bg-background'>
                                  <SelectItem value="1">1 Day</SelectItem>
                                  <SelectItem value="2">2 Days</SelectItem>
                                  <SelectItem value="3">3 Days</SelectItem>
                                  <SelectItem value="4">4 Days</SelectItem>
                                  <SelectItem value="5">5 Days</SelectItem>
                                  <SelectItem value="6">6 Days</SelectItem>
                                  <SelectItem value="7">7 Days</SelectItem>
                                </SelectContent>
                              </Select>
                              <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">Days</label>
                            </div>

                            <div className="mt-[25px] flex justify-end">
                              <Button disabled={valueSelected === false} name='intent' size='sm' value='2DaysFromNow' type='submit' className='bg-primary text-foreground hover:text-foreground' >
                                Complete
                              </Button>
                            </div>
                          </div>

                        </Form >
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>

              </Card>
            </TabsContent>
            <TabsContent value="Set New follow up">
              <Card className="overflow-hidden text-foreground rounded-lg" x-chunk="dashboard-05-chunk-4">
                <CardHeader className="items-start  bg-muted/50 ">
                  <CardTitle>Create New Follow-up</CardTitle>
                  <CardDescription>
                    To complete the appt and set a follow up at the same time, the following tab just compeletes the appointment.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 flex-grow !grow overflow-y-scroll overflow-x-clip p-6 text-sm bg-background max-h-[550px] h-[550px]">
                  <Form method="post" >

                    <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
                      <AccordionItem value="item-1">
                        <AccordionTrigger>
                          <Text>Updating Completed Appointment</Text>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className='grid grid-cols-1 mx-auto w-[90%] mt-3'>

                            <div className="relative mt-3">
                              <Select name='resultOfcall' defaultValue="Attempted">
                                <SelectTrigger className="w-[310px]  focus:border-primary">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className='bg-background'>
                                  <SelectItem value="">N/A</SelectItem>
                                  <SelectItem value="Reached">Reached</SelectItem>
                                  <SelectItem value="Attempted">Left Message</SelectItem>
                                  <SelectItem value="Completed">Completed</SelectItem>
                                  <SelectItem value="Rescheduled">Rescheduled</SelectItem>
                                </SelectContent>
                              </Select>
                              <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">Result of call</label>
                            </div>
                            <div className='mt-3'></div>

                            <div className="relative mt-3">
                              <Select name='note' defaultValue="No Answer / Left Message">
                                <SelectTrigger className="w-[310px] focus:border-primary">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className='bg-white'>
                                  <SelectItem value="">-- Moving Forward --</SelectItem>
                                  <SelectItem value="Wants to move forward, got deposit">Wants to move forward, got deposit</SelectItem>
                                  <SelectItem value="Wants to move forward, did not have credit card on him">Wants to move forward, did not have credit card on him</SelectItem>
                                  <SelectItem value="Wants to get fiannce approval before moving forward">Wants to get approval before moving forward</SelectItem>
                                  <SelectItem value="Sent BOS to sign off on">Sent BOS to sign off on deal</SelectItem>
                                  <SelectItem value="Wants to come back in to view and negotiate">Wants to come back in to view and negotiate</SelectItem>

                                  <SelectItem value="">-- Stand Still --</SelectItem>
                                  <SelectItem value="Talked to spouse, client was not home">Talked to wife, husband was not home</SelectItem>
                                  <SelectItem value="Got ahold of the client, was busy, need to call back">Got ahold of the client, was busy need to call back</SelectItem>
                                  <SelectItem value="Gave pricing, need to follow up">Gave pricing, need to follow up</SelectItem>
                                  <SelectItem value="Needs to discuss with spouse">Needs to discuss with spouse</SelectItem>
                                  <SelectItem value="No Answer / Left Message">No Answer / Left Message</SelectItem>

                                  <SelectItem value="">-- Not Moving Forward --</SelectItem>
                                  <SelectItem value="Does not want to move forward right now wants me to call in the future">Does not want to move forward right now wants me to call in the future</SelectItem>
                                  <SelectItem value="Bought else where, set to lost">Bought else where</SelectItem>
                                  <SelectItem value="Does not want to move forward, set to lost">Does not want to move forward, set to lost</SelectItem>
                                  <SelectItem value=""></SelectItem>
                                </SelectContent>
                              </Select>
                              <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">Message examples</label>
                            </div>
                            <p className='mt-3'> - OR - </p>
                            <div className="relative mt-3">
                              <TextArea name='completedNote' className="mb-5 bg-background" />
                              <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">Notes from appointment</label>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-2">
                        <AccordionTrigger>
                          <Text>Creating New Appointmenmt</Text>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className='grid grid-cols-1 mx-auto w-[90%] mt-3'>
                            <div className="relative mt-5">
                              <Input
                                type="text"
                                name="title"
                                defaultValue={`F/U on the ${currentEvent?.unit}`}
                                className='bg-background focus:border-primary w-[310px] '
                              />
                              <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">Title</label>
                            </div>
                            <div className="relative mt-5">
                              <Select name='contactMethod' defaultValue="Email">
                                <SelectTrigger className="w-[310px]  focus:border-primary">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className='bg-background'>
                                  <SelectItem value="Phone">Phone</SelectItem>
                                  <SelectItem value="InPerson">In-Person</SelectItem>
                                  <SelectItem value="SMS">SMS</SelectItem>
                                  <SelectItem value="Email">Email</SelectItem>
                                </SelectContent>
                              </Select>
                              <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">Contact Method</label>
                            </div>

                            <Popover>
                              <PopoverTrigger asChild>
                                <div className="relative mt-3">
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full justify-start  text-center  font-normal",
                                      !date && "text-muted-foreground"
                                    )}
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4 " />
                                    {date ? format(date, "PPP") : <span>{format(newDate, "PPP")}</span>}
                                  </Button>
                                  <label className=" peer-placeholder-shown:text-gray-400 peer-focus:text-blue-500 absolute -top-3 left-3 rounded-full bg-background px-2 text-sm transition-all peer-placeholder-shown:top-2.5 peer-focus:-top-3">
                                    Pick A Date
                                  </label>
                                </div>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto bg-background p-0 text-foreground"
                                align="start"
                              >
                                <Calendar
                                  className="bg-background text-foreground"
                                  mode="single"
                                  selected={date}
                                  onSelect={setDate}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <input
                              type="hidden"
                              value={String(date)}
                              name="pickedDate"
                            />
                            <Popover>
                              <PopoverTrigger asChild>
                                <div className="relative mt-3">
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full justify-start text-right font-normal",
                                      !currentTime && "text-muted-foreground"
                                    )}
                                  >
                                    <ClockIcon className="mr-2 h-4 w-4 " />
                                    {currentTime ? time : <span>Pick a Time</span>}
                                  </Button>
                                  <label className=" peer-placeholder-shown:text-gray-400 peer-focus:text-blue-500 absolute -top-3 left-3 rounded-full bg-background px-2 text-sm transition-all peer-placeholder-shown:top-2.5 peer-focus:-top-3">
                                    Pick A Time
                                  </label>
                                </div>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto bg-background p-0 text-foreground"
                                align="start"
                              >
                                <div className="flex items-center">
                                  <Select
                                    name="pickHour"
                                    value={hour}
                                    onValueChange={setHour}
                                  >
                                    <SelectTrigger className="m-3 w-auto">
                                      <SelectValue placeholder="hour" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-background text-foreground">
                                      <SelectGroup>
                                        <SelectLabel>Hour</SelectLabel>
                                        <SelectItem value="09">09</SelectItem>
                                        <SelectItem value="10">10</SelectItem>
                                        <SelectItem value="11">11</SelectItem>
                                        <SelectItem value="12">12</SelectItem>
                                        <SelectItem value="13">13</SelectItem>
                                        <SelectItem value="14">14</SelectItem>
                                        <SelectItem value="15">15</SelectItem>
                                        <SelectItem value="16">16</SelectItem>
                                        <SelectItem value="17">17</SelectItem>
                                        <SelectItem value="18">18</SelectItem>
                                      </SelectGroup>
                                    </SelectContent>
                                  </Select>

                                  <Select
                                    name="pickMin"
                                    value={min}
                                    onValueChange={setMin}
                                  >
                                    <SelectTrigger className="m-3 w-auto">
                                      <SelectValue placeholder="min" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-background text-foreground">
                                      <SelectGroup>
                                        <SelectLabel>Minute</SelectLabel>
                                        <SelectItem value="00">00</SelectItem>
                                        <SelectItem value="10">10</SelectItem>
                                        <SelectItem value="20">20</SelectItem>
                                        <SelectItem value="30">30</SelectItem>
                                        <SelectItem value="40">40</SelectItem>
                                        <SelectItem value="50">50</SelectItem>
                                      </SelectGroup>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </PopoverContent>
                            </Popover>
                            <input type='hidden' value={String(date)} name='value' />
                            <div className="relative mt-3">
                              <Select name="resourceId" defaultValue="1">
                                <SelectTrigger className="w-[310px]  focus:border-primary">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className='bg-background'>
                                  <SelectItem value="1">Sales Calls</SelectItem>
                                  <SelectItem value="2">Sales Appointments</SelectItem>
                                  <SelectItem value="3">Deliveries</SelectItem>
                                  <SelectItem value="4">F & I Appointments</SelectItem>
                                </SelectContent>
                              </Select>
                              <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">Type of Appointment</label>
                            </div>
                          </div>

                          <Input type='hidden' value={value} name='dateModal' />
                          <Input type='hidden' value={value} name='followUpDay' />
                          <input type="hidden" defaultValue={financeId} name="financeId" />
                          <input type="hidden" defaultValue={unit} name="unit" />
                          <input type="hidden" defaultValue={phone} name="phone" />
                          <input type="hidden" defaultValue={unit} name="unit" />
                          <input type="hidden" defaultValue={lastName} name="lastName" />
                          <input type="hidden" defaultValue={firstName} name="firstName" />
                          <input type="hidden" defaultValue={aptId} name="aptId" />
                          <input type="hidden" defaultValue={userEmail} name="userEmail" />

                          <input type="hidden" defaultValue={vin} name="vin" />
                          <input type="hidden" defaultValue={stockNum} name="stockNum" />
                          <input type="hidden" defaultValue={aptId} name="id" />

                          <input type='hidden' value='scheduleFUp' name='intent' />
                          <Input type="hidden" defaultValue='future' name="apptStatus" />
                          <Input type="hidden" defaultValue='no' name="completed" />
                          <Input type="hidden" defaultValue='Sales' name="apptType" />
                          <input type='hidden' value={firstName} name='firstName' />
                          <input type='hidden' value={lastName} name='lastName' />
                          <input type="hidden" defaultValue={email} name="userEmail" />
                          <input type="hidden" defaultValue={brand} name="brand" />
                          <input type='hidden' name='email' value={email} />
                          <Input type="hidden" defaultValue={brand} name="brand" />
                          <input type="hidden" defaultValue={appStatus} name="apptStatus" />
                          <input type='hidden' name='minutes' value={min} />
                          <input type='hidden' name='hours' value={hour} />

                          <div className="mt-[25px] flex justify-end">
                            <Button
                              name='intent' value='scheduleFUp' type='submit'
                              className={` cursor-pointer ml-2 mr-2 p-3 hover:text-primary text-foreground font-bold uppercase text-xs rounded-md shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all text-center duration-150 ${isButtonPressed ? ' bg-green-500 ' : 'bg-primary'}`}
                            >
                              Complete
                            </Button>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </Form>
                </CardContent>

              </Card>
            </TabsContent>
          </Tabs>


        </DialogContent>
      </Dialog >
    </>
  )
}
/**               <TabsContent value="Quick Follow-up" className='rounded-md'>
                  <Form method='post'>
                    <Heading>Quick Appointment</Heading>
                    <hr className="solid dark:text-foreground" />

                    <div className="grid grid-cols-2 justify-center items-center">
                      <select defaultValue={fUpDays} name='followUpDay1' className="mx-auto mb-3 rounded border-1  mz-1 px-2 border border-slate1 bg-[#fff] text-[#000] h-9 text-bold uppercase  placeholder-blue-300 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-primary"
                        onChange={handleDropdownChange}>
                        <option value="">Days</option>
                        <option value="1">1 Day</option>
                        <option value="2">2 Days</option>
                        <option value="3">3 Days</option>
                        <option value="4">4 Days</option>
                        <option value="5">5 Days</option>
                        <option value="6">6 Days</option>
                        <option value="7">7 Days</option>
                      </select>
                      <input type='hidden' value='2DaysFromNow' name='intent' />
                      <input type="hidden" defaultValue='No' name="completed" />
                      <input type="hidden" defaultValue='Sales' name="apptType" />
                      <input type="hidden" defaultValue='Attempted' name="resultOfcall" />
                      <input type="hidden" defaultValue='Other' name="contactMethod" />
                      <input type="hidden" name="title" defaultValue={`F/U on the ${unit}`} />
                      <input type='hidden' value={firstName} name='firstName' />
                      <input type="hidden" defaultValue={resourceId} name="resourceId" />
                      <input type='hidden' value={lastName} name='lastName' />
                      <input type="hidden" defaultValue={aptId} name="id" />
                      <input type="hidden" defaultValue={address} name="address" />
                      <input type="hidden" defaultValue={unit} name="unit" />

                      <input type="hidden" defaultValue={email} name="userEmail" />
                      <input type="hidden" defaultValue={brand} name="brand" />
                      <input type='hidden' name='email' value={email} />
                      <Input type="hidden" defaultValue={brand} name="brand" />
                      <input type="hidden" defaultValue={appStatus} name="apptStatus" />
                      <input type="hidden" defaultValue={financeId} name="financeId" />
                      <Button variant='outline'
                        name='intent' value='2DaysFromNow' type='submit'
                        className={`p-3 cursor-pointer ml-2 mr-2 bg-[#fff] text-[#000] font-bold uppercase text-xs rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all text-center duration-150 ${isButtonPressed ? ' bg-green-500 ' : 'bg-primary'}`}
                      >
                        {buttonText}
                      </Button>



                    </div>
                  </Form >
                </TabsContent>

                <TabsContent value="completeAppt" className='rounded-md'>
                  <Form method='post'>
                    <Text>This is to just complete the apt.</Text>
                    <div className="grid grid-cols-1 justify-center items-center">
                      <input type='hidden' name='intent' value='compeleteApptOnly' />

                      <select className=" mt-5  mx-auto  bg-[#fff] text-[#000]" name='resultOfcall' >
                        <option value="">Result of call</option>
                        <option value="Reached">Reached</option>
                        <option value="Attempted">N/A</option>
                        <option value="Attempted">Left Message</option>
                      </select>
                      <MesasageContent />
                      <Input
                        name="note"
                        placeholder="Custom note"
                        className="w-auto mx-auto mt-3 rounded border-1 border-primary h-8 bg-[#fff] text-[#000]  shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-primary"
                      />
                    </div>
                    <input type="hidden" defaultValue={aptId} name="id" />
                    <input type="hidden" defaultValue='yes' name="completed" />
                    <input type="hidden" defaultValue={title} name="title" />
                    <input type="hidden" defaultValue={resourceId} name="addreresourceIdss" />
                    <input type="hidden" defaultValue={address} name="address" />
                    <input type="hidden" defaultValue='Completed' name="apptStatus" />

                    <div className="mt-[25px] flex justify-end">
                      <Dialog.Close >
                        <Button
                          onClick={() => {
                            setIsButtonPressed(true);
                          }}
                          name='intent' value='compeleteAppt' type='submit'
                          className={` cursor-pointer ml-2 mr-2 p-3 hover:text-primary bg-[#fff] text-[#000] font-bold uppercase text-xs rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all text-center duration-150 ${isButtonPressed ? ' bg-green-500 ' : 'bg-primary'}`}
                        >
                          Complete
                        </Button>
                      </Dialog.Close>
                    </div>
                  </Form>
                </TabsContent>
              </Tabs > */
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
