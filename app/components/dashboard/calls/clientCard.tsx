/* eslint-disable tailwindcss/classnames-order */
import { Input, Separator, Button, Select, SelectValue, SelectTrigger, SelectContent, SelectLabel, SelectItem, SelectGroup, } from '~/components'
import React, { useState, useEffect, useRef } from "react";
import { Form, useLoaderData, useSubmit, Link, useFetcher, useNavigation } from '@remix-run/react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, } from "~/components/ui/accordion"
import { toast } from "sonner"
import { ClientDetailsFunction } from "~/components/lists/clientDetails";
import { ClientResultFunction, ClientStateFunction } from '~/components/lists/clientResultList';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger, } from "~/components/ui/sheet"
import MesasageContent from "./messageContent";
import { ButtonLoading } from "~/components/ui/button-loading";
import { testLeademail, testLeadPhone } from '~/routes/__authorized/dealer/api/activix';
import IndeterminateCheckbox from "~/components/dashboard/calls/InderterminateCheckbox"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "~/components/ui/popover"
import { Calendar } from "~/components/ui/calendarDob"
import { Calendar as RegCalendar } from "~/components/ui/calendar"
import { CalendarIcon } from "@radix-ui/react-icons"
import { cn } from "~/components/ui/utils"
import { format } from "date-fns"
import { FaSave } from 'react-icons/fa';
import { Truck } from 'lucide-react';

