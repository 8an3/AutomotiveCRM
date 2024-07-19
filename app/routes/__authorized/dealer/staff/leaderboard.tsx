import { json, type ActionFunction, type LoaderFunction } from '@remix-run/node';
import { getSession, commitSession } from '~/sessions/auth-session.server';
import { GetUser } from '~/utils/loader.server';
import financeFormSchema from '~/overviewUtils/financeFormSchema';
import { Form, Link, useLoaderData, useLocation, Await, useFetcher, useSubmit, useNavigate } from '@remix-run/react';
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
import { Bar, BarChart, CartesianGrid, Legend, RadialBar, RadialBarChart, Tooltip, XAxis, YAxis } from "recharts"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"
import { Button, Input } from '~/components';
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

const chartConfigSales = {
  sales: {
    label: "Sales",
    color: "#0090ff",
  },

} satisfies ChartConfig


const CircleProgress = ({ value, size, color }) => {
  const radius = size === 'lg' ? 60 : 30;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  const circleStyles = {
    width: size === 'lg' ? 125 : 63,
    height: size === 'lg' ? 125 : 63,
  };

  return (
    <div style={circleStyles}>
      <svg width="100%" height="100%" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke="#09090b"
          strokeWidth="10"
          fill="transparent"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke={color}
          strokeWidth="10"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 50 50)"
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
          className='rounded-full'

        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dy=".3em"
          fontSize="20"
          fill={color}
        >
          {`${value}%`}
        </text>
      </svg>
    </div>
  );
};



export async function action({ request, params }: ActionFunction) {
  const formPayload = Object.fromEntries(await request.formData())
  const formData = financeFormSchema.parse(formPayload);
  const session = await getSession(request.headers.get('Cookie'));
  const email = session.get('email')
  const user = await GetUser(email)
  return json({ user });
};

export async function loader({ request, params }: LoaderAction) {
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
      positions: { select: { position: true } },
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
      role: { select: { symbol: true, name: true } },

      userGoals: {
        select: {
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


      thirtyDayGoals: { select: { userEmail: true, year: true, date: true, title: true, goal: true, actualSold: true, expired: true } },

      sevenDayGoals: { select: { userEmail: true, year: true, date: true, title: true, goal: true, actualSold: true, expired: true } },
    },
  })
  const deptGoals = await prisma.deptGoals.findMany({ where: { year: '2024' } }); // chang eto get the current year
  const userGoals = await prisma.userGoals.findMany({ where: { userEmail: email, year: '2024' } });
  const thirtyDayGoals = user.thirtyDayGoals
  const sevenDayGoals = user.sevenDayGoals

  return json({
    user, deptGoals, userGoals, thirtyDayGoals, sevenDayGoals
  });
};

const calcPer = (goal, achiev) => {
  if (goal === 0) return 0;
  return Math.round((achiev / goal) * 100);
};

