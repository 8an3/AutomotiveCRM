import { json, type ActionFunction, type DataFunctionArgs, type LoaderFunction, redirect } from '@remix-run/node'
import financeFormSchema from '~/overviewUtils/financeFormSchema';
import axios from "axios";
import { getDealerFeesbyEmail } from "~/utils/user.server";
import { getDataKawasaki, getLatestBMWOptions, getLatestBMWOptions2, getDataBmwMoto, getDataByModel, getDataHarley, getDataTriumph, findQuoteById, findDashboardDataById, getDataByModelManitou, getLatestOptionsManitou } from "~/utils/finance/get.server";
import { prisma } from '~/libs';
import { commitSession as commitPref, getSession as getPref } from "~/utils/pref.server";
import { getSession } from '~/sessions/auth-session.server';
import { getSession as sixSession, commitSession as sixCommit, } from '~/utils/misc.user.server'
import { GetUser } from "~/utils/loader.server";
import { SendPayments, } from '~/components/zRoutes/oldRoutes/notifications.client';
import GetUserFromRequest from "~/utils/auth/getUser";
import { getSession as custSession, commitSession as custCommit } from '~/sessions/customer-session.server';
import PaymentCalculatorEmail from '~/emails/PaymentCalculatorEmail';
import { Resend } from 'resend';
import CustomBody from '~/emails/customBody';
import emitter from '~/routes/__authorized/dealer/features/addOn/emitter';

//import { UpdateLead } from '~/routes/_authorized/dealer/api/activix';
const accessToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiYzFkZTg5NzMwZmIyYTZlNmU1NWNhNzA4OTc2YTdjNzNiNWFmZDQwYzdmNDQ3YzE4ZjM5ZGE4MjMwYWFhZmE3ZmEyMTBmNGYyMzdkMDE0ZGQiLCJpYXQiOjE3MDI1NzI0NDIuNTcwMTAyLCJuYmYiOjE3MDI1NzI0NDIuNTcwMTA0LCJleHAiOjQ4NTgyNDYwNDIuNTI2NDI4LCJzdWIiOiIxNDMwNDEiLCJzY29wZXMiOlsidmlldy1sZWFkcyIsIm1hbmFnZS1sZWFkcyIsInRyaWdnZXItZmxvdyIsIm5vdGVzOmNyZWF0ZSIsIm5vdGVzOnVwZGF0ZSIsIm5vdGVzOnZpZXciXX0.ZrXbofK55iSlkvYH0AVGNtc5SH5KEXqu8KdopubrLsDx8A9PW2Z55B5pQCt8jzjE3J9qTcyfnLjDIR3pU4SozCFCmNOMZVWkpLgUJPLsCjQoUpN-i_7V5uqcojWIdOya7_WteJeoTOxeixLgP_Fg7xJoC96uHP11PCQKifACVL6VH2_7XJN_lHu3R3wIaYJrXN7CTOGMQplu5cNNf6Kmo6346pV3tKZKaCG_zXWgsqKuzfKG6Ek6VJBLpNuXMFLcD1wKMKKxMy_FiIC5t8SK_W7-LJTyo8fFiRxyulQuHRhnW2JpE8vOGw_QzmMzPxFWlAPxnT4Ma6_DJL4t7VVPMJ9ZoTPp1LF3XHhOExT2dMUt4xEQYwR1XOlnd0icRRlgn2el88pZwXna8hju_0R-NhG1caNE7kgRGSxiwdSEc3kQPNKDiJeoSbvYoxZUuAQRNgEkjIN-CeQp5LAvOgI8tTXU9lOsRFPk-1YaIYydo0R_K9ru9lKozSy8tSqNqpEfgKf8S4bqAV0BbKmCJBVJD7JNgplVAxfuF24tiymq7i9hjr08R8p2HzeXS6V93oW4TJJiFB5kMFQ2JQsxT-yeFMKYFJQLNtxsCtVyk0x43AnFD_7XrrywEoPXrd-3SBP2z65DP9Js16-KCsod3jJZerlwb-uKeeURhbaB9m1-hGk"