export default function ClientCard({ data }) {
    const [value, onChange] = useState(data.pickUpDate);
    const { user } = useLoaderData()
    let finance
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";
    const timerRef = useRef(0);
    const submit = useSubmit();
    const fetcher = useFetcher();

    useEffect(() => {
        return () => clearTimeout(timerRef.current);
    }, []);
    const [formData, setFormData] = useState({
        referral: data.referral,
        visited: data.visited,
        bookedApt: data.bookedApt,
        aptShowed: data.aptShowed,
        aptNoShowed: data.aptNoShowed,
        testDrive: data.testDrive,
        metService: data.metService,
        metManager: data.metManager,
        metParts: data.metParts,
        sold: data.sold,
        depositMade: data.depositMade,
        refund: data.refund,
        turnOver: data.turnOver,
        financeApp: data.financeApp,
        approved: data.approved,
        signed: data.signed,
        pickUpSet: data.pickUpSet,
        demoed: data.demoed,
        seenTrade: data.seenTrade,
        delivered: data.delivered,
    })
    const generateHiddenInputs = () => {
        return ClientResultFunction({ formData }).map((item) => (
            <input
                key={item.name}
                type="hidden"
                defaultValue={item.value === 'on' ? 'on' : 'off'}
                name={item.name}
            />
        ));
    };
    const generateHiddenInputsForState = () => {
        return ClientStateFunction().map((item) => {
            const isFirstInputOn = ClientResultFunction({ formData }).find((result) => result.name === item.name)?.value === 'on';
            return (
                <>
                    {isFirstInputOn && (
                        <input
                            key={`${item.name}-second`}
                            type="hidden"
                            defaultValue={item.value}
                            name="customerState"
                        />
                    )}
                </>
            );
        });
    };
    if (!data) {
        return null;
    }
    function ClientDetailsFunction() {
        let ClientDetails = [
            { name: "firstName", value: data.firstName, placeHolder: "First Name" },
            { name: "lastName", value: data.lastName, placeHolder: "Last Name" },
            { name: "phone", value: data.phone, placeHolder: "Phone" },
            { name: "email", value: data.email, placeHolder: "Email" },
            { name: "address", value: data.address, placeHolder: "Address" },
            { name: "city", value: data.city, placeHolder: "City" },
            { name: "province", value: data.province, placeHolder: "Province" },
            { name: "postal", value: data.postal, placeHolder: "Postal Code" },
            { name: "dl", value: data.dl, placeHolder: "Driver License" },
        ];
        return ClientDetails;
    }
    const [checkedItems, setCheckedItems] = useState({});
    const [date, setDate] = useState<Date>()
    const items = ClientResultFunction({ formData });
    const [checkedItems2, setCheckedItems2] = useState(
        items.reduce((acc, item) => {
            if (item.value === 'on' || new Date(item.value) > new Date('2022-01-01')) {
                acc[item.name] = item.value;
            }
            return acc;
        }, {})
    );
    const handleCheckboxChange2 = (name, isChecked) => {
        setCheckedItems2((prev) => {
            const updatedItems = { ...prev };
            if (isChecked) {
                updatedItems[name] = new Date().toISOString();
            } else {
                delete updatedItems[name];
            }
            return updatedItems;
        });
    };
    const formatDate2 = (dateString) => {
        const options = {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true,
        };
        return new Date(dateString).toLocaleString('en-US', options);
    };
    const [editProgress, setEditProgress] = useState(false)
    const isDate = (date) => !isNaN(date) && date instanceof Date;
    function capitalizeFirstLetter(string) {
        return string[0].toUpperCase() + string.slice(1);
    }
    return (
        <>
            <Sheet>
                <SheetTrigger asChild>
                    <p>{capitalizeFirstLetter(data.firstName)} </p>
                </SheetTrigger>
                <SheetContent side='left' className='bg-background text-foreground w-full md:w-[50%] overflow-y-auto border  border-border ' >
                    <Form method="post" >
                        <SheetHeader>
                            <SheetTitle>
                                <div className='flex justify-between text-foreground'>
                                    Edit Client Profile

                                </div>
                            </SheetTitle>
                            <SheetDescription className='text-foreground'>
                                Make changes to the profile here. Click save when you're done.
                            </SheetDescription>
                        </SheetHeader>
                        <div className="grid grid-cols-1  mt-3 w-[90%] mb-3 ">
                            {/* Content for the first column */}
                            {ClientDetailsFunction({ data, finance })
                                .map((fee, index) =>
                                (
                                    <div key={index} className="  mt-3">
                                        <div className="relative mt-3">
                                            <Input
                                                name={fee.name}
                                                defaultValue={fee.value}
                                                className='mt-2 h-8 text-foreground bg-background border-border'
                                            />
                                            <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">{fee.placeHolder}</label>
                                        </div>
                                    </div>
                                ))}

                            <Popover>
                                <PopoverTrigger asChild>
                                    <div className="relative mt-3">

                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-[100%] pl-3 text-left font-normal  ",
                                                !date && "text-muted-foreground"
                                            )}
                                        >
                                            {date ? (
                                                format(date, "PPP")
                                            ) : (
                                                <span>DOB not yet entered</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                        <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">DOB</label>
                                    </div>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        className='w-auto'
                                        mode="single"
                                        fromYear={1900}
                                        selected={date}
                                        onSelect={setDate}
                                        disabled={(date) =>
                                            date > new Date() || date < new Date("1900-01-01")
                                        }
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            <input type='hidden' value={String(date)} name='dob' />

                            <div className="relative mt-5">
                                <Select name='timeToContact' defaultValue={data.timeToContact}  >
                                    <SelectTrigger className="w-full  bg-background text-foreground border border-border" >
                                        <SelectValue defaultValue={data.timeToContact} />
                                    </SelectTrigger>
                                    <SelectContent className=' bg-background text-foreground border border-border' >
                                        <SelectGroup>
                                            <SelectLabel>Best Time To Contact</SelectLabel>
                                            <SelectItem value="Morning">Morning</SelectItem>
                                            <SelectItem value="Afternoon">Afternoon</SelectItem>
                                            <SelectItem value="Evening">Evening</SelectItem>
                                            <SelectItem value="Do Not Contact">Do Not Contact</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Preferred Time To Be Contacted</label>
                            </div>
                            <div className="relative mt-5">

                                <Select name='typeOfContact' defaultValue={data.typeOfContact} >
                                    <SelectTrigger className="w-full  bg-background text-foreground border border-border" >
                                        <SelectValue defaultValue={data.typeOfContact} />
                                    </SelectTrigger>
                                    <SelectContent className=' bg-background text-foreground border border-border' >
                                        <SelectGroup>
                                            <SelectLabel>Contact Method</SelectLabel>
                                            <SelectItem value="Phone">Phone</SelectItem>
                                            <SelectItem value="InPerson">In-Person</SelectItem>
                                            <SelectItem value="SMS">SMS</SelectItem>
                                            <SelectItem value="Email">Email</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Preferred Type To Be Contacted</label>
                            </div>

                            {data.depositMade && data.depositMade.length > 4 && (
                                <>
                                    {formData.delivered === 'on' && (<p className="mt-4">Delivered On</p>)}
                                    {formData.delivered === 'off' && (<p className="mt-4">Prefered Pick Up Date</p>)}

                                    <Separator className='w-[90%] mb-3' />

                                    {generateHiddenInputs()}
                                    {generateHiddenInputsForState()}
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-[100%] pl-3 text-left font-normal mt-3 ",
                                                    !date && "text-muted-foreground"
                                                )}
                                            >
                                                {date ? (
                                                    format(date, "PPP")
                                                ) : (
                                                    <span>Requested P/U Date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <RegCalendar
                                                className='w-[280px] mx-auto'
                                                mode="single"
                                                selected={value}
                                                onSelect={onChange}
                                                initialFocus
                                            />

                                            <Select>
                                                <SelectTrigger className="w-[80%] mx-auto mb-4 " name='pickUpTime' defaultValue={data.pickUpTime}>
                                                    <SelectValue placeholder="Select a time" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Times</SelectLabel>
                                                        <SelectItem value="9:00">9:00</SelectItem>
                                                        <SelectItem value="9:30">9:30</SelectItem>
                                                        <SelectItem value="10:00">10:00</SelectItem>
                                                        <SelectItem value="10:30">10:30</SelectItem>
                                                        <SelectItem value="11:00">11:00</SelectItem>
                                                        <SelectItem value="11:30">11:30</SelectItem>
                                                        <SelectItem value="12:00">12:00</SelectItem>
                                                        <SelectItem value="12:30">12:30</SelectItem>
                                                        <SelectItem value="1:00">1:00</SelectItem>
                                                        <SelectItem value="1:30">1:30</SelectItem>
                                                        <SelectItem value="2:00">2:00</SelectItem>
                                                        <SelectItem value="2:30">2:30</SelectItem>
                                                        <SelectItem value="3:00">3:00</SelectItem>
                                                        <SelectItem value="3:30">3:30</SelectItem>
                                                        <SelectItem value="4:00">4:00</SelectItem>
                                                        <SelectItem value="4:30">4:30</SelectItem>
                                                        <SelectItem value="5:00">5:00</SelectItem>
                                                        <SelectItem value="5:30">5:30</SelectItem>
                                                        <SelectItem value="6:00">6:00</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                            <input type="hidden" value={value} name="pickUpDate" />

                                        </PopoverContent>
                                    </Popover>
                                </>
                            )}
                            {/* Button Group */}
                            <Input type="hidden" defaultValue={data.userEmail} name="userEmail" />
                            <Input type="hidden" defaultValue={data.brand} name="brand" />
                            <input type='hidden' name='financeId' value={data.id} />
                            <input type='hidden' name='id' value={data.id} />
                            <input type='hidden' name='activixId' value={data.activixId} />
                            <input type='hidden' name='phoneId' value={data.phoneId} />
                            <input type='hidden' name='vehicleIdWanted' value={data.vehicleIdWanted} />
                            <input type='hidden' name='vehicleIdWTrade' value={data.vehicleIdWTrade} />
                            <input type='hidden' name='emailId' value={data.emailId} />
                        </div>
                        <ButtonLoading
                            size="sm"
                            value='updateFinance'
                            className="w-auto cursor-pointer ml-auto mt-3 hover:text-primary border-border"
                            name="intent"
                            type="submit"
                            isSubmitting={isSubmitting}
                            onClick={() => toast.success(`Quote updated for ${data.firstName}`)}
                            loadingText="Updating client info..."
                        >
                            Update
                        </ButtonLoading>
                    </Form>
                    <Accordion type="single" collapsible>
                        <AccordionItem value="1" className='mt-3'>
                            <AccordionTrigger className=' cursor-pointer'>
                                Result
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="">
                                    {editProgress === true && (
                                        <Form method="post">
                                            {items.map((item) => {
                                                const isChecked =
                                                    checkedItems2[item.name] !== undefined && checkedItems2[item.name] !== '';
                                                return (
                                                    <div key={item.name} className="flex justify-between items-center mt-3 mr-1">
                                                        <label htmlFor={item.name}>{item.label}</label>
                                                        <IndeterminateCheckbox
                                                            name={item.name}
                                                            indeterminate={checkedItems2[item.name] === undefined && isChecked}
                                                            checked={isChecked}
                                                            onChange={(e) => handleCheckboxChange2(item.name, e.target.checked)}
                                                            className="border-[#c72323]"
                                                        />
                                                        <input type="hidden" name={item.name} value={checkedItems2[item.name] ?? ''} />
                                                    </div>
                                                );
                                            })}
                                            <input type="hidden" defaultValue={data.id} name="financeId" />

                                            <ButtonLoading
                                                size="sm"
                                                value="updateClientInfoFinance"
                                                className="w-auto cursor-pointer ml-auto mt-5 mb-5 "
                                                name="intent"
                                                type="submit"
                                                isSubmitting={isSubmitting}
                                                onClick={() => toast.success(`${data.firstName}'s customer file is updated...`)}
                                                loadingText={`${data.firstName}'s customer file is updated...`}
                                            >
                                                Save
                                                <FaSave className="h-4 w-4 ml-2" />
                                            </ButtonLoading>
                                        </Form>
                                    )
                                    }
                                    {editProgress === false && (
                                        items
                                            .filter((item) => {
                                                const isChecked =
                                                    item.value === 'on' ||
                                                    (isDate(new Date(item.value)) && new Date(item.value) > new Date('2022-01-01'));
                                                return checkedItems[item.name] ?? isChecked;
                                            })
                                            .map((item) => {
                                                const isChecked =
                                                    item.value === 'on' ||
                                                    (isDate(new Date(item.value)) && new Date(item.value) > new Date('2022-01-01'));
                                                return (
                                                    <div key={item.name} className="flex justify-between items-center mt-1 mr-1">
                                                        <label className="text-muted-foreground" htmlFor={item.name}>{item.label}</label>
                                                        <span>{formatDate2(item.value)}</span>

                                                    </div>
                                                );
                                            })
                                    )}
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-8 gap-1 mr-3 mt-3"
                                        onClick={() => {
                                            setEditProgress((prevEditProgress) => !prevEditProgress)
                                        }}>
                                        <Truck className="h-3.5 w-3.5" />
                                        <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                                            Edit Progress
                                        </span>
                                    </Button>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                    <div className='flex justify-between mt-3'>
                        <Form method='post' >
                            <input type='hidden' name='unit' value={`${data.year} ${data.brand} ${data.model}`} />
                            <input type='hidden' name='salesEmail' value={user.email} />
                            <input type='hidden' name='customerName' value={data.firstName + ' ' + data.lastName} />
                            <input type='hidden' name='financeId' value={data.id} />
                            <ButtonLoading
                                size="sm"
                                className="w-auto cursor-pointer ml-auto mt-3 hover:text-primary border-border"
                                type="submit"
                                name='intent'
                                value='clientTurnover'
                                isSubmitting={isSubmitting}
                                onClick={() => toast.success(`Informing finance managers of requested turnover...`)}
                                loadingText="Reaching out to the finance dept..."
                            >
                                Finance Turnover
                            </ButtonLoading>
                        </Form>

                        <ButtonLoading
                            size="sm"
                            type="submit"
                            className="w-auto cursor-pointer mt-3 hover:text-primary border-border"
                            name="intent"
                            value="clientProfile"
                            isSubmitting={isSubmitting}
                            loadingText="Naivigating to Client File.."
                            onClick={() => {
                                const formData = new FormData();
                                formData.append("clientfileId", data.clientfileId);
                                formData.append("financeId", data.id);
                                formData.append("intent", 'goToClientfile');
                                submit(formData, { method: "post" });

                            }}
                        >
                            Client File
                        </ButtonLoading>
                        {data.activixId && (
                            <a href={`https://crm.activix.ca/leads/${data.activixId}`} target="_blank">
                                <ButtonLoading
                                    size="sm"
                                    type="submit"
                                    className="w-auto cursor-pointer ml-auto mt-3 hover:text-primary border-border"
                                    name="intent"
                                    value="clientProfile"
                                    isSubmitting={isSubmitting}
                                    loadingText="Naivigating to Client File.."
                                >
                                    Activix File
                                </ButtonLoading>
                            </a>
                        )}


                        <fetcher.Form method="post"  >
                            <input type='hidden' name='financeId' value={data.id} />
                            <input type='hidden' name='brand' value={data.brand} />
                            <input type='hidden' name='id' value={data.id} />
                            {data.model && (<input type='hidden' name='customerState' value='Reached' />)}
                            {data.model && (

                                <ButtonLoading
                                    size="sm"
                                    name='intent'
                                    value='returnToQuote'
                                    type='submit'
                                    className="w-auto cursor-pointer ml-auto mt-3 hover:text-primary border-border"
                                >
                                    Quote
                                </ButtonLoading>

                            )}
                        </fetcher.Form>
                        <fetcher.Form method="post"  >
                            <input type='hidden' name='financeId' value={data.id} />
                            <input type='hidden' name='brand' value={data.brand} />
                            <input type='hidden' name='id' value={data.id} />
                            <input type='hidden' name='clientId' value={data.id} />
                            {!data.model && (
                                <Button size='sm' name='intent' value='createQuote' type='submit' className="bg-primary cursor-pointer p-3 text-foreground active:bg-black font-bold uppercase   border border-border text-xs  rounded shadow hover:shadow-md outline-none focus:outline-none  ease-linear transition-all text-center duration-150">
                                    Create Quote
                                </Button>
                            )}
                        </fetcher.Form>
                    </div>

                </SheetContent>
            </Sheet >
        </>
    )
}

// onSubmit={handleSubmit} >
