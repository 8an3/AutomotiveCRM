import { Body, Container, Head, Row, Column, Heading, Hr, Html, Preview, Tailwind, Text, Section,
} from "@react-email/components";

const EmailContent = ({ model2, customerName, userPhone, userEmail}) =>  {
    return (
        <>
            <Text style={paragraph}>
                Dear {customerName},
            </Text>
            <Text style={paragraph}>
                I hope this message finds you well. I wanted to express my appreciation for the opportunity to meet with you and discuss your upcoming purchase of the {model2}. It was a pleasure learning about your preferences and requirements.
            </Text>
            <Text style={paragraph}>
                As promised, I have attached the pricing details for the {model2} to this email. Please review the payments below, and if you have any questions or need further information, do not hesitate to reach out.
            </Text>
            <Text style={paragraph}>
                I value your interest in our products, and I'm here to assist you every step of the way. If you decide to move forward with your purchase, call me right away. Otherwise I will follow up with you in a couple of days to ensure a smooth and timely process. You can reach me via email at {userEmail} or directly on my cell phone at {userPhone} for any inquiries or to secure your purchase.
            </Text>
            <Text style={paragraph}>
                Thank you for considering us for your needs. Your satisfaction is our top priority, and I look forward to assisting you further.
            </Text>
        </>
    )
}

export default EmailContent

const paragraph = {
    fontSize: '16px',
    lineHeight: '24px',
    textAlign: 'left' as const,
};
