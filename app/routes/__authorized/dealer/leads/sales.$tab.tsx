import React, { HTMLAttributes, HTMLProps, useState, useEffect, Suspense, useRef, } from 'react'
import { Await, Form, Link, useActionData, useFetcher, useLoaderData, useLocation, useNavigation, useSubmit } from '@remix-run/react'
import { Input, Separator, Checkbox, PopoverTrigger, PopoverContent, Popover, Button, ScrollArea, Tabs, TabsList, TabsTrigger, TabsContent, Label, Select, SelectValue, SelectTrigger, SelectContent, SelectLabel, SelectItem, SelectGroup, } from "~/components/ui/index";
import { CaretSortIcon, ChevronDownIcon, DotsHorizontalIcon, } from "@radix-ui/react-icons"
import { getExpandedRowModel, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, getFacetedRowModel, getFacetedUniqueValues, getFacetedMinMaxValues, sortingFns } from "@tanstack/react-table";
import type {
    Table, Column, SortingFn, ColumnDef, ColumnFiltersState, SortingState, VisibilityState, FilterFn, ExpandedState, FilterFns,
} from "@tanstack/react-table";
import { toast } from "sonner"
import { Table as Table2, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "~/components/ui/table"
import { type LinksFunction, type DataFunctionArgs, json } from '@remix-run/node';
import { type RankingInfo, rankItem, compareItems, } from '@tanstack/match-sorter-utils'
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
import { ButtonLoading } from "~/components/ui/button-loading";
import AttemptedOrReached from "~/components/dashboard/calls/setAttOrReached";
import ContactTimesByType from "~/components/dashboard/calls/ContactTimesByType";
import LogCall from "~/components/dashboard/calls/logCall";
import Logtext from "~/components/dashboard/calls/logText";
import { Badge } from "~/ui/badge";
import WishList from '~/components/dashboard/wishlist/wishList'
import secondary from "~/styles/secondary.css";
import DemoDay from '~/components/dashboard/demoDay/demoDay';
import useSWR, { SWRConfig, mutate, useSWRConfig } from 'swr';
import Spinner from '~/components/shared/spinner';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "~/components/ui/card"
import SearchLeads from '~/components/dashboard/demoDay/searchLeads';
import { SmDataTable } from '~/components/smData-table';
import SmClientCard from '~/components/dashboard/calls/smClientCard';
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
} from "~/components/ui/dropdown-menu"
import WebLeads from '~/components/dashboard/demoDay/webLeads';
import { Mail, MessageSquare } from 'lucide-react';
import { Message, Conversation, Participant, Client, ConnectionState, Paginator, } from "@twilio/conversations";
import emitter from '~/routes/__authorized/dealer/emitter';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "~/components/ui/alert-dialog"
import axios from 'axios';
import PresetFollowUpDay from '~/components/dashboard/calls/presetFollowUpDay';
import { prisma } from '~/libs';
import IndeterminateCheckbox, { fuzzyFilter, fuzzySort, login, getToken, invariant, Loading, checkForMobileDevice, TableMeta, Filter, DebouncedInput, defaultColumn } from '~/components/actions/shared'

export const links: LinksFunction = () => [
    { rel: "stylesheet", href: secondary },
    { rel: "icon", type: "image/svg", sizes: "32x32", href: "/money24.svg", },
    { rel: "icon", type: "image/svg", sizes: "16x16", href: "/money16.svg", },
];

export let loader = dashboardLoader

export let action = dashboardAction

export default function Mainboard() {
    const { finance, searchData, user, getTemplates, callToken, conversationsData, convoList, newToken, email } = useLoaderData();

    const location = useLocation()
    const pathname = location.pathname
    const routeToTabIndex = {
        '/dealer/leads/sales/dashboard': "dashboard",
        '/dealer/leads/sales/newLeads': "newLeads",
        '/dealer/leads/sales/search': 'search',
        '/dealer/leads/sales/wishList': 'wishList',
        '/dealer/leads/sales/demoDay': 'demoDay',
    };
    const initialTabIndex = routeToTabIndex[location.pathname] || 0;
    const [selectedTab, setSelectedTab] = useState(initialTabIndex);
    useEffect(() => {
        const currentTabIndex = routeToTabIndex[location.pathname];
        if (currentTabIndex !== undefined) {
            setSelectedTab(currentTabIndex);
        }
    }, [location.pathname]);

    const handleTabChange = (index) => {
        const route = Object.keys(routeToTabIndex).find(key => routeToTabIndex[key] === index);
        if (route) {
            history.push(route);
        }
    };

    return (
        <div className='bg-background'>

            <Tabs defaultValue={selectedTab} onSelect={handleTabChange} className='mt-[50px] '>
                <div className=" hidden md:block ">
                    <TabsList className="ml-[5px]">
                        <TabsTrigger onClick={() => {
                            setSelectedTab("null")
                            setSelectedTab("dashboard")
                        }}
                            value="dashboard">Sales Dashboard</TabsTrigger>
                        <TabsTrigger onClick={() => {
                            setSelectedTab("null")
                            setSelectedTab("newLeads")
                        }}
                            value="newLeads">New Leads</TabsTrigger>
                        <TabsTrigger onClick={() => setSelectedTab("wishList")} value="wishList">Wish List</TabsTrigger>
                        <TabsTrigger onClick={() => setSelectedTab("demoDay")} value="demoDay">Demo Day</TabsTrigger>
                    </TabsList>
                </div>
                {selectedTab === "dashboard" && (
                    <TabsContent className="w-[98%] mx-auto mt-5" value="dashboard">
                        <MainDashbaord
                            user={user}
                        />
                    </TabsContent>
                )}
                {selectedTab === "newLeads" && (
                    <TabsContent className="w-[98%]" value="newLeads">
                        <WebLeads />
                    </TabsContent>
                )}
                {selectedTab === "wishList" && (
                    <TabsContent className="w-[98%]" value="wishList">
                        <WishList />
                    </TabsContent>
                )}
                {selectedTab === "demoDay" && (
                    <TabsContent className="w-[98%]" value="demoDay">
                        <DemoDay />
                    </TabsContent>
                )}
            </Tabs>


        </div>
    )
}

declare module '@tanstack/table-core' {
    interface FilterFns {
        fuzzy: FilterFn<unknown>
    }
    interface FilterMeta {
        itemRank: RankingInfo
    }
}

export async function getData(): Promise<dashBoardType[]> {

    //turn into dynamic route and have them call the right loader like q  uote qand overview
    const res = await fetch('/dealer/dashboard/calls/loader')
    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }
    return res.json();
}

