import { Filter, DebouncedInput, invariant, type Payment, type TableMeta, defaultColumn, fuzzyFilter, fuzzySort } from '~/routes/leads.sales'
import React, { HTMLAttributes, HTMLProps, useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { Form, Link, useActionData, useLoaderData, useNavigation, useSubmit } from '@remix-run/react'
import { Input, Separator, Checkbox, PopoverTrigger, PopoverContent, Popover, DropdownMenuLabel, TextArea, DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuSeparator, Button, ScrollArea, Tabs, TabsList, TabsTrigger, TabsContent, Label } from "~/components/ui/index";
import { CaretSortIcon, ChevronDownIcon, DotsHorizontalIcon, } from "@radix-ui/react-icons"

import { getExpandedRowModel, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, getFacetedRowModel, getFacetedUniqueValues, getFacetedMinMaxValues, sortingFns } from "@tanstack/react-table";
import type {
  Table, Column, SortingFn, ColumnDef, ColumnFiltersState, SortingState, VisibilityState, FilterFn, ExpandedState, FilterFns,
} from "@tanstack/react-table";
import { toast } from "sonner"
import EditWishList from '~/components/dashboard/wishlist/WishListEdit';
import { Table as Table2, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "~/components/ui/table"
import { type LinksFunction, type DataFunctionArgs } from '@remix-run/node';
import { type RankingInfo, rankItem, compareItems, } from '@tanstack/match-sorter-utils'

// dashboard
import { DataTable } from "~/components/data-table"
import { type dashBoardType } from "~/components/dashboard/schema";
import { DataTableColumnHeader } from "~/components/dashboard/calls/header"
import ClientCard from '~/components/dashboard/calls/clientCard';
import ClientVehicleCard from '~/components/dashboard/calls/clientVehicleCard';
import EmailClient from '~/components/dashboard/calls/emailClient';
import ClientStatusCard from '~/components/dashboard/calls/ClientStatusCard';
import CompleteCall from '~/components/dashboard/calls/completeCall';
import TwoDaysFromNow from '~/components/dashboard/calls/2DaysFromNow';
import { dashboardAction, dashboardLoader } from "~/components/actions/dashboardCalls";
import { DocumentInputs } from '~/routes/dashboard.customer.$custId'
import IndeterminateCheckbox from "~/components/dashboard/calls/InderterminateCheckbox"
import { useRootLoaderData } from "~/hooks/use-root-loader-data";
import { ListSelection2 } from '~/routes/quoteUtils/listSelection'
import { ButtonLoading } from "~/components/ui/button-loading";

import AttemptedOrReached from "~/components/dashboard/calls/setAttOrReached";
import ContactTimesByType from "~/components/dashboard/calls/ContactTimesByType";
import LogCall from "~/components/dashboard/calls/logCall";
import Logtext from "~/components/dashboard/calls/logText";
import { Badge } from "~/ui/badge";
import { GetUser } from "~/utils/loader.server";
import { prisma } from "~/libs";
import { ArrowDownCircle, ArrowDownUp, ArrowRightCircle } from 'lucide-react';
import DnDResource from '~/routes/calendar.sales';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import Sidebar from "~/components/shared/sidebar";
// <Sidebar />
import { model } from "~/models";
import UnitPicker from '~/components/dashboard/unitPicker'
import NotificationSystem from "~/routes/notifications";
import FinanceTurnover from "~/components/dashboard/calls/financeTurnover";
import second from '~/styles/second.css'


export let loader = dashboardLoader

export let action = dashboardAction

export default function WishList() {
  const { user } = useLoaderData();
  const { getWishList } = useLoaderData();
  const data = getWishList
  type Payment = {
    id: string
    firstName: string
    lastName: string
    email: string
    phone: string
    model: number
    model2: string
    notes: string
    userId: string
  }
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [globalFilter, setGlobalFilter] = React.useState('')
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({ id: false, })
  const [rowSelection, setRowSelection] = React.useState({})

  const columns: ColumnDef<Payment>[] = [

    {
      accessorKey: "id",
      header: "Id",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("id")}</div>
      ),
    },
    {
      filterFn: 'fuzzy',
      sortingFn: fuzzySort,
      accessorKey: "firstName",
      header: ({ column }) => {
        return (
          <div className="mx-auto justify-center text-center lowercase">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              First Name
              <CaretSortIcon className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )

      },
      cell: ({ row }) => <div className="text-center  lowercase">
        {row.getValue("firstName")}
      </div>

    },

    {
      filterFn: 'fuzzy',
      sortingFn: fuzzySort,
      accessorKey: "lastName",
      header: ({ column }) => {
        return (
          <div className="mx-auto justify-center text-center lowercase">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Last Name
              <CaretSortIcon className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )
      },
      cell: ({ row }) => <div className="text-center  lowercase">
        {row.getValue("lastName")}
      </div>,
    },
    {
      filterFn: 'fuzzy',
      sortingFn: fuzzySort,
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <div className="mx-auto justify-center text-center lowercase">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Email
              <CaretSortIcon className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )
      },
      cell: ({ row }) => <div className="text-center lowercase">
        {row.getValue("email")}
      </div>,
    },
    {
      filterFn: 'fuzzy',
      sortingFn: fuzzySort,
      accessorKey: "phone",
      header: ({ column }) => {
        return (
          <div className="mx-auto justify-center text-center lowercase">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              phone #
              <CaretSortIcon className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )

      },
      cell: ({ row }) => <div className="text-center lowercase">
        {row.getValue("phone")}
      </div>,
    },
    {
      filterFn: 'fuzzy',
      sortingFn: fuzzySort,
      accessorKey: "model",
      header: ({ column }) => {
        return (
          <div className="mx-auto justify-center text-center lowercase">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Model
              <CaretSortIcon className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )
      },
      cell: ({ row }) => <div className="text-center lowercase">
        {row.getValue("model")}
      </div>,
    },
    {
      filterFn: 'fuzzy',
      sortingFn: fuzzySort,
      accessorKey: "model2",
      header: ({ column }) => {
        return (
          <div className="mx-auto justify-center text-center lowercase">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Model 2
              <CaretSortIcon className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )
      },
      cell: ({ row }) => <div className="text-center lowercase">
        {row.getValue("model2")}
      </div>,
    },
    {
      filterFn: 'fuzzy',
      sortingFn: fuzzySort,
      accessorKey: "wishListNotes",
      header: ({ column }) => {
        return (
          <div className="mx-auto justify-center text-center lowercase">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Notes
              <CaretSortIcon className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )
      },
      cell: ({ row }) => <div className="text-center lowercase">
        {row.getValue("wishListNotes")}
      </div>,
    },
    {
      accessorKey: "editWishlist",
      header: ({ column }) => (<p>Edit</p>),
      cell: ({ row }) => {
        const data = row.original
        return <>
          <div className=''>
            <EditWishList data={data} />

          </div>
        </>
      },
    },
    {
      accessorKey: "deletewishlist",
      header: ({ column }) => (<p>Delete</p>),
      cell: ({ row }) => {
        const data = row.original
        return <>
          <div className='mx-auto my-auto'>
            <Form method='post'>
              <input type='hidden' name='rowId' value={data.id} />

              <Button variant='outline' name='intent' value='deleteWishList' className="active:bg-black mx-auto my-auto h-7  cursor-pointer rounded bg-slate8 px-3 py-2  text-center text-xs  font-bold uppercase text-slate1 shadow outline-none  transition-all duration-150 ease-linear hover:border-[#02a9ff]  hover:text-[#02a9ff] hover:shadow-md focus:outline-none"
              >
                Delete
              </Button>
            </Form>
          </div>
        </>
      },
    },
  ]
  const table = useReactTable({
    data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),

    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  })

  const [models, setModels] = useState([]);

  const [filterBy, setFilterBy] = useState('');

  const handleInputChange = (name) => {
    setFilterBy(name);
  };
  // clears filters
  const setAllFilters = () => {
    setColumnFilters([]);
    setSorting([])
    setFilterBy('')
    setGlobalFilter('')
  };

  // toggle column filters
  const [showFilter, setShowFilter] = useState(false);

  const toggleFilter = () => {
    setShowFilter(!showFilter);
  };

  useEffect(() => {
    async function fetchModels() {
      const uniqueModels = [
        ...new Set(getWishList.map(wishList => wishList.model)),
        ...new Set(getWishList.map(wishList => wishList.model2)) // Add this line
      ];
      setModels(uniqueModels);
    }

    fetchModels();
  }, []);

  const handleDropdownChange = (event) => {
    setGlobalFilter(event.target.value);
  };


  const [brandId, setBrandId] = useState('');
  const [modelList, setModelList] = useState();
  const [brandId2, setBrandId2] = useState('');
  const [modelList2, setModelList2] = useState();

  const handleBrand = (e) => {
    setBrandId(e.target.value);
    console.log(brandId, modelList)
  };
  const handleBrand2 = (e) => {
    setBrandId(e.target.value);
    console.log(brandId, modelList)
  };

  useEffect(() => {
    async function getData() {
      const res = await fetch(`/api/modelList/${brandId}`);
      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }
      return res.json();
    }
    async function getData2() {
      const res = await fetch(`/api/modelList/${brandId}`);
      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }
      return res.json();
    }

    if (brandId.length > 3) {
      const fetchData = async () => {
        const result = await getData();
        setModelList(result);
        console.log(brandId, result); // Log the updated result
      };
      fetchData();
    }
    if (brandId2.length > 3) {
      const fetchData = async () => {
        const result = await getData2();
        setModelList2(result);
        console.log(brandId2, result); // Log the updated result
      };
      fetchData();
    }
  }, [brandId, brandId2]);

  return (
    <div className="mx-auto w-[95%] ">
      <div className="flex items-center py-4">
        <Input
          value={globalFilter ?? ''}
          onChange={event => setGlobalFilter(event.target.value)} className="font-lg border-block w-[400px] border border-[#878787] bg-white p-2 text-black shadow"
          placeholder="Search all columns..."
        />
        <Input
          placeholder={`Search phone # ...`}
          value={
            (table.getColumn('phone')?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn('phone')?.setFilterValue(event.target.value)
          }
          className="ml-2 max-w-sm border-[#878787] bg-white text-black"
        />



        <select value={filterBy} onChange={handleDropdownChange}
          className={`border-white text-black placeholder:text-blue-300  mx-auto ml-2  h-8 cursor-pointer rounded border bg-white px-2 text-xs uppercase shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]`}
        >
          <option value='' >Search By Model</option>
          {models.map((model, index) => (
            <option key={index} value={model}>
              {model}
            </option>
          ))}
        </select>
        <Button onClick={() => setAllFilters([])} name='intent' type='submit' variant='outline' className="active:bg-black  mx-2 my-auto h-7  cursor-pointer rounded bg-slate8 px-3 py-2  text-center text-xs  font-bold uppercase text-slate1 shadow outline-none  transition-all duration-150 ease-linear hover:border-[#02a9ff]  hover:text-[#02a9ff] hover:shadow-md focus:outline-none"
        >
          Clear
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant='outline' className="active:bg-black  mx-2 my-auto h-7  cursor-pointer rounded bg-slate8 px-3 py-2  text-center text-xs  font-bold uppercase text-slate1 shadow outline-none  transition-all duration-150 ease-linear hover:border-[#02a9ff]  hover:text-[#02a9ff] hover:shadow-md focus:outline-none"
            >
              Add
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-[#fff]">
            <DialogHeader>
              <DialogTitle>Wish List</DialogTitle>
              <DialogDescription>
                Add customer to wish list. Once sold, you can transfer to clients.
              </DialogDescription>
            </DialogHeader>
            <Form method='post' className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <input type='hidden' name='userId' value={user.id} />
                <Label htmlFor="name" className="text-right">
                  First Name
                </Label>
                <Input
                  name="firstName"
                  placeholder="Pedro "
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Last Name
                </Label>
                <Input
                  name="lastName"
                  placeholder="Duarte"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Email
                </Label>
                <Input
                  name="email"
                  placeholder="pedroduarte@gmail.com"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Phone
                </Label>
                <Input
                  name="phone"
                  placeholder="613-613-6134"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Brand
                </Label>
                <Input
                  className=" col-span-3"
                  placeholder="Brand (required)"
                  type="text"
                  list="ListOptions1"
                  name="brand"
                  onChange={handleBrand}
                />
                <datalist id="ListOptions1">
                  <option value="BMW-Motorrad" />
                  <option value="Can-Am" />
                  <option value="Can-Am-SXS" />
                  <option value="Harley-Davidson" />
                  <option value="Indian" />
                  <option value="Kawasaki" />
                  <option value="KTM" />
                  <option value="Manitou" />
                  <option value="Sea-Doo" />
                  <option value="Switch" />
                  <option value="Ski-Doo" />
                  <option value="Suzuki" />
                  <option value="Triumph" />
                  <option value="Spyder" />
                  <option value="Yamaha" />
                </datalist>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Model
                </Label>
                {modelList && (
                  <>
                    <Input className=" col-span-3" placeholder="Model" type="text" list="ListOptions2" name="model" />
                    <datalist id="ListOptions2">
                      {modelList.models.map((item, index) => (
                        <option key={index} value={item.model} />
                      ))}
                    </datalist>
                  </>
                )}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Brand 2
                </Label>
                <Input
                  className=" col-span-3"
                  placeholder="Brand (required)"
                  type="text"
                  list="ListOptions2"
                  name="brand2"
                  onChange={handleBrand2}
                />
                <datalist id="ListOptions2">
                  <option value="BMW-Motorrad" />
                  <option value="Can-Am" />
                  <option value="Can-Am-SXS" />
                  <option value="Harley-Davidson" />
                  <option value="Indian" />
                  <option value="Kawasaki" />
                  <option value="KTM" />
                  <option value="Manitou" />
                  <option value="Sea-Doo" />
                  <option value="Switch" />
                  <option value="Ski-Doo" />
                  <option value="Suzuki" />
                  <option value="Triumph" />
                  <option value="Spyder" />
                  <option value="Yamaha" />
                </datalist>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Model 2
                </Label>
                {modelList2 && (
                  <>
                    <Input className=" col-span-3" placeholder="Model" type="text" list="ListOptions3" name="model2" />
                    <datalist id="ListOptions3">
                      {modelList2.models.map((item, index) => (
                        <option key={index} value={item.model} />
                      ))}
                    </datalist>
                  </>
                )}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Notes
                </Label>
                <Input
                  name="wishListNotes"
                  placeholder="wants less than 50k kms"
                  className="col-span-3"
                />
              </div>
              <Button onClick={() => toast.success(`Added to wish list!`)}
                type='submit' name='intent' value='addWishList' variant='outline' className="active:bg-black w-[75px] mt-10 mx-2 my-auto h-7  cursor-pointer rounded bg-slate8 px-3 py-2  text-center text-xs  font-bold uppercase text-slate1 shadow outline-none  transition-all duration-150 ease-linear hover:border-[#02a9ff]  hover:text-[#02a9ff] hover:shadow-md focus:outline-none"
              >
                Save
              </Button>
            </Form>

          </DialogContent>
        </Dialog>

      </div>
      <div className="rounded-md border border-[#3b3b3b] ">
        <Table2 className='w-full overflow-x-auto border-[#3b3b3b] text-slate1'>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className=' border-[#3b3b3b]'>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead className='items-center ' key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      {header.column.getCanFilter() && showFilter && (
                        <div className="mx-auto cursor-pointer items-center justify-center border-[#3b3b3b] text-center">
                          <Filter column={header.column} table={table} />
                        </div>
                      )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className='cursor-pointer border-[#3b3b3b] bg-slate8 p-4 capitalize text-slate1 hover:text-[#02a9ff]'
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell className='justify-center' key={cell.id}>
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
                  className="h-24 cursor-pointer bg-slate8 text-center capitalize text-slate1 hover:text-[#02a9ff]"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table2>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">

        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="border-slate1 text-slate1"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            className="border-slate1 text-slate1"

            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
