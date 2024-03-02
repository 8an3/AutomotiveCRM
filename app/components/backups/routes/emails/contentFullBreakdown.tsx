import {
    Body, Container, Head, Row, Column, Heading, Hr, Html, Preview, Tailwind, Text, Section,
} from "@react-email/components";

const FullBreakdownContent = ({ brand, model2, modelCode, stockNum, year, pdi, msrp, admin, commodity, accessories, labour, licensing, userTireTax, userGovern, userFinance, model, destinationCharge, userMarketAdj, userGasOnDel, userDemo, userAirTax, painPrem, tradeValue,
    }) => {

    return (
        <>

            <Text className="text-black text-2xl font-thin leading-[24px]">
                Model
            </Text>
            <Hr style={hr} />
            <Row>
                <Column align="left">
                    <Text className="text-black text-[14px]">
                        Brand
                    </Text>
                </Column>

                <Column align="right">
                    <Text className="text-black text-[14px] ">
                        {brand}
                    </Text>
                </Column>
            </Row>
            <Row>
                <Column align="left">
                    <Text className="text-black text-[14px]">
                        Model
                    </Text>
                </Column>

                <Column align="right">
                    <Text className="text-black text-[14px] ">
                        {model2}
                    </Text>
                </Column>
            </Row>
            {modelCode && (
                <Row>
                    <Column align="left">
                        <Text className="text-black text-[14px]">
                            Model Code
                        </Text>
                    </Column>

                    <Column align="right">
                        <Text className="text-black text-[14px] ">
                            {modelCode}
                        </Text>
                    </Column>
                </Row>
            )}
            {stockNum && (
                <Row>
                    <Column align="left">
                        <Text className="text-black text-[14px]">
                            Year
                        </Text>
                    </Column>

                    <Column align="right">
                        <Text className="text-black text-[14px] ">
                            {year}
                        </Text>
                    </Column>
                </Row>
            )}
            {stockNum && (
                <Row>
                    <Column align="left">
                        <Text className="text-black text-[14px]">
                            Stock Number
                        </Text>
                    </Column>

                    <Column align="right">
                        <Text className="text-black text-[14px] ">
                            {stockNum}
                        </Text>
                    </Column>
                </Row>
            )}
            <Text className="text-black text-2xl font-thin leading-[24px]">
                Price
            </Text>
            <Hr style={hr} />
            <Row>
                <Column align="left">
                    <Text className="text-black text-[14px]">
                        MSRP
                    </Text>
                </Column>

                <Column align="right">
                    <Text className="text-black text-[14px] ">
                        ${msrp}
                    </Text>
                </Column>
            </Row>

            {pdi > 0 && (
                <Row>
                    <Column align="left">
                        <Text className="text-black text-[14px]">
                            PDI
                        </Text>
                    </Column>

                    <Column align="right">
                        <Text className="text-black text-[14px] ">
                            ${pdi}
                        </Text>
                    </Column>
                </Row>
            )}
            {admin > 0 && (
                <Row>
                    <Column align="left">
                        <Text className="text-black text-[14px]">
                            Admin
                        </Text>
                    </Column>

                    <Column align="right">
                        <Text className="text-black text-[14px] ">
                            ${admin}
                        </Text>
                    </Column>
                </Row>
            )}
            {commodity > 0 && (
                <Row>
                    <Column align="left">
                        <Text className="text-black text-[14px]">
                            Commodity
                        </Text>
                    </Column>

                    <Column align="right">
                        <Text className="text-black text-[14px] ">
                            ${commodity}
                        </Text>
                    </Column>
                </Row>
            )}
            {accessories > 0 && (
                <Row>
                    <Column align="left">
                        <Text className="text-black text-[14px]">
                            Accessories
                        </Text>
                    </Column>

                    <Column align="right">
                        <Text className="text-black text-[14px] ">
                            ${accessories}
                        </Text>
                    </Column>
                </Row>
            )}
            {labour > 0 && (
                <Row>
                    <Column align="left">
                        <Text className="text-black text-[14px]">
                            Labour Hours
                        </Text>
                    </Column>

                    <Column align="right">
                        <Text className="text-black text-[14px] ">
                            ${labour}
                        </Text>
                    </Column>
                </Row>
            )}
            {licensing > 0 && (
                <Row>
                    <Column align="left">
                        <Text className="text-black text-[14px]">
                            Licensing
                        </Text>
                    </Column>

                    <Column align="right">
                        <Text className="text-black text-[14px] ">
                            ${licensing}
                        </Text>
                    </Column>
                </Row>
            )}



            {userTireTax > 0 && (
                <Row>
                    <Column align="left">
                        <Text className="text-black text-[14px]">
                            Tire Tax
                        </Text>
                    </Column>

                    <Column align="right">
                        <Text className="text-black text-[14px] ">
                            ${userTireTax}
                        </Text>
                    </Column>
                </Row>
            )}
            {userGovern > 0 && (
                <Row>
                    <Column align="left">
                        <Text className="text-black text-[14px]">
                            Government Fees
                        </Text>
                    </Column>

                    <Column align="right">
                        <Text className="text-black text-[14px] ">
                            ${userGovern}
                        </Text>
                    </Column>
                </Row>
            )}
            {userFinance > 0 && (
                <Row>
                    <Column align="left">
                        <Text className="text-black text-[14px]">
                            Finance Fees
                        </Text>
                    </Column>

                    <Column align="right">
                        <Text className="text-black text-[14px] ">
                            ${userFinance}
                        </Text>
                    </Column>
                </Row>

            )}
            {destinationCharge > 0 && (
                <Row>
                    <Column align="left">
                        <Text className="text-black text-[14px]">
                            Destination Charge
                        </Text>
                    </Column>

                    <Column align="right">
                        <Text className="text-black text-[14px] ">
                            ${destinationCharge}
                        </Text>
                    </Column>
                </Row>
            )}
            {userGasOnDel > 0 && (
                <Row>
                    <Column align="left">
                        <Text className="text-black text-[14px]">
                            Gas On Delivery
                        </Text>
                    </Column>

                    <Column align="right">
                        <Text className="text-black text-[14px] ">
                            ${userGasOnDel}
                        </Text>
                    </Column>
                </Row>
            )}
            {userMarketAdj > 0 && (
                <Row>
                    <Column align="left">
                        <Text className="text-black text-[14px]">
                            Market Adjustment
                        </Text>
                    </Column>

                    <Column align="right">
                        <Text className="text-black text-[14px] ">
                            ${userMarketAdj}
                        </Text>
                    </Column>
                </Row>
            )}
            {userDemo > 0 && (
                <Row>
                    <Column align="left">
                        <Text className="text-black text-[14px]">
                            Demonstrate features or walkaround
                        </Text>
                    </Column>

                    <Column align="right">
                        <Text className="text-black text-[14px] ">
                            ${userDemo}
                        </Text>
                    </Column>
                </Row>
            )}
            {userAirTax > 0 && (
                <Row>
                    <Column align="left">
                        <Text className="text-black text-[14px]">
                            Air Tax
                        </Text>
                    </Column>

                    <Column align="right">
                        <Text className="text-black text-[14px] ">
                            ${userAirTax}
                        </Text>
                    </Column>
                </Row>
            )}
            {painPrem > 0 && (
                <Row>
                    <Column align="left">
                        <Text className="text-black text-[14px]">
                            Paint Premium
                        </Text>
                    </Column>

                    <Column align="right">
                        <Text className="text-black text-[14px] ">
                            ${painPrem}
                        </Text>
                    </Column>
                </Row>
            )}
            {tradeValue > 0 && (
                <Row>
                    <Column align="left">
                        <Text className="text-black text-[14px]">
                            Trade Value
                        </Text>
                    </Column>

                    <Column align="right">
                        <Text className="text-black text-[14px] ">
                            ${tradeValue}
                        </Text>
                    </Column>
                </Row>
            )}




        </>
    )
}

export default FullBreakdownContent

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
