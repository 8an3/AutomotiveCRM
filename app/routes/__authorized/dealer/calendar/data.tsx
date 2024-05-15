

import 'moment-timezone'

import { getAllFinanceAptsForCalendar, getSingleFinanceAppts } from '~/utils/financeAppts/get.server';
import { type ActionFunction, type DataFunctionArgs, json } from '@remix-run/node';

import { requireAuthCookie } from '~/utils/misc.user.server';
import { model } from "~/models";


import { prisma } from "~/libs";
import { getSession } from '~/sessions/auth-session.server';





export async function loader({ request }: DataFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")


  const user = await GetUser(email)
  /// console.log(user, account, 'wquiote loadert')
  if (!user) {
    redirect('/login')
  }
  if (!user) { return json({ status: 302, redirect: '/login' }); };
  const userId = user?.id
  const userEmail = user?.email
  const salesData = await getAllFinanceAptsForCalendar(userId)
  const quotes = salesData
  return json({ salesData, user, quotes })
}

export const action: ActionFunction = async ({ request, params }) => {
  const formPayload = Object.fromEntries(await request.formData());
  const userSession = await sessionGet(request.headers.get("Cookie"));

  if (!userSession) { return json({ status: 302, redirect: '/login' }); };

  if (!userSession) { return redirect('/login') }
  const email = userSession.get("email")
  const user = await getUserByEmail(email)
  if (!user) { return json({ status: 302, redirect: '/login' }) };
  console.log(user, 'email')
  const userId = user?.id
  const intent = formPayload.intent
  if (intent === 'sales') {
    const salesData = await getAllFinanceAptsForCalendar(userId)
    const quotes = salesData
    // console.log(salesData2)
    return json({ salesData, user, quotes })
  }
  if (intent === 'parts') {
    const salesData = await getAllFinanceAptsForCalendar(userId)
    const quotes = salesData
    // console.log(salesData2)
    return json({ salesData, user, quotes })
  }

  if (intent === 'accessories') {
    const salesData = await getAllFinanceAptsForCalendar(userId)
    const quotes = salesData
    // console.log(salesData2)
    return json({ salesData, user, quotes })
  }
  if (intent === 'deliveries') {
    const salesData = await getAllFinanceAptsForCalendar(userId)
    const quotes = salesData
    // console.log(salesData2)
    return json({ salesData, user, quotes })
  }
  if (intent === 'finance') {
    const salesData = await getAllFinanceAptsForCalendar(userId)
    const quotes = salesData
    // console.log(salesData2)
    return json({ salesData, user, quotes })
  }
  if (intent === 'service') {
    const salesData = await getAllFinanceAptsForCalendar(userId)
    const quotes = salesData
    // console.log(salesData2)
    return json({ salesData, user, quotes })
  }
  return null
}
