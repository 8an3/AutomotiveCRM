import type { LoaderArgs, } from "@remix-run/node";
import { Input, Separator, PopoverTrigger, PopoverContent, Popover, TextArea, Button, ScrollArea, Tabs, TabsList, TabsTrigger, TabsContent, Label, Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectLabel, SelectGroup } from "~/components/ui/index";
import * as React from "react"
import { ColumnDef, ColumnFiltersState, FilterFn, SortingState, VisibilityState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, sortingFns, } from "@tanstack/react-table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger, } from "~/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "~/components/ui/table"
import { useEffect, useState } from "react";
import { Form, useLoaderData, useSubmit, useFetcher, useNavigate } from "@remix-run/react";
import { getSession } from "~/sessions/auth-session.server";
import { type MetaFunction, redirect, type LoaderFunctionArgs, json, ActionFunction } from '@remix-run/node'
import { GetUser } from "~/utils/loader.server";
import { fuzzyFilter, fuzzySort, TableMeta, getTableMeta, DebouncedInput } from "~/components/shared/shared";
import { Cross2Icon, CaretSortIcon, ChevronDownIcon, DotsHorizontalIcon, } from "@radix-ui/react-icons";
import IndeterminateCheckbox, { EditableText, Filter } from '~/components/shared/shared'
import { X } from "lucide-react";
import { toast } from "sonner";
import { DataTablePagination } from "~/components/dashboard/calls/pagination";
import financeFormSchema from "~/overviewUtils/financeFormSchema";
import UnitDialog from '~/components/dashboard/inventory/diaolog'
import { CalendarIcon, ClockIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import { Calendar as SmallCalendar } from '~/components/ui/calendar';
import { cn } from "~/components/ui/utils";
import AddUnitDialog from "~/components/dashboard/inventory/addUnitDiaolog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"


import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip"
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
} from "lucide-react"
import {
  type RankingInfo,
  rankItem,
  compareItems,
} from '@tanstack/match-sorter-utils'
import { HelpCircle } from 'lucide-react';
import motoIcon from '~/images/favicons/moto.svg'
import { prisma } from "~/libs";
import StockUnit from '~/components/dashboard/unitPicker/table'
import { Stocked, IsNew, OrderStatus, Status, Sold, OnOrder, Consignment } from '~/routes/__authorized/dealer/sales/inventory'

