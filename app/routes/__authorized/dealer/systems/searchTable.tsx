import { json, type ActionFunction, type LoaderFunction } from '@remix-run/node';
import { getSession, commitSession } from '~/sessions/auth-session.server';
import { GetUser } from '~/utils/loader.server';
import financeFormSchema from '~/overviewUtils/financeFormSchema';
import { Form, Link, useLocation, Await, useFetcher, useSubmit, useNavigate, useLoaderData } from '@remix-run/react';
import { prisma } from '~/libs';
import { useEffect, useRef, useState } from 'react';
import { Button, DropdownMenuItem, DropdownMenuShortcut } from '~/components';
import { Search } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip"

import {
  useReactTable,
  getCoreRowModel,
  getExpandedRowModel,
  ColumnDef,
  flexRender,
  Column,
  ColumnFiltersState,
  FilterFn,
  SortingFn,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  sortingFns,
  Row,
} from '@tanstack/react-table'
import {
  RankingInfo,
  rankItem,
  compareItems,
} from '@tanstack/match-sorter-utils'
import React, { Fragment } from 'react'
import { ChevronDown } from 'lucide-react';
import { ChevronDownIcon } from 'lucide-react';
import { X } from 'lucide-react';
import {
  Table as ShadTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"
import useSWR from 'swr';

export async function loader({ request, params }: LoaderFunction) {
  const finance = await prisma.clientfile.findMany();
  console.log('finance', finance)
  return json({ finance })
};

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
const columns: ColumnDef<Finance>[] = [
  {
    id: 'expander',
    header: () => null,
    cell: ({ row }) => {
      return row.getCanExpand() ? (
        <button
          {...{
            onClick: row.getToggleExpandedHandler(),
            style: { cursor: 'pointer' },
          }}
        >
          {row.getIsExpanded() ? <ChevronDownIcon /> : <ChevronDown />}
        </button>
      ) : (
        <X />
      )
    }
  },
  {
    accessorKey: 'firstName',
    id: 'firstName',
    header: () => null,
    cell: ({ row, getValue }) => (
      <div style={{ paddingLeft: `${row.depth * 2}rem`, }}      >
        {capitalizeFirstLetter(getValue<string>())}
      </div>
    ),
    footer: props => props.column.id,
    filterFn: 'includesStringSensitive', //note: normal non-fuzzy filter column

  },
  {
    accessorFn: row => row.lastName,
    id: 'lastName',
    cell: info => capitalizeFirstLetter(info.getValue()),
    header: () => null,
    footer: props => props.column.id,
    filterFn: 'includesStringSensitive', //note: normal non-fuzzy filter column

  },
  {
    accessorFn: row => row.phone,
    id: 'phone',
    cell: info => info.getValue(),
    header: () => null,
    footer: props => props.column.id,
    filterFn: 'includesStringSensitive', //note: normal non-fuzzy filter column

  },
  {
    accessorFn: row => row.email,
    id: 'email',
    cell: info => info.getValue(),
    header: () => null,
    footer: props => props.column.id,
    filterFn: 'includesStringSensitive', //note: normal non-fuzzy filter column

  },
  {
    accessorFn: row => `${row.firstName} ${row.lastName}`,
    id: 'fullName',
    header: () => null,
    cell: info => info.getValue(),
    filterFn: 'fuzzy', //using our custom fuzzy filter function
    // filterFn: fuzzyFilter, //or just define with the function
    sortingFn: fuzzySort, //sort by fuzzy rank (falls back to alphanumeric)
  },
  {
    accessorKey: "profile",
    header: () => null,
    cell: ({ row }) => {
      const data = row.original
      return <>
        <Link to={`/dealer/customer/${data.id}/check`}          >
          <Button variant='outline' className='bg-primary' size='sm'>
            Profile
          </Button>
        </Link>
      </>
    },
  },

]

export default function SearchFunction2() {
  //const { finance } = useLoaderData()
  const location = useLocation()
  let [show, setShow] = useState(false)
  let ref = useRef()
  const swrFetcher = url => fetch(url).then(r => r.json())

  const { data: clientFetch, userError } = useSWR('/dealer/api/clientfiles', swrFetcher, {
    revalidateOnMount: true, revalidateOnReconnect: true
  });

  const [data, setData] = useState(clientFetch)

  useEffect(() => {
    if (clientFetch) {
      console.log(clientFetch, 'userFetch')
      setData(clientFetch)
    }
  }, []);


  useEffect(() => {
    if (show) {
      ref.current.select()
    }
  }, [show])

  useEffect(() => {
    setShow(false)
  }, [location])

  // bind command + k
  useEffect(() => {
    let listener = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault()
        setShow(true)
      }
    }
    window.addEventListener('keydown', listener)
    return () => window.removeEventListener('keydown', listener)
  }, [])


  const [dropTable, setDrop] = useState(false)
  const [finances, setFinances] = useState([])
  const selectedCustomer = async (email) => {
    const finance = await prisma.finance.findMany({ where: { email: email } })
    setFinances(finance)
  }

  return (
    <div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <>
              <Button
                variant='ghost'
                size='icon'
                className=' fixed top-[25px] right-[75px]'
                onClick={(e) => {
                  e.preventDefault()
                  setShow(true)
                }}>
                <Search className='texct-foreground' />

              </Button>
            </>

          </TooltipTrigger>
          <TooltipContent>
            <p>Customer Search</p>
            <p>ctrl + k will also open this feature.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <div
        onClick={() => {
          setShow(false)
        }}
        hidden={!show}
        className='bg-background/80'
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vw',
          margin: 'auto',
          //   background: 'hsla(0, 100%, 100%, 0.9)',
          zIndex: 100,
          overflow: 'hidden',
        }}
      >
        <div
          className='border border-border bg-background text-foreground overflow-y-auto'
          style={{
            //   background: 'white',
            width: 600,
            maxHeight: '600px',
            height: '600px',
            overflow: 'auto',
            margin: '20px auto',
            // border: 'solid 1px #ccc',
            borderRadius: 10,
            // boxShadow: '0 0 10px #ccc',
          }}
          onClick={(event) => {
            event.stopPropagation()
          }}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              setShow(false)
            }
          }}
        >
          {data && (
            <Table
              data={data}
              columns={columns}
              getRowCanExpand={() => true}
              renderSubComponent={renderSubComponent}
            />
          )}
        </div>
      </div >
    </div>
  )
}


