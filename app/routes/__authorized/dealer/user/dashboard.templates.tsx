/* eslint-disable no-template-curly-in-string */
import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  Badge,
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Separator,
} from "~/components/ui";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { GetUser } from "~/utils/loader.server";
import {
  redirect,
  type DataFunctionArgs,
  json,
  type ActionFunction,
  type LoaderFunction,
} from "@remix-run/node";
import { ButtonLoading } from "~/components/ui/button-loading";
import { Toaster, toast } from "sonner";
import financeFormSchema from "~/overviewUtils/financeFormSchema";
import { prisma } from "~/libs";
import { getSession } from "~/sessions/auth-session.server";
import { getDealerFeesbyEmail } from "~/utils/user.server";
import {
  BubbleMenu,
  EditorContent,
  EditorProvider,
  useCurrentEditor,
  useEditor,
  type Content,
} from "@tiptap/react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/components/ui/hover-card";
import { cn } from "~/components/ui/utils";
import { buttonVariants } from "~/components/ui/button";
import {
  Copy,
  Undo,
  Redo,
  List,
  ScanLine,
  Eraser,
  Code,
  ListPlus,
  Brackets,
  Pilcrow,
  Minus,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Highlighter,
  WrapText,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  X,
} from "lucide-react";
import {
  FaCheck,
  FaBold,
  FaStrikethrough,
  FaItalic,
  FaUnlink,
  FaLink,
  FaList,
  FaListOl,
  FaFileCode,
  FaQuoteLeft,
  FaUndo,
  FaAlignJustify,
  FaAlignLeft,
  FaRedo,
  FaAlignRight,
  FaAlignCenter,
  FaHighlighter,
  FaEraser,
  FaUnderline,
} from "react-icons/fa";
import { BiCodeBlock } from "react-icons/bi";
import { MdHorizontalRule } from "react-icons/md";
import { IoMdReturnLeft } from "react-icons/io";

import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Typography from "@tiptap/extension-typography";
import Underline from "@tiptap/extension-underline";
import { Color } from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Text from "@tiptap/extension-text";
import Highlight from "@tiptap/extension-highlight";
import ListItem from "@tiptap/extension-list-item";
import TaskItem from "@tiptap/extension-task-item";
import { CiEdit } from "react-icons/ci";
import {
  Editor,
  EditorTiptapHookNewTemplates,
  EditorTiptapHookNewTemplatesNew,
} from "~/components/libs/basicEditor";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";


export const meta = () => {
  return [
    { subject: "Toolbox - Dealer Sales Assistant" },
    {
      property: "og:title",
      body: "Your very own assistant!",
    },
    {
      subject: "description",
      body: "To help sales people achieve more. Every automotive dealer needs help, especialy the sales staff. Dealer Sales Assistant will help you close more deals more efficiently.",
      keywords: "Automotive Sales, dealership sales, automotive CRM",
    },
  ];
};

export async function loader({ request, params }: LoaderFunction) {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email");
  const user = await GetUser(email); /// console.log(user, account, 'wquiote loadert')
  if (!user) {
    redirect("/login");
  }
  const templates = await prisma.emailTemplates.findMany({
    where: {
      userEmail: email,
    },
  });
  return json({
    ok: true,
    email,
    user,
    templates,
  });
}

