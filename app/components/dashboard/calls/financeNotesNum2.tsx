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
import { formatRelativeTime } from "~/utils";
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
import { type dashBoardType } from "~/components/dashboard/schema";

async function getData({ id }) {
  console.log(id, 'second')

  const res = await fetch(`/dashboard/calls/api/notesLoader/${id}`);
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
}


export default function FinaceNotesNum2({ id }) {
  console.log(id, 'main')
  const { user, } = useRootLoaderData();
  const [data, setData] = useState([]);
  if (!financeNotes) {
    return null; // or some fallback if financeNotes is null or undefined
  }
  useEffect(() => {
    const data = async () => {
      const data = await getData({ id });
      setData(data);
    };

    data();
  }, [id]);

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
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenDialog = () => {
    setIsOpen(true);
  };

  const handleCloseDialog = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button onClick={handleOpenDialog}>Open Dialog</button>
      {isOpen && (
        <Dialog.Root>
          <Dialog.Trigger>
            <Button className="Button">Notes</Button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="inset-0 overflow-y-auto">
              <Dialog.Content onClose={handleCloseDialog} className="dialogContent h-screen w-full md:w-[50%] overflow-y-auto bg-white p-[10px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
                <Dialog.Title className="m-0 text-[17px]">Notes</Dialog.Title>
                <Dialog.Description className=" mb-5 mt-[1px] text-[15px] leading-normal"></Dialog.Description>
                <div className="container relative ml-3 mr-3 mt-3 h-[80%] w-[95%] overflow-y-auto">

                  <div>
                    {financeNotes.map((note) => (
                      <div key={note.id}>
                        <p>Author: {note.author}</p>
                        <p>Custom Content: {note.customContent}</p>
                        {/* Include other properties you want to display */}
                      </div>
                    ))}
                  </div>
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
                      defaultValue={id}
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
      )}
    </>
  );
}
