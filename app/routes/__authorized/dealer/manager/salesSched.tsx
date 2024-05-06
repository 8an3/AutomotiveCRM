


import { useCallback, useState } from "react";
import { Calendar, dayjsLocalizer, Navigate as navigate, Views } from "react-big-calendar";
import moment from "moment";
import 'moment-timezone'
import dayjs from 'dayjs'
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import { type ActionFunction, type LoaderFunction, type LinksFunction, json } from "@remix-run/node";
import { useLoaderData, useSubmit } from "@remix-run/react";
import { getSession, commitSession } from '~/sessions/auth-session.server';
import { prisma } from "~/libs";
import timezone from 'dayjs/plugin/timezone'
import { createHash } from 'crypto'
import { UserPlus, Gauge, CalendarPlus, ChevronsLeft, ChevronsRightLeft, ChevronsRight } from 'lucide-react';
import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components";
import clsx from 'clsx'
import { Text } from '@radix-ui/themes';
import storeHoursCss from "~/styles/storeHours.css";
import rbc from "~/styles/rbc.css";
import styles1 from "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import styles2 from "react-big-calendar/lib/css/react-big-calendar.css";

export const links: LinksFunction = () => [
  { rel: "icon", type: "image/svg", href: '/calendar.svg' },
  { rel: "stylesheet", href: storeHoursCss },
  { rel: "stylesheet", href: styles2 },
  { rel: "stylesheet", href: styles1 },
  { rel: "stylesheet", href: rbc },
];
dayjs.extend(timezone)

const djLocalizer = dayjsLocalizer(dayjs)

const DnDCalendar = withDragAndDrop(Calendar);

const formatName = (name) => `${name}`
const formatName2 = (name, count) => `${name} ${count}`


export async function loader({ request, params }: LoaderFunction) {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")
  const events = await prisma.storeHours.findMany({
    where: { userEmail: email },
  });
  const salesSched = await prisma.salespersonSched.findMany({

  });
  // -------------------------------------- get dealer employees
  const dealerInfo = await prisma.dealerInfo.findMany()
  const users = await prisma.user.findMany({
    where: { dealer: dealerInfo.dealerName },
  })
  // ---------------------------------  get dealer employees --------------------------------------------------------
  // ------------------------------  get current weeks scheduled events ---------------------------------------------
  // --------------------------------------  store sched -------------------------------------------------------

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
  // ----------------------------------  salesperson  sched -------------------------------------------------------
  const formattedSalesSched = salesSched.map((event) => {
    const start = new Date(event.start) || null;
    const end = new Date(event.end) || null;
    return {
      title: `${event.title}`,
      start: start,
      end: end,
      userId: event.id,
      id: event.id,
      userEmail: event.userEmail,
      day: event.day,
      resourceId: event.resourceId,
      salespersonEmail: event.salespersonEmail,
    };
  });
  const mappedDatesForCurrentWeekSalesSched = mapSavedDatesToCurrentWeek(formattedSalesSched);
  const salesschedNumberMapping = [];
  mappedDatesForCurrentWeekSalesSched.forEach(user => {
    const inputString = user.id;
    const twoDigitNumber = generateTwoDigitNumber(inputString);
    const salesSchedmappingObject = {
      id: user.id,
      start: user.start,
      end: user.end,
      userId: user.id,
      resourceId: twoDigitNumber,
      salespersonEmail: user.email,
      day: user.day || '',
      title: user.title,
    };
    salesschedNumberMapping.push(salesSchedmappingObject);
  });
  // -------------------------------------- get current weeks scheduled events
  // -------------------------------------- Assign two-digit numbers to each user
  const userNumberMapping = [];
  users.forEach(user => {
    const inputString = user.id;
    const twoDigitNumber = generateTwoDigitNumber(inputString);
    const mappingObject = {
      userId: user.id,
      resourceId: twoDigitNumber,
      salespersonEmail: user.email,
      day: user.day || '',
      title: user.name || '',
      userName: user.name || '',
      name: user.name,

    };
    userNumberMapping.push(mappingObject);
  });

  console.log('User ID to Two-digit Number Mapping:');
  console.log(userNumberMapping);
  // -------------------------------------- Assign two-digit numbers to each user


  return json({ events: mappedDatesForCurrentWeek, email, users, userNumberMapping, salesSched: salesschedNumberMapping })
}

