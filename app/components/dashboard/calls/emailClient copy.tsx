import { Input, Button, TextArea, } from "~/components/ui/index";
import { useLoaderData, Form, useFetcher, useLocation, useNavigation } from "@remix-run/react";
import { PhoneOutcome, MenuScale, Mail, MessageText, User, ArrowDown, Calendar as CalendarIcon, WebWindowClose, } from "iconoir-react";
import { dashboardLoader } from "~/components/actions/dashboardCalls";
import financeFormSchema from "~/overviewUtils/financeFormSchema";
import { model } from "~/models";
import { authenticator } from "~/services/auth-service.server";
import { type ActionFunction, json, LoaderFunction } from "@remix-run/node";
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import { GetUser } from "~/utils/loader.server";
import { prisma } from "~/libs";
import { CreateCommunications } from '~/utils/communications/communications.server';
import { getLastAppointmentForFinance } from "~/utils/client/getLastApt.server";
import { toast } from 'sonner'
import { ButtonLoading } from "~/components/ui/button-loading";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/components/ui/tabs"
import { getSession } from '~/sessions/auth-session.server';

import {
  Dialog as RootDialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,

} from "~/components/ui/dialog"
import { SendEmail, TokenRegen } from "~/routes/__authorized/dealer/email/server";
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

import { IconMatch } from "~/components/libs/icons"
import { buttonVariants } from "~/components/ui/button"
import { cn } from "~/components/ui/utils"
import { parseHTML } from "~/utils/html"
import { fixUrl } from "~/utils/url"
import { conform, useForm, useInputEvent } from "@conform-to/react"



export async function loader({ request, params }: LoaderFunction) {
  const session = await getSession(request.headers.get("Cookie"));
  let tokens = session.get("accessToken")
  const refreshToken = session.get("refreshToken")
  return json({ tokens, refreshToken });
}

