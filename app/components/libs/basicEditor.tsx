import Highlight from "@tiptap/extension-highlight"
import Link from "@tiptap/extension-link"
import Placeholder from "@tiptap/extension-placeholder"
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'

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
import React, { Component, useCallback, useEffect, useRef, useState } from "react"
import { Undo, Redo, List, ScanLine, Eraser, Code, ListPlus, Brackets, Pilcrow, Minus, AlignLeft, AlignCenter, AlignRight, AlignJustify, Highlighter, WrapText, Quote, Heading1, Heading2, Heading3 } from 'lucide-react';
import { FaBold, FaStrikethrough, FaItalic, FaUnlink, FaLink, FaList, FaListOl, FaFileCode, FaQuoteLeft, FaUndo, FaAlignJustify, FaAlignLeft, FaRedo, FaAlignRight, FaAlignCenter, FaHighlighter, FaEraser, FaUnderline } from "react-icons/fa";
import { BiCodeBlock } from "react-icons/bi";
import { MdHorizontalRule } from "react-icons/md";
import { IoMdReturnLeft } from "react-icons/io";

import { IconMatch, } from "./icons"
import { Button, buttonVariants } from "../ui/button"
import { cn } from "../ui/utils"
import { parseHTML } from "~/utils/html"
import { fixUrl } from "~/utils/url"
import { Form } from "@remix-run/react"
import { toast } from "sonner"
import { prisma } from "~/libs/prisma.server"
import { SendNewEmail } from "../microsoft/GraphService"
import { SendNewEmails } from "~/routes/__authorized/dealer/email/client"
import clsx from "clsx"

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
      if (handleUpdate) {
        handleUpdate(editor.getHTML())
      }
    },
  })
  return editor
}


