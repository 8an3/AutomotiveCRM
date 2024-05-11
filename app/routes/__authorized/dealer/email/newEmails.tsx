import React, { useCallback, useEffect, useRef, useState } from "react";
import { Tabs, TabsList, TabsTrigger, Input, Button, ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger, Dialog as Dialog1, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger, Accordion, AccordionItem, AccordionTrigger, AccordionContent, Label } from "~/components"
import ProvideAppContext, { useAppContext } from '~/components/microsoft/AppContext';

import { useMsal } from '@azure/msal-react';


export default function Client() {
  const app = useAppContext();

  const [emails, setEmails] = useState();

  const [text, setText] = React.useState('');


  useEffect(() => {
    // fetch emails
    const fetchEmails = async () => {
      try {
        const folderName = 'inbox'
        const response = await testInbox(app.authProvider!);
        //  console.log(emails)
        setEmails(response.value);
      } catch (error) {
        console.error('Error fetching emails:', error);
      }
    }
    fetchEmails();

  }, []);

  return emails
}
