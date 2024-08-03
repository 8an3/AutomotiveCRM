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

export default function UnitDialog({ data }) {
  let sortedEvents = [];

  let customerCard = [
    {
      name: "packageNumber",
      value: data.packageNumber,
      label: "Package Number",
    },
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
    {
      name: "exteriorColor",
      value: data.exteriorColor,
      label: "Exterior Color",
    },
    { name: "mileage", value: data.mileage, label: "Mileage" },
    { name: "expectedOn", value: data.expectedOn, label: "Expected On" },
    { name: "status", value: data.status, label: "Status" },
    { name: "orderStatus", value: data.orderStatus, label: "Order Status" },
    { name: "vin", value: data.vin, label: "VIN" },
    { name: "age", value: data.age, label: "Age" },
    { name: "location", value: data.location, label: "Location" },
    { name: "hdcFONumber", value: data.hdcFONumber, label: "hdcFO Number" },
    { name: "hdmcFONumber", value: data.hdmcFONumber, label: "hdmcFO Number" },
  ];
  let customerCard2 = [
    {
      name: "floorPlanDueDate",
      value: data.floorPlanDueDate,
      label: "FloorPlanDueDate",
    },
    { name: "stockedDate", value: data.stockedDate, label: "Stocked Date" },
    { name: "actualCost", value: data.actualCost, label: "Actual Cost" },
    {
      name: "mfgSerialNumber",
      value: data.mfgSerialNumber,
      label: "mfg Serial Number",
    },
    { name: "engineNumber", value: data.engineNumber, label: "Engine Number" },
    { name: "plates", value: data.plates, label: "Plates" },
    { name: "keyNumber", value: data.keyNumber, label: "Key Number" },
    { name: "length", value: data.length, label: "Length" },
    { name: "width", value: data.width, label: "Width" },
    { name: "engine", value: data.engine, label: "Engine" },
    { name: "fuelType", value: data.fuelType, label: "Fuel Type" },
    { name: "power", value: data.power, label: "Power" },
    {
      name: "chassisNumber",
      value: data.chassisNumber,
      label: "Chassis Number",
    },
    { name: "chassisYear", value: data.chassisYear, label: "Chassis Year" },
    { name: "chassisMake", value: data.chassisMake, label: "Chassis Make" },
    { name: "chassisModel", value: data.chassisModel, label: "Chassis Model" },
    { name: "chassisType", value: data.chassisType, label: "Chassis Type" },
    {
      name: "registrationState",
      value: data.registrationState,
      label: "Registration State",
    },
    {
      name: "registrationExpiry",
      value: data.registrationExpiry,
      label: "Registration Expiry",
    },
    { name: "grossWeight", value: data.grossWeight, label: "Gross Weight" },
    { name: "netWeight", value: data.netWeight, label: "Net Weight" },
    {
      name: "insuranceCompany",
      value: data.insuranceCompany,
      label: "Insurance Company",
    },
    { name: "policyNumber", value: data.policyNumber, label: "Policy Number" },
    {
      name: "insuranceAgent",
      value: data.insuranceAgent,
      label: "Insurance Agent",
    },
    {
      name: "insuranceStartDate",
      value: data.insuranceStartDate,
      label: "Iinsurance Start Date",
    },
    {
      name: "insuranceEndDate",
      value: data.insuranceEndDate,
      label: "Insurance End Date",
    },
    { name: "sold", value: data.sold, label: "Sold" },
  ];
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Unit File</Button>
      </DialogTrigger>
      <DialogContent className="w-auto max-w-[95%] border border-border md:max-w-[90%]">
        <DialogHeader>
          <DialogTitle>Unit File</DialogTitle>
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
          <div className="grid gap-4 md:gap-8 lg:col-span-2 ">
            <Tabs defaultValue="Unit" className="w-full">
              <TabsList>
                <TabsTrigger value="Unit">Unit</TabsTrigger>
                <TabsTrigger value="Customer">Customer</TabsTrigger>
                <TabsTrigger value="Work Orders">Work Orders</TabsTrigger>
              </TabsList>
              <TabsContent value="Unit">
                <div className="grid items-start gap-4 md:gap-8 lg:col-span-1">
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
                        <div className="mb-5">
                          <div className="grid grid-cols-2 justify-between">
                            <div  className="relative mt-5 w-[40%]">
                              <Select name="stocked"  defaultValue={data.stocked}>
                                <SelectTrigger className="w-[180px]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectLabel>Stocked</SelectLabel>
                                    <SelectItem value={true}>True</SelectItem>
                                    <SelectItem value={false}>False</SelectItem>
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                              <label className=" absolute -top-3 left-3  rounded-full bg-background px-2 text-sm transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">
                                Stocked
                              </label>
                            </div>
                             <div  className="relative mt-5 w-[40%]">
                              <Select name="onOrder" defaultValue={data.onOrder}>
                                <SelectTrigger className="w-[180px]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectLabel>Ordered</SelectLabel>
                                    <SelectItem value={true}>True</SelectItem>
                                    <SelectItem value={false}>False</SelectItem>
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                              <label className=" absolute -top-3 left-3  rounded-full bg-background px-2 text-sm transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">
                              On Order
                              </label>
                            </div>
                             <div  className="relative mt-5 w-[40%]">
                              <Select name="isNew" defaultValue={data.isNew}>
                                <SelectTrigger className="w-[180px]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectLabel>Is New</SelectLabel>
                                    <SelectItem value={true}>True</SelectItem>
                                    <SelectItem value={false}>False</SelectItem>
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                              <label className=" absolute -top-3 left-3  rounded-full bg-background px-2 text-sm transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">
                                Is New
                              </label>
                            </div>
                             <div  className="relative mt-5 w-[40%]">
                              <Select name="consignment" defaultValue={data.consignment}>
                                <SelectTrigger className="w-[180px]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectLabel>Consignment</SelectLabel>
                                    <SelectItem value={true}>True</SelectItem>
                                    <SelectItem value={false}>False</SelectItem>
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                              <label className=" absolute -top-3 left-3  rounded-full bg-background px-2 text-sm transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">
                                Consignment
                              </label>
                            </div>

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
                        </div>
                        <div className="mb-5">
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
                        </div>
                        <input type='hidden' name='id' value={data.id} />
                        <Button type='submit' name='intent' value='updateUnit' >Save</Button>
                      </div>

                      </Form>
                    </CardContent>
                    <CardFooter className="flex flex-row items-center border-t border-border   bg-muted/50  px-6 py-3">
                      <div className="text-xs text-muted-foreground">
                        Updated{" "}
                        <time dateTime="2023-11-23">November 23, 2023</time>
                      </div>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="Customer"></TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
