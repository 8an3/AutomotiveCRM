import { useMsal } from "@azure/msal-react";
import { useNavigate } from "@remix-run/react";

export default async function CallMsGraph() {
  const { instance, accounts, inProgress } = useMsal();

  const account = instance.getActiveAccount();
  if (!account) {
    throw Error("No active account! Verify a user has been signed in and setActiveAccount has been called.");
  }

  const response = await instance.acquireTokenSilent({
    ...loginRequest,
    account: account
  });

  const jsontoken = JSON.stringify(response.accessToken)
  window.localStorage.setItem("remix-stutter-66-3145", jsontoken);
  let senderResponse: any = []
  let toRecipientsResponse: any = []
  if (response.accessToken) {
    const accessToken = response.accessToken;
    //const emailAddress = parsecusta.email
    const sender = `https://graph.microsoft.com/v1.0/me/messages?$select=sender,subject,toRecipients,receivedDateTime&$filter=sender/emailAddress/address eq 'skylerzanth@gmail.com'`;

    const toRecipients = `https://graph.microsoft.com/v1.0/me/messages?$select=sender,subject,toRecipients,receivedDateTime&$filter=sender/emailAddress/address eq 'skylerzanth@gmail.com'`

    fetch(sender, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (!response.ok) { throw new Error(`HTTP error! Status: ${response.status}`); }
        return response.json();
      })
      .then(data => {
        console.log(data, 'msghraphapical.l')
        console.log('Messages:', data);
        senderResponse = data.value
      })
      .catch(error => { console.error('Error fetching messages:', error); });

    fetch(toRecipients, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log(data, 'msghraphapical.2')
        console.log('Messages:', data);
        toRecipientsResponse = data.value
      })
      .catch(error => {
        console.error('Error fetching messages:', error);
      });
  }
  const combinedArray = [...senderResponse, ...toRecipientsResponse];
  return combinedArray

}



export const loginRequest = {
  scopes: [
    'User.Read',
    'Mail.ReadWrite',
    'Mail.send',
    'email',
    'openid',
    'profile',
    "Calendars.ReadWrite",
    "Notes.ReadWrite.All",
    "Calendars.ReadWrite.Shared",
    "Contacts.ReadWrite",
    "Contacts.ReadWrite.Shared",
    "Files.ReadWrite.All",
    "Files.ReadWrite.AppFolder",
    "Files.ReadWrite.Selected",
    "Mail.ReadWrite.Shared",
    "Mail.Send.Shared",
    "Mail.Send",
    "Mail.ReadWrite",
    "MailboxSettings.ReadWrite",
    "Notes.Create",
    "Notes.ReadWrite.All",
    "Schedule.ReadWrite.All",
    "Tasks.ReadWrite.Shared",
    "User.Read",
    "User.ReadWrite.All",
    "User.ReadWrite",
  ],
};

export const graphConfig = {
  graphMeEndpoint: "https://graph.microsoft.com/v1.0/me",
};
/** const getToken = await instance.acquireTokenSilent({
    scopes: [
      'User.Read',
      'Mail.ReadWrite',
      'Mail.send',
      'email',
      'openid',
      'profile',
      "Calendars.ReadWrite",
      "Notes.ReadWrite.All",
      "Calendars.ReadWrite.Shared",
      "Contacts.ReadWrite",
      "Contacts.ReadWrite.Shared",
      "Files.ReadWrite.All",
      "Files.ReadWrite.AppFolder",
      "Files.ReadWrite.Selected",
      "Mail.ReadWrite.Shared",
      "Mail.Send.Shared",
      "Mail.Send",
      "Mail.ReadWrite",
      "MailboxSettings.ReadWrite",
      "Notes.Create",
      "Notes.ReadWrite.All",
      "Schedule.ReadWrite.All",
      "Tasks.ReadWrite.Shared",
      "User.Read",
      "User.ReadWrite.All",
      "User.ReadWrite",
    ],
  }); */

/**  const headers = new Headers();
const bearer = `Bearer ${response.accessToken}`;

headers.append("Authorization", bearer);

const options = {
  method: "GET",
  headers: headers
};

const graphcall = fetch(graphConfig.graphMeEndpoint, options)
  .then(response => response.json())
  .catch(error => console.log(error));

console.log(graphcall)

const navigate = useNavigate()
const goto = navigate('/dealer/features/email/emailClient')
return goto */
