
import { useState, useEffect, } from 'react'
import canamIndex from '~/logos/canamIndex.png'
import manitouIndex from '~/logos/manitouIndex.png'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter, } from '~/components/ui/card'
import { Form, Link, useLocation, useLoaderData, useFetcher, Links } from '@remix-run/react';
import Overview from '~/images/overview.png'
import Salestracker from '~/images/salestracker.png'
import Features from '~/images/features.png'
import Dealerfees from '~/images/dealerfees.png'
import harleyDavidson from '~/logos/hd.png'
import activix from '~/logos/activix.svg'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion"
import Parts from '~/images/parts.png'
import Quoeimage from '~/images/quote.png'
import { Input, TooltipProvider, Tooltip, TooltipTrigger, TooltipContent, Label, Separator, Badge, RemixNavLinkText, } from "~/components/ui/index"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel"
import { NavigationMenuSales, mainNav } from '~/components/shared/navMenu'
import { AlertCircle } from 'lucide-react'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/components/ui/tabs"
import { cn } from "~/components/ui/utils"
import { Button, buttonVariants } from "~/components"
import { LinksFunction } from '@remix-run/server-runtime';
import { FaCheck } from "react-icons/fa";
import { dealerCard } from './__auth/subscribe';

export const links: LinksFunction = () => [
  { rel: "icon", type: "image/svg", sizes: "32x32", href: "/money24.svg", },
  { rel: "icon", type: "image/svg", sizes: "16x16", href: "/money16.svg", },
]

