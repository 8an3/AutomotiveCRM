import {
    Body, Container, Head, Row, Column, Heading, Hr, Html, Preview, Tailwind, Text, Section,
} from "@react-email/components";

const ContentPayments = ({ deposit, months, weekly, biweekly, monthly }) => {
    return (
        <>
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
        </>
    )
}

export default ContentPayments

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