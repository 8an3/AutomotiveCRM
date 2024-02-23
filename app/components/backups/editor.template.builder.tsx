
// https://github.com/remix-run/examples/tree/main/file-and-cloudinary-upload
import React, { useState, useEffect, useRef } from "react";
import type { ActionArgs } from "@remix-run/node";
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
import { Button, Input } from "~/components/ui/index";
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
import NewTemplate from "./editor.newtemplate";
import financeFormSchema from "~/routes/overviewUtils/financeFormSchema";
import { useRootLoaderData } from "~/hooks";
import * as Dialog from '@radix-ui/react-dialog';
import RichTextExample from "../../routes/email";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import { Toaster, toast } from 'sonner'


export async function loader({ params, request }) {
  const userSession = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  const user = await model.user.query.getForSession({ id: userSession.id });
  const userEmail = user?.email;
  const getTemplates = await getTemplatesByEmail(userEmail);
  return json({ getTemplates, user });
}

export const action = async ({ request }: ActionArgs) => {
  const formPayload = Object.fromEntries(await request.formData());
  let formData = financeFormSchema.parse(formPayload)

  const userSession = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  const user = await model.user.query.getForSession({ id: userSession.id });
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

    return json({ template });
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
    console.log('update template')
    return json({ template });
  }
  if (intent === "deleteTemplate") {
    const data = {
      id: formData.id,
    };
    const template = await templateServer(id, data, intent,);

    return null;
  }
  console.log('returned null')
  return null
};