export const action = async ({ request }: ActionArgs) => {
  const formPayload = Object.fromEntries(await request.formData());
  let formData = financeFormSchema.parse(formPayload);
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email");
  const user = await GetUser(email);
  if (!user) {
    redirect("/login");
  }
  console.log(formData, "formdata");
  const intent = formData.intent;

  const data = {
    body: formData.body,
    category: formData.category,
    userEmail: formData.userEmail,
    review: formData.review,
    dept: formData.dept,
    type: formData.type,
    subject: formData.subject,
    subCat: formData.subCat,
  };

  if (intent === "createTemplate") {
    const template = await prisma.emailTemplates.create({
      data: {
        ...data,
      },
    });
    console.log("create template");
    return json({ template, user });
  }
  if (intent === "addToDropdown") {
    const template = await prisma.emailTemplatesForDropdown.create({
      data: {
        subCat: formData.subCat,
        body: formData.body,
        userEmail: formData.userEmail,
        category: formData.category,
        type: formData.type,
        subject: formData.subject,
      },
    });
    console.log("addToDropdown template");
    return json({ template, user });
  }
  if (intent === "updateTemplate") {
    let cleanedStr = data.body.replace(/<\/?p>/g, "");

    const id = formData.id;
    const template = await prisma.emailTemplates.update({
      data: {
        ...data,
        body: cleanedStr,
      },
      where: {
        id: id,
      },
    });
    console.log("update template", formData, data, template);
    return json({ template, user });
  }
  if (intent === "deleteTemplate") {
    const id = formData.id;
    const template = await prisma.emailTemplates.delete({
      where: {
        id: id,
      },
    });
    return template;
  }
  console.log("returned null");
  return user;
};

