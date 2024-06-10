import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Input, Button, Card, CardHeader, CardTitle, CardContent, CardFooter, Popover, PopoverTrigger, PopoverContent, } from "~/components/ui/index"
import { Form, useLoaderData } from '@remix-run/react'
import React, { useState, useEffect } from "react";
import { json, type ActionFunction, type DataFunctionArgs, type MetaFunction, redirect, type LoaderFunction, } from "@remix-run/node";
import { createSalesInput, getSalesData } from "~/utils/salestracker.server";
import { startOfWeek, endOfWeek, isWithinInterval, format, startOfMonth, endOfMonth, addDays } from 'date-fns';
import { z } from 'zod'
import { zfd } from 'zod-form-data'
import { prisma } from "~/libs";
import { getSession } from '~/sessions/auth-session.server';
import { CalendarIcon, ClockIcon } from "@radix-ui/react-icons"
import { Calendar } from '~/components/ui/calendar';
import { cn } from "~/components/ui/utils"
import { type DateRange } from "react-day-picker"
import { ImCross } from "react-icons/im";

export async function loader({ request, params }: LoaderFunction) {
    const session = await getSession(request.headers.get("Cookie"));
    const email = session.get("email")
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
            position: true,
            roleId: true,
            profileId: true,
            omvicNumber: true,
            role: { select: { symbol: true, name: true } },
        },
    });

    let response = await prisma.dashboard.findMany({
        where: { userEmail: email, },
        select: { sold: true }
    });
    response = response.map(item => {
        return { ...item, sales: 1 };
    });

    if (!user) { redirect('/login') }
    const currentDate = new Date()
    const salesDataFirst = await getSalesData({ email });
    const salesData = [
        ...salesDataFirst,
        ...response
    ]

    const startOfCurrentWeek = startOfWeek(currentDate);
    const endOfCurrentWeek = endOfWeek(currentDate);
    const salesDataForCurrentWeek = salesData.filter((salesData) => { const saleDate = new Date(salesData.sold); return isWithinInterval(saleDate, { start: startOfCurrentWeek, end: endOfCurrentWeek }); });
    const totalSalesForCurrentWeek = salesDataForCurrentWeek.reduce((total, salesData) => { return total + salesData.sales; }, 0);
    const startOfCurrentMonth = startOfMonth(currentDate);
    const endOfCurrentMonth = endOfMonth(currentDate);
    const salesDataForCurrentMonth = salesData.filter((salesData) => { const saleDate = new Date(salesData.sold); return isWithinInterval(saleDate, { start: startOfCurrentMonth, end: endOfCurrentMonth }); });
    const totalSalesForCurrentMonth = salesDataForCurrentMonth.reduce((total, salesData) => { return total + salesData.sales; }, 0);
    const salesListfirst = await getSalesData({ email });
    const salesList = [
        ...salesListfirst,
        ...response
    ]
    console.log(salesData, response, salesList, 'response')

    return json({
        response,
        salesList,
        user,
        salesData: salesDataForCurrentWeek,
        totalSales: totalSalesForCurrentWeek,
        totalSalesForCurrentMonth,
    } as const);
}
const salesTrackerSchema = z.object({
    date: zfd.text(z.string().optional()),
    sales: zfd.numeric(z.number().optional()),
    intent: zfd.text(z.string().optional()),
    salesId: zfd.text(z.string().optional()),
    email: zfd.text(z.string().optional()),
})

export const action: ActionFunction = async ({ request }) => {
    const formPayload = Object.fromEntries(await request.formData())
    console.log(formPayload, 'formPayload')
    const salesInputs = salesTrackerSchema.parse(formPayload)
    if (salesInputs.intent === 'updateSales') {
        const updateSalesData = await prisma.sales.create({
            data: {
                email: String(formPayload.email),
                sales: Number(formPayload.sales),
                sold: String(formPayload.sold)
            }
        })
        //console.log('tracker', updateSalesData)
        return json({ updateSalesData })
    }
}


type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];