export default function Index() {
  return (
    <>
      <div className='bg-background'>
        <NavigationMenuSales />
        <AlertBox />
        <NewHeader />
        <NewSection />
        <Footer />
      </div>
    </>
  )
}
function AlertBox() {
  return (
    <div className='ite mx-auto mt-3 flex justify-center bg-background'>
      <div className='w-[75%] rounded-md border border-border'>
        <div className='m-3 flex items-center justify-center p-3'>
          <AlertCircle color="#ffffff" />
          <div className='ml-3'>
            <p className='text-foreground'>
              Heads up!
            </p>
            <p className='text-foreground'>
              Beta version of our new CRM is now available! Be some of the first to take advantage of our discounted pricing, limited spots for our beta program.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
function NewHeader() {
  return (
    <div className='bg-background mt-[60px]' >
      <div className="mx-auto max-w-2xl py-[55px] ">

        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            Generate vehicle pricing in less than 60 seconds or saving your sales people 125+ mins a day, individually
          </h1>
          <p className="mt-6 text-lg leading-8 text-foreground">
            Experience crystal-clear and effortlessly legible displays of weekly, bi-weekly, and monthly payment options, all while receiving a detailed breakdown of every dollar involved in the deal.
          </p>
          <p className="mt-6 text-lg leading-8 text-foreground">
            Along with numerous other processes to save you or your sales people time during the sales process. Check out our breakdown here.
          </p>
          <div className='flex justify-center'>
            <Link to='/demo/dashboard' >
              <Button size='sm' className='mx-auto bg-primary text-foreground  mt-3'>
                Continue
              </Button>
            </Link>
          </div>

          {/** <Form method="post" action="/emails/send/contact" className='mt-5 flex items-center  justify-center'>
            <Input name="email" placeholder="example@gmail.com" className='mr-2 w-[300px] border border-border bg-black text-foreground focus:border-primary' />

            <Button name='intent' value='demoInquiry' type='submit' className=" ml-2 mr-2 w-[75px]  rounded bg-primary  text-center text-xs font-bold   uppercase  text-foreground shadow outline-none transition-all duration-150  ease-linear hover:shadow-md focus:outline-none active:bg-background"
            >
              Email
            </Button>
          </Form> */}


        </div>
      </div>
    </div>
  )
}
const sections = [
  {
    title: "Want to see it in action?",
    paragraphs: [
      "Streamline the payment process with 3 distinct payment options tailored to different tax requirements. Ever had to painstakingly recalculate prices over the phone, only for the customer to reveal they're from out of town or tax-exempt, requiring you to start from scratch?",
      "Within these options, effortlessly present customers with 3 payments, monthly , bi-weekly, or weekly. While breaking down the differences in price involving gap coverage, tire and rim protection, and extended warranty. It's all right at your fingertips.",
      "Deliver pricing and payments swiftly to any customer by email, granting access to the manufacturer's site, specification sheets, dealer worksheets, customer worksheets, and even a contract for cash transactions closed on the spot. All within 40 seconds.",
    ],

    image: null,
  },
  {
    title: "Enhancing Your Workflow",
    paragraphs: [
      "Enter Customer Details Easily.",
      "Simplify Customer Data Entry.",
      "Each Brand Has Its Dedicated Page.",
    ],
    image: Quoeimage,
  },
  {
    title: "Dedicated Options Pages",
    paragraphs: [
      "Walk Through Each Option and Part with Your Customer for Maximum Profit.",
      "Never Miss Your Monthly Target Again."
    ],
    image: Parts,
  },
  {
    title: "Deliver Professionally Presentable Quotes",
    paragraphs: [
      "- Ensuring Every Customer Gains a Clear Breakdown with an Easy Line-by-Line Explanation.",
      "- Produces monthly, bi-weekly and weekly payments.",
      "- Customize Payments Instantly on the Spot, Including Trade Value, Discounts, Rates, Terms, and More.",
      "- Instantly Generates Pricing with and without Options (VIN Etching, Warranties, etc.), Including Predetermined Pricing.",
      "- Discount Area Conveniently Hidden, Yet Easily Accessible for Flexible Pricing Adjustments.",
      "- Dynamic Pricing and Payment Updates, No Reload Required.",
    ],
    image: Overview,
  },
  {
    paragraphs: [
      "- Instantly Generates Manufacturer Spec Sheets Directly from Their Website.",
      "- Instantly Access Model-Specific Manufacturer Pages with a Single Click.",
      "- Automatically Email Customers Price Breakdowns: Choose from Predetermined Templates or Customize the Email Body with Full-Featured Price Details.",
    ],
    image: Features,
  },
  {
    title: "Tailor-Made Dealer Fee Options",
    paragraphs: [
      "- Efficient Quoting with Accurate, Dealer-Specific Fee Inputs.",
    ],
    image: Dealerfees,
  },
  {
    title: "Coming Soon: Extras",
    paragraphs: [
      "- Sales Tracker - Year-Over-Year Sales Tracking.",
      "- Sales Calendar - Tailor made specfic for sales people to keep track of appointments. No matter how many calls you have booked you won't miss out on those important in person meetings, deliveries, walkarounds, F-I bookings, etc.",
      "- SMS - Send single or mass text messages to your client base.",
      "- Email - Using microsoft outlook as the providor, ensuring that most dealer's will already be set up.",
      "- Voice - Make phone calls right through the dash.",
      "- Template Builder - Have good scripts that you want to reuse, great send them with ease.",
      "- Document Builder - No more filling out paperwork, just click and all of your document needs will be done for you.",
    ],
    image: Salestracker,
  },
  {
    title: "Coming Soon: Innovative Dashboard",
    paragraphs: [
      "- While many dashboards can be time-wasting in most dealerships, our dashboard is designed to help you complete calls efficiently..",
      "- Customer-Specific Notes Section",
      "- Effortlessly Schedule Follow-Up Calls with a Single Click, Automatically Recorded in the System.",
    ],
    image: Dealerfees,
  },
  {
    title: "Coming Soon: Full CRM for sales dept.",
    paragraphs: [
      "- Waste less time and money on over priced, over promised CRM's",
      "- Developed by a sales staff, so you can have the confidence in getting a premium system for your sales staff.",
      "- Features will not be hidden behind paywalls, if we offer it you will have it with your subscription",
    ],
    image: Dealerfees,
  },
  // ... Add other sections here
];
export function Feature1() {
  // <video width="50%" muted autoPlay loop src={Indexvideo} />
  //
  return (
    <>

      <Carousel className=" mx-auto my-auto  w-[95%]" opts={{ loop: true, }}>
        <CarouselContent className=" rounded-md ">
          {sections.map((item, index) => (
            <CarouselItem className='h-auto   border-border' key={index}>
              <div className="p-1">
                <Card className='h-auto border-border'>
                  <CardContent className="flex  justify-center rounded-md  bg-background p-6">
                    <div className='grid grid-cols-2 items-center justify-between'>
                      <div className='justify-center'>
                        <h2 className="top-[50%] my-auto text-center text-2xl font-semibold text-foreground">{item.title}</h2>
                        {item.paragraphs.map((paragraph, i) => (
                          <p className='text-center text-foreground' key={i}>{paragraph}</p>
                        ))}
                      </div>
                      <img alt="logo" width='450' height='450' src={item.image} className='ml-[50px]' />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className='text-foreground' />
        <CarouselNext className='text-foreground' />
      </Carousel>
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

  // here now

  { name: "Manager Dashboard - Coming Soon!", description: "Dashboard for managers (Coming Soon)", },
  { name: "Owner Dashboard - Coming Soon!", description: "Dashboard for owners (Coming Soon)", },
  { name: "Full Service CRM - Coming Soon!", description: "Full service CRM (Coming Soon), from service writer to technician. Helping your team save time while giving clear instructions with work orders.", },
  { name: "Compaigns - Coming Soon!", description: "Set up and automate an advertising campaign to target your customers where they are specifically in the sales funnnel.", },
  { name: "Cross Platform Ad Manager - Coming Soon!", description: "Make one ad on our platform and push to al of your social media.", },
  { name: "Optional - In-House Infrastructure - Coming Soon!", description: "You would rather host your own server on site.", },


  { name: "Full Dealer Set-up - Extra Fees Apply", description: "Not good with technology and need help setting up all your employees in your dealer? No problem, were here to help.", },
  { name: "Voice Calling - Extra Fees Apply - Here now!", description: "Make voice calls straight from the dashboard to quickly go from call to call." },
  { name: "SMS Client - Extra Fees Apply - Here now!", description: "Send and receive SMS messages, right in the dashboard." },
  { name: "Speech To Text - Extra Fees Apply", description: "Slow at typing, no worries its a lot quicker to say an email than type it for a lot of people." },
  { name: "Trade Evaluations - Extra Fees Apply - Coming Soon!", description: "Trade in pricing from the kelley blue book integrated right into our quoting system.", },

  { name: "Payment processor - Coming Soon!", description: "Why bring in more program's when you dont need to?", },

  { name: "Theres more...", description: "But we can't seem to remember all of them to continue listing them off here...", },

];
export function DealerPrice() {
  return (
    <>
      <a
        href="https://buy.stripe.com/eVa01v0aLfDP4WkfZ0"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 lg:ml-2 lg:mt-0"
      >
        <fieldset className="mx-auto grid h-auto max-h-[600px] overflow-y-auto w-[400px] cursor-pointer rounded-lg border border-border p-4 hover:border-primary ">
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
                    <TooltipContent className='w-[200px]'>
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
            <hr className="w-[90%] text-center text-foreground mt-5" />
            <h4 className="text-foreground mt-5">
              Subscribe Now for Just $449.95 Per Month.
            </h4>
            <div className="flex justify-center">
              <Button
                size="sm"
                className="mx-auto mt-3 rounded-md bg-primary p-2 text-foreground"
              >
                Continue
              </Button>
            </div>
          </div>
        </fieldset>
      </a>
    </>
  )
}
export function SalespersonPrice() {
  return (
    <>
      <a
        href="https://buy.stripe.com/bIYaG9f5Fbnz74s5kn"
        target="_blank"
        rel="noopener noreferrer"
        className="lg:mr-2"
      >
        <fieldset className="mx-auto grid h-auto max-h-[600px] overflow-y-auto w-[400px] cursor-pointer rounded-lg border border-border p-4 hover:border-primary ">
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
                    <TooltipContent>
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
            <hr className="mt-5 w-[90%] text-center text-foreground" />
            <h4 className="mt-5 text-foreground">
              Subscribe Now for Just $49.95 Per Month.
            </h4>
            <div className="flex justify-center">
              <Button
                size="sm"
                className="mx-auto mt-3 rounded-md bg-primary p-2 text-foreground"
              >
                Continue
              </Button>
            </div>
          </div>
        </fieldset>
      </a>
    </>
  )
}
export function Mission() {
  return (
    <>
      <div className="text-foreground  md:w-1/2 mt-[25px] mx-auto">
        <fieldset className="grid gap-6 rounded-lg border p-4 mx-auto h-[850x] w-[550px]  border-border cursor-pointer " >
          <legend className="-ml-1 px-1 text-lg font-medium">Mission Statement</legend>
          <p className='px-[8px] pt-[5px] text-center text-sm  text-foreground '>
            Our mission is clear: We aim to empower salespeople everywhere with tools and resources that transcend the traditional approach of relying solely on salesmanship training. Whether it's your first day or your tenth year in sales, our goal is to provide universally accessible solutions that lead to improved sales performance.
          </p>
          <br className='my-1' />
          <p className='px-[8px]   text-center text-sm   text-foreground '>
            Our commitment goes beyond streamlining sales processes. In development, we're crafting a comprehensive dashboard that significantly reduces the time required to complete customer interactions and schedule follow-ups. This dashboard is designed to seamlessly integrate with various CRM systems, ensuring that you have all the necessary information at your fingertips for well-informed follow-up calls. No more navigating between pages or seeking additional resources; everything you need will be readily available to enhance your efficiency.
          </p>
          <br className='my-1' />
          <p className='px-[8px]    text-center  text-sm  text-foreground '>
            We firmly reject the notion of relying on vague or mystical 'secrets' to enhance sales performance, and we challenge the idea that only seasoned oratory experts can excel in sales. There is no mystical formula to sales success; it's a matter of equipping individuals with the right knowledge at the right time in their sales journey.
          </p>
          <br className='my-1' />
          <p className='px-[8px]    text-center text-sm   text-foreground '>
            We believe that every person has the potential to become a highly effective sales professional. This is not an abstract hope or wishful thinking; it's a verifiable fact. We've seen remarkable transformations, even among individuals who have faced significant challenges, such as those with criminal backgrounds. Instead of treating them with harsh judgment, we've taken a different approach, guiding them toward sales excellence and, in turn, improving various aspects of their lives.
          </p>
          <br className='my-1' />
          <p className='px-[8px]   text-center text-sm   text-foreground '>
            Our approach stands in stark contrast to traditional sales presentations where the speaker hopes that attendees will absorb even a small fraction of their teachings. We don't aspire for a handful out of a thousand to improve. Our mission is to empower each and every person to enhance their sales skills. We firmly believe that, given the right tools and guidance, anyone can become a successful salesperson.
          </p>
          <br className='my-1' />
          <p className='px-[8px]   text-center text-sm   text-foreground '>
            While we could charge premium prices similar to CRM systems once fully developed, our commitment to accessibility remains unwavering. We understand that affordability should not be a barrier to access the tools needed for continuous growth. Every salesperson deserves to have the resources required for success, a principle that drives us to offer our solution at an accessible price point.
          </p>
          <br className='my-1' />
          <p className='px-[8px]   text-center text-sm   text-foreground '>
            We are committed to a simple principle: We won't offer anything that hasn't undergone rigorous testing on the sales floor. We understand that our real-world experience as current sales professionals provides our tools with a unique advantage over others in the industry.
          </p>
          <br className='my-1' />
          <p className='px-[8px]  ]  text-center text-sm   text-foreground '>
            While exceptional sales coaches exist, the passage of time can sometimes lead to a disconnect from the practical realities of the sales process. We're not suggesting that you should forego further sales training; in fact, we recognize the immense value that proper training can bring when absorbed effectively.
          </p>
          <br className='my-1' />
          <p className='px-[8px]    text-center text-sm   text-foreground '>
            What we promise is this: We won't present you with tools or strategies that we haven't personally used ourselves. Our commitment is rooted in the belief that only by testing and validating every aspect of our solutions in the real sales environment can we truly deliver tools that work effectively for you.
          </p>
          <br className='my-1' />
          <p className='px-[8px]    text-center text-sm   text-foreground '>
            Although we currently focus primarily on the power sports industry, our vision extends far beyond. We plan to expand into the automotive industry and beyond, with a singular purpose: to assist salespeople everywhere. Our mission is to empower you and every other sales professional out there to reach new heights in your career.
          </p>
        </fieldset>
      </div>
    </>
  )
}
export const logos = [
  {
    src: activix,
    alt: 'Activix',
  },
  {
    src: "https://searchlogovector.com/wp-content/uploads/2020/04/ski-doo-logo-vector.png",
    alt: 'Ski-Doo',
  },
  {
    src: "https://searchlogovector.com/wp-content/uploads/2020/04/sea-doo-logo-vector.png",
    alt: 'Sea-Doo',
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Suzuki_logo_2.svg/500px-Suzuki_logo_2.svg.png",
    alt: 'Suzuki',
  },
  {
    src: "https://www.bmw-motorrad.ca/content/dam/bmwmotorradnsc/common/mnm/graphics/bmw_motorrad_logo.svg.asset.1585209612412.svg",
    alt: 'bmw',
  },

  {
    src: manitouIndex,
    alt: 'Manitou',
  },

  {
    src: "https://www.brp.com/content/dam/global/logos/brands/logo-brp.svg",
    alt: 'brp',
  },
  {
    src: canamIndex,
    alt: 'canam',
  },
  {
    src: harleyDavidson,
    alt: 'h-d',
  },

  {
    src: "https://media.triumphmotorcycles.co.uk/image/upload/f_auto/q_auto/SitecoreMediaLibrary//_images/apple-touch-icon-180x180.png",
    alt: 'Triumph',
  },
  {
    src: "",
    alt: 'Kawasaki',
  },
  {
    src: "",
    alt: 'Yamaha',
  },
  {
    src: "",
    alt: 'Honda',
  },
  {
    src: "",
    alt: 'Indian',
  },


]
export function Brands() {
  return (
    <div className='mx-5'>
      <div className="text-foreground  md:w-1/2 mt-[25px] mx-auto">
        <fieldset className="grid gap-6 rounded-lg border p-4 mx-auto h-[850x] w-[550px]  border-border cursor-pointer " >
          <legend className="-ml-1 px-1 text-lg font-medium">Brands</legend>
          <div className='flex flex-wrap justify-center gap-8  py-4'>

            <TooltipProvider>
              {logos.map(img => (
                <Tooltip key={img.href}>
                  <TooltipTrigger asChild>
                    <a
                      href={img.href}
                      className="flex h-16 w-32 justify-center p-1 grayscale transition hover:grayscale-0 focus:grayscale-0"
                    >
                      <img
                        alt={img.alt}
                        src={img.src}
                        className="object-contain"
                      />
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>{img.alt}</TooltipContent>
                </Tooltip>
              ))}
            </TooltipProvider>
          </div>
        </fieldset>
      </div>
    </div>
  )
}
export function FAQ() {
  return (
    <div className=' '>
      <div className="text-foreground  w-[90%] mt-[25px] mx-auto">
        <fieldset className="grid gap-6 rounded-lg border p-4 mx-auto h-[850x] w-[550px]  border-border   " >
          <legend className="-ml-1 px-1 text-lg font-medium">FAQ</legend>
          <div className="font-semibold">How much set-up am I required to do?</div>
          <p className='px-[8px] pt-[5px] text-center text-sm  text-foreground '>
            Virtually none. The server and database will be hosted off site that we will set up for you. Once up and running all you will have to do is set up accounts for your employees and that's it. If you would like your line-up included for the quoting capabilities, we just require your dealer binder, if it's a brand we already do not have. If your not technically savvy or do not have a tech dept of some kind, we can set everything up for you, even your employee accounts.
          </p>
          <hr className="my-4 text-muted-foreground w-[95%] mx-auto" />
          <div className="font-semibold">How secure will it be / how fast will it be?</div>
          <p className='px-[8px] pt-[5px] text-center text-sm  text-foreground '>
            Each dealer will have their own database and server. That way if one dealer is compromised, none of the other dealers would have to suffer due to their security event. This also helps the overall speed of each dealers server because they are not hosted all on the same server. During peak times, say for example at 9 am when every dealer opens, dealers won't effect eachother and slow down the service instead each will have fast loading times in comparison to other crms.
          </p>
          <hr className="my-4 text-muted-foreground w-[95%] mx-auto" />
          <div className="font-semibold">Can you actually quote a price in 60 seconds?</div>
          <p className='px-[8px]   text-center text-sm   text-foreground '>
            No, it's even quicker than that. While setting the time frame any lower might seem unattainable to many, our application is designed to provide pricing information in a matter of seconds. In today's fast-paced world, some automotive brands require salespeople to sift through a massive book with over 500 pages just to discuss vehicle options, which can consume an entire hour. Our application eliminates this time-consuming process by putting almost everything you need right at your fingertips. It doesn't just provide speedy quotes; it also offers additional features that accelerate your workflow, allowing you to serve more customers efficiently. It's not solely about increasing sales but also about aiding more people in a timely manner. I've witnessed customers leaving dealerships because they couldn't find assistance. While it's unfortunate for the dealer, no salesperson should spend three hours with a customer unnecessarily. They claim to be selling, but, in reality, they aren't. Some customers even have to wait weeks to receive a price quote, and that's a situation we aim to change.
          </p>
          <hr className="my-4 text-muted-foreground w-[95%] mx-auto" />
          <div className="font-semibold">Q: Is it easy to use? Some of my sales guys are too old for technology.</div>
          <p className='px-[8px]    text-center  text-sm  text-foreground '>
            A: Absolutely, ease of use is one of our top priorities. Our application is designed to be user-friendly, making it accessible to sales professionals of all ages, including those who may not be as tech-savvy. It's much simpler than the processes they are currently accustomed to. They no longer need to search for pricing information because it's readily available. Even for brands with complex lists of options, our application presents the information in a clear and easy-to-read format, benefiting both salespeople and customers. This reduces the need for extensive training on individual units and their options. To illustrate, brands like Manitou and BMW, which are known for their intricate offerings, become straightforward with our application. You simply select a unit, navigate through the list of options and accessories tailored to that unit, and our application generates a quote. It provides payment plans, including weekly, bi-weekly, and monthly options, factoring in local taxes or offering tax-exempt calculations for those who prefer it. Additionally, there's a field for out-of-towners with different tax rates. Furthermore, we include pre-loaded dealer options such as warranties and VIN etching, so if a customer insists on knowing the price with specific add-ons before making a decision, you already have that information at your fingertips.  Our system also allows you to customize finance packages instantly by adjusting up to 11 fields for dealer options. This empowers you to provide a tailored and hassle-free financing solution in real-time, often more efficiently than the finance department.   For those challenging phone inquiries where customers provide incomplete information, our application solves the problem. It's common for customers not to disclose their location or tax status, leading to rework and wasted time. With our application, much of this work is already completed, significantly reducing the time it takes to provide a quote. In some cases, it can take dealers 45-60 minutes or even longer to deliver a price; our application streamlines this process for immediate results.
          </p>
          <hr className="my-4 text-muted-foreground w-[95%] mx-auto" />
          <div className="font-semibold">Q: Does it just produce prices?</div>
          <p className='px-[8px]    text-center text-sm   text-foreground '>
            A: No, our application goes far beyond simply generating prices. It enhances your entire sales process up to the point where it seamlessly integrates with your CRM. Here's how it improves your workflow:   Clear and Comprehensive Explanation: Our application excels at explaining vehicle options, prices, and associated fees in a way that's easy to understand. This clarity benefits all customers, including those who might find complex information confusing. You can confidently present pricing without interruptions or hesitation from customers, leading to a smoother sales experience.  Control and Professionalism: Having a tool that provides such control over the sales process elevates your sales game. You won't experience interruptions due to customers struggling to grasp the information. You can maintain a professional and uninterrupted dialogue, making your interactions more efficient and productive.  Streamlined Access to Information: Our application offers features that simplify the process even further. Need to access a spec sheet from the manufacturer's site? Instead of navigating multiple pages, it's just one click away. If a customer is interested in a color that's not in stock, you can quickly show them the model page on the manufacturer's site.   Efficient Communication: In cases where a customer has left without making a purchase, our application provides pre-made templates that can be customized or used as-is. These templates include a variety of email breakdowns tailored to different types of customers. Whether they need payment details or a comprehensive list of options, you can send the information with a single click, saving you valuable time.  In essence, our application is designed to optimize your entire sales process, making it more efficient, professional, and customer-friendly from start to finish.
          </p>
          <hr className="my-4 text-muted-foreground w-[95%] mx-auto" />
          <div className="font-semibold">Q: Will it really help my sales out?</div>
          <p className='px-[8px]   text-center text-sm   text-foreground '>
            A: Absolutely, we guarantee it will make a significant difference in your sales process. In the automotive industry, it's surprising how few products genuinely assist salespeople beyond enhancing their skills and salesmanship. Most tech solutions either extend the sales process or add more complexity. However, our application is a game-changer because it complements your existing sales process and skills, simplifying the entire journey.   Here's how it can truly benefit you and your team:  Streamlined Process: By simplifying your workflow, it allows you to focus 100% of your mental energy on closing the sale. You can engage with customers with confidence, fewer headaches, and access to crucial information. For example, if a customer wants to compare the prices of different options, you can provide this information instantly, eliminating unnecessary stress.  Increased Confidence: Confidence is key in sales, and our application empowers you to navigate your interactions with customers more confidently. You'll have the tools at your disposal to provide information quickly and accurately, which builds trust and credibility with potential buyers.  Information Accessibility: In a world where information is readily available online, it's essential to equip salespeople with the tools they need to meet customer expectations. Our application gives you instant access to the information customers seek, eliminating the need for customers to search elsewhere for the details they want.  Customer-Centric Approach: By arming yourself with a tool that provides information efficiently and effectively, you can take a more customer-centric approach to sales. It's about giving customers what they need when they need it, which can lead to higher customer satisfaction and conversion rates.  In summary, our application is designed to make your job easier and more productive by simplifying your sales process and giving you the tools to provide customers with the information they desire. It's a win-win situation that benefits both sales professionals and customers, ultimately driving more sales and increasing overall satisfaction.
          </p>
          <hr className="my-4 text-muted-foreground w-[95%] mx-auto" />
          <div className="font-semibold">I don't think my gm would let me use this.</div>
          <p className='px-[8px]   text-center text-sm   text-foreground '>
            It's understandable to have concerns about introducing new tools or changes in your dealership, especially if it involves management approval. Here are some points you can consider when discussing the implementation of this app with your GM:  Increased Sales Efficiency: Emphasize how the application can significantly improve sales efficiency. It streamlines the sales process, allowing salespeople to provide better and more detailed information to customers quickly. This efficiency can lead to more sales and a better customer experience.  Enhanced Finance Management: Highlight that the app also benefits finance managers by simplifying the process of adjusting financing rates and options. This means faster turnaround times and less time spent on administrative tasks.  Reduced Interruptions: Explain that the application can reduce interruptions for both salespeople and management. With quicker access to pricing information, there's less need for constant back-and-forth between sales and management to finalize deals. This, in turn, can lead to more productive workdays for everyone.  Improved Customer Satisfaction: Mention that by using the app, you can provide customers with more accurate and timely information. This can enhance overall customer satisfaction and make the dealership more competitive in a digital age where customers expect fast responses.  Trial Period: Suggest a trial period where the GM and the team can test the application's effectiveness firsthand. This will allow them to see the benefits in action and make an informed decision.  Training and Support: Offer to provide training and support for the entire team to ensure a smooth transition to using the application. Show that you're committed to making the implementation process as easy as possible.  Competitive Advantage: Emphasize how this tool can give your dealership a competitive advantage in the market. In a highly competitive industry, having a tool that streamlines the sales process and improves customer service can be a game-changer.  Ultimately, it's important to present the application as a solution that benefits the dealership as a whole, from sales and finance to management and customer satisfaction. Showing the potential advantages and offering a trial period can help address any initial concerns and make a strong case for its adoption.
          </p>
          <hr className="my-4 text-muted-foreground w-[95%] mx-auto" />
          <div className="font-semibold">How come the customer sheets arent avaiable?</div>
          <p className='px-[8px]   text-center text-sm   text-foreground '>
            The same as perviously.
          </p>
          <hr className="my-4 text-muted-foreground w-[95%] mx-auto" />
          <div className="font-semibold">How come the dealer sheets arent avaiable?</div>
          <p className='px-[8px]  ]  text-center text-sm   text-foreground '>
            The challenge of providing a universal dealer sheet that works for all brands and dealers is indeed complex. It requires a standardized layout that accommodates the diverse needs and preferences of various dealerships, while also ensuring that it's user-friendly and informative for both salespeople and other members of the staff. Here are a few reasons why creating such a universal layout can be challenging:  Brand-Specific Information: Different brands may have unique details and specifications that need to be highlighted. What works for one brand may not be suitable for another.  Dealer Preferences: Dealerships often have specific preferences for how they present information to staff. Some may prefer a more detailed breakdown, while others opt for a simpler approach.  Staff Expectations: Staff preferences can vary widely. Some may want a comprehensive breakdown, while others prefer a more streamlined presentation.  To address these challenges and provide a solution that works for all, it's essential to collaborate closely with dealerships and brands to gather feedback and refine the layout continually. Flexibility and customization options within the layout can also be key to accommodating different needs.  Ultimately, the goal should be to create a standardized dealer sheet that serves as a baseline while allowing for customization to meet specific brand and dealer requirements. This approach can help ensure that the solution benefits a wide range of stakeholders in the automotive industry.
          </p>

        </fieldset>
      </div>

    </div>

  )
}
function NewSection() {
  const [sales, setSales] = useState(false)
  const [dealer, setDealer] = useState(false)

  return (
    <>
      {sales === false && dealer === false && (
        <div className='mx-auto grid lg:grid-cols-2 justify-center mb-[40px]  mt-[75px]'>

          <fieldset className="grid gap-6 rounded-lg border p-4 mx-auto h-[850x] w-[550px]  border-border cursor-pointer hover:border-primary" onClick={() => {
            setSales(true)
          }}>
            <legend className="-ml-1 px-1 text-lg font-medium text-foreground">Sales People</legend>

            <p className='px-[8px] pt-[5px] text-center text-sm  text-foreground '>
              Experience the only CRM on the market designed to empower every salesperson, regardless of your current CRM provider. While we may not have every integration yet, if your current provider isn't on our list, sign up, and we'll prioritize integrating it promptly.
            </p>
            <br className='my-1' />
            <p className='px-[8px]    text-center text-sm   text-foreground '>
              Say goodbye to countless hours wasted on repetitive tasks in your dealership without needing management's permission. Our CRM acts like a new "skin" or interface, replacing your dashboard to make your job more efficient and help you outsell everyone else. Whether you want to achieve more or prefer spending time on other activities, our CRM adapts to your needs.
            </p>
            <br className='my-1' />
            <p className='px-[8px]   text-center  text-sm  text-foreground '>
              While the salesperson's version may lack some functionalities compared to the full dealership version, convincing management to change the entire CRM system might be as challenging as selling cars in Thailand without speaking the language.
            </p>
            <br className='my-1' />
            <p className='px-[8px]   text-center text-sm   text-foreground '>
              However, adopting our CRM will significantly elevate your sales game, surpassing the impact of the last five sales training sessions. Guaranteed to be the most significant change in your career, whether you're a newcomer, a sales superstar, or a seasoned salesperson who isn't tech-savvy. You'll undoubtedly see a remarkable increase—Just read the upcoming story about wasting time with mass emails.
            </p>
            <div className='flex justify-center'>
              <Button size='sm' className='mx-auto bg-primary text-foreground  mt-3'>
                Continue
              </Button>
            </div>
          </fieldset>

          <fieldset className="grid gap-6 rounded-lg border p-4 mx-auto h-[850x] w-[550px]  border-border cursor-pointer hover:border-primary" onClick={() => {
            setSales(true)
          }}>
            <legend className="-ml-1 px-1 text-lg font-medium text-foreground">Dealers</legend>
            <ul className="grid gap-3 text-sm mt-2">
              {dealerCard.map((item, index) => (
                <li key={index} className=" ">
                  <p className='text-left'>{item.description}</p>
                </li>
              ))}
            </ul>

            <div className='flex justify-center'>
              <Button size='sm' className='mx-auto bg-primary text-foreground  mt-3'>
                Continue
              </Button>
            </div>
          </fieldset>
        </div>
      )}
      {sales === true && (
        <>
          <Tabs defaultValue="account" className="w-2/3 mx-auto justify-center">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="account">Why</TabsTrigger>
              <TabsTrigger value="Action">In Action</TabsTrigger>
              <TabsTrigger value="Brands">Brands Integrated</TabsTrigger>
              <TabsTrigger value="Mission">Mission</TabsTrigger>
              <TabsTrigger value="FAQ">FAQ</TabsTrigger>
              <TabsTrigger value="Price">Price</TabsTrigger>
            </TabsList>
            <TabsContent value="account">
              <div className="text-foreground  md:w-1/2 mt-[25px] mx-auto">
                <fieldset className="grid gap-6 rounded-lg border  p-4 mx-auto h-[850x] w-[550px]  border-border cursor-pointer " >
                  <legend className="-ml-1 px-1 text-lg font-medium"> It was never my intention on taking it this so far...</legend>
                  <div className='flex flex-wrap justify-center gap-8  py-4'>
                    <p className='px-[8px] pt-[5px] text-center text-sm  text-foreground '>
                      and building a full fledge CRM that competes with the largest brands, but there are some serious flaws with-in the industry, and so many people who make the decisions to design them, dont use them and can't see how they waste as much time as they do.
                    </p>
                    <br />
                    <p className='px-[8px]   text-center text-sm   text-foreground '>
                      What if you could save up to or more than 130 mins a day?
                    </p>
                    <br />
                    <p className='px-[8px]   text-center text-sm   text-foreground '>
                      It sounds rediculous, I know... but you can test how much time your current crm wastes. Send a mass email to 20 people and time how long it takes to, 1: complete the call along with any notes or anything else you need to put in. 2: schedule the follow-up call, properly, leaving yourself good notes to have a great follow up and not have to dig through previous calls to get a sense of where the customer is at. You can cheat this and say it doesnt take long. On average it would take 1:30 to 2:00 each call, unless your driven and good with the crm you have, you can get it down to a min. If your slow on the computer, this number sky rockets horribly.
                    </p>
                    <br />
                    <p className='px-[8px]   text-center text-sm   text-foreground '>
                      You can easily do 100 calls a day in sales, between texts, emails, calls and so on. Even more if no ones picking up. So at BEST your wasting 100 mins a day. At your WORST, you can waste in excess of 200 mins. We all drag our heels at times, I get it.
                    </p>
                    <br />
                    <p className='px-[8px]   text-center text-sm   text-foreground '>
                      What if you could get that process down to 10 secs? Or even down to one?  At 10 secs, your wasting 16.6 mins a day, instead 100-200 mins. If someone doesn't answer your call or text, its 1 second. This is just on that one process we talked about... what about all the other ways crm's prolonged your sales process?
                    </p>

                  </div>
                </fieldset>
              </div>

            </TabsContent>
            <TabsContent value="Action">
              <Card>
                <CardHeader className="text-lg leading-8 text-foreground bg-muted-background border-b border-border">
                  <CardTitle>Password</CardTitle>
                  <CardDescription>
                    Change your password here. After saving, you'll be logged out.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 bg-background">
                  <div className=' mt-3'>
                    <Feature1 />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="Brands">
              <Brands />
            </TabsContent>
            <TabsContent value="Mission">
              <Mission />
            </TabsContent>
            <TabsContent value="FAQ">
              <FAQ />
            </TabsContent>
            <TabsContent value="Price">
              <SalespersonPrice />
            </TabsContent>
          </Tabs>
        </>
      )}
      {dealer === true && (
        <>
          <Tabs defaultValue="account" className="w-2/3 mx-auto justify-center">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="account">Why</TabsTrigger>
              <TabsTrigger value="Action">In Action</TabsTrigger>
              <TabsTrigger value="Brands">Brands Integrated</TabsTrigger>
              <TabsTrigger value="Mission">Mission</TabsTrigger>
              <TabsTrigger value="FAQ">FAQ</TabsTrigger>
              <TabsTrigger value="Price">Price</TabsTrigger>
            </TabsList>
            <TabsContent value="account">
              <div className="text-foreground  md:w-1/2 mt-[25px] mx-auto">
                <fieldset className="grid gap-6 rounded-lg border p-4 mx-auto h-[850x] w-[550px]  border-border cursor-pointer " >
                  <legend className="-ml-1 px-1 text-lg font-medium"> It was never my intention on taking it this so far...</legend>
                  <div className='flex flex-wrap justify-center gap-8  py-4'>
                    <p className='px-[8px] pt-[5px] text-center text-sm  text-foreground '>
                      and building a full fledge CRM that competes with the largest brands, but there are some serious flaws with-in the industry, and so many people who make the decisions to design them, dont use them and can't see how they waste as much time as they do.
                    </p>
                    <br />
                    <p className='px-[8px]   text-center text-sm   text-foreground '>
                      What if you could save up to or more than 130 mins a day?
                    </p>
                    <br />
                    <p className='px-[8px]   text-center text-sm   text-foreground '>
                      It sounds rediculous, I know... but you can test how much time your current crm wastes. Send a mass email to 20 people and time how long it takes to, 1: complete the call along with any notes or anything else you need to put in. 2: schedule the follow-up call, properly, leaving yourself good notes to have a great follow up and not have to dig through previous calls to get a sense of where the customer is at. You can cheat this and say it doesnt take long. On average it would take 1:30 to 2:00 each call, unless your driven and good with the crm you have, you can get it down to a min. If your slow on the computer, this number sky rockets horribly.
                    </p>
                    <br />
                    <p className='px-[8px]   text-center text-sm   text-foreground '>
                      You can easily do 100 calls a day in sales, between texts, emails, calls and so on. Even more if no ones picking up. So at BEST your wasting 100 mins a day. At your WORST, you can waste in excess of 200 mins. We all drag our heels at times, I get it.
                    </p>
                    <br />
                    <p className='px-[8px]   text-center text-sm   text-foreground '>
                      What if you could get that process down to 10 secs? Or even down to one?  At 10 secs, your wasting 16.6 mins a day, instead 100-200 mins. If someone doesn't answer your call or text, its 1 second. This is just on that one process we talked about... what about all the other ways crm's prolonged your sales process?
                    </p>

                  </div>
                </fieldset>
              </div>

            </TabsContent>
            <TabsContent value="Action">
              <Card>
                <CardHeader className="text-lg leading-8 text-foreground bg-muted-background border-b border-border">
                  <CardTitle>Password</CardTitle>
                  <CardDescription>
                    Change your password here. After saving, you'll be logged out.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 bg-background  ">
                  <div className=' mt-3'>

                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="Brands">
              <Brands />
            </TabsContent>
            <TabsContent value="Mission">
              <Mission />
            </TabsContent>
            <TabsContent value="FAQ">
              <FAQ />
            </TabsContent>
            <TabsContent value="Price">
              <DealerPrice />
            </TabsContent>
          </Tabs>
        </>
      )}
    </>
  )
}
function Footer() {
  return (
    <>
      <div className="mt-[35px] mb-[25px] border-t border-border ">
        <div className='bg-background text-foreground  '>
          <div className=' mt-[15px] w-[80%] mx-auto space-y-3'>
            <p>Dealer Sales Assistant</p>
          </div>
          <div className='mt-[15px] w-[80%] mx-auto space-y-3'>
            <SidebarNav items={mainNav} />
          </div>
        </div>
      </div>
    </>
  )
}
/**   <div className="text-center">
              <p className="px-8 pt-5 text-sm text-foreground">
                Increase your revenue and streamline training for new hires by using our CRM. It's not just easier for your employees but also provides an excellent way to present and upsell to every customer.
              </p>
              <br className="my-1" />
              <p className="px-8   text-sm text-foreground">
                Experience quicker sales with fewer customer questions. The easy-to-read information about the deal makes customers happier. Your sales team can effortlessly close deals without getting hung up on questions or uncertainty through the process.
              </p>
              <br className="my-1" />
              <p className="px-8   text-sm text-foreground">
                Eliminate paperwork for your salespeople. Our system handles all necessary paperwork, allowing your sales team to hit print, and the system takes care of the rest. Save time and boost profits across any dealership.
              </p>
              <br className="my-1" />
              <p className="px-8   text-sm text-foreground">
                Discover more benefits by exploring our system. Stay tuned for an in-depth video covering the entire system and addressing how the industry has done us wrong. If you're here, you're already moving in the right direction. To top it off, we have one advatange none of the CRM providors have.
              </p>
            </div> */

function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const location = useLocation();
  const pathname = location.pathname
  console.log(pathname)
  return (
    <nav className={cn("grid md:grid-cols-2 lg:grid-cols-3 space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1", className)} {...props} >
      {items.map((item) => (
        <Link
          to={item.to}
          key={item.to}
          className="justify-start mt-3" >
          <Button
            variant='ghost'
            className={cn(
              'justify-start text-left  text-lg hover:border-primary',
              buttonVariants({ variant: 'ghost' }),
              pathname === item.to
                ? "bg-[#232324] hover:bg-muted/50 w-[90%]   "
                : "hover:bg-muted/50  w-[90%]  ",
              "justify-start w-[90%]"
            )} >
            {item.title}
          </Button>
          <p className="text-muted-foreground ml-4 text-sm ">
            {item.description}
          </p>
        </Link>
      ))}
    </nav>
  )
}

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    to: string
    title: string
    description: string
  }[]
}