type TableProps<TData> = {
  data: TData[]
  columns: ColumnDef<TData>[]
  renderSubComponent: (props: { row: Row<TData> }) => React.ReactElement
  getRowCanExpand: (row: Row<TData>) => boolean
}
export type Finance = {
  firstname: string
  lastName: string
  year: string
  model: string
  brand: string
  phone: string
  email: string
  vin: string
  stockNum: string
  subRows?: Finance[]
}
declare module '@tanstack/react-table' {
  //add fuzzy filter to the filterFns
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}
const fuzzySort: SortingFn<any> = (rowA, rowB, columnId) => {
  let dir = 0

  // Only sort by rank if the column has ranking information
  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId]?.itemRank!,
      rowB.columnFiltersMeta[columnId]?.itemRank!
    )
  }

  // Provide an alphanumeric fallback for when the item ranks are equal
  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir
}
const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the itemRank info
  addMeta({
    itemRank,
  })

  // Return if the item should be filtered in/out
  return itemRank.passed
}

function Table({
  data,
  columns,
  renderSubComponent,
  getRowCanExpand,
}: TableProps<Finance>): JSX.Element {
  const rerender = React.useReducer(() => ({}), {})[1]
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    []
  )
  const [globalFilter, setGlobalFilter] = useState('')


  const table = useReactTable<Finance>({
    data,
    columns,
    getRowCanExpand,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),

    filterFns: {
      fuzzy: fuzzyFilter, //define as a filter function that can be used in column definitions
    },
    state: {
      columnFilters,
      globalFilter,
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: 'fuzzy', //apply fuzzy filter to the global filter (most common use case for fuzzy filter)
    getFilteredRowModel: getFilteredRowModel(), //client side filtering
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  //apply the fuzzy sort if the fullName column is being filtered
  React.useEffect(() => {
    if (table.getState().columnFilters[0]?.id === 'fullName') {
      if (table.getState().sorting[0]?.id !== 'fullName') {
        table.setSorting([{ id: 'fullName', desc: false }])
      }
    }
  }, [table.getState().columnFilters[0]?.id])
  return (
    <div className="p-2">
      <div>
        <DebouncedInput
          value={globalFilter ?? ''}
          onChange={value => setGlobalFilter(String(value))}
          className="p-2 font-lg shadow border border-block"
          placeholder="Search all columns..."
        />
      </div>
      <div className="h-2" />
      <table>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                return (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <div>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </div>
                    )}
                  </th>
                )
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => {
            return (
              <Fragment key={row.id}>
                <tr>
                  {/* first row is a normal row */}
                  {row.getVisibleCells().map(cell => {
                    return (
                      <td key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    )
                  })}
                </tr>
                {row.getIsExpanded() && (
                  <tr>
                    {/* 2nd row is a custom 1 cell row */}
                    <td colSpan={row.getVisibleCells().length}>
                      {renderSubComponent({ row })}
                    </td>
                  </tr>
                )}
              </Fragment>
            )
          })}
        </tbody>
      </table>
      <div className="h-2" />
      <div>{table.getRowModel().rows.length} Rows</div>
    </div>
  )
}

