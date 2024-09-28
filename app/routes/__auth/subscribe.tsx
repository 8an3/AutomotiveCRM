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
    NavLink,
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

export const dealerCard = [
    { description: "Why should you choose this crm? I'm just going to give it to you straight, it's better, period. I'm a sales person, have been my whole life. When I know every script, rebuttal and overcome a sales person can learn, how else can I improve and make more money? This was the biggest crux to fix and I'm sick and tired of crm's wasting my time, making me do more steps in the sales process that arent needed. Or not even addressing the the bigger ones. I've always pushed to be the best, and thats what you will get. If your sales staff don't see an improvment in effeciency in their day to day, which in turn increases their sales by allowing them to complete more of them, you get your money back. I'm that confident.", },
    { description: "Already have a crm and dont want to upset the dynamic of your entire store? No problem, you can just have your sales team, or just your top sales people use it. If we are not integrated with your current crm, we can quickly connect our app to your crm and it would look like they were still using the original crm. That way, theres no disruption.", },
    { description: "I've counted the minutes crm's waste, and its mind boggling. 9 out of 10 products on the market are a waste of time and money. And I'm talking about the biggest products on the market. Or maybe your just an average store that does average sales, then this is an even better product for you. It doesn't cost as much as the 'bigger' brand names, with more features out of the gate. I not only made the near perfect crm for sales people (since I'm always improving it), I took that same attitude to every position in the dealer. The owner shouldn't have to look at the same dash as the sales people and try to decipher a bunch of data to get information they need to make informed decisions on sales and such. No two positions in the dealer need the same data.", },
    { description: "Lets be honest, the sales part of the crm is better then the parts or service depts. They complain even more, and they should. It shouldn't take 5 minutes to find the information to answer a simple question. Navigating 32 pages to see if something is in stock for a unit. So I tailor made every position/role's section of the app and they will be able to expect a lot better experience.", },
    { description: "There are tools in my crm, that you cannot find in any other product on the market. With that said, it doesn't make sense to go with a competing product because you would be doing yourself a disservice. Your getting more for your money, lets be real a lot of crm companies charge an actual arm and a leg, at a cheaper rate. Ontop of that theres's no contract, you can walk at any time.", },
]

export const salesCard = [
    { description: "Experience the only CRM on the market designed to empower every salesperson, regardless of your current CRM provider. While we may not have every integration yet, if your current provider isn't on our list, sign up, and we'll prioritize integrating it promptly.", },
    { description: "Say goodbye to countless hours wasted on repetitive tasks in your dealership without needing management's permission. Our CRM acts like a new 'skin' or interface, replacing your dashboard to make your job more efficient and help you outsell everyone else. Whether you want to achieve more or prefer spending time on other activities, our CRM adapts to your needs.", },
    { description: "While the salesperson's version may lack some functionalities compared to the full dealership version, convincing management to change the entire CRM system might be as challenging as selling cars in Thailand without speaking the language. ", },
    { description: "However, adopting our CRM will significantly elevate your sales game, surpassing the impact of the last five sales training sessions. Guaranteed to be the most significant change in your career, whether you're a newcomer, a sales superstar, or a seasoned salesperson who isn't tech-savvy. You'll undoubtedly see a remarkable increase—Just read the upcoming story about wasting time with mass emails. ", },

];