export default function Shight() {
  const { user, templates } = useLoaderData();

  let mergedArray = templates

  const copyText = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopiedText(text);
        setTimeout(() => setCopiedText(""), 3000); // Reset after 3 seconds
      })
      .catch((error) => {
        console.error("Failed to copy text: ", error);
      });
  };
  const [copiedText, setCopiedText] = useState("");
  const timerRef = useRef(0);

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  const [selectedRecord, setSelectedRecord] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [subcategories, setSubcategories] = useState(
    mergedArray.reduce((unique, mail) => {
      if (!unique.includes(mail.subCat)) {
        unique.push(mail.subCat);
      }
      return unique;
    }, [])
  );
  function handleEmailClick(category) {
    setSelectedCategory(category);
    const sameCategoryMails = mergedArray.filter(
      (item) => item.category === category
    );
    const uniqueSubcategories = sameCategoryMails.reduce((unique, item) => {
      if (!unique.includes(item.subCat)) {
        unique.push(item.subCat);
      }
      return unique;
    }, []);
    setSubcategories(uniqueSubcategories);
  }
  function handleSubCatLisstClick(mail) {
    setSelectedRecord(mail);
    setText(mail.body);
    console.log(mail, "mail");
  }

  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const [selectedCategorySize, setSelectedCategorySize] = useState(true);
  const [selectedSubcategory, setSelectedSubcategory] = useState(false);
  const [selectedScript, setSelectedScript] = useState(false);

  const handleCategoryClick = () => {
    setSelectedCategorySize(true);
    setSelectedSubcategory(false);
    setSelectedScript(false);
  };

  const handleSubcategoryClick = () => {
    setSelectedCategorySize(false);
    setSelectedSubcategory(true);
    setSelectedScript(false);
  };

  const handleScriptClick = () => {
    setSelectedCategorySize(false);
    setSelectedSubcategory(false);
    setSelectedScript(true);
  };
  const [text, setText] = useState("");
  const [content, setContent] = useState("");
  const [finalText, setFinalText] = useState("");
  const [id, setId] = useState("");

  useEffect(() => {
    if (selectedRecord) {
      setContent(text);
      editor?.commands.setContent({
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: selectedRecord.body,
              },
            ],
          },
        ],
      });
    }
  }, [selectedRecord]);

  let handleUpdate;
  const CustomDocument = Document.extend({ body: "taskList" });
  const CustomTaskItem = TaskItem.extend({ body: "inline*" });
  const editor = Editor(content, setText);

  const editorNewTemplates = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      Highlight,
      Typography,
      Underline,
      CustomDocument,
      CustomTaskItem,
      Color, //.configure({ types: [TextStyle.name, ListItem.name] }),
      TextStyle,
      StarterKit.configure({
        bulletList: { keepMarks: true, keepAttributes: false },
        orderedList: { keepMarks: true, keepAttributes: false },
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({
        placeholder: () => {
          return "Write something...";
        },
      }),
      Link.configure({
        HTMLAttributes: {
          rel: "noopener noreferrer",
          target: "_blank",
          class: "prose-a-styles",
        },
      }),
    ],
    editorProps: { attributes: { class: "prose-config" } },
    onUpdate({ editor }) {
      setFinalText(editor.getHTML());
      if (handleUpdate) {
        handleUpdate(editor.getHTML());
      }
    },
  });
  const buttonActive = "bg-white text-black rounded-md p-1 ";
  const buttonInactive =
    "bg-background text-foreground hover:text-primary hover:bg-transparent";

  const handleSetLink = useCallback(() => {
    if (!editor) return null;

    const previousUrl = editor.getAttributes("link").href as string;
    const url = window.prompt("URL", previousUrl);

    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    const fixedUrl = fixUrl(url);
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: fixedUrl })
      .run();
  });




  const contentNewTemplate = "";
  const [editTemplate, setEditTemplate] = useState(false);

  //const [testcategory, setTestCategory] = useState()

  function SidebarNav({ className, items, ...props }) {
    const [category, setCategory] = useState();
    const [subCategory, setSubCategory] = useState();

    const uniqueCategories = Array.from(
      new Set(items.map((item) => item.category))
    );

    const firstObstacle = (uniqueCategory) => {
      //setCategory(category === uniqueCategory ? null : uniqueCategory);
      // setTestCategory(uniqueCategories === category ? '' : uniqueCategory);

      setCategory(uniqueCategory);
      //setTestCategory(uniqueCategory);
    };

    return (
      <nav
        className={cn(
          "flex h-auto max-h-[500px] space-x-2 overflow-y-auto lg:flex-col lg:space-x-0 lg:space-y-1",
          className
        )}
        {...props}
      >
        {uniqueCategories.map((uniqueCategory) => (
          <div key={uniqueCategory}>
            <Button
              variant="ghost"
              onClick={() => {
                firstObstacle(uniqueCategory);
              }}
              className={cn(
                category === uniqueCategory
                  ? "w-[90%] bg-[#232324] text-foreground hover:bg-muted/50"
                  : "w-[90%] hover:bg-muted/50 hover:text-foreground",
                "justify-start text-muted-foreground"
              )}
            >
              {uniqueCategory}
            </Button>
            {category === uniqueCategory && (
              <div>
                {items
                  .filter((subItem) => subItem.category === uniqueCategory)
                  .map((subItem) => (
                    <Button
                      variant="ghost"
                      key={subItem.subCat}
                      onClick={() => {
                        setSubCategory(subItem.subCat);
                        const getMail = mergedArray.find(
                          (mail) => mail.subCat === subItem.subCat
                        );
                        setSelectedRecord(getMail);
                        setSelectedScript(true);

                        console.log(selectedRecord, "selectedRecord");
                      }}
                      className={cn(
                        "ml-4 w-[90%] hover:bg-muted/50 hover:text-foreground",
                        "justify-start text-muted-foreground"
                      )}
                    >
                      {subItem.subCat}
                    </Button>
                  ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    );
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
  return (
    <>
      <div className="flex">
        <Separator orientation="vertical" />
        <div className="hidden space-y-6 p-10 pb-16 md:block">
          <div className="space-y-0.5">
            <h2 className="text-xl tracking-tight">Script Builder</h2>
            <p className="text-muted-foreground">Hone your craft.</p>
          </div>
          <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
            <aside className="-mx-4 lg:w-64 lg:max-w-96">
              <SidebarNav items={templates} />
            </aside>
            <div className="flex-1 lg:max-w-3xl">
              {selectedScript && selectedRecord && editTemplate === false && (
                <div
                  className={`mx-2 p-3 transition delay-300 duration-1000 ease-in-out  bg-background border rounded-[6px] border-border `}
                >
                  {selectedScript && (
                    <div className="h-auto max-h-[600px] overflow-y-auto">
                      {selectedRecord && (
                        <div className="">
                          <div className="m-2 mx-auto w-[95%]   hover:border-primary  hover:text-primary active:border-primary">
                            <div className="m-2  items-center justify-between p-2 text-foreground">
                              <p className="text-[20px]">
                                {selectedRecord.category}{" "}
                                {selectedRecord.subCat}
                              </p>
                              <div className="flex justify-between text-[16px]  text-[#fff]">
                                <p className="text-[16px] text-muted-foreground">
                                  {selectedRecord.subCat}
                                </p>
                              </div>
                              <div className="group flex items-center">
                                <p className="mt-5">{selectedRecord.body}</p>
                                <div className="flex">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="cursor-pointer  opacity-0 transition-opacity group-hover:opacity-100"
                                    onClick={() =>
                                      copyText(selectedRecord.body)
                                    }
                                  >
                                    {copiedText !== selectedRecord.body && (
                                      <Copy className=" hover:text-primary" />
                                    )}
                                    {copiedText === selectedRecord.body && (
                                      <FaCheck className="hover:text-primary" />
                                    )}
                                  </Button>
                                </div>
                              </div>
                              <div className="mt-4 flex">
                                <ButtonLoading
                                  size="sm"
                                  type="submit"
                                  isSubmitting={isSubmitting}
                                  onClick={() => {
                                    setEditTemplate(true);
                                  }}
                                  loadingText="Loading..."
                                  className="w-auto cursor-pointer border-border bg-transparent text-foreground hover:border-primary hover:bg-transparent hover:text-primary mr-3"
                                >
                                  Edit Template
                                </ButtonLoading>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      className="w-auto cursor-pointer border border-border bg-transparent text-foreground hover:border-primary hover:bg-transparent hover:text-primary"
                                      size="sm"
                                    >
                                      {" "}
                                      Add To Template Dropdowns
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent className='border-border'>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        Are you absolutely sure?
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This will add this template to your
                                        dropdowns.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <div className="mx-3 flex items-center justify-between">
                                      <AlertDialogCancel>
                                        Cancel
                                      </AlertDialogCancel>
                                      <Form method="post">
                                        <input
                                          type="hidden"
                                          name="body"
                                          value={selectedRecord.body}
                                        />
                                        <input
                                          type="hidden"
                                          name="category"
                                          value={selectedRecord.category}
                                        />
                                        <input
                                          type="hidden"
                                          name="userEmail"
                                          value={user.email}
                                        />
                                        <input
                                          type="hidden"
                                          name="subject"
                                          value={selectedRecord.subject}
                                        />
                                        <AlertDialogCancel className="border border-transparent">
                                          <ButtonLoading
                                            size="sm"
                                            name="intent"
                                            value="addToDropdown"
                                            type="submit"
                                            isSubmitting={isSubmitting}
                                            onClick={() => {
                                              toast.message(
                                                "Helping you become the hulk of sales..."
                                              );
                                            }}
                                            loadingText="Loading..."
                                            className="w-auto cursor-pointer border border-border bg-background text-foreground hover:bg-muted-background"
                                          >
                                            Add
                                          </ButtonLoading>
                                        </AlertDialogCancel>
                                      </Form>
                                    </div>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
              {editTemplate === true && (
                <>
                  <Card className="border-border bg-background">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <p>Template Editor</p>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full "
                          onClick={() => setEditTemplate(false)}
                        >
                          <X />
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="p-1">
                        <Form
                          method="post"
                          action="/dealer/user/dashboard/templates"
                        >
                          <div className="mr-auto mt-auto   grid grid-cols-1 px-2">
                            <div className="mx-3 mb-3 grid gap-3">
                              <div className="relative mt-3">
                                <Input
                                  name="category"
                                  type="text"
                                  className="w-full border-border bg-background "
                                  defaultValue={selectedRecord.category}
                                />
                                <label className=" absolute -top-3 left-3 rounded-full bg-background px-2 text-sm transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">
                                  Category
                                </label>
                              </div>
                              <div className="relative mt-3">
                                <Input
                                  name="subCat"
                                  type="text"
                                  className="w-full border-border bg-background "
                                  defaultValue={selectedRecord.subCat}
                                />
                                <label className=" absolute -top-3 left-3 rounded-full bg-background px-2 text-sm transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">
                                  Sub-category
                                </label>
                              </div>
                              <div className="relative mt-3">
                                <Input
                                  name="subject"
                                  type="text"
                                  className="w-full border-border bg-background "
                                  defaultValue={selectedRecord.subject}
                                />
                                <label className=" absolute -top-3 left-3 rounded-full bg-background px-2 text-sm transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">
                                  Subject
                                </label>
                              </div>
                            </div>

                            <Tabs>
                              <TabsList className='rounded-bl-none rounded-br-none'>
                                <TabsTrigger value="account">
                                  Formatting Options
                                </TabsTrigger>
                                <TabsTrigger value="password">
                                  Inserting Options
                                </TabsTrigger>
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
                            </Tabs>
                            <Card className="bg-background rounded-tl-none ">
                              <EditorContent
                                editor={editor}
                                className="mx-auto mb-2 mt-1  w-[95%] cursor-text rounded-md bg-background p-3 text-foreground"
                              />
                            </Card>

                            <br />
                            <input
                              type="hidden"
                              defaultValue={user?.email}
                              name="userEmail"
                            />
                            <input
                              type="hidden"
                              defaultValue={text}
                              name="body"
                            />
                            <input
                              type="hidden"
                              defaultValue={selectedRecord.id}
                              name="id"
                            />
                            <div className="flex w-[98%] justify-between">
                              <div></div>
                              <Button
                                onClick={() => {
                                  //  SaveDraft();
                                  toast.success(`Template saved!`);
                                }}
                                type="submit"
                                value="updateTemplate"
                                name="intent"
                                size="sm"
                                className={`ml-2 cursor-pointer rounded rounded-lg border border-border bg-primary bg-transparent  p-3 text-center text-xs font-bold uppercase   text-foreground shadow outline-none transition-all duration-150 ease-linear hover:bg-transparent hover:text-primary hover:shadow-md focus:outline-none `}
                              >
                                Save Template
                              </Button>
                            </div>
                            <br />
                          </div>
                        </Form>
                      </div>
                    </CardContent>
                    <CardFooter></CardFooter>
                  </Card>
                  <p className="mt-4 text-muted-foreground">
                    Your ability to close increases with the amount of tools at
                    your disposal. A mechanic without a tire iron wouldnt be
                    able to change a tire. So why dont more sales people take
                    better care of their scripts, closes, and such?
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


export const clientAtr = [
  { subject: "Mr/Mrs", attribute: "${clientTitle}" },
  { subject: "First Name", attribute: "${firstName}" },
  { subject: "Last Name", attribute: "${lastName}" },
  { subject: "Full Name", attribute: "${name}" },
  { subject: "Phone", attribute: "${phone}" },
  { subject: "Email", attribute: "${email}" },
  { subject: "Company Name", attribute: "${clientCompanyName}" },
  { subject: "Address", attribute: "${address}" },
  { subject: "City", attribute: "${city}" },
  { subject: "Province", attribute: "${province}" },
  { subject: "Postal Code", attribute: "${postal}" },
];
export const wantedVehAttr = [
  { subject: "Year", attribute: "${year}" },
  { subject: "Brand", attribute: "${brand}" },
  { subject: "Model", attribute: "${model}" },
  { subject: "Trim", attribute: "${trim}" },
  { subject: "Stock Number", attribute: "${stockNumber}" },
  { subject: "VIN", attribute: "${vin}" },
  { subject: "Color", attribute: "${color}" },
  { subject: "Balance", attribute: "${balance}" },
  { subject: "Package Number", attribute: "${packageNumber}" },
  { subject: "Package Price", attribute: "${packagePrice}" },
  { subject: "Stock Number", attribute: "${stockNumber}" },
  { subject: "Type", attribute: "${type}" },
  { subject: "Class", attribute: "${class}" },
  { subject: "Year", attribute: "${year}" },
  { subject: "Make", attribute: "${make}" },
  { subject: "Model", attribute: "${model}" },
  { subject: "Model Name", attribute: "${modelName}" },
  { subject: "Sub Model", attribute: "${submodel}" },
  { subject: "Sub Sub Model", attribute: "${subSubmodel}" },
  { subject: "Price", attribute: "${price}" },
  { subject: "Exterior Color", attribute: "${exteriorColor}" },
  { subject: "Mileage", attribute: "${mileage}" },
  { subject: "Consignment", attribute: "${consignment}" },
  { subject: "On Order", attribute: "${onOrder}" },
  { subject: "Expected On", attribute: "${expectedOn}" },
  { subject: "Status", attribute: "${status}" },
  { subject: "Order Status", attribute: "${orderStatus}" },
  { subject: "hdcFO Number", attribute: "${hdcFONumber}" },
  { subject: "hdmcFO Number", attribute: "${hdmcFONumber}" },
  { subject: "VIN", attribute: "${vin}" },
  { subject: "Age", attribute: "${age}" },
  { subject: "Floor Plan Due Date", attribute: "${floorPlanDueDate}" },
  { subject: "Location", attribute: "${location}" },
  { subject: "Stocked", attribute: "${stocked}" },
  { subject: "Stocked Date", attribute: "${stockedDate}" },
  { subject: "Is New", attribute: "${isNew}" },
  { subject: "Actual Cost", attribute: "${actualCost}" },
  { subject: "mfg Serial Number", attribute: "${mfgSerialNumber}" },
  { subject: "Engine Number", attribute: "${engineNumber}" },
  { subject: "Plates", attribute: "${plates}" },
  { subject: "Key Number", attribute: "${keyNumber}" },
  { subject: "Length", attribute: "${length}" },
  { subject: "Width", attribute: "${width}" },
  { subject: "Engine", attribute: "${engine}" },
  { subject: "Fuel Type", attribute: "${fuelType}" },
  { subject: "Power", attribute: "${power}" },
  { subject: "Chassis Number", attribute: "${chassisNumber}" },
  { subject: "Chassis Year", attribute: "${chassisYear}" },
  { subject: "Chassis Make", attribute: "${chassisMake}" },
  { subject: "Chassis Model", attribute: "${chassisModel}" },
  { subject: "Chassis Type", attribute: "${chassisType}" },
  { subject: "Registration State", attribute: "${registrationState}" },
  { subject: "Registration Expiry", attribute: "${registrationExpiry}" },
  { subject: "Gross Weight", attribute: "${grossWeight}" },
  { subject: "Net Weight", attribute: "${netWeight}" },
  { subject: "Insurance Company", attribute: "${insuranceCompany}" },
  { subject: "Policy Number", attribute: "${policyNumber}" },
  { subject: "Insurance Agent", attribute: "${insuranceAgent}" },
  { subject: "Insurance Start Date", attribute: "${insuranceStartDate}" },
  { subject: "Insurance End Date", attribute: "${insuranceEndDate}" },
  { subject: "Sold", attribute: "${sold}" },
];
export const tradeVehAttr = [
  { subject: "Year", attribute: "${tradeYear}" },
  { subject: "Brand", attribute: "${tradeMake}" },
  { subject: "Model", attribute: "${tradeDesc}" },
  { subject: "Trim", attribute: "${tradeTrim}" },
  { subject: "VIN", attribute: "${tradeVin}" },
  { subject: "Color", attribute: "${tradeColor}" },
  { subject: "Trade Value", attribute: "${tradeValue}" },
  { subject: "Mileage", attribute: "${tradeMileage}" },
];
export const salesPersonAttr = [
  { subject: "First Name", attribute: "${userFname}" },
  { subject: "Full Name", attribute: "${userFullName}" },
  { subject: "Phone or EXT", attribute: "${userPhone}" },
  { subject: "Email", attribute: "${userEmail}" },
  { subject: "Cell #", attribute: "${userCell}" },
];
export const FandIAttr = [
  { subject: "Institution", attribute: "${fAndIInstitution}" },
  { subject: "Assigned Manager", attribute: "${fAndIFullName}" },
  { subject: "Email", attribute: "${fAndIEmail}" },
  { subject: "Name", attribute: "${fAndIFullName}" },
  { subject: "Phone # or EXT", attribute: "${fAndIPhone}" },
  { subject: "Cell #", attribute: "${fAndICell}" },
];
export const dealerInfo = [
  { subject: "Dealer Name", attribute: "${dealerName}" },
  { subject: "Dealer Address", attribute: "${dealerAddress}" },
  { subject: "Dealer City", attribute: "${dealerCity}" },
  { subject: "Dealer Prov", attribute: "${dealerProv}" },
  { subject: "Dealer Postal", attribute: "${dealerPostal}" },
  { subject: "Dealer Phone", attribute: "${dealerPhone}" },
  { subject: "Loan Prot", attribute: "${userLoanProt}" },
  { subject: "Tire and Rim", attribute: "${userTireandRim}" },
  { subject: "Gap", attribute: "${userGap}" },
  { subject: "Ext Warr", attribute: "${userExtWarr}" },
  { subject: "Services Pkg", attribute: "${userServicespkg}" },
  { subject: "VinE", attribute: "${vinE}" },
  { subject: "Life Disability", attribute: "${lifeDisability}" },
  { subject: "Rust Proofing", attribute: "${rustProofing}" },
  { subject: "Licensing", attribute: "${userLicensing}" },
  { subject: "Finance", attribute: "${userFinance}" },
  { subject: "Demo", attribute: "${userDemo}" },
  { subject: "Gas On Del", attribute: "${userGasOnDel}" },
  { subject: "OMVIC", attribute: "${userOMVIC}" },
  { subject: "Other", attribute: "${userOther}" },
  { subject: "Tax", attribute: "${userTax}" },
  { subject: "Air Tax", attribute: "${userAirTax}" },
  { subject: "Tire Tax", attribute: "${userTireTax}" },
  { subject: "Govern", attribute: "${userGovern}" },
  { subject: "PDI", attribute: "${userPDI}" },
  { subject: "Labour", attribute: "${userLabour}" },
  { subject: "Market Adj", attribute: "${userMarketAdj}" },
  { subject: "Commodity", attribute: "${userCommodity}" },
  { subject: "Destination Charge", attribute: "${destinationCharge}" },
  { subject: "Freight", attribute: "${userFreight}" },
  { subject: "Admin", attribute: "${userAdmin}" },
];
export const financeInfo = [
  { subject: "Finance Manager", attribute: "${financeManager}", },
  { subject: "Email", attribute: "${email}", },
  { subject: "First Name", attribute: "${firstName}", },
  { subject: "Mileage", attribute: "${mileage}", },
  { subject: "Last Name", attribute: "${lastName}", },
  { subject: "Phone", attribute: "${phone}", },
  { subject: "Name", attribute: "${name}", },
  { subject: "Address", attribute: "${address}", },
  { subject: "City", attribute: "${city}", },
  { subject: "Postal", attribute: "${postal}", },
  { subject: "Province", attribute: "${province}", },
  { subject: "Driver Lic", attribute: "${dl}", },
  { subject: "Type Of Contact", attribute: "${typeOfContact}", },
  { subject: "Time To Contact", attribute: "${timeToContact}", },
  { subject: "Int. Rate", attribute: "${iRate}", },
  { subject: "Months", attribute: "${months}", },
  { subject: "Discount", attribute: "${discount}", },
  { subject: "Total", attribute: "${total}", },
  { subject: "With Tax", attribute: "${onTax}", },
  { subject: "on60", attribute: "${on60}", },
  { subject: "Bi-weekly", attribute: "${biweekly}", },
  { subject: "Weekly", attribute: "${weekly}", },
  { subject: "Weekly Oth", attribute: "${weeklyOth}", },
  { subject: "Bi-weekOth", attribute: "${biweekOth}", },
  { subject: "oth60", attribute: "${oth60}", },
  { subject: "Weeklyqc", attribute: "${weeklyqc}", },
  { subject: "Bi-weeklyqc", attribute: "${biweeklyqc}", },
  { subject: "qc60", attribute: "${qc60}", },
  { subject: "Deposit", attribute: "${deposit}", },
  { subject: "biweeklNatWOptions", attribute: "${biweeklNatWOptions}", },
  { subject: "weeklylNatWOptions", attribute: "${weeklylNatWOptions}", },
  { subject: "nat60WOptions", attribute: "${nat60WOptions}", },
  { subject: "weeklyOthWOptions", attribute: "${weeklyOthWOptions}", },
  { subject: "biweekOthWOptions", attribute: "${biweekOthWOptions}", },
  { subject: "oth60WOptions", attribute: "${oth60WOptions}", },
  { subject: "biweeklNat", attribute: "${biweeklNat}", },
  { subject: "weeklylNat", attribute: "${weeklylNat}", },
  { subject: "nat60", attribute: "${nat60}", },
  { subject: "qcTax", attribute: "${qcTax}", },
  { subject: "otherTax", attribute: "${otherTax}", },
  { subject: "totalWithOptions", attribute: "${totalWithOptions}", },
  { subject: "otherTaxWithOptions", attribute: "${otherTaxWithOptions}", },
  { subject: "Desired Payments", attribute: "${desiredPayments}", },
  { subject: "Freight", attribute: "${freight}", },
  { subject: "Admin", attribute: "${admin}", },
  { subject: "Commodity", attribute: "${commodity}", },
  { subject: "PDI", attribute: "${pdi}", },
  { subject: "Discount %", attribute: "${discountPer}", },
  { subject: "Loan Prot", attribute: "${userLoanProt}", },
  { subject: "Tire and Rim", attribute: "${userTireandRim}", },
  { subject: "Gap", attribute: "${userGap}", },
  { subject: "Ext Warr", attribute: "${userExtWarr}", },
  { subject: "Services pkg", attribute: "${userServicespkg}", },
  { subject: "deliveryCharge", attribute: "${deliveryCharge}", },
  { subject: "VIN Etching", attribute: "${vinE}", },
  { subject: "Life and Disability", attribute: "${lifeDisability}", },
  { subject: "Rust Proofing", attribute: "${rustProofing}", },
  { subject: "Other", attribute: "${userOther}", },
  { subject: "Paint Prem", attribute: "${paintPrem}", },
  { subject: "Licensing", attribute: "${licensing}", },
  { subject: "Stock Num", attribute: "${stockNum}", },
  { subject: "Options", attribute: "${options}", },
  { subject: "Accessories", attribute: "${accessories}", },
  { subject: "Labour", attribute: "${labour}", },
  { subject: "Year", attribute: "${year}", },
  { subject: "Brand", attribute: "${brand}", },
  { subject: "Model", attribute: "${model}", },
  { subject: "Model 1", attribute: "${model1}", },
  { subject: "Color", attribute: "${color}", },
  { subject: "Model Code", attribute: "${modelCode}", },
  { subject: "MSRP", attribute: "${msrp}", },
  { subject: "Sales Person Email", attribute: "${userEmail}", },
  { subject: "Trade Value", attribute: "${tradeValue}", },
  { subject: "Trade Desc", attribute: "${tradeDesc}", },
  { subject: "Trade Color", attribute: "${tradeColor}", },
  { subject: "Trade Year", attribute: "${tradeYear}", },
  { subject: "Trade Make", attribute: "${tradeMake}", },
  { subject: "Trade Vin", attribute: "${tradeVin}", },
  { subject: "Trade Trim", attribute: "${tradeTrim}", },
  { subject: "Trade Mileage", attribute: "${tradeMileage}", },
  { subject: "Trim", attribute: "${trim}", },
  { subject: "VIN", attribute: "${vin}", },
  { subject: "Lead Note", attribute: "${leadNote}", },
  { subject: "Lien", attribute: "${lien}", },
];

export const links: LinksFunction = () => [
  { rel: "icon", type: "image/svg", href: "/favicons/settings.svg" },
];
