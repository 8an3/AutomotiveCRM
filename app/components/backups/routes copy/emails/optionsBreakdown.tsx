import {
  Body, Container, Head, Row, Column, Heading, Hr, Html, Preview, Tailwind, Text, Section,
} from "@react-email/components";


const OptionsBreakdown = ({ userExtWarr, userServicespkg, vinE, rustProofing, userGap, userLoanProt, userTireandRim, userOther }) => {
  return (
    <>




      <>
        <Text className="text-black text-2xl font-thin leading-[24px]">
          Options
        </Text>
        <Hr style={hr} />

        {userExtWarr > 0 && (

          <Row>
            <Column align="left">
              <Text className="text-black text-[14px]">
                Extended Warranty
              </Text>
            </Column>
            <Column align="right">
            <Text className="text-black text-[14px] ">
                ${userExtWarr}
              </Text>
            </Column>
          </Row>

        )}
        {userServicespkg > 0 && (
          <Row>
            <Column align="left">
              <Text className="text-black text-[14px]">
                Service Package
              </Text>
            </Column>

            <Column align="right">
              <Text className="text-black text-[14px] ">
                ${userServicespkg}
              </Text>
            </Column>
          </Row>
        )}
        {vinE > 0 && (
          <Row>
            <Column align="left">
              <Text className="text-black text-[14px]">
                Vin Etching
              </Text>
            </Column>

            <Column align="right">
              <Text className="text-black text-[14px] ">
                ${vinE}
              </Text>
            </Column>
          </Row>
        )}
        {rustProofing > 0 && (
          <Row>
            <Column align="left">
              <Text className="text-black text-[14px]">
                Under Coating
              </Text>
            </Column>

            <Column align="right">
              <Text className="text-black text-[14px] ">
                ${rustProofing}
              </Text>
            </Column>
          </Row>
        )}
        {userGap > 0 && (
          <Row>
            <Column align="left">
              <Text className="text-black text-[14px]">
                Gap Protection
              </Text>
            </Column>

            <Column align="right">
              <Text className="text-black text-[14px] ">
                ${userGap}
              </Text>
            </Column>
          </Row>
        )}
        {userLoanProt > 0 && (
          <Row>
            <Column align="left">
              <Text className="text-black text-[14px]">
                Loan Protection
              </Text>
            </Column>

            <Column align="right">
              <Text className="text-black text-[14px] ">
                ${userLoanProt}
              </Text>
            </Column>
          </Row>
        )}
        {userTireandRim > 0 && (
          <Row>
            <Column align="left">
              <Text className="text-black text-[14px]">
                Tire and Rim Protection
              </Text>
            </Column>

            <Column align="right">
              <Text className="text-black text-[14px] ">
                ${userTireandRim}
              </Text>
            </Column>
          </Row>
        )}
        {userOther > 0 && (
          <Row>
            <Column align="left">
              <Text className="text-black text-[14px]">
                Other
              </Text>
            </Column>

            <Column align="right">
              <Text className="text-black text-[14px] ">
                ${userOther}
              </Text>
            </Column>
          </Row>
        )}
      </>

    </>
  )
}

export default OptionsBreakdown

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
