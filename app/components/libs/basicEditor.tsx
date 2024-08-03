import Highlight from "@tiptap/extension-highlight"
import Text from '@tiptap/extension-text'

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
import { Undo, Redo, List, ScanLine, Eraser, Code, ListPlus, Brackets, Pilcrow, Minus, AlignLeft, AlignCenter, AlignRight, AlignJustify, Highlighter, WrapText, Quote, Heading1, Heading2, Heading3 } from 'lucide-react';
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
import { IconMatch, } from "./icons"
import { Button, buttonVariants } from "../ui/button"
import { cn } from "../ui/utils"
import { parseHTML } from "~/utils/html"
import { fixUrl } from "~/utils/url"
import { Form } from "@remix-run/react"
import { toast } from "sonner"
import { prisma } from "~/libs/prisma.server"
import { ComposeEmail, ComposeEmailTwo, SendNewEmail } from "../microsoft/GraphService"
import {
  SelectContent, SelectLabel, SelectGroup,
  SelectValue, Select, SelectTrigger, SelectItem,
} from "~/components"
import clsx from "clsx"
import { Input } from "../ui"
import { HoverCard, HoverCardContent, HoverCardTrigger, } from "~/components/ui/hover-card"
import { clientAtr, dealerInfo, FandIAttr, financeInfo, salesPersonAttr, tradeVehAttr, wantedVehAttr } from "~/routes/__authorized/dealer/user/dashboard.templates"

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
export function Editor(content, setText, handleUpdate) {
  const CustomDocument = Document.extend({ content: 'taskList', })
  const CustomTaskItem = TaskItem.extend({ content: 'inline*', })
  const editor = useEditor({
    content,
    extensions: [
      Document,
      Paragraph,
      Text,
      Highlight,
      Typography,
      Underline,
      CustomDocument,
      CustomTaskItem,
      Color,//.configure({ types: [TextStyle.name, ListItem.name] }),
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
  return editor
}

export function EditorTiptapHook({ content, user, to, subject, app, cc, bcc }: {
  content?: any,
  user?: any,
  to?: any,
  subject?: any,
  app?: any,
  cc?: any,
  bcc?: any,
}) {
  const editor = Editor(content)
  const [templates, setTemplates] = useState('')
  const [text, setText] = useState('')

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

  if (!editor) return null
  return (
    <div className="p-1">
      <div className="mr-auto px-2   mt-auto grid grid-cols-1    rounded-md">
        <div className="my-2 flex justify-between">
          <select className={`autofill:placeholder:text-[#C2E6FF] justifty-start mx-2 h-9 max-w-md cursor-pointer rounded border border-border  bg-background px-2 text-xs uppercase text-foreground shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-primary`}
            onChange={(e) => {
              handleChange(e.target.value); // Pass the input value directly to handleChange
            }}    >
            <option value="">Select a Template</option>
            {templates && templates.map((template, index) => (
              <option key={index} value={template.body}>
                {template.title}
              </option>
            ))}
          </select>
          <Button size='sm' onClick={() => { SaveDraft(); toast.success(`Template saved!`) }} name='intent' className={` ml-2 cursor-pointer rounded border border-border p-3 text-center text-xs font-bold uppercase text-foreground shadow outline-none transition-all duration-150 ease-linear hover:bg-transparent bg-transparent hover:text-primary hover:shadow-md focus:outline-none `}>
            Save Template
          </Button>

        </div>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>Formatting Options</AccordionTrigger>
            <AccordionContent>
              <div
                className={cn(
                  "z-10 mb-1 w-[99%] mt-1 flex flex-wrap max-auto items-center gap-1 rounded-md p-1  mx-auto",
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
                    "  text-black shadow dark:bg-background0",
                  )}
                >
                  <button

                    type="button"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={editor.isActive("bold") ? buttonActive : buttonInactive}
                  >
                    <FaBold className="text-xl hover:text-primary" />
                  </button>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={editor.isActive("italic") ? buttonActive : buttonInactive}
                  >
                    <FaItalic className="text-xl hover:text-primary" />
                  </button>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    className={editor.isActive("strike") ? buttonActive : buttonInactive}
                  >
                    <FaStrikethrough className="text-xl hover:text-primary" />
                  </button>

                  <Minus color="#09090b" strokeWidth={1.5} />
                  <button
                    type="button"
                    onClick={handleSetLink}
                    className={editor.isActive("link") ? buttonActive : buttonInactive}
                  >
                    <FaLink className="text-xl hover:text-primary" />
                  </button>
                  <button
                    type="button"
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
                  <button onClick={() => editor.chain().focus().toggleHighlight().run()} className={editor.isActive('highlight') ? 'is-active' : ''}>
                    <FaHighlighter className="text-xl hover:text-primary" />
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

                </BubbleMenu>
              </div>
            </AccordionContent>
          </AccordionItem>


        </Accordion>

        <br />
        <EditorContent editor={editor} className="mt-1 p-3 mb-2  cursor-text border border-border text-foreground bg-background mx-auto w-[95%] rounded-md" />
        <br />
        <input type='hidden' defaultValue={text} name='body' />
        <div>
          <Button
            size='sm'
            onClick={() => {

              toast.success(`Email sent!`)
              const body = editor?.getHTML()
              console.log(body, 'body', text, 'text')
              setTimeout(() => {
                ComposeEmail(app.authProvider!, subject, body, to,)
                /// setReply(false)
              }, 5);
            }}
            className={` ml-auto mr-2 w-auto cursor-pointer rounded border border-[#fff] p-3 text-center text-xs font-bold uppercase text-[#fff] shadow outline-none transition-all duration-150 ease-linear hover:bg-[#95959f] bg-transparent hover:text-primary hover:shadow-md focus:outline-none `}
          >
            Send
          </Button>
        </div>

        <br />
      </div >
    </div >
  )
}

export function EditorTiptapHookCompose({ content, user, to, subject, app, cc, bcc }: {
  content?: any,
  user?: any,
  to?: any,
  subject?: any,
  app?: any,
  cc?: any,
  bcc?: any,
}) {
  const editor = Editor(content)
  const [templates, setTemplates] = useState('')
  const [text, setText] = useState('')

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

  if (!editor) return null
  return (
    <div className="p-1">
      <div className="mr-auto px-2   mt-auto grid grid-cols-1">
        <div className="my-2 flex justify-between w-[95%]">
          <select className={`border-border text-foreground bg-background autofill:placeholder:text-text-[#C2E6FF] justifty-start mx-2 h-9  cursor-pointer rounded border   w-1/2   px-2 text-xs uppercase   shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-primary`} onChange={(e) => {
            handleChange(e.target.value); // Pass the input value directly to handleChange
          }}    >
            <option value="">Select a Template</option>
            {templates && templates.map((template, index) => (
              <option key={index} value={template.body}>
                {template.title}
              </option>
            ))}
          </select>
          <Button onClick={() => { SaveDraft(); toast.success(`Template saved!`) }} name='intent' className={`border-border text-foreground bg-background ml-2 cursor-pointer rounded border  p-3 text-center text-xs font-bold uppercase   shadow outline-none transition-all duration-150 ease-linear hover:bg-transparent bg-transparent hover:text-primary hover:shadow-md focus:outline-none `}>
            Save Template
          </Button>

        </div>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>Formatting Options</AccordionTrigger>
            <AccordionContent>
              <div
                className={cn(
                  "z-10 mb-1 w-[99%] mt-1 flex flex-wrap max-auto items-center gap-1 rounded-md p-1  mx-auto",
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
                    "  text-black shadow dark:bg-background0",
                  )}
                >
                  <button

                    type="button"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={editor.isActive("bold") ? buttonActive : buttonInactive}
                  >
                    <FaBold className="text-xl hover:text-primary" />
                  </button>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={editor.isActive("italic") ? buttonActive : buttonInactive}
                  >
                    <FaItalic className="text-xl hover:text-primary" />
                  </button>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    className={editor.isActive("strike") ? buttonActive : buttonInactive}
                  >
                    <FaStrikethrough className="text-xl hover:text-primary" />
                  </button>

                  <Minus color="#09090b" strokeWidth={1.5} />
                  <button
                    type="button"
                    onClick={handleSetLink}
                    className={editor.isActive("link") ? buttonActive : buttonInactive}
                  >
                    <FaLink className="text-xl hover:text-primary" />
                  </button>
                  <button
                    type="button"
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
                  <button onClick={() => editor.chain().focus().toggleHighlight().run()} className={editor.isActive('highlight') ? 'is-active' : ''}>
                    <FaHighlighter className="text-xl hover:text-primary" />
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

                </BubbleMenu>
              </div>
            </AccordionContent>
          </AccordionItem>


        </Accordion>

        <br />
        <EditorContent editor={editor} className="mt-1 p-3 mb-2  cursor-text border border-border text-foreground bg-background mx-auto w-[95%] rounded-md" />
        <br />
        <input type='hidden' defaultValue={text} name='body' />
        <div className='flex justify-between w-[98%]'>
          <div>

          </div>
          <Button
            onClick={() => {
              toast.success(`Email sent!`)
              const body = editor?.getHTML()
              console.log(body, 'body', text, 'text')
              setTimeout(() => {
                ComposeEmailTwo(app.authProvider!, subject, body, to,)
                /// setReply(false)
              }, 5);
            }}
            className={`border-border text-foreground bg-background w-auto mr-2 cursor-pointer rounded border ml-auto  p-3 text-center text-xs font-bold uppercase   shadow outline-none transition-all duration-150 ease-linear hover:bg-[#95959f]  hover:text-primary hover:shadow-md focus:outline-none `}
          >
            Send
          </Button>
        </div>
        <br />
      </div >
    </div >
  )
}

export function EditorTiptapHookComposeDashboardEmailClient({ content, subject, to, app, user, customer }: {
  content?: any,
  user?: any,
  to?: any,
  subject?: any,
  app?: any,
  customer: any,
}) {
  const editor = Editor(content)
  const [templates, setTemplates] = useState('')
  const [text, setText] = useState('')

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

  function SendIt(body) {
    const compose = ComposeEmailTwo(app.authProvider!, subject, body, to);
    useEffect(() => {
      const emailData = {
        dept: 'Sales',
        financeId: customer.financeId,
        body: body,
        userName: user.firstName + ' ' + user.lastName,
        type: 'Email',
        customerEmail: to,
        direction: 'Outgoing',
        subject: subject.length > 0 ? subject : '',
        result: 'Attempted',
        userEmail: user.email,
      }
      const serializedemailData = JSON.stringify(emailData);
      window.localStorage.setItem("emailData", serializedemailData);

      async function UpdateFinance() {
        const date = new Date();
        const options = {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        };

        const upodateFinance = await prisma.finance.update({
          where: { id: customer.id },
          data: {
            Email: customer.Email += 1,
            lastContact: date.toLocaleDateString('en-US', options)
          }
        })
        await prisma.previousComms.create({
          data: {
            dept: 'Sales',
            financeId: emailData.financeId,
            body: body,
            userName: emailData.userName,
            type: 'Email',
            customerEmail: to,
            direction: 'Outgoing',
            subject: emailData.subject,
            result: 'Attempted',
            userEmail: emailData.userEmail,
          },
        });
        return upodateFinance
      }

      UpdateFinance()
      console.log('serializedemailData')
    }, []);
    return compose
  }

  if (!editor) return null
  return (
    <div className="p-1">
      <div className="mr-auto   mt-auto grid grid-cols-1">
        <div className="my-2 flex justify-between  mt-3 ">

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
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>Formatting Options</AccordionTrigger>
            <AccordionContent>
              <div
                className={cn(
                  "z-10 mb-1 w-[99%] mt-1 flex flex-wrap max-auto items-center gap-1 rounded-md p-1  mx-auto",
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
                    "  text-black shadow dark:bg-background0",
                  )}
                >
                  <button

                    type="button"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={editor.isActive("bold") ? buttonActive : buttonInactive}
                  >
                    <FaBold className="text-xl hover:text-primary" />
                  </button>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={editor.isActive("italic") ? buttonActive : buttonInactive}
                  >
                    <FaItalic className="text-xl hover:text-primary" />
                  </button>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    className={editor.isActive("strike") ? buttonActive : buttonInactive}
                  >
                    <FaStrikethrough className="text-xl hover:text-primary" />
                  </button>

                  <Minus color="#09090b" strokeWidth={1.5} />
                  <button
                    type="button"
                    onClick={handleSetLink}
                    className={editor.isActive("link") ? buttonActive : buttonInactive}
                  >
                    <FaLink className="text-xl hover:text-primary" />
                  </button>
                  <button
                    type="button"
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
                  <button onClick={() => editor.chain().focus().toggleHighlight().run()} className={editor.isActive('highlight') ? 'is-active' : ''}>
                    <FaHighlighter className="text-xl hover:text-primary" />
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

                </BubbleMenu>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <br />
        <div className="relative ">
          <EditorContent editor={editor} className=" p-3 mb-2  cursor-text border border-border text-foreground bg-background mx-auto rounded-md" />
          <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground"> Body</label>
        </div>
        <br />
        <input type='hidden' defaultValue={text} name='body' />
        <div className='flex justify-between w-[98%]'>
          <div>
          </div>
          <Button
            size='sm'
            onClick={() => {
              toast.success(`Email sent!`)
              const body = editor?.getHTML()
              console.log(body, 'body', text, 'text')
              setTimeout(() => {
                SendIt(body);
              }, 5);
            }}
            className={`border-border text-foreground bg-primary w-auto mr-2 cursor-pointer rounded-md border ml-auto  p-3 text-center text-xs font-bold uppercase   shadow outline-none transition-all duration-150 ease-linear hover:bg-[#95959f]  hover:text-primary hover:shadow-md focus:outline-none `}
          >
            Send
          </Button>
        </div>
        <br />
      </div >
    </div >
  )
}

export function EditorTiptapHookNewTemplates({ user, content }: {
  user?: any,
  content?: any
}) {
  const [text, setText] = useState('')

  const editor = Editor(content, setText)
  const [category, setCategory] = useState('')
  const [title, setTitle] = useState('')
  const [subject, setSubject] = useState('')

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
  useEffect(() => {

  }, [text])

  async function SaveDraft() {
    const body = editor.getText()
    const saveTemplate = await prisma.emailTemplates.create({
      data: {
        body: body,
        userEmail: user.email,
        subject: subject,
        title: title,
        category: category
      }
    })
    return saveTemplate
  }
  /*
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
  */


  const [attribute, setAttribute] = useState('')
  function AttributeClick(item) {
    setAttribute(item.title);
    editor.commands.insertContent(item.attribute);
    console.log(item.attribute, 'attribute')
  }

  function ClientAttributes({ items, ...props }) {
    return (
      <nav
        className={cn(
          'flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1',
        )}
        {...props}
      >
        {items.map((item) => (
          <Button
            key={item.title}
            variant="ghost"
            className={cn(
              buttonVariants({ variant: 'ghost' }),
              attribute === item.title
                ? 'bg-background hover:bg-muted/50 w-[90%] border-l-[#0969da]'
                : 'hover:bg-muted/50 w-[90%]',
              'justify-start w-[90%]'
            )}
            value={item.attribute}
            onClick={() => {
              AttributeClick(item)
            }}
          >
            {item.title}
          </Button>
        ))}
      </nav>
    )
  }
  if (!editor) return null
  return (
    <div className="p-1">
      <Form method='post' action='/dealer/user/dashboard/templates'>
        <div className="mr-auto px-2   mt-auto grid grid-cols-1">
          <div className="grid gap-3 mx-3 mb-3">
            <div className="relative mt-3">
              <Input
                name='title'
                type="text"
                className="w-full bg-background border-border "
              />
              <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Title</label>

            </div>
            <div className="relative mt-3">
              <Input
                name='category'
                type="text"
                className="w-full bg-background border-border "

              />
              <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Category</label>

            </div>
            <div className="relative mt-3">
              <Input
                name='subCat'
                type="text"
                className="w-full bg-background border-border "
              />
              <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Sub-category</label>

            </div>
            <div className="relative mt-3">
              <Input
                name='subject'
                type="text"
                className="w-full bg-background border-border "

              />
              <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Subject</label>
            </div>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Formatting Options</AccordionTrigger>
              <AccordionContent>
                <div
                  className={cn(
                    "z-10 mb-1 w-[99%] mt-1 flex flex-wrap max-auto items-center gap-1 rounded-md p-1  mx-auto",
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
                      "  text-black shadow dark:bg-background0",
                    )}
                  >
                    <button

                      type="button"
                      onClick={() => editor.chain().focus().toggleBold().run()}
                      className={editor.isActive("bold") ? buttonActive : buttonInactive}
                    >
                      <FaBold className="text-xl hover:text-primary" />
                    </button>
                    <button
                      type="button"
                      onClick={() => editor.chain().focus().toggleItalic().run()}
                      className={editor.isActive("italic") ? buttonActive : buttonInactive}
                    >
                      <FaItalic className="text-xl hover:text-primary" />
                    </button>
                    <button
                      type="button"
                      onClick={() => editor.chain().focus().toggleStrike().run()}
                      className={editor.isActive("strike") ? buttonActive : buttonInactive}
                    >
                      <FaStrikethrough className="text-xl hover:text-primary" />
                    </button>

                    <Minus color="#09090b" strokeWidth={1.5} />
                    <button
                      type="button"
                      onClick={handleSetLink}
                      className={editor.isActive("link") ? buttonActive : buttonInactive}
                    >
                      <FaLink className="text-xl hover:text-primary" />
                    </button>
                    <button
                      type="button"
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
                    <button onClick={() => editor.chain().focus().toggleHighlight().run()} className={editor.isActive('highlight') ? 'is-active' : ''}>
                      <FaHighlighter className="text-xl hover:text-primary" />
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

                  </BubbleMenu>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Inserting Options</AccordionTrigger>
              <AccordionContent>
                <div className='flex mx-auto overflow-x-auto' >
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Button
                        className='mx-2'
                        variant="link" >
                        Client
                      </Button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80 max-h-[350px] h-auto  overflow-y-scroll bg-background border border-border">
                      <div className=''>
                        <ClientAttributes items={clientAtr} />
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Button
                        className='mx-2'
                        variant="link" >
                        Wanted Veh.
                      </Button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80 max-h-[350px] h-auto  overflow-y-scroll bg-background border border-border">
                      <div className=''>
                        <ClientAttributes items={wantedVehAttr} />
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Button
                        className='mx-2'
                        variant="link" >
                        Trade Veh
                      </Button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80 max-h-[350px] h-auto  overflow-y-scroll bg-background border border-border">
                      <div className=''>
                        <ClientAttributes items={tradeVehAttr} />
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Button
                        className='mx-2'
                        variant="link" >
                        Sales Person
                      </Button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80 max-h-[350px] h-auto  overflow-y-scroll bg-background border border-border">
                      <div className=''>
                        <ClientAttributes items={salesPersonAttr} />
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Button
                        className='mx-2'
                        variant="link" >
                        F & I
                      </Button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80 max-h-[350px] h-auto  overflow-y-scroll bg-background border border-border">
                      <div className=''>
                        <ClientAttributes items={FandIAttr} />
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Button
                        className='mx-2'
                        variant="link" >
                        Dealer Info
                      </Button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80 max-h-[350px] h-auto  overflow-y-scroll bg-background border border-border">
                      <div className=''>
                        <ClientAttributes items={dealerInfo} />
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Button
                        className='mx-2'
                        variant="link" >
                        Finance Info
                      </Button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80 max-h-[350px] h-auto  overflow-y-scroll bg-background border border-border">
                      <ClientAttributes items={financeInfo} />
                    </HoverCardContent>
                  </HoverCard>
                </div>
              </AccordionContent>
            </AccordionItem>

          </Accordion>

          <br />
          <EditorContent editor={editor} className="mt-1 p-3 mb-2  cursor-text border border-border text-foreground bg-background mx-auto w-[95%] rounded-md" />
          <br />
          <input type='hidden' defaultValue={user?.email} name='userEmail' />
          <input type='hidden' name='intent' />
          <input type='hidden' defaultValue={text} name='body' />
          <div className='flex justify-between w-[98%]'>
            <div>
            </div>
            <Button
              onClick={() => {
                //  SaveDraft();
                toast.success(`Template saved!`)
              }}
              type='submit'
              value='createTemplate'
              name='intent'
              className={`border-border text-foreground bg-primary rounded-lg ml-2 cursor-pointer rounded border  p-3 text-center text-xs font-bold uppercase   shadow outline-none transition-all duration-150 ease-linear hover:bg-transparent bg-transparent hover:text-primary hover:shadow-md focus:outline-none `}>
              Save Template
            </Button>

          </div>
          <br />
        </div >
      </Form>
    </div >
  )
}
export function EditorTiptapHookNewTemplatesNew({ user, content, selectedRecord }: {
  user?: any,
  content?: any,
  selectedRecord?: any,
}) {
  const [text, setText] = useState('')

  const editor = Editor(content, setText)
  const [category, setCategory] = useState('')
  const [title, setTitle] = useState('')
  const [subject, setSubject] = useState('')

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
  editor?.commands.setContent({
    "type": "doc",
    "content": [
      {
        "type": "paragraph",
        "content": [
          {
            "type": "text",
            "text": selectedRecord.body
          }
        ]
      }
    ]
  })

  const [attribute, setAttribute] = useState('')
  function AttributeClick(item) {
    setAttribute(item.title);
    editor.commands.insertContent(item.attribute);
    console.log(item.attribute, 'attribute')
  }

  function ClientAttributes({ items, ...props }) {
    return (
      <nav
        className={cn(
          'flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1',
        )}
        {...props}
      >
        {items.map((item) => (
          <Button
            key={item.title}
            variant="ghost"
            className={cn(
              buttonVariants({ variant: 'ghost' }),
              attribute === item.title
                ? 'bg-background hover:bg-muted/50 w-[90%] border-l-[#0969da]'
                : 'hover:bg-muted/50 w-[90%]',
              'justify-start w-[90%]'
            )}
            value={item.attribute}
            onClick={() => {
              AttributeClick(item)
            }}
          >
            {item.title}
          </Button>
        ))}
      </nav>
    )
  }
  if (!editor) return null
  return (
    <div className="p-1">
      <Form method='post' action='/dealer/user/dashboard/templates'>
        <div className="mr-auto px-2   mt-auto grid grid-cols-1">
          <div className="grid gap-3 mx-3 mb-3">
            <div className="relative mt-3">
              <Input
                name='title'
                type="text"
                className="w-full bg-background border-border "
                defaultValue={selectedRecord.title}
              />
              <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Title</label>
            </div>
            <div className="relative mt-3">
              <Input
                name='category'
                type="text"
                className="w-full bg-background border-border "
                defaultValue={selectedRecord.category}
              />
              <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Category</label>
            </div>
            <div className="relative mt-3">
              <Input
                name='subCat'
                type="text"
                className="w-full bg-background border-border "
                defaultValue={selectedRecord.subCat}
              />
              <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Sub-category</label>
            </div>
            <div className="relative mt-3">
              <Input
                name='subject'
                type="text"
                className="w-full bg-background border-border "
                defaultValue={selectedRecord.subject}
              />
              <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Subject</label>
            </div>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Formatting Options</AccordionTrigger>
              <AccordionContent>
                <div
                  className={cn(
                    "z-10 mb-1 w-[99%] mt-1 flex flex-wrap max-auto items-center gap-1 rounded-md p-1  mx-auto",
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
                      "  text-black shadow dark:bg-background0",
                    )}
                  >
                    <button

                      type="button"
                      onClick={() => editor.chain().focus().toggleBold().run()}
                      className={editor.isActive("bold") ? buttonActive : buttonInactive}
                    >
                      <FaBold className="text-xl hover:text-primary" />
                    </button>
                    <button
                      type="button"
                      onClick={() => editor.chain().focus().toggleItalic().run()}
                      className={editor.isActive("italic") ? buttonActive : buttonInactive}
                    >
                      <FaItalic className="text-xl hover:text-primary" />
                    </button>
                    <button
                      type="button"
                      onClick={() => editor.chain().focus().toggleStrike().run()}
                      className={editor.isActive("strike") ? buttonActive : buttonInactive}
                    >
                      <FaStrikethrough className="text-xl hover:text-primary" />
                    </button>

                    <Minus color="#09090b" strokeWidth={1.5} />
                    <button
                      type="button"
                      onClick={handleSetLink}
                      className={editor.isActive("link") ? buttonActive : buttonInactive}
                    >
                      <FaLink className="text-xl hover:text-primary" />
                    </button>
                    <button
                      type="button"
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
                    <button onClick={() => editor.chain().focus().toggleHighlight().run()} className={editor.isActive('highlight') ? 'is-active' : ''}>
                      <FaHighlighter className="text-xl hover:text-primary" />
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

                  </BubbleMenu>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Inserting Options</AccordionTrigger>
              <AccordionContent>
                <div className='flex mx-auto overflow-x-auto' >
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Button
                        className='mx-2'
                        variant="link" >
                        Client
                      </Button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80 max-h-[350px] h-auto  overflow-y-scroll bg-background border border-border">
                      <div className=''>
                        <ClientAttributes items={clientAtr} />
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Button
                        className='mx-2'
                        variant="link" >
                        Wanted Veh.
                      </Button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80 max-h-[350px] h-auto  overflow-y-scroll bg-background border border-border">
                      <div className=''>
                        <ClientAttributes items={wantedVehAttr} />
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Button
                        className='mx-2'
                        variant="link" >
                        Trade Veh
                      </Button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80 max-h-[350px] h-auto  overflow-y-scroll bg-background border border-border">
                      <div className=''>
                        <ClientAttributes items={tradeVehAttr} />
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Button
                        className='mx-2'
                        variant="link" >
                        Sales Person
                      </Button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80 max-h-[350px] h-auto  overflow-y-scroll bg-background border border-border">
                      <div className=''>
                        <ClientAttributes items={salesPersonAttr} />
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Button
                        className='mx-2'
                        variant="link" >
                        F & I
                      </Button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80 max-h-[350px] h-auto  overflow-y-scroll bg-background border border-border">
                      <div className=''>
                        <ClientAttributes items={FandIAttr} />
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Button
                        className='mx-2'
                        variant="link" >
                        Dealer Info
                      </Button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80 max-h-[350px] h-auto  overflow-y-scroll bg-background border border-border">
                      <div className=''>
                        <ClientAttributes items={dealerInfo} />
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Button
                        className='mx-2'
                        variant="link" >
                        Finance Info
                      </Button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80 max-h-[350px] h-auto  overflow-y-scroll bg-background border border-border">
                      <ClientAttributes items={financeInfo} />
                    </HoverCardContent>
                  </HoverCard>
                </div>
              </AccordionContent>
            </AccordionItem>

          </Accordion>

          <br />
          <EditorContent editor={editor} className="mt-1 p-3 mb-2  cursor-text text-foreground bg-background mx-auto w-[95%] rounded-md" />
          <br />
          <input type='hidden' defaultValue={user?.email} name='userEmail' />
          <input type='hidden' defaultValue={text} name='body' />
          <div className='flex justify-between w-[98%]'>
            <div>
            </div>
            <Button
              onClick={() => {
                //  SaveDraft();
                toast.success(`Template saved!`)
              }}
              type='submit'
              value='updateTemplate'
              name='intent'
              size='sm'
              className={`border-border text-foreground bg-primary rounded-lg ml-2 cursor-pointer rounded border  p-3 text-center text-xs font-bold uppercase   shadow outline-none transition-all duration-150 ease-linear hover:bg-transparent bg-transparent hover:text-primary hover:shadow-md focus:outline-none `}>
              Save Template
            </Button>

          </div>
          <br />
        </div >
      </Form>
    </div >
  )
}

export function EditorTiptapContext({
  content,
  children,
}: {
  content?: string
  children?: React.ReactNode
}) {
  const [text, setText] = useState(content)
  useEffect(() => {
    const text = window.localStorage.getItem("templateEmail");
    setText(text);
    console.log(text, 'texttt')
  }, []);
  return (
    <EditorProvider
      extensions={[
        StarterKit.configure({
          bulletList: {
            keepMarks: true,
            keepAttributes: false,
          },
          orderedList: {
            keepMarks: true,
            keepAttributes: false,
          },
        }),
        Highlight,
        Typography,
        Underline,
        Color.configure({ types: ['textStyle', TextStyle.name, ListItem.name] }),
        TextAlign.configure({
          types: ['heading', 'paragraph'],
        }),
      ]}
      content={text}
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
