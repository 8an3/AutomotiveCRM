import { Form, useActionData, useFetcher, useLoaderData, useNavigation, useSubmit } from '@remix-run/react'
import { Separator, Button, Input, Label, Switch, Checkbox } from '~/components/ui/index'
import { json, redirect, type ActionFunction, type DataFunctionArgstype, type MetaFunction, type LoaderFunction, } from '@remix-run/node'
import DailySheet from '~/components/formToPrint/dailyWorkPlan'
import { getUserById, updateUser, updateDealerFees, getDealerFeesbyEmail, getDealerFeesbyEmailAdmin } from '~/utils/user.server'
import financeFormSchema from '~/overviewUtils/financeFormSchema';
import { toast } from "sonner"
import React, { useState, useEffect, useRef } from 'react';
import { getMergedFinance } from '~/utils/dashloader/dashloader.server'
import { deleteDailyPDF } from '~/utils/dailyPDF/delete.server'
import { saveDailyWorkPlan } from '~/utils/dailyPDF/create.server'
import { getDailyPDF } from '~/utils/dailyPDF/get.server'
import { RemixNavLink, } from "~/components"
import { getUserIsAllowed } from "~/helpers";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "~/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger, } from "~/components/ui/tabs"
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow, } from "~/components/ui/table"
import { GetUser } from "~/utils/loader.server";
import { prisma } from "~/libs";
import { getSession, commitSession, destroySession } from '~/sessions/auth-session.server'
import { getSession as getAppearance, commitSession as commitAppearance, } from '~/sessions/appearance-session.server'
import { ButtonLoading } from "~/components/ui/button-loading";
import { requireAuthCookie } from '~/utils/misc.user.server';
import { model } from "~/models";
import axios from 'axios'
import IndeterminateCheckbox from "~/components/dashboard/calls/InderterminateCheckbox"
import { deleteProduct, getHomeData, createProduct, Board, createProvidor, updateProvidorName, deletePrice, updateProductName, upsertItem, getProductData } from '~/components/user/finance/product'
import { INTENTS, type RenderedItem, ItemMutationFields, ItemMutation, CONTENT_TYPES } from '~/components/user/finance/types'
import { badRequest } from "~/utils/http";
import invariant from "tiny-invariant";
import { SaveButton, CancelButton, EditableText } from '~/components/user/finance/components'
import { Plus, TrashIcon } from 'lucide-react'
import { flushSync } from "react-dom";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/components/ui/hover-card"
import { Trash } from "lucide-react";
import { parseItemMutation } from '~/components/user/finance/utils'
import { todoRoadmap } from './dashboard.roadmap'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer"
// dontergeasdf
import { DownloadIcon, PaperPlaneIcon, UploadIcon } from '@radix-ui/react-icons';
import Products from './dashboard.board'


export async function loader({ request, params }: LoaderFunction) {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")
  try {
    let user = await GetUser(email)
    if (user?.subscriptionId === 'active' || user?.subscriptionId === 'trialing') {
      let deFees;
      if (user.plan === 'prod_OY8EMf7RNoJXhX') {
        deFees = await prisma.dealer.findFirst();
      } else {
        deFees = await prisma.dealer.findUnique({ where: { userEmail: email } });
      }

      const dataPDF = await getDailyPDF(email)
      const statsData = await prisma.finance.findMany({
        where: { userEmail: { equals: email, }, },
      });
      let automations
      try {
        automations = await prisma.automations.findUnique({
          where: { userEmail: email, },
        });
      } catch (error) {
        if (!automations.id) {
          automations = await prisma.automations.create({
            data: {
              userEmail: user.email,
              pickUp24before: 'no',
              appt24before: 'no',
            }
          })
        }
      }

      const comsRecords = await prisma.comm.findMany({ where: { userEmail: email }, });
      const session2 = await getAppearance(request.headers.get("Cookie"));
      const getNewLook = user.newLook
      console.log(getNewLook, 'checking appearance')
      let financeProducts = await getHomeData();
      let boards = await getHomeData();

      return ({ user, deFees, dataPDF, statsData, comsRecords, getNewLook, automations, financeProducts, boards })
    } else {
      return redirect('/subscribe');
    }
  } catch (error) {
    console.log(error)
    return redirect('/auth/login');
  }
}

