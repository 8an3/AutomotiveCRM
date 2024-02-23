import { json, type ActionFunction, type DataFunctionArgs, LoaderFunction, redirect } from '@remix-run/node'
import financeFormSchema from '../../routes/overviewUtils/financeFormSchema';

import { model } from '~/models'
import { getDealerFeesbyEmail } from "~/utils/user.server";
import { getDataKawasaki, getLatestBMWOptions, getLatestBMWOptions2, getDataBmwMoto, getDataByModel, getDataHarley, getDataTriumph, findQuoteById, findDashboardDataById, getDataByModelManitou, getLatestOptionsManitou } from "~/utils/finance/get.server";
import { getLatestFinanceAndDashDataForClientfile } from '~/utils/client/getLatestFinance.server';
import { updateClientfileAndFinanceDashboard } from '~/utils/client/updateDashFinance.server';
import { prisma } from '~/libs';
import { getClientFinanceAndDashData } from '~/utils/client/get.server';
import { DataForm } from '../dashboard/calls/actions/dbData';
import { updateFinanceWithDashboard } from '~/utils/finance/update.server';
import { commitSession as commitPref, getSession as getPref } from "~/utils/pref.server";
import { getSession } from '~/sessions/auth-session.server';
import { SetToken66, requireAuthCookie, SetClient66 } from '~/utils/misc.user.server';
import { X } from 'lucide-react';



export async function overviewLoader({ request, params }: LoaderFunction) {
    const session2 = await getSession(request.headers.get("Cookie"));
    const email = session2.get("email")

    const user = await model.user.query.getForSession({ email: email });
    /// console.log(user, account, 'wquiote loadert')
    if (!user) {
        redirect('/login')
    }

    const userId = user?.id
    let finance = await prisma.finance.findFirst({
        orderBy: {
            createdAt: 'desc',
        },
    });
    const financeId = finance?.id
    //  const { finance, dashboard, clientfile, } = await getClientFinanceAndDashData(financeId)
    const deFees = await getDealerFeesbyEmail(user.email)
    const records = await prisma.inventoryMotorcycle.findMany()

    const session = await getPref(request.headers.get("Cookie"))
    const sliderWidth = session.get('sliderWidth')
    session.set("userId", userId)
    session.set("financeId", financeId)
    await commitPref(session)
    const brand = finance?.brand
    const notifications = await prisma.notificationsUser.findMany({
        where: {
            userId: user.id,
        }
    })
    //   console.log(finance, 'overviewLoader')
    if (brand === 'Manitou') {
        // const { finance, dashboard, clientfile, } = await getClientFinanceAndDashData(financeId)

        const modelData = await getDataByModelManitou(finance);
        const manOptions = await getLatestOptionsManitou(email)
        // console.log(modelData, manOptions)
        return json({ ok: true, modelData, finance, deFees, manOptions, sliderWidth, records, notifications })
    }
    if (brand === 'Switch') {
        const modelData = await getDataByModel(finance);
        const manOptions = await getLatestOptionsManitou(email)
        //  console.log(modelData, manOptions)
        return json({ ok: true, modelData, finance, deFees, manOptions, sliderWidth, records, notifications })
    }
    if (brand === 'Kawasaki') {
        const modelData = await getDataKawasaki(finance);
        return json({ ok: true, modelData, finance, deFees, sliderWidth, records, notifications })
    }
    if (brand === 'BMW-Motorrad') {
        const financeId = finance?.id
        const bmwMoto = await getLatestBMWOptions(financeId)
        const bmwMoto2 = await getLatestBMWOptions2(financeId)
        const modelData = await getDataBmwMoto(finance);
        return json({ ok: true, modelData, finance, deFees, bmwMoto, bmwMoto2, sliderWidth, records, notifications })
    }
    if (brand === 'Triumph') {
        const modelData = await getDataTriumph(finance);
        return json({ ok: true, modelData, finance, deFees, sliderWidth, records, notifications })
    }
    if (brand === 'Harley-Davidson') {
        const modelData = await getDataHarley(finance);
        console.log(modelData, 'modeldata')
        return json({ ok: true, modelData, finance, deFees, sliderWidth, records, notifications })
    }
    else {
        const modelData = await getDataByModel(finance)
        return json({ ok: true, modelData, finance, deFees, sliderWidth, records, notifications })
    }
}

