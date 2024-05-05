import { useMsal } from "@azure/msal-react";
import { useAppContext } from "~/components/microsoft/AppContext";
import { useEffect, useState } from "react";
import { getInboxList, getInbox } from "~/components/microsoft/GraphService";
import { redirect } from "@remix-run/node";


export default function Root() {
  const app = useAppContext();
  const { instance } = useMsal();
  const activeAccount = instance.getActiveAccount();
  const [inbox, setInbox] = useState()
  const [emails, setEmails] = useState();

  useEffect(() => {
    const fetchUnreadCount = async () => {

      const messages = await getInbox(app.authProvider!);
      setInbox(messages)
      const unreadCount = await getInboxList(app.authProvider!);
      setEmails(unreadCount);
      window.localStorage.setItem("emailCount", String(inbox));
      window.localStorage.setItem("emails", String(emails));
      window.localStorage.setItem("idToken", String(activeAccount?.idToken));
    }
    fetchUnreadCount()
  }, [app.authProvider, emails, inbox]);
  return null
}