export function EditorTiptapHook({ content, user, to, subject, app }: {
  content?: any,
  user?: any,
  to?: any,
  subject?: any,
  app?: any,
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
  const buttonInactive = 'bg-[#121212] text-white hover:text-[#02a9ff] hover:bg-transparent';

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
      <div className="mr-auto px-2   mt-auto grid grid-cols-1 border border-black rounded-md">
        <div className="my-2 flex justify-between">
          <select className={`autofill:placeholder:text-text-[#C2E6FF] justifty-start mx-2 h-9 w-auto cursor-pointer rounded border border-white  bg-slate12 px-2 text-xs uppercase text-white shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]`} onChange={(e) => {
            handleChange(e.target.value); // Pass the input value directly to handleChange
          }}    >
            <option value="">Select a Template</option>
            {templates && templates.map((template, index) => (
              <option key={index} value={template.body}>
                {template.title}
              </option>
            ))}
          </select>
          <Button onClick={() => { SaveDraft(); toast.success(`Template saved!`) }} name='intent' className={` ml-2 cursor-pointer rounded border border-[#fff] p-3 text-center text-xs font-bold uppercase text-[#fff] shadow outline-none transition-all duration-150 ease-linear hover:bg-transparent bg-transparent hover:text-[#02a9ff] hover:shadow-md focus:outline-none `}>
            Save Template
          </Button>

        </div>
        <div
          className={cn(
            "z-10 mb-1 w-[95%] mt-1 flex flex-wrap max-auto items-center gap-1 rounded-md p-1  mx-auto",
            "bg-[#121212] text-white transition-all justify-center",
            // "sm:sticky sm:top-[80px]",
          )}
        >
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive("bold") ? buttonActive : buttonInactive}
          >
            <FaBold className="text-xl hover:text-[#02a9ff]" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive("italic") ? buttonActive : buttonInactive}
          >
            <FaItalic className="text-xl hover:text-[#02a9ff]" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={editor.isActive("strike") ? buttonActive : buttonInactive}
          >
            <FaStrikethrough className="text-xl hover:text-[#02a9ff]" />
          </button>

          <Minus color="#121212" strokeWidth={1.5} />
          <button
            onClick={handleSetLink}
            className={editor.isActive("link") ? buttonActive : buttonInactive}
          >
            <FaLink className="text-xl hover:text-[#02a9ff]" />
          </button>
          <button
            onClick={() => editor.chain().focus().unsetLink().run()}
            disabled={!editor.isActive("link")}
            className={!editor.isActive("link") ? cn(buttonInactive, "opacity-25") : buttonInactive}
          >
            <FaUnlink className="text-xl hover:text-[#02a9ff]" />
          </button>
          <Minus color="#000" strokeWidth={1.5} />
          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={editor.isActive('blockquote') ? buttonActive : buttonInactive}
          >
            <FaQuoteLeft className="text-xl hover:text-[#02a9ff]" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={editor.isActive('code') ? buttonActive : buttonInactive}
            disabled={!editor.can().chain().focus().toggleCode().run()}
          >
            <FaFileCode className="text-xl hover:text-[#02a9ff]" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={editor.isActive('codeBlock') ? buttonActive : buttonInactive}
          >
            <BiCodeBlock className="text-xl hover:text-[#02a9ff]" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive('bulletList') ? buttonActive : buttonInactive}
          >
            <FaList className="text-xl hover:text-[#02a9ff]" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive('orderedList') ? buttonActive : buttonInactive}
          >
            <FaListOl className="text-xl hover:text-[#02a9ff]" />
          </button>

          <Minus color="#000" strokeWidth={1.5} />
          <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>
            <MdHorizontalRule className="text-xl hover:text-[#02a9ff]" />
          </button>
          <button onClick={() => editor.chain().focus().setHardBreak().run()}>
            <IoMdReturnLeft className="text-xl hover:text-[#02a9ff]" />
          </button>
          <Minus color="#000" strokeWidth={1.5} />
          <button
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
          >
            <FaUndo className="text-xl hover:text-[#02a9ff]" />
          </button>
          <button
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
          >
            <FaRedo className="text-xl hover:text-[#02a9ff]" />
          </button>
          <Minus color="#000" strokeWidth={1.5} />
          <button onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={editor.isActive({ textAlign: 'left' }) ? buttonActive : buttonInactive}
          >
            <FaAlignLeft className="text-xl hover:text-[#02a9ff]" />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={editor.isActive({ textAlign: 'center' }) ? buttonActive : buttonInactive}
          >
            <FaAlignCenter className="text-xl hover:text-[#02a9ff]" />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={editor.isActive({ textAlign: 'right' }) ? buttonActive : buttonInactive}
          >
            <FaAlignRight className="text-xl hover:text-[#02a9ff]" />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            className={editor.isActive({ textAlign: 'justify' }) ? buttonActive : buttonInactive}
          >
            <FaAlignJustify className="text-xl hover:text-[#02a9ff]" />
          </button>
          <Minus color="#000" strokeWidth={1.5} />
          <button
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            className={editor.isActive('highlight') ? buttonActive : buttonInactive}
          >
            <FaHighlighter className="text-xl hover:text-[#02a9ff]" />
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
            <FaEraser className="text-xl hover:text-[#02a9ff]" />
          </button>
          <Minus color="#000" strokeWidth={1.5} />
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={editor.isActive('heading', { level: 1 }) ? buttonActive : buttonInactive}
          >
            <Heading1 strokeWidth={1.5} className="text-xl hover:text-[#02a9ff]" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={editor.isActive('heading', { level: 2 }) ? buttonActive : buttonInactive}

          >
            <Heading2 strokeWidth={1.5} className="text-xl hover:text-[#02a9ff]" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={editor.isActive('heading', { level: 3 }) ? buttonActive : buttonInactive}

          >
            <Heading3 strokeWidth={1.5} className="text-xl hover:text-[#02a9ff]" />
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
              <FaBold className="text-xl hover:text-[#02a9ff]" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={editor.isActive("italic") ? buttonActive : buttonInactive}
            >
              <FaItalic className="text-xl hover:text-[#02a9ff]" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={editor.isActive("strike") ? buttonActive : buttonInactive}
            >
              <FaStrikethrough className="text-xl hover:text-[#02a9ff]" />
            </button>

            <Minus color="#121212" strokeWidth={1.5} />
            <button
              type="button"
              onClick={handleSetLink}
              className={editor.isActive("link") ? buttonActive : buttonInactive}
            >
              <FaLink className="text-xl hover:text-[#02a9ff]" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().unsetLink().run()}
              disabled={!editor.isActive("link")}
              className={!editor.isActive("link") ? cn(buttonInactive, "opacity-25") : buttonInactive}
            >
              <FaUnlink className="text-xl hover:text-[#02a9ff]" />
            </button>
            <Minus color="#000" strokeWidth={1.5} />
            <button
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={editor.isActive('blockquote') ? buttonActive : buttonInactive}
            >
              <FaQuoteLeft className="text-xl hover:text-[#02a9ff]" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleCode().run()}
              className={editor.isActive('code') ? buttonActive : buttonInactive}
              disabled={!editor.can().chain().focus().toggleCode().run()}
            >
              <FaFileCode className="text-xl hover:text-[#02a9ff]" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              className={editor.isActive('codeBlock') ? buttonActive : buttonInactive}
            >
              <BiCodeBlock className="text-xl hover:text-[#02a9ff]" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={editor.isActive('bulletList') ? buttonActive : buttonInactive}
            >
              <FaList className="text-xl hover:text-[#02a9ff]" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={editor.isActive('orderedList') ? buttonActive : buttonInactive}
            >
              <FaListOl className="text-xl hover:text-[#02a9ff]" />
            </button>

            <Minus color="#000" strokeWidth={1.5} />
            <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>
              <MdHorizontalRule className="text-xl hover:text-[#02a9ff]" />
            </button>
            <button onClick={() => editor.chain().focus().setHardBreak().run()}>
              <IoMdReturnLeft className="text-xl hover:text-[#02a9ff]" />
            </button>
            <Minus color="#000" strokeWidth={1.5} />
            <button
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().chain().focus().undo().run()}
            >
              <FaUndo className="text-xl hover:text-[#02a9ff]" />
            </button>
            <button
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().chain().focus().redo().run()}
            >
              <FaRedo className="text-xl hover:text-[#02a9ff]" />
            </button>
            <Minus color="#000" strokeWidth={1.5} />
            <button onClick={() => editor.chain().focus().setTextAlign('left').run()}
              className={editor.isActive({ textAlign: 'left' }) ? buttonActive : buttonInactive}
            >
              <FaAlignLeft className="text-xl hover:text-[#02a9ff]" />
            </button>
            <button
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              className={editor.isActive({ textAlign: 'center' }) ? buttonActive : buttonInactive}
            >
              <FaAlignCenter className="text-xl hover:text-[#02a9ff]" />
            </button>
            <button
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              className={editor.isActive({ textAlign: 'right' }) ? buttonActive : buttonInactive}
            >
              <FaAlignRight className="text-xl hover:text-[#02a9ff]" />
            </button>
            <button
              onClick={() => editor.chain().focus().setTextAlign('justify').run()}
              className={editor.isActive({ textAlign: 'justify' }) ? buttonActive : buttonInactive}
            >
              <FaAlignJustify className="text-xl hover:text-[#02a9ff]" />
            </button>
            <Minus color="#000" strokeWidth={1.5} />
            <button onClick={() => editor.chain().focus().toggleHighlight().run()} className={editor.isActive('highlight') ? 'is-active' : ''}>
              <FaHighlighter className="text-xl hover:text-[#02a9ff]" />
            </button>
            <Minus color="#000" strokeWidth={1.5} />
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={editor.isActive('heading', { level: 1 }) ? buttonActive : buttonInactive}
            >
              <Heading1 strokeWidth={1.5} className="text-xl hover:text-[#02a9ff]" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={editor.isActive('heading', { level: 2 }) ? buttonActive : buttonInactive}

            >
              <Heading2 strokeWidth={1.5} className="text-xl hover:text-[#02a9ff]" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              className={editor.isActive('heading', { level: 3 }) ? buttonActive : buttonInactive}

            >
              <Heading3 strokeWidth={1.5} className="text-xl hover:text-[#02a9ff]" />
            </button>

          </BubbleMenu>
        </div>
        <br />
        <EditorContent editor={editor} className="mt-1 p-3 mb-2  cursor-text border border-black bg-white mx-auto w-[95%] rounded-md" />
        <br />
        <input type='hidden' defaultValue={text} name='body' />

        <Button
          onClick={() => {
            toast.success(`Email sent!`)
            const body = editor?.getHTML()
            console.log(body, 'body', text, 'text')
            setTimeout(() => {
              SendNewEmail(app.authProvider!, subject, body, to)
              /// setReply(false)
            }, 5);
          }}
          className={` mr-2 cursor-pointer rounded border border-[#fff] p-3 text-center text-xs font-bold uppercase text-[#fff] shadow outline-none transition-all duration-150 ease-linear hover:bg-[#95959f] bg-transparent hover:text-[#02a9ff] hover:shadow-md focus:outline-none `}
        >
          Send2
        </Button>
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
  const buttonInactive = 'bg-[#121212] text-white hover:text-[#02a9ff] hover:bg-transparent';

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
      <div className="mr-auto px-2   mt-auto grid grid-cols-1 border border-black rounded-md">
        <div className="my-2 flex justify-between">
          <select className={`autofill:placeholder:text-text-[#C2E6FF] justifty-start mx-2 h-9 w-auto cursor-pointer rounded border border-white  bg-slate12 px-2 text-xs uppercase text-white shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]`} onChange={(e) => {
            handleChange(e.target.value); // Pass the input value directly to handleChange
          }}    >
            <option value="">Select a Template</option>
            {templates && templates.map((template, index) => (
              <option key={index} value={template.body}>
                {template.title}
              </option>
            ))}
          </select>
          <Button onClick={() => { SaveDraft(); toast.success(`Template saved!`) }} name='intent' className={` ml-2 cursor-pointer rounded border border-[#fff] p-3 text-center text-xs font-bold uppercase text-[#fff] shadow outline-none transition-all duration-150 ease-linear hover:bg-transparent bg-transparent hover:text-[#02a9ff] hover:shadow-md focus:outline-none `}>
            Save Template
          </Button>

        </div>
        <div
          className={cn(
            "z-10 mb-1 w-[95%] mt-1 flex flex-wrap max-auto items-center gap-1 rounded-md p-1  mx-auto",
            "bg-[#121212] text-white transition-all justify-center",
            // "sm:sticky sm:top-[80px]",
          )}
        >
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive("bold") ? buttonActive : buttonInactive}
          >
            <FaBold className="text-xl hover:text-[#02a9ff]" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive("italic") ? buttonActive : buttonInactive}
          >
            <FaItalic className="text-xl hover:text-[#02a9ff]" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={editor.isActive("strike") ? buttonActive : buttonInactive}
          >
            <FaStrikethrough className="text-xl hover:text-[#02a9ff]" />
          </button>

          <Minus color="#121212" strokeWidth={1.5} />
          <button
            onClick={handleSetLink}
            className={editor.isActive("link") ? buttonActive : buttonInactive}
          >
            <FaLink className="text-xl hover:text-[#02a9ff]" />
          </button>
          <button
            onClick={() => editor.chain().focus().unsetLink().run()}
            disabled={!editor.isActive("link")}
            className={!editor.isActive("link") ? cn(buttonInactive, "opacity-25") : buttonInactive}
          >
            <FaUnlink className="text-xl hover:text-[#02a9ff]" />
          </button>
          <Minus color="#000" strokeWidth={1.5} />
          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={editor.isActive('blockquote') ? buttonActive : buttonInactive}
          >
            <FaQuoteLeft className="text-xl hover:text-[#02a9ff]" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={editor.isActive('code') ? buttonActive : buttonInactive}
            disabled={!editor.can().chain().focus().toggleCode().run()}
          >
            <FaFileCode className="text-xl hover:text-[#02a9ff]" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={editor.isActive('codeBlock') ? buttonActive : buttonInactive}
          >
            <BiCodeBlock className="text-xl hover:text-[#02a9ff]" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive('bulletList') ? buttonActive : buttonInactive}
          >
            <FaList className="text-xl hover:text-[#02a9ff]" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive('orderedList') ? buttonActive : buttonInactive}
          >
            <FaListOl className="text-xl hover:text-[#02a9ff]" />
          </button>

          <Minus color="#000" strokeWidth={1.5} />
          <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>
            <MdHorizontalRule className="text-xl hover:text-[#02a9ff]" />
          </button>
          <button onClick={() => editor.chain().focus().setHardBreak().run()}>
            <IoMdReturnLeft className="text-xl hover:text-[#02a9ff]" />
          </button>
          <Minus color="#000" strokeWidth={1.5} />
          <button
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
          >
            <FaUndo className="text-xl hover:text-[#02a9ff]" />
          </button>
          <button
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
          >
            <FaRedo className="text-xl hover:text-[#02a9ff]" />
          </button>
          <Minus color="#000" strokeWidth={1.5} />
          <button onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={editor.isActive({ textAlign: 'left' }) ? buttonActive : buttonInactive}
          >
            <FaAlignLeft className="text-xl hover:text-[#02a9ff]" />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={editor.isActive({ textAlign: 'center' }) ? buttonActive : buttonInactive}
          >
            <FaAlignCenter className="text-xl hover:text-[#02a9ff]" />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={editor.isActive({ textAlign: 'right' }) ? buttonActive : buttonInactive}
          >
            <FaAlignRight className="text-xl hover:text-[#02a9ff]" />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            className={editor.isActive({ textAlign: 'justify' }) ? buttonActive : buttonInactive}
          >
            <FaAlignJustify className="text-xl hover:text-[#02a9ff]" />
          </button>
          <Minus color="#000" strokeWidth={1.5} />
          <button
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            className={editor.isActive('highlight') ? buttonActive : buttonInactive}
          >
            <FaHighlighter className="text-xl hover:text-[#02a9ff]" />
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
            <FaEraser className="text-xl hover:text-[#02a9ff]" />
          </button>
          <Minus color="#000" strokeWidth={1.5} />
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={editor.isActive('heading', { level: 1 }) ? buttonActive : buttonInactive}
          >
            <Heading1 strokeWidth={1.5} className="text-xl hover:text-[#02a9ff]" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={editor.isActive('heading', { level: 2 }) ? buttonActive : buttonInactive}

          >
            <Heading2 strokeWidth={1.5} className="text-xl hover:text-[#02a9ff]" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={editor.isActive('heading', { level: 3 }) ? buttonActive : buttonInactive}

          >
            <Heading3 strokeWidth={1.5} className="text-xl hover:text-[#02a9ff]" />
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
              <FaBold className="text-xl hover:text-[#02a9ff]" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={editor.isActive("italic") ? buttonActive : buttonInactive}
            >
              <FaItalic className="text-xl hover:text-[#02a9ff]" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={editor.isActive("strike") ? buttonActive : buttonInactive}
            >
              <FaStrikethrough className="text-xl hover:text-[#02a9ff]" />
            </button>

            <Minus color="#121212" strokeWidth={1.5} />
            <button
              type="button"
              onClick={handleSetLink}
              className={editor.isActive("link") ? buttonActive : buttonInactive}
            >
              <FaLink className="text-xl hover:text-[#02a9ff]" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().unsetLink().run()}
              disabled={!editor.isActive("link")}
              className={!editor.isActive("link") ? cn(buttonInactive, "opacity-25") : buttonInactive}
            >
              <FaUnlink className="text-xl hover:text-[#02a9ff]" />
            </button>
            <Minus color="#000" strokeWidth={1.5} />
            <button
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={editor.isActive('blockquote') ? buttonActive : buttonInactive}
            >
              <FaQuoteLeft className="text-xl hover:text-[#02a9ff]" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleCode().run()}
              className={editor.isActive('code') ? buttonActive : buttonInactive}
              disabled={!editor.can().chain().focus().toggleCode().run()}
            >
              <FaFileCode className="text-xl hover:text-[#02a9ff]" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              className={editor.isActive('codeBlock') ? buttonActive : buttonInactive}
            >
              <BiCodeBlock className="text-xl hover:text-[#02a9ff]" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={editor.isActive('bulletList') ? buttonActive : buttonInactive}
            >
              <FaList className="text-xl hover:text-[#02a9ff]" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={editor.isActive('orderedList') ? buttonActive : buttonInactive}
            >
              <FaListOl className="text-xl hover:text-[#02a9ff]" />
            </button>

            <Minus color="#000" strokeWidth={1.5} />
            <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>
              <MdHorizontalRule className="text-xl hover:text-[#02a9ff]" />
            </button>
            <button onClick={() => editor.chain().focus().setHardBreak().run()}>
              <IoMdReturnLeft className="text-xl hover:text-[#02a9ff]" />
            </button>
            <Minus color="#000" strokeWidth={1.5} />
            <button
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().chain().focus().undo().run()}
            >
              <FaUndo className="text-xl hover:text-[#02a9ff]" />
            </button>
            <button
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().chain().focus().redo().run()}
            >
              <FaRedo className="text-xl hover:text-[#02a9ff]" />
            </button>
            <Minus color="#000" strokeWidth={1.5} />
            <button onClick={() => editor.chain().focus().setTextAlign('left').run()}
              className={editor.isActive({ textAlign: 'left' }) ? buttonActive : buttonInactive}
            >
              <FaAlignLeft className="text-xl hover:text-[#02a9ff]" />
            </button>
            <button
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              className={editor.isActive({ textAlign: 'center' }) ? buttonActive : buttonInactive}
            >
              <FaAlignCenter className="text-xl hover:text-[#02a9ff]" />
            </button>
            <button
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              className={editor.isActive({ textAlign: 'right' }) ? buttonActive : buttonInactive}
            >
              <FaAlignRight className="text-xl hover:text-[#02a9ff]" />
            </button>
            <button
              onClick={() => editor.chain().focus().setTextAlign('justify').run()}
              className={editor.isActive({ textAlign: 'justify' }) ? buttonActive : buttonInactive}
            >
              <FaAlignJustify className="text-xl hover:text-[#02a9ff]" />
            </button>
            <Minus color="#000" strokeWidth={1.5} />
            <button onClick={() => editor.chain().focus().toggleHighlight().run()} className={editor.isActive('highlight') ? 'is-active' : ''}>
              <FaHighlighter className="text-xl hover:text-[#02a9ff]" />
            </button>
            <Minus color="#000" strokeWidth={1.5} />
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={editor.isActive('heading', { level: 1 }) ? buttonActive : buttonInactive}
            >
              <Heading1 strokeWidth={1.5} className="text-xl hover:text-[#02a9ff]" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={editor.isActive('heading', { level: 2 }) ? buttonActive : buttonInactive}

            >
              <Heading2 strokeWidth={1.5} className="text-xl hover:text-[#02a9ff]" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              className={editor.isActive('heading', { level: 3 }) ? buttonActive : buttonInactive}

            >
              <Heading3 strokeWidth={1.5} className="text-xl hover:text-[#02a9ff]" />
            </button>

          </BubbleMenu>
        </div>
        <br />
        <EditorContent editor={editor} className="mt-1 p-3 mb-2  cursor-text border border-black bg-white mx-auto w-[95%] rounded-md" />
        <br />
        <input type='hidden' defaultValue={text} name='body' />

        <Button
          onClick={() => {
            toast.success(`Email sent!`)
            const body = editor?.getHTML()
            console.log(body, 'body', text, 'text')
            setTimeout(() => {
              SendNewEmail(app.authProvider!, subject, body, to)
              /// setReply(false)
            }, 5);
          }}
          className={`w-auto mr-2 cursor-pointer rounded border border-[#fff] p-3 text-center text-xs font-bold uppercase text-[#fff] shadow outline-none transition-all duration-150 ease-linear hover:bg-[#95959f] bg-transparent hover:text-[#02a9ff] hover:shadow-md focus:outline-none `}
        >
          Send
        </Button>
        <br />
      </div >
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


