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
import { Input, Button, TextArea, Label } from '~/components/ui/index'
import { ClipboardCheck } from "iconoir-react";
import DateTimePicker from 'react-datetime-picker'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"

import { ScrollArea } from "~/components/ui/scroll-area"
import React, { useState } from "react";
import { Form, useLoaderData, useSubmit } from '@remix-run/react'
import MesasageContent from "./messageContent";
import DateTimeComponent from "./DateTime";
import Calendar from 'react-calendar';
import styled from 'styled-components';
import { toast } from "sonner"

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const CompleteCall = ({ data, contactMethod }) => {
  const [value, onChange] = useState<Value>(new Date());
  const [open, setOpen] = React.useState(false);
  const wait = () => new Promise((resolve) => setTimeout(resolve, 1000));

  const timerRef = React.useRef(0);
  const [date, setDate] = React.useState<Date>()
  const handleDateSelect = (selectedDate) => { setDate(selectedDate) };
  React.useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);
  const id = data.id ? data.id.toString() : '';
  const [isButtonPressed, setIsButtonPressed] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState()
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className='mx-auto cursor-pointer'>
          <ClipboardCheck className='mx-auto  text-[#fafafa] items-center justify-center hover:text-[#02a9ff] target:text-[#02a9ff]' />
        </div>
      </DialogTrigger>
      <DialogContent className="w-full md:w-[50%] bg-[#1c2024] border text-[#fafafa]  border-[#262626] h-auto">
        <DialogHeader>
          <DialogTitle>  <p className="mt-4">Schedule Follow-up</p>
          </DialogTitle>
        </DialogHeader>
        <Form method="post" >
          <div className='grid grid-cols-1 mx-auto w-[90%] '>

            <p>Updating Completed Appointment</p>
            <hr className="solid text-[#fafafa] " />
            <Select name='resultOfcall' >
              <SelectTrigger className="w-auto  focus:border-[#60b9fd] mt-3 ">
                <SelectValue placeholder="Result of call" />
              </SelectTrigger>
              <SelectContent className='bg-[#1c2024]'>
                <SelectGroup>
                  <SelectLabel>Result of call</SelectLabel>
                  <SelectItem value="Reached">Reached</SelectItem>
                  <SelectItem value="Attempted">N/A</SelectItem>
                  <SelectItem value="Attempted">Left Message</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Rescheduled">Rescheduled</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <p className='text-[#fafafa] mt-5'>Creating New Appointment</p>
            <hr className="solid text-[#fafafa]  " />

            <Input
              type="text"
              name="title"
              defaultValue={`F/U on the ${data.model}`}
              className="w-full mx-auto mt-3 rounded border border-[#262626] h-8 bg-[#1c2024] text-[#fafafa]  shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]"
            />
            <Select name='note' defaultValue="No Answer / Left Message">
              <SelectTrigger className="w-auto  focus:border-[#60b9fd] mt-3">
                <SelectValue placeholder="Message examples" />
              </SelectTrigger>
              <SelectContent className='bg-[#1c2024]'>
                <SelectGroup>
                  <SelectLabel>Message examples</SelectLabel>

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
                </SelectGroup>
              </SelectContent>
            </Select>
            <Input
              name="note"
              placeholder="or write a custom note..."
              className="w-full mx-auto mt-3 rounded border border-[#262626] h-8 bg-[#1c2024] text-[#fafafa]  shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]"
            />

            <Select name='contactMethod' defaultValue="SMS">
              <SelectTrigger className="w-auto  focus:border-[#60b9fd] mt-3">
                <SelectValue placeholder="Contact Method" />
              </SelectTrigger>
              <SelectContent className='bg-[#1c2024]'>
                <SelectGroup>
                  <SelectLabel>Contact Method</SelectLabel>
                  <SelectItem value="Phone">Phone</SelectItem>
                  <SelectItem value="In Person">In-Person</SelectItem>
                  <SelectItem value="SMS">SMS</SelectItem>
                  <SelectItem value="Email">Email</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select name='resourceId' defaultValue="1">
              <SelectTrigger className="w-auto  focus:border-[#60b9fd] mt-3">
                <SelectValue placeholder="Type of Appointment" />
              </SelectTrigger>
              <SelectContent className='bg-[#1c2024]'>
                <SelectGroup>
                  <SelectLabel>Type of Appointment</SelectLabel>
                  <SelectItem value="1">Sales Calls</SelectItem>
                  <SelectItem value="2">Sales Appointments</SelectItem>
                  <SelectItem value="3">Deliveries</SelectItem>
                  <SelectItem value="4">F & I Appointments</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <CalendarContainer>
              <Calendar onChange={onChange} value={value} calendarType="gregory" />
            </CalendarContainer>
            <Select name='timeOfDayModal' defaultValue="18:00" >
              <SelectTrigger className="w-auto  focus:border-[#60b9fd] mt-3">
                <SelectValue placeholder="Time of day" />
              </SelectTrigger>
              <SelectContent className='bg-[#1c2024]' >
                <SelectGroup>
                  <SelectLabel>Time of day</SelectLabel>
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
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <Input type='hidden' value={value} name='dateModal' />
          <Input type='hidden' value={value} name='followUpDay' />
          <input type='hidden' value={data.firstName} name='firstName' />
          <input type='hidden' value={data.lastName} name='lastName' />
          <input type='hidden' value={data.phone} name='phone' />
          <input type='hidden' value={data.email} name='email' />
          <input type='hidden' value='scheduleFUp' name='intent' />
          <Input type="hidden" defaultValue={data.userEmail} name="userEmail" />
          <Input type="hidden" defaultValue={data.id} name="financeId" />
          <Input type="hidden" defaultValue={id} name="id" />
          <Input type="hidden" defaultValue={data.brand} name="brand" />
          <Input type="hidden" defaultValue='future' name="apptStatus" />
          <Input type="hidden" defaultValue={data.model} name="unit" />
          <Input type="hidden" defaultValue='no' name="completed" />
          <Input type="hidden" defaultValue='Sales' name="apptType" />
          <input type="hidden" defaultValue={data.vin} name="vin" />
          <input type="hidden" defaultValue={data.stockNum} name="stockNum" />
          <input type='hidden' name='activixId' value={data.activixId} />

          <div className="mt-[25px] flex justify-end">
            <DialogClose >
              <Button
                onClick={() => {
                  setIsButtonPressed(true);
                  toast.message('Event has been created', {
                    description: `${value}, ${timeOfDay}`,
                  })
                }}
                name='intent' value='scheduleFUp' type='submit'
                className={` cursor-pointer ml-2 mr-2 p-3 hover:text-[#02a9ff] text-[#fafafa] font-bold uppercase text-xs rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all text-center duration-150 ${isButtonPressed ? ' bg-green-500 ' : 'bg-[#02a9ff]'}`}
              >
                Complete
              </Button>
            </DialogClose>
          </div>

        </Form>
      </DialogContent>
    </Dialog >
  )
}

export default CompleteCall
const CalendarContainer = styled.div`
  /* ~~~ container styles ~~~ */
  width: 100%;
  margin: auto;
  margin-top: 20px;
  background-color: #fff;
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
    background-color: #fff;
    border: 0;
    border-radius: 3px;
    color: #000;
    padding: 5px 0;

    &:hover {
      background-color:#60b9fd;
    }

    &:active {
      background-color: #60b9fd;
      color: #fff;
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
