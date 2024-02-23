import * as Dialog from "@radix-ui/react-dialog";
import { Input, Button, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator, TextArea, Label, } from "~/components/ui/index";
import { Form } from "@remix-run/react";
import { PhoneOutcome, MenuScale, Mail, MessageText, User, ArrowDown, Calendar as CalendarIcon, WebWindowClose, } from "iconoir-react";
import { dashboardLoader } from "~/components/actions/dashboardCalls";
import React, { useEffect, useRef, useState } from 'react';
import Calendar from 'react-calendar';

export let loader = dashboardLoader;

export default function AddAppt({ data }) {
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

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild >
        <p className="cursor-pointer ml-auto mr 2 ">
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 2.75C8 2.47386 7.77614 2.25 7.5 2.25C7.22386 2.25 7 2.47386 7 2.75V7H2.75C2.47386 7 2.25 7.22386 2.25 7.5C2.25 7.77614 2.47386 8 2.75 8H7V12.25C7 12.5261 7.22386 12.75 7.5 12.75C7.77614 12.75 8 12.5261 8 12.25V8H12.25C12.5261 8 12.75 7.77614 12.75 7.5C12.75 7.22386 12.5261 7 12.25 7H8V2.75Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
        </p>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-blackA6 data-[state=open]:animate-overlayShow fixed inset-0" />
        <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] h-[650px] w-[400px]  translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
          <Dialog.Title className="text-mauve12 m-0 text-[17px] font-medium">
            Add Appointment
          </Dialog.Title>
          <Dialog.Description className="text-mauve11 mt-[10px] mb-5 text-[15px] leading-normal">
          </Dialog.Description>
          <Form method="post" >
            <div className='flex '>

              <div className='mx-auto justify-center items-center'>
                <Calendar onChange={onChange} value={value} calendarType="gregory" />
                <select
                  name="timeOfDay" defaultValue="Time of day"
                  className={` w-[80%] text-xs mt-3 h-8 cursor-pointer rounded border-1 border-[#60b9fd] bg-white text-gray-600 placeholder-blue-300 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd] `}>
                  <option value="">Time of day</option>
                  <option value="9:00">9:00</option>
                  <option value="9:30">9:30</option>
                  <option value="10:00">10:00</option>
                  <option value="10:30">10:30</option>
                  <option value="11:00">11:00</option>
                  <option value="11:30">11:30</option>
                  <option value="12:00">12:00</option>
                  <option value="12:30">12:30</option>
                  <option value="1:00">1:00</option>
                  <option value="1:30">1:30</option>
                  <option value="2:00">2:00</option>
                  <option value="2:30">2:30</option>
                  <option value="3:00">3:00</option>
                  <option value="3:30">3:30</option>
                  <option value="4:00">4:00</option>
                  <option value="4:30">4:30</option>
                  <option value="5:00">5:00</option>
                  <option value="5:30">5:30</option>
                  <option value="6:00">6:00</option>
                </select>

                <div className="grid gap-2">
                  <Label className='mt-2' htmlFor="area">Title</Label>
                  <Input
                    type="text"
                    name="title"
                    defaultValue={`F/U ${data.name} on the ${data.model}`}
                    className="w-[80%] rounded border-1 border-[#60b9fd] h-8 bg-white  text-sm text-gray-600 placeholder-blue-300 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]"
                  />
                </div>

                <div className="grid gap-2">
                  <Label className='mt-2' htmlFor="area">Note</Label>
                  <Input
                    name="note"
                    className="w-[80%] rounded border-1 border-[#60b9fd] h-8 bg-white  text-sm text-gray-600 placeholder-blue-300 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]"
                  />
                </div>
                <div className="grid gap-2">
                  <select
                    name='contactMethod'
                    className='w-[80%] text-xs mt-3 h-8 cursor-pointer rounded border-1 border-[#60b9fd] bg-white text-gray-600 placeholder-blue-300 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]'>
                    <option value="">Contact Method</option>
                    <option value="Phone">Phone</option>
                    <option value="InPerson">In-Person</option>
                    <option value="SMS">SMS</option>
                    <option value="Email">Email</option>
                  </select>
                </div>
              </div>

            </div>
            <Input type='hidden' value={value} name='date' />
            <input type='hidden' value={data.firstName} name='firstName' />
            <input type='hidden' value={data.lastName} name='lastName' />
            <input type='hidden' value={data.email} name='email' />
            <Input type="hidden" defaultValue={data.userEmail} name="userEmail" />
            <Input type="hidden" defaultValue={data.id} name="financeId" />
            <Input type="hidden" defaultValue={id} name="id" />
            <Input type="hidden" defaultValue={data.brand} name="brand" />
            <Input type="hidden" defaultValue='TBD' name="apptStatus" />
            <Input type="hidden" defaultValue={data.model} name="unit" />
            <Input type="hidden" defaultValue='no' name="completed" />
            <div className="mt-[25px] flex justify-end">
              <Button
                name='intent' value='addAppt' type='submit'
                className={`w-[75px] ml-2 mr-2 text-slate1 font-bold uppercase text-xs rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all text-center duration-150 ${isButtonPressed ? ' bg-green-500 ' : 'bg-[#02a9ff]'}`}
              >
                Add
              </Button>
              <Dialog.Close>
              </Dialog.Close>
            </div>
          </Form>
          <Dialog.Close asChild>
            <button className=" hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
              aria-label="Close"  >
              <WebWindowClose />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
