import { Mail } from '~/components/email/mail'
import {
  deleteMessage,
  getDrafts,
  getDraftsList,
  getInbox,
  getInboxList,
  getJunk,
  getList,
  getSent,
  getTrash,
  messageRead,
  messageUnRead,
  getUser,
  testInbox,
  getFolders,
  getAllFolders,
  getEmailById,
  MoveEmail,
  createReplyDraft,
  ComposeEmail,
  SendNewEmail,
} from "~/components/microsoft/GraphService";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { json, type LoaderFunction, type ActionFunction, redirect, LoaderArgs } from '@remix-run/node';
import financeFormSchema from '~/overviewUtils/financeFormSchema';
import { collapsedCookie, layoutCookie } from '~/components/dev/mail/cookies.server';
import { useLoaderData } from "@remix-run/react";

export const loader = async ({ request }: LoaderArgs) => {
  const cookieHeader = request.headers.get("Cookie");
  const layout = (await layoutCookie.parse(cookieHeader)) || [33, 67];
  const collapsed = (await collapsedCookie.parse(cookieHeader)) || false;
  return json({ layout, collapsed });
}



export default function MainClient() {
  const { layout: layoutCookie, collapsed: collapsedCookie } = useLoaderData()

  const layout = layoutCookie
  const collapsed = collapsedCookie

  const defaultLayout = layout
  const defaultCollapsed = collapsed

  return (
    <div className='border border-border rounded-md'>
      <Mail
        // accounts={accounts}
        // app={app}
        // setEmails={setEmails}
        //  mails={emails}
        defaultLayout={defaultLayout}
        defaultCollapsed={defaultCollapsed}
      //  navCollapsedSize={4}
      />
    </div>
  )
}
