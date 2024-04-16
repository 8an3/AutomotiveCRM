import { Body, Container, Head, Row, Column, Heading, Hr, Html, Preview, Tailwind, Text, Section, } from "@react-email/components";
import * as React from "react";
import EmailContent from "./contentEmail";
import Signature from "./contentSignature";
import FullBreakdownContent from "./contentFullBreakdown";
import ContentPayments from "./contentPayments";

interface ContactMeEmailProps {

    withTax: number;
    total: number;

    discount: number;
    discountPer: number;
}

const ContentTotal = ({
    discount,
    discountPer,

    withTax,
    total,

}: ContactMeEmailProps) => {
    return (
        <>
            <Text className="text-black text-2xl font-thin leading-[24px]">
                Total
            </Text>
            <Hr style={hr} />
            {discount > 0 && (
                <Row>
                    <Column align="left">
                        <Text className="text-black text-[14px]">
                            Discount
                        </Text>
                    </Column>

                    <Column align="right">
                        <Text className="text-black text-[14px] ">
                            ${discount}
                        </Text>
                    </Column>
                </Row>
            )}
            {discountPer > 0 && (
                <Row>
                    <Column align="left">
                        <Text className="text-black text-[14px]">
                            Discount %
                        </Text>
                    </Column>

                    <Column align="right">
                        <Text className="text-black text-[14px] ">
                            ${discountPer}
                        </Text>
                    </Column>
                </Row>
            )}
            <Row>
                <Column align="left">
                    <Text className="text-black text-[14px]">
                        Total
                    </Text>
                </Column>

                <Column align="right">
                    <Text className="text-black text-[14px] ">
                        ${total}
                    </Text>
                </Column>
            </Row>
            <Row>
                <Column align="left">
                    <Text className="text-black text-[14px]">
                        After Tax
                    </Text>
                </Column>

                <Column align="right">
                    <Text className="text-black text-[14px] ">
                        ${withTax}
                    </Text>
                </Column>
            </Row>
        </>

    );
};

export default ContentTotal;



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
