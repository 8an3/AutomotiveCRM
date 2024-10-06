import Highlight from "@tiptap/extension-highlight"
import Text from '@tiptap/extension-text'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import Paragraph from '@tiptap/extension-paragraph'
import Typography from "@tiptap/extension-typography"
import Underline from "@tiptap/extension-underline"
import { Color } from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'
import StarterKit from "@tiptap/starter-kit"
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from "@tiptap/extension-placeholder"
import Link from "@tiptap/extension-link"

import ListItem from '@tiptap/extension-list-item'
import TaskItem from '@tiptap/extension-task-item'
import Document from '@tiptap/extension-document'
import {
  BubbleMenu,
  EditorContent,
  EditorProvider,
  useCurrentEditor,
  useEditor,
  type Content,
} from "@tiptap/react"
import React, { Component, useCallback, useEffect, useRef, useState } from "react"
import { Undo, Redo, Forward, List, ScanLine, Eraser, Code, ListPlus, Brackets, Pilcrow, Minus, AlignLeft, AlignCenter, AlignRight, AlignJustify, Highlighter, WrapText, Quote, Heading1, Heading2, Heading3, Reply, ReplyAll, Save } from 'lucide-react';
import { FaBold, FaStrikethrough, FaItalic, FaUnlink, FaLink, FaList, FaListOl, FaFileCode, FaQuoteLeft, FaUndo, FaAlignJustify, FaAlignLeft, FaRedo, FaAlignRight, FaAlignCenter, FaHighlighter, FaEraser, FaUnderline } from "react-icons/fa";
import { BiCodeBlock } from "react-icons/bi";
import { MdHorizontalRule } from "react-icons/md";
import { IoMdReturnLeft } from "react-icons/io";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion"

