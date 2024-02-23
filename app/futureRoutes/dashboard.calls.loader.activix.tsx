import { type DataFunctionArgs, type ActionFunction, json } from '@remix-run/node'
import { faker } from '@faker-js/faker';
import { useLoaderData, useNavigation } from '@remix-run/react';
import ActivixCall from '~/components/activixCall'

export const ASDASDloader = async ({ request }: DataFunctionArgs) => {
    const data = await function DataCreator() {
        let lead = [


        ]

        for (let key in lead) {
            lead[key] = String(lead[key]);
        }
        function generateAppointment() {
            const formattedDate = faker.date.future().toISOString();

            return {
                lead_id: faker.datatype.number(),
                owner: {
                    id: faker.datatype.number()
                },
                title: `Appointment for ${faker.name.firstName()}`,
                type: "appointment",
                start_at: formattedDate,
                end_at: formattedDate,
                completed_at: faker.date.past().toISOString(),
                canceled: faker.date.past().toISOString(),
                completed: faker.date.past().toISOString(),
                confirmed: faker.date.past().toISOString(),
                description: faker.lorem.sentence(),
                no_show: faker.date.past().toISOString(),
                priority: faker.lorem.word(),
            };
        }
        const appointments = [

        ]

        function generateCommunications() {
            return {
                lead_id: faker.datatype.number(),
                user_id: faker.datatype.number(),
                method: 'phone',
                type: 'outgoing',
                description: faker.lorem.sentence(),
                executed_at: faker.date.recent().toISOString(),
                executed_by: faker.datatype.number(),
                call_duration: faker.datatype.number({ min: 1, max: 60 }),
                call_phone: +16136136134,
                call_status: 'answered',
                email_subject: faker.lorem.sentence(),
                email_body: faker.lorem.paragraph(),
                email_user: faker.internet.userName(),
                attribute: faker.random.word(),
                url: faker.internet.url(),

                /** lead_id: leadId,
                 user_id: userId,
                 method: "phone", // formPayload.method, // phone, email or sms.
                 type: "outgoing", // formPayload.type, //outgoing or incoming.
                 description: "This is a test communication", // formPayload.description,
                 executed_at: formattedDate, // formPayload.executed_at,
                 executed_by: 5001, // formPayload.executed_by,

                 call_duration: 25, // formPayload.call_duration,
                 call_phone: "+15144321214",// formPayload.call_phone,
                 call_status: "answered",// formPayload.call_status, // answered, attempted,  calling, error, interrupted, pending or unanswered

                 email_subject: "This is a test email",// formPayload.email_subject,
                 email_body: "This is a test email",// formPayload.email_body,
                 email_user: "John Doe",// formPayload.email_user,

                 attribute: 'description',// formPayload.attribute,
                 url: 'https://www.youtube.com/watch?v=6v2L2UGZJAM',// formPayload.url, */
            }
        }
        let communication = faker.helpers.multiple(generateCommunications, {
            count: 5,
        });
        function generateEvents() {
            const today = new Date();
            return {
                "lead_id": faker.datatype.number(),
                "owner": {
                    "id": faker.datatype.number()
                },
                "title": `Appointment for ${faker.name.firstName()}`,
                "type": "appointment",
                "start_at": today,
                "end_at": today,
                "completed_at": faker.date.past().toISOString(),
                "canceled": faker.date.past().toISOString(),
                "completed": faker.date.past().toISOString(),
                "confirmed": faker.date.past().toISOString(),
                "description": faker.lorem.sentence(),
                "no_show": faker.date.past().toISOString(),
                "priority": 'Low',
            }
        }
        let event = faker.helpers.multiple(generateEvents, {
            count: 5,
        });
        function generateTasks() {
            const today = new Date();
            return {

                "lead_id": 3387562,
                "owner": {
                    "id": 87,
                },
                "title": "Call for John",
                "type": "call",
                "date": today,
                "completed": today,
                "description": today,
                "priority": today,
            }
        }
        let task = faker.helpers.multiple(generateTasks, {
            count: 5,
        });
        const appointment = generateAppointment();
        ///  const dataSet = lead
        console.log(lead, 'lead')
        return json({ lead, event, communication, appointment, appointments, task })
    }

    await function CrmToDash(data) {
        //  const { data } = useLoaderData();
        const finance = {
            clientfileId: data.lead.clientfileId,
            dashboardId: data.lead.dashboardId,
            financeId: data.lead.financeId,
            email: data.lead.email,
            firstName: data.lead.firstName,
            lastName: data.lead.lastName,
            phone: data.lead.phone,
            name: data.lead.name,
            address: data.lead.address,
            city: data.lead.city,
            postal: data.lead.postal,
            province: data.lead.province,
            dl: data.lead.dl,
            typeOfContact: data.lead.typeOfContact,
            timeToContact: data.lead.timeToContact,
            iRate: data.lead.iRate,
            months: data.lead.months,
            discount: data.lead.discount,
            total: data.lead.total,
            onTax: data.lead.onTax,
            on60: data.lead.on60,
            biweekly: data.lead.biweekly,
            weekly: data.lead.weekly,
            weeklyOth: data.lead.weeklyOth,
            biweekOth: data.lead.biweekOth,
            oth60: data.lead.oth60,
            weeklyqc: data.lead.weeklyqc,
            biweeklyqc: data.lead.biweeklyqc,
            qc60: data.lead.qc60,
            deposit: data.lead.deposit,
            biweeklNatWOptions: data.lead.biweeklNatWOptions,
            weeklylNatWOptions: data.lead.weeklylNatWOptions,
            nat60WOptions: data.lead.nat60WOptions,
            weeklyOthWOptions: data.lead.weeklyOthWOptions,
            biweekOthWOptions: data.lead.biweekOthWOptions,
            oth60WOptions: data.lead.oth60WOptions,
            biweeklNat: data.lead.biweeklNat,
            weeklylNat: data.lead.weeklylNat,
            nat60: data.lead.nat60,
            qcTax: data.lead.qcTax,
            otherTax: data.lead.otherTax,
            totalWithOptions: data.lead.totalWithOptions,
            otherTaxWithOptions: data.lead.otherTaxWithOptions,
            desiredPayments: data.lead.desiredPayments,
            freight: data.lead.freight,
            admin: data.lead.admin,
            commodity: data.lead.commodity,
            pdi: data.lead.pdi,
            discountPer: data.lead.discountPer,
            userLoanProt: data.lead.userLoanProt,
            userTireandRim: data.lead.userTireandRim,
            userGap: data.lead.userGap,
            userExtWarr: data.lead.userExtWarr,
            userServicespkg: data.lead.userServicespkg,
            deliveryCharge: data.lead.deliveryCharge,
            vinE: data.lead.vinE,
            lifeDisability: data.lead.lifeDisability,
            rustProofing: data.lead.rustProofing,
            userOther: data.lead.userOther,
            paintPrem: data.lead.paintPrem,
            licensing: data.lead.licensing,
            stockNum: data.lead.stockNum,
            options: data.lead.options,
            accessories: data.lead.accessories,
            labour: data.lead.labour,
            year: data.lead.year,
            brand: data.lead.brand,
            model: data.lead.model,
            model1: data.lead.model1,
            color: data.lead.color,
            modelCode: data.lead.modelCode,
            msrp: data.lead.msrp,
            userEmail: data.lead.userEmail,
            tradeValue: data.lead.tradeValue,
            tradeDesc: data.lead.tradeDesc,
            tradeColor: data.lead.tradeColor,
            tradeYear: data.lead.tradeYear,
            tradeMake: data.lead.tradeMake,
            tradeVin: data.lead.tradeVin,
            tradeTrim: data.lead.tradeTrim,
            tradeMileage: data.lead.tradeMileage,
            trim: data.lead.trim,
            vin: data.lead.vin,
            referral: data.lead.referral,
            visited: data.lead.visited,
            bookedApt: data.lead.bookedApt,
            aptShowed: data.lead.aptShowed,
            aptNoShowed: data.lead.aptNoShowed,
            testDrive: data.lead.testDrive,
            metService: data.lead.metService,
            metManager: data.lead.metManager,
            metParts: data.lead.metParts,
            sold: data.lead.sold,
            depositMade: data.lead.depositMade,
            refund: data.lead.refund,
            turnOver: data.lead.turnOver,
            financeApp: data.lead.financeApp,
            approved: data.lead.approved,
            signed: data.lead.signed,
            pickUpSet: data.lead.pickUpSet,
            demoed: data.lead.demoed,
            delivered: data.lead.delivered,
            lastContact: data.lead.lastContact,
            status: data.lead.status,
            customerState: data.lead.customerState,
            result: data.lead.result,
            timesContacted: data.lead.timesContacted,
            nextAppointment: data.lead.nextAppointment,
            followUpDay: data.lead.followUpDay,
            deliveredDate: data.lead.deliveredDate,
            notes: data.lead.notes,
            visits: data.lead.visits,
            progress: data.lead.progress,
            metSalesperson: data.lead.metSalesperson,
            metFinance: data.lead.metFinance,
            financeApplication: data.lead.financeApplication,
            pickUpDate: data.lead.pickUpDate,
            pickUpTime: data.lead.pickUpTime,
            depositTakenDate: data.lead.depositTakenDate,
            docsSigned: data.lead.docsSigned,
            tradeRepairs: data.lead.tradeRepairs,
            seenTrade: data.lead.seenTrade,
            lastNote: data.lead.lastNote,
            dLCopy: data.lead.dLCopy,
            insCopy: data.lead.insCopy,
            testDrForm: data.lead.testDrForm,
            voidChq: data.lead.voidChq,
            loanOther: data.lead.loanOther,
            signBill: data.lead.signBill,
            ucda: data.lead.ucda,
            tradeInsp: data.lead.tradeInsp,
            customerWS: data.lead.customerWS,
            otherDocs: data.lead.otherDocs,
            urgentFinanceNote: data.lead.urgentFinanceNote,
            funded: data.lead.funded,
            countsInPerson: data.lead.countsInPerson,
            countsPhone: data.lead.countsPhone,
            countsSMS: data.lead.countsSMS,
            countsOther: data.lead.countsOther,
            countsEmail: data.lead.countsEmail,
            leadSource: data.lead.leadSource,
        }
        const note = {
            financeId: data.note.financeId,
            slug: data.note.slug,
            customContent: data.note.customContent,
            urgentFinanceNote: data.note.urgentFinanceNote,
            author: data.note.author,
            isPublished: data.note.isPublished,
            customerId: data.note.customerId,
            dept: data.note.dept,
        }
        const appointment = {
            title: data.event.title,
            start: data.event.start,
            end: data.event.end,
            contactMethod: data.event.contactMethod,
            completed: data.event.completed,
            apptStatus: data.event.apptStatus,
            apptType: data.event.apptType,
            note: data.event.note,
            unit: data.event.unit,
            brand: data.event.brand,
            firstName: data.event.firstName,
            lastName: data.event.lastName,
            email: data.event.email,
            phone: data.event.phone,
            address: data.event.address,
            financeId: data.event.financeId,
            userId: data.event.userId,
            description: data.event.description,
            userName: data.event.userName,
            title: data.event.title,
            attachments: data.event.attachments,
            direction: data.event.direction,
            resultOfcall: data.event.resultOfcall,
        }
        const comView = {
            financeId: data.lead.communication.financeId,
            userId: data.lead.communication.userId,
            title: data.lead.communication.title,
            content: data.lead.communication.content,
            date: data.lead.communication.date,
            userName: data.lead.communication.userName,
            type: data.lead.communication.type,
            direction: data.lead.communication.direction,
            subject: data.lead.communication.subject,
            result: data.lead.communication.result,
        }
        const clientFile = {
            financeId: data.lead.financeId,
            userId: data.lead.userId,
            firstName: data.lead.firstName,
            lastName: data.lead.lastName,
            name: data.lead.name,
            email: data.lead.email,
            phone: data.lead.phone,
            address: data.lead.address,
            city: data.lead.city,
            postal: data.lead.postal,
            province: data.lead.province,
            dl: data.lead.dl,
            typeOfContact: data.lead.typeOfContact,
            timeToContact: data.lead.timeToContact,
        }
        return ({ finance, note, appointment, comView, clientFile })
    }

    const client = {
        clientfileId: data.lead.customer_id,
        dashboardId: data.lead.dashboardId,
        financeId: data.lead.financeId,
        email: data.lead.emails.address,
        firstName: data.lead.first_name,
        lastName: data.lead.last_name,
        phone: data.lead.phones.number,
        name: data.lead.name,
        address: data.lead.address_line1,
        city: data.lead.city,
        postal: data.lead.postal_code,
        province: data.lead.province,
        dl: data.lead.dl,
        typeOfContact: data.lead.typeOfContact,
        timeToContact: data.lead.timeToContact,
        iRate: data.lead.iRate,
        months: data.lead.months,
        discount: data.lead.discount,
        total: data.lead.total,
        onTax: data.lead.onTax,
        on60: data.lead.on60,
        biweekly: data.lead.biweekly,
        weekly: data.lead.weekly,
        weeklyOth: data.lead.weeklyOth,
        biweekOth: data.lead.biweekOth,
        oth60: data.lead.oth60,
        weeklyqc: data.lead.weeklyqc,
        biweeklyqc: data.lead.biweeklyqc,
        qc60: data.lead.qc60,
        deposit: data.lead.deposit,
        biweeklNatWOptions: data.lead.biweeklNatWOptions,
        weeklylNatWOptions: data.lead.weeklylNatWOptions,
        nat60WOptions: data.lead.nat60WOptions,
        weeklyOthWOptions: data.lead.weeklyOthWOptions,
        biweekOthWOptions: data.lead.biweekOthWOptions,
        oth60WOptions: data.lead.oth60WOptions,
        biweeklNat: data.lead.biweeklNat,
        weeklylNat: data.lead.weeklylNat,
        nat60: data.lead.nat60,
        qcTax: data.lead.qcTax,
        otherTax: data.lead.otherTax,
        totalWithOptions: data.lead.totalWithOptions,
        otherTaxWithOptions: data.lead.otherTaxWithOptions,
        desiredPayments: data.lead.desiredPayments,
        freight: data.lead.freight,
        admin: data.lead.admin,
        commodity: data.lead.commodity,
        pdi: data.lead.pdi,
        discountPer: data.lead.discountPer,
        userLoanProt: data.lead.userLoanProt,
        userTireandRim: data.lead.userTireandRim,
        userGap: data.lead.userGap,
        userExtWarr: data.lead.userExtWarr,
        userServicespkg: data.lead.userServicespkg,
        deliveryCharge: data.lead.deliveryCharge,
        vinE: data.lead.vinE,
        lifeDisability: data.lead.lifeDisability,
        rustProofing: data.lead.rustProofing,
        userOther: data.lead.userOther,
        paintPrem: data.lead.paintPrem,
        licensing: data.lead.licensing,
        stockNum: data.lead.stockNum,
        options: data.lead.options,
        accessories: data.lead.accessories,
        labour: data.lead.labour,
        year: data.lead.vehicles.year,
        brand: data.lead.vehicles.make,
        model: data.lead.vehicles.model,
        model1: data.lead.vehicles.type,
        color: data.lead.vehicles.color,
        modelCode: data.lead.vehicles.modelCode,
        msrp: data.lead.msrp,
        userEmail: data.lead.userEmail,
        tradeValue: data.lead.tradeValue,
        tradeDesc: data.lead.tradeDesc,
        tradeColor: data.lead.tradeColor,
        tradeYear: data.lead.tradeYear,
        tradeMake: data.lead.tradeMake,
        tradeVin: data.lead.tradeVin,
        tradeTrim: data.lead.tradeTrim,
        tradeMileage: data.lead.tradeMileage,
        trim: data.lead.trim,
        vin: data.lead.vin,
        referral: data.lead.referral,
        visited: data.lead.visited,
        bookedApt: data.lead.bookedApt,
        aptShowed: data.lead.aptShowed,
        aptNoShowed: data.lead.aptNoShowed,
        testDrive: data.lead.testDrive,
        metService: data.lead.metService,
        metManager: data.lead.metManager,
        metParts: data.lead.metParts,
        sold: data.lead.sold,
        depositMade: data.lead.depositMade,
        refund: data.lead.refund,
        turnOver: data.lead.turnOver,
        financeApp: data.lead.financeApp,
        approved: data.lead.credit_approved,
        signed: data.lead.signed,
        pickUpSet: data.lead.pickUpSet,
        demoed: data.lead.demoed,
        delivered: data.lead.delivered,
        lastContact: data.lead.lastContact,
        status: data.lead.status,
        customerState: data.lead.customerState,
        result: data.lead.result,
        timesContacted: data.lead.timesContacted,
        nextAppointment: data.lead.nextAppointment,
        followUpDay: data.lead.followUpDay,
        deliveredDate: data.lead.delivered_date,
        notes: data.lead.notes,
        visits: data.lead.visits,
        progress: data.lead.progress,
        metSalesperson: data.lead.metSalesperson,
        metFinance: data.lead.metFinance,
        financeApplication: data.lead.financeApplication,
        pickUpDate: data.lead.delivery_date,
        pickUpTime: data.lead.pickUpTime,
        depositTakenDate: data.lead.depositTakenDate,
        docsSigned: data.lead.docsSigned,
        tradeRepairs: data.lead.tradeRepairs,
        seenTrade: data.lead.seenTrade,
        lastNote: data.lead.lastNote,
        dLCopy: data.lead.dLCopy,
        insCopy: data.lead.insCopy,
        testDrForm: data.lead.testDrForm,
        voidChq: data.lead.voidChq,
        loanOther: data.lead.loanOther,
        signBill: data.lead.signBill,
        ucda: data.lead.ucda,
        tradeInsp: data.lead.tradeInsp,
        customerWS: data.lead.customerWS,
        otherDocs: data.lead.otherDocs,
        urgentFinanceNote: data.lead.urgentFinanceNote,
        funded: data.lead.funded,
        countsInPerson: data.lead.countsInPerson,
        countsPhone: data.lead.countsPhone,
        countsSMS: data.lead.countsSMS,
        countsOther: data.lead.countsOther,
        countsEmail: data.lead.countsEmail,
        leadSource: data.lead.leadSource,
    }
    function LeadData() {
        return {
            financeId: '',

            account_id: faker.finance.amount(),
            customer_id: faker.finance.amount(),
            source_id: faker.finance.amount(),
            provider_id: faker.finance.amount(),
            phone_appointment_date: faker.date.future(),
            available_date: faker.date.future(),
            be_back_date: faker.date.future(),
            birth_date: faker.date.past(),
            call_date: faker.date.past(),
            created_at: faker.date.past(),
            csi_date: faker.date.future(),
            delivered_date: faker.date.future(),
            deliverable_date: faker.date.future(),
            delivery_date: faker.date.future(),
            home_presented_date: faker.date.future(),
            presented_date: faker.date.future(),
            promised_date: faker.date.future(),
            refinanced_date: faker.date.future(),
            road_test_date: faker.date.future(),
            home_road_test_date: faker.date.future(),
            sale_date: faker.date.future(),
            paperwork_date: faker.date.future(),
            unsubscribe_all_date: faker.date.future(),
            unsubscribe_call_date: faker.date.future(),
            unsubscribe_email_date: faker.date.future(),
            unsubscribe_sms_date: faker.date.future(),
            address_line1: faker.address.streetAddress(),
            address_line2: faker.address.secondaryAddress(),
            business: faker.company.name(),
            business_name: faker.company.name(),
            city: faker.address.city(),
            civility: faker.name.prefix(),
            country: faker.address.country(),
            created_method: faker.lorem.word(),
            credit_approved: faker.finance.creditCardNumber(),
            dealer_tour: faker.lorem.word(),
            division: faker.lorem.word(),
            financial_institution: faker.finance.creditCardIssuer(),
            form: faker.lorem.word(),
            funded: faker.finance.amount(),
            gender: faker.name.gender(),
            inspected: faker.lorem.word(),
            keyword: faker.lorem.word(),
            locale: faker.lorem.word(),
            navigation_history: faker.internet.url(),
            postal_code: faker.address.zipCode(),
            provider: faker.company.name(),
            province: faker.address.state(),
            qualification: faker.lorem.word(),
            rating: faker.lorem.word(),
            referrer: faker.internet.url(),
            result: faker.lorem.word(),
            search_term: faker.lorem.word(),
            second_contact: faker.lorem.word(),
            second_contact_civility: faker.name.prefix(),
            segment: faker.lorem.word(),
            source: faker.internet.url(),
            status: faker.lorem.word(),
            type: faker.lorem.word(),
            walk_around: faker.lorem.word(),
            comment: faker.lorem.sentence(),
            first_name: faker.name.firstName(),
            last_name: faker.name.lastName(),
            end_service_date: faker.date.future(),
            last_visit_date: faker.date.past(),
            next_visit_date: faker.date.future(),
            open_work_order_date: faker.date.future(),
            planned_pick_up_date: faker.date.future(),
            repair_date: faker.date.future(),
            code: faker.random.alphaNumeric(5),
            invoiced: faker.finance.amount(),
            loyalty: faker.lorem.word(),
            odometer_last_visit: faker.lorem.word(),
            prepaid: faker.finance.amount(),
            prepared: faker.lorem.word(),
            reached_client: faker.lorem.word(),
            service_cleaned: faker.lorem.word(),
            service_interval_km: faker.lorem.word(),
            service_monthly_km: faker.lorem.word(),
            storage: faker.lorem.word(),
            work_order: faker.random.alphaNumeric(10),
            advisor: {
                first_name: faker.name.firstName(),
                last_name: faker.name.lastName()
            },
            emails: [
                {
                    type: "home",
                    address: faker.internet.email()
                }
            ],
            phones: [
                {
                    number: faker.lorem.word(),
                    extension: faker.finance.amount(),
                    type: "mobile"
                }
            ],
            vehicles: [
                {
                    make: faker.vehicle.manufacturer(),
                    model: faker.vehicle.model(),
                    year: faker.date.past().getFullYear(),
                    type: "wanted"
                },
                {
                    make: faker.vehicle.manufacturer(),
                    model: faker.vehicle.model(),
                    year: faker.date.past().getFullYear(),
                    type: "exchange"
                }
            ]


        }

    }
    // let data = faker.helpers.multiple(LeadData, { count: 5 });
    const notes = {
        financeId: data.notes.financeId,
        slug: data.notes.slug,
        customContent: data.notes.content,
        urgentFinanceNote: data.notes.urgentFinanceNote,
        author: data.notes.user_id,
        isPublished: data.notes.isPublished,
        customerId: data.notes.lead_id,
        dept: data.notes.dept,
        // new
        file_url: "https://www.example.com/file.pdf",
        parent_id: 12345,

    }
    const appointments = {
        title: data.event.title,
        start: data.event.start_at,
        end: data.event.end_at,
        contactMethod: data.event.contactMethod,
        completed: data.event.completed_at,
        apptStatus: data.event.apptStatus,
        apptType: data.event.apptType,
        note: data.event.note,
        unit: data.lead.vehicles.model,
        brand: data.lead.vehicles.brand,
        firstName: data.lead.first_name,
        lastName: data.lead.last_name,
        email: data.lead.emails.address,
        phone: data.lead.phones.number,
        address: data.lead.address_line1,
        financeId: data.event.lead_id,
        userId: data.event.userId,
        description: data.event.description,
        userName: data.lead.advisor.first_name + ' ' + data.lead.advisor.last_name,
        title: data.event.title,
        attachments: data.event.attachments,
        direction: data.event.direction,
        resultOfcall: data.event.resultOfcall,
        // new fields
        no_show: "2020-06-04T17:15:00-04:00",
        priority: "2020-06-04T17:15:00-04:00",
        completed_at: "2020-06-04T17:15:00-04:00",
        canceled: "2020-06-04T17:15:00-04:00",

    }
    const comViews = {
        financeId: data.lead.communication.financeId,
        userId: data.lead.communication.user_id,
        title: data.lead.communication.title,
        content: data.lead.communication.description,
        date: data.lead.communication.date,
        userName: data.lead.communication.userName,
        type: data.lead.communication.type,
        direction: data.lead.communication.direction,
        subject: data.lead.communication.subject,
        result: data.lead.communication.result,
        // nwe
        description: "This is a test communication", // formPayload.description,
        executed_at: 'todaysdate', // formPayload.executed_at,
        executed_by: 5001, // formPayload.executed_by,
        call_duration: 25, // formPayload.call_duration,
        call_status: "answered",// formPayload.call_status, // answered, attempted,  calling, error, interrupted, pending or unanswered
        call_phone: "+15144321214",// formPayload.call_phone,
        email_subject: "This is a test email",// formPayload.email_subject,
        email_body: "This is a test email",// formPayload.email_body,
        email_user: "John Doe",// formPayload.email_user,
        attribute: 'description',// formPayload.attribute,
        url: 'https://www.youtube.com/watch?v=6v2L2UGZJAM',// formPayload.url,
    }
    const clientFiles = {
        financeId: data.lead.financeId,
        userId: data.lead.userId,
        firstName: data.lead.firstName,
        lastName: data.lead.lastName,
        name: data.lead.name,
        email: data.lead.email,
        phone: data.lead.phone,
        address: data.lead.address,
        city: data.lead.city,
        postal: data.lead.postal,
        province: data.lead.province,
        dl: data.lead.dl,
        typeOfContact: data.lead.typeOfContact,
        timeToContact: data.lead.timeToContact,
    }
    return json({ data })
}

