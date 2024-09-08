import { isRouteErrorResponse, Outlet, Link, useLoaderData, useFetcher, Form, useSubmit, useLocation, useNavigate, useRouteError, useActionData } from "@remix-run/react";
import {
  buttonVariants,
  Debug,
  Icon,
  Logo,
  PageAdminHeader,
  RemixNavLink,
  SearchForm,
  Button,
  Input,
  Checkbox
} from "~/components";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion"
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  CreditCard,
  File,
  Home,
  LineChart,
  ListFilter,
  MoreVertical,
  Package,
  Package2,
  PanelLeft,
  Search,
  Settings,
  ShoppingCart,
  Truck,
  Users2,
  User,
  Tags,
  Receipt,
  Binary,
  FileClock,
  Wrench,
  User2,
  CalendarDays,
  Shirt,
  WrenchIcon,
  DollarSign,
  Cog,
  Calendar,
  Clipboard,
  Settings2
} from "lucide-react"
import { prisma } from "~/libs";
import { getSession } from '~/sessions/auth-session.server';
import { ActionFunction, json, LoaderFunction, redirect } from "@remix-run/node";
import { createCacheHeaders, createSitemap } from "~/utils";
import { model } from "~/models";
import { GetUser } from "~/utils/loader.server";
import financeFormSchema from "~/overviewUtils/financeFormSchema";
import { getUserById, updateUser, updateDealerFees, getDealerFeesbyEmail } from '~/utils/user.server'
import { useEffect, useState } from "react";
import { UploadIcon } from "lucide-react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";


export async function loader({ request, params }: LoaderFunction) {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")
  const user = await GetUser(email)
  if (!user) { redirect('/login') }
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  let sales = await prisma.finance.findMany({ where: { deliveredDate: { not: null } } })

  sales = sales.filter((sale) => {
    const deliveredDate = new Date(sale.deliveredDate);
    return (
      deliveredDate.getMonth() === currentMonth &&
      deliveredDate.getFullYear() === currentYear
    );
  });

  let acc = await prisma.accOrder.findMany({ where: { paid: true } })

  acc = acc.filter((sale) => {
    const paidDate = new Date(sale.paidDate);
    return (
      paidDate.getMonth() === currentMonth &&
      paidDate.getFullYear() === currentYear
    );
  });

  let workOrder = await prisma.workOrder.findMany({ where: { status: 'Closed' } })

  workOrder = workOrder.filter((sale) => {
    const paidDate = new Date(sale.closedAt);
    return (
      paidDate.getMonth() === currentMonth &&
      paidDate.getFullYear() === currentYear
    );
  });

  const commission = await prisma.dealer.findUnique({ where: { id: 1 } })
  return json(
    { user, commission, sales, acc, workOrder },
    { headers: createCacheHeaders(request) }
  );
}



export async function action({ request }: ActionFunction) {
  const formPayload = Object.fromEntries(await request.formData())
  const formData = financeFormSchema.parse(formPayload);
  const Input = financeFormSchema.parse(formPayload)
  const intent = formPayload.intent


  if (intent === 'salesCommission') {
    const update = await prisma.dealer.update({
      where: { id: 1 },
      data: { perSale: parseFloat(formPayload.perSale), percentage: parseFloat(formPayload.percentage), }
    })
    return update;
  }
  if (intent === 'serviceCommission') {
    const update = await prisma.dealer.update({
      where: { id: 1 },
      data: { writerPerSale: parseFloat(formPayload.writerPerSale), percentage: parseFloat(formPayload.percentage), }
    })
    return update;
  }
  if (intent === 'accCommission') {
    const update = await prisma.dealer.update({
      where: { id: 1 },
      data: { accPerSale: parseFloat(formPayload.accPerSale), accPercentage: parseFloat(formPayload.accPercentage), }
    })
    return update;
  }

  return null
}


