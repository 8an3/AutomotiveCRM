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
import { EditableText } from '~/components/user/dashboard/components';
import { PaperPlaneIcon } from '@radix-ui/react-icons';
import { toast } from "sonner"
import { useEffect, useState } from 'react';
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
  sales: {
    label: "Sales",
    color: "#0090ff",
  },

} satisfies ChartConfig

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
      newLook: true,
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
    where: { userEmail: { equals: email, }, },
  });
  const finances = await prisma.finance.findMany({
    where: {
      sold: {
        not: null
      }
    },
    select: {
      sold: true,
    },
  });
  const finNotSold = await prisma.finance.findMany({
    where: { userEmail: email },
    include: {
      Comm: true,
    },
  });
  const allComms = finNotSold.flatMap(finance => finance.Comm);

  return json({
    user, deptGoals, userGoals, thirtyDayGoals, statsData, comsRecords, finances, allComms
  });
};

const calcPer = (goal, achiev) => {
  if (goal === 0) return 0;
  return Math.round((achiev / goal) * 100);
};

export default function NewFile() {
  const { user, deptGoals, userGoals, thirtyDayGoals, statsData, comsRecords, finances, allComms } = useLoaderData()
  const submit = useSubmit()
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const cards = deptGoals
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

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
  const salesData = months.map(month => ({
    month,
    goal: cards.find(card => card.dept === 'Sales')[`${month.toLowerCase()}Goal`],
    achieved: cards.find(card => card.dept === 'Sales')[`${month.toLowerCase()}Ach`],
  }));
  const serviceData = months.map(month => ({
    month,
    goal: cards.find(card => card.dept === 'Service')[`${month.toLowerCase()}Goal`],
    achieved: cards.find(card => card.dept === 'Service')[`${month.toLowerCase()}Ach`],
  }));
  const partsData = months.map(month => ({
    month,
    goal: cards.find(card => card.dept === 'Parts')[`${month.toLowerCase()}Goal`],
    achieved: cards.find(card => card.dept === 'Parts')[`${month.toLowerCase()}Ach`],
  }));
  const accessoriesData = months.map(month => ({
    month,
    goal: cards.find(card => card.dept === 'Accessories')[`${month.toLowerCase()}Goal`],
    achieved: cards.find(card => card.dept === 'Accessories')[`${month.toLowerCase()}Ach`],
  }));

  const userGoalsData = userGoals.flatMap(userGoal =>
    months.map(month => ({
      month,
      goal: userGoal[`${month.toLowerCase()}Goal`],
      achieved: userGoal[`${month.toLowerCase()}Ach`],
    }))
  );
  let flattenedUserGoalsData = userGoalsData[0] ? userGoalsData : userGoalsData[0];

  const userChartData = userGoals[0];
  const chartData2 = [
    {
      month: "January",
      sales: calcPer(userChartData.janGoal, userChartData.janAch),
    },
    {
      month: "February",
      sales: calcPer(userChartData.febGoal, userChartData.febAch),
    },
    {
      month: "March",
      sales: calcPer(userChartData.marGoal, userChartData.marAch),
    },
    {
      month: "April",
      sales: calcPer(userChartData.aprGoal, userChartData.aprAch),
    },
    {
      month: "May",
      sales: calcPer(userChartData.mayGoal, userChartData.mayAch),
    },
    {
      month: "June",
      sales: calcPer(userChartData.junGoal, userChartData.junAch),
    },
    {
      month: "July",
      sales: calcPer(userChartData.julGoal, userChartData.julAch),
    },
    {
      month: "August",
      sales: calcPer(userChartData.augGoal, userChartData.augAch),
    },
    {
      month: "September",
      sales: calcPer(userChartData.sepGoal, userChartData.sepAch),
    },
    {
      month: "October",
      sales: calcPer(userChartData.octGoal, userChartData.octAch),
    },
    {
      month: "November",
      sales: calcPer(userChartData.novGoal, userChartData.novAch),
    },
    {
      month: "December",
      sales: calcPer(userChartData.decGoal, userChartData.decAch),
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
  console.log(chartData2, 'chartData2')
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
                                  Goal
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
                                  Achieved
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
              <Bar dataKey="sales" fill="var(--color-sales)" radius={4} />
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
                        <RoundProgMiddle goal={goal} />
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
              </div>
            </TabsContent>
            <TabsContent value="Statistics">
              <div className='grid grid-cols-1 mx-auto mt-5'>
                <StatsTable
                  statsData={statsData}
                  comsRecords={comsRecords}
                />

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
          <div className='mx-auto mt-5'>
            <div className='mb-3'>
              <h2 className='text-left mt-3 mb-2 text-2xl '>Weekly Breakdown Of Sales</h2>
              <p className='text-left mb-5'>Greater clarity on when your sales happened through the year.</p>
            </div>
            <WeeklkyChart
              userChartData={userChartData}
              salesRecords={finances}
            />
          </div>
        </TabsContent>
        <TabsContent value="dept">
          <div className='flex justify-between'>
            <div>
              <h2 className='text-left mt-3 mb-2 text-2xl '>Dept Leaderboard</h2>
              <p className='text-left mb-5'>100 meaning that you achieved 100% of your goal or depts goal.</p>
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
                  <Tabs defaultValue="Sales" className="w-full">
                    <TabsList className='justify-self-center'>
                      <TabsTrigger value="Sales">Sales</TabsTrigger>
                      <TabsTrigger value="Service">Service</TabsTrigger>
                      <TabsTrigger value="Parts">Parts</TabsTrigger>
                      <TabsTrigger value="Accessories">Accessories</TabsTrigger>
                    </TabsList>
                    <TabsContent value="Sales">
                      <Form method='post'>

                        <div className="p-4 pb-0">
                          <div className="flex items-center justify-center space-x-2">
                            <div className='grid grid-cols-1'>
                              <input type='hidden' name='intent' value='saveStoreGoals' />
                              <Table className="mt-2">
                                <TableCaption>Sales Dept Goals</TableCaption>
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
                                      Goal
                                    </TableCell>
                                    {salesData.map((item, index) => (
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
                                        value='saveStoreGoals'
                                        className='bg-primary' >
                                        Save
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell className="font-medium">
                                      Achieved
                                    </TableCell>
                                    {salesData.map((item, index) => (
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
                    </TabsContent>
                    <TabsContent value="Service">
                      <Form method='post'>

                        <div className="p-4 pb-0">
                          <div className="flex items-center justify-center space-x-2">
                            <div className='grid grid-cols-1'>
                              <input type='hidden' name='intent' value='saveStoreGoals' />
                              <Table className="mt-2">
                                <TableCaption>Sales Dept Goals</TableCaption>
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
                                      Goal
                                    </TableCell>
                                    {serviceData.map((item, index) => (
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
                                        value='saveServiceGoals'
                                        className='bg-primary' >
                                        Save
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell className="font-medium">
                                      Achieved
                                    </TableCell>
                                    {serviceData.map((item, index) => (
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
                    </TabsContent>
                    <TabsContent value="Parts">
                      <Form method='post'>

                        <div className="p-4 pb-0">
                          <div className="flex items-center justify-center space-x-2">
                            <div className='grid grid-cols-1'>
                              <input type='hidden' name='intent' value='saveStoreGoals' />
                              <Table className="mt-2">
                                <TableCaption>Sales Dept Goals</TableCaption>
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
                                      Goal
                                    </TableCell>
                                    {partsData.map((item, index) => (
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
                                        value='savePartsGoals'
                                        className='bg-primary' >
                                        Save
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell className="font-medium">
                                      Achieved
                                    </TableCell>
                                    {partsData.map((item, index) => (
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
                    </TabsContent>
                    <TabsContent value="Accessories">
                      <Form method='post'>

                        <div className="p-4 pb-0">
                          <div className="flex items-center justify-center space-x-2">
                            <div className='grid grid-cols-1'>
                              <input type='hidden' name='intent' value='saveStoreGoals' />
                              <Table className="mt-2">
                                <TableCaption>Sales Dept Goals</TableCaption>
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
                                      Goal
                                    </TableCell>
                                    {accessoriesData.map((item, index) => (
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
                                        value='saveAccessoriesGoals'
                                        className='bg-primary' >
                                        Save
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell className="font-medium">
                                      Achieved
                                    </TableCell>
                                    {accessoriesData.map((item, index) => (
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
                    </TabsContent>
                  </Tabs>
                </div>
              </DrawerContent>
            </Drawer>
          </div>

          <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <BarChart accessibilityLayer data={chartData}>
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
              <Bar dataKey="sales" fill="var(--color-sales)" radius={4} />
              <Bar dataKey="service" fill="var(--color-service)" radius={4} />
              <Bar dataKey="parts" fill="var(--color-parts)" radius={4} />
              <Bar dataKey="accessories" fill="var(--color-accessories)" radius={4} />
            </BarChart>
          </ChartContainer>


        </TabsContent >
      </Tabs >
    </div >
  )
}


const RoundProg = ({ goal }) => {
  const percentage = calcPer(goal.goal, goal.achieved)
  const needDominantBaselineFix = true;
  const goalCreatedAt = moment(goal.createdAt);
  const currentDate = new Date();
  const oneDay = 24 * 60 * 60 * 1000;
  const daysPassed = Math.floor((currentDate - goalCreatedAt.toDate()) / oneDay);
  const remainingDays = Number(goal.days) - daysPassed;
  return (
    <div className='flex items-center'>
      <div className="grid items-center gap-2  m-4">

        <div className="grid flex-1 auto-rows-min gap-0.5">
          <div className='grid col-span2'>
            <div className='grid grid-cols-1'>
              <div className='flex items-center'>
                <EditableText
                  value={goal.goal}
                  fieldName="goal"
                  inputClassName="border border-border rounded-lg  text-foreground bg-background w-[50px]"
                  buttonClassName="flex items-baseline gap-1 text-xl font-bold tabular-nums leading-nonetext-foreground"
                  buttonLabel={`Edit goal`}
                  inputLabel="Edit goal"
                >
                  <input type="hidden" name="intent" value='updateGoal' />
                  <input type="hidden" name="id" value={goal.id} />
                </EditableText>
                <p> / </p>
                <EditableText
                  value={goal.achieved}
                  fieldName="achieved"
                  inputClassName="border border-border rounded-lg  text-foreground bg-background w-[50px]"
                  buttonClassName="flex items-baseline gap-1 text-xl font-bold tabular-nums leading-none text-foreground"
                  buttonLabel={`Edit goal achieved`}
                  inputLabel="Edit goal achieved"
                >
                  <input type="hidden" name="intent" value='updateAchieved' />
                  <input type="hidden" name="id" value={goal.id} />
                </EditableText>
              </div>
              <p>{Number(remainingDays)} days remaining</p>
            </div>
          </div>
        </div>
        <div className="grid flex-1 auto-rows-min gap-0.5">
          <div className="flex items-baseline gap-1 text-xl font-bold tabular-nums leading-none">
            <EditableText
              value={goal.description}
              fieldName="description"
              inputClassName="border border-border rounded-lg  text-foreground bg-background p "
              buttonClassName="text-sm text-muted-foreground"
              buttonLabel={`Edit goal description`}
              inputLabel="Edit goal description"
            >
              <input type="hidden" name="intent" value='updateGoalDescription' />
              <input type="hidden" name="id" value={goal.id} />
            </EditableText>
          </div>
        </div>
      </div>
      <ChartContainer
        config={{
          calls: {
            label: goal.title,
            color: "hsl(var(--chart-1))",
          },

        }}
        className="mx-auto aspect-square w-full max-w-[100px] relative"
      >
        <RadialBarChart
          margin={{
            left: -10,
            right: -10,
            top: -10,
            bottom: -10,
          }}
          data={[
            {
              activity: goal.title,
              value: percentage,
              fill: "#0090ff",
            },

          ]}
          innerRadius="70%" // Adjust this value as needed
          outerRadius="80%" // Adjust this value as needed
          barSize={15} // Adjust this value as needed
          startAngle={90}
          endAngle={450}
        >
          <PolarAngleAxis
            type="number"
            domain={[0, 100]}
            dataKey="value"
            tick={false}
          />
          <p>test</p>

          <RadialBar dataKey="value" background cornerRadius={5} />
        </RadialBarChart>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <p>{percentage}%</p>
        </div>
      </ChartContainer>






    </div>
  )
}
const RoundProgMiddle = ({ goal }) => {
  const percentage = calcPer(goal.goal, goal.achieved)
  const needDominantBaselineFix = true;
  const goalCreatedAt = moment(goal.createdAt);
  const currentDate = new Date();
  const oneDay = 24 * 60 * 60 * 1000;
  const daysPassed = Math.floor((currentDate - goalCreatedAt.toDate()) / oneDay);
  const remainingDays = Number(goal.days) - daysPassed;
  return (
    <div className='flex items-center'>
      <div className="grid grid-cols-1 items-center gap-2  m-4">
        <p className='opacity-0 transition-opacity group-hover:opacity-100  text-xl font-bold tabular-nums leading-none text-foreground'>{percentage}%</p>
        <EditableText
          value={goal.title}
          fieldName="title"
          inputClassName="opacity-0 transition-opacity group-hover:opacity-100   border border-border rounded-lg text-xl text-foreground bg-background w-[50px]"
          buttonClassName="opacity-0 transition-opacity group-hover:opacity-100   flex items-baseline gap-1 text-xl font-bold tabular-nums leading-none text-muted-foreground text-center"
          buttonLabel={`Edit title`}
          inputLabel="Edit title"
        >
          <input type="hidden" name="intent" value='updateTitle' />
          <input type="hidden" name="id" value={goal.id} />
        </EditableText>
        <p className='opacity-0 transition-opacity group-hover:opacity-100 text-sm text-muted-foreground '>
          {goal.description}
        </p>
      </div>
      <ChartContainer config={{ calls: { label: goal.title, color: "hsl(var(--chart-1))", }, }} className="mx-auto aspect-square w-full max-w-[150px] relative"      >
        <RadialBarChart margin={{ left: -10, right: -10, top: -10, bottom: -10, }}
          data={[
            {
              activity: goal.title,
              value: percentage,
              fill: "#0090ff",
            },
          ]}
          innerRadius="70%" // Adjust this value as needed
          outerRadius="80%" // Adjust this value as needed
          barSize={30} // Adjust this value as needed
          startAngle={90}
          endAngle={450}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} dataKey="value" tick={false} />
          <RadialBar dataKey="value" background cornerRadius={5} />
        </RadialBarChart>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <div className='grid grid-cols-1'>
            <p className='text-muted-foreground text-lg'>{goal.title}</p>
            <div className='flex items-center'>
              <EditableText
                value={goal.goal}
                fieldName="goal"
                inputClassName="border border-border rounded-lg  text-xl  text-foreground bg-background w-[30px]"
                buttonClassName="flex items-baseline gap-1 text-xl font-bold tabular-nums leading-none text-foreground"
                buttonLabel={`Edit goal`}
                inputLabel="Edit goal"
              >
                <input type="hidden" name="intent" value='updateGoal' />
                <input type="hidden" name="id" value={goal.id} />
              </EditableText>
              <p> / </p>
              <EditableText
                value={goal.achieved}
                fieldName="achieved"
                inputClassName="border border-border rounded-lg  text-xl  text-foreground bg-background w-[30px]"
                buttonClassName="flex items-baseline gap-1 text-xl font-bold tabular-nums leading-none text-foreground"
                buttonLabel={`Edit goal achieved`}
                inputLabel="Edit goal achieved"
              >
                <input type="hidden" name="intent" value='updateAchieved' />
                <input type="hidden" name="id" value={goal.id} />
              </EditableText>
            </div>
            <p>{Number(remainingDays)} days</p>
          </div>
        </div>
      </ChartContainer>
    </div>
  )
}

export function Charts({ userChartData }) {
  return (
    <div className="chart-wrapper mx-auto flex max-w-[80rem] flex-col flex-wrap items-start justify-center gap-6 p-6 sm:flex-row sm:p-8">
      <div className="grid w-full gap-6 sm:grid-cols-2 lg:max-w-[22rem] lg:grid-cols-1 xl:max-w-[25rem]">
        <Card
          className="lg:max-w-md" x-chunk="charts-01-chunk-0"
        >
          <CardHeader className="space-y-0 pb-2">
            <CardDescription>Today</CardDescription>
            <CardTitle className="text-4xl tabular-nums">
              20{" "}
              <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">
                quotes
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                steps: {
                  label: "Calls",
                  color: "hsl(var(--chart-1))",
                },
              }}
            >
              <BarChart
                accessibilityLayer
                margin={{
                  left: -4,
                  right: -4,
                }}
                data={[
                  {
                    date: "2024-01-01",
                    quotes: 20,
                  },
                  {
                    date: "2024-01-02",
                    quotes: 25,
                  },
                  {
                    date: "2024-01-03",
                    quotes: 30,
                  },
                  {
                    date: "2024-01-04",
                    quotes: 18,
                  },
                  {
                    date: "2024-01-05",
                    quotes: 15,
                  },
                  {
                    date: "2024-01-06",
                    quotes: 17,
                  },
                  {
                    date: "2024-01-07",
                    quotes: 6,
                  },
                ]}
              >
                <Bar
                  dataKey="quotes"
                  fill="var(--color-steps)"
                  radius={5}
                  fillOpacity={0.6}
                  activeBar={<Rectangle fillOpacity={0.8} />}
                />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={4}
                  tickFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      weekday: "short",
                    })
                  }}
                />
                <ChartTooltip
                  defaultIndex={2}
                  content={
                    <ChartTooltipContent
                      hideIndicator
                      labelFormatter={(value) => {
                        return new Date(value).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      }}
                    />
                  }
                  cursor={false}
                />
                <ReferenceLine
                  y={19}
                  stroke="hsl(var(--muted-foreground))"
                  strokeDasharray="3 3"
                  strokeWidth={1}
                >
                  <Label
                    position="insideBottomLeft"
                    value="Average Quotes"
                    offset={10}
                    fill="hsl(var(--foreground))"
                  />
                  <Label
                    position="insideTopLeft"
                    value="19"
                    className="text-lg"
                    fill="hsl(var(--foreground))"
                    offset={10}
                    startOffset={100}
                  />
                </ReferenceLine>
              </BarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-1">
            <CardDescription>
              Over the past 7 days, you quoted{" "}
              <span className="font-medium text-foreground">131</span> customers.
            </CardDescription>
            <CardDescription>
              You need{" "}
              <span className="font-medium text-foreground">19</span> more
              quotes to reach your goal.
            </CardDescription>
          </CardFooter>
        </Card>
        <Card
          className="flex flex-col lg:max-w-md" x-chunk="charts-01-chunk-1"
        >
          <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2 [&>div]:flex-1">
            <div className='flex justify-between'>
              <div>
                <h2 className='text-left mt-3 mb-2 text-2xl '>Who's what?</h2>
                <p className='text-left mb-5'>90 day breakdown of active, duplicate, invalid, lost, forgotten.</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex flex-1 items-center">
            <ChartContainer
              config={{
                active: {
                  label: "Active",
                  color: "#0090ff",
                },
                duplicate: {
                  label: "Duplicate",
                  color: "#30a46c",
                },
                invalid: {
                  label: "Invalid",
                  color: "#ffc53d",
                },
                lost: {
                  label: "lost",
                  color: "#e54d2e",
                },
                forgotten: {
                  label: "Forgotten",
                  color: "#6E56CF",
                },
              }}
              className="min-h-[200px] w-full">
              <BarChart
                accessibilityLayer
                data={[
                  {
                    month: "30 Days",
                    forgotten: 25,
                    active: 100,
                    invalid: 20,
                    duplicate: 18,
                    lost: 25,
                  },
                  {
                    month: "60 Days",
                    forgotten: 25,
                    active: 100,
                    invalid: 20,
                    duplicate: 18,
                    lost: 25,
                  },
                  {
                    month: "90 Days",
                    forgotten: 25,
                    active: 100,
                    invalid: 20,
                    duplicate: 18,
                    lost: 25,
                  },
                ]}
              >
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
                <Bar dataKey="active" fill="var(--color-active)" radius={4} />
                <Bar dataKey="invalid" fill="var(--color-invalid)" radius={4} />
                <Bar dataKey="duplicate" fill="var(--color-duplicate)" radius={4} />
                <Bar dataKey="lost" fill="var(--color-lost)" radius={4} />
                <Bar dataKey="forgotten" fill="var(--color-forgotten)" radius={4} />

              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
      <div className="grid w-full flex-1 gap-6 lg:max-w-xs">

        <Card
          className="max-w-xs" x-chunk="charts-01-chunk-3"
        >
          <CardHeader className="p-4 pb-0">
            <CardTitle>Time Spent On Deals</CardTitle>
            <CardDescription>
              From first quote to out the door.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-row items-baseline gap-4 p-4 pt-0">
            <div className="flex items-baseline gap-1 text-3xl font-bold tabular-nums leading-none">
              12.5
              <span className="text-sm font-normal text-muted-foreground">
                days/deal
              </span>
            </div>
            <ChartContainer
              config={{
                steps: {
                  label: "Steps",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="ml-auto w-[72px]"
            >
              <BarChart
                accessibilityLayer
                margin={{
                  left: 0,
                  right: 0,
                  top: 0,
                  bottom: 0,
                }}
                data={[
                  {
                    date: "2024-01-01",
                    steps: 2000,
                  },
                  {
                    date: "2024-01-02",
                    steps: 2100,
                  },
                  {
                    date: "2024-01-03",
                    steps: 2200,
                  },
                  {
                    date: "2024-01-04",
                    steps: 1300,
                  },
                  {
                    date: "2024-01-05",
                    steps: 1400,
                  },
                  {
                    date: "2024-01-06",
                    steps: 2500,
                  },
                  {
                    date: "2024-01-07",
                    steps: 1600,
                  },
                ]}
              >
                <Bar
                  dataKey="steps"
                  fill="var(--color-steps)"
                  radius={2}
                  fillOpacity={0.2}
                  activeIndex={6}
                  activeBar={<Rectangle fillOpacity={0.8} />}
                />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={4}
                  hide
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card
          className="max-w-xs" x-chunk="charts-01-chunk-4"
        >
          <CardContent className="flex gap-4 p-4 pb-2">
            <ChartContainer
              config={{
                booked: {
                  label: "Booked",
                  color: "#0090ff",
                },
                showed: {
                  label: "Showed",
                  color: "#30a46c",
                },
                cancelled: {
                  label: "Cancelled",
                  color: "#ffc53d",
                },
              }}
              className="h-[140px] w-full"
            >
              <BarChart
                margin={{
                  left: 0,
                  right: 0,
                  top: 0,
                  bottom: 10,
                }}
                data={[
                  {
                    activity: "booked",
                    value: 18,
                    label: "8",
                    fill: "var(--color-booked)",
                  },
                  {
                    activity: "showed",
                    value: 15,
                    label: "15",
                    fill: "var(--color-showed)",
                  },
                  {
                    activity: "cancelled",
                    value: 3,
                    label: "3",
                    fill: "var(--color-cancelled)",
                  },
                ]}
                layout="vertical"
                barSize={32}
                barGap={2}
              >
                <XAxis type="number" dataKey="value" hide />
                <YAxis
                  dataKey="activity"
                  type="category"
                  tickLine={false}
                  tickMargin={4}
                  axisLine={false}
                  className="capitalize"
                />
                <Bar dataKey="value" radius={5}>
                  <LabelList
                    position="insideLeft"
                    dataKey="label"
                    fill="white"
                    offset={8}
                    fontSize={12}
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex flex-row border-t p-4">
            <div className="flex w-full items-center gap-2">
              <div className="grid flex-1 auto-rows-min gap-0.5">
                <div className="text-xs text-muted-foreground">Booked</div>
                <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
                  18
                  <span className="text-sm font-normal text-muted-foreground">
                    / 30 days
                  </span>
                </div>
              </div>
              <Separator orientation="vertical" className="mx-2 h-10 w-px" />
              <div className="grid flex-1 auto-rows-min gap-0.5">
                <div className="text-xs text-muted-foreground">Showed</div>
                <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
                  15
                  <span className="text-sm font-normal text-muted-foreground">
                    / 30 days
                  </span>
                </div>
              </div>
              <Separator orientation="vertical" className="mx-2 h-10 w-px" />
              <div className="grid flex-1 auto-rows-min gap-0.5">
                <div className="text-xs text-muted-foreground">Cancelled</div>
                <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
                  3
                  <span className="text-sm font-normal text-muted-foreground">
                    / 30 days
                  </span>
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>
        <Card
          className="max-w-xs" x-chunk="charts-01-chunk-6"
        >
          <CardHeader className="p-4 pb-0">
            <CardTitle>Active Energy</CardTitle>
            <CardDescription>
              You're burning an average of 754 calories per day. Good job!
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-row items-baseline gap-4 p-4 pt-2">
            <div className="flex items-baseline gap-2 text-3xl font-bold tabular-nums leading-none">
              1,254
              <span className="text-sm font-normal text-muted-foreground">
                kcal/day
              </span>
            </div>
            <ChartContainer
              config={{
                calories: {
                  label: "Calories",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="ml-auto w-[64px]"
            >
              <BarChart
                accessibilityLayer
                margin={{
                  left: 0,
                  right: 0,
                  top: 0,
                  bottom: 0,
                }}
                data={[
                  {
                    date: "2024-01-01",
                    calories: 354,
                  },
                  {
                    date: "2024-01-02",
                    calories: 514,
                  },
                  {
                    date: "2024-01-03",
                    calories: 345,
                  },
                  {
                    date: "2024-01-04",
                    calories: 734,
                  },
                  {
                    date: "2024-01-05",
                    calories: 645,
                  },
                  {
                    date: "2024-01-06",
                    calories: 456,
                  },
                  {
                    date: "2024-01-07",
                    calories: 345,
                  },
                ]}
              >
                <Bar
                  dataKey="calories"
                  fill="var(--color-calories)"
                  radius={2}
                  fillOpacity={0.2}
                  activeIndex={6}
                  activeBar={<Rectangle fillOpacity={0.8} />}
                />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={4}
                  hide
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card
          className="max-w-xs" x-chunk="charts-01-chunk-7"
        >
          <CardHeader className="space-y-0 pb-0">
            <CardDescription>Time in Bed</CardDescription>
            <CardTitle className="flex items-baseline gap-1 text-4xl tabular-nums">
              8
              <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">
                hr
              </span>
              35
              <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">
                min
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ChartContainer
              config={{
                time: {
                  label: "Time",
                  color: "hsl(var(--chart-2))",
                },
              }}
            >
              <AreaChart
                accessibilityLayer
                data={[
                  {
                    date: "2024-01-01",
                    time: 8.5,
                  },
                  {
                    date: "2024-01-02",
                    time: 7.2,
                  },
                  {
                    date: "2024-01-03",
                    time: 8.1,
                  },
                  {
                    date: "2024-01-04",
                    time: 6.2,
                  },
                  {
                    date: "2024-01-05",
                    time: 5.2,
                  },
                  {
                    date: "2024-01-06",
                    time: 8.1,
                  },
                  {
                    date: "2024-01-07",
                    time: 7.0,
                  },
                ]}
                margin={{
                  left: 0,
                  right: 0,
                  top: 0,
                  bottom: 0,
                }}
              >
                <XAxis dataKey="date" hide />
                <YAxis domain={["dataMin - 5", "dataMax + 2"]} hide />
                <defs>
                  <linearGradient id="fillTime" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-time)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-time)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <Area
                  dataKey="time"
                  type="natural"
                  fill="url(#fillTime)"
                  fillOpacity={0.4}
                  stroke="var(--color-time)"
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                  formatter={(value) => (
                    <div className="flex min-w-[120px] items-center text-xs text-muted-foreground">
                      Time in bed
                      <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                        {value}
                        <span className="font-normal text-muted-foreground">
                          hr
                        </span>
                      </div>
                    </div>
                  )}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
      <div className="grid w-full flex-1 gap-6">
        <Card className="max-w-[30rem]" x-chunk="charts-01-chunk-5"        >
          <CardHeader>
            <CardTitle>Next Appt</CardTitle>
            <CardDescription>
              Time till next call per client
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-4 p-4">
            <div className="grid items-center gap-2">
              <div className="grid flex-1 auto-rows-min gap-0.5">
                <div className="text-sm text-muted-foreground">3 Days</div>
                <div className="flex items-baseline gap-1 text-xl font-bold tabular-nums leading-none">
                  50
                  <span className="text-sm font-normal text-muted-foreground">
                    clients
                  </span>
                </div>
              </div>
              <div className="grid flex-1 auto-rows-min gap-0.5">
                <div className="text-sm text-muted-foreground">7 Days</div>
                <div className="flex items-baseline gap-1 text-xl font-bold tabular-nums leading-none">
                  25
                  <span className="text-sm font-normal text-muted-foreground">
                    clients
                  </span>
                </div>
              </div>
              <div className="grid flex-1 auto-rows-min gap-0.5">
                <div className="text-sm text-muted-foreground">14 Days</div>
                <div className="flex items-baseline gap-1 text-xl font-bold tabular-nums leading-none">
                  20
                  <span className="text-sm font-normal text-muted-foreground">
                    clients
                  </span>
                </div>
              </div>
              <div className="grid flex-1 auto-rows-min gap-0.5">
                <div className="text-sm text-muted-foreground">30 Days</div>
                <div className="flex items-baseline gap-1 text-xl font-bold tabular-nums leading-none">
                  10
                  <span className="text-sm font-normal text-muted-foreground">
                    clients
                  </span>
                </div>
              </div>
              <div className="grid flex-1 auto-rows-min gap-0.5">
                <div className="text-sm text-muted-foreground">60+ Days</div>
                <div className="flex items-baseline gap-1 text-xl font-bold tabular-nums leading-none">
                  40
                  <span className="text-sm font-normal text-muted-foreground">
                    clients
                  </span>
                </div>
              </div>
            </div>
            <ChartContainer
              config={{
                '3Days': {
                  label: "3 Days",
                  color: "#0090ff",
                },
                '7Days': {
                  label: "7 Days",
                  color: "#30a46c",
                },
                '14Days': {
                  label: "14 Days",
                  color: "#ffc53d",
                },
                '30Days': {
                  label: "30 Days",
                  color: "#e54d2e",
                },
                '60Days': {
                  label: "60+ Days",
                  color: "#6E56CF",
                },
              }}
              className="mx-auto aspect-square w-full max-w-[80%]"
            >
              <PieChart
                margin={{
                  left: -10,
                  right: -10,
                  top: -10,
                  bottom: -10,
                }}
                width={900}
                height={900}
                innerRadius="20%"
                barSize={24}
                startAngle={90}
                endAngle={450}
              >
                <Pie
                  data={[
                    {
                      name: "3Days",
                      value: 50,
                      label: "3",
                      fill: "var(--color-3Days)",
                    },
                    {
                      name: "7Days",
                      value: 25,
                      label: "7",
                      fill: "var(--color-7Days)",
                    },
                    {
                      name: "14Days",
                      value: 20,
                      label: "14",
                      fill: "var(--color-14Days)",
                    },
                    {
                      name: "30Days",
                      value: 10,
                      label: "30",
                      fill: "var(--color-30Days)",
                    },
                    {
                      name: "60Days",
                      value: 40,
                      label: "60+",
                      fill: "var(--color-60Days)",
                    },
                  ]}
                  dataKey="value"
                  nameKey="name"
                  cx={120}
                  cy={100}
                  innerRadius={25}
                  outerRadius={80}
                  paddingAngle={4}
                  fill="#8884d8"
                  radius={45}

                >
                  <LabelList
                    position="inside"
                    dataKey="label"
                    fill="white"
                    offset={8}
                    fontSize={12}
                  />
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart >
            </ChartContainer>
          </CardContent>
        </Card>
        <Card
          className="max-w-[30rem]" x-chunk="charts-01-chunk-2"
        >
          <CardHeader>
            <CardTitle>Progress</CardTitle>
            <CardDescription>
              You're average more stats a day this year than last year.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid auto-rows-min gap-2">
              <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
                2024
                <span className="text-sm font-normal text-muted-foreground">
                  stats/working day
                </span>
              </div>
              <ChartContainer
                config={{
                  calls: {
                    label: "Calls",
                    color: "#0090ff",
                  },
                  quotes: {
                    label: "Quotes",
                    color: "#30a46c",
                  },
                  sold: {
                    label: "Sold",
                    color: "#ffc53d",
                  },
                  delivered: {
                    label: "Delivered",
                    color: "#e54d2e",
                  },
                }}
                className="aspect-auto h-[128px] w-full"
              >
                <BarChart
                  accessibilityLayer
                  layout="vertical"
                  margin={{
                    left: 0,
                    top: 0,
                    right: 0,
                    bottom: 0,
                  }}
                  data={[
                    {
                      type: "calls",
                      value: 125,
                      label: "125",
                      fill: "var(--color-calls)",
                    },
                    {
                      type: "Quotes",
                      value: 15,
                      label: "15",
                      fill: "var(--color-quotes)",
                    },
                    {
                      type: "Sold",
                      value: 1.09,
                      label: "1.09",
                      fill: "var(--color-sold)",
                    },
                    {
                      type: "Delivered",
                      value: 1.05,
                      label: "1.05",
                      fill: "var(--color-delivered)",
                    },
                  ]}
                >
                  <Bar dataKey="value" radius={5}>
                    <LabelList
                      position="right"
                      dataKey="label"
                      fill="white"
                      offset={8}
                      fontSize={12}
                    />
                  </Bar>

                  <ChartTooltip content={<ChartTooltipContent />} />
                  <YAxis
                    dataKey="type"
                    type="category"
                    tickCount={1}
                    tickLine={false}
                    tickMargin={4}
                    axisLine={false}
                  />
                  <XAxis dataKey='value' type="number" hide />

                </BarChart>
              </ChartContainer>
            </div>
            <div className="grid auto-rows-min gap-2">
              <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
                2023
                <span className="text-sm font-normal text-muted-foreground">
                  stats/working day
                </span>
              </div>
              <ChartContainer
                config={{
                  calls: {
                    label: "Calls",
                    color: "#0090ff",
                  },
                  quotes: {
                    label: "Quotes",
                    color: "#30a46c",
                  },
                  sold: {
                    label: "Sold",
                    color: "#ffc53d",
                  },
                  delivered: {
                    label: "Delivered",
                    color: "#e54d2e",
                  },
                }}
                className="aspect-auto h-[128px] w-full"
              >
                <BarChart
                  accessibilityLayer
                  layout="vertical"
                  margin={{
                    left: 0,
                    top: 0,
                    right: 0,
                    bottom: 0,
                  }}
                  data={[
                    {
                      type: "calls",
                      value: 80,
                      label: "80",
                      fill: "var(--color-calls)",
                    },
                    {
                      type: "Quotes",
                      value: 11,
                      label: "11",
                      fill: "var(--color-quotes)",
                    },
                    {
                      type: "Sold",
                      value: 0.8,
                      label: "0.08",
                      fill: "var(--color-sold)",
                    },
                    {
                      type: "Delivered",
                      value: 0.7,
                      label: "0.7",
                      fill: "var(--color-delivered)",
                    },
                  ]}
                >
                  <Bar dataKey="value" radius={5}>
                    <LabelList
                      position="right"
                      dataKey="label"
                      fill="white"
                      offset={8}
                      fontSize={12}
                    />
                  </Bar>

                  <ChartTooltip content={<ChartTooltipContent />} />
                  <YAxis
                    dataKey="type"
                    type="category"
                    tickCount={1}
                    tickLine={false}
                    tickMargin={4}
                    axisLine={false}
                  />
                  <XAxis dataKey='value' type="number" hide />

                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
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

function WeeklkyChart({ userChartData, salesRecords }) {

  const monthlyGoals = {
    janGoal: userChartData.janGoal,
    febGoal: userChartData.febGoal,
    marGoal: userChartData.marGoal,
    aprGoal: userChartData.aprGoal,
    mayGoal: userChartData.mayGoal,
    junGoal: userChartData.junGoal,
    julGoal: userChartData.julGoal,
    augGoal: userChartData.augGoal,
    sepGoal: userChartData.sepGoal,
    octGoal: userChartData.octGoal,
    novGoal: userChartData.novGoal,
    decGoal: userChartData.decGoal,
  };
  const salesRecords2 = [
    { sold: '2024-01-05' },
    { sold: '2024-01-05' },
    { sold: '2024-01-12' },
    { sold: '2024-02-03' },
    { sold: '2024-02-03' },
    { sold: '2024-02-12' },
    { sold: '2024-02-18' },
    { sold: '2024-02-27' },
    { sold: '2024-03-02' },
    { sold: '2024-03-02' },
    { sold: '2024-03-12' },
    { sold: '2024-03-12' },
  ];
  console.log(salesRecords2, monthlyGoals, 'monthlygoals')

  const getWeekOfMonth = (date) => {
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const dayOfMonth = date.getDate();
    return Math.ceil((dayOfMonth + start.getDay()) / 7);
  };
  const weeklySales = {};

  salesRecords2.forEach(record => {
    const date = new Date(record.sold);
    const month = date.toLocaleString('default', { month: 'short' }).toLowerCase();
    const weekOfMonth = getWeekOfMonth(date);
    const key = `${month} Week ${weekOfMonth}`;

    if (!weeklySales[key]) {
      weeklySales[key] = 0;
    }

    weeklySales[key]++;
  });

  console.log(salesRecords, userChartData, '1')

  console.log('3')
  const calculateWeeklyData = (monthlyGoals, weeklySales) => {
    const weeklyData = [];

    Object.entries(monthlyGoals).forEach(([key, monthlyGoal]) => {
      const month = key.replace('Goal', '').toLowerCase();
      const weeklyGoal = monthlyGoal / 4;

      for (let week = 1; week <= 4; week++) {
        const weekKey = `${month} Week ${week}`;
        const sales = weeklySales[weekKey] || 0;
        const percentage = calcPer(weeklyGoal, sales);

        weeklyData.push({
          week: weekKey,
          goal: weeklyGoal,
          sales,
          percentage
        });
      }
    });
    return weeklyData;
  };

  const weeklyData = calculateWeeklyData(monthlyGoals, weeklySales);
  console.log(weeklyData, 'weeklydataS')


  return (
    <div>
      <ChartContainer config={chartConfigSales} className="min-h-[200px] w-full">
        <BarChart accessibilityLayer data={weeklyData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="week"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <YAxis
            type="number"
            domain={[0, 100]}
            ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="percentage" fill='#0090ff'
            radius={4} />
        </BarChart>
      </ChartContainer>
    </div>
  )
}
