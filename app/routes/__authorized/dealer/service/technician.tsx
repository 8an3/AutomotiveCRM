
import { Fragment, useState, useCallback, useEffect, useRef, useMemo, useDeferredValue } from 'react'
import { Calendar, Views, dayjsLocalizer, Navigate } from 'react-big-calendar'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import { type LinksFunction, type LoaderFunction, type ActionFunction, json, redirect, } from '@remix-run/node'
import { useLoaderData, Link, useNavigate, useSubmit, useFetcher, useSearchParams, Form, useNavigation } from '@remix-run/react'
import { prisma } from "~/libs";
import { Text, } from '@radix-ui/themes';
import { UserPlus, Gauge, CalendarPlus, ChevronsLeft, ChevronsRightLeft, ChevronsRight } from 'lucide-react';
//import EventInfo from "~/components/serviceDept/EventInfo"
import financeFormSchema from "~/overviewUtils/financeFormSchema";
import clsx from 'clsx'
import { getSession, commitSession } from '~/sessions/auth-session.server';
import rbc from "~/styles/rbc.css";
import { Button, buttonVariants, Popover, PopoverTrigger, PopoverContent, Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue, Input, Card, } from "~/components";
import { CalendarIcon, ClockIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import { Calendar as SmallCalendar } from '~/components/ui/calendar';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion"
import base from "~/styles/base.css";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import { GetUser } from "~/utils/loader.server";
import styles1 from "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { ListFilter } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip"
import useSWR from 'swr'
import calendarIcon from '~/images/favicons/calendar.svg'
import {
  useScreenSize, ViewNamesGroup, CustomToolbar, mobileToolbar, noToolbar, colors, resourceTitle,
  IEventInfo, EventFormData, DatePickerEventFormData, initialEventFormState, initialDatePickerEventFormData, IProps, ViewToolbar
} from '~/components/calendar/shared'


export default function DnDResource() {
  const { order, user, allServiceApts, techs } = useLoaderData()
  const isSmallScreen = useScreenSize();
  const navigate = useNavigate()

  const [view, setView] = useState(Views.DAY)
  const onView = useCallback((newView) => setView(newView), [setView])
  const submit = useSubmit();

  const [getDomain, setGetDomain] = useState("http://localhost:3000");

  useEffect(() => {
    const currentHost = typeof window !== "undefined" ? window.location.host : null;
    if (currentHost === "dealersalesassistant.ca") {
      setGetDomain("https://www.dealersalesassistant.ca")
    }
  }, []);

  const formattedData = allServiceApts.map(event => ({
    ...event,
    start: new Date(event.start),
    end: new Date(event.end),
    isDraggable: true,
  }));

  const [myEvents, setMyEvents] = useState(formattedData)
  const localizer = dayjsLocalizer(dayjs)
  // min and max times
  const minTime = new Date();
  minTime.setHours(8, 0, 0);

  const maxTime = new Date();
  maxTime.setHours(21, 30, 0);

  const [datePickerEventFormData, setDatePickerEventFormData] =
    useState<DatePickerEventFormData>(initialDatePickerEventFormData)
  // add event modal
  const [openSlot, setOpenSlot] = useState(false)
  const handleSelectSlot = (event: Event) => {
    setOpenSlot(true)
    setCurrentEvent(event)
  }
  const generateId = () => (Math.floor(Math.random() * 10000) + 1).toString()
  const handleClose = () => {
    setEventFormData(initialEventFormState)
    setOpenSlot(false)
  }
  const [eventFormData, setEventFormData] = useState<EventFormData>(initialEventFormState)

  const [currentEvent, setCurrentEvent] = useState<Event | IEventInfo | null>(null)
  // event info modal
  const [eventInfoModal, setEventInfoModal] = useState(false)
  const [selected, setSelected] = useState<Event | IEventInfo | null>(null)

  function HandleSelectEvent(event) {
    const data = FetchData(event.id);
    setSelected(event);
    navigate(`/dealer/service/technician/workOrder/${event.workOrderId}`)
    // setEventInfoModal(true)
  }

  const closeSelectEvent = useCallback(() => {
    setEventInfoModal(false)
  }, []);

  const onDeleteEvent = () => {
    setCurrentEvent(() => [...events].filter((e) => e._id !== (currentEvent as IEventInfo)._id!))
    setEventInfoModal(false)
  }
  const onCompleteEvent = () => {
    setEventInfoModal(false)
  }

  const [showResources, setShowResources] = useState(false);

  const toggleView = () => {
    setShowResources(prevState => !prevState);
  };

  const [date, setDate] = useState<Date>()

  const newDate = new Date()

  const onNavigate = useCallback((newDate) => setDate(newDate), [setDate])

  // ---------------------- dnd
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
      console.log(event, 'move event')
      const formData = new FormData();
      formData.append("start", start);
      formData.append("end", end);
      formData.append("tech", event.resourceId);
      formData.append("id", event.id);
      formData.append("intent", 'moveEvent');
      submit(formData, { method: "post" });

    },
    []
  )
  const eventPropGetter = (event) => {
    let newStyle = {
      color: 'white',
    };
    return {
      className: "border border-border",
      style: newStyle
    };
  };

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
      formData.append("tech", event.resourceId);
      formData.append("id", event.id);
      formData.append("intent", 'moveEvent');
      console.log(event, 'submitting')
      submit(formData, { method: "post" });

    },
    []
  )

  async function FetchData(id) {
    const fetcher = url => fetch(url).then(r => r.json())
    try {
      const { data, error } = useSWR(`http://localhost:3000/dealer/api/singleServiceAppt?apptId=${id}`, fetcher)
      return json({ data })
    } catch (error) {
      console.error('Error fetching appointment data:', error);
    }
  };
  /// ------------------- end of dnd


  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const dataFetcher = (url) => fetch(url).then(res => res.json());
  const { data: swrData } = useSWR(isSubmitting ? getDomain + `/dealer/service/technician/reload/tech@email.com` : null, dataFetcher, {})

  useEffect(() => {
    if (swrData) {
      setMyEvents(swrData);
      console.log('hitswr!! ')
    }
  }, [swrData]);

  const LargeScreenUI = () => {
    return (
      <Fragment>
        <div className="large-screen-ui">
          <>
            <div className="h-[75px]  w-auto  border-b border-border bg-background text-foreground">
              <h2 className="ml-[100px] text-2xl font-bold tracking-tight">Technician Calendar</h2>
              <p className="text-muted-foreground   ml-[105px]  ">
              </p>
            </div>
            <div className=" grow">
              <div className='flex w-auto '>
                <div className='h-screen w-[310px] border-r border-border'>
                  <div className=' mt-5 flex-col mx-auto justify-center'>
                    <div className="mx-auto w-[280px] rounded-md border-white bg-background px-3 text-foreground " >
                      <div className='  my-3 flex justify-center   '>
                        <CalendarIcon className="mr-2 size-8 " />
                        {date ? format(date, "PPP") : <span>{format(newDate, "PPP")}</span>}
                      </div>
                      <SmallCalendar
                        className='mx-auto w-auto   bg-background text-foreground'
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </div>
                    <ViewToolbar setView={setView} />

                  </div>
                </div>
                <div className="flex w-[97%] justify-center overflow-clip">
                  <DragAndDropCalendar
                    style={{
                      width: `calc(100vw - 310px)`,
                      height: "100vh",
                      overflowX: "hidden",
                      overflowY: "scroll",
                      objectFit: "contain",
                      overscrollBehavior: "contain",
                      color: "white",
                    }}
                    selected={selected}
                    defaultView={Views.DAY}
                    events={myEvents}
                    onView={onView}
                    view={view}
                    step={15}
                    showMultiDayTimes={true}
                    localizer={localizer}
                    min={minTime}
                    max={maxTime}
                    date={date}
                    onNavigate={onNavigate}
                    components={{
                      toolbar: CustomToolbar,
                      event: EventInfo,
                    }}
                    resizable
                    selectable
                    onEventDrop={moveEvent}
                    onEventResize={resizeEvent}
                    onSelectEvent={HandleSelectEvent}
                    onSelectSlot={handleSelectSlot}
                    eventPropGetter={eventPropGetter}

                  // onClick={() => setOpenDatepickerModal(true)}
                  />

                </div>
              </div>
            </div>

          </>
        </div>
      </Fragment>
    );
  };

  const SmallScreenUI = () => {
    return (
      <div className="small-screen-ui h-screen w-screen overflow-x-hidden mt-5">
        <div className='h-[40vh] mx-auto '>
          <div className=' mt-5 flex-col mx-auto justify-center'>
            <div className="  rounded-md border-white bg-background px-3 text-foreground " >
              <SmallCalendar
                className='flex justify-center  bg-background text-foreground'
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />

            </div>
          </div>
        </div>
        <div className='h-[55vh]'>
          <DragAndDropCalendar
            className='overflow-y-scroll'
            style={{
              //  width: `calc(100vw - 310px)`,
              // height: "100vh",
              overflowX: "hidden",
              overflowY: "scroll",
              objectFit: "contain",
              overscrollBehavior: "contain",
              color: "white",
            }}
            selected={selected}
            defaultView={Views.AGENDA}
            events={myEvents}
            step={15}
            showMultiDayTimes={true}
            localizer={localizer}
            min={minTime}
            max={maxTime}
            date={date}
            onNavigate={onNavigate}
            components={{
              toolbar: noToolbar,
              event: EventInfo,
            }}
            resizable
            selectable
            //onEventDrop={DragAndDrop}
            // onEventResize={resizeEventMine}
            onSelectEvent={HandleSelectEvent}
          // onSelectSlot={handleSelectSlot}
          // onClick={() => setOpenDatepickerModal(true)}
          />
        </div>
      </div>
    )
  };
  return (
    <div>
      {isSmallScreen ? (
        <SmallScreenUI />
      ) : (
        <LargeScreenUI />
      )}
    </div>
  )
}