// --------------------------------------------------------------------------------
export const BubbleMenu = ({ editor, containerRef }: BubbleMenuProps) => {
  const [selectionType, setSelectionType] = useState<SelectionMenuType>(null);
  useEffect(() => {
    if (selectionType !== "link") setSelectionType(null);
  }, []);
  if (!editor || !containerRef.current) return null;
  return (
    <BubbleMenu
      pluginKey="bubbleMenu"
      editor={editor}
      className="bubble-menu"
      tippyOptions={{
        appendTo: containerRef.current,
      }}
    >
      <SelectionMenu
        editor={editor}
        selectionType={selectionType}
        setSelectionType={setSelectionType}
      />
    </BubbleMenu>
  );
};

export interface BubbleMenuProps {
  editor: Editor;
  containerRef: RefObject<HTMLDivElement>;
}

export type SelectionMenuType = "link" | null;

const SelectionMenu = ({
  editor,
  selectionType,
  setSelectionType,
}: {
  editor: Editor;
  selectionType: SelectionMenuType;
  setSelectionType: (type: SelectionMenuType) => void;
}) => {
  switch (selectionType) {
    case null:
      return (
        <>
          <button
            type="button"
            data-test-id="mark-bold"
            className={clsx({
              active: editor.isActive("bold"),
            })}
            onClick={() => editor.chain().toggleBold().run()}
          >
            <FaBold className="text-xl hover:text-[#02a9ff]" />
          </button>
          <button
            type="button"
            data-test-id="mark-italic"
            className={clsx({
              active: editor.isActive("italic"),
            })}
            onClick={() => editor.chain().toggleItalic().run()}
          >
            <FaItalic className="text-xl hover:text-[#02a9ff]" />

          </button>
          <button
            type="button"
            data-test-id="mark-underline"
            className={clsx({
              active: editor.isActive("underline"),
            })}
            onClick={() => editor.chain().toggleUnderline().run()}
          >
            <FaUnderline />
          </button>
          <button
            type="button"
            data-test-id="mark-strike"
            className={clsx({
              active: editor.isActive("strike"),
            })}
            onClick={() => editor.chain().toggleStrike().run()}
          >
            <FaStrikethrough className="text-xl hover:text-[#02a9ff]" />

          </button>
          <button
            type="button"
            data-test-id="mark-link"
            className={clsx({
              active: editor.isActive("link"),
            })}
            onClick={() => {
              setSelectionType("link");
            }}
          >
            <FaLink className="text-xl hover:text-[#02a9ff]" />
          </button>
        </>
      );
    case "link":
      return (
        <div className="insert-link-box">
          <input
            data-test-id="insert-link-value"
            autoFocus
            type="text"
            placeholder="Insert link address"
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                editor
                  .chain()
                  .focus()
                  .setLink({
                    href: (event.target as HTMLInputElement).value,
                    target: "_blank",
                  })
                  .run();
                setSelectionType(null);
              }
            }}
          />
        </div>
      );
  }
};



