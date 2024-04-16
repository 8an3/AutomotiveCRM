import {
    Body, Container, Head, Row, Column, Heading, Hr, Html, Preview, Tailwind, Text, Section,
} from "@react-email/components";

const Signature = ({ paragraph, userFname, dealer, userPhone, userEmail }) => {
    return (
        <>
            <Text style={paragraph}>
                Best regards,
            </Text>
            <Text style={paragraph}>
                {userFname}
            </Text>
            <Text style={paragraph}>
                {dealer}
            </Text>
            <Text style={paragraph}>
                {userPhone}
            </Text>
            <Text style={paragraph}>
                {userEmail}
            </Text>
        </>
    )
}

export default Signature