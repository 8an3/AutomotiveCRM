
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
import EventInfo from "~/components/serviceDept/EventInfo"
import financeFormSchema from "~/overviewUtils/financeFormSchema";
import clsx from 'clsx'
import { getSession, commitSession } from '~/sessions/auth-session.server';
import rbc from "~/styles/rbc.css";
import { Button, buttonVariants, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, Popover, PopoverTrigger, PopoverContent, Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue, Input, Card, } from "~/components";
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
import { toast } from "sonner"
import useSWR from 'swr'
import {
  useScreenSize, ViewNamesGroup, CustomToolbar, mobileToolbar, noToolbar, colors, resourceTitle,
  IEventInfo, EventFormData, DatePickerEventFormData, initialEventFormState, initialDatePickerEventFormData, IProps, ViewToolbar
} from '~/components/calendar/shared'

export default function DnDResource() {
  const { allServiceApts, techs, order, user, appointment } = useLoaderData()
  const isSmallScreen = useScreenSize();

  const [view, setView] = useState(Views.WEEK)
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

  const [showResources, setShowResources] = useState(true);

  const toggleView = () => {
    setShowResources(prevState => !prevState);
  };

  const [date, setDate] = useState<Date>()

  const newDate = new Date()

  const onNavigate = useCallback((newDate) => setDate(newDate), [setDate])

  // ---------------------- dnd
  const fetcher = useFetcher()

  /// ------------------- end of dnd
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
      fetcher.submit(formData, { method: "post" });

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
      fetcher.submit(formData, { method: "post" });

    },
    []
  )

  async function FetchData(id) {
    const fetcher = url => fetch(url).then(r => r.json())
    console.log(id, 'id')
    try {
      const { data, error } = useSWR(`http://localhost:3000/dealer/api/singleServiceAppt?apptId=${id}`, fetcher)

      console.log(data, 'response')
      return json({ data })
    } catch (error) {
      console.error('Error fetching appointment data:', error);
    }
  };

  // ---------------------------resource

  const resources = [
    { resourceId: 'Service Desk', resourceTitle: 'Service Desk' }, // Static entry
    ...techs.map((tech) => ({
      resourceId: tech.username,
      resourceTitle: tech.name,
    })),
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
  console.log(navigation.state, 'nav state workorder calendar id');
  const isSubmitting = navigation.state === "submitting" || navigation.state === "loading";

  const dataFetcher = (url) => fetch(url).then(res => res.json());

  const { data: swrData, mutate } = useSWR(null, dataFetcher, {});

  useEffect(() => {
    if (isSubmitting) {
      mutate(getDomain + `/dealer/service/calendar/reload`);
    }
  }, [isSubmitting, mutate]);

  useEffect(() => {
    if (swrData) {
      setMyEvents(swrData);
      console.log('hitswr!! ');
    }
  }, [swrData]);


  const LargeScreenUI = () => {
    return (
      <Fragment>
        <div className="large-screen-ui">
          <>
            <div className="h-[75px]  w-auto  border-b border-border bg-background text-foreground">
              <h2 className="ml-[100px] text-2xl font-bold tracking-tight">Service Calendar</h2>
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

                    <div className='flex-col justify-center' >

                      <ul className='ml-[90px] mt-4'>
                        {userColorList.map((item, index) => (
                          <li key={index} className='mt-3  items-center'>
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
                      defaultView={Views.DAY}
                      events={myEvents}
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
                      defaultView={Views.DAY}
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
                setMyEvents={setMyEvents}
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

export const links: LinksFunction = () => [
  { rel: "icon", type: "image/svg", href: '/favicons/calendar.svg' },
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
        techEmail: formPayload.techEmail,
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
        techEmail: tech.email
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
  const order = await prisma.workOrder.findUnique({
    where: { workOrderId: Number(id), },
    select: {
      workOrderId: true,
      unit: true,
      mileage: true,
      vin: true,
      tag: true,
      motor: true,
      budget: true,
      totalLabour: true,
      totalParts: true,
      subTotal: true,
      total: true,
      writer: true,
      userEmail: true,
      tech: true,
      notes: true,
      customerSig: true,
      status: true,
      location: true,
      quoted: true,
      paid: true,
      remaining: true,
      FinanceUnitId: true,
      financeId: true,
      clientfileId: true,
      createdAt: true,
      updatedAt: true,
      ServicesOnWorkOrders: {
        select: {
          id: true,
          createdAt: true,
          updatedAt: true,
          quantity: true,
          status: true,
          workOrderId: true,
          serviceId: true,
          hr: true,
          service: {
            select: {
              id: true,
              createdAt: true,
              updatedAt: true,
              description: true,
              estHr: true,
              service: true,
              price: true,
            }
          }
        }
      },
      Clientfile: {
        select: {
          id: true,
          financeId: true,
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
          conversationId: true,
          billingAddress: true,
          Finance: {
            select: {
              financeManager: true,
              userEmail: true,
              userName: true,
              financeManagerName: true,
              //: true,
              email: true,
              firstName: true,
              lastName: true,
              phone: true,
              name: true,
              address: true,
              city: true,
              postal: true,
              province: true,
              dl: true,
              typeOfContact: true,
              timeToContact: true,
              dob: true,
              //: true,
              othTax: true,
              optionsTotal: true,
              lienPayout: true,
              leadNote: true,
              sendToFinanceNow: true,
              dealNumber: true,
              iRate: true,
              months: true,
              discount: true,
              total: true,
              onTax: true,
              on60: true,
              biweekly: true,
              weekly: true,
              weeklyOth: true,
              biweekOth: true,
              oth60: true,
              weeklyqc: true,
              biweeklyqc: true,
              qc60: true,
              deposit: true,
              biweeklNatWOptions: true,
              weeklylNatWOptions: true,
              nat60WOptions: true,
              weeklyOthWOptions: true,
              biweekOthWOptions: true,
              oth60WOptions: true,
              biweeklNat: true,
              weeklylNat: true,
              nat60: true,
              qcTax: true,
              otherTax: true,
              totalWithOptions: true,
              otherTaxWithOptions: true,
              desiredPayments: true,
              admin: true,
              commodity: true,
              pdi: true,
              discountPer: true,
              userLoanProt: true,
              userTireandRim: true,
              userGap: true,
              userExtWarr: true,
              userServicespkg: true,
              deliveryCharge: true,
              vinE: true,
              lifeDisability: true,
              rustProofing: true,
              userOther: true,
              //: true,
              referral: true,
              visited: true,
              bookedApt: true,
              aptShowed: true,
              aptNoShowed: true,
              testDrive: true,
              metService: true,
              metManager: true,
              metParts: true,
              sold: true,
              depositMade: true,
              refund: true,
              turnOver: true,
              financeApp: true,
              approved: true,
              signed: true,
              pickUpSet: true,
              demoed: true,
              delivered: true,
              lastContact: true,
              status: true,
              customerState: true,
              result: true,
              timesContacted: true,
              nextAppointment: true,
              followUpDay: true,
              deliveryDate: true,
              deliveredDate: true,
              notes: true,
              visits: true,
              progress: true,
              metSalesperson: true,
              metFinance: true,
              financeApplication: true,
              pickUpDate: true,
              pickUpTime: true,
              depositTakenDate: true,
              docsSigned: true,
              tradeRepairs: true,
              seenTrade: true,
              lastNote: true,
              applicationDone: true,
              licensingSent: true,
              liceningDone: true,
              refunded: true,
              cancelled: true,
              lost: true,
              dLCopy: true,
              insCopy: true,
              testDrForm: true,
              voidChq: true,
              loanOther: true,
              signBill: true,
              ucda: true,
              tradeInsp: true,
              customerWS: true,
              otherDocs: true,
              urgentFinanceNote: true,
              funded: true,
              leadSource: true,
              financeDeptProductsTotal: true,
              bank: true,
              loanNumber: true,
              idVerified: true,
              dealerCommission: true,
              financeCommission: true,
              salesCommission: true,
              firstPayment: true,
              loanMaturity: true,
              quoted: true,
              //: true,
              InPerson: true,
              Phone: true,
              SMS: true,
              Email: true,
              Other: true,
              //------: true,
              //: true,
              paintPrem: true,
              licensing: true,
              stockNum: true,
              options: true,
              accessories: true,
              freight: true,
              labour: true,
              year: true,
              brand: true,
              mileage: true,
              model: true,
              model1: true,
              color: true,
              modelCode: true,
              msrp: true,
              trim: true,
              vin: true,
              bikeStatus: true,
              invId: true,
              //: true,
              tradeValue: true,
              tradeDesc: true,
              tradeColor: true,
              tradeYear: true,
              tradeMake: true,
              tradeVin: true,
              tradeTrim: true,
              tradeMileage: true,
              tradeLocation: true,
              lien: true,
              //: true,
              id: true,
              activixId: true,
              theRealActId: true,
              createdAt: true,
              updatedAt: true,
              FinanceUnit: {
                select: {
                  paintPrem: true,
                  licensing: true,
                  stockNum: true,
                  options: true,
                  accessories: true,
                  freight: true,
                  labour: true,
                  year: true,
                  brand: true,
                  mileage: true,
                  model: true,
                  model1: true,
                  color: true,
                  modelCode: true,
                  msrp: true,
                  trim: true,
                  vin: true,
                  bikeStatus: true,
                  invId: true,
                  location: true,
                  id: true,
                  createdAt: true,
                  updatedAt: true,
                  financeId: true,
                }
              },
            }
          },
          ServiceUnit: {
            select: {
              id: true,
              createdAt: true,
              updatedAt: true,
              price: true,
              brand: true,
              model: true,
              color: true,
              accessories: true,
              options: true,
              year: true,
              vin: true,
              trim: true,
              mileage: true,
              location: true,
              condition: true,
              repairs: true,
              stockNum: true,
              licensing: true,
              tradeEval: true,
            }
          },
        },
      },
      AccOrders: {
        select: {
          id: true,
          createdAt: true,
          updatedAt: true,
          userEmail: true,
          userName: true,
          dept: true,
          total: true,
          discount: true,
          discPer: true,
          paid: true,
          paidDate: true,
          status: true,
          workOrderId: true,
          note: true,
          financeId: true,
          clientfileId: true,
          AccessoriesOnOrders: {
            select: {
              id: true,
              quantity: true,
              accOrderId: true,
              status: true,
              orderNumber: true,
              OrderInvId: true,
              accessoryId: true,
              accessory: {
                select: {
                  id: true,
                  createdAt: true,
                  updatedAt: true,
                  partNumber: true,
                  brand: true,
                  name: true,
                  price: true,
                  cost: true,
                  quantity: true,
                  description: true,
                  category: true,
                  subCategory: true,
                  onOrder: true,
                  distributer: true,
                  location: true,
                },
              },
            },
          },
        }
      },
      Payments: {
        select: {
          id: true,
          createdAt: true,
          paymentType: true,
          amountPaid: true,
          cardNum: true,
          receiptId: true,
          financeId: true,
          userEmail: true,
          accOrderId: true,
        },
      },
      WorkOrderApts: {
        select: {
          id: true,
          tech: true,
          writer: true,
          start: true,
          end: true,
          title: true,
          workOrderId: true,
          completed: true,
          resourceId: true,
          WorkOrder: {
            select: {
              workOrderId: true,
              unit: true,
              mileage: true,
              vin: true,
              tag: true,
              motor: true,
              budget: true,
              totalLabour: true,
              totalParts: true,
              subTotal: true,
              total: true,
              writer: true,
              userEmail: true,
              tech: true,
              notes: true,
              customerSig: true,
              status: true,
              location: true,
              quoted: true,
              paid: true,
              remaining: true,
              FinanceUnitId: true,
              financeId: true,
              clientfileId: true,
              createdAt: true,
              updatedAt: true,
              Clientfile: {
                select: {
                  id: true,
                  financeId: true,
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
                  conversationId: true,
                  billingAddress: true,
                  Finance: {
                    select: {
                      financeManager: true,
                      userEmail: true,
                      userName: true,
                      financeManagerName: true,
                      //: true,
                      email: true,
                      firstName: true,
                      lastName: true,
                      phone: true,
                      name: true,
                      address: true,
                      city: true,
                      postal: true,
                      province: true,
                      dl: true,
                      typeOfContact: true,
                      timeToContact: true,
                      dob: true,
                      //: true,
                      othTax: true,
                      optionsTotal: true,
                      lienPayout: true,
                      leadNote: true,
                      sendToFinanceNow: true,
                      dealNumber: true,
                      iRate: true,
                      months: true,
                      discount: true,
                      total: true,
                      onTax: true,
                      on60: true,
                      biweekly: true,
                      weekly: true,
                      weeklyOth: true,
                      biweekOth: true,
                      oth60: true,
                      weeklyqc: true,
                      biweeklyqc: true,
                      qc60: true,
                      deposit: true,
                      biweeklNatWOptions: true,
                      weeklylNatWOptions: true,
                      nat60WOptions: true,
                      weeklyOthWOptions: true,
                      biweekOthWOptions: true,
                      oth60WOptions: true,
                      biweeklNat: true,
                      weeklylNat: true,
                      nat60: true,
                      qcTax: true,
                      otherTax: true,
                      totalWithOptions: true,
                      otherTaxWithOptions: true,
                      desiredPayments: true,
                      admin: true,
                      commodity: true,
                      pdi: true,
                      discountPer: true,
                      userLoanProt: true,
                      userTireandRim: true,
                      userGap: true,
                      userExtWarr: true,
                      userServicespkg: true,
                      deliveryCharge: true,
                      vinE: true,
                      lifeDisability: true,
                      rustProofing: true,
                      userOther: true,
                      //: true,
                      referral: true,
                      visited: true,
                      bookedApt: true,
                      aptShowed: true,
                      aptNoShowed: true,
                      testDrive: true,
                      metService: true,
                      metManager: true,
                      metParts: true,
                      sold: true,
                      depositMade: true,
                      refund: true,
                      turnOver: true,
                      financeApp: true,
                      approved: true,
                      signed: true,
                      pickUpSet: true,
                      demoed: true,
                      delivered: true,
                      lastContact: true,
                      status: true,
                      customerState: true,
                      result: true,
                      timesContacted: true,
                      nextAppointment: true,
                      followUpDay: true,
                      deliveryDate: true,
                      deliveredDate: true,
                      notes: true,
                      visits: true,
                      progress: true,
                      metSalesperson: true,
                      metFinance: true,
                      financeApplication: true,
                      pickUpDate: true,
                      pickUpTime: true,
                      depositTakenDate: true,
                      docsSigned: true,
                      tradeRepairs: true,
                      seenTrade: true,
                      lastNote: true,
                      applicationDone: true,
                      licensingSent: true,
                      liceningDone: true,
                      refunded: true,
                      cancelled: true,
                      lost: true,
                      dLCopy: true,
                      insCopy: true,
                      testDrForm: true,
                      voidChq: true,
                      loanOther: true,
                      signBill: true,
                      ucda: true,
                      tradeInsp: true,
                      customerWS: true,
                      otherDocs: true,
                      urgentFinanceNote: true,
                      funded: true,
                      leadSource: true,
                      financeDeptProductsTotal: true,
                      bank: true,
                      loanNumber: true,
                      idVerified: true,
                      dealerCommission: true,
                      financeCommission: true,
                      salesCommission: true,
                      firstPayment: true,
                      loanMaturity: true,
                      quoted: true,
                      //: true,
                      InPerson: true,
                      Phone: true,
                      SMS: true,
                      Email: true,
                      Other: true,
                      //------: true,
                      //: true,
                      paintPrem: true,
                      licensing: true,
                      stockNum: true,
                      options: true,
                      accessories: true,
                      freight: true,
                      labour: true,
                      year: true,
                      brand: true,
                      mileage: true,
                      model: true,
                      model1: true,
                      color: true,
                      modelCode: true,
                      msrp: true,
                      trim: true,
                      vin: true,
                      bikeStatus: true,
                      invId: true,
                      //: true,
                      tradeValue: true,
                      tradeDesc: true,
                      tradeColor: true,
                      tradeYear: true,
                      tradeMake: true,
                      tradeVin: true,
                      tradeTrim: true,
                      tradeMileage: true,
                      tradeLocation: true,
                      lien: true,
                      //: true,
                      id: true,
                      activixId: true,
                      theRealActId: true,
                      createdAt: true,
                      updatedAt: true,
                      FinanceUnit: {
                        select: {
                          paintPrem: true,
                          licensing: true,
                          stockNum: true,
                          options: true,
                          accessories: true,
                          freight: true,
                          labour: true,
                          year: true,
                          brand: true,
                          mileage: true,
                          model: true,
                          model1: true,
                          color: true,
                          modelCode: true,
                          msrp: true,
                          trim: true,
                          vin: true,
                          bikeStatus: true,
                          invId: true,
                          location: true,
                          id: true,
                          createdAt: true,
                          updatedAt: true,
                          financeId: true,
                        }
                      },
                    }
                  },
                  ServiceUnit: {
                    select: {
                      id: true,
                      createdAt: true,
                      updatedAt: true,
                      price: true,
                      brand: true,
                      model: true,
                      color: true,
                      accessories: true,
                      options: true,
                      year: true,
                      vin: true,
                      trim: true,
                      mileage: true,
                      location: true,
                      condition: true,
                      repairs: true,
                      stockNum: true,
                      licensing: true,
                      tradeEval: true,
                    }
                  },
                },
              },
            }
          }
        }
      },
    }
  });
  let allServiceApts = await prisma.workOrderApts.findMany({
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
          createdAt: true,
          updatedAt: true,
        }
      }

    }
  })
  allServiceApts = allServiceApts.filter(apt => apt.WorkOrder?.status !== 'Waiter' || apt.WorkOrder?.status !== 'Closed');

  let appointment

  if (order.WorkOrderApts) {
    appointment = await prisma.workOrderApts.findFirst({
      where: { id: order.WorkOrderApts.id, techEmail: 'serviceDesk@email.com' },
      orderBy: { createdAt: 'desc', },
    })
  }
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
    user.role.name === 'Technician' ||
    user.role.name === 'Delivery Driver'
  );
  // console.log(order)
  return json({ order, user, allServiceApts, techs, appointment })
}

dayjs.extend(timezone)



export function EventInfoModal({ user, open, handleClose, currentEvent, techs, setMyEvents }: IProps) {
  const data = currentEvent
  const fetcher = useFetcher()
  const tech = data.tech ? data.tech : '';
  console.log(techs, 'dataeventinfdomodle');
  const submit = useSubmit()
  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="w-[95%] md:w-[475px] border-border">
          <DialogHeader>
            <DialogTitle>
              {currentEvent?.title}
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
                    const submitIt = submit(formData, { method: "post" });
                    const tech = techs.filter(item => item.email === value)

                    toast.success(`Changed technician to ${value}`)
                    setMyEvents((prev) => {
                      const existing = prev.find((ev) => ev.id === data.id) ?? {}
                      const filtered = prev.filter((ev) => ev.id !== data.id)
                      return [...filtered, { ...existing, resourceId: tech.userName }]
                    })
                    return submitIt
                  }}
                >
                  <SelectTrigger className="w-full bg-background text-foreground border border-border">
                    <SelectValue defaultValue={tech} />
                  </SelectTrigger>
                  <SelectContent className='bg-background text-foreground border border-border'>
                    <SelectGroup>
                      <SelectLabel>Technicians</SelectLabel>
                      {techs.map((user) => (
                        <SelectItem key={user.email} value={user.email} className='cursor-pointer hover:bg-accent hover:text-accent-foreground'>
                          {user.name}
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
