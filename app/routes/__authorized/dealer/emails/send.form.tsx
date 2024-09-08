import {
  json,
  ActionFunction,
  LoaderFunction,
  redirect,
  JsonFunction,
} from "@remix-run/node";

import { model } from "~/models";
import financeFormSchema from "~/overviewUtils/financeFormSchema";
//import { authenticator } from "~/services";
import {
  findDashboardDataById,
  findQuoteById,
  getDataBmwMoto,
  getDataByModel,
  getDataByModelManitou,
  getDataHarley,
  getDataKawasaki,
  getDataTriumph,
  getLatestBMWOptions,
  getLatestBMWOptions2,
  getLatestOptionsManitou,
  getRecords,
} from "~/utils/finance/get.server";
import { getDealerFeesbyEmail } from "~/utils/user.server";
import { getAllFinanceNotes } from "~/utils/financeNote/get.server";
import { getSingleFinanceAppts } from "~/utils/financeAppts/get.server";
import { updateDashData, updateDashboard } from "~/utils/dashboard/update.server";
import { deleteFinanceNote } from "~/utils/financeNote/delete.server";
import UpdateStatus from "~/components/dashboard/calls/actions/UpdateStatus";

import DeleteCustomer from "~/components/dashboard/calls/actions/DeleteCustomer";
import EmailClient from "~/components/dashboard/calls/emailClient";
import CallLongFU from "~/components/dashboard/calls/actions/CallLongFU";
import TextQuickFU from "~/components/dashboard/calls/actions/textQuickFU";
import { getTemplatesByEmail, templateServer } from "~/utils/emailTemplates/template.server";
import { updateFinanceNote } from "~/utils/client/updateFinanceNote.server";
import { prisma } from "~/libs";
import { getLastAppointmentForFinance } from "~/utils/client/getLastApt.server";

import { CreateCommunications } from "~/utils/communications/communications.server";
import { CompleteLastAppt } from '~/components/actions/dashboardCalls'
//import { UploadFileAction } from "~/routes/dealer.api.fileUpload";
import { getSession as sessionGet, getUserByEmail } from '~/utils/user/get'
import { getSession } from "~/sessions/auth-session.server";

import { GetUser } from "~/utils/loader.server";


