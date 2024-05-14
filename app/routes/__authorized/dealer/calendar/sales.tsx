
import { useState, useCallback, useEffect } from 'react'
import { Calendar, Views, dayjsLocalizer, Navigate as navigate } from 'react-big-calendar'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import { type LinksFunction, type LoaderFunction, type ActionFunction, json, redirect, } from '@remix-run/node'
import { model } from '~/models';
import { useLoaderData, Link, useNavigate } from '@remix-run/react'
import { getAllFinanceAptsForCalendar, } from '~/utils/financeAppts/get.server';
import { prisma } from "~/libs";
import { Text, } from '@radix-ui/themes';
import { UserPlus, Gauge, CalendarPlus, ChevronsLeft, ChevronsRightLeft, ChevronsRight } from 'lucide-react';
import EventInfo from "~/components/dashboard/calendar/EventInfo"
import EventInfoModal from "~/components/dashboard/calendar/EventInfoModal"
import financeFormSchema from "~/overviewUtils/financeFormSchema";
import clsx from 'clsx'
import AddCustomerModal from '~/components/dashboard/calendar/addCustomerModal'
import { AddAppt } from '~/components/dashboard/calendar/addAppt';
import { SearchCustomerModal } from '~/components/dashboard/calendar/searchCustomerModal'
import { GetUser } from "~/utils/loader.server";
import { getSession, commitSession } from '~/sessions/auth-session.server';
import storeHoursCss from "~/styles/storeHours.css";
import styles1 from "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import rbc from "~/styles/rbc.css";
import { Button, buttonVariants, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, Popover, PopoverTrigger, PopoverContent, Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue, } from "~/components";
import { CalendarIcon, ClockIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import { Calendar as SmallCalendar } from '~/components/ui/calendar';
import { cn } from "~/components/ui/utils"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion"

export const links: LinksFunction = () => [
  { rel: "icon", type: "image/svg", href: '/calendar.svg' },
  { rel: "stylesheet", href: storeHoursCss },
  { rel: "stylesheet", href: styles1 },
  { rel: "stylesheet", href: rbc },
];

export async function CompleteLastAppt(userId, financeId) {
  console.log('CompleteLastAppt')
  const lastApt = await prisma.clientApts.findFirst({
    where: { financeId: financeId },
    orderBy: {
      createdAt: 'desc',
    },
  })


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
export async function TwoDays(followUpDay3, formData, financeId, user) {
  const lastContact = new Date().toISOString();
  let customerState = formData.customerState;
  if (customerState === "Pending") {
    customerState = "Attempted";
  }


  const followUpDay2 = parseInt(followUpDay3);
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
    title: formData.title,
    start: newDate,

    //end: formData.end,
    contactMethod: formData.contactMethod,
    completed: formData.completed,
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
    messageTitle: 'Contacted by Instant Function',

    direction: 'Outgoing',
    resultOfcall: 'Attempted',
    userId,
  };
  const formPayload = formData
  const dashboardId = formData.dashboardId
  const nextAppointment = newDate
  const followUpDay = newDate
  const formData3 = { ...formData, nextAppointment, followUpDay, lastContact, customerState, dashboardId }
  const updating = await updateFinance23(financeId, formData, formPayload);
  const createFollowup = await createfinanceApt(user, clientAptsData, formData)
  const completeApt = await CompleteLastAppt(userId, financeId)
  //  console.log('hittind 2 days from noiw', formData, followUpDay, completeApt, createClientFinanceAptData)
  return json({ updating, completeApt, createFollowup });
}
export async function FollowUpApt(formData, user, userId) {
  const lastContact = new Date().toISOString();
  let customerState = formData.customerState;
  if (customerState === "Pending") {
    customerState = "Attempted";
  }

  let newDate = new Date(formData.followUpDay1).toISOString();

  let clientAptsData = {
    title: formData.title,
    start: newDate,

    //end: formData.end,
    contactMethod: formData.contactMethod,
    completed: formData.completed,
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
    messageTitle: 'Contacted by Instant Function',

    direction: 'Outgoing',
    resultOfcall: 'Attempted',
    userId,
  };
  setTimeout(() => {
    if (selectedChannel) {

    }
  }, []);

  const nextAppointment = newDate
  const followUpDay = newDate
  const formData3 = { ...formData, nextAppointment, followUpDay, lastContact, customerState, dashboardId }
  const updating = await updateFinance23(financeId, formData3, formPayload);


  const createFollowup = await createfinanceApt(financeId, clientAptsData)


  const completeApt = await CompleteLastAppt(userId, financeId)
  //  console.log('hittind 2 days from noiw', formData, followUpDay, completeApt, createClientFinanceAptData)
  return json({ updating, completeApt, createFollowup });
}
export async function ComsCount(financeId, commType) {
  const record = await prisma.communications.findUnique({
    where: { financeId: financeId },
  });
  if (record) {
    await prisma.communications.update({
      where: { financeId: financeId },
      data: { [commType]: record[commType] + 1 },
    });
  } else {
    await prisma.communications.create({
      data: { financeId: financeId, [commType]: 1 },
    });
  }
  return json({ ok: true });
}
export async function ConvertDynamic(finance) {
  function replaceTemplateValues(template, values) {
    let result = template;
    for (const key in values) {
      result = result.replace(new RegExp(`\\$\\{${key}\\}`, 'g'), values[key]);
    }
    return result;
  }

  const values = {
    clientFname: finance.firstName,
    clientLname: finance.lastName,
    clientEmail: finance.email,
    clientFullName: finance.firstName + ' ' + finance.lastName,
    clientPhone: finance.phone,
    clientAddress: finance.address,
    clientCity: finance.city,
    clientState: finance.state,
    clientPostalCode: finance.postalCode,
    year: finance.year,
    make: finance.make,
    model: finance.model,
    vin: finance.vin,
    stockNumber: finance.stockNumber,
    price: finance.price,
    tradeYear: finance.tradeYear,
    tradeMake: finance.tradeMake,
    tradeModel: finance.tradeModel,
    tradeVin: finance.tradeVin,
    tradeColor: finance.tradeColor,
    tradeValue: finance.tradeValue,
    tradeMileage: finance.tradeMileage,
  }
  const template = `Hello ${clientFname}, your ${model} has been shipped.`;

  const emailBody = replaceTemplateValues(template, values);
  return emailBody
}

export async function action({ request }: ActionFunction) {
  const formPayload = Object.fromEntries(await request.formData());
  let formData = financeFormSchema.parse(formPayload);
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")


  const user = await GetUser(email)
  const userId = user?.id;
  const intent = formPayload.intent;
  const today = new Date();
  const date = new Date().toISOString()
  const financeId = formData.financeId
  //  console.log('formData:', formData, 'formData131331331');  //

  if (intent === 'compeleteApptOnly') {
    const finance = await prisma.clientApts.update({
      data: {
        completed: 'yes',
        resultOfcall: formData.resultOfcall,
        note: formData.note,
        financeId: formData.financeId,
      },
      where: {
        id: formData.aptId,
      },
    });
    return finance
  }
  if (intent === 'updateFinanceAppt') {
    const finance = await prisma.clientApts.update({
      data: {
        completed: formData.completed,
        resultOfcall: formData.resultOfcall,
        title: formData.title,
        resourceId: Number(formData.resourceId),
        note: formData.note,
        financeId: formData.financeId,
        address: formData.address,
        apptStatus: formData.apptStatus,

      },
      where: {
        id: formData.aptId,
      },
    });
    return finance
  }
  if (intent === '2DaysFromNow') {
    const updateLastApt = await prisma.clientApts.update({
      data: {
        completed: 'yes',
        resultOfcall: formData.resultOfcall,
        title: formData.title,
        resourceId: Number(formData.resourceId),
        note: formData.note,
        financeId: formData.financeId,

        apptStatus: 'Completed',
      },
      where: {
        id: formData.aptId,
      },
    });
    console.log('updated by 2daysfrom now')

    const lastContact = today.toISOString();
    const followUpDay2 = parseInt(formData.followUpDay1);
    console.log('followUpDay:', followUpDay2);  // Add this line

    function addDays(days) {
      let currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + days);
      return currentDate;
    }

    let newDate = addDays(followUpDay2);
    newDate = new Date(newDate).toISOString();
    const createNewApt = await prisma.clientApts.create({
      data: {
        start: newDate,
        end: formData.end,
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
        userId: userId || '',
        userName: user?.name,
        title: 'Contacted by Instant Function',
        attachments: formData.attachments,
        resultOfcall: 'Attempted',
        resourceId: Number(formData.resourceId),
        financeId: formData.financeId,
        stockNum: formData.stockNum,
        vin: formData.vin,
      },
    });
    console.log('updated by 2daysfrom now')
    const financeId = formData.financeId

    const dashboard = await prisma.dashboard.findUnique({
      where: {
        financeId: financeId,
      },
    });
    const dashboardId = dashboard?.id;
    const nextAppointment = newDate
    const followUpDay = newDate
    const formData3 = { ...formData, nextAppointment, followUpDay, lastContact, dashboardId }
    //  const updating = await updateFinance23(financeId, formData3, formPayload);
    const comdata = {
      financeId: formData.financeId,
      userId: formData.userId,
      content: formData.note,
      title: 'Contacted by Instant Function',
      direction: formData.direction,
      result: formData.resultOfcall,
      subject: formData.messageContent,
      type: 'Text/phone',
      userName: user?.name,
      date: new Date().toISOString(),
    }
    const setComs = await prisma.communicationsOverview.create({
      data: comdata,
    });


    return json({ updateLastApt, createNewApt, setComs })

  }
  if (intent === 'textQuickFU') {
    console.log('hit textquick fu')
    const followUpDay3 = formData.followUpDay
    const completeApt = await CompleteLastAppt(userId, financeId)
    const doTGwoDays = await TwoDays(followUpDay3, formData, financeId, user)
    // const setComs = await CreateCommunications(comdata)
    const comdata = {
      financeId: formData.financeId,
      userId: formData.userId,
      content: formData.note,
      title: formData.title,
      direction: formData.direction,
      result: formData.resultOfcall,
      subject: formData.messageContent,
      type: 'Text',
      userName: user?.name,
      date: new Date().toISOString(),
    }
    const setComs = await prisma.communicationsOverview.create({
      data: comdata,
    });
    const saveComms = await ComsCount(financeId, 'SMS')
    return json({ doTGwoDays, completeApt, setComs, saveComms });
  }
  if (intent === 'scheduleFUp') {
    const lastContact = new Date().toISOString();
    let customerState = formData.customerState;
    if (customerState === "Pending") {
      customerState = "Attempted";
    }
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

    const updateLastApt = await prisma.clientApts.update({
      data: {
        completed: 'yes',
        resultOfcall: formData.resultOfcall,
        title: formData.title,
        resourceId: Number(formData.resourceId),
        note: formData.completedNote,
        financeId: formData.financeId,
        apptStatus: 'Completed',
      },
      where: {
        id: formData.aptId,
      },
    });
    console.log('updated by scheduleFUp')
    const createNewApt = await prisma.clientApts.create({
      data: {
        title: 'Contacted by Instant Function',
        start: dateTimeString,
        end: formData.end,
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
        userEmail: user.email,
        //  description: formData.description,
        userName: formData.username,
        attachments: formData.attachments,
        //  direction: formData.direction,
        resultOfcall: formData.resultOfcall,
        resourceId: Number(formData.resourceId),
        financeId: formData.financeId,
        stockNum: formData.stockNum,
        vin: formData.vin,
      },
    });
    console.log('created createNewApt ', createNewApt)

    const comdata = {
      financeId: formData.financeId,
      userId: formData.userId,
      content: formData.note,
      title: 'Contacted by Instant Function',
      direction: formData.direction,
      result: formData.resultOfcall,
      subject: formData.messageContent,
      type: 'Text',
      userName: user?.name,
      date: new Date().toISOString(),
    }
    const setComs = await prisma.communicationsOverview.create({
      data: comdata,
    });
    const financeId = formData.financeId


    const nextAppointment = dateTimeString
    const followUpDay = dateTimeString
    const updateDash = await prisma.dashboard.update({
      where: {
        financeId: financeId,
      },
      data: {
        lastContact: date,
        nextAppointment: nextAppointment,
      }
    });
    console.log(updateDash, createNewApt, setComs,)
    return json({ updateLastApt, createNewApt, setComs, })
  }
  if (intent === "EmailClient") {
    const comdata = {
      financeId: formData.financeId,
      userId: formData.userId,
      content: formData.customContent,
      title: formData.subject,
      direction: formData.direction,
      result: formData.customerState,
      subject: formData.subject,
      type: 'Email',
      userName: user?.name,
      date: new Date().toISOString(),
    }
    const completeApt = await CompleteLastAppt(userId, financeId)
    const sendEmail = await EmailFunction(request, params, user, financeId, formPayload)
    const setComs = await prisma.communicationsOverview.create({
      data: comdata,
    });
    const saveComms = await ComsCount(financeId, 'Email')

    return json({ saveComms, sendEmail, completeApt, formData, setComs, })//, redirect(`/dummyroute`)
  }
  if (intent === 'addNewApt') {
    console.log('addnewapt')
    const lastContact = new Date().toISOString();
    let customerState = formData.customerState;
    if (customerState === "Pending") {
      customerState = "Attempted";
    }
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

    const finance = await prisma.finance.create({
      data: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        clientfileId: formData.clientId,
        brand: formData.brand,
        model: formData.model,
      }
    });
    const dashboard = await prisma.dashboard.create({
      data: {
        clientfileId: formData.clientId,
        financeId: finance.id, // Assuming the financeId is a foreign key in the dashboard table
        nextAppointment: dateTimeString,
        followUpDay: dateTimeString,
      },
    });
    const updateFinance = prisma.finance.update({
      where: {
        id: finance.id,
      },
      data: {
        dashboardId: dashboard.id,
      },
    });

    console.log('updated by scheduleFUp')
    const createNewApt = await prisma.clientApts.create({
      data: {
        title: 'Contacted by Instant Function',
        start: dateTimeString,
        end: formData.end,
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
        userId: formData.clientId,
        //  description: formData.description,
        userName: user.username,
        attachments: formData.attachments,
        //  direction: formData.direction,
        resultOfcall: formData.resultOfcall,
        resourceId: Number(formData.resourceId2),
        financeId: finance.id,
        stockNum: formData.stockNum,
        vin: formData.vin,
      },
    });
    console.log('created createNewApt ', createNewApt)

    const comdata = {
      financeId: formData.financeId,
      userId: formData.userId,
      content: formData.note,
      title: formData.title,
      direction: formData.direction,
      result: formData.resultOfcall,
      subject: formData.messageContent,
      type: 'Text',
      userName: user?.name,
      date: new Date().toISOString(),
    }
    const setComs = await prisma.communicationsOverview.create({
      data: comdata,
    });
    const financeId = formData.financeId


    const nextAppointment = dateTimeString
    const followUpDay = dateTimeString
    const updateDash = await prisma.dashboard.update({
      where: {
        financeId: financeId,
      },
      data: {
        lastContact: date,
        nextAppointment: nextAppointment,
      }
    });
    console.log(updateDash, createNewApt, setComs,)
    return json({ updateDash, createNewApt, setComs, dashboard, updateFinance })
  }

  if (intent === 'addCustomer') {
    const firstName = formData.firstName
    const lastName = formData.lastName
    const email = formData.email;
    const model = formData.model;
    const errors = {
      firstName: firstName ? null : "First Name is required",
      lastName: lastName ? null : "lastName is required",
      email: email ? null : "email is required",
      model: model ? null : "model is required",
    };
    const hasErrors = Object.values(errors).some((errorMessage) => errorMessage);
    if (hasErrors) {
      return json(errors);
    }
    function invariant(
      condition: any,
      message: string | (() => string),
    ): asserts condition {
      if (!condition) {
        throw new Error(typeof message === 'function' ? message() : message)
      }
    }
    invariant(typeof firstName === "string", "First Name must be a string");
    invariant(typeof lastName === "string", "Last Name must be a string");
    invariant(typeof email === "string", "Email must be a string");
    invariant(typeof model === "string", "Model must be a string");

    let data = formData
    console.log(data)
    let clientfile = await prisma.clientfile.findUnique({
      where: {
        email: data.email,
      },
    });
    if (!clientfile) {
      clientfile = await prisma.clientfile.create({
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          name: data.name,
          email: data.email,
          phone: data.phone,
          address: data.address,
          city: data.city,
          postal: data.postal,
          province: data.province,
          dl: data.dl,
          typeOfContact: data.typeOfContact,
          timeToContact: data.timeToContact,
        },
      });
    }
    let finance = await prisma.finance.create({
      data: {
        clientfileId: clientfile.id,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        name: data.name,
        address: data.address,
        city: data.city,
        postal: data.postal,
        province: data.province,
        dl: data.dl,
        typeOfContact: data.typeOfContact,
        timeToContact: data.timeToContact,
        deposit: data.deposit,
        desiredPayments: data.desiredPayments,
        stockNum: data.stockNum,
        options: data.options,
        accessories: data.accessories,
        year: data.year,
        brand: data.brand,
        model: data.model,
        model1: data.model1,
        color: data.color,
        modelCode: data.modelCode,
        msrp: data.msrp,
        userEmail: data.userEmail,
        tradeValue: data.tradeValue,
        tradeDesc: data.tradeDesc,
        tradeColor: data.tradeColor,
        tradeYear: data.tradeYear,
        tradeMake: data.tradeMake,
        tradeVin: data.tradeVin,
        tradeTrim: data.tradeTrim,
        tradeMileage: data.tradeMileage,
        trim: data.trim,
        vin: data.vin,
      },
    });
    console.log(finance)

    let dashboard = await prisma.dashboard.create({
      data: {
        financeId: finance.id,
        clientfileId: clientfile.id,
      },
    });
    console.log(dashboard)

    await prisma.finance.update({
      where: {
        id: finance.id,
      },
      data: {
        financeId: finance.id,
        dashboardId: dashboard.id,
        clientfileId: clientfile.id,
      }
    })
    return json({ clientfile, finance, dashboard })
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

