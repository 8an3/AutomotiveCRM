import React, { useCallback, useEffect, useRef, useState } from "react";
import { Tabs, TabsList, TabsTrigger, Input, Button, ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger, Dialog as Dialog1, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger, Accordion, AccordionItem, AccordionTrigger, AccordionContent, Label } from "~/components"
import ProvideAppContext, { useAppContext } from '~/components/microsoft/AppContext';
import { json } from '@remix-run/node'
import { useMsal } from '@azure/msal-react';
import { testInbox } from "~/components/microsoft/GraphService";

export default async function Handler() {
  const app = useAppContext(); // Access app context if needed
  const [emails, setEmails] = useState([]);
  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const response = await testInbox(app.authProvider!);
        setEmails(response);
        console.log(response, 'response')
      } catch (error) {
        console.error('Error fetching emails:', error);
      }
    }
    fetchEmails();
  }, []);

  // Assuming testInbox is an async function that returns email data
  console.log(emails, 'emails')
  return emails
}
/**export default function Client() {
  const app = useAppContext();

  const [emails, setEmails] = useState([]);
  const fetchEmails = async () => {
    try {
      const response = await testInbox(app.authProvider!);
        setEmails(response.value);
      console.log(emails)

    } catch (error) {
      console.error('Error fetching emails:', error);
    }
  }
  fetchEmails();

  return emails
} */
