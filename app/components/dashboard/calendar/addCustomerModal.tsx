import { Tabs, TabsContent, TabsList, TabsTrigger, } from "~/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "~/components/ui/card"
import * as Dialog from '@radix-ui/react-dialog';
import { Link, Form, useLoadercurrentEvent, useSubmit, useFetcher, useActionData } from '@remix-run/react'
import { Flex, Text, Heading, Container, Box, Grid } from '@radix-ui/themes';
import Calendar from 'react-calendar';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue, } from "~/components/ui/select"
import { ClipboardCheck, MenuScale, Mail, MessageText, User, ArrowDown, Calendar as CalendarIcon, WebWindowClose } from "iconoir-react";
import { Input, Button, Separator, Checkbox, PopoverTrigger, PopoverContent, Popover, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator, TextArea, Label } from '~/components/ui/index'
import React, { type SetStateAction, type MouseEvent, type Dispatch, useState, useRef, useEffect } from "react"
import MesasageContent from "../calls/messageContent";
import styled from 'styled-components';
import { type IEventInfo } from "backups/calendar.sales"
import { Cross2Icon } from "@radix-ui/react-icons";
import { useRootLoaderData } from "~/hooks/use-root-loader-data";
import { ListSelection2 } from '~/quoteUtils/listSelection'
import { CheckCircleFillIcon, AlertFillIcon } from '@primer/octicons-react'

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
  //const [formData, setFormData] = useState(initial);
  // const firstName = formData.firstName;
  //const lastName = formData.lastName;
  /**  const handleChange = (e) => {
      const { name, value, checked, type } = e.target;
      setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    }; */
  // <Input type="hidden" name="financeId" defaultValue={user.id} />
  const [brandId, setBrandId] = useState('');
  const [modelList, setModelList] = useState();

  const handleBrand = (e) => {
    setBrandId(e.target.value);
    console.log(brandId, modelList)
  };

  useEffect(() => {
    async function getData() {
      const res = await fetch(`/api/modelList/${brandId}`);
      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }
      return res.json();
    }

    if (brandId.length > 3) {
      const fetchData = async () => {
        const result = await getData();
        setModelList(result);
        console.log(brandId, result); // Log the updated result
      };
      fetchData();
    }
  }, [brandId]);

  const errors = useActionData() as Record<string, string | null>;
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    model: '',
    year: '',
  });

  const [validity, setValidity] = useState({
    firstName: undefined,
    lastName: undefined,
    email: undefined,
    phone: undefined,
    model: undefined,
    year: undefined,
  });

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(ca|com)$/;

  const validateField = (fieldName, value) => {
    switch (fieldName) {
      case 'firstName':
      case 'lastName':
      case 'model':
        return value.trim().length > 3;
      case 'email':
        return emailRegex.test(value.trim());
      case 'phone':
        return value.replace(/\D/g, '').length === 10;
      case 'year':
        return value.length === 4;
      default:
        return true; // Default to true for unknown fields
    }
  };

  const handleChange = (fieldName, value) => {
    console.log(fieldName, value)
    const isValid = validateField(fieldName, value);
    setValidity((prevValidity) => ({
      ...prevValidity,
      [fieldName]: isValid,
    }));

    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  const [modelError, SetModelError] = useState(false)

  const handleHoverSubmit = () => {
    if (String(formData.model).length < 3) (
      SetModelError(true)
    )
  }
  return (
    <>
      <Dialog.Root open={open}  >
        <Dialog.Portal>
          <Form method='post'>
            <Dialog.Overlay className="z-50 bg-[#09090b]/80 backdrop-blur-sm currentEvent-[state=open]:animate-overlayShow fixed inset-0" />
            <Dialog.Content className="z-50  currentEvent-[state=open]:animate-contentShow fixed top-[50%] left-[50%] h-auto overflow-y-
             md:w-[350px] w-[100%] translate-x-[-50%] translate-y-[-50%] rounded-[6px]   p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none border-[#27272a] bg-[#09090b] text-[#fafafa] ">
              <Dialog.Title className="text-mauve12 m-0 text-[17px] font-medium">
                Add Client
              </Dialog.Title>
              <Form method="post">
                <div className="flex flex-col mt-3 ">
                  <div className="relative mt-3">
                    <Input
                      className={`input border-[#27272a] bg-[#09090b]
                    ${validity.firstName === true ? 'border-green11 bg-green11 text-[#fafafa]' : ' '}
                    ${validity.firstName === false ? 'border-red11 bg-red11 text-[#fafafa]' : ''}
                     `}
                      onChange={(e) => handleChange('firstName', e.target.value)}
                      type="text"
                      name="firstName"
                    />
                    <label className=" text-sm absolute left-3 -top-3 px-2 rounded-full bg-[#09090b] transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">First Name</label>
                  </div>

                  {String(validity.firstName).length > 3 && validity.firstName === false && (
                    <div className="text-[#ff0202] flex items-center">
                      <AlertFillIcon size={12} />
                      <p className="mr-3">
                        First name is required.
                      </p>
                    </div>
                  )}
                  {errors?.firstName ? (
                    <p className="text-[#ff0202] flex items-center">{errors.firstName}</p>
                  ) : null}

                  <div className="relative mt-3">
                    <Input
                      className={`input border-[#27272a] bg-[#09090b]
                          ${validity.lastName === true ? 'border-green11 bg-green11 text-[#fafafa]' : ' '}
                          ${validity.lastName === false ? 'border-red11 bg-red11 text-[#fafafa]' : ''}
                           `}
                      onChange={(e) => handleChange('firstName', e.target.value)}
                      type="text"
                      name="lastName"
                    />
                    <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-[#09090b] transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Last Name</label>
                  </div>

                  {String(validity.lastName).length > 3 && validity.lastName == false && (
                    <div className="text-[#ff0202] flex items-center">
                      <AlertFillIcon size={12} />
                      <p className="mr-3">
                        Last name is required.
                      </p>
                    </div>
                  )}
                  {errors?.lastName ? (
                    <p className="text-[#ff0202] flex items-center">{errors.lastName}</p>
                  ) : null}
                  <div className="relative mt-3">
                    <Input
                      className={`input border-[#27272a] bg-[#09090b]
                    ${validity.phone === true ? 'border-green11 bg-green11 text-[#fafafa]' : ' '}
                    ${validity.phone === false ? 'border-red11 bg-red11 text-[#fafafa]' : ''}
                     `}
                      onChange={(e) => handleChange('firstName', e.target.value)}
                      type="number"
                      name="phone"
                    />
                    <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-[#09090b] transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Phone</label>
                  </div>
                  {String(validity.phone).length > 3 && validity.phone === false && (
                    <div className="text-[#ff0202] flex items-center">
                      <AlertFillIcon size={12} />
                      <p className="mr-3">
                        Phone number is not valid...
                      </p>
                    </div>
                  )}
                  {errors?.phone ? (
                    <p className="text-[#ff0202] flex items-center">{errors.phone}</p>
                  ) : null}
                  <div className="relative mt-3">
                    <Input
                      className={`input border-[#27272a] bg-[#09090b]
               ${validity.email === true ? 'border-green11 bg-green11 text-[#fafafa]' : ' '}
               ${validity.email === false ? 'border-red11 bg-red11 text-[#fafafa]' : ''}
                `}
                      onChange={(e) => handleChange('firstName', e.target.value)}
                      type="email"
                      name="email"
                    />
                    <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-[#09090b] transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Email</label>
                  </div>
                  {String(validity.email).length > 3 && validity.email === false && (
                    <div className="text-[#ff0202] flex items-center">
                      <AlertFillIcon size={12} />
                      <p className="mr-3">
                        Email is not valid...
                      </p>
                    </div>
                  )}
                  {errors?.email ? (
                    <p className="text-[#ff0202] flex items-center">{errors.email}</p>
                  ) : null}
                  <div className="relative mt-3">
                    <Input
                      className={`input border-[#27272a] bg-[#09090b]

                   `}
                      onChange={(e) => handleChange('firstName', e.target.value)}
                      type="text"
                      name="address"
                    />
                    <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-[#09090b] transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Address</label>
                  </div>
                  <div className="relative mt-3">
                    <Input
                      className={`input border-[#27272a] bg-[#09090b]

                     `}
                      onChange={(e) => handleChange('firstName', e.target.value)}
                      type="text"
                      list="ListOptions1"
                      name="brand"
                    />
                    <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-[#09090b] transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Brand</label>
                  </div>
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
                  {modelList && (
                    <>
                      <div className="relative mt-3">
                        <Input
                          className="  "
                          type="text" list="ListOptions2" name="model"
                        />
                        <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-[#09090b] transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Model</label>
                      </div>
                      <datalist id="ListOptions2">
                        {modelList.models.map((item, index) => (
                          <option key={index} value={item.model} />
                        ))}
                      </datalist>
                    </>
                  )}
                  {modelError === true && (
                    <div className="text-[#ff0202] flex items-center">
                      <AlertFillIcon size={12} />
                      <p className="mr-3">
                        Model is required.
                      </p>
                    </div>
                  )}
                  {errors?.model ? (
                    <p className="text-[#ff0202] flex items-center">{errors.model}</p>
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
                  defaultValue={`${formData.firstName}` + " " + `${formData.lastName}`}
                />
                <div className="mt-[25px] flex justify-end">
                  <Button
                    name="intent"
                    value="AddCustomer"
                    type="submit"
                    size='sm'
                    className='bg-[#dc2626]'
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
