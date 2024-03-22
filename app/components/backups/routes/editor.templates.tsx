// https://github.com/remix-run/examples/tree/main/file-and-cloudinary-upload
import React, { useState, useEffect, useRef } from "react";
import type { ActionArgs, LoaderFunction } from "@remix-run/node";
import { json, } from "@remix-run/node";
import {
  Form,
  useActionData,
  useFetcher,
  useLoaderData,
  useRouteLoaderData,
  useSubmit,
  useTransition,
} from "@remix-run/react";
import { Button, Input, ScrollArea } from "~/components/ui/index";
//import { authenticator } from "~/services";
import { model } from "~/models";
import { getTemplatesByEmail, templateServer } from "~/utils/emailTemplates/template.server";
import { Badge } from "~/components/ui/badge";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/ui/accordion";
import { Textarea } from "~/other/textarea";
import { faker } from "@faker-js/faker";
import DefaultEditor from "~/components/emailClient/editors/default";
import { ClientOnly } from "remix-utils";
import NewTemplate from "../components/backups/editor.newtemplate";
import financeFormSchema from "~/routes/overviewUtils/financeFormSchema";
import { useRootLoaderData } from "~/hooks";
import RichTextExample from "./email";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import { Toaster, toast } from 'sonner'
import DebouncedInput from "~/components/dashboard/calls/DebouncedInput";

import { requireAuthCookie } from '~/utils/misc.user.server';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import { GetUser } from "~/utils/loader.server";
import { prisma } from "~/libs";

import { getSession } from '~/sessions/auth-session.server'


export async function loader({ request, params }: LoaderFunction) {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")


  const user = await GetUser(email)
  /// console.log(user, account, 'wquiote loadert')
  if (!user) {
    redirect('/login')
  }


  let userMail = email

  userMail = session.get('email')

  const getTemplates = await getTemplatesByEmail(userMail);
  console.log(getTemplates, userMail, user)
  return json({ getTemplates, user });
}

export const action = async ({ request }: ActionArgs) => {
  const formPayload = Object.fromEntries(await request.formData());
  let formData = financeFormSchema.parse(formPayload)

  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")


  const user = await GetUser(email)
  /// console.log(user, account, 'wquiote loadert')
  if (!user) {
    redirect('/login')
  }

  const userEmail = user?.email;
  const userId = user?.id;
  const intent = formData.intent;
  const date = new Date().toISOString()
  const id = formData.id

  if (intent === "createTemplate") {
    const data = {
      name: formData.name,
      body: formData.body,
      date: date,
      title: formData.title,
      category: formData.category,
      userEmail: formData.userEmail,
      review: formData.review,
      attachments: formData.attachments,
      label: formData.label,
      dept: formData.dept,
      type: formData.type,
      subject: formData.subject,
      cc: formData.cc,
      bcc: formData.bcc,
    };
    const template = await templateServer(id, data, intent,);
    console.log('create template')

    return json({ template, user });
  }

  if (intent === "updateTemplate") {
    const data = {

      name: formData.name,
      body: formData.body,
      date: date,
      title: formData.title,
      category: formData.category,
      review: formData.review,
      attachments: formData.attachments,
      label: formData.label,
      dept: formData.dept,
      type: formData.type,
      subject: formData.subject,
      cc: formData.cc,
      bcc: formData.bcc,
    };
    const template = await templateServer(id, data, intent,);
    console.log('update template', formData, data, template)
    return json({ template, user });
  }
  if (intent === "deleteTemplate") {
    const data = {
      id: formData.id,
    };
    const template = await templateServer(id, data, intent,);

    return null;
  }
  console.log('returned null')
  return (user)
};

