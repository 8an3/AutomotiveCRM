


import { useCallback, useState, useEffect } from "react";
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
import { Button, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, Popover, PopoverTrigger, PopoverContent, Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue, } from "~/components";
import clsx from 'clsx'
import { Text } from '@radix-ui/themes';
import styles1 from "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import { cn } from "~/components/ui/utils"
import rbc from "~/styles/rbc.css";
import { CalendarIcon, ClockIcon } from "@radix-ui/react-icons"
import { Calendar as SmallCalendar } from '~/components/ui/calendar';
import { format } from "date-fns"
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
      userEmail: event.email,
      day: event.day,
      resourceId: event.resourceId,
      salespersonEmail: event.email,
    };
  });
  const mappedDatesForCurrentWeekSalesSched = mapSavedDatesToCurrentWeek(formattedSalesSched);
  const salesschedNumberMapping = [];
  mappedDatesForCurrentWeekSalesSched.forEach(user => {
    const inputString = user.id;
    const twoDigitNumber = generateTwoDigitNumber(inputString);

    let salesSchedmappingObject
    if (!user.resourceId) {
      salesSchedmappingObject = {
        id: user.id,
        start: user.start,
        end: user.end,
        userId: user.id,
        resourceId: twoDigitNumber,
        salespersonEmail: user.email,
        day: user.day || '',
        title: user.title,
        userEmail: user.email,
      };
    } else {
      salesSchedmappingObject = {
        id: user.id,
        start: user.start,
        end: user.end,
        userId: user.userId,
        resourceId: Number(user.resourceId),
        salespersonEmail: user.salespersonEmail,
        day: user.day,
        title: user.title,
        userEmail: user.userEmail,
      };
    }
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
      id: user.id,
      userEmail: user.email,

    };
    userNumberMapping.push(mappingObject);
  });

  console.log('User ID to Two-digit Number Mapping:');
  console.log(userNumberMapping);
  // -------------------------------------- Assign two-digit numbers to each user


  return json({ events: mappedDatesForCurrentWeek, email, users, userNumberMapping, salesSched: salesschedNumberMapping })
}

