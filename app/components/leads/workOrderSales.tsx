import React, { useEffect, useState, useRef, forwardRef, } from "react";
import {
  Banknote,
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
  Plus,
  Settings,
  ShoppingCart,
  Truck,
  User,
  Users2,
  Percent,
  PanelTop,
  Scan,
  X,
  Users2Icon,
} from "lucide-react";
import { Badge } from "~/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import { Progress } from "~/components/ui/progress";
import { Separator } from "~/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { Outlet, Link, useLoaderData, useFetcher, useNavigate, useSubmit, Form } from "@remix-run/react";
import { ActionFunction, json, LinksFunction, LoaderFunction, redirect } from "@remix-run/node";
import { GetUser } from "~/utils/loader.server";
import { getSession } from "~/sessions/auth-session.server";
import { prisma } from "~/libs";
import { Printer } from "lucide-react";
import { DollarSign } from "lucide-react";
import { toast } from "sonner";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import { cn } from "~/utils";
import { BanknoteIcon } from "lucide-react";
import { ArrowDownUp } from "lucide-react";
import { ClientOnly } from "remix-utils";
import useSWR from 'swr'
import ScanSound from '~/images/scan.mp4'
import { BrowserMultiFormatReader, BarcodeFormat, DecodeHintType, NotFoundException, ChecksumException, FormatException } from '@zxing/library';
import QRCode from 'react-qr-code';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import { Check } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination"
import axios from "axios";
import { FileCheck } from "lucide-react";
import PrintReceipt from "~/routes/__authorized/dealer/document/printReceiptAcc";
import { Users } from "lucide-react";
import { Activity } from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import { Avatar, TextArea } from "~/components";
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,

  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "~/components/ui/context-menu"
import { EditableText } from "~/components/actions/shared";
import { flushSync } from "react-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import { Wrench } from "lucide-react";




