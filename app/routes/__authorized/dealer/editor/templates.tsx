/* eslint-disable @typescript-eslint/adjacent-overload-signatures */
// https://github.com/remix-run/examples/tree/main/file-and-cloudinary-upload
import type { ActionArgs, LoaderFunction } from "@remix-run/node";
import { json, } from "@remix-run/node";
import {
  Form,
  useLoaderData,
} from "@remix-run/react";
import { EditorTiptapContextViewHTML, EditorTiptapHook } from "~/components/libs/editor-tiptap"
import { Button, Input, ScrollArea } from "~/components/ui/index";
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
import { TextArea } from "~/components/ui/textarea";
import { ClientOnly } from "remix-utils";
import financeFormSchema from "~/overviewUtils/financeFormSchema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import { Toaster, toast } from 'sonner'
import DebouncedInput from "~/components/dashboard/calls/DebouncedInput";
import { prisma } from "~/libs";
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
import { conform, useForm, useInputEvent } from "@conform-to/react"
import { getSession } from '~/sessions/auth-session.server'
import ExampleTiptap from "../tiptap";
import Highlight from "@tiptap/extension-highlight"
import Link from "@tiptap/extension-link"
import Placeholder from "@tiptap/extension-placeholder"
import Typography from "@tiptap/extension-typography"
import Underline from "@tiptap/extension-underline"
import TextAlign from '@tiptap/extension-text-align'
import ListItem from '@tiptap/extension-list-item'
import TaskItem from '@tiptap/extension-task-item'
import { Color } from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'
import Document from '@tiptap/extension-document'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import {
  BubbleMenu,
  EditorContent,
  EditorProvider,
  useCurrentEditor,
  useEditor,
  type Content,
} from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { Undo, Redo, List, ScanLine, Eraser, Code, ListPlus, Brackets, Pilcrow, Minus, AlignLeft, AlignCenter, AlignRight, AlignJustify, Highlighter, WrapText, Quote, Heading1, Heading2, Heading3 } from 'lucide-react';
import { FaBold, FaStrikethrough, FaItalic, FaUnlink, FaLink, FaList, FaListOl, FaFileCode, FaQuoteLeft, FaUndo, FaAlignJustify, FaAlignLeft, FaRedo, FaAlignRight, FaAlignCenter, FaHighlighter, FaEraser, FaUnderline } from "react-icons/fa";
import { BiCodeBlock } from "react-icons/bi";
import { MdHorizontalRule } from "react-icons/md";
import { IoMdReturnLeft } from "react-icons/io";


import { IconMatch } from "~/components/libs/icons"
import { buttonVariants } from "~/components/ui/button"
import { cn } from "~/components/ui/utils"
import { parseHTML } from "~/utils/html"
import { fixUrl } from "~/utils/url"
import { GetUser } from "~/utils/loader.server";