export const loader = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")
  const user = await GetUser(email)
  if (!user) { redirect('/login') }
  const inventoryMotorcycle = await prisma.inventoryMotorcycle.findMany({
    select: {
      id: true,
      createdAt: true,
      updatedAt: true,
      packageNumber: true,
      packagePrice: true,
      stockNumber: true,
      type: true,
      class: true,
      year: true,
      make: true,
      model: true,
      modelName: true,
      submodel: true,
      subSubmodel: true,
      price: true,
      exteriorColor: true,
      mileage: true,
      consignment: true,
      onOrder: true,
      expectedOn: true,
      status: true,
      orderStatus: true,
      hdcFONumber: true,
      hdmcFONumber: true,
      vin: true,
      age: true,
      floorPlanDueDate: true,
      location: true,
      stocked: true,
      stockedDate: true,
      isNew: true,
      actualCost: true,
      mfgSerialNumber: true,
      engineNumber: true,
      plates: true,
      keyNumber: true,
      length: true,
      width: true,
      engine: true,
      fuelType: true,
      power: true,
      chassisNumber: true,
      chassisYear: true,
      chassisMake: true,
      chassisModel: true,
      chassisType: true,
      registrationState: true,
      registrationExpiry: true,
      grossWeight: true,
      netWeight: true,
      insuranceCompany: true,
      policyNumber: true,
      insuranceAgent: true,
      insuranceStartDate: true,
      insuranceEndDate: true,
      sold: true,
      freight: true,
      financeId: true,

      Finance: {
        select: {
          financeManager: true,
          userEmail: true,
          userName: true,
          financeManagerName: true,
          //: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          name: true,
          address: true,
          city: true,
          postal: true,
          province: true,
          dl: true,
          typeOfContact: true,
          timeToContact: true,
          dob: true,
          //: true,
          othTax: true,
          optionsTotal: true,
          lienPayout: true,
          leadNote: true,
          sendToFinanceNow: true,
          dealNumber: true,
          iRate: true,
          months: true,
          discount: true,
          total: true,
          onTax: true,
          on60: true,
          biweekly: true,
          weekly: true,
          weeklyOth: true,
          biweekOth: true,
          oth60: true,
          weeklyqc: true,
          biweeklyqc: true,
          qc60: true,
          deposit: true,
          biweeklNatWOptions: true,
          weeklylNatWOptions: true,
          nat60WOptions: true,
          weeklyOthWOptions: true,
          biweekOthWOptions: true,
          oth60WOptions: true,
          biweeklNat: true,
          weeklylNat: true,
          nat60: true,
          qcTax: true,
          otherTax: true,
          totalWithOptions: true,
          otherTaxWithOptions: true,
          desiredPayments: true,
          admin: true,
          commodity: true,
          pdi: true,
          discountPer: true,
          userLoanProt: true,
          userTireandRim: true,
          userGap: true,
          userExtWarr: true,
          userServicespkg: true,
          deliveryCharge: true,
          vinE: true,
          lifeDisability: true,
          rustProofing: true,
          userOther: true,
          //: true,
          referral: true,
          visited: true,
          bookedApt: true,
          aptShowed: true,
          aptNoShowed: true,
          testDrive: true,
          metService: true,
          metManager: true,
          metParts: true,
          sold: true,
          depositMade: true,
          refund: true,
          turnOver: true,
          financeApp: true,
          approved: true,
          signed: true,
          pickUpSet: true,
          demoed: true,
          lastContact: true,
          status: true,
          customerState: true,
          result: true,
          timesContacted: true,
          nextAppointment: true,
          followUpDay: true,
          deliveryDate: true,
          delivered: true,
          deliveredDate: true,
          notes: true,
          visits: true,
          progress: true,
          metSalesperson: true,
          metFinance: true,
          financeApplication: true,
          pickUpDate: true,
          pickUpTime: true,
          depositTakenDate: true,
          docsSigned: true,
          tradeRepairs: true,
          seenTrade: true,
          lastNote: true,
          applicationDone: true,
          licensingSent: true,
          liceningDone: true,
          refunded: true,
          cancelled: true,
          lost: true,
          dLCopy: true,
          insCopy: true,
          testDrForm: true,
          voidChq: true,
          loanOther: true,
          signBill: true,
          ucda: true,
          tradeInsp: true,
          customerWS: true,
          otherDocs: true,
          urgentFinanceNote: true,
          funded: true,
          leadSource: true,
          financeDeptProductsTotal: true,
          bank: true,
          loanNumber: true,
          idVerified: true,
          dealerCommission: true,
          financeCommission: true,
          salesCommission: true,
          firstPayment: true,
          loanMaturity: true,
          quoted: true,
          //: true,
          InPerson: true,
          Phone: true,
          SMS: true,
          Email: true,
          Other: true,
          //------: true,
          //: true,
          paintPrem: true,
          licensing: true,
          stockNum: true,
          options: true,
          accessories: true,
          freight: true,
          labour: true,
          year: true,
          brand: true,
          mileage: true,
          model: true,
          model1: true,
          color: true,
          modelCode: true,
          msrp: true,
          trim: true,
          vin: true,
          bikeStatus: true,
          invId: true,
          motor: true,
          tag: true,
          //: true,
          tradeValue: true,
          tradeDesc: true,
          tradeColor: true,
          tradeYear: true,
          tradeMake: true,
          tradeVin: true,
          tradeTrim: true,
          tradeMileage: true,
          tradeLocation: true,
          lien: true,
          //: true,
          id: true,
          activixId: true,
          theRealActId: true,
          createdAt: true,
          updatedAt: true,
          clientfileId: true,
          inventoryMotorcycleId: true,

          ///InventoryMotorcycle
          Clientfile: {
            select: {
              id: true,
              createdAt: true,
              updatedAt: true,
              financeId: true,
              userId: true,
              firstName: true,
              lastName: true,
              name: true,
              email: true,
              phone: true,
              address: true,
              city: true,
              postal: true,
              province: true,
              dl: true,
              typeOfContact: true,
              timeToContact: true,
              conversationId: true,
              billingAddress: true,
              dob: true,

              // AccOrder
              //Finance
              //WorkOrder
              //ServiceUnit
              //Comm
            }
          }
        }
      },
      workOrders: {
        select: {
          workOrderId: true,
          unit: true,
          mileage: true,
          vin: true,
          tag: true,
          motor: true,
          color: true,
          budget: true,
          waiter: true,
          totalLabour: true,
          totalParts: true,
          subTotal: true,
          total: true,
          writer: true,
          userEmail: true,
          tech: true,
          discDollar: true,
          discPer: true,
          techEmail: true,
          notes: true,
          customerSig: true,
          status: true,
          location: true,
          quoted: true,
          paid: true,
          remaining: true,
          FinanceUnitId: true,
          ServiceUnitId: true,
          financeId: true,
          clientfileId: true,
          note: true,
          closedAt: true,
          createdAt: true,
          updatedAt: true,
          ServicesOnWorkOrders: {
            select: {
              id: true,
              createdAt: true,
              updatedAt: true,
              quantity: true,
              hr: true,
              status: true,
              workOrderId: true,
              serviceId: true,
              service: {
                select: {
                  id: true,
                  createdAt: true,
                  updatedAt: true,
                  description: true,
                  estHr: true,
                  service: true,
                  price: true,
                }
              }
            }
          },
          AccOrders: {
            select: {
              id: true,
              createdAt: true,
              updatedAt: true,
              userEmail: true,
              userName: true,
              dept: true,
              sellingDept: true,
              total: true,
              discount: true,
              discPer: true,
              paid: true,
              paidDate: true,
              status: true,
              workOrderId: true,
              note: true,
              financeId: true,
              clientfileId: true,

              AccessoriesOnOrders: {
                select: {
                  id: true,
                  quantity: true,
                  accOrderId: true,
                  status: true,
                  orderNumber: true,
                  OrderInvId: true,
                  accessoryId: true,
                  service: true,
                  hour: true,

                  // orderInventory
                  accessory: {
                    select: {
                      id: true,
                      createdAt: true,
                      updatedAt: true,
                      partNumber: true,
                      brand: true,
                      name: true,
                      price: true,
                      cost: true,
                      quantity: true,
                      minQuantity: true,
                      description: true,
                      category: true,
                      subCategory: true,
                      onOrder: true,
                      distributer: true,
                      location: true,
                      note: true,
                      workOrderSuggestion: true,
                    }
                  },
                  //accOrder
                }
              },
              //   Payments
              //  WorkOrder
              //  Finance
              AccHandoff: {
                select: {
                  id: true,
                  createdAt: true,
                  updatedAt: true,
                  sendTo: true,
                  handOffTime: true,
                  status: true,
                  sendToCompleted: true,
                  completedTime: true,
                  notes: true,
                  handOffDept: true,
                  AccOrderId: true,
                }
              }
              //  Clientfile
            }
          },
        }
      }
    }
  })

  return json({ user, inventoryMotorcycle, });
}
export const action: ActionFunction = async ({ request, params }) => {
  const formPayload = Object.fromEntries(await request.formData());
  let formData = financeFormSchema.parse(formPayload)
  const userSession = await getSession(request.headers.get("Cookie"));
  if (!userSession) { return json({ status: 302, redirect: 'login' }); };
  const email = userSession.get("email");
  const user = await prisma.user.findUnique({
    where: { email: email },
    select: {
      id: true,
      ColumnStateInventory: {
        select: {
          id: true,
          state: true,
        }
      }
    }
  })
  const intent = formData.intent
  if (intent === 'columnState') {
    /** const update = await prisma.columnStateInventory.update({
       where: { id: user.ColumnStateInventory.id },
       data: { state: JSON.parse(formPayload.state) }
     }) */
    return null //json({ update })
  }
  if (intent === 'addUnit') {
    const update = await prisma.inventoryMotorcycle.create({
      data: {
        packageNumber: formPayload.packageNumber,
        packagePrice: formPayload.packagePrice,
        stockNumber: formPayload.stockNumber,
        type: formPayload.type,
        class: formPayload.class,
        year: formPayload.year,
        make: formPayload.make,
        model: formPayload.model,
        modelName: formPayload.modelName,
        submodel: formPayload.submodel,
        subSubmodel: formPayload.subSubmodel,
        price: formPayload.price,
        exteriorColor: formPayload.exteriorColor,
        mileage: formPayload.mileage,
        consignment: Boolean(formPayload.consignment),
        onOrder: Boolean(formPayload.onOrder),
        expectedOn: formPayload.expectedOn,
        status: formPayload.status,
        orderStatus: formPayload.orderStatus,
        hdcFONumber: formPayload.hdcFONumber,
        hdmcFONumber: formPayload.hdmcFONumber,
        vin: formPayload.vin,
        age: parseInt(formPayload.age),
        floorPlanDueDate: formPayload.floorPlanDueDate,
        location: formPayload.location,
        stocked: Boolean(formPayload.stocked),
        stockedDate: formPayload.stockedDate,
        isNew: Boolean(formPayload.isNew),
        actualCost: formPayload.actualCost,
        mfgSerialNumber: formPayload.mfgSerialNumber,
        engineNumber: formPayload.engineNumber,
        plates: formPayload.plates,
        keyNumber: formPayload.keyNumber,
        length: formPayload.length,
        width: formPayload.width,
        engine: formPayload.engine,
        fuelType: formPayload.fuelType,
        power: formPayload.power,
        chassisNumber: formPayload.chassisNumber,
        chassisYear: formPayload.chassisYear,
        chassisMake: formPayload.chassisMake,
        chassisModel: formPayload.chassisModel,
        chassisType: formPayload.chassisType,
        registrationState: formPayload.registrationState,
        registrationExpiry: formPayload.registrationExpiry,
        grossWeight: formPayload.grossWeight,
        netWeight: formPayload.netWeight,
        insuranceCompany: formPayload.insuranceCompany,
        policyNumber: formPayload.policyNumber,
        insuranceAgent: formPayload.insuranceAgent,
        insuranceStartDate: formPayload.insuranceStartDate,
        insuranceEndDate: formPayload.insuranceEndDate,
        sold: Boolean(formPayload.sold),
        financeId: formPayload.financeId,
      }
    })
    return json({ update })
  }
  if (intent === 'updateUnit') {
    const update = await prisma.inventoryMotorcycle.update({
      where: { id: formData.id },
      data: {
        packageNumber: formData.packageNumber,
        packagePrice: formData.packagePrice,
        stockNumber: formData.stockNumber,
        type: formData.type,
        class: formData.class,
        year: formData.year,
        make: formData.make,
        model: formData.model,
        modelName: formData.modelName,
        submodel: formData.submodel,
        subSubmodel: formData.subSubmodel,
        price: formData.price,
        exteriorColor: formData.exteriorColor,
        mileage: formData.mileage,
        orderStatus: formData.orderStatus,
        hdcFONumber: formData.hdcFONumber,
        hdmcFONumber: formData.hdmcFONumber,
        vin: formData.vin,
        age: parseInt(formData.age),
        location: formData.location,
        actualCost: formData.actualCost,
        mfgSerialNumber: formData.mfgSerialNumber,
        engineNumber: formData.engineNumber,
        plates: formData.plates,
        keyNumber: formData.keyNumber,
        length: formData.length,
        width: formData.width,
        engine: formData.engine,
        fuelType: formData.fuelType,
        power: formData.power,
        chassisNumber: formData.chassisNumber,
        chassisYear: formData.chassisYear,
        chassisMake: formData.chassisMake,
        chassisModel: formData.chassisModel,
        chassisType: formData.chassisType,
        registrationState: formData.registrationState,
        registrationExpiry: formData.registrationExpiry,
        grossWeight: formData.grossWeight,
        netWeight: formData.netWeight,
        insuranceCompany: formData.insuranceCompany,
        policyNumber: formData.policyNumber,
        insuranceAgent: formData.insuranceAgent,
        insuranceStartDate: formData.insuranceStartDate,
        insuranceEndDate: formData.insuranceEndDate,
      }
    })
    return json({ update })
  }
  if (intent === 'consignment') {
    const update = await prisma.inventoryMotorcycle.update({
      where: { id: formData.id },
      data: { consignment: Boolean(formPayload.consignment) }
    })
    return json({ update })
  }
  if (intent === 'onOrder') {
    const update = await prisma.inventoryMotorcycle.update({
      where: { id: formData.id },
      data: { onOrder: Boolean(formPayload.onOrder) }
    })
    return json({ update })
  }
  if (intent === 'expectedOn') {
    const update = await prisma.inventoryMotorcycle.update({
      where: { id: formData.id },
      data: { expectedOn: String(formPayload.expectedOn) }
    })
    return json({ update })
  }
  if (intent === 'status') {
    const update = await prisma.inventoryMotorcycle.update({
      where: { id: formData.id },
      data: { status: String(formPayload.status) }
    })
    return json({ update })
  }
  if (intent === 'orderStatus') {
    const update = await prisma.inventoryMotorcycle.update({
      where: { id: formData.id },
      data: { orderStatus: String(formPayload.orderStatus) }
    })
    return json({ update })
  }
  if (intent === 'floorPlanDueDate') {
    const update = await prisma.inventoryMotorcycle.update({
      where: { id: formData.id },
      data: { floorPlanDueDate: String(formPayload.floorPlanDueDate) }
    })
    return json({ update })
  }
  if (intent === 'isNew') {
    const update = await prisma.inventoryMotorcycle.update({
      where: { id: formData.id },
      data: { isNew: Boolean(formPayload.isNew) }
    })
    return json({ update })
  }
  if (intent === 'sold') {
    const update = await prisma.inventoryMotorcycle.update({
      where: { id: formData.id },
      data: {
        sold: Boolean(formPayload.sold),
        status: formPayload.sold ? "Reserved" : null,
        orderStatus: formPayload.sold ? "Reserved" : null,
      }
    })
    return json({ update })
  }


  if (intent === 'stocked') {
    const update = await prisma.inventoryMotorcycle.update({
      where: { id: formData.id },
      data: { stocked: Boolean(formPayload.stocked), stockedDate: formPayload.stocked ? String(new Date()) : null }
    })
    return json({ update })
  }
  return json({ message: 'Invalid intent' }, { status: 400 });
}
export default function UnitPicker({ finance, tableData, user }) {


  // console.log(finance, tableData, user, 'unitpicker')
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="h-8 gap-1 mr-3 border-border bg-background text-[#f2f2f2]"  >
          <Truck className="h-3.5 w-3.5" />
          <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
            Assign Stock Unit
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[95%] border border-border max-h-[700px] h-auto overflow-y-auto">
        <UnitInv finance={finance} tableData={tableData} user={user} />
      </DialogContent>
    </Dialog>

  )
}
export function UnitInv({ finance, tableData, user }) {
  const [data, setPaymentData,] = useState([]);

  useEffect(() => {
    setPaymentData(tableData)
  }, []);

  const fetcher = useFetcher();
  const submit = useSubmit();
  const [referrer, setReferrer] = useState()
  useEffect(() => {
    const referer = document.referrer;
    if (referer) {
      setReferrer(referer)
    }
  }, []);
  console.log(user, 'inventory units')
  const userIsManager = user.positions.some(
    (pos) => pos.position === 'Manager' || pos.position === 'Administrator'
  );


  let defaultColumn
  if (userIsManager) {
    defaultColumn = {
      cell: ({ row, column: { id } }) => {
        const data = row.original
        return (
          <EditableText
            value={row.getValue(id)}
            fieldName="name"
            inputClassName=" border border-border rounded-lg  text-foreground bg-background py-1 px-2 "
            buttonClassName="text-center py-1 px-2 text-foreground mx-auto flex justify-center"
            buttonLabel={`Edit "${id}"`}
            inputLabel={`Edit "${id}"`}
          >
            <input type="hidden" name="intent" value='updateDefaultColumn' />
            <input type="hidden" name="id" value={data.id} />
            <input type="hidden" name="colName" value={id} />
          </EditableText>
        )
      },
    }
  } else {
    defaultColumn = {
      cell: ({ row, column: { id } }) => {
        const data = row.original
        return (
          <p
            className="text-center py-1 px-2 text-foreground mx-auto flex justify-center"
          >
            {row.getValue(id)}
          </p>
        )
      },
    }
  }



  console.log(referrer, 'referer')
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const savedVisibility = user.ColumnStateInventory.state
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(savedVisibility || {
    id: false,
    packageNumber: false,
    packagePrice: false,
    type: false,
    class: false,
    hdcFONumber: false,
    hdmcFONumber: false,
    //stocked: false,
    //stockedDate: false,
    isNew: false,
    mfgSerialNumber: false,
    actualCost: false,
    engineNumber: false,
    plates: false,
    length: false,
    width: false,
    engine: false,
    fuelType: false,
    power: false,
    chassisNumber: false,
    chassisYear: false,
    chassisMake: false,
    chassisModel: false,
    chassisType: false,
    registrationState: false,
    registrationExpiry: false,
    netWeight: false,
    grossWeight: false,
    insuranceCompany: false,
    policyNumber: false,
    insuranceStartDate: false,
    insuranceAgent: false,
    insuranceEndDate: false,
    model2: false,
    // consignment: false,
  });

  useEffect(() => {
    fetcher.submit(
      { state: JSON.stringify(columnVisibility), intent: 'columnState' },
      { method: "post" }
    );
  }, [columnVisibility]);

  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState('')
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [selectedModel, setSelectedModel] = useState({})
  const [filterBy, setFilterBy] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState("");
  const [selectedGlobal, setSelectedGlobal] = useState(true);
  const [todayfilterBy, setTodayfilterBy] = useState(null);

  const [models, setModels] = useState([]);
  const [modelName, setModelName] = useState([]);
  const [subModel, setSubModel] = useState([]);


  useEffect(() => {
    setGlobalFilter(finance.model)
  }, []);

  useEffect(() => {
    async function fetchModels() {
      const uniqueModels = [
        ...new Set(tableData.map(wishList => wishList.model))
      ];
      const uniqueModels2 = [
        ...new Set(tableData.map(wishList => wishList.modelName))
      ];
      const uniqueModels3 = [
        ...new Set(tableData.map(wishList => wishList.subModel))
      ];
      setModels(uniqueModels);
      setModelName(uniqueModels2);
      setSubModel(uniqueModels3);
    }

    fetchModels();
  }, []);

  const assignUnit = useFetcher()

  const handleDropdownChange = (value) => {
    setGlobalFilter(value);
  };

  const [date, setDate] = useState<Date>()

  const newDate = new Date()
  const [datefloorPlanDueDate, setDatefloorPlanDueDate] = useState<Date>()

  const options2 = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZoneName: "short"
  };

  const columns = [

    {
      id: 'Assign Unit',
      accessorKey: "Assign Unit",
      filterFn: 'fuzzy',
      sortingFn: fuzzySort,

      cell: ({ row, column: { id } }) => {
        const data = row.original
        return (
          <Button
            onClick={() => {
              const formData = new FormData();
              formData.append("id", data.id);
              formData.append("stockNum", data.stockNumber);
              formData.append("year", data.year);
              formData.append("brand", data.make);
              formData.append("model", data.model);
              formData.append("mileage", data.mileage);
              formData.append("color", data.exteriorColor);
              formData.append("model1", data.submodel);
              formData.append("msrp", data.price);
              formData.append("vin", data.vin);
              formData.append("financeId", finance.id);
              formData.append("intent", 'assignUnit');
              assignUnit.submit(formData, { method: "post" });
            }}
            variant="outline">Assign Unit</Button>

        )
      },
    },
    {
      accessorKey: "id",
      header: "id",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("id")}</div>
      ),
    },
    {
      accessorKey: "unitInfo",
      cell: ({ row, column: { id } }) => {
        const data = row.original
        return (
          <UnitDialog data={data} user={user} />
        )
      },
      filterFn: fuzzyFilter,
      sortingFn: fuzzySort,
    },
    {
      accessorKey: "stockNumber",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className='mx-auto justify-center'
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Stock #
            <CaretSortIcon className="ml-2 h-4 w-4 " />
          </Button>
        )
      },
      filterFn: fuzzyFilter,
      sortingFn: fuzzySort,
    },
    {
      filterFn: fuzzyFilter,
      sortingFn: fuzzySort,
      accessorKey: "year",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className='mx-auto'

            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Year
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        )
      },

    },
    {
      filterFn: fuzzyFilter,
      sortingFn: fuzzySort,
      accessorKey: "make",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className=''

            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Make
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        )
      },

    },
    {
      filterFn: fuzzyFilter,
      sortingFn: fuzzySort,
      accessorKey: "model",
      header: ({ column }) => {
        return (
          <Select name='model' onValueChange={handleDropdownChange}>
            <SelectTrigger className="  bg-background text-foreground border border-border">
              <SelectValue placeholder='Model' />
            </SelectTrigger>
            <SelectContent className='bg-background text-foreground border border-border '>
              <SelectGroup>
                <SelectLabel>Models</SelectLabel>
                {models.map((model, index) => (
                  <SelectItem key={index} value={model} className="cursor-pointer bg-background capitalize text-foreground  hover:text-primary hover:underline">
                    {model}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        )
      },

    },
    {
      filterFn: fuzzyFilter,
      sortingFn: fuzzySort,
      accessorKey: "modelName",
      header: ({ column }) => {
        return (
          <Select name='model' onValueChange={handleDropdownChange}>
            <SelectTrigger className="  bg-background text-foreground border border-border">
              <SelectValue placeholder='Model Name' />
            </SelectTrigger>
            <SelectContent className='bg-background text-foreground border border-border '>
              <SelectGroup>
                <SelectLabel>Models</SelectLabel>
                {modelName.map((model, index) => (
                  <SelectItem key={index} value={model} className="cursor-pointer bg-background capitalize text-foreground  hover:text-primary hover:underline">
                    {model}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        )
      },

    },
    {
      filterFn: fuzzyFilter,
      sortingFn: fuzzySort,
      accessorKey: "submodel",
      header: ({ column }) => {
        return (
          <Select name='model' onValueChange={handleDropdownChange}>
            <SelectTrigger className="  bg-background text-foreground border border-border">
              <SelectValue placeholder='Sub Model' />
            </SelectTrigger>
            <SelectContent className='bg-background text-foreground border border-border '>
              <SelectGroup>
                <SelectLabel>Models</SelectLabel>
                {subModel.map((model, index) => (
                  <SelectItem key={index} value={model} className="cursor-pointer bg-background capitalize text-foreground  hover:text-primary hover:underline">
                    {model}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        )
      },

    },
    {
      filterFn: fuzzyFilter,
      sortingFn: fuzzySort,
      accessorKey: "subSubmodel",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Sub SuB Model
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        )
      },

    },
    {
      filterFn: fuzzyFilter,
      sortingFn: fuzzySort,
      accessorKey: "price",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Price
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        )
      },

    },
    {
      filterFn: fuzzyFilter,
      sortingFn: fuzzySort,
      accessorKey: "exteriorColor",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Ext Color
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        )
      },

    },
    {
      filterFn: fuzzyFilter,
      sortingFn: fuzzySort,
      accessorKey: "mileage",

      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Mileage
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        )
      },

    },
    {
      filterFn: fuzzyFilter,
      sortingFn: fuzzySort,
      accessorKey: "consignment",
      header: ({ column }) => {
        return <>
          <Select onValueChange={(value) => {
            const status = table.getColumn("consignment")
            status?.setFilterValue(value)
          }}                                >
            <SelectTrigger className="w-full bg-background text-foreground border border-border">
              <SelectValue placeholder='Consignment' />
            </SelectTrigger>
            <SelectContent className='bg-background text-foreground border-border'>
              <SelectItem value="true">true</SelectItem>
              <SelectItem value="false">false</SelectItem>
            </SelectContent>
          </Select>
        </>
      },
      cell: ({ row }) => {
        const data = row.original
        return <div className="bg-transparent my-auto  flex h-[45px] flex-1 cursor-pointer items-center justify-center text-center  uppercase leading-none text-foreground  outline-none transition-all duration-150 ease-linear target:text-primary hover:text-primary focus:text-primary focus:outline-none  active:bg-primary">
          <Consignment data={data} />
        </div>
      },
    },
    {
      filterFn: fuzzyFilter,
      sortingFn: fuzzySort,
      accessorKey: "onOrder",
      header: ({ column }) => {
        return <>
          <Select onValueChange={(value) => {
            const status = table.getColumn("onOrder")
            status?.setFilterValue(value)
          }}                                >
            <SelectTrigger className="w-full bg-background text-foreground border border-border">
              <SelectValue placeholder='On Order' />
            </SelectTrigger>
            <SelectContent className='bg-background text-foreground border-border'>
              <SelectItem value="true">true</SelectItem>
              <SelectItem value="false">false</SelectItem>
            </SelectContent>
          </Select>
        </>
      },
      cell: ({ row }) => {
        const data = row.original
        //

        return <div className="bg-transparent my-auto  flex h-[45px] flex-1 cursor-pointer items-center justify-center text-center  uppercase leading-none text-foreground  outline-none transition-all duration-150 ease-linear target:text-primary hover:text-primary focus:text-primary focus:outline-none  active:bg-primary">
          <OnOrder data={data} />
        </div>
      },

    },
    {
      filterFn: fuzzyFilter,
      sortingFn: fuzzySort,
      accessorKey: "expectedOn",
      header: ({ column }) => {
        return (
          <Button
            className='mx-auto'
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Expected On
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const data = row.original

        return <div className="w-[175px]  bg-transparent my-auto  flex h-[45px] flex-1 cursor-pointer items-center justify-center text-center  uppercase leading-none text-foreground  outline-none transition-all duration-150 ease-linear target:text-primary hover:text-primary focus:text-primary focus:outline-none  active:bg-primary">
          {data.expectedOn ? (<p>{new Date(data.expectedOn).toLocaleDateString("en-US", options2)}</p>) : (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  size='sm'
                  variant={"outline"}
                  className={cn(
                    "  justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 border-border" align="start">
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
                  <Button size='sm' className='mx-auto m-3' onClick={() => {
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
        </div >
      },
    },
    {
      filterFn: fuzzyFilter,
      sortingFn: fuzzySort,
      accessorKey: "sold",
      header: ({ column }) => {
        return <>
          <Select onValueChange={(value) => {
            const status = table.getColumn("sold")
            status?.setFilterValue(value)
          }}                                >
            <SelectTrigger className="w-full bg-background text-foreground border border-border">
              <SelectValue placeholder='Sold' />
            </SelectTrigger>
            <SelectContent className='bg-background text-foreground border-border'>
              <SelectItem value="true">true</SelectItem>
              <SelectItem value="false">false</SelectItem>
            </SelectContent>
          </Select>
        </>
      },
      cell: ({ row }) => {
        const data = row.original
        //

        return <div className="bg-transparent my-auto  flex h-[45px] flex-1 cursor-pointer items-center justify-center text-center  uppercase leading-none text-foreground  outline-none transition-all duration-150 ease-linear target:text-primary hover:text-primary focus:text-primary focus:outline-none  active:bg-primary">
          <Sold data={data} />
        </div>
      },
    },
    {
      filterFn: fuzzyFilter,
      sortingFn: fuzzySort,
      accessorKey: "status",
      header: ({ column }) => {
        return <>
          <Select onValueChange={(value) => {
            const status = table.getColumn("status")
            status?.setFilterValue(value)
          }}                                >
            <SelectTrigger className="w-full bg-background text-foreground border border-border">
              <SelectValue placeholder='Status' />
            </SelectTrigger>
            <SelectContent className='bg-background text-foreground border-border'>
              <SelectItem value="Available">Available</SelectItem>
              <SelectItem value="Reserved">Reserved</SelectItem>
            </SelectContent>
          </Select>
        </>
      },
      cell: ({ row }) => {
        const data = row.original
        //

        return <div className="bg-transparent my-auto  flex h-[45px] flex-1 cursor-pointer items-center justify-center text-center  uppercase leading-none text-foreground  outline-none transition-all duration-150 ease-linear target:text-primary hover:text-primary focus:text-primary focus:outline-none  active:bg-primary">
          <Status data={data} />
        </div>
      },

    },
    {
      filterFn: fuzzyFilter,
      sortingFn: fuzzySort,
      accessorKey: "orderStatus",
      header: ({ column }) => {
        return <>
          <Select onValueChange={(value) => {
            const status = table.getColumn("orderStatus")
            status?.setFilterValue(value)
          }}                                >
            <SelectTrigger className="w-full bg-background text-foreground border border-border">
              <SelectValue placeholder='Order Status' />
            </SelectTrigger>
            <SelectContent className='bg-background text-foreground border-border'>
              <SelectItem value="On Order">On Order</SelectItem>
              <SelectItem value="Stock">Stock</SelectItem>
              <SelectItem value="Reserved">Reserved</SelectItem>
              <SelectItem value="Wish">Wish</SelectItem>
            </SelectContent>
          </Select>
        </>
      },
      cell: ({ row }) => {
        const data = row.original
        //

        return <div className="bg-transparent my-auto  flex h-[45px] flex-1 cursor-pointer items-center justify-center text-center  uppercase leading-none text-foreground  outline-none transition-all duration-150 ease-linear target:text-primary hover:text-primary focus:text-primary focus:outline-none  active:bg-primary">
          <OrderStatus data={data} />
        </div>
      },
    },
    {
      filterFn: fuzzyFilter,
      sortingFn: fuzzySort,
      accessorKey: "vin",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            VIN
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        )
      },

    },
    {
      filterFn: fuzzyFilter,
      sortingFn: fuzzySort,
      accessorKey: "age",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Age
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        )
      },

    },
    {
      filterFn: fuzzyFilter,
      sortingFn: fuzzySort,
      accessorKey: "floorPlanDueDate",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Floor Plan Due Date
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const data = row.original


        return <div className="w-[175px] bg-transparent my-auto  flex h-[45px] flex-1 cursor-pointer items-center justify-center text-center  uppercase leading-none text-foreground  outline-none transition-all duration-150 ease-linear target:text-primary hover:text-primary focus:text-primary focus:outline-none  active:bg-primary">
          {data.floorPlanDueDate ? (<p>{new Date(data.floorPlanDueDate).toLocaleDateString("en-US", options2)}</p>) : (

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  size='sm'
                  variant={"outline"}
                  className={cn(
                    "  justify-start text-left font-normal",
                    !datefloorPlanDueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {datefloorPlanDueDate ? format(datefloorPlanDueDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 border-border" align="start">
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
                  <Button size='sm' className='mx-auto m-3' onClick={() => {
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
        </div >
      },
    },
    {
      filterFn: fuzzyFilter,
      sortingFn: fuzzySort,
      accessorKey: "location",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Location
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        )
      },

    },
    {
      filterFn: fuzzyFilter,
      sortingFn: fuzzySort,
      accessorKey: "isNew",
      header: ({ column }) => {
        return <>
          <Select onValueChange={(value) => {
            const status = table.getColumn("isNew")
            status?.setFilterValue(value)
          }}                                >
            <SelectTrigger className="w-full bg-background text-foreground border border-border">
              <SelectValue placeholder='Is New' />
            </SelectTrigger>
            <SelectContent className='bg-background text-foreground border-border'>
              <SelectItem value="true">true</SelectItem>
              <SelectItem value="false">false</SelectItem>
            </SelectContent>
          </Select>
        </>
      },
      cell: ({ row }) => {
        const data = row.original
        //

        return <div className="bg-transparent my-auto  flex h-[45px] flex-1 cursor-pointer items-center justify-center text-center  uppercase leading-none text-foreground  outline-none transition-all duration-150 ease-linear target:text-primary hover:text-primary focus:text-primary focus:outline-none  active:bg-primary">
          <IsNew data={data} />
        </div>
      },
    },
    {
      filterFn: fuzzyFilter,
      sortingFn: fuzzySort,
      accessorKey: "keyNumber",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Key Number
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        )
      },

    },

    {
      accessorKey: "packageNumber",
      header: "Package Number",
      id: 'packageNumber',
      footer: props => props.column.id,
    },
    {
      accessorKey: "packagePrice",
      header: "Package Price",

    },
    {
      accessorKey: "type",
      header: "type",


    },
    {
      accessorKey: "class",
      header: "class",

    },
    {
      accessorKey: "hdcFONumber",
      header: "hdcFONumber",

    },
    {
      accessorKey: "hdmcFONumber",
      header: "hdmcFONumber",

    },
    {
      accessorKey: "stocked",
      header: ({ column }) => {
        return <>
          <Select onValueChange={(value) => {
            const status = table.getColumn("stocked")
            status?.setFilterValue(value)
          }}                                >
            <SelectTrigger className="w-full bg-background text-foreground border border-border">
              <SelectValue placeholder='Stocked' />
            </SelectTrigger>
            <SelectContent className='bg-background text-foreground border-border'>
              <SelectItem value="true">true</SelectItem>
              <SelectItem value="false">false</SelectItem>
            </SelectContent>
          </Select>
        </>
      },
      id: 'stocked',
      footer: props => props.column.id,
      cell: ({ row }) => {
        const data = row.original
        //

        return <div className="bg-transparent my-auto  flex h-[45px] flex-1 cursor-pointer items-center justify-center text-center  uppercase leading-none text-foreground  outline-none transition-all duration-150 ease-linear target:text-primary hover:text-primary focus:text-primary focus:outline-none  active:bg-primary">
          <Stocked data={data} />
        </div>
      },
    },
    {
      accessorKey: "stockedDate",
      header: "Stocked Date",
      id: 'stockedDate',
      footer: props => props.column.id,
      cell: ({ row }) => {
        const data = row.original
        return <div className="w-[175px] bg-transparent my-auto  flex h-[45px] flex-1 cursor-pointer items-center justify-center text-center  uppercase leading-none text-foreground  outline-none transition-all duration-150 ease-linear target:text-primary hover:text-primary focus:text-primary focus:outline-none  active:bg-primary">
          <p>{data.stockedDate ? new Date(data.stockedDate).toLocaleDateString("en-US", options2) : ''}</p>
        </div >
      },
    },

    {
      accessorKey: "mfgSerialNumber",
      header: "mfgSerialNumber",

    },
    {
      accessorKey: "actualCost",
      header: "actualCost",

    },
    {
      accessorKey: "engineNumber",
      header: "engineNumber",

    },
    {
      accessorKey: "plates",
      header: "plates",
    },
    {
      accessorKey: "width",
      header: "width",

    },
    {
      accessorKey: "engine",
      header: "engine",

    },
    {
      accessorKey: "fuelType",
      header: "fuelType",

    },
    {
      accessorKey: "power",
      header: "power",

    },
    {
      accessorKey: "chassisNumber",
      header: "chassisNumber",

    },
    {
      accessorKey: "chassisYear",
      header: "chassisYear",

    },
    {
      accessorKey: "chassisMake",
      header: "chassisMake",

    },
    {
      accessorKey: "chassisModel",
      header: "chassisModel",
    },
    {
      accessorKey: "chassisType",
      header: "chassisType",

    },
    {
      accessorKey: "registrationState",
      header: "registrationState",

    },
    {
      accessorKey: "registrationExpiry",
      header: "registrationExpiry",

    },
    {
      accessorKey: "netWeight",
      header: "netWeight",

    },
    {
      accessorKey: "grossWeight",
      header: "grossWeight",

    },
    {
      accessorKey: "insuranceCompany",
      header: "insuranceCompany",

    },
    {
      accessorKey: "policyNumber",
      header: "policyNumber",

    },
    {
      accessorKey: "insuranceStartDate",
      header: "insuranceStartDate",

    },
    {
      accessorKey: "insuranceAgent",
      header: "insuranceAgent",

    },
    {
      accessorKey: "insuranceEndDate",
      header: "insuranceEndDate",

    },
    {
      accessorKey: "length",
      header: "length",
    },

  ]

  const table = useReactTable({
    data,
    columns,
    defaultColumn,
    filterFns: { fuzzy: fuzzyFilter, },
    globalFilterFn: 'fuzzy',
    initialState: { columnVisibility },

    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),

    onColumnVisibilityChange: setColumnVisibility,


    onRowSelectionChange: setRowSelection,
    enableColumnResizing: true,
    columnResizeMode: 'onChange',
    onGlobalFilterChange: setGlobalFilter,
    enableRowSelection: true,
  });

  // -------- my components --------  //



  // clears filters
  const setAllFilters = () => {
    setColumnFilters([]);
    setSorting([]);
    setFilterBy("");
    setGlobalFilter([]);
  };
  const toggleFilter = () => {
    setAllFilters()
    setShowFilter(!showFilter);
  };
  const setColumnFilterDropdown = (event) => {
    const columnId = event.target.getAttribute("data-value");
    setSelectedColumn(columnId);
    console.log("Selected column:", columnId);
    // Add your logic here to handle the column selection
  };
  const handleGlobalChange = (value) => {
    console.log("value", value);
    table.getColumn(selectedColumn)?.setFilterValue(value);
  };

  const CallsList = [
    {
      key: "inStock",
      name: "In Stock",
    },
    {
      key: "available",
      name: "Available",
    },
    {
      key: "inStockArrived",
      name: "In Stock and Available",
    },
    {
      key: "newStock",
      name: "New Stock",
    },
    {
      key: "usedStock",
      name: "Used Stock",
    },
    {
      key: "sold",
      name: "Sold",
    },
    {
      key: "otd",
      name: "Out The Door",
    },
    {
      key: "deposits",
      name: "Sold Units - Waiting To Be Picked Up",
    },
  ];
  const DeliveriesList = [
    {
      key: "todaysDeliveries",
      name: "Deliveries - Today",
    },
    {
      key: "tomorowsDeliveries",
      name: "Deliveries - Tomorrow",
    },
    {
      key: "yestDeliveries",
      name: "Deliveries - Yesterday",
    },
    {
      key: "deliveredThisMonth",
      name: "Delivered - Current Month",
    },
    {
      key: "deliveredLastMonth",
      name: "Delivered - Last Month",
    },
    {
      key: "deliveredThisYear",
      name: "Delivered - Year",
    },
  ];
  const DepositsTakenList = [
    {
      key: "depositsToday",
      name: "Deposit Taken - Need to Finalize Deal",
    },
  ];
  const handleFilterChange = (selectedFilter) => {
    setAllFilters()
    const customerStateColumn = table.getColumn('customerState');
    const nextAppointmentColumn = table.getColumn('nextAppointment');
    const deliveredDate = table.getColumn('deliveredDate');
    const pickUpDate = table.getColumn('pickUpDate');
    const status = table.getColumn('status');
    const depositMade = table.getColumn('depositMade');
    const sold = table.getColumn('sold')
    const delivered = table.getColumn('delivered')
    const signed = table.getColumn('signed')
    const financeApp = table.getColumn('financeApp')

    switch (selectedFilter) {
      case 'inStock':
        table.getColumn('status')?.setFilterValue('available');
        table.getColumn('onOrder')?.setFilterValue('false');
        break;
      case 'available':
        table.getColumn('status')?.setFilterValue('available');
        break;
      case 'inStockArrived':
        table.getColumn('status')?.setFilterValue('available');
        table.getColumn('orderStatus')?.setFilterValue('STOCK');
        break;
      case 'newStock':
        table.getColumn('new')?.setFilterValue(true);
        break;
      case 'usedStock':
        table.getColumn('new')?.setFilterValue(false);
        break;
      case 'sold':
        table.getColumn('status')?.setFilterValue('reserved');
        break;
      case 'otd':
        table.getColumn('status')?.setFilterValue('sold');
        break;
      case 'deposits':
        table.getColumn('status')?.setFilterValue('reserved');
        break;
      case 'customerOrders':
        table.getColumn('orderStatus')?.setFilterValue('WISH');
        break;
      case 'deliveredThisMonth':
        customerStateColumn?.setFilterValue('delivered');
        deliveredDate?.setFilterValue(getFirstDayOfCurrentMonth);
        status?.setFilterValue('active');
        break;
      case 'todaysDeliveries':
        pickUpDate?.setFilterValue(getToday);
        status?.setFilterValue('active');
        sold?.setFilterValue(sold && sold.length > 3);
        delivered?.setFilterValue(null)
        break;
      case 'tomorowsDeliveries':
        pickUpDate?.setFilterValue(getTomorrow);
        status?.setFilterValue('active');
        depositMade?.setFilterValue(depositMade && depositMade.length > 3);
        sold?.setFilterValue(sold && sold.length > 3);
        delivered?.setFilterValue(null)
        break;
      case 'yestDeliveries':
        pickUpDate?.setFilterValue(getYesterday);
        status?.setFilterValue('active');
        depositMade?.setFilterValue(depositMade && depositMade.length > 3);
        sold?.setFilterValue(sold && sold.length > 3);
        delivered?.setFilterValue(null)
        break;

      case 'deliveredThisYear':
        customerStateColumn?.setFilterValue('delivered');
        deliveredDate?.setFilterValue(getThisYear);
        status?.setFilterValue('active');
        break;
      case 'depositsToday':
        status?.setFilterValue('active');
        depositMade?.setFilterValue('on');
        sold?.setFilterValue('on');
        delivered?.setFilterValue('off')
        signed?.setFilterValue('off')
        financeApp?.setFilterValue('off')
        break;
      default:
        null;
    }
  }
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-indexed in JavaScript
    const day = String(date.getDate()).padStart(2, '0');
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };
  const formatMonth = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-indexed in JavaScript
    const day = String(date.getDate()).padStart(2, '0');
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}`;
  };

  const now = new Date(); // Current date and time
  const formattedDate = formatDate(now);
  function getToday() {
    const today = new Date();
    today.setDate(today.getDate());
    console.log(formatDate(today), 'today')
    return formatDate(today);
  }
  function getTomorrow() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return formatDate(tomorrow);
  }
  function getYesterday() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return formatDate(yesterday);
  }
  function getLastDayOfPreviousMonth() {
    const date = new Date();
    date.setDate(1); // sets the day to the last day of the previous month
    return formatMonth(date);
  }
  function getFirstDayOfCurrentMonth() {
    const date = new Date();
    date.setDate(1); // sets the day to the first day of the current month
    return formatDate(date);
  }
  function getFirstDayOfTwoMonthsAgo() {
    const date = new Date();
    date.setMonth(date.getMonth() - 2);
    date.setDate(1); // sets the day to the first day of the month two months ago
    return formatMonth(date);
  }
  function getYear() {
    const today = new Date();
    return today.getFullYear().toString();
  }
  const getThisYear = getYear();
  const navigate = useNavigate()
  return (
    <div className="w-[95%] mt-[15px] mx-auto">

      <div className="container mx-auto py-3">
        <div className="flex items-center py-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size='sm' variant="outline" className='mr-3' >Menu</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 border border-border bg-background text-foreground">
              <DropdownMenuLabel>Dashboard Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onSelect={() => setSelectedGlobal(true)}
                >
                  Global Filter
                </DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="cursor-pointer">
                    Default Filters
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent className="h-auto max-h-[175px] overflow-y-auto border border-border bg-background text-foreground">
                      <DropdownMenuLabel>
                        {todayfilterBy || "Default Filters"}
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {CallsList.map((item) => (
                        <DropdownMenuItem
                          onSelect={(event) => {
                            const value =
                              event.currentTarget.getAttribute("data-value");
                            const item =
                              CallsList.find((i) => i.key === value) ||
                              DeliveriesList.find((i) => i.key === value) ||
                              DepositsTakenList.find((i) => i.key === value);
                            if (item) {
                              handleFilterChange(item.key);
                              setTodayfilterBy(item.name);
                            }
                          }}
                          data-value={item.key}
                          textValue={item.key}
                        >
                          {item.name}
                        </DropdownMenuItem>
                      ))}

                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="cursor-pointer">
                    Global Filters
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent className="h-[350px] max-h-[350px] overflow-y-auto border border-border bg-background text-foreground">
                      {table
                        .getAllColumns()
                        .filter((column) => column.getCanHide())
                        .map((column) => (
                          <DropdownMenuItem
                            onSelect={(event) => {
                              setColumnFilterDropdown(event);
                            }}
                            data-value={column.id}
                            key={column.id}
                            className="cursor-pointer bg-background capitalize text-foreground  hover:text-primary hover:underline"
                          >
                            {column.id}
                          </DropdownMenuItem>
                        ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onSelect={() => {
                    setAllFilters([]);
                    setSelectedGlobal(false);
                  }}
                >
                  Clear
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onSelect={toggleFilter}
                >
                  Toggle All Columns
                </DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="cursor-pointer">
                    Column Toggle
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent className="h-[350px] max-h-[350px] overflow-y-auto border border-border bg-background text-foreground">
                      {table
                        .getAllColumns()
                        .filter((column) => column.getCanHide())
                        .map((column) => {
                          return (
                            <DropdownMenuCheckboxItem
                              key={column.id}
                              className="cursor-pointer bg-background  capitalize text-foreground"
                              checked={column.getIsVisible()}
                              onCheckedChange={(value) =>
                                column.toggleVisibility(!!value)
                              }
                            >
                              {column.id}
                            </DropdownMenuCheckboxItem>
                          );
                        })}
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          {userIsManager && (
            <AddUnitDialog />
          )}
          {selectedColumn && (
            <div className="relative flex-1 md:grow-0 ">

              <Input
                placeholder={`Filter ${selectedColumn}...`}
                onChange={(e) => handleGlobalChange(e.target.value)}
                className="ml-2 max-w-sm w-auto "
                autoFocus
              />
              <Button
                onClick={() => {
                  setAllFilters([]);
                  setSelectedGlobal(false);
                }}
                size="icon"
                variant="ghost"
                className='bg-transparent mr-2 absolute right-2.5 top-2.5 h-4 w-4 text-foreground '>

                <X />
              </Button>
            </div>
          )}
          {selectedGlobal === true && (
            <div className="relative flex-1 md:grow-0 ">
              <DebouncedInput
                value={globalFilter ?? ""}
                onChange={(value) => setGlobalFilter(String(value))}
                className="mx-1 ml-3 rounded-md border border-border bg-background p-2 text-foreground shadow max-w-sm w-auto"
                placeholder="Search all columns..." autoFocus
              />

              <Button
                onClick={() => {
                  setGlobalFilter([]);
                  setSelectedGlobal(false);
                }}
                size="icon"
                variant="ghost"
                className='bg-transparent mr-2 absolute right-2.5 top-2.5 h-4 w-4 text-foreground '>
                <X size={16} />
              </Button>
            </div>
          )}
          {referrer === '/dealer/manager/inventory' && (
            <Button size='sm' variant="outline" className='mr-3' onClick={() => {
              navigate(-1)
            }} >Back to Manager Dash</Button>
          )}

        </div>
        <div className="rounded-md border border-border    h-auto max-h-[600px] overflow-y-auto  ">
          <Table className='border border-border text-foreground bg-background'>
            <TableHeader className='border border-border text-muted-foreground bg-background'>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className='border-border'>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        {header.column.getCanFilter() && showFilter && (
                          <div className="sticky  z-5 mx-auto items-center justify-center cursor-pointer text-center ">
                            <Filter column={header.column} table={table} />
                          </div>
                        )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody className='border border-border text-foreground bg-background '>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className='border border-border text-foreground bg-background'
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center border border-border text-foreground bg-background">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>

          </Table>
        </div>
        <DataTablePagination table={table} />

      </div>
    </div>
  );
};


export const meta: MetaFunction = () => {
  return [
    { title: 'Unit Inventory || ADMIN || Dealer Sales Assistant' },
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