export const meta: MetaFunction = () => {

    return [
        { title: 'Sales Tracker/Salesboard - Dealer Sales Assistant' },
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


/**
 *
 *   <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            name='date'
                                            variant={"outline"}
                                            className={cn(
                                                "w-[240px] justify-start text-left font-normal",
                                                !date && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={date}
                                            onSelect={handleDateSelect}
                                            initialFocus
                                            name='date'
                                        />
                                    </PopoverContent>
                                </Popover>
 */

export default function Salestracker() {
    const [date, setDate] = React.useState<Date>()
    const { response, salesListfirst } = useLoaderData();
    const salesData = {
        ...response,
        ...salesListfirst
    }

    const handleDateSelect = (selectedDate) => { setDate(selectedDate) };
    const { totalSales, totalSalesForCurrentMonth } = useLoaderData()
    const { user } = useLoaderData()

    const [customView, setCustomView] = useState(false)
    const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
        from: new Date(),
        to: addDays(new Date(), 20),
    })
    const [dateRangeSec, setDateRangeSec] = React.useState<DateRange | undefined>({
        from: new Date(),
        to: addDays(new Date(), 20),
    })

    /** useEffect(() => {
         if (
             dateRange.from !== new Date() &&
         dateRange.to !== addDays(new Date(), 20) &&
         dateRangeSec.from !== new Date() &&
         dateRangeSec.to !== addDays(new Date(), 20)) {
             setCustomView(true)
         }
     }, [dateRange.from, dateRange.to, dateRangeSec.from, dateRangeSec.to]); */
    return (
        <Form method='post' >

            <div className='grid grid-cols-3 p-3' >
                <div className='mr-3'>
                    <Card className="text-foreground   text-slate4   font-bold uppercase  rounded shadow hover:shadow-md outline-none  ease-linear transition-all duration-150">
                        <CardContent className="text-foreground   text-slate4   font-bold uppercase  rounded shadow hover:shadow-md outline-none  ease-linear transition-all duration-150">
                            <div className='grid grid-cols-1' >
                                <h3 className="text-2xl font-thin">
                                    Sales
                                </h3>
                                <p className="text-muted-foreground text-sm mb-2">
                                    Input current and previous sales.
                                </p>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-[240px] justify-start text-left font-normal mr-3 hover:bg-transparent bg-transparent hover:border-primary hover:text-primary",
                                                !date && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4 " />
                                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0 bg-white text-black" align="start">
                                        <Calendar
                                            className='bg-white text-black'
                                            mode="single"
                                            selected={date}
                                            onSelect={setDate}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>


                                <Input placeholder='Number of sales...' name='sales' className='mt-2 w-[240px]' />
                            </div>
                            <input type='hidden' value={date} name='sold' />

                            <Input type='hidden' defaultValue={user.email} name='email' />
                        </CardContent>
                        <CardFooter className="text-foreground    text-slate4  font-bold uppercase  rounded shadow hover:shadow-md outline-none  ease-linear transition-all duration-150">
                            <Button variant='outline' name="intent" value='updateSales' type="submit" className=' text-foreground bg-transparent hover:bg-transparent hover:border-primary hover:text-primary'>
                                Update Sales
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
                <div className='mr-3 ml-3 '>
                    <Card className="text-foreground h-[225px]   text-slate4   font-bold uppercase  rounded shadow hover:shadow-md outline-none  ease-linear transition-all duration-150">
                        <CardContent>
                            <h3 className="text-2xl font-thin mb-2">
                                Current Sales
                            </h3>
                            <p>Total Sales for Current Week: {totalSales}</p>
                            <p>Total Sales for Current Month: {totalSalesForCurrentMonth}</p>
                            <h3 className="text-2xl font-thin mb-2 mt-2">
                                For the year
                            </h3>
                            <div className="justify-start">
                                <YOY />
                            </div>
                            <p> <YOYLastYear /></p>
                        </CardContent>
                    </Card>
                </div>
                <div className='mr-3 ml-3'>
                    <Card className="text-foreground h-[225px]  text-slate4  font-bold uppercase  rounded shadow hover:shadow-md outline-none  ease-linear transition-all duration-150">
                        <CardContent>
                            <h3 className="text-2xl font-thin mb-2">
                                Custom Date View
                            </h3>
                            <div className="grid grid-cols-1">

                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-[240px] justify-start text-left font-normal mr-3 hover:bg-transparent bg-transparent hover:border-primary hover:text-primary",
                                                !dateRange && "text-muted-foreground"
                                            )}
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
                                            className={cn(
                                                "w-[240px] justify-start text-left font-normal mr-3 mt-2 hover:bg-transparent bg-transparent hover:border-primary hover:text-primary",
                                                !dateRangeSec && "text-muted-foreground"
                                            )}
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
                                    onClick={() => (
                                        setCustomView(true)
                                    )}
                                    className=' text-foreground mt-2 bg-transparent hover:bg-transparent hover:border-primary hover:text-primary'>
                                    Set Custom View
                                </Button>
                            </div>

                        </CardContent>
                    </Card>
                </div>
            </div>
            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-8  p-3">
                {!customView && (
                    <>
                        <Card className="col-span-4 mr- text-foreground   text-slate4   font-bold uppercase  rounded shadow hover:shadow-md outline-none  ease-linear transition-all duration-150">
                            <CardHeader>
                                <CardTitle> Breakdown of sales over the current year.</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Overview />
                            </CardContent>
                        </Card>
                        <Card className="col-span-4 mr-3 text-foreground   text-slate4  ] font-bold uppercase  rounded shadow hover:shadow-md outline-none  ease-linear transition-all duration-150">
                            <CardHeader>
                                <CardTitle>Breakdown of sales from last year.</CardTitle>
                            </CardHeader>
                            <CardContent className="pl-2">
                                <OverviewLastYear />
                            </CardContent>
                        </Card>
                    </>
                )}
                {customView && (
                    <>
                        <Card className="col-span-4 mr- text-foreground   text-slate4   font-bold uppercase  rounded shadow hover:shadow-md outline-none  ease-linear transition-all duration-150">
                            <CardHeader>
                                <CardTitle>
                                    <div className='justify-between'>
                                        <p>
                                            First date range
                                        </p>
                                        <Button
                                            variant='ghost'
                                            onClick={() => (
                                                setCustomView(false)
                                            )}
                                            className=' text-foreground bg-transparent hover:bg-transparent hover:border-primary hover:text-primary'>
                                            <ImCross />
                                        </Button>
                                    </div>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <FirstCustom dateRange={dateRange} salesData={salesData} />
                            </CardContent>
                        </Card>
                        <Card className="col-span-4 mr-3 text-foreground   text-slate4   font-bold uppercase  rounded shadow hover:shadow-md outline-none  ease-linear transition-all duration-150">
                            <CardHeader>
                                <CardTitle>Second date range</CardTitle>
                            </CardHeader>
                            <CardContent className="pl-2">
                                <SecondCustom dateRange={dateRangeSec} salesData={salesData} />

                            </CardContent>
                        </Card>
                    </>
                )}
            </div>
        </Form>
    )
}


