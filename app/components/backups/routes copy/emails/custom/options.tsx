
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

const Options = ({
	customContent,
	customerName,
	userExtWarr,
	model2,
	userEmail,
	userPhone,
	userFname,
	weekly,
	biweekly,
	monthly,
	dealer,
	deposit,
	months,
	brand,
	userServicespkg,
	vinE,
	rustProofing,
	userGap,
	userLoanProt,
	userTireandRim,
	userOther,
	model,
	modelCode,
	stockNum,
	year,
	pdi,
	msrp,
	admin,
	commodity,
	accessories,
	labour,
	tradeValue,
	licensing,
	onTax,
	total,
	painPrem,
	userAirTax,
	userDemo,
	userMarketAdj,
	userGasOnDel,
	destinationCharge,
	userFinance,
	userGovern,
	userTireTax,
	discount,
	discountPer,
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

							<Text style={paragraph}>
								Dear {customerName},
							</Text>
							<Text style={paragraph}>
								{customContent}
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
								tradeValue={tradeValue}
								licensing={licensing}
								onTax={onTax}
								total={total}
								painPrem={painPrem}
								userAirTax={userAirTax}
								userDemo={userDemo}
								userMarketAdj={userMarketAdj}
								userGasOnDel={userGasOnDel}
								destinationCharge={destinationCharge}
								userFinance={userFinance}
								userGovern={userGovern}
								userTireTax={userTireTax}
								discount={discount}
								discountPer={discountPer}
								deposit={deposit}

								emailAddress={""}
								phoneNumber={""}
								dealer={""}
								customerName={""}
								custEmail={""}
								userEmail={""}
								userPhone={""}
								userFname={""}
								weeklyOth={""}
								biweekOth={""}
								oth60={""}
								userExtWarr={userExtWarr}
								userServicespkg={userServicespkg}
								vinE={vinE}
								rustProofing={rustProofing}
								userGap={userGap}
								userLoanProt={userLoanProt}
								userTireandRim={userTireandRim}
								userOther={userOther}

								months={months}

							/>

							<Text className="text-black text-2xl font-thin leading-[24px]">
								Payments
							</Text>
							<Hr style={hr} />
							<Text style={paragraph}>
								With ${deposit} down, over {months} months your payments are;
							</Text>
							<Row>
								<Column align="left">
									<Text className="text-black text-[14px]">
										${weekly} / Weekly
									</Text>
								</Column>
								<Column align="center">
									<Text className="text-black text-[14px] ">
										${biweekly} / Bi-weekly
									</Text>
								</Column>
								<Column align="right">
									<Text className="text-black text-[14px] ">
										${monthly} / Monthly
									</Text>
								</Column>
							</Row>

							<Hr style={hr} />

							<Signature paragraph={paragraph} userFname={userFname} dealer={dealer} userPhone={userPhone} userEmail={userEmail} />

						</Section>

					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
};

export default Options;

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