async function createOrUpdateSalespersonSched(formData) {
  const { day, salespersonEmail, start, end, userEmail, title, resourceId, userName, userId, name } = formData;

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
        salespersonEmail: salespersonEmail,
        start: start,
        end: end,
        userEmail: userEmail,
        title: title,
        resourceId: resourceId,
        userName: userName,
        userId: userId,
        name: name,
      },
    });

    return updatedEvent;
  } else {
    // If no existing event, create a new SalespersonSched event
    const newEvent = await prisma.salespersonSched.create({
      data: {
        day: day,
        salespersonEmail: salespersonEmail,
        start: new Date(start),
        end: new Date(end),
        userEmail: userEmail,
        title: title,
        resourceId: resourceId,
        userName: userName,
        userId: userId,
        name: name,
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
    delete formPayload.intent
    const formData = {
      ...formPayload,
      day,
      userEmail: email,
      salespersonEmail: email,
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
      // const resourceId = userEventData?.resourceId || event.resourceId || ''
      // const day = userEventData?.day || event.day || ''
      const start = event.start //|| userEventData?.start || ''
      const end = event.end// || userEventData?.end || ''
      console.log(event, userEventData, 'submitting')
      console.log(
        //  salespersonEmail, 'salespersonEmail',
        end, 'end',
        start, 'start',
        //    day, 'day',
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
      //  formData.append("day", day);
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

      const startDate = new Date(start);
      startDate.setHours(startDate.getHours() + 8);
      const eightHourShift = new Date(start.getTime() + 480 * 60000)

      const { id, name, userId, resourceId, resourceTitle, salespersonEmail, title, userEmail, userName } = draggedEvent
      console.log(draggedEvent, 'draggedEvent')
      const formData = new FormData();
      formData.append("intent", 'newEvent');
      formData.append("userEmail", email);
      formData.append("id", id);
      formData.append("resourceId", resourceId);
      // formData.append("name", name);
      ///  formData.append("userId", userId);
      formData.append("resourceTitle", resourceTitle);
      formData.append("userName", userName);
      formData.append("userEmail", userEmail);
      formData.append("title", title);
      formData.append("salespersonEmail", salespersonEmail);
      formData.append("start", start);
      formData.append("end", eightHourShift);
      submit(formData, { method: "post" });
      const event = {
        draggedEvent,
        start,
        end,
      }

      setDraggedEvent(null)
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
  console.log(userNumberMapping, ' need top check data with whassts coming out of the function')
  const resourceMap = userNumberMapping.map(user => ({
    resourceId: user.resourceId,
    title: user.title,
    salespersonEmail: user.salespersonEmail,
    userId: user.id,
    day: user.day,
    id: user.id,
    userEmail: user.userEmail,
    userName: user.userName,
    name: user.name,
  }));
  console.log('Sorted Resource Map:');
  console.log(resourceMap, ' need top check data with whassts coming out of the function');
  // ---------------------------------- resource mapping based off of id --------------------------------------------

  // -----------------------   Custom tool bar for employee buttons and resource view changer----------------------------

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


  function isToday(date) {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  function isPast(date) {
    const today = new Date();
    return date < today;
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
          <Button className='  cursor-pointer items-center justify-center p-2  rounded-l-md   hover:text-blue-8' onClick={() => onNavigate(navigate.PREVIOUS)}>
            <ChevronsLeft size={20} strokeWidth={1.5} />
          </Button>
          <Button className=' cursor-pointer items-center justify-center  p-2   hover:text-blue-8' onClick={() => onNavigate(navigate.TODAY)}>
            <ChevronsRightLeft size={20} strokeWidth={1.5} />
          </Button>
          <Button className='mr-3 cursor-pointer items-center justify-center  p-2  rounded-r-md hover:text-blue-8' onClick={() => onNavigate(navigate.NEXT)}
          >
            <ChevronsRight size={20} strokeWidth={1.5} />
          </Button>
        </span>
      </div>
    )
  }
  // -----------------------   Custom tool bar for employee buttons and resource view changer ----------------------------
  // -----------------------   tryiong to cahnge colors on the fly instead of remaking the sass files  ----------------------------

  // -----------------------   tryiong to cahnge colors on the fly instead of remaking the sass files  ----------------------------

  const [date, setDate] = useState<Date>()
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentSecond = now.getSeconds();
  const [hour, setHour] = useState(currentHour)
  const [min, setMin] = useState(currentMinute)
  const currentTime = `${hour}:${min}:${currentSecond}`
  console.log(`Current time is `, currentTime);
  const time = `${hour}:${min}:00`

  /**    <div className='mr-auto grid grid-cols-1'>
        <label>
          Display dragged items
        </label>
        <input
          type="checkbox"
          className='mr-auto'
          checked={displayDragItemInCell}
          onChange={handleDisplayDragItemInCell}
        />
      </div> */
  // <div className=' flex max-h-[95vh] max-w-[95vw]'>
  //
  const newDate = new Date()
  return (
    <div className='flex w-auto ' >

      <div className='h-screen w-[310px] border-r border-[#3d3d3d]'>
        <div className=' mt-5 flex-col mx-auto justify-center'>
          <div className="mx-auto w-[280px] rounded-md border-white bg-[#09090b] px-3 text-[#fafafa] " >
            <div className='  my-3 flex justify-center   '>
              <CalendarIcon className="mr-2 size-8 " />
              {date ? format(date, "PPP") : <span>{format(newDate, "PPP")}</span>}
            </div>
            <SmallCalendar
              className='mx-auto  w-auto   bg-[#09090b] text-[#fafafa]'
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </div>
        </div>
        <div className=' mt-5 grid grid-cols-1  justify-center'>
          <input type='hidden' value={String(date)} name='value' />
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[240px] px-4 text-[#fafafa] mx-auto  h-[55px] font-normal bg-transparent hover:bg-transparent hover:text-[#02a9ff] hover:border-[#02a9ff]",
                  !date && " text-[#fafafa]"
                )}
              >
                <div className=' text-[#fafafa]  mx-auto flex justify-center  '>
                  <ClockIcon className="mr-2 size-8 " />
                  {currentTime ? (time) : <span>Pick a Time</span>}
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[240px] bg-white p-0 text-black" align="start">
              <div className='align-center my-3 flex justify-center   '>
                <Select name='pickHour' value={hour} onValueChange={setHour}>
                  <SelectTrigger className="m-3 w-auto bg-transparent hover:bg-transparent hover:text-[#02a9ff] hover:border-[#02a9ff]" >
                    <SelectValue placeholder={hour} defaultValue={hour} />
                  </SelectTrigger>
                  <SelectContent className='bg-white text-black' >
                    <SelectGroup>
                      <SelectLabel>Hour</SelectLabel>
                      <SelectItem value="09">09</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="11">11</SelectItem>
                      <SelectItem value="12">12</SelectItem>
                      <SelectItem value="13">13</SelectItem>
                      <SelectItem value="14">14</SelectItem>
                      <SelectItem value="15">15</SelectItem>
                      <SelectItem value="16">16</SelectItem>
                      <SelectItem value="17">17</SelectItem>
                      <SelectItem value="18">18</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Select name='pickMin' value={min} onValueChange={setMin} >
                  <SelectTrigger className="m-3 w-auto" >
                    <SelectValue placeholder={min} defaultValue={min} />
                  </SelectTrigger>
                  <SelectContent className='bg-white text-black'  >
                    <SelectGroup>
                      <SelectLabel>Minute</SelectLabel>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="30">30</SelectItem>
                      <SelectItem value="40">40</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </PopoverContent>
          </Popover>

          <div className='mt-5 grow justify-center'>
            <div className=' grid grid-cols-1 ' >
              {resourceMap.map(({ resourceId, title, salespersonEmail, count, userId, day, id, userName, name, userEmail }) => (
                <Button
                  key={resourceId}
                  type="submit"
                  variant='outline'
                  className="mx-3 mt-5 px-4 py-2 text-[#fafafa] bg-transparent hover:bg-transparent hover:text-[#02a9ff] hover:border-[#02a9ff] w-[240px]"
                  draggable="true"
                  onDragStart={() =>
                    handleDragStart({
                      id: id,
                      name: name,
                      userName: userName,
                      userEmail: userEmail,
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
                    {title}
                  </p>
                </Button>
              ))}
            </div>

          </div>
        </div>
      </div>

      <div className="flex w-[97%] justify-center overflow-hidden">
        {showResources ? (
          <DnDCalendar
            style={{
              width: `calc(100vw - 310px)`,
              height: "100vh",
              overflowX: "hidden",
              overflowY: "scroll",
              objectFit: "contain",
              overscrollBehavior: "contain",
              color: "white",
            }}
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
        ) : (
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

    <>
      <div className="h-[75px]  w-auto  border-b border-[#3d3d3d] bg-[#09090b] text-[#fafafa]">
        <h2 className="  ml-[125px] text-2xl font-bold tracking-tight">Manager Section</h2>
        <p className="text-muted-foreground   ml-[125px]  ">
          Salesperson Schedule.
        </p>
      </div>
      <div className=" grow">
        <StoreHoursCalendar />
      </div>
    </>


  )
}