dayjs.extend(timezone)

export default function DnDResource() {
  const { salesData, user, data } = useLoaderData()
  const [view, setView] = useState(Views.WEEK)
  const onView = useCallback((newView) => setView(newView), [setView])

  const resourceMap = [
    { resourceId: 1, resourceTitle: 'Sales Calls' },
    { resourceId: 2, resourceTitle: 'Sales Appointments' },
    { resourceId: 3, resourceTitle: 'Deliveries' },
    { resourceId: 4, resourceTitle: 'F & I' },
  ]
  // add an hour to start so each appt has an end
  const formattedData = salesData.map(event => ({
    ...event,
    start: new Date(event.start),
    end: new Date(new Date(event.start).getTime() + 45 * 60000), // 45 minutes in milliseconds
  }));
  const [myEvents, setMyEvents] = useState(formattedData)
  const localizer = dayjsLocalizer(dayjs)
  // toggles weather to make a copy when ddraging, i justr set it to false instead
  const [copyEvent, setCopyEvent] = useState(false)
  const toggleCopyEvent = useCallback(() => setCopyEvent((val) => !val), [])
  // dnd
  const moveEvent = useCallback(
    async ({
      event,
      start,
      end,
      resourceId,

      isAllDay: droppedOnAllDaySlot = false,
    }) => {
      const { allDay } = event;
      if (!allDay && droppedOnAllDaySlot) {
        event.allDay = true;
      }
      if (Array.isArray(event.resourceId)) {
        if (copyEvent) {
          resourceId = [...new Set([...event.resourceId, resourceId])];
        } else {
          const filtered = event.resourceId.filter(
            (ev) => ev !== event.sourceResource
          );
          resourceId = [...new Set([...filtered, resourceId])];
        }
      } else if (copyEvent) {
        resourceId = [...new Set([event.resourceId, resourceId])];
      }

      const apptId = event.id;
      console.log(data, apptId)

      const AptData = {
        intent: 'updateApt',
        start: start,
        end: end,
        id: apptId,
        resourceId: resourceId,
      }
      const promise2 = fetch('/calendar/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(AptData),
      })
        .then((response) => {
          console.log(`${response.url}: ${response.status}`);
        })
        .catch((error) => {
          console.error(`Failed to fetch: ${error}`);
        });


      setMyEvents((prev) => {
        const existing = prev.find((ev) => ev.id === event.id) ?? {};
        const filtered = prev.filter((ev) => ev.id !== event.id);

        return [...filtered, { ...existing, start, end, resourceId, allDay }];
      });
    },
    [setMyEvents, copyEvent]
  );

  async function onEventTriggered(data, apptId) {
    const finance = await prisma.clientApts.update({
      data: {
        ...data,
      },
      where: {
        id: apptId,
      },
    });

    console.log('finance updated successfully');
    return finance;
  }

  const resizeEvent = useCallback(
    ({ event, start, end }) => {
      setMyEvents(async (prev) => {
        const existing = prev.find((ev) => ev.id === event.id) ?? {}
        const filtered = prev.filter((ev) => ev.id !== event.id)
        const data = { start, end };
        const apptId = event.id;
        await onEventTriggered(data, apptId);
        return [...filtered, { ...existing, start, end }]
      })

    },
    [setMyEvents]
  )

  // min and max times
  const minTime = new Date();
  minTime.setHours(8, 0, 0);

  const maxTime = new Date();
  maxTime.setHours(21, 30, 0);

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
    setMyEvents(newEvents)
    setDatePickerEventFormData(initialDatePickerEventFormData)
  }
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
  const onAddEvent = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    const data: IEventInfo = {
      ...eventFormData,
      _id: generateId(),
      start: currentEvent?.start,
      end: currentEvent?.end,
      completed: currentEvent?.completed,
      apptType: currentEvent?.apptType,
      id: currentEvent?.id,
      contactMethod: currentEvent?.contactMethod,
      firstName: currentEvent?.firstName,
      lastName: currentEvent?.lastName,

    }

    const newEvents = [...myEvents, data]

    setMyEvents(newEvents)
    handleClose()
  }
  const [currentEvent, setCurrentEvent] = useState<Event | IEventInfo | null>(null)
  // event info modal
  const [eventInfoModal, setEventInfoModal] = useState(false)
  const handleSelectEvent = (event: IEventInfo) => {
    setCurrentEvent(event)
    setEventInfoModal(true)
  }
  const onDeleteEvent = () => {
    setCurrentEvent(() => [...events].filter((e) => e._id !== (currentEvent as IEventInfo)._id!))
    setEventInfoModal(false)
  }
  const onCompleteEvent = () => {
    setEventInfoModal(false)
  }
  // add customer modal
  const [addCustomerModal, setAddCustomerModal] = useState(false)
  const [addApptModal, setAddApptModal] = useState(false)
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

  const [showResources, setShowResources] = useState(true);

  const toggleView = () => {
    setShowResources(prevState => !prevState);
  };

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
        <span className="ml-auto justify-end mr-5">
          <Button
            onClick={toggleView}
            className='mr-3'
          >
            Toggle Resource View
          </Button>


        </span>
        <span className="ml-auto justify-end">
          <button className='rounded-tl-md   rounded-bl-md   p-2 cursor-pointer hover:text-[#02a9ff] justify-center items-center ' onClick={() => onNavigate(navigate.PREVIOUS)}>
            <ChevronsLeft size={20} strokeWidth={1.5} />
          </button>
          <button className='rounded-none  p-2 cursor-pointer hover:text-[#02a9ff] justify-center items-center ' onClick={() => onNavigate(navigate.TODAY)}>
            <ChevronsRightLeft size={20} strokeWidth={1.5} />
          </button>
          <button className=' rounded-tr-md  rounded-br-md  p-2 cursor-pointer hover:text-[#02a9ff] justify-center items-center mr-3' onClick={() => onNavigate(navigate.NEXT)}
          >
            <ChevronsRight size={20} strokeWidth={1.5} />
          </button>
        </span>
      </div>
    )
  }

  const [date, setDate] = useState<Date>()

  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentSecond = now.getSeconds();
  const [hour, setHour] = useState(currentHour)
  const [min, setMin] = useState(currentMinute)
  const [sec, setSec] = useState(currentSecond);
  useEffect(() => {
    function updateTime() {
      setHour(currentHour)
      setMin(currentMinute)
      setSec(currentSecond)
    }
    updateTime();
    const intervalId = setInterval(updateTime, 60000);
    return () => clearInterval(intervalId);
  }, []);
  const currentTime = `${hour}:${min}:${sec}`
  console.log(`Current time is `, currentTime);
  const time = `${hour}:${min}:${sec}`
  const newDate = new Date()

  const navigate = useNavigate();
  const [calendarLabel, setCalendarLabel] = useState('Sales')
  return (
    <>
      <div className="h-[75px]  w-auto  border-b border-[#3d3d3d] bg-[#121212] text-[#cbd0d4]">
        <h2 className="ml-[100px] text-2xl font-bold tracking-tight">Calendar</h2>
        <p className="text-muted-foreground   ml-[105px]  ">
          {calendarLabel}
        </p>
      </div>
      <div className=" grow">
        <div className='flex w-auto '>
          <EventInfoModal
            open={eventInfoModal}
            handleClose={() => setEventInfoModal(false)}
            onDeleteEvent={onDeleteEvent}
            currentEvent={currentEvent as IEventInfo}
            user={user}
            onCompleteEvent={onCompleteEvent}
          />
          <AddCustomerModal
            open={addCustomerModal}
            handleClose={() => setAddCustomerModal(false)}
            onDeleteEvent={onDeleteEvent}
            currentEvent={currentEvent as IEventInfo}
            user={user}
            onCompleteEvent={onCompleteEvent}
          />
          <AddAppt
            open={addApptModal}
            handleClose={() => setAddApptModal(false)}
            onDeleteEvent={onDeleteEvent}
            currentEvent={currentEvent as IEventInfo}
            user={user}
            onCompleteEvent={onCompleteEvent}
          />
          <div className='h-screen w-[310px] border-r border-[#3d3d3d]'>
            <div className=' mt-5 flex-col mx-auto justify-center'>
              <div className="mx-auto w-[280px] rounded-md border-white bg-[#121212] px-3 text-white " >
                <div className='  my-3 flex justify-center   '>
                  <CalendarIcon className="mr-2 size-8 " />
                  {date ? format(date, "PPP") : <span>{format(newDate, "PPP")}</span>}
                </div>
                <SmallCalendar
                  className='mx-auto w-auto   bg-[#121212] text-[#ccd2df]'
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </div>
            </div>
            <div className=' mt-2 grid grid-cols-1  justify-center mx-auto'>
              <input type='hidden' value={String(date)} name='value' />

              <Button
                variant={"ghost"}
                className={cn(
                  "w-[240px] px-4 text-[#ccd2df] mx-auto  h-[55px] font-normal bg-transparent hover:bg-transparent hover:text-[#02a9ff]  hover:border-transparent",
                  !date && " text-[#ccd2df]"
                )}
              >
                <div className=' text-[#ccd2df]  mx-auto flex justify-center my-auto '>
                  <ClockIcon className="mr-2 size-8 " />
                  {currentTime ? (time) : <span>Pick a Time</span>}
                  <p className='my-auto'></p>
                </div>
              </Button>

              <div className='mt-5 grow justify-center'>
                <div className=' grid grid-cols-1 ' >
                  <Accordion type="single" collapsible className="w-[240px] text-white mx-auto">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>Calendars</AccordionTrigger>
                      <AccordionContent>
                        <Button variant='ghost'
                          onClick={() => (
                            setCalendarLabel('Sales')
                          )}
                          className={cn(
                            buttonVariants({ variant: "ghost" }),
                            calendarLabel === 'Sales'
                              ? "bg-[#232324] hover:bg-[#232324] w-[90%]   "
                              : "hover:bg-[#232324]  w-[90%]  ",
                            "justify-start w-[90%] "
                          )} >
                          Sales
                        </Button>
                        <Button variant='ghost'
                          onClick={() => (
                            setCalendarLabel('Finance')
                          )}
                          className={cn(
                            buttonVariants({ variant: "ghost" }),
                            calendarLabel === 'Finance'
                              ? "bg-[#232324] hover:bg-[#232324] w-[90%]   "
                              : "hover:bg-[#232324]  w-[90%]  ",
                            "justify-start w-[90%] "
                          )} >
                          Finance
                        </Button>
                        <Button variant='ghost'
                          onClick={() => (
                            setCalendarLabel('Drivers Schedule')
                          )}
                          className={cn(
                            buttonVariants({ variant: "ghost" }),
                            calendarLabel === 'Drivers Schedule'
                              ? "bg-[#232324] hover:bg-[#232324] w-[90%]   "
                              : "hover:bg-[#232324]  w-[90%]  ",
                            "justify-start w-[90%] "
                          )} >
                          Drivers Schedule
                        </Button>
                        <Button variant='ghost'
                          onClick={() => (
                            setCalendarLabel('Service')
                          )}
                          className={cn(
                            buttonVariants({ variant: "ghost" }),
                            calendarLabel === 'Service'
                              ? "bg-[#232324] hover:bg-[#232324] w-[90%]   "
                              : "hover:bg-[#232324]  w-[90%]  ",
                            "justify-start w-[90%] "
                          )} >
                          Service
                        </Button>
                        <Button variant='ghost'
                          onClick={() => (
                            setCalendarLabel('Accessories')
                          )}
                          className={cn(
                            buttonVariants({ variant: "ghost" }),
                            calendarLabel === 'Accessories'
                              ? "bg-[#232324] hover:bg-[#232324] w-[90%]   "
                              : "hover:bg-[#232324]  w-[90%]  ",
                            "justify-start w-[90%] "
                          )} >
                          Accessories
                        </Button>
                        <Button variant='ghost'
                          onClick={() => (
                            setCalendarLabel('Parts')
                          )}
                          className={cn(
                            buttonVariants({ variant: "ghost" }),
                            calendarLabel === 'Parts'
                              ? "bg-[#232324] hover:bg-[#232324] w-[90%]   "
                              : "hover:bg-[#232324]  w-[90%]  ",
                            "justify-start w-[90%] "
                          )} >
                          Parts
                        </Button>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  <Button
                    variant='outline'
                    className=' px-4 mx-auto mt-3 text-[#cbd0d4] cursor-pointer hover:text-[#02a9ff] justify-center items-center border-[#fff] hover:border-[#02a9ff]  bg-transparent hover:bg-transparent w-[240px] '
                    onClick={() => setAddCustomerModal(true)}>
                    <>
                      <UserPlus size={20} strokeWidth={1.5} />
                      <p className='ml-2'>
                        Add Customer
                      </p>
                    </>
                  </Button>

                  <Button
                    variant='outline'
                    onClick={() => (
                      navigate('/dealer/leads/sales')
                    )}
                    className=' w-[240px] mt-3 text-[#cbd0d4] cursor-pointer hover:text-[#02a9ff] justify-center items-center  mx-auto  border-[#fff] hover:border-[#02a9ff] bg-transparent hover:bg-transparent   '  >
                    <>
                      <Gauge size={20} strokeWidth={1.5} />
                      <p className='ml-2'>
                        Sales Dashboard
                      </p>
                    </>
                  </Button>

                  <Button
                    variant='outline'
                    className=' px-4 mt-3 mx-auto text-[#cbd0d4] cursor-pointer hover:text-[#02a9ff] justify-center items-center   border-[#fff] hover:border-[#02a9ff] bg-transparent hover:bg-transparent w-[240px]'
                    onClick={() => setAddApptModal(true)}>
                    <>
                      <CalendarPlus size={20} strokeWidth={1.5} />
                      <p className='ml-2'>
                        Add Appointment
                      </p>
                    </>
                  </Button>

                  <SearchCustomerModal />
                </div>
              </div>
            </div>
          </div>

          <div className="flex w-[97%] justify-center overflow-clip">
            {showResources ? (
              <DragAndDropCalendar
                style={{
                  // width: 'auto',//`calc(100vw - 210px)`,
                  // height: 'auto',
                  // maxHeight: "95vh",
                  // overflow: "scroll",

                  width: `calc(100vw - 310px)`,
                  height: "100vh",
                  overflowX: "hidden",
                  overflowY: "scroll",
                  objectFit: "contain",
                  overscrollBehavior: "contain",
                  color: "white",
                }}

                defaultView={Views.DAY}
                events={myEvents}
                // step={30}
                //showMultiDayTimes={true}
                localizer={localizer}
                min={minTime}
                max={maxTime}

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
                onSelectEvent={handleSelectEvent}
                onSelectSlot={handleSelectSlot}
                onClick={() => setOpenDatepickerModal(true)}

                resourceIdAccessor="resourceId"
                resources={resourceMap}
                resourceTitleAccessor="resourceTitle"
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
                defaultView={Views.DAY}
                events={myEvents}
                step={15}
                showMultiDayTimes={true}
                localizer={localizer}
                min={minTime}
                max={maxTime}
                components={{
                  toolbar: CustomToolbar,
                  event: EventInfo,
                }}
                resizable
                selectable
                onEventDrop={moveEvent}
                onEventResize={resizeEvent}
                onSelectEvent={handleSelectEvent}
                onSelectSlot={handleSelectSlot}
                onClick={() => setOpenDatepickerModal(true)}
              />
            )}
          </div>
        </div>
      </div>
    </>

  )
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
  data: any;
}


