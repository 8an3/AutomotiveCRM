/* eslint-disable tailwindcss/classnames-order */
/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useRef, useState } from "react";
import {
  Form,
  Link,
  useFetcher,
  useLoaderData,
  useTransition,
} from "@remix-run/react";
import { useNavigation } from "react-router-dom";

import {
  RemixNavLink,
  Input,
  Separator,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  TextArea,
  Label,
} from "~/components";
import { useRootLoaderData } from "~/hooks";
import { formatRelativeTime, invariant } from "~/utils";
import { ArrowRight } from "iconoir-react";
import ConversationsApp from "./api.sms.msgr";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import * as Toolbar from "@radix-ui/react-toolbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import * as Toast from "@radix-ui/react-toast";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { getAllFinanceNotes } from "~/utils/financeNote/get.server";
import { ActionArgs, json, redirect } from "@remix-run/node";
import { requireUserSession } from "~/helpers";
import { badRequest, forbidden, serverError } from "remix-utils";
import { model } from "~/models";


export async function loader({ request, params }: LoaderArgs) {
  const { userSession } = await requireUserSession(request);
  invariant(params.noteId, "noteId not found");

  const note = await model.userNote.query.getById({
    id: params.noteId,
    userId: userSession.id,
  });
  invariant(note, "Note not found");

  const isOwner = userSession.id === note.userId;
  if (!isOwner) {
    return forbidden({ note: null, isOwner: null });
  }

  return json({ note, isOwner });
}


export async function action({ request }: ActionArgs) {
  const { userSession, user } = await requireUserSession(request);

  const formData = await request.formData();
  const submission = parse(formData, { schema: schemaNoteNew });
  if (!submission.value || submission.intent !== "submit") {
    return badRequest(submission);
  }

  try {
    const newNote = await model.userNote.mutation.create({
      user: userSession,
      note: submission.value,
      files: [],
    });
    if (!newNote) {
      return badRequest(submission);
    }
    return redirect(`/${user.username}/${newNote.slug}`);
  } catch (error) {
    console.error(error);
    return serverError(submission);
  }
}

