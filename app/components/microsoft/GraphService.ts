// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

// <GetUserSnippet>
import { Client, type GraphRequestOptions, type PageCollection, PageIterator, type ClientOptions } from '@microsoft/microsoft-graph-client';
import { type AuthCodeMSALBrowserAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/authCodeMsalBrowser';
import { endOfWeek, startOfWeek } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';
import type { User, Event, Message } from '@microsoft/microsoft-graph-types';

let graphClient: Client | undefined = undefined;

async function ensureClient(authProvider: AuthCodeMSALBrowserAuthenticationProvider) {
  let clientOptions: ClientOptions = {
    authProvider: authProvider,
    debugLogging: true,
  };
  graphClient = await Client.initWithMiddleware(clientOptions);
  return graphClient;
}

export async function getUser(authProvider: AuthCodeMSALBrowserAuthenticationProvider): Promise<User> {
  ensureClient(authProvider);
  const user: User = await graphClient!
    .api('/me')
    //.select('id,displayName,mail,mailboxSettings,userPrincipalName')
    .get();
  return user;
}

export async function getUserWeekCalendar(authProvider: AuthCodeMSALBrowserAuthenticationProvider,
  timeZone: string): Promise<Event[]> {
  ensureClient(authProvider);
  const now = new Date();
  const startDateTime = zonedTimeToUtc(startOfWeek(now), timeZone).toISOString();
  const endDateTime = zonedTimeToUtc(endOfWeek(now), timeZone).toISOString();

  var response: PageCollection = await graphClient!
    .api('/me/calendarview')
    .header('Prefer', `outlook.timezone="${timeZone}"`)
    .query({ startDateTime: startDateTime, endDateTime: endDateTime })
    .select('subject,organizer,start,end')
    .orderby('start/dateTime')
    .top(25)
    .get();

  if (response["@odata.nextLink"]) {
    var events: Event[] = [];
    var options: GraphRequestOptions = {
      headers: { 'Prefer': `outlook.timezone="${timeZone}"` }
    };

    var pageIterator = new PageIterator(graphClient!, response, (event) => {
      events.push(event);
      return true;
    }, options);

    await pageIterator.iterate();

    return events;
  } else {

    return response.value;
  }
}

export async function UploadFileToDrive(authProvider: AuthCodeMSALBrowserAuthenticationProvider,
  parentId: any, file: any, fileName: any): Promise<Event> {
  ensureClient(authProvider);

  return await graphClient!.api(`/me/drive/items/${parentId}:/${fileName}:/content`).put(file);
}// done

export async function FetchDriveItems(authProvider: AuthCodeMSALBrowserAuthenticationProvider,
  itemId: any): Promise<Event> {
  ensureClient(authProvider);

  return await graphClient!.api(`/me/drive/items/${itemId}/content`).get();
}// done

export async function createEvent(authProvider: AuthCodeMSALBrowserAuthenticationProvider,
  newEvent: Event): Promise<Event> {
  ensureClient(authProvider);

  return await graphClient!
    .api('/me/events')
    .post(newEvent);
}// done
export async function getEmails(authProvider: AuthCodeMSALBrowserAuthenticationProvider): Promise<Message[]> {
  ensureClient(authProvider);
  var messages = await graphClient!.api('/me/messages')
    .top(25)
    .get();
  return messages.value
}
// done
export async function getEmailList(authProvider: AuthCodeMSALBrowserAuthenticationProvider): Promise<Message[]> {
  ensureClient(authProvider);
  var messages = await graphClient!.api('/me/messages')
    .select('from,subject,receivedDateTime,id')
    .top(25)
    .get();
  return messages.value
}

export async function getEmailById(authProvider: AuthCodeMSALBrowserAuthenticationProvider, id: string): Promise<Message[]> {
  ensureClient(authProvider);
  var email = await graphClient!.api(`/me/messages/${id}`)
    .get();
  return email
}
export async function getEmailById2(authProvider: AuthCodeMSALBrowserAuthenticationProvider, id: string): Promise<Message[]> {
  ensureClient(authProvider);
  var email = await graphClient!.api(`/me/messages/${id}`)
    .header('Prefer', 'outlook.body-content-type="text"')
    .select('subject,body,bodyPreview,uniqueBody')
    .get();
  return email.value
}


export async function getFolders(
  authProvider: AuthCodeMSALBrowserAuthenticationProvider,
  folderName: any
): Promise<Message[]> {
  ensureClient(authProvider);
  var email = await graphClient!.api(`/me/mailFolders`).get();
  return email;
}
export async function getSent(
  authProvider: AuthCodeMSALBrowserAuthenticationProvider
): Promise<Message[]> {
  ensureClient(authProvider);
  var email = await graphClient!.api(`/me/mailFolders/outbox/messages`).get();
  return email;
}
export async function getTrash(
  authProvider: AuthCodeMSALBrowserAuthenticationProvider
): Promise<Message[]> {
  ensureClient(authProvider);
  var email = await graphClient!
    .api(`/me/mailFolders/deleteditems/messages`)
    .get();
  return email;
}
export async function getTrashList(
  authProvider: AuthCodeMSALBrowserAuthenticationProvider
): Promise<Message[]> {
  ensureClient(authProvider);
  var email = await graphClient!
    .api(`/me/mailFolders/deleteditems/messages`)
    .get();
  return email;
}
export async function getJunk(
  authProvider: AuthCodeMSALBrowserAuthenticationProvider
) {
  ensureClient(authProvider);
  var email = await graphClient!
    .api(`/me/mailFolders/junkemail`)
    .get();
  return email;
}
export async function getJunkList(
  authProvider: AuthCodeMSALBrowserAuthenticationProvider
): Promise<Message[]> {
  ensureClient(authProvider);
  var email = await graphClient!.api(`/me/mailFolders/junkemail/messages`).get();
  return email;
}
export async function getInbox(authProvider: AuthCodeMSALBrowserAuthenticationProvider
): Promise<Message[]> {
  ensureClient(authProvider);
  let messages = await graphClient!.api('/me/mailFolders/inbox')
    .get();
  return messages
}
export async function getInboxList(
  authProvider: AuthCodeMSALBrowserAuthenticationProvider
): Promise<Message[]> {
  ensureClient(authProvider);
  var email = await graphClient!.api(`/me/mailFolders/inbox/messages`).get();
  return email;
}
export async function getDrafts(
  authProvider: AuthCodeMSALBrowserAuthenticationProvider
) {
  ensureClient(authProvider);
  var email = await graphClient!.api(`/me/mailFolders/drafts`).get();
  return email;
}
export async function getDraftsList(
  authProvider: AuthCodeMSALBrowserAuthenticationProvider
): Promise<Message[]> {
  ensureClient(authProvider);
  var email = await graphClient!.api(`/me/mailFolders/drafts/messages`).get();
  return email;
}
export async function MoveEmail(
  authProvider: AuthCodeMSALBrowserAuthenticationProvider, id: String
): Promise<Message[]> {
  ensureClient(authProvider);
  var email = await graphClient!.api(`/me/messages/${id}/move`).get();
  return email;
}
export async function getList(
  authProvider: AuthCodeMSALBrowserAuthenticationProvider,
  folderName: any
) {
  ensureClient(authProvider);
  var email = await graphClient!
    .api(`/me/MailFolders/${folderName}/messages`)
    .top(50)
    .get();
  return email;
}
export async function testInbox(
  authProvider: AuthCodeMSALBrowserAuthenticationProvider,
) {
  ensureClient(authProvider);
  var email = await graphClient!
    .api(`/me/MailFolders/inbox/messages`)
    .filter("isRead ne true")
    .top(50)
    .get();
  return email;
}
export async function getTestInbox(
  authProvider: AuthCodeMSALBrowserAuthenticationProvider,
) {
  ensureClient(authProvider);
  var email = await graphClient!
    .api(`/me/MailFolders/inbox/messages`)
    .filter("isRead ne true")
    .get();
  return email;
}

export async function getAllFolders(
  authProvider: AuthCodeMSALBrowserAuthenticationProvider,

) {
  ensureClient(authProvider);
  var email = await graphClient!
    .api(`/me/mailFolders/?includeHiddenFolders=true`)
    .get();
  return email;
}
export async function deleteMessage(
  authProvider: AuthCodeMSALBrowserAuthenticationProvider,
  id: any
) {
  ensureClient(authProvider);
  var email = await graphClient!.api(`/me/messages/${id}`).delete();
  return email;
}
export async function createMailFolder(
  authProvider: AuthCodeMSALBrowserAuthenticationProvider,
  displayName: any
) {
  ensureClient(authProvider);
  const mailFolder = {
    displayName: displayName,
    isHidden: false,
  };

  var email = await graphClient!.api("/me/mailFolders").post(mailFolder);

  return email;
}
export async function messageRead(
  authProvider: AuthCodeMSALBrowserAuthenticationProvider,
  id: any
) {
  ensureClient(authProvider);
  const message = {
    isRead: true,
  };
  var email = await graphClient!.api(`/me/messages/${id}`).update(message);;

  return email;
}
export async function messageUnRead(
  authProvider: AuthCodeMSALBrowserAuthenticationProvider,
  id: any
) {
  ensureClient(authProvider);
  const message = {
    isRead: false,
  };
  var email = await graphClient!.api(`/me/messages/${id}`).update(message);

  return email;
}
export async function messageDone(
  authProvider: AuthCodeMSALBrowserAuthenticationProvider,
  id: any
) {
  ensureClient(authProvider);
  const message = {
    destinationId: "deleteditems",
  };
  var email = await graphClient!.api(`/me/messages/${id}/move`).update(message);
  return email;
}
// need to test
export async function replyMessage(
  authProvider: AuthCodeMSALBrowserAuthenticationProvider,
  id: any,
  toAddresses: string[],
  toNames: string[],
  body: string,
) {
  ensureClient(authProvider);


  const toRecipients = toAddresses.map((address, index) => ({
    emailAddress: {
      address: address,
      name: toNames[index] || '',
    },
  }));

  const reply = {
    message: {
      toRecipients: toRecipients,
    },
    comment: body,
  };

  try {
    const email = await graphClient!
      .api(`/me/messages/${id}/reply`)
      .post(reply);
    return email;
  } catch (error) {
    console.error('Error replying to message:', error);
    throw error;
  }
}
// need to test
export async function replyAllEmail(
  authProvider: AuthCodeMSALBrowserAuthenticationProvider,
  id: any,
  body: any
) {
  ensureClient(authProvider);
  const replyAll = {
    comment: body
  };
  var email = await graphClient!.api(`/me/messages/${id}/replyAll`)
    .post(replyAll);
  return email;
}
// need to test
export async function createtestFolder(
  authProvider: AuthCodeMSALBrowserAuthenticationProvider,
  id: any
) {
  ensureClient(authProvider);
  const mailFolder = {
    "@odata.type": "microsoft.graph.mailSearchFolder",
    displayName: "getdone",

    includeNestedFolders: true,
    sourceFolderIds: [id],
    filterQuery: "contains(isRead, false)",
  };
  var email = await graphClient!
    .api(`/me/mailFolders/${id}/childFolders`)
    .post(mailFolder);
  return email;
}
// need to test
export async function gettestFolderList(
  authProvider: AuthCodeMSALBrowserAuthenticationProvider,
  id: any
) {
  ensureClient(authProvider);
  var email = await graphClient!.api(`/me/mailFolders/${id}/messages`).get();
  return email;
}
export async function forwardEmail(
  authProvider: AuthCodeMSALBrowserAuthenticationProvider,
  id: any,
  body: any,
  toAddress: any,

) {
  ensureClient(authProvider);
  const forward = {
    comment: body,
    toRecipients: [
      {
        emailAddress: {
          name: '',
          address: toAddress
        }
      }
    ]
  };
  var email = await graphClient!.api(`/me/messages/${id}/forward`)
    .post(forward);
  return email;
}
export async function listAttachment(
  authProvider: AuthCodeMSALBrowserAuthenticationProvider,
  id: any,
) {
  ensureClient(authProvider);

  var email = await graphClient!.api(`/me/messages/${id}/attachments`)
    .get();
  return email;
}
export async function ComposeEmail(
  authProvider: AuthCodeMSALBrowserAuthenticationProvider,
  subject: any,
  body: any,
  to: any,
) {
  ensureClient(authProvider);
  const message = {
    subject: subject,
    importance: 'Low',
    body: {
      contentType: 'HTML',
      content: body,
    },
    toRecipients: [
      {
        emailAddress: {
          address: to
        }
      }
    ]
  };
  var email = await graphClient!.api("/me/messages").post(message);
  return email;
}

export async function createReplyDraft(
  authProvider: AuthCodeMSALBrowserAuthenticationProvider, id: String
) {
  ensureClient(authProvider);
  var email = await graphClient!
    .api(`/me/message/${id}/createReply`)
    .post();
  return email;
}
