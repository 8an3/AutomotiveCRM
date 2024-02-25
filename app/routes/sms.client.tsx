import React from "react";
import { getSession } from '../sessions/auth-session.server';
import { prisma } from "../libs";
import { model } from "../models";
import { json, redirect } from "@remix-run/node";
import ChatApp from "../components/sms/ChatApp";


export const loader = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")

  const user = await model.user.query.getForSession({ email: email });
  /// console.log(user, account, 'wquiote loadert')
  const notifications = await prisma.notificationsUser.findMany({
    where: {
      userId: user.id,
    }
  })
  const notificationsNewLead = await prisma.notificationsUser.findMany({
    where: {
      type: 'New Lead',
    }
  })
  if (!user) {
    redirect('/login')
  }
  return json({ user, notifications, notificationsNewLead });
}

export default function SMSClient() {

  return (
    <ChatApp />

  )
}
/** <div className="bg-black border border-[#3b3b3b] mt-[60px]">
      <div className="w-[30%] border !border-[#3b3b3b]" >

      </div>
      <div className="w-[70%] border !border-[#3b3b3b]">

      </div>
    </div> */