export function StatsTable({ statsData, comsRecords }) {

  function calculateQuotesForPeriod(statsData, start, end) {
    return statsData.filter(statsData => {
      const recordDate = new Date(statsData.createdAt);
      return recordDate >= start && recordDate <= end;
    }).length;
  }

  function calculateDepositMadeForPeriod(statsData, start, end) {
    return statsData.filter(record => {
      if (record.depositMade === 'on') {
        const recordDate = new Date(record.createdAt);
        return recordDate >= start && recordDate <= end;
      }
      return false;
    }).length;
  }
  function calulatefinanceAppForPeriod(statsData, start, end) {
    return statsData.filter(record => {
      if (record.financeApp === 'on') {
        const recordDate = new Date(record.createdAt);
        return recordDate >= start && recordDate <= end;
      }
      return false;
    }).length;
  }
  function calculatedeliveredForPeriod(statsData, start, end) {
    return statsData.filter(record => {
      if (record.delivered === 'on') {
        const recordDate = new Date(record.createdAt);
        return recordDate >= start && recordDate <= end;
      }
      return false;
    }).length;
  }

  function calculateLeadsForPeriod(comsRecords, start, end, type) {
    return comsRecords.filter(record => {
      const recordDate = new Date(record.createdAt);
      return recordDate >= start && recordDate <= end && record.type === type;
    }).length;
  }


  function calculatedcountsEmailForPeriod(statsData, start, end) {
    return statsData.reduce((sum, record) => {
      const recordDate = new Date(record.createdAt);
      if (recordDate >= start && recordDate <= end && record.Email !== "" && record.Email !== null) {
        return sum + Number(record.Email);
      }
      return sum;
    }, 0);
  }
  function calculatedcountsSMSForPeriod(statsData, start, end) {
    return statsData.reduce((sum, record) => {
      const recordDate = new Date(record.createdAt);
      if (recordDate >= start && recordDate <= end && record.SMS !== "" && record.SMS !== null) {
        return sum + Number(record.SMS);
      }
      return sum;
    }, 0);
  }
  function calculatedcountsPhoneForPeriod(statsData, start, end) {
    return statsData.reduce((sum, record) => {
      const recordDate = new Date(record.createdAt);
      if (recordDate >= start && recordDate <= end && record.Phone !== "" && record.Phone !== null) {
        return sum + Number(record.Phone);
      }
      return sum;
    }, 0);
  }

  const now = new Date();
  const startOfWeek = new Date();
  startOfWeek.setDate(now.getDate() - now.getDay());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  const lastYear = now.getFullYear() - 1;

  const startOfLastYearThisWeek = new Date();
  startOfLastYearThisWeek.setDate(now.getDate() - now.getDay());
  startOfLastYearThisWeek.setFullYear(lastYear);

  const startOfLastYearThisMonth = new Date(lastYear, now.getMonth(), 1);

  const startOfLastYear = new Date(lastYear, 0, 1);

  const count2 = calculateLeadsForPeriod(statsData, startOfMonth, now, 'walkin');
  const stats = [
    {
      period: 'This Week',
      quotes: calculateQuotesForPeriod(statsData, startOfWeek, now),
      deposits: calculateDepositMadeForPeriod(statsData, startOfWeek, now),
      financed: calulatefinanceAppForPeriod(statsData, startOfWeek, now),
      delivered: calculatedeliveredForPeriod(statsData, startOfWeek, now),
      repeatCustomer: 5,
      walkIn: calculateLeadsForPeriod(comsRecords, startOfWeek, now, 'walkin'),
      webLead: calculateLeadsForPeriod(comsRecords, startOfWeek, now, 'weblead'),
      phoneLead: calculateLeadsForPeriod(comsRecords, startOfWeek, now, 'phonelead'),
      total: (calculateLeadsForPeriod(comsRecords, startOfWeek, now, 'walkin') + calculateLeadsForPeriod(comsRecords, startOfWeek, now, 'weblead') + calculateLeadsForPeriod(comsRecords, startOfWeek, now, 'phonelead')),
      totalComs: '',
      emailsSent: calculatedcountsEmailForPeriod(statsData, startOfWeek, now),
      smsSent: calculatedcountsSMSForPeriod(statsData, startOfWeek, now),
      phoneCallsMade: calculatedcountsPhoneForPeriod(statsData, startOfWeek, now),
      timesContacted: (calculatedcountsEmailForPeriod(statsData, startOfWeek, now) + calculatedcountsSMSForPeriod(statsData, startOfWeek, now) + calculatedcountsPhoneForPeriod(statsData, startOfWeek, now)),
    },
    {
      period: 'This Month',
      quotes: calculateQuotesForPeriod(statsData, startOfMonth, now),
      deposits: calculateDepositMadeForPeriod(statsData, startOfMonth, now),
      financed: calulatefinanceAppForPeriod(statsData, startOfMonth, now),
      delivered: calculatedeliveredForPeriod(statsData, startOfMonth, now),
      repeatCustomer: 5,
      walkIn: calculateLeadsForPeriod(statsData, startOfMonth, now, 'walkin'),
      webLead: calculateLeadsForPeriod(statsData, startOfMonth, now, 'weblead'),
      phoneLead: calculateLeadsForPeriod(statsData, startOfMonth, now, 'phonelead'),
      total: (calculateLeadsForPeriod(statsData, startOfMonth, now, 'walkin') + calculateLeadsForPeriod(statsData, startOfMonth, now, 'weblead') + calculateLeadsForPeriod(statsData, startOfMonth, now, 'phonelead')),
      emailsSent: calculatedcountsEmailForPeriod(statsData, startOfMonth, now),
      smsSent: calculatedcountsSMSForPeriod(statsData, startOfMonth, now),
      phoneCallsMade: calculatedcountsPhoneForPeriod(statsData, startOfMonth, now),
      timesContacted: (calculatedcountsEmailForPeriod(statsData, startOfMonth, now) + calculatedcountsSMSForPeriod(statsData, startOfMonth, now) + calculatedcountsPhoneForPeriod(statsData, startOfMonth, now)),
    },
    {
      period: 'This Year',
      quotes: calculateQuotesForPeriod(statsData, startOfYear, now),
      deposits: calculateDepositMadeForPeriod(statsData, startOfYear, now),
      financed: calulatefinanceAppForPeriod(statsData, startOfYear, now),
      delivered: calculatedeliveredForPeriod(statsData, startOfYear, now),
      repeatCustomer: 5,
      walkIn: calculateLeadsForPeriod(statsData, startOfYear, now, 'walkin'),
      webLead: calculateLeadsForPeriod(statsData, startOfYear, now, 'weblead'),
      phoneLead: calculateLeadsForPeriod(statsData, startOfYear, now, 'phonelead'),
      total: (calculateLeadsForPeriod(statsData, startOfYear, now, 'walkin') + calculateLeadsForPeriod(statsData, startOfYear, now, 'weblead') + calculateLeadsForPeriod(statsData, startOfYear, now, 'phonelead')),
      emailsSent: calculatedcountsEmailForPeriod(statsData, startOfYear, now),
      smsSent: calculatedcountsSMSForPeriod(statsData, startOfYear, now),
      phoneCallsMade: calculatedcountsPhoneForPeriod(statsData, startOfYear, now),
      timesContacted: (calculatedcountsEmailForPeriod(statsData, startOfYear, now) + calculatedcountsSMSForPeriod(statsData, startOfYear, now) + calculatedcountsPhoneForPeriod(statsData, startOfYear, now)),
    },
    {
      period: 'This Week Last Year',
      quotes: calculateQuotesForPeriod(statsData, startOfLastYearThisWeek, lastYear),
      deposits: calculateDepositMadeForPeriod(statsData, startOfLastYearThisWeek, lastYear),
      financed: calulatefinanceAppForPeriod(statsData, startOfLastYearThisWeek, lastYear),
      delivered: calculatedeliveredForPeriod(statsData, startOfLastYearThisWeek, lastYear),
      repeatCustomer: 5,
      walkIn: calculateLeadsForPeriod(statsData, startOfLastYearThisWeek, lastYear, 'walkin'),
      webLead: calculateLeadsForPeriod(statsData, startOfLastYearThisWeek, lastYear, 'weblead'),
      phoneLead: calculateLeadsForPeriod(statsData, startOfLastYearThisWeek, lastYear, 'phonelead'),
      total: (calculateLeadsForPeriod(statsData, startOfLastYearThisWeek, lastYear, 'walkin') + calculateLeadsForPeriod(statsData, startOfLastYearThisWeek, lastYear, 'weblead') + calculateLeadsForPeriod(statsData, startOfLastYearThisWeek, lastYear, 'phonelead')),
      emailsSent: calculatedcountsEmailForPeriod(statsData, startOfLastYearThisWeek, lastYear),
      smsSent: calculatedcountsSMSForPeriod(statsData, startOfLastYearThisWeek, lastYear),
      phoneCallsMade: calculatedcountsPhoneForPeriod(statsData, startOfLastYearThisWeek, lastYear),
      timesContacted: (calculatedcountsEmailForPeriod(statsData, startOfLastYearThisWeek, lastYear) + calculatedcountsSMSForPeriod(statsData, startOfLastYearThisWeek, lastYear) + calculatedcountsPhoneForPeriod(statsData, startOfLastYearThisWeek, lastYear)),
    },
    {
      period: 'This Month Last Year',
      quotes: calculateQuotesForPeriod(statsData, startOfLastYearThisMonth, lastYear),
      deposits: calculateDepositMadeForPeriod(statsData, startOfLastYearThisMonth, lastYear),
      financed: calulatefinanceAppForPeriod(statsData, startOfLastYearThisMonth, lastYear),
      delivered: calculatedeliveredForPeriod(statsData, startOfLastYearThisMonth, lastYear),
      repeatCustomer: 5,
      walkIn: calculateLeadsForPeriod(statsData, startOfLastYearThisMonth, lastYear, 'walkin'),
      webLead: calculateLeadsForPeriod(statsData, startOfLastYearThisMonth, lastYear, 'weblead'),
      phoneLead: calculateLeadsForPeriod(statsData, startOfLastYearThisMonth, lastYear, 'phonelead'),
      total: (calculateLeadsForPeriod(statsData, startOfLastYearThisMonth, lastYear, 'walkin') + calculateLeadsForPeriod(statsData, startOfLastYearThisMonth, lastYear, 'weblead') + calculateLeadsForPeriod(statsData, startOfLastYearThisMonth, lastYear, 'phonelead')),
      emailsSent: calculatedcountsEmailForPeriod(statsData, startOfLastYearThisMonth, lastYear),
      smsSent: calculatedcountsSMSForPeriod(statsData, startOfLastYearThisMonth, lastYear),
      phoneCallsMade: calculatedcountsPhoneForPeriod(statsData, startOfLastYearThisMonth, lastYear),
      timesContacted: (calculatedcountsEmailForPeriod(statsData, startOfLastYearThisMonth, lastYear) + calculatedcountsSMSForPeriod(statsData, startOfLastYearThisMonth, now) + calculatedcountsPhoneForPeriod(statsData, startOfLastYearThisMonth, lastYear)),
    },
    {
      period: 'Last Year',
      quotes: calculateQuotesForPeriod(statsData, startOfLastYear, lastYear),
      deposits: calculateDepositMadeForPeriod(statsData, startOfLastYear, lastYear),
      financed: calulatefinanceAppForPeriod(statsData, startOfLastYear, lastYear),
      delivered: calculatedeliveredForPeriod(statsData, startOfLastYear, lastYear),
      repeatCustomer: 5,
      walkIn: calculateLeadsForPeriod(statsData, startOfLastYear, lastYear, 'walkin'),
      webLead: calculateLeadsForPeriod(statsData, startOfLastYear, lastYear, 'weblead'),
      phoneLead: calculateLeadsForPeriod(statsData, startOfLastYear, lastYear, 'phonelead'),
      total: (calculateLeadsForPeriod(statsData, startOfLastYear, lastYear, 'walkin') + calculateLeadsForPeriod(statsData, startOfLastYear, lastYear, 'weblead') + calculateLeadsForPeriod(statsData, startOfLastYear, lastYear, 'phonelead')),
      emailsSent: calculatedcountsEmailForPeriod(statsData, startOfLastYear, lastYear),
      smsSent: calculatedcountsSMSForPeriod(statsData, startOfLastYear, lastYear),
      phoneCallsMade: calculatedcountsPhoneForPeriod(statsData, startOfLastYear, lastYear),
      timesContacted: (calculatedcountsEmailForPeriod(statsData, startOfLastYear, lastYear) + calculatedcountsSMSForPeriod(statsData, startOfLastYear, lastYear) + calculatedcountsPhoneForPeriod(statsData, startOfLastYear, lastYear)),
    },
    // More objects for other time periods...
  ];
  return (
    <Table className='bg-background text-foreground w-full max-w-full overflow-x-auto'>
      <TableCaption>List of Stats</TableCaption>
      <TableHeader>
        <TableRow className="bg-background border-border text-muted-foreground">
          <TableHead className='w-[200px] no-wrap text-center' >Period</TableHead>
          <TableHead className='w-auto no-wrap text-center' >Quotes</TableHead>
          <TableHead className='w-auto no-wrap text-center' >Deposits</TableHead>
          <TableHead className='w-auto no-wrap text-center' >Financed</TableHead>
          <TableHead className='w-auto no-wrap text-center' >Delivered</TableHead>
          <TableHead className='w-[175px] no-wrap text-center' >Repeat Cust</TableHead>
          <TableHead className='w-[100px] no-wrap text-center' >Walk-in</TableHead>
          <TableHead className='w-[175px] no-wrap text-center' >Web-lead</TableHead>
          <TableHead className='w-[175px] no-wrap text-center' >Phone-lead</TableHead>
          <TableHead className='w-auto no-wrap text-center' >Total</TableHead>
          <TableHead className='w-[175px] no-wrap text-center' >Emails Sent</TableHead>
          <TableHead className='w-[175px] no-wrap text-center' >SMS Sent</TableHead>
          <TableHead className='w-[175px] no-wrap text-center' >Phone Calls Made</TableHead>
          <TableHead className='w-[175px] no-wrap text-center' >Times Contacted</TableHead>
          <TableHead className='w-auto no-wrap text-center' >Appts</TableHead>
          <TableHead className='w-[175px] no-wrap text-center' >Appts Showed</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {stats.map((stat) => (
          <TableRow key={stat.period} className="bg-background border-border text-center even:bg-accent">
            <TableCell >{stat.period}</TableCell>
            <TableCell >{stat.quotes}</TableCell>
            <TableCell >{stat.deposits}</TableCell>
            <TableCell >{stat.financed}</TableCell>
            <TableCell >{stat.delivered}</TableCell>
            <TableCell >{stat.repeatCustomer}</TableCell>
            <TableCell >{stat.walkIn}</TableCell>
            <TableCell >{stat.webLead}</TableCell>
            <TableCell >{stat.phoneLead}</TableCell>
            <TableCell >{stat.total}</TableCell>
            <TableCell >{stat.emailsSent}</TableCell>
            <TableCell >{stat.smsSent}</TableCell>
            <TableCell >{stat.phoneCallsMade}</TableCell>
            <TableCell >{stat.timesContacted}</TableCell>
            <TableCell >Appts</TableCell>
            <TableCell >Appts Showed</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}


function ProfileForm({ user, deFees, dataPDF, statsData, comsRecords, getNewLook, automations }) {
  let finance = ''
  let data = ''
  const fetcher = useFetcher()
  const name = user.name
  const phone = user.phone
  // console.log('user', user)
  let dealerPhone
  let omvicNumber
  let dealerAddress
  let dealerProv

  if (deFees && deFees.dealerPhone) {
    dealerPhone = deFees.dealerPhone || ''
  } else {
    console.error('The object or dealerPhone property is undefined.');
  }
  if (deFees && deFees.omvicNumber) {
    omvicNumber = deFees.omvicNumber || ''
  } else {
    console.error('The object or omvicNumber property is undefined.');
  }
  if (deFees && deFees.dealerAddress) {
    dealerAddress = deFees.dealerAddress || ''
  } else {
    console.error('The object or dealerAddress property is undefined.');
  }
  if (deFees && deFees.dealerProv) {
    dealerProv = deFees.dealerProv || ''
  } else {
    console.error('The object or dealerProv property is undefined.');
  }
  const [dealerCity, dealerProvince, dealerPostal] = dealerProv.split(',').map(part => part.trim());

  const [open, setOpen] = React.useState(false);
  const eventDateRef = React.useRef(new Date());
  const timerRef = React.useRef(0);

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  const Dealerfees = [
    { name: "userAdmin", value: deFees.userAdmin, placeholder: "Admin" },
    { name: "userFreight", value: deFees.userFreight, placeholder: "Freight" },
    { name: "userCommodity", value: deFees.userCommodity, placeholder: "Commodity" },
    { name: "userPDI", value: deFees.userPDI, placeholder: "PDI" },
    { name: "userAirTax", value: deFees.userAirTax, placeholder: "Air Tax" },
    { name: "userTireTax", value: deFees.userTireTax, placeholder: "Tire Tax" },
    { name: "userGovern", value: deFees.userGovern, placeholder: "Government Fees" },
    { name: "userFinance", value: deFees.userFinance, placeholder: "Finance Fees" },
    { name: "destinationCharge", value: deFees.destinationCharge, placeholder: "Dest. Charge" },
    { name: "userGasOnDel", value: deFees.userGasOnDel, placeholder: "Gas On Delivery" },
    { name: "userMarketAdj", value: deFees.userMarketAdj, placeholder: "Market Adj" },
    { name: "userDemo", value: deFees.userDemo, placeholder: "Demo Fee" },
    { name: "userOMVIC", value: deFees.userOMVIC, placeholder: "OMVIC or Other" },
  ];


  const FinanceOptions = [
    { name: "userExtWarr", value: deFees.userExtWarr, placeholder: 'Ext Warranty' },
    { name: "userLoanProt", value: deFees.userLoanProt, placeholder: 'Loan Protection' },
    { name: "userGap", value: deFees.userGap, placeholder: 'Gap Protection' },
    { name: "userTireandRim", deFees: deFees.userTireandRim, placeholder: 'Tire and Rim' },
    { name: "vinE", value: deFees.vinE, placeholder: 'Vin Etching' },
    { name: "rustProofing", value: deFees.rustProofing, placeholder: 'Under Coating' },
    { name: "userServicespkg", value: deFees.userServicespkg, placeholder: 'Service Package' },
    { name: "lifeDisability", value: deFees.lifeDisability, placeholder: 'Life and Disability' },
    { name: "userOther", value: deFees.userOther, placeholder: 'Other' },
  ];

  const errors = useActionData() as Record<string, string | null>;
  const navigation = useNavigation();

  const isSubmitting = navigation.state === "submitting";
  const [activixActivated, setActivixActivated] = useState(user.activixActivated);

  const [newLook, setNewLook] = useState(getNewLook);

  const [formData, setFormData] = useState({
    pickUp24before: automations.pickUp24before || '',
    appt24before: automations.appt24before || '',
    noFollowup: automations.noFollowup || '',
    askForReferral: automations.askForReferral || '',
    oneYearAnni: automations.oneYearAnni || '',
    del7days: automations.del7days || '',
    afterDelTY: automations.afterDelTY || '',
    afterHoursClosed: automations.afterHoursClosed || '',
  });

  const automationsList = [
    { label: 'Appointment reminder / 24 hours', name: 'appt24before' },
    { label: 'Pick-Up reminder / 24 hours', name: 'pickUp24before' },
    { label: 'After Hour Closer Email', name: 'afterHoursClosed' },
    { label: 'After Del Thank You', name: 'afterDelTY' },
    { label: 'Delivered - Picked up 7 days ago', name: 'del7days' },
    { label: 'One year Anni', name: 'oneYearAnni' },
    { label: 'Delivered Asking for Referral', name: 'askForReferral' },
    { label: 'No Follow-up Scheduled', name: 'noFollowup' },
  ];

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: checked ? 'yes' : 'no',
    }));
  };
  const { boards } = useLoaderData()
  return (
    <Tabs defaultValue="account" className="w-[80%] ml-5 mr-auto" >
      <TabsList className="rounded-md ">
        <TabsTrigger className='rounded-md' value="account">Account</TabsTrigger>
        <TabsTrigger className='rounded-md' value="dealerFees">Dealer Fees</TabsTrigger>
        <TabsTrigger className='rounded-md' value="Automations">Automations</TabsTrigger>
      </TabsList>
      <TabsContent value="dealerFees" className='rounded-md'>
        <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-3 flex-col gap-4  p-4 md:gap-8 md:p-10">
          <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
            <div className="grid gap-6">
              <Card x-chunk="dashboard-04-chunk-1">
                <Form method="post" className="">
                  <CardHeader>
                    <CardTitle>  DEALER FEES</CardTitle>
                    <CardDescription>
                      This is where you can change values like freight, admin, taxes and
                      such. If you don't have all this information with you, dont worry, you can always come back and update it later.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {user.plan === 'prod_OY8EMf7RNoJXhX' ? (
                      <p className='text-center mt-5'>Dealer management will set the dealer fees for you.</p>
                    ) : (
                      <>
                        <div className="grid grid-cols-5 gap-2 w-[90%] mx-auto">
                          {Dealerfees.map((fee, index) => (
                            <div key={index} className="relative mt-4 mx-3">
                              <Input
                                name={fee.name}
                                defaultValue={fee.value}
                                className="border-border bg-background "
                              />
                              <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">{fee.placeholder}</label>
                            </div>
                          ))}
                          <div className="relative mt-4  mx-3">
                            <Input
                              defaultValue={deFees.userLicensing}
                              name="userLicensing"
                              className="border-border bg-background "
                            />
                            {errors?.userLicensing ? (
                              <em className="text-[#ff0202]">{errors.userLicensing}</em>
                            ) : null}
                            <label className=" text-sm absolute left-3 -top-3 px-2 rounded-full bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Licensing</label>
                          </div>
                          <div className="relative mt-4  mx-3">
                            <Input
                              defaultValue={deFees.userTax}
                              name="userTax"
                              className="border-border bg-background "
                            />
                            {errors?.userTax ? (
                              <em className="text-[#ff0202]">{errors.userTax}</em>
                            ) : null}
                            <label className=" text-sm absolute left-3 -top-3 px-2 rounded-full bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Sales tax</label>
                          </div>
                          <div className="relative mt-4  mx-3">
                            <Input
                              defaultValue={deFees.userLabour}
                              name="userLabour"
                              className="border-border bg-background "
                            />
                            {errors?.userLabour ? (
                              <em className="text-[#ff0202]">{errors.userLabour}</em>
                            ) : null}
                            <label className=" text-sm absolute left-3 -top-3 px-2 rounded-full bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Service Labour</label>
                          </div>
                        </div>
                        <hr className="my-4 text-muted-foreground w-[95%] mx-auto" />
                        <div className="font-semibold ml-[50px]">Options</div>
                        <div className="my-4 grid grid-cols-5 gap-2 w-[90%] mx-auto">
                          {FinanceOptions.map((option, index) => (
                            <div key={index} className="relative mt-3 mx-3">
                              <Input
                                name={option.name}
                                defaultValue={option.value}
                                className="border-border bg-background "
                              />
                              <label className=" text-sm absolute left-3 -top-3 px-2 rounded-full bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">{option.placeholder}</label>
                            </div>
                          ))}
                          <Input type='hidden' defaultValue={user.email} name="userEmail" />
                        </div>
                      </>
                    )}
                  </CardContent>
                  <CardFooter className="border-t  border-border px-6 py-4">
                    {user.plan === 'prod_OY8EMf7RNoJXhX' ? (
                      null
                    ) : (
                      <ButtonLoading
                        size="sm"
                        className="w-auto cursor-pointer mb-5 mt-5 mr-auto bg-primary"
                        type="submit"
                        name='intent'
                        value='updateUser'
                        isSubmitting={isSubmitting}
                        onClick={() => toast.success(`Update complete.`)}
                        loadingText="Updating information..."
                      >
                        Update
                      </ButtonLoading>
                    )}
                  </CardFooter>
                </Form>
              </Card>
            </div>
          </div>
        </main>
      </TabsContent>
      <TabsContent value="account" className='rounded-md  grid grid-cols-2'>
        <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4  p-4 md:gap-8 md:p-10">
          <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
            <div className="grid gap-6">
              <Card x-chunk="dashboard-04-chunk-1">
                <Form method="post" className="">
                  <CardHeader>
                    <CardTitle> EDIT ACCOUNT</CardTitle>
                    <CardDescription>
                      Name, Phone # and email will show up in emails sent to customers.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-2">
                      <div className="relative mt-4">
                        <Input
                          defaultValue={name}
                          name="name"
                          className="border-border bg-background "
                        />
                        {errors?.userLicensing ? (
                          <em className="text-[#ff0202]">{errors.userLicensing}</em>
                        ) : null}
                        <label className=" text-sm absolute left-3 -top-3 px-2 rounded-full bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">First Name</label>
                      </div>
                      <div className="relative mt-4">
                        <Input
                          defaultValue={phone}
                          name="phone"
                          className="border-border bg-background "
                        />
                        {errors?.userLicensing ? (
                          <em className="text-[#ff0202]">{errors.userLicensing}</em>
                        ) : null}
                        <label className=" text-sm absolute left-3 -top-3 px-2 rounded-full bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Phone</label>
                      </div>
                      <div className="relative mt-4">
                        <Input
                          defaultValue={user.email}
                          name="userEmail"
                          className="border-border bg-background "
                        />
                        {errors?.userTax ? (
                          <em className="text-[#ff0202]">{errors.userTax}</em>
                        ) : null}
                        <label className=" text-sm absolute left-3 -top-3 px-2 rounded-full bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Email</label>
                      </div>
                      <div className="relative mt-4">
                        <Input
                          defaultValue={user.username}
                          name="username"
                          className="border-border bg-background "
                        />
                        {errors?.userLabour ? (
                          <em className="text-[#ff0202]">{errors.userLabour}</em>
                        ) : null}
                        <label className=" text-sm absolute left-3 -top-3 px-2 rounded-full bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Full Name</label>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t border-border px-6 py-4">
                    <ButtonLoading
                      size="sm"
                      className="w-[250px] mr-auto cursor-pointer mb-5 mt-5 bg-primary"
                      type="submit"
                      name='intent'
                      value='updateFees'
                      isSubmitting={isSubmitting}
                      onClick={() => toast.success(`Update complete.`)}
                      loadingText="Updating information..."
                    >
                      Update
                    </ButtonLoading>
                  </CardFooter>
                </Form>
              </Card>

              <Card x-chunk="dashboard-04-chunk-2">
                <Form method="post" className="">
                  <CardHeader>
                    <CardTitle> Dealer Information </CardTitle>
                    <CardDescription>
                      This will only be for contracts. Only needed if your using this app without a dealer.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-2">
                      <div className="relative mt-4">
                        <Input
                          defaultValue={deFees?.dealer}
                          name="dealer"
                          className="border-border bg-background "
                        />
                        {errors?.userLabour ? (
                          <em className="text-[#ff0202]">{errors.userLabour}</em>
                        ) : null}
                        <label className=" text-sm absolute left-3 -top-3 px-2 rounded-full bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Dealer Name</label>
                      </div>
                      <div className="relative mt-4">
                        <Input
                          defaultValue={dealerAddress}
                          name="dealerAddress"
                          className="border-border bg-background "
                        />
                        {errors?.userLabour ? (
                          <em className="text-[#ff0202]">{errors.userLabour}</em>
                        ) : null}
                        <label className=" text-sm absolute left-3 -top-3 px-2 rounded-full bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Dealer Address</label>
                      </div>
                      <div className="relative mt-4">
                        <Input
                          defaultValue={dealerCity}
                          name="dealerCity"
                          className="border-border bg-background "
                        />
                        {errors?.userLabour ? (
                          <em className="text-[#ff0202]">{errors.userLabour}</em>
                        ) : null}
                        <label className=" text-sm absolute left-3 -top-3 px-2 rounded-full bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Dealer City</label>
                      </div>
                      <div className="relative mt-4">
                        <Input
                          defaultValue={dealerProvince}
                          name="dealerProv"
                          className="border-border bg-background "
                        />
                        {errors?.userLabour ? (
                          <em className="text-[#ff0202]">{errors.userLabour}</em>
                        ) : null}
                        <label className=" text-sm absolute left-3 -top-3 px-2 rounded-full bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Dealer Province</label>
                      </div>
                      <div className="relative mt-4">
                        <Input
                          defaultValue={dealerPostal}
                          name="dealerPostal"
                          className="border-border bg-background "
                        />
                        {errors?.userLabour ? (
                          <em className="text-[#ff0202]">{errors.userLabour}</em>
                        ) : null}
                        <label className=" text-sm absolute left-3 -top-3 px-2 rounded-full bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Dealer Postal Code</label>
                      </div>
                      <div className="relative mt-4">
                        <Input
                          defaultValue={dealerPhone}
                          name="dealerPhone"
                          className="border-border bg-background "
                        />
                        {errors?.userLabour ? (
                          <em className="text-[#ff0202]">{errors.userLabour}</em>
                        ) : null}
                        <label className=" text-sm absolute left-3 -top-3 px-2 rounded-full bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Dealer Phone</label>
                      </div>
                      <div className="relative mt-4">
                        <Input
                          defaultValue={omvicNumber}
                          name="omvicNumber"
                          className="border-border bg-background "
                        />
                        {errors?.userLabour ? (
                          <em className="text-[#ff0202]">{errors.userLabour}</em>
                        ) : null}
                        <label className=" text-sm absolute left-3 -top-3 px-2 rounded-full bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">OMVIC / GOV Lic</label>
                      </div>
                      <Input type='hidden' defaultValue={user.email} name="userEmail" />
                      <Input type='hidden' defaultValue={user.email} name="email" />
                    </div>
                  </CardContent>
                  <CardFooter className="border-t  border-border px-6 py-4">
                    <ButtonLoading
                      size="sm"
                      className="w-[250px] mr-auto cursor-pointer mb-5 mt-5 bg-primary"
                      type="submit"
                      name='intent'
                      value='updateFees'
                      isSubmitting={isSubmitting}
                      onClick={() => toast.success(`Update complete.`)}
                      loadingText="Updating information..."
                    >
                      Update
                    </ButtonLoading>
                  </CardFooter>
                </Form>
              </Card>

              <Card x-chunk="dashboard-04-chunk-2">
                <CardHeader>
                  <CardTitle> ACCOUNT FUNCTIONS</CardTitle>
                  <CardDescription>
                    The directory within your project, in which your plugins are
                    located.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='flex '>
                    <Drawer>
                      <DrawerTrigger asChild>
                        <Button
                          size='sm'
                          className="w-auto cursor-pointer mr-3  bg-primary text-foreground"
                        >
                          Downloads
                        </Button>
                      </DrawerTrigger>
                      <DrawerContent className='border-border'>
                        <div className="mx-auto w-full max-w-sm">
                          <DrawerHeader>
                            <DrawerTitle>Downloads</DrawerTitle>
                            <DrawerDescription>Download your data whenever you need it.</DrawerDescription>
                          </DrawerHeader>
                          <div className='grid grid-cols-1 '>
                            <div className='flex justify-between items-center'>
                              <p>Templates/Scripts</p>
                              <a href={`/dealer/user/download/templates`} target='_blank'>
                                <Button
                                  type="submit"
                                  size="icon"
                                  onClick={() => {
                                    toast.success(`Downloading data....`)
                                  }}
                                  className='bg-primary ml-auto '>
                                  <DownloadIcon className="h-4 w-4" />
                                  <span className="sr-only">Download</span>
                                </Button>
                              </a>
                            </div>

                          </div>
                          <DrawerFooter>
                            <DrawerClose asChild>
                              <Button variant="outline">Cancel</Button>
                            </DrawerClose>
                          </DrawerFooter>
                        </div>
                      </DrawerContent>
                    </Drawer>
                    <Drawer>
                      <DrawerTrigger asChild>
                        <Button
                          size='sm'
                          className="w-auto cursor-pointer mr-3 text-foreground bg-primary"
                        >
                          Integration Settings
                        </Button>
                      </DrawerTrigger>
                      <DrawerContent className='border-border'>
                        <div className="mx-auto w-full max-w-sm">
                          <DrawerHeader>
                            <DrawerTitle>Integration Settings</DrawerTitle>
                            <DrawerDescription> Will unlock featues and functions that will only benefit users who currently use other CRMs. Essentially replacing your current crm dashboard and processes, think of it as a new "skin" for your dashboard to deal with your day to day activities and customers. If you do not see your CRM here let us know and we will integrate with them.</DrawerDescription>
                          </DrawerHeader>
                          <Form method="post" className="w-[95%]">

                            <ul className="grid gap-3 text-sm mt-3">
                              <li className="flex items-center justify-between">
                                <span className="text-muted-foreground">
                                  Activix
                                </span>
                                <span>
                                  <input
                                    className='scale-150 p-3'
                                    type='checkbox'
                                    id='necessary'
                                    name='activixActivated'
                                    checked={activixActivated}
                                    onChange={handleCheckboxChange}
                                  />
                                </span>
                                <input type='hidden' name='activixActivated' value={activixActivated ? 'yes' : 'no'} />
                              </li>
                            </ul>

                            {user.activixActivated === 'yes' && (
                              <div className="flex flex-col ">
                                <hr className="my-4 text-muted-foreground w-[95%] mx-auto" />
                                <div className="font-semibold ">Activx</div>
                                <div className="relative mt-3">
                                  <Input
                                    className="border-border bg-background  "
                                    type="email"
                                    name="activixEmail"
                                    defaultValue={user.activixEmail}
                                  />
                                  <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Activix Email</label>
                                </div>
                                <div className="relative mt-3">
                                  <Input
                                    className="border-border bg-background  "
                                    type="email"
                                    name="activixEmail"
                                    defaultValue={user.activixEmail}
                                  />
                                  <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Dealer Account Id</label>
                                </div>
                              </div>
                            )}
                            <Input type='hidden' name="email" defaultValue={user.email} />
                            <Input type='hidden' name="userEmail" defaultValue={user.email} />
                            <div className='flex justify-between items-center mt-5 mb-5' >
                              <DrawerClose asChild>
                                <Button variant="outline">Cancel</Button>
                              </DrawerClose>
                              <ButtonLoading
                                size="sm"
                                className="w-auto cursor-pointer  bg-primary"
                                type="submit"
                                name='intent'
                                value='activixActivated'
                                isSubmitting={isSubmitting}
                                onClick={() => toast.success(`Update complete.`)}
                                loadingText="Updating information..."
                              >
                                Update
                              </ButtonLoading>

                            </div>

                          </Form>

                        </div>
                      </DrawerContent>
                    </Drawer>
                    <Drawer>
                      <DrawerTrigger asChild>
                        <Button
                          size='sm'
                          className="w-auto cursor-pointer  text-foreground mr-3 bg-primary"
                        >
                          Appearance
                        </Button>
                      </DrawerTrigger>
                      <DrawerContent className='border-border'>
                        <div className="mx-auto w-full max-w-sm">
                          <DrawerHeader>
                            <DrawerTitle>New Quote and Overview Appearance</DrawerTitle>
                            <DrawerDescription> Changes the look of the quote and overview pages.</DrawerDescription>
                          </DrawerHeader>
                          <Form method="post" className="">

                            <Input type='hidden' name="userEmail" defaultValue={user.email} />

                            <ul className="grid gap-3 text-sm mt-3">
                              <li className="flex items-center justify-between">
                                <span className="text-muted-foreground">
                                  Change looks?
                                </span>
                                <IndeterminateCheckbox
                                  className='  border-[#ff0202]'
                                  id='necessary'
                                  name='newLook'
                                  checked={newLook === 'on'}
                                  onChange={() => {
                                    if (newLook === 'off') {
                                      setNewLook('on')
                                    } else {
                                      setNewLook('off')
                                    }
                                  }}
                                />
                              </li>
                            </ul>
                            <div className='flex justify-between items-center mt-5 mb-5' >
                              <DrawerClose asChild>
                                <Button variant="outline">Cancel</Button>
                              </DrawerClose>
                              <ButtonLoading
                                size="sm"
                                className="w-auto cursor-pointer mb-5 mt-5 bg-primary"
                                type="submit"
                                name='intent'
                                value='appearance'
                                isSubmitting={isSubmitting}
                                onClick={() => {
                                  toast.success(`Update complete.`)
                                }}
                                loadingText="Updating information..."
                              >
                                Update
                              </ButtonLoading>
                            </div>
                          </Form>
                        </div>
                      </DrawerContent>
                    </Drawer>
                  </div>
                </CardContent>
                <CardFooter className="border-t px-6 py-4  border-border">

                </CardFooter>
              </Card>
            </div>
          </div>
        </main>

      </TabsContent>
      <TabsContent value="Automations" className='rounded-md  grid grid-cols-2'>
        <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4  p-4 md:gap-8 md:p-10">
          <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
            <div className="grid gap-6">
              <Card x-chunk="dashboard-04-chunk-1">
                <Form method='post' >
                  <CardHeader>
                    <CardTitle>   Automations</CardTitle>
                    <CardDescription>
                      Used to automate taskes.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="grid gap-3 text-sm mt-2">
                      {automationsList.map((auto, index) => (
                        <li key={index} className="flex items-center justify-between">
                          <span className="text-muted-foreground">{auto.label}</span>
                          <span>
                            <div className="inline-flex items-center">
                              <label className="relative flex items-center rounded-full cursor-pointer" htmlFor={auto.name}>
                                <input
                                  type="checkbox"
                                  id={auto.name}
                                  name={auto.name}
                                  checked={formData[auto.name] === 'yes'}
                                  onChange={handleCheckboxChange}
                                  className='border-[#c72323] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-blue-500 checked:bg-blue-500 checked:before:bg-blue-500 hover:before:opacity-10'
                                />
                                <span className="absolute text-foreground transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                  </svg>
                                </span>
                              </label>
                            </div>
                          </span>
                        </li>
                      ))}
                    </ul>
                    <Input type='hidden' defaultValue={user.email} name="userEmail" />
                  </CardContent>
                  <CardFooter className="border-t px-6 py-4 border-border">
                    <ButtonLoading
                      size="sm"
                      className="w-auto cursor-pointer mb-5 mt-5 mr-auto bg-primary"
                      type="submit"
                      name='intent'
                      value='automations'
                      isSubmitting={isSubmitting}
                      onClick={() => toast.success(`Update complete.`)}
                      loadingText="Updating information..."
                    >
                      Update
                    </ButtonLoading>
                  </CardFooter>
                </Form>

              </Card>
            </div>
          </div>
        </main>

      </TabsContent>
      <TabsContent value="FinanceProducts" className='rounded-md'>
        <Card className='rounded-md text-foreground border-border border bg-muted-background w-[70vw] h-[70vh] max-h-[70vh] overflow-y-scroll'>
          <CardHeader className=''>
            <CardTitle className='text-foreground'>
              <h3 className="text-2xl font-thin uppercase text-foreground">
                Finance Products
              </h3>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-foreground">
            <Products boards={boards} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

