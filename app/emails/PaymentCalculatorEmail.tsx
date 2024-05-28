import { Html, Head, Preview, Body, Container, Row, Column, Text, Button, Section } from "@react-email/components";

const PaymentCalculatorEmail = ({
  finance,
  formData,
  modelData,
  deFees,
  mainButton,
  subButton,
  body
}) => {
  const { total, onTax, qcTax, native, otherTax, totalWithOptions, otherTaxWithOptions, on60, biweekly, weekly, months, iRate, deposit, tradeValue, perDiscountGiven, beforeDiscount, userLabour, accessories, labour, lien, msrp, financeId, userDemo, userGovern, userGasOnDel, userAirTax, userFinance, destinationCharge, userMarketAdj, userOther, userExtWarr, userServicespkg, vinE, rustProofing, userGap, userLoanProt, userTireandRim, lifeDisability, deliveryCharge, brand, paintPrem, modelCode, model, color, stockNum, trade, freight, licensing, licensingFinance, commodity, pdi, admin, biweeklNatWOptions, nat60WOptions, weeklylNatWOptions, userTireTax, nat60, userOMVIC, discount, discountPer, biweeklyqc, weeklyqc, biweeklNat, weeklylNat, biweekOth, weeklyOth, othTax, qc60, oth60, oth60WOptions, biweekOthWOptions, weeklyOthWOptions, firstName, lastName, panAmAdpRide, panAmTubelessLacedWheels, hdWarrAmount, } = formData;
  const { userLicensing, userTax, userPDI, userCommodity, userFreight, userAdmin, } = deFees

  return (
    <Html>
      <Head />
      <Preview>Payment Breakdown</Preview>
      <Body style={{ backgroundColor: '#09090b', color: '#fafafa', fontFamily: 'Arial, sans-serif' }}>
        <Container style={container}>
          <Section style={content}>
            <Text style={paragraph}>Hi {finance.firstName},</Text>
            <Text style={paragraph}>
              {body}
            </Text>
          </Section>
        </Container>
        <Container style={{ width: '450px', margin: '0 auto ', backgroundColor: '#27272a', borderRadius: '0' }}>
          <Row style={{ backgroundColor: '#18181a', padding: '0px', borderRadius: '0 0 0 0' }}>
            <Column>
              <Text style={{ marginLeft: '10px', fontSize: '14px', color: '#fafafa' }}>Payment Calculator</Text>
            </Column>
          </Row>
          <Row style={{ padding: '8px', backgroundColor: '#09090b' }}>
            <Column>
              <Text style={{ fontWeight: 'bold' }}>Payment Details</Text>
              <ul style={list}>
                <li style={listItems}>
                  <Text style={{ color: '#8a8a93' }}>Brand</Text>
                  <Text>{brand}</Text>
                </li>
                <li style={listItems}>
                  <Text style={{ color: '#8a8a93' }}>Model</Text>
                  <Text>{model}</Text>
                </li>
                {finance.brand !== "BMW-Motorrad" && (
                  <li style={listItems}>
                    <Text style={{ color: '#8a8a93' }}>Color</Text>
                    <Text>{color}</Text>
                  </li>
                )}
                {finance.modelCode && (
                  <>
                    <li style={listItems}>
                      <Text style={{ color: '#8a8a93' }}>Model Code</Text>
                      <Text>{modelCode}</Text>
                    </li>
                    <li style={listItems}>
                      <Text style={{ color: '#8a8a93' }}>Year</Text>
                      <Text>{modelData.year}</Text>
                    </li>
                  </>
                )}
                {finance.stockNum && (
                  <li style={listItems}>
                    <Text style={{ color: '#8a8a93' }}>Stock Number</Text>
                    <Text>{stockNum}</Text>
                  </li>
                )}
              </ul>
              <hr style={{ borderColor: '#27272a', width: '95%', margin: '8px auto' }} />
              <Text style={{ fontWeight: 'bold' }}>Price</Text>
              <ul style={list}>
                <li style={listItems}>
                  <Text style={{ color: '#8a8a93' }}>MSRP</Text>
                  <Text>${msrp}</Text>
                </li>
                {formData.freight > 0 && (
                  <li style={listItems}>
                    <Text style={{ color: '#8a8a93' }}>Freight</Text>
                    <Text>${freight}</Text>
                  </li>
                )}
                {formData.pdi > 0 && (
                  <li style={listItems}>
                    <Text style={{ color: '#8a8a93' }}>PDI</Text>
                    <Text>${pdi}</Text>
                  </li>
                )}
                {formData.admin > 0 && (
                  <li style={listItems}>
                    <Text style={{ color: '#8a8a93' }}>Admin</Text>
                    <Text>${admin}</Text>
                  </li>
                )}
                {formData.commodity > 0 && (
                  <li style={listItems}>
                    <Text style={{ color: '#8a8a93' }}>Commodity</Text>
                    <Text>${commodity}</Text>
                  </li>
                )}
                <li style={listItems}>
                  <Text style={{ color: '#8a8a93' }}>Accessories</Text>
                  <Text>${accessories}</Text>
                </li>
                <li style={listItems}>
                  <Text style={{ color: '#8a8a93' }}>Labour Hours</Text>
                  <Text>${labour}</Text>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                  <Text style={{ color: '#8a8a93' }}>Licensing</Text>
                  <Text>${licensing}</Text>
                </li>
                {finance.brand === 'Sea-Doo' && modelData.trailer > 0 && (
                  <li style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                    <Text style={{ color: '#8a8a93' }}>Trailer</Text>
                    <Text>${modelData.trailer}</Text>
                  </li>
                )}
                {finance.brand === 'Triumph' && modelData.painPrem > 0 && (
                  <li style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                    <Text style={{ color: '#8a8a93' }}>Paint Premium</Text>
                    <Text>${modelData.painPrem}</Text>
                  </li>
                )}
              </ul>
              <hr style={{ borderColor: '#27272a', width: '95%', margin: '16px auto' }} />
              <Text style={{ fontWeight: 'bold' }}>Fees</Text>
              <ul style={list}>
                {deFees.userAirTax > 0 && (
                  <li style={listItems}>
                    <Text style={{ color: '#8a8a93' }}>Air Tax</Text>
                    <Text>${userAirTax}</Text>
                  </li>
                )}
                {deFees.userTireTax > 0 && (
                  <li style={listItems}>
                    <Text style={{ color: '#8a8a93' }}>Tire Tax</Text>
                    <Text>${userTireTax}</Text>
                  </li>
                )}
                {deFees.userGovern > 0 && (
                  <li style={listItems}>
                    <Text style={{ color: '#8a8a93' }}>Government Fees</Text>
                    <Text>${userGovern}</Text>
                  </li>
                )}
                {deFees.userFinance > 0 && (
                  <li style={listItems}>
                    <Text style={{ color: '#8a8a93' }}>Finance Fees</Text>
                    <Text>${userFinance}</Text>
                  </li>
                )}
                {deFees.destinationCharge > 0 && (
                  <li style={listItems}>
                    <Text style={{ color: '#8a8a93' }}>Destination Charge</Text>
                    <Text>${destinationCharge}</Text>
                  </li>
                )}
                {deFees.userGasOnDel > 0 && (
                  <li style={listItems}>
                    <Text style={{ color: '#8a8a93' }}>Gas On Delivery</Text>
                    <Text>${userGasOnDel}</Text>
                  </li>
                )}
                {deFees.userMarketAdj > 0 && (
                  <li style={listItems}>
                    <Text style={{ color: '#8a8a93' }}>Market Adjustment</Text>
                    <Text>${userMarketAdj}</Text>
                  </li>
                )}
                {deFees.userDemo > 0 && (
                  <li style={listItems}>
                    <Text style={{ color: '#8a8a93' }}>Demonstrate features or walkaround</Text>
                    <Text>${userDemo}</Text>
                  </li>
                )}
                {deFees.userOMVIC > 0 && (
                  <li style={listItems}>
                    <Text style={{ color: '#8a8a93' }}>OMVIC / Other GV Fees</Text>
                    <Text>${userOMVIC}</Text>
                  </li>
                )}
              </ul>

              <hr style={{ borderColor: '#27272a', width: '95%', margin: '16px auto' }} />
              <Text style={{ fontWeight: 'bold' }}>Options</Text>
              <ul style={list}>
                {userServicespkg > 0 && (
                  <li style={listItems}>
                    <Text style={{ color: '#8a8a93' }}>Service Packages</Text>
                    <Text>${userServicespkg}</Text>
                  </li>
                )}
                {userExtWarr > 0 && (
                  <li style={listItems}>
                    <Text style={{ color: '#8a8a93' }}>Extended Warranty</Text>
                    <Text>${userExtWarr}</Text>
                  </li>
                )}
                {vinE > 0 && (
                  <li style={listItems}>
                    <Text style={{ color: '#8a8a93' }}>Vin Etching</Text>
                    <Text>${vinE}</Text>
                  </li>
                )}
                {rustProofing > 0 && (
                  <li style={listItems}>
                    <Text style={{ color: '#8a8a93' }}>Under Coating</Text>
                    <Text>${rustProofing}</Text>
                  </li>
                )}
                {userGap > 0 && (
                  <li style={listItems}>
                    <Text style={{ color: '#8a8a93' }}>Gap Insurance</Text>
                    <Text>${userGap}</Text>
                  </li>
                )}
                {userLoanProt > 0 && (
                  <li style={listItems}>
                    <Text style={{ color: '#8a8a93' }}>Loan Protection</Text>
                    <Text>${userLoanProt}</Text>
                  </li>
                )}
                {userTireandRim > 0 && (
                  <li style={listItems}>
                    <Text style={{ color: '#8a8a93' }}>Tire and Rim Prot.</Text>
                    <Text>${userTireandRim}</Text>
                  </li>
                )}
                {lifeDisability > 0 && (
                  <li style={listItems}>
                    <Text style={{ color: '#8a8a93' }}>Life and Disability</Text>
                    <Text>${lifeDisability}</Text>
                  </li>
                )}


              </ul>
              <hr style={{ borderColor: '#27272a', width: '95%', margin: '16px auto' }} />
              <Text style={{ fontWeight: 'bold' }}>Standard Terms - {finance.desiredPayments}</Text>
              <ul style={list}>

                {finance.desiredPayments === 'Standard Payment' ?
                  <>
                    <li style={listItems}>
                      <Text style={{ color: '#8a8a93' }}>Monthly</Text>
                      <Text>${on60}</Text>
                    </li>
                    <li style={listItems}>
                      <Text style={{ color: '#8a8a93' }}> Bi-weekly</Text>
                      <Text>${biweekly}</Text>
                    </li>
                    <li style={listItems}>
                      <Text style={{ color: '#8a8a93' }}>Weekly</Text>
                      <Text>${weekly}</Text>
                    </li>
                  </>
                  : finance.desiredPayments === 'Payments with Options' ?
                    <>
                      <li style={listItems}>
                        <Text style={{ color: '#8a8a93' }}>Monthly</Text>
                        <Text>${qc60}</Text>
                      </li>
                      <li style={listItems}>
                        <Text style={{ color: '#8a8a93' }}> Bi-weekly</Text>
                        <Text>${biweeklyqc}</Text>
                      </li>
                      <li style={listItems}>
                        <Text style={{ color: '#8a8a93' }}>Weekly</Text>
                        <Text>${weeklyqc}</Text>
                      </li>
                    </>
                    : finance.desiredPayments === 'No Tax Payment' ?
                      <>
                        <li style={listItems}>
                          <Text style={{ color: '#8a8a93' }}>Monthly</Text>
                          <Text>${nat60}</Text>
                        </li>
                        <li style={listItems}>
                          <Text style={{ color: '#8a8a93' }}> Bi-weekly</Text>
                          <Text>${biweeklNat}</Text>
                        </li>
                        <li style={listItems}>
                          <Text style={{ color: '#8a8a93' }}>Weekly</Text>
                          <Text>${weeklylNat}</Text>
                        </li>
                      </>
                      : finance.desiredPayments === 'No Tax Payment with Options' ?
                        <>
                          <li style={listItems}>
                            <Text style={{ color: '#8a8a93' }}>Monthly</Text>
                            <Text>${nat60WOptions}</Text>
                          </li>
                          <li style={listItems}>
                            <Text style={{ color: '#8a8a93' }}> Bi-weekly</Text>
                            <Text>${biweeklNatWOptions}</Text>
                          </li>
                          <li style={listItems}>
                            <Text style={{ color: '#8a8a93' }}>Weekly</Text>
                            <Text>${weeklylNatWOptions}</Text>
                          </li>
                        </>
                        : finance.desiredPayments === 'Custom Tax Payment' ?
                          <>
                            <li style={listItems}>
                              <Text style={{ color: '#8a8a93' }}>Tax %</Text>
                              <Text>{othTax}%</Text>
                            </li>
                            <li style={listItems}>
                              <Text style={{ color: '#8a8a93' }}>Monthly</Text>
                              <Text>${oth60}</Text>
                            </li>
                            <li style={listItems}>
                              <Text style={{ color: '#8a8a93' }}> Bi-weekly</Text>
                              <Text>${biweekOth}</Text>
                            </li>
                            <li style={listItems}>
                              <Text style={{ color: '#8a8a93' }}>Weekly</Text>
                              <Text>${weeklyOth}</Text>
                            </li>
                          </>
                          : finance.desiredPayments === 'Custom Tax Payment with Options' ?
                            <>
                              <li style={listItems}>
                                <Text style={{ color: '#8a8a93' }}>Tax %</Text>
                                <Text>{othTax}%</Text>
                              </li>
                              <li style={listItems}>
                                <Text style={{ color: '#8a8a93' }}>Monthly</Text>
                                <Text>${oth60WOptions}</Text>
                              </li>
                              <li style={listItems}>
                                <Text style={{ color: '#8a8a93' }}> Bi-weekly</Text>
                                <Text>${biweekOthWOptions}</Text>
                              </li>
                              <li style={listItems}>
                                <Text style={{ color: '#8a8a93' }}>Weekly</Text>
                                <Text>${weeklyOthWOptions}</Text>
                              </li>
                            </>
                            : ''}
              </ul>
              <hr style={{ borderColor: '#27272a', width: '95%', margin: '16px auto' }} />
              <Text style={{ fontWeight: 'bold' }}>Contract Variables</Text>
              <ul style={list}>
                <li style={listItems}>
                  <Text style={{ color: '#8a8a93' }}>Term</Text>
                  <Text>{months}</Text>
                </li>
                <li style={listItems}>
                  <Text style={{ color: '#8a8a93' }}>Rate</Text>
                  <Text>{iRate}%</Text>
                </li>
                <li style={listItems}>
                  <Text style={{ color: '#8a8a93' }}>Trade Value</Text>
                  <Text>${tradeValue}</Text>
                </li>
                <li style={listItems}>
                  <Text style={{ color: '#8a8a93' }}>Lien</Text>
                  <Text>${lien}</Text>
                </li>
              </ul>

              <hr style={{ borderColor: '#27272a', width: '95%', margin: '16px auto' }} />
              <Text style={{ fontWeight: 'bold' }}>Total</Text>
              <ul style={list}>
                {discount > 0 && (
                  <li style={listItems}>
                    <Text style={{ color: '#8a8a93' }}> Total Before Discount</Text>
                    <Text>${beforeDiscount}</Text>
                  </li>
                )}
                {discount > 0 && (
                  <li style={listItems}>
                    <Text style={{ color: '#8a8a93' }}>Discount </Text>
                    <Text>${discount}</Text>
                  </li>
                )}
                {discountPer > 0 && (
                  <li style={listItems}>
                    <Text style={{ color: '#8a8a93' }}>Discount % </Text>
                    <Text>{discountPer}%</Text>
                  </li>
                )}
                {finance.desiredPayments === 'Standard Payment' ?
                  <>
                    <li style={listItems}>
                      <Text style={{ color: '#8a8a93' }}>Total</Text>
                      <Text>${total}</Text>
                    </li>
                    <li style={listItems}>
                      <Text style={{ color: '#8a8a93' }}>  With taxes</Text>
                      <Text>${onTax}</Text>
                    </li>
                    <li style={listItems}>
                      <Text style={{ color: '#8a8a93' }}>After Deposit</Text>
                      <Text>${onTax - deposit}</Text>
                    </li>
                  </>
                  : finance.desiredPayments === 'Payments with Options' ?
                    <>
                      <li style={listItems}>
                        <Text style={{ color: '#8a8a93' }}>Total</Text>
                        <Text>${totalWithOptions}</Text>
                      </li>
                      <li style={listItems}>
                        <Text style={{ color: '#8a8a93' }}>  With taxes</Text>
                        <Text>${qcTax}</Text>
                      </li>
                      <li style={listItems}>
                        <Text style={{ color: '#8a8a93' }}>After Deposit</Text>
                        <Text>${qcTax - deposit}</Text>
                      </li>
                    </>
                    : finance.desiredPayments === 'No Tax Payment' ?
                      <>
                        <li style={listItems}>
                          <Text style={{ color: '#8a8a93' }}>Total</Text>
                          <Text>${total}</Text>
                        </li>
                        <li style={listItems}>
                          <Text style={{ color: '#8a8a93' }}>  With taxes</Text>
                          <Text>${native}</Text>
                        </li>
                        <li style={listItems}>
                          <Text style={{ color: '#8a8a93' }}>After Deposit</Text>
                          <Text>${native - deposit}</Text>
                        </li>
                      </>
                      : finance.desiredPayments === 'No Tax Payment with Options' ?
                        <>
                          <li style={listItems}>
                            <Text style={{ color: '#8a8a93' }}>Total</Text>
                            <Text>${totalWithOptions}</Text>
                          </li>
                          <li style={listItems}>
                            <Text style={{ color: '#8a8a93' }}>  With taxes</Text>
                            <Text>${totalWithOptions}</Text>
                          </li>
                          <li style={listItems}>
                            <Text style={{ color: '#8a8a93' }}>After Deposit</Text>
                            <Text>${totalWithOptions - deposit}</Text>
                          </li>
                        </>
                        : finance.desiredPayments === 'Custom Tax Payment' ?
                          <>
                            <li style={listItems}>
                              <Text style={{ color: '#8a8a93' }}>Total</Text>
                              <Text>${total}</Text>
                            </li>
                            <li style={listItems}>
                              <Text style={{ color: '#8a8a93' }}>  With taxes</Text>
                              <Text>${otherTax}</Text>
                            </li>
                            <li style={listItems}>
                              <Text style={{ color: '#8a8a93' }}>After Deposit</Text>
                              <Text>${otherTax - deposit}</Text>
                            </li>
                          </>
                          : finance.desiredPayments === 'Custom Tax Payment with Options' ?
                            <>
                              <li style={listItems}>
                                <Text style={{ color: '#8a8a93' }}>Total</Text>
                                <Text>${totalWithOptions}</Text>
                              </li>
                              <li style={listItems}>
                                <Text style={{ color: '#8a8a93' }}>  With taxes</Text>
                                <Text>${otherTaxWithOptions}</Text>
                              </li>
                              <li style={listItems}>
                                <Text style={{ color: '#8a8a93' }}>After Deposit</Text>
                                <Text>${otherTaxWithOptions - deposit}</Text>
                              </li>
                            </>
                            : ''}
              </ul>
            </Column>
          </Row>
        </Container>
      </Body>
    </Html >
  );
};

export default PaymentCalculatorEmail;

const paragraph = {
  lineHeight: 1.5,
  fontSize: 14,
  color: "#18181a",
};
const list = {
  lineHeight: '3px',
  fontSize: 12,
  listStyleType: 'none',
  padding: 0,
  margin: '16px 0'
}
const listItems = {
  display: 'flex',
  justifyContent: 'space-between',
  lineHeight: '-5',
  fontSize: 12,
  //listStyleType: 'none', padding: 0,
  margin: '-5 0',
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
