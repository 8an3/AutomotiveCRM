import { getAllFinanceAptsForCalendar, getSingleFinanceAppts } from '~/utils/financeAppts/get.server';
import { type ActionFunction, type DataFunctionArgs, json, redirect, LoaderFunction } from '@remix-run/node';
;
import { model } from '~/models';
import { GetUser } from "~/utils/loader.server";
import { prisma } from "~/libs";
import React, { type SetStateAction, type MouseEvent, useCallback, type Dispatch, useState, useRef, useEffect } from "react"

import { type IEventInfo } from "../../../routes/calendar.sales"
import { Link, Form, useLoaderData, useSubmit, useFetcher } from '@remix-run/react'
import { Button, Input, Label } from "~/components/ui";
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import AddCustomer from '~/components/dashboard/calls/addCustomer'
import financeFormSchema from '../routes/overviewUtils/financeFormSchema';
import AddEventModal from "~/components/backups/AddEventModal"

import 'moment-timezone'
import { Calendar, type Event, dateFnsLocalizer, Views } from "react-big-calendar"
import format from "date-fns/format"
import parse from "date-fns/parse"
import startOfWeek from "date-fns/startOfWeek"
import getDay from "date-fns/getDay"
import enUS from "date-fns/locale/en-US"
//import "react-big-calendar/lib/css/react-big-calendar.css"
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import EventInfo from "~/components/dashboard/calendar/EventInfo"
import AddDatePickerEventModal from "~/components/backups/createApptModal2222"
import stylesheet from './overviewUtils/styles2.css'
import { commitSession, getSession } from "~/utils/pref.server";
import updateFinance23 from '~/components/dashboard/calls/actions/updateFinance'
import { createfinanceApt } from '~/utils/financeAppts/create.server'
import { getLastAppointmentForFinance } from '~/utils/client/getLastApt.server'
import { getSession as sessionGet, getUserByEmail } from '~/utils/user/get'




export const links = () => [{ rel: "stylesheet", href: stylesheet },]


