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
import { FaBold, FaStrikethrough, FaItalic, FaUnlink, FaLink, FaList, FaListOl, FaFileCode, FaQuoteLeft, FaUndo, FaAlignJustify, FaAlignLeft, FaRedo, FaAlignRight, FaAlignCenter, FaHighlighter, FaEraser, FaUnderline } from "react-icons/fa";
import { BiCodeBlock } from "react-icons/bi";
import { MdHorizontalRule } from "react-icons/md";
import { IoMdReturnLeft } from "react-icons/io";

import { IconMatch } from "./icons"
import { buttonVariants } from "../ui/button"
import { cn } from "../ui/utils"
import { parseHTML } from "~/utils/html"
import { fixUrl } from "~/utils/url"
import { prisma } from "~/libs"

/**
 * Tiptap
 *
 * Starter Kit https://tiptap.dev/api/extensions/starter-kit
 * Blockquote, Bold, Bulletlist, Code, CodeBlock, Document,
 * Dropcursor, Gapcursor, Hardbreak, Heading, History,
 * HorizontalRule, Italic, Listitem, Orderedlist, Paragraph,
 * Strike, Text
 *
 * Features:
 * - Toolbar
 * - Manage link/URL
 * - Add image
 */
export function Editor(content, handleUpdate) {
  const CustomDocument = Document.extend({ content: 'taskList', })
  const CustomTaskItem = TaskItem.extend({ content: 'inline*', })
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
      if (handleUpdate) {
        handleUpdate(editor.getHTML())
      }
    },
  })
  return editor
}


export function EditorTiptapHook({ content, handleUpdate, }: {
  content?: Content | string
  handleUpdate?: (htmlString: string) => void
}) {
  const editor = Editor(content, handleUpdate)
  const [text, setText] = useState('')
  useEffect(() => {
    const text = window.localStorage.getItem("templateEmail");
    setText(text);
  }, []);

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
  })


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
  const textareaRef = useRef();

  function handleDropdownChange(value) {
    setText(value);
  }



  if (!editor) return null
  return (
    <div className="p-1">
      <div className="mr-auto px-2   mt-auto grid grid-cols-1 border border-black rounded-md">
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
            className='bg-black border border-white  text-foreground  focus:border-[#60b9fd] rounded-md p-2 '
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
            className='bg-black border border-white  text-foreground   focus:border-[#60b9fd] rounded-md p-2 '   >
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
            className='bg-black border border-white  text-foreground   focus:border-[#60b9fd] rounded-md p-2 '         >
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
            className='bg-black border border-white  text-foreground   focus:border-[#60b9fd] rounded-md p-2 '          >
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
            className='bg-black border border-white  text-foreground   focus:border-[#60b9fd] rounded-md p-2 '        >
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
            className='bg-black border border-white  text-foreground   focus:border-[#60b9fd] rounded-md p-2 '        >
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
            className='bg-black border border-white  text-foreground   focus:border-[#60b9fd] rounded-md p-2 '        >
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
        <EditorContent editor={editor} className="mt-1 p-3 mb-2  cursor-text border border-black bg-white mx-auto w-[95%] rounded-md text-black" />
        <br />


        <input type='hidden' defaultValue={text} name='body' />
        <br />

      </div>
    </div>
  )
}

export function EditorTiptapContext({
  content,
  children,
}: {
  content?: string
  children?: React.ReactNode
}) {
  const [text, setText] = useState('')
  useEffect(() => {
    const text = window.localStorage.getItem("templateEmail");
    setText(text);
    console.log(text, 'texttt')
  }, []);
  return (
    <EditorProvider
      extensions={[StarterKit, Highlight, Typography, Underline]}
      content={content || text}
      editorProps={{
        attributes: { class: "prose-config cursor-text" },
      }}
    >
      {children}
    </EditorProvider>
  )
}

export function EditorTiptapContextViewHTML() {
  const { editor } = useCurrentEditor()
  if (!editor) return null
  return (
    <article className="prose-config whitespace-pre-wrap">{parseHTML(editor.getHTML())}</article>
  )
}

export const onUpdate = ({ setText, handleUpdate }) => {
  let content;
  const editor = Editor(content, handleUpdate)
  const updatedText = editor?.getHTML();
  if (handleUpdate) {
    handleUpdate(updatedText);
  }
  return setText(updatedText);
};

//const contentExample = `<p> Write message here...</p>`
