/* eslint-disable tailwindcss/classnames-order */
/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useRef, useState } from "react";
import { Form, Link, useActionData, useFetcher, useLoaderData, useSubmit, useTransition, } from "@remix-run/react";
import { RemixNavLink, Input, Separator, Button, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, TextArea, Label, } from "~/components";
import * as Toolbar from "@radix-ui/react-toolbar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "~/other/card";
import * as Dialog from "@radix-ui/react-dialog";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { toast } from "sonner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"


export default function FinanceNotes() {
  const { finance, user, financeNotes, userList } = useLoaderData();
  const [formData, setFormData] = useState({
    customContent: "",
    urgentFinanceNote: "",
    none: finance[0].urgentFinanceNote,
    soon: finance[0].urgentFinanceNote,
    asap: finance[0].urgentFinanceNote,
    dropEverything: finance[0].urgentFinanceNote,
  });
  //console.log(formData)
  const [editItemId, setEditItemId] = useState(null);

  const handleEditClick = (itemId) => {
    setEditItemId(itemId);
  };

  const handleSave = (itemId) => {
    return null;
  };

  const fetcher = useFetcher();
  let transition = useTransition();
  let isDeleting =
    fetcher.state === "submitting" &&
    fetcher.formData?.get("intent") === "deleteFinanceNote";
  let isAdding =
    fetcher.state === "submitting" &&
    fetcher.formData?.get("intent") === "saveFinanceNote";
  let isEditing =
    transition.state === "submitting" &&
    fetcher.formData?.get("intent") === "editFinanceNote";

  let formRef = useRef();

  useEffect(() => {
    if (!isAdding) {
      formRef.current?.reset();
    }
  }, [isAdding]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const submit = useSubmit();

  let urgentFinanceNoteList = [
    { label: 'None', value: 'none', name: 'none', },
    { label: 'Get Done Soon', value: 'soon', name: 'soon', },
    { label: 'ASAP', value: 'asap', name: 'asap', },
    { label: 'Drop Everything', value: 'dropEverything', name: 'dropEverything', },
  ]

  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target
    let newValue = value
    if (type === 'checkbox') {
      newValue = checked ? value : 0
    }
    setFormData((prevData) => ({ ...prevData, [name]: newValue }))
  }

  return (
    <div className="flex-auto px-4 lg:px-10 py-10 pt-0 bg-slate11">
      <div className="relative mx-3 mt-3 max-h-[800px] h-auto overflow-y-auto">
        <ul>
          {financeNotes.map((message) => (
            <li
              key={message.id}
              style={{
                opacity: isDeleting ? 0.5 : 1,
              }}
              className="flex-cols-2 flex "
            >
              <Card //className="mr-1 mt-1 w-full rounded-[0px]"

                className={`w-full rounded mt-2 bg-slate12 text-sm text-gray-300 placeholder-blue-600 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#02a9ff] ${message.urgentFinanceNote === 'soon'
                  ? 'border-green-500 border:w-[5px] '
                  : message.urgentFinanceNote === 'asap'
                    ? 'border-yellow-500 border:w-[4px]  bg-yellow-200'
                    : message.urgentFinanceNote === 'dropEverything'
                      ? 'border-red-500 border:w-[3px]   bg-red-300'
                      : ''
                  }`}
              >
                <CardContent className="flex flex-col"

                >
                  <div className="mt-3 flex justify-between">
                    <p className="">
                      {message.author}
                    </p>
                    <button className='h-4 w-8' />
                    <p className="">
                      {new Date(message.createdAt).toLocaleDateString()}{" "}
                      {new Date(message.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                  {editItemId === message.id ? (
                    <TextArea
                      placeholder="Type your message here."
                      key={message.id}
                      name="customContent"
                      className="w-full mt-2 h-[50px] rounded-[0px]"
                      defaultValue={message.customContent}
                      onChange={handleChange}
                    />
                  ) : (
                    <p className="  text-left ">
                      {message.customContent}
                    </p>
                  )}


                </CardContent>
              </Card>
              <Input
                type="hidden"
                defaultValue={user.name}
                name="author"
              />
              <Input
                type="hidden"
                defaultValue={finance[0].id}
                name="customerId"
              />

              {/* Toolbar */}
              < Toolbar.Root className="my-auto ml-auto  flex h-full  w-[30px] justify-center bg-slate11 p-[10px] shadow-[0_2px_2px] shadow-blackA4" >
                <Toolbar.ToggleGroup
                  type="multiple"
                  className="flex flex-col"
                >
                  <fetcher.Form method="post">
                    <Toolbar.ToggleItem
                      name="intent"
                      type="submit"
                      value="updateFinanceNote"
                      className="cursor-pointer hover:text-[#02a9ff] "
                      onClick={() => {
                        handleSave(message.id);
                        setEditItemId(null);
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20px"
                        height="20px"
                        fill="none"
                        strokeWidth="1.2"
                        viewBox="0 0 24 24"
                        color="#d1d5db"
                      >
                        <path
                          stroke="#d1d5db"
                          strokeWidth="1.2"
                          d="M3 19V5a2 2 0 0 1 2-2h11.172a2 2 0 0 1 1.414.586l2.828 2.828A2 2 0 0 1 21 7.828V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"
                        ></path>
                        <path
                          stroke="#d1d5db"
                          strokeWidth="1.2"
                          d="M8.6 9h6.8a.6.6 0 0 0 .6-.6V3.6a.6.6 0 0 0-.6-.6H8.6a.6.6 0 0 0-.6.6v4.8a.6.6 0 0 0 .6.6ZM6 13.6V21h12v-7.4a.6.6 0 0 0-.6-.6H6.6a.6.6 0 0 0-.6.6Z"
                        ></path>
                      </svg>
                    </Toolbar.ToggleItem>
                    <Input
                      type="hidden"
                      defaultValue={user.name}
                      name="author"
                    />
                    <Input
                      type="hidden"
                      defaultValue={finance[0].id}
                      name="customerId"
                    />
                    <Input
                      type="hidden"
                      defaultValue={message.id}
                      name="id"
                    />
                    <Input
                      type="hidden"
                      defaultValue='Sales'
                      name="dept"
                    />
                    <Input
                      type="hidden"
                      defaultValue="updateFinanceNote"
                      name="intent"
                    />
                    <Input
                      type="hidden"
                      defaultValue={formData.customContent}
                      name="customContent"
                    />

                    <Input
                      type="hidden"
                      defaultValue={formData.urgentFinanceNote}
                      name="urgentFinanceNote"
                    />
                  </fetcher.Form>


                  <Toolbar.ToggleItem
                    type="submit"
                    name="intent"
                    value="editFinanceNote"
                    className="cursor-pointer mt-1 hover:text-[#02a9ff]"
                    onClick={() => handleEditClick(message.id)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20px"
                      height="20px"
                      fill="none"
                      strokeWidth="1.2"
                      viewBox="0 0 24 24"
                      color="#d1d5db"
                    >
                      <path
                        stroke="#d1d5db"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m14.363 5.652 1.48-1.48a2 2 0 0 1 2.829 0l1.414 1.414a2 2 0 0 1 0 2.828l-1.48 1.48m-4.243-4.242-9.616 9.615a2 2 0 0 0-.578 1.238l-.242 2.74a1 1 0 0 0 1.084 1.085l2.74-.242a2 2 0 0 0 1.24-.578l9.615-9.616m-4.243-4.242 4.243 4.242"
                      ></path>
                    </svg>

                  </Toolbar.ToggleItem>
                  <fetcher.Form method="post">
                    <Toolbar.ToggleItem
                      type="submit"
                      value="deleteFinanceNote"
                      name="intent"
                      className="cursor-pointer mt-1 hover:text-[#02a9ff]"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20px"
                        height="20px"
                        fill="none"
                        strokeWidth="1.2"
                        viewBox="0 0 24 24"
                        color="#000000"
                      >
                        <path
                          stroke="#d1d5db"
                          strokeWidth="1.2"
                          d="m19.262 17.038 1.676-12.575a.6.6 0 0 0-.372-.636L16 2h-5.5l-.682 1.5L5 2 3.21 3.79a.6.6 0 0 0-.17.504l1.698 12.744a4 4 0 0 0 1.98 2.944l.32.183a10 10 0 0 0 9.923 0l.32-.183a4 4 0 0 0 1.98-2.944ZM16 2l-2 5M9 6.5l.818-3"
                        ></path>
                        <path
                          stroke="#d1d5db"
                          strokeWidth="1.2"
                          d="M3 5c2.571 2.667 15.429 2.667 18 0"
                        ></path>
                      </svg>
                    </Toolbar.ToggleItem>
                    <Input
                      type="hidden"
                      defaultValue={message.id}
                      name="id"
                    />
                    <Input
                      type="hidden"
                      defaultValue="deleteFinanceNote"
                      name="intent"
                    />
                  </fetcher.Form>

                  <DropdownMenu.Root>
                    <Toolbar.Button asChild>
                      <DropdownMenu.Trigger className="cursor-pointer hover:text-[#02a9ff]">
                        <svg width="20px" height="20px" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.4449 0.608765C8.0183 -0.107015 6.9817 -0.107015 6.55509 0.608766L0.161178 11.3368C-0.275824 12.07 0.252503 13 1.10608 13H13.8939C14.7475 13 15.2758 12.07 14.8388 11.3368L8.4449 0.608765ZM7.4141 1.12073C7.45288 1.05566 7.54712 1.05566 7.5859 1.12073L13.9798 11.8488C14.0196 11.9154 13.9715 12 13.8939 12H1.10608C1.02849 12 0.980454 11.9154 1.02018 11.8488L7.4141 1.12073ZM6.8269 4.48611C6.81221 4.10423 7.11783 3.78663 7.5 3.78663C7.88217 3.78663 8.18778 4.10423 8.1731 4.48612L8.01921 8.48701C8.00848 8.766 7.7792 8.98664 7.5 8.98664C7.2208 8.98664 6.99151 8.766 6.98078 8.48701L6.8269 4.48611ZM8.24989 10.476C8.24989 10.8902 7.9141 11.226 7.49989 11.226C7.08567 11.226 6.74989 10.8902 6.74989 10.476C6.74989 10.0618 7.08567 9.72599 7.49989 9.72599C7.9141 9.72599 8.24989 10.0618 8.24989 10.476Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                      </DropdownMenu.Trigger>
                    </Toolbar.Button>
                    <Form method="post">
                      <DropdownMenu.Content className="bg-white p-2 border border:w-[1px] border:bg-black shadow-sm ">

                        <DropdownMenu.Label >
                          Urgency?
                        </DropdownMenu.Label>

                        <fetcher.Form method="post"
                          onChange={(event) => {
                            submit(event.currentTarget);
                          }}
                        >
                          {urgentFinanceNoteList.map((item) => (
                            <DropdownMenu.Item key={item.name} className="group  leading-none rounded-[3px] pt-1 h-[25px] px-[5px]  pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-gray-600 data-[highlighted]:text-violet1">
                              <div className=" flex  justify-between">
                                <label htmlFor={item.name} className="text-sm mr-auto text-left text-slate11">
                                  {item.label}
                                </label>
                                <input
                                  className="ml-auto"
                                  type="checkbox"
                                  id={item.name}
                                  name='urgentFinanceNote'
                                  value={item.value}
                                  checked={item.value === message.urgentFinanceNote}
                                  onChange={handleInputChange}

                                />
                              </div>
                              <Input type="hidden" defaultValue={user.name} name="author" />
                              <Input type="hidden" defaultValue={finance[0].id} name="customerId" />
                              <Input type="hidden" defaultValue={message.id} name="id" />
                              <Input type="hidden" defaultValue="updateFinanceNote" name="intent" />
                            </DropdownMenu.Item>

                          ))}
                        </fetcher.Form>
                      </DropdownMenu.Content>
                    </Form>
                  </DropdownMenu.Root>

                </Toolbar.ToggleGroup>
              </Toolbar.Root>
            </li>
          ))}
        </ul>
      </div>

      <div className=" "  >
        <fetcher.Form ref={formRef} method="post">
          <p
            className="block uppercase text-gray-300 text-xs font-bold mb-2 mt-2"
          >
            New Note</p>
          <TextArea
            placeholder="Type your message here."
            name="customContent"
            className="w-full rounded border-0 h-8 bg-slate12 px-3 py-3 text-sm text-gray-300 placeholder-blue-600 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#02a9ff] placeholder:text-gray-300 placeholder:uppercase"
          />
          <Input type="hidden" defaultValue={user.name} name="author" />
          <Input
            type="hidden"
            defaultValue={finance[0].id}
            name="customerId"
          />
          <Input
            type="hidden"
            defaultValue={finance[0].id}
            name="financeId"
          />
          <Input
            type="hidden"
            defaultValue={finance[0].name}
            name="name"
          />
          <Input
            type="hidden"
            defaultValue="saveFinanceNote"
            name="intent"
          />

          <div className="mt-2 flex justify-between cursor-pointer">
            <div className='flex' >
              <p className='mr-2'>CC: </p>
              <Select name='ccUser' >
                <SelectTrigger className="max-w-sm rounded border-0 h-8 bg-slate12 px-3 py-3 text-sm text-slate1 placeholder-blue-600 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]">
                  <SelectValue>Sales Person</SelectValue>
                </SelectTrigger>
                <SelectContent className='bg-slate1 text-slate12'>
                  {userList.map((user, index) => (
                    <SelectItem key={index} value={user.email}>{user.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* saveFinanceNote */}
            <Button
              variant='outline'
              name="intent"
              type="submit"
              className="mr-1 bg-transparent cursor-pointer hover:text-[#02a9ff] text-white"
              value="saveFinanceNote"

            >
              Save
            </Button>
          </div>
        </fetcher.Form>

      </div>
    </div>
  )
}


export function FinanceNotesSheet() {
  const { finance, user, financeNotes } = useLoaderData();
  const [formData, setFormData] = useState({
    customContent: "",
    urgentFinanceNote: "",
  });
  const [editItemId, setEditItemId] = useState(null);

  const handleEditClick = (itemId) => {
    setEditItemId(itemId);
  };

  const handleSave = (itemId) => {
    return null;
  };

  const fetcher = useFetcher();
  let transition = useTransition();
  let isDeleting =
    fetcher.state === "submitting" &&
    fetcher.formData?.get("intent") === "deleteFinanceNote";
  let isAdding =
    fetcher.state === "submitting" &&
    fetcher.formData?.get("intent") === "saveFinanceNote";
  let isEditing =
    transition.state === "submitting" &&
    fetcher.formData?.get("intent") === "editFinanceNote";

  let formRef = useRef();

  useEffect(() => {
    if (!isAdding) {
      formRef.current?.reset();
    }
  }, [isAdding]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  return (
    <>
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <Button className="Button">Notes</Button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="inset-0 ">
            <Dialog.Content className="dialogContent h-full w-[550px] max-w-[550px]  bg-white p-[10px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-20px] focus:outline-none">
              <Dialog.Title className="m-0 text-[17px]">Notes</Dialog.Title>
              <Dialog.Description className=" mb-5 mt-[1px] text-[20px] leading-normal"></Dialog.Description>
              <div className="flex flex-col">
                <div className="container relative mx-3 mt-3 h-[500px] w-[95%] overflow-y-auto">
                  <ul>
                    {financeNotes.map((message) => (
                      <li
                        key={message.id}
                        style={{
                          opacity: isDeleting ? 0.5 : 1,
                        }}
                        className="flex-cols-2 flex "
                      >
                        <Card className="mr-1 mt-1 w-full rounded-[0px]"

                        >
                          <CardContent className="flex flex-col">
                            <div className="mt-1 flex justify-between">
                              <p className="text-thin">
                                {message.author}
                              </p>
                              <p className="text-thin">
                                {new Date(message.createdAt).toLocaleDateString()}{" "}
                                {new Date(message.createdAt).toLocaleTimeString()}
                              </p>
                            </div>
                            {editItemId === message.id ? (
                              <TextArea
                                placeholder="Type your message here."
                                key={message.id}
                                name="customContent"
                                className=" mt-2 h-[50px] rounded-[0px]"
                                defaultValue={message.customContent}
                                onChange={handleChange}
                              />
                            ) : (
                              <p className="text-thin ">
                                {message.customContent}
                              </p>
                            )}

                            <div className="flex justify-end">
                              <select
                                key={message.id}
                                defaultValue={message.urgentFinanceNote}
                                name="urgentFinanceNote"
                                className="h-8 w-[110px] text-xs"
                                onChange={handleChange}

                              >
                                <option value="Urgent?">Urgent?</option>
                                <option value="None">None</option>
                                <option value="Soon">Get Done Soon</option>
                                <option value="ASAP">ASAP</option>
                                <option value="DropEverything">
                                  Drop Everything
                                </option>
                              </select>
                            </div>
                          </CardContent>
                        </Card>
                        <Input
                          type="hidden"
                          defaultValue={user.name}
                          name="author"
                        />
                        <Input
                          type="hidden"
                          defaultValue={finance[0].id}
                          name="customerId"
                        />

                        {/* Toolbar */}
                        < Toolbar.Root className="my-auto ml-auto mt-1 mt-1 flex h-full  w-[30px] justify-center bg-white p-[10px] shadow-[0_2px_2px] shadow-blackA4" >
                          <Toolbar.ToggleGroup
                            type="multiple"
                            className="flex flex-col"
                          >
                            <Form method="post">
                              <Toolbar.ToggleItem
                                name="intent"
                                type="submit"
                                value="updateFinanceNote"
                                onClick={() => {
                                  handleSave(message.id);
                                  setEditItemId(null);
                                }}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="20px"
                                  height="20px"
                                  fill="none"
                                  strokeWidth="1.2"
                                  viewBox="0 0 24 24"
                                  color="#000000"
                                >
                                  <path
                                    stroke="#000000"
                                    strokeWidth="1.2"
                                    d="M3 19V5a2 2 0 0 1 2-2h11.172a2 2 0 0 1 1.414.586l2.828 2.828A2 2 0 0 1 21 7.828V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"
                                  ></path>
                                  <path
                                    stroke="#000000"
                                    strokeWidth="1.2"
                                    d="M8.6 9h6.8a.6.6 0 0 0 .6-.6V3.6a.6.6 0 0 0-.6-.6H8.6a.6.6 0 0 0-.6.6v4.8a.6.6 0 0 0 .6.6ZM6 13.6V21h12v-7.4a.6.6 0 0 0-.6-.6H6.6a.6.6 0 0 0-.6.6Z"
                                  ></path>
                                </svg>
                              </Toolbar.ToggleItem>
                              <Input
                                type="hidden"
                                defaultValue={user.name}
                                name="author"
                              />
                              <Input
                                type="hidden"
                                defaultValue={finance[0].id}
                                name="customerId"
                              />
                              <Input
                                type="hidden"
                                defaultValue={message.id}
                                name="id"
                              />
                              <Input
                                type="hidden"
                                defaultValue="updateFinanceNote"
                                name="intent"
                              />
                              <Input
                                type="hidden"
                                defaultValue={formData.customContent}
                                name="customContent"
                              />

                              <Input
                                type="hidden"
                                defaultValue={formData.urgentFinanceNote}
                                name="urgentFinanceNote"
                              />
                            </Form>

                            <Toolbar.ToggleItem
                              type="submit"
                              name="intent"
                              value="editFinanceNote"
                              className="toolbar-toggle-item mt-1"
                              onClick={() => handleEditClick(message.id)}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20px"
                                height="20px"
                                fill="none"
                                strokeWidth="1.2"
                                viewBox="0 0 24 24"
                                color="#000000"
                              >
                                <path
                                  stroke="#000000"
                                  strokeWidth="1.2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="m14.363 5.652 1.48-1.48a2 2 0 0 1 2.829 0l1.414 1.414a2 2 0 0 1 0 2.828l-1.48 1.48m-4.243-4.242-9.616 9.615a2 2 0 0 0-.578 1.238l-.242 2.74a1 1 0 0 0 1.084 1.085l2.74-.242a2 2 0 0 0 1.24-.578l9.615-9.616m-4.243-4.242 4.243 4.242"
                                ></path>
                              </svg>
                            </Toolbar.ToggleItem>

                            <fetcher.Form method="post">
                              <Toolbar.ToggleItem
                                type="submit"
                                value="deleteFinanceNote"
                                name="intent"
                                className="toolbar-toggle-item mt-1"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="20px"
                                  height="20px"
                                  fill="none"
                                  strokeWidth="1.2"
                                  viewBox="0 0 24 24"
                                  color="#000000"
                                >
                                  <path
                                    stroke="#000000"
                                    strokeWidth="1.2"
                                    d="m19.262 17.038 1.676-12.575a.6.6 0 0 0-.372-.636L16 2h-5.5l-.682 1.5L5 2 3.21 3.79a.6.6 0 0 0-.17.504l1.698 12.744a4 4 0 0 0 1.98 2.944l.32.183a10 10 0 0 0 9.923 0l.32-.183a4 4 0 0 0 1.98-2.944ZM16 2l-2 5M9 6.5l.818-3"
                                  ></path>
                                  <path
                                    stroke="#000000"
                                    strokeWidth="1.2"
                                    d="M3 5c2.571 2.667 15.429 2.667 18 0"
                                  ></path>
                                </svg>
                              </Toolbar.ToggleItem>
                              <Input
                                type="hidden"
                                defaultValue={message.id}
                                name="id"
                              />
                              <Input
                                type="hidden"
                                defaultValue="deleteFinanceNote"
                                name="intent"
                              />
                            </fetcher.Form>
                          </Toolbar.ToggleGroup>
                        </Toolbar.Root>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto absolute "  >



                  <fetcher.Form ref={formRef} method="post">
                    <p className="m-0 text-[17px]">New Note</p>
                    <TextArea
                      placeholder="Type your message here."
                      name="customContent"
                      className="ml-3 mr-3 mt-2 h-[50px]  rounded-[0px] "
                    />
                    <Input type="hidden" defaultValue={user.name} name="author" />
                    <Input
                      type="hidden"
                      defaultValue={finance[0].id}
                      name="customerId"
                    />
                    <Input
                      type="hidden"
                      defaultValue="saveFinanceNote"
                      name="intent"
                    />

                    <div className="mt-2 flex justify-end ">
                      {/* saveFinanceNote */}
                      <button
                        name="intent"
                        type="submit"
                        className="mr-1 bg-transparent"
                        value="saveFinanceNote"
                        onClick={() => {
                          toast.success('Note Saved.')
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20px"
                          height="20px"
                          fill="none"
                          strokeWidth="1.2"
                          viewBox="0 0 24 24"
                          color="#000000"
                        >
                          <path
                            stroke="#000000"
                            strokeWidth="1.2"
                            d="M3 19V5a2 2 0 0 1 2-2h11.172a2 2 0 0 1 1.414.586l2.828 2.828A2 2 0 0 1 21 7.828V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"
                          ></path>
                          <path
                            stroke="#000000"
                            strokeWidth="1.2"
                            d="M8.6 9h6.8a.6.6 0 0 0 .6-.6V3.6a.6.6 0 0 0-.6-.6H8.6a.6.6 0 0 0-.6.6v4.8a.6.6 0 0 0 .6.6ZM6 13.6V21h12v-7.4a.6.6 0 0 0-.6-.6H6.6a.6.6 0 0 0-.6.6Z"
                          ></path>
                        </svg>jhfv
                      </button>
                    </div>
                  </fetcher.Form>
                </div>
              </div>
            </Dialog.Content>
          </Dialog.Overlay>
        </Dialog.Portal >
      </Dialog.Root >
    </>
  );
}
