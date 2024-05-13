import { json, redirect, type LoaderArgs, type LoaderFunction } from "@remix-run/node";
import { useEffect, useState } from "react";

export default function EmailMessages() {
  const [emails, setEmails] = useState();
  useEffect(() => {
    const fetchUnreadCount = async () => {
      const response = await fetch('/dealer/email/newEmails');
      const data = await response.json();
      console.log(data)
      if (data) {
        setEmails(data);
      }
    }
    fetchUnreadCount()
  }, []);

  return emails
}