export function DealerPrice() {
    return (
        <>

            <fieldset className="mx-auto grid h-auto max-h-[600px] overflow-y-auto w-[400px] rounded-lg border border-border p-4 ">
                <legend className="-ml-1 px-1 text-lg font-medium text-foreground">
                    Dealer
                </legend>
                <br className="my-1" />
                <div className="mx-auto flex w-[70%] justify-center">
                    <ul className="mx-auto mt-2 grid gap-3 text-sm">
                        {dealerFeatures.map((feature, index) => (
                            <li
                                key={index}
                                className="flex items-center justify-between"
                            >
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <span className="cursor-pointer text-left text-foreground">
                                            {feature.name}
                                        </span>
                                    </TooltipTrigger>
                                    <TooltipContent className='w-[200px] bg-background border-border'>
                                        <p>{feature.description}</p>
                                    </TooltipContent>
                                </Tooltip>
                                <span>
                                    <FaCheck
                                        strokeWidth={1.5}
                                        className="ml-2 text-lg text-[#22ff40]"
                                    />
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="items-end">
                    <Separator className="w-[90%] text-center text-border bg-border mt-5 mx-auto" />
                    <h4 className="text-foreground mt-5 text-center">
                        Subscribe Now for Just $449.95 Per Month.
                    </h4>
                    <div className="flex justify-center">
                        <a
                            href="https://buy.stripe.com/eVa01v0aLfDP4WkfZ0"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 lg:ml-2 lg:mt-0"
                        >
                            <Button
                                size="sm"
                                className="mx-auto mt-3 rounded-md bg-primary p-2 text-foreground"
                            >
                                Continue
                            </Button>
                        </a>
                    </div>
                </div>
                <div className='mt-[35px] flex items-center'>
                    <p className='text-muted-foreground mr-2'>Still unsure? Click</p>
                    <NavLink to='/testDrive' className='text-muted-foreground '>
                        Here...
                    </NavLink>
                </div>
            </fieldset>
        </>
    )
}
export function SalespersonPrice() {
    return (
        <>
            <fieldset className="mx-auto grid h-auto max-h-[600px] overflow-y-auto w-[400px]  rounded-lg border border-border p-4 lg:mr-2 ">
                <legend className="-ml-1 px-1 text-lg font-medium text-foreground">
                    Sales People
                </legend>
                <div className="mx-auto flex w-[60%] justify-center">
                    <ul className="mx-auto mt-2 grid gap-3 text-sm">
                        {salesFeatures.map((feature, index) => (
                            <li key={index} className="flex items-center justify-between">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <span className="text-foreground text-left cursor-pointer">
                                            {feature.name}
                                        </span>
                                    </TooltipTrigger>
                                    <TooltipContent className='bg-background border-border text-foreground'>
                                        <p>{feature.description}</p>
                                    </TooltipContent>
                                </Tooltip>
                                <span>
                                    <FaCheck
                                        strokeWidth={1.5}
                                        className="ml-2 text-lg text-[#22ff40]"
                                    />
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="items-end">
                    <Separator className="mt-5 w-[90%] text-center text-border mx-auto border-border bg-border" />
                    <h4 className="mt-5 text-foreground">
                        Subscribe Now for Just $49.95 Per Month.
                    </h4>
                    <div className="flex justify-center">
                        <a
                            href="https://buy.stripe.com/bIYaG9f5Fbnz74s5kn"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="lg:mr-2"
                        >
                            <Button
                                size="sm"
                                className="mx-auto mt-3 rounded-md bg-primary p-2 text-foreground"
                            >
                                Continue
                            </Button>
                        </a>

                    </div>
                </div>
            </fieldset>
        </>
    )
}


export const salesFeatures = [
    { name: "Dashboard", description: "Overview of your activities" },
    { name: "Sales Tracker", description: "Track your sales performance" },
    { name: "Sales Calendar", description: "Keep track of your sales events" },
    { name: "Script Builder", description: "Create and manage sales scripts" },
    { name: "Document Builder", description: "Generate sales documents" },
    {
        name: "Customer Wish List Dashboard",
        description: "Manage customer wish lists",
    },
    {
        name: "Instantly generate all your docs",
        description: "Quick document generation",
    },
    { name: "Template Builder", description: "Create and manage templates" },
    { name: "Email Client", description: "Integrated email client" },
    {
        name: "CRM Integration",
        description: "Integrate with other CRM systems",
    },
    {
        name: "Payment Calculator",
        description: "Calculate payments for customers",
    },
    {
        name: "Trade Evaluations - Coming Soon!",
        description: "Evaluate trade-ins (Coming Soon)",
    },
    { name: "Quote Builder", description: "Create and manage quotes" },
    { name: "Sales Presentation Page", description: "Sales presentation tool" },
    { name: "SMS Client", description: "Send and receive SMS messages" },
    {
        name: "Sales Statistics Breakdown",
        description: "Detailed sales statistics",
    },
    {
        name: "Hard to Soft Document Storage",
        description: "Store documents securely",
    },
    { name: "Voice Calling", description: "Make voice calls" },
];

export const dealerFeatures = [
    { name: "Dashboard", description: "Overview of your sales activities for the day, includes time saving methods that will save you 1000's of minuites over the course of the year." },
    { name: "Sales Tracker", description: "Track your sales performance" },
    { name: "Tailer made Sales Calendar", description: "Sales calendars typically suck, because the people who make them for sales people, arent sales people." },
    { name: "Script Builder", description: "Create and manage sales scripts" },
    { name: "Document Builder", description: "Generate sales documents, that are reusable for every single sale. Just need to make them once the first time, then at every sale just hit print." },
    { name: "Customer Wish List Dashboard", description: "Manage customer wish lists and get notified when it hits your inventory, so you never miss a sale again", },
    { name: "Instantly generate all your docs", description: "Generate all your docs at once without ever writing anything in again.", },
    { name: "Template Builder", description: "Create and manage templates to ensure fast follow-up times." },
    { name: "Email Client", description: "Integrated email client, so you don't have to leave the app to go over your email." },
    { name: "CRM Integration", description: "Integrate with other CRM systems, whether you already use another crm or not we can integrate our solution into any other crm to make sure you no longer waste time but don't have to switch the entire store over to a new crm in order to do so.", },
    { name: "Payment Calculator", description: "Quick payment calculator for the moments you need to be quick on your toes.", },
    { name: "Quote Builder", description: "Create and manage quotes in record timing. Can provide weekly, bi-weeekly, monthly payments in three different tax scenarios. Home Province, tax exempt, and custom taxes, to ensure you never have to redo another quote again due to the customer not being forth coming about what tax bracket they fall under." },
    { name: "Sales Presentation Page", description: "Sales presentation tool to give you a clean page to present your customer the deal in an easy to folow manner. That way your customer gets an accurate and concise quote from the get go and will have less questions while also giving you the ability to present with confidence with a straight forward approach. The customer feels more confident about the pricing with less questions, which means you waste less time explaining it to them." },
    { name: "Sales Statistics Breakdown", description: "Detailed sales statistics, to see where your at and where you can improve", },
    { name: "Hard to Soft Document Storage", description: "Store documents securely, store documents on the customers deal page so you can come back to them whenever you need them as many times as you want.", },
    { name: "Dept and General Staff Chat", description: "Internal chat for staff.", },
    { name: "Staff Scheduler / Store Hours", description: "Schedule your staff in the crm so your staff knows their schedule.", },
    { name: "Dept Leaderboards", description: "To instill an ever competitive attitude among the staff, with the ability to set goals and compare how your doing against eachother. Made in a way where you can compete, not dollar to dollar from each dept, but instead set goals attached to sales figures appropriate for each dept and see who can hit their depts goals month over month. So instead of seeing how much profit one made more than the other, which can be demotivating, it just shows how hard everyone pushed to complete their depts goals.", },
    { name: "Finance Dashboard", description: "Finance dept specific dashboard." },
    { name: "Finance Specific Processes To Streamline the Sales Flow", description: "", },
    { name: "Admin Section", description: "Administrative tools to manage your crm." },
    { name: "Manager Section", description: "Managerial tools to manage your staff and inventory" },
    { name: "Owner Section", description: "Managerial tools to manage your staff and inventory" },
    { name: "Inventory Dashboard - Automotive", description: "Manage your in stock and sold inventory." },
    { name: "Import / Export Data", description: "Any data you want at any time.", },
    { name: "Revolutionary sales to finance handoff process", description: "Never before seen in the auto industry, making the sales process seem like magic to the customer", },
    { name: "Cloud Based Setup", description: "No initial set-up or installation of any kind for our clients.", },
    { name: "API for Lead Generating Sources", description: "Want to try out a new lead generation campaign with a new company, just give them the api details and your all set.", },
    { name: "No more expensive weird, one off equipment", description: "No special inventory machines to log product, no special printers needed to print anything, no fancy scanners to scan product/unit barcodes", },
    { name: "Employee onboarding", description: "As soon as you add them, an email goes out to them explaining how to use the system." },
    { name: "Unit notifier", description: "Have a customer looking for a specific unit? Our in app notifier will reach out when when their desired product comes in." },
    // here now
    { name: "QR code system to easily get the information you need at the tap of a button", description: "Each receipt, work order or anything to do with a client will include a qr code so you can quickly scan it, either with your computer to pull up their file to work on when a client walks through the door, or your phone so you can work on the file on the go without needing a computer or workorder to refer to, has a plethora of other uses but too many to lsit here. Also removes the need for printed work orders to chase or keep track of.", },
    { name: "Synced between your phone and desktop", description: "For example, your looking at a customers unit outside with them and you pull up their order on your phone to make notes on work needed, once all work has been gone over with the vehicle and the client, you walk back inside with your client and open the orders page, with your clients file already pulled up and everything you noted outside, is already on their file. Or your in accessories, you have the customers order already up on your phone and as your helping your customer try things on and they agree to buy them, your already ringing up their items they want to purchase with your phone. When their done shopping, you can confirm the order with them on your phone or go to your computer and have the order pulled up with all the customers items already on their order, all they have to do is pay.", },
    { name: "Demo Day Dashboard - Coming Soon! - Here now!", description: "Book your clients in for your next demo day. (Coming Soon)", },
    { name: "Full Parts CRM and Inventory Mgt - Coming Soon! - Here now!", description: "Parts CRM and inventory management (Coming Soon)", },
    { name: "Full Acc CRM and Inventory Mgt - Coming Soon! - Here now!", description: "Accessories CRM and inventory management (Coming Soon)", },
    { name: "Mass Email - Coming Soon! - Here now!", description: "Unit just come in? Great, send an email blast.", },
    { name: "No more fancy equipment for scanning items, inventory etc - Here now!", description: "All you need is a cell phone or a simple webcam", },
    { name: "Task & Reminder Automation - Coming Soon! - Here now!", description: "Never forget a task again.", },
    { name: "Customizable Dealer CSI Reports - Coming Soon! - Here now!", description: "Dept specfic csi reports to see how your doing", },
    { name: "Customizable finance products - Coming Soon! - Here now!", description: "No longer have to wait for head office to input products", },
    { name: "Easy unit inventory managment for service- Coming Soon! - Here now!", description: "just take your cell phone, scan the unit's bar code thats it", },
    { name: "AI Booking Assistant - Extra Fees Apply - Coming Soon! - Here now!", description: "Generate so many leads you need help booking appointments, our ai assisntant can help book your clients in your schedule.." },
    { name: "AI Writing Partner - Extra Fees Apply - Here now!", description: "Dont know what to say, our AI can help write your next sales email." },
    { name: "Lead Rotation board - Coming Soon! - Here now!", description: "Automate lead rotation and walk-ins. finance and sales team", },
    { name: "Sales stats breakdowns - Coming Soon! - Here now!", description: "In an easy to digest format for any person looking at their stats. Instead of just looking at a huge wall of numbers, we display the stats in graphs and charts, we compare them to ones that make sense. Breaking down your entire process and showing where you can improve from day to day, to month to month. We do also have the big wall of stats if your into it though.", },
    { name: "Manager Dashboard - Coming Soon! - Here now!", description: "Dashboard for managers, one for each dept head (Coming Soon)", },
    { name: "Full Service CRM - Coming Soon! - Here now!", description: "Full service CRM (Coming Soon), from service writer to technician. Helping your team save time while giving clear instructions with work orders.", },
    { name: "Price display cards for units - Coming Soon! - Here now!", description: "Just hit print.", },
    { name: "Technician dashboard - Coming Soon! - Here now!", description: "Easily access all the information you need for each job, right at your terminal.", },
    { name: "Shipping and Receiving dashboard - Coming Soon! - Here now!", description: "To quickly get through and log incoming products.", },
    { name: "Waiters board for service- Coming Soon! - Here now!", description: "Get customers who want to wait for their work into the queue, once a tech is done with their job, they just take the next one right at their terminal.", },

    // extra fees

    { name: "Owner Dashboard - Coming Soon!", description: "Dashboard for owners (Coming Soon)", },
    { name: "Compaigns - Coming Soon!", description: "Set up and automate an advertising campaign to target your customers where they are specifically in the sales funnnel.", },
    { name: "Cross Platform Ad Manager - Coming Soon!", description: "Make one ad on our platform and push to al of your social media.", },
    { name: "Optional - In-House Infrastructure - Coming Soon!", description: "You would rather host your own server on site.", },
    { name: "Full Dealer Set-up - Extra Fees Apply", description: "Not good with technology and need help setting up all your employees in your dealer? No problem, were here to help.", },
    { name: "Voice Calling - Extra Fees Apply - Here now!", description: "Make voice calls straight from the dashboard to quickly go from call to call." },
    { name: "SMS Client - Extra Fees Apply - Here now!", description: "Send and receive SMS messages, right in the dashboard." },
    { name: "Speech To Text - Extra Fees Apply", description: "Slow at typing, no worries its a lot quicker to say an email than type it for a lot of people." },
    { name: "Trade Evaluations - Extra Fees Apply - Coming Soon!", description: "Trade in pricing from the kelley blue book integrated right into our quoting system.", },
    { name: "Payment processor - Coming Soon!", description: "Why bring in more program's when you dont need to?", },
    { name: "Theres more...", description: "Too many to continue listing them off...", },

];
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
    const isSubmitting = navigation.state === "loading";
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
                                                    className="mx-auto grid w-[400px]  rounded-lg p-4 hover:border-primary mr-10 "
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
                                                <fieldset className="mx-auto grid  w-[400px] gap-6 rounded-lg ml-10   p-4  hover:border-primary lg:h-full  " >
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
                                        <fieldset className="mx-auto grid h-[150px] w-[350px]  gap-6 rounded-lg border border-border p-4 ">
                                            <legend className="-ml-1 px-1 text-lg font-medium text-myColor-200">
                                                Once subscribed....
                                            </legend>
                                            <p className="scriptcardText mt-6 text-sm text-foreground">
                                                You may continue whenever your ready.
                                            </p>
                                            <NavLink to="/checksubscription">
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
                                                    className="ml-auto mt-5 w-auto cursor-pointer border-border text-foreground hover:text-primary"
                                                >
                                                    Continue
                                                </ButtonLoading>
                                            </NavLink>
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