export function YOY() {
    const { salesList } = useLoaderData();

    const currentDate = new Date();

    // Calculate the start and end of September
    const startOfJan = startOfMonth(new Date(currentDate.getFullYear(), 0)); // September is month 8 (0-indexed)
    const endOfDec = endOfMonth(new Date(currentDate.getFullYear(), 11)); // September is month 8 (0-indexed)

    // year total
    const salesDataForYear = salesList.filter((sale) => {
        const saleDate = new Date(sale.sold); // Assuming sale.date is a date string
        return isWithinInterval(saleDate, { start: startOfJan, end: endOfDec });
    });
    const totalSalesForYear = salesDataForYear.reduce((total, salesData) => {
        return total + salesData.sales;
    }, 0); // 0 is the initial value of the total

    return (
        <>
            <p> Total Sales for Current Year: {totalSalesForYear}</p>
        </>
    )
}

export function YOYLastYear() {
    const { salesList } = useLoaderData();

    const currentDate = new Date();

    // Calculate the start and end of September
    const startOfJan = startOfMonth(new Date(currentDate.getFullYear() - 1, 0)); // September is month 8 (0-indexed)
    const endOfDec = endOfMonth(new Date(currentDate.getFullYear() - 1, 11)); // September is month 8 (0-indexed)

    // year total
    const salesDataForYear = salesList.filter((sale) => {
        const saleDate = new Date(sale.sold); // Assuming sale.date is a date string
        return isWithinInterval(saleDate, { start: startOfJan, end: endOfDec });
    });
    const totalSalesForYear = salesDataForYear.reduce((total, salesData) => {
        return total + salesData.sales;
    }, 0); // 0 is the initial value of the total

    return (
        <>
            <p>Total Sales for Last Year: {totalSalesForYear}</p>
        </>
    )
}

