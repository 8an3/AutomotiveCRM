
import React, { Fragment, useMemo, useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import { Calendar, Views, dayjsLocalizer } from 'react-big-calendar'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import { LinksFunction } from '@remix-run/node'
import stylesheet from './overviewUtils/styles2.css'
import { type ActionFunction, type DataFunctionArgs, json, redirect, } from '@remix-run/node';
;
import { model } from '~/models';
import financeFormSchema from '../../routes/overviewUtils/financeFormSchema';
import { Form, useLoaderData, useSubmit, Link, useFetcher, useNavigate, useNavigation } from '@remix-run/react'
import { getAllFinanceAptsForCalendar, getSingleFinanceAppts } from '~/utils/financeAppts/get.server';
import { prisma } from "~/libs";
import { Flex, Text, Button, Card, Heading, Container, IconButton } from '@radix-ui/themes';
import { UserPlus, Gauge, CalendarCheck, Search } from 'lucide-react'
import EventInfo from "~/components/dashboard/calendar/EventInfo"
import AddEventModal from "~/components/backups/AddEventModal"
import EventInfoModal from "~/components/dashboard/calendar/EventInfoModal"
import AddDatePickerEventModal from "~/components/backups/createApptModal2222"
const DragAndDropCalendar = withDragAndDrop(Calendar)

export async function loader({ request }: DataFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")

  const user = await model.user.query.getForSession({ email: email });
  /// console.log(user, account, 'wquiote loadert')
  if (!user) {
    redirect('/login')
  }
  const userId = user?.id
  const userEmail = user?.email
  const salesData = await getAllFinanceAptsForCalendar(userId)
  const Delivery = await prisma.clientApts.findMany({
    where: { apptStatus: 'Delivery', },
    orderBy: { createdAt: 'desc', },
  });
  //  console.log(salesData)
  return json({ salesData, user, Delivery })
}

export const links = () => [{ rel: "stylesheet", href: stylesheet },]



const resourceMap = [
  { resourceId: 1, resourceTitle: 'Sales Calls' },
  { resourceId: 2, resourceTitle: 'Sales Appointments' },
  { resourceId: 3, resourceTitle: 'Deliveries' },
  { resourceId: 4, resourceTitle: 'F & I' },
]
dayjs.extend(timezone)

export default function DnDResource() {
  const { salesData } = useLoaderData()
  // add an hour to start so each appt has an end
  const formattedData = salesData.map(event => ({
    ...event,
    start: new Date(event.start),
    end: new Date(new Date(event.start).setHours(new Date(event.start).getHours() + 1)),
  }));
  // state to store events

  const events = [
    {
      id: 0,
      title: 'Board meeting',
      start: new Date(2018, 0, 29, 9, 0, 0),
      end: new Date(2018, 0, 29, 13, 0, 0),
      resourceId: [1, 2],
    },
    {
      id: 1,
      title: 'MS training',
      start: new Date(2018, 0, 29, 14, 0, 0),
      end: new Date(2018, 0, 29, 16, 30, 0),
      resourceId: 2,
    },
    {
      id: 2,
      title: 'Team lead meeting',
      start: new Date(2018, 0, 29, 8, 30, 0),
      end: new Date(2018, 0, 29, 12, 30, 0),
      resourceId: 3,
    },
    {
      id: 10,
      title: 'Board meeting',
      start: new Date(2018, 0, 30, 23, 0, 0),
      end: new Date(2018, 0, 30, 23, 59, 0),
      resourceId: 1,
    },
    {
      id: 11,
      title: 'Birthday Party',
      start: new Date(2018, 0, 30, 7, 0, 0),
      end: new Date(2018, 0, 30, 10, 30, 0),
      resourceId: 4,
    },
    {
      id: 12,
      title: 'Board meeting',
      start: new Date(2018, 0, 29, 23, 59, 0),
      end: new Date(2018, 0, 30, 13, 0, 0),
      resourceId: 1,
    },
    {
      id: 13,
      title: 'Board meeting',
      start: new Date(2018, 0, 29, 23, 50, 0),
      end: new Date(2018, 0, 30, 13, 0, 0),
      resourceId: 2,
    },
    {
      id: 14,
      title: 'Board meeting',
      start: new Date(2018, 0, 29, 23, 40, 0),
      end: new Date(2018, 0, 30, 13, 0, 0),
      resourceId: 4,
    },
  ]

  const [myEvents, setMyEvents] = useState(events)//formattedData)
  // for add create appoint modal
  const quotes = formattedData

  const localizer = dayjsLocalizer(dayjs)
  // toggles weather to make a copy when ddraging, i justr set it to false instead
  const [copyEvent, setCopyEvent] = useState(false)
  const toggleCopyEvent = useCallback(() => setCopyEvent((val) => !val), [])
  // dnd
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

  // min and max times
  const minTime = new Date();
  minTime.setHours(8, 0, 0);

  const maxTime = new Date();
  maxTime.setHours(21, 30, 0);

  // add appointment modal
  const [openDatepickerModal, setOpenDatepickerModal] = useState(false)
  const handleDatePickerClose = () => {
    setOpenDatepickerModal(false)
  }
  const [datePickerEventFormData, setDatePickerEventFormData] =
    useState<DatePickerEventFormData>(initialDatePickerEventFormData)

  const onAddEventFromDatePicker = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    const addHours = (date: Date | undefined, hours: number) => {
      return date ? date.setHours(date.getHours() + hours) : undefined
    }

    const setMinToZero = (date: Date | undefined) => {
      if (date) {
        date.setSeconds(0);
      }
      return date;
    }

    const data: IEventInfo = {
      ...datePickerEventFormData,
      _id: generateId(),
      start: setMinToZero(datePickerEventFormData.start),
      end: datePickerEventFormData.allDay
        ? addHours(datePickerEventFormData.start, 12)
        : setMinToZero(datePickerEventFormData.end),

    }

    const newEvents = [...events, data]

    setEvents(newEvents)
    setDatePickerEventFormData(initialDatePickerEventFormData)
  }

  const [todos, setTodos] = useState<ITodo[]>([]);
  const uniqueQuotes = quotes.filter((quote, index, self) =>
    self.findIndex((q) => q.email === quote.email) === index
  );

  return (
    <Fragment>
      <Container className='bg-white mt-2 z-20'>
        <Card className=' mt-2'>

          <Flex direction="row">
            <Flex gap='1' align="center" direction="column" justify="start" p='2'>

              <IconButton onClick={() => setOpenDatepickerModal(true)}>
                <UserPlus size={20} strokeWidth={1.5} />
              </IconButton>
              <IconButton onClick={() => setOpenDatepickerModal(true)}>
                <Gauge size={20} strokeWidth={1.5} />
              </IconButton>
              <IconButton onClick={() => setOpenDatepickerModal(true)}>
                <CalendarCheck size={20} strokeWidth={1.5} />
              </IconButton>
              <IconButton onClick={() => setOpenDatepickerModal(true)}>
                <Search size={20} strokeWidth={1.5} />
              </IconButton>

            </Flex>

            <AddDatePickerEventModal
              open={openDatepickerModal}
              handleClose={handleDatePickerClose}
              datePickerEventFormData={datePickerEventFormData}
              setDatePickerEventFormData={setDatePickerEventFormData}
              onAddEvent={onAddEventFromDatePicker}
              todos={todos}
              uniqueQuotes={uniqueQuotes}

            />
            <div className="h-[750px]">
              <DragAndDropCalendar
                defaultDate={defaultDate}
                defaultView={Views.DAY}
                events={myEvents}
                min={minTime}
                max={maxTime}
                components={{ event: EventInfo }}
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
          </Flex>

        </Card>
      </Container >
    </Fragment>
  )
}
DnDResource.propTypes = {
  localizer: PropTypes.instanceOf(dayjsLocalizer),
}


