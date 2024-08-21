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
  useLocation,
} from "@remix-run/react";
import { ButtonLoading } from "~/components/ui/button-loading";
import {
  BanknoteIcon,
  ChevronLeft,
  ChevronRight,
  Copy,
  CreditCard,
  DollarSign,
  File,
  Home,
  LineChart,
  ListFilter,
  MoreVertical,
  Package,
  Package2,
  PanelLeft,
  PanelTop,
  Search,
  Settings,
  ShoppingCart,
  Truck,
  Users2,
  X,
} from "lucide-react";
import { format } from "date-fns"
import { Calendar as SmallCalendar } from '~/components/ui/calendar';
import { cn } from "~/components/ui/utils";

import { CalendarIcon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion"
import { FaCheck } from "react-icons/fa";

import { buttonVariants } from "~/components/ui/button"
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
import { toast } from "sonner";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import { ClientOnly } from "remix-utils";
import PrintReceipt from "~/routes/__authorized/dealer/document/printReceiptAcc";
import { Percent } from "lucide-react";
import { PlusIcon } from "lucide-react";



export default function ClientDialog({ data, user, deFees, salesPerson }) {
  const { AccOrder, Finance, WorkOrder, Comm, } = data;
  const [paymentType, setPaymentType] = useState('');
  const [discount, setDiscount] = useState(false)
  const [discDollar, setDiscDollar] = useState(0.00)
  const [discPer, setDiscPer] = useState(0.00)
  const [copiedText, setCopiedText] = useState('');
  const [input, setInput] = useState("");
  const inputLength = input.trim().length
  const ref = useRef();
  const submit = useSubmit()
  const fetcher = useFetcher();
  let inputRef = useRef<HTMLInputElement>(null);
  let buttonRef = useRef<HTMLButtonElement>(null);
  const timerRef = useRef(0);
  const formRef = useRef();
  let sortedEvents = [];



  let workorderCard = [
    { name: "workOrderId", value: data.WorkOrder.workOrderId, label: "workOrderId", },
    { name: "unit", value: data.WorkOrder.unit, label: "unit", },
    { name: "mileage", value: data.WorkOrder.mileage, label: "mileage", },
    { name: "vin", value: data.WorkOrder.vin, label: "vin", },
    { name: "tag", value: data.WorkOrder.tag, label: "tag", },
    { name: "motor", value: data.WorkOrder.motor, label: "motor", },
    { name: "color", value: data.WorkOrder.color, label: "color", },
    { name: "budget", value: data.WorkOrder.budget, label: "budget", },
    { name: "waiter", value: data.WorkOrder.waiter, label: "waiter", },
    { name: "totalLabour", value: data.WorkOrder.totalLabour, label: "totalLabour", },
    { name: "totalParts", value: data.WorkOrder.totalParts, label: "totalParts", },
    { name: "subTotal", value: data.WorkOrder.subTotal, label: "subTotal", },
    { name: "total", value: data.WorkOrder.total, label: "total", },
    { name: "writer", value: data.WorkOrder.writer, label: "writer", },
    { name: "userEmail", value: data.WorkOrder.userEmail, label: "userEmail", },
    { name: "tech", value: data.WorkOrder.tech, label: "tech", },
    { name: "techEmail", value: data.WorkOrder.techEmail, label: "techEmail", },
    { name: "notes", value: data.WorkOrder.notes, label: "notes", },
    { name: "customerSig", value: data.WorkOrder.customerSig, label: "customerSig", },
    { name: "status", value: data.WorkOrder.status, label: "status", },
    { name: "location", value: data.WorkOrder.location, label: "location", },
    { name: "quoted", value: data.WorkOrder.quoted, label: "quoted", },
    { name: "paid", value: data.WorkOrder.paid, label: "paid", },
    { name: "remaining", value: data.WorkOrder.remaining, label: "remaining", },
    { name: "FinanceUnitId", value: data.WorkOrder.FinanceUnitId, label: "FinanceUnitId", },
    { name: "ServiceUnitId", value: data.WorkOrder.ServiceUnitId, label: "ServiceUnitId", },
    { name: "financeId", value: data.WorkOrder.financeId, label: "financeId", },
    { name: "clientfileId", value: data.WorkOrder.clientfileId, label: "clientfileId", },
    { name: "note", value: data.WorkOrder.note, label: "note", },
    { name: "closedAt", value: data.WorkOrder.closedAt, label: "closedAt", },
  ];
  let pacCard = [
    { name: "userEmail", value: data.userEmail, label: "userEmail", },
    { name: "userName", value: data.userName, label: "userName", },
    { name: "dept", value: data.dept, label: "dept", },
    { name: "sellingDept", value: data.sellingDept, label: "sellingDept", },
    { name: "total", value: data.total, label: "total", },
    { name: "discount", value: data.discount, label: "discount", },
    { name: "discPer", value: data.discPer, label: "discPer", },
    { name: "paid", value: data.paid, label: "paid", },
    { name: "paidDate", value: data.paidDate, label: "paidDate", },
    { name: "status", value: data.status, label: "status", },
    { name: "workOrderId", value: data.workOrderId, label: "workOrderId", },
    { name: "note", value: data.note, label: "note", },
  ];


  const options2 = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };


  const copyText = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopiedText(text);
        setTimeout(() => setCopiedText(''), 3000); // Reset after 3 seconds
      })
      .catch((error) => {
        console.error('Failed to copy text: ', error);
      });
  };
  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, [])

  // useEffect(() => {
  // console.log('useEffect triggered');
  // console.log('order.discount:', order.discount);
  //if (order.discount) {
  //  console.log('Setting discount:', order.discount);
  //  setDiscDollar(order.discount);
  // } else {
  //    console.log('Discount is 0 or less');
  // }
  //}, [order.discount]);

  // useEffect(() => {

  //if (order.discPer > 0.00) {
  //   setDiscPer(order.discPer)
  // }
  //}, []);

  const taxMultiplier = Number(deFees.userTax);
  const taxRate = 1 + taxMultiplier / 100;

  const totalAccessoriesCost = data.AccOrder.reduce((total, order) => {
    return total + (order.quantity * order.price);
  }, 0);

  const totalAmountPaid = data.Finance.reduce((total, finance) => {
    return total + finance.amountPaid;
  }, 0);

  const total2 = ((totalAccessoriesCost - parseFloat(discDollar)) * taxRate).toFixed(2);
  const total1 = (((totalAccessoriesCost * (100 - parseFloat(discPer))) / 100) * taxRate).toFixed(2);

  const total = discPer === 0 ? total2 : total1;

  const remaining = parseFloat(total) - parseFloat(totalAmountPaid)
  useEffect(() => {
    if (remaining === 0) {
      toast.success('Order is paid in full!', {
        duration: Infinity
      })
    }
  }, [remaining]);

  const toReceipt = {}
  /**
   *
  const [changeSize, setChangeSize] = useState(false)

  const client = data.id

   const { AccessoriesOnOrders } = order;
    const maxAccessories = 19;

    const toReceipt = {
      qrCode: order.id,
      subTotal: `$${totalAccessoriesCost.toFixed(2)}`,
      tax: `${tax.userTax}%`,
      total: `$${total}`,
      remaining: `$${parseFloat(total) - parseFloat(totalAmountPaid)}`,
      firstName: client.firstName,
      lastName: client.lastName,
      phone: client.phone,
      email: client.email,
      address: client.address,
      date: new Date(order.createdAt).toLocaleDateString("en-US", options2),
      cardNum: '',
      paymentType: '',
      image: dealerImage.dealerLogo
    };

      AccessoriesOnOrders.forEach((result, index) => {
    if (index < maxAccessories) {
      toReceipt[`desc${index + 1}`] = `${result.accessory.brand} ${result.accessory.name}`;
      toReceipt[`qt${index + 1}`] = String(result.quantity);
      toReceipt[`price${index + 1}`] = String(result.accessory.price);
    }
  });

  for (let i = AccessoriesOnOrders.length + 1; i <= maxAccessories; i++) {
    toReceipt[`desc${i}`] = '';
    toReceipt[`qt${i}`] = '';
    toReceipt[`price${i}`] = '';
  }



  */

  const managerSidebarNav = [
    {
      title: "Sales Deals",
      section: [
        { title: "Deal Info", value: "sales-dealInfo", },
        { title: "Appointments", value: "sales-appts", },
        { title: "Communications", value: "sales-comms", },
        { title: "Customer Units", value: "sales-custUnits", },
        { title: "Trade Units", value: "sales-trades", },
        { title: "Accessory Orders", value: "sales-accOrders", },
        { title: "Work Orders", value: "sales-workOrders", },
        { title: "Payments", value: "sales-payments", },
        { title: "Notes", value: "sales-notes", },
        { title: "Finance Products", value: "sales-finProds", },
        { title: "Sales Storage", value: "sales-storage", },
      ],
    },
    {
      title: "Work Orders",
      section: [
        { title: "Sales Units", value: "wo-salesUnits", },
        { title: "Service Units", value: "wo-servUnits", },
        { title: "PAC Orders", value: "wo-pacOrders", },
        {
          title: "Services on Orders",
          section: [
            { title: 'Service', value: "servOnOrder-payments", },
          ],
        },
        { title: "Payments", value: "wo-payments", },
        { title: "Work Order Appointments", value: "wo-appts", },
        { title: "Work Order Clock Entries", value: "wo-clockEntries", },
      ],
    },
    {
      title: "PAC Orders",
      section: [
        { title: "Payments", value: "pac-payments", },
        {
          title: "Accessories on Orders",
          section: [
            { title: 'Accessory', value: "accOnOrders-acc", },
            { title: 'Order Inventory', value: "accOnOrders-orderInv", }
          ]
        },
        { title: "AccHandoff", value: "pac-accHandoff", },
      ],
    },


  ]
  function generateSidebarItems(financeData) {
    return financeData.map((finance) => ({
      title: `${finance.year} ${finance.brand} ${finance.model}`, // Dynamic title
      section: [
        { title: "Unit", value: `sales-dealInfo-${finance.id}` },
        { title: "Deal Info", value: `sales-dealInfo-${finance.id}` },
        { title: "Appointments", value: `sales-appts-${finance.id}` },
        { title: "Communications", value: `sales-comms-${finance.id}` },
        { title: "Customer Units", value: `sales-custUnits-${finance.id}` },
        { title: "Trade Units", value: `sales-trades-${finance.id}` },
        { title: "Accessory Orders", value: `sales-accOrders-${finance.id}` },
        { title: "Work Orders", value: `sales-workOrders-${finance.id}` },
        { title: "Payments", value: `sales-payments-${finance.id}` },
        { title: "Notes", value: `sales-notes-${finance.id}` },
        { title: "Finance Products", value: `sales-finProds-${finance.id}` },
        { title: "Document Storage", value: `sales-storage-${finance.id}` },
      ],
    }));
  }

  const staticSidebarItems = [
    { title: "Client Info", value: "client" },
    {
      title: "Work Orders",
      section: [
        { title: "Work Orders", value: "wo-wo" },
        { title: "Sales Units", value: "wo-salesUnits" },
        { title: "Service Units", value: "wo-servUnits" },
        { title: "PAC Orders", value: "wo-pacOrders" },
        { title: "Payments", value: "wo-payments" },
        { title: "Work Order Appointments", value: "wo-appts" },
        { title: "Work Order Clock Entries", value: "wo-clockEntries" },
        {
          title: "Services on Orders",
          section: [
            { title: 'Services on Orders', value: "servOnOrder-SOO" },
            { title: 'Service', value: "servOnOrder-payments" },
          ],
        },
      ],
    },
    {
      title: "PAC Orders",
      section: [
        { title: "PAC Orders", value: "pac-PAC" },
        { title: "AccHandoff", value: "pac-accHandoff" },
        { title: "Payments", value: "pac-payments" },
        {
          title: "Accessories on Orders",
          section: [
            { title: 'Accessories on Orders', value: "accOnOrders-AOO" },
            { title: 'Accessory', value: "accOnOrders-acc" },
            { title: 'Order Inventory', value: "accOnOrders-orderInv" },
          ],
        },
      ],
    },
  ];

  const [selectedContent, setSelectedContent] = useState<string | null>(null);
  const [finance, setFinance] = useState<any>(99);
  const [selectedFinanceArray, setSelectedFinanceArray] = useState<any>(null);

  const handleSelect = (value: string) => {
    setSelectedContent(value);
  };

  const handleFinanceChange = (data: any) => {
    setSelectedFinanceArray(data);
  };
  function SidebarNav({
    className,
    items,
    onSelect,
    onFinanceChange,
    ...props
  }: SidebarNavProps) {
    const [selectedParent, setSelectedParent] = useState<string | null>(null);
    const [selectedValue, setSelectedValue] = useState<string | null>(null);
    const [openSections, setOpenSections] = useState<Set<string>>(new Set());

    const handleParentClick = (title: string) => {
      const newOpenSections = new Set(openSections);
      if (newOpenSections.has(title)) {
        newOpenSections.delete(title);
      } else {
        newOpenSections.add(title);
      }
      setOpenSections(newOpenSections);
    };

    const handleItemClick = (value: string, data?: any) => {
      setSelectedValue(value);
      onSelect(value);

      if (data) {
        setFinance(data); // Update finance data
        onFinanceChange(data); // Notify parent or other components
      }
    };

    const renderItems = (items: SidebarNavItem[], isSubSection = false) => {
      return items.map((item) => (
        <div key={item.title}>
          {item.section ? (
            <div>
              <Button
                variant="ghost"
                className={cn(
                  "justify-start w-[90%]",
                  openSections.has(item.title)
                    ? "bg-[#232324] hover:bg-muted/50 w-[90%]"
                    : "hover:bg-muted/50 text-[#a1a1aa] w-[90%]"
                )}
                onClick={() => handleParentClick(item.title)}
              >
                {item.title}
              </Button>
              {openSections.has(item.title) && (
                <div className="ml-4">
                  {renderItems(item.section, true)}
                </div>
              )}
            </div>
          ) : (
            <Button
              variant="ghost"
              key={item.value}
              className={cn(
                "justify-start w-[90%]",
                selectedValue === item.value
                  ? "bg-[#232324] hover:bg-muted/50 w-[90%]"
                  : "hover:bg-muted/50 text-[#a1a1aa] w-[90%]",
                isSubSection ? "ml-4" : ""
              )}
              onClick={() => item.value && handleItemClick(item.value, item.data)}
            >
              {item.title}
            </Button>
          )}
        </div>
      ));
    };

    return (
      <nav
        className={cn(
          "flex space-x-2 flex-row max-w-[95%] lg:flex-col lg:space-x-0 lg:space-y-1 mt-3",
          className
        )}
        {...props}
      >
        {renderItems(items)}
      </nav>
    );
  }

  const sidebarItems = [
    ...staticSidebarItems,
    ...generateSidebarItems(data.Finance),
  ];

  const renderContent = (selectedContent, finance) => {
    if (!finance) {
      return <ClientInfo data={data} fetcher={fetcher} />

    }
    console.log(finance, 'in render')
    switch (selectedContent) {
      // client
      case 'client':
        return <ClientInfo data={data} fetcher={fetcher} />

      // sales

      case `sales-appts-${finance.id}`:
        return <SalesAppts finance={finance} user={user} submit={submit} />;

      case `sales-comms-${finance.id}`:
        return <Communications finance={finance} />;

      case `sales-accOrders-${finance.id}`:
        return <SalesAccOrder finance={finance} deFees={deFees} salesPerson={salesPerson} />;

      case `sales-storage-${finance.id}`:
        return <SalesStorage finance={finance} copyText={copyText} copiedText={copiedText} />;

      case `sales-dealInfo-${finance.id}`:
        return <DealInfo finance={finance} />;

      case `sales-custUnits-${finance.id}`:
        return <CustomerBikes finance={finance} fetcher={fetcher} />;

      case `sales-trades-${finance.id}`:
        return <FinanceTradeUnit finance={finance} fetcher={fetcher} />;

      case `sales-payments-${finance.id}`:
        return <PaymentsFinance finance={finance} fetcher={fetcher} user={user} formRef={formRef} setInput={setInput} inputLength={inputLength} />;

      case `sales-notes-${finance.id}`:
        return <FinanceNotes finance={finance} fetcher={fetcher} input={input} user={user} formRef={formRef} setInput={setInput} inputLength={inputLength} />;

      case `sales-finProds-${finance.id}`:
        return null;


      // work order
      case `wo-wo`:
        return <WorkOrders finance={finance} copyText={copyText} copiedText={copiedText} />;


      // PAC order
      case `pac-PAC`:
        return <AccOrders finance={finance} copyText={copyText} copiedText={copiedText} />;
      default:
        return <div>Select an item from the sidebar.</div>;
    }
  };

  const [unit, setUnit] = useState();
  const clientData = {

  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Client File</Button>
      </DialogTrigger>
      <DialogContent className="w-auto max-w-[95%] border border-border md:max-w-[90%] h-auto max-h-[700px] overflow-y-auto">
        <DialogHeader>
        </DialogHeader>
        <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
          <div className="grid items-start gap-4 md:gap-8 lg:col-span-1">
            <Card
              className="overflow-hidden rounded-lg text-foreground"
              x-chunk="dashboard-05-chunk-4"
            >
              <CardHeader className="flex flex-row items-start  bg-muted/50 ">
                <div className="grid gap-0.5">
                  <CardTitle className="group flex items-center gap-2 text-lg">
                    Menu
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
                <SidebarNav
                  items={sidebarItems}
                  onSelect={handleSelect}
                  onFinanceChange={handleFinanceChange}
                />
              </CardContent>
              <CardFooter className="flex flex-row items-center border-t border-border   bg-muted/50  px-6 py-3">
                <div className="text-xs text-muted-foreground">

                </div>
              </CardFooter>
            </Card>
          </div>
          <div className="grid gap-4 md:gap-8 lg:col-span-2 ">
            {renderContent(selectedContent, selectedFinanceArray)}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface SidebarNavProps {
  className?: string;
  items: SidebarNavItem[];
  onSelect: (value: string) => void;
  onFinanceChange: (data: any) => void; // Function to update finance data
}
interface SidebarNavItem {
  title: string;
  value?: string;
  section?: SidebarNavItem[];
}
function ClientInfo({ data, fetcher }) {
  let customerCard = [
    { name: "firstName", value: data.firstName, label: "firstName", },
    { name: "lastName", value: data.lastName, label: "lastName", },
    { name: "name", value: data.name, label: "name", },
    { name: "email", value: data.email, label: "email", },
    { name: "phone", value: data.phone, label: "phone", },
    { name: "address", value: data.address, label: "address", },
    { name: "city", value: data.city, label: "city", },
    { name: "postal", value: data.postal, label: "postal", },
    { name: "province", value: data.province, label: "province", },
    { name: "dl", value: data.dl, label: "dl", },
    { name: "typeOfContact", value: data.typeOfContact, label: "typeOfContact", },
    { name: "timeToContact", value: data.timeToContact, label: "timeToContact", },
    { name: "billingAddress", value: data.billingAddress, label: "billingAddress", },
  ];
  return (
    <Card
      className="overflow-hidden rounded-lg text-foreground"
      x-chunk="dashboard-05-chunk-4"
    >
      <Form method='post'>

        <CardHeader className="flex flex-row items-start  bg-muted/50 ">
          <div className="grid gap-0.5">
            <CardTitle className="group flex items-center gap-2 text-lg">
              Client Info
              <Button
                size="icon"
                variant="outline"
                className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <Copy className="h-3 w-3" />
                <span className="sr-only">

                </span>
              </Button>
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex-grow !grow overflow-y-auto overflow-x-clip bg-background p-6 text-sm">
          <div className="grid h-auto  max-h-[65vh] grid-cols-2 gap-3 mt-5">


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
            <div className="relative mt-5  ">
              <Select
                onValueChange={(value) => {
                  const formData = new FormData();
                  formData.append("id", data.id);
                  formData.append("typeOfContact", value);
                  formData.append("intent", 'typeOfContact');
                  console.log(formData, 'formData');
                  fetcher.submit(formData, { method: "post" });
                }}
                defaultValue={data.typeOfContact}
                name='typeOfContact'>
                <SelectTrigger className="w-full focus:border-primary">
                  <SelectValue placeholder='Type Of Contact' />
                </SelectTrigger>
                <SelectContent className=' bg-background text-foreground border border-border' >
                  <SelectGroup>
                    <SelectLabel>Contact Method</SelectLabel>
                    <SelectItem value="Phone">Phone</SelectItem>
                    <SelectItem value="InPerson">In-Person</SelectItem>
                    <SelectItem value="SMS">SMS</SelectItem>
                    <SelectItem value="Email">Email</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <label className=" absolute -top-3 left-3  rounded-full bg-background px-2 text-sm transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">
                Type Of Contact
              </label>
            </div>
            <div className="relative mt-5  ">
              <Select
                onValueChange={(value) => {
                  const formData = new FormData();
                  formData.append("id", data.id);
                  formData.append("timeToContact", value);
                  formData.append("intent", 'timeToContact');
                  console.log(formData, 'formData');
                  fetcher.submit(formData, { method: "post" });
                }}
                defaultValue={data.timeToContact}
                name='timeToContact'>
                <SelectTrigger className="w-full focus:border-primary">
                  <SelectValue placeholder='Time To Contact' />
                </SelectTrigger>
                <SelectContent className=' bg-background text-foreground border border-border' >
                  <SelectGroup>
                    <SelectLabel>Best Time To Contact</SelectLabel>
                    <SelectItem value="Morning">Morning</SelectItem>
                    <SelectItem value="Afternoon">Afternoon</SelectItem>
                    <SelectItem value="Evening">Evening</SelectItem>
                    <SelectItem value="Do Not Contact">Do Not Contact</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <label className=" absolute -top-3 left-3  rounded-full bg-background px-2 text-sm transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">
                Time To Contact
              </label>
            </div>
            <input type='hidden' name='id' value={data.id} />

          </div>

        </CardContent>
        <CardFooter className="flex flex-row items-center border-t border-border   bg-muted/50  px-6 py-3">
          <div>
            <Button type='submit' name='intent' value='updateClient' size='sm' >Save</Button>
          </div>
        </CardFooter>

      </Form>

    </Card>
  )
}
function DealInfo({ finance }) {
  let financesCard = [
    { name: "financeManager", value: finance.financeManager, label: "financeManager", },
    { name: "userEmail", value: finance.userEmail, label: "userEmail", },
    { name: "userName", value: finance.userName, label: "userName", },
    { name: "financeManagerName", value: finance.financeManagerName, label: "financeManagerName", },
    { name: "email", value: finance.email, label: "email", },
    { name: "firstName", value: finance.firstName, label: "firstName", },
    { name: "lastName", value: finance.lastName, label: "lastName", },
    { name: "phone", value: finance.phone, label: "phone", },
    { name: "name", value: finance.name, label: "name", },
    { name: "address", value: finance.address, label: "address", },
    { name: "city", value: finance.city, label: "city", },
    { name: "postal", value: finance.postal, label: "postal", },
    { name: "province", value: finance.province, label: "province", },
    { name: "dl", value: finance.dl, label: "dl", },
    { name: "typeOfContact", value: finance.typeOfContact, label: "typeOfContact", },
    { name: "timeToContact", value: finance.timeToContact, label: "timeToContact", },
    { name: "dob", value: finance.dob, label: "dob", },
    { name: "othTax", value: finance.othTax, label: "othTax", },
    { name: "optionsTotal", value: finance.optionsTotal, label: "optionsTotal", },
    { name: "lienPayout", value: finance.lienPayout, label: "lienPayout", },
    { name: "leadNote", value: finance.leadNote, label: "leadNote", },
    { name: "sendToFinanceNow", value: finance.sendToFinanceNow, label: "sendToFinanceNow", },
    { name: "dealNumber", value: finance.dealNumber, label: "dealNumber", },
    { name: "iRate", value: finance.iRate, label: "iRate", },
    { name: "months", value: finance.months, label: "months", },
    { name: "discount", value: finance.discount, label: "discount", },
    { name: "total", value: finance.total, label: "total", },
    { name: "onTax", value: finance.onTax, label: "onTax", },
    { name: "on60", value: finance.on60, label: "on60", },
    { name: "biweekly", value: finance.biweekly, label: "biweekly", },
    { name: "weekly", value: finance.weekly, label: "weekly", },
    { name: "weeklyOth", value: finance.weeklyOth, label: "weeklyOth", },
    { name: "biweekOth", value: finance.biweekOth, label: "biweekOth", },
    { name: "oth60", value: finance.oth60, label: "oth60", },
    { name: "weeklyqc", value: finance.weeklyqc, label: "weeklyqc", },
    { name: "biweeklyqc", value: finance.biweeklyqc, label: "biweeklyqc", },
    { name: "qc60", value: finance.qc60, label: "qc60", },
    { name: "deposit", value: finance.deposit, label: "deposit", },
    { name: "biweeklNatWOptions", value: finance.biweeklNatWOptions, label: "biweeklNatWOptions", },
    { name: "weeklylNatWOptions", value: finance.weeklylNatWOptions, label: "weeklylNatWOptions", },
    { name: "nat60WOptions", value: finance.nat60WOptions, label: "nat60WOptions", },
    { name: "weeklyOthWOptions", value: finance.weeklyOthWOptions, label: "weeklyOthWOptions", },
    { name: "biweekOthWOptions", value: finance.biweekOthWOptions, label: "biweekOthWOptions", },
    { name: "oth60WOptions", value: finance.oth60WOptions, label: "oth60WOptions", },
    { name: "biweeklNat", value: finance.biweeklNat, label: "biweeklNat", },
    { name: "weeklylNat", value: finance.weeklylNat, label: "weeklylNat", },
    { name: "nat60", value: finance.nat60, label: "nat60", },
    { name: "qcTax", value: finance.qcTax, label: "qcTax", },
    { name: "otherTax", value: finance.otherTax, label: "otherTax", },
    { name: "totalWithOptions", value: finance.totalWithOptions, label: "totalWithOptions", },
    { name: "otherTaxWithOptions", value: finance.otherTaxWithOptions, label: "otherTaxWithOptions", },
    { name: "desiredPayments", value: finance.desiredPayments, label: "desiredPayments", },
    { name: "admin", value: finance.admin, label: "admin", },
    { name: "commodity", value: finance.commodity, label: "commodity", },
    { name: "pdi", value: finance.pdi, label: "pdi", },
    { name: "discountPer", value: finance.discountPer, label: "discountPer", },
    { name: "userLoanProt", value: finance.userLoanProt, label: "userLoanProt", },
    { name: "userTireandRim", value: finance.userTireandRim, label: "userTireandRim", },
    { name: "userGap", value: finance.userGap, label: "userGap", },
    { name: "userExtWarr", value: finance.userExtWarr, label: "userExtWarr", },
    { name: "userServicespkg", value: finance.userServicespkg, label: "userServicespkg", },
    { name: "deliveryCharge", value: finance.deliveryCharge, label: "deliveryCharge", },
    { name: "vinE", value: finance.vinE, label: "vinE", },
    { name: "lifeDisability", value: finance.lifeDisability, label: "lifeDisability", },
    { name: "rustProofing", value: finance.rustProofing, label: "rustProofing", },
    { name: "userOther", value: finance.userOther, label: "userOther", },
    { name: "referral", value: finance.referral, label: "referral", },
    { name: "visited", value: finance.visited, label: "visited", },
    { name: "bookedApt", value: finance.bookedApt, label: "bookedApt", },
    { name: "aptShowed", value: finance.aptShowed, label: "aptShowed", },
    { name: "aptNoShowed", value: finance.aptNoShowed, label: "aptNoShowed", },
    { name: "testDrive", value: finance.testDrive, label: "testDrive", },
    { name: "metService", value: finance.metService, label: "metService", },
    { name: "metManager", value: finance.metManager, label: "metManager", },
    { name: "metParts", value: finance.metParts, label: "metParts", },
    { name: "sold", value: finance.sold, label: "sold", },
    { name: "depositMade", value: finance.depositMade, label: "depositMade", },
    { name: "refund", value: finance.refund, label: "refund", },
    { name: "turnOver", value: finance.turnOver, label: "turnOver", },
    { name: "financeApp", value: finance.financeApp, label: "financeApp", },
    { name: "approved", value: finance.approved, label: "approved", },
    { name: "signed", value: finance.signed, label: "signed", },
    { name: "pickUpSet", value: finance.pickUpSet, label: "pickUpSet", },
    { name: "demoed", value: finance.demoed, label: "demoed", },
    { name: "lastContact", value: finance.lastContact, label: "lastContact", },
    { name: "status", value: finance.status, label: "status", },
    { name: "customerState", value: finance.customerState, label: "customerState", },
    { name: "result", value: finance.result, label: "result", },
    { name: "timesContacted", value: finance.timesContacted, label: "timesContacted", },
    { name: "nextAppointment", value: finance.nextAppointment, label: "nextAppointment", },
    { name: "followUpDay", value: finance.followUpDay, label: "followUpDay", },
    { name: "deliveryDate", value: finance.deliveryDate, label: "deliveryDate", },
    { name: "delivered", value: finance.delivered, label: "delivered", },
    { name: "deliveredDate", value: finance.deliveredDate, label: "deliveredDate", },
    { name: "notes", value: finance.notes, label: "notes", },
    { name: "visits", value: finance.visits, label: "visits", },
    { name: "progress", value: finance.progress, label: "progress", },
    { name: "metSalesperson", value: finance.metSalesperson, label: "metSalesperson", },
    { name: "metFinance", value: finance.metFinance, label: "metFinance", },
    { name: "financeApplication", value: finance.financeApplication, label: "financeApplication", },
    { name: "pickUpDate", value: finance.pickUpDate, label: "pickUpDate", },
    { name: "pickUpTime", value: finance.pickUpTime, label: "pickUpTime", },
    { name: "depositTakenDate", value: finance.depositTakenDate, label: "depositTakenDate", },
    { name: "docsSigned", value: finance.docsSigned, label: "docsSigned", },
    { name: "tradeRepairs", value: finance.tradeRepairs, label: "tradeRepairs", },
    { name: "seenTrade", value: finance.seenTrade, label: "seenTrade", },
    { name: "lastNote", value: finance.lastNote, label: "lastNote", },
    { name: "applicationDone", value: finance.applicationDone, label: "applicationDone", },
    { name: "licensingSent", value: finance.licensingSent, label: "licensingSent", },
    { name: "liceningDone", value: finance.liceningDone, label: "liceningDone", },
    { name: "refunded", value: finance.refunded, label: "refunded", },
    { name: "cancelled", value: finance.cancelled, label: "cancelled", },
    { name: "lost", value: finance.lost, label: "lost", },
    { name: "dLCopy", value: finance.dLCopy, label: "dLCopy", },
    { name: "insCopy", value: finance.insCopy, label: "insCopy", },
    { name: "testDrForm", value: finance.testDrForm, label: "testDrForm", },
    { name: "voidChq", value: finance.voidChq, label: "voidChq", },
    { name: "loanOther", value: finance.loanOther, label: "loanOther", },
    { name: "signBill", value: finance.signBill, label: "signBill", },
    { name: "ucda", value: finance.ucda, label: "ucda", },
    { name: "tradeInsp", value: finance.tradeInsp, label: "tradeInsp", },
    { name: "customerWS", value: finance.customerWS, label: "customerWS", },
    { name: "otherDocs", value: finance.otherDocs, label: "otherDocs", },
    { name: "urgentFinanceNote", value: finance.urgentFinanceNote, label: "urgentFinanceNote", },
    { name: "funded", value: finance.funded, label: "funded", },
    { name: "leadSource", value: finance.leadSource, label: "leadSource", },
    { name: "financeDeptProductsTotal", value: finance.financeDeptProductsTotal, label: "financeDeptProductsTotal", },
    { name: "bank", value: finance.bank, label: "bank", },
    { name: "loanNumber", value: finance.loanNumber, label: "loanNumber", },
    { name: "idVerified", value: finance.idVerified, label: "idVerified", },
    { name: "dealerCommission", value: finance.dealerCommission, label: "dealerCommission", },
    { name: "financeCommission", value: finance.financeCommission, label: "financeCommission", },
    { name: "salesCommission", value: finance.salesCommission, label: "salesCommission", },
    { name: "firstPayment", value: finance.firstPayment, label: "firstPayment", },
    { name: "loanMaturity", value: finance.loanMaturity, label: "loanMaturity", },
    { name: "quoted", value: finance.quoted, label: "quoted", },
    { name: "InPerson", value: finance.InPerson, label: "InPerson", },

    { name: "paintPrem", value: finance.paintPrem, label: "paintPrem", },
    { name: "licensing", value: finance.licensing, label: "licensing", },
    { name: "stockNum", value: finance.stockNum, label: "stockNum", },
    { name: "options", value: finance.options, label: "options", },
    { name: "accessories", value: finance.accessories, label: "accessories", },
    { name: "freight", value: finance.freight, label: "freight", },
    { name: "labour", value: finance.labour, label: "labour", },
    { name: "year", value: finance.year, label: "year", },
    { name: "brand", value: finance.brand, label: "brand", },
    { name: "mileage", value: finance.mileage, label: "mileage", },
    { name: "model", value: finance.model, label: "model", },
    { name: "model1", value: finance.model1, label: "model1", },
    { name: "color", value: finance.color, label: "color", },
    { name: "modelCode", value: finance.modelCode, label: "modelCode", },
    { name: "msrp", value: finance.msrp, label: "msrp", },
    { name: "trim", value: finance.trim, label: "trim", },
    { name: "vin", value: finance.vin, label: "vin", },
    { name: "bikeStatus", value: finance.bikeStatus, label: "bikeStatus", },
    { name: "invId", value: finance.invId, label: "invId", },
    { name: "motor", value: finance.motor, label: "motor", },
    { name: "tag", value: finance.tag, label: "tag", },
    { name: "tradeValue", value: finance.tradeValue, label: "tradeValue", },
    { name: "tradeDesc", value: finance.tradeDesc, label: "tradeDesc", },
    { name: "tradeColor", value: finance.tradeColor, label: "tradeColor", },
    { name: "tradeYear", value: finance.tradeYear, label: "tradeYear", },
    { name: "tradeMake", value: finance.tradeMake, label: "tradeMake", },
    { name: "tradeVin", value: finance.tradeVin, label: "tradeVin", },
    { name: "tradeTrim", value: finance.tradeTrim, label: "tradeTrim", },
    { name: "tradeMileage", value: finance.tradeMileage, label: "tradeMileage", },
    { name: "tradeLocation", value: finance.tradeLocation, label: "tradeLocation", },
    { name: "lien", value: finance.lien, label: "lien", },
    { name: "Phone", value: finance.Phone, label: "Phone", },
    { name: "Email", value: finance.Email, label: "Email", },
    { name: "Other", value: finance.Other, label: "Other", },
    {/* name: "SMS", value: finance.SMS, label: "SMS", */ }

  ];
  return (
    <Card className="overflow-hidden rounded-lg text-foreground" x-chunk="dashboard-05-chunk-4"  >
      <CardHeader className="flex flex-row items-start  bg-muted/50 ">
        <CardTitle className="group flex items-center gap-2 text-lg">
          Client Info
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow !grow overflow-y-auto overflow-x-clip bg-background p-6 text-sm">

        <div className='grid grid-cols-2 gap-4'>
          {financesCard.map((user, index) => (
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
        </div>
      </CardContent>
      <CardFooter className="flex flex-row items-center border-t border-border   bg-muted/50  px-6 py-3">
        <div>
        </div>
      </CardFooter>
    </Card>

  )
}
function SalesStorage({ finance, copyText, copiedText }) {
  return (
    <div>
      <Card className="overflow-hidden rounded-lg text-foreground" x-chunk="dashboard-05-chunk-4"  >
        <CardHeader className="flex flex-row items-start  bg-muted/50 ">
          <CardTitle className="group flex items-center gap-2 text-lg">
            Client Info
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow !grow overflow-y-auto overflow-x-clip bg-background p-6 text-sm">
          {finance.financeStorage && finance.financeStorage.map(storage => (
            <div key={storage.id} className='flex  group'>
              <div className='flex-col' >
                <p> {storage.url}</p>
                <p className='text-mmuted-foreground'> {storage.filePath}</p>
              </div>
              <Button
                size="icon"
                variant="outline"
                onClick={() => copyText(storage.url)}
                className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100 ml-2"
              >
                <Copy className="h-3 w-3" />
                <span className="sr-only">Copy</span>
              </Button>
              {copiedText === storage.url && <FaCheck strokeWidth={1.5} className=" ml-2 text-lg hover:text-primary" />}
            </div>
          ))
          }


        </CardContent>
        <CardFooter className="flex flex-row items-center border-t border-border   bg-muted/50  px-6 py-3">
          <div>
          </div>
        </CardFooter>
      </Card>

    </div>

  )
}
function SalesAppts({ finance, user, submit }) {
  return (
    <Card x-chunk="dashboard-04-chunk-1" >
      <CardHeader>
        <CardTitle>Breakdown of any appointments associated with the sales deal.</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 max-h-[20vh] h-auto">
          <div className="space-y-4 mt-5">

            {finance.clientApts && finance.clientApts.map((message, index) => {
              const options = {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              };
              const isValidDate = message.start && message.start !== '1969-12-31 19:00';
              const date = new Date(message.start);
              const formattedDateAppt = isValidDate ? date.toLocaleDateString('en-US', options) : 'TBD';
              return (
                <div
                  key={index}
                  className={cn("flex w-[95%] flex-col gap-2 rounded-lg px-3 py-2 text-sm bg-[#262626] mx-auto")} >
                  <div className='grid grid-cols-1'>
                    <div className='flex justify-between '>
                      {message.completed === 'yes' ? (
                        <Badge className="text-xs bg-[#1e9b3d]" variant="secondary">
                          Completed!
                        </Badge>
                      ) : (
                        <Badge className="text-xs bg-primary" variant="secondary">
                          Incomplete
                        </Badge>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="outline" className="h-8 w-8 bg-transparent">
                            <MoreVertical className="h-3.5 w-3.5" />
                            <span className="sr-only">Menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className=' bg-blackground  text-foreground border border-border'>
                          <Form method='post'>
                            <DropdownMenuItem
                              onSelect={() => {
                                const formData = new FormData();
                                formData.append("aptId", message.message);
                                formData.append("userEmail", user.email);
                                formData.append("userName", user.name);
                                formData.append("intent", 'deleteApt');
                                submit(formData, { method: "post" });
                              }}>
                              Delete
                            </DropdownMenuItem>
                            <input type='hidden' name='financeId' defaultValue={finance.id} />
                          </Form>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Trash</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>

                    </div>
                    <div className='flex justify-between mt-1'>
                      <p className='text-muted-foreground'>{formattedDateAppt}</p>
                      <p>{message.contactMethod}</p>
                    </div>
                    <p className='mt-1'> {message.title}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t border-border px-6 py-4">
        <Button
          type='submit'
          name='intent'
          value='updateDealerInfo'>
          Save
        </Button>
      </CardFooter>
    </Card>
  )
}
function Communications({ finance }) {
  return (
    <Card className="overflow-hidden rounded-lg text-foreground" x-chunk="dashboard-05-chunk-4"  >
      <CardHeader className="flex flex-row items-start  bg-muted/50 ">
        <CardTitle className="group flex items-center gap-2 text-lg">
          Communications
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow !grow overflow-y-auto overflow-x-clip bg-background p-6 text-sm">
        <Card x-chunk="dashboard-04-chunk-1" >
          <CardHeader>
            <CardTitle>
              Storage items associated with the sales file.
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 max-h-[40vh] h-auto">
              <div className="space-y-4 mt-5">

                {finance.Comm & finance.Comm.map((message, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex  max-w-[75%]   w-[65%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                      message.direction === 'Outgoing'
                        ? "ml-auto bg-primary text-foreground"
                        : "bg-[#262626]"
                    )}
                  >
                    <div className='grid grid-cols-1'>
                      <div className='flex justify-between'>
                        <p>{message.direction}</p>
                        <p className='text-right'>{message.type}</p>
                      </div>
                      <div className='flex justify-between'>
                        <p>{message.result}</p>
                        {message.userEmail === 'Outgoing' && (
                          <p className='text-[#8c8c8c] text-right'>
                            {message.userName}
                          </p>
                        )}
                      </div>
                      <p className='text-[#8c8c8c]'>
                        {message.createdAt}
                      </p>
                      <p>{message.subject}</p>
                      <p>{message.body}</p>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </CardContent>
          <CardFooter className="border-t border-border px-6 py-4">
            <Button
              type='submit'
              name='intent'
              value='updateDealerInfo'>
              Save
            </Button>
          </CardFooter>
        </Card>

      </CardContent>
      <CardFooter className="flex flex-row items-center border-t border-border   bg-muted/50  px-6 py-3">
        <div>
        </div>
      </CardFooter>
    </Card>
  )
}
function SalesAccOrder({ finance, deFees, salesPerson }) {
  const addProduct = useFetcher();
  const submit = useSubmit()
  const formRef = useRef();
  const [discount, setDiscount] = useState(false)
  const fetcher = useFetcher();
  let inputRef = useRef<HTMLInputElement>(null);
  let buttonRef = useRef<HTMLButtonElement>(null);
  const [discDollar, setDiscDollar] = useState(0.00)
  const [discPer, setDiscPer] = useState(0.00)
  const [paymentType, setPaymentType] = useState('');
  const [input, setInput] = useState("");
  const inputLength = input.trim().length
  const payment = useFetcher();



  const options2 = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };


  const taxMultiplier = Number(deFees.userTax);
  const taxRate = 1 + taxMultiplier / 100;

  const totalAccessoriesCost = data.AccOrder.reduce((total, order) => {
    return total + (order.quantity * order.price);
  }, 0);

  const totalAmountPaid = data.Finance.reduce((total, finance) => {
    return total + finance.amountPaid;
  }, 0);

  const total2 = ((totalAccessoriesCost - parseFloat(discDollar)) * taxRate).toFixed(2);
  const total1 = (((totalAccessoriesCost * (100 - parseFloat(discPer))) / 100) * taxRate).toFixed(2);

  const total = discPer === 0 ? total2 : total1;


  const toReceipt = {}
  /**
   *
  const [changeSize, setChangeSize] = useState(false)

  const client = data.id

   const { AccessoriesOnOrders } = order;
    const maxAccessories = 19;

    const toReceipt = {
      qrCode: order.id,
      subTotal: `$${totalAccessoriesCost.toFixed(2)}`,
      tax: `${tax.userTax}%`,
      total: `$${total}`,
      remaining: `$${parseFloat(total) - parseFloat(totalAmountPaid)}`,
      firstName: client.firstName,
      lastName: client.lastName,
      phone: client.phone,
      email: client.email,
      address: client.address,
      date: new Date(order.createdAt).toLocaleDateString("en-US", options2),
      cardNum: '',
      paymentType: '',
      image: dealerImage.dealerLogo
    };

      AccessoriesOnOrders.forEach((result, index) => {
    if (index < maxAccessories) {
      toReceipt[`desc${index + 1}`] = `${result.accessory.brand} ${result.accessory.name}`;
      toReceipt[`qt${index + 1}`] = String(result.quantity);
      toReceipt[`price${index + 1}`] = String(result.accessory.price);
    }
  });

  for (let i = AccessoriesOnOrders.length + 1; i <= maxAccessories; i++) {
    toReceipt[`desc${i}`] = '';
    toReceipt[`qt${i}`] = '';
    toReceipt[`price${i}`] = '';
  }



  */
  const remaining = parseFloat(total) - parseFloat(totalAmountPaid)
  useEffect(() => {
    if (remaining === 0) {
      toast.success('Order is paid in full!', {
        duration: Infinity
      })
    }
  }, [remaining]);

  return (
    <Card className="overflow-hidden rounded-lg text-foreground" x-chunk="dashboard-05-chunk-4"  >
      <CardHeader className="flex flex-row items-start  bg-muted/50 ">
        <CardTitle className="group flex items-center gap-2 text-lg">
          PAC Orders on Contract
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow !grow overflow-y-auto overflow-x-clip bg-background p-6 text-sm">

        {/* AccOrder Data */}
        {finance.AccOrders && finance.AccOrders.length > 0 && (
          <div className="mb-4">
            <h3 className="text-xl font-semibold">Accessory Orders</h3>
            {finance.AccOrders.map((order) => (
              <div className='flex flex-col'>
                <Card key={order.id} className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
                  <CardHeader className="flex flex-row items-start bg-muted/50">
                    <div className="grid gap-0.5">
                      <CardTitle className="group flex items-center gap-2 text-lg">
                        Current Order: {order.id}
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          <Copy className="h-3 w-3" />
                          <span className="sr-only">Copy Order ID</span>
                        </Button>
                      </CardTitle>
                      <CardDescription>
                        Date:{" "}
                        {new Date(order.createdAt).toLocaleDateString(
                          "en-US",
                          options2
                        )}
                      </CardDescription>
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
                          <DropdownMenuItem onSelect={() => setDiscount((prevDiscount) => !prevDiscount)}>Show Discount</DropdownMenuItem>
                          <DropdownMenuItem>Discount</DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={() => {
                              const formData = new FormData();
                              formData.append("financeId", order.financeId);
                              formData.append("subTotal", totalAccessoriesCost);
                              formData.append("intent", 'pushSubtotal');
                              submit(formData, { method: "post", });
                            }}
                          >Push Sub Total to Finance</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onSelect={() => {

                            }}>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 text-sm max-h-[780px] h-[780px] overflow-y-auto">
                    <div className="grid gap-3">
                      <div className="font-semibold">Order Details</div>
                      <ul className="grid gap-3 max-h-[400px] h-auto overflow-y-auto">
                        {order.AccessoriesOnOrders && order.AccessoriesOnOrders.map((result, index) => (
                          <li
                            className="flex items-center justify-between"
                            key={index}
                          >
                            <div>
                              <ContextMenu>
                                <ContextMenuTrigger>
                                  <div className='grid grid-cols-1'>
                                    <div className='flex items-center group '>
                                      <div className="font-medium">
                                        {result.accessory.name}
                                      </div>
                                      <addProduct.Form method="post" ref={formRef} className='mr-auto'>
                                        <input type="hidden" name="id" value={result.id} />
                                        <input type='hidden' name='total' value={total} />
                                        <input type='hidden' name='accOrderId' value={order.id} />
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
                                      {result.accessory.brand}
                                    </div>
                                    <div className="hidden text-sm text-muted-foreground md:inline">
                                      {result.accessory.category}{" "}{result.accessory.description}
                                    </div>
                                    <div>
                                      <Badge className='text-sm  px-2 py-1 '>{result.status}</Badge>
                                    </div>
                                  </div>
                                </ContextMenuTrigger>
                                <ContextMenuContent className='border-border'>
                                  <ContextMenuCheckboxItem
                                    checked={result.status === 'In Stock'}
                                    onSelect={() => {
                                      const formData = new FormData();
                                      formData.append("accOnOrderId", result.id);
                                      formData.append("status", 'In Stock');
                                      formData.append("intent", 'updateAccOnOrders');
                                      submit(formData, { method: "post", });
                                    }}
                                  >In Stock</ContextMenuCheckboxItem>
                                  <ContextMenuCheckboxItem
                                    checked={result.status === 'On Order'}
                                    onSelect={() => {
                                      const formData = new FormData();
                                      formData.append("accOnOrderId", result.id);
                                      formData.append("status", 'On Order');
                                      formData.append("intent", 'updateAccOnOrders');
                                      submit(formData, { method: "post", });
                                    }}
                                  >On Order</ContextMenuCheckboxItem>
                                  <ContextMenuCheckboxItem
                                    checked={result.status === 'Back Order'}
                                    onSelect={() => {
                                      const formData = new FormData();
                                      formData.append("accOnOrderId", result.id);
                                      formData.append("status", 'Back Order');
                                      formData.append("intent", 'updateAccOnOrders');
                                      submit(formData, { method: "post", });
                                    }}
                                  >Back Order</ContextMenuCheckboxItem>
                                  <ContextMenuCheckboxItem
                                    checked={result.status === 'Fulfilled'}
                                    onSelect={() => {
                                      const formData = new FormData();
                                      formData.append("accOnOrderId", result.id);
                                      formData.append("status", 'Fulfilled');
                                      formData.append("intent", 'updateAccOnOrders');
                                      submit(formData, { method: "post", });
                                    }}
                                  >Fulfilled</ContextMenuCheckboxItem>
                                </ContextMenuContent>
                              </ContextMenu>
                            </div>
                            <span>${result.accessory.price}{" "}{" "}x{" "}{" "}{result.quantity}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className='mt-auto'>
                      <Separator className="my-2 mt-auto" />
                      <ul className="grid gap-3">
                        <li className="flex items-center justify-between">
                          <span className="text-muted-foreground">Subtotal</span>
                          <span>${totalAccessoriesCost.toFixed(2)}</span>
                        </li>
                        {order.discount && (
                          <li className="flex items-center justify-between">
                            <span className="text-muted-foreground">Discount</span>
                            <span>${order.discount}</span>
                          </li>
                        )}
                        {order.discPer && (
                          <li className="flex items-center justify-between">
                            <span className="text-muted-foreground">Discount</span>
                            <span>{order.discPer}%</span>
                          </li>
                        )}
                        {discount && (
                          <>
                            <li className="flex items-center justify-between">
                              <span className="text-muted-foreground">Discount $</span>
                              <fetcher.Form
                                method="post"
                                onSubmit={() => {
                                  buttonRef.current?.focus();
                                }}
                                preventScrollReset
                              >
                                <input
                                  name='accOrderId'
                                  defaultValue={order.id}
                                  type='hidden'
                                />
                                <input
                                  name='intent'
                                  defaultValue='updateDiscount'
                                  type='hidden'
                                />
                                <input
                                  name='total'
                                  defaultValue={totalAccessoriesCost}
                                  type='hidden'
                                />
                                <div className="relative ml-auto flex-1 md:grow-0 ">
                                  <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-foreground" />
                                  <Input
                                    ref={inputRef}
                                    name='discDollar'
                                    className='text-right pr-10 w-[100px]'
                                    defaultValue={discDollar}
                                    onChange={(event) => setDiscDollar(event.target.value)}
                                    onKeyDown={(event) => {
                                      if (event.key === "Escape") {
                                        buttonRef.current?.focus();
                                      }
                                    }}
                                    onBlur={(event) => {
                                      if (
                                        inputRef.current?.value !== discDollar &&
                                        inputRef.current?.value.trim() !== ""
                                      ) {
                                        fetcher.submit(event.currentTarget);
                                      }
                                    }}
                                  />
                                  <Button
                                    type="submit"
                                    size="icon"

                                    disabled={!discDollar}
                                    className='bg-primary mr-2 absolute right-1.5 top-2.5 h-4 w-4 text-foreground '>
                                    <PaperPlaneIcon className="h-4 w-4" />
                                    <span className="sr-only">Cash</span>
                                  </Button>
                                </div>
                              </fetcher.Form>
                            </li>
                            <li className="flex items-center justify-between">
                              <span className="text-muted-foreground">Discount %</span>
                              <fetcher.Form
                                method="post"
                                onSubmit={() => {
                                  buttonRef.current?.focus();
                                }}
                                preventScrollReset
                              >
                                <input
                                  name='accOrderId'
                                  defaultValue={order.id}
                                  type='hidden'
                                />
                                <input
                                  name='intent'
                                  defaultValue='updateDiscPerc'
                                  type='hidden'
                                />
                                <input
                                  name='total'
                                  defaultValue={totalAccessoriesCost}
                                  type='hidden'
                                />
                                <div className="relative ml-auto flex-1 md:grow-0 ">
                                  <Input
                                    ref={inputRef}
                                    name='discPer'
                                    className='text-right pr-[43px] w-[100px]'
                                    value={discPer}
                                    onChange={(event) => setDiscPer(event.target.value)}
                                    onKeyDown={(event) => {
                                      if (event.key === "Escape") {
                                        buttonRef.current?.focus();
                                      }
                                    }}
                                    onBlur={(event) => {
                                      if (
                                        inputRef.current?.value !== discPer &&
                                        inputRef.current?.value.trim() !== ""
                                      ) {
                                        fetcher.submit(event.currentTarget);
                                      }
                                    }}
                                  />
                                  <Percent className="absolute right-10 top-[8px] h-4 w-4 text-foreground" />
                                  <Button
                                    type="submit"
                                    size="icon"

                                    disabled={!discPer}
                                    className='bg-primary mr-2 absolute right-1.5 top-[8px] h-4 w-4 text-foreground '>
                                    <PaperPlaneIcon className="h-4 w-4" />
                                    <span className="sr-only">Cash</span>
                                  </Button>
                                </div>
                              </fetcher.Form>

                            </li>
                          </>
                        )}
                        <li className="flex items-center justify-between">
                          <span className="text-muted-foreground">Tax</span>
                          <span>{deFees.userTax}%</span>
                        </li>
                        <li className="flex items-center justify-between font-semibold">
                          <span className="text-muted-foreground">Total</span>
                          <span>${total}</span>
                        </li>
                      </ul>
                      <Separator className="my-4" />
                      <div className="grid gap-3">
                        <div className="font-semibold">Payment</div>
                        <dl className="grid gap-3">

                          <div className="flex flex-col" >
                            <div className='flex items-center justify-center text-foreground'>
                              <Button
                                size="sm"
                                variant="outline"
                                className={cn('mr-2 bg-primary', paymentType === 'Visa' ? "bg-secondary" : "", "")}
                                onClick={() => setPaymentType('Visa')}
                              >
                                <CreditCard className="h-4 w-4 text-foreground" />
                                <p className="">Visa</p>
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className={cn('mr-2 bg-primary', paymentType === 'Mastercard' ? "bg-secondary" : "", "")}
                                onClick={() => setPaymentType('Mastercard')}
                              >
                                <CreditCard className="h-4 w-4 text-foreground" />
                                <p className="">Mastercard</p>
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setPaymentType('Debit')}
                                className={cn(' bg-primary mr-2', paymentType === 'Debit' ? "bg-secondary" : "", "")}
                              >
                                <CreditCard className="h-4 w-4 text-foreground" />
                                <p className="">Debit</p>
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setPaymentType('Cheque')}
                                className={cn(' bg-primary', paymentType === 'Cheque' ? "bg-secondary" : "", "")}
                              >
                                <CreditCard className="h-4 w-4 text-foreground" />
                                <p className="">Cheque</p>
                              </Button>
                            </div>
                            <div className='flex items-center justify-center text-foreground mt-2'>
                              <Button
                                size="sm"
                                variant="outline"
                                className={cn('mr-2 bg-primary', paymentType === 'Cash' ? "bg-secondary" : "", "")}
                                onClick={() => setPaymentType('Cash')}
                              >
                                <BanknoteIcon className="h-4 w-4 text-foreground" />
                                <p className="">Cash</p>
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className={cn(' bg-primary mr-2', paymentType === 'Online Transaction' ? "bg-secondary" : "", "")}
                                onClick={() => setPaymentType('Online Transaction')}
                              >
                                <PanelTop className="h-4 w-4 text-foreground" />
                                <p className="">Online Transaction</p>
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className={cn(' bg-primary', paymentType === 'E-Transfer' ? "bg-secondary" : "", "")}
                                onClick={() => setPaymentType('E-Transfer')}
                              >
                                <PanelTop className="h-4 w-4 text-foreground" />
                                <p className="">E-Transfer</p>
                              </Button>
                            </div>
                          </div>
                        </dl>
                      </div>
                      <div className="grid gap-3">
                        <ul className="grid gap-3">
                          {order.Payments && order.Payments.map((result, index) => (
                            <li className="flex items-center justify-between" key={index}                    >
                              <span className="text-muted-foreground">{result.paymentType}</span>
                              <span>${result.amountPaid}</span>
                            </li>
                          ))}
                          <li className="flex items-center justify-between">
                            <span className="text-muted-foreground">Balance</span>
                            <span>${remaining}</span>

                          </li>
                          {remaining === 0 && (
                            <li className="flex items-center justify-between">
                              <span className="text-muted-foreground"></span>
                              <Badge className='bg-[#30A46C]'>PAID</Badge>
                            </li>
                          )}
                          {paymentType !== '' && (
                            <>
                              <li className="flex items-center justify-between">
                                <span className="text-muted-foreground">Amount to be charged on {paymentType}</span>
                                <payment.Form method="post" ref={formRef} >
                                  <input type='hidden' name='accOrderId' value={order.id} />
                                  <input type='hidden' name='paymentType' value={paymentType} />
                                  <input type='hidden' name='remaining' value={remaining} />
                                  <input type='hidden' name='intent' value='createPayment' />
                                  <input type='hidden' name='total' value={total} />
                                  <div className="relative ml-auto flex-1 md:grow-0 ">
                                    <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                      name='amountPaid'
                                      className='text-right pr-9'
                                      value={input}
                                      onChange={(event) => setInput(event.target.value)}
                                    />
                                    <Button
                                      type="submit"
                                      size="icon"
                                      onClick={() => {
                                        toast.success(`Payment rendered!`)
                                      }}
                                      disabled={inputLength === 0}
                                      className='bg-primary mr-2 absolute right-2.5 top-2.5 h-4 w-4 text-foreground '>
                                      <PaperPlaneIcon className="h-4 w-4" />
                                      <span className="sr-only">Cash</span>
                                    </Button>
                                  </div>
                                </payment.Form>
                              </li>
                            </>
                          )}

                        </ul>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-row items-center border-t border-border bg-muted/50 px-6 py-3">
                    <div className="text-xs text-muted-foreground flex items-center justify-between">
                      <div>
                        <Badge size='sm' className='text-foreground text-center mx-auto w-auto'>
                          {salesPerson.name}
                        </Badge>
                      </div>

                      <ClientOnly fallback={<p>Fallback component ...</p>}>
                        {() => (
                          <React.Suspense fallback={<div>Loading...</div>}>
                            <Button
                              variant='outline'
                              className='bg-background text-foreground border-border border ml-3'
                              onClick={() => {
                                console.log(toReceipt)
                                PrintReceipt(toReceipt)
                              }}>
                              Print Receipt
                            </Button>
                          </React.Suspense>
                        )}
                      </ClientOnly>

                    </div>
                  </CardFooter>
                </Card>
              </div >
            ))}
          </div>
        )}


      </CardContent>
      <CardFooter className="flex flex-row items-center border-t border-border   bg-muted/50  px-6 py-3">
        <div>
        </div>
      </CardFooter>
    </Card>
  )
}
function WorkOrders({ finance }) {
  return (
    <Card className="overflow-hidden rounded-lg text-foreground" x-chunk="dashboard-05-chunk-4"  >
      <CardHeader className="flex flex-row items-start  bg-muted/50 ">
        <CardTitle className="group flex items-center gap-2 text-lg">
          Client Info
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow !grow overflow-y-auto overflow-x-clip bg-background p-6 text-sm">
        {WorkOrder && WorkOrder.length > 0 && (
          <div className="mb-4">
            <h3 className="text-xl font-semibold">Work Orders</h3>
            <ul>
              {WorkOrder.map((workOrder) => (
                <li key={workOrder.id} className="mb-2 p-2 border rounded">
                  <p><strong>ID:</strong> {workOrder.id}</p>
                  <p><strong>Title:</strong> {workOrder.title}</p>
                  <p><strong>Status:</strong> {workOrder.status}</p>
                  {/* Add other WorkOrder fields as needed */}
                </li>
              ))}
            </ul>
          </div>
        )}

      </CardContent>
      <CardFooter className="flex flex-row items-center border-t border-border   bg-muted/50  px-6 py-3">
        <div>
        </div>
      </CardFooter>
    </Card>
  )
}
function AccOrders({ finance }) {
  return (
    <Card className="overflow-hidden rounded-lg text-foreground" x-chunk="dashboard-05-chunk-4"  >
      <CardHeader className="flex flex-row items-start  bg-muted/50 ">
        <CardTitle className="group flex items-center gap-2 text-lg">
          Client Info
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow !grow overflow-y-auto overflow-x-clip bg-background p-6 text-sm">
        {/* AccOrder Data */}
        {AccOrder && AccOrder.length > 0 && (
          <div className="mb-4">
            <h3 className="text-xl font-semibold">Accessory Orders</h3>
            <ul>
              {AccOrder.map((order) => (
                <li key={order.id} className="mb-2 p-2 border rounded">
                  <p><strong>ID:</strong> {order.id}</p>
                  <p><strong>Description:</strong> {order.description}</p>
                  {/* Add other AccOrder fields as needed */}
                </li>
              ))}
            </ul>
          </div>
        )}

      </CardContent>
      <CardFooter className="flex flex-row items-center border-t border-border   bg-muted/50  px-6 py-3">
        <div>
        </div>
      </CardFooter>
    </Card>
  )
}

function CustomerBikes({ finance, fetcher }) {
  let customerCard = [
    { name: "paintPrem", value: data.paintPrem, label: "billingAddress", },
    { name: "licensing", value: data.licensing, label: "billingAddress", },
    { name: "stockNum", value: data.stockNum, label: "billingAddress", },
    { name: "options", value: data.options, label: "billingAddress", },
    { name: "accessories", value: data.accessories, label: "billingAddress", },
    { name: "freight", value: data.freight, label: "billingAddress", },
    { name: "labour", value: data.labour, label: "billingAddress", },
    { name: "year", value: data.year, label: "billingAddress", },
    { name: "brand", value: data.brand, label: "billingAddress", },
    { name: "mileage", value: data.mileage, label: "billingAddress", },
    { name: "model", value: data.model, label: "billingAddress", },
    { name: "model1", value: data.model1, label: "billingAddress", },
    { name: "color", value: data.color, label: "billingAddress", },
    { name: "modelCode", value: data.modelCode, label: "billingAddress", },
    { name: "msrp", value: data.msrp, label: "billingAddress", },
    { name: "trim", value: data.trim, label: "billingAddress", },
    { name: "vin", value: data.vin, label: "billingAddress", },
    { name: "bikeStatus", value: data.bikeStatus, label: "billingAddress", },
    { name: "invId", value: data.invId, label: "billingAddress", },
    { name: "location", value: data.location, label: "billingAddress", },
    { name: "id", value: data.id, label: "billingAddress", },
    { name: "createdAt", value: data.createdAt, label: "billingAddress", },
    { name: "updatedAt", value: data.updatedAt, label: "billingAddress", },
    { name: "financeId", value: data.financeId, label: "billingAddress", },
  ];
  return (
    <Card
      className="overflow-hidden rounded-lg text-foreground"
      x-chunk="dashboard-05-chunk-4"
    >
      <Form method='post'>

        <CardHeader className="flex flex-row items-start  bg-muted/50 ">
          <div className="grid gap-0.5">
            <CardTitle className="group flex items-center gap-2 text-lg">
              Client Bikes Bought From Dealer
              <Button
                size="icon"
                variant="outline"
                className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <Copy className="h-3 w-3" />
                <span className="sr-only">

                </span>
              </Button>
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex-grow !grow overflow-y-auto overflow-x-clip bg-background p-6 text-sm">
          <div className="grid h-auto  max-h-[65vh] grid-cols-2 gap-3 mt-5">


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
            <div className="relative mt-5  ">
              <Select
                onValueChange={(value) => {
                  const formData = new FormData();
                  formData.append("id", data.id);
                  formData.append("typeOfContact", value);
                  formData.append("intent", 'typeOfContact');
                  console.log(formData, 'formData');
                  fetcher.submit(formData, { method: "post" });
                }}
                defaultValue={data.typeOfContact}
                name='typeOfContact'>
                <SelectTrigger className="w-full focus:border-primary">
                  <SelectValue placeholder='Type Of Contact' />
                </SelectTrigger>
                <SelectContent className=' bg-background text-foreground border border-border' >
                  <SelectGroup>
                    <SelectLabel>Contact Method</SelectLabel>
                    <SelectItem value="Phone">Phone</SelectItem>
                    <SelectItem value="InPerson">In-Person</SelectItem>
                    <SelectItem value="SMS">SMS</SelectItem>
                    <SelectItem value="Email">Email</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <label className=" absolute -top-3 left-3  rounded-full bg-background px-2 text-sm transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">
                Type Of Contact
              </label>
            </div>
            <div className="relative mt-5  ">
              <Select
                onValueChange={(value) => {
                  const formData = new FormData();
                  formData.append("id", data.id);
                  formData.append("timeToContact", value);
                  formData.append("intent", 'timeToContact');
                  console.log(formData, 'formData');
                  fetcher.submit(formData, { method: "post" });
                }}
                defaultValue={data.timeToContact}
                name='timeToContact'>
                <SelectTrigger className="w-full focus:border-primary">
                  <SelectValue placeholder='Time To Contact' />
                </SelectTrigger>
                <SelectContent className=' bg-background text-foreground border border-border' >
                  <SelectGroup>
                    <SelectLabel>Best Time To Contact</SelectLabel>
                    <SelectItem value="Morning">Morning</SelectItem>
                    <SelectItem value="Afternoon">Afternoon</SelectItem>
                    <SelectItem value="Evening">Evening</SelectItem>
                    <SelectItem value="Do Not Contact">Do Not Contact</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <label className=" absolute -top-3 left-3  rounded-full bg-background px-2 text-sm transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">
                Time To Contact
              </label>
            </div>
            <input type='hidden' name='id' value={data.id} />

          </div>

        </CardContent>
        <CardFooter className="flex flex-row items-center border-t border-border   bg-muted/50  px-6 py-3">
          <div>
            <Button type='submit' name='intent' value='updateClient' size='sm' >Save</Button>
          </div>
        </CardFooter>

      </Form>

    </Card>
  )
}
function ServiceUnit({ finance, fetcher }) {
  let customerCard = [

    { name: "id", value: data.id, label: "billingAddress", },
    { name: "createdAt", value: data.createdAt, label: "billingAddress", },
    { name: "updatedAt", value: data.updatedAt, label: "billingAddress", },
    { name: "price", value: data.price, label: "billingAddress", },
    { name: "brand", value: data.brand, label: "billingAddress", },
    { name: "model", value: data.model, label: "billingAddress", },
    { name: "color", value: data.color, label: "billingAddress", },
    { name: "accessories", value: data.accessories, label: "billingAddress", },
    { name: "options", value: data.options, label: "billingAddress", },
    { name: "year", value: data.year, label: "billingAddress", },
    { name: "vin", value: data.vin, label: "billingAddress", },
    { name: "trim", value: data.trim, label: "billingAddress", },
    { name: "mileage", value: data.mileage, label: "billingAddress", },
    { name: "location", value: data.location, label: "billingAddress", },
    { name: "condition", value: data.condition, label: "billingAddress", },
    { name: "repairs", value: data.repairs, label: "billingAddress", },
    { name: "stockNum", value: data.stockNum, label: "billingAddress", },
    { name: "motor", value: data.motor, label: "billingAddress", },
    { name: "tag", value: data.tag, label: "billingAddress", },
    { name: "licensing", value: data.licensing, label: "billingAddress", },
    { name: "tradeEval", value: data.tradeEval, label: "billingAddress", },
    { name: "clientfileId", value: data.clientfileId, label: "billingAddress", },
  ];
  return (
    <Card
      className="overflow-hidden rounded-lg text-foreground"
      x-chunk="dashboard-05-chunk-4"
    >
      <Form method='post'>

        <CardHeader className="flex flex-row items-start  bg-muted/50 ">
          <div className="grid gap-0.5">
            <CardTitle className="group flex items-center gap-2 text-lg">
              Client Bikes Bought Else Where

            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex-grow !grow overflow-y-auto overflow-x-clip bg-background p-6 text-sm">
          <div className="grid h-auto  max-h-[65vh] grid-cols-2 gap-3 mt-5">


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
            <div className="relative mt-5  ">
              <Select
                onValueChange={(value) => {
                  const formData = new FormData();
                  formData.append("id", data.id);
                  formData.append("typeOfContact", value);
                  formData.append("intent", 'typeOfContact');
                  console.log(formData, 'formData');
                  fetcher.submit(formData, { method: "post" });
                }}
                defaultValue={data.typeOfContact}
                name='typeOfContact'>
                <SelectTrigger className="w-full focus:border-primary">
                  <SelectValue placeholder='Type Of Contact' />
                </SelectTrigger>
                <SelectContent className=' bg-background text-foreground border border-border' >
                  <SelectGroup>
                    <SelectLabel>Contact Method</SelectLabel>
                    <SelectItem value="Phone">Phone</SelectItem>
                    <SelectItem value="InPerson">In-Person</SelectItem>
                    <SelectItem value="SMS">SMS</SelectItem>
                    <SelectItem value="Email">Email</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <label className=" absolute -top-3 left-3  rounded-full bg-background px-2 text-sm transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">
                Type Of Contact
              </label>
            </div>
            <div className="relative mt-5  ">
              <Select
                onValueChange={(value) => {
                  const formData = new FormData();
                  formData.append("id", data.id);
                  formData.append("timeToContact", value);
                  formData.append("intent", 'timeToContact');
                  console.log(formData, 'formData');
                  fetcher.submit(formData, { method: "post" });
                }}
                defaultValue={data.timeToContact}
                name='timeToContact'>
                <SelectTrigger className="w-full focus:border-primary">
                  <SelectValue placeholder='Time To Contact' />
                </SelectTrigger>
                <SelectContent className=' bg-background text-foreground border border-border' >
                  <SelectGroup>
                    <SelectLabel>Best Time To Contact</SelectLabel>
                    <SelectItem value="Morning">Morning</SelectItem>
                    <SelectItem value="Afternoon">Afternoon</SelectItem>
                    <SelectItem value="Evening">Evening</SelectItem>
                    <SelectItem value="Do Not Contact">Do Not Contact</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <label className=" absolute -top-3 left-3  rounded-full bg-background px-2 text-sm transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">
                Time To Contact
              </label>
            </div>
            <input type='hidden' name='id' value={data.id} />

          </div>

        </CardContent>
        <CardFooter className="flex flex-row items-center border-t border-border   bg-muted/50  px-6 py-3">
          <div>
            <Button type='submit' name='intent' value='updateClient' size='sm' >Save</Button>
          </div>
        </CardFooter>

      </Form>

    </Card>
  )
}
function FinanceTradeUnit({ finance, fetcher }) {
  let customerCard = [

    { name: "id", value: data.id, label: "billingAddress", },
    { name: "createdAt", value: data.createdAt, label: "billingAddress", },
    { name: "updatedAt", value: data.updatedAt, label: "billingAddress", },
    { name: "financeId", value: data.financeId, label: "billingAddress", },
    { name: "price", value: data.price, label: "billingAddress", },
    { name: "brand", value: data.brand, label: "billingAddress", },
    { name: "model", value: data.model, label: "billingAddress", },
    { name: "color", value: data.color, label: "billingAddress", },
    { name: "accessories", value: data.accessories, label: "billingAddress", },
    { name: "options", value: data.options, label: "billingAddress", },
    { name: "year", value: data.year, label: "billingAddress", },
    { name: "vin", value: data.vin, label: "billingAddress", },
    { name: "trim", value: data.trim, label: "billingAddress", },
    { name: "mileage", value: data.mileage, label: "billingAddress", },
    { name: "location", value: data.location, label: "billingAddress", },
    { name: "condition", value: data.condition, label: "billingAddress", },
    { name: "repairs", value: data.repairs, label: "billingAddress", },
    { name: "stockNum", value: data.stockNum, label: "billingAddress", },
    { name: "licensing", value: data.licensing, label: "billingAddress", },
    { name: "tradeEval", value: data.tradeEval, label: "billingAddress", },
  ];
  return (
    <Card
      className="overflow-hidden rounded-lg text-foreground"
      x-chunk="dashboard-05-chunk-4"
    >
      <Form method='post'>

        <CardHeader className="flex flex-row items-start  bg-muted/50 ">
          <div className="grid gap-0.5">
            <CardTitle className="group flex items-center gap-2 text-lg">
              Client Bikes Bought Else Where

            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex-grow !grow overflow-y-auto overflow-x-clip bg-background p-6 text-sm">
          <div className="grid h-auto  max-h-[65vh] grid-cols-2 gap-3 mt-5">


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
            <div className="relative mt-5  ">
              <Select
                onValueChange={(value) => {
                  const formData = new FormData();
                  formData.append("id", data.id);
                  formData.append("typeOfContact", value);
                  formData.append("intent", 'typeOfContact');
                  console.log(formData, 'formData');
                  fetcher.submit(formData, { method: "post" });
                }}
                defaultValue={data.typeOfContact}
                name='typeOfContact'>
                <SelectTrigger className="w-full focus:border-primary">
                  <SelectValue placeholder='Type Of Contact' />
                </SelectTrigger>
                <SelectContent className=' bg-background text-foreground border border-border' >
                  <SelectGroup>
                    <SelectLabel>Contact Method</SelectLabel>
                    <SelectItem value="Phone">Phone</SelectItem>
                    <SelectItem value="InPerson">In-Person</SelectItem>
                    <SelectItem value="SMS">SMS</SelectItem>
                    <SelectItem value="Email">Email</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <label className=" absolute -top-3 left-3  rounded-full bg-background px-2 text-sm transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">
                Type Of Contact
              </label>
            </div>
            <div className="relative mt-5  ">
              <Select
                onValueChange={(value) => {
                  const formData = new FormData();
                  formData.append("id", data.id);
                  formData.append("timeToContact", value);
                  formData.append("intent", 'timeToContact');
                  console.log(formData, 'formData');
                  fetcher.submit(formData, { method: "post" });
                }}
                defaultValue={data.timeToContact}
                name='timeToContact'>
                <SelectTrigger className="w-full focus:border-primary">
                  <SelectValue placeholder='Time To Contact' />
                </SelectTrigger>
                <SelectContent className=' bg-background text-foreground border border-border' >
                  <SelectGroup>
                    <SelectLabel>Best Time To Contact</SelectLabel>
                    <SelectItem value="Morning">Morning</SelectItem>
                    <SelectItem value="Afternoon">Afternoon</SelectItem>
                    <SelectItem value="Evening">Evening</SelectItem>
                    <SelectItem value="Do Not Contact">Do Not Contact</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <label className=" absolute -top-3 left-3  rounded-full bg-background px-2 text-sm transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">
                Time To Contact
              </label>
            </div>
            <input type='hidden' name='id' value={data.id} />

          </div>

        </CardContent>
        <CardFooter className="flex flex-row items-center border-t border-border   bg-muted/50  px-6 py-3">
          <div>
            <Button type='submit' name='intent' value='updateClient' size='sm' >Save</Button>
          </div>
        </CardFooter>

      </Form>

    </Card>
  )
}
function PaymentsFinance({ finance, fetcher, data }) {
  let customerCard = [

    { name: "id", value: data.id, label: "billingAddress", },
    { name: "createdAt", value: data.createdAt, label: "billingAddress", },
    { name: "updatedAt", value: data.updatedAt, label: "billingAddress", },
    { name: "financeId", value: data.financeId, label: "billingAddress", },
    { name: "price", value: data.price, label: "billingAddress", },
    { name: "brand", value: data.brand, label: "billingAddress", },
    { name: "model", value: data.model, label: "billingAddress", },
    { name: "color", value: data.color, label: "billingAddress", },
    { name: "accessories", value: data.accessories, label: "billingAddress", },
    { name: "options", value: data.options, label: "billingAddress", },
    { name: "year", value: data.year, label: "billingAddress", },
    { name: "vin", value: data.vin, label: "billingAddress", },
    { name: "trim", value: data.trim, label: "billingAddress", },
    { name: "mileage", value: data.mileage, label: "billingAddress", },
    { name: "location", value: data.location, label: "billingAddress", },
    { name: "condition", value: data.condition, label: "billingAddress", },
    { name: "repairs", value: data.repairs, label: "billingAddress", },
    { name: "stockNum", value: data.stockNum, label: "billingAddress", },
    { name: "licensing", value: data.licensing, label: "billingAddress", },
    { name: "tradeEval", value: data.tradeEval, label: "billingAddress", },
  ];
  const [open, setOpen] = useState(false)

  return (
    <Card className="overflow-hidden text-foreground rounded-lg" x-chunk="dashboard-05-chunk-4"                >
      <CardHeader className="flex flex-row items-start  bg-muted/50 ">
        <div className="grid gap-0.5">
          <CardTitle className="group flex items-center gap-2 text-lg">
            Deposits
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-grow !grow  overflow-x-clip p-6 text-sm bg-background">
        <div>
          <ul className="grid gap-3">
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>${financeSubTotal}</span>
            </li>
            {finance.discount !== 0 && (
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Discount</span>
                <span>{finance.discount}</span>
              </li>
            )}
            {finance.discount !== 0 && (
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Discount</span>
                <span>{finance.discount}</span>
              </li>
            )}
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Tax</span>
              <span>{deFees.userTax}%</span>
            </li>
            <li className="flex items-center justify-between font-semibold">
              <span className="text-muted-foreground">Total</span>
              <span>${financeTotal}</span>
            </li>
          </ul>
        </div>
        <Separator className="my-4" />
        <div className="grid gap-3">
          <div className="font-semibold">Payment</div>
          <dl className="grid gap-3">

            <div className="flex flex-col" >
              <div className='flex items-center justify-center text-foreground'>
                <Button
                  size="sm"
                  variant="outline"
                  className={cn('mr-2 bg-primary', paymentType === 'Visa' ? "bg-secondary" : "", "")}
                  onClick={() => setPaymentType('Visa')}
                >
                  <CreditCard className="h-4 w-4 text-foreground" />
                  <p className="">Visa</p>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className={cn('mr-2 bg-primary', paymentType === 'Mastercard' ? "bg-secondary" : "", "")}
                  onClick={() => setPaymentType('Mastercard')}
                >
                  <CreditCard className="h-4 w-4 text-foreground" />
                  <p className="">Mastercard</p>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setPaymentType('Debit')}
                  className={cn(' bg-primary mr-2', paymentType === 'Debit' ? "bg-secondary" : "", "")}
                >
                  <CreditCard className="h-4 w-4 text-foreground" />
                  <p className="">Debit</p>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setPaymentType('Cheque')}
                  className={cn(' bg-primary', paymentType === 'Cheque' ? "bg-secondary" : "", "")}
                >
                  <CreditCard className="h-4 w-4 text-foreground" />
                  <p className="">Cheque</p>
                </Button>
              </div>
              <div className='flex items-center justify-center text-foreground mt-2'>
                <Button
                  size="sm"
                  variant="outline"
                  className={cn('mr-2 bg-primary', paymentType === 'Cash' ? "bg-secondary" : "", "")}
                  onClick={() => setPaymentType('Cash')}
                >
                  <BanknoteIcon className="h-4 w-4 text-foreground" />
                  <p className="">Cash</p>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className={cn(' bg-primary mr-2', paymentType === 'Online Transaction' ? "bg-secondary" : "", "")}
                  onClick={() => setPaymentType('Online Transaction')}
                >
                  <PanelTop className="h-4 w-4 text-foreground" />
                  <p className="">Online Transaction</p>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className={cn(' bg-primary', paymentType === 'E-Transfer' ? "bg-secondary" : "", "")}
                  onClick={() => setPaymentType('E-Transfer')}
                >
                  <PanelTop className="h-4 w-4 text-foreground" />
                  <p className="">E-Transfer</p>
                </Button>
              </div>
            </div>
          </dl>
        </div>
        <div className="grid gap-3">
          <ul className="grid gap-3 mt-3">
            {finance.Payments && finance.Payments.map((result, index) => (
              <li className="flex items-center justify-between" key={index}                    >
                <span className="text-muted-foreground">{result.paymentType}</span>
                <span>${result.amountPaid}</span>
              </li>
            ))}
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Balance </span>
              <span>${Number(financeTotal).toFixed(2) - Number(totalAmountPaidFinance).toFixed(2)}</span>

            </li>
            {parseFloat(total) - parseFloat(totalAmountPaid) === 0 && (
              <input type='hidden' name='status' value='Fulfilled' />
            )}


          </ul>
          {paymentType !== '' && (
            <div className='mx-auto'>
              <fetcher.Form ref={formRef} method="post" className="flex w-full items-center space-x-2 mt-3 mx-auto" >
                <input type='hidden' name='financeId' defaultValue={finance.id} />
                <input type='hidden' name='userEmail' defaultValue={user.email} />
                <input type='hidden' name='paymentType' value={paymentType} />
                <div className="relative mt-4">
                  <Input
                    name='cardNum'
                    className=''

                  />
                  <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">Card #</label>
                </div>


                <div className="relative mt-4">
                  <Input
                    name='receiptId'
                    className=' '
                  />
                  <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">Receipt Number</label>
                </div>


                <div className="relative ml-auto flex-1 md:grow-0 mt-4 ">
                  <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    name='amountPaid'
                    className='text-right pr-9 w-[150px] '
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                  />

                  <Button
                    value="createFinancePayment"
                    type="submit"
                    name="intent"
                    size="icon"
                    onClick={() => {
                      toast.success(`Payment rendered!`)
                    }}
                    disabled={inputLength === 0}
                    className='bg-primary mr-2 absolute right-2.5 top-2.5 h-4 w-4 text-foreground '>
                    <PaperPlaneIcon className="h-4 w-4" />
                    <span className="sr-only">Cash</span>
                  </Button>
                </div>
              </fetcher.Form>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-row items-center border-t border-border  bg-muted/50  px-6 py-3">
        <p className='text-muted-foreground'> {finance.updatedAt}</p>
      </CardFooter>
    </Card>
  )
}
function FinanceNotes({ finance, fetcher, input, user, formRef, setInput, inputLength }) {
  const [open, setOpen] = useState(false)
  return (
    <Card className="overflow-hidden text-foreground rounded-lg" x-chunk="dashboard-05-chunk-4"                >
      <CardHeader className="flex flex-row items-start  bg-muted/50 ">
        <div className="grid gap-0.5">
          <CardTitle className="group flex items-center gap-2 text-lg">
            Notes
            <Button
              size="icon"
              variant="outline"
              className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
            >
              <Copy className="h-3 w-3" />
              <span className="sr-only">To leave yourself or your colleagues notes regarding the customer.</span>
            </Button>
          </CardTitle>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="outline"
                  className="ml-auto rounded-full"
                  onClick={() => setOpen(true)}
                >
                  <PlusIcon className="h-4 w-4" />
                  <span className="sr-only">CC Employee</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent sideOffset={10} className='bg-primary'>CC Employee</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent className="flex-grow !grow  overflow-x-clip p-6 text-sm bg-background">
        <div className="grid gap-3 ">
          <Card className=" flex flex-col-reverse  max-h-[50vh] h-auto overflow-y-auto">
            <CardContent>
              <div className="space-y-4 mt-5">

                {financeNotes.slice().reverse().map((message, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                      message.userEmail === user.email
                        ? "ml-auto bg-primary text-foreground"
                        : "bg-[#262626]"
                    )}
                  >
                    <div className='grid grid-cols-1'>
                      {message.userEmail !== user.email && (
                        <p className='text-[#8c8c8c]'>
                          {message.userName}
                        </p>
                      )}
                      {message.body}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>

          </Card>

        </div>
      </CardContent>
      <CardFooter className="flex flex-row items-center border-t border-border  bg-muted/50  px-6 py-3">

        <fetcher.Form ref={formRef} method="post" className="flex w-full items-center space-x-2" >
          <input type='hidden' name='financeId' defaultValue={finance.id} />
          <input type='hidden' name='userEmail' defaultValue={user.email} />
          <input type='hidden' name='clientfileId' defaultValue={finance.clientfileId} />
          <input type='hidden' name='userName' defaultValue={user.name} />
          <Input
            id="message"
            placeholder="Type your message..."
            className="flex-1  bg-muted/50  border-border"
            autoComplete="off"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            name="body"
          />
          <Button
            value="saveFinanceNote"
            type="submit"
            name="intent"
            size="icon"
            onClick={() => {
              toast.success(`Note saved`)
            }}
            disabled={inputLength === 0}
            className='bg-primary '>
            <PaperPlaneIcon className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>

        </fetcher.Form>
      </CardFooter>
    </Card>
  )
}
function FinanceProducts({ finance }) {
  return (
    <Card className="overflow-hidden rounded-lg text-foreground" x-chunk="dashboard-05-chunk-4"  >
      <CardHeader className="flex flex-row items-start  bg-muted/50 ">
        <CardTitle className="group flex items-center gap-2 text-lg">
          Client Info
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow !grow overflow-y-auto overflow-x-clip bg-background p-6 text-sm">


      </CardContent>
      <CardFooter className="flex flex-row items-center border-t border-border   bg-muted/50  px-6 py-3">
        <div>
        </div>
      </CardFooter>
    </Card>
  )
}

function Blank({ finance }) {
  return (
    <Card className="overflow-hidden rounded-lg text-foreground" x-chunk="dashboard-05-chunk-4"  >
      <CardHeader className="flex flex-row items-start  bg-muted/50 ">
        <CardTitle className="group flex items-center gap-2 text-lg">
          Client Info
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow !grow overflow-y-auto overflow-x-clip bg-background p-6 text-sm">


      </CardContent>
      <CardFooter className="flex flex-row items-center border-t border-border   bg-muted/50  px-6 py-3">
        <div>
        </div>
      </CardFooter>
    </Card>
  )
}
