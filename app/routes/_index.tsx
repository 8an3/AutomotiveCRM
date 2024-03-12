
import { useState, useEffect, } from 'react'
import canamIndex from './logos/canamIndex.png'
import manitouIndex from './logos/manitouIndex.png'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter, } from '~/components/ui/card'
import { redirect, json, type LinksFunction, type DataFunctionArgs, ActionFunction, LoaderArgs, type MetaFunction, LoaderFunction } from '@remix-run/node'
import { Form, Link, useLoaderData, useFetcher, Links } from '@remix-run/react';
import { Dialog } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import Overview from './images/overview.png'
import Salestracker from './images/salestracker.png'
import Features from './images/features.png'
import Dealerfees from './images/dealerfees.png'
import harleyDavidson from './logos/hd.png'
import activix from './logos/activix.svg'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion"
import Parts from './images/parts.png'
import Quoeimage from '../../images/quote.png'
import { useRootLoaderData } from "~/hooks";
import Indexvideo from './images/proof40secs.mp4'
import { Input, Button, TooltipProvider, Tooltip, TooltipTrigger, TooltipContent, Label, Separator, Badge, } from "~/components/ui/index"
import index from '~/styles/index.css'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../components/ui/carousel"
import { getSession, } from "../sessions/auth-session.server";
import { model } from "~/models";
import { NavigationMenuSales } from '~/components/shared/navMenu'
import { AlertCircle } from 'lucide-react'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/components/ui/tabs"
import secondary from '~/styles/indexSecondary.css'


export const links: LinksFunction = () => [
  { rel: "stylesheet", href: index },
  { rel: "stylesheet", href: secondary },

]

export async function loader({ request }: LoaderArgs) {
  //  let account = await requireAuthCookie(request);

  const userSession = await getSession(request.headers.get("Cookie"))
  const email = userSession.get("email")
  if (email) {
    const user = await model.user.query.getForSession({ email: email });

    throw user && redirect("/quote/Harley-Davidson");
  };
  ;
  //const user = await model.user.query.getForSession({ email });
  // if (user) {  return redirect("/quote/Harley-Davidson");  }
  return null
}

export const meta: MetaFunction = () => {
  return [
    { title: "Home Page - Dealer Sales Assistant" },
    { property: "og:title", content: "Your very own assistant!", },
    { name: "description", content: "To help sales people achieve more. Every automotive dealer needs help, especialy the sales staff. Dealer Sales Assistant will help you close more deals more efficiently.", keywords: 'Automotive Sales, dealership sales, automotive CRM', },
  ];
};