export function Example() {
  const [textEditor, setTextEditor] = useState("");
  const { user } = useRootLoaderData()

  /**  function generateFakeData() {
      const labels = ["sales", "promotions", "done", "automated", "reports"];
      const randomLabel = labels[Math.floor(Math.random() * labels.length)];
      const emails = ["skyler@hdottawa.com", "jessie@hdotttawa.com"];
      const randomEmail = emails[Math.floor(Math.random() * emails.length)];
      const depts = ["sales", "service", "parts", "finance", "marketing"];
      const randomDepts = depts[Math.floor(Math.random() * depts.length)];
      const categories = [
        "sales",
        "follow up",
        "random info",
        "finance",
        "looking for used",
      ];
      const randomCategories =
        categories[Math.floor(Math.random() * categories.length)];
      const type = ["email", "text", "phone", "advertising", "marketing"];
      const randomtype = type[Math.floor(Math.random() * type.length)];

      return {
        id: faker.datatype.uuid(),
        name: faker.lorem.words(3),
        body: "The standard Lorem Ipsum passage, used since the 1500s Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Section 1.10.32 of de Finibus Bonorum et Malorum, written by Cicero in 45 BC Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae  ",
        date: "Thu, Nov 09, 2023, 07:35 PM",
        title: faker.lorem.words(2),
        category: randomCategories,
        userEmail: randomEmail,
        cc: faker.internet.email(),
        bcc: faker.internet.email(),
        subject: faker.lorem.words(3),
        from: faker.internet.email(),
        to: faker.internet.email(),
        review: faker.lorem.sentence(),
        attachment: "",
        label: randomLabel,
        dept: randomDepts,
        type: randomtype,
      };
    }

    // Generate an array of 10 fake data objects
    const fakeData = Array.from({ length: 25 }, generateFakeData);
   */
  const { getTemplates } = useLoaderData();
  const [data, setData] = useState(getTemplates); //EmailLoader);

  console.log(getTemplates, data);
  const [isOpen, setIsOpen] = useState(false);
  const [lineIsOpen, setLineIsOpen] = useState(false);
  // i want to loop through a list of emails here and display them in the email client
  const [email, setEmail] = useState("");
  const [selectedLine, setSelectedLine] = useState(null);
  const [dataset, setDataset] = useState(null);
  const [details, setDetails] = useState(false);

  const handleLineClick = (index) => {
    setSelectedLine(selectedLine === index ? null : index);
    setIsOpen(!isOpen);
  };

  const handleClick = (body) => {
    setIsOpen(!isOpen);
    setEmail(body);
  };

  // rest of your component

  const depts = [...new Set(data.map((item) => item.dept))];
  const categories = [...new Set(data.map((item) => item.category))];
  const types = [...new Set(data.map((item) => item.type))];
  const emails = [...new Set(data.map((item) => item.userEmail))];

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
      (selectedEmail === "" || item.userEmail === (selectedEmail)) &&
      (searchTerm === "" || item.someField.includes(searchTerm)) // replace someField with the field you want to search
  );
  const [open, setOpen] = React.useState(false);
  const eventDateRef = React.useRef(new Date());
  const timerRef = React.useRef(0);

  React.useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  const clientAtr =
  {
    "Title": "${clientTitle}",
    "First Name": "${clientFname}",
    "Last Name": "${clientLname}",
    "Full Name": "${clientFullName}",
    "Phone": "${clientPhone}",
    'Email': '${clientEmail}',
    'Company Name': '${clientCompanyName}',
    'Cell #': '${clientCell}',
    'Address': '${clientAddress}',
    'City': '${clientCity}',
    'Province': '${clientProvince}',
    'Postal Code': '${clientPostalCode}',
    'Country': '${clientCountry}',
  }
  const [clientAtrState, seClientAtr] = useState("");

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
  const [wantedVehAttrState, setWantedVehAttrState] = useState("");

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
  const [tradeVehAttrState, setTradeVehAttrState] = useState("");

  const salesPersonAttr = {
    'First Name': "${userFname}",
    "Full Name": "${userFullName}",
    "Phone or EXT": "${userPhone}",
    'Email': "${userEmail}",
    'Cell #': "${userCell}",
  }
  const [salesPersonAttrState, setSalesPersonAttrState] = useState("");

  const FandIAttr = {
    'Institution': "${fAndIInstitution}",
    "Assigned Manager": "${fAndIFullName}",
    "Email": "${fAndIEmail}",
    "Name": "${fAndIFullName}",
    'Phone # or EXT': "${fAndIPhone}",
    'Cell #': "${fAndICell}",
  }
  const [FandIAttrState, setFandIAttrState] = useState("");

  const textareaRef = useRef(null);

  const [text, setText] = React.useState('');

  const [cursorPosition, setCursorPosition] = React.useState(null);

  React.useEffect(() => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const value = textarea.value;
      const selectionStart = textarea.selectionStart;

      // Calculate the cursor position by counting characters
      let cursorPos = 0;
      for (let i = 0; i < selectionStart; i++) {
        cursorPos += 1;
      }

      setCursorPosition(cursorPos);
    }
  }, [text]);

  const insertAtCursor = (insertText: string) => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const value = textarea.value;
      const before = value.substring(0, cursorPosition);
      const after = value.substring(cursorPosition);
      const newText = before + insertText + after;

      setText(newText, () => {
        // Update the cursor position after the text state is updated
        const newCursorPosition = cursorPosition + insertText.length;
        textarea.selectionStart = newCursorPosition;
        textarea.selectionEnd = newCursorPosition;
      });
    }
  };

  React.useEffect(() => {
    if (cursorPosition !== null) {
      // Move the cursor after the inserted value
      textareaRef.current.selectionStart = cursorPosition;
      textareaRef.current.selectionEnd = cursorPosition;
    }
  }, [text, cursorPosition]);

  const [paragraph, setParagraph] = useState([
    {
      type: 'paragraph',
      children: [{ text: 'A line of text in a paragraph.' }],
    },
  ]);
  return (
    <>
      <div className="mx-auto h-[100vh] w-[100%] justify-center mb-[50px] ">
        <div className="mx-auto w-full ">
          <div className="flex justify-between">
            <div className="flex items-center justify-between">
              <NewTemplate />
              <SettingsMenu />
            </div>

            <div className="flex">
              <select
                className={`border-white text-slate1 placeholder:text-blue-300 broder mx-auto ml-2  h-8 cursor-pointer rounded border bg-[#363a3f] px-2 text-xs uppercase shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]`}
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
                className={`border-white text-slate1 placeholder:text-blue-300 broder mx-auto ml-2  h-8 cursor-pointer rounded border bg-[#363a3f] px-2 text-xs uppercase shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]`}
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
                className={`border-white text-slate1 placeholder:text-blue-300 broder mx-auto ml-2 h-8  cursor-pointer rounded border bg-[#363a3f] px-2 text-xs uppercase shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]`}
              >
                <option value="">Category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <select
                className={`border-white text-slate1 placeholder:text-blue-300 broder mx-auto ml-2  h-8 cursor-pointer rounded border bg-[#363a3f] px-2 text-xs uppercase shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]`}
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
          </div>
          <div className="">
            {filteredDropDown?.map((item, index) => (
              <div
                key={index}
                className={`mx-auto ml-2 mt-2 w-full rounded-md border p-3 shadow bg-[#60646c] even:bg-[#3f464a] even:border-none even:text-blue-1 ${selectedLine !== null && selectedLine !== index
                  ? "opacity-80"
                  : ""
                  } `}
              >
                <div onClick={() => { setText(item.body); handleLineClick(index) }} className="responsive-div  flex cursor-pointer items-center justify-between  hover:text-[#02a9ff] ">
                  <div className="flex">
                    <p className="text-slate1 ml-3 hover:text-[#02a9ff]">{item.title}</p>
                  </div>
                  <div className="flex">
                    <Badge className="ml-3 bg-[#363a3f] text-slate1 hover:text-[#02a9ff]">{item.dept}</Badge>
                    <Badge className="ml-3 mr-auto text-slate1  w-full bg-[#363a3f] hover:text-[#02a9ff]">{item.type}</Badge>
                    <Badge className="ml-3 w-auto items-center text-slate1 bg-[#363a3f] hover:text-[#02a9ff]">{item.category}</Badge>
                    <p className="text-slate1 ml-3 w-full  hover:text-[#02a9ff]">{item.userEmail}</p>
                  </div>
                </div>
                <div
                  className={`${selectedLine === true && isOpen === true
                    ? "h-[50vh] overflow-y-auto  mt-5 w-full p-3"
                    : ""
                    }`}
                >
                  <div
                    className={` bg-white w-full  items-center  overflow-x-hidden  rounded-md   ${selectedLine === index
                      ? " "
                      : ""
                      }`}
                  >
                    <div
                      className={`mt-3 border-stromboli-950  ${selectedLine === index ? "block" : "hidden"}`}
                    >
                      <div className="flex flex-col space-y-4 ">
                        {/* Row 1 */}
                        <div className="flex justify-between  ">
                          <div className="flex items-center justify-start">
                            <div
                              onClick={() => handleLineClick(index)}
                              className="cursor-pointer p-2 hover:text-[#02a9ff]"
                            >
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
                                class="lucide lucide-x-circle"
                              >
                                <circle cx="12" cy="12" r="10" />
                                <path d="m15 9-6 6" />
                                <path d="m9 9 6 6" />
                              </svg>
                            </div>

                          </div>
                          <div className="justify-end">
                            <div className="ml-auto flex px-2  ">

                              <div className="cursor-pointer p-2 hover:text-[#02a9ff]">
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
                                  class="lucide lucide-more-horizontal"
                                >
                                  <circle cx="12" cy="12" r="1" />
                                  <circle cx="19" cy="12" r="1" />
                                  <circle cx="5" cy="12" r="1" />
                                </svg>
                              </div>

                              <Form method="post">
                                <input type='hidden' name='intent' value='deleteTemplate' />
                                <input type='hidden' name='id' value={item.id} />
                                <div className="cursor-pointer p-2 hover:text-[#02a9ff]">
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
                                    class="lucide lucide-trash-2"
                                  >
                                    <path d="M3 6h18" />
                                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                    <line x1="10" x2="10" y1="11" y2="17" />
                                    <line x1="14" x2="14" y1="11" y2="17" />
                                  </svg>
                                </div>
                              </Form>
                            </div>
                          </div>
                        </div>

                        {/* Row 3
                      <div className="flex justify-center">
                        <p className="px-2 text-center ">
                          <Input type='text' name='title' placeholder='Subject' className='w-full' />
                        </p>
                      </div>
                      */}
                      </div>

                      {/*
                    <div className={`relative mx-auto mt-[20px] max-h-[30vh] overflow-y-scroll transition-all duration-500 ml-3 mr-3 ${isOpen ? 'h-[30vh]' : 'h-[30vh] '}`}>
                      This is the third row
                      <p className='text-center mx-auto overflow-y-auto'>{item.body}</p>
                    </div>*/}

                      <div
                        className={`border-white  bg-white  w-auto items-center overflow-x-hidden shadow-sm transition-all duration-500  ${selectedLine === index ? "h-[37%]" : "h-14 "
                          }`}
                      >

                        {/* Your content here */}
                        <Form method="post">


                          <div className="bg-white ml-3  mr-3 mx-auto grid grid-cols-1 justify-center gap-4">
                            {/* Row 1 */}
                            <div className="relative">
                              <Input name="title"
                                placeholder="Email Template Title"
                                defaultValue={item.title} type="text" className="block w-full pl-[115px]" />
                              <label className="absolute left-2 top-[6px] text-gray-500">Template Title:</label>
                            </div>

                            {/* Row 2 */}
                            <div className="py-1">
                              <div className="flex flex-row space-between-2">
                                <Select name="dept" defaultValue={item.dept} >
                                  <SelectTrigger className="w-auto focus:border-[#60b9fd] mr-2">
                                    <SelectValue placeholder="Select a Dept" />
                                  </SelectTrigger>
                                  <SelectContent className='bg-slate1'>
                                    <SelectItem value="sales">Sales</SelectItem>
                                    <SelectItem value="service">Service</SelectItem>
                                    <SelectItem value="accessories">Accessories</SelectItem>
                                    <SelectItem value="management">Management</SelectItem>
                                    <SelectItem value="after Sales">After Sales</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                  </SelectContent>
                                </Select>
                                <Select name="type" defaultValue={item.type}  >
                                  <SelectTrigger className="w-auto focus:border-[#60b9fd] mr-2">
                                    <SelectValue placeholder="Select Type" />
                                  </SelectTrigger>
                                  <SelectContent className='bg-slate1'>
                                    <SelectItem value="phone">Phone</SelectItem>
                                    <SelectItem value="email">Email</SelectItem>
                                    <SelectItem value="text">Text</SelectItem>
                                    <SelectItem value="copy">Copy</SelectItem>
                                    {/* Add other options as needed */}
                                  </SelectContent>
                                </Select>
                                <div className="relative">
                                  <Input
                                    name="category"
                                    type="text"
                                    defaultValue={item.category} className="block w-full h-10 pl-[80px]" placeholder=" " />
                                  <label className="absolute left-2 top-2 text-gray-500">Category:</label>
                                </div>

                              </div>
                            </div>

                            {/* Row 3 */}
                            <div className="relative ">
                              <Input
                                name="subject"
                                placeholder="Subject"
                                defaultValue={item.subject} type="text" className="block w-full h-10 pl-[65px]" />
                              <label className="absolute left-2 top-2 text-gray-500">Subject:</label>
                            </div>

                            <div className="py-1">
                              <div
                                onClick={() => setDetails(!details)}
                                className="flex cursor-pointer items-center hover:text-[#02a9ff]"
                              >
                                <p className="text-bold">cc bcc</p>
                              </div>
                            </div>
                            {/* Details */}
                            {details && (
                              <div className="flex flex-row justify-between">
                                <div className="relative py-1">
                                  <Input
                                    name="cc"
                                    placeholder="cc"
                                    defaultValue={item.cc}
                                    type="text" className="block w-full h-10 pl-8" />
                                  <label className="absolute left-2 top-[5px] text-gray-500">cc</label>
                                </div>

                                <div className="relative py-1">
                                  <Input
                                    name="bcc"
                                    placeholder="bcc"
                                    defaultValue={item.bcc}
                                    type="text" className="block w-full h-10 pl-8" />
                                  <label className="absolute left-2 top-[5px] text-gray-500">bcc</label>
                                </div>
                              </div>
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
                              name="firstName"
                              type="hidden"
                              defaultValue={item.firstName}
                            />
                            <Input
                              name="lastName"
                              type="hidden"
                              defaultValue={item.lastName}
                            />
                            <Input
                              name="id"
                              type="hidden"
                              defaultValue={item.id}
                            />



                            <div className=" p-1">
                              <div className="mr-auto px-2">
                                {/*  <RichTextExample /> */}
                                <Textarea
                                  defaultValue={text}
                                  name="Body"
                                  className=""
                                  placeholder="Type your message here."
                                />
                                <input type='hidden' name='body' value={paragraph} />


                                {/* Row 4
                                <RichTextExample />

                                <ClientOnly
                                  fallback={<p>Fallback component ...</p>}
                                >
                                  {() => (
                                    <DefaultEditor defaultValue={item.body} />
                                  )}
                                </ClientOnly>*/}
                                <input
                                  type="hidden"
                                  name="textEditor"
                                  value={textEditor}
                                />
                                <br />

                                <Button onClick={() =>
                                  toast.success(`Saved Template.`)
                                } className="border-black cursor-pointer border uppercase px-4 py-3">
                                  Save
                                </Button>


                              </div>
                            </div>
                          </div>

                        </Form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
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
            <div className="text-slate1 flex w-full items-center justify-between hover:text-[#02a9ff]">
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
                      class="lucide lucide-check-check"
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
                      class="lucide lucide-clock-10"
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
                      class="lucide lucide-pin"
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
                      class="lucide lucide-trash-2"
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
                    class="lucide lucide-reply-all"
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
                    class="lucide lucide-reply-all"
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
                    class="lucide lucide-forward"
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