export default function NewFile() {
  const { user, deptGoals, userGoals, thirtyDayGoals, sevenDayGoals } = useLoaderData()

  const cards = deptGoals
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  /**[
      {
        dept: 'Sales', year: '2024',
        janGoal: 15, janAch: 10,
        febGoal: 12, febAch: 5,
        marGoal: 20, marAch: 15,
        aprGoal: 18, aprAch: 12,
        mayGoal: 16, mayAch: 10,
        junGoal: 14, junAch: 8,
        julGoal: 17, julAch: 9,
        augGoal: 19, augAch: 11,
        sepGoal: 13, sepAch: 7,
        octGoal: 20, octAch: 18,
        novGoal: 15, novAch: 13,
        decGoal: 18, decAch: 16,
      },
      {
        dept: 'Service', year: '2024',
        janGoal: 10, janAch: 8,
        febGoal: 12, febAch: 10,
        marGoal: 15, marAch: 13,
        aprGoal: 18, aprAch: 14,
        mayGoal: 16, mayAch: 12,
        junGoal: 14, junAch: 10,
        julGoal: 17, julAch: 15,
        augGoal: 19, augAch: 16,
        sepGoal: 13, sepAch: 11,
        octGoal: 15, octAch: 14,
        novGoal: 18, novAch: 16,
        decGoal: 20, decAch: 18,
      },
      {
        dept: 'Parts', year: '2024',
        janGoal: 10, janAch: 5,
        febGoal: 12, febAch: 6,
        marGoal: 15, marAch: 7,
        aprGoal: 17, aprAch: 8,
        mayGoal: 14, mayAch: 9,
        junGoal: 16, junAch: 10,
        julGoal: 18, julAch: 12,
        augGoal: 20, augAch: 14,
        sepGoal: 13, sepAch: 8,
        octGoal: 19, octAch: 16,
        novGoal: 15, novAch: 13,
        decGoal: 17, decAch: 14,
      },
      {
        dept: 'Accessories', year: '2024',
        janGoal: 10, janAch: 5,
        febGoal: 11, febAch: 6,
        marGoal: 13, marAch: 7,
        aprGoal: 14, aprAch: 8,
        mayGoal: 15, mayAch: 9,
        junGoal: 16, junAch: 10,
        julGoal: 18, julAch: 12,
        augGoal: 19, augAch: 13,
        sepGoal: 12, sepAch: 7,
        octGoal: 17, octAch: 15,
        novGoal: 15, novAch: 13,
        decGoal: 20, decAch: 18,
      },
    ]; */
  /** const chartData2 = [
     {
       month: "January",
       sales: calcPer(cards.find(goal => goal.dept === 'Sales'), cards.sales.janAch),
       parts: calcPer(cards.parts.janGoal, cards.parts.janAch),
       service: calcPer(cards.service.janGoal, cards.service.janAch),
       accessories: calcPer(cards.accessories.janGoal, cards.accessories.janAch),
     },
     {
       month: "February",
       sales: calcPer(cards.sales.febGoal, cards.sales.febAch),
       parts: calcPer(cards.parts.febGoal, cards.parts.febAch),
       service: calcPer(cards.service.febGoal, cards.service.febAch),
       accessories: calcPer(cards.accessories.febGoal, cards.accessories.febAch),
     },
     {
       month: "March",
       sales: calcPer(cards.sales.marGoal, cards.sales.marAch),
       parts: calcPer(cards.parts.marGoal, cards.parts.marAch),
       service: calcPer(cards.service.marGoal, cards.service.marAch),
       accessories: calcPer(cards.accessories.marGoal, cards.accessories.marAch),
     },
     {
       month: "April",
       sales: calcPer(cards.sales.aprGoal, cards.sales.aprAch),
       parts: calcPer(cards.parts.aprGoal, cards.parts.aprAch),
       service: calcPer(cards.service.aprGoal, cards.service.aprAch),
       accessories: calcPer(cards.accessories.aprGoal, cards.accessories.aprAch),
     },
     {
       month: "May",
       sales: calcPer(cards.sales.mayGoal, cards.sales.mayAch),
       parts: calcPer(cards.parts.mayGoal, cards.parts.mayAch),
       service: calcPer(cards.service.mayGoal, cards.service.mayAch),
       accessories: calcPer(cards.accessories.mayGoal, cards.accessories.mayAch),
     },
     {
       month: "June",
       sales: calcPer(cards.sales.junGoal, cards.sales.junAch),
       parts: calcPer(cards.parts.junGoal, cards.parts.junAch),
       service: calcPer(cards.service.junGoal, cards.service.junAch),
       accessories: calcPer(cards.accessories.junGoal, cards.accessories.junAch),
     },
   ];
  */
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

  const salesData = months.map(month => ({
    month,
    goal: cards.find(card => card.dept === 'Sales')[`${month.toLowerCase()}Goal`],
    achieved: cards.find(card => card.dept === 'Sales')[`${month.toLowerCase()}Ach`],
  }));
  const userGoalsData = userGoals.flatMap(userGoal =>
    months.map(month => ({
      month,
      goal: userGoal[`${month.toLowerCase()}Goal`],
      achieved: userGoal[`${month.toLowerCase()}Ach`],
    }))
  );
  const flattenedUserGoalsData = userGoalsData[0] ? userGoalsData : userGoalsData[0];

  const userChartData = userGoals[0]; // Use [0] if userGoals is an array

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

  console.log(userGoals, flattenedUserGoalsData, chartData2, 'userGoalsData')

  const restructureUserGoals = (userGoals) => {
    return [
      { month: 'jan', goal: userGoals.janGoal, achieved: userGoals.janAch },
      { month: 'feb', goal: userGoals.febGoal, achieved: userGoals.febAch },
      { month: 'mar', goal: userGoals.marGoal, achieved: userGoals.marAch },
      { month: 'apr', goal: userGoals.aprGoal, achieved: userGoals.aprAch },
      { month: 'may', goal: userGoals.mayGoal, achieved: userGoals.mayAch },
      { month: 'jun', goal: userGoals.junGoal, achieved: userGoals.junAch },
      { month: 'jul', goal: userGoals.julGoal, achieved: userGoals.julAch },
      { month: 'aug', goal: userGoals.augGoal, achieved: userGoals.augAch },
      { month: 'sep', goal: userGoals.sepGoal, achieved: userGoals.sepAch },
      { month: 'oct', goal: userGoals.octGoal, achieved: userGoals.octAch },
      { month: 'nov', goal: userGoals.novGoal, achieved: userGoals.novAch },
      { month: 'dec', goal: userGoals.decGoal, achieved: userGoals.decAch },
    ];
  };

  const restructuredGoals = restructureUserGoals(userGoals);

  return (
    <div>
      <Tabs defaultValue="dept" className="w-[95%]">
        <TabsList>
          <TabsTrigger value="dept">{user.name}</TabsTrigger>
          <TabsTrigger value="username">Store</TabsTrigger>
        </TabsList>
        <TabsContent value="dept">

          <div className='flex justify-between'>
            <div>
              <h2 className='text-left mt-3 mb-2 text-2xl '>Your Sales Leaderboard</h2>
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
                                    name={`${item.month}Goal`}
                                    defaultValue={item.goal}
                                    className='w-[35px] mx-auto' />
                                </TableCell>
                              ))}
                              <TableCell className="font-medium">
                                <Button variant='outline' name='intent' value='saveUserGoals' className='bg-primary' >
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
                                    name={`${item.month}Ach`}
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
          <Tabs defaultValue="account" className="w-[95%]">
            <TabsList>
              <TabsTrigger value="account">Data</TabsTrigger>
              <TabsTrigger value="password">Edit</TabsTrigger>
            </TabsList>
            <TabsContent value="account">Make changes to your account here.</TabsContent>
            <TabsContent value="password">Change your password here.</TabsContent>
          </Tabs>

        </TabsContent>
        <TabsContent value="username">

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
                              <TableHead>
                                <p className='text-center'>
                                  Jan
                                </p>
                              </TableHead >
                              <TableHead >
                                <p className='text-center'>
                                  Feb
                                </p>
                              </TableHead >
                              <TableHead >
                                <p className='text-center'>
                                  Mar
                                </p>
                              </TableHead >
                              <TableHead >
                                <p className='text-center'>
                                  Apr
                                </p>
                              </TableHead >
                              <TableHead>
                                <p className='text-center'>
                                  May
                                </p>
                              </TableHead >
                              <TableHead>
                                <p className='text-center'>
                                  Jun
                                </p>
                              </TableHead >
                              <TableHead>
                                <p className='text-center'>
                                  Jul
                                </p>
                              </TableHead >
                              <TableHead>
                                <p className='text-center'>
                                  Aug
                                </p>
                              </TableHead >
                              <TableHead>
                                <p className='text-center'>
                                  Sep
                                </p>
                              </TableHead >
                              <TableHead>
                                <p className='text-center'>
                                  Oct
                                </p>
                              </TableHead >
                              <TableHead>
                                <p className='text-center'>
                                  Nov
                                </p>
                              </TableHead >
                              <TableHead>
                                <p className='text-center'>
                                  Dec
                                </p>
                              </TableHead >
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
                                    name={`${item.month}Goal`}
                                    defaultValue={item.goal}
                                    className='w-[35px] mx-auto' />
                                </TableCell>
                              ))}
                              <TableCell className="font-medium">
                                <Button variant='outline' name='intent' value='saveUserGoals' className='bg-primary' >
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
                                  <Input name={`${item.month}Ach`} defaultValue={item.achieved} className='w-[35px] mx-auto' />
                                </TableCell>
                              ))}
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </div>
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
