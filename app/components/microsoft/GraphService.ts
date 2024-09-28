import { Client, type GraphRequestOptions, type PageCollection, PageIterator, type ClientOptions } from '@microsoft/microsoft-graph-client';
import { type AuthCodeMSALBrowserAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/authCodeMsalBrowser';
import { endOfWeek, startOfWeek } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';
import type { User, Event, Message } from '@microsoft/microsoft-graph-types';
import { prisma } from '~/libs';
import { useRootLoaderData } from '~/hooks';

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
}
export async function FetchDriveItems(authProvider: AuthCodeMSALBrowserAuthenticationProvider,
  itemId: any): Promise<Event> {
  ensureClient(authProvider);

  return await graphClient!.api(`/me/drive/items/${itemId}/content`).get();
}
export async function createEvent(authProvider: AuthCodeMSALBrowserAuthenticationProvider,
  newEvent: Event): Promise<Event> {
  ensureClient(authProvider);

  return await graphClient!
    .api('/me/events')
    .post(newEvent);
}
export async function getEmails(authProvider: AuthCodeMSALBrowserAuthenticationProvider): Promise<Message[]> {
  ensureClient(authProvider);
  var messages = await graphClient!.api('/me/messages')
    .top(25)
    .get();
  return messages.value
}
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
    .api(`/me/mailFolders/${folderName}/messages`)

    .get();
  return email;
}
export async function getCount(
  authProvider: AuthCodeMSALBrowserAuthenticationProvider,
  folderName: any
) {
  ensureClient(authProvider);
  var email = await graphClient!
    .api(`/me/mailFolders/${folderName}/messages`)

    .get();
  return email;
}
export async function testInbox(
  authProvider: AuthCodeMSALBrowserAuthenticationProvider,
) {
  ensureClient(authProvider);
  var email = await graphClient!
    .api(`/me/messages`)
    .top(75)
    .get();
  return email;
}
export async function searchEmail(
  authProvider: AuthCodeMSALBrowserAuthenticationProvider,
  emailToSearch: string
) {
  ensureClient(authProvider);

  var email = await graphClient!
    .api(`/me/messages`)
    .filter(
      `(sender/emailAddress/address eq '${emailToSearch}' or toRecipients/any(r: r/emailAddress/address eq '${emailToSearch}'))`
    )
    .select('sender,subject,toRecipients')
    .top(2)
    .get();
  console.log(email, 'email in searchemail')

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
    .api(`/me/mailFolders`)
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
export async function setFolder(
  authProvider: AuthCodeMSALBrowserAuthenticationProvider,
  id: any,
  folder: any
) {
  ensureClient(authProvider);
  const message = {
    destinationId: folder,
  };
  var email = await graphClient!.api(`/me/messages/${id}/move`)
    .post(message);

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
  subject: string
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
    isDeliveryReceiptRequested: true,
    subject: subject,
  };

  try {
    const email = await graphClient!
      .api(`/me/messages/${id}/reply`)
      .post(reply);
    const to = toAddresses
    await SaveComs(to, body, subject)

    return email;
  } catch (error) {
    console.error('Error replying to message:', error);
    throw error;
  }
}

