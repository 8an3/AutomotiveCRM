import { Input, Button, Dialog as DialogRoot, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, TextArea, Card, CardContent, CardHeader, CardFooter, CardTitle, TooltipProvider, Tooltip, TooltipTrigger, TooltipContent, } from "~/components";
import { useLoaderData, Form, useFetcher, useLocation, useNavigation } from "@remix-run/react";
import { PhoneOutcome, MenuScale, Mail, MessageText, User, ArrowDown, Calendar as CalendarIcon, WebWindowClose, } from "iconoir-react";
import { Tabs, TabsContent, TabsList, TabsTrigger, } from "~/components/ui/tabs"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, } from "~/components/ui/command"
import React, { useCallback, useEffect, useRef, useState } from "react"
import * as Dialog from '@radix-ui/react-dialog';

import { cn } from "~/components/ui/utils"
import { toast } from "sonner"
import { CheckIcon, PaperPlaneIcon, PlusIcon } from "@radix-ui/react-icons"
import { prisma } from "~/libs";

export default function EmailClient({ data }) {
  const { user, conversations, financeNotes, } = useLoaderData();
  const [convos, setConvos] = useState([])
  const [financeNotesList, setFinanceNoteList] = useState([])
  const [conversationsList, setConversationsList] = useState([])
  const [emailData, setEmailData] = useState([])

  let fetcher = useFetcher();

  let formRef = useRef();
  const [input, setInput] = React.useState("")
  const inputLength = input.trim().length
  const [open, setOpen] = React.useState(false)

  useEffect(() => {
    function getNotesByFinanceId(notes, financeId) {
      return notes.filter(note => note.financeId === financeId);
    }
    const filteredNotes = getNotesByFinanceId(financeNotes, data.financeId);

    setFinanceNoteList(filteredNotes)
    console.log(filteredNotes, 'email client notes')
    function GetConversationsByID(conversations, financeId) {
      return conversations.filter(conversation => conversation.financeId === financeId);
    }
    const filteredConversations = GetConversationsByID(conversations, data.financeId);

    setConversationsList(filteredConversations)
    console.log(filteredNotes, 'email client notes')
  }, [data.financeId]);


  useEffect(() => {
    const serializedUser = JSON.stringify(user);
    const cust = {
      email: data.email,
      name: data.name,
      financeId: data.financeId,
    }
    const serializedCust = JSON.stringify(cust);
    window.localStorage.setItem("user", serializedUser);
    window.localStorage.setItem("customer", serializedCust);
  }, []);

  useEffect(() => {
    const getemailData = window.localStorage.getItem("emailData");
    const parseemailData = getemailData ? JSON.parse(getemailData) : [];
    setEmailData(parseemailData)
  }, []);

  if (emailData) {
    const SaveFunction = async () => {
      const createFinanceNotes = await prisma.previousComms.create({
        data: {
          dept: 'Sales',
          financeId: emailData.financeId,
          body: emailData.body,
          userName: emailData.userName,
          type: 'Email',
          customerEmail: emailData.customerEmail,
          direction: 'Outgoing',
          subject: emailData.subject,
          result: 'Attempted',
          userEmail: emailData.userEmail,
        },
      });
      return createFinanceNotes
    }
    SaveFunction()

  }

  const iFrameRef: React.LegacyRef<HTMLIFrameElement> = useRef(null);

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
      const currentHost =
        typeof window !== "undefined" ? window.location.host : null;
      if (iFrameRef.current) {
        if (currentHost === "localhost:3000") {
          iFrameRef.current.src = "http://localhost:3000/dealer/email/dashboardClient";
        }
        if (currentHost === "dealersalesassistant.ca") {
          iFrameRef.current.src =
            "https://www.dealersalesassistant.ca/dealer/email/dashboardClient";
        }
        window.addEventListener("message", handleHeightMessage);
      }
      return () => {
        if (iFrameRef.current) {
          window.removeEventListener("message", handleHeightMessage);
        }
      };
    }, []);

    return (
      <>
        <div className="size-full ">
          <iframe
            ref={iFrameRef}
            title="my-iframe"
            width="100%"
            className=" border-none"
            style={{
              minHeight: "40vh"

            }}
          />
        </div>
      </>
    );
  };
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <p
          className="cursor-pointer text-[#fafafa] target:text-[#02a9ff] hover:text-[#02a9ff]" >
          <Mail className="" />
        </p>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-blackA6 data-[state=open]:animate-overlayShow fixed inset-0" />

        <Dialog.Content className=" w-[95%] md:w-[950px]   fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-[#09090b] border border-[#27272a] text-[#fafafa] p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none ">
          <DialogDescription>
            <Tabs defaultValue="account" className="w-auto">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="account">Email</TabsTrigger>
                <TabsTrigger value="password">Prev Interactions</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>
              <TabsContent value="account">
                <div className="parent-container h-auto" >
                  <MyIFrameComponent />
                </div>
              </TabsContent>
              <TabsContent value="password">
                <Card className="overflow-hidden text-[#f1f1f1] w-[600px] mx-auto" x-chunk="dashboard-05-chunk-4 "  >
                  <CardHeader className="flex flex-row items-start bg-[#18181a]">
                    <div className="grid gap-0.5">
                      <CardTitle className="group flex items-center gap-2 text-lg">
                        Customer Interactions
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow !grow overflow-y-scroll overflow-x-clip p-6 text-sm bg-[#09090b]">
                    <div className="grid gap-3 max-h-[70vh] h-auto">
                      <Card>
                        <CardContent>
                          <div className="space-y-4 mt-5">
                            {conversationsList.map((message, index) => (
                              <div
                                key={index}
                                className={cn(
                                  "flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                                  message.userEmail === user.email
                                    ? "ml-auto bg-[#dc2626] text-[#fafafa]"
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
                  <CardFooter className="flex flex-row items-center border-t border-[#27272a] bg-[#18181a] px-6 py-3">

                    <Button
                      value="saveFinanceNote"
                      type="submit"
                      name="intent"
                      size="sm"
                      onClick={() => {
                        toast.success(`Note saved`)
                      }}
                      disabled={inputLength === 0}
                      className='bg-[#dc2626] '>
                      <PlusIcon className="h-4 w-4" />

                      <span className="sr-only">Add</span>
                    </Button>

                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="notes" className="">
                <div className='max-h-[900px] '>
                  <>
                    <Card className="overflow-hidden text-[#f1f1f1] w-[600px] mx-auto" x-chunk="dashboard-05-chunk-4 "  >
                      <CardHeader className="flex flex-row items-start bg-[#18181a]">
                        <div className="grid gap-0.5">
                          <CardTitle className="group flex items-center gap-2 text-lg">
                            Notes
                          </CardTitle>
                        </div>
                        <div className="ml-auto flex items-center gap-1">
                          <TooltipProvider delayDuration={0}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button size="icon" variant="outline" className="ml-auto rounded-full" onClick={() => setOpen(true)}  >
                                  <PlusIcon className="h-4 w-4" />
                                  <span className="sr-only">CC Employee</span>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent sideOffset={10} className='bg-[#dc2626]'>CC Employee</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-grow !grow overflow-y-scroll overflow-x-clip p-6 text-sm bg-[#09090b]">
                        <div className="grid gap-3 max-h-[70vh] h-auto">
                          <Card>
                            <CardContent>
                              <div className="space-y-4 mt-5">
                                {financeNotesList.map((message, index) => (
                                  <div
                                    key={index}
                                    className={cn(
                                      "flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                                      message.author === user.email
                                        ? "ml-auto bg-[#dc2626] text-[#fafafa]"
                                        : "bg-[#262626]"
                                    )}
                                  >
                                    <div className='grid grid-cols-1'>
                                      {message.author !== user.email && (
                                        <p className='text-[#8c8c8c]'>
                                          {message.author}
                                        </p>
                                      )}
                                      {message.customContent}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </CardContent>
                      <CardFooter className="flex flex-row items-center border-t border-[#27272a] bg-[#18181a] px-6 py-3">
                        <fetcher.Form ref={formRef} method="post" className="flex w-full items-center space-x-2" >
                          <Input type="hidden" defaultValue={user.email} name="author" />
                          <Input type="hidden" defaultValue={data.clientFileId} name="customerId" />
                          <input type="hidden" defaultValue={data.id} name="financeId" />
                          <Input type="hidden" defaultValue={data.name} name="name" />
                          <Input
                            id="message"
                            placeholder="Type your message..."
                            className="flex-1 bg-[#18181a] border-[#27272a]"
                            autoComplete="off"
                            value={input}
                            onChange={(event) => setInput(event.target.value)}
                            name="customContent"
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
                            className='bg-[#dc2626] '>
                            <PaperPlaneIcon className="h-4 w-4" />
                            <span className="sr-only">Send</span>
                          </Button>
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

/**   <Dialog open={open} onOpenChange={setOpen}>
                        <DialogContent className="gap-0 p-0 outline-none border-[#27272a] text-[#fafafa]">
                          <DialogHeader className="px-4 pb-4 pt-5">
                            <DialogTitle>CC Employee</DialogTitle>
                            <DialogDescription>
                              Invite a user to this thread.
                            </DialogDescription>
                          </DialogHeader>
                          <Command className="overflow-hidden rounded-t-none border-t border-[#27272a] bg-transparent">
                            <CommandInput placeholder="Search user..." className='bg-[#18181a] text-[#fafafa]' />
                            <CommandList>
                              <CommandEmpty>No users found.</CommandEmpty>
                              <CommandGroup className="p-2">
                                {users.map((user) => (
                                  <CommandItem
                                    key={user.email}
                                    className="flex items-center px-2"
                                    onSelect={() => {
                                      if (selectedUsers.includes(user)) {
                                        return setSelectedUsers(
                                          selectedUsers.filter(
                                            (selectedUser) => selectedUser !== user
                                          )
                                        )
                                      }

                                      return setSelectedUsers(
                                        [...users].filter((u) =>
                                          [...selectedUsers, user].includes(u)
                                        )
                                      )
                                    }}
                                  >
                                    <Avatar>
                                      <AvatarImage src={user.avatar} alt="Image" />
                                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="ml-2">
                                      <p className="text-sm font-medium leading-none">
                                        {user.name}
                                      </p>
                                      <p className="text-sm text-[#909098]">
                                        {user.email}
                                      </p>
                                    </div>
                                    {selectedUsers.includes(user) ? (
                                      <CheckIcon className="ml-auto flex h-5 w-5 text-primary" />
                                    ) : null}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                          <DialogFooter className="flex items-center border-t border-[#27272a] p-4 sm:justify-between">
                            {selectedUsers.length > 0 ? (
                              <div className="flex -space-x-2 overflow-hidden">
                                {selectedUsers.map((user) => (
                                  <Avatar
                                    key={user.email}
                                    className="inline-block border-2 border-background border-[#27272a]"
                                  >
                                    <AvatarImage src={user.avatar} />
                                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                                  </Avatar>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-[#909098]">
                                Select users to add to this thread.
                              </p>
                            )}
                            <Button
                              disabled={selectedUsers.length < 2}
                              onClick={() => {
                                setOpen(false)
                              }}
                            >
                              Continue
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog> */