class CommandsView extends Component<SuggestionProps> {
  state = {
    selectedIndex: null,
  };

  componentDidUpdate(oldProps: SuggestionProps) {
    if (this.props.items !== oldProps.items) {
      this.setState({
        selectedIndex: 0,
      });
    }
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === "ArrowUp") {
      this.upHandler();
      return true;
    }

    if (event.key === "ArrowDown") {
      this.downHandler();
      return true;
    }

    if (event.key === "Enter") {
      this.enterHandler();
      return true;
    }

    return false;
  }

  upHandler() {
    this.setState({
      selectedIndex:
        ((this.state.selectedIndex || 0) + this.props.items.length - 1) %
        this.props.items.length,
    });
  }

  downHandler() {
    this.setState({
      selectedIndex:
        this.state.selectedIndex === null
          ? 0
          : ((this.state.selectedIndex || 0) + 1) % this.props.items.length,
    });
  }

  enterHandler() {
    this.selectItem(this.state.selectedIndex);
  }

  selectItem(index: number | null) {
    const item = this.props.items[index || 0];

    if (item) {
      this.props.command(item);
    }
  }

  render() {
    const { items } = this.props;
    return (
      <div className="insert-menu">
        {items.map((item, index) => {
          return (
            <button
              type="button"
              className={`${index === this.state.selectedIndex ? "active" : ""
                }`}
              {...item.attrs}
              key={index}
              onClick={() => this.selectItem(index)}
            >
              {item.element || item.title}
            </button>
          );
        })}
      </div>
    );
  }
}

