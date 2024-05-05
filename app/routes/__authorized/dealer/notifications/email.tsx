import { json, redirect, type LoaderArgs, type LoaderFunction } from "@remix-run/node";
import { useEffect, useState } from "react";

export default function EmailMessages() {
  const [inbox, setInbox] = useState()
  const [emails, setEmails] = useState();
  const [idToken, setIdToken] = useState();
  useEffect(() => {
    const fetchUnreadCount = async () => {
      const messages = window.localStorage.getItem("emails") || ""
      const unreadCount = window.localStorage.getItem("emailCount") || ""
      setInbox(messages)
      setEmails(unreadCount);
      const getidToken = window.localStorage.getItem("idToken");
      setIdToken(getidToken)
    }
    fetchUnreadCount()
  }, []);

  return ({ emails, inbox, idToken })
}
