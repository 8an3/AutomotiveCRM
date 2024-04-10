import React, { useEffect, useRef, useState } from "react";
import { useFetcher, useLoaderData, useSubmit } from "@remix-run/react";
import { model } from "~/models";
//import { authenticator } from "~/services";
import { Button } from "~/components";
import { ActionFunction, LoaderArgs, LoaderFunction, json } from "@remix-run/node";
import { saveMyDocument } from "~/utils/docTemplates/create.server";
import { v4 as uuidv4 } from 'uuid';
import { prisma } from "~/libs";
import { getSession } from "~/sessions/auth-session.server";
import { requireAuthCookie } from '~/utils/misc.user.server';



export const action: ActionFunction = async ({ request, req, params }) => {
  const requestBody = await request.data();
  const data = JSON.parse(requestBody);

  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")


  const user = await GetUser(email)
  /// console.log(user, account, 'wquiote loadert')
  if (!user) {
    redirect('/login')
  }

  const userId = user?.id
  const intent = data.intent
  const category = 'documentTemplateBuilder'
  const dept = 'sales'
  const docName = userId + uuidv4()
  const fileName = userId + uuidv4()
  const doc = data
  console.log(doc)

  const dbData = {
    userId, doc, docName, dept, fileName, category
  }

  const fileToSave = await saveMyDocument(dbData)
  return fileToSave
}

export default function TAryMer() {
  const { user } = useLoaderData();

  useEffect(() => {
    const handleMessage = (event) => {

      const receivedData = event.data;
      console.log(receivedData, 'received'); // Check the structure of the received data

      // Process the received data as needed
    };

    window.addEventListener('message', handleMessage);

    // Clean up the event listener when the component unmounts
    return () => {
      console.log('Cleaning up message event listener');

      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <p>intake</p>
  );
}



/** useEffect(() => {
    const handleMessage = (event) => {
      console.log(event.data); // { myData: 'Hello, world!' }
    };

    window.addEventListener('message', handleMessage);

    window.addEventListener('message', event => {
      // Check the origin of the sender
      if (event.origin !== 'http://localhost:3051') {
        console.error('Received message from untrusted origin:', event.origin);
        return;
      }
      const userId = user?.id
      const category = 'documentTemplateBuilder'
      const dept = 'sales'
      const docName = userId + uuidv4()
      const fileName = userId + uuidv4()




      const data = event.data;
      console.log(data)

      // Check if the message structure is as expected
      if (data.templateData && data.base64PDF) {
        // Handle the received data
        const templateData = data.templateData;
        const base64PDF = data.base64PDF;
        const dbData = {
          userId, data, docName, dept, fileName, category
        }
        async function fileToSave() {
          await saveMyDocument(dbData)

        }
        fileToSave()
        // Do something with the data (e.g., update the parent site)
        console.log('Received data from iframe:', templateData, base64PDF);
        return fileToSave

      }
    });
  }, []) */
