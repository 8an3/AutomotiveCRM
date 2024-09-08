import financeFormSchema from '~/overviewUtils/financeFormSchema';
import { type DataFunctionArgs, type V2_MetaFunction, type ActionFunction, json, redirect, type ActionArgs, LoaderFunction } from '@remix-run/node'
import { createFinance, createFinanceManitou, createBMWOptions, createBMWOptions2, createClientFileRecord, financeWithDashboard, } from "~/utils/finance/create.server";
import { financeIdLoader, overviewLoader } from "./overviewActions";
import { DataForm } from '../dashboard/calls/actions/dbData';
import { findQuoteById, } from "~/utils/finance/get.server";
import { QuoteServer, QuoteServerActivix } from '~/utils/quote/quote.server';
import { GetUser } from "~/utils/loader.server";
import { prisma } from "~/libs";
import { commitSession as commitPref, getSession as getPref } from "~/utils/pref.server";
import { getSession } from '~/sessions/auth-session.server';
import { getSession as custSession, commitSession as custCommit } from '~/sessions/customer-session.server';
import { UpdateLead, CreateVehicle } from '~/routes/__authorized/dealer/api/activix';
import { getSession as sixSession, commitSession as sixCommit, destroySession } from '~/utils/misc.user.server'

export function invariant(
  condition: any,
  message: string | (() => string),
): asserts condition {
  if (!condition) {
    throw new Error(typeof message === 'function' ? message() : message)
  }
}

