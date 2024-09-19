
import { Fragment, useState, useCallback, useEffect, useRef, useMemo, useDeferredValue } from 'react'
import { Calendar, Views, dayjsLocalizer, Navigate } from 'react-big-calendar'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import { type LinksFunction, type LoaderFunction, type ActionFunction, json, redirect, } from '@remix-run/node'
import { useLoaderData, Link, useNavigate, useSubmit, useFetcher, useSearchParams, Form, useNavigation } from '@remix-run/react'
import { prisma } from "~/libs";
import { Text, } from '@radix-ui/themes';
import { UserPlus, Gauge, CalendarPlus, ArrowDownToDot, ChevronsLeft, ChevronsRightLeft, ChevronsRight, Truck, Sheet, ArrowLeft, ArrowRight, ArrowDownToLine } from 'lucide-react';
import EventInfo from "~/components/serviceDept/EventInfo"
import financeFormSchema from "~/overviewUtils/financeFormSchema";
import clsx from 'clsx'
import { getSession, commitSession } from '~/sessions/auth-session.server';
import rbc from "~/styles/rbc.css";
import { Button, buttonVariants, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, Popover, PopoverTrigger, PopoverContent, Input, Card, } from "~/components";
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
import useSWR from 'swr'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import { ChevronsUpDown } from 'lucide-react'
import { Wrench } from 'lucide-react'
import calendarIcon from '~/images/favicons/calendar.svg'
import {
  useScreenSize, ViewNamesGroup, CustomToolbar, mobileToolbar, noToolbar, colors, resourceTitle,
  IEventInfo, EventFormData, DatePickerEventFormData, initialEventFormState, initialDatePickerEventFormData, IProps, ViewToolbar
} from '~/components/calendar/shared'


