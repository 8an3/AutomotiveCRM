
import React, { useEffect, useReducer, useState, useRef } from "react";
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
import { DocumentInputs } from '~/routes/_authorized.dashboard.customer.$custId'
import { type rankItem, type compareItems, type RankingInfo, } from '@tanstack/match-sorter-utils'
import IndeterminateCheckbox from "~/components/dashboard/calls/InderterminateCheckbox"
import { Column, Table, useReactTable, ColumnFiltersState, getCoreRowModel, getFilteredRowModel, getFacetedRowModel, getFacetedUniqueValues, getFacetedMinMaxValues, getPaginationRowModel, sortingFns, getSortedRowModel, type FilterFn, type SortingFn, type ColumnDef, flexRender, FilterFns, } from '@tanstack/react-table'
import AttemptedOrReached from "~/components/dashboard/calls/setAttOrReached";
import ContactTimesByType from "~/components/dashboard/calls/ContactTimesByType";
import LogCall from "~/components/dashboard/calls/logCall";
import Logtext from "~/components/dashboard/calls/logText";
import { Badge } from "~/ui/badge";
import { prisma } from "~/libs";
import { Flex, Text, Button, Heading } from '@radix-ui/themes';
import { Form, useLoaderData, useSubmit, Link, useFetcher, useNavigation } from '@remix-run/react'
import { type LinksFunction } from "@remix-run/node";

export let action = dashboardAction
export let loader = dashboardLoader
export const links: LinksFunction = () => [
    { rel: "icon", type: "image/svg", href: '/dashboard.svg' },
]
async function getData(): Promise<dashBoardType[]> {
    //turn into dynamic route and have them call the right loader like q  uote qand overview
    const res = await fetch('/dashboard/calls/loader')
    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }
    return res.json();
}

export default function MainDashbaord() {
    const [data, setPaymentData,] = useState<dashBoardType[]>([]);
    useEffect(() => {
        const data = async () => {
            const result = await getData();
            setPaymentData(result);
        };
        data()
    }, []);

    return (
        <>
            <div className="bg-transparent text-gray-300 uppercase">
                <DataTable columns={columns} data={data} />
            </div>
        </>
    )
}
export type Payment = {
    id: string
    fiannceId: string
    userEmail: string
    firstName: string
    lastName: string
    phone: number
    email: string
    address: string
    postal: string
    city: string
    province: string
    contactMethod: string
    brand: string
    model: string
    year: number
    color: string
    note: string
    lastContact: string
    status: 'Active' | 'Duplicate' | 'Invalid' | 'Lost'
    customerState: string
    result: string
    timesContacted: number
    nextAppointment: string
    completeCall: string
    followUpDay: number
    state: string
    typeOfContact: string | null;
    timeToContact: 'Morning' | 'Afternoon' | 'Evening' | 'Anytime' | 'Do Not Call'
    notes: string
    visits: number
    progress: number
    visited: string
    metManager: string
    metSalesperson: string
    metFinance: string
    metService: string
    metParts: string
    financeApplication: string
    approved: string
    docsSigned: string
    delivered: string
    pickUpSet: string
    demoed: string
    seenTrade: string
    tradeRepairs: string
    dashData: string
    twoDaysFromNow: string
    referral: string
    dl: string
    timeOfDay: string
    discount: string
    total: string
    onTax: string
    deliveryCharge: string
    userLoanProt: string
    userTireandRim: string
    userGap: string
    userExtWarr: string
    userServicespkg: string
    vinE: string
    lifeDisability: string
    rustProofing: string
    userOther: string
    deposit: string
    paintPrem: string
    discountPer: string
    weeklyOthWOptions: string
    qcTax: string
    otherTax: string
    totalWithOptions: string
    otherTaxWithOptions: string
    stockNum: string
    model1: string
    modelCode: string
    tradeValue: string
    undefined: string
    pickUpDate: string
    pickUpTime: string
    lastNote: string
    singleFinNote: string
    documentUpload: string
    depositMade: string
    financeApp: string
    signed: string
    deliveredDate: string
    contactTimesByType: string
    InPerson: string
    Phone: string
    SMS: string
    Email: string

}


