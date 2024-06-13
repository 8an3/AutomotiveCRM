import React, { useCallback, useEffect, useRef, useState } from "react";
import ProvideAppContext, { useAppContext, } from "~/components/microsoft/AppContext";
import { deleteMessage, getDrafts, getDraftsList, getInbox, getInboxList, getJunk, getList, getSent, getTrash, messageRead, messageUnRead, getUser, testInbox, getFolders, getAllFolders, getEmailById, MoveEmail, createReplyDraft, ComposeEmail, SendNewEmail, } from "~/components/microsoft/GraphService";
import { useMsal } from "@azure/msal-react";
import useSWR, { SWRConfig, mutate, useSWRConfig } from 'swr';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "~/components/ui/command"
import { Button } from "~/components/ui";



export default async function DashboardClient() {

  const app = useAppContext();

  const { instance } = useMsal();
  const activeAccount = instance.getActiveAccount();
  const email = String(activeAccount?.username);
  const user = getUser(app.authProvider!);
  const dataFetcher = await testInbox(app.authProvider!);
  const { data, } = useSWR(dataFetcher, { refreshInterval: 180000 });
  const [emails, setEmails] = useState();
  useEffect(() => {
    if (data) {
      setEmails(data)
    }
  }, [data]);

  /** useEffect(() => {
     const fetchEmails = async () => {
       try {
         const response = await testInbox(app.authProvider!);
         console.log(response, ',response')
         setEmails(response.value);
       } catch (error) {
         console.error("Error fetching emails:", error);
       }
     };
     fetchEmails();
 
   }, []); */
  const options = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  };

  const [selectedEmail, setSelectedEmail] = useState();
  const [to, setTo] = useState("");
  const [cc, setCC] = useState([]);
  const [bcc, setBcc] = useState([]);
  const [reply, setReply] = useState(false);
  const [openReply, setOpenReply] = useState(false);


  const handleEmailClick = async (email) => {
    if (email && email.id) {
      messageRead(app.authProvider!, email.id);
      const emailMessage = await getEmailById(app.authProvider!, email.id);
      setSelectedEmail(emailMessage);
      setTo(email.sender.emailAddress.address);
      if (email.ccRecipients) {
        setCC(email.ccRecipients);
      }
      if (email.bccRecipients) {
        setBcc(email.bccRecipients);
      }
      setReply(false);
      setOpenReply(true);
      const messageId = email.id;
    } else {
      console.error("Email object or its id is undefined:", email);
    }
  };

  return (
    <>
      <div>
        <Command className="rounded-lg border shadow-md bg-background border-border text-foreground">
          <CommandInput className='bg-background border-border text-foreground' placeholder="Type a command or search..." />
          <CommandList>
            <CommandGroup heading="Emails">
              {emails && emails.map((appointment) => {
                const recDate = new Date(appointment.receivedDateTime)

                const receivedDate = recDate.toLocaleDateString('en-US', options)
                return (
                  <div key={appointment.id} onClick={() => { handleEmailClick(appointment); }}                >
                    <Button type='submit' variant='ghost' className='text-left mb-2' >
                      <h3>{appointment.subject ? appointment.subject.split(" ").slice(0, 12).join(" ") +
                        "..."
                        : ""}</h3>
                      <ul className="grid gap-3 text-sm mt-2">
                        <li className="grid grid-cols-1 items-center ">
                          <span>{appointment.from.emailAddress.name}</span>
                          <span className="text-muted-foreground text-xs">
                            {receivedDate}
                          </span>
                        </li>
                      </ul>
                    </Button>
                  </div>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </div>

    </>
  )
}
