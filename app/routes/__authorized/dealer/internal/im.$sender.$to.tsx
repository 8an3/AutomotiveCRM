import type { LoaderArgs, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useLoaderData, useLocation, useParams } from "@remix-run/react";
import React, { useEffect, useRef, useState } from "react";
import { useEventSource, eventStream } from "remix-utils";
import { emitter } from "~/services/emitter";
import { getSession } from '~/sessions/auth-session.server'
import { model } from "~/models";
import { GetUser } from "~/utils/loader.server";
import { prisma } from "~/libs";
import { Input } from "~/components/ui/input";
import { XCircle } from "lucide-react";
import NotificationSystem from "~/routes/__authorized/dealer/notifications";
import useSWR, { SWRConfig, mutate } from 'swr';



export async function loader({ request, params }: LoaderFunction) {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")


  const user = await GetUser(email)
  /// console.log(user, account, 'wquiote loadert')
  const staffMembers = await prisma.user.findMany({
    where: {
      email: {
        not: user.email
      }
    }
  });
  if (!user) {
    redirect('/login')
  }
  const { sender, to } = params;

  const getMessages = await prisma.staffChat.findMany({
    where: {
      OR: [
        {
          sender: sender,
          to: to
        },
        {
          to: sender,
          sender: to
        }
      ]
    }
  });
  console.log(getMessages)


  return json({ user, staffMembers, getMessages, sender, to, });
}

export async function action({ request }: LoaderArgs) {
  const formData = await request.formData();
  const username = formData.get("name")
  const senderEmail = formData.get('senderEmail')
  const to = formData.get('to')
  let message = formData.get("message");
  message = `${username}: ${message}`
  //console.log(`Emitting message to channels private:${senderEmail}:${to} and private:${to}:${senderEmail}`);
  // emitter.emit(`private`, message)
  const sortedIdentifiers = [senderEmail, to].sort();
  const eventName = `private:${sortedIdentifiers[0]}:${sortedIdentifiers[1]}`;
  emitter.emit(eventName, message);


  const saved = await prisma.staffChat.create({
    data: {
      message: message,
      sender: senderEmail,
      to: to,
      room: senderEmail + ':' + to

    }
  })
  const sender = await prisma.user.findUnique({
    where: {
      email: senderEmail
    }
  })
  const receiver = await prisma.user.findUnique({
    where: {
      email: to
    }
  })


  return json({ message, saved, });
}


let url = '/dealer/im/roomMessages'
const fetcher = url => fetch(url).then(r => r.json())


export default function Component() {
  const { user, staffMembers, } = useLoaderData()
  const { sender, to } = useParams;

  const $form = useRef<HTMLFormElement>(null);
  const { key } = useLocation();
  useEffect(
    function clearFormOnSubmit() {
      $form.current?.reset();
    },
    [key],
  );
  const { data: getMessages, error } = useSWR(url, fetcher)

  const sortedIdentifiers = [sender, to].sort();
  const [messages, setMessages] = useState<string[]>([]);
  const { data: lastMessage, mutate } = useSWR(url, (url) => fetch(url).then((res) => res.json()), { refreshInterval: 60000 }); console.log(sortedIdentifiers[0], sortedIdentifiers[1])
  useEffect(
    function saveMessage() {
      setMessages((current) => {
        if (typeof lastMessage === "string") return [...current, lastMessage];

        return current;
      });
    },
    [lastMessage],
  );
  useEffect(() => {
    async function fetchInitialMessages() {
      const initialMessages = await getMessages;
      const messageTexts = initialMessages.map(msg => msg.message);
      setMessages(messageTexts);
    }
    fetchInitialMessages();
  }, []);
  useEffect(() => {
    const message = `Message from ${to}`;
    emitter.emit("notification", message);
  }, []);

  return (
    <>
      <div className="border-1 mx-auto flex w-[95%] h-[90vh] border border-[#262626] ">

        <div className="email flex h-full w-[100%]  flex-col">
          <div className="flex border-b border-[#262626] text-[#fafafa] p-2 justify-between">
            <p> {to}</p> <Link to='/dealer/im/chatMenu'>
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
              <Input className='w-full p-2' type="hidden" name='to' defaultValue={to} />
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}
