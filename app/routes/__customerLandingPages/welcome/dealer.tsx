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

import { Resend } from "resend";
import { json, redirect } from "@remix-run/node";
import { useEffect, useState } from "react";
const resend = new Resend('re_YFCDynPp_5cod9FSRkrbS6kfmRsoqSsBS');


export function DealerWelcomeFirst() {
  const dealer = {
    dealerName: 'test',
    contact: 'me',
  }


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
                Thank you for your business, {dealer.contact}! I hope your team is as excited to use the application as I was when building it to use every day.
              </Text>
              <Section>
                <Hr className="border-b text-[#eaeaea] border-[#eaeaea]" />
                <Row>
                  <Column className="flex">
                    <Text className="text-black text-[14px] leading-[24px]">
                      Before we can set you up, we need some basic information to get your dedicated server up and running. Once completed, we will get your site live and send you an email as soon as it's done, along with all the key pieces of information you need to start using the application.
                    </Text>
                  </Column>
                </Row>
                <Hr className="border-b text-[#eaeaea] border-[#eaeaea]" />
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
                  href="http://localhost:3000/questionnaire/dealer"
                  className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                >
                  Continue To Questionnaire
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

export default async function CheckingDealerPlan() {
  const userThing = {
    email: 'skylerzanth@gmail.com',
    name: 'Skyler Zanth',
  }
  const email = await resend.emails.send({
    from: "Admin <admin@resend.dev>",
    reply_to: 'skylerzanth@gmail.com',
    to: [userThing.email],
    subject: `Welcome to the DSA team, ${userThing.name}.`,
    react: <DealerWelcomeFirst user={userThing} />
  });
  return json({ email }, redirect('/'))
}