export default function SettingsGenerral() {
  const { user, commission, sales, acc, workOrder } = useLoaderData()

  // sales
  console.log(sales, 'sales')
  const salesSummary = sales.reduce((acc, sale) => {
    if (!acc[sale.userName]) {
      acc[sale.userName] = { sales: 0, totalSales: 0 };
    }

    const saleTotal = parseFloat(sale.total) || 0;
    acc[sale.userName].sales += 1;
    acc[sale.userName].totalSales += saleTotal;

    return acc;
  }, {});

  const displayArray = Object.entries(salesSummary).map(([userName, summary]) => ({
    userName,
    sales: summary.sales,
    totalSales: summary.totalSales.toFixed(2),
  }));

  // accessories
  const accSummary = acc.reduce((acc, item) => {
    if (!acc[item.userName]) {
      acc[item.userName] = { sales: 0, totalSales: 0 };
    }

    const saleTotal = parseFloat(item.total) || 0;
    acc[item.userName].sales += 1;
    acc[item.userName].totalSales += saleTotal;

    return acc;
  }, {});
  const displayAcc = Object.entries(accSummary).map(([userName, summary]) => ({
    userName,
    sales: summary.sales,
    totalSales: summary.totalSales.toFixed(2),
  }));

  // service writer
  const WOSummary = workOrder.reduce((acc, item) => {
    if (!acc[item.userName]) {
      acc[item.userName] = { sales: 0, totalSales: 0 };
    }

    const saleTotal = parseFloat(item.total) || 0;
    acc[item.userName].sales += 1;
    acc[item.userName].totalSales += saleTotal;

    return acc;
  }, {});
  const displayWO = Object.entries(WOSummary).map(([userName, summary]) => ({
    userName,
    sales: summary.sales,
    totalSales: summary.totalSales.toFixed(2),
  }));



  const [checkboxState, setCheckboxState] = useState(
    displayArray.map(() => ({ perSale: false, percentage: false }))
  );

  const handleCheckboxChange = (index, type) => {
    setCheckboxState((prevState) => {
      const newState = [...prevState];
      newState[index][type] = !newState[index][type];
      return newState;
    });
  };

  return (
    <div className="grid gap-6">
      <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
        <AccordionItem value="item-1" className='border-border'>
          <AccordionTrigger className='border-border'>Sales</AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-6">

              <Card x-chunk="dashboard-04-chunk-1">
                <Form method="post" className="">
                  <CardHeader>
                    <CardTitle>Commissions - Sales</CardTitle>
                    <CardDescription>
                      Breakdown of all the employees performance. For percentage 0.10 for 10% or 0.06 for 6%.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="relative mt-4">
                      <Input
                        name='perSale'
                        defaultValue={commission.perSale}
                        className={` bg-background text-foreground border border-border`}
                      />
                      <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">Per Sale</label>
                    </div>
                    <div className="relative mt-4">
                      <Input
                        placeHolder=''
                        name='percentage'
                        defaultValue={commission.percentage}
                        className={` bg-background text-foreground border border-border`}
                      />
                      <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">Percentage</label>
                    </div>
                    <Button size='sm' type='submit' name='intent' value='salesCommission' className='mt-4'>Submit</Button>
                  </CardContent>
                </Form>
              </Card>

              <Card x-chunk="dashboard-04-chunk-1">
                <Form method="post" className="">
                  <CardHeader>
                    <CardTitle>Sales</CardTitle>
                    <CardDescription>
                      Breakdown of all the employees performance.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table className='overflow-x-scroll mt-3 w-auto max-w-[400px]'>
                      <TableHeader>
                        <TableRow className='border-border'>
                          <TableHead className="w-[250px] mx-auto text-center">Name</TableHead>
                          <TableHead className="w-[100px] mx-auto text-center"># of Sales</TableHead>
                          <TableHead className="text-center w-[150px]">Total Sales Revenue</TableHead>
                          <TableHead className="hidden md:table-cell w-[250px] mx-auto text-center">Bonus</TableHead>
                          <TableHead className="hidden md:table-cell w-[250px] mx-auto text-center">Enable Per Sale</TableHead>
                          <TableHead className="hidden md:table-cell w-[250px] mx-auto text-center">Enable Percentage</TableHead>
                          <TableHead className="hidden md:table-cell w-[250px] mx-auto text-center">Commission</TableHead>
                          <TableHead className="hidden md:table-cell w-[250px] mx-auto text-center">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {displayArray &&
                          displayArray.map((result, index) => {
                            const [bonus, setBonus] = useState(0.00);

                            let commissions = 0;

                            if (checkboxState[index].perSale && checkboxState[index].percentage) {
                              commissions = (result.sales * commission.perSale) + (result.totalSales * commission.percentage);
                            } else if (checkboxState[index].perSale) {
                              commissions = result.sales * commission.perSale;
                            } else if (checkboxState[index].percentage) {
                              commissions = result.totalSales * commission.percentage;
                            }

                            const grandTotal = commissions + bonus;
                            return (
                              <TableRow key={index} className="rounded-[6px] hover:bg-accent border-border"                          >
                                <TableCell className="tableCell w-auto min-w-[100px]">
                                  <p className='mx-auto text-center'>{result.userName}</p>
                                </TableCell>
                                <TableCell className="tableCell hidden sm:table-cell  w-auto min-w-[75px]">
                                  <p className='mx-auto text-center'>{result.sales}</p>
                                </TableCell>
                                <TableCell className="tableCell text-right  w-auto min-w-[200px]">
                                  <p className='mx-auto text-center'>{result.totalSales}</p>
                                </TableCell>

                                <TableCell className="tableCell text-right w-auto min-w-[100px]">
                                  <p className='mx-auto text-center'>
                                    <Input
                                      className='w-[50px] mx-auto'
                                      type="number"
                                      onChange={(e) => setBonus(parseFloat(e.currentTarget.value) || 0)}
                                    />
                                  </p>
                                </TableCell>

                                <TableCell className="tableCell text-right w-auto min-w-[100px]">

                                  <Checkbox
                                    className='mx-auto'
                                    checked={checkboxState[index].perSale}
                                    onCheckedChange={(checked) => {
                                      handleCheckboxChange(index, 'perSale');
                                    }}
                                  />
                                </TableCell>

                                <TableCell className="tableCell text-right w-auto min-w-[100px]">
                                  <Checkbox
                                    className='mx-auto'
                                    checked={checkboxState[index].percentage}
                                    onCheckedChange={(checked) => {
                                      handleCheckboxChange(index, 'percentage');
                                    }}
                                  />
                                </TableCell>
                                <TableCell className="tableCell text-right w-auto min-w-[100px]">
                                  <p className='mx-auto text-center'>{commissions.toFixed(2)}</p>
                                </TableCell>
                                <TableCell className="tableCell text-right w-auto min-w-[100px]">
                                  <p className='mx-auto text-center'>{grandTotal.toFixed(2)}</p>
                                </TableCell>
                              </TableRow>
                            )
                          })}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Form>
              </Card>
            </div>

          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2" className='border-border'>
          <AccordionTrigger>Accessories</AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-6">
              <Card x-chunk="dashboard-04-chunk-1">
                <Form method="post" className="">
                  <CardHeader>
                    <CardTitle>Commissions - Accessories</CardTitle>
                    <CardDescription>
                      Breakdown of all the employees performance. For percentage 0.10 for 10% or 0.06 for 6%.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="relative mt-4">
                      <Input
                        name='accPerSale'
                        defaultValue={commission.accPerSale}
                        className={` bg-background text-foreground border border-border`}
                      />
                      <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">Per Sale</label>
                    </div>
                    <div className="relative mt-4">
                      <Input
                        name='accPercentage'
                        defaultValue={commission.accPercentage}
                        className={` bg-background text-foreground border border-border`}
                      />
                      <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">Percentage</label>
                    </div>
                    <Button size='sm' type='submit' name='intent' value='accCommission' className='mt-4'>Submit</Button>
                  </CardContent>
                </Form>
              </Card>

              <Card x-chunk="dashboard-04-chunk-1">
                <Form method="post" className="">
                  <CardHeader>
                    <CardTitle>Accessories</CardTitle>
                    <CardDescription>
                      Breakdown of all the employees performance.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table className='overflow-x-scroll mt-3 w-auto max-w-[400px]'>
                      <TableHeader>
                        <TableRow className='border-border'>
                          <TableHead className="w-[250px] mx-auto text-center">Name</TableHead>
                          <TableHead className="w-[100px] mx-auto text-center"># of Sales</TableHead>
                          <TableHead className="text-center w-[150px]">Total Sales Revenue</TableHead>
                          <TableHead className="hidden md:table-cell w-[250px] mx-auto text-center">Bonus</TableHead>
                          <TableHead className="hidden md:table-cell w-[250px] mx-auto text-center">Enable Per Sale</TableHead>
                          <TableHead className="hidden md:table-cell w-[250px] mx-auto text-center">Enable Percentage</TableHead>
                          <TableHead className="hidden md:table-cell w-[250px] mx-auto text-center">Commission</TableHead>
                          <TableHead className="hidden md:table-cell w-[250px] mx-auto text-center">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {displayAcc &&
                          displayAcc.map((result, index) => {
                            const [bonus, setBonus] = useState(0.00);

                            let commissions = 0;

                            if (checkboxState[index].perSale && checkboxState[index].percentage) {
                              commissions = (result.sales * commission.perSale) + (result.totalSales * commission.percentage);
                            } else if (checkboxState[index].perSale) {
                              commissions = result.sales * commission.perSale;
                            } else if (checkboxState[index].percentage) {
                              commissions = result.totalSales * commission.percentage;
                            }

                            const grandTotal = commissions + bonus;
                            return (
                              <TableRow key={index} className="rounded-[6px] hover:bg-accent border-border"                          >
                                <TableCell className="tableCell w-auto min-w-[100px]">
                                  <p className='mx-auto text-center'>{result.userName}</p>
                                </TableCell>
                                <TableCell className="tableCell hidden sm:table-cell  w-auto min-w-[75px]">
                                  <p className='mx-auto text-center'>{result.sales}</p>
                                </TableCell>
                                <TableCell className="tableCell text-right  w-auto min-w-[200px]">
                                  <p className='mx-auto text-center'>{result.totalSales}</p>
                                </TableCell>

                                <TableCell className="tableCell text-right w-auto min-w-[100px]">
                                  <p className='mx-auto text-center'>
                                    <Input
                                      className='w-[50px] mx-auto'
                                      type="number"
                                      onChange={(e) => setBonus(parseFloat(e.currentTarget.value) || 0)}
                                    />
                                  </p>
                                </TableCell>

                                <TableCell className="tableCell text-right w-auto min-w-[100px]">
                                  <Checkbox
                                    className='mx-auto'
                                    checked={checkboxState[index].perSale}
                                    onCheckedChange={(checked) => {
                                      handleCheckboxChange(index, 'perSale');
                                    }}
                                  />
                                </TableCell>
                                <TableCell className="tableCell text-right w-auto min-w-[100px]">
                                  <Checkbox
                                    className='mx-auto'
                                    checked={checkboxState[index].percentage}
                                    onCheckedChange={(checked) => {
                                      handleCheckboxChange(index, 'percentage');
                                    }}
                                  />
                                </TableCell>
                                <TableCell className="tableCell text-right w-auto min-w-[100px]">
                                  <p className='mx-auto text-center'>{commissions.toFixed(2)}</p>
                                </TableCell>
                                <TableCell className="tableCell text-right w-auto min-w-[100px]">
                                  <p className='mx-auto text-center'>{grandTotal.toFixed(2)}</p>
                                </TableCell>
                              </TableRow>
                            )
                          })}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Form>
              </Card>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3" className='border-border'>
          <AccordionTrigger>Service Writer</AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-6">
              <Card x-chunk="dashboard-04-chunk-1">
                <Form method="post" className="">
                  <CardHeader>
                    <CardTitle>Commissions - Service Writer</CardTitle>
                    <CardDescription>
                      Breakdown of all the employees performance. For percentage 0.10 for 10% or 0.06 for 6%.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="relative mt-4">
                      <Input
                        name='writerPerSale'
                        defaultValue={commission.writerPerSale}
                        className={` bg-background text-foreground border border-border`}
                      />
                      <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">Per Sale</label>
                    </div>
                    <div className="relative mt-4">
                      <Input
                        name='writerPercentage'
                        defaultValue={commission.writerPercentage}
                        className={` bg-background text-foreground border border-border`}
                      />
                      <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">Percentage</label>
                    </div>
                    <Button size='sm' type='submit' name='intent' value='accCommission' className='mt-4'>Submit</Button>
                  </CardContent>
                </Form>
              </Card>

              <Card x-chunk="dashboard-04-chunk-1">
                <Form method="post" className="">
                  <CardHeader>
                    <CardTitle>Service</CardTitle>
                    <CardDescription>
                      Breakdown of all the employees performance.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table className='overflow-x-scroll mt-3 w-auto max-w-[400px]'>
                      <TableHeader>
                        <TableRow className='border-border'>
                          <TableHead className="w-[100px] mx-auto text-center"># of Sales</TableHead>
                          <TableHead className="text-center w-[150px]">Total Sales Revenue</TableHead>
                          <TableHead className="hidden md:table-cell w-[250px] mx-auto text-center">Bonus</TableHead>
                          <TableHead className="hidden md:table-cell w-[250px] mx-auto text-center">Enable Per Sale</TableHead>
                          <TableHead className="hidden md:table-cell w-[250px] mx-auto text-center">Enable Percentage</TableHead>
                          <TableHead className="hidden md:table-cell w-[250px] mx-auto text-center">Commission</TableHead>
                          <TableHead className="hidden md:table-cell w-[250px] mx-auto text-center">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {displayWO &&
                          displayWO.map((result, index) => {
                            const [bonus, setBonus] = useState(0.00);

                            let commissions = 0;

                            if (checkboxState[index].perSale && checkboxState[index].percentage) {
                              commissions = (result.sales * commission.perSale) + (result.totalSales * commission.percentage);
                            } else if (checkboxState[index].perSale) {
                              commissions = result.sales * commission.perSale;
                            } else if (checkboxState[index].percentage) {
                              commissions = result.totalSales * commission.percentage;
                            }

                            const grandTotal = commissions + bonus;
                            return (
                              <TableRow key={index} className="rounded-[6px] hover:bg-accent border-border"                          >
                                <TableCell className="tableCell w-auto min-w-[100px]">
                                  <p className='mx-auto text-center'>{result.userName}</p>
                                </TableCell>
                                <TableCell className="tableCell hidden sm:table-cell  w-auto min-w-[75px]">
                                  <p className='mx-auto text-center'>{result.sales}</p>
                                </TableCell>
                                <TableCell className="tableCell text-right  w-auto min-w-[200px]">
                                  <p className='mx-auto text-center'>{result.totalSales}</p>
                                </TableCell>
                                <TableCell className="tableCell text-right w-auto min-w-[100px]">
                                  <p className='mx-auto text-center'>
                                    <Input
                                      className='w-[50px] mx-auto'
                                      type="number"
                                      onChange={(e) => setBonus(parseFloat(e.currentTarget.value) || 0)}
                                    />
                                  </p>
                                </TableCell>
                                <TableCell className="tableCell text-center w-auto min-w-[100px]">
                                  <Checkbox
                                    className='mx-auto'
                                    checked={checkboxState[index].perSale}
                                    onCheckedChange={(checked) => {
                                      handleCheckboxChange(index, 'perSale');
                                    }}
                                  />
                                </TableCell>
                                <TableCell className="tableCell text-center w-auto min-w-[100px]">
                                  <Checkbox
                                    className='mx-auto'
                                    checked={checkboxState[index].percentage}
                                    onCheckedChange={(checked) => {
                                      handleCheckboxChange(index, 'percentage');
                                    }}
                                  />
                                </TableCell>
                                <TableCell className="tableCell text-right w-auto min-w-[100px]">
                                  <p className='mx-auto text-center'>{commissions.toFixed(2)}</p>
                                </TableCell>
                                <TableCell className="tableCell text-right w-auto min-w-[100px]">
                                  <p className='mx-auto text-center'>{grandTotal.toFixed(2)}</p>
                                </TableCell>
                              </TableRow>
                            )
                          })}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Form>
              </Card>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

export const links: LinksFunction = () => [
  { rel: "icon", type: "image/svg", href: '/favicons/calendar.svg' },
];

export const meta = () => {
  return [
    { title: "Commissions Report || ADMIN || Dealer Sales Assistant" },
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