export function MainDashbaord({ user }) {
    let username = 'skylerzanth'//localStorage.getItem("username") ?? "";
    let password = 'skylerzanth1234'//localStorage.getItem("password") ?? "";
    //const username = user?.username.toLowerCase().replace(/\s/g, '');//'skylerzanth'//localStorage.getItem("username") ?? "";
    //const password = 'skylerzanth1234'//localStorage.getItem("password") ?? "";
    const proxyPhone = '+12176347250'

    const { finance, searchData, getTemplates, callToken, conversationsData, convoList, newToken, email, columnState } = useLoaderData();
    const [data, setPaymentData,] = useState<dashBoardType[]>(finance);
    const [messagesConvo, setMessagesConvo] = useState([]);
    const [selectedChannelSid, setSelectedChannelSid] = useState([]);
    const [templates, setTemplates] = useState(getTemplates);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [conversationSID, setConversationSID] = useState('')
    const [loggedIn, setLoggedIn] = useState(user.email);
    const [statusString, setStatusString] = useState("Fetching credentials…");
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [text, setText] = useState('');

    let multipliedConvoList = [];
    for (let i = 0; i < 30; i++) {
        multipliedConvoList = multipliedConvoList.concat(convoList);
    }
    const [channels, setChannels] = useState(multipliedConvoList);
    const [currentConversation, setCurrentConversation] = useState(null);

    const [messages, setMessages] = useState(text);
    const [message, setMessage] = useState(messages || null);
    const [chatReady, setChatReady] = useState(false);

    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');

    const [isTyping, setIsTyping] = useState(true);

    const [newClient, setClient] = useState();
    const [newMessage, setNewMessage] = useState("");

    const [token, setToken] = useState(newToken);

    const [name, setName] = useState(username);
    const [to, setTo] = useState('');
    const [channelName, setChannelName] = useState('');
    const [from, setFrom] = useState('');
    const [conversation_sid, setConversation_sid] = useState('');
    const [smsMenu, setSmsMenu] = useState('true');
    const [sms, setSms] = useState(true);
    const [size, setSize] = useState(751);
    const [isLargeScreen, setIsLargeScreen] = useState(false);
    const [conversation, SetConversation] = useState('list');
    const [conversationsList, setConversationsList] = useState([])
    const [customer, setCustomer] = useState()
    let fetcher = useFetcher();
    const [convos, setConvos] = useState([])

    useEffect(() => {
        const data = async () => {
            const result = await getData();
            setPaymentData(result);
        };
        data()
    }, []);
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";
    const dataFetcher = (url) => fetch(url).then(res => res.json());
    const { data: swrData } = useSWR(isSubmitting ? 'http://localhost:3000/dealer/dashboard/calls/loader' : null, dataFetcher, {})

    useEffect(() => {
        if (swrData) {
            setPaymentData(swrData);
            console.log('hitswr!! ')
        }
    }, [swrData]);
    const iFrameRef: React.LegacyRef<HTMLIFrameElement> = useRef(null);



    const [open, setOpen] = useState(false);
    const [openSMS, setOpenSMS] = useState(false);
    const [customerEmail, setCustomerEmail] = useState('')
    const [customerName, setCustomerName] = useState('')
    const [customerfinanceId, setCustomerfinanceId] = useState('')
    const handleButtonClick = (rowData) => {
        setOpen(true);
        setCustomerEmail(rowData.email);
        setCustomerName(rowData.name);
        setCustomerfinanceId(rowData.financeId);
    };
    const getObjectById = (id) => { return searchData.find(item => item.id === id); };

    const [smsDetails, setSmsDetails] = useState([])

    const handleButtonClickSMS = async (data) => {
        const theFile = await getObjectById(data.clientfileId)
        const clientfileId = data.clientfileId
        const conversationId = theFile?.conversationId
        const messageDetails = {
            conversationId: conversationId,
            clientfileId: clientfileId,
            name: data.name,
            email: data.email,
            financeId: data.id,
            phone: data.phone,
            identity: `+1${user.phone}`,
        }
        setSmsDetails(messageDetails)
        setChannelName(data.author || conversationId)
        setSelectedChannelSid(conversationId);
        setOpenSMS(true);
    }
    const selectedChannel = Array.isArray(channels) ? channels.find((it) => it.sid === selectedChannelSid) : null;

    useEffect(() => {
        const initConversations = async () => {
            const token = callToken

            setTimeout(() => {
                const client = new Client(token);
                setClient(client);
                setStatusString("Connecting to Twilio…")

                client.on("connectionStateChanged", (state) => {
                    if (state === "connecting") {
                        setStatusString("Connecting to Twilio…")
                        setStatus("default")
                    }
                    if (state === "connected") {
                        setStatusString("You are connected.")
                        setStatus("success")
                        setLoading(false)
                        setLoggedIn(user.email)
                    }
                    if (state === "disconnecting") {
                        setStatusString("Disconnecting from Twilio…")
                        setChatReady(false)
                        setStatus("default")
                    }
                    if (state === "disconnected") {
                        setStatusString("Disconnected.",)
                        setChatReady(false)
                        setStatus("warning")
                    }
                    if (state === "denied") {
                        setStatusString("Failed to connect.",)
                        setChatReady(false)
                        setStatus("error")
                    }
                });

                client.on('tokenAboutToExpire', () => {
                    console.log('About to expire');
                    const username = 'skylerzanth'//localStorage.getItem("username") ?? "";
                    const password = 'skylerzanth1234'//localStorage.getItem("password") ?? "";
                    setName(username)
                    if (username.length > 0 && password.length > 0) {
                        getToken(username, password)
                            .then((token) => {
                                // login(token);
                                setToken(token)
                            })
                            .catch(() => {
                                localStorage.setItem("username", username);
                                localStorage.setItem("password", password);
                            })
                            .finally(() => {
                                setLoading(false);
                                setStatusString("Fetching credentials…");
                            });
                    }
                });
                client.on('tokenExpired', () => {
                    console.log('Token expired');
                    client.removeAllListeners();
                    const client2 = new Client(token);
                    setClient(client2);
                    setStatusString("Connecting to Twilio…")
                });
                client.on("conversationJoined", (conversation) => {
                    setChannels((prevChannels) => [...prevChannels, conversation]);
                });
                client.on("conversationLeft", (thisConversation) => {
                    setChannels((prevChannels) =>
                        prevChannels.filter((it) => it !== thisConversation)
                    );
                });
                client.on('typingStarted', (user) => {
                    console.log('typing..', user);
                    if (user.conversation.sid === currentConversation.sid) setIsTyping(true);
                });
                client.on('typingEnded', (user) => {
                    console.log('typing end..', user);
                    if (user.conversation.sid === currentConversation.sid) setIsTyping(false);
                });
            }, 10);

        }
        initConversations()
        setChatReady(true);
    }, []);

    let channelContent;
    const [state, setState] = useState({
        newMessage: '',
        channelProxy: selectedChannel,
        messages: [],
        loadingState: 'initializing',
        boundChannels: new Set(),
    });

    const messagesRef = useRef(null);

    function capitalizeFirstLetter(string) {
        return string[0].toUpperCase() + string.slice(1);
    }

    const columns: ColumnDef<Payment>[] = [
        {
            id: 'select',
            header: ({ table }) => (
                <div className='flex mx-auto my-auto'>
                    <IndeterminateCheckbox
                        checked={table.getIsAllRowsSelected()}
                        indeterminate={table.getIsSomeRowsSelected()}
                        onChange={table.getToggleAllRowsSelectedHandler()}
                        className='border-primary'
                    />
                </div>
            ),
            cell: ({ row }) => (
                <div className="px-1">
                    <IndeterminateCheckbox
                        checked={row.getIsSelected()}
                        indeterminate={row.getIsSomeSelected()}
                        onChange={row.getToggleSelectedHandler()}
                        className='border-primary'
                    />
                </div>
            ),
        },
        {
            id:'firstName',
            accessorKey: "firstName",
            filterFn: 'fuzzy',
            sortingFn: fuzzySort,
            header: ({ column }) => {
                return <>
                    <DataTableColumnHeader column={column} title="First Name" />
                </>
            },
            cell: ({ row }) => {
                const data = row.original
                return <div className="bg-transparent flex h-[45px] w-[175px] flex-1 cursor-pointer items-center justify-center px-5 text-center  text-[15px] leading-none  text-foreground  outline-none  transition-all duration-150 ease-linear target:text-primary  hover:text-primary  focus:text-primary focus:outline-none">
                    <ClientCard data={data} row={row} />
                </div>
            },


        },
        {
            id:'lastName',
            accessorKey: "lastName",
            filterFn: 'fuzzy',
            sortingFn: fuzzySort,
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="LastName" />
            ),
            cell: ({ row }) => {
                const data = row.original
                return <div className="bg-transparent flex w-[175px] flex-1 items-center justify-center px-5 text-center text-[15px]  leading-none text-foreground outline-none transition-all duration-150  ease-linear  first:rounded-tl-md  last:rounded-tr-md target:text-primary hover:text-primary focus:text-primary  focus:outline-none  active:bg-primary ">
                    {capitalizeFirstLetter((row.getValue("lastName")))}
                </div>
            },

        },
        {
            id:'status',
            accessorKey: "status",
            filterFn: 'equalsString',
            header: ({ column }) => {
                return <>
                    <DataTableColumnHeader column={column} title="Status" />
                </>
            },
            cell: ({ row }) => {
                const data = row.original
                return <div className="bg-transparent my-auto  flex h-[45px] flex-1 cursor-pointer items-center justify-center text-center text-[15px] uppercase leading-none text-foreground  outline-none transition-all duration-150 ease-linear target:text-primary hover:text-primary focus:text-primary focus:outline-none  active:bg-primary">
                    <ClientStatusCard data={data} />
                </div>
            },
        },
        {
            id:'nextAppointment',
            accessorKey: "nextAppointment",
            filterFn: 'equalsString',
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Next Appt" />
            ),
            cell: ({ row }) => {
                const data = row.original;
                return <div className="bg-transparent mx-1 flex h-[45px] w-[160px] flex-1 items-center justify-center px-5 text-center  text-[15px] uppercase leading-none text-foreground  outline-none  transition-all  duration-150 ease-linear target:text-primary hover:text-primary  focus:text-primary  focus:outline-none  active:bg-primary  ">
                    {String(data.nextAppointment)}
                </div>
            },
        },
        {
            id:'customerState',
            accessorKey: "customerState",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="State" />
            ), cell: ({ row }) => {
                const data = row.original
                //  const id = data.id ? data.id.toString() : '';
                return <div className="  flex h-[45px] w-[95%] items-center justify-center   text-[15px] uppercase leading-none outline-none transition-all duration-150 ease-linear target:text-primary hover:text-primary focus:text-primary focus:outline-none active:bg-primary">

                    {data.customerState === 'Pending' ? (<AttemptedOrReached data={data} />
                    ) : data.customerState === 'Attempted' ? (<AttemptedOrReached data={data} />
                    ) : data.customerState === 'Reached' ? (<Badge className="bg-[#29a383] text-foreground">Reached</Badge>
                    ) : data.customerState === 'sold' ? (<Badge className="bg-[#29a383] text-foreground">Sold</Badge>
                    ) : data.customerState === 'depositMade' ? (<Badge className="bg-[#29a383] text-foreground">Deposit</Badge>
                    ) : data.customerState === 'turnOver' ? (<Badge className="bg-[#0090ff]  text-foreground">Turn Over</Badge>
                    ) : data.customerState === 'financeApp' ? (<Badge className="bg-[#0090ff]  text-foreground">Application Done</Badge>
                    ) : data.customerState === 'approved' ? (<Badge className="bg-[#29a383] text-foreground">Approved</Badge>
                    ) : data.customerState === 'signed' ? (<Badge className="bg-[#29a383] text-foreground">Signed</Badge>
                    ) : data.customerState === 'pickUpSet' ? (<Badge className="bg-[#29a383] text-foreground">Pick Up Set</Badge>
                    ) : data.customerState === 'delivered' ? (<Badge className="bg-[#29a383] text-foreground">Delivered</Badge>
                    ) : data.customerState === 'refund' ? (<Badge className="bg-[#cf5454]">Refunded</Badge>
                    ) : data.customerState === 'funded' ? (<Badge className="bg-[#cf5454]">Funded</Badge>
                    ) : (
                        ''
                    )}
                </div>
            },
        },
        {
            id:'contact',
            accessorKey: "contact",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Contact" />
            ),
            cell: ({ row }) => {
                const data = row.original

                let channelContent

                if (selectedChannelSid) {
                    channelContent = selectedChannelSid
                } else if (statusString !== "success") {
                    channelContent = "Loading your chat!";
                } else {
                    channelContent = "";
                }
                return <>
                    <div className=' items-center grid grid-cols-3 gap-3'>
                        <LogCall
                            data={data}
                        />
                        <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => handleButtonClick(data)}
                            className="cursor-pointer text-foreground target:text-primary hover:text-primary" >
                            <Mail />
                        </Button>
                        <EmailClient
                            data={data}
                            open={open}
                            setOpen={setOpen}
                            customerfinanceId={customerfinanceId}
                            customerName={customerName}
                            customerEmail={customerEmail}
                        />
                        <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => {
                                handleButtonClickSMS(data)
                            }}
                            className="cursor-pointer text-foreground target:text-primary hover:text-primary" >
                            <MessageSquare />
                        </Button>
                        <Logtext
                            data={data}
                            searchData={searchData}
                            openSMS={openSMS}
                            setOpenSMS={setOpenSMS}
                            smsDetails={smsDetails}
                            text={text}
                            setText={setText}
                            conversationsData={conversationsData}
                            messagesConvo={messagesConvo}
                        />
                    </div>
                </>
            },
        },
        {
            id:'model',
            accessorKey: "model",
            filterFn: 'fuzzy',
            sortingFn: fuzzySort,
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Model" />
            ),
            cell: ({ row }) => {
                const data = row.original
                return <div className="w-[275px] cursor-pointer  text-center text-[14px]  text-foreground hover:text-primary">
                    <ClientVehicleCard data={data} />
                </div>
            },
        },
        {
            id:'tradeDesc',
            accessorKey: "tradeDesc",
            filterFn: 'fuzzy',
            sortingFn: fuzzySort,
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Trade" />
            ),
            cell: ({ row }) => {
                return <div className="bg-transparent text-foreground mx-1 flex h-[45px] w-[250px] flex-1 cursor-pointer items-center justify-center  px-5 text-center text-[13px] uppercase leading-none outline-none  transition-all  duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary  hover:text-primary  focus:text-primary  focus:outline-none active:bg-primary">{(row.getValue("tradeDesc"))}</div>
            },

        },
        {
            id:'twoDaysFromNow',
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
            id:'completeCall',
            accessorKey: "completeCall",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Complete Call" />
            ),
            cell: ({ row }) => {
                const data = row.original
                const contactMethod = data.contactMethod
                return <>

                    <div className='w-[125px] cursor-pointer'>

                        <CompleteCall data={data} user={user} />
                    </div>
                </>
            },
        },
        {
            id:'contactTimesByType',
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
            id:'pickUpDate',
            accessorKey: "pickUpDate",
            enableGlobalFilter: true,
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Pick Up Date" className="bg-transparent text-foreground mx-1 flex h-[45px] w-[175px] flex-1 cursor-pointer items-center justify-center  px-5 text-center text-[15px] uppercase leading-none outline-none  transition-all  duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary  hover:text-primary  focus:text-primary  focus:outline-none active:bg-primary " />
            ),
            cell: ({ row }) => {
                const data = row.original
                if (data.pickUpDate) {
                    const pickupDate = data.pickUpDate
                    return (
                        <div className="bg-transparent :text-primary text-grbg-transparent text-foreground mx-1 flex h-[45px] w-[150px] flex-1 cursor-pointer items-center justify-center px-5 text-center text-[15px] uppercase leading-none  outline-none  transition-all  duration-150 ease-linear last:rounded-tr-md target:text-primary  hover:text-primary  focus:text-primary  focus:outline-none active:bg-primary">
                            {pickupDate === '1969-12-31 19:00' || pickupDate === null ? 'TBD' : pickupDate}
                        </div>
                    );
                } else
                    return null;
            },
        },
        {
            id:'lastContact',
            accessorKey: "lastContact",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Last Contacted" className="bg-transparent text-foreground mx-1 flex h-[45px] w-[175px] flex-1 cursor-pointer items-center justify-center  px-5 text-center text-[15px] uppercase leading-none outline-none  transition-all  duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary  hover:text-primary  focus:text-primary  focus:outline-none active:bg-primary" />
            ),
            cell: ({ row }) => {
                const data = row.original
                const date = new Date(data.lastContact);
                const options = {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                };
                if (date) {
                    return (
                        <div className="bg-transparent text-foreground mx-1 flex h-[45px] w-[150px] flex-1 cursor-pointer items-center justify-center  px-5 text-center text-[15px] uppercase leading-none outline-none  transition-all  duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary  hover:text-primary  focus:text-primary  focus:outline-none active:bg-primary">
                            {date === 'TBD' ? <p>TBD</p> : date.toLocaleDateString('en-US', options)}
                        </div>
                    );
                }
                return null;
            },

        },
        {
            id:'unitPicker',
            accessorKey: "unitPicker",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Turnover" />
            ),
            cell: ({ row }) => {
                const data = row.original
                const lockedValue = Boolean(true)
                // eslint-disable-next-line react-hooks/rules-of-hooks
                const navigation = useNavigation();
                const isSubmitting = navigation.state === "submitting";
                const PromiseConst = async () => {
                    const promise = await new Promise(resolve => setTimeout(resolve, 3000));
                    return promise
                }
                PromiseConst()


                /**
                 * <FinanceTurnover data={data} lockedValue={lockedValue} />
                    <input type='hidden' name='intent' value='financeTurnover' />
                    <Form method='post' onSubmit={handleSubmit}>
                        <input type='hidden' name='locked' value={lockedValue} />
                        <input type='hidden' name='financeId' value={data.id} />
                    </Form>

                    *
                    */
                return <>
                    <div className='w-[175px] cursor-pointer'>
                        <Form method='post' >
                            <input type='hidden' name='intent' value='financeTurnover' />
                            <input type='hidden' name='locked' value={lockedValue} />
                            <input type='hidden' name='financeId' value={data.id} />
                            <ButtonLoading
                                size="lg"
                                className="w-auto cursor-pointer ml-auto mt-5 hover:text-primary"
                                type="submit"
                                isSubmitting={isSubmitting}
                                onClick={() => toast.success(`Informing finance managers of requested turnover...`)}
                                loadingText="Updating client info..."
                            >
                                Finance Turnover
                            </ButtonLoading>
                        </Form>
                    </div>
                </>
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
                        id:'email',
            accessorKey: "email",
            enableGlobalFilter: true,
            header: ({ column }) => (
                <p className="text-center">email</p>
            ),
            cell: ({ row }) => {
                return <div className="bg-transparent text-foreground mx-1 flex h-[45px] w-[95%] flex-1 cursor-pointer items-center justify-center  px-5 text-center text-[15px] uppercase leading-none outline-none  transition-all  duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary  hover:text-primary  focus:text-primary  focus:outline-none active:bg-primary">{(row.getValue("email"))}</div>
            },

        },
        {
                        id:'phone',
            accessorKey: "phone",
            enableGlobalFilter: true,
            header: ({ column }) => (
                <p className="text-center">phone</p>
            ), cell: ({ row }) => {
                return <div className="bg-transparent text-foreground mx-1 flex h-[45px] w-[95%] flex-1 cursor-pointer items-center justify-center  px-5 text-center text-[15px] uppercase leading-none outline-none  transition-all  duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary  hover:text-primary  focus:text-primary  focus:outline-none active:bg-primary">{(row.getValue("phone"))}</div>
            },

        },
        {
                        id:'address',
            accessorKey: "address",
            enableGlobalFilter: true,
            header: ({ column }) => (
                <p className="text-center">address</p>
            ), cell: ({ row }) => {
                return <div className="bg-transparent text-foreground mx-1 flex h-[45px] w-[95%] flex-1 cursor-pointer items-center justify-center  px-5 text-center text-[15px] uppercase leading-none outline-none  transition-all  duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary  hover:text-primary  focus:text-primary  focus:outline-none active:bg-primary">{(row.getValue("address"))}</div>
            },

        },
        {
                        id:'postal',
            accessorKey: "postal",
            header: ({ column }) => (
                <p className="text-center">postal</p>
            ), cell: ({ row }) => {
                return <div className="bg-transparent text-foreground mx-1 flex h-[45px] w-[95%] flex-1 cursor-pointer items-center justify-center  rounded px-5 text-center text-[15px] font-medium uppercase  leading-none  shadow outline-none transition-all duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary hover:text-primary
                  hover:shadow-md


                  focus:text-primary
                   focus:outline-none active:bg-primary">{(row.getValue("postal"))}</div>
            },

        },
        {
                        id:'city',
            accessorKey: "city",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="city" />
            ), cell: ({ row }) => {
                return <div className="bg-transparent text-foreground mx-1 flex h-[45px] w-[95%] flex-1 cursor-pointer items-center justify-center  rounded px-5 text-center text-[15px] font-medium uppercase  leading-none  shadow outline-none transition-all duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary hover:text-primary
                  hover:shadow-md


                  focus:text-primary
                   focus:outline-none active:bg-primary">{(row.getValue("city"))}</div>
            },

        },
        {
                        id:'province',
            accessorKey: "province",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="province" />
            ), cell: ({ row }) => {
                return <div className="bg-transparent text-foreground mx-1 flex h-[45px] w-[95%] flex-1 cursor-pointer items-center justify-center  rounded px-5 text-center text-[15px] font-medium uppercase  leading-none  shadow outline-none transition-all duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary hover:text-primary
                  hover:shadow-md


                  focus:text-primary
                   focus:outline-none active:bg-primary">{(row.getValue("province"))}</div>
            },

        },
        {
                        id:'financeId',
            accessorKey: "financeId",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="financeId" />
            ), cell: ({ row }) => {
                return <div className="w-[200px] text-center font-medium">{(row.getValue("financeId"))}</div>
            },

        },
        {
            id:'userEmail',
            accessorKey: "userEmail",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="userEmail" />
            ),
            cell: ({ row }) => {
                return <div className="bg-transparent text-foreground mx-1 flex h-[45px] w-[95%] flex-1 cursor-pointer items-center justify-center  rounded px-5 text-center text-[15px] font-medium uppercase  leading-none  shadow outline-none transition-all duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary hover:text-primary
                  hover:shadow-md


                  focus:text-primary
                   focus:outline-none active:bg-primary">{(row.getValue("userEmail"))}</div>
            },

        },
        {
            id:'pickUpTime',
            accessorKey: "pickUpTime",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Pick Up Time" />
            ),
            cell: ({ row }) => {
                return <div className="bg-transparent text-foreground mx-1 flex h-[45px] w-[125px] w-[95%] flex-1 cursor-pointer items-center  justify-center px-5 text-center text-[15px] uppercase leading-none  outline-none  transition-all  duration-150 ease-linear first:rounded-tl-md last:rounded-tr-md  target:text-primary  hover:text-primary  focus:text-primary focus:outline-none active:bg-primary ">
                    {(row.getValue("pickUpTime"))}
                </div>
            },

        },

        {
            id:'timeToContact',
            accessorKey: "timeToContact",
            header: "model1",
        },
        {
            id:'deliveredDate',
            accessorKey: "deliveredDate",
            header: "deliveredDate",
        },
        {
            id:'timeOfDay',
            accessorKey: "timeOfDay",
            header: "timeOfDay",
        },
        {
            id:'msrp',
            accessorKey: "msrp",
            header: "msrp",
        },
        {
            id:'freight',
            accessorKey: "freight",
            header: "freight",
        },
        {
            id:'pdi',
            accessorKey: "pdi",
            header: "pdi",
        },
        {
            id:'admin',
            accessorKey: "admin",
            header: "admin",
        },
        {
            id:'commodity',
            accessorKey: "commodity",
            header: "commodity",
        },
        {
            id:'accessories',
            accessorKey: "accessories",
            header: "accessories",
        },
        {
            id:'labour',
            accessorKey: "labour",
            header: "labour",
        },
        {
            id:'painPrem',
            accessorKey: "painPrem",
            header: "painPrem",
        },
        {
            id:'licensing',
            accessorKey: "licensing",
            header: "licensing",
        },






        {
            id: 'trailer',
            accessorKey: "trailer",
            header: "trailer",
        },
        {
            id: 'depositMade',
            accessorKey: "depositMade",
            header: "depositMade",
        },
        {
            id: 'months',
            accessorKey: "months",
            header: "months",
        },
        {
            id: 'iRate',
            accessorKey: "iRate",
            header: "iRate",
        },
        {
            id: 'on60',
            accessorKey: "on60",
            header: "on60",
        },
        {
            id: 'biweekly',
            accessorKey: "biweekly",
            header: "biweekly",
        },
        {
            id: 'weekly',
            accessorKey: "weekly",
            header: "weekly",
        },
        {
            id: 'qc60',
            accessorKey: "qc60",
            header: "qc60",
        },
        {
            id: 'biweeklyqc',
            accessorKey: "biweeklyqc",
            header: "biweeklyqc",
        },
        {
            id: 'weeklyqc',
            accessorKey: "weeklyqc",
            header: "weeklyqc",
        },
        {
            id: 'nat60',
            accessorKey: "nat60",
            header: "nat60",
        },
        {
            id: 'biweeklNat',
            accessorKey: "biweeklNat",
            header: "biweeklNat",
        },
        {
            id: 'weeklylNat',
            accessorKey: "weeklylNat",
            header: "weeklylNat",
        },
        {
            id: 'oth60',
            accessorKey: "oth60",
            header: "oth60",
        },
        {
            id: 'biweekOth',
            accessorKey: "biweekOth",
            header: "biweekOth",
        },
        {
            id: 'weeklyOth',
            accessorKey: "weeklyOth",
            header: "weeklyOth",
        },
        {
            id: 'nat60WOptions',
            accessorKey: "nat60WOptions",
            header: "nat60WOptions",
        },
        {
            id: 'desiredPayments',
            accessorKey: "desiredPayments",
            header: "desiredPayments",
        },
        {
            id: 'biweeklNatWOptions',
            accessorKey: "biweeklNatWOptions",
            header: "biweeklNatWOptions",
        },
        {
            id: 'weeklylNatWOptions',
            accessorKey: "weeklylNatWOptions",
            header: "weeklylNatWOptions",
        },
        {
            id: 'oth60WOptions',
            accessorKey: "oth60WOptions",
            header: "oth60WOptions",
        },
        {
            id: 'biweekOthWOptions',
            accessorKey: "biweekOthWOptions",
            header: "biweekOthWOptions",
        },
        {
            id: 'visited',
            accessorKey: "visited",
            header: "visited",
        },
        {
            id:'aptShowed',
            accessorKey: "aptShowed",
            header: "aptShowed",
        },
        {
            id:'bookedApt',
            accessorKey: "bookedApt",
            header: "bookedApt",
        },
        {
            id:'aptNoShowed',
            accessorKey: "aptNoShowed",
            header: "aptNoShowed",
        },
        {
            id:'testDrive',
            accessorKey: "testDrive",
            header: "testDrive",
        },
        {
            id:'metParts',
            accessorKey: "metParts",
            header: "metParts",
        },
        {
            id:'sold',
            accessorKey: "sold",
            header: "sold",
        },

        {
            id:'refund',
            accessorKey: "refund",
            header: "refund",
        },
        {
            id:'turnOver',
            accessorKey: "turnOver",
            header: "turnOver",
        },
        {
            id:'financeApp',
            accessorKey: "financeApp",
            header: "financeApp",
        },
        {
            id:'approved',
            accessorKey: "approved",
            header: "approved",
        },
        {
            id:'signed',
            accessorKey: "signed",
            header: "signed",
        },

        {
            id:'pickUpSet',
            accessorKey: "pickUpSet",
            header: "pickUpSet",
        },
        {
            id:'demoed',
            accessorKey: "demoed",
            header: "demoed",
        },

        {
            id:'tradeMake',
            accessorKey: "tradeMake",
            header: "tradeMake",
        },
        {
            id:'tradeYear',
            accessorKey: "tradeYear",
            header: "tradeYear",
        },
        {
            id:'tradeTrim',
            accessorKey: "tradeTrim",
            header: "tradeTrim",
        },
        {
            id:'tradeColor',
            accessorKey: "tradeColor",
            header: "tradeColor",
        },
        {
            id:'tradeVin',
            accessorKey: "tradeVin",
            header: "tradeVin",
        },
        {
            id:'delivered',
            accessorKey: "delivered",
            header: "delivered",
        },
        {
            id:'desiredPayments',
            accessorKey: "desiredPayments",
            header: "desiredPayments",
        },
        {
            id:'result',
            accessorKey: "result",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Result" />
            ), cell: ({ row }) => {

                return <div className="w-[250px] text-center font-medium">
                    Result
                </div>
            },

        },
        {
            id: 'referral',
            accessorKey: "referral",
            header: "referral",
        },
        {
            id: 'metService',
            accessorKey: "metService",
            header: "metService",
        },
        {
            id: 'metManager',
            accessorKey: "metManager",
            header: "metManager",
        },
        {
            id: 'metParts',
            accessorKey: "metParts",
            header: "metParts",
        },
        {
            id: 'timesContacted',
            accessorKey: "timesContacted",
            header: "timesContacted",
        },
        {
            id: 'visits',
            accessorKey: "visits",
            header: "visits",
        },
        {
            id: 'financeApplication',
            accessorKey: "financeApplication",
            header: "financeApplication",
        },
        {
            id: 'progress',
            accessorKey: "progress",
            header: "progress",
        },
        {
            id: 'metFinance',
            accessorKey: "metFinance",
            header: "metFinance",
        },
        {
            id: 'metSalesperson',
            accessorKey: "metSalesperson",
            header: "metSalesperson",
        },
        {
            id: 'seenTrade',
            accessorKey: "seenTrade",
            header: "seenTrade",
        },
        {
            id: 'docsSigned',
            accessorKey: "docsSigned",
            header: "docsSigned",
        },
        {
            id: 'tradeRepairs',
            accessorKey: "tradeRepairs",
            header: "tradeRepairs",
        },
        {
            id: 'tradeValue',
            accessorKey: "tradeValue",
            header: "tradeValue",
        },
        {
            id: 'modelCode',
            accessorKey: "modelCode",
            header: "modelCode",
        },
        {
            id: 'color',
            accessorKey: "color",
            header: "color",
        },
        {
            id: 'model1',
            accessorKey: "model1",
            header: "model1",
        },
        {
            id: 'stockNum',
            accessorKey: "stockNum",
            header: "stockNum",
        },
        {
            id: 'otherTaxWithOptions',
            accessorKey: "otherTaxWithOptions",
            header: "otherTaxWithOptions",
        },
        {
            id: 'totalWithOptions',
            accessorKey: "totalWithOptions",
            header: "totalWithOptions",
        },
        {
            id: 'otherTax',
            accessorKey: "otherTax",
            header: "otherTax",
        },
        {
            id: 'qcTax',
            accessorKey: "qcTax",
            header: "qcTax",
        },
        {
            id: 'deposit',
            accessorKey: "deposit",
            header: "deposit",
        },
        {
            id: 'rustProofing',
            accessorKey: "rustProofing",
            header: "rustProofing",
        },
        {
            id: 'lifeDisability',
            accessorKey: "lifeDisability",
            header: "lifeDisability",
        },
        {
            id: 'userServicespkg',
            accessorKey: "userServicespkg",
            header: "userServicespkg",
        },
        {
            id: 'userExtWarr',
            accessorKey: "userExtWarr",
            header: "userExtWarr",
        },
        {
            id: 'userGap',
            accessorKey: "userGap",
            header: "userGap",
        },
        {
            id: 'userTireandRim',
            accessorKey: "userTireandRim",
            header: "userTireandRim",
        },
        {
            id: 'userLoanProt',
            accessorKey: "userLoanProt",
            header: "userLoanProt",
        },
        {
            id: 'deliveryCharge',
            accessorKey: "deliveryCharge",
            header: "deliveryCharge",
        },
        {
            id: 'onTax',
            accessorKey: "onTax",
            header: "onTax",
        },
        {
            id: 'total',
            accessorKey: "total",
            header: "total",
        },
        {
            id:'typeOfContact',
            accessorKey: "typeOfContact",
            header: "typeOfContact",
        },
        {
            id:'contactMethod',
            accessorKey: "contactMethod",
            header: "contactMethod",
        },
        {
            id:'note',
            accessorKey: "note",
            header: "note",
        },



    ]
    const smColumns: ColumnDef<Payment>[] = [
        {
            accessorKey: "firstName",
            header: ({ column }) => {
                return <>
                    <DataTableColumnHeader column={column} title="First Name" />
                </>
            },
            cell: ({ row }) => {
                const data = row.original
                //
                return <div className="bg-transparent flex h-[45px] w-[175px] flex-1 cursor-pointer items-center justify-center px-5 text-center  text-[15px]   leading-none  text-foreground  outline-none  transition-all duration-150 ease-linear target:text-primary  hover:text-primary  focus:text-primary focus:outline-none">
                    <SmClientCard data={data} searchData={searchData} />
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
                return <div className="bg-transparent my-auto  flex h-[45px] flex-1 cursor-pointer items-center justify-center text-center text-[15px] uppercase leading-none text-foreground  outline-none transition-all duration-150 ease-linear target:text-primary hover:text-primary focus:text-primary focus:outline-none  active:bg-primary">
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

                const date = new Date(String());
                const options = {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                };

                return <div className="bg-transparent mx-1 flex h-[45px] w-[160px] flex-1 items-center justify-center px-5 text-center  text-[15px] uppercase leading-none text-foreground  outline-none  transition-all  duration-150 ease-linear target:text-primary hover:text-primary  focus:text-primary  focus:outline-none  active:bg-primary  ">
                    {String(data.nextAppointment)}
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
                return <div className="  flex h-[45px] w-[95%] items-center justify-center   text-[15px] uppercase leading-none outline-none transition-all duration-150 ease-linear target:text-primary hover:text-primary focus:text-primary focus:outline-none active:bg-primary">

                    {data.customerState === 'Pending' ? (<AttemptedOrReached data={data} />
                    ) : data.customerState === 'Attempted' ? (<AttemptedOrReached data={data} />
                    ) : data.customerState === 'Reached' ? (<Badge className="bg-[#29a383] text-foreground">Reached</Badge>
                    ) : data.customerState === 'sold' ? (<Badge className="bg-[#29a383] text-foreground">Sold</Badge>
                    ) : data.customerState === 'depositMade' ? (<Badge className="bg-[#29a383] text-foreground">Deposit</Badge>
                    ) : data.customerState === 'turnOver' ? (<Badge className="bg-[#0090ff]">Turn Over</Badge>
                    ) : data.customerState === 'financeApp' ? (<Badge className="bg-[#0090ff]">Application Done</Badge>
                    ) : data.customerState === 'approved' ? (<Badge className="bg-[#29a383] text-foreground">Approved</Badge>
                    ) : data.customerState === 'signed' ? (<Badge className="bg-[#29a383] text-foreground">Signed</Badge>
                    ) : data.customerState === 'pickUpSet' ? (<Badge className="bg-[#29a383] text-foreground">Pick Up Set</Badge>
                    ) : data.customerState === 'delivered' ? (<Badge className="bg-[#29a383] text-foreground">Delivered</Badge>
                    ) : data.customerState === 'refund' ? (<Badge className="bg-[#cf5454]">Refunded</Badge>
                    ) : data.customerState === 'funded' ? (<Badge className="bg-[#cf5454]">Funded</Badge>
                    ) : (
                        ''
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
                const [isButtonPressed, setIsButtonPressed] = useState(false);
                const handleLoad = () => {
                    const iFrameData = {
                        user,
                        searchData,
                        data
                    }
                    console.log(iFrameData, 'iFrameData')
                    iFrameRef.current?.contentWindow?.postMessage(iFrameData, '*');
                }
                return <>
                    <div className='my-2 grid grid-cols-3 gap-3'>
                        <LogCall data={data} />
                        <EmailClient data={data} setIsButtonPressed={setIsButtonPressed} isButtonPressed={isButtonPressed} />
                        <Button variant='ghost' onClick={handleLoad} className='my-auto mx-auto'>
                            <Logtext data={data} searchData={searchData} iFrameRef={iFrameRef} />
                        </Button>
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
                return <div className="w-[275px] cursor-pointer  text-center text-[14px]  text-foreground">
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
                return <div className="bg-transparent text-foreground mx-1 flex h-[45px] w-[250px] flex-1 cursor-pointer items-center justify-center  px-5 text-center text-[13px] uppercase leading-none outline-none  transition-all  duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary  hover:text-primary  focus:text-primary  focus:outline-none active:bg-primary">{(row.getValue("tradeDesc"))}</div>
            },

        },
        {
            accessorKey: "lastNote",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Last Note" />
            ),
            cell: ({ row }) => {
                return <div className="bg-transparent text-foreground mx-1 flex h-[45px] w-[95%] flex-1 cursor-pointer items-center justify-center  px-5 text-center text-[15px] uppercase leading-none outline-none  transition-all  duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary  hover:text-primary  focus:text-primary  focus:outline-none active:bg-primary">{(row.getValue("lastNote"))}</div>
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
                <DataTableColumnHeader column={column} title="Pick Up Date" className="bg-transparent text-foreground mx-1 flex h-[45px] w-[175px] flex-1 cursor-pointer items-center justify-center  px-5 text-center text-[15px] uppercase leading-none outline-none  transition-all  duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary  hover:text-primary  focus:text-primary  focus:outline-none active:bg-primary " />
            ),
            cell: ({ row }) => {
                const data = row.original
                if (data.pickUpDate) {
                    const pickupDate = data.pickUpDate
                    return (
                        <div className="bg-transparent :text-primary text-grbg-transparent text-foreground mx-1 flex h-[45px] w-[150px] flex-1 cursor-pointer items-center justify-center px-5 text-center text-[15px] uppercase leading-none  outline-none  transition-all  duration-150 ease-linear last:rounded-tr-md target:text-primary  hover:text-primary  focus:text-primary  focus:outline-none active:bg-primary">
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
                <DataTableColumnHeader column={column} title="Last Contacted" className="bg-transparent text-foreground mx-1 flex h-[45px] w-[175px] flex-1 cursor-pointer items-center justify-center  px-5 text-center text-[15px] uppercase leading-none outline-none  transition-all  duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary  hover:text-primary  focus:text-primary  focus:outline-none active:bg-primary" />
            ),
            cell: ({ row }) => {
                const data = row.original
                const date = new Date(data.lastContact);
                const options = {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                };
                if (date) {
                    return (
                        <div className="bg-transparent text-foreground mx-1 flex h-[45px] w-[150px] flex-1 cursor-pointer items-center justify-center  px-5 text-center text-[15px] uppercase leading-none outline-none  transition-all  duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary  hover:text-primary  focus:text-primary  focus:outline-none active:bg-primary">
                            {date === 'TBD' ? <p>TBD</p> : date.toLocaleDateString('en-US', options)}
                        </div>
                    );
                }
                return null;
            },

        },
        {
            accessorKey: "unitPicker",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Turnover" />
            ),
            cell: ({ row }) => {
                const data = row.original
                const lockedValue = Boolean(true)
                // eslint-disable-next-line react-hooks/rules-of-hooks
                const navigation = useNavigation();
                const isSubmitting = navigation.state === "submitting";
                const PromiseConst = async () => {
                    const promise = await new Promise(resolve => setTimeout(resolve, 3000));
                    return promise
                }
                PromiseConst()


                /**
                 * <FinanceTurnover data={data} lockedValue={lockedValue} />
                    <input type='hidden' name='intent' value='financeTurnover' />
                    <Form method='post' onSubmit={handleSubmit}>
                        <input type='hidden' name='locked' value={lockedValue} />
                        <input type='hidden' name='financeId' value={data.id} />
                    </Form>

                    *
                    */
                return <>
                    <div className='w-[175px] cursor-pointer'>
                        <Form method='post' >
                            <input type='hidden' name='intent' value='financeTurnover' />
                            <input type='hidden' name='locked' value={lockedValue} />
                            <input type='hidden' name='financeId' value={data.id} />
                            <ButtonLoading
                                size="lg"
                                className="w-auto cursor-pointer ml-auto mt-5 hover:text-primary"
                                type="submit"
                                isSubmitting={isSubmitting}
                                onClick={() => toast.success(`Informing finance managers of requested turnover...`)}
                                loadingText="Updating client info..."
                            >
                                Finance Turnover
                            </ButtonLoading>
                        </Form>
                    </div>
                </>
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
                return <div className="bg-transparent text-foreground mx-1 flex h-[45px] w-[95%] flex-1 cursor-pointer items-center justify-center  px-5 text-center text-[15px] uppercase leading-none outline-none  transition-all  duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary  hover:text-primary  focus:text-primary  focus:outline-none active:bg-primary">{(row.getValue("email"))}</div>
            },

        },
        {
            accessorKey: "phone",
            header: ({ column }) => (
                <p className="text-center">phone</p>
            ), cell: ({ row }) => {
                return <div className="bg-transparent text-foreground mx-1 flex h-[45px] w-[95%] flex-1 cursor-pointer items-center justify-center  px-5 text-center text-[15px] uppercase leading-none outline-none  transition-all  duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary  hover:text-primary  focus:text-primary  focus:outline-none active:bg-primary">{(row.getValue("phone"))}</div>
            },

        },
        {
            accessorKey: "address",
            header: ({ column }) => (
                <p className="text-center">address</p>
            ), cell: ({ row }) => {
                return <div className="bg-transparent text-foreground mx-1 flex h-[45px] w-[95%] flex-1 cursor-pointer items-center justify-center  px-5 text-center text-[15px] uppercase leading-none outline-none  transition-all  duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary  hover:text-primary  focus:text-primary  focus:outline-none active:bg-primary">{(row.getValue("address"))}</div>
            },

        },
        {
            accessorKey: "postal",
            header: ({ column }) => (
                <p className="text-center">postal</p>
            ), cell: ({ row }) => {
                return <div className="bg-transparent text-foreground mx-1 flex h-[45px] w-[95%] flex-1 cursor-pointer items-center justify-center  rounded px-5 text-center text-[15px] font-medium uppercase  leading-none  shadow outline-none transition-all duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary hover:text-primary
                  hover:shadow-md


                  focus:text-primary
                   focus:outline-none active:bg-primary">{(row.getValue("postal"))}</div>
            },

        },
        {
            accessorKey: "city",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="city" />
            ), cell: ({ row }) => {
                return <div className="bg-transparent text-foreground mx-1 flex h-[45px] w-[95%] flex-1 cursor-pointer items-center justify-center  rounded px-5 text-center text-[15px] font-medium uppercase  leading-none  shadow outline-none transition-all duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary hover:text-primary
                  hover:shadow-md


                  focus:text-primary
                   focus:outline-none active:bg-primary">{(row.getValue("city"))}</div>
            },

        },
        {
            accessorKey: "province",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="province" />
            ), cell: ({ row }) => {
                return <div className="bg-transparent text-foreground mx-1 flex h-[45px] w-[95%] flex-1 cursor-pointer items-center justify-center  rounded px-5 text-center text-[15px] font-medium uppercase  leading-none  shadow outline-none transition-all duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary hover:text-primary
                  hover:shadow-md


                  focus:text-primary
                   focus:outline-none active:bg-primary">{(row.getValue("province"))}</div>
            },

        },
        {
            accessorKey: "financeId",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="financeId" />
            ), cell: ({ row }) => {
                return <div className="w-[200px] text-center font-medium">{(row.getValue("financeId"))}</div>
            },

        },
        {
            accessorKey: "userEmail",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="userEmail" />
            ),
            cell: ({ row }) => {
                return <div className="bg-transparent text-foreground mx-1 flex h-[45px] w-[95%] flex-1 cursor-pointer items-center justify-center  rounded px-5 text-center text-[15px] font-medium uppercase  leading-none  shadow outline-none transition-all duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary hover:text-primary
                  hover:shadow-md


                  focus:text-primary
                   focus:outline-none active:bg-primary">{(row.getValue("userEmail"))}</div>
            },

        },
        {
            accessorKey: "pickUpTime",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Pick Up Time" />
            ),
            cell: ({ row }) => {
                return <div className="bg-transparent text-foreground mx-1 flex h-[45px] w-[125px] w-[95%] flex-1 cursor-pointer items-center  justify-center px-5 text-center text-[15px] uppercase leading-none  outline-none  transition-all  duration-150 ease-linear first:rounded-tl-md last:rounded-tr-md  target:text-primary  hover:text-primary  focus:text-primary focus:outline-none active:bg-primary ">
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

                return <div className="w-[250px] text-center font-medium">
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

    //
    const [key, setKey] = useState(0);
    const [lockData, setLockData] = useState();
    const [financeData, setFinanceData] = useState();
    const submit = useSubmit();
    const [openResponse, setOpenResponse] = useState(false);

    useEffect(() => {
        const handleData = (msg, data) => {
            console.log('Received data:', data);
            setOpen(true)
            setLockData(data)
        };
        emitter.on('LOCKED_STATUS_RESPONSE', handleData);
        return () => {
            emitter.off('LOCKED_STATUS_RESPONSE', handleData);
        };
    }, []);

    const responseFetcher = async () => {
        const getLocked = await prisma.lockFinanceTerminals.findFirst({ where: { salesEmail: user.email, locked: false, response: false } })
        if (getLocked !== null) {
            setLockData(getLocked)
            setOpenResponse(true)
        }
    }

    const { data: locked, error } = useSWR(responseFetcher, {
        refreshInterval: 60000,
        revalidateOnMount: true,
        revalidateOnReconnect: true
    });

    useEffect(() => {
        if (locked) {
            setLockData(locked.locked)
            setFinanceData(locked.locked)
            setOpenResponse(true);
            console.log(lockData, financeData, 'data')
        }
    }, [locked]);

    if (error) {
        console.log('SWR error:', error);
    }

    const HandleButtonClick = async () => {
        const formData = new FormData();
        formData.append("claimId", lockData.lockedId);
        formData.append("intent", 'responseClientTurnover');
        const update = submit(formData, { method: "post" });
        setOpenResponse(false)
        return json({ update })
    };

    return (
        <div>
            <div className="block md:hidden">
                <SmDataTable columns={smColumns} data={data} />
            </div>
            <div className="hidden md:block">
                <DataTable
                    columns={columns}
                    data={data}
                    user={user}
                    columnState={columnState}
                />
            </div>
            {lockData && (
                <AlertDialog open={openResponse} onOpenChange={setOpenResponse}>
                    <AlertDialogContent className='border border-border bg-background text-foreground'>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Client Turnover - Response</AlertDialogTitle>
                            <AlertDialogDescription className='grid grid-cols-1'>
                                Finance Manager will take over client shortly.
                                Finance Manager: {lockData.financeEmail}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <div className="flex justify-end gap-[25px]">

                                <ButtonLoading
                                    size="sm"
                                    className="w-auto cursor-pointer ml-auto mt-5 hover:text-primary"
                                    type="submit"
                                    isSubmitting={isSubmitting}
                                    onClick={() => {
                                        HandleButtonClick()
                                        toast.success(`Claimed next customer...`)
                                    }}
                                    loadingText="Updating client info..."
                                >
                                    Claim
                                </ButtonLoading>

                            </div>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </div>
    )
}
export type Payment = {
    id: string
    fiannceId: string//
    userEmail: string//
    isSubmitting: any
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
    nextAppointment: string//
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

export const meta = () => {
    return [
        { title: 'Sales Leads - Dealer Sales Assistant' },
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