export async function quoteAction({ params, request }: ActionArgs) {

  const urlSegments = new URL(request.url).pathname.split('/');
  //const { financeId } = params;
  const brandId = params.brandId

  let formPayload = Object.fromEntries(await request.formData());
  const name = formPayload.firstName + ' ' + formPayload.lastName
  const status = 'Active'
  formPayload = { ...formPayload, name, status }
  const formData = financeFormSchema.parse(formPayload)
  console.log(formData, '2354234532')
  let financeId
  if (formData.activixId && (formData.financeId.length > 20)) {
    financeId = formData.financeId
  } else {
    financeId = urlSegments[urlSegments.length - 1]
  }
  const today = new Date()
  const phone = "+1" + formPayload.phone;
  const phoneRegex = /^\+1\d{3}\d{7}$/; // Regex pattern to match +1 followed by 3-digit area code and 7 more digits

  const errors = {
    firstName: formPayload.firstName ? null : "First name is required...",
    lastName: formPayload.lastName ? null : "Last name is required...",
    email: formPayload.email ? null : "Email is required...",
    model: formPayload.model ? null : "Model is required...",
    phone: phoneRegex.test(phone) ? null : "Phone must be in the format +14164164164", // Add phone validation using regex
  };
  const hasErrors = Object.values(errors).some((errorMessage) => errorMessage);
  if (hasErrors) {
    return json(errors);
  }

  invariant(typeof formPayload.firstName === "string", "First Name must be a string");
  invariant(typeof formPayload.lastName === "string", "Last Name must be a string");
  invariant(typeof formPayload.email === "string", "Email must be a string");
  invariant(typeof formPayload.model === "string", "Model must be a string");
  invariant(typeof phone === "string", "Phone must be a string");
  const session2 = await getSession(request.headers.get("Cookie"));
  const userEmail = session2.get("email")
  const email = userEmail
  const user = await prisma.user.findUnique({ where: { email: userEmail } });

  const referer = request.headers.get('Referer');

  if (formData.activixRoute === 'yes') {// if (referer === 'http://localhost:3000/leads/activix' && formData.activixId && (formData.financeId.length > 20)) {
    const formData = financeFormSchema.parse(formPayload)
    const userId = user?.id;
    const clientfileId = formData.clientfileId
    const dashbaordId = formData.dashboardId
    const session66 = await sixSession(request.headers.get("Cookie"));
    session66.set("financeId", financeId);
    session66.set("clientfileId", clientfileId);
    const serializedSession = await sixCommit(session66);

    const lastContact = new Date().toISOString();
    const today = new Date()
    //formData = { ...formData, lastContact, pickUpDate: 'TBD', }
    const updateActivix = await UpdateLead(formData)
    const createVehicle = await CreateVehicle(formData)
    console.log(updateActivix, 'updateActivix')
    console.log(formData, 'formdata from overview')
    const brand = formData.brand

    const finance = await prisma.finance.update({
      where: { id: formData.financeId },
      data: {
        clientfileId: formData.clientfileId,
        dashboardId: formData.dashboardId,
        financeId: formData.financeId,
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        name: formData.name,
        address: formData.address,
        city: formData.city,
        postal: formData.postal,
        province: formData.province,
        dl: formData.dl,
        typeOfContact: formData.typeOfContact,
        timeToContact: formData.timeToContact,
        iRate: formData.iRate,
        months: formData.months,
        discount: formData.discount,
        total: formData.total,
        onTax: formData.onTax,
        on60: formData.on60,
        biweekly: formData.biweekly,
        weekly: formData.weekly,
        weeklyOth: formData.weeklyOth,
        biweekOth: formData.biweekOth,
        oth60: formData.oth60,
        weeklyqc: formData.weeklyqc,
        biweeklyqc: formData.biweeklyqc,
        qc60: formData.qc60,
        deposit: formData.deposit,
        biweeklNatWOptions: formData.biweeklNatWOptions,
        weeklylNatWOptions: formData.weeklylNatWOptions,
        nat60WOptions: formData.nat60WOptions,
        weeklyOthWOptions: formData.weeklyOthWOptions,
        biweekOthWOptions: formData.biweekOthWOptions,
        oth60WOptions: formData.oth60WOptions,
        biweeklNat: formData.biweeklNat,
        weeklylNat: formData.weeklylNat,
        nat60: formData.nat60,
        qcTax: formData.qcTax,
        otherTax: formData.otherTax,
        totalWithOptions: formData.totalWithOptions,
        otherTaxWithOptions: formData.otherTaxWithOptions,
        desiredPayments: formData.desiredPayments,
        freight: formData.freight,
        admin: formData.admin,
        commodity: formData.commodity,
        pdi: formData.pdi,
        discountPer: formData.discountPer,
        userLoanProt: formData.userLoanProt,
        userTireandRim: formData.userTireandRim,
        userGap: formData.userGap,
        userExtWarr: formData.userExtWarr,
        userServicespkg: formData.userServicespkg,
        deliveryCharge: formData.deliveryCharge,
        vinE: formData.vinE,
        lifeDisability: formData.lifeDisability,
        rustProofing: formData.rustProofing,
        userOther: formData.userOther,
        paintPrem: formData.paintPrem,
        licensing: formData.licensing,
        stockNum: formData.stockNum,
        options: formData.options,
        accessories: formData.accessories,
        labour: formData.labour,
        year: formData.year,
        brand: formData.brand,
        model: formData.model,
        model1: formData.model1,
        color: formData.color,
        modelCode: formData.modelCode,
        msrp: formData.msrp,
        userEmail: user.email,
        tradeValue: formData.tradeValue,
        tradeDesc: formData.tradeDesc,
        tradeColor: formData.tradeColor,
        tradeYear: formData.tradeYear,
        tradeMake: formData.tradeMake,
        tradeVin: formData.tradeVin,
        tradeTrim: formData.tradeTrim,
        tradeMileage: formData.tradeMileage,
        trim: formData.trim,
        vin: formData.vin,
        lien: formData.lien,
        lastContact: today.toISOString(),
        referral: 'off',
        visited: 'off',
        bookedApt: 'off',
        aptShowed: 'off',
        aptNoShowed: 'off',
        testDrive: 'off',
        metService: 'off',
        metManager: 'off',
        metParts: 'off',
        sold: 'off',
        depositMade: 'off',
        refund: 'off',
        turnOver: 'off',
        financeApp: 'off',
        approved: 'off',
        signed: 'off',
        pickUpSet: 'off',
        demoed: 'off',
        delivered: 'off',
        notes: 'off',
        metSalesperson: 'off',
        metFinance: 'off',
        financeApplication: 'off',
        pickUpTime: 'off',
        depositTakenDate: 'off',
        docsSigned: 'off',
        tradeRepairs: 'off',
        seenTrade: 'off',
        lastNote: 'off',
        dLCopy: 'off',
        insCopy: 'off',
        testDrForm: 'off',
        voidChq: 'off',
        loanOther: 'off',
        signBill: 'off',
        ucda: 'off',
        tradeInsp: 'off',
        customerWS: 'off',
        otherDocs: 'off',
        urgentFinanceNote: 'off',
        funded: 'off',
        status: 'Active',
        result: formData.result,
        customerState: formData.customerState,
        timesContacted: formData.timesContacted,
        visits: formData.visits,
        progress: formData.progress,
      },
    });

    return json({ finance, updateActivix }, redirect(`/dealer/sales/overview/${brand}`), { headers: { "Set-Cookie": serializedSession, } }
    );

  } else {
    console.log('less than 20')
    const brand = formData.brand
    const activixActivated = user?.activixActivated
    let { financeId, clientData, dashData, financeData } = DataForm(formData);
    if (activixActivated === 'yes') {
      await QuoteServerActivix(clientData, financeId, email, financeData, dashData)
    }
    try {
      const clientfileUpdate = await prisma.clientfile.findUnique({
        where: { email: formData.email },
      });

      const options = {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      };

      if (clientfileUpdate) {
        console.log('has clientfile')
        const finance = await prisma.finance.create({
          data: {
            clientfileId: clientfileUpdate.id,

            lastContact: today.toLocaleDateString('en-US', options),
            nextAppointment: 'TBD',
            referral: 'off',
            visited: 'off',
            bookedApt: 'off',
            aptShowed: 'off',
            aptNoShowed: 'off',
            testDrive: 'off',
            metService: 'off',
            metManager: 'off',
            metParts: 'off',
            sold: 'off',
            depositMade: 'off',
            refund: 'off',
            turnOver: 'off',
            financeApp: 'off',
            approved: 'off',
            signed: 'off',
            pickUpSet: 'off',
            demoed: 'off',
            delivered: 'off',
            notes: 'off',
            metSalesperson: 'off',
            metFinance: 'off',
            financeApplication: 'off',
            pickUpTime: 'off',
            depositTakenDate: 'off',
            docsSigned: 'off',
            tradeRepairs: 'off',
            seenTrade: 'off',
            lastNote: 'off',
            dLCopy: 'off',
            insCopy: 'off',
            testDrForm: 'off',
            voidChq: 'off',
            loanOther: 'off',
            signBill: 'off',
            ucda: 'off',
            tradeInsp: 'off',
            customerWS: 'off',
            otherDocs: 'off',
            urgentFinanceNote: 'off',
            funded: 'off',
            status: 'Active',
            followUpDay: 'TBD',
            deliveredDate: 'TBD',
            pickUpDate: 'TBD',
            email: formData.email,
            firstName: formData.firstName,
            mileage: formData.mileage,
            lastName: formData.lastName,
            phone: formData.phone,
            name: formData.name,
            address: formData.address,
            city: formData.city,
            postal: formData.postal,
            province: formData.province,
            dl: formData.dl,
            typeOfContact: formData.typeOfContact,
            timeToContact: formData.timeToContact,
            iRate: formData.iRate,
            months: formData.months,
            discount: formData.discount,
            total: formData.total,
            onTax: formData.onTax,
            on60: formData.on60,
            biweekly: formData.biweekly,
            weekly: formData.weekly,
            weeklyOth: formData.weeklyOth,
            biweekOth: formData.biweekOth,
            oth60: formData.oth60,
            weeklyqc: formData.weeklyqc,
            biweeklyqc: formData.biweeklyqc,
            qc60: formData.qc60,
            deposit: formData.deposit,
            biweeklNatWOptions: formData.biweeklNatWOptions,
            weeklylNatWOptions: formData.weeklylNatWOptions,
            nat60WOptions: formData.nat60WOptions,
            weeklyOthWOptions: formData.weeklyOthWOptions,
            biweekOthWOptions: formData.biweekOthWOptions,
            oth60WOptions: formData.oth60WOptions,
            biweeklNat: formData.biweeklNat,
            weeklylNat: formData.weeklylNat,
            nat60: formData.nat60,
            qcTax: formData.qcTax,
            otherTax: formData.otherTax,
            totalWithOptions: formData.totalWithOptions,
            otherTaxWithOptions: formData.otherTaxWithOptions,
            desiredPayments: formData.desiredPayments,
            freight: formData.freight,
            admin: formData.admin,
            commodity: formData.commodity,
            pdi: formData.pdi,
            discountPer: formData.discountPer,
            userLoanProt: formData.userLoanProt,
            userTireandRim: formData.userTireandRim,
            userGap: formData.userGap,
            userExtWarr: formData.userExtWarr,
            userServicespkg: formData.userServicespkg,
            deliveryCharge: formData.deliveryCharge,
            vinE: formData.vinE,
            lifeDisability: formData.lifeDisability,
            rustProofing: formData.rustProofing,
            userOther: formData.userOther,
            paintPrem: formData.paintPrem,
            licensing: formData.licensing,
            stockNum: formData.stockNum,
            options: formData.options,
            accessories: formData.accessories,
            labour: formData.labour,
            year: formData.year,
            brand: formData.brand,
            model: formData.model,
            model1: formData.model1,
            color: formData.color,
            modelCode: formData.modelCode,
            msrp: formData.msrp,
            userEmail: formData.userEmail,
            tradeValue: formData.tradeValue,
            tradeDesc: formData.tradeDesc,
            tradeColor: formData.tradeColor,
            tradeYear: formData.tradeYear,
            tradeMake: formData.tradeMake,
            tradeVin: formData.tradeVin,
            tradeTrim: formData.tradeTrim,
            tradeMileage: formData.tradeMileage,
            tradeLocation: formData.tradeLocation,
            trim: formData.trim,
            vin: formData.vin,
            leadNote: formData.leadNote,
            sendToFinanceNow: formData.sendToFinanceNow,
            dealNumber: formData.dealNumber,
            bikeStatus: formData.bikeStatus,
            lien: formData.lien,
            dob: formData.dob,
            othTax: formData.othTax,
            optionsTotal: formData.optionsTotal,
            lienPayout: formData.lienPayout,
            customerState: formData.customerState,
            result: formData.result,
            timesContacted: formData.timesContacted,
            visits: formData.visits,
            progress: formData.progress,
            applicationDone: formData.applicationDone,
            licensingSent: formData.licensingSent,
            liceningDone: formData.liceningDone,
            refunded: formData.refunded,
            cancelled: formData.cancelled,
            lost: formData.lost,
            leadSource: formData.leadSource,
          },
        });
        const customerSession = await custSession(request.headers.get("Cookie"));
        customerSession.set("userEmail", email);
        customerSession.set("financeId", finance.id);
        await commitPref(customerSession);
        const headers = { "Set-Cookie": await custCommit(customerSession) };

        switch (formData.brand) {
          case "Used":
            return json({ finance }), redirect(`/dealer/sales/overview/Used`, { headers });
          case "Switch":
            await createFinanceManitou(formData);
            return json({ finance }), redirect(`/dealer/sales/options/${formData.brand}`, { headers });
          case "Manitou":
            await createFinanceManitou(formData);
            return json({ finance }), redirect(`/dealer/sales/options/${formData.brand}`, { headers });
          case "BMW-Motorrad":
            await createBMWOptions(formData);
            return json({ finance }), redirect(`/dealer/sales/options/${formData.brand}`, { headers });
          default:
            return json({ finance }), redirect(`/dealer/sales/overview/${formData.brand}`, { headers });
        }
      } else {
        console.log('does not has clientfile')

        const clientfile = await prisma.clientfile.create({
          data: {
            userId: formData.userId,
            firstName: formData.firstName,
            lastName: formData.lastName,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            postal: formData.postal,
            province: formData.province,
          },
        });

        const finance = await prisma.finance.create({
          data: {
            clientfileId: clientfile.id,
            lastContact: today.toLocaleDateString('en-US', options),
            nextAppointment: 'TBD',
            status: 'Active',
            followUpDay: 'TBD',
            email: formData.email,
            firstName: formData.firstName,
            mileage: formData.mileage,
            lastName: formData.lastName,
            phone: formData.phone,
            name: formData.name,
            address: formData.address,
            city: formData.city,
            postal: formData.postal,
            province: formData.province,
            dl: formData.dl,
            typeOfContact: formData.typeOfContact,
            timeToContact: formData.timeToContact,
            iRate: formData.iRate,
            months: formData.months,
            discount: formData.discount,
            total: formData.total,
            onTax: formData.onTax,
            on60: formData.on60,
            biweekly: formData.biweekly,
            weekly: formData.weekly,
            weeklyOth: formData.weeklyOth,
            biweekOth: formData.biweekOth,
            oth60: formData.oth60,
            weeklyqc: formData.weeklyqc,
            biweeklyqc: formData.biweeklyqc,
            qc60: formData.qc60,
            deposit: formData.deposit,
            biweeklNatWOptions: formData.biweeklNatWOptions,
            weeklylNatWOptions: formData.weeklylNatWOptions,
            nat60WOptions: formData.nat60WOptions,
            weeklyOthWOptions: formData.weeklyOthWOptions,
            biweekOthWOptions: formData.biweekOthWOptions,
            oth60WOptions: formData.oth60WOptions,
            biweeklNat: formData.biweeklNat,
            weeklylNat: formData.weeklylNat,
            nat60: formData.nat60,
            qcTax: formData.qcTax,
            otherTax: formData.otherTax,
            totalWithOptions: formData.totalWithOptions,
            otherTaxWithOptions: formData.otherTaxWithOptions,
            desiredPayments: formData.desiredPayments,
            freight: formData.freight,
            admin: formData.admin,
            commodity: formData.commodity,
            pdi: formData.pdi,
            discountPer: formData.discountPer,
            userLoanProt: formData.userLoanProt,
            userTireandRim: formData.userTireandRim,
            userGap: formData.userGap,
            userExtWarr: formData.userExtWarr,
            userServicespkg: formData.userServicespkg,
            deliveryCharge: formData.deliveryCharge,
            vinE: formData.vinE,
            lifeDisability: formData.lifeDisability,
            rustProofing: formData.rustProofing,
            userOther: formData.userOther,
            paintPrem: formData.paintPrem,
            licensing: formData.licensing,
            stockNum: formData.stockNum,
            options: formData.options,
            accessories: formData.accessories,
            labour: formData.labour,
            year: formData.year,
            brand: formData.brand,
            model: formData.model,
            model1: formData.model1,
            color: formData.color,
            modelCode: formData.modelCode,
            msrp: formData.msrp,
            userEmail: formData.userEmail,
            tradeValue: formData.tradeValue,
            tradeDesc: formData.tradeDesc,
            tradeColor: formData.tradeColor,
            tradeYear: formData.tradeYear,
            tradeMake: formData.tradeMake,
            tradeVin: formData.tradeVin,
            tradeTrim: formData.tradeTrim,
            tradeMileage: formData.tradeMileage,
            tradeLocation: formData.tradeLocation,
            trim: formData.trim,
            vin: formData.vin,
            leadNote: formData.leadNote,
            sendToFinanceNow: formData.sendToFinanceNow,
            dob: formData.dob,
            othTax: formData.othTax,
            optionsTotal: formData.optionsTotal,
            lienPayout: formData.lienPayout,
            customerState: formData.customerState,
            result: formData.result,
            visits: formData.visits,
            progress: formData.progress,
          },
        });
        const customerSession = await custSession(request.headers.get("Cookie"));
        customerSession.set("userEmail", email);
        customerSession.set("financeId", finance.id);
        await commitPref(customerSession);
        const headers = { "Set-Cookie": await custCommit(customerSession) };

        switch (formData.brand) {
          case "Used":
            return json({ finance }), redirect(`/dealer/sales/overview/Used`, { headers });
          case "Switch":
            await createFinanceManitou(formData);
            return json({ finance }), redirect(`/dealer/sales/options/${formData.brand}`, { headers });
          case "Manitou":
            await createFinanceManitou(formData);
            return json({ finance }), redirect(`/dealer/sales/options/${formData.brand}`, { headers });
          case "BMW-Motorrad":
            await createBMWOptions(formData);
            return json({ finance }), redirect(`/dealer/sales/options/${formData.brand}`, { headers });
          default:
            return json({ finance }), redirect(`/dealer/sales/overview/${formData.brand}`, { headers });
        }
      }
    } catch (error) {
      console.error(error);
      return error;
    }
  }
}
export function quotebrandIdActionLoader({ params, request }: DataFunctionArgs) {
  const { financeId } = params;

  if (financeId) {
    return financeIdLoader({ financeId, request });
  } else {
    return overviewLoader({ request, params });
  }
}
export async function quoteLoader({ request, params }: LoaderFunction) {
  const session2 = await getSession(request.headers.get("Cookie"));
  const email = session2.get("email")
  const user = await GetUser(email)
  if (!user) { redirect('/login') }
  const session = await getPref(request.headers.get("Cookie"));
  const sliderWidth = session.get('sliderWidth')
  const userId = user?.id
  const urlSegments = new URL(request.url).pathname.split('/');
  const financeId = urlSegments[urlSegments.length - 1];
  updateReadStatus();
  if (financeId.length > 2) {
    const finance = await findQuoteById(financeId);
    return json({ ok: true, finance, sliderWidth, financeId, userId, email, user })
  }
  else {
    return json({ ok: true, sliderWidth, userId, email, user })
  }
}


async function updateReadStatus() {
  try {
    // Find listings where read is true and userEmail is 'newelead@newlead.com'
    const listingsToUpdate = await prisma.notificationsUser.findMany({
      where: {
        read: true,
        userEmail: 'newelead@newlead.com',
      },
    });

    // Update the found listings
    const updatePromises = listingsToUpdate.map(listing =>
      prisma.notificationsUser.update({
        where: { id: listing.id },
        data: { read: false },
      })
    );

    // Wait for all updates to complete
    await Promise.all(updatePromises);

    console.log('Successfully updated listings.');
  } catch (error) {
    console.error('Error updating listings:', error);
  } finally {
    await prisma.$disconnect();
  }
}
