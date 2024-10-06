import ProvideAppContext, { useAppContext, } from "~/components/microsoft/AppContext";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useMsal } from "@azure/msal-react";
import { Form, useFetcher, useFetchers, useLoaderData, useNavigate, useNavigation } from "@remix-run/react";

import {
  deleteMessage,
  getDrafts,
  getDraftsList,
  getInbox,
  getInboxList,
  getJunk,
  getList,
  getSent,
  getTrash,
  messageRead,
  messageUnRead,
  getUser,
  testInbox,
  getFolders,
  getAllFolders,
  getEmailById,
  MoveEmail,
  createReplyDraft,
  ComposeEmail,
  SendNewEmail,
  setFolder,
  listAttachment,
  SingleCustomerInbox,
  CreateNotifications,
} from "~/components/microsoft/GraphService";
import { loginRequest } from "~/components/microsoft/Config";
import { prisma } from '~/libs';
import { getSession } from "~/sessions/auth-session.server";
import { GetUser } from "~/utils/loader.server";
import { json, LoaderFunction, type LinksFunction } from "@remix-run/node";

export async function loader({ params, request }: LoaderFunction) {
  const session2 = await getSession(request.headers.get("Cookie"));
  const email = session2.get("email")
  const user = await GetUser(email)
  return json({ user })
}

export default function GetNotifications() {
  const { user } = useLoaderData();
  const app = useAppContext();
  const { instance } = useMsal();
  const authProvider = app.authProvider!;
  const account = instance.getActiveAccount();
  const [emails, setEmails] = useState([]);
  const [isMounted, setIsMounted] = useState(true);
  const fetcher = useFetcher();

  useEffect(() => {
    async function fetchEmails() {
      if (!isMounted) return;
      if (app) {
        try {
          console.log('step 1');

          const response = await CreateNotifications(authProvider);
          if (response?.value?.length > 0) {
            console.log('step 2');
            setEmails(response.value);
            const emails = response.value;

            for (const email of emails) {
              console.log(email, 'email');
              const messageId = email.id;
              const emailString = JSON.stringify(email);

              const formData = new FormData();
              formData.append("messageId", messageId);
              formData.append("email", emailString);
              formData.append("userEmail", user.Email);
              console.log(formData, 'formData');

              await fetcher.submit(formData, { method: "post" });
            }
          } else {
            console.log("No emails fetched.");
          }
        } catch (error) {
          console.error("Error fetching emails:", error);
        }
      }
    }

    fetchEmails();

    return () => {
      setIsMounted(false);
    };
  }, [app, instance, isMounted]);

  return null;
}

export const action: ActionFunction = async ({ request }) => {
  const session2 = await getSession(request.headers.get("Cookie"));
  const userEmail = session2.get("email")
  const formPayload = Object.fromEntries(await request.formData());

  const email = JSON.parse(formPayload.email);
  console.log('step 3');

  const existingNotification = await prisma.notificationsUser.findFirst({
    where: { messageId: formPayload.messageId }
  });
  console.log('step 4', existingNotification, ',existingNotification');
  if (!existingNotification) {
    console.log('step 5');
    const content = JSON.stringify(email.body?.content);
    await prisma.notificationsUser.create({
      data: {
        title: email.subject ? email.subject : 'No Subject',
        content: content ? content : 'No Content',
        from: email.from?.emailAddress?.address,
        to: email.toRecipients[0].emailAddress.address,
        userEmail: userEmail,
        read: false,
        messageId: formPayload.messageId,
        customerName: email.sender?.emailAddress?.name,
        dismiss: null,
        type: 'messages',
        subType: 'email'

      }
    });
    console.log(`Notification created for email ID: ${formPayload.messageId}`);
  } else {
    console.log('step 5');
    console.log(`Skipping email ID: ${formPayload.messageId} (already exists)`);
  }
  return null
}
