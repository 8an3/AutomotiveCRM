import React, { useEffect, useState, useRef, forwardRef, } from "react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { Outlet, Link, useLoaderData, useFetcher, useNavigate, useSubmit, Form } from "@remix-run/react";
import { ActionFunction, json, LinksFunction, LoaderFunction, redirect } from "@remix-run/node";
import { prisma } from "~/libs";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import PrintReceipt from "../document/printReceiptAcc";
import { CalendarIcon, ClockIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import { Calendar as SmallCalendar } from '~/components/ui/calendar';
import PrintEndofDay from "~/routes/__authorized/dealer/document/printEndOfDay.client";

export async function loader({ request, params }: LoaderFunction) {
  const fees = await prisma.dealer.findUnique({ where: { id: 1 } })

  return json({ fees })
}
export default function EndOfDay() {
  const { fees } = useLoaderData()
  const options2 = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };
  const newDate = new Date()
  const [date, setDate] = useState<Date>(newDate)
  const [dept, setDept] = useState()
  const dateNow = new Date().toLocaleDateString("en-US", options2)
  const [shouldFetch, setShouldFetch] = useState(false)
  const [subTotal, setSubTotal] = useState(0.00)
  const [tax, setTax] = useState(0.00)
  const [total, setTotal] = useState(0.00)
  const [salesPeople, setSalesPeople] = useState([])
  const [data, setData] = useState()
  const taxMultiplier = 1 + (fees.userTax / 100)

  const [cashTotal, setCashTotal] = useState(0.00);
  const [debitTotal, setDebitTotal] = useState(0.00);
  const [creditTotal, setCreditTotal] = useState(0.00);
  const [chequeTotal, setChequeTotal] = useState(0.00);
  const [onlineTotal, setOnlineTotal] = useState(0.00);
  const [eTransferTotal, setETransferTotal] = useState(0.00);
  const [visaTotal, setVisaTotal] = useState(0.00);
  const [mastercardTotal, setMastercardTotal] = useState(0.00);
  const [amexTotal, setAmexTotal] = useState(0.00);

  let newCashTotal = 0;
  let newDebitTotal = 0;
  let newCreditTotal = 0;
  let newChequeTotal = 0;
  let newOnlineTotal = 0;
  let newETransferTotal = 0;
  let newVisaTotal = 0;
  let newMastercardTotal = 0;
  let newAmexTotal = 0;
  let toReceipt
  let salesData = [];

  async function FetchReport() {
    try {
      console.log("Fetching report...");
      setShouldFetch(true);

      const url = `/dealer/manager/report/${dept}/${date}`;

      const response = await fetch(url);
      const result = await response.json();

      console.log(result, 'Fetched data');
      setData(result);

      Calculate(result);
    } catch (error) {
      console.error("Error fetching report:", error);
    } finally {
      setShouldFetch(false);
    }
  };

  function Calculate(data) {
    let totalSum = 0;
    let totalWithTax = 0;
    let difference = 0;
    let displayArray = [];
    let paymentTotals

    if (dept === 'Accessories') {
      totalSum = data.reduce((sum, item) => sum + (item.total || 0), 0);
      totalWithTax = totalSum * taxMultiplier;
      difference = totalWithTax - totalSum;

      const salesSummary = data.reduce((acc, item) => {
        if (!acc[item.userName]) {
          acc[item.userName] = { sales: 0, totalSales: 0 };
        }
        acc[item.userName].sales += 1;
        acc[item.userName].totalSales += item.total;
        return acc;
      }, {});

      displayArray = Object.entries(salesSummary).map(([userName, summary]) => ({
        userName,
        sales: summary.sales,
        totalSales: summary.totalSales.toFixed(2),
      }));
      console.log(displayArray, 'disaplyeareray')

      salesData = Object.entries(salesSummary).map(([userName, summary], index) => ({
        [`sales${index + 1}`]: userName,
        [`salesTotal${index + 1}`]: summary.totalSales.toFixed(2),
      }));




      data.forEach((accOrder) => {
        if (!accOrder.Payments || !Array.isArray(accOrder.Payments)) {
          console.error('Payments array is missing or not an array in accOrder:', accOrder);
          return;
        }

        accOrder.Payments.forEach((payment) => {
          const { paymentType, cardType, amountPaid = 0.00 } = payment;

          console.log('Processing payment:', paymentType, cardType, amountPaid); // Log payment details

          switch (paymentType) {
            case 'Cash':
              newCashTotal += amountPaid;
              break;
            case 'Debit':
              newDebitTotal += amountPaid;
              break;
            case 'Credit Card':
              newCreditTotal += amountPaid;
              console.log('Processing Credit Card payment with cardType:', cardType); // Log card type

              if (cardType === 'Visa') {
                newVisaTotal += amountPaid;
              } else if (cardType === 'Mastercard') {
                newMastercardTotal += amountPaid;
              } else if (cardType === 'AMEX') {
                newAmexTotal += amountPaid;
              } else {
                console.warn('Unexpected card type:', cardType);
              }
              break;
            case 'Cheque':
              newChequeTotal += amountPaid;
              break;
            case 'Online Transaction':
              newOnlineTotal += amountPaid;
              break;
            case 'E-Transfer':
              newETransferTotal += amountPaid;
              break;
            default:
              console.warn('Unexpected payment type:', paymentType);
              break;
          }
        });
      });

    }



    setSubTotal(totalSum.toFixed(2));
    setTotal(totalWithTax.toFixed(2));
    setTax(difference.toFixed(2));
    setSalesPeople(displayArray);
    setCashTotal(newCashTotal.toFixed(2));
    setDebitTotal(newDebitTotal.toFixed(2));
    setCreditTotal(newCreditTotal.toFixed(2));
    setChequeTotal(newChequeTotal.toFixed(2));
    setOnlineTotal(newOnlineTotal.toFixed(2));
    setETransferTotal(newETransferTotal.toFixed(2));
    setVisaTotal(newVisaTotal.toFixed(2));
    setMastercardTotal(newMastercardTotal.toFixed(2));
    setAmexTotal(newAmexTotal.toFixed(2));

    toReceipt = {
      "dateNow": dateNow,
      "dept": dept,
      "subTotal": subTotal,
      "tax": tax,
      "total": total,
      "cashTotal": cashTotal,
      "debitTotal": debitTotal,
      "creditTotal": creditTotal,
      "chequeTotal": chequeTotal,
      "onlineTotal": onlineTotal,
      "eTransferTotal": eTransferTotal,
      "visaTotal": visaTotal,
      "mastercardTotal": mastercardTotal,
      "amexTotal": amexTotal,
      ...salesData
    };

  }




  return (
    <div className='grid grid-cols-1 md:grid-cols-2 w-6xl mx-auto'>
      <div className='mx-auto'>
        <Card className="overflow-hidden m-4 w-[350px]" x-chunk="dashboard-05-chunk-4"          >
          <CardHeader className="flex flex-row items-start bg-muted/50">
            <div className="grid gap-0.5">
              <CardTitle className="group flex items-center gap-2 text-lg">
                Pick Date for Report
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6 text-sm h-auto max-h-[600px] overflow-y-auto">
            <div className=' mt-5 flex-col mx-auto justify-center'>
              <div className="mx-auto w-[280px] rounded-md border-border   px-3 text-foreground " >
                <div className='  my-3 flex justify-center   '>
                  <CalendarIcon className="mr-2 size-8 " />
                  {date ? format(date, "PPP") : <span>{format(newDate, "PPP")}</span>}
                </div>
                <SmallCalendar
                  className='mx-auto w-auto   bg-[#020817] text-foreground'
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </div>
              <div className='mx-auto'>


              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3 border-border">
            <div className="relative mt-4 mx-auto">
              <Select
                name='dept'
                onValueChange={(value) => {
                  setDept(value)

                }}>
                <SelectTrigger className="w-[200px]" >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className='border-border'>
                  <SelectGroup>
                    <SelectLabel>Dept</SelectLabel>
                    <SelectItem value="Accessories">Accessories</SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="Service">Service</SelectItem>
                    <SelectItem value="Parts">Parts</SelectItem>
                    <SelectItem value="Online Store">Online Store</SelectItem>
                    <SelectItem value="All Depts">All Depts</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-muted/50 transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Dept</label>
            </div>
            <Button
              size='sm'
              disabled={!dept}
              className='text-foreground'
              onClick={FetchReport}
            >
              Generate
            </Button>

          </CardFooter>
        </Card>
      </div>
      <div className='mx-auto'>
        <Card className="overflow-hidden  m-4 w-[450px]" x-chunk="dashboard-05-chunk-4"          >
          <CardHeader className="flex flex-row items-start bg-muted/50">
            <div className="grid gap-0.5">
              <CardTitle className="group flex items-center gap-2 text-lg">
                End of Day Report
              </CardTitle>
              <CardDescription>
                <p>{dateNow}</p>
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-6 text-sm h-auto max-h-[850px] overflow-y-auto">
            <div className="font-semibold text-xl mt-3">Sales Summary</div>
            <Separator className="mb-4" />
            <ul className="grid gap-3">
              <li className="flex items-center justify-between">
                <p className='text-muted-foreground'>Sub Total</p>
                <p>${subTotal}</p>
              </li>
              <li className="flex items-center justify-between">
                <p className='text-muted-foreground'>Tax</p>
                <p>${tax}</p>
              </li>
              <Separator className="mb-4" />
              <li className="flex items-center justify-between">
                <p className='text-muted-foreground  text-xl'>Total</p>
                <p>${total}</p>
              </li>
            </ul>

            <div className="font-semibold  text-xl mt-3">Open Order Sales</div>
            <Separator className="mb-4" />
            <ul className="grid gap-3">
              <li className="flex items-center justify-between">
                <p className='text-muted-foreground'>Sub Total</p>
                <p>$0.00</p>
              </li>
              <li className="flex items-center justify-between">
                <p className='text-muted-foreground'>Tax</p>
                <p>$0.00</p>
              </li>
              <Separator className="mb-4" />
              <li className="flex items-center justify-between">
                <p className='text-muted-foreground  text-xl'>Total</p>
                <p>${total}</p>
              </li>
            </ul>

            <div className="font-semibold  text-xl mt-3">Sales by Employee</div>
            <Separator className="mb-4" />
            <ul>
              {salesPeople.map((item, index) => (
                <li className="flex items-center justify-between" key={index}>
                  <p className='text-muted-foreground  '> {item.userName}</p>
                  <p>{item.sales} sales, Total: ${item.totalSales}</p>
                </li>
              ))}
            </ul>

            <div className="font-semibold  text-xl mt-3">Payment Details</div>
            <Separator className="mb-4" />
            <ul className="grid gap-3">
              <li className="flex items-center justify-between">
                <p className='text-muted-foreground'>Cash</p>
                <p>${cashTotal}</p>
              </li>
              <li className="flex items-center justify-between">
                <p className='text-muted-foreground'>Debit</p>
                <p>${debitTotal}</p>
              </li>
              <li className="flex items-center justify-between">
                <p className='text-muted-foreground  '>Credit Card</p>
                <p>${creditTotal}</p>
              </li>
              <li className="flex items-center justify-between">
                <p className='text-muted-foreground  '>Cheque</p>
                <p>${chequeTotal}</p>
              </li>
              <li className="flex items-center justify-between">
                <p className='text-muted-foreground  '>Online Transaction</p>
                <p>${onlineTotal}</p>
              </li>
              <li className="flex items-center justify-between">
                <p className='text-muted-foreground  '>E-Transfer</p>
                <p>${eTransferTotal}</p>
              </li>
            </ul>

            <div className="font-semibold  text-xl mt-3">Credit Card Breakdown</div>
            <Separator className="mb-4" />
            <ul className="grid gap-3">
              <li className="flex items-center justify-between">
                <p className='text-muted-foreground'>Visa</p>
                <p>${visaTotal}</p>
              </li>
              <li className="flex items-center justify-between">
                <p className='text-muted-foreground'>Mastercard</p>
                <p>${mastercardTotal}</p>
              </li>
              <li className="flex items-center justify-between">
                <p className='text-muted-foreground'>AMEX</p>
                <p>${amexTotal}</p>
              </li>
            </ul>
          </CardContent>
          <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3 border-border">

            <Button size='sm' className='text-foreground' onClick={() => {
              console.log(toReceipt)
              PrintEndofDay(toReceipt)
            }}>Print</Button>
          </CardFooter>
        </Card>
      </div>

    </div>
  )
}
