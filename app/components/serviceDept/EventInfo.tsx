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
/**   <li className="flex items-center justify-between">
                      <span className="text-[#8a8a93]">Unit</span>
                      <span>  {event.WorkOrder.unit}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-[#8a8a93]">Mileage</span>
                      <span> {event.WorkOrder.mileage && (event.WorkOrder.mileage)}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-[#8a8a93]">VIN</span>
                      <span>{event.WorkOrder.vin && (event.WorkOrder.vin)}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-[#8a8a93]">Tag</span>
                      <span>{event.WorkOrder.tag && (event.WorkOrder.tag)}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-[#8a8a93]">Motor</span>
                      <span>{event.WorkOrder.motor && (event.WorkOrder.motor)}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-[#8a8a93]">Color</span>
                      <span>{event.WorkOrder.color && (event.WorkOrder.color)}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-[#8a8a93]">Writer</span>
                      <span>{event.WorkOrder.writer}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-[#8a8a93]">Location</span>
                      <span>{event.WorkOrder.location && (event.WorkOrder.location)}</span>
                    </li> */

const EventInfo = ({ event }) => {
  return (
    <>
      <TooltipProvider>
        <Tooltip >
          <TooltipTrigger className='flex-col'>
            <p className='text-left'>{event.tech}</p>
            <p className='text-left'>{event.title}</p>
            <p className='text-left'>{event.unit}</p>
          </TooltipTrigger>
          <TooltipContent className='w-[450px] bg-background border-border rounded-[6px] '>
            <div className='flex-col'>
              <div className="items-start  bg-muted/50 border-b border-border h-10">
                <p className='text-center'>   {event.title}</p>

              </div>
              <div className="grid gap-3 m-4">
                <div className="font-semibold">Appointment Details</div>
                <ul className="grid gap-3">
                  <li className="flex items-center justify-between">
                    <span className="text-[#8a8a93]">Unit</span>
                    <span>  {event.unit}</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-[#8a8a93]">Mileage</span>
                    <span> {event.mileage && (event.mileage)}</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-[#8a8a93]">VIN</span>
                    <span>{event.vin && (event.vin)}</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-[#8a8a93]">Tag</span>
                    <span>{event.tag && (event.tag)}</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-[#8a8a93]">Motor</span>
                    <span>{event.motor && (event.motor)}</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-[#8a8a93]">Color</span>
                    <span>{event.color && (event.color)}</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-[#8a8a93]">Writer</span>
                    <span>{event.writer}</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-[#8a8a93]">Location</span>
                    <span>{event.location && (event.location)}</span>
                  </li>
                </ul>
              </div>
            </div>


          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );
};

export default EventInfo;
