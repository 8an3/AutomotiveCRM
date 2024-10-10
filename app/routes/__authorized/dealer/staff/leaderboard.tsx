import { json, type ActionFunction, type LoaderFunction } from '@remix-run/node';
import { getSession, commitSession } from '~/sessions/auth-session.server';
import { GetUser } from '~/utils/loader.server';
import financeFormSchema from '~/overviewUtils/financeFormSchema';
import { Form, Link, useLoaderData, useLocation, Await, useFetcher, useSubmit, useNavigate, useNavigation } from '@remix-run/react';
import { ProgressCircle } from '@tremor/react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/components/ui/tabs"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "~/components/ui/chart"
import { prisma } from '~/libs';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"
import { Button, ButtonLoading, Input } from '~/components';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
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
import { EditableText } from '~/components/shared/shared';
import { PaperPlaneIcon } from '@radix-ui/react-icons';
import { toast } from "sonner"
import { useEffect, useMemo, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import { TrashIcon } from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  LabelList,
  Line,
  PieChart,
  LineChart,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  Rectangle,
  ReferenceLine,
  XAxis,
  YAxis,
  Pie,
} from "recharts"
import { Separator } from "~/components//ui/separator"
import moment from 'moment';
import { Charts } from '~/components/staff/charts';
import { InteractiveChart } from '~/components/staff/interactiveChart';
import { WeeklkyChart } from '~/components/staff/weeklyChart';
import chart from '~/images/favicons/chart.svg'