export default function EmailClient({ data, isButtonPressed, setIsButtonPressed }) {
  const { getTemplates, user, conversations, latestNotes, tokens, refreshToken } = useLoaderData();
  const [templates, setTemplates] = useState(getTemplates);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const today = new Date();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [text, setText] = React.useState('');
  const [cc, setCc] = useState(false)
  const [bcc, setBcc] = useState(false)
  const [convos, setConvos] = useState([])
  let content;
  let handleUpdate;

  //console.log(conversations)
  const handleChange = (event) => {
    const selectedTemplate = templates.find(template => template.title === event.target.value);
    setSelectedTemplate(selectedTemplate);
    editor?.commands.insertContent(selectedTemplate.body)
  };
  React.useEffect(() => {
    if (selectedTemplate) {
      setText(selectedTemplate.body);
      setSubject(selectedTemplate.subject);
    }
  }, [selectedTemplate]);

  useEffect(() => {
    async function GetPreviousConversations() {

      setConvos(conversations)
      return conversations
    }
    GetPreviousConversations()

  }, [data.id]);

  const navigation = useNavigation();
  const isSubmitting = navigation.formAction === "/user/dashboard/scripts";
  const [buttonText, setButtonText] = useState('Send Email');
  const [subject, setSubject] = useState('');
  let fetcher = useFetcher();
  const [createTemplate, setCreateTemplate] = useState('')
  const [note, setNote] = useState(null);
  async function userToken() { return await prisma.user.findUnique({ where: { email: user.mail } }) }
  const findNoteByCustomerId = (customerId) => { return latestNotes.find((note) => note && note.customerId === customerId); };
  useEffect(() => {
    const foundNote = findNoteByCustomerId(data.financeId);
    setNote(foundNote);
  }, [data.financeId]);

  // editor -------------------------
  const [textEditor, setTextEditor] = useState("");
  // const { user } = useRootLoaderData()
  const [newTemplate, setNewTemplate] = useState(false);

  const [searchTemplates, setSearchTemplates] = useState()
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedEmail, setSelectedEmail] = useState("");
  const [selectedDept, setSelectedDept] = useState("");


  const timerRef = React.useRef(0);

  React.useEffect(() => { return () => clearTimeout(timerRef.current); }, []);

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
  const [paragraph, setParagraph] = useState([{ type: 'paragraph', children: [{ text: 'A line of text in a paragraph.' }], },]);
  const [contentValue, setContentValue] = useState(text)
  const contentRef = useRef<HTMLInputElement>(null)
  const contentControl = useInputEvent({ ref: contentRef })

  useEffect(() => {
    if (text) {
      window.localStorage.setItem("templateEmail", text);
    }
  }, [text]);
  const [id, setId] = useState('')
  const [newTempState, setNewTempState] = useState(false)

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
  const [textareaValue, setTextareaValue] = useState("");

  function handleDropdownChange(value) {
    setText(value);
  }
  if (!editor) return null
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <p
          className="cursor-pointer text-foreground target:text-primary hover:text-primary" >
          <Mail className="" />
        </p>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className=" bg-background/80  fixed inset-0 backdrop-blur-sm" />
        <Dialog.Content className=" fixed left-[50%] top-[50%] max-h-[85%] w-[90vw] overflow-y-scroll translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white text-black p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none md:w-[950px]">

          <Dialog.Description className="text-mauve11 mb-5 mt-[10px] text-[15px] leading-normal ">
          </Dialog.Description>
          <Tabs defaultValue="account" className="w-auto">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="account">Email</TabsTrigger>
              <TabsTrigger value="password">Prev Interactions</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>
            <TabsContent value="account">
              <fetcher.Form method="post">

                <div className='flex flex-col'>
                  <label className=" mt-3 w-full text-left text-[15px] text-black" htmlFor="name">
                    Templates
                  </label>
                  <select
                    className={`border-black text-black  bg-white autofill:placeholder:text-text-black justifty-start h-8 cursor-pointer rounded border px-2 text-xs uppercase shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]`}
                    onChange={handleChange}>
                    <option value="">Select a template</option>
                    {templates && templates.filter(template => template.type === 'email').map((template, index) => (
                      <option key={index} value={template.title}>
                        {template.title}
                      </option>
                    ))}
                  </select>
                  <label className=" mt-3 w-full text-left text-[15px] text-black" htmlFor="name">
                    Subject
                  </label>
                  <Input
                    className=" text-black  bg-white shadow-violet7 focus:shadow-violet8 inline-flexw-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                    id="name"
                    name='subject'
                    value={subject}
                    placeholder="Subject"
                    onChange={(e) => setSubject(e.target.value)}

                  />

                  <div className="ml-auto flex px-2  ">
                    <p
                      onClick={() => setCc(!cc)}
                      className="cursor-pointer text-black px-2 text-right text-[12px] hover:text-primary">
                      cc
                    </p>
                    <p
                      onClick={() => setBcc(!bcc)}
                      className="cursor-pointer text-black px-2 text-right text-[12px] hover:text-primary ">
                      bcc
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {cc && (
                      <Input placeholder="cc:" name='ccAddress' className="rounded text-black bg-white" />
                    )}
                    {bcc && (
                      <Input placeholder="bcc:" name="bccAddress" className="rounded text-black bg-white" />
                    )}
                  </div>
                  <div className="p-1">
                    <div className="mr-auto px-2   mt-auto grid grid-cols-1  rounded-md">
                      {/*  <RichTextExample /> */}

                      <div
                        className={cn(
                          "z-10 mt-2 mb-1 w-[95%]  flex  flex-wrap max-auto items-center gap-1 rounded-md p-1   mx-auto",
                          "bg-white text-black transition-all align-center justify-center",
                          "sm:sticky sm:top-[120px]",
                        )}
                      >
                        <select
                          name="clientAtr"
                          onChange={(event) => editor.commands.insertContent(clientAtr[event.target.value])}
                          className='bg-white border border-black  text-black  focus:border-[#60b9fd] rounded-md p-2 '
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
                          className='bg-white border border-black  text-black  focus:border-[#60b9fd] rounded-md p-2 '   >
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
                          className='bg-white border border-black  text-black  focus:border-[#60b9fd] rounded-md p-2 '         >
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
                          className='bg-white border border-black  text-black  focus:border-[#60b9fd] rounded-md p-2 '          >
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
                          className='bg-white border border-black  text-black  focus:border-[#60b9fd] rounded-md p-2 '        >
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
                          className='bg-white border border-black  text-black  focus:border-[#60b9fd] rounded-md p-2 '        >
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
                          className='bg-white border border-black  text-black  focus:border-[#60b9fd] rounded-md p-2 '        >
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
                          "bg-white text-black transition-all justify-center",
                          // "sm:sticky sm:top-[80px]",
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

                        <Minus color="#ffffff" strokeWidth={1.5} />
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
                        <Minus color="#ffffff" strokeWidth={1.5} />
                        <button
                          onClick={() => editor.chain().focus().toggleBlockquote().run()}
                          className={editor.isActive('blockquote') ? 'is-active' : ''}
                        >
                          <Quote strokeWidth={0.75} />
                        </button>
                        <button
                          onClick={() => editor.chain().focus().toggleCode().run()}
                          disabled={
                            !editor.can()
                              .chain()
                              .focus()
                              .toggleCode()
                              .run()
                          }
                          className={editor.isActive('code') ? 'is-active' : ''}
                        >
                          <Code strokeWidth={1.5} />
                        </button>
                        <button
                          onClick={() => editor.chain().focus().toggleBulletList().run()}
                          className={editor.isActive('bulletList') ? 'is-active' : ''}
                        >
                          <List strokeWidth={1.5} />
                        </button>
                        <button
                          onClick={() => editor.chain().focus().toggleOrderedList().run()}
                          className={editor.isActive('orderedList') ? 'is-active' : ''}
                        >
                          <ListPlus strokeWidth={1.5} />
                        </button>
                        <button
                          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                          className={editor.isActive('codeBlock') ? 'is-active' : ''}
                        >
                          <Brackets strokeWidth={1.5} />
                        </button>
                        <Minus color="#ffffff" strokeWidth={1.5} />
                        <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>
                          <ScanLine strokeWidth={1.5} />
                        </button>
                        <button onClick={() => editor.chain().focus().setHardBreak().run()}>
                          <WrapText strokeWidth={0.75} />
                        </button>
                        <Minus color="#ffffff" strokeWidth={1.5} />
                        <button
                          onClick={() => editor.chain().focus().undo().run()}
                          disabled={
                            !editor.can()
                              .chain()
                              .focus()
                              .undo()
                              .run()
                          }
                        >
                          <Undo strokeWidth={1.5} />
                        </button>
                        <button
                          onClick={() => editor.chain().focus().redo().run()}
                          disabled={
                            !editor.can()
                              .chain()
                              .focus()
                              .redo()
                              .run()
                          }
                        >
                          <Redo strokeWidth={1.5} />
                        </button>
                        <Minus color="#ffffff" strokeWidth={1.5} />
                        <button onClick={() => editor.chain().focus().setTextAlign('left').run()} className={editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''}>
                          <AlignLeft strokeWidth={0.75} />
                        </button>
                        <button onClick={() => editor.chain().focus().setTextAlign('center').run()} className={editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''}>
                          <AlignCenter strokeWidth={0.75} />
                        </button>
                        <button onClick={() => editor.chain().focus().setTextAlign('right').run()} className={editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''}>
                          <AlignRight strokeWidth={0.75} />
                        </button>
                        <button onClick={() => editor.chain().focus().setTextAlign('justify').run()} className={editor.isActive({ textAlign: 'justify' }) ? 'is-active' : ''}>
                          <AlignJustify strokeWidth={0.75} />
                        </button>
                        <Minus color="#ffffff" strokeWidth={1.5} />
                        <button onClick={() => editor.chain().focus().toggleHighlight().run()} className={editor.isActive('highlight') ? 'is-active' : ''}>
                          <Highlighter strokeWidth={0.75} />
                        </button>
                        <Minus color="#ffffff" strokeWidth={1.5} />
                        <button
                          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                          className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
                        >
                          <Heading1 strokeWidth={0.75} />
                        </button>
                        <button
                          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                          className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
                        >
                          <Heading2 strokeWidth={0.75} />
                        </button>
                        <button
                          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                          className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
                        >
                          <Heading3 strokeWidth={0.75} />
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

                      <div>
                        <BubbleMenu
                          editor={editor}
                          tippyOptions={{ duration: 100 }}
                          className={cn(
                            "flex items-center gap-1 rounded-md p-1 bg-white",
                            "  text-black shadow dark:bg-slate10",
                          )}
                        >
                          <div className="grid grid-cols-2 w-full items-center justify-between  ">
                            <select
                              name="clientAtr"

                              onClick={(event) => editor.commands.insertContent(clientAtr[event.target.value])}
                              className='bg-background border-2  text-[#fff] border-[#fff] focus:border-[#60b9fd] rounded-md p-2 '
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
                              className='bg-background border-2  text-[#fff] rounded-md ml-2 border-[#fff] focus:border-[#60b9fd]  p-2 '            >
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
                              className='bg-background border-2  text-[#fff] rounded-md mt-2 border-[#fff] focus:border-[#60b9fd]  p-2 '            >
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
                              className='bg-background border-2  text-[#fff] rounded-md mt-2 ml-2 border-[#fff] focus:border-[#60b9fd] m-1 p-2 '            >
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
                              className='bg-background border-2  text-[#fff] border-[#fff] focus:border-[#60b9fd] rounded-md mt-2 p-2 '            >
                              <option value="">F & I Manager</option>
                              {Object.entries(FandIAttr).map(([title, value]) => (
                                <option key={title} value={title}>
                                  {title}
                                </option>
                              ))}
                            </select>
                          </div>
                        </BubbleMenu>
                      </div>
                      <br />
                      <EditorContent editor={editor} className="mt-1 p-3 mb-2  cursor-text border border-black bg-white mx-auto w-[95%] rounded-md" />
                      <br />


                      <input type='hidden' defaultValue={text} name='body' />
                      <br />

                    </div>
                  </div>
                </div>
                <input type='hidden' value={data.firstName} name='firstName' />
                <input type='hidden' value={data.lastName} name='lastName' />
                <input type='hidden' value={data.email} name='email' />
                <input type='hidden' value={data.email} name='customerEmail' />
                <input type="hidden" defaultValue={data.userEmail} name="userEmail" />
                <input type="hidden" defaultValue={data.id} name="financeId" />
                <input type="hidden" defaultValue={data.id} name="id" />
                <input type="hidden" defaultValue={data.brand} name="brand" />
                <input type='hidden' value='fullCustom' name='emailType' />
                <input type='hidden' value='Attempted' name='customerState' />
                <input type='hidden' value='Outgoing' name='direction' />
                <input type='hidden' value={data.model} name='unit' />
                <input type='hidden' value={data.brand} name='brand' />
                <input type='hidden' value={user.id} name='userId' />
                <input type='hidden' value='EmailClient' name='intent' />
                <input type='hidden' value={today} name='lastContact' />
                <input type="hidden" defaultValue={data.vin} name="vin" />
                <input type="hidden" defaultValue={data.stockNum} name="stockNum" />
                <input type='hidden' name='type' value='outgoing' />
                <input type='hidden' name='method' value='email' />
                <input type='hidden' name='leadId' value={data.activixId} />
                <input type='hidden' name='contactMethod' value='email' />
                <div className="mt-[25px] flex justify-between items-center">
                  <Button
                    onClick={() => {
                      //  handleEmailClick();
                      someFunction()
                      setButtonText('Email Sent');
                      toast.success(`Sent email to ${data.firstName}.`);
                    }}
                    name='emailType'
                    value='fullCustom'

                    className={` cursor-pointer mr-2 p-3 hover:text-primary hover:border-primary text-black border border-black font-bold uppercase text-xs rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all text-center duration-150 ${isButtonPressed ? ' bg-green-500 ' : 'bg-primary'} `}
                  >
                    {buttonText}
                  </Button>
                  {createTemplate === 'createEmailTemplate' && (<input type='hidden' name='intent' value={createTemplate} />)}
                </div>
              </fetcher.Form >
              <fetcher.Form method='post'>
                <input type='hidden' value={data.firstName} name='firstName' />
                <input type='hidden' value={data.lastName} name='lastName' />
                <input type='hidden' value={data.email} name='email' />
                <input type='hidden' value={data.email} name='customerEmail' />
                <input type="hidden" defaultValue={data.userEmail} name="userEmail" />
                <input type="hidden" defaultValue={data.id} name="financeId" />
                <input type="hidden" defaultValue={data.id} name="id" />
                <input type="hidden" defaultValue={data.brand} name="brand" />
                <input type='hidden' name='name' value={subject} />
                <input type='hidden' name='body' value={text} />
                <input type='hidden' name='userEmail' value={user.email} />
                <input type='hidden' name='subject' value='Copied from email client' />
                <input type='hidden' name='title' value='Copied from email client' />
                <input type="hidden" defaultValue={data.vin} name="vin" />
                <input type="hidden" defaultValue={data.stockNum} name="stockNum" />
                <ButtonLoading
                  size="lg"
                  name='intent'
                  value='createEmailTemplate'
                  type='submit'
                  isSubmitting={isSubmitting}
                  onClick={() => {
                    setIsButtonPressed(true);
                    setCreateTemplate("createEmailTemplate")
                    toast.message('Helping you become the hulk of sales...')
                  }}
                  loadingText="Loading..."
                  className="w-auto cursor-pointer mt-2  hover:text-primary hover:border-primary text-black border-black"
                >
                  Save As Template
                </ButtonLoading>
              </fetcher.Form >

            </TabsContent>
            <TabsContent value="password">
              <div className='max-h-[900px] overflow-y-scroll' >

                {convos && convos.filter(convo => convo.financeId === data.financeId).map((convo, index) => (
                  <div key={index} className="m-2 mx-auto w-[95%] cursor-pointer rounded-md border-1 border-[#ffffff4d] hover:border-primary  hover:text-primary active:border-primary">
                    <p className="my-2 ml-2 text-sm text-black">
                      Sent by: {convo.userName}
                    </p>
                    <div className="m-2 flex items-center justify-between">
                      <p className="text-lg font-bold text-black">
                        {convo.direction} / {convo.type} /  {convo.result}
                      </p>
                      <p className="text-sm text-black text-right ">
                        {new Date(convo.date).toLocaleString()}
                      </p>
                    </div>
                    <p className="my-2 ml-2 text-sm text-black">
                      {convo.subject}
                    </p>

                    <p className="my-2 ml-2 text-sm text-black">
                      {convo.content}...
                    </p>

                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="notes">
              <div className='max-h-[900px] overflow-y-scroll'>
                <>
                  <RootDialog>
                    <DialogTrigger asChild>
                      <Button variant='outline'>Add Note</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] bg-white">
                      <DialogHeader>
                        <DialogTitle>Add Note</DialogTitle>
                        <DialogDescription>
                        </DialogDescription>
                      </DialogHeader>
                      <fetcher.Form method="post">

                        <div className="grid gap-4 py-4">
                          <TextArea
                            placeholder="Type your message here."
                            name="customContent"
                            className="w-full rounded border-0 h-8 bg-background px-3 py-3 text-sm text-gray-300 placeholder-blue-600 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-primary placeholder:text-gray-300 placeholder:uppercase"
                          />
                          <Input type="hidden" defaultValue={user.name} name="author" />
                          <Input
                            type="hidden"
                            defaultValue={user.id}
                            name="customerId"
                          />
                          <Input
                            type="hidden"
                            defaultValue={data.id}
                            name="financeId"
                          />
                          <Input
                            type="hidden"
                            defaultValue="saveFinanceNote"
                            name="intent"
                          />
                          <div className="mt-2 flex justify-end cursor-pointer">
                            {/* saveFinanceNote */}
                            <Button
                              variant='outline'
                              name="intent"
                              type="submit"
                              className="mr-1 bg-transparent cursor-pointer hover:text-primary text-foreground"
                              value="saveFinanceNote"
                            >
                              Save
                            </Button>
                          </div>
                        </div>
                      </fetcher.Form>
                      <DialogFooter>
                        <Button type="submit">Save changes</Button>
                      </DialogFooter>
                    </DialogContent>
                  </RootDialog>
                  {note ? (
                    <div>{note.customContent}</div>
                  ) : (
                    <p>No notes at this time...</p>
                  )}
                </>
              </div>
            </TabsContent>
          </Tabs>
          <Dialog.Close asChild>
            <button
              className="text-black  hover:text-primary focus:shadow-violet7 absolute right-[10px] top-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
              aria-label="Close"
            >
              <Cross2Icon />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/*
  /**
   *     onSubmit={handleSubmit} ref={formRef}
   * <TextArea
                    value={text}
                    name="customContent"
                    className="border-black text-black h-[300px] bg-white"
                    placeholder="Type your message here."
                    ref={textareaRef}
                    onChange={(e) => setText(e.target.value)}
                  />
async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);

  const data = {
    customerFirstName: formData.get('customerFirstName'),
    customerLastName: formData.get('customerLastName'),
    customerEmail: formData.get('customerEmail'),
    financeId: formData.get('financeId'),
    userEmail: formData.get('userEmail'),
    brand: formData.get('brand'),
    id: formData.get('id'),
    intent: formData.get('intent'),
    template: formData.get('template'),
    subject: formData.get('subject'),
    customContent: formData.get('customContent'),
    title: formData.get('title'),
    vin: formData.get('vin'),
    stockNum: formData.get('stockNum'),
  }
  Object.keys(data).forEach(key => {
    formData.delete(key);
    formData.append(key, data[key]);
  });    //console.log(data, 'data')
  //const createComms = await CreateCommunications(data)
  const template = formData.get('template')
  if (template === "createEmailTemplate") {
    console.log('hit template')
    const promise2 = fetch('/emails/send/form', {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        console.log(`${response.url}: ${response.status}`);
      })
      .catch((error) => {
        console.error(`Failed to fetch: ${error}`);
      });
    console.log(promise2, 'promise2')

  } else {
    console.log('hit else')

    const promise2 = fetch('/leads/sales', {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        console.log(`${response.url}: ${response.status}`);
      })
      .catch((error) => {
        console.error(`Failed to fetch: ${error}`);
      });
    console.log(promise2, 'promise2')

    // Make second request
    const promise1 = fetch('/emails/send/payments', {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        console.log(`${response.url}: ${response.status}`);
      })
      .catch((error) => {
        console.error(`Failed to fetch: ${error}`);
      });

    Promise.all([promise2, promise1])
      .then((responses) => {
        for (const response of responses) {
          console.log(`${response}: ${response}`);
        }
      })
      .catch((error) => {
        console.error(`Failed to fetch: ${error}`);
      });
  }
}
export function EmailClient2() {
  const { finance } = useLoaderData();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const promise2 = fetch('/dashboard/calls', {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        console.log(`${response.url}: ${response.status}`);
      })
      .catch((error) => {
        console.error(`Failed to fetch: ${error}`);
      });

    const promise1 = fetch('/emails/send/payments', {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        console.log(`${response.url}: ${response.status}`);
      })
      .catch((error) => {
        console.error(`Failed to fetch: ${error}`);
      });

    Promise.all([promise1, promise2])
      .then((responses) => {
        for (const response of responses) {
          console.log(`${response.url}: ${response.status}`);
        }
      })
      .catch((error) => {
        console.error(`Failed to fetch: ${error}`);
      });
  }

  const id = finance.id ? finance.id.toString() : '';


  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>Email</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="data-[state=open]:animate-overlayShow fixed inset-0 bg-blackA6" />
        <Dialog.Content className="data-[state=open]:animate-contentShow fixed left-[50%] top-[50%] h-[550px] w-[700px]  translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
          <Dialog.Title className="m-0 text-[17px] font-medium text-mauve12">
            Email
          </Dialog.Title>
          <Dialog.Description className="mb-5 mt-[10px] text-[15px] leading-normal text-mauve11"></Dialog.Description>
          <Form method="post" onSubmit={handleSubmit}>
            <div className="flex flex-col">
              <label className=" w-full text-left text-[15px]" htmlFor="name">
                Subject
              </label>
              <input
                className=" inline-flex h-8 w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] shadow-violet7 outline-none focus:shadow-[0_0_0_2px] focus:shadow-violet8"
                id="name"
                name="subject"
                placeholder="Subject"
              />
              <label className=" w-full text-left text-[15px]" htmlFor="name">
                Preview - ie on the email console, it shows a breif preview of
                the email
              </label>
              <input
                className=" inline-flex h-8 w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] shadow-violet7 outline-none focus:shadow-[0_0_0_2px] focus:shadow-violet8"
                id="name"
                name="preview"
                placeholder="Preview"
              />
              <label
                className="w-[90px] text-left text-[15px]"
                htmlFor="username"
              >
                Body
              </label>
              <TextArea
                placeholder="Type your email here."
                name="customContent"
                className="mt-2 h-[250px]"
              />
            </div>
            <input
              type="hidden"
              value={finance.firstName}
              name="customerFirstName"
            />
            <input
              type="hidden"
              value={finance.lastName}
              name="customerLastName"
            />


            <input type='hidden' value={finance.firstName} name='customerFirstName' />
            <input type='hidden' value={finance.lastName} name='customerLastName' />
            <input type='hidden' value={finance.email} name='customerEmail' />
            <input type="hidden" defaultValue={finance.userEmail} name="userEmail" />
            <input type="hidden" defaultValue={finance.id} name="financeId" />
            <input type="hidden" defaultValue={id} name="id" />
            <input type="hidden" defaultValue={finance.brand} name="brand" />
            <input type='hidden' value='fullCustom' name='emailType' />
            <input type='hidden' value='Reached' name='customerState' />
            <input type='hidden' value='2DaysFromNow' name='intent' />

            <div className="mt-[25px] flex justify-end">
              <button
                name="emailType"
                value="fullCustom"
                type="submit"
                className="bg-green4 text-green11 hover:bg-green5 focus:shadow-green7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none"
              >
                Send
              </button>
            </div>
          </Form>
          <Dialog.Close asChild>
            <button
              className=" absolute right-[10px] top-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full hover:bg-violet4 focus:shadow-[0_0_0_2px] focus:shadow-violet7 focus:outline-none"
              aria-label="Close"
            >
              <WebWindowClose />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/**
 *
export default function EmailClient({ data }) {
  const { dashBoardCustURL } = useLoaderData();
  console.log(dashBoardCustURL)
  if (dashBoardCustURL === "/dashboard/calls") {
  return (
    <EmailClient1 data={data} />
  )
  }
  else {
    EmailClient2()
  }
}

export function EmailClient2() {
  const { finance } = useLoaderData();
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>Email</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="data-[state=open]:animate-overlayShow fixed inset-0 bg-blackA6" />
        <Dialog.Content className="data-[state=open]:animate-contentShow fixed left-[50%] top-[50%] h-[550px] w-[700px]  translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
          <Dialog.Title className="m-0 text-[17px] font-medium text-mauve12">
            Email
          </Dialog.Title>
          <Dialog.Description className="mb-5 mt-[10px] text-[15px] leading-normal text-mauve11"></Dialog.Description>
          <Form method="post" action="/emails/send/payments">
            <div className="flex flex-col">
              <label className=" w-full text-left text-[15px]" htmlFor="name">
                Subject
              </label>
              <input
                className=" inline-flex h-8 w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] shadow-violet7 outline-none focus:shadow-[0_0_0_2px] focus:shadow-violet8"
                id="name"
                name="subject"
                placeholder="Subject"
              />
              <label className=" w-full text-left text-[15px]" htmlFor="name">
                Preview - ie on the email console, it shows a breif preview of
                the email
              </label>
              <input
                className=" inline-flex h-8 w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] shadow-violet7 outline-none focus:shadow-[0_0_0_2px] focus:shadow-violet8"
                id="name"
                name="preview"
                placeholder="Preview"
              />
              <label
                className="w-[90px] text-left text-[15px]"
                htmlFor="username"
              >
                Body
              </label>
              <TextArea
                placeholder="Type your email here."
                name="customContent"
                className="mt-2 h-[250px]"
              />
            </div>
            <input
              type="hidden"
              value={finance.firstName}
              name="customerFirstName"
            />
            <input
              type="hidden"
              value={finance.lastName}
              name="customerLastName"
            />
            <input type="hidden" value={finance.email} name="customerEmail" />
            <input type="hidden" value="fullCustom" name="emailType" />
            <input type="hidden" value="Reached" name="customerState" />
            <input type="hidden" value="2DaysFromNow" name="intent" />
            <div className="mt-[25px] flex justify-end">
              <button
                name="emailType"
                value="fullCustom"
                type="submit"
                className="bg-green4 text-green11 hover:bg-green5 focus:shadow-green7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none"
              >
                Send
              </button>
            </div>
          </Form>
          <Dialog.Close asChild>
            <button
              className=" absolute right-[10px] top-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full hover:bg-violet4 focus:shadow-[0_0_0_2px] focus:shadow-violet7 focus:outline-none"
              aria-label="Close"
            >
              <WebWindowClose />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}


const EmailClient1 = ({ data }) => (
    <Dialog.Root>
        <Dialog.Trigger asChild>
            <Mail />
        </Dialog.Trigger>
        <Dialog.Portal>
            <Dialog.Overlay className="bg-blackA6 data-[state=open]:animate-overlayShow fixed inset-0" />
            <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] h-[550px] w-[700px]  translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
                <Dialog.Title className="text-mauve12 m-0 text-[17px] font-medium">
                    Email
                </Dialog.Title>
                <Dialog.Description className="text-mauve11 mt-[10px] mb-5 text-[15px] leading-normal">
                </Dialog.Description>
                <Form method="post" action="/emails/send/payments">
                    <div className='flex flex-col'>
                        <label className=" w-full text-left text-[15px]" htmlFor="name">
                            Subject
                        </label>
                        <input
                            className=" shadow-violet7 focus:shadow-violet8 inline-flex h-8 w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                            id="name"
                            name='subject'
                            placeholder="Subject"
                        />
                        <label className=" w-full text-left text-[15px]" htmlFor="name">
                            Preview - ie on the email console, it shows a breif preview of the email
                        </label>
                        <input
                            className=" shadow-violet7 focus:shadow-violet8 inline-flex h-8 w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                            id="name"
                            name='preview'
                            placeholder="Preview"
                        />
                        <label className="w-[90px] text-left text-[15px]" htmlFor="username">
                            Body
                        </label>
                        <TextArea
                            placeholder="Type your email here."
                            name="customContent"
                            className="h-[250px] mt-2"
                        />
                    </div>
                    <input type='hidden' value={data.firstName} name='customerFirstName' />
                    <input type='hidden' value={data.lastName} name='customerLastName' />
                    <input type='hidden' value={data.email} name='customerEmail' />
                    <input type='hidden' value= name='intent' />

                    <input type='hidden' value='fullCustom' name='emailType' />
                    <input type='hidden' value='Reached' name='customerState' />
                    <input type='hidden' value='2DaysFromNow' name='intent' />
                    <div className="mt-[25px] flex justify-end">
                        <button name='emailType' value='fullCustom' type='submit' className="bg-green4 text-green11 hover:bg-green5 focus:shadow-green7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none">
                            Send
                        </button>
                    </div>
                </Form>
                <Dialog.Close asChild>
                    <button
                        className=" hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
                        aria-label="Close"
                    >
                        <WebWindowClose />
                    </button>
                </Dialog.Close>

            </Dialog.Content>
        </Dialog.Portal>
    </Dialog.Root>
);

*/


/**import { Input, Button, TextArea, } from "~/components/ui/index";
import { useLoaderData, Form, useFetcher, useLocation, useNavigation } from "@remix-run/react";
import { PhoneOutcome, MenuScale, Mail, MessageText, User, ArrowDown, Calendar as CalendarIcon, WebWindowClose, } from "iconoir-react";
import { dashboardLoader } from "~/components/actions/dashboardCalls";
import financeFormSchema from "~/routes/overviewUtils/financeFormSchema";
import React, { useEffect, useRef, useState } from 'react';
import { model } from "~/models";
import { authenticator } from "~/services/auth-service.server";
import { type ActionFunction, json } from "@remix-run/node";
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import { GetUser } from "~/utils/loader.server";
import { prisma } from "~/libs";
import { CreateCommunications } from '~/utils/communications/communications.server';
import { getLastAppointmentForFinance } from "~/utils/client/getLastApt.server";
import { toast } from 'sonner'
import { ButtonLoading } from "~/components/ui/button-loading";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/components/ui/tabs"
import { getSession } from '~/sessions/auth-session.server';

import {
  Dialog as RootDialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"

export const action: ActionFunction = async ({ req, request, params, }) => {
  const formPayload = Object.fromEntries(await request.formData());
  let formData = financeFormSchema.parse(formPayload);
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")
  console.log('in emailactrion')

    const user = await prisma.user.findUnique({
        where: { email: email },
        select: {
          id: true,
          name: true,
          username: true,
          email: true,
          subscriptionId: true,
          customerId: true,
          returning: true,
          phone: true,
          dealer: true,
          position: true,
          roleId: true,
          profileId: true,
          omvicNumber: true,
          role: { select: { symbol: true, name: true } },
        },
      });
  /// console.log(user, account, 'wquiote loadert')
  if (!user) {
    redirect('/login')
  }
  const userId = user?.id;
  const intent = formPayload.intent;
  const financeId = formData?.financeId;

  const promise2 = fetch('/emails/send/form', {
    method: 'POST',
    body: formData,
  })
    .then((response) => {
      console.log(`${response.url}: ${response.status}`);
    })
    .catch((error) => {
      console.error(`Failed to fetch: ${error}`);
    });
  //console.log(promise2, 'promise2')
  const comdata = {
    financeId: formData.financeId,
    userId: formData.userId,
    content: formData.customContent,
    title: formData.subject,
    direction: formData.direction,
    result: formData.customerState,
    subject: formData.subject,
    type: 'Email',
    userName: user?.name,
    date: new Date().toISOString(),
  }
  const completeApt = await getLastAppointmentForFinance(financeId);
  const setComs = await CreateCommunications(comdata)



  return json({ promise2, setComs, completeApt });
}

export default function EmailClient({ data, isButtonPressed, setIsButtonPressed }) {
  const { getTemplates, user, conversations, latestNotes } = useLoaderData();
  const [templates, setTemplates] = useState(getTemplates);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const today = new Date();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [text, setText] = React.useState('');
  const [cc, setCc] = useState(false)
  const [bcc, setBcc] = useState(false)
  const [convos, setConvos] = useState([])

  //console.log(conversations)
  const handleChange = (event) => {
    const selectedTemplate = templates.find(template => template.title === event.target.value);
    setSelectedTemplate(selectedTemplate);
  };
  React.useEffect(() => {
    if (selectedTemplate) {
      setText(selectedTemplate.body);
      setSubject(selectedTemplate.subject);
    }
  }, [selectedTemplate]);

  useEffect(() => {
    async function GetPreviousConversations() {

      setConvos(conversations)
      return conversations
    }
    GetPreviousConversations()

  }, [data.id]);

  const navigation = useNavigation();
  const isSubmitting = navigation.formAction === "/user/dashboard/scripts";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const data = {
      customerFirstName: formData.get('customerFirstName'),
      customerLastName: formData.get('customerLastName'),
      customerEmail: formData.get('customerEmail'),
      financeId: formData.get('financeId'),
      userEmail: formData.get('userEmail'),
      brand: formData.get('brand'),
      id: formData.get('id'),
      intent: formData.get('intent'),
      template: formData.get('template'),
      subject: formData.get('subject'),
      customContent: formData.get('customContent'),
      title: formData.get('title'),
      vin: formData.get('vin'),
      stockNum: formData.get('stockNum'),
    }
    Object.keys(data).forEach(key => {
      formData.delete(key);
      formData.append(key, data[key]);
    });    //console.log(data, 'data')
    //const createComms = await CreateCommunications(data)
    const template = formData.get('template')
    if (template === "createEmailTemplate") {
      console.log('hit template')
      const promise2 = fetch('/emails/send/form', {
        method: 'POST',
        body: formData,
      })
        .then((response) => {
          console.log(`${response.url}: ${response.status}`);
        })
        .catch((error) => {
          console.error(`Failed to fetch: ${error}`);
        });
      console.log(promise2, 'promise2')

    } else {
      console.log('hit else')

      const promise2 = fetch('/leads/sales', {
        method: 'POST',
        body: formData,
      })
        .then((response) => {
          console.log(`${response.url}: ${response.status}`);
        })
        .catch((error) => {
          console.error(`Failed to fetch: ${error}`);
        });
      console.log(promise2, 'promise2')

      // Make second request
      const promise1 = fetch('/emails/send/payments', {
        method: 'POST',
        body: formData,
      })
        .then((response) => {
          console.log(`${response.url}: ${response.status}`);
        })
        .catch((error) => {
          console.error(`Failed to fetch: ${error}`);
        });

      Promise.all([promise2, promise1])
        .then((responses) => {
          for (const response of responses) {
            console.log(`${response}: ${response}`);
          }
        })
        .catch((error) => {
          console.error(`Failed to fetch: ${error}`);
        });
    }
  }
  const [buttonText, setButtonText] = useState('Send Email');
  const [subject, setSubject] = useState('');
let fetcher = useFetcher();
const [createTemplate, setCreateTemplate] = useState('')

const [note, setNote] = useState(null);

const findNoteByCustomerId = (customerId) => {
  return latestNotes.find((note) => note && note.customerId === customerId);
};

// This useEffect ensures that setNote is called only once during the component mount
useEffect(() => {
  const foundNote = findNoteByCustomerId(data.financeId);
  //console.log(foundNote, 'found Note');
  setNote(foundNote);
}, [data.financeId]);



return (
  <Dialog.Root>
    <Dialog.Trigger asChild>
      <p
        className="cursor-pointer text-foreground target:text-primary hover:text-primary" >
        <Mail className="" />
      </p>
    </Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay className=" bg-background/80  fixed inset-0 backdrop-blur-sm" />
      <Dialog.Content className=" fixed left-[50%] top-[50%] max-h-[85%] w-[90vw] overflow-y-scroll translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white text-black p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none md:w-[750px]">

        <Dialog.Description className="text-mauve11 mb-5 mt-[10px] text-[15px] leading-normal ">
        </Dialog.Description>
        <Tabs defaultValue="account" className="w-auto">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="account">Email</TabsTrigger>
            <TabsTrigger value="password">Prev Interactions</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>
          <TabsContent value="account">

            <fetcher.Form onSubmit={handleSubmit}>
              <div className='flex flex-col'>
                <label className=" mt-3 w-full text-left text-[15px] text-black" htmlFor="name">
                  Templates
                </label>
                <select
                  className={`border-black text-black  bg-white autofill:placeholder:text-text-black justifty-start h-8 cursor-pointer rounded border px-2 text-xs uppercase shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]`}
                  onChange={handleChange}>
                  <option value="">Select a template</option>
                  {templates && templates.filter(template => template.type === 'email').map((template, index) => (
                    <option key={index} value={template.title}>
                      {template.title}
                    </option>
                  ))}
                </select>
                <label className=" mt-3 w-full text-left text-[15px] text-black" htmlFor="name">
                  Subject
                </label>
                <Input
                  className=" text-black  bg-white shadow-violet7 focus:shadow-violet8 inline-flexw-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                  id="name"
                  name='subject'
                  value={subject}
                  placeholder="Subject"
                  onChange={(e) => setSubject(e.target.value)}

                />

                <div className="ml-auto flex px-2  ">
                  <p
                    onClick={() => setCc(!cc)}
                    className="cursor-pointer text-black px-2 text-right text-[12px] hover:text-primary">
                    cc
                  </p>
                  <p
                    onClick={() => setBcc(!bcc)}
                    className="cursor-pointer text-black px-2 text-right text-[12px] hover:text-primary ">
                    bcc
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {cc && (
                    <Input placeholder="cc:" name='ccAddress' className="rounded text-black bg-white" />
                  )}
                  {bcc && (
                    <Input placeholder="bcc:" name="bccAddress" className="rounded text-black bg-white" />
                  )}
                </div>
                <label className="mt-3 w-[90px] text-left text-[15px] text-black" htmlFor="username">
                  Body
                </label>
                <TextArea
                  value={text}
                  name="customContent"
                  className="border-black text-black h-[300px] bg-white"
                  placeholder="Type your message here."
                  ref={textareaRef}
                  onChange={(e) => setText(e.target.value)}
                />
              </div>
              <input type='hidden' value={data.firstName} name='firstName' />
              <input type='hidden' value={data.lastName} name='lastName' />
              <input type='hidden' value={data.email} name='email' />
              <input type='hidden' value={data.email} name='customerEmail' />
              <input type="hidden" defaultValue={data.userEmail} name="userEmail" />
              <input type="hidden" defaultValue={data.id} name="financeId" />
              <input type="hidden" defaultValue={data.id} name="id" />
              <input type="hidden" defaultValue={data.brand} name="brand" />
              <input type='hidden' value='fullCustom' name='emailType' />
              <input type='hidden' value='Attempted' name='customerState' />
              <input type='hidden' value='Outgoing' name='direction' />
              <input type='hidden' value={data.model} name='unit' />
              <input type='hidden' value={data.brand} name='brand' />
              <input type='hidden' value={user.id} name='userId' />
              <input type='hidden' value='EmailClient' name='intent' />
              <input type='hidden' value={today} name='lastContact' />
              <input type="hidden" defaultValue={data.vin} name="vin" />
              <input type="hidden" defaultValue={data.stockNum} name="stockNum" />
              <div className="mt-[25px] flex justify-between items-center">


                <Button
                  onClick={() => {
                    // setIsButtonPressed(true);
                    // Change the button text
                    setButtonText('Email Sent');
                    toast.success(`Sent email to ${data.firstName}.`)
                  }}
                  name='emailType' value='fullCustom' type='submit'
                  className={` cursor-pointer mr-2 p-3 hover:text-primary hover:border-primary text-black border border-black font-bold uppercase text-xs rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all text-center duration-150 ${isButtonPressed ? ' bg-green-500 ' : 'bg-primary'} `}
                >
                  {buttonText}
                </Button>

                {createTemplate === 'createEmailTemplate' && (<input type='hidden' name='intent' value={createTemplate} />)}
              </div>
            </fetcher.Form >
            <fetcher.Form method='post'>
              <input type='hidden' value={data.firstName} name='firstName' />
              <input type='hidden' value={data.lastName} name='lastName' />
              <input type='hidden' value={data.email} name='email' />
              <input type='hidden' value={data.email} name='customerEmail' />
              <input type="hidden" defaultValue={data.userEmail} name="userEmail" />
              <input type="hidden" defaultValue={data.id} name="financeId" />
              <input type="hidden" defaultValue={data.id} name="id" />
              <input type="hidden" defaultValue={data.brand} name="brand" />
              <input type='hidden' name='name' value={subject} />
              <input type='hidden' name='body' value={text} />
              <input type='hidden' name='userEmail' value={user.email} />
              <input type='hidden' name='subject' value='Copied from email client' />
              <input type='hidden' name='title' value='Copied from email client' />
              <input type="hidden" defaultValue={data.vin} name="vin" />
              <input type="hidden" defaultValue={data.stockNum} name="stockNum" />
              <ButtonLoading
                size="lg"
                name='intent'
                value='createEmailTemplate'
                type='submit'
                isSubmitting={isSubmitting}
                onClick={() => {
                  setIsButtonPressed(true);
                  setCreateTemplate("createEmailTemplate")
                  toast.message('Helping you become the hulk of sales...')
                }}
                loadingText="Loading..."
                className="w-auto cursor-pointer mt-2  hover:text-primary hover:border-primary text-black border-black"
              >
                Save As Template
              </ButtonLoading>
            </fetcher.Form >

          </TabsContent>
          <TabsContent value="password">
            <div className='max-h-[900px] overflow-y-scroll' >

              {convos && convos.filter(convo => convo.financeId === data.financeId).map((convo, index) => (
                <div key={index} className="m-2 mx-auto w-[95%] cursor-pointer rounded-md border-1 border-[#ffffff4d] hover:border-primary  hover:text-primary active:border-primary">
                  <p className="my-2 ml-2 text-sm text-black">
                    Sent by: {convo.userName}
                  </p>
                  <div className="m-2 flex items-center justify-between">
                    <p className="text-lg font-bold text-black">
                      {convo.direction} / {convo.type} /  {convo.result}
                    </p>
                    <p className="text-sm text-black text-right ">
                      {new Date(convo.date).toLocaleString()}
                    </p>
                  </div>
                  <p className="my-2 ml-2 text-sm text-black">
                    {convo.subject}
                  </p>

                  <p className="my-2 ml-2 text-sm text-black">
                    {convo.content}...
                  </p>

                </div>
              ))}
            </div>

          </TabsContent>
          <TabsContent value="notes">

            <div className='max-h-[900px] overflow-y-scroll'>
              <>
                <RootDialog>
                  <DialogTrigger asChild>
                    <Button variant='outline'>Add Note</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Add Note</DialogTitle>
                      <DialogDescription>
                        Click save when you're done.
                      </DialogDescription>
                    </DialogHeader>
                    <fetcher.Form method="post">

                      <div className="grid gap-4 py-4">
                        <TextArea
                          placeholder="Type your message here."
                          name="customContent"
                          className="w-full rounded border-0 h-8 bg-background px-3 py-3 text-sm text-gray-300 placeholder-blue-600 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-primary placeholder:text-gray-300 placeholder:uppercase"
                        />
                        <Input type="hidden" defaultValue={user.name} name="author" />
                        <Input
                          type="hidden"
                          defaultValue={user.id}
                          name="customerId"
                        />
                        <Input
                          type="hidden"
                          defaultValue={data.id}
                          name="financeId"
                        />
                        <Input
                          type="hidden"
                          defaultValue="saveFinanceNote"
                          name="intent"
                        />
                        <div className="mt-2 flex justify-end cursor-pointer">
<Button
  variant='outline'
  name="intent"
  type="submit"
  className="mr-1 bg-transparent cursor-pointer hover:text-primary text-foreground"
  value="saveFinanceNote"

>
  Save
</Button>
                        </div >

                      </div >
                    </fetcher.Form >

  <DialogFooter>
    <Button type="submit">Save changes</Button>
  </DialogFooter>
                  </DialogContent >
                </RootDialog >
{
  note?(
                  <div> { note.customContent }</div >
                ) : (
  <p>No notes at this time...</p>
)}
              </>
            </div >
          </TabsContent >
        </Tabs >



  <Dialog.Close asChild>
    <button
      className="text-black  hover:text-primary focus:shadow-violet7 absolute right-[10px] top-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
      aria-label="Close"
    >
      <Cross2Icon />
    </button>
  </Dialog.Close>
      </Dialog.Content >
    </Dialog.Portal >
  </Dialog.Root >
);


/*
export function EmailClient2() {
  const { finance } = useLoaderData();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const promise2 = fetch('/dashboard/calls', {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        console.log(`${response.url}: ${response.status}`);
      })
      .catch((error) => {
        console.error(`Failed to fetch: ${error}`);
      });

    const promise1 = fetch('/emails/send/payments', {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        console.log(`${response.url}: ${response.status}`);
      })
      .catch((error) => {
        console.error(`Failed to fetch: ${error}`);
      });

    Promise.all([promise1, promise2])
      .then((responses) => {
        for (const response of responses) {
          console.log(`${response.url}: ${response.status}`);
        }
      })
      .catch((error) => {
        console.error(`Failed to fetch: ${error}`);
      });
  }

  const id = finance.id ? finance.id.toString() : '';


  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>Email</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="data-[state=open]:animate-overlayShow fixed inset-0 bg-blackA6" />
        <Dialog.Content className="data-[state=open]:animate-contentShow fixed left-[50%] top-[50%] h-[550px] w-[700px]  translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
          <Dialog.Title className="m-0 text-[17px] font-medium text-mauve12">
            Email
          </Dialog.Title>
          <Dialog.Description className="mb-5 mt-[10px] text-[15px] leading-normal text-mauve11"></Dialog.Description>
          <Form method="post" onSubmit={handleSubmit}>
            <div className="flex flex-col">
              <label className=" w-full text-left text-[15px]" htmlFor="name">
                Subject
              </label>
              <input
                className=" inline-flex h-8 w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] shadow-violet7 outline-none focus:shadow-[0_0_0_2px] focus:shadow-violet8"
                id="name"
                name="subject"
                placeholder="Subject"
              />
              <label className=" w-full text-left text-[15px]" htmlFor="name">
                Preview - ie on the email console, it shows a breif preview of
                the email
              </label>
              <input
                className=" inline-flex h-8 w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] shadow-violet7 outline-none focus:shadow-[0_0_0_2px] focus:shadow-violet8"
                id="name"
                name="preview"
                placeholder="Preview"
              />
              <label
                className="w-[90px] text-left text-[15px]"
                htmlFor="username"
              >
                Body
              </label>
              <TextArea
                placeholder="Type your email here."
                name="customContent"
                className="mt-2 h-[250px]"
              />
            </div>
            <input
              type="hidden"
              value={finance.firstName}
              name="customerFirstName"
            />
            <input
              type="hidden"
              value={finance.lastName}
              name="customerLastName"
            />


            <input type='hidden' value={finance.firstName} name='customerFirstName' />
            <input type='hidden' value={finance.lastName} name='customerLastName' />
            <input type='hidden' value={finance.email} name='customerEmail' />
            <input type="hidden" defaultValue={finance.userEmail} name="userEmail" />
            <input type="hidden" defaultValue={finance.id} name="financeId" />
            <input type="hidden" defaultValue={id} name="id" />
            <input type="hidden" defaultValue={finance.brand} name="brand" />
            <input type='hidden' value='fullCustom' name='emailType' />
            <input type='hidden' value='Reached' name='customerState' />
            <input type='hidden' value='2DaysFromNow' name='intent' />

            <div className="mt-[25px] flex justify-end">
              <button
                name="emailType"
                value="fullCustom"
                type="submit"
                className="bg-green4 text-green11 hover:bg-green5 focus:shadow-green7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none"
              >
                Send
              </button>
            </div>
          </Form>
          <Dialog.Close asChild>
            <button
              className=" absolute right-[10px] top-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full hover:bg-violet4 focus:shadow-[0_0_0_2px] focus:shadow-violet7 focus:outline-none"
              aria-label="Close"
            >
              <WebWindowClose />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/**
 *
export default function EmailClient({ data }) {
  const { dashBoardCustURL } = useLoaderData();
  console.log(dashBoardCustURL)
  if (dashBoardCustURL === "/dashboard/calls") {
  return (
    <EmailClient1 data={data} />
  )
  }
  else {
    EmailClient2()
  }
}

export function EmailClient2() {
  const { finance } = useLoaderData();
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>Email</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="data-[state=open]:animate-overlayShow fixed inset-0 bg-blackA6" />
        <Dialog.Content className="data-[state=open]:animate-contentShow fixed left-[50%] top-[50%] h-[550px] w-[700px]  translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
          <Dialog.Title className="m-0 text-[17px] font-medium text-mauve12">
            Email
          </Dialog.Title>
          <Dialog.Description className="mb-5 mt-[10px] text-[15px] leading-normal text-mauve11"></Dialog.Description>
          <Form method="post" action="/emails/send/payments">
            <div className="flex flex-col">
              <label className=" w-full text-left text-[15px]" htmlFor="name">
                Subject
              </label>
              <input
                className=" inline-flex h-8 w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] shadow-violet7 outline-none focus:shadow-[0_0_0_2px] focus:shadow-violet8"
                id="name"
                name="subject"
                placeholder="Subject"
              />
              <label className=" w-full text-left text-[15px]" htmlFor="name">
                Preview - ie on the email console, it shows a breif preview of
                the email
              </label>
              <input
                className=" inline-flex h-8 w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] shadow-violet7 outline-none focus:shadow-[0_0_0_2px] focus:shadow-violet8"
                id="name"
                name="preview"
                placeholder="Preview"
              />
              <label
                className="w-[90px] text-left text-[15px]"
                htmlFor="username"
              >
                Body
              </label>
              <TextArea
                placeholder="Type your email here."
                name="customContent"
                className="mt-2 h-[250px]"
              />
            </div>
            <input
              type="hidden"
              value={finance.firstName}
              name="customerFirstName"
            />
            <input
              type="hidden"
              value={finance.lastName}
              name="customerLastName"
            />
            <input type="hidden" value={finance.email} name="customerEmail" />
            <input type="hidden" value="fullCustom" name="emailType" />
            <input type="hidden" value="Reached" name="customerState" />
            <input type="hidden" value="2DaysFromNow" name="intent" />
            <div className="mt-[25px] flex justify-end">
              <button
                name="emailType"
                value="fullCustom"
                type="submit"
                className="bg-green4 text-green11 hover:bg-green5 focus:shadow-green7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none"
              >
                Send
              </button>
            </div>
          </Form>
          <Dialog.Close asChild>
            <button
              className=" absolute right-[10px] top-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full hover:bg-violet4 focus:shadow-[0_0_0_2px] focus:shadow-violet7 focus:outline-none"
              aria-label="Close"
            >
              <WebWindowClose />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}


const EmailClient1 = ({ data }) => (
    <Dialog.Root>
        <Dialog.Trigger asChild>
            <Mail />
        </Dialog.Trigger>
        <Dialog.Portal>
            <Dialog.Overlay className="bg-blackA6 data-[state=open]:animate-overlayShow fixed inset-0" />
            <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] h-[550px] w-[700px]  translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
                <Dialog.Title className="text-mauve12 m-0 text-[17px] font-medium">
                    Email
                </Dialog.Title>
                <Dialog.Description className="text-mauve11 mt-[10px] mb-5 text-[15px] leading-normal">
                </Dialog.Description>
                <Form method="post" action="/emails/send/payments">
                    <div className='flex flex-col'>
                        <label className=" w-full text-left text-[15px]" htmlFor="name">
                            Subject
                        </label>
                        <input
                            className=" shadow-violet7 focus:shadow-violet8 inline-flex h-8 w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                            id="name"
                            name='subject'
                            placeholder="Subject"
                        />
                        <label className=" w-full text-left text-[15px]" htmlFor="name">
                            Preview - ie on the email console, it shows a breif preview of the email
                        </label>
                        <input
                            className=" shadow-violet7 focus:shadow-violet8 inline-flex h-8 w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                            id="name"
                            name='preview'
                            placeholder="Preview"
                        />
                        <label className="w-[90px] text-left text-[15px]" htmlFor="username">
                            Body
                        </label>
                        <TextArea
                            placeholder="Type your email here."
                            name="customContent"
                            className="h-[250px] mt-2"
                        />
                    </div>
                    <input type='hidden' value={data.firstName} name='customerFirstName' />
                    <input type='hidden' value={data.lastName} name='customerLastName' />
                    <input type='hidden' value={data.email} name='customerEmail' />
                    <input type='hidden' value= name='intent' />

                    <input type='hidden' value='fullCustom' name='emailType' />
                    <input type='hidden' value='Reached' name='customerState' />
                    <input type='hidden' value='2DaysFromNow' name='intent' />
                    <div className="mt-[25px] flex justify-end">
                        <button name='emailType' value='fullCustom' type='submit' className="bg-green4 text-green11 hover:bg-green5 focus:shadow-green7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none">
                            Send
                        </button>
                    </div>
                </Form>
                <Dialog.Close asChild>
                    <button
                        className=" hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
                        aria-label="Close"
                    >
                        <WebWindowClose />
                    </button>
                </Dialog.Close>

            </Dialog.Content>
        </Dialog.Portal>
    </Dialog.Root>
);

*/

