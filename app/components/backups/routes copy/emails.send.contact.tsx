import { json, type ActionFunction, type DataFunctionArgs, redirect } from "@remix-run/node";
import { Resend } from "resend";
import ScriptForm from "./emails/contact/scriptForm";

import ContactForm from "./emails/contact/contact";
import { model } from '~/models'
const resend = new Resend(process.env.RESEND_API_KEY);
import {
    Body, Container, Head, Row, Column, Heading, Hr, Html, Preview, Tailwind, Text, Section,
} from "@react-email/components";

export const action: ActionFunction = async ({ request, params }) => {
    const referer = request.headers.get("Referer");
    console.log('referer', referer)
    const formPayload = Object.fromEntries(await request.formData());
    const userSession = await authenticator.isAuthenticated(request, {
        failureRedirect: "/login",
    });
    const user = await model.user.query.getForSession({ id: userSession.id });

    const userEmail = formPayload.userEmail
    const userFname = formPayload.userFname
    const customContent = formPayload.customContent
    const adminEmail = 'skylerzanth@gmail.com'
    const intent = formPayload.intent
    const email = formPayload.email
    // ---- Script Form ---- //

    if (intent === 'demoInquiry') {
        const data = await resend.emails.send({
            from: `${userFname} <admin@dealersalesassistant.ca>`,
            to: `skylerzanth@gmail.com`,
            subject: `CRM Demo Inquiry:`,
            react: ScrDemoInqiptForm({
                email
            }),
        });
        console.log('200 sent script', 200)
        return ({ data, user, status: { code: 204, message: 'Email sent successfully!' } })
    }
    if (intent === 'scriptForm') {
        const data = await resend.emails.send({
            from: `${userFname} <admin@dealersalesassistant.ca>`,
            to: `${adminEmail}`,
            subject: `Script Form: ${userFname} @ ${userEmail}`,
            react: ScriptForm({
                userEmail, userFname, customContent
            }),
        });
        console.log('200 sent script', 200)
        return ({ data, user, status: { code: 204, message: 'Email sent successfully!' } })
    }

    // ---- Contact Form ---- //
    if (intent === 'contactForm') {
        const data = await resend.emails.send({
            from: `${userFname} <admin@dealersalesassistant.ca>`,
            to: `${adminEmail}`,
            subject: `Contact Form: ${userFname} @ ${userEmail}`,
            react: ContactForm({
                userEmail, userFname, customContent
            }),
        });
        console.log('200', 200)
        return ({ data, user, status: { code: 204, message: 'Email sent successfully!' } })
    }
}



export async function loader({ request, params }: DataFunctionArgs) {
    const referer = request.headers.get("Referer");
    if (referer) {
        return redirect(referer);
    } else {
        return json({ error: "No referer found." });
    }
}

export default function RedirectPage({ request }) {
    const referer = request.headers.get("Referer");
    if (referer) {
        return redirect(referer);
    } else {
        return json({ error: "No referer found." });
    }
};




const DemoInq = ({
    email,
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
                                email from: {email} inquiring about a demo for the crm
                            </Text>
                            <Hr style={hr} />

                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};


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
