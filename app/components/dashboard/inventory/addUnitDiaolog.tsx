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
} from "@remix-run/react";
import { ButtonLoading } from "~/components/ui/button-loading";
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
} from "lucide-react";
import { format } from "date-fns"
import { Calendar as SmallCalendar } from '~/components/ui/calendar';
import { cn } from "~/components/ui/utils";

import { CalendarIcon } from "lucide-react";
import { useState } from "react";

export default function AddUnitDialog() {
  let sortedEvents = [];

  let customerCard = [
    { name: "packageNumber", label: "Package Number", },
    { name: "packagePrice", label: "Package Price" },
    { name: "stockNumber", label: "Stock Number" },
    { name: "type", label: "Type" },
    { name: "class", label: "Class" },
    { name: "year", label: "Year" },
    { name: "make", label: "Make" },
    { name: "model", label: "Model" },
    { name: "modelName", label: "Model Name" },
    { name: "submodel", label: "Sub Model" },
    { name: "subSubmodel", label: "Sub Sub Model" },
    { name: "price", label: "Price" },
    { name: "exteriorColor", label: "Exterior Color", },
    { name: "mileage", label: "Mileage" },
    { name: "vin", label: "VIN" },
    { name: "age", label: "Age" },
    { name: "location", label: "Location" },
    { name: "hdcFONumber", label: "hdcFO Number" },
    { name: "hdmcFONumber", label: "hdmcFO Number" },
  ];
  let customerCard2 = [
    { name: "floorPlanDueDate", label: "FloorPlanDueDate", },
    { name: "stockedDate", label: "Stocked Date" },
    { name: "actualCost", label: "Actual Cost" },
    { name: "mfgSerialNumber", label: "mfg Serial Number", },
    { name: "engineNumber", label: "Engine Number" },
    { name: "plates", label: "Plates" },
    { name: "keyNumber", label: "Key Number" },
    { name: "length", label: "Length" },
    { name: "width", label: "Width" },
    { name: "engine", label: "Engine" },
    { name: "fuelType", label: "Fuel Type" },
    { name: "power", label: "Power" },
    { name: "chassisNumber", label: "Chassis Number", },
    { name: "chassisYear", label: "Chassis Year" },
    { name: "chassisMake", label: "Chassis Make" },
    { name: "chassisModel", label: "Chassis Model" },
    { name: "chassisType", label: "Chassis Type" },
    { name: "registrationState", label: "Registration State", },
    { name: "registrationExpiry", label: "Registration Expiry", },
    { name: "grossWeight", label: "Gross Weight" },
    { name: "netWeight", label: "Net Weight" },
    { name: "insuranceCompany", label: "Insurance Company", },
    { name: "policyNumber", label: "Policy Number" },
    { name: "insuranceAgent", label: "Insurance Agent", },
    { name: "insuranceStartDate", label: "Iinsurance Start Date", },
    { name: "insuranceEndDate", label: "Insurance End Date", },
  ];
  const [date, setDate] = useState<Date>()
  const newDate = new Date()
  const loggedDate = new Date()

  const [datefloorPlanDueDate, setDatefloorPlanDueDate] = useState<Date>()
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size='sm'>Add Unit</Button>
      </DialogTrigger>
      <DialogContent className="w-auto max-w-[95%] border border-border md:max-w-[90%]">
        <DialogHeader>
          <DialogTitle>Add Unit</DialogTitle>
        </DialogHeader>
        <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 ">
          <Card
            className="overflow-hidden rounded-lg text-foreground"
            x-chunk="dashboard-05-chunk-4"
          >
            <CardHeader className="flex flex-row items-start  bg-muted/50 ">
              <div className="grid gap-0.5">
                <CardTitle className="group flex items-center gap-2 text-lg">
                  Unit Info
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
                <div className="grid h-auto  max-h-[65vh] grid-cols-2 gap-3 mt-5">
                  <div className="relative mt-5  ">
                    <Select
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
                        </div>
                      </PopoverContent >
                    </Popover >
                    <label className=" absolute -top-3 left-3  rounded-full bg-background px-2 text-sm transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">
                      Floor Plan Due Date
                    </label>
                  </div>
                  <div className="relative mt-5 ">
                    <Select
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
                        </div>
                      </PopoverContent >
                    </Popover >
                    <label className=" absolute -top-3 left-3  rounded-full bg-background px-2 text-sm transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">
                      Expected On
                    </label>
                  </div>
                  <div className="relative mt-5  ">
                    <Select
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
                        className={` border border-border bg-background text-foreground`}
                      />
                      <label className=" absolute -top-3 left-3  rounded-full bg-background px-2 text-sm transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">
                        {user.label}
                      </label>
                    </div>
                  ))}
                  <div>
                    <Button type='submit' name='intent' value='addUnit' size='sm' >Save</Button>
                  </div>
                </div>

              </Form>
            </CardContent>
            <CardFooter className="flex flex-row items-center border-t border-border   bg-muted/50  px-6 py-3">
              <div className="text-xs text-muted-foreground">
              </div>
            </CardFooter>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
