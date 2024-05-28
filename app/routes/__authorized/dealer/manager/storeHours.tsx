


import { useCallback, useEffect, useState } from "react";
import { Calendar, dayjsLocalizer, DateLocalizer } from "react-big-calendar";
import moment from "moment";
import 'moment-timezone'
import dayjs from 'dayjs'
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";

import { type ActionFunction, type LoaderFunction, type LinksFunction, json } from "@remix-run/node";
import { useLoaderData, useSubmit, useNavigate } from "@remix-run/react";
import { getSession, commitSession } from '~/sessions/auth-session.server';
import { prisma } from "~/libs";
import timezone from 'dayjs/plugin/timezone'
import styles1 from "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import styles2 from "react-big-calendar/lib/css/react-big-calendar.css";
import rbc from "~/styles/rbc.css";
import base from "~/styles/base.css";

export const links: LinksFunction = () => [
  { rel: "icon", type: "image/svg", href: '/calendar.svg' },
  { rel: "stylesheet", href: styles1 },
  { rel: "stylesheet", href: rbc },
  { rel: "stylesheet", href: base },

];

dayjs.extend(timezone)

const djLocalizer = dayjsLocalizer(dayjs)

const DnDCalendar = withDragAndDrop(Calendar);

function getDayName(date: string | Date): string | null {
  const validDate = new Date(date);
  if (isNaN(validDate.getTime())) {
    console.error('Invalid date provided:', date);
    return null;
  }
  const dayIndex = validDate.getDay();
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return daysOfWeek[dayIndex];
}
function getCurrentWeekDates() {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay()); // Set to Sunday of the current week
  const endOfWeek = new Date(today);
  endOfWeek.setDate(today.getDate() - today.getDay() + 6); // Set to Saturday of the current week
  return { startOfWeek, endOfWeek };
}
function mapSavedDatesToCurrentWeek(savedEvents: any[]): any[] {
  const today = new Date();
  const currentDayOfWeek = today.getDay(); // Get the current day of the week (0-6, where 0 is Sunday)

  // Get the start and end of the current week
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - currentDayOfWeek); // Move back to Sunday of the current week
  startOfWeek.setHours(0, 0, 0, 0); // Set time to the start of the day (midnight)

  const endOfWeek = new Date(today);
  endOfWeek.setDate(today.getDate() + (6 - currentDayOfWeek)); // Move forward to Saturday of the current week
  endOfWeek.setHours(23, 59, 59, 999); // Set time to the end of the day (just before midnight)

  const mappedEvents: any[] = [];

  // Iterate through each day of the current week
  for (let i = 0; i <= 6; i++) {
    const currentDate = new Date(startOfWeek);
    currentDate.setDate(startOfWeek.getDate() + i);

    // Get the day name (e.g., "Sunday", "Monday", etc.) of the current date
    const currentDayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][currentDate.getDay()];

    // Filter saved events that match the current day of the week
    const matchingEvents = savedEvents.filter((event) => event.day === currentDayName);

    // Update the start and end dates of matching events to the current week's equivalent day
    matchingEvents.forEach((event) => {
      const { start, end } = event;

      // Keep the time of day from the original start and end dates
      const startTime = new Date(start);
      const endTime = new Date(end);

      // Set the current week's equivalent day with the same time of day
      startTime.setFullYear(currentDate.getFullYear());
      startTime.setMonth(currentDate.getMonth());
      startTime.setDate(currentDate.getDate());

      endTime.setFullYear(currentDate.getFullYear());
      endTime.setMonth(currentDate.getMonth());
      endTime.setDate(currentDate.getDate());

      const mappedEvent = {
        ...event,
        start: startTime,
        end: endTime,
      };

      mappedEvents.push(mappedEvent);
    });
  }

  return mappedEvents;
}

export async function loader({ request, params }: LoaderFunction) {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")
  const events = await prisma.storeHours.findMany({
    where: { userEmail: email, },
  });
  const formattedEvents = events.map((event) => {
    const start = new Date(event.start) || null;
    const end = new Date(event.end) || null;
    return {
      title: `Store Hours ${event.day}`,
      start: start,
      end: end,
      id: event.id,
      userEmail: event.userEmail,
      day: event.day,
    };
  });
  const mappedDatesForCurrentWeek = mapSavedDatesToCurrentWeek(formattedEvents);

  // console.log(mappedDatesForCurrentWeek, ' loader events')
  return json({ events: mappedDatesForCurrentWeek, email })
}

