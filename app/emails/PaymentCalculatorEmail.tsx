import { Html, Head, Preview, Body, Container, Row, Column, Text, Section, Hr, Tailwind, Button } from "@react-email/components";
import React, { useEffect, useState } from "react";

const PaymentCalculatorEmail = ({ finance, user, modelData, formData }) => {
  const { total, onTax, qcTax, native, otherTax, totalWithOptions, otherTaxWithOptions, on60, biweekly, weekly, months, iRate, deposit, tradeValue, perDiscountGiven, beforeDiscount, userLabour, accessories, labour, lien, msrp, financeId, userDemo, userGovern, userGasOnDel, userAirTax, userFinance, destinationCharge, userMarketAdj, userOther, userExtWarr, userServicespkg, vinE, rustProofing, userGap, userLoanProt, userTireandRim, lifeDisability, deliveryCharge, brand, paintPrem, modelCode, model, color, stockNum, trade, freight, licensing, licensingFinance, commodity, pdi, admin, biweeklNatWOptions, nat60WOptions, weeklylNatWOptions, userTireTax, nat60, userOMVIC, discount, discountPer, biweeklyqc, weeklyqc, biweeklNat, weeklylNat, biweekOth, weeklyOth, othTax, qc60, oth60, oth60WOptions, biweekOthWOptions, weeklyOthWOptions, firstName, lastName, panAmAdpRide, panAmTubelessLacedWheels, hdWarrAmount,
    clientfileId,
    activixId,
    theRealActId,
    financeManager,
    email,
    mileage,
    phone,
    name,
    address,
    city,
    postal,
    province,
    dl,
    typeOfContact,
    timeToContact,
    desiredPayments,
    year,
    model1,
    userEmail,
    tradeDesc,
    tradeColor,
    tradeYear,
    tradeMake,
    tradeVin,
    tradeTrim,
    tradeMileage,
    tradeLocation,
    trim,
    vin,
    leadNote,
    sendToFinanceNow,
    dealNumber,
    bikeStatus,
    dob,
    optionsTotal,
    lienPayout,
    referral,
    visited,
    bookedApt,
    aptShowed,
    aptNoShowed,
    testDrive,
    metService,
    metManager,
    metParts,
    sold,
    depositMade,
    refund,
    turnOver,
    financeApp,
    approved,
    signed,
    pickUpSet,
    demoed,
    delivered,
    lastContact,
    status,
    customerState,
    result,
    timesContacted,
    nextAppointment,
    followUpDay,
    deliveredDate,
    notes,
    visits,
    progress,
    metSalesperson,
    metFinance,
    financeApplication,
    pickUpDate,
    pickUpTime,
    depositTakenDate,
    docsSigned,
    tradeRepairs,
    seenTrade,
    lastNote,
    applicationDone,
    licensingSent,
    liceningDone,
    refunded,
    cancelled,
    lost,
    dLCopy,
    insCopy,
    testDrForm,
    voidChq,
    loanOther,
    signBill,
    ucda,
    tradeInsp,
    customerWS,
    otherDocs,
    urgentFinanceNote,
    funded,
    leadSource,

  } = finance;

  const priceSection = () => {
    return (
      <>
        <Hr style={hr} />
        <Text style={headingTwo}>Price</Text>
        <ul style={list}>
          <li className='flex items-center content-center justify-between' style={listItems}>
            <Text style={leftColumn}>MSRP</Text>
            <Text style={rightColumn}>${msrp}</Text>
          </li>
          {finance.freight > 0 && (
            <li className='flex items-center content-center justify-between' style={listItems}>
              <Text style={leftColumn}>Freight</Text>
              <Text style={rightColumn}>${freight}</Text>
            </li>
          )}
          {finance.pdi > 0 && (
            <li className='flex items-center content-center justify-between' style={listItems}>
              <Text style={leftColumn}>PDI</Text>
              <Text style={rightColumn}>${pdi}</Text>
            </li>
          )}
          {finance.admin > 0 && (
            <li className='flex items-center content-center justify-between' style={listItems}>
              <Text style={leftColumn}>Admin</Text>
              <Text style={rightColumn}>${admin}</Text>
            </li>
          )}
          {finance.commodity > 0 && (
            <li className='flex items-center content-center justify-between' style={listItems}>
              <Text style={leftColumn}>Commodity</Text>
              <Text style={rightColumn}>${commodity}</Text>
            </li>
          )}
          {finance.accessories > 0 && (
            <li className='flex items-center content-center justify-between' style={listItems}>
              <Text style={leftColumn}>Accessories</Text>
              <Text style={rightColumn}>${accessories}</Text>
            </li>
          )}
          {finance.labour > 0 && (
            <li className='flex items-center content-center justify-between' style={listItems}>
              <Text style={leftColumn}>Labour Hours</Text>
              <Text style={rightColumn}>${labour}</Text>
            </li>
          )}
          {finance.licensing > 0 && (
            <li style={{ display: 'flex', justifyContent: 'space-between', }}>
              <Text style={leftColumn}>Licensing</Text>
              <Text style={rightColumn}>${licensing}</Text>
            </li>
          )}

          {finance.brand === 'Sea-Doo' && modelData.trailer > 0 && (
            <li style={{ display: 'flex', justifyContent: 'space-between', }}>
              <Text style={leftColumn}>Trailer</Text>
              <Text style={rightColumn}>${modelData.trailer}</Text>
            </li>
          )}
          {finance.brand === 'Triumph' && modelData.painPrem > 0 && (
            <li style={{ display: 'flex', justifyContent: 'space-between', }}>
              <Text style={leftColumn}>Paint Premium</Text>
              <Text style={rightColumn}>${modelData.painPrem}</Text>
            </li>
          )}
        </ul>
        {
          (finance.userAirTax > 0 ||
            finance.userTireTax > 0 ||
            finance.userGovern > 0 ||
            finance.userFinance > 0 ||
            finance.destinationCharge > 0 ||
            finance.userGasOnDel > 0 ||
            finance.userMarketAdj > 0 ||
            finance.userOMVIC > 0 ||
            finance.userDemo > 0) && (
            <>
              <Hr style={hr} />
              <Text style={headingTwo}>Fees</Text>
              <ul style={list}>
                {finance.userAirTax > 0 && (
                  <li className='flex items-center content-center justify-between' style={listItems}>
                    <Text style={leftColumn}>Air Tax</Text>
                    <Text style={rightColumn}>${userAirTax}</Text>
                  </li>
                )}
                {finance.userTireTax > 0 && (
                  <li className='flex items-center content-center justify-between' style={listItems}>
                    <Text style={leftColumn}>Tire Tax</Text>
                    <Text style={rightColumn}>${userTireTax}</Text>
                  </li>
                )}
                {finance.userGovern > 0 && (
                  <li className='flex items-center content-center justify-between' style={listItems}>
                    <Text style={leftColumn}>Government Fees</Text>
                    <Text style={rightColumn}>${userGovern}</Text>
                  </li>
                )}
                {finance.userFinance && finance.userFinance > 0 && (
                  <li className='flex items-center content-center justify-between' style={listItems}>
                    <Text style={leftColumn}>Finance Fees</Text>
                    <Text style={rightColumn}>${userFinance}</Text>
                  </li>
                )}
                {finance.destinationCharge > 0 && (
                  <li className='flex items-center content-center justify-between' style={listItems}>
                    <Text style={leftColumn}>Destination Charge</Text>
                    <Text style={rightColumn}>${destinationCharge}</Text>
                  </li>
                )}
                {finance.userGasOnDel > 0 && (
                  <li className='flex items-center content-center justify-between' style={listItems}>
                    <Text style={leftColumn}>Gas On Delivery</Text>
                    <Text style={rightColumn}>${userGasOnDel}</Text>
                  </li>
                )}
                {finance.userMarketAdj > 0 && (
                  <li className='flex items-center content-center justify-between' style={listItems}>
                    <Text style={leftColumn}>Market Adjustment</Text>
                    <Text style={rightColumn}>${userMarketAdj}</Text>
                  </li>
                )}
                {finance.userDemo > 0 && (
                  <li className='flex items-center content-center justify-between' style={listItems}>
                    <Text style={leftColumn}>Demonstrate features or walkaround</Text>
                    <Text style={rightColumn}>${userDemo}</Text>
                  </li>
                )}
                {finance.userOMVIC > 0 && (
                  <li className='flex items-center content-center justify-between' style={listItems}>
                    <Text style={leftColumn}>OMVIC / Other GV Fees</Text>
                    <Text style={rightColumn}>${userOMVIC}</Text>
                  </li>
                )}
              </ul>
            </>
          )
        }
      </>
    )
  }
  const optionsSection = () => {
    return (
      <>
        {
          (userServicespkg > 0 ||
            userExtWarr > 0 ||
            vinE > 0 ||
            rustProofing > 0 ||
            userGap > 0 ||
            userLoanProt > 0 ||
            userTireandRim > 0 ||
            lifeDisability > 0) && (
            <>
              <Hr style={hr} />
              <Text style={headingTwo}>Options</Text>
              <ul style={list}>
                {userServicespkg > 0 && (
                  <li className='flex items-center content-center justify-between' style={listItems}>
                    <Text style={leftColumn}>Service Packages</Text>
                    <Text style={rightColumn}>${userServicespkg}</Text>
                  </li>
                )}
                {userExtWarr > 0 && (
                  <li className='flex items-center content-center justify-between' style={listItems}>
                    <Text style={leftColumn}>Extended Warranty</Text>
                    <Text style={rightColumn}>${userExtWarr}</Text>
                  </li>
                )}
                {vinE > 0 && (
                  <li className='flex items-center content-center justify-between' style={listItems}>
                    <Text style={leftColumn}>Vin Etching</Text>
                    <Text style={rightColumn}>${vinE}</Text>
                  </li>
                )}
                {rustProofing > 0 && (
                  <li className='flex items-center content-center justify-between' style={listItems}>
                    <Text style={leftColumn}>Under Coating</Text>
                    <Text style={rightColumn}>${rustProofing}</Text>
                  </li>
                )}
                {userGap > 0 && (
                  <li className='flex items-center content-center justify-between' style={listItems}>
                    <Text style={leftColumn}>Gap Insurance</Text>
                    <Text style={rightColumn}>${userGap}</Text>
                  </li>
                )}
                {userLoanProt > 0 && (
                  <li className='flex items-center content-center justify-between' style={listItems}>
                    <Text style={leftColumn}>Loan Protection</Text>
                    <Text style={rightColumn}>${userLoanProt}</Text>
                  </li>
                )}
                {userTireandRim > 0 && (
                  <li className='flex items-center content-center justify-between' style={listItems}>
                    <Text style={leftColumn}>Tire and Rim Prot.</Text>
                    <Text style={rightColumn}>${userTireandRim}</Text>
                  </li>
                )}
                {lifeDisability > 0 && (
                  <li className='flex items-center content-center justify-between' style={listItems}>
                    <Text style={leftColumn}>Life and Disability</Text>
                    <Text style={rightColumn}>${lifeDisability}</Text>
                  </li>
                )}
              </ul>
            </>
          )
        }
      </>
    )
  }
  const totalSection = () => {
    return (
      <>
        <Hr style={hr} />
        <Text style={headingTwo}>Total</Text>
        <ul style={list}>
          {discount && discount > 0 && (
            <li className='flex items-center content-center justify-between' style={listItems}>
              <Text style={leftColumn}> Total Before Discount</Text>
              <Text style={rightColumn}>${beforeDiscount}</Text>
            </li>
          )}
          {discount > 0 && (
            <li className='flex items-center content-center justify-between' style={listItems}>
              <Text style={leftColumn}>Discount </Text>
              <Text style={rightColumn}>${discount}</Text>
            </li>
          )}
          {discountPer > 0 && (
            <li className='flex items-center content-center justify-between' style={listItems}>
              <Text style={leftColumn}>Discount % </Text>
              <Text style={rightColumn}>{discountPer}%</Text>
            </li>
          )}
          {finance.desiredPayments === 'Standard Payment' ?
            <>
              <li className='flex items-center content-center justify-between' style={listItems}>
                <Text style={leftColumn}>Total</Text>
                <Text style={rightColumn}>${total}</Text>
              </li>
              <li className='flex items-center content-center justify-between' style={listItems}>
                <Text style={leftColumn}>  With taxes</Text>
                <Text style={rightColumn}>${onTax}</Text>
              </li>
              <li className='flex items-center content-center justify-between' style={listItems}>
                <Text style={leftColumn}>After Deposit</Text>
                <Text style={rightColumn}>${onTax - deposit}</Text>
              </li>
            </>
            : finance.desiredPayments === 'Payments with Options' ?
              <>
                <li className='flex items-center content-center justify-between' style={listItems}>
                  <Text style={leftColumn}>Total</Text>
                  <Text style={rightColumn}>${totalWithOptions}</Text>
                </li>
                <li className='flex items-center content-center justify-between' style={listItems}>
                  <Text style={leftColumn}>  With taxes</Text>
                  <Text style={rightColumn}>${qcTax}</Text>
                </li>
                <li className='flex items-center content-center justify-between' style={listItems}>
                  <Text style={leftColumn}>After Deposit</Text>
                  <Text style={rightColumn}>${qcTax - deposit}</Text>
                </li>
              </>
              : finance.desiredPayments === 'No Tax Payment' ?
                <>
                  <li className='flex items-center content-center justify-between' style={listItems}>
                    <Text style={leftColumn}>Total</Text>
                    <Text style={rightColumn}>${total}</Text>
                  </li>
                  <li className='flex items-center content-center justify-between' style={listItems}>
                    <Text style={leftColumn}>  With taxes</Text>
                    <Text style={rightColumn}>${native}</Text>
                  </li>
                  <li className='flex items-center content-center justify-between' style={listItems}>
                    <Text style={leftColumn}>After Deposit</Text>
                    <Text style={rightColumn}>${native - deposit}</Text>
                  </li>
                </>
                : finance.desiredPayments === 'No Tax Payment with Options' ?
                  <>
                    <li className='flex items-center content-center justify-between' style={listItems}>
                      <Text style={leftColumn}>Total</Text>
                      <Text style={rightColumn}>${totalWithOptions}</Text>
                    </li>
                    <li className='flex items-center content-center justify-between' style={listItems}>
                      <Text style={leftColumn}>  With taxes</Text>
                      <Text style={rightColumn}>${totalWithOptions}</Text>
                    </li>
                    <li className='flex items-center content-center justify-between' style={listItems}>
                      <Text style={leftColumn}>After Deposit</Text>
                      <Text style={rightColumn}>${totalWithOptions - deposit}</Text>
                    </li>
                  </>
                  : finance.desiredPayments === 'Custom Tax Payment' ?
                    <>
                      <li className='flex items-center content-center justify-between' style={listItems}>
                        <Text style={leftColumn}>Total</Text>
                        <Text style={rightColumn}>${total}</Text>
                      </li>
                      <li className='flex items-center content-center justify-between' style={listItems}>
                        <Text style={leftColumn}>  With taxes</Text>
                        <Text style={rightColumn}>${otherTax}</Text>
                      </li>
                      <li className='flex items-center content-center justify-between' style={listItems}>
                        <Text style={leftColumn}>After Deposit</Text>
                        <Text style={rightColumn}>${otherTax - deposit}</Text>
                      </li>
                    </>
                    : finance.desiredPayments === 'Custom Tax Payment with Options' ?
                      <>
                        <li className='flex items-center content-center justify-between' style={listItems}>
                          <Text style={leftColumn}>Total</Text>
                          <Text style={rightColumn}>${totalWithOptions}</Text>
                        </li>
                        <li className='flex items-center content-center justify-between' style={listItems}>
                          <Text style={leftColumn}>  With taxes</Text>
                          <Text style={rightColumn}>${otherTaxWithOptions}</Text>
                        </li>
                        <li className='flex items-center content-center justify-between' style={listItems}>
                          <Text style={leftColumn}>After Deposit</Text>
                          <Text style={rightColumn}>${otherTaxWithOptions - deposit}</Text>
                        </li>
                      </>
                      : ''}
        </ul>
      </>
    )
  }
  const templateBody = () => {
    const customerName = finance?.firstName + ' ' + finance?.lastName || '';
    const userPhone = user?.phone || '';
    const userEmail = user?.email || '';
    return (
      <>
        <Text style={paragraph}>
          Dear {customerName},
        </Text>
        <Text style={paragraph}>
          I hope this message finds you well. I wanted to express my appreciation for the opportunity to meet with you and discuss your upcoming purchase of the {finance.model}. It was a pleasure learning about your preferences and requirements.
        </Text>
        <Text style={paragraph}>
          As promised, I have attached the pricing details for the {finance.model} to this email. Please review the information below, and if you have any questions or need further information, do not hesitate to reach out.
        </Text>
        <Text style={paragraph}>
          I value your interest in our products, and I'm here to assist you every step of the way. If you decide to move forward with your purchase, call me right away. Otherwise I will follow up with you in a couple of days to ensure a smooth and timely process. You can reach me via email at {userEmail} or directly on my cell phone at {userPhone} for any inquiries or to secure your purchase.
        </Text>
        <Text style={paragraph}>
          Thank you for considering us for your needs. Your satisfaction is our top priority, and I look forward to assisting you further.
        </Text>
        <Text style={paragraph}>
          Your sales advisor,
        </Text>
        <Text style={paragraph}>
          {user.name}
        </Text>
      </>
    )
  }
  let totals
  let options
  let bodyString
  let price

  switch (formData.template) {
    case 'justPayments':
      bodyString = templateBody()
      totals = null
      price = null
      options = null
      break;
    case 'fullBreakdown':
      bodyString = templateBody()
      price = priceSection()
      totals = totalSection()
      options = null
      break;
    case 'FullBreakdownWOptions':
      bodyString = templateBody()
      price = priceSection()
      options = optionsSection()
      totals = totalSection()
      break;
    case 'justPaymentsCustom':
      bodyString = formData.body
      totals = null
      price = null
      options = null
      break;
    case 'fullBreakdownCustom':
      bodyString = formData.body
      price = priceSection()
      totals = totalSection()
      options = null
      break;
    case 'FullBreakdownWOptionsCustom':
      bodyString = formData.body
      price = priceSection()
      options = optionsSection()
      totals = totalSection()
      break;
    default:
      null
  }



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
              {bodyString}
            </Text>
          </Section>
        </Container>
        <Container style={{
          marginTop: '15px',
          width: '450px',
          margin: '0 auto ',
          borderRadius: "10px 10px 10px 10px",
          border: "solid 1px #e6e6e6",
        }}>

          <Row style={{ padding: '8px', borderRadius: '0 0 0 0', borderBottom: "solid 1px #e6e6e6", }}>
            <Column>
              <Text style={heading}>Payment Calculator</Text>
            </Column>
          </Row>
          <Row style={{ padding: '8px', }}>
            <Column>
              <Text style={headingTwo}>Model Details</Text>
              <ul style={list}>
                <li className='flex items-center content-center justify-between' style={listItems}>
                  <Text style={leftColumn}>Brand</Text>
                  <Text style={rightColumn}>{brand}</Text>
                </li>
                <li className='flex items-center content-center justify-between' style={listItems}>
                  <Text style={leftColumn}>Model</Text>
                  <Text style={rightColumn}>{model}</Text>
                </li>
                {finance.brand !== "BMW-Motorrad" && (
                  <li className='flex items-center content-center justify-between' style={listItems}>
                    <Text style={leftColumn}>Color</Text>
                    <Text style={rightColumn}>{color}</Text>
                  </li>
                )}
                {finance.modelCode && (
                  <>
                    <li className='flex items-center content-center justify-between' style={listItems}>
                      <Text style={leftColumn}>Model Code</Text>
                      <Text style={rightColumn}>{modelCode}</Text>
                    </li>
                    <li className='flex items-center content-center justify-between' style={listItems}>
                      <Text style={leftColumn}>Year</Text>
                      <Text style={rightColumn}>{modelData.year}</Text>
                    </li>
                  </>
                )}
                {finance.stockNum && (
                  <li className='flex items-center content-center justify-between' style={listItems}>
                    <Text style={leftColumn}>Stock Number</Text>
                    <Text style={rightColumn}>{stockNum}</Text>
                  </li>
                )}
              </ul>

              {price && (
                <Section>
                  {price}
                </Section>
              )}
              {options && (
                <Section>
                  {options}
                </Section>
              )}


              <Hr style={hr} />
              <Text style={headingTwo}>{finance.desiredPayments}</Text>
              <ul style={list}>
                {finance.desiredPayments === 'Standard Payment' ?
                  <>
                    <li className='flex items-center content-center justify-between' style={listItems}>
                      <Text style={leftColumn}>Monthly</Text>
                      <Text style={rightColumn}>${on60}</Text>
                    </li>
                    <li className='flex items-center content-center justify-between' style={listItems}>
                      <Text style={leftColumn}> Bi-weekly</Text>
                      <Text style={rightColumn}>${biweekly}</Text>
                    </li>
                    <li className='flex items-center content-center justify-between' style={listItems}>
                      <Text style={leftColumn}>Weekly</Text>
                      <Text style={rightColumn}>${weekly}</Text>
                    </li>
                  </>
                  : finance.desiredPayments === 'Payments with Options' ?
                    <>
                      <li className='flex items-center content-center justify-between' style={listItems}>
                        <Text style={leftColumn}>Monthly</Text>
                        <Text style={rightColumn}>${qc60}</Text>
                      </li>
                      <li className='flex items-center content-center justify-between' style={listItems}>
                        <Text style={leftColumn}> Bi-weekly</Text>
                        <Text style={rightColumn}>${biweeklyqc}</Text>
                      </li>
                      <li className='flex items-center content-center justify-between' style={listItems}>
                        <Text style={leftColumn}>Weekly</Text>
                        <Text style={rightColumn}>${weeklyqc}</Text>
                      </li>
                    </>
                    : finance.desiredPayments === 'No Tax Payment' ?
                      <>
                        <li className='flex items-center content-center justify-between' style={listItems}>
                          <Text style={leftColumn}>Monthly</Text>
                          <Text style={rightColumn}>${nat60}</Text>
                        </li>
                        <li className='flex items-center content-center justify-between' style={listItems}>
                          <Text style={leftColumn}> Bi-weekly</Text>
                          <Text style={rightColumn}>${biweeklNat}</Text>
                        </li>
                        <li className='flex items-center content-center justify-between' style={listItems}>
                          <Text style={leftColumn}>Weekly</Text>
                          <Text style={rightColumn}>${weeklylNat}</Text>
                        </li>
                      </>
                      : finance.desiredPayments === 'No Tax Payment with Options' ?
                        <>
                          <li className='flex items-center content-center justify-between' style={listItems}>
                            <Text style={leftColumn}>Monthly</Text>
                            <Text style={rightColumn}>${nat60WOptions}</Text>
                          </li>
                          <li className='flex items-center content-center justify-between' style={listItems}>
                            <Text style={leftColumn}> Bi-weekly</Text>
                            <Text style={rightColumn}>${biweeklNatWOptions}</Text>
                          </li>
                          <li className='flex items-center content-center justify-between' style={listItems}>
                            <Text style={leftColumn}>Weekly</Text>
                            <Text style={rightColumn}>${weeklylNatWOptions}</Text>
                          </li>
                        </>
                        : finance.desiredPayments === 'Custom Tax Payment' ?
                          <>
                            <li className='flex items-center content-center justify-between' style={listItems}>
                              <Text style={leftColumn}>Tax %</Text>
                              <Text style={rightColumn}>{othTax}%</Text>
                            </li>
                            <li className='flex items-center content-center justify-between' style={listItems}>
                              <Text style={leftColumn}>Monthly</Text>
                              <Text style={rightColumn}>${oth60}</Text>
                            </li>
                            <li className='flex items-center content-center justify-between' style={listItems}>
                              <Text style={leftColumn}> Bi-weekly</Text>
                              <Text style={rightColumn}>${biweekOth}</Text>
                            </li>
                            <li className='flex items-center content-center justify-between' style={listItems}>
                              <Text style={leftColumn}>Weekly</Text>
                              <Text style={rightColumn}>${weeklyOth}</Text>
                            </li>
                          </>
                          : finance.desiredPayments === 'Custom Tax Payment with Options' ?
                            <>
                              <li className='flex items-center content-center justify-between' style={listItems}>
                                <Text style={leftColumn}>Tax %</Text>
                                <Text style={rightColumn}>{othTax}%</Text>
                              </li>
                              <li className='flex items-center content-center justify-between' style={listItems}>
                                <Text style={leftColumn}>Monthly</Text>
                                <Text style={rightColumn}>${oth60WOptions}</Text>
                              </li>
                              <li className='flex items-center content-center justify-between' style={listItems}>
                                <Text style={leftColumn}> Bi-weekly</Text>
                                <Text style={rightColumn}>${biweekOthWOptions}</Text>
                              </li>
                              <li className='flex items-center content-center justify-between' style={listItems}>
                                <Text style={leftColumn}>Weekly</Text>
                                <Text style={rightColumn}>${weeklyOthWOptions}</Text>
                              </li>
                            </>
                            : ''}
              </ul>

              <Hr style={hr} />
              <Text style={headingTwo}>Contract Variables</Text>
              <ul style={list}>
                <li className='flex items-center ' style={listItems}>
                  <Text
                    style={leftColumn}
                  >
                    Term</Text>
                  <Text
                    style={rightColumn}
                  >
                    {months} / Months</Text>
                </li>
                <li className='flex items-center content-center justify-between' style={listItems}>
                  <Text style={leftColumn}>Rate</Text>
                  <Text style={rightColumn}>{iRate}%</Text>
                </li>
                <li className='flex items-center content-center justify-between' style={listItems}>
                  <Text style={leftColumn}>Deposit</Text>
                  <Text style={rightColumn}>${deposit}</Text>
                </li>
                {finance.tradeValue > 0 && (
                  <li className='flex items-center content-center justify-between' style={listItems}>
                    <Text style={leftColumn}>Trade Value</Text>
                    <Text style={rightColumn}>${tradeValue}</Text>
                  </li>
                )}
                {finance.lien > 0 && (
                  <li className='flex items-center content-center justify-between' style={listItems}>
                    <Text style={leftColumn}>Lien</Text>
                    <Text style={rightColumn}>${lien}</Text>
                  </li>
                )}

                {finance.tradeDesc && finance.tradeDesc.length > 0 && (
                  <Text style={headingTwo}>Trade Information</Text>
                )}
                {finance.tradeYear && finance.tradeYear.length > 0 && (
                  <li className='flex items-center content-center justify-between' style={listItems}>
                    <Text style={leftColumn}>Trade Year</Text>
                    <Text style={rightColumn}>{finance.tradeYear}</Text>
                  </li>
                )}
                {finance.tradeMake && finance.tradeMake.length > 0 && (
                  <li className='flex items-center content-center justify-between' style={listItems}>
                    <Text style={leftColumn}>Trade Brand</Text>
                    <Text style={rightColumn}>{finance.tradeMake}</Text>
                  </li>
                )}
                {finance.tradeDesc && finance.tradeDesc.length > 0 && (
                  <li className='flex items-center ' style={listItems}>
                    <Text style={leftColumn}>Trade Model</Text>
                    <Text style={rightColumn}>{finance.tradeDesc}</Text>
                  </li>
                )}
                {finance.tradeColor && finance.tradeColor.length > 0 && (
                  <li className='flex items-center content-center justify-between' style={listItems}>
                    <Text style={leftColumn}>Trade Color</Text>
                    <Text style={rightColumn}>{finance.tradeColor}</Text>
                  </li>
                )}
                {finance.tradeMileage && finance.tradeMileage.length > 0 && (
                  <li className='flex items-center content-center justify-between' style={listItems}>
                    <Text style={leftColumn}>Trade Mileage</Text>
                    <Text style={rightColumn}>{finance.tradeMileage}</Text>
                  </li>
                )}
              </ul>

              {totals && (
                <Section>
                  {totals}
                </Section>
              )}

              <Hr style={hr} />
              <Text style={headingTwo}>Claim This Model Now</Text>
              <ul style={list}>
                <li className='flex items-center content-center justify-between' style={listItems}>
                  <Container style={leftColumn}>
                    <Button
                      href={`http://localhost:3000/startYourFinanceApplication?financeId=${finance.id}`}

                      style={{
                        width: 'auto',
                        borderRadius: "6px",
                        backgroundColor: "#1c69d4",
                        padding: "10px",
                        color: '#fff',
                        fontSize: '12px',
                        height: '32',
                        paddingLeft: '16px',
                        paddingRight: '16px',
                        textAlign: 'center',
                        textDecoration: 'none'
                      }}
                      className=" px-4 text-white font-semibold no-underline text-center py-3 my-auto"
                    >
                      <p className='my-auto text-xs '>Finance Application</p>
                    </Button>
                  </Container>
                  <Container style={rightColumn}>
                    <Button
                      href={`http://localhost:3000/claimNowWithDeposit?financeId=${finance.id}`}
                      style={{
                        width: 'auto',
                        borderRadius: "6px",
                        backgroundColor: "#ff0000",
                        padding: "10px",
                        color: '#fff',
                        fontSize: '12px',
                        height: '32',
                        paddingLeft: '16px',
                        paddingRight: '16px',
                        textAlign: 'center',
                        textDecoration: 'none'
                      }}
                      className=" px-4 text-white font-semibold no-underline text-center py-3 my-auto"
                    >
                      <p className='my-auto text-center'> Submit Deposit</p>
                    </Button>
                  </Container>
                </li>
              </ul>
            </Column>
          </Row>
        </Container>
        <Section style={{
          textAlign: "center",
          justifyContent: "center",
          width: '550px',
        }}>
          <Column>
            <Text
              style={{
                textAlign: "center",
                justifyContent: "center",
                fontSize: "11px",
                color: "#6a737d",
              }}>
              The Build & Price experience is an ongoing development and is intended for informational purposes only. It does not constitute an offer to buy or sell our vehicles. Individual rates will vary as they depend on multiple factors. We work with various financial institutions to find the best match for your credit profile. Different banks have distinct approaches to investments and existing customer loans. Our goal is to establish a long-term relationship and assist you with future upgrades. Therefore, we strive to secure the best possible rate for you.
            </Text>
          </Column>
        </Section>
      </Body>
    </Html >
  );
};

export default PaymentCalculatorEmail
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
