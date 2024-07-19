import {
  Tabs,
  TabsList,
  TabsTrigger,
  Input,
  Button,
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
  Dialog as Dialog1,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  Label,
} from "~/components";
import ProvideAppContext, {
  useAppContext,
} from "~/components/microsoft/AppContext";
import { toast } from "sonner";
import secondary from "~/styles/secondary.css";
import { SaveDraft, SendEmail } from "./notificationsClient";
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

import { cn } from "~/components/ui/utils"
import { parseHTML } from "~/utils/html"
import { fixUrl } from "~/utils/url"
import { Form } from "@remix-run/react"
import { prisma } from "~/libs/prisma.server"
import { ComposeEmail, ComposeEmailTwo, MassEmail, SendNewEmail } from "~/components/microsoft/GraphService"
import {
  SelectContent, SelectLabel, SelectGroup,
  SelectValue, Select, SelectTrigger, SelectItem,
} from "~/components"
import clsx from "clsx"
import { HoverCard, HoverCardContent, HoverCardTrigger, } from "~/components/ui/hover-card"
import { clientAtr, dealerInfo, FandIAttr, financeInfo, salesPersonAttr, tradeVehAttr, wantedVehAttr } from "~/routes/__authorized/dealer/user/dashboard.templates"
import { Editor } from "~/components/libs/basicEditor";



export default function DashboardClient() {
  const [user, setUser] = useState()
  const [customer, setCust] = useState()
  const [to, setTo] = useState()
  const [subject, setSubject] = useState()
  const [text, setText] = useState("");
  const app = useAppContext();

  useEffect(() => {
    const userIs = window.localStorage.getItem("user");
    const parseUser = userIs ? JSON.parse(userIs) : [];
    setUser(parseUser)
    const getCust = window.localStorage.getItem("customer");
    const parseCust = getCust ? JSON.parse(getCust) : [];
    setCust(parseCust)
    setTo(parseCust)
    const handleMessage = (event) => {
      const data = event.data;
      if (data && data.cust && data.user) {
        console.log(data, 'data');

        const { user, cust } = data;

        console.log('merged1', user, cust, data);
        setTo(cust.email);
        setCust(cust);
        setUser(user);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const content = ''
  // email stufff from other gile
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

  function SendIt(body) {
    console.log(to, 'to')
    //  setTo(customer)
    const compose = MassEmail(app.authProvider!, subject, body, to);
    return compose
  }

  if (!editor) return null

  return (
    <>
      <div className="email flex   flex-col  ">
        <div className="flex justify-center  mt-4">
          <Input
            type='hidden'
            defaultValue={to}
            name="to"
            className="m-2 mx-auto mr-2 w-[98%] bg-background text-foreground   border-border"
          />
          <div className="relative w-full">
            <Input
              name="subject"
              className=" bg-background border-border text-foreground"
              onChange={(e) => setSubject(e.target.value)}
            />
            <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground"> Subject</label>
          </div>
        </div>
        <div className=" grid grid-cols-1">
          <div className="w-full mx-auto mb-2 mt-auto    ">
            <div className="p-1">
              <div className="mr-auto   mt-auto grid grid-cols-1">
                <div className="my-2 flex justify-between  mt-3 ">

                  <div className="relative">
                    <Select name='userRole'
                      onValueChange={(value) => {
                        handleChange(value); // Pass the input value directly to handleChange
                      }}   >
                      <SelectTrigger className="w-[400px]  bg-background text-foreground border border-border">
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
            <input type="hidden" defaultValue={text} name="body" />
          </div>
        </div>
      </div>

    </>
  )
}