export default function WorkOrderSales({ orders, tax, dealerImage, services }) {
  console.log(orders, tax, services, ' inside workordersales')
  let formRef = useRef();
  let fetcher = useFetcher();
  let workOrder = useFetcher();
  let ref = useRef();
  const navigate = useNavigate()
  const submit = useSubmit();
  let addProduct = useFetcher();
  const [discount, setDiscount] = useState(false)
  const [order, setOrder] = useState()
  const [discDollar, setDiscDollar] = useState(0.00)
  const [discPer, setDiscPer] = useState(0.00)
  const [showPrev, setShowPrev] = useState(false)
  const [totalAccessoriesCost, setTotalAccessoriesCost] = useState(0.00);
  const [totalAmountPaid, setTotalAmountPaid] = useState(0.00);
  const [total, setTotal] = useState(0.00);
  const taxMultiplier = Number(tax.userTax);
  const taxRate = 1 + taxMultiplier / 100;
  const [paymentType, setPaymentType] = useState('');
  const [serviceSubTotal, setServiceSubTotal] = useState(0.00);
  const [partsSubTotal, setPartsSubTotal] = useState(0.00);
  const [totalPreTax, setTotalPreTax] = useState(0.00);
  const [input, setInput] = useState("");
  const inputLength = input.trim().length
  let payment = useFetcher();
  let search = useFetcher();
  let product = useFetcher();


  const options2 = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };

  let toReceipt
  useEffect(() => {
    if (order) {
      const client = order.Clientfile
      const maxAccessories = 19;

      toReceipt = {
        qrCode: order.workOrderId,
        subTotal: `$${totalAccessoriesCost.toFixed(2)}`,
        tax: `${tax.userTax}%`,
        total: `$${total}`,
        remaining: `$${parseFloat(total) - parseFloat(totalAmountPaid)}`,
        firstName: client.firstName,
        lastName: client.lastName,
        phone: client.phone,
        email: client.email,
        address: client.address,
        date: new Date().toLocaleDateString("en-US", options2),
        cardNum: '',
        paymentType: '',
        image: dealerImage.dealerLogo
      };

      let accessoryIndex = 0;
    }
    console.log(order, 'order');
  }, [order]);

  useEffect(() => {
    if (order) {
      const partsSub = order?.AccOrders?.reduce((total, accOrder) => {
        return total + accOrder?.AccessoriesOnOrders?.reduce((subTotal, accessoryOnOrder) => {
          return subTotal + (accessoryOnOrder.accessory.price * accessoryOnOrder.quantity);
        }, 0);
      }, 0);
      setPartsSubTotal(partsSub.toFixed(2))

      const serviceSub = order?.ServicesOnWorkOrders?.reduce((total, serviceOnOrder) => {
        const hours = serviceOnOrder.hr || serviceOnOrder.service.estHr || 0.00;

        const subtotal = hours * tax.userLabour * serviceOnOrder.quantity;

        return total + subtotal;
      }, 0);

      setServiceSubTotal(serviceSub.toFixed(2))

      const totalPreTax = partsSub + serviceSub;
      setTotalPreTax(totalPreTax.toFixed(2));

      const total2 = ((parseFloat(partsSub + serviceSub) - parseFloat(discDollar)) * taxRate).toFixed(2);
      const total1 = (((parseFloat(partsSub + serviceSub) * (100 - parseFloat(discPer))) / 100) * taxRate).toFixed(2);
      const calculatedTotal = discDollar && discDollar > 0.00 ? total1 : total2;

      setTotal(calculatedTotal);
      const totalAmountPaid2 = order.Payments.reduce((total, payment) => {
        return total + payment.amountPaid;
      }, 0);
      if (totalAmountPaid2) {
        setTotalAmountPaid(totalAmountPaid2)
      }
      console.log(partsSubTotal, serviceSubTotal, partsSubTotal + serviceSubTotal, 'totals')

    }
  }, [order]);

  const remaining = parseFloat(total) - parseFloat(totalAmountPaid)

  let unitCard = [
    { name: 'year', label: 'Year', },
    { name: 'brand', label: 'Brand', },
    { name: 'model', label: 'Model', },
    { name: 'color', label: 'Color', },
    { name: 'vin', label: 'VIN', },
    { name: 'trim', label: 'Trim', },
    { name: 'mileage', label: 'Mileage', },
    { name: 'location', label: 'Location', },
    { name: 'motor', label: 'Motor', },
    { name: 'tag', label: 'Tag', },
  ];

  const [firstPage, setFirstPage] = useState(true);
  const [secPage, setSecPage] = useState(false);

  function handleNextPage() {
    if (firstPage === true) {
      setFirstPage(false)
      setSecPage(true)
    }
    if (secPage === true) {
      setFirstPage(true)
      setSecPage(false)
    }
  }
  function handlePrevPage() {
    if (firstPage === true) {
      setFirstPage(false)
      setSecPage(true)
    }
    if (secPage === true) {
      setFirstPage(true)
      setSecPage(false)
    }
  }
  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
      <Tabs defaultValue="week">
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="week"> <File className="h-5 w-5" /></TabsTrigger>
            <TabsTrigger value="Parts"> <Wrench className="h-5 w-5" /></TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="week">
          <Card x-chunk="dashboard-05-chunk-3">
            <CardHeader className="px-7">
              <CardTitle>Work Order</CardTitle>
              <CardDescription>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className=' grid grid-cols-1'>
                <Accordion type="single" collapsible className="w-full border-border">
                  <AccordionItem value="item-1" className='border-border'>
                    <AccordionTrigger>Unit</AccordionTrigger>
                    <AccordionContent>
                      <div className='grid grid-cols-1'>
                        <Table>
                          <TableHeader>
                            <TableRow className='border-border'>
                              <TableHead>
                                Unit
                              </TableHead>
                              <TableHead>
                                Color
                              </TableHead>
                              <TableHead className="hidden md:table-cell">
                                Mileage
                              </TableHead>
                              <TableHead className="hidden md:table-cell">
                                VIN
                              </TableHead>
                              <TableHead className="hidden md:table-cell">
                                Motor
                              </TableHead>
                              <TableHead className="hidden md:table-cell">
                                Dept
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {order && order.Clientfile.ServiceUnit && order.Clientfile.ServiceUnit.map((result, index) => (
                              <TableRow key={index} className="hover:bg-accent border-border rounded-[6px] cursor-pointer" onClick={() => {
                                const formData = new FormData();
                                formData.append("unit", (`${result.year} ${result.brand} ${result.model}`));
                                formData.append("mileage", result.mileage);
                                formData.append("vin", result.vin);
                                formData.append("tag", result.tag);
                                formData.append("motor", result.motor);
                                formData.append("color", result.color);
                                formData.append("workOrderId", order.workOrderId);
                                formData.append("intent", 'addUnit');
                                submit(formData, { method: "post", });
                              }}>
                                <TableCell>
                                  <p>{result.year} {result.brand} {result.model}</p>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                  {result.mileage}
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                  {result.vin}
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                  {result.tag}
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                  {result.motor}
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                  <p>Service Units</p>
                                </TableCell>
                              </TableRow>
                            ))}
                            {order && order.Clientfile.Finance && order.Clientfile.Finance.map((result, index) => (
                              <TableRow key={index} className="hover:bg-accent border-border  rounded-[6px] cursor-pointer" onClick={() => {
                                const formData = new FormData();
                                formData.append("unit", (`${result.year} ${result.brand} ${result.model}`));
                                formData.append("mileage", result.mileage);
                                formData.append("vin", result.vin);
                                formData.append("tag", result.tag);
                                formData.append("motor", result.motor);
                                formData.append("color", result.color);
                                formData.append("workOrderId", order.workOrderId);
                                formData.append("intent", 'addUnit');
                                submit(formData, { method: "post", });
                              }}>
                                <TableCell>
                                  <p>{result.year} {result.brand} {result.model}</p>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                  {result.mileage}
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                  {result.vin}
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                  {result.tag && (result.tag)}
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                  {result.motor && (result.motor)}
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                  <p>Finance Units</p>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                        <Dialog>
                          <DialogTrigger>
                            <Button size='sm' className='text-foreground mt-4 w-[75px]' >
                              New Unit
                            </Button>
                          </DialogTrigger>
                          <DialogContent className='border-border'>
                            <DialogHeader>
                              <DialogTitle>Add New Unit To Client File</DialogTitle>
                              <DialogDescription>
                              </DialogDescription>
                            </DialogHeader>
                            <>
                              <Form method='post' >
                                <input type='hidden' name='clientfileId' value={order.Clientfile.id} />
                                <input type='hidden' name='workOrderId' value={order.workOrderId} />
                                <div className='grid grid-cols-1'>
                                  {unitCard.map((user, index) => (
                                    <div key={index} className="relative mt-4">
                                      <Input
                                        name={user.name}
                                        className={` bg-background text-foreground border border-border`}
                                      />
                                      <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">{user.label}</label>
                                    </div>
                                  ))}
                                  <Button size='sm' className='text-foreground mt-4'
                                    type='submit'
                                    name='intent'
                                    value='addNewServiceUnit' >
                                    Submit
                                  </Button>
                                </div>
                              </Form>
                            </>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                <p className='mt-4 mb-5'></p>
                <div className="grid gap-3">
                  <div className="font-semibold">Work Order Services</div>
                  <ul className="grid gap-3">
                    {order.ServicesOnWorkOrders && order.ServicesOnWorkOrders.map((result, index) => {
                      const hours = result.hr || result.service.estHr || 0.00;

                      return (
                        <li key={index} className="flex items-center justify-between">
                          <div>
                            <ContextMenu>
                              <ContextMenuTrigger>
                                <div className='grid grid-cols-1'>
                                  <div className='flex items-center group '>
                                    <div className="font-medium flex-col">
                                      <p>{result.service.service}</p>
                                      <p className='text-muted-foreground'>{result.service.description}</p>
                                    </div>
                                    <addProduct.Form method="post" ref={formRef} className='mr-auto'>
                                      <input type="hidden" name="id" value={result.id} />
                                      <input type='hidden' name='total' value={total} />
                                      <input type='hidden' name='workOrderId' value={order.workOrderId} />
                                      <Button
                                        size="icon"
                                        variant="outline"
                                        name="intent" value='deleteServiceItem'
                                        className=" ml-2 bg-primary  opacity-0 transition-opacity group-hover:opacity-100"
                                        type='submit'
                                      >
                                        <X className="h-4 w-4 text-foreground" />
                                      </Button>
                                    </addProduct.Form>
                                  </div>
                                  <div className="hidden text-sm text-muted-foreground md:inline">
                                    <div className='flex items-center'>
                                      <div className="font-medium">
                                        <EditableText
                                          value={hours}
                                          fieldName="name"
                                          inputClassName=" border border-border rounded-lg  text-foreground bg-background py-1 px-2  w-[75px]"
                                          buttonClassName="text-center py-1 px-2 text-muted-foreground"
                                          buttonLabel={`Edit name`}
                                          inputLabel={`Edit name`}
                                        >
                                          <input type="hidden" name="intent" value='updateHr' />
                                          <input type="hidden" name="id" value={result.id} />
                                          <input type="hidden" name="colName" value='hr' />
                                        </EditableText>

                                      </div>
                                      <p>/hrs{" "}{" "}@{" "}${tax.userLabour}</p>
                                    </div>
                                  </div>
                                  {result.status && (
                                    <div>
                                      <Badge className='text-sm  px-2 py-1 '>{result.status}</Badge>
                                    </div>
                                  )}
                                </div>
                              </ContextMenuTrigger>
                              <ContextMenuContent className='border-border'>
                                <ContextMenuSub>
                                  <ContextMenuSubTrigger inset>Service Details</ContextMenuSubTrigger>
                                  <ContextMenuSubContent className="w-48 border-border">
                                    <ContextMenuItem>{result.service.service}</ContextMenuItem>
                                    <ContextMenuItem>{result.service.description}</ContextMenuItem>
                                    <ContextMenuSeparator />
                                    <ContextMenuItem>
                                      Est. Hours
                                      <ContextMenuShortcut>{result.service.estHr}</ContextMenuShortcut>
                                    </ContextMenuItem>
                                    <ContextMenuItem>
                                      Price
                                      <ContextMenuShortcut>${result.service.price}</ContextMenuShortcut>
                                    </ContextMenuItem>
                                  </ContextMenuSubContent>
                                </ContextMenuSub>
                                <ContextMenuSeparator />
                                <ContextMenuCheckboxItem
                                  checked={result.status === 'In Stock'}
                                  onSelect={() => {
                                    const formData = new FormData();
                                    formData.append("id", result.id);
                                    formData.append("status", 'In Stock');
                                    formData.append("intent", 'updateServiceOnOrders');
                                    submit(formData, { method: "post", });
                                  }}
                                >In Stock</ContextMenuCheckboxItem>
                                <ContextMenuCheckboxItem
                                  checked={result.status === 'On Order'}
                                  onSelect={() => {
                                    const formData = new FormData();
                                    formData.append("id", result.id);
                                    formData.append("status", 'On Order');
                                    formData.append("intent", 'updateServiceOnOrders');
                                    submit(formData, { method: "post", });
                                  }}
                                >On Order</ContextMenuCheckboxItem>
                                <ContextMenuCheckboxItem
                                  checked={result.status === 'Completed'}
                                  onSelect={() => {
                                    const formData = new FormData();
                                    formData.append("id", result.id);
                                    formData.append("status", 'Completed');
                                    formData.append("intent", 'updateServiceOnOrders');
                                    submit(formData, { method: "post", });
                                  }}
                                >Completed</ContextMenuCheckboxItem>
                                <ContextMenuCheckboxItem
                                  checked={result.status === 'Back Order'}
                                  onSelect={() => {
                                    const formData = new FormData();
                                    formData.append("id", result.id);
                                    formData.append("status", 'Back Order');
                                    formData.append("intent", 'updateServiceOnOrders');
                                    submit(formData, { method: "post", });
                                  }}
                                >Back Order</ContextMenuCheckboxItem>
                              </ContextMenuContent>
                            </ContextMenu>
                          </div>
                          <span>
                            x{" "}{" "}{result.quantity}

                          </span>
                        </li>
                      )
                    })}
                  </ul>
                </div>
                <Separator className="my-4" />
                <div className="font-semibold">Services</div>

                <div className='grid grid-cols-2 mt-4'>
                  <div className='mx-4'>
                    <div className="font-semibold">Select Service</div>
                    <search.Form method="get" action='/dealer/service/search/services'>
                      <div className="relative ml-auto flex-1 md:grow-0 ">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          ref={ref}
                          type="search"
                          name="q"
                          onChange={e => {
                            search.submit(e.currentTarget.form);
                          }}
                          autoFocus
                          placeholder="Search..."
                          className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
                        />
                      </div>
                    </search.Form>
                    <ul className="grid gap-3 mt-3 h-auto max-h-[600px] overflow-y-auto">
                      {search.data && search.data.map((result, index) => {
                        return (
                          <li key={index} className="p-3 cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-[6px]" onClick={() => {
                            const formData = new FormData();
                            formData.append("hr", result.estHr);
                            formData.append("workOrderId", order.workOrderId);
                            formData.append("serviceId", result.id);
                            formData.append("intent", 'addServiceToWorkOrder');
                            submit(formData, { method: "post", });
                          }}>
                            <div className="font-medium flex-col">
                              <p className=' text-left'>{result.service}</p>
                              <p className='text-muted-foreground text-left'>{result.description}</p>
                              <p className='text-muted-foreground text-left'>{result.estHr}/hrs{" "}{" "}@{" "}${tax.userLabour}</p>
                            </div>
                          </li>
                        )
                      })}
                    </ul>

                  </div>
                  <div className='mx-4 flex-col'>
                    <Accordion type="single" collapsible className="w-full border-border">
                      <AccordionItem value="item-1" className='border-border'>
                        <AccordionTrigger>Add New Service</AccordionTrigger>
                        <AccordionContent>
                          <fetcher.Form method='post'>
                            <input type='hidden' name='workOrderId' value={order.workOrderId} />
                            <div className='flex'>
                              <div className="flex-col" >
                                <div className="relative mt-4">
                                  <Input name='name' className='w-[250px] mr-3' />
                                  <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">Name</label>
                                </div>
                                <div className="relative mt-4">
                                  <TextArea name='description' className='w-[250px] mr-3' />
                                  <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">Description</label>
                                </div>
                              </div>

                              <div className="relative mt-4">
                                <Input name='hr' className='w-[100px] mr-3' />
                                <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">Hr's</label>
                              </div>
                              <div className="relative mt-4">
                                <Input name='quantity' className='w-[100px] mr-3' defaultValue={1} />
                                <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">Quantity</label>
                              </div>

                              <Button
                                className='mt-4'
                                size='icon'
                                type='submit'
                                name='intent'
                                value='addNewServiceToWorkOrder'
                              ><Plus /></Button>
                            </div>
                          </fetcher.Form>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>

                  </div>
                </div>

              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="Parts">
          <Card x-chunk="dashboard-05-chunk-3 " className='mx-5 w-[95%] '>
            <CardHeader className="px-7">
              <CardTitle>
                <div className='flex justify-between items-center'>
                  <p>Accessories</p>
                </div>
              </CardTitle>
              <CardDescription className='flex items-center'>
                <product.Form method="get" action='/dealer/accessories/products/search'>
                  <div className="relative ml-auto flex-1 md:grow-0 ">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      ref={ref}
                      type="search"
                      name="q"
                      onChange={e => {
                        //   search.submit(`/dealer/accessories/search?name=${e.target.value}`);
                        product.submit(e.currentTarget.form);
                      }}
                      autoFocus
                      placeholder="Search..."
                      className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
                    />
                  </div>
                </product.Form>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className='border-border'>
                    <TableHead>
                      Brand & Name
                    </TableHead>
                    <TableHead className="hidden sm:table-cell">
                      Description
                    </TableHead>
                    <TableHead className="hidden sm:table-cell">
                      Category
                    </TableHead>
                    <TableHead className="hidden sm:table-cell">
                      Sub Category
                    </TableHead>
                    <TableHead className="hidden sm:table-cell">
                      On Order
                    </TableHead>
                    <TableHead className="hidden sm:table-cell">
                      Distributer
                    </TableHead>
                    <TableHead className="hidden sm:table-cell">
                      Location
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Cost
                    </TableHead>
                    <TableHead className="hidden sm:table-cell">
                      Price
                    </TableHead>
                    <TableHead className="text-right">
                      Quantity
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className='max-h-[700px] h-auto overflow-y-auto'>
                  {product.data &&
                    product.data.map((result, index) => (
                      <TableRow key={index} className="hover:bg-accent border-border rounded-[6px] cursor-pointer" onClick={() => {
                        const formData = new FormData();
                        formData.append("accessoryId", result.id);
                        formData.append("workOrderId", order.workOrderId);
                        formData.append("accOrderId", order.AccOrders[0].id);
                        formData.append("intent", 'addAccToWorkOrder');
                        submit(formData, { method: "post", });
                      }}>
                        <TableCell className='flex-col'>
                          <p className="font-medium">
                            {result.name}
                          </p>
                          <p className="text-sm text-muted-foreground ">
                            {result.brand}
                          </p>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {result.description}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {result.category}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {result.subCategory}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {result.onOrder}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {result.distributer}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {result.location}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {result.cost}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {result.price}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {result.quantity}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="Calendar">
        </TabsContent>
      </Tabs>
      <div>
        <Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4"          >
          <CardHeader className="flex flex-row items-start bg-muted/50">
            <div className="grid gap-0.5">
              <CardTitle className="group flex items-center gap-2 text-lg">
                W / O #{order.workOrderId}
                <Button
                  size="icon"
                  variant="outline"
                  className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <Copy className="h-3 w-3" />
                  <span className="sr-only">Copy Order ID</span>
                </Button>
              </CardTitle>
              {order.status && (
                <div>
                  <div className="relative mt-4">
                    <Select
                      name='status'
                      defaultValue={order.status}
                      onValueChange={(value) => {
                        const formData = new FormData();
                        formData.append("id", order.workOrderId);
                        formData.append("total", total);
                        formData.append("intent", 'updateStatus');
                        formData.append("status", value);
                        console.log(formData, 'formData');
                        workOrder.submit(formData, { method: "post" });
                      }}>
                      <SelectTrigger className="w-[200px] " >
                        <SelectValue defaultValue={order.status} />
                      </SelectTrigger>
                      <SelectContent className='border-border'>
                        <SelectGroup>
                          <SelectLabel>Status</SelectLabel>
                          <SelectItem value="Quote">Quote</SelectItem>
                          <SelectItem value="Sales">Sales</SelectItem>
                          <SelectItem value="Open">Open / Scheduled</SelectItem>
                          <SelectItem value="Waiting On Parts">Waiting On Parts</SelectItem>
                          <SelectItem value="Waiter">Waiter</SelectItem>
                          <SelectItem value="In Works">In Works</SelectItem>
                          <SelectItem value="Work Completed">Work Completed</SelectItem>
                          <SelectItem value="Closed">Closed</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-muted/50 transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Status</label>
                  </div>
                </div>
              )}
            </div>
            <div className="ml-auto flex items-center gap-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="outline" className="h-8 w-8">
                    <MoreVertical className="h-3.5 w-3.5" />
                    <span className="sr-only">More</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="border border-border"
                >
                  <DropdownMenuItem
                    onSelect={() => {
                      navigate(`/dealer/service/workOrder/${order.workOrderId}`)
                    }}>
                    Go To Order
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => {
                      console.log(toReceipt)
                      PrintReceipt(toReceipt)
                    }}>
                    Reprint Receipt
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => setDiscount((prevDiscount) => !prevDiscount)}>
                    Show Discount
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={() => {
                      setShowPrev(false)
                      setorder(null)
                    }}>
                    Back
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={() => {
                      const formData = new FormData();
                      formData.append("workOrderId", order.workOrderId);
                      formData.append("intent", 'deleteOrder');
                      submit(formData, { method: "post", });
                    }}>
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent className="p-6 text-sm h-auto max-h-[850px] overflow-y-auto">
            {secPage && (
              <>
                <Accordion type="single" collapsible className="w-full border-border mt-3">
                  <AccordionItem value="item-1" className='border-border'>
                    <AccordionTrigger>Customer Information</AccordionTrigger>
                    <AccordionContent>
                      <div className="grid gap-3">
                        <dl className="grid gap-3">
                          <div className="flex items-center justify-between">
                            <dt className="text-muted-foreground">Customer</dt>
                            <dd>{order.Clientfile.name}</dd>
                          </div>
                          <div className="flex items-center justify-between">
                            <dt className="text-muted-foreground">Email</dt>
                            <dd>
                              <a href="mailto:">{order.Clientfile.email}</a>
                            </dd>
                          </div>
                          <div className="flex items-center justify-between">
                            <dt className="text-muted-foreground">Phone</dt>
                            <dd>
                              <a href="tel:">{order.Clientfile.phone}</a>
                            </dd>
                          </div>
                        </dl>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                <Accordion type="single" collapsible className="w-full border-border mt-3">
                  <AccordionItem value="item-1" className='border-border'>
                    <AccordionTrigger>Customer Unit</AccordionTrigger>
                    <AccordionContent>
                      <dl className="grid gap-3">
                        <div className="flex items-center justify-between">
                          <dt className="text-muted-foreground">Unit</dt>
                          <dd>
                            <EditableText
                              value={order.unit}
                              fieldName="name"
                              inputClassName=" border border-border rounded-lg  text-foreground bg-background py-1 px-2 w-[150px] "
                              buttonClassName="text-center py-1 px-2 text-foreground"
                              buttonLabel={`Edit quantity`}
                              inputLabel={`Edit quantity`}
                            >
                              <input type="hidden" name="intent" value='updateWorkOrderUnit' />
                              <input type='hidden' name='workOrderId' value={order.workOrderId} />
                              <input type="hidden" name="col" value='unit' />
                            </EditableText>
                          </dd>
                        </div>
                        <div className="flex items-center justify-between">
                          <dt className="text-muted-foreground">Color</dt>
                          <dd>
                            <EditableText
                              value={order.color}
                              fieldName="name"
                              inputClassName=" border border-border rounded-lg  text-foreground bg-background py-1 px-2 w-[150px] "
                              buttonClassName="text-center py-1 px-2 text-foreground"
                              buttonLabel={`Edit quantity`}
                              inputLabel={`Edit quantity`}
                            >
                              <input type="hidden" name="intent" value='updateWorkOrderUnit' />
                              <input type='hidden' name='workOrderId' value={order.workOrderId} />
                              <input type="hidden" name="col" value='color' />
                            </EditableText>
                          </dd>
                        </div>
                        <div className="flex items-center justify-between">
                          <dt className="text-muted-foreground">Mileage</dt>
                          <dd>
                            <EditableText
                              value={order.mileage}
                              fieldName="name"
                              inputClassName=" border border-border rounded-lg  text-foreground bg-background py-1 px-2 w-[150px] "
                              buttonClassName="text-center py-1 px-2 text-foreground"
                              buttonLabel={`Edit quantity`}
                              inputLabel={`Edit quantity`}
                            >
                              <input type="hidden" name="intent" value='updateWorkOrderUnit' />
                              <input type='hidden' name='workOrderId' value={order.workOrderId} />
                              <input type="hidden" name="col" value='mileage' />
                            </EditableText>
                          </dd>
                        </div>
                        <div className="flex items-center justify-between">
                          <dt className="text-muted-foreground">vin</dt>
                          <dd>
                            <EditableText
                              value={order.vin}
                              fieldName="name"
                              inputClassName=" border border-border rounded-lg  text-foreground bg-background py-1 px-2 w-[150px] "
                              buttonClassName="text-center py-1 px-2 text-foreground"
                              buttonLabel={`Edit quantity`}
                              inputLabel={`Edit quantity`}
                            >
                              <input type="hidden" name="intent" value='updateWorkOrderUnit' />
                              <input type='hidden' name='workOrderId' value={order.workOrderId} />
                              <input type="hidden" name="col" value='vin' />
                            </EditableText>
                          </dd>
                        </div>
                        <div className="flex items-center justify-between">
                          <dt className="text-muted-foreground">Motor</dt>
                          <dd>
                            <EditableText
                              value={order.motor}
                              fieldName="name"
                              inputClassName=" border border-border rounded-lg  text-foreground bg-background py-1 px-2 w-[150px] "
                              buttonClassName="text-center py-1 px-2 text-foreground"
                              buttonLabel={`Edit quantity`}
                              inputLabel={`Edit quantity`}
                            >
                              <input type="hidden" name="intent" value='updateWorkOrderUnit' />
                              <input type='hidden' name='workOrderId' value={order.workOrderId} />
                              <input type="hidden" name="col" value='motor' />
                            </EditableText>
                          </dd>
                        </div>
                        <div className="flex items-center justify-between">
                          <dt className="text-muted-foreground">Tag</dt>
                          <dd>
                            <EditableText
                              value={order.tag}
                              fieldName="name"
                              inputClassName=" border border-border rounded-lg  text-foreground bg-background py-1 px-2 w-[150px] "
                              buttonClassName="text-center py-1 px-2 text-foreground"
                              buttonLabel={`Edit quantity`}
                              inputLabel={`Edit quantity`}
                            >
                              <input type="hidden" name="intent" value='updateWorkOrderUnit' />
                              <input type='hidden' name='workOrderId' value={order.workOrderId} />
                              <input type="hidden" name="col" value='tag' />
                            </EditableText>
                          </dd>
                        </div>
                        <div className="flex items-center justify-between">
                          <dt className="text-muted-foreground">location</dt>
                          <dd>
                            <EditableText
                              value={order.location}
                              fieldName="name"
                              inputClassName=" border border-border rounded-lg  text-foreground bg-background py-1 px-2 w-[150px] "
                              buttonClassName="text-center py-1 px-2 text-foreground"
                              buttonLabel={`Edit quantity`}
                              inputLabel={`Edit quantity`}
                            >
                              <input type="hidden" name="intent" value='updateWorkOrderUnit' />
                              <input type='hidden' name='workOrderId' value={order.workOrderId} />
                              <input type="hidden" name="col" value='location' />
                            </EditableText>
                          </dd>
                        </div>
                      </dl>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                <Accordion type="single" collapsible className="w-full border-border mt-3">
                  <AccordionItem value="item-1" className='border-border'>
                    <AccordionTrigger>Work Order Notes</AccordionTrigger>
                    <AccordionContent>
                      <div className="grid gap-3">
                        <Form method='post'>
                          <div className="relative mt-4">
                            <TextArea className='w-full mt-4' name='note' defaultValue={order.notes} />
                            <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Note</label>
                          </div>
                          <input type='hidden' name='id' defaultValue={order.workOrderId} />
                          <Button type='submit' name='intent' value='updateNote' className='mt-4 text-foreground' size='sm'>
                            Submit
                          </Button>
                        </Form>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <div className="grid gap-3 mt-3">
                  <div className="font-semibold">Work Order Services</div>
                  <ul className="grid gap-3">
                    {order.ServicesOnWorkOrders && order.ServicesOnWorkOrders.map((result, index) => {
                      const hours = result.hr || result.service.estHr || 0.00;
                      return (
                        <li key={index} className="flex items-center justify-between">
                          <div>
                            <ContextMenu>
                              <ContextMenuTrigger>
                                <div className='grid grid-cols-1'>
                                  <div className='flex items-center group '>
                                    <div className="font-medium">
                                      {result.service.service}
                                    </div>
                                    <addProduct.Form method="post" ref={formRef} className='mr-auto'>
                                      <input type="hidden" name="id" value={result.id} />
                                      <input type='hidden' name='total' value={total} />
                                      <input type='hidden' name='workOrderId' value={order.workOrderId} />
                                      <Button
                                        size="icon"
                                        variant="outline"
                                        name="intent" value='deleteServiceItem'
                                        className=" ml-2 bg-primary  opacity-0 transition-opacity group-hover:opacity-100"
                                        type='submit'
                                      >
                                        <X className="h-4 w-4 text-foreground" />
                                      </Button>
                                    </addProduct.Form>
                                  </div>
                                  <div className="hidden text-sm text-muted-foreground md:inline">
                                    <div className='flex items-center'>
                                      <div className="font-medium">
                                        <EditableText
                                          value={hours}
                                          fieldName="name"
                                          inputClassName=" border border-border rounded-lg  text-foreground bg-background py-1 px-2  w-[75px]"
                                          buttonClassName="text-center py-1 px-2 text-muted-foreground"
                                          buttonLabel={`Edit name`}
                                          inputLabel={`Edit name`}
                                        >
                                          <input type="hidden" name="intent" value='updateHr' />
                                          <input type="hidden" name="id" value={result.id} />
                                          <input type="hidden" name="colName" value='hr' />
                                        </EditableText>

                                      </div>
                                      <p>{" "}hrs{" "}{" "}@{" "}${tax.userLabour}</p>
                                    </div>
                                  </div>
                                  {result.status && (
                                    <div>
                                      <Badge className='text-sm  px-2 py-1 '>{result.status}</Badge>
                                    </div>
                                  )}
                                </div>
                              </ContextMenuTrigger>
                              <ContextMenuContent className='border-border'>
                                <ContextMenuSub>
                                  <ContextMenuSubTrigger inset>Service Details</ContextMenuSubTrigger>
                                  <ContextMenuSubContent className="w-48 border-border">
                                    <ContextMenuItem>{result.service.service}</ContextMenuItem>
                                    <ContextMenuItem>{result.service.description}</ContextMenuItem>
                                    <ContextMenuSeparator />
                                    <ContextMenuItem>
                                      Est. Hours
                                      <ContextMenuShortcut>{result.service.estHr}</ContextMenuShortcut>
                                    </ContextMenuItem>
                                    <ContextMenuItem>
                                      Price
                                      <ContextMenuShortcut>${result.service.price}</ContextMenuShortcut>
                                    </ContextMenuItem>
                                  </ContextMenuSubContent>
                                </ContextMenuSub>
                                <ContextMenuSeparator />
                                <ContextMenuCheckboxItem
                                  checked={result.status === 'In Stock'}
                                  onSelect={() => {
                                    const formData = new FormData();
                                    formData.append("id", result.id);
                                    formData.append("status", 'In Stock');
                                    formData.append("intent", 'updateServiceOnOrders');
                                    submit(formData, { method: "post", });
                                  }}
                                >In Stock</ContextMenuCheckboxItem>
                                <ContextMenuCheckboxItem
                                  checked={result.status === 'On Order'}
                                  onSelect={() => {
                                    const formData = new FormData();
                                    formData.append("id", result.id);
                                    formData.append("status", 'On Order');
                                    formData.append("intent", 'updateServiceOnOrders');
                                    submit(formData, { method: "post", });
                                  }}
                                >On Order</ContextMenuCheckboxItem>
                                <ContextMenuCheckboxItem
                                  checked={result.status === 'Completed'}
                                  onSelect={() => {
                                    const formData = new FormData();
                                    formData.append("id", result.id);
                                    formData.append("status", 'Completed');
                                    formData.append("intent", 'updateServiceOnOrders');
                                    submit(formData, { method: "post", });
                                  }}
                                >Completed</ContextMenuCheckboxItem>
                                <ContextMenuCheckboxItem
                                  checked={result.status === 'Back Order'}
                                  onSelect={() => {
                                    const formData = new FormData();
                                    formData.append("id", result.id);
                                    formData.append("status", 'Back Order');
                                    formData.append("intent", 'updateServiceOnOrders');
                                    submit(formData, { method: "post", });
                                  }}
                                >Back Order</ContextMenuCheckboxItem>
                              </ContextMenuContent>
                            </ContextMenu>
                          </div>
                          <span>
                            x{" "}{" "}{result.quantity}

                          </span>
                        </li>
                      )
                    })}
                  </ul>
                  <Separator className="my-4" />
                  <div className="font-semibold">Work Order Parts</div>
                  <ul className="grid gap-3">
                    {order?.AccOrders?.length > 0 ? (
                      order.AccOrders.map((accOrder, accOrderIndex) => (
                        <div key={accOrderIndex}>
                          {accOrder?.AccessoriesOnOrders?.length > 0 ? (
                            accOrder.AccessoriesOnOrders.map((accessoryOnOrder, accessoryIndex) => (
                              <li key={accessoryIndex} className="flex items-center justify-between">
                                <div>
                                  <ContextMenu>
                                    <ContextMenuTrigger>
                                      <div className='grid grid-cols-1'>
                                        <div className='flex items-center group '>
                                          <div className="font-medium">

                                            {accessoryOnOrder.accessory.name}
                                          </div>
                                          <addProduct.Form method="post" ref={formRef} className='mr-auto'>
                                            <input type="hidden" name="id" value={accessoryOnOrder.id} />
                                            <input type='hidden' name='total' value={accessoryOnOrder.accessory.price * accessoryOnOrder.quantity} />
                                            <input type='hidden' name='accOrderId' value={accOrder.id} />
                                            <Button
                                              size="icon"
                                              variant="outline"
                                              name="intent" value='deleteOrderItem'
                                              className=" ml-2 bg-primary  opacity-0 transition-opacity group-hover:opacity-100"
                                              type='submit'
                                            >
                                              <X className="h-4 w-4 text-foreground" />
                                            </Button>
                                          </addProduct.Form>
                                        </div>
                                        <div className="hidden text-sm text-muted-foreground md:inline">
                                          {accessoryOnOrder.accessory.brand}
                                        </div>
                                        <div>
                                          <Badge className='text-sm  px-2 py-1 '>{accessoryOnOrder.status}</Badge>
                                        </div>
                                      </div>
                                    </ContextMenuTrigger>
                                    <ContextMenuContent className='border-border'>
                                      <ContextMenuSub>
                                        <ContextMenuSubTrigger inset>Part Details</ContextMenuSubTrigger>
                                        <ContextMenuSubContent className="w-48 border-border">
                                          <ContextMenuItem>{accessoryOnOrder.accessory.partNumber}</ContextMenuItem>
                                          <ContextMenuItem>{accessoryOnOrder.accessory.brand} </ContextMenuItem>
                                          <ContextMenuItem>{accessoryOnOrder.accessory.name} </ContextMenuItem>
                                          <ContextMenuItem>{accessoryOnOrder.accessory.description} </ContextMenuItem>
                                          <ContextMenuItem>{accessoryOnOrder.accessory.category} </ContextMenuItem>
                                          <ContextMenuItem>{accessoryOnOrder.accessory.category} </ContextMenuItem>
                                          <ContextMenuSeparator />
                                          <ContextMenuItem>
                                            Cost
                                            <ContextMenuShortcut>${accessoryOnOrder.accessory.cost}</ContextMenuShortcut>
                                          </ContextMenuItem>
                                          <ContextMenuItem>
                                            Price
                                            <ContextMenuShortcut>${accessoryOnOrder.accessory.price}</ContextMenuShortcut>
                                          </ContextMenuItem>
                                          <ContextMenuItem>
                                            In Stock
                                            <ContextMenuShortcut>{accessoryOnOrder.accessory.quantity}</ContextMenuShortcut>
                                          </ContextMenuItem>
                                          <ContextMenuItem>
                                            On Order
                                            <ContextMenuShortcut>{accessoryOnOrder.accessory.onOrder}</ContextMenuShortcut>
                                          </ContextMenuItem>
                                          <ContextMenuItem>
                                            Location
                                            <ContextMenuShortcut>{accessoryOnOrder.accessory.location}</ContextMenuShortcut>
                                          </ContextMenuItem>
                                        </ContextMenuSubContent>
                                      </ContextMenuSub>
                                      <ContextMenuCheckboxItem
                                        checked={accessoryOnOrder.status === 'In Stock'}
                                        onSelect={() => {
                                          const formData = new FormData();
                                          formData.append("id", accessoryOnOrder.id);
                                          formData.append("status", 'In Stock');
                                          formData.append("intent", 'updateAccOnOrders');
                                          submit(formData, { method: "post", });
                                        }}
                                      >In Stock</ContextMenuCheckboxItem>
                                      <ContextMenuCheckboxItem
                                        checked={accessoryOnOrder.status === 'On Order'}
                                        onSelect={() => {
                                          const formData = new FormData();
                                          formData.append("id", accessoryOnOrder.id);
                                          formData.append("status", 'On Order');
                                          formData.append("intent", 'updateAccOnOrders');
                                          submit(formData, { method: "post", });
                                        }}
                                      >On Order</ContextMenuCheckboxItem>
                                      <ContextMenuCheckboxItem
                                        checked={accessoryOnOrder.status === 'Back Order'}
                                        onSelect={() => {
                                          const formData = new FormData();
                                          formData.append("id", accessoryOnOrder.id);
                                          formData.append("status", 'Back Order');
                                          formData.append("intent", 'updateAccOnOrders');
                                          submit(formData, { method: "post", });
                                        }}
                                      >Back Order</ContextMenuCheckboxItem>
                                    </ContextMenuContent>
                                  </ContextMenu>
                                </div>
                                <span>${accessoryOnOrder.accessory.price} x {accessoryOnOrder.quantity}</span>
                              </li>
                            ))
                          ) : (
                            <p>No Accessories On Orders available.</p>
                          )}
                        </div>
                      ))
                    ) : (
                      <p>No Orders available.</p>
                    )}
                  </ul>


                  <Separator className="my-2" />
                  <ul className="grid gap-3">
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">Service Subtotal</span>
                      <span>${serviceSubTotal}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">Parts Subtotal</span>
                      <span>${partsSubTotal}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${totalPreTax}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">Tax</span>
                      <span>{tax.userTax}%</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">Total</span>
                      <span>${total}</span>
                    </li>
                  </ul>
                </div>
                <Separator className="my-4" />
                <div className='gap-3'>
                  <div className="font-semibold">Staff</div>

                  <ul className="grid gap-3">
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Technician
                      </span>
                      <span>{order.tech}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Service Writer
                      </span>
                      <span>{order.writer}</span>
                    </li>
                  </ul>
                </div>
              </>
            )}
            {firstPage && (
              <>
                <ul className="grid gap-3 mt-3 h-auto max-h-[600px] overflow-y-auto">
                  {orders && orders.map((result, index) => {
                    return (
                      <li
                        onClick={() => {
                          handleNextPage()
                          setOrder(result)
                        }}
                        key={index}
                        className="p-3 cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-[6px]">
                        <div className='flex-col'>
                          <div className='flex justify-between items-center'>
                            <p className='font-medium text-left'>W / O #{result.workOrderId}</p>
                            <p className='text-muted-foreground font-medium text-right'>{result.status}</p>
                          </div>
                          <div className='flex justify-between items-center'>
                            <p className='text-muted-foreground text-left'>Writer: {result.writer}</p>
                            <p className='text-muted-foreground text-right'>Tech: {result.tech}</p>
                          </div>
                          <p className='text-muted-foreground text-left'>{new Date(result.createdAt).toLocaleDateString("en-US", options2)}</p>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </>
            )}
          </CardContent>
          <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3 border-border">
            <div className="text-xs text-muted-foreground">
              Updated <time dateTime="2023-11-23">November 23, 2023</time>
            </div>
            <Pagination className="ml-auto mr-0 w-auto">
              <PaginationContent>
                <PaginationItem>
                  <Button size="icon"
                    variant="outline"
                    className="h-6 w-6"
                    onClick={() => {
                      handlePrevPage()
                    }}>
                    <ChevronLeft className="h-3.5 w-3.5" />
                    <span className="sr-only">Previous Order</span>
                  </Button>
                </PaginationItem>
                <PaginationItem>
                  <Button size="icon"
                    variant="outline"
                    className="h-6 w-6"
                    onClick={() => {
                      handleNextPage()
                    }}>
                    <ChevronRight className="h-3.5 w-3.5" />
                    <span className="sr-only">Next Order</span>
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </CardFooter>
        </Card>
      </div>

    </main >
  )
}