export async function overviewLoader({ request, params }: LoaderFunction) {
    const session2 = await getSession(request.headers.get("Cookie"));
    const email = session2.get("email")
    const user = await GetUser(email)

    const userId = user?.id
    const customerSession = await custSession(request.headers.get("Cookie"))
    const userIdCookie = customerSession.get("userEmail")
    const financeId = customerSession.get("financeId")

    let finance = await prisma.finance.findUnique({ where: { id: financeId, }, });
    switch (user?.newLook) {
        case 'on':
            const brandId = params.brandId
            return redirect(`/dealer/overview/new/${brandId}`)
        default:
            null
    }
    //  const financeId = finance?.id
    //  const { finance, dashboard, clientfile, } = await getClientFinanceAndDashData(financeId)
    let deFees = await prisma.dealer.findUnique({ where: { userEmail: email } });
    if (!deFees) {
        deFees = await prisma.dealer.findFirst();
    }
    const records = await prisma.inventoryMotorcycle.findMany()
    // const session = await getPref(request.headers.get("Cookie"))
    const sliderWidth = customerSession.get('sliderWidth')
    const tokens = customerSession.get('accessToken')

    customerSession.set("userId", userId)
    customerSession.set("financeId", financeId)
    await custCommit(customerSession)
    const brand = finance?.brand
    console.log(finance, brand, 'brandbrandbrandbrand')

    const notifications = await prisma.notificationsUser.findMany({ where: { userEmail: email } })
    if (brand === 'Manitou') {
        const modelData = await getDataByModelManitou(finance);
        const manOptions = await getLatestOptionsManitou(email)
        return json({ ok: true, modelData, finance, deFees, manOptions, sliderWidth, records, notifications, user, tokens, email }, { headers: { "Set-Cookie": await custCommit(customerSession) } })
    }
    if (brand === 'Switch') {
        const modelData = await getDataByModel(finance);
        const manOptions = await getLatestOptionsManitou(email)
        return json({ ok: true, modelData, finance, deFees, manOptions, sliderWidth, records, notifications, user, tokens, email }, { headers: { "Set-Cookie": await custCommit(customerSession) } })
    }
    if (brand === 'Kawasaki') {
        const modelData = await getDataKawasaki(finance);
        return json({ ok: true, modelData, finance, deFees, sliderWidth, records, notifications, user, tokens, email }, { headers: { "Set-Cookie": await custCommit(customerSession) } })
    }
    if (brand === 'BMW-Motorrad') {
        const financeId = finance?.id
        const bmwMoto = await getLatestBMWOptions(financeId)
        const bmwMoto2 = await getLatestBMWOptions2(financeId)
        const modelData = await getDataBmwMoto(finance);
        return json({ ok: true, modelData, finance, deFees, bmwMoto, bmwMoto2, sliderWidth, records, notifications, user, tokens, email }, { headers: { "Set-Cookie": await custCommit(customerSession) } })
    }
    if (brand === 'Triumph') {
        const modelData = await getDataTriumph(finance);
        return json({ ok: true, modelData, finance, deFees, sliderWidth, records, notifications, user, tokens, email }, { headers: { "Set-Cookie": await custCommit(customerSession) } })
    }
    if (brand === 'Harley-Davidson') {
        const modelData = await getDataHarley(finance);
        console.log(modelData, finance, brand, ' in harley')
        // console.log(user, tokens, 'user, tokens ')
        return json({ ok: true, modelData, finance, deFees, sliderWidth, records, notifications, user, tokens, email }, { headers: { "Set-Cookie": await custCommit(customerSession) } })
    }
    else {
        console.log(finance, brand, 'not in harley')
        const modelData = await getDataByModel(finance)
        return json({ ok: true, modelData, finance, deFees, sliderWidth, records, notifications, user, tokens, email }, { headers: { "Set-Cookie": await custCommit(customerSession) } })
    }
}