export class ChangeMenuView {
  public editor: Editor;

  public element: HTMLElement;

  public view: EditorView;

  public preventHide = false;

  public tippy: Instance | undefined;

  public tippyOptions?: Partial<Props>;

  public shouldShow: Exclude<ChangeMenuPluginProps["shouldShow"], null> = ({
    view,
    state,
  }) => {
    const { selection } = state;
    const { $anchor, $from, empty } = selection;
    const disabledContents = [
      "imageNode",
      "imagePlaceholder",
      "videoNode",
      "videoPlaceholder",
    ];
    let isDisabled = false;
    if ($anchor && $anchor.node(1)) {
      const node = $anchor.node(1);
      const contents = node.content ? node.content?.toJSON() || [] : [];
      isDisabled = contents.find((c: { type: string }) =>
        disabledContents.includes(c.type)
      );
    }
    const isRootDepth = $anchor.depth === 1;
    const isEmptyTextBlock =
      $anchor.parent.isTextblock &&
      !$anchor.parent.type.spec.code &&
      !$anchor.parent.textContent;

    if (
      !view.hasFocus() ||
      isDisabled ||
      // !empty ||
      // !isRootDepth ||
      // !isEmptyTextBlock ||
      !this.editor.isEditable
    ) {
      return false;
    }

    return true;
  };