export function Example() {
  const [textEditor, setTextEditor] = useState("");
  // const { user } = useRootLoaderData()
  const { getTemplates, user } = useLoaderData();
  const [data, setData] = useState(getTemplates); //EmailLoader);
  console.log(getTemplates, data);
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [selectedLine, setSelectedLine] = useState(null);
  const [details, setDetails] = useState(false);
  const [dynamic, setDynamic] = useState(false);
  const [newTemplate, setNewTemplate] = useState(false);




  const depts = [...new Set(data.map((item) => item.dept))];
  const categories = [...new Set(data.map((item) => item.category))];
  const types = [...new Set(data.map((item) => item.type))];
  const emails = [...new Set(data.map((item) => item.userEmail))];
  const titles = [...new Set(data.map((item) => item.title))];

  const [searchTemplates, setSearchTemplates] = useState()

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedEmail, setSelectedEmail] = useState("");
  const [selectedDept, setSelectedDept] = useState("");

  const filteredDropDown = data?.filter(
    (item) =>
      (selectedCategory === "" || item.category === selectedCategory) &&
      (selectedType === "" || item.type === selectedType) &&
      (selectedDept === "" || item.dept === selectedDept) &&
      (selectedEmail === "" || item.userEmail === (selectedEmail))
  );
  const timerRef = React.useRef(0);

  React.useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  const clientAtr =
  {
    "Title": "${clientTitle}",
    "First Name": "${firstName}",
    "Last Name": "${lastName}",
    "Full Name": "${name}",
    "Phone": "${phone}",
    'Email': '${email}',
    'Company Name': '${clientCompanyName}',
    'Address': '${address}',
    'City': '${city}',
    'Province': '${province}',
    'Postal Code': '${postal}',
  }
  const [clientAtrState, setClientAtr] = useState("");

  const wantedVehAttr = {
    'Year': "${year}",
    "Brand": "${brand}",
    "Model": "${model}",
    "Trim": "${trim}",
    "Stock Number": "${stockNumber}",
    "VIN": "${vin}",
    'Color': '${color}',
    'Balance': '${balance}',
  }
  const tradeVehAttr = {
    'Year': "${tradeYear}",
    "Brand": "${tradeMake}",
    "Model": "${tradeDesc}",
    "Trim": "${tradeTrim}",
    "VIN": "${tradeVin}",
    'Color': "${tradeColor}",
    'Trade Value': "${tradeValue}",
    'Mileage': '${tradeMileage}',
  }
  const salesPersonAttr = {
    'First Name': "${userFname}",
    "Full Name": "${userFullName}",
    "Phone or EXT": "${userPhone}",
    'Email': "${userEmail}",
    'Cell #': "${userCell}",
  }
  const FandIAttr = {
    'Institution': "${fAndIInstitution}",
    "Assigned Manager": "${fAndIFullName}",
    "Email": "${fAndIEmail}",
    "Name": "${fAndIFullName}",
    'Phone # or EXT': "${fAndIPhone}",
    'Cell #': "${fAndICell}",
  }
  const [textareaValue, setTextareaValue] = useState("");
  const textareaRef = useRef();
  function insertAtCursor(text) {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const value = textarea.value;
      const newValue = value.slice(0, start) + text + value.slice(end);
      textarea.value = newValue;
    }
  }
  function handleDropdownChange(value) {
    insertAtCursor(value);
  }
  /// ---------------
  const [text, setText] = React.useState('');

  const [cursorPosition, setCursorPosition] = React.useState(null);


  const [paragraph, setParagraph] = useState([
    {
      type: 'paragraph',
      children: [{ text: 'A line of text in a paragraph.' }],
    },
  ]);
  const handleLineClick = (index) => {
    setSelectedLine(null);
    setNewTemplate(false);

    if (newTempState === false) {
      setNewTempState(true)
    }
    setTimeout(() => {
      setSelectedLine(index);
    }, 0);
  };

  const handleNewClick = () => {
    setSelectedLine(null);

    setTimeout(() => {
      setNewTemplate(true);
    }, 0);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    // You can also add any search logic here
  };

  const [title, setTitle] = useState('')
  const [subject, setSubject] = useState('')
  const [department, setDepartment] = useState('')
  const [type2, setType2] = useState('')
  const [category, setCategory] = useState('')
  const [cc, setCC] = useState('')
  const [bcc, setBCC] = useState('')
  const [attachments, setAttachments] = useState('')
  const [label, setLabel] = useState('')
  const [id, setId] = useState('')
  const [oldTempState, setOldTempState] = useState(false)
  const [newTempState, setNewTempState] = useState(false)

  const newTemplateClick = () => {
    if (newTempState === false) {
      setOldTempState(true)
    } else {
      setOldTempState(false)
    }
  }

  const oldTemplateClick = () => {
    if (newTempState === false) {
      setOldTempState(true)
    } else {
      setOldTempState(false)
    }
  }
  const handleCompose = () => {

  }
  return (
    <>
      <div className=" mx-auto mb-[5px] mt-10">
        <div className="flex h-[98vh] w-[98w] mx-auto  justify-center ">
          <div className="w-1/3 h-[100%] border border-[#ffffff4d] grid grid-cols-1 space-y-2">
            <p>{searchTemplates}</p>
            <div className="flex w-[full] items-start justify-start space-x-2 p-2">
              <DebouncedInput
                value={searchTerm}
                onChange={value => {
                  setSearchTemplates(value)
                  if (!selectedDept && !selectedType && !selectedCategory) { setSelectedDept('sales') }
                }}
                placeholder="search"
                name='searchTerm'
                className='w-full mr-2' />
              <Button className='text-[#fff] border-[#fff]' variant='outline' type="submit">
                Search
              </Button>
            </div>

            <div className="flex">
              <select
                className={`border-white text-[#fff] placeholder:text-blue-300  mx-auto ml-2  h-8 cursor-pointer rounded border bg-[#363a3f] px-2 text-xs uppercase shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]`}
                value={selectedType}
                onChange={(e) => setSelectedDept(e.target.value)}
              >
                <option value="">Dept</option>
                {depts.map((department) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))}
              </select>

              <select
                className={`border-white text-[#fff] placeholder:text-blue-300  mx-auto ml-2  h-8 cursor-pointer rounded border bg-[#363a3f] px-2 text-xs uppercase shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]`}
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="">Type</option>
                {types.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <select
                value={searchTerm}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={`border-white text-[#fff] placeholder:text-blue-300 broder mx-auto ml-2 h-8  cursor-pointer rounded border bg-[#363a3f] px-2 text-xs uppercase shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]`}
              >
                <option value="">Category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <select
                className={`border-white text-[#fff] placeholder:text-blue-300 broder mx-auto ml-2  h-8 cursor-pointer rounded border bg-[#363a3f] px-2 text-xs uppercase shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]`}
                value={selectedEmail}
                onChange={(e) => setSelectedEmail(e.target.value)}
              >
                <option value="">Email</option>
                {emails.map((email) => (
                  <option key={email} value={email}>
                    {email}
                  </option>
                ))}
              </select>

            </div>
            <div className={`mx-auto  hover:text-[#02a9ff]  ml-2 mt-2 w-[98%] cursor-pointer  grow overflow-auto  rounded-md p-3  grid gris-cols-2 `}
              onClick={() => {

              }} >
              <div className="h-auto max-h-[950px] overflow-y-auto border-b border-[#3b3b3b]">

                <div className="flex">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline"> <p

                        className="text-[#fff]   hover:text-[#02a9ff]">
                        New Template
                      </p></Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[825px] bg-black">
                      <DialogHeader>
                        <DialogTitle className='text-white'>New Template</DialogTitle>
                        <DialogDescription className='text-white'>
                          Create new templates to send to your leads.
                        </DialogDescription>
                      </DialogHeader>
                      <div className=" w-full h-full p-3">
                        <div className={` bg-slate12 w-full  items-center   rounded-md  `}  >
                          <div className="flex flex-col space-y-4 mt-2 ">
                            <div
                              className={`border-[#ffffff4d]  bg-slate12  w-auto items-center overflow-x-hidden shadow-sm transition-all duration-500`}
                            >
                              {/* Your content here */}
                              <Form method="post">
                                <div className="bg-slate12 ml-3  mr-3 mx-auto grid grid-cols-1 justify-center gap-4">
                                  {/* Row 1 */}
                                  <div className="relative">
                                    <Input name="title" className="text-[#fff] border-[#fff] bg-slate12 block w-full pl-[115px]" type="text" />
                                    <label className="absolute left-2 top-[6px] text-[#fff]">Template Title:</label>
                                  </div>
                                  <div className="relative ">
                                    <Input name="subject" className="text-[#fff] border-[#fff] bg-slate12 block w-full h-10 pl-[65px]" type="text" />
                                    <label className="absolute left-2 top-2 text-[#fff]">Subject:</label>
                                  </div>
                                  {/* Row 2 */}
                                  <div className="py-1">
                                    <div className="flex flex-row space-between-2">
                                      <Select name="dept"  >
                                        <SelectTrigger className="w-auto focus:border-[#60b9fd] mr-1 text-[#fff] border-[#fff]">
                                          <SelectValue placeholder="Select a Dept" />
                                        </SelectTrigger>
                                        <SelectContent className='bg-[#fff]'>
                                          <SelectItem value="sales">Sales</SelectItem>
                                          <SelectItem value="service">Service</SelectItem>
                                          <SelectItem value="accessories">Accessories</SelectItem>
                                          <SelectItem value="management">Management</SelectItem>
                                          <SelectItem value="after Sales">After Sales</SelectItem>
                                          <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                      </Select>
                                      <Select name="type"   >
                                        <SelectTrigger className="w-auto ml-auto focus:border-[#60b9fd]  text-[#fff] border-[#fff]">
                                          <SelectValue placeholder="Select Type" />
                                        </SelectTrigger>
                                        <SelectContent className='bg-[#fff]'>
                                          <SelectItem value="phone">Phone</SelectItem>
                                          <SelectItem value="email">Email</SelectItem>
                                          <SelectItem value="text">Text</SelectItem>
                                          <SelectItem value="copy">Copy</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                  <div className="relative">
                                    <Input name="category" type="text" className="text-[#fff] border-[#fff] bg-slate12 block w-full h-10 pl-[80px]" />
                                    <label className="absolute left-2 top-2 text-[#fff]">Category:</label>
                                  </div>
                                  {/* Row 3 */}
                                  <div className="py-1 flex justify-between">
                                    <div
                                      onClick={() => setDynamic(!dynamic)}
                                      className="flex cursor-pointer items-center hover:text-[#02a9ff]"
                                    >
                                      <p className="text-bold text-[#fff] hover:text-[#02a9ff]">Dynamic Attributes</p>
                                    </div>
                                    <div
                                      onClick={() => setDetails(!details)}
                                      className="flex cursor-pointer items-center hover:text-[#02a9ff]"
                                    >
                                      <p className="text-bold text-[#fff] hover:text-[#02a9ff]">cc bcc</p>
                                    </div>
                                  </div>
                                  {/* Details */}
                                  {details && (
                                    <div className="flex flex-row justify-between">
                                      <div className="relative py-1">
                                        <Input name="cc" placeholder="cc" type="text" className='text-[#fff] block w-full h-10 pl-8 border-[#fff] bg-[#363a3f] ' />
                                        <label className="absolute left-2 top-[5px] text-[#fff]">cc</label>
                                      </div>

                                      <div className="relative py-1">
                                        <Input name="bcc" placeholder="bcc" type="text" className='text-[#fff] border-[#fff] bg-[#363a3f]  block w-full h-10 pl-8' />
                                        <label className="absolute left-2 top-[5px] text-[#fff]">bcc</label>
                                      </div>
                                    </div>
                                  )}
                                  {dynamic && (
                                    <>
                                      <div className="grid grid-cols-2 w-full items-center justify-between  ">
                                        <select
                                          name="clientAtr"
                                          onChange={(event) => {
                                            handleDropdownChange(clientAtr[event.target.value]);
                                          }}
                                          className='bg-slate12 border-2  text-[#fff] border-[#fff] focus:border-[#60b9fd] rounded-md p-2 '
                                        >
                                          <option value="">Client</option>
                                          {Object.entries(clientAtr).map(([title, value]) => (
                                            <option key={title} value={title}>
                                              {title}
                                            </option>
                                          ))}
                                        </select>

                                        <select
                                          name="wantedVehAttr"
                                          onChange={(event) => {
                                            handleDropdownChange(wantedVehAttr[event.target.value]);
                                          }}
                                          className='bg-slate12 border-2  text-[#fff] rounded-md ml-2 border-[#fff] focus:border-[#60b9fd]  p-2 '

                                        >
                                          <option value="">Wanted Veh</option>
                                          {Object.entries(wantedVehAttr).map(([title, value]) => (
                                            <option key={title} value={title}>
                                              {title}
                                            </option>
                                          ))}
                                        </select>
                                        <select
                                          name="tradeVehAttr"
                                          onChange={(event) => {
                                            handleDropdownChange(tradeVehAttr[event.target.value]);
                                          }}
                                          className='bg-slate12 border-2  text-[#fff] rounded-md mt-2 border-[#fff] focus:border-[#60b9fd]  p-2 '

                                        >
                                          <option value="">Trade Veh</option>
                                          {Object.entries(tradeVehAttr).map(([title, value]) => (
                                            <option key={title} value={title}>
                                              {title}
                                            </option>
                                          ))}
                                        </select>
                                        <select
                                          name="salesPersonAttr"
                                          onChange={(event) => {
                                            handleDropdownChange(salesPersonAttr[event.target.value]);
                                          }}
                                          className='bg-slate12 border-2  text-[#fff] rounded-md mt-2 ml-2 border-[#fff] focus:border-[#60b9fd] m-1 p-2 '

                                        >
                                          <option value="">Sales Person</option>
                                          {Object.entries(salesPersonAttr).map(([title, value]) => (
                                            <option key={title} value={title}>
                                              {title}
                                            </option>
                                          ))}
                                        </select>
                                        <select
                                          name="FandIAttr"
                                          onChange={(event) => {
                                            handleDropdownChange(FandIAttr[event.target.value]);
                                          }}
                                          className='bg-slate12 border-2  text-[#fff] border-[#fff] focus:border-[#60b9fd] rounded-md mt-2 p-2 '

                                        >
                                          <option value="">F & I Manager</option>
                                          {Object.entries(FandIAttr).map(([title, value]) => (
                                            <option key={title} value={title}>
                                              {title}
                                            </option>
                                          ))}
                                        </select>

                                      </div>
                                    </>
                                  )}
                                  <Input
                                    name="intent"
                                    type="hidden"
                                    defaultValue="createTemplate"
                                  />
                                  <Input
                                    name="userEmail"
                                    type="hidden"
                                    defaultValue={user?.email}
                                  />

                                  <div className=" p-1">
                                    <div className="mr-auto px-2">
                                      {/*  <RichTextExample /> */}
                                      <Textarea

                                        name="body"
                                        className="h-[500px]"
                                        placeholder="Type your email here."
                                        ref={textareaRef}
                                      />
                                      <input type='hidden' name='body2' value={paragraph} />

                                      <input
                                        type="hidden"
                                        name="textEditor"
                                        value={textEditor}
                                      />
                                      <br />
                                      <Button
                                        variant='outline'
                                        onClick={() =>
                                          toast.success(`Saved Template.`)
                                        } className="border-[#fff] text-[#fff] cursor-pointer border uppercase px-4 py-3">
                                        Create
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </Form>
                            </div>
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">Save changes</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                </div>

                {filteredDropDown?.map((item, index) => (
                  <div
                    key={index}
                    className={`m-2 mx-auto w-[95%] cursor-pointer rounded-md border border-[#ffffff4d] hover:border-[#02a9ff]  hover:text-[#02a9ff] active:border-[#02a9ff] ${selectedLine !== index
                      ? "opacity-80"
                      : "bg-slate11"
                      } `}
                    onClick={() => {
                      setText(item.body);
                      setTitle(item.title)
                      setSubject(item.subject)
                      setDepartment(item.dept)
                      setType2(item.type)
                      setCategory(item.category)
                      setCC(item.cc)
                      setBCC(item.bcc)
                      setAttachments(item.attachments)
                      setLabel(item.label)
                      setId(item.id)
                      handleLineClick(index)
                      console.log(item, 'item', selectedLine,)

                    }}
                  >
                    <div className="m-2 flex items-center justify-between">
                      <p className="text-lg font-bold text-[#fff]">{item.title}</p>
                      <p className="text-sm text-[#ffffff7c] ">  {new Date(item.date).toLocaleString()}</p>
                    </div>
                    <p className="my-2 ml-2 text-sm text-[#ffffffc9]">{item.subject}</p>
                    <p className="my-2 ml-2 text-sm text-[#ffffff70]">{item.snippet}</p>

                    <div className="flex">

                      <Badge className="m-2 border-[#f5f5f5a8] text-[#fff]">{item.dept}</Badge>
                      <Badge className="m-2 border-[#f5f5f5a8] text-[#fff]">{item.type}</Badge>
                      <Badge className="m-2 border-[#f5f5f5a8] text-[#fff]">{item.category}</Badge>
                    </div>
                    <div className="flex">
                      <p className="text-[#fff] ml-3 hover:text-[#02a9ff]"></p>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="w-2/3 h-[100%] border border-[#ffffff4d]  ">
            {oldTempState === true ? (
              <div className=" w-full h-full p-3">
                <div className={` bg-slate12 w-full  items-center  overflow-x-scroll  rounded-md  `}  >
                  <div className="flex flex-col space-y-4 mt-[50px] ">
                    <div
                      className={`border-[#ffffff4d]  bg-slate12  w-auto items-center overflow-x-hidden shadow-sm transition-all duration-500`}
                    >
                      {/* Your content here */}
                      <Form method="post">
                        <div className="bg-slate12 ml-3  mr-3 mx-auto grid grid-cols-1 justify-center gap-4">
                          {/* Row 1 */}
                          <div className="relative">
                            <Input name="title" className="text-[#fff] border-[#fff] bg-slate12 block w-full pl-[115px]" type="text" />
                            <label className="absolute left-2 top-[6px] text-[#fff]">Template Title:</label>
                          </div>
                          <div className="relative ">
                            <Input name="subject" className="text-[#fff] border-[#fff] bg-slate12 block w-full h-10 pl-[65px]" type="text" />
                            <label className="absolute left-2 top-2 text-[#fff]">Subject:</label>
                          </div>
                          {/* Row 2 */}
                          <div className="py-1">
                            <div className="flex flex-row space-between-2">
                              <Select name="dept"  >
                                <SelectTrigger className="w-auto focus:border-[#60b9fd] mr-1 text-[#fff] border-[#fff]">
                                  <SelectValue placeholder="Select a Dept" />
                                </SelectTrigger>
                                <SelectContent className='bg-[#fff]'>
                                  <SelectItem value="sales">Sales</SelectItem>
                                  <SelectItem value="service">Service</SelectItem>
                                  <SelectItem value="accessories">Accessories</SelectItem>
                                  <SelectItem value="management">Management</SelectItem>
                                  <SelectItem value="after Sales">After Sales</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                              <Select name="type"   >
                                <SelectTrigger className="w-auto ml-auto focus:border-[#60b9fd]  text-[#fff] border-[#fff]">
                                  <SelectValue placeholder="Select Type" />
                                </SelectTrigger>
                                <SelectContent className='bg-[#fff]'>
                                  <SelectItem value="phone">Phone</SelectItem>
                                  <SelectItem value="email">Email</SelectItem>
                                  <SelectItem value="text">Text</SelectItem>
                                  <SelectItem value="copy">Copy</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="relative">
                            <Input name="category" type="text" className="text-[#fff] border-[#fff] bg-slate12 block w-full h-10 pl-[80px]" />
                            <label className="absolute left-2 top-2 text-[#fff]">Category:</label>
                          </div>
                          {/* Row 3 */}
                          <div className="py-1 flex justify-between">
                            <div
                              onClick={() => setDynamic(!dynamic)}
                              className="flex cursor-pointer items-center hover:text-[#02a9ff]"
                            >
                              <p className="text-bold text-[#fff] hover:text-[#02a9ff]">Dynamic Attributes</p>
                            </div>
                            <div
                              onClick={() => setDetails(!details)}
                              className="flex cursor-pointer items-center hover:text-[#02a9ff]"
                            >
                              <p className="text-bold text-[#fff] hover:text-[#02a9ff]">cc bcc</p>
                            </div>
                          </div>
                          {/* Details */}
                          {details && (
                            <div className="flex flex-row justify-between">
                              <div className="relative py-1">
                                <Input name="cc" placeholder="cc" type="text" className='text-[#fff] block w-full h-10 pl-8 border-[#fff] bg-[#363a3f] ' />
                                <label className="absolute left-2 top-[5px] text-[#fff]">cc</label>
                              </div>

                              <div className="relative py-1">
                                <Input name="bcc" placeholder="bcc" type="text" className='text-[#fff] border-[#fff] bg-[#363a3f]  block w-full h-10 pl-8' />
                                <label className="absolute left-2 top-[5px] text-[#fff]">bcc</label>
                              </div>
                            </div>
                          )}
                          {dynamic && (
                            <>
                              <div className="grid grid-cols-2 w-full items-center justify-between  ">
                                <select
                                  name="clientAtr"
                                  onChange={(event) => {
                                    handleDropdownChange(clientAtr[event.target.value]);
                                  }}
                                  className='bg-slate12 border-2  text-[#fff] border-[#fff] focus:border-[#60b9fd] rounded-md p-2 '
                                >
                                  <option value="">Client</option>
                                  {Object.entries(clientAtr).map(([title, value]) => (
                                    <option key={title} value={title}>
                                      {title}
                                    </option>
                                  ))}
                                </select>

                                <select
                                  name="wantedVehAttr"
                                  onChange={(event) => {
                                    handleDropdownChange(wantedVehAttr[event.target.value]);
                                  }}
                                  className='bg-slate12 border-2  text-[#fff] rounded-md ml-2 border-[#fff] focus:border-[#60b9fd]  p-2 '

                                >
                                  <option value="">Wanted Veh</option>
                                  {Object.entries(wantedVehAttr).map(([title, value]) => (
                                    <option key={title} value={title}>
                                      {title}
                                    </option>
                                  ))}
                                </select>
                                <select
                                  name="tradeVehAttr"
                                  onChange={(event) => {
                                    handleDropdownChange(tradeVehAttr[event.target.value]);
                                  }}
                                  className='bg-slate12 border-2  text-[#fff] rounded-md mt-2 border-[#fff] focus:border-[#60b9fd]  p-2 '

                                >
                                  <option value="">Trade Veh</option>
                                  {Object.entries(tradeVehAttr).map(([title, value]) => (
                                    <option key={title} value={title}>
                                      {title}
                                    </option>
                                  ))}
                                </select>
                                <select
                                  name="salesPersonAttr"
                                  onChange={(event) => {
                                    handleDropdownChange(salesPersonAttr[event.target.value]);
                                  }}
                                  className='bg-slate12 border-2  text-[#fff] rounded-md mt-2 ml-2 border-[#fff] focus:border-[#60b9fd] m-1 p-2 '

                                >
                                  <option value="">Sales Person</option>
                                  {Object.entries(salesPersonAttr).map(([title, value]) => (
                                    <option key={title} value={title}>
                                      {title}
                                    </option>
                                  ))}
                                </select>
                                <select
                                  name="FandIAttr"
                                  onChange={(event) => {
                                    handleDropdownChange(FandIAttr[event.target.value]);
                                  }}
                                  className='bg-slate12 border-2  text-[#fff] border-[#fff] focus:border-[#60b9fd] rounded-md mt-2 p-2 '

                                >
                                  <option value="">F & I Manager</option>
                                  {Object.entries(FandIAttr).map(([title, value]) => (
                                    <option key={title} value={title}>
                                      {title}
                                    </option>
                                  ))}
                                </select>

                              </div>
                            </>
                          )}
                          <Input
                            name="intent"
                            type="hidden"
                            defaultValue="createTemplate"
                          />
                          <Input
                            name="userEmail"
                            type="hidden"
                            defaultValue={user?.email}
                          />

                          <div className=" p-1">
                            <div className="mr-auto px-2">
                              {/*  <RichTextExample /> */}
                              <Textarea

                                name="body"
                                className="h-[500px]"
                                placeholder="Type your email here."
                                ref={textareaRef}
                              />
                              <input type='hidden' name='body2' value={paragraph} />

                              <input
                                type="hidden"
                                name="textEditor"
                                value={textEditor}
                              />
                              <br />
                              <Button
                                variant='outline'
                                onClick={() =>
                                  toast.success(`Saved Template.`)
                                } className="border-[#fff] text-[#fff] cursor-pointer border uppercase px-4 py-3">
                                Create
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Form>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className=" w-full h-full p-3">
                <ScrollArea>
                  <div
                    className={` bg-slate12 w-full  items-center  overflow-x-hidden  rounded-md  `}  >

                    <div className="flex flex-col space-y-4 mt-[50px] ">
                      <div
                        className={`border-[#fff]  bg-slate12  w-auto items-center overflow-x-hidden shadow-sm transition-all duration-500`}
                      >

                        {/* Your content here */}
                        <Form method="post">


                          <div className="bg-slate12 ml-3  mr-3 mx-auto grid grid-cols-1 justify-center gap-4">
                            {/* Row 1 */}
                            <div className="relative">
                              <Input name="title" defaultValue={title}
                                className="text-[#fff] border-[#fff] bg-slate12 block w-full pl-[145px]"
                                type="text" />
                              <label className="absolute left-2 top-[6px] text-[#fff]">Template Title:</label>
                            </div>
                            <div className="relative ">
                              <Input
                                name="subject"
                                defaultValue={subject}
                                className="text-[#fff] border-[#fff] bg-slate12 block w-full h-10 pl-[85px]"
                                type="text" />
                              <label className="absolute left-2 top-2 text-[#fff]">Subject:</label>
                            </div>
                            {/* Row 2 */}
                            <div className="py-1">
                              <div className="flex flex-row space-between-2">
                                <Select name="dept">
                                  <SelectTrigger className="w-auto focus:border-[#60b9fd] mr-1 text-[#fff] border-[#fff]">
                                    <SelectValue placeholder="Select a Dept" />
                                  </SelectTrigger>
                                  <SelectContent className='bg-[#fff]'>
                                    <SelectItem value="sales">Sales</SelectItem>
                                    <SelectItem value="service">Service</SelectItem>
                                    <SelectItem value="accessories">Accessories</SelectItem>
                                    <SelectItem value="management">Management</SelectItem>
                                    <SelectItem value="after Sales">After Sales</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                  </SelectContent>
                                </Select>
                                <Select name="type"  >
                                  <SelectTrigger className="w-auto ml-auto focus:border-[#60b9fd]  text-[#fff] border-[#fff]">
                                    <SelectValue placeholder="Select Type" />
                                  </SelectTrigger>
                                  <SelectContent className='bg-[#fff]'>
                                    <SelectItem value="phone">Phone</SelectItem>
                                    <SelectItem value="email">Email</SelectItem>
                                    <SelectItem value="text">Text</SelectItem>
                                    <SelectItem value="copy">Copy</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <div className="relative">
                              <Input
                                name="category"
                                type="text"
                                defaultValue={category}
                                className="text-[#fff] border-[#fff] bg-slate12 block w-full h-10 pl-[100px]"
                              />
                              <label className="absolute left-2 top-2 text-[#fff]">Category:</label>
                            </div>
                            {/* Row 3 */}
                            <div className="py-1 flex justify-between">
                              <div
                                onClick={() => setDynamic(!dynamic)}
                                className="flex cursor-pointer items-center hover:text-[#02a9ff]"
                              >
                                <p className="text-bold text-[#fff] hover:text-[#02a9ff]">Dynamic Attributes</p>
                              </div>
                              <div
                                onClick={() => setDetails(!details)}
                                className="flex cursor-pointer items-center hover:text-[#02a9ff]"
                              >
                                <p className="text-bold text-[#fff] hover:text-[#02a9ff]">cc bcc</p>
                              </div>
                            </div>
                            {/* Details */}
                            {details && (
                              <div className="flex flex-row justify-between">
                                <div className="relative py-1">
                                  <Input
                                    name="cc"
                                    placeholder="cc"

                                    type="text"
                                    className='text-[#fff] block w-full h-10 pl-8 border-[#fff] bg-[#363a3f] '
                                  />
                                  <label className="absolute left-2 top-[5px] text-[#fff]">cc</label>
                                </div>

                                <div className="relative py-1">
                                  <Input
                                    name="bcc"
                                    placeholder="bcc"

                                    type="text"
                                    className='text-[#fff] border-[#fff] bg-[#363a3f]  block w-full h-10 pl-8' />
                                  <label className="absolute left-2 top-[5px] text-[#fff]">bcc</label>
                                </div>
                              </div>
                            )}
                            {dynamic && (
                              <>
                                <div className="grid grid-cols-2 w-full items-center justify-between  ">
                                  <select
                                    name="clientAtr"
                                    onChange={(event) => {
                                      handleDropdownChange(clientAtr[event.target.value]);
                                    }}
                                    className='bg-slate12 text-[#fff] border-2 border-[#fff] focus:border-[#60b9fd] rounded-md p-2 '
                                  >
                                    <option value="">Client</option>
                                    {Object.entries(clientAtr).map(([title, value]) => (
                                      <option key={title} value={title}>
                                        {title}
                                      </option>
                                    ))}
                                  </select>

                                  <select
                                    name="wantedVehAttr"
                                    onChange={(event) => {
                                      handleDropdownChange(wantedVehAttr[event.target.value]);
                                    }}
                                    className='bg-slate12 text-[#fff] border-2  rounded-md ml-2 border-[#fff] focus:border-[#60b9fd] m-1 p-2 '

                                  >
                                    <option value="">Wanted Veh</option>
                                    {Object.entries(wantedVehAttr).map(([title, value]) => (
                                      <option key={title} value={title}>
                                        {title}
                                      </option>
                                    ))}
                                  </select>
                                  <select
                                    name="tradeVehAttr"
                                    onChange={(event) => {
                                      handleDropdownChange(tradeVehAttr[event.target.value]);
                                    }}
                                    className='bg-slate12 text-[#fff] border-2  rounded-md mt-2 border-[#fff] focus:border-[#60b9fd]  p-2 '

                                  >
                                    <option value="">Trade Veh</option>
                                    {Object.entries(tradeVehAttr).map(([title, value]) => (
                                      <option key={title} value={title}>
                                        {title}
                                      </option>
                                    ))}
                                  </select>
                                  <select
                                    name="salesPersonAttr"
                                    onChange={(event) => {
                                      handleDropdownChange(salesPersonAttr[event.target.value]);
                                    }}
                                    className='bg-slate12 text-[#fff] border-2  rounded-md mt-2 ml-2 border-[#fff] focus:border-[#60b9fd] m-1 p-2 '

                                  >
                                    <option value="">Sales Person</option>
                                    {Object.entries(salesPersonAttr).map(([title, value]) => (
                                      <option key={title} value={title}>
                                        {title}
                                      </option>
                                    ))}
                                  </select>
                                  <select
                                    name="FandIAttr"
                                    onChange={(event) => {
                                      handleDropdownChange(FandIAttr[event.target.value]);
                                    }}
                                    className='bg-slate12 text-[#fff] border-2  border-[#fff] focus:border-[#60b9fd] rounded-md mt-2 p-2 '

                                  >
                                    <option value="">F & I Manager</option>
                                    {Object.entries(FandIAttr).map(([title, value]) => (
                                      <option key={title} value={title}>
                                        {title}
                                      </option>
                                    ))}
                                  </select>

                                </div>
                              </>
                            )}
                            <Input
                              name="intent"
                              type="hidden"
                              defaultValue="updateTemplate"
                            />
                            <Input
                              name="userEmail"
                              type="hidden"
                              defaultValue={user?.email}
                            />
                            <Input
                              name="id"
                              type="hidden"
                              defaultValue={id}
                            />



                            <div className="p-1">
                              <div className="mr-auto px-2 align-content-end place-items-end place-content-end  flex mt-auto justify-self-end justify-items-end justify-end
                              flex-wrap-reverse
                              ">
                                {/*  <RichTextExample /> */}
                                <Textarea
                                  defaultValue={text}
                                  name="body"
                                  className="h-[400px]"
                                  placeholder="Type your email here."
                                  ref={textareaRef} />
                                <input type='hidden' name='body2' value={paragraph} />


                                <input
                                  type="hidden"
                                  name="textEditor"
                                  value={textEditor}
                                />
                                <br />
                                <div className="flex justify-between">
                                  <Button
                                    variant='outline'
                                    onClick={() =>
                                      toast.success(`Saved Template.`)
                                    }
                                    className="border-[#fff] text-[#fff] cursor-pointer border uppercase px-4 py-3">
                                    Save
                                  </Button>
                                  <Form method="post">
                                    <input type='hidden' name='intent' value='deleteTemplate' />
                                    <input type='hidden' name='id' value={id} />
                                    <Button onClick={() =>
                                      toast.success(`Deleted Template.`)
                                    }
                                      className="cursor-pointer p-2 hover:text-[#02a9ff]"
                                      type='submit'>

                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="#fff"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="lucide lucide-trash-2"
                                      >
                                        <path d="M3 6h18" />
                                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                        <line x1="10" x2="10" y1="11" y2="17" />
                                        <line x1="14" x2="14" y1="11" y2="17" />
                                      </svg>
                                    </Button>

                                  </Form>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Form>
                      </div>
                    </div>
                  </div >
                </ScrollArea>
              </div >
            )}
          </div >
        </div >
      </div >
    </>
  );
}


export default function EmailClient1() {
  return (
    <div className="mt-2 flex">
      <main className="mx-2 mt-[5px] w-[95%]">
        {/* Your main content here */}
        <ClientOnly fallback={<p>loading...</p>}>
          {() => <Example />}
        </ClientOnly>

      </main>
    </div>
  );
}

export function SettingsMenu() {
  const [email, setEmail] = useState("");
  const [isOpen, setIsOpen] = useState(false);


  const handleClick = () => {
    setIsOpen(!isOpen);
    setEmail(emailBody);
  };

  return (
    <>
      <Sheet>
        <SheetTrigger>
          <Button
            variant="ghost"
            size="sm"
            className=" h-8 cursor-pointer justify-between lg:flex "
          >
            <div className="text-[#fff] flex w-full items-center justify-between hover:text-[#02a9ff]">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-settings"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>

            </div>
          </Button>
        </SheetTrigger>
        <SheetContent className="bg-white w-full overflow-y-auto md:w-[50%] ">
          <div className="flex flex-col space-y-4">
            {/* Row 1 */}
            <div className="flex justify-between  ">
              <div className="justify-start">
                <SheetClose asChild>
                  <div className="cursor-pointer p-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-x-circle"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="m15 9-6 6" />
                      <path d="m9 9 6 6" />
                    </svg>
                  </div>
                </SheetClose>
              </div>
              <div className="justify-end">
                <div className="ml-auto flex px-2  ">
                  <div className="cursor-pointer p-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-more-horizontal"
                    >
                      <circle cx="12" cy="12" r="1" />
                      <circle cx="19" cy="12" r="1" />
                      <circle cx="5" cy="12" r="1" />
                    </svg>
                  </div>
                  <div className="cursor-pointer p-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-check-check"
                    >
                      <path d="M18 6 7 17l-5-5" />
                      <path d="m22 10-7.5 7.5L13 16" />
                    </svg>
                  </div>
                  <div className="cursor-pointer p-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-clock-10"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 8 10" />
                    </svg>
                  </div>
                  <div className="cursor-pointer p-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-pin"
                    >
                      <line x1="12" x2="12" y1="17" y2="22" />
                      <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z" />
                    </svg>
                  </div>
                  <div className="cursor-pointer p-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-trash-2"
                    >
                      <path d="M3 6h18" />
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                      <line x1="10" x2="10" y1="11" y2="17" />
                      <line x1="14" x2="14" y1="11" y2="17" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 2 */}
            <div className=" w-[100vw] md:w-[50vw] ">
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger>
                    <div className="grid grid-cols-2 px-2  ">
                      <p className="text-left">Compose</p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="px-2 text-left ">
                      <Input type="email" placeholder="To" />
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {/* Row 3 */}
            <div className="flex justify-center">
              <p className="px-2 text-center ">
                <Input
                  type="text"
                  name="title"
                  placeholder="Subject"
                  className="w-full"
                />
              </p>
            </div>
          </div>

          <div
            className={`relative mx-3 mt-[20px] max-h-[75%]  overflow-y-auto transition-all duration-500 ${isOpen ? "h-[47%]" : "h-auto "
              }`}
          >
            {/* This is the third row */}
            <p>email body</p>
          </div>

          <div
            className={`border-white border-t-gray-950 bg-white fixed bottom-0 w-[100vw] items-center overflow-x-hidden rounded-md border shadow-sm transition-all duration-500 md:w-[50%] ${isOpen ? "h-[37%]" : "h-14 "
              }`}
          >
            <div className="grid grid-cols-2 items-center justify-between">
              <button
                onClick={handleClick}
                className="bg-transparent text-black p-2 text-left"
              >
                Reply
              </button>
              <div className="ml-auto flex p-2  ">
                <div className="cursor-pointer p-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-reply-all"
                  >
                    <polyline points="7 17 2 12 7 7" />
                    <polyline points="12 17 7 12 12 7" />
                    <path d="M22 18v-2a4 4 0 0 0-4-4H7" />
                  </svg>
                </div>
                <div className="cursor-pointer p-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-reply-all"
                  >
                    <polyline points="7 17 2 12 7 7" />
                    <polyline points="12 17 7 12 12 7" />
                    <path d="M22 18v-2a4 4 0 0 0-4-4H7" />
                  </svg>
                </div>
                <div className="cursor-pointer p-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-forward"
                  >
                    <polyline points="15 17 20 12 15 7" />
                    <path d="M4 18v-2a4 4 0 0 1 4-4h12" />
                  </svg>
                </div>
              </div>
            </div>
            {/* Your content here */}
            <div className={`${isOpen ? "block" : "hidden"}`}>
              <Textarea
                defaultValue={email}
                name="Body"
                className=""
                placeholder="Type your message here."
              />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