export const action: ActionFunction = async ({ request }) => {
  const formPayload = Object.fromEntries(await request.formData())
  const Input = financeFormSchema.parse(formPayload)
  console.log(Input, 'inputs from form')
  const intent = formPayload.intent
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")
  let user = await GetUser(email)
  if (intent === 'updateFees') {
    const saveDealer = await prisma.dealer.update({
      data: {
        userOMVIC: Input.userOMVIC,
        dealer: Input.dealer,
        omvicNumber: Input.omvicNumber,
        dealerPhone: Input.dealerPhone,
        dealerProv: Input.dealerCity + ', ' + Input.dealerProvince + ', ' + Input.dealerPostal,
        dealerAddress: Input.dealerAddress,
      },
      where: {
        userEmail: Input.userEmail
      },
    });
    const userUpdate = await prisma.user.update({
      data: {
        name: Input.name,
        username: Input.username,
        email: Input.email,
        phone: Input.phone,
      },
      where: { email: Input.email },
    })

    return ({ saveDealer, userUpdate })

  }
  if (intent === 'updateUser') {
    delete Input.intent;


    const saveDealer = await prisma.dealer.update({
      data: {
        userOMVIC: Input.userOMVIC,
        dealer: Input.dealer,
        omvicNumber: Input.omvicNumber,
        dealerPhone: Input.dealerPhone,
        dealerProv: Input.dealerProv,
        dealerAddress: Input.dealerAddress,
        userLoanProt: Input.userLoanProt,
        userTireandRim: Input.userTireandRim,
        userGap: Input.userGap,
        userServicespkg: Input.userServicespkg,
        lifeDisability: Input.lifeDisability,
        rustProofing: Input.rustProofing,
        userTax: Input.userTax,
        userMarketAdj: Input.userMarketAdj,
        userFinance: Input.userFinance,
        userDemo: Input.userDemo,
        userGasOnDel: Input.userGasOnDel,
        userOther: Input.userOther,
        userAirTax: Input.userAirTax,
        userTireTax: Input.userTireTax,
        userGovern: Input.userGovern,
        userPDI: Input.userPDI,
        userExtWarr: Input.userExtWarr,
        userLicensing: Input.userLicensing,
        userAdmin: Input.userAdmin,
        userFreight: Input.userFreight,
        userCommodity: Input.userCommodity,
        vinE: Input.vinE,
        userLabour: Input.userLabour,
        destinationCharge: Input.destinationCharge,

      },
      where: {
        userEmail: Input.userEmail
      },
    });
    return ({ saveDealer })
  }
  if (intent === 'dailyPDF') {
    const userId = formPayload.userId
    const delete2 = await deleteDailyPDF(userId)
    delete Input.intent;
    const savedaily = await saveDailyWorkPlan(Input)
    console.log(savedaily)
    return ({ savedaily, delete2 })

  }
  if (intent === 'appearance') {
    const updateAppearance = await prisma.user.update({
      where: {
        email: Input.userEmail
      },
      data: {
        newLook: Input.newLook
      }
    })
    return updateAppearance
  }
  if (intent === 'activixActivated') {
    const accessToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiYzFkZTg5NzMwZmIyYTZlNmU1NWNhNzA4OTc2YTdjNzNiNWFmZDQwYzdmNDQ3YzE4ZjM5ZGE4MjMwYWFhZmE3ZmEyMTBmNGYyMzdkMDE0ZGQiLCJpYXQiOjE3MDI1NzI0NDIuNTcwMTAyLCJuYmYiOjE3MDI1NzI0NDIuNTcwMTA0LCJleHAiOjQ4NTgyNDYwNDIuNTI2NDI4LCJzdWIiOiIxNDMwNDEiLCJzY29wZXMiOlsidmlldy1sZWFkcyIsIm1hbmFnZS1sZWFkcyIsInRyaWdnZXItZmxvdyIsIm5vdGVzOmNyZWF0ZSIsIm5vdGVzOnVwZGF0ZSIsIm5vdGVzOnZpZXciXX0.ZrXbofK55iSlkvYH0AVGNtc5SH5KEXqu8KdopubrLsDx8A9PW2Z55B5pQCt8jzjE3J9qTcyfnLjDIR3pU4SozCFCmNOMZVWkpLgUJPLsCjQoUpN-i_7V5uqcojWIdOya7_WteJeoTOxeixLgP_Fg7xJoC96uHP11PCQKifACVL6VH2_7XJN_lHu3R3wIaYJrXN7CTOGMQplu5cNNf6Kmo6346pV3tKZKaCG_zXWgsqKuzfKG6Ek6VJBLpNuXMFLcD1wKMKKxMy_FiIC5t8SK_W7-LJTyo8fFiRxyulQuHRhnW2JpE8vOGw_QzmMzPxFWlAPxnT4Ma6_DJL4t7VVPMJ9ZoTPp1LF3XHhOExT2dMUt4xEQYwR1XOlnd0icRRlgn2el88pZwXna8hju_0R-NhG1caNE7kgRGSxiwdSEc3kQPNKDiJeoSbvYoxZUuAQRNgEkjIN-CeQp5LAvOgI8tTXU9lOsRFPk-1YaIYydo0R_K9ru9lKozSy8tSqNqpEfgKf8S4bqAV0BbKmCJBVJD7JNgplVAxfuF24tiymq7i9hjr08R8p2HzeXS6V93oW4TJJiFB5kMFQ2JQsxT-yeFMKYFJQLNtxsCtVyk0x43AnFD_7XrrywEoPXrd-3SBP2z65DP9Js16-KCsod3jJZerlwb-uKeeURhbaB9m1-hGk"
    // const activix = await prisma.user.update({      where: { email: Input.userEmail },      data: {        activixActivated: Input.activixActivated,        activixEmail: Input.activixEmail,     }    })
    const integration = await prisma.userIntergration.findUnique({ where: { userEmail: Input.userEmail, } });
    let actiData;
    try {
      const response = await axios.get(`https://api.crm.activix.ca/v2/account?include[]=users`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        }
      });
      console.log(response, response.data, 'response in settings')
      const users = response.data.users;
      const userEmail = Input.userEmail;
      const userObject = (users && users.find(user => user.email === userEmail)) || [];

      if (userObject) {
        console.log('Matching object found:', userObject);
      } else {
        console.log('No matching object found');
      }

      switch (!integration) {
        case true:
          actiData = await prisma.userIntergration.create({
            data: {
              userEmail: Input.userEmail,
              activixId: userObject.id.toString(),
              activixActivated: Input.activixActivated,
              activixEmail: Input.activixEmail,
              dealerAccountId: Input.dealerAccountId?.toString(),
            }
          });
          break;
        default:
          actiData = await prisma.userIntergration.update({
            where: { userEmail: Input.userEmail },
            data: {
              userEmail: Input.userEmail,
              activixId: userObject.id.toString(),
              activixActivated: Input.activixActivated,
              activixEmail: Input.activixEmail,
              dealerAccountId: Input.dealerAccountId?.toString(),

            }
          });
          return actiData;
      }
      return actiData;
    } catch (error) {
      console.error('Error occurred while fetching account data:', error);
      // Handle error here
    }
  }
  if (intent === 'automations') {
    const automations = await prisma.automations.update({
      where: { userEmail: Input.userEmail },
      data: {
        pickUp24before: Input.pickUp24before,
        appt24before: Input.appt24before,
      }
    })
    return automations
  }
  switch (intent) {
    case INTENTS.createProduct: {
      let name = formPayload.name
      if (!name) throw badRequest("Bad request");
      let board = await createProduct(name);
      return board
    }
    case INTENTS.deleteProduct: {
      let productId = formPayload.productId
      if (!productId) throw badRequest("Missing productId");
      await deleteProduct(Number(productId));
      return { ok: true };
    }
    case INTENTS.createProvidor: {
      let productId = formPayload.productId
      let name = formPayload.name
      if (!name) throw badRequest("Bad request");
      if (!productId) throw badRequest("Missing productId");
      await createProvidor(productId, name);
      return { ok: true };
    }
    case INTENTS.updateProvidor: {
      let id = formPayload.id
      let name = formPayload.name
      if (!name) throw badRequest("Bad request - name");
      if (!id) throw badRequest("Missing id");
      await updateProvidorName(id, name);
      return { ok: true };
    }
    case INTENTS.deletePrice: {
      let id = formPayload.id
      await deletePrice(id);
      return { ok: true };
    }
    case INTENTS.updateProductName: {
      let name = formPayload.name || ''
      let productId = formPayload.productId || ''
      invariant(name, "Missing name");
      await updateProductName(productId, name);
      return { ok: true };
    }
    case INTENTS.createPrice: {
      let productId = formPayload.productId || ''
      let packagePrice = formPayload.packagePrice || ''
      let packageName = formPayload.packageName || ''
      let providorId = formPayload.providorId || ''
      await prisma.financePrice.create({
        data: {
          packageName: packageName,
          packagePrice: Number(packagePrice),
          financeProductId: productId,
          FinanceProvidorId: providorId

        }
      })
      return { ok: true };
    }
    case 'updatePackageName': {
      let packageName = Input.packageName || ''
      let priceId = formPayload.priceId || ''
      if (!packageName) throw badRequest("Missing packageName");
      if (!priceId) throw badRequest("Missing priceId");
      await prisma.financePrice.update({
        where: { id: priceId },
        data: { packageName }
      })
      return { ok: true };
    }
    case 'updatePackagePrice': {
      let packagePrice = formPayload.packagePrice || 0
      let priceId = formPayload.priceId || ''
      if (!packagePrice) throw badRequest("Missing packagePrice");
      if (!priceId) throw badRequest("Missing priceId");

      await prisma.financePrice.update({
        where: { id: priceId },
        data: { packagePrice: Number(packagePrice) }
      })
      return { ok: true };
    }

    default: {
      throw badRequest(`Unknown intent: ${intent}`);
    }
  }
}
export const meta: MetaFunction = () => {
  return [
    { title: 'User Settings - Dealer Sales Assistant' },
    { property: "og:title", content: "Your very own assistant!", },
    {
      name: "description",
      content: "To help sales people achieve more. Every automotive dealer needs help, especialy the sales staff. Dealer Sales Assistant will help you close more deals more efficiently.",
      keywords: 'Automotive Sales, dealership sales, automotive CRM',
    },
  ];
};

