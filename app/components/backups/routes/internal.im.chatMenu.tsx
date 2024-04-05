import type { LoaderArgs, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useLoaderData, useLocation } from "@remix-run/react";
import React, { useEffect, useRef, useState } from "react";
import { eventStream, useEventSource } from "remix-utils";
import { emitter } from "../services/emitter";
import { getSession } from '../sessions/auth-session.server'
import { model } from "../models";
import { prisma } from "~/libs";
import { XCircle } from "lucide-react";
import { Textarea } from "~/other/textarea";
import NotificationTemplate from './notifications'
import useSWR, { SWRConfig, mutate } from 'swr';
import { GetUser } from "~/utils/loader.server";



export async function loader({ request, params }: LoaderFunction) {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")


  const user = await GetUser(email)
  /// console.log(user, account, 'wquiote loadert')
  const staffMembers = await prisma.user.findMany({})
  if (!user) {
    redirect('/login')
  }
  const getMessages = await prisma.staffChat.findMany({
    where: {
      room: 'lobby'
    }
  })
  console.log(getMessages)

  return json({ user, staffMembers, getMessages });
}

export async function action({ request }: LoaderArgs) {
  const formData = await request.formData();
  const username = formData.get("name")
  const senderEmail = formData.get('senderEmail')
  let message = formData.get("message");
  message = `${username}: ${message}`
  emitter.emit("message", message);
  const saved = await prisma.staffChat.create({
    data: {
      message: message,
      sender: senderEmail,
      room: 'lobby'
    }
  })
  return json({ message, saved });
}

export default function Component() {
  const { user, staffMembers, getMessages } = useLoaderData()
  const $form = useRef<HTMLFormElement>(null);
  const { key } = useLocation();
  useEffect(
    function clearFormOnSubmit() {
      $form.current?.reset();
    },
    [key],
  );


  const [messages, setMessages] = useState<string[]>([]);
  const lastMessage = useEventSource("/internal/im/see/chat");

  useEffect(() => {
    async function fetchInitialMessages() {
      const initialMessages = await getMessages;
      const messageTexts = initialMessages.map(msg => msg.message);
      setMessages(messageTexts);
    }
    fetchInitialMessages();
  }, []);

  useEffect(
    function saveMessage() {
      setMessages((current) => {
        if (typeof lastMessage === "string") return [...current, lastMessage];
        return current;
      });
    },
    [lastMessage],
  );

  return (
    <>
      <div className="border-1 mx-auto flex w-[95%] h-[90vh] border border-[#3b3b3b] ">


        <div className="emailList w-[100%] border-r border-[#3b3b3b]">
          <div className="flex border-b border-[#3b3b3b] text-white p-2 justify-between">
            <p>Staff Chat</p>    <Link to="/internal/im/lobby" ><XCircle /></Link>
          </div>
          <Link to="/internal/im/lobby">

            <div className={`m-2 mx-auto w-[95%] cursor-pointer rounded-md border border-[#ffffff4d] hover:border-[#02a9ff]  hover:text-[#02a9ff] active:border-[#02a9ff]   `}  >
              <p className="text-white p-3">Lobby</p>
            </div>
          </Link>
          {staffMembers && staffMembers.length > 0 && staffMembers.map((staffMember, index) => {
            return (
              <div key={index}>
                <Link to={`/internal/im/${user.email}/${staffMember.email}`} >
                  <div className={`m-2 mx-auto w-[95%] cursor-pointer rounded-md border border-[#ffffff4d] hover:border-[#02a9ff]  hover:text-[#02a9ff] active:border-[#02a9ff]   `}  >
                    <p className="text-white p-3">{staffMember.name}</p>
                  </div>
                </Link>

              </div>
            );
          })}
        </div>

      </div>
    </>
  );
}