const renderSubComponent = ({ row }: { row: Row<Finance> }) => {
  /** <pre style={{ fontSize: '10px' }}>
      <code>{JSON.stringify(row.original, null, 2)}</code>
    </pre> */
  const [finances, setFinances] = useState([])
  useEffect(() => {
    console.log('hituseeffect in sub compoennt')
    async function GetFinances() {
      const finance = await prisma.finance.findMany({ where: { email: row.original.email } });
      setFinances(finance)
    }
    GetFinances()
  }, [row]);

  return (
    <ShadTable className='w-full mx-auto rounded-[6px]'>
      <TableBody className='mt-3 mx-auto'>
        {finances.map((finance) => (
          <>
            <Link
              to={`/dealer/customer/${row.original.id}/${finance.id}`}
              className=' '
            >
              <TableRow key={finance.id} className='mx-auto border-b border-border hover:rounded-[6px]'>
                {finance.year && (
                  <TableCell className="text-center text-muted-foreground text-lg">
                    {finance.year}
                  </TableCell>
                )}
                <TableCell className="text-center text-muted-foreground text-lg">
                  {finance.brand}
                </TableCell>
                <TableCell className="text-center text-foreground text-lg">
                  {finance.model}
                </TableCell>
                {finance.vin && (
                  <TableCell className="text-center text-muted-foreground text-lg">
                    {finance.vin}
                  </TableCell>
                )}
                {finance.stockNum && (
                  <TableCell className="text-center text-muted-foreground text-lg">
                    {finance.stockNum}
                  </TableCell>
                )}


              </TableRow>
            </Link>
          </>
        ))}
      </TableBody>
    </ShadTable>
  )
}

function Filter({ column }: { column: Column<any, unknown> }) {
  const columnFilterValue = column.getFilterValue()

  return (
    <DebouncedInput
      type="text"
      value={(columnFilterValue ?? '') as string}
      onChange={value => column.setFilterValue(value)}
      placeholder={`Search...`}
      className="w-36 border shadow rounded"
    />
  )
}

// A typical debounced input react component
function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
  const [value, setValue] = React.useState(initialValue)

  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value])

  return (
    <input {...props} value={value} onChange={e => setValue(e.target.value)} />
  )
}
/**                 <Link
                    to={`/dealer/customer/${result.id}/check`}
                    className='mb-5 justify-start'
                    key={index}
                  >
                    <Button
                      variant='ghost'
                      className='w-[99%] hover:bg-background/40 rounded-[6px] my-2 h-[75px] hover:text-black'
                    >
                      <div>
                        <p className="text-2xl text-left text-foreground"> {capitalizeFirstLetter(result.firstName)} {capitalizeFirstLetter(result.lastName)}</p>
                        <p className='text-muted-foreground text-left '>{result.phone}</p>
                        <p className='text-muted-foreground text-left '>{result.email}</p>
                      </div>
                    </Button>
                  </Link> */
