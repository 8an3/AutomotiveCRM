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

    let salesCard = [
        { description: "Experience the only CRM on the market designed to empower every salesperson, regardless of your current CRM provider. While we may not have every integration yet, if your current provider isn't on our list, sign up, and we'll prioritize integrating it promptly.", },
        { description: "Say goodbye to countless hours wasted on repetitive tasks in your dealership without needing management's permission. Our CRM acts like a new 'skin' or interface, replacing your dashboard to make your job more efficient and help you outsell everyone else. Whether you want to achieve more or prefer spending time on other activities, our CRM adapts to your needs.", },
        { description: "While the salesperson's version may lack some functionalities compared to the full dealership version, convincing management to change the entire CRM system might be as challenging as selling cars in Thailand without speaking the language. ", },
        { description: "However, adopting our CRM will significantly elevate your sales game, surpassing the impact of the last five sales training sessions. Guaranteed to be the most significant change in your career, whether you're a newcomer, a sales superstar, or a seasoned salesperson who isn't tech-savvy. You'll undoubtedly see a remarkable increase—Just read the upcoming story about wasting time with mass emails. ", },

    ];

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


export const dealerCard = [
    { description: "Why should you choose this crm? I'm just going to give it to you straight, it's better, period. I'm a sales person, have been my whole life. When I know every script, rebuttal and overcome a sales person can learn, how else can I improve and make more money? This was the biggest crux to fix and I'm sick and tired of crm's wasting my time, making me do more steps in the sales process that arent needed. Or not even addressing the the bigger ones. I've always pushed to be the best, and thats what you will get. If your sales staff don't see an improvment in effeciency in their day to day, which in turn increases their sales by allowing them to complete more of them, you get your money back. I'm that confident.", },
    { description: "Already have a crm and dont want to upset the dynamic of your entire store? No problem, you can just have your sales team, or just your top sales people use it. If we are not integrated with your current crm, we can quickly connect our app to your crm and it would look like they were still using the original crm. That way, theres no disruption.", },
    { description: "I've counted the minutes crm's waste, and its mind boggling. 9 out of 10 products on the market are a waste of time and money. And I'm talking about the biggest products on the market. Or maybe your just an average store that does average sales, then this is an even better product for you. It doesn't cost as much as the 'bigger' brand names, with more features out of the gate. I not only made the near perfect crm for sales people (since I'm always improving it), I took that same attitude to every position in the dealer. The owner shouldn't have to look at the same dash as the sales people and try to decipher a bunch of data to get information they need to make informed decisions on sales and such. No two positions in the dealer need the same data.", },
    { description: "Lets be honest, the sales part of the crm is better then the parts or service depts. They complain even more, and they should. It shouldn't take 5 minutes to find the information to answer a simple question. Navigating 32 pages to see if something is in stock for a unit. So I tailor made every position/role's section of the app and they will be able to expect a lot better experience.", },
    { description: "There are tools in my crm, that you cannot find in any other product on the market. With that said, it doesn't make sense to go with a competing product because you would be doing yourself a disservice. Your getting more for your money, lets be real a lot of crm companies charge an actual arm and a leg, at a cheaper rate. Ontop of that theres's no contract, you can walk at any time.", },
]
