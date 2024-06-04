

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

export const EmployEmail = (dealer, userAdd) => {
  let DeptSect;
  switch (userAdd.dept) {
    case 'Sales':
      DeptSect = <SalesSection dealer={dealer} />;
      break;
    case 'Service':
      DeptSect = <ServiceSection dealer={dealer} />;
      break;
    case 'Admin':
      DeptSect = <AdminSection dealer={dealer} />;
      break;
    case 'Finance':
      DeptSect = <FinanceSection dealer={dealer} />;
      break;
    case 'Accessories':
      DeptSect = <AccessoriesSection dealer={dealer} />;
      break;
    case 'Parts':
      DeptSect = <PartsSection dealer={dealer} />;
      break;
    case 'Manager':
      DeptSect = <ManagerSection dealer={dealer} />;
      break;
    case 'Technician':
      DeptSect = <TechSection dealer={dealer} />;
      break;
    default:
      DeptSect = null;
  }


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
                Whether you just got hired or have been at the dealer for a while and are switching to our new CRM, congratulations on making a step in the right direction to improve your daily worklife. This CRM will save you countless hours compared to competing products because it was made by a sales team, tired of wasting time on poorly thought-out applications. <br />
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

                {DeptSect}

                <div className="relative mt-3">
                  <Hr className="border-b text-[#eaeaea] border-[#eaeaea]" />
                  <label className="flex text-[16px] absolute left-3 bg-[#ffffff] rounded-full -top-3 px-2 transition-all peer-placeholder-shown:top-2.5 peer-focus:-top-3">
                    <strong>Staff Area</strong>
                    <Link href="/dealer/staff/chat" target="_blank" className="cursor-pointer background-none border-none my-auto">
                      <Link2 color="#000000" className="flex ml-[15px]" />
                    </Link>
                  </label>
                </div>
                <Row>
                  <Column className="flex">
                    <Text className="text-black text-[14px] leading-[24px]">
                      Our staff area includes a chat feature, so you don't have to use another application for internal communication, or wait on other staff members to finish with their clients before talking to them about a deal. In here as well are the dealerships leaderboards for every dept.
                    </Text>
                  </Column>
                </Row>
                <Hr className="border-b text-[#eaeaea] border-[#eaeaea]" />
                <Row>
                  <Column className="flex">
                    <Text className="text-black text-[14px] leading-[24px]">
                      You should be able to accomplish what you need to start using the application with what we have gone over. If you get lost and don't know where to find something, you can refer to the documentation or browse the right sidebar by clicking on the menu icon on the top right-hand corner of the page. All the pages you have access to will be categorized for easy navigation.
                    </Text>
                  </Column>
                </Row>
                <Text className="text-black text-[14px] leading-[24px]">
                  Again, thank you for your business, and I hope this CRM brings you as much of an increase in business as it did for me,
                  <br />
                  Skyler Zanth
                  <br />
                </Text>
              </Section>
              <Hr className="border-b text-[#eaeaea] border-[#eaeaea]" />
              <Section className="text-center mt-[32px] mb-[32px]">
                <Button
                  href="http://localhost:3000/auth/login"
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

function SalesSection(dealer) {
  return (
    <>

      <div className="relative mt-3">
        <Hr className="border-b text-[#eaeaea] border-[#eaeaea]" />
        <label className="flex text-[16px] absolute left-3 bg-[#ffffff] rounded-full -top-3 px-2 transition-all peer-placeholder-shown:top-2.5 peer-focus:-top-3">
          <strong>Documentation</strong>
          <Link href="/dealer/docs/sales" target="_blank" className="cursor-pointer background-none border-none my-auto">
            <Link2 color="#000000" className="flex ml-[15px]" />
          </Link>
        </label>
      </div>
      <Row>
        <Column className="flex">
          <Text className="text-black text-[14px] leading-[24px]">
            To learn more about the features, there is in-depth documentation organized by department or position, including a dedicated section for salespeople. Spending time with this documentation will help you get the most out of this application. With the intuitive design, if you have used a CRM before, you will quickly adapt without needing the documentation. However, the documentation contains many valuable tips to help you increase your sales, so don't skip it entirely.
            <br />
            One of the most significant advantages is a process that addresses one of the biggest challenges in the sales department: the finance hand-off. Often, this hand-off isn't smooth unless the customer leaves and schedules a time to return and sign. Usually, this doesn't happen, and there's a risk they might be followed up by another dealer offering a better deal. Our application handles this gracefully, in a way that we're surprised no one has thought of before. To learn about this feature, you'll need to explore the documentation.
          </Text>
        </Column>
      </Row>

      <div className="relative mt-3">
        <Hr className="border-b text-[#eaeaea] border-[#eaeaea]" />
        <label className="flex text-[16px] absolute left-3 bg-[#ffffff] rounded-full -top-3 px-2 transition-all peer-placeholder-shown:top-2.5 peer-focus:-top-3">
          <strong>Sales Dashboard</strong>
          <Link href="/dealer/leads/sales/dashboard" target="_blank" className="cursor-pointer background-none border-none my-auto">
            <Link2 color="#000000" className="flex ml-[15px]" />
          </Link>
        </label>
      </div>
      <Row>
        <Column className="flex align-center">
          <Text className="text-black text-[14px] leading-[24px]">
            The sales dashboard is where you will spend the majority of your time. You can choose to use the dashboard to make your calls or the sales calendar. We have talked about the dashboard enough across all the avenues that we reach out to people, so we will assume you already its better than every other dash on the market.
          </Text>
        </Column>
      </Row>

      <div className="relative mt-3">
        <Hr className="border-b text-[#eaeaea] border-[#eaeaea]" />
        <label className="flex text-[16px] absolute left-3 bg-[#ffffff] rounded-full -top-3 px-2 transition-all peer-placeholder-shown:top-2.5 peer-focus:-top-3">
          <strong>Sales Calendar</strong>
          <Link href="/dealer/calendar/sales" target="_blank" className="cursor-pointer background-none border-none my-auto">
            <Link2 color="#000000" className="flex ml-[15px]" />
          </Link>
        </label>
      </div>
      <Row>
        <Column className="flex">
          <Text className="text-black text-[14px] leading-[24px]">
            The sales calendar can be used as your main dashboard or for referencing and editing appointments for your department and others. This calendar was developed by salespeople for salespeople. Most CRMs do a poor job with the sales calendar, either because the designers don't use it themselves or don't understand the needs of salespeople.
            <br />
            Our calendar, along with the dashboard, went through countless revisions to get it right. Admittedly, the dashboard underwent more revisions, but both tools are crucial for salespeople. These two features can either help you succeed and become a rock star or waste so much of your time that you become just another struggling salesperson.
          </Text>
        </Column>
      </Row>

      <div className="relative mt-3">
        <Hr className="border-b text-[#eaeaea] border-[#eaeaea]" />
        <label className="flex text-[16px] absolute left-3 bg-[#ffffff] rounded-full -top-3 px-2 transition-all peer-placeholder-shown:top-2.5 peer-focus:-top-3">
          <strong>Email Client</strong>
          <Link href="/dealer/email/client" target="_blank" className="cursor-pointer background-none border-none my-auto">
            <Link2 color="#000000" className="flex ml-[15px]" />
          </Link>
        </label>
      </div>
      <Row>
        <Column className="flex">
          <Text className="text-black text-[14px] leading-[24px]">
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
          <Link href="/dealer/document/builder" target="_blank" className="cursor-pointer background-none border-none my-auto">
            <Link2 color="#000000" className="flex ml-[15px]" />
          </Link>
        </label>
      </div>
      <Row>
        <Column className="flex">
          <Text className="text-black text-[14px] leading-[24px]">
            Our in-house document builder allows you to create documents without needing another application. You build your documents once, and in every single customer profile, you can print whatever documents you need whenever you want. No more filling out paperwork, writing the same information on multiple pieces of paper, or typing it out across different applications for every single customer.
            <br />
            That ends today. Contracts, test drive waivers, licensing paperwork, work orders for your service and parts departments—you can automate every single document you need. Now, it's just a matter of clicking a button.
          </Text>
        </Column>
      </Row>

      <div className="relative mt-3">
        <Hr className="border-b text-[#eaeaea] border-[#eaeaea]" />
        <label className="flex flex-row items-center text-[16px] absolute left-3 bg-[#ffffff] rounded-full -top-3 px-2 transition-all peer-placeholder-shown:top-2.5 peer-focus:-top-3">
          <strong>Script Builder</strong>
          <Link href="/dealer/user/dashboard/templates" target="_blank" className="cursor-pointer background-none border-none my-auto">
            <Link2 color="#000000" className="mx-[7px]" />
          </Link>
          <strong>/ Scripts</strong>
          <Link href="/dealer/user/dashboard/scripts" target="_blank" className="cursor-pointer background-none border-none my-auto">
            <Link2 color="#000000" className="mx-[7px]" />
          </Link>
        </label>
      </div>
      <Row>
        <Column className="flex">
          <Text className="text-black text-[14px] leading-[24px]">
            Our in-house script builder helps you create scripts easily without needing another tool or system. It also provides a plethora of scripts from our own sales books. If you have scripts you'd like to add, feel free to email us with your suggestions. Scripts are a powerful tool, more so than you might think.
            <br />
            When it hits 5 pm and there's still an hour left, but you're out of ideas for talking to customers after a full day of calling, I like to go through the catalog of scripts I have while waiting for people to pick up the phone. This routine has often helped me generate new scripts. A sales coach once caught me doing this and noted that I had talked to over 250 people that day and was running out of ideas. This simple routine of re-reading my own scripts helps me think of new topics, generate more scripts, or refine the ones I already have. It helps me perfect the wording needed to get a customer to make a deposit and buy.
            <br />
            A well-written script takes hours to create. If you're already waiting for calls to be picked up, why not use that time to improve your toolkit?
          </Text>
        </Column>
      </Row>
    </>
  )
}
function ServiceSection(dealer) {
  return (
    <>

    </>
  )
}
function PartsSection(dealer) {
  return (
    <>

    </>
  )
}
function AccessoriesSection(dealer) {
  return (
    <>

    </>
  )
}
function FinanceSection(dealer) {
  return (
    <>

    </>
  )
}
function AdminSection(dealer) {
  return (
    <>

    </>
  )
}
function ManagerSection(dealer) {
  return (
    <>

    </>
  )
}
function TechSection(dealer) {
  return (
    <>

    </>
  )
}