export const links: LinksFunction = () => [
  { rel: "icon", type: "image/svg", href: chart },
]
export const meta: MetaFunction = () => {

  return [
    { title: 'Leaderboard || STAFF LOUNGE || Dealer Sales Assistant' },
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

export async function action({ request, params }: ActionFunction) {
  const formPayload = Object.fromEntries(await request.formData())
  const formData = financeFormSchema.parse(formPayload);
  const session = await getSession(request.headers.get('Cookie'));
  const email = session.get('email')
  const user = await GetUser(email)
  const intent = formData.intent
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  if (intent === 'blank') {
    return null
  }
  if (intent === 'saveStoreGoals') {
    const dept = await prisma.deptGoals.findMany({
      where: { dept: 'Sales' }
    })
    const save = await prisma.deptGoals.update({
      where: { id: dept[0].id },
      data: {
        dept: 'Sales',
        year: String(currentYear),
        janGoal: formData.janGoal,
        febGoal: formData.febGoal,
        marGoal: formData.marGoal,
        aprGoal: formData.aprGoal,
        mayGoal: formData.mayGoal,
        junGoal: formData.junGoal,
        julGoal: formData.julGoal,
        augGoal: formData.augGoal,
        sepGoal: formData.sepGoal,
        octGoal: formData.octGoal,
        novGoal: formData.novGoal,
        decGoal: formData.decGoal,
        janAch: formData.janAch,
        febAch: formData.febAch,
        marAch: formData.marAch,
        aprAch: formData.aprAch,
        mayAch: formData.mayAch,
        junAch: formData.junAch,
        julAch: formData.julAch,
        augAch: formData.augAch,
        sepAch: formData.sepAch,
        octAch: formData.octAch,
        novAch: formData.novAch,
        decAch: formData.decAch,
      }
    })
    return save
  }
  if (intent === 'saveServiceGoals') {
    const dept = await prisma.deptGoals.findMany({
      where: { dept: 'Service' }
    })
    const save = await prisma.deptGoals.update({
      where: { id: dept[0].id },
      data: {
        janGoal: formData.janGoal,
        febGoal: formData.febGoal,
        marGoal: formData.marGoal,
        aprGoal: formData.aprGoal,
        mayGoal: formData.mayGoal,
        junGoal: formData.junGoal,
        julGoal: formData.julGoal,
        augGoal: formData.augGoal,
        sepGoal: formData.sepGoal,
        octGoal: formData.octGoal,
        novGoal: formData.novGoal,
        decGoal: formData.decGoal,
        janAch: formData.janAch,
        febAch: formData.febAch,
        marAch: formData.marAch,
        aprAch: formData.aprAch,
        mayAch: formData.mayAch,
        junAch: formData.junAch,
        julAch: formData.julAch,
        augAch: formData.augAch,
        sepAch: formData.sepAch,
        octAch: formData.octAch,
        novAch: formData.novAch,
        decAch: formData.decAch,
      }
    })
    return save
  }
  if (intent === 'savePartsGoals') {
    const dept = await prisma.deptGoals.findMany({
      where: { dept: 'Parts' }
    })
    const save = await prisma.deptGoals.update({
      where: { id: dept[0].id },
      data: {
        janGoal: formData.janGoal,
        febGoal: formData.febGoal,
        marGoal: formData.marGoal,
        aprGoal: formData.aprGoal,
        mayGoal: formData.mayGoal,
        junGoal: formData.junGoal,
        julGoal: formData.julGoal,
        augGoal: formData.augGoal,
        sepGoal: formData.sepGoal,
        octGoal: formData.octGoal,
        novGoal: formData.novGoal,
        decGoal: formData.decGoal,
        janAch: formData.janAch,
        febAch: formData.febAch,
        marAch: formData.marAch,
        aprAch: formData.aprAch,
        mayAch: formData.mayAch,
        junAch: formData.junAch,
        julAch: formData.julAch,
        augAch: formData.augAch,
        sepAch: formData.sepAch,
        octAch: formData.octAch,
        novAch: formData.novAch,
        decAch: formData.decAch,
      }
    })
    return save
  }
  if (intent === 'saveAccessoriesGoals') {
    const dept = await prisma.deptGoals.findMany({
      where: { dept: 'Accessories' }
    })
    const save = await prisma.deptGoals.update({
      where: { id: dept[0].id },
      data: {
        janGoal: formData.janGoal,
        febGoal: formData.febGoal,
        marGoal: formData.marGoal,
        aprGoal: formData.aprGoal,
        mayGoal: formData.mayGoal,
        junGoal: formData.junGoal,
        julGoal: formData.julGoal,
        augGoal: formData.augGoal,
        sepGoal: formData.sepGoal,
        octGoal: formData.octGoal,
        novGoal: formData.novGoal,
        decGoal: formData.decGoal,
        janAch: formData.janAch,
        febAch: formData.febAch,
        marAch: formData.marAch,
        aprAch: formData.aprAch,
        mayAch: formData.mayAch,
        junAch: formData.junAch,
        julAch: formData.julAch,
        augAch: formData.augAch,
        sepAch: formData.sepAch,
        octAch: formData.octAch,
        novAch: formData.novAch,
        decAch: formData.decAch,
      }
    })
    return save
  }
  if (intent === 'saveUserGoals') {
    const save = await prisma.userGoals.update({
      where: { id: formData.id },
      data: {
        userEmail: email,
        year: String(currentYear),
        janGoal: formData.janGoal,
        febGoal: formData.febGoal,
        marGoal: formData.marGoal,
        aprGoal: formData.aprGoal,
        mayGoal: formData.mayGoal,
        junGoal: formData.junGoal,
        julGoal: formData.julGoal,
        augGoal: formData.augGoal,
        sepGoal: formData.sepGoal,
        octGoal: formData.octGoal,
        novGoal: formData.novGoal,
        decGoal: formData.decGoal,
        janAch: formData.janAch,
        febAch: formData.febAch,
        marAch: formData.marAch,
        aprAch: formData.aprAch,
        mayAch: formData.mayAch,
        junAch: formData.junAch,
        julAch: formData.julAch,
        augAch: formData.augAch,
        sepAch: formData.sepAch,
        octAch: formData.octAch,
        novAch: formData.novAch,
        decAch: formData.decAch,
      }
    })
    return save
  }
  if (intent === 'addUserGoal') {
    const save = await prisma.thirtyDayGoal.create({
      data: {
        description: formData.description,
        goal: formData.goal,
        expired: false,
        achieved: formData.achieved,
        days: formData.days,
        User: { connect: { email: email } }
      }
    });
    return save
  }
  if (intent === 'updateGoalDescription') {
    const save = await prisma.thirtyDayGoal.update({
      where: { id: formData.id },
      data: {
        description: formData.description,
      }
    })
    return save
  }
  if (intent === 'updateGoal') {
    const save = await prisma.thirtyDayGoal.update({
      where: { id: formData.id },
      data: {
        goal: formData.goal,
      }
    })
    return save
  }
  if (intent === 'updateAchieved') {
    const save = await prisma.thirtyDayGoal.update({
      where: { id: formData.id },
      data: {
        achieved: formData.achieved,
      }
    })
    return save
  }
  if (intent === 'updateTitle') {
    const save = await prisma.thirtyDayGoal.update({
      where: { id: formData.id },
      data: {
        title: formData.title,
      }
    })
    return save
  }
  if (intent === 'deleteSingleGoal') {
    const save = await prisma.thirtyDayGoal.delete({
      where: { id: formData.id },
    })
    return save
  }
  return json({ user });
};

export async function loader({ request, params }: LoaderFunction) {
  const session = await getSession(request.headers.get('Cookie'));
  const email = session.get('email')
  const user = await prisma.user.findUnique({
    where: { email: email },
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      subscriptionId: true,
      customerId: true,
      returning: true,
      phone: true,
      roleId: true,
      profileId: true,
      omvicNumber: true,
      lastSubscriptionCheck: true,
      profile: true,
      activisUserId: true,
      activixEmail: true,
      activixActivated: true,
      activixId: true,
      dealerAccountId: true,
      microId: true,
      givenName: true,
      familyName: true,
      identityProvider: true,
      plan: true,

      role: { select: { id: true, symbol: true, name: true } },
      positions: { select: { id: true, position: true } },
      userGoals: {
        select: {
          id: true,
          userEmail: true,
          year: true,
          janGoal: true,
          febGoal: true,
          marGoal: true,
          aprGoal: true,
          mayGoal: true,
          junGoal: true,
          julGoal: true,
          augGoal: true,
          sepGoal: true,
          octGoal: true,
          novGoal: true,
          decGoal: true,
          janAch: true,
          febAch: true,
          marAch: true,
          aprAch: true,
          mayAch: true,
          junAch: true,
          julAch: true,
          augAch: true,
          sepAch: true,
          octAch: true,
          novAch: true,
          decAch: true,
        }
      },
      thirtyDayGoals: { select: { id: true, userEmail: true, title: true, description: true, goal: true, expired: true, achieved: true, days: true } },

    },
  })
  const deptGoals = await prisma.deptGoals.findMany({ where: { year: '2024' } }); // chang eto get the current year
  const userGoals = await prisma.userGoals.findMany({ where: { userEmail: email, year: '2024' } });
  const thirtyDayGoals = user.thirtyDayGoals

  const comsRecords = await prisma.comm.findMany({ where: { userEmail: email }, });
  const statsData = await prisma.finance.findMany({
    where: { userEmail: email },
  });
  const finances = await prisma.finance.findMany({
    where: {
      sold: {
        not: null
      }
    },
    select: {
      sold: true,
      delivered: true,
    },
  });
  const finNotSold = await prisma.finance.findMany({
    where: { userEmail: email },
    include: {
      Comm: true,
    },
  });
  const allComms = finNotSold.flatMap(finance => finance.Comm);
  const accOrders = await prisma.accOrder.findMany({
    where: { paid: true }
  })
  const workOrders = await prisma.workOrder.findMany({
    where: { paid: 'true' }
  })
  return json({
    user, deptGoals, userGoals, thirtyDayGoals, statsData, comsRecords, finances, allComms, accOrders, workOrders
  });
};

const calcPer = (goal, actual) => {
  // Avoid division by zero
  return goal > 0 ? (actual / goal) * 100 : 0;
};





export default function NewFile() {
  const { user, deptGoals, userGoals, thirtyDayGoals, statsData, comsRecords, finances, allComms, accOrders, workOrders } = useLoaderData()
  const submit = useSubmit()
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const cards = deptGoals
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const chartConfig = {
    sales: {
      label: "Sales",
      color: "#0090ff",
    },
    accessories: {
      label: "Accessories",
      color: "#30a46c",
    },
    parts: {
      label: "Parts",
      color: "#ffc53d",
    },
    service: {
      label: "Service",
      color: "#e54d2e",
    },
  } satisfies ChartConfig

  const callsChartConfig = {
    InPerson: {
      label: "In Person",
      color: "#0090ff",
    },
    Phone: {
      label: "Phone",
      color: "#30a46c",
    },
    SMS: {
      label: "SMS",
      color: "#ffc53d",
    },
    Email: {
      label: "Email",
      color: "#e54d2e",
    },
    Other: {
      label: "Other",
      color: "#3E63DD",
    },
  } satisfies ChartConfig

  const chartConfigSales = {
    sold: {
      label: "Sold",
      color: "#0090ff",
    },
    otd: {
      label: "Out The Door",
      color: "#2eb88a",
    },

  } satisfies ChartConfig
  const chartConfigDepts = {
    sold: {
      label: "Sold",
      color: "#0090ff",
    },
  } satisfies ChartConfig
  // --------------- dept chart --------------------//

  const chartData = months.map(month => {
    const monthData = {
      month,
      sales: calcPer(cards.find(card => card.dept === 'Sales')[`${month.toLowerCase().substring(0, 3)}Goal`], cards.find(card => card.dept === 'Sales')[`${month.toLowerCase().substring(0, 3)}Ach`]),
      parts: calcPer(cards.find(card => card.dept === 'Parts')[`${month.toLowerCase().substring(0, 3)}Goal`], cards.find(card => card.dept === 'Parts')[`${month.toLowerCase().substring(0, 3)}Ach`]),
      service: calcPer(cards.find(card => card.dept === 'Service')[`${month.toLowerCase().substring(0, 3)}Goal`], cards.find(card => card.dept === 'Service')[`${month.toLowerCase().substring(0, 3)}Ach`]),
      accessories: calcPer(cards.find(card => card.dept === 'Accessories')[`${month.toLowerCase().substring(0, 3)}Goal`], cards.find(card => card.dept === 'Accessories')[`${month.toLowerCase().substring(0, 3)}Ach`]),
    };
    return monthData;
  });

  // --------------- dept chart --------------------//
  // --------------- user chart monthly ------------//


  const userGoalsData = userGoals.flatMap(userGoal =>
    months.map(month => ({
      month,
      goal: userGoal[`${month.toLowerCase()}Goal`],
      achieved: userGoal[`${month.toLowerCase()}Ach`],
    }))
  );
  let flattenedUserGoalsData = userGoalsData[0] ? userGoalsData : userGoalsData[0];

  const userChartData = userGoals[0];

  const filterDataByMonth = (data, month) => {
    // Check if data is valid
    if (!data || !Array.isArray(data)) {
      console.error("Data is not defined or not an array");
      return 0; // Return 0 if data is invalid
    }

    // Count the number of sold dates in the specified month
    return data.reduce((count, item) => {
      const soldDate = new Date(item.sold);

      // Check if the sold date falls in the specified month
      if (soldDate.getMonth() === month - 1) {
        return count + 1; // Increment the count if it matches
      }
      return count; // Return the current count if it doesn't match
    }, 0);
  };
  // ------------------- depts
  const accessoryGoals = deptGoals.filter(card => card.dept === 'Accessories')
  const filterDataByMonthAccessories = (data) => {
    return data.reduce((totals, item) => {
      if (item.paid) {
        const month = new Date(item.paidDate).getMonth();
        if (month >= 0 && month < 12) {
          totals[month] += Number(item.total) || 0;
        }
      }
      return totals;
    }, Array(12).fill(0));
  };
  const partsGoals = deptGoals.filter(card => card.dept === 'Parts')
  const serviceGoals = deptGoals.filter(card => card.dept === 'Service')
  const salesGoals = deptGoals.filter(card => card.dept === 'Sales')
  const partsData = accOrders.filter(card => card.dept === 'Parts')
  const accessoriesData = accOrders.filter(card => card.dept === 'Accessories')
  console.log(accessoriesData, 'accessoriesData')
  const chartData2 = [
    {
      month: "January",
      sold: calcPer(Number(userChartData.janGoal), filterDataByMonth(statsData, 1)),
      otd: calcPer(Number(userChartData.janAch), filterDataByMonth(statsData, 1)),
    },
    {
      month: "February",
      sold: calcPer(Number(userChartData.febGoal), filterDataByMonth(statsData, 2)),
      otd: calcPer(Number(userChartData.febAch), filterDataByMonth(statsData, 2)),
    },
    {
      month: "March",
      sold: calcPer(Number(userChartData.marGoal), filterDataByMonth(statsData, 3)),
      otd: calcPer(Number(userChartData.marAch), filterDataByMonth(statsData, 3)),
    },
    {
      month: "April",
      sold: calcPer(Number(userChartData.aprGoal), filterDataByMonth(statsData, 4)),
      otd: calcPer(Number(userChartData.aprAch), filterDataByMonth(statsData, 4)),
    },
    {
      month: "May",
      sold: calcPer(Number(userChartData.mayGoal), filterDataByMonth(statsData, 5)),
      otd: calcPer(Number(userChartData.mayAch), filterDataByMonth(statsData, 5)),
    },
    {
      month: "June",
      sold: calcPer(Number(userChartData.junGoal), filterDataByMonth(statsData, 6)),
      otd: calcPer(Number(userChartData.junAch), filterDataByMonth(statsData, 6)),
    },
    {
      month: "July",
      sold: calcPer(Number(userChartData.julGoal), filterDataByMonth(statsData, 7)),
      otd: calcPer(Number(userChartData.julAch), filterDataByMonth(statsData, 7)),
    },
    {
      month: "August",
      sold: calcPer(Number(userChartData.augGoal), filterDataByMonth(statsData, 8)),
      otd: calcPer(Number(userChartData.augAch), filterDataByMonth(statsData, 8)),
    },
    {
      month: "September",
      sold: calcPer(Number(userChartData.sepGoal), filterDataByMonth(statsData, 9)),
      otd: calcPer(Number(userChartData.sepAch), filterDataByMonth(statsData, 9)),
    },
    {
      month: "October",
      sold: calcPer(Number(userChartData.octGoal), filterDataByMonth(statsData, 10)),
      otd: calcPer(Number(userChartData.octAch), filterDataByMonth(statsData, 10)),
    },
    {
      month: "November",
      sold: calcPer(Number(userChartData.novGoal), filterDataByMonth(statsData, 11)),
      otd: calcPer(Number(userChartData.novAch), filterDataByMonth(statsData, 11)),
    },
    {
      month: "December",
      sold: calcPer(Number(userChartData.decGoal), filterDataByMonth(statsData, 12)),
      otd: calcPer(Number(userChartData.decAch), filterDataByMonth(statsData, 12)),
    },
  ];



  // --------------- user chart monthly ------------//
  // --------------- single goals extra --------------------//

  const singleGoalList = [
    { name: 'title', value: thirtyDayGoals.title, label: 'Title', },
    { name: 'description', value: thirtyDayGoals.descrption, label: 'Description', },
    { name: 'goal', value: thirtyDayGoals.goal, label: 'Goal', },
    { name: 'achieved', value: thirtyDayGoals.achieved, label: 'Achieved', },
  ];
  // --------------- single goals extra --------------------//
  // --------------- user chart weekly  --------------------//
  // --------------- user chart weekly  --------------------//
  // --------------- 30day call chart  --------------------//
  const [callsData, setCallsData] = useState([]);
  //  <RoundProgMiddle goal={goal} />

  useEffect(() => {

    const dateMap = {};

    // Process each communication
    allComms.forEach(comm => {
      const date = new Date(comm.createdAt).toISOString().split('T')[0];

      if (!dateMap[date]) {
        dateMap[date] = { date, Phone: 0, SMS: 0, Email: 0, Other: 0, InPerson: 0 };
      }

      dateMap[date][comm.type] += 1;
    });

    console.log('DateMap after processing comms:', dateMap);

    // Initialize startDate variable if not already defined
    const startDate = new Date(); // Set this to the appropriate start date if needed

    const processedData = [];

    // Create a 30-day data range
    for (let i = 0; i < 30; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dateString = date.toISOString().split('T')[0];

      if (!dateMap[dateString]) {
        dateMap[dateString] = { date: dateString, Phone: 0, SMS: 0, Email: 0, Other: 0, InPerson: 0 };
      }
      processedData.push(dateMap[dateString]);
    }

    console.log('ProcessedData after 30 days:', processedData);

    // Sort the processed data by date
    processedData.sort((a, b) => new Date(a.date) - new Date(b.date));
    console.log('Sorted Processed Data:', processedData);

    // Update the state with the processed data
    setCallsData(processedData);
    console.log('Processed data:', processedData);
  }, [allComms]);

  // --------------- 30day call chart  --------------------//
  //
  return (
    <div>
      <Tabs defaultValue="username" className="w-[95%]">
        <TabsList>
          <TabsTrigger value="username">{user.name}</TabsTrigger>
          <TabsTrigger value="Weekly Chart">{user.name}'s{" "}Weekly Chart</TabsTrigger>
          <TabsTrigger value="dept">Store</TabsTrigger>
        </TabsList>
        <TabsContent value="username">
          <div className='flex justify-between'>
            <div>
              <h2 className='text-left mt-3 mb-2 text-2xl '>Your Sales Board</h2>
              <p className='text-left mb-5'>100 meaning that you achieved 100% of your sales target.</p>
            </div>
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="outline" className='ml-auto justify-end bg-primary mt-3'>Edit</Button>
              </DrawerTrigger>
              <DrawerContent className='bg-background  border border-border'>

                <div className="mx-auto w-full max-w-[97%]">
                  <DrawerHeader>
                    <DrawerTitle className='text-center'>Edit Sales & Goals</DrawerTitle>
                  </DrawerHeader>
                  <Form method='post'>
                    <input type='hidden' name='id' value={userGoals[0].id} />
                    <div className="p-4 pb-0">
                      <div className="flex items-center justify-center space-x-2">
                        <div className='grid grid-cols-1'>
                          <Table className="mt-8">
                            <TableCaption>Sales and goals.</TableCaption>
                            <TableHeader>
                              <TableRow className="">
                                <TableHead>
                                  <p className='text-center  text-background'>
                                    Type
                                  </p>
                                </TableHead >
                                {months.map(month => (
                                  <TableHead key={month}><p className='text-center'>{month}</p></TableHead>
                                ))}
                                <TableHead>
                                  <p className='text-center text-background'>
                                    Save
                                  </p>
                                </TableHead >
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              <TableRow>
                                <TableCell className="font-medium">
                                  Sold Goal
                                </TableCell>
                                {flattenedUserGoalsData.map((item, index) => (
                                  <TableCell key={index} >
                                    <Input
                                      name={`${item.month.toLowerCase()}Goal`}
                                      defaultValue={item.goal}
                                      className='w-[35px] mx-auto' />
                                  </TableCell>
                                ))}
                                <TableCell className="font-medium">
                                  <Button
                                    variant='outline'
                                    type='submit'
                                    name='intent'
                                    value='saveUserGoals'
                                    className='bg-primary' >
                                    Save
                                  </Button>
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium">
                                  Out The Door Goal
                                </TableCell>
                                {flattenedUserGoalsData.map((item, index) => (
                                  <TableCell key={index}>
                                    <Input
                                      name={`${item.month.toLowerCase()}Ach`}
                                      defaultValue={item.achieved}
                                      className='w-[35px] mx-auto'
                                    />
                                  </TableCell>
                                ))}
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    </div>
                  </Form>

                </div>
              </DrawerContent>
            </Drawer>
          </div>
          <ChartContainer config={chartConfigSales} className="min-h-[200px] w-full">
            <BarChart accessibilityLayer data={chartData2}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <YAxis
                type="number"
                domain={[0, 100]} // Adjust domain to limit Y-axis to 0 to 100
                ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]} // Customize tick marks if needed
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />

              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="sold" fill="#0090ff" radius={4} />
              <Bar dataKey="otd" fill="var(--color-otd)" radius={4} />
            </BarChart>
          </ChartContainer>
          <Tabs defaultValue="Goals" className="w-[95%] mt-10">
            <TabsList>
              <TabsTrigger value="Goals">Goals</TabsTrigger>
              <TabsTrigger value="Statistics">Statistics</TabsTrigger>
            </TabsList>
            <TabsContent value="Goals">
              <div className='grid grid-cols-1'>
                <Drawer>
                  <DrawerTrigger asChild>
                    <Button variant="outline" className='ml-auto justify-end bg-primary mt-3'>Add Goal</Button>
                  </DrawerTrigger>
                  <DrawerContent className='bg-background  border border-border'>

                    <div className="mx-auto w-full max-w-[97%]">
                      <DrawerHeader>
                        <DrawerTitle className='text-center'>Add new goal</DrawerTitle>
                        <DrawerDescription className='text-center text-muted-foreground'>This is where you can add your own custom goals to measure your way to success.</DrawerDescription>
                      </DrawerHeader>
                      <Form method='post' className=' my-4 w-[350px] mx-auto'>

                        {singleGoalList.map((item, index) => (
                          <div key={index} className="relative mt-4">
                            <Input
                              name={item.name}

                              className={` bg-background text-foreground border border-border`}
                            />
                            <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">{item.label}</label>
                          </div>
                        ))}
                        <div className="relative mt-4">
                          <Select name='days'>
                            <SelectTrigger className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="7">7</SelectItem>
                              <SelectItem value="14">14</SelectItem>
                              <SelectItem value="30">30</SelectItem>
                              <SelectItem value="60">60</SelectItem>
                              <SelectItem value="90">90</SelectItem>
                              <SelectItem value="180">180</SelectItem>
                              <SelectItem value="360">360</SelectItem>
                            </SelectContent>
                          </Select>
                          <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">Days</label>
                        </div>
                        <input type='hidden' name="userEmail" defaultValue={user.email} />

                        <ButtonLoading
                          size="sm"
                          value="addUserGoal"
                          className="w-auto cursor-pointer mt-5 ml-auto mr-3 bg-primary justify-end"
                          name="intent"
                          type="submit"
                          isSubmitting={isSubmitting}
                          onClick={() => toast.success(`Created goal successfully!`)}
                          loadingText={`Adding goal...`}
                        >
                          Add
                          <PaperPlaneIcon className="h-4 w-4 ml-2" />

                        </ButtonLoading>

                      </Form>
                    </div>
                  </DrawerContent>
                </Drawer>
                <div className='m-3 flex flex-row'>
                  {thirtyDayGoals && thirtyDayGoals.length > 0 ? (
                    thirtyDayGoals.map((goal, index) => (
                      <div key={index} className='flex group'>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => {
                            const formData = new FormData();
                            formData.append("id", goal.id);
                            formData.append("intent", 'deleteSingleGoal');
                            submit(formData, { method: "post" });
                          }}
                          className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100 ml-2"
                        >
                          <TrashIcon className="h-3 w-3" />
                          <span className="sr-only">Copy</span>
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div>No goals to display</div>
                  )}
                </div>
                <div className='mx-auto mt-10'>
                  <Charts userChartData={userChartData} />
                </div>
                <div className='mx-auto mt-10'>
                  <InteractiveChart />
                </div>

              </div>
            </TabsContent>
            <TabsContent value="Statistics">
              <div className='grid grid-cols-1 mx-auto mt-5'>

                <ChartContainer config={callsChartConfig} className="min-h-[200px] w-full mt-10">
                  <BarChart accessibilityLayer data={callsData}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      tickFormatter={(value) => value.slice(0, 3)}
                    />
                    <YAxis
                      type="number"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                    />

                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Bar dataKey="Phone" stackId="a" fill="var(--color-Phone)" />
                    <Bar dataKey="SMS" stackId="a" fill="var(--color-SMS)" />
                    <Bar dataKey="Email" stackId="a" fill="var(--color-Email)" />
                    <Bar dataKey="Other" stackId="a" fill="var(--color-Other)" />
                    <Bar dataKey="InPerson" stackId="a" fill="var(--color-InPerson)" />
                  </BarChart>
                </ChartContainer>
              </div>
            </TabsContent>
          </Tabs>
        </TabsContent>
        <TabsContent value="Weekly Chart">
          <div className="grid gap-6">
            <Card x-chunk="dashboard-04-chunk-1">
              <CardHeader>
                <CardTitle>Weekly Breakdown Of Sales by Month</CardTitle>
                <CardDescription>
                  Greater clarity on when your sales happened through the year.
                </CardDescription>
              </CardHeader>
              <CardContent>
                < InteractiveChart />
              </CardContent>
              <CardFooter className="border-t px-6 py-4 border-border">

              </CardFooter>
            </Card>
            <Card x-chunk="dashboard-04-chunk-1">
              <CardHeader>
                <CardTitle>Weekly Breakdown Of Sales by Month</CardTitle>
                <CardDescription>
                  Greater clarity on when your sales happened through the year.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <WeeklkyChart
                  userChartData={userChartData}
                  salesRecords={finances}
                />
              </CardContent>
              <CardFooter className="border-t px-6 py-4 border-border">

              </CardFooter>
            </Card>
          </div>

        </TabsContent>
        <TabsContent value="dept">
          <div className="grid gap-6">
            <Card x-chunk="dashboard-04-chunk-1">
              <CardHeader>
                <CardTitle>Leaderboard by Dept</CardTitle>
                <CardDescription>
                  See whos beating who.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Card>
                  <Tabs defaultValue="account" className="">
                    <CardHeader>
                      <TabsList>
                        <TabsTrigger value="account">Accessories</TabsTrigger>
                        <TabsTrigger value="Service">Service</TabsTrigger>
                        <TabsTrigger value="Parts">Parts</TabsTrigger>
                        <TabsTrigger value="Sales">Sales</TabsTrigger>
                      </TabsList>
                    </CardHeader>
                    <CardContent>
                      <TabsContent value="account">
                        <StoreChart
                          userChartData={accessoryGoals}
                          chartConfigDepts={chartConfigDepts}
                          statsData={accOrders}
                          filterDataByMonth={filterDataByMonthAccessories}
                        />
                      </TabsContent>
                      <TabsContent value="Service">
                        <StoreChart
                          userChartData={serviceGoals}
                          chartConfigDepts={chartConfigDepts}
                          statsData={workOrders}
                          filterDataByMonth={filterDataByMonthAccessories}
                        />
                      </TabsContent>
                      <TabsContent value="Parts">
                        <StoreChart
                          userChartData={partsGoals}
                          chartConfigDepts={chartConfigDepts}
                          statsData={partsData}
                          filterDataByMonth={filterDataByMonthAccessories}
                        />
                      </TabsContent>
                      <TabsContent value="Sales">
                        <StoreChart
                          userChartData={salesGoals}
                          chartConfigDepts={chartConfigDepts}
                          statsData={accOrders}
                          filterDataByMonth={filterDataByMonthAccessories}
                        />
                      </TabsContent>
                    </CardContent>
                  </Tabs>
                </Card>
              </CardContent>
              <CardFooter className="border-t px-6 py-4 border-border">
              </CardFooter>
            </Card>
          </div>
        </TabsContent >
      </Tabs >
    </div >
  )
}


