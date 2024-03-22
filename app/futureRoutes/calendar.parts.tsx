import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import React, { useEffect } from 'react'
import { getAllFinanceAptsForCalendar, getSingleFinanceAppts } from '~/utils/financeAppts/get.server';
import { type ActionFunction, type DataFunctionArgs, json } from '@remix-run/node';
;
import { model } from '~/models';
import { getSession } from "~/sessions/auth-session.server";
import { Form, useLoaderData, useSubmit, Link, useFetcher } from '@remix-run/react'
import { GetUser } from "~/utils/loader.server";
import { prisma } from "~/libs";

import { getSession as sessionGet, getUserByEmail } from '~/utils/user/get'




export async function loader({ request, params }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")


  const user = await GetUser(email)
  /// console.log(user, account, 'wquiote loadert')
  if (!user) {
    redirect('/login')
  }
  if (!user) { return json({ status: 302, redirect: '/login' }); };

  const userId = user?.id
  const testdate = new Date()
  const userEmail = user?.email
  const Delivery = await prisma.clientApts.findMany({
    where: {
      apptType: 'Delivery',
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  console.log(Delivery, 'Delivery')
  const salesData = await getAllFinanceAptsForCalendar(userId)
  const quotes = salesData
  //  console.log(salesData)
  return json({ salesData, user, quotes, Delivery })
}
const localizer = momentLocalizer(moment)

export default function GetCalendar() {
  const { Delivery } = useLoaderData()
  const formattedData = Delivery.map(event => ({
    ...event,
    start: new Date(event.start),
    end: new Date(new Date(event.start).setHours(new Date(event.start).getHours() + 1)),
  }));

  const [events, setEvents] = React.useState(formattedData);

  //const [events, setEvents] = React.useState([dummyEvent]);
  console.log(events, 'events')
  return (
    <div>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        popup
      />
    </div>
  )
}