export function EventInfoModal({ user, open, handleClose, currentEvent, techs }: IProps) {
  const data = currentEvent
  const fetcher = useFetcher()
  const tech = data.tech ? data.tech : '';

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="w-[95%] md:w-[475px] border-border">
          <DialogHeader>
            <DialogTitle>

            </DialogTitle>
            <DialogDescription>
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            <div className="font-semibold">Appointment Details</div>
            <ul className="grid gap-3">
              <div className="relative mt-5">
                <Select
                  defaultValue={tech}
                  name='tech'
                  onValueChange={(value) => {
                    const formData = new FormData();
                    formData.append("aptId", data.id);
                    formData.append("workOrderId", String(data.workOrderId));
                    formData.append("techEmail", value);
                    formData.append("intent", 'updateTechnician');
                    fetcher.submit(formData, { method: "post" });
                  }}
                >
                  <SelectTrigger className="w-full bg-background text-foreground border border-border">
                    <SelectValue defaultValue={tech} />
                  </SelectTrigger>
                  <SelectContent className='bg-background text-foreground border border-border'>
                    <SelectGroup>
                      <SelectLabel>Technicians</SelectLabel>
                      {techs.map((user) => (
                        <SelectItem key={user.email} value={user.email}>
                          {user.username}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Assigned Tech</label>
              </div>
              <li className="flex items-center justify-between">
                <span className="text-[#8a8a93]">Unit</span>
                <span>{data.unit} </span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-[#8a8a93]">Mileage</span>
                <span> {data.mileage && (data.mileage)}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-[#8a8a93]">VIN</span>
                <span>{data.vin && (data.vin)}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-[#8a8a93]">Tag</span>
                <span>{data.tag && (data.tag)}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-[#8a8a93]">Motor</span>
                <span>{data.motor && (data.motor)}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-[#8a8a93]">Color</span>
                <span>{data.color && (data.color)}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-[#8a8a93]">Writer</span>
                <span>{data.writer}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-[#8a8a93]">Location</span>
                <span>{data.location && (data.location)}</span>
              </li>
            </ul>
          </div>

        </DialogContent>
      </Dialog >
    </>
  )
}

const EventInfo = ({ event }) => {
  const navigate = useNavigate()
  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            className='cursor-pointer py-3 px-4 m-2 rounded-[6px] hover:bg-accent hover:text-accent-foreground'
            onClick={() => (navigate(`/dealer/service/technician/workOrder/${event.workOrderId}`))} >
            <div className='flex-col gap-2'>
              <p className='text-left mt-1'>{event.title}</p>
              <p className='text-left mt-1'>Unit: {event.unit}</p>
              <p className='text-left mt-1'>Tag: {event.tag}</p>
              <p className='text-left mt-1'>VIN: {event.vin}</p>
              <p className='text-left mt-1'>Color: {event.color}</p>
              <p className='text-left mt-1'>Location: {event.location}</p>
            </div>
          </button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <div className='flex-col gap-2'>
            <p className='text-left mt-1'>{event.title}</p>
            <p className='text-left mt-1'>Unit: {event.unit}</p>
            <p className='text-left mt-1'>Tag: {event.tag}</p>
            <p className='text-left mt-1'>VIN: {event.vin}</p>
            <p className='text-left mt-1'>Color: {event.color}</p>
            <p className='text-left mt-1'>Location: {event.location}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </>
  );
};


export const links: LinksFunction = () => [
  { rel: "icon", type: "image/svg", href: calendarIcon },
  { rel: "stylesheet", href: styles1 },
  { rel: "stylesheet", href: rbc },
  { rel: "stylesheet", href: base },

];


export async function action({ request }: ActionFunction) {
  const formPayload = Object.fromEntries(await request.formData());
  let formData = financeFormSchema.parse(formPayload);
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")
  const user = await GetUser(email)
  const intent = formPayload.intent;

  if (intent === 'moveEvent') {
    const update = await prisma.workOrderApts.update({
      where: { id: formPayload.id },
      data: {
        start: formPayload.start,
        end: formPayload.end,
        tech: formPayload.tech,
        resourceId: formPayload.tech,
      }
    })
    return json({ update })
  }
  if (intent === 'updateTechnician') {
    const tech = await prisma.user.findUnique({
      where: { email: formPayload.techEmail }
    })
    const update = await prisma.workOrderApts.update({
      where: { id: formPayload.aptId },
      data: {
        tech: tech.username,
        resourceId: tech.username,
      }
    })
    return json({ update })
  }
  const message = 'something went wrong in calendar.sales action'
  return message
}
const DragAndDropCalendar = withDragAndDrop(Calendar)

export async function loader({ request, params }: LoaderFunction) {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")
  const user = await GetUser(email)
  if (!user) { redirect('/login') }
  const id = params.workOrderId

  let allServiceApts = await prisma.workOrderApts.findMany({
    where: { techEmail: 'tech@email.com' },
    select: {
      id: true,
      tech: true,
      techEmail: true,
      writer: true,
      start: true,
      end: true,
      title: true,
      workOrderId: true,
      completed: true,
      resourceId: true,
      unit: true,
      mileage: true,
      vin: true,
      tag: true,
      motor: true,
      color: true,
      location: true,
      WorkOrder: {
        select: {
          workOrderId: true,
          unit: true,
          mileage: true,
          vin: true,
          tag: true,
          motor: true,
          color: true,
          budget: true,
          waiter: true,
          totalLabour: true,
          totalParts: true,
          subTotal: true,
          total: true,
          writer: true,
          userEmail: true,
          tech: true,
          techEmail: true,
          notes: true,
          customerSig: true,
          status: true,
          location: true,
          quoted: true,
          paid: true,
          remaining: true,
          FinanceUnitId: true,
          ServiceUnitId: true,
          financeId: true,
          clientfileId: true,
          note: true,
          closedAt: true,
          createdAt: true,
          updatedAt: true,
          Clientfile: {
            select: {
              id: true,
              createdAt: true,
              updatedAt: true,
              userId: true,
              firstName: true,
              lastName: true,
              name: true,
              email: true,
              phone: true,
              address: true,
              city: true,
              postal: true,
              province: true,
              dl: true,
              typeOfContact: true,
              timeToContact: true,
            }
          }
        }
      }
    }
  })
  const allUsers = await prisma.user.findMany({
    select: {
      name: true,
      username: true,
      email: true,
      profileId: true,
      phone: true,
      dept: true,
      omvicNumber: true,
      positions: true,
      role: true,
    }
  });
  const techs = allUsers.filter(user =>
    user.role.name === 'Technician'
  );
  return json({ user, allServiceApts, techs })
}

dayjs.extend(timezone)

export const meta = () => {
  return [
    { title: "Technician Dashboard || SERVICE || Dealer Sales Assistant" },
    {
      property: "og:title",
      content: "Your very own assistant!",
    },
    {
      name: "description",
      content:
        "To help sales people achieve more. Every automotive dealer needs help, especialy the sales staff. Dealer Sales Assistant will help you close more deals more efficiently.",
      keywords: "Automotive Sales, dealership sales, automotive CRM",
    },
  ];
};
