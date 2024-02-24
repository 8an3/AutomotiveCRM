import { prisma } from "~/libs";
import type { LoaderArgs, LoaderFunction } from "@remix-run/node";
import { getSession } from '../sessions/auth-session.server'

export async function loader({ request, params }: LoaderFunction) {

  try {
    let fetchedEmails;
    const API_KEY = 'AIzaSyCsE7VwbVNO4Yw6PxvAfx8YPuKSpY9mFGo'

    const session = await getSession(request.headers.get("Cookie"));
    const email = session.get("email")
    let tokens = session.get("accessToken")
    const response = await fetch(`https://gmail.googleapis.com/gmail/v1/users/${email}/messages?labelIds=UNREAD&maxResults=20&key=${API_KEY}`, {
      headers: { Authorization: 'Bearer ' + tokens, Accept: 'application/json', }
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch emails. Status: ${response.status}`);
    }
    console.log(response, 'response')
    let notificationsEmail = await prisma.checkLatestEmail.findUnique({ where: { userEmail: email, } })
    if (!notificationsEmail) {
      const saveList = await prisma.checkLatestEmail.create({
        data: {
          userEmail: email,
          emailId: JSON.stringify(response.messages)
        },
      });
    }
    const newEmailList = await response.json();
    const newNotifications = newEmailList.filter((newEmail) => {
      return !notificationsEmail.some(
        (notification) => notification.emailId === newEmail.id
      );
    });
    const newNotificationsIds = newNotifications.map(
      (newNotification) => newNotification.id
    );
    const GetEmailDetails = async (emailId) => {
      const response = await fetch(`https://gmail.googleapis.com/gmail/v1/users/${email}/messages/${emailId}?format=full&key=${API_KEY}`, {
        headers: { Authorization: 'Bearer ' + tokens, Accept: 'application/json' }
      });
      if (response.ok) {
        const emailDetails = await response.json();
        return emailDetails;
      } else {
        console.error('Failed to fetch email details:', response.status);
        return null;
      }
    };
    const notificationPromises = newNotificationsIds.map(async (emailId) => {
      const emailDetails = await GetEmailDetails(emailId);

      if (emailDetails) {
        const senderName = emailDetails.payload.headers.find(header => header.name === 'From').value;
        const nameMatch = senderName.match(/"([^"]+)"/);
        const nameWithoutQuotes = nameMatch ? nameMatch[1] : senderName;
        const emailWithoutQuotes = senderName.match(/<([^>]+)>/);
        const emailValue = emailWithoutQuotes ? emailWithoutQuotes[1] : '';
        const emailHeaderValue = emailDetails.payload.headers[1].value;
        const dateRegex = /\b(\d{1,2} [a-zA-Z]+ \d{4} \d{2}:\d{2}:\d{2} [-+]\d{4})\b/;
        const match = emailHeaderValue.match(dateRegex);
        const extractedName = nameWithoutQuotes.replace(/<[^>]+>/, '').trim();
        await prisma.notificationsUser.create({
          data: {
            title: `New email from ${extractedName}`,
            content: `${emailDetails.payload.headers.find(header => header.name === 'Subject')}`,
            read: 'no',
            userId: emailDetails.userId,
            type: 'messages',
            to: email,
            from: emailValue.trim(),
          },
        });
      }
    });
    await Promise.all(notificationPromises);
    const saveList = await prisma.checkLatestEmail.create({
      data: {
        userEmail: email,
        emailId: newEmailList,
      },
    });
    return { notificationsEmail, newNotificationsIds, saveList };
  } catch (error) {
    console.error('Error fetching and comparing emails:', error.message);
    return { error: 'Failed to fetch and compare emails' };
  }
}