import { Button, buttonVariants } from "~/components/ui/button"
import { cn } from "~/components/ui/utils"
import { parseHTML } from "~/utils/html"
import { fixUrl } from "~/utils/url"
import { Form, useFetcher } from "@remix-run/react"
import { toast } from "sonner"
import { prisma } from "~/libs/prisma.server"
import { ComposeEmail, ComposeEmailTwo, ComposeFinanceClient, forwardEmail, replyAllEmail, replyMessage, SendNewEmail } from "~/components/microsoft/GraphService"
import {
  SelectContent, SelectLabel, SelectGroup,
  SelectValue, Select, SelectTrigger, SelectItem, Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/components"
import clsx from "clsx"
import { Input } from "~/components/ui/input"
import { HoverCard, HoverCardContent, HoverCardTrigger, } from "~/components/ui/hover-card"
import { clientAtr, dealerInfo, FandIAttr, financeInfo, salesPersonAttr, tradeVehAttr, wantedVehAttr } from "~/routes/__authorized/dealer/user/dashboard.templates"
import { Editor } from "~/components/libs/basicEditor"

export function EmailClientTextEditor({ content, subject: subjectInput, to: toInput, app, user, customer, mail }: {
  content?: any,
  user?: any,
  to?: any,
  subject?: any,
  app?: any,
  customer: any,
  mail: any
}) {
  const editor = Editor(content)
  const [templates, setTemplates] = useState('')

  useEffect(() => {
    async function GetTemps() {
      const response = await fetch('/dealer/api/templates');
      const data = await response.json();
      setTemplates(data)
    }
    GetTemps()

  }, []);

  const buttonActive = 'bg-white text-black rounded-md p-1 ';
  const buttonInactive = 'bg-background text-foreground hover:text-primary hover:bg-transparent';

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

  async function SaveDraft() {
    const date = new Date()
    const body = editor.getText()
    const saveTemplate = await prisma.emailTemplates.create({
      data: {
        body: body,
        userEmail: user.email,
        subject: `New Template ${date}`,
        title: `New Template ${date}`,
        category: 'New Template'
      }
    })
    return saveTemplate
  }

  async function handleChange(template) {
    editor?.commands.setContent({
      "type": "doc",
      "content": [
        {
          "type": "paragraph",
          "content": [
            {
              "type": "text",
              "text": template
            }
          ]
        }
      ]
    })
  }

  const [attribute, setAttribute] = useState("");
  function AttributeClick(item) {
    setAttribute(item.title);
    editor.commands.insertContent(item.attribute);
    console.log(item.attribute, "attribute");
  }

  function ClientAttributes({ className, items, ...props }) {
    return (
      <nav
        className={cn(
          "flex space-x-2 flex-row max-w-[95%] lg:flex-col lg:space-x-0 lg:space-y-1 mt-3",
          className
        )}
        {...props}
      >
        {items.map((item) => (
          <Button
            key={item.subject}
            variant="ghost"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              attribute === item.subject
                ? "bg-[#232324] hover:bg-muted/50 w-[90%]     "
                : "hover:bg-muted/50 text-[#a1a1aa]  w-[90%]  ",
              "justify-start w-[90%] "
            )}
            value={item.attribute}
            onClick={() => {
              AttributeClick(item);
            }}
          >
            {item.subject}
          </Button>
        ))}
      </nav>
    );
  }
  const [to, setTo] = useState(toInput)
  const [subject, setSubject] = useState(subjectInput)
  const [cc, setCc] = useState()
  const [bcc, setBcc] = useState()
  const [sendType, setSendType] = useState('Reply')
  const [sendPackage, setSendPackage] = useState(false)

  const fetcher = useFetcher()

  async function SendEmail() {
    let email
    const body = editor?.getHTML()
    if (!to || !sendType || !body || !mail.id) {
      toast.error(`Something went wrong... Did not send email...`, {
        description: !to ? 'Missing to email.' :
          !sendType ? 'Missing to email type.' :
            !body ? 'Missing body content.' :
              !mail.id ? 'Missing email details, try logging back in.' :
                null,
      })
    }
    email = await ComposeEmailTwo(
      app.authProvider!,
      subject,
      body,
      to,
      mail.from.emailAddress.name,
      //  mail.id,
    );
    toast.success('Email sent.')
    const formData = new FormData();
    formData.append("userEmail", user.email);
    formData.append("body", editor.getText());
    formData.append("subject", subject);
    formData.append("to", to);
    formData.append("userName", user.name);
    formData.append("intent", 'saveComms');
    console.log(formData, 'formData');
    fetcher.submit(formData, { method: "post" });
    editor.commands.clearContent()

    console.log(mail.id, to, mail.from.emailAddress.name, body, subject, email, 'text reply')
    return email
  }


  if (!editor) return null
  return (
    <div className="p-1">

      <div className="mr-auto   mt-auto grid grid-cols-1">
        <Tabs>
          <TabsList className='rounded-bl-none rounded-br-none'>
            <TabsTrigger value="account">Font Style</TabsTrigger>
            <TabsTrigger value="template">Templates</TabsTrigger>
            <TabsTrigger value="password">Inserting Options</TabsTrigger>
            <TabsTrigger value="Details">Details</TabsTrigger>
            <TabsTrigger value="X">X</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <div
              className={cn(
                "max-auto z-10 mx-auto mb-1 mt-1 flex w-[99%] flex-wrap items-center gap-1 rounded-md  p-1",
                "justify-center bg-background text-foreground transition-all"
                // "sm:sticky sm:top-[80px]",
              )}
            >
              <button
                onClick={() =>
                  editor.chain().focus().toggleBold().run()
                }
                className={
                  editor.isActive("bold")
                    ? buttonActive
                    : buttonInactive
                }
              >
                <FaBold className="text-xl hover:text-primary" />
              </button>
              <button
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .toggleItalic()
                    .run()
                }
                className={
                  editor.isActive("italic")
                    ? buttonActive
                    : buttonInactive
                }
              >
                <FaItalic className="text-xl hover:text-primary" />
              </button>
              <button
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .toggleStrike()
                    .run()
                }
                className={
                  editor.isActive("strike")
                    ? buttonActive
                    : buttonInactive
                }
              >
                <FaStrikethrough className="text-xl hover:text-primary" />
              </button>

              <Minus color="#09090b" strokeWidth={1.5} />
              <button
                onClick={handleSetLink}
                className={
                  editor.isActive("link")
                    ? buttonActive
                    : buttonInactive
                }
              >
                <FaLink className="text-xl hover:text-primary" />
              </button>
              <button
                onClick={() =>
                  editor.chain().focus().unsetLink().run()
                }
                disabled={!editor.isActive("link")}
                className={
                  !editor.isActive("link")
                    ? cn(buttonInactive, "opacity-25")
                    : buttonInactive
                }
              >
                <FaUnlink className="text-xl hover:text-primary" />
              </button>
              <Minus color="#000" strokeWidth={1.5} />
              <button
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .toggleBlockquote()
                    .run()
                }
                className={
                  editor.isActive("blockquote")
                    ? buttonActive
                    : buttonInactive
                }
              >
                <FaQuoteLeft className="text-xl hover:text-primary" />
              </button>
              <button
                onClick={() =>
                  editor.chain().focus().toggleCode().run()
                }
                className={
                  editor.isActive("code")
                    ? buttonActive
                    : buttonInactive
                }
                disabled={
                  !editor
                    .can()
                    .chain()
                    .focus()
                    .toggleCode()
                    .run()
                }
              >
                <FaFileCode className="text-xl hover:text-primary" />
              </button>
              <button
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .toggleCodeBlock()
                    .run()
                }
                className={
                  editor.isActive("codeBlock")
                    ? buttonActive
                    : buttonInactive
                }
              >
                <BiCodeBlock className="text-xl hover:text-primary" />
              </button>
              <button
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .toggleBulletList()
                    .run()
                }
                className={
                  editor.isActive("bulletList")
                    ? buttonActive
                    : buttonInactive
                }
              >
                <FaList className="text-xl hover:text-primary" />
              </button>
              <button
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .toggleOrderedList()
                    .run()
                }
                className={
                  editor.isActive("orderedList")
                    ? buttonActive
                    : buttonInactive
                }
              >
                <FaListOl className="text-xl hover:text-primary" />
              </button>

              <Minus color="#000" strokeWidth={1.5} />
              <button
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .setHorizontalRule()
                    .run()
                }
              >
                <MdHorizontalRule className="text-xl hover:text-primary" />
              </button>
              <button
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .setHardBreak()
                    .run()
                }
              >
                <IoMdReturnLeft className="text-xl hover:text-primary" />
              </button>
              <Minus color="#000" strokeWidth={1.5} />
              <button
                onClick={() =>
                  editor.chain().focus().undo().run()
                }
                disabled={
                  !editor.can().chain().focus().undo().run()
                }
              >
                <FaUndo className="text-xl hover:text-primary" />
              </button>
              <button
                onClick={() =>
                  editor.chain().focus().redo().run()
                }
                disabled={
                  !editor.can().chain().focus().redo().run()
                }
              >
                <FaRedo className="text-xl hover:text-primary" />
              </button>
              <Minus color="#000" strokeWidth={1.5} />
              <button
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .setTextAlign("left")
                    .run()
                }
                className={
                  editor.isActive({ textAlign: "left" })
                    ? buttonActive
                    : buttonInactive
                }
              >
                <FaAlignLeft className="text-xl hover:text-primary" />
              </button>
              <button
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .setTextAlign("center")
                    .run()
                }
                className={
                  editor.isActive({ textAlign: "center" })
                    ? buttonActive
                    : buttonInactive
                }
              >
                <FaAlignCenter className="text-xl hover:text-primary" />
              </button>
              <button
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .setTextAlign("right")
                    .run()
                }
                className={
                  editor.isActive({ textAlign: "right" })
                    ? buttonActive
                    : buttonInactive
                }
              >
                <FaAlignRight className="text-xl hover:text-primary" />
              </button>
              <button
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .setTextAlign("justify")
                    .run()
                }
                className={
                  editor.isActive({ textAlign: "justify" })
                    ? buttonActive
                    : buttonInactive
                }
              >
                <FaAlignJustify className="text-xl hover:text-primary" />
              </button>
              <Minus color="#000" strokeWidth={1.5} />
              <button
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .toggleHighlight()
                    .run()
                }
                className={
                  editor.isActive("highlight")
                    ? buttonActive
                    : buttonInactive
                }
              >
                <FaHighlighter className="text-xl hover:text-primary" />
              </button>
              <input
                type="color"
                onInput={(event) =>
                  editor
                    .chain()
                    .focus()
                    .setColor(event.target.value)
                    .run()
                }
                value={
                  editor.getAttributes("textStyle").color
                }
                data-testid="setColor"
              />
              <button
                onClick={() =>
                  editor.chain().focus().unsetColor().run()
                }
                className={
                  editor.isActive("highlight")
                    ? buttonActive
                    : buttonInactive
                }
              >
                <FaEraser className="text-xl hover:text-primary" />
              </button>
              <Minus color="#000" strokeWidth={1.5} />
              <button
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .toggleHeading({ level: 1 })
                    .run()
                }
                className={
                  editor.isActive("heading", { level: 1 })
                    ? buttonActive
                    : buttonInactive
                }
              >
                <Heading1
                  strokeWidth={1.5}
                  className="text-xl hover:text-primary"
                />
              </button>
              <button
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .toggleHeading({ level: 2 })
                    .run()
                }
                className={
                  editor.isActive("heading", { level: 2 })
                    ? buttonActive
                    : buttonInactive
                }
              >
                <Heading2
                  strokeWidth={1.5}
                  className="text-xl hover:text-primary"
                />
              </button>
              <button
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .toggleHeading({ level: 3 })
                    .run()
                }
                className={
                  editor.isActive("heading", { level: 3 })
                    ? buttonActive
                    : buttonInactive
                }
              >
                <Heading3
                  strokeWidth={1.5}
                  className="text-xl hover:text-primary"
                />
              </button>
            </div>
            <div>
              <BubbleMenu
                editor={editor}
                tippyOptions={{ duration: 100 }}
                className={cn(
                  "flex items-center gap-1 rounded-md bg-white p-1",
                  "  dark:bg-background0 text-black shadow"
                )}
              >
                <button
                  type="button"
                  onClick={() =>
                    editor
                      .chain()
                      .focus()
                      .toggleBold()
                      .run()
                  }
                  className={
                    editor.isActive("bold")
                      ? buttonActive
                      : buttonInactive
                  }
                >
                  <FaBold className="text-xl hover:text-primary" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    editor
                      .chain()
                      .focus()
                      .toggleItalic()
                      .run()
                  }
                  className={
                    editor.isActive("italic")
                      ? buttonActive
                      : buttonInactive
                  }
                >
                  <FaItalic className="text-xl hover:text-primary" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    editor
                      .chain()
                      .focus()
                      .toggleStrike()
                      .run()
                  }
                  className={
                    editor.isActive("strike")
                      ? buttonActive
                      : buttonInactive
                  }
                >
                  <FaStrikethrough className="text-xl hover:text-primary" />
                </button>

                <Minus color="#09090b" strokeWidth={1.5} />
                <button
                  type="button"
                  onClick={handleSetLink}
                  className={
                    editor.isActive("link")
                      ? buttonActive
                      : buttonInactive
                  }
                >
                  <FaLink className="text-xl hover:text-primary" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    editor.chain().focus().unsetLink().run()
                  }
                  disabled={!editor.isActive("link")}
                  className={
                    !editor.isActive("link")
                      ? cn(buttonInactive, "opacity-25")
                      : buttonInactive
                  }
                >
                  <FaUnlink className="text-xl hover:text-primary" />
                </button>
                <Minus color="#000" strokeWidth={1.5} />
                <button
                  onClick={() =>
                    editor
                      .chain()
                      .focus()
                      .toggleBlockquote()
                      .run()
                  }
                  className={
                    editor.isActive("blockquote")
                      ? buttonActive
                      : buttonInactive
                  }
                >
                  <FaQuoteLeft className="text-xl hover:text-primary" />
                </button>
                <button
                  onClick={() =>
                    editor
                      .chain()
                      .focus()
                      .toggleCode()
                      .run()
                  }
                  className={
                    editor.isActive("code")
                      ? buttonActive
                      : buttonInactive
                  }
                  disabled={
                    !editor
                      .can()
                      .chain()
                      .focus()
                      .toggleCode()
                      .run()
                  }
                >
                  <FaFileCode className="text-xl hover:text-primary" />
                </button>
                <button
                  onClick={() =>
                    editor
                      .chain()
                      .focus()
                      .toggleCodeBlock()
                      .run()
                  }
                  className={
                    editor.isActive("codeBlock")
                      ? buttonActive
                      : buttonInactive
                  }
                >
                  <BiCodeBlock className="text-xl hover:text-primary" />
                </button>
                <button
                  onClick={() =>
                    editor
                      .chain()
                      .focus()
                      .toggleBulletList()
                      .run()
                  }
                  className={
                    editor.isActive("bulletList")
                      ? buttonActive
                      : buttonInactive
                  }
                >
                  <FaList className="text-xl hover:text-primary" />
                </button>
                <button
                  onClick={() =>
                    editor
                      .chain()
                      .focus()
                      .toggleOrderedList()
                      .run()
                  }
                  className={
                    editor.isActive("orderedList")
                      ? buttonActive
                      : buttonInactive
                  }
                >
                  <FaListOl className="text-xl hover:text-primary" />
                </button>

                <Minus color="#000" strokeWidth={1.5} />
                <button
                  onClick={() =>
                    editor
                      .chain()
                      .focus()
                      .setHorizontalRule()
                      .run()
                  }
                >
                  <MdHorizontalRule className="text-xl hover:text-primary" />
                </button>
                <button
                  onClick={() =>
                    editor
                      .chain()
                      .focus()
                      .setHardBreak()
                      .run()
                  }
                >
                  <IoMdReturnLeft className="text-xl hover:text-primary" />
                </button>
                <Minus color="#000" strokeWidth={1.5} />
                <button
                  onClick={() =>
                    editor.chain().focus().undo().run()
                  }
                  disabled={
                    !editor
                      .can()
                      .chain()
                      .focus()
                      .undo()
                      .run()
                  }
                >
                  <FaUndo className="text-xl hover:text-primary" />
                </button>
                <button
                  onClick={() =>
                    editor.chain().focus().redo().run()
                  }
                  disabled={
                    !editor
                      .can()
                      .chain()
                      .focus()
                      .redo()
                      .run()
                  }
                >
                  <FaRedo className="text-xl hover:text-primary" />
                </button>
                <Minus color="#000" strokeWidth={1.5} />
                <button
                  onClick={() =>
                    editor
                      .chain()
                      .focus()
                      .setTextAlign("left")
                      .run()
                  }
                  className={
                    editor.isActive({ textAlign: "left" })
                      ? buttonActive
                      : buttonInactive
                  }
                >
                  <FaAlignLeft className="text-xl hover:text-primary" />
                </button>
                <button
                  onClick={() =>
                    editor
                      .chain()
                      .focus()
                      .setTextAlign("center")
                      .run()
                  }
                  className={
                    editor.isActive({ textAlign: "center" })
                      ? buttonActive
                      : buttonInactive
                  }
                >
                  <FaAlignCenter className="text-xl hover:text-primary" />
                </button>
                <button
                  onClick={() =>
                    editor
                      .chain()
                      .focus()
                      .setTextAlign("right")
                      .run()
                  }
                  className={
                    editor.isActive({ textAlign: "right" })
                      ? buttonActive
                      : buttonInactive
                  }
                >
                  <FaAlignRight className="text-xl hover:text-primary" />
                </button>
                <button
                  onClick={() =>
                    editor
                      .chain()
                      .focus()
                      .setTextAlign("justify")
                      .run()
                  }
                  className={
                    editor.isActive({
                      textAlign: "justify",
                    })
                      ? buttonActive
                      : buttonInactive
                  }
                >
                  <FaAlignJustify className="text-xl hover:text-primary" />
                </button>
                <Minus color="#000" strokeWidth={1.5} />
                <button
                  onClick={() =>
                    editor
                      .chain()
                      .focus()
                      .toggleHighlight()
                      .run()
                  }
                  className={
                    editor.isActive("highlight")
                      ? "is-active"
                      : ""
                  }
                >
                  <FaHighlighter className="text-xl hover:text-primary" />
                </button>
                <Minus color="#000" strokeWidth={1.5} />
                <button
                  onClick={() =>
                    editor
                      .chain()
                      .focus()
                      .toggleHeading({ level: 1 })
                      .run()
                  }
                  className={
                    editor.isActive("heading", { level: 1 })
                      ? buttonActive
                      : buttonInactive
                  }
                >
                  <Heading1
                    strokeWidth={1.5}
                    className="text-xl hover:text-primary"
                  />
                </button>
                <button
                  onClick={() =>
                    editor
                      .chain()
                      .focus()
                      .toggleHeading({ level: 2 })
                      .run()
                  }
                  className={
                    editor.isActive("heading", { level: 2 })
                      ? buttonActive
                      : buttonInactive
                  }
                >
                  <Heading2
                    strokeWidth={1.5}
                    className="text-xl hover:text-primary"
                  />
                </button>
                <button
                  onClick={() =>
                    editor
                      .chain()
                      .focus()
                      .toggleHeading({ level: 3 })
                      .run()
                  }
                  className={
                    editor.isActive("heading", { level: 3 })
                      ? buttonActive
                      : buttonInactive
                  }
                >
                  <Heading3
                    strokeWidth={1.5}
                    className="text-xl hover:text-primary"
                  />
                </button>
              </BubbleMenu>
            </div>
          </TabsContent>
          <TabsContent value="template">
            <div className="my-2 flex justify-between  mt-5 mb-5 ">

              <div className="relative">
                <Select name='userRole'
                  onValueChange={(value) => {
                    handleChange(value);
                  }}   >
                  <SelectTrigger className="w-[500px]  bg-background text-foreground border border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className='bg-background text-foreground border border-border '>
                    <SelectGroup>
                      <SelectLabel>Templates</SelectLabel>
                      {templates && templates.map((template, index) => (
                        <SelectItem key={index} value={template.body} className="cursor-pointer bg-background capitalize text-foreground  hover:text-primary hover:underline">
                          {template.subject}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground"> Email Templates</label>
              </div>
              <Button onClick={() => { SaveDraft(); toast.success(`Template saved!`) }} name='intent' className={`border-border text-foreground bg-background ml-2 cursor-pointer rounded-[6px] border  p-3 text-center text-xs font-bold uppercase   shadow outline-none transition-all duration-150 ease-linear hover:bg-transparent bg-transparent hover:text-primary hover:shadow-md focus:outline-none `}>
                Save Template
              </Button>

            </div>
          </TabsContent>
          <TabsContent value="password">
            <div className="mx-auto flex overflow-x-auto">
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button className="mx-2" variant="link">
                    Client
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className="h-auto max-h-[350px] w-80  overflow-y-auto border border-border bg-background text-foreground">
                  <ClientAttributes items={clientAtr} />
                </HoverCardContent>
              </HoverCard>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button className="mx-2" variant="link">
                    Wanted Veh.
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className="h-auto max-h-[350px] w-80  overflow-y-auto border border-border bg-background">
                  <ClientAttributes items={wantedVehAttr} />
                </HoverCardContent>
              </HoverCard>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button className="mx-2" variant="link">
                    Trade Veh
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className="h-auto max-h-[350px] w-80  overflow-y-auto border border-border bg-background">
                  <ClientAttributes items={tradeVehAttr} />
                </HoverCardContent>
              </HoverCard>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button className="mx-2" variant="link">
                    Sales Person
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className="h-auto max-h-[350px] w-80  overflow-y-auto border border-border bg-background">
                  <ClientAttributes items={salesPersonAttr} />
                </HoverCardContent>
              </HoverCard>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button className="mx-2" variant="link">
                    F & I
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className="h-auto max-h-[350px] w-80  overflow-y-auto border border-border bg-background">
                  <ClientAttributes items={FandIAttr} />
                </HoverCardContent>
              </HoverCard>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button className="mx-2" variant="link">
                    Dealer Info
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className="h-auto max-h-[350px] w-80  overflow-y-auto border border-border bg-background">
                  <ClientAttributes items={dealerInfo} />
                </HoverCardContent>
              </HoverCard>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button className="mx-2" variant="link">
                    Finance Info
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className="h-auto max-h-[350px] w-80  overflow-y-auto border border-border bg-background">
                  <ClientAttributes items={financeInfo} />
                </HoverCardContent>
              </HoverCard>
            </div>
          </TabsContent>
          <TabsContent value="Details">
            <div className='grid grid-cols-1 gap-5' >
              <div className="relative mt-5">
                <Input name='to' defaultValue={to} onChange={(e) => setTo(e.currentTarget.value)} />
                <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">To</label>
              </div>
              <div className="relative">
                <Input name='subject' defaultValue={subject} onChange={(e) => setSubject(e.currentTarget.value)} />
                <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">Subject</label>
              </div>
              <div className="relative">
                <Input name='cc' defaultValue={cc} onChange={(e) => setCc(e.currentTarget.value)} />
                <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">CC</label>
              </div>
              <div className="relative">
                <Input name='bcc' defaultValue={bcc} onChange={(e) => setBcc(String(e.currentTarget.value))} />
                <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">BCC</label>
              </div>
              <div className="relative mb-5">
                <Select name='userRole'
                  value={sendType}
                  onValueChange={(value) => {
                    setSendType(value);
                  }}   >
                  <SelectTrigger className=" bg-background text-foreground border border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className='bg-background text-foreground border border-border '>
                    <SelectGroup>
                      <SelectLabel>Response Type</SelectLabel>
                      <SelectItem value='Reply' >
                        <div className="flex items-center space-x-2">
                          <Reply className="h-4 w-4" />
                          <span>Reply</span>
                        </div>
                      </SelectItem>
                      <SelectItem value='Reply All' >
                        <div className="flex items-center space-x-2">
                          <ReplyAll className="h-4 w-4" />
                          <span>Reply all</span>
                        </div>
                      </SelectItem>
                      <SelectItem value='Forward'  >
                        <div className="flex items-center space-x-2">
                          <Forward className="h-4 w-4" />
                          <span>Forward</span>
                        </div>
                      </SelectItem>
                      <SelectItem value='DraftReply' disabled  >
                        <div className="flex items-center space-x-2">
                          <Save className="h-4 w-4" />
                          <span>Save as draft for reply</span>
                        </div>
                      </SelectItem>
                      <SelectItem value='DraftReplyAll' disabled >
                        <div className="flex items-center space-x-2">
                          <Save className="h-4 w-4" />
                          <span>Save as draft for reply-all</span>
                        </div>
                      </SelectItem>

                      <SelectItem value='DraftForward' disabled >
                        <div className="flex items-center space-x-2">
                          <Save className="h-4 w-4" />
                          <span>Save as draft for forward</span>
                        </div>
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">Response Type</label>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        <Card className="bg-background rounded-tl-none ">
          <EditorContent
            editor={editor}
            className="mx-auto mb-2 mt-1  w-[95%] cursor-text rounded-md bg-background p-3 text-foreground"
          />
        </Card>
        <br />
        <div className='flex justify-between w-[98%]'>
          <div>
          </div>
          <Button
            size='sm'
            onClick={() => {
              toast.success(`Email sent!`)
              SendEmail()

            }}
            className={`border-border text-foreground bg-background ml-2 cursor-pointer rounded-[6px] border  p-3 text-center text-xs font-bold uppercase   shadow outline-none transition-all duration-150 ease-linear hover:bg-transparent bg-transparent hover:text-primary hover:shadow-md focus:outline-none  `}
          >
            Send
          </Button>
        </div>
        <br />
      </div >
    </div >
  )
}
export function ComposeClientTextEditor({ content, to: toInput, app, user, customer, }: {
  content?: any,
  user?: any,
  to?: any,
  app?: any,
  customer: any,
}) {
  const editor = Editor(content)
  const [templates, setTemplates] = useState('')

  useEffect(() => {
    async function GetTemps() {
      const response = await fetch('/dealer/api/templates');
      const data = await response.json();
      setTemplates(data)
    }
    GetTemps()

  }, []);

  const buttonActive = 'bg-white text-black rounded-md p-1 ';
  const buttonInactive = 'bg-background text-foreground hover:text-primary hover:bg-transparent';

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

  async function SaveDraft() {
    const date = new Date()
    const body = editor.getText()
    const saveTemplate = await prisma.emailTemplates.create({
      data: {
        body: body,
        userEmail: user.email,
        subject: `New Template ${date}`,
        title: `New Template ${date}`,
        category: 'New Template'
      }
    })
    return saveTemplate
  }

  async function handleChange(template) {
    editor?.commands.setContent({
      "type": "doc",
      "content": [
        {
          "type": "paragraph",
          "content": [
            {
              "type": "text",
              "text": template
            }
          ]
        }
      ]
    })
  }

  const [attribute, setAttribute] = useState("");
  function AttributeClick(item) {
    setAttribute(item.title);
    editor.commands.insertContent(item.attribute);
    console.log(item.attribute, "attribute");
  }

  function ClientAttributes({ className, items, ...props }) {
    return (
      <nav
        className={cn(
          "flex space-x-2 flex-row max-w-[95%] lg:flex-col lg:space-x-0 lg:space-y-1 mt-3",
          className
        )}
        {...props}
      >
        {items.map((item) => (
          <Button
            key={item.subject}
            variant="ghost"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              attribute === item.subject
                ? "bg-[#232324] hover:bg-muted/50 w-[90%]     "
                : "hover:bg-muted/50 text-[#a1a1aa]  w-[90%]  ",
              "justify-start w-[90%] "
            )}
            value={item.attribute}
            onClick={() => {
              AttributeClick(item);
            }}
          >
            {item.subject}
          </Button>
        ))}
      </nav>
    );
  }
  const [to, setTo] = useState(toInput)
  const [subject, setSubject] = useState('')
  const [cc, setCc] = useState('')
  const [bcc, setBcc] = useState('')
  const [sendType, setSendType] = useState('Compose')
  const [sendPackage, setSendPackage] = useState(false)
  const mail = ''
  const fetcher = useFetcher()

  async function SendEmail() {
    let email
    const body = editor?.getHTML()
    if (!to || !sendType || !body) {
      toast.error(`Something went wrong... Did not send email...`, {
        description: !to ? 'Missing to email.' :
          !sendType ? 'Missing to email type.' :
            !body ? 'Missing body content.' :
              null,
      })
    }
    email = await ComposeEmailTwo(
      app.authProvider!,
      subject,
      body,
      to,
      customer.email,
      //  mail.id,
    );
    toast.success('Email sent.')
    const formData = new FormData();
    formData.append("userEmail", user.email);
    formData.append("body", editor.getText());
    formData.append("subject", subject);
    formData.append("userName", user.name);
    formData.append("to", to);
    formData.append("intent", 'saveComms');
    console.log(formData, 'formData');
    fetcher.submit(formData, { method: "post" });
    editor.commands.clearContent()
    console.log(customer.id, to, customer.email, body, subject, email, 'text reply')
    return email
  }

  if (!editor) return null
  return (
    <div className="p-1">
      <div className="mr-auto   mt-auto grid grid-cols-1">
        <Tabs>
          <TabsList className='rounded-bl-none rounded-br-none'>
            <TabsTrigger value="account">Font Style</TabsTrigger>
            <TabsTrigger value="template">Templates</TabsTrigger>
            <TabsTrigger value="password">Inserting Options</TabsTrigger>
            <TabsTrigger value="Details">Details</TabsTrigger>
            <TabsTrigger value="X">X</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <div
              className={cn(
                "max-auto z-10 mx-auto mb-1 mt-1 flex w-[99%] flex-wrap items-center gap-1 rounded-md  p-1",
                "justify-center bg-background text-foreground transition-all"
                // "sm:sticky sm:top-[80px]",
              )}
            >
              <button
                onClick={() =>
                  editor.chain().focus().toggleBold().run()
                }
                className={
                  editor.isActive("bold")
                    ? buttonActive
                    : buttonInactive
                }
              >
                <FaBold className="text-xl hover:text-primary" />
              </button>
              <button
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .toggleItalic()
                    .run()
                }
                className={
                  editor.isActive("italic")
                    ? buttonActive
                    : buttonInactive
                }
              >
                <FaItalic className="text-xl hover:text-primary" />
              </button>
              <button
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .toggleStrike()
                    .run()
                }
                className={
                  editor.isActive("strike")
                    ? buttonActive
                    : buttonInactive
                }
              >
                <FaStrikethrough className="text-xl hover:text-primary" />
              </button>

              <Minus color="#09090b" strokeWidth={1.5} />
              <button
                onClick={handleSetLink}
                className={
                  editor.isActive("link")
                    ? buttonActive
                    : buttonInactive
                }
              >
                <FaLink className="text-xl hover:text-primary" />
              </button>
              <button
                onClick={() =>
                  editor.chain().focus().unsetLink().run()
                }
                disabled={!editor.isActive("link")}
                className={
                  !editor.isActive("link")
                    ? cn(buttonInactive, "opacity-25")
                    : buttonInactive
                }
              >
                <FaUnlink className="text-xl hover:text-primary" />
              </button>
              <Minus color="#000" strokeWidth={1.5} />
              <button
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .toggleBlockquote()
                    .run()
                }
                className={
                  editor.isActive("blockquote")
                    ? buttonActive
                    : buttonInactive
                }
              >
                <FaQuoteLeft className="text-xl hover:text-primary" />
              </button>
              <button
                onClick={() =>
                  editor.chain().focus().toggleCode().run()
                }
                className={
                  editor.isActive("code")
                    ? buttonActive
                    : buttonInactive
                }
                disabled={
                  !editor
                    .can()
                    .chain()
                    .focus()
                    .toggleCode()
                    .run()
                }
              >
                <FaFileCode className="text-xl hover:text-primary" />
              </button>
              <button
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .toggleCodeBlock()
                    .run()
                }
                className={
                  editor.isActive("codeBlock")
                    ? buttonActive
                    : buttonInactive
                }
              >
                <BiCodeBlock className="text-xl hover:text-primary" />
              </button>
              <button
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .toggleBulletList()
                    .run()
                }
                className={
                  editor.isActive("bulletList")
                    ? buttonActive
                    : buttonInactive
                }
              >
                <FaList className="text-xl hover:text-primary" />
              </button>
              <button
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .toggleOrderedList()
                    .run()
                }
                className={
                  editor.isActive("orderedList")
                    ? buttonActive
                    : buttonInactive
                }
              >
                <FaListOl className="text-xl hover:text-primary" />
              </button>

              <Minus color="#000" strokeWidth={1.5} />
              <button
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .setHorizontalRule()
                    .run()
                }
              >
                <MdHorizontalRule className="text-xl hover:text-primary" />
              </button>
              <button
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .setHardBreak()
                    .run()
                }
              >
                <IoMdReturnLeft className="text-xl hover:text-primary" />
              </button>
              <Minus color="#000" strokeWidth={1.5} />
              <button
                onClick={() =>
                  editor.chain().focus().undo().run()
                }
                disabled={
                  !editor.can().chain().focus().undo().run()
                }
              >
                <FaUndo className="text-xl hover:text-primary" />
              </button>
              <button
                onClick={() =>
                  editor.chain().focus().redo().run()
                }
                disabled={
                  !editor.can().chain().focus().redo().run()
                }
              >
                <FaRedo className="text-xl hover:text-primary" />
              </button>
              <Minus color="#000" strokeWidth={1.5} />
              <button
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .setTextAlign("left")
                    .run()
                }
                className={
                  editor.isActive({ textAlign: "left" })
                    ? buttonActive
                    : buttonInactive
                }
              >
                <FaAlignLeft className="text-xl hover:text-primary" />
              </button>
              <button
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .setTextAlign("center")
                    .run()
                }
                className={
                  editor.isActive({ textAlign: "center" })
                    ? buttonActive
                    : buttonInactive
                }
              >
                <FaAlignCenter className="text-xl hover:text-primary" />
              </button>
              <button
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .setTextAlign("right")
                    .run()
                }
                className={
                  editor.isActive({ textAlign: "right" })
                    ? buttonActive
                    : buttonInactive
                }
              >
                <FaAlignRight className="text-xl hover:text-primary" />
              </button>
              <button
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .setTextAlign("justify")
                    .run()
                }
                className={
                  editor.isActive({ textAlign: "justify" })
                    ? buttonActive
                    : buttonInactive
                }
              >
                <FaAlignJustify className="text-xl hover:text-primary" />
              </button>
              <Minus color="#000" strokeWidth={1.5} />
              <button
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .toggleHighlight()
                    .run()
                }
                className={
                  editor.isActive("highlight")
                    ? buttonActive
                    : buttonInactive
                }
              >
                <FaHighlighter className="text-xl hover:text-primary" />
              </button>
              <input
                type="color"
                onInput={(event) =>
                  editor
                    .chain()
                    .focus()
                    .setColor(event.target.value)
                    .run()
                }
                value={
                  editor.getAttributes("textStyle").color
                }
                data-testid="setColor"
              />
              <button
                onClick={() =>
                  editor.chain().focus().unsetColor().run()
                }
                className={
                  editor.isActive("highlight")
                    ? buttonActive
                    : buttonInactive
                }
              >
                <FaEraser className="text-xl hover:text-primary" />
              </button>
              <Minus color="#000" strokeWidth={1.5} />
              <button
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .toggleHeading({ level: 1 })
                    .run()
                }
                className={
                  editor.isActive("heading", { level: 1 })
                    ? buttonActive
                    : buttonInactive
                }
              >
                <Heading1
                  strokeWidth={1.5}
                  className="text-xl hover:text-primary"
                />
              </button>
              <button
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .toggleHeading({ level: 2 })
                    .run()
                }
                className={
                  editor.isActive("heading", { level: 2 })
                    ? buttonActive
                    : buttonInactive
                }
              >
                <Heading2
                  strokeWidth={1.5}
                  className="text-xl hover:text-primary"
                />
              </button>
              <button
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .toggleHeading({ level: 3 })
                    .run()
                }
                className={
                  editor.isActive("heading", { level: 3 })
                    ? buttonActive
                    : buttonInactive
                }
              >
                <Heading3
                  strokeWidth={1.5}
                  className="text-xl hover:text-primary"
                />
              </button>
            </div>
            <div>
              <BubbleMenu
                editor={editor}
                tippyOptions={{ duration: 100 }}
                className={cn(
                  "flex items-center gap-1 rounded-md bg-white p-1",
                  "  dark:bg-background0 text-black shadow"
                )}
              >
                <button
                  type="button"
                  onClick={() =>
                    editor
                      .chain()
                      .focus()
                      .toggleBold()
                      .run()
                  }
                  className={
                    editor.isActive("bold")
                      ? buttonActive
                      : buttonInactive
                  }
                >
                  <FaBold className="text-xl hover:text-primary" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    editor
                      .chain()
                      .focus()
                      .toggleItalic()
                      .run()
                  }
                  className={
                    editor.isActive("italic")
                      ? buttonActive
                      : buttonInactive
                  }
                >
                  <FaItalic className="text-xl hover:text-primary" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    editor
                      .chain()
                      .focus()
                      .toggleStrike()
                      .run()
                  }
                  className={
                    editor.isActive("strike")
                      ? buttonActive
                      : buttonInactive
                  }
                >
                  <FaStrikethrough className="text-xl hover:text-primary" />
                </button>

                <Minus color="#09090b" strokeWidth={1.5} />
                <button
                  type="button"
                  onClick={handleSetLink}
                  className={
                    editor.isActive("link")
                      ? buttonActive
                      : buttonInactive
                  }
                >
                  <FaLink className="text-xl hover:text-primary" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    editor.chain().focus().unsetLink().run()
                  }
                  disabled={!editor.isActive("link")}
                  className={
                    !editor.isActive("link")
                      ? cn(buttonInactive, "opacity-25")
                      : buttonInactive
                  }
                >
                  <FaUnlink className="text-xl hover:text-primary" />
                </button>
                <Minus color="#000" strokeWidth={1.5} />
                <button
                  onClick={() =>
                    editor
                      .chain()
                      .focus()
                      .toggleBlockquote()
                      .run()
                  }
                  className={
                    editor.isActive("blockquote")
                      ? buttonActive
                      : buttonInactive
                  }
                >
                  <FaQuoteLeft className="text-xl hover:text-primary" />
                </button>
                <button
                  onClick={() =>
                    editor
                      .chain()
                      .focus()
                      .toggleCode()
                      .run()
                  }
                  className={
                    editor.isActive("code")
                      ? buttonActive
                      : buttonInactive
                  }
                  disabled={
                    !editor
                      .can()
                      .chain()
                      .focus()
                      .toggleCode()
                      .run()
                  }
                >
                  <FaFileCode className="text-xl hover:text-primary" />
                </button>
                <button
                  onClick={() =>
                    editor
                      .chain()
                      .focus()
                      .toggleCodeBlock()
                      .run()
                  }
                  className={
                    editor.isActive("codeBlock")
                      ? buttonActive
                      : buttonInactive
                  }
                >
                  <BiCodeBlock className="text-xl hover:text-primary" />
                </button>
                <button
                  onClick={() =>
                    editor
                      .chain()
                      .focus()
                      .toggleBulletList()
                      .run()
                  }
                  className={
                    editor.isActive("bulletList")
                      ? buttonActive
                      : buttonInactive
                  }
                >
                  <FaList className="text-xl hover:text-primary" />
                </button>
                <button
                  onClick={() =>
                    editor
                      .chain()
                      .focus()
                      .toggleOrderedList()
                      .run()
                  }
                  className={
                    editor.isActive("orderedList")
                      ? buttonActive
                      : buttonInactive
                  }
                >
                  <FaListOl className="text-xl hover:text-primary" />
                </button>

                <Minus color="#000" strokeWidth={1.5} />
                <button
                  onClick={() =>
                    editor
                      .chain()
                      .focus()
                      .setHorizontalRule()
                      .run()
                  }
                >
                  <MdHorizontalRule className="text-xl hover:text-primary" />
                </button>
                <button
                  onClick={() =>
                    editor
                      .chain()
                      .focus()
                      .setHardBreak()
                      .run()
                  }
                >
                  <IoMdReturnLeft className="text-xl hover:text-primary" />
                </button>
                <Minus color="#000" strokeWidth={1.5} />
                <button
                  onClick={() =>
                    editor.chain().focus().undo().run()
                  }
                  disabled={
                    !editor
                      .can()
                      .chain()
                      .focus()
                      .undo()
                      .run()
                  }
                >
                  <FaUndo className="text-xl hover:text-primary" />
                </button>
                <button
                  onClick={() =>
                    editor.chain().focus().redo().run()
                  }
                  disabled={
                    !editor
                      .can()
                      .chain()
                      .focus()
                      .redo()
                      .run()
                  }
                >
                  <FaRedo className="text-xl hover:text-primary" />
                </button>
                <Minus color="#000" strokeWidth={1.5} />
                <button
                  onClick={() =>
                    editor
                      .chain()
                      .focus()
                      .setTextAlign("left")
                      .run()
                  }
                  className={
                    editor.isActive({ textAlign: "left" })
                      ? buttonActive
                      : buttonInactive
                  }
                >
                  <FaAlignLeft className="text-xl hover:text-primary" />
                </button>
                <button
                  onClick={() =>
                    editor
                      .chain()
                      .focus()
                      .setTextAlign("center")
                      .run()
                  }
                  className={
                    editor.isActive({ textAlign: "center" })
                      ? buttonActive
                      : buttonInactive
                  }
                >
                  <FaAlignCenter className="text-xl hover:text-primary" />
                </button>
                <button
                  onClick={() =>
                    editor
                      .chain()
                      .focus()
                      .setTextAlign("right")
                      .run()
                  }
                  className={
                    editor.isActive({ textAlign: "right" })
                      ? buttonActive
                      : buttonInactive
                  }
                >
                  <FaAlignRight className="text-xl hover:text-primary" />
                </button>
                <button
                  onClick={() =>
                    editor
                      .chain()
                      .focus()
                      .setTextAlign("justify")
                      .run()
                  }
                  className={
                    editor.isActive({
                      textAlign: "justify",
                    })
                      ? buttonActive
                      : buttonInactive
                  }
                >
                  <FaAlignJustify className="text-xl hover:text-primary" />
                </button>
                <Minus color="#000" strokeWidth={1.5} />
                <button
                  onClick={() =>
                    editor
                      .chain()
                      .focus()
                      .toggleHighlight()
                      .run()
                  }
                  className={
                    editor.isActive("highlight")
                      ? "is-active"
                      : ""
                  }
                >
                  <FaHighlighter className="text-xl hover:text-primary" />
                </button>
                <Minus color="#000" strokeWidth={1.5} />
                <button
                  onClick={() =>
                    editor
                      .chain()
                      .focus()
                      .toggleHeading({ level: 1 })
                      .run()
                  }
                  className={
                    editor.isActive("heading", { level: 1 })
                      ? buttonActive
                      : buttonInactive
                  }
                >
                  <Heading1
                    strokeWidth={1.5}
                    className="text-xl hover:text-primary"
                  />
                </button>
                <button
                  onClick={() =>
                    editor
                      .chain()
                      .focus()
                      .toggleHeading({ level: 2 })
                      .run()
                  }
                  className={
                    editor.isActive("heading", { level: 2 })
                      ? buttonActive
                      : buttonInactive
                  }
                >
                  <Heading2
                    strokeWidth={1.5}
                    className="text-xl hover:text-primary"
                  />
                </button>
                <button
                  onClick={() =>
                    editor
                      .chain()
                      .focus()
                      .toggleHeading({ level: 3 })
                      .run()
                  }
                  className={
                    editor.isActive("heading", { level: 3 })
                      ? buttonActive
                      : buttonInactive
                  }
                >
                  <Heading3
                    strokeWidth={1.5}
                    className="text-xl hover:text-primary"
                  />
                </button>
              </BubbleMenu>
            </div>
          </TabsContent>
          <TabsContent value="template">
            <div className="my-2 flex justify-between  mt-5 mb-5 ">

              <div className="relative">
                <Select name='userRole'
                  onValueChange={(value) => {
                    handleChange(value);
                  }}   >
                  <SelectTrigger className="w-[500px]  bg-background text-foreground border border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className='bg-background text-foreground border border-border '>
                    <SelectGroup>
                      <SelectLabel>Templates</SelectLabel>
                      {templates && templates.map((template, index) => (
                        <SelectItem key={index} value={template.body} className="cursor-pointer bg-background capitalize text-foreground  hover:text-primary hover:underline">
                          {template.subject}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground"> Email Templates</label>
              </div>
              <Button onClick={() => { SaveDraft(); toast.success(`Template saved!`) }} name='intent' className={`border-border text-foreground bg-background ml-2 cursor-pointer rounded-[6px] border  p-3 text-center text-xs font-bold uppercase   shadow outline-none transition-all duration-150 ease-linear hover:bg-transparent bg-transparent hover:text-primary hover:shadow-md focus:outline-none `}>
                Save Template
              </Button>

            </div>
          </TabsContent>
          <TabsContent value="password">
            <div className="mx-auto flex overflow-x-auto">
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button className="mx-2" variant="link">
                    Client
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className="h-auto max-h-[350px] w-80  overflow-y-auto border border-border bg-background text-foreground">
                  <ClientAttributes items={clientAtr} />
                </HoverCardContent>
              </HoverCard>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button className="mx-2" variant="link">
                    Wanted Veh.
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className="h-auto max-h-[350px] w-80  overflow-y-auto border border-border bg-background">
                  <ClientAttributes items={wantedVehAttr} />
                </HoverCardContent>
              </HoverCard>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button className="mx-2" variant="link">
                    Trade Veh
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className="h-auto max-h-[350px] w-80  overflow-y-auto border border-border bg-background">
                  <ClientAttributes items={tradeVehAttr} />
                </HoverCardContent>
              </HoverCard>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button className="mx-2" variant="link">
                    Sales Person
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className="h-auto max-h-[350px] w-80  overflow-y-auto border border-border bg-background">
                  <ClientAttributes items={salesPersonAttr} />
                </HoverCardContent>
              </HoverCard>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button className="mx-2" variant="link">
                    F & I
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className="h-auto max-h-[350px] w-80  overflow-y-auto border border-border bg-background">
                  <ClientAttributes items={FandIAttr} />
                </HoverCardContent>
              </HoverCard>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button className="mx-2" variant="link">
                    Dealer Info
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className="h-auto max-h-[350px] w-80  overflow-y-auto border border-border bg-background">
                  <ClientAttributes items={dealerInfo} />
                </HoverCardContent>
              </HoverCard>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button className="mx-2" variant="link">
                    Finance Info
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className="h-auto max-h-[350px] w-80  overflow-y-auto border border-border bg-background">
                  <ClientAttributes items={financeInfo} />
                </HoverCardContent>
              </HoverCard>
            </div>
          </TabsContent>
          <TabsContent value="Details">
            <div className='grid grid-cols-1 gap-5' >
              <div className="relative mt-5">
                <Input name='to' defaultValue={to} onChange={(e) => setTo(e.currentTarget.value)} />
                <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">To</label>
              </div>
              <div className="relative">
                <Input name='subject' defaultValue={subject} onChange={(e) => setSubject(e.currentTarget.value)} />
                <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">Subject</label>
              </div>
              <div className="relative">
                <Input name='cc' defaultValue={cc} onChange={(e) => setCc(e.currentTarget.value)} />
                <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">CC</label>
              </div>
              <div className="relative">
                <Input name='bcc' defaultValue={bcc} onChange={(e) => setBcc(String(e.currentTarget.value))} />
                <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">BCC</label>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        <Card className="bg-background rounded-tl-none ">
          <EditorContent
            editor={editor}
            className="mx-auto mb-2 mt-1  w-[95%] cursor-text rounded-md bg-background p-3 text-foreground"
          />
        </Card>
        <br />
        <div className='flex justify-between w-[98%]'>
          <div>
          </div>
          <Button
            size='sm'
            onClick={() => {
              toast.success(`Email sent!`)
              SendEmail()

            }}
            className={`border-border text-foreground bg-background ml-2 cursor-pointer rounded-[6px] border  p-3 text-center text-xs font-bold uppercase   shadow outline-none transition-all duration-150 ease-linear hover:bg-transparent bg-transparent hover:text-primary hover:shadow-md focus:outline-none  `}
          >
            Send
          </Button>
        </div>
        <br />
      </div >
    </div >
  )
}
export function ComposeFinancelientTextEditor({ content, to: toInput, app, user, customer, financeId }: {
  content?: any,
  user?: any,
  to?: any,
  app?: any,
  customer: any,
  financeId: any
}) {
  const editor = Editor(content)
  const [templates, setTemplates] = useState('')

  useEffect(() => {
    async function GetTemps() {
      const response = await fetch('/dealer/api/templates');
      const data = await response.json();
      setTemplates(data)
    }
    GetTemps()

  }, []);

  const buttonActive = 'bg-white text-black rounded-md p-1 ';
  const buttonInactive = 'bg-background text-foreground hover:text-primary hover:bg-transparent';

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

  async function SaveDraft() {
    const date = new Date()
    const body = editor.getText()
    const saveTemplate = await prisma.emailTemplates.create({
      data: {
        body: body,
        userEmail: user.email,
        subject: `New Template ${date}`,
        title: `New Template ${date}`,
        category: 'New Template'
      }
    })
    return saveTemplate
  }

  async function handleChange(template) {
    editor?.commands.setContent({
      "type": "doc",
      "content": [
        {
          "type": "paragraph",
          "content": [
            {
              "type": "text",
              "text": template
            }
          ]
        }
      ]
    })
  }

  const [attribute, setAttribute] = useState("");
  function AttributeClick(item) {
    setAttribute(item.title);
    editor.commands.insertContent(item.attribute);
    console.log(item.attribute, "attribute");
  }

  function ClientAttributes({ className, items, ...props }) {
    return (
      <nav
        className={cn(
          "flex space-x-2 flex-row max-w-[95%] lg:flex-col lg:space-x-0 lg:space-y-1 mt-3",
          className
        )}
        {...props}
      >
        {items.map((item) => (
          <Button
            key={item.subject}
            variant="ghost"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              attribute === item.subject
                ? "bg-[#232324] hover:bg-muted/50 w-[90%]     "
                : "hover:bg-muted/50 text-[#a1a1aa]  w-[90%]  ",
              "justify-start w-[90%] "
            )}
            value={item.attribute}
            onClick={() => {
              AttributeClick(item);
            }}
          >
            {item.subject}
          </Button>
        ))}
      </nav>
    );
  }
  const [to, setTo] = useState(toInput)
  const [subject, setSubject] = useState('')
  const [cc, setCc] = useState('')
  const [bcc, setBcc] = useState('')
  const [sendType, setSendType] = useState('Compose')
  const [sendPackage, setSendPackage] = useState(false)
  const mail = ''
  const fetcher = useFetcher()
  async function SendEmail() {
    let email
    const body = editor?.getHTML()
    if (!to || !sendType || !body) {
      toast.error(`Something went wrong... Did not send email...`, {
        description: !to ? 'Missing to email.' :
          !sendType ? 'Missing to email type.' :
            !body ? 'Missing body content.' :
              null,
      })
    }
    const custName = customer.firstName + ' ' + customer.lastName
    email = await ComposeFinanceClient(
      app.authProvider!,
      subject,
      body,
      to,
      custName,
      financeId,
    );
    toast.success('Email sent.')

    const formData = new FormData();
    formData.append("userEmail", user.email);
    formData.append("body", editor.getText());
    formData.append("subject", subject);
    formData.append("userName", user.name);
    formData.append("financeId", financeId);
    formData.append("to", to);
    formData.append("intent", 'saveComms');
    console.log(formData, 'formData');
    fetcher.submit(formData, { method: "post" });
    editor.commands.clearContent()
    console.log(financeId, 'text reply')
    return email
  }





  if (!editor) return null
  return (
    <div className="p-1">


      <div className="mr-auto   mt-auto grid grid-cols-1">
        <Tabs>
          <TabsList className='rounded-bl-none rounded-br-none'>
            <TabsTrigger value="account">Font Style</TabsTrigger>
            <TabsTrigger value="template">Templates</TabsTrigger>
            <TabsTrigger value="password">Inserting Options</TabsTrigger>
            <TabsTrigger value="Details">Details</TabsTrigger>
            <TabsTrigger value="X">X</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <div
              className={cn(
                "max-auto z-10 mx-auto mb-1 mt-1 flex w-[99%] flex-wrap items-center gap-1 rounded-md  p-1",
                "justify-center bg-background text-foreground transition-all"
                // "sm:sticky sm:top-[80px]",
              )}
            >
              <button
                onClick={() =>
                  editor.chain().focus().toggleBold().run()
                }
                className={
                  editor.isActive("bold")
                    ? buttonActive
                    : buttonInactive
                }
              >
                <FaBold className="text-xl hover:text-primary" />
              </button>
              <button
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .toggleItalic()
                    .run()
                }
                className={
                  editor.isActive("italic")
                    ? buttonActive
                    : buttonInactive
                }
              >
                <FaItalic className="text-xl hover:text-primary" />
              </button>
              <button
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .toggleStrike()
                    .run()
                }
                className={
                  editor.isActive("strike")
                    ? buttonActive
                    : buttonInactive
                }
              >
                <FaStrikethrough className="text-xl hover:text-primary" />
              </button>

              <Minus color="#09090b" strokeWidth={1.5} />
              <button
                onClick={handleSetLink}
                className={
                  editor.isActive("link")
                    ? buttonActive
                    : buttonInactive
                }
              >
                <FaLink className="text-xl hover:text-primary" />
              </button>
              <button
                onClick={() =>
                  editor.chain().focus().unsetLink().run()
                }
                disabled={!editor.isActive("link")}
                className={
                  !editor.isActive("link")
                    ? cn(buttonInactive, "opacity-25")
                    : buttonInactive
                }
              >
                <FaUnlink className="text-xl hover:text-primary" />
              </button>
              <Minus color="#000" strokeWidth={1.5} />
              <button
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .toggleBlockquote()
                    .run()
                }
                className={
                  editor.isActive("blockquote")
                    ? buttonActive
                    : buttonInactive
                }
              >
                <FaQuoteLeft className="text-xl hover:text-primary" />
              </button>
              <button
                onClick={() =>
                  editor.chain().focus().toggleCode().run()
                }
                className={
                  editor.isActive("code")
                    ? buttonActive
                    : buttonInactive
                }
                disabled={
                  !editor
                    .can()
                    .chain()
                    .focus()
                    .toggleCode()
                    .run()
                }
              >
                <FaFileCode className="text-xl hover:text-primary" />
              </button>
              <button
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .toggleCodeBlock()
                    .run()
                }
                className={
                  editor.isActive("codeBlock")
                    ? buttonActive
                    : buttonInactive
                }
              >
                <BiCodeBlock className="text-xl hover:text-primary" />
              </button>
              <button
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .toggleBulletList()
                    .run()
                }
                className={
                  editor.isActive("bulletList")
                    ? buttonActive
                    : buttonInactive
                }
              >
                <FaList className="text-xl hover:text-primary" />
              </button>
              <button
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .toggleOrderedList()
                    .run()
                }
                className={
                  editor.isActive("orderedList")
                    ? buttonActive
                    : buttonInactive
                }
              >
                <FaListOl className="text-xl hover:text-primary" />
              </button>

              <Minus color="#000" strokeWidth={1.5} />
              <button
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .setHorizontalRule()
                    .run()
                }
              >
                <MdHorizontalRule className="text-xl hover:text-primary" />
              </button>
              <button
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .setHardBreak()
                    .run()
                }
              >
                <IoMdReturnLeft className="text-xl hover:text-primary" />
              </button>
              <Minus color="#000" strokeWidth={1.5} />
              <button
                onClick={() =>
                  editor.chain().focus().undo().run()
                }
                disabled={
                  !editor.can().chain().focus().undo().run()
                }
              >
                <FaUndo className="text-xl hover:text-primary" />
              </button>
              <button
                onClick={() =>
                  editor.chain().focus().redo().run()
                }
                disabled={
                  !editor.can().chain().focus().redo().run()
                }
              >
                <FaRedo className="text-xl hover:text-primary" />
              </button>
              <Minus color="#000" strokeWidth={1.5} />
              <button
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .setTextAlign("left")
                    .run()
                }
                className={
                  editor.isActive({ textAlign: "left" })
                    ? buttonActive
                    : buttonInactive
                }
              >
                <FaAlignLeft className="text-xl hover:text-primary" />
              </button>
              <button
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .setTextAlign("center")
                    .run()
                }
                className={
                  editor.isActive({ textAlign: "center" })
                    ? buttonActive
                    : buttonInactive
                }
              >
                <FaAlignCenter className="text-xl hover:text-primary" />
              </button>
              <button
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .setTextAlign("right")
                    .run()
                }
                className={
                  editor.isActive({ textAlign: "right" })
                    ? buttonActive
                    : buttonInactive
                }
              >
                <FaAlignRight className="text-xl hover:text-primary" />
              </button>
              <button
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .setTextAlign("justify")
                    .run()
                }
                className={
                  editor.isActive({ textAlign: "justify" })
                    ? buttonActive
                    : buttonInactive
                }
              >
                <FaAlignJustify className="text-xl hover:text-primary" />
              </button>
              <Minus color="#000" strokeWidth={1.5} />
              <button
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .toggleHighlight()
                    .run()
                }
                className={
                  editor.isActive("highlight")
                    ? buttonActive
                    : buttonInactive
                }
              >
                <FaHighlighter className="text-xl hover:text-primary" />
              </button>
              <input
                type="color"
                onInput={(event) =>
                  editor
                    .chain()
                    .focus()
                    .setColor(event.target.value)
                    .run()
                }
                value={
                  editor.getAttributes("textStyle").color
                }
                data-testid="setColor"
              />
              <button
                onClick={() =>
                  editor.chain().focus().unsetColor().run()
                }
                className={
                  editor.isActive("highlight")
                    ? buttonActive
                    : buttonInactive
                }
              >
                <FaEraser className="text-xl hover:text-primary" />
              </button>
              <Minus color="#000" strokeWidth={1.5} />
              <button
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .toggleHeading({ level: 1 })
                    .run()
                }
                className={
                  editor.isActive("heading", { level: 1 })
                    ? buttonActive
                    : buttonInactive
                }
              >
                <Heading1
                  strokeWidth={1.5}
                  className="text-xl hover:text-primary"
                />
              </button>
              <button
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .toggleHeading({ level: 2 })
                    .run()
                }
                className={
                  editor.isActive("heading", { level: 2 })
                    ? buttonActive
                    : buttonInactive
                }
              >
                <Heading2
                  strokeWidth={1.5}
                  className="text-xl hover:text-primary"
                />
              </button>
              <button
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .toggleHeading({ level: 3 })
                    .run()
                }
                className={
                  editor.isActive("heading", { level: 3 })
                    ? buttonActive
                    : buttonInactive
                }
              >
                <Heading3
                  strokeWidth={1.5}
                  className="text-xl hover:text-primary"
                />
              </button>
            </div>
            <div>
              <BubbleMenu
                editor={editor}
                tippyOptions={{ duration: 100 }}
                className={cn(
                  "flex items-center gap-1 rounded-md bg-white p-1",
                  "  dark:bg-background0 text-black shadow"
                )}
              >
                <button
                  type="button"
                  onClick={() =>
                    editor
                      .chain()
                      .focus()
                      .toggleBold()
                      .run()
                  }
                  className={
                    editor.isActive("bold")
                      ? buttonActive
                      : buttonInactive
                  }
                >
                  <FaBold className="text-xl hover:text-primary" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    editor
                      .chain()
                      .focus()
                      .toggleItalic()
                      .run()
                  }
                  className={
                    editor.isActive("italic")
                      ? buttonActive
                      : buttonInactive
                  }
                >
                  <FaItalic className="text-xl hover:text-primary" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    editor
                      .chain()
                      .focus()
                      .toggleStrike()
                      .run()
                  }
                  className={
                    editor.isActive("strike")
                      ? buttonActive
                      : buttonInactive
                  }
                >
                  <FaStrikethrough className="text-xl hover:text-primary" />
                </button>

                <Minus color="#09090b" strokeWidth={1.5} />
                <button
                  type="button"
                  onClick={handleSetLink}
                  className={
                    editor.isActive("link")
                      ? buttonActive
                      : buttonInactive
                  }
                >
                  <FaLink className="text-xl hover:text-primary" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    editor.chain().focus().unsetLink().run()
                  }
                  disabled={!editor.isActive("link")}
                  className={
                    !editor.isActive("link")
                      ? cn(buttonInactive, "opacity-25")
                      : buttonInactive
                  }
                >
                  <FaUnlink className="text-xl hover:text-primary" />
                </button>
                <Minus color="#000" strokeWidth={1.5} />
                <button
                  onClick={() =>
                    editor
                      .chain()
                      .focus()
                      .toggleBlockquote()
                      .run()
                  }
                  className={
                    editor.isActive("blockquote")
                      ? buttonActive
                      : buttonInactive
                  }
                >
                  <FaQuoteLeft className="text-xl hover:text-primary" />
                </button>
                <button
                  onClick={() =>
                    editor
                      .chain()
                      .focus()
                      .toggleCode()
                      .run()
                  }
                  className={
                    editor.isActive("code")
                      ? buttonActive
                      : buttonInactive
                  }
                  disabled={
                    !editor
                      .can()
                      .chain()
                      .focus()
                      .toggleCode()
                      .run()
                  }
                >
                  <FaFileCode className="text-xl hover:text-primary" />
                </button>
                <button
                  onClick={() =>
                    editor
                      .chain()
                      .focus()
                      .toggleCodeBlock()
                      .run()
                  }
                  className={
                    editor.isActive("codeBlock")
                      ? buttonActive
                      : buttonInactive
                  }
                >
                  <BiCodeBlock className="text-xl hover:text-primary" />
                </button>
                <button
                  onClick={() =>
                    editor
                      .chain()
                      .focus()
                      .toggleBulletList()
                      .run()
                  }
                  className={
                    editor.isActive("bulletList")
                      ? buttonActive
                      : buttonInactive
                  }
                >
                  <FaList className="text-xl hover:text-primary" />
                </button>
                <button
                  onClick={() =>
                    editor
                      .chain()
                      .focus()
                      .toggleOrderedList()
                      .run()
                  }
                  className={
                    editor.isActive("orderedList")
                      ? buttonActive
                      : buttonInactive
                  }
                >
                  <FaListOl className="text-xl hover:text-primary" />
                </button>

                <Minus color="#000" strokeWidth={1.5} />
                <button
                  onClick={() =>
                    editor
                      .chain()
                      .focus()
                      .setHorizontalRule()
                      .run()
                  }
                >
                  <MdHorizontalRule className="text-xl hover:text-primary" />
                </button>
                <button
                  onClick={() =>
                    editor
                      .chain()
                      .focus()
                      .setHardBreak()
                      .run()
                  }
                >
                  <IoMdReturnLeft className="text-xl hover:text-primary" />
                </button>
                <Minus color="#000" strokeWidth={1.5} />
                <button
                  onClick={() =>
                    editor.chain().focus().undo().run()
                  }
                  disabled={
                    !editor
                      .can()
                      .chain()
                      .focus()
                      .undo()
                      .run()
                  }
                >
                  <FaUndo className="text-xl hover:text-primary" />
                </button>
                <button
                  onClick={() =>
                    editor.chain().focus().redo().run()
                  }
                  disabled={
                    !editor
                      .can()
                      .chain()
                      .focus()
                      .redo()
                      .run()
                  }
                >
                  <FaRedo className="text-xl hover:text-primary" />
                </button>
                <Minus color="#000" strokeWidth={1.5} />
                <button
                  onClick={() =>
                    editor
                      .chain()
                      .focus()
                      .setTextAlign("left")
                      .run()
                  }
                  className={
                    editor.isActive({ textAlign: "left" })
                      ? buttonActive
                      : buttonInactive
                  }
                >
                  <FaAlignLeft className="text-xl hover:text-primary" />
                </button>
                <button
                  onClick={() =>
                    editor
                      .chain()
                      .focus()
                      .setTextAlign("center")
                      .run()
                  }
                  className={
                    editor.isActive({ textAlign: "center" })
                      ? buttonActive
                      : buttonInactive
                  }
                >
                  <FaAlignCenter className="text-xl hover:text-primary" />
                </button>
                <button
                  onClick={() =>
                    editor
                      .chain()
                      .focus()
                      .setTextAlign("right")
                      .run()
                  }
                  className={
                    editor.isActive({ textAlign: "right" })
                      ? buttonActive
                      : buttonInactive
                  }
                >
                  <FaAlignRight className="text-xl hover:text-primary" />
                </button>
                <button
                  onClick={() =>
                    editor
                      .chain()
                      .focus()
                      .setTextAlign("justify")
                      .run()
                  }
                  className={
                    editor.isActive({
                      textAlign: "justify",
                    })
                      ? buttonActive
                      : buttonInactive
                  }
                >
                  <FaAlignJustify className="text-xl hover:text-primary" />
                </button>
                <Minus color="#000" strokeWidth={1.5} />
                <button
                  onClick={() =>
                    editor
                      .chain()
                      .focus()
                      .toggleHighlight()
                      .run()
                  }
                  className={
                    editor.isActive("highlight")
                      ? "is-active"
                      : ""
                  }
                >
                  <FaHighlighter className="text-xl hover:text-primary" />
                </button>
                <Minus color="#000" strokeWidth={1.5} />
                <button
                  onClick={() =>
                    editor
                      .chain()
                      .focus()
                      .toggleHeading({ level: 1 })
                      .run()
                  }
                  className={
                    editor.isActive("heading", { level: 1 })
                      ? buttonActive
                      : buttonInactive
                  }
                >
                  <Heading1
                    strokeWidth={1.5}
                    className="text-xl hover:text-primary"
                  />
                </button>
                <button
                  onClick={() =>
                    editor
                      .chain()
                      .focus()
                      .toggleHeading({ level: 2 })
                      .run()
                  }
                  className={
                    editor.isActive("heading", { level: 2 })
                      ? buttonActive
                      : buttonInactive
                  }
                >
                  <Heading2
                    strokeWidth={1.5}
                    className="text-xl hover:text-primary"
                  />
                </button>
                <button
                  onClick={() =>
                    editor
                      .chain()
                      .focus()
                      .toggleHeading({ level: 3 })
                      .run()
                  }
                  className={
                    editor.isActive("heading", { level: 3 })
                      ? buttonActive
                      : buttonInactive
                  }
                >
                  <Heading3
                    strokeWidth={1.5}
                    className="text-xl hover:text-primary"
                  />
                </button>
              </BubbleMenu>
            </div>
          </TabsContent>
          <TabsContent value="template">
            <div className="my-2 flex justify-between  mt-5 mb-5 ">

              <div className="relative">
                <Select name='userRole'
                  onValueChange={(value) => {
                    handleChange(value);
                  }}   >
                  <SelectTrigger className="w-[500px]  bg-background text-foreground border border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className='bg-background text-foreground border border-border '>
                    <SelectGroup>
                      <SelectLabel>Templates</SelectLabel>
                      {templates && templates.map((template, index) => (
                        <SelectItem key={index} value={template.body} className="cursor-pointer bg-background capitalize text-foreground  hover:text-primary hover:underline">
                          {template.subject}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground"> Email Templates</label>
              </div>
              <Button onClick={() => { SaveDraft(); toast.success(`Template saved!`) }} name='intent' className={`border-border text-foreground bg-background ml-2 cursor-pointer rounded-[6px] border  p-3 text-center text-xs font-bold uppercase   shadow outline-none transition-all duration-150 ease-linear hover:bg-transparent bg-transparent hover:text-primary hover:shadow-md focus:outline-none `}>
                Save Template
              </Button>

            </div>
          </TabsContent>
          <TabsContent value="password">
            <div className="mx-auto flex overflow-x-auto">
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button className="mx-2" variant="link">
                    Client
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className="h-auto max-h-[350px] w-80  overflow-y-auto border border-border bg-background text-foreground">
                  <ClientAttributes items={clientAtr} />
                </HoverCardContent>
              </HoverCard>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button className="mx-2" variant="link">
                    Wanted Veh.
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className="h-auto max-h-[350px] w-80  overflow-y-auto border border-border bg-background">
                  <ClientAttributes items={wantedVehAttr} />
                </HoverCardContent>
              </HoverCard>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button className="mx-2" variant="link">
                    Trade Veh
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className="h-auto max-h-[350px] w-80  overflow-y-auto border border-border bg-background">
                  <ClientAttributes items={tradeVehAttr} />
                </HoverCardContent>
              </HoverCard>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button className="mx-2" variant="link">
                    Sales Person
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className="h-auto max-h-[350px] w-80  overflow-y-auto border border-border bg-background">
                  <ClientAttributes items={salesPersonAttr} />
                </HoverCardContent>
              </HoverCard>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button className="mx-2" variant="link">
                    F & I
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className="h-auto max-h-[350px] w-80  overflow-y-auto border border-border bg-background">
                  <ClientAttributes items={FandIAttr} />
                </HoverCardContent>
              </HoverCard>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button className="mx-2" variant="link">
                    Dealer Info
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className="h-auto max-h-[350px] w-80  overflow-y-auto border border-border bg-background">
                  <ClientAttributes items={dealerInfo} />
                </HoverCardContent>
              </HoverCard>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button className="mx-2" variant="link">
                    Finance Info
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className="h-auto max-h-[350px] w-80  overflow-y-auto border border-border bg-background">
                  <ClientAttributes items={financeInfo} />
                </HoverCardContent>
              </HoverCard>
            </div>
          </TabsContent>
          <TabsContent value="Details">
            <div className='grid grid-cols-1 gap-5' >
              <div className="relative mt-5">
                <Input name='to' defaultValue={to} onChange={(e) => setTo(e.currentTarget.value)} />
                <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">To</label>
              </div>
              <div className="relative">
                <Input name='subject' defaultValue={subject} onChange={(e) => setSubject(e.currentTarget.value)} />
                <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">Subject</label>
              </div>
              <div className="relative">
                <Input name='cc' defaultValue={cc} onChange={(e) => setCc(e.currentTarget.value)} />
                <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">CC</label>
              </div>
              <div className="relative">
                <Input name='bcc' defaultValue={bcc} onChange={(e) => setBcc(String(e.currentTarget.value))} />
                <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">BCC</label>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        <Card className="bg-background rounded-tl-none ">
          <EditorContent
            editor={editor}
            className="mx-auto mb-2 mt-1  w-[95%] cursor-text rounded-md bg-background p-3 text-foreground"
          />
        </Card>
        <br />
        <div className='flex justify-between w-[98%]'>
          <div>
          </div>
          <Button
            size='sm'
            onClick={() => {
              toast.success(`Email sent!`)
              SendEmail()

            }}
            className={`border-border text-foreground bg-background ml-2 cursor-pointer rounded-[6px] border  p-3 text-center text-xs font-bold uppercase   shadow outline-none transition-all duration-150 ease-linear hover:bg-transparent bg-transparent hover:text-primary hover:shadow-md focus:outline-none  `}
          >
            Send
          </Button>
        </div>
        <br />
      </div >
    </div >
  )
}