interface IProps {
  open: boolean;
  handleClose: () => void;
  datePickerEventFormData: any; // replace with the correct type
  setDatePickerEventFormData: (data: any) => void; // replace with the correct type
  onAddEvent: () => void;
  todos: any[]; // replace with the correct type
  onClose: (value: string) => void;
  selectedValue: string;
  openDialog: boolean;
}

export interface ITodo {
  _id: string
  title: string
  color?: string
  Email: string
  SMS: string
  InPerson: string
  Phone: string
  completed: string
}

export interface IEventInfo extends Event {
  _id: string
  id: string
  todoId?: string
  description: string
  allDay: string
  start: string
  end: string
  resourceId: string
  userEmail: string
  followUpDay1: string
  financeId: string
  direction: string
  resultOfcall: string
  firstName: string
  lastName: string
  email: string
  brand: string
  intent: string
  contactMethod: string
  completed: string
  apptStatus: string
  apptType: string
  unit: string
  title: string
  note: string
  phone: string
  address: string
  userId: string
  userName: string
  title: string
  attachments: string
  getClientFileById: string
}

export interface EventFormData {
  todoId: string
  description: string
  allDay: string
  start: string
  end: string
  resourceId: string
  userEmail: string
  followUpDay1: string
  financeId: string
  direction: string
  resultOfcall: string
  firstName: string
  lastName: string
  email: string
  brand: string
  intent: string
  contactMethod: string
  completed: string
  apptStatus: string
  apptType: string
  unit: string
  title: string
  note: string
  phone: string
  address: string
  userId: string
  userName: string
  messageTitle: string
  attachments: string
  getClientFileById: string
}

