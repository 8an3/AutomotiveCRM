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
import { Input, Button, Separator, Checkbox, PopoverTrigger, PopoverContent, Popover, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator, TextArea, Label, } from "~/components/ui/index";
import { useLoaderData, Form, useFetcher, useLocation } from "@remix-run/react";
import { PhoneOutcome, MenuScale, Mail, MessageText, User, ArrowDown, Calendar as CalendarIcon, WebWindowClose, } from "iconoir-react";
import { dashboardLoader } from "~/components/actions/dashboardCalls";
import React, { useEffect, useRef, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import { useRootLoaderData } from "~/hooks";
import MesasageContent from "./messageContent";


export let loader = dashboardLoader;

export default function LogCall({ data }) {
  const { user } = useRootLoaderData();
  let fetcher = useFetcher();
  const [isButtonPressed, setIsButtonPressed] = useState(false);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <p className="cursor-pointer text-black hover:text-[#02a9ff] target:text-[#02a9ff]" >
          <PhoneOutcome />
        </p>
      </DialogTrigger>
      <DialogContent className="w-full md:w-3/4 bg-white border border-black">
        <DialogHeader>
          <DialogTitle className=" text-black hover:text-[#02a9ff] target:text-[#02a9ff]">
            Log Call
          </DialogTitle>
          <DialogDescription>
          </DialogDescription>

        </DialogHeader>
        <div className='flex flex-col'>
          <Form method="post">
            <label className=" w-full mt-5 text-left text-[15px] text-black" htmlFor="name">
              Result of call
            </label>
            <Select name='resultOfcall' defaultValue="Left Message">
              <SelectTrigger className="w-[180px] text-black" >
                <SelectValue placeholder="Result of call" />
              </SelectTrigger>
              <SelectContent className="text-black bg-white">
                <SelectItem value="Reached">Reached</SelectItem>
                <SelectItem value="N/A">N/A</SelectItem>
                <SelectItem value="Left Message">Left Message</SelectItem>
              </SelectContent>
            </Select>

            <label className="mt-5  w-full text-left text-[15px] text-black" htmlFor="name">
              Direction
            </label>
            <Select

              name='direction' defaultValue="Outbound">
              <SelectTrigger className="w-[180px] text-black" >
                <SelectValue placeholder="Direction" />
              </SelectTrigger>
              <SelectContent className="text-black bg-white">
                <SelectItem value="Inbound">Inbound</SelectItem>
                <SelectItem value="Outbound">Outbound</SelectItem>
              </SelectContent>
            </Select>


            <label className="mt-5 text-black  text-left text-[15px]" htmlFor="username">
              Description of interaction, or choose from the list of pre made options.            </label>
            <TextArea
              placeholder="Breakdown of the conversation."
              name="note"
              className="h-[200px] mt-2 bg-white text-black"
            />
            <label className="mt-5 text-black w-full text-left text-[15px]" htmlFor="name">
              Sample Descriptions
            </label>
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

            <Button
              className={`border-black mt-5 ml-auto text-black border-1 cursor-pointer  mr-2 font-bold uppercase text-xs rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all text-center duration-150 ${isButtonPressed ? ' bg-green-500 ' : 'bg-white'}`}
              type="submit"
              color="violet"
              name='intent'
              value='PhoneCall'
            >
              Save
            </Button>
          </Form >
        </div>


      </DialogContent>
    </Dialog >
  );
}
