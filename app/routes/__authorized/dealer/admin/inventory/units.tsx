import type { LoaderArgs, } from "@remix-run/node";
import { Input, Separator, PopoverTrigger, PopoverContent, Popover, TextArea, Button, ScrollArea, Tabs, TabsList, TabsTrigger, TabsContent, Label, Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "~/components/ui/index";
import * as React from "react"
import { ColumnDef, ColumnFiltersState, FilterFn, SortingState, VisibilityState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, sortingFns, } from "@tanstack/react-table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger, } from "~/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "~/components/ui/table"
import { useEffect, useState } from "react";
import { Form, useLoaderData, useSubmit, useFetcher, useNavigate } from "@remix-run/react";
import { getSession } from "~/sessions/auth-session.server";
import { prisma } from "~/libs";
import { type MetaFunction, redirect, type LoaderFunctionArgs, json, ActionFunction } from '@remix-run/node'
import { GetUser } from "~/utils/loader.server";
import { fuzzyFilter, fuzzySort, TableMeta, getTableMeta, DebouncedInput } from "~/components/actions/shared";
import { Cross2Icon, CaretSortIcon, ChevronDownIcon, DotsHorizontalIcon, } from "@radix-ui/react-icons";
import IndeterminateCheckbox, { EditableText, Filter } from '~/components/actions/shared'
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


function Consignment({ data }) {
  const fetcher = useFetcher();

  return (
    <Select
      onValueChange={(value) => {
        const formData = new FormData();
        formData.append("id", data.id);
        formData.append("consignment", value);
        formData.append("intent", 'consignment');
        console.log(formData, 'formData');
        fetcher.submit(formData, { method: "post" });
      }}
      defaultValue={data.consignment || false}
      name='consignment'>
      <SelectTrigger className="w-auto focus:border-primary">
        <SelectValue defaultValue={data.consignment || false} />
      </SelectTrigger>
      <SelectContent className='bg-background text-foreground border-border'>
        <SelectItem value="true">true</SelectItem>
        <SelectItem value="false">false</SelectItem>
      </SelectContent>
    </Select>
  )
}
function OnOrder({ data }) {
  const fetcher = useFetcher();

  return (
    <Select
      defaultValue={String(data.onOrder)}
      onValueChange={(value) => {
        const formData = new FormData();
        formData.append("id", data.id);
        formData.append("onOrder", value);
        formData.append("intent", 'onOrder');
        console.log(formData, 'formData');
        fetcher.submit(formData, { method: "post" });
      }}
      name='onOrder'>
      <SelectTrigger className="w-auto focus:border-primary" >
        <SelectValue />
      </SelectTrigger>
      <SelectContent className='bg-background text-foreground border-border'>
        <SelectItem value="true">true</SelectItem>
        <SelectItem value="false">false</SelectItem>
      </SelectContent>
    </Select>
  )
}
function Sold({ data }) {
  const fetcher = useFetcher();

  return (
    <Select
      onValueChange={(value) => {
        const formData = new FormData();
        formData.append("id", data.id);
        formData.append("sold", value);
        formData.append("intent", 'sold');
        console.log(formData, 'formData');
        fetcher.submit(formData, { method: "post" });
      }}
      defaultValue={String(data.isNew)}
      name='sold'>
      <SelectTrigger className="w-auto focus:border-primary">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className='bg-background text-foreground border-border'>
        <SelectItem value="true">true</SelectItem>
        <SelectItem value="false">false</SelectItem>
      </SelectContent>
    </Select>
  )
}
function Status({ data }) {
  const fetcher = useFetcher();

  return (
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
      <SelectTrigger className="w-auto focus:border-primary">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className='bg-background text-foreground border-border'>
        <SelectItem value="Available">Available</SelectItem>
        <SelectItem value="Reserved">Reserved</SelectItem>
      </SelectContent>
    </Select>
  )
}
function OrderStatus({ data }) {
  const fetcher = useFetcher();

  return (
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
      <SelectTrigger className="w-auto focus:border-primary">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className='bg-background text-foreground border-border'>
        <SelectItem value="On Order">On Order</SelectItem>
        <SelectItem value="Stock">Stock</SelectItem>
        <SelectItem value="Reserved">Reserved</SelectItem>
        <SelectItem value="Wish">Wish</SelectItem>
      </SelectContent>
    </Select>
  )
}
function IsNew({ data }) {
  const fetcher = useFetcher();

  return (
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
      <SelectTrigger className="w-auto focus:border-primary">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className='bg-background text-foreground border-border'>
        <SelectItem value="true">true</SelectItem>
        <SelectItem value="false">false</SelectItem>
      </SelectContent>
    </Select>
  )
}
function Stocked({ data }) {
  const fetcher = useFetcher();

  return (
    <Select
      onValueChange={(value) => {
        const formData = new FormData();
        formData.append("id", data.id);
        formData.append("stocked", value);
        formData.append("intent", 'stocked');
        console.log(formData, 'formData');
        fetcher.submit(formData, { method: "post" });
      }}
      defaultValue={data.stocked}
      name='Stocked'>
      <SelectTrigger className="w-auto focus:border-primary">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className='bg-background text-foreground border-border'>
        <SelectItem value="true">true</SelectItem>
        <SelectItem value="false">false</SelectItem>
      </SelectContent>
    </Select>
  )
}

export const loader = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")
  const user = await GetUser(email)
  if (!user) { redirect('/login') }
  const inventoryMotorcycle = await prisma.inventoryMotorcycle.findMany({})

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
    const update = await prisma.columnStateInventory.update({
      where: { id: user.ColumnStateInventory.id },
      data: { state: JSON.parse(formPayload.state) }
    })
    return json({ update })
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

export default function UnitInv() {
  const { inventoryMotorcycle, user } = useLoaderData()
  const [data, setPaymentData,] = useState(inventoryMotorcycle);
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

  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = useState('')
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [selectedModel, setSelectedModel] = useState({})
  const [filterBy, setFilterBy] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState("");
  const [selectedGlobal, setSelectedGlobal] = useState(false);
  const [todayfilterBy, setTodayfilterBy] = useState(null);

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
      id: 'select',
      header: ({ table }) => (
        <IndeterminateCheckbox
          checked={table.getIsAllRowsSelected()}
          indeterminate={table.getIsSomeRowsSelected()}
          onChange={table.getToggleAllRowsSelectedHandler()}
          className='border-primary mx-auto'
        />
      ),
      cell: ({ row }) => (
        <div className="px-1">
          <IndeterminateCheckbox
            checked={row.getIsSelected()}
            indeterminate={row.getIsSomeSelected()}
            onChange={row.getToggleSelectedHandler()}
            className='border-primary mx-auto'
          />
        </div>
      ),
    },
    {
      id: 'Unit File',
      accessorKey: "Unit File",
      filterFn: 'fuzzy',
      sortingFn: fuzzySort,

      cell: ({ row, column: { id } }) => {
        const data = row.original
        return (
          <UnitDialog data={data} user={user} />
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
          <UnitDialog data={data} />
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
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Model
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        )
      },

    },
    {
      filterFn: fuzzyFilter,
      sortingFn: fuzzySort,
      accessorKey: "modelName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Model Name
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        )
      },

    },
    {
      filterFn: fuzzyFilter,
      sortingFn: fuzzySort,
      accessorKey: "submodel",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Sub Model
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
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
    { title: 'Admin - Dealer Sales Assistant' },
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