export interface DatePickerEventFormData {
  allDay: boolean
  start?: Date
  end?: Date
  todoId: string
  description: string
  resourceId: string
  userEmail: string
  followUpDay1: string
  financeId: string
  direction: string
  resultOfcall: string
  firstName: string
  lastName: string
  email: string
  brand: string
  intent: string
  contactMethod: string
  completed: string
  apptStatus: string
  apptType: string
  unit: string
  title: string
  note: string
  phone: string
  address: string
  userId: string
  userName: string
  messageTitle: string
  attachments: string
  getClientFileById: string
}

const initialEventFormState: EventFormData = {
  description: "",
  todoId: undefined,
  completed: 'no',
  apptType: '',

}

const initialDatePickerEventFormData: DatePickerEventFormData = {
  description: "",
  todoId: undefined,
  allDay: false,
  start: undefined,
  end: undefined,
  apptType: '',
  completed: '',
  resourceId: '',
  userEmail: '',
  followUpDay1: '',
  financeId: '',
  direction: '',
  resultOfcall: '',
  firstName: '',
  lastName: '',
  email: '',
  brand: '',
  intent: '',
  contactMethod: '',
  completed: '',
  apptStatus: '',
  apptType: '',
  unit: '',
  brand: '',
  title: '',
  note: '',
  phone: '',
  address: '',
  userId: '',
  userName: '',
  messageTitle: '',
  attachments: '',

}
/**
import React, { Fragment, useMemo, useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import { Calendar, Views, dayjsLocalizer } from 'react-big-calendar'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import { LinksFunction } from '@remix-run/node'
import stylesheet from './overviewUtils/styles2.css'
import { type ActionFunction, type DataFunctionArgs, json, redirect, } from '@remix-run/node';
;
import { model } from '~/models';
import financeFormSchema from '../../routes/overviewUtils/financeFormSchema';
import { Form, useLoaderData, useSubmit, Link, useFetcher, useNavigate, useNavigation } from '@remix-run/react'
import { getAllFinanceAptsForCalendar, getSingleFinanceAppts } from '~/utils/financeAppts/get.server';
import { prisma } from "~/libs";
import { Flex, Text, Button, Card, Heading, Container, IconButton } from '@radix-ui/themes';
import { UserPlus, Gauge, CalendarCheck, Search } from 'lucide-react'
import EventInfo from "~/components/dashboard/calendar/EventInfo"
import AddEventModal from "~/components/dashboard/calendar/AddEventModal"
import EventInfoModal from "~/components/dashboard/calendar/EventInfoModal"
import AddDatePickerEventModal from "~/components/dashboard/calendar/createAppt"
const DragAndDropCalendar = withDragAndDrop(Calendar)

export async function loader({ request }: DataFunctionArgs) {
      let account = await requireAuthCookie(request);
    const user = await model.user.query.getForSession({ email: account.email });
  const userId = user?.id
  const userEmail = user?.email
  const salesData = await getAllFinanceAptsForCalendar(userId)
  const Delivery = await prisma.clientApts.findMany({
    where: { apptStatus: 'Delivery', },
    orderBy: { createdAt: 'desc', },
  });
  //  console.log(salesData)
  return json({ salesData, user, Delivery })
}

export const links = () => [{ rel: "stylesheet", href: stylesheet },]



const resourceMap = [
  { resourceId: 1, resourceTitle: 'Sales Calls' },
  { resourceId: 2, resourceTitle: 'Sales Appointments' },
  { resourceId: 3, resourceTitle: 'Deliveries' },
  { resourceId: 4, resourceTitle: 'F & I' },
]
dayjs.extend(timezone)

export default function DnDResource() {
  const { salesData } = useLoaderData()
  // add an hour to start so each appt has an end
  const formattedData = salesData.map(event => ({
    ...event,
    start: new Date(event.start),
    end: new Date(new Date(event.start).setHours(new Date(event.start).getHours() + 1)),
  }));
  // state to store events

  const events = [
    {
      id: 0,
      title: 'Board meeting',
      start: new Date(2018, 0, 29, 9, 0, 0),
      end: new Date(2018, 0, 29, 13, 0, 0),
      resourceId: [1, 2],
    },
    {
      id: 1,
      title: 'MS training',
      start: new Date(2018, 0, 29, 14, 0, 0),
      end: new Date(2018, 0, 29, 16, 30, 0),
      resourceId: 2,
    },
    {
      id: 2,
      title: 'Team lead meeting',
      start: new Date(2018, 0, 29, 8, 30, 0),
      end: new Date(2018, 0, 29, 12, 30, 0),
      resourceId: 3,
    },
    {
      id: 10,
      title: 'Board meeting',
      start: new Date(2018, 0, 30, 23, 0, 0),
      end: new Date(2018, 0, 30, 23, 59, 0),
      resourceId: 1,
    },
    {
      id: 11,
      title: 'Birthday Party',
      start: new Date(2018, 0, 30, 7, 0, 0),
      end: new Date(2018, 0, 30, 10, 30, 0),
      resourceId: 4,
    },
    {
      id: 12,
      title: 'Board meeting',
      start: new Date(2018, 0, 29, 23, 59, 0),
      end: new Date(2018, 0, 30, 13, 0, 0),
      resourceId: 1,
    },
    {
      id: 13,
      title: 'Board meeting',
      start: new Date(2018, 0, 29, 23, 50, 0),
      end: new Date(2018, 0, 30, 13, 0, 0),
      resourceId: 2,
    },
    {
      id: 14,
      title: 'Board meeting',
      start: new Date(2018, 0, 29, 23, 40, 0),
      end: new Date(2018, 0, 30, 13, 0, 0),
      resourceId: 4,
    },
  ]

  const [myEvents, setMyEvents] = useState(events)//formattedData)
  // for add create appoint modal
  const quotes = formattedData

  const localizer = dayjsLocalizer(dayjs)
  // toggles weather to make a copy when ddraging, i justr set it to false instead
  const [copyEvent, setCopyEvent] = useState(false)
  const toggleCopyEvent = useCallback(() => setCopyEvent((val) => !val), [])
  // dnd
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

  // min and max times
  const minTime = new Date();
  minTime.setHours(8, 0, 0);

  const maxTime = new Date();
  maxTime.setHours(21, 30, 0);

  // add appointment modal
  const [openDatepickerModal, setOpenDatepickerModal] = useState(false)
  const handleDatePickerClose = () => {
    setOpenDatepickerModal(false)
  }
  const [datePickerEventFormData, setDatePickerEventFormData] =
    useState<DatePickerEventFormData>(initialDatePickerEventFormData)

  const onAddEventFromDatePicker = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    const addHours = (date: Date | undefined, hours: number) => {
      return date ? date.setHours(date.getHours() + hours) : undefined
    }

    const setMinToZero = (date: Date | undefined) => {
      if (date) {
        date.setSeconds(0);
      }
      return date;
    }

    const data: IEventInfo = {
      ...datePickerEventFormData,
      _id: generateId(),
      start: setMinToZero(datePickerEventFormData.start),
      end: datePickerEventFormData.allDay
        ? addHours(datePickerEventFormData.start, 12)
        : setMinToZero(datePickerEventFormData.end),

    }

    const newEvents = [...events, data]

    setEvents(newEvents)
    setDatePickerEventFormData(initialDatePickerEventFormData)
  }

  const [todos, setTodos] = useState<ITodo[]>([]);
  const uniqueQuotes = quotes.filter((quote, index, self) =>
    self.findIndex((q) => q.email === quote.email) === index
  );

  return (
    <Fragment>
      <Container className='bg-white mt-2 z-20'>
        <Card className=' mt-2'>

          <Flex direction="row">
            <Flex gap='1' align="center" direction="column" justify="start" p='2'>

              <IconButton onClick={() => setOpenDatepickerModal(true)}>
                <UserPlus size={20} strokeWidth={1.5} />
              </IconButton>
              <IconButton onClick={() => setOpenDatepickerModal(true)}>
                <Gauge size={20} strokeWidth={1.5} />
              </IconButton>
              <IconButton onClick={() => setOpenDatepickerModal(true)}>
                <CalendarCheck size={20} strokeWidth={1.5} />
              </IconButton>
              <IconButton onClick={() => setOpenDatepickerModal(true)}>
                <Search size={20} strokeWidth={1.5} />
              </IconButton>

            </Flex>

            <AddDatePickerEventModal
              open={openDatepickerModal}
              handleClose={handleDatePickerClose}
              datePickerEventFormData={datePickerEventFormData}
              setDatePickerEventFormData={setDatePickerEventFormData}
              onAddEvent={onAddEventFromDatePicker}
              todos={todos}
              uniqueQuotes={uniqueQuotes}

            />
            <div className="h-[750px]">
              <DragAndDropCalendar
                defaultDate={defaultDate}
                defaultView={Views.DAY}
                events={myEvents}
                min={minTime}
                max={maxTime}
                components={{ event: EventInfo }}
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
          </Flex>

        </Card>
      </Container >
    </Fragment>
  )
}
DnDResource.propTypes = {
  localizer: PropTypes.instanceOf(dayjsLocalizer),
}


interface IProps {
  open: boolean;
  handleClose: () => void;
  datePickerEventFormData: any; // replace with the correct type
  setDatePickerEventFormData: (data: any) => void; // replace with the correct type
  onAddEvent: () => void;
  todos: any[]; // replace with the correct type
  onClose: (value: string) => void;
  selectedValue: string;
  openDialog: boolean;
}

export interface ITodo {
  _id: string
  title: string
  color?: string
  Email: string
  SMS: string
  InPerson: string
  Phone: string
  completed: string
}

export interface IEventInfo extends Event {
  _id: string
  id: string
  description: string
  todoId?: string
  contactMethod: string
  firstName: string
  lastName: string
  financeId: string
  completed: string
  email: string
  phone: string
  userEmail: string
  unit: string
  title: string
  brand: string
  note: string
  apptType: string
  apptStatus: string
  userId: string
  getClientFileById: string
}

export interface EventFormData {
  description: string
  todoId?: string
  completed: string
  apptType: string,

}

export interface DatePickerEventFormData {
  description: string
  todoId?: string
  allDay: boolean
  start?: Date
  end?: Date
  apptType: string,
  completed: string,
}

const initialEventFormState: EventFormData = {
  description: "",
  todoId: undefined,
  completed: 'no',
  apptType: '',

}

const initialDatePickerEventFormData: DatePickerEventFormData = {
  description: "",
  todoId: undefined,
  allDay: false,
  start: undefined,
  end: undefined,
  apptType: '',
  completed: '',
}
 */

