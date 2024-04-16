
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



interface ContactMeEmailProps {
    userEmail: string;
    customContent: string;
    userFname: string;
}

const ScriptForm = ({
    userFname,
    userEmail,
    customContent,

}: ContactMeEmailProps) => {
    const previewText = `Someone is reaching out through the script form`;
    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Tailwind>
                <Body style={main}>
                    <Container style={container}>
                        <Section style={box}>
                            <Text className="text-black text-2xl font-thin leading-[24px]">
                                Script Form: {userFname} @ {userEmail}
                            </Text>
                            <Hr style={hr} />
                            <Text style={paragraph}>
                                User script: {customContent}
                            </Text>
                            <Hr style={hr} />
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default ScriptForm;

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
