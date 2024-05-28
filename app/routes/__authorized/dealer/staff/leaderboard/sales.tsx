import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, ComposedChart } from 'recharts';
import { startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { Card, CardHeader, CardTitle, CardContent, Button, Popover, PopoverTrigger, PopoverContent } from '~/components';
import { ImCross } from 'react-icons/im';
import { CalendarIcon, ClockIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import { Calendar } from '~/components/ui/calendar';
import { prisma } from '~/libs';
export async function loader({ params, request }: DataFunctionArgs) {
  return null
}
export const action: ActionFunction = async ({ req, request, params }) => {
  return null
}

function SecondCustom({ dateRange, salesData }) {
  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1"];
  const [salesTeam, setSalesTeam] = useState([]);
  const [salesList, setSalesList] = useState([]);

  useEffect(() => {
    if (dateRange && dateRange.from && dateRange.to) {
      async function fetchData() {
        const finance = await prisma.finance.findMany({ where: { sold: { not: null } } });
        const team = await prisma.user.findMany();
        setSalesList(finance);
        setSalesTeam(team);
      }
      fetchData();
    }
  }, [dateRange]);

  // Calculate total sales for each month within the selected date range
  const calculateTotalSalesForMonth = (startDate, endDate, salesperson) => {
    return salesList.reduce((totalSales, sale) => {
      const saleDate = new Date(sale.sold);
      if (sale.salesperson === salesperson && isWithinInterval(saleDate, { start: startDate, end: endDate })) {
        return totalSales + 1;
      }
      return totalSales;
    }, 0);
  };

  // Calculate target for each month within the selected date range
  const calculateTargetForMonth = (monthIndex, salesperson) => {
    const monthName = new Date(0, monthIndex).toLocaleString('default', { month: 'short' });
    return salesperson.monthlyTargets ? salesperson.monthlyTargets[monthName] : 0;
  };

  const generateSalesData = () => {
    const salesDataArray = [];
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    if (dateRange && dateRange.from && dateRange.to) {
      const startYear = new Date(dateRange.from).getFullYear();
      months.forEach((monthName, index) => {
        const startDate = startOfMonth(new Date(startYear, index));
        const endDate = endOfMonth(new Date(startYear, index));

        const salesByPerson = {};
        const targetsByPerson = {};
        salesTeam.forEach(person => {
          salesByPerson[person.name] = calculateTotalSalesForMonth(startDate, endDate, person.name);
          targetsByPerson[`${person.name} Target`] = calculateTargetForMonth(index, person);
        });

        salesDataArray.push({ name: monthName, ...salesByPerson, ...targetsByPerson });
      });
    }

    return salesDataArray;
  };

  useEffect(() => {
    if (dateRange && dateRange.from && dateRange.to) {
      const salesData = generateSalesData();
      console.log('Sales data for selected date range:', salesData);
    }
  }, [dateRange, salesList, salesTeam]);

  return (
    <ResponsiveContainer width="100%" height={350}>
      <ComposedChart data={generateSalesData()}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={true}
          axisLine={true}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={true}
          axisLine={true}
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip />
        <Legend />
        {salesTeam.map((person, index) => (
          <>
            <Bar key={person.name} dataKey={person.name} fill={colors[index % colors.length]} radius={[4, 4, 0, 0]} />
            <Line key={`${person.name} Target`} type="monotone" dataKey={`${person.name} Target`} stroke={colors[index % colors.length]} />
          </>
        ))}
      </ComposedChart>
    </ResponsiveContainer>
  );
}

export default function Dashboard(dateRange, dateRangeSec, salesData, setCustomView, setDateRange, setDateRangeSec) {
  return (
    <>
      <Card className="col-span-4 mr- text-[#fafafa] text-slate4 font-bold uppercase rounded shadow hover:shadow-md outline-none ease-linear transition-all duration-150">
        <CardHeader>
          <CardTitle>
            <div className='justify-between'>
              <p>First date range</p>
              <Button
                variant='ghost'
                onClick={() => setCustomView(false)}
                className='text-[#fafafa] bg-transparent hover:bg-transparent hover:border-[#02a9ff] hover:text-[#02a9ff]'>
                <ImCross />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SecondCustom dateRange={dateRange} salesData={salesData} />
        </CardContent>
      </Card>
      <Card className="col-span-4 mr-3 text-[#fafafa] text-slate4 font-bold uppercase rounded shadow hover:shadow-md outline-none ease-linear transition-all duration-150">
        <CardHeader>
          <CardTitle>Second date range</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <SecondCustom dateRange={dateRangeSec} salesData={salesData} />
        </CardContent>
      </Card>
      <Card className="text-[#fafafa] h-[225px] text-slate4 font-bold uppercase rounded shadow hover:shadow-md outline-none ease-linear transition-all duration-150">
        <CardContent>
          <h3 className="text-2xl font-thin mb-2">Custom Date View</h3>
          <div className="grid grid-cols-1">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={`w-[240px] justify-start text-left font-normal mr-3 hover:bg-transparent bg-transparent hover:border-[#02a9ff] hover:text-[#02a9ff] ${!dateRange && 'text-muted-foreground'}`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white text-black" align="start">
                <Calendar
                  className='bg-white text-black'
                  mode="range"
                  selected={dateRange}
                  onSelect={setDateRange}
                  initialFocus
                  numberOfMonths={2}
                  defaultMonth={dateRange?.from}
                />
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={`w-[240px] justify-start text-left font-normal mr-3 mt-2 hover:bg-transparent bg-transparent hover:border-[#02a9ff] hover:text-[#02a9ff] ${!dateRangeSec && 'text-muted-foreground'}`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRangeSec?.from ? (
                    dateRangeSec.to ? (
                      <>
                        {format(dateRangeSec.from, "LLL dd, y")} -{" "}
                        {format(dateRangeSec.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRangeSec.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white text-black" align="start">
                <Calendar
                  className='bg-white text-black'
                  mode="range"
                  selected={dateRangeSec}
                  onSelect={setDateRangeSec}
                  initialFocus
                  numberOfMonths={2}
                  defaultMonth={dateRangeSec?.from}
                />
              </PopoverContent>
            </Popover>
            <Button
              variant='outline'
              onClick={() => setCustomView(true)}
              className='text-[#fafafa] mt-2 bg-transparent hover:bg-transparent hover:border-[#02a9ff] hover:text-[#02a9ff]'>
              Set Custom View
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
