import { type IEventInfo } from "~/futureRoutes/dashboard.calls"
import React, { type SetStateAction, type MouseEvent, type Dispatch, useState, useRef, useEffect } from "react"
import { Bookmark } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, Input, Button, Tooltip, TooltipTrigger, TooltipContent, TooltipProvider, TextArea } from "~/components/ui/index"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/components/ui/tabs"
import { cn } from "~/utils";
import { Calendar } from '~/components/ui/calendar';
import { format } from "date-fns"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue, SelectLabel } from "~/components/ui/select"
import { Flex, Text, Heading, Container, Box, Grid, TextField } from '@radix-ui/themes';
import { Link, Form, useSubmit, useFetcher } from '@remix-run/react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "~/components/ui/card"
import { Cross2Icon, CaretSortIcon, CalendarIcon, ClockIcon, ChevronDownIcon, DotsHorizontalIcon, } from "@radix-ui/react-icons";

interface IProps {

  event: IEventInfo
  user: IUser
  open: boolean
  handleClose: Dispatch<SetStateAction<void>>

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
  firstName: string;
  lastName: string;
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

const EventInfo = ({ event }) => {
  React.useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);
  let followUpDay;
  const [isButtonPressed, setIsButtonPressed] = useState(false);
  const timerRef = React.useRef(0);
  const [fUpDays, setFUpDays] = React.useState(followUpDay);

  function getFutureDate(followUpDay1: number): Date {
    const date = new Date();
    date.setDate(date.getDate() + followUpDay1);
    return date;
  }
  const data = event
  // <CallClient />
  //<SmsClient data={data} />

  const firstName = event?.firstName;
  const lastName = event?.lastName;
  const userEmail = event.userEmail;
  const brand = event?.brand;
  const email = event?.email;
  const address = event?.address;
  const appStatus = event?.apptStatus;
  const unit = event?.unit;
  const financeId = event?.financeId;

  const phone = event?.phone;
  const resourceId = event?.resourceId
  const aptId = event?.id
  const title = event?.title
  const vin = event?.vin
  const stockNum = event?.stockNum
  console.log(aptId, 'apitdi')
  /**  <div className='w-[150px] mx-auto justify-between flex'>
                        <LogCall data={data} />
                        <EmailClient data={data} setIsButtonPressed={setIsButtonPressed} isButtonPressed={isButtonPressed} />
                        <Logtext data={data} />
                      </div> */


  const now = new Date();

  const currentSecond = now.getSeconds();
  const [hour, setHour] = useState('09')
  const [min, setMin] = useState('00')
  const [sec, setSec] = useState('00');

  function capitalizeFirstLetter(string) {
    return string[0].toUpperCase() + string.slice(1);
  }

  const start = new Date(event.start);
  const end = new Date(event.end);
  const options = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip >
          <TooltipTrigger asChild>
            <div className='flex items-center cursor-pointer rounded-md w-full'>
              {event?.completed === 'yes' && (
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/a988022497f5e1f4da2fb8abae215748e34227097d0680432329fa00986efb7c?apiKey=fdb7b9e08a6a45868cbaa43480e243cd&"
                  className="w-4 mr-3"
                  alt="Logo"
                />
              )}
              <p className='  text-xs'>{capitalizeFirstLetter(event.firstName)} {capitalizeFirstLetter(event.lastName)} </p>
            </div>
          </TooltipTrigger>
          <TooltipContent className='w-[450px] bg-background border-border rounded-md '>
            <Card className="overflow-hidden text-foreground rounded-lg w-[400px] mx-auto mt-3" x-chunk="dashboard-05-chunk-4">
              <CardHeader className="items-start  bg-muted/50 ">
                <CardTitle>
                  <div className='flex items-center cursor-pointer'>
                    <Link to={`/customer/${event?.getClientFileById}/${event?.financeId}`} className='flex cursor-pointer hover:underline text-foreground'>
                      {event?.completed === 'yes' && (
                        <img
                          loading="lazy"
                          src="https://cdn.builder.io/api/v1/image/assets/TEMP/a988022497f5e1f4da2fb8abae215748e34227097d0680432329fa00986efb7c?apiKey=fdb7b9e08a6a45868cbaa43480e243cd&"
                          className="w-4 mr-2"
                          alt="Logo"
                        />)} {capitalizeFirstLetter(event.firstName)} {capitalizeFirstLetter(event.lastName)}
                    </Link>
                  </div>
                </CardTitle>
                <CardDescription>
                  {event?.title}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 flex-grow !grow overflow-y-scroll overflow-x-clip p-6 text-sm bg-background max-h-[350px] h-[350px]">
                <div className="grid gap-3">
                  <div className="font-semibold">Appointment Details</div>
                  <ul className="grid gap-3">
                    <li className="flex items-center justify-between">
                      <span className="text-[#8a8a93]">Start</span>
                      <span>{String(start.toLocaleDateString('en-US', options))}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-[#8a8a93]">End</span>
                      <span>{String(end.toLocaleDateString('en-US', options))}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-[#8a8a93]">Contact Method</span>
                      <span>{event.contactMethod}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-[#8a8a93]">Appt Status</span>
                      <span>{event.apptStatus}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-[#8a8a93]">Appt Type</span>
                      <span>{event.apptType}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-[#8a8a93]">Note</span>
                      <span>{event.note}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-[#8a8a93]">First Name</span>
                      <span>{event.firstName}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-[#8a8a93]">Last Name</span>
                      <span>{event.lastName}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-[#8a8a93]">Email</span>
                      <span>{event.email}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-[#8a8a93]">Phone</span>
                      <span>{event.phone}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-[#8a8a93]">Address</span>
                      <span>{event.address}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-[#8a8a93]">Description</span>
                      <span>{event.description}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-[#8a8a93]">Direction</span>
                      <span>{event.direction}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-[#8a8a93]">Result Of Call</span>
                      <span>{event.resultOfcall}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-[#8a8a93]">Resource Id</span>
                      <span>{event.resourceId}</span>
                    </li>

                    <li className="flex items-center justify-between">
                      <span className="text-[#8a8a93]">Exployee</span>
                      <span>{event.userName}</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );
};

export default EventInfo;

