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

import { Resend } from "resend";
import { json, redirect } from "@remix-run/node";
const resend = new Resend('re_YFCDynPp_5cod9FSRkrbS6kfmRsoqSsBS');


export default async function CheckingDealerPlan(customer) {
  console.log(customer, 'in email function ')
  const SendEmail = () => {
    return (
      <Html>
        <Head />
        <Preview>DSA Contact Us Email</Preview>
        <Tailwind>
          <Preview>DSA Contact Us Email</Preview>
          <Tailwind>
            <Body className="bg-white my-auto mx-auto font-sans px-2" >
              <Container className="border border-solid border-[#eaeaea] rounded-md my-[40px] mx-auto p-[20px] max-w-[465px]">
                <Heading className="text-black text-[16px] font-normal text-center p-0 my-[30px] mx-0">
                  Someone is trying to reach out to us using one of our contact us forms
                </Heading>
                <Section>
                <Hr className="border-b text-[#eaeaea] border-[#eaeaea]" />

                <Text className="text-black text-[12px] leading-[24px]">
                    {customer.reason}
                    <br />
                   Purchasing time frame: {customer.purchaseTime}
                    <br />
                  </Text>
                  <Hr className="border-b text-[#eaeaea] border-[#eaeaea]" />
                  <Row>
                    <Column className="flex">
                      <Text className="text-black text-[12px] leading-[24px]">
                        {customer.message}
                      </Text>
                    </Column>
                  </Row>
                  <Hr className="border-b text-[#eaeaea] border-[#eaeaea]" />
                  <Text className="text-black text-[12px] leading-[24px]">
                    {customer.firstName} {customer.lastName}
                    <br />
                    {customer.email}
                    <br />
                  </Text>
                </Section>
                <Hr className="border-b text-[#eaeaea] border-[#eaeaea]" />

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
    )
  }
  const email = await resend.emails.send({
    from: "Admin <admin@resend.dev>",
    reply_to: 'skylerzanth@gmail.com',
    to: ['skylerzanth@gmail.com'],
    subject: `DSA Contact Us Email.`,
    react: <SendEmail />
  });
  return json({ email }, redirect('/'))
};

