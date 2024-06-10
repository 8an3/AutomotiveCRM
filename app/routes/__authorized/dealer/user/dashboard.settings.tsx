import { Form, useActionData, useFetcher, useLoaderData, useNavigation } from '@remix-run/react'
import { Separator, Button, Input, Label, Switch, Checkbox } from '~/components/ui/index'
import { json, redirect, type ActionFunction, type DataFunctionArgstype, type MetaFunction, type LoaderFunction, } from '@remix-run/node'
import DailySheet from '~/components/formToPrint/dailyWorkPlan'
import { getUserById, updateUser, updateDealerFees, getDealerFeesbyEmail, getDealerFeesbyEmailAdmin } from '~/utils/user.server'
import financeFormSchema from '~/overviewUtils/financeFormSchema';
import { toast } from "sonner"
import React, { useState, useEffect } from 'react';
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
// dontergeasdf
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
          where: { userEmail: { equals: email, }, },
        });
      } catch (error) {
        if (!automations) {
          automations = await prisma.automations.create({
            data: {
              userEmail: user.email,
              pickUp24before: 'no',
              appt24before: 'no',
            }
          })
        }
      }

      const comsRecords = await prisma.previousComms.findMany({ where: { userEmail: email }, });
      const session2 = await getAppearance(request.headers.get("Cookie"));
      const getNewLook = user.newLook
      console.log(getNewLook, 'checking appearance')
      return ({ user, deFees, dataPDF, statsData, comsRecords, getNewLook, automations })
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
    <Table className='bg-background text-foreground'>
      <TableCaption>List of Stats</TableCaption>
      <TableHeader>
        <TableRow className="bg-accent border-border">
          <TableHead >Period</TableHead>
          <TableHead >Quotes</TableHead>
          <TableHead >Deposits</TableHead>
          <TableHead >Financed</TableHead>
          <TableHead >Delivered</TableHead>
          <TableHead >Repeat Cust</TableHead>
          <TableHead >Walk-in</TableHead>
          <TableHead >Web-lead</TableHead>
          <TableHead >Phone-lead</TableHead>
          <TableHead >Total</TableHead>
          <TableHead >emailsSent</TableHead>
          <TableHead >smsSent</TableHead>
          <TableHead >phoneCallsMade</TableHead>
          <TableHead >timesContacted</TableHead>
          <TableHead >Appts</TableHead>
          <TableHead >Appts Showed</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {stats.map((stat) => (
          <TableRow key={stat.period} className="bg-accent border-border">
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

  React.useEffect(() => {
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

  const handleCheckboxChange = (event) => {
    setActivixActivated(event.target.checked);
  };

  const [newLook, setNewLook] = useState(getNewLook);

  const initial = {
    pickUp24before: automations.pickUp24before,
    appt24before: automations.appt24before,

  }
  const [formData, setFormData] = useState(initial);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  return (
    <Tabs defaultValue="dealerFees" className="w-[75%] ml-5 mr-auto" >
      <TabsList className="grid grid-cols-4 rounded-md ">
        <TabsTrigger className='rounded-md' value="dealerFees">Dealer Fees</TabsTrigger>
        <TabsTrigger className='rounded-md' value="account">Account</TabsTrigger>
        <TabsTrigger className='rounded-md' value="stats">Statistics</TabsTrigger>
        <TabsTrigger className='rounded-md' value="Automations">Automations</TabsTrigger>
      </TabsList>
      <TabsContent value="stats" className='rounded-md'>
        <Card className='rounded-md text-foreground border-border border'>
          <CardHeader className=''>
            <CardTitle className='text-foreground'>
              <h3 className="text-2xl font-thin uppercase text-foreground">
                Statistics
              </h3>
            </CardTitle>
            <CardDescription>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2  text-foreground">
            <StatsTable statsData={statsData} comsRecords={comsRecords} />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="dealerFees" className='rounded-md'>
        <Card className='text-foreground bg-background'>
          <Form method="post" className="">
            <CardHeader className=" grid grid-cols-1 bg-muted-background rounded-md">
              <CardTitle className="group flex items-center text-sm">
                DEALER FEES
              </CardTitle>
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
            <CardFooter className="grid grid-cols-2 justify-between items-center border-t border-border bg-muted-background px-6 py-3">
              {user.plan === 'prod_OY8EMf7RNoJXhX' ? (
                null
              ) : (
                <ButtonLoading
                  size="sm"
                  className="w-auto cursor-pointer mb-5 mt-5 mr-auto bg-[#dc2626]"
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

      </TabsContent>
      <TabsContent value="account" className='rounded-md  grid grid-cols-2'>
        <Card className='text-foreground bg-background mr-2 mb-4'>
          <Form method="post" className="">
            <CardHeader className="   bg-muted-background rounded-md">
              <CardTitle className="group flex items-center text-sm">
                EDIT ACCOUNT
              </CardTitle>
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
              <hr className="my-4 text-muted-foreground w-[95%] mx-auto" />
              <div className="font-semibold"> Dealer Information - This will only be for contracts.</div>
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
            <CardFooter className="grid grid-cols-2 justify-between items-center border-t border-border bg-muted-background px-6 py-3">
              <ButtonLoading
                size="sm"
                className="w-auto cursor-pointer mb-5 mt-5 mr-auto bg-[#dc2626]"
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
        <div className='grid grid-cols-1'>
          <Card className='text-foreground bg-background ml-2 mb-4'>
            <Form method="post" className="">
              <CardHeader className=" grid grid-cols-1 bg-muted-background rounded-md">
                <CardTitle className="group flex items-center text-sm">
                  Integration Settings
                </CardTitle>
                <CardDescription>
                  Will unlock featues and functions that will only benefit users who currently use other CRMs. Essentially replacing your current crm dashboard and processes, think of it as a new "skin" for your dashboard to deal with your day to day activities and customers. If you do not see your CRM here let us know and we will integrate with them.
                </CardDescription>
              </CardHeader>
              <CardContent className=' '>
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
                    <div className="font-semibold ml-[50px]">Activx</div>
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
              </CardContent>
              <CardFooter className="grid grid-cols-2 justify-between items-center border-t border-border bg-muted-background px-6 py-3">
                <ButtonLoading
                  size="sm"
                  className="w-auto cursor-pointer mb-5 mt-5 mr-auto bg-[#dc2626]"
                  type="submit"
                  name='intent'
                  value='activixActivated'
                  isSubmitting={isSubmitting}
                  onClick={() => toast.success(`Update complete.`)}
                  loadingText="Updating information..."
                >
                  Update
                </ButtonLoading>
              </CardFooter>
            </Form>
          </Card>
          <Card className='text-foreground bg-background ml-2 mb-4 mt-4'>
            <Form method="post" className="">
              <CardHeader className=" grid grid-cols-1 bg-muted-background rounded-md">
                <CardTitle className="group flex items-center text-sm">
                  New Quote and Overview Appearance {newLook}
                </CardTitle>
                <CardDescription>
                  Changes the look of the quote and overview pages.
                </CardDescription>
              </CardHeader>
              <CardContent className=' '>
                <Input type='hidden' name="userEmail" defaultValue={user.email} />

                <ul className="grid gap-3 text-sm mt-3">
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Change looks?
                    </span>
                    <span>
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
                    </span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="grid grid-cols-2 justify-between items-center border-t border-border bg-muted-background px-6 py-3">
                <ButtonLoading
                  size="sm"
                  className="w-auto cursor-pointer mb-5 mt-5 mr-auto bg-[#dc2626]"
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
              </CardFooter>
            </Form>
          </Card>
        </div>
      </TabsContent>
      <TabsContent value="Automations" className='rounded-md  grid grid-cols-2'>
        <Card className='rounded-md text-foreground border-border border bg-muted-background'>
          <CardHeader className=''>
            <CardTitle className='text-foreground'>
              <h3 className="text-2xl font-thin uppercase text-foreground">
                Automations
              </h3>
            </CardTitle>
            <CardDescription>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2  text-foreground">
            <Form method='post' >
              <ul className="grid gap-3 text-sm mt-2">
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    Appointment reminder / 24 hours
                  </span>
                  <span>
                    <div className="inline-flex items-center">
                      <label className="relative flex items-center  rounded-full cursor-pointer" htmlFor="blue">
                        <input type="checkbox"
                          id="blue"
                          name="appt24before"
                          checked={formData.appt24before !== 'no'}
                          onChange={(e) => {
                            const { name, checked } = e.target;
                            const newValue = checked
                              ? 'yes'
                              : 'no'; // Use the correct variable name here
                            setFormData((prevFormData) => ({
                              ...prevFormData,
                              [name]: newValue,
                            }));
                          }}
                          className=' border-[#c72323] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-blue-500 checked:bg-blue-500 checked:before:bg-blue-500 hover:before:opacity-10'
                        />
                        <span
                          className="absolute text-foreground transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"
                            stroke="currentColor" strokeWidth="1">
                            <path fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"></path>
                          </svg>
                        </span>
                      </label>
                    </div>
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    Pick-Up reminder / 24 hours
                  </span>
                  <span>
                    <div className="inline-flex items-center">
                      <label className="relative flex items-center  rounded-full cursor-pointer" htmlFor="blue">
                        <input type="checkbox"
                          id="blue"
                          name="pickUp24before"
                          checked={formData.pickUp24before !== 'no'}
                          onChange={(e) => {
                            const { name, checked } = e.target;
                            const newValue = checked
                              ? 'yes'
                              : 'no'; // Use the correct variable name here
                            setFormData((prevFormData) => ({
                              ...prevFormData,
                              [name]: newValue,
                            }));
                          }}
                          className='border-[#c72323]  peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-blue-500 checked:bg-blue-500 checked:before:bg-blue-500 hover:before:opacity-10'
                        />
                        <span
                          className="absolute text-foreground transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"
                            stroke="currentColor" strokeWidth="1">
                            <path fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"></path>
                          </svg>
                        </span>
                      </label>
                    </div>
                  </span>
                </li>
              </ul>
              <Input type='hidden' defaultValue={user.email} name="userEmail" />
              <ButtonLoading
                size="sm"
                className="w-auto cursor-pointer mb-5 mt-5 mr-auto bg-[#dc2626]"
                type="submit"
                name='intent'
                value='automations'
                isSubmitting={isSubmitting}
                onClick={() => toast.success(`Update complete.`)}
                loadingText="Updating information..."
              >
                Update
              </ButtonLoading>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>

    </Tabs>
  )
}

export const action: ActionFunction = async ({ request }) => {
  const formPayload = Object.fromEntries(await request.formData())
  const Input = financeFormSchema.parse(formPayload)
  const intent = formPayload.intent
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

