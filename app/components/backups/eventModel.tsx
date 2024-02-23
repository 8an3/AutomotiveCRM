import { Tabs, TabsContent, TabsList, TabsTrigger, } from "~/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "~/components/ui/card"
import * as Dialog from '@radix-ui/react-dialog';
import { Link, Form, useLoadercurrentEvent, useSubmit, useFetcher } from '@remix-run/react'
import { Flex, Text, Button, Heading, Container, Box, Grid } from '@radix-ui/themes';
import Calendar from 'react-calendar';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue, } from "~/other/select"
import { ClipboardCheck, MenuScale, Mail, MessageText, User, ArrowDown, Calendar as CalendarIcon, WebWindowClose } from "iconoir-react";
import { Input, Button, Separator, Checkbox, PopoverTrigger, PopoverContent, Popover, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator, TextArea, Label } from '~/components/ui/index'
import React, { type SetStateAction, type MouseEvent, type Dispatch, useState, useRef, useEffect } from "react"
import MesasageContent from "../dashboard/calls/messageContent";
import styled from 'styled-components';
import { type IEventInfo } from "./calendar.sales.tsx"

interface IProps {
  open: boolean
  handleClose: Dispatch<SetStateAction<void>>
  onDeleteEvent: (e: MouseEvent<HTMLButtonElement>) => void
  onCompleteEvent: (e: MouseEvent<HTMLButtonElement>) => void
  currentEvent: IEventInfo | null
  user: IUser
}
interface IUser {
  id: number;
  name: string;
  phone: string;
  address: string;
  email: string;
  // Add other properties as needed
}

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function EvenModal({ user, open, handleClose, onDeleteEvent, currentEvent, onCompleteEvent }: IProps) {
  React.useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);
  const id = currentEvent.id ? currentEvent.id.toString() : '';
  const [isButtonPressed, setIsButtonPressed] = useState(false);
  const timerRef = React.useRef(0);
  const [value, onChange] = useState<Value>(new Date());
  const userName = user.name
  const [buttonText, setButtonText] = useState('F/U ' + fUpDays + ' days');
  const [fUpDays, setFUpDays] = React.useState(followUpDay);
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
  const [isButtonPressed, setIsButtonPressed] = React.useState(false);
  let followUpDay;
  if (currentEvent.followUpDay < 1) followUpDay = 1;
  const [fUpDays, setFUpDays] = React.useState(followUpDay);
  const timerRef = React.useRef(0);

  return (
    <>
      <Dialog.Root open={open} onOpenChange={onClose}>
        <Dialog.Portal>
          <Form method='post'>
            <Dialog.Overlay className="z-50 bg-background/80 backdrop-blur-sm currentEvent-[state=open]:animate-overlayShow fixed inset-0" />
            <Dialog.Content className="z-50  currentEvent-[state=open]:animate-contentShow fixed top-[50%] left-[50%] h-auto w-[50%] md:w-[100%] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-slate1 p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none text-slate12">
              <Dialog.Title className="text-mauve12 m-0 text-[17px] font-medium">
                <Link to={`/customer/${currentEvent?.getClientFileById}/${currentEvent?.financeId}`} className='cursor-pointer hover:underline text-slate12'>
                  {currentEvent?.completed === 'yes' && (
                    <img
                      loading="lazy"
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/a988022497f5e1f4da2fb8abae215748e34227097d0680432329fa00986efb7c?apiKey=fdb7b9e08a6a45868cbaa43480e243cd&"
                      className="w-4"
                      alt="Logo"
                    />)}  {currentEvent?.firstName} {currentEvent?.lastName}
                </Link>
              </Dialog.Title>
              <Dialog.Description className="text-slate12 mt-[10px] mb-5 text-[15px] leading-normal">
                {currentEvent?.title}
              </Dialog.Description>
              <Tabs defaultValue="appt" className="w-[95%] mx-auto " >
                <TabsList className="grid w-full grid-cols-2 rounded-md">
                  <TabsTrigger className='rounded-md' value="appt">Appointment</TabsTrigger>

                  <TabsTrigger className='rounded-md' value="followup">Set New follow</TabsTrigger>
                  <TabsTrigger className='rounded-md' value="Quick Follow-up">Quick Follow-up</TabsTrigger>
                  <TabsTrigger className='rounded-md' value="completeAppt">Complete Appt</TabsTrigger>
                </TabsList>
                <TabsContent value="appt" className='rounded-md'>
                  <Container size="2">
                    <Grid columns="2" gap="3" width="auto">
                      <Flex gap="3" justify='between' align='center'>
                        <Text>Rep</Text>
                        <Text>{currentEvent?.userName}</Text>
                        <Text>Title</Text>
                        <Text>{currentEvent?.title}</Text>
                        <Text>Note</Text>
                        <Text>{currentEvent?.note}</Text>
                        <Text>Date</Text>
                        <Text>{currentEvent?.start}</Text>
                        <Text>Appointment Type</Text>
                        <Text>{currentEvent?.apptType}</Text>
                        <Text>Appointment Status</Text>
                        <Text>{currentEvent?.apptStatus}</Text>
                        <Separator my="3" size="4" />
                        <Text>Brand</Text>
                        <Text>{currentEvent?.brand}</Text>
                        <Text>model</Text>
                        <Text>{currentEvent?.unit}</Text>
                        <Text>Completed</Text>
                        <Text>{currentEvent?.completed}</Text>
                      </Flex>
                    </Grid>
                  </Container>
                </TabsContent>

                <TabsContent value="followup" className='rounded-md'>

                  <Text>To complete the appt and set a follow up at the same time, the following tab just compeletes the appoiontment.</Text>
                  <Form method="post" >
                    <div className='grid grid-cols-1 mx-auto w-[90%] '>
                      <input type='hidden' name='intent' value='completeApt' />


                      <Select name='resultOfcall' >
                        <SelectTrigger className=" mt-5  mx-auto  text-[#c2e6ff] bg-[#0d2847]" >
                          <SelectValue placeholder="Result of call" />
                        </SelectTrigger>
                        <SelectContent className="text-[#c2e6ff] bg-[#0d2847] mx-auto ">
                          <SelectItem value="Reached">Reached</SelectItem>
                          <SelectItem value="Attempted">N/A</SelectItem>
                          <SelectItem value="Attempted">Left Message</SelectItem>
                        </SelectContent>
                      </Select>


                      <Label className='mt-2 mx-auto text-[#333638]' htmlFor="area">Title</Label>
                      <Input
                        type="text"
                        name="title"
                        defaultValue={`F/U on the ${currentEvent.model}`}
                        className="w-[90%] mx-auto  rounded border bg-[#0d2847] border-slate12 h-8 mx-auto  text-sm mx-auto shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#131414]"
                      />
                      <Label className='mt-2 text-[#c2e6ff] text-center' htmlFor="area">Note</Label>
                      <MesasageContent />
                      <Input
                        name="note"
                        placeholder="or write a custom note"
                        className="w-[90%] mx-auto mt-3 rounded border-1 border-[#60b9fd] h-8 bg-[#0d2847] text-[#c2e6ff]   shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]"
                      />

                      <Label className='mt-2 text-[#c2e6ff] text-center' htmlFor="area">Contact Method</Label>

                      <select
                        name='contactMethod'
                        className='w-[90%]  mx-auto  text-xs h-8 mb-2 cursor-pointer rounded border-1 border-[#60b9fd] bg-[#0d2847] text-[#c2e6ff]  shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]'>
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
                        className={`mx-auto w-[90%] mb-2 text-xs mt-3 h-10 cursor-pointer rounded border-1 border-[#60b9fd] bg-[#0d2847] text-[#c2e6ff]  shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd] `}>
                        <option value="Time of day">Time of day</option>
                        <option value="09:00">9:00</option>
                        <option value="09:30">9:30</option>
                        <option value="10:00">10:00</option>
                        <option value="10:30">10:30</option>
                        <option value="11:00">11:00</option>
                        <option value="11:30">11:30</option>
                        <option value="12:00">12:00</option>
                        <option value="12:30">12:30</option>
                        <option value="13:00">1:00</option>
                        <option value="13:30">1:30</option>
                        <option value="14:00">2:00</option>
                        <option value="14:30">2:30</option>
                        <option value="15:00">3:00</option>
                        <option value="15:30">3:30</option>
                        <option value="16:00">4:00</option>
                        <option value="16:30">4:30</option>
                        <option value="17:00">5:00</option>
                        <option value="17:30">5:30</option>
                        <option value="18:00">6:00</option>
                      </select>
                    </div>


                    <Input type='hidden' value={value} name='dateModal' />

                    <Input type='hidden' value={value} name='followUpDay' />
                    <input type='hidden' value={currentEvent.firstName} name='firstName' />
                    <input type='hidden' value={currentEvent.lastName} name='lastName' />
                    <input type='hidden' value={currentEvent.phone} name='phone' />

                    <input type='hidden' value={currentEvent.email} name='email' />
                    <input type='hidden' value='scheduleFUp' name='intent' />
                    <Input type="hidden" defaultValue={currentEvent.userEmail} name="userEmail" />
                    <Input type="hidden" defaultValue={currentEvent.id} name="financeId" />
                    <Input type="hidden" defaultValue={id} name="id" />
                    <Input type="hidden" defaultValue={currentEvent.brand} name="brand" />
                    <Input type="hidden" defaultValue='future' name="apptStatus" />
                    <Input type="hidden" defaultValue={currentEvent.model} name="unit" />
                    <Input type="hidden" defaultValue='no' name="completed" />
                    <Input type="hidden" defaultValue='Sales' name="apptType" />



                    <div className="mt-[25px] flex justify-end">
                      <Dialog.Close >
                        <Button
                          onClick={() => {
                            setIsButtonPressed(true);
                          }}
                          name='intent' value='scheduleFUp' type='submit'
                          className={` cursor-pointer ml-2 mr-2 p-3 hover:text-[#02a9ff] text-slate1 font-bold uppercase text-xs rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all text-center duration-150 ${isButtonPressed ? ' bg-green-500 ' : 'bg-[#02a9ff]'}`}
                        >
                          Complete
                        </Button>
                      </Dialog.Close>
                    </div>

                  </Form>

                </TabsContent>

                <TabsContent value="Quick Follow-up" className='rounded-md'>
                  <Form method='post'>
                    <div className="flex justify-center items-center">


                      <select defaultValue={fUpDays} name='followUpDay1' className="mx-auto  rounded border-1  mz-1 px-2 border border-slate1 bg-slate12 h-9 text-bold uppercase text-slate1 placeholder-blue-300 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]"
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
                      <input type="hidden" defaultValue={currentEvent.userEmail} name="userEmail" />
                      <input type="hidden" defaultValue={currentEvent.brand} name="brand" />
                      <input type='hidden' name='financeId' value={currentEvent.id} />
                      <input type='hidden' name='email' value={currentEvent.email} />
                      <input type="hidden" defaultValue='No' name="completed" />
                      <input type="hidden" defaultValue='Outgoing' name="direction" />
                      <input type="hidden" defaultValue='Sales' name="apptType" />
                      <input type="hidden" defaultValue='Attempted' name="resultOfcall" />
                      <input type="hidden" defaultValue={currentEvent.model} name="unit" />
                      <input type="hidden" defaultValue={currentEvent.id} name="id" />
                      <input type="hidden" defaultValue={currentEvent.customerState} name="customerState" />

                      <input type="hidden" defaultValue={currentEvent.firstName} name="firstName" />
                      <input type="hidden" defaultValue={currentEvent.lastName} name="lastName" />
                      <input type="hidden" defaultValue={currentEvent.email} name="email" />
                      <input type="hidden" defaultValue={currentEvent.phone} name="phone" />
                      <input type="hidden" defaultValue={currentEvent.address} name="address" />
                      <input type="hidden" defaultValue={currentEvent.id} name="financeId" />

                      <input type="hidden" defaultValue={currentEvent.apptStatus} name="apptStatus" />
                      <input type="hidden" defaultValue='Other' name="contactMethod" />
                      <input type="hidden" name="title" defaultValue={`F/U on the ${currentEvent.model}`} />


                      <Button
                        name='intent' value='2DaysFromNow' type='submit'
                        className={`p-3 cursor-pointer ml-2 mr-2 text-slate1 font-bold uppercase text-xs rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all text-center duration-150 ${isButtonPressed ? ' bg-green-500 ' : 'bg-[#02a9ff]'}`}
                      >
                        {buttonText}
                      </Button>



                    </div>
                  </Form >
                </TabsContent>
                <TabsContent value="completeAppt" className='rounded-md'>
                  <Form method='post'>
                    <Text>This is to just complete the app.</Text>
                    <input type='hidden' name='intent' value='compeleteApptOnly' />
                    <Select name='resultOfcall' >
                      <SelectTrigger className=" mt-5  mx-auto  text-[#c2e6ff] bg-[#0d2847]" >
                        <SelectValue placeholder="Result of call" />
                      </SelectTrigger>
                      <SelectContent className="text-[#c2e6ff] bg-[#0d2847] mx-auto ">
                        <SelectItem value="Reached">Reached</SelectItem>
                        <SelectItem value="Attempted">N/A</SelectItem>
                        <SelectItem value="Attempted">Left Message</SelectItem>
                      </SelectContent>
                    </Select>


                    <Label className='mt-2 mx-auto text-[#333638]' htmlFor="area">Title</Label>
                    <Input
                      type="text"
                      name="title"
                      defaultValue={`F/U on the ${currentEvent?.unit}`}
                      className="w-[90%] mx-auto  rounded border bg-[#0d2847] border-slate12 h-8 mx-auto  text-sm mx-auto shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#131414]"
                    />
                    <Label className='mt-2 text-[#c2e6ff] text-center' htmlFor="area">Note</Label>
                    <MesasageContent />
                    <Input
                      name="note"
                      placeholder="or write a custom note"
                      className="w-[90%] mx-auto mt-3 rounded border-1 border-[#60b9fd] h-8 bg-[#0d2847] text-[#c2e6ff]   shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]"
                    />

                    <div className="mt-[25px] flex justify-end">
                      <Dialog.Close >
                        <Button
                          onClick={() => {
                            setIsButtonPressed(true);
                          }}
                          name='intent' value='compeleteAppt' type='submit'
                          className={` cursor-pointer ml-2 mr-2 p-3 hover:text-[#02a9ff] text-slate1 font-bold uppercase text-xs rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all text-center duration-150 ${isButtonPressed ? ' bg-green-500 ' : 'bg-[#02a9ff]'}`}
                        >
                          Complete
                        </Button>
                      </Dialog.Close>
                    </div>
                  </Form>
                </TabsContent>
              </Tabs >
            </Dialog.Content>
          </Form>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  )
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
