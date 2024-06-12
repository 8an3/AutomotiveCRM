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
import { Input, Button, Separator, Checkbox, PopoverTrigger, PopoverContent, Popover, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator, TextArea, Label, ButtonLoading } from "~/components/ui/index";
import { useLoaderData, Form, useFetcher, useLocation, useNavigation } from "@remix-run/react";
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
import { Toaster, toast } from 'sonner'


export let loader = dashboardLoader;

export default function LogCall({ data }) {

  const { user } = useLoaderData();
  let fetcher = useFetcher();
  const [isButtonPressed, setIsButtonPressed] = useState(false);
  const financeId = data.id
  const email = data.email
  const phone = data.phone
  const firstName = data.firstName
  const lastName = data.lastName
  const id = data.id
  const userId = user.id
  const userEmail = user.email
  const userName = user.userName
  const brand = data.brand
  const unit = data.unit
  const resultOfcall = data.resultOfcall
  const direction = 'Outgoing'
  const contactMethod = 'phone'
  const note = `Called ${firstName}.`
  const title = `Called ${firstName}.`
  const navigation = useNavigation();
  const isSubmitting = navigation.formAction === "/leads/sales";
  return (
    <Form method='post' >

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
      <Input type="hidden" defaultValue={userId} name="userId" />
      <Input type="hidden" defaultValue={id} name="financeId" />
      <Input type="hidden" defaultValue={note} name="note" />
      <Input type="hidden" defaultValue={title} name="title" />
      <Input type="hidden" value='Attempted' name="result" />
      <input type='hidden' name='activixId' value={data.activixId} />

      <button
        onClick={() => {
          // setIsButtonPressed(true);
          // Change the button text
          toast.success(`Calling ${data.firstName}...`)
        }}
        isSubmitting={isSubmitting}

        name='intent'
        value='callClient'
        type='submit'

      >
        <p className="cursor-pointer text-foreground hover:text-primary target:text-primary" >
          <PhoneOutcome />
        </p>
      </button>
    </Form>
  );
}



/**import {
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
        <p className="cursor-pointer text-foreground hover:text-primary target:text-primary" >
          <PhoneOutcome />
        </p>
      </DialogTrigger>
      <DialogContent className="w-full md:w-3/4 bg-white border border-black">
        <DialogHeader>
          <DialogTitle className=" text-black hover:text-primary target:text-primary">
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
              <SelectTrigger className="w-auto  focus:border-primary">
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
 */
