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
import { CalendarIcon, ClockIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import { Calendar as SmallCalendar } from '~/components/ui/calendar';
import { PrintEndofDay } from "~/routes/__authorized/dealer/document/printEndOfDay";
import { Calendar } from "~/components/ui/calendar"
import { PrintEndofDaySales } from "../../document/printEndOfDaySales";
import { PrintEndofDayService } from "../../document/printEndOfDayService";

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
  };
  const newDate = new Date()
  const [date, setDate] = useState<Date>(newDate)
  const [dept, setDept] = useState()
  const [shouldFetch, setShouldFetch] = useState(false)
  const [subTotal, setSubTotal] = useState(0.00)
  const [tax, setTax] = useState(0.00)
  const [total, setTotal] = useState(0.00)
  const [salesPeople, setSalesPeople] = useState([])
  const [data, setData] = useState()
  const taxMultiplier = 1 + (fees.userTax / 100)
  const taxRate = taxMultiplier
  const [cashTotal, setCashTotal] = useState(0.00);
  const [debitTotal, setDebitTotal] = useState(0.00);
  const [creditTotal, setCreditTotal] = useState(0.00);
  const [chequeTotal, setChequeTotal] = useState(0.00);
  const [onlineTotal, setOnlineTotal] = useState(0.00);
  const [eTransferTotal, setETransferTotal] = useState(0.00);
  const [visaTotal, setVisaTotal] = useState(0.00);
  const [mastercardTotal, setMastercardTotal] = useState(0.00);
  const [amexTotal, setAmexTotal] = useState(0.00);
  const [finance, setFinance] = useState(0.00);

  const [serviceSubTotal, setServiceSubTotal] = useState(0.00);
  const [partsSubTotal, setPartsSubTotal] = useState(0.00);
  const [serviceHours, setServiceHours] = useState(0.00);
  const [serviceHoursVar, setServiceHoursVar] = useState(0.00);
  const [adjustedService, setAdjustedService] = useState(false);
  const [totalPreTax, setTotalPreTax] = useState(0.00);
  const [totalAmountPaid, setTotalAmountPaid] = useState(0.00);
  const [discPer, setDiscPer] = useState(0.00);
  const [discDollar, setDiscDollar] = useState(0.00);


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
  let toReceiptService
  let salesData: any = [];
  let toReceiptSales
  let displayArray: any = []

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
    let totalTime = 0.00
    let totalHours = 0.00
    let subTotalSum

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
    }
    if (dept === 'Parts') {
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

      salesData = Object.entries(salesSummary).map(([userName, summary], index) => ({
        [`sales${index + 1}`]: userName,
        [`salesTotal${index + 1}`]: summary.totalSales.toFixed(2),
      }));

      data.forEach((partOrder) => {
        if (!partOrder.Payments || !Array.isArray(partOrder.Payments)) {
          console.error('Payments array is missing or not an array in partOrder:', partOrder);
          return;
        }

        partOrder.Payments.forEach((payment) => {
          const { paymentType, cardType, amountPaid = 0.00 } = payment;

          switch (paymentType) {
            case 'Cash':
              newCashTotal += amountPaid;
              break;
            case 'Debit':
              newDebitTotal += amountPaid;
              break;
            case 'Credit Card':
              newCreditTotal += amountPaid;
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
    }
    const handlePayments = (order, totals) => {
      if (!order.Payments || !Array.isArray(order.Payments)) {
        console.error('Payments array is missing or not an array in order:', order);
        return;
      }
      order.Payments.forEach(({ paymentType, cardType, amountPaid = 0 }) => {
        const amount = isNaN(amountPaid) ? 0 : amountPaid;
        switch (paymentType) {
          case 'Cash': totals.newCashTotal += amount; break;
          case 'Debit': totals.newDebitTotal += amount; break;
          case 'Credit Card':
            totals.newCreditTotal += amount;
            switch (cardType) {
              case 'Visa': totals.newVisaTotal += amount; break;
              case 'Mastercard': totals.newMastercardTotal += amount; break;
              case 'AMEX': totals.newAmexTotal += amount; break;
              default: console.warn('Unexpected card type:', cardType);
            }
            break;
          case 'Cheque': totals.newChequeTotal += amount; break;
          case 'Online Transaction': totals.newOnlineTotal += amount; break;
          case 'E-Transfer': totals.newETransferTotal += amount; break;
          default: console.warn('Unexpected payment type:', paymentType);
        }
      });
    };

    if (dept === 'Service') {
      // -- mine
      const orders = data;

      let totalPartsSub = 0.00;
      let totalServiceHours = 0.00;
      let totalServiceSub = 0.00;
      let totalPreTax = 0.00;
      let totalAmountPaid = 0.00;
      let totalWorkOrderTime = 0.00;

      orders.forEach(order => {
        const partsSub = order?.AccOrders?.reduce((total, accOrder) => {
          return total + accOrder?.AccessoriesOnOrders?.reduce((subTotal, accessoryOnOrder) => {
            return subTotal + (accessoryOnOrder.accessory.price * accessoryOnOrder.quantity);
          }, 0);
        }, 0) || 0;

        totalPartsSub += parseFloat(partsSub);

        const serviceSub = order?.ServicesOnWorkOrders?.reduce((total, serviceOnOrder) => {
          const hours = serviceOnOrder.hr || serviceOnOrder.service.estHr || 0;
          const quantity = serviceOnOrder.quantity || 1;
          const subtotal = hours * fees.userLabour * quantity;
          return total + subtotal;
        }, 0) || 0;

        totalServiceSub += parseFloat(serviceSub);

        const serviceHoursTotal = order?.ServicesOnWorkOrders?.reduce((total, serviceOnOrder) => {
          const hours = serviceOnOrder.hr ?? serviceOnOrder.service.estHr ?? 0;
          const quantity = serviceOnOrder.quantity ?? 1;
          return total + (hours * quantity);
        }, 0) || 0;

        totalServiceHours += serviceHoursTotal;

        const totalAmountPaidForOrder = order.Payments?.reduce((total, payment) => {
          return total + payment.amountPaid;
        }, 0) || 0;

        totalAmountPaid += totalAmountPaidForOrder;

        if (order.WorkOrderClockEntries) {
          const workOrderTime = order.WorkOrderClockEntries.reduce((acc, entry) => {
            if (entry.start && entry.end) {
              const startTime = new Date(entry.start);
              const endTime = new Date(entry.end);
              const duration = (endTime - startTime) / (1000 * 60 * 60);
              return acc + duration;
            }
            return acc;
          }, 0);
          totalWorkOrderTime += workOrderTime;
        }
      });

      const adjustedServiceSub = totalServiceHours * fees.userLabour;
      const finalServiceSubTotal = adjustedService ? adjustedServiceSub.toFixed(2) : totalServiceSub.toFixed(2);
      setServiceSubTotal(finalServiceSubTotal);

      totalPreTax = totalPartsSub + totalServiceSub;
      setTotalPreTax(totalPreTax.toFixed(2));

      const total1 = (((((totalPartsSub + totalServiceSub) * (100 - parseFloat(discPer))) / 100) * taxRate)).toFixed(2);

      const total2 = ((totalPartsSub + totalServiceSub - parseFloat(discDollar)) * taxRate).toFixed(2);
      const calculatedTotal = discPer > 0.00 ? total1 : total2;

      setTotal(parseFloat(calculatedTotal));

      setTotalAmountPaid(totalAmountPaid);

      setServiceHours(totalServiceHours);
      setSubTotal(totalPreTax);
      setTotal(totalPreTax * taxRate);
      setTax((totalPreTax * taxRate) - totalPreTax);
      // -- mine

      const totals = { newCashTotal: 0, newDebitTotal: 0, newCreditTotal: 0, newVisaTotal: 0, newMastercardTotal: 0, newAmexTotal: 0, newChequeTotal: 0, newOnlineTotal: 0, newETransferTotal: 0 };

      data.forEach(serviceOrder => handlePayments(serviceOrder, totals));
      const displayArray = data.map((order, index) => {
        const orderTotal = order.Payments.reduce((total, payment) => total + payment.amountPaid, 0);
        return {
          [`salesPer${index + 1}`]: order.userName || order.writer || 'Unknown',
          [`amout${index + 1}`]: order.length || 'Unknown',
          [`spTotal${index + 1}`]: orderTotal.toFixed(2) || '0.00',
        };
      });

      setSalesPeople(displayArray);

      setCashTotal(totals.newCashTotal.toFixed(2));
      setDebitTotal(totals.newDebitTotal.toFixed(2));
      setCreditTotal(totals.newCreditTotal.toFixed(2));
      setVisaTotal(totals.newVisaTotal.toFixed(2));
      setMastercardTotal(totals.newMastercardTotal.toFixed(2));
      setAmexTotal(totals.newAmexTotal.toFixed(2));
      setChequeTotal(totals.newChequeTotal.toFixed(2));
      setOnlineTotal(totals.newOnlineTotal.toFixed(2));
      setETransferTotal(totals.newETransferTotal.toFixed(2));
    }

    if (dept === 'Sales') {
      totalSum = data.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0);
      totalWithTax = totalSum * taxMultiplier;
      difference = totalWithTax - totalSum;

      const totals = {
        newCashTotal: 0,
        newDebitTotal: 0,
        newCreditTotal: 0,
        newVisaTotal: 0,
        newMastercardTotal: 0,
        newAmexTotal: 0,
        newChequeTotal: 0,
        newOnlineTotal: 0,
        newETransferTotal: 0,
      };

      data.forEach(salesOrder => handlePayments(salesOrder, totals));

      displayArray = data.map((order, index) => {
        const accOrdersTotal = (order.AccOrders || []).reduce((total, accOrder) => {
          const accessoriesTotal = (accOrder.AccessoriesOnOrders || []).reduce((accTotal, accessory) => {
            return accTotal + (accessory.accessory.price * accessory.quantity || 0);
          }, 0);

          return total + accessoriesTotal;
        }, 0);
        return {
          [`salesPer${index + 1}`]: order.userName,
          [`amout${index + 1}`]: order.length || 0,
          [`accTotal${index + 1}`]: accOrdersTotal.toFixed(2) || '0.00',
          [`spTotal${index + 1}`]: order.total.toFixed(2) || '0.00',
        };
      });

      const accessoriesTotal = data.reduce((sum, order) => {
        return sum + (order.AccOrders || []).reduce((accSum, accOrder) => {
          return accSum + parseFloat(accOrder.AccessoriesOnOrder?.accessory || 0);
        }, 0);
      }, 0);
      const financeTotal = data.reduce((sum, order) => {
        if (order.delivered) {
          const remainingTotal = (parseFloat(order.total || 0) - parseFloat(order.deposit || 0));
          return sum + (remainingTotal > 0 ? remainingTotal : 0);
        }
        return sum;
      }, 0);
      setFinance(String(financeTotal))
      setPartsSubTotal(accessoriesTotal)
      setSalesPeople(displayArray);
      console.log(displayArray, 'dioplayarray')
      setSubTotal(totalSum.toFixed(2));
      setTotal(totalWithTax.toFixed(2));
      setTax(difference.toFixed(2));
      setCashTotal(totals.newCashTotal.toFixed(2));
      setDebitTotal(totals.newDebitTotal.toFixed(2));
      setCreditTotal(totals.newCreditTotal.toFixed(2));
      setVisaTotal(totals.newVisaTotal.toFixed(2));
      setMastercardTotal(totals.newMastercardTotal.toFixed(2));
      setAmexTotal(totals.newAmexTotal.toFixed(2));
      setChequeTotal(totals.newChequeTotal.toFixed(2));
      setOnlineTotal(totals.newOnlineTotal.toFixed(2));
      setETransferTotal(totals.newETransferTotal.toFixed(2));
    }

  }

  toReceipt = {
    "dateNow": date ? String(new Date(date).toLocaleDateString("en-US", options2)) : '',
    "dept": dept ? dept : '',
    "subTotal": subTotal ? subTotal : '',
    "tax": tax ? tax : '',
    "total": total ? total : '',
    "cashTotal": cashTotal ? cashTotal : '',
    "debitTotal": debitTotal ? debitTotal : '',
    "creditTotal": creditTotal ? creditTotal : '',
    "chequeTotal": chequeTotal ? chequeTotal : '',
    "onlineTotal": onlineTotal ? onlineTotal : '',
    "eTransferTotal": eTransferTotal ? eTransferTotal : '',
    "visaTotal": visaTotal ? visaTotal : '',
    "mastercardTotal": mastercardTotal ? mastercardTotal : '',
    "amexTotal": amexTotal ? amexTotal : '',

  };
  toReceiptService = {
    "dateNow": date ? String(new Date(date).toLocaleDateString("en-US", options2)) : '',
    "dept": dept ? dept : '',
    "subTotal": subTotal ? subTotal : '',
    "total": total ? total : '',
    "cash": cashTotal ? cashTotal : '',
    "debit": debitTotal ? debitTotal : '',
    "credit": creditTotal ? creditTotal : '',
    "cheque": chequeTotal ? chequeTotal : '',
    "online": onlineTotal ? onlineTotal : '',
    "etransfer": eTransferTotal ? eTransferTotal : '',
    "visa": visaTotal ? visaTotal : '',
    "mastercard": mastercardTotal ? mastercardTotal : '',
    "amex": amexTotal ? amexTotal : '',
    serviceSub: serviceSubTotal,
    partsSub: partsSubTotal,
    difference: tax,

  };
  toReceiptSales = {
    dateNow: date ? String(new Date(date).toLocaleDateString("en-US", options2)) : '',
    dept: dept || '',
    subTotal: subTotal || '',
    total: total || '',
    cash: cashTotal || '',
    debit: debitTotal || '',
    credit: creditTotal || '',
    cheque: chequeTotal || '',
    online: onlineTotal || '',
    eTransfer: eTransferTotal || '',
    visa: visaTotal || '',
    mastercard: mastercardTotal || '',
    amex: amexTotal || '',
    serviceSub: serviceSubTotal,
    partsSub: partsSubTotal,
    finance: finance,
    difference: tax,
    ...salesPeople.reduce((acc, curr, index) => {
      acc[`spTotal${index + 1}`] = curr[`spTotal${index + 1}`] == null ? '' : curr[`spTotal${index + 1}`];
      acc[`amout${index + 1}`] = curr[`amout${index + 1}`] == null ? '' : curr[`amout${index + 1}`];
      acc[`salesPer${index + 1}`] = curr[`salesPer${index + 1}`] == null ? '' : curr[`salesPer${index + 1}`];
      acc[`accTotal${index + 1}`] = curr[`accTotal${index + 1}`] == null ? '' : curr[`accTotal${index + 1}`];
      return acc;
    }, {})

  };


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
                <Calendar
                  className='w-auto'
                  mode="single"
                  fromYear={1900}
                  selected={date}
                  onSelect={setDate}
                  disabled={(date) =>
                    date > new Date() || date < new Date("1900-01-01")
                  }
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
              className='text-foreground mt-2'
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
                <p>{new Date(date).toLocaleDateString("en-US", options2)}</p>
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
              {dept === 'Service' && (
                <li className="flex items-center justify-between">
                  <p className='text-muted-foreground'>Acc Sub Total</p>
                  <p>${subTotal}</p>
                </li>
              )}
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
              {dept === 'Parts' || dept === 'Accessories' && (
                <>
                  {salesPeople.map((item, index) => (
                    <li className="flex items-center justify-between" key={index}>
                      <p className='text-muted-foreground  '> {item.userName}</p>
                      <p>Sales: {item.sales} </p>
                      <p>Total: ${item.totalSales}</p>
                    </li>
                  ))}
                </>
              )}
              {dept === 'Sales' && (
                <>
                  {salesPeople.map((item, index) => (
                    <li className="flex items-center justify-between" key={index}>
                      <p className='text-muted-foreground  '> {item.salesPer}</p>
                      <p className='text-muted-foreground  '> Sales: {item.amout}</p>
                      <p>Acc Total:{item.accTotal}</p>
                      <p>Total: ${item.spTotal}</p>
                    </li>
                  ))}
                </>
              )}
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
              <li className="flex items-center justify-between">
                <p className='text-muted-foreground  '>Finance</p>
                <p>${finance}</p>
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

            <Button
              size='sm'
              className='text-foreground'
              onClick={() => {
                console.log(toReceipt, 'toReceipt')
                if (dept === 'Sales') {
                  console.log(toReceiptSales, 'toReceiptSales')
                  PrintEndofDaySales(toReceiptSales)
                }
                if (dept === 'Accessories' || dept === 'Parts') {
                  PrintEndofDay(toReceipt)
                  console.log(toReceipt, 'toReceiptSales')

                }
                if (dept === 'Service') {
                  PrintEndofDayService(toReceiptService)
                  console.log(toReceiptService, 'toReceiptSales')

                }
              }}>Print</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}


export const links: LinksFunction = () => [
  { rel: "icon", type: "image/svg", href: '/favicons/calendar.svg' },
];

export const meta = () => {
  return [
    { title: "End Of Day Report || ADMIN || Dealer Sales Assistant" },
    {
      property: "og:title",
      content: "Your very own assistant!",
    },
    {
      name: "description",
      content:
        "To help sales people achieve more. Every automotive dealer needs help, especialy the sales staff. Dealer Sales Assistant will help you close more deals more efficiently.",
      keywords: "Automotive Sales, dealership sales, automotive CRM",
    },
  ];
};