  constructor({
    editor,
    element,
    view,
    tippyOptions = {},
    shouldShow,
  }: ChangeMenuViewProps) {
    this.editor = editor;
    this.element = element;
    this.view = view;

    if (shouldShow) {
      this.shouldShow = shouldShow;
    }

    this.element.addEventListener("mousedown", this.mousedownHandler, {
      capture: true,
    });
    this.editor.on("focus", this.focusHandler);
    this.editor.on("blur", this.blurHandler);
    this.tippyOptions = tippyOptions;
    // Detaches menu content from its current parent
    this.element.remove();
    this.element.style.visibility = "visible";
  }

  mousedownHandler = () => {
    this.preventHide = true;
  };

  focusHandler = () => {
    // we use `setTimeout` to make sure `selection` is already updated
    setTimeout(() => this.update(this.editor.view));
  };

  blurHandler = ({ event }: { event: FocusEvent }) => {
    if (this.preventHide) {
      this.preventHide = false;

      return;
    }

    if (
      event?.relatedTarget &&
      this.element.parentNode?.contains(event.relatedTarget as Node)
    ) {
      return;
    }

    this.hide();
  };

  tippyBlurHandler = (event: FocusEvent) => {
    this.blurHandler({ event });
  };

  createTooltip() {
    const { element: editorElement } = this.editor.options;
    const editorIsAttached = !!editorElement.parentElement;

    if (this.tippy || !editorIsAttached) {
      return;
    }

    this.tippy = this.tippy(editorElement, {
      duration: 0,
      getReferenceClientRect: null,
      content: this.element,
      interactive: true,
      trigger: "manual",
      placement: "right-start",
      ...this.tippyOptions,
    });

    // maybe we have to hide tippy on its own blur event as well
    if (this.tippy.popper.firstChild) {
      (this.tippy.popper.firstChild as HTMLElement).addEventListener(
        "blur",
        this.tippyBlurHandler
      );
    }
  }

  update(view: EditorView, oldState?: EditorState) {
    const { state } = view;
    const { doc, selection } = state;
    const isSame =
      oldState && oldState.doc.eq(doc) && oldState.selection.eq(selection);

    if (isSame) {
      return;
    }

    this.createTooltip();

    const shouldShow = this.shouldShow?.({
      editor: this.editor,
      view,
      state,
      oldState,
    });

    if (!shouldShow) {
      this.hide();

      return;
    }

    this.tippy?.setProps({
      getReferenceClientRect:
        this.tippyOptions?.getReferenceClientRect ||
        (() => {
          const from = selection.$from.posAtIndex(0);
          const boundaries = posToDOMRect(view, 1, 1);
          const nodeRect = posToDOMRect(view, from, from);
          return {
            ...nodeRect,
            left: boundaries.left,
            right: boundaries.right,
          };
        }),
    });

    this.show();
  }

  show() {
    this.tippy?.show();
  }

  hide() {
    this.tippy?.hide();
  }

  destroy() {
    if (this.tippy?.popper.firstChild) {
      (this.tippy.popper.firstChild as HTMLElement).removeEventListener(
        "blur",
        this.tippyBlurHandler
      );
    }
    this.tippy?.destroy();
    this.element.removeEventListener("mousedown", this.mousedownHandler, {
      capture: true,
    });
    this.editor.off("focus", this.focusHandler);
    this.editor.off("blur", this.blurHandler);
  }
}

