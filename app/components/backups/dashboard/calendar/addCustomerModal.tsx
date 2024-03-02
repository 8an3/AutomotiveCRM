import { Tabs, TabsContent, TabsList, TabsTrigger, } from "~/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "~/components/ui/card"
import * as Dialog from '@radix-ui/react-dialog';
import { Link, Form, useLoadercurrentEvent, useSubmit, useFetcher, useActionData } from '@remix-run/react'
import { Flex, Text, Heading, Container, Box, Grid } from '@radix-ui/themes';
import Calendar from 'react-calendar';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue, } from "~/other/select"
import { ClipboardCheck, MenuScale, Mail, MessageText, User, ArrowDown, Calendar as CalendarIcon, WebWindowClose } from "iconoir-react";
import { Input, Button, Separator, Checkbox, PopoverTrigger, PopoverContent, Popover, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator, TextArea, Label } from '~/components/ui/index'
import React, { type SetStateAction, type MouseEvent, type Dispatch, useState, useRef, useEffect } from "react"
import MesasageContent from "../calls/messageContent";
import styled from 'styled-components';
import { type IEventInfo } from "../../backups/calendar.sales"
import { Cross2Icon } from "@radix-ui/react-icons";
import { useRootLoaderData } from "~/hooks/use-root-loader-data";
import { ListSelection2 } from '~/routes/quoteUtils/listSelection'

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
  // Add other properties as needed
}

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function AddCustomerModal({ open, handleClose }: IProps) {
  const onClose = () => handleClose()
  const { user } = useRootLoaderData();
  const userEmail = user?.email;

  const initial = {
    firstName: "",
    lastName: "",
  };
  const [formData, setFormData] = useState(initial);
  const firstName = formData.firstName;
  const lastName = formData.lastName;
  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };
  // <Input type="hidden" name="financeId" defaultValue={user.id} />
  const [brandId, setBrandId] = useState('');

  const handleBrand = (e) => {
    setBrandId(e.target.value);
  };
  const errors = useActionData() as Record<string, string | null>;

  return (
    <>
      <Dialog.Root open={open}  >
        <Dialog.Portal>
          <Form method='post'>
            <Dialog.Overlay className="z-50 bg-background/80 backdrop-blur-sm currentEvent-[state=open]:animate-overlayShow fixed inset-0" />
            <Dialog.Content className="z-50  currentEvent-[state=open]:animate-contentShow fixed top-[50%] left-[50%] h-auto overflow-y-
             md:w-[350px] w-[100%] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-slate1 p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none text-slate12 bg-slate1">
              <Dialog.Title className="text-mauve12 m-0 text-[17px] font-medium">
                Add Client
              </Dialog.Title>
              <Form method="post">
                <div className="flex flex-col ">
                  <Input
                    className=' focus:border-[#60b9fd] mt-3'

                    placeholder="First Name (required)"
                    type="text"
                    name="firstName"
                    onChange={handleChange}
                  />
                  {errors?.firstName ? (
                    <em className="text-[#ff0202]">{errors.firstName}</em>
                  ) : null}
                  <Input
                    className=' focus:border-[#60b9fd] mt-3'
                    placeholder="Last Name (required)"
                    type="text"
                    name="lastName"
                    onChange={handleChange}
                  />
                  {errors?.lastName ? (
                    <em className="text-[#ff0202] text-right">{errors.lastName}</em>
                  ) : null}
                  <Input
                    className=' focus:border-[#60b9fd] mt-3'
                    placeholder="Phone"
                    type="number"
                    name="phone"
                  />
                  <Input
                    className=' focus:border-[#60b9fd] mt-3'
                    placeholder="Email (required)"
                    type="email"
                    name="email"
                  />
                  {errors?.email ? (
                    <em className="text-[#ff0202] text-right">{errors.email}</em>
                  ) : null}
                  <Input
                    className=' focus:border-[#60b9fd] mt-3'
                    placeholder="Address"
                    type="text"
                    name="address"
                  />
                  <Input
                    className=" mt-1 "
                    placeholder="Brand (required)"
                    type="text"
                    list="ListOptions1"
                    name="brand"
                    onChange={handleBrand}
                  />
                  <datalist id="ListOptions1">
                    <option value="BMW-Motorrad" />
                    <option value="Can-Am" />
                    <option value="Can-Am-SXS" />
                    <option value="Harley-Davidson" />
                    <option value="Indian" />
                    <option value="Kawasaki" />
                    <option value="KTM" />
                    <option value="Manitou" />
                    <option value="Sea-Doo" />
                    <option value="Switch" />
                    <option value="Ski-Doo" />
                    <option value="Suzuki" />
                    <option value="Triumph" />
                    <option value="Spyder" />
                    <option value="Yamaha" />
                  </datalist>
                  <Input className=" mt-3 " placeholder="Model" type="text" list="ListOptions" name="model" />
                  <ListSelection2 brandId={brandId} />
                  {errors?.model ? (
                    <em className="text-[#ff0202]">{errors.model}</em>
                  ) : null}
                </div>
                <Input type="hidden" name="iRate" defaultValue={10.99} />
                <Input type="hidden" name="tradeValue" defaultValue={0} />
                <Input type="hidden" name="discount" defaultValue={0} />
                <Input type="hidden" name="deposit" defaultValue={0} />
                <Input type="hidden" name="months" defaultValue={60} />
                <Input type="hidden" name="userEmail" defaultValue={userEmail} />
                <Input
                  type="hidden"
                  name="name"
                  defaultValue={`${firstName}` + " " + `${lastName}`}
                />
                <div className="mt-[25px] flex justify-end">
                  <Button
                    name="intent"
                    value="AddCustomer"
                    type="submit"

                  >
                    Add
                  </Button>
                </div>
              </Form>
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
