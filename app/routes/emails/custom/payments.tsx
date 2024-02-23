
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
import Signature from "../contentSignature";
import ContentPayments from "../contentPayments";


const Payments = ({
	customerName,
	model1,
	userEmail,
	userPhone,
	userFname,
	weekly,
	customContent,
	biweekly,
	monthly,
	dealer,
	deposit,
	months,
	brand,
}: ContactMeEmailProps) => {
	const previewText = `${brand} ${model1} Payments`;
	return (
		<Html>
			<Head />
			<Preview>{previewText}</Preview>
			<Tailwind>
				<Body style={main}>
					<Container style={container}>
						<Section style={box}>

							<Text style={paragraph}>
								Dear {customerName},
							</Text>
							<Text style={paragraph}>
								{customContent}
							</Text>
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

export default Payments;

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
