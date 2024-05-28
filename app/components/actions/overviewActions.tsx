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
import { SendPayments, } from '~/routes/__authorized/dealer/email/server';
import GetUserFromRequest from "~/utils/auth/getUser";


//import { UpdateLead } from '~/routes/_authorized/dealer/api/activix';
const accessToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiYzFkZTg5NzMwZmIyYTZlNmU1NWNhNzA4OTc2YTdjNzNiNWFmZDQwYzdmNDQ3YzE4ZjM5ZGE4MjMwYWFhZmE3ZmEyMTBmNGYyMzdkMDE0ZGQiLCJpYXQiOjE3MDI1NzI0NDIuNTcwMTAyLCJuYmYiOjE3MDI1NzI0NDIuNTcwMTA0LCJleHAiOjQ4NTgyNDYwNDIuNTI2NDI4LCJzdWIiOiIxNDMwNDEiLCJzY29wZXMiOlsidmlldy1sZWFkcyIsIm1hbmFnZS1sZWFkcyIsInRyaWdnZXItZmxvdyIsIm5vdGVzOmNyZWF0ZSIsIm5vdGVzOnVwZGF0ZSIsIm5vdGVzOnZpZXciXX0.ZrXbofK55iSlkvYH0AVGNtc5SH5KEXqu8KdopubrLsDx8A9PW2Z55B5pQCt8jzjE3J9qTcyfnLjDIR3pU4SozCFCmNOMZVWkpLgUJPLsCjQoUpN-i_7V5uqcojWIdOya7_WteJeoTOxeixLgP_Fg7xJoC96uHP11PCQKifACVL6VH2_7XJN_lHu3R3wIaYJrXN7CTOGMQplu5cNNf6Kmo6346pV3tKZKaCG_zXWgsqKuzfKG6Ek6VJBLpNuXMFLcD1wKMKKxMy_FiIC5t8SK_W7-LJTyo8fFiRxyulQuHRhnW2JpE8vOGw_QzmMzPxFWlAPxnT4Ma6_DJL4t7VVPMJ9ZoTPp1LF3XHhOExT2dMUt4xEQYwR1XOlnd0icRRlgn2el88pZwXna8hju_0R-NhG1caNE7kgRGSxiwdSEc3kQPNKDiJeoSbvYoxZUuAQRNgEkjIN-CeQp5LAvOgI8tTXU9lOsRFPk-1YaIYydo0R_K9ru9lKozSy8tSqNqpEfgKf8S4bqAV0BbKmCJBVJD7JNgplVAxfuF24tiymq7i9hjr08R8p2HzeXS6V93oW4TJJiFB5kMFQ2JQsxT-yeFMKYFJQLNtxsCtVyk0x43AnFD_7XrrywEoPXrd-3SBP2z65DP9Js16-KCsod3jJZerlwb-uKeeURhbaB9m1-hGk"

export async function overviewLoader({ request, params }: LoaderFunction) {

    const session2 = await getSession(request.headers.get("Cookie"));
    const email = session2.get("email")
    const user = await GetUser(email)

    const userId = user?.id
    let finance = await prisma.finance.fidnMany({
        orderBy: {
            createdAt: 'desc',
        },
    });
    switch (user?.newLook) {
        case 'on':
            const brandId = params.brandId
            return redirect(`/dealer/overview/new/${brandId}`)
        default:
            null
    }
    const financeId = finance?.id
    //  const { finance, dashboard, clientfile, } = await getClientFinanceAndDashData(financeId)
    let deFees = await prisma.dealer.findUnique({ where: { userEmail: email } });
    if (!deFees) {
        deFees = await prisma.dealer.findFirst();
    } const records = await prisma.inventoryMotorcycle.findMany()

    const session = await getPref(request.headers.get("Cookie"))
    const sliderWidth = session.get('sliderWidth')
    const tokens = session.get('accessToken')
    session.set("userId", userId)
    session.set("financeId", financeId)
    await commitPref(session)
    const brand = finance?.brand
    const notifications = await prisma.notificationsUser.findMany({
        where: {
            userId: user.id,
        }
    })
    if (brand === 'Manitou') {
        const modelData = await getDataByModelManitou(finance);
        const manOptions = await getLatestOptionsManitou(email)
        return json({ ok: true, modelData, finance, deFees, manOptions, sliderWidth, records, notifications, user, tokens, email })
    }
    if (brand === 'Switch') {
        const modelData = await getDataByModel(finance);
        const manOptions = await getLatestOptionsManitou(email)
        return json({ ok: true, modelData, finance, deFees, manOptions, sliderWidth, records, notifications, user, tokens, email })
    }
    if (brand === 'Kawasaki') {
        const modelData = await getDataKawasaki(finance);
        return json({ ok: true, modelData, finance, deFees, sliderWidth, records, notifications, user, tokens, email })
    }
    if (brand === 'BMW-Motorrad') {
        const financeId = finance?.id
        const bmwMoto = await getLatestBMWOptions(financeId)
        const bmwMoto2 = await getLatestBMWOptions2(financeId)
        const modelData = await getDataBmwMoto(finance);
        return json({ ok: true, modelData, finance, deFees, bmwMoto, bmwMoto2, sliderWidth, records, notifications, user, tokens, email })
    }
    if (brand === 'Triumph') {
        const modelData = await getDataTriumph(finance);
        return json({ ok: true, modelData, finance, deFees, sliderWidth, records, notifications, user, tokens, email })
    }
    if (brand === 'Harley-Davidson') {
        const modelData = await getDataHarley(finance);
        console.log(user, tokens, 'user, tokens ')
        return json({ ok: true, modelData, finance, deFees, sliderWidth, records, notifications, user, tokens, email })
    }
    else {
        const modelData = await getDataByModel(finance)
        return json({ ok: true, modelData, finance, deFees, sliderWidth, records, notifications, user, tokens, email })
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

export const overviewAction: ActionFunction = async ({ request, params }) => {
    const formPayload = Object.fromEntries(await request.formData());
    let formData = financeFormSchema.parse(formPayload)
    const userSession = await getSession(request.headers.get("Cookie"));
    if (!userSession) { return json({ status: 302, redirect: 'login' }); };
    const email = userSession.get("email");
    const user = await GetUser(email)
    if (!user) { return json({ status: 302, redirect: 'login' }); };
    const latestDashboard = await prisma.dashboard.findFirst({ orderBy: { createdAt: 'desc', }, });
    const financeId = formData.financeId        //console.log(DataForm, 'dataform')
    const sliderWidth = formData.sliderWidth
    // const token66 = await SetToken66(sliderWidth)
    const tokens = userSession.get('accessToken')

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
    if (formPayload.intent === 'emailPayments') {
        return redirect('/dashboard/features/emailPayments'),
            { headers: { "Set-Cookie": await commitPref(session66) } }
    }
    if (formPayload.intent === 'emailPDF') {
        return redirect('/dashboard/features/emailClientSpecAndModel'),
            { headers: { "Set-Cookie": await commitPref(session66) } }
    }
    if (formPayload.intent === 'sendPayments') {
        console.log(user, tokens, 'inside handesendpayments')
        const send = SendPayments(tokens, user, formData)
        return send
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
    if (formPayload.intent === 'updateFinance') {
        console.log(formData, 'formdata from overview')
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

        return json({ finance, }, { headers: { "Set-Cookie": serializedSession, } }
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
