import { Body, Container, Head, Row, Column, Heading, Hr, Html, Preview, Tailwind, Text, Section, Img } from "@react-email/components";
import * as React from "react";
import EmailContent from "../contentEmail";
import FullBreakdownContent from "../contentFullBreakdown";
import Signature from "../contentSignature";
import { type ContactMeEmailProps } from '../contentInterfaceProps'
import ContentTotal from "../contentTotals";
import ContentPayments from "../contentPayments";
import OptionsBreakdown from "../optionsBreakdown";

const TempOptionsWBreakdown = ({
	discount, discountPer, brand, customContent,monthly,  painPrem, model2, biweekly, userAirTax,weekly,  userDemo, userMarketAdj, dealer, userGasOnDel, destinationCharge, userFinance, userGovern, userTireTax, onTax, total, months, stockNum, year, deposit, licensing, labour, accessories, msrp, tradeValue, model, modelCode, customerName, model1, userEmail, userPhone, qcTax, userFname, weeklyqc, biweeklyqc, qc60, pdi, admin, commodity, userServicespkg, vinE, rustProofing, userGap, userLoanProt, userTireandRim, userOther, userExtWarr,
}: ContactMeEmailProps) => {
	const previewText = `${brand} ${model2} model information.`;
	const brandId = brand
	return (
		<Html>
			<Head />
			<Preview>{previewText}</Preview>
			<Tailwind>
				<Body style={main}>
					<Container style={container}>
						<Section style={box}>
						<EmailContent model2={model2} customerName={customerName} userPhone={userPhone} userEmail={userEmail} />

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
							/>

							<OptionsBreakdown
								userExtWarr={userExtWarr}
								userServicespkg={userServicespkg}
								vinE={vinE}
								rustProofing={rustProofing}
								userGap={userGap}
								userLoanProt={userLoanProt}
								userTireandRim={userTireandRim}
								userOther={userOther} />



							<ContentTotal discount={discount} discountPer={discountPer} total={total} withTax={onTax} />
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

export default TempOptionsWBreakdown;

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
