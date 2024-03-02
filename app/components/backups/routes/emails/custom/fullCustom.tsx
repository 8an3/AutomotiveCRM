
import {
	Body,
	Container,
	Head,
	Row,
	Column,
	Heading,
	Hr,
	Img,
	Html,
	Preview,
	Tailwind,
	Link,
	Text,
	Section,
} from "@react-email/components";
import * as React from "react";
import { type ContactMeEmailProps } from '../contentInterfaceProps'
import Signature from "../contentSignature";
import ContentPayments from "../contentPayments";


const FullCustom = ({
	model1,
	userEmail,
	userPhone,
	userFname,
	customContent,

	dealer,
	preview,
	clientData,
	brand,
}: ContactMeEmailProps) => {
	const previewText = `${preview}`;
	const clientFname = clientData.clientFname;
	console.log(clientFname);
	const content = customContent;
	const image = 'https://s3.amazonaws.com/activix-crm-live/accounts/1093/logo_en.png?v=1702224134'
	return (
		<Html>
			<Head />
			<Preview>{previewText}</Preview>
			<Tailwind>
				<Body >
					<Container style={container}>

						<Section style={main} className="rounded-md">
							<Text style={paragraph}>Hello {clientData.firstName},</Text>
							<Text style={paragraph}>
								{customContent}
							</Text>
							<Text style={paragraph}>Make it a great day</Text>
							<Hr style={hr} />
							{userEmail !== 'skylerzanth@gmail.com' && (
								<>
									<Row className="justify-start">
										<Column>
											<Text style={{ ...paragraph, fontSize: '20px' }}>
												{userFname}
											</Text>
											<Text style={paragraph}>Sales Representative</Text>
										</Column>
										<Column style={productPriceVerticalLine} className="border-black"></Column>
										<Column>
											<Text style={link}>{dealer}</Text>
											<Text style={signature}>
												{userPhone}
											</Text>

										</Column>

									</Row>
								</>
							)}
							{userEmail === 'skylerzanth@gmail.com' && (
								<>
									<Section align="left">
										<Column style={tableCell} align="left">
											<Text className="" style={{ ...signature, fontSize: '20px' }}>
												Skyler Zanth
											</Text>
											<Text style={signature}>Sales Representative</Text>
										</Column>
										<Column style={productPriceVerticalLine} className="border-black"></Column>
										<Column style={productPriceLargeWrapper} align="left">
											<Link href="https://hdottawa.com">
												<Text style={link}>Freedom Harley-Davidson</Text>
											</Link>
											<Link href="https://hdottawa.com">
												<Text style={signature}>
													613-736-8899
												</Text>
												<Link href="https://maps.app.goo.gl/svC6rWnpHXTvRFNq5">
													<Text style={link}>
														1963 Merivale Rd
													</Text>
													<Text style={link}>
														Ottawa, ON
													</Text>
													<Text style={link}>
														K2G 1G1
													</Text>
												</Link>
											</Link>
										</Column>
									</Section>

								</>
							)}

						</Section>





					</Container>
				</Body>
			</Tailwind>
		</Html >
	);
};
/**<Body style={main}>
					<Container style={container}>
						<Section style={paragraphContent}>
							<Text style={paragraph}>
								{customContent}
							</Text>
							<Hr style={hr} />

						</Section>
					</Container>


				</Body> */
export default FullCustom;

const main = {
	padding: '0 40px',
	backgroundColor: '#dbddde',
	fontFamily:
		'-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};
const productPriceLargeWrapper = { display: 'table-cell' };


const productPriceVerticalLine = {
	height: '48px',
	borderLeft: '1px solid',
	borderColor: 'rgb(238,238,238)',
	margin: '0 20px',
	padding: '0 20px',
};
const sectionLogo = {
	padding: '0 40px',
};
const productPriceWrapper = {
	display: 'table-cell',
	padding: '0px 20px 0px 0px',
	width: '100px',
	verticalAlign: 'top',
};

const headerBlue = {
	marginTop: '-1px',
};
const tableCell = { display: 'table-cell' };

const container = {
	margin: '30px auto',
	width: '700px',
	backgroundColor: '#fff',
	borderRadius: 5,
	overflow: 'hidden',
};

const containerContact = {
	backgroundColor: '#f0fcff',
	width: '90%',
	borderRadius: '5px',
	overflow: 'hidden',
	paddingLeft: '20px',
};

const heading = {
	fontSize: '14px',
	lineHeight: '26px',
	fontWeight: '700',
	color: '#004dcf',
};

const paragraphContent = {
	padding: '0 40px',
};

const paragraphList = {
	paddingLeft: 40,
};

const paragraph = {
	fontSize: '14px',
	lineHeight: '22px',
	color: '#3c4043',
};
const signature = {
	fontSize: '14px',
	lineHeight: '5px',
	color: '#3c4043',
};
const link = {
	fontSize: '14px',
	lineHeight: '10px',
	color: '#004dcf',
};

const hr = {
	borderColor: '#0a0a0a',
	margin: '20px 0',
};
