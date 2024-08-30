import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import {
    LinksFunction,
    type MetaFunction,
    DataFunctionArgs,
    V2_MetaFunction,
} from "@remix-run/node";
import {
    Form,
    Link,
    Links,
    LiveReload,
    useNavigation,
    Outlet,
    Scripts,
    ScrollRestoration,
    useFetcher,
    useFetchers,
    useLoaderData,
    useMatches,
    useSubmit,
} from "@remix-run/react";
import { ButtonLoading } from "~/components/ui/button-loading";
import { toast } from "sonner";
import { Separator } from "~/components";
import { FaCheck } from "react-icons/fa";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "~/components/ui/tooltip"
import { DealerPrice, salesCard, SalespersonPrice } from "~/routes/index";
import { dealerCard } from '../index';


export const meta: MetaFunction = ({ data }) => {
    return [
        { title: "Subscribe - Dealer Sales Assistant" },
        {
            property: "og:title",
            content: "Your very own assistant!",
        },
        {
            name: "description",
            content:
                "To help sales people achieve more. Every automotive dealer needs help, especialy the sales staff. Dealer Sales Assistant will help you close more deals more efficiently.",
            keywords: "Automotive Sales, dealership sales, automotive CRM",
        },
    ];
};


export default function Subscribe() {
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";
    const [sales, setSales] = useState(false);
    const [dealer, setDealer] = useState(false);



    return (
        <>
            <div className="centered-center flex bg-background px-4 py-12 sm:px-6 lg:px-8">
                <div className="h-full  w-full ">
                    <div className="md:flex">
                        <div className="mx-auto my-auto p-4">
                            <div className="mx-auto my-auto grid grid-cols-1	place-content-center">
                                <div className="item-4 scriptcard mx-auto my-auto grid grid-cols-1 justify-end ">
                                    <div className="text-center">
                                        <h2 className="scriptcardText mb-6 mt-6 text-3xl font-thin tracking-tight text-foreground  sm:mt-0 sm:text-4xl ">
                                            Subscription Plans
                                        </h2>
                                        <p className="scriptcardText text-[#fff]">
                                            Cancel at any time with no penalty.
                                        </p>
                                        <div className="mx-auto mb-[20px] mt-[35px] grid justify-center  lg:grid-cols-2 ">
                                            {sales ? (
                                                <SalespersonPrice />
                                            ) : (
                                                <fieldset
                                                    className="mx-auto grid w-[350px]  rounded-lg p-4 hover:border-primary  "
                                                >
                                                    <legend className="-ml-1 px-1 text-lg font-medium text-myColor-200">
                                                        Sales People
                                                    </legend>
                                                    <ul className="grid gap-3 text-sm mt-2">
                                                        {salesCard.map((item, index) => (
                                                            <li key={index} className="flex items-center justify-center">
                                                                <p className='text-left'>{item.description}</p>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                    <Button
                                                        onClick={() => setSales(true)}
                                                        size="sm"
                                                        className="mx-auto mt-3 rounded-md bg-primary p-2 text-foreground"
                                                    >
                                                        Continue
                                                    </Button>
                                                </fieldset>
                                            )}
                                            {dealer ? (
                                                <DealerPrice />
                                            ) : (
                                                <fieldset className="mx-auto grid  w-[350px] gap-6 rounded-lg   p-4  hover:border-primary lg:h-full  " >
                                                    <legend className="-ml-1 px-1 text-lg font-medium text-foreground">
                                                        Dealers
                                                    </legend>
                                                    <ul className="grid gap-3 text-sm mt-2">
                                                        {dealerCard.map((item, index) => (
                                                            <li key={index} className=" ">
                                                                <p className='text-left'>{item.description}</p>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                    <Button
                                                        size="sm"
                                                        onClick={() => setDealer(true)}
                                                        className="mx-auto mt-3 rounded-md bg-primary p-2 text-foreground"
                                                    >
                                                        Continue
                                                    </Button>

                                                </fieldset>
                                            )}
                                        </div>
                                        <fieldset className="mx-auto grid h-[150px] w-[350px] cursor-pointer gap-6 rounded-lg border border-white p-4 hover:border-primary">
                                            <legend className="-ml-1 px-1 text-lg font-medium text-myColor-200">
                                                Once subscribed....
                                            </legend>
                                            <p className="scriptcardText mt-6 text-sm text-[#fff]">
                                                You may continue inside.
                                            </p>
                                            <Link to="/checksubscription">
                                                <ButtonLoading
                                                    onClick={() =>
                                                        toast.success("Thank you for your business!")
                                                    }
                                                    size="lg"
                                                    name="intent"
                                                    value="returnToQuote"
                                                    type="submit"
                                                    isSubmitting={isSubmitting}
                                                    loadingText="Checking Subscription..."
                                                    className="ml-auto mt-5 w-auto cursor-pointer border-[#fff] text-[#fff] hover:text-primary"
                                                >
                                                    Continue
                                                </ButtonLoading>
                                            </Link>
                                        </fieldset>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
