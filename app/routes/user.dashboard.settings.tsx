import { Form, useActionData, useFetcher, useLoaderData } from '@remix-run/react'
import { Separator, Button, Input, Label } from '~/components/ui/index'
import { json, redirect, type ActionFunction, type DataFunctionArgstype, type MetaFunction, type LoaderFunction, } from '@remix-run/node'
import DailySheet from '~/components/formToPrint/dailyWorkPlan'
import { getUserById, updateUser, updateDealerFees, getDealerFeesbyEmail, getDealerFeesbyEmailAdmin } from '~/utils/user.server'
import financeFormSchema from './overviewUtils/financeFormSchema';
import * as Toast from '@radix-ui/react-toast';
import React from 'react';
import { getMergedFinance } from '~/utils/dashloader/dashloader.server'
import { deleteDailyPDF } from '~/utils/dailyPDF/delete.server'
import { saveDailyWorkPlan } from '~/utils/dailyPDF/create.server'
import { getDailyPDF } from '~/utils/dailyPDF/get.server'
import { RemixNavLink, } from "~/components"
import { getUserIsAllowed } from "~/helpers";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "~/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger, } from "~/components/ui/tabs"
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow, } from "~/components/ui/table"
import { prisma } from "~/libs";
import { getSession, commitSession, destroySession } from '../sessions/auth-session.server'



import { requireAuthCookie } from '~/utils/misc.user.server';
import { model } from "~/models";




