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
import { DealerPrice, SalespersonPrice } from "~/routes/index";

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
            <div className="centered-center flex bg-black px-4 py-12 sm:px-6 lg:px-8">
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
                                                    className="mx-auto grid h-[650px] w-[90%] cursor-pointer rounded-lg border border-white p-4 hover:border-primary lg:w-[90%]"
                                                    onClick={() => setSales(true)}
                                                >
                                                    <legend className="-ml-1 px-1 text-lg font-medium text-myColor-200">
                                                        Sales People
                                                    </legend>
                                                    <p className="pt-[5px] text-center text-sm text-myColor-200">
                                                        Experience the only CRM on the market designed to
                                                        empower every salesperson, regardless of your
                                                        current CRM provider. While we may not have every
                                                        integration yet, if your current provider isn't on
                                                        our list, sign up, and we'll prioritize integrating
                                                        it promptly.
                                                    </p>
                                                    <br className="my-1" />
                                                    <p className="text-center text-sm text-myColor-200">
                                                        Say goodbye to countless hours wasted on repetitive
                                                        tasks in your dealership without needing
                                                        management's permission. Our CRM acts like a new
                                                        "skin" or interface, replacing your dashboard to
                                                        make your job more efficient and help you outsell
                                                        everyone else. Whether you want to achieve more or
                                                        prefer spending time on other activities, our CRM
                                                        adapts to your needs.
                                                    </p>
                                                    <br className="my-1" />
                                                    <p className="text-center text-sm text-myColor-200">
                                                        While the salesperson's version may lack some
                                                        functionalities compared to the full dealership
                                                        version, convincing management to change the entire
                                                        CRM system might be as challenging as selling cars
                                                        in Thailand without speaking the language.
                                                    </p>
                                                    <br className="my-1" />
                                                    <p className="text-center text-sm text-myColor-200">
                                                        However, adopting our CRM will significantly elevate
                                                        your sales game, surpassing the impact of the last
                                                        five sales training sessions. Guaranteed to be the
                                                        most significant change in your career, whether
                                                        you're a newcomer, a sales superstar, or a seasoned
                                                        salesperson who isn't tech-savvy. You'll undoubtedly
                                                        see a remarkable increase—Just read the upcoming
                                                        story about wasting time with mass emails.
                                                    </p>
                                                    <br className="my-1" />
                                                    <div className="items-end">
                                                        <div className="flex justify-center">
                                                            <Button
                                                                size="sm"
                                                                className="mx-auto mt-3 rounded-md bg-[#dc2626] p-2 text-foreground"
                                                            >
                                                                Continue
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </fieldset>
                                            )}
                                            {dealer ? (
                                                <DealerPrice />
                                            ) : (
                                                <fieldset
                                                    className="mx-auto grid h-[650px] w-[90%] cursor-pointer gap-6 rounded-lg border border-white p-4 hover:border-primary lg:h-full lg:w-[90%]"
                                                    onClick={() => setDealer(true)}
                                                >
                                                    <legend className="-ml-1 px-1 text-lg font-medium text-myColor-200">
                                                        Dealers
                                                    </legend>
                                                    <p className="px-8 text-sm text-myColor-200">
                                                        Increase your revenue and streamline training for
                                                        new hires by using our CRM. It's not just easier for
                                                        your employees but also provides an excellent way to
                                                        present and upsell to every customer.
                                                    </p>
                                                    <br className="my-1" />
                                                    <p className="px-8 text-sm text-myColor-200">
                                                        Experience quicker sales with fewer customer
                                                        questions. The easy-to-read information about the
                                                        deal makes customers happier. Your sales team can
                                                        effortlessly close deals without getting hung up on
                                                        questions or uncertainty through the process.
                                                    </p>
                                                    <br className="my-1" />
                                                    <p className="px-8 text-sm text-myColor-200">
                                                        Eliminate paperwork for your salespeople. Our system
                                                        handles all necessary paperwork, allowing your sales
                                                        team to hit print, and the system takes care of the
                                                        rest. Save time and boost profits across any
                                                        dealership.
                                                    </p>
                                                    <br className="my-1" />
                                                    <p className="px-8 text-sm text-myColor-200">
                                                        Discover more benefits by exploring our system. Stay
                                                        tuned for an in-depth video covering the entire
                                                        system and addressing how the industry has done us
                                                        wrong. If you're here, you're already moving in the
                                                        right direction. To top it off, we have one
                                                        advantage none of the CRM providers have.
                                                    </p>
                                                    <div className="items-end">
                                                        <div className="flex justify-center">
                                                            <Button
                                                                size="sm"
                                                                className="mx-auto mt-3 rounded-md bg-[#dc2626] p-2 text-foreground"
                                                            >
                                                                Continue
                                                            </Button>
                                                        </div>
                                                    </div>
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