export async function loader({ request, params }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")


  const user = await GetUser(email)
  /// console.log(user, account, 'wquiote loadert')
  if (!user) {
    redirect('/login')
  }

  if (!user) { return json({ status: 302, redirect: '/login' }) };
  console.log(user, 'email')
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


export const action: ActionFunction = async ({
  req,
  request,
  params,
}) => {
  const formPayload = Object.fromEntries(await request.formData());
  const userSession = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  const user = await model.user.query.getForSession({ id: userSession.id });
  const userId = user?.id;
  const intent = formPayload.intent;
  const session = await getSession(request.headers.get("Cookie"));
  let formData = financeFormSchema.parse(formPayload);
  if (intent === "calendarType") {
    const calendar = formData.calendar
    if (calendar === 'sales') {
      return redirect('/calendar/sales');
    } else if (calendar === 'parts') {
      return redirect('/calendar/parts');
    } else if (calendar === 'service') {
      return redirect('/calendar/service');
    } else if (calendar === 'accessories') {
      return redirect('/calendar/accessories');
    } else if (calendar === 'deliveries') {
      return redirect('/calendar/deliveries');
    }
    else if (calendar === 'finance') {
      return redirect('/calendar/finance');
    }
  }
  console.log(formData, 'formData dashboardcalls')
  const today = new Date();
  let followUpDay = today;
  const clientfileId = formData.clientfileId;

  const financeId = formData?.financeId;
  const dashboard = await prisma.dashboard.findUnique({
    where: {
      financeId: financeId,
    },
  });
  const dashboardId = dashboard?.id;
  // const userEmail = user?.email
  session.set("financeId", financeId);
  session.set("clientfileId", clientfileId);
  const clientAppt = await prisma.clientApts.findMany({
    where: {
      financeId: financeId,
    },
  });
  /// console.log(clientAppt, 'clientAppt')

  const cookie = await commitSession(session)
  let pickUpDate;
  if (pickUpDate === null || pickUpDate === undefined) {
    pickUpDate = "To Be Det.";
  }
  const email = formData?.email;
  //const dashboardId = formData?.dashboard
  const id = formData?.id;
  // console.log(financeId, 'financeId', id, 'id', clientfileId, 'clientfileId',)
  async function CompleteLastAppt(userId, financeId) {
    const lastApt = await getSingleFinanceAppts(financeId);
    if (lastApt) {
      let apptId = lastApt?.id;
      const data = {
        completed: 'yes',
        userId: userId,
      }
      const finance = await prisma.clientApts.update({
        data: {
          ...data,
        },
        where: {
          id: apptId,
        },
      });
      return finance
    }
  }
  async function TwoDays() {
    const lastContact = new Date().toISOString();
    let customerState = formData.customerState;
    if (customerState === "Pending") {
      customerState = "Attempted";
    }


    const followUpDay2 = parseInt(formData.followUpDay1);
    console.log('followUpDay:', followUpDay2);  // Add this line

    function addDays(days) {
      let currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + days);
      return currentDate;
    }

    let newDate = addDays(followUpDay2);
    newDate = new Date(newDate).toISOString();
    console.log('financeId:', financeId);  // Add this line

    let clientAptsData = {
      start: newDate,

      //end: formData.end,
      contactMethod: formData.contactMethod,
      completed: 'no',
      apptStatus: formData.apptStatus,
      apptType: formData.apptType,
      note: formData.note,
      unit: formData.unit,
      brand: formData.brand,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      financeId: formData.financeId,
      //description,
      userName: user?.name,
      title: 'Contacted by Instant Function',

      direction: 'Outgoing',
      resultOfcall: 'Attempted',
      userId,
    };

    const nextAppointment = newDate
    const followUpDay = newDate
    const formData3 = { ...formData, nextAppointment, followUpDay, lastContact, customerState, dashboardId }
    const updating = await updateFinance23(financeId, formData3, formPayload);


    const createFollowup = await createfinanceApt(financeId, clientAptsData)


    // const completeApt = await getLastAppointmentForFinance(financeId);
    //  console.log('hittind 2 days from noiw', formData, followUpDay, completeApt, createClientFinanceAptData)
    return json({ updating, createFollowup });
  }
  async function FollowUpApt() {
    const lastContact = new Date().toISOString();
    let customerState = formData.customerState;
    if (customerState === "Pending") {
      customerState = "Attempted";
    }
    let newDate = new Date()
    // console.log('newDate:', newDate);  // Add this line

    let dateModal = new Date(formData.dateModal);
    const timeOfDayModal = formData.timeOfDayModal;
    const [hours, minutes] = timeOfDayModal.split(':').map(Number);

    dateModal.setHours(hours, minutes);

    const year = dateModal.getFullYear();
    const month = String(dateModal.getMonth() + 1).padStart(2, '0');  // Months are 0-indexed in JavaScript
    const day = String(dateModal.getDate()).padStart(2, '0');
    const hour = String(dateModal.getHours()).padStart(2, '0');
    const minute = String(dateModal.getMinutes()).padStart(2, '0');

    const dateTimeString = `${year}-${month}-${day}T${hour}:${minute}:00.000`;

    console.log(dateTimeString, 'datemodal');
    let clientAptsData = {
      title: formData.titleModal,
      start: dateTimeString,

      //end: formData.end,
      contactMethod: formData.contactMethodModal,
      completed: 'no',
      apptStatus: formData.apptStatus,
      apptType: formData.apptType,
      note: formData.noteModal,
      unit: formData.unit,
      brand: formData.brand,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      financeId: formData.financeId,
      //description,
      userName: user?.name,
      title: 'Contacted by Instant Function',

      direction: 'Outgoing',
      resultOfcall: 'Attempted',
      userId,
    };

    const nextAppointment = dateTimeString
    const followUpDay = dateTimeString
    const formData3 = { ...formData, nextAppointment, followUpDay, lastContact, customerState, dashboardId }
    const updating = await updateFinance23(financeId, formData3, formPayload);


    const createFollowup = await createfinanceApt(financeId, clientAptsData)


    const completeApt = await getLastAppointmentForFinance(financeId);
    //  console.log('hittind 2 days from noiw', formData, followUpDay, completeApt, createClientFinanceAptData)
    return json({ updating, completeApt, createFollowup });
  }
  // calls

  if (intent === "completeAppt") {
    console.log('completeAppt')
    const complete = await CompleteLastAppt(userId, financeId)
    console.log('completed last appt')
    const addFU = formData.addFU
    const addDetailedFU = formData.addDetailedFU
    if (addFU === 'on') {
      const twoDays = await TwoDays()
      return json({ complete, twoDays })
    }
    if (addDetailedFU === 'yes') {
      const followup = await FollowUpApt()
      return json({ complete, followup })
    }

  }

  return null;
};


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
  const [open, setOpen] = React.useState(false);

  const [eventInfoModal, setEventInfoModal] = useState(false)
  const [data, setData] = React.useState(salesData)
  const [sales, setSales] = useState(salesData)
  const [service, setService] = useState('')
  const [parts, setParts] = useState('')
  const [accessories, setAccessories] = useState('')
  const [deliveries, setDeliveries] = useState('')
  const [calendarData, setCalendarData] = useState(salesData)
  const [calendarType, setCalendarType] = useState('sales')



  const formattedData = Delivery.map(event => ({
    ...event,
    start: new Date(event.start),
    end: new Date(new Date(event.start).setHours(new Date(event.start).getHours() + 1)),
  }));
  // const formattedData = salesData.map(event => ({
  //   ...event,
  //   start: new Date(event.start),
  //   end: new Date(new Date(event.start).setHours(new Date(event.start).getHours() + 1)),
  // }));

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

  const EventInfoModal = ({ user, open, handleClose, onDeleteEvent, currentEvent, onCompleteEvent }: IProps) => {
    const onClose = () => {
      handleClose()
    }

    // quick fu
    const [addFU, setAddFU] = useState('no');
    const handleInputChange = (e) => {
      const isChecked = e.target.checked;
      const newValue = isChecked ? 'yes' : 'no';
      setAddFU(newValue);
    };

    // detailed f u
    const [addDetailedFU, setAddDetailedFU] = useState('no');
    const handleInputChangeDetailed = (e) => {
      const isChecked = e.target.checked;
      const newValue = isChecked ? 'yes' : 'no';
      setAddDetailedFU(newValue);
    };

    const [value, onChange] = useState<Value>(new Date());
    const timerRef = useRef(0);
    const [date, setDate] = useState<Date>()
    const handleDateSelect = (selectedDate) => { setDate(selectedDate) };
    useEffect(() => {
      return () => clearTimeout(timerRef.current);
    }, []);
    const id = currentEvent?.id ? currentEvent?.id.toString() : '';

    return (
      <Dialog.Root open={open} onOpenChange={setOpen}>

        <Dialog.Portal>
          <Dialog.Overlay className="z-49 bg-background/80 backdrop-blur-sm data-[state=open]:animate-overlayShow fixed inset-0" />
          <Dialog.Content className="z-50 bg-slate1 data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
            <Dialog.Title className="text-mauve12 m-0 text-[17px] font-medium">
              Sales Delivery
            </Dialog.Title>
            <Dialog.Description className="text-mauve11 mt-[10px] mb-5 text-[15px] leading-normal">
              <Link to={`/customer/${currentEvent?.financeId}`} className='cursor-pointer hover:underline'>
                {currentEvent?.firstName} {currentEvent?.lastName}
              </Link>
            </Dialog.Description>
            <p>{currentEvent?.title}</p>

            <p>{currentEvent?.start?.toLocaleString()}</p>
            <p>Notes: {currentEvent?.note}</p>
            <p>Rep: {user.name}</p>



            <Dialog.Close asChild>
              <button
                className="text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
                aria-label="Close"
              >
                <Cross2Icon />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

    )
  }

  return (


    <Container className='bg-white mt-2 z-20'>
      <Card className=' mt-2'>
        <CardContent className=''>
          <div className="flex  items-center mt-2">
            <Button
              className="mx-1 bg-[#02a9ff] w-[75px]  cursor-pointer my-auto text-slate1 active:bg-black font-bold uppercase   text-xs  rounded shadow hover:shadow-md outline-none focus:outline-none  ease-linear transition-all text-center duration-150"
              onClick={() => setOpenDatepickerModal(true)}  >
              Add Appt
            </Button>
            <Link to='/dashboard/calls' >
              <Button
                className="mx-1 bg-[#02a9ff] w-[75px]  cursor-pointer my-auto  text-slate1 active:bg-black font-bold uppercase   text-xs  rounded shadow hover:shadow-md outline-none focus:outline-none  ease-linear transition-all text-center duration-150"
                onClick={() => setOpenDatepickerModal(true)}  >
                Dashboard
              </Button>
            </Link>
            <Button
              className=" bg-transparent w-[75px]  cursor-pointer my-auto mx-1 text-slate1  font-bold uppercase   text-xs  rounded  outline-none focus:outline-none  ease-linear transition-all text-center duration-150"
              onClick={() => setOpenDatepickerModal(true)}  >
              <AddCustomer />
            </Button>
            <Form method="post" onChange={(event) => { submit(event.currentTarget); }}>

              <input type='hidden' name='intent' value='calendarType' />

              <select

                name='calendar'
                className="w-[180px] bg-[#02a9ff] text-slate1 cursor-pointer h-5 text-xs font-bold uppercase ">
                <option value="sales">sales</option>
                <option value="parts">parts</option>
                <option value="service">service</option>
                <option value="accessories">accessories</option>
                <option value="deliveries">deliveries</option>
                <option value="finance">finance</option>
              </select>

            </Form>
          </div>
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
            eventPropGetter={(event) => {
              let backgroundColor = 'white';
              let color = 'black';
              let borderColor = 'black';
              let height = 900;
              let fontWeight = 'bold';

              if (event.apptType && event.apptType.includes('Sales')) {
                backgroundColor = 'red'; // Change the background color for Sales events
                color = 'white'; // Change the text color for Sales events
              }
              if (event.apptType && event.apptType.includes('Delivery')) {
                backgroundColor = '#3174ad'; // Change the background color for Sales events
                color = 'white'; // Change the text color for Sales events
              }
              if (event.completed && event.completed.includes('yes')) {
                backgroundColor = 'green'; // Change the background color for completed events
                color = 'white'; // Change the text color for completed events
              }
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


type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

interface IUser {
  id: number;
  name: string;
  // Add other properties as needed
}

interface IProps {
  open: boolean
  handleClose: Dispatch<SetStateAction<void>>
  onDeleteEvent: (e: MouseEvent<HTMLButtonElement>) => void
  onCompleteEvent: (e: MouseEvent<HTMLButtonElement>) => void
  currentEvent: IEventInfo | null
  user: IUser
}




/**
const EventInfoModal = ({ user, open, handleClose, onDeleteEvent, currentEvent, onCompleteEvent }: IProps) => {
  const onClose = () => {
    handleClose()
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>

      <Dialog.Portal>
        <Dialog.Overlay className="z-49 bg-background/80 backdrop-blur-sm data-[state=open]:animate-overlayShow fixed inset-0" />
        <Dialog.Content className="z-50 bg-slate1 data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
          <Dialog.Title className="text-mauve12 m-0 text-[17px] font-medium">
            Sales Delivery
          </Dialog.Title>
          <Dialog.Description className="text-mauve11 mt-[10px] mb-5 text-[15px] leading-normal">
            <Link to={`/customer/${currentEvent?.financeId}`} className='cursor-pointer hover:underline'>
              {currentEvent?.firstName} {currentEvent?.lastName}
            </Link>
          </Dialog.Description>
          <p> {currentEvent?.title}</p>
          <p>{currentEvent?.year} {currentEvent?.make}</p>
          <p>{currentEvent?.model} {currentEvent?.trim}</p>
          <div className="mt-[25px] flex justify-end">
            <Dialog.Close asChild>

            </Dialog.Close>
          </div>
          <Dialog.Close asChild>
            <button
              className="text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
              aria-label="Close"
            >
              <Cross2Icon />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
//const [events, setEvents] = React.useState([dummyEvent]);
// console.log(events, 'events')
return (
  <>
    <div className="flex flex-col items-center justify-center border-2 border-gray-300 p-2 rounded-lg my-auto mx-auto ">

      <AddEventModal
        open={openSlot}
        handleClose={handleClose}
        eventFormData={eventFormData}
        setEventFormData={setEventFormData}
        onAddEvent={onAddEvent}
        todos={todos}
      />

      <EventInfoModal
        open={open}
        handleClose={() => setEventInfoModal(false)}
        onDeleteEvent={onDeleteEvent}
        currentEvent={currentEvent as IEventInfo}
        user={user}
        onCompleteEvent={onCompleteEvent}
      />
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        popup
        onSelectEvent={handleEventClick}

      />
    </div>
  </>
)
} */