export async function financeIdLoader({ financeId, request }) {
    const session2 = await getSession(request.headers.get("Cookie"));
    const email = session2.get("email")

    const user = await model.user.query.getForSession({ email: email });
    /// console.log(user, account, 'wquiote loadert')
    if (!user) {
        redirect('/login')
    }

    console.log(user, 'email')
    // const userSession = await authenticator.isAuthenticated(request, {  });
    //const user = await model.user.query.getForSession({ id: userSession.id });
    const deFees = await getDealerFeesbyEmail(email)
    const session = await getSession(request.headers.get("Cookie"))
    const sliderWidth = session.get('sliderWidth')
    const finance = await findQuoteById(financeId);
    const dashData = await findDashboardDataById(financeId);
    const brand = finance?.brand

    if (brand === 'Manitou') {
        const modelData = await getDataByModelManitou(finance);
        const manOptions = await getLatestOptionsManitou(email)
        return json({ ok: true, modelData, finance, deFees, manOptions, sliderWidth })
    }
    if (brand === 'Switch') {
        const modelData = await getDataByModel(finance);
        const manOptions = await getLatestOptionsManitou(email)
        return json({ ok: true, modelData, finance, deFees, manOptions, sliderWidth })
    }
    if (brand === 'Kawasaki') {
        const modelData = await getDataKawasaki(finance);
        return json({ ok: true, modelData, finance, deFees, sliderWidth })
    }
    if (brand === 'BMW-Motorrad') {
        const financeId = finance?.id
        const bmwMoto = await getLatestBMWOptions(financeId)
        const bmwMoto2 = await getLatestBMWOptions2(financeId)
        const modelData = await getDataBmwMoto(finance);
        return json({ ok: true, modelData, finance, deFees, bmwMoto, bmwMoto2, sliderWidth })
    }
    if (brand === 'Triumph') {
        const modelData = await getDataTriumph(finance);
        return json({ ok: true, modelData, finance, deFees, sliderWidth })
    }
    if (brand === 'Harley-Davidson') {
        const modelData = await getDataHarley(finance);
        return json({ ok: true, modelData, finance, deFees, sliderWidth })
    }
    else {
        const modelData = await getDataByModel(finance)
        return json({ ok: true, modelData, finance, deFees, sliderWidth })
    }
}

export const overviewAction: ActionFunction = async ({ request, params }) => {

    const formPayload = Object.fromEntries(await request.formData());
    let formData = financeFormSchema.parse(formPayload)
    const userSession = await getSession(request.headers.get("Cookie"));
    if (!userSession) { return json({ status: 302, redirect: 'login' }); };
    const email = userSession.get("email");
    const user = await model.user.query.getForSession({ email });
    if (!user) { return json({ status: 302, redirect: 'login' }); };
    const latestDashboard = await prisma.dashboard.findFirst({ orderBy: { createdAt: 'desc', }, });
    const financeId = formData.financeId        //console.log(DataForm, 'dataform')
    const sliderWidth = formData.sliderWidth
    // const token66 = await SetToken66(sliderWidth)

    if (formPayload.intent === 'financeTurnover') {
        const locked = Boolean(formPayload.locked);
        const claim = await prisma.lockFinanceTerminals.update({
            where: {
                id: 1
            },
            data: {
                locked: locked
            }
        });
        return claim;
    }
    const userId = user?.id;
    const clientfileId = formData.clientfileId
    const dashboardId = formData.dashboardId
    const client66 = await SetClient66(userId, clientfileId, financeId, dashboardId)
    const session = await getPref(request.headers.get("Cookie"));
    session.set("userId", userId);
    session.set("clientfileId", clientfileId);
    session.set("financeId", financeId);
    session.set("dashboardId", dashboardId);


    const lastContact = new Date().toISOString();
    const today = new Date()
    formData = { ...formData, lastContact, pickUpDate: 'TBD', }
    if (formPayload.intent === 'emailPayments') {
        return redirect('/dashboard/features/emailPayments'),
            { headers: { "Set-Cookie": await commitPref(session) } }
    }
    if (formPayload.intent === 'emailPDF') {
        return redirect('/dashboard/features/emailClientSpecAndModel'),
            { headers: { "Set-Cookie": await commitPref(session) } }
    }

    if (formPayload.financeTurnover === true) {
        const finance = await prisma.lockFinanceTerminals.update({
            where: {
                id: 1,
            },
            data: {
                financeId: formData.financeId
            }
        })
        return finance
    }
    //     console.log(financeId, 'financeId', financeData, 'financeData', dashData, 'dashData',)
    console.log(formData, 'formdata from overview')
    const finance = await prisma.finance.update({
        where: {
            id:
                financeId
        },
        data: {
            //  clientfileId: formData.clientfileId,
            //dashboardId: formData.dashboardId,
            //  financeId: formData.financeId,
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
            userEmail: formData.userEmail,
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
        },
    });
    const dashboard = await prisma.dashboard.update({
        where: {
            financeId:
                financeId
        },
        data: {
            financeId: financeId,
            lastContact: today.toISOString(),
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
            result: formData.result,
            customerState: formData.customerState,
            timesContacted: formData.timesContacted,
            followUpDay: 'TBD',
            deliveredDate: 'TBD',
            visits: formData.visits,
            progress: formData.progress,
            pickUpDate: 'TBD',
        },
    });
    return json({ finance, dashboard, client66, }, { headers: { "Set-Cookie": await commitPref(session) } }
    );

}