export async function EmailFunction(request, params, user, financeId, formPayload) {
  // const userSession = await authenticator.isAuthenticated(request, { failureRedirect: "/login", });
  // const formPayload = Object.fromEntries(await request.formData());
  // const user = await model.user.query.getForSession({ id: userSession.id });
  const email = user.email
  //const financeId = formPayload.financeId

  const referrer = request.headers.get('Referer');
  const referrerUrl = new URL(referrer);
  const referrerPath = referrerUrl.pathname; // This is the path


  console.log(financeId, 'financeId')
  let finance = await getMergedFinanceOnFinanceUniqueFInanceId(financeId)
  const deFees = await getDealerFeesbyEmail(email)
  const brand = finance?.brand
  console.log('hit  email action',)



  function fillTemplate(templateString, templateVars) {
    return templateString.replace(/\${(.*?)}/g, (_, g) => templateVars[g]);
  }
  console.log(finance.email, 'clientEmail')

  const clientData = {
    // clientFname: "Bob",

    //clientTitle: finance.clientTitle,
    clientFname: finance.firstName,
    clientLname: finance.lastName,
    clientFullName: finance.firstName + ' ' + finance.lastName,
    clientPhone: finance.phone,
    clientEmail: finance.email,
    //clientCompanyName: finance.clientCompanyName,
    clientCell: finance.phone,
    clientAddress: finance.address,
    clientCity: finance.city,
    clientProvince: finance.province,
    clientPostalCode: finance.postal,
    //  clientCountry: finance.country,
    year: finance.year,
    brand: finance.brand,
    model: finance.model,
    trim: finance.trim,
    stockNumber: finance.stockNum,
    vin: finance.vin,
    color: finance.color,
    // balance: finance.balance,
    tradeYear: finance.tradeYear,
    tradeMake: finance.tradeMake,
    tradeDesc: finance.tradeDesc,
    tradeTrim: finance.tradeTrim,
    tradeVin: finance.tradeVin,
    tradeColor: finance.tradeColor,
    tradeValue: finance.tradeValue,
    tradeMileage: finance.tradeMileage,
    firstName: user?.name.split(' ')[0],
    userFullName: user?.name,
    userPhone: user?.phone,
    userEmail: finance.userEmail,
    userCell: user?.phone,
    /*fAndIInstitution: finance.fAndIInstitution,
    fAndIFullName: finance.fAndIFullName,
    fAndIEmail: finance.fAndIEmail,
    fAndIFullName: finance.fAndIFullName,
    fAndIPhone: finance.fAndIPhone,
    fAndICell: finance.fAndICell,
    */
  }

  console.log(referrerPath); // Logs the referrer URL
  let customContent = formPayload.customContent
  let filledContent = ''
  if (referrerPath === '/overview/$' || referrerPath === '/dashboard/calls' || referrerPath === '/leads') {
    try {
      const templateString = formPayload.customContent //'Hello ${clientFname}, just wanted to follow up to our conversations...';
      const templateVars = clientData
      filledContent = fillTemplate(templateString, templateVars);
      console.log(filledContent); // "Hey Bob, just wanted to follow up to our conversations..."
      customContent = filledContent
    } catch (error) {
      console.error('Error:', error);
    }
  }

  let modelData = ''
  if (brand === 'Kawasaki') {
    modelData = await getDataKawasaki(finance);
  }
  const url = ''//UrlSelect(financeModel)

  const financeModel = finance?.model
  const userLabour = deFees?.userLabour
  const userOMVIC = deFees?.userOMVIC
  const userLicensing = deFees?.userLicensing

  const userExtWarr = deFees?.userExtWarr
  const userServicespkg = deFees?.userServicespkg
  const vinE = deFees?.vinE
  const rustProofing = deFees?.rustProofing
  const userGap = deFees?.userGap
  const userLoanProt = deFees?.userLoanProt
  const userTireandRim = deFees?.userTireandRim
  const userOther = deFees?.userOther
  const dealer = deFees?.dealer
  const pdi = deFees?.userPDI
  const userAirTax = deFees?.userAirTax
  const userDemo = deFees?.userDemo
  const userMarketAdj = deFees?.userMarketAdj
  const userGasOnDel = deFees?.userGasOnDel
  const destinationCharge = deFees?.destinationCharge
  const userFinance = deFees?.userFinance
  const userGovern = deFees?.userGovern
  const userTireTax = deFees?.userTireTax
  const admin = deFees?.userAdmin
  const commodity = deFees?.userCommodity
  const discount = finance?.discount
  const discountPer = finance?.discountPer
  const painPrem = finance?.paintPrem
  const onTax = finance?.onTax
  const total = finance?.total
  const months = finance?.months
  const stockNum = finance?.stockNum
  const year = finance?.year
  const deposit = finance?.deposit
  const licensing = finance?.licensing
  const labour = finance?.labour
  const accessories = finance?.accessories
  const msrp = finance?.msrp
  const tradeValue = finance?.tradeValue
  const modelCode = finance?.modelCode
  const customerName = finance?.name
  const custEmail = finance?.email

  const weekly = finance?.weekly
  const biweekly = finance?.biweekly
  const monthly = finance?.on60


  const qcTax = finance?.qcTax
  const weeklyqc = finance?.weeklyqc
  const biweeklyqc = finance?.biweeklyqc
  const qc60 = finance?.qc60

  const weeklyOth = finance?.weeklyOth
  const biweekOth = finance?.biweekOth
  const oth60 = finance?.oth60
  const biweeklNat = finance?.biweeklNat
  const weeklylNat = finance?.weeklylNat
  const nat60 = finance?.nat60

  const userEmail = user?.email
  const userPhone = user?.phone
  const userFname = user?.name
  const totalWithOptions = finance?.totalWithOptions
  const otherTaxWithOptions = finance?.otherTaxWithOptions
  const otherTax = finance?.otherTax
  const weeklyOthWOptions = finance?.weeklyOthWOptions
  const biweekOthWOptions = finance?.biweekOthWOptions
  const oth60WOptions = finance?.oth60WOptions
  const biweeklNatWOptions = finance?.biweeklNatWOptions
  const nat60WOptions = finance?.nat60WOptions
  const weeklylNatWOptions = finance?.weeklylNatWOptions


  //wOptions, wBreakdown, wSpec , optionsWBreakdown, optionsWSpec
  console.log('weekly', weekly)
  console.log('biweekly', biweekly)
  console.log('monthly', monthly)
  console.log('qcTax', qcTax)
  console.log('weeklyqc', weeklyqc)
  console.log('biweeklyqc', biweeklyqc)
  console.log('qc60', qc60)
  console.log('weeklyOth', weeklyOth)
  console.log('biweekOth', biweekOth)
  console.log('oth60', oth60)
  console.log('totalWithOptions', totalWithOptions)
  console.log('otherTaxWithOptions', otherTaxWithOptions)
  console.log('otherTax', otherTax)
  console.log('weeklyOthWOptions', weeklyOthWOptions)
  console.log('biweekOthWOptions', biweekOthWOptions)
  console.log('oth60WOptions', oth60WOptions)
  const model2 = finance?.model
  const intent = formPayload.emailType

  const subjectLine = formPayload?.subject
  const customerEmail = formPayload?.customerEmail
  const preview = formPayload?.preview
  // console.log(deFees, 'defees', intent, finance, intent, intent)

  // 1
  if (formPayload.emailType === 'fullCustom') {
    const data = await resend.emails.send({
      from: `${userFname} <admin@dealersalesassistant.ca>`,
      to: `${customerEmail}`,
      subject: `${subjectLine}`,
      bcc: `${userEmail}`,
      react: <FullCustom
        customContent={filledContent}
        userEmail={userEmail}
        userFname={userFname}
        userPhone={userPhone}
        clientData={clientData}
      />
    });
    console.log('fulCustom sent')
    return json({ 'email sent': data, finance, user, status: { code: 204, message: 'Email sent successfully!' } })
  }
  else if (formPayload.emailType === 'paymentsTemp') {
    const data = await resend.emails.send({
      from: `${userFname} <admin@dealersalesassistant.ca>`,
      to: `${custEmail}`,
      subject: `${finance.brand} ${model2} model information.`,
      bcc: `${userEmail}`,
      react: <TempPayments
        customerName={customerName}
        model2={model2}
        custEmail={custEmail}
        userEmail={userEmail}
        userFname={userFname}
        biweekly={biweekly}
        weekly={weekly}
        brand={brand}
        months={months}
        monthly={monthly}
        dealer={dealer}
        deposit={deposit}
        userPhone={userPhone}
      />
    });
    console.log('paymentsTemp sent')
    return json({ 'email sent': data, finance, user, status: { code: 204, message: 'Email sent successfully!' } })
  }

  // 2
  else if (formPayload.emailType === 'wBreakdownTemp') {
    const data = await resend.emails.send({
      from: `${userFname} <admin@dealersalesassistant.ca>`,
      to: `${custEmail}`,
      subject: `${finance.brand} ${model2} model information.`,
      bcc: `${userEmail}`,
      react: <TempPaymentsBreakdown
        customContent={customContent}
        customerName={customerName}
        userExtWarr={userExtWarr}
        model2={model2}
        userEmail={userEmail}
        userPhone={userPhone}
        userFname={userFname}

        onTax={onTax}
        weekly={weekly}
        biweekly={biweekly}
        monthly={monthly}

        dealer={dealer}
        deposit={deposit}
        months={months}
        brand={brand}
        userServicespkg={userServicespkg}
        vinE={vinE}
        rustProofing={rustProofing}
        userGap={userGap}
        userLoanProt={userLoanProt}
        userTireandRim={userTireandRim}
        userOther={userOther}
        model={model}
        modelCode={modelCode}
        stockNum={stockNum}
        year={year}
        pdi={pdi}
        msrp={msrp}
        admin={admin}
        commodity={commodity}
        accessories={accessories}
        labour={labour}
        tradeValue={tradeValue}
        licensing={licensing}
        total={total}
        painPrem={painPrem}
        userAirTax={userAirTax}
        userDemo={userDemo}
        userMarketAdj={userMarketAdj}
        userGasOnDel={userGasOnDel}
        destinationCharge={destinationCharge}
        userFinance={userFinance}
        userGovern={userGovern}
        userTireTax={userTireTax}
        discount={discount}
        discountPer={discountPer}
        url={url}
      />
    })
    console.log('wBreakdownTemp  sent')
    return json({ 'email sent': data, finance, user, status: { code: 204, message: 'Email sent successfully!' } })
  }

  // 3
  else if (formPayload.emailType === 'wSpecTemp') {
    const data = await resend.emails.send({
      from: `${userFname} <admin@dealersalesassistant.ca>`,
      to: `${custEmail}`,
      subject: `${finance.brand} ${model2} model information.`,
      bcc: `${userEmail}`,
      react: <TempPaymentsBreakdownPDF
        customContent={customContent}
        customerName={customerName}
        userExtWarr={userExtWarr}
        model2={model2}
        userEmail={userEmail}
        userPhone={userPhone}
        userFname={userFname}
        onTax={onTax}
        weekly={weekly}
        biweekly={biweekly}
        monthly={monthly}
        dealer={dealer}
        deposit={deposit}
        months={months}
        brand={brand}
        userServicespkg={userServicespkg}
        vinE={vinE}
        rustProofing={rustProofing}
        userGap={userGap}
        userLoanProt={userLoanProt}
        userTireandRim={userTireandRim}
        userOther={userOther}
        model={model}
        modelCode={modelCode}
        stockNum={stockNum}
        year={year}
        pdi={pdi}
        msrp={msrp}
        admin={admin}
        commodity={commodity}
        accessories={accessories}
        labour={labour}
        tradeValue={tradeValue}
        licensing={licensing}
        total={total}
        painPrem={painPrem}
        userAirTax={userAirTax}
        userDemo={userDemo}
        userMarketAdj={userMarketAdj}
        userGasOnDel={userGasOnDel}
        destinationCharge={destinationCharge}
        userFinance={userFinance}
        userGovern={userGovern}
        userTireTax={userTireTax}
        discount={discount}
        discountPer={discountPer}
        url={url}
      />
    })
    console.log(' TempPaymentsBreakdownPDF sent')
    return json({ 'email sent': data, finance, user, status: { code: 204, message: 'Email sent successfully!' } })
  }

  // 4
  else if (formPayload.emailType === 'wOptionsTemp') {
    const data = await resend.emails.send({
      from: `${userFname} <admin@dealersalesassistant.ca>`,
      to: `${custEmail}`,
      subject: `${finance.brand} ${model2} model information.`,
      bcc: `${userEmail}`,
      react: <TempOptions
        customerName={customerName}
        model2={model2}
        custEmail={custEmail}
        userEmail={userEmail}
        userFname={userFname}
        biweekly={biweeklyqc}
        weekly={weeklyqc}

        brand={brand}
        months={months}
        monthly={qc60}
        dealer={dealer}
        deposit={deposit}
        userPhone={userPhone}
      />
    });

    console.log('just paymets sent')
    return json({ 'email sent': data, finance, user, status: { code: 204, message: 'Email sent successfully!' } })
  }

  // 5
  else if (formPayload.emailType === 'optionsWBreakdownTemp') {
    const data = await resend.emails.send({
      from: `${userFname} <admin@dealersalesassistant.ca>`,
      to: `${custEmail}`,
      subject: `${finance.brand} ${model2} model information.`,
      bcc: `${userEmail}`,
      react: <TempOptionsWBreakdown
        customContent={customContent}
        customerName={customerName}
        userExtWarr={userExtWarr}
        model2={model2}
        userEmail={userEmail}
        userPhone={userPhone}
        userFname={userFname}

        onTax={qcTax}
        weekly={weeklyqc}
        biweekly={biweeklyqc}
        monthly={qc60}
        total={totalWithOptions}

        dealer={dealer}
        deposit={deposit}
        months={months}
        brand={brand}
        userServicespkg={userServicespkg}
        vinE={vinE}
        rustProofing={rustProofing}
        userGap={userGap}
        userLoanProt={userLoanProt}
        userTireandRim={userTireandRim}
        userOther={userOther}
        model={model}
        modelCode={modelCode}
        stockNum={stockNum}
        year={year}
        pdi={pdi}
        msrp={msrp}
        admin={admin}
        commodity={commodity}
        accessories={accessories}
        labour={labour}
        tradeValue={tradeValue}
        licensing={licensing}

        painPrem={painPrem}
        userAirTax={userAirTax}
        userDemo={userDemo}
        userMarketAdj={userMarketAdj}
        userGasOnDel={userGasOnDel}
        destinationCharge={destinationCharge}
        userFinance={userFinance}
        userGovern={userGovern}
        userTireTax={userTireTax}
        discount={discount}
        discountPer={discountPer}
        url={url}
      />
    })

    console.log('just paymets sent')
    return json({ 'email sent': data, finance, user, status: { code: 204, message: 'Email sent successfully!' } })
  }

  // 6
  else if (formPayload.emailType === 'optionsWSpecTemp') {
    const data = await resend.emails.send({
      from: `${userFname} <admin@dealersalesassistant.ca>`,
      to: `${custEmail}`,
      subject: `${finance.brand} ${model2} model information.`,
      bcc: `${userEmail}`,
      react: <TempOptionsWPDF
        customerName={customerName}
        userExtWarr={userExtWarr}
        model2={model2}
        userEmail={userEmail}
        userPhone={userPhone}
        userFname={userFname}

        onTax={qcTax}
        weekly={weeklyqc}
        biweekly={biweeklyqc}
        monthly={qc60}

        dealer={dealer}
        deposit={deposit}
        months={months}

        brand={brand}
        userServicespkg={userServicespkg}
        vinE={vinE}
        rustProofing={rustProofing}
        userGap={userGap}
        userLoanProt={userLoanProt}
        userTireandRim={userTireandRim}
        userOther={userOther}
        model={model}
        modelCode={modelCode}
        stockNum={stockNum}
        year={year}
        pdi={pdi}
        msrp={msrp}
        admin={admin}
        commodity={commodity}
        accessories={accessories}
        labour={labour}
        tradeValue={tradeValue}
        licensing={licensing}
        total={totalWithOptions}
        painPrem={painPrem}
        userAirTax={userAirTax}
        userDemo={userDemo}
        userMarketAdj={userMarketAdj}
        userGasOnDel={userGasOnDel}
        destinationCharge={destinationCharge}
        userFinance={userFinance}
        userGovern={userGovern}
        userTireTax={userTireTax}
        discount={discount}
        discountPer={discountPer}
        url={url}
      />
    })

    console.log('just paymets sent')
    return json({ 'email sent': data, finance, user, status: { code: 204, message: 'Email sent successfully!' } })
  }

  // 7
  else if (formPayload.emailType === 'paymentsNoTaxTemp') {
    const data = await resend.emails.send({
      from: `${userFname} <admin@dealersalesassistant.ca>`,
      to: `${custEmail}`,
      subject: `${finance.brand} ${model2} model information.`,
      bcc: `${userEmail}`,
      react: <TempOptions
        customerName={customerName}
        model2={model2}
        custEmail={custEmail}
        userEmail={userEmail}
        userFname={userFname}

        biweekly={biweeklNat}
        weekly={weeklylNat}
        monthly={nat60}


        brand={brand}
        months={months}

        dealer={dealer}
        deposit={deposit}
        userPhone={userPhone}
      />
    });

    console.log('just paymets sent')
    return json({ 'email sent': data, finance, user, status: { code: 204, message: 'Email sent successfully!' } })
  }

  // 8
  //msrp not showing
  else if (formPayload.emailType === 'wBreakdownNoTaxTemp') {
    const data = await resend.emails.send({
      from: `${userFname} <admin@dealersalesassistant.ca>`,
      to: `${custEmail}`,
      subject: `${finance.brand} ${model2} model information.`,
      bcc: `${userEmail}`,
      react: <TempPaymentsBreakdown
        customerName={customerName}
        userExtWarr={userExtWarr}
        model2={model2}
        userEmail={userEmail}
        userPhone={userPhone}
        userFname={userFname}

        biweekly={biweeklNat}
        weekly={weeklylNat}
        monthly={nat60}
        onTax={total}

        dealer={dealer}
        deposit={deposit}
        months={months}
        brand={brand}
        userServicespkg={userServicespkg}
        vinE={vinE}
        rustProofing={rustProofing}
        userGap={userGap}
        userLoanProt={userLoanProt}
        userTireandRim={userTireandRim}
        userOther={userOther}
        model={model}
        modelCode={modelCode}
        stockNum={stockNum}
        year={year}
        pdi={pdi}
        msrp={msrp}
        admin={admin}
        commodity={commodity}
        accessories={accessories}
        labour={labour}
        tradeValue={tradeValue}
        licensing={licensing}

        painPrem={painPrem}
        userAirTax={userAirTax}
        userDemo={userDemo}
        userMarketAdj={userMarketAdj}
        userGasOnDel={userGasOnDel}
        destinationCharge={destinationCharge}
        userFinance={userFinance}
        userGovern={userGovern}
        userTireTax={userTireTax}
        discount={discount}
        discountPer={discountPer}
        url={url}
      />
    })
    console.log('just paymets sent')
    return json({ 'email sent': data, finance, user, status: { code: 204, message: 'Email sent successfully!' } })
  }

  // 9
  else if (formPayload.emailType === 'wSpecNoTaxTemp') {

    const data = await resend.emails.send({
      from: `${userFname} <admin@dealersalesassistant.ca>`,
      to: `${custEmail}`,
      subject: `${finance.brand} ${model2} model information.`,
      bcc: `${userEmail}`,
      react: <TempPaymentsBreakdownPDF
        customContent={customContent}
        customerName={customerName}
        userExtWarr={userExtWarr}
        model2={model2}
        userEmail={userEmail}
        userPhone={userPhone}
        userFname={userFname}


        biweekly={biweeklNat}
        weekly={weeklylNat}
        monthly={nat60}
        onTax={total}

        dealer={dealer}
        deposit={deposit}
        months={months}
        brand={brand}
        userServicespkg={userServicespkg}
        vinE={vinE}
        rustProofing={rustProofing}
        userGap={userGap}
        userLoanProt={userLoanProt}
        userTireandRim={userTireandRim}
        userOther={userOther}
        model={model}
        modelCode={modelCode}
        stockNum={stockNum}
        year={year}
        pdi={pdi}
        msrp={msrp}
        admin={admin}
        commodity={commodity}
        accessories={accessories}
        labour={labour}
        tradeValue={tradeValue}
        licensing={licensing}
        total={total}
        painPrem={painPrem}
        userAirTax={userAirTax}
        userDemo={userDemo}
        userMarketAdj={userMarketAdj}
        userGasOnDel={userGasOnDel}
        destinationCharge={destinationCharge}
        userFinance={userFinance}
        userGovern={userGovern}
        userTireTax={userTireTax}
        discount={discount}
        discountPer={discountPer}
        url={url}
      />
    })
    console.log('just paymets sent')
    return json({ 'email sent': data, finance, user, status: { code: 204, message: 'Email sent successfully!' } })
  }

  // 10
  else if (formPayload.emailType === 'wOptionsNoTaxTemp') {
    const data = await resend.emails.send({
      from: `${userFname} <admin@dealersalesassistant.ca>`,
      to: `${custEmail}`,
      subject: `${finance.brand} ${model2} model information.`,
      bcc: `${userEmail}`,
      react: <TempOptions
        customerName={customerName}
        model2={model2}
        custEmail={custEmail}
        userEmail={userEmail}
        userFname={userFname}

        biweekly={biweeklNatWOptions}
        weekly={weeklylNatWOptions}
        monthly={nat60WOptions}

        brand={brand}
        months={months}

        dealer={dealer}
        deposit={deposit}
        userPhone={userPhone}
      />
    });

    console.log('just paymets sent')
    return json({ 'email sent': data, finance, user, status: { code: 204, message: 'Email sent successfully!' } })
  }

  // 11
  else if (formPayload.emailType === 'optionsWBreakdownNoTaxTemp') {
    const data = await resend.emails.send({
      from: `${userFname} <admin@dealersalesassistant.ca>`,
      to: `${custEmail}`,
      subject: `${finance.brand} ${model2} model information.`,
      bcc: `${userEmail}`,
      react: <TempOptionsWBreakdown
        customContent={customContent}
        customerName={customerName}
        userExtWarr={userExtWarr}
        model2={model2}
        userEmail={userEmail}
        userPhone={userPhone}
        userFname={userFname}

        total={totalWithOptions}
        onTax={total}
        biweekly={biweeklNatWOptions}
        weekly={weeklylNatWOptions}
        monthly={nat60WOptions}

        dealer={dealer}
        deposit={deposit}
        months={months}
        brand={brand}
        userServicespkg={userServicespkg}
        vinE={vinE}
        rustProofing={rustProofing}
        userGap={userGap}
        userLoanProt={userLoanProt}
        userTireandRim={userTireandRim}
        userOther={userOther}
        model={model}
        modelCode={modelCode}
        stockNum={stockNum}
        year={year}
        pdi={pdi}
        msrp={msrp}
        admin={admin}
        commodity={commodity}
        accessories={accessories}
        labour={labour}
        tradeValue={tradeValue}
        licensing={licensing}

        painPrem={painPrem}
        userAirTax={userAirTax}
        userDemo={userDemo}
        userMarketAdj={userMarketAdj}
        userGasOnDel={userGasOnDel}
        destinationCharge={destinationCharge}
        userFinance={userFinance}
        userGovern={userGovern}
        userTireTax={userTireTax}
        discount={discount}
        discountPer={discountPer}
        url={url}
      />
    })


    console.log('just paymets sent')
    return json({ 'email sent': data, finance, user, status: { code: 204, message: 'Email sent successfully!' } })
  }

  // 12
  else if (formPayload.emailType === 'optionsWSpecNoTaxTemp') {
    const data = await resend.emails.send({
      from: `${userFname} <admin@dealersalesassistant.ca>`,
      to: `${custEmail}`,
      subject: `${finance.brand} ${model2} model information.`,
      bcc: `${userEmail}`,
      react: <TempOptionsWPDF
        customContent={customContent}
        customerName={customerName}
        userExtWarr={userExtWarr}
        model2={model2}
        userEmail={userEmail}
        userPhone={userPhone}
        userFname={userFname}


        total={totalWithOptions}
        onTax={total}
        biweekly={biweeklNatWOptions}
        weekly={weeklylNatWOptions}
        monthly={nat60WOptions}


        dealer={dealer}
        deposit={deposit}
        months={months}

        brand={brand}
        userServicespkg={userServicespkg}
        vinE={vinE}
        rustProofing={rustProofing}
        userGap={userGap}
        userLoanProt={userLoanProt}
        userTireandRim={userTireandRim}
        userOther={userOther}
        model={model}
        modelCode={modelCode}
        stockNum={stockNum}
        year={year}
        pdi={pdi}
        msrp={msrp}
        admin={admin}
        commodity={commodity}
        accessories={accessories}
        labour={labour}
        tradeValue={tradeValue}
        licensing={licensing}

        painPrem={painPrem}
        userAirTax={userAirTax}
        userDemo={userDemo}
        userMarketAdj={userMarketAdj}
        userGasOnDel={userGasOnDel}
        destinationCharge={destinationCharge}
        userFinance={userFinance}
        userGovern={userGovern}
        userTireTax={userTireTax}
        discount={discount}
        discountPer={discountPer}
        url={url}
      />
    })
    console.log('just paymets sent')
    return json({ 'email sent': data, finance, user, status: { code: 204, message: 'Email sent successfully!' } })
  }

  // 13
  else if (formPayload.emailType === 'paymentsCustomTemp') {
    const data = await resend.emails.send({
      from: `${userFname} <admin@dealersalesassistant.ca>`,
      to: `${custEmail}`,
      subject: `${finance.brand} ${model2} model information.`,
      bcc: `${userEmail}`,
      react: <TempOptions
        customerName={customerName}
        model2={model2}
        custEmail={custEmail}
        userEmail={userEmail}
        userFname={userFname}

        biweekly={biweekOth}
        weekly={weeklyOth}
        monthly={oth60}

        brand={brand}
        months={months}

        dealer={dealer}
        deposit={deposit}
        userPhone={userPhone}
      />
    });

    console.log('just paymets sent')
    return json({ 'email sent': data, finance, user, status: { code: 204, message: 'Email sent successfully!' } })
  }

  // 14
  else if (formPayload.emailType === 'wBreakdownCustomTemp') {

    const data = await resend.emails.send({
      from: `${userFname} <admin@dealersalesassistant.ca>`,
      to: `${custEmail}`,
      subject: `${finance.brand} ${model2} model information.`,
      bcc: `${userEmail}`,
      react: <TempPaymentsBreakdown
        customContent={customContent}
        customerName={customerName}
        userExtWarr={userExtWarr}
        model2={model2}
        userEmail={userEmail}
        userPhone={userPhone}
        userFname={userFname}

        onTax={otherTax}

        biweekly={biweekOth}
        weekly={weeklyOth}
        monthly={oth60}

        dealer={dealer}
        deposit={deposit}
        months={months}
        brand={brand}
        userServicespkg={userServicespkg}
        vinE={vinE}
        rustProofing={rustProofing}
        userGap={userGap}
        userLoanProt={userLoanProt}
        userTireandRim={userTireandRim}
        userOther={userOther}
        model={model}
        modelCode={modelCode}
        stockNum={stockNum}
        year={year}
        pdi={pdi}
        msrp={msrp}
        admin={admin}
        commodity={commodity}
        accessories={accessories}
        labour={labour}
        tradeValue={tradeValue}
        licensing={licensing}
        total={total}
        painPrem={painPrem}
        userAirTax={userAirTax}
        userDemo={userDemo}
        userMarketAdj={userMarketAdj}
        userGasOnDel={userGasOnDel}
        destinationCharge={destinationCharge}
        userFinance={userFinance}
        userGovern={userGovern}
        userTireTax={userTireTax}
        discount={discount}
        discountPer={discountPer}
        url={url}
      />
    })
    console.log('just paymets sent')
    return json({ 'email sent': data, finance, user, status: { code: 204, message: 'Email sent successfully!' } })
  }

  // 15
  else if (formPayload.emailType === 'wSpecCustomTemp') {

    const data = await resend.emails.send({
      from: `${userFname} <admin@dealersalesassistant.ca>`,
      to: `${custEmail}`,
      subject: `${finance.brand} ${model2} model information.`,
      bcc: `${userEmail}`,
      react: <TempPaymentsBreakdownPDF
        customContent={customContent}
        customerName={customerName}
        userExtWarr={userExtWarr}
        model2={model2}
        userEmail={userEmail}
        userPhone={userPhone}
        userFname={userFname}

        onTax={otherTax}

        biweekly={biweekOth}
        weekly={weeklyOth}
        monthly={oth60}

        dealer={dealer}
        deposit={deposit}
        months={months}
        brand={brand}
        userServicespkg={userServicespkg}
        vinE={vinE}
        rustProofing={rustProofing}
        userGap={userGap}
        userLoanProt={userLoanProt}
        userTireandRim={userTireandRim}
        userOther={userOther}
        model={model}
        modelCode={modelCode}
        stockNum={stockNum}
        year={year}
        pdi={pdi}
        msrp={msrp}
        admin={admin}
        commodity={commodity}
        accessories={accessories}
        labour={labour}
        tradeValue={tradeValue}
        licensing={licensing}
        total={total}
        painPrem={painPrem}
        userAirTax={userAirTax}
        userDemo={userDemo}
        userMarketAdj={userMarketAdj}
        userGasOnDel={userGasOnDel}
        destinationCharge={destinationCharge}
        userFinance={userFinance}
        userGovern={userGovern}
        userTireTax={userTireTax}
        discount={discount}
        discountPer={discountPer}
        url={url}
      />
    })

    console.log('just paymets sent')
    return json({ 'email sent': data, finance, user, status: { code: 204, message: 'Email sent successfully!' } })
  }

  // 16
  else if (formPayload.emailType === 'wOptionsCustomTemp') {
    const data = await resend.emails.send({
      from: `${userFname} <admin@dealersalesassistant.ca>`,
      to: `${custEmail}`,
      subject: `${finance.brand} ${model2} model information.`,
      bcc: `${userEmail}`,
      react: <TempOptions
        customerName={customerName}
        model2={model2}
        custEmail={custEmail}
        userEmail={userEmail}
        userFname={userFname}

        biweekly={biweekOthWOptions}
        weekly={weeklyOthWOptions}
        monthly={oth60WOptions}



        brand={brand}
        months={months}

        dealer={dealer}
        deposit={deposit}
        userPhone={userPhone}
      />
    });

    console.log('just paymets sent')
    return json({ 'email sent': data, finance, user, status: { code: 204, message: 'Email sent successfully!' } })
  }

  // 17
  else if (formPayload.emailType === 'optionsWBreakdownCustomTemp') {

    const data = await resend.emails.send({
      from: `${userFname} <admin@dealersalesassistant.ca>`,
      to: `${custEmail}`,
      subject: `${finance.brand} ${model2} model information.`,
      bcc: `${userEmail}`,
      react: <TempOptionsWBreakdown
        customContent={customContent}
        customerName={customerName}
        userExtWarr={userExtWarr}
        model2={model2}
        userEmail={userEmail}
        userPhone={userPhone}
        userFname={userFname}

        onTax={otherTaxWithOptions}
        biweekly={biweekOthWOptions}
        weekly={weeklyOthWOptions}
        monthly={oth60WOptions}
        total={totalWithOptions}


        dealer={dealer}
        deposit={deposit}
        months={months}
        brand={brand}
        userServicespkg={userServicespkg}
        vinE={vinE}
        rustProofing={rustProofing}
        userGap={userGap}
        userLoanProt={userLoanProt}
        userTireandRim={userTireandRim}
        userOther={userOther}
        model={model}
        modelCode={modelCode}
        stockNum={stockNum}
        year={year}
        pdi={pdi}
        msrp={msrp}
        admin={admin}
        commodity={commodity}
        accessories={accessories}
        labour={labour}
        tradeValue={tradeValue}
        licensing={licensing}
        painPrem={painPrem}
        userAirTax={userAirTax}
        userDemo={userDemo}
        userMarketAdj={userMarketAdj}
        userGasOnDel={userGasOnDel}
        destinationCharge={destinationCharge}
        userFinance={userFinance}
        userGovern={userGovern}
        userTireTax={userTireTax}
        discount={discount}
        discountPer={discountPer}
        url={url}
      />
    })
    console.log('just paymets sent')
    return json({ 'email sent': data, finance, user, status: { code: 204, message: 'Email sent successfully!' } })
  }

  // 18
  else if (formPayload.emailType === 'optionsWSpecCustomTemp') {
    const data = await resend.emails.send({
      from: `${userFname} <admin@dealersalesassistant.ca>`,
      to: `${custEmail}`,
      subject: `${finance.brand} ${model2} model information.`,
      bcc: `${userEmail}`,
      react: <TempOptionsWPDF
        customContent={customContent}
        customerName={customerName}
        userExtWarr={userExtWarr}
        model2={model2}
        userEmail={userEmail}
        userPhone={userPhone}
        userFname={userFname}

        onTax={otherTaxWithOptions}
        biweekly={biweekOthWOptions}
        weekly={weeklyOthWOptions}
        monthly={oth60WOptions}
        total={totalWithOptions}


        dealer={dealer}
        deposit={deposit}
        months={months}

        brand={brand}
        userServicespkg={userServicespkg}
        vinE={vinE}
        rustProofing={rustProofing}
        userGap={userGap}
        userLoanProt={userLoanProt}
        userTireandRim={userTireandRim}
        userOther={userOther}
        model={model}
        modelCode={modelCode}
        stockNum={stockNum}
        year={year}
        pdi={pdi}
        msrp={msrp}
        admin={admin}
        commodity={commodity}
        accessories={accessories}
        labour={labour}
        tradeValue={tradeValue}
        licensing={licensing}
        painPrem={painPrem}
        userAirTax={userAirTax}
        userDemo={userDemo}
        userMarketAdj={userMarketAdj}
        userGasOnDel={userGasOnDel}
        destinationCharge={destinationCharge}
        userFinance={userFinance}
        userGovern={userGovern}
        userTireTax={userTireTax}
        discount={discount}
        discountPer={discountPer}
        url={url}
      />
    })

    console.log('just paymets sent')
    return json({ 'email sent': data, finance, user, status: { code: 204, message: 'Email sent successfully!' } })
  }

  // 19
  else if (formPayload.emailType === 'payments') {
    const data = await resend.emails.send({
      from: `${userFname} <admin@dealersalesassistant.ca>`,
      to: `${custEmail}`,
      subject: `${finance.brand} ${model2} model information.`,
      bcc: `${userEmail}`,
      react: <Payments
        customerName={customerName}
        model2={model2}
        userEmail={userEmail}
        userFname={userFname}
        biweekly={biweeklyqc}
        weekly={weeklyqc}
        brand={brand}
        months={months}
        monthly={qc60}
        dealer={dealer}
        deposit={deposit}
        userPhone={userPhone}
        customContent={customContent}
      />
    });
    console.log('just paymets sent')
    return json({ 'email sent': data, finance, user, status: { code: 204, message: 'Email sent successfully!' } })
  }

  // 20
  else if (formPayload.emailType === 'wBreakdown') {
    const data = await resend.emails.send({
      from: `${userFname} <admin@dealersalesassistant.ca>`,
      to: `${custEmail}`,
      subject: `${finance.brand} ${model2} model information.`,
      bcc: `${userEmail}`,
      react: <FullBreakdown
        customContent={customContent}
        customerName={customerName}
        userExtWarr={userExtWarr}
        model2={model2}
        userEmail={userEmail}
        userPhone={userPhone}
        userFname={userFname}

        onTax={onTax}
        weekly={weekly}
        biweekly={biweekly}
        monthly={monthly}

        dealer={dealer}
        deposit={deposit}
        months={months}
        brand={brand}
        userServicespkg={userServicespkg}
        vinE={vinE}
        rustProofing={rustProofing}
        userGap={userGap}
        userLoanProt={userLoanProt}
        userTireandRim={userTireandRim}
        userOther={userOther}
        model={model}
        modelCode={modelCode}
        stockNum={stockNum}
        year={year}
        pdi={pdi}
        msrp={msrp}
        admin={admin}
        commodity={commodity}
        accessories={accessories}
        labour={labour}
        tradeValue={tradeValue}
        licensing={licensing}
        total={total}
        painPrem={painPrem}
        userAirTax={userAirTax}
        userDemo={userDemo}
        userMarketAdj={userMarketAdj}
        userGasOnDel={userGasOnDel}
        destinationCharge={destinationCharge}
        userFinance={userFinance}
        userGovern={userGovern}
        userTireTax={userTireTax}
        discount={discount}
        discountPer={discountPer}
        url={url}
      />
    })
    console.log('wBreakdown sent')
    return json({ 'email sent': data, finance, user, status: { code: 204, message: 'Email sent successfully!' } })
  }

  // 21
  else if (formPayload.emailType === 'wSpec') {
    const data = await resend.emails.send({
      from: `${userFname} <admin@dealersalesassistant.ca>`,
      to: `${custEmail}`,
      subject: `${finance.brand} ${model2} model information.`,
      bcc: `${userEmail}`,
      react: <WPdf
        customContent={customContent}
        customerName={customerName}
        userExtWarr={userExtWarr}
        model2={model2}
        userEmail={userEmail}
        userPhone={userPhone}
        userFname={userFname}
        onTax={onTax}
        weekly={weekly}
        biweekly={biweekly}
        monthly={monthly}
        dealer={dealer}
        deposit={deposit}
        months={months}
        brand={brand}
        userServicespkg={userServicespkg}
        vinE={vinE}
        rustProofing={rustProofing}
        userGap={userGap}
        userLoanProt={userLoanProt}
        userTireandRim={userTireandRim}
        userOther={userOther}
        model={model}
        modelCode={modelCode}
        stockNum={stockNum}
        year={year}
        pdi={pdi}
        msrp={msrp}
        admin={admin}
        commodity={commodity}
        accessories={accessories}
        labour={labour}
        tradeValue={tradeValue}
        licensing={licensing}
        total={total}
        painPrem={painPrem}
        userAirTax={userAirTax}
        userDemo={userDemo}
        userMarketAdj={userMarketAdj}
        userGasOnDel={userGasOnDel}
        destinationCharge={destinationCharge}
        userFinance={userFinance}
        userGovern={userGovern}
        userTireTax={userTireTax}
        discount={discount}
        discountPer={discountPer}
        url={url}
      />
    })
    console.log('wBreakdown sent')
    return json({ 'email sent': data, finance, user, status: { code: 204, message: 'Email sent successfully!' } })
  }

  // 22
  else if (formPayload.emailType === 'wOptions') {
    const data = await resend.emails.send({
      from: `${userFname} <admin@dealersalesassistant.ca>`,
      to: `${custEmail}`,
      subject: `${finance.brand} ${model2} model information.`,
      bcc: `${userEmail}`,
      react: <Options
        customContent={customContent}
        customerName={customerName}
        userExtWarr={userExtWarr}
        model2={model2}
        userEmail={userEmail}
        userPhone={userPhone}
        userFname={userFname}
        weekly={weeklyqc}
        biweekly={biweeklyqc}
        monthly={qc60}
        dealer={dealer}
        deposit={deposit}
        months={months}
        brand={brand}
        userServicespkg={userServicespkg}
        vinE={vinE}
        rustProofing={rustProofing}
        userGap={userGap}
        userLoanProt={userLoanProt}
        userTireandRim={userTireandRim}
        userOther={userOther}
        model={model}
        modelCode={modelCode}
        stockNum={stockNum}
        year={year}
        pdi={pdi}
        msrp={msrp}
        admin={admin}
        commodity={commodity}
        accessories={accessories}
        labour={labour}
        tradeValue={tradeValue}
        licensing={licensing}
        onTax={qcTax}
        total={total}
        painPrem={painPrem}
        userAirTax={userAirTax}
        userDemo={userDemo}
        userMarketAdj={userMarketAdj}
        userGasOnDel={userGasOnDel}
        destinationCharge={destinationCharge}
        userFinance={userFinance}
        userGovern={userGovern}
        userTireTax={userTireTax}
        discount={discount}
        discountPer={discountPer}
      />
    })
    console.log('wOptions sent')
    return json({ 'email sent': data, finance, user, status: { code: 204, message: 'Email sent successfully!' } })
  }


  // 23
  else if (formPayload.emailType === 'optionsWBreakdown') {
    const data = await resend.emails.send({
      from: `${userFname} <admin@dealersalesassistant.ca>`,
      to: `${custEmail}`,
      subject: `${finance.brand} ${model2} model information.`,
      bcc: `${userEmail}`,
      react: <OptionsWBreakdown
        customContent={customContent}
        customerName={customerName}
        userExtWarr={userExtWarr}
        model2={model2}
        userEmail={userEmail}
        userPhone={userPhone}
        userFname={userFname}

        onTax={qcTax}
        weekly={weeklyqc}
        biweekly={biweeklyqc}
        monthly={qc60}

        dealer={dealer}
        deposit={deposit}
        months={months}
        brand={brand}
        userServicespkg={userServicespkg}
        vinE={vinE}
        rustProofing={rustProofing}
        userGap={userGap}
        userLoanProt={userLoanProt}
        userTireandRim={userTireandRim}
        userOther={userOther}
        model={model}
        modelCode={modelCode}
        stockNum={stockNum}
        year={year}
        pdi={pdi}
        msrp={msrp}
        admin={admin}
        commodity={commodity}
        accessories={accessories}
        labour={labour}
        tradeValue={tradeValue}
        licensing={licensing}
        total={total}
        painPrem={painPrem}
        userAirTax={userAirTax}
        userDemo={userDemo}
        userMarketAdj={userMarketAdj}
        userGasOnDel={userGasOnDel}
        destinationCharge={destinationCharge}
        userFinance={userFinance}
        userGovern={userGovern}
        userTireTax={userTireTax}
        discount={discount}
        discountPer={discountPer}
        url={url}
      />
    })
    console.log('optionsWBreakdown sent')
    return json({ 'email sent': data, finance, user, status: { code: 204, message: 'Email sent successfully!' } })
  }

  // 24
  else if (formPayload.emailType === 'optionsWSpec') {
    const data = await resend.emails.send({
      from: `${userFname} <admin@dealersalesassistant.ca>`,
      to: `${custEmail}`,
      subject: `${finance.brand} ${model2} model information.`,
      bcc: `${userEmail}`,
      react: <OptionsWSpec
        customContent={customContent}
        customerName={customerName}
        userExtWarr={userExtWarr}
        model2={model2}
        userEmail={userEmail}
        userPhone={userPhone}
        userFname={userFname}


        total={totalWithOptions}
        onTax={qcTax}
        biweekly={biweeklyqc}
        weekly={weeklyqc}
        monthly={qc60}


        dealer={dealer}
        deposit={deposit}
        months={months}

        brand={brand}
        userServicespkg={userServicespkg}
        vinE={vinE}
        rustProofing={rustProofing}
        userGap={userGap}
        userLoanProt={userLoanProt}
        userTireandRim={userTireandRim}
        userOther={userOther}
        model={model}
        modelCode={modelCode}
        stockNum={stockNum}
        year={year}
        pdi={pdi}
        msrp={msrp}
        admin={admin}
        commodity={commodity}
        accessories={accessories}
        labour={labour}
        tradeValue={tradeValue}
        licensing={licensing}

        painPrem={painPrem}
        userAirTax={userAirTax}
        userDemo={userDemo}
        userMarketAdj={userMarketAdj}
        userGasOnDel={userGasOnDel}
        destinationCharge={destinationCharge}
        userFinance={userFinance}
        userGovern={userGovern}
        userTireTax={userTireTax}
        discount={discount}
        discountPer={discountPer}
        url={url}
      />
    })
    console.log('just paymets sent')
    return json({ 'email sent': data, finance, user, status: { code: 204, message: 'Email sent successfully!' } })
  }

  // 25
  else if (formPayload.emailType === 'paymentsNoTax') {
    const data = await resend.emails.send({
      from: `${userFname} <admin@dealersalesassistant.ca>`,
      to: `${custEmail}`,
      subject: `${finance.brand} ${model2} model information.`,
      bcc: `${userEmail}`,
      react: <Payments
        customContent={customContent}
        customerName={customerName}
        model2={model2}
        custEmail={custEmail}
        userEmail={userEmail}
        userFname={userFname}

        biweekly={biweeklNat}
        weekly={weeklylNat}
        monthly={nat60}


        brand={brand}
        months={months}

        dealer={dealer}
        deposit={deposit}
        userPhone={userPhone}
      />
    });

    console.log('just paymets sent')
    return json({ 'email sent': data, finance, user, status: { code: 204, message: 'Email sent successfully!' } })
  }
  // 26 wBreakdownNoTax

  else if (formPayload.emailType === 'wBreakdownNoTax') {
    const data = await resend.emails.send({
      from: `${userFname} <admin@dealersalesassistant.ca>`,
      to: `${custEmail}`,
      subject: `${finance.brand} ${model2} model information.`,
      bcc: `${userEmail}`,
      react: <FullBreakdown
        customContent={customContent}
        customerName={customerName}
        userExtWarr={userExtWarr}
        model2={model2}
        userEmail={userEmail}
        userPhone={userPhone}
        userFname={userFname}

        onTax={total}
        weekly={weeklylNat}
        biweekly={biweeklNat}
        monthly={nat60}

        dealer={dealer}
        deposit={deposit}
        months={months}
        brand={brand}
        userServicespkg={userServicespkg}
        vinE={vinE}
        rustProofing={rustProofing}
        userGap={userGap}
        userLoanProt={userLoanProt}
        userTireandRim={userTireandRim}
        userOther={userOther}
        model={model}
        modelCode={modelCode}
        stockNum={stockNum}
        year={year}
        pdi={pdi}
        msrp={msrp}
        admin={admin}
        commodity={commodity}
        accessories={accessories}
        labour={labour}
        tradeValue={tradeValue}
        licensing={licensing}
        total={total}
        painPrem={painPrem}
        userAirTax={userAirTax}
        userDemo={userDemo}
        userMarketAdj={userMarketAdj}
        userGasOnDel={userGasOnDel}
        destinationCharge={destinationCharge}
        userFinance={userFinance}
        userGovern={userGovern}
        userTireTax={userTireTax}
        discount={discount}
        discountPer={discountPer}
        url={url}
      />
    })
    console.log('wBreakdown sent')
    return json({ 'email sent': data, finance, user, status: { code: 204, message: 'Email sent successfully!' } })
  }

  // 27 wSpecNoTax

  else if (formPayload.emailType === 'wSpecNoTax') {
    const data = await resend.emails.send({
      from: `${userFname} <admin@dealersalesassistant.ca>`,
      to: `${custEmail}`,
      subject: `${finance.brand} ${model2} model information.`,
      bcc: `${userEmail}`,
      react: <WPdf
        customContent={customContent}
        customerName={customerName}
        userExtWarr={userExtWarr}
        model2={model2}
        userEmail={userEmail}
        userPhone={userPhone}
        userFname={userFname}
        onTax={total}
        weekly={weeklylNat}
        biweekly={biweeklNat}
        monthly={nat60}
        dealer={dealer}
        deposit={deposit}
        months={months}

        brand={brand}
        userServicespkg={userServicespkg}
        vinE={vinE}
        rustProofing={rustProofing}
        userGap={userGap}
        userLoanProt={userLoanProt}
        userTireandRim={userTireandRim}
        userOther={userOther}
        model={model}
        modelCode={modelCode}
        stockNum={stockNum}
        year={year}
        pdi={pdi}
        msrp={msrp}
        admin={admin}
        commodity={commodity}
        accessories={accessories}
        labour={labour}
        tradeValue={tradeValue}
        licensing={licensing}
        total={total}
        painPrem={painPrem}
        userAirTax={userAirTax}
        userDemo={userDemo}
        userMarketAdj={userMarketAdj}
        userGasOnDel={userGasOnDel}
        destinationCharge={destinationCharge}
        userFinance={userFinance}
        userGovern={userGovern}
        userTireTax={userTireTax}
        discount={discount}
        discountPer={discountPer}
        url={url}
      />
    })
    console.log('wBreakdown sent')
    return json({ 'email sent': data, finance, user, status: { code: 204, message: 'Email sent successfully!' } })
  }
  // 28 wOptionsNoTax
  else if (formPayload.emailType === 'wOptionsNoTax') {
    const data = await resend.emails.send({
      from: `${userFname} <admin@dealersalesassistant.ca>`,
      to: `${custEmail}`,
      subject: `${finance.brand} ${model2} model information.`,
      bcc: `${userEmail}`,
      react: <Payments
        customContent={customContent}
        customerName={customerName}
        model2={model2}
        custEmail={custEmail}
        userEmail={userEmail}
        userFname={userFname}

        weekly={weeklylNatWOptions}
        biweekly={biweeklNatWOptions}
        monthly={nat60WOptions}


        brand={brand}
        months={months}

        dealer={dealer}
        deposit={deposit}
        userPhone={userPhone}
      />
    });

    console.log('just paymets sent')
    return json({ 'email sent': data, finance, user, status: { code: 204, message: 'Email sent successfully!' } })
  }

  // 29  optionsWBreakdownNoTax

  else if (formPayload.emailType === 'optionsWBreakdownNoTax') {
    const data = await resend.emails.send({
      from: `${userFname} <admin@dealersalesassistant.ca>`,
      to: `${custEmail}`,
      subject: `${finance.brand} ${model2} model information.`,
      bcc: `${userEmail}`,
      react: <OptionsWBreakdown
        customContent={customContent}
        customerName={customerName}
        userExtWarr={userExtWarr}
        model2={model2}
        userEmail={userEmail}
        userPhone={userPhone}
        userFname={userFname}

        weekly={weeklylNatWOptions}
        biweekly={biweeklNatWOptions}
        monthly={nat60WOptions}
        onTax={totalWithOptions}
        total={totalWithOptions}

        dealer={dealer}
        deposit={deposit}
        months={months}
        brand={brand}
        userServicespkg={userServicespkg}
        vinE={vinE}
        rustProofing={rustProofing}
        userGap={userGap}
        userLoanProt={userLoanProt}
        userTireandRim={userTireandRim}
        userOther={userOther}
        model={model}
        modelCode={modelCode}
        stockNum={stockNum}
        year={year}
        pdi={pdi}
        msrp={msrp}
        admin={admin}
        commodity={commodity}
        accessories={accessories}
        labour={labour}
        tradeValue={tradeValue}
        licensing={licensing}
        painPrem={painPrem}
        userAirTax={userAirTax}
        userDemo={userDemo}
        userMarketAdj={userMarketAdj}
        userGasOnDel={userGasOnDel}
        destinationCharge={destinationCharge}
        userFinance={userFinance}
        userGovern={userGovern}
        userTireTax={userTireTax}
        discount={discount}
        discountPer={discountPer}
        url={url}
      />
    })
    console.log('optionsWBreakdown sent')
    return json({ 'email sent': data, finance, user, status: { code: 204, message: 'Email sent successfully!' } })
  }

  // 30optionsWSpecNoTax

  else if (formPayload.emailType === 'optionsWSpecNoTax') {
    const data = await resend.emails.send({
      from: `${userFname} <admin@dealersalesassistant.ca>`,
      to: `${custEmail}`,
      subject: `${finance.brand} ${model2} model information.`,
      bcc: `${userEmail}`,
      react: <OptionsWSpec
        customContent={customContent}
        customerName={customerName}
        userExtWarr={userExtWarr}
        model2={model2}
        userEmail={userEmail}
        userPhone={userPhone}
        userFname={userFname}


        total={totalWithOptions}
        onTax={totalWithOptions}
        weekly={weeklylNatWOptions}
        biweekly={biweeklNatWOptions}
        monthly={nat60WOptions}



        dealer={dealer}
        deposit={deposit}
        months={months}

        brand={brand}
        userServicespkg={userServicespkg}
        vinE={vinE}
        rustProofing={rustProofing}
        userGap={userGap}
        userLoanProt={userLoanProt}
        userTireandRim={userTireandRim}
        userOther={userOther}
        model={model}
        modelCode={modelCode}
        stockNum={stockNum}
        year={year}
        pdi={pdi}
        msrp={msrp}
        admin={admin}
        commodity={commodity}
        accessories={accessories}
        labour={labour}
        tradeValue={tradeValue}
        licensing={licensing}

        painPrem={painPrem}
        userAirTax={userAirTax}
        userDemo={userDemo}
        userMarketAdj={userMarketAdj}
        userGasOnDel={userGasOnDel}
        destinationCharge={destinationCharge}
        userFinance={userFinance}
        userGovern={userGovern}
        userTireTax={userTireTax}
        discount={discount}
        discountPer={discountPer}
        url={url}
      />
    })
    console.log('just paymets sent')
    return json({ 'email sent': data, finance, user, status: { code: 204, message: 'Email sent successfully!' } })
  }
  // 31 paymentsCustom

  else if (formPayload.emailType === 'paymentsCustom') {
    const data = await resend.emails.send({
      from: `${userFname} <admin@dealersalesassistant.ca>`,
      to: `${custEmail}`,
      subject: `${finance.brand} ${model2} model information.`,
      bcc: `${userEmail}`,
      react: <Payments
        customContent={customContent}
        customerName={customerName}
        model2={model2}
        custEmail={custEmail}
        userEmail={userEmail}
        userFname={userFname}

        biweekly={biweekOth}
        weekly={weeklyOth}
        monthly={oth60}


        brand={brand}
        months={months}

        dealer={dealer}
        deposit={deposit}
        userPhone={userPhone}
      />
    });

    console.log('just paymets sent')
    return json({ 'email sent': data, finance, user, status: { code: 204, message: 'Email sent successfully!' } })
  }

  // 32 wBreakdownCustom

  else if (formPayload.emailType === 'wBreakdownCustom') {
    const data = await resend.emails.send({
      from: `${userFname} <admin@dealersalesassistant.ca>`,
      to: `${custEmail}`,
      subject: `${finance.brand} ${model2} model information.`,
      bcc: `${userEmail}`,
      react: <FullBreakdown
        customContent={customContent}
        customerName={customerName}
        userExtWarr={userExtWarr}
        model2={model2}
        userEmail={userEmail}
        userPhone={userPhone}
        userFname={userFname}

        onTax={total}
        weekly={weeklylNat}
        biweekly={biweeklNat}
        monthly={nat60}

        dealer={dealer}
        deposit={deposit}
        months={months}
        brand={brand}
        userServicespkg={userServicespkg}
        vinE={vinE}
        rustProofing={rustProofing}
        userGap={userGap}
        userLoanProt={userLoanProt}
        userTireandRim={userTireandRim}
        userOther={userOther}
        model={model}
        modelCode={modelCode}
        stockNum={stockNum}
        year={year}
        pdi={pdi}
        msrp={msrp}
        admin={admin}
        commodity={commodity}
        accessories={accessories}
        labour={labour}
        tradeValue={tradeValue}
        licensing={licensing}
        total={total}
        painPrem={painPrem}
        userAirTax={userAirTax}
        userDemo={userDemo}
        userMarketAdj={userMarketAdj}
        userGasOnDel={userGasOnDel}
        destinationCharge={destinationCharge}
        userFinance={userFinance}
        userGovern={userGovern}
        userTireTax={userTireTax}
        discount={discount}
        discountPer={discountPer}
        url={url}
      />
    })
    console.log('wBreakdown sent')
    return json({ 'email sent': data, finance, user, status: { code: 204, message: 'Email sent successfully!' } })
  }

  // 33 wSpecCustom


  else if (formPayload.emailType === 'wSpecCustom') {
    const data = await resend.emails.send({
      from: `${userFname} <admin@dealersalesassistant.ca>`,
      to: `${custEmail}`,
      subject: `${finance.brand} ${model2} model information.`,
      bcc: `${userEmail}`,
      react: <WPdf
        customContent={customContent}
        customerName={customerName}
        userExtWarr={userExtWarr}
        model2={model2}
        userEmail={userEmail}
        userPhone={userPhone}
        userFname={userFname}

        onTax={total}
        weekly={weeklylNat}
        biweekly={biweeklNat}
        monthly={nat60}


        dealer={dealer}
        deposit={deposit}
        months={months}

        brand={brand}
        userServicespkg={userServicespkg}
        vinE={vinE}
        rustProofing={rustProofing}
        userGap={userGap}
        userLoanProt={userLoanProt}
        userTireandRim={userTireandRim}
        userOther={userOther}
        model={model}
        modelCode={modelCode}
        stockNum={stockNum}
        year={year}
        pdi={pdi}
        msrp={msrp}
        admin={admin}
        commodity={commodity}
        accessories={accessories}
        labour={labour}
        tradeValue={tradeValue}
        licensing={licensing}
        total={total}
        painPrem={painPrem}
        userAirTax={userAirTax}
        userDemo={userDemo}
        userMarketAdj={userMarketAdj}
        userGasOnDel={userGasOnDel}
        destinationCharge={destinationCharge}
        userFinance={userFinance}
        userGovern={userGovern}
        userTireTax={userTireTax}
        discount={discount}
        discountPer={discountPer}
        url={url}
      />
    })
    console.log('wBreakdown sent')
    return json({ 'email sent': data, finance, user, status: { code: 204, message: 'Email sent successfully!' } })
  }

  // 34 wOptionsCustom


  else if (formPayload.emailType === 'wOptionsCustom') {
    const data = await resend.emails.send({
      from: `${userFname} <admin@dealersalesassistant.ca>`,
      to: `${custEmail}`,
      subject: `${finance.brand} ${model2} model information.`,
      bcc: `${userEmail}`,
      react: <TempOptions
        customerName={customerName}
        model2={model2}
        custEmail={custEmail}
        userEmail={userEmail}
        userFname={userFname}

        weekly={weeklyOthWOptions}
        biweekly={biweekOthWOptions}
        monthly={oth60WOptions}


        brand={brand}
        months={months}

        dealer={dealer}
        deposit={deposit}
        userPhone={userPhone}
      />
    });

    console.log('wOptionsCustom sent')
    return json({ 'email sent': data, finance, user, status: { code: 204, message: 'Email sent successfully!' } })
  }


  // 35 optionsWBreakdownCustom

  else if (formPayload.emailType === 'optionsWBreakdownCustom') {
    const data = await resend.emails.send({
      from: `${userFname} <admin@dealersalesassistant.ca>`,
      to: `${custEmail}`,
      subject: `${finance.brand} ${model2} model information.`,
      bcc: `${userEmail}`,
      react: <FullBreakdown
        customContent={customContent}
        customerName={customerName}
        userExtWarr={userExtWarr}
        model2={model2}
        userEmail={userEmail}
        userPhone={userPhone}
        userFname={userFname}

        onTax={otherTaxWithOptions}
        weekly={weeklyOthWOptions}
        biweekly={biweekOthWOptions}
        monthly={oth60WOptions}
        total={totalWithOptions}

        dealer={dealer}
        deposit={deposit}
        months={months}
        brand={brand}
        userServicespkg={userServicespkg}
        vinE={vinE}
        rustProofing={rustProofing}
        userGap={userGap}
        userLoanProt={userLoanProt}
        userTireandRim={userTireandRim}
        userOther={userOther}
        model={model}
        modelCode={modelCode}
        stockNum={stockNum}
        year={year}
        pdi={pdi}
        msrp={msrp}
        admin={admin}
        commodity={commodity}
        accessories={accessories}
        labour={labour}
        tradeValue={tradeValue}
        licensing={licensing}

        painPrem={painPrem}
        userAirTax={userAirTax}
        userDemo={userDemo}
        userMarketAdj={userMarketAdj}
        userGasOnDel={userGasOnDel}
        destinationCharge={destinationCharge}
        userFinance={userFinance}
        userGovern={userGovern}
        userTireTax={userTireTax}
        discount={discount}
        discountPer={discountPer}
        url={url}
      />
    })
    console.log('wBreakdown sent')
    return json({ 'email sent': data, finance, user, status: { code: 204, message: 'Email sent successfully!' } })
  }
  //36  optionsWSpecCustom

  else if (formPayload.emailType === 'optionsWSpecCustom') {
    const data = await resend.emails.send({
      from: `${userFname} <admin@dealersalesassistant.ca>`,
      to: `${custEmail}`,
      subject: `${finance.brand} ${model2} model information.`,
      bcc: `${userEmail}`,
      react: <OptionsWSpec
        customContent={customContent}
        customerName={customerName}
        userExtWarr={userExtWarr}
        model2={model2}
        userEmail={userEmail}
        userPhone={userPhone}
        userFname={userFname}
        dealer={dealer}
        deposit={deposit}
        months={months}
        brand={brand}
        userServicespkg={userServicespkg}
        vinE={vinE}
        rustProofing={rustProofing}
        userGap={userGap}
        userLoanProt={userLoanProt}
        userTireandRim={userTireandRim}
        userOther={userOther}
        model={model}
        modelCode={modelCode}
        stockNum={stockNum}
        year={year}
        pdi={pdi}
        msrp={msrp}
        admin={admin}
        commodity={commodity}
        accessories={accessories}
        labour={labour}
        tradeValue={tradeValue}
        licensing={licensing}
        painPrem={painPrem}
        userAirTax={userAirTax}
        userDemo={userDemo}
        userMarketAdj={userMarketAdj}
        userGasOnDel={userGasOnDel}
        destinationCharge={destinationCharge}
        userFinance={userFinance}
        userGovern={userGovern}
        userTireTax={userTireTax}
        discount={discount}
        discountPer={discountPer}
        url={url}

        onTax={otherTaxWithOptions}
        weekly={weeklyOthWOptions}
        biweekly={biweekOthWOptions}
        monthly={oth60WOptions}
        total={totalWithOptions}

      />
    })
    console.log('optionsWSpecCustom sent')
    return json({ 'email sent': data, finance, user, status: { code: 204, message: 'Email sent successfully!' } })
  }

}
export async function ComsCount(financeId, commType) {
  const record = await prisma.communications.findUnique({
    where: { financeId: financeId },
  });
  if (record) {
    await prisma.communications.update({
      where: { financeId: financeId },
      data: { [commType]: record[commType] + 1 },
    });
  } else {
    await prisma.communications.create({
      data: { financeId: financeId, [commType]: 1 },
    });
  }
  return json({ ok: true });
}