async function createOrUpdateSalespersonSched(formData) {
  const { day, salespersonEmail, start, end, userEmail, title, resourceId, userName } = formData;

  // Check if there's already an event for this salesperson on the specified day
  const existingEvent = await prisma.salespersonSched.findFirst({
    where: {
      day,
      userEmail,
    },
  });

  if (existingEvent) {
    // If an event already exists, update the existing event
    const updatedEvent = await prisma.salespersonSched.update({
      where: {
        id: existingEvent.id,
      },
      data: {
        day: day,
        //  salespersonEmail: salespersonEmail,
        start: start,
        end: end,
        userEmail: userEmail,
        title: title,
        // resourceId: resourceId,
        userName: userName
      },
    });

    return updatedEvent;
  } else {
    // If no existing event, create a new SalespersonSched event
    const newEvent = await prisma.salespersonSched.create({
      data: {
        day: day,
        //   salespersonEmail: salespersonEmail,
        start: start,
        end: end,
        userEmail: userEmail,
        title: title,
        ///resourceId: resourceId,
        userName: userName
      },
    });

    return newEvent;
  }
}

export async function action({ request }: ActionFunction) {
  try {
    const session = await getSession(request.headers.get("Cookie"));
    const email = session.get("email");
    const formPayload = Object.fromEntries(await request.formData());
    const day = getDayName(formPayload.start) || '';
    const formData = {
      ...formPayload,
      // userEmail: email,
    };
    console.log(formData, 'formPayload');
    const saveEvent = await createOrUpdateSalespersonSched(formData);
    return saveEvent;
  } catch (error) {
    console.error('Error saving or updating event:', error);
    // Handle the error gracefully, e.g., return an error response
    throw new Error('Failed to save or update event');
  }
}



