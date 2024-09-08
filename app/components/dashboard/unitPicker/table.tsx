import {
  ColumnFiltersState,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getGroupedRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  GroupingState,
  SortingState,
  useReactTable,
  VisibilityState,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import React, { useState, useEffect } from "react";
import useSWR, { SWRConfig, mutate, useSWRConfig } from "swr";
import {
  Await,
  Form,
  Link,
  useActionData,
  useFetcher,
  useLoaderData,
  useLocation,
  useNavigation,
  useSubmit,
} from "@remix-run/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "~/components/ui/dropdown-menu";
import {
  Button,
  Input,
  Separator,
  Checkbox,
  PopoverTrigger,
  PopoverContent,
  Popover,
} from "~/components/ui/index";
import { X } from "lucide-react";
import {
  CalendarCheck,
  Search,
  MailWarning,
  UserPlus,
  MessageSquare,
  Mail,
} from "lucide-react";
import { DataTablePagination } from "~/components/dashboard/calls/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons";
import { DataTable } from "./components/data-table"
import { columns } from "./components/columns"
import { fuzzyFilter } from "~/components/shared/shared";
import { toast } from "sonner"

async function getData() {
  const res = await fetch('/dealer/api/dashboard/inventory/moto')
  console.log(res, 'intable')
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
}

export const StockUnit = ({ tableData, finance }) => {
  const [data, setPaymentData,] = useState(tableData);

  useEffect(() => {
    const data = async () => {
      const result = await getData();
      console.log(result, 'tabledata')

      setPaymentData(result);
    };
    data()
  }, []);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
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
    consignment: false,
  });
  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = useState(finance.model.split(' ').pop())
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [selectedModel, setSelectedModel] = useState({})

  const [selectedColumn, setSelectedColumn] = useState("");
  const [selectedGlobal, setSelectedGlobal] = useState(false);
  const [todayfilterBy, setTodayfilterBy] = useState(null);

  const table = useReactTable({
    data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    globalFilterFn: 'fuzzy',

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
  const submit = useSubmit();
  const fetcher = useFetcher();

  // clears filters
  const setAllFilters = () => {
    setColumnFilters([]);
    setSorting([]);
    setFilterBy("");
    setGlobalFilter([]);
  };
  const toggleFilter = () => {
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
    const newColumn = table.getColumn('isNew');
    const status = table.getColumn('status');
    switch (selectedFilter) {
      case 'inStock':
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
      default:
        null;
    }
  }
  return (
    <div className="w-[98%]">
      <div className="flex items-center py-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" >Menu</Button>
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
                  <DropdownMenuSubContent className="h-[350px] max-h-[350px] overflow-y-auto border border-border bg-background text-foreground">
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
        {selectedColumn && (
          <Input
            placeholder={`Filter ${selectedColumn}...`}
            onChange={(e) => handleGlobalChange(e.target.value)}
            className="ml-2 max-w-sm "
          />
        )}
        {selectedGlobal === true && (
          <div className="relative ">
            <DebouncedInput
              value={globalFilter ?? ""}
              onChange={(value) => setGlobalFilter(String(value))}
              className="mx-1 rounded-md border border-border bg-background p-2 text-foreground shadow "
              placeholder="Search all columns..."
            />
            <label className=" scale-80 absolute -top-3 right-3 rounded-full  bg-transparent px-2 text-sm transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">
              <Button
                onClick={() => {
                  setGlobalFilter([]);
                  setSelectedGlobal(false);
                }}
                size="icon"
                variant="ghost"
                className="hover:bg-transparent"
              >
                <X />
              </Button>
            </label>
          </div>
        )}
        <Button
          variant="outline"
          className='ml-3'
          onClick={() => {
            const unit = table.getSelectedRowModel().flatRows[0]
            console.info('table.getSelectedRowModel().flatRows', unit, unit.original.year, unit.original.stockNumber)

            setSelectedModel(unit);
            const formData = new FormData();
            formData.append("stockNum", unit.original.stockNumber);
            formData.append("stocked", unit.original.stocked);
            formData.append("isNew", unit.original.isNew);
            formData.append("invId", unit.original.id);
            formData.append("financeId", finance.id);
            formData.append("year", unit.original.year);
            formData.append("color", unit.original.color);
            formData.append("model1", unit.original.modelName);
            formData.append("model", unit.original.model);
            formData.append("vin", unit.original.vin);
            formData.append("bikeStatus", unit.original.status);
            formData.append("location", unit.original.location);
            formData.append("make", unit.original.make);
            formData.append("modelName", unit.original.modelName);
            formData.append("color", unit.original.exteriorColor);
            formData.append("msrp", unit.original.price);
            formData.append("mileage", unit.original.mileage);
            formData.append("expectedOn", unit.original.expectedOn);
            formData.append("orderStatus", unit.original.orderStatus);
            formData.append("age", unit.original.age);
            formData.append("isNew", unit.original.isNew);
            formData.append("keyNumber", unit.original.keyNumber);
            formData.append("onOrder", unit.original.onOrder);
            formData.append("intent", 'updateFinanceWanted');
            submit(formData, { method: "post" });
            toast.message('Unit has been saved to contract.', {
              description: `${finance.firstName}, ${finance.lastName}`,
            })
          }}
        >Assign Unit</Button>
      </div>
      <div className="container mx-auto py-10">
        <div className="rounded-md border">
          <Table className='border border-border text-foreground bg-background'>
            <TableHeader className='border border-border text-muted-foreground bg-background'>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className='border border-border text-foreground bg-background'>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
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
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
};

export default StockUnit;