const ChangeMenuPlugin = (options: ChangeMenuPluginProps) => {
  return new Plugin({
    key:
      typeof options.pluginKey === "string"
        ? new PluginKey(options.pluginKey)
        : options.pluginKey,
    view: (view) => new ChangeMenuView({ view, ...options }),
  });
};

export const ChangeMenuReact = Extension.create({
  name: "changeMenu",
  addOptions() {
    return {
      element: null,
      tippyOptions: {},
      pluginKey: "changeMenu",
      shouldShow: null,
    };
  },
  addProseMirrorPlugins() {
    return [
      ChangeMenuPlugin({
        pluginKey: this.options.pluginKey,
        editor: this.editor,
        element: this.options.element,
        tippyOptions: this.options.tippyOptions,
        shouldShow: this.options.shouldShow,
      }),
    ];
  },
});

export interface ChangeMenuProps {
  containerRef: RefObject<HTMLDivElement>;
  className?: string;
  editor: Editor;
  tippyOptions?: Partial<Props>;
  shouldShow?:
  | ((props: {
    editor: Editor;
    view: EditorView;
    state: EditorState;
    oldState?: EditorState;
  }) => boolean)
  | null;
}

export type MenuItemProps = {
  title: string;
  subtitle?: string;
  attrs: any;
  command: ({
    editor,
    range,
  }: {
    editor: Editor;
    range: { from: number; to: number };
  }) => void;
}[];