export async function replyMessageMultiToo(
  authProvider: AuthCodeMSALBrowserAuthenticationProvider,
  id: any,
  toAddresses: string[],
  toNames: string[],
  body: string,
  subject: string
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
    isDeliveryReceiptRequested: true,
    subject: subject,
  };

  try {
    const email = await graphClient!
      .api(`/me/messages/${id}/reply`)
      .post(reply);
    const to = toAddresses
    await SaveComs(to, body, subject)

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
  body: any,
  subject: string,
  to: string,
) {
  ensureClient(authProvider);
  const replyAll = {
    comment: body,
    isDeliveryReceiptRequested: true,
    subject: subject,
  };
  var email = await graphClient!.api(`/me/messages/${id}/replyAll`)
    .post(replyAll);
  await SaveComs(to, body, subject)

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
  subject: string,
  toName: any,
) {
  ensureClient(authProvider);
  const forward = {
    comment: body,
    toRecipients: [
      {
        emailAddress: {
          name: toName,
          address: toAddress
        }
      }
    ],
    isDeliveryReceiptRequested: true,
    subject: subject,
  };
  var email = await graphClient!.api(`/me/messages/${id}/forward`)
    .post(forward);
  const to = toAddress
  await SaveComs(to, body, subject)

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
export async function getAttachment(
  authProvider: AuthCodeMSALBrowserAuthenticationProvider,
  id: any,
  attachId: any
) {
  ensureClient(authProvider);

  var email = await graphClient!.api(`/me/messages/${id}/attachments/${attachId}`)
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
  var email = await graphClient!.api("/me/sendMail").post(message);
  await SaveComs(to, body, subject)

  return email;
}
export async function createReplyDraft(
  authProvider: AuthCodeMSALBrowserAuthenticationProvider, id: String
) {
  ensureClient(authProvider);
  var email = await graphClient!
    .api(`/me/message/${id}/createReply`)
    .post();
  await SaveComs(to, body, subject)

  return email;
}
export async function SendNewEmail(
  authProvider: AuthCodeMSALBrowserAuthenticationProvider,
  subject: any,
  body: any,
  to: any,
  cc: any[],
  bcc: any[],
) {
  ensureClient(authProvider);

  const sendMail = {
    message: {
      subject: subject,
      body: {
        contentType: 'HTML',
        content: body,
      },
      toRecipients: to.map((recipient: string) => ({
        emailAddress: {
          address: recipient,
        },
      })),
      ccRecipients: cc.map((recipient: string) => ({
        emailAddress: {
          address: recipient,
        },
      })),
      bccRecipients: bcc.map((recipient: string) => ({
        emailAddress: {
          address: recipient,
        },
      })),
    },
    saveToSentItems: false, // Boolean value should not be a string
  };

  try {
    const email = await graphClient!.api("/me/sendMail")
      .post(sendMail);
    await SaveComs(to, body, subject)

    return email;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}
export async function ComposeEmailDashboardEmailClient(
  authProvider: AuthCodeMSALBrowserAuthenticationProvider,
  subject: any,
  body: any,
  to: any,
) {
  ensureClient(authProvider);
  console.log(subject, to, body, ' emails tff')
  const sendMail = {
    message: {
      subject: subject,
      body: {
        contentType: 'HTML',
        content: body
      },
      toRecipients: [
        {
          emailAddress: {
            address: to
          }
        }
      ]
    },
    saveToSentItems: 'false'
  };
  const email = await graphClient!.api('/me/sendMail')
    .post(sendMail);
  await SaveComs(to, body, subject)


  return email
}
export async function ComposeEmailTwo(
  authProvider: AuthCodeMSALBrowserAuthenticationProvider,
  subject: any,
  body: any,
  to: any,
  name: any
) {
  ensureClient(authProvider);
  console.log(subject, to, body, ' emails tff')
  const sendMail = {
    message: {

      isReadReceiptRequested: true,
      subject: subject,
      body: {
        contentType: 'HTML',
        content: body
      },
      toRecipients: [
        {
          emailAddress: {
            address: to,
            name: name
          }
        }
      ]
    },
    saveToSentItems: 'false'
  };
  console.log(sendMail, 'email1')

  const email = await graphClient!.api('/me/sendMail')
    .post(sendMail);

  // await SaveComs(to, body, subject)
  console.log(email, 'email2')
  return email;
}

export async function MassEmail(
  authProvider,
  subject,
  body,
  to
) {
  ensureClient(authProvider);

  for (const customer of to) {
    console.log(customer.email, 'inside maxx email')
    const sendMail = {
      message: {
        subject: subject,
        body: {
          contentType: 'HTML',
          content: body
        },
        toRecipients: [
          {
            emailAddress: {
              address: customer.email
            }
          }
        ]
      },
      saveToSentItems: 'false'
    };
    console.log(sendMail, 'email1');

    const email = await graphClient!.api('/me/sendMail')
      .post(sendMail);

    console.log(email, 'email2');
  }

  // Optional: If you want to return the status of all emails
  return 'All emails sent';
}

// this one works
export async function UploadFile(authProvider, fileName, fileContent) {
  await ensureClient(authProvider);

  const uploadSession = await graphClient!.api(`/me/drive/root:/${fileName}:/createUploadSession`)
    .post({
      item: {
        "@microsoft.graph.conflictBehavior": "rename",
        name: fileName,
      },
    });

  const uploadUrl = uploadSession.uploadUrl;
  const fileSize = fileContent.size;
  const chunkSize = 320 * 1024; // 320 KB
  let start = 0;
  let end = chunkSize;
  let response = null;

  while (start < fileSize) {
    const chunk = fileContent.slice(start, end);
    response = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Range': `bytes ${start}-${end - 1}/${fileSize}`,
      },
      body: chunk,
    });

    if (!response.ok) {
      throw new Error(`Failed to upload chunk: ${response.statusText}`);
    }

    start = end;
    end = Math.min(end + chunkSize, fileSize);
  }

  return await response?.json();
}
export async function listFilesByFinanceId(authProvider, financeId) {
  await ensureClient(authProvider);

  const query = `${financeId}-`;
  const response = await graphClient!.api('/me/drive/root/search(q=\'' + query + '\')')
    .get();

  return response.value;
}
export async function downloadFile(authProvider, fileId) {
  await ensureClient(authProvider);

  const response = await graphClient!.api(`/me/drive/items/${fileId}/content`)
    .get();

  // Create a blob from the response
  const blob = new Blob([response], { type: response.type });

  // Create a link element, set its href to the blob URL, and trigger the download
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = response.headers.get('Content-Disposition').split('filename=')[1];
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
export async function deleteFile(authProvider, fileId) {
  await ensureClient(authProvider);

  try {
    await graphClient!.api(`/me/drive/items/${fileId}`)
      .delete();

    return { success: true };
  } catch (error) {
    console.error('Error deleting file:', error);
    return { success: false, error: error.message };
  }
}
async function SaveComs(to, body, subject) {
  const { user } = useRootLoaderData()
  const finance = await prisma.finance.findFirst({ where: { email: to } })
  await prisma.comm.create({
    data: {
      financeId: finance.id,
      body: body,
      userName: user?.name,
      type: 'Email',
      customerEmail: to,
      direction: 'Outgoing',
      subject: subject,
      result: 'Attempted',
      userEmail: user?.email,
      dept: 'Sales',
    }
  })
}


/**import { Client, type GraphRequestOptions, type PageCollection, PageIterator, type ClientOptions } from '@microsoft/microsoft-graph-client';
import { type AuthCodeMSALBrowserAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/authCodeMsalBrowser';
import { endOfWeek, startOfWeek } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';
import type { User, Event, Message } from '@microsoft/microsoft-graph-types';
import { prisma } from '~/libs';
import { useRootLoaderData } from '~/hooks';

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
}
export async function FetchDriveItems(authProvider: AuthCodeMSALBrowserAuthenticationProvider,
  itemId: any): Promise<Event> {
  ensureClient(authProvider);

  return await graphClient!.api(`/me/drive/items/${itemId}/content`).get();
}
export async function createEvent(authProvider: AuthCodeMSALBrowserAuthenticationProvider,
  newEvent: Event): Promise<Event> {
  ensureClient(authProvider);

  return await graphClient!
    .api('/me/events')
    .post(newEvent);
}
export async function getEmails(authProvider: AuthCodeMSALBrowserAuthenticationProvider): Promise<Message[]> {
  ensureClient(authProvider);
  var messages = await graphClient!.api('/me/messages')
    .top(25)
    .get();
  return messages.value
}
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
    await SaveComs(to, body, subject)

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
  await SaveComs(to, body, subject)

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
  await SaveComs(to, body, subject)

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
  var email = await graphClient!.api("/me/sendMail").post(message);
  await SaveComs(to, body, subject)

  return email;
}
export async function createReplyDraft(
  authProvider: AuthCodeMSALBrowserAuthenticationProvider, id: String
) {
  ensureClient(authProvider);
  var email = await graphClient!
    .api(`/me/message/${id}/createReply`)
    .post();
  await SaveComs(to, body, subject)

  return email;
}
export async function SendNewEmail(
  authProvider: AuthCodeMSALBrowserAuthenticationProvider,
  subject: any,
  body: any,
  to: any,
  cc: any[],
  bcc: any[],
) {
  ensureClient(authProvider);

  const sendMail = {
    message: {
      subject: subject,
      body: {
        contentType: 'HTML',
        content: body,
      },
      toRecipients: to.map((recipient: string) => ({
        emailAddress: {
          address: recipient,
        },
      })),
      ccRecipients: cc.map((recipient: string) => ({
        emailAddress: {
          address: recipient,
        },
      })),
      bccRecipients: bcc.map((recipient: string) => ({
        emailAddress: {
          address: recipient,
        },
      })),
    },
    saveToSentItems: false, // Boolean value should not be a string
  };

  try {
    const email = await graphClient!.api("/me/sendMail")
      .post(sendMail);
    await SaveComs(to, body, subject)

    return email;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}
export async function ComposeEmailDashboardEmailClient(
  authProvider: AuthCodeMSALBrowserAuthenticationProvider,
  subject: any,
  body: any,
  to: any,
) {
  ensureClient(authProvider);
  console.log(subject, to, body, ' emails tff')
  const sendMail = {
    message: {
      subject: subject,
      body: {
        contentType: 'HTML',
        content: body
      },
      toRecipients: [
        {
          emailAddress: {
            address: to
          }
        }
      ]
    },
    saveToSentItems: 'false'
  };
  const email = await graphClient!.api('/me/sendMail')
    .post(sendMail);
  await SaveComs(to, body, subject)


  return email
}
export async function ComposeEmailTwo(
  authProvider: AuthCodeMSALBrowserAuthenticationProvider,
  subject: any,
  body: any,
  to: any,
) {
  ensureClient(authProvider);
  console.log(subject, to, body, ' emails tff')
  const sendMail = {
    message: {
      subject: subject,
      body: {
        contentType: 'HTML',
        content: body
      },
      toRecipients: [
        {
          emailAddress: {
            address: to
          }
        }
      ]
    },
    saveToSentItems: 'false'
  };
  console.log(sendMail, 'email1')

  const email = await graphClient!.api('/me/sendMail')
    .post(sendMail);

  // await SaveComs(to, body, subject)
  console.log(email, 'email2')
  return email;
}

export async function MassEmail(
  authProvider,
  subject,
  body,
  to
) {
  ensureClient(authProvider);

  for (const customer of to) {
    console.log(customer.email, 'inside maxx email')
    const sendMail = {
      message: {
        subject: subject,
        body: {
          contentType: 'HTML',
          content: body
        },
        toRecipients: [
          {
            emailAddress: {
              address: customer.email
            }
          }
        ]
      },
      saveToSentItems: 'false'
    };
    console.log(sendMail, 'email1');

    const email = await graphClient!.api('/me/sendMail')
      .post(sendMail);

    console.log(email, 'email2');
  }

  // Optional: If you want to return the status of all emails
  return 'All emails sent';
}

// this one works
export async function UploadFile(authProvider, fileName, fileContent) {
  await ensureClient(authProvider);

  const uploadSession = await graphClient!.api(`/me/drive/root:/${fileName}:/createUploadSession`)
    .post({
      item: {
        "@microsoft.graph.conflictBehavior": "rename",
        name: fileName,
      },
    });

  const uploadUrl = uploadSession.uploadUrl;
  const fileSize = fileContent.size;
  const chunkSize = 320 * 1024; // 320 KB
  let start = 0;
  let end = chunkSize;
  let response = null;

  while (start < fileSize) {
    const chunk = fileContent.slice(start, end);
    response = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Range': `bytes ${start}-${end - 1}/${fileSize}`,
      },
      body: chunk,
    });

    if (!response.ok) {
      throw new Error(`Failed to upload chunk: ${response.statusText}`);
    }

    start = end;
    end = Math.min(end + chunkSize, fileSize);
  }

  return await response?.json();
}
export async function listFilesByFinanceId(authProvider, financeId) {
  await ensureClient(authProvider);

  const query = `${financeId}-`;
  const response = await graphClient!.api('/me/drive/root/search(q=\'' + query + '\')')
    .get();

  return response.value;
}
export async function downloadFile(authProvider, fileId) {
  await ensureClient(authProvider);

  const response = await graphClient!.api(`/me/drive/items/${fileId}/content`)
    .get();

  // Create a blob from the response
  const blob = new Blob([response], { type: response.type });

  // Create a link element, set its href to the blob URL, and trigger the download
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = response.headers.get('Content-Disposition').split('filename=')[1];
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
export async function deleteFile(authProvider, fileId) {
  await ensureClient(authProvider);

  try {
    await graphClient!.api(`/me/drive/items/${fileId}`)
      .delete();

    return { success: true };
  } catch (error) {
    console.error('Error deleting file:', error);
    return { success: false, error: error.message };
  }
}
async function SaveComs(to, body, subject) {
  const { user } = useRootLoaderData()
  const finance = await prisma.finance.findFirst({ where: { email: to } })
  await prisma.previousComms.create({
    data: {
      financeId: finance.id,
      body: body,
      userName: user?.name,
      type: 'Email',
      customerEmail: to,
      direction: 'Outgoing',
      subject: subject,
      result: 'Attempted',
      userEmail: user?.email,
      dept: 'Sales',
    }
  })
}
*/