export default function FinanceNotes() {
  const { finance, user, financeNotes, dashData } = useLoaderData();
  const [open, setOpen] = React.useState(false);
  const [formData, setFormData] = useState({
    customContent: "",
    urgentFinanceNote: "",
  });
  const [editItemId, setEditItemId] = useState(null);

  const timerRef = React.useRef(0);

  const handleEditClick = (itemId) => {
    setEditItemId(itemId);
  };

  const handleSave = (itemId) => {
    return null;
  };

  const fetcher = useFetcher();
  let navigation = useNavigation();
  let transition = useTransition();
  let isDeleting =
    fetcher.state === "submitting" &&
    fetcher.formData?.get("intent") === "deleteFinanceNote";
  let isAdding =
    fetcher.state === "submitting" &&
    fetcher.formData?.get("intent") === "saveFinanceNote";
  let isEditing =
    transition.state === "submitting" &&
    fetcher.formData?.get("intent") === "editFinanceNote";

  let formRef = useRef();

  useEffect(() => {
    if (!isAdding) {
      formRef.current?.reset();
    }
  }, [isAdding]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  return (
    <>
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <Button className="Button">Notes</Button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="inset-0 overflow-y-auto">
            <Dialog.Content className="dialogContent h-screen w-[550px] max-w-[550px] overflow-y-auto bg-white p-[10px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
              <Dialog.Title className="m-0 text-[17px]">Notes</Dialog.Title>
              <Dialog.Description className=" mb-5 mt-[1px] text-[15px] leading-normal"></Dialog.Description>
              <div className="container relative ml-3 mr-3 mt-3 h-[80%] w-[95%] overflow-y-auto">
                <ul>
                  {financeNotes.map((message) => (
                    <li
                      key={message.id}
                      style={{
                        opacity: isDeleting ? 0.5 : 1,
                      }}
                      className="flex-cols-2 flex "
                    >
                      <Card className="mr-1 mt-1 w-full rounded-[0px]">
                        <CardContent className="flex flex-col">
                          <div className="mt-1 flex justify-between">
                            <p className="text-thin text-[11px]">
                              {message.author}
                            </p>
                            <p className="text-thin text-[11px]">
                              {new Date(message.createdAt).toLocaleDateString()}{" "}
                              {new Date(message.createdAt).toLocaleTimeString()}
                            </p>
                          </div>
                          {editItemId === message.id ? (
                            <TextArea
                              placeholder="Type your message here."
                              key={message.id}
                              name="customContent"
                              className=" mt-2 h-[50px] rounded-[0px]"
                              defaultValue={message.customContent}
                              onChange={handleChange}
                            />
                          ) : (
                            <p className="text-thin text-[13px]">
                              {message.customContent}
                            </p>
                          )}

                          <div className="flex justify-end">
                            <select
                              key={message.id}
                              defaultValue={message.urgentFinanceNote}
                              name="urgentFinanceNote"
                              className="h-8 w-[110px] text-xs"
                              onChange={handleChange}
                            >
                              <option value="Urgent?">Urgent?</option>
                              <option value="None">None</option>
                              <option value="Soon">Get Done Soon</option>
                              <option value="ASAP">ASAP</option>
                              <option value="DropEverything">
                                Drop Everything
                              </option>
                            </select>
                          </div>
                        </CardContent>
                      </Card>
                      <Input
                        type="hidden"
                        defaultValue={user.name}
                        name="author"
                      />
                      <Input
                        type="hidden"
                        defaultValue={finance.id}
                        name="customerId"
                      />

                      {/* Toolbar */}
                      <Toolbar.Root className="my-auto ml-auto mt-1 mt-1 flex h-full  w-[30px] justify-center bg-white p-[10px] shadow-[0_2px_2px] shadow-blackA4">
                        <Toolbar.ToggleGroup
                          type="multiple"
                          className="flex flex-col"
                        >
                          <Form method="post">
                            <Toolbar.ToggleItem
                              name="intent"
                              type="submit"
                              value="updateFinanceNote"
                              onClick={() => {
                                handleSave(message.id);
                                setEditItemId(null);
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="15px"
                                height="15px"
                                fill="none"
                                strokeWidth="1.2"
                                viewBox="0 0 24 24"
                                color="#000000"
                              >
                                <path
                                  stroke="#000000"
                                  strokeWidth="1.2"
                                  d="M3 19V5a2 2 0 0 1 2-2h11.172a2 2 0 0 1 1.414.586l2.828 2.828A2 2 0 0 1 21 7.828V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"
                                ></path>
                                <path
                                  stroke="#000000"
                                  strokeWidth="1.2"
                                  d="M8.6 9h6.8a.6.6 0 0 0 .6-.6V3.6a.6.6 0 0 0-.6-.6H8.6a.6.6 0 0 0-.6.6v4.8a.6.6 0 0 0 .6.6ZM6 13.6V21h12v-7.4a.6.6 0 0 0-.6-.6H6.6a.6.6 0 0 0-.6.6Z"
                                ></path>
                              </svg>
                            </Toolbar.ToggleItem>
                            <Input
                              type="hidden"
                              defaultValue={user.name}
                              name="author"
                            />
                            <Input
                              type="hidden"
                              defaultValue={finance.id}
                              name="customerId"
                            />
                            <Input
                              type="hidden"
                              defaultValue={message.id}
                              name="id"
                            />
                            <Input
                              type="hidden"
                              defaultValue="updateFinanceNote"
                              name="intent"
                            />
                            <Input
                              type="hidden"
                              defaultValue={formData.customContent}
                              name="customContent"
                            />

                            <Input
                              type="hidden"
                              defaultValue={formData.urgentFinanceNote}
                              name="urgentFinanceNote"
                            />
                          </Form>

                          <Toolbar.ToggleItem
                            type="submit"
                            name="intent"
                            value="editFinanceNote"
                            className="toolbar-toggle-item mt-1"
                            onClick={() => handleEditClick(message.id)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="15px"
                              height="15px"
                              fill="none"
                              strokeWidth="1.2"
                              viewBox="0 0 24 24"
                              color="#000000"
                            >
                              <path
                                stroke="#000000"
                                strokeWidth="1.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m14.363 5.652 1.48-1.48a2 2 0 0 1 2.829 0l1.414 1.414a2 2 0 0 1 0 2.828l-1.48 1.48m-4.243-4.242-9.616 9.615a2 2 0 0 0-.578 1.238l-.242 2.74a1 1 0 0 0 1.084 1.085l2.74-.242a2 2 0 0 0 1.24-.578l9.615-9.616m-4.243-4.242 4.243 4.242"
                              ></path>
                            </svg>
                          </Toolbar.ToggleItem>

                          <fetcher.Form method="post">
                            <Toolbar.ToggleItem
                              type="submit"
                              value="deleteFinanceNote"
                              name="intent"
                              className="toolbar-toggle-item mt-1"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="15px"
                                height="15px"
                                fill="none"
                                strokeWidth="1.2"
                                viewBox="0 0 24 24"
                                color="#000000"
                              >
                                <path
                                  stroke="#000000"
                                  strokeWidth="1.2"
                                  d="m19.262 17.038 1.676-12.575a.6.6 0 0 0-.372-.636L16 2h-5.5l-.682 1.5L5 2 3.21 3.79a.6.6 0 0 0-.17.504l1.698 12.744a4 4 0 0 0 1.98 2.944l.32.183a10 10 0 0 0 9.923 0l.32-.183a4 4 0 0 0 1.98-2.944ZM16 2l-2 5M9 6.5l.818-3"
                                ></path>
                                <path
                                  stroke="#000000"
                                  strokeWidth="1.2"
                                  d="M3 5c2.571 2.667 15.429 2.667 18 0"
                                ></path>
                              </svg>
                            </Toolbar.ToggleItem>
                            <Input
                              type="hidden"
                              defaultValue={message.id}
                              name="id"
                            />
                            <Input
                              type="hidden"
                              defaultValue="deleteFinanceNote"
                              name="intent"
                            />
                          </fetcher.Form>
                        </Toolbar.ToggleGroup>
                      </Toolbar.Root>
                    </li>
                  ))}
                </ul>
              </div>

              <div
                className="form bottom-25 absolute w-[95%]"
                style={{ position: "absolute", bottom: 25 }}
              >

                <Form method="post" >
                  <p>file upload</p>
                  <input type="file" name="upload" />
                  <input type="hidden" defaultValue='uploadFile' name="intent" />
                  <button type="submit">upload</button>
                </Form>


                <fetcher.Form ref={formRef} method="post">
                  <p className="m-0 text-[17px]">New Note</p>
                  <TextArea
                    placeholder="Type your message here."
                    name="customContent"
                    className="ml-3 mr-3 mt-2 h-[50px]  rounded-[0px] "
                  />
                  <Input type="hidden" defaultValue={user.name} name="author" />
                  <Input
                    type="hidden"
                    defaultValue={finance.id}
                    name="customerId"
                  />
                  <Input
                    type="hidden"
                    defaultValue="saveFinanceNote"
                    name="intent"
                  />

                  <div className="mt-2 flex justify-end ">
                    {/* saveFinanceNote */}
                    <button
                      name="intent"
                      type="submit"
                      className="mr-1 bg-transparent"
                      value="saveFinanceNote"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20px"
                        height="20px"
                        fill="none"
                        strokeWidth="1.2"
                        viewBox="0 0 24 24"
                        color="#000000"
                      >
                        <path
                          stroke="#000000"
                          strokeWidth="1.2"
                          d="M3 19V5a2 2 0 0 1 2-2h11.172a2 2 0 0 1 1.414.586l2.828 2.828A2 2 0 0 1 21 7.828V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"
                        ></path>
                        <path
                          stroke="#000000"
                          strokeWidth="1.2"
                          d="M8.6 9h6.8a.6.6 0 0 0 .6-.6V3.6a.6.6 0 0 0-.6-.6H8.6a.6.6 0 0 0-.6.6v4.8a.6.6 0 0 0 .6.6ZM6 13.6V21h12v-7.4a.6.6 0 0 0-.6-.6H6.6a.6.6 0 0 0-.6.6Z"
                        ></path>
                      </svg>
                    </button>
                  </div>
                </fetcher.Form>
              </div>
            </Dialog.Content>
          </Dialog.Overlay>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