export default function Mainbody() {
  const { user, deFees, dataPDF, statsData, comsRecords, getNewLook, automations } = useLoaderData()
  const userIsAllowed = getUserIsAllowed(user, ["ADMIN"]);
  console.log(userIsAllowed, user, user.role); // Expected output: true
  return (
    <>
      <div className="flex h-[100%] w-[98vw] left-0">

        <div className='w-[98%]'>
          <ProfileForm user={user} deFees={deFees} dataPDF={dataPDF} statsData={statsData} comsRecords={comsRecords} getNewLook={getNewLook} automations={automations} />
        </div>
      </div>
    </>
  )
}
/**
function Products() {
  let { financeProducts } = useLoaderData<typeof loader>();
  const [financeProductsList, setFinanceProductsList] = useState(financeProducts);
  let navigation = useNavigation();
  let isCreating = navigation.formData?.get("intent") === "createProduct";
  let fetcher = useFetcher();
  const isSubmitting = navigation.state === "submitting";

  const addFinanceProduct = () => {
    setFinanceProductsList([
      ...financeProducts,
      { id: Date.now(), name: "", financeProvidors: [] },
    ]);
  };

  const updateFinanceProduct = (index, newProduct) => {
    const updatedProducts = [...financeProducts];
    updatedProducts[index] = newProduct;
    setFinanceProductsList(updatedProducts);
  };





  return (
    <div className="p-4">
      <fetcher.Form method="post" className=" max-w-md flex items-center">
        <input type="hidden" name="intent" value="createProduct" />
        <div className="grid gap-3 mx-3 mb-3">
          <div className="relative mt-3">
            <Input
              name='name'
              type="text"
              className="w-full bg-background border-border "
            />
            <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">New Finance Product</label>
          </div>
        </div>
        <ButtonLoading
          size="sm"
          className="w-auto cursor-pointer bg-primary"
          type="submit"
          isSubmitting={isSubmitting}
          onClick={() => toast.success(`Update complete.`)}
          loadingText="Creating..."
        >
          Create
        </ButtonLoading>
      </fetcher.Form>
      <div className='flex items-center'>
        <h3 className="text-xl font-thin uppercase text-foreground mr-3">
          Products
        </h3>
        <Button onClick={() => processTodoRoadmap(todoRoadmap)} variant='outline' >
          Merge
        </Button>
      </div>
      {financeProductsList.map((product, index) => {
        const [providors, setProvidors] = useState([]);

        return (
          <FinanceProduct
            key={product.id}
            product={product}
            onUpdate={(newProduct) => updateFinanceProduct(index, newProduct)}
          />
        )
      })}

    </div>
  );
}

function FinanceProduct({ product, onUpdate }) {
  const [productSec, setProductSec] = useState();
  const [providorsList, setProvidorsList] = useState(product.financeProvidor);
  let [editing, setEditing] = useState(false);
  let inputRef = useRef<HTMLInputElement>(null);
  let submit = useSubmit();

  const addProvidor = () => {
    setProvidorsList([
      ...providors,
      { id: Date.now(), name: "", financePrices: [] },
    ]);
  };

  const updateProvidor = (index, newProvidor) => {
    const updatedProvidors = [...providors];
    updatedProvidors[index] = newProvidor;
    setProvidorsList(updatedProvidors);
    onUpdate({ ...product, financeProvidors: updatedProvidors });
  };

  return (
    <div className="grid grid-cols-1overflow-x-auto">
      <div className='flex items-center'>
        <h1 className='group items-center'>
          <EditableText
            value={product.name}
            fieldName="name"
            inputClassName="border border-border rounded-lg  text-foreground bg-background"
            buttonClassName="w-auto  mx-3 my-4 block rounded-lg text-center  border border-transparent  px-2 py-1 text-foreground"
            buttonLabel={`Edit product "${product.name}" name`}
            inputLabel="Edit product name"
          >
            <input type="hidden" name="intent" value={INTENTS.updateProductName} />
            <input type="hidden" name="productId" value={product.id} />
          </EditableText>
          <Button
            size="icon"
            variant="outline"
            onClick={() => deleteProduct(product.id)}
            className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100 ml-2"
          >
            <TrashIcon className="h-3 w-3" />
            <span className="sr-only">Delete</span>
          </Button>
        </h1>
        {editing ? (
          <Form
            method="post"
            // navigate={false}
            className="p-2 flex-shrink-0 flex flex-col gap-3 overflow-hidden max-h-full w-[250px] border rounded-[6px] shadow bg-background"
            onSubmit={(event) => {
              event.preventDefault();
              let formData = new FormData(event.currentTarget);
              formData.set("id", crypto.randomUUID());
              submit(formData, {
                //  navigate: false,
                method: "post",
                unstable_flushSync: true,
              });
              onAdd();
              invariant(inputRef.current, "missing input ref");
              inputRef.current.value = "";
            }}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) {
                setEditing(false);
              }
            }}
          >
            <input type="hidden" name="intent" value={INTENTS.createProvidor} />
            <input type="hidden" name="productId" value={product.id} />
            <input
              autoFocus
              required
              ref={inputRef}
              type="text"
              name="name"
              className="border border-border bg-background w-full rounded-lg py-1 px-2 text-foreground"
            />
            <div className="flex justify-between">
              <SaveButton>Save Providor</SaveButton>
              <CancelButton onClick={() => setEditing(false)}>Cancel</CancelButton>
            </div>
          </Form>
        ) : (
          <div className='ml-3'>
            <Button
              onClick={() => {
                flushSync(() => {
                  setEditing(true);
                });
                onAdd();
              }}
              size='sm'
              variant='outline'
              aria-label="Add new column"
              className="flex-shrink-0 flex justify-center ml-3 py-3  bg-primary hover:bg-white bg-opacity-10 hover:bg-opacity-5 rounded-[6px]"
            >
              <Plus color="#fcfcfc" /> Add Providor
            </Button>
          </div>

        )}
      </div>
      <div className='flex'>
        {providorsList.map((providor, index) => (
          <FinanceProvidor
            key={providor.id}
            providor={providor}
            product={product}
            onUpdate={(newProvidor) => updateProvidor(index, newProvidor)}
          />
        ))}
      </div>
    </div>
  );
}

function FinanceProvidor({ providor, onUpdate, product }) {
  const [prices, setPrices] = useState(product.financePrice);

  const addPrice = () => {
    setPrices([...prices, { id: Date.now(), packageName: "", packagePrice: 0 }]);
  };

  const updatePrice = (index, newPrice) => {
    const updatedPrices = [...prices];
    updatedPrices[index] = newPrice;
    setPrices(updatedPrices);
    onUpdate({ ...providor, financePrices: updatedPrices });
  };

  let listRef = useRef<HTMLUListElement>(null);
  let [edit, setEdit] = useState(false);
  function scrollList() {
    invariant(listRef.current);
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }
  return (
    <div className="mb-4 p-4 border rounded-lg mx-2">
      <div className="p-2 group items-center">
        <EditableText
          fieldName="name"
          value={providor.name}
          inputLabel="Edit providor name"
          buttonLabel={`Edit providor "${providor.name}" name`}
          inputClassName="border border-slate-400 wrounded-lg  text-foreground"
          buttonClassName="mx-3 my-4  w-auto  block text-center border-b  border-border py-3 px-2 text-slate-800 "
        >
          <input type="hidden" name="intent" value={INTENTS.updateProvidor} />
          <input type="hidden" name="id" value={providor.id} />
        </EditableText>
        <Button
          size="icon"
          variant="outline"
          onClick={() => deleteProvidor(product.id)}
          className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100 ml-2"
        >
          <TrashIcon className="h-3 w-3" />
          <span className="sr-only">Delete</span>
        </Button>
      </div>

      {prices.map((price, index) => (
        <FinancePrice
          key={index}
          price={price}
          providor={providor}
          product={product}
          onUpdate={(newPrice) => updatePrice(index, newPrice)}
        />
      ))}
      {edit ? (
        <NewPrice
          providorId={providor.id}
          productId={product.id}
          nextOrder={prices.length === 0 ? 1 : prices[prices.length - 1].order + 1}
          onAddPrice={() => scrollList()}
          onComplete={() => setEdit(false)}
        />
      ) : (
        <div className="p-2 pt-1">
          <Button
            variant='outline'
            type="button"
            onClick={() => {
              flushSync(() => {
                setEdit(true);
              });
              scrollList();
            }}
            className="flex items-center gap-2 rounded-lg text-center p-2 text-foreground bg-primary hover:bg-slate-200 focus:bg-slate-200"
          >
            <Plus color="#fcfcfc" /> Add Price
          </Button>
        </div>
      )}
    </div>
  );
}

function FinancePrice({ price, onUpdate, product, providor }) {
  if (price.FinanceProvidorId !== providor.id) {
    return null; // Skip rendering if provider ID doesn't match
  }
  let textAreaRef = useRef<HTMLTextAreaElement>(null);
  let buttonRef = useRef<HTMLButtonElement>(null);
  let submit = useSubmit();
  let fetcher = useFetcher();
  let deleteFetcher = useFetcher();
  console.log(price, 'prioce', providor, 'providor')
  return (
    <div className="mb-2 p-2 ">
      <HoverCard>
        <HoverCardTrigger asChild>
          <div
            draggable
            className="text-left bg-background text-foreground shadow shadow-muted-background border border-border text-sm rounded-[6px] w-full py-1 px-2 relative"
          >
            <div>
              <EditableText
                fieldName="packageName"
                value={price.packageName}
                inputLabel="Edit package name"
                buttonLabel={`Edit Package Name "${price.packageName}" name`}
                inputClassName="border border-slate-400 wrounded-lg  text-foreground"
                buttonClassName="mx-3 my-4 w-auto  block text-center py-3 px-2 text-slate-800 "
              >
                <input type="hidden" name="intent" value='updatePackageName' />
                <input type="hidden" name="priceId" value={price.id} />
              </EditableText>
              <EditableText
                fieldName="packagePrice"
                value={price.packagePrice}
                inputLabel="Edit package price"
                buttonLabel={`Edit package price "${price.packagePrice}" name`}
                inputClassName="border border-slate-400 wrounded-lg  text-foreground"
                buttonClassName="mx-3 my-4 w-auto   block text-center  py-1 px-2 text-slate-800 "
              >
                <input type="hidden" name="intent" value='updatePackagePrice' />
                <input type="hidden" name="priceId" value={price.id} />
              </EditableText>
            </div>

          </div>
        </HoverCardTrigger>
        <HoverCardContent className="w-[100px] h-[100px] bg-background border border-border">
          <deleteFetcher.Form method="post">
            <input type="hidden" name="intent" value={INTENTS.deletePrice} />
            <input type="hidden" name="priceId" value={price.id} />
            <Button
              size='icon'
              variant='ghost'
              aria-label="Delete card"
              className="absolute mx-auto my-auto bg-background hover:text-brand-red"
              type="submit"
              onClick={(event) => {
                event.stopPropagation();
              }}
            >
              <Trash color="#fcfcfc" />
            </Button>
          </deleteFetcher.Form>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}


function NewPrice({ productId, providorId, onAddPrice, onComplete, nextOrder }) {
  let textAreaRef = useRef<HTMLTextAreaElement>(null);
  let buttonRef = useRef<HTMLButtonElement>(null);
  let submit = useSubmit();
  let fetcher = useFetcher();

  return (
    <fetcher.Form
      method="post"
      className="p-2 flex-shrink-0 flex flex-col gap-3 overflow-hidden max-h-full w-[250px] border rounded-[6px] shadow bg-background"
      onSubmit={(event) => {
        event.preventDefault();

        let formData = new FormData(event.currentTarget);
        let id = crypto.randomUUID();
        formData.set(ItemMutationFields.id.name, id);

        submit(formData, {
          method: "post",
          fetcherKey: `price:${id}`,
          navigate: false,
          unstable_flushSync: true,
        });

        invariant(textAreaRef.current);
        textAreaRef.current.value = "";
        onAddPrice();
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          onComplete();
        }
      }}
    >
      <input type="hidden" name="intent" value={INTENTS.createPrice} />
      <input type="hidden" name='providorId' value={providorId} />
      <input type="hidden" name='productId' value={productId} />
      <input type="hidden" name={ItemMutationFields.order.name} value={nextOrder} />
      <Input
        autoFocus
        required
        ref={textAreaRef}
        name='packageName'
        placeholder="Enter a package name"
        className="border border-border bg-background w-full rounded-lg py-1 px-2 text-foreground"
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            invariant(buttonRef.current, "expected button ref");
            buttonRef.current.click();
          }
          if (event.key === "Escape") {
            onComplete();
          }
        }}
        onChange={(event) => {
          let el = event.currentTarget;
          el.style.height = el.scrollHeight + "px";
        }}
      />
      <Input
        autoFocus
        required
        ref={textAreaRef}
        name='packagePrice'
        placeholder="Enter a package name"
        className="border border-border bg-background w-full rounded-lg py-1 px-2 text-foreground"
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            invariant(buttonRef.current, "expected button ref");
            buttonRef.current.click();
          }
          if (event.key === "Escape") {
            onComplete();
          }
        }}
        onChange={(event) => {
          let el = event.currentTarget;
          el.style.height = el.scrollHeight + "px";
        }}
      />

      <div className="flex justify-between">
        <SaveButton ref={buttonRef}>Save Price</SaveButton>
        <CancelButton onClick={onComplete}>Cancel</CancelButton>
      </div>
    </fetcher.Form>
  )
}

/**function NewPrice({ providorId, onAddPrice, onComplete, nextOrder }) {
  let textAreaRef = useRef<HTMLTextAreaElement>(null);
  let buttonRef = useRef<HTMLButtonElement>(null);
  let submit = useSubmit();
  let fetcher = useFetcher();

  return (
    <Form
      method="post"
      className="flex flex-col gap-2.5 p-2 pt-1"
      onSubmit={(event) => {
        event.preventDefault();

        let formData = new FormData(event.currentTarget);
        let id = crypto.randomUUID();
        formData.set(ItemMutationFields.id.name, id);

        submit(formData, {
          method: "post",
          fetcherKey: `price:${id}`,
          navigate: false,
          unstable_flushSync: true,
        });

        invariant(textAreaRef.current);
        textAreaRef.current.value = "";
        onAddPrice();
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          onComplete();
        }
      }}
    >
      <input type="hidden" name="intent" value={INTENTS.createItem} />
      <input
        type="hidden"
        name={ItemMutationFields.providorId.name}
        value={providorId}
      />
      <input
        type="hidden"
        name={ItemMutationFields.order.name}
        value={nextOrder}
      />
      <input
        autoFocus
        required
        ref={textAreaRef}
        name={ItemMutationFields.packageName.name}
        placeholder="Enter a title for this card"
        className="outline-none shadow shadow-slate-300 border-slate-300 text-sm rounded-lg w-full py-1 px-2 resize-none placeholder:text-sm placeholder:text-slate-500 h-14"
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            invariant(buttonRef.current, "expected button ref");
            buttonRef.current.click();
          }
          if (event.key === "Escape") {
            onComplete();
          }
        }}
        onChange={(event) => {
          let el = event.currentTarget;
          el.style.height = el.scrollHeight + "px";
        }}
      />
      <input
        autoFocus
        required
        ref={textAreaRef}
        name={ItemMutationFields.packagePrice.name}
        placeholder="Enter a title for this card"
        className="outline-none shadow shadow-slate-300 border-slate-300 text-sm rounded-lg w-full py-1 px-2 resize-none placeholder:text-sm placeholder:text-slate-500 h-14"
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            invariant(buttonRef.current, "expected button ref");
            buttonRef.current.click();
          }
          if (event.key === "Escape") {
            onComplete();
          }
        }}
        onChange={(event) => {
          let el = event.currentTarget;
          el.style.height = el.scrollHeight + "px";
        }}
      />
      <div className="flex justify-between">
        <SaveButton ref={buttonRef}>Save Card</SaveButton>
        <CancelButton onClick={onComplete}>Cancel</CancelButton>
      </div>
    </Form>
  )
} */