export async function financeIdLoader({ financeId, request }) {
    let user = await GetUserFromRequest(request);
    if (!user) { return redirect('/login'); }
    const session2 = await getSession(request.headers.get("Cookie"));
    const email = session2.get("email")

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

const resend = new Resend('re_YFCDynPp_5cod9FSRkrbS6kfmRsoqSsBS')//new Resend(process.env.resend_API_KEY);


export const overviewAction: ActionFunction = async ({ request, params }) => {
    const formPayload = Object.fromEntries(await request.formData());
    let formData = financeFormSchema.parse(formPayload)
    const userSession = await getSession(request.headers.get("Cookie"));
    if (!userSession) { return json({ status: 302, redirect: 'login' }); };
    const email = userSession.get("email");
    const user = await GetUser(email)
    if (!user) { return json({ status: 302, redirect: 'login' }); };
    const financeId = formData.financeId
    const sliderWidth = formData.sliderWidth
    const tokens = userSession.get('accessToken')
    console.log(formData, 'formdata overview')


    const userId = user?.id;
    const clientfileId = formData.clientfileId
    const dashbaordId = formData.dashboardId
    const session66 = await sixSession(request.headers.get("Cookie"));
    session66.set("financeId", financeId);
    session66.set("clientfileId", clientfileId);
    const serializedSession = await sixCommit(session66);

    const lastContact = new Date().toISOString();
    const today = new Date()
    formData = { ...formData, lastContact, pickUpDate: 'TBD', }
    const userIntegration = await prisma.user.findUnique({
        where: { email: user?.email }
    })
    if (userIntegration) {
        const activixActivated = userIntegration.activixActivated
        if (activixActivated === 'yes') {
            const updateActivix = await UpdateLead(formData)
            console.log(updateActivix, 'updateActivix')
        }
    }
    if (formPayload.intent === 'email') {
        const finance = await prisma.finance.findUnique({ where: { id: formData.financeId } })

        const model = finance?.model || '';
        const modelData = formData.modelData
        const value = formData.template
        let data;
        if (value.startsWith("customEmailDropdown")) {
            const prefix = "customEmailDropdown";
            const id = value.slice(prefix.length);
            const emailDrop = await prisma.emailTemplatesForDropdown.findUnique({
                where: { id: id },
            });
            console.log(value, emailDrop, 'hitd')

            data = await resend.emails.send({
                from: "Sales <sales@resend.dev>",
                reply_to: user?.email,
                to: [`${finance?.email}`],
                subject: emailDrop.subject || '',
                react: <CustomBody body={emailDrop.body} user={user} />
            });

        } else {
            console.log('hitemail')
            data = await resend.emails.send({
                from: "Sales <sales@resend.dev>",
                reply_to: user?.email,
                to: [`${finance?.email}`],
                subject: `${finance?.brand} ${model} model information.`,
                react: <PaymentCalculatorEmail user={user} finance={finance} modelData={modelData} formData={formData} />
            });
        }
        await prisma.comm.create({
            data: {
                financeId: finance.financeId,
                body: formData.body || 'Templated Email',
                type: 'Email',
                direction: 'Outgoing',
                subject: `${finance?.brand} ${model} model information.`,
                result: 'Attempted',
                userEmail: user.email,
                Finance: {
                    connect: { id: financeId }
                },
            }
        })
        return json({ data })
    }
    if (formPayload.intent === 'clientTurnover') {

        const create = await prisma.lockFinanceTerminals.create({
            data: {
                locked: true,
                financeId: formData.financeId,
                salesEmail: user.email,
                customerName: formData.customerName,
                unit: formData.unit,
                response: false,

            }
        })
        return json({ create })
    }
    if (formPayload.intent === 'responseClientTurnover') {

        const update = await prisma.lockFinanceTerminals.update({
            where: { id: formData.claimId, },
            data: {
                response: true,
            },
        });
        return update
    }
    if (formPayload.intent === 'updateFinance') {
        let dateModal = new Date(formData.pickedDate);
        const timeOfDayModal = formData.pickHour + ':' + formData.pickMin;
        const [hours, minutes] = timeOfDayModal.split(':').map(Number);
        dateModal.setHours(hours, minutes);
        const year = dateModal.getFullYear();
        const month = String(dateModal.getMonth() + 1).padStart(2, '0');  // Months are 0-indexed in JavaScript
        const day = String(dateModal.getDate()).padStart(2, '0');
        const hour = String(dateModal.getHours()).padStart(2, '0');
        const minute = String(dateModal.getMinutes()).padStart(2, '0');
        const dateTimeString = `${year}-${month}-${day}T${hour}:${minute}:00.000`;
        console.log(dateTimeString, 'datemodal');
        console.log(formData, 'formdata from overview')
        const options = {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        };
        const finance = await prisma.finance.update({
            where: {
                id: formData.financeId
            },
            data: {
                financeManager: formData.financeManager,
                financeManagerName: formData.financeManagerName,
                //: formData.//,
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
                dob: formData.dob,
                //: formData.//,
                othTax: formData.othTax,
                optionsTotal: formData.optionsTotal,
                lienPayout: formData.lienPayout,
                leadNote: formData.leadNote,
                sendToFinanceNow: formData.sendToFinanceNow,
                dealNumber: formData.dealNumber,
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
                //: formData.//,
                referral: formData.referral,
                visited: formData.visited,
                bookedApt: formData.bookedApt,
                aptShowed: formData.aptShowed,
                aptNoShowed: formData.aptNoShowed,
                testDrive: formData.testDrive,
                metService: formData.metService,
                metManager: formData.metManager,
                metParts: formData.metParts,
                sold: formData.sold,
                depositMade: formData.depositMade,
                refund: formData.refund,
                turnOver: formData.turnOver,
                financeApp: formData.financeApp,
                approved: formData.approved,
                signed: formData.signed,
                pickUpSet: formData.pickUpSet,
                demoed: formData.demoed,
                customerState: formData.customerState,
                deliveryDate: formData.deliveryDate,
                delivered: formData.delivered,
                deliveredDate: formData.deliveredDate,
                notes: formData.notes,
                visits: formData.visits,
                progress: formData.progress,
                metFinance: formData.metFinance,
                financeApplication: formData.financeApplication,
                pickUpDate: formData.pickUpDate,
                pickUpTime: formData.pickUpTime,
                depositTakenDate: formData.depositTakenDate,
                docsSigned: formData.docsSigned,
                tradeRepairs: formData.tradeRepairs,
                seenTrade: formData.seenTrade,
                lastNote: formData.lastNote,
                applicationDone: formData.applicationDone,
                licensingSent: formData.licensingSent,
                liceningDone: formData.liceningDone,
                refunded: formData.refunded,
                cancelled: formData.cancelled,
                lost: formData.lost,
                dLCopy: formData.dLCopy,
                insCopy: formData.insCopy,
                testDrForm: formData.testDrForm,
                voidChq: formData.voidChq,
                loanOther: formData.loanOther,
                signBill: formData.signBill,
                ucda: formData.ucda,
                tradeInsp: formData.tradeInsp,
                customerWS: formData.customerWS,
                otherDocs: formData.otherDocs,
                urgentFinanceNote: formData.urgentFinanceNote,
                funded: formData.funded,
                leadSource: formData.leadSource,
                financeDeptProductsTotal: formData.financeDeptProductsTotal,
                bank: formData.bank,
                loanNumber: formData.loanNumber,
                idVerified: formData.idVerified,
                dealerCommission: formData.dealerCommission,
                financeCommission: formData.financeCommission,
                salesCommission: formData.salesCommission,
                firstPayment: formData.firstPayment,
                loanMaturity: formData.loanMaturity,
                quoted: formData.quoted,
                //: formData.//,
                // InPerson: formData.InPerson,
                //  Phone: formData.Phone,
                //  SMS: formData.SMS,
                //  Email: formData.Email,
                //  Other: formData.Other,
                //------: formData.//------,
                //: formData.//,
                paintPrem: formData.paintPrem,
                licensing: formData.licensing,
                stockNum: formData.stockNum,
                options: formData.options,
                accessories: formData.accessories,
                freight: formData.freight,
                labour: formData.labour,
                year: formData.year,
                brand: formData.brand,
                mileage: formData.mileage,
                model: formData.model,
                model1: formData.model1,
                color: formData.color,
                modelCode: formData.modelCode,
                msrp: formData.msrp,
                trim: formData.trim,
                vin: formData.vin,
                bikeStatus: formData.bikeStatus,
                invId: formData.invId,
                motor: formData.motor,
                tag: formData.tag,
                //: formData.//,
                tradeValue: formData.tradeValue,
                tradeDesc: formData.tradeDesc,
                tradeColor: formData.tradeColor,
                tradeYear: formData.tradeYear,
                tradeMake: formData.tradeMake,
                tradeVin: formData.tradeVin,
                tradeTrim: formData.tradeTrim,
                tradeMileage: formData.tradeMileage,
                tradeLocation: formData.tradeLocation,
                lien: formData.lien,
                //: formData.//,
                id: formData.id,
                activixId: formData.activixId,
                theRealActId: formData.theRealActId,
                clientfileId: formData.clientfileId,

                userEmail: user.email,

                lastContact: today.toLocaleDateString('en-US', options),
                nextAppointment: 'TBD',

                metSalesperson: today.toLocaleDateString('en-US', options),
                status: 'Active',
                result: 'Quoted',

                followUpDay: 'TBD',
                userName: user.username,
                timesContacted: formData.timesContacted,
            },
        });

        const clientFile = await prisma.clientfile.findUnique({ where: { email: formData.email } })
        const updateClientFile = await prisma.clientfile.update({
            where: { id: clientFile.id },
            data: {
                financeId: finance.id,
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
                dl: formData.dl,
                typeOfContact: formData.typeOfContact,
                timeToContact: formData.timeToContact,

            }
        })
        return json({ finance, updateClientFile }, { headers: { "Set-Cookie": serializedSession, } }
        );
    }
    //     console.log(financeId, 'financeId', financeData, 'financeData', dashData, 'dashData',)
    /**   console.log(formData, 'formdata from overview')
       const finance = await prisma.finance.update({
           where: {
               id: formData.financeId
           },
           data: {
               clientfileId: formData.clientfileId,
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
               lien: formData.lien,
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
    */
    return json({ headers: { "Set-Cookie": serializedSession, } }
    );

}


async function UpdateLead(formData) {
    const activixId = await prisma.finance.findUnique({ where: { id: formData.financeId } })

    const startat = new Date();
    const start_at = startat.toISOString().replace(/\.\d{3}Z$/, '-04:00');
    const response = await axios.put(`https://api.crm.activix.ca/v2/leads/${activixId.activixId}`,
        {
            first_name: formData.firstName ?? null,
            last_name: formData.lastName ?? null,
            birth_date: formData.dob ?? null,
            funded: formData.dob ?? null,
            deliverable_date: formData.birthDate ?? null,
            delivered_date: formData.deliveredDate ?? null,
            delivery_date: formData.birthDate ?? null,
            last_visit_date: start_at,
            paperwork_date: formData.birthDate ?? null,
            //    planned_pick_up_date: formData.pickUpDate ?? null,
            presented_date: formData.birthDate ?? null,
            sale_date: formData.birthDate ?? null,
            address_line1: formData.address ?? null,
            credit_approved: false,
            city: formData.city ?? null,
            country: formData.country ?? null,
            dealer_tour: formData.birthDate ?? null,
            financial_institution: formData.birthDate ?? null,
            postal_code: formData.postalCode ?? null,
            prepared: formData.birthDate ?? null,
            province: formData.province ?? null,
            result: formData.result ?? null,
            progress_state: formData.customerState ?? null,
            //  status: 'active',
            walk_around: formData.birthDate ?? null,
            response_time: formData.birthDate ?? null,
            first_update_time: formData.birthDate ?? null,
        },
        {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            }
        }
    ).then(response => {
        console.log(response.data);
    })
        .catch(error => {
            console.error('Full error object:', error);
            console.error(`Activix Error: ${error.response.status} - ${error.response.data}`);
            console.error(`Error status: ${error.response.status}`);
            console.error('Error response:', error.response.data);
        });


    return response

}
const data = {
    data: {
        id: 43808652,
        account_id: 17162,
        customer_id: 41912773,
        source_id: null,
        provider_id: null,
        appointment_date: null,
        appointment_event_id: null,
        phone_appointment_date: null,
        available_date: null,
        be_back_date: null,
        birth_date: null,
        call_date: null,
        created_at: '2024-03-22T20:14:07+00:00',
        csi_date: null,
        deliverable_date: null,
        delivered_date: null,
        delivery_date: null,
        funded: null,
        end_service_date: null,
        home_presented_date: null,
        last_visit_date: null,
        next_visit_date: null,
        open_work_order_date: null,
        paperwork_date: null,
        planned_pick_up_date: null,
        presented_date: null,
        promised_date: null,
        refinanced_date: null,
        repair_date: null,
        road_test_date: null,
        home_road_test_date: null,
        sale_date: null,
        take_over_date: null,
        unsubscribe_all_date: null,
        unsubscribe_call_date: null,
        unsubscribe_email_date: null,
        unsubscribe_sms_date: null,
        updated_at: '2024-03-22T20:54:37+00:00',
        work_order_closure_date: null,
        work_order_partial_closure_date: null,
        address_line1: null,
        address_line2: null,
        credit_approved: false,
        average_spending: 0,
        business: null,
        business_name: null,
        city: null,
        civility: null,
        code: null,
        comment: null,
        country: 'CA',
        created_method: 'api',
        dealer_tour: null,
        division: null,
        financial_institution: null,
        first_name: 'Jason',
        gender: 0,
        inspected: false,
        invoiced: false,
        last_name: 'Stathom',
        locale: 'fr',
        loyalty: null,
        odometer_last_visit: null,
        postal_code: null,
        prepaid: null,
        prepared: false,
        province: 'QC',
        qualification: null,
        rating: null,
        reached_client: false,
        repair_order: null,
        result: 'pending',
        second_contact: null,
        second_contact_civility: null,
        segment: null,
        service_cleaned: false,
        service_interval_km: null,
        service_monthly_km: null,
        source: null,
        provider: null,
        progress_state: null,
        status: null,
        storage: null,
        type: 'email',
        walk_around: false,
        work_order: null,
        referrer: null,
        search_term: null,
        keyword: null,
        navigation_history: null,
        campaign: null,
        response_time: null,
        first_update_time: null,
        account: {
            id: 17162,
            created_at: '2023-12-14T16:45:54+00:00',
            updated_at: '2023-12-14T16:45:56+00:00',
            name: 'Sandbox - Skyler Zanth'
        },
        advisor: {
            id: 143041,
            created_at: '2023-12-14T16:47:06+00:00',
            updated_at: '2023-12-14T16:47:08+00:00',
            email: 'skylerzanth@gmail.com',
            first_name: 'Skyler',
            last_name: 'Zanth API'
        },
        bdc: null,
        commercial: null,
        service_advisor: null,
        service_agent: null,
        customer: { id: 41912773 },
        emails: [[Object]],
        communications: [],
        phones: [[Object]],
        products: [],
        vehicles: [[Object]]
    }
}
