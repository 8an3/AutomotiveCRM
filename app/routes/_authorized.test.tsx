import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "~/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger, } from "~/components/ui/tabs"
import { Form, useActionData, useFetcher, useLoaderData, useNavigation, Outlet } from '@remix-run/react'
import { json, redirect, type ActionFunction, type DataFunctionArgstype, type MetaFunction, type LoaderFunction, } from '@remix-run/node'
import { getSession, commitSession, destroySession } from '../sessions/auth-session.server'
import { model } from "~/models";
import { GetUser } from "~/utils/loader.server";
import { prisma } from "~/libs";
import { RemixNavLink, } from "~/components"
import { Separator, Button, Input, Label, Switch, Checkbox } from '~/components/ui/index'
import { getUserIsAllowed } from "~/helpers";
import { useState } from "react"



export async function loader({ request, params }: LoaderFunction) {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")
  const user = await GetUser(email)

  if (!user) { redirect('/login') }
  if (!user) { return json({ status: 302, redirect: '/login' }); };
  const finance = await prisma.finance.findFirst({ where: { userEmail: user.email } })
  const clientfile = await prisma.clientfile.findFirst({ where: { userId: user.id } })
  const data = await prisma.notificationsUser.create({
    data: {
      title: 'Welcome new user! NEW LEAD',
      content: 'Welcome new user! NEW LEAD',
      read: 'false',
      dimiss: '',
      type: 'New Lead',
      financeId: finance.id,
      clientfileId: clientfile.id,
      to: '',
      from: '',
      userId: user?.id,
    }
  })
  const data2 = await prisma.notificationsUser.create({
    data: {
      title: 'Welcome new user! MESSAGES',
      content: 'Welcome new user! MESSAGES',
      read: 'false',
      dimiss: '',
      type: 'messages',
      financeId: finance.id,
      clientfileId: clientfile.id,
      to: '',
      from: '',
      userId: user?.id,
    }
  })
  const data3 = await prisma.notificationsUser.create({
    data: {
      title: 'Welcome new user! UPDATES',
      content: 'Welcome new user! UPDATES',
      read: 'false',
      dimiss: '',
      type: 'updates',
      financeId: finance.id,
      clientfileId: clientfile.id,
      to: '',
      from: '',
      userId: user?.id,
    }
  })
  const data4 = await prisma.notificationsUser.create({
    data: {
      title: 'Welcome new user! EMAIL',
      content: 'Welcome new user! EMAIL',
      read: 'false',
      dimiss: '',
      type: 'email',
      financeId: finance.id,
      clientfileId: clientfile.id,
      to: '',
      from: '',
      userId: user?.id,
    }
  })
  const startDate = new Date();
  const oneDayFromNow = new Date(startDate);
  oneDayFromNow.setDate(startDate.getDate() + 1);
  const ClientApts = await prisma.clientApts.create({
    data: {
      financeId: finance.id,
      title: 'test',
      start: String(oneDayFromNow),
      contactMethod: 'sms',
      apptStatus: '',
      apptType: '1',
      note: 'test',
      unit: 'Nightster - Vivid Black - RH975',
      brand: 'Harley-Davidson',
      firstName: 'Skyler',
      lastName: 'Zanth',
      email: 'SkylerZanth@gmail.com',
      phone: '+16138980992',
      address: '123 road st',
      userId: user.id,
      description: 'call customer',
      userName: user.username,
    }
  })
  return json({ data, data2, data3, data4, ClientApts })
}



export default function Mainbody() {
  const { data, data2, data3, data4, ClientApts } = useLoaderData()

  return (
    <>
      <p> {data}{data2}{data3}{data4}{ClientApts} </p>
    </>
  )
}