export async function action({ request }: ActionFunction) {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")
  const formPayload = Object.fromEntries(await request.formData())
  console.log(email, formPayload, 'formPayload')
  const day = getDayName(formPayload.start) || '';
  const saveDay = await prisma.storeHours.findMany({ where: { userEmail: email, } }) || '';
  try {
    //if (!formPayload.id) { // works
    if (formPayload.intent === 'resizeEvent') { // havent tested
      console.log('resizeing event', formPayload)
      const resizeEvent = await prisma.storeHours.update({
        where: {
          id: formPayload.id,
          //day: day,
        },
        data: {
          start: new Date(formPayload.start),
          end: new Date(formPayload.end),
          day: day,
        },
      });
      return resizeEvent
    }
    if (!formPayload.id) { // works
      // if (formPayload.intent === 'newEvent') { // havent tested
      console.log('creating new event', formPayload)
      const saveNewDay = await prisma.storeHours.create({
        data: {
          userEmail: formPayload.userEmail,
          start: new Date(formPayload.start),
          end: new Date(formPayload.end),
          day: day,
        },
      });
      return saveNewDay
    }
    if (formPayload.id) {
      console.log('updating event', String(saveDay.day), String(formPayload.day), formPayload)
      const updateDay = await prisma.storeHours.update({
        where: {
          id: formPayload.id,
          //day: day,
        },
        data: {
          start: new Date(formPayload.start),
          end: new Date(formPayload.end),
          day: day,
        },
      });
      return updateDay
    }
  } catch (error) {
    console.error('Error occurred:', error);
    throw new Error('Failed to save store hours');
  } finally {
    await prisma.$disconnect(); // Disconnect Prisma client after operation
  }
  return null;
}

export function StoreHoursCalendar() {
  const submit = useSubmit();
  const { events, email } = useLoaderData()
  const formattedData = events.map(event => {
    const start = new Date(event.start);
    const end = new Date(event.end);
    return {
      ...event,
      start,
      end,
    };
  });



  const [myEvents, setMyEvents] = useState(formattedData)

  console.log('Generated Events:', formattedData);

  const moveEvent = useCallback(
    ({ event, start, end, isAllDay: droppedOnAllDaySlot = false }) => {
      const { allDay } = event
      if (!allDay && droppedOnAllDaySlot) {
        event.allDay = true
      }
      setMyEvents((prev) => {
        const existing = prev.find((ev) => ev.id === event.id) ?? {}
        const filtered = prev.filter((ev) => ev.id !== event.id)
        return [...filtered, { ...existing, start, end, allDay }]
      })
      const formData = new FormData();
      formData.append("start", start);
      formData.append("end", end);
      formData.append("id", event.id);
      formData.append("day", event.day);
      console.log(event, 'event')
      return submit(formData, { method: "post" });
    },
    [submit]
  )

  const resizeEvent = useCallback(
    ({ event, start, end }) => {
      setMyEvents((prev) => {
        const existing = prev.find((ev) => ev.id === event.id) ?? {}
        const filtered = prev.filter((ev) => ev.id !== event.id)
        return [...filtered, { ...existing, start, end }]
      })
      const formData = new FormData();
      formData.append("start", start);
      formData.append("end", end);
      formData.append("id", event.id);
      formData.append("day", event.day);
      console.log(event, 'event')
      formData.append("intent", 'resizeEvent');
      submit(formData, { method: "post" });
      return submit(formData, { method: "post" });
    },
    [submit]
  )

  const newEvent = useCallback(async ({ event, start, end }) => {
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    setMyEvents((prev) => {
      const idList = prev.map((item) => item.id)
      const newId = Math.max(...idList) + 1
      return [...prev, { ...event, id: newId, start, end }]
    })
    const formData = new FormData();
    formData.append("start", start);
    formData.append("end", end);
    formData.append("userEmail", email);
    formData.append("intent", 'newEvent');
    console.log(event, 'event')
    submit(formData, { method: "post" });
    //await delay(250);
    //navigate('/dealer/manager/storeHours')
    //setStart(start)
    // setEnd(end)
    // setFireNewEvent(true)
  },
    [email, submit]
  )

  const minTime = new Date();
  minTime.setHours(6, 0, 0);

  const maxTime = new Date();
  maxTime.setHours(21, 30, 0);
  return (
    <div className="App">
      <DnDCalendar
        style={{
          height: "100vh",
          width: "auto",
          overflowX: "hidden",
          overflowY: 'scroll',
          objectFit: 'contain',
          overscrollBehavior: 'contain',
          color: 'white',
        }}

        min={minTime}
        max={maxTime}
        defaultDate={moment().toDate()}
        defaultView="week"
        events={myEvents}
        localizer={djLocalizer}
        onEventDrop={moveEvent}
        onEventResize={resizeEvent}
        onSelectSlot={newEvent}
        //  onSelecting={newEvent}
        // onDragStart={newEvent}
        resizable
        selectable
      />
    </div>
  );
}


export default function SettingsAccountPage() {
  return (
    <div className="space-y-6 text-[#fafafa]">
      <div>
        <h3 className="text-lg font-medium">Store Hours</h3>
        <p className="text-sm text-muted-foreground">
          Update your stores hours to enable apps functionality.
        </p>
      </div>
      <hr className="solid text-[#2b2b2d]" />
      <StoreHoursCalendar />
    </div>
  )
}
