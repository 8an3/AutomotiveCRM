import * as Tabs from '@radix-ui/react-tabs';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "~/components/ui/card"
import * as Dialog from '@radix-ui/react-dialog';
import { Link, Form, useLoadercurrentEvent, useSubmit, useFetcher } from '@remix-run/react'
import { Flex, Text, Heading, Container, Box, Grid, TextField } from '@radix-ui/themes';
import Calendar from 'react-calendar';
import { ClipboardCheck, MenuScale, Mail, MessageText, User, ArrowDown, Calendar as CalendarIcon, WebWindowClose } from "iconoir-react";
import { Input, Separator, Checkbox, PopoverTrigger, PopoverContent, Popover, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator, TextArea, Label } from '~/components/ui/index'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "~/components/ui/select"
import { Button } from "~/components/ui/button"
import React, { type SetStateAction, type MouseEvent, type Dispatch, useState, useRef, useEffect } from "react"
import MesasageContent from "../calls/messageContent";
import styled from 'styled-components';
import { type IEventInfo } from "~/routes/calendar.sales"
import { Cross2Icon } from "@radix-ui/react-icons";
import { type LinksFunction } from '@remix-run/node';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, } from "~/components/ui/accordion"
import { getSession, getSession as getToken66, commitSession as commitToken66 } from '~/sessions/auth-session.server';
import LogCall from "../calls/logCall";
import Logtext from "../calls/logText";
import EmailClient from '../calls/emailClient';


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
export default function EventInfoModal({ user, open, handleClose, onDeleteEvent, currentEvent, onCompleteEvent }: IProps) {
  React.useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);
  let followUpDay;

  // const id = currentEvent.id ? currentEvent.id.toString() : '';
  const [isButtonPressed, setIsButtonPressed] = useState(false);
  const timerRef = React.useRef(0);
  const [value, onChange] = useState<Value>(new Date());
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
    const date = new Date(); // get the current date
    date.setDate(date.getDate() + followUpDay1); // add the number of days to the current date
    return date;
  }
  const onClose = () => handleClose()

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

  return (
    <>
      <Dialog.Root open={open}  >

        <Dialog.Portal>
          <Form method='post'>
            <Dialog.Overlay className="z-25 bg-background/80 backdrop-blur-sm currentEvent-[state=open]:animate-overlayShow fixed inset-0" />
            <Dialog.Content className="z-25  currentEvent-[state=open]:animate-contentShow fixed top-[50%] left-[50%] h-[95%] overflow-y-auto  md:w-[50%] w-[100%] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-slate1 p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none text-slate12">
              <Dialog.Title className="text-mauve12 m-0 text-[17px] font-medium">
                <div className='flex items-center cursor-pointer'>
                  <Link to={`/customer/${currentEvent?.getClientFileById}/${currentEvent?.financeId}`} className='cursor-pointer hover:underline text-slate12'>
                    {currentEvent?.completed === 'yes' && (
                      <img
                        loading="lazy"
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/a988022497f5e1f4da2fb8abae215748e34227097d0680432329fa00986efb7c?apiKey=fdb7b9e08a6a45868cbaa43480e243cd&"
                        className="w-4"
                        alt="Logo"
                      />)}  {firstName} {lastName}
                  </Link>
                </div>
              </Dialog.Title>
              <Dialog.Description className="text-slate12 mt-[10px] mb-5 text-[15px] leading-normal">
                {currentEvent?.title}
              </Dialog.Description>
              <Tabs.Root className="flex flex-col w-[98%] shadow-[0_2px_10px] shadow-blackA2 rounded-md" defaultValue="Appointment"  >
                <Tabs.List className="shrink-0 flex border-b border-mauve6 rounded-t-md " aria-label="Manage your account">
                  <Tabs.Trigger
                    className="bg-white px-5 h-[45px] flex-1 flex items-center justify-center text-[15px] leading-none text-mauve11 select-none first:rounded-tl-md last:rounded-tr-md hover:text-violet11 data-[state=active]:text-violet11 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current data-[state=active]:focus:relative data-[state=active]:focus:shadow-[0_0_0_2px] data-[state=active]:focus:shadow-black outline-none cursor-default"
                    value="Appointment"
                  >
                    Appointment
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    className="bg-white px-5 h-[45px] flex-1 flex items-center justify-center text-[15px] leading-none text-mauve11 select-none first:rounded-tl-md last:rounded-tr-md hover:text-violet11 data-[state=active]:text-violet11 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current data-[state=active]:focus:relative data-[state=active]:focus:shadow-[0_0_0_2px] data-[state=active]:focus:shadow-black outline-none cursor-default"
                    value="followup"
                  >
                    Set New follow up
                  </Tabs.Trigger>
                </Tabs.List>
                <Tabs.Content
                  className="grow p-5 bg-white rounded-b-md outline-none focus:shadow-[0_0_0_2px] focus:shadow-black"
                  value="Appointment"
                >

                  <Container size="1">
                    {/* update */}
                    <div className='w-[150px] mx-auto justify-between flex'>
                      <LogCall data={data} />
                      <EmailClient data={data} setIsButtonPressed={setIsButtonPressed} isButtonPressed={isButtonPressed} />
                      <Logtext data={data} />
                    </div>
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

                      <input type="hidden" defaultValue={aptId} name="id" />
                      <input type="hidden" defaultValue='yes' name="completed" />
                      <input type="hidden" defaultValue={title} name="title" />
                      <input type="hidden" defaultValue={address} name="address" />
                      <input type="hidden" defaultValue='Completed' name="apptStatus" />
                      <Grid columns="1" gap="3" width="auto">

                        <div className='grid grid-cols-2 mt-3 items-center justify-between'>
                          <Text align='left' >Title</Text>
                          <Input name="title" defaultValue={currentEvent?.title} placeholder="Appointment Title" className='  focus:border-[#60b9fd] ' />
                        </div>

                        <div className='grid grid-cols-2 mt-3 items-center justify-between'>
                          <Text align='left' >Note</Text>
                          <Input name="note" defaultValue={currentEvent?.note} placeholder="Appointment Notes" className='  focus:border-[#60b9fd] ' />
                        </div>

                        <div className='grid grid-cols-2 mt-3 items-center justify-between'>
                          <Text align='left'>Appointment Type: {resourceId}</Text>
                          <Select name="resourceId" >
                            <SelectTrigger className="w-auto focus:border-[#60b9fd]  ">
                              <SelectValue placeholder="Type of Appointment" />
                            </SelectTrigger>
                            <SelectContent className='bg-slate1'>
                              <SelectItem value="1">Sales Calls</SelectItem>
                              <SelectItem value="2">Sales Appointments</SelectItem>
                              <SelectItem value="3">Deliveries</SelectItem>
                              <SelectItem value="4">F & I Appointments</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className='grid grid-cols-2 mt-3 items-center justify-between'>
                          <Text align='left'>Appointment Status</Text>
                          <Select name="apptStatus"
                            defaultValue={currentEvent?.apptStatus}>
                            <SelectTrigger className="w-auto focus:border-[#60b9fd] text-right">
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent className='bg-slate1'>
                              <SelectItem value="Upcoming apt">Upcoming Apt</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                              <SelectItem value="future">Showed</SelectItem>
                              <SelectItem value="noShow">No Show</SelectItem>
                              <SelectItem value="rescheduled">Rescheduled</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className='grid grid-cols-2 mt-3 items-center justify-between'>
                          <p className='text-left'>Brand</p>
                          <p className='text-right'>{brand}</p>
                        </div>

                        <div className='grid grid-cols-2 mt-3 items-center justify-between'>
                          <p className='text-left'>Model</p>
                          <p className='text-right'>{unit}</p>
                        </div>



                      </Grid>
                      <div className="mt-[25px] flex justify-end">
                        <Button name='intent' value='updateFinanceAppt' type='submit' className='bg-[#02a9ff] text-slate1 hover:text-slate12' >
                          Update
                        </Button>
                      </div>
                    </Form>
                    {/* compelte apt */}
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="item-1">
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
                            <hr className="solid dark:text-slate1" />
                            <div className="grid grid-cols-1 justify-center items-center">
                              <input type='hidden' name='intent' value='compeleteApptOnly' />
                              <div className='grid grid-cols-2 mt-3 items-center justify-between'>
                                <p className='text-left'>Result of call</p>
                                <Select name='resultOfcall'>
                                  <SelectTrigger className="w-auto  focus:border-[#60b9fd] text-right">
                                    <SelectValue placeholder="Result of call" />
                                  </SelectTrigger>
                                  <SelectContent className='bg-slate1'>
                                    <SelectItem value="Attempted">N/A</SelectItem>
                                    <SelectItem value="Reached">Reached</SelectItem>
                                    <SelectItem value="Attempted">Left Message</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className='grid grid-cols-2 mt-3 items-center justify-between'>
                                <p className='text-left'>Notes from call</p>
                                <Select name='note' defaultValue="No Answer / Left Message">
                                  <SelectTrigger className="w-auto  focus:border-[#60b9fd]">
                                    <SelectValue placeholder="Message examples" />
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
                              </div>
                              <div className='grid grid-cols-2 mt-3 items-center justify-between'>
                                <p className='text-left'> </p>
                                <Input
                                  name="note"
                                  placeholder="Custom note"
                                  className='text-right focus:border-[#60b9fd]'
                                />
                              </div>
                            </div>


                            <div className="mt-[25px] flex justify-end">
                              <Button name='intent' value='compeleteApptOnly' type='submit' className='bg-[#02a9ff] text-slate1 hover:text-slate12' >
                                Complete
                              </Button>
                            </div>
                          </Form>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-2">
                        <AccordionTrigger>
                          <Heading>Quick Appointment</Heading>
                        </AccordionTrigger>
                        <AccordionContent>
                          {/* 2 days */}
                          <Form method='post'>

                            <hr className="solid dark:text-slate1" />
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
                            <input type="hidden" defaultValue={vin} name="vin" />
                            <input type="hidden" defaultValue={stockNum} name="stockNum" />
                            <input type="hidden" defaultValue={email} name="userEmail" />
                            <input type="hidden" defaultValue={brand} name="brand" />
                            <input type='hidden' name='email' value={email} />
                            <Input type="hidden" defaultValue={brand} name="brand" />
                            <input type="hidden" defaultValue={appStatus} name="apptStatus" />
                            <input type="hidden" defaultValue={financeId} name="financeId" />
                            <div className='grid grid-cols-2 mt-3 items-center justify-between'>
                              <p> </p>
                              <Select name='followUpDay1'>
                                <SelectTrigger className="w-auto focus:border-[#60b9fd]" name='followUpDay1'>
                                  <SelectValue placeholder="Days" />
                                </SelectTrigger>
                                <SelectContent className='bg-slate1'>
                                  <SelectItem value="1">1 Day</SelectItem>
                                  <SelectItem value="2">2 Days</SelectItem>
                                  <SelectItem value="3">3 Days</SelectItem>
                                  <SelectItem value="4">4 Days</SelectItem>
                                  <SelectItem value="5">5 Days</SelectItem>
                                  <SelectItem value="6">6 Days</SelectItem>
                                  <SelectItem value="7">7 Days</SelectItem>
                                </SelectContent>
                              </Select>

                            </div>
                            <div className="mt-[25px] flex justify-end">
                              <Button name='intent' value='2DaysFromNow' type='submit' className='bg-[#02a9ff] text-slate1 hover:text-slate12' >
                                Complete
                              </Button>
                            </div>
                          </Form >
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </Container>
                </Tabs.Content>
                <Tabs.Content className="grow p-5 bg-white rounded-b-md outline-none focus:shadow-[0_0_0_2px] focus:shadow-black h-[95vh] overflow-x-scroll" value="followup"  >
                  <Text>To complete the appt and set a follow up at the same time, the following tab just compeletes the appointment.</Text>
                  <Form method="post" >

                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="item-1">
                        <AccordionTrigger>
                          <Text>Updating Completed Appointment</Text>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className='grid grid-cols-1 mx-auto w-[90%] mt-3'>

                            <Select name='resultOfcall'>
                              <SelectTrigger className="w-auto  focus:border-[#60b9fd]">
                                <SelectValue placeholder="Result of call" />
                              </SelectTrigger>
                              <SelectContent className='bg-slate1'>
                                <SelectItem value="Attempted">N/A</SelectItem>
                                <SelectItem value="Reached">Reached</SelectItem>
                                <SelectItem value="Attempted">Left Message</SelectItem>
                                <SelectItem value="Completed">Completed</SelectItem>
                                <SelectItem value="Rescheduled">Rescheduled</SelectItem>
                              </SelectContent>
                            </Select>
                            <div className='mt-3'></div>
                            <Select name='note' defaultValue="No Answer / Left Message">
                              <SelectTrigger className="w-auto  focus:border-[#60b9fd]">
                                <SelectValue placeholder="Message examples" />
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
                            <p className='mt-3'> - OR - </p>
                            <TextArea name='completedNote' placeholder='Notes from appointment' className="mt-3 mb-5" />
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-2">
                        <AccordionTrigger>
                          <Text>Creating New Appointmenmt</Text>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className='grid grid-cols-1 mx-auto w-[90%] mt-3'>
                            <Input
                              type="text"
                              name="title"
                              defaultValue={`F/U on the ${currentEvent?.unit}`}
                              className=' focus:border-[#60b9fd] '
                            />
                            <div className='mt-3'></div>
                            <Select name='contactMethod'>
                              <SelectTrigger className="w-auto focus:border-[#60b9fd]">
                                <SelectValue placeholder="Contact Method" />
                              </SelectTrigger>
                              <SelectContent className='bg-slate1'>
                                <SelectItem value="Phone">Phone</SelectItem>
                                <SelectItem value="InPerson">In-Person</SelectItem>
                                <SelectItem value="SMS">SMS</SelectItem>
                                <SelectItem value="Email">Email</SelectItem>
                              </SelectContent>
                            </Select>

                            <CalendarContainer>
                              <Calendar onChange={onChange} value={value} calendarType="gregory" />
                            </CalendarContainer>
                            <div className='mt-3'></div>

                            <Select name="timeOfDayModal">
                              <SelectTrigger className="w-auto focus:border-[#60b9fd]">
                                <SelectValue placeholder="Time of day" />
                              </SelectTrigger>
                              <SelectContent className='bg-slate1'>
                                <SelectItem value="09:00">9:00</SelectItem>
                                <SelectItem value="09:30">9:30</SelectItem>
                                <SelectItem value="10:00">10:00</SelectItem>
                                <SelectItem value="10:30">10:30</SelectItem>
                                <SelectItem value="11:00">11:00</SelectItem>
                                <SelectItem value="11:30">11:30</SelectItem>
                                <SelectItem value="12:00">12:00</SelectItem>
                                <SelectItem value="12:30">12:30</SelectItem>
                                <SelectItem value="13:00">1:00</SelectItem>
                                <SelectItem value="13:30">1:30</SelectItem>
                                <SelectItem value="14:00">2:00</SelectItem>
                                <SelectItem value="14:30">2:30</SelectItem>
                                <SelectItem value="15:00">3:00</SelectItem>
                                <SelectItem value="15:30">3:30</SelectItem>
                                <SelectItem value="16:00">4:00</SelectItem>
                                <SelectItem value="16:30">4:30</SelectItem>
                                <SelectItem value="17:00">5:00</SelectItem>
                                <SelectItem value="17:30">5:30</SelectItem>
                                <SelectItem value="18:00">6:00</SelectItem>
                              </SelectContent>
                            </Select>
                            <div className='mt-3'></div>

                            <Select name="resourceId">
                              <SelectTrigger className="w-auto focus:border-[#60b9fd]">
                                <SelectValue placeholder="Type of Appointment" />
                              </SelectTrigger>
                              <SelectContent className='bg-slate1'>
                                <SelectItem value="1">Sales Calls</SelectItem>
                                <SelectItem value="2">Sales Appointments</SelectItem>
                                <SelectItem value="3">Deliveries</SelectItem>
                                <SelectItem value="4">F & I Appointments</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

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

                          <Input type='hidden' defaultValue={value} name='dateModal' />
                          <Input type='hidden' defaultValue={value} name='followUpDay' />
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

                          <div className="mt-[25px] flex justify-end">
                            <Button
                              name='intent' value='scheduleFUp' type='submit'
                              className={` cursor-pointer ml-2 mr-2 p-3 hover:text-[#02a9ff] text-slate1 font-bold uppercase text-xs rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all text-center duration-150 ${isButtonPressed ? ' bg-green-500 ' : 'bg-[#02a9ff]'}`}
                            >
                              Complete
                            </Button>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </Form>
                </Tabs.Content>
              </Tabs.Root>
              <Dialog.Close asChild>
                <button className=" absolute right-[10px] top-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full hover:bg-violet4 focus:shadow-[0_0_0_2px] focus:shadow-violet7 focus:outline-none"
                  aria-label="Close"
                  onClick={() => onClose()}
                >
                  <Cross2Icon />
                </button>
              </Dialog.Close>
            </Dialog.Content>
          </Form>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  )
}
/**               <TabsContent value="Quick Follow-up" className='rounded-md'>
                  <Form method='post'>
                    <Heading>Quick Appointment</Heading>
                    <hr className="solid dark:text-slate1" />

                    <div className="grid grid-cols-2 justify-center items-center">
                      <select defaultValue={fUpDays} name='followUpDay1' className="mx-auto mb-3 rounded border-1  mz-1 px-2 border border-slate1 bg-[#fff] text-[#000] h-9 text-bold uppercase  placeholder-blue-300 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]"
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
                        className={`p-3 cursor-pointer ml-2 mr-2 bg-[#fff] text-[#000] font-bold uppercase text-xs rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all text-center duration-150 ${isButtonPressed ? ' bg-green-500 ' : 'bg-[#02a9ff]'}`}
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
                        className="w-auto mx-auto mt-3 rounded border-1 border-[#60b9fd] h-8 bg-[#fff] text-[#000]  shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]"
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
                          className={` cursor-pointer ml-2 mr-2 p-3 hover:text-[#02a9ff] bg-[#fff] text-[#000] font-bold uppercase text-xs rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all text-center duration-150 ${isButtonPressed ? ' bg-green-500 ' : 'bg-[#02a9ff]'}`}
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
