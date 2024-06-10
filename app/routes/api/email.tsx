

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

export const CronEmail = ({ message, user, appointment }) => {
  return (
    <Html>
      <Head />
      <Preview>Upcoming appointment.</Preview>
      <Tailwind>
        <Preview>Upcoming appointment.</Preview>
        <Tailwind>
          <Body className="bg-white my-auto mx-auto font-sans px-2" >
            <Container className="border border-solid border-[#eaeaea] rounded-md my-[40px] mx-auto p-[20px] max-w-[465px]">
              <Section>
                <Text className="text-black text-[14px] leading-[24px]">
                  {message}
                </Text>
                <Text className="text-black text-[14px] leading-[24px]">
                  Again, thank you for your business, and I cant wait to see you.
                  <br />
                  {user.name}
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
  );
};

export default CronEmail

