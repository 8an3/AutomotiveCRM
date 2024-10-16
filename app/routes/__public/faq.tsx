import { Form, useLoaderData } from '@remix-run/react'
import { Button, Card, CardContent, Input, TextArea, Textarea } from '~/components/ui/index'
import ContactForm from '~/components/shared/contactForm';
import ScriptForm from '~/components/shared/scriptsForm';
import { json, type ActionFunction, type DataFunctionArgs, type MetaFunction } from '@remix-run/node'

import { model } from '~/models'
import financeFormSchema from '~/overviewUtils/financeFormSchema';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel"


export const meta: MetaFunction = () => {
  return [
    { title: 'FAQ | Dealer Sales Assistant' },
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


export default function FAQ() {
  return (
    <div className='w-[95vw]'>
      <div className="mt-5">
        <h2 className="font-sans text-3xl sm:mt-0 text-center font-bold text-black sm:text-4xl mx-auto">
          FAQ
        </h2>
      </div>
      <div className='mx-auto my-auto '>
        <Carousel>
          <CarouselContent className="h-auto mx-auto my-auto">
            {faqItems.map((item, index) => (
              <CarouselItem key={index} className='my-auto'>
                <div className="p-1">
                  <Card className='w-[90%]'>
                    <CardContent className="flex items-center justify-center p-6">
                      <div>
                        <h2 className="text-2xl font-semibold">{item.question}</h2>
                        <hr />
                        <p>{item.answer}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>


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