export default function Index() {
  return (
    <>
      <div className='bg-black'>
        <NavigationMenuSales />
        <AlertBox />
        <NewHeader />
        <NewSection />
      </div>
    </>
  )
}
function AlertBox() {
  return (
    <div className='ite mx-auto mt-3 flex justify-center bg-black'>
      <div className='w-[75%] rounded-md border border-white'>
        <div className='m-3 flex items-center justify-center p-3'>
          <AlertCircle color="#ffffff" />
          <div className='ml-3'>
            <p className='text-white'>
              Heads up!
            </p>
            <p className='text-white'>
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
    <div className='bg-black mt-[60px]' >
      <div className="mx-auto max-w-2xl py-[55px] ">

        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate1 sm:text-6xl">
            Generate vehicle pricing in less than 60 seconds or saving your sales people 125+ mins a day, individually
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate1">
            Experience crystal-clear and effortlessly legible displays of weekly, bi-weekly, and monthly payment options, all while receiving a detailed breakdown of every dollar involved in the deal.
          </p>
          <p className="mt-6 text-lg leading-8 text-slate1">
            Inquire about a free demo of our new CRM! Garaunteed better results than any other crm on the market. Developed and tested by a team of sales professionals, instead of programmers and developers who never sold a car in their life.
          </p>
          <Form method="post" action="/emails/send/contact" className='mt-5 flex items-center  justify-center'>
            <Input name="email" placeholder="example@gmail.com" className='mr-2 w-[300px] border border-white bg-black text-white focus:border-[#02a9ff]' />

            <Button name='intent' value='demoInquiry' type='submit' className=" ml-2 mr-2 w-[75px]  rounded bg-[#02a9ff]  text-center text-xs font-bold   uppercase  text-white shadow outline-none transition-all duration-150  ease-linear hover:shadow-md focus:outline-none active:bg-black"
            >
              Email
            </Button>
          </Form>


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
            <CarouselItem className='h-auto   border-slate1' key={index}>
              <div className="p-1">
                <Card className='h-auto border-slate1'>
                  <CardContent className="flex  justify-center rounded-md  bg-myColor-900 p-6">
                    <div className='grid grid-cols-2 items-center justify-between'>
                      <div className='justify-center'>
                        <h2 className="top-[50%] my-auto text-center text-2xl font-semibold text-slate1">{item.title}</h2>
                        {item.paragraphs.map((paragraph, i) => (
                          <p className='text-center text-slate1' key={i}>{paragraph}</p>
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
        <CarouselPrevious className='text-slate1' />
        <CarouselNext className='text-slate1' />
      </Carousel>
    </>
  )
}
export function Price() {
  return (
    <>
      {/* pricing */}
      <div className='mx-auto mb-[100px] mt-10 grid grid-cols-1 items-center text-center' >
        <h2 className="mx-auto text-center font-sans text-3xl font-bold text-slate1 sm:mt-0 sm:text-4xl">
          Subscription Plan
        </h2>
        <h3 className='text-2xl text-slate1'>
          Cancel Anytime with No Penalties. Your Plan Includes Full Access to All Our Features.
        </h3>
        <h4 className="font-medium text-slate1">
          Subscribe Now for Just $19.95 Per Month.
        </h4>
        <a href='https://buy.stripe.com/14k6pTg9J0IV0G4fYZ' target="_blank">
          <Button type="submit" name='_action' value='subscribe' variant='outline' className=' mx-auto my-2 border-slate1 text-slate1' >
            Subscribe Now
          </Button>
        </a>
      </div>
    </>
  )
}
export function Mission() {
  return (
    <>
      <Card className='mx-auto w-[90%] border-black'>
        <CardContent>

          <div className=' mx-auto mb-[50px] text-center'>
            <h2 className="mx-auto text-center font-sans text-3xl font-bold text-white sm:mt-0 sm:text-4xl">
              Mission Statement
            </h2>
            <hr className="solid text-black " />
            <p className="m-auto mt-5 text-left text-white">
              Our mission is clear: We aim to empower salespeople everywhere with tools and resources that transcend the traditional approach of relying solely on salesmanship training. Whether it's your first day or your tenth year in sales, our goal is to provide universally accessible solutions that lead to improved sales performance.
            </p>
            <p className="m-auto mt-5 text-left text-white">
              Our commitment goes beyond streamlining sales processes. In development, we're crafting a comprehensive dashboard that significantly reduces the time required to complete customer interactions and schedule follow-ups. This dashboard is designed to seamlessly integrate with various CRM systems, ensuring that you have all the necessary information at your fingertips for well-informed follow-up calls. No more navigating between pages or seeking additional resources; everything you need will be readily available to enhance your efficiency.
            </p>
            <p className="m-auto mt-5 text-left text-white">
              We firmly reject the notion of relying on vague or mystical 'secrets' to enhance sales performance, and we challenge the idea that only seasoned oratory experts can excel in sales. There is no mystical formula to sales success; it's a matter of equipping individuals with the right knowledge at the right time in their sales journey.
            </p>
            <p className="m-auto mt-5 text-left text-white">
              We believe that every person has the potential to become a highly effective sales professional. This is not an abstract hope or wishful thinking; it's a verifiable fact. We've seen remarkable transformations, even among individuals who have faced significant challenges, such as those with criminal backgrounds. Instead of treating them with harsh judgment, we've taken a different approach, guiding them toward sales excellence and, in turn, improving various aspects of their lives.
            </p>
            <p className="m-auto mt-5 text-left text-white">
              Our approach stands in stark contrast to traditional sales presentations where the speaker hopes that attendees will absorb even a small fraction of their teachings. We don't aspire for a handful out of a thousand to improve. Our mission is to empower each and every person to enhance their sales skills. We firmly believe that, given the right tools and guidance, anyone can become a successful salesperson.
            </p>
            <p className="m-auto mt-5 text-left text-white">
              While we could charge premium prices similar to CRM systems once fully developed, our commitment to accessibility remains unwavering. We understand that affordability should not be a barrier to access the tools needed for continuous growth. Every salesperson deserves to have the resources required for success, a principle that drives us to offer our solution at an accessible price point.
            </p>

            <p className="m-auto mt-5 text-left text-white">
              We are committed to a simple principle: We won't offer anything that hasn't undergone rigorous testing on the sales floor. We understand that our real-world experience as current sales professionals provides our tools with a unique advantage over others in the industry.
            </p>
            <p className="m-auto mt-5 text-left text-white">
              While exceptional sales coaches exist, the passage of time can sometimes lead to a disconnect from the practical realities of the sales process. We're not suggesting that you should forego further sales training; in fact, we recognize the immense value that proper training can bring when absorbed effectively.
            </p>
            <p className="m-auto mt-5 text-left text-white">
              What we promise is this: We won't present you with tools or strategies that we haven't personally used ourselves. Our commitment is rooted in the belief that only by testing and validating every aspect of our solutions in the real sales environment can we truly deliver tools that work effectively for you.
            </p>
            <p className="m-auto mt-5 text-left text-white">
              Although we currently focus primarily on the power sports industry, our vision extends far beyond. We plan to expand into the automotive industry and beyond, with a singular purpose: to assist salespeople everywhere. Our mission is to empower you and every other sales professional out there to reach new heights in your career.
            </p>
          </div>
        </CardContent>
      </Card>
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

      <h2 className="mx-auto mb-6 max-w-lg font-sans text-3xl font-bold tracking-tight text-slate1 sm:text-4xl sm:leading-none">
        Current Brands with Ongoing Additions.<br className="hidden sm:block" />
      </h2>
      <Card className='mx-auto w-[90%] bg-slate1'>
        <CardContent className='bg-slate1'>
          <div className="mx-auto mt-8 max-w-7xl px-4 py-2 sm:px-6 lg:px-8">
            <div className="bg-slate-100 dark:bg-slate-200 flex flex-wrap justify-center gap-8 rounded-3xl py-4">
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
          </div>


        </CardContent>
      </Card>


    </div>
  )
}
export function FAQ() {
  return (
    <div className='mx-auto mt-[100px] w-[95vw]'>
      <div className="mt-5">
        <h2 className="mx-auto text-center font-sans text-3xl font-bold text-slate1 sm:mt-0 sm:text-4xl">
          FAQ
        </h2>
      </div>

      <Carousel className=" mx-auto my-auto  w-[95%]" opts={{
        loop: true,
      }}>
        <CarouselContent className=" rounded-md ">

          {faqItems.map((item, index) => (
            <CarouselItem className='h-auto   border-slate1' key={index}>

              <div className="p-1">
                <Card className='h-auto border-slate1'>

                  <CardContent className="flex  justify-center rounded-md  bg-myColor-900 p-6">

                    <div>
                      <h2 className="text-2xl font-semibold text-slate1">{item.question}</h2>
                      <hr className='mb-3 text-slate1' />
                      <p className='text-slate1'>{item.answer}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className='text-slate1' />
        <CarouselNext className='text-slate1' />
      </Carousel>
    </div>

  )
}

const faqItems = [
  {
    question: "Is this a CRM?",
    answer: "No, our system is not a CRM, nor do we have plans to become one. However, our primary goal is to address and resolve the challenges that sales professionals encounter when dealing with traditional CRM systems and dealer process. Many CRM platforms are often inefficient in the context of our sales process, and, in some cases, they can even complicate our sales workflow more than if we were operating without them. Our solution is designed to streamline and enhance the sales experience without the complexities associated with CRM software."
  },
  {
    question: "Can you actually quote a price in 60 seconds?",
    answer: "No, it's even quicker than that. While setting the time frame any lower might seem unattainable to many, our application is designed to provide pricing information in a matter of seconds. In today's fast-paced world, some automotive brands require salespeople to sift through a massive book with over 500 pages just to discuss vehicle options, which can consume an entire hour. Our application eliminates this time-consuming process by putting almost everything you need right at your fingertips. It doesn't just provide speedy quotes; it also offers additional features that accelerate your workflow, allowing you to serve more customers efficiently. It's not solely about increasing sales but also about aiding more people in a timely manner. I've witnessed customers leaving dealerships because they couldn't find assistance. While it's unfortunate for the dealer, no salesperson should spend three hours with a customer unnecessarily. They claim to be selling, but, in reality, they aren't. Some customers even have to wait weeks to receive a price quote, and that's a situation we aim to change."
  },
  {
    question: "Q: Is it easy to use? Some of my sales guys are too old for technology. ",
    answer: "  A: Absolutely, ease of use is one of our top priorities. Our application is designed to be user-friendly, making it accessible to sales professionals of all ages, including those who may not be as tech-savvy. It's much simpler than the processes they are currently accustomed to. They no longer need to search for pricing information because it's readily available. Even for brands with complex lists of options, our application presents the information in a clear and easy-to-read format, benefiting both salespeople and customers. This reduces the need for extensive training on individual units and their options. To illustrate, brands like Manitou and BMW, which are known for their intricate offerings, become straightforward with our application. You simply select a unit, navigate through the list of options and accessories tailored to that unit, and our application generates a quote. It provides payment plans, including weekly, bi-weekly, and monthly options, factoring in local taxes or offering tax-exempt calculations for those who prefer it. Additionally, there's a field for out-of-towners with different tax rates. Furthermore, we include pre-loaded dealer options such as warranties and VIN etching, so if a customer insists on knowing the price with specific add-ons before making a decision, you already have that information at your fingertips.  Our system also allows you to customize finance packages instantly by adjusting up to 11 fields for dealer options. This empowers you to provide a tailored and hassle-free financing solution in real-time, often more efficiently than the finance department.   For those challenging phone inquiries where customers provide incomplete information, our application solves the problem. It's common for customers not to disclose their location or tax status, leading to rework and wasted time. With our application, much of this work is already completed, significantly reducing the time it takes to provide a quote. In some cases, it can take dealers 45-60 minutes or even longer to deliver a price; our application streamlines this process for immediate results."
  },
  {
    question: "  Q: Does it just produce prices?",
    answer: "  A: No, our application goes far beyond simply generating prices. It enhances your entire sales process up to the point where it seamlessly integrates with your CRM. Here's how it improves your workflow:   Clear and Comprehensive Explanation: Our application excels at explaining vehicle options, prices, and associated fees in a way that's easy to understand. This clarity benefits all customers, including those who might find complex information confusing. You can confidently present pricing without interruptions or hesitation from customers, leading to a smoother sales experience.  Control and Professionalism: Having a tool that provides such control over the sales process elevates your sales game. You won't experience interruptions due to customers struggling to grasp the information. You can maintain a professional and uninterrupted dialogue, making your interactions more efficient and productive.  Streamlined Access to Information: Our application offers features that simplify the process even further. Need to access a spec sheet from the manufacturer's site? Instead of navigating multiple pages, it's just one click away. If a customer is interested in a color that's not in stock, you can quickly show them the model page on the manufacturer's site.   Efficient Communication: In cases where a customer has left without making a purchase, our application provides pre-made templates that can be customized or used as-is. These templates include a variety of email breakdowns tailored to different types of customers. Whether they need payment details or a comprehensive list of options, you can send the information with a single click, saving you valuable time.  In essence, our application is designed to optimize your entire sales process, making it more efficient, professional, and customer-friendly from start to finish."
  },
  {
    question: "Q: Will it really help my sales out?",
    answer: "   A: Absolutely, we guarantee it will make a significant difference in your sales process. In the automotive industry, it's surprising how few products genuinely assist salespeople beyond enhancing their skills and salesmanship. Most tech solutions either extend the sales process or add more complexity. However, our application is a game-changer because it complements your existing sales process and skills, simplifying the entire journey.   Here's how it can truly benefit you and your team:  Streamlined Process: By simplifying your workflow, it allows you to focus 100% of your mental energy on closing the sale. You can engage with customers with confidence, fewer headaches, and access to crucial information. For example, if a customer wants to compare the prices of different options, you can provide this information instantly, eliminating unnecessary stress.  Increased Confidence: Confidence is key in sales, and our application empowers you to navigate your interactions with customers more confidently. You'll have the tools at your disposal to provide information quickly and accurately, which builds trust and credibility with potential buyers.  Information Accessibility: In a world where information is readily available online, it's essential to equip salespeople with the tools they need to meet customer expectations. Our application gives you instant access to the information customers seek, eliminating the need for customers to search elsewhere for the details they want.  Customer-Centric Approach: By arming yourself with a tool that provides information efficiently and effectively, you can take a more customer-centric approach to sales. It's about giving customers what they need when they need it, which can lead to higher customer satisfaction and conversion rates.  In summary, our application is designed to make your job easier and more productive by simplifying your sales process and giving you the tools to provide customers with the information they desire. It's a win-win situation that benefits both sales professionals and customers, ultimately driving more sales and increasing overall satisfaction."
  },
  {
    question: "I don't think my gm would let me use this.",
    answer: "  It's understandable to have concerns about introducing new tools or changes in your dealership, especially if it involves management approval. Here are some points you can consider when discussing the implementation of this app with your GM:  Increased Sales Efficiency: Emphasize how the application can significantly improve sales efficiency. It streamlines the sales process, allowing salespeople to provide better and more detailed information to customers quickly. This efficiency can lead to more sales and a better customer experience.  Enhanced Finance Management: Highlight that the app also benefits finance managers by simplifying the process of adjusting financing rates and options. This means faster turnaround times and less time spent on administrative tasks.  Reduced Interruptions: Explain that the application can reduce interruptions for both salespeople and management. With quicker access to pricing information, there's less need for constant back-and-forth between sales and management to finalize deals. This, in turn, can lead to more productive workdays for everyone.  Improved Customer Satisfaction: Mention that by using the app, you can provide customers with more accurate and timely information. This can enhance overall customer satisfaction and make the dealership more competitive in a digital age where customers expect fast responses.  Trial Period: Suggest a trial period where the GM and the team can test the application's effectiveness firsthand. This will allow them to see the benefits in action and make an informed decision.  Training and Support: Offer to provide training and support for the entire team to ensure a smooth transition to using the application. Show that you're committed to making the implementation process as easy as possible.  Competitive Advantage: Emphasize how this tool can give your dealership a competitive advantage in the market. In a highly competitive industry, having a tool that streamlines the sales process and improves customer service can be a game-changer.  Ultimately, it's important to present the application as a solution that benefits the dealership as a whole, from sales and finance to management and customer satisfaction. Showing the potential advantages and offering a trial period can help address any initial concerns and make a strong case for its adoption."
  },
  {
    question: "How come the customer sheets arent avaiable?",
    answer: "The same as perviously;"
  },
  {
    question: "How come the dealer sheets arent avaiable?",
    answer: "The challenge of providing a universal dealer sheet that works for all brands and dealers is indeed complex. It requires a standardized layout that accommodates the diverse needs and preferences of various dealerships, while also ensuring that it's user-friendly and informative for both salespeople and other members of the staff. Here are a few reasons why creating such a universal layout can be challenging:  Brand-Specific Information: Different brands may have unique details and specifications that need to be highlighted. What works for one brand may not be suitable for another.  Dealer Preferences: Dealerships often have specific preferences for how they present information to staff. Some may prefer a more detailed breakdown, while others opt for a simpler approach.  Staff Expectations: Staff preferences can vary widely. Some may want a comprehensive breakdown, while others prefer a more streamlined presentation.  To address these challenges and provide a solution that works for all, it's essential to collaborate closely with dealerships and brands to gather feedback and refine the layout continually. Flexibility and customization options within the layout can also be key to accommodating different needs.  Ultimately, the goal should be to create a standardized dealer sheet that serves as a baseline while allowing for customization to meet specific brand and dealer requirements. This approach can help ensure that the solution benefits a wide range of stakeholders in the automotive industry."
  },
];
function NewSection() {
  const [sales, setSales] = useState(false)
  const [dealer, setDealer] = useState(false)

  return (
    <>

      {sales === false && dealer === false && (
        <div className='mx-auto grid grid-cols-2 justify-center mb-[40px]  mt-[75px]'>

          <div className='p-1 mx-auto h-[900px] w-[550px] rounded-md border border-white cursor-pointer hover:border-[#02a9ff]' onClick={() => {
            setSales(true)
          }}>
            <h1 className='mt-[40px] text-center text-white  bold text-4xl'>Sales People</h1>
            <Separator className='text-white' />
            <p className='px-[40px] py-[15px] text-center  text-myColor-200 '>
              Experience the only CRM on the market designed to empower every salesperson, regardless of your current CRM provider. While we may not have every integration yet, if your current provider isn't on our list, sign up, and we'll prioritize integrating it promptly.
            </p>
            <br className='my-1' />
            <p className='px-[40px]  py-[10px] text-center  text-myColor-200 '>
              Say goodbye to countless hours wasted on repetitive tasks in your dealership without needing management's permission. Our CRM acts like a new "skin" or interface, replacing your dashboard to make your job more efficient and help you outsell everyone else. Whether you want to achieve more or prefer spending time on other activities, our CRM adapts to your needs.
            </p>
            <br className='my-1' />
            <p className='px-[40px]  py-[10px] text-center  text-myColor-200 '>
              While the salesperson's version may lack some functionalities compared to the full dealership version, convincing management to change the entire CRM system might be as challenging as selling cars in Thailand without speaking the language.
            </p>
            <br className='my-1' />
            <p className='px-[40px] py-[10px]  text-center  text-myColor-200 '>
              However, adopting our CRM will significantly elevate your sales game, surpassing the impact of the last five sales training sessions. Guaranteed to be the most significant change in your career, whether you're a newcomer, a sales superstar, or a seasoned salesperson who isn't tech-savvy. You'll undoubtedly see a remarkable increase—Just read the upcoming story about wasting time with mass emails.
            </p>
            <p className='px-[40px] py-[10px]  text-center  text-myColor-200 '>
              Click on the card to continue.
            </p>
          </div>

          <div className='p4 mx-auto h-[900px] w-[550px] cursor-pointer   rounded-md border border-white text-white hover:border-[#02a9ff]'
            onClick={() => {
              setDealer(true)
            }}>
            <h1 className='mt-[40px] text-center text-white  bold text-4xl'>For Dealers</h1>
            <div className="text-center">
              <p className="px-8 py-5 text-myColor-200">
                Increase your revenue and streamline training for new hires by using our CRM. It's not just easier for your employees but also provides an excellent way to present and upsell to every customer.
              </p>
              <br className="my-1" />
              <p className="px-8 py-3 text-myColor-200">
                Experience quicker sales with fewer customer questions. The easy-to-read information about the deal makes customers happier. Your sales team can effortlessly close deals without getting hung up on questions or uncertainty through the process.
              </p>
              <br className="my-1" />
              <p className="px-8 py-3 text-myColor-200">
                Eliminate paperwork for your salespeople. Our system handles all necessary paperwork, allowing your sales team to hit print, and the system takes care of the rest. Save time and boost profits across any dealership.
              </p>
              <br className="my-1" />
              <p className="px-8 py-3 text-myColor-200">
                Discover more benefits by exploring our system. Stay tuned for an in-depth video covering the entire system and addressing how the industry has done us wrong. If you're here, you're already moving in the right direction. To top it off, we have one advatange none of the CRM providors have.
              </p>
            </div>
            <p className='px-[40px] py-[10px]  text-center  text-myColor-200 '>
              Click on the card to continue.
            </p>
          </div>
        </div>
      )}


      {sales === true && (
        <>
          <Tabs defaultValue="account" className="w-2/3 mx-auto justify-center">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="account">Why</TabsTrigger>
              <TabsTrigger value="Action">In Action</TabsTrigger>
              <TabsTrigger value="Brands">Brands Integrated</TabsTrigger>                <TabsTrigger value="Mission">Mission</TabsTrigger>
              <TabsTrigger value="FAQ">FAQ</TabsTrigger>
              <TabsTrigger value="Price">Price</TabsTrigger>
            </TabsList>
            <TabsContent value="account">
              <Card className='bg-white'>
                <CardHeader>
                  <CardTitle className="text-lg leading-8 text-black">  It was never my intention on taking this so far and building a full fledge CRM that competes with the largest brands, but...</CardTitle>
                  <CardDescription className="text-lg leading-8 text-black">
                    There are some serious flaws with-in the industry, and so many people who make the decisions to design them, dont use them and can't see how they waste as much time as they do.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-lg leading-8 text-black">
                    What if you could save up to or more than 130 mins a day?
                  </p>
                  <p className="mt-6 text-lg leading-8 text-black">
                    It sounds rediculous, I know... but you can test how much time your current crm wastes. Send a mass email to 20 people and time how long it takes to, 1: complete the call along with any notes or anything else you need to put in. 2: schedule the follow-up call, properly, leaving yourself good notes to have a great follow up and not have to dig through previous calls to get a sense of where the customer is at. You can cheat this and say it doesnt take long. On average it would take 1:30 to 2:00 each call, unless your driven and good with the crm you have, you can get it down to a min. If your slow on the computer, this number sky rockets horribly.
                  </p>
                  <p className="mt-6 text-lg leading-8 text-black">
                    You can easily do 100 calls a day in sales, between texts, emails, calls and so on. Even more if no ones picking up. So at BEST your wasting 100 mins a day. At your WORST, you can waste in excess of 200 mins. We all drag our heels at times, I get it.
                  </p>
                  <p className="mt-6 text-lg leading-8 text-black">
                    What if you could get that process down to 10 secs? Or even down to one?  At 10 secs, your wasting 16.6 mins a day, instead 100-200 mins. If someone doesn't answer your call or text, its 1 second. This is just on that one process we talked about... what about all the other ways crm's prolonged your sales process?
                  </p>
                </CardContent>

              </Card>
            </TabsContent>
            <TabsContent value="Action">
              <Card>
                <CardHeader>
                  <CardTitle>Password</CardTitle>
                  <CardDescription>
                    Change your password here. After saving, you'll be logged out.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Feature1 />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="Brands">
              <Card>
                <CardHeader>
                  <CardTitle>Current Brands</CardTitle>
                  <CardDescription>
                    With more being added consistently.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Brands />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="Mission">
              <Card>
                <CardHeader>
                  <CardTitle>Our mission to you</CardTitle>
                  <CardDescription>
                    The people making the software, are the ones selling with it.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Mission />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="FAQ">
              <Card>
                <CardHeader>
                  <CardTitle>Got questions?</CardTitle>
                  <CardDescription>
                    If anything is still not answered, reach out. We will have a solution for any challenge.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="item-1">
                        <AccordionTrigger>Is it accessible?</AccordionTrigger>
                        <AccordionContent>
                          Yes. It adheres to the WAI-ARIA design pattern.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-2">
                        <AccordionTrigger>Is it styled?</AccordionTrigger>
                        <AccordionContent>
                          Yes. It comes with default styles that matches the other
                          components&apos; aesthetic.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-3">
                        <AccordionTrigger>Is it animated?</AccordionTrigger>
                        <AccordionContent>
                          Yes. It's animated by default, but you can disable it if you prefer.
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                    <FAQ />

                  </>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="Price">
              <Card>
                <CardHeader>
                  <CardTitle>Pricing</CardTitle>
                  <CardDescription>
                    Change your password here. After saving, you'll be logged out.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Price />
                </CardContent>
              </Card>
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
              <TabsTrigger value="Brands">Brands Integrated</TabsTrigger>                <TabsTrigger value="Mission">Mission</TabsTrigger>
              <TabsTrigger value="FAQ">FAQ</TabsTrigger>
              <TabsTrigger value="Price">Price</TabsTrigger>
            </TabsList>
            <TabsContent value="account">
              <Card className='bg-white'>
                <CardHeader>
                  <CardTitle className="text-lg leading-8 text-black">  It was never my intention on taking this so far and building a full fledge CRM that competes with the largest brands, but...</CardTitle>
                  <CardDescription className="text-lg leading-8 text-black">
                    There are some serious flaws with-in the industry, and so many people who make the decisions to design them, dont use them and can't see how they waste as much time as they do.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-lg leading-8 text-black">
                    What if you could save up to or more than 130 mins a day?
                  </p>
                  <p className="mt-6 text-lg leading-8 text-black">
                    It sounds rediculous, I know... but you can test how much time your current crm wastes. Send a mass email to 20 people and time how long it takes to, 1: complete the call along with any notes or anything else you need to put in. 2: schedule the follow-up call, properly, leaving yourself good notes to have a great follow up and not have to dig through previous calls to get a sense of where the customer is at. You can cheat this and say it doesnt take long. On average it would take 1:30 to 2:00 each call, unless your driven and good with the crm you have, you can get it down to a min. If your slow on the computer, this number sky rockets horribly.
                  </p>
                  <p className="mt-6 text-lg leading-8 text-black">
                    You can easily do 100 calls a day in sales, between texts, emails, calls and so on. Even more if no ones picking up. So at BEST your wasting 100 mins a day. At your WORST, you can waste in excess of 200 mins. We all drag our heels at times, I get it.
                  </p>
                  <p className="mt-6 text-lg leading-8 text-black">
                    What if you could get that process down to 10 secs? Or even down to one?  At 10 secs, your wasting 16.6 mins a day, instead 100-200 mins. If someone doesn't answer your call or text, its 1 second. This is just on that one process we talked about... what about all the other ways crm's prolonged your sales process?
                  </p>
                </CardContent>

              </Card>
            </TabsContent>
            <TabsContent value="Action">
              <Card>
                <CardHeader>
                  <CardTitle>Password</CardTitle>
                  <CardDescription>
                    Change your password here. After saving, you'll be logged out.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">



                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="Brands">
              <Card>
                <CardHeader>
                  <CardTitle>Current Brands</CardTitle>
                  <CardDescription>
                    With more being added consistently.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Brands />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="Mission">
              <Card>
                <CardHeader>
                  <CardTitle>Our mission to you</CardTitle>
                  <CardDescription>
                    The people making the software, are the ones selling with it.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Mission />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="FAQ">
              <Card>
                <CardHeader>
                  <CardTitle>Got questions?</CardTitle>
                  <CardDescription>
                    If anything is still not answered, reach out. We will have a solution for any challenge.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <FAQ />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="Price">
              <Card>
                <CardHeader>
                  <CardTitle>Password</CardTitle>
                  <CardDescription>
                    Change your password here. After saving, you'll be logged out.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">



                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </>
  )
}
