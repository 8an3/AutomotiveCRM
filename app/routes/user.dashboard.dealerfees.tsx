
import { useLoaderData, Form } from '@remix-run/react'
import { type MetaFunction, json, redirect, type ActionFunction, LoaderFunction, } from '@remix-run/node'
import financeFormSchema from './overviewUtils/financeFormSchema'
import { getDealerFeesbyEmail, updateDealerFees, updateUser } from '~/utils/user.server'
import * as Toast from '@radix-ui/react-toast';
import React from 'react';
import WelcomeDealerFeesSection from './welcome.dealerfees'
import { prisma } from "~/libs";
import { getSession } from '~/sessions/auth-session.server';
import { requireAuthCookie } from '~/utils/misc.user.server';

export const loader = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")

  const user = await model.user.query.getForSession({ email: email });
  /// console.log(user, account, 'wquiote loadert')
  if (!user) {
    redirect('/login')
  }
  console.log(user, 'email')
  const deFees = await getDealerFeesbyEmail(email)
  return json({ user, deFees });
}

export const action: ActionFunction = async ({ request }) => {
  const formPayload = Object.fromEntries(await request.formData())
  const Input = financeFormSchema.parse(formPayload)
  const fees = await updateDealerFees(Input)
  return (fees)
}

export const meta: MetaFunction = () => {
  return [
    { title: "Welcome - Dealer Fees - Dealer Sales Assistant" },
    {
      property: "og:title",
      content: "Your very own assistant!",
    },
    {
      name: "description",
      content: "To help sales people achieve more. Every automotive dealer needs help, especialy the sales staff. Dealer Sales Assistant will help you close more deals more efficiently.", keywords: 'Automotive Sales, dealership sales, automotive CRM',
    },
  ];
};

export default function Dealerfees() {
  const { deFees } = useLoaderData()
  let finance = ''
  let data = ''
  return (
    <>
      <WelcomeDealerFeesSection deFees={deFees} data={data} finance={deFees} />
    </>
  )
}