export async function loader({ request, params }: LoaderFunction) {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")

  const user = await model.user.query.getForSession({ email: email });
  /// console.log(user, account, 'wquiote loadert')
  if (!user) {
    redirect('/login')
  }
  if (!user) { return json({ status: 302, redirect: '/login' }); };


  const userEmail = user?.email
  const deFees = await getDealerFeesbyEmailAdmin()
  const userId = user?.id
  const dataPDF = await getDailyPDF(userEmail)
  const statsData = await getMergedFinance(userEmail)
  const comsRecords = await prisma.communicationsOverview.findMany({ where: { userId: userId, }, });
  if (user?.subscriptionId === 'active' || user?.subscriptionId === 'trialing') {
    // const client = await getLatestFinanceAndDashDataForClientfile(userId)
    //const finance = client.finance
    return ({ user, deFees, dataPDF, statsData, comsRecords })
  }
  return redirect('/subscription/renew');
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
    <Table>
      <TableCaption>List of Stats</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className='text-white'>Period</TableHead>
          <TableHead className='text-white'>Quotes</TableHead>
          <TableHead className='text-white'>Deposits</TableHead>
          <TableHead className='text-white'>Financed</TableHead>
          <TableHead className='text-white'>Delivered</TableHead>
          <TableHead className='text-white'>Repeat Cust</TableHead>
          <TableHead className='text-white'>Walk-in</TableHead>
          <TableHead className='text-white'>Web-lead</TableHead>
          <TableHead className='text-white'>Phone-lead</TableHead>
          <TableHead className='text-white'>Total</TableHead>
          <TableHead className='text-white'>emailsSent</TableHead>
          <TableHead className='text-white'>smsSent</TableHead>
          <TableHead className='text-white'>phoneCallsMade</TableHead>
          <TableHead className='text-white'>timesContacted</TableHead>
          <TableHead className='text-white'>Appts</TableHead>
          <TableHead className='text-white'>Appts Showed</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {stats.map((stat) => (
          <TableRow key={stat.period}>
            <TableCell className='text-white'>{stat.period}</TableCell>
            <TableCell className='text-white'>{stat.quotes}</TableCell>
            <TableCell className='text-white'>{stat.deposits}</TableCell>
            <TableCell className='text-white'>{stat.financed}</TableCell>
            <TableCell className='text-white'>{stat.delivered}</TableCell>
            <TableCell className='text-white'>{stat.repeatCustomer}</TableCell>
            <TableCell className='text-white'>{stat.walkIn}</TableCell>
            <TableCell className='text-white'>{stat.webLead}</TableCell>
            <TableCell className='text-white'>{stat.phoneLead}</TableCell>
            <TableCell className='text-white'>{stat.total}</TableCell>
            <TableCell className='text-white'>{stat.emailsSent}</TableCell>
            <TableCell className='text-white'>{stat.smsSent}</TableCell>
            <TableCell className='text-white'>{stat.phoneCallsMade}</TableCell>
            <TableCell className='text-white'>{stat.timesContacted}</TableCell>
            <TableCell className='text-white'>Appts</TableCell>
            <TableCell className='text-white'>Appts Showed</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}


function ProfileForm({ user, deFees, dataPDF, statsData, comsRecords }) {
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
    { name: "destinationCharge", value: deFees.destinationCharge, placeholder: "Destination Charge" },
    { name: "userGasOnDel", value: deFees.userGasOnDel, placeholder: "Gas On Delivery" },
    { name: "userMarketAdj", value: deFees.userMarketAdj, placeholder: "Market Adjustment" },
    { name: "userDemo", value: deFees.userDemo, placeholder: "Demonstratration Fee" },
    { name: "userOMVIC", value: deFees.userOMVIC, placeholder: "OMVIC or Other" },
  ];


  const FinanceOptions = [
    { name: "userExtWarr", value: deFees.userExtWarr, placeholder: 'Extended Warranty' },
    { name: "userLoanProt", value: deFees.userLoanProt, placeholder: 'Loan Protection' },
    { name: "userGap", value: deFees.userGap, placeholder: 'Gap Protection' },
    { name: "userTireandRim", deFees: deFees.userTireandRim, placeholder: 'Tire and Rim' },
    { name: "vinE", value: deFees.vinE, placeholder: 'Vin Etching' },
    { name: "rustProofing", value: deFees.rustProofing, placeholder: 'Under Coating' },
    { name: "userServicespkg", value: deFees.userServicespkg, placeholder: 'Service Package' },
    { name: "lifeDisability", value: deFees.lifeDisability, placeholder: 'Life and Disability' },
    { name: "userOther", value: deFees.userOther, placeholder: 'Other data Package' },
  ];
  //      <video loop autoPlay width='750' height='750' src='https://youtu.be/u1MLfrFzCBo' className='mx-auto z-49' frameBorder="0" allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
  const errors = useActionData() as Record<string, string | null>;

  return (
    <Tabs defaultValue="dealerFees" className="w-[95%] mx-auto " >

      <TabsList className="grid w-full grid-cols-4 rounded-md">
        <TabsTrigger className='rounded-md' value="dealerFees">Dealer Fees</TabsTrigger>
        <TabsTrigger className='rounded-md' value="account">Account</TabsTrigger>
        <TabsTrigger className='rounded-md' value="stats">Statistics</TabsTrigger>
        {user.email === 'skylerzanth@gmail.com' && (
          <TabsTrigger className='rounded-md' value="dailyPdf">Daily PDF</TabsTrigger>
        )}
      </TabsList>
      <TabsContent value="stats" className='rounded-md'>
        <Card className='rounded-md text-white'>
          <CardHeader className='bg-myColor-900'>
            <CardTitle className='text-white'>
              <h3 className="text-2xl font-thin uppercase text-slate4">
                Statistics
              </h3>
            </CardTitle>
            <CardDescription>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 bg-slate11 text-white">
            <StatsTable statsData={statsData} comsRecords={comsRecords} />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="dealerFees" className='rounded-md'>
        <Card>
          <CardContent className="space-y-2 bg-slate11 text-white rounded-md">
            <Form method="post" className="">

              <div className="grid grid-cols-1 gap-4 mx-auto">
                {/* Row 1 */}
                <div className=" p-4">
                  <div className=" mt-5">
                    <h2 className="text-2xl font-thin">
                      DEALER FEES
                    </h2>
                    <p className="text-sm text-white">
                      This is where you can change values like freight, admin, taxes and
                      such. If you don't have all this information with you, dont worry, you can always come back and update it later.
                    </p>
                    <Separator className="my-4" />

                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {Dealerfees.map((fee, index) => (
                      <div key={index}>
                        <label className=''>{fee.placeholder}</label>
                        <Input
                          name={fee.name}
                          defaultValue={fee.value}

                          className="bg-myColor-900 px-5 h-[45px] w-[95%] flex-1 flex items-center justify-center text-[15px] leading-none  first:rounded-tl-md last:rounded-tr-md target:text-[#02a9ff] hover:text-[#02a9ff] text-slate4 active:bg-[#02a9ff] font-bold uppercase  rounded shadow hover:shadow-md outline-none  ease-linear transition-all duration-150
                 focus:outline-none  focus:text-[#02a9ff]  mx-1"
                        />
                      </div>
                    ))}
                    <div className="">
                      <label>Licensing (Required)</label>
                      <Input
                        defaultValue={deFees.userLicensing}
                        name="userLicensing"
                        className="bg-myColor-900 px-5 h-[45px] w-[95%] flex-1 flex items-center justify-center text-[15px] leading-none  first:rounded-tl-md last:rounded-tr-md target:text-[#02a9ff] hover:text-[#02a9ff] text-slate4 active:bg-[#02a9ff] font-bold uppercase  rounded shadow hover:shadow-md outline-none  ease-linear transition-all duration-150
                 focus:outline-none  focus:text-[#02a9ff]  mx-1"
                      />
                      {errors?.userLicensing ? (
                        <em className="text-[#ff0202]">{errors.userLicensing}</em>
                      ) : null}
                    </div>

                    <div className="">
                      <label>Sales tax (Required)</label>
                      <Input
                        defaultValue={deFees.userTax}
                        name="userTax"
                        className="bg-myColor-900 px-5 h-[45px] w-[95%] flex-1 flex items-center justify-center text-[15px] leading-none  first:rounded-tl-md last:rounded-tr-md target:text-[#02a9ff] hover:text-[#02a9ff] text-slate4 active:bg-[#02a9ff] font-bold uppercase  rounded shadow hover:shadow-md outline-none  ease-linear transition-all duration-150
                 focus:outline-none  focus:text-[#02a9ff]  mx-1"
                      />
                      {errors?.userTax ? (
                        <em className="text-[#ff0202]">{errors.userTax}</em>
                      ) : null}
                    </div>
                    <div className="">
                      <label>Service Labour (Required)</label>
                      <Input
                        defaultValue={deFees.userLabour}
                        name="userLabour"
                        className="bg-myColor-900 px-5 h-[45px] w-[95%] flex-1 flex items-center justify-center text-[15px] leading-none  first:rounded-tl-md last:rounded-tr-md target:text-[#02a9ff] hover:text-[#02a9ff] text-slate4 active:bg-[#02a9ff] font-bold uppercase  rounded shadow hover:shadow-md outline-none  ease-linear transition-all duration-150
                 focus:outline-none  focus:text-[#ff0202]  mx-1"
                      />
                      {errors?.userLabour ? (
                        <em className="text-[#ff0202]">{errors.userLabour}</em>
                      ) : null}
                    </div>
                  </div>
                </div>

                {/* Row 2 */}
                <h2 className="text-2xl font-thin mt-4">
                  OPTIONS
                </h2>
                <Separator className="mb-4" />
                <div className="p-4 grid gap-2">
                  <div className="h-[250px] grid grid-cols-3 gap-2 ">
                    {FinanceOptions.map((option, index) => (
                      <div key={index}>
                        <label className='mt-2'>{option.placeholder}</label>
                        <Input
                          name={option.name}
                          defaultValue={option.value}
                          className="bg-myColor-900 px-5 h-[45px] w-[95%] flex-1 flex items-center justify-center text-[15px] leading-none  first:rounded-tl-md last:rounded-tr-md target:text-[#02a9ff] hover:text-[#02a9ff] text-slate4 active:bg-[#02a9ff] font-bold uppercase  rounded shadow hover:shadow-md outline-none  ease-linear transition-all duration-150
                 focus:outline-none  focus:text-[#02a9ff]  mx-1"
                        />
                      </div>
                    ))}
                    <Input type='hidden'
                      defaultValue={user.email}
                      name="email"
                    />
                    <Input type='hidden'
                      defaultValue='updateUser'
                      name="intent"
                    />
                    <Toast.Provider swipeDirection="right">
                      <Button className="bg-[#02a9ff] mb-10 w-[75px] ml-2  mr-2 cursor-pointer text-white active:bg-[#0176b2] font-bold uppercase   text-xs  rounded shadow hover:shadow-md outline-none focus:outline-none  ease-linear transition-all text-center duration-150" type="submit"
                        onClick={() => {
                          setOpen(false);
                          window.clearTimeout(timerRef.current);
                          timerRef.current = window.setTimeout(() => {
                            setOpen(true);
                          }, 100);
                        }}
                      >
                        Update
                      </Button>
                      <Toast.Root
                        className="bg-white rounded-md shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] p-[15px] grid [grid-template-areas:_'title_action'_'description_action'] grid-cols-[auto_max-content] gap-x-[15px] items-center data-[state=open]:animate-slideIn data-[state=closed]:animate-hide data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-[transform_200ms_ease-out] data-[swipe=end]:animate-swipeOut"
                        open={open}
                        onOpenChange={setOpen}
                      >
                        <Toast.Title className="[grid-area:_title] mb-[5px] font-medium text-white2 text-[15px]">
                          Dealer Fees Updated.
                        </Toast.Title>
                        <Toast.Description asChild>
                        </Toast.Description>
                      </Toast.Root>
                      <Toast.Viewport className="[--viewport-padding:_25px] fixed bottom-0 right-0 flex flex-col p-[var(--viewport-padding)] gap-[10px] w-[390px]  max-w-[250vw] m-0 list-none z-[2147483647] outline-none" />
                    </Toast.Provider>
                  </div>
                </div>
              </div>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="account" className='rounded-md'>
        <Card>
          <CardHeader className='bg-myColor-900'>
            <CardTitle>
              <h3 className="text-2xl font-thin text-slate4">
                EDIT ACCOUNT
              </h3>
            </CardTitle>
            <CardDescription>
              <p className="text-slate4 text-sm">
                Name, Phone # and email will show up in emails sent to customers.
              </p>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 bg-slate11 text-white">
            <fetcher.Form method="post" className=' mt-2'>
              <div className="grid sm:grid-cols-3 grid-cols-1  gap-2 mt-2">

                <div className="grid gap-2  ">
                  <Label htmlFor="area">Name</Label>
                  <Input
                    className="bg-myColor-900 px-5 h-[45px] w-[95%] flex-1 flex items-center justify-center text-[15px] leading-none  first:rounded-tl-md last:rounded-tr-md target:text-[#02a9ff] hover:text-[#02a9ff] text-slate4 active:bg-[#02a9ff] font-bold uppercase  rounded shadow hover:shadow-md outline-none  ease-linear transition-all duration-150
                 focus:outline-none   focus:text-[#02a9ff]   mx-1"
                    placeholder="name"
                    type="text"
                    name="name"
                    defaultValue={name}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="area">Phone</Label>
                  <Input
                    defaultValue={phone}
                    placeholder="Phone Number"
                    type="text"
                    name="phone"
                    className="bg-myColor-900 px-5 h-[45px] w-[95%] flex-1 flex items-center justify-center text-[15px] leading-none  first:rounded-tl-md last:rounded-tr-md target:text-[#02a9ff] hover:text-[#02a9ff] text-slate4 active:bg-[#02a9ff] font-bold uppercase  rounded shadow hover:shadow-md outline-none  ease-linear transition-all duration-150
                 focus:outline-none  focus:text-[#02a9ff]    mx-1"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="area" className=''>Email</Label>
                  <Input
                    className="bg-myColor-900 px-5 h-[45px] w-[95%] flex-1 flex items-center justify-center text-[15px] leading-none  first:rounded-tl-md last:rounded-tr-md target:text-[#02a9ff] hover:text-[#02a9ff] text-slate4 active:bg-[#02a9ff] font-bold uppercase  rounded shadow hover:shadow-md outline-none  ease-linear transition-all duration-150
                 focus:outline-none  focus:text-[#02a9ff]   mx-1"
                    placeholder="youremail@here.com"
                    type="email"
                    name="email"
                    defaultValue={user.email}
                  />
                </div>
                <div className="grid gap-2">
                  <Label className='mt-2' htmlFor="area">Username</Label>
                  <Input
                    defaultValue={user.username}
                    placeholder="Phone Number"
                    type="text"
                    name="username"
                    className="bg-myColor-900 px-5 h-[45px] w-[95%] flex-1 flex items-center justify-center text-[15px] leading-none  first:rounded-tl-md last:rounded-tr-md target:text-[#02a9ff] hover:text-[#02a9ff] text-slate4 active:bg-[#02a9ff] font-bold uppercase  rounded shadow hover:shadow-md outline-none  ease-linear transition-all duration-150
                 focus:outline-none   focus:text-[#02a9ff]   mx-1"
                  />
                </div>
              </div>
              <p className="text-slate4 text-sm mt-10">
                Dealer Information - This will only be for the contracts.
              </p>
              <div className="grid sm:grid-cols-3 grid-cols-1  gap-2 mt-2">

                <div className="grid gap-2">
                  <label htmlFor="area" className=''>Dealer Name</label>
                  <Input
                    defaultValue={deFees?.dealer}
                    placeholder="Dealer Name"
                    name="dealer"
                    className="bg-myColor-900 px-5 h-[45px] w-[95%] flex-1 flex items-center justify-center text-[15px] leading-none  first:rounded-tl-md last:rounded-tr-md target:text-[#02a9ff] hover:text-[#02a9ff] text-slate4 active:bg-[#02a9ff] font-bold uppercase  rounded shadow hover:shadow-md outline-none  ease-linear transition-all duration-150
                 focus:outline-none  focus:text-[#02a9ff]  mx-1"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="area" className='mt-2'>Dealer Address</Label>
                  <Input
                    placeholder="123 Dealer Street"
                    name="dealerAddress"
                    defaultValue={dealerAddress}
                    className="bg-myColor-900 px-5 h-[45px] w-[95%] flex-1 flex items-center justify-center text-[15px] leading-none  first:rounded-tl-md last:rounded-tr-md target:text-[#02a9ff] hover:text-[#02a9ff] text-slate4 active:bg-[#02a9ff] font-bold uppercase  rounded shadow hover:shadow-md outline-none  ease-linear transition-all duration-150
                 focus:outline-none  focus:text-[#02a9ff]   mx-1"
                  />
                </div>
                <div className="grid gap-2">
                  <Label className='mt-2' htmlFor="area">Dealer City, Prov, Postal Code</Label>
                  <Input
                    defaultValue={dealerProv}
                    placeholder="Toronto, ON, K1K K1K"
                    name="dealerProv"
                    className="bg-myColor-900 px-5 h-[45px] w-[95%] flex-1 flex items-center justify-center text-[15px] leading-none  first:rounded-tl-md last:rounded-tr-md target:text-[#02a9ff] hover:text-[#02a9ff] text-slate4 active:bg-[#02a9ff] font-bold uppercase  rounded shadow hover:shadow-md outline-none  ease-linear transition-all duration-150
                 focus:outline-none   focus:text-[#02a9ff]    mx-1"
                  />
                </div>
                <div className="grid gap-2">
                  <Label className='mt-2' htmlFor="area">Dealer Phone Number</Label>
                  <Input
                    placeholder="1231231234"
                    type="phone"
                    name="dealerPhone"
                    className="bg-myColor-900 px-5 h-[45px] w-[95%] flex-1 flex items-center justify-center text-[15px] leading-none  first:rounded-tl-md last:rounded-tr-md target:text-[#02a9ff] hover:text-[#02a9ff] text-slate4 active:bg-[#02a9ff] font-bold uppercase  rounded shadow hover:shadow-md outline-none  ease-linear transition-all duration-150
                 focus:outline-none focus:text-[#02a9ff]    mx-1"
                    defaultValue={dealerPhone}
                  />
                </div>
                <div className="grid gap-2">
                  <Label className='mt-2' htmlFor="area">OMVIC / GOV Lic</Label>
                  <Input
                    defaultValue={omvicNumber}
                    placeholder="1231234"
                    type="text"
                    name="omvicNumber"
                    className="bg-myColor-900 px-5 h-[45px] w-[95%] flex-1 flex items-center justify-center text-[15px] leading-none  first:rounded-tl-md last:rounded-tr-md target:text-[#02a9ff] hover:text-[#02a9ff] text-slate4 active:bg-[#02a9ff] font-bold uppercase  rounded shadow hover:shadow-md outline-none  ease-linear transition-all duration-150
                 focus:outline-none  focus:text-[#02a9ff]  mx-1"
                  />
                </div>
                <Input
                  type='hidden'
                  className="bg-myColor-900 px-5 h-[45px] w-[95%] flex-1 flex items-center justify-center text-[15px] leading-none  first:rounded-tl-md last:rounded-tr-md target:text-[#02a9ff] hover:text-[#02a9ff] text-slate4 active:bg-[#02a9ff] font-bold uppercase  rounded shadow hover:shadow-md outline-none  ease-linear transition-all duration-150
                 focus:outline-none  focus:text-[#02a9ff]  mx-1"
                  name="email"
                  defaultValue={user.email}
                />
                <input type='hidden' name='intent' value='updateFees' />

                {/* Add more inputs as needed */}
              </div>
              <Toast.Provider swipeDirection="right">
                <Button type="submit" name='intent' value='updateUser' className="bg-[#02a9ff] mt-3 mb-10 w-[75px] mx-1 text-white active:bg-[#0176b2] font-bold uppercase  cursor-pointer text-xs  rounded shadow hover:shadow-md outline-none focus:outline-none  ease-linear transition-all duration-150"
                  onClick={() => {
                    setOpen(false);
                    window.clearTimeout(timerRef.current);
                    timerRef.current = window.setTimeout(() => {
                      setOpen(true);
                    }, 100);
                  }}
                >
                  Update
                </Button>
                <Toast.Root
                  className="bg-white rounded-md shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] p-[15px] grid [grid-template-areas:_'title_action'_'description_action'] grid-cols-[auto_max-content] gap-x-[15px] items-center data-[state=open]:animate-slideIn data-[state=closed]:animate-hide data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-[transform_200ms_ease-out] data-[swipe=end]:animate-swipeOut"
                  open={open}
                  onOpenChange={setOpen}
                >
                  <Toast.Title className="[grid-area:_title] mb-[5px] font-medium text-white2 text-[15px]">
                    User Information Updated.
                  </Toast.Title>
                  <Toast.Description asChild>

                  </Toast.Description>

                </Toast.Root>
                <Toast.Viewport className="[--viewport-padding:_25px] fixed bottom-0 right-0 flex flex-col p-[var(--viewport-padding)] gap-[10px] w-[390px]  max-w-[250vw] m-0 list-none z-[2147483647] outline-none" />
              </Toast.Provider>

            </fetcher.Form >
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="dailyPdf" className='rounded-md'>
        <Card>
          <CardHeader className='bg-myColor-900'>
            <CardTitle className='text-white'>
              Daily PDF
            </CardTitle>
            <CardDescription>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 bg-slate11 text-white">



            <Form method="post">

              <div className="grid  grid-cols-1 gap-12 mt-3">
                <div>
                  <div>
                    <p>Guest Interactions:</p>
                  </div>
                  <div className='grid grid-cols-4 space-between'>
                    <Input
                      placeholder="Todays Goal"
                      name="todaysGoalGuest"
                      className="bg-myColor-900 px-5 h-8 w-[95%] flex-1 flex items-center justify-center text-[15px] leading-none  first:rounded-tl-md last:rounded-tr-md target:text-[#02a9ff] hover:text-[#02a9ff] text-slate4 active:bg-[#02a9ff] font-bold uppercase  rounded shadow hover:shadow-md outline-none  ease-linear transition-all duration-150
     focus:outline-none  focus:text-[#02a9ff]  mx-1"
                    />
                    <Input
                      placeholder="Todays Actual"
                      name="todaysActualGuest"
                      className="bg-myColor-900 px-5 h-8 w-[95%] flex-1 flex items-center justify-center text-[15px] leading-none  first:rounded-tl-md last:rounded-tr-md target:text-[#02a9ff] hover:text-[#02a9ff] text-slate4 active:bg-[#02a9ff] font-bold uppercase  rounded shadow hover:shadow-md outline-none  ease-linear transition-all duration-150
     focus:outline-none  focus:text-[#02a9ff]  mx-1"
                    />
                    <Input
                      placeholder="Difference"
                      name="differenceGuest"
                      className="bg-myColor-900 px-5 h-8 w-[95%] flex-1 flex items-center justify-center text-[15px] leading-none  first:rounded-tl-md last:rounded-tr-md target:text-[#02a9ff] hover:text-[#02a9ff] text-slate4 active:bg-[#02a9ff] font-bold uppercase  rounded shadow hover:shadow-md outline-none  ease-linear transition-all duration-150
     focus:outline-none  focus:text-[#02a9ff]  mx-1"
                    />
                    <Input
                      placeholder="Months Goal"
                      name="monthsGoalGuest"
                      className="bg-myColor-900 px-5 h-8 w-[95%] flex-1 flex items-center justify-center text-[15px] leading-none  first:rounded-tl-md last:rounded-tr-md target:text-[#02a9ff] hover:text-[#02a9ff] text-slate4 active:bg-[#02a9ff] font-bold uppercase  rounded shadow hover:shadow-md outline-none  ease-linear transition-all duration-150
     focus:outline-none  focus:text-[#02a9ff]  mx-1"
                    />
                  </div>
                </div>
                <div>
                  <div>
                    <p>Test Rides:</p>
                  </div>
                  <div className='grid grid-cols-4'>

                    <Input
                      placeholder="Todays Goal"
                      name="todaysGoalTestDrives"
                      className="bg-myColor-900 px-5 h-8 w-[95%] flex-1 flex items-center justify-center text-[15px] leading-none  first:rounded-tl-md last:rounded-tr-md target:text-[#02a9ff] hover:text-[#02a9ff] text-slate4 active:bg-[#02a9ff] font-bold uppercase  rounded shadow hover:shadow-md outline-none  ease-linear transition-all duration-150
     focus:outline-none  focus:text-[#02a9ff]  mx-1"
                    />
                    <Input
                      placeholder="Todays Actual"
                      name="todaysActualTestDrives"
                      className="bg-myColor-900 px-5 h-8 w-[95%] flex-1 flex items-center justify-center text-[15px] leading-none  first:rounded-tl-md last:rounded-tr-md target:text-[#02a9ff] hover:text-[#02a9ff] text-slate4 active:bg-[#02a9ff] font-bold uppercase  rounded shadow hover:shadow-md outline-none  ease-linear transition-all duration-150
     focus:outline-none  focus:text-[#02a9ff]  mx-1"
                    />
                    <Input
                      placeholder="Difference"
                      name="differenceTestDrives"
                      className="bg-myColor-900 px-5 h-8 w-[95%] flex-1 flex items-center justify-center text-[15px] leading-none  first:rounded-tl-md last:rounded-tr-md target:text-[#02a9ff] hover:text-[#02a9ff] text-slate4 active:bg-[#02a9ff] font-bold uppercase  rounded shadow hover:shadow-md outline-none  ease-linear transition-all duration-150
     focus:outline-none  focus:text-[#02a9ff]  mx-1"
                    />
                    <Input
                      placeholder="Months Goal"
                      name="monthsGoalTestDrives"
                      className="bg-myColor-900 px-5 h-8 w-[95%] flex-1 flex items-center justify-center text-[15px] leading-none  first:rounded-tl-md last:rounded-tr-md target:text-[#02a9ff] hover:text-[#02a9ff] text-slate4 active:bg-[#02a9ff] font-bold uppercase  rounded shadow hover:shadow-md outline-none  ease-linear transition-all duration-150
     focus:outline-none  focus:text-[#02a9ff]  mx-1"
                    />
                  </div>
                </div>
                <div>
                  <div>
                    <p>Write-Ups:</p>
                  </div>
                  <div className='grid grid-cols-4 space-between'>
                    <Input
                      placeholder="Todays Goal"
                      name="todaysGoalWriteUps"
                      className="bg-myColor-900 px-5 h-8 w-[95%] flex-1 flex items-center justify-center text-[15px] leading-none  first:rounded-tl-md last:rounded-tr-md target:text-[#02a9ff] hover:text-[#02a9ff] text-slate4 active:bg-[#02a9ff] font-bold uppercase  rounded shadow hover:shadow-md outline-none  ease-linear transition-all duration-150
     focus:outline-none  focus:text-[#02a9ff]  mx-1"
                    />
                    <Input
                      placeholder="Todays Actual"
                      name="todaysActualWriteUps"
                      className="bg-myColor-900 px-5 h-8 w-[95%] flex-1 flex items-center justify-center text-[15px] leading-none  first:rounded-tl-md last:rounded-tr-md target:text-[#02a9ff] hover:text-[#02a9ff] text-slate4 active:bg-[#02a9ff] font-bold uppercase  rounded shadow hover:shadow-md outline-none  ease-linear transition-all duration-150
     focus:outline-none  focus:text-[#02a9ff]  mx-1"
                    />
                    <Input
                      placeholder="Difference"
                      name="differenceWriteUps"
                      className="bg-myColor-900 px-5 h-8 w-[95%] flex-1 flex items-center justify-center text-[15px] leading-none  first:rounded-tl-md last:rounded-tr-md target:text-[#02a9ff] hover:text-[#02a9ff] text-slate4 active:bg-[#02a9ff] font-bold uppercase  rounded shadow hover:shadow-md outline-none  ease-linear transition-all duration-150
     focus:outline-none  focus:text-[#02a9ff]  mx-1"
                    />
                    <Input
                      placeholder="Months Goal"
                      name="monthsGoalWriteUps"
                      className="bg-myColor-900 px-5 h-8 w-[95%] flex-1 flex items-center justify-center text-[15px] leading-none  first:rounded-tl-md last:rounded-tr-md target:text-[#02a9ff] hover:text-[#02a9ff] text-slate4 active:bg-[#02a9ff] font-bold uppercase  rounded shadow hover:shadow-md outline-none  ease-linear transition-all duration-150
     focus:outline-none  focus:text-[#02a9ff]  mx-1"
                    />
                  </div>
                </div>
                <div>
                  <div>
                    <p>Deliveries:</p>
                    <div className='grid grid-cols-4 space-between'>

                      <Input
                        placeholder="Todays Goal"
                        name="todaysGoalDeliveries"
                        className="bg-myColor-900 px-5 h-8 w-[95%] flex-1 flex items-center justify-center text-[15px] leading-none  first:rounded-tl-md last:rounded-tr-md target:text-[#02a9ff] hover:text-[#02a9ff] text-slate4 active:bg-[#02a9ff] font-bold uppercase  rounded shadow hover:shadow-md outline-none  ease-linear transition-all duration-150
     focus:outline-none  focus:text-[#02a9ff]  mx-1"
                      />
                      <Input
                        placeholder="Todays Actual"
                        name="todaysActualDeliveries"
                        className="bg-myColor-900 px-5 h-8 w-[95%] flex-1 flex items-center justify-center text-[15px] leading-none  first:rounded-tl-md last:rounded-tr-md target:text-[#02a9ff] hover:text-[#02a9ff] text-slate4 active:bg-[#02a9ff] font-bold uppercase  rounded shadow hover:shadow-md outline-none  ease-linear transition-all duration-150
     focus:outline-none  focus:text-[#02a9ff]  mx-1"
                      />
                      <Input
                        placeholder="Difference"
                        name="differenceDeliveries"
                        className="bg-myColor-900 px-5 h-8 w-[95%] flex-1 flex items-center justify-center text-[15px] leading-none  first:rounded-tl-md last:rounded-tr-md target:text-[#02a9ff] hover:text-[#02a9ff] text-slate4 active:bg-[#02a9ff] font-bold uppercase  rounded shadow hover:shadow-md outline-none  ease-linear transition-all duration-150
     focus:outline-none  focus:text-[#02a9ff]  mx-1"
                      />
                      <Input
                        placeholder="Months Goal"
                        name="monthsGoalDeliveries"
                        className="bg-myColor-900 px-5 h-8 w-[95%] flex-1 flex items-center justify-center text-[15px] leading-none  first:rounded-tl-md last:rounded-tr-md target:text-[#02a9ff] hover:text-[#02a9ff] text-slate4 active:bg-[#02a9ff] font-bold uppercase  rounded shadow hover:shadow-md outline-none  ease-linear transition-all duration-150
     focus:outline-none  focus:text-[#02a9ff]  mx-1"
                      />
                      <Input
                        type='hidden'
                        name="userEmail"
                        defaultValue={user.email}
                        className="bg-myColor-900 px-5 h-[45px] w-[95%] flex-1 flex items-center justify-center text-[15px] leading-none  first:rounded-tl-md last:rounded-tr-md target:text-[#02a9ff] hover:text-[#02a9ff] text-slate4 active:bg-[#02a9ff] font-bold uppercase  rounded shadow hover:shadow-md outline-none  ease-linear transition-all duration-150
     focus:outline-none


     focus:text-[#02a9ff]
      mx-1"
                      />
                    </div>
                  </div>

                  <p className='mt-5'>Sales Focus and Training:</p>
                  <p>Ask questions, select the right bike, go for the close to see where in the sales process they are at, sit on and present features and benefites, offer test drive, trial close: sit down and write up, negotiate, handle objections, obtain commitment in some way or form, turn over to finance</p>
                  <p className='mt-5'>Sales Tasks:</p>
                  <p>follow up with todays tasks in crm</p>
                  <p>ensure all listings on socials are up to date</p>
                  <p>complete appts or reschedule if they were no shows</p>
                  <p>have sit down with SM to discuss sales oppurtunities</p>

                  <Button type="submit" name='intent' value='dailyPDF' className="bg-[#02a9ff] mt-3 mb-10 w-[75px] mx-1 text-white active:bg-[#0176b2] font-bold uppercase   text-xs  rounded shadow hover:shadow-md outline-none focus:outline-none  ease-linear transition-all duration-150"
                  >
                    Save
                  </Button>
                  <DailySheet dataPDF={dataPDF} />
                </div>
              </div>
            </Form>

          </CardContent>
        </Card>
      </TabsContent>
    </Tabs >
  )
}

export const action: ActionFunction = async ({ request }) => {
  console.log('settings')
  const formPayload = Object.fromEntries(await request.formData())
  const Input = financeFormSchema.parse(formPayload)
  const intent = formPayload.intent

  if (intent === 'updateUser') {
    delete Input.intent;

    const saveUser = await updateUser(Input)
    const saveDealer = await updateDealerFees(Input)
    return ({ saveUser, saveDealer })
  }
  if (intent === 'dailyPDF') {
    const userId = formPayload.userId
    const delete2 = await deleteDailyPDF(userId)
    delete Input.intent;
    const savedaily = await saveDailyWorkPlan(Input)
    console.log(savedaily)
    return ({ savedaily, delete2 })

  }
  return null
}

export const meta: MetaFunction = () => {
  return [
    { title: 'User Settings - Dealer Sales Assistant' },
    {
      property: "og:title",
      content: "Your very own assistant!",
    },
    {
      name: "description",
      content: "To help sales people achieve more. Every automotive dealer needs help, especialy the sales staff. Dealer Sales Assistant will help you close more deals more efficiently.",
      keywords: 'Automotive Sales, dealership sales, automotive CRM',
    },
  ];
};

export default function Mainbody() {
  const { user, deFees, dataPDF, statsData, comsRecords } = useLoaderData()
  const userIsAllowed = getUserIsAllowed(user, ["ADMIN", "MANAGER", "EDITOR", "SALES", "FINANCE"]);

  return (
    <>
      <div className="flex h-[100%] w-[98vw] left-0">
        <div className="w-[300px] rounded-lg h-[95%] bg-slate12 text-slate2  ">
          <hr className="solid" />
          <RemixNavLink to={`/welcome/quote`}>
            <Button
              variant="link"
              className="w-full justify-start cursor-pointer text-white "
            >
              Walkthrough
            </Button>
          </RemixNavLink>
          {userIsAllowed ? (
            <>
              <RemixNavLink to={`/admin`}>
                <Button variant="link" className="w-full justify-start cursor-pointer text-white" >
                  Admin
                </Button>
              </RemixNavLink>
            </>
          ) : (null)}
          <RemixNavLink to={`/user/dashboard/password`}>
            <Button
              variant="link"
              className="w-full justify-start cursor-pointer text-white"
            >
              Change Password
            </Button>
          </RemixNavLink>
          <RemixNavLink to={`/logout`}>
            <Button variant="link" className="w-full justify-start cursor-pointer text-white" >
              Log out
            </Button>
          </RemixNavLink>
        </div>
        <div className='w-[98%]'>
          <ProfileForm user={user} deFees={deFees} dataPDF={dataPDF} statsData={statsData} comsRecords={comsRecords} />
        </div>
      </div>
    </>
  )
}

