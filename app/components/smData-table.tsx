"use client";
import { Button, Input, Separator, Checkbox, PopoverTrigger, PopoverContent, Popover, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator, } from "~/components/ui/index";
import React, { useMemo, useEffect, useState, useRef, Suspense } from "react";
import { ScrollArea } from "~/components/ui/scroll-area";
import { type ColumnDef, flexRender, getCoreRowModel, useReactTable, getPaginationRowModel, type SortingState, getSortedRowModel, sortingFns, SortingFn, FilterFns, FilterFn, type VisibilityState, getFilteredRowModel, type ColumnFiltersState, } from "@tanstack/react-table";
import { DataTablePagination } from "~/components/dashboard/calls/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "~/components/ui/table";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuGroup, DropdownMenuPortal, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger, } from "~/components/ui/dropdown-menu";
import { Form, Link, useFetcher, useLoaderData, useTransition, Await } from "@remix-run/react";
import AddCustomer from "~/components/dashboard/calls/addCustomer";
import Filter from "~/components/dashboard/calls/Filter";
import { CalendarCheck, Search, MailWarning } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import SmClientCard from "./dashboard/calls/smClientCard";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  dashData: TData[];
}

export function SmDataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {


  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      id: false,
      completeCall: false,
      pickUpDate: false,
      lastContact: false,
      contactTimesByType: false,
      oth60WOptions: false,
      status: false,
      nextAppointment: false,
      customerState: false,
      contact: false,
      tradeDesc: false,
      followUpDay: false,
      twoDaysFromNow: false,
      weeklyOthWOptions: false,
      weeklylNatWOptions: false,
      biweekOthWOptions: false,
      desiredPayments: false,
      clientfileId: false,
      commodity: false,
      msrp: false,
      turnover: false,
      unitPicker: false,
      painPrem: false,
      freight: false,
      biweeklNatWOptions: false,
      nat60WOptions: false,
      deliveredDate: false,
      licensing: false,
      pdi: false,
      admin: false,
      accessories: false,
      labour: false,
      trailer: false,
      weeklyOth: false,
      biweekOth: false,
      months: false,
      depositMade: false,
      oth60: false,
      weeklylNat: false,
      on60: false,
      iRate: false,
      biweeklNat: false,
      nat60: false,
      biweekly: false,
      weeklyqc: false,
      biweeklyqc: false,
      weekly: false,
      qc60: false,
      financeId: false,
      province: false,
      userEmail: false,
      postal: false,
      address: false,
      city: false,
      phone: false,
      result: false,
      email: false,
      referral: false,
      visited: false,
      bookedApt: false,
      aptShowed: false,
      aptNoShowed: false,
      testDrive: false,
      metService: false,
      metManager: false,
      metParts: false,
      sold: false,
      contactMethod: false,
      refund: false,
      turnOver: false,
      financeApp: false,
      approved: false,
      signed: false,
      pickUpSet: false,
      demoed: false,
      delivered: false,
      tradeMake: false,
      tradeYear: false,
      tradeTrim: false,
      tradeColor: false,
      tradeVin: false,
      timesContacted: false,
      visits: false,
      financeApplication: false,
      progress: false,
      metFinance: false,
      metSalesperson: false,
      seenTrade: false,
      docsSigned: false,
      tradeRepairs: false,
      dl: false,
      timeOfDay: false,
      timeToContact: false,
      typeOfContact: false,
      discount: false,
      pickUpTime: false,
      total: false,
      onTax: false,
      deliveryCharge: false,
      userLoanProt: false,
      userTireandRim: false,
      userGap: false,
      userExtWarr: false,
      userServicespkg: false,
      vinE: false,
      lifeDisability: false,
      rustProofing: false,
      userOther: false,
      deposit: false,
      paintPrem: false,
      discountPer: false,
      qcTax: false,
      otherTax: false,
      totalWithOptions: false,
      otherTaxWithOptions: false,
      stockNum: false,
      model1: false,
      note: false,
      color: false,
      modelCode: false,
      lastNote: false,
      documentUpload: false,
      tradeValue: false,
      singleFinNote: false,
    });

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState({})

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    enableRowSelection: true,
    // enableRowSelection: row => row.original.age > 18, // or enable row selection conditionally per row
    onRowSelectionChange: setRowSelection,

    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const [filterBy, setFilterBy] = useState('');

  const handleInputChange = (name) => {
    setFilterBy(name);
  };

  function MassEmail() {

    return (
      <>

      </>
    )
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
  //console.log(formattedDate); // Output: "Wed, Nov 02, 2023, 09:05 AM"

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


  const [todayfilterBy, setTodayfilterBy] = useState(null);

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

  const CallsList = [
    {
      key: "pendingCalls",
      name: "Pending Calls",
    },
    {
      key: "todaysCalls",
      name: "Today's Calls",
    },
    {
      key: "tomorowsCalls",
      name: "Tomorrow's Calls",
    },
    {
      key: "yestCalls",
      name: "Yesterday's if missed",
    },
    {
      key: "missedCalls",
      name: "Missed Calls - Current Month",
    },
    {
      key: "missedCallsLastMonth",
      name: "Missed Calls - Last Month",
    },
    {
      key: "missedCallsTwoMonths",
      name: "Missed Calls - 2 Months Ago",
    },
    {
      key: "missedCallsYear",
      name: "Missed Calls - Year",
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

    if (selectedFilter === "deliveredThisMonth") {
      customerStateColumn?.setFilterValue('delivered');
      deliveredDate?.setFilterValue(getFirstDayOfCurrentMonth);
      status?.setFilterValue('active');

    }

    if (selectedFilter === "deliveredLastMonth") {
      customerStateColumn?.setFilterValue('delivered');
      deliveredDate?.setFilterValue(getLastDayOfPreviousMonth);
      status?.setFilterValue('active');
    }

    if (selectedFilter === "deliveredThisYear") {
      customerStateColumn?.setFilterValue('delivered');
      deliveredDate?.setFilterValue(getThisYear);
      status?.setFilterValue('active');
    }

    if (selectedFilter === "pendingCalls") {
      customerStateColumn?.setFilterValue('Pending');
      status?.setFilterValue('active');
    }

    if (selectedFilter === "todaysCalls") {
      nextAppointmentColumn?.setFilterValue(getToday);
      console.log(nextAppointmentColumn, 'nextAppointmentColumn')
      status?.setFilterValue('active');
      depositMade?.setFilterValue('off');
      sold?.setFilterValue('off');
      delivered?.setFilterValue('off')
    }

    if (selectedFilter === "tomorowsCalls") {
      nextAppointmentColumn?.setFilterValue(getTomorrow);
      status?.setFilterValue('active');
      depositMade?.setFilterValue('off');
      sold?.setFilterValue('off');
      delivered?.setFilterValue('off')
    }

    if (selectedFilter === "yestCalls") {
      nextAppointmentColumn?.setFilterValue(getYesterday);
      status?.setFilterValue('active');
      depositMade?.setFilterValue('off');
      sold?.setFilterValue('off');
      delivered?.setFilterValue('off')
    }

    if (selectedFilter === "missedCalls") {
      nextAppointmentColumn?.setFilterValue(getFirstDayOfCurrentMonth);
      status?.setFilterValue('active');
      depositMade?.setFilterValue('off');
      sold?.setFilterValue('off');
      delivered?.setFilterValue('off')
    }

    if (selectedFilter === "missedCallsLastMonth") {
      nextAppointmentColumn?.setFilterValue(getLastDayOfPreviousMonth);
      status?.setFilterValue('active');
      depositMade?.setFilterValue('off');
      sold?.setFilterValue('off');
      delivered?.setFilterValue('off')
    }

    if (selectedFilter === "missedCallsTwoMonths") {
      nextAppointmentColumn?.setFilterValue(getFirstDayOfTwoMonthsAgo);
      status?.setFilterValue('active');
      depositMade?.setFilterValue('off');
      sold?.setFilterValue('off');
      delivered?.setFilterValue('off')
    }

    if (selectedFilter === "missedCallsYear") {
      nextAppointmentColumn?.setFilterValue(getThisYear);
      status?.setFilterValue('active');
      depositMade?.setFilterValue('off');
      sold?.setFilterValue('off');
      delivered?.setFilterValue('off')
    }

    if (selectedFilter === "todaysDeliveries") {
      pickUpDate?.setFilterValue(getToday);
      status?.setFilterValue('active');
      sold?.setFilterValue('on');
      delivered?.setFilterValue('off')
    }

    if (selectedFilter === "tomorowsDeliveries") {
      pickUpDate?.setFilterValue(getTomorrow);
      status?.setFilterValue('active');
      depositMade?.setFilterValue('on');
      sold?.setFilterValue('on');
      delivered?.setFilterValue('off')
    }

    if (selectedFilter === "yestDeliveries") {
      pickUpDate?.setFilterValue(getYesterday);
      status?.setFilterValue('active');
      depositMade?.setFilterValue('on');
      sold?.setFilterValue('on');
      delivered?.setFilterValue('off')
    }

    if (selectedFilter === "depositsToday") {
      status?.setFilterValue('active');
      depositMade?.setFilterValue('on');
      sold?.setFilterValue('on');
      delivered?.setFilterValue('off')
      signed?.setFilterValue('off')
      financeApp?.setFilterValue('off')
    }
  };

  // clears filters
  const setAllFilters = () => {
    setColumnFilters([]);
    setSorting([])
    setFilterBy('')
  };

  // toggle column filters
  const [showFilter, setShowFilter] = useState(false);

  const toggleFilter = () => {
    setShowFilter(!showFilter);
  };
  //
  // </ClientOnly>

  //defaultValue={todayfilterBy}>
  return (
    <div className="mb-[20px]  even:bg-background  rounded overflow-x-hidden   justify-center">
      <div className="flex items-center">
        <DropdownMenu>
          <DropdownMenuTrigger  >
            <Button variant="outline">Menu</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-background text-foreground">
            <DropdownMenuLabel>Tabs</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <a href='/dealer/leads/sales/dashboard' >
                <DropdownMenuItem className="cursor-pointer">
                  Sales Dashboard
                </DropdownMenuItem>
              </a>
              <a href='/dealer/leads/sales/newLeads' >
                <DropdownMenuItem className="cursor-pointer">
                  New Leads
                </DropdownMenuItem>
              </a>
              <a href='/dealer/leads/sales/search' >
                <DropdownMenuItem className="cursor-pointer">
                  Search
                </DropdownMenuItem>
              </a>
              <a href='/dealer/leads/sales/wishList' >
                <DropdownMenuItem className="cursor-pointer">
                  Wish List
                </DropdownMenuItem>
              </a>
              <a href='/dealer/leads/sales/demoDay' >
                <DropdownMenuItem className="cursor-pointer">
                  Demo Day
                </DropdownMenuItem>
              </a>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>Dashboard</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>{todayfilterBy || "Default Filters"}</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className='bg-background  max-h-[300px] h-[300px] w-[200px] overflow-y-scroll p-4'
                    onValueChange={(value) => {
                      const item = CallsList.find(i => i.key === value) || DeliveriesList.find(i => i.key === value) || DepositsTakenList.find(i => i.key === value);
                      if (item) {
                        handleFilterChange(item.key);
                        setTodayfilterBy(item.name);
                      }
                    }}>
                    {CallsList.map((item) => (
                      <DropdownMenuItem className="cursor-pointer" value={item.key}>{item.name}</DropdownMenuItem>
                    ))}
                    {DeliveriesList.map((item) => (
                      <DropdownMenuItem className="cursor-pointer" value={item.key}>{item.name}</DropdownMenuItem>
                    ))}
                    {DepositsTakenList.map((item) => (
                      <DropdownMenuItem className="cursor-pointer" value={item.key}>{item.name}</DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger> Global Filter</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className='bg-background  max-h-[300px] h-[300px] w-[200px] overflow-y-scroll p-4'>
                    {table.getAllColumns().filter((column) => column.getCanHide()).map((column) => (
                      <DropdownMenuItem key={column.id} value={column.id} className="    capitalize cursor-pointer   ">
                        {column.id}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuItem className="cursor-pointer" onClick={() => setAllFilters([])}>
                Clear
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={toggleFilter}>
                Toggle Searchable Columns
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="cursor-pointer">Toggle Columns</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className='bg-background max-h-[300px] h-[300px] w-[200px] overflow-y-scroll p-4'>
                  {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => {
                      return (
                        <DropdownMenuCheckboxItem
                          key={column.id}
                          className="bg-background capitalize  cursor-pointer"
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
            <DropdownMenuItem className="cursor-pointer">
              <AddCustomer />
            </DropdownMenuItem>
            <a href='/dealer/calendar/sales'>
              <DropdownMenuItem className="cursor-pointer">
                Calendar
              </DropdownMenuItem>
            </a>
          </DropdownMenuContent>
        </DropdownMenu>
        {filterBy && (
          <Input
            placeholder={`Filter ${filterBy} ...`}
            value={
              (table.getColumn(filterBy)?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn(filterBy)?.setFilterValue(event.target.value)
            }
            className="ml-2 max-w-sm "
          />
        )}
      </div >
      <div className="mt-[20px] rounded-md  border border-border text-foreground">
        <Table className="rounded-md overflow-x-auto border-border">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className=' border-border'>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      <>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        {header.column.getCanFilter() && showFilter && (
                          <div className="mx-auto items-center justify-center cursor-pointer text-center ">
                            <Filter column={header.column} table={table} />
                          </div>
                        )}
                      </>
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="overflow-x-auto border-border">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={`p-4 text-foreground bg-background border-border capitalize cursor-pointer  ${index % 2 === 0 ? 'bg-background' : 'bg-background'}`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-foreground bg-background capitalize cursor-pointer hover:text-primary"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div >
  );
}
function SimplerStaticVersion() {
  return (
    <p>Not working contact support...</p>
  )
}
function Loading() {
  return (
    <ul>
      {Array.from({ length: 12 }).map((_, i) => (
        <li key={i}>
          <div className="spinner" />
        </li>
      ))}
    </ul>
  )
}
/*const FilterForm = ({ column }) => {
    const { filterValue, setFilter } = column;
    return (
        <span>
            <input
                value={filterValue || ''}
                onChange={(e) => setFilter(e.target.value)}
            />
        </span>
    );
};

export default FilterForm;
*/

