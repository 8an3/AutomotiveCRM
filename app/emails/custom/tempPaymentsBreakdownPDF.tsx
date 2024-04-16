import { Body, Container, Head, Row, Column, Heading, Hr, Html, Preview, Tailwind, Text, Section, } from "@react-email/components";
import * as React from "react";
import EmailContent from "../contentEmail";
import FullBreakdownContent from "../contentFullBreakdown";
import Signature from "../contentSignature";
import { type ContactMeEmailProps } from '../contentInterfaceProps'
import ContentPayments from "../contentPayments";
import ContentTotal from '../contentTotals'

const TempPaymentsBreakdownPDF = ({
	discount,
	discountPer,
	brand,
	painPrem,
	dealer,
	onTax,
	total,
	months,
	stockNum,
	year,
	deposit,
	licensing,
	labour,
	accessories,
	msrp,
	tradeValue,
	model,
	modelCode,
	customerName,
	model2,
	url,
	userEmail,
	userPhone,
	userFname,
	weekly,
	biweekly,
	monthly,
	pdi,
	admin,
	commodity,
}: ContactMeEmailProps) => {
	const previewText = `${brand} ${model2} model information.`;
	return (
		<Html>
			<Head />
			<Preview>{previewText}</Preview>
			<Tailwind>
				<Body style={main}>
					<Container style={container}>
						<Section style={box}>

							<EmailContent model2={model2} customerName={customerName} userPhone={userPhone} userEmail={userEmail} />
							<Text style={paragraph}>
								Here is the link to the spec sheet for the {model2}: {url}
							</Text>
							<FullBreakdownContent
								brand={brand}
								model2={model2}
								model={model}
								modelCode={modelCode}
								stockNum={stockNum}
								year={year}
								pdi={pdi}
								msrp={msrp}
								admin={admin}
								commodity={commodity}
								accessories={accessories}
								labour={labour}
								licensing={licensing}
								deposit={deposit}
								tradeValue={tradeValue}
								onTax={onTax}
								total={total}
								months={months}
								painPrem={painPrem}

							/>

							<ContentPayments deposit={deposit} monthly={monthly} biweekly={biweekly} weekly={weekly} months={months} />
							<ContentTotal withTax={onTax} total={total} discountPer={discountPer} discount={discount} />

							<Hr style={hr} />

							<Signature paragraph={paragraph} userFname={userFname} dealer={dealer} userPhone={userPhone} userEmail={userEmail} />

						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
};

export default TempPaymentsBreakdownPDF;

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
