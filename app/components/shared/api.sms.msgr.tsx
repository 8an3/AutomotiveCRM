// i want to create a  sms messenger app
// i want to be able to send and receive sms messages
// i want to be able to send and receive sms messages in real time
// i want a list of contact to text and be able to save our messages
// we will be using twillio as the api sservice

import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger, } from "~/components/ui/sheet"
import { MailIn, } from "iconoir-react";
import { json, type ActionFunction, type DataFunctionArgs } from "@remix-run/node";
import { model } from "~/models"
import { authenticator } from "~/services"
import { useEffect, useState, } from "react";
import { useLoaderData, useFetcher, Form } from "@remix-run/react";
import ConversationsApp from '../messenger/ConversationsApp'


export async function loader({ request }: DataFunctionArgs) {
  const userSession = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const user = await model.user.query.getForSession({ id: userSession.id });
  return json({ ok: true, user })
}

export const action: ActionFunction = async ({ req, res, request }) => {
  const data = Object.fromEntries(await request.formData());
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const toNumber = process.env.TWILIO_PHONE_NUMBER

  // should we add anything here?

  const client = require('twilio')(accountSid, authToken);

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");

  const send = await client.messages
    .create({
      from: process.env.TWILIO_PHONE_NUMBER,
      to: data.body,
      body: req.body.body,
    })
    .then(message => console.log(message.sid))
    .done();
  return json({ send })
}



export default function SmsDemo({ toNumber }) {
  const [number, setNumber] = useState("");
  const [body, setBody] = useState("");
  const fetcher = useFetcher();
  const { user } = useLoaderData();
  const [messages, setMessages] = useState([]); // Store chat messages

  const [sentMessages, setSentMessages] = useState([]); // Store sent messagesc

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>
          <Button className="myMessenger bg-transparent border-none text-black dark:text-foreground left-[100px]">
            <MailIn className="size-sm me-2 " />
            Messenger
          </Button>
        </Button>
      </SheetTrigger>
      <SheetContent side='left' className="w-[500px]">
        <SheetHeader>
          <SheetTitle>Messenger</SheetTitle>

        </SheetHeader>
        <div className="flex flex-col">
          <div className="users-container">
            {messages.map((message, index) => (
              <div key={index} className="message">
                <strong>{message.sender}:</strong>
                <p>{message.updatedAt}</p>
              </div>
            ))}
          </div>

          <div className="chat-container">
            {messages.map((message, index) => (
              // Render received messages
              <div key={index} className="message">
                <strong>{message.sender}:</strong> {message.text}
              </div>))}
            {sentMessages.map((message, index) => (
              <div key={index} className="message">
                <strong>You:</strong> {message.text}
              </div>
            ))}
          </div>

          <fetcher.Form method='post' action='/api/sms'>
            <div className="flex flex-row">
              <div className="flex flex-col">
                <Label htmlFor="number">Number</Label>
                <Input
                  name="toNumber"
                  id="toNumber"
                  value={toNumber}
                  onChange={(e) => setNumber(e.target.value)}
                />
              </div>
              <div className="flex flex-col">
                <Label htmlFor="body">Body</Label>
                <Input
                  name="sms"
                  id="sms"
                  onChange={(e) => setBody(e.target.value)}
                />
              </div>
            </div>
            <Button type="submit" className="mt-3">
              Send message
            </Button>
          </fetcher.Form>

        </div>

      </SheetContent>
    </Sheet>
  )
}





