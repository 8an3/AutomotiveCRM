import { Input, Button, Dialog as DialogRoot, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, TextArea, Card, CardContent, CardHeader, CardFooter, CardTitle, TooltipProvider, Tooltip, TooltipTrigger, TooltipContent, } from "~/components";
import { useLoaderData, Form, useFetcher, useLocation, useNavigation } from "@remix-run/react";
import { PhoneOutcome, MenuScale, Mail, MessageText, User, ArrowDown, Calendar as CalendarIcon, WebWindowClose, } from "iconoir-react";
import { Tabs, TabsContent, TabsList, TabsTrigger, } from "~/components/ui/tabs"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, } from "~/components/ui/command"
import React, { useCallback, useEffect, useRef, useState } from "react"
import * as Dialog from '@radix-ui/react-dialog';
import useSWR, { SWRConfig, mutate, useSWRConfig } from 'swr';

import { cn } from "~/components/ui/utils"
import { toast } from "sonner"
import { CheckIcon, PaperPlaneIcon, PlusIcon } from "@radix-ui/react-icons"

export default function EmailClient({ data, searchData, iFrameRef }) {
  const { user, conversations, financeNotes, latestNotes, } = useLoaderData();
  const [convos, setConvos] = useState([])
  const [financeNotesList, setFinanceNoteList] = useState([])
  const [conversationsList, setConversationsList] = useState([])
  let fetcher = useFetcher();

  let formRef = useRef();
  const [input, setInput] = React.useState("")
  const inputLength = input.trim().length
  const [open, setOpen] = React.useState(false)

  const [messages, setMessages] = React.useState([
    {
      role: "agent",
      content: "Hi, how can I help you today?",
    },
    {
      role: "user",
      content: "Hey, I'm having trouble with my account.",
    },
    {
      role: "agent",
      content: "What seems to be the problem?",
    },
    {
      role: "user",
      content: "I can't log in.",
    },
  ])

  useEffect(() => {
    function getNotesByFinanceId(notes, financeId) {
      return notes.filter(note => note.financeId === financeId);
    }
    const filteredNotes = getNotesByFinanceId(financeNotes, data.financeId);

    setFinanceNoteList(filteredNotes)
    // console.log(filteredNotes, 'email client notes')
    function GetConversationsByID(conversations, financeId) {
      return conversations.filter(conversation => conversation.financeId === financeId);
    }
    const filteredConversations = GetConversationsByID(conversations, data.financeId);

    setConversationsList(filteredConversations)
    console.log(filteredNotes, 'email client notes')
  }, [data.financeId]);

  613 - 604 - 5521

  useEffect(() => {
    const cust = {
      email: data.email,
      name: data.name,
      financeId: data.id,
      clientfileId: searchData.id,
      phone: data.phone,

    }
    const serializedCust = JSON.stringify(cust);
    window.localStorage.setItem("customer", serializedCust);
  }, [user]);


  const MyIFrameComponent = () => {
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
      const handleHeightMessage = (event: MessageEvent) => {
        if (
          event.data &&
          event.data.type === "iframeHeight" &&
          event.data.height
        ) {
          setIsLoading(false);
          if (iFrameRef.current) {
            iFrameRef.current.style.height = `${event.data.height}px`;
          }
        }
      };
      const currentHost = typeof window !== "undefined" ? window.location.host : null;
      if (iFrameRef.current) {
        if (currentHost === "localhost:3000") {
          iFrameRef.current.src = "http://localhost:3000/IFrameComp/sms/dashMsger";
        }
        if (currentHost === "dealersalesassistant.ca") {
          iFrameRef.current.src =
            "https://www.dealersalesassistant.ca/IFrameComp/sms/dashMsger";
        }
        window.addEventListener("message", handleHeightMessage);
      }
      return () => {
        if (iFrameRef.current) {
          window.removeEventListener("message", handleHeightMessage);
        }
      };
    }, [iFrameRef]);



    return (
      <>
        <div className="size-full ">
          <iframe
            ref={iFrameRef}
            title="my-iframe"
            width="100%"
            // onLoad={handleLoad}
            className=" border-none"
            style={{
              minHeight: "58vh"

            }}
          />
        </div>
      </>
    );
  };


  const [latestNote, setlatestNote] = useState([])
  useEffect(() => {

    setlatestNote(latestNotes[0])
  }, []);

  return (
    <Dialog.Root  >
      <Dialog.Trigger asChild>
        <p
          className="cursor-pointer text-foreground target:text-primary hover:text-primary" >
          <MessageText className="" />
        </p>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-blackA6 data-[state=open]:animate-overlayShow fixed inset-0" />
        <Dialog.Content className=" w-[95%] md:w-[600px] h-[675px]  fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-background border border-border text-foreground p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none ">
          <DialogDescription>
            <Tabs defaultValue="account" className="w-full">
              <TabsList className="grid  w-[360px] grid-cols-3">
                <TabsTrigger value="account">SMS</TabsTrigger>
                <TabsTrigger value="password">Prev Interactions</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>
              <TabsContent value="account">
                <div className="parent-container h-auto bg-background" >
                  <MyIFrameComponent />
                </div>

              </TabsContent>
              <TabsContent value="password">
                <Card className="  text-foreground w-auto mx-auto" x-chunk="dashboard-05-chunk-4 "  >
                  <CardHeader className="flex flex-row items-start bg-muted-background">
                    <div className="grid gap-0.5">
                      <CardTitle className="group flex items-center gap-2 text-lg">
                        Customer Interactions
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="  p-6 text-sm bg-background">
                    <div className="grid gap-3  ">
                      <Card>
                        <CardContent>
                          <div className="space-y-4 mt-5">
                            {conversationsList.map((message, index) => (
                              <div
                                key={index}
                                className={cn(
                                  "flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                                  message.userEmail === user.email
                                    ? "ml-auto bg-primary text-foreground"
                                    : "bg-[#262626]"
                                )}
                              >
                                <div className='grid grid-cols-1'>
                                  {message.userEmail !== user.email && (
                                    <p className='text-[#8c8c8c]'>
                                      {message.userEmail}
                                    </p>
                                  )}
                                  {message.body}
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-row items-center border-t border-border bg-muted-background px-6 py-3">
                    <fetcher.Form method='post' >

                      <Button
                        value="savePrevInteraction"
                        type="submit"
                        name="intent"
                        size="sm"
                        onClick={() => {
                          toast.success(`Note saved`)
                        }}
                        disabled={inputLength === 0}
                        className='bg-primary '>
                        <PlusIcon className="h-4 w-4" />

                        <span className="sr-only">Add</span>
                      </Button>
                    </fetcher.Form >
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="notes" className="">
                <div className='h-auto '>
                  <>
                    <Card className="overflow-hidden text-foreground w-auto mx-auto" x-chunk="dashboard-05-chunk-4 "  >
                      <CardHeader className="flex flex-row items-start bg-muted-background">
                        <div className="grid gap-0.5">
                          <CardTitle className="group flex items-center gap-2 text-lg">
                            Notes
                          </CardTitle>
                        </div>

                      </CardHeader>
                      <CardContent className="flex-grow !grow overflow-x-clip p-6 text-sm bg-background">
                        <div className="grid gap-3  ">
                          <Card className=" flex flex-col-reverse   max-h-[70vh] h-auto overflow-y-scroll  ">
                            <CardContent>
                              <div className="space-y-4 mt-5">
                                <div
                                  className={cn(
                                    "flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                                    latestNote.userEmail === user.email
                                      ? "ml-auto bg-primary text-foreground"
                                      : "bg-[#262626]"
                                  )}
                                >
                                  <div className='grid grid-cols-1'>
                                    {latestNote.userEmail !== user.email && (
                                      <p className='text-[#8c8c8c]'>
                                        {latestNote.userName}
                                      </p>
                                    )}
                                    {latestNote.body}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card >
                        </div>
                      </CardContent>
                      <CardFooter className="flex flex-row items-center bg-muted-background px-6 py-3">
                        <fetcher.Form ref={formRef} method="post" className="flex w-full items-center space-x-2" >
                          <input type='hidden' name='financeId' defaultValue={data.id} />
                          <input type='hidden' name='userEmail' defaultValue={user.email} />
                          <input type='hidden' name='clientfileId' defaultValue={data.clientfileId} />
                          <input type='hidden' name='userName' defaultValue={user.name} />
                          <Input
                            id="message"
                            placeholder="Type your message..."
                            className="flex-1 bg-muted-background border-border"
                            autoComplete="off"
                            value={input}
                            onChange={(event) => setInput(event.target.value)}
                            name="body"
                          />
                          <Button
                            value="saveFinanceNote"
                            type="submit"
                            name="intent"
                            size="icon"
                            onClick={() => {
                              toast.success(`Note saved`)
                            }}
                            disabled={inputLength === 0}
                            className='bg-primary '>
                            <PaperPlaneIcon className="h-4 w-4" />
                            <span className="sr-only">Send</span>
                          </Button>
                          <TooltipProvider delayDuration={0}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button size="icon" variant="outline" className="ml-auto rounded-md" onClick={() => setOpen(true)}  >
                                  <PlusIcon className="h-4 w-4" />
                                  <span className="sr-only">CC Employee</span>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent sideOffset={10} className='bg-primary'>CC Employee</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </fetcher.Form>
                      </CardFooter>
                    </Card>
                  </>
                </div>
              </TabsContent>
            </Tabs>
          </DialogDescription>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
