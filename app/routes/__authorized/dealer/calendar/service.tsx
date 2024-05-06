import React, { Fragment, useMemo, useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import { Calendar, Views, DateLocalizer, momentLocalizer } from 'react-big-calendar'
import { prisma } from "~/libs";
// Storybook cannot alias this, so you would use 'react-big-calendar/lib/addons/dragAndDrop'
import { getSession } from '~/sessions/auth-session.server';
// Storybook cannot alias this, so you would use 'react-big-calendar/lib/addons/dragAndDrop/styles.scss'
import { model } from '~/models';
import { useLoaderData } from '@remix-run/react'
import { json, redirect } from '@remix-run/node';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import { getAllFinanceAptsForCalendar, getSingleFinanceAppts } from '~/utils/financeAppts/get.server';
import moment from 'moment';
import { GetUser } from "~/utils/loader.server";
import storeHoursCss from "~/styles/storeHours.css";
import styles1 from "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import styles2 from "react-big-calendar/lib/css/react-big-calendar.css";

export const links: LinksFunction = () => [
  { rel: "icon", type: "image/svg", href: '/calendar.svg' },
  { rel: "stylesheet", href: storeHoursCss },
  { rel: "stylesheet", href: styles1 },
  { rel: "stylesheet", href: styles2 },
];

const DragAndDropCalendar = withDragAndDrop(Calendar)
export async function loader({ request, params }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")



  const user = await GetUser(email)
  /// console.log(user, account, 'wquiote loadert')
  if (!user) {
    redirect('/login')
  }

  const userId = user.id
  const userEmail = user?.email
  const salesData = await getAllFinanceAptsForCalendar(userId)
  const Delivery = await prisma.clientApts.findMany({
    where: { apptStatus: 'Delivery', },
    orderBy: { createdAt: 'desc', },
  });
  const data = await prisma.clientfile.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
  const searchData = await prisma.clientfile.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
  //  console.log(salesData)
  return json({ salesData, data, user, Delivery, searchData })
}
export default function DnDResource() {
  const { salesData, user, data } = useLoaderData()
  const resourceMap = [
    { resourceId: 1, resourceTitle: 'Sales Calls' },
    { resourceId: 2, resourceTitle: 'Sales Appointments' },
    { resourceId: 3, resourceTitle: 'Deliveries' },
    { resourceId: 4, resourceTitle: 'F & I' },
  ]
  const formattedData = salesData.map(event => ({
    ...event,
    start: new Date(event.start),
    end: new Date(new Date(event.start).setHours(new Date(event.start).getHours() + 1)),
  }));
  const localizer = momentLocalizer(moment);

  const [myEvents, setMyEvents] = useState(formattedData)

  // add an hour to start so each appt has an end

  const [copyEvent, setCopyEvent] = useState(true)

  const toggleCopyEvent = useCallback(() => setCopyEvent((val) => !val), [])

  const moveEvent = useCallback(
    ({
      event,
      start,
      end,
      resourceId,
      isAllDay: droppedOnAllDaySlot = false,
    }) => {
      const { allDay } = event
      if (!allDay && droppedOnAllDaySlot) {
        event.allDay = true
      }
      if (Array.isArray(event.resourceId)) {
        if (copyEvent) {
          resourceId = [...new Set([...event.resourceId, resourceId])]
        } else {
          const filtered = event.resourceId.filter(
            (ev) => ev !== event.sourceResource
          )
          resourceId = [...new Set([...filtered, resourceId])]
        }
      } else if (copyEvent) {
        resourceId = [...new Set([event.resourceId, resourceId])]
      }

      setMyEvents((prev) => {
        const existing = prev.find((ev) => ev.id === event.id) ?? {}
        const filtered = prev.filter((ev) => ev.id !== event.id)
        return [...filtered, { ...existing, start, end, resourceId, allDay }]
      })
    },
    [setMyEvents, copyEvent]
  )

  const resizeEvent = useCallback(
    ({ event, start, end }) => {
      setMyEvents((prev) => {
        const existing = prev.find((ev) => ev.id === event.id) ?? {}
        const filtered = prev.filter((ev) => ev.id !== event.id)
        return [...filtered, { ...existing, start, end }]
      })
    },
    [setMyEvents]
  )

  const { defaultDate, scrollToTime } = useMemo(
    () => ({
      defaultDate: new Date(2018, 0, 29),
      scrollToTime: new Date(1972, 0, 1, 8),
    }),
    []
  )

  return (
    <Fragment>

      <div className="height600 bg-white">
        <DragAndDropCalendar
          defaultDate={defaultDate}
          defaultView={Views.DAY}
          events={myEvents}
          localizer={localizer}
          onEventDrop={moveEvent}
          onEventResize={resizeEvent}
          resizable
          resourceIdAccessor="resourceId"
          resources={resourceMap}
          resourceTitleAccessor="resourceTitle"
          scrollToTime={scrollToTime}
          selectable
          showMultiDayTimes={true}
          step={15}
        />
      </div>
    </Fragment>
  )
}
