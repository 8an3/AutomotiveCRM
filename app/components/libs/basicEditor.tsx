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
import React, { useCallback, useEffect, useRef, useState } from "react"
import { Undo, Redo, List, ScanLine, Eraser, Code, ListPlus, Brackets, Pilcrow, Minus, AlignLeft, AlignCenter, AlignRight, AlignJustify, Highlighter, WrapText, Quote, Heading1, Heading2, Heading3 } from 'lucide-react';
import { FaBold, FaStrikethrough, FaItalic, FaUnlink, FaLink, FaList, FaListOl, FaFileCode, FaQuoteLeft, FaUndo, FaAlignJustify, FaAlignLeft, FaRedo, FaAlignRight, FaAlignCenter, FaHighlighter, FaEraser } from "react-icons/fa";
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
export function Editor(content) {
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
  })
  return editor
}


export function EditorTiptapHook({ content, user, }: {
  content?: any,
  user?: any,
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
    const saveTemplate = await prisma.emailTemplates.create({
      body: editor.getText(),
      userEmail: user.email,
      subject: `New Template ${date}`,
      title: `New Template ${date}`,
      category: 'New Template'

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
          <Button onClick={() => { toast.success(`Template saved!`) }} name='intent' value='createTemplate' type='submit' className={` ml-2 cursor-pointer rounded border border-[#fff] p-3 text-center text-xs font-bold uppercase text-[#fff] shadow outline-none transition-all duration-150 ease-linear hover:bg-transparent bg-transparent hover:text-[#02a9ff] hover:shadow-md focus:outline-none `}>
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



//const contentExample = `<p> Write message here...</p>`
