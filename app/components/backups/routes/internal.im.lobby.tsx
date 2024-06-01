import type { LoaderArgs, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useLoaderData, useLocation } from "@remix-run/react";
import React, { useEffect, useRef, useState } from "react";
import { useEventSource } from "remix-utils";
import { emitter } from "../services/emitter";
import { getSession } from '~/sessions/auth-session.server'
import { model } from "../models";
import { prisma } from "~/libs";
import { XCircle } from "lucide-react";
import { Textarea } from "~/components/ui/textarea";
import { Input } from "~/components/ui/input";
import EventEmitter from "events";
import useSWR from 'swr';
import { GetUser } from "~/utils/loader.server";

const event = new EventEmitter();

const swrKey = "sub-key";


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
  return json({ user, staffMembers, });
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
  const receiver = await prisma.user.findUnique({
    where: {
      email: to
    }
  })
  const saveMesage = await prisma.notificationsUser.create({
    data: {
      title: `New message in lobby from ${username}`,
      content: message,
      read: 'false',
      userId: 'lobby',
      type: 'messages'
    }
  })

  return json({ message, saved, saveMesage });
}

let url = '/dealer/im/messages'
const fetcher = url => fetch(url).then(r => r.json())

export default function IMLobby() {
  const { user, staffMembers, } = useLoaderData()
  const $form = useRef<HTMLFormElement>(null);
  const { key } = useLocation();
  useEffect(
    function clearFormOnSubmit() {
      $form.current?.reset();
    },
    [key],
  );
  const { data: getMessages, error } = useSWR(url, fetcher)



  const [messages, setMessages] = useState<string[]>([]);
  const { data: lastMessage, mutate } = useSWR(url, (url) => fetch(url).then((res) => res.json()), { refreshInterval: 60000 });

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
      <div className="border-1 mx-auto flex w-[95%] h-[90vh] border border-[#262626]">

        <div className="email flex h-full w-[100%]  flex-col">
          <div className="flex border-b border-[#262626] text-[#fafafa] p-2 justify-between">
            <p> Staff Chat</p> <Link to='/dealer/im/chatMenu'>
              <button><XCircle /></button>
            </Link>
          </div>

          <div className="grow  p-3 w-[90%] mx-auto items-end">
            <ul>
              {messages.map((message) => (
                <li className='text-[#fafafa]' key={message}>{message}</li>
              ))}
            </ul>
          </div>

          <div className="flex  border-t border-[#262626] justify-center">
            <Form ref={$form} method="post">
              <Input name="message" className="m-2 mx-auto w-[300px]" placeholder="Message..." />
              <input className='w-full p-2' type="hidden" name='name' defaultValue={user.name} />
              <input className='w-full p-2' type="hidden" name='senderEmail' defaultValue={user.email} />
            </Form>
          </div>

        </div>

      </div>
    </>
  );
}
