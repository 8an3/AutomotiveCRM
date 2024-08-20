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

const chartConfigSales = {
  sales: {
    label: "Sales",
    color: "#0090ff",
  },

} satisfies ChartConfig


export function WeeklkyChart({ userChartData, salesRecords }) {

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