export const loader: ActionFunction = async ({ request }: DataFunctionArgs) => {
    //  const navigation = useNavigation();
    //  const isSubmitting = navigation.state === "submitting";
    let intent = 'done'// = formPayload.intent

    let eventId; // = formData.eventId
    let leadId; // = formData.leadId
    let comId // formData.comId
    let emailId // formData.emailId
    let phoneId // formData.phoneId
    let taskId // formData.taskId
    let vehicleId // formData.vehicleId
    let userId // formData.userId
    let data = {}
    let method = 'GET'

    if (intent === 'test') {
        const endpoint = '/account'
        return await ActivixCall(endpoint, method, data);
    }
    // account
    if (intent === 'getUserAccount') {
        const endpoint = '/account'
        return await ActivixCall(endpoint, method, data);
    }
    // lead
    if (intent === 'getLeadsList') {
        const endpoint = '/leads'
        return await ActivixCall(endpoint, method, data);
    }
    if (intent === 'getSingleLead') {
        const endpoint = `/leads/${leadId}`
        return await ActivixCall(endpoint, method, data);
    }
    if (intent === 'createLead') {
        const data = {
            "account_id": 5001, // formData.account_id,
            "customer_id": 5001, // formData.customer_id,
            "source_id": 5001, // formData.source_id,
            "provider_id": 5001, // formData.provider_id,
            "phone_appointment_date": "John", // formData.phone_appointment_date,
            "available_date": "John", // formData.available_date,
            "be_back_date": "John", // formData.be_back_date,
            "birth_date": "John", // formData.birth_date,
            "call_date": "John", // formData.call_date,
            "created_at": "John", // formData.created_at,
            "csi_date": "John", // formData.csi_date,
            "delivered_date": "John", // formData.delivered_date,
            "deliverable_date": "John", // formData.deliverable_date,
            "delivery_date": "John", // formData.delivery_date,
            "home_presented_date": "John", // formData.home_presented_date,
            "presented_date": "John", // formData.presented_date,
            "promised_date": "John", // formData.promised_date,
            "refinanced_date": "John", // formData.refinanced_date,
            "road_test_date": "John", // formData.road_test_date,
            "home_road_test_date": "John", // formData.home_road_test_date,
            "sale_date": "John", // formData.sale_date,
            "paperwork_date": "John", // formData.paperwork_date,
            "unsubscribe_all_date": "John", // formData.unsubscribe_all_date,
            "unsubscribe_call_date": "John", // formData.unsubscribe_call_date,
            "unsubscribe_email_date": "John", // formData.unsubscribe_email_date,
            "unsubscribe_sms_date": "John", // formData.unsubscribe_sms_date,
            "address_line1": "John", // formData.address_line1,
            "address_line2": "John", // formData.address_line2,
            "business": "John", // formData.business,
            "business_name": "John", // formData.business_name,
            "city": "John", // formData.city,
            "civility": "John", // formData.civility,
            "country": "John", // formData.country,
            "created_method": "John", // formData.created_method,
            "credit_approved": "John", // formData.credit_approved,
            "dealer_tour": "John", // formData.dealer_tour,
            "division": "John", // formData.division,
            "financial_institution": "John", // formData.financial_institution,
            "form": "John", // formData.form,
            "funded": "John", // formData.funded,
            "gender": "John", // formData.gender,
            "inspected": "John", // formData.inspected,
            "keyword": "John", // formData.keyword,
            "locale": "John", // formData.locale,
            "navigation_history": "John", // formData.navigation_history,
            "postal_code": "John", // formData.postal_code,
            "provider": "John", // formData.provider,
            "province": "John", // formData.province,
            "qualification": "John", // formData.qualification,
            "rating": "John", // formData.rating,
            "referrer": "John", // formData.referrer,
            "result": "John", // formData.result,
            "search_term": "John", // formData.search_term,
            "second_contact": "John", // formData.second_contact,
            "second_contact_civility": "John", // formData.second_contact_civility,
            "segment": "John", // formData.segment,
            "source": "John", // formData.source,
            "status": "John", // formData.status,
            "type": "John", // formData.type,
            "walk_around": "John", // formData.walk_around,
            "comment": "John", // formData.comment,
            "first_name": "John", // formData.first_name,
            "last_name": "Doe", // formData.last_name,
            // service
            "end_service_date": "email",// formData.end_service_date,
            "last_visit_date": "email",// formData.last_visit_date,
            "next_visit_date": "email",// formData.next_visit_date,
            "open_work_order_date": "email",// formData.open_work_order_date,
            "planned_pick_up_date": "email",// formData.planned_pick_up_date,
            "repair_date": "email",// formData.repair_date,
            "code": "email",// formData.code,
            "invoiced": "email",// formData.invoiced,
            "loyalty": "email",// formData.loyalty,
            "odometer_last_visit": "email",// formData.odometer_last_visit,
            "prepaid": "email",// formData.prepaid,
            "prepared": "email",// formData.prepared,
            "reached_client": "email",// formData.reached_client,
            "service_cleaned": "email",// formData.service_cleaned,
            "service_interval_km": "email",// formData.service_interval_km,
            "service_monthly_km": "email",// formData.service_monthly_km,
            "storage": "email",// formData.storage,
            "work_order": "email",// formData.work_order,
            // nested
            "advisor": {
                "first_name": "Jane", // formData.first_name,
                "last_name": "Smith" // formData.last_name,
            },
            "emails": [
                {
                    "type": "home", // formData.type,
                    "address": "hello@example.com" // formData.address,
                }
            ],
            "phones": [
                {
                    "number": "+15144321214", // formData.number,
                    "extension": 12345, // formData.extension,
                    "type": "mobile" // formData.type,
                }
            ],
            "vehicles": [
                {
                    "make": "Aston Martin", // formData.make,
                    "model": "DB11", // formData.model,
                    "year": 2018, // formData.year,
                    "type": "wanted" // formData.type,
                },
                {
                    "make": "DMC", // formData.make,
                    "model": "DeLorean", // formData.model,
                    "year": 1981, // formData.year,
                    "type": "exchange" // formData.type,
                }
            ]
        }
        method = 'POST'
        const endpoint = `/leads`
        return await ActivixCall(endpoint, method, data);
    }
    if (intent === 'updateLead') {
        const data = {
            "id": 1234567,
            "first_name": "John",
            "last_name": "Doe",
            "advisor": {
                "first_name": "John",
                "last_name": "Doe"
            }
        }
        method = 'PUT'
        const endpoint = `/leads/${leadId}`
        return await ActivixCall(endpoint, method, data);
    }
    if (intent === 'screenPop') {
        const data = {
            "lead_id": 5001,
            "lead_did": "Doe",
            "user_id": 5002,
            "user_did": "email",
        }
        method = 'POST'
        const endpoint = `/screenpop`
        return await ActivixCall(endpoint, method, data);
    }
    //events
    if (intent === 'createEvent') {
        const data = {
            "lead_id": 33875623,
            "owner": {
                "id": 87
            },
            "title": "Appointment for John",
            "type": "appointment",
            "start_at": formattedDate,
            "end_at": formattedDate,
            "completed_at": "2020-06-04T17:15:00-04:00",
            "canceled": "2020-06-04T17:15:00-04:00",
            "completed": "2020-06-04T17:15:00-04:00",
            "confirmed": "2020-06-04T17:15:00-04:00",
            "description": "2020-06-04T17:15:00-04:00",
            "no_show": "2020-06-04T17:15:00-04:00",
            "priority": "2020-06-04T17:15:00-04:00",
        }
        method = 'POST'
        const endpoint = `/events`
        return await ActivixCall(endpoint, method, data);
    }
    if (intent === 'getEventsList') {
        const endpoint = `/events`
        return await ActivixCall(endpoint, method, data);
    }
    if (intent === 'retrieveEvent') {
        const endpoint = `/events/${eventId}`
        return await ActivixCall(endpoint, method, data);
    }
    if (intent === 'updateEvent') {
        const data = {
            "title": "Appointment for John",
            "completed_at": "2020-06-04T17:15:00-04:00"
        }
        method = 'PUT'
        const endpoint = `/events/${eventId}`
        return await ActivixCall(endpoint, method, data);
    }
    // communications
    if (intent === 'createCommunication') {
        const data = {
            "lead_id": leadId,
            "user_id": userId,
            "method": "phone", // formPayload.method, // phone, email or sms.
            "type": "outgoing", // formPayload.type, //outgoing or incoming.
            "description": "This is a test communication", // formPayload.description,
            "executed_at": formattedDate, // formPayload.executed_at,
            "executed_by": 5001, // formPayload.executed_by,
            // phone
            "call_duration": 25, // formPayload.call_duration,
            "call_phone": "+15144321214",// formPayload.call_phone,
            "call_status": "answered",// formPayload.call_status, // answered, attempted,  calling, error, interrupted, pending or unanswered
            // emaail
            "email_subject": "This is a test email",// formPayload.email_subject,
            "email_body": "This is a test email",// formPayload.email_body,
            "email_user": "John Doe",// formPayload.email_user,
            // video
            "attribute": 'description',// formPayload.attribute,
            "url": 'https://www.youtube.com/watch?v=6v2L2UGZJAM',// formPayload.url,
        }
        method = 'POST'
        const endpoint = `/communications`
        return await ActivixCall(endpoint, method, data);
    }
    if (intent === 'updateCommunication') {
        const data = {
            "call_duration": 25,
            "call_status": "answered",
        }
        method = 'PUT'
        const endpoint = `/communications/${comId}`
        return await ActivixCall(endpoint, method, data);
    }
    if (intent === 'uploadRecording') {
        const data = {
            "recording": 'text.mp3',
        }
        method = 'POST'
        const endpoint = `/communications/${comId}`
        return await ActivixCall(endpoint, method, data);
    }
    // email
    if (intent === 'createCommunication') {
        const data = {
            "lead_id": leadId,
            "address": "test@activix.ca",
            "type": "work", // home or work.
            "valid": true,
        }
        method = 'POST'
        const endpoint = `/lead-emails`
        return await ActivixCall(endpoint, method, data);
    }
    if (intent === 'updateEmail') {
        const data = {
            "address": "test@activix.ca",
            "type": "work", // home or work.
        }
        method = 'PUT'
        const endpoint = `/lead-emails/${emailId}`
        return await ActivixCall(endpoint, method, data);
    }
    // notes
    if (intent === 'createEvent') {
        const data = {
            "content": "Customer requested a call next week",
            "file_url": "https://www.example.com/file.pdf",
            "parent_id": 12345,
            "lead_id": 12345,
            "user_id": 12345,
        }
        method = 'POST'
        const endpoint = `/leads/${leadId}/notes`
        return await ActivixCall(endpoint, method, data);
    }
    if (intent === 'updateEvent') {
        const data = {
            "content": "Customer requested a call next week",
            "file_url": "https://www.example.com/file.pdf",
            "parent_id": 12345,
        }
        method = 'PUT'
        const endpoint = `/leads/${leadId}/notes`
        return await ActivixCall(endpoint, method, data);
    }
    // phone
    if (intent === 'createPhone') {
        const data = {
            "lead_id": 3387562,
            "number": "+16136136134",
            "type": "home",
            "extension": "home",
            "valid": "home",
        }
        method = 'POST'
        const endpoint = `/lead-phones`
        return await ActivixCall(endpoint, method, data);
    }
    if (intent === 'updatePhone') {
        const data = {
            "number": "+16136136134",
            "type": "home",
        }
        method = 'POST'
        const endpoint = `/lead-phones/${phoneId}`
        return await ActivixCall(endpoint, method, data);
    }
    // search
    if (intent === 'leadsSearch') {
        const searchTerm = 'john_doe'
        const endpoint = `/leads/search?query=${searchTerm}`
        return await ActivixCall(endpoint, method, data);
    }
    // task
    if (intent === 'createTask') {
        const data = {
            "lead_id": 3387562,
            "owner": {
                "id": 87,
            },
            "title": "Call for John",
            "type": "call",
            "date": "2020-06-04T15:15:00-04:00",
            "completed": "2020-06-04T15:15:00-04:00",
            "description": "2020-06-04T15:15:00-04:00",
            "priority": "2020-06-04T15:15:00-04:00",
        }
        method = 'POST'
        const endpoint = `/tasks`
        return await ActivixCall(endpoint, method, data);
    }
    if (intent === 'retriveTask') {
        const endpoint = `/tasks/${taskId}`
        return await ActivixCall(endpoint, method, data);
    }
    if (intent === 'updateTask') {
        const data = {
            "lead_id": 3387562,
            "owner": {
                "id": 87,
            },
            "title": "Updated Call for John",
            "type": "call",
            "date": "2020-06-04T15:15:00-04:00",
        }
        method = 'PUT'
        const endpoint = `/tasks/${taskId}`
        return await ActivixCall(endpoint, method, data);
    }
    if (intent === 'listAllTasks') {
        const endpoint = `/tasks`
        return await ActivixCall(endpoint, method, data);
    }
    // vehicle
    if (intent === 'createVehicle') {
        const data = {
            "lead_id": 3454440, // formData.lead_id,
            "type": "wanted", // formData.type,
            "vin": "VIN333", // formData.vin,
            "end_contract_date": "VIN333", // formData.end_contract_date,
            "end_warranty_date": "VIN333", // formData.end_warranty_date,
            "purchase_date": "VIN333", // formData.purchase_date,
            "recorded_date": "VIN333", // formData.recorded_date,
            "sold_date": "VIN333", // formData.sold_date,
            "accessories": "VIN333", // formData.accessories,
            "actual_value": "VIN333", // formData.actual_value,
            "allowed_odometer": "VIN333", // formData.allowed_odometer,
            "balance": "VIN333", // formData.balance,
            "cash_down": "VIN333", // formData.cash_down,
            "category": "VIN333", // formData.category,
            "category_rv": "VIN333", // formData.category_rv,
            "certified": "VIN333", // formData.certified,
            "color_exterior": "VIN333", // formData.color_exterior,
            "color_interior": "VIN333", // formData.color_interior,
            "condition": "VIN333", // formData.condition,
            "driving_wheels": "VIN333", // formData.driving_wheels,
            "engine": "VIN333", // formData.engine,
            "extended_warranty": "VIN333", // formData.extended_warranty,
            "fuel": "VIN333", // formData.fuel,
            "license_plate": "VIN333", // formData.license_plate,
            "make": "VIN333", // formData.make,
            "modality": "VIN333", // formData.modality,
            "odometer": "VIN333", // formData.odometer,
            "offer_number": "VIN333", // formData.offer_number,
            "option": "VIN333", // formData.option,
            "order_number": "VIN333", // formData.order_number,
            "payment": "VIN333", // formData.payment,
            "payment_frequency": "VIN333", // formData.payment_frequency,
            "preparation": "VIN333", // formData.preparation,
            "price": "VIN333", // formData.price,
            "profit": "VIN333", // formData.profit,
            "rate": "VIN333", // formData.rate,
            "recall": "VIN333", // formData.recall,
            "residual": "VIN333", // formData.residual,
            "security_deposit": "VIN333", // formData.security_deposit,
            "sleeping": "VIN333", // formData.sleeping,
            "sold": "VIN333", // formData.sold,
            "sold_by": "VIN333", // formData.sold_by,
            "stock": "VIN333", // formData.stock,
            "stock_state": "VIN333", // formData.stock_state,
            "transmission": "VIN333", // formData.transmission,
            "value": "VIN333", // formData.value,
            "warranty": "VIN333", // formData.warranty,
            "weight": "VIN333", // formData.weight,
            "year": "VIN333", // formData.year,
            // wanted veh // formData./,
            "budget_max": "VIN333", // formData.budget_max,
            "budget_min": "VIN333", // formData.budget_min,
            "length_max": "VIN333", // formData.length_max,
            "length_min": "VIN333", // formData.length_min,
            "year_max": "VIN333", // formData.year_max,
            "year_min": "VIN333", // formData.year_min,

        }
        method = 'POST'
        const endpoint = `/lead-vehicles`
        return await ActivixCall(endpoint, method, data);
    }
    if (intent === 'updateVehichle') {
        const data = {
            "vin": "VIN444",
        }
        method = 'PUT'
        const endpoint = `/lead-vehicles/${vehicleId}`
        return await ActivixCall(endpoint, method, data);
    }
    console.log('hit end')
    return json('hit end')
}


