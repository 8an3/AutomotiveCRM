import { Filter, DebouncedInput, invariant, type Payment, type TableMeta, defaultColumn, fuzzyFilter, fuzzySort } from '~/routes/__authorized/dealer/leads/sales'
import React, { HTMLAttributes, HTMLProps, useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { Form, Link, useActionData, useLoaderData, useNavigation, useSubmit } from '@remix-run/react'
import { Input, Separator, Checkbox, PopoverTrigger, PopoverContent, Popover, DropdownMenuLabel, TextArea, DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuSeparator, Button, ScrollArea, Tabs, TabsList, TabsTrigger, TabsContent, Label, Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/index";
import { CaretSortIcon, ChevronDownIcon, DotsHorizontalIcon, } from "@radix-ui/react-icons"

import { getExpandedRowModel, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, getFacetedRowModel, getFacetedUniqueValues, getFacetedMinMaxValues, sortingFns } from "@tanstack/react-table";
import type {
  Table, Column, SortingFn, ColumnDef, ColumnFiltersState, SortingState, VisibilityState, FilterFn, ExpandedState, FilterFns,
} from "@tanstack/react-table";
import { toast } from "sonner"
import EditWishList from '~/components/dashboard/wishlist/WishListEdit';
import { Table as Table2, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "~/components/ui/table"

import { dashboardAction, dashboardLoader } from "~/components/actions/dashboardCalls";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import { Save, FilePlus, Trash2 } from 'lucide-react';

export let loader = dashboardLoader

export let action = dashboardAction

export default function WishList() {
  const { user } = useLoaderData();
  const { getWishList } = useLoaderData();
  const [data, setData] = useState(getWishList)
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [wishListNotes, setWishListNotes] = useState("");
  const [notified, setNotified] = useState("");
  const submit = useSubmit()

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

    },
    {
      filterFn: 'fuzzy',
      sortingFn: fuzzySort,
      accessorKey: "setNotified",
      header: ({ column }) => {
        return (
          <div className="mx-auto justify-center text-center lowercase">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Edit Contacted
              <CaretSortIcon className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )
      },
      cell: ({ row }) => {
        const data = row.original
        return (
          <>
            <Form method="post" onChange={(event) => { submit(event.currentTarget); }} >
              <input type='hidden' name='id' defaultValue={data.id} />
              <input type='hidden' name='intent' defaultValue='editWishList' />
              <Select name='notified' >
                <SelectTrigger className="w-full mx-auto bg-[#09090b] border-[#27272a]">
                  <SelectValue placeholder='Edit Contacted' />
                </SelectTrigger>
                <SelectContent className='bg-[#09090b] border-[#27272a] text-[#fafafa]'>
                  <SelectGroup>
                    <SelectItem value="yes" className='hover:bg-[#232324] w-[90%] cursor-pointer rounded-md'>Yes</SelectItem>
                    <SelectItem value="no answer" className='hover:bg-[#232324] w-[90%] cursor-pointer rounded-md'>No Answer</SelectItem>
                    <SelectItem value="LVM" className='hover:bg-[#232324] w-[90%] cursor-pointer rounded-md'>LVM</SelectItem>
                    <SelectItem value="no" className='hover:bg-[#232324] w-[90%] cursor-pointer rounded-md'>No</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Form>
          </>
        )
      }
    },
    {
      id: "edit",
      enableHiding: false,
      cell: ({ row }) => {
        const data = row.original
        return (
          <>
            <Form method='post'>
              <input type='hidden' name='id' defaultValue={data.id} />
              <input type='hidden' name='userId' defaultValue={user.id} />
              <input type='hidden' name='firstName' defaultValue={firstName || data.firstName} />
              <input type='hidden' name='lastName' defaultValue={lastName || data.lastName} />
              <input type='hidden' name='phone' defaultValue={phone || data.phone} />
              <input type='hidden' name='notified' defaultValue={notified || data.notified} />
              <input type='hidden' name='email' defaultValue={email || data.email} />
              <input type='hidden' name='leadNote' defaultValue={wishListNotes || data.wishListNotes} />
              <input type='hidden' name='name' defaultValue={firstName + ' ' + lastName || data.firstName + ' ' + data.lastName} />
              <input type='hidden' name='intent' defaultValue='editWishList' />
              <Button onClick={() => submit} size='icon' className='hover:bg-[#232324] w-[90%] cursor-pointer rounded-md mx-auto' >
                <Save color="#ededed" className="mx-auto" />
              </Button>
            </Form>
          </>
        )
      },
    },
    {
      id: "convertToCustomer",
      enableHiding: false,
      cell: ({ row }) => {
        const data = row.original
        return (
          <>
            <Form method='post'>
              <input type='hidden' name='userEmail' defaultValue={user.email} />
              <input type='hidden' name='userId' defaultValue={user.id} />
              <input type='hidden' name='id' defaultValue={data.id} />
              <input type='hidden' name='firstName' defaultValue={data.firstName} />
              <input type='hidden' name='lastName' defaultValue={data.lastName} />
              <input type='hidden' name='phone' defaultValue={data.phone} />
              <input type='hidden' name='name' defaultValue={data.firstName + ' ' + data.lastName} />
              <input type='hidden' name='brand' defaultValue={data.brand} />
              <input type='hidden' name='model' defaultValue={data.model} />
              <input type='hidden' name='intent' defaultValue='demoDayConvert' />
              <Button onClick={() => submit} size='icon' className='hover:bg-[#232324] w-[90%] cursor-pointer rounded-md mx-auto' >
                <FilePlus color="#ededed" className="mx-auto" />

              </Button>
            </Form>
          </>
        )
      },
    },
    {
      id: "deleteCustomer",
      enableHiding: false,
      cell: ({ row }) => {
        const data = row.original
        return (
          <>
            <Form method='post'>
              <input type='hidden' name='userEmail' defaultValue={user.email} />
              <input type='hidden' name='userId' defaultValue={user.id} />
              <input type='hidden' name='id' defaultValue={data.id} />
              <input type='hidden' name='intent' defaultValue='demoDayDelete' />
              <Button onClick={() => submit} size='icon' className='hover:bg-[#232324] w-[90%] cursor-pointer rounded-md mx-auto' >
                <Trash2 color="#ededed" className="mx-auto" />
              </Button>
            </Form>
          </>
        )
      },
    }
  ]
  const updateEditingRow = (rowIndex, columnId, value) => {
    switch (columnId) {
      case 'firstName': setFirstName(value); break;
      case 'lastName': setLastName(value); break;
      case 'email': setEmail(value); break;
      case 'phone': setPhone(value); break;
      case 'wishListNotes': setLeadNote(value); break;
      case 'notified': setNotified(value); break;
      default: break;
    }
  };
  const defaultColumn: Partial<ColumnDef<Payment>> = {
    cell: ({ getValue, row: { index }, column: { id }, table }) => {
      const initialValue = getValue();
      const [value, setValue] = useState(initialValue);

      useEffect(() => {
        setValue(initialValue);
      }, [initialValue]);

      const onBlur = () => {
        table.options.meta?.updateData(index, id, value)
      }

      return (
        <Input
          value={value as string}
          onChange={e => setValue(e.target.value)}
          className='mx-auto bg-[#09090b] border-[#27272a] text-center '
          onBlur={onBlur}
        />
      )
    }
  }
  const table = useReactTable({
    data,
    columns,
    defaultColumn,

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
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    meta: {
      updateData: (rowIndex, columnId, value) => {
        updateEditingRow(rowIndex, columnId, value)
        setData(old =>
          old?.map((row: any, index: any) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex]!,
                [columnId]: value,
              }
            }
            return row
          })
        )

      },
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
    setBrandId2(e.target.value);
    console.log(brandId, modelList)
  };

  useEffect(() => {
    async function getData() {
      const res = await fetch(`/dealer/api/modelList/${brandId}`);
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
        const result = await getData();
        setModelList2(result);
        console.log(brandId2, result); // Log the updated result
      };
      fetchData();
    }
  }, [brandId, brandId2]);

  return (
    <div className="mx-auto w-[95%] ">
      <div className="flex items-center py-4 justify-between">
        <div className='flex'>
          <Input
            value={globalFilter ?? ''}
            onChange={event => setGlobalFilter(event.target.value)} className="font-lg border-[#262626] w-[400px] border border-[#262626] bg-[#09090b] p-2 text-[#fafafa] shadow"
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
            className="ml-2 max-w-sm border-[#262626] bg-[#09090b] p-2 text-[#fafafa]"
          />
          <select value={filterBy} onChange={handleDropdownChange}
            className={`border-[#262626] bg-[#09090b] p-2 text-[#fafafa] placeholder:text-blue-300  mx-auto ml-2  h-8 cursor-pointer rounded border   px-2 text-xs uppercase shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]`}
          >
            <option value='' >Search By Model</option>
            {models.map((model, index) => (
              <option key={index} value={model}>
                {model}
              </option>
            ))}
          </select>
          <Button onClick={() => setAllFilters([])} name='intent' type='submit' variant='outline' className={`border-[#262626] bg-[#09090b] p-2 text-[#fafafa] placeholder:text-blue-300  mx-auto ml-2  h-8 cursor-pointer rounded border   px-2 text-xs uppercase shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]`}
          >
            Clear
          </Button>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant='outline' className="active:bg-[#09090b]  mx-2 my-auto h-7  cursor-pointer rounded bg-[#09090b] border border-[#262626] px-3 py-2  text-center text-xs  font-bold uppercase text-[#fafafa] shadow outline-none  transition-all duration-150 ease-linear hover:border-[#02a9ff]  hover:text-[#02a9ff] hover:shadow-md focus:outline-none"
            >
              Add
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-[#09090b] border-[#27272a] text-[#fafafa]">
            <DialogHeader>
              <DialogTitle>Wish List</DialogTitle>
              <DialogDescription>
                Add customer to wish list. Once sold, you can transfer to clients.
              </DialogDescription>
            </DialogHeader>
            <Form method='post' className="grid gap-4 py-4">
              <div className="grid grid-cols-1 items-center gap-4">
                <input type='hidden' name='userId' value={user.id} />
                <div className="relative mt-3">
                  <Input
                    name="firstName"
                    className="col-span-3 bg-[#09090b] border-[#27272a]"
                  />
                  <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-[#09090b] transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-[#909098] peer-focus:-top-3 peer-focus:text-[#909098]">First Name</label>
                </div>
                <div className="relative mt-3">
                  <Input
                    name="lastName"
                    className="col-span-3 bg-[#09090b] border-[#27272a]"
                  />
                  <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-[#09090b] transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-[#909098] peer-focus:-top-3 peer-focus:text-[#909098]">Last Name</label>
                </div>
                <div className="relative mt-3">
                  <Input
                    name="email"
                    className="col-span-3 bg-[#09090b] border-[#27272a]"
                  />
                  <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-[#09090b] transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-[#909098] peer-focus:-top-3 peer-focus:text-[#909098]">Email</label>
                </div>
                <div className="relative mt-3">
                  <Input
                    name="phone"
                    className="col-span-3 bg-[#09090b] border-[#27272a]"
                  />
                  <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-[#09090b] transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-[#909098] peer-focus:-top-3 peer-focus:text-[#909098]">Phone</label>
                </div>
                <div className="relative mt-3">
                  <Input
                    className=" col-span-3 bg-[#09090b] border-[#27272a]"
                    type="text"
                    list="ListOptions1"
                    name="brand"
                    onChange={handleBrand}
                  />
                  <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-[#09090b] transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-[#909098] peer-focus:-top-3 peer-focus:text-[#909098]">Brand</label>
                </div>
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

                {modelList && (
                  <>
                    <div className="relative mt-3">
                      <Input className=" col-span-3 bg-[#09090b] border-[#27272a]" type="text" list="ListOptions2" name="model" />
                      <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-[#09090b] transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-[#909098] peer-focus:-top-3 peer-focus:text-[#909098]">Model</label>
                    </div>
                    <datalist id="ListOptions2">
                      {modelList.models.map((item, index) => (
                        <option key={index} value={item.model} />
                      ))}
                    </datalist>
                  </>
                )}
              </div>

              <div className="relative mt-3">
                <Input
                  className=" col-span-3 bg-[#09090b] border-[#27272a]"
                  type="text"
                  list="ListOptions2"
                  name="brand2"
                  onChange={handleBrand2}
                />
                <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-[#09090b] transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-[#909098] peer-focus:-top-3 peer-focus:text-[#909098]">Brand 2</label>
              </div>
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

              {modelList2 && (
                <>
                  <div className="relative mt-3">
                    <Input className=" col-span-3 bg-[#09090b] border-[#27272a]" type="text" list="ListOptions3" name="model2" />
                    <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-[#09090b] transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-[#909098] peer-focus:-top-3 peer-focus:text-[#909098]">Model 2</label>
                  </div>
                  <datalist id="ListOptions3">
                    {modelList2.models.map((item, index) => (
                      <option key={index} value={item.model} />
                    ))}
                  </datalist>
                </>
              )}
              <div className="relative mt-3">
                <Input
                  name="wishListNotes"
                  placeholder="wants less than 50k kms"
                  className="col-span-3 bg-[#09090b] border-[#27272a]"
                />
                <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-[#09090b] transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-[#909098] peer-focus:-top-3 peer-focus:text-[#909098]">Notes</label>
              </div>
              <Button onClick={() => toast.success(`Added to wish list!`)}
                type='submit' name='intent' value='addWishList' variant='outline' className="active:bg-[#09090b] w-[75px] mt-10 mx-2 my-auto h-7  cursor-pointer rounded bg-[#dc2626] px-3 py-2  text-center text-xs  font-bold uppercase text-[#fafafa] shadow outline-none  transition-all duration-150 ease-linear hover:border-[#02a9ff] border-[#262626] hover:text-[#02a9ff] hover:shadow-md focus:outline-none"
              >
                Save
              </Button>
            </Form>
          </DialogContent>
        </Dialog>

      </div>
      <div className="rounded-md border border-[#262626] ">
        <Table2 className='w-full overflow-x-auto border-[#262626] text-[#fafafa]'>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className=' border-[#262626]'>
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
                        <div className="mx-auto cursor-pointer items-center justify-center border-[#262626] text-center">
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
                  className='cursor-pointer border-[#262626] bg-[#09090b]  p-4 capitalize text-[#fafafa] hover:text-[#02a9ff]'
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
                  className="h-24 cursor-pointer bg-[#09090b] text-center capitalize text-[#fafafa] hover:text-[#02a9ff]"
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
            className="border-[#262626] text-[#fafafa] bg-transparent hover:bg-transparent"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            className="border-[#262626] text-[#fafafa] bg-[#09090b]   hover:bg-transparent"

            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