export const action: ActionFunction = async ({
  req,
  request,
  params,
}) => {
  const formDataObj = await request.formData();
  console.log(formDataObj, 'formDataObj')
  const formPayload = {};
  for (let key of formDataObj.keys()) {
    formPayload[key] = formDataObj.get(key);
  }
  let formData = financeFormSchema.parse(formPayload);
  const userSession = await getSession(request.headers.get("Cookie"));

  if (!userSession) { return json({ status: 302, redirect: '/login' }); };

  const email = userSession.get("email")

  const user = await GetUser(email)
  if (!user) { return json({ status: 302, redirect: '/login' }) };
  console.log(user, 'email')
  const userId = user?.id;
  const intent = formPayload.intent;
  const template = formPayload.template;
  console.log(formData, 'formData dashboardcalls')
  const today = new Date();
  const date = new Date().toISOString()
  const financeId = formData?.financeId;
  console.log('financeId:', financeId, 'financeId');  // Add this line
  let pickUpDate;
  if (pickUpDate === null || pickUpDate === undefined) {
    pickUpDate = "To Be Det.";
  }
  //const dashboardId = formData?.dashboard
  const id = formData?.id;
  // console.log(financeId, 'financeId', id, 'id', clientfileId, 'clientfileId',)

  //. create email template
  if (intent === 'uploadFile') {
    console.log('uploadFile')
    const uploadAction = await UploadFileAction({ request })
    return uploadAction
  }
  // calls
  if (intent === "EmailClient") {
    console.log(user.email, 'formData.email')
    const comdata = {
      financeId: formData.financeId,
      userEmail: user?.email,
      content: formData.customContent,
      title: formData.subject,
      direction: formData.direction,
      result: formData.customerState,
      subject: formData.subject,
      type: 'Email',
      userName: user?.name,
      date: new Date().toISOString(),
    }
    // const completeApt = await CompleteLastAppt(userId, financeId)
    const sendEmail = await EmailFunction(request, params, user, financeId, formPayload)
    const setComs = await prisma.communicationsOverview.create({ data: comdata, });
    const saveComms = await ComsCount(financeId, 'Email')

    return json({ saveComms, sendEmail, formData, setComs, })
  }
  if (template === "createEmailTemplate") {
    console.log('hit email template crewator')
    const data = {
      name: 'Template from email client',
      body: formData.customContent,
      date: date,
      title: 'Template from email client',
      category: 'New template',
      userEmail: formData.userEmail,
      review: formData.review,
      attachments: formData.attachments,
      label: 'Template from email client',
      dept: 'Sales',
      type: 'Email',
      subject: formData.subject,
      cc: formData.cc,
      bcc: formData.bcc,
    };
    const template = await templateServer(id, data, intent,);
    console.log('create template')

    return json({ template });
  }
  if (intent === 'PhoneCall') {
    const textfollowUpDay = formData.followUpDay2
    const comdata = {
      financeId: formData.financeId,
      userId: formData.userId,
      content: formData.note,
      title: formData.title,
      direction: formData.direction,
      result: formData.resultOfcall,
      subject: formData.messageContent,
      type: 'Text',
      userName: user?.name,
      date: new Date().toISOString(),
    }
    const completeApt = await getLastAppointmentForFinance(financeId);

    const doTGwoDays = await TwoDays(textfollowUpDay)
    const setComs = await CreateCommunications(comdata)
    console.log('textQuickFU', setComs)
    return json({ doTGwoDays, completeApt, setComs });
  }
  if (intent === 'textQuickFU') {
    const followUpDay3 = formData.followUpDay


    const completeApt = await getLastAppointmentForFinance(financeId);

    const doTGwoDays = await TwoDays(followUpDay3, formData, financeId, user)
    // const setComs = await CreateCommunications(comdata)
    const comdata = {
      financeId: formData.financeId,
      userId: formData.userId,
      content: formData.note,
      title: formData.title,
      direction: formData.direction,
      result: formData.resultOfcall,
      subject: formData.messageContent,
      type: 'Text',
      userName: user?.name,
      date: new Date().toISOString(),
    }
    const setComs = await prisma.communicationsOverview.create({
      data: comdata,
    });
    console.log('textQuickFU', setComs)
    return json({ doTGwoDays, completeApt, setComs });
  }
  return null;
};