function StoreChart({ chartConfigDepts, userChartData, statsData, filterDataByMonth }) {
  const monthlyTotals = filterDataByMonth(statsData);

  const chartData2 = [
    { month: "January", sold: calcPer(Number(userChartData.janGoal), monthlyTotals[0]) },
    { month: "February", sold: calcPer(Number(userChartData.febGoal), monthlyTotals[1]) },
    { month: "March", sold: calcPer(Number(userChartData.marGoal), monthlyTotals[2]) },
    { month: "April", sold: calcPer(Number(userChartData.aprGoal), monthlyTotals[3]) },
    { month: "May", sold: calcPer(Number(userChartData.mayGoal), monthlyTotals[4]) },
    { month: "June", sold: calcPer(Number(userChartData.junGoal), monthlyTotals[5]) },
    { month: "July", sold: calcPer(Number(userChartData.julGoal), monthlyTotals[6]) },
    { month: "August", sold: calcPer(Number(userChartData.augGoal), monthlyTotals[7]) },
    { month: "September", sold: calcPer(Number(userChartData.sepGoal), monthlyTotals[8]) },
    { month: "October", sold: calcPer(Number(userChartData.octGoal), monthlyTotals[9]) },
    { month: "November", sold: calcPer(Number(userChartData.novGoal), monthlyTotals[10]) },
    { month: "December", sold: calcPer(Number(userChartData.decGoal), monthlyTotals[11]) },
  ];
  console.log(chartData2, 'chartdata2')
  return (
    <ChartContainer config={chartConfigDepts} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={chartData2}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <YAxis
          type="number"
          domain={[0, 100]} // Adjust domain to limit Y-axis to 0 to 100
          ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]} // Customize tick marks if needed
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />

        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="sold" fill="#0090ff" radius={4} />
      </BarChart>
    </ChartContainer>
  )
}