export function Overview() {
    const { salesList } = useLoaderData();

    const currentDate = new Date();

    // Calculate the start and end of September
    const startOfJan = startOfMonth(new Date(currentDate.getFullYear(), 0)); // September is month 8 (0-indexed)
    const endOfJan = endOfMonth(new Date(currentDate.getFullYear(), 0)); // September is month 8 (0-indexed)
    const startOfFeb = startOfMonth(new Date(currentDate.getFullYear(), 1)); // September is month 8 (0-indexed)
    const endOfFeb = endOfMonth(new Date(currentDate.getFullYear(), 1)); // September is month 8 (0-indexed)
    const startOfMarch = startOfMonth(new Date(currentDate.getFullYear(), 2)); // September is month 8 (0-indexed)
    const endOfMarch = endOfMonth(new Date(currentDate.getFullYear(), 2)); // September is month 8 (0-indexed)
    const startOfApril = startOfMonth(new Date(currentDate.getFullYear(), 3)); // September is month 8 (0-indexed)
    const endOfApril = endOfMonth(new Date(currentDate.getFullYear(), 3)); // September is month 8 (0-indexed)
    const startOfMay = startOfMonth(new Date(currentDate.getFullYear(), 4)); // September is month 8 (0-indexed)
    const endOfMay = endOfMonth(new Date(currentDate.getFullYear(), 4)); // September is month 8 (0-indexed)
    const startOfJune = startOfMonth(new Date(currentDate.getFullYear(), 5)); // September is month 8 (0-indexed)
    const endOfJune = endOfMonth(new Date(currentDate.getFullYear(), 5)); // September is month 8 (0-indexed)
    const startOfJuly = startOfMonth(new Date(currentDate.getFullYear(), 6)); // September is month 8 (0-indexed)
    const endOfJuly = endOfMonth(new Date(currentDate.getFullYear(), 6)); // September is month 8 (0-indexed)
    const startOfAugust = startOfMonth(new Date(currentDate.getFullYear(), 7)); // September is month 8 (0-indexed)
    const endOfAugust = endOfMonth(new Date(currentDate.getFullYear(), 7)); // September is month 8 (0-indexed)
    const startOfSeptember = startOfMonth(new Date(currentDate.getFullYear(), 8)); // September is month 8 (0-indexed)
    const endOfSeptember = endOfMonth(new Date(currentDate.getFullYear(), 8)); // September is month 8 (0-indexed)
    const startOfOct = startOfMonth(new Date(currentDate.getFullYear(), 9)); // September is month 8 (0-indexed)
    const endOfOct = endOfMonth(new Date(currentDate.getFullYear(), 9)); // September is month 8 (0-indexed)
    const startOfNov = startOfMonth(new Date(currentDate.getFullYear(), 10)); // September is month 8 (0-indexed)
    const endOfNov = endOfMonth(new Date(currentDate.getFullYear(), 10)); // September is month 8 (0-indexed)
    const startOfDec = startOfMonth(new Date(currentDate.getFullYear(), 11)); // September is month 8 (0-indexed)
    const endOfDec = endOfMonth(new Date(currentDate.getFullYear(), 11)); // September is month 8 (0-indexed)


    // Feb
    const salesDataForJan = salesList.filter((sale) => {
        const saleDate = new Date(sale.sold); // Assuming sale.date is a date string
        return isWithinInterval(saleDate, { start: startOfJan, end: endOfJan });
    });
    const totalSalesForJan = salesDataForJan.reduce((total, salesData) => {
        return total + salesData.sales;
    }, 0); // 0 is the initial value of the total

    // Feb
    const salesDataForFeb = salesList.filter((sale) => {
        const saleDate = new Date(sale.sold); // Assuming sale.date is a date string
        return isWithinInterval(saleDate, { start: startOfFeb, end: endOfFeb });
    });
    const totalSalesForFeb = salesDataForFeb.reduce((total, salesData) => {
        return total + salesData.sales;
    }, 0); // 0 is the initial value of the total

    // Mar
    const salesDataForMar = salesList.filter((sale) => {
        const saleDate = new Date(sale.sold); // Assuming sale.date is a date string
        return isWithinInterval(saleDate, { start: startOfMarch, end: endOfMarch });
    });
    const totalSalesForMar = salesDataForMar.reduce((total, salesData) => {
        return total + salesData.sales;
    }, 0); // 0 is the initial value of the total

    // apr
    const salesDataForApr = salesList.filter((sale) => {
        const saleDate = new Date(sale.sold); // Assuming sale.date is a date string
        return isWithinInterval(saleDate, { start: startOfApril, end: endOfApril });
    });
    const totalSalesForApr = salesDataForApr.reduce((total, salesData) => {
        return total + salesData.sales;
    }, 0); // 0 is the initial value of the total

    // may
    const salesDataForMay = salesList.filter((sale) => {
        const saleDate = new Date(sale.sold); // Assuming sale.date is a date string
        return isWithinInterval(saleDate, { start: startOfMay, end: endOfMay });
    });
    const totalSalesForMay = salesDataForMay.reduce((total, salesData) => {
        return total + salesData.sales;
    }, 0); // 0 is the initial value of the total

    // jun
    const salesDataForJun = salesList.filter((sale) => {
        const saleDate = new Date(sale.sold); // Assuming sale.date is a date string
        return isWithinInterval(saleDate, { start: startOfJune, end: endOfJune });
    });
    const totalSalesForJun = salesDataForJun.reduce((total, salesData) => {
        return total + salesData.sales;
    }, 0); // 0 is the initial value of the total

    // jul
    const salesDataForJul = salesList.filter((sale) => {
        const saleDate = new Date(sale.sold); // Assuming sale.date is a date string
        return isWithinInterval(saleDate, { start: startOfJuly, end: endOfJuly });
    });
    const totalSalesForJul = salesDataForJul.reduce((total, salesData) => {
        return total + salesData.sales;
    }, 0); // 0 is the initial value of the total

    // aug
    const salesDataForAug = salesList.filter((sale) => {
        const saleDate = new Date(sale.sold); // Assuming sale.date is a date string
        return isWithinInterval(saleDate, { start: startOfAugust, end: endOfAugust });
    });
    const totalSalesForAug = salesDataForAug.reduce((total, salesData) => {
        return total + salesData.sales;
    }, 0); // 0 is the initial value of the total

    // sept
    const salesDataForSeptember = salesList.filter((sale) => {
        const saleDate = new Date(sale.sold); // Assuming sale.date is a date string
        return isWithinInterval(saleDate, { start: startOfSeptember, end: endOfSeptember });
    });
    const totalSalesForSept = salesDataForSeptember.reduce((total, salesData) => {
        return total + salesData.sales;
    }, 0); // 0 is the initial value of the total

    // oct
    const salesDataForOct = salesList.filter((sale) => {
        const saleDate = new Date(sale.sold); // Assuming sale.date is a date string
        return isWithinInterval(saleDate, { start: startOfOct, end: endOfOct });
    });
    const totalSalesForOct = salesDataForOct.reduce((total, salesData) => {
        return total + salesData.sales;
    }, 0); // 0 is the initial value of the total

    // Nov
    const salesDataForNov = salesList.filter((sale) => {
        const saleDate = new Date(sale.sold); // Assuming sale.date is a date string
        return isWithinInterval(saleDate, { start: startOfNov, end: endOfNov });
    });
    const totalSalesForNov = salesDataForNov.reduce((total, salesData) => {
        return total + salesData.sales;
    }, 0); // 0 is the initial value of the total

    // dec
    const salesDataForDec = salesList.filter((sale) => {
        const saleDate = new Date(sale.sold); // Assuming sale.date is a date string
        return isWithinInterval(saleDate, { start: startOfDec, end: endOfDec });
    });
    const totalSalesForDec = salesDataForDec.reduce((total, salesData) => {
        return total + salesData.sales;
    }, 0); // 0 is the initial value of the total

    //console.log('sept', totalSalesForAug, totalSalesForSept)
    const data = [
        {
            name: "Jan",
            total: totalSalesForJan,
        },
        {
            name: "Feb",
            total: totalSalesForFeb,
        },
        {
            name: "Mar",
            total: totalSalesForMar,
        },
        {
            name: "Apr",
            total: totalSalesForApr,
        },
        {
            name: "May",
            total: totalSalesForMay,
        },
        {
            name: "Jun",
            total: totalSalesForJun,
        },
        {
            name: "Jul",
            total: totalSalesForJul,
        },
        {
            name: "Aug",
            total: totalSalesForAug,
        },
        {
            name: "Sep",
            total: totalSalesForSept,
        },
        {
            name: "Oct",
            total: totalSalesForOct,
        },
        {
            name: "Nov",
            total: totalSalesForNov,
        },
        {
            name: "Dec",
            total: totalSalesForDec,
        },
    ]
    return (
        <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
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
                <Bar dataKey="total" fill="#c72323" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    )
}