export default function DnDResource() {
  const { allServiceApts, techs, user } = useLoaderData()
  const isSmallScreen = useScreenSize();

  const [view, setView] = useState(Views.WEEK)
  const onView = useCallback((newView) => setView(newView), [setView])
  const submit = useSubmit();

  const formattedData = allServiceApts.map(event => ({
    ...event,
    start: new Date(event.start),
    end: new Date(event.end),
    isDraggable: true,
  }));

  const [getDomain, setGetDomain] = useState("http://localhost:3000");

  useEffect(() => {
    const currentHost = typeof window !== "undefined" ? window.location.host : null;
    if (currentHost === "dealersalesassistant.ca") {
      setGetDomain("https://www.dealersalesassistant.ca")
    }
  }, []);


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
    console.log(event.id, data, 'from fetch')
    setSelected(event);
    setEventInfoModal(true)
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
  // add customer modal


  /** */
  // old resouce toggle
  const [showResources, setShowResources] = useState(true);

  const toggleView = () => {
    setShowResources(prevState => !prevState);
  };
  // source resource selector
  const [selectedResource, setSelectedResource] = useState('all');

  const handleResourceChange = (value) => {
    setSelectedResource(value);
  };

  const filteredEvents = selectedResource === 'all'
    ? myEvents
    : myEvents.filter(event => event.resourceId === selectedResource);

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
      console.log('move event')
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
  const eventPropGetter = (event) => {
    let newStyle = {
      color: 'white',
    };
    if (event.resourceId && colorMap[event.resourceId]) {
      newStyle.backgroundColor = colorMap[event.resourceId];
    }

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
    console.log(id, 'id')
    try {
      const { data, error } = useSWR(getDomain + `/dealer/api/singleServiceAppt?apptId=${id}`, fetcher)

      console.log(data, 'response')
      return json({ data })
    } catch (error) {
      console.error('Error fetching appointment data:', error);
    }
  };
  /// ------------------- end of dnd

  // ---------------------------resource

  const resources = [
    { resourceId: 'Service Desk', resourceTitle: 'Service Desk' }, // Static entry
    ...techs.map((tech) => ({
      resourceId: tech.username,
      resourceTitle: tech.name,
    })),
    { resourceId: 'Deliveries', resourceTitle: 'Deliveries' }, // Static entry

  ];

  const colorMap = {};
  let colorIndex = 0;

  // Assign colors to users
  techs.forEach(user => {
    if (!colorMap[user.username]) {
      colorMap[user.username] = colors[colorIndex % colors.length];
      colorIndex++;
    }
  });

  const userColorList = techs.map(user => {
    const color = colorMap[user.username];
    return { username: user.username, color: color };
  });

  userColorList.forEach(item => {
    console.log(`User: ${item.username}, Color: ${item.color}`);
  });

  // allServiceApts, techs, order, user, appointment
  console.log(myEvents, 'allServiceApts')

  const getResourceId = (resource) => resource.resourceId;
  const getResourceTitle = (resource) => resource.resourceTitle;

  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const dataFetcher = (url) => fetch(url).then(res => res.json());
  const { data: swrData } = useSWR(isSubmitting ? getDomain + `/dealer/service/calendar/reload` : null, dataFetcher, {})

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
            <div className="h-[45px]  w-auto  border-b border-border bg-background text-foreground">
              <h2 className="ml-[75px] text-2xl font-bold tracking-tight">Service Calendar</h2>
            </div>
            <div className=" grow">
              <div className='flex w-auto '>
                <div className='h-screen w-[310px] border-r border-border'>
                  <div className=' mt-5 flex-col mx-auto justify-center'>
                    <div className="mx-auto w-[280px] rounded-md border-border bg-background px-3 text-foreground " >
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
                    <div className='mt-3  mx-auto'>

                      <Select
                        value={selectedResource}
                        onValueChange={(value) => {
                          handleResourceChange(value)
                          if (value === 'all') {
                            setShowResources(true)
                          } else {
                            setShowResources(false)
                          }
                        }}
                      >
                        <SelectTrigger className="w-[180px]  mx-auto ">
                          <SelectValue defaultValue={selectedResource === 'all' ? 'All Calendar Views' : selectedResource} />
                        </SelectTrigger>
                        <SelectContent className='bg-background border-border'>
                          <SelectGroup>
                            <SelectLabel>Employee Views</SelectLabel>
                            <SelectItem className='cursor-pointer' value="all">All Employees</SelectItem>
                            {resources.map(resource => (
                              <SelectItem className='cursor-pointer' key={resource.resourceId} value={resource.resourceId}>
                                {resource.resourceTitle}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className='flex-col justify-center' >

                      <ul className='ml-[90px] mt-4'>
                        {userColorList.map((item, index) => (
                          <li key={index} className='mt-3 items-center'>
                            <span
                              style={{
                                backgroundColor: item.color,
                                width: '16px',
                                height: '16px',
                                display: 'inline-block',
                                marginRight: '8px',
                                borderRadius: '4px'
                              }}
                            ></span>
                            {item.username}
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>
                </div>
                <div className="flex w-[97%] justify-center overflow-clip">
                  {showResources ? (
                    <DragAndDropCalendar
                      resources={resources}
                      resourceIdAccessor={getResourceId}
                      resourceTitleAccessor={resourceTitle}

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
                      defaultView={Views.WEEK}
                      events={filteredEvents}
                      localizer={localizer}
                      min={minTime}
                      max={maxTime}
                      date={date}
                      onNavigate={onNavigate}
                      onView={onView}
                      view={view}
                      resizable
                      selectable
                      components={{
                        toolbar: CustomToolbar,
                        event: EventInfo,
                      }}
                      onEventDrop={moveEvent}
                      onEventResize={resizeEvent}
                      onSelectEvent={(e) => HandleSelectEvent(e)}
                      onSelectSlot={handleSelectSlot}
                      eventPropGetter={eventPropGetter}
                    />
                  ) : (
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
                      defaultView={Views.WEEK}
                      events={myEvents}
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
                  )}

                </div>
              </div>
            </div>
            {selected && (
              <EventInfoModal
                open={eventInfoModal}
                handleClose={() => closeSelectEvent()}
                onDeleteEvent={onDeleteEvent}
                currentEvent={selected}
                user={user}
                onCompleteEvent={onCompleteEvent}
                techs={techs}
              />
            )}
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

  let allServiceApts = await prisma.workOrderApts.findMany({})
  allServiceApts = allServiceApts.filter(apt => apt.WorkOrder?.status !== 'Waiter' || apt.WorkOrder?.status !== 'Closed');


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

    //  ||user.role.name === 'Delivery Driver'
  );
  // console.log(order)
  return json({ user, allServiceApts, techs })
}

dayjs.extend(timezone)

export function EventInfoModal({ user, open, handleClose, currentEvent, techs }: IProps) {
  const data = currentEvent
  const fetcher = useFetcher()
  const tech = data.tech ? data.tech : '';
  console.log(techs, 'dataeventinfdomodle');
  const submit = useSubmit()
  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <Form method='post'>
          <DialogContent className="w-[95%] md:w-[475px] border-border">
            <DialogHeader>
              <DialogTitle>
                <div className="relative mt-4">
                  <Input
                    name='title'
                    defaultValue={currentEvent?.title}
                    className={` bg-background text-foreground border border-border mt-3`}
                  />
                  <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">Title</label>
                </div>
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
                      submit(formData, { method: "post" });
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
        </Form>
      </Dialog >
    </>
  )
}

export const links: LinksFunction = () => [
  { rel: "icon", type: "image/svg", href: calendarIcon },
  { rel: "stylesheet", href: styles1 },
  { rel: "stylesheet", href: rbc },
  { rel: "stylesheet", href: base },
];

export const meta = () => {
  return [
    { title: "Service Calendar || SERVICE || Dealer Sales Assistant" },
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
