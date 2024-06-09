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


export const DealerOnboarding = (dealer) => {
  return (
    <Html>
      <Head />
      <Preview>Welcome to the DSA team, {dealer.dealerName}</Preview>
      <Tailwind>
        <Preview>Welcome to the DSA team, {dealer.dealerName}.</Preview>
        <Tailwind>
          <Body className="bg-white my-auto mx-auto font-sans px-2" >
            <Container className="border border-solid border-[#eaeaea] rounded-md my-[40px] mx-auto p-[20px] max-w-[465px]">
              <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
                Welcome to the<strong> DSA team, </strong> we're happy to have you here, <strong>{dealer.dealerName}</strong>
              </Heading>
              <Text className="text-black text-[14px] leading-[24px]">
                Thank you for your business, {dealer.contact}! I hope your team is as excited to use the application as I was when building it to use every day. This is just a quick email to give you key pieces of information you will need to use the application.
              </Text>
              <Section>

                <div className="relative mt-3">
                  <Hr className="border-b text-[#eaeaea] border-[#eaeaea]" />
                  <label className="flex text-[16px] absolute left-3 bg-[#ffffff] rounded-full -top-3 px-2 transition-all peer-placeholder-shown:top-2.5 peer-focus:-top-3">
                    <strong>Login</strong>
                    <Link href="/http://localhost:3000/auth/login" target="_blank" className="cursor-pointer background-none border-none my-auto">
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


                <div className="relative mt-3">
                  <Hr className="border-b text-[#eaeaea] border-[#eaeaea]" />
                  <label className="flex text-[16px] absolute left-3 bg-[#ffffff] rounded-full -top-3 px-2 transition-all peer-placeholder-shown:top-2.5 peer-focus:-top-3">
                    <strong>Admin Area</strong>
                    <Link href="http://localhost:3000/dealer/admin/overview" target="_blank" className="cursor-pointer background-none border-none my-auto">
                      <Link2 color="#000000" className="flex ml-[15px]" />
                    </Link>
                  </label>
                </div>
                <Row>
                  <Column className="flex align-center">
                    <Text className="text-black text-[14px] leading-[24px]">
                      The admin dashboard is where you can add employees, import/export data, manage users, search data in the database, and more. First, we'll focus on adding an employee. It's a very simple form to fill out. If you have ever filled out a survey online, its format is very similar to ensure anyone who uses it can do so easily.
                    </Text>
                  </Column>
                </Row>

                <div className="relative mt-3">
                  <Hr className="border-b text-[#eaeaea] border-[#eaeaea]" />
                  <label className="flex text-[16px] absolute left-3 bg-[#ffffff] rounded-full -top-3 px-2 transition-all peer-placeholder-shown:top-2.5 peer-focus:-top-3">
                    <strong>Documentation</strong>
                    <Link href="http://localhost:3000/dealer/docs/sales" target="_blank" className="cursor-pointer background-none border-none my-auto">
                      <Link2 color="#000000" className="flex ml-[15px]" />
                    </Link>
                  </label>
                </div>
                <Row>
                  <Column className="flex">
                    <Link href="" target="_blank" className="cursor-pointer background-none border-none my-auto">
                      <Link2 color="#000000" className="flex mr-[15px]" />
                    </Link>
                    <Text className="text-black text-[14px] leading-[24px]">
                      To learn more about the features, there is in-depth documentation split up by department or position, and there is even a section just for owners/dealer principals. So you can learn how to get the best out of this application.
                    </Text>
                  </Column>
                </Row>


                <div className="relative mt-3">
                  <Hr className="border-b text-[#eaeaea] border-[#eaeaea]" />
                  <label className="flex text-[16px] absolute left-3 bg-[#ffffff] rounded-full -top-3 px-2 transition-all peer-placeholder-shown:top-2.5 peer-focus:-top-3">
                    <strong>Owner Dashboard</strong>
                    <Link href="http://localhost:3000/dealer/owner/dashboard" target="_blank" className="cursor-pointer background-none border-none my-auto">
                      <Link2 color="#000000" className="flex ml-[15px]" />
                    </Link>
                  </label>
                </div>
                <Row>
                  <Column className="flex">
                    <Link href="http://localhost:3000/dealer/owner/dashboard" target="_blank" className="cursor-pointer background-none border-none my-auto">
                      <Link2 color="#000000" className="flex mr-[15px]" />
                    </Link>
                    <Text className="text-black text-[14px] leading-[24px]">
                      You have your own dashboard to give you key pieces of information on what is happening in your dealership on a daily basis.
                    </Text>
                  </Column>
                </Row>


                <Hr className="border-b text-[#eaeaea] border-[#eaeaea]" />
                <Row>
                  <Column className="flex">
                    <Text className="text-black text-[14px] leading-[24px]">
                      You should be able to accomplish what you need to start using the application with what we have gone over. If you get lost and don't know where to find something, you can either refer to the documentation or browse the right sidebar by clicking on the menu icon on the top right-hand corner of the page. All the pages you have access to will be categorized to find what you need easily.
                    </Text>
                  </Column>
                </Row>
                <Row>
                  <Column>
                    <Text className='text-left'>
                      Dealer App URL
                    </Text>
                  </Column>
                  <Column>
                    <Link href={`${dealer.vercel}`} className='text-right'>
                      {dealer.vercel}
                    </Link>
                  </Column>
                </Row>

                <Text className="text-black text-[14px] leading-[24px]">
                  Again, thank you for your business, and I hope this brings you as much of an increase in business as it did for me,
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