export type TableMeta = {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void
}

// Give our default column cell renderer editing superpowers!
export const defaultColumn: Partial<ColumnDef<Payment>> = {
    cell: ({ getValue, row: { index }, column: { id }, table }) => {
        const initialValue = getValue()
        // We need to keep and update the state of the cell normally
        const [value, setValue] = useState(initialValue)

        // When the input is blurred, we'll call our table meta's updateData function
        const onBlur = () => {
            ; (table.options.meta as TableMeta).updateData(index, id, value)
        }

        // If the initialValue is changed external, sync it up with our state
        useEffect(() => {
            setValue(initialValue)
        }, [initialValue])

        return (
            <input
                value={value as string}
                onChange={e => setValue(e.target.value)}
                onBlur={onBlur}
            />
        )
    },
}

const columns: ColumnDef<Payment>[] = [
    {
        id: 'select',
        header: ({ table }) => (
            <IndeterminateCheckbox
                checked={table.getIsAllRowsSelected()}
                indeterminate={table.getIsSomeRowsSelected()}
                onChange={table.getToggleAllRowsSelectedHandler()}
            />
        ),
        cell: ({ row }) => (
            <div className="px-1">
                <IndeterminateCheckbox
                    checked={row.getIsSelected()}
                    indeterminate={row.getIsSomeSelected()}
                    onChange={row.getToggleSelectedHandler()}
                />
            </div>
        ),
    },

    {
        accessorKey: "firstName",
        header: ({ column }) => {
            return <>
                <DataTableColumnHeader column={column} title="First Name" />

            </>

        },
        cell: ({ row }) => {
            const data = row.original

            return <div className="bg-transparent px-5 h-[45px] w-[175px] flex-1 flex items-center justify-center text-[15px] leading-none  target:text-[#02a9ff] hover:text-[#02a9ff] text-[#EEEEEE]  uppercase  outline-none  ease-linear transition-all text-center duration-150  focus:outline-none  focus:text-[#02a9ff] cursor-pointer">
                <ClientCard data={data} />
            </div>
        },


    },
    {
        accessorKey: "lastName",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="LastName" />
        ),
        cell: ({ row }) => {
            const data = row.original
            return <div className="bg-transparent px-5 w-[175px] cursor-pointer flex-1 flex items-center justify-center text-[15px] leading-none  first:rounded-tl-md last:rounded-tr-md target:text-[#02a9ff] hover:text-[#02a9ff] text-[#EEEEEE] active:bg-[#02a9ff]  uppercase  outline-none  ease-linear transition-all text-center duration-150  focus:outline-none  focus:text-[#02a9ff] ">
                <a target="_blank" href={`/customer/${data.id}`}>
                    {(row.getValue("lastName"))}
                </a>
            </div>
        },

    },
    {

        accessorKey: "status",
        header: ({ column }) => {
            return <>
                <DataTableColumnHeader column={column} title="Status" />
            </>
        },
        cell: ({ row }) => {
            const data = row.original
            return <div className="my-auto bg-transparent  h-[45px] flex-1 flex items-center justify-center text-[15px] leading-none target:text-[#02a9ff] hover:text-[#02a9ff] text-[#EEEEEE] active:bg-[#02a9ff]  uppercase outline-none ease-linear transition-all text-center duration-150 focus:outline-none focus:text-[#02a9ff]  cursor-pointer">
                <ClientStatusCard data={data} />
            </div>
        },
    },
    {
        accessorKey: "nextAppointment",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Next Appt" />
        ),
        cell: ({ row }) => {
            const data = row.original;
            const formatDate = (dateString) => {
                const date = new Date(dateString);
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-indexed in JavaScript
                const day = String(date.getDate()).padStart(2, '0');
                const hours = date.getHours();
                const minutes = String(date.getMinutes()).padStart(2, '0');

                return `${year}-${month}-${day} ${hours}:${minutes}`;
            };

            const formattedDate = data.nextAppointment && data.nextAppointment !== '1969-12-31 19:00' ? formatDate(data.nextAppointment) : 'TBD';

            return <div className="bg-transparent px-5 h-[45px] w-[160px] flex-1 flex items-center justify-center text-[15px] leading-none  target:text-[#02a9ff] hover:text-[#02a9ff] text-[#EEEEEE] active:bg-[#02a9ff]  uppercase  outline-none  ease-linear transition-all text-center duration-150  focus:outline-none  focus:text-[#02a9ff]  mx-1  ">
                {data.nextAppointment === 'TBD' ? <p>TBD</p> : formattedDate}
            </div>
        },
    },
    {

        accessorKey: "customerState",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="State" />
        ), cell: ({ row }) => {
            const data = row.original
            //  const id = data.id ? data.id.toString() : '';


            return <div className="bg-transparent px-5 h-[45px] w-[95%] flex-1 flex items-center justify-center text-[15px] leading-none  target:text-[#02a9ff] hover:text-[#02a9ff] text-gray-300 active:bg-[#02a9ff]  uppercase  outline-none  ease-linear transition-all text-center duration-150  focus:outline-none  focus:text-[#02a9ff]  mx-1 ">
                {data.customerState === 'Pending' ? (<Badge className="bg-slate3">Pending</Badge>
                ) : data.customerState === 'Attempted' ? (<Badge className="bg-slate3">Attempted</Badge>
                ) : data.customerState === 'Reached' ? (<Badge className="bg-jade9">Reached</Badge>
                ) : data.customerState === 'sold' ? (<Badge className="bg-jade9">Sold</Badge>
                ) : data.customerState === 'depositMade' ? (<Badge className="bg-jade9">Deposit</Badge>
                ) : data.customerState === 'turnOver' ? (<Badge className="bg-blue-9">Turn Over</Badge>
                ) : data.customerState === 'financeApp' ? (<Badge className="bg-blue-9">Application Done</Badge>
                ) : data.customerState === 'approved' ? (<Badge className="bg-jade9">Approved</Badge>
                ) : data.customerState === 'signed' ? (<Badge className="bg-jade9">Signed</Badge>
                ) : data.customerState === 'pickUpSet' ? (<Badge className="bg-jade9">Pick Up Set</Badge>
                ) : data.customerState === 'delivered' ? (<Badge className="bg-jade9">Delivered</Badge>
                ) : data.customerState === 'refund' ? (<Badge className="bg-[#cf5454]">Refunded</Badge>
                ) : data.customerState === 'funded' ? (<Badge className="bg-[#cf5454]">Funded</Badge>
                ) : (
                    ''
                )}
                {data.customerState === 'Pending' && (
                    <AttemptedOrReached data={data} />
                )}
                {data.customerState === 'Attempted' && (
                    <AttemptedOrReached data={data} />
                )}

            </div>
        },
    },
    {
        accessorKey: "contact",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Contact" />
        ),
        cell: ({ row }) => {
            const data = row.original
            // <CallClient />
            //<SmsClient data={data} />


            const [isButtonPressed, setIsButtonPressed] = useState(false);

            return <>
                <div className='gap-3 my-2 grid grid-cols-3'>
                    <LogCall data={data} />
                    <EmailClient data={data} setIsButtonPressed={setIsButtonPressed} isButtonPressed={isButtonPressed} />
                    <Logtext data={data} />
                </div>
            </>
        },
    },
    {
        accessorKey: "model",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Model" />
        ),
        cell: ({ row }) => {
            const data = row.original
            return <div className="text-center w-[275px]  cursor-pointer text-[14px]  text-[#EEEEEE]">
                <ClientVehicleCard data={data} />
            </div>
        },
    },
    {
        accessorKey: "tradeDesc",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Trade" />
        ),
        cell: ({ row }) => {
            return <div className="bg-transparent px-5 h-[45px] w-[250px] flex-1 flex items-center justify-center text-[13px] leading-none  first:rounded-tl-md last:rounded-tr-md target:text-[#02a9ff] hover:text-[#02a9ff] text-gray-300 active:bg-[#02a9ff]  uppercase  outline-none  ease-linear transition-all text-center duration-150  focus:outline-none  focus:text-[#02a9ff]  mx-1 cursor-pointer">{(row.getValue("tradeDesc"))}</div>
        },

    },
    {
        accessorKey: "lastNote",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Last Note" />
        ),
        cell: ({ row }) => {
            return <div className="bg-transparent px-5 h-[45px] w-[95%] flex-1 flex items-center justify-center text-[15px] leading-none  first:rounded-tl-md last:rounded-tr-md target:text-[#02a9ff] hover:text-[#02a9ff] text-gray-300 active:bg-[#02a9ff]  uppercase  outline-none  ease-linear transition-all text-center duration-150  focus:outline-none  focus:text-[#02a9ff]  mx-1 cursor-pointer">{(row.getValue("lastNote"))}</div>
        },

    },
    {
        accessorKey: "singleFinNote",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Notes" />
        ),
        cell: ({ row }) => {
            const data = row.original;
            const single = data.singleFinNote;
            const last = data.lastNote
            if (single) {
                return (
                    { single }
                )
            }
            else if (last) {
                return (
                    { last }
                )
            }
            else
                return null;
        },
    },
    {
        accessorKey: "followUpDay",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Preset F/U Day" />
        ),
        cell: ({ row }) => {
            const data = row.original
            return <>

                <div className='w-[150px]'>
                    <PresetFollowUpDay data={data} />
                </div>
            </>
        },
    },
    {
        accessorKey: "twoDaysFromNow",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Set New Apt." />
        ),
        cell: ({ row }) => {
            const navigation = useNavigation();
            const isSubmitting = navigation.state === "submitting";
            const data = row.original
            return <>

                <div className='w-[200px]'>
                    <TwoDaysFromNow data={data} isSubmitting={isSubmitting} />
                </div>
            </>
        },
    },
    {
        accessorKey: "completeCall",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Complete Call" />
        ),
        cell: ({ row }) => {
            const data = row.original
            const contactMethod = data.contactMethod
            return <>

                <div className='w-[125px] cursor-pointer'>

                    <CompleteCall data={data} contactMethod={contactMethod} />
                </div>
            </>
        },
    },
    {
        accessorKey: "contactTimesByType",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Contact Times By Type" />
        ),
        cell: ({ row }) => {
            const data = row.original
            //
            return <>
                <div className='w-[175px] cursor-pointer'>
                    <ContactTimesByType data={data} />
                </div>
            </>
        },
    },
    {
        accessorKey: "pickUpDate",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Pick Up Date" className="bg-transparent px-5 h-[45px] w-[175px] flex-1 flex items-center justify-center text-[15px] leading-none  first:rounded-tl-md last:rounded-tr-md target:text-[#02a9ff] hover:text-[#02a9ff] text-gray-300 active:bg-[#02a9ff]  uppercase  outline-none  ease-linear transition-all text-center duration-150  focus:outline-none  focus:text-[#02a9ff]  mx-1 cursor-pointer " />
        ),
        cell: ({ row }) => {
            const data = row.original
            if (data.pickUpDate) {
                const pickupDate = data.pickUpDate
                return (
                    <div className="bg-transparent px-5 h-[45px] w-[150px] flex-1 flex items-center justify-center text-[15px] leading-none last:rounded-tr-md :text-[#02a9ff] text-grbg-transparent px-5 flex-1 flex items-center justify-center text-[15px] leading-none  target:text-[#02a9ff] hover:text-[#02a9ff] text-gray-300 active:bg-[#02a9ff]  uppercase  outline-none  ease-linear transition-all text-center duration-150  focus:outline-none  focus:text-[#02a9ff]  mx-1 cursor-pointer">
                        {pickupDate === '1969-12-31 19:00' || pickupDate === null ? 'TBD' : pickupDate}
                    </div>
                );
            } else
                return null;
        },
    },
    {
        accessorKey: "lastContact",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Last Contacted" className="bg-transparent px-5 h-[45px] w-[175px] flex-1 flex items-center justify-center text-[15px] leading-none  first:rounded-tl-md last:rounded-tr-md target:text-[#02a9ff] hover:text-[#02a9ff] text-gray-300 active:bg-[#02a9ff]  uppercase  outline-none  ease-linear transition-all text-center duration-150  focus:outline-none  focus:text-[#02a9ff]  mx-1 cursor-pointer" />
        ),
        cell: ({ row }) => {
            const data = row.original
            const formatDate = (dateString) => {
                const date = new Date(dateString);
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-indexed in JavaScript
                const day = String(date.getDate()).padStart(2, '0');
                const hours = date.getHours();
                const minutes = String(date.getMinutes()).padStart(2, '0');

                return `${year}-${month}-${day} ${hours}:${minutes}`;
            };

            // usage
            const formattedDate = formatDate(data.nextAppointment);
            if (data.lastContact) {
                const lastContact1 = data.lastContact
                return (
                    <div className="bg-transparent px-5 h-[45px] w-[150px] flex-1 flex items-center justify-center text-[15px] leading-none  first:rounded-tl-md last:rounded-tr-md target:text-[#02a9ff] hover:text-[#02a9ff] text-gray-300 active:bg-[#02a9ff]  uppercase  outline-none  ease-linear transition-all text-center duration-150  focus:outline-none  focus:text-[#02a9ff]  mx-1 cursor-pointer">
                        {lastContact1 === '1969-12-31 19:00' || lastContact1 === null ? 'TBD' : data.pickUpDate}
                    </div>
                );
            }
            return null;
        },

    },


    {
        accessorKey: "id",

        cell: ({ row }) => {
            const data = row.original
            return (
                <>
                    {/* <DocuUploadDashboard data={data} />*/}
                </>
            );
        },

    },
    {
        accessorKey: "email",
        header: ({ column }) => (
            <p className="text-center">email</p>
        ),
        cell: ({ row }) => {
            return <div className="bg-transparent px-5 h-[45px] w-[95%] flex-1 flex items-center justify-center text-[15px] leading-none  first:rounded-tl-md last:rounded-tr-md target:text-[#02a9ff] hover:text-[#02a9ff] text-gray-300 active:bg-[#02a9ff]  uppercase  outline-none  ease-linear transition-all text-center duration-150  focus:outline-none  focus:text-[#02a9ff]  mx-1 cursor-pointer">{(row.getValue("email"))}</div>
        },

    },
    {
        accessorKey: "phone",
        header: ({ column }) => (
            <p className="text-center">phone</p>
        ), cell: ({ row }) => {
            return <div className="bg-transparent px-5 h-[45px] w-[95%] flex-1 flex items-center justify-center text-[15px] leading-none  first:rounded-tl-md last:rounded-tr-md target:text-[#02a9ff] hover:text-[#02a9ff] text-gray-300 active:bg-[#02a9ff]  uppercase  outline-none  ease-linear transition-all text-center duration-150  focus:outline-none  focus:text-[#02a9ff]  mx-1 cursor-pointer">{(row.getValue("phone"))}</div>
        },

    },
    {
        accessorKey: "address",
        header: ({ column }) => (
            <p className="text-center">address</p>
        ), cell: ({ row }) => {
            return <div className="bg-transparent px-5 h-[45px] w-[95%] flex-1 flex items-center justify-center text-[15px] leading-none  first:rounded-tl-md last:rounded-tr-md target:text-[#02a9ff] hover:text-[#02a9ff] text-gray-300 active:bg-[#02a9ff]  uppercase  outline-none  ease-linear transition-all text-center duration-150  focus:outline-none  focus:text-[#02a9ff]  mx-1 cursor-pointer">{(row.getValue("address"))}</div>
        },

    },
    {
        accessorKey: "postal",
        header: ({ column }) => (
            <p className="text-center">postal</p>
        ), cell: ({ row }) => {
            return <div className="bg-transparent px-5 h-[45px] w-[95%] flex-1 flex items-center justify-center text-[15px] leading-none  first:rounded-tl-md last:rounded-tr-md target:text-[#02a9ff] hover:text-[#02a9ff] text-gray-300 active:bg-[#02a9ff]  uppercase  rounded shadow hover:shadow-md outline-none  ease-linear transition-all text-center duration-150 cursor-pointer
              focus:outline-none


              focus:text-[#02a9ff]
               mx-1 font-medium">{(row.getValue("postal"))}</div>
        },

    },
    {
        accessorKey: "city",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="city" />
        ), cell: ({ row }) => {
            return <div className="bg-transparent px-5 h-[45px] w-[95%] flex-1 flex items-center justify-center text-[15px] leading-none  first:rounded-tl-md last:rounded-tr-md target:text-[#02a9ff] hover:text-[#02a9ff] text-gray-300 active:bg-[#02a9ff]  uppercase  rounded shadow hover:shadow-md outline-none  ease-linear transition-all text-center duration-150 cursor-pointer
              focus:outline-none


              focus:text-[#02a9ff]
               mx-1 font-medium">{(row.getValue("city"))}</div>
        },

    },
    {
        accessorKey: "province",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="province" />
        ), cell: ({ row }) => {
            return <div className="bg-transparent px-5 h-[45px] w-[95%] flex-1 flex items-center justify-center text-[15px] leading-none  first:rounded-tl-md last:rounded-tr-md target:text-[#02a9ff] hover:text-[#02a9ff] text-gray-300 active:bg-[#02a9ff]  uppercase  rounded shadow hover:shadow-md outline-none  ease-linear transition-all text-center duration-150 cursor-pointer
              focus:outline-none


              focus:text-[#02a9ff]
               mx-1 font-medium">{(row.getValue("province"))}</div>
        },

    },
    {
        accessorKey: "financeId",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="financeId" />
        ), cell: ({ row }) => {
            return <div className="text-center w-[200px] font-medium">{(row.getValue("financeId"))}</div>
        },

    },
    {
        accessorKey: "userEmail",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="userEmail" />
        ),
        cell: ({ row }) => {
            return <div className="bg-transparent px-5 h-[45px] w-[95%] flex-1 flex items-center justify-center text-[15px] leading-none  first:rounded-tl-md last:rounded-tr-md target:text-[#02a9ff] hover:text-[#02a9ff] text-gray-300 active:bg-[#02a9ff]  uppercase  rounded shadow hover:shadow-md outline-none  ease-linear transition-all text-center duration-150 cursor-pointer
              focus:outline-none


              focus:text-[#02a9ff]
               mx-1 font-medium">{(row.getValue("userEmail"))}</div>
        },

    },
    {
        accessorKey: "pickUpTime",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Pick Up Time" />
        ),
        cell: ({ row }) => {
            return <div className="bg-transparent px-5 h-[45px] w-[95%] flex-1 flex items-center justify-center text-[15px] leading-none  first:rounded-tl-md last:rounded-tr-md target:text-[#02a9ff] hover:text-[#02a9ff] text-gray-300 active:bg-[#02a9ff]  uppercase  outline-none  ease-linear transition-all text-center duration-150  focus:outline-none  focus:text-[#02a9ff]  mx-1 cursor-pointer w-[125px] ">
                {(row.getValue("pickUpTime"))}
            </div>
        },

    },

    {
        accessorKey: "timeToContact",
        header: "model1",
    },
    {
        accessorKey: "deliveredDate",
        header: "deliveredDate",
    },
    {
        accessorKey: "timeOfDay",
        header: "timeOfDay",
    },
    {
        accessorKey: "msrp",
        header: "msrp",
    },
    {
        accessorKey: "freight",
        header: "freight",
    },
    {
        accessorKey: "pdi",
        header: "pdi",
    },
    {
        accessorKey: "admin",
        header: "admin",
    },
    {
        accessorKey: "commodity",
        header: "commodity",
    },
    {
        accessorKey: "accessories",
        header: "accessories",
    },
    {
        accessorKey: "labour",
        header: "labour",
    },
    {
        accessorKey: "painPrem",
        header: "painPrem",
    },
    {
        accessorKey: "licensing",
        header: "licensing",
    },
    {
        accessorKey: "trailer",
        header: "trailer",
    },
    {
        accessorKey: "depositMade",
        header: "depositMade",
    },
    {
        accessorKey: "months",
        header: "months",
    },
    {
        accessorKey: "iRate",
        header: "iRate",
    },
    {
        accessorKey: "on60",
        header: "on60",
    },
    {
        accessorKey: "biweekly",
        header: "biweekly",
    },
    {
        accessorKey: "weekly",
        header: "weekly",
    },
    {
        accessorKey: "qc60",
        header: "qc60",
    },
    {
        accessorKey: "biweeklyqc",
        header: "biweeklyqc",
    },
    {
        accessorKey: "weeklyqc",
        header: "weeklyqc",
    },
    {
        accessorKey: "nat60",
        header: "nat60",
    },
    {
        accessorKey: "biweeklNat",
        header: "biweeklNat",
    },
    {
        accessorKey: "weeklylNat",
        header: "weeklylNat",
    },
    {
        accessorKey: "oth60",
        header: "oth60",
    },
    {
        accessorKey: "biweekOth",
        header: "biweekOth",
    },
    {
        accessorKey: "weeklyOth",
        header: "weeklyOth",
    },
    {
        accessorKey: "nat60WOptions",
        header: "nat60WOptions",
    },
    {
        accessorKey: "desiredPayments",
        header: "desiredPayments",
    },
    {
        accessorKey: "biweeklNatWOptions",
        header: "biweeklNatWOptions",
    },
    {
        accessorKey: "weeklylNatWOptions",
        header: "weeklylNatWOptions",
    },
    {
        accessorKey: "oth60WOptions",
        header: "oth60WOptions",
    },
    {
        accessorKey: "biweekOthWOptions",
        header: "biweekOthWOptions",
    },
    {
        accessorKey: "visited",
        header: "visited",
    },
    {
        accessorKey: "aptShowed",
        header: "aptShowed",
    },
    {
        accessorKey: "bookedApt",
        header: "bookedApt",
    },
    {
        accessorKey: "aptNoShowed",
        header: "aptNoShowed",
    },
    {
        accessorKey: "testDrive",
        header: "testDrive",
    },
    {
        accessorKey: "metParts",
        header: "metParts",
    },
    {
        accessorKey: "sold",
        header: "sold",
    },

    {
        accessorKey: "refund",
        header: "refund",
    },
    {
        accessorKey: "turnOver",
        header: "turnOver",
    },
    {
        accessorKey: "financeApp",
        header: "financeApp",
    },
    {
        accessorKey: "approved",
        header: "approved",
    },
    {
        accessorKey: "signed",
        header: "signed",
    },

    {
        accessorKey: "pickUpSet",
        header: "pickUpSet",
    },
    {
        accessorKey: "demoed",
        header: "demoed",
    },

    {
        accessorKey: "tradeMake",
        header: "tradeMake",
    },
    {
        accessorKey: "tradeYear",
        header: "tradeYear",
    },
    {
        accessorKey: "tradeTrim",
        header: "tradeTrim",
    },
    {
        accessorKey: "tradeColor",
        header: "tradeColor",
    },
    {
        accessorKey: "tradeVin",
        header: "tradeVin",
    },
    {
        accessorKey: "delivered",
        header: "delivered",
    },
    {
        accessorKey: "desiredPayments",
        header: "desiredPayments",
    },
    {
        accessorKey: "result",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Result" />
        ), cell: ({ row }) => {

            return <div className="text-center w-[250px] font-medium">
                Result
            </div>
        },

    },
    {
        accessorKey: "referral",
        header: "referral",
    },
    {
        accessorKey: "metService",
        header: "metService",
    },

    {
        accessorKey: "metManager",
        header: "metManager",
    },
    {
        accessorKey: "metParts",
        header: "metParts",
    },
    {
        accessorKey: "timesContacted",
        header: "timesContacted",
    },

    {
        accessorKey: "visits",
        header: "visits",
    },
    {
        accessorKey: "financeApplication",
        header: "financeApplication",
    },
    {
        accessorKey: "progress",
        header: "progress",
    },

    {
        accessorKey: "metFinance",
        header: "metFinance",
    },
    {
        accessorKey: "metSalesperson",
        header: "metSalesperson",
    },
    {
        accessorKey: "seenTrade",
        header: "seenTrade",
    },
    {
        accessorKey: "docsSigned",
        header: "docsSigned",
    },
    {
        accessorKey: "tradeRepairs",
        header: "tradeRepairs",
    },
    {
        accessorKey: "tradeValue",
        header: "tradeValue",
    },
    {
        accessorKey: "modelCode",
        header: "modelCode",
    },
    {
        accessorKey: "color",
        header: "color",
    },
    {
        accessorKey: "model1",
        header: "model1",
    },
    {
        accessorKey: "stockNum",
        header: "stockNum",
    },
    {
        accessorKey: "otherTaxWithOptions",
        header: "otherTaxWithOptions",
    },
    {
        accessorKey: "totalWithOptions",
        header: "totalWithOptions",
    },
    {
        accessorKey: "otherTax",
        header: "otherTax",
    },
    {
        accessorKey: "qcTax",
        header: "lastContact",
    },
    {
        accessorKey: "deposit",
        header: "tradeValue",
    },
    {
        accessorKey: "rustProofing",
        header: "modelCode",
    },
    {
        accessorKey: "lifeDisability",
        header: "color",
    },
    {
        accessorKey: "userServicespkg",
        header: "model1",
    },
    {
        accessorKey: "userExtWarr",
        header: "userExtWarr",
    },
    {
        accessorKey: "userGap",
        header: "userGap",
    },
    {
        accessorKey: "userTireandRim",
        header: "userTireandRim",
    },
    {
        accessorKey: "userLoanProt",
        header: "userLoanProt",
    },
    {
        accessorKey: "deliveryCharge",
        header: "lastContact",
    },
    {
        accessorKey: "onTax",
        header: "tradeValue",
    },
    {
        accessorKey: "total",
        header: "modelCode",
    },
    {
        accessorKey: "typeOfContact",
        header: "typeOfContact",
    },
    {
        accessorKey: "contactMethod",
        header: "contactMethod",
    },
    {
        accessorKey: "note",
        header: "note",
    },



]


export const fuzzyFilter: FilterFn<Payment> = (
    row,
    columnId,
    value,
    addMeta
) => {
    // Rank the item
    const itemRank = rankItem(row.getValue(columnId), value)

    // Store the ranking info
    addMeta(itemRank)

    // Return if the item should be filtered in/out
    return itemRank.passed
}

export const fuzzySort: SortingFn<Payment> = (rowA, rowB, columnId) => {
    let dir = 0

    // Only sort by rank if the column has ranking information
    if (rowA.columnFiltersMeta[columnId]) {
        dir = compareItems(
            rowA.columnFiltersMeta[columnId]! as RankingInfo,
            rowB.columnFiltersMeta[columnId]! as RankingInfo
        )
    }

    // Provide an alphanumeric fallback for when the item ranks are equal
    return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir
}
