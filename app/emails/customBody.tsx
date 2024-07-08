import { Html, Head, Preview, Body, Container, Row, Column, Text, Section, Hr, Tailwind, Button } from "@react-email/components";
import React, { useEffect, useState } from "react";

const CustomBody = ({ body, user, }) => {



  return (
    <Html>
      <Head />
      <Preview>Payment Breakdown</Preview>
      <Body style={{
        fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
      }}>
        <Container style={{
          borderRadius: '8px 8px 0 0',
          maxWidth: "450px",
          margin: "0px auto",
          backgroundColor: "#ffffff",

        }}>
          <Section style={content}>
            <Text style={paragraph}>
              {body}
            </Text>
          </Section>
        </Container>

      </Body>
    </Html >
  );
};

export default CustomBody
const footer: React.CSSProperties = {
  color: "#6a737d",
  fontSize: "10px",
  justifySelf: "center",
  marginTop: "10px",
  marginBottom: "30px",
  maxWidth: "550px",
};
const hr: React.CSSProperties = {
  textAlign: "center",
  width: '90%',
  margin: '16px auto',
  borderTop: "solid 1px #e6e6e6",
};
const heading = {
  margin: '15px 10px',
  fontSize: '32px',
  color: '#262626',

}
const headingTwo = {
  fontSize: '24px',
  margin: '15px 10px',
  color: '#262626',

}
const leftColumn = {
  color: '#262626',
  fontSize: '14px',
  lineHeight: '14px',
  margin: '5px 10px',
  textAlign: 'left',
  marginRight: 'auto',
} as React.CSSProperties;
const rightColumn = {
  color: '#262626',
  fontSize: '14px',
  lineHeight: '14px',
  margin: '5px 10px',
  fontWeight: 'bold',
  textAlign: 'right',
  marginLeft: 'auto',
} as React.CSSProperties;
const paragraph = {
  lineHeight: '14px',
  fontSize: '14px',
  color: "#262626",
};
const list = {
  lineHeight: '14px',
  fontSize: '14px',
  listStyleType: 'none',
  padding: 0,
  margin: '5px 0',
  color: '#262626',
}
const listItems = {
  align: 'center',
  display: 'flex',
  justifyContent: 'space-between',
  lineHeight: '-5',
  fontSize: 12,
  margin: '-5 0',
  color: '#262626',
  borderRadius: '0.375rem',
}

const container = {
  borderRadius: '8px 8px 0 0',
  maxWidth: "450px",
  margin: "0px auto",
  backgroundColor: "#ffffff",
};
const content = {
  padding: "5px 20px 10px 20px",
};