export async function loader({ request, params }: LoaderFunction) {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")


  const user = await GetUser(email)
  /// console.log(user, account, 'wquiote loadert')
  if (!user) { redirect('/login') }


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
  if (!user) { redirect('/login') }

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


export function Example({ content, handleUpdate, }: {
  content?: Content | string
  handleUpdate?: (htmlString: string) => void
}) {
  const [textEditor, setTextEditor] = useState("");
  // const { user } = useRootLoaderData()
  const { getTemplates, user } = useLoaderData();
  const [data, setData] = useState(getTemplates); //EmailLoader);
  const [selectedLine, setSelectedLine] = useState(null);
  const [details, setDetails] = useState(false);
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

  React.useEffect(() => { return () => clearTimeout(timerRef.current); }, []);

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
  function handleDropdownChange(value) { insertAtCursor(value); }
  /// ---------------
  const [text, setText] = React.useState('');
  const [paragraph, setParagraph] = useState([{ type: 'paragraph', children: [{ text: 'A line of text in a paragraph.' }], },]);
  const [contentValue, setContentValue] = useState(text)
  const contentRef = useRef<HTMLInputElement>(null)
  const contentControl = useInputEvent({ ref: contentRef })

  function handleUpdateContent(text: string) {
    console.log('contrente', text)
    setContentValue(text)
  }


  const content2 = contentValue

  const handleLineClick = (index, item) => {
    setSelectedLine(null);
    setNewTemplate(false);
    console.log('contrente', item)
    setContentValue(item.body)
    if (newTempState === false) {
      setNewTempState(true)
    }
    setTimeout(() => {
      setSelectedLine(index);
    }, 0);
  };
  useEffect(() => {
    if (text) {
      window.localStorage.setItem("templateEmail", text);
    }
  }, [text]);
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


  /**   <Textarea

   name="body"
  className="h-[500px]"
    placeholder="Type your email here."
      ref={textareaRef}
     />
     <Textarea

       name="body"
         className="h-[500px]"
     placeholder="Type your email here."
          ref={textareaRef}
        />

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
        */

  const CustomDocument = Document.extend({ content: 'taskList', })
  const CustomTaskItem = TaskItem.extend({ content: 'inline*', })
  useEffect(() => {
    const text = window.localStorage.getItem("templateEmail");
    setText(text);
  }, []);
  const editor = useEditor({
    content,
    extensions: [
      Highlight,
      Typography,
      Underline,
      CustomDocument,
      CustomTaskItem,
      Color.configure({ types: [TextStyle.name, ListItem.name] }),
      TextStyle,
      StarterKit.configure({
        bulletList: { keepMarks: true, keepAttributes: false, },
        orderedList: { keepMarks: true, keepAttributes: false, },
      }),
      TextAlign.configure({ types: ['heading', 'paragraph'], }),
      Placeholder.configure({ placeholder: () => { return "Write something..." }, }),
      Link.configure({ HTMLAttributes: { rel: "noopener noreferrer", target: "_blank", class: "prose-a-styles", }, }),
    ],
    editorProps: { attributes: { class: "prose-config" } },
    onUpdate({ editor }) {
      setText(editor.getHTML())
      if (handleUpdate) {
        handleUpdate(editor.getHTML())
      }
    },

  })


  const buttonActive = cn(buttonVariants({ variant: "default", size: "xs", isIcon: true }))
  const buttonInactive = cn(buttonVariants({ variant: "ghost", size: "xs", isIcon: true }))

  const handleSetLink = useCallback(() => {
    if (!editor) return null

    const previousUrl = editor.getAttributes("link").href as string
    const url = window.prompt("URL", previousUrl)

    if (url === null) return
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run()
      return
    }

    const fixedUrl = fixUrl(url)
    editor.chain().focus().extendMarkRange("link").setLink({ href: fixedUrl }).run()
  }, [editor])

  const [financeList, setFinanceList] = useState([])
  const [dynamicAttributes, setDynamic] = useState()
  const [textareaValue, setTextareaValue] = useState("");
  const [clientAtrState, setClientAtr] = useState("");

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
  const wantedVehAttr = {
    'Year': "${year}",
    "Brand": "${brand}",
    "Model": "${model}",
    "Trim": "${trim}",
    "Stock Number": "${stockNumber}",
    "VIN": "${vin}",
    'Color': '${color}',
    'Balance': '${balance}',
    'packageNumber': '${packageNumber}',
    'packagePrice': '${packagePrice}',
    'stockNumber': '${stockNumber}',
    'type': '${type}',
    'class': '${class}',
    'year': '${year}',
    'make': '${make}',
    'model': '${model}',
    'modelName': '${modelName}',
    'submodel': '${submodel}',
    'subSubmodel': '${subSubmodel}',
    'price': '${price}',
    'exteriorColor': '${exteriorColor}',
    'mileage': '${mileage}',
    'consignment': '${consignment}',
    'onOrder': '${onOrder}',
    'expectedOn': '${expectedOn}',
    'status': '${status}',
    'orderStatus': '${orderStatus}',
    'hdcFONumber': '${hdcFONumber}',
    'hdmcFONumber': '${hdmcFONumber}',
    'vin': '${vin}',
    'age': '${age}',
    'floorPlanDueDate': '${floorPlanDueDate}',
    'location': '${location}',
    'stocked': '${stocked}',
    'stockedDate': '${stockedDate}',
    'isNew': '${isNew}',
    'actualCost': '${actualCost}',
    'mfgSerialNumber': '${mfgSerialNumber}',
    'engineNumber': '${engineNumber}',
    'plates': '${plates}',
    'keyNumber': '${keyNumber}',
    'length': '${length}',
    'width': '${width}',
    'engine': '${engine}',
    'fuelType': '${fuelType}',
    'power': '${power}',
    'chassisNumber': '${chassisNumber}',
    'chassisYear': '${chassisYear}',
    'chassisMake': '${chassisMake}',
    'chassisModel': '${chassisModel}',
    'chassisType': '${chassisType}',
    'registrationState': '${registrationState}',
    'registrationExpiry': '${registrationExpiry}',
    'grossWeight': '${grossWeight}',
    'netWeight': '${netWeight}',
    'insuranceCompany': '${insuranceCompany}',
    'policyNumber': '${policyNumber}',
    'insuranceAgent': '${insuranceAgent}',
    'insuranceStartDate': '${insuranceStartDate}',
    'insuranceEndDate': '${insuranceEndDate}',
    'sold': '${sold}',
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
  const dealerInfo = {
    'dealerName': '${dealerName}',
    'dealerAddress': '${dealerAddress}',
    'dealerCity': '${dealerCity}',
    'dealerProv': '${dealerProv}',
    'dealerPostal': '${dealerPostal}',
    'dealerPhone': '${dealerPhone}',
    'userLoanProt': '${userLoanProt}',
    'userTireandRim': '${userTireandRim}',
    'userGap': '${userGap}',
    'userExtWarr': '${userExtWarr}',
    'userServicespkg': '${userServicespkg}',
    'vinE': '${vinE}',
    'lifeDisability': '${lifeDisability}',
    'rustProofing': '${rustProofing}',
    'userLicensing': '${userLicensing}',
    'userFinance': '${userFinance}',
    'userDemo': '${userDemo}',
    'userGasOnDel': '${userGasOnDel}',
    'userOMVIC': '${userOMVIC}',
    'userOther': '${userOther}',
    'userTax': '${userTax}',
    'userAirTax': '${userAirTax}',
    'userTireTax': '${userTireTax}',
    'userGovern': '${userGovern}',
    'userPDI': '${userPDI}',
    'userLabour': '${userLabour}',
    'userMarketAdj': '${userMarketAdj}',
    'userCommodity': '${userCommodity}',
    'destinationCharge': '${destinationCharge}',
    'userFreight': '${userFreight}',
    'userAdmin': '${userAdmin}',
  }
  const financeInfo = {
    'financeManager': '${financeManager}',
    'email': '${email}',
    'firstName': '${firstName}',
    'mileage': '${mileage}',
    'lastName': '${lastName}',
    'phone': '${phone}',
    'name': '${name}',
    'address': '${address}',
    'city': '${city}',
    'postal': '${postal}',
    'province': '${province}',
    'dl': '${dl}',
    'typeOfContact': '${typeOfContact}',
    'timeToContact': '${timeToContact}',
    'iRate': '${iRate}',
    'months': '${months}',
    'discount': '${discount}',
    'total': '${total}',
    'onTax': '${onTax}',
    'on60': '${on60}',
    'biweekly': '${biweekly}',
    'weekly': '${weekly}',
    'weeklyOth': '${weeklyOth}',
    'biweekOth': '${biweekOth}',
    'oth60': '${oth60}',
    'weeklyqc': '${weeklyqc}',
    'biweeklyqc': '${biweeklyqc}',
    'qc60': '${qc60}',
    'deposit': '${deposit}',
    'biweeklNatWOptions': '${biweeklNatWOptions}',
    'weeklylNatWOptions': '${weeklylNatWOptions}',
    'nat60WOptions': '${nat60WOptions}',
    'weeklyOthWOptions': '${weeklyOthWOptions}',
    'biweekOthWOptions': '${biweekOthWOptions}',
    'oth60WOptions': '${oth60WOptions}',
    'biweeklNat': '${biweeklNat}',
    'weeklylNat': '${weeklylNat}',
    'nat60': '${nat60}',
    'qcTax': '${qcTax}',
    'otherTax': '${otherTax}',
    'totalWithOptions': '${totalWithOptions}',
    'otherTaxWithOptions': '${otherTaxWithOptions}',
    'desiredPayments': '${desiredPayments}',
    'freight': '${freight}',
    'admin': '${admin}',
    'commodity': '${commodity}',
    'pdi': '${pdi}',
    'discountPer': '${discountPer}',
    'userLoanProt': '${userLoanProt}',
    'userTireandRim': '${userTireandRim}',
    'userGap': '${userGap}',
    'userExtWarr': '${userExtWarr}',
    'userServicespkg': '${userServicespkg}',
    'deliveryCharge': '${deliveryCharge}',
    'vinE': '${vinE}',
    'lifeDisability': '${lifeDisability}',
    'rustProofing': '${rustProofing}',
    'userOther': '${userOther}',
    'paintPrem': '${paintPrem}',
    'licensing': '${licensing}',
    'stockNum': '${stockNum}',
    'options': '${options}',
    'accessories': '${accessories}',
    'labour': '${labour}',
    'year': '${year}',
    'brand': '${brand}',
    'model': '${model}',
    'model1': '${model1}',
    'color': '${color}',
    'modelCode': '${modelCode}',
    'msrp': '${msrp}',
    'userEmail': '${userEmail}',
    'tradeValue': '${tradeValue}',
    'tradeDesc': '${tradeDesc}',
    'tradeColor': '${tradeColor}',
    'tradeYear': '${tradeYear}',
    'tradeMake': '${tradeMake}',
    'tradeVin': '${tradeVin}',
    'tradeTrim': '${tradeTrim}',
    'tradeMileage': '${tradeMileage}',
    'trim': '${trim}',
    'vin': '${vin}',
    'leadNote': '${leadNote}',
    'sendToFinanceNow': '${sendToFinanceNow}',
    'dealNumber': '${dealNumber}',
    'bikeStatus': '${bikeStatus}',
    'lien': '${lien}',
  }


  function handleDropdownChange(value) {
    setText(value);
  }
  if (!editor) return null
  return (
    <>
      <div className=" mx-auto mb-[5px] mt-10">
        <div className="flex h-[90vh] w-[98w] mx-auto  justify-center ">

          <Card className="w-1/3 h-[100%] mx-3 border-white">
            <CardHeader>
              <CardTitle>
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
                    className='w-full mr-2 text-foreground border-white' />
                  <Button className='text-foreground border-white' variant='outline' type="submit">
                    Search
                  </Button>
                </div>
              </CardTitle>
              <CardDescription> <div className="flex">
                <select
                  className={`border-white text-foreground placeholder:text-blue-300  mx-auto ml-2  h-8 cursor-pointer rounded border bg-background px-2 text-xs uppercase shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]`}
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
                  className={`border-white text-foreground placeholder:text-blue-300  mx-auto ml-2  h-8 cursor-pointer rounded border bg-background px-2 text-xs uppercase shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]`}
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
                  className={`border-white text-foreground placeholder:text-blue-300 broder mx-auto ml-2 h-8  cursor-pointer rounded border bg-background px-2 text-xs uppercase shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]`}
                >
                  <option value="">Category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <select
                  className={`border-white text-foreground placeholder:text-blue-300 broder mx-auto ml-2  h-8 cursor-pointer rounded border bg-background px-2 text-xs uppercase shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]`}
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
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 space-y-2 w-full items-center gap-4">
                <div className={`mx-auto h-[800px] hover:text-primary  ml-2 mt-2 w-[98%] cursor-pointer  grow overflow-auto  rounded-md p-3  grid gris-cols-2 `}
                  onClick={() => {
                  }} >
                  <div className="h-auto max-h-[950px] overflow-y-auto border-b border-[#262626]">
                    <div className="flex">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" className='m-2 mx-auto w-[95%] h-[50px] cursor-pointer rounded-md border border-[#ffffff4d] hover:border-primary  hover:text-primary  hover:bg-transparent bg-transparent text-foreground '>
                            New Template
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[90%] bg-background">
                          <DialogHeader>
                            <DialogTitle className='text-foreground'>New Template</DialogTitle>
                            <DialogDescription className='text-foreground'>
                              Create new templates to send to your leads.
                            </DialogDescription>
                          </DialogHeader>
                          <div className=" w-full h-full p-3">
                            <div className={` bg-background w-full  items-center   rounded-md  `}  >
                              <div className="flex flex-col space-y-4 mt-2 ">
                                <div
                                  className={`border-[#ffffff4d]  bg-background  w-auto items-center overflow-x-hidden shadow-sm transition-all duration-500`}
                                >
                                  {/* Your content here */}
                                  <Form method="post">
                                    <div className="bg-background ml-3  mr-3 mx-auto grid grid-cols-1 justify-center gap-4">
                                      {/* Row 1 */}
                                      <div className="relative">
                                        <Input name="title" className="text-foreground border-white bg-background block w-full pl-[115px]" type="text" />
                                        <label className="absolute left-2 top-[6px] text-foreground">Template Title:</label>
                                      </div>
                                      <div className="relative ">
                                        <Input name="subject" className="text-foreground border-white bg-background block w-full h-10 pl-[65px]" type="text" />
                                        <label className="absolute left-2 top-2 text-foreground">Subject:</label>
                                      </div>
                                      {/* Row 2 */}
                                      <div className="py-1">
                                        <div className="flex flex-row space-between-2">
                                          <Select name="dept"  >
                                            <SelectTrigger className="w-auto focus:border-[#60b9fd] mr-1 text-foreground border-white">
                                              <SelectValue placeholder="Select a Dept" />
                                            </SelectTrigger>
                                            <SelectContent className='bg-white text-black'>
                                              <SelectItem value="sales">Sales</SelectItem>
                                              <SelectItem value="service">Service</SelectItem>
                                              <SelectItem value="accessories">Accessories</SelectItem>
                                              <SelectItem value="management">Management</SelectItem>
                                              <SelectItem value="after Sales">After Sales</SelectItem>
                                              <SelectItem value="other">Other</SelectItem>
                                            </SelectContent>
                                          </Select>
                                          <Select name="type"   >
                                            <SelectTrigger className="w-auto ml-auto focus:border-[#60b9fd]  text-foreground border-white">
                                              <SelectValue placeholder="Select Type" />
                                            </SelectTrigger>
                                            <SelectContent className='bg-white text-black'>
                                              <SelectItem value="phone">Phone</SelectItem>
                                              <SelectItem value="email">Email</SelectItem>
                                              <SelectItem value="text">Text</SelectItem>
                                              <SelectItem value="copy">Copy</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                      </div>
                                      <div className="relative">
                                        <Input name="category" type="text" className="text-foreground border-white bg-background block w-full h-10 pl-[80px]" />
                                        <label className="absolute left-2 top-2 text-foreground">Category:</label>
                                      </div>
                                      {/* Row 3 */}
                                      <div className="py-1 flex justify-between">

                                        <div
                                          onClick={() => setDetails(!details)}
                                          className="flex cursor-pointer items-center hover:text-primary"
                                        >
                                          <p className="text-bold text-foreground hover:text-primary">cc bcc</p>
                                        </div>
                                      </div>
                                      {/* Details */}
                                      {details && (
                                        <div className="flex flex-row justify-between">
                                          <div className="relative py-1">
                                            <Input name="cc" placeholder="cc" type="text" className='text-foreground block w-full h-10 pl-8 border-white bg-[#363a3f] ' />
                                            <label className="absolute left-2 top-[5px] text-foreground">cc</label>
                                          </div>

                                          <div className="relative py-1">
                                            <Input name="bcc" placeholder="bcc" type="text" className='text-foreground border-white bg-[#363a3f]  block w-full h-10 pl-8' />
                                            <label className="absolute left-2 top-[5px] text-foreground">bcc</label>
                                          </div>
                                        </div>
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
                                          <EditorTiptapHook content={contentValue} handleUpdate={handleUpdateContent} />

                                          <input type='hidden' name='body2' value={paragraph} />
                                          <input type="hidden" name="textEditor" value={textEditor} />
                                          <br />
                                          <Button
                                            variant='outline'
                                            onClick={() =>
                                              toast.success(`Saved Template.`)
                                            } className="border-white text-foreground cursor-pointer border uppercase px-4 py-3">
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
                        className={`m-2 mx-auto w-[95%] cursor-pointer rounded-md border border-[#ffffff4d] hover:border-primary  hover:text-primary active:border-primary ${selectedLine !== index
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
                          handleLineClick(index, item)
                          editor.commands.setContent(item.body)
                        }}
                      >
                        <div className="m-2 flex items-center justify-between">
                          <p className="text-lg font-bold text-foreground text-left">{item.title}</p>
                        </div>
                        <p className="my-2 ml-2 text-sm text-[#ffffffc9]">{item.subject}</p>
                        <p className="my-2 ml-2 text-sm text-[#ffffff70]">{item.snippet}</p>

                        <div className="flex">

                          <Badge className="m-2 bg-transparent border-[#f5f5f5a8] text-foreground">{item.dept}</Badge>
                          <Badge className="m-2  bg-transparent border-[#f5f5f5a8] text-foreground">{item.type}</Badge>
                          <Badge className="m-2 bg-transparent border-[#f5f5f5a8] text-foreground">{item.category}</Badge>
                        </div>
                        <div className="flex">
                          <p className="text-foreground ml-3 hover:text-primary"></p>
                        </div>

                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>

          </Card>

          <Card className="w-2/3 mx-3 border-white h-[100%]">

            <CardContent>
              <div className="grid w-full items-center gap-4">
                {oldTempState === true ? (
                  <div className=" w-full h-full p-3">
                    <div className={` bg-background w-full  items-center  overflow-x-scroll  rounded-md  `}  >
                      <div className="flex flex-col space-y-4 mt-[50px] ">
                        <div
                          className={`border-[#ffffff4d]  bg-background  w-auto items-center overflow-x-hidden shadow-sm transition-all duration-500`}
                        >
                          {/* Your content here */}
                          <Form method="post">
                            <div className="bg-background ml-3  mr-3 mx-auto grid grid-cols-1 justify-center gap-4">
                              {/* Row 1 */}
                              <div className="relative">
                                <Input name="title" className="text-foreground border-white bg-background block w-full pl-[115px]" type="text" />
                                <label className="absolute left-2 top-[6px] text-foreground">Template Title:</label>
                              </div>
                              <div className="relative ">
                                <Input name="subject" className="text-foreground border-white bg-background block w-full h-10 pl-[65px]" type="text" />
                                <label className="absolute left-2 top-2 text-foreground">Subject:</label>
                              </div>
                              {/* Row 2 */}
                              <div className="py-1">
                                <div className="flex flex-row space-between-2">
                                  <Select name="dept"  >
                                    <SelectTrigger className="w-auto focus:border-[#60b9fd] mr-1 text-foreground border-white">
                                      <SelectValue placeholder="Select a Dept" />
                                    </SelectTrigger>
                                    <SelectContent className='bg-white'>
                                      <SelectItem value="sales">Sales</SelectItem>
                                      <SelectItem value="service">Service</SelectItem>
                                      <SelectItem value="accessories">Accessories</SelectItem>
                                      <SelectItem value="management">Management</SelectItem>
                                      <SelectItem value="after Sales">After Sales</SelectItem>
                                      <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <Select name="type"   >
                                    <SelectTrigger className="w-auto ml-auto focus:border-[#60b9fd]  text-foreground border-white">
                                      <SelectValue placeholder="Select Type" />
                                    </SelectTrigger>
                                    <SelectContent className='bg-white'>
                                      <SelectItem value="phone">Phone</SelectItem>
                                      <SelectItem value="email">Email</SelectItem>
                                      <SelectItem value="text">Text</SelectItem>
                                      <SelectItem value="copy">Copy</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <div className="relative">
                                <Input name="category" type="text" className="text-foreground border-white bg-background block w-full h-10 pl-[80px]" />
                                <label className="absolute left-2 top-2 text-foreground">Category:</label>
                              </div>
                              {/* Row 3 */}
                              <div className="py-1 flex justify-between">

                                <div
                                  onClick={() => setDetails(!details)}
                                  className="flex cursor-pointer items-center hover:text-primary"
                                >
                                  <p className="text-bold text-foreground hover:text-primary">cc bcc</p>
                                </div>
                              </div>
                              {/* Details */}
                              {details && (
                                <div className="flex flex-row justify-between">
                                  <div className="relative py-1">
                                    <Input name="cc" placeholder="cc" type="text" className='text-foreground block w-full h-10 pl-8 border-white bg-[#363a3f] ' />
                                    <label className="absolute left-2 top-[5px] text-foreground">cc</label>
                                  </div>

                                  <div className="relative py-1">
                                    <Input name="bcc" placeholder="bcc" type="text" className='text-foreground border-white bg-[#363a3f]  block w-full h-10 pl-8' />
                                    <label className="absolute left-2 top-[5px] text-foreground">bcc</label>
                                  </div>
                                </div>
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

                              <div className=" p-1 mt-auto">
                                <div className="mr-auto px-2">
                                  {/*  <RichTextExample /> */}
                                  <input defaultValue={text} />

                                  <EditorTiptapHook content={contentValue} handleUpdate={handleUpdateContent} />
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
                                    } className="border-white text-foreground cursor-pointer border uppercase px-4 py-3">
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
                  <div className=" w-full h-[915px] overflow-y-scroll p-3 mt-5">
                    <div
                      className={` bg-background w-full  items-center  overflow-x-hidden  rounded-md  `}  >

                      <div className="flex flex-col space-y-4 mt-[50px] ">
                        <div
                          className={`border-white  bg-background  w-auto items-center overflow-x-hidden shadow-sm transition-all duration-500`}
                        >

                          {/* Your content here */}
                          <Form method="post">


                            <div className="bg-background ml-3  mr-3 mx-auto grid grid-cols-1 justify-center gap-4">
                              {/* Row 1 */}
                              <div className="relative">
                                <Input name="title" defaultValue={title}
                                  className="text-foreground border-white bg-background block w-full pl-[145px]"
                                  type="text" />
                                <label className="absolute left-2 top-[6px] text-foreground">Template Title:</label>
                              </div>
                              <div className="relative ">
                                <Input
                                  name="subject"
                                  defaultValue={subject}
                                  className="text-foreground border-white bg-background block w-full h-10 pl-[85px]"
                                  type="text" />
                                <label className="absolute left-2 top-2 text-foreground">Subject:</label>
                              </div>
                              {/* Row 2 */}
                              <div className="py-1">
                                <div className="flex flex-row space-between-2">
                                  <Select name="dept">
                                    <SelectTrigger className="w-auto focus:border-[#60b9fd] mr-1 text-foreground border-white">
                                      <SelectValue placeholder="Select a Dept" />
                                    </SelectTrigger>
                                    <SelectContent className='bg-white'>
                                      <SelectItem value="sales">Sales</SelectItem>
                                      <SelectItem value="service">Service</SelectItem>
                                      <SelectItem value="accessories">Accessories</SelectItem>
                                      <SelectItem value="management">Management</SelectItem>
                                      <SelectItem value="after Sales">After Sales</SelectItem>
                                      <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <Select name="type"  >
                                    <SelectTrigger className="w-auto ml-auto focus:border-[#60b9fd]  text-foreground border-white">
                                      <SelectValue placeholder="Select Type1" />
                                    </SelectTrigger>
                                    <SelectContent className='bg-white'>
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
                                  defaultValue={subject}
                                  className="text-foreground border-white bg-background block w-full h-10 pl-[100px]"
                                />
                                <label className="absolute left-2 top-2 text-foreground">Category:</label>
                              </div>
                              {/* Row 3 */}
                              <div className="py-1 flex justify-between">

                                <div
                                  onClick={() => setDetails(!details)}
                                  className="flex cursor-pointer items-center hover:text-primary"
                                >
                                  <p className="text-bold text-foreground hover:text-primary">cc bcc</p>
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
                                      className='text-foreground block w-full h-10 pl-8 border-white bg-[#363a3f] '
                                    />
                                    <label className="absolute left-2 top-[5px] text-foreground">cc</label>
                                  </div>

                                  <div className="relative py-1">
                                    <Input
                                      name="bcc"
                                      placeholder="bcc"

                                      type="text"
                                      className='text-foreground border-white bg-[#363a3f]  block w-full h-10 pl-8' />
                                    <label className="absolute left-2 top-[5px] text-foreground">bcc</label>
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
                                name="id"
                                type="hidden"
                                defaultValue={id}
                              />
                              <div className="p-1 mt-auto">
                                <div className="mr-auto px-2 mt-auto  mt-auto grid grid-cols-1    rounded-md">
                                  {/*  <RichTextExample /> */}

                                  <div
                                    className={cn(
                                      "z-10 mt-2 mb-1 w-[95%]  flex  flex-wrap max-auto items-center gap-1 rounded-md p-1   mx-auto",
                                      "bg-background text-foreground transition-all align-center justify-center",
                                      "sm:sticky sm:top-[120px]",
                                    )}
                                  >
                                    <select
                                      name="clientAtr"
                                      onChange={(event) => editor.commands.insertContent(clientAtr[event.target.value])}
                                      className='bg-background border border-white  text-foreground  focus:border-[#60b9fd] rounded-md p-2 '
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
                                      onChange={(event) => editor.commands.insertContent(wantedVehAttr[event.target.value])}
                                      className='bg-background border border-white  text-foreground   focus:border-[#60b9fd] rounded-md p-2 '   >
                                      <option value="">Wanted Veh</option>
                                      {Object.entries(wantedVehAttr).map(([title, value]) => (
                                        <option key={title} value={title}>
                                          {title}
                                        </option>
                                      ))}
                                    </select>
                                    <select
                                      name="tradeVehAttr"
                                      onChange={(event) => editor.commands.insertContent(tradeVehAttr[event.target.value])}
                                      className='bg-background border border-white  text-foreground   focus:border-[#60b9fd] rounded-md p-2 '         >
                                      <option value="">Trade Veh</option>
                                      {Object.entries(tradeVehAttr).map(([title, value]) => (
                                        <option key={title} value={title}>
                                          {title}
                                        </option>
                                      ))}
                                    </select>
                                    <select
                                      name="salesPersonAttr"
                                      onChange={(event) => editor.commands.insertContent(salesPersonAttr[event.target.value])}
                                      className='bg-background border border-white  text-foreground   focus:border-[#60b9fd] rounded-md p-2 '          >
                                      <option value="">Sales Person</option>
                                      {Object.entries(salesPersonAttr).map(([title, value]) => (
                                        <option key={title} value={title}>
                                          {title}
                                        </option>
                                      ))}
                                    </select>
                                    <select
                                      name="FandIAttr"
                                      onChange={(event) => editor.commands.insertContent(FandIAttr[event.target.value])}
                                      className='bg-background border border-white  text-foreground   focus:border-[#60b9fd] rounded-md p-2 '        >
                                      <option value="">F & I Manager</option>
                                      {Object.entries(FandIAttr).map(([title, value]) => (
                                        <option key={title} value={title}>
                                          {title}
                                        </option>
                                      ))}
                                    </select>
                                    <select
                                      name="dealerInfo"
                                      onChange={(event) => editor.commands.insertContent(dealerInfo[event.target.value])}
                                      className='bg-background border border-white  text-foreground   focus:border-[#60b9fd] rounded-md p-2 '        >
                                      <option value="">Dealer Info</option>
                                      {Object.entries(dealerInfo).map(([title, value]) => (
                                        <option key={title} value={title}>
                                          {title}
                                        </option>
                                      ))}
                                    </select>
                                    <select
                                      name="financeInfo"
                                      onChange={(event) => editor.commands.insertContent(financeInfo[event.target.value])}
                                      className='bg-background border border-white  text-foreground   focus:border-[#60b9fd] rounded-md p-2 '        >
                                      <option value="">Finance Info</option>
                                      {Object.entries(financeInfo).map(([title, value]) => (
                                        <option key={title} value={title}>
                                          {title}
                                        </option>
                                      ))}
                                    </select>

                                  </div>
                                  <div
                                    className={cn(
                                      "z-10 mb-1 w-[95%] mt-1 flex flex-wrap max-auto items-center gap-1 rounded-md p-1  mx-auto",
                                      "bg-background text-foreground transition-all justify-center",
                                      // "sm:sticky sm:top-[80px]",
                                    )}
                                  >
                                    <button
                                      onClick={() => editor.chain().focus().toggleBold().run()}
                                      className={editor.isActive("bold") ? buttonActive : buttonInactive}
                                    >
                                      <FaBold className="text-xl hover:text-primary" />
                                    </button>
                                    <button
                                      onClick={() => editor.chain().focus().toggleItalic().run()}
                                      className={editor.isActive("italic") ? buttonActive : buttonInactive}
                                    >
                                      <FaItalic className="text-xl hover:text-primary" />
                                    </button>
                                    <button
                                      onClick={() => editor.chain().focus().toggleStrike().run()}
                                      className={editor.isActive("strike") ? buttonActive : buttonInactive}
                                    >
                                      <FaStrikethrough className="text-xl hover:text-primary" />
                                    </button>

                                    <Minus color="#09090b" strokeWidth={1.5} />
                                    <button
                                      onClick={handleSetLink}
                                      className={editor.isActive("link") ? buttonActive : buttonInactive}
                                    >
                                      <FaLink className="text-xl hover:text-primary" />
                                    </button>
                                    <button
                                      onClick={() => editor.chain().focus().unsetLink().run()}
                                      disabled={!editor.isActive("link")}
                                      className={!editor.isActive("link") ? cn(buttonInactive, "opacity-25") : buttonInactive}
                                    >
                                      <FaUnlink className="text-xl hover:text-primary" />
                                    </button>
                                    <Minus color="#000" strokeWidth={1.5} />
                                    <button
                                      onClick={() => editor.chain().focus().toggleBlockquote().run()}
                                      className={editor.isActive('blockquote') ? buttonActive : buttonInactive}
                                    >
                                      <FaQuoteLeft className="text-xl hover:text-primary" />
                                    </button>
                                    <button
                                      onClick={() => editor.chain().focus().toggleCode().run()}
                                      className={editor.isActive('code') ? buttonActive : buttonInactive}
                                      disabled={!editor.can().chain().focus().toggleCode().run()}
                                    >
                                      <FaFileCode className="text-xl hover:text-primary" />
                                    </button>
                                    <button
                                      onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                                      className={editor.isActive('codeBlock') ? buttonActive : buttonInactive}
                                    >
                                      <BiCodeBlock className="text-xl hover:text-primary" />
                                    </button>
                                    <button
                                      onClick={() => editor.chain().focus().toggleBulletList().run()}
                                      className={editor.isActive('bulletList') ? buttonActive : buttonInactive}
                                    >
                                      <FaList className="text-xl hover:text-primary" />
                                    </button>
                                    <button
                                      onClick={() => editor.chain().focus().toggleOrderedList().run()}
                                      className={editor.isActive('orderedList') ? buttonActive : buttonInactive}
                                    >
                                      <FaListOl className="text-xl hover:text-primary" />
                                    </button>

                                    <Minus color="#000" strokeWidth={1.5} />
                                    <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>
                                      <MdHorizontalRule className="text-xl hover:text-primary" />
                                    </button>
                                    <button onClick={() => editor.chain().focus().setHardBreak().run()}>
                                      <IoMdReturnLeft className="text-xl hover:text-primary" />
                                    </button>
                                    <Minus color="#000" strokeWidth={1.5} />
                                    <button
                                      onClick={() => editor.chain().focus().undo().run()}
                                      disabled={!editor.can().chain().focus().undo().run()}
                                    >
                                      <FaUndo className="text-xl hover:text-primary" />
                                    </button>
                                    <button
                                      onClick={() => editor.chain().focus().redo().run()}
                                      disabled={!editor.can().chain().focus().redo().run()}
                                    >
                                      <FaRedo className="text-xl hover:text-primary" />
                                    </button>
                                    <Minus color="#000" strokeWidth={1.5} />
                                    <button onClick={() => editor.chain().focus().setTextAlign('left').run()}
                                      className={editor.isActive({ textAlign: 'left' }) ? buttonActive : buttonInactive}
                                    >
                                      <FaAlignLeft className="text-xl hover:text-primary" />
                                    </button>
                                    <button
                                      onClick={() => editor.chain().focus().setTextAlign('center').run()}
                                      className={editor.isActive({ textAlign: 'center' }) ? buttonActive : buttonInactive}
                                    >
                                      <FaAlignCenter className="text-xl hover:text-primary" />
                                    </button>
                                    <button
                                      onClick={() => editor.chain().focus().setTextAlign('right').run()}
                                      className={editor.isActive({ textAlign: 'right' }) ? buttonActive : buttonInactive}
                                    >
                                      <FaAlignRight className="text-xl hover:text-primary" />
                                    </button>
                                    <button
                                      onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                                      className={editor.isActive({ textAlign: 'justify' }) ? buttonActive : buttonInactive}
                                    >
                                      <FaAlignJustify className="text-xl hover:text-primary" />
                                    </button>
                                    <Minus color="#000" strokeWidth={1.5} />
                                    <button
                                      onClick={() => editor.chain().focus().toggleHighlight().run()}
                                      className={editor.isActive('highlight') ? buttonActive : buttonInactive}
                                    >
                                      <FaHighlighter className="text-xl hover:text-primary" />
                                    </button>
                                    <input
                                      type="color"
                                      onInput={event => editor.chain().focus().setColor(event.target.value).run()}
                                      value={editor.getAttributes('textStyle').color}
                                      data-testid="setColor"
                                    />
                                    <button
                                      onClick={() => editor.chain().focus().unsetColor().run()}
                                      className={editor.isActive('highlight') ? buttonActive : buttonInactive}
                                    >
                                      <FaEraser className="text-xl hover:text-primary" />
                                    </button>
                                    <Minus color="#000" strokeWidth={1.5} />
                                    <button
                                      onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                                      className={editor.isActive('heading', { level: 1 }) ? buttonActive : buttonInactive}
                                    >
                                      <Heading1 strokeWidth={1.5} className="text-xl hover:text-primary" />
                                    </button>
                                    <button
                                      onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                                      className={editor.isActive('heading', { level: 2 }) ? buttonActive : buttonInactive}

                                    >
                                      <Heading2 strokeWidth={1.5} className="text-xl hover:text-primary" />
                                    </button>
                                    <button
                                      onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                                      className={editor.isActive('heading', { level: 3 }) ? buttonActive : buttonInactive}

                                    >
                                      <Heading3 strokeWidth={1.5} className="text-xl hover:text-primary" />
                                    </button>
                                  </div>
                                  <div>
                                    <BubbleMenu
                                      editor={editor}
                                      tippyOptions={{ duration: 100 }}
                                      className={cn(
                                        "flex items-center gap-1 rounded-md p-1 bg-white",
                                        "  text-black shadow dark:bg-slate10",
                                      )}
                                    >
                                      <button
                                        type="button"
                                        onClick={() => editor.chain().focus().toggleBold().run()}
                                        className={editor.isActive("bold") ? buttonActive : buttonInactive}
                                      >
                                        <IconMatch className="size-4" icon="editor-bold" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => editor.chain().focus().toggleItalic().run()}
                                        className={editor.isActive("italic") ? buttonActive : buttonInactive}
                                      >
                                        <IconMatch className="size-4" icon="editor-italic" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => editor.chain().focus().toggleStrike().run()}
                                        className={editor.isActive("strike") ? buttonActive : buttonInactive}
                                      >
                                        <IconMatch className="size-4" icon="editor-strikethrough" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={handleSetLink}
                                        className={editor.isActive("link") ? buttonActive : buttonInactive}
                                      >
                                        <IconMatch className="size-4" icon="editor-link" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => editor.chain().focus().unsetLink().run()}
                                        disabled={!editor.isActive("link")}
                                        className={!editor.isActive("link") ? cn(buttonInactive, "opacity-25") : buttonInactive}
                                      >
                                        <IconMatch className="size-4" icon="editor-link-unlink" />
                                      </button>

                                    </BubbleMenu>
                                  </div>


                                  <br />
                                  <EditorContent editor={editor} className=" p-3 mb-2 mt-auto cursor-text   bg-white mx-auto w-[95%] rounded-md" />
                                  <br />


                                  <input type='hidden' defaultValue={text} name='body' />
                                  <br />

                                </div>
                              </div>
                            </div>
                          </Form>
                        </div>
                      </div>
                    </div >
                  </div >
                )}
              </div>
            </CardContent>

          </Card>


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
            <div className="text-foreground flex w-full items-center justify-between hover:text-primary">
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