export function StoreHoursCalendar() {
  const submit = useSubmit();
  const [view, setView] = useState(Views.WEEK)
  const [userEventData, setUserorEvent] = useState()
  const onView = useCallback((newView) => setView(newView), [setView])

  const { events, email, users, userNumberMapping, salesSched } = useLoaderData()

  const formattedData = events.map(event => {
    const start = new Date(event.start);
    const end = new Date(event.end);
    return {
      ...event,
      start,
      end,
    };
  });
  const formattedSalesSched = salesSched.map(event => {
    const start = new Date(event.start);
    const end = new Date(event.end);
    return {
      ...event,
      start,
      end,

    };
  });
  const [myEvents, setMyEvents] = useState(formattedSalesSched)
  console.log('Generated Events:', formattedData, formattedSalesSched);

  const moveEvent = useCallback(
    ({ event, start, end, isAllDay: droppedOnAllDaySlot = false }) => {
      const { allDay } = event
      if (!allDay && droppedOnAllDaySlot) {
        event.allDay = true
      }
      setMyEvents((prev) => {
        const existing = prev.find((ev) => ev.id === event.id) ?? {}
        const filtered = prev.filter((ev) => ev.id !== event.id)
        return [...filtered, { ...existing, start, end, allDay, }]
      })
      console.log('move event')
      const formData = new FormData();
      formData.append("start", start);
      formData.append("end", end);
      formData.append("userEmail", email);
      formData.append("id", event.userId);
      formData.append("resourceId", event.generatedTwoDigitNumber);
      formData.append("day", event.day);
      formData.append("title", event.title);
      formData.append("userName", event.userName);
      formData.append("salespersonEmail", event.salespersonEmail);
      console.log(event, 'submitting')
      submit(formData, { method: "post" });

    },
    []
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
      formData.append("intent", 'resizeEvent');
      formData.append("userEmail", email);
      formData.append("id", event.userId);
      formData.append("resourceId", event.generatedTwoDigitNumber);
      formData.append("day", event.day);
      formData.append("title", event.title);
      formData.append("userName", event.userName);
      formData.append("salespersonEmail", event.salespersonEmail);
      console.log(event, 'submitting')
      submit(formData, { method: "post" });

    },
    []
  )

  const newEvent = useCallback(
    ({ event }) => {
      //  const salespersonEmail = userEventData?.salespersonEmail || event.salespersonEmail || ''
      //const title = userEventData?.title || event.title || ''
      const resourceId = userEventData?.resourceId || event.resourceId || ''
      const day = userEventData?.day || event.day || ''
      const start = event.start || userEventData?.start || ''
      const end = event.end || userEventData?.end || ''
      console.log(event, userEventData, 'submitting')
      console.log(
        //  salespersonEmail, 'salespersonEmail',
        end, 'end',
        start, 'start',
        day, 'day',
        // resourceId, 'resourceId',
        //title, title,
        email, "userEmail",
      )
      const formData = new FormData();
      console.log('1')
      formData.append("intent", 'newEvent');
      console.log('2')
      formData.append("userEmail", email);
      console.log('3')
      //  formData.append("id", userEventData.userId);
      console.log('4')
      //  formData.append("resourceId", resourceId);
      console.log('5')
      formData.append("day", day);
      console.log('6')
      //  formData.append("title", title);
      console.log('7')
      console.log('8')
      // formData.append("salespersonEmail", salespersonEmail);
      console.log('9')
      formData.append("start", start);
      console.log('10')
      formData.append("end", end);
      console.log('11')
      console.log(formData, 'submitting')
      submit(formData, { method: "post" });
      console.log('12')

      setMyEvents((prev) => {
        const idList = prev.map((item) => item.id)
        const newId = Math.max(...idList) + 1
        return [...prev, { ...event, id: newId, }]
      })
    },
    []
  )
  // ------------------------------------ min max time based of store sched -----------------------------------------
  let minTime = null;
  let maxTime = null;
  formattedData.forEach(event => {
    if (!minTime || event.start < minTime) {
      minTime = new Date(event.start);
    }
    if (!maxTime || event.end > maxTime) {
      maxTime = new Date(event.end);
    }
  });
  if (minTime && maxTime) {
    // Set the hours, minutes, and seconds for minTime and maxTime
    minTime.setHours(8, 0, 0);
    maxTime.setHours(21, 30, 0);
  } else {
    // Default values if no valid events were found
    minTime = new Date();
    minTime.setHours(8, 0, 0);
    maxTime = new Date();
    maxTime.setHours(21, 30, 0);
  }
  // console.log("minTime:", minTime);
  // console.log("maxTime:", maxTime);
  // ------------------------------------ min max time based of store sched -----------------------------------------

  // ---------------------------------------- drag from outside  ----------------------------------------------------

  const [draggedEvent, setDraggedEvent] = useState()
  const [displayDragItemInCell, setDisplayDragItemInCell] = useState(true)
  const [counters, setCounters] = useState({ item1: 0, item2: 0 })

  const eventPropGetter = useCallback(
    (event) => ({
      ...(event.isDraggable
        ? { className: 'isDraggable' }
        : { className: 'nonDraggable' }),
    }),
    []
  )
  const handleDragStart = useCallback((event) => setDraggedEvent(event), [])

  const dragFromOutsideItem = useCallback(() => draggedEvent, [draggedEvent])

  const customOnDragOver = useCallback(
    (dragEvent) => {
      // check for undroppable is specific to this example
      // and not part of API. This just demonstrates that
      // onDragOver can optionally be passed to conditionally
      // allow draggable items to be dropped on cal, based on
      // whether event.preventDefault is called
      if (draggedEvent !== 'undroppable') {
        console.log('preventDefault')
        dragEvent.preventDefault()
      }
    },
    [draggedEvent]
  )

  const handleDisplayDragItemInCell = useCallback(
    () => setDisplayDragItemInCell((prev) => !prev),
    []
  )
  const onDropFromOutside = useCallback(
    ({ start, end, allDay: isAllDay }) => {
      if (draggedEvent === 'undroppable') {
        setDraggedEvent(null)
        return
      }
      const { resourceTitle, salespersonEmail, day, userId, resourceId, userName, } = draggedEvent
      const event = {
        title: `${resourceTitle}`,
        salesPersonEmail: salespersonEmail,
        userName: userName,
        userEmail: email,
        day: day,
        userId: userId,
        resourceId: resourceId,
        start,
        end,
      }
      setDraggedEvent(null)
      newEvent(event)
    },
    [draggedEvent, email, newEvent]
  )
  const onDropFromOutside2 = useCallback(
    ({ start, end, allDay: isAllDay }) => {
      const today = new Date();
      const dayOfWeek = today.getDay();
      const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const dayName = weekdays[dayOfWeek];
      const { resourceTitle, salespersonEmail, userId, resourceId, userName, title } = draggedEvent

      const setuserevent = {
        title: title || userName || resourceTitle,
        salesPersonEmail: salespersonEmail,
        userEmail: email,
        day: dayName,
        userId: userId,
        resourceId: resourceId,
        start,
        end,
      }
      setUserorEvent(setuserevent)

      const event = {
        //  title: title || userName || resourceTitle,
        //  salesPersonEmail: salespersonEmail,
        userEmail: email,
        day: dayName,
        resourceId: resourceId,

        // userId: userId,
        start,
        end,
      }
      //  setDraggedEvent(null)

      console.log(event, setuserevent)
      //submitEvent(event, formData)
      newEvent(event)
    },
    [draggedEvent, counters, setDraggedEvent, setCounters, newEvent]
  )
  // ---------------------------------------- drag from outside  ----------------------------------------------------

  // ---------------------------------- resource mapping based off of id --------------------------------------------

  const [showResources, setShowResources] = useState(true);

  const toggleView = () => {
    setShowResources(prevState => !prevState);
  };

  userNumberMapping.sort((a, b) => a.generatedTwoDigitNumber - b.generatedTwoDigitNumber);

  // Create resourceMap dynamically based on sorted userNumberMapping
  const resourceMap = userNumberMapping.map(user => ({
    resourceId: user.resourceId,
    title: user.name,
    salespersonEmail: user.email,
    userId: user.id,
    day: user.day,
  }));

  // Output the sorted resourceMap
  console.log('Sorted Resource Map:');
  console.log(resourceMap);
  // ---------------------------------- resource mapping based off of id --------------------------------------------

  // -----------------------   Custom tool bar for employee buttons and resource view changer----------------------------
  const views = ["Day", "Week", "Month", "Agenda"];
  const ViewNamesGroup = ({ views: viewNames, view, messages, onView }) => {
    return viewNames.map((name) => (
      <Button
        key={name}
        type="button"
        className={clsx({ 'rbc-active': view === name })}
        onClick={() => onView(name)}
      >
        <Text>{messages[name]}</Text>
      </Button>
    ))
  }

  const CustomToolbar = ({
    label,
    localizer: { messages },
    onNavigate,
    onView,
    view,
    views,
  }) => {
    return (
      <div className="rbc-toolbar">
        <span className="rbc-btn-group">
          <ViewNamesGroup
            view={view}
            views={views}
            messages={messages}
            onView={onView}
          />
        </span>

        <span className="rbc-toolbar-label">{label}</span>
        <span className="ml-auto mr-10 justify-end">
          <Button
            onClick={toggleView}
            type="submit"
          >
            Toggle Resource View
          </Button>
        </span>


        <span className="ml-auto justify-end">
          <Button className='mr-3 cursor-pointer items-center justify-center p-2 first:rounded-bl-md first:rounded-tl-md last:rounded-br-md last:rounded-tr-md hover:text-blue-8' onClick={() => onNavigate(navigate.PREVIOUS)}>
            <ChevronsLeft size={20} strokeWidth={1.5} />
          </Button>
          <Button className='mr-3 cursor-pointer items-center justify-center  p-2 first:rounded-bl-md first:rounded-tl-md last:rounded-br-md last:rounded-tr-md hover:text-blue-8' onClick={() => onNavigate(navigate.TODAY)}>
            <ChevronsRightLeft size={20} strokeWidth={1.5} />
          </Button>
          <Button className='mr-3 cursor-pointer items-center justify-center  p-2 first:rounded-bl-md first:rounded-tl-md last:rounded-br-md last:rounded-tr-md hover:text-blue-8' onClick={() => onNavigate(navigate.NEXT)}
          >
            <ChevronsRight size={20} strokeWidth={1.5} />
          </Button>
        </span>
      </div>
    )
  }
  // -----------------------   Custom tool bar for employee buttons and resource view changer ----------------------------


  return (
    <div className='mr-3 mb-3 p-3 mx-auto justify-center' >
      <div className='rbc-toolbar flex ' >
        <Tooltip>
          <TooltipTrigger className=' border-none bg-transparent'>
            {resourceMap.map(({ resourceId, title, salespersonEmail, count, userId, day, }) => (
              <Button
                key={resourceId}
                type="submit"
                className="mx-3 px-3"
                draggable="true"
                onDragStart={() =>
                  handleDragStart({
                    title: title,
                    resourceTitle: title,
                    salespersonEmail: salespersonEmail,
                    count: count,
                    resourceId: resourceId,
                    userId: userId,
                    day: day,
                  })
                }
              >
                <p>
                  title: {title} userId: {userId} resId: {resourceId}
                </p>
              </Button>
            ))}
          </TooltipTrigger>
          <TooltipContent>
            <p className='text-black'>Drag and drop on the desired day.</p>
          </TooltipContent>
        </Tooltip>
        {Object.entries(counters).map(([name, count]) => (
          <div
            draggable="true"
            key={name}
            onDragStart={() =>
              handleDragStart({ title: formatName2(name, count), name })
            }
          >
            <Button variant='outline' >
              {formatName2(name, count)}
            </Button>
          </div>
        ))}
      </div>
      <div className='grid grid-cols-1 mr-auto'>
        <label>
          Display dragged items
        </label>
        <input
          type="checkbox"
          className='mr-auto'
          checked={displayDragItemInCell}
          onChange={handleDisplayDragItemInCell}
        />
      </div>
      <div className="size-full p-3" >
        {showResources ? (
          <DnDCalendar
            style={{ height: "100vh", width: "auto", overflowX: "visible", overflowY: 'scroll', objectFit: 'contain', overscrollBehavior: 'contain' }}
            //, overflow: "auto"
            resizable
            selectable
            min={minTime}
            max={maxTime}
            defaultDate={moment().toDate()}
            onView={onView}
            view={view}
            events={myEvents}
            localizer={djLocalizer}


            components={{ toolbar: CustomToolbar, }}
            onEventDrop={moveEvent}
            onEventResize={resizeEvent}
            onSelectSlot={newEvent}
            onDropFromOutside={onDropFromOutside2}
            dragFromOutsideItem={displayDragItemInCell ? dragFromOutsideItem : null}
            draggableAccessor="isDraggable"
            onDragOver={customOnDragOver}
            eventPropGetter={eventPropGetter}

            // ---------- ones i dont have in this calendar
            // onClick={() => setOpenDatepickerModal(true)}
            // ---------- ones i dont have in this calendar


            resourceIdAccessor="resourceId"
            resources={resourceMap}
            resourceTitleAccessor="resourceTitle"
          />
        ) : (
          <DnDCalendar
            style={{ height: "auto", width: "auto", overflow: "auto" }}
            //, overflow: "auto"
            resizable
            selectable
            min={minTime}
            max={maxTime}
            defaultDate={moment().toDate()}
            onView={onView}
            view={view}
            events={myEvents}
            localizer={djLocalizer}
            components={{ toolbar: CustomToolbar, }}

            onEventDrop={moveEvent}
            onEventResize={resizeEvent}
            onSelectSlot={newEvent}
            onDropFromOutside={onDropFromOutside2}
            dragFromOutsideItem={displayDragItemInCell ? dragFromOutsideItem : null}
            draggableAccessor="isDraggable"
            onDragOver={customOnDragOver}
            eventPropGetter={eventPropGetter}
          />
        )}

      </div>
    </div>

  );
}

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
function generateTwoDigitNumber(inputString) {
  const hash = createHash('sha256').update(inputString).digest('hex');
  const shortHash = hash.substr(0, 2);
  const decimalValue = parseInt(shortHash, 16);
  const mappedValue = 10 + (decimalValue % 90); // Ensure result is between 10 and 99
  return mappedValue;
}

export default function SettingsAccountPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Salesperson Schedule</h3>
        <p className="text-sm text-muted-foreground">
          Update your sales schedule to enable apps functionality.
        </p>
      </div>
      <hr className="solid text-white" />
      <StoreHoursCalendar />
    </div>
  )
}