/*
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet"
import { MailIn, } from "iconoir-react";
import { json, type ActionFunction, type DataFunctionArgs } from "@remix-run/node";
import { model } from "~/models"
import { authenticator } from "~/services"
import { useEffect, useState, } from "react";
import { useLoaderData, useFetcher, Form } from "@remix-run/react";

export async function loader({ request }: DataFunctionArgs) {
  const userSession = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  const user = await model.user.query.getForSession({ id: userSession.id });
  return json({ ok: true, user })
}

export const action: ActionFunction = async ({ req, res, request }) => {
  const data = Object.fromEntries(await request.formData());
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const toNumber = process.env.TWILIO_PHONE_NUMBER

  const client = require('twilio')(accountSid, authToken);

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");

  const send = await client.messages
    .create({
      from: process.env.TWILIO_PHONE_NUMBER,
      to: data.body,
      body: req.body.body,
    })
    .then(message => console.log(message.sid))
    .done();
  return json({ send })
}



export default function SmsDemo({toNumber}) {
  const [number, setNumber] = useState("");
  const [body, setBody] = useState("");
  const fetcher = useFetcher();
  const { user } = useLoaderData();
  const [messages, setMessages] = useState([]); // Store chat messages
  const [newSMS, setNewSMS] = useState(''); // Store user's new message
  const [ws, setWs] = useState(null); // WebSocket connection
  const [sentMessages, setSentMessages] = useState([]); // Store sent messagesc


  useEffect(() => {
    // Create a WebSocket connection
    const socket = new WebSocket('ws://localhost:3000');

    socket.onopen = () => {
      console.log('WebSocket connection established');
      setWs(socket);
    };

    socket.onmessage = (event) => {
      // Handle incoming messages and update chat interface
      const incomingMessage = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, incomingMessage]);
    };

    let reconnectTimeout;

    socket.onclose = (event) => {
      // ... (error handling)

      // Implement reconnection logic here
      if (!event.wasClean) {
        console.log('Reconnecting...');
        // Retry connecting to the WebSocket server after a delay (e.g., 5 seconds)
        reconnectTimeout = setTimeout(() => {
          // Recreate the WebSocket connection
          const newSocket = new WebSocket('ws://localhost:3000');

          newSocket.onopen = () => {
            console.log('WebSocket reconnection successful');
            setWs(newSocket);
          };

          // Set up event listeners for the new socket (onmessage, onclose, onerror)
          // ...

          // Clear the previous reconnect timeout
          clearTimeout(reconnectTimeout);
        }, 5000); // Retry after 5 seconds (adjust as needed)
      }
    };

    socket.onerror = (error) => {
      console.error(`WebSocket error: ${error.message}`);
      // Handle the error gracefully
    };


    return () => {
      clearTimeout(reconnectTimeout);

      // Close the WebSocket connection when component unmounts
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, []);


  const handleReceivedMessage = (message) => {
    // Handle incoming messages and update chat interface
    setMessages((prevMessages) => [...prevMessages, message]);
  };
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>
          <Button className="myMessenger bg-transparent border-none text-black dark:text-foreground left-[100px]">
            <MailIn className="size-sm me-2 " />
            Messenger
          </Button>
        </Button>
      </SheetTrigger>
      <SheetContent side='left' className="w-[500px]">
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>

        <div className="users-container">
          {messages.map((message, index) => (
            <div key={index} className="message">
              <strong>{message.sender}:</strong>
              <p>{message.updatedAt}</p>
            </div>
          ))}
        </div>

        <div className="chat-container">
          {messages.map((message, index) => (
            // Render received messages
            <div key={index} className="message">
              <strong>{message.sender}:</strong> {message.text}
            </div>))}
          {sentMessages.map((message, index) => (
            <div key={index} className="message">
              <strong>You:</strong> {message.text}
            </div>
          ))}
        </div>

       <fetcher.Form method='post' action='/api/sms/outgoing'>
          <div className="flex flex-row">
            <div className="flex flex-col">
              <Label htmlFor="number">Number</Label>
              <Input
                name="toNumber"
                id="toNumber"
                value={toNumber}
                onChange={(e) => setNumber(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <Label htmlFor="body">Body</Label>
              <Input
                name="sms"
                id="sms"
                onChange={(e) => setBody(e.target.value)}
              />
            </div>
          </div>
          <Button  type="submit" className="mt-3">
            Send message
          </Button>
       </fetcher.Form>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Save changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}




*/
