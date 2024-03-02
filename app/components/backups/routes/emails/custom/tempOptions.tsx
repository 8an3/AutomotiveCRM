
import {
	Body,
	Container,
	Head,
	Row,
	Column,
	Heading,
	Hr,
	Html,
	Preview,
	Tailwind,
	Text,
	Section,
} from "@react-email/components";
import * as React from "react";
import { type ContactMeEmailProps } from '../contentInterfaceProps'
import Signature from "~/routes/emails/contentSignature";
import FullBreakdownContent from "~/routes/emails/contentFullBreakdown";
import ContentPayments from "../contentPayments";
import EmailContent from "../contentEmail";

const TempOptions = ({
  customerName,
  userEmail,
  userPhone,
  userFname,
  weekly,
  customContent,
  biweekly,
  monthly,
  model2,
  dealer,
  deposit,
  months,
  brand,
}: ContactMeEmailProps) => {
  const previewText = `${brand} ${model2} Payments`;
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body style={main}>
          <Container style={container}>
            <Section style={box}>

            <EmailContent model2={model2} customerName={customerName} userPhone={userPhone} userEmail={userEmail} />


            <ContentPayments deposit={deposit} monthly={monthly} biweekly={biweekly} weekly={weekly} months={months} />


              <Hr style={hr} />

              <Signature paragraph={paragraph} userFname={userFname} dealer={dealer} userPhone={userPhone} userEmail={userEmail} />

            </Section>

          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default TempOptions;

const container = {
	backgroundColor: '#ffffff',
	margin: '0 auto',
	padding: '20px 0 48px',
	marginBottom: '64px',
};
const paragraph = {
	fontSize: '16px',
	lineHeight: '24px',
	textAlign: 'left' as const,
};

const hr = {
	borderColor: '#e6ebf1',
	margin: '20px 0',
};
const main = {
	backgroundColor: '#f6f9fc',
	fontFamily:
		'-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const box = {
	padding: '0 48px',
};
