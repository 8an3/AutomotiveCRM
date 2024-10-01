import {
  Tabs,
  Badge,
  TabsContent,
  TabsList,
  TabsTrigger,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  Alert,
  Debug,
  InputPassword,
  Layout,
  PageHeader,
  RemixForm,
  RemixLinkText,
  CardHeader,
  CardTitle,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectGroup,
  RemixNavLink,
  Input,
  Separator,
  Button,
  TextArea,
  Label,
  PopoverTrigger,
  PopoverContent,
  Popover,
} from "~/components";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
} from "~/components/ui/dropdown-menu";
import {
  Form,
  Link,
  useActionData,
  useFetcher,
  useLoaderData,
  useSubmit,
  useNavigation,
  useParams,
  useNavigate,
  useNavigationType,
} from "@remix-run/react";
import { ButtonLoading } from "~/components/ui/button-loading";
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  CreditCard,
  Eye,
  File,
  FileCheck,
  Home,
  LineChart,
  ListFilter,
  MoreVertical,
  Navigation,
  Package,
  Package2,
  PanelLeft,
  Search,
  Settings,
  ShoppingCart,
  Truck,
  Users2,
} from "lucide-react";
import { format } from "date-fns"
import { Calendar as SmallCalendar } from '~/components/ui/calendar';
import { cn } from "~/components/ui/utils";
import { CalendarIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination"
import { FaCheck } from "react-icons/fa";
import { options2 } from "~/components/shared/shared";
import { Check } from "lucide-react";


export default function UnitDialog({ data, user }) {
  const [value, setValue] = useState('');
  const [showPrevOrder, setShowPrevOrder] = useState(null)
  const [showPrev, setShowPrev] = useState(false)
  const submit = useSubmit();
  let addProduct = useFetcher();
  let formRef = useRef();
  const fetcher = useFetcher();

  const showPrevOrderById = (id) => {
    const filteredOrder = data.workOrders.find(order => order.workOrderId === id);
    setShowPrev(true)
    setShowPrevOrder(filteredOrder);
  }
  let sortedEvents = [];

  let customerCard = [
    { name: "packageNumber", value: data.packageNumber, label: "Package Number", },
    { name: "packagePrice", value: data.packagePrice, label: "Package Price" },
    { name: "stockNumber", value: data.stockNumber, label: "Stock Number" },
    { name: "type", value: data.type, label: "Type" },
    { name: "class", value: data.class, label: "Class" },
    { name: "year", value: data.year, label: "Year" },
    { name: "make", value: data.make, label: "Make" },
    { name: "model", value: data.model, label: "Model" },
    { name: "modelName", value: data.modelName, label: "Model Name" },
    { name: "submodel", value: data.submodel, label: "Sub Model" },
    { name: "subSubmodel", value: data.subSubmodel, label: "Sub Sub Model" },
    { name: "price", value: data.price, label: "Price" },
    { name: "exteriorColor", value: data.exteriorColor, label: "Exterior Color", },
    { name: "mileage", value: data.mileage, label: "Mileage" },
    { name: "vin", value: data.vin, label: "VIN" },
    { name: "age", value: data.age, label: "Age" },
    { name: "location", value: data.location, label: "Location" },
    { name: "hdcFONumber", value: data.hdcFONumber, label: "hdcFO Number" },
    { name: "hdmcFONumber", value: data.hdmcFONumber, label: "hdmcFO Number" },
  ];
  let customerCard2 = [
    { name: "floorPlanDueDate", value: data.floorPlanDueDate, label: "FloorPlanDueDate", },
    { name: "stockedDate", value: data.stockedDate, label: "Stocked Date" },
    { name: "actualCost", value: data.actualCost, label: "Actual Cost" },
    { name: "mfgSerialNumber", value: data.mfgSerialNumber, label: "mfg Serial Number", },
    { name: "engineNumber", value: data.engineNumber, label: "Engine Number" },
    { name: "plates", value: data.plates, label: "Plates" },
    { name: "keyNumber", value: data.keyNumber, label: "Key Number" },
    { name: "length", value: data.length, label: "Length" },
    { name: "width", value: data.width, label: "Width" },
    { name: "engine", value: data.engine, label: "Engine" },
    { name: "fuelType", value: data.fuelType, label: "Fuel Type" },
    { name: "power", value: data.power, label: "Power" },
    { name: "chassisNumber", value: data.chassisNumber, label: "Chassis Number", },
    { name: "chassisYear", value: data.chassisYear, label: "Chassis Year" },
    { name: "chassisMake", value: data.chassisMake, label: "Chassis Make" },
    { name: "chassisModel", value: data.chassisModel, label: "Chassis Model" },
    { name: "chassisType", value: data.chassisType, label: "Chassis Type" },
    { name: "registrationState", value: data.registrationState, label: "Registration State", },
    { name: "registrationExpiry", value: data.registrationExpiry, label: "Registration Expiry", },
    { name: "grossWeight", value: data.grossWeight, label: "Gross Weight" },
    { name: "netWeight", value: data.netWeight, label: "Net Weight" },
    { name: "insuranceCompany", value: data.insuranceCompany, label: "Insurance Company", },
    { name: "policyNumber", value: data.policyNumber, label: "Policy Number" },
    { name: "insuranceAgent", value: data.insuranceAgent, label: "Insurance Agent", },
    { name: "insuranceStartDate", value: data.insuranceStartDate, label: "Iinsurance Start Date", },
    { name: "insuranceEndDate", value: data.insuranceEndDate, label: "Insurance End Date", },
  ];



  const [date, setDate] = useState<Date>()
  const newDate = new Date()
  const loggedDate = new Date()

  const [datefloorPlanDueDate, setDatefloorPlanDueDate] = useState<Date>()

  const userIsManager = user.positions.some(
    (pos) => pos.position === 'Manager' || pos.position === 'Administrator'
  );
  const userIsDEV = user.positions.some(
    (pos) => pos.position === 'DEV' || pos.position === 'Administrator'
  );
  const navigate = useNavigate()
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  let toReceipt
  if (showPrevOrder) {


    toReceipt = {

    };

    let accessoryIndex = 0;
  }
  const [list, setList] = useState([])
  useEffect(() => {
    if (data.workOrders) {
      setList(data.workOrders)
    }
  }, [data.workOrders]);

  const order = showPrevOrder
  const timerRef = useRef(0);


  const copyText = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopiedText(text);
        setTimeout(() => setCopiedText(''), 3000); // Reset after 3 seconds
      })
      .catch((error) => {
        // console.error('Failed to copy text: ', error);
      });
  };
  const [copiedText, setCopiedText] = useState();
  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, [])


  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Unit File</Button>
      </DialogTrigger>
      <DialogContent className="w-auto max-w-[95%] border border-border md:max-w-[75%]">
        <DialogHeader>
          <DialogTitle>Unit File</DialogTitle>
        </DialogHeader>
        <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">

          <div className="grid gap-4 md:gap-8 ">
            <Tabs defaultValue="Unit" className="w-full">
              <TabsList>
                <TabsTrigger value="Unit">Unit</TabsTrigger>
                <TabsTrigger value="Customer">Customer</TabsTrigger>
                <TabsTrigger value="Work Orders">Work Orders</TabsTrigger>
              </TabsList>
              <TabsContent value="Unit">
                <div className='grid grid-cols-1 gap-2 '>

                  <div className="grid items-start gap-4 md:gap-8 lg:col-span-2">
                    <Card
                      className="overflow-hidden rounded-lg text-foreground"
                      x-chunk="dashboard-05-chunk-4"
                    >
                      <CardHeader className="flex flex-row items-start  bg-muted/50 ">
                        <div className="grid gap-0.5">
                          <CardTitle className="group flex items-center gap-2 text-lg">
                            Unit
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                            >
                              <Copy className="h-3 w-3" />
                              <span className="sr-only">
                                Snap shot on customer interactions, whether they
                                are buying something or a sales person following
                                up to make a sale.
                              </span>
                            </Button>
                          </CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-grow !grow overflow-y-auto overflow-x-clip bg-background p-6 text-sm">
                        <Form method='post'>
                          <div className="grid h-auto  max-h-[65vh] grid-cols-2 gap-3 mt-3 mx-5">

                            {userIsManager ? (<>
                              <div className="relative mt-5  ">
                                <Select
                                  onValueChange={(value) => {
                                    const formData = new FormData();
                                    formData.append("id", data.id);
                                    formData.append("stocked", value);
                                    formData.append("intent", 'stocked');
                                    console.log(formData, 'formData');
                                    fetcher.submit(formData, { method: "post" });
                                  }}
                                  value={data.stocked}
                                  name='Stocked'>
                                  <SelectTrigger className="w-full focus:border-primary">
                                    <SelectValue placeholder='Stocked' />
                                  </SelectTrigger>
                                  <SelectContent className='bg-background text-foreground border-border'>
                                    <SelectItem value="true">true</SelectItem>
                                    <SelectItem value="false">false</SelectItem>
                                  </SelectContent>
                                </Select>
                                <label className=" absolute -top-3 left-3  rounded-full bg-background px-2 text-sm transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">
                                  Stocked
                                </label>
                              </div>
                              <div className="relative mt-5  ">
                                <Select
                                  onValueChange={(value) => {
                                    const formData = new FormData();
                                    formData.append("id", data.id);
                                    formData.append("onOrder", value);
                                    formData.append("intent", 'onOrder');
                                    console.log(formData, 'formData');
                                    fetcher.submit(formData, { method: "post" });
                                  }}
                                  value={data.onOrder}
                                  name='onOrder'>
                                  <SelectTrigger className="w-full focus:border-primary">
                                    <SelectValue placeholder='On Order' />
                                  </SelectTrigger>
                                  <SelectContent className='bg-background text-foreground border-border'>
                                    <SelectItem value="true">true</SelectItem>
                                    <SelectItem value="false">false</SelectItem>
                                  </SelectContent>
                                </Select>
                                <label className=" absolute -top-3 left-3  rounded-full bg-background px-2 text-sm transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">
                                  On Order
                                </label>
                              </div>
                              <div className="relative mt-5  ">
                                <Select
                                  onValueChange={(value) => {
                                    const formData = new FormData();
                                    formData.append("id", data.id);
                                    formData.append("isNew", value);
                                    formData.append("intent", 'isNew');
                                    console.log(formData, 'formData');
                                    fetcher.submit(formData, { method: "post" });
                                  }}
                                  defaultValue={data.isNew}
                                  name='isNew'>
                                  <SelectTrigger className="w-full focus:border-primary">
                                    <SelectValue placeholder='Is New' />
                                  </SelectTrigger>
                                  <SelectContent className='bg-background text-foreground border-border'>
                                    <SelectItem value="true">true</SelectItem>
                                    <SelectItem value="false">false</SelectItem>
                                  </SelectContent>
                                </Select>
                                <label className=" absolute -top-3 left-3  rounded-full bg-background px-2 text-sm transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">
                                  Is New
                                </label>
                              </div>
                              <div className="relative mt-5  ">
                                {data.floorPlanDueDate ? (
                                  <Input
                                    className=''
                                    name='floorPlanDueDate'
                                    defaultValue={new Date(data.floorPlanDueDate).toLocaleDateString("en-US", options2)} />
                                ) : (
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <Button
                                        variant={"outline"}
                                        className={cn(
                                          "w-full  justify-start text-left font-normal",
                                          !datefloorPlanDueDate && "text-muted-foreground"
                                        )}
                                      >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {datefloorPlanDueDate ? format(datefloorPlanDueDate, "PPP") : <span>Pick a date</span>}
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                      <div className="mx-auto w-[280px] rounded-md border-border bg-background px-3 text-foreground " >
                                        <div className='  my-3 flex justify-center   '>
                                          <CalendarIcon className="mr-2 size-8 " />
                                          {datefloorPlanDueDate ? format(datefloorPlanDueDate, "PPP") : <span>{format(newDate, "PPP")}</span>}
                                        </div>
                                        <SmallCalendar
                                          className='mx-auto w-auto   bg-background text-foreground'
                                          mode="single"
                                          selected={datefloorPlanDueDate}
                                          onSelect={setDatefloorPlanDueDate}
                                          initialFocus
                                        />
                                        <Button size='sm' className='mx-auto mt-3' onClick={() => {
                                          const formData = new FormData();
                                          formData.append("id", data.id);
                                          formData.append("floorPlanDueDate", new Date(datefloorPlanDueDate).toLocaleDateString("en-US", options2));
                                          formData.append("intent", 'floorPlanDueDate');
                                          console.log(formData, 'formData');
                                          fetcher.submit(formData, { method: "post" });
                                        }} >
                                          Submit
                                        </Button>
                                      </div>
                                    </PopoverContent >
                                  </Popover >
                                )}
                                <label className=" absolute -top-3 left-3  rounded-full bg-background px-2 text-sm transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">
                                  Floor Plan Due Date
                                </label>
                              </div>
                              <div className="relative mt-5 ">
                                <Select
                                  onValueChange={(value) => {
                                    const formData = new FormData();
                                    formData.append("id", data.id);
                                    formData.append("orderStatus", value);
                                    formData.append("intent", 'orderStatus');
                                    console.log(formData, 'formData');
                                    fetcher.submit(formData, { method: "post" });
                                  }}
                                  defaultValue={data.orderStatus}
                                  name='status'>
                                  <SelectTrigger className="w-full focus:border-primary">
                                    <SelectValue placeholder='Order Status' />
                                  </SelectTrigger>
                                  <SelectContent className='bg-background text-foreground border-border'>
                                    <SelectItem value="On Order">On Order</SelectItem>
                                    <SelectItem value="Stock">Stock</SelectItem>
                                    <SelectItem value="Reserved">Reserved</SelectItem>
                                    <SelectItem value="Wish">Wish</SelectItem>
                                  </SelectContent>
                                </Select>
                                <label className=" absolute -top-3 left-3  rounded-full bg-background px-2 text-sm transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">
                                  Order Status
                                </label>
                              </div>
                              <div className="relative mt-5  ">
                                <Select
                                  onValueChange={(value) => {
                                    const formData = new FormData();
                                    formData.append("id", data.id);
                                    formData.append("status", value);
                                    formData.append("intent", 'status');
                                    console.log(formData, 'formData');
                                    fetcher.submit(formData, { method: "post" });
                                  }}
                                  defaultValue={data.status}
                                  name='status'>
                                  <SelectTrigger className="w-full focus:border-primary">
                                    <SelectValue placeholder='Status' />
                                  </SelectTrigger>
                                  <SelectContent className='bg-background text-foreground border-border'>
                                    <SelectItem value="Available">Available</SelectItem>
                                    <SelectItem value="Reserved">Reserved</SelectItem>
                                  </SelectContent>
                                </Select>
                                <label className=" absolute -top-3 left-3  rounded-full bg-background px-2 text-sm transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">
                                  Status
                                </label>
                              </div>
                              <div className="relative mt-5  ">
                                <Select
                                  onValueChange={(value) => {
                                    const formData = new FormData();
                                    formData.append("id", data.id);
                                    formData.append("sold", value);
                                    formData.append("intent", 'sold');
                                    console.log(formData, 'formData');
                                    fetcher.submit(formData, { method: "post" });
                                  }}
                                  defaultValue={data.sold}
                                  name='sold'>
                                  <SelectTrigger className="w-full focus:border-primary">
                                    <SelectValue placeholder='Sold' />
                                  </SelectTrigger>
                                  <SelectContent className='bg-background text-foreground border-border'>
                                    <SelectItem value="true">true</SelectItem>
                                    <SelectItem value="false">false</SelectItem>
                                  </SelectContent>
                                </Select>
                                <label className=" absolute -top-3 left-3  rounded-full bg-background px-2 text-sm transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">
                                  Sold
                                </label>
                              </div>
                              <div className="relative mt-5  ">
                                {data.expectedOn ? (
                                  <Input
                                    className='mt-3'
                                    name='expectedOn'
                                    defaultValue={new Date(data.expectedOn).toLocaleDateString("en-US", options2)}
                                  />
                                ) : (
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <Button
                                        variant={"outline"}
                                        className={cn(
                                          "w-full  justify-start text-left font-normal",
                                          !date && "text-muted-foreground"
                                        )}
                                      >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                      <div className="mx-auto w-[280px] rounded-md border-border bg-background px-3 text-foreground " >
                                        <div className='  my-3 flex justify-center   '>
                                          <CalendarIcon className="mr-2 size-8 " />
                                          {date ? format(date, "PPP") : <span>{format(newDate, "PPP")}</span>}
                                        </div>
                                        <SmallCalendar
                                          className='mx-auto w-auto   bg-background text-foreground'
                                          mode="single"
                                          selected={date}
                                          onSelect={setDate}
                                          initialFocus
                                        />
                                        <Button size='sm' className='mx-auto mt-3' onClick={() => {
                                          const formData = new FormData();
                                          formData.append("id", data.id);
                                          formData.append("expectedOn", new Date(date).toLocaleDateString("en-US", options2));
                                          formData.append("intent", 'expectedOn');
                                          console.log(formData, 'formData');
                                          fetcher.submit(formData, { method: "post" });
                                        }} >
                                          Submit
                                        </Button>
                                      </div>
                                    </PopoverContent >
                                  </Popover >
                                )}
                                <label className=" absolute -top-3 left-3  rounded-full bg-background px-2 text-sm transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">
                                  Expected On
                                </label>
                              </div>
                              <div className="relative mt-5  ">
                                <Select
                                  onValueChange={(value) => {
                                    const formData = new FormData();
                                    formData.append("id", data.id);
                                    formData.append("consignment", value);
                                    formData.append("intent", 'consignment');
                                    console.log(formData, 'formData');
                                    fetcher.submit(formData, { method: "post" });
                                  }}
                                  defaultValue={data.consignment}
                                  name='consignment'>
                                  <SelectTrigger className="w-full focus:border-primary">
                                    <SelectValue placeholder='Consignment' />
                                  </SelectTrigger>
                                  <SelectContent className='bg-background text-foreground border-border'>
                                    <SelectItem value="true">True</SelectItem>
                                    <SelectItem value="false">False</SelectItem>
                                  </SelectContent>
                                </Select>
                                <label className=" absolute -top-3 left-3  rounded-full bg-background px-2 text-sm transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">
                                  Consignment
                                </label>
                              </div>
                              {customerCard.map((user, index) => (
                                <div key={index} className="relative mt-5">
                                  <Input
                                    name={user.name}
                                    defaultValue={user.value}
                                    className={` border border-border bg-background text-foreground`}
                                  />
                                  <label className=" absolute -top-3 left-3  rounded-full bg-background px-2 text-sm transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">
                                    {user.label}
                                  </label>
                                </div>
                              ))}
                              {customerCard2.map((user, index) => (
                                <div key={index} className="relative mt-5">
                                  <Input
                                    name={user.name}
                                    defaultValue={user.value}
                                    className={` border border-border bg-background text-foreground`}
                                  />
                                  <label className=" absolute -top-3 left-3  rounded-full bg-background px-2 text-sm transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">
                                    {user.label}
                                  </label>
                                </div>
                              ))}
                              <input type='hidden' name='id' value={data.id} />
                              <div>
                                <Button type='submit' name='intent' value='updateUnit' size='sm' >Save</Button>
                              </div>
                            </>
                            ) : (
                              <>
                                <ul className="grid gap-3 text-sm mx-5 ">
                                  <div></div>
                                  {customerCard.map((item, index) => (
                                    <li key={index} className=" group flex items-center justify-between">
                                      <div className='flex'>
                                        <span className="text-muted-foreground">
                                          {item.label}
                                        </span>
                                        <Button
                                          size="icon"
                                          variant="outline"
                                          onClick={() => copyText(item.value)}
                                          className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100 ml-2"
                                        >
                                          <Copy className="h-3 w-3" />
                                          <span className="sr-only">Copy</span>
                                        </Button>
                                        {copiedText === item.value && <FaCheck strokeWidth={1.5} className=" ml-2 text-lg hover:text-primary" />}
                                      </div>
                                      <span>{item.value}  </span>
                                    </li>
                                  ))}
                                </ul>
                                <ul className="grid gap-3 text-sm mx-5 ">
                                  <div className="relative mt-5  ">
                                    <Select
                                      onValueChange={(value) => {
                                        const formData = new FormData();
                                        formData.append("id", data.id);
                                        formData.append("sold", value);
                                        formData.append("intent", 'sold');
                                        console.log(formData, 'formData');
                                        fetcher.submit(formData, { method: "post" });
                                      }}
                                      defaultValue={data.sold}
                                      name='sold'>
                                      <SelectTrigger className="w-full focus:border-primary">
                                        <SelectValue placeholder='Sold' />
                                      </SelectTrigger>
                                      <SelectContent className='bg-background text-foreground border-border'>
                                        <SelectItem value="true">true</SelectItem>
                                        <SelectItem value="false">false</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <label className=" absolute -top-3 left-3  rounded-full bg-background px-2 text-sm transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">
                                      Sold
                                    </label>
                                  </div>
                                  {customerCard2.map((item, index) => (
                                    <li key={index} className=" group flex items-center justify-between">
                                      <div className='flex'>
                                        <span className="text-muted-foreground">
                                          {item.label}
                                        </span>
                                        <Button
                                          size="icon"
                                          variant="outline"
                                          onClick={() => copyText(item.value)}
                                          className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100 ml-2"
                                        >
                                          <Copy className="h-3 w-3" />
                                          <span className="sr-only">Copy</span>
                                        </Button>
                                        {copiedText === item.value && <FaCheck strokeWidth={1.5} className=" ml-2 text-lg hover:text-primary" />}
                                      </div>
                                      <span>{item.value}  </span>
                                    </li>
                                  ))}
                                </ul>
                              </>
                            )}
                          </div>
                        </Form>
                      </CardContent>
                      <CardFooter className="flex flex-row items-center border-t border-border   bg-muted/50  px-6 py-3">
                        <div className="text-xs text-muted-foreground">
                          Unit File
                        </div>
                      </CardFooter>
                    </Card>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="Customer">
                <div className='grid grid-cols-1 gap-2'>

                  <div className="grid items-start gap-4 md:gap-8 lg:col-span-2 mx-2">
                    {data.Finance ?
                      <>
                        <ul className="grid gap-3 text-sm mt-2 w-2/3 mx-auto">
                          <li className=" group flex items-center justify-between">
                            <div className='flex'>
                              <span className="text-muted-foreground">
                                Assigned Customer
                              </span>
                            </div>
                            <span>{data.Finance.firstName} {data.Finance.lastName}</span>
                          </li>
                          <li className=" group flex items-center justify-between">
                            <div className='flex'>
                              <span className="text-muted-foreground">
                                Sold
                              </span>
                            </div>
                            <span>{data.Finance.sold && data.Finance.sold} </span>
                          </li>
                          <li className=" group flex items-center justify-between">
                            <div className='flex'>
                              <span className="text-muted-foreground">
                                Deposit Made
                              </span>
                            </div>
                            <span>{data.Finance.depositMade && data.Finance.depositMade} </span>
                          </li>
                          <li className=" group flex items-center justify-between">
                            <div className='flex'>
                              <span className="text-muted-foreground">
                                deposit Taken Date
                              </span>
                            </div>
                            <span>{data.Finance.depositTakenDate && data.Finance.depositTakenDate} </span>
                          </li>

                          <li className=" group flex items-center justify-between">
                            <div className='flex'>
                              <span className="text-muted-foreground">
                                Assigned Sales Person
                              </span>
                            </div>
                            <span>{data.Finance.userName} {data.Finance.userEmail}</span>
                          </li>
                          <li className=" group flex items-center justify-between">
                            <div className='flex'>
                              <span className="text-muted-foreground">
                                Assigned Finance Manager
                              </span>
                            </div>
                            <span>{data.Finance.financeManager && data.Finance.financeManager}</span>
                          </li>
                        </ul>
                        <div >

                          <ButtonLoading
                            size="sm"
                            className="w-auto cursor-pointer mt-3 hover:text-primary border-border ml-auto"
                            isSubmitting={isSubmitting}
                            loadingText="Naivigating to Client File.."
                            onClick={() => {
                              navigate(`/dealer/sales/customer/${data.Finance.clientfileId}/${data.Finance.id}`)

                            }}
                          >
                            Client File
                          </ButtonLoading>
                        </div>
                      </>
                      :
                      <>
                        <p className='mt-10 text-center'>Not assigned to any deals.</p>
                      </>}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="Work Orders">
                <div className='flex items-center'>


                  <ButtonLoading
                    size="sm"
                    className="w-auto cursor-pointer mt-3 hover:text-primary border-border mr-auto"
                    isSubmitting={isSubmitting}
                    loadingText="Creating new work order.."
                    onClick={() => {
                      const formData = new FormData();
                      formData.append("email", data.email);
                      formData.append("year", data.year);
                      formData.append("brand", data.brand);
                      formData.append("model", data.model);
                      formData.append("mileage", data.mileage);
                      formData.append("vin", data.vin);
                      formData.append("year", data.year);
                      formData.append("financeId", data.financeId);
                      formData.append("clientfileId", data.clientfileId);
                      formData.append("intent", 'createNewOrder');
                      console.log(formData, 'formData');
                      fetcher.submit(formData, { method: "post" });
                    }}
                  >
                    Create New Work Order
                  </ButtonLoading>
                  <ButtonLoading
                    size="sm"
                    className="w-auto cursor-pointer mt-3 hover:text-primary border-border ml-auto"
                    isSubmitting={isSubmitting}
                    loadingText="Naivigating to Client File.."
                    onClick={() => {
                      navigate(`/dealer/sales/customer/${data.Finance.clientfileId}/${data.Finance.id}`)

                    }}
                  >
                    Client File
                  </ButtonLoading>
                </div>
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-2'>

                  <div className="grid items-start gap-4 md:gap-8 lg:col-span-2 mx-2">
                    {data.workOrders ?
                      <>
                        <Table>
                          <TableHeader>
                            <TableRow className='border-border'>
                              <TableHead>
                                Customer
                              </TableHead>
                              <TableHead className="text-center sm:table-cell">
                                Status
                              </TableHead>
                              <TableHead className="text-center sm:table-cell">
                                Location
                              </TableHead>
                              <TableHead className="text-center sm:table-cell">
                                Unit
                              </TableHead>
                              <TableHead className="text-center hidden sm:table-cell">
                                VIN
                              </TableHead>
                              <TableHead className="text-center hidden md:table-cell">
                                Tag
                              </TableHead>
                              <TableHead className="text-center ">
                                Work Order ID
                              </TableHead>
                              <TableHead className="text-center ">
                                Date Created
                              </TableHead>
                              <TableHead className=" text-right">
                                Actions
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {data.workOrders ?
                              data.workOrders.map((result, index) => (
                                <TableRow key={index} className="hover:bg-accent border-border">
                                  <TableCell>
                                    <div className="font-medium">
                                      {capitalizeFirstLetter(result.Clientfile.firstName)}{" "}
                                      {capitalizeFirstLetter(result.Clientfile.lastName)}
                                    </div>
                                    <div className="text-sm text-muted-foreground ">
                                      {result.Clientfile.email}
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-center  hidden sm:table-cell">
                                    {result.status}
                                  </TableCell>
                                  <TableCell className="text-center  hidden md:table-cell">
                                    {result.location}
                                  </TableCell>
                                  <TableCell className="text-center  hidden md:table-cell">
                                    {result.unit}
                                  </TableCell>
                                  <TableCell className="text-center  hidden md:table-cell">
                                    {result.vin}
                                  </TableCell>
                                  <TableCell className="text-center  hidden md:table-cell">
                                    {result.tag}
                                  </TableCell>
                                  <TableCell className="text-center  hidden md:table-cell">
                                    {result.workOrderId}
                                  </TableCell>
                                  <TableCell className="text-center  hidden md:table-cell">
                                    {result.createdAt}
                                  </TableCell>
                                  <TableCell className="text-right flex">
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          size="icon"
                                          variant="ghost"
                                          className="mr-3 hover:bg-primary"
                                          onClick={() => {
                                            setValue(result.id);
                                            showPrevOrderById(result.id)
                                          }}
                                        >
                                          <Eye className="h-5 w-5" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent side="right">
                                        Show Order
                                      </TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Link to={`/dealer/accessories/newOrder/${result.id}`} >

                                          <Button
                                            size="icon"
                                            variant="ghost"
                                            className="mr-3 hover:bg-primary"

                                          >
                                            <Navigation className="h-5 w-5" />
                                          </Button>
                                        </Link>
                                      </TooltipTrigger>
                                      <TooltipContent side="right">
                                        Go To Order
                                      </TooltipContent>
                                    </Tooltip>
                                  </TableCell>
                                </TableRow>
                              )) : (
                                <>
                                  {list && list.map((result, index) => (
                                    <TableRow key={index} className="hover:bg-accent border-border">
                                      <TableCell>
                                        <div className="font-medium">
                                          {capitalizeFirstLetter(result.Clientfile.firstName)}{" "}
                                          {capitalizeFirstLetter(result.Clientfile.lastName)}
                                        </div>
                                        <div className="text-sm text-muted-foreground ">
                                          {result.Clientfile.email}
                                        </div>
                                      </TableCell>
                                      <TableCell className="text-center  hidden sm:table-cell">
                                        {result.status}
                                      </TableCell>
                                      <TableCell className="text-center  hidden md:table-cell">
                                        {result.location}
                                      </TableCell>
                                      <TableCell className="text-center  hidden md:table-cell">
                                        {result.unit}
                                      </TableCell>
                                      <TableCell className="text-center  hidden md:table-cell">
                                        {result.vin}
                                      </TableCell>
                                      <TableCell className="text-center  hidden md:table-cell">
                                        {result.tag}
                                      </TableCell>
                                      <TableCell className="text-center  hidden md:table-cell">
                                        {result.workOrderId}
                                      </TableCell>
                                      <TableCell className="text-center flex">
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Button
                                              size="icon"
                                              variant="ghost"
                                              className="mr-3 hover:bg-primary"
                                              onClick={() => {
                                                setValue(result.workOrderId);
                                                showPrevOrderById(result.workOrderId)
                                              }}
                                            >
                                              <ShoppingCart className="h-5 w-5" />
                                            </Button>
                                          </TooltipTrigger>
                                          <TooltipContent side="right">
                                            Show Order
                                          </TooltipContent>
                                        </Tooltip>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Button
                                              size="icon"
                                              variant="ghost"
                                              className="mr-3 hover:bg-primary"
                                              onClick={() => {
                                                navigate(`/dealer/service/workOrder/${result.workOrderId}`)
                                              }}
                                            >
                                              <FileCheck className="h-5 w-5" />
                                            </Button>
                                          </TooltipTrigger>
                                          <TooltipContent side="right">
                                            Go To Order
                                          </TooltipContent>
                                        </Tooltip>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </>
                              )}


                          </TableBody>
                        </Table>
                        <div >


                        </div>
                      </>
                      :
                      <>
                        <p className='mt-10 text-center'>No work orders made under this unit.</p>
                      </>}
                    <div>
                    </div>
                  </div>
                  <div className="grid items-start gap-4 md:gap-8 lg:col-span-1 mx-2">
                    {showPrev && (
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
                                <DropdownMenuItem disabled
                                  onSelect={() => {
                                    console.log(toReceipt)
                                    ///  PrintReceipt(toReceipt)
                                  }}>
                                  Reprint Receipt
                                </DropdownMenuItem>
                                <DropdownMenuItem disabled
                                  onSelect={() => {
                                    // setDiscount((prevDiscount) => !prevDiscount)
                                  }}>
                                  Show Discount
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuSeparator />
                                <DropdownMenuItem disabled
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

                                            </div>
                                            <div className="hidden text-sm text-muted-foreground md:inline">
                                              <div className='flex items-center'>
                                                <div className="font-medium">
                                                  <p                                                  >
                                                    {hours}
                                                  </p>

                                                </div>
                                                <p>{" "}hrs{" "}{" "}@{" "}${user.Dealer.userLabour}</p>
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
                                          <ContextMenuCheckboxItem disabled
                                            checked={result.status === 'In Stock'}
                                            onSelect={() => {
                                              const formData = new FormData();
                                              formData.append("id", result.id);
                                              formData.append("status", 'In Stock');
                                              formData.append("intent", 'updateServiceOnOrders');
                                              submit(formData, { method: "post", });
                                            }}
                                          >In Stock</ContextMenuCheckboxItem>
                                          <ContextMenuCheckboxItem disabled
                                            checked={result.status === 'On Order'}
                                            onSelect={() => {
                                              const formData = new FormData();
                                              formData.append("id", result.id);
                                              formData.append("status", 'On Order');
                                              formData.append("intent", 'updateServiceOnOrders');
                                              submit(formData, { method: "post", });
                                            }}
                                          >On Order</ContextMenuCheckboxItem>
                                          <ContextMenuCheckboxItem disabled
                                            checked={result.status === 'Completed'}
                                            onSelect={() => {
                                              const formData = new FormData();
                                              formData.append("id", result.id);
                                              formData.append("status", 'Completed');
                                              formData.append("intent", 'updateServiceOnOrders');
                                              submit(formData, { method: "post", });
                                            }}
                                          >Completed</ContextMenuCheckboxItem>
                                          <ContextMenuCheckboxItem disabled
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
                        </CardContent>
                        <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3 border-border">
                          <div className="text-xs text-muted-foreground">
                            Created <time dateTime="2023-11-23">{order.createdAt}</time>
                          </div>
                          <Pagination className="ml-auto mr-0 w-auto">
                            <PaginationContent>
                              <PaginationItem>
                                <Button size="icon" variant="outline" className="h-6 w-6">
                                  <ChevronLeft className="h-3.5 w-3.5" />
                                  <span className="sr-only">Previous Order</span>
                                </Button>
                              </PaginationItem>
                              <PaginationItem>
                                <Button size="icon" variant="outline" className="h-6 w-6">
                                  <ChevronRight className="h-3.5 w-3.5" />
                                  <span className="sr-only">Next Order</span>
                                </Button>
                              </PaginationItem>
                            </PaginationContent>
                          </Pagination>
                        </CardFooter>
                      </Card>
                    )}

                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**  <div className="grid items-start gap-4 md:gap-8 lg:col-span-1 mx-2">
                    <Card
                      className="overflow-hidden rounded-lg text-foreground"
                      x-chunk="dashboard-05-chunk-4"
                    >
                      <CardHeader className="flex flex-row items-start  bg-muted/50 ">
                        <div className="grid gap-0.5">
                          <CardTitle className="group flex items-center gap-2 text-lg">
                            Timeline
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                            >
                              <Copy className="h-3 w-3" />
                              <span className="sr-only">
                                Snap shot on customer interactions, whether they are
                                buying something or a sales person following up to make
                                a sale.
                              </span>
                            </Button>
                          </CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-grow !grow overflow-y-auto overflow-x-clip bg-background p-6 text-sm">
                        <div className="grid h-auto max-h-[65vh] gap-3">
                          <div className="rightbox">
                            <div className="rb-container">
                              <ul className="rb">
                                {sortedEvents.reverse().map((event, index) => (
                                  <li
                                    key={index}
                                    className="rb-item grid-grid-cols-1 bg-muted-background rounded-lg px-3 py-2 "
                                  >
                                    <div className="timestamp flex justify-between text-primary">
                                      <p>{event.date}</p>
                                      <p className="text-right">{event.type}</p>
                                    </div>
                                    <div className="timestamp flex justify-between">
                                      <div className="item-title">{event.title}</div>
                                      {event.type === "Communication" ? (
                                        <>
                                          <p className="item-title text-right">
                                            {event.direction}
                                          </p>
                                        </>
                                      ) : null}
                                    </div>
                                    <p>{event.userName}</p>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex flex-row items-center border-t border-border   bg-muted/50  px-6 py-3">
                        <div className="text-xs text-muted-foreground">
                          Updated <time dateTime="2023-11-23">November 23, 2023</time>
                        </div>
                      </CardFooter>
                    </Card>
                  </div>


                  */
/** <div className="grid items-start gap-4 md:gap-8 lg:col-span-1">
                    <Card
                      className="overflow-hidden rounded-lg text-foreground"
                      x-chunk="dashboard-05-chunk-4"
                    >
                      <CardHeader className="flex flex-row items-start  bg-muted/50 ">
                        <div className="grid gap-0.5">
                          <CardTitle className="group flex items-center gap-2 text-lg">
                            Timeline
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                            >
                              <Copy className="h-3 w-3" />
                              <span className="sr-only">
                                Snap shot on customer interactions, whether they are
                                buying something or a sales person following up to make
                                a sale.
                              </span>
                            </Button>
                          </CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-grow !grow overflow-y-auto overflow-x-clip bg-background p-6 text-sm">
                        <div className="grid h-auto max-h-[65vh] gap-3">
                          <div className="rightbox">
                            <div className="rb-container">
                              <ul className="rb">
                                {sortedEvents.reverse().map((event, index) => (
                                  <li
                                    key={index}
                                    className="rb-item grid-grid-cols-1 bg-muted-background rounded-lg px-3 py-2 "
                                  >
                                    <div className="timestamp flex justify-between text-primary">
                                      <p>{event.date}</p>
                                      <p className="text-right">{event.type}</p>
                                    </div>
                                    <div className="timestamp flex justify-between">
                                      <div className="item-title">{event.title}</div>
                                      {event.type === "Communication" ? (
                                        <>
                                          <p className="item-title text-right">
                                            {event.direction}
                                          </p>
                                        </>
                                      ) : null}
                                    </div>
                                    <p>{event.userName}</p>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex flex-row items-center border-t border-border   bg-muted/50  px-6 py-3">
                        <div className="text-xs text-muted-foreground">
                          Updated <time dateTime="2023-11-23">November 23, 2023</time>
                        </div>
                      </CardFooter>
                    </Card>
                  </div> */