/**function NewProvidor({ productId, onAdd, editInitially }) {
  let [editing, setEditing] = useState(editInitially);
  let inputRef = useRef<HTMLInputElement>(null);
  let submit = useSubmit();

  return (
    <div className='grid grid-cols-1'>
      {editing ? (
        <Form
          method="post"
          navigate={false}
          className="p-2 flex-shrink-0 flex flex-col gap-3 overflow-hidden max-h-full w-[250px] border rounded-[6px] shadow bg-background"
          onSubmit={(event) => {
            event.preventDefault();
            let formData = new FormData(event.currentTarget);
            formData.set("id", crypto.randomUUID());
            submit(formData, {
              navigate: false,
              method: "post",
              unstable_flushSync: true,
            });
            onAdd();
            invariant(inputRef.current, "missing input ref");
            inputRef.current.value = "";
          }}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
              setEditing(false);
            }
          }}
        >
          <input type="hidden" name="intent" value={INTENTS.createProvidor} />
          <input type="hidden" name="productId" value={productId} />
          <input
            autoFocus
            required
            ref={inputRef}
            type="text"
            name="name"
            className="border border-border bg-background w-full rounded-lg py-1 px-2 text-foreground"
          />
          <div className="flex justify-between">
            <SaveButton>Save Providor</SaveButton>
            <CancelButton onClick={() => setEditing(false)}>Cancel</CancelButton>
          </div>
        </Form>
      ) : (
        <Button
          onClick={() => {
            flushSync(() => {
              setEditing(true);
            });
            onAdd();
          }}
          size='icon'
          variant='outline'
          aria-label="Add new column"
          className="flex-shrink-0 flex justify-center  bg-primary hover:bg-white bg-opacity-10 hover:bg-opacity-5 rounded-[6px]"
        >
          <Plus color="#fcfcfc" />
        </Button>
      )}
    </div>
  )
}
 */

export const links: LinksFunction = () => [
  { rel: "icon", type: "image/svg", href: "/favicons/settings.svg", },
]