export interface IEventInfo extends Event {
  _id: string
  id: string
  todoId?: string
  description: string
  allDay: string
  start: string
  end: string
  resourceId: number
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
  resourceId2: string
  address: string
  userId: string
  userName: string
  messageTitle: string
  attachments: string
  getClientFileById: string
  followUpDay: string
  clientFileId: string
  model: string
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
  resourceId2: string
  vin: string
  stockNum: string
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
  resourceId2: string
  getClientFileById: string
}

const initialEventFormState: EventFormData = {
  description: "",
  todoId: undefined,
  completed: 'no',
  apptType: '',
  getClientFileById: '',
  userEmail: '',
  followUpDay: '',
  clientFileId: '',
  brand: '',
  model: '',
  vin: '',
  stockNum: '',

}

const initialDatePickerEventFormData: DatePickerEventFormData = {
  description: "",
  todoId: undefined,
  allDay: false,
  start: undefined,
  resourceId2: '',
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
  apptStatus: '',
  unit: '',
  title: '',
  note: '',
  phone: '',
  address: '',
  userId: '',
  userName: '',
  messageTitle: '',
  attachments: '',
  getClientFileById: '',
  followUpDay: '',
  clientFileId: '',
  model: '',

}
/** <AddEventModal
              open={openSlot}
              handleClose={handleClose}
              eventFormData={eventFormData}
              setEventFormData={setEventFormData}
              onAddEvent={onAddEvent}
              todos={todos}

const views = ["day", "week", "month", "agenda"];

handleNavigation = (date, view, action) => {
  console.log(date, view, action);
  //it returns current date, view options[month,day,week,agenda] and action like prev, next or today
};
handleChange = () => {
  console.log("this block code executed");
};

var CustomToolbar = ({ handleChange }) => {
  return class BaseToolBar extends Toolbar {
    constructor(props) {
      super(props);
    }
    handleDayChange = (event, mconte) => {
      mconte(event.target.value);
    };
    handleNamvigate = (detail, elem) => {
      detail.navigate(elem);
    };
    render() {
      return (
        <div className="flex">
          <div className="mr-auto p-2 ">
            <IconButton onClick={() => this.handleNamvigate(this, "PREV")}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-chevron-left-circle"><circle cx="12" cy="12" r="10" /><path d="m14 16-4-4 4-4" /></svg>
            </IconButton>
            <IconButton onClick={() => this.handleNamvigate(this, "TODAY")}>
              <Circle strokeWidth={1.5} />
            </IconButton>
            <IconButton onClick={() => this.handleNamvigate(this, "NEXT")}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-chevron-right-circle"><circle cx="12" cy="12" r="10" /><path d="m10 8 4 4-4 4" /></svg>
            </IconButton>
          </div>
          <div className='mr-auto ml-5'>
            <IconButton onClick={() => setOpenSlot(true)}>
              <UserPlus size={20} strokeWidth={1.5} />
            </IconButton>
            <Link to='/dashboard/calls'>
              <IconButton >
                <Gauge size={20} strokeWidth={1.5} />
              </IconButton>
            </Link>
            <Link to='/calendar/sales'>
              <IconButton>
                <CalendarCheck size={20} strokeWidth={1.5} />
              </IconButton>
            </Link>

            <IconButton onClick={() => setOpenDatepickerModal(true)}>
              <Search size={20} strokeWidth={1.5} />
            </IconButton>
          </div>
          <div className="rbc-toolbar-label">{this.props.label}</div>

          <div className="rbc-btn-group">
            <select
              className="form-control"
              onChange={(e) => this.handleDayChange(e, this.view)}
              defaultValue={"week"}
            >
              <option className="optionbar" value="day">
                Day
              </option>
              <option className="optionbar" value="week">
                Week
              </option>
              <option className="optionbar" value="month">
                Month
              </option>
              <option className="optionbar" value="agenda">
                Agenda
              </option>
            </select>
          </div>
        </div>
      );
    }
  };
};
<AddEventModal
              open={openSlot}
              handleClose={handleClose}
              eventFormData={eventFormData}
              setEventFormData={setEventFormData}
              onAddEvent={onAddEvent}
              todos={todos}
            /> */