export const ChangeMenu = (props: PropsWithChildren<ChangeMenuProps>) => {
  const [element, setElement] = useState<HTMLDivElement | null>(null);
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    if (!element) {
      return;
    }

    if (props.editor.isDestroyed) {
      return;
    }

    const pluginKey = "changeMenu";
    const { editor, tippyOptions = {}, shouldShow = null } = props;

    const plugin = ChangeMenuPlugin({
      editor,
      element,
      pluginKey,
      shouldShow,
      tippyOptions,
    });

    editor.registerPlugin(plugin);
    return () => editor.unregisterPlugin(pluginKey);
  }, [props.editor, element]);

  const menus: MenuItemProps = [
    {
      title: "Paragraph",
      attrs: {
        "data-test-id": "set-paragraph",
      },
      command: ({ editor, range }) => {
        editor
          .chain()
          .focus()
          .clearNodes()
          .toggleNode("paragraph", "paragraph", {})
          .run();
      },
    },
    {
      title: "Heading",
      attrs: {
        "data-test-id": "set-heading1",
      },
      command: ({ editor, range }) => {
        editor.chain().focus().setNode("heading", { level: 1 }).run();
      },
    },
    {
      title: "Subheading",
      attrs: {
        "data-test-id": "set-heading2",
      },
      command: ({ editor }) => {
        editor.chain().focus().setNode("heading", { level: 2 }).run();
      },
    },
    {
      title: "Small Subheading",
      attrs: {
        "data-test-id": "set-heading3",
      },
      command: ({ editor }) => {
        editor.chain().focus().setNode("heading", { level: 3 }).run();
      },
    },
    {
      title: "Quote",
      attrs: {
        "data-test-id": "set-quote",
      },
      command: ({ editor, range }) => {
        editor.chain().focus().clearNodes().setBlockquote().run();
      },
    },
    {
      title: "Bullet List",
      attrs: {
        "data-test-id": "set-bullet-list",
      },
      command: ({ editor, range }) => {
        editor.chain().focus().clearNodes().toggleBulletList().run();
      },
    },
    {
      title: "Numbered List",
      attrs: {
        "data-test-id": "set-ordered-list",
      },
      command: ({ editor, range }) => {
        editor.chain().focus().toggleOrderedList().run();
      },
    },
    {
      title: "Code Block",
      attrs: {
        "data-test-id": "set-code",
      },
      command: ({ editor, range }) => {
        editor.chain().focus().setCodeBlock().run();
      },
    },
    {
      title: "Callout",
      attrs: {
        "data-test-id": "set-callout",
      },
      command: ({ editor, range }) => {
        editor.chain().focus().setCallout().run();
      },
    },
  ];

  return (
    <div
      ref={setElement}
      className={props.className}
      data-test-id="change-block"
      style={{ visibility: "hidden" }}
    >
      <ChangeIcon onClick={() => setShowList(!showList)} />
      {showList ? (
        <div className="block-menu">
          {menus.map(({ attrs, title, subtitle, command }) => {
            return (
              <div
                key={title}
                className="menu-item"
                {...attrs}
                onClick={() => {
                  setShowList(false);
                  const { selection } = props.editor.state;
                  const $anchor = selection.$anchor;
                  const range = {
                    from: $anchor.posAtIndex(0, 1),
                    to: $anchor.posAtIndex(1, 1),
                  };
                  command({ editor: props.editor, range });
                }}
              >
                {title}
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};

const CommandsPlugin = Extension.create({
  name: "insertMenu",
  addProseMirrorPlugins() {
    return [
      Suggestion<CommandProps>({
        editor: this.editor,
        char: "/",
        command: ({ editor, range, props }) => {
          props.command({ editor, range, props });
        },
        items: ({ query }) => {
          return (
            [
              {
                title: "Heading",
                attrs: {
                  "data-test-id": "insert-heading1",
                },
                command: ({ editor }) => {
                  const selection = editor.view.state.selection;
                  const from = selection.$from.posAtIndex(0);
                  const to = selection.$from.posAtIndex(1);
                  editor
                    .chain()
                    .focus()
                    .deleteRange({ from, to })
                    .setNode("heading", { level: 1 })
                    .run();
                },
              },
              {
                title: "Subheading",
                attrs: {
                  "data-test-id": "insert-heading2",
                },
                command: ({ editor }) => {
                  const selection = editor.view.state.selection;
                  const from = selection.$from.posAtIndex(0);
                  const to = selection.$from.posAtIndex(1);
                  editor
                    .chain()
                    .focus()
                    .deleteRange({ from, to })
                    .setNode("heading", { level: 2 })
                    .run();
                },
              },
              {
                title: "Small Subheading",
                attrs: {
                  "data-test-id": "insert-heading3",
                },
                command: ({ editor }) => {
                  const selection = editor.view.state.selection;
                  const from = selection.$from.posAtIndex(0);
                  const to = selection.$from.posAtIndex(1);
                  editor
                    .chain()
                    .focus()
                    .deleteRange({ from, to })
                    .setNode("heading", { level: 3 })
                    .run();
                },
              },
              {
                title: "Quote",
                attrs: {
                  "data-test-id": "insert-quote",
                },
                command: ({ editor, range }) => {
                  const selection = editor.view.state.selection;
                  const from = selection.$from.posAtIndex(0);
                  const to = selection.$from.posAtIndex(1);
                  editor
                    .chain()
                    .focus()
                    .deleteRange({ from, to })
                    .setBlockquote()
                    .run();
                },
              },
              {
                title: "Bullet List",
                attrs: {
                  "data-test-id": "insert-bullet-list",
                },
                command: ({ editor, range }) => {
                  const selection = editor.view.state.selection;
                  const from = selection.$from.posAtIndex(0);
                  const to = selection.$from.posAtIndex(1);
                  editor
                    .chain()
                    .focus()
                    .deleteRange({ from, to })
                    .toggleBulletList()
                    .run();
                },
              },
              {
                title: "Numbered List",
                attrs: {
                  "data-test-id": "insert-ordered-list",
                },
                command: ({ editor, range }) => {
                  const selection = editor.view.state.selection;
                  const from = selection.$from.posAtIndex(0);
                  const to = selection.$from.posAtIndex(1);
                  editor
                    .chain()
                    .focus()
                    .deleteRange({ from, to })
                    .toggleOrderedList()
                    .run();
                },
              },
              {
                title: "Code Block",
                attrs: {
                  "data-test-id": "insert-code",
                },
                command: ({ editor, range }) => {
                  const selection = editor.view.state.selection;
                  const from = selection.$from.posAtIndex(0);
                  const to = selection.$from.posAtIndex(1);
                  editor
                    .chain()
                    .focus()
                    .deleteRange({ from, to })
                    .setCodeBlock()
                    .run();
                },
              },
              {
                title: "Callout",
                attrs: {
                  "data-test-id": "insert-callout",
                },
                command: ({ editor, range }) => {
                  const selection = editor.view.state.selection;
                  const from = selection.$from.posAtIndex(0);
                  const to = selection.$from.posAtIndex(1);
                  editor
                    .chain()
                    .focus()
                    .deleteRange({ from, to })
                    .setCallout()
                    .run();
                },
              },
              {
                title: "Image",
                attrs: {
                  "data-test-id": "insert-image",
                },
                command: ({ editor, range }) => {
                  const selection = editor.view.state.selection;
                  const from = selection.$from.posAtIndex(0);
                  const to = selection.$from.posAtIndex(1);
                  editor
                    .chain()
                    .focus()
                    .deleteRange({ from, to })
                    .insertContentAt(from, { type: "imagePlaceholder" })
                    .run();
                },
              },
              {
                title: "Video",
                attrs: {
                  "data-test-id": "insert-video",
                },
                command: ({ editor, range }) => {
                  const selection = editor.view.state.selection;
                  const from = selection.$from.posAtIndex(0);
                  const to = selection.$from.posAtIndex(1);
                  editor
                    .chain()
                    .focus()
                    .deleteRange({ from, to })
                    .insertContentAt(from, { type: "videoPlaceholder" })
                    .run();
                },
              },
            ] as CommandProps[]
          )
            .filter((item) => {
              return item.title.toLowerCase().startsWith(query.toLowerCase());
            })
            .slice(0, 10);
        },
        startOfLine: true,
        allow: ({ state, range, editor }) => {
          const node = state.selection.$from.node();
          if (!node) return false;
          return node.textBetween(0, 1) === "/";
        },
        render: () => {
          let component: ReactRenderer<CommandsView, any>, popup: Instance<any>;
          return {
            onStart: (props) => {
              component = new ReactRenderer(CommandsView, {
                props,
                editor: props.editor,
              });
              popup = tippy(props.editor.options.element, {
                getReferenceClientRect:
                  props.clientRect as GetReferenceClientRect,
                content: component.element,
                showOnCreate: true,
                interactive: true,
                trigger: "manual",
                placement: "bottom-start",
              });
            },
            onUpdate: (props) => {
              component.updateProps(props);
              popup.setProps({
                getReferenceClientRect: props.clientRect,
              });
            },
            onKeyDown: ({ event }) => {
              if (event.key === "Escape") {
                popup.hide();
                return true;
              }
              if (component.ref)
                return component.ref.onKeyDown(event as KeyboardEvent);
              else return true;
            },
            onExit: () => {
              component.destroy();
              popup.destroy();
            },
          };
        },
      }),
    ];
  },
});