/*
import 'moment-timezone'
import { Form, useLoaderData, useSubmit, Link, useFetcher, useNavigate, useNavigation } from '@remix-run/react'
import React, { type MouseEvent, Fragment, useCallback, useMemo, useState, useEffect } from "react"
import { Box, ButtonGroup, Card, Dialog, CardContent, CardHeader, Container, DialogTitle, Divider, Typography } from "@mui/material"
import { Flex, Text, Button, Heading } from '@radix-ui/themes';
import { Calendar, type Event, dateFnsLocalizer, Views } from "react-big-calendar"
import format from "date-fns/format"
import parse from "date-fns/parse"
import startOfWeek from "date-fns/startOfWeek"
import getDay from "date-fns/getDay"
import enUS from "date-fns/locale/en-US"
import PropTypes from 'prop-types'
//import "react-big-calendar/lib/css/react-big-calendar.css"
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import EventInfo from "~/components/dashboard/calendar/EventInfo"
import AddEventModal from "~/components/dashboard/calendar/AddEventModal"
import EventInfoModal from "~/components/dashboard/calendar/EventInfoModal"
import { AddTodoModal } from "~/components/dashboard/calendar/AddTodoModal"
import AddDatePickerEventModal from "~/components/dashboard/calendar/createAppt"
import { getAllFinanceAptsForCalendar, getSingleFinanceAppts } from '~/utils/financeAppts/get.server';
import { type ActionFunction, type DataFunctionArgs, json, redirect, } from '@remix-run/node';
;
import { model } from '~/models';
import financeFormSchema from './overviewUtils/financeFormSchema';
import { updateDashData } from '~/utils/dashboard/update.server';
import AddCustomer from '~/components/dashboard/calls/addCustomer'
import { dashboardAction } from '~/components/actions/dashboardCalls'
import stylesheet from './overviewUtils/styles2.css'
import { commitSession, getSession } from "~/utils/pref.server";
import { prisma } from "~/libs";
import updateFinance23 from '~/components/dashboard/calls/actions/updateFinance'
import { createfinanceApt } from '~/utils/financeAppts/create.server'
import { getLastAppointmentForFinance } from '~/utils/client/getLastApt.server'
import {
  Alert,
  ButtonLoading,
  Debug,
  InputPassword,
  Layout,
  PageHeader,
  RemixForm,
  RemixLinkText,
} from "~/components";
export const links = () => [{ rel: "stylesheet", href: stylesheet },]

export async function loader({ request }: DataFunctionArgs) {
  const userSession = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  const user = await model.user.query.getForSession({ id: userSession.id });
  const userId = user?.id
  const testdate = new Date()
  console.log(testdate, 'testdate')
  const userEmail = user?.email
  const salesData = await getAllFinanceAptsForCalendar(userId)
  const Delivery = await prisma.clientApts.findMany({
    where: {
      apptStatus: 'Delivery',
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  const quotes = salesData




  //  console.log(salesData)
  return json({ salesData, user, quotes, Delivery })
}
let action = dashboardAction

const DragAndDropCalendar = withDragAndDrop(Calendar)

const locales = {
  "en-US": enUS,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

export interface ITodo {
  _id: string
  title: string
  color?: string
  Email: string
  SMS: string
  InPerson: string
  Phone: string
  completed: string
}

export interface IEventInfo extends Event {
  _id: string
  id: string
  description: string
  todoId?: string
  contactMethod: string
  firstName: string
  lastName: string
  financeId: string
  completed: string
  email: string
  phone: string
  userEmail: string
  unit: string
  title: string
  brand: string
  note: string
  apptType: string
  apptStatus: string
  userId: string
  getClientFileById: string
  userName: string
}

export interface EventFormData {
  description: string
  todoId?: string
  completed: string
  apptType: string,

}

export interface DatePickerEventFormData {
  description: string
  todoId?: string
  allDay: boolean
  start?: Date
  end?: Date
  apptType: string,
  completed: string,
}

export const generateId = () => (Math.floor(Math.random() * 10000) + 1).toString()

const initialEventFormState: EventFormData = {
  description: "",
  todoId: undefined,
  completed: 'no',
  apptType: '',

}

const initialDatePickerEventFormData: DatePickerEventFormData = {
  description: "",
  todoId: undefined,
  allDay: false,
  start: undefined,
  end: undefined,
  apptType: '',
  completed: '',
}

function EventCalendar() {
  const { salesData, user, quotes, Delivery } = useLoaderData();
  const submit = useSubmit();

  const uniqueQuotes = quotes.filter((quote, index, self) =>
    self.findIndex((q) => q.email === quote.email) === index
  );

  const [openSlot, setOpenSlot] = useState(false)
  const [openDatepickerModal, setOpenDatepickerModal] = useState(false)
  const [openTodoModal, setOpenTodoModal] = useState(false)
  const [currentEvent, setCurrentEvent] = useState<Event | IEventInfo | null>(null)

  const [eventInfoModal, setEventInfoModal] = useState(false)


  const formattedData = salesData.map(event => ({
    ...event,
    start: new Date(event.start),
    end: new Date(new Date(event.start).setHours(new Date(event.start).getHours() + 1)),
  }));
  //const formattedData = salesData.map(event => ({
  //   ...event,
  //   start: new Date(event.start),
  //   end: new Date(new Date(event.start).setHours(new Date(event.start).getHours() + 1)),
  // }));
  console.log(formattedData, 'formattedData')
  const [events, setEvents] = useState<IEventInfo[]>(formattedData);
  // console.log('daata', events)


  const [todos, setTodos] = useState<ITodo[]>([]);

  const [eventFormData, setEventFormData] = useState<EventFormData>(initialEventFormState)

  const [datePickerEventFormData, setDatePickerEventFormData] =
    useState<DatePickerEventFormData>(initialDatePickerEventFormData)

  const handleSelectSlot = (event: Event) => {
    setOpenSlot(true)
    setCurrentEvent(event)
  }

  const handleSelectEvent = (event: IEventInfo) => {
    setCurrentEvent(event)
    setEventInfoModal(true)
  }

  const handleClose = () => {
    setEventFormData(initialEventFormState)
    setOpenSlot(false)
  }


  const handleDatePickerClose = () => {
    setOpenDatepickerModal(false)
  }


  const onAddEvent = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()


    const data: IEventInfo = {
      ...eventFormData,
      _id: generateId(),
      start: currentEvent?.start,
      end: currentEvent?.end,
      completed: currentEvent?.completed,
      apptType: currentEvent?.apptType,
    }

    const newEvents = [...events, data]

    setEvents(newEvents)
    handleClose()
  }

  const onAddEventFromDatePicker = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    const addHours = (date: Date | undefined, hours: number) => {
      return date ? date.setHours(date.getHours() + hours) : undefined
    }

    const setMinToZero = (date: Date | undefined) => {
      if (date) {
        date.setSeconds(0);
      }
      return date;
    }

    const data: IEventInfo = {
      ...datePickerEventFormData,
      _id: generateId(),
      start: setMinToZero(datePickerEventFormData.start),
      end: datePickerEventFormData.allDay
        ? addHours(datePickerEventFormData.start, 12)
        : setMinToZero(datePickerEventFormData.end),

    }

    const newEvents = [...events, data]

    setEvents(newEvents)
    setDatePickerEventFormData(initialDatePickerEventFormData)
  }

  const onDeleteEvent = () => {
    setEvents(() => [...events].filter((e) => e._id !== (currentEvent as IEventInfo)._id!))
    setEventInfoModal(false)
  }

  const onCompleteEvent = () => {
    setEventInfoModal(false)
  }




  // drag and drop
  const [myEvents, setMyEvents] = useState(salesData)

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
    },
    [setMyEvents]
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

  const minTime = new Date();
  minTime.setHours(8, 0, 0);

  const maxTime = new Date();
  maxTime.setHours(21, 30, 0);

  let allViews = Object.keys(Views).map((k) => Views[k])

  //tryout
  const [openDialog, setOpenDialog] = React.useState(false);

  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = (value: string) => {
    setOpenDialog(false);
    ;
  };
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  return (


    <Container className='bg-white mt-2 z-20'>
      <Card className=' mt-2'>
        <CardContent className=''>
          <Flex direction="row">

            <Flex gap='1' align="center" direction="column">
              <ButtonLoading
                size="lg"
                type="submit"
                className="w-auto cursor-pointer ml-auto mt-5 hover:text-[#02a9ff]"
                name="intent"
                value="clientProfile"
                isSubmitting={isSubmitting}
                loadingText="Adding appointment..."
                onClick={() => setOpenDatepickerModal(true)}
              >
                Add Appt
              </ButtonLoading>
              <Link to='/dashboard/calls' >
                <ButtonLoading
                  size="lg"
                  type="submit"
                  className="w-auto cursor-pointer ml-auto mt-5 hover:text-[#02a9ff]"
                  name="intent"
                  value="clientProfile"
                  isSubmitting={isSubmitting}
                  loadingText="Adding appointment..."
                >
                  Dashboard
                </ButtonLoading>
              </Link>
              <Button size='4' variant="ghost"
                className=" w-[75px]  cursor-pointer mt-2 mx-1 text-slate12  font-bold uppercase   text-xs  rounded  outline-none focus:outline-none  ease-linear transition-all text-center duration-150"
                onClick={() => setOpenDatepickerModal(true)}  >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-user-plus"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" x2="19" y1="8" y2="14" /><line x1="22" x2="16" y1="11" y2="11" /></svg>              </Button>
              <Form method="post" onChange={(event) => { submit(event.currentTarget); }}>

                <input type='hidden' name='intent' value='calendarType' />

                <select
                  name='calendar'
                  className='w-[80%]   h-8 cursor-pointer mt-2  rounded border-1 border-[#60b9fd] bg-slate1 text-slate12 placeholder-blue-300 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]'>
                  <option value="sales">sales</option>
                  <option value="parts">parts</option>
                  <option value="service">service</option>
                  <option value="accessories">accessories</option>
                  <option value="deliveries">deliveries</option>
                  <option value="finance">finance</option>
                </select>

              </Form>
            </Flex>
            <Divider style={{ margin: 10 }} />

            <AddEventModal
              open={openSlot}
              handleClose={handleClose}
              eventFormData={eventFormData}
              setEventFormData={setEventFormData}
              onAddEvent={onAddEvent}
              todos={todos}
            />
            <AddDatePickerEventModal
              open={openDatepickerModal}
              handleClose={handleDatePickerClose}
              datePickerEventFormData={datePickerEventFormData}
              setDatePickerEventFormData={setDatePickerEventFormData}
              onAddEvent={onAddEventFromDatePicker}
              todos={todos}
              uniqueQuotes={uniqueQuotes}

            />
            <EventInfoModal
              open={eventInfoModal}
              handleClose={() => setEventInfoModal(false)}
              onDeleteEvent={onDeleteEvent}
              currentEvent={currentEvent as IEventInfo}
              user={user}
              onCompleteEvent={onCompleteEvent}
            />
            <AddTodoModal
              open={openTodoModal}
              handleClose={() => setOpenTodoModal(false)}
              todos={todos}
              setTodos={setTodos}
            />
            <DragAndDropCalendar
              localizer={localizer}

              events={events}
              min={minTime}
              max={maxTime}
              onSelectEvent={handleSelectEvent}
              onSelectSlot={handleSelectSlot}
              endAccessor="end"
              startAccessor="start"
              selectable
              components={{ event: EventInfo }}
              draggableAccessor={() => true}
              defaultView={Views.WEEK}
              views={allViews}
              /*  eventPropGetter={(event) => {
                     let backgroundColor = 'white';
                    let color = 'black';
                      let borderColor = 'black';
                      let height = 900;
                       let fontWeight = 'bold';

                     if (event.apptType && event.apptType.includes('Sales')) {
                      backgroundColor = 'red'; // Change the background color for Sales events
                        color = 'white'; // Change the text color for Sales events
                       }
                      if (event.completed && event.completed.includes('yes')) {
                          backgroundColor = 'green'; // Change the background color for completed events
                          color = 'white'; // Change the text color for completed events
                    /*      }
                    return {
                      style: {
                        backgroundColor,
                        color,
                        fontWeight,
                      },
                    };
                  }}
              style={{
                height: 900,
              }}
              onEventDrop={moveEvent}
              onEventResize={resizeEvent}
              popup
              resizable
            />
          </Flex>
        </CardContent>
      </Card>
    </Container >

  )
}

export default EventCalendar


interface IProps {
  open: boolean;
  handleClose: () => void;
  datePickerEventFormData: any; // replace with the correct type
  setDatePickerEventFormData: (data: any) => void; // replace with the correct type
  onAddEvent: () => void;
  todos: any[]; // replace with the correct type
  onClose: (value: string) => void;
  selectedValue: string;
  openDialog: boolean;
}

const TryoutDialog = ({
  open,
  handleClose,
  datePickerEventFormData,
  setDatePickerEventFormData,
  onAddEvent,
  todos,
  onClose,
  selectedValue,
  openDialog,
}: IProps) => {
  const handleCloseDialog = () => {
    onClose(selectedValue);
  };

  <div>
    <Typography variant="subtitle1" component="div">
      Selected: test dialog
    </Typography>
    <br />
    <Button variant="outlined" onClick={() => setOpenDialog(true)}
    >
      Open simple dialog
    </Button>
    <TryoutDialog
      open={openDialog}
      onClose={handleCloseDialog} handleClose={function (): void {
        throw new Error('Function not implemented.');
      }} datePickerEventFormData={undefined} setDatePickerEventFormData={function (data: any): void {
        throw new Error('Function not implemented.');
      }} onAddEvent={function (): void {
        throw new Error('Function not implemented.');
      }} todos={[]} selectedValue={''} openDialog={false} />
  </div>
  const handleListItemClick = (value: string) => {
    onClose(value);
  };



  return (
    <Dialog onClose={handleCloseDialog} open={openDialog}>
      <DialogTitle>Set backup account</DialogTitle>
    </Dialog>
  );
};



function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
  const [value, setValue] = React.useState(initialValue)

  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value])

  return (
    <input {...props} value={value} onChange={e => setValue(e.target.value)} />
  )
}

export const fuzzyFilter: FilterFn<Person> = (
  row,
  columnId,
  value,
  addMeta
) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the ranking info
  addMeta(itemRank)

  // Return if the item should be filtered in/out
  return itemRank.passed
}


const fuzzySort: SortingFn<any> = (rowA, rowB, columnId) => {
  let dir = 0

  // Only sort by rank if the column has ranking information
  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId]?.itemRank!,
      rowB.columnFiltersMeta[columnId]?.itemRank!
    )
  }

  // Provide an alphanumeric fallback for when the item ranks are equal
  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir
}
*/
