

import {
  Body,
  Button,
  Container,
  Column,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Text,
  Tailwind,
  Link,
} from "@react-email/components";
import * as React from "react";
import { Link2 } from 'lucide-react';

export const EmployEmail = (userAdd) => {


  return (
    <Html>
      <Head />
      <Preview>Welcome to the DSA team, {userAdd.name}.</Preview>
      <Tailwind>
        <Preview>Welcome to the DSA team, {userAdd.name}.</Preview>
        <Tailwind>
          <Body className="bg-white my-auto mx-auto font-sans px-2" >
            <Container className="border border-solid border-[#eaeaea] rounded-md my-[40px] mx-auto p-[20px] max-w-[465px]">
              <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
                Welcome to the<strong> DSA team, </strong> we're happy to have you here, <strong>{userAdd.name}</strong>
              </Heading>
              <Text className="text-black text-[14px] leading-[24px]">
                Whether you just got hired on a sales team or have been at a dealer for a while and are switching to our new CRM, congratulations on making a step in the right direction to improve your daily worklife. This CRM will save you countless hours compared to competing products and in turn get more sales while reducing your workload. It was made by a sales team, tired of wasting time on poorly thought-out applications. <br />
                Technology is here to help us save time, not add even more tasks during the sales process.
              </Text>
              <Section>
                <div className="relative mt-3">
                  <Hr className="border-b text-[#eaeaea] border-[#eaeaea]" />
                  <label className="flex text-[16px] absolute left-3 bg-[#ffffff] rounded-full -top-3 px-2 transition-all peer-placeholder-shown:top-2.5 peer-focus:-top-3">
                    <strong>Login</strong>
                    <Link href="/auth/login" target="_blank" className="cursor-pointer background-none border-none my-auto">
                      <Link2 color="#000000" className="flex ml-[15px]" />
                    </Link>
                  </label>
                </div>
                <Row>
                  <Column className="flex align-center">
                    <Text className="text-black text-[14px] leading-[24px]">
                      The login page uses the same email credentials as your Microsoft business account, so there's virtually no setup. Be sure to bookmark this page so you can return to it easily at any time in the future.
                    </Text>
                  </Column>
                </Row>

                <>

                  <div className="relative mt-3">
                    <Hr className="border-b text-[#eaeaea] border-[#eaeaea]" />
                    <label className="flex text-[16px] absolute left-3 bg-[#ffffff] rounded-full -top-3 px-2 transition-all peer-placeholder-shown:top-2.5 peer-focus:-top-3">
                      <strong>Documentation</strong>
                      <Link href={`${baseUrl}/dealer/docs/sales`} target="_blank" className="cursor-pointer background-none border-none my-auto">
                        <Link2 color="#000000" className="flex ml-[15px]" />
                      </Link>
                    </label>
                  </div>
                  <Row>
                    <Column className="flex">
                      <Text className="text-black text-[14px] leading-[24px]">
                        To learn more about the features, there is in-depth documentation organized by department or position, including a dedicated section for salespeople. Spending time with this documentation will help you get the most out of this application. With the intuitive design, if you have used a CRM before, you will quickly adapt without needing the documentation, if your the type of person who likes to just jump right in to it. However, the documentation contains many valuable tips to help you increase your sales, so don't skip it entirely.
                        <br />
                        One of the most significant advantages is a process that addresses one of the biggest challenges in the sales department: the finance hand-off. Often, this hand-off isn't smooth unless the customer leaves and schedules a time to return and sign. Usually, this doesn't happen, and there's a risk they might be followed up by another dealer offering a better deal. Our application handles this gracefully, in a way that we're surprised no one has thought of before. Typically the finance manager isn't in their office. So now your wondering around aimlessly around the dealership looking for someone. Are they out smoking?Are they wasting time in parts chit chatting? No they end up being in a lounge chair in the sun outside relaxing, and you have wasted 30 minutes looking for this person because thats the last place they should be. To learn about this feature, you'll need to explore the documentation.
                      </Text>
                    </Column>
                  </Row>

                  <div className="relative mt-3">
                    <Hr className="border-b text-[#eaeaea] border-[#eaeaea]" />
                    <label className="flex text-[16px] absolute left-3 bg-[#ffffff] rounded-full -top-3 px-2 transition-all peer-placeholder-shown:top-2.5 peer-focus:-top-3">
                      <strong>Sales Dashboard</strong>
                      <Link href={`${baseUrl}/dealer/leads/sales/dashboard`} target="_blank" className="cursor-pointer background-none border-none my-auto">
                        <Link2 color="#000000" className="flex ml-[15px]" />
                      </Link>
                    </label>
                  </div>
                  <Row>
                    <Column className="flex align-center">
                      <Text className="text-black text-[14px] leading-[24px]">
                        The sales dashboard is where you will spend the majority of your time. You can choose to use the dashboard to make your calls, or from the sales calendar. We have talked about the dashboard enough across all the avenues that we reach out to people, so we will assume you already know its better than every other dash on the market.
                      </Text>
                    </Column>
                  </Row>

                  <div className="relative mt-3">
                    <Hr className="border-b text-[#eaeaea] border-[#eaeaea]" />
                    <label className="flex text-[16px] absolute left-3 bg-[#ffffff] rounded-full -top-3 px-2 transition-all peer-placeholder-shown:top-2.5 peer-focus:-top-3">
                      <strong>Sales Calendar</strong>
                      <Link href={`${baseUrl}/dealer/calendar/sales`} target="_blank" className="cursor-pointer background-none border-none my-auto">
                        <Link2 color="#000000" className="flex ml-[15px]" />
                      </Link>
                    </label>
                  </div>
                  <Row>
                    <Column className="flex">
                      <Text className="text-black text-[14px] leading-[24px]">
                        The sales calendar can be used as your main dashboard or for referencing and editing appointments for your department and others. This calendar was developed by salespeople for salespeople. Most CRMs do a poor job with the sales calendar, I want to change, all of them have a horrible calendar. I have yet to see one that, just makes sense for our job. Either because the designers don't use it themselves or don't understand the needs of salespeople.
                        <br />
                        Our calendar, along with the dashboard, went through countless revisions to get it right. Admittedly, the dashboard underwent more revisions, but both tools are crucial for salespeople. These two features can either help you succeed and become a rock star or waste so much of your time that you become just another struggling salesperson. I obssessed about the quote page, because that's how this all began and it was such a problem in the dealer where I was working at the time. The managers were the only ones allowed to give quotes, but I would have to wait on average 30+ mins every single time I needed a quote, a lot of the time they were even wrong as far as payments and $ figures went. There were only a couple of requirements, the pricing had to be instant, and 100% right every time. Now, depending on the brand, that's almost impossible, but I got it done. For example, when I worked at a BMW dealership, it took the sales people well over 20, 30, sometimes even 40-45 minutes just to put the pricing together because of how difficult their product stack can be. Mine does it instantly... with options and parts. Theres a brand even worse than bmw in that regard, manitou. I left that dealer about 9 months after we took the brand in, up to that point I was the only person who could quote them reliably and quickly if at all. The owner couldnt do it, the manager couldnt do it, one sales guy, who was the quickest, got it done in an hour and a half. If you don't know manitou, think of having a product, and then a million different versions of that product all the while, theres not just one product but if I remember correctly 9. Every piece in the boat could be customized.... But I can quote that boat in under 2 mins to the cent, where it would take other sales guys, hours and still get the pricing wrong.
                      </Text>
                    </Column>
                  </Row>

                  <div className="relative mt-3">
                    <Hr className="border-b text-[#eaeaea] border-[#eaeaea]" />
                    <label className="flex text-[16px] absolute left-3 bg-[#ffffff] rounded-full -top-3 px-2 transition-all peer-placeholder-shown:top-2.5 peer-focus:-top-3">
                      <strong>Email Client</strong>
                      <Link href={`${baseUrl}/dealer/email/client`} target="_blank" className="cursor-pointer background-none border-none my-auto">
                        <Link2 color="#000000" className="flex ml-[15px]" />
                      </Link>
                    </label>
                  </div>
                  <Row>
                    <Column className="flex">
                      <Text className="text-black text-[14px] leading-[24px]">
                        Since I know it's just going to be sales people reading this. This is the stupidest thing I have seen in CRM's, why haven't they solved this problem. I shouldn't loose a customer because they emailed me. I don't think there is a crm on the market that takes inbound emails. It's just mind blowing, but when you have a CRM full of leads and your answering them. The last thing you remember to check is an email client from another brand. Parden me for this, but what the fuck. These systems cost dealers, sometimes 5-10 grand a month. This should not be a problem. How does a random sales guy, with no coding experience solve that issue?
                        <br />

                        Our in-house email client means you don't have to use another application for your email tasks. It's finally great that a CRM has this feature. With our integrated email client, you can answer customers directly, ensuring the email trail stays within the CRM. Plus, you'll get all the right notifications where you need them—on your dashboard.
                        <br />
                        The number of times a customer emailed me and it wasn't picked up by the CRM, sometimes even resulting in lost sales, is beyond frustrating. Our solution ensures you won't miss important communications, helping you maintain seamless and efficient customer interactions.
                      </Text>
                    </Column>
                  </Row>

                  <div className="relative mt-3">
                    <Hr className="border-b text-[#eaeaea] border-[#eaeaea]" />
                    <label className="flex text-[16px] absolute left-3 bg-[#ffffff] rounded-full -top-3 px-2 transition-all peer-placeholder-shown:top-2.5 peer-focus:-top-3">
                      <strong>Document Builder</strong>
                      <Link href={`${baseUrl}/dealer/document/builder`} target="_blank" className="cursor-pointer background-none border-none my-auto">
                        <Link2 color="#000000" className="flex ml-[15px]" />
                      </Link>
                    </label>
                  </div>
                  <Row>
                    <Column className="flex">
                      <Text className="text-black text-[14px] leading-[24px]">
                        Our in-house document builder enables you to never have to fill out another document ever again. The amount of time wasted during these needed exercises is mind blowing, do not time your self because if you do the math... its very sad conclusion. You build your documents once, and in every single customer profile, you can print whatever documents you need whenever you want. No more filling out paperwork, writing the same information on multiple pieces of paper, or typing it out across different applications for every single customer.
                        <br />
                        That ends today. Contracts, test drive waivers, licensing paperwork, work orders for your service and parts departments—you can automate every single document you need. Now, it's just a matter of clicking a button.
                      </Text>
                    </Column>
                  </Row>

                  <div className="relative mt-3">
                    <Hr className="border-b text-[#eaeaea] border-[#eaeaea]" />
                    <label className="flex flex-row items-center text-[16px] absolute left-3 bg-[#ffffff] rounded-full -top-3 px-2 transition-all peer-placeholder-shown:top-2.5 peer-focus:-top-3">
                      <strong>Script Builder</strong>
                      <Link href={`${baseUrl}/dealer/user/dashboard/templates`} target="_blank" className="cursor-pointer background-none border-none my-auto">
                        <Link2 color="#000000" className="mx-[7px]" />
                      </Link>
                      <strong>/ Scripts</strong>
                      <Link
                        href={`${baseUrl}/dealer/user/dashboard/scripts`} target="_blank" className="cursor-pointer background-none border-none my-auto">
                        <Link2 color="#000000" className="mx-[7px]" />
                      </Link>
                    </label>
                  </div>
                  <Row>
                    <Column className="flex">
                      <Text className="text-black text-[14px] leading-[24px]">
                        Our in-house script builder helps you create scripts easily without needing another tool or system. It also provides a plethora of scripts from our own sales books. Countless times, we have lost our scripts because they're on the computer when you quit or get fired and forget or you may just not be able to physically get it before you leave. This is a shared resource with no ties to any dealer. Get fired or quit as many times as you want, next dealer your in. You use this same system you already know, with all of your hard work there. If you have scripts you'd like to add to the central repository, feel free to email us with your suggestions. Scripts are a powerful tool, more so than you might think. This doesn't mean you can't save your own scripts to keep to yourself, but if you would like to share the wealth of knowledge with other sales people and bring the people up around you, this will pay back in dividends. For a long time, I didn't learn a new script, rubbutal or anything. It was years, but I changed one thing I did in regards to my co-workers. I helped them as much as I did with my own sales game. One thing that I was not expecting from this, was the wealth of knowledge I would get back from doing this. Share scripts or tactics with another sales person, and because they think differently than you do, they execute it diffrently and sometimes maybe even a little better. Perfect, I just got a little bit better. Over the years, that little bit here and there adds up.
                        <br />
                        When it hits 5 pm and there's still an hour left, but you're out of ideas for talking to customers after a full day of calling, I like to go through the catalog of scripts I have while waiting for people to pick up the phone. This routine has often helped me generate new scripts. A sales coach once caught me doing this and I noted that I had talked to over 250 people that day and was running out of ideas and was using this approach to stay fresh on the phone. He stole that idea to teach to his guys. This simple routine of re-reading my own scripts helps me think of new topics, generate more scripts, or refine the ones I already have. It helps me perfect the wording needed to get a customer to make a deposit and buy.
                        <br />
                        A well-written script takes hours to create. If you're already waiting for calls to be picked up, why not use that time to improve your toolkit?
                      </Text>
                    </Column>
                  </Row>
                </>


                <Hr className="border-b text-[#eaeaea] border-[#eaeaea]" />
                <Row>
                  <Column className="flex">
                    <Text className="text-black text-[14px] leading-[24px]">
                      You should be able to accomplish what you need to start using the application with what we have gone over. If you get lost and don't know where to find something, you can refer to the documentation or browse the right sidebar by clicking on the menu icon on the top right-hand corner of the page. All the pages you have access to will be categorized for easy navigation.
                    </Text>
                  </Column>
                </Row>
                <Text className="text-black text-[14px] leading-[24px]">
                  Again, thank you for your business, and I hope this CRM brings you as much of an increase in business as it did for me.
                  <br />
                  Skyler Zanth
                  <br />
                </Text>
              </Section>
              <Hr className="border-b text-[#eaeaea] border-[#eaeaea]" />
              <Section className="text-center mt-[32px] mb-[32px]">
                <Button
                  href={`${baseUrl}/auth/login`}
                  className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                >
                  Login
                </Button>
              </Section>
            </Container>
            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
            <Text className="text-[#666666] text-[12px] leading-[24px]">
              © Dealer Sales Assistant <br />
              613-898-0992  <br />
              skylerzanth@gmail.com <br />
              15490 Ashburn Rd, Berwick, ON, K0C 1G0, Canada
            </Text>
          </Body>
        </Tailwind>
      </Tailwind>
    </Html>
  );
};
const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "";
export default EmployEmail