export function OverviewLastYear() {
    const { salesList } = useLoaderData();

    const currentDate = new Date();

    // Calculate the start and end of September
    const startOfJan = startOfMonth(new Date(currentDate.getFullYear() - 1, 0)); // September is month 8 (0-indexed)
    const endOfJan = endOfMonth(new Date(currentDate.getFullYear() - 1, 0)); // September is month 8 (0-indexed)
    const startOfFeb = startOfMonth(new Date(currentDate.getFullYear() - 1, 1)); // September is month 8 (0-indexed)
    const endOfFeb = endOfMonth(new Date(currentDate.getFullYear() - 1, 1)); // September is month 8 (0-indexed)
    const startOfMarch = startOfMonth(new Date(currentDate.getFullYear() - 1, 2)); // September is month 8 (0-indexed)
    const endOfMarch = endOfMonth(new Date(currentDate.getFullYear() - 1, 2)); // September is month 8 (0-indexed)
    const startOfApril = startOfMonth(new Date(currentDate.getFullYear() - 1, 3)); // September is month 8 (0-indexed)
    const endOfApril = endOfMonth(new Date(currentDate.getFullYear() - 1, 3)); // September is month 8 (0-indexed)
    const startOfMay = startOfMonth(new Date(currentDate.getFullYear() - 1, 4)); // September is month 8 (0-indexed)
    const endOfMay = endOfMonth(new Date(currentDate.getFullYear() - 1, 4)); // September is month 8 (0-indexed)
    const startOfJune = startOfMonth(new Date(currentDate.getFullYear() - 1, 5)); // September is month 8 (0-indexed)
    const endOfJune = endOfMonth(new Date(currentDate.getFullYear() - 1, 5)); // September is month 8 (0-indexed)
    const startOfJuly = startOfMonth(new Date(currentDate.getFullYear() - 1, 6)); // September is month 8 (0-indexed)
    const endOfJuly = endOfMonth(new Date(currentDate.getFullYear() - 1, 6)); // September is month 8 (0-indexed)
    const startOfAugust = startOfMonth(new Date(currentDate.getFullYear() - 1, 7)); // September is month 8 (0-indexed)
    const endOfAugust = endOfMonth(new Date(currentDate.getFullYear() - 1, 7)); // September is month 8 (0-indexed)
    const startOfSeptember = startOfMonth(new Date(currentDate.getFullYear() - 1, 8)); // September is month 8 (0-indexed)
    const endOfSeptember = endOfMonth(new Date(currentDate.getFullYear() - 1, 8)); // September is month 8 (0-indexed)
    const startOfOct = startOfMonth(new Date(currentDate.getFullYear() - 1, 9)); // September is month 8 (0-indexed)
    const endOfOct = endOfMonth(new Date(currentDate.getFullYear() - 1, 9)); // September is month 8 (0-indexed)
    const startOfNov = startOfMonth(new Date(currentDate.getFullYear() - 1, 10)); // September is month 8 (0-indexed)
    const endOfNov = endOfMonth(new Date(currentDate.getFullYear() - 1, 10)); // September is month 8 (0-indexed)
    const startOfDec = startOfMonth(new Date(currentDate.getFullYear() - 1, 11)); // September is month 8 (0-indexed)
    const endOfDec = endOfMonth(new Date(currentDate.getFullYear() - 1, 11)); // September is month 8 (0-indexed)


    // Feb
    const salesDataForJan = salesList.filter((sale) => {
        const saleDate = new Date(sale.sold); // Assuming sale.date is a date string
        return isWithinInterval(saleDate, { start: startOfJan, end: endOfJan });
    });
    const totalSalesForJan = salesDataForJan.reduce((total, salesData) => {
        return total + salesData.sales;
    }, 0); // 0 is the initial value of the total

    // Feb
    const salesDataForFeb = salesList.filter((sale) => {
        const saleDate = new Date(sale.sold); // Assuming sale.date is a date string
        return isWithinInterval(saleDate, { start: startOfFeb, end: endOfFeb });
    });
    const totalSalesForFeb = salesDataForFeb.reduce((total, salesData) => {
        return total + salesData.sales;
    }, 0); // 0 is the initial value of the total

    // Mar
    const salesDataForMar = salesList.filter((sale) => {
        const saleDate = new Date(sale.sold); // Assuming sale.date is a date string
        return isWithinInterval(saleDate, { start: startOfMarch, end: endOfMarch });
    });
    const totalSalesForMar = salesDataForMar.reduce((total, salesData) => {
        return total + salesData.sales;
    }, 0); // 0 is the initial value of the total

    // apr
    const salesDataForApr = salesList.filter((sale) => {
        const saleDate = new Date(sale.sold); // Assuming sale.date is a date string
        return isWithinInterval(saleDate, { start: startOfApril, end: endOfApril });
    });
    const totalSalesForApr = salesDataForApr.reduce((total, salesData) => {
        return total + salesData.sales;
    }, 0); // 0 is the initial value of the total

    // may
    const salesDataForMay = salesList.filter((sale) => {
        const saleDate = new Date(sale.sold); // Assuming sale.date is a date string
        return isWithinInterval(saleDate, { start: startOfMay, end: endOfMay });
    });
    const totalSalesForMay = salesDataForMay.reduce((total, salesData) => {
        return total + salesData.sales;
    }, 0); // 0 is the initial value of the total

    // jun
    const salesDataForJun = salesList.filter((sale) => {
        const saleDate = new Date(sale.sold); // Assuming sale.date is a date string
        return isWithinInterval(saleDate, { start: startOfJune, end: endOfJune });
    });
    const totalSalesForJun = salesDataForJun.reduce((total, salesData) => {
        return total + salesData.sales;
    }, 0); // 0 is the initial value of the total

    // jul
    const salesDataForJul = salesList.filter((sale) => {
        const saleDate = new Date(sale.sold); // Assuming sale.date is a date string
        return isWithinInterval(saleDate, { start: startOfJuly, end: endOfJuly });
    });
    const totalSalesForJul = salesDataForJul.reduce((total, salesData) => {
        return total + salesData.sales;
    }, 0); // 0 is the initial value of the total

    // aug
    const salesDataForAug = salesList.filter((sale) => {
        const saleDate = new Date(sale.sold); // Assuming sale.date is a date string
        return isWithinInterval(saleDate, { start: startOfAugust, end: endOfAugust });
    });
    const totalSalesForAug = salesDataForAug.reduce((total, salesData) => {
        return total + salesData.sales;
    }, 0); // 0 is the initial value of the total

    // sept
    const salesDataForSeptember = salesList.filter((sale) => {
        const saleDate = new Date(sale.sold); // Assuming sale.date is a date string
        return isWithinInterval(saleDate, { start: startOfSeptember, end: endOfSeptember });
    });
    const totalSalesForSept = salesDataForSeptember.reduce((total, salesData) => {
        return total + salesData.sales;
    }, 0); // 0 is the initial value of the total

    // oct
    const salesDataForOct = salesList.filter((sale) => {
        const saleDate = new Date(sale.sold); // Assuming sale.date is a date string
        return isWithinInterval(saleDate, { start: startOfOct, end: endOfOct });
    });
    const totalSalesForOct = salesDataForOct.reduce((total, salesData) => {
        return total + salesData.sales;
    }, 0); // 0 is the initial value of the total

    // Nov
    const salesDataForNov = salesList.filter((sale) => {
        const saleDate = new Date(sale.sold); // Assuming sale.date is a date string
        return isWithinInterval(saleDate, { start: startOfNov, end: endOfNov });
    });
    const totalSalesForNov = salesDataForNov.reduce((total, salesData) => {
        return total + salesData.sales;
    }, 0); // 0 is the initial value of the total

    // dec
    const salesDataForDec = salesList.filter((sale) => {
        const saleDate = new Date(sale.sold); // Assuming sale.date is a date string
        return isWithinInterval(saleDate, { start: startOfDec, end: endOfDec });
    });
    const totalSalesForDec = salesDataForDec.reduce((total, salesData) => {
        return total + salesData.sales;
    }, 0); // 0 is the initial value of the total

    //console.log('sept', totalSalesForAug, totalSalesForSept)
    const data = [
        {
            name: "Jan",
            total: totalSalesForJan,
        },
        {
            name: "Feb",
            total: totalSalesForFeb,
        },
        {
            name: "Mar",
            total: totalSalesForMar,
        },
        {
            name: "Apr",
            total: totalSalesForApr,
        },
        {
            name: "May",
            total: totalSalesForMay,
        },
        {
            name: "Jun",
            total: totalSalesForJun,
        },
        {
            name: "Jul",
            total: totalSalesForJul,
        },
        {
            name: "Aug",
            total: totalSalesForAug,
        },
        {
            name: "Sep",
            total: totalSalesForSept,
        },
        {
            name: "Oct",
            total: totalSalesForOct,
        },
        {
            name: "Nov",
            total: totalSalesForNov,
        },
        {
            name: "Dec",
            total: totalSalesForDec,
        },
    ]
    return (
        <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
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
                <Bar dataKey="total" fill="#c72323" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    )
}
function FirstCustom({ dateRange, salesData }) {
    const salesList = salesData;

    // Calculate total sales for each month within the selected date range
    const calculateTotalSalesForMonth = (startDate, endDate) => {
        return salesList.reduce((totalSales, sale) => {
            const saleDate = new Date(sale.sold); // Parse sold date string to Date object
            if (isWithinInterval(saleDate, { start: startDate, end: endDate })) {
                return totalSales + 1; // Increment total sales count for this month
            }
            return totalSales;
        }, 0);
    };

    // Function to generate sales data for each month within the selected date range
    const generateSalesData = () => {
        const salesData = [];
        const months = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];

        if (dateRange && dateRange.from && dateRange.to) {
            months.forEach((monthName, index) => {
                const startDate = startOfMonth(new Date(dateRange.from)); // Use dateRange.from directly
                const endDate = endOfMonth(new Date(dateRange.to)); // Use dateRange.to directly
                startDate.setMonth(index); // Set the month for start date
                endDate.setMonth(index); // Set the month for end date

                const totalSales = calculateTotalSalesForMonth(startDate, endDate);
                salesData.push({ name: monthName, total: totalSales });
            });
        }

        return salesData;
    };

    useEffect(() => {
        if (dateRange && dateRange.from && dateRange.to) {
            const salesData = generateSalesData();
            console.log('Sales data for selected date range:', salesData);
        }
    }, [dateRange]);

    return (
        <ResponsiveContainer width="100%" height={350}>
            <BarChart data={generateSalesData()}>
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
                <Bar dataKey="total" fill="#c72323" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
}
function SecondCustom(dateRange, salesData) {
    const salesList = salesData;

    // Calculate total sales for each month within the selected date range
    const calculateTotalSalesForMonth = (startDate, endDate) => {
        return salesList.reduce((totalSales, sale) => {
            const saleDate = new Date(sale.sold); // Parse sold date string to Date object
            if (isWithinInterval(saleDate, { start: startDate, end: endDate })) {
                return totalSales + 1; // Increment total sales count for this month
            }
            return totalSales;
        }, 0);
    };

    // Function to generate sales data for each month within the selected date range
    const generateSalesData = () => {
        const salesData = [];
        const months = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];

        if (dateRange && dateRange.from && dateRange.to) {
            months.forEach((monthName, index) => {
                const startDate = startOfMonth(new Date(dateRange.from)); // Use dateRange.from directly
                const endDate = endOfMonth(new Date(dateRange.to)); // Use dateRange.to directly
                startDate.setMonth(index); // Set the month for start date
                endDate.setMonth(index); // Set the month for end date

                const totalSales = calculateTotalSalesForMonth(startDate, endDate);
                salesData.push({ name: monthName, total: totalSales });
            });
        }

        return salesData;
    };

    useEffect(() => {
        if (dateRange && dateRange.from && dateRange.to) {
            const salesData = generateSalesData();
            console.log('Sales data for selected date range:', salesData);
        }
    }, [dateRange]);

    return (
        <ResponsiveContainer width="100%" height={350}>
            <BarChart data={generateSalesData()}>
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
                <Bar dataKey="total" fill="#c72323" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
}
