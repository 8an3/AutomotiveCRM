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

const calcPer = (goal, achiev) => {
  if (goal === 0) return 0;
  return Math.round((achiev / goal) * 100);
};

export const RoundProg = ({ goal }) => {
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
export const RoundProgMiddle = ({ goal }) => {
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
          <CardFooter className="flex flex-row border-t p-4 border-border">
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


